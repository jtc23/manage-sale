<template>
  <div>
    <h1>系统设置</h1>
    <div class="settings">
      <p class="text-info text-sm el-form-item">您可以自定义设置菜单显示选项，将要显示的选项设置到如下右端选框即可</p>
      <el-transfer
        class="el-form-item"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入菜单拼音"
        :titles="['菜单列表', '自定义菜单列表']"
        :button-texts="['去除', '添加']"
        v-model="value"
        :data="data">
        <el-button class="transfer-footer" slot="left-footer" size="mini" @click="resetMenus">重置</el-button>
        <el-button class="transfer-footer" slot="right-footer" size="mini" @click="setDefaultMenus">默认</el-button>
      </el-transfer>
      <el-row class="el-form-item">
        <el-col :span="4">是否展示最近打开标签</el-col>
        <el-col :span="20">
          <el-radio v-model="showRecent" :label="true">是</el-radio>
          <el-radio v-model="showRecent" :label="false">否</el-radio>
        </el-col>
      </el-row>
      <el-button size="small" type="primary" style="margin-top: 15px;" :disabled="value.length <= 1"
                 @click="setCustomMenus">设置完成
      </el-button>
      <el-button size="small" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import Cache from '../../common/cache'
  export default {
    data() {
      const generateData = _ => {
        const data = []
        const menus = ['消息中心', '投资人管理', '提现管理', '注册人管理', '规则管理', '基础设置']
        const pinyin = ['xiaoxizhongxin', 'touzirenguanli', 'tixianguanli', 'zhucerenguanli', 'guizeguanli', 'jichushezhi']
        menus.forEach((menu, index) => {
          data.push({
            label: menu,
            key: index,
            pinyin: pinyin[index],
            disabled: index === 5
          })
        })
        return data
      }

      return {
        data: generateData(),
        value: [5],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        }
      }
    },
    computed: {
      showRecent: {
        get () {
          return this.$store.state.menu.showRecent
        },
        set (value) {
          this.$store.commit('SET_RECENT_TABS', value)
        }
      },
      ...mapGetters([
        'asideMenus',
        'defaultAsideMenus'
      ])
    },
    methods: {
      async setCustomMenus() {
        this.setMenus(this.value)
        this.setShowRecent()
        this.$message({
          message: '设置成功',
          type: 'success',
          showClose: true
        })
      },
      async getCustomMenus() {
        await this.getMenus()
        this.value = this.asideMenus
      },
      setDefaultMenus() {
        this.value = [0, 1, 2, 3, 4, 5]
      },
      resetMenus() {
        this.getMenus()
        this.value = this.asideMenus
      },
      setShowRecent() {
        this.setRecent(this.showRecent)
      },
      ...mapActions([
        'getMenus',
        'setMenus',
        'getRecent',
        'setRecent'
      ])
    },
    mounted() {
      this.getRecent()
      this.getCustomMenus()
    }
  }
</script>
