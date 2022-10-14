import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //这个配置对象中的配置项是固定的，就是如下5个
  //在state中 定义公共的数据，vuex中的数据都是响应式的，任何组件在使用store中的同一数据时，
  // 只要state中的数据发生改变，对应组件中的值也会响应改变
  state: {
    ename:"",//定义登录的用户名
    empno:"",//登录的员工编号
    dname:"",//员工部门
    deptno:"",//员工部门编号
  },
  //可以对store中的数据读取，且只能读取
  getters: {
  },
  //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    //方法中第一个参数是默认的state,mutation必须是同步函数
    //第二个参数 如有多个 必须写成对象
    setUser(state,emp){
      state.ename = emp.ename;
      state.empno = emp.empno;
      state.dname = emp.dname;
      state.deptno = emp.deptno;
    }
  },
  /*
Action 类似于 mutation，不同在于：
  Action 提交的是 mutation，而不是直接变更状态。
  Action 可以包含任意异步操作。*/
  actions: {
  },
  modules: {
  }
})
