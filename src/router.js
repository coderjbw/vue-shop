import Vue from 'vue'
import Router from 'vue-router'
// import login from './components/login'
const login =()=>import(/* webpackChunkName: "Login_Home_Welcome" */ './components/login')
// import home from  './components/home'
const  home =()=>import(/* webpackChunkName: "Login_Home_Welcome" */ './components/home')
// import welcome from './components/welcome'
const  welcome =()=>import(/* webpackChunkName: "Login_Home_Welcome" */ './components/welcome')
// import user from './components/user/user'
const  user =()=>import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/user')
// import power from './components/power/power'
const  power =()=>import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/power')
// import roles from './components/power/roles'
const  roles =()=>import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/roles')
// import Cate from './components/goods/Cate'
const  Cate =()=>import(/* webpackChunkName: "Cate_Params" */ './components/goods/Cate')
// import Params from  './components/goods/params'
const  Params =()=>import(/* webpackChunkName: "Cate_Params" */ './components/goods/params')
// import Goods from './components/goods/goodslist'
const  Goods =()=>import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/goodslist')
// import Add from './components/goods/add'
const  Add =()=>import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/add')
// import Order from './components/order/Order'
const  Order =()=>import(/* webpackChunkName: "Order_Report" */ './components/order/Order')
// import Report from './components/report/Report'
const  Report =()=>import(/* webpackChunkName: "Order_Report" */ './components/report/Report')
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
      component:home,
      redirect:'/welcome',
      children:[{
        path:'/welcome',
        component:welcome
      },{
        path:'/users',
        component:user
      },{
        path:'/rights',
        component:power
      },{
        path:'/roles',
        component:roles
      },{
        path:'/categories',
        component:Cate
      },{
        path:'/params',
        component:Params
      },{
        path:'/goods',
        component:Goods
      },{
        path:'/goods/add',
        component:Add
      },{
        path:'/orders',
        component:Order
      },{
        path:'/reports',
        component:Report
      }]
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