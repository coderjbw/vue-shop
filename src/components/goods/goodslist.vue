<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getGoodsLists">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsLists"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
            <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table :data="goodslist" style="width: 100%" stripe border="">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" >
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="145px">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removegoods(scope.row.goods_id)"></el-button>
        </el-table-column>
      </el-table>
      <!--分页功能-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "goodslist",
    data(){
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        goodslist:[],
        total:0
      }
    },
    created(){
      this.getGoodsLists()
    },
    methods:{
     async getGoodsLists(){
        const res = await this.$http.get('goods',{params:this.queryInfo})
       if(res.status !== 200){
          return this.$message.error('获取商品列表失败')
       }
       this.$message.success('获取商品列表成功')
       // console.log(res)
       this.total = res.data.data.total
       this.goodslist = res.data.data.goods
      },
      handleSizeChange(newdata){
       this.queryInfo.pagesize = newdata;
       this.getGoodsLists()
      },
      handleCurrentChange(newdata){
        this.queryInfo.pagenum = newdata;
        this.getGoodsLists()
      },
    //  删除商品操作
     async removegoods(id){
        const confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(e=>e)

       if(confirm !== 'confirm'){
          return this.$message.info('已经取消删除')
       }

       const res = await this.$http.delete(`goods/${id}`)
       if(res.status !==200){
          return this.$message.error('删除失败')
       }
       this.$message.success('删除成功')
       this.getGoodsLists()
      },
    //  添加商品
      addgoods(){
       this.$router.push('/goods/add')
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
  .el-table{
    margin-top: 15px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>