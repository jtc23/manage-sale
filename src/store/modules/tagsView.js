function getMessageTag(view) {
  if (view.name === 'MessageSingleList') {
    switch (view.params.type) {
      case 'recommend':
        return '推荐消息'
      case 'cash':
        return '红包消息'
      case 'reward':
        return '奖金消息'
      case 'other':
        return '其它消息'
    }
  }
}

function getCustomerTag(view) {
  if (view.name === 'CustomerTypeList') {
    switch (view.params.status) {
      case 'review':
        return '待审核的投资人'
      case 'success':
        return '成功的投资人'
      case 'invalid':
        return '无效的投资人'
      case 'conflict':
        return '冲突的投资人'
      case 'process':
        return '进行中的投资人'
    }
  }
}

function getMoneyTag(view) {
  if (view.name === 'TypeMoneyList') {
    switch (view.params.type) {
      case 'cash':
        return '提现 - 红包'
      case 'reward':
        return '提现 - 奖金'
    }
  }
}

function getCustomerDetailTag(view) {
  if (view.name === 'CustomerDetail') {
    return '投资人详情'
  }
}

function getArticleDetail(view) {
  if(view.name === 'ArticleDetail') {
    return '规则详情'
  }
}

const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || getMessageTag(view) || getCustomerTag(view) || getMoneyTag(view) || getCustomerDetailTag(view) || getArticleDetail(view) || 'no-name'
      })
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    }
  },
  actions: {
    addVisitedViews({commit}, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({commit, state}, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
