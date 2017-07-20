
var Crypto = require('cryptojs');
var crypto = require('crypto-js');
Crypto = Crypto.Crypto

// TODO: Move this encryption key to config
var KEY = '^G_>`^tGf4mp_Q~>'//new Buffer('lendingCalc12345plmnbvcxaGF*ewp%');//crypto.enc.Utf8.parse('lendingCalc123');
var IV = ')!(@*#&$&%^GcQ56'
var MODE = new Crypto.mode.CFB(Crypto.pad.ZeroPadding);
var OPTIONS = {iv: Crypto.charenc.UTF8.stringToBytes(IV), asBytes: true, mode: MODE};

var env = require('../../config/env/current');
var configFile = require('../../config/env/'+ env.getEnv+'.js');
var _ = require('lodash');

var EncryptionService = {
    test: function (options, callback) {
        return 27017;
    },

    getMandrilConfig: function () {
        return this._decryptObject(configFile.mandril);
    },

    _decryptObject: function (configObject) {
        var getTotalKeys = _.keys(configObject);
        var getLengthOfTotalKeys = getTotalKeys.length;
        var newConfigObj = {};
        for(var index = 0; index< getLengthOfTotalKeys; index++){
            var keyName = getTotalKeys[index];
            newConfigObj[keyName] = crypto.AES.decrypt(configObject[keyName], KEY).toString(crypto.enc.Utf8);
        }
        return newConfigObj;
    },

    getMongoHost: function () {
        return crypto.AES.decrypt(configFile.mongoHost, KEY).toString(crypto.enc.Utf8);
    },

    getMongoPort: function () {
        return parseInt(crypto.AES.decrypt(configFile.mongoPort, KEY).toString(crypto.enc.Utf8));
    },

    getMongoDbName: function () {
        return crypto.AES.decrypt(configFile.mongoDbName, KEY).toString(crypto.enc.Utf8);
    },
    encryptSingle: function (data) {
        var input_bytes = Crypto.charenc.UTF8.stringToBytes(data);
        var key = Crypto.charenc.UTF8.stringToBytes(KEY);
        var encrypted = Crypto.AES.encrypt(input_bytes, key, OPTIONS);
        return Crypto.util.bytesToHex(encrypted);
    },
    decryptSingle: function (data) {
        var output_bytes = Crypto.util.hexToBytes(data);
        var key = Crypto.charenc.UTF8.stringToBytes(KEY);
		var output_plaintext_bytes = Crypto.AES.decrypt(output_bytes, key, OPTIONS);
		return Crypto.charenc.UTF8.bytesToString(output_plaintext_bytes);
    }

}
module.exports = EncryptionService;