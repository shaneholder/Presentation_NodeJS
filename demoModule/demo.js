var os = require('os');

function reportMemory() {
	console.log(process.memoryUsage());
	console.log(os.totalmem());
	console.log(os.freemem());
}

var gobble = '0123456789';

setInterval(function() {
	reportMemory();
	gobble = gobble + gobble;
}, 500);

console.log(os.cpus());