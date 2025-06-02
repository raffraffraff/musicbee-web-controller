function setPlayPause(isPlaying) {
    if (isPlaying) {
        $("#playIcon").hide();
        $("#pauseIcon").show();
    } else {
        $("#playIcon").show();
        $("#pauseIcon").hide();
    }
}

function updateStars(stars) {
    // stars: 0-5
    $("#npStars .star").each(function(index) {
        if (index < stars) {
            $(this).addClass("filled");
        } else {
            $(this).removeClass("filled");
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

let player = {
    updateControls: function(playState) {
        switch (playState) {
            case Beekeeper.PlayState.Loading:
                $("#cPlayPause").removeClass("active");
                $("#cStop").removeClass("active");
                setPlayPause(false); // Show play icon
                break;
            case Beekeeper.PlayState.Paused:
                $("#cPlayPause").addClass("active");
                $("#cStop").addClass("active");
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
        $('#npCover > img').css('opacity', 0.4);
        Beekeeper.NowPlaying_GetArtwork(
            function(data){
                if (data && data.error) {
                    console.error(data.error);
                    $('#npCover').html("<div class='error'>No cover available</div>");
                    return;
                }
                $('#npCover').html("<img src='data:image/jpg;base64," + data + "'/>");
                $('#npCover > img').on('load', function() {
                    $('#npCover > img').css('opacity', 1);
                });
            }
        );
        Beekeeper.NowPlaying_GetFileTags(
            [
                Beekeeper.MetaDataType.TrackTitle, 
                Beekeeper.MetaDataType.Artist,
                Beekeeper.MetaDataType.Rating,
                Beekeeper.MetaDataType.RatingLove,
            ],
            function(data){
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
                let num = Number(data[2]);
                if (isNaN(num) || num < 0 || num > 5) {
                    num = 0; // Default to 0 if invalid
                }
                updateStars(num);

                // Love
                let love = data[3];
                let loved = (love === "L" || love === "1" || love === 1 || love === true);
                updateLove(loved);
            }
        );

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
                player.updateNowPlaying(data.fileUrl);
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

        $("#npCover").click(
            function(){ screenfull.request(); }
        );

        Beekeeper.AddEventListener(player.handleEvent);
        Beekeeper.StartCatchingEvents('/events');
    }
};

$(document).ready(function() {
    Beekeeper.Setting_GetDefaultFontName_BK(
        function(data){
            $('body').css ('font-family', data + ',sans-serif');
        }
    );
    player.start();
});