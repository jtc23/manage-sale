<template>
  <div>
    <Refresh type="danger" class="pull-right" @refresh="getDetail"></Refresh>
    <h3>推荐信息详情</h3>
    <el-form label-width="80px" @submit.native.prevent>
      <el-row>
        <el-col :span="12" v-loading="loading" element-loading-text="玩命加载中">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名:">
                <span>{{customer.username}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属人:">
                <router-link :to="{name: 'CustomerList', query: {user_id: customer.user_id}, params: {cache: false}}" v-if="customer.belong_user">
                  {{customer.belong_user}}
                </router-link>
                <el-tooltip class="item" effect="dark" content="未授权用户" placement="top-start" v-else>
                  <router-link :to="{name: 'CustomerList', query: {user_id: customer.user_id}, params: {cache: false}}" class="text-warning">
                    {{'无名氏' + customer.user_id}}
                  </router-link>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="状态:">
                <Review :customer.sync="customer"
                        :disabled="!!customer.admin_id && admin_id !== customer.admin_id"
                        @addProgress="reloadProgress"></Review>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话:">
                <span>{{customer.phone}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="更新时间:">
                <span>{{customer.updated_at}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="推荐时间:">
                <span>{{customer.created_at}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="地址">
                <span>{{customer.location}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="customer.status === 'conflict' && reflectConflict">
              <el-form-item label="冲突对象">
                <router-link :to="{name: 'CustomerDetail', params: {id: reflectConflict.id, cache: false}}"
                             class="text-primary">{{reflectConflict.username}}
                </router-link>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="customer.status !== 'conflict' && conflicts">
              <el-dialog title="与我冲突的投资人" :visible="conflictDialogVisible" @close="conflictDialogVisible=false">
                <el-table stripe :data="conflicts" max-height="350">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column width="100" property="username" label="姓名">
                    <template slot-scope="scope">
                      <el-button type="text"
                                 @click="goConflictDetail(scope.row.id)">
                        {{scope.row.username}}
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column width="160" label="意向">
                    <template slot-scope="scope">
                      <span>{{intention[scope.row.intention]}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="120" property="phone" label="电话"></el-table-column>
                  <el-table-column property="created_at" label="推荐时间"></el-table-column>
                </el-table>
              </el-dialog>
              <el-form-item label="与我冲突">
                <el-button type="text" @click="conflictDialogVisible=true">谁与我冲突？</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="意向">
                <span>{{intention[customer.intention]}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目备注" v-if="customer.admin_note">
            <span>{{customer.admin_note}}</span>
          </el-form-item>
          <el-form-item label="用户备注">
            <span v-if="customer.note">{{customer.note}}</span>
            <span class="text-info" v-else>未填写</span>
          </el-form-item>
          <el-form-item label="项目奖金" v-if="customer.status !== 'invalid' && customer.status !== 'review'">
            <el-tooltip effect="dark" content="只有成功状态才可以设置奖金" placement="top">
              <el-button
                :disabled="!!customer.admin_id && admin_id !== customer.admin_id || customer.status !== 'success'"
                type="text"
                v-if="customer.reward.money <= 0" @click="rewardDialogVisible = true"
              >未设置
              </el-button>
            </el-tooltip>
            <template v-if="customer.reward.money > 0">
              <span>{{customer.reward.money}}</span>
              <span class="apply text-danger" v-if="customer.reward.apply === 1 && !customer.reward.is_remit">（已申请领取）<el-button
                type="text" @click="rewardRemitConfirm"
                :disabled="!!customer.admin_id && admin_id !== customer.admin_id">打款完成？</el-button></span>
              <span v-if="customer.reward.is_remit === 1" class="text-danger">（已打款）</span>
              <span class="apply text-info" v-if="customer.reward.apply === 0">（未申请领取）</span>
            </template>
          </el-form-item>
          <el-form-item label="红包" v-if="customer.status !== 'review'">
            <el-button
              :disabled="!!customer.admin_id && admin_id !== customer.admin_id || customer.status === 'success' || customer.status === 'conflict' || customer.status === 'invalid'"
              type="text"
              v-if="!customer.cash.money" @click="cashDialogVisible = true"
            >未发放
            </el-button>
            <template v-if="customer.cash.money > 0">
              <span>{{customer.cash.money}}</span>
              <span class="apply text-danger" v-if="customer.cash.apply === 1 && !customer.cash.is_remit">（已申请领取）
                <el-button type="text" @click="cashRemitConfirm"
                           :disabled="!!customer.admin_id && admin_id !== customer.admin_id">打款完成？</el-button>
              </span>
              <span v-if="customer.cash.is_remit" class="text-danger">（已打款）</span>
              <span class="apply text-info" v-if="customer.cash.apply === 0">（未申请领取）</span>
              <!--<el-button type="text" icon="el-icon-edit" @click="cashDialogVisible = true"
                         :disabled="!!customer.admin_id && admin_id !== customer.admin_id">修改
              </el-button>-->
            </template>
          </el-form-item>
          <template v-if="customer.status !== 'review'">
            <el-form-item label="进展" class="progress-column">
              <el-button :disabled="!!customer.admin_id && admin_id !== customer.admin_id" type="text"
                         icon="el-icon-circle-plus"
                         size="small"
                         v-if="customer.status!=='success' && customer.status!=='invalid' && customer.status !== 'conflict' && newProgress === null"
                         @click="addProgress">新增
              </el-button>
              <div class="progress" v-if="newProgress !== null">
                <div class="progress-detail">
                  <el-input placeholder="请输入进展详情" v-model="newProgress" @keyup.enter.native="onSubmit"
                            v-if="customer.status === 'process'"></el-input>
                  <i class="remove input-icon el-icon-circle-close-outline"
                     @click="removeProgress(newProgress)"></i>
                </div>
              </div>
              <div class="progress" v-for="(progress, index) in projectProcesses" :key="index">
                <div class="progress-detail">
                  <el-alert :title="progress.progress + ' （发放红包'+customer.cash.money+'）'" v-model="progress.progress"
                            :type="customer.status==='process'?(index===0?'warning':'success'):'success'"
                            :closable="false"
                            :description="progress.created_at"
                            v-if="progress.id === customer.cash.progress_id && customer.cash.money"></el-alert>
                  <el-alert :title="progress.progress + ' （发放奖金'+customer.reward.money+'）'" v-model="progress.progress"
                            :type="customer.status==='process'?(index===0?'warning':'success'):'success'"
                            :closable="false"
                            :description="progress.created_at"
                            v-else-if="progress.id === customer.reward.progress_id && customer.reward.money"></el-alert>
                  <el-alert :title="progress.progress" v-model="progress.progress"
                            :type="customer.status==='process'?(index===0?'warning':'success'):'success'"
                            :closable="false"
                            :description="progress.created_at"
                            v-else></el-alert>
                </div>
              </div>
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="12">
          <template v-if="customer.status !== 'review'">
            <el-form-item label="进展详情">
              <el-steps process-status="process" :active="projectProcesses.length-2" align-center direction="vertical">
                <template v-for="(progress, index) in projectProcesses">
                  <el-step :title="progress.progress"
                           :description="'发放红包'+customer.cash.money+'（'+progress.created_at+'）'"
                           :icon="index > 0 ? '' : 'el-icon-time'"
                           :key="index" :status="index > 0 ? 'success' : ''"
                           v-if="progress.id === customer.cash.progress_id && customer.cash.money"></el-step>
                  <el-step :title="progress.progress"
                           :description="'发放奖金'+customer.reward.money+'（'+progress.created_at+'）'"
                           :icon="index > 0 ? '' : 'el-icon-time'"
                           :key="index" :status="index > 0 ? 'success' : ''"
                           v-else-if="progress.id === customer.reward.progress_id && customer.reward.money"></el-step>
                  <el-step :title="progress.progress" :description="progress.created_at"
                           :icon="index > 0 ? '' : 'el-icon-time'"
                           :key="index" :status="index > 0 ? 'success' : ''" v-else></el-step>
                </template>
              </el-steps>
            </el-form-item>
          </template>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" v-if="customer.status === 'process'"
                   @click="onSubmit" :disabled="!!customer.admin_id && admin_id !== customer.admin_id">
          立即更新
        </el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="发放红包" :visible.sync="cashDialogVisible">
      <el-form :model="cash" ref="cashForm" :rules="cashFormRule" @submit.native.prevent="setCash">
        <el-form-item label="您输入的金额为：" v-if="cash.money">
          <span class="text-lg"><strong>{{cash.money | currency}}</strong></span>
        </el-form-item>
        <el-form-item label="红包金额" prop="money" label-width="80px">
          <el-input v-model="cash.money" auto-complete="off" autofocus>
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" label-width="80px">
          <el-input type="textarea" v-model="cash.note" auto-complete="off" placeholder="红包备注，同时该条备注会展示在前端用户的进展中"
                    @keyup.alt.enter.native="setCash"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cashDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setCash">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置项目奖金" :visible.sync="rewardDialogVisible">
      <el-form :model="reward" ref="rewardForm" :rules="rewardFormRule" @submit.native.prevent="setReward">
        <el-form-item label="您设置的奖金为：" v-if="reward.money">
          <span class="text-lg"><strong>{{reward.money | currency}}</strong></span>
        </el-form-item>
        <el-form-item label="奖金金额" prop="money" label-width="80px">
          <el-input v-model="reward.money" auto-complete="off" autofocus>
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" label-width="80px">
          <el-input type="textarea" v-model="reward.note" auto-complete="off"
                    @keyup.ctrl.enter.native="setReward"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rewardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setReward">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import auth from '../../api/auth'
  import customer from '../../api/customer'
  import cash from '../../api/cash'
  import project from '../../api/project'
  import Review from '@/components/Review'
  import Util from '../../common/utils'
  import Validator from '../../common/validator'
  import Refresh from '@/components/Refresh'

  export default {
    data() {
      return {
        conflictDialogVisible: false,
        reflectConflict: null,
        conflicts: [],
        loading: false,
        cashPopVisible: false,
        rewardPopVisible: false,
        admin_id: 0,
        customer: {
          cash: {},
          reward: {}
        },
        addnote: false,
        projectProcesses: [],
        intention: ['未知', '有原料', '有资金', '有能力'],
        newProgress: null,
        cashDialogVisible: false,
        cash: {},
        cashFormRule: {
          money: [{
            validator: Validator.money,
            trigger: 'blur,change'
          }],
          note: [{
            required: true,
            message: '备注不能为空'
          }]
        },
        rewardDialogVisible: false,
        reward: {},
        rewardFormRule: {
          money: [{
            validator: Validator.money,
            trigger: 'blur,change'
          }],
          note: [{
            required: true,
            message: '备注不能为空'
          }]
        }
      }
    },
    components: {
      Review,
      Refresh
    },
    head: {
      title() {
        return {
          inner: this.customer.username ? `投资人“${this.customer.username}”的信息详情` : '投资人信息详情'
        }
      }
    },
    watch: {
      '$route'(to, from) {
        if (!to.params.cache && to.name === 'CustomerDetail') {
          this.getDetail()
        }
      }
    },
    methods: {
      goConflictDetail(id) {
        this.conflictDialogVisible = false
        this.$router.push({name: 'CustomerDetail', params: {id, cache: false}})
      },
      //新增项目进展
      addProgress() {
        this.newProgress = ''
      },
      async removeProgress(progress) {
        if (progress !== '') {
          this.$alert('该条进展已有内容，您不能进行该操作！', '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
        } else {
          this.newProgress = null
        }
      },
      async onSubmit() {
        if (this.projectId && this.newProgress) {
          const {data} = await project.addProgress(this.projectId, this.newProgress)
          this.projectProcesses.splice(0, 0, {
            progress: data.progress,
            created_at: data.created_at,
            key: +new Date()
          })
          this.newProgress = ''
        }
      },
      async setCash() {
        this.$refs['cashForm'].validate(async (valid) => {
          if (valid) {
            //提交
            try {
              if (this.projectId) {
                await project.addProgress(this.projectId, this.cash.note)
                const {data} = await cash.setCash(this.$route.params.id, this.cash.money, this.cash.note)
                this.reloadProgress()
                this.customer.cash.money = data.money
                this.cashDialogVisible = false
                this.getProgresses(this.$route.params.id)
                this.$message({
                  type: 'success',
                  message: `设置成功，您设置的红包金额为${this.customer.cash.money}`
                })
              }
            } catch (e) {
              this.cashDialogVisible = false
            }
          } else {
            return false
          }
        })
      },
      async setReward() {
        this.$refs['rewardForm'].validate(async (valid) => {
          if (valid) {
            //提交
            try {
              if (this.projectId) {
                try {
                  await project.addProgress(this.projectId, this.reward.note)
                  const {data} = await cash.setReward(this.$route.params.id, this.reward.money, this.reward.note)
                  this.reloadProgress()
                  this.rewardDialogVisible = false
                  this.reward.money = data.money
                  this.customer.reward = {
                    money: data.money
                  }
                  this.getProgresses(this.$route.params.id)
                  this.$message({
                    type: 'success',
                    message: `设置成功`
                  })
                } catch (e) {
                }
              }
            } catch (e) {
              this.rewardDialogVisible = false
            }
          } else {
            return false
          }
        })
      },
      async getDetail() {
        this.$Progress.start()
        this.loading = true
        try {
          const {data} = await customer.getOne(this.$route.params.id)
          data.location = Util.parseLocation(data.location)
          this.customer = data
          this.getConflictReflect()
          this.getConflicts()
          this.$emit('updateHead')
          this.customer.cash = {}
          this.customer.reward = {}
          this.getCash(data.project_id)
          this.projectId = data.project_id
          if (customer.status !== 'invalid' && customer.status !== 'review') {
            this.getProgresses(this.$route.params.id)
          }
          this.$Progress.finish()
        } catch (e) {
          this.$Progress.fail()
        }
        this.loading = false
      },
      async getCash(projectId) {
        if (projectId) {
          const {data} = await cash.getCash(this.$route.params.id)
          this.customer.cash = {
            money: data.cash.money,
            note: data.cash.note,
            apply: data.cash.apply,
            is_remit: data.cash.is_remit,
            progress_id: data.cash.projects_progress_id
          }
          this.customer.reward = {
            money: data.reward.money,
            note: data.reward.note,
            is_remit: data.reward.is_remit,
            apply: data.reward.apply,
            progress_id: data.reward.projects_progress_id
          }
        } else {
          this.$alert('该项目不存在！')
        }
      },
      async cashRemitConfirm() {
        await this.$confirm('请确认是否将该条信息对应红包金额打款到对方银行账户，继续则代表您已经确认打款完成！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        try {
          await this.cashRemit(this.customer.cash.progress_id)
          this.$message.success('成功标记红包为已打款')
        } catch (e) {
        }
      },
      async rewardRemitConfirm() {
        await this.$confirm('请确认是否将该条信息对应项目奖金打款到对方银行账户，继续则代表您已经确认打款完成！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        try {
          await this.rewardRemit(this.customer.reward.progress_id)
          this.$message.success('成功标记项目奖金为已打款')
        } catch (e) {
        }
      },
      async getProgresses(customerId) {
        const loading = this.$loading({
          target: document.querySelector('.progress-column'),
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(255,255,255, 0.7)'
        })
        const {data} = await project.getProgress(customerId)
        this.projectProcesses = data.progress
        //this.customer.reward.progress_id = this.projectProcesses[0].id
        loading.close()
      },
      reloadProgress() {
        this.getProgresses(this.customer.id)
      },
      //标记打款成功
      async cashRemit(progress_id) {
        try {
          this.loading = true
          await cash.remit(progress_id)
          this.customer.cash.is_remit = 1
        } catch (e) {
        }
        this.loading = false
      },
      async rewardRemit(progress_id) {
        try {
          this.loading = true
          await cash.remit(progress_id)
          this.customer.reward.is_remit = 1
        } catch (e) {
        }
        this.loading = false
      },
      async getConflictReflect() {
        if (this.customer.status === 'conflict') {
          const {data} = await customer.getConflictReflect(this.$route.params.id)
          this.reflectConflict = data
        }
      },
      async getConflicts() {
        if (this.customer.status !== 'conflict') {
          try {
            const {data} = await customer.getConflicts(this.$route.params.id)
            this.conflicts = data
          } catch (e) {
          }
        }
      }
    },
    async mounted() {
      this.admin_id = await auth.getCurrentAdmin()
      await this.getDetail()
    }
  }
</script>

<style lang="scss">
  .apply {
    font-size: 12px;
  }

  .el-step {
    height: 80px;
  }

  .progress {

  }

  .progress-detail {
    position: relative;
    margin-bottom: 15px;
    @at-root .el-textarea {
      position: relative;
      &:hover {
        & + .remove {
          display: block;
        }
      }
    }
    &:hover {
      .remove {
        display: block;
      }
    }
    textarea {
      margin-bottom: 16px;
    }
    @at-root .input-icon {
      position: absolute;
      width: 14px;
      height: 14px;
      text-align: center;
      background-color: #fff;
      cursor: pointer;
      display: none;
      &:hover {
        color: #FA5555;
        display: block;
      }
    }
    @at-root .remove {
      right: -7px;
      top: -6px;
    }
    @at-root .edit {
      right: -7px;
      top: 50%;
      margin-top: -14px;
    }
    .el-alert__content {
      line-height: 14px;
    }
  }

  .text-lg {
    font-size: 28px;
  }
</style>
