var http = require('http'),
	crypto = require('crypto'),
	secrets = require('./secret.js'),
	secretKey =  secrets.secretKey,
	secret = secrets.secret,
	region = secrets.region,
	service = secrets.service;

var Util = {};

Util.HMAC = function (key, text, digest) {	
	digest = digest || 'binary';
	crypt = crypto.createHmac('sha256', key).update(text).digest(digest);
	return crypt;
}

Util.digest = function (text) {
	return crypto.createHash('sha256').update(text).digest('hex');
}

///http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
 Date.prototype.yyyymmdd = function() {
   var yyyy = this.getUTCFullYear().toString();
   var mm = (this.getUTCMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getUTCDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };

 Date.prototype.amznDate = function() {
   var date = this.toJSON().replace(/-/g, '').replace(/:/g,'').substr(0, 15);
   return date+"Z";    
  };

function getCredentialScope(date) {
	return date.yyyymmdd()+"/"+region+"/"+service+"/aws4_request";
}

function getAuthorization(signingKey, date) {
	var cred = secretKey + "/" + getCredentialScope(date)
		signature = Util.HMAC(signingKey, getStringToSign(date), 'hex'),
		authorization = "AWS4-HMAC-SHA256 Credential=" + cred + ",SignedHeaders=host;x-amz-date;x-amz-glacier-version,Signature=" + signature;

	console.log("Authorization::---------------");
	console.log(authorization);
	console.log("------------------------------");
	return authorization;
}

function makeRequest (signingKey, date){
	var requestOptions = {
		"hostname": 'glacier.' + region + ".amazonaws.com",
		"port": 80,
		"method" : "GET",
		"path": "/-/vaults",
		"headers": {
			"Authorization" : getAuthorization(signingKey, date),
			"x-amz-date" : date.amznDate(),
			"x-amz-glacier-version" : "2012-06-01"
		}
	};

	console.log(requestOptions);

	var req = http.request(requestOptions, function (res) {
		res.on('data', function(chunk){
			console.log(chunk.toString());
		});
	});

	req.end();
}

function getCanonicalRequestString (date){
	var canonRequest = "GET\n" + // HTTPRequestMethod 
	"/-/vaults\n" +	// CanonicalURI
	"\n" + // CanonicalQueryString + '\n' +
	"host:glacier.us-east-1.amazonaws.com\n" +// CanonicalHeaders + '\n' +
	"x-amz-date:"+date.amznDate()+"\n" +
	"x-amz-glacier-version:2012-06-01\n" +
	"\n"+
  "host;x-amz-date;x-amz-glacier-version\n" + // SignedHeaders
  Util.digest("");
  console.log("CanonicalRequest::---------------------");
  console.log(canonRequest)
  console.log("---------------------------------------");
	return canonRequest;
}

function getStringToSign(date) {
	var stringToSign =  "AWS4-HMAC-SHA256\n"+
		date.amznDate() + "\n" +
		getCredentialScope(date) + "\n" +
		Util.digest(getCanonicalRequestString(date));
	console.log("StringToSign::-------------------------");
	console.log(stringToSign);
  console.log("---------------------------------------");
	return stringToSign;
}

var date = new Date();
var signingKey = Util.HMAC(Util.HMAC(Util.HMAC(Util.HMAC("AWS4"+secret, date.yyyymmdd()), region), service), "aws4_request");
makeRequest(signingKey, date);
