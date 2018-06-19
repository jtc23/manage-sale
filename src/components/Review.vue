<template>
  <div>
    <el-dropdown trigger="click" @command="handleReview">
      <el-button type="text" :disabled="disabled">
        <template v-if="customer.status === 'review'"><span class="text-warning"><i
          class="icon el-icon-info"></i>待审核</span></template>
        <template v-if="customer.status === 'conflict'"><span class="text-danger"><i
          class="icon el-icon-warning"></i>冲突信息</span></template>
        <template v-if="customer.status === 'process'"><span class="text-primary"><i
          class="icon el-icon-time"></i>进行中</span></template>
        <template v-if="customer.status === 'success'"><span class="text-success"><i
          class="icon el-icon-success"></i>成功</span></template>
        <template v-if="customer.status === 'invalid'"><span class="text-info"><i
          class="icon el-icon-error"></i>无效</span>
        </template>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="process"
                          :disabled="(customer.status === 'success' || customer.status === 'process')">
          <i class="el-icon-info text-primary"></i><span class="text-primary">通过审核</span>
        </el-dropdown-item>
        <el-dropdown-item command="conflict"
                          :disabled="(customer.status === 'conflict' || customer.status === 'success' || customer.status === 'invalid')">
          <i
            class="el-icon-warning text-danger"></i><span class="text-danger">冲突信息</span>
        </el-dropdown-item>
        <el-dropdown-item command="success"
                          :disabled="(customer.status === 'success' || customer.status === 'review' || customer.status === 'invalid' || customer.status === 'conflict')">
          <i
            class="icon el-icon-success text-success"></i><span class="text-success">标记成功</span>
        </el-dropdown-item>
        <el-dropdown-item command="invalid"
                          :disabled="customer.status === 'invalid'"><i
          class="icon el-icon-error text-info"></i><span class="text-info">标记无效</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="引用投资人信息" :visible="dialogQuoteVisible" class="quote-dialog" :before-close="handleClose"
               width="70%" :close-on-click-modal="false">
      <div class="search" v-loading="quoteLoading" element-loading-text="玩命加载中...">
        <el-form inline :model="searchInput" size="mini">
          <el-form-item label="姓名">
            <el-input placeholder="姓名" v-model="searchInput.username" prefix-icon="el-icon-service"
                      @keyup.enter.native="searchQuotes"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input placeholder="电话号码" v-model="searchInput.phone" prefix-icon="el-icon-phone"
                      @keyup.enter.native="searchQuotes"></el-input>
          </el-form-item>
          <el-form-item label="状态" placeholder="推荐状态">
            <el-select v-model="searchInput.status">
              <el-option label="进行中" value="process"></el-option>
              <el-option label="成功" value="success"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchQuotes">查找</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="customers" height="250" width="800">
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column label="姓名" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="addQuote(scope.row)"
                       :disabled="(scope.row.id === customer.id) || (scope.row.status === 'conflict' || scope.row.status === 'review' || scope.row.status === 'invalid')"
                       style="padding-top: 0;padding-bottom: 0;">
              {{scope.row.username}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'review'" class="text-warning">待审核</span>
            <span v-if="scope.row.status === 'process'" class="text-primary">进行中</span>
            <span v-if="scope.row.status === 'success'" class="text-success">已成功</span>
            <span v-if="scope.row.status === 'invalid'" class="text-info">无效</span>
            <span v-if="scope.row.status === 'conflict'" class="text-danger">冲突</span>
          </template>
        </el-table-column>
        <el-table-column property="location" label="地址" width="120"></el-table-column>
        <el-table-column property="phone" label="电话" width="150"></el-table-column>
        <el-table-column property="created_at" label="推荐时间"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="addQuote(scope.row)"
                       :disabled="(scope.row.id === customer.id) || (scope.row.status === 'conflict' || scope.row.status === 'review' || scope.row.status === 'invalid')"
                       style="padding-top: 0;padding-bottom: 0;">引用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-pagination :page-size="15" layout="total, prev, pager, next"
                         :total="total" @current-change="changePage" class="dialog-page"></el-pagination>
      </span>
    </el-dialog>
    <el-dialog title="备注" :visible="noteDialogVisible" width="30%" class="note-dialog" top="28vh" lock-scroll
               :close-on-click-modal="false" :before-close="handleCloseNoteDialog">
      <div style="margin-bottom: 10px">请输入{{text}}的备注信息</div>
      <label>管理员备注</label>
      <el-input type="textarea" :placeholder="`请输入${text}的备注信息，只对管理员自己可见，这是必填的`" v-model="customer.admin_note"
                style="margin-bottom:10px;"></el-input>
      <label>用户进展提示</label>
      <el-input type="textarea" :placeholder="`${text}信息备注，将会在用户前端进展显示，用于告知用户${text}原因，这也是必填的！`"
                v-model="customer.invalid_progress"
                style="margin-bottom:10px;"></el-input>
      <el-button type="text" @click="quote" v-if="command === 'conflict'">引用冲突信息</el-button>
      <div>
        <el-tag v-if="conflict" closable @close="removeConflict">{{conflict.username}}</el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noteDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addNote" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import customer from '../api/customer'
  import Project from '../api/project'
  import Utils from '../common/utils'
  export default {
    props: ['customer', 'disabled'],
    data() {
      return {
        dialogQuoteVisible: false,
        noteDialogVisible: false,
        quoteLoading: false,
        customers: [],
        text: '',
        searchInput: {},
        conflict: null,
        page: 1,
        total: 0,
        command: ''
      }
    },
    methods: {
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
          case 'conflict':
            text = '冲突'
            break
        }
        this.text = text
        this.command = command
        if (command === 'process' || command === 'success') {
          await this.$confirm(`确定要标记这条信息为“${text}”状态吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
        try {
          if (command === 'conflict' || command === 'invalid') {
            this.noteDialogVisible = true
          } else {
            this.loading = this.$loading({
              lock: true,
              text: '正在修改',
              spinner: 'el-icon-loading',
              background: 'rgba(255, 255, 255, 0.7)'
            })
            const {data} = await customer.review(this.customer.id, command)
            this.customer.status = data.status
            this.$emit('update:row', command)
            this.loading.close()
            this.$message({
              type: 'success',
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: `成功标记推荐信息为“<strong>${text}</strong>”状态`
            })
          }
        } catch (e) {
          console.error(e)
          this.loading.close()
          this.$message({
            type: 'error',
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `标记失败！ ${e.errmsg}`
          })

        }
      },
      //引用
      async quote() {
        const loading = this.$loading({
          target: document.querySelector('.quote-dialog'),
          text: '玩命加载中...',
          fullscreen: false
        })
        this.dialogQuoteVisible = true
        try {
          this.status = ['process', 'success']
          const {data, total} = await customer.search({
            status: this.status
          })
          if (data) {
            this.customers = data.map(v => {
              v.location = Utils.parseLocation(v.location)
              return v
            })
            this.total = total
          } else {
            this.customers = []
          }
        } catch (e) {
        }
        loading.close()
      },
      addQuote(customer) {
        this.conflict = customer
        this.dialogQuoteVisible = false
      },
      //查找引用
      async searchQuotes() {
        const loading = this.$loading({
          target: document.querySelector('.quote-dialog'),
          text: '玩命加载中...',
          fullscreen: false
        })
        this.status = [this.searchInput.status]
        const {data, total} = await customer.search({
          phone: this.searchInput.phone,
          username: this.searchInput.username,
          status: this.searchInput.status,
          page: this.page
        })
        if (data) {
          this.customers = data.map(v => {
            v.location = Utils.parseLocation(v.location)
            return v
          })
          this.total = total
        } else {
          this.customers = []
        }
        loading.close()
      },
      async changePage(page) {
        const loading = this.$loading({
          target: document.querySelector('.quote-dialog'),
          text: '玩命加载中...',
          fullscreen: false
        })
        try {
          const {data, total} = await customer.search({
            phone: this.searchInput.phone,
            username: this.searchInput.username,
            status: this.status,
            page
          })
          if (data) {
            this.customers = data.map(v => {
              v.location = Utils.parseLocation(v.location)
              return v
            })
            this.total = total
          } else {
            this.customers = []
          }
        } catch (e) {
        }
        loading.close()
      },
      removeConflict() {
        this.conflict = null
      },
      handleClose() {
        this.dialogQuoteVisible = false
      },
      handleCloseNoteDialog() {
        this.noteDialogVisible = false
      },
      async addNote() {
        if (this.command === 'conflict') {
          try {
            if (this.customer.admin_note && this.customer.invalid_progress) {
              if (!this.conflict) {
                this.$message.error('您必须添加冲突信息引用才可以继续！')
                return
              }
              await customer.addConflictRelations({
                id: this.$route.params.id,
                conflict_id: this.conflict.id,
                note: this.customer.admin_note
              })
              await Project.addProgress(this.customer.project_id, this.customer.invalid_progress)
              this.$message({
                type: 'success',
                message: `成功标记${this.customer.username}为冲突信息`
              })
              this.customer.status = 'conflict'
              this.$emit('addProgress')
              this.noteDialogVisible = false
            }
          } catch (e) {
          }
        } else if (this.command === 'invalid') {
          try {
            if (this.customer.admin_note && this.customer.invalid_progress) {
              await customer.review(this.customer.id, 'invalid')
              await customer.addNote(this.customer.id, this.customer.admin_note)
              //添加一条无效进展
              await Project.addProgress(this.customer.project_id, this.customer.invalid_progress)
              this.$message({
                type: 'success',
                message: `成功标记${this.customer.username}为无效信息`
              })
              this.customer.status = 'invalid'
              this.$emit('addProgress')
              this.noteDialogVisible = false
            }
          } catch (e) {
          }
        }

      }
    }
  }
</script>
<style lang="scss">
  .note-dialog {
    .el-dialog__header {
      padding: 15px 15px 0;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .el-dialog__footer {
      padding: 0 15px 10px;
    }
  }
</style>
