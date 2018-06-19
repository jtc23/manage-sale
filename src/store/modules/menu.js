import Cache from '../../common/cache'
import * as types from '../mutation-types'

const state = {
  asideMenus: [],
  defaultAsideMenus: [0, 1, 2, 3, 4, 5],
  showRecent: true
}

const getters = {
  asideMenus: state => state.asideMenus,
  defaultAsideMenus: state => state.defaultAsideMenus,
  showRecent: state => state.showRecent
}

const actions = {
  async getMenus({commit, state}) {
    const asideMenus = await Cache.getStorage('menu_custom')
    commit(types.GET_CUSTOM_MENUS, asideMenus ? asideMenus : state.defaultAsideMenus)
  },
  setMenus({commit}, asideMenus) {
    Cache.setStore('menu_custom', asideMenus)
    commit(types.SET_CUSTOM_MENUS, asideMenus)
  },
  setRecent({commit}, type = true) {
    Cache.setStore('show_recent', type)
    commit(types.SET_RECENT_TABS, type)
  },
  async getRecent({commit}) {
    const isShow = await Cache.getStorage('show_recent')
    commit(types.SET_RECENT_TABS, isShow !== null ? isShow : true)
  }
}

const mutations = {
  [types.GET_CUSTOM_MENUS](state, asideMenus) {
    state.asideMenus = asideMenus
  },
  [types.SET_CUSTOM_MENUS](state, asideMenus) {
    state.asideMenus = asideMenus
  },
  [types.SET_RECENT_TABS](state, type) {
    state.showRecent = type
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
