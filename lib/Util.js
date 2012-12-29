var crypto = require('crypto');

exports.HMAC = function (key, text, digest) {	
	digest = digest || 'binary';
	crypt = crypto.createHmac('sha256', key).update(text).digest(digest);
	return crypt;
}

exports.digest = function (text) {
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
