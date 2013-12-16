var Schema, UserSchema, UserModel, Role, Roles, mongoose;

mongoose = require('mongoose');
Role = require('../common/roles');
Roles = require('../common/roles').Roles;

Schema = mongoose.Schema;

UserSchema = new Schema({
  displayName: { type: String },
  email: { type: String, required: true },
  accountId: { type: String, required: true, unique: true },
  identifier: { type: String, required: true, unique: true },
  name: {
    familyName: String,
    givenName: String
  },
  roles: [ Role.schema ]
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
      role: Roles.RestrictedUserRole
    };
    if (count === 0) {
      roleAttrs['role'] = Roles.SuperUserRole;
    }
    userRole = new Role(roleAttrs);
    user.roles.push(userRole);

    cb(null, user);
  });
};

UserSchema.methods.sanitize = function(application) {
  var user;
  return user = {
    name: this.get('name'),
    email: this.get('email'),
    role: this.getRoleByApplication(application)
  };
};

UserSchema.methods.getRoleByApplication = function(application) {
  var allRoles, roleIdx, appRole;

  allRoles = this.get('roles');
  for (roleIdx in allRoles) {
    if (allRoles[roleIdx].appName === application)
      return allRoles[roleIdx].role;
  }

  return Roles.RestrictedUserRole;
};

UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel
