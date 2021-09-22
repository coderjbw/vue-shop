import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
// import './elementui'
// import 'element-ui/lib/theme-chalk/index.css'
import './vuequilleditor'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//用于显示加载进度条
import Nprogress from 'nprogress'
//用于显示加载进度条样式
// import 'nprogress/nprogress.css'

Vue.prototype.$http = axios;
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  // console.log(config)
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
});
axios.interceptors.response.use(config=>{
  // console.log(config)
  Nprogress.done()
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.filter('dataFormat',function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
