<template>
    <div style="position: fixed;z-index: 3;width: 100%;">
        <div class="top">
            <div class="title">
                <!-- <img src="../assets/image/logo.png" > -->
                <p style="width: 300px;">
                    <img src="../assets/image/logo.png" style="vertical-align: -11px;">
                    <span style="margin-left:10px;font-weight:800;letter-spacing: .1rem;">便民服务数据管理后台</span>
                </p>
            </div>
            <div class="quit">
                <a  @click="changepwd"><i class="el-icon-edit" aria-hidden="true"></i>&nbsp;&nbsp;修改密码</a>
                <a  @click="logout"><i class="fa fa-power-off" aria-hidden="true"></i>&nbsp;&nbsp;退出</a>
            </div>
            <div class="user">
                <p><i class="fa fa-user-o" aria-hidden="true"></i>&nbsp;&nbsp;欢迎您, {{name}}</p>
            </div>
        </div>
        <div>
            <!--添加门锁-->
            <el-dialog :title="title" style="" :visible.sync="showAddDeptModal" width="360px" :append-to-body="true">
                <div class="modal-body" style="font-size: 16px; padding: 0px;">

                    <el-form ref="deptObj"    status-icon class="demo-ruleForm">

                        <el-form-item label="旧密码" label-width="60px">
                            <el-input type="password" v-model="pwd" placeholder="请输入旧密码" ></el-input>
                        </el-form-item>
                        <el-form-item  label="新密码" label-width="60px">
                            <el-input type="password" v-model="pwd2" placeholder="请输入新密码" ></el-input>
                        </el-form-item>
                    </el-form>

                </div>
                <div slot="footer" class="dialog-footer" style="position: relative;">

                    <el-button class="el-button-qx" size="small" @click="showAddDeptModal = false,pwd='',pwd2=''">取 消</el-button>
                    <el-button type="primary" size="small" materiel  @click="confirm"  >确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script type="application/ecmascript">
    export default {
        name: 'headbar',//头部栏
        data () {
            return {
                userBlock:false,
                name:localStorage.name,
                title:'修改密码',
                showAddDeptModal:false,
                pwd:'',
                pwd2:''
            }
        },
        methods:{
            logout(){
                let that = this
                this.$swal({title: "退出成功",text: "请重新登录 ！",type:'success',confirmButtonColor:'#409EFF'})
                        .then(res=>{
                            // console.log(res)
                            that.$store.commit('logout')
                            this.$router.push({path:'login'});
                        }).catch(err=>{
                            that.$store.commit('logout')
                            this.$router.push({path:'login'});
                        })
            },
            changepwd(){
                this.showAddDeptModal = !this.showAddDeptModal
                this.pwd = ''
                this.pwd2 = ''
            },
            confirm(){
                const data = {
                    pwd:this.pwd,
                    pwd2:this.pwd2,
                    token:localStorage.token,
                    user:localStorage.name
                }
                if (data.pwd !== '' && data.pwd2 !== '') {
                    if (data.pwd === data.pwd2) {
                        this.$notify({
                            title: '密码相同',
                            type: 'failed'
                        });
                    }else{
                        this.api.post('changepwd',data)
                        .then(res =>{
                            console.log(res)
                            if (res.data.code === 0) {
                                this.$notify({
                                    title: '修改成功',
                                    type: 'success'
                                });
                                this.changepwd()
                            }else if (res.data.code === 401) {
                                this.$notify({
                                    title: 'token失效，请重新登陆',
                                    type: 'failed'
                                });
                            }else{
                                this.$notify({
                                    title: '初始密码错误',
                                    type: 'failed'
                                });
                            }
                        })
                    }
                    
                }else{
                    this.$notify({
                        title: '请输入密码',
                        type: 'failed'
                    });
                }
            },

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss' rel="stylesheet/scss" type="text/css">
    .top{
        height: 59px;
        line-height: 59px;
        width: 100%;
        background-color:#2c93f4;
        font-size: 16px;
        color: #fff;
        padding: 0 20px;
        min-width: 952px;
    }
    .top .title{
        float: left;
        width: 172px;
        height: 21px;
    }
    .top .quit{

        
    }
    .top .user,.top .quit{
        float: right;
        width: 145px;
        font-size: 14px;
        height: 59px;
    }
    .top .user,.top .quit a{
        text-decoration: none;
    }
    .top .user p {
        // width: 135px;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    }
    // .top .changepwd{
    //     width: 100px;
    // }
    .top .quit{
        width: 200px;
        margin-left: 20px;
    }
    .top .quit a{
        color: #fff;
        cursor: pointer;
        margin-right: 15px;
    }
</style>
