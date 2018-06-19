<template>
  <div v-loading="loading" element-loading-text="玩命加载中">
    <el-row>
      <div>
        <el-radio v-model="type" label="circle" @changeShow="change">饼图</el-radio>
        <el-radio v-model="type" label="square" @changeShow="change">柱状图</el-radio>
      </div>
      <div class="pull-right">
        <el-radio v-model="days" :label="7" @change="change">最近7天</el-radio>
        <el-radio v-model="days" :label="30" @change="change">最近30天</el-radio>
      </div>
    </el-row>
    <transition name="el-zoom-in-center" mode="out-in">
      <statusPie :data="pieData" :title="title" v-if="type==='circle'"></statusPie>
      <StatusAlign :data="pieData" :title="title" v-if="type==='square'"></StatusAlign>
    </transition>
  </div>
</template>

<script>
  import StatusPie from '@/components/charts/StatusPie'
  import StatusAlign from '@/components/charts/StatusAlign'
  import customer from '../../api/customer'
  export default {
    data() {
      return {
        pieData: {},
        days: 7,
        title: '',
        type: 'circle',
        loading: false
      }
    },
    components: {
      StatusPie,
      StatusAlign
    },
    head: {
      title: {
        inner: '用户推荐信息分布图'
      }
    },
    mounted() {
      if (this.$route.name === 'DashBoard') {
        this.initData(this.days)
      }
    },
    methods: {
      async initData(days) {
        this.$Progress.start()
        try {
          this.loading = true
          const {data} = await customer.recommendsCount(days)
          this.title = '最近' + this.days + '天推荐信息状态分布'
          this.pieData = data ? data : {}
          this.loading = false
        } catch (e) {

        }
        this.$Progress.finish()
      },
      change(label) {
        this.days = label
        this.initData(this.days)
      },
      changeShow(label) {
        this.type = label
      }
    }
  }
</script>
