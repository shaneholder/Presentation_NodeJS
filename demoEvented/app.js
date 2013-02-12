var http = require('http');


http.createServer(function (req, res) {
	res.end('hello DDNUG');
}).listen(2222);

while(true) {

}