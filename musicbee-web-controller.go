package main

import (
	"bufio"
	"bytes"
	"embed"
	"encoding/json"
	"flag"
	"io"
	"io/fs"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"
)

//go:embed web/*
var embeddedWebFS embed.FS

var artworkCache sync.Map // map[fileUrl]string (base64 image)

func readConfig(filename string) map[string]string {
	config := make(map[string]string)
	file, err := os.Open(filename)
	if err != nil {
		return config // silently ignore if not found
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if i := strings.Index(line, "="); i > 0 {
			key := strings.TrimSpace(line[:i])
			val := strings.TrimSpace(line[i+1:])
			config[key] = val
		}
	}
	return config
}

// Path for persistent cache file
var artworkCacheFile = "artwork-cache.json"
var artworkCacheEnabled = "true"

// Save artworkCache to disk
func saveArtworkCache() {
	cache := make(map[string]string)
	artworkCache.Range(func(key, value interface{}) bool {
		k, ok1 := key.(string)
		v, ok2 := value.(string)
		if ok1 && ok2 {
			cache[k] = v
		}
		return true
	})
	f, err := os.Create(artworkCacheFile)
	if err != nil {
		log.Printf("Failed to save artwork cache: %v", err)
		return
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	if err := enc.Encode(cache); err != nil {
		log.Printf("Failed to encode artwork cache: %v", err)
	}
}

// Load artworkCache from disk
func loadArtworkCache() {
	f, err := os.Open(artworkCacheFile)
	if err != nil {
		return // no cache file
	}
	defer f.Close()
	cache := make(map[string]string)
	dec := json.NewDecoder(f)
	if err := dec.Decode(&cache); err != nil {
		log.Printf("Failed to decode artwork cache: %v", err)
		return
	}
	for k, v := range cache {
		artworkCache.Store(k, v)
	}
	log.Printf("Loaded %d artwork cache entries from disk", len(cache))
}

func main() {
	configFile := flag.String("config", "", "Config file path")
	flag.Parse()

	config := make(map[string]string)
	if *configFile != "" {
		config = readConfig(*configFile)
	} else {
		if _, err := os.Stat("settings.conf"); err == nil {
			config = readConfig("settings.conf")
		}
	}

	backendUrl := "http://localhost:8080" // Default backend URL
	if v, ok := config["beekeeper"]; ok && v != "" {
		backendUrl = v
	}

	if v, ok := config["artwork-cache-file"]; ok && v != "" {
		artworkCacheFile = v
	}

	if v, ok := config["artwork-cache-enabled"]; ok && v != "" {
		artworkCacheEnabled = v
	}

	backendURL, err := url.Parse(backendUrl)
	if err != nil {
		log.Fatalf("Invalid backend URL: %v", err)
	}
	// Reverse proxy with path rewriting
	proxy := httputil.NewSingleHostReverseProxy(backendURL)
	proxy.Director = func(req *http.Request) {
		req.URL.Scheme = backendURL.Scheme
		req.URL.Host = backendURL.Host
		req.URL.Path = strings.TrimPrefix(req.URL.Path, "/api")
		req.URL.RawQuery = req.URL.RawQuery
		req.Header.Set("X-Forwarded-Host", req.Host)
		req.Header.Set("X-Origin-Host", backendURL.Host)
	}

	// Intercept /api/Library_GetArtwork for caching
	http.HandleFunc("/api/Library_GetArtwork", func(w http.ResponseWriter, r *http.Request) {
		//log.Println("/api/Library_GetArtwork handler called")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("Method not allowed"))
			return
		}
		body, err := io.ReadAll(r.Body)
		if err != nil {
			log.Println("Failed to read request body")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Failed to read request body"))
			return
		}
		defer r.Body.Close()
		var reqData struct {
			SourceFileUrl string `json:"sourceFileUrl"`
			CacheKey      string `json:"cacheKey"`
		}
		err = json.Unmarshal(body, &reqData)
		if err != nil || reqData.SourceFileUrl == "" {
			log.Println("Missing or invalid sourceFileUrl in body")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Missing or invalid sourceFileUrl in body"))
			return
		}

		fileUrl := reqData.SourceFileUrl
		cacheKey := reqData.CacheKey

		if val, ok := artworkCache.Load(cacheKey); ok {
			log.Printf("Cache HIT for cacheKey: %s, fileUrl: %s\n", cacheKey, fileUrl)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(val)
			return
		} else {
			log.Printf("Cache MISS for cacheKey: %s, fileUrl: %s\n", cacheKey, fileUrl)
		}

		// Not cached: proxy to backend and cache result
		//log.Printf("Forwarding request to backend for fileUrl: %s\n", fileUrl)
		backendReq, err := http.NewRequest(http.MethodPost, backendUrl+"/Library_GetArtwork", bytes.NewReader(body))
		if err != nil {
			log.Printf("Failed to create backend request: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed to create backend request"))
			return
		}
		// Set Content-Type to application/x-www-form-urlencoded to match curl
		backendReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		resp, err := http.DefaultClient.Do(backendReq)
		if err != nil {
			log.Printf("Backend error: %v\n", err)
			w.WriteHeader(http.StatusBadGateway)
			w.Write([]byte("Backend error"))
			return
		}
		defer resp.Body.Close()
		respBody, err := io.ReadAll(resp.Body)
		log.Printf("Backend response status: %d\n", resp.StatusCode)
		w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
		w.WriteHeader(resp.StatusCode)
		if err == nil && resp.StatusCode == 200 {
			var img string
			if err := json.Unmarshal(respBody, &img); err == nil {
				if len(img) < 9000 {
					log.Printf("No artwork found for fileUrl: %s, refusing to cache empty response for cacheKey %s\n", fileUrl, cacheKey)
				} else {
					artworkCache.Store(cacheKey, img)
					log.Printf("Cached artwork for cacheKey: %s, fileUrl: %s\n", cacheKey, fileUrl)
				}
			} else {
				log.Printf("Failed to unmarshal backend response for fileUrl: %s\n", fileUrl)
			}
		} else if err != nil {
			log.Printf("Failed to read backend response for fileUrl: %s: %v\n", fileUrl, err)
		}
		w.Write(respBody)
	})

	// Handle /api/* with reverse proxy + CORS
	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		// CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		proxy.ServeHTTP(w, r)
	})

	// Create a filesystem for the embedded web files
	webFS, err := fs.Sub(embeddedWebFS, "web")
	if err != nil {
		log.Fatalf("Failed to create sub FS: %v", err)
	}
	fs := http.FileServer(http.FS(webFS))

	// Serve static files from embedded filesystem, default to player.html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			r.URL.Path = "/player.html"
		}
		fs.ServeHTTP(w, r)
	})

	listenPort := "80"
	if v, ok := config["port"]; ok && v != "" {
		listenPort = v
	}

	log.Println("Listening on port " + listenPort)

	// Load cache from disk
	if artworkCacheEnabled == "true" {
		log.Println("Loading artwork cache from " + artworkCacheFile)
		loadArtworkCache()
	} else {
		log.Println("Not loading artwork from " + artworkCacheFile + " because artwork-cache-enabled setting is " + artworkCacheEnabled)
	}

	// Save cache on exit (SIGINT/SIGTERM)
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		if artworkCacheEnabled != "true" {
			log.Println("Not saving artwork cache to " + artworkCacheFile + " because artwork-cache-enabled settings is " + artworkCacheEnabled)
			os.Exit(0)
		}
		// Save the cache to disk
		log.Println("Saving artwork cache to disk...")
		saveArtworkCache()
		os.Exit(0)
	}()

	err = http.ListenAndServe(":"+listenPort, nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
