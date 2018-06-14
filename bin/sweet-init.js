#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const i18n = require('../lib/i18n');
const { translate } = require('../lib/Tool');

/**
 * chose language
 */

inquirer.prompt([{
    name: 'project',
    type: 'list',
    message: `请选择语言 Please select the language.`,
    choices: [
        { name: 'zh-CN', value: 'zh-CN' },
        { name: 'en', value: 'en' },
    ]
}]).then(result => {
    global = {
      lang: i18n(result.project)
    }
    create();
})


/**
 * create
 */
function create() {
    inquirer.prompt([{
        name: 'ok',
        type: 'confirm',
        message: global.lang.inquirer.create
    }]).then(result => {
        if (result.ok) selectType()
    })
}

/**
 * select the project type
 */
function selectType() {
    inquirer.prompt([{
        name: 'project',
        type: 'list',
        message: global.lang.inquirer['select-type'],
        choices: [
            { name: 'Mobile', value: 'mobile' },
            { name: 'Pc', value: 'pc' },
        ]
    }]).then(answers => {
        console.log()
        console.log(translate(global.lang.inquirer.created, [answers.project]))
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