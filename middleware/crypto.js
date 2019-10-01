const crypto = require('crypto')

module.exports = (password,key="haha")=>{
    const hmac = crypto.createHash('sha256',key)
    hmac.update(password)
    const pwdHmac = hmac.digest("hex")
    return pwdHmac
}