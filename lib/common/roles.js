var Schema, Role, RoleList, mongoose;

mongoose = require('mongoose');
Schema = mongoose.Schema;

Role = new Schema({
  appName: { type: String, required: true },
  role: { type: Number, required: true }
}, {
  id: false,
  _id: false
});

RoleList = function() {
  this.InvalidUserRole       = 0;
  this.RestrictedUserRole    = 1 << 0;
  this.StandardUserRole      = 1 << 1;
  this.AdminUserRole         = 1 << 2;
  this.SuperUserRole         = 1 << 3;
};

module.exports = mongoose.model('Role', Role);
module.exports.Roles = new RoleList();

