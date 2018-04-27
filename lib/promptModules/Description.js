/**
 * Created by liuzhengdong
 * 2018-04-27
 * 描述
 * @param {Object} options
 * @return {Promise.<void>}
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
module.exports = async function (options) {
  console.log()
  const { description } = await inquirer.prompt([
    {
      name: 'description',
      type: 'input',
      message: `Project description (${chalk.cyan(options.package.description)})`
    }
  ])
  if (description) options.package.description = description
}