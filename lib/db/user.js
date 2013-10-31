var Email, Schema, User, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

User = new Schema({
  accountId: String,
  identifier: String,
  displayName: String,
  email: String,
  name: {
    familyName: String,
    givenName: String
  }
});

User.statics.findByIdentifier = function(identifier, cb) {
  var query;
  query = this.findOne({
    identifier: identifier
  });
  return query.exec(cb);
};

User.methods.sanitize = function() {
  var user;
  return user = {
    email: this.get('email'),
    name: this.get('name'),
    accountId: this.get('accountId')
  };
};

module.exports = mongoose.model('User', User);

