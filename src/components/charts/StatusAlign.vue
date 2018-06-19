<template>
  <div class="status-align">
    <div id="statusalign" style="width: 90%;height: 450px;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/component/title'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'

  export default {
    mounted() {
      this.myChart = echarts.init(document.getElementById('statusalign'))
      this.initData()
    },
    props: ['data', 'title'],
    methods: {
      initData() {
        const option = {
          color: ['#3398DB'],
          title: {
            text: this.title,
            subtext: '用户推荐信息',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
              type: 'category',
              data: ['审核中', '进行中', '成功', '无效'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '数量',
              type: 'bar',
              barWidth: '60%',
              data: [this.data.review, this.data.process, this.data.success, this.data.invalid]
            }
          ]
        }
        this.myChart.setOption(option)
      }
    },
    watch: {
      data() {
        this.initData()
      }
    }
  }
</script>
