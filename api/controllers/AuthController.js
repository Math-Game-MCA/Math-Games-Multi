var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mathgames";
var secret = 'daa5125b12dc5dd952d1aa9fc9c531b0';
var jwt = require('jsonwebtoken')

var AuthController = {
    index: function(req, res) {
        var tok = jwt.verify(req.body.token, secret, {});

        MongoClient.connect(url, function(err, db) {
            db.collection("user").findOne({email:tok.email}, function(err, user){
                if(user.email === tok.email){
                    res.status(200).send("Token works!");
                }
                else {
                    res.status(401).send("Token failed :(");
                }
            });
            db.close();
        });
    },
    create_user: function(req, res) {
        MongoClient.connect(url, function(err, db) {
          if (err) res.status(418).send("Error opening connection to db");

            db.collection("user").insertOne({
                firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                email: req.body.email, 
                password: req.body.password,
                admin: false
            }, function(err, acc){
                if(err) res.status(417).send("Error creating the account");
                res.status(200).send("Successfully created the account");
            });


          db.close();
        });
    },
    authenticate: function(req, res) {
        MongoClient.connect(url, function(err, db) {
          if (err) res.status(418).send("Error opening connection to db");
            console.log(req.body.userName);
          db.collection("user").findOne({userName: req.body.userName}, function(err,user){
            if(err) res.status(417).send("Error finding the user");

            if(!user){
                res.status(403).send({success: false, message: 'Authentication failed. User not found.' });
            } else if(user){
                if (user.password != req.body.password) {
                    res.status(403).send({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    var token = jwt.sign(user, secret, {
                      expiresIn: '60m' // expires in 24 hours
                    });

                    res.status(200).send({success: true, message: "Have fun!!", token: token});
                }
            }
          });
          db.close();
        });
    }
};
module.exports = AuthController;