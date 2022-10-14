import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import AdminHome from '../views/AdminHome.vue'
import EmpList from '../views/EmpList.vue'
import AdminOpt from '../views/AdminOpt.vue'
import EmpHome from '../views/EmpHome.vue'
import TicketList from '../views/TicketList.vue'
import BusinessList from '../views/BusinessList.vue'
import LeaderHome from '../views/LeaderHome.vue'
import BusinessLCheck from '../views/BusinessLCheck.vue'
import FinanceHome from '../views/FinanceHome.vue'
import BusinessFCheck from '../views/BusinessFCheck.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/adminhome',
    name: 'AdminHome',
    component: AdminHome,
    //重定向到 emp ，一进入页面就显示emp
    redirect:"/emp",
    children:[
      {path:"/emp",component:EmpList},
      {path:"/adminOpt",component:AdminOpt},
    ]
},
  {
    path: '/emphome',
    name: 'EmpHome',
    component: EmpHome,
    redirect:"/ticket",
    children:[
      {path:"/ticket",component:TicketList},
      {path:"/business",component:BusinessList},
    ]
  },
  {
    path: '/leaderhome',
    name: 'LeaderHome',
    component: LeaderHome,
    redirect:"/ticketL",
    children:[
      {path:"/ticketL",component:TicketList},
      {path:"/businessL",component:BusinessList},
      {path:"/leaderCheck",component:BusinessLCheck},
    ]
  },
  {
    path: '/financehome',
    name: 'FinanceHome',
    component: FinanceHome,
    redirect:"/ticketF",
    children:[
      {path:"/ticketF",component:TicketList},
      {path:"/businessF",component:BusinessList},
      {path:"/financeCheck",component:BusinessFCheck},
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
