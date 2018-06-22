/*
 * @Author: huyingjun
 * @Date:   2018-01-02 10:21:40
 * @Last Modified by:   huyingjun
 * @Last Modified time: 2018-01-02 10:24:03
 */
const spawn = require('child_process').spawn;
const spawnSync = require('spawn-sync');
const fs = require("fs");
const chalk = require('chalk')
const marked = require("marked");
const stat = fs.stat;
const rimraf = require('rimraf');
const spinner = require('ora')()
const path = require('path');
const TOOL = require('../Tool.js');
const debug = 0;
const srcDir = process.cwd() + "/";
const downloadPath = path.join(process.cwd(), "./download");
const menuJsonFileName = 'generateDocs_menu.json';
const docsFilesName = 'lib';

const console_log = function(value, type) {
    if (!debug) return;

    if (type === 'success') console.log(chalk.green(value))
    else if (type === 'warn') console.log(chalk.yellow(value))
    else if (type === 'error') console.log(chalk.red(value))
    else console.log(value)
}



var DOCS = {
    generateDocs(devs, config) {
        devs.mdPath = !config.git ? path.resolve(process.cwd(), devs.mdPath) : devs.mdPath;
        devs.targetPath = (devs.targetPath && !config.config) ? path.resolve(process.cwd(), devs.targetPath) : devs.targetPath;
        var targetPath = devs.targetPath,
            reg = new RegExp(/\/$/),
            check = reg.test(targetPath);
        if (config.config) this.checkConfig({ devs, config });
        else {
            if (config.git) this.generateDocsByGit(devs, config);
            else {
                // if (!check) {
                //  console_log('指定路径必须以/结尾','error');
                //  return;
                // } else this.generateDocsByLocal(devs, config);

                this.generateDocsByLocal(devs, config);
            }
        }
    },
    generateDocsByLocal(devs, config) {
        return new Promise(resolve => {
            spinner.start(TOOL.translate(global.lang.markdown.building))
            const docsPath = devs.mdPath,
                targetPath = devs.targetPath;
            console_log('\n文档所在的文件夹路径:' + docsPath + '\n', 'warn');
            console_log('\n目标存储路径:' + targetPath + '\n', 'warn');
            if (!fs.existsSync(targetPath)) {
                console_log('\n指定目标路径不存在，新建...\n', 'warn');
                // 创建多级目录
                TOOL.mkdirsSync(targetPath);
            }
            var menuJson = [],
                targetObj = {};
            this.readFileForEach(docsPath, menuJson, targetObj, devs, config);
            console_log("====目录结构:======", 'warn');
            this.writeMenuJson(targetPath + '/' + menuJsonFileName, JSON.stringify(menuJson), () => {
                resolve()
                spinner.succeed(TOOL.translate(global.lang.markdown['build-success']) + '\n')
                process.stdin.pause();
            });
        })
    },
    async generateDocsByGit(devs, config, gitbranch = 'master') {
        const docsPath = devs.mdPath,
            targetPath = devs.targetPath,
            oldtargetPath = devs.oldtargetPath;
        const isExits = fs.existsSync(downloadPath);
        if (isExits) {
            rimraf.sync(downloadPath, {});
        }
        else fs.mkdirSync(downloadPath);

        const downResult = await TOOL.downTemplate(docsPath + '#' + gitbranch, downloadPath);
        if (downResult) {
            await this.generateDocsByLocal({ mdPath: downloadPath, targetPath: devs.targetPath, oldtargetPath:oldtargetPath }, config);
            rimraf.sync(downloadPath, {});
        }
    },
    // 根据路径复制指定文件
    generateDocsFile(src, filepath, devs, config) {
        var targetPath = devs.targetPath,
            oldtargetPath = devs.oldtargetPath,
            targetFiles = targetPath + '/' + docsFilesName,
            dst = targetFiles + '/' + src,
            resolvePath = path.resolve(targetPath, './' + docsFilesName + '/' + src),
            relativePath = oldtargetPath ? path.relative(oldtargetPath, resolvePath) : './' + docsFilesName + '/' + src;
        if (!fs.existsSync(targetFiles)) {
            fs.mkdirSync(targetFiles);
        }
        var readable = fs.createReadStream(filepath), //创建读取流
            writable = fs.createWriteStream(dst); //创建写入流
        readable.pipe(writable);
        console_log(oldtargetPath);
        return relativePath;
    },
    // 根据配置文件来构建
    generateDocsByConfig(data, { devs, config }) {
        var targetDevs = devs.targetPath !== './' ? devs.targetPath.split(',') : [],
            watchGenerate = async (targetName) => {
                for (var i = 0; i < data.options.length; i++) {
                    var option = data.options[i],
                        name = option.name,
                        mdPath = option.mdPath,
                        oldtargetPath = option.targetPath,
                        targetPath = oldtargetPath + '/' + name,
                        gitclone = option.git,
                        gitbranch = option.gitbranch;
                    if (targetName && targetName !== name) continue;
                    // git远程端
                    if (gitclone) await this.generateDocsByGit({ mdPath, targetPath, oldtargetPath }, config, gitbranch);
                    else this.generateDocsByLocal({ mdPath, targetPath, oldtargetPath }, config);
                }
            }
        if (targetDevs.length === 0) watchGenerate();
        for (var y = 0; y < targetDevs.length; y++) {
            watchGenerate(targetDevs[y]);
        }
    },
    // 检测配置文件
    checkConfig({ devs, config }) {
        var configPath = devs.mdPath;
        if (!fs.existsSync(configPath)) return;
        else {
            spinner.start(TOOL.translate(global.lang.markdown.readconfig, [configPath]))
            var configs = fs.readFileSync(configPath, { encoding: 'utf-8' });
            spinner.succeed(TOOL.translate(global.lang.markdown['readconfig-success'], [configPath]))
            configs = JSON.parse(configs);
            if (!configs.options) return;
            else if (configs.options.length > 0) {
                this.generateDocsByConfig(configs, { devs, config });
            }
        }
    },
    readFileForEach(filepath, menuJson, targetObj, devs, config) {
        var paths = fs.readdirSync(filepath),
            ishide_reg = new RegExp(/^\./),
            ismd_reg = new RegExp(/\.(md|MD)$/);
        for (var i = 0; i < paths.length; i++) {
            var _path = paths[i],
                isHide = ishide_reg.test(_path),
                isMarkdownFile = ismd_reg.test(_path);
            if (isHide) continue;
            var _resolvePath = path.resolve(filepath + '/' + _path);
            state = fs.statSync(_resolvePath),
                isDirectory = state.isDirectory(),
                isFile = state.isFile();
            console_log(_resolvePath);
            console_log("====是否是目录:" + isDirectory + "======", 'warn');
            console_log("====是否是文件:" + isFile + "======", 'warn');
            if (isFile && !isMarkdownFile) continue;
            if (isDirectory) {
                var str = {
                    name: _path,
                    path: _resolvePath,
                    children: []
                };
                if (targetObj['children']) {
                    targetObj['children'].push(str);
                } else {
                    menuJson.push(str);
                }
                this.readFileForEach(_resolvePath, menuJson, str, devs, config);
            } else {
                //创建一个对象保存信息
                var obj = new Object();
                obj.size = state.size; //文件大小，以字节为单位
                obj.name = _path; //文件名
                obj.path = _resolvePath; //文件绝对路径

                // 编译
                if (config.marked) obj.content = marked(fs.readFileSync(_resolvePath, 'utf-8'));

                // 写入文件
                obj.relativePath = this.generateDocsFile(_path, _resolvePath, devs, config);

                if (targetObj["children"]) {
                    targetObj['children'].push(obj);
                } else {
                    menuJson.push(obj);
                }
            }
        }
    },
    writeMenuJson(fileName, data, success) {
        fs.writeFile(fileName, data, 'utf-8', success);
    }
}

module.exports = DOCS;