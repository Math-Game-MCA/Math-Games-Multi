module.exports = function(req, res){
    //console.log("IN add account sails futnction "+res);
    var id = req.body.id;
    

    Task
        .destroy({id: id})
        .exec(function deleteCB(err){
	    	if(err) return res.status(403);
		  	//console.log('The Task record has been deleted');
            return res.status(201).send({message: "Task Name is deleted successfully!"});
		});
    
};


