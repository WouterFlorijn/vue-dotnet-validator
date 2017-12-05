export default {
  Required:  require('./requiredvalidator.js'),
  Minlength: require('./minlengthvalidator.js'),
  Maxlength: require('./maxlengthvalidator.js'),
  Length:    require('./stringlengthvalidator.js'),
  Range:     require('./rangevalidator.js'),
  Regex:     require('./regexvalidator.js'),
  Equalto:   require('./equaltovalidator.js'),

  Email:     require('./emailvalidator.js'),
  Url:       require('./urlvalidator.js')
};
