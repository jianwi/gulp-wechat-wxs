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
        .pipe(dest("./"))
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
const a = `可以在\${}中进行一些支持的运算。`;
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
var a = "可以在\${}中进行一些支持的运算。";
</wxs>
```
## 2. 支持 wxs 文件
源文件
```javascript
function bar() {
    const a = `可以在\${}中进行一些支持的运算。${Math.PI * 2} is PI`;
    const b = `转义的字符也会被正确处理\`,Dont worry.`
    const c = `\${} 这个不会被误处理,${ 'c' + '\}'} 这个也不会被误处理`
    let f=1;let d=3;const v=4; // 不换行也可以检测到
    return `the result is ${a} ${b} ${c+f+d+v}`
}

module.exports = {
    foo: foo
}
```
处理后的文件
```javascript
function bar() {
    var a = "可以在\${}中进行一些支持的运算。" + (Math.PI * 2) + " is PI";
    var b = "转义的字符也会被正确处理\`,Dont worry."
    var c = "\${} 这个不会被误处理," + ( 'c' + '\}') + " 这个也不会被误处理"
    var f=1;var d=3;var v=4; // 不换行也可以检测到
    return "the result is " + (a) + " " + (b) + " " + (c+f+d+v) + ""
}

module.exports = {
    foo: foo
}
```

# 暂不支持的用法
> 由于js中的正则表达式不支持平衡组，类似`"${xxx}}} ${123}"`这种的字符串,没法知道应该匹配到哪一个`}`才算完。

不能在 `${}` 中 嵌套对象，比如
```javascript
`${ {a:1} }`
`${JSON.stringify({a:1})}`
// 上面两种写法都是不支持的
// 但是支持转义,下面的写法都会被正确处理
`\${}`
`${'\}'}`
```
