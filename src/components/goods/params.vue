<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <el-alert class="cat_alert" show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!--选择商品分类区域-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类级联选择框-->
          <el-cascader v-model="value" :options="goodslist" :props="goodsProps" @change="selectedgoodschange"></el-cascader>
        </el-col>
      </el-row>
      <!--tab页签区-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button class="changebtn" type="primary" size="mini" :disabled="isdisabled" @click="showaddparams">添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="closetag(index,scope.row)">{{item}}</el-tag>

                <!--new tag-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeditdialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeparams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button class="changebtn" type="primary" size="mini" :disabled="isdisabled" @click="showaddparams">添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!--new tag-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeditdialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeparams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加属性对话框-->
    <el-dialog :title="'添加'+nametext" :visible.sync="addparamsdialog" width="50%" @close="resetaddparamsdialog">
      <el-form :model="addparamsform" :rules="addparamsrules" ref="addparamsref" label-width="100px" >
        <el-form-item :label="nametext" prop="attr_name">
          <el-input v-model="addparamsform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addparamsdialog = false">取 消</el-button>
    <el-button type="primary" @click="addparamscheck">确 定</el-button>
  </span>
    </el-dialog>
    <!--编辑属性对话框-->
    <el-dialog :title="'编辑'+nametext" :visible.sync="editparamsdialog" width="50%" @close="reseteditparamsdialog">
      <el-form :model="editparamsform" :rules="editparamsrules" ref="editparamsref" label-width="100px" >
        <el-form-item :label="nametext" prop="attr_name">
          <el-input v-model="editparamsform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editparamsdialog = false">取 消</el-button>
    <el-button type="primary" @click="editparamscheck">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "params",
    data(){
      return{
        //商品分类列表
        goodslist:[],
      //  级联选择框分配对象
        goodsProps:{
          expandTrigger: 'hover',
          children:'children',
          label:'cat_name',
          value:'cat_id',
        },
        value:[],
        activeName:'many',
        manyTableData:[],
        onlyTableData:[],
        addparamsdialog:false,
        addparamsform:{
          attr_name:''
        },
        addparamsrules:{
          attr_name:[{required: true, message: '请输入要添加的属性名', trigger: 'blur'}]
        },
        //显示编辑属性对话框
        editparamsdialog:false,
        editparamsform:{
          attr_name:''
        },
        editparamsrules:{
          attr_name:[{required: true, message: '请输入要添加的属性名', trigger: 'blur'}]
        },

      }
    },
    created(){
      this.getcategorylist()
    },
    computed:{
      isdisabled(){
        if(this.value.length !== 3){
          return true
        }
        return false
      },
      cateid(){
        if(this.value.length === 3){
          return this.value[2]
        }
        return null
      },
      nametext(){
        if(this.activeName === 'many'){
          return '动态属性'
        }else {
          return '静态属性'
        }
      }
    },
    methods:{
     async getcategorylist(){
       const res = await this.$http.get('categories',{params:{type:3}})
       if(res.status !== 200){
         return this.$message.error('获取数据失败')
       }

       this.$message.success('获取数据成功')
       this.goodslist = res.data.data
       // console.log(res)
      },
     selectedgoodschange(){
       if(this.value.length !== 3){
         this.value = [];
         this.manyTableData = [];
         this.onlyTableData = []
         return
       }

       this.getattrfun()
      },
      handleClick(){
        this.getattrfun()
      },
     async getattrfun(){
        const res = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:this.activeName}})
        if(res.status !== 200){
          return this.$message.error('获取错误')
        }
        // console.log(res)
       res.data.data.forEach(item=>{
         if(item.attr_vals){
           item.attr_vals = item.attr_vals.split(' ')
         }else {
           item.attr_vals = []
         }
          item.inputVisible = false;
          item.inputValue = ''
       })
       if(this.activeName === 'many'){
          this.manyTableData = res.data.data;
          // console.log(this.manyTableData)
       }else {
          this.onlyTableData = res.data.data;
       }
      },
      showaddparams(){
       this.addparamsdialog = true
      },
      resetaddparamsdialog(){
       this.$refs.addparamsref.resetFields()
      },
      addparamscheck(){
       this.$refs.addparamsref.validate(async valid=>{
         if(!valid){
           return
         }
        const res = await this.$http.post(`categories/${this.cateid}/attributes`,{
          attr_name:this.addparamsform.attr_name,
          attr_sel:this.activeName
        })
         // console.log(res)
         if(res.data.meta.status !== 201){
           return this.$message.error('添加失败')
         }
         this.$message.success('添加成功')
         this.getcategorylist()
         this.addparamsdialog = false
       })
      },
      reseteditparamsdialog(){
       this.$refs.editparamsref.resetFields()
      },
      editparamscheck(){
        this.$refs.editparamsref.validate(async valid=>{
          if(!valid){
            return
          }
          const res = await this.$http.put(`categories/${this.cateid}/attributes/${this.editparamsform.attr_id}`,{
            attr_name:this.editparamsform.attr_name,
            attr_sel:this.activeName
          })

          if(res.status !== 200){
            return this.$message.error('修改失败')
          }
          this.$message.success('修改成功')
          this.getcategorylist()
        })
       this.editparamsdialog = false
      },
      async showeditdialog(id){
       const res = await this.$http.get(`categories/${this.cateid}/attributes/${id}`,{
          params:{attr_sel:this.activeName}
        })
        if(res.status !== 200){
         return this.$message.error('获取错误')
        }
        // console.log(res)
        this.editparamsform = res.data.data
        this.editparamsdialog = true
      },
       async removeparams(id){
       const res =  await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(e=>e)
         console.log(res)
         if(res !== 'confirm'){
         return this.$message.info('已经取消')
         }
         const result = await this.$http.get(`categories/${this.cateid}/attributes/${id}`)
         if(result.status !== 200){
         return this.$message.error('删除失败')
         }
         this.$message.success('删除成功')
         this.getcategorylist()
      },
    //  失去焦点或者点击enter键触发事件
      async handleInputConfirm(row){
       if(row.inputValue.trim().length === 0){
         row.inputVisible = '';
         row.inputVisible = false
         return
       }
        row.attr_vals.push(row.inputValue.trim())
        row.inputVisible = '';
        row.inputVisible = false

        const res = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })

        if(res.data.meta.status !== 200){
          return this.$message.error('修改参数失败')
        }else {
          this.$message.success('修改参数成功')
        }
      },
      //展示新tag
      showInput(row){
        row.inputVisible = true;
        //$nextTick是等页面重新被渲染后再执行函数里面的操作
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async closetag(index,row){
        row.attr_vals.splice(index,1)
        const res = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })

        if(res.data.meta.status !== 200){
          return this.$message.error('修改参数失败')
        }else {
          this.$message.success('修改参数成功')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
  .cat_alert{
    margin-bottom: 15px;
  }
  .changebtn{
    margin-bottom: 15px;
  }
  .el-tag{
    margin: 5px;
  }
  .input-new-tag{
  width: 120px;
}
</style>