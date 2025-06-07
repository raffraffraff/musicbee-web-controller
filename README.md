# About
This is a simple web controller for MusicBee. Currently it can fetch album art, artist, title. It can also get and set track rating and Last.FM 'love' status. I plan to add volume control and tag editing features, and I'd like it to fetch missing album art and write it to the file. The remote control requires the Beekeeper MusicBee plugin, which you can download [here](http://grismar.net/beekeeper/plugin.zip). To install it just unzip the plugin into the MusicBee 'Plugins' directory and restart MusicBee. For full functionality, you'll have to grant the plugin the wright to modify the MusicBee database because it's read-only be default.

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
By default the controller assumes that MusicBee and the Beekeeper plugin are running on `http://localhost:8080`, and that the controller itself should be on port `80` (standard, non-TLS website). If you wish to override these defaults, you can create a `settings.conf`, like this:

```
beekeeper = http://musicbee.local:8080
port = 80
```

The musicbee-web-controller will load this file from the current directory, if it is present. You can also specify a different location for it, like thi:
`musicbee-web-controller -config=/path/to/settings.conf`
