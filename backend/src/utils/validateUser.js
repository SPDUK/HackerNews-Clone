const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');
const isEmpty = require('./is-empty');

function validateUser(_name, _email, password) {
  const name = _name.trim();
  const email = _email.toLowerCase().trim();

  const fields = [
    { type: 'name', data: name, min: 3, max: 20 },
    { type: 'Email', data: email, min: 5, max: 100 },
    { type: 'Password', data: password, min: 8, max: 200 },
  ];

  if (!isEmail(email)) throw new Error('Invalid Email Format');

  fields.forEach(field => {
    const { type, data, min, max } = field;
    if (isEmpty(data)) throw new Error(`${type} is Required`);

    if (!isLength(data, { min, max })) {
      throw new Error(`${type} must be between ${min} and ${max} characters`);
    }
  });

  return { name, email, password };
}
module.exports = validateUser;
