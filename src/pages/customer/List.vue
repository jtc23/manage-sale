<template>
  <div>
    <el-alert v-if="!isKnow" type="warning" show-icon title="为什么我不能操作？" close-text="我知道了"
              description="只有自己操作过的信息，或者未被其他管理员操作过的推荐信息才能进行操作哦！" @close="knowIt"></el-alert>
    <Refresh class="pull-right" type="danger" @refresh="refresh"></Refresh>
    <h2>{{title}}投资人列表</h2>
    <Search @data="handleSearchResult"></Search>
    <el-table :data="customers" stripe :default-sort="{prop: 'id', order: 'descending'}" class="customers">
      <el-table-column align="center" type="index" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="姓名" prop="username" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="getDetail(scope.row)">{{scope.row.username}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" sortable
                       :filters="[{text: '审核中', value:'review'},
                         {text: '进行中', value:'process'},
                         {text: '成功', value: 'success'},
                         {text: '无效', value: 'invalid'},
                         ]"
                       :filter-method="filterTag"
                       filter-placement="bottom-end"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 'review'" type="warning">待审核</el-tag>
          <el-tag size="small" v-if="scope.row.status === 'process'" type="primary">进行中</el-tag>
          <el-tag size="small" v-if="scope.row.status === 'success'" type="success">成功</el-tag>
          <el-tag size="small" v-if="scope.row.status === 'invalid'" type="info">无效</el-tag>
          <el-tag size="small" v-if="scope.row.status === 'conflict'" type="danger">冲突</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" prop="phone" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="位置" prop="location" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="意向" prop="intention" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{intention[scope.row.intention]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐时间" width="180" prop="created_at" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="归属人" prop="belong_user" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="goBelongList(scope.row.user_id, scope.row.belong_user)"
                     v-if="scope.row.belong_user">
            {{scope.row.belong_user}}
          </el-button>
          <el-tooltip class="item" effect="dark" content="未授权用户" placement="top-start" v-else>
            <el-button type="text" class="text-warning" @click="goBelongList(scope.row.user_id, scope.row.belong_user)">
              {{'无名氏' + scope.row.user_id}}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="handle_user" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="getDetail(scope.row)">详情</el-button>
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
  import auth from '../../api/auth'
  import Cache from '../../common/cache'
  import customer from '../../api/customer'
  import Search from '@/components/Search'
  import Refresh from '@/components/Refresh'
  import utils from '../../common/utils'
  export default {
    data() {
      return {
        isKnow: true,
        customers: [],
        intention: ['未知', '有原料', '有资金', '有能力'],
        total: 0,
        size: 15,
        title: '',
        admin_id: 0,
      }
    },
    components: {
      Search,
      Refresh
    },
    head: {
      title() {
        if (this.$route.name === 'CustomerTypeList') {
          return {
            inner: this.title + '投资人列表'
          }
        }
      }
    },
    watch: {
      async '$route'(to) {
        if (to.name === 'CustomerTypeList' || to.name === 'CustomerList') {
          this.getTitle()
          if (to.params.cache === false) {
            const urlQueries = this.checkUrlQuery()
            this.admin_id = await auth.getCurrentAdmin()
            this.getCustomers(urlQueries)
          }
        }
      }
    },
    methods: {
      getTitle() {
        switch (this.$route.params.status) {
          case 'review':
            this.title = '审核中的'
            break
          case 'process':
            this.title = '进行中的'
            break
          case 'success':
            this.title = '成功的'
            break
          case 'invalid':
            this.title = '无效的'
            break
          case 'conflict':
            this.title = '冲突的'
            break
          default:
            this.title = ''
        }
        this.$emit('updateHead')
      },
      handleSearchResult(res, queries) {
        this.customers = res.data && res.data.map(v => {
            v.location = utils.parseLocation(v.location)
            return v
          })
        this.total = res.total
        this.searchQueries = utils.parse(utils.stringify(queries))
        const urlQueries = this.getUrlQuery()
        this.$router.push({
          query: urlQueries
        })
      },
      /*async handleDel(index, row) {
       let loading
       try {
       await this.$confirm(`确认要删除“${row.username}”这个投资人吗？删除后将不可恢复，请谨慎操作！`, '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
       })
       try {
       loading = this.$loading({
       target: document.querySelector('.customers'),
       lock: true,
       text: '正在删除...',
       fullscreen: false
       })
       await customer.del(row.id)
       await this.customers.splice(index, 1)

       loading.close()
       this.$message({
       type: 'success',
       message: `成功删除“${row.username}”的推荐信息`
       })
       } catch (e) {
       loading.close()
       console.error(e)
       }
       } catch (e) {
       loading.close()
       console.error(e)
       }
       },*/
      getDetail(row) {
        this.$router.push({name: 'CustomerDetail', params: {id: row.id}})
      },
      filterTag(value, row) {
        return row.status === value
      },
      async handleReview(command) {
        let text = ''
        switch (command) {
          case 'process':
            text = '通过审核'
            break
          case 'success':
            text = '成功'
            break
          case 'invalid':
            text = '无效'
            break
        }
        await this.$confirm(`确定要标记这条信息为“${text}”状态吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.customers[this.index].status = command
        this.$message({
          type: 'success',
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: `成功标记推荐信息为“<strong>${text}</strong>”状态`
        })
      },
      async getCustomers({
                           username = null,
                           status = null,
                           phone = null,
                           permission = null,
                           intention = null,
                           admin_id = null,
                           user_id = null,
                           start = null,
                           end = null,
                           page = 1,
                           size = 15
                         }) {
        this.$Progress.start()
        const loading = this.$loading({
          target: document.querySelector('.customers'),
          fullscreen: false,
          lock: true,
          text: '玩命加载中...'
        })
        const data = await customer.search({
          username,
          status,
          phone,
          permission,
          intention,
          admin_id,
          user_id,
          start,
          end,
          page,
          size
        })
        data.data = data.data && data.data.map(v => {
            v.location = utils.parseLocation(v.location)
            return v
          })

        this.customers = data.data
        this.total = data.total
        loading.close()
        this.$Progress.finish()
      },
      goBelongList(userId) {
        this.userId = userId
        const urlQueries = this.getUrlQuery()
        this.$router.push({
          query: urlQueries,
          params: {
            cache: false
          }
        })
      },
      changePage(page) {
        this.page = page
        const urlQueries = this.getUrlQuery()
        this.$router.push({
          query: urlQueries,
          params: {
            cache: false
          }
        })
      },
      changeSize(size) {
        this.size = size
        const urlQueries = this.getUrlQuery()
        this.$router.push({
          query: urlQueries,
          params: {
            cache: false
          }
        })
      },
      knowIt() {
        Cache.setStore('isknow', 1)
        this.isKnow = true
      },
      getUrlQuery() {
        return Object.assign({
          user_id: this.userId,
          page: this.page,
          size: this.size,
          status: this.status
        }, this.searchQueries)
      },
      checkUrlQuery() {
        return {
          status: this.$route.query.status ? this.$route.query.status : this.$route.params.status,
          phone: this.$route.query.phone,
          userId: this.$route.query.user_id,
          page: this.$route.query.page,
          size: this.$route.query.size,
          username: this.$route.query.username,
          permission: this.$route.query.permission,
          intention: this.$route.query.intention,
          admin_id: this.$route.query.admin_id,
          user_id: this.$route.query.user_id,
          start: this.$route.query.start,
          end: this.$route.query.end,
        }
      },
      refresh() {
        const urlQueries = this.checkUrlQuery()
        this.getCustomers(urlQueries)
      }
    },
    async mounted() {
      if (!Cache.getStorage('isknow')) {
        this.isKnow = false
      }
      if (this.$route.name === 'CustomerList') {
        this.status = this.$route.query.status ? this.$route.query.status : this.$route.params.status
        this.getTitle()
        this.admin_id = await auth.getCurrentAdmin()
        const urlQueries = this.checkUrlQuery()
        this.getCustomers(urlQueries)
      }
    }
  }
</script>
