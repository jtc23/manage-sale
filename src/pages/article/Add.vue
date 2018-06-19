<template>
  <div class="post">
    <h2>{{$route.params.id ? '规则修改' : '规则发布'}}</h2>
    <div class="entry">
      <el-input placeholder="标题" auto-complete="off" v-model="post.title" class="title"></el-input>
      <el-button @click="preview" size="mini" class="pull-right">预览</el-button>
      <vue-editor v-model="post.content"></vue-editor>
      <transition name="el-zoom-in-top">
        <el-input placeholder="自定义URL" auto-complete="off" v-model="post.url" class="url"
                  v-show="custom==='2'"></el-input>
      </transition>
    </div>
    <el-button type="primary" class="post-btn" @click="addPost" :loading="postLoading" v-if="this.$route.params.id">
      立即修改
    </el-button>
    <el-button type="primary" class="post-btn" @click="addPost" :loading="postLoading" v-else>立即发布</el-button>
    <el-button class="post-btn" @click="$router.go(-1)">返回</el-button>
    <div class="custom" v-if="!$route.params.id">
      <el-radio v-model="custom" label="1">默认URL</el-radio>
      <el-radio v-model="custom" label="2">自定义URL</el-radio>
    </div>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="70%"
      class="post-dialog"
      :before-close="handleClose">
      <h1>{{post.title}}</h1>
      <div v-html="post.content" class="content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {VueEditor} from 'vue2-editor'
  import Post from '../../api/post'

  export default {
    data() {
      return {
        post: {},
        postLoading: false,
        dialogVisible: false,
        custom: '1'
      }
    },
    components: {
      VueEditor
    },
    watch: {
      '$route'(to) {
        if(to.name === 'ArticleAdd' || to.name === 'ArticleEdit') {
          const mode = this.$route.params.mode
          if (mode === 'edit') {
            const post = this.$route.params.post
            this.post.title = post.title
            this.post.content = post.content
          }
        }
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
      },
      preview() {
        if (this.post.content) {
          this.dialogVisible = true
        }
      },
      async addPost() {
        if (this.post.content) {
          this.postLoading = true
          if (this.$route.params.id) {
            try {
              this.$Progress.start()
              await Post.updatePost({
                id: this.$route.params.id,
                title: this.post.title,
                content: this.post.content
              })
              this.$message.success('规则修改成功！')
              this.$Progress.finish()
              this.$router.push({name: 'ArticleList', params: {cache: false}})
            } catch (e) {
              this.$Progress.fail()
            }
          } else {
            try {
              this.$Progress.start()
              await Post.addPost({
                title: this.post.title,
                content: this.post.content,
                url: this.post.url
              })
              this.$message.success('规则发布成功！')
              this.$Progress.finish()
              this.$router.push({name: 'ArticleList', params: {cache: false}})
            } catch (e) {
              this.$Progress.fail()
            }
          }
          this.postLoading = false
        }
      },
      async getPost(id) {
        const loading = this.$loading({
          target: document.querySelector('.post'),
          text: '玩命加载中',
          fullscreen: false,
          lock: true
        })
        try {
          const {data} = await Post.getPost(id)
          this.post = data
        } catch (e) {
        }
        loading.close()
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.getPost(this.$route.params.id)
      }
    }
  }
</script>

<style lang="scss">
  .post {
    .title {
      margin-bottom: 10px;
    }
    .post-dialog .el-dialog__body {
      padding-top: 0;
    }
    .url {
      margin-top: 15px;
    }
    .custom {
      display: inline-block;
      margin-left: 20px;
    }
  }

  button.post-btn {
    margin-top: 20px;
  }

  .ql-editor {
    min-height: 280px;
  }
</style>
