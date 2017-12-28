/*
* @Author: huyingjun
* @Date:   2017-10-12 15:22:05
* @Last Modified by:   huyingjun
* @Last Modified time: 2017-10-13 17:00:30
*/

const fs          = require("fs");
const path        = require("path");
const resPath     = "../node_modules/@sweetui/sweet-demo/";
const emptyModules = "./template/emptyModule";
const lib_package = require("../node_modules/@sweetui/sweet-demo/package.json");
const emptyRoutes = require("./template/emptyRoutes.json");

module.exports = {
	// 构建package.json
	getPackage(type) {
		var result = {
			"name": "sweet-loader",
		  "version": lib_package.version,
		  "description": "这是一个sweet-loader",
		  "scripts": {
		    "start": "gulp --env dev",
		    "dev": "gulp build --env dev",
		    "test": "gulp build --env test",
		    "product": "gulp build --env production",
		    "build": "gulp build --env production"
		  },
		  "devDependencies":lib_package.devDependencies,
		  "dependencies":lib_package.dependencies
		}
		return JSON.stringify(result,null,4);
	},
	getRoutes() {
		var result = '// 路由配置项\n' +
								 'module.exports=' + 
								 JSON.stringify(emptyRoutes,null,4) + '\n'
								 '// end';

		return result;
	},
	writeEmptyModule(writePath) {
		var readPath = path.join(__dirname,emptyModules),
				paths = fs.readdirSync(readPath);
		// 生成main文件夹
		fs.mkdirSync(writePath);
		for(var i = 0;i<paths.length;i++)
		{
			var file = paths[i];
			readable=fs.createReadStream(readPath+"/"+file);//创建读取流
			writable=fs.createWriteStream(writePath+file);//创建写入流
			readable.pipe(writable);
		}
	},
	writeMainIndex(writePath) {
		var readfile = path.join(__dirname,"./template/index.html");
		readable=fs.createReadStream(readfile);//创建读取流
		writable=fs.createWriteStream(writePath);//创建写入流
		readable.pipe(writable);
	}
}