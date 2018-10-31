const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var settings = require('./settings'); // get settings file

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = settings.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

        console.log(jqt_payload);
        /* 
         User.findOne({id: jwt_payload.id}, function (err, user) {
         if (err) {
         return done(err, false);
         }
         if (user) {
         done(null, user);
         } else {
         done(null, false);
         }
         }); */
    }));
};