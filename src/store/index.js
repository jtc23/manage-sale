/**
 * Created by leevare on 2017/12/6.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import notify from './modules/notify'
import menu from './modules/menu'
import user from './modules/user'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    notify,
    menu,
    user,
    tagsView
  },
  strict: debug
})
