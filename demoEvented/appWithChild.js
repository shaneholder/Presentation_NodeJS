var fork = require('child_process').fork,
	child = fork(__dirname + '/withChild.js'),
	http = require('http'),
	fib = 0;

child.on('message', function(data) {
	fib = data;
});

http.createServer(function(req, res) {
	res.end('Fib is at :' + fib);
}).listen(2222);
