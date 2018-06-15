/**
 * Created by huyingjun
 * 2018-05-14
 * @param {String} targetDir
 */
const fs = require('fs')
const path = require('path')

module.exports = function (targetDir) {
  return new Promise((resolve, reject) => {
    const context = `.DS_Store
node_modules/
dist/

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