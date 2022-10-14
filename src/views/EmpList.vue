<template>
    <div>
        <el-row>
            <el-col :span="3">
                <el-input
                        placeholder="请输入员工姓名"
                        v-model="queryMap.ename"
                        clearable>
                </el-input>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span = "3">
                <el-select v-model="queryMap.deptno" placeholder="请选择部门" clearable>
                    <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno" :key="dept.deptno"></el-option>
                </el-select>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-col>
            <el-col :span="7">&nbsp;</el-col>
            <el-col :span="6">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="openAdd">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="openEdit">修改</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="delEmp">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!-- data属性：绑定表格数据
            strip属性:实现表格隔行变色
            selection-change:点击复选框时触发，无论是选中还是取消都会触发
        -->
        <el-table
                :data="empsData"
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
                    width="55">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="empno"
                    label="员工编号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ename"
                    label="员工姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="epwd"
                    label="密码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="esex"
                    label="性别"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="etel"
                    label="电话"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="dname"
                    label="部门"
                    width="180">
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
        <el-dialog title="新增" :visible.sync="addFormVisible" width="35%">
            <el-form :model="addForm" :rules="rules" ref="addFormRef">
                <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="ename">
                    <el-input v-model="addForm.ename" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="epwd">
                    <el-input v-model="addForm.epwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="esex">
                    <el-select v-model="addForm.esex" style="width: 378px">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth" prop="etel">
                    <el-input v-model="addForm.etel" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门" :label-width="formLabelWidth" prop="deptno">
                    <el-select v-model="addForm.deptno" style="width: 378px">
                        <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno" :key="dept.deptno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份" :label-width="formLabelWidth" prop="eid">
                    <el-select v-model="addForm.eid" style="width: 378px">
                        <el-option label="员工" value="1"></el-option>
                        <el-option label="经理" value="2"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveAdd">保存</el-button>
            </div>
        </el-dialog>

        <!--修改功能 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="修改" :visible.sync="editFormVisible" width="35%">
            <el-form :model="editForm" :rules="rules" ref="editFormRef">
                <el-form-item label="员工编号" :label-width="formLabelWidth" prop="empno" >
                    <el-input v-model="editForm.empno" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="ename">
                    <el-input v-model="editForm.ename" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="epwd">
                    <el-input v-model="editForm.epwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="esex">
                    <el-select v-model="editForm.esex" style="width: 378px">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth" prop="etel">
                    <el-input v-model="editForm.etel" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门" :label-width="formLabelWidth" prop="deptno">
                    <el-select v-model="editForm.deptno" style="width: 378px">
                        <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno" :key="dept.deptno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份" :label-width="formLabelWidth" prop="eid">
                    <el-select v-model="editForm.eid" style="width: 378px">
                        <el-option label="员工" value="1"></el-option>
                        <el-option label="经理" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveEdit">保存</el-button>
            </div>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "EmpList",
        data(){
            //姓名唯一判断
            var checkEname = (rule, value, callback) => {
                //新增页面验证
                if (this.addForm.ename != null && this.addForm.ename != ""){
                    this.$http.get("empOnly/"+this.addForm.ename).then(res => {
                        if (res.data.ename == value){
                            callback(new Error("该员工姓名已存在"));
                        }else {
                            callback();
                        }
                    }).catch(() => {
                        this.$message.error("验证姓名是否唯一失败，请联系管理员")
                    })
                }else if (this.editForm.ename != null && this.editForm.ename != "") { //修改页面验证
                    this.$http.get("empOnly/"+this.editForm.ename).then(res => {
                        if (this.editForm.empno == res.data.empno){
                            callback();
                        } else if (res.data.ename  == value){
                            callback(new Error("该员工姓名已存在"));
                        }else {
                            callback();
                        }
                    }).catch(() => {
                        this.$message.error("验证姓名是否唯一失败，请联系管理员")
                    })
                }
            };


            //部门经理唯一判断
            var checkEid = (rule, value, callback) => {
                //新增页面验证
                if (this.addForm.deptno != null && this.addForm.deptno != ""){
                    this.$http.get("eidOnly/"+this.addForm.deptno).then(res => {
                        if (res.data != null && res.data != ""){
                            if (this.addForm.eid == "2") {
                                callback(new Error("该部门已存在经理"));
                            }else {
                                callback();
                            }
                        }else {
                            callback();
                        }
                    }).catch(() => {
                        this.$message.error("111验证部门经理是否唯一失败，请联系管理员")
                    })
                }else if (this.editForm.deptno != null && this.editForm.deptno != "") { //修改页面验证
                    this.$http.get("eidOnly/"+this.editForm.deptno).then(res => {
                        if (res.data != null && res.data != ""){
                            if (this.editForm.empno == res.data.empno){
                                callback();
                            } else if (this.editForm.eid == "2") {
                                callback(new Error("该部门已存在经理"));
                            }else {
                                callback();
                            }
                        }else {
                            callback();
                        }
                    }).catch(() => {
                        this.$message.error("222验证部门经理是否唯一失败，请联系管理员")
                    })
                }else {
                    callback(new Error("请先选择部门"));
                }
            };


            return{
                empsData:[],//表格数据
                //封装查询条件
                queryMap:{
                    ename:"",//查询框中的数据
                    deptno:"",//部门
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
                    ename:"", //员工姓名
                    epwd:"",//密码
                    esex:"",//性别
                    etel:"",// 电话
                    deptno:"",//部门
                    eid:"",//身份 经理 or 员工
                },

                //add 表单验证规则
                rules: {
                    ename: [
                        {required: true, message: '请输入员工姓名', trigger: 'blur'},
                        { min: 2, max: 12, message: '长度在 2 到 12个字符', trigger: 'blur' },
                        { validator:checkEname, trigger: 'blur' },
                    ],
                    epwd: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        { min: 5, max: 12, message: '长度在 5 到 12个字符', trigger: 'blur' }
                    ],
                    esex: [
                        {required: true, message: '请选择员工性别', trigger: 'change'},
                    ],
                    etel: [
                        {required: true, message: '请输入员工电话', trigger: 'blur'},
                        {pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ ,
                            message: '手机号码格式错误',trigger: 'blur'}
                    ],
                    deptno: [
                        {required: true, message: '请选择部门', trigger: 'blur'},
                    ],
                    eid: [
                        {required: true, message: '请选择身份', trigger: 'blur'},
                        { validator:checkEid, trigger: 'blur' },
                    ],
                },

                editFormVisible:false,
                editForm:{
                    empno:"", //员工编号
                    ename:"", //员工姓名
                    epwd:"",//密码
                    esex:"",//性别
                    etel:"",// 电话
                    deptno:"",// 部门
                    eid:"",//身份 经理 or 员工
                },
                //部门信息
                deptList:[],

            }
        },
        methods: {
            //获取表格数据
            getEmps(){
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("getEmpList",this.queryMap).then((res) =>{
                    if (res.data.total != null){
                        this.empsData = res.data.data;//封装表格数据
                        this.total = res.data.total; //封装总条数
                    } else {
                        this.$message.error("员工表格数据请求失败")
                    }
                }).catch(() => {
                    this.$message.error("员工表格数据请求失败,请联系管理员")
                })
            },
            //点击查询按钮
            search(){
                this.queryMap.page = 1; //将页码设置回第一页
                this.getEmps()
            },
            //复选框选中状态改变时，val是选中的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //点击删除按钮
            delEmp(){
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
                    let empnos = [] //存放要删除的员工编号
                    //遍历选中项，获取员工编号
                    for (let i = 0;i < this.multipleSelection.length;i++) {
                        empnos.push(this.multipleSelection[i].empno);//将编号存入数组中
                    }
                    //调用后台执行删除操作
                    this.$http.post("delEmp",empnos).then((res) =>{
                        if (res.data == "success"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //将页码重置会第一页
                            this.queryMap.page = 1;
                            //刷新表格
                            this.getEmps();
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
                this.addFormVisible = true;
                //重置表单
                this.$refs['addFormRef'].resetFields();
            },
            //点击保存按钮
            saveAdd(){
                this.$refs['addFormRef'].validate((valid) => {
                    if (valid) {
                        //验证通过执行保存
                        this.$http.post('addEmp',this.addForm).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"新增成功"
                                })
                                //关闭弹窗
                                this.addFormVisible =false;
                                //刷新列表
                                this.getEmps();
                                //重置表单
                                this.$refs['addFormRef'].resetFields();
                            }else {
                                this.$message.error("员工新增失败")
                            }
                        }).catch(() =>{
                            this.$message.error("员工新增失败，请联系管理员")
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

                let empno = this.multipleSelection[0].empno;
                this.$http.get("getEmpByEmpno/"+empno).then(res =>{
                    this.editForm = res.data;
                    this.editForm.eid = this.editForm.eid.toString();
                    this.editFormVisible = true;
                    //重置表单
                    this.$refs['editFormRef'].resetFields();
                    this.addForm.ename = "";
                    this.addForm.deptno = "";
                })

            },
            //点击修改页面的 保存按钮
            saveEdit(){
                //触发验证效果
                this.$refs['editFormRef'].validate((valid) => {
                    if (valid) {
                        //验证通过执行保存
                        this.$http.post('editEmp',this.editForm).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"修改成功"
                                })
                                //关闭弹窗
                                this.editFormVisible =false;
                                //刷新列表
                                this.getEmps();
                                //重置表单
                                this.$refs['editFormRef'].resetFields();
                            }else {
                                this.$message.error("员工修改失败")
                            }
                        }).catch(() =>{
                            this.$message.error("员工修改失败，请联系管理员")
                        })
                    } else {
                        return false;
                    }
                });
            },

            //获取部门
            getDeptList(){
                this.$http.get("getAllDept").then(res =>{
                    this.deptList = res.data;
                }).catch(() =>{
                    this.$message.error("部门信息获取失败，请联系管理员")
                })
            },

            //每页条数改变时，参数val是改变后的每页条数
            handleSizeChange(val) {
                /*console.log(`每页 ${val} 条`);*/
                this.queryMap.limit = val;//设置新的每页条数
                this.queryMap.page = 1; //将页码设置回第一页
                this.getEmps()
            },
            //页码改变时，参数val是改变后的页码
            handleCurrentChange(val) {
                /*console.log(`当前页: ${val}`);*/
                this.queryMap.page = val;//设置新的页码
                this.getEmps()
            }
        },
        created() {
            this.getEmps();
            this.getDeptList();
        }
    }
</script>

<style scoped>

</style>