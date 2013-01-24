var fmt = require('fmt'),
	awssum = require('awssum'),
	amazon = awssum.load('amazon/amazon'),
	Glacier = awssum.load('amazon/glacier').Glacier,
	secret = require('./secret'),
    Util = require('./lib/Util'),
	config = require('./config');

var glacier = new Glacier({
    'accessKeyId'     : secret.accessKeyId,
    'secretAccessKey' : secret.secretKey,
    'awsAccountId'    : secret.account, // required
    'region'          : amazon.US_EAST_1
});

fmt.field('Region',          glacier.region()                              );
fmt.field('EndPoint',        glacier.host()                                );
fmt.field('AccessKeyId',     glacier.accessKeyId().substr(0,3) + '...'     );
fmt.field('SecretAccessKey', glacier.secretAccessKey().substr(0,3) + '...' );
fmt.field('AwsAccountId',    glacier.awsAccountId()                        );

glacier.ListVaults(function(err, data) {
    fmt.title("listing vaults - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

function upload() {
    var body = "I am the body.";

    var options = {
        "VaultName": "ddnug",
        "ContentLength": body.length,
        "ArchiveDescription" : "A test upload",
        "ContentSha256" : Util.digest(body),
        "Sha256TreeHash" : Util.digest(body),
        "Body": body
    };

    fmt.sep();
    fmt.title('options');
    fmt.dump(options);

    glacier.UploadArchive(options, function(err, data) {
        fmt.title("Upload");
        fmt.dump(err, 'Error');
        fmt.dump(data, 'Data');
    });
}

function listJobs() {
    glacier.ListJobs({"VaultName" : "ddnug"}, function (err, data){
        fmt.title("ListJobs");
        fmt.dump(err, 'Error');
        fmt.dump(data, 'Data');
    });
}

listJobs();

// --- Upload --------------------------------------------------------------------
// Error : null
// Data : { StatusCode: 201,
//   Headers:
//    { 'x-amzn-requestid': 'FLala14ZGOZlYPrEL97QUL12YgAc3cMsuelEFu0CjoKYPZk',
//      'x-amz-sha256-tree-hash': '06863239e0f986f50ec3317b6eeedd67bc60251e511722d501550e788c5caf0b',
//      location: '/521121886501/vaults/ddnug/archives/RQuwqvJe4aB4vuDY2EqbPy6FkOMEYPNwpRaMLYn8UiXaTY2K6gHr2M_XesXRZdhXEMyX
// m7xO4NoAAouMSAv5UL-tSBAbU5mWHT-LMmde7d6BG6htfhGITW7YxiHKCPsYLtTpJNf1Xw',
//      'x-amz-archive-id': 'RQuwqvJe4aB4vuDY2EqbPy6FkOMEYPNwpRaMLYn8UiXaTY2K6gHr2M_XesXRZdhXEMyXm7xO4NoAAouMSAv5UL-tSBAbU5
// mWHT-LMmde7d6BG6htfhGITW7YxiHKCPsYLtTpJNf1Xw',
//      'content-type': 'application/json',
//      'content-length': '2',
//      date: 'Sun, 06 Jan 2013 19:55:34 GMT' },
//   Body: '' }
  