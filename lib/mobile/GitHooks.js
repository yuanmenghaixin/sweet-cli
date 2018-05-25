/**
 * Created by liuzhengdong
 * 2018-05-14
 * 执行 npm run git-install 命令
 * @param {String} targetDir
 */
const execa = require('execa')

module.exports = function (targetDir) {
  const command = 'npm'
  const args = []
  args.push('run', 'git-install', '--loglevel', 'error')
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