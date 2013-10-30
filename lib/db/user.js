var Email, Schema, User, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

Email = new Schema({
  value: String
});

User = new Schema({
  identifier: String,
  displayName: String,
  emails: [Email],
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
    emails: this.get('emails'),
    name: this.get('name')
  };
};

module.exports = mongoose.model('User', User);

