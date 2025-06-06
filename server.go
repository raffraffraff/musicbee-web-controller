package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"io"
	"io/fs"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"sync"
)

//go:embed web/*
var embeddedWebFS embed.FS

var artworkCache sync.Map // map[fileUrl]string (base64 image)

func main() {
	// Reverse proxy to backend
	backendURL, err := url.Parse("http://localhost:8080")
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
		}
		err = json.Unmarshal(body, &reqData)
		if err != nil || reqData.SourceFileUrl == "" {
			log.Println("Missing or invalid sourceFileUrl in body")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Missing or invalid sourceFileUrl in body"))
			return
		}
		fileUrl := reqData.SourceFileUrl

		if val, ok := artworkCache.Load(fileUrl); ok {
			log.Printf("Cache HIT for fileUrl: %s\n", fileUrl)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(val)
			return
		} else {
			log.Printf("Cache MISS for fileUrl: %s\n", fileUrl)
		}

		// Not cached: proxy to backend and cache result
		//log.Printf("Forwarding request to backend for fileUrl: %s\n", fileUrl)
		backendReq, err := http.NewRequest(http.MethodPost, "http://localhost:8080/Library_GetArtwork", bytes.NewReader(body))
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
		//log.Printf("Backend response status: %d\n", resp.StatusCode)
		w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
		w.WriteHeader(resp.StatusCode)
		if err == nil && resp.StatusCode == 200 {
			var img string
			if err := json.Unmarshal(respBody, &img); err == nil {
				artworkCache.Store(fileUrl, img)
				log.Printf("Cached artwork for fileUrl: %s\n", fileUrl)
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
			http.ServeFile(w, r, "web/player.html")
			return
		}
		fs.ServeHTTP(w, r)
	})

	log.Println("Listening on :80")
	err = http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
