/**
 * 工程名称
 * @param {Object} options
 * @return {Promise.<void>}
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
module.exports = async function (options) {
  console.log()
  const { name } = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: `Project name (${chalk.cyan(options.package.name)})`
    }
  ])
  if (name) options.package.name = name
}