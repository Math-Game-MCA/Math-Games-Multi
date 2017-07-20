/**
* CORS - enable cross-origin resource sharing
*/
module.exports = function (req, res, next) {
	// set headers to allow cross domain
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
	next();
};