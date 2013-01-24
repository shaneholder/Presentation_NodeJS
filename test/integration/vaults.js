var glacier = require('../../lib/glacier'),
	config = require('../../config.json'),
	should = require('should');

describe('#testing', function () {
	describe('Basic', function () {
		it('should do something', function () {
			var foo = '';
			foo.should.equal('');
		});
	});

	describe('#glacier', function () {
	  it('should list vaults', function (done) {
	    var response = glacier.listVaults(config);
	    response.should.not.be.empty;	 
	    done();   
	  });
	});
});
