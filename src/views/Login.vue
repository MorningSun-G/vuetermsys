<template>
    <div class="loginback" >
        <div class="login_box" >
            <!-- model属性：表单数据对象，表示表单绑定的数据是一个对象-->
            <!--Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
            并将 Form-Item 的 prop 属性设置为需校验的字段名即可。-->
            <!-- ref属性：用于获取整个表单，在提交表单或重置表单时会用到-->
            <el-form :model="loginForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                <div style="width: 100%; height: 100px ;text-align: center">
                    <label style="font-size: 30px;font-family:微软雅黑 ; position:relative; top: 20px;">差 旅 报 销 系 统</label>
                </div>

                <el-form-item prop="ename" style="text-align: left">
                    <el-input prefix-icon="el-icon-s-custom" placeholder="请输入用户名"  v-model="loginForm.ename" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item  prop="epwd" style="text-align: left">
                    <el-input  prefix-icon="el-icon-lock"  placeholder="请输入密码"  v-model="loginForm.epwd" show-password style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item style="text-align: left">
                    <el-button type="primary" @click="submitForm('ruleForm')" style="width: 300px">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        /*data 是一个方法，返回的是一个对象*/
        data(){
            return{
                //登录表单绑定的数据
                loginForm:{
                    ename:"",//用户名
                    epwd:"",//密码
                },
                //表单验证规则
                //注意：手机号、邮箱、身份证号等  要使用正则表达式验证
                //金钱等数字 也要验证  只能输入数字 正数
                //非必填项不要带 *，  *就是必填项的意思
                rules: {
                    //ename ： 对应的表单中form-item 的prop 属性
                    ename: [
                        //required 为true表示该项是必填项，不可为空
                        //message：不符合验证规则时的提示信息
                        //trigger：触发时机，这里是失去焦点时验证
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    epwd:[
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                }
            }
        },

        methods: {

            //登录按钮
            //formName接收传递来的 form 的ref属性值
            submitForm(formName) {
                // this.$refs[formName] ： 通过ref属性获取到form表单
                // validate:触发验证效果
                // valid ： 如果验证通过 返回给valid  true ， 验证不通过返回false
                this.$refs[formName].validate((valid) => {
                    //验证通过， 应该将用户名和密码提交到后台进行判断 拿到返回值
                    if (valid) {
                        //post 提交方式，第一个参数是访问的后台路径，第二个参数是传递的数据
                        //请求成功会回调then（）,如果有返回值，会传递给res
                        //请求失败会回调catch（）
                        this.$http.post("login",this.loginForm).then((res) => {
                            //返回值封装在res.data中
                            if (res.data != "null" && res.data != ""){
                                /*this.$message({
                                    message: '登录成功',
                                    type: 'success'
                                });*/
                                //通过提交mutation 修改state中的ename值
                                //this.$store.commit("setUser",this.loginForm.ename)
                                //将用户名存入session
                                sessionStorage.setItem("ename",this.loginForm.ename)
                                //将员工编号存入session
                                sessionStorage.setItem("empno",res.data.empno)
                                //将部门存入session
                                sessionStorage.setItem("dname",res.data.dname)
                                //将部门编号存入session
                                sessionStorage.setItem("deptno",res.data.deptno)

                                //登录成功，根据身份跳转到相应的首页
                                if(res.data.dname == "管理员"){
                                    this.$router.push("/adminhome")
                                }else if (res.data.eid == "1"){
                                    this.$router.push("/emphome")
                                }else if (res.data.eid == "2") {
                                    this.$router.push("/leaderhome")
                                } else if (res.data.dname == "财务") {
                                    this.$router.push("/financehome")
                                }else{
                                    alert(res.data.dname)
                                }
                            } else {
                                this.$message.error("用户名或密码输入错误")
                            }

                        }).catch(() => {
                            this.$message.error('登录请求失败，请联系管理员');
                        })
                    } else {//验证通过
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>


    .login_box{
        width: 500px;
        height: 300px;
        position: absolute;
        left: 35%;
        top: 30%;
        border-radius: 20px;
        /* 为其整体设置接近透明的效果*/
        background-color: rgba(255,255,255,0.1);
        /* 设置box-shadow使其有立体感 */
        box-shadow: 5px 5px 5px 5px  rgba(0,0,0,0.2);
    }
    .loginback{
        background: url("../assets/loginbackground.png");
        width:100%;
        height:100%;
        position:fixed;
        background-size:100% 100%;
    }
</style>