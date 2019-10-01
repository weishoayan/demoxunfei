import Vue from 'vue'
import VueRouter from 'vue-router'
import keywords from './pages/keywords/keywords.vue'
import login from './pages/login/login.vue'
import detp from './pages/detp/detp.vue'
import matter from './pages/address/matter.vue'
import wechatmenu from './pages/wechatmenu/wechatmenu.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        meta:{
            requireAuth:true
        },
        // component: detp
    },
   {
        path: '/keywords',
        name: 'keywords',
        meta:{
            requireAuth:true
        },
        component: keywords
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },{
        path:'/detp',
        name:'detp',
        meta:{
            requireAuth:true
        },
        component:detp
    },{
        path:'/matter',
        name:'matter',
        meta:{
            requireAuth:true
        },
        component:matter
    },{
        path:'/wechatmenu',
        name:'wechatmenu',
        meta:{
            requireAuth:true
        },
        component:wechatmenu
    }
    // ,{
    //     path:'/test',
    //     name:'test',
    //     meta:{
    //         requireAuth:true
    //     },
    //     component:test
    // }
];

const router = new VueRouter({
    routes
});
router.beforeEach((to, from, next) => {
    /* var show=0;
    console.log(routes,to,from);
    
    for (var i=0;i<routes.length;i++)
    {
        if(to.name==routes[i].name){
            show=1;
            break;
        }
    }
    if(show==0){
        if(from.name=='login'){
            location.reload();
        }else{
            next({ path: '/login'})
        }
    } */

    // console.log('**********change route**********');
    //  console.log(to,from);
    //  console.log(to.meta.requireAuth);
    if (to.meta.requireAuth) {
       if (localStorage.token) {//有token才检查
             next();
             
            }else {//没有跳转登录
                next({ path: '/login'})
            }
            next();
        }
        else { 
        next();
    }
})

export default router;