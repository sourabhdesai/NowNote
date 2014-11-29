
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var nlp = require("./nlp_code");
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
var nlpStream = io
	.of('/nlpstream')
	.on('connection', function(socket) {
		console.log("Made Socket Connection with NLP Streamer");
		socket.on('newtag', nlp.newTagFunction(socket));
		socket.on('selected', nlp.selectedFunction(socket));
	});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});