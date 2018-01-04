#!/usr/bin/env node

//定义资源
var sCli = require('commander'),
		configs = require("../package.json"),
		fs = require('fs'),
		GP = require('../lib/GP.js'),
		DOCS = require('../lib/DOCS.js'),
		defaultPath = './'
		version = configs.version;

//基本操作选项
sCli
		.usage("[command] <options ...>")
		.version(version)
		.option('-v','显示版本号',function(){
			console.log(version);
		})
		.option('--spever [version]','使用new生成sweet项目时，生成指定版本的空项目',version)
		.option('--empty', '使用new生成sweet项目时，构建出一个空项目')
		.option('--demo', '使用new生成sweet项目时，构建出一个demo项目')
		.option('--git', '使用markdown生成文档json时，<path>为github上的地址');

//new指令
sCli
		.command('new <projectName>')
		.description('生成项目')
		.action(function(name) {
    		GP.generateProject(name,sCli);
		});

//update指令
sCli
		.command('update <projectName>')
		.description('更新版本')
		.action(function(version){
			console.log(version);
		})
//markdown指令
sCli
		.command('markdown <path>')
		.description('根据指定路径，寻找可用的md文件，生成json')
		.action(mdPath => {
			DOCS.generateDocs(mdPath,sCli);
		})

//将输入源丢给sCli进行处理
sCli.parse(process.argv);