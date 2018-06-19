<template>
  <div class="messages">
    <div class="pull-right">
      <transition name="el-fade-in">
        <el-button type="primary" size="mini" plain v-show="mutipleDel" @click="handleMultipeDel">批量删除</el-button>
      </transition>
      <refresh :loading="refreshLoading" @refresh="refresh" type="danger"></refresh>
    </div>
    <h2>{{title}}</h2>
    <list-table :messages="messages" :type="$route.params.type" :total="total" :loading="loading"
                @select="handleSelect"
                @delSuccess="handleDelSuccess" @changePage="changePage"></list-table>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import Refresh from '@/components/Refresh'
  import ListTable from './ListTable.vue'
  import Notify from '../../api/notify'
  export default {
    data() {
      return {
        page: 1,
        size: 15,
        selections: [],
        refreshLoading: false,
        mutipleDel: false,
        loading: false,
        title: ''
      }
    },
    head: {
      title() {
        return {
          inner: this.title
        }
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'MessageSingleList') {
          this.type = to.params.type
          this.getTitle()
          this.getMessages({type: to.params.type, page: this.page})
        }
      }
    },
    components: {
      Refresh,
      ListTable
    },
    computed: {
      ...mapGetters({
        messages: 'messages',
        total: 'total',
        per_page: 'per_page',
        deleteStatus: 'deleteStatus'
      })
    },
    methods: {
      ...mapActions({
        getTypeMessages: 'getMessages',
        deleteMessages: 'deleteMessages'
      }),
      getTitle() {
        if (this.$route.name === 'MessageList' || this.$route.name === 'MessageSingleList') {
          switch (this.$route.params.type) {
            case 'recommend':
              this.title = '推荐消息'
              break
            case 'reward':
              this.title = '奖金消息'
              break
            case 'cash':
              this.title = '红包消息'
              break
            case 'other':
              this.title = '其他消息'
              break
            default:
              this.title = '全部消息'
              break
          }
          this.$emit('updateHead')
        }
      },
      async getMessages({type, page = 1}) {
        if (type) {
          this.$Progress.start()
          this.loading = true
          await this.getTypeMessages({type, page})
          this.loading = false
          this.$Progress.finish()
        }
      },
      async refresh() {
        this.refreshLoading = true
        await this.getMessages({type: this.type, page: this.page})
        this.refreshLoading = false
      },
      async handleMultipeDel() {
        const length = this.selections.length
        try {
          await this.$confirm(`确定要删除选中的${length}条数据吗？`, '提示')
          this.loading = true
          await this.deleteMessages({ids: this.selections, page: this.page})
          if (this.deleteStatus !== 'failed') {
            await this.getTypeMessages({type: this.type, page: this.page})
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          }
          this.selections = []
          this.mutipleDel = false
          this.loading = false
        } catch (e) {
        }
      },
      handleSelect(selection) {
        if (selection.length > 1) {
          this.mutipleDel = true
          this.selections = selection.map(v => {
            return v.id
          })
        } else {
          this.mutipleDel = false
        }
      },
      handleDelSuccess() {
        this.getMessages({type: this.type, page: this.page})
        this.$router.push({
          query: {
            page
          }
        })
      },
      changePage(page) {
        this.page = page
        this.getMessages({type: this.type, page: this.page})
        this.$router.push({
          query: {
            page
          }
        })
      }
    },
    created() {
      if (this.$route.name === 'MessageSingleList') {
        this.type = this.$route.params.type
        this.getTitle()
        this.getMessages({type: this.$route.params.type, page: this.page})
      }
    }
  }
</script>
