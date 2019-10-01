<template>
    <div>
        <loading toast-text="处理中请稍候..." :is-show="isShow"></loading>
        <div v-show="!isLogin" class="main" style="width: 1254px;margin: 0px auto;position: relative; min-height:720px;">
            <div class="middle" :style="'padding-top:'+middle+'px'">
                <div style="float: left; width:700px; text-align:center;"> <img src="../../assets/image/frame.png" start="padding-top: 120px;" /> </div>
                <div style="float:left;width:554px; text-align:center;">
                    <div style="height:170px;line-height:170px;"><span style="color:#fff; font-size:30px; ">便民服务数据管理后台</span></div>
                    <div style=" width:382px; height:365px; margin-left:86px;position: relative;">
                        <img src="../../assets/image/input.png" style="position: absolute;left: 0px;"/>
                        <div style="position: relative;z-index: 2;">
                            <!--登录部分-->
                            <div class="form-input" style="position: relative;z-index: 2;top: 127px;width: 250px;left: 84px;">
                                <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2"  status-icon class="demo-ruleForm">

                                    <el-form-item prop="account">
                                        <el-input type="text" v-model="ruleForm2.account" placeholder="请输入账号"  @keyup.enter.native="submitForm('ruleForm2')" auto-complete="off"></el-input>
                                    </el-form-item>

                                    <el-form-item prop="password">
                                        <el-input type="password" v-model="ruleForm2.password" placeholder="请输入密码" @keyup.enter.native="submitForm('ruleForm2')" auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="code" >
                                        <div style="display: flex;justify-content: center;position:relative;top:0;">
                                            <el-input  @keyup.enter.native="submitForm('ruleForm2')" style="width:165px;" type="text" v-model="ruleForm2.code" placeholder="请输入验证码"  auto-complete="off"></el-input>
                                            <div style="height:43px;" @click="getSvg" v-html="svg"></div>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>

                            <div class="form-input" style="position: relative;z-index: 2;top: 108px;width: 304px;left: 40px;">
                                <el-button type="el-button el-button--primary" @click="submitForm('ruleForm2')" :loading="submitLoading">登&nbsp;录</el-button>
                                
                            </div>
                        </div>
                        <!--/登录部分-->
                    </div>
                </div>
                <div style="clear:both;"></div>
            </div>
        </div>
        <div style="text-align:center;position:absolute; bottom:40px; width: 100%;text-align: center;"><span style="color:#fff; ">copyright @2019 便民服务数据管理后台.all rights reserred</span></div>

    </div>

</template>

<script type="application/ecmascript">
    import * as types from '../../store/types'
    import loading from '../../components/loading.vue';
    export default {
        name: 'login',
        // prpos:['abc'],
        data () {
            var validateAccount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            };
            return {
                tableHeight:'',
                isShow:false,
                submitLoading:false,
                isLogin:this.$store.getters.getIslogin,
                ruleForm2: {
                    account: '',
                    password:'',
                    code:''
                },

                rules2: {
                    account: [
                        { validator: validateAccount, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    code: [
                        { validator: validateCode, trigger: 'blur' }
                    ]
                },

                middle:7,
                svg:''
            }
        },
        components:{
            loading,
        },
        mounted(){
            this.getSvg()
            let screenHeight = window.innerHeight;
            this.tableHeight = screenHeight;
            if(screenHeight>720){
                var middle=(screenHeight-720)/2+70;
                this.middle=middle;
            }else{
                this.middle=7;
            }
            document.body.style.backgroundColor = '#228bf6';
        },
        methods:{
            getSvg(){
                this.api.get('getsvg')
                    .then(res =>{
                        console.log(res)
                        this.svg = res.data.data
                    })
            },
            async login(){
                setTimeout(() => this.submitLoading = false,2000);
                let query = {
                    username: this.ruleForm2.account,
                    pwd: this.ruleForm2.password,
                    svgtxt:this.ruleForm2.code
                }
                
                let res = await this.api.post('login', query);
                console.log(res)
                if (res.data.code === 402) {
                    console.log(1)
                    this.$notify({
                        title: '验证码错误',
                        type: 'failed'
                    });
                    this.ruleForm2.password = ''
                    this.ruleForm2.code = ''
                    this.getSvg()
                    return
                }else if(res.data.code == 200) {
                    console.log(2)
                    const {user,token} = res.data.data
                    this.$store.commit('login',{name:query.username,token})
                    this.$router.push({path:'/detp'});
                    // location.href = '/#/detp'
                    this.$notify({
                        title: '登陆成功',
                        type: 'success'
                    });
                    
                }else if(res.data.code === 202){
                    console.log(3)
                    this.$notify({
                        title: '密码错误',
                        type: 'failed'
                    });
                    this.ruleForm2.password = ''
                    this.ruleForm2.code = ''
                    this.getSvg()
                }else if(res.data.code === 201){
                    console.log(4)
                    this.$notify({
                        title: '没有这个账户',
                        type: 'failed'
                    });
                    this.ruleForm2.password = ''
                    this.ruleForm2.code = ''
                    this.getSvg()
                }else{
                    console.log(5)
                    this.$notify({
                        title: '服务器出错',
                        type: 'failed'
                    });
                }
            },
            submitForm(formName) {
                // console.log(12123)
                this.submitLoading=true;
                this.$refs[formName].validate((valid) => {
                    // valid 表单拦截
                    if (valid) {
                        this.login();
                    } else {
                        this.submitLoading=false;
                        // this.$notify.error({
                        //     title: '内容不能为空',
                        // });
                        return false;
                    }
                });
            },
        }
    }

</script>

<style scoped lang="stylus">
    @import "../../assets/styl/main.styl";
</style>
