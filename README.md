# Installation
I'm keeping this extremely short right now because it's barely working:

1. Install Musicbee
2. Install the beekeeper plugin (which provides the API that this project uses)
3. Copy the files from this project into the Musicbee/AppData/files/ directory

You're gonna run into CORS issues, so either use a proxy (cors-proxy, caddy etc) or install NGINX on your Musicbee machine and configure it like this:

```
        server {
            listen 80;
            server_name musicbee-player.local;  # or whatever the hoe name or IP is

            location / {
                proxy_pass http://localhost:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

                # Add CORS headers
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            }
        }
```

Then hit this URL in your browser: http://musicbee-player.local/file/player.html
