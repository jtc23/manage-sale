<template>
  <div class="filters" v-if="filterTags.length > 0">
    <span>筛选条件：</span>
    <el-tag v-for="(tag, index) in filterTags" :key="index" closable :type="filterColor" @close="handleClose(tag)">
      {{tagName(tag.key)}}
    </el-tag>
  </div>
</template>

<script>
  export default {
    props: ['filterTags'],
    computed: {
      filterColor() {
        const index = parseInt(Math.random() * 5)
        const colors = ['', 'success', 'info', 'warning', 'danger']
        return colors[index]
      }
    },
    methods: {
      tagName(key) {
        switch (key) {
          case 'belong':
            return '归属人'
          case 'userId':
            return '用户'
          case 'status':
            return '审核状态'
        }
      },
      handleClose(tag) {
        this.filterTags.splice(this.filterTags.indexOf(tag), 1)
        this.$emit('close', tag)
      }
    }
  }
</script>
