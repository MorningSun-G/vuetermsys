<template>
    <div>
        <el-row>
            <el-col :span="7">
                <el-date-picker
                        v-model="betime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="报销日期（开始）"
                        end-placeholder="报销日期（结束）">
                </el-date-picker>
            </el-col>
            <el-col :span="5">
                <el-select v-model="bstate" style="width: 200px" placeholder="请选择审批类型" clearable>
                    <el-option label="待审批" value="2"></el-option>
                    <el-option label="财务退回" value="4"></el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-col>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="7">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="editBusiness">查看</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="pass">通过</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="sendback">退回</el-button>
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
                height="559px"
                @selection-change="handleSelectionChange"
                style="width: 100%; margin:10px auto 10px">

            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="50">
            </el-table-column>

            <el-table-column
                    prop="bstate"
                    label="状态"
                    width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.bstate == 2" type="info" effect="dark">
                        待审批
                    </el-tag>

                    <el-tag v-if="scope.row.bstate == 4" type="danger" effect="dark">
                        财务退回
                    </el-tag>

                </template>
            </el-table-column>

            <el-table-column
                    prop="bno"
                    label="单据序号"
                    width="80">
            </el-table-column>

            <el-table-column
                    prop="ename"
                    label="姓名"
                    width="70">
            </el-table-column>

            <el-table-column
                    prop="leavetime"
                    label="出发时间"
                    width="150">
            </el-table-column>

            <el-table-column
                    prop="arrivetime"
                    label="返回时间"
                    width="150">
            </el-table-column>

            <el-table-column
                    prop="bdate"
                    label="天数"
                    width="50">
            </el-table-column>

            <el-table-column
                    prop="allowance"
                    label="补助金额"
                    width="80">
            </el-table-column>

            <el-table-column
                    prop="rmbtotal"
                    label="报销金额"
                    width="80">
            </el-table-column>

            <el-table-column
                    prop="btime"
                    label="报销日期"
                    width="150">
            </el-table-column>

            <el-table-column
                    prop="explanation"
                    label="出差事由"
                    width="280">
            </el-table-column>

        </el-table>


        <!--查看 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="查看" :visible.sync="editFormVisible" fullscreen>
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
                                  show-word-limit readonly ></el-input>
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

                    </div>

                    <el-table
                            :data="ticketsCData"
                            height="350px"
                            border
                            style="width: 100%"
                            @row-click="clickRow"
                    >

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
            </div>
        </el-dialog>

        <!-- 查看车票-->
        <el-dialog title="车票查看" :visible.sync="ticketFormVisible" fullscreen>
            <el-row>
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="8">

                    <div style="font-size: 18px ; margin-bottom: 100px ; margin-bottom: 20px" align="left">
                        <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                        车 票 基 本 信 息
                    </div>

                    <el-form :model="ticketForm"  size="medium">
                        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="ename">
                            <el-input v-model="ticketForm.ename" autocomplete="off" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="出差类型" :label-width="formLabelWidth" prop="ttype">
                            <el-select v-model="ticketForm.ttype" placeholder="请选择活动区域"  disabled>
                                <el-option label="出差" value="出差"></el-option>
                                <el-option label="返回" value="返回"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出发地点" :label-width="formLabelWidth" prop="leaveplace">
                            <el-input v-model="ticketForm.leaveplace" autocomplete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="到达地点" :label-width="formLabelWidth" prop="arriveplace">
                            <el-input v-model="ticketForm.arriveplace" autocomplete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="时间" :label-width="formLabelWidth" prop="latime">
                            <el-date-picker
                                    disabled
                                    v-model="ticketForm.latime"
                                    type="datetimerange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="交通工具" :label-width="formLabelWidth" prop="trno">
                            <el-select v-model="ticketForm.trno" disabled>
                                <el-option v-for="transportation in transportationList" :label="transportation.trname" :value="transportation.trno" :key="transportation.trno">

                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车票金额（元）" :label-width="formLabelWidth" prop="tprice" >
                            <el-input v-model="ticketForm.tprice" autocomplete="off" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="2">&nbsp;</el-col>

                <el-col :span="8">
                    <div style="font-size: 18px ; margin-bottom: 50px ;" align="left">
                        <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                        车 票 照 片
                    </div>

                    <el-upload
                            action=""
                            :on-preview="handlePictureCardPreview"
                            class="upload-demo"
                            :file-list="fileList"
                            list-type="picture">
                        <el-button icon="el-icon-upload" type="primary" disabled>点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件</div>
                        <div slot="tip" class="el-upload__tip">文件大小不能超过2MB</div>
                        <div slot="tip" class="el-upload__tip">只能上传一张车票照片（可不上传）</div>
                    </el-upload>
                    <el-col :span="3">&nbsp;</el-col>

                    <el-dialog :visible.sync="dialogVisibleImg" :append-to-body="true">
                        <img width="100%" :src="ImageUrl" alt="">
                    </el-dialog>

                </el-col>
            </el-row>
            <div align="center" style="margin-top: 50px">
                <el-button @click="ticketFormVisible = false">关闭</el-button>
            </div>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "BusinessLCheck",

        data(){
            return{
                businessData:[],//表格数据
                //封装查询条件
                queryMap:{
                    begintime:"",// 开始时间
                    endtime:"",// 结束时间
                    deptno:this.$store.state.deptno,//部门编号
                },
                multipleSelection: [],//表格中选中的数据（对象数组)
                betime:[],// 日期时间选择器 数组
                bstate:"",//未审批  ，  财务退回

                addForm:{
                    ename:"", //员工姓名
                    empno:"",//当前员工编号
                    leavetime:"",//出发时间
                    arrivetime:"",//到达时间
                    bdate:"",//出差天数
                    explanation:"",//出差事由
                    btime:"",// 报销时间
                    allowance:"",//补助总额
                    rmbtotal:"",//报销总额
                    tpricetotal:0,//车票总金额
                },
                //大写报销总额
                rmbtotalCN:"",
                showTag:false, //控制tag的显隐

                // 控制查看对话框的显隐
                editFormVisible: false,
                ticketsCData:[],//被选中车票数据
                rmbData:[],//补助数据

                //单张车票查看
                ticketFormVisible:false,
                ticketForm:{
                    ename:"", //员工姓名
                    empno:this.$store.state.empno,//当前员工编号
                    ttype:"",//出差类型
                    leavetime:"",//出发时间
                    leaveplace:"",//出发地点
                    arrivetime:"",//到达时间
                    arriveplace:"",//到达地点
                    trno:"",// 交通工具
                    tprice:"",// 车票金额
                    latime:[],// 出发时间和到达时间数组
                    tphoto:"",//车票图片
                } ,
                //交通工具信息
                transportationList:[],
                //新增图片的dialog
                ImageUrl: '',
                dialogVisibleImg: false,
                fileList:[],
                formLabelWidth: '120px',


            }
        },

        methods:{
            //获取表格数据
            getBusiness(){
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("leaderCheckBusiness",this.queryMap).then((res) =>{
                    if (this.bstate == ""){
                        this.businessData = res.data;//封装表格数据
                    }else { //选择审批类型
                        this.businessData = [];
                        for (var item of res.data){
                            if (item.bstate == this.bstate){
                                this.businessData.push(item)
                            }
                        }
                    }

                }).catch(() => {
                    this.$message.error("差旅信息请求失败,请联系管理员")
                })
            },

            //点击查询按钮
            search(){
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

            //行单击事件
            clickRow(row){

                let tno = row.tno;
                this.$http.get("getTicketByTno/"+tno).then(res =>{
                    res.data.ename = this.addForm.ename;
                    this.ticketForm = res.data;
                    var latime = [res.data.leavetime,res.data.arrivetime]
                    this.$set(this.ticketForm, "latime",latime)  //给对象增加属性
                    this.ticketFormVisible = true;
                    if (this.ticketForm.tphoto != "" && this.ticketForm.tphoto != null) {
                        this.fileList = [{
                            name:this.ticketForm.tphoto,
                            size:777,
                            response: this.ticketForm.tphoto,
                            url: "http://localhost:8086/" + this.ticketForm.tphoto
                        }]
                    }else {
                        this.fileList = [];
                    }
                })
            },

            //查看图片
            handlePictureCardPreview(file) {
                this.ImageUrl = file.url;
                this.dialogVisibleImg = true;
            },

            //获取全部交通工具
            getTrList(){
                this.$http.get("getAllTransportation").then(res =>{
                    this.transportationList = res.data;
                }).catch(() =>{
                    this.$message.error("交通工具信息获取失败，请联系管理员")
                })
            },


            // 点击通过按钮 提交给财务  bstate 设置为3
            pass(){
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
                }
                var bstate = "3"; //提交给财务
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

            //点击退回按钮
            sendback(){
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
                }
                var bstate = "5"; // 领导退回
                this.$http.get("editBstateByBnos/"+bnos+"/"+bstate).then(res =>{
                    if (res.data == "success"){
                        this.$message({
                            type:"success",
                            message:"退回成功"
                        })
                        //刷新列表
                        this.getBusiness();
                    }else {
                        this.$message.error("退回失败")
                    }
                }).catch(() =>{
                    this.$message.error("退回失败，请联系管理员")
                })
            },



            //点击查看按钮
            editBusiness(){
                //判断是否选中数据
                if (this.multipleSelection.length == 0){
                    this.$message({
                        message:"请选择要查看的数据",
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

                // 重置页面
                this.addForm.ename = ""
                this.addForm.empno = ""
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
                    this.addForm.ename = this.multipleSelection[0].ename//员工姓名
                    this.addForm.empno = this.multipleSelection[0].empno// 员工编号

                }).catch(()=>{
                    this.$message.error("获取差旅信息失败，请联系管理员")
                })

                    // 获取该条差旅信息的  车票信息 和补助信息
                    var tpricetotal = 0;
                    this.$http.get("getTicketsByBno/" + bno).then(res => {
                        this.ticketsCData = res.data
                        //获取tpricetotal 没有她 没法计算补助
                        for (var i = 0; i < res.data.length; i++) {
                            tpricetotal += res.data[i].tprice;
                        }
                        this.addForm.tpricetotal = tpricetotal;  //车票总金额
                        this.getAllowance() //点击计算补助
                    }).catch((rep) => {
                        console.log(rep);
                        this.$message.error("获取车票信息失败，请联系管理员")
                    })

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






            //复选框选中状态改变时，val是选中的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        },
        created() {
            this.getBusiness();
            this.getTrList();
        }

    }
</script>

<style scoped>
    .inputDeep>>>.el-input__inner {
        border: 0;
    }

</style>