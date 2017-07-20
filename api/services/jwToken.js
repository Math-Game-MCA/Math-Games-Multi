var
  jwt = require('jsonwebtoken'),
  tokenSecret = 'daa5125b12dc5dd952d1aa9fc9c531b0';

// Generates a token from supplied payload

/*module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};*/

var TokenService = {
  verify: function(options, callback){
      return jwt.verify(token, tokenSecret, {}, callback);
  }
};
module.exports = TokenService;