<template>
  <div>
    <el-form inline :mode="searchInput">
      <el-form-item label="申请状态：">
        <el-select v-model="searchInput.status" placeholder="是否申请" size="mini">
          <el-option label="不限" value=""></el-option>
          <el-option label="已申请" value="receive"></el-option>
          <el-option label="未申请" value="not_receive"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型：" v-if="!$route.params.type">
        <el-select v-model="searchInput.species" placeholder="选择一种类型" size="mini">
          <el-option label="不限" value=""></el-option>
          <el-option label="红包" value="cash"></el-option>
          <el-option label="奖金" value="reward"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" icon="el-icon-search" type="primary" @click="search" :loading="isLoading"></el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" class="loading">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="recommend_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope" show-overflow-tooltip>
          <span v-if="scope.row.recommend_status === 'review'" class="text-warning"><i
            class="icon el-icon-info"></i>待审核</span>
          <span v-if="scope.row.recommend_status === 'process'" class="text-primary"><i
            class="icon el-icon-time"></i>进行中</span>
          <span v-if="scope.row.recommend_status === 'success'" class="text-success"><i
            class="icon el-icon-success"></i>已成功</span>
          <span v-if="scope.row.recommend_status === 'invalid'" class="text-info"><i
            class="icon el-icon-error"></i>无效</span>
          <span v-if="scope.row.recommend_status === 'conflict'" class="text-danger"><i
            class="icon el-icon-warning"></i>冲突</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.species === 'cash'">{{scope.row.money}}<span class="text-danger">（红包）</span></span>
          <span v-if="scope.row.species === 'reward'">{{scope.row.money}}<span class="text-danger">（奖金）</span></span>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="recommend_phone" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否申请" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'not_receive'"><span class="text-warning">未申请</span></div>
          <div v-if="scope.row.status === 'receive'"><span class="text-danger">已申请</span></div>
        </template>
      </el-table-column>
      <el-table-column label="打款" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_remit === 0" type="danger" size="small">否</el-tag>
          <el-tag v-if="scope.row.is_remit === 1" type="success" size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐时间" prop="created_at" show-overflow-tooltip></el-table-column>
      <el-table-column label="归属人" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="goBelongList(scope.row.user_id)" v-if="scope.row.user_name">
            {{scope.row.user_name}}
          </el-button>
          <el-tooltip class="item" effect="dark" content="未授权用户" placement="top-start" v-else>
            <el-button type="text" class="text-warning" @click="goBelongList(scope.row.user_id)">
              {{'无名氏' + scope.row.user_id}}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="admin_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="getDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pull-right">
      <el-pagination :page-size="15" layout="total, prev, pager, next, jumper"
                     :total="total" @current-change="changePage"></el-pagination>
    </div>
  </div>
</template>
<script>
  import Review from '@/components/Review'
  import Cash from '../../api/cash'
  import Util from '../../common/utils'
  export default {
    data() {
      return {
        data: [],
        searchInput: {},
        page: 1,
        total: 0,
        isLoading: false,
        title: ''
      }
    },
    watch: {
      '$route'(to) {
        this.getTitle()
        if (to.params.cache === false && (to.name === 'MoneyList' || to.name === 'TypeMoneyList')) {
          if (to.params.type) {
            this.getData(to.params.type)
          } else {
            this.getData()
          }
        }
      }
    },
    head: {
      title() {
        if (this.$route.name === 'TypeMoneyList') {
          return {
            inner: this.title
          }
        }
      }
    },
    methods: {
      getTitle() {
        if (this.$route.name === 'MoneyList' || this.$route.name === 'TypeMoneyList') {
          switch (this.$route.params.type) {
            case 'cash':
              this.title = '红包管理'
              break
            case 'reward':
              this.title = '奖金管理'
              break
            default:
              this.title = '全部佣金'
              break
          }
          this.$emit('updateHead')
        }
      },
      getDetail(row) {
        this.$router.push({name: 'CustomerDetail', params: {id: row.recommend_id}})
      },
      async getData(species, status) {
        this.$Progress.start()
        this.isLoading = true
        const loading = this.$loading({
          target: document.querySelector('.loading'),
          fullscreen: false,
          text: '玩命加载中...'
        })
        this.$router.push({
          query: {
            page: this.page,
            species,
            status
          }
        })
        const {data, total} = await Cash.getCashes({
          page: this.page,
          species,
          status
        })
        if (data) {
          this.data = data.map(v => {
            v.recommend_location = Util.parseLocation(v.recommend_location)
            return v
          })
        } else {
          this.data = []
        }
        this.total = total
        loading.close()
        this.isLoading = false
        this.$Progress.finish()
      },
      changePage(page) {
        this.page = page
        this.getData(this.searchInput.species, this.searchInput.status)
      },
      search() {
        if (this.$route.params.type) {
          this.searchInput.species = this.$route.params.type
        }
        this.getData(this.searchInput.species, this.searchInput.status)
      },
      goBelongList(id) {
        this.$router.push({
          name: 'CustomerList',
          query: {
            user_id: id
          },
          params: {
            cache: false
          }
        })
      }
    },
    mounted() {
      if (this.$route.name === 'MoneyList' || this.$route.name === 'TypeMoneyList') {
        this.getTitle()
        const type = this.$route.params.type ? this.$route.params.type : this.searchInput.species
        this.getData(type, this.searchInput.status)
      }
    }
  }
</script>
