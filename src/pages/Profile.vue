<template>
  <div>
    <el-row>
      <el-col :span="12" :offset="1">
        <h2>个人资料</h2>
        <el-form :model="user" :rules="rules" ref="profile">
          <el-form-item label="用户名：">
            <span>{{user.username}}</span>
          </el-form-item>
          <el-form-item label="邮箱地址：">
            <span>{{user.email}}</span>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="user.phone" placeholder="电话" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="user.password" placeholder="密码" clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm">
            <el-input v-model="user.passwordConfirm" type="" placeholder="确认密码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">更新资料</el-button>
            <el-button @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9" :offset="2">
        <div class="avatar-upload">
          <el-upload
            drag
            action=""
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">用户头像上传，只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import user from '../api/user'
  import auth from '../api/auth'
  import Validator from '../common/validator'
  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        if (value) {
          if (value.length < 6 || value.length > 16) {
            callback(new Error('密码长度在6-16位之间'))
          } else if (!/^[\da-zA-Z]{6,16}$/.test(value)) {
            callback(new Error('密码只能为字母或数字'))
          } else {
            if (this.user.passwordConfirm !== '') {
              this.$refs.profile.validateField('passwordConfirm')
            }
            callback()
          }
        } else {
          callback()
        }
      }
      const validatePassConfirm = (rule, value, callback) => {
        if (this.user.password) {
          if (!value) {
            callback(new Error('请再次输入密码'))
          } else if (value !== this.user.password) {
            callback(new Error('两次密码输入不一致'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        user: {},
        rules: {
          phone: [
            {validator: Validator.phone, trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          passwordConfirm: [
            {validator: validatePassConfirm, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async getProfile() {
        const {data} = await user.getUserProfile()
        this.user = data
      },
      async logout() {
        this.$confirm('确认要退出吗？', '提示', async () => {
          await auth.logout()
          this.$router.replace({
            name: 'Login',
            params: {
              msg: '退出成功'
            }
          })
        })
      },
      updateProfile() {
        this.$refs.profile.validate(async valid => {
          if (valid) {
            try {
              if (this.user.phone || this.user.password) {
                if (this.user.phone) {
                  console.log(111)
                  await user.updatePhone(this.user.phone)
                }
                if (this.user.password) {
                  await user.changePassword({
                    password: this.user.password,
                    passwordConfirm: this.user.passwordConfirm
                  })
                }
                this.$message.success('修改成功')
              }
            } catch (e) {
            }
          } else {
            return false
          }
        })
      }
    },
    mounted() {
      if (this.$route.name === 'Profile') {
        this.getProfile()
      }
    }
  }
</script>

<style lang="scss">
  .avatar-upload {
    margin-top: 200px;
  }
</style>
