'use strict'
var passport, GoogleStrategy, User, BadDomainError;

passport = require('passport');
GoogleStrategy = require('passport-google').Strategy;
User = require('./db/user');
BadDomainError = require('./errors/baddomainerror');

module.exports = function (options) {
  var realm, returnURL, setGoogleStrategy;
  if (options == null) {
    realm = 'http://www.wrongurl.com/';
    returnURL = 'http://www.wrongurl.com/auth/google/return';
  } else {
    realm = options.realm;
    returnURL = options.returnURL;
  }

  return setGoogleStrategy = function(req, res, next) {
      passport.use(new GoogleStrategy({
      returnURL: returnURL,
      realm: realm
    }, function(identifier, profile, done) {
      var email, emails, isButtercoin, key;
      emails = profile.emails;
      isButtercoin = false;
      for (key in emails) {
        email = emails[key];
        if (email.value.replace(/.*@/, "") === 'buttercoin.com') {
          isButtercoin = true;
          break;
        }
      }
      if (!isButtercoin) {
        return done(new BadDomainError('You must authenticate with your Buttercoin account.'));
      }
      return User.findByIdentifier(identifier, function(err, user) {
        if (err != null) {
          return done(err);
        }
        if (user != null) {
          return done(null, user);
        }
        user = new User(profile);
        user.identifier = identifier;
        return user.save(function(err) {
          if (err != null) {
            return done(err);
	  }
	  return done(null, user);
        });
      });
    }));
    return next();
  };
};

module.exports.User = User;
module.exports.BadDomainError = BadDomainError;
