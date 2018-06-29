/*
 * =====================================
 * name    : sweet-cli命令行pc端demo构造器
 * version : v1.0.0
 * time    : 2018-06-15 16:21:59
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */

const chalk = require('chalk')
const requireDir = require('require-dir')
const tool = require('../Tool')

// mobile project git address
const gitUrl = global.sweetConfig.git['demo-pc']
module.exports = class Creator {
    constructor(targetDir, promptModules) {
        // console.log(promptModules)
        this.targetDir = targetDir
        this.promptModules = promptModules
    }

    async create(options = {}) {

        // 下载template
        await tool.downTemplate(gitUrl, this.targetDir)

        console.log()
        console.log(chalk.green(tool.translate(global.lang.inquirer.action.created, [options.package.name])))
        console.log()
        console.log(chalk.green(tool.translate(global.lang.inquirer.action.installing)))
        console.log('# ========================')
        console.log()
        await tool.npmInstall(this.targetDir)

        console.log(chalk.green(tool.translate(global.lang.inquirer.action.installed)))
    }
}