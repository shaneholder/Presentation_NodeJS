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
io.on('connection', function (socket) {
	var connectData = {};
	connectData.ipAddress = getExternalIPAddress();
	connectData.port = port;

	socket.emit('connectData', connectData);	

});

io.of('/c').on('connection', function(socket) {

	socket.on('message', function(message){
		console.log(util.inspect(socket, true, 1, true));
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
		console.log(util.inspect(socket, true, 2, true));
		socket.broadcast.emit('navigate', data);
	});

	socket.on('disconnect', function(){
		console.log("Connection " + socket.id + " terminated.");
	});

	fs.watch("./public", function (file) {
		console.log("File Updated:");
		console.dir(file);
		socket.broadcast.emit('pageUpdated');
	});
});

io.of('/a').on('connection', function (socket) {
	console.log('Audience connected');

	socket.on('vote', function (data) {
		console.log('got vote');
		socket.broadcast.emit('vote', data);
	});

	socket.on('audience', function(data) {
		console.log('audience request : ' + util.inspect(data, false, 1, true));
		console.log(util.inspect(socket, true, 1, true));
		socket.broadcast.emit('audience', data);
	});	
});

console.log(getExternalIPAddress()); 