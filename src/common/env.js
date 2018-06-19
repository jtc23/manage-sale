/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImagePath: 图片存放地址
 * @type {string}
 */
class Config {
}
Config.baseUrl = ''
Config.routerMode = 'history'
Config.baseImagePath = '/static/images/'

if (process.env.NODE_ENV === 'development') {
  Config.baseUrl = 'https://api.shibangchina.com/api'
  // Config.baseUrl = 'http://localhost:8888/api'
} else {
  Config.baseUrl = 'https://api.shibangchina.com/api'
}

export default Config
