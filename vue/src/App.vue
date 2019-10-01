<template>
    <div id="app">
        <!--非登录视图-->
        <div v-if="isLogin"  :class="SidebarStatus ? 'open' : ''" >
        <!-- <div v-if="!isLogin"> -->

            <el-container>
                <el-header style="height: 59px;padding: 0px;">
                    <!--头部组件-->
                    <headbar></headbar>
                </el-header>
                <el-container>
                    <siderbar @toggleSidebar="toggleSidebar"></siderbar>
                    <el-main style="margin-left:235px;padding:17px 15px 0 0">
                    <!-- <el-main> -->
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>

        </div>

        <!--否则只需要登录界面-->
        <router-view v-else></router-view>
    </div>
</template>

<script>
    import siderbar from './components/sideBar.vue';
    import headbar from './components/headBar.vue';
    import filter from './filter'
    export default {
        name: 'app',
        data () {
            return {
                SidebarStatus:true
            }
        },
        computed:{
            isLogin:function(){
                return this.$store.getters.getIslogin
            }
        },
        mounted () {
            // console.log(this.$store.state.isLogin);
            // if (localStorage.name !== null) {
                this.$store.commit('login', {name:localStorage.name,token:localStorage.token});
            // }
        },
        components:{//引用组件
            headbar,
            siderbar
        },
        methods: {
            toggleSidebar(){
                this.SidebarStatus = !this.SidebarStatus
            }
        }
    }
</script>


<style lang="scss">
    @import "./assets/css/bootstrap/css/bootstrap.css" ;
    @import "./assets/rdash-ui/dist/css/rdash.css" ;
    @import "./assets/font-awesome/css/font-awesome.css";
    html{
        overflow-y: visible;
    }
    body{
        margin: 0;
        overflow-y: hidden;
    }
    /* vue-sweetalert 层级调比element-ui弹框高*/
    .swal2-container{
        z-index: 3000 !important;
    }
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: rgba(0,0,0,0.1);
    }
    .clear{
        clear: both;
    }
    //登录页el-input
    .form-input .el-input__inner{
        height: 43px !important;
        line-height: 43px !important;
    }
    //登录页el-formAdd-item
    .form-input .el-form-item{
        margin-bottom: 17px !important;
    }
    //登录页 登录按钮
    .form-input .el-button {
        width: 100%;
        margin-top: 20px;
        height: 43px !important;
    }
    //登录页 图标宽度 大小
    .form-input .el-input__prefix{
        width: 22px;
        font-size: 16px;
    }
    //element-ui 上传input隐藏
    .el-upload__input{
        display: none !important;
    }
    //show-que
    .show-que .el-collapse-item__content{
        padding-bottom: 0px !important;
    }
    //element-ui el-tabs--left 居左
    .input-que .el-tabs--left .el-tabs__item.is-left{
        text-align: left !important;
    }
    //element-ui el-table
    .main .el-table::before{
        background-color:transparent !important;
    }
    //选人组件样式
    .left .el-checkbox{
        margin-left: 0px !important;
        width: 100%;
    }
    .tree .el-dialog__body{
        padding: 0px 20px 20px 20px;
    }
    //表单添加
    .formAdd .el-form-item__content{
        line-height: 47px !important;
    }

    .temp .right .el-form-item__label{
        line-height: 25px;
    }

    .temp .right .el-input__inner{
        height: 35px;
    }
    .temp .right .el-form-item{
        margin-bottom: 10px;
    }
    .temp .right .el-form-item__label{
        padding-bottom: 0!important;
    }
    .temp .right .el-form--label-top .el-form-item__label{
        margin-left: 8px;
    }

    .temp .middle .el-radio+.el-radio {
        margin-left: 0;
    }
    .temp  .middle .el-radio__label{
        margin-right: 10px;
    }

    .temp .el-icon-date{
        display: none !important;
    }

    .myapprhead .el-icon-arrow-left:before{
        content: '' !important;
    }
    .el-checkbox+.el-checkbox{
        margin-left: 0!important;
    }
    .middle .el-checkbox__label, .right .el-checkbox__label{
        margin-right: 10px;
    }
    .middle .el-checkbox{
        line-height: 20px;
    }
    .middle .el-radio{
        line-height: 20px;
    }
    .middle .el-form-item__label{
        /*line-height: 20px;*/
    }


    .temp .right .el-tabs__item, .temp .left .el-tabs__item {
        font-size: 14px !important;
    }

    .temp .el-tabs__nav,.flow .el-tabs__nav{
        float: none;
    }


    .apprDetail .el-checkbox__input.is-disabled+span.el-checkbox__label{
        color: #606266!important;
    }

    .apprDetail .el-step__description.is-success{
        color: #2a3542;
    }
    .el-radio__input.is-disabled+span.el-radio__label{
        color: #686d74!important;
        cursor: default!important;
    }
    .temp .el-tag--small{
        font-weight: normal;
    }
    /*.temp .el-radio__input.is-disabled.is-checked .el-radio__inner{*/
    /*background: #409EFF!important;*/
    /*}*/
    .temp .el-input__inner,.flow .el-input__inner{
        padding: 0 8px!important;
    }
    .temp .el-textarea__inner{
        padding: 5px 8px!important;
    }
    .form_margin .has-gutter tr th:nth-child(1){
        border-bottom: 0;
    }
    .form_margin .el-table__row td:nth-child(1){
        border-bottom: 0;
    }

    

    .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover{
        background-color: #f8fff4 !important;
        color: #409eff;
    }
    .el-tag {
        margin-left: 5px;
    }
    .el-message-box .el-button + .el-button{
        margin-left: 10px!important;
    }
    .myInfo .el-input.is-disabled .el-input__inner{
        color: #2a3542;
    }
    .myInfo .el-input.is-disabled .el-input__icon{
        display: none;
    }
    .dialog .el-dialog__header{
        padding: 0!important;
    }
    .dialog .el-dialog{
        width: 360px!important;
        margin-top: 25% !important;
    }
    .pwd .el-dialog{
        width: 320px!important;
    }
    .dialog .el-dialog__body{
        padding: 20px!important;
    }
    .right .el-tabs__item{
        width: 50%;
        text-align: center;
    }
    .receiveDet .floatSide .el-tabs__header{
        height: 42px;
        border-bottom: 1px solid #ebeef5;
        margin: 0 20px;
    }
    .searchObj .el-input--small{
        width: 150px;
    }
    .searchObj .el-range-editor.el-input__inner{
        width: 260px;
    }
    .searchObj .el-date-editor .el-range-separator{
        width: 8% !important;
    }

    .searchObj .el-select .el-input--small {
        width: 100px;
    }
    .form_validate{
        font-size: 12px;
        color: #F56C6C;
        font-weight: normal;
    }
    .el-table td div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap!important;
    }
    .tab_span{
        padding-right: 10px;
        display: inline-block;
    }
    .tab_click_a{
        cursor: pointer;
        color: #23ac38 !important;
        text-decoration: underline;
    }
    .tab_click_aa{
        cursor: pointer;
        color: #fff !important;
        font-weight: bold;
        text-decoration: underline;
    }

    .tab_clickA{
        cursor: pointer;
        color: #fff;
    }

    .tab_clickA:hover{
        cursor: pointer;
        color: #fff !important;
        font-weight: bold;
        text-decoration: underline;
    }

    .tab_click{
        cursor: pointer;
    }

    .tab_click:hover{
        cursor: pointer;
        // color: #23ac38 !important;
        text-decoration: underline;
    }

    .el-input-number{
        width: 130px !important;
    }

    .el-menu-item:focus, .el-menu-item:hover{
        background-color: #f4fcff !important;
    }

    .el-pager li.active {
        // color: #23ac38 !important;
        cursor: default;
    }

    .el-pager li:hover {
        // color: #23ac38 !important;
    }

    .form_margin .has-gutter tr th:nth-child(1){
        border-bottom: 1px solid #ebeef5;
        border-top: 1px solid #ebeef5;
    }
    .el-table th.is-leaf {
        border-top: 1px solid #ebeef5;
    }
    .form_margin .el-table__row td:nth-child(1){
        border-bottom: 1px solid #ebeef5;
    }
    .content .main .show-que{
        padding:0px !important;
    }
    .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
        color: #23ac38 !important;
        background-color: #fff !important;
    }
    .el-tabs__item:hover{
        color: #23ac38 !important;
    }
    .el-tabs--border-card>.el-tabs__content{
        padding-top: 20px !important;
        padding-left: 2px !important;
    }
    .el-dialog__header {
        padding: 10px 15px 10px !important;
        background: #409EFF !important;
    }
    .el-dialog__title {
        font-size: 16px !important;
        color: #fff !important;
    }
    .el-dialog__headerbtn .el-dialog__close {
        color: #fff !important;
    }
    .el-dialog__headerbtn {
        top: 10px !important;
        right: 10px !important;
        font-size: 20px !important;
    }
    .el-dialog__body {
        padding: 20px 20px !important;
    }
    .modal-body-el .el-date-editor--date{
        width: 200px !important;
    }
    .modal-body-el .el-input{
        width: 200px !important;
    }

    .el-button-qx:focus, .el-button-qx:hover {
        // color: #67c23a !important;
        // border-color: #c2e7b0 !important;
        // background-color: #f0f9eb !important;
    }

    .el-button-qx:active {
        // color: #67c23a !important;
        // background: #f0f9eb !important;
        // border-color: #c2e7b0 !important;
        outline: 0;
    }
    .el-table__expanded-cell .el-form-item {
        margin-bottom: 0px !important;
    }


    .row-expand-cover td:last-child .el-icon-arrow-right{visibility: hidden;}

    .tx {
        position: relative;
        top: 59px;
        font-size: 60px;
    }
    .selectStaff .el-radio{
        display: block;
    }
    .selectStaff .el-radio+.el-radio{
        margin-left: 0;
    }
</style>
