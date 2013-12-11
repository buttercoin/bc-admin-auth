'use strict'
var passport, GoogleStrategy, User, BadDomainError, UUID;

passport = require('passport');
GoogleStrategy = require('passport-google').Strategy;
User = require('./db/user');
BadDomainError = require('./errors/baddomainerror');
UUID = require('node-uuid');

module.exports = function (options) {
  var realm, returnURL, application;
  if (options == null) {
    application = 'unknown';
    realm = 'http://www.wrongurl.com/';
    returnURL = 'http://www.wrongurl.com/auth/google/return';
  } else {
    application = options.application;
    realm = options.realm;
    returnURL = options.returnURL;
  }

  return function(req, res, next) {
      passport.use(new GoogleStrategy({
      returnURL: returnURL,
      realm: realm
    }, function(identifier, profile, done) {
      var email, key;
      profile.email = '';
      for (key in profile.emails) {
        email = profile.emails[key];
        if (email.value.replace(/.*@/, "") === 'buttercoin.com') {
          profile.email = email.value;
          break;
        }
      }
      if (profile.email === '') {
        return done(new BadDomainError('You must authenticate with your Buttercoin account.'));
      }
      return User.findByIdentifier(identifier, function(err, user) {
        if (err != null) {
          return done(err);
        }
        if (user != null) {
          return done(null, user);
        }
        profile.accountId = UUID.v4();
        profile.identifier = identifier;
        User.createFromCredentials(profile, application, function(err, user) {
          if (err != null) {
            return done(err);
          }

          return user.save(function(err) {
            if (err != null) {
              return done(err);
            }
            return done(null, user);
          });
        });
      });
    }));
    return next();
  };
};

module.exports.User = User;
module.exports.BadDomainError = BadDomainError;
