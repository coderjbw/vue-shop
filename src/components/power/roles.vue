<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-button type="primary" >添加角色</el-button>
          </div>
        </el-col>
      </el-row>

      <el-table :data="roleslist" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="vcenter" :class="['bdborder',index1 === 0? 'bdtop':'']" :gutter="20" v-for="(item1,index1) in scope.row.children" :key="item1.id">
              <el-col :span="5" >
                <el-tag closable @close="removetag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row class="vcenter" :class="['bdtop',index2 === 0? 'bdtoplosse':'']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removetag(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removetag(scope.row,item3.id)">
                        {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" >
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showsetrightdialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="showsetright" width="50%" @close="closerightdialog">
      <el-tree :data="rightlist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="checkedkeys" ref="tree"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showsetright = false">取 消</el-button>
    <el-button type="primary" @click="allotrights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "roles",
    data(){
      return{
        roleslist:[],
        showsetright:false,
        rightlist:[],
        treeProps: {
          children: 'children',
          label: 'authName'
        },
        checkedkeys:[],
        rolesid:''
      }},
    created(){
      this.getroloslist()
    },
    methods:{
     async getroloslist(){
       const res = await this.$http.get('roles')
       if(res.status !== 200){
         return this.$message.error('获取失败')
       }
       console.log(res)
       this.roleslist = res.data.data
      },
      async removetag(role,rightid){
       const res =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(res)
        if(res !== 'confirm'){
         return this.$message.info('已取消删除')
        }else {
         const result = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
          if(result.status !== 200){
           return this.$message.error('删除权限失败')
          }

          console.log(result)
          role.children = result.data.data
        }
      },
      async showsetrightdialog(id){
       this.rolesid = id.id;
        const res = await this.$http.get('rights/tree')
        if(res.status !== 200){
          return this.$message.error('获取失败')
        }

        this.rightlist = res.data.data
        this.getrightid(id,this.checkedkeys)
        console.log(this.checkedkeys)
        this.showsetright = true
      },
      getrightid(role,arr){
       if(!role.children){
         return arr.push(role.id)
       }
       role.children.forEach(item=>{
         this.getrightid(item,arr)
       })
      },
      closerightdialog(){
        this.checkedkeys = []
      },
      async allotrights(){
        let args1 = this.$refs.tree.getCheckedKeys()
        let args2 = this.$refs.tree.getHalfCheckedKeys()
        let keys = [...args1,...args2]
        let idstr = keys.join(',')
        console.log(idstr)

       const res =  await this.$http.post(`roles/${this.rolesid}/rights`,{
          rids:idstr
        })
        if(res.status !==200){
          return this.$message.error('获取错误')
        }

        this.getroloslist()
        this.showsetright = false
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
 margin-bottom: 15px;
}
  .el-tag{
    margin: 7px;
  }
  .bdborder{
    border-bottom: 1px solid #eeeeee;
  }
  .bdtop{
    border-top: 1px solid #eeeeee;
  }
  .bdtoplosse{
    border-top: none;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>