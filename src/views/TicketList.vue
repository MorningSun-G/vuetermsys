<template>
    <div>
        <el-row>
            <el-col :span="3">
                <el-date-picker
                        v-model="queryMap.leavetime"
                        type="datetime"
                        style="width: 200px"
                        :editable="false"
                        placeholder="请选择开始日期时间">
                </el-date-picker>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>

            <el-col :span="3">
                <el-cascader
                        v-model="searchLeavePlace"
                        :options="cityOptions"
                        filterable
                        clearable
                        placeholder="请选择出发地点"
                        @change="handleChangeS1">
                </el-cascader>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
                <el-cascader
                        v-model="searchArrivePlace"
                        :options="cityOptions"
                        filterable
                        clearable
                        placeholder="请选择到达地点"
                        @change="handleChangeS2">
                </el-cascader>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-col>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="6">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="openAdd">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="openEdit">修改</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="delTicket">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!-- data属性：绑定表格数据
            strip属性:实现表格隔行变色
            selection-change:点击复选框时触发，无论是选中还是取消都会触发
        -->
        <el-table
                :data="ticketsData"
                stripe
                height="527px"
                @selection-change="handleSelectionChange"
                style="width: 100%; margin:10px auto 10px"
        >
            <!--  type属性： 值为selection显示为复选框
                        值为index显示为序号-->
            <!-- 字符长度固定居中显示
                 字符长度不固定居左显示
                 数值居右显示
                -->
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
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="arrivetime"
                    label="到达时间"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="tprice"
                    label="金额"
                    width="80">
            </el-table-column>

            <el-table-column
                    prop="tphoto"
                    label="照片"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="explanation"
                    label="出差说明"
                    width="250">
            </el-table-column>

            <el-table-column
                    prop="bno"
                    label="差旅信息"
                    width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.bno == null " type="info" effect="dark">
                        未关联
                    </el-tag>
                    <el-tag v-if="scope.row.bno != null" type="primary" effect="dark">
                        已关联{{scope.row.bno}}
                    </el-tag>
                </template>
            </el-table-column>

        </el-table>
        <!--  size-change;每页条数改变时触发
            current-change：页码改变时触发
            :current-page  当前页
            :page-sizes   可选择的每页条数
            :page-size   默认每页条数
            total  总条数
        -->
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
        <el-dialog title="出差情况登记" :visible.sync="addFormVisible" fullscreen>
            <el-row>
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="8">

                    <div style="font-size: 18px ; margin-bottom: 100px ; margin-bottom: 20px" align="left">
                        <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                        车 票 基 本 信 息
                    </div>

                    <el-form :model="addForm" :rules="rules" ref="addFormRef" size="medium">
                        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="ename">
                            <el-input v-model="addForm.ename" autocomplete="off" readonly  style="width: 380px"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" :label-width="formLabelWidth" prop="ttype" >
                            <el-select v-model="addForm.ttype" placeholder="请选择类型" :disabled="ttypeStatus ? true : false" @change="optPlace" style="width: 380px">
                                <el-option label="出差" value="出差"></el-option>
                                <el-option label="返回" value="返回"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出发地点" :label-width="formLabelWidth" prop="leaveplace" >
                            <el-cascader
                                    style="width: 380px"
                                    v-model="addLeavePlace"
                                    :options="cityOptions"
                                    filterable
                                    :disabled="leaveplaceStatus ? true : false"
                                    @change="handleChange1">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="到达地点" :label-width="formLabelWidth" prop="arriveplace">
                            <el-cascader
                                    style="width: 380px"
                                    v-model="addArrivePlace"
                                    :options="cityOptions"
                                    filterable
                                    :disabled="arriveplaceStatus ? true : false"
                                    @change="handleChange2">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="时间" :label-width="formLabelWidth" prop="latime">
                            <el-date-picker
                                    style="width: 380px"
                                    v-model="addForm.latime"
                                    type="datetimerange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="交通工具" :label-width="formLabelWidth" prop="trno">
                            <el-select v-model="addForm.trno" style="width: 380px">
                                <el-option v-for="transportation in transportationList" :label="transportation.trname" :value="transportation.trno" :key="transportation.trno">

                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车票金额" :label-width="formLabelWidth" prop="tprice">
                            <el-input v-model="addForm.tprice" autocomplete="off" style="width: 380px"></el-input>
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
                            class="upload-demo"
                            action="http://localhost:8086/uploadFile"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success="handleAvatarSuccess"
                            :on-exceed="handleExceed"
                            :limit="1"
                            list-type="picture">
                        <el-button icon="el-icon-upload" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件</div>
                        <div slot="tip" class="el-upload__tip">文件大小不能超过2MB</div>
                        <div slot="tip" class="el-upload__tip">只能上传一张车票照片（可不上传）</div>
                    </el-upload>
                </el-col>
                <el-col :span="3">&nbsp;</el-col>

                <el-dialog :visible.sync="dialogVisibleImg" :append-to-body="true">
                    <img width="100%" :src="ImageUrl" alt="">
                </el-dialog>


            </el-row>
            <div align="center" style="margin-top: 50px">
                <el-button @click="addFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveAdd">保存</el-button>
            </div>
        </el-dialog>

        <!--修改功能 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="出差情况修改" :visible.sync="editFormVisible" fullscreen>
            <el-row>
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="8">

                    <div style="font-size: 18px ; margin-bottom: 100px ; margin-bottom: 20px" align="left">
                        <span style="background-color: dodgerblue;width: 5px">&nbsp;</span>
                        车 票 基 本 信 息
                    </div>

                    <el-form :model="editForm" :rules="rules" ref="editFormRef" size="medium">
                        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="ename">
                            <el-input v-model="editForm.ename" autocomplete="off" readonly style="width: 380px"></el-input>
                        </el-form-item>
                        <el-form-item label="出差类型" :label-width="formLabelWidth" prop="ttype">
                            <el-select v-model="editForm.ttype" placeholder="请选择活动区域" @click="optPlace" disabled style="width: 380px">
                                <el-option label="出差" value="出差"></el-option>
                                <el-option label="返回" value="返回"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出发地点" :label-width="formLabelWidth" prop="leaveplace">
                            <el-input v-model="editForm.leaveplace" autocomplete="off" disabled style="width: 380px"></el-input>
                        </el-form-item>
                        <el-form-item label="到达地点" :label-width="formLabelWidth" prop="arriveplace">
                            <el-input v-model="editForm.arriveplace" autocomplete="off" disabled style="width: 380px"></el-input>
                        </el-form-item>
                        <el-form-item label="时间" :label-width="formLabelWidth" prop="latime">
                            <el-date-picker
                                    style="width: 380px"
                                    v-model="editForm.latime"
                                    type="datetimerange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="交通工具" :label-width="formLabelWidth" prop="trno">
                            <el-select v-model="editForm.trno" style="width: 380px">
                                <el-option v-for="transportation in transportationList" :label="transportation.trname" :value="transportation.trno" :key="transportation.trno">

                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车票金额（元）" :label-width="formLabelWidth" prop="tprice">
                            <el-input v-model="editForm.tprice" autocomplete="off" style="width: 380px"></el-input>
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
                            class="upload-demo"
                            action="http://localhost:8086/uploadFile"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success="handleAvatarSuccess"
                            :on-exceed="handleExceed"
                            :limit="1"
                            list-type="picture">
                        <el-button icon="el-icon-upload" type="primary">点击上传</el-button>
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
                <el-button @click="editFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveEdit">保存</el-button>
            </div>
        </el-dialog>



    </div>
</template>

<script>
    import { provinceAndCityData,CodeToText, TextToCode } from 'element-china-area-data'
    export default {
        name: "TicketList",
        data(){
            return{
                //修改的车票图片
                //新增图片的dialog
                ImageUrl: '',
                dialogVisibleImg: false,
                fileList:[],

                ticketsData:[],//表格数据
                //封装查询条件
                queryMap:{
                    leavetime:"",//查询框中的数据
                    leaveplace:"",//查询框中的数据
                    arriveplace:"",//查询框中的数据
                    empno:this.$store.state.empno,//当前员工编号
                    page:1,//页码
                    limit:5,//每页条数
                },
                total:0,//总条数
                multipleSelection: [],//表格中选中的数据（对象数组)
                // 控制新增对话框的显隐
                addFormVisible: false,
                formLabelWidth: '120px',
                //新增表单的数据
                addForm:{
                    ename:this.$store.state.ename, //员工姓名
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
                },
                //add 表单验证规则
                rules: {
                    ttype: [
                        {required: true, message: '请输入选择出差类型', trigger: 'change'},
                    ],
                    leaveplace: [
                        {required: true, message: '请选择出发地点', trigger: 'blur'},
                    ],
                    arriveplace: [
                        {required: true, message: '请选择到达地点', trigger: 'blur'},
                    ],
                    latime: [
                        {required: true, message: '请选择出发时间和到达时间', trigger: 'blur'},
                    ],
                    trno: [
                        {required: true, message: '请选择交通工具', trigger: 'blur'},
                    ],
                    tprice: [
                        {required: true, message: '请输入车票金额', trigger: 'blur'},
                        {pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/,
                            message: "请输入合法的金额数字（0-9999），最多两位小数", trigger: "blur"}
                    ],
                },

                editFormVisible:false,
                editForm:{
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

                //省市区联动下拉框
                cityOptions:provinceAndCityData ,
                addLeavePlace:[], // add页面的出发地点选择
                addArrivePlace:[],//add页面的到达地点选择
                searchLeavePlace:[], // 查询的出发地点选择
                searchArrivePlace:[],//查询的到达地点选择

                //上一条车票信息
                previousTicket:{},
                ttypeStatus:"",//add页面  类型disabled属性
                leaveplaceStatus:"",//add页面  出发地点disabled属性
                arriveplaceStatus:"",//add页面  到达地点设置 disabled属性
            }
        },

        methods: {

            handleAvatarSuccess(res) {
                this.addForm.tphoto = res
                this.editForm.tphoto = res
            },
            handleRemove(file) {
                const isType = file.name.split('.')[1] === 'png' || file.name.split('.')[1] === 'jpeg' || file.name.split('.')[1] === 'jpg'
                const isLt2M = file.size / 1024 / 1024 < 2;  // 文件大小是否小于2M
                if (!isType || !isLt2M) {
                    return false;
                }
                    //删除服务器上的图片
                    var fileName = file.response
                    this.$http.post("delFile", fileName).then((res) => {
                        if (res.data == "success") {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //删除addform中的tphoto
                            this.addForm.tphoto = ""
                            this.editForm.tphoto = ""

                        } else {
                            this.$message.error("删除失败")
                        }
                    }).catch((res) => {
                        this.$message.error("删除失败，联系管理员")
                    })
            },
            handlePictureCardPreview(file) {
                this.ImageUrl = file.url;
                this.dialogVisibleImg = true;
            },

            beforeAvatarUpload(file) {
                return new Promise((resolve, reject) => {
                    const extension1 = file.name.split(".")[1] === "jpeg"; // 是否以jpeg为后缀
                    const extension2 = file.name.split(".")[1] === "jpg"; // 是否以jpg为后缀
                    const extension3 = file.name.split(".")[1] === "png"; // 是否以png为后缀
                    const isLt2M = file.size / 1024 / 1024 < 2;  // 文件大小是否小于2M
                    if (!(extension1 || extension2 || extension3)) {
                        this.$message.error("上传文件的格式只能是jpeg/jpg/png！！！");
                        return reject(false);
                    }else if (!isLt2M) {
                        this.$message.error("上传文件大小不能超过2MB！！！");
                        return reject(false);
                    }else {
                        resolve(true);
                    }
                })
            },
            // 文件超出个数限制
            handleExceed(){
                this.$message.warning("超出文件个数限制！！！");
            },


            //获取表格数据
            getTickets(){
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("getTicketList",this.queryMap).then((res) =>{
                    if (res.data.total != null){
                        //当有车票照片时 显示有   没有时显示无
                        for (var i = 0; i <res.data.data.length ; i++) {
                            var tphoto = res.data.data[i].tphoto;
                            if (tphoto != null && tphoto != ""){
                                res.data.data[i].tphoto = "有"
                            }else {
                                res.data.data[i].tphoto = "无"
                            }
                        }
                        this.ticketsData = res.data.data;//封装表格数据
                        this.total = res.data.total; //封装总条数
                    } else {
                        this.$message.error("车票数据请求失败")
                    }
                }).catch(() => {
                    this.$message.error("车票数据请求失败,请联系管理员")
                })
            },
            //点击查询按钮
            search(){
                this.queryMap.page = 1; //将页码设置回第一页
                this.getTickets()
            },
            //复选框选中状态改变时，val是选中的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //点击删除按钮
            delTicket(){
                //判断有没有选中数据
                if(this.multipleSelection.length == 0){
                    this.$message({
                        message:"请选中数据",
                        type:"warning"
                    });
                    return;
                }
                //如果车票已经关联了差旅信息，那么不可以修改
                if (this.multipleSelection[0].bno != null && this.multipleSelection[0].bno != ""){
                    this.$message({
                        message:"该车票已经关联了差旅信息，不可删除",
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
                    let tnos = [] //存放要删除的车票
                    //遍历选中项，获取车票编号
                    for (let i = 0;i < this.multipleSelection.length;i++) {
                        tnos.push(this.multipleSelection[i].tno);//将编号存入数组中
                    }
                    //删除照片
                    this.$http.post("delFiles",tnos).then((res) =>{
                        if (res.data == "success"){

                        } else {
                            this.$message.error("车票照片删除失败")
                        }
                    }).catch((res) =>{
                        this.$message.error("车票照片删除失败，联系管理员")
                    })


                    //调用后台执行删除操作
                    this.$http.post("delTicket",tnos).then((res) =>{
                        if (res.data == "success"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //将页码重置会第一页
                            this.queryMap.page = 1;
                            //刷新表格
                            this.getTickets();
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

            // 点击新增按钮
            openAdd(){

                //显示新增页面
                this.addFormVisible = true;
                this.addLeavePlace = [] //出发地选择重置
                this.addArrivePlace = [] //到达地选择重置

                //解除disabled
                this.ttypeStatus = false //类型可以操作
                this.arriveplaceStatus = false //到达地可以操作
                this.leaveplaceStatus = false //出发地可以操作

                //判断如果 上一条是返回 ，那么这次新增必须是出差，出发地必须是山东省济南市
                this.getTtype();

                //重置表单
                this.$refs['addFormRef'].resetFields();
                this.addForm.tphoto = ""
                this.fileList = [];

            },
            //点击保存按钮
            saveAdd(){
                this.$refs['addFormRef'].validate((valid) => {
                    if (valid) {
                        //保证本次的出发时间要大于上一次的到达时间 上一次是返回信息除外
                         this.$http.get("getPreviousTicket/"+this.queryMap.empno).then(res =>{
                            if (res.data.ttype == "出差" && res.data.arrivetime > this.addForm.latime[0]){
                                    this.$message("出发时间要大于上一次的到达时间（" + res.data.arrivetime + ")")
                                    return;
                            }else {
                                //执行保存
                                //将 latime 中的时间 存入 addForm 中
                                this.addForm.leavetime = this.addForm.latime[0]
                                this.addForm.arrivetime = this.addForm.latime[1]

                                //金额 保留两位小数，不够补0
                                var arrayNum = this.addForm.tprice.toString().split(".")  //根据.划分
                                if ( arrayNum.length == 1) {
                                    this.addForm.tprice = this.addForm.tprice.toString() + '.00'
                                }else if (arrayNum.length == 2){
                                    this.addForm.tprice = this.addForm.tprice.toString() + '0'
                                }

                                //验证通过执行保存
                                this.$http.post('addTicket',this.addForm).then(res => {
                                    if (res.data == "success"){
                                        this.$message({
                                            type:"success",
                                            message:"新增成功"
                                        })
                                        //关闭弹窗
                                        this.addFormVisible =false;
                                        //刷新列表
                                        this.getTickets();

                                        //重置表单
                                        this.$refs['addFormRef'].resetFields();
                                    }else {
                                        this.$message.error("新增失败")
                                    }
                                }).catch(() =>{
                                    this.$message.error("新增失败，请联系管理员")
                                })
                            }
                        }).catch(()=>{
                            this.$message.error("获取上一条数据失败，请联系管理员")
                        })

                    } else {
                        return false;
                    }
                });
            },

            //点击修改按钮
            openEdit(){
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

                //如果车票已经关联了差旅信息，那么不可以修改
                if (this.multipleSelection[0].bno != null && this.multipleSelection[0].bno != ""){
                    this.$message({
                        message:"该车票已经关联了差旅信息，不可修改",
                        type:"warning"
                    });
                    return;
                }

                let tno = this.multipleSelection[0].tno;
                this.$http.get("getTicketByTno/"+tno).then(res =>{
                    res.data.ename = this.$store.state.ename  //员工姓名
                    this.editForm = res.data;
                    var latime = [res.data.leavetime,res.data.arrivetime]
                    this.$set(this.editForm, "latime",latime)  //给对象增加属性
                    this.editFormVisible = true;
                    if (this.editForm.tphoto != "" && this.editForm.tphoto != null) {
                        this.fileList = [{
                            name:this.editForm.tphoto,
                            size:777,
                            response: this.editForm.tphoto,
                            url: "http://localhost:8086/" + this.editForm.tphoto
                        }]
                    }else {
                        this.fileList = [];
                    }
                    //重置表单
                    this.$refs['editFormRef'].resetFields();
                })

            },
            //点击修改页面的 保存按钮
            saveEdit(){
                //触发验证效果
                this.$refs['editFormRef'].validate((valid) => {
                    if (valid) {
                        this.editForm.leavetime = this.editForm.latime[0]
                        this.editForm.arrivetime = this.editForm.latime[1]
                        //验证通过执行保存
                        this.$http.post('editTicket',this.editForm).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"修改成功"
                                })
                                //关闭弹窗
                                this.editFormVisible =false;
                                //刷新列表
                                this.getTickets();
                                //重置表单
                                this.$refs['editFormRef'].resetFields();
                                this.fileList = [];

                            }else {
                                this.$message.error("修改失败")
                            }
                        }).catch(() =>{
                            this.$message.error("修改失败，请联系管理员")
                        })
                    } else {
                        return false;
                    }
                });
            },

            //获取全部交通工具
            getTrList(){
                this.$http.get("getAllTransportation").then(res =>{
                    this.transportationList = res.data;
                }).catch(() =>{
                    this.$message.error("交通工具信息获取失败，请联系管理员")
                })
            },

            // 获取上一条车票信息
            getPreviousTicket(){
                this.$http.get("getPreviousTicket/"+this.queryMap.empno).then(res =>{
                    this.previousTicket = res.data;
                }).catch(() =>{
                    this.$message("您还没有车票信息")
                })
            },

            //通过上一条车票信息  作出相应的操作
            //上一条类型是 返回， 那么下一条为出差
            getTtype(){
                this.$http.get("getPreviousTicket/"+ this.queryMap.empno).then(res =>{
                    if (res.data.ttype == "返回"){
                        this.addForm.ttype = "出差"
                        this.ttypeStatus = true; //类型不可选
                        //出发地改为 山东省济南市 且只读
                        var p = TextToCode['山东省'].code
                        var c = TextToCode['山东省']['济南市'].code
                        this.addLeavePlace.push(p)
                        this.addLeavePlace.push(c)
                        this.leaveplaceStatus = true
                        this.addForm.leaveplace="山东省/济南市"
                    }else if (res.data == ""){
                        //qweqweqwe
                    }
                    else {
                        this.ttypeStatus = false; //类型可选
                        this.leaveplaceStatus = false;
                        this.addForm.ttype = ""
                        this.addForm.leaveplace=""
                    }

                }).catch(() =>{
                    this.$message("您还没有车票信息")

                })

            },
            //点击选择出差 出发地是上一条数据的到达地
            //点击选择返回 出发地是上一条数据的到达地  返回地是山东省济南市
            optPlace(){
                this.$http.get("getPreviousTicket/"+this.queryMap.empno).then(res =>{

                    if (this.addForm.ttype == "出差"){
                        var cp = res.data.arriveplace.split('/');
                        var tp = cp[0]
                        var tc = cp[1]
                        this.addLeavePlace.push(TextToCode[tp].code)
                        this.addLeavePlace.push(TextToCode[tp][tc].code)
                        this.addForm.leaveplace=res.data.arriveplace
                        this.leaveplaceStatus = true //出发地禁止操作
                        this.arriveplaceStatus = false //到达地可以操作
                        this.addArrivePlace = [] //到达地设为空
                        this.addForm.arriveplace=""

                    }else if (this.addForm.ttype == "返回"){
                        var cp = res.data.arriveplace.split('/');
                        var tp = cp[0]
                        var tc = cp[1]
                        this.addLeavePlace.push(TextToCode[tp].code)
                        this.addLeavePlace.push(TextToCode[tp][tc].code)
                        this.addForm.leaveplace=res.data.arriveplace
                        this.leaveplaceStatus = true //禁止操作
                        //到达地改为 山东省济南市 且只读
                        var p = TextToCode['山东省'].code
                        var c = TextToCode['山东省']['济南市'].code
                        this.addArrivePlace = [] //到达地设为空
                        this.addArrivePlace.push(p)
                        this.addArrivePlace.push(c)
                        this.addForm.arriveplace="山东省/济南市"
                        this.arriveplaceStatus = true
                    }

                }).catch(() =>{
                    this.$message("您还没有车票信息，所以此次只能选择出差")
                    //第一次出差 ，没有上一条车票信息，所以只能出差
                    this.addForm.ttype = "出差"
                    this.ttypeStatus = true; //类型不可选
                    //出发地改为 山东省济南市 且只读
                    var p = TextToCode['山东省'].code
                    var c = TextToCode['山东省']['济南市'].code
                    this.addLeavePlace.push(p)
                    this.addLeavePlace.push(c)
                    this.leaveplaceStatus = true
                    this.addForm.leaveplace="山东省/济南市"
                })
            },



            //将add页面出发地点选择的城市 放入 addForm.leaveplace
            handleChange1(value) {
                var p = CodeToText[this.addLeavePlace[0]]
                var c = CodeToText[this.addLeavePlace[1]]
                this.addForm.leaveplace = p + "/" + c
            },
            //将add页面到达地点选择的城市 放入 addForm.arriveplace
            handleChange2(value) {
                var p = CodeToText[this.addArrivePlace[0]]
                var c = CodeToText[this.addArrivePlace[1]]
                this.addForm.arriveplace = p + "/" + c
            },

            //将查询 出发地点选择的城市 放入 queryMap.leaveplace
            handleChangeS1(value) {
                if (value.length != 0){
                    var p = CodeToText[this.searchLeavePlace[0]]
                    var c = CodeToText[this.searchLeavePlace[1]]
                    this.queryMap.leaveplace = p + "/" + c
                }else {
                    this.queryMap.leaveplace = ""
                }
            },
            //将查询 到达地点选择的城市 放入 queryMap.arriveplace
            handleChangeS2(value) {
                if (value.length != 0) {
                    var p = CodeToText[this.searchArrivePlace[0]]
                    var c = CodeToText[this.searchArrivePlace[1]]
                    this.queryMap.arriveplace = p + "/" + c
                }else {
                    this.queryMap.arriveplace = ""
                }
            },



            //每页条数改变时，参数val是改变后的每页条数
            handleSizeChange(val) {
                /*console.log(`每页 ${val} 条`);*/
                this.queryMap.limit = val;//设置新的每页条数
                this.queryMap.page = 1; //将页码设置回第一页
                this.getTickets()
            },
            //页码改变时，参数val是改变后的页码
            handleCurrentChange(val) {
                /*console.log(`当前页: ${val}`);*/
                this.queryMap.page = val;//设置新的页码
                this.getTickets()
            }
        },
        created() {
            this.getTickets();
            this.getTrList();
        }
    }
</script>

<style scoped>


</style>