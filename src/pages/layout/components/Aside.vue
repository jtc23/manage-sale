<template>
  <el-menu :default-active="defaultSelect" style="height: 100%;"
           class="el-menu-vertical"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse="isCollapse" router unique-opened ref="menu">
    <template v-for="menu in asideMenus">
      <template v-if="menu === 0">
        <message-center></message-center>
      </template>
      <template v-if="menu === 2">
        <money></money>
      </template>
      <template v-if="menu === 1">
        <recommend></recommend>
      </template>
      <template v-if="menu === 4">
        <rules></rules>
      </template>
      <template v-if="menu === 3">
        <user></user>
      </template>
    </template>
    <settings></settings>
  </el-menu>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import Cache from '../../../common/cache'
  import MessageCenter from './menus/MessageCenter'
  import Money from './menus/Money'
  import Recommend from './menus/Recommend'
  import Rules from './menus/Rules'
  import Settings from './menus/Settings'
  import User from './menus/User'
  export default {
    props: {
      isCollapse: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        defaultSelect: '1-1'
      }
    },
    computed: {
      ...mapGetters([
        'asideMenus'
      ])
    },
    components: {
      MessageCenter,
      Money,
      Recommend,
      Rules,
      Settings,
      User
    },
    watch: {
      '$route'() {
        this.defaultSelect = this.getMenuActiveIndex()
      }
    },
    methods: {
      getMenuActiveIndex() {
        if (this.$route.params.status && this.$route.name === 'CustomerTypeList') {
          switch (this.$route.params.status) {
            case 'review':
              return '2-2'
            case 'process':
              return '2-3'
            case 'success':
              return '2-4'
            case 'invalid':
              return '2-5'
            case 'conflict':
              return '2-6'
          }
        } else if (this.$route.name === 'TypeMoneyList') {
          switch (this.$route.params.type) {
            case 'cash':
              return '3-2'
            case 'reward':
              return '3-3'
          }
        } else if (this.$route.name === 'MessageSingleList') {
          switch (this.$route.params.type) {
            case 'recommend':
              return '1-2'
            case 'reward':
              return '1-3'
            case 'cash':
              return '1-4'
            case 'other':
              return '1-5'
          }
        } else {
          return this.$route.meta.active
        }
      }
    },
    mounted() {
      this.defaultSelect = this.getMenuActiveIndex()
    }
  }
</script>

<style lang="scss">
  .menu-badge {
    .el-badge__content.is-fixed {
      top: 25px;
      right: -10px;
      border: none;
    }
  }
</style>
