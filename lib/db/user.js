var Schema, UserSchema, UserModel, Roles, mongoose;

mongoose = require('mongoose');
Roles = require('../common/roles');

Schema = mongoose.Schema;

UserSchema = new Schema({
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

UserSchema.statics.findByIdentifier = function(identifier, cb) {
  var query;
  query = this.findOne({
    identifier: identifier
  });
  return query.exec(cb);
};

UserSchema.statics.createFromCredentials = function(profile, application, cb) {
  var user, role;
  UserModel.count({}, function(err, count) {
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
    user = new UserModel(profile);
    cb(null, user);
  });
};

UserSchema.methods.sanitize = function(appName) {
  var user;
  return user = {
    email: this.get('email'),
    name: this.get('name'),
    accountId: this.get('accountId'),
    roles: this.getRolesByApp(appName)
  };
};

UserSchema.methods.getRolesByApp = function(appName) {
  var allRoles, roleIdx, appRole;

  allRoles = this.get('roles');
  for (roleIdx in allRoles) {
    if (allRoles[roleIdx].appName === appName)
      return allRoles[roleIdx].role;
  }

  return Roles.PublicRole;
};

UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel
