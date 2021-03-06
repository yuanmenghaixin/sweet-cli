#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const tool = require('../lib/Tool.js')
const { translate } = require('../lib/Tool');
global.sweetConfig = require('../package.json')['SWEET-CONFIG']
/**
 * chose language
 */

// inquirer.prompt([{
//     name: 'project',
//     type: 'list',
//     message: `请选择语言 Please select the language.`,
//     choices: [
//         { name: 'zh-CN', value: 'zh-CN' },
//         { name: 'en', value: 'en' },
//     ]
// }]).then(result => {
//     global.lang = i18n(result.project);
//     create();
// })


/**
 * create
 */
function create(isDemo) {
    inquirer.prompt([{
        name: 'ok',
        type: 'confirm',
        message: isDemo ? global.lang.inquirer.createDemo : global.lang.inquirer.create
    }]).then(result => {
        if (result.ok) selectType(isDemo)
    })
}

/**
 * select the project type
 */
function selectType(isDemo) {
    let list = [
        { name: 'Mobile', value: 'mobile' },
        { name: 'Pc', value: 'pc' }
    ]
    if (isDemo) list.shift();
    inquirer.prompt([{
        name: 'project',
        type: 'list',
        message: global.lang.inquirer['select-type' + (isDemo ? '-demo' : '')],
        choices: list
    }]).then(answers => {
        console.log()
        console.log(translate(global.lang.inquirer.created, [(isDemo ? 'demo-' : '') + answers.project]))
        console.log()
        // 根据全局变量来执行web工程cli
        global.projectType = (isDemo ? 'demo-' : '') + answers.project;
        require('./web')({ isDemo })
    }).catch(error => {
        console.log()
        console.log(chalk.red(error))
        console.log()
    })

}

module.exports = function(cmd) {
    tool.getConfig(() => {
        create(cmd.demo);
    })
}