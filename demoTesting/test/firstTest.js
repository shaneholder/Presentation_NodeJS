var should = require('should'),
	fs = require('fs');

describe('Our first Unit Test', function () {
  it('should pass', function () {
    var answer;

    answer = 1 + 1;
    answer.should.equal(2);
  });

  it('should fail', function () {
    var answer;

    answer = 1 + 1;
    answer.should.equal(3);
  });

  it('load a file', function(){
     fs.readFile('../../package.json', function (err, file) {
    	var data  = JSON.parse(file.toString());
    	data.version.should.equal('0.0.0');
     });
  });
});