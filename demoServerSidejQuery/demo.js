var $ = require('jquery'),
	request = require('request');

$.get('http://www.google.com', function(data){
	console.log($(data).find('table').html());
});
