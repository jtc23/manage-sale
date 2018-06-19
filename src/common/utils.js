import qs from 'qs'
export default class Utils {

  /**
   * restful 接口返回数据统一处理
   * @param res 返回对象
   * @param callback  正常状态执行回调函数
   * @returns {*}
   */
  static response(res) {
    if (res) {
      return new Promise((resolve, reject) => {
        if (res.data.errno === 0) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      })
    }
  }

  /**
   * 设置网页标题
   * @param title
   */
  static setTitle(title) {
    document.title = title
    let mobile = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(mobile)) {
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      // 替换成站标favicon路径或者任意存在的较小的图片即可
      iframe.setAttribute('src', '/favicon.ico')
      let iframeCallback = function () {
        setTimeout(function () {
          iframe.removeEventListener('load', iframeCallback)
          document.body.removeChild(iframe)
        }, 0)
      }
      iframe.addEventListener('load', iframeCallback)
      document.body.appendChild(iframe)
    }
  }

  static stringify(object, options = {}) {
    const defaultOptions = {
      indices: false,
      addQueryPrefix: true,
      skipNulls: true,
      serializeDate: (d) => {
        return d.getTime()
      }
    }
    const opts = Object.assign(defaultOptions, options)
    if (object) {
      return qs.stringify(object, opts)
    }
  }

  static parse(string, options = {}) {
    const defaultOptions = {
      indices: false,
      ignoreQueryPrefix: true
    }
    const opts = Object.assign(defaultOptions, options)
    if (string) {
      return qs.parse(string, opts)
    }
  }

  static parseLocation(locationIndex) {
    locationIndex = parseInt(locationIndex, 10) - 1
    const locations = ['北京', '天津', '上海', '重庆', '河北省', '山西省', '吉林省', '辽宁省', '黑龙江省', '陕西省', '甘肃省', '青海省', '山东省', '福建省', '浙江省', '台湾省', '河南省', '湖北省', '湖南省', '江西省', '江苏省', '安徽省', '广东省', '海南省', '四川省', '贵州省', '云南省', '内蒙古', '新疆', '宁夏', '广西', '西藏', '香港', '澳门']
    return locations[locationIndex] ? locations[locationIndex] : '未知'
  }

  static generateTitle(title) {
    return this.$t(title) // $t :this method from vue-i18n ,inject in @/lang/index.js
  }

  /**
   * 检测数组中是否存在某一对象
   * @param obj
   * @param list
   * @returns {boolean}
   */
  static containsObject(obj, list) {
    let x
    for (x in list) {
      if (list.hasOwnProperty(x) && list[x] === obj) {
        return true
      }
    }

    return false
  }
}
