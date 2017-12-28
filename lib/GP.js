/*         
* @Author: huyingjun
* @Date:   2017-10-10 16:37:49
* @Last Modified by:   huyingjun
* @Last Modified time: 2017-10-13 17:59:36
*/
const fs          = require("fs");
const colors      = require('colors');
const stat        = fs.stat;
const rimraf      = require('rimraf');
const path        = require('path');
const debug       = 0;
const srcDir      = process.cwd() + "/";
const resPath     = path.join(__dirname,"../node_modules/@sweetui/sweet-demo/");
const myConfig    = require("./config.js");

const console_log = function(value){
	if(!debug) return;
	console.log(value);
}
const rules = {
	empty:{
			"gulp":{reg:/\.*/,t:1},
			"src":{reg:/\/src\/(routes.js|modules\/|thirdsources\/docs|json\/)/,t:0},
			"gulpfile.js":""
	}
}

var GP = {
	generateProject:function(name,config) {
			var that = this,
					type = "";

			that.targetMenu = path.resolve(process.cwd(),name);

			if(config.demo)
			{
				type = "demo";
				console.log("开始构建demo项目");
			}
			else if(config.empty)
			{
				type = "empty";
				console.log("开始构建空项目");
			}
			else if(config.spever)
			{
				type = "spever";
				console.log("开始构建指定版本"+config.spever+"的项目")
			}

			that.build[type](name,config);
	},
	//自定义写入文件流
	writeByDIY:function(){
		 var that = this,
		 		 type = that.type,
		 		 package = myConfig.getPackage(type),   //获取package.json内容
		 		 emptyRoutes = myConfig.getRoutes();    //获取空项目路由配置项内容

		 //写入package.json
		 fs.writeFileSync(GP.targetMenu+"/package.json",package);
		 //写入routes.js
		 fs.writeFileSync(GP.targetMenu+"/src/routes.js",emptyRoutes);
		 //写入空module
		 myConfig.writeEmptyModule(GP.targetMenu+"/src/modules/main/");
		 //写入主入口
		 myConfig.writeMainIndex(GP.targetMenu+"/src/modules/index.html");
	},
	build:{
		checkRegExp:function(value,reg){
			if(!reg)return true;
			value = path.resolve(value);
			var r = reg.reg,
					t = reg.t,
					result = value.match(r);

			return t?result:(!result);
		},
		pipe:function(src,dst,regExp,first){
			var readable,
					writable,
					targetMenu = GP.targetMenu,
					exist = fs.existsSync(targetMenu+"/"+src),
					thisStat = fs.statSync(resPath+src),
					isDirectory = thisStat.isDirectory(),
					isFile = thisStat.isFile(),
					checks = this.checkRegExp(src,regExp);

			if(!checks)return false;
			if(isFile)
			{
				if(first)dst = dst + "/" + src;
				src = path.resolve(resPath+src);
				console_log("==============检测不是为目录===========");
				console.log("[读取]".yellow+":"+src);
				console.log("[写入]".red+":"+dst);
				readable=fs.createReadStream(src);//创建读取流
			  writable=fs.createWriteStream(dst);//创建写入流
			  readable.pipe(writable);
			}
			else if(isDirectory)
			{
				console_log("==============检测是为目录===========");
				if(!exist)
				fs.mkdirSync(targetMenu+"/"+src);
				
				return dst;
			}
		  
		  return false;
		},
		copy:function(src,dst,regExp){
				var that = GP.build,
						targetMenu = GP.targetMenu;
				//这里过来的肯定全是文件夹并且该文件夹已经创建
				//读取目录下的文件
				console_log("==============来到"+src+"文件夹下进行拷贝===========");
				var paths = fs.readdirSync(resPath+src);
				console_log("==============需要拷贝"+paths+"这些文件===========");
				console_log("==============开始遍历这些文件===========");
				for(var i = 0;i<paths.length;i++)
				{
					var _path = paths[i];
					var _src=src + "/" + _path;
		      var _dst=targetMenu+'/'+_src;
		      that.exists(_src,_dst,regExp,that.copy);
				}   
		},
		exists:function(src,dst,regExp,callback,first){
		    //测试某个路径下文件是否存在
		    console_log("==============检测"+src+"是否为目录===========");
		    if(this.pipe(src,dst,regExp,first))
		    {
		    	callback(src,dst,regExp)
		    }		    
		},
		checkProjectPath:function(value){
			if(fs.existsSync(value))
			{
				console.log('文件已存在 '.red);
				process.exit();
			}
		},
		empty:function(name,config){
			var that = this,
					targetMenu = GP.targetMenu;
			console_log("=================开始清理====================");
			console_log("=================目标存储路径:"+targetMenu+"====================");
			this.checkProjectPath(targetMenu);
			// rimraf.sync(targetMenu,{});
			fs.mkdirSync(targetMenu);
			for(var key in rules['empty'])
			{
				var rootGlobs = key,
						regexp = rules['empty'][key];

				console_log("=================开始遍历:"+rootGlobs+"====================");
				that.exists(rootGlobs,targetMenu,regexp,that.copy,1);
			}
			 GP.writeByDIY();
				console.log('=================构建完成================='.green);
				process.stdin.pause();
		}
	}
}

module.exports = GP;