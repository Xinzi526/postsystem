<template>
  <div>
    <el-row :gutter="120" style="margin-bottom: 60px; margin-top: 30px">
      <el-col :span="12">
        <el-card style="color: #409EFF;margin-left: 100px;">
          <div><i class="el-icon-user-solid"/>  用户总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            10
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="color: #F56C6C;margin-right: 100px;">
          <div><i class="el-icon-office-building"/>  帖子总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            12
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="12">
          <div id="main" style="width: 500px; margin-left: 80px;height: 400px"></div>
      </el-col>
      <el-col :span="12">
          <div id="pie" style="width: 500px; margin-left: 60px;height: 400px"></div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "Home",
  data(){
    return{

    }
  },
  mounted() { //页面元素渲染之后又再触发
    var option = {
      title: {
        text: '各季度用户数量统计',
        subtext: '趋势图',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'line'
        },
        {
          data: [],
          type: 'bar'
        }
      ]
    };


    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    this.request.get("/echarts/members").then(res => {
      // 填空
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data
      // 数据准备完毕之后再set
      myChart.setOption(option);
// 饼图

      var pieOption = {
        title: {
          text: '各季度用户数量统计',
          subtext: '比例图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'inner', //标签的位置
                textStyle : {
                  fontWeight : 300 ,
                  fontSize : 14,    //文字的字体大小
                  color: "#fff"
                },
                formatter:'{d}%'
              }
            },
            data: [],  // 填空
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      var pieDom = document.getElementById('pie');
      var pieChart = echarts.init(pieDom);

      this.request.get("/echarts/members").then(res => {

        pieOption.series[0].data = [
          {name: "第一季度", value: res.data[0]},
          {name: "第二季度", value: res.data[1]},
          {name: "第三季度", value: res.data[2]},
          {name: "第四季度", value: res.data[3]},
        ]
        pieChart.setOption(pieOption)
      })
    })
  }
}
</script>

<style>

</style>