var http = require('http');

// More about this later!
http.createServer(function (req, res) {
	res.end('hello DDNUG');
}).listen(2222);

while(true) {

}