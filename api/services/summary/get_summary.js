module.exports = function(req, res){

    var userId 			= req.body.userId;

    var maxDate         = '';
    Summary
        .find({userMap: userId},{sort: 'ms_asOfDate DESC', limit: 3})
        .exec(function(err, summary) {
            if(err) return res.status(403);

            if(summary) {
                console.log(summary);
                return res.status(201).send({summary: summary});
            } else {
                return res.status(201).send({message: "Summary not found!"});
            }

            console.log('summary is '+summary);
            if(summary != '') {
                console.log(summary);
                console.log(summary[0].ms_asOfDate);

                maxDate = summary[0].ms_asOfDate;

                Summary
                    .find({userMap: userId, ms_asOfDate: "2015-07-29"})
                    .exec(function(err, summary){
                        if(err) return res.status(403);

                        if(summary) {
                            console.log(summary);
                            return res.status(201).send({summary: summary});
                        } else {
                            return res.status(201).send({message: "Summary not found!"});
                        }
                    });
            } else {
                return res.status(201).send({message: "Summary not found!"});
            }
        });
};