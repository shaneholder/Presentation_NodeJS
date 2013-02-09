$(function (){
	var socket = io.connect();
	socket.on('pageUpdated', function () {
		window.location.reload();
	});
	
});