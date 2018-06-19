<template>
  <div>
    <el-form inline size="mini" :model="searchInput" @submit.native.prevent="search">
      <el-form-item label="姓名">
        <el-input v-model="searchInput.username" placeholder="姓名" prefix-icon="el-icon-service"
                  @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search" :loading="searchLoading">查找</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="customers" stripe :default-sort="{prop: 'id', order: 'descending'}"
              v-loading="loading" element-loading-text="玩命加载中">
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="姓名" width="120" prop="username" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="avatar-wrapper" v-if="scope.row.username">
            <div class="avatar" v-lazy:background-image="scope.row.avatar_url">
            </div>
            <span class="text-primary" style="cursor: pointer;"
                  @click="getDetail(scope.row.user_id)">{{scope.row.username}}</span>
          </div>
          <el-tooltip class="item" effect="dark" content="未授权用户" placement="top-start" v-else>
            <div class="avatar-wrapper">
              <div class="avatar" v-if="scope.row.avatar_url" v-lazy:background-image="scope.row.avatar_url">
              </div>
              <div class="avatar" v-else v-lazy:background-image="baseImagePath+'default.jpg'">
              </div>
              <span class="text-warning" style="cursor: pointer;"
                    @click="getDetail(scope.row.user_id)">无名氏{{scope.row.user_id}}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="审核中" prop="review" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link
              :to="{name: 'CustomerList', query: {user_id: scope.row.user_id, status: 'review'}, params:{cache: false}}">
              {{scope.row.review ? scope.row.review : 0}}
            </router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="进行中" width="100" prop="process" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link
              :to="{name: 'CustomerList', query: {user_id: scope.row.user_id, status: 'process'}, params:{cache: false}}">
              {{scope.row.process ? scope.row.process : 0}}
            </router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="成功" prop="success" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link
              :to="{name: 'CustomerList', query: {user_id: scope.row.user_id, status: 'success'}, params:{cache: false}}">
              {{scope.row.success ? scope.row.success : 0}}
            </router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="无效" prop="invalid" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link
              :to="{name: 'CustomerList', query: {user_id: scope.row.user_id, status: 'invalid'}, params:{cache: false}}">
              {{scope.row.invalid ? scope.row.invalid : 0}}
            </router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="红包" width="120" prop="cash" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.totalCash ? scope.row.totalCash : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取红包" width="120" prop="receivedCash" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.receivedCash ? scope.row.receivedCash : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖金" width="120" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.totalReward ? scope.row.totalReward : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取奖金" width="120" prop="receivedMoney" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.receivedReward ? scope.row.receivedReward : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="showUserPie(scope.row)">图表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pull-right">
      <el-pagination :page-sizes="[15, 30, 45, 60]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
                     :total="total" @current-change="changePage"></el-pagination>
    </div>
    <UserDetail :userDetail="userDetail" :visible.sync="userDialogVisible" @close="userDialogVisible=false"
                :loading="userDetailLoading"></UserDetail>
    <el-dialog :visible="pieDialogVisible" @close="pieDialogVisible=false" v-loading="pieLoading"
               element-loading-text="玩命加载中">
      <StatusPie :data="pieUser" :title="pieTitle"></StatusPie>
    </el-dialog>
  </div>
</template>

<script>
  import user from '../../api/user'
  import UserDetail from '@/components/UserDetail'
  import StatusPie from '@/components/charts/StatusPie'
  import Env from '../../common/env'
  export default {
    data() {
      return {
        baseImagePath: Env.baseImagePath,
        searchLoading: false,
        searchInput: {},
        customers: [],
        userDetail: {},
        userDialogVisible: false,
        userDetailLoading: false,
        total: 0,
        pieTitle: '',
        pieUser: {},
        pieDialogVisible: false,
        pieLoading: false,
        loading: false,
        page: 1
      }
    },
    components: {
      UserDetail,
      StatusPie
    },
    methods: {
      async getDetail(id) {
        this.userDialogVisible = true
        this.userDetailLoading = true
        const {data} = await user.getUserDetail(id)
        this.userDetail = data
        this.userDetailLoading = false
      },
      async getUserList() {
        this.$Progress.start()
        this.mode = null
        this.loading = true
        const data = await user.getList({page: this.page})
        this.customers = data.data
        this.total = data.total
        this.loading = false
        this.$Progress.finish()
      },
      showUserPie(user) {
        this.pieDialogVisible = true
        this.pieLoading = true
        this.pieTitle = `用户${user.username}的推荐信息统计图表`
        this.pieUser = user
        this.pieLoading = false
      },
      async search() {
        this.mode = 'search'
        this.searchLoading = true
        this.loading = true
        try {
          const {data, total} = await user.getListByUserName({page: this.page, username: this.searchInput.username})
          this.customers = data
          this.total = total
        } catch (e) {
        }
        this.searchLoading = false
        this.loading = false
      },
      changePage(page) {
        this.page = page
        if (this.mode === null) {
          this.getUserList()
        } else if (this.mode === 'search') {
          this.search()
        }
      }
    },
    mounted() {
      if (this.$route.name === 'UserList') {
        //默认展示为非搜索
        this.mode = null
        this.getUserList()
      }
    }
  }
</script>
