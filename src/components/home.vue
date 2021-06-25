<template>
  <el-container class="home">
    <el-header>
      <div class="left">
        <img src="../assets/logo.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse? '64px':'200px'">
        <div class="toggle-button" @click="togglecollapse">|||</div>
        <el-menu background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff"
                :unique-opened="true"
                 :collapse-transition="false"
                 :collapse="iscollapse" router :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconlist[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="activepath('/'+subitem.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "home",
    data(){
      return{
        menulist:[],
        iconlist:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
        },
        iscollapse:false,
        activePath:''
      }
    },
    created(){
      this.getmenulist()
      this.activePath = window.sessionStorage.getItem('activepath')
    },
    methods:{
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
     async getmenulist(){
      const res =  await this.$http.get('menus')
       if(res.status !== 200){
          return this.$message.error()
       }
       this.menulist = res.data.data
       // console.log(this.menulist)
      },
      //点击折叠左侧菜栏
      togglecollapse(){
        this.iscollapse = !this.iscollapse
      },
      activepath(path){
        this.activePath = path;
        window.sessionStorage.setItem('activepath',path)
  }
    }
  }
</script>

<style lang="less" scoped>
  .home{
    width: 100%;
    height: 100%;
  }
.el-header{
  background-color:#373D41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  .left{
    display: flex;
    align-items: center;
    color: white;
    >img{
      width: 50px;
      height: 50px;
    }
    span{
      margin-left: 15px;
    }
  }
}
 .el-aside{
   background-color: #333744;
   .el-menu{
     border-right: none;
   }
 }
  .el-main{
  background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>