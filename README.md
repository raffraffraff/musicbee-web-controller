# Features

This is a very a simple web-based controller for MusicBee. You can see/update track ratings and Last.FM 'love' status. It can fetch album art and track information. Album art is cached in two places: in the browser (reducing calls to the backend), and at the backend (further reducing calls to MusicBee). 

This remote control requires the Beekeeper MusicBee plugin, which you can download [here](http://grismar.net/beekeeper/plugin.zip). 

# Planned features
* Volume control
* Show previous / next tracks on the main screen
  * Number of previous / next should be configurable (eventually)
* Update stupid 'player' and 'other view' buttons
  * Other View should be "Now Playing"
  * Hide a button when you are already in that view
* Implement the "Now Playing" view
  * Show the entire Now Playing list with a scroll bar
  * For now, artist/title tags sufficient
  * Implement "play" button beside each track to jump to it
  * Implement "trashcan" button beside each track to remove it from the Now Playing list
* Add "Search" view
  * Search MusicBee library for any string
  * Implement "queue next" and "queue last" buttons beside each track
* Add "Playlists" view
  * Show all playlists
  * Implement "play", "queue next" and "queue last" buttons beside each playlist
* Fetch missing art online (Note: implement on the backend? hard to write back since it may be missing 'per track' and not 'per album')
* More configuration options, eg:
  * Disable album art (not everybody needs it!)

![screenshot](https://github.com/raffraffraff/musicbee-web-controller/blob/main/screenshot.jpg?raw=true)

# Installation
If you have go installed, you should be able to do this:
```
go install github.com/raffraffraff/musicbee-web-controller@latest
```

If you're running on Linux (since MusicBee works pretty well in wine) you can grant the program the right to use port 80. This command requires `setcap` which is part of the libcap package, but the exact name differs from one distro to the next. Anyway, the command is:

```
sudo setcap CAP_NET_BIND_SERVICE=+eip ~/go/bin/musicbee-web-controller
```

If you want to build and install yourself:
- `git clone git@github.com:raffraffraff/musicbee-web-controller.git`
- `go build musicbee-web-controller.go`

# Configuring MusicBee
After you install MusicBee you should download the [beekeeper plugin](http://grismar.net/beekeeper/plugin.zip) by unzipping it into Musicbee 'Plugins' directory. Launch MusicBee and under Edit > Preferences > Plugins > Beekeeper...
 - Set the port to 8080
 - Ensure that Service and Serving shared are checked
 - Uncheck 'Don't allow web API calls to modify MusicBee database (read only)

That's it! Open your browser and enter the hostname or IP address of the computer that runs MusicBee and musicbee-web-controller. (Tip: You may have to manually add 'http://' because most browsers assume you're using https these days, and setting that up is beyond the scope of this guide)

# Configuring MusicBee Web Controller
The MusicBee Web Controller makes a few logical assumptions that you can override:
- MusicBee and the Beekeeper plugin are running on `http://localhost:8080`
- The controller should use port `80`
- Artwork should be cached in `artwork-cache.json`

You do not require a configuration file if you are happy with those defaults, but if you do want to override any of them, create a settings.conf file:

```
beekeeper = http://musicbee.local:8080
port = 999
artwork-cache-file = artwork.json
artwork-cache-enabled = false
```

The musicbee-web-controller will load this file from the current directory, if it is present. You can also specify a different location for it, like this:
`musicbee-web-controller -config=/path/to/settings.conf`
