var http = require('http'),
	Util = require('./lib/util'),
	config = require('./config.json'),
	secrets = require('./secret.json'),
	secretKey =  secrets.secretKey,
	secret = secrets.secret,
	region = config.region,
	service = config.service;

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

function getRequestOptions() {
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
	return requestOptions;
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


function makeRequest (signingKey, date){
		var req = http.request(getRequestOptions(), function (res) {
		res.on('data', function(chunk){
			console.log(chunk.toString());
		});
	});

	req.end();
}

var date = new Date();
var signingKey = Util.HMAC(Util.HMAC(Util.HMAC(Util.HMAC("AWS4"+secret, date.yyyymmdd()), region), service), "aws4_request");
makeRequest(signingKey, date);

