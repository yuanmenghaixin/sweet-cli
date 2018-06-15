/*
 * =====================================
 * name    : sweet-cli命令行pc端构造器
 * version : v1.0.0
 * time    : 2018-06-15 16:21:59
 * auth    : huyingjun
 * e-mail  : yingjun.hu@geely.com
 * =====================================
 */

const chalk = require('chalk')
const requireDir = require('require-dir')
const { setPackage, setGitIgnore } = requireDir('./sets')
const tool = require('../Tool')

// mobile project git address
const gitUrl = global.sweetConfig.git.pc
module.exports = class Creator {
    constructor(targetDir, promptModules) {
        // console.log(promptModules)
        this.targetDir = targetDir
        this.promptModules = promptModules
    }

    async create(options = {}) {

        // 下载template
        await tool.downTemplate(gitUrl, this.targetDir)

        // 生成.gitignore文件
        await setGitIgnore(this.targetDir)

        async function mainModules(promptModules, options) {
            for (let prompt of promptModules) {
                // console.log(prompt)
                await prompt(options)
            }
        }

        // 执行promptModules
        await mainModules(this.promptModules, options)
        // 修改package信息
        await setPackage(this.targetDir, options)

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