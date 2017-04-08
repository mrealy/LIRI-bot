var command = process.argv[2];
var string = process.argv[3];

function parseCommand() {

	var twitterKeys = require('./keys.js').twitterKeys;

	// Gives basic instructions if user doesn't enter in a command
	if(command === undefined) {
		console.log('After you type \'node liri.js\' append a command (in quotation marks) from below:');
		console.log('-------------------------------------------------------------------------------')
		console.log('Command: \'my-tweets\' to list tweets of @mjrealy');
		console.log('Command: \'spotify-this-song\' followed by a song title (in quotation marks) to receive information on a song from Spotify API');
		console.log('Command: \'movie-this\' followed by a movie title (in quotation marks) to receive information on a movie from OMDB API');
		console.log('Command: \'do-what-it-says\' to pull command information from random.txt file.');
	}

	// my-tweetC will show all of my tweets because I'm not going to make 20 of them
	if (command === 'my-tweets') {

		var Twitter = require('twitter');

		var client = new Twitter(twitterKeys);
		var params = {screen_name: 'mjrealy'};

		client.get('statuses/user_timeline', params, gotData);

		function gotData(error, data, response) {

			console.log('=================================');
			console.log('List of recent tweets by @mjrealy');
			console.log('=================================');

			for (i = 0; i < data.length; i++) {
				var test = data[i];
				console.log(test.text);
				console.log('-----------------------------------------------------------------');
			}
		}
	};

	// spotify-this-song 'I Want it That Way'
	// In the terminal, this will show Artist, songs name, preview link, album name
	// if no song is provided then default to "The Sign" by Ace of Base
	if (command === 'spotify-this-song') {
		var songTitle;

		if (string === undefined) {
			// if no song is provided then default to "The Sign" by Ace of Base
			songTitle = 'Ace of Base';
		} else{
			songTitle = string;
		}
		

		var spotify = require('spotify');
		 
		spotify.search({ type: 'track', query: songTitle }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    // In the terminal, this will show Artist, songs name, preview link, album name
		    console.log('Song: ' + data.tracks.items[0].name);
		    console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
		    console.log('Album: ' + data.tracks.items[0].album.name);
		    console.log('Link to preview: ' + data.tracks.items[0].preview_url)
		});
	}

	// movie-this 'movie name'
	// Output movie title, release year, IMDB rating, Country, Language, Plot, Actors, RotTom rating, RotTom URL
	// if no movie, default to "Mr. Nobody"
	if (command === 'movie-this') {
		var movieName;

		if (string === undefined) {
			// if no movie, default to "Mr. Nobody"
			movieName = 'Mr. Nobody';
		} else{
			movieName = string
		}

		var request = require('request');

		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

		request(queryUrl, function(error, response, body) {

		  // If the request is successful
		  // ...
		  if (!error && response.statusCode === 200) {
				// Output movie title, release year, IMDB rating, Country, Language, Plot, Actors, RotTom rating, RotTom URL
		  		console.log('Title: ' + JSON.parse(body).Title);
		  		console.log('Year: ' + JSON.parse(body).Year);
		  		console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
		  		console.log('Country: ' + JSON.parse(body).Country);
		  		console.log('Language: ' + JSON.parse(body).Language);
		  		console.log('Plot: ' + JSON.parse(body).Plot);
		  		console.log('Actors: ' + JSON.parse(body).Actors);
		  		console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
		  		
		  }
		});
	};
}
parseCommand();


// do-what-it-says
// using fs node package, LIRI will take text in random.txt and use it to call a liri command
// it should run "I want it That Way" for spotify-this-song, can test others
if (command === 'do-what-it-says') {

	var fs = require("fs");

	fs.readFile('random.txt', 'utf8', function(error, data) {

		var dataArray = data.split(',');
		// splits command and string from file and send through parseCommand();

		command = dataArray[0];
		string = dataArray[1];
		parseCommand();

	});

}