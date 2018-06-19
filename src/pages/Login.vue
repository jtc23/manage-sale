<template>
  <div>
    <el-container>
      <el-main>
        <el-row type="flex" justify="center" align="center">
          <el-card class="login">
            <h1 class="text-center">项目信息管理后台</h1>
            <el-form status-icon label-position="top" label-width="80px" :model="userInfo" :rules="rules"
                     ref="userInfo">
              <el-form-item label="账号" prop="email">
                <!--<el-input prefix-icon="icon iconfont icon-email el-icon-font" type="text" v-model="userInfo.email"
                          auto-complete="off" placeholder="请输入账号"
                          @keyup.enter.native="submitForm('userInfo')"></el-input>-->
                <el-autocomplete class="login-input" prefix-icon="icon iconfont icon-email el-icon-font" type="text"
                                 v-model.trim="userInfo.email"
                                 :fetch-suggestions="querySearch"
                                 auto-complete="off" placeholder="请输入账号"
                                 :trigger-on-focus="false"
                                 @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input prefix-icon="icon iconfont icon-password el-icon-font" type="password"
                          v-model.trim="userInfo.password" auto-complete="off"
                          placeholder="请输入密码" @keyup.enter.native="submitForm('userInfo')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="checked" checked>记住我7天</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userInfo')" v-waves>登录</el-button>
                <el-button class="pull-right" type="text" disabled>忘记密码？</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-row>
      </el-main>
    </el-container>
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import Auth from '../api/auth'
  import Validator from '../common/validator'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data() {
      return {
        checked: false,
        userInfo: {
          email: '',
          password: ''
        },
        rules: {
          email: [
            {required: true, message: '请输入账号信息', trigger: 'blur'},
            {validator: Validator.email, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '长度在6到16个字符之间', trigger: 'blur'}
          ]
        },
        emailPrefix: [
          {value: '163.com'},
          {value: 'gmail.com'},
          {value: 'qq.com'},
          {value: '126.com'},
          {value: 'sina.cn'},
          {value: 'yeah.net'},
          {value: 'yahoo.com'},
          {value: 'hotmail.com'}
        ],
        emailMode: 'map'
      }
    },
    directives: {
      waves
    },
    computed: {
      ...mapGetters({
        total: 'total',
        userProfile: 'userInfo'
      })
    },
    watch: {
      'userInfo.email'(value) {
        const valueIndex = value.indexOf('@')
        if (valueIndex === -1) {
          this.emailMode = 'map'
          this.emailPrefix = this.emailPrefix.map((v) => {
            const i = v.value.lastIndexOf('@')
            const suffix = v.value.substring(i + 1)
            v.value = `${value}@${suffix}`
            return v
          })
        } else {
          this.emailMode = 'filter'
        }
      }
    },
    methods: {
      ...mapActions([
        'getMessages',
        'getUserInfo'
      ]),
      querySearch(queryString, callback) {
        if (this.emailMode === 'map') {
          const results = queryString ? this.emailPrefix : []
          callback(results)
        } else if (this.emailMode === 'filter') {
          const results = queryString ? this.emailPrefix.filter(this.createFilter(queryString)) : []
          callback(results)
        }
      },
      createFilter(queryString) {
        return result => {
          return (result.value.toLowerCase().indexOf(queryString.toLocaleString()) === 0)
        }
      },
      handleSelect(item) {
        console.log(item)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const loading = this.$loading({
              target: document.querySelector('.login'),
              text: '正在登录中...',
              fullscreen: false,
              lock: true
            })
            const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/user/customers'
            try {
              await Auth.login({
                email: this.userInfo.email,
                password: this.userInfo.password
              }, {
                path: redirect
              }, async () => {
                await this.getMessages({})
                if (!this.userProfile) await this.getUserInfo()
                if (this.total) {
                  this.$notify({
                    title: '消息提醒',
                    message: `管理员${this.userProfile.username}，欢迎回来，您上次登录的时间为${this.userProfile.last_login}，您有${this.total}条消息通知，请前往消息中心查看详情！`,
                    position: 'bottom-right',
                    duration: 6000,
                    iconClass: 'el-icon-message'
                  })
                }
              })
            } catch (e) {
              switch (e.errno) {
                case -1007:
                  this.userInfo.email = ''
                  this.userInfo.password = ''
                  break
                case -1000:
                  this.userInfo.password = ''
                  break
              }
            }
            loading.close()
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss">

  .login form {
    width: 400px;
    .login-input {
      width: 100%;
    }
  }

</style>
