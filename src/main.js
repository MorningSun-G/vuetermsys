import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/*引入elment ui*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 引入 axios
import axios from 'axios'
//设置后台方位路径
axios.defaults.baseURL = "http://localhost:8086/"
//挂载 axios
Vue.prototype.$http = axios;
//





Vue.config.productionTip = false

new Vue({
  router,
  store, //当把store挂载到vue实例上，所有的组件中都可以获得一个$store对象
  render: h => h(App)
}).$mount('#app')
