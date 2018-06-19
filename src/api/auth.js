import {router} from '../router/index'
import Utils from '../common/utils'
import Cache from '../common/cache'
import Http from '../common/http'

const TOKEN_KEY = 'token'
const ADMIN_KEY = 'admin'

export default class Auth extends Http {

  constructor() {
    super()
    this.authenticated = false
  }

  static getAuthorization() {
    return this.authenticated
  }

  //登录
  static async login({email, password}, redirect, callback) {
    const res = await this.post(`${this.baseUrl}/user/login`, {email, password})
    const {token, id} = res.data

    Cache.setStore(TOKEN_KEY, token)
    Cache.setStore(ADMIN_KEY, id)

    this.authenticated = true

    if (redirect) {
      router.push(redirect)
    }

    callback && typeof callback === 'function' && callback()

  }

  //登出
  static async logout() {
    const jwt = await Cache.removeStorage(TOKEN_KEY)
    this.authenticated = false
  }

  //检查认证
  static async checkAuth() {
    const jwt = Cache.getStorage(TOKEN_KEY)
    this.authenticated = !!jwt
  }

  //获取认证头部信息
  static getAuthHeader() {
    return `Bearer ${Cache.getStorage(TOKEN_KEY)}`
  }

  //获取当前已登录的管理员id
  static async getCurrentAdmin() {
    return Cache.getStorage('admin')
  }

  static checkToken() {
    const url = `${this.baseUrl}/token`
    return this.get(url)
  }
}
