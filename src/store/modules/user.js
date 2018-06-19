/**
 * Created by Leevare on 2017/12/9.
 */
import User from '../../api/user'
import * as types from '../mutation-types'

const state = {
  userInfo: null
}

const getters = {
  userInfo: state => state.userInfo
}

const actions = {
  async getUserInfo({commit}) {
    const {data} = await User.getUserProfile()
    commit(types.SET_USER_INFO, data)
  }
}

const mutations = {
  [types.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
