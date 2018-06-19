<template>
  <div class="status-pie">
    <div id="statuspie" style="width: 90%;height: 450px;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  //引入饼图
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'

  export default {
    mounted() {
      this.myChart = echarts.init(document.getElementById('statuspie'))
      this.initData()
    },
    props: ['data', 'title'],
    methods: {
      initData() {
        const option = {
          title: {
            text: this.title,
            subtext: '用户推荐信息',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['审核中', '进行中', '成功', '无效']
          },
          series: [
            {
              name: '数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: this.data.review, name: '审核中'},
                {value: this.data.process, name: '进行中'},
                {value: this.data.success, name: '成功'},
                {value: this.data.invalid, name: '无效'},
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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

<style lang="scss">
  .status-pie {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>
