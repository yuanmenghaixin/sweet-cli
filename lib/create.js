const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const chalk = require('chalk')
const Creator = require('./Creator')

async function create() {
  let targetDir = path.resolve('.')
  const options = {}

  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `Generate project in current directory?`
    }
  ])
  if (!ok) return
  const files = fs.readdirSync(targetDir)
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
    if (!action) {
      return
    } else if (action === 'overwrite') {
      files.forEach(f => {
        rimraf.sync(f)
      })
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
  ].map(file => require(`./promptModules/${file}`))
  const creator = new Creator(targetDir, promptModules)
  await creator.create(options)
}

module.exports = (...args) => {
  create(...args).catch(err => {
    console.log(err)
    process.exit(1)
  })
}
