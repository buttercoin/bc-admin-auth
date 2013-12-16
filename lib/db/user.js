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
  role: Role.schema
});

UserSchema.statics.findByIdentifier = function(identifier, cb) {
  var query;
  query = this.findOne({
    identifier: identifier
  });
  return query.exec(cb);
};

UserSchema.statics.createFromCredentials = function(profile, application, cb) {
  var user, roleAttrs;
  UserModel.count({}, function(err, count) {
    if (err != null) {
      return cb(err);
    }
    user = new UserModel(profile);

    roleAttrs = {
      application: application,
      roleValue: Roles.RestrictedUserRole
    };
    if (count === 0) {
      roleAttrs.roleValue = Roles.SuperUserRole;
    }
    user.role = new Role(roleAttrs);

    cb(null, user);
  });
};

UserSchema.methods.sanitize = function(application) {
  return {
    name: this.get('name'),
    email: this.get('email'),
    role: this.get('role')
  };
};

UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel
