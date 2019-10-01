const fs = require('fs')
let ffmpeg = require('ffmpeg')
const CryptoJs = require('crypto-js')

const W3CWebSocket  = require('websocket').w3cwebsocket

let APIkey = '' // 讯飞APIkey

let APISecret = '' // 讯飞APISecret

let AppId = '' // 讯飞APIId

let host = 'ws-api.xfyun.cn'

let date = new Date().toGMTString();

let request_line = 'GET /v2/iat HTTP/1.1'

let signature_orgin = 'host: ' + host + '\n' + 'date: ' + date + '\n' + request_line

let signatrue_sha = CryptoJs.HmacSHA256(signature_orgin,APISecret)

let signature = CryptoJs.enc.Base64.stringify(signatrue_sha)

let authorization_origin = 'api_key="' + APIkey + '", algorithm="hmac-sha256", headers="host date request-line", signature="' + signature + '"'

let authorization = new Buffer.from(authorization_origin).toString('base64')
let ws = `wss://ws-api.xfyun.cn/v2/iat?authorization=${authorization}&date=${date}&host=${host}`
// console.log(ws)

// 这里是转码PCM
async function getPcm(file,audiotype,rate){
    return new Promise((reslove,reject)=>{
        new ffmpeg(file).then( res2 =>{
            // -ar 16000
            res2.setAudioFrequency(16000)
            // //2个频道 -ac 1
            res2.setAudioChannels(1)
            // -y是覆盖
            file =  file.substr(0,file.length - 3);
            res2.addCommand('-y -f s16le')
            res2.save(file+'pcm',async (err,file)=>{
                // console.log(err,file,'这里是转化后的结果')
                //调用讯飞api amr格式音频
                let data =  await getWebSocket(file,audiotype,rate)
                reslove(data)
                fs.unlink(file,()=>{});
    
            })
        })

    }).then(res=>res).catch(err=>err)
}

// 这个是测试pcm，没用
module.exports =async (file) => {
    // console.log(file)

    // 调用转码
    // let data = await getPcm(file,'raw','16000')

    // 直接调用讯飞api amr格式音频
    let data =  await getWebSocket(file,'amr','8000')
    return data
}

//这里才是调用讯飞
async function getWebSocket(file,audiotype,rate){
    let client = new W3CWebSocket(ws);
                console.log(file,audiotype,rate)
    client.onerror = function(e) {
        console.log(e)
        console.log('Connection Error');
        // reject(e)
    };
    
    let voicebeta = fs.readFileSync(file);

    client.onopen = function() {
            // console.log('WebSocket Client Connected');
            let bufferArray = Array.from(new Int8Array(voicebeta))
            let audioData = bufferArray.splice(0, 122 * 8)
            let firstFrame = {  
                "common":{
                "app_id":AppId 
                },
                "business":{
                    "language":"zh_cn",
                    "domain":"iat",
                    // "accent":"cantonese",
                    "aue":audiotype,
                },
                "data":{
                    "format":"audio/L16;rate="+rate,
                    "status":0,   
                    "audio":new Buffer.from(audioData).toString('base64')
                }
            }
            // 第一帧
            client.send(JSON.stringify(firstFrame))
            let handler = setInterval(function () {
                // 最后一帧
                if (bufferArray.length == 0) {
                    client.send(JSON.stringify({
                        "data": {
                            "status": 2,
                        }
                    }))
                    clearInterval(handler)
                    return
                }
                audioData = bufferArray.splice(0, 122 * 8)
                //中间帧
                client.send(JSON.stringify({
                    "data": {
                        "format": "audio/L16;rate="+rate,
                        "status": 0,
                        "encoding": audiotype,
                        "audio": new Buffer.from(audioData).toString('base64')
                    }
                }))
            }, 40)
        
    };

    let data = await new Promise((reslove,reject)=>{

        client.onmessage = function(e) {
            if (typeof e.data === 'string') {

                console.log("Received: '" + e.data + "'");//这里响应数据

                let res = JSON.parse(e.data).data.result.ws

                let str = ''

                res.map(v=>{

                    str += v.cw[0].w

                })

                console.log(audiotype,rate,str)

                if (!!str) {

                    reslove({
                        "err_no": 0,
                        "result": [str]
                      })

                }else{

                    // 这里是str为空，
                    reject({
                        "err_no": 2000, // 这个返回随意，反正不要等于0就是
                      })

                }
                
            }

            client.close() //关闭连接

        };

    }).then(res=>res).catch(err=>err)

    client.onclose = function() {

        console.log('echo-protocol Client Closed');

    };

    return data

}