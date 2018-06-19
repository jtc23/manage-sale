import Http from '../common/http'
import util from '../common/utils'
export default class Post extends Http {

  //获取文章列表
  static getList({page = 1, size = 15}) {
    const query = util.stringify({page, size})
    const url = `${this.baseUrl}/admin/posts${query}`
    return this.get(url)
  }

  //获取文章内容
  static getPost(id) {
    const url = `${this.baseUrl}/admin/post?id=${id}`
    return this.get(url)
  }

  //通过url获取文章内容
  static getPostByUrl(url) {
    const requestUrl = `${this.baseUrl}/admin/post/url?url=${url}`
    return this.get(requestUrl)
  }

  //发布
  static addPost({title, content, url}) {
    const requestUrl = `${this.baseUrl}/admin/post`
    return this.post(requestUrl, {title, content, url})
  }

  //修改
  static updatePost({id, title, content}) {
    const url = `${this.baseUrl}/admin/post`
    return this.put(url, {id, title, content})
  }

  //删除文章
  static delPost(id) {
    const url = `${this.baseUrl}/admin/post?id=${id}`
    return this.delete(url)
  }

  //获取文章链接
  static getPostUrlCustom(url) {
    return `${this.baseUrl}/admin/post/url?url=${url}`
  }

}
