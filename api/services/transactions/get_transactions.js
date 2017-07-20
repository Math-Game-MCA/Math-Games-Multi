module.exports = function(req, res){

    var userId 			= req.body.userId;

    Transactions
    	.find({userMap: userId})
    	.exec(function(err, transactions){
            if(err) return res.status(403);

            if(transactions) {
	    		return res.status(201).send({transactions: transactions});
	    	} else {
	    		return res.status(201).send({message: "transactions not found!"});
	    	}
        });

};