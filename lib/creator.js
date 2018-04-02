const { spawn, execSync } = require('child_process');
const path = require('path');
const downloadGit = require('download-git-repo');

let projectName,cliParams,folderPath;
const getTemplate = function() {
    let templateUrl;
    switch (cliParams.mode) {
        case 'sweet-mobile-2':
            templateUrl =
                'https://github.com/sweetui/sweet-mobile-template.git';
            break;
        case 'sweet-ui-2':
            templateUrl =
                'https://github.com/sweetui/sweet-mobile-template.git';
        default:
            templateUrl =
                'https://github.com/sweetui/sweet-mobile-template.git';
            break;
    }
    const getCode = spawn('git', ['clone', templateUrl, folderPath]);
    getCode.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
    });
    getCode.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });
    getCode.on('close', code => {
        if (code === 0) {
            console.log('项目工程模板下载完毕！');
            clearGit();
            npmInstall();
            return;
        } else {
            console.log(`进程中断，退出码：${code}`);
        }
    });
};

const npmInstall = function() {
    execSync(
        'npm i',
        { cwd: path.resolve(process.cwd(), folderPath) },
        (err, stdout, stderr) => {
            if (stdout) console.log(`stdout: ${stdout}`);
            console.log('install');
            console.log(err ? err : '开发环境安装完毕!');
            if (stderr) console.log(`stderr: ${stderr}`);
        }
    );
};

const clearGit = function() {
    execSync(
        'rm -rf ' + 'LICENSE .git',
        { cwd: path.resolve(process.cwd(), folderPath) },
        (err, stdout, stderr) => {
            if (stdout) console.log(`stdout: ${stdout}`);
            console.log('git');
            console.log(err ? err : '清除git完毕!');
            if (stderr) console.log(`stderr: ${stderr}`);
        }
    );
};

module.exports = function(name, params) {
    folderPath = params.path ? path.join(params.path) : name;
    projectName = name;
    cliParams = params;
    getTemplate();
    // npmInstall(name, params);
};
