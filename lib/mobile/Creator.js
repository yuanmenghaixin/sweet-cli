/**
 * Created by liuzhengdong
 * 2018-04-27
 */

const chalk = require('chalk')
const setPackage = require('./Package')
const setAppConfig = require('./App.Config')
const gitHooks = require('./GitHooks')
const tool = require('../Tool')

// mobile project git address
const gitUrl = 'sweetui/sweet-mobile-loader'

module.exports = class Creator {
  constructor(targetDir, promptModules) {
    this.targetDir = targetDir
    this.promptModules = promptModules
  }

  async create(options = {}) {

    // 下载template
    await tool.downTemplate(gitUrl, this.targetDir)

    async function mainModules(promptModules, options) {
      for (let prompt of promptModules) {
        await prompt(options)
      }
    }

    await mainModules(this.promptModules, options)
    // 修改package信息
    await setPackage(this.targetDir, options)

    // 修改工程app.config.js配置
    await setAppConfig(this.targetDir, options)

    console.log()
    console.log(chalk.green(`# ${options.package.name} 工程创建成功`))
    console.log()
    console.log(chalk.green('# Installing project dependencies ...'))
    console.log('# ========================')
    console.log()
    await tool.npmInstall(this.targetDir)

    console.log(chalk.green('# Installation success'))
    console.log()
    // npm i 安装依赖包
    if (options.isGit) {
      await gitHooks(this.targetDir)
      console.log()
      console.log(chalk.green('# Git hook installation success'))
      console.log()
    } else {
      console.log(chalk.red('# Git has not been detected,Fail to execute the `npm run git-install` command'))
      console.log(chalk.red('# 未检测到Git,执行 `npm run git-install` 命令失败'))
      console.log()
      console.log(chalk.red('# 请先将项目添加到github仓库(安装git)，再执行`npm run git-install`命令安装git钩子(Important!!!)'))
      console.log()
    }
  }
}