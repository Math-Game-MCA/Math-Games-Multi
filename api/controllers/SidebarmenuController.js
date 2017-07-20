/**
 * SidebarmenuController
 *
 * @description :: Server-side logic for managing sidebarmenus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SidebarmenuController = {
  index: function(req, res) {
    async.waterfall([
      function (callback) {
        var userId = GLOBAL.user.id;
        Sidebarmenu.find({userMap: userId}, function(err, bar) {
          //res.status(200).send({data: {super_menu: bar, sub_menu: {}}});
          callback(null, bar);
        });
      },
      function(bar, callback) {
        var userId = GLOBAL.user.id;
        console.log(userId);
        Sidebarsubmenu.find({userId: userId}, function(err, sub_menu) {
          //console.log(sub_menu);
          callback(null, '', bar, sub_menu);
        });
      }
    ], function(error, err, bar, sub_menu) {
      if(err == 'error') {
      } else {
          res.status(200).send({data: [{super_menu: bar, sub_menu: sub_menu}]});
      }
    });
  }
};
 
module.exports = SidebarmenuController;
