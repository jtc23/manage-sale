/**
 * Created by leevare on 2017/11/14.
 */

import utils from '../common/utils'
import Http from '../common/http'
export default class Customer extends Http {

  //获取推荐人的列表
  static async getList({status = '', page = 1, size = 15, userId = ''}) {
    const query = {
      status,
      user_id: userId,
      size,
      page
    }
    const queryUrl = utils.stringify(query)
    const url = `${this.baseUrl}/admin/recommend/search${queryUrl}`
    return await this.get(url)
  }

  //删除推荐人
  static async del(id) {
    const url = `${this.baseUrl}/admin/recommend?id=${id}`
    return await this.delete(url)
  }

  //审核推荐人状态
  static async review(id, status = 'review') {
    const url = `${this.baseUrl}/admin/recommend`
    return await this.post(url, {
      id,
      status,
    })
  }

  //搜索推荐人
  /*static async search({username, phone, status}) {
   const query = utils.stringify({
   username: username,
   phone: phone,
   status
   })
   const url = `${this.baseUrl}/admin/recommend/search${query}`
   const res = await this.get(url)
   return utils.response(res)
   }*/

  //获取单条推荐信息
  static async getOne(id) {
    const url = `${this.baseUrl}/admin/recommend?id=${id}`
    return await this.get(url)
  }

  //查询已被删除的推荐信息
  static async getDeleted() {
    const url = `${this.baseUrl}/admin/recommend/deleted`
    const res = await this.get(url)
    return utils.response(res)
  }

  //恢复已被删除的推荐人
  static async restore(id) {
    const url = `${this.baseUrl}/admin/recommend/restore`
    const res = await this.get(url)
    return utils.response(res)
  }

  //获取最近一段时间的推荐数量
  static recommendsCount(days) {
    const url = `${this.baseUrl}/admin/recommend/count?days=${days}`
    return this.get(url)
  }

  //获取操作者信息
  static getHandleUsers(name) {
    const url = `${this.baseUrl}/admin/user/admins?admin_name=${name}`
    return this.get(url)
  }

  //获取归属人信息
  static getBelongUsers(name) {
    const url = `${this.baseUrl}/admin/user/belongs?user_name=${name}`
    return this.get(url)
  }

  /**
   * 搜索
   * @param username
   * @param status 推荐状态
   * @param phone
   * @param permission 操作权限
   * @param intention 意向
   * @param admin_id
   * @param user_id
   * @param start 推荐时间起始
   * @param end 推荐时间结束
   * @param page
   * @param size
   */
  static search({
                  username = null,
                  status = null,
                  phone = null,
                  permission = null,
                  intention = null,
                  admin_id = null,
                  user_id = null,
                  start = null,
                  end = null,
                  page = 1,
                  size = 15
                }) {
    const query = {
      username,
      status,
      phone,
      permission,
      intention,
      admin_id: admin_id,
      user_id: user_id,
      start,
      end,
      page,
      size
    }
    const queryString = utils.stringify(query, {arrayFormat: 'indices'})
    const url = `${this.baseUrl}/admin/recommend/search${queryString}`
    return this.get(url)
  }

  /**
   * 添加冲突关联
   * @param id 推荐id
   * @param conflict_id
   * @param note
   * @returns {Promise}
   */
  static addConflictRelations({id, conflict_id, note}) {
    const url = `${this.baseUrl}/admin/recommend/conflict`
    return this.post(url, {
      id,
      conflict_id,
      note
    })
  }

  /**
   * 获取冲突投资人
   * @param id
   * @returns {Promise}
   */
  static getConflicts(id) {
    const url = `${this.baseUrl}/admin/recommend/conflicts?id=${id}`
    return this.get(url)
  }

  /**
   * 获取冲突反向关联
   * @param id
   * @returns {Promise}
   */
  static getConflictReflect(id) {
    const url = `${this.baseUrl}/admin/recommend/conflicts/reflect?id=${id}`
    return this.get(url)
  }

  /**
   * 添加备注
   * @param id
   * @param note
   * @returns {Promise}
   */
  static addNote(id, note) {
    const url = `${this.baseUrl}/admin/recommend/note`
    return this.post(url, {
      id, note
    })
  }
}

