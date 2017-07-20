module.exports = function(req, res){

    var id 		= req.body.id;
    
    Task
    	.findOne({id: id})
    	.exec(function(err, task){
            if(err) return res.status(403);
            
            if(task) {
	    		return res.status(201).send({task: task});
	    	} else {
	    		return res.status(201).send({message: "task not found!"});
	    	}
        });

};