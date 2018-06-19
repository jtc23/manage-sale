<template>
  <div>
    <el-button class="pull-right" size="mini" icon="el-icon-circle-plus" plain
               @click="$router.push({name: 'ArticleAdd'})">添加规则
    </el-button>
    <refresh class="pull-right" style="margin-right: 5px;" @refresh="refresh"></refresh>
    <h2>规则列表</h2>
    <el-table :data="posts" class="posts-wrapper">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <router-link :to="{name: 'ArticleDetail', params: {id: scope.row.id}}">{{scope.row.title}}</router-link>
          <el-tag size="mini" v-if="scope.row.url">自定义</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="admin_id" label="发布人" width="150"></el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="200"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({name: 'ArticleEdit', params: {id: scope.row.id}, cache: false})">
            编辑
          </el-button>
          <el-button type="text" @click="delPost(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pull-right">
      <el-pagination :page-sizes="[15, 30]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
                     :total="total" @current-change="changePage" @size-change="changeSize"></el-pagination>
    </div>
  </div>
</template>
<script>
  import Refresh from '@/components/Refresh'
  import Post from '../../api/post'
  export default {
    data() {
      return {
        posts: [],
        size: 15,
        total: 0,
        refreshText: '刷新',
        refreshDisable: false
      }
    },
    components: {
      Refresh
    },
    watch: {
      '$route'(to) {
        if (to.params.cache === false && to.name === 'ArticleList') {
          this.getPostList({})
        }
      }
    },
    methods: {
      async getPostList({page = 1, size = 15}) {
        this.$Progress.start()
        const loading = this.$loading({
          target: document.querySelector('.posts-wrapper'),
          text: '玩命加载中',
          fullscreen: false,
          lock: true
        })
        try {
          const res = await Post.getList({page, size})
          this.$router.push({
            query: {
              page: page,
              size: size
            }
          })
          this.posts = res.data
          this.total = res.total
          loading.close()
        } catch (e) {
          loading.close()
        }
        this.$Progress.finish()
      },
      async delPost(id) {
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
          await Post.delPost(id)
          this.$message.success('删除成功')
          this.getPostList({})
        } catch (e) {
        }
        loading.close()
      },
      changePage(page) {
        this.page = page
        this.getPostList({page: this.page, size: this.size})
      },
      changeSize(size) {
        this.size = size
        this.getPostList({page: this.page, size: this.size})
      },
      refresh() {
        this.getPostList({})
      }
    },
    created() {
      if (this.$route.name === 'ArticleList') {
        this.getPostList({})
      }
    }
  }

</script>
