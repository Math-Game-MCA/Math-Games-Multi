module.exports = function(req, res){

    Task
    	.find()
    	.exec(function(err, tasks){
            if(err) return res.status(403);
            
            if(tasks) {
	    		return res.status(201).send({tasks: tasks});
	    	} else {
	    		return res.status(201).send({message: "Tasks not found!"});
	    	}
        });

};