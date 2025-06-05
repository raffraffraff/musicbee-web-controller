# Installation
I'm keeping this extremely short right now because it's barely working:

1. Install Musicbee
2. Install the beekeeper plugin (which provides the API that this project uses)
3. Install a web server (eg: nginx)
4. Deploy these files (eg: /var/www/musicbee-web) and update the hostname in beekeeper.js

# Example nginx configuration
This assumes that the MusicBee player and beekeeper plugin are running on localhost:8080

```
server {
    listen 80;
    server_name musicbee.local;

    # Serve the website
    root /var/www/beekeeper-ui;
    index player.html;

    # Route API requests to the backend service
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }
}
```

Then hit this URL in your browser: http://musicbee.local/file/player.html
