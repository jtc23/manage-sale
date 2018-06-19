<template>
  <div>
    <el-table :data="users" stripe :default-sort="{prop: 'id', order: 'descending'}"
              v-loading="loading" element-loading-text="玩命加载中">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <div class="avatar-wrapper">
            <div v-if="scope.row.avatar_url" class="avatar" v-lazy:background-image="scope.row.avatar_url">
            </div>
            <div v-else class="avatar" v-lazy:background-image="baseImagePath+'default.jpg'">
            </div>
            <el-button type="text" @click="showDetail(scope.row.id)" v-if="scope.row.username">
              {{scope.row.username}}
            </el-button>
            <el-tooltip class="item" effect="dark" content="未授权用户" placement="top-start" v-else>
              <el-button type="text" class="text-warning" @click="showDetail(scope.row.id)">
                无名氏{{scope.row.id}}
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">
          <span>
            <template v-if="scope.row.gender === 1">男</template>
            <template v-else-if="scope.row.gender === 2">女</template>
            <template v-else>未知</template>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="phone">
        <template slot-scope="scope">
          <span>
            <template v-if="scope.row.phone.length === 11">{{scope.row.phone}}</template>
            <template v-else>暂无</template>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" prop="last_login"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row.id)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pull-right">
      <el-pagination :page-sizes="[15, 30, 45, 60]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <UserDetail :userDetail="userDetail" :visible.sync="userDialogVisible" @close="userDialogVisible=false"
                :loading="userDetailLoading"></UserDetail>
  </div>
</template>

<script>
  import user from '../../api/user'
  import UserDetail from '@/components/UserDetail'
  import Env from '../../common/env'
  export default {
    data() {
      return {
        baseImagePath: Env.baseImagePath,
        loading: false,
        users: [],
        total: 0,
        userDetail: {},
        userDialogVisible: false,
        userDetailLoading: false,
      }
    },
    components: {
      UserDetail
    },
    methods: {
      async showDetail(id) {
        this.userDialogVisible = true
        const {data} = await user.getUserDetail(id)
        this.userDetail = data
      },
      async getUserList({page = 1, size = 15}) {
        this.$Progress.start()
        this.loading = true
        const data = await user.getAllUserList({page, size})
        this.users = data.data
        this.total = data.total
        this.loading = false
        this.$Progress.finish()
      }
    },
    mounted() {
      if (this.$route.name === 'AllUserList') {
        this.getUserList({})
      }
    }
  }
</script>
