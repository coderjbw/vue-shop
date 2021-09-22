<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false">
      </el-alert>
      <!--步骤条-->
      <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tabs栏-->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px" label-position="top">
          <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeaveTabs" @tab-click="tabitemclick">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader v-model="addForm.goods_cat" :options="goodslist" :props="goodscatprops"
                        @change="handleChange"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="subitem" v-for="(subitem,index) in item.attr_vals" :key="index" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                      list-type="picture" :headers="headerobj" :on-success="successload">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button class="addbtn" type="primary" size="mini" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
      </el-form>
    </el-card>
    <!--对话框-->
    <el-dialog title="图片预览" :visible.sync="previewshow" width="50%">
      <img :src="previewPath" class="preimg">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: "add",
    data(){
      return{
        activeIndex:'0',
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_number:0,
          goods_weight:0,
          goods_cat:[],
          goods_introduce:'',
          attrs:[]
        },
        addFormrules:{
          goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' },],
          goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' },],
          goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' },],
          goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' },],
          goods_cat:[{ required: true, message: '请选择商品类别', trigger: 'blur' },]
        },
        goodslist:[],
        goodscatprops:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        manyTableData:[],
        onlyTableData:[],
        uploadUrl:'https://www.liulongbin.top:8888/api/private/v1/upload',
        headerobj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        previewPath:'',
        previewshow:false
      }
    },
    created(){
      this.getcategorylist()
    },
    computed:{
      cateid(){
        if(this.addForm.goods_cat.length === 3){
          return this.addForm.goods_cat[2]
        }else {
          return null
        }
      }
    },
    methods:{
      async getcategorylist(){
        const res = await this.$http.get('categories')
        if(res.status !== 200){
          return this.$message.error('获取数据失败')
        }

        this.$message.success('获取数据成功')
        this.goodslist = res.data.data
        // console.log(this.goodslist)
      },
      handleChange(){
        if(this.addForm.goods_cat.length !== 3){
          this.addForm.goods_cat = []
        }
        // console.log(this.addForm.goods_cat)
      },
      beforeLeaveTabs(activeTabs,oldActiveTabs){
        if(this.addForm.goods_cat.length !== 3 && oldActiveTabs === '0'){
          this.$message.error('请完整填完基本信息')
          return false
        }
      },
      async tabitemclick(){
        if(this.activeIndex === '1'){
          const res = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{
            sel:'many'}})
          if(res.status !== 200){
            return this.$message.error('获取动态列表失败')
          }
          // console.log(res)
          res.data.data.forEach(item=>{
            if(item.attr_vals.length === 0){
              item.attr_vals = []
            }else {
              item.attr_vals = item.attr_vals.split(' ')
            }
          })
          this.manyTableData = res.data.data
          console.log(this.manyTableData)
        }else if(this.activeIndex === '2'){
          const res = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{
              sel:'only'}})
          if(res.status !== 200){
            return this.$message.error('获取静态列表失败')
          }
          this.onlyTableData = res.data.data
          console.log(this.onlyTableData)
        }
      },
      handlePreview(res){
        this.previewPath = res.response.data.url
        this.previewshow = true
      },
      handleRemove(file){
        console.log(file)
        const filePath = file.response.data.tmp_path
        const i = this.addForm.pics.findIndex(x=>x.pic === filePath)
        this.addForm.pics.splice(i,1)
      },
      successload(response){
        console.log(response)
        const picInfo = {pic:response.data.tmp_path}
        this.addForm.pics.push(picInfo)
      },
       add(){
        this.$refs.addFormref.validate(async valid=>{
          if(!valid){
            return this.$message.error('请填写必要的表单项')
          }
          let res = _.cloneDeep(this.addForm)
          // let res = this.deepclone(this.addForm)
          res.goods_cat = res.goods_cat.join(',')
          // console.log(res)
          this.manyTableData.forEach(item=>{
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyTableData.forEach(item=>{
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          res.attrs = this.addForm.attrs;
          const result = await this.$http.post('goods',res);
          console.log(result)
          if(result.status !== 200){
            return this.$message.error('添加失败')
          }
          this.$message.success('添加成功');
          this.$router.push('/goods')
          console.log(result)
        })
      },
      deepclone(obj){
        if(typeof obj !== 'object'){
          return obj
        }else{
          let result;
          if(obj instanceof Array){
            result = []
          }else{
            result = {}
          }
          for(let key in obj){
            if(typeof obj[key] === 'object'){
              result[key] = this.deepclone(obj[key])
            }else{
              result[key] =  obj[key]
            }
          }
          return result
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
  .el-alert{
    margin-bottom: 15px;
  }
.el-steps{
  margin: 5px 0;
}
.steps{
  font-size: 13px;
}
  .el-step__title{
    font-size: 13px;
  }
  .el-checkbox{
    margin: 0 10px 0 0px!important;
  }
  .preimg{
    width: 100%;
    height: 100%;
  }
.addbtn{
  margin-top: 15px;
}
</style>