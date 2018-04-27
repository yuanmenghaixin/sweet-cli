/**
 * Created by liuzhengdong
 * 2018-04-27
 */

const chalk = require('chalk')
const getTemplate = require('./Template')
const setPackage = require('./Package')
const setAppConfig = require('./App.Config')
const tool = require('./Tool')

module.exports = class Creator {
  constructor(targetDir, promptModules) {
    this.targetDir = targetDir
    this.promptModules = promptModules
  }

  async create(options = {}) {

    // 获取template
    await getTemplate(this.targetDir)

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
    console.log(chalk.green(`  ${options.package.name} 工程创建成功`))
    console.log()

    // npm i 安装依赖包
    tool.npmInstall(this.targetDir)
    console.log(chalk.green('install 依赖安装成功 可以 npm start 运行项目了'))
    console.log()
  }
}