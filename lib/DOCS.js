/*
 * @Author: huyingjun
 * @Date:   2018-01-02 10:21:40
 * @Last Modified by:   huyingjun
 * @Last Modified time: 2018-01-02 10:24:03
 */
const spawn = require('child_process').spawn;
const fs = require("fs");
const marked = require("marked");
const colors = require('colors');
const stat = fs.stat;
const rimraf = require('rimraf');
const path = require('path');
const TOOL = require('./TOOL.js');
const debug = 1;
const srcDir = process.cwd() + "/";
const resPath = path.join(__dirname, "../node_modules/@sweetui/sweet-demo/");
const downloadPath = path.join(__dirname, "../download");
const myConfig = require("./config.js");
const menuJsonFileName = 'generateDocs_menu.json';
const docsFilesName = 'lib';

const console_log = function(value, type) {
    if (!debug) return;

    if (type === 'success') value = value.green;
    else if (type === 'warn') value = value.yellow;
    else if (type === 'error') value = value.red;

    console.log(value);
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
        const docsPath = devs.mdPath,
            targetPath = devs.targetPath;
        console_log('文档所在的文件夹路径:' + docsPath, 'warn');
        console_log('目标存储路径:' + targetPath, 'warn');
        if (!fs.existsSync(targetPath)) {
            console_log('指定目标路径不存在，新建...', 'warn');
            // 创建多级目录
            TOOL.mkdirsSync(targetPath);
        }
        var menuJson = [],
            targetObj = {};
        this.readFileForEach(docsPath, menuJson, targetObj, devs, config);
        console_log("====目录结构:======", 'warn');
        this.writeMenuJson(targetPath + '/' + menuJsonFileName, JSON.stringify(menuJson));
        process.stdin.pause();
    },
    generateDocsByGit(devs, config) {
        const docsPath = devs.mdPath,
            targetPath = devs.targetPath;
        const isExits = fs.existsSync(downloadPath);
        if (isExits) rimraf.sync(downloadPath, {});
        else fs.mkdirSync(downloadPath);
        const git = spawn('git', ['clone', docsPath, downloadPath]);

        git.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        git.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        git.on('close', (code) => {
            console_log(`文档下载完成`, 'success');
            console.log(devs);
            this.generateDocsByLocal({ mdPath: downloadPath, targetPath: devs.targetPath }, config);
        });
    },
    // 根据路径复制指定文件
    generateDocsFile(src, filepath, devs) {
        var targetPath = devs.targetPath,
            targetFiles = targetPath + '/' + docsFilesName,
            dst = targetFiles + '/' + src;
        if (!fs.existsSync(targetFiles)) {
            fs.mkdirSync(targetFiles);
        }
        var readable = fs.createReadStream(filepath), //创建读取流
            writable = fs.createWriteStream(dst); //创建写入流
        readable.pipe(writable);
        return './' + docsFilesName + '/' + src;
    },
    // 根据配置文件来构建
    generateDocsByConfig(data, { devs, config }) {
        var targetDevs = devs.targetPath !== './' ? devs.targetPath.split(',') : [],
            watchGenerate = targetName => {
                for (var i = 0; i < data.options.length; i++) {
                    var option = data.options[i],
                        name = option.name,
                        mdPath = option.mdPath,
                        targetPath = option.targetPath + '/' + name,
                        gitclone = option.gitclone;
                    if (targetName && targetName !== name) continue;
                    // git远程端
                    if (gitclone) this.generateDocsByGit({ mdPath, targetPath }, config);
                    else this.generateDocsByLocal({ mdPath, targetPath }, config);
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
            var configs = fs.readFileSync(configPath, { encoding: 'utf-8' });
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
                obj.relativePath = this.generateDocsFile(_path, _resolvePath, devs);

                if (targetObj["children"]) {
                    targetObj['children'].push(obj);
                } else {
                    menuJson.push(obj);
                }
            }
        }
    },
    writeMenuJson(fileName, data) {
        fs.writeFile(fileName, data, 'utf-8', function() {
            console_log("====生成目录成功======", 'success');
        });
    }
}

module.exports = DOCS;