var Roles;

Roles = function() {
  this.PublicRole        = 1 << 0;
  this.UserRole          = 1 << 1;
  this.AdminRole         = 1 << 2;
  this.SuperAdminRole    = 1 << 3;
};

exports.Roles = new Roles();

