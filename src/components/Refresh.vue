<template>
  <el-button :size="size" icon="el-icon-refresh" :type="type" plain @click="refresh" :loading="loading"
             :timeout="timeout" :disabled="refreshDisable">{{refreshText}}
  </el-button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'primary'
      },
      size: {
        type: String,
        default: 'mini'
      },
      loading: {
        type: Boolean,
        default: false
      },
      timeout: {
        type: Number,
        default: 5000
      }
    },
    data() {
      return {
        refreshText: '刷新',
        refreshDisable: false
      }
    },
    methods: {
      refresh() {
        this.$emit('refresh')
        this.refreshText = 5
        this.refreshDisable = true
        const timer = window.setInterval(() => {
          this.refreshText -= 1
        }, 1000)
        window.setTimeout(() => {
          clearInterval(timer)
          this.refreshText = '刷新'
          this.refreshDisable = false
        }, this.timeout)
      }
    }
  }
</script>
