// wait for DOM to load before running JS that uses DOM elements
$(document).ready(function() {

  // check to make sure JS is loaded
  console.log('JS is connected to HTML, and DOM is ready!');

  // form to search spotify API
  var $spotifySearch = $('#spotify-search');

  // input field for track (song)
  var $track = $('#track');

  // element to hold results from spotify API
  var $results = $('#results');

  // loading gif
  var $loading = $('#loading');


  // submit form to search spotify API
  $spotifySearch.on('submit', function(event) {
    event.preventDefault();

    // empty previous results
    $results.empty();

    // save form data to variable
    var searchTrack = $track.val();

    // only search if the form has a keyword to search with!
    if (searchTrack !== ""){
      // show loading gif
      $loading.show();

      // spotify search URL
      var searchUrl = 'https://api.spotify.com/v1/search?type=track&q=' + searchTrack;

      // use AJAX to call spotify API
      $.ajax({
        method: 'GET',
        url: searchUrl,
        success: handleSpotifyData // see this function defined below
      });
    } else {
      // remind the user to enter a keyword
      // one way is a "quick and ugly" alert
      alert("Enter a keyword to search!");
    }

    // reset the form
    $spotifySearch[0].reset();
    // give focus back to track name field
    $track.focus();
  });


  // handles results received from spotify
  function handleSpotifyData(spotifyResults) {
    console.log("received results:", spotifyResults);

    // track results are in an array called `items`
    // which is nested in the `tracks` object
    var trackResults = spotifyResults.tracks.items;
    console.log('search result tracks:', trackResults);
    console.log('search result tracks0:', trackResults[0]);


    if(trackResults.length === 0) {
      alert("There is no match with the name you input");
    } else {


      // console.log("trackResults :" trackResults.album.images[0].url)

      // hide loading gif
      $loading.hide();

      var source = $("#spotify-li-template").html();
      var template = Handlebars.compile(source);


      for(var i = 0; i < trackResults.length; i++) {
        var spotifyTemplate = {
          albumUrl: trackResults[i].album.images[0].url,
          songTitle: trackResults[i].album.name,
          artistName: trackResults[i].artists[0].name,
          previewUrl: trackResults[i].preview_url
        }
        var tempHtml = template(spotifyTemplate)
        $('#results').append(tempHtml);
      }
    }

    // show results on page:
    // iterate through results
    // trackResults.forEach(function (result, index) {
    //   use results to construct HTML we want to show
    //   **** GAAAAAH! THERE HAS TO BE A BETTER WAY! ****//
    //   var trackHtml = '<div class="row"><div class="col-xs-4">' +
    //     '<img src="' + result.album.images[0].url + '" class="img-responsive"></div>' +
    //     '<div class="col-xs-8"><p><strong>' + result.name + '</strong> by ' +
    //     result.artists[0].name + '</p><p><a href="' + result.preview_url +
    //     '" target="_blank" class="btn btn-sm btn-default">Preview ' +
    //     '<span class="glyphicon glyphicon-play"></span></a></p></div></div><hr>';
    //   //
    //
    //   var source = $("#spotify-li-template").html();
    //   var template = Handlebars.compile(source);
    //
    //
    //
    //   var spotifyTemplate = {
    //     album_url: result.album.images[0].url,
    //     song_title: result.album.name,
    //     artist_name: result.artists[0].name,
    //     preview_url: result.preview_url
    //   }
    //
    //
    //
    //   var tmepHtml = template(spotifyTemplate)
    //     var tempHtml = <div class="row">
    //                      <div class='col-sx-4'>
    //                        <img src="{{album-url}}" class="img-responsive"></div>
    //                        <div class="col-xs-8">
    //                        <p><strong>{{name}}</strong> by {{artist-name}}</p>
    //                        <p><a href="{{preview-url}}" target="_blank" class="btn btn-sm btn-default">Preview
    //                        <span class="glyphicon glyphicon-play"></span>
    //                        </a></p>
    //                      </div>
    //                    </div>
    //                    <hr>
    //
    //   // append HTML to the view
    //   $('#results').append(tempHtml);
    // });
  }

});
