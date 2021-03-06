'use strict'
var passport, GoogleStrategy, User, BadDomainError, UUID;

passport = require('passport');
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
User = require('./db/user');
BadDomainError = require('./errors/baddomainerror');
UUID = require('node-uuid');

module.exports = function (options) {
  var clientID, clientSecret, callbackURL, setGoogleStrategy;
  if (options == null) {
    clientID = 'wrongid';
    clientSecret = 'wrongsecret';
    callbackURL = 'http://www.wrongurl.com/auth/google/return';
  } else {
    clientID = options.clientID;
    clientSecret = options.clientSecret;
    callbackURL = options.callbackURL;
  }

  return setGoogleStrategy = function(req, res, next) {
    passport.use(new GoogleStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL
    }, function(token, tokenSecret, profile, done) {
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
        return done(null, false, { message: "You must authenticate with your Buttercoin account." });
      }
      return User.findByEmail(profile.email, function(err, user) {
        if (err != null) {
          return done(err);
        }
        if (user != null) {
          return done(null, user);
        }
        profile.accountId = UUID.v4();
        profile.identifier = profile.id;
        profile.application = 'admin';
        User.createFromCredentials(profile, function(err, user) {
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
