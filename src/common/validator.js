export default class Validator {

  /**
   * 金钱验证
   * @param rule
   * @param value
   * @param callback
   */
  static money(rule, value, callback) {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    if (reg.test(value) === false) {
      callback(new Error('请输入正确的金额'))
    } else {
      callback()
    }
  }

  //电话验证
  static phone(rule, value, callback) {
    if (value !== '') {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (reg.test(value) === false) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  static email(rule, value, callback) {
    if (value) {
      const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (reg.test(value) === false) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

}
