<template>
    <el-container>
        <el-header>
            <div>
                <img src="../assets/jxdlogo.png" width="70px" height="70px">
                <span style="margin-left:0 ;font-size: larger">差旅报销系统</span>
                <span>{{$store.state.dname}}</span>

            </div>

            <div style="justify-content: space-between; width: 360px" >
                <div >{{nowTime}}</div>

                <el-dropdown>
                  <span class="el-dropdown-link">
                    {{$store.state.ename}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-error" @click.native="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- router 属性 ：是否使用 vue-router 的模式，
                启用该模式会在激活导航时以 index 作为 path 进行路由跳转
                    default-active ： 选中导航栏  高亮
                -->
                <el-menu
                        :default-active="menuIndex"
                        :router = "true"
                        class="el-menu-vertical-demo">

                    <el-menu-item index="/ticketL">
                        <i class="el-icon-s-ticket"></i>
                        <span slot="title">车票管理</span>
                    </el-menu-item>

                    <el-menu-item index="/businessL">
                        <i class="el-icon-s-cooperation"></i>
                        <span slot="title">差旅信息管理</span>
                    </el-menu-item>

                    <el-menu-item index="/leaderCheck">
                        <i class="el-icon-s-check"></i>
                        <span slot="title">差旅信息审批</span>
                    </el-menu-item>

                </el-menu>
            </el-aside>
            <el-main>

                <!-- 用于显示相应的组件 -->
                <router-view></router-view>

            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "LeaderHome",

        data(){
            return{
                menuIndex:"/ticketL",
                timer: "", //定义一个定时器
                nowTime: "", // 当前日期时间
            }
        },

        methods:{
            //为了防止刷新页面后，store中的数据丢失，可以在session中重新获取数据更新state中的值
            getEname(){
                let ename = sessionStorage.getItem("ename");
                let empno = sessionStorage.getItem("empno");
                let dname = sessionStorage.getItem("dname");
                let deptno = sessionStorage.getItem("deptno");

                if (ename != "" && ename != null){
                    this.$store.commit("setUser", {
                        ename:ename,
                        empno:empno,
                        dname:dname,
                        deptno:deptno,
                    })
                }else {
                    this.$store.commit("setUser",{
                        ename:"",
                        empno:"",
                        dname:"",
                        deptno:"",
                    })
                }
            },

            // 显示当前时间
            getTime() {
                this.timer = setInterval(() => {
                    let timeDate = new Date();
                    let year = timeDate.getFullYear();
                    let mounth = timeDate.getMonth() + 1;
                    let day = timeDate.getDate();
                    let hours = timeDate.getHours();
                    hours = hours >= 10 ? hours : "0" + hours;
                    let minutes = timeDate.getMinutes();
                    minutes = minutes >= 10 ? minutes : "0" + minutes;
                    let seconds = timeDate.getSeconds();
                    seconds = seconds >= 10 ? seconds : "0" + seconds;
                    let week = timeDate.getDay();
                    let weekArr = [
                        "星期日",
                        "星期一",
                        "星期二",
                        "星期三",
                        "星期四",
                        "星期五",
                        "星期六",
                    ];

                    this.nowTime = `${year}年${mounth}月${day}日 ${hours}:${minutes}:${seconds} ${weekArr[week]}`;
                }, 1000);
            },


            //点击退出按钮
            logout(){
                sessionStorage.clear(); //清空session
                this.$router.push("/")  //跳转到登录页面
            }
        },
        //加载时执行
        created() {
            this.getEname();
        },

        //create 之后
        mounted(){
            this.getTime();
        },
        //页面销毁之前
        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },

        // 路由钩子
        //to: 即将要进入的目标对象
        //from：是即将要离开的路由对象
        //next():放行
        beforeRouteEnter(to,from,next){
            //获取想要进入的路由的path
            let path = to.path;

            //在这一步，不能通过this访问data中的数据，但是可以通过Vue实例vm访问
            next(vm =>{
                vm.menuIndex = path
            }) //放行
        }
    }
</script>

<style scoped>
    .el-header {
        background-color: #191a23;
    }
    .el-aside {
        background-color: white;
    }
    .el-main {
        background-color: #eaedf1;
    }
    .el-container {
        height: 100%;
    }
    /*头部样式*/
    .el-header {
        background-color: #191a23;
        display: flex;

        /*左右贴边*/
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 18px;
    }
    .el-header>div {
        display: flex;
        align-items: center;
    }
    .el-header span {
        margin-left: 15px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #fff;
        font-size: 18px;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }

</style>