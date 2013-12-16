var RoleList;
RoleList = function() {
  this.InvalidUserRole       = 0;
  this.RestrictedUserRole    = 1 << 0;
  this.StandardUserRole      = 1 << 1;
  this.AdminUserRole         = 1 << 2;
  this.SuperUserRole         = 1 << 3;
};

module.exports = new RoleList();

