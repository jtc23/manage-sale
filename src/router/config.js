const Login = () => import('pages/Login')
const Layout = () => import('pages/layout/Layout')
const UserList = () => import('pages/user/UserList')
const CustomerList = () => import('pages/customer/List')
const AllUserList = () => import('pages/user/All')
const CustomerDetail = () => import('pages/customer/Detail')
//const ProjectList = () => import('pages/project/List')
const Profile = () => import('pages/Profile')
const About = () => import('pages/About')
const Status = () => import('pages/chart/Status')
const UserAdd = () => import('pages/user/Add')
const ArticleAdd = () => import('pages/article/Add')
const ArticleList = () => import('pages/article/List')
const ArticleDetail = () => import('pages/article/Post')
const MessageList = () => import('pages/message/List')
const MessageSingleList = () => import('pages/message/SingleList')
const MoneyList = () => import('pages/customer/MoneyList')
const NotFound = () => import('@/components/NotFound')
const Setting = () => import('pages/system/Setting')

const routerConfig = [{
  path: '*',
  component: NotFound,
  name: 'NotFound',
  meta: {
    title: '404 Page Not Found',
    keepAlive: true
  }
}, {
  path: '/',
  name: 'Home',
  redirect: '/user/customers'
}, {
  path: '/login',
  component: Login,
  name: 'Login',
  meta: {
    title: '登录',
    keepAlive: true
  }
}, {
  path: '/user',
  component: Layout,
  children: [
    {
      path: 'dashboard',
      component: Status,
      name: 'DashBoard',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '注册人推荐信息分布图',
        active: '6-3',
        bread: ['注册人推荐信息分布']
      }
    }, {
      path: 'list',
      component: UserList,
      name: 'UserList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '注册人列表',
        active: '4-1',
        bread: ['注册人管理', '已有推荐的注册人列表']
      }
    }, {
      path: 'all',
      component: AllUserList,
      name: 'AllUserList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '所有注册人列表',
        active: '4-2',
        bread: ['注册人管理', '所有注册人']
      }
    }, {
      path: 'add',
      component: UserAdd,
      name: 'UserAdd',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '添加管理员',
        active: '6-1',
        bread: ['基础设置', '添加管理员']
      }
    }, {
      path: 'customers',
      component: CustomerList,
      name: 'CustomerList',
      meta: {
        title: '全部投资人列表',
        requireAuth: true,
        keepAlive: true,
        active: '2-1',
        bread: ['投资人信息', '投资人列表']
      }
    }, {
      path: ':status/customers',
      component: CustomerList,
      name: 'CustomerTypeList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        bread: ['投资人信息', '投资人列表']
      }
    }, {
      path: 'moneys',
      component: MoneyList,
      name: 'MoneyList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        active: '3-1',
        title: '全部佣金信息列表',
        bread: ['提现管理', '佣金列表']
      }
    }, {
      path: ':type/money/list',
      component: MoneyList,
      name: 'TypeMoneyList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        // title: '佣金信息列表',
        bread: ['提现管理', '佣金列表']
      }
    }, {
      path: 'customer/detail/:id',
      component: CustomerDetail,
      name: 'CustomerDetail',
      meta: {
        requireAuth: true,
        bread: ['投资人信息', '投资人详情']
      }
    }, {
      path: 'posts/add',
      component: ArticleAdd,
      name: 'ArticleAdd',
      meta: {
        requireAuth: true,
        title: '规则发布',
        bread: ['规则管理', '规则发布'],
        active: '5-1'
      }
    }, {
      path: 'posts',
      component: ArticleList,
      name: 'ArticleList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '规则列表',
        bread: ['规则管理', '规则列表'],
        active: '5-2'
      }
    }, {
      path: 'post/:id',
      component: ArticleDetail,
      name: 'ArticleDetail',
      meta: {
        requireAuth: true,
        bread: ['规则管理', '规则详情']
      }
    }, {
      path: 'post/edit/:id',
      component: ArticleAdd,
      name: 'ArticleEdit',
      meta: {
        requireAuth: true,
        title: '规则编辑',
        bread: ['规则管理', '规则编辑'],
        active: '5-1'
      }
    }, {
      path: 'messages',
      component: MessageList,
      name: 'MessageList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '全部消息',
        bread: ['消息管理', '消息列表'],
        active: '1-1'
      }
    }, {
      path: ':type/messages',
      component: MessageSingleList,
      name: 'MessageSingleList',
      meta: {
        requireAuth: true,
        keepAlive: true,
        bread: ['消息管理', '消息列表']
      }
    }, {
      path: '/about',
      component: About,
      name: 'About',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '关于',
        active: '6-5',
        bread: ['基础设置', '关于']
      }
    }/*, {
     path: 'project/list',
     component: ProjectList,
     name: 'ProjectList',
     meta: {
     requireAuth: true,
     active: '2-1',
     bread: ['项目信息', '项目列表']
     }
     }*/, {
      path: '/profile',
      component: Profile,
      name: 'Profile',
      meta: {
        requireAuth: true,
        keepAlive: true,
        title: '个人资料',
        active: '6-2',
        bread: ['基础设置', '个人资料']
      }
    },
    {
      path: '/settings',
      component: Setting,
      name: 'Setting',
      meta: {
        requireAuth: true,
        keepAlive: true,
        active: '6-4',
        title: '系统设置',
        bread: ['基础设置', '系统设置']
      }
    }
  ]
}]

export default routerConfig
