<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
          <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </div>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!--用户列表-->
      <el-table stripe border
              :data="userlist"
              style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="username" label="姓名" >
        </el-table-column>
        <el-table-column prop="email" label="邮箱" >
        </el-table-column>
        <el-table-column prop="mobile" label="电话" >
        </el-table-column>
        <el-table-column prop="role_name" label="角色" >
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="statechange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editdiolag(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuser(scope.row.id)"></el-button>
          <el-tooltip  effect="dark" content="用户分配" placement="top" :enterable="false">
            <el-button type="info" icon="el-icon-setting" size="mini" @click="setalroles(scope.row)"></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closedialog">
      <!--<span>这是一段信息</span>-->
      <el-form :model="addform" :rules="addformrules" ref="addForm" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
    </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editclosedialog">
      <!--<span>这是一段信息</span>-->
      <el-form :model="editform" :rules="editformrules" ref="editformref" label-width="70px" >
        <el-form-item label="用户名" >
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配用户对话框-->
    <el-dialog title="提示" :visible.sync="setrolesshowdialog" width="50%" @close="resetdialog">
      <!--<span>这是一段信息</span>-->
      <div>当前的用户：{{userinfo.username}}</div>
      <div>当前的角色：{{userinfo.role_name}}</div>
      <div>分配新角色：
        <el-select v-model="selectedrole" placeholder="请选择">
          <el-option
                  v-for="item in roleslist"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setrolesshowdialog = false">取 消</el-button>
    <el-button type="primary" @click="saveroleinfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "user",
    data(){
      var checkemail = (rule,value,cb)=>{
        const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9])+/;
        if(regemail.test(value)){
          return cb()
        }else{
          cb(new Error('请输入合法邮箱'))
        }
      };
      var checkmobile = (rule,value,cb)=>{
        const regmobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[0-9])[0-9]{8}$/;
        if(regmobile.test(value)){
          return cb()
        }else{
          cb(new Error('请输入合法手机号'))
        }
      };
      return{
          queryInfo:{
            query:'',
            pagenum:1,
            pagesize:2
          },
        userlist:[],
        total:0,
        dialogVisible:false,
        editDialogVisible:false,
        addform:{
            username:'',
            password:'',
            email:'',
            mobile:''
        },
        addformrules: {
          username:[{required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}],
          password:[{required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}],
          email:[{required: true, message: '请输入用户邮箱', trigger: 'blur'},{
            validator:checkemail,trigger: 'blur'
          }
            ],
          mobile:[{required: true, message: '请输入手机号', trigger: 'blur'},{
            validator:checkmobile,trigger: 'blur'
          }],
        },
        editform:{},
        editformrules:{
          email:[{required: true, message: '请输入用户邮箱', trigger: 'blur'},{
            validator:checkemail,trigger: 'blur'
          }
          ],
          mobile:[{required: true, message: '请输入手机号', trigger: 'blur'},{
            validator:checkmobile,trigger: 'blur'
          }],
        },
        setrolesshowdialog:false,
        userinfo:{},
        roleslist:[],
        selectedrole:''
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
     async getUserList(){
       const res = await this.$http.get('users',{
          params:this.queryInfo
        })
       // console.log(res)
       if(res.data.meta.status !== 200){
         return this.$message.error('获取失败')
       }
       this.userlist =res.data.data.users;
       this.total = res.data.data.total
       // console.log(this.userlist)
      },
      handleSizeChange(index){
       console.log(index)
        this.queryInfo.pagesize = index
        this.getUserList()
      },
      handleCurrentChange(index){
       this.queryInfo.pagenum = index
        this.getUserList()
      },
     async statechange(item){
       // console.log(item)
      const res =  await this.$http.put(`users/${item.id}/state/${item.mg_state}`)
       // console.log(res)
       if(res.status !== 200){
         item.mg_state = !item.mg_state
         return this.$message.error('更新用户状态失败')
       }
       this.$message.success('更新用户状态成功')
      },
      closedialog(){
       this.$refs.addForm.resetFields()
      },
      adduser(){
        this.$refs.addForm.validate(async valid=>{
          if(!valid) return
          const res =  await this.$http.post('users',
            this.addform
          )
          // console.log(res)
          if(res.status !== 200){
            this.$message.error('添加失败')
          }
          this.$message.success('添加成功')
          //关闭对话框
          this.dialogVisible = false
        //  重新获取用户数组
          this.getUserList()
        })
      },
     async editdiolag(id){
       // console.log(id)
      const res = await this.$http.get('users/'+id)
       // console.log(res)
       if(res.status !== 200){
         return this.$message.error('获取失败')
       }
       this.editform = res.data.data
       console.log(this.editform)
       this.editDialogVisible = true
      },
      editclosedialog(){
        this.$refs.editformref.resetFields()
      },
       editUserInfo(){
        this.$refs.editformref.validate(async valid=>{
          if(!valid){
            return
          }
          const res = await this.$http.put('users/'+this.editform.id,{
            email:this.editform.email,
            mobile:this.editform.mobile
          });
          if(res.status !== 200){
            this.$message.error('修改失败')
          }
          this.$message.success('修改成功')
          this.editDialogVisible = false
          this.getUserList()
        })
      },
      async removeuser(id){
        const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log(res)
        if(res !== 'confirm'){
          this.$message.info('取消删除')
        }else {
         const result = await this.$http.delete('users/'+id)
          if(result.status !== 200){
           return this.$message.error('删除失败')
          }
          this.$message.success('成功删除')
          this.getUserList()
        }
      },
      async setalroles(userinfo){
       // console.log(userinfo)
        this.userinfo = userinfo
        const res = await this.$http.get('roles')
        if(res.status !== 200){
          return this.$message.error('获取失败')
        }
        // console.log(res)
        this.roleslist = res.data.data
        this.setrolesshowdialog = true
      },
      async saveroleinfo(){
       if(!this.selectedrole){
         return this.$message.error('请选择要分配的角色')
       }
        const res = await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.selectedrole})
        if(res.status !== 200){
         return this.$message.error('修改失败')
        }
        // console.log(res)
        this.$message.success('修改成功')
        this.getUserList()
        // console.log(this.userlist)
        this.setrolesshowdialog = false
      },
      resetdialog(){
        this.selectedrole = ''
        this.userinfo = {}
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 10px;
}
  .el-card{
    box-shadow: 0px 1px 1px rgba(0,0,0,.15) !important;
  }
  .el-table{
   margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>