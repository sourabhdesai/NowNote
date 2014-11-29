var generateSuggestions = require('./suggester.js').generateSuggestions;
var savedQueries = {};

// Returns a cb function which will have reference to socket in its scope
exports.newTagFunction = function(socket) {
	// Callback function for 'newtag' events
	return function(data) {
		var tag = data.tag;
		console.log("Received New Tag: " + tag);

		if(tag in savedQueries) {
			var suggestions = savedQueries[tag];
			socket.emit('suggestion', {"suggestions": suggestions});
		} else {
			suggestions = generateSuggestions(tag, function(err, suggestions) {
				if(err) {
					console.log("Received following error on generating suggestions for tag \"" + tag + "\"");
					console.log(err);
				} else {
					console.log("Got " + suggestions.length + " suggestions for tag \"" + tag + "\"");
					savedQueries[tag] = suggestions; // Save result
					socket.emit('suggestion', {"suggestions": suggestions});
				}
			});
		}

	};
};

// Returns a cb function which will have reference to socket in its scope
exports.selectedFunction = function(socket) {
	// Callback function for 'selected' events
	return function(data) {
		var tag = data.tag;
		console.log("Received Newly Selected Tag: " + tag);
		
		if(tag in savedQueries) {
			var suggestions = savedQueries[tag];
			socket.emit('suggestion', {"suggestions": suggestions});
		} else {
			generateSuggestions(tag, function(err, suggestions) {
				if(err) {
					console.log("Received following error on generating suggestions for tag \"" + tag + "\"");
					console.log(err);
				} else {
					console.log("Got " + suggestions.length + " suggestions for tag \"" + tag + "\"");
					savedQueries[tag] = suggestions; // Save result
					socket.emit('suggestion', {"suggestions": suggestions});
				}
			});
		}

	};
};