<template>
  <el-container class="flex-column align-center error404">
    <h1 class="title">404</h1>
    <div class="content">
      <p>你要找的页面走丢了，
        <el-button type="text" @click="$router.go(-1)">返回上一级</el-button>
      </p>
    </div>
  </el-container>
</template>

<style lang="scss">
  .el-container.error404 {
    .title {
      font-size: 230px;
      margin-bottom: 20px;
    }
    .content {
      p {
        font-size: 16px;
      }
    }
  }

</style>
