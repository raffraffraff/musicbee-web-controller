function setPlayPause(isPlaying) {
    if (isPlaying) {
        $("#playIcon").hide();
        $("#pauseIcon").show();
    } else {
        $("#playIcon").show();
        $("#pauseIcon").hide();
    }
}

function updateStars(rating) {
    // rating: 0–5, can be 0.5 steps
    $("#npStars .star").each(function(index) {
        console.log('Updating star', index, 'for rating', rating);
        
        const starPath = $(this).find('path')[0];  // Get the DOM element directly
        
        if (rating >= index + 1) {
            // Full star
            console.log('Setting full star', index);
            starPath.style.fill = '#FFD700';
        } else if (rating >= index + 0.5) {
            // Half star
            console.log('Setting half star', index);
            starPath.style.fill = `url(#half-gradient-${index + 1})`;
        } else {
            // Empty star
            console.log('Setting empty star', index);
            starPath.style.fill = '#bbb';
        }
    });
}

function updateLove(loved) {
    if (loved) {
        $("#npLove").addClass("loved");
    } else {
        $("#npLove").removeClass("loved");
    }
}

let currentFileUrl = null;
let currentTrackTags = null; // [TrackTitle, Artist, Album, Rating, RatingLove]

function fetchAndSetFileUrlAndTags(callback) {
    Beekeeper.NowPlaying_GetFileUrl(function(url) {
        currentFileUrl = url;
        fetchTrackTags(url, function(tags) {
            currentTrackTags = tags;
            if (callback) callback(url, tags);
        });
    });
}

function fetchTrackTags(fileUrl, callback) {
    Beekeeper.Library_GetFileTags(
        fileUrl,
        [
            Beekeeper.MetaDataType.TrackTitle,
            Beekeeper.MetaDataType.Artist,
            Beekeeper.MetaDataType.Album,
            Beekeeper.MetaDataType.Rating,
            Beekeeper.MetaDataType.RatingLove,
        ],
        callback
    );
}

// JS-side in-memory cache for album art
const albumArtCache = new Map(); // key: artist::album or artist::

const player = {
    updateCoverArt: function() {
        if (!currentFileUrl) {
            console.warn('updateCoverArt: currentFileUrl is not set.');
            return;
        }
        if (!currentTrackTags) {
            console.warn('updateCoverArt: currentTrackTags is not set.');
            return;
        }
        $('#npCover > img').css('opacity', 0.4);
        var artist = currentTrackTags[1] || '';
        var album = currentTrackTags[2] || '';
        var cacheKey = artist + '::' + (album || '');
        // Try cache first
        if (albumArtCache.has(cacheKey)) {
            const data = albumArtCache.get(cacheKey);
            $('#npCover').html("<img src='data:image/jpg;base64," + data + "'/>");
            $('#npCover > img').on('load', function() {
                $('#npCover > img').css('opacity', 1);
            });
            console.log('Loaded artwork from JS cache for', cacheKey);
            return;
        }
        // Not in cache, fetch from backend
        console.log('Artwork request for artist:', artist, 'album:', album);
        Beekeeper.Library_GetArtwork(
            cacheKey, // still pass artist::album as first arg for backend
            currentFileUrl,
            0,
            function(data){
                if (data && data.error) {
                    console.error(data.error);
                    $('#npCover').html("<div class='error'>No cover available</div>");
                    return;
                }
                albumArtCache.set(cacheKey, data); // cache it
                $('#npCover').html("<img src='data:image/jpg;base64," + data + "'/>");
                $('#npCover > img').on('load', function() {
                    $('#npCover > img').css('opacity', 1);
                });
            }
        );
    },

    updateTrackInfo: function() {
        if (!currentTrackTags) {
            console.warn('updateTrackInfo: currentTrackTags is not set.');
            return;
        }
        let data = currentTrackTags;
        if (data && data.error) {
            console.error(data.error);
            $("#npTrack").text("No track title");
            $("#npArtist").text("No artist");
            updateStars(0);
            updateLove(false);
            return;
        }
        // Artist and title
        $("#npArtist").text(data[1]);
        $("#npTrack").text(data[0]);
        // Rating
        let num = Number(data[3]);
        if (isNaN(num) || num < 0 || num > 5) {
            num = 0; // Default to 0 if invalid
        }
        updateStars(num);
        // Love
        let love = data[4];
        let loved = (love === "L" || love === "1" || love === 1 || love === true);
        updateLove(loved);
    },

    updateControls: function(playState) {
        switch (playState) {
            case Beekeeper.PlayState.Loading:
                $("#cPlayPause").removeClass("active");
                $("#cStop").removeClass("active");
                setPlayPause(false); // Show play icon
                break;
            case Beekeeper.PlayState.Paused:
                $("#cPlayPause").addClass("active");
                $("#cStop").removeClass("active");
                setPlayPause(false); // Show play icon
                break;
            case Beekeeper.PlayState.Playing:
                $("#cPlayPause").addClass("active");
                $("#cStop").addClass("active");
                setPlayPause(true); // Show pause icon
                break;
            case Beekeeper.PlayState.Stopped:
                $("#cPlayPause").addClass("active");
                $("#cStop").removeClass("active");
                setPlayPause(false); // Show play icon
                break;
            case Beekeeper.PlayState.Undefined:
                $("#cPlayPause").removeClass("active");
                $("#cStop").removeClass("active");
                setPlayPause(false); // Show play icon
                break;
        }
        Beekeeper.NowPlayingList_IsAnyFollowingTracks(function(data) {
            if (data && data.error) {
                console.error(data.error);
                return;
            }
            if (data) {
                $("#cNextTrack").addClass("active");
            } else {
                $("#cNextTrack").removeClass("active");
            }
        });
        Beekeeper.NowPlayingList_IsAnyPriorTracks(function(data) {
            if (data && data.error) {
                console.error(data.error);
                return;
            }
            if (data) {
                $("#cPreviousTrack").addClass("active");
            } else {
                $("#cPreviousTrack").removeClass("active");
            }
        });
    },

    updateNowPlaying: function(fileUrl) {
        if (!fileUrl) {
            console.warn('updateNowPlaying called with invalid fileUrl:', fileUrl);
            return;
        }
        currentFileUrl = fileUrl;
        fetchTrackTags(fileUrl, function(tags) {
            currentTrackTags = tags;
            player.updateTrackInfo();
            player.updateCoverArt();
        });
    },

    handleEvent: function(event, data) {
        if (event === "error") {
            console.error(data);
            return;
        }
        if (event === "eventError") {
            console.error(data);
            return;
        }
        switch (event) {
            case "TrackChanged":
                if (data && data.fileUrl) {
                    player.updateNowPlaying(data.fileUrl);
                } else {
                    Beekeeper.NowPlaying_GetFileUrl(player.updateNowPlaying);
                }
                break;
            case "PlayStateChanged":
                player.updateControls(data.playState);
                break;
            case "eventError":
                console.log(data);
        }
    },

    cNextTrack: function() {
        $('#npCover > img').css('opacity', 0.4);
        Beekeeper.Player_PlayNextTrack(function() {
            Beekeeper.NowPlaying_GetFileUrl(player.updateNowPlaying);
        });
    },
    cPreviousTrack: function() {
        $('#npCover > img').css('opacity', 0.4);
        Beekeeper.Player_PlayPreviousTrack(function() {
            Beekeeper.NowPlaying_GetFileUrl(player.updateNowPlaying);
        });
    },
    cPlayPause: function() {
        Beekeeper.Player_PlayPause(function() {
            Beekeeper.NowPlaying_GetFileUrl(player.updateNowPlaying);
        });
    },
    cStop: function() {
        $('#npCover > img').css('opacity', 0.4);
        Beekeeper.Player_Stop(function() {
            Beekeeper.NowPlaying_GetFileUrl(player.updateNowPlaying);
        });
    },

    start: function() {
        Beekeeper.Player_GetPlayState(player.updateControls);
        Beekeeper.NowPlaying_GetFileUrl(player.updateNowPlaying);

        $("#cPreviousTrack").click(player.cPreviousTrack);
        $("#cPlayPause").click(player.cPlayPause);
        $("#cStop").click(player.cStop);
        $("#cNextTrack").click(player.cNextTrack);

        $("#npLove").click(function() {
            Beekeeper.NowPlaying_GetFileUrl(function(fileUrl) {
                // Toggle loved status
                const isLoved = $("#npLove").hasClass("loved");
                const newValue = isLoved ? "" : "L"; // Unlove if loved, love if not
                Beekeeper.Library_SetFileTag(fileUrl, Beekeeper.MetaDataType.RatingLove, newValue, function() {
                    Beekeeper.Library_CommitTagsToFile(fileUrl, function() {
                        // Optionally update UI immediately, or re-fetch tags
                        updateLove(!isLoved);
                    });
                });
            });
        });

        $("#npStars .star").each(function(index) {
            $(this).off("click").on("click", function(e) {
                // Get the bounding box of the star
                const offset = $(this).offset();
                const width = $(this).width();
                const x = e.pageX - offset.left;

                // If click is on left half, set half-star; right half, set full star
                let rating = index + (x < width / 2 ? 0.5 : 1);

                // Save rating to MusicBee
                Beekeeper.NowPlaying_GetFileUrl(function(fileUrl) {
                    Beekeeper.Library_SetFileTag(fileUrl, Beekeeper.MetaDataType.Rating, rating.toString(), function() {
                        Beekeeper.Library_CommitTagsToFile(fileUrl, function() {
                            updateStars(rating);
                        });
                    });
                });
            });
        });

        Beekeeper.AddEventListener(player.handleEvent);
        Beekeeper.StartCatchingEvents('/api/events');
    }
};

$(document).ready(function() {
    Beekeeper.Setting_GetDefaultFontName_BK(
        function(data){
            $('body').css ('font-family', data + ',sans-serif');
        }
    );
    fetchAndSetFileUrlAndTags(() => player.start());
});
