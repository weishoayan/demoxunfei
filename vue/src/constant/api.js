/**
 * Designed by Junhua on 17/2/16.
 */
import axios from '../http'
import Qs from 'qs'
import vm from '../main'

let urls = {

    //登陆
    login:'/api/login',
    logout:'/api/logout',
    queryitemkeys:'/query/queryitemkeys',
    subnokeys:'/sub/nokeys',
    deletenokeys:'/delete/nokeys', // 
    deletekeys:'/delete/keys', // 删除单个关键字
    querykeywords:'/query/keywords', //查询关键字
    subitem:'/sub/item', // 更新事项
    additem:'/add/item', //添加单个事项——地址
    queryitems:'/query/items', // 查询事项
    changepwd:'/api/changepwd', //修改密码
    getsvg: '/api/loginsvg', // 验证码图片
    // postitems:'/api/updateitems', // 添加 事项——地址
    delitems:'api/delitems', // 
    addkeys:'api/addkeys', //添加单个或多个常用语逗号分开
    additems:'api/additem', //导入事项-常用语-地址,
    test:'api/test',
    delupload:'api/deleteupload',
    getmenu:'api/menu',
    setappid:'api/setappid',
    sureappid:'api/sureappid'
}

//包装get
let getMethod = (url,query) => axios.get(url,query)

let postMethod = (url,query) => axios.post(url , query)//包装post


let post = async function(reqUrl,query,selfHandle){

    
    
    let res = null;
    try{//捕捉请求异常并提示错误
        res = await postMethod(urls[reqUrl],query,selfHandle);
    }catch(e){
        console.log(e)
        vm.$message({
            showClose: true,
            message: '远程服务器失联了，请检查您的网络！',
            type: 'error',
            duration:5000
        });
        return null;
    }
    // console.log(res)
    if (res.data.code === 401) {
        vm.$swal({title: "身份认证失效",text: "请重新登录 ！",type:'error',confirmButtonText: '确定',confirmButtonColor:'#409EFF'})
            .then(res =>{
                vm.$store.commit('logout')
                // location.href = '/#/login'
                vm.$router.push({path:'login'});
            }).catch(err=>{
                vm.$store.commit('logout')
                // location.href = '/#/login'
                vm.$router.push({path:'login'});
            })
        return null;
    }else{

        return res
    }
    
};

let get = async function(reqUrl,query,selfHandle){
    
    let res = null;
    try{//捕捉请求异常并提示错误
        res = await getMethod(urls[reqUrl],{params:query});
    }catch(e){
        vm.$swal({title: "错误提示",text:'远程服务器失联了，请检查您的网络！',type:'error',confirmButtonText: '确定',confirmButtonColor:'#409EFF'})
        return null;
    }
    // console.log(res);
    if (res.data.code === 401) {
        vm.$swal({title: "身份认证失效",text: "请重新登录 ！",type:'error',confirmButtonText: '确定',confirmButtonColor:'#409EFF'})
            .then(res =>{
                vm.$store.commit('logout')
                // location.href = '/#/login'
                vm.$router.push({path:'login'});
            }).catch(err=>{
                vm.$store.commit('logout')
                // location.href = '/#/login'
                vm.$router.push({path:'login'});
            })
        return null;
    }else if(res.data.code === 402){
        vm.$swal({title: "服务器失联啦",text: "请联系xxx ！",type:'error',confirmButtonText: '确定',confirmButtonColor:'#409EFF'})
    }else{
        return res
        
    }
    
}


export default {
    get:get,
    post:post,
    url:axios.defaults.baseURL,
}
