/**
 * Beekeeper module containing types and methods for easy access to the Beekeeper MusicBee Plugin.
 * Requires jquery (for $.ajax) and JSON (for JSON.Stringify) to be available.
 *
 * This version was written for MusicBee 2.4.5404, API version 43.
 *
 * Future compatibility of the Beekeeper Plugin with MusicBee cannot be guaranteed and is at the
 * mercy of the author of MusicBee.
 *
 * @module beekeeper
 * @version 1.0
 * @requires jquery
 * @requires json
 * @copyright Jaap van der Velde 2014
 * @license Apache-2.0
 *
 * Disclaimer: other than being written specifically for interaction with the MusicBee application,
 * there exist no links between MusicBee and Beekeeper, nor between their makers. Use Beekeeper at
 * your own risk. No guarantee is offered, no responsibility is taken for any damage or other
 * adverse effects of use of Beekeeper, intended or otherwise.
 */

/**
 * @class Beekeeper
 */

let Beekeeper = {

    //basePath: "http://musicbee.local/api/",
    basePath: '../api/',

    // Definition of MusicBee specific data types
    // Note: the comments for Web API methods will mention the data type when applicable

    /**
     * @static {int} SkinElement
     */
    SkinElement: {
        SkinInputControl: 7,
        SkinInputPanel: 10,
        SkinInputPanelLabel: 14,
        SkinTrackAndArtistPanel: -1
    },

    /**
     * @static {int} ElementState
     */
    ElementState: {
        ElementStateDefault: 0,
        ElementStateModified: 6
    },

    /**
     * @static {int} ElementComponent
     */
    ElementComponent: {
        ComponentBorder: 0,
        ComponentBackground: 1,
        ComponentForeground: 3
    },

    /**
     * @static {int} FilePropertyType
     */
    FilePropertyType: {
        Url: 2,
        Kind: 4,
        Format: 5,
        Size: 7,
        Channels: 8,
        SampleRate: 9,
        Bitrate: 10,
        DateModified: 11,
        DateAdded: 12,
        LastPlayed: 13,
        PlayCount: 14,
        SkipCount: 15,
        Duration: 16,
        Status: 21,
        NowPlayingListIndex: 78,  // only has meaning when called from NowPlayingList_* commands
        ReplayGainTrack: 94,
        ReplayGainAlbum: 95
    },

    /**
     * @static {int} MetaDataType
     */
    MetaDataType : {
        TrackTitle: 65,
        Album: 30,
        AlbumArtist: 31,        // displayed album artist
        AlbumArtistRaw: 34,     // stored album artist
        Artist: 32,             // displayed artist
        MultiArtist: 33,        // individual artists, separated by a null char
        PrimaryArtist: 19,      // first artist from multi-artist tagged file, otherwise displayed artist
        Artists: 144,
        ArtistsWithArtistRole: 145,
        ArtistsWithPerformerRole: 146,
        ArtistsWithGuestRole: 147,
        ArtistsWithRemixerRole: 148,
        Artwork: 40,
        BeatsPerMin: 41,
        Composer: 43,           // displayed composer
        MultiComposer: 89,      // individual composers, separated by a null char
        Comment: 44,
        Conductor: 45,
        Custom1: 46,
        Custom2: 47,
        Custom3: 48,
        Custom4: 49,
        Custom5: 50,
        Custom6: 96,
        Custom7: 97,
        Custom8: 98,
        Custom9: 99,
        Custom10: 128,
        Custom11: 129,
        Custom12: 130,
        Custom13: 131,
        Custom14: 132,
        Custom15: 133,
        Custom16: 134,
        DiscNo: 52,
        DiscCount: 54,
        Encoder: 55,
        Genre: 59,
        Genres: 143,
        GenreCategory: 60,
        Grouping: 61,
        Keywords: 84,
        HasLyrics: 63,
        Lyricist: 62,
        Lyrics: 114,
        Mood: 64,
        Occasion: 66,
        Origin: 67,
        Publisher: 73,
        Quality: 74,
        Rating: 75,
        RatingLove: 76,
        RatingAlbum: 104,
        Tempo: 85,
        TrackNo: 86,
        TrackCount: 87,
        Virtual1: 109,
        Virtual2: 110,
        Virtual3: 111,
        Virtual4: 112,
        Virtual5: 113,
        Virtual6: 122,
        Virtual7: 123,
        Virtual8: 124,
        Virtual9: 125,
        Virtual10: 135,
        Virtual11: 136,
        Virtual12: 137,
        Virtual13: 138,
        Virtual14: 139,
        Virtual15: 140,
        Virtual16: 141,
        Year: 88
    },

    /**
     * @static {int} LyricsType
     */
    LyricsType: {
        NotSpecified: 0,
        Synchronised: 1,
        UnSynchronised: 2
    },

    /**
     * @static {int} PlayState
     */
    PlayState: {
        Undefined: 0,
        Loading: 1,
        Playing: 3,
        Paused: 6,
        Stopped: 7
    },

    /**
     * @static {int} RepeatMode
     */
    RepeatMode: {
        None: 0,
        All: 1,
        One: 2
    },

    /**
     * @static {int} PlaylistFormat
     */
    PlaylistFormat: {
        Unknown: 0,
        M3u: 1,
        Xspf: 2,
        Asx: 3,
        Wpl: 4,
        Pls: 5,
        Auto: 7,
        M3uAscii: 8,
        AsxFile: 9,
        Radio: 10,
        M3uExtended: 11,
        Mbp: 12
    },

    /**
     * @static {int} ReplayGainMode
     */
    ReplayGainMode: {
        Off: 0,
        Track: 1,
        Album: 2,
        Smart: 3
    },

    /**
     * @static {int} DataType
     */
    DataType: {
        String: 0,
        Number: 1,
        DateTime: 2,
        Rating: 3
    },

    /**
     * @static {int} PlayButtonType
     */
    PlayButtonType: {
        PreviousTrack: 0,
        PlayPause: 1,
        NextTrack: 2,
        Stop: 3
    },

    /**
     * @static {int} DeviceIdType
     */
    DeviceIdType: {
        GooglePlay: 1,
        AppleDevice: 2,
        GooglePlay2: 3,
        AppleDevice2: 4
    },

    /**
     * @static {int} SettingId
     */
    SettingId: {
        CompactPlayerFlickrEnabled: 1,
        FileTaggingPreserveModificationTime: 2,
        LastDownloadFolder: 3,
        ArtistGenresOnly: 4
    },

    /**
     * @static {int} SettingId_BK
     */
    SettingId_BK: {
    // identical to SettingId:
        CompactPlayerFlickrEnabled: 1,
        FileTaggingPreserveModificationTime: 2,
        LastDownloadFolder: 3,
        ArtistGenresOnly: 4,
    // specific to Beekeeper:
        PersistentStoragePath: -1,
        ReadOnly_BK: -2,
        Share_BK: -3,
        Version_BK: -4,
        Skin: -5,
        EqualizerEnabled: -6,
        DspEnabled: -7,
        ScrobbleEnabled: -8,
        DefaultFontName_BK: -9,
        ShowTimeRemaining: -10,
        Crossfade: -11,
        ReplayGainMode: -12,
        ShowRatingTrack: -13,
        ShowRatingLove: -14,
        LastFmUserId: -15,
        WebProxy: -16
    },

    LibraryCategory_BK: {
        Music: 0,
        Audiobook: 1,
        Video: 2,
        Inbox: 4
    },

    DownloadTarget: {
        Inbox: 0,
        MusicLibrary: 1,
        SpecificFolder: 3
    },

    /** 
     * Generic Call function, invokes method 'name' with data 'input' and calls 'callback' function with output data.
     * Note: use the other method definitions for most MusicBee calls. Use of Call is only required for calling
     * Beekeeper on new, deprecated or alternative spelling methods.
     * @param {string} name Name of method to be called
     * @param {object} input Serializable JSON object with input parameters for method
     * @param {function} callback Callback function for method, expecting a JSON object
     */
    Call: function(name, input, callback) {
        $.ajax({
            url: this.basePath + name,
            type: "POST",
            data: JSON.stringify(input),
            processData: false,
            dataType: "text"
        })
        .done(function(data) {
            let parsed;
            let trimmed = (typeof data === "string") ? data.trim() : data;
            try {
                // Try to parse as JSON (object or array)
                parsed = JSON.parse(trimmed);
            } catch (e) {
                // Handle booleans
                if (trimmed === "true") {
                    parsed = { success: true };
                } else if (trimmed === "false") {
                    parsed = { success: false };
                }
                // Handle numbers
                else if (!isNaN(trimmed) && trimmed !== "") {
                    parsed = Number(trimmed);
                }
                // Handle empty string
                else if (trimmed === "") {
                    parsed = null;
                }
                // Otherwise, treat as plain string (e.g., base64 image, track title)
                else {
                    parsed = trimmed;
                }
            }
            if (typeof callback === "function") {
                callback(parsed);
            }
        })
        .fail(function(jqXHR) {
            if (typeof callback === "function") {
                callback({ error: "Request failed: " + (jqXHR.responseText || jqXHR.statusText) });
            }
        });
    },

// Definition of supported MusicBee methods
// Each definition maps the parameters to an object with attributes of the same name and provides some documentation.
// The supported methods are the preferred implementations of standard MusicBee Plugin API methods.

    /** 
     * Retrieves the persistent storage path for MusicBee. Path is reported to callback.
     * Setting_GetPersistentStoragePath (function (string) callback)
     * Note: this path is exposed as /file/ when 'Serving shared files' is enabled in plugin settings
     * @param {function} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetPersistentStoragePath: function(callback) {
        this.Call(
	        'Setting_GetPersistentStoragePath',
	        {},
	        callback
	    );
    },

    /** 
     * Retrieves whether the Beekeeper plugin is configured to be 'read only', won't modify the MusicBee library or
     * write specific local files.
     * Setting_GetReadOnly_BK (function (boolean) callback)
     * Note: not part of the original MusicBee Plugin API (not canon), retrieves Beekeeper-specific setting.
     * @param {function} callback Callback function for method, expecting a (boolean) JSON object
     */
    Setting_GetReadOnly_BK: function(callback) {
        this.Call(
            'Setting_GetReadOnly_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether the Beekeeper plugin is configured to serve files from the MusicBee persistent storage folder.
     * Setting_GetShare_BK (function (boolean) callback)
     * Note: not part of the original MusicBee Plugin API (not canon), retrieves Beekeeper-specific setting.
     * @param {function} callback Callback function for method, expecting a (boolean) JSON object
     */
    Setting_GetShare_BK: function(callback) {
        this.Call(
            'Setting_GetShare_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves the Beekeeper plugin version as an array of [major, minor, revision] integers.
     * Setting_GetVersion_BK (function (int[]) callback)
     * Note: not part of the original MusicBee Plugin API (not canon), retrieves Beekeeper-specific setting.
     * @param {function} callback Callback function for method, expecting a (int[]) JSON object
     */
    Setting_GetVersion_BK: function(callback) {
        this.Call(
            'Setting_GetVersion_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves the path to the active skin. File path is reported to callback.
     * Setting_GetSkin (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetSkin: function(callback) {
        this.Call(
            'Setting_GetSkin',
            {},
            callback
        )
    },

    /** 
     * Retrieves the specific color of an element in the active skin. Color is reported to callback.
     * Setting_GetSkinElementColour (SkinElement element, ElementState state, ElementComponent component,
     *   function (string) callback)
     * @param {int} element Window element to get color for
     * @param {int} state State in which the element has the color
     * @param {int} component Component of the element to get the color for
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetSkinElementColour: function(element, state, component, callback) {
      this.Call(
          'Setting_GetSkinElementColour',
          { element: element, state: state, component: component },
          callback
      )
    },

    /** 
     * @see Setting_GetSkinElementColour [canon]
     * Function defined to match overall American English spelling scheme
     * @param {int} element Window element to get color for
     * @param {int} state State in which the element has the color
     * @param {int} component Component of the element to get the color for
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetSkinElementColor: function(element, state, component, callback) {
        this.Setting_GetSkinElementColour(element, state, component, callback);
    },

    /** 
     * Retrieves whether the Window Borders for MusicBee are skinned. Result is reported to callback.
     * Setting_IsWindowBordersSkinned (function (boolean) callback)
     * @param {function} callback Callback function for method, expecting a (boolean) JSON object
     */
    Setting_IsWindowBordersSkinned: function(callback) {
        this.Call(
            'Setting_IsWindowBordersSkinned',
            {},
            callback
        )
    },

    /** 
     * Retrieves a single property for the give source file. Property is reported to callback.
     * Library_GetFileProperty (string sourceFileUrl, FilePropertyType type, function (string) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {int} type
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetFileProperty: function(sourceFileUrl, type, callback) {
        this.Call(
            'Library_GetFileProperty',
            { sourceFileUrl: sourceFileUrl, type: type },
            callback
        )
    },

    /** 
     * Retrieves a single metadata field (tag) for the given source file. Tag is reported to callback.
     * Library_GetFileTag (string sourceFileUrl, MetaDataType field, function (string) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {string} field Name of field to retrieve
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetFileTag: function(sourceFileUrl, field, callback) {
        this.Call(
	        'Library_GetFileTag',
	        { sourceFileUrl : sourceFileUrl, field: field },
	        callback
	    );
    },

    /** 
     * Sets a single metadata field (tag) for the given source file. Success is reported to callback.
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * Library_SetFileTag (string sourceFileUrl, MetaDataType field, object value,
     *   function (boolean) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {string} field Name of field to set
     * @param {object} value Value to set field to
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Library_SetFileTag: function(sourceFileUrl, field, value, callback) {
        this.Call(
            'Library_SetFileTag',
            { sourceFileUrl: sourceFileUrl, field: field, value: value },
            callback
        )
    },

    /** 
     * Commits changes to tags on a source file to the file. Success is reported to callback.
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * Library_CommitTagsToFile (string sourceFileUrl, function (boolean) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Library_CommitTagsToFile: function(sourceFileUrl, callback) {
        this.Call(
            'Library_CommitTagsToFile',
            { sourceFileUrl: sourceFileUrl },
            callback
        )
    },

    /** 
     * Retrieves lyrics from a given source file. Lyrics are reported to callback.
     * Library_GetLyrics (string sourceFileUrl, LyricsType type, function (string) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {int} type Type of lyrics to retrieve (synchronised or not, or unspecified)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetLyrics: function(sourceFileUrl, type, callback) {
        this.Call(
            'Library_GetLyrics',
            { sourceFileUrl: sourceFileUrl, type: type },
            callback
        )
    },

    /** 
     * Retrieves artwork from a given source file. Image data is passed to callback as base64-encoded jpg.
     * Library_GetArtwork (string sourceFileUrl, int index, function (string) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {int} index Index of image in source file (in case of multiple images, starting at 0)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetArtwork: function(cacheKey, sourceFileUrl, index, callback) {
        this.Call(
            'Library_GetArtwork',
            { cacheKey: cacheKey, sourceFileUrl: sourceFileUrl, index: index },
            callback
        )
    },

    /** 
     * Starts a query to retrieve files/tracks from library; @see Library_QueryGetNextFile.
     * Note: if you need all these files at once instead of one at a time, use @see Library_QueryFilesEx
     * Library_QueryFiles (string query, function (boolean) callback)
     * @param {string} query Query string to start query with; either "domain=SelectedFiles", "domain=DisplayedFiles"
     *   or an auto playlist xml document
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Library_QueryFiles: function(query, callback) {
        this.Call(
            'Library_QueryFiles',
            { query: query },
            callback
        )
    },

    /** 
     * Returns the next result from a query started with @see Library_QueryFiles. File url is reported to callback.
     * Library_QueryGetNextFile (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_QueryGetNextFile: function(callback) {
        this.Call(
            'Library_QueryGetNextFile',
            {},
            callback
        )
    },

    /** 
     * Get the position of the currently playing file (if any). Position is reported to callback.
     * Player_GetPosition (function (int) callback)
     * @param {function (object)} callback Callback function for method, expecting a (int) JSON object
     */
    Player_GetPosition: function(callback) {
        this.Call(
            'Player_GetPosition',
            {},
            callback
        )
    },

    /** 
     * Set the position of the currently playing file (if any). Success is reported to callback.
     * Player_GetPosition (int position, function (boolean) callback)
     * @param {int} position The position (in milliseconds) in the currently playing file to set the player
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetPosition: function(position, callback) {
        this.Call(
            'Player_SetPosition',
            { position: position },
            callback
        )
    },

    /** 
     * Retrieves the current play state of the MusicBee player. Play state is reported to callback.
     * Player_GetPlayState (function (PlayState output) callback)
     * @param {function (object)} callback Callback function for method, expecting a (PlayState) JSON object
     */
    Player_GetPlayState: function(callback) {
        this.Call(
            'Player_GetPlayState',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to play or pause if it was playing. Success is reported to callback.
     * Player_PlayPause (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_PlayPause: function(callback) {
        this.Call(
            'Player_PlayPause',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to stop any playback. Success is reported to callback.
     * Player_Stop (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_Stop: function(callback) {
        this.Call(
            'Player_Stop',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to stop playback once the playing track completes. Success is reported to callback.
     * Player_StopAfterCurrent (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_StopAfterCurrent: function(callback) {
        this.Call(
            'Player_StopAfterCurrent',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to start playing the previous track in now playing. Success is reported to callback.
     * Player_PlayPreviousTrack (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_PlayPreviousTrack: function(callback) {
        this.Call(
            'Player_PlayPreviousTrack',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to start playing the next track in now playing. Success is reported to callback.
     * Player_PlayNextTrack (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_PlayNextTrack: function(callback) {
        this.Call(
            'Player_PlayNextTrack',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to enter Auto DJ mode. Success is reported to callback.
     * Player_StartAutoDj (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_StartAutoDj: function(callback) {
        this.Call(
            'Player_StartAutoDj',
            {},
            callback
        )
    },

    /** 
     * Causes the MusicBee player to exit Auto DJ mode. Success is reported to callback.
     * Player_StartAutoDj (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_EndAutoDj: function(callback) {
        this.Call(
            'Player_EndAutoDj',
            {},
            callback
        )
    },

    /** 
     * Retrieves the current volume setting of the MusicBee player. Current volume is reported to callback.
     * Player_GetVolume (function (float) callback)
     * @param {function (object)} callback Callback function for method, expecting a (float) JSON object
     */
    Player_GetVolume: function(callback) {
        this.Call(
            'Player_GetVolume',
            {},
            callback
        )
    },

    /** 
     * Sets the current volume of the MusicBee player. Success is reported to callback.
     * Player_SetVolume (float volume, function (boolean) callback)
     * @param {number} volume What value to set the volume to (0..1)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetVolume: function(volume, callback) {
        this.Call(
            'Player_SetVolume',
            { volume: volume },
            callback
        )
    },

    /** 
     * Retrieves whether or not the MusicBee player is muted. Success is reported to callback.
     * Player_GetMute (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetMute: function(callback) {
        this.Call(
            'Player_GetMute',
            {},
            callback
        )
    },

    /** 
     * Sets whether or not the MusicBee player is muted. Success is reported to callback.
     * Player_SetMute (bool mute, function (boolean) callback)
     * @param {boolean} mute Muted (true) or not (false)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetMute: function(mute, callback) {
        this.Call(
            'Player_SetMute',
            { mute: mute },
            callback
        )
    },

    /** 
     * Retrieves whether or not the MusicBee player is in shuffle mode. Shuffle mode is reported to callback.
     * Player_GetShuffle (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetShuffle: function(callback) {
        this.Call(
            'Player_GetShuffle',
            {},
            callback
        )
    },

    /** 
     * Sets whether or not the MusicBee player is in shuffle mode. Success is reported to callback.
     * Player_SetShuffle (boolean shuffle, function (boolean) callback)
     * @param {boolean} shuffle In shuffle mode (true) or not (false)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetShuffle: function(shuffle, callback) {
        this.Call(
            'Player_SetShuffle',
            { shuffle: shuffle },
            callback
        )
    },

    /** 
     * Retrieves whether or not the MusicBee player is in repeat mode. Repeat mode is reported to callback.
     * Player_GetRepeat (function (RepeatMode) callback)
     * @param {function (object)} callback Callback function for method, expecting a (RepeatMode) JSON object
     */
    Player_GetRepeat: function(callback) {
        this.Call(
            'Player_GetRepeat',
            {},
            callback
        )
    },

    /** 
     * Sets whether or not the MusicBee player is in repeat mode. Success is reported to callback.
     * Player_SetRepeat (RepeatMode repeat, function (boolean) callback)
     * @param {number} repeat Repeat none, all (in now playing) or the current one.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetRepeat: function(repeat, callback) {
        this.Call(
            'Player_SetRepeat',
            { repeat: repeat },
            callback
        )
    },

    /** 
     * Retrieves whether the equaliser is enabled.
     * Player_GetEqualiserEnabled(function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetEqualiserEnabled: function(callback) {
        this.Call(
            'Player_GetEqualiserEnabled',
            {},
            callback
        )
    },

    /** 
     * @see Player_GetEqualiserEnabled [canon]
     * Function defined to match naming conventions of API
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetEqualizerEnabled: function (callback) {
        this.Player_GetEqualiserEnabled(callback);
    },

    /** 
     * Sets whether the equaliser is enabled.
     * Player_SetEqualiserEnabled(boolean enabled, function (boolean) callback)
     * @param {boolean} enabled Whether or not the equaliser should be enabled.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetEqualiserEnabled: function(enabled, callback) {
        this.Call(
            'Player_SetEqualiserEnabled',
            { enabled: enabled},
            callback
        )
    },

    /** 
     * @see Player_SetEqualiserEnabled [canon]
     * Function defined to match naming conventions of API
     * @param {boolean} enabled Whether or not the equaliser should be enabled.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetEqualizerEnabled: function (enabled, callback) {
        this.Player_SetEqualiserEnabled(enabled, callback);
    },


    /** 
     * Retrieves whether digital signal processing effects are applied.
     * Player_GetDspEnabled(function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetDspEnabled: function(callback) {
        this.Call(
            'Player_GetDspEnabled',
            {},
            callback
        )
    },

    /** 
     * Sets whether digital signal processing effects are applied.
     * Player_SetDspEnabled(boolean enabled, function (boolean) callback)
     * @param {boolean} enabled Whether or not digital signal processing effects should be applied.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetDspEnabled: function(enabled, callback) {
        this.Call(
            'Player_SetDspEnabled',
            { enabled: enabled },
            callback
        )
    },

    /** 
     * Retrieves whether Last.fm scrobbling is enabled.
     * Player_GetScrobbleEnabled(function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetScrobbleEnabled: function(callback) {
        this.Call(
            'Player_GetScrobbleEnabled',
            {},
            callback
        )
    },

    /** 
     * Sets whether Last.fm scrobbling is enabled.
     * Player_SetScrobbleEnabled(boolean enabled, function (boolean) callback)
     * @param {boolean} enabled Whether or not Last.fm scrobbling should be enabled.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetScrobbleEnabled: function(enabled, callback) {
        this.Call(
            'Player_SetScrobbleEnabled',
            { enabled: enabled },
            callback
        )
    },

    /** 
     * Gets the file url for the current track.
     * NowPlaying_GetFileUrl(function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetFileUrl: function(callback) {
        this.Call(
            'NowPlaying_GetFileUrl',
            {},
            callback
        )
    },

    /** 
     * Gets the duration (in milliseconds) for the current track.
     * NowPlaying_GetDuration (function (int) callback)
     * @param {function (object)} callback Callback function for method, expecting a (int) JSON object
     */
    NowPlaying_GetDuration: function(callback) {
        this.Call(
            'NowPlaying_GetDuration',
            {},
            callback
        )
    },

    /** 
     * Gets the value of a file property for the current track.
     * NowPlaying_GetFileProperty (FilePropertyType type, function (string) callback)
     * @param {int} type Specific FilePropertyType to retrieve
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetFileProperty: function(type, callback) {
        this.Call(
            'NowPlaying_GetFileProperty',
            { type: type },
            callback
        )
    },

    /** 
     * Get the value of a metadata tag for the current track.
     * NowPlaying_GetFileTag (MetaDataType field, function (string) callback)
     * @param {int} field Specific MetaDataType to retrieve
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetFileTag: function(field, callback) {
        this.Call(
            'NowPlaying_GetFileTag',
            { field: field },
            callback
        )
    },

    /** 
     * Get any available lyrics for the current track.
     * NowPlaying_GetLyrics (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetLyrics: function(callback) {
        this.Call(
            'NowPlaying_GetLyrics',
            {},
            callback
        )
    },

    /** 
     * Get artwork for the current track. Image data is passed to callback as base64-encoded jpg.
     * NowPlaying_GetArtwork (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetArtwork: function(callback) {
        this.Call(
            'NowPlaying_GetArtwork',
            {},
            callback
        )
    },

    /** 
     * Clears the Now Playing List. Doesn't clear 'current track', will continue playing and re-added when restarted.
     * NowPlayingList_Clear (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_Clear: function(callback) {
        this.Call(
            'NowPlayingList_Clear',
            {},
            callback
        )
    },

    /** 
     * Runs a query against the Now Playing list (including tracks not in library).
     * Follow up with calls to NowPlayingList_QueryGetNextFile.
     * Note: if you need all these files at once instead of one at a time, use @see NowPlayingList_QueryFilesEx
     * NowPlayingList_QueryFiles (string query, function (boolean) callback)
     * @param {string} query Query string to start query with; either "domain=SelectedFiles", "domain=DisplayedFiles"
     *   or an auto playlist xml document
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_QueryFiles: function(query, callback) {
        this.Call(
            'NowPlayingList_QueryFiles',
            { query: query },
            callback
        )
    },

    /** 
     * Retrieves the next result from the active query on Now Playing list, started by @see NowPlayingList_QueryFiles.
     * NowPlayingList_QueryGetNextFile (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlayingList_QueryGetNextFile: function(callback) {
        this.Call(
            'NowPlayingList_QueryGetNextFile',
            {},
            callback
        )
    },

    /** 
     * Replaces the Now Playing list with a specific track and starts playing it.
     * NowPlayingList_PlayNow (string sourceFileUrl, function (boolean) callback)
     * @param {string} sourceFileUrl The path to the track (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_PlayNow: function(sourceFileUrl, callback) {
        this.Call(
            'NowPlayingList_PlayNow',
            { sourceFileUrl: sourceFileUrl },
            callback
        )
    },

    /** 
     * Causes MusicBee to enqueue a specific track right after the current track (inserting it) on the Now Playing list.
     * NowPlayingList_QueueNext (string sourceFileUrl, function (boolean) callback)
     * @param {string} sourceFileUrl The path to the track (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_QueueNext: function(sourceFileUrl, callback) {
        this.Call(
            'NowPlayingList_QueueNext',
            { sourceFileUrl: sourceFileUrl },
            callback
        )
    },

    /** 
     * Causes MusisBee to enqueue a specific track at the end of (appending it to) the Now Playing list.
     * NowPlayingList_QueueLast (string sourceFileUrl, function (boolean) callback)
     * @param {string} sourceFileUrl The path to the track (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_QueueLast: function(sourceFileUrl, callback) {
        this.Call(
            'NowPlayingList_QueueLast',
            { sourceFileUrl: sourceFileUrl },
            callback
        )
    },

    /** 
     * Cause MusicBee to play random tracks from library. Effectively drops entire library in Now Playing List,
     * enables shuffle and starts playback.
     * NowPlayingList_PlayLibraryShuffled (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_PlayLibraryShuffled: function(callback) {
        this.Call(
            'NowPlayingList_PlayLibraryShuffled',
            {},
            callback
        )
    },

    /** 
     * Runs a query for playlists in MusicBee. Follow up with calls to @see Playlist_QueryGetNextPlaylist.
     * Playlist_QueryPlaylists (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_QueryPlaylists: function(callback) {
        this.Call(
            'Playlist_QueryPlaylists',
            {},
            callback
        )
    },

    /** 
     * Retrieves the next result from the active query for playlists, started by @see Playlist_QueryPlaylists.
     * Playlist_QueryGetNextPlaylist (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Playlist_QueryGetNextPlaylist: function(callback) {
        this.Call(
            'Playlist_QueryGetNextPlaylist',
            {},
            callback
        )
    },

    /** 
     * Retrieves the format of a given playlist.
     * Playlist_GetType (string playlistUrl, function (PlaylistFormat) callback)
     * @param {string} playlistUrl The path to the playlist (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (PlaylistFormat) JSON object
     */
    Playlist_GetType: function (playlistUrl, callback) {
        this.Call(
            'Playlist_GetType',
            { playlistUrl: playlistUrl },
            callback
        )
    },

    /** 
     * @see Playlist_GetType [canon]
     * Function defined to match naming conventions of API
     * @param {string} playlistUrl The path to the playlist (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (PlaylistFormat) JSON object
     */
    Playlist_GetFormat: function (playlistUrl, callback) {
        this.Playlist_GetType(playlistUrl, callback);
    },

    /** 
     * Runs a query for all files/tracks in a specific playlist. Follow up with calls to @see Playlist_QueryGetNextFile.
     * Note: if you need all these files at once instead of one at a time, use @see Playlist_QueryFilesEx
     * Playlist_QueryFiles (string playlistUrl, function (boolean) callback)
     * @param {string} playlistUrl The path to the playlist (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_QueryFiles: function (playlistUrl, callback) {
        this.Call(
            'Playlist_QueryFiles',
            { playlistUrl: playlistUrl },
            callback
        )
    },

    /** 
     * Retrieves next result from the active query for files/tracks on a playlist, started by @see Playlist_QueryFiles.
     * Playlist_QueryGetNextPlaylist (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Playlist_QueryGetNextFile: function (callback) {
        this.Call(
            'Playlist_QueryGetNextFile',
            {},
            callback
        )
    },

    /** 
     * Causes MusicBee to refresh user interface panels.
     * MB_RefreshPanels(function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    MB_RefreshPanels: function(callback) {
        this.Call(
            'MB_RefreshPanels',
            {},
            callback
        )
    },

    /** 
     * Retrieves the field/tag name for a specific MetaDataType.
     * Setting_GetFieldName (MetaDataType field, function (string) callback)
     * @param {int} field The MetaDataType for which to retrieve the name.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetFieldName: function(field, callback) {
        this.Call(
            'Setting_GetFieldName',
            { field: field },
            callback
        )
    },

    /** 
     * Retrieves the default Font name for the current skin in MusicBee.
     * Note: not part of the original MusicBee Plugin API (not canon), replacing Setting_GetDefaultFont.
     * Setting_GetDefaultFontName_BK (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetDefaultFontName_BK: function(callback) {
        this.Call(
            'Setting_GetDefaultFontName_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves the file url (from MusicBee local perspective) for the index-th file/track on the Now Playing list.
     * NowPlayingList_GetListFileUrl (int index, function (string) callback)
     * @param {int} index The index of the item on the list, with 0 being the top one.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlayingList_GetFileUrlAt: function(index, callback) {
        this.Call(
            'NowPlayingList_GetFileUrlAt',
            { index: index },
            callback
        )
    },

    /** 
     * Retrieves the vale of a file property for the index-th file/track on the Now Playing list.
     * NowPlayingList_GetFileProperty (int index, FilePropertyType type, function (string) callback)
     * @param {int} index The index of the item on the list, with 0 being the top one.
     * @param {int} type The FilePropertyType of the property to retrieve.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlayingList_GetFilePropertyAt: function(index, type, callback) {
        this.Call(
            'NowPlayingList_GetFilePropertyAt',
            { index: index, type: type },
            callback
        )
    },

    /** 
     * Retrieves the vale of a file tag (metadata) for the index-th file/track on the Now Playing list.
     * NowPlayingList_GetFileTag (int index, MetaDataType type, function (string) callback)
     * @param {int} index The index of the item on the list, with 0 being the top one.
     * @param {int} field The MetaDataType of the field/tag to retrieve.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlayingList_GetFileTagAt: function(index, field, callback) {
        this.Call(
            'NowPlayingList_GetFileTagAt',
            { index: index, field: field },
            callback
        )
    },

    /** 
     * TODO function unknown, but works
     * @param id
     * @param defaultText
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    MB_GetLocalisation: function(id, defaultText, callback) {
        this.Call(
            'MB_GetLocalization',
            { id: id, defaultText: defaultText },
            callback
        )
    },

    /** 
     * @see MB_GetLocalisation [canon]
     * Function defined to match naming conventions of API
     * @param id
     * @param defaultText
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    MB_GetLocalization: function (id, defaultText, callback) {
        this.MB_GetLocalisation(id, defaultText, callback);
    },

    /** 
     * Retrieves whether there are any tracks in the Now Playing list prior to the current track.
     * NowPlayingList_IsAnyPriorTracks (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_IsAnyPriorTracks: function (callback) {
        this.Call(
            'NowPlayingList_IsAnyPriorTracks',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether there are any tracks in the Now Playing list following the current track.
     * NowPlayingList_IsAnyFollowingTracks (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_IsAnyFollowingTracks: function (callback) {
        this.Call(
            'NowPlayingList_IsAnyFollowingTracks',
            {},
            callback
        )
    },

    /** 
     * Causes MusicBee to show the equalizer in its user interface.
     * Player_ShowEqualiser (function (boolean) callback)
     * Note: Currently defective (v1.0) and will only generate an error message from Beekeeper
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_ShowEqualiser: function (callback) {
        this.Call(
            'Player_ShowEqualiser',
            {},
            callback
        )
    },

    /** 
     * @see Player_ShowEqualiser [canon]
     * Function defined to match naming conventions of API
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_ShowEqualizer: function (callback) {
        this.Player_ShowEqualiser(callback);
    },

    /** 
     * Retrieves whether the AutoDj is enabled.
     * Player_GetAutoDjEnabled (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetAutoDjEnabled: function (callback) {
        this.Call(
            'Player_GetAutoDjEnabled',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether playback will stop after the current track (for example after @see Player_StopAfterCurrent).
     * Player_GetStopAfterCurrentEnabled (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetStopAfterCurrentEnabled: function (callback) {
        this.Call(
            'Player_GetStopAfterCurrentEnabled',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether MusicBee will crossfade from file/track to the next.
     * Player_GetCrossfade (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetCrossfade: function (callback) {
        this.Call(
            'Player_GetCrossfade',
            {},
            callback
        )
    },

    /** 
     * Sets whether MusicBee should crossfade from file/track to the next.
     * Player_SetCrossfade (boolean crossfade, function (boolean) callback)
     * @param {boolean} crossfade Whether MusicBee should crossfade.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetCrossfade: function (crossfade, callback) {
        this.Call(
            'Player_SetCrossfade',
            { crossfade: crossfade },
            callback
        )
    },

    /** 
     * Retrieves what replay gain mode is enabled for adjusting volume across playback of files/tracks.
     * Player_GetReplayGainMode (function (ReplayGainMode) callback)
     * @param {function (object)} callback Callback function for method, expecting a (ReplayGainMode) JSON object
     */
    Player_GetReplayGainMode: function (callback) {
        this.Call(
            'Player_GetReplayGainMode',
            {},
            callback
        )
    },

    /** 
     * Sets whether replay gain mode should be enabled for relatively continuous volume across files/tracks.
     * Player_SetCrossfade (boolean mode, function (boolean) callback)
     * @param {int} mode Which ReplayGainMode MusicBee should use for replay gain.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_SetReplayGainMode: function (mode, callback) {
        this.Call(
            'Player_SetReplayGainMode',
            { mode: mode },
            callback
        )
    },

    /** 
     * Causes MusicBee to enqueue a specified number of random files/tracks, at the end of the Now Playing list.
     * @param {int} count The number of files/tracks to enqueue.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_QueueRandomTracks: function (count, callback) {
        this.Call(
            'Player_QueueRandomTracks',
            { count: count },
            callback
        )
    },

    /** 
     * Retrieves the data type of the give MetaDataType (tag) as a MusicBee DataType.
     * @param {int} field MetaDataType for which to retrieve the field.
     * @param {function (object)} callback Callback function for method, expecting a (DataType) JSON object
     */
    Setting_GetDataType: function (field, callback) {
        this.Call(
            'Setting_GetDataType',
            { field: field },
            callback
        )
    },

    /** 
     * Retrieves index in the Now Playing list of the track that will play as the offset-th file/track after current.
     * Note: effectively returns MaxInt (index of current file/track + offset, count (Now Playing) - 1)
     * @param {int} offset Distance from current track (0 retrieves index of current track, not next!)
     * @param {function (object)} callback Callback function for method, expecting a (int) JSON object
     */
    NowPlayingList_GetNextIndex: function (offset, callback) {
        this.Call(
            'NowPlayingList_GetNextIndex',
            { offset: offset },
            callback
        )
    },

    /** 
     * Causes MusicBee to try and retrieve an image for the currently playing artist from the web, saving it in a
     * temporary location. The callback is passed a url that points to the image, which will be available until
     * MusicBee is restarted, or the image is no longer available to MusicBee.
     * Note: not part of the original MusicBee Plugin API (not canon), replacing NowPlaying_GetArtistPicture.
     * Note: the url points to a jpeg image, thought the file extension is typically .dat or .tmp
     * Note: apply fadingPercent = 0 to avoid temporary images being generated for every call
     * NowPlaying_GetArtistPictureLink_BK (int fadingPercent, function (string) callback)
     * @param {int} fadingPercent A percentage by which the image is faded between 0% and 50% opaque. (0 for no change)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetArtistPictureLink_BK: function (fadingPercent, callback) {
        this.Call(
            'NowPlaying_GetArtistPictureLink_BK',
            { fadingPercent: fadingPercent },
            callback
        )
    },

    /** 
     * Retrieves a web client usable url to downloaded artwork for the current file/track.
     * The callback is passed a url that points to the image, which will be available until MusicBee is restarted,
     * or the image is no longer available to MusicBee.
     * Note: not part of the original MusicBee Plugin API (not canon), replacing NowPlaying_GetDownloadedArtwork.
     * NowPlaying_GetDownloadedArtworkLink_BK (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetDownloadedArtworkLink_BK: function (callback) {
        this.Call(
            'NowPlaying_GetDownloadedArtworkLink_BK',
            {},
            callback
        )
    },

    /** 
     * Causes MusicBee to display the Now Playing assistant.
     * MB_ShowNowPlayingAssistant (function (boolean) callback)
     * Note: Currently defective (v1.0) and will only generate an error message from Beekeeper
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    MB_ShowNowPlayingAssistant: function (callback) {
        this.Call(
            'MB_ShowNowPlayingAssistant',
            {},
            callback
        )
    },

    /** 
     * Retrieves any downloaded lyrics for the current file/track.
     * NowPlaying_GetDownloadedLyrics (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetDownloadedLyrics: function(callback) {
        this.Call(
            'NowPlaying_GetDownloadedLyrics',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether MusicBee displays star rating button and status for each track.
     * Player_GetShowRatingTrack (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetShowRatingTrack: function (callback) {
        this.Call(
            'Player_GetShowRatingTrack',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether MusicBee displays last.fm 'love' rating button and status for each track.
     * Player_GetShowRatingLove (function (boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetShowRatingLove: function (callback) {
        this.Call(
            'Player_GetShowRatingLove',
            {},
            callback
        )
    },

    /** 
     * Retrieves the Last.fm user id configured in MusicBee, if any.
     * Setting_GetLastFmUserId (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetLastFmUserId: function (callback) {
        this.Call(
            'Setting_GetLastFmUserId',
            {},
            callback
        )
    },

    /** 
     * Get the name of a specific playlist by providing the path name/url.
     * @param {string} playlistUrl Location of playlist (from MusicBee local perspective).
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Playlist_GetName: function (playlistUrl, callback) {
        this.Call(
            'Playlist_GetName',
            { playlistUrl: playlistUrl },
            callback
        )
    },

    /** 
     * Create a new playlist in a playlist folder, given an array of filename for files/tracks.
     * Passes the playlistUrl to callback (from MusicBee local perspective).
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * @param {string} folderName Name of 'folder' in the MusicBee Playlists (not a file system folder).
     * @param {string} playlistName Name for playlist.
     * @param {string[]} filenames Array of filenames for files/tracks on playlist.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Playlist_CreatePlaylist: function (folderName, playlistName, filenames, callback) {
        this.Call(
            'Playlist_CreatePlaylist',
            { folderName: folderName, playlistName: playlistName, filenames: filenames },
            callback
        )
    },

    /** 
     * Replaces the files/tracks in a playlist with a new set.
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * Playlist_SetFiles (string playlistUrl, string[] filenames, function (boolean) callback)
     * @param {string} playlistUrl The path to the playlist (from MusicBee local perspective).
     * @param {string[]} filenames Array of filenames for files/tracks on playlist.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_SetFiles: function (playlistUrl, filenames, callback) {
        this.Call(
            'Playlist_SetFiles',
            { playlistUrl: playlistUrl, filenames: filenames },
            callback
        )
    },

    /** 
     * Causes MusicBee to run a query for similar artist to a given artist, within a specific similarity (0..1).
     * A list of strings, separated by \0 are passed to callback.
     * Library_QuerySimilarArtists (string artistName, number minimumArtistSimilarityRating, function (string) callback)
     * @param {string} artistName The name of the artist for which to find similar artists.
     * @param {number} minimumArtistSimilarityRating The similarity (0..1) required.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_QuerySimilarArtists: function (artistName, minimumArtistSimilarityRating, callback) {
        this.Call(
            'Library_QuerySimilarArtists',
            { artistName: artistName, minimumArtistSimilarityRating: minimumArtistSimilarityRating },
            callback
        )
    },

    /** 
     * TODO function unknown, but works
     * Library_QueryLookupTable (string[] keyTags, string[]valueTags, string query, function (bool) callback)
     * @param keyTags
     * @param valueTags
     * @param query
     * @param {function (object)} callback Callback function for method, expecting a (bool) JSON object
     */
    Library_QueryLookupTable: function (keyTags, valueTags, query, callback) {
        this.Call(
            'Library_QueryLookupTable',
            { keyTags: keyTags, valueTags: valueTags, query: query },
            callback
        )
    },

    /** 
     * TODO function unknown, but works
     * Library_QueryGetLookupTableValue (string key, function (string) callback)
     * @param key
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_QueryGetLookupTableValue: function (key, callback) {
        this.Call(
            'Library_QueryGetLookupTableValue',
            { key: key },
            callback
        )
    },

    /** 
     * Causes MusicBee to enqueue a set of files/tracks right after the current track (inserting them) on the
     * Now Playing list.
     * NowPlayingList_QueueFilesNext (string[] sourceFileUrls, function (boolean) callback)
     * @param {string[]} sourceFileUrls Source file urls (from MusicBee perspective) of files/tracks to enqueue.
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_QueueFilesNext: function (sourceFileUrls, callback) {
        this.Call(
            'NowPlayingList_QueueFilesNext',
            { sourceFileUrls: sourceFileUrls},
            callback
        )
    },

    /** 
     * Causes MusicBee to enqueue a set of files/tracks at the end of the Now Playing list (appending them).
     * NowPlayingList_QueueFilesLast (string[] sourceFileUrls, function (boolean) callback)
     * @param {string[]} sourceFileUrls Source file urls (from MusicBee perspective) of files/tracks to enqueue.
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_QueueFilesLast: function (sourceFileUrls, callback) {
        this.Call(
            'NowPlayingList_QueueFilesLast',
            { sourceFileUrls: sourceFileUrls },
            callback
        )
    },

    /** 
     * Retrieves the address of the web proxy MusicBee is using.
     * Setting_GetWebProxy (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Setting_GetWebProxy: function (callback) {
        this.Call(
            'Setting_GetWebProxy',
            {},
            callback
        )
    },

    /** 
     * Removes a single file/track from the Now Playing list, at a specific index.
     * NowPlayingList_RemoveAt (int index, function (boolean) callback)
     * @param {int} index Index to remove track at (0 is the top of the list).
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_RemoveAt: function (index, callback) {
        this.Call(
            'NowPlayingList_RemoveAt',
            { index: index },
            callback
        )
    },

    /** 
     * Removes a single file/track from a specific playlist, at a specific index.
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * @param {string} playlistUrl The path to the playlist (from MusicBee local perspective).
     * @param {int} index Index to remove track at (0 is the top of the list).
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_RemoveAt: function (playlistUrl, index, callback) {
        this.Call(
            'Playlist_RemoveAt',
            { playlistUrl: playlistUrl, index: index },
            callback
        )
    },

    /** 
     * Resize the MusicBee window to a specific width and height.
     * TODO doesn't appear to be a fully functional call, MusicBee gets resized, but loses content
     * MB_SetWindowSize (int width, int height, function (boolean) callback)
     * @param {int} width Target width in pixels.
     * @param {int} height Target height in pixels.
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    MB_SetWindowSize: function (width, height, callback) {
        this.Call(
            'MB_SetWindowSize',
            { width: width, height: height },
            callback
        )
    },

    /** 
     * Causes MusicBee to try and retrieve an image for a specific artist from the web, saving it in a
     * temporary location. The callback is passed a url that points to the image, which will be available until
     * MusicBee is restarted, or the image is no longer available to MusicBee.
     * Library_GetArtistPictureLink_BK (string artistName, int fadingPercent, int fadingColor, function (string) callback)
     * @param {string} artistName The name of the artist for which to retrieve an image.
     * @param {int} fadingPercent The percentage by which to fade the image into a specific color.
     * @param {int} fadingColor The color to fade into.
     * @param {function(object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetArtistPictureLink_BK: function (artistName, fadingPercent, fadingColor, callback) {
        this.Call (
            'Library_GetArtistPictureLink_BK',
            { artistName: artistName, fadingPercent: fadingPercent, fadingColor: fadingColor },
            callback
        )
    },

    /** 
     * Retrieves the sourceFileUrl for the current (or 'pending') file/track.
     * Note: a track can be current (playing or not) without being in the Now Playing list.
     * Pending_GetFileUrl (function (string) callback)
     * @param {function(object)} callback Callback function for method, expecting a (string) JSON object
     */
    Pending_GetFileUrl: function (callback) {
        this.Call(
            'Pending_GetFileUrl',
            {},
            callback
        )
    },

    /** 
     * Retrieves a single property for the current (or 'pending') file/track. Property is reported to callback.
     * Note: a track can be current (playing or not) without being in the Now Playing list.
     * Pending_GetFileProperty (FilePropertyType type, function (string) callback)
     * @param {int} type
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Pending_GetFileProperty: function (type, callback) {
        this.Call(
            'Pending_GetFileProperty',
            { type: type },
            callback
        )
    },

    /** 
     * Retrieves a single  metadata field (tag) for the current (or 'pending') file/track. Callback gets string value.
     * Note: a track can be current (playing or not) without being in the Now Playing list.
     * Pending_GetFileTag (MetaDataType type, function (string) callback)
     * @param {int} field
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Pending_GetFileTag: function (field, callback) {
        this.Call(
            'Pending_GetFileTag',
            { field: field },
            callback
        )
    },

    /** 
     * Retrieves whether a button in MusicBee is enabled. The button is specified as a PlayButtonType.
     * Player_GetButtonEnabled (PlayButtonType button, function (boolean) callback)
     * @param {int} button The PlayButtonType button for which to retrieve the enabled status.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Player_GetButtonEnabled: function (button, callback) {
        this.Call(
            'Player_GetButtonEnabled',
            { button: button },
            callback
        )
    },

    /**
     * Moves a set of specific files/tracks to a target position on the Now Playing list.
     * Note: behavior of this function may see erratic, but remember that toIndex currently uses -1 as the top index
     * and that insertion may be confusing if the target index is among the source indices.
     * NowPlayingList_MoveFiles (int[] fromIndices, int toIndex, function(boolean) callback)
     * @param {int[]} fromIndices The positions of the files/tracks to move. (0 is top)
     * @param {int} toIndex The position to move the tracks to. (-1[!] is top, not counting the playing track)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_MoveFiles: function (fromIndices, toIndex, callback) {
        this.Call(
            'NowPlayingList_MoveFiles',
            { fromIndices: fromIndices, toIndex: toIndex },
            callback
        )
    },

    /**
     * The same as @see NowPlayingList_MoveFiles, but without the unexpected behavior. Performance may be worse as a
     * result, but behavior is predictable. 0 is the top index, order is maintained and the order in the fromIndices
     * array is used to determine the insertion order.
     * NowPlayingList_MoveFiles_BK (int[] fromIndices, int toIndex, function(boolean) callback)
     * @param {int[]} fromIndices The positions of the files/tracks to move. (0 is top)
     * @param {int} toIndex The position to move the tracks to. (-1[!] is top, not counting the playing track)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlayingList_MoveFiles_BK: function (fromIndices, toIndex, callback) {
        this.Call(
            'NowPlayingList_MoveFiles_BK',
            { fromIndices: fromIndices, toIndex: toIndex },
            callback
        )
    },

    /**
     * Retrieves the location of the index-th artwork of a specific file/track.
     * Note: causes MusicBee to create a temporary file with the artwork if none was present, or the artwork was
     * embedded in the track. The callback is passed a url that points to the image, which will be available until
     * MusicBee is restarted, or the image is no longer available to MusicBee.
     * Note: use @see Library_GetArtwork instead when possible, to avoid unnecessary temporary file creation.
     * Library_GetArtworkUrlLink_BK (string sourceFileUrl, int index, function (string) callback)
     * @param {string} sourceFileUrl Location (local to MusicBee) of file for which to retrieve artwork location.
     * @param {int} index The index of the artwork to retrieve (0 is first).
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetArtworkUrlLink_BK: function (sourceFileUrl, index, callback) {
        this.Call(
            'Library_GetArtworkUrlLink_BK',
            { sourceFileUrl: sourceFileUrl, index: index },
            callback
        )
    },

    /** 
     * Retrieves a thumbnail of the picture for a specific artist. The callback is passed a url that points to
     * the image, which will be available until MusicBee is restarted, or the image is no longer available to MusicBee.
     * Library_GetArtistPictureThumbLink_BK (string artistName, function (string) callback)
     * @param {string} artistName The name of the artist for which to retrieve a thumb.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetArtistPictureThumbLink_BK: function (artistName, callback) {
        this.Call(
            'Library_GetArtistPictureThumbLink_BK',
            { artistName: artistName },
            callback
        )
    },

    /** 
     * Retrieves the location of a copy of the artwork of the current file/track (local to MusicBee).
     * Note: causes MusicBee to create a temporary file with the artwork if none was present, or the artwork was
     * embedded in the track. The callback is passed a url that points to the image, which will be available until
     * MusicBee is restarted, or the image is no longer available to MusicBee.
     * Note: use @see NowPlaying_GetArtwork instead when possible, to avoid unnecessary temporary file creation.
     * NowPlaying_GetArtworkUrlLink_BK (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetArtworkUrlLink_BK: function (callback) {
        this.Call(
            'NowPlaying_GetArtworkUrlLink_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves the location of a copy of the downloaded artwork dor the current file/track (local to MusicBee).
     * The callback is passed a url that points to the image, which will be available until MusicBee is restarted,
     * or the image is no longer available to MusicBee.
     * Note: causes MusicBee to create a temporary file with the artwork if none was present.
     * NowPlaying_GetDownloadedArtworkUrlLink_BK (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetDownloadedArtworkUrlLink_BK: function (callback) {
        this.Call(
            'NowPlaying_GetDownloadedArtworkUrlLink_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves the location of a copy of a thumbnail of an artist picture for current file/track (local to MusicBee).
     * Note: causes MusicBee to create a temporary file with the artwork if none was present. The callback is passed
     * a url that points to the image, which will be available until MusicBee is restarted, or the image is no longer
     * available to MusicBee.
     * NowPlaying_GetArtistPictureThumbLink_BK (function (string) callback)
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    NowPlaying_GetArtistPictureThumbLink_BK: function (callback) {
        this.Call(
            'NowPlaying_GetArtistPictureThumbLink_BK',
            {},
            callback
        )
    },

    /** 
     * Retrieves whether or not a specific file/track is in a specific playlist.
     * Playlist_IsInList (string playlistUrl, string sourceFileUrl, function (boolean) callback)
     * @param {string} playlistUrl The playlist to search.
     * @param {string} sourceFileUrl The file/track to search for.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_IsInList: function (playlistUrl, sourceFileUrl, callback) {
        this.Call(
            'Playlist_IsInList',
            { playlistUrl: playlistUrl, sourceFileUrl: sourceFileUrl },
            callback
        )
    },

    /** 
     * Retrieves the locations of pictures of a specific artist, either local (to MusicBee) or local and from the net.
     * Note: retrieval of local files causes MusicBee to create a temporary file with the artwork if none was present.
     * The callback is passed an array of urls that point to the images, which will be available until MusicBee is
     * restarted, or the image is no longer available to MusicBee, for local images.
     * NowPlaying_GetArtistPictureUrls (string artistName, boolean localOnly, function(string[]) callback)
     * @param {string} artistName The name of the artist for which to retrieve a thumb.
     * @param {boolean} localOnly Whether to include only local images, or to include images from the net as well.
     * @param {function(object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    Library_GetArtistPictureUrls: function (artistName, localOnly, callback) {
        this.Call(
            'Library_GetArtistPictureUrls',
            { artistName: artistName, localOnly: localOnly },
            callback
        )
    },

    /** 
     * Retrieves the locations of pictures for the artist of the current file/track, either local (to MusicBee)
     * or local and from the net.
     * Note: retrieval of local files causes MusicBee to create a temporary file with the artwork if none was present.
     * The callback is passed an array of urls that point to the images, which will be available until MusicBee is
     * restarted, or the image is no longer available to MusicBee, for local images.
     * NowPlaying_GetArtistPictureUrls (boolean localOnly, function(string[]) callback)
     * @param {boolean} localOnly Whether to include only local images, or to include images from the net as well.
     * @param {function(object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    NowPlaying_GetArtistPictureUrls: function (localOnly, callback) {
        this.Call(
            'NowPlaying_GetArtistPictureUrls',
            { localOnly: localOnly },
            callback
        )
    },

    /** 
     * Appends a set of new sourceFileUrls to a playlist.
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * Playlist_AppendFiles (string playlistUrl, string[] sourceFileUrls, function(boolean) callback)
     * @param {string} playlistUrl The location of the playlist to append to.
     * @param {string[]} sourceFileUrls An array of locations to append to the playlist.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_AppendFiles: function (playlistUrl, sourceFileUrls, callback) {
        this.Call(
            'Playlist_AppendFiles',
            { playlistUrl: playlistUrl, sourceFileUrls: sourceFileUrls },
            callback
        )
    },

    /** 
     * TODO function unknown, but works
     * Sync_FileStart (string filename, function (string) callback)
     * @param {string} filename
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Sync_FileStart: function(filename, callback) {
        this.Call(
            'Sync_FileStart',
            { filename: filename },
            callback
        )
    },

    /** 
     * TODO function unknown, but works
     * Sync_FileEnd (string filename, boolean success, string errorMessage, function (string) callback)
     * @param {string} filename
     * @param {boolean} success
     * @param {string} errorMessage
     * @param {function (object)} callback Callback function for method, expecting a (void) JSON object
     */
    Sync_FileEnd: function(filename, success, errorMessage, callback) {
        this.Call(
            'Sync_FileEnd',
            { filename: filename, success: success, errorMessage: errorMessage },
            callback
        )
    },

    /**
     * Retrieves an array of filenames (i.e. sourceFileUrls) from the library matching a specified query.
     * Library_QueryFilesEx (string query, function (string[]) callback)
     * @param {string} query Query string to select files; either "domain=SelectedFiles", "domain=DisplayedFiles"
     *   or an auto playlist xml document
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    Library_QueryFilesEx: function(query, callback) {
        this.Call(
            'Library_QueryFilesEx',
            { query: query },
            callback
        )
    },

    /**
     * Retrieves an array of filenames (i.e. sourceFileUrls) from the Now Playing List matching a specified query.
     * NowPlayingList_QueryFilesEx (string query, function (string[]) callback)
     * @param {string} query Query string to select files; either "domain=SelectedFiles", "domain=DisplayedFiles"
     *   or an auto playlist xml document
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    NowPlayingList_QueryFilesEx: function(query, callback) {
        this.Call(
            'NowPlayingList_QueryFilesEx',
            { query: query },
            callback
        )
    },

    /**
     * Retrieves the entire array of filenames (i.e. sourceFileUrls) for a specified playlist.
     * Playlist_QueryFilesEx (string playlistUrl, function (string[]) callback)
     * @param {string} playlistUrl The location of the playlist for which to get the files/tracks.
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    Playlist_QueryFilesEx: function (playlistUrl, callback) {
        this.Call(
            'Playlist_QueryFilesEx',
            { playlistUrl: playlistUrl },
            callback
        )
    },

    /**
     * Moves a set of specific files/tracks to a target position on a specific playlist.
     * Note: behavior of this function may see erratic, but remember that toIndex currently uses -1 as the top index
     * and that insertion may be confusing if the target index is among the source indices.
     * Note: in addition Playlist_MoveFiles does not accept -1 as the top index, so it's currently unable to move
     * tracks to the top position.
     * Playlist_MoveFiles (string playlistUrl, int[] fromIndices, int toIndex, function(boolean) callback)
     * @param {string} playlistUrl The location of the playlist to modify.
     * @param {int[]} fromIndices The positions of the files/tracks to move. (0 is top)
     * @param {int} toIndex The position to move the tracks to. (-1[!] is top, not counting the playing track)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_MoveFiles: function (playlistUrl, fromIndices, toIndex, callback) {
        this.Call(
            'Playlist_MoveFiles',
            { playlistUrl: playlistUrl, fromIndices: fromIndices, toIndex: toIndex },
            callback
        )
    },

    /**
     * The same as @see Playlist_MoveFiles, but without the unexpected behavior. Performance may be worse as a result,
     * but behavior is predictable. 0 is the top index, order is maintained and the order in the fromIndices array is
     * used to determine the insertion order.
     * Playlist_MoveFiles_BK (string playlistUrl, int[] fromIndices, int toIndex, function(boolean) callback)
     * @param {string} playlistUrl The location of the playlist to modify.
     * @param {int[]} fromIndices The positions of the files/tracks to move. (0 is top)
     * @param {int} toIndex The position to move the tracks to.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_MoveFiles_BK: function (playlistUrl, fromIndices, toIndex, callback) {
        this.Call(
            'Playlist_MoveFiles_BK',
            { playlistUrl: playlistUrl, fromIndices: fromIndices, toIndex: toIndex },
            callback
        )
    },

    /**
     * Causes MusicBee to start playing a specific playlist, replacing the Now Playing list.
     * Playlist_PlayNow (string playlistUrl, function(boolean) callback)
     * @param {string} playlistUrl Location of the playlist to start playing.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_PlayNow: function(playlistUrl, callback) {
        this.Call(
            'Playlist_PlayNow',
            { playlistUrl: playlistUrl },
            callback
        )
    },

    /**
     * Retrieves whether or not the currently playing file/track is a soundtrack.
     * NowPlaying_IsSoundtrack (function(boolean) callback)
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    NowPlaying_IsSoundtrack: function(callback) {
        this.Call(
            'NowPlaying_IsSoundtrack',
            {},
            callback
        )
    },

    /**
     * Retrieves the images for a playing soundtrack. (Use @see NowPlaying_IsSoundtrack to check for soundtrack)
     * Note: retrieval of local files causes MusicBee to create a temporary file with the artwork if none was present.
     * The callback is passed an array of urls that point to the images, which will be available until MusicBee is
     * restarted, or the image is no longer available to MusicBee, for local images.
     * NowPlaying_GetSoundtrackPictureUrls (boolean localOnly, function (string[]) callback)
     * @param {boolean} localOnly Whether to limit the result to local files, or to include results from the net.
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    NowPlaying_GetSoundtrackPictureUrls: function(localOnly, callback) {
        this.Call(
            'NowPlaying_GetSoundtrackPictureUrls',
            { localOnly: localOnly },
            callback
        )
    },

    /**
     * Retrieves the persistent id for a specific file/track on a specific device type. The callback is passed the id
     * as a string, or null if no device can be found.
     * Library_GetDevicePersistentId (string sourceFileUrl, idType, function(string) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {int} idType The devicetype for which to retrieve the persistent id.
     * @param {function (object)} callback Callback function for method, expecting a (string) JSON object
     */
    Library_GetDevicePersistentId: function(sourceFileUrl, idType, callback) {
        this.Call(
            'Library_GetDevicePersistentId',
            { sourceFileUrl: sourceFileUrl, idType: idType },
            callback
        )
    },

    /**
     * Assigns the persistent id for a specific file/track on a specific device type. The callback is passed the
     * success, or null if no device can be found.
     * Note: won't work if 'read only' is set in Beekeeper settings, passing null to callback.
     * Library_SetDevicePersistentId (string sourceFileUrl, DeviceIdType idType, string value, function(string) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {int} idType The DeviceIdType for which to retrieve the persistent id.
     * @param {string} value The new value for the persistent id.
     * @param {function (object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Library_SetDevicePersistentId: function(sourceFileUrl, idType, value, callback) {
        this.Call(
            'Library_SetDevicePersistentId',
            { sourceFileUrl: sourceFileUrl, idType: idType, value: value },
            callback
        )
    },

    /**
     * Retrieves a set of tracks for a given set of persistent device id's of a given device type. The callback is
     * passed an array of locations.
     * Library_FindDevicePersistentId (int idType, string[] ids, function(string[]) callback)
     * @param {int} idType The DeviceIdType of the device to use.
     * @param {string[]} ids The persistent ids of the tracks.
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    Library_FindDevicePersistentId: function(idType, ids, callback) {
        this.Call(
            'Library_FindDevicePersistentId',
            { idType: idType, ids: ids },
            callback
        )
    },

    /**
     * Retrieves the value for a given MusicBee setting.
     * Note: not all settings can be accessed using this function. Use @see Setting_GetValue_BK for all settings.
     * @param {int} settingId The SettingId of the setting that needs to be retrieved.
     * @param {function(object)} callback Callback function for method, expecting a (object) JSON object
     */
    Setting_GetValue: function (settingId, callback) {
        this.Call(
            'Setting_GetValue',
            { settingId: settingId },
            callback
        )
    },

    /**
     * Same as @see Setting_GetValue but includes additional setting types in SettingId_BK.
     * Setting_GetValue_BK (SettingId_BK settingId, function(object[]) callback)
     * @param {int} settingId The SettingId of the setting that needs to be retrieved.
     * @param {function(object)} callback Callback function for method, expecting a (object) JSON object
     */
    Setting_GetValue_BK: function (settingId, callback) {
        this.Call(
            'Setting_GetValue_BK',
            { settingId: settingId },
            callback
        )
    },

    /**
     * Retrieves multiple values for give MusicBee settings. (see@ Setting_GetValue_BK) Results are passed to the
     * callback function as an array of objects.
     * Setting_GetValues_BK (SettingId_BK[] settingIds, function(object[]) callback)
     * @param {int[]} settingIds And array of SettingId for the settings that needs to be retrieved.
     * @param {function(object)} callback Callback function for method, expecting a (object[]) JSON object
     */
    Setting_GetValues_BK: function (settingIds, callback) {
        this.Call(
            'Setting_GetValues_BK',
            { settingIds: settingIds },
            callback
        )
    },

    /**
     * Causes MusicBee to modify a given setting.
     * Setting_SetValue_BK (SettingId_BK settingId, object value, function(boolean) callback)
     * @param {int} settingId The SettingId_BK of the setting that needs to be modified.
     * @param {object} value The new value for the setting.
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Setting_SetValue_BK: function (settingId, value, callback) {
        this.Call(
            'Setting_SetValue_BK',
            { settingId: settingId, value: value },
            callback
        )
    },

    /**
     * Causes MusicBee to modify multiple settings. (see@ Setting_SetValue_BK)
     * Setting_SetValues_BK (SettingId_BK[] settingIds, object[] values, function(boolean) callback)
     * @param {int[]} settingIds An array of SettingId_BK for the settings that needs to be retrieved.
     * @param {object[]} values The new values for the settings, in the same order as settingIds.
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Setting_SetValues_BK: function (settingIds, values, callback) {
        this.Call(
            'Setting_SetValues_BK',
            { settingIds: settingIds, values: values },
            callback
        )
    },

    /**
     * Causes MusicBee to add a new file/track by location (local to MusicBee) to the library.
     * Note: the location has to be local to MusicBee, that is MusicBee needs to be able to access the file on the
     * exact same location. This library or the web client does not need to be able to access it.
     * Library_AddFileToLibrary_BK (string sourceFileUrl, LibraryCategory_BK[] categories, function(boolean) callback)
     * @param {string} sourceFileUrl Location of the file/track to add, local to MusicBee.
     * @param {int} categories Array of LibraryCategory_BK categories to add the file/track to.
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Library_AddFileToLibrary_BK: function (sourceFileUrl, categories, callback) {
        this.Call(
            'Library_AddFileToLibrary_BK',
            { sourceFileUrl: sourceFileUrl, category: categories },
            callback
        )
    },

    /**
     * Causes MusicBee to delete a specific playlist.
     * @param {string} playlistUrl Location of the playlist to delete (local to MusicBee).
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     */
    Playlist_DeletePlaylist: function (playlistUrl, callback) {
        this.Call (
            'Playlist_DeletePlaylist',
            { playlistUrl: playlistUrl },
            callback
        )
    },

    /**
     * Retrieves changes to the MusicBee library since a specified date in a specified category.
     * The callback is passed an object with attributes string[] newFiles, string[] updatedFiles and string[]
     * deletedFiles; all of which are arrays with sourceFileUrl's (local to MusicBee).
     * Library_GetSyncDelta (string[] cachedFiles, DateTime updatedSince, LibraryCategory_BK category,
     *   function(object) callback)
     * @param {string[]} cachedFiles TODO cachedFiles parameter function unknown, pass []
     * @param {Date} updatedSince Start DateTime (through now) for which to return changes.
     * @param {int} category LibraryCategory_BK of MusicBee library items for which to return changes.
     * @param {function(object)} callback Callback function for method, expecting a (object) JSON object
     */
    Library_GetSyncDelta: function (cachedFiles, updatedSince, category, callback) {
        this.Call (
            'Library_GetSyncDelta',
            { cachedFiles: cachedFiles, updatedSince: updatedSince, category: category },
            callback
        )
    },

    /**
     * Retrieves a set of metadata fields (tags) for the given source file. Array of tags is reported to callback.
     * Library_GetFileTags (string sourceFileUrl, MetaDataType[] fields, function (string[] output) callback)
     * @param {string} sourceFileUrl Path to music file in database
     * @param {int[]} fields Names of fields to retrieve
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    Library_GetFileTags: function(sourceFileUrl, fields, callback) {
        this.Call(
            'Library_GetFileTags',
            { sourceFileUrl : sourceFileUrl, fields: fields },
            callback
        );
    },

    /**
     * Retrieves a set of metadata fields (tags) for the Now Playing file/track. Array of tags is reported to callback.
     * NowPlaying_GetFileTags (MetaDataType[] fields, function (string[] output) callback)
     * @param {int[]} fields Names of fields to retrieve
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    NowPlaying_GetFileTags: function(fields, callback) {
        this.Call(
            'NowPlaying_GetFileTags',
            { fields: fields },
            callback
        );
    },

    /**
     * Retrieves a set of metadata fields (tags) for a file/track in the Now Playing list. Array of tags is reported to
     * callback.
     * NowPlayingList_GetFileTags (int index, MetaDataType[] fields, function (string[] output) callback)
     * @param {int} index Index of the track in the Now Playing list (0 is top item).
     * @param {int[]} fields Names of fields to retrieve
     * @param {function (object)} callback Callback function for method, expecting a (string[]) JSON object
     */
    NowPlayingList_GetFileTags: function(index, fields, callback) {
        this.Call(
            'NowPlayingList_GetFileTags',
            { index: index, fields: fields },
            callback
        );
    },

    /**
     * Causes MusicBee to start the download of a specific file, to a specified DownloadTarget in a specified
     * targetFolder. Pass cancelDownload as true to stop a download started with MB_DownloadFile.
     * MB_DownloadFile (string url, DownloadType target, string targetFolder, bool cancelDownload, function(bool)
     *  callback)
     * @param {string} url The location (from MusicBee perspective) of the file to download.
     * @param {int} target The DownloadTarget to download to.
     * @param {string} targetFolder The target folder in the download target to download to.
     * @param {boolean} cancelDownload Whether to cancel the download (true) or initiate it (false).
     * @param {function(object)} callback Callback function for method, expecting a (boolean) JSON object
     * @constructor
     */
    MB_DownloadFile: function(url, target, targetFolder, cancelDownload, callback) {
        this.Call(
            'MB_DownloadFile',
            { url: url, target: target, targetFolder: targetFolder, cancelDownload: cancelDownload },
            callback
        )
    },

    /**
     * Collection of eventListeners. Use @see AddEventListener and @see RemoveEventListener to modify
     */
    eventListeners: {},

    /**
     * eventTimeout should always be above or equal to BeekeeperServer.longPollingDelay (Beekeeper.cs)
     */
    eventTimeout: 5000,
    pauseAfterError: 10000,
    catchingEvents: false,

    /**
     * Default url for catching events.
     * Needs to point to http://musicbee_machine:beekeeper_port/events
     */
    eventsUrl: '/api/events',

    AddEventListener: function (eventListener, events) {
        this.eventListeners[eventListener] = {
            listener: eventListener,
            events: events
        }
    },

    RemoveEventListener: function (eventListener) {
        // delete the listener from the array of listeners
        delete this.eventListeners[eventListener];
    },

    SendEvent: function (event) {
        for (var key in this.eventListeners) {
            // if key is one of the added events
            if (this.eventListeners.hasOwnProperty(key)) {
                // if this eventListener listens to everything
                if (this.eventListeners[key].events == undefined ||
                    // or it listens to this specific event
                    (this.eventListeners[key].events.indexOf('testEvent')) > -1)
                // call the listener
                    this.eventListeners[key].listener.apply(null, [event["Name"]].concat(event["Parameters"]));
            }
        }
    },

    TestEventListeners: function (data) {
        this.SendEvent({
            Name: "testEvent",
            Parameters: [data]
        });
    },

    /**
     * Reports whether or not Beekeeper is catching events (and sending them to listeners).
     * @returns {boolean}
     */
    IsCatchingEvents: function() {
        return (this.catchingEvents && (Beekeeper.currentEventCall!==undefined));
    },

    StartCatchingEvents: function(eventsUrl) {
        // This requests events from the Beekeeper plugin
        if (eventsUrl!==undefined) {
            this.eventsUrl = eventsUrl;
        }
        if (this.currentEventCall && this.currentEventCall.readyState !== 4) {
            // Already polling, don't start another
            return;
        }
        this.catchingEvents = true;
        Beekeeper.currentEventCall = $.ajax({
            type: "GET",
            url: Beekeeper.eventsUrl,

            async: true, // if set to non-async, browser shows page as "Loading.."
            cache: false,
            timeout: Beekeeper.eventTimeout, // timeout in ms on client

            success: function(data){ // called when request for events completes
                if (data!=null) {
                    var length = data.length;
                    for (var i=0; i<length; i++) {
                        Beekeeper.SendEvent(data[i]);
                    }
                }
                setTimeout(
                    Beekeeper.StartCatchingEvents, 0 // try again immediately
                );
            },

            error: function(XMLHttpRequest, textStatus, errorThrown){
                Beekeeper.SendEvent({
                    Name: "eventError",
                    Error: textStatus + " (" + errorThrown + ")"
                });
                // abort also results in 'error', check if we need to keep going
                if (Beekeeper.catchingEvents) {
                    setTimeout(
                        Beekeeper.StartCatchingEvents, // try again but first wait
                        Beekeeper.pauseAfterError); // milliseconds (5 seconds)
                }
            }
        });
    },
    StopCatchingEvents: function() {
        this.catchingEvents = false;
        if (Beekeeper.currentEventCall!==undefined) {
            Beekeeper.currentEventCall.abort();
        }
        delete Beekeeper.currentEventCall;
    }
};

