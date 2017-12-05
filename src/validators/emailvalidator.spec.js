import EmailValidator from './emailvalidator.js';

describe('Email validator', () => {

  it('Should ignore empty values', () => {
    const validator = new EmailValidator('error!', {});
    expect(validator.isValid('')).to.equal(true);
  });

  it('Should accept valid emails', () => {
    const validator = new EmailValidator('error!', {});
    expect(validator.isValid('woutermflorijn@gmail.com')).to.equal(true);
    expect(validator.isValid('woutermflorijn+test@gmail.com')).to.equal(true);
    expect(validator.isValid('info@crowded.co')).to.equal(true);
  });

  it('Should not accept invalid emails', () => {
    const validator = new EmailValidator('error!', {});
    expect(validator.isValid('12345678')).to.equal(false);
    expect(validator.isValid('dit is geen email ouwe')).to.equal(false);
  });
});
