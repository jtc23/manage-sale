<template>
  <div>
    <el-form inline :mode="simpleSearchInput">
      <el-row>
        <el-form-item label="姓名">
          <el-input v-model="simpleSearchInput.username" placeholder="姓名" size="mini"
                    @keyup.enter.native="simpleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="simpleSearchInput.status" placeholder="推荐状态" size="mini">
            <el-option label="不限" value=""></el-option>
            <el-option label="审核中" value="review"></el-option>
            <el-option label="进行中" value="process"></el-option>
            <el-option label="成功" value="success"></el-option>
            <el-option label="冲突" value="conflict"></el-option>
            <el-option label="无效" value="invalid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="simpleSearchInput.permission" placeholder="操作权限" size="mini">
            <el-option label="不限" value=""></el-option>
            <el-option label="我可以操作的数据" value="1"></el-option>
            <el-option label="我不可以操作的数据" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" size="mini" :loading="simpleSearchLoading" @click="simpleSearch"
                     icon="el-icon-search"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" size="mini" @click="advancedSearchDialog = true">高级搜索
          </el-button>
          <el-button type="text" size="mini" :loading="simpleExportLoading" icon="el-icon-download" @click="exportData">
            导出数据
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog :visible="advancedSearchDialog" title="高级搜索" @close="advancedSearchDialog=false" class="search-dialog">
      <el-form :mode="advancedSearchInput" label-width="100px" size="small" @submit.native.prevent="advancedSearch">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input clearable v-model="advancedSearchInput.username" placeholder="用户名"
                        @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input clearable v-model="advancedSearchInput.phone" placeholder="电话"
                        @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核状态">
              <el-select v-model="advancedSearchInput.status" placeholder="推荐信息当前状态" class="full-width">
                <el-option label="不限" value=""></el-option>
                <el-option label="审核中" value="review"></el-option>
                <el-option label="进行中" value="process"></el-option>
                <el-option label="成功" value="success"></el-option>
                <el-option label="冲突" value="conflict"></el-option>
                <el-option label="无效" value="invalid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向">
              <el-select v-model="advancedSearchInput.intention" placeholder="用户意向" class="full-width">
                <el-option label="不限" value=""></el-option>
                <el-option label="未知" value="0"></el-option>
                <el-option label="有原料" value="1"></el-option>
                <el-option label="有资金" value="2"></el-option>
                <el-option label="有能力" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作员">
              <el-select v-model="advancedSearchInput.admin_id"
                         class="full-width"
                         filterable
                         remote
                         reserve-keyword
                         placeholder="请输入操作员昵称"
                         :remote-method="remoteHandleUserMethod"
                         :loading="handlerUserLoading">
                <el-option label="不限" value=""></el-option>
                <el-option
                  v-for="item in handleUserOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属人">
              <el-select v-model="advancedSearchInput.user_id"
                         class="full-width"
                         filterable
                         remote
                         reserve-keyword
                         placeholder="请输入归属人昵称"
                         :remote-method="remoteBelongUserMethod"
                         :loading="belongUserLoading">
                <el-option label="不限" value=""></el-option>
                <el-option
                  v-for="item in belongUserOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="推荐时间范围">
          <el-date-picker
            v-model="range"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="getDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="advanceLoading"
                     @click="advancedSearch">搜索
          </el-button>
          <el-button type="text" icon="el-icon-download" :loading="exportAdvancedLoading"
                     @click="exportDataAdvanced">
            导出数据
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import customer from '../api/customer'
  export default {
    data() {
      return {
        advancedSearchDialog: false,
        handlerUserLoading: false,
        exportAdvancedLoading: false,
        simpleSearchLoading: false,
        simpleExportLoading: false,
        belongUserLoading: false,
        advanceLoading: false,
        handleUserOptions: [],
        handleUserList: [],
        belongUserOptions: [],
        belongUserList: [],
        range: '',
        simpleSearchInput: {},
        advancedSearchInput: {},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '不限',
            onClick(picker) {
              const end = '';
              const start = '';
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(current) {
            return current > Date.now();
          }
        },
      }
    },
    directives: {
      waves
    },
    methods: {
      remoteHandleUserMethod(query) {
        if (query !== '') {
          this.handlerUserLoading = true
          this.getHandleUser(query)
          setTimeout(() => {
            this.handlerUserLoading = false
            this.handleUserOptions = this.handleUserList.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.handleUserOptions = []
        }
      },
      remoteBelongUserMethod(query) {
        if (query !== '') {
          this.belongUserLoading = true
          this.getBelongUser(query)
          setTimeout(() => {
            this.belongUserLoading = false
            this.belongUserOptions = this.belongUserList.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.belongUserOptions = []
        }
      },
      async getHandleUser(name) {
        const {data} = await customer.getHandleUsers(name)
        if (data) {
          this.handleUserList = data.map(function (item) {
            return {
              value: item.id,
              label: item.username
            }
          })
        }
      },
      async getBelongUser(name) {
        const {data} = await customer.getBelongUsers(name)
        if (data) {
          this.belongUserList = data.map(function (item) {
            return {
              value: item.id,
              label: item.nickname
            }
          })
        }
      },
      getDate(date) {
        this.advancedSearchInput.start = date[0]
        this.advancedSearchInput.end = date[1]
      },
      async simpleSearch() {
        this.$Progress.start()
        const queries = {
          status: this.simpleSearchInput.status,
          username: this.simpleSearchInput.username,
          permission: this.simpleSearchInput.permission
        }
        this.simpleSearchLoading = true
        const res = await customer.search(queries)
        this.simpleSearchLoading = false
        this.$emit('data', res, queries)
        this.$Progress.finish()
      },
      async advancedSearch() {
        this.$Progress.start()
        const loading = this.$loading({
          target: document.querySelector('.search-dialog'),
          text: '玩命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        this.advanceLoading = true
        const queries = {
          status: this.advancedSearchInput.status,
          phone: this.advancedSearchInput.phone,
          username: this.advancedSearchInput.username,
          intention: this.advancedSearchInput.intention,
          admin_id: this.advancedSearchInput.admin_id,
          user_id: this.advancedSearchInput.user_id,
          start: this.advancedSearchInput.start,
          end: this.advancedSearchInput.end
        }
        const res = await customer.search(queries)
        this.advancedSearchDialog = false
        this.advanceLoading = false
        loading.close()
        this.$emit('data', res, queries)
        this.$Progress.finish()
      },
      async exportData() {
        await this.$confirm('即将导出当前所有数据，数据较多，可能等待时间较长，确定要继续吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.simpleExportLoading = true
        setTimeout(() => {
          this.simpleExportLoading = false
          this.$message.success('导出成功')
        }, 2000)
      },
      async exportDataAdvanced() {
        await this.$confirm('即将按照当前设定的条件导出数据，确定要继续吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.exportAdvancedLoading = true
        setTimeout(() => {
          this.$message.success('导出成功')
          this.exportAdvancedLoading = false
          this.advancedSearchDialog = false
        }, 2000)
      },
      checkUrlQuery() {
        const queryParams = {
          status: this.$route.query.status,
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
        queryParams.username ? this.simpleSearchInput.username = queryParams.username : this.simpleSearchInput.username = ''
        queryParams.status ? this.simpleSearchInput.status = queryParams.status : ''
        queryParams.phone ? this.simpleSearchInput.phone = queryParams.phone : ''
        queryParams.permission ? this.simpleSearchInput.permission = queryParams.permission : null
        queryParams.username ? this.advancedSearchInput.username = queryParams.username : this.advancedSearchInput.username = ''
        queryParams.status ? this.advancedSearchInput.status = queryParams.status : ''
        queryParams.intention ? this.advancedSearchInput.intention = queryParams.intention : ''
      }
    },
    created() {
      //this.checkUrlQuery()
    }
  }
</script>
