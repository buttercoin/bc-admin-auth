var Schema, UserSchema, UserModel, Roles, mongoose;

mongoose = require('mongoose');
Roles = require('../common/roles');

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
  role: { type: Number, required: true }
});

UserSchema.statics.findByIdentifier = function(identifier, cb) {
  var query;
  query = this.findOne({
    identifier: identifier
  });
  return query.exec(cb);
};

UserSchema.statics.createFromCredentials = function(profile, cb) {
  var user, roleValue;
  UserModel.count({}, function(err, count) {
    if (err != null) {
      return cb(err);
    }
    user = new UserModel(profile);

    roleValue = Roles.RestrictedUserRole;
    if (count === 0) {
      roleValue = Roles.SuperUserRole;
    }
    user.role = roleValue;

    cb(null, user);
  });
};

UserSchema.methods.sanitize = function(application) {
  return {
    name: this.get('name'),
    email: this.get('email'),
    role: this.get('role'),
    accountId: this.get('accountId')
  };
};

UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel
