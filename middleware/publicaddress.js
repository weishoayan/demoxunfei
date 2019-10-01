// const Koa = require('koa')
// 微信自动回复
const wechat = require('co-wechat')
const {query} = require('./db')
const api = require('../api')
const simplized = require('./text')
// const app = new Koa


module.exports = (app) =>{
    app.use(async (ctx,next) => {
        console.log(ctx.path)
        if (ctx.path === '/wechat') {
            await next()
        }else{
            ctx.body = `Hellow,${ctx.path}`
        }
    })
    
    app.use(wechat({
        token:api.token,
        // appid:api.appSecret
        appid:api.appId
    }).middleware(async (message,ctx) => {
        // console.log(message)
        let { MsgType,Content,MediaId,Recognition} = message
    
        recognition = Recognition && Recognition.replace(/[\。|\，|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"")
        
        if(recognition === '') return '没听清楚'
    
        let res = await query(`select * from b_items where id in (select item_id from b_keys where key_name like '%${simplized(Content) || simplized(recognition)}%') limit 5`)
        
        // if (res.length < 1) {
        //     // 用户说的关键字匹配不到
        //         let data2 = await query(`SELECT * from b_nokeys`)
        //         const url3 = `INSERT INTO b_nokeys(key_name) VALUES('${txt}')`
        //         query(`SELECT * from b_nokeys where key_name like '%${txt}%'`).then(res2=>{
        //             if (res2.length < 1) {
        //                 query(url3)
        //             }
        //         })
            
        // }

        console.log(res,recognition)
    
        if (MsgType === 'text') {
            return text(res,recognition,Content)
        }else if (MsgType === 'voice') {
            return text(res,recognition,Content)
        }else{
            return '目前只支持文本和语音消息'
        }
    }))

}


const text = (res,recognition,Content) => {
    //  用户发送的是文字消息
    let reply = ''
    if (res.length > 0) {
        res.forEach(v => {
            reply += `<a href="${v.item_address}">${v.item_name}</a>\n\n`
        });
        console.log(reply)
        return `您识别的关键字为：'${Content || recognition}'\n\n` + reply
        
    }else{
        return `您识别的关键字为：${(Content || recognition )}`
    }
}


