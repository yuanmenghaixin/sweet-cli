/**
 * Created by liuzhengdong
 * 2018-04-27
 */

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const chalk = require('chalk')
const Creator = {
    mobile: require('../lib/mobile/Creator'),
    pc: require('../lib/pc/Creator'),
    'demo-pc': require('../lib/demo-pc/Creator')
}
const spinner = require('ora')()
const { translate } = require('../lib/Tool');

/**
 * mobile create
 * @return {Promise.<void>}
 */
async function create({ isDemo }) {
    let targetDir = path.resolve('.')
    const options = {
        isDemo: isDemo,
        isGit: false // .git目录是否存在
    }

    // 这里忽略.git目录
    const files = fs.readdirSync(targetDir).filter(f => {
        if (f === '.git') options.isGit = true
        return f !== '.git'
    })
    if (files.length > 0) {
        const { action } = await inquirer.prompt([{
            name: 'action',
            type: 'list',
            message: translate(global.lang.inquirer.action.message, [targetDir]),
            choices: [
                { name: translate(global.lang.inquirer.action.overwrite), value: 'overwrite' },
                { name: translate(global.lang.inquirer.action.merge), value: 'merge' },
                { name: translate(global.lang.inquirer.action.cancel), value: false }
            ]
        }])
        console.log()
        if (!action) {
            return
        } else if (action === 'overwrite') {
            spinner.text = chalk.red(global.lang.inquirer.action.clean)
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
    let promptModules;
    if (!isDemo) {
        promptModules = [
            'Name',
            'Version',
            'Author',
            'Description',
        ].map(file => require(`../lib/${global.projectType}/promptModules/${file}`))
    }

    const creator = new Creator[global.projectType](targetDir, promptModules)
    await creator.create(options)
}

module.exports = (...args) => {
    create(...args).catch(err => {
        console.log(err)
        process.exit(1)
    })
}