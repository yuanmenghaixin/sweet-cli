/**
 * app.config.js配置
 * @param {String} targetDir
 * @param {Object} options
 * @return {Promise.<void>}
 */
const fs = require('fs')
const path = require('path')

module.exports = async function (targetDir, options) {
  let packageJson = fs.readFileSync(path.resolve(targetDir, 'app.config.js'), 'utf-8')
  packageJson = packageJson.replace('SWEET-THEME-COLOR', `${options.package.name}-THEME-COLOR`.toUpperCase())
  fs.writeFileSync(path.resolve(targetDir, 'app.config.js'), packageJson)
}