import BaseValidator from './basevalidator.js';

class EmailValidator extends BaseValidator {
  constructor(message, attributes) {
    super(message, attributes);
    this.regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }
  isValid(value) {
    return !value || this.regex.test(value);
  }
}

module.exports = EmailValidator;
