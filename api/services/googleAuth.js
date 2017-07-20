
var request = require("request");
var createSendToken = require("./createSendToken.js");
var config = require("./config.js");

module.exports = function (req, res) {

    var url = 'https://accounts.google.com/o/oauth2/token';
    var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code',
        client_secret: config.GOOGLE_SECRETE
    };

    request.post(url, {
        json: true,
        form: params
    }, function (err, response, token) {
        var accessToken = token.access_token;

        var headers = {
            Authorization: 'Bearer ' + accessToken
        };

        request.get({
            url: apiUrl,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            

        
            
            
            
        User.findOneByEmail(profile.email, function (err, foundUser) {
            if (!foundUser) {
                console.log("Not found email, create a new Google User");
                User.create({
                    email:profile.email,
                    googleId:profile.sub,
                    displayName:profile.name
                }).exec(function(err, user){
                    if(err){
                        console.log("create user fails..." + err);
                        return res.status(403).send(err);
                    }
                    console.log("create user ok");
                    createSendToken(user,res);
                });
            };
            
            
            if (foundUser) {
                console.log("Found email, Update Google User");
                foundUser.googleId      =   profile.sub;
                foundUser.displayName   =   profile.name;
                
                foundUser.save(
                  function(err,s){
                    console.log('User with ID '+s.googleId+' now has name '+s.displayName);
                    createSendToken(s,res);  
                  });
            };
            
        })        
            
    
            
            
        /**
        User.findOne({googleId: profile.sub}, function (err, founderUser) {
            if (founderUser) return createSendToken(founderUser, res);

            User.create({
                email:profile.email,
                googleId:profile.sub,
                displayName:profile.name
            }).exec(function(err, user){
                if(err){
                    console.log("create user fails..." + err);
                    return res.status(403).send(err);
                }
                console.log("create user ok");
                createSendToken(user,res);
            });
        });
        **/
            
            
        });

    });
};