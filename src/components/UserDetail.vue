<template>
  <el-dialog title="用户详细信息" :visible="visible" @close="$emit('close')" @open="$emit('open')" v-loading="loading"
             element-loading-text="玩命加载中">
    <el-form :model="userDetail" class="form-detail">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名">
            <span>{{userDetail.username ? userDetail.username : '无名氏' + userDetail.id}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别">
            <span>{{userDetail.gender === 1 ? '男' : '女'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话">
            <span>{{userDetail.phone}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行卡号">
            <span>{{userDetail.bank_code}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上次登录时间">
            <span>{{userDetail.last_login}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册时间">
            <span>{{userDetail.created_at}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="开户行">
        <span>{{userDetail.bank_name}}</span>
      </el-form-item>
      <el-form-item label="身份证号">
        <span>{{userDetail.id_card}}</span>
      </el-form-item>
      <el-form-item label="推荐总数量">
        <el-button type="text" @click="goUserCustomers">{{userDetail.recommend_count}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      userDetail: {
        type: Object,
        default: () => {
          return {}
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      goUserCustomers() {
        this.$router.push({name: 'CustomerList', query: {user_id: this.userDetail.id}, params: {cache: false}})
        this.$emit('update:visible', false)
      }
    }
  }
</script>
