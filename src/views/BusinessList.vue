<template>
    <div>
        <el-row>
            <el-col :span="3">
                <el-input
                        placeholder="请输入单据序号"
                        v-model="queryMap.bno"
                        clearable>
                </el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>

            <el-col :span="3">
                <el-date-picker
                        v-model="betime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="报销日期（开始）"
                        end-placeholder="报销日期（结束）">
                </el-date-picker>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="8">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="openAdd">新增</el-button>
                    <el-button type="primary" icon="el-icon-upload2" @click="subBusiness">提交</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="editBusiness">查看/修改</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="delBusiness">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!-- data属性：绑定表格数据
            strip属性:实现表格隔行变色
            selection-change:点击复选框时触发，无论是选中还是取消都会触发
        -->
        <el-table
                :data="businessData"
                stripe
                height="527px"
                @selection-change="handleSelectionChange"
                style="width: 100%; margin:10px auto 10px"
        >

            <el-table-column
                    type="selection"
                    width="60">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="170">
            </el-table-column>
            <el-table-column
                    prop="bno"
                    label="单据序号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="explanation"
                    label="出差事由"
                    width="380">
            </el-table-column>
            <el-table-column
                    prop="rmbtotal"
                    label="报销金额"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="btime"
                    label="报销日期"
                    width="200">
            </el-table-column>

            <el-table-column
                    prop="bstate"
                    label="状态"
                    width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.bstate == 1 " type="info" effect="dark">
                        未提交
                    </el-tag>
                    <el-tag v-if="scope.row.bstate == 2" type="primary" effect="dark">
                        领导审批
                    </el-tag>
                    <el-tag v-if="scope.row.bstate == 3" type="primary" effect="dark">
                        财务审批
                    </el-tag>
                    <el-tag v-if="scope.row.bstate == 4" type="danger" effect="dark">
                        财务退回
                    </el-tag>
                    <el-tag v-if="scope.row.bstate == 5" type="danger" effect="dark">
                        领导退回
                    </el-tag>
                    <el-tag v-if="scope.row.bstate == 6" type="success" effect="dark">
                        审核通过
                    </el-tag>
                </template>
            </el-table-column>



        </el-table>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryMap.page"
                :page-sizes="[5, 10, 20]"
                :page-size="queryMap.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>

        <!--新增功能 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="差旅报销" :visible.sync="addFormVisible" fullscreen>
            <el-descriptions  border  :column="4" :labelStyle="{'width':'100px'}" >
                <el-descriptions-item label="报销人" >
                    {{addForm.ename}}
                </el-descriptions-item>
                <el-descriptions-item label="报销时间"  :contentStyle="{'width':'300px'}">
                    {{addForm.btime}}
                </el-descriptions-item>
                <el-descriptions-item label="出发时间" :contentStyle="{'width':'300px'}">
                    {{addForm.leavetime}}
                </el-descriptions-item>
                <el-descriptions-item label="到达时间" :contentStyle="{'width':'300px'}">
                    {{addForm.arrivetime}}
                </el-descriptions-item>
                <el-descriptions-item label="天数">
                    {{addForm.bdate}}
                </el-descriptions-item>
                <el-descriptions-item label="报销金额">
                    {{addForm.rmbtotal}}
                    <el-tag v-show="showTag">{{this.rmbtotalCN}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="出差事由">
                    <div CLASS="inputDeep">
                        <el-input v-model="addForm.explanation"  autocomplete="off" clearable maxlength="40"
                                  show-word-limit ></el-input>
                    </div>
                </el-descriptions-item>
            </el-descriptions>
            <el-row>

                <el-col :span="12">


                    <div align="left" style="margin: 15px auto 15px ;">
                        <div style="display: inline-block">
                            <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                            差 旅 信 息
                            <span style="font-size: smaller;color: orange">填写格式：济南->目的地...目的地->济南</span>
                        </div>

                        <div  style="display:inline-block;margin-left: 250px">
                            <el-button type="primary" @click="openTicket">选择车票信息</el-button>
                            <el-button type="primary" @click="clearTicket">清空</el-button>
                        </div>
                    </div>


                    <el-table
                            :data="ticketsCData"
                            height="350px"
                            border
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="leaveplace"
                                label="出发地点"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="arriveplace"
                                label="到达地点"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="trname"
                                label="交通工具"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="leavetime"
                                label="出发时间"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="arrivetime"
                                label="到达时间"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="tprice"
                                label="金额"
                                width="80">
                        </el-table-column>
                    </el-table>
                </el-col>

                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="11">

                    <div align="left" style="margin: 15px auto 15px ;">
                        <div style="display: inline-block">
                            <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                            补 助 信 息
                            <span style="font-size: smaller;color: orange">补助标准为50/天</span>
                        </div>

                        <div  style="display:inline-block;margin-left: 400px">
                            <el-button type="primary" @click="getAllowance">计算补助</el-button>
                        </div>
                    </div>

                    <el-table
                            :data="rmbData"
                            height="350px"
                            border
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                        </el-table-column>

                        <el-table-column
                                prop="workplace"
                                label="工作地点"
                                width="120">
                        </el-table-column>

                        <el-table-column
                                prop="begintime"
                                label="起始时间"
                                width="178">
                        </el-table-column>

                        <el-table-column
                                prop="endtime"
                                label="截止时间"
                                width="178">
                        </el-table-column>

                        <el-table-column
                                prop="bdate"
                                label="补助天数"
                                width="78">
                        </el-table-column>
                        <el-table-column
                                prop="allowance"
                                label="补助总额"
                                width="80">
                        </el-table-column>
                    </el-table>
                </el-col>

            </el-row>

            <div align="center" style="margin-top: 30px">
                <el-button @click="addFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveAdd">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="旅程信息选择" :visible.sync="chooseTicketVisible" width="66%">

            <el-table
                    :data="ticketsData"
                    stripe
                    height="300px"
                    @selection-change="handleSelectionChangeT"
                    style="width: 100%; margin:10px auto 10px">

                <el-table-column
                        type="selection"
                        prop="tno"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="ttype"
                        label="类型"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="leaveplace"
                        label="出发地点"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="arriveplace"
                        label="到达地点"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="trname"
                        label="交通工具"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="leavetime"
                        label="出发时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="arrivetime"
                        label="到达时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="tprice"
                        label="金额"
                        width="80">
                </el-table-column>

            </el-table>
            <div align="center" style="margin-top: 30px">
                <el-button @click="chooseTicketVisible = false">关闭</el-button>
                <el-button type="primary" @click="chooseTicket">确定</el-button>
            </div>

        </el-dialog>

        <!--修改功能 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="查看/修改" :visible.sync="editFormVisible" fullscreen>
            <el-descriptions  border  :column="4" :labelStyle="{'width':'100px'}" >
                <el-descriptions-item label="报销人" >
                    {{addForm.ename}}
                </el-descriptions-item>
                <el-descriptions-item label="报销时间"  :contentStyle="{'width':'300px'}">
                    {{addForm.btime}}
                </el-descriptions-item>
                <el-descriptions-item label="出发时间" :contentStyle="{'width':'300px'}">
                    {{addForm.leavetime}}
                </el-descriptions-item>
                <el-descriptions-item label="到达时间" :contentStyle="{'width':'300px'}">
                    {{addForm.arrivetime}}
                </el-descriptions-item>
                <el-descriptions-item label="天数">
                    {{addForm.bdate}}
                </el-descriptions-item>
                <el-descriptions-item label="报销金额">
                    {{addForm.rmbtotal}}
                    <el-tag v-show="showTag">{{this.rmbtotalCN}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="出差事由">
                    <div CLASS="inputDeep">
                        <el-input v-model="addForm.explanation"  autocomplete="off" clearable  maxlength="40"
                                  show-word-limit :readonly="explanationS ? true : false"></el-input>
                    </div>
                </el-descriptions-item>
            </el-descriptions>
            <el-row>

                <el-col :span="12">

                    <div align="left" style="margin: 15px auto 15px ;">
                        <div style="display: inline-block">
                            <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                            差 旅 信 息
                            <span style="font-size: smaller;color: orange">填写格式：济南->目的地...目的地->济南</span>
                        </div>

                        <div  style="display:inline-block;margin-left: 250px">
                            <el-button type="primary" @click="openTicket" :disabled="openTicketS ? true : false">选择车票信息</el-button>
                            <el-button type="primary" @click="clearTicket" :disabled="clearTicketS ? true : false">清空</el-button>
                        </div>
                    </div>

                    <el-table
                            :data="ticketsCData"
                            height="350px"
                            border
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="leaveplace"
                                label="出发地点"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="arriveplace"
                                label="到达地点"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="trname"
                                label="交通工具"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="leavetime"
                                label="出发时间"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="arrivetime"
                                label="到达时间"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="tprice"
                                label="金额"
                                width="80">
                        </el-table-column>
                    </el-table>
                </el-col>

                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="11">

                    <div align="left" style="margin: 15px auto 15px ;">
                        <div style="display: inline-block">
                            <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                            补 助 信 息
                            <span style="font-size: smaller;color: orange">补助标准为50/天</span>
                        </div>

                        <div  style="display:inline-block;margin-left: 400px">
                            <el-button type="primary" @click="getAllowance" :disabled="getAllowanceS ? true : false">计算补助</el-button>
                        </div>
                    </div>

                    <el-table
                            :data="rmbData"
                            height="350px"
                            border
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                        </el-table-column>

                        <el-table-column
                                prop="workplace"
                                label="工作地点"
                                width="120">
                        </el-table-column>

                        <el-table-column
                                prop="begintime"
                                label="起始时间"
                                width="178">
                        </el-table-column>

                        <el-table-column
                                prop="endtime"
                                label="截止时间"
                                width="178">
                        </el-table-column>

                        <el-table-column
                                prop="bdate"
                                label="补助天数"
                                width="78">
                        </el-table-column>
                        <el-table-column
                                prop="allowance"
                                label="补助总额"
                                width="80">
                        </el-table-column>
                    </el-table>
                </el-col>

            </el-row>

            <div align="center" style="margin-top: 30px">
                <el-button @click="editFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveEdit" :disabled="saveEditS ? true : false">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="旅程信息选择" :visible.sync="chooseTicketVisible" width="66%">
            <el-table
                    :data="ticketsData"
                    stripe
                    height="300px"
                    @selection-change="handleSelectionChangeT"
                    style="width: 100%; margin:10px auto 10px">

                <el-table-column
                        type="selection"
                        prop="tno"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="ttype"
                        label="类型"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="leaveplace"
                        label="出发地点"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="arriveplace"
                        label="到达地点"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="trname"
                        label="交通工具"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="leavetime"
                        label="出发时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="arrivetime"
                        label="到达时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="tprice"
                        label="金额"
                        width="80">
                </el-table-column>

            </el-table>
            <div align="center" style="margin-top: 30px">
                <el-button @click="chooseTicketVisible = false">关闭</el-button>
                <el-button type="primary" @click="chooseTicket">确定</el-button>
            </div>

        </el-dialog>


    </div>
</template>

<script>

    export default {
        name: "BusinessList",
        data(){
            return{
                businessData:[],//表格数据
                ticketsData:[],//车票数据
                multipleSelectionT: [],//车票中选中的数据（对象数组)
                ticketsCData:[],//被选中车票数据
                rmbData:[],//补助数据
                //封装查询条件
                queryMap:{
                    bno:"",// 编号
                    begintime:"",// 开始时间
                    endtime:"",// 结束时间
                    empno:this.$store.state.empno,//当前员工编号
                    page:1,//页码
                    limit:5,//每页条数
                },
                total:0,//总条数
                multipleSelection: [],//表格中选中的数据（对象数组)
                betime:[],// 日期时间选择器 数组
                // 控制新增对话框的显隐
                addFormVisible: false,
                formLabelWidth: '120px',
                //控制选择车票对话框的显隐
                chooseTicketVisible:false,
                //新增表单的数据
                addForm:{
                    ename:this.$store.state.ename, //员工姓名
                    empno:this.$store.state.empno,//当前员工编号
                    leavetime:"",//出发时间
                    arrivetime:"",//到达时间
                    bdate:"",//出差天数
                    explanation:"",//出差事由
                    btime:"",// 报销时间
                    allowance:"",//补助总额
                    rmbtotal:"",//报销总额
                    tpricetotal:0,//车票总金额
                    bstate:"1" , //信息所在位置
                },
                //大写报销总额
                rmbtotalCN:"",
                showTag:false, //控制tag的显隐

                // 控制修改对话框的显隐
                editFormVisible: false,

                //控制 功能是否可用
                explanationS:false,
                openTicketS:false,
                clearTicketS:false,
                getAllowanceS:false,
                saveEditS:false,

            }
        },

        methods: {
            //获取表格数据
            getBusiness(){
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("getBusinessList",this.queryMap).then((res) =>{
                    if (res.data.total != null){
                        this.businessData = res.data.data;//封装表格数据
                        this.total = res.data.total; //封装总条数
                    } else {
                        this.$message.error("差旅信息请求失败")
                    }
                }).catch(() => {
                    this.$message.error("差旅信息请求失败,请联系管理员")
                })
            },


            //点击查询按钮
            search(){
                this.queryMap.page = 1; //将页码设置回第一页

                if (this.betime != null) {
                    // 查询时间
                    this.queryMap.begintime = this.betime[0];
                    this.queryMap.endtime = this.betime[1];
                }else {
                    this.queryMap.begintime = ""
                    this.queryMap.endtime = ""
                }

                this.getBusiness()
            },
            //复选框选中状态改变时，val是选中的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //车票复选框选中状态改变时，val是选中的数据
            handleSelectionChangeT(val) {
                this.multipleSelectionT = val;
            },
            //点击删除按钮
            delBusiness(){
                //判断有没有选中数据
                if(this.multipleSelection.length == 0){
                    this.$message({
                        message:"请选中数据",
                        type:"warning"
                    });
                    return;
                }
                //询问是否删除
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { //询问是否删除弹框，点击确定确定按钮
                    let bnos = [] //存放要删除的差旅信息编号
                    //遍历选中项，获取差旅信息编号
                    for (let i = 0;i < this.multipleSelection.length;i++) {
                        bnos.push(this.multipleSelection[i].bno);//将编号存入数组中
                        if (this.multipleSelection[i].bstate != "1" && this.multipleSelection[i].bstate != "5"){
                            this.$message("已经提交的信息不可被删除")
                            return;
                        }
                    }
                    //调用后台执行删除操作
                    this.$http.post("delBusiness",bnos).then((res) =>{
                        if (res.data == "success"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //将页码重置会第一页
                            this.queryMap.page = 1;
                            //刷新表格
                            this.getBusiness();

                            //将车票的bno设置为null
                            this.$http.get("editTicketBnoNull/"+bnos).then(res =>{
                                if (res.data == "error"){
                                    this.$message.error("修改车票的差旅信息失败")
                                }
                            }).catch(() =>{
                                this.$message.error("修改失败，请联系管理员")
                            })
                        } else {
                            this.$message.error("删除失败")
                        }
                    }).catch((res) =>{
                        this.$message.error("删除失败，联系管理员")
                    })
                }).catch(() => { //询问是否删除弹框，点击取消
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            //点击清空按钮 新增页面的
            clearTicket(){
                this.ticketsCData = [];//选中车票数据
                this.rmbData = []; //补助信息数据
                this.addForm.tpricetotal = 0; //车票总金额
                this.addForm.bdate = ""; //天数
                this.addForm.leavetime = ""; //出发时间
                this.addForm.arrivetime = ""; //到达时间
                this.addForm.rmbtotal = ""; // 报销金额
                this.rmbtotalCN = ""; //报销金额大写
                this.showTag = false;//
                this.addForm.explanation="";//出差事由
            },


            //点击 选择车票
            openTicket(){
                if (this.ticketsCData.length != 0){
                    this.$message("如果要重新选择车票，请先点击清空按钮")
                    return;
                }
                //显示 选择旅程信息对话框
                this.chooseTicketVisible = true
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("getTicketByBno/" + this.addForm.empno).then((res) =>{
                    this.ticketsData = res.data
                }).catch(() => {
                    this.$message.error("未关联差旅信息的车票数据请求失败,请联系管理员")
                })
            },

            //点击 确定按钮（选择旅程信息的）
            chooseTicket(){
              //首先拿到选中的数据
                //this.ticketsCData = this.multipleSelectionT

                //选中的数据会根据 选取的顺序排序，这里将选中的数据根据leavetime排序，排序后的就是从出差到返回
                this.multipleSelectionT.sort(function (a,b) {
                    return new Date(a.leavetime).getTime() - new Date(b.leavetime).getTime()
                })

                // 闭环回路 的数据 给到外面 ，不符合要求的就弹窗提示
                var choice = this.multipleSelectionT //选中数据
                var tpricetotal = 0 ; //车票总价格
                for (var i = 0; i < choice.length; i++) {
                    //判断是否从济南开始出差
                    if (choice[0].leaveplace != "山东省/济南市"){
                        this.$message("必须从济南开始出差")
                        return;
                    }

                    //最后一条信息必须是返回
                    if (choice[choice.length - 1].ttype != "返回"){
                        this.$message("最后一条信息必须是返回济南")
                        return;
                    }

                    //上一次的到达地  是下一次的出发地
                    if (i < choice.length - 1)
                        if (choice[i].arriveplace != choice[i + 1].leaveplace){
                            this.$message("请检查出差路线是否为连续的闭合回路")
                            return;
                        }

                    //选择的一组数据中 返回 是最后一条且只有一条
                    if (choice[i].ttype == "返回"){
                        if (i != choice.length - 1){
                            this.$message("一条差旅信息中只能有一条返回")
                            return;
                        }else {
                            //符合规范的数据
                            this.ticketsCData = this.multipleSelectionT
                        }
                    }
                    tpricetotal += this.multipleSelectionT[i].tprice
                }

                //给上方表格赋值
                this.addForm.leavetime = this.ticketsCData[0].leavetime
                this.addForm.arrivetime = this.ticketsCData[this.ticketsCData.length - 1].arrivetime
                this.addForm.tpricetotal = tpricetotal;
                //计算出差天数 在计算补助中计算
                //关闭对话框
                this.chooseTicketVisible = false
            },

            //相隔天数  ，出差地点只有一个时（出->到）
            daysBetweenOne(beginDate,endDate){
                var beginDateArr = beginDate.split(" ");//只取日期
                var endDateArr = endDate.split(" ")
                var date1 = new Date(beginDateArr[0])
                var date2 = new Date(endDateArr[0])
                var days = (date2.getTime()-date1.getTime())/(1000*3600*24)//获得天数
                var beginTimeArr = beginDateArr[1].split(":")
                var endTimeArr = endDateArr[1].split(":")
                var time1 = beginTimeArr[0];
                var time2 = endTimeArr[0];
                //出发时间
                if (time1 < 12){
                    days += 1
                }else {
                    days += 0.5
                }
                //返回时间
                if (time2 < 12){
                    days -= 0.5
                }
                return days;
            },

            //相隔天数  ，出差地点有多个时(出->出 为一个工作地的天数)
            daysBetweenMore(beginDate,endDate){
                var beginDateArr = beginDate.split(" ");//只取日期
                var endDateArr = endDate.split(" ")
                var date1 = new Date(beginDateArr[0])
                var date2 = new Date(endDateArr[0])
                var days = (date2.getTime()-date1.getTime())/(1000*3600*24)//获得天数
                var beginTimeArr = beginDateArr[1].split(":")
                var endTimeArr = endDateArr[1].split(":")
                var time1 = beginTimeArr[0];
                var time2 = endTimeArr[0];
                //出发时间
                if (time1 < 12){
                    days += 1
                }else {
                    days += 0.5
                }
                //返回时间
                if (time2 < 12){
                    days -= 1
                }else {
                    days -= 0.5
                }
                return days;
            },


            //获取当前时间
            getNowDate(){
                var nowTime=new Date();
                var month=nowTime.getMonth()+1;
                var date=nowTime.getDate();
                var hour=nowTime.getHours();
                var minute=nowTime.getMinutes();
                var second=nowTime.getSeconds();
                var seperator1="-"
                var seperator2=":"
                if(month>=1&&month<=9) {
                    month = "0" + month;
                }
                if(date<=9){
                    date="0"+date;
                }
                if (hour<=9){
                    hour = "0"+hour
                }
                if(minute<=9){
                    minute = "0"+minute
                }
                if (second<=9){
                    second = "0"+second
                }
                var nowDate = nowTime.getFullYear()+seperator1+month+seperator1+date+" "+
                    hour+seperator2+minute+seperator2+second;
                return nowDate;
            },

            // 点击新增按钮
            openAdd(){
                //显示新增页面
                this.addFormVisible = true;
                // 重置页面
                this.ticketsCData = [];//选中车票数据
                this.rmbData = []; //补助信息数据
                this.addForm.tpricetotal = 0; //车票总金额
                this.addForm.bdate = ""; //天数
                this.addForm.leavetime = ""; //出发时间
                this.addForm.arrivetime = ""; //到达时间
                this.addForm.rmbtotal = ""; // 报销金额
                this.rmbtotalCN = ""; //报销金额大写
                this.showTag = false;
                this.addForm.explanation="";//出差事由
                //获取当前时间 作为报销时间
                this.addForm.btime = this.getNowDate()

            },

            //点击计算补助按钮
            getAllowance(){

                if (this.addForm.leavetime == ""){
                    this.$message("请先选择车票信息")
                    return;
                }

                if (this.rmbData.length != 0){
                    this.$message("请勿重复计算")
                    return;
                }


                let everyDay = 50; //每天补助金额
                let workplace = "" //工作地点
                let begintime = "" //起始时间
                let endtime = "" //截止时间
                let bdate = 0 //天数
                let allowance = 0 //补助总额
                let bdateT = 0//总出差天数
                let allowanceT = 0//总补助总额

                for (var i = 0; i <= this.ticketsCData.length - 2; i++) {
                    //是否是最后一个出差地
                    if (i == this.ticketsCData.length - 2){
                        workplace = this.ticketsCData[i].arriveplace
                        begintime = this.ticketsCData[i].leavetime
                        endtime = this.ticketsCData[i + 1].arrivetime
                        bdate = this.daysBetweenOne(begintime, endtime)
                        allowance = bdate * everyDay //补助金额
                    } else {
                        workplace = this.ticketsCData[i].arriveplace
                        begintime = this.ticketsCData[i].leavetime
                        endtime = this.ticketsCData[i + 1].leavetime
                        bdate = this.daysBetweenMore(begintime, endtime)
                        allowance = bdate * everyDay //补助金额
                    }
                    //总天数  总补助金额
                    bdateT += bdate
                    allowanceT += allowance
                    //表格中展示数据
                    this.rmbData.push({
                        "workplace": workplace,
                        "begintime": begintime,
                        "endtime": endtime,
                        "bdate": bdate,
                        "allowance": allowance
                    })
                }

                //报销总金额
                this.addForm.bdate = bdateT
                this.addForm.allowance = allowanceT // 补助金额
                this.addForm.rmbtotal = this.addForm.tpricetotal + this.addForm.allowance
                this.rmbtotalCN = this.convertCurrency(this.addForm.rmbtotal)
                this.showTag = true; //显示tag

            },


            //点击保存按钮
            saveAdd(){

                if (this.addForm.explanation == null || this.addForm.explanation == ""){
                    this.$message("请填写出差事由")
                    return ;
                }

                if (this.addForm.rmbtotal != null && this.addForm.rmbtotal != "") {
                    //验证通过执行保存
                    this.$http.post('addBusiness',this.addForm).then(res => {
                        if (res.data != "error"){
                            this.$message({
                                type:"success",
                                message:"新增成功"
                            })
                            //关闭弹窗
                            this.addFormVisible =false;
                            //刷新列表
                            this.getBusiness();
                            //刚刚插入的数据的编号
                            var bno = res.data
                            var tnos = [] //车票编号
                            for (var i = 0; i < this.ticketsCData.length; i++) {
                                tnos.push(this.ticketsCData[i].tno)
                            }
                            this.$http.get("editTicketBno/"+tnos+"/"+bno).then(res =>{
                                if (res.data == "error"){
                                    this.$message.error("修改车票的差旅信息失败")
                                }
                            }).catch(() =>{
                                this.$message.error("修改车票的差旅信息失败，请联系管理员")
                            })

                            //车票列表显示的出差说明是取自差旅信息表的出差说明
                            var explanation = this.addForm.explanation
                            this.$http.get("editTicketExplanation/"+tnos+"/"+explanation).then(res =>{
                                if (res.data == "error"){
                                    this.$message.error("修改车票的出差事由失败")
                                }
                            }).catch(() =>{
                                this.$message.error("修改车票的出差事由失败，请联系管理员")
                            })

                        }else {
                            this.$message.error("新增失败")
                        }
                    }).catch(() =>{
                        this.$message.error("新增失败，请联系管理员")
                    })
                } else {
                    this.$message("请先计算补助")
                    return false;
                }
            },

            //点击提交按钮 （根据bno将bstate 设置为2）
            subBusiness(){
                if(this.multipleSelection.length == 0){
                    this.$message({
                        message:"请选中数据",
                        type:"warning"
                    });
                    return;
                }
                var bnos = []
                //遍历选中项，获取差旅信息编号
                for (var i = 0;i < this.multipleSelection.length;i++) {
                    bnos.push(this.multipleSelection[i].bno);//将编号存入数组中
                    if (this.multipleSelection[i].bstate != "1" && this.multipleSelection[i].bstate != "5"){
                        this.$message("请勿重复提交")
                        return;
                    }
                }
                var bstate = "2"; //提交给领导
                this.$http.get("editBstateByBnos/"+bnos+"/"+bstate).then(res =>{
                    if (res.data == "success"){
                        this.$message({
                            type:"success",
                            message:"提交成功"
                        })
                        //刷新列表
                        this.getBusiness();
                    }else {
                        this.$message.error("提交失败")
                    }
                }).catch(() =>{
                    this.$message.error("提交失败，请联系管理员")
                })
            },

            //点击修改按钮
            editBusiness(){
                //判断是否选中数据
                if (this.multipleSelection.length == 0){
                    this.$message({
                        message:"请选择要修改的数据",
                        type:"warning"
                    });
                    return;
                } else if (this.multipleSelection.length > 1){
                    this.$message({
                        message:"请选择一条数据",
                        type:"warning"
                    });
                    return;
                }

                //如果已经提交就不能修改了，被退回的可以修改
                if (this.multipleSelection[0].bstate != "1" && this.multipleSelection[0].bstate != "5"){
                    //控制 功能是否可用
                    this.explanationS = true;
                    this.openTicketS = true;
                    this.clearTicketS = true;
                    this.getAllowanceS = true;
                    this.saveEditS = true;
                } else {
                    this.explanationS = false;
                    this.openTicketS = false;
                    this.clearTicketS = false;
                    this.getAllowanceS = false;
                    this.saveEditS = false;
                }

                // 重置页面
                this.ticketsCData = [];//选中车票数据
                this.rmbData = []; //补助信息数据
                this.addForm.bdate = ""; //天数
                this.addForm.leavetime = ""; //出发时间
                this.addForm.arrivetime = ""; //到达时间
                this.addForm.tpricetotal = 0; //车票总金额
                this.addForm.rmbtotal = ""; // 报销金额
                this.rmbtotalCN = ""; //报销金额大写
                this.showTag = false;
                this.addForm.explanation="";//出差事由
                this.addForm.btime = "";//报销时间

                //显示修改页面
                this.editFormVisible = true;

                //获取选中的business
                var bno = this.multipleSelection[0].bno;
                this.$http.get("getBusinessByBno/"+bno).then(res =>{
                    this.addForm = res.data;
                    this.addForm.ename = this.$store.state.ename//员工姓名
                    this.addForm.empno = this.$store.state.empno // 员工编号
                }).catch(()=>{
                    this.$message.error("获取差旅信息失败，请联系管理员")
                })

                // 获取该条差旅信息的  车票信息 和补助信息
                var tpricetotal = 0;
                this.$http.get("getTicketsByBno/"+bno).then(res =>{
                    this.ticketsCData = res.data
                    //获取tpricetotal 没有她 没法计算补助
                    for (var i = 0; i < res.data.length; i++) {
                        tpricetotal += res.data[i].tprice;
                    }
                    this.addForm.tpricetotal = tpricetotal;  //车票总金额
                    this.getAllowance() //点击计算补助
                }).catch(()=>{
                    this.$message.error("获取车票信息失败，请联系管理员")
                })

            },

            //点击修改页面的保存按钮
            saveEdit(){

                if (this.addForm.explanation == null || this.addForm.explanation == ""){
                    this.$message("请填写出差事由")
                    return ;
                }

                if (this.addForm.rmbtotal != null && this.addForm.rmbtotal != "") {
                    //获取当前时间 作为报销时间
                    this.addForm.btime = this.getNowDate()
                    //验证通过执行保存
                    this.$http.post('editBusiness',this.addForm).then(res => {
                        if (res.data = "success"){
                            this.$message({
                                type:"success",
                                message:"修改成功"
                            })
                            //关闭弹窗
                            this.editFormVisible =false;
                            //刷新列表
                            this.getBusiness();

                            var tnos = [] //车票编号
                            for (var i = 0; i < this.ticketsCData.length; i++) {
                                tnos.push(this.ticketsCData[i].tno)
                            }
                            //车票列表显示的出差说明是取自差旅信息表的出差说明
                            var explanation = this.addForm.explanation
                            this.$http.get("editTicketExplanation/"+tnos+"/"+explanation).then(res =>{
                                if (res.data == "error"){
                                    this.$message.error("修改车票的出差事由失败")
                                }
                            }).catch(() =>{
                                this.$message.error("修改车票的出差事由失败，请联系管理员")
                            })

                        }else {
                            this.$message.error("修改失败")
                        }
                    }).catch(() =>{
                        this.$message.error("修改失败，请联系管理员")
                    })
                } else {
                    this.$message("请先计算补助")
                    return false;
                }
            },



            //每页条数改变时，参数val是改变后的每页条数
            handleSizeChange(val) {
                /*console.log(`每页 ${val} 条`);*/
                this.queryMap.limit = val;//设置新的每页条数
                this.queryMap.page = 1; //将页码设置回第一页
                this.getBusiness()
            },
            //页码改变时，参数val是改变后的页码
            handleCurrentChange(val) {
                /*console.log(`当前页: ${val}`);*/
                this.queryMap.page = val;//设置新的页码
                this.getBusiness()
            },

            //金额转大写
            convertCurrency(money) {
                //汉字的数字
                var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
                //基本单位
                var cnIntRadice = new Array('', '拾', '佰', '仟');
                //对应整数部分扩展单位
                var cnIntUnits = new Array('', '万', '亿', '兆');
                //对应小数部分单位
                var cnDecUnits = new Array('角', '分', '毫', '厘');
                //整数金额时后面跟的字符
                var cnInteger = '整';
                //整型完以后的单位
                var cnIntLast = '元';
                //最大处理的数字
                var maxNum = 999999999999999.9999;
                //金额整数部分
                var integerNum;
                //金额小数部分
                var decimalNum;
                //输出的中文金额字符串
                var chineseStr = '';
                //分离金额后用的数组，预定义
                var parts;
                if (money == '') { return ''; }
                money = parseFloat(money);
                if (money >= maxNum) {
                    //超出最大处理数字
                    return '';
                }
                if (money == 0) {
                    chineseStr = cnNums[0] + cnIntLast + cnInteger;
                    return chineseStr;
                }
                //转换为字符串
                money = money.toString();
                if (money.indexOf('.') == -1) {
                    integerNum = money;
                    decimalNum = '';
                } else {
                    parts = money.split('.');
                    integerNum = parts[0];
                    decimalNum = parts[1].substr(0, 4);
                }
                //获取整型部分转换
                if (parseInt(integerNum, 10) > 0) {
                    var zeroCount = 0;
                    var IntLen = integerNum.length;
                    for (var i = 0; i < IntLen; i++) {
                        var n = integerNum.substr(i, 1);
                        var p = IntLen - i - 1;
                        var q = p / 4;
                        var m = p % 4;
                        if (n == '0') {
                            zeroCount++;
                        } else {
                            if (zeroCount > 0) {
                                chineseStr += cnNums[0];
                            }
                            //归零
                            zeroCount = 0;
                            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                        }
                        if (m == 0 && zeroCount < 4) {
                            chineseStr += cnIntUnits[q];
                        }
                    }
                    chineseStr += cnIntLast;
                }
                //小数部分
                if (decimalNum != '') {
                    var decLen = decimalNum.length;
                    for (var i = 0; i < decLen; i++) {
                        var n = decimalNum.substr(i, 1);
                        if (n != '0') {
                            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                        }
                    }
                }
                if (chineseStr == '') {
                    chineseStr += cnNums[0] + cnIntLast + cnInteger;
                } else if (decimalNum == '') {
                    chineseStr += cnInteger;
                }
                return chineseStr;
            },



        },
        created() {
            this.getBusiness();
        }
    }
</script>

<style scoped>
    .inputDeep>>>.el-input__inner {
        border: 0;
    }
</style>