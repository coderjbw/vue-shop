<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import _ from 'lodash'
  export default {
    name: "Report",
    data(){
      return{
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    created(){

    },
   async mounted(){
      let myChart = echarts.init(document.getElementById('main'));
      const res = await this.$http.get('reports/type/1')
      if(res.status !== 200){
        return this.$message.error('获取折线图数据失败')
      }
     const result =  _.merge(res.data.data,this.options)

      myChart.setOption(result);
    },
    methods:{}
  }
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
</style>