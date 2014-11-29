var wikipedia = require('wikipedia-js');

// Suggests related words in response to a given word
// Currently pulls suggestions from Wikipedia
exports.generateSuggestions = function(word, cb) {
	var queryOpts = {
		query: word,
		format: "html",
		summaryOnly: false
	};

	wikipedia.searchArticle(queryOpts, function(err, htmlWikiText) {
		if(err) {
			cb(err, null);
		} else if(htmlWikiText){
			var linkedWikiArticles = extractLinkedWikis(htmlWikiText);
			cb(null, linkedWikiArticles);
		} else {
			cb("Wikipedia Search for " + word + " returned null err and null htmlWikiText", null);
		}
	});
};

function extractLinkedWikis(article) {
	var innerWikis = article.match(/<a href="http:\/\/en.wikipedia.org\/wiki\/\S*">(\w| )*<\/a>/g);
	if (!innerWikis) {
		console.log("Weird ... Couldn't find any Inner Links");
		return [];
	}
	var innerWikisTexts = new Array(innerWikis.length);

	for (var i = 0; i < innerWikisTexts.length; i++) {
		var linkHTML      = innerWikis[i];
		var linkIndex     = linkHTML.indexOf('<a href="http://en.wikipedia.org/wiki/') + 38;
		var linkTextIndex = linkHTML.indexOf('">') + 2;
		// Extract actual link info
		//var title    = linkHTML.substring(linkIndex, linkTextIndex - 2).replace(/_/g, " ");
		var linkText = linkHTML.substring(linkTextIndex, linkHTML.indexOf("</a>") );
		/*
		innerWikisJSON[i] = {
			title : title,
			linkText : linkText
		};
		*/
		innerWikisTexts[i] = linkText;

	};

	return innerWikisTexts;

};