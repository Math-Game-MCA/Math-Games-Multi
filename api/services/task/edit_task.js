module.exports = function(req, res){
    //console.log("IN add account sails futnction "+res);
    var id = req.body.id;
    var title = req.body.title;
    var description = req.body.description;
    var status = req.body.status;
    var group = req.body.group;


    Task.update(
            {
                id: id, 
            }, 
            {
                title: title,
                description: description,
                status: status,
                group: group
            }).exec(function afterwards(err, updatedTask){
    	           if(err) return res.status(403);
    	           //console.log('Updated Task is '+updatedTask[0]);
                   return res.status(201).send({message: "Task Name is updated successfully!"});
	       });

    
    
};


