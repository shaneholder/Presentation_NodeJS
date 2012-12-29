var glacier = require('./lib/glacier'),
	config = require('./secret');


glacier.listVaults(config);
glacier.createVault(config, 'myVault');
glacier.putFile(config, file);
