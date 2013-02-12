var fs = require('fs');

fs.readFile("./ServerSideDemo.txt", function (err, data){
  if (err) {
    console.dir(err);
	}
	console.log(data.toString());
});	
