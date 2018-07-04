/**
 * Created by liuzhengdong
 * 2018-05-14
 * 执行 npm run git-install 命令
 * @param {String} targetDir
 */
const fs = require('fs')
const path = require('path')

module.exports = function (targetDir) {
  return new Promise((resolve, reject) => {
    const context = `.DS_Store
node_modules/
dist/
cordova/

npm-debug.log*
# Editor directories and files
.project
.vscode
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.log
vendors-manifest.json
`
    try {
      fs.writeFileSync(path.resolve(targetDir, '.gitignore'), context)
      resolve()
    } catch (e) {
      reject()
    }
  })
}