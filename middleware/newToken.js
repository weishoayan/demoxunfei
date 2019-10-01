/**
 * Created by Junhua on 2019/1/23.
 */
const api = require('../api')
const url = 'http://192.168.0.102:3000/';
var fs = require('es6-fs');
var path = require('path');
var API = require('co-wechat-api');

module.exports = async (ctx,next) => {//中间件测试，用来控制API鉴权,hooks等
    //console.log('newToken.js :::::::i have come in the middleware.....................');
    try{
        //console.log('newToken.js :::::::*****************get token using wechatApi************************')
        let wechatApi = new API(api.appId, api.appSecret, async function () {
            // 传入一个获取全局token的方法
            var txt = await fs.readFile('./scratch/access_token.txt', 'utf8');
            //console.log('newToken.js  wechatApi ::::',JSON.parse(txt));
            return JSON.parse(txt);
        }, async function (token) {
            // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
            // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
            await fs.writeFile('./scratch/access_token.txt', JSON.stringify(token));
        });
        var param = {
             debug: false,
             jsApiList: api.jsApiList,
             url: url
        };
        //console.log('newToken.js :::::::*****************jssdk************************')
        let jssdk = await wechatApi.getJsConfig(param);
        //console.log('newToken.js jssdk:::::::',jssdk);
        // 把微信jssdk挂载到ctx.jssdk上
        ctx.jssdk = jssdk;
        await next();
    }catch(e){
        console.log('newToken.js :::::::**********error************')
        console.log(e)
        ctx.response.body = ' 系统错误，请重新刷新页面，不行请联系技术人员';
    }
};