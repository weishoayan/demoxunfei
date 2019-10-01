// const request = require('request')
// const menu = require('./menu.js')
const fs = require('fs')
const axios = require('axios')
module.exports = (menu)=>{
    let url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=';
    let ass_token = fs.readFile('scratch/access_token.txt','utf-8',(err,data)=>{
        if (err) return 
        console.log(JSON.parse(data).accessToken)
        return JSON.parse(data).accessToken
    })
    axios.post(url+ass_token,JSON.stringify(menu))
        .then((result) => {
            console.log(result.data,'1')
            console.log(result.status,'2')
        }).catch((err) => {
            console.log(err)
            
        });

}