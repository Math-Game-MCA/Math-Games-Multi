/**
 * ResponseService
 *
 */
let codes = require('../../config/responseCodes');

var ResponseService = {
    sendJSON: function (options, resp) {
        if(!options.userOldeWrapper){
            resp.send({
                code: options.code[0] || 500,
                status: options.status || this.getStatus(options.code || 500),
                msg: options.message || options.code[1],
                data: options.data || {}
            })
        }else{
            resp.status(options.status).send({msg: options.message || options.code[1]})
        }
    },

    sendObject: function (options, resp) {
        resp.status(options.status).send(options.data);
    },

    responseCode: codes,

    getStatus: function (code) {
        // Any code starting with 4 e.g. 400 is success, and failure otherwise
        return code.toString().indexOf("4") == 0 ? "success" : "failure";
    }

};
module.exports = ResponseService;

