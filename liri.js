// I just made the credentials and access to de npm and APis so we dont have problems running it

// Require the dotenv package so that we can load our API credentials from the `.env` file
require("dotenv").config();

// Require our keys file so that our NPM modules can use them later
var keys = require("./key.js");

// Load the fs module so that we can read and write from the file system
var fs = require("fs");

// Load our NPM packages
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");

// Use the Spotify and Twitter packages to create connections to the API
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var input = process.argv[3];

// We will then create a switch-case statement (if-else would also work).
// The switch-case will direct which function gets run.
switch (command) {
    case 'my-tweets':
        myTweets();
        break;
    
    case 'spotify-this-song':
    spotifyThisSong();
        break;
    
    case 'movie-this':
        movieThis();
        break;

    case 'do-what-it-says':
        doWhatItSays();    

}

function myTweets() {
    
    console.log("========== Tweets ==========");
    // Twitter API parameters
	var params = {
		screen_name: 'dsuperchick',
		count: 20
	};

	// GET request for last 20 tweets on my account's timeline
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) { // if there IS an error
			console.log('Error occurred: ' + error);
		} else { // if there is NO error
	  	console.log("My 20 Most Recent Tweets");
	  	console.log("");

	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("( #" + (i + 1) + " )  " + tweets[i].text);
	  		console.log("Created:  " + tweets[i].created_at);
	  		console.log("");
	  	}
      }
     
    });
   
}

function spotifyThisSong(){
    console.log("========== spotify ==========");
    //var noInput = fs.readFile("./random.txt", "utf8", function (error, data) {
      //  var dataArr = data.split(",");
        // console.log (noInput);
        //console.log(dataArr);
   // });

    if(input === undefined){
        input = "The Sign";
    }
      
    spotify.search({ type: 'track', query: input }, function(err, data) {
        
        if (err) {
            console.log('ERROR: ' + err);
            return; 
        } else {
            var songInfo = data.tracks.items[0];
            console.log(" " + " " + "SPOTIFY RESULTS: " + " " + " ")
            console.log("ARTIST:", songInfo.artists[0].name);
            console.log("SONG:", songInfo.name);
            console.log("ALBUM:", songInfo.album.name);
            console.log("PREVIEW:", songInfo.preview_url);
            fs.appendFile("log.txt", songInfo.artists[0].name + songInfo.name + songInfo.album.name + songInfo.preview_url, function(err) { 
                if (err) {
                    console.log("ERROR")
                }
            });
        };
            
    });
}

    
function movieThis(){

    if(input === undefined){
        input = "mr.Nobody";
    }

    request("http://www.omdbapi.com/?apikey=trilogy&t=" + input, function(error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {

            // Then log the body from the site!
            var movieObject = JSON.parse(body);
            console.log(" " + " " + "Movie Results: " + " " + " ")
            console.log("Title:", movieObject.Title);
            console.log("Released:", movieObject.Year);
            console.log("IMDB Ratings:", movieObject.imdbRating);
            console.log("Rotten Tomatoes:", movieObject.Ratings[1].Value);
            console.log("Country Produce:", movieObject.Country);
            console.log("Language:", movieObject.Language);
            console.log("Plot:", movieObject.Plot);
            console.log("Actors:", movieObject.Actors);
            fs.appendFile("log.txt", movieObject.Title + movieObject.Year + movieObject.Country + movieObject.Language + movieObject.Plot + movieObject.Actors, function(err) { 
                if (err) {
                    console.log("ERROR")
                }
            });
        }
    });

};




function doWhatItSays(){

    var noInput = fs.readFile("./random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
        // console.log (noInput);
        //console.log(dataArr);
        command = dataArr[0]
        input = dataArr[1]
        switch (command) {
            case 'my-tweets':
                myTweets();
                break;
            
            case 'spotify-this-song':
            spotifyThisSong();
                break;
            
            case 'movie-this':
                movieThis();
                break;
        
            case 'do-what-it-says':
                doWhatItSays();    
        
        }
    }); 

};