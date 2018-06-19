import axios from 'axios'
import Auth from '../api/auth'
import {Message, MessageBox} from 'element-ui'
import env from '../common/env'
import {router} from '../router'

//http request 拦截器
axios.interceptors.request.use(
  config => {
    if (Auth.getAuthorization()) {
      config.headers.Authorization = Auth.getAuthHeader()
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

//http response 拦截器
axios.interceptors.response.use(
  response => {
    const {errno} = response.data
    if (errno === -1008 || errno === -8000) {
      Auth.logout()
      router.replace({
        name: 'Login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          //清除token,登出信息
          if (Auth.getAuthorization()) {
            Auth.logout();
            router.replace({
              name: 'Login'
            })
            Message.error({
              message: '您还没有登录，请重新登录！'
            })
          }
      }
      //返回接口返回的错误信息
      return Promise.reject(error.response.data)
    } else {
      Message({
        showClose: true,
        message: '网络似乎出现了异常，请稍后再试！',
        type: 'error'
      })
    }
    return Promise.resolve(error.response)
  }
);

function _handleRespone(res) {
  const {data, errno, errmsg} = res.data
  if (errno < 0) {
    Message({
      showClose: true,
      message: errmsg,
      type: 'error'
    })
    throw {errno, errmsg, data}
  } else {
    return res.data
  }
}

export default class Http {

  static baseUrl = env.baseUrl

  static async get(url) {
    return _handleRespone(await axios.get(url))
  }

  static async post(url, options = {}) {
    return _handleRespone(await axios.post(url, options))
  }

  static async put(url, options = {}) {
    return _handleRespone(await axios.put(url, options))
  }

  static async delete(url) {
    return _handleRespone(await axios.delete(url))
  }


}

