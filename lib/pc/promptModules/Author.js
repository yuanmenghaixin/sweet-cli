/**
 * Created by liuzhengdong
 * 2018-04-27
 * 作者
 * @param {Object} options
 * @return {Promise.<void>}
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
module.exports = async function (options) {
  const { author } = await inquirer.prompt([
    {
      name: 'author',
      type: 'input',
      message: `Author (${chalk.cyan(options.package.author)})`
    }
  ])
  if (author) options.package.author = author
}