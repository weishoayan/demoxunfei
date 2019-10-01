<template>
    <div>
        <loading toast-text="处理中请稍候..." :is-show="isShow"></loading>
        <!-- <div class="content"> sqldata.slice((currentPage-1)*pageSize,currentPage*pageSize)
            <div class="main" style="height: 780px" > -->
            <div class="content" >
                <div class="main" :style="'height:'+contentHeight+'px;'">
            <!-- <div class="main"> -->
                            <div class="show-que" :style="'height:'+tableHeight+'px;width:100%;'">
                            <!-- <div class="show-que"> -->




                                <el-table :row-style="{height:'5px'}" :cell-style="{padding:'10px 0 5px 0'}"
                                    :data="sqldata.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
                                    :header-cell-style="{background:'#FAFAFA'}" 
                                    tooltip-effect="dark" style="width: 100%;" class="form_margin">




                                    <el-table-column  width="17"> </el-table-column>

                                    <el-table-column label="未匹配"  >
                                        <template slot-scope="scope">
                                            <div >
                                                <span>{{scope.row.key_name}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="匹配词" >
                                        <template slot-scope="scope">
                                                <el-select  v-model="value[scope.$index]['value']" filterable clearable   placeholder="请选择">
                                                    <el-option v-for="item in tableData" :key="item.item_name" :value="item.id" :label="item.item_name">
                                                    </el-option>
                                                </el-select>
                                        </template>
                                        
                                    </el-table-column>

                                    <el-table-column label="操作" align="center" >
                                        <template slot-scope="scope" >
                                            <!-- <div v-if="!isbool"> -->
                                            <div >
                                                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" plain>匹配</el-button>
                                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" plain>删除</el-button>
                                                <!-- <span class="tab_click" @click="handleEdit(scope.$index, scope.row)">匹配</span>&nbsp;&nbsp;
                                                <span class="tab_click" @click="handleDelete(scope.$index, scope.row)">删除</span>&nbsp;&nbsp; -->
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
                            <!-- 如果没数据就显示 -->
                                <div class="show-que" v-if="sqldata==null||sqldata.length==0">
                                    <div style="padding-top: 150px; text-align: center;"><img src="../../assets/image/none_data.png"></div>
                                    <div style="text-align: center; margin-top: 20px; font-size: 18px;" ><span style="	color: #444444;">暂无内容</span></div>
                                </div>
                            </div>
            </div>
        </div>


        
        
    </div>

</template>

<script>
    import * as types from '../../store/types'
    import loading from '../../components/loading.vue';
    export default {
        name: "dept",
        data () {
            return {
                tableHeight:0,
                contentHeight:'',
                isShow:false,
                sqldata:[], // 未匹配的数据 id：数据库id，item_id需要对接上事项id，key_name关键字
                tableData:{}, // 事项数据，id：数据id，item_name事项关键字，
                value:[], // option的 value:'事项id',id:item.id
                // isbool:false,
                subdata:{
                    id:'',// 没匹配到的数据库id
                    key_name:'', // 关键字
                    item_name:'', // 被匹配的关键字
                    item_id:'', // 被匹配的关键字id
                    vueid:'' // 在vue里面的索引
                },
                total:0,
                pageSize:10,
                currentPage:1
            }
        },
        components:{//引用组件
            loading,
        },
        created(){
            this.setSelfAdaption()
        },
        mounted(){
            this.query()
        },
        methods:{
            query(){
                this.api.get('queryitemkeys',{token:localStorage.token})
                    .then(res=>{
                        if (!res) return
                        this.sqldata = res.data.data.filter((v,i) =>{
                                    if (v.item_id === null) {
                                        return v
                                    }
                                })
                        this.total = this.sqldata.length
                        this.tableData = res.data.data2
                        // this.value = this.sqldata.map((item,i) => {
                        //     return {value:'',id:item.id};
                        // });
                        this.value = this.sqldata.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize).map((item,i) => {
                            return {value:'',id:item.id};
                        });
                    }).catch(err=>{
                        // console.log(err);
                    })
            },
            setSelfAdaption() {
                let screenHeight = window.innerHeight;
                let screenWidth = window.innerWidth;
                this.tableHeight = screenHeight - 210;
                this.contentHeight = screenHeight - 100;
                this.contentWidth = screenWidth - 220;
            },
            handleEdit(i,row){
                // 点击tabel的行数索引 i需要加1
                // console.log(i,row);
                const data = this.value[i]
                // console.log(data)
                if (!!data.value) {
                    this.subdata.id = data.id
                    this.subdata.key_name = this.sqldata.filter(v =>v.id === data.id)[0].key_name
                    // this.subdata.item_name = this.tableData[data.value-1].item_name
                    this.subdata.item_name = this.tableData.filter(v =>v.id === data.value-1).item_name
                    this.subdata.item_id = data.value
                    this.subdata.vueid = i
                    
                    this.showAddDeptModal = true
                    this.api.post('subnokeys',this.subdata)
                        .then(res=>{
                        this.$notify({
                            title: '匹配成功',
                            type: 'success'
                        });
                        this.query()
                    })
                    .catch(err=>{
                        this.$notify({
                            title: '匹配失败',
                            type: 'failed'
                        });
                    })
                }else{
                    this.$notify({
                        title: '请选择内容',
                        type: 'failed'
                    });
                    return
                }
                setTimeout(() => {
                    this.submitLoading = false
                    this.showAddDeptModal = false
                }, 1000);
            },
            handleDelete(index,obj){
                // console.log(index,obj.id);
                this.api.post('deletenokeys',{id:obj.id,token:localStorage.token})
                    .then(res=>{
                        // console.log(res)
                        if (res.data.code === 0) {
                            this.$notify({
                                title: '删除成功',
                                type: 'success'
                            });
                            this.query()
                        }else if(res.data.code === 401){
                            vm.$swal({title: "身份认证失效",text: "请重新登录 ！",type:'error',confirmButtonText: '确定',confirmButtonColor:'#409EFF'})
                                .then(res =>{
                                    vm.$store.commit('logout')
                                    location.href = '/#/login'
                                }).catch(err=>{
                                    vm.$store.commit('logout')
                                    location.href = '/#/login'
                                })
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
            current_change(index){
                this.currentPage = index
                this.value = this.sqldata.slice((index-1)*this.pageSize,index*this.pageSize).map((item,i) => {
                            return {value:'',id:item.id};
                        });
                        // console.log(this.value);
                        
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import "../../assets/styl/list.styl";
    .tag:hover{
        cursor:pointer;
    }
</style>