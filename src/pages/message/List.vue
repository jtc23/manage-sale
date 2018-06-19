<template>
  <div>
    <div class="messages">
      <div class="pull-right">
        <transition name="el-fade-in">
          <el-button type="primary" size="mini" plain v-show="mutipleDel" @click="handleMultipeDel">批量删除</el-button>
        </transition>
        <refresh :loading="refreshLoading" @refresh="refresh" type="danger"></refresh>
      </div>
      <h2>消息中心</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabs" :name="item.name" :key="index">
        <span slot="label">
          <el-badge :value="item.total" :max="99" class="item">{{item.title}}</el-badge>
        </span>
          <list-table :messages="item.message" :type="item.name" :total="item.total" :loading="item.loading"
                      @select="handleSelect"
                      @delSuccess="handleDelSuccess" @changePage="changePage"></list-table>
        </el-tab-pane>
      </el-tabs>
    </div>
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
        title: '',
        activeName: 'all',
        mutipleDel: false,
        selections: [],
        refreshLoading: false,
        page: 1,
        size: 15,
        tabs: [{
          title: '全部消息',
          name: 'all',
          loading: false
        }, {
          title: '推荐消息',
          name: 'recommend',
          loading: false
        }, {
          title: '奖金消息',
          name: 'reward',
          loading: false
        }, {
          title: '红包消息',
          name: 'cash',
          loading: false
        }, {
          title: '其它',
          name: 'other',
          loading: false
        }]
      }
    },
    components: {
      ListTable,
      Refresh
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
      ...mapActions([
        'getMessages',
        'deleteMessages'
      ]),
      async handleClick(target) {
        this.page = 1
        this.$router.push({query: {page: 1}})
        target.index = parseInt(target.index, 10)
        this.tab = {
          name: target.name,
          index: target.index
        }
        this.type = target.name
        this.setData(target.index, target.name)
      },
      async setData(index, type) {
        this.$Progress.start()
        this.tabs[index].loading = true
        await this.getMessages({type, page: this.page})
        this.selections = []
        this.mutipleDel = false
        this.size = this.per_page
        this.tabs[index].message = this.messages
        this.tabs[index].total = this.total
        this.tabs[index].loading = false
        this.$Progress.finish()
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
      async handleMultipeDel() {
        const length = this.selections.length
        try {
          await this.$confirm(`确定要删除选中的${length}条数据吗？`, '提示')
          this.tabs[this.tab.index].loading = true
          await this.deleteMessages({ids: this.selections, type: this.type, page: this.page})
          //Notify.deleteNotifies(this.selections)
          if (this.deleteStatus !== 'failed') {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.tabs[this.tab.index].message = this.messages
          } else {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          }
          this.selections = []
          this.mutipleDel = false
          this.tabs[this.tab.index].loading = false
          this.handleClick({name: this.tab.name, index: this.tab.index})
        } catch (e) {
        }
      },
      handleDelSuccess() {
        this.handleClick(this.tab)
      },
      changePage(page) {
        this.page = page
        this.$router.push({
          query: {
            page
          }
        })
        this.setData(this.index, this.tab.name)
      },
      refreshAll() {
        this.tabs.forEach((tab, index) => {
          this.handleClick({name: tab.name, index})
        })
      },
      refresh() {
        this.refreshAll()
      }
    },
    async mounted() {
      if (this.$route.name === 'MessageList') {
        this.type = 'all'
        await this.refreshAll()
        this.tab = this.tabs[0]
        this.tab.index = 0
        this.index = 0
      }
    }
  }
</script>

<style lang="scss">
  .messages {
    .el-tabs__item {
      height: 50px;
      padding: 0 30px;
    }
    .item {
      margin-top: 10px;
      .el-badge__content {
        top: 4px;
      }
    }
  }
</style>
