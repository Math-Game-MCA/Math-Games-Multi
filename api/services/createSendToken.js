var jwt = require("jwt-simple");
var moment = require("moment");

var secret = "this is my secret";

module.exports = function (user, res) {
    
    //Create SideBarMenu
    var options = ""
    //console.log("options "+options);

    var payload = {
        //iss: req.hostname,
        sub: user.id,
        exp: moment().add(10, 'days').unix()
    };

    var token = jwt.encode(payload, secret);

    res.status(201).send({
        user: user.toJSON(),
        token: token
    });
}
