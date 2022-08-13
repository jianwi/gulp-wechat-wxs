#  gulp-wechat-wxs
gulp-wechat-wxs 是一个 gulp 插件。  
如果你习惯了使用模板字符串，用let 和 const 声明变量。然而却被wxs的语法（微信小程序脚本语言）折磨着。
你要做的不是改变自己的习惯，而是在你的项目里用上此插件。

gulp-wechat-wxs 帮你将模板字符串和用let、const 声明的变量转换为wxs支持的语法。

# 使用
安装依赖
```shell
npm install gulp gulp-wechat-wxs -D
```
在你的 gulpfile 中这样写
```javascript
const {src, dest } = require('gulp')
const GulpWechatWXS = require("gulp-wechat-wxs")

function defaultTask(cb) {
    return src(["./src/**.wxs","./src/**.wxml"])
        .pipe(GulpWechatWXS())
        .pipe(dest("./dist"))
}

exports.default = defaultTask
```

### 比较省事的用法
会直接替换掉源文件

```javascript
const {src, dest } = require('gulp')
const GulpWechatWXS = require("gulp-wechat-wxs")

function defaultTask(cb) {
    return src(["**/**.wxs","**/**.wxml"])
        .pipe(GulpWechatWXS())
        .pipe(dest("."))
}

exports.default = defaultTask
```

# 支持的写法
## 1. 支持 WXML 中嵌入的 wxs
源文件
```xml
<wxs module="ddd">
    function f() {
    let a = 123333
    return `answer is ${a+100} haha`
    }
</wxs>

<view>支持在wxml里嵌入的wxs代码</view>

<wxs module="ttt">
function tt() {
let a = 123
return `answer is ${a} haha`
}
</wxs>
```
处理后的文件
```xml
<wxs module="ddd">
    function f() {
    var a = 123333
    return "answer is " + (a+100) + " haha"
    }
</wxs>

<view>支持在wxml里嵌入的wxs代码</view>

<wxs module="ttt">
function tt() {
var a = 123
return "answer is " + (a) + " haha"
}
</wxs>
```
## 2. 支持 wxs 文件
源文件
```javascript
function foo() {
    const b = `say hihi ${hello}`;let eee = '不换行也可以识别';const rrr = `${b}`
    let a = `1+15 equals to "${1+15}"`;
    return `the return is ${b+a}`
}

module.exports = {
    foo: foo
}
```
处理后的文件
```javascript
function foo() {
    var b = "say hihi " + (hello) + "";var eee = '不换行也可以识别';var rrr = "" + (b) + ""
    var a = "1+15 equals to \"" + (1+15) + "\"";
    return "the return is " + (b+a) + ""
}

module.exports = {
    foo: foo
}
```
