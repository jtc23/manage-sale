/**
 * Created by leevare on 2017/11/14.
 */
import Http from '../common/http'
import Utils from '../common/utils'
export default class User extends Http {

  //获取登录用户的信息
  static getUserInfo() {
    const url = `${this.baseUrl}/user/info`
    return this.get(url)
  }

  //获取用户列表
  static async getList({page = 1, size = 15}) {
    const url = `${this.baseUrl}/admin/project/total?page=${page}&size=${size}`
    return await this.get(url)
  }

  //通过用户名搜索用户列表
  static getListByUserName({username, page = 1, size = 15}) {
    const queries = Utils.stringify({username, page, size})
    const url = `${this.baseUrl}/admin/project/total/username${queries}`
    return this.get(url)
  }

  //获取注册用户列表
  static getAllUserList({page = 1, size = 15}) {
    const url = `${this.baseUrl}/admin/user/list?page=${page}&size=${size}`
    return this.get(url)
  }

  static getUserProfile() {
    const url = `${this.baseUrl}/user/profile`
    return this.get(url)
  }


  //获取用户详细信息
  static getUserDetail(id) {
    const url = `${this.baseUrl}/admin/user?id=${id}`
    return this.get(url)
  }

  //添加用户
  static add({username, password, email, role = '0'}) {
    const url = `${this.baseUrl}/admin/user`
    return this.post(url, {
      username,
      password,
      email,
      role
    })
  }

  //修改密码
  static changePassword({password, passwordConfirm}) {
    const url = `${this.baseUrl}/admin/user/password`
    return this.put(url, {
      password,
      password_confirm: passwordConfirm
    })
  }

  //更新电话号码
  static updatePhone(phone) {
    const url = `${this.baseUrl}/admin/user/phone`
    return this.put(url, {phone})
  }
}
