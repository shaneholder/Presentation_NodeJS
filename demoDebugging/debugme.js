var http = require('http');

var server = http.createServer(function(req, res){
	response = 'hi from node';
	res.end(response);
}).listen(9123);
