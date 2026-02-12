# Vue3 大厂项目实战指南
<div class="doc-toc">
## 目录
1. [项目架构设计](#一项目架构设计)
2. [组合式函数设计](#二组合式函数设计)
3. [Pinia状态管理实战](#三pinia状态管理实战)
4. [路由管理实战](#四路由管理实战)
5. [API层封装](#五api层封装)
6. [权限系统设计](#六权限系统设计)
7. [性能优化实战](#七性能优化实战)
8. [表单处理实战](#八表单处理实战)
9. [表格组件封装](#九表格组件封装)
10. [弹窗组件封装](#十弹窗组件封装)
11. [布局系统设计](#十一布局系统设计)
12. [主题与样式系统](#十二主题与样式系统)
13. [错误处理与监控](#十三错误处理与监控)
14. [单元测试实践](#十四单元测试实践)
15. [工程化配置](#十五工程化配置)


</div>

---

## 一、项目架构设计

### 1.1 目录结构规范（大厂标准）

```
src/
├── api/                    # API接口层
│   ├── modules/           # 按模块划分
│   │   ├── user.js
│   │   ├── order.js
│   │   └── product.js
│   ├── request.js         # axios封装
│   └── index.js
├── assets/                # 静态资源
│   ├── images/
│   ├── fonts/
│   └── styles/
│       ├── variables.scss
│       ├── mixins.scss
│       └── index.scss
├── components/            # 公共组件
│   ├── base/             # 基础组件
│   ├── business/         # 业务组件
│   └── layout/           # 布局组件
├── composables/          # 组合式函数
│   ├── useRequest.js
│   ├── useTable.js
│   ├── useForm.js
│   └── index.js
├── constants/            # 常量
│   ├── api.js
│   └── enum.js
├── directives/           # 自定义指令
│   ├── permission.js
│   ├── clickOutside.js
│   └── index.js
├── hooks/                # 通用hooks
│   ├── useLoading.js
│   ├── useModal.js
│   └── index.js
├── layouts/              # 布局组件
│   ├── default/
│   ├── blank/
│   └── index.js
├── plugins/              # 插件
│   └── index.js
├── router/               # 路由
│   ├── modules/
│   ├── guards.js
│   └── index.js
├── stores/               # Pinia状态
│   ├── modules/
│   └── index.js
├── utils/                # 工具函数
│   ├── auth.js
│   ├── storage.js
│   ├── validate.js
│   └── index.js
├── views/                # 页面视图
│   ├── dashboard/
│   ├── user/
│   └── system/
├── App.vue
└── main.js
```

### 1.2 入口文件配置

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 样式
import '@/assets/styles/index.scss'

// 插件
import { setupPlugins } from '@/plugins'

// 全局组件
import { setupGlobalComponents } from '@/components'

// 全局指令
import { setupDirectives } from '@/directives'

// 错误处理
import { setupErrorHandler } from '@/utils/errorHandler'

const app = createApp(App)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 路由
app.use(router)

// 插件
setupPlugins(app)

// 全局组件
setupGlobalComponents(app)

// 全局指令
setupDirectives(app)

// 错误处理
setupErrorHandler(app)

// 挂载
router.isReady().then(() => {
  app.mount('#app')
})
```

### 1.3 环境配置

```javascript
// .env.development
VITE_APP_TITLE=管理系统
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_PUBLIC_PATH=/

// .env.production
VITE_APP_TITLE=管理系统
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_PUBLIC_PATH=/

// .env.staging
VITE_APP_TITLE=管理系统(测试)
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://staging-api.example.com
VITE_APP_PUBLIC_PATH=/
```

---

## 二、组合式函数设计

### 2.1 useRequest - 请求封装

```javascript
// composables/useRequest.js
import { ref, shallowRef, computed } from 'vue'

export function useRequest(requestFn, options = {}) {
  const {
    immediate = false,
    initialData = null,
    onSuccess,
    onError,
    onFinally
  } = options
  
  const data = shallowRef(initialData)
  const error = shallowRef(null)
  const loading = ref(false)
  
  const isSuccess = computed(() => !error.value && data.value !== null)
  const isError = computed(() => !!error.value)
  
  async function execute(...args) {
    loading.value = true
    error.value = null
    
    try {
      const result = await requestFn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      error.value = e
      onError?.(e)
      throw e
    } finally {
      loading.value = false
      onFinally?.()
    }
  }
  
  function reset() {
    data.value = initialData
    error.value = null
    loading.value = false
  }
  
  if (immediate) {
    execute()
  }
  
  return {
    data,
    error,
    loading,
    isSuccess,
    isError,
    execute,
    reset
  }
}

// 带分页的请求
export function usePaginatedRequest(requestFn, options = {}) {
  const {
    defaultPageSize = 10,
    ...restOptions
  } = options
  
  const pagination = ref({
    page: 1,
    pageSize: defaultPageSize,
    total: 0
  })
  
  const { data, loading, error, execute: baseExecute, reset: baseReset } = useRequest(
    async (params = {}) => {
      const result = await requestFn({
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
        ...params
      })
      pagination.value.total = result.total
      return result.list
    },
    restOptions
  )
  
  async function execute(params) {
    return baseExecute(params)
  }
  
  async function changePage(page) {
    pagination.value.page = page
    return execute()
  }
  
  async function changePageSize(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    return execute()
  }
  
  function reset() {
    pagination.value = {
      page: 1,
      pageSize: defaultPageSize,
      total: 0
    }
    baseReset()
  }
  
  return {
    data,
    loading,
    error,
    pagination,
    execute,
    changePage,
    changePageSize,
    reset
  }
}
```

### 2.2 useTable - 表格封装

```javascript
// composables/useTable.js
import { ref, reactive, computed, watch } from 'vue'
import { usePaginatedRequest } from './useRequest'

export function useTable(fetchApi, options = {}) {
  const {
    defaultParams = {},
    immediate = true,
    rowKey = 'id',
    transformData = (data) => data
  } = options
  
  // 查询参数
  const queryParams = reactive({ ...defaultParams })
  
  // 选中行
  const selectedRows = ref([])
  const selectedKeys = computed(() => selectedRows.value.map(row => row[rowKey]))
  
  // 排序
  const sortInfo = ref({
    prop: '',
    order: ''
  })
  
  // 请求
  const {
    data: tableData,
    loading,
    pagination,
    execute: fetchData,
    changePage,
    changePageSize,
    reset: resetRequest
  } = usePaginatedRequest(
    (params) => fetchApi({ ...queryParams, ...sortInfo.value, ...params }),
    { immediate }
  )
  
  // 转换数据
  const displayData = computed(() => {
    return transformData(tableData.value || [])
  })
  
  // 搜索
  function search() {
    pagination.value.page = 1
    return fetchData()
  }
  
  // 重置查询
  function resetQuery() {
    Object.assign(queryParams, defaultParams)
    pagination.value.page = 1
    return fetchData()
  }
  
  // 刷新
  function refresh() {
    return fetchData()
  }
  
  // 排序变化
  function handleSortChange({ prop, order }) {
    sortInfo.value = { prop, order }
    return fetchData()
  }
  
  // 选择变化
  function handleSelectionChange(selection) {
    selectedRows.value = selection
  }
  
  // 清除选择
  function clearSelection() {
    selectedRows.value = []
  }
  
  return {
    // 数据
    tableData: displayData,
    loading,
    pagination,
    queryParams,
    selectedRows,
    selectedKeys,
    sortInfo,
    
    // 方法
    fetchData,
    search,
    resetQuery,
    refresh,
    changePage,
    changePageSize,
    handleSortChange,
    handleSelectionChange,
    clearSelection
  }
}
```

### 2.3 useForm - 表单封装

```javascript
// composables/useForm.js
import { ref, reactive, computed, toRaw } from 'vue'
import { cloneDeep } from 'lodash-es'

export function useForm(initialValues = {}, options = {}) {
  const {
    transform,
    onValuesChange
  } = options
  
  const formRef = ref(null)
  const initialData = cloneDeep(initialValues)
  const formData = reactive(cloneDeep(initialValues))
  const loading = ref(false)
  
  // 表单是否被修改
  const isDirty = computed(() => {
    return JSON.stringify(toRaw(formData)) !== JSON.stringify(initialData)
  })
  
  // 验证表单
  async function validate() {
    if (!formRef.value) return true
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }
  
  // 验证指定字段
  async function validateField(field) {
    if (!formRef.value) return true
    try {
      await formRef.value.validateField(field)
      return true
    } catch (error) {
      return false
    }
  }
  
  // 重置表单
  function resetFields() {
    Object.assign(formData, cloneDeep(initialData))
    formRef.value?.resetFields()
  }
  
  // 清除验证
  function clearValidate(props) {
    formRef.value?.clearValidate(props)
  }
  
  // 设置字段值
  function setFieldValue(field, value) {
    formData[field] = value
    onValuesChange?.(formData)
  }
  
  // 设置多个字段值
  function setFieldsValue(values) {
    Object.assign(formData, values)
    onValuesChange?.(formData)
  }
  
  // 获取表单数据
  function getFieldsValue() {
    const data = toRaw(formData)
    return transform ? transform(data) : data
  }
  
  // 滚动到错误字段
  function scrollToField(field) {
    formRef.value?.scrollToField(field)
  }
  
  // 提交表单
  async function submit(submitFn) {
    const valid = await validate()
    if (!valid) return false
    
    loading.value = true
    try {
      const data = getFieldsValue()
      await submitFn(data)
      return true
    } catch (error) {
      console.error('Submit error:', error)
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    formRef,
    formData,
    loading,
    isDirty,
    validate,
    validateField,
    resetFields,
    clearValidate,
    setFieldValue,
    setFieldsValue,
    getFieldsValue,
    scrollToField,
    submit
  }
}
```

### 2.4 useModal - 弹窗封装

```javascript
// composables/useModal.js
import { ref, computed } from 'vue'

export function useModal(options = {}) {
  const {
    defaultVisible = false,
    onOpen,
    onClose
  } = options
  
  const visible = ref(defaultVisible)
  const loading = ref(false)
  const data = ref(null)
  const mode = ref('create') // create | edit | view
  
  const isCreate = computed(() => mode.value === 'create')
  const isEdit = computed(() => mode.value === 'edit')
  const isView = computed(() => mode.value === 'view')
  const title = computed(() => {
    const titles = {
      create: '新增',
      edit: '编辑',
      view: '查看'
    }
    return titles[mode.value]
  })
  
  function open(config = {}) {
    const { mode: openMode = 'create', data: openData = null } = config
    mode.value = openMode
    data.value = openData
    visible.value = true
    onOpen?.({ mode: openMode, data: openData })
  }
  
  function close() {
    visible.value = false
    onClose?.()
  }
  
  function setLoading(value) {
    loading.value = value
  }
  
  function reset() {
    data.value = null
    mode.value = 'create'
    loading.value = false
  }
  
  return {
    visible,
    loading,
    data,
    mode,
    title,
    isCreate,
    isEdit,
    isView,
    open,
    close,
    setLoading,
    reset
  }
}
```

### 2.5 useLoading - 加载状态

```javascript
// composables/useLoading.js
import { ref, computed } from 'vue'

export function useLoading(initialValue = false) {
  const loadingCount = ref(initialValue ? 1 : 0)
  
  const loading = computed(() => loadingCount.value > 0)
  
  function startLoading() {
    loadingCount.value++
  }
  
  function endLoading() {
    loadingCount.value = Math.max(0, loadingCount.value - 1)
  }
  
  async function withLoading(fn) {
    startLoading()
    try {
      return await fn()
    } finally {
      endLoading()
    }
  }
  
  return {
    loading,
    startLoading,
    endLoading,
    withLoading
  }
}
```

---

## 三、Pinia状态管理实战

### 3.1 用户状态

```javascript
// stores/modules/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, getUserInfo } from '@/api/modules/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(getToken() || '')
  const userInfo = ref(null)
  const roles = ref([])
  const permissions = ref([])
  
  // getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => roles.value.includes('admin'))
  const userName = computed(() => userInfo.value?.name || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  
  // actions
  async function loginAction(loginForm) {
    const { username, password } = loginForm
    const res = await login({ username: username.trim(), password })
    token.value = res.data.token
    setToken(res.data.token)
    return res.data
  }
  
  async function getUserInfoAction() {
    const res = await getUserInfo()
    const { user, roles: userRoles, permissions: userPermissions } = res.data
    userInfo.value = user
    roles.value = userRoles
    permissions.value = userPermissions
    return res.data
  }
  
  async function logoutAction() {
    try {
      await logout()
    } finally {
      resetState()
      removeToken()
      resetRouter()
    }
  }
  
  function resetState() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
  }
  
  function hasPermission(permission) {
    if (isAdmin.value) return true
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.value.includes(p))
    }
    return permissions.value.includes(permission)
  }
  
  function hasRole(role) {
    if (Array.isArray(role)) {
      return role.some(r => roles.value.includes(r))
    }
    return roles.value.includes(role)
  }
  
  return {
    // state
    token,
    userInfo,
    roles,
    permissions,
    
    // getters
    isLoggedIn,
    isAdmin,
    userName,
    avatar,
    
    // actions
    loginAction,
    getUserInfoAction,
    logoutAction,
    resetState,
    hasPermission,
    hasRole
  }
}, {
  persist: {
    paths: ['token']
  }
})
```

### 3.2 权限路由状态

```javascript
// stores/modules/permission.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { asyncRoutes, constantRoutes } from '@/router'
import { useUserStore } from './user'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])
  const addRoutes = ref([])
  
  const menuRoutes = computed(() => {
    return routes.value.filter(route => !route.hidden)
  })
  
  function hasPermission(route) {
    const userStore = useUserStore()
    if (route.meta?.roles) {
      return route.meta.roles.some(role => userStore.roles.includes(role))
    }
    return true
  }
  
  function filterAsyncRoutes(routes) {
    const result = []
    routes.forEach(route => {
      const tmp = { ...route }
      if (hasPermission(tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children)
        }
        result.push(tmp)
      }
    })
    return result
  }
  
  async function generateRoutes() {
    const userStore = useUserStore()
    let accessedRoutes
    
    if (userStore.isAdmin) {
      accessedRoutes = asyncRoutes || []
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes)
    }
    
    addRoutes.value = accessedRoutes
    routes.value = constantRoutes.concat(accessedRoutes)
    
    return accessedRoutes
  }
  
  function resetRoutes() {
    routes.value = constantRoutes
    addRoutes.value = []
  }
  
  return {
    routes,
    addRoutes,
    menuRoutes,
    generateRoutes,
    resetRoutes
  }
})
```

### 3.3 应用配置状态

```javascript
// stores/modules/app.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏
  const sidebarCollapsed = ref(false)
  const sidebarWithoutAnimation = ref(false)
  
  // 设备
  const device = ref('desktop')
  
  // 主题
  const theme = ref('light')
  const primaryColor = ref('#409EFF')
  
  // 布局
  const layout = ref('sidebar') // sidebar | top | mix
  const showTabs = ref(true)
  const fixedHeader = ref(true)
  const showBreadcrumb = ref(true)
  
  // 语言
  const language = ref('zh-CN')
  
  // getters
  const isMobile = computed(() => device.value === 'mobile')
  const isDark = computed(() => theme.value === 'dark')
  
  // actions
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    sidebarWithoutAnimation.value = false
  }
  
  function closeSidebar(withoutAnimation = false) {
    sidebarCollapsed.value = true
    sidebarWithoutAnimation.value = withoutAnimation
  }
  
  function openSidebar() {
    sidebarCollapsed.value = false
  }
  
  function setDevice(val) {
    device.value = val
  }
  
  function setTheme(val) {
    theme.value = val
    document.documentElement.setAttribute('data-theme', val)
  }
  
  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }
  
  function setPrimaryColor(color) {
    primaryColor.value = color
    document.documentElement.style.setProperty('--primary-color', color)
  }
  
  function setLayout(val) {
    layout.value = val
  }
  
  function setLanguage(lang) {
    language.value = lang
  }
  
  return {
    sidebarCollapsed,
    sidebarWithoutAnimation,
    device,
    theme,
    primaryColor,
    layout,
    showTabs,
    fixedHeader,
    showBreadcrumb,
    language,
    isMobile,
    isDark,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setDevice,
    setTheme,
    toggleTheme,
    setPrimaryColor,
    setLayout,
    setLanguage
  }
}, {
  persist: {
    paths: [
      'sidebarCollapsed',
      'theme',
      'primaryColor',
      'layout',
      'showTabs',
      'fixedHeader',
      'showBreadcrumb',
      'language'
    ]
  }
})
```

### 3.4 标签页状态

```javascript
// stores/modules/tagsView.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref([])
  const cachedViews = ref([])
  
  const visitedViewNames = computed(() => visitedViews.value.map(v => v.name))
  
  function addView(view) {
    addVisitedView(view)
    addCachedView(view)
  }
  
  function addVisitedView(view) {
    if (visitedViews.value.some(v => v.path === view.path)) return
    visitedViews.value.push({
      name: view.name,
      path: view.path,
      fullPath: view.fullPath,
      title: view.meta?.title || 'no-name',
      affix: view.meta?.affix,
      query: view.query
    })
  }
  
  function addCachedView(view) {
    if (cachedViews.value.includes(view.name)) return
    if (!view.meta?.noCache) {
      cachedViews.value.push(view.name)
    }
  }
  
  function delView(view) {
    return new Promise(resolve => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }
  
  function delVisitedView(view) {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }
  
  function delCachedView(view) {
    const index = cachedViews.value.indexOf(view.name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }
  
  function delOthersViews(view) {
    return new Promise(resolve => {
      visitedViews.value = visitedViews.value.filter(v => {
        return v.meta?.affix || v.path === view.path
      })
      cachedViews.value = cachedViews.value.filter(name => name === view.name)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }
  
  function delLeftViews(view) {
    return new Promise(resolve => {
      const index = visitedViews.value.findIndex(v => v.path === view.path)
      if (index > -1) {
        visitedViews.value = visitedViews.value.filter((v, i) => {
          return v.meta?.affix || i >= index
        })
      }
      resolve([...visitedViews.value])
    })
  }
  
  function delRightViews(view) {
    return new Promise(resolve => {
      const index = visitedViews.value.findIndex(v => v.path === view.path)
      if (index > -1) {
        visitedViews.value = visitedViews.value.filter((v, i) => {
          return v.meta?.affix || i <= index
        })
      }
      resolve([...visitedViews.value])
    })
  }
  
  function delAllViews() {
    return new Promise(resolve => {
      visitedViews.value = visitedViews.value.filter(v => v.meta?.affix)
      cachedViews.value = []
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }
  
  function updateVisitedView(view) {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value[index] = {
        ...visitedViews.value[index],
        ...view
      }
    }
  }
  
  return {
    visitedViews,
    cachedViews,
    visitedViewNames,
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delLeftViews,
    delRightViews,
    delAllViews,
    updateVisitedView
  }
})
```

---

## 四、路由管理实战

### 4.1 路由配置

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'

// 布局
const Layout = () => import('@/layouts/default/index.vue')

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error/401.vue'),
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
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

// 动态路由
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'setting', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'menu' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// 重置路由
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher
}

// 设置路由守卫
setupRouterGuards(router)

export default router
```

### 4.2 路由守卫

```javascript
// router/guards.js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

export function setupRouterGuards(router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    
    // 设置页面标题
    document.title = getPageTitle(to.meta?.title)
    
    const hasToken = getToken()
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasRoles = userStore.roles && userStore.roles.length > 0
        
        if (hasRoles) {
          next()
        } else {
          try {
            // 获取用户信息
            await userStore.getUserInfoAction()
            
            // 生成路由
            const accessRoutes = await permissionStore.generateRoutes()
            
            // 动态添加路由
            accessRoutes.forEach(route => {
              router.addRoute(route)
            })
            
            next({ ...to, replace: true })
          } catch (error) {
            // 清除token并跳转登录
            userStore.resetState()
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
}

function getPageTitle(pageTitle) {
  const title = import.meta.env.VITE_APP_TITLE || '管理系统'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return title
}
```

---

## 五、API层封装

### 5.1 Axios封装

```javascript
// api/request.js
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { getToken } from '@/utils/auth'
import router from '@/router'

// 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
    
    if (res.code !== 0 && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      
      // Token过期
      if (res.code === 401) {
        ElMessageBox.confirm(
          '登录状态已过期，请重新登录',
          '提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const userStore = useUserStore()
          userStore.resetState()
          router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
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
      const status = error.response.status
      const statusMessages = {
        400: '请求参数错误',
        401: '未授权，请登录',
        403: '拒绝访问',
        404: '请求地址不存在',
        408: '请求超时',
        500: '服务器内部错误',
        501: '服务未实现',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时'
      }
      message = statusMessages[status] || `连接错误${status}`
    } else if (error.message.includes('timeout')) {
      message = '请求超时'
    } else if (error.message.includes('Network')) {
      message = '网络异常'
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 封装方法
export function get(url, params, config = {}) {
  return service({ method: 'get', url, params, ...config })
}

export function post(url, data, config = {}) {
  return service({ method: 'post', url, data, ...config })
}

export function put(url, data, config = {}) {
  return service({ method: 'put', url, data, ...config })
}

export function del(url, params, config = {}) {
  return service({ method: 'delete', url, params, ...config })
}

export function upload(url, file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  return service({
    method: 'post',
    url,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  })
}

export function download(url, params, filename) {
  return service({
    method: 'get',
    url,
    params,
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  })
}

export default service
```

### 5.2 API模块

```javascript
// api/modules/user.js
import { get, post, put, del } from '../request'

export function login(data) {
  return post('/auth/login', data)
}

export function logout() {
  return post('/auth/logout')
}

export function getUserInfo() {
  return get('/user/info')
}

export function getUserList(params) {
  return get('/user/list', params)
}

export function getUserDetail(id) {
  return get(`/user/${id}`)
}

export function createUser(data) {
  return post('/user', data)
}

export function updateUser(id, data) {
  return put(`/user/${id}`, data)
}

export function deleteUser(id) {
  return del(`/user/${id}`)
}

export function batchDeleteUsers(ids) {
  return del('/user/batch', { ids })
}

export function resetPassword(id, password) {
  return put(`/user/${id}/password`, { password })
}

export function changeUserStatus(id, status) {
  return put(`/user/${id}/status`, { status })
}
```

---

## 六、权限系统设计

### 6.1 权限指令

```javascript
// directives/permission.js
import { useUserStore } from '@/stores/modules/user'

function checkPermission(el, binding) {
  const { value } = binding
  const userStore = useUserStore()
  
  if (value && Array.isArray(value) && value.length > 0) {
    const hasPermission = userStore.hasPermission(value)
    
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  } else {
    throw new Error('need permissions! Like v-permission="[\'admin\']"')
  }
}

export default {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  }
}
```

### 6.2 权限函数

```javascript
// utils/permission.js
import { useUserStore } from '@/stores/modules/user'

export function hasPermission(permission) {
  const userStore = useUserStore()
  return userStore.hasPermission(permission)
}

export function hasRole(role) {
  const userStore = useUserStore()
  return userStore.hasRole(role)
}

export function hasAnyPermission(permissions) {
  const userStore = useUserStore()
  return permissions.some(p => userStore.hasPermission(p))
}

export function hasAllPermissions(permissions) {
  const userStore = useUserStore()
  return permissions.every(p => userStore.hasPermission(p))
}
```

### 6.3 权限组件

```vue
<!-- components/Permission.vue -->
<script setup>
import { computed, useSlots } from 'vue'
import { useUserStore } from '@/stores/modules/user'

const props = defineProps({
  value: {
    type: [String, Array],
    required: true
  },
  mode: {
    type: String,
    default: 'any', // any | all
    validator: (v) => ['any', 'all'].includes(v)
  }
})

const slots = useSlots()
const userStore = useUserStore()

const hasPermission = computed(() => {
  const permissions = Array.isArray(props.value) ? props.value : [props.value]
  
  if (props.mode === 'all') {
    return permissions.every(p => userStore.hasPermission(p))
  }
  
  return permissions.some(p => userStore.hasPermission(p))
})
</script>

<template>
  <template v-if="hasPermission">
    <slot />
  </template>
  <template v-else-if="slots.fallback">
    <slot name="fallback" />
  </template>
</template>
```

使用示例：

```vue
<template>
  <!-- 单个权限 -->
  <Permission value="system:user:add">
    <el-button type="primary">新增用户</el-button>
  </Permission>
  
  <!-- 多个权限（满足其一） -->
  <Permission :value="['system:user:edit', 'system:user:delete']">
    <el-button>操作</el-button>
  </Permission>
  
  <!-- 多个权限（全部满足） -->
  <Permission :value="['system:user:edit', 'system:user:delete']" mode="all">
    <el-button>高级操作</el-button>
  </Permission>
  
  <!-- 带降级展示 -->
  <Permission value="system:user:add">
    <el-button type="primary">新增用户</el-button>
    <template #fallback>
      <el-button type="info" disabled>无权限</el-button>
    </template>
  </Permission>
</template>
```

---

## 七、性能优化实战

### 7.1 组件懒加载

```javascript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue')
  }
]

// 组件懒加载
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### 7.2 虚拟列表

```vue
<!-- components/VirtualList.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
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
  },
  bufferSize: {
    type: Number,
    default: 5
  }
})

const containerRef = ref(null)
const scrollTop = ref(0)

const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight)
  return Math.max(0, index - props.bufferSize)
})

const endIndex = computed(() => {
  const index = startIndex.value + props.visibleCount + props.bufferSize * 2
  return Math.min(props.items.length, index)
})

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    _index: startIndex.value + index
  }))
})

const totalHeight = computed(() => props.items.length * props.itemHeight)
const offsetY = computed(() => startIndex.value * props.itemHeight)

function handleScroll(e) {
  scrollTop.value = e.target.scrollTop
}
</script>

<template>
  <div
    ref="containerRef"
    class="virtual-list"
    :style="{ height: visibleCount * itemHeight + 'px' }"
    @scroll="handleScroll"
  >
    <div
      class="virtual-list__phantom"
      :style="{ height: totalHeight + 'px' }"
    />
    <div
      class="virtual-list__content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="item in visibleItems"
        :key="item._index"
        class="virtual-list__item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item._index" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-list {
  position: relative;
  overflow: auto;
}

.virtual-list__phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list__content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
</style>
```

### 7.3 图片懒加载

```javascript
// directives/lazyLoad.js
export default {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.src = binding.value
            observer.unobserve(el)
          }
        })
      },
      { rootMargin: '100px' }
    )
    observer.observe(el)
    el._observer = observer
  },
  
  unmounted(el) {
    el._observer?.disconnect()
  }
}
```

### 7.4 防抖节流Hook

```javascript
// composables/useDebounce.js
import { ref, watch } from 'vue'

export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  let timer = null
  
  watch(value, (newValue) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  
  return debouncedValue
}

export function useDebounceFn(fn, delay = 300) {
  let timer = null
  
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function useThrottleFn(fn, interval = 300) {
  let lastTime = 0
  
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
```

---

## 八、表单处理实战

### 8.1 动态表单组件

```vue
<!-- components/DynamicForm.vue -->
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  schema: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  labelWidth: {
    type: String,
    default: '100px'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const formData = ref({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => {
    formData.value = { ...val }
  },
  { deep: true }
)

watch(
  formData,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)

async function validate() {
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

function resetFields() {
  formRef.value.resetFields()
}

function clearValidate(props) {
  formRef.value.clearValidate(props)
}

async function submit() {
  const valid = await validate()
  if (valid) {
    emit('submit', formData.value)
  }
}

defineExpose({
  validate,
  resetFields,
  clearValidate,
  submit
})
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :label-width="labelWidth"
    :disabled="disabled"
  >
    <el-row :gutter="20">
      <template v-for="field in schema" :key="field.prop">
        <el-col :span="field.span || 24">
          <el-form-item
            :label="field.label"
            :prop="field.prop"
            :rules="field.rules"
          >
            <!-- 输入框 -->
            <el-input
              v-if="field.type === 'input'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            />
            
            <!-- 数字输入框 -->
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            />
            
            <!-- 选择框 -->
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            >
              <el-option
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            
            <!-- 单选框 -->
            <el-radio-group
              v-else-if="field.type === 'radio'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            >
              <el-radio
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.value"
              >
                {{ opt.label }}
              </el-radio>
            </el-radio-group>
            
            <!-- 多选框 -->
            <el-checkbox-group
              v-else-if="field.type === 'checkbox'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            >
              <el-checkbox
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.value"
              >
                {{ opt.label }}
              </el-checkbox>
            </el-checkbox-group>
            
            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="field.type === 'date'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            />
            
            <!-- 时间选择 -->
            <el-time-picker
              v-else-if="field.type === 'time'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            />
            
            <!-- 开关 -->
            <el-switch
              v-else-if="field.type === 'switch'"
              v-model="formData[field.prop]"
              v-bind="field.componentProps"
            />
            
            <!-- 文本域 -->
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.prop]"
              type="textarea"
              v-bind="field.componentProps"
            />
            
            <!-- 自定义插槽 -->
            <slot
              v-else-if="field.type === 'slot'"
              :name="field.slotName || field.prop"
              :field="field"
              :form-data="formData"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    
    <el-form-item v-if="$slots.footer">
      <slot name="footer" />
    </el-form-item>
  </el-form>
</template>
```

使用示例：

```vue
<script setup>
import { ref } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'

const formRef = ref(null)
const formData = ref({
  name: '',
  age: 18,
  gender: 'male',
  status: true
})

const schema = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
    span: 12,
    componentProps: {
      placeholder: '请输入姓名'
    },
    rules: [{ required: true, message: '请输入姓名' }]
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'number',
    span: 12,
    componentProps: {
      min: 1,
      max: 150
    }
  },
  {
    prop: 'gender',
    label: '性别',
    type: 'radio',
    span: 12,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  },
  {
    prop: 'status',
    label: '状态',
    type: 'switch',
    span: 12
  }
]

function handleSubmit(data) {
  console.log('Submit:', data)
}
</script>

<template>
  <DynamicForm
    ref="formRef"
    v-model="formData"
    :schema="schema"
    @submit="handleSubmit"
  >
    <template #footer>
      <el-button type="primary" @click="formRef.submit()">提交</el-button>
      <el-button @click="formRef.resetFields()">重置</el-button>
    </template>
  </DynamicForm>
</template>
```

---

## 九、表格组件封装

### 9.1 高级表格组件

```vue
<!-- components/ProTable.vue -->
<script setup>
import { ref, computed, useSlots, watch } from 'vue'
import { useTable } from '@/composables/useTable'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  api: {
    type: Function,
    required: true
  },
  defaultParams: {
    type: Object,
    default: () => ({})
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  selection: {
    type: Boolean,
    default: false
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  immediate: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  },
  stripe: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['selection-change', 'row-click'])
const slots = useSlots()
const tableRef = ref(null)

const {
  tableData,
  loading,
  pagination,
  queryParams,
  selectedRows,
  selectedKeys,
  fetchData,
  search,
  resetQuery,
  refresh,
  changePage,
  changePageSize,
  handleSortChange,
  handleSelectionChange,
  clearSelection
} = useTable(props.api, {
  defaultParams: props.defaultParams,
  immediate: props.immediate,
  rowKey: props.rowKey
})

// 显示的列
const visibleColumns = ref([])
const allColumnProps = computed(() => props.columns.map(c => c.prop).filter(Boolean))

watch(
  () => props.columns,
  () => {
    visibleColumns.value = [...allColumnProps.value]
  },
  { immediate: true }
)

const displayColumns = computed(() => {
  return props.columns.filter(col => {
    return !col.prop || visibleColumns.value.includes(col.prop)
  })
})

// 序号计算
function indexMethod(index) {
  return (pagination.value.page - 1) * pagination.value.pageSize + index + 1
}

// 选择变化
function onSelectionChange(selection) {
  handleSelectionChange(selection)
  emit('selection-change', selection)
}

// 行点击
function onRowClick(row, column, event) {
  emit('row-click', row, column, event)
}

// 暴露方法
defineExpose({
  tableData,
  loading,
  pagination,
  queryParams,
  selectedRows,
  selectedKeys,
  fetchData,
  search,
  resetQuery,
  refresh,
  clearSelection,
  getTableRef: () => tableRef.value
})
</script>

<template>
  <div class="pro-table">
    <!-- 工具栏 -->
    <div v-if="slots.toolbar || slots.toolbarRight" class="pro-table__toolbar">
      <div class="left">
        <slot name="toolbar" :selected-rows="selectedRows" :refresh="refresh" />
      </div>
      <div class="right">
        <slot name="toolbarRight" />
        <el-button circle @click="refresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
        <el-dropdown trigger="click">
          <el-button circle>
            <el-icon><Setting /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-checkbox-group v-model="visibleColumns">
                <el-dropdown-item
                  v-for="col in allColumnProps"
                  :key="col"
                >
                  <el-checkbox :label="col">
                    {{ columns.find(c => c.prop === col)?.label }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :row-key="rowKey"
      :border="border"
      :stripe="stripe"
      @selection-change="onSelectionChange"
      @sort-change="handleSortChange"
      @row-click="onRowClick"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        align="center"
        reserve-selection
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
      <template v-for="column in displayColumns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'center'"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template #default="scope">
            <!-- 自定义插槽 -->
            <slot
              v-if="slots[column.prop]"
              :name="column.prop"
              :row="scope.row"
              :column="column"
              :$index="scope.$index"
            />
            
            <!-- 自定义渲染 -->
            <component
              v-else-if="column.render"
              :is="column.render"
              :row="scope.row"
              :column="column"
              :index="scope.$index"
            />
            
            <!-- 格式化 -->
            <span v-else-if="column.formatter">
              {{ column.formatter(scope.row[column.prop], scope.row) }}
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
        v-if="slots.action"
        label="操作"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <slot name="action" :row="scope.row" :$index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      class="pro-table__pagination"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changePage"
    />
  </div>
</template>

<style scoped lang="scss">
.pro-table {
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
    justify-content: flex-end;
  }
}
</style>
```

---

## 十、弹窗组件封装

### 10.1 通用弹窗组件

```vue
<!-- components/ProDialog.vue -->
<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '50%'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  showClose: {
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
  confirmLoading: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  draggable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'open',
  'opened',
  'close',
  'closed',
  'confirm',
  'cancel'
])

const slots = useSlots()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const dialogWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  }
  return props.width
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  visible.value = false
}

function handleClose() {
  emit('close')
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="dialogWidth"
    :fullscreen="fullscreen"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :draggable="draggable"
    append-to-body
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="handleClose"
    @closed="$emit('closed')"
  >
    <template #header>
      <slot name="header">
        <span class="dialog-title">{{ title }}</span>
      </slot>
    </template>
    
    <div class="dialog-body">
      <slot />
    </div>
    
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
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

<style scoped lang="scss">
.dialog-title {
  font-size: 16px;
  font-weight: 600;
}

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
```

---

## 十一、布局系统设计

### 11.1 默认布局

```vue
<!-- layouts/default/index.vue -->
<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import AppSidebar from './components/Sidebar.vue'
import AppHeader from './components/Header.vue'
import AppTagsView from './components/TagsView.vue'
import AppMain from './components/Main.vue'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const showTabs = computed(() => appStore.showTabs)
const fixedHeader = computed(() => appStore.fixedHeader)
const cachedViews = computed(() => tagsViewStore.cachedViews)

const classObj = computed(() => ({
  'layout-collapsed': sidebarCollapsed.value,
  'layout-mobile': appStore.isMobile,
  'layout-fixed-header': fixedHeader.value
}))
</script>

<template>
  <div class="app-layout" :class="classObj">
    <AppSidebar class="app-layout__sidebar" />
    
    <div class="app-layout__main">
      <div class="app-layout__header" :class="{ 'is-fixed': fixedHeader }">
        <AppHeader />
        <AppTagsView v-if="showTabs" />
      </div>
      
      <AppMain :cached-views="cachedViews" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  min-height: 100vh;
  
  &__sidebar {
    width: var(--sidebar-width, 210px);
    transition: width 0.3s;
  }
  
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  
  &__header {
    &.is-fixed {
      position: sticky;
      top: 0;
      z-index: 100;
    }
  }
  
  &.layout-collapsed {
    .app-layout__sidebar {
      width: var(--sidebar-collapsed-width, 64px);
    }
  }
}
</style>
```

---

## 十二、主题与样式系统

### 12.1 CSS变量

```scss
// assets/styles/variables.scss
:root {
  // 主色
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  
  // 文本颜色
  --text-color-primary: #303133;
  --text-color-regular: #606266;
  --text-color-secondary: #909399;
  --text-color-placeholder: #C0C4CC;
  
  // 背景色
  --bg-color: #FFFFFF;
  --bg-color-page: #F2F3F5;
  --bg-color-overlay: #FFFFFF;
  
  // 边框
  --border-color: #DCDFE6;
  --border-color-light: #E4E7ED;
  
  // 布局
  --header-height: 50px;
  --sidebar-width: 210px;
  --sidebar-collapsed-width: 64px;
}

// 暗黑主题
[data-theme="dark"] {
  --text-color-primary: #E5EAF3;
  --text-color-regular: #CFD3DC;
  --text-color-secondary: #A3A6AD;
  
  --bg-color: #141414;
  --bg-color-page: #0A0A0A;
  --bg-color-overlay: #1D1E1F;
  
  --border-color: #4C4D4F;
  --border-color-light: #414243;
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
  
  // 如果使用Element Plus，还需要切换命名空间
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function toggleTheme() {
  const current = getTheme()
  const next = current === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}

export function initTheme() {
  setTheme(getTheme())
}
```

---

## 十三、错误处理与监控

### 13.1 全局错误处理

```javascript
// utils/errorHandler.js
import { ElMessage } from 'element-plus'

export function setupErrorHandler(app) {
  // Vue错误处理
  app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err)
    console.error('Component:', instance)
    console.error('Info:', info)
    reportError(err, { type: 'vue', info })
  }
  
  // Vue警告处理
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue Warning:', msg)
  }
  
  // 未捕获的Promise错误
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled Rejection:', event.reason)
    event.preventDefault()
    reportError(event.reason, { type: 'unhandledrejection' })
  })
  
  // 全局错误
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global Error:', { message, source, lineno, colno, error })
    reportError(error || new Error(message), { type: 'global', source, lineno, colno })
    return true
  }
}

// 上报错误
function reportError(error, context = {}) {
  if (import.meta.env.PROD) {
    // 上报到监控平台
    // sentry.captureException(error, { extra: context })
  }
}

// 显示错误提示
export function showError(message) {
  ElMessage.error(message || '操作失败')
}

// 错误边界组件
export const ErrorBoundary = {
  name: 'ErrorBoundary',
  props: {
    fallback: {
      type: [Object, Function],
      default: null
    }
  },
  data() {
    return {
      hasError: false,
      error: null
    }
  },
  errorCaptured(err, instance, info) {
    this.hasError = true
    this.error = err
    console.error('ErrorBoundary caught:', err, info)
    return false
  },
  render() {
    if (this.hasError) {
      if (typeof this.fallback === 'function') {
        return this.fallback({ error: this.error })
      }
      return this.fallback || h('div', '出错了')
    }
    return this.$slots.default?.()
  }
}
```

---

## 十四、单元测试实践

### 14.1 Vitest配置

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### 14.2 组件测试

```javascript
// tests/components/ProTable.spec.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProTable from '@/components/ProTable.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('ProTable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('renders correctly', async () => {
    const columns = [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄' }
    ]
    
    const mockApi = vi.fn().mockResolvedValue({
      list: [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '李四', age: 30 }
      ],
      total: 2
    })
    
    const wrapper = mount(ProTable, {
      props: {
        columns,
        api: mockApi
      }
    })
    
    await vi.waitFor(() => {
      expect(mockApi).toHaveBeenCalled()
    })
    
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('年龄')
  })
})
```

---

## 十五、工程化配置

### 15.1 Vite配置

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isBuild = command === 'build'
  
  return {
    base: env.VITE_APP_PUBLIC_PATH || '/',
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`
        }
      }
    },
    
    plugins: [
      vue(),
      
      // 自动导入
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts'
      }),
      
      // 组件自动注册
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts'
      }),
      
      // SVG图标
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      
      // 打包分析
      isBuild && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true
      }),
      
      // gzip压缩
      isBuild && compression({
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            elementPlus: ['element-plus'],
            echarts: ['echarts']
          }
        }
      }
    },
    
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios', 'element-plus']
    }
  }
})
```

---

以上是Vue3大厂项目实战指南，涵盖了企业级项目开发中的核心技术和最佳实践。
