/**
 * Created by Junhua on 2019/1/8.
 */
const Router = require('koa-router')
const { query } = require('../middleware/db')
const multer = require('koa-multer');
// const createMenu = require('../middleware/weChat')
const crypto = require('../middleware/crypto')
const {token,istoken} = require('../middleware/usertoken')
const svgCaptcha = require('svg-captcha')
let svgtext

const fs = require('fs')
const xlsx = require('node-xlsx')

let storage = multer.diskStorage({
    destination(req, file, cb) {//文件保存路径 检验token是否合法
        console.log(req,'**************')
        let token = req.body.token
        console.log('*****************destination************************')
        console.log(token)
        // jwt.verify(token, 'secret', function(err, decoded) {
        //     if(err) cb(err)
        //     else cb(null, 'public/uploads/')
        // });
        if (istoken(token).bool) {
            cb(null,'public/uploads/')
        }else{
            cb(message)
        }
    },
    filename(req, file, cb) {//修改文件名称
        let fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

const upload  = multer({storage});
let index = new Router()
const {simplized} = require('../middleware/text')

index.get('/', async(ctx) => {

	//console.log('*****************ctx.jssdk='+ctx.jssdk)
    await ctx.render('index', {
        jssdk:ctx.jssdk
    });
})


index.post('/',async (ctx) =>{
    let txt = ctx.request.body.text.replace(/[\。|\，|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
    
    // console.log(txt);
    // 繁体转简体
    txt = simplized(txt)
    console.log('发送语音：',txt);
    // let str = '入户';
    const url = `select * from b_items where id in (select item_id from b_keys where key_name like '%${txt}%')`;
    let data = await query(url).then(res=>res).catch(err=>{
        ctx.body = {item_name:'没有数据库',item_address:'https://www.baidu.com'}
        return err
    })
    console.log(data,'初步查询完成');
    // if (data.Error) {
        
    // }
    // 表里面是空的
    if (data.length < 1) {
        // 用户说的关键字匹配不到
        try { // 有数据表了，第二次
            let data2 = await query(`SELECT * from b_nokeys`)
            const url3 = `INSERT INTO b_nokeys(key_name) VALUES('${txt}')`
            query(`SELECT * from b_nokeys where key_name like '%${txt}%'`).then(res=>{
                if (res.length < 1) {
                    query(url3)
                }
            })
        } catch (error) {
            // 第一次，创建数据表并写入数据
            console.log(error)
            query(`create table b_nokeys(id INT(3) PRIMARY KEY AUTO_INCREMENT,item_id INT(3) NULL,key_name VARCHAR(30) NOT NULL)`)
                .then(async (res)=>{
                    console.log(res);
                    
                    let data2 = await query(`SELECT * from b_nokeys`).then(res=>res).catch(err=>err)
                    const url3 = `INSERT INTO b_nokeys(key_name) VALUES('${txt}')`
                    if (data2 < 1) {
                        //b_nokeys没有数据之际写入数据
                        query(url3)
                    }else{
                        //第二次写入数据
                        query(`SELECT * from b_nokeys where key_name like '%${txt}%'`).then(res=>{
                            if (res.length < 1) {
                                query(url3)
                            }
                        }).catch(err=>err)
                    }
                })
            
        }
        
    }
    // ctx.body = [{item_name:'没有数据库',item_address:'https://www.baidu.com'}]
    ctx.body = data
})










// 获取验证码
index.get('api/loginsvg',async ctx =>{
    const captcha = svgCaptcha.create({
        size: 4,
        inverse: true,
        fontSize: 40,
        noise: 2,
        width: 80,
        height: 40,
        color: true,
        background:'#dddddd'
    })
    // console.log(captcha.text)
    svgtext = captcha.text
    ctx.response.type = 'image/scg+xml'
    ctx.body = {
        code: 0,
        data:captcha.data
    }
})
// 登录
index.post('api/login',async ctx =>{
    console.log('api/login')
    const {username:user,pwd:password,svgtxt} = ctx.request.body
    // console.log(svgtext,svgtxt)
    // query(`CREATE TABLE b_admin (id INT(2) PRIMARY KEY AUTO_INCREMENT,user VARCHAR(15) NOT NULL,password VARCHAR(15) NOT NULL)`)
    if (svgtxt.toLocaleLowerCase() === svgtext.toLocaleLowerCase()) {
        let url = `select * from b_admin where user='${user}'`
        await query(url).then(res=>{
            if (res.length < 1) return ctx.body = {
                code: 201,//没有这个账户 
            }
            if (res[0].user === user) {
                if (res[0].password === crypto(password)) {
                    // console.log('密码正确');
                    const utoken = token({name:user,admin:true})
                    ctx.body = {
                        code: 200,//401 token失效 0其他错误 200成功,
                        status:200,
                        data:{
                            token:utoken,//token
                            user
                        }
                    }
                }else{//密码不正确
                    ctx.body = {
                        code: 202,//密码错误
                        status:400,
                    }
                }
            }
        }).catch(err=>{
            // console.log(err);
            ctx.body = {
                code:0
            }
        })
    }else{
        ctx.body = {
            code: 402
        }
    }

})

// 注册
{

    /* index.post('reg',async (ctx) =>{
        console.log('reg')
        const {user,password} = ctx.request.body
        // console.log(user,password);
        try { //有这个表就插入
            await query(`select * from b_admin where user='${user}'`).then(async res=>{
                // console.log(res,res.length,res.length>1,'aaaaaa');
                // code1 用户存在
                if(res.length !== 0) return ctx.body = {status:200,code:1}
                console.log('没有这个用户名');
                let adduser = `INSERT INTO b_admin(user,password) VALUE(?,?)`
                await query(adduser,[user,crypto(password)]).then(res=>{
                    // console.log('插入成功');
                    ctx.body = {
                        status:200,
                        code:200
                    }
                })
            })
    
        } catch (error) {//没有就新建
            console.log(error);
            await query(`CREATE TABLE b_admin (id INT(2) PRIMARY KEY AUTO_INCREMENT,user VARCHAR(15) NOT NULL,password VARCHAR(90) NOT NULL)`)
                .then(async res=>{
                    let adduser = `INSERT INTO b_admin(user,password) VALUE(?,?)`
                    await query(adduser,[user,crypto(password)]).then(res=>{
                        console.log('插入成功');
                        ctx.body = {
                            status:200,
                            code:200
                        }
                    })
                })
        }
    }) */
}

// 查询关键字
index.get('query/keywords',async (ctx) =>{
    console.log('query/keywords')
    const urltoken = ctx.query.token

    if (istoken(urltoken).bool) {
        await query(`select * from b_keys`).then(res=>{
            // console.log(res);
            ctx.body = {
                data:res
            }
        }).catch(err=>{

        })
    }else{
        ctx.body = {
            code: 401 //token失效
        }
    }

})
// 查询事项列表
index.get('query/items',async (ctx) =>{
    console.log('query/items')
    const urltoken = ctx.query.token
    if (istoken(urltoken).bool) {
        // console.log('token没失效');
        try {
            let data = await query(`select * from b_items order By id desc`)
            ctx.body = {
                data,
            }
        } catch (error) {
            // len = 0
            // 没有这个数据库
            ctx.body = {
                code:402
            }
        }
    }else{
        ctx.body = {
            code: 401 //token失效
        }
    }
})
// 
// 查询
index.get('query/queryitemkeys',async (ctx) =>{
    console.log('query')
    const urltoken = ctx.query.token
    //验证token
    if (istoken(urltoken).bool) {
        let url = `select * from b_nokeys`
        try {
            let data = await query(url)
            let data2 = await query(`select * from b_items`)
            // console.log(data)
            ctx.body = {
                data,
                data2
            }
        } catch (error) {
            // 没有这个数据库
            ctx.body = {
                code:402
            }
        }
        // 这里处理已经配好了的关键字
        // let arr = data.filter((v,i) =>{
        //     if (v.item_id === null) {
        //         return v
        //     }
        // })
    }else{
        ctx.body = {
            code: 401 //token失效
        }
    }
})

index.post('sub/nokeys',async (ctx)=>{
    const data = ctx.request.body
    console.log(data)
    await query(`update b_nokeys set item_id='${data.item_id}' where id = ${data.id}`)
        .then(async res =>{
            await query(`insert into b_keys(item_id,key_name) values('${data.item_id}','${data.key_name}')`)
                .then(res =>{
                    console.log(res,1)
                    ctx.body = 0
                })
        }).catch(err =>{
            console.log(err,2)
            ctx.body = 1
        })
})

// 已匹配常用语删除单个常用语
index.post('delete/keys',async ctx =>{
    console.log('delete/keys')
    const data = ctx.request.body
    // 删除b_keys里面的关键id
    if (istoken(data.token).bool) {
        await query(`delete from b_keys where id=${data.id};`)
            .then(res=>{
                query(`delete from b_nokeys where key_name like '${data.key_name}';`)
                // console.log(res) 
                ctx.body = {
                    code:0
                }
            }).catch(err=>{
                // console.log(err);
                ctx.body = {
                    code:1
                }
            })
    }else{
        ctx.body = {
            code: 401 //token失效
        }
    }
})

// 添加事项
index.post('add/item',async ctx=>{
    console.log('add/item')
    const {item_name,item_address,token} = ctx.request.body
    // console.log(item_name,item_address,token,'/add/item')
    if (istoken(token).bool) {
        await query(`insert into b_items(item_name,item_address) values('${item_name}','${item_address}')`)
            .then(res =>{
                // console.log(res)
                console.log(01)
                ctx.body = {
                    code:0
                }
            }).catch(err=>{
                console.log(02)
                ctx.body = {
                    code:1
                }
            })
    }else{
        console.log(1)
        ctx.body = {
            code:401
        }
    }
})

// 修改事项
index.post('sub/item',async ctx =>{
    console.log('sub/item')
    const {item_name,item_address,id} = ctx.request.body.data
    await query(`update b_items set item_address='${item_address}',item_name='${item_name}' where id = ${id}`)
        .then( res =>{
            ctx.body = {
                code:0
            }
        }).catch(err =>{
            ctx.body = {
                code:1
            }
        })
})

// 待匹配常用语路由
index.post('delete/nokeys',async ctx =>{
    console.log('delete/nokeys')
    const data = ctx.request.body
    // console.log(data)
    // 删除b_keys里面的关键id
    // delete from b_keys where id=${data.id}
    if (istoken(data.token).bool) {
        await query(`delete from b_nokeys where id=${data.id};`)
            .then(res=>{
                query(`delete from b_keys where key_name like '${data.key_name}';`)
                // console.log(res) 
                ctx.body = {
                    code:0
                }
            }).catch(err=>{
                // console.log(err);
                ctx.body = {
                    code:1
                }
            })
    }else{
        ctx.body = {
            code: 401 //token失效
        }
    }
})
// 修改密码
index.post('api/changepwd',async ctx =>{
    console.log(ctx.request.body)
    const {user,pwd,pwd2,token} = ctx.request.body
    if (istoken(token).bool) {
        const res = await query(`select * from b_admin where user='${user}';`)
        if (res[0].password === crypto(pwd)) {
            console.log('密码正确')
            await query(`update b_admin set password='${crypto(pwd2)}' where id='${res[0].id}'`)
                .then(res=>{
                    ctx.body = {
                        code:0
                    }
                })
        }else{
            ctx.body = {
                code:1 // 初始密码错误
            }
        }
    }else{
        ctx.body = {
            code:401
        }
    }
})


{
    // 导入excel表 // 先清除数据库，在插入数据库

    /* index.post('api/updateitems',async ctx =>{
        const {data,token} = ctx.request.body
        // console.log(data)
        if (istoken(token).bool) {
            // 先清空数据
            await query(`DELETE FROM b_items`)

            let data2 = JSON.parse(data)
            let len = data2.length

            let str = 'INSERT INTO b_items(id,item_name,item_address) VALUES'

            data2.forEach((v,i) => {
                // v.id v.item_name v.item_address
                
                if (i == len-1) {
                    str += `('${v.id}','${v.item_name}','${v.item_address}');`
                }else{
                    str += `('${v.id}','${v.item_name}','${v.item_address}'),`
                }
            });
            // 添加数据
            await query(str).then(res=>{
                ctx.body = {
                    code:0
                }
            }).catch(err=>{
                ctx.body = {
                    code:1
                }
            })
            
        }else{
            ctx.body = {
                code:401
            }
        }
    })  */
}
// 清空事项数据库
// query(`DELETE FROM b_items`)



index.post('api/uploadxls',async (ctx,next) => {
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path); // 创建可读流
    // const ext = file.name.split(".").pop(); // 获取上传文件扩展名
    const upStream = fs.createWriteStream(
    //   `public/uploads/${new Date().getTime()}.${ext}`
      `public/uploads/${file.name}`
    ); // 创建可写流
    reader.pipe(upStream); // 可读流通过管道写入可写流
    ctx.body = {
        code:0,
        msg:'OK',
    }
})

const menu = require('../public/data/menu.json')
// createMenu(menu)
index.get('api/menu',ctx =>{
    // console.log(menu)
    ctx.body = {
        code:0,
        data:menu
    }
})

// 修改appid和appsecret
index.post('api/setappid',async ctx => {
    // console.log(ctx.request.body)
    const {dataId,token} = ctx.request.body;
    if (istoken(token).bool) {
        
        let setdata = menu.forEach(v=>{
            if (v.id == JSON.parse(dataId).id) {
                v.title = JSON.parse(dataId).title
                v.appid = JSON.parse(dataId).appid
                v.appsecret = JSON.parse(dataId).appsecret
                v.isUse = JSON.parse(dataId).isUse
            }else{
                v.isUse = false
            }
        })
        fs.writeFile('public/data/menu.json',JSON.stringify(menu),(err,data)=>{
            if (err) return console.log(err,1)
            console.log(data,2)
        })
        ctx.body = {
            code:0,
            msg:'OK'
        }
    }else{
        ctx.body = {
            code:401
        }
    }
})

//这个没用到
index.post('api/sureappid',async ctx => {
    const {dataId,token} = ctx.request.body;
    // console.log(dataId)
    if (istoken(token).bool) {
        fs.writeFile('public/data/menu.json',dataId,(err,data)=>{
            if (err) return console.log(err,1)
            console.log(data,2)
        })
        ctx.body = {
            code:0,
            msg:'OK'
        }
    }else{
        ctx.body = {
            code:401
        }
    }
})


// 删除上传的文件
index.post('api/deleteupload',ctx => {
    let {filename,token} = ctx.request.body;
    if (istoken(token).bool) {
        fs.unlink('public/uploads/'+filename,(err,data)=>{
            console.log(err,data)
        })
        ctx.body = {
            code:0,
            msg:'上传文件删除成功'
        }

    }else{
        ctx.body = {
            code:401
        }
    }
})

/* index.post('api/test',ctx =>{
    let data = xlsx.parse('public/uploads/11.xls').filter(v => {if(v.data.length !== 0) return v}).data
    ctx.body = {
        data,
        code:0
    }
    
}) */
// 事项管理   ----    导入 事项——事项常用语——事项地址


index.post('api/additem',async ctx =>{
    const {filename,token} = ctx.request.body
    let datakeys = [];
    let xlsArr = xlsx.parse('public/uploads/'+filename).filter((v,i) => {
        if(v.data.length !== 0){
            v.data.forEach((val,index)=>{
                if (index!==0) {
                    datakeys.push({
                        "新增事项内容":val[0],
                        "新增日常用语":val[1].split(/,|，/),
                        "新增事项地址":val[2]
                    })
                }
            })
        } 
    })
    if (istoken(token).bool) {
        await query(`select id,item_name from b_items`)
            .then(async res =>{
                let datalen = datakeys.length // 前端发送过来的excel字符串json
                let reslen = res.length
                let obj= [];
                // 检测有没有重复项
                for (let j = 0; j < datalen; j++) {
                    let flag = true
                    for (let i = 0; i < reslen; i++) {
                        if (datakeys[j]['新增事项内容'] == res[i].item_name) {
                            flag = false
                            break
                        }
                    }
                    if (flag) {
                        obj.push(datakeys[j])
                    }
                }
                if(obj.length == 0) return ctx.body = {
                    code:233 // 数据库内容与excel一致
                }
                let resLen3 = 1;
                if (res.length != 0) {
                    // 如果有数据，那就选最后一条的id+1
                    resLen3 = res[res.length - 1].id+1
                }
                let objLen = obj.length
                let str = 'INSERT INTO b_items(id,item_name,item_address) VALUES'
                let str2 = 'INSERT INTO b_keys(item_id,key_name) VALUES'
                obj.forEach((v,i) => {
                    if (i == objLen-1) {
                        str += `('${resLen3}','${v['新增事项内容']}','${v['新增事项地址']}');`
                        for (let j = 0; j < v['新增日常用语'].length; j++) {
                            if (j == v['新增日常用语'].length - 1) {
                                str2 += `('${resLen3}','${v['新增日常用语'][j]}');`
                            }else{
                                str2 += `('${resLen3}','${v['新增日常用语'][j]}'),`
                            }
                    }
                        resLen3++
                    }else{
                        str += `('${resLen3}','${v['新增事项内容']}','${v['新增事项地址']}'),`
                        for (let j = 0; j < v['新增日常用语'].length; j++) {
                                str2 += `('${resLen3}','${v['新增日常用语'][j]}'),`
                        }
                        resLen3++
                    }
                });
                
                // console.log(str,222333)
                await query(str).then(async res=>{
                    await query(str2).then(res=>{
                        ctx.body = {
                            code:0
                        }
                    }).catch(err=>{
                        console.log(err)
                        ctx.body = {
                            code:1
                        }
                    })
                })
            })
            .catch(err=>{
                console.log(err)
                ctx.body = {
                    code:1
                }
            })
    }else{
        ctx.body = {
            code:401
        }
    }
})


// 添加事项  事项——地址
{

    /* index.post('api/updateitems',async ctx =>{
        const {data,token} = ctx.request.body
        console.log(JSON.parse(data))
        if (istoken(token).bool) {
            // 先清空数据
            // await query(`DELETE FROM b_items`)
            let res = await query(`select id,item_name from b_items`)
            .then(async res=>{
                let data2 = JSON.parse(data)
    
                let data2Len = data2.length // 前端发送过来的excel字符串json
    
                let reslen = res.length
                
                let obj =[];
                for (let j = 0; j < data2Len; j++) {
                    let flag = true
                    for (let i = 0; i < reslen; i++) {
                        if (data2[j]['事项名称'] == res[i].item_name) {
                            flag = false
                            break
                        }
                    }
                    if (flag) {
                        obj.push(data2[j])
                    }
                }
                let resLen3 = 1;
                if (res.length != 0) {
                    // 如果有数据，那就选最后一条的id+1
                    resLen3 = res[res.length - 1].id+1
                }
                let objLen = obj.length
                let str = 'INSERT INTO b_items(id,item_name,item_address) VALUES'
                obj.forEach((v,i) => {
                    
                    if (i == objLen-1) {
                        str += `('${resLen3++}','${v['事项名称']}','${v['事项地址']}');`
                    }else{
                        str += `('${resLen3++}','${v['事项名称']}','${v['事项地址']}'),`
                    }
                });
                console.log(str)
                // 添加数据
                if(obj.length == 0) return ctx.body = {
                    code:233 // 数据库内容与excel一致
                }
                await query(str).then(res=>{
                    ctx.body = {
                        code:0
                    }
                }).catch(err=>{
                    console.log(err)
                    ctx.body = {
                        code:1
                    }
                })
            }).catch(err=>{
                console.log(err)
                ctx.body = {
                    code:1
                }
            })
            
            
        }else{
            ctx.body = {
                code:401
            }
        }
    }) */
}

// 删除事项
index.post('api/delitems',async ctx =>{
    const {dataId,token} = ctx.request.body;
    if (istoken(token).bool) {
        let num = '';
        let len = dataId.length - 1
        dataId.forEach((v,i)=>{
            if (i == len) {
                num += v
            }else{
                num += v+','
            }
        })
        await query(`DELETE FROM b_items where id in(${num})`)
            .then(async res =>{
                console.log(res,'delete items')
                //删除 事项常用语
                    await query(`delete from b_keys where item_id in(${num})`).then(res2=>{
                        console.log(res2,'delete b_keys')
                        ctx.body = {
                            code:0
                        }
                }).catch(err=>{
                    console.log(err)
                    ctx.body = {
                        code:1
                    }
                })
            }).catch(err=>{
                console.log(err)
                ctx.body = {
                    code:1
                }
            })
    }else{
        ctx.body = {
            code:401
        }
    }
})
//#keywords  单个添加常用语
index.post('api/addkeys',async ctx =>{
    const {keyData,keysArr,token} = ctx.request.body;
    console.log(keyData,keysArr)
    if (istoken(token).bool) {
        let str = 'insert into b_keys(item_id,key_name) values'
        if (keysArr.length > 1) {
            for (let i = 0; i < keysArr.length; i++) {
                if (i == keysArr.length - 1) {
                    str += `('${keyData.item_id}','${keysArr[i]}');`
                }else{

                    str += `('${keyData.item_id}','${keysArr[i]}'),`
                }
            }
        }else{
            str += `('${keyData.item_id}','${keysArr[0]}');`
        }
        console.log(str)
        await query(str)
            .then(res=>{
                console.log(res,1)
                ctx.body = {
                    code:0
                }
            }).catch(err=>{
                console.log(err,2)
                ctx.body = {
                    code:1
                }
            })
    }else{
        ctx.body = {
            code:401
        }
    }
})









module.exports = index;