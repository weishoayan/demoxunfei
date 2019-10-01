<template>
    <div id="sidebar-wrapper">


        <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="sideBarHandleOpen"
                @close="sideBarHandleClose"
                active-text-color="#3187e0"
                :default-active="activeMenu">

            <el-menu-item index="1"  @click="$router.push({path:'/detp'})">
                <i class="fa fa-search icon" aria-hidden="true"></i>&nbsp;
                <span slot="title"><span class="title-tip">待匹配常用语</span><i class="border"></i></span>
            </el-menu-item>
            <el-menu-item index="2"  @click="$router.push({path:'/keywords'})">
                <i class="fa fa-tasks icon" aria-hidden="true"></i>&nbsp;
                <span slot="title"><span class="title-tip">已匹配常用语</span><i class="border"></i></span>
            </el-menu-item>
            <el-menu-item index="3"  @click="$router.push({path:'/matter'})">
                <i class="fa fa-gears icon" aria-hidden="true"></i>&nbsp;
                <span slot="title"><span class="title-tip">事项管理</span><i class="border"></i></span>
            </el-menu-item>
            <el-menu-item index="4"  @click="$router.push({path:'/wechatmenu'})">
                <i class="fa fa-gears icon" aria-hidden="true"></i>&nbsp;
                <span slot="title"><span class="title-tip">菜单管理</span><i class="border"></i></span>
            </el-menu-item>
            <!-- <el-submenu index="4" disabled>
                <template slot="title">
                    <i class="fa fa-gears icon" aria-hidden="true"></i>&nbsp;
                    <span>系统管理</span>
                </template>

                <el-menu-item  class="el-menu-item-two" index="6-1" @click="$router.push({path:'/user'})"><span>用户管理</span><i class="border"></i></el-menu-item>
                <el-menu-item class="el-menu-item-two" index="6-2" @click="$router.push({path:'/role'})"><span>角色管理</span><i class="border"></i></el-menu-item>

            </el-submenu> -->
        </el-menu>

        <div class="sidebar-footer" style="display: none;">
            <div class="col-xs-12">
                <a href="#"  target="_blank">
                </a>
            </div>
        </div>
    </div>
</template>

<script type="application/ecmascript">
    export default {
        name: 'siderbar',//侧边栏
        data () {
            return {
                activeMenu:'1',
            }
        },
        computed:{
            
        },

        watch: {
        
        },
        mounted(){
            this.watchUrl();
        },
        methods:{
            toggleSidebar(){
                this.$emit('toggleSidebar');//将点击事件传到父组件
            },
            sideBarHandleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            sideBarHandleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            watchUrl() {
                this.url = this.$route.path;
                let urlArr = this.url.split("/");

                switch (urlArr[1]) {
                    case 'detp': {
                        this.activeMenu = "1";
                        break;
                    }
                    case 'keywords': {
                        this.activeMenu = "2";
                        break;
                    }
                    case 'matter': {
                        this.activeMenu = "3";
                        break;
                    }
                    case 'wechatmenu': {
                        this.activeMenu = "4";
                        break;
                    }
                    // case 'role': {
                    //     this.activeMenu = "4-2";
                    //     break;
                    // }
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss' rel="stylesheet/scss" type="text/css">
    #sidebar-wrapper{
        margin-left: 0;
        background-color: #fff;
        /*position: fixed;*/
        /*margin-top: 58px;*/
    }
    #sidebar-wrapper .el-menu{
        border-right:0px !important;
    }
    .active{
        color: #fff;
        border-left: 3px solid #2c93f4;
        background-color: rgba(121, 121, 121, 1);
    }
    .nav{
        width: 100%;
        background-color: #5E5E5E;
        float: left;
        padding-top: 8px;
    }
    .nav li{
        width: 100%;
        height: 43px;
        margin-top: 15px;


    }
    .nav li a{
        text-align: left !important;
        padding-left: 25px;
        display: block;
        width: 100%;
        height: 43px;
        font-size: 15px;
        color: #FFFFFF;
        line-height: 43px;
        text-decoration: none;
        cursor: pointer;
    }
    .nav li a i{
        width:35px;
    }

    #sidebar-wrapper .icon {
        margin-right: 5px;
        width: 24px;
        text-align: center;
        font-size: 14px;
        vertical-align: middle;
    }
    #sidebar-wrapper .el-menu-item.is-active {
        background: #f4fcff !important;
    }
    #sidebar-wrapper .el-menu-item-two{
        padding-left: 56px !important;
    }
    #sidebar-wrapper .el-menu-item.is-active .border {
        display: inline !important;
    }
    #sidebar-wrapper .el-menu-item .border {
        width: 4px;
        height: 56px;
        background-color: #2c93f4;
        position: absolute;
        right: 0px;
        display: none;
    }
    #sidebar-wrapper .el-menu-item-two .border {
        width: 4px;
        height: 50px;
        background-color: #2c93f4;
        position: absolute;
        right: 0px;
        display: none;
    }
    .title-tip{
        // background-color: rgb(37, 85, 214);
        // border: 10px solid rgb(37, 85, 214);
    }


</style>
