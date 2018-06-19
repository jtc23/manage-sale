/**
 * Created by leevare on 2017/11/27.
 */
import Http from '../common/http'
import Util from '../common/utils'
export default class Notify extends Http {

  /**
   * 获取消息通知
   * @param type
   * @param page
   * @param size
   */
  static getNotifies({type = '', page = 1, size = 15}) {
    const queries = Util.stringify({type, page, size})
    const url = `${this.baseUrl}/admin/notify${queries}`
    return this.get(url)
  }

  /**
   * 获取所有消息
   * @param page
   * @param size
   * @returns {*}
   */
  static getAll({page = 1, size = 15}) {
    return this.getNotifies({type: '', page, size})
  }

  /**
   * 获取投资人消息
   * @param page
   * @param size
   * @returns {*}
   */
  static getRecommend({page = 1, size = 15}) {
    return this.getNotifies({type: 'recommend', page, size})
  }

  /**
   * 获取红包消息
   * @param page
   * @param size
   * @returns {*}
   */
  static getCash({page = 1, size = 15}) {
    return this.getNotifies({type: 'cash', page, size})
  }

  /**
   * 获取奖金消息
   * @param page
   * @param size
   * @returns {*}
   */
  static getReward({page = 1, size = 15}) {
    return this.getNotifies({type: 'reward', page, size})
  }

  /**
   * 获取其他
   * @param page
   * @param size
   * @returns {*}
   */
  static getOther({page = 1, size = 15}) {
    return this.getNotifies({type: 'other', page, size})
  }

  /**
   * 删除通知
   * @param ids
   * @returns {Promise}
   */
  static deleteNotifies(ids = []) {
    const query = Util.stringify({id: ids}, {arrayFormat: 'indices'})
    const url = `${this.baseUrl}/admin/notify${query}`
    return this.delete(url)
  }

  /**
   * 解析action动作
   * @param action
   * @returns {*}
   */
  static parseAction(action) {
    switch (parseInt(action, 10)) {
      case 1:
        return '删除'
      case 2:
        return '修改'
      case 3:
        return '提交'
      case 4:
        return '申请'
      case 5:
        return '新增'
      case 6:
        return '成功打款'
    }
  }

  /**
   * 解析类型
   * @param target_type
   * @returns {*}
   */
  static parseType(target_type) {
    switch (parseInt(target_type, 10)) {
      case 1:
        return {
          name: '用户',
          type: 'user'
        }
      case 2:
        return {
          name: '推荐',
          type: 'recommend'
        }
      case 3:
        return {
          name: '红包',
          type: 'cash'
        }
      case 4:
        return {
          name: '奖金',
          type: 'reward'
        }
      case 5:
        return {
          name: '文章',
          type: 'article'
        }
      case 6:
        return {
          name: '进展',
          type: 'progress'
        }
      case 7:
        return {
          name: '私信',
          type: 'private'
        }
    }
  }
}
