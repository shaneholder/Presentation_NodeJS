	var http = require('http'),
		util = require('util'),
		fs = require('fs');

http.createServer(function(req, res) {
	var fileName = __dirname + req.url;
	// console.log(util.inspect(req, true, 1));
	console.log(req.url);

	// Determine if the file exists
	fs.exists(fileName, function (exists) {
		if (exists) {
			// File exists so read the data
			fs.readFile(fileName, function (err, data) {
				// reading of file is async so send the response in the
				// call back of the read
				res.end(data);
			});
		} else {
			res.end('Not found');
		}
	})
})
.listen(3333);