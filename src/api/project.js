import Http from '../common/http'
export default class Project extends Http {

  static async getList({userId= '', status= '', isRead= '', hasProgress= '', page= 1, size= 15}) {
    const url = `${this.baseUrl}/user/project/list?user_id=${userId}&status=${status}&isRead=${isRead}&hasProgress=${hasProgress}&page=${page}&size=${size}`
    return await this.get(url)
  }

  /**
   * 更新项目信息
   * @param id
   * @param status
   * @param money
   * @returns {Promise.<void>}
   */
  static async update({id, status, money = 0}) {
    const url = `${this.baseUrl}/admin/project`
    return await this.put(url, {id, status, money})
  }

  static async getMoney(projectId) {

  }

  static async getProgress(customerId) {
    const url = `${this.baseUrl}/user/progress?recommend_id=${customerId}`
    return await this.get(url)
  }

  /**
   * 新增项目进展
   * @param projectId
   * @param progress
   * @returns {Promise.<void>}
   */
  static async addProgress(projectId, progress) {
    const url = `${this.baseUrl}/admin/progress`
    return await this.post(url, {'project_id': projectId, progress})
  }


}
