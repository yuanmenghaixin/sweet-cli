/**
 * Created by liuzhengdong
 * 下载工程模版
 * @param {Object} targetDir
 */
const download = require('download-git-repo')
const spinner = require('ora')()
const chalk = require('chalk')

module.exports = async function (targetDir) {
  await new Promise((resolve) => {
    const templateUrl = 'sweetui/sweet-mobile-loader'
    console.log()
    spinner.text = 'downloading template'
    spinner.start()
    download(templateUrl, targetDir, (err) => {
      spinner.stop()
      if (!err) {
        console.log(chalk.green(`template download success path ${targetDir}`))
      } else {
        console.log(chalk.red(err))
        process.exit(1)
      }
      resolve()
    })
  })
}