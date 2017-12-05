import BaseValidator from './basevalidator.js';

class RequiredValidator extends BaseValidator {
  isValid(value) {
    return !!value || (value === false);
  }
}

module.exports = RequiredValidator;
