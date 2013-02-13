var request = require('request'),
	util = require('util'),
	req = {
		"url": 'http://odata.netflix.com/Catalog/Titles?$format=json',
		"json": true
	}


request.get(req, function(err, res, body) {
	console.log(util.inspect(body.d.results, true, null, true));
});