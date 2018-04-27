/**
 * Created by liuzhengdong
 * 2018-04-27
 * package.json文件操作
 * @param {String} targetDir
 * @param {Object} options
 * @return {Promise.<void>}
 */
const fs = require('fs')
const path = require('path')

module.exports = async function (targetDir, options) {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(targetDir, 'package.json'), 'utf-8'))
  Object.assign(packageJson, options.package)
  fs.writeFileSync(path.resolve(targetDir, 'package.json'), JSON.stringify(packageJson))
}