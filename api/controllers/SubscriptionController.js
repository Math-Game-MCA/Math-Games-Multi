/**
 * SubscriptionController
 *
 * @description :: Server-side logic for managing subscription
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SubscriptionController = {
  index: function(req, res) {
    async.waterfall([
      function (callback) {
        var err = [];
        if(typeof req.body.name == 'undefined' || req.body.name == '') {
          err.push('Please enter your Name');
          callback(null, err);
        } else {
          callback(null, err);
        }
      },
      function (err, callback) {
        var err = err;
        if(typeof req.body.email == 'undefined' || req.body.email == '') {
          err.push('Please enter your email address');
          callback(null, err);
        } else {
          async.waterfall([
            function (cb) {
              Subscription.findOne({email: req.body.email}).exec(function(error, user){
                if(typeof(user) == 'undefined') {
                  cb(null, err);
                } else {
                err.push('The email you have provided is already subscribed.');
                  cb(null, err);
                }
              });
            }
          ], function (error, err) {
            callback(null, err);
          });
        }
      },
      function (err, callback) {
        if(typeof req.body.message == 'undefined' || req.body.message == '') {
          err.push('Please enter a valid message.');
          callback(null, err);
        } else {
          callback(null, err);
        }
      }
    ], function(error, err) {
      if(err.length > 0) {
        return res.status(200).send({response: 'error', msg: err});
      } else {
        Subscription.create({
          name: req.body.name,
          email: req.body.email,
          message: req.body.message
        }).exec(function(err, task){
          if(err) {return res.status(403);}
          var options = {email: req.body.email, name: req.body.name, template: 'subscribe', subject: 'Your email is subscibed', isTemplate: true, fields: {name: req.body.name, title: 'Email Subscription', app: 'LendingCalc', email: req.body.email}};
          EmailService.html(options);
          return res.status(201).send({response: 'success'});
        });
      }
    });
  }
};

module.exports = SubscriptionController;