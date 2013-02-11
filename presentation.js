var static = require('node-static'),
	http = require('http'),
	util = require('util'),
	url = require('url'),
	os = require('os'),
	fs = require('fs');

// create static server for decks
var fileServer = new static.Server('./public');
var port = 3000;

var server = http.createServer(function (req, res) {

	var pathname = url.parse(req.url).pathname;
	console.log('pathname: '+pathname);

	req.addListener('end', function () {
		fileServer.serve(req, res);
	});

}).listen(port, function() {
    console.log('Listening at: http://localhost:' + port);
});

function getExternalIPAddress () {
	var interfaces = os.networkInterfaces(),
		propName,
		interface;

	for (propName in interfaces) {
		interface = interfaces[propName];
		for (var i = interface.length - 1; i >= 0; i--) {
			if (!interface[i].internal && interface[i].family === 'IPv4') {
				return interface[i].address;
			}
		}
	}
}

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
	var connectData = {};
	connectData.ipAddress = getExternalIPAddress();
	connectData.port = port;

	socket.emit('connectData', connectData);

	socket.on('message', function(message){
		socket.broadcast.emit('message', message);
	});

	socket.on('key down', function(data){
		socket.broadcast.emit('key down', data);
	});

	socket.on('key up', function(data){
		socket.broadcast.emit('key up', data);
	});

	socket.on('flowtime minimap complete', function(data){
		socket.broadcast.emit('flowtime minimap complete', data);
	});

	socket.on('navigate', function(data){
		socket.broadcast.emit('navigate', data);
	});

	socket.on('disconnect', function(){
		console.log("Connection " + socket.id + " terminated.");
	});

	socket.on('vote', function (data) {
		socket.broadcast.emit('vote', data);
	});

	socket.on('audience', function(data) {
		console.log('audience request : ' + data);
		socket.broadcast.emit('audience', data);
	});	

	fs.watch("./public", function (file) {
		console.log("File Updated:");
		console.dir(file);
		socket.broadcast.emit('pageUpdated');
	});
});

console.log(getExternalIPAddress()); 