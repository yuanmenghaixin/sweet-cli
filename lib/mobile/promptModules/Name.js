/**
 * Created by liuzhengdong
 * 2018-04-27
 * 工程名称
 * @param {Object} options
 * @return {Promise.<void>}
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
module.exports = async function (options) {
  const { name } = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: `Project name (${chalk.cyan(options.package.name)})`
    }
  ])
  if (name) options.package.name = name
}