<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="addressShow"></el-button>
          <el-button type="success" icon="el-icon-location-outline" size="mini" @click="progressShow"></el-button>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!--修改地址对话框-->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="reserdialog">
      <el-form :model="addressForm" :rules="addressFormrules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="citydata"
                  :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <!--展示物流进度对话框-->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline >
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
    <el-button @click="progressVisible = false">取 消</el-button>
    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import citydata from './citydata'
  export default {
    name: "Order",
    data(){
      return{
        queryInfo:{
          query:'',
          pagesize:10,
          pagenum:1
        },
        total:0,
        orderlist:[],
        addressVisible:false,
        addressForm:{
          address1:[],
          address2:''
        },
        addressFormrules:{
          address1:[{ required: true, message: '请选择地址', trigger: 'blur' },],
          address2:[{ required: true, message: '请输入详细地址', trigger: 'blur' },]
        },
        citydata:citydata,
        progressVisible:false,
        progressInfo:[]
      }
    },
    created(){
      this.getOrderList()
    },
    methods:{
     async getOrderList(){
        const res = await this.$http.get('orders',{params:this.queryInfo})
       if(res.status !== 200){
          return this.$message.error('获取订单列表失败')
       }else{
          // console.log(res)
         this.total = res.data.data.total
         this.orderlist = res.data.data.goods
       }
      },
      handleSizeChange(res){
       this.queryInfo.pagesize = res
        this.getOrderList()
      },
      handleCurrentChange(res){
        this.queryInfo.pagenum = res
        this.getOrderList()
      },
      addressShow(){
       this.addressVisible = true
      },
      reserdialog(){
       this.$refs.addressFormRef.resetFields()
      },
      async progressShow(){
       const res = await this.$http.get(`/kuaidi/804909574412544580`);
       if(res.status !== 200){
         return this.$message.error('获取物流资源失败')
       }
       // console.log(res)
       this.progressInfo = res.data.data
       this.progressVisible = true
      }
    }
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
  .el-cascader{
    width: 100%;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>