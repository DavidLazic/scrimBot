const validUrl = require('valid-url');

module.exports = {

    isValid: url => validUrl.isUri(url)
};
