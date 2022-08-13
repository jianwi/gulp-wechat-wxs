const through2 = require('through2');

// 解析 wxml
function parseWxml(content) {
    let pattern = /(<wxs[^>]+>)([\w\W]*?)(<\/wxs>)/g
    let wxsItems = [...content.matchAll(pattern)]
    if (wxsItems.length > 0){
        for (let item of wxsItems){
            let wxsContent = item[2]
            let res = item[1] + jsStyle2wxs(wxsContent) + item[3]
            content = content.replace(item[0], res)
        }
    }else {
        content = jsStyle2wxs(content)
    }
    return content
}

// 解析 wxs
function jsStyle2wxs(content){
    content = content.replace(/(?<=(^|;|\s))(let|const)/g,"var")
    let templatesString = content.match(/`.*?`(?<!\\`)/g)
    if (!templatesString) return content
    for (let str of templatesString){
        let res_str = str.replace(/"/g,'\\"')
        res_str = res_str.replaceAll(/\$\{(.*?)\}(?<!\\})/g,`" + ($1) + "`)
        res_str = `"${res_str.slice(1,res_str.length - 1)}"`
        content = content.replace(str,res_str)
    }
    return content
}

module.exports = function () {
    return through2.obj((file,_,cb)=>{
        file.contents = Buffer.from(parseWxml(file.contents.toString()))
        cb(null, file)
    })
}