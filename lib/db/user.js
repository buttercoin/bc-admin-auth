var Schema, User, Roles, mongoose;

mongoose = require('mongoose');
Roles = require('../common/roles');

Schema = mongoose.Schema;

User = new Schema({
  accountId: String,
  identifier: String,
  displayName: String,
  email: String,
  name: {
    familyName: String,
    givenName: String
  },
  roles: [{
    appName: String,
    role: Number
  }]
});

User.statics.findByIdentifier = function(identifier, cb) {
  var query;
  query = this.findOne({
    identifier: identifier
  });
  return query.exec(cb);
};

User.statics.createFromCredentials = function(profile, application, cb) {
  var user, role;
  User.count({}, function(err, count) {
    if (err != null) {
      return cb(err);
    }
    role = {};
    if (count === 0) {
      role[application] = Roles.SuperAdminRole;
    } else {
      role[application] = Roles.PublicRole;
    }
    profile.roles = [ role ];
    user = new User(profile);
    cb(null, user);
  });
};

User.methods.sanitize = function(appName) {
  var user;
  return user = {
    email: this.get('email'),
    name: this.get('name'),
    accountId: this.get('accountId'),
    roles: this.getRolesByApp(appName)
  };
};

User.methods.getRolesByApp = function(appName) {
  var allRoles, roleIdx, appRole;

  allRoles = this.get('roles');
  for (roleIdx in allRoles) {
    if (allRoles[roleIdx].appName === appName)
      return allRoles[roleIdx].role;
  }

  return Roles.PublicRole;
};

module.exports = mongoose.model('User', User);

