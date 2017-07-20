fs = require('fs');

var VersionController = {
	index: function(req, res){
		fs.readFile('version.txt', 'utf8', function (err,data){
			if(err){
				console.log(err);
				return res.status(201).send();
			}
			return res.status(200).send({version: data});
		});
	}
};
module.exports = VersionController;