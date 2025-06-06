package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

//go:embed web/*
var embeddedWebFS embed.FS

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
