const fs = require("fs");
const colors = require('colors');
const async = require('async');
const path = require('path');
const debug = 1;

const console_log = function(value, type) {
    if (!debug) return;

    if (type === 'success') value = value.green;
    else if (type === 'warn') value = value.yellow;
    else if (type === 'error') value = value.red;

    console.log(value);
}

var TOOL = {
    mkdirsSync(dirname) {
        //console.log(dirname);  
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (TOOL.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }
}
module.exports = TOOL;