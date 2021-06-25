<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--卡片-->

    <el-card class="box-card">
      <el-table :data="rightlist" style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" >
        </el-table-column>
        <el-table-column prop="level" label="权限等级" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "power",
    data(){
      return{
        rightlist:[]
      }
    },
    created(){
      this.getRightsList()
    },
    methods:{
     async getRightsList(){
      const res = await this.$http.get('rights/list')
       if(res.status !== 200){
        return this.$message.error('请求数据失败')
       }
       // console.log(res.data.data)
       this.rightlist = res.data.data
      }
    }
  }
</script>

<style scoped>

</style>