const isURL = require('validator/lib/isURL');
const isLength = require('validator/lib/isLength');
const isEmpty = require('./is-empty');

function validateLink(url, description) {
  const fields = [
    { type: 'URL', data: url, min: 5, max: 120 },
    { type: 'Description', data: description, min: 5, max: 120 },
  ];

  if (!isURL(url)) throw new Error('Invalid URL Format');

  fields.forEach(field => {
    const { type, data, min, max } = field;
    if (isEmpty(data)) throw new Error(`${type} is Required`);

    if (!isLength(data, { min, max })) {
      throw new Error(`${type} must be between ${min} and ${max} characters`);
    }
  });

  return { url, description };
}
module.exports = validateLink;
