webpackJsonp([16],{PkWx:function(t,e,r){"use strict";var n=r("Zx67"),s=r.n(n),a=r("Zrlr"),i=r.n(a),o=r("wxAW"),u=r.n(o),c=r("zwoO"),l=r.n(c),p=r("Pf15"),d=r.n(p),v=r("pP4B"),f=r("JaHG"),h=function(t){function e(){return i()(this,e),l()(this,(e.__proto__||s()(e)).apply(this,arguments))}return d()(e,t),u()(e,null,[{key:"getList",value:function(t){var e=t.page,r=void 0===e?1:e,n=t.size,s=void 0===n?15:n,a=f.a.stringify({page:r,size:s}),i=this.baseUrl+"/admin/posts"+a;return this.get(i)}},{key:"getPost",value:function(t){var e=this.baseUrl+"/admin/post?id="+t;return this.get(e)}},{key:"getPostByUrl",value:function(t){var e=this.baseUrl+"/admin/post/url?url="+t;return this.get(e)}},{key:"addPost",value:function(t){var e=t.title,r=t.content,n=t.url,s=this.baseUrl+"/admin/post";return this.post(s,{title:e,content:r,url:n})}},{key:"updatePost",value:function(t){var e=t.id,r=t.title,n=t.content,s=this.baseUrl+"/admin/post";return this.put(s,{id:e,title:r,content:n})}},{key:"delPost",value:function(t){var e=this.baseUrl+"/admin/post?id="+t;return this.delete(e)}},{key:"getPostUrlCustom",value:function(t){return this.baseUrl+"/admin/post/url?url="+t}}]),e}(v.a);e.a=h},jRZi:function(t,e,r){"use strict";var n=r("Xxa5"),s=r.n(n),a=r("exGp"),i=r.n(a),o=r("PkWx");e.a={data:function(){return{post:{},customUrl:""}},watch:{$route:function(){this.getPost()}},head:{title:function(){return{inner:this.post.title}}},methods:{getPost:function(){var t=this;return i()(s.a.mark(function e(){var r,n,a;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.$loading({target:document.querySelector(".post-wrapper"),text:"玩命加载中",fullscreen:!1}),e.prev=1,e.next=4,o.a.getPost(t.$route.params.id);case 4:n=e.sent,a=n.data,a.url&&(t.customUrl=o.a.getPostUrlCustom(a.url)),t.post=a,t.$emit("updateHead"),e.next=13;break;case 11:e.prev=11,e.t0=e.catch(1);case 13:r.close();case 14:case"end":return e.stop()}},e,t,[[1,11]])}))()},editPost:function(){this.$router.push({name:"ArticleEdit",params:{id:this.$route.params.id,mode:"edit",post:this.post}})},delPost:function(){var t=this;return i()(s.a.mark(function e(){var r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$confirm("确认要删除这篇文章吗？删除后将不可恢复，请谨慎操作！","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"});case 2:return r=t.$loading({target:document.querySelector(".posts-wrapper"),text:"正在删除"}),e.prev=3,e.next=6,o.a.delPost(t.$route.params.id);case 6:t.$message.success("删除成功"),t.$router.push({name:"ArticleList",params:{cache:!1}}),e.next=12;break;case 10:e.prev=10,e.t0=e.catch(3);case 12:r.close();case 13:case"end":return e.stop()}},e,t,[[3,10]])}))()}},created:function(){this.getPost()}}},q3fJ:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r("jRZi"),s=r("w0xx"),a=r("VU/8"),i=a(n.a,s.a,!1,null,null,null);e.default=i.exports},w0xx:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"post-wrapper"},[r("el-row",[r("el-col",{attrs:{span:18}},[r("div",{staticClass:"handle"},[r("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.editPost}},[t._v("编辑")]),t._v(" "),r("el-button",{attrs:{type:"danger",size:"mini"},on:{click:t.delPost}},[t._v("删除")])],1),t._v(" "),t.customUrl?r("blockquote",[t._v(t._s(t.customUrl))]):t._e(),t._v(" "),r("h1",[t._v(t._s(t.post.title))]),t._v(" "),r("div",{staticClass:"content",domProps:{innerHTML:t._s(t.post.content)}}),t._v(" "),r("el-button",{attrs:{size:"mini"},on:{click:function(e){t.$router.go(-1)}}},[t._v("返回")])],1)],1)],1)},s=[],a={render:n,staticRenderFns:s};e.a=a}});
//# sourceMappingURL=16.34c8fe2bf94ac31209c4.js.map