var AWS = require('aws-sdk'),
	SIG = require('sig4'),
	config = { "accessKeyId": require('./secret.js').secret,
		 "secretAccessKey": require('./secret.js').secretKey,
		  "region": "us-east-1" };

AWS.