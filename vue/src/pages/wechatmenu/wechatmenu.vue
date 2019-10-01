<template>
    <div class="content">
        <div class="main" :style="'height:'+contentHeight+'px;'">
            <div class="main-top">
                <div>
                    <!-- <el-button type="primary" size="small" @click="revise('add')">添加公众号</el-button> -->
                </div>
            </div>
            <div class="show-que" :style="'height:'+tableHeight+'px;'">
                <el-table :header-cell-style="{background:'#FAFAFA'}" @row-click = "showRow"
                    :height="tableHeight" :data="tableData" >
                    <el-table-column label="选择"  width="50" align="center">
                        <template scope="scope">
                            <el-radio class="radio"  v-model="radio"  :label="scope.$index">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="环境地址" width="180"></el-table-column>
                    <el-table-column prop="appid" label="appid" ></el-table-column>
                    <el-table-column prop="appsecret" label="appsecret"></el-table-column>
                    <!-- <el-table-column prop="appSecret" label="appSecret" width="180"></el-table-column> -->
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-button  size="small" type="primary" plain @click="revise(scope.row)">修改</el-button>
                                <!-- <el-button  size="small" type="primary" plain @click="setsure(scope.row)">确定</el-button> -->
                                
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div>
            <!--添加门锁-->
            <el-dialog :title="title" style="" :visible.sync="showAddDeptModal" width="650px">
                <div class="modal-body" style="font-size: 16px; padding: 0px;">

                    <el-form ref="deptObj"    status-icon class="demo-ruleForm">

                        <el-form-item prop="name" label="环境地址" label-width="80px">
                            <el-input type="text" @input="change" v-model="selected.title" placeholder="环境地址" ></el-input>
                        </el-form-item>
                        <el-form-item prop="name" label="AppID" label-width="80px">
                            <el-input type="text" @input="change" v-model="selected.appid" placeholder="请输入AppID" ></el-input>
                        </el-form-item>
                        <el-form-item prop="name" label="AppSecret" label-width="80px">
                            <el-input type="text" v-model="selected.appsecret" placeholder="请输入AppSecret" ></el-input>
                        </el-form-item>
                    </el-form>

                </div>
                <div slot="footer" class="dialog-footer" style="position: relative;">

                    <el-button class="el-button-qx" size="small" @click="showAddDeptModal = false,isShow = false">取 消</el-button>
                    <el-button type="primary" size="small" materiel v-show="!isShow"  @click="confirm"  >保 存</el-button>
                    <el-button type="primary" size="small" v-show="isShow" materiel @click="additem"  >添 加</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: "wechatmenu",
    data() {
        return {
            tableHeight: 0,
            contentHeight: "",
            tableData: [],
            radio:'',
            selected:{},
            subdata:{
                item_name:'',
                item_address:'',
                id:''
            },
            showAddDeptModal:false,
            title:'',
            isShow:false,

        };
    },
    created() {
        /* this.api
            .get("getmenu")
            .then(result => {
                console.log(result);
                this.tableData = result.data.data;
                this.tableData.forEach(v=>{
                    if (v.isUse) {
                    console.log(v)
                        this.radio = v.id*1
                    }
                })
            })
            .catch(err => {
                console.log(err);
            }); */
        this.setSelfAdaption();
    },
    mounted(){
        this.api
            .get("getmenu")
            .then(result => {
                // console.log(result);
                this.tableData = result.data.data;
                this.tableData.forEach(v=>{
                    if (v.isUse) {
                        console.log(v)
                        this.radio = v.id*1-1
                    }
                })
            })
            .catch(err => {
                console.log(err);
            });
    },
    computed: {},

    beforeMount() {},

    methods: {
        setSelfAdaption() {
            let screenHeight = window.innerHeight;
            let screenWidth = window.innerWidth;
            this.tableHeight = screenHeight - 210;
            this.contentHeight = screenHeight - 100;
            this.contentWidth = screenWidth - 220;
        },
        showRow(row){
            //赋值给radio
            this.radio = this.tableData.indexOf(row);
            this.selected=row;
            this.tableData.forEach(v=>{
                v.isUse = 'false'
            })
            this.tableData[this.radio].isUse = 'true'
            console.log(this.radio,this.selected)
        },  
        revise(data){
                console.log(data)
                this.showAddDeptModal = true
                this.title = '修改公众号'
                // this.subdata={}
                // // 判断是添加还是修改
                // if (data === 'add') {
                //     this.isShow = true
                //     return
                // }else{
                //         this.title = '修改事项'
                //         this.$set(this.subdata,"item_name", data.item_name)
                //         this.$set(this.subdata,"item_address", data.item_address)
                //         this.subdata.id = data.id
                // }
                
        },
        change(){},
        async confirm(){
            let data = {dataId:JSON.stringify(this.selected),token:localStorage.token}
            let res = await this.api.post('setappid',data);
            console.log(res)
            if (res.data.code === 0) {
                this.$notify({
                    title: '修改成功',
                    type: 'success'
                });
                this.showAddDeptModal = false
            }
            
        },
        // setsure这个废弃
        async setsure(){
            let data = {dataId:JSON.stringify(this.tableData),token:localStorage.token}
            let res = await this.api.post('setappid',data);
            if (res.data.code === 0) {
                this.$notify({
                    title: '修改成功',
                    type: 'success'
                });
                this.showAddDeptModal = false
            }
        },
        additem(){},

    },

    watch: {}
};
</script>
<style lang='' scoped>
.content {
    /* padding: 20px; */
    background-color: #fff;
}
.main-top{
        float:right;
    }
    .main{
        padding: 20px;
    }
</style>