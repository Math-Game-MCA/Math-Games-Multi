var SettingsController = {
	delete_account: function(req, res){
		var email   = req.body.email;
        var userId      = GLOBAL.user.id;

        User.destroy({id: userId, email: email}).exec(function deleteCB(err){
        	if(err) return res.status(403).send();
        	return res.status(200).send({response: 'success'});
        });
	},
	change_pass: function(req,res){
		var crypto = require('crypto-js');
        var bcrypt = require('bcrypt-nodejs');

		var userId      = GLOBAL.user.id;
		req.body.new_pass = crypto.AES.decrypt(req.body.new_pass, "lendingCalc123").toString(crypto.enc.Utf8);

        var password = '';
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(req.body.new_pass, salt, null, function (err, hash) {
                if (err) return next(err);
                password = hash;
                User.update({id: user.id}, {password: password, hash: ''}).exec(function(err, record){
                	if(err) return res.status(403).send();
                    return res.status(200).send();
                });
            });
        });
	},
	get_pic: function(req,res){
		var glob = require('glob-fs')({ gitignore: true });
		var userId      = GLOBAL.user.id;

		glob.readdir('assets/images/user/' + userId + '.*', function(err, files) {
			if(err) return res.status(405).send();
			if(files.length > 0){
				var arr = files[0].split("/");
				return res.status(200).send({file: arr[3]});
			}
			else{
				return res.status(404).send();
			}
		});
	},
	upload: function(req,res){
		var fs = require('fs');
		var userId      = GLOBAL.user.id;
		var fileName = req.body.name;

		var arr;

		if(fileName.length >0){
			arr = fileName.split(".");
		}
		else{
			return res.status(404);
		}

		fs.writeFile('.tmp/public/images/user/' + userId + "." + arr[arr.length-1], Buffer.from(req.body.image, 'base64'), function (err){
			if(err){
				console.log(err);
			 	return res.status(403).send();
			}
		});

		fs.writeFile('assets/images/user/' + userId + "." + arr[arr.length-1], Buffer.from(req.body.image, 'base64'), function (err){
			if(err){
				console.log(err);
			 	return res.status(403).send();
			}
			console.log('success');
			return res.status(200).send();
		});
	},
	get_user: function(req,res){
		var userId      = GLOBAL.user.id;
		User.find({id: userId}, {fields: {firstName: 1, lastName: 1, email: 1}}).exec(function(err, acc){
			if(err) return res.status(404).send();
			return res.status(200).send({account: acc})
		})
	},
	update_user: function(req, res){
		var userId		= GLOBAL.user.id;

		console.log(req.body);

		User.update({id: userId}, {firstName: req.body.firstName}).exec(function(err){
			console.log("1: " + err);
			if(err) return res.status(417).send();
			User.update({id: userId}, {lastName: req.body.lastName}).exec(function(err){
				console.log("2: " + err);
				if(err) return res.status(417).send();
				User.update({id: userId}, {email: req.body.email}).exec(function(err){
					console.log("3: " + err);
					if(err) return res.status(417).send();
					return res.status(200).send({message: "success"});
				});
			});
		});
	}
};
module.exports = SettingsController;