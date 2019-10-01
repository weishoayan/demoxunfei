/**
 * Created by Junhua on 2019/1/8.
 */
let axios = require('axios')
let Qs = require('qs')

// axios 配置
axios.defaults.timeout = 50000;

axios.defaults.transformRequest = [function (data) {
    data = Qs.stringify(data);
    return data;
}];

// let [appId,appSecret] = ['wxc336fc3fd6790d66','e11bf62c9da184d1f826ddd2a6d0e5cb'];//junhua
// let [appId,appSecret,token] = ['wx5b6f80814a40b077','23794f409b100643f3d61ecf92c9bbf6','newtopgdToken'];//yixiong
//这里是获取用户自定义设置的json appId,appSecret
let appid,appsecret;
let appidappse = require('./public/data/menu.json')
appidappse.forEach(v=>{
    if (v.isUse) {
        appid = v.appid
        appsecret = v.appsecret
    }
})

let [appId,appSecret,token] = [appid,appsecret,'newtopgdToken'];

let jsApiList = ['startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','translateVoice','getLocation','openLocation']

let getNewToken = axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);


let saveNewToken = (token) => axios.post('http://token.allvery.com/bg_token',{token,createTime:new Date().getTime()});

let getTicket = (token) => axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`);

let getWxFile = (access_token,media_id) => axios.get(`https://api.weixin.qq.com/cgi-bin/media/get?access_token=${access_token}&media_id=${media_id}`);

let getWxNewFile = (access_token,media_id) => axios.get(`https://api.weixin.qq.com/cgi-bin/media/get/jssdk?access_token=${access_token}&media_id=${media_id}`);


let api = {appId,jsApiList,getNewToken,saveNewToken,getTicket,getWxFile,getWxNewFile,appSecret,token};

module.exports = api;