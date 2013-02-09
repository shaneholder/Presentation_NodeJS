var fs = require('fs');

fs.readFile('./debugme.js', function (err, data) {
	console.log(data.toString());
});