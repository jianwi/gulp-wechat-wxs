const {src, dest } = require('gulp')
const GulpWechatWXS = require("./index")

function defaultTask(cb) {
    return src(["./test/**.wxs","./test/**.wxml"])
        .pipe(GulpWechatWXS())
        .pipe(dest("./dist"))
}



exports.default = defaultTask