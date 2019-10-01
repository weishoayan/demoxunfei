import Vue from 'vue'
import router from './router'
import App from './App.vue'
import filter from './filter'
import api from './constant/api'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueSweetAlert from 'vue-sweetalert'

Vue.use(ElementUI);
Vue.use(VueSweetAlert)


let getImage = path => require('./assets/image/' + path);//获取图片路径ES6写法


Array.prototype.getIds = function (){//获取id数组
    let res = [];
    for (let i = 0; i < this.length; i++) {
        let obj = this[i];
        res.push(obj.id);
    }
    return res;
}

Vue.prototype.confirmBox = async (msg,cb) =>{//确定提示框
    try{
        await Vue.prototype.$confirm(msg,'提示',{confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'});
        cb();
    }catch (e){
        //console.log(e);
    }
}

Vue.prototype.getImage = getImage;//绑定到原型链中,固定路径加载静态图片
Vue.prototype.api = api;

for(let p in filter){//遍历对象属性，加载所有方法到filter
    Vue.filter( p ,filter[p]);
}

let vm = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app');
export default vm//导出这个实


Vue.prototype.downtableToExcel = function(){
    //要导出的json数据
    const jsonData = [
        {
        item_name:'新增事项内容',
        keys_name:'新增日常用语1,新增日常用语2，新增日常用语3，新增日常用语4',
        item_address:'https://www.baidu.com'
        },
        {
        item_name:'新增事项内容',
        keys_name:'新增日常用语1,新增日常用语2，新增日常用语3，新增日常用语4',
        item_address:'https://www.baidu.com'
        },
        {
        item_name:'新增事项内容',
        keys_name:'新增日常用语1,新增日常用语2，新增日常用语3，新增日常用语4',
        item_address:'https://www.baidu.com'
        },
        {
        item_name:'新增事项内容',
        keys_name:'新增日常用语1,新增日常用语2，新增日常用语3，新增日常用语4',
        item_address:'https://www.baidu.com'
        },
    ]
    //列标题
    let str = '<tr><td>新增事项内容</td><td>新增日常用语</td><td>新增事项地址</td></tr>';
    //循环遍历，每行加入tr标签，每个单元格加td标签
    for(let i = 0 ; i < jsonData.length ; i++ ){
        str+='<tr>';
        for(let item in jsonData[i]){
            //增加\t为了不让表格显示科学计数法或者其他格式
            str+=`<td>${ jsonData[i][item] + '\t'}</td>`;     
        }
        str+='</tr>';
    }
    //Worksheet名
    let worksheet = 'Sheet1'
    let uri = 'data:application/vnd.ms-excel;base64,';

    //下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
    //下载模板
    window.location.href = uri + this.base64(template)
}
    //输出base64编码
Vue.prototype.base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
