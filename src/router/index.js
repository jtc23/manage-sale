import Vue from 'vue'
import VueHead from 'vue-head'
import Router from 'vue-router'
import routerCofig from './config'
import env from '../common/env'
import Utils from '../common/utils'
import Auth from '../api/auth'
import {Message} from 'element-ui'

Vue.use(VueHead, {
  separator: '-',
  complement: '项目信息管理后台'
})
Vue.use(Router)

export let router = new Router({
  mode: env.routerMode,
  routes: routerCofig
})

/**
 * 路由拦截
 * to: 即将要进入的目标 路由对象
 * from: 当前导航正要离开的路由
 * next: 调用该方法来 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    Utils.setTitle(to.meta.title + ' - 项目信息管理后台')
  }
  if (to.meta.requireAuth) {
    Auth.checkAuth()
    if (Auth.getAuthorization()) {
      next()
    } else {
      next({
        name: 'Login',
        query: {redirect: to.fullPath}
      })
      Message.error({
        message: '您还没有登录'
      })
    }
  } else {
    next()
  }
})
