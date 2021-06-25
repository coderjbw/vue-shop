<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showcategorydialog">添加商品</el-button>
        </el-col>
      </el-row>
      <!--商品列表-->
      <tree-table :data="catelist"  :show-row-hover="false" :columns="columns" :selection-type="false" show-index  :expand-type="false" index-text="#" border>
       <!--是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog title="添加用户" :visible.sync="addcategorydialog" width="50%" @close="resetdialog">
      <el-form :model="categoryForm" :rules="categoryFormrules" ref="categoryFormref" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedcascader"  :options="parentlist" :props="selectedprops" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addcategorydialog = false">取 消</el-button>
          <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data(){
      return{
        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        catelist:[],
        //总数据条数
        total:0,
        columns:[
          {label:'分类名称',prop:'cat_name'},
          {label:'是否有效',type:'template',template:'isok'},
          {label:'排序',type:'template',template:'order'},
          {label:'操作',type:'template',template:'opt'},
        ],
        addcategorydialog:false,
        categoryForm:{
          //分类要添加的名称
          cat_name:'',
          //父级分类的id
          cat_pid:0,
          //分类的等级，默认要添加的1级分类
          cat_level:0
        },
        categoryFormrules:{
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
      //  父级分类列表
        parentlist:[],
        selectedprops:{
          label:'cat_name',
          value:'cat_id',
          children:'children',
          expandTrigger: 'hover'
        },
        selectedcascader:[]
      }
  },
    created(){
      this.getcategorylist()
    },
    methods:{
     async getcategorylist(){
      const res = await this.$http.get('categories',{params:this.queryInfo})
       if(res.status !== 200){
        return this.$message.error('获取错误')
       }
       // console.log(res)
       this.catelist = res.data.data.result
       this.total = res.data.data.total
      },
      handleSizeChange(val){
       this.queryInfo.pagesize = val;
       this.getcategorylist()
      },
      handleCurrentChange(val){
        this.queryInfo.pagenum = val;
        this.getcategorylist()
      },
      showcategorydialog(){
       this.addcategorydialog = true;
       this.getparentlist()
      },
    //  获取父级分类的数据列表
      async getparentlist(){
       const res = await this.$http.get('categories',{params:{type:2}})
       if(res.status !== 200){
         return this.$message.error('获取错误')
       }
       // console.log(res)
        this.parentlist = res.data.data
        // console.log(this.parentlist)
      },
      handleChange(){
       if(this.selectedcascader.length>0){
         this.categoryForm.cat_pid = this.selectedcascader[this.selectedcascader.length - 1]
         this.categoryForm.cat_level = this.selectedcascader.length
       }else {
         this.categoryForm.cat_pid = 0
         this.categoryForm.cat_level = 0
       }
      },
      resetdialog(){
        this.$refs.categoryFormref.resetFields()
        this.selectedcascader = []
        this.categoryForm.cat_pid = 0
        this.categoryForm.cat_level = 0
      },
      addcate(){
        this.$refs.categoryFormref.validate(async valid=>{
          if(!valid) return
          const res = await this.$http.post('categories',this.categoryForm)
          if(res.status !== 200){
            return this.$message.error('获取错误')
          }
          this.$message.success('添加成功')
          this.getcategorylist()
          this.addcategorydialog = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
 .el-row{
    margin-bottom: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>