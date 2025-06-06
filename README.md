# About
This is a simple web controller for MusicBee. Currently it can fetch album art, artist, title, rating and Last.FM loved status. I'm adding volume control and some basic tag editing. It requires the Beekeeper MusicBee plugin which you can download [here](http://grismar.net/beekeeper/plugin.zip). Unzip the plugin into the MusicBee 'Plugins' directory and restart MusicBee. For full functionality, change the configuration of the Beekeeper plugin to allow database updates (this will let you change the rating and love / unlove tracks).

![screenshot](https://github.com/raffraffraff/musicbee-web-controller/blob/main/screenshot.jpg?raw=true)

# Installation
I'm keeping this extremely short right now because it's barely working:

1. Install Musicbee
2. Install the [beekeeper plugin](http://grismar.net/beekeeper/plugin.zip) by unzipping to the Musicbee 'Plugins' directory
3. Run MusicBee, and under Edit > Preferences > Plugins > Beekeeper...
   - Set the port to 8080
   - Ensure that Service and Serving shared are checked
   - Uncheck 'Don't allow web API calls to modify MusicBee database (read only)
4. Compile server.go and run it on the same computer that runs MusicBee
   - You'll need Go installed, just run `go build server.go`
   - The web assets are embedded into the server executable, so you just need one file
   - You may need extra privileges to run it on port 80 (eg: on Linux I run `sudo ./server`)

That's it! Open your browser and enter the hostname or IP address of the MusicBee computer and you can control the player from your phone or desktop browser.
