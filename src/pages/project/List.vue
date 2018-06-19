<template>
  <div>
    <h2>项目列表
      <small>{{title}}</small>
    </h2>
    <el-table :data="projects" stripe :default-sort="{prop: 'id', order: 'descending'}" v-loading="loading"
              element-loading-text="玩命加载中">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="投资人" prop="username"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <Review :customer.sync="scope.row"
                  :disabled="!!scope.row.admin_id && scope.row.admin_id !== admin_id"></Review>
        </template>
      </el-table-column>
      <el-table-column label="奖金" prop="money"></el-table-column>
      <el-table-column label="创建日期" prop="created_at" width="160"></el-table-column>
      <el-table-column label="更新日期" prop="updated_at" width="160"></el-table-column>
      <el-table-column label="归属人" prop="belong_user">
        <template slot-scope="props">
          <router-link :to="{name: 'CustomerList', query: {user_id: props.row.user_id}}">{{props.row.belong_user}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="getDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pull-right">
      <el-pagination :page-sizes="[15, 30]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
                     :total="total" @current-change="changePage" @current-size="changeSize"></el-pagination>
    </div>
  </div>
</template>

<script>
  import project from '../../api/project'
  import auth from '../../api/auth'
  import Review from '@/components/Review'
  export default {
    data() {
      return {
        loading: false,
        title: '',
        total: 0,
        size: 15,
        projects: [],
        admin_id: 0
      }
    },
    watch: {
      async '$route'(to, from) {
        if (from.name !== 'CustomerDetail') {
          const query = this.$route.query
          this.status = query.status
          switch (this.status) {
            case 'review':
              this.title = '(审核中)'
              break
            case 'process':
              this.title = '(进行中)'
              break
            case 'invalid':
              this.title = '(无效)'
              break
            case 'success':
              this.title = '(成功)'
              break
            default:
              this.title = ''
              break
          }
          this.admin_id = await auth.getCurrentAdmin()
          this.userId = query.user_id
          this.$emit('updateHead')
          this.getProjectList({status: this.status, size: query.size, page: query.page, userId: query.user_id})
        }
      }
    },
    head: {
      title() {
        let title = ''
        switch (this.status) {
          case 'review':
            title = '审核中的项目列表'
            break
          case 'process':
            title = '进行中的项目列表'
            break
          case 'invalid':
            title = '无效的项目列表'
            break
          case 'success':
            title = '成功的项目列表'
            break
          default:
            title = '项目列表'
            break
        }
        return {
          inner: title
        }
      }
    },
    methods: {
      async getProjectList({status = '', page = 1}) {
        this.loading = true
        const data = await project.getList({page, status})
        this.total = data.total
        this.projects = data.data
        this.loading = false
      },
      getDetail(row) {
        this.$router.push({name: 'CustomerDetail', params: {id: row.id}})
      },
      changePage(page) {
        this.page = page
        this.$router.push({
          query: {
            userId: this.userId,
            page,
            size: this.size
          }
        })
      },
      changeSize(size) {
        this.size = size
        this.$router.push({
          query: {
            userId: this.userId,
            page: this.page,
            size: size
          }
        })
      }
    },
    components: {
      Review
    },
    async mounted() {
      this.admin_id = await auth.getCurrentAdmin()
      this.getProjectList({})
    }
  }
</script>
