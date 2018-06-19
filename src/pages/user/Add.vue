<template>
  <div>
    <h2>添加{{user.role === '1' ? '管理员' : '用户'}}</h2>
    <el-form status-icon :model="user" ref="add" :rules="addRules" label-width="100px">
      <el-form-item label="用户名" prop="username" class="addForm">
        <el-input v-model.trim="user.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" class="addForm">
        <el-input v-model.trim="user.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="user.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input type="password" v-model.trim="user.passwordConfirm"></el-input>
      </el-form-item>
      <el-form-item label="角色权限" prop="role">
        <el-radio v-model="user.role" label="1">管理员</el-radio>
        <el-radio v-model="user.role" label="2" disabled>普通用户</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">确认添加</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Validator from '../../common/validator'
  import user from '../../api/user'
  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.user.password) {
          callback(new Error('两次密码输入不一致！'))
        } else {
          callback()
        }
      }
      return {

        user: {
          role: '1'
        },
        addRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 12, message: '长度在3到5个字符之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱地址不能为空', trigger: 'blur'},
            {validator: Validator.email, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '长度在6到16个字符之间', trigger: 'blur'}
          ],
          passwordConfirm: [
            {validator: validatePass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      add() {
        this.$refs.add.validate(async (valid) => {
          if (valid) {
            const loading = this.$loading({
              target: document.querySelector('.addForm'),
              text: '玩命加载中...'
            })
            try {
              const {data} = await user.add({
                username: this.user.username,
                password: this.user.password,
                email: this.user.email,
                role: this.user.role
              })
              loading.close()
              this.$alert(`成功添加用户${this.user.username}，请牢记登录密码！`, '重要提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                type: 'success',
                callback: action => {
                  this.user.username = ''
                  this.user.password = ''
                  this.user.email = ''
                  this.user.passwordConfirm = ''
                }
              })
            } catch (e) {
              loading.close()
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>
