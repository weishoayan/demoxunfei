//代码与中文对应关系
const codeObj = {
    0:'请求成功',
    1:'账号或密码错误',
    2:'sql错误',
    400:'token失效'
}

let getRes = function(code,data) {
    return {
        code,
        msg:codeObj[code],
        data
    }
}

module.exports = { getRes }