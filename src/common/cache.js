/**
 * Created by leevare on 2017/11/12.
 */
export default class Cache {
  static setStore(key, value) {
    if (!key) return
    if (typeof value !== String) {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
  }

  static getStorage(key) {
    if (!key) return
    return JSON.parse(window.localStorage.getItem(key))
  }

  static removeStorage(key) {
    if (!key) return
    window.localStorage.removeItem(key)
  }


}
