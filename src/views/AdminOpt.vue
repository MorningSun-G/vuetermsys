<template>
    <div>

        <el-row>
            <el-col :span="11">
                    <div  class="div1">交通工具维护</div>
                    <div  class="div2">
                        <el-button-group >
                            <el-button type="primary" icon="el-icon-plus" @click="openAddT">新增</el-button>
                            <el-button type="primary" icon="el-icon-edit" @click="openEditT">修改</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="delT">删除</el-button>
                        </el-button-group>
                    </div>
                <el-table
                        :data="transportationData"
                        height="559px"
                        @selection-change="handleSelectionChange"
                        style="width: 100%; margin:10px auto 10px">
                    <el-table-column
                            align="center"
                            type="selection"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            type="index"
                            label="序号"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="trno"
                            label="交通工具编号"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="trname"
                            label="交通工具名称"
                            width="220">
                    </el-table-column>

                </el-table>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="11">
                <div  class="div1">部门维护</div>
                <div  class="div2">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-plus" @click="openAddD">新增</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="openEditD">修改</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="delD">删除</el-button>
                    </el-button-group>
                </div>
                <el-table
                        :data="deptData"
                        height="559px"
                        @selection-change="handleSelectionChangeD"
                        style="width: 100%; margin:10px auto 10px">
                    <el-table-column
                            align="center"
                            type="selection"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            type="index"
                            label="序号"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="deptno"
                            label="部门编号"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="dname"
                            label="部门名称"
                            width="220">
                    </el-table-column>

                </el-table>
            </el-col>
        </el-row>


        <!--新增功能 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="新增" :visible.sync="addFormTVisible" width="500px">
            <el-form :model="addFormT" :rules="rules" ref="addFormTRef">
                <el-form-item label="交通工具名称" :label-width="formLabelWidth" prop="trname">
                    <el-input v-model="addFormT.trname" autocomplete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormTVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveAddT">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addFormDVisible" width="500px">
            <el-form :model="addFormD" :rules="rules" ref="addFormDRef">
                <el-form-item label="部门名称" :label-width="formLabelWidth" prop="dname">
                    <el-input v-model="addFormD.dname" autocomplete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormDVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveAddD">保存</el-button>
            </div>
        </el-dialog>

        <!--修改功能 对话框-->
        <!-- :visible.sync 控制对话框显隐-->
        <el-dialog title="修改" :visible.sync="editFormTVisible" width="500px">
            <el-form :model="editFormT" :rules="rules" ref="editFormTRef">
                <el-form-item label="交通工具编号" :label-width="formLabelWidth" prop="trno">
                    <el-input v-model="editFormT.trno" autocomplete="off" readonly ></el-input>
                </el-form-item>
                <el-form-item label="交通工具名称" :label-width="formLabelWidth" prop="trname">
                    <el-input v-model="editFormT.trname" autocomplete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormTVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveEditT">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="editFormDVisible" width="500px">
            <el-form :model="editFormD" :rules="rules" ref="editFormDRef">
                <el-form-item label="部门编号" :label-width="formLabelWidth" prop="deptno">
                    <el-input v-model="editFormD.deptno" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="部门名称" :label-width="formLabelWidth" prop="dname">
                    <el-input v-model="editFormD.dname" autocomplete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormDVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveEditD">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "AdminOpt",
        data(){
            return{
                transportationData:[],//交通工具表格数据
                //封装查询条件
                multipleSelectionT: [],//表格中选中的数据（对象数组)

                deptData:[],//部门表格数据
                multipleSelectionD: [],//表格中选中的数据（对象数组)

                // 控制新增对话框的显隐
                addFormTVisible: false,
                addFormDVisible: false,
                formLabelWidth: '120px',
                //新增表单的数据
                addFormT:{
                    trname:"",
                },
                addFormD:{
                    dname:"",
                },

                // 控制修改对话框的显隐
                editFormTVisible: false,
                editFormDVisible: false,
                //修改表单的数据
                editFormT:{
                    trno:"",
                    trname:""
                },
                editFormD:{
                    deptno:"",
                    dname:"",
                },

                //add 表单验证规则
                rules: {
                    trname: [
                        {required: true, message: '请输入交通工具名称', trigger: 'blur'},
                    ],
                    dname:[
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                    ]
                },

            }
        },
        methods: {
            //获取交通工具表格数据
            getTransportations(){
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("getAllTransportation").then((res) =>{
                    if (res.data.length !=  0){
                        this.transportationData = res.data;//封装表格数据
                    } else {
                        this.$message.error("交通工具表格数据请求失败")
                    }
                }).catch(() => {
                    this.$message.error("交通工具表格数据请求失败,请联系管理员")
                })
            },

            //获取部门表格数据
            getDepts(){
                //箭头函数中如果参数只有一个，可以省略小括号
                this.$http.post("getAllDept").then((res) =>{
                    if (res.data.length !=  0){
                        this.deptData = res.data;//封装表格数据
                    } else {
                        this.$message.error("交通工具表格数据请求失败")
                    }
                }).catch(() => {
                    this.$message.error("交通工具表格数据请求失败,请联系管理员")
                })
            },

            // 点击新增按钮
            openAddT(){
                this.addFormTVisible = true;
                //重置表单
                this.$refs['addFormTRef'].resetFields();
            },
            openAddD(){
                this.addFormDVisible = true;
                //重置表单
                this.$refs['addFormDRef'].resetFields();
            },

            //点击保存按钮
            saveAddT(){
                this.$refs['addFormTRef'].validate((valid) => {
                    if (valid) {
                        //验证通过执行保存
                        this.$http.post('addTransportation',this.addFormT).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"新增成功"
                                })
                                //关闭弹窗
                                this.addFormTVisible =false;
                                //刷新列表
                                this.getTransportations();
                                //重置表单
                                this.$refs['addFormTRef'].resetFields();
                            }else {
                                this.$message.error("新增失败")
                            }
                        }).catch(() =>{
                            this.$message.error("新增失败，请联系管理员")
                        })
                    } else {
                        return false;
                    }
                });
            },
            saveAddD(){
                this.$refs['addFormDRef'].validate((valid) => {
                    if (valid) {
                        //验证通过执行保存
                        this.$http.post('addDept',this.addFormD).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"新增成功"
                                })
                                //关闭弹窗
                                this.addFormDVisible =false;
                                //刷新列表
                                this.getDepts();
                                //重置表单
                                this.$refs['addFormDRef'].resetFields();
                            }else {
                                this.$message.error("新增失败")
                            }
                        }).catch(() =>{
                            this.$message.error("新增失败，请联系管理员")
                        })
                    } else {
                        return false;
                    }
                });
            },

            //点击修改按钮
            openEditT(){
                //判断是否选中数据
                if (this.multipleSelectionT.length == 0){
                    this.$message({
                        message:"请选择要修改的数据",
                        type:"warning"
                    });
                    return;
                } else if (this.multipleSelectionT.length > 1){
                    this.$message({
                        message:"请选择一条数据",
                        type:"warning"
                    });
                    return;
                }
                //通过编号查找该数据
                let trno = this.multipleSelectionT[0].trno;
                this.$http.get("getTransportationByTrno/"+trno).then(res =>{
                    this.editFormT = res.data;
                    this.editFormTVisible = true;
                    //重置表单
                    this.$refs['editFormTRef'].resetFields();
                })
            },
            openEditD(){
                //判断是否选中数据
                if (this.multipleSelectionD.length == 0){
                    this.$message({
                        message:"请选择要修改的数据",
                        type:"warning"
                    });
                    return;
                } else if (this.multipleSelectionD.length > 1){
                    this.$message({
                        message:"请选择一条数据",
                        type:"warning"
                    });
                    return;
                }
                //通过编号查找该数据
                let deptno = this.multipleSelectionD[0].deptno;
                this.$http.get("getDeptByDeptno/"+deptno).then(res =>{
                    this.editFormD = res.data;
                    this.editFormDVisible = true;
                    //重置表单
                    this.$refs['editFormDRef'].resetFields();
                })
            },

            //点击修改页面的 保存按钮
            saveEditT(){
                //触发验证效果
                this.$refs['editFormTRef'].validate((valid) => {
                    if (valid) {
                        //验证通过执行保存
                        this.$http.post('editTransportation',this.editFormT).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"修改成功"
                                })
                                //关闭弹窗
                                this.editFormTVisible =false;
                                //刷新列表
                                this.getTransportations();
                                //重置表单
                                this.$refs['editFormTRef'].resetFields();
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
            saveEditD(){
                //触发验证效果
                this.$refs['editFormDRef'].validate((valid) => {
                    if (valid) {
                        //验证通过执行保存
                        this.$http.post('editDept',this.editFormD).then(res => {
                            if (res.data == "success"){
                                this.$message({
                                    type:"success",
                                    message:"修改成功"
                                })
                                //关闭弹窗
                                this.editFormDVisible =false;
                                //刷新列表
                                this.getDepts();
                                //重置表单
                                this.$refs['editFormDRef'].resetFields();
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

            //点击删除按钮
            delT(){
                //判断有没有选中数据
                if(this.multipleSelectionT.length == 0){
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
                    let trnos = []
                    for (let i = 0;i < this.multipleSelectionT.length;i++) {
                        trnos.push(this.multipleSelectionT[i].trno);//将编号存入数组中
                    }
                    //调用后台执行删除操作
                    this.$http.post("delTransportation",trnos).then((res) =>{
                        if (res.data == "success"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //刷新表格
                            this.getTransportations();
                        } else {
                            this.$message.error("删除失败")
                        }
                    }).catch((res) =>{
                        this.$message.error("删除失败，已经使用的不能被删除")
                    })
                }).catch(() => { //询问是否删除弹框，点击取消
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            delD(){
                //判断有没有选中数据
                if(this.multipleSelectionD.length == 0){
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
                    let deptnos = []
                    for (let i = 0;i < this.multipleSelectionD.length;i++) {
                        deptnos.push(this.multipleSelectionD[i].deptno);//将编号存入数组中
                    }
                    //调用后台执行删除操作
                    this.$http.post("delDept",deptnos).then((res) =>{
                        if (res.data == "success"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            //刷新表格
                            this.getDepts();
                        } else {
                            this.$message.error("删除失败")
                        }
                    }).catch((res) =>{
                        this.$message.error("删除失败，已经使用的不能被删除")
                    })
                }).catch(() => { //询问是否删除弹框，点击取消
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },









            //复选框选中状态改变时，val是选中的数据 交通工具
            handleSelectionChange(val) {
                this.multipleSelectionT = val;
            },
            //复选框选中状态改变时，val是选中的数据 部门
            handleSelectionChangeD(val) {
                this.multipleSelectionD = val;
            },
        },
        created() {
            this.getTransportations();
            this.getDepts();
        }
    }
</script>

<style scoped>
    .div1{
        font-size: 20px;
        display: inline-block;
    }
    .div2{
        display: inline-block;
        margin-left: 170px;
    }

</style>