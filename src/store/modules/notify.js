/**
 * Created by leevare on 2017/12/6.
 */
import Notify from '../../api/notify'
import * as types from '../mutation-types'

const state = {
  messages: [],
  total: 0,
  per_page: 15,
  deleteStatus: ''
}

const getters = {
  messages: state => state.messages,
  total: state => state.total,
  per_page: state => state.per_page,
  deleteStatus: state => state.deleteStatus
}

function getMessagesTitle(data) {
  if (data) {
    return data.map((message) => {
        if (message.notify) {
          message.username = message.notify.username
          message.targets = message.notify.targets
          message.action = Notify.parseAction(message.notify.action)
          message.target_type = Notify.parseType(message.notify.target_type).name
          message.type = Notify.parseType(message.notify.target_type).type
        }
        return message
      }
    )
  }
}

function getTypeMessages({type, page = 1, size = 15}) {
  let res
  switch (type) {
    case 'recommend':
      res = Notify.getRecommend({page, size})
      break
    case 'cash':
      res = Notify.getCash({page, size})
      break
    case 'reward':
      res = Notify.getReward({page, size})
      break
    case 'other':
      res = Notify.getOther({page, size})
      break
    default:
      res = Notify.getAll({page, size})
      break
  }
  return res
}

//actions
const actions = {
  async getMessages({commit, state}, {type, page = 1, size = 15}) {
    const res = await getTypeMessages({type, page, size})
    commit(types.GET_NOTIFIES, res)
  },
  async deleteMessages({commit, state}, {ids, type, page}) {
    try {
      await Notify.deleteNotifies(ids)
    } catch (e) {
      commit(types.DELETE_NOTIFIES_FAILED)
    }
  }
}

const mutations = {
  [types.GET_NOTIFIES](state, {data, total, per_page}) {
    state.messages = getMessagesTitle(data)
    state.total = total
    state.per_page = per_page
  },
  [types.DELETE_NOTIFIES_FAILED](state) {
    state.deleteStatus = 'failed'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
