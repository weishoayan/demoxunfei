/**
 * Created by Junhua on 2019/1/8.
 */
const Router = require('koa-router')
let upRid = new Router()
const {
	getRes
} = require('../res')
const api = require('../api')
var fs = require('fs');
var path = require('path');

const recognize = require('../middleware/xunfei')

var https = require("https"); //https

var crypto = require('crypto'); //加密

var asyncFs = require('es6-fs');
var API = require('co-wechat-api');

//文件是否存在
let fileItExist = (filePath) => new Promise((resolve, reject) => {
	fs.exists(filePath, function(exists, err) {
		if (err) reject(err)
		else resolve(exists);
	});
})

//读取文件内容
let fileRead = (filePath) => new Promise((resolve, reject) => {
	fs.readFile(filePath, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
		if (err) reject(err)
		else resolve(data);
	});
})


//创建文件
let fileWrite = (filePath,w_data) => new Promise((resolve, reject) => {
	fs.writeFile(filePath, w_data, {flag: 'a'}, function (err) {
		if (err) reject(err)
		else resolve(true);
	});
})

//删除文件
let fileDel = (filePath) => new Promise((resolve, reject) => {
	fs.unlink(filePath,function(err){
	    if (err) reject(err)
	    else resolve(true);
		});
})

//Promise One 异步流程一 下载附件
let downMeadia = (access_token, media_id) => new Promise((resolve, reject) => {
	downLoadMedia(access_token, media_id, function(data, err) {
		if (err) reject(err)
		else resolve(data);
	});
})
//Promise Two 异步流程二 判断附件是否存在
let stepTwo = (name) => new Promise((resolve, reject) => {
	fs.exists(name, function(exists, err) {
		if (err) reject(err)
		else resolve(exists);
	});
})

function getTime() {
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds;
}

function debug(msg) {
	console.log("Console\t" + getTime() + "\t" + msg);
}

function sha1(str) {
	var sha1 = crypto.createHash("sha1"); //定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
	sha1.update(str);
	var res = sha1.digest("hex"); //加密后的值d
	return res;
}

function downLoadMedia(access_token, media, callback) {
	var url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=" + access_token + "&media_id=" + media;
	https.get(url, function(res) {
		var datas = "";
		res.setEncoding("binary"); //一定要设置response的编码为binary
		res.on('data', function(data) {
			datas += data;
		});
		res.on("end", function() {
			//var buff = Buffer.concat(datas, size);
			//var result = iconv.decode(buff, "utf8"); //转码
			//var result = buff.toString(); //不需要转编码,直接tostring  
			
			console.log("datas.length="+datas.length);
			callback(datas);
		});
	}).on("error", function(err) {
		debug("Request Error!");
	});
}

function ret(ctx,type) {
		var result = new Object();
		var arr = [];
		arr.push("NULL"+type)
		result.result = arr;
		ctx.response.body = getRes(2, {
			result
		});
}

upRid.post('/', async (ctx) => {

    try {
        let access_token = '';
        // console.log('*****************get token using in wechatApi callback route************************')
        var tokenTxt = await asyncFs.readFile('./scratch/access_token.txt', 'utf8');
        let tokenObj =  JSON.parse(tokenTxt);
        // console.log('*****************tokenObj callback route************************')
        //console.log(tokenObj)
        if(new Date().getTime() > tokenObj.expireTime){ //超时重新获取token
            let wechatApi = new API(api.appId, api.appSecret, async function () {
                // 传入一个获取全局token的方法
                var txt = await asyncFs.readFile('./scratch/access_token.txt', 'utf8');
                console.log('超时重新获取access_token',JSON.parse(txt));
                return JSON.parse(txt);
            }, async function (token) {
                // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
                // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
                await asyncFs.writeFile('./scratch/access_token.txt', JSON.stringify(token));
            });
            console.log('*************acessToken hahahahhaa**************')
            let res = await wechatApi.getAccessToken()
            // console.log(res);
            // console.log(res.accessToken);
            access_token = res.accessToken;
		}else{
            access_token = tokenObj.accessToken;
		}

        let media_id = ctx.request.body.media_id;

        let data = await downMeadia(access_token, media_id);
        
        console.log('data.length',data.length);

            var fileName = sha1(getTime() + Math.random());
            
            let name = "./public/uploads/" + fileName + ".amr";
            fs.writeFileSync(name, data, "binary");
            let exists = await stepTwo(name);
            console.log(exists);
            if (exists) {
                
                //console.log("调用讯飞识别")
                let result = await recognize(name);

                console.log(result,'rid')

                // 删除amr文件

                fs.unlink(name,()=>{});

                // console.log(result)
                ctx.response.body = await getRes(0, {
                    result
                });
            } else if (!exists) {
                //console.log("文件不存在")
                ret(ctx, '微信下载的文件不存在');
            }


    } catch (e) {
        console.log(e);
        ret(ctx, '系统错误，捕捉异常');
        //ctx.response.body = getRes(2, "系统错误");
    }
})


    module.exports = upRid;
