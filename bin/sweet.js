#!/usr/bin/env node
const inquirer = require('inquirer')
var sCli = require('commander'),
		version = require('../package').version,
		DOCS = require('../lib/docs'),
		tool = require('../lib/Tool.js')

sCli
  .version(version)
  .usage('<command> [options ...]')
  .option('-v','显示版本号',function(){
		console.log(version);
	})
	.option('--lang <language>', '修改语言')
	.option('--demo', '使用init构建时可以选择构建demo项目')
	.option('--git', '使用markdown生成文档json时，<path>为github上的地址')
	.option('--marked', '使用markdown生成文档json时，是否选择要编译')
	.option('--config', '使用markdown生成文档json时，是否要根据config.json来配置，设置该参数后，[path]为config.json文件路径')

// 创建工程指令 默认执行sweet-init.js
sCli
	.command('init')
	.description('generate a new project from a template   创建一个新的工程')
	.action(() => {
		require('./sweet-init.js')(sCli)
	})

sCli
	.command('config')
	.description('edit configs')
	.action(() => {
		tool.setConfig(sCli)
	})

// 生成文档指令
sCli
	.command('markdown <path> [targetPath]')
	.description('根据指定路径，寻找可用的md文件，生成json')
	.action((mdPath, targetPath = './') => {
			const devs = {
				mdPath,
				targetPath
			};
			tool.getConfig(() => {
				DOCS.generateDocs(devs,sCli);
			})
	})



// 将输入源丢给sCli处理
sCli.parse(process.argv)
