const requireDir = require('require-dir');
const locales = requireDir('./locale');

module.exports = function(lang) {
	return locales[lang];
}