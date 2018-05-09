/**
 * Created by liuzhengdong
 * 2018-04-27
 */

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const chalk = require('chalk')
const Creator = require('../lib/mobile/Creator')
const spinner = require('ora')()

/**
 * mobile create
 * @return {Promise.<void>}
 */
async function create() {
  let targetDir = path.resolve('.')
  const options = {}

  // 这里忽略.git目录
  const files = fs.readdirSync(targetDir).filter(f => f !== '.git')
  if (files.length > 0) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `The current directory ${chalk.cyan(targetDir)}  contains files. Pick an action:`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Merge', value: 'merge' },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    console.log()
    if (!action) {
      return
    } else if (action === 'overwrite') {
      spinner.text = chalk.red('Cleaning up the file')
      spinner.start()
      files.forEach(f => {
        rimraf.sync(f)
      })
      spinner.stop()
    }
  }
  options.name = path.parse(targetDir).name
  options.package = {
    name: options.name,
    version: '1.0.0',
    author: 'Geely SweetUI Group',
    description: 'A Vue.js project',
  }
  const promptModules = [
    'Name',
    'Version',
    'Author',
    'Description',
  ].map(file => require(`../lib/mobile/promptModules/${file}`))

  const creator = new Creator(targetDir, promptModules)
  await creator.create(options)
}

module.exports = (...args) => {
  create(...args).catch(err => {
    console.log(err)
    process.exit(1)
  })
}
