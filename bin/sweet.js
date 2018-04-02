#!/usr/bin/env node

//定义资源
const sCli = require('commander');
const configs = require('../package.json');
const fs = require('fs');
const GP = require('../lib/GP.js');
const DOCS = require('../lib/DOCS.js');
const defaultPath = './';
const version = configs.version;
const creator = require('../lib/creator');

//基本操作选项
sCli
    .usage('[command] <options ...>')
    .version(version)
    .option('-v', '显示版本号', function() {
        console.log(version);
    })
    .option(
        '--spever [version]',
        '使用new生成sweet项目时，生成指定版本的空项目',
        version
    )
    .option('--empty', '使用new生成sweet项目时，构建出一个空项目')
    .option('--demo', '使用new生成sweet项目时，构建出一个demo项目')
    .option('--git', '使用markdown生成文档json时，<path>为github上的地址')
    .option('--marked', '使用markdown生成文档json时，是否选择要编译')
    .option(
        '--config',
        '使用markdown生成文档json时，是否要根据config.json来配置，设置该参数后，[path]为config.json文件路径'
    );
sCli
    .command('create <ProjectName>')
    .description('创建工程')
    .option('-m, --mode [value]', '创建工程的模式')
    .option('-p, --path [value]', '工程目录路径')
	.action(creator);

//new指令
sCli
    .command('new <projectName>')
    .description('生成项目')
    .action(function(name) {
        GP.generateProject(name, sCli);
    });

//update指令
sCli
    .command('update <projectName>')
    .description('更新版本')
    .action(function(version) {
        console.log(version);
    });
//markdown指令
sCli
    .command('markdown <path> [targetPath]')
    .description('根据指定路径，寻找可用的md文件，生成json')
    .action((mdPath, targetPath = './') => {
        const devs = {
            mdPath,
            targetPath
        };
        DOCS.generateDocs(devs, sCli);
    });

//将输入源丢给sCli进行处理
sCli.parse(process.argv);
