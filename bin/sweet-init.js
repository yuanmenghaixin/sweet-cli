#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')

/**
 * create
 */
inquirer.prompt([
  {
    name: 'ok',
    type: 'confirm',
    message: `Generate project in current directory?`
  }
]).then(result => {
  if (result.ok) selectType()
})

/**
 * select the project type
 */
function selectType() {
  inquirer.prompt([
    {
      name: 'project',
      type: 'list',
      message: `Please select the project type.`,
      choices: [
        { name: 'Mobile', value: 'mobile' },
        { name: 'Pc', value: 'pc' },
      ]
    }
  ]).then(answers => {
    console.log()
    console.log(chalk.cyan(`# The ${answers.project} project is being created`))
    console.log()
    if (answers.project === 'mobile') {
      // 执行mobile工程cli
      require('./mobile')()
    } else {
      // 执行pc工程cli
      /**
       * todo pc project
       */
    }
  }).catch(error => {
    console.log()
    console.log(chalk.red(error))
    console.log()
  })

}
