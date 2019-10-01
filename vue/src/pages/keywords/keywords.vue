<template>
    <div class="content">
        <div class="main" :style="'height:'+contentHeight+'px;'" >
                <!-- 事项搜索： -->
                <el-input placeholder="请输入事项" v-model="search" clearable style="width:400px;"></el-input>
                <div class="main-top">
                <div >
                    <!-- <el-button type="primary" size="small" @click="showAddDeptModal2=true">添加事项</el-button> -->
                    <!-- <el-button type="primary" size="small" @click="tableToExcel">下载模板</el-button> -->
                </div>
                
            </div>
                <!-- .slice((currentPage-1)*pageSize,currentPage*pageSize) -->
                <div class="show-que" :style="'height:'+tableHeight+'px;'">
                    <!-- :cell-style="{background:'#fff'}" -->
                    <el-table :height="tableHeight" :row-style="{height:'5px'}" :cell-style="{padding:'10px 0'}"
                         :data="tabledata.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
                         :header-cell-style="{background:'#FAFAFA'}" tooltip-effect="dark" style="width: 100%;" class="form_margin">
                        <el-table-column  width="17"> </el-table-column>

                        <el-table-column label="事项"   width="400px">
                            <template slot-scope="scope">
                                <div >
                                    <span>{{scope.row.item_name}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="常用语" >
                            <template slot-scope="scope"  style="margin-left:-70px;">
                                <div>
                                    <!-- <span>{{scope.row.id}}</span> -->
                                    <div class="txt" >
                                        <el-tag :title="item.key_name" 
                                        style="font-size:13px;display:block;float:left;margin-top:5px;" 
                                        closable v-for="(item,index) in keysdata(scope.row.id-1)" 
                                        :key="index" 
                                        @close="close({item,index})">
                                            {{item.key_name}}
                                        </el-tag>
                                        <el-button style="font-size:13px;display:block;float:left;margin-top:5px;margin-left:5px;" 
                                            type="primary" size="small" @click="isShowAdd(scope.row)">添加</el-button>
                                    </div>
                                </div>
                                    
                            </template>
                            
                        </el-table-column>
                        
                        <el-table-column  width="17"> </el-table-column>
                    </el-table>
                    <div v-if="total>0" class="page">
                        <el-pagination
                            @current-change="current_change"
                            layout="total, prev, pager, next, jumper"
                            :page-size="pageSize"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
                <div class="show-que" v-if="b_keysdata==null||b_keysdata.length==0">
                    <div style="padding-top: 150px; text-align: center;"><img src="../../assets/image/none_data.png"></div>
                    <div style="text-align: center; margin-top: 20px; font-size: 18px;" ><span style="	color: #444444;">暂无内容</span></div>
                </div>



        </div>

        <div>
            <!--添加门锁-->
            <el-dialog title="关键词" style="" :visible.sync="showAddDeptModal" width="450px">
                <div class="modal-body" style="font-size: 16px; padding: 0px;">

                    <el-form ref="deptObj"    status-icon class="demo-ruleForm">

                        <el-form-item prop="name" label="关键词" label-width="80px">
                            <el-input type="text" v-model="keyData.key_name" placeholder="请输入事项名称" ></el-input>
                        </el-form-item>
                        <!-- <el-form-item prop="name" label="事项地址" label-width="80px">
                            <el-input type="text" v-model="subdata.item_address" placeholder="请输入事项地址" ></el-input>
                        </el-form-item> -->
                    </el-form>

                </div>
                <div slot="footer" class="dialog-footer" style="position: relative;">

                    <!-- <el-button type="primary" size="small" materiel v-show="!isShow"  @click="confirm"  >保 存</el-button> -->
                    <el-button class="el-button-qx" size="small" @click="cancel">取 消</el-button>
                    
                    <el-button type="primary" size="small" materiel @click="addKey">添 加</el-button>
                </div>
            </el-dialog>
        </div>

        <!-- <div>

            <el-dialog title="导入文件" :visible.sync="showAddDeptModal2" size="tiny" width="400px">
                <div style="position:relative;left45%;">
                    <input type="file" class="myFileUpload" @change="importFile(this)" id="imFile"/>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="addItems">确认</el-button>
                </span>
            </el-dialog>
        </div> -->
    </div>


</template>

<script>
    import * as types from '../../store/types'
import { log } from 'util';
    export default {
        name: "keywords",
        data () {
            return {
                tableHeight:0,
                contentHeight:'',
                // 已匹配的数据 b_keys
                b_keysdata:[],
                // 关键词数据
                key_item:[],
                total:0,
                currentPage:1,
                pageSize:10,
                search:'',
                isShow:false,
                showAddDeptModal:false,
                showAddDeptModal2:false,
                keyData:{
                    key_name:'',
                    item_id:''
                },
                dataJson:{}
                
            }
        },
        computed:{
            tabledata(){
                const search = this.search
                if (search) {
                    return this.key_item.filter(item =>{
                        return Object.keys(item).some(key =>{
                            return String(item[key]).toLowerCase().indexOf(search.trim()) > -1
                        })
                    })
                }
                return this.key_item
            },
            
        },
        created(){
            this.setSelfAdaption()
        },
        mounted(){
            // 加载为未匹配关键词数据
            this.query()
            this.querykeys()
        },
        methods:{
            current_change(i){
                this.currentPage = i
            },
            setSelfAdaption() {
                let screenHeight = window.innerHeight;
                let screenWidth = window.innerWidth;
                this.tableHeight = screenHeight - 210;
                this.contentHeight = screenHeight - 100;
                this.contentWidth = screenWidth - 220;
            },
            keysdata(i){
                return this.b_keysdata.filter(v=>{return v.item_id === i+1})
            },
            close(tag){
                // console.log(tag)
                const obj = tag.item
                this.api.post('deletekeys',{id:obj.id,key_name:obj.key_name,token:localStorage.token})
                    .then(res=>{
                        // console.log(res.data);
                        if (res.data.code === 0) {
                            this.$notify({
                                title: '删除成功',
                                type: 'success'
                            });
                            this.querykeys()
                            this.showAddDeptModal = false
                        }else{
                            this.$notify({
                                title: '删除失败',
                                type: 'failed'
                            });
                        }
                    }).catch(err=>{
                        this.$notify({
                                title: '删除失败',
                                type: 'failed'
                        });
                    })
            },
            query(){
                // this.isdata = !this.isdata
                this.api.get('queryitemkeys',{token:localStorage.token})
                    .then(res=>{
                        // console.log(res.data);
                        if (!res) return
                        this.key_item = res.data.data2
                        this.total = this.key_item.length
                        // console.log(this.total)
                    })
            },
            querykeys(){
                this.api.get('querykeywords',{token:localStorage.token})
                    .then(res=>{
                        // console.log(res.data.data);
                        this.b_keysdata = res.data.data
                    }).catch(err=>{
                        // console.log(err)
                    })
            },
            handleDelete(index,obj){
                this.api.post('deletenokeys',{id:obj.id,key_name:obj.key_name,token:localStorage.token})
                    .then(res=>{
                        // console.log(res)
                        if (res.data.data.code === 0) {
                            this.$notify({
                                title: '删除成功',
                                type: 'success'
                            });
                            this.query()
                        }else{
                            this.$notify({
                                title: '删除失败',
                                type: 'failed'
                            });
                        }
                    }).catch(err=>{
                        // console.log(err)
                        this.$notify({
                            title: '删除失败',
                            type: 'failed'
                        });
                    })
            },
            current_change(i){
                this.currentPage = i
            },
            isShowAdd(obj){
                this.keyData.item_id = obj.id
                this.showAddDeptModal = true
            },
            addKey(){
                if (this.keyData.key_name !== '') {
                    let keysArr = this.keyData.key_name.split(/[\。|\，|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/);
                    this.api.post('addkeys',{keyData:this.keyData,keysArr,token:localStorage.token})
                        .then(res=>{
                            console.log(res)
                            if (res.data.code == 0) {
                                this.$notify({
                                    title: '添加成功',
                                    type: 'success'
                                });
                                this.cancel()
                                this.querykeys()
                            }else{
                                this.$notify({
                                    title: '添加失败',
                                    type: 'failed'
                                });
                            }
                        }).catch(err=>{
                            this.$notify({
                                    title: '添加失败',
                                    type: 'failed'
                                });
                        })
                }else{
                    this.$notify({
                        title: '请填写内容',
                        type: 'failed'
                    });
                }

            },
            cancel(){
                this.showAddDeptModal = false
                // this.showAddDeptModal2 = false
                this.keyData.key_name=''
            },
            /* addItems(){
                
                if (this.Xlstype == 'application/vnd.ms-excel') {
                    this.api.post('additems',{data:JSON.stringify(this.dataJson),token:localStorage.token})
                        .then(res=>{
                            if (res.data.code == 0) {
                                this.$notify({
                                    title: '修改成功',
                                    type: 'success'
                                });
                                this.query();
                                this.querykeys();
                                this.showAddDeptModal2 = false
                            }else if(res.data.code == 233){
                                this.$notify({
                                    title: '修改失败,事项内容重复',
                                    type: 'failed'
                                });
                            }
                        }).catch(err=>{
                            // console.log(err)
                            this.$notify({
                                    title: '修改失败',
                                    type: 'failed'
                                });
                        })
                }else{
                    this.$notify({
                        title: '请使用xls格式',
                        type: 'failed'
                    });
                }
            }, */



            importFile(){ // 导入excel
                this.imFile = document.getElementById('imFile')
                let obj = this.imFile
                if (!obj.files) {
                    return
                }
                if (obj.files[0].type !== 'application/vnd.ms-excel') return
                var f = obj.files[0]
                this.Xlstype = f.type
                this.upName = f.name
                // console.log(this.upName)
                var reader = new FileReader()
                let that = this
                reader.onload = function (e) {
                    // console.log(e)
                    var data = e.target.result
                    if (that.rABS) {
                        that.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
                            type: 'base64'
                        })
                    } else {
                        that.wb = XLSX.read(data, {
                            type: 'binary'
                        })
                    }
                    let json = XLSX.utils.sheet_to_json(that.wb.Sheets[that.wb.SheetNames[0]])
                    let arr=[]
                    for (let i = 0; i < json.length; i++) {
                        json[i]['新增日常用语'] = json[i]['新增日常用语'].split(/[\。|\，|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/)
                    }
                    that.dataJson = json
                    console.log(json)
                }
                if (this.rABS) {
                    reader.readAsArrayBuffer(f)
                } else {
                    reader.readAsBinaryString(f)
                }
            },
            fixdata: function (data) {  // 文件流转BinaryString
                var o = ''
                var l = 0
                var w = 10240
                for (; l < data.byteLength / w; ++l) {
                    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                }
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
                return o
            },
        }
    }
</script>

<style scoped lang="stylus">
    @import "../../assets/styl/list.styl";
    ul,li{
        list-style:none;
    }
    .list-data li{
        float:left;
        margin-right:10px;
        margin-bottom:10px;
        width:320px;
        height:50px;
        line-height:50px;
    }
    .list-data li .key_name{
        display inline-block;
        width:100px;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .main-top{
        float:right;
    }
    .myFileUpload{
        position: relative;
        left: 90px;
        top: 5px;
        display: block;
        width: 200px;
        // height: 33px;
        // line-height: 33px;
        // opacity: 0;
    }
</style>
