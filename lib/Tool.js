/**
 * Created by liuzhengdong
 * 2018-04-27
 * 工具模块
 */
const execa = require('execa')
const path = require('path')
const download = require('download-git-repo')
const spinner = require('ora')()
const chalk = require('chalk')

/**
 * 安装npm依赖包命令
 * @param {String} targetDir 目录路径
 */
function npmInstall(targetDir) {
  const command = 'npm'
  const args = []
  args.push('install', '--loglevel', 'error')
  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', 'inherit']
    })
    child.on('close', code => {
      if (code !== 0) {
        reject(`command failed: ${command} ${args.join(' ')}`)
        return
      }
      resolve()
    })
  })
}

/**
 * Get a template from Git
 * @param {String} templateUrl 下载git地址
 * 例: sweetui/sweet-mobile-loader 对应 https://github.com/sweetui/sweet-mobile-loader/archive/master.zip 地址
 * @param {String} targetDir 目录路径
 */
function downTemplate(templateUrl, targetDir) {
  return new Promise((resolve) => {
    spinner.text = 'downloading template'
    spinner.start()
    download(templateUrl, targetDir, (err) => {
      spinner.stop()
      if (!err) {
        console.log(chalk.green(`# template download success path ${targetDir}`))
        console.log()
      } else {
        console.log(chalk.red(err))
        process.exit(1)
      }
      resolve()
    })
  })
}

const Tool = {
  npmInstall,
  downTemplate,
}

module.exports = Tool
