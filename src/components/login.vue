<template>
  <div class="login">
    <div class="box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!--表单-->
  <div>
    <el-form ref="loginform" class="login-form" :rules="loginrules" :model="form" label-width="0px">
      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
     </el-form-item>
      <el-form-item prop="passeord">
        <el-input type="password" prefix-icon="el-icon-s-cooperation" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetlogin">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data(){
      return{
        form:{
          username:'',
          password:''
        },
        loginrules:{
          username:[
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      resetlogin(){
        this.$refs.loginform.resetFields()
      },
      login(){
        this.$refs.loginform.validate(async (valid)=>{
          if(!valid) return
          const resule = await this.$http.post('login',this.form)
          console.log(resule.data)
          if(resule.data.meta.status !== 200){
            // console.log('登录失败')
            this.$message.error('登录失败')
          }else {
            // console.log('登陆成功')
            this.$message.success('登陆成功')
            window.sessionStorage.setItem('token',resule.data.data.token)
            this.$router.push('/home')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.login{
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    position: absolute;
    top: 0;
    left:50%;
    transform: translate(-50%,-50%);
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddd;
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login-form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
 }
  .btns{
    display: flex;
    justify-content: center;
  }
</style>