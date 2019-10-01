const jwt = require('jsonwebtoken')

const KEY = 'verycool'


exports.token = (data) => {
    return jwt.sign(data,KEY,{expiresIn:'1day'})
}


exports.istoken = (data) => {
    return jwt.verify(data,KEY,(err,decoded)=>{
        if (err) {
            return {message:err.message,bool:false}
        }
        //返回 decoded，bool真的验证通过
        return {decoded,bool:true}
    })
}