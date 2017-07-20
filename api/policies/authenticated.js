module.exports = function(req, res, next)
{
  if(typeof(req.headers.authorization) != 'undefined' && req.headers.authorization != '') {
    var auth = req.headers.authorization.split(' ');
    User.findOne({token: auth[1]}, function (err, user) {
      if (err)
        res.status(401).send();
      else if (!user || typeof user == 'undefined') {
        res.status(401).send();
      } else {
        GLOBAL.user = user;
        return next();
      }
    });
  } else {
    res.status(401).send();
  }
}