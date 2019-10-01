<template>
    <div class="content">
        <!-- <div class="content" :style="'width:'+contentWidth+'px'">
            <div class="main" :style="'height:'+contentHeight+'px'"> -->
        <div class="main" :style="'height:'+contentHeight+'px;'">
            <el-input placeholder="请输入事项" v-model="search" clearable style="width:400px;"></el-input>
            <div class="main-top">
                <div >
                    <el-button type="primary" size="small" @click="tableToExcel">下载模板</el-button>
                    <el-button type="primary" size="small" @click="daoru">导入</el-button>
                    <el-button type="danger" size="small" @click="deleItems">删除</el-button>
                    <el-button type="primary" size="small" @click="revise('add')">添加事项</el-button>
                </div>
                
            </div>
            <!-- .slice((currentPage-1)*pageSize,currentPage*pageSize) -->
                <div class="show-que" :style="'height:'+tableHeight+'px;'">




                    <el-table :height="tableHeight"  
                        :data="tabledata.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
                        :header-cell-style="{background:'#FAFAFA'}" 
                        tooltip-effect="dark" style="width: 100%;" class="form_margin"
                         @selection-change="handleSelectionChange">

                        <el-table-column
                            type="selection"
                            width="55">
                            </el-table-column>


                        <el-table-column  width="17"> </el-table-column>

                        <el-table-column label="事项" >
                            <template slot-scope="scope">
                                <div >
                                    <span>{{scope.row.item_name}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="事项地址" >
                            <template slot-scope="scope">
                                <div >
                                    <!-- <el-input :ref="scope.row.id" :disabled="isbool[scope.$index]" v-model="key_item.slice((currentPage-1)*pageSize,currentPage*pageSize)[scope.$index].item_address"  :value="scope.row.item_address"></el-input> -->
                                    <span>{{scope.row.item_address}}</span>
                                    <!-- <span>{{scope.row.item_address}}</span> -->
                                </div>
                                    
                            </template>
                            
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope" >
                                <div >
                                    <!-- <span class="tab_click" @click="revise({index:scope.$index,id:scope.row.id,item_address:scope.row.item_address,item_name:scope.row.item_name})">修改</span> -->
                                    <el-button type="primary" size="small" 
                                    @click="revise({index:scope.$index,id:scope.row.id,item_address:scope.row.item_address,item_name:scope.row.item_name})" 
                                    plain>修改</el-button>

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

        <div class="show-que" v-if="key_item==null||key_item.length==0">
                    <div style="padding-top: 150px; text-align: center;"><img src="../../assets/image/none_data.png"></div>
                    <div style="text-align: center; margin-top: 20px; font-size: 18px;" ><span style="	color: #444444;">暂无内容</span></div>
                </div>

        </div>

        <el-dialog title="导入文件" :visible.sync="showAddDeptModal2" size="tiny" width="400px">
            <!-- <div style="position:relative;left45%;">
                <a href='javascript:void(0);' class="blueButton">选择文件</a> @change="importFile(this)"
                <input type="file" class="myFileUpload" @change="getFile($event)" id="imFile"/>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="addItems">确认</el-button>
            </span> -->
            <el-upload
                class="upload-demo"
                :action="url+'api/uploadxls/'"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
	            :before-upload="beforeAvatarUpload"
                :file-list="fileList"
                accept="xls">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls文件</div>
                </el-upload>
            <el-button size="small" type="primary" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="addItems">确认</el-button>
        </el-dialog>


        <div>
            <!--添加门锁-->
            <el-dialog :title="title" style="" :visible.sync="showAddDeptModal" width="650px">
                <div class="modal-body" style="font-size: 16px; padding: 0px;">

                    <el-form ref="deptObj"    status-icon class="demo-ruleForm">

                        <el-form-item prop="name" label="事项名称" label-width="80px">
                            <el-input type="text" @input="change" v-model="subdata.item_name" placeholder="请输入事项名称" ></el-input>
                        </el-form-item>
                        <el-form-item prop="name" label="事项地址" label-width="80px">
                            <el-input type="text" v-model="subdata.item_address" placeholder="请输入事项地址" ></el-input>
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
    import * as types from '../../store/types'
    export default {
        name: "matter",
        data () {
            return {
                url:this.api.url,
                tableHeight:0,
                contentHeight:'',
                // 未匹配的数据 
                key_item:[],
                // 关键词数据
                iptvalue:[],
                subdata:{
                    item_name:'',
                    item_address:'',
                    id:''
                },
                search:'',
                showAddDeptModal:false,
                showAddDeptModal2:false,
                isShow:false,
                title:'',
                total:0,
                pageSize:11,
                currentPage:1,
                imFile: '', // 导入文件el
                // upName:'',
                wb:[],
                Xlstype:'', //导入的excel格式这里规定需要xls
                delData:[],// 需要删除的事项，
                // DelItems:[],
                dataJson:{},// 
                file:null,
                fileList:[],
                fileName:'',
            }
        },
        created(){
            this.setSelfAdaption()
        },
        mounted(){
            // 加载为未匹配关键词数据
            this.query()
            
            // console.log(this)
        }, 
        computed:{
            tabledata(){
                const search = this.search
                if (search) {
                    console.log( this.key_item.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize).filter(item =>{
                        return Object.keys(item).some(key =>{
                            return String(item[key]).toLowerCase().indexOf(search.trim()) > -1
                        })
                    }))
                    return this.key_item.filter(item =>{
                        return Object.keys(item).some(key =>{
                            return String(item[key]).toLowerCase().indexOf(search.trim()) > -1
                        })
                    })
                }
                return this.key_item
            },
            
        },
        methods:{
            beforeAvatarUpload(file) {
                // console.log(file)
                this.fileName = file.name;
	          var testmsg=/^application\/vnd\.ms-excel$/.test(file.type)
	          const isLt4M = file.size / 1024/1024 <=4//文件大小不超过2MB
	          if (!testmsg) {
	            this.$message.error('上传文件格式不对!');
	            return
	          }
	          if(!isLt4M) {
	            this.$message.error('上传文件大小不能超过 4M!');
	            return
	          }
	          return testmsg  && isLt4M
	        },
             handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                // console.log(file)
                return this.$confirm(`确定移除 ${ file.name }？`,'提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.api.post('delupload',{filename:file.name,token:localStorage.token})
                        });
            },


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
            change(n){
                // console.log(n,this.subdata.item_name,'asdsadasds')
            },
            additem(){
                const item_name = this.subdata.item_name && this.subdata.item_name.trim()
                const item_address = this.subdata.item_address && this.subdata.item_address.trim()
                if (item_name !== '' && item_address !== '' && item_name !== undefined && item_address !== undefined) {
                    this.api.post('additem',{item_name,item_address,token:localStorage.token})
                        .then(res =>{
                            // console.log(res.data)
                            if (res.data.code === 0) {
                                this.$notify({
                                    title: '添加成功',
                                    type: 'success'
                                });
                                this.showAddDeptModal = false
                                this.query()
                            }else if(res.data.code === 1){
                                this.$notify({
                                    title: '添加失败',
                                    type: 'failed'
                                });
                            }else if (res.data.code === 401) {
                                this.$notify({
                                    title: 'token失效，请重新登陆',
                                    type: 'failed'
                                });
                            }
                        })
                }else{
                    this.$notify({
                        title: '值不能为空',
                        type: 'failed'
                    });
                }
            },
            query(){
                this.api.get('queryitems',{token:localStorage.token})
                    .then(res=>{
                        // console.log(res.data);
                        if (!res) return
                        this.key_item = res.data.data
                        // console.log(this.key_item)
                        this.total = this.key_item.length
                    }).catch(err=>{
                        // console.log(err);
                    })
            },
            revise(data){
                // console.log(data)
                this.showAddDeptModal = true
                this.subdata={}
                // 判断是添加还是修改
                if (data === 'add') {
                    this.isShow = true
                    this.title = '添加事项'
                    return
                }else{

                    // if (data) {
                        this.title = '修改事项'
                        this.$set(this.subdata,"item_name", data.item_name)
                        this.$set(this.subdata,"item_address", data.item_address)
                        this.subdata.id = data.id
                    // }
                }
                
            },
            confirm(){
                this.api.post('subitem',{data:this.subdata,token:localStorage.token})
                    .then(res =>{
                        // console.log(res);
                        if (res.data.code === 0) {
                            this.$notify({
                                title: '修改成功',
                                type: 'success'
                            });
                            this.query()
                            this.showAddDeptModal = false
                        }else{
                            this.$notify({
                                title: '修改失败',
                                type: 'failed'
                            });
                        }
                    }).catch(err=>{
                        this.$notify({
                                title: '修改失败',
                                type: 'failed'
                            });
                    })
                
            },
            daoru(){
                
                this.showAddDeptModal2 = true
            },
            importFile(){ // 导入excel
                this.imFile = document.getElementById('imFile')
                let obj = this.imFile
                if (!obj.files) {
                    return
                }
                if (obj.files[0].type !== 'application/vnd.ms-excel') return
                var f = obj.files[0];
                this.Xlstype = f.type;
                console.log(f.type)
                // this.upName = f.name
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
            getFile(e){
                this.file = event.target.files[0];
            },
            addItems(e){
                // if (this.Xlstype == 'application/vnd.ms-excel') {
                    this.api.post('additems',{filename:this.fileName,token:localStorage.token})
                        .then(res=>{
                            if (res.data.code == 0) {
                                this.$notify({
                                    title: '修改成功',
                                    type: 'success'
                                });
                                this.query();
                                this.showAddDeptModal2 = false;
                                this.api.post('delupload',{filename:this.fileName,token:localStorage.token})
                                this.fileList = [];
                                // this.Xlstype=''; //吧判断的xlstype清空
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
                // }else{
                //     this.$notify({
                //         title: '请使用xls格式',
                //         type: 'failed'
                //     });
                // }
            },
            cancel(){
                this.showAddDeptModal2 = false
                this.api.post('delupload',{filename:this.fileName,token:localStorage.token})
            },
            handleSelectionChange(val){
                this.delData = val
            },
            deleItems(){
                {
                    /*  "menu":{
                        "button": [
                            {
                                "type": "view", 
                                "name": "便民服务", 
                                "url":"http://ymyw.gdzj110.gov.cn/wxmh/internetApp/home/appMain.ignore?wxconfig=44082"
                            }, 
                            {
                                "type": "view", 
                                "name": "语音导航", 
                                "url":"http://huzheng.gdzj110.gov.cn"
                            }, 
                        ]
                    } */
                    //21_AoEDSaYN3qcHjagIjaIDPlaNrIAf-xYsRzzbU2y3E1K220BRLKFWxpquNdOwjHS5x0SX3YSAdZI0lFvTTA9zZ83MhSpp6TasdOQKJLKe40UsBScyUTJKd60eXg0xf0Fyr7eOLeIYyetO9wyqZCDfACANQR
                }
      
                let dataId = [];
                if (this.delData.length !== 0) {
                    
                    this.delData.forEach(v=>{
                        dataId.push(v.id)
                    })
                    this.confirmBox('您正在进行事项批量删除的操作，确认要删除？',async() => {
                        this.api.post('delitems',{dataId:dataId,token:localStorage.token})
                            .then(res =>{
                                // console.log(res)
                                if (res.data.code == 0) {
                                    this.$notify({ message: '事项删除成功！', type: 'success'});
                                    this.query()
                                }else{
                                    this.$notify({title: '事项删除失败',type: 'failed'});
                                }
                            })
                    })
                }else{
                    this.$notify({title: '请勾选内容',type: 'failed'});
                }
            },
            tableToExcel(){
                this.downtableToExcel()
            }
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
    // .blueButton{
    //     position: absolute;
    //     display: block;
    //     left: 100px;
    //     top: 5px;
    //     width: 80px;
    //     height: 33px;
    //     line-height: 33px;
    //     background-color: #409EFF;
    //     color: #fff;
    //     text-decoration: none;
    //     text-align: center;
    //     cursor: pointer;
    //     border-radius: 4px;
    // }
    // // .blueButton:hover{
    // //     text-decoration: none;
    // // }
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
