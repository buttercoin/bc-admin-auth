var Schema, UserSchema, UserModel, Role, Roles, mongoose;

mongoose = require('mongoose');
Role = require('../common/roles');
Roles = require('../common/roles').Roles;

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
  roles: [ Role ]
});

UserSchema.statics.findByIdentifier = function(identifier, cb) {
  var query;
  query = this.findOne({
    identifier: identifier
  });
  return query.exec(cb);
};

UserSchema.statics.createFromCredentials = function(profile, application, cb) {
  var user, roleAttrs, userRole;
  UserModel.count({}, function(err, count) {
    if (err != null) {
      return cb(err);
    }
    user = new UserModel(profile);

    roleAttrs = {
      appName: application,
      role: Roles.PublicRole
    };
    if (count === 0) {
      roleAttrs['role'] = Roles.SuperAdminRole;
    }
    userRole = new Role(roleAttrs);
    user.roles.push(userRole);

    cb(null, user);
  });
};

UserSchema.methods.sanitize = function(application) {
  var user;
  return user = {
    email: this.get('email'),
    name: this.get('name'),
    accountId: this.get('accountId'),
    roles: this.getRolesByApp(application)
  };
};

UserSchema.methods.getRolesByApp = function(application) {
  var allRoles, roleIdx, appRole;

  allRoles = this.get('roles');
  for (roleIdx in allRoles) {
    if (allRoles[roleIdx].appName === application)
      return allRoles[roleIdx].role;
  }

  return Roles.PublicRole;
};

UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel
