var BadDomainError;

BadDomainError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'BadDomainError';
  return this.message = message || null;
};

BadDomainError.prototype.__proto__ = Error.prototype;

module.exports = BadDomainError;

