import UrlValidator from './urlvalidator.js';

describe('Email validator', () => {

  it('Should ignore empty values', () => {
    const validator = new UrlValidator('error!', {});
    expect(validator.isValid('')).to.equal(true);
  });

  it('Should accept valid urls', () => {
    const validator = new UrlValidator('error!', {});
    expect(validator.isValid('http://www.google-com.123.com')).to.equal(true);
    expect(validator.isValid('https://www.google-com.com')).to.equal(true);
    expect(validator.isValid('http://google-com.com')).to.equal(true);
    expect(validator.isValid('http://google.com')).to.equal(true);
    expect(validator.isValid('//cdnblabla.cloudfront.net/css/app.css')).to.equal(true);
  });

  it('Should not accept invalid urls', () => {
    const validator = new UrlValidator('error!', {});
    expect(validator.isValid('http://www.google-com.123')).to.equal(false);
    expect(validator.isValid('http://www.gfh.')).to.equal(false);
    expect(validator.isValid('http://www.gfh.c')).to.equal(false);
    expect(validator.isValid('http://www.gfh:800000')).to.equal(false);
    expect(validator.isValid('www.google.com ')).to.equal(false);
    expect(validator.isValid('http://google')).to.equal(false);
  });
});
