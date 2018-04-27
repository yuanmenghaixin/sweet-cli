/**
 * Created by liuzhengdong
 * 2018-04-27
 * 工具模块
 */
const execa = require('execa')
const path = require('path')
const spinner = require('ora')()

/**
 * 安装npm依赖包命令
 * @param {String} targetDir
 */
function npmInstall(targetDir) {
  spinner.text = 'installing'
  spinner.start()
  execa.shellSync('npm i', { cwd: path.resolve(process.cwd(), targetDir) })
  spinner.stop()
}

const Tool = {
  npmInstall
}

module.exports = Tool
