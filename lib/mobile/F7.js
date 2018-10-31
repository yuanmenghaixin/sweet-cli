/**
 * Created by liuzhengdong
 * 2018-10-30
 * 是否使用f7框架
 * @param {String} targetDir
 * @return {Promise.<void>}
 */
const path = require('path')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const fs = require('fs')
const templateDir = path.resolve(__dirname, 'template')
module.exports = async function (targetDir) {
  const { action } = await inquirer.prompt([{
    name: 'action',
    type: 'list',
    message: '是否使用Framework7-vue UI框架',
    choices: [
      { name: '是', value: true },
      { name: '否', value: false }
    ]
  }])
  if (!action) {
    rimraf.sync(path.resolve(targetDir, 'src'), {}, err => {
      console.log(err)
    })
    const stat = fs.stat

    function copy(src, dst) {
      //读取目录
      fs.readdir(src, (err, paths) => {
        if (err) throw err
        paths.forEach(path => {
          let _src = src + '/' + path
          let _dst = dst + '/' + path
          let readable
          let writable
          stat(_src, (err, st) => {
            if (err) throw err
            if (st.isFile()) {
              readable = fs.createReadStream(_src) // 创建读取流
              writable = fs.createWriteStream(_dst) // 创建写入流
              readable.pipe(writable)
            } else if (st.isDirectory()) {
              exists(_src, _dst, copy)
            }
          })
        })
      })
    }

    function exists(src, dst, callback) {
      //测试某个路径下文件是否存在
      fs.exists(dst, exists => {
        if (exists) {//不存在
          callback(src, dst)
        } else {//存在
          fs.mkdir(dst, () => {//创建目录
            callback(src, dst)
          })
        }
      })
    }

    exists(templateDir, targetDir, copy)
  }
}