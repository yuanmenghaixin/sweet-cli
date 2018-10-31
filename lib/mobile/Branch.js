/**
 * Created by liuzhengdong
 * 2018-10-24
 * 选择分支
 * @param {Object} options
 * @return {Promise.<void>}
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
const tool = require('./../../lib/Tool.js')

module.exports = async function (options) {
  let branches = []
  await tool.getGitBranches('sweet-mobile-template').then(res => {
    branches = res
  })
  const { branch } = await inquirer.prompt([{
    name: 'branch',
    type: 'list',
    message: global.lang.inquirer['select-branch'],
    choices: branches
  }])
  options.branch = branch
}