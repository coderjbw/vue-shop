import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login'
import home from  './components/home'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:login
    },
    {
      path:'/home',
      component:home
    }
  ]
})
//to：将要访问的路径；from：从哪个页面来；next：下一次操作
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    return next()
  }else {
    const tokenstr = window.sessionStorage.getItem('token')
    if(!tokenstr){
     return next('/login')
    }
  }
  next()
})

export default router