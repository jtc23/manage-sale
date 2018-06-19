import Http from '../common/http'
import Util from '../common/utils'

export default class Cash extends Http {

  //获取红包和奖金金额
  static async getCash(recommendId) {
    const url = `${this.baseUrl}/user/cash?recommend_id=${recommendId}`
    return await this.get(url)
  }

  //发红包
  static async setCash(recommendId, money, note = '') {
    const url = `${this.baseUrl}/admin/cash`
    return await this.post(url, {recommend_id: recommendId, money, note})
  }

  //设置项目奖金
  static setReward(recommendId, money = 0, note = '') {
    const url = `${this.baseUrl}/admin/reward`
    return this.post(url, {recommend_id: recommendId, money, note})
  }

  //获取红包奖金相关数据
  static getCashes({userId, status, species, page = 1, size = 15}) {
    const queries = Util.stringify({userId, status, species, page, size})
    const url = `${this.baseUrl}/user/cashrecommend/list${queries}`
    return this.get(url)
  }

  //标记打款成功
  static remit(progress_id) {
    const url = `${this.baseUrl}/admin/cash/remit?projects_progress_id=${progress_id}`
    return this.put(url)
  }

}
