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
const debug = 1;
const srcDir = process.cwd() + "/";
const resPath = path.join(__dirname, "../node_modules/@sweetui/sweet-demo/");
const downloadPath = path.join(__dirname, "../download");
const myConfig = require("./config.js");
const menuJsonFileName = 'generateDocs_menu.json';

const console_log = function(value) {
    if (!debug) return;
    console.log(value);
}



var DOCS = {
    generateDocs(docsPath, config) {
        if (config.git) this.generateDocsByGit(docsPath, config);
        else this.generateDocsByLocal(docsPath, config);
    },
    generateDocsByLocal(docsPath, config) {
        console_log('文档所在的文件夹路径:' + docsPath);
        var menuJson = [],
            targetObj = {};
        this.readFileForEach(docsPath, menuJson, targetObj);
        console_log("====目录结构:======");
        this.writeMenuJson(menuJsonFileName, JSON.stringify(menuJson));
        process.stdin.pause();
    },
    generateDocsByGit(docsPath, config) {
        const isExits = fs.existsSync(downloadPath);
        if (isExits) rimraf.sync(downloadPath, {});
        const git = spawn('git', ['clone', docsPath, downloadPath]);

        git.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        git.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        git.on('close', (code) => {
            console.log(`文档下载完成`);
            this.generateDocsByLocal(downloadPath, config);
        });
    },
    readFileForEach(filepath, menuJson, targetObj) {
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
            console_log("====是否是目录:" + isDirectory + "======");
            console_log("====是否是文件:" + isFile + "======");
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
                this.readFileForEach(_resolvePath, menuJson, str);
            } else {
                //创建一个对象保存信息
                var obj = new Object();
                obj.size = state.size; //文件大小，以字节为单位
                obj.name = _path; //文件名
                obj.path = _resolvePath; //文件绝对路径
                obj.content = marked(fs.readFileSync(_resolvePath, 'utf-8'));

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
            console_log("====生成目录成功======");
        });
    }
}

module.exports = DOCS;