<template>
  <div class="header-container">
    <div class="logo-lg" @click="$router.push({name: 'Home'})">
      <span><b>项目信息管理后台</b></span>
    </div>
    <div class="header-user" v-if="userInfo">
      <error-log v-if="log.length>0" class="errLog-container right-menu-item" :logsList="log"
                 style="margin-right:15px;"></error-log>
      <el-tooltip effect="dark" content="全屏" placement="bottom" style="width: 20px;height: 20px;margin-right: 10px;">
        <screen-full></screen-full>
      </el-tooltip>
      <el-tooltip effect="dark" content="换肤" placement="bottom" style="margin-right: 15px;">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>
      <router-link :to="{name: 'Profile'}">{{userInfo.username}}</router-link>
      <el-dropdown @command="handleCommand" menu-align='start'>
        <div class="header-message">
          <img :src="baseImagePath + userInfo.avatar" class="avatar" v-if="userInfo.avatar">
          <img :src="baseImagePath + 'default.jpg'" class="avatar" v-else>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">个人资料</el-dropdown-item>
          <el-dropdown-item command="setting">系统设置</el-dropdown-item>
          <el-dropdown-item command="logout">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import ScreenFull from '@/components/ScreenFull'
  import ErrorLog from '@/components/ErrLog'
  import ThemePicker from '@/components/ThemePicker'
  import errLogStore from '../../../store/errLog'
  import auth from '../../../api/auth'
  import env from '../../../common/env'
  export default {
    data() {
      return {
        baseImagePath: env.baseImagePath,
        log: errLogStore.state.errLog
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    components: {
      ScreenFull,
      ErrorLog,
      ThemePicker
    },
    methods: {
      async handleCommand(command) {
        switch (command) {
          case 'profile':
            this.$router.push({
              name: 'Profile'
            })
            break
          case 'setting':
            this.$router.push({
              name: 'Setting'
            })
            break
          case 'logout':
            try {
              await this.$confirm('确认要退出当前账户吗？', '退出')
              console.log(this.$router.push({
                name: 'Login'
              }))
              try {
                try {
                  await auth.logout()
                  this.$router.replace({
                    name: 'Login'
                  })
                  this.$message({
                    type: 'success',
                    message: '账号退出成功'
                  })
                  this.$Progress.finish()
                } catch (e) {
                  this.$message({
                    type: 'error',
                    message: '账号退出失败'
                  })
                  this.$Progress.fail()
                }
              } catch (e) {
                console.error(e)
                this.$message({
                  type: 'error',
                  message: e.errmsg
                })
                this.$Progress.fail()
              }
            } catch (e) {
            }
            break
        }
      },
      ...mapActions([
        'getUserInfo'
      ])
    },
    mounted() {
      if (!this.userInfo) {
        this.getUserInfo()
      }
    }
  }
</script>

<style lang="scss">
  .mark {
    margin-top: 6px;
  }

  .header-message {
    margin-right: 25px;
    .el-badge__content.is-fixed.is-dot {
      right: 7px;
      top: 4px;
    }
  }

  .header-container {
    color: #fff;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    .message {
      color: #fff;
      i {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
  }

  .el-header {
    background-color: #545c64;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  }

  .logo-lg {
    font-size: 24px;
    cursor: pointer;
  }

  .collapse {
    display: inline-block;
    margin-left: 10px;
  }
</style>
