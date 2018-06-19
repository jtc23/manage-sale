<template>
  <div>
    <el-table :data="messages" empty-text="暂无消息" v-loading="loading" element-loading-text="玩命加载中"
              @select="handleSelect" @select-all="handleSelect">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
        <span v-if="scope.row.type === 'recommend'"><el-tag size="mini" class="notify-tag">推荐</el-tag>用户<el-button
          type="text"
          @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}了<el-button
          type="text"
          @click="goRecommendDetail(scope.row.notify.target)">{{scope.row.targets}}</el-button>的{{scope.row.target_type}}信息</span>
          <span v-if="scope.row.type === 'user'"><el-tag size="mini" type="success" class="notify-tag">用户</el-tag>用户<el-button
            type="text"
            @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}了个人信息</span>
          <span v-if="scope.row.type === 'article'"><el-tag size="mini" type="info" class="notify-tag">文章</el-tag>用户<el-button
            type="text"
            @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}了文章<el-button
            type="text" @click="getPostDetail(scope.row.notify.target)">{{scope.row.targets}}</el-button></span>
          <span v-if="scope.row.type === 'progress'"><el-tag size="mini" type="warning" class="notify-tag">进展</el-tag>用户<el-button
            type="text"
            @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}了<el-button
            type="text"
            @click="goRecommendDetail(scope.row.targets.id)">{{scope.row.targets.username}}</el-button>的进展信息</span>
          <span v-if="scope.row.type === 'cash'"><el-tag size="mini" type="danger" class="notify-tag">红包</el-tag>用户<el-button
            type="text"
            @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}了<el-button
            type="text"
            @click="goRecommendDetail(scope.row.targets.id)">{{scope.row.targets.username}}</el-button>的红包</span>
          <span v-if="scope.row.type === 'private'"><el-tag size="mini" class="notify-tag">私信</el-tag>用户<el-button
            type="text"
            @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}的一条信息</span>
          <span v-if="scope.row.type === 'reward'"><el-tag size="mini" type="danger" class="notify-tag">奖金</el-tag>用户<el-button
            type="text"
            @click="showDetail(scope.row.notify.sender)">{{scope.row.username ? scope.row.username : '无名氏'+scope.row.notify.sender}}</el-button>{{scope.row.action}}了<el-button
            type="text"
            @click="goRecommendDetail(scope.row.targets.id)">{{scope.row.targets.username}}</el-button>的奖金</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="160">
        <template slot-scope="scope"><span>{{scope.row.notify.created_at}}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteNotify(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pull-right">
      <el-pagination :page-sizes="[15]" layout="total, prev, pager, next"
                     :total="total" @current-change="changePage" :page-size="15"></el-pagination>
    </div>
    <user-detail :userDetail="userDetail" :visible.sync="userDialogVisible" @close="userDialogVisible=false"
                 :loading="userDetailLoading"></user-detail>
  </div>
</template>

<script>
  import Notify from '../../api/notify'
  import User from '../../api/user'
  import UserDetail from '@/components/UserDetail'
  export default {
    props: ['messages', 'type', 'total', 'loading'],
    data() {
      return {
        userDetail: {},
        userDialogVisible: false,
        userDetailLoading: false,
      }
    },
    components: {
      UserDetail
    },
    methods: {
      goRecommendDetail(id) {
        this.$router.push({name: 'CustomerDetail', params: {id, cache: false}})
      },
      async showDetail(id) {
        this.userDialogVisible = true
        const {data} = await User.getUserDetail(id)
        this.userDetail = data
      },
      getPostDetail(id) {
        this.$router.push({name: 'ArticleDetail', params: {id, cache: false}})
      },
      async deleteNotify(id) {
        try {
          await this.$confirm('确认要删除这条消息吗？')
          Notify.deleteNotifies(id)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.$emit('delSuccess')
        } catch (e) {
        }
      },
      handleSelect(selection) {
        this.$emit('select', selection)
      },
      changePage(page) {
        this.$emit('changePage', page)
      }
    },
    mounted() {
      //this.getMessagesTitle()
    }
  }
</script>
