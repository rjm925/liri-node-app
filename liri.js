//Obtains keys from keys.js
var keys = require("./keys.js");

//Gets the function to be called
var command = process.argv[2];
//Calls for reads/appends
var fs = require("fs");

//my-tweets function
function twitter() {
	//initialized twitter
	var Twitter = require('twitter');
 
 	//Sets keys to access twitter
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	 
	//Looks for my account
	var params = {screen_name: 'Season1TSMFan'};
	//Twitter function to obtain information
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		//If no error
	  if (!error) {
	  	//Writes command to log.txt
	  	fs.appendFile("log.txt", "\n" + command + "\n");
	  	//Goes through most recent 20 tweets
  		for (var i = 0; i < tweets.length; i++) {
  			//Prints tweet to console with creation date
	  		console.log(tweets[i].text + " Created: " + tweets[i].created_at + "\n");
	  		//Tweet and creation date appended to log.txt
	  		fs.appendFile("log.txt", tweets[i].text + " Created: " + tweets[i].created_at + "\n");
	  	}
	  }
	});
}

//spotify-this-song function
function spotify(title) {
	//Initialize spotify
	var Spotify = require('node-spotify-api');
 
 	//Initializes spotifykeys
	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});

	//Default search if no input
	if (title === undefined) {
		title = "The Sign";
	}
	
	//Spotify query to find songs based on title
	spotify.search({ type: 'track', query: title}, function(err, data) {
		//Logs error if error
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	  
	  //Writes command to log.txt
	  fs.appendFile("log.txt", "\n" + command + "\n");
	  //Loops through 20 results
	  for (var i = 0; i < data.tracks.limit; i++) {
	  	//Stores data information
	  	var artists = data.tracks.items[i].artists[0].name;
		  var name = data.tracks.items[i].name;
		  var link = data.tracks.items[i].external_urls.spotify;
		  var album = data.tracks.items[i].album.name;

		  //Logs data information
		  console.log(i+1);
			console.log("Artists: " + artists);
			console.log("Name: " + name);
			console.log("Link: " + link);
			console.log("Album: " + album);
			console.log("\n-----------------------------------------------------------\n");

			//Appends data information to log.txt
			fs.appendFile("log.txt", (i+1) + "\n");
			fs.appendFile("log.txt", artists + "\n");
			fs.appendFile("log.txt", name + "\n");
			fs.appendFile("log.txt", link + "\n");
			fs.appendFile("log.txt", album + "\n");
	  }	  
	});
}

//movie-this function 
function movie(search) {
	//Initialize request
	var request = require('request');
	//Base URL for request link
	var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=";

	//Default search if no input
	if (search === undefined) {
		search = "Mr. Nobody"
	}

	//Request query to find movie from omdbapi
	request(queryURL + search, function (error, response, body) {
		//Movie info result
	  var info = JSON.parse(body);
	  var title = info.Title;
	  var year = info.Year;
	  var imdb = info.Ratings[0].Value;
	  var rotten = info.Ratings[1].Value;
	  var country = info.Country;
	  var language = info.Language;
	  var plot = info.Plot;
	  var actors = info.Actors;

	  //Logs movie info
	  console.log("Title: " + title);
	  console.log("\nYear: " + year);
	  console.log("\nIMDB Rating: " + imdb);
	  console.log("\nRotten Tomatoes Rating: " + rotten);
	  console.log("\nCountry: " + country);
	  console.log("\nLanguage: " + language);
	  console.log("\nPlot: " + plot);
	  console.log("\nActors: " + actors);

	  //Appends movie info to log.txt
	  fs.appendFile("log.txt", "\n" + command + "\n");
	  fs.appendFile("log.txt", title + "\n");
	  fs.appendFile("log.txt", year + "\n");
	  fs.appendFile("log.txt", imdb + "\n");
	  fs.appendFile("log.txt", rotten + "\n");
	  fs.appendFile("log.txt", country + "\n");
	  fs.appendFile("log.txt", language + "\n");
	  fs.appendFile("log.txt", plot + "\n");
	  fs.appendFile("log.txt", actors + "\n");
	});
}

//Determine which function to run based on command input
if (command === "my-tweets") {
	twitter();
}
else if (command === "spotify-this-song") {
	spotify(process.argv[3]);
}
else if (command === "movie-this") {
	movie(process.argv[3]);
}
else if (command === "do-what-it-says") {
	//Reads the random.txt file to determine function
	fs.readFile("random.txt", "utf8", function(error, data) {
		//Displays error if necessary
		if (error) {
			return console.log(error);
		}

		//Separates strings in random.txt when , found
		var dataArr = data.split(",");
		//First string in file, should be command
		var command = dataArr[0];

		//Appends command inside random.txt
		fs.appendFile("log.txt", "\n" + command);
		//Determines command function based on string found
		if (command === "my-tweets") {
			twitter();
		}
		else if (command === "spotify-this-song") {
			//Second string in random.txt used for search
			spotify(dataArr[1]);
		}
		else if (command === "movie-this") {
			//Second string in random.txt used for search
			movie(dataArr[1]);
		}
	});
}