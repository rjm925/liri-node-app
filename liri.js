//Obtains keys from keys.js
var keys = require("./keys.js");
//Calls for reads/appends
var fs = require("fs");
//Calls inquirer package
var inquirer = require("inquirer");
//Prompts user for command
inquirer
	.prompt([
		{
			type: "list",
			message: "What command would you like to run?",
			choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
			name: "command"
		}
		])
		.then(function(response) {
			var command = response.command;

			//Determine which function to run based on command input
			if (command === "my-tweets") {
				//Writes command to log.txt
				fs.appendFileSync("log.txt", "\nCommand: " + command + "\n");
				//Calls twitter function
				twitter();
			}
			else if (command === "spotify-this-song") {
				//Writes command to log.txt
				fs.appendFileSync("log.txt", "\nCommand: " + command + "\n");
				//Prompts user for song title
				inquirer
					.prompt([
						{
							type: "input",
							message: "What song would you like to search?",
							name: "title"
						}
					])
					.then(function(response) {
						spotify(response.title);
					})
			}
			else if (command === "movie-this") {
				//Writes command to log.txt
				fs.appendFileSync("log.txt", "\nCommand: " + command + "\n");
				//Prompts user for movie title
				inquirer
					.prompt([
						{
							type: "input",
							message: "What movie would you like to search?",
							name: "title"
						}
					])
					.then(function(response) {
						movie(response.title);
					})
			}
			else if (command === "do-what-it-says") {
				//Writes command to log.txt
				fs.appendFileSync("log.txt", "\nCommand: " + command + ": ")
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
					fs.appendFile("log.txt", command + "\n");
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
		})

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
	  	//Goes through most recent 20 tweets
  		for (var i = 0; i < tweets.length; i++) {
  			//Prints tweet to console with creation date
	  		console.log(tweets[i].text + " Created: " + tweets[i].created_at + "\n");
	  		//Tweet and creation date appended to log.txt
	  		fs.appendFileSync("log.txt", tweets[i].text + " Created: " + tweets[i].created_at + "\n");
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
	if (title === "") {
		title = "The Sign";
	}
	
	//Spotify query to find songs based on title
	spotify.search({ type: 'track', query: title}, function(err, data) {
		//Logs error if error
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	  
	  //Loops through 20 results
	  for (var i = 0; i < data.tracks.limit; i++) {
	  	//Stores data information
	  	var artists = data.tracks.items[i].artists[0].name;
		  var name = data.tracks.items[i].name;
		  var link = data.tracks.items[i].external_urls.spotify;
		  var album = data.tracks.items[i].album.name;

		  //If there are multiple artists
		  if (data.tracks.items[i].artists.length > 1) {
		  	//Loops through array of artists
		  	for (var j = 1; j < data.tracks.items[i].artists.length; j++) {
		  		//Adds artists together
		  		artists += ", " + data.tracks.items[i].artists[j].name;
		  	}
		  }

		  //Logs data information
		  console.log(i+1);
			console.log("Artists: " + artists);
			console.log("Name: " + name);
			console.log("Link: " + link);
			console.log("Album: " + album);
			console.log("\n-----------------------------------------------------------\n");

			//Appends data information to log.txt
			fs.appendFileSync("log.txt", (i+1) + "\n");
			fs.appendFileSync("log.txt", "Artists: " + artists + "\n");
			fs.appendFileSync("log.txt", "Name: " + name + "\n");
			fs.appendFileSync("log.txt", "Spotify link: " + link + "\n");
			fs.appendFileSync("log.txt", "Album: " + album + "\n");
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
	if (search === "") {
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
	  fs.appendFileSync("log.txt", "Title: " + title + "\n");
	  fs.appendFileSync("log.txt", "Year: " + year + "\n");
	  fs.appendFileSync("log.txt", "IMDB Rating: " + imdb + "\n");
	  fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + rotten + "\n");
	  fs.appendFileSync("log.txt", "Country: " + country + "\n");
	  fs.appendFileSync("log.txt", "Language: " + language + "\n");
	  fs.appendFileSync("log.txt", "Plot: " + plot + "\n");
	  fs.appendFileSync("log.txt", "Actors: " + actors + "\n");
	});
}