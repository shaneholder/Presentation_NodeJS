$(function (){
	var socket = io.connect();
	socket.on('connectData', function (data) {
		$('.ipAddress').text(data.ipAddress);
		$('.port').text(data.port);
	});	
});