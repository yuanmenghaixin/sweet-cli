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
const fs = require('fs')
const i18n = require('./i18n');
const https = require('https')

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
  return new Promise((resolve, reject) => {
    spinner.start(translate(global.lang.inquirer.action.download, [templateUrl]))
    download(templateUrl, targetDir, (err) => {
      if (!err) {
        spinner.succeed(translate(global.lang.inquirer.action.downloaded, [targetDir]) + '\n')
        resolve(true)
      } else {
        spinner.fail(chalk.red(translate(global.lang.inquirer.action['download-fail'], [templateUrl])))
        resolve(false)
        process.stdin.pause();
      }
      // resolve()
    })
  })
}

/**
 * 获取项目所有分支
 */
function getGitBranches(templateName) {
  return new Promise((resolve, reject) => {
    const opts = {
      method: 'GET', port: 443, host: 'api.github.com',
      path: `/repos/sweetui/${templateName}/branches`,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': 30,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
      }
    }
    spinner.start('正在拉取template分支列表')
    const branchList = [{name: '最新版本', value: 'master'},]
    https.get(opts, res => {
      let dataList = ''
      res.on('data', data => {
        dataList += data
      })
      res.on("end", function () {
        dataList = JSON.parse(dataList.toString()) || []
        if (!(dataList instanceof Array)) dataList = []
        dataList.forEach(val => {
          if (val.name !== 'master') {
            branchList.push({name: val.name, value: val.name})
          }
        })
        spinner.stop()
        resolve(branchList)
      })
    }).on('error', function (err) {
      console.log()
      console.log('获取模块分支列表出错了')
      reject(err)
      spinner.stop()
    })
  })
}

/**
 * 匹配输出文本
 * @作者     huyingjun
 * @时间     2018-06-14
 * @param  {String}   text   字符串文本
 * @param  {Array}    points 替换目标数组
 * @return {String}          字符串文本
 */
function translate(text = '', points) {
  var reg = /\$\{[1-9]\d*\}/g,
    matchs = text.match(reg)
  // console.log(matchs)
  if (!points) return text
  for (var i = 0; i < matchs.length; i++) {
    text = text.replace(matchs[i], `${chalk.cyan(points[i])}`)
  }
  return text
}

/**
 * 创建多级目录
 * @作者     huyingjun
 * @时间     2018-06-21
 * @param  {String}   dirname  路径字符串
 * @return {Boolean}           返回
 */
function mkdirsSync(dirname) {
  //console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取配置
 * @作者     huyingjun
 * @时间     2018-06-22
 * @param  {Function}   success 成功回调函数
 * @param  {Function}   error   失败回调
 * @return {NULL}
 */
function getConfig(success, error) {
  fs.readFile(path.join(__dirname, '../.config'), 'utf8', (err, data) => {
    if (!err) {
      global.lang = i18n(JSON.parse(data).language)
      if (typeof success === 'function') success()
    } else {
      if (typeof error === 'function') error(err);
      console.log(err);
      process.exit(1);
    }
  })
}

/**
 * 设置配置
 * @作者    huyingjun
 * @时间    2018-06-29
 * @param {Object}   cmd 命令对象
 */
function setConfig(cmd) {
  let configpath = path.join(__dirname, '../.config'),
    config = JSON.parse(fs.readFileSync(configpath, 'utf-8')),
    {
      lang
    } = cmd;
  config = Object.assign(config, {language: lang});
  // 语言包不存在
  if (!i18n(lang)) {
    getConfig(() => {
      console.log()
      console.log(chalk.red(translate(global.lang.config['set-lang-error'])));
      console.log()
      process.exit(1);
    })
  } else {
    getConfig(() => {
      fs.writeFileSync(configpath, JSON.stringify(config, null, 2))
      console.log()
      console.log(chalk.green(translate(global.lang.config['set-success'])));
      console.log()
    })
  }
}

const Tool = {
  npmInstall,
  downTemplate,
  translate,
  mkdirsSync,
  getConfig,
  setConfig,
  getGitBranches
}

module.exports = Tool