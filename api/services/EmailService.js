var Mandrill = require('machinepack-mandrill');
var ejs = require('ejs'), 
fs = require('fs');
var EmailService = {
  html: function(options) {
    var content = '';
    ejs.open = '{{';
    ejs.close = '}}';
    if(options.isTemplate) {
      var str = fs.readFileSync('./views/mail-templates/' + options.template + '.ejs', 'utf8');
      var content = ejs.render(str, options.fields);
    } else {
      content = options.content
    }
    
    var request = require('request');
    var BASE_URL = 'https://mandrillapp.com/api/1.0';
    request.post({
      url: BASE_URL + '/messages/send.json',
      // See https://mandrillapp.com/api/docs/messages.JSON.html for complete reference
      form: {
        key: sails.config.globals.mandrill.key,
        message: {
          to: [{
            email: options.email,
            name: options.name || options.email
          }],
          html: content,
          subject: options.subject,
          from_email: sails.config.globals.mandrill.from,
          from_name: sails.config.globals.mandrill.name,
          auto_html: true
        }
      },
      json: true
    }, function(err, response, httpBody) {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  },
  plainText: function(options) {
    var content = '';
    ejs.open = '{{';
    ejs.close = '}}';
    if(options.isTemplate) {
      var str = fs.readFileSync('./views/mail-templates/' + options.template + '.ejs', 'utf8');
      var content = ejs.render(str, options.fields);
    } else {
      content = options.content
    }
    
    Mandrill.sendPlaintextEmail({
      apiKey: sails.config.globals.mandrill.key,
      toEmail: options.email,
      toName: options.name,
      subject: options.subject,
      message: content,
      fromEmail: sails.config.globals.mandrill.from,
      fromName: sails.config.globals.mandrill.name
      }).exec({
      error: function (err){
       return false;
      },
      success: function (){
        return true;
      },
    });
  }
};
module.exports = EmailService;