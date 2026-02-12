# Vue2 大厂项目实战指南
<div class="doc-toc">
## 目录
1. [项目架构设计](#一项目架构设计)
2. [组件设计模式](#二组件设计模式)
3. [状态管理实战](#三状态管理实战)
4. [路由管理实战](#四路由管理实战)
5. [API封装与管理](#五api封装与管理)
6. [权限系统设计](#六权限系统设计)
7. [性能优化实战](#七性能优化实战)
8. [表单处理实战](#八表单处理实战)
9. [表格组件封装](#九表格组件封装)
10. [弹窗组件封装](#十弹窗组件封装)
11. [国际化方案](#十一国际化方案)
12. [主题切换方案](#十二主题切换方案)
13. [错误处理机制](#十三错误处理机制)
14. [单元测试实践](#十四单元测试实践)
15. [工程化配置](#十五工程化配置)


</div>

---

## 一、项目架构设计

### 1.1 目录结构规范（大厂标准）

```
src/
├── api/                    # API接口模块
│   ├── modules/           # 按业务模块划分
│   │   ├── user.js       # 用户相关API
│   │   ├── order.js      # 订单相关API
│   │   └── product.js    # 商品相关API
│   ├── request.js        # axios封装
│   └── index.js          # 统一导出
├── assets/                # 静态资源
│   ├── images/           # 图片
│   ├── fonts/            # 字体
│   └── styles/           # 全局样式
│       ├── variables.scss  # SCSS变量
│       ├── mixins.scss     # SCSS混入
│       ├── reset.scss      # 重置样式
│       └── common.scss     # 公共样式
├── components/            # 公共组件
│   ├── base/             # 基础组件
│   │   ├── BaseButton/
│   │   ├── BaseInput/
│   │   └── BaseModal/
│   ├── business/         # 业务组件
│   │   ├── UserSelector/
│   │   └── ProductCard/
│   └── layout/           # 布局组件
│       ├── AppHeader/
│       ├── AppSidebar/
│       └── AppFooter/
├── constants/             # 常量定义
│   ├── api.js            # API常量
│   ├── enum.js           # 枚举常量
│   └── regexp.js         # 正则常量
├── directives/           # 自定义指令
│   ├── permission.js
│   ├── clickOutside.js
│   └── index.js
├── filters/              # 过滤器
│   ├── date.js
│   ├── currency.js
│   └── index.js
├── mixins/               # 混入
│   ├── pagination.js
│   ├── form.js
│   └── list.js
├── plugins/              # 插件
│   ├── element.js        # UI库配置
│   └── axios.js          # axios配置
├── router/               # 路由
│   ├── modules/          # 路由模块
│   ├── guards.js         # 路由守卫
│   └── index.js
├── store/                # Vuex状态管理
│   ├── modules/          # 状态模块
│   ├── getters.js        # 全局getters
│   └── index.js
├── utils/                # 工具函数
│   ├── auth.js           # 认证相关
│   ├── storage.js        # 存储相关
│   ├── validate.js       # 验证相关
│   └── index.js
├── views/                # 页面视图
│   ├── dashboard/
│   ├── user/
│   ├── order/
│   └── system/
├── App.vue
└── main.js
```

### 1.2 入口文件配置（main.js）

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 样式
import '@/assets/styles/index.scss'

// 插件
import '@/plugins/element'

// 全局组件
import '@/components/base/install'

// 全局指令
import '@/directives/install'

// 全局过滤器
import '@/filters/install'

// 全局混入
import '@/mixins/install'

// 权限指令
import permission from '@/directives/permission'
Vue.directive('permission', permission)

// 生产环境配置
Vue.config.productionTip = false

// 全局错误处理
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Global Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  // 上报错误到监控平台
  if (process.env.NODE_ENV === 'production') {
    // errorTracker.report(err)
  }
}

// 全局警告处理
Vue.config.warnHandler = (msg, vm, trace) => {
  console.warn('Global Warning:', msg)
}

// 性能追踪
if (process.env.NODE_ENV === 'development') {
  Vue.config.performance = true
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

---

## 二、组件设计模式

### 2.1 高阶组件（HOC）模式

```javascript
// hoc/withLoading.js
export default function withLoading(WrappedComponent) {
  return {
    name: `WithLoading${WrappedComponent.name}`,
    
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      ...WrappedComponent.props
    },
    
    render(h) {
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map(vnode => {
          vnode.context = this._self
          return vnode
        })
      
      return h('div', { class: 'with-loading-wrapper' }, [
        h(WrappedComponent, {
          props: this.$props,
          on: this.$listeners,
          attrs: this.$attrs,
          scopedSlots: this.$scopedSlots
        }, slots),
        this.loading && h('div', { class: 'loading-mask' }, [
          h('div', { class: 'loading-spinner' })
        ])
      ])
    }
  }
}

// 使用
import withLoading from '@/hoc/withLoading'
import UserList from './UserList.vue'

export default withLoading(UserList)
```

### 2.2 Render函数组件

```javascript
// components/VirtualList.js
export default {
  name: 'VirtualList',
  
  props: {
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      default: 50
    },
    visibleCount: {
      type: Number,
      default: 10
    }
  },
  
  data() {
    return {
      startIndex: 0,
      scrollTop: 0
    }
  },
  
  computed: {
    endIndex() {
      return Math.min(
        this.startIndex + this.visibleCount,
        this.items.length
      )
    },
    
    visibleItems() {
      return this.items.slice(this.startIndex, this.endIndex)
    },
    
    totalHeight() {
      return this.items.length * this.itemHeight
    },
    
    offsetY() {
      return this.startIndex * this.itemHeight
    }
  },
  
  methods: {
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop
      this.startIndex = Math.floor(this.scrollTop / this.itemHeight)
    }
  },
  
  render(h) {
    return h('div', {
      class: 'virtual-list',
      style: {
        height: `${this.visibleCount * this.itemHeight}px`,
        overflow: 'auto'
      },
      on: {
        scroll: this.handleScroll
      }
    }, [
      h('div', {
        class: 'virtual-list__phantom',
        style: {
          height: `${this.totalHeight}px`
        }
      }),
      h('div', {
        class: 'virtual-list__content',
        style: {
          transform: `translateY(${this.offsetY}px)`
        }
      }, this.visibleItems.map((item, index) => {
        return this.$scopedSlots.default({
          item,
          index: this.startIndex + index
        })
      }))
    ])
  }
}
```

### 2.3 函数式组件

```javascript
// components/FunctionalButton.js
export default {
  name: 'FunctionalButton',
  functional: true,
  
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabled: Boolean,
    loading: Boolean
  },
  
  render(h, context) {
    const { props, data, children, listeners } = context
    const { type, size, disabled, loading } = props
    
    const buttonClass = [
      'func-button',
      `func-button--${type}`,
      `func-button--${size}`,
      {
        'is-disabled': disabled,
        'is-loading': loading
      }
    ]
    
    return h('button', {
      ...data,
      class: buttonClass,
      attrs: {
        disabled: disabled || loading
      },
      on: {
        click: (e) => {
          if (!disabled && !loading && listeners.click) {
            listeners.click(e)
          }
        }
      }
    }, [
      loading && h('span', { class: 'loading-icon' }),
      ...children
    ])
  }
}
```

### 2.4 Provider/Consumer模式

```javascript
// components/Provider.js
export const ThemeProvider = {
  name: 'ThemeProvider',
  
  provide() {
    return {
      theme: this.theme,
      toggleTheme: this.toggleTheme
    }
  },
  
  data() {
    return {
      currentTheme: 'light'
    }
  },
  
  computed: {
    theme() {
      return {
        mode: this.currentTheme,
        colors: this.currentTheme === 'light'
          ? { primary: '#1890ff', background: '#fff' }
          : { primary: '#177ddc', background: '#141414' }
      }
    }
  },
  
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    }
  },
  
  render() {
    return this.$slots.default?.[0]
  }
}

// components/Consumer.js
export const ThemeConsumer = {
  name: 'ThemeConsumer',
  
  inject: ['theme', 'toggleTheme'],
  
  render() {
    return this.$scopedSlots.default?.({
      theme: this.theme,
      toggleTheme: this.toggleTheme
    })
  }
}
```

---

## 三、状态管理实战

### 3.1 Vuex模块化设计

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 自动导入modules目录下的所有模块
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  // 严格模式（开发环境）
  strict: process.env.NODE_ENV !== 'production'
})

export default store
```

### 3.2 用户模块

```javascript
// store/modules/user.js
import { login, logout, getUserInfo } from '@/api/modules/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: null,
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = null
    state.roles = []
    state.permissions = []
  }
}

const actions = {
  // 登录
  async login({ commit }, loginForm) {
    const { username, password } = loginForm
    try {
      const { data } = await login({
        username: username.trim(),
        password
      })
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      return data
    } catch (error) {
      throw error
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit, state }) {
    try {
      const { data } = await getUserInfo(state.token)
      const { user, roles, permissions } = data
      
      commit('SET_USER_INFO', user)
      commit('SET_ROLES', roles)
      commit('SET_PERMISSIONS', permissions)
      
      return data
    } catch (error) {
      throw error
    }
  },
  
  // 登出
  async logout({ commit, dispatch }) {
    try {
      await logout()
    } finally {
      commit('CLEAR_USER')
      removeToken()
      resetRouter()
      
      // 重置其他模块状态
      dispatch('permission/resetRoutes', null, { root: true })
      dispatch('tagsView/delAllViews', null, { root: true })
    }
  },
  
  // 重置Token
  async resetToken({ commit }) {
    commit('CLEAR_USER')
    removeToken()
  },
  
  // 动态修改权限
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)
    
    const { roles } = await dispatch('getUserInfo')
    
    resetRouter()
    
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    accessRoutes.forEach(route => {
      router.addRoute(route)
    })
    
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

### 3.3 权限模块

```javascript
// store/modules/permission.js
import { asyncRoutes, constantRoutes } from '@/router'

// 判断是否有权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  }
  return true
}

// 过滤异步路由
function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES(state, routes) {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  RESET_ROUTES(state) {
    state.routes = constantRoutes
    state.addRoutes = []
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  
  resetRoutes({ commit }) {
    commit('RESET_ROUTES')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

### 3.4 标签页管理模块

```javascript
// store/modules/tagsView.js
const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW(state, view) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push({
      name: view.name,
      path: view.path,
      title: view.meta?.title || 'no-name',
      affix: view.meta?.affix
    })
  },
  
  ADD_CACHED_VIEW(state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta?.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  
  DEL_VISITED_VIEW(state, view) {
    const index = state.visitedViews.findIndex(v => v.path === view.path)
    if (index > -1) {
      state.visitedViews.splice(index, 1)
    }
  },
  
  DEL_CACHED_VIEW(state, view) {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews.splice(index, 1)
    }
  },
  
  DEL_OTHERS_VISITED_VIEWS(state, view) {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta?.affix || v.path === view.path
    })
  },
  
  DEL_OTHERS_CACHED_VIEWS(state, view) {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      state.cachedViews = []
    }
  },
  
  DEL_ALL_VISITED_VIEWS(state) {
    state.visitedViews = state.visitedViews.filter(v => v.meta?.affix)
  },
  
  DEL_ALL_CACHED_VIEWS(state) {
    state.cachedViews = []
  },
  
  UPDATE_VISITED_VIEW(state, view) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  
  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  
  delAllViews({ dispatch, state }) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews')
      dispatch('delAllCachedViews')
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  
  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

---

## 四、路由管理实战

### 4.1 路由配置

```javascript
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

// 动态路由（根据权限加载）
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'system', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user'),
        meta: { title: '用户管理', roles: ['admin'] }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', roles: ['admin'] }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu'),
        meta: { title: '菜单管理', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list'),
        meta: { title: '订单列表' }
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail'),
        meta: { title: '订单详情', activeMenu: '/order/list' },
        hidden: true
      }
    ]
  },
  // 404必须放在最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
```

### 4.2 路由守卫

```javascript
// router/guards.js
import router from './index'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
  // 设置页面标题
  document.title = getPageTitle(to.meta?.title)
  
  const hasToken = getToken()
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getUserInfo')
          
          // 生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          
          // 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，清除token并跳转登录
          await store.dispatch('user/resetToken')
          Message.error(error.message || '获取用户信息失败')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

function getPageTitle(pageTitle) {
  const title = process.env.VUE_APP_TITLE || '管理系统'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return title
}
```

---

## 五、API封装与管理

### 5.1 Axios封装

```javascript
// utils/request.js
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 自定义状态码
    if (res.code !== 0 && res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      
      // Token过期
      if (res.code === 401 || res.code === 50014) {
        MessageBox.confirm(
          '登录状态已过期，请重新登录',
          '确认退出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  error => {
    console.error('Response Error:', error)
    
    let message = '请求失败'
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请登录'
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 501:
          message = '服务未实现'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时'
    } else if (error.message.includes('Network')) {
      message = '网络异常'
    }
    
    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    
    return Promise.reject(error)
  }
)

// 封装请求方法
export function get(url, params, config = {}) {
  return service({
    method: 'get',
    url,
    params,
    ...config
  })
}

export function post(url, data, config = {}) {
  return service({
    method: 'post',
    url,
    data,
    ...config
  })
}

export function put(url, data, config = {}) {
  return service({
    method: 'put',
    url,
    data,
    ...config
  })
}

export function del(url, params, config = {}) {
  return service({
    method: 'delete',
    url,
    params,
    ...config
  })
}

// 上传文件
export function upload(url, file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  
  return service({
    method: 'post',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

// 下载文件
export function download(url, params, filename) {
  return service({
    method: 'get',
    url,
    params,
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response])
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = filename
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
  })
}

export default service
```

### 5.2 API模块化

```javascript
// api/modules/user.js
import { get, post, put, del } from '@/utils/request'

// 用户登录
export function login(data) {
  return post('/auth/login', data)
}

// 用户登出
export function logout() {
  return post('/auth/logout')
}

// 获取用户信息
export function getUserInfo() {
  return get('/user/info')
}

// 获取用户列表
export function getUserList(params) {
  return get('/user/list', params)
}

// 获取用户详情
export function getUserDetail(id) {
  return get(`/user/${id}`)
}

// 创建用户
export function createUser(data) {
  return post('/user', data)
}

// 更新用户
export function updateUser(id, data) {
  return put(`/user/${id}`, data)
}

// 删除用户
export function deleteUser(id) {
  return del(`/user/${id}`)
}

// 批量删除用户
export function batchDeleteUsers(ids) {
  return del('/user/batch', { ids })
}

// 重置密码
export function resetPassword(id, password) {
  return put(`/user/${id}/password`, { password })
}

// 修改状态
export function changeUserStatus(id, status) {
  return put(`/user/${id}/status`, { status })
}
```

---

## 六、权限系统设计

### 6.1 权限指令

```javascript
// directives/permission.js
import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const permissions = store.getters.permissions
  const roles = store.getters.roles
  
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const hasPermission = value.some(permission => {
        // 检查权限标识
        if (permissions.includes(permission)) {
          return true
        }
        // 检查角色
        if (roles.includes(permission)) {
          return true
        }
        return false
      })
      
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error('need permissions! Like v-permission="[\'admin\', \'editor\']"')
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
```

### 6.2 权限函数

```javascript
// utils/permission.js
import store from '@/store'

/**
 * 检查是否有权限
 * @param {Array} value - 权限标识数组
 * @returns {Boolean}
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters.permissions
    const roles = store.getters.roles
    
    return value.some(permission => {
      return permissions.includes(permission) || roles.includes(permission)
    })
  }
  return false
}

/**
 * 检查是否有角色
 * @param {Array} value - 角色数组
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters.roles
    return value.some(role => roles.includes(role))
  }
  return false
}
```

### 6.3 权限混入

```javascript
// mixins/permission.js
import { checkPermission, checkRole } from '@/utils/permission'

export default {
  methods: {
    /**
     * 检查权限
     * @param {String|Array} permission - 权限标识
     * @returns {Boolean}
     */
    $hasPermission(permission) {
      const permissions = Array.isArray(permission) ? permission : [permission]
      return checkPermission(permissions)
    },
    
    /**
     * 检查角色
     * @param {String|Array} role - 角色标识
     * @returns {Boolean}
     */
    $hasRole(role) {
      const roles = Array.isArray(role) ? role : [role]
      return checkRole(roles)
    }
  }
}
```

### 6.4 按钮级权限控制

```vue
<template>
  <div class="user-management">
    <div class="toolbar">
      <!-- 使用指令 -->
      <el-button
        v-permission="['system:user:add']"
        type="primary"
        @click="handleAdd"
      >
        新增用户
      </el-button>
      
      <!-- 使用方法 -->
      <el-button
        v-if="$hasPermission('system:user:export')"
        @click="handleExport"
      >
        导出
      </el-button>
      
      <el-button
        v-if="$hasRole(['admin', 'super-admin'])"
        type="danger"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </div>
    
    <el-table :data="tableData">
      <el-table-column label="操作" width="200">
        <template slot-scope="{ row }">
          <el-button
            v-permission="['system:user:edit']"
            type="text"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['system:user:delete']"
            type="text"
            class="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import permissionMixin from '@/mixins/permission'

export default {
  mixins: [permissionMixin],
  
  data() {
    return {
      tableData: []
    }
  },
  
  methods: {
    handleAdd() {},
    handleEdit(row) {},
    handleDelete(row) {},
    handleExport() {},
    handleBatchDelete() {}
  }
}
</script>
```

---

## 七、性能优化实战

### 7.1 路由懒加载

```javascript
// 基础懒加载
const UserList = () => import('@/views/user/list')

// 带预加载提示
const UserList = () => import(/* webpackChunkName: "user" */ '@/views/user/list')

// 按组分块
const routes = [
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/list')
      },
      {
        path: 'detail/:id',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/detail')
      }
    ]
  }
]
```

### 7.2 组件懒加载

```javascript
// 异步组件
export default {
  components: {
    HeavyComponent: () => import('./HeavyComponent.vue'),
    
    // 带加载状态
    AsyncComponent: () => ({
      component: import('./AsyncComponent.vue'),
      loading: LoadingComponent,
      error: ErrorComponent,
      delay: 200,
      timeout: 3000
    })
  }
}
```

### 7.3 列表性能优化

```vue
<template>
  <div class="list-container">
    <!-- 使用v-show代替v-if -->
    <div v-show="showFilter" class="filter-panel">
      <!-- 筛选面板 -->
    </div>
    
    <!-- 虚拟滚动 -->
    <virtual-list
      :items="items"
      :item-height="50"
      :visible-count="20"
    >
      <template #default="{ item }">
        <div class="list-item">
          {{ item.name }}
        </div>
      </template>
    </virtual-list>
    
    <!-- 使用Object.freeze冻结大数据 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  
  async created() {
    const data = await this.fetchData()
    // 冻结大数据列表，避免响应式开销
    this.items = Object.freeze(data)
  },
  
  methods: {
    async fetchData() {
      // ...
    }
  }
}
</script>
```

### 7.4 图片懒加载

```javascript
// directives/lazyLoad.js
export default {
  inserted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.src = binding.value
            observer.unobserve(el)
          }
        })
      },
      {
        rootMargin: '100px'
      }
    )
    observer.observe(el)
    el._lazyObserver = observer
  },
  
  unbind(el) {
    el._lazyObserver?.disconnect()
  }
}
```

### 7.5 防抖节流

```javascript
// utils/debounce.js
export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle(fn, interval = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 使用
export default {
  created() {
    this.handleSearch = debounce(this.search, 300)
    this.handleScroll = throttle(this.onScroll, 100)
  },
  
  methods: {
    search(keyword) {
      // 搜索逻辑
    },
    onScroll() {
      // 滚动处理
    }
  }
}
```

---

## 八、表单处理实战

### 8.1 表单混入

```javascript
// mixins/form.js
export default {
  data() {
    return {
      formLoading: false,
      submitLoading: false
    }
  },
  
  methods: {
    // 验证表单
    async validateForm(formRef = 'form') {
      try {
        await this.$refs[formRef].validate()
        return true
      } catch (error) {
        return false
      }
    },
    
    // 重置表单
    resetForm(formRef = 'form') {
      this.$refs[formRef]?.resetFields()
    },
    
    // 清除验证
    clearValidate(formRef = 'form', props) {
      this.$refs[formRef]?.clearValidate(props)
    },
    
    // 滚动到错误位置
    scrollToError(formRef = 'form') {
      this.$nextTick(() => {
        const errorEl = this.$refs[formRef]?.$el.querySelector('.is-error')
        errorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    },
    
    // 提交表单
    async submitForm(formRef, submitFn, options = {}) {
      const {
        successMsg = '提交成功',
        errorMsg = '提交失败',
        resetAfterSuccess = false
      } = options
      
      const valid = await this.validateForm(formRef)
      if (!valid) {
        this.scrollToError(formRef)
        return false
      }
      
      this.submitLoading = true
      try {
        await submitFn()
        this.$message.success(successMsg)
        
        if (resetAfterSuccess) {
          this.resetForm(formRef)
        }
        
        return true
      } catch (error) {
        this.$message.error(error.message || errorMsg)
        return false
      } finally {
        this.submitLoading = false
      }
    }
  }
}
```

### 8.2 动态表单

```vue
<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
    <el-form-item
      v-for="field in fields"
      :key="field.prop"
      :label="field.label"
      :prop="field.prop"
      :rules="field.rules"
    >
      <!-- 输入框 -->
      <el-input
        v-if="field.type === 'input'"
        v-model="formData[field.prop]"
        v-bind="field.props"
      />
      
      <!-- 选择框 -->
      <el-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.prop]"
        v-bind="field.props"
      >
        <el-option
          v-for="option in field.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      
      <!-- 日期选择 -->
      <el-date-picker
        v-else-if="field.type === 'date'"
        v-model="formData[field.prop]"
        v-bind="field.props"
      />
      
      <!-- 开关 -->
      <el-switch
        v-else-if="field.type === 'switch'"
        v-model="formData[field.prop]"
        v-bind="field.props"
      />
      
      <!-- 自定义插槽 -->
      <slot
        v-else-if="field.type === 'slot'"
        :name="field.slotName || field.prop"
        :field="field"
        :form-data="formData"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        提交
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    async handleSubmit() {
      try {
        await this.$refs.form.validate()
        this.$emit('submit', this.formData)
      } catch (error) {
        console.log('validate error:', error)
      }
    },
    
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('reset')
    }
  }
}
</script>
```

---

## 九、表格组件封装

### 9.1 高级表格组件

```vue
<template>
  <div class="base-table">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="base-table__toolbar">
      <div class="left">
        <slot name="toolbar-left" />
      </div>
      <div class="right">
        <slot name="toolbar-right">
          <el-button
            v-if="showRefresh"
            icon="el-icon-refresh"
            circle
            @click="handleRefresh"
          />
          <el-dropdown v-if="showColumnSetting" trigger="click">
            <el-button icon="el-icon-setting" circle />
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="visibleColumns">
                <el-dropdown-item
                  v-for="col in allColumns"
                  :key="col.prop"
                >
                  <el-checkbox :label="col.prop">
                    {{ col.label }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </slot>
      </div>
    </div>
    
    <!-- 表格 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :stripe="stripe"
      :row-key="rowKey"
      :default-sort="defaultSort"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        align="center"
        :reserve-selection="reserveSelection"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
        :index="indexMethod"
      />
      
      <!-- 数据列 -->
      <template v-for="column in displayColumns">
        <el-table-column
          v-if="!column.hidden"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'center'"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template slot-scope="scope">
            <!-- 自定义插槽 -->
            <slot
              v-if="column.slotName"
              :name="column.slotName"
              :row="scope.row"
              :column="column"
              :$index="scope.$index"
            />
            
            <!-- 自定义渲染函数 -->
            <span v-else-if="column.render">
              {{ column.render(scope.row, column, scope.$index) }}
            </span>
            
            <!-- 格式化 -->
            <span v-else-if="column.formatter">
              {{ column.formatter(scope.row[column.prop], scope.row) }}
            </span>
            
            <!-- 字典映射 -->
            <span v-else-if="column.dictType">
              {{ getDictLabel(column.dictType, scope.row[column.prop]) }}
            </span>
            
            <!-- 默认显示 -->
            <span v-else>
              {{ scope.row[column.prop] }}
            </span>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="$scopedSlots.action"
        label="操作"
        :width="actionWidth"
        :fixed="actionFixed"
        align="center"
      >
        <template slot-scope="scope">
          <slot name="action" :row="scope.row" :$index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      v-if="showPagination"
      class="base-table__pagination"
      :current-page="pagination.page"
      :page-sizes="pageSizes"
      :page-size="pagination.size"
      :total="pagination.total"
      :layout="paginationLayout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  
  inheritAttrs: false,
  
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: [String, Number],
    maxHeight: [String, Number],
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    selection: {
      type: Boolean,
      default: false
    },
    reserveSelection: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        size: 10,
        total: 0
      })
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    paginationLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    defaultSort: Object,
    showToolbar: {
      type: Boolean,
      default: true
    },
    showRefresh: {
      type: Boolean,
      default: true
    },
    showColumnSetting: {
      type: Boolean,
      default: true
    },
    actionWidth: {
      type: [String, Number],
      default: 150
    },
    actionFixed: {
      type: [Boolean, String],
      default: 'right'
    }
  },
  
  data() {
    return {
      visibleColumns: []
    }
  },
  
  computed: {
    allColumns() {
      return this.columns.filter(col => col.prop)
    },
    
    displayColumns() {
      if (this.visibleColumns.length === 0) {
        return this.columns
      }
      return this.columns.filter(col => {
        return !col.prop || this.visibleColumns.includes(col.prop)
      })
    }
  },
  
  created() {
    this.visibleColumns = this.allColumns.map(col => col.prop)
  },
  
  methods: {
    // 获取表格实例
    getTableRef() {
      return this.$refs.table
    },
    
    // 清除选择
    clearSelection() {
      this.$refs.table?.clearSelection()
    },
    
    // 切换行选中
    toggleRowSelection(row, selected) {
      this.$refs.table?.toggleRowSelection(row, selected)
    },
    
    // 设置当前行
    setCurrentRow(row) {
      this.$refs.table?.setCurrentRow(row)
    },
    
    // 序号方法
    indexMethod(index) {
      return (this.pagination.page - 1) * this.pagination.size + index + 1
    },
    
    // 选择变化
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    
    // 排序变化
    handleSortChange({ prop, order }) {
      this.$emit('sort-change', { prop, order })
    },
    
    // 行点击
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    
    // 分页大小变化
    handleSizeChange(size) {
      this.$emit('update:pagination', {
        ...this.pagination,
        size,
        page: 1
      })
      this.$emit('page-change', { page: 1, size })
    },
    
    // 页码变化
    handleCurrentChange(page) {
      this.$emit('update:pagination', {
        ...this.pagination,
        page
      })
      this.$emit('page-change', { page, size: this.pagination.size })
    },
    
    // 刷新
    handleRefresh() {
      this.$emit('refresh')
    },
    
    // 字典标签
    getDictLabel(dictType, value) {
      // 从vuex或全局字典中获取
      const dict = this.$store.getters.dictMap[dictType]
      return dict?.[value] || value
    }
  }
}
</script>

<style lang="scss" scoped>
.base-table {
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .right {
      display: flex;
      gap: 8px;
    }
  }
  
  &__pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
```

---

## 十、弹窗组件封装

### 10.1 通用弹窗组件

```vue
<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="handleBeforeClose"
    :destroy-on-close="destroyOnClose"
    custom-class="base-dialog"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <!-- 头部插槽 -->
    <template slot="title">
      <slot name="title">
        <span class="dialog-title">{{ title }}</span>
      </slot>
    </template>
    
    <!-- 内容区域 -->
    <div v-loading="loading" class="dialog-body" :style="bodyStyle">
      <slot />
    </div>
    
    <!-- 底部按钮 -->
    <template v-if="showFooter" slot="footer">
      <slot name="footer">
        <el-button @click="handleCancel">
          {{ cancelText }}
        </el-button>
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '15vh'
    },
    modal: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    loading: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: String,
      default: '60vh'
    }
  },
  
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    
    bodyStyle() {
      return {
        maxHeight: this.maxHeight,
        overflowY: 'auto'
      }
    }
  },
  
  methods: {
    handleBeforeClose(done) {
      if (this.$listeners['before-close']) {
        this.$emit('before-close', done)
      } else {
        done()
      }
    },
    
    handleOpen() {
      this.$emit('open')
    },
    
    handleOpened() {
      this.$emit('opened')
    },
    
    handleClose() {
      this.$emit('close')
    },
    
    handleClosed() {
      this.$emit('closed')
    },
    
    handleConfirm() {
      this.$emit('confirm')
    },
    
    handleCancel() {
      this.$emit('cancel')
      this.visible = false
    },
    
    // 手动关闭
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.base-dialog {
  .dialog-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .dialog-body {
    padding: 10px 0;
  }
}
</style>
```

### 10.2 表单弹窗

```vue
<template>
  <base-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :confirm-loading="submitLoading"
    @confirm="handleSubmit"
    @closed="handleClosed"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
    >
      <slot :form-data="formData" />
    </el-form>
  </base-dialog>
</template>

<script>
import formMixin from '@/mixins/form'

export default {
  name: 'FormDialog',
  
  mixins: [formMixin],
  
  props: {
    value: Boolean,
    title: String,
    width: {
      type: String,
      default: '500px'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    formData: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  
  methods: {
    async handleSubmit() {
      const valid = await this.validateForm()
      if (!valid) {
        return
      }
      
      this.submitLoading = true
      try {
        await this.$emit('submit', this.formData)
        this.visible = false
      } finally {
        this.submitLoading = false
      }
    },
    
    handleClosed() {
      this.resetForm()
      this.$emit('closed')
    }
  }
}
</script>
```

---

## 十一、国际化方案

### 11.1 Vue I18n配置

```javascript
// plugins/i18n.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import elementZhCN from 'element-ui/lib/locale/lang/zh-CN'
import elementEnUS from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

// 加载语言包
function loadLocaleMessages() {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  
  return messages
}

// 获取语言
function getLanguage() {
  const language = localStorage.getItem('language')
  if (language) {
    return language
  }
  
  const browserLang = navigator.language.toLowerCase()
  const locales = Object.keys(loadLocaleMessages())
  
  for (const locale of locales) {
    if (browserLang.includes(locale)) {
      return locale
    }
  }
  
  return 'zh-CN'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  fallbackLocale: 'zh-CN',
  messages: loadLocaleMessages()
})

// Element UI国际化
ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
```

### 11.2 语言包

```json
// locales/zh-CN.json
{
  "common": {
    "confirm": "确定",
    "cancel": "取消",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "add": "新增",
    "search": "搜索",
    "reset": "重置",
    "export": "导出",
    "import": "导入"
  },
  "login": {
    "title": "系统登录",
    "username": "用户名",
    "password": "密码",
    "rememberMe": "记住我",
    "login": "登录",
    "usernamePlaceholder": "请输入用户名",
    "passwordPlaceholder": "请输入密码"
  },
  "menu": {
    "dashboard": "首页",
    "system": "系统管理",
    "user": "用户管理",
    "role": "角色管理"
  }
}
```

```json
// locales/en-US.json
{
  "common": {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "reset": "Reset",
    "export": "Export",
    "import": "Import"
  },
  "login": {
    "title": "System Login",
    "username": "Username",
    "password": "Password",
    "rememberMe": "Remember me",
    "login": "Login",
    "usernamePlaceholder": "Please enter username",
    "passwordPlaceholder": "Please enter password"
  },
  "menu": {
    "dashboard": "Dashboard",
    "system": "System",
    "user": "User Management",
    "role": "Role Management"
  }
}
```

---

## 十二、主题切换方案

### 12.1 CSS变量方案

```scss
// assets/styles/variables.scss
:root {
  // 主色
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  
  // 文字颜色
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --text-placeholder: #C0C4CC;
  
  // 背景颜色
  --bg-color: #FFFFFF;
  --bg-page: #F2F3F5;
  --bg-hover: #F5F7FA;
  
  // 边框颜色
  --border-color: #DCDFE6;
  --border-light: #E4E7ED;
  
  // 阴影
  --box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

// 暗黑主题
[data-theme="dark"] {
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  
  --text-primary: #E5EAF3;
  --text-regular: #CFD3DC;
  --text-secondary: #A3A6AD;
  --text-placeholder: #8D9095;
  
  --bg-color: #141414;
  --bg-page: #0A0A0A;
  --bg-hover: #262626;
  
  --border-color: #4C4D4F;
  --border-light: #414243;
  
  --box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}
```

### 12.2 主题切换

```javascript
// utils/theme.js
const THEME_KEY = 'app-theme'

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export function toggleTheme() {
  const current = getTheme()
  const next = current === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}

// 初始化主题
export function initTheme() {
  const theme = getTheme()
  document.documentElement.setAttribute('data-theme', theme)
}
```

---

## 十三、错误处理机制

### 13.1 全局错误处理

```javascript
// utils/errorHandler.js
import Vue from 'vue'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 错误类型
const ErrorTypes = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  BUSINESS: 'BUSINESS',
  UNKNOWN: 'UNKNOWN'
}

// 错误处理器
class ErrorHandler {
  constructor() {
    this.handlers = new Map()
    this.init()
  }
  
  init() {
    // 注册Vue错误处理
    Vue.config.errorHandler = (err, vm, info) => {
      this.handle(err, { vm, info })
    }
    
    // 未捕获的Promise错误
    window.addEventListener('unhandledrejection', event => {
      this.handle(event.reason)
      event.preventDefault()
    })
    
    // 全局错误
    window.onerror = (msg, url, line, col, error) => {
      this.handle(error || new Error(msg))
      return true
    }
  }
  
  handle(error, context = {}) {
    const type = this.getErrorType(error)
    const handler = this.handlers.get(type) || this.defaultHandler
    handler(error, context)
    this.report(error, context)
  }
  
  getErrorType(error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401 || status === 403) {
        return ErrorTypes.AUTH
      }
      if (status >= 500) {
        return ErrorTypes.NETWORK
      }
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('Network')) {
      return ErrorTypes.NETWORK
    }
    if (error.code && error.code !== 0) {
      return ErrorTypes.BUSINESS
    }
    return ErrorTypes.UNKNOWN
  }
  
  register(type, handler) {
    this.handlers.set(type, handler)
  }
  
  defaultHandler(error) {
    console.error('Unhandled error:', error)
    Message.error(error.message || '系统错误')
  }
  
  report(error, context) {
    if (process.env.NODE_ENV === 'production') {
      // 上报到监控平台
      // errorTracker.report({
      //   error,
      //   context,
      //   user: store.getters.userInfo,
      //   route: router.currentRoute
      // })
    }
  }
}

const errorHandler = new ErrorHandler()

// 注册错误处理器
errorHandler.register(ErrorTypes.AUTH, () => {
  Message.error('登录已过期，请重新登录')
  store.dispatch('user/resetToken')
  router.push(`/login?redirect=${router.currentRoute.fullPath}`)
})

errorHandler.register(ErrorTypes.NETWORK, () => {
  Message.error('网络连接失败，请检查网络')
})

errorHandler.register(ErrorTypes.BUSINESS, (error) => {
  Message.error(error.message || '操作失败')
})

export default errorHandler
```

---

## 十四、单元测试实践

### 14.1 Jest配置

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
    '**/__tests__/**/*.spec.(js|jsx|ts|tsx)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['html', 'text-summary'],
  snapshotSerializers: ['jest-serializer-vue']
}
```

### 14.2 组件测试

```javascript
// tests/unit/components/BaseButton.spec.js
import { shallowMount } from '@vue/test-utils'
import BaseButton from '@/components/base/BaseButton.vue'

describe('BaseButton.vue', () => {
  it('renders slot content', () => {
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: '按钮文字'
      }
    })
    expect(wrapper.text()).toContain('按钮文字')
  })
  
  it('emits click event', async () => {
    const wrapper = shallowMount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
  
  it('does not emit click when disabled', async () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        disabled: true
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
  
  it('shows loading state', () => {
    const wrapper = shallowMount(BaseButton, {
      propsData: {
        loading: true
      }
    })
    expect(wrapper.find('.loading-icon').exists()).toBe(true)
  })
})
```

---

## 十五、工程化配置

### 15.1 Vue CLI配置

```javascript
// vue.config.js
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  
  configureWebpack: {
    name: process.env.VUE_APP_TITLE,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  
  chainWebpack(config) {
    // 预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/],
        include: 'initial'
      }
    ])
    
    // 移除prefetch
    config.plugins.delete('prefetch')
    
    // SVG Sprite
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    
    // 生产环境配置
    config.when(process.env.NODE_ENV !== 'development', config => {
      // 代码分割
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      
      // 运行时代码
      config.optimization.runtimeChunk('single')
    })
  }
}
```

---

以上是Vue2大厂项目实战指南，涵盖了企业级项目开发中的核心技术和最佳实践。
