/**
 * Created by liuzhengdong
 * 2018-04-27
 * 版本号 默认1.0.0
 * @param {Object} options
 * @return {Promise.<void>}
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
module.exports = async function (options) {
  const { version } = await inquirer.prompt([
    {
      name: 'version',
      type: 'input',
      message: `Project version (${chalk.cyan(options.package.version)})`
    }
  ])
  if (version) options.package.version = version
}