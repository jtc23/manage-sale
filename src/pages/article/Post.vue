<template>
  <div class="post-wrapper">
    <el-row>
      <el-col :span="18">
        <div class="handle">
          <el-button @click="editPost" type="primary" size="mini">编辑</el-button>
          <el-button @click="delPost" type="danger" size="mini">删除</el-button>
        </div>
        <blockquote v-if="customUrl">{{customUrl}}</blockquote>
        <h1>{{post.title}}</h1>
        <div class="content" v-html="post.content"></div>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Post from '../../api/post'
  export default {
    data() {
      return {
        post: {},
        customUrl: ''
      }
    },
    watch: {
      '$route'() {
        this.getPost()
      }
    },
    head: {
      title() {
        return {
          inner: this.post.title
        }
      }
    },
    methods: {
      async getPost() {
        const loading = this.$loading({
          target: document.querySelector('.post-wrapper'),
          text: '玩命加载中',
          fullscreen: false
        })
        try {
          const {data} = await Post.getPost(this.$route.params.id)
          if (data.url) {
            this.customUrl = Post.getPostUrlCustom(data.url)
          }
          this.post = data
          this.$emit('updateHead')
        } catch (e) {
        }
        loading.close()
      },
      editPost() {
        this.$router.push({
          name: 'ArticleEdit',
          params: {
            id: this.$route.params.id,
            mode: 'edit',
            post: this.post
          }
        })
      },
      async delPost() {
        await this.$confirm(`确认要删除这篇文章吗？删除后将不可恢复，请谨慎操作！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const loading = this.$loading({
          target: document.querySelector('.posts-wrapper'),
          text: '正在删除'
        })
        try {
          await Post.delPost(this.$route.params.id)
          this.$message.success('删除成功')
          this.$router.push({name: 'ArticleList', params: {cache: false}})
        } catch (e) {
        }
        loading.close()
      }
    },
    created() {
      this.getPost()
    }
  }
</script>
