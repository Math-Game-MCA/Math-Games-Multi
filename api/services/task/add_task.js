

module.exports = function(req, res){
    //console.log("IN add account sails futnction "+res);
    var title = req.body.title;
    var description = req.body.description;
    var status = req.body.status;
    var group = req.body.group;


    /****Start of Account Create in User Table***/
    Task.create({
          title: title,
          description: description,
          status: status,
          group: group
    }).exec(function(err, task){
        if(err) return res.status(403);
        return res.status(201).send({task: task.toJSON()});	
    });
    /****End of Account Create in User Table***/
};