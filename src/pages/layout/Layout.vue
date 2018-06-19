<template>
  <div>
    <el-container>
      <el-header>
        <m-header :user-info="userInfo"></m-header>
      </el-header>
      <el-container>
        <el-aside class="aside-wrapper animated" :class="isCollapse ? 'collapse' : 'open'" width="auto">
          <m-aside :isCollapse="isCollapse" :hasMessage.sync="hasMessage"></m-aside>
          <transition name="el-fade-in" mode="out-in">
            <div class="collapse-aside" @click="collapse" v-show="!isCollapse">
              <i class="el-icon-d-arrow-left"></i>
            </div>
          </transition>
          <transition name="el-fade-in" mode="out-in">
            <div class="collapse-aside close" @click="collapse" v-show="isCollapse">
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </transition>
        </el-aside>
        <el-main class="main-wrapper" :class="isCollapse ? 'collapse' : 'open'">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{name: 'Home'}">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in $route.meta.bread" key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <tags-view v-show="showRecent"></tags-view>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-tooltip placement="left" content="点击返回顶部">
      <back-to-top transitionName="fade" :customStyle="{
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中
          background: '#e7eaf1'// 按钮的背景颜色
        }" :visibilityHeight="300"
                   :backPosition="50"></back-to-top>
    </el-tooltip>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import {MAside, MHeader, TagsView} from './components'
  import Cache from '../../common/cache'
  import user from '../../api/user'
  import Notify from '../../api/notify'
  import BackToTop from '@/components/BackToTop'
  export default {
    data() {
      return {
        isCollapse: false,
        userInfo: {},
        hasMessage: false
      }
    },
    components: {
      MHeader,
      MAside,
      TagsView,
      BackToTop
    },
    computed: {
      ...mapGetters([
        'showRecent'
      ])
    },
    methods: {
      async getUserInfo() {
        const {data} = await user.getUserInfo()
        this.userInfo = data
      },
      collapse() {
        this.isCollapse = !this.isCollapse
        Cache.setStore('collapse', this.isCollapse)
      },
      ...mapActions([
        'getRecent'
      ])
    },
    async created() {
      this.getRecent()
      this.getUserInfo()
      this.isCollapse = Cache.getStorage('collapse') ? Cache.getStorage('collapse') : false
    }
  }
</script>
<style lang="scss">
  .el-header {
    padding: 0;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .collapse {
    width: 65px;
  }

  .breadcrumb {
    margin-bottom: 25px;
  }
</style>
