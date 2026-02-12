# 大厂企业级项目 Gitee 最佳实践



<div class="doc-toc">

## 目录

1. [企业级项目概述](#1-企业级项目概述)
2. [企业级 Git 工作流](#2-企业级-git-工作流)
3. [Vue2 企业级项目实践](#3-vue2-企业级项目实践)
4. [Vue3 企业级项目实践](#4-vue3-企业级项目实践)
5. [Vue3 + TypeScript 企业级项目实践](#5-vue3--typescript-企业级项目实践)
6. [企业级 CI/CD 流水线](#6-企业级-cicd-流水线)
7. [代码审查与质量保障](#7-代码审查与质量保障)
8. [多团队协作规范](#8-多团队协作规范)
9. [安全与权限管理](#9-安全与权限管理)
10. [监控与告警](#10-监控与告警)



</div>


---

## 1. 企业级项目概述

### 1.1 大厂前端项目特点

| 特点 | 说明 | Gitee 解决方案 |
|------|------|---------------|
| 多团队协作 | 前端、后端、测试、运维 | 组织管理、团队权限 |
| 代码规模大 | 数十万行代码 | 分支策略、代码审查 |
| 发布频繁 | 每周多次发布 | CI/CD、自动化部署 |
| 质量要求高 | 代码质量、测试覆盖 | 代码检查、流水线 |
| 安全性要求 | 代码安全、权限控制 | 分支保护、审计日志 |

### 1.2 企业级项目结构

```
enterprise-frontend/
├── .gitee/                    # Gitee 配置
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows/
├── .husky/                    # Git Hooks
│   ├── pre-commit
│   ├── commit-msg
│   └── pre-push
├── packages/                  # Monorepo 子包
│   ├── shared/               # 共享代码
│   ├── components/           # 组件库
│   ├── utils/                # 工具库
│   └── web/                  # 主应用
├── scripts/                   # 脚本
│   ├── build.sh
│   ├── deploy.sh
│   └── release.sh
├── docs/                      # 文档
├── tests/                     # 测试
├── .env.example              # 环境变量模板
├── .eslintrc.js              # ESLint 配置
├── .prettierrc               # Prettier 配置
├── .gitignore                # Git 忽略
├── .gitee-ci.yml             # CI/CD 配置
├── commitlint.config.js      # 提交规范
├── package.json
└── README.md
```

---

## 2. 企业级 Git 工作流

### 2.1 Git Flow 工作流（大厂标准）

```
                    ┌─────────────────────────────────────────┐
                    │                  main                    │
                    │  (生产环境，只接受合并，不直接提交)        │
                    └───────────────────┬─────────────────────┘
                                        │
                    ┌───────────────────▼─────────────────────┐
                    │                release/*                 │
                    │  (发布分支，版本测试与修复)               │
                    └───────────────────┬─────────────────────┘
                                        │
                    ┌───────────────────▼─────────────────────┐
                    │                develop                   │
                    │  (开发主分支，功能集成测试)               │
                    └───────────────────┬─────────────────────┘
                                        │
    ┌───────────────────────────────────┼───────────────────────────────────┐
    │                                   │                                   │
┌───▼───────────────┐   ┌───────────────▼───────────────┐   ┌───────────────▼───┐
│   feature/xxx     │   │      feature/yyy              │   │   hotfix/zzz      │
│  (功能开发分支)    │   │      (功能开发分支)            │   │  (紧急修复分支)    │
└───────────────────┘   └───────────────────────────────┘   └───────────────────┘
```

### 2.2 企业级分支命名规范

```bash
# 功能分支（从 develop 创建）
feature/JIRA-1234-user-login          # 带工单号
feature/sprint-23/payment-module      # 带迭代号
feature/team-a/order-management       # 带团队标识

# 修复分支
fix/JIRA-5678-login-validation-error  # Bug 修复
hotfix/v1.2.1-security-patch          # 紧急安全修复

# 发布分支
release/v1.2.0                        # 版本发布
release/2024-01-sprint-23             # 迭代发布

# 其他
refactor/user-service-optimization    # 重构
docs/api-documentation-update         # 文档
chore/upgrade-dependencies            # 依赖更新
```

### 2.3 分支保护规则配置

```yaml
# 分支保护配置（在 Gitee 仓库设置中配置）

main:
  # 保护规则
  - 禁止直接推送
  - 必须通过 Pull Request
  - 需要 2 人以上审核
  - 必须通过 CI 检查
  - 不允许 force push
  - 代码扫描必须通过

develop:
  # 保护规则
  - 禁止直接推送
  - 必须通过 Pull Request
  - 需要 1 人以上审核
  - 必须通过 CI 检查

release/*:
  # 保护规则
  - 只允许从 develop 创建
  - 只能合并到 main
  - 必须标记版本号
```

### 2.4 企业级提交规范

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型必须是以下之一
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // Bug 修复
        'docs',     // 文档更新
        'style',    // 代码格式（不影响功能）
        'refactor', // 代码重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建相关
        'ci',       // CI 配置
        'chore',    // 其他修改
        'revert',   // 回滚
        'wip'       // 开发中
      ]
    ],
    // scope 可选但推荐
    'scope-enum': [
      1,
      'always',
      [
        'core',       // 核心模块
        'auth',       // 认证模块
        'user',       // 用户模块
        'order',      // 订单模块
        'payment',    // 支付模块
        'common',     // 公共模块
        'config',     // 配置
        'deps',       // 依赖
        'release'     // 发布
      ]
    ],
    // 主题长度限制
    'subject-max-length': [2, 'always', 100],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // Body 换行长度
    'body-max-line-length': [2, 'always', 200]
  }
}
```

**提交消息格式**：

```
<type>(<scope>): <subject>

<body>

<footer>

# 示例
feat(user): 添加用户登录功能

- 支持手机号登录
- 支持邮箱登录
- 添加验证码功能

关联 JIRA-1234
```

---

## 3. Vue2 企业级项目实践

### 3.1 企业级 Vue2 项目结构

```
vue2-enterprise/
├── src/
│   ├── api/                  # API 接口
│   │   ├── modules/
│   │   │   ├── user.js
│   │   │   ├── order.js
│   │   │   └── product.js
│   │   ├── request.js        # 请求封装
│   │   └── index.js
│   ├── assets/               # 静态资源
│   ├── components/           # 公共组件
│   │   ├── common/
│   │   └── business/
│   ├── directives/           # 自定义指令
│   ├── filters/              # 过滤器
│   ├── layouts/              # 布局组件
│   ├── mixins/               # 混入
│   ├── plugins/              # 插件
│   ├── router/               # 路由
│   │   ├── modules/
│   │   └── index.js
│   ├── store/                # Vuex 状态管理
│   │   ├── modules/
│   │   └── index.js
│   ├── styles/               # 样式
│   ├── utils/                # 工具函数
│   ├── views/                # 页面组件
│   ├── App.vue
│   └── main.js
├── public/
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.development
├── .env.staging
├── .env.production
├── vue.config.js
└── package.json
```

### 3.2 Vue2 企业级权限控制

```javascript
// src/permission.js - 路由权限控制
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'

const whiteList = ['/login', '/register', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
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
          // 获取用户信息和权限
          const { roles } = await store.dispatch('user/getInfo')
          
          // 根据角色生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          
          // 动态添加路由
          router.addRoutes(accessRoutes)
          
          next({ ...to, replace: true })
        } catch (error) {
          // 清除 token 并重新登录
          await store.dispatch('user/resetToken')
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
```

```javascript
// src/store/modules/permission.js
import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  }
  return true
}

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
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

### 3.3 Vue2 企业级请求封装

```javascript
// src/api/request.js
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加 token
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    
    // 添加请求 ID（用于日志追踪）
    config.headers['X-Request-Id'] = generateRequestId()
    
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
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 业务状态码判断
    if (res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      })
      
      // Token 过期处理
      if (res.code === 401 || res.code === 403) {
        MessageBox.confirm(
          '登录状态已过期，请重新登录',
          '确认登出',
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
      
      return Promise.reject(new Error(res.message || 'Error'))
    }
    
    return res
  },
  error => {
    console.error('Response error:', error)
    
    // HTTP 状态码处理
    const status = error.response?.status
    const messages = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    }
    
    Message({
      message: messages[status] || error.message || '网络异常',
      type: 'error',
      duration: 5000
    })
    
    return Promise.reject(error)
  }
)

function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export default service
```

### 3.4 Vue2 企业级 CI/CD 配置

```yaml
# .gitee-ci.yml
version: 1.0
name: vue2-enterprise-pipeline

# 全局变量
variables:
  NODE_VERSION: "16"
  NPM_REGISTRY: "https://registry.npmmirror.com"
  DEPLOY_USER: "deployer"

# 触发条件
triggers:
  push:
    branches:
      - main
      - develop
      - release/*
  pull_request:
    branches:
      - main
      - develop
  tag:
    - v*

# 缓存配置
cache:
  key: vue2-enterprise-deps
  paths:
    - node_modules/
    - ~/.npm

stages:
  # 依赖安装
  - name: install
    image: node:16-alpine
    script:
      - npm config set registry $NPM_REGISTRY
      - npm ci --prefer-offline
    
  # 代码检查
  - name: lint
    script:
      - npm run lint
      - npm run stylelint
    depends_on:
      - install

  # 单元测试
  - name: unit-test
    script:
      - npm run test:unit -- --coverage
    depends_on:
      - install
    artifacts:
      paths:
        - coverage/
      reports:
        junit: coverage/junit.xml

  # 构建测试环境
  - name: build-staging
    script:
      - npm run build:staging
    depends_on:
      - lint
      - unit-test
    artifacts:
      paths:
        - dist/
    only:
      - develop

  # 构建生产环境
  - name: build-production
    script:
      - npm run build:production
    depends_on:
      - lint
      - unit-test
    artifacts:
      paths:
        - dist/
    only:
      - main
      - release/*

  # 部署测试环境
  - name: deploy-staging
    script:
      - echo "Deploying to staging..."
      - scp -r dist/* $DEPLOY_USER@staging.example.com:/var/www/staging/
      - ssh $DEPLOY_USER@staging.example.com "cd /var/www/staging && ./restart.sh"
    depends_on:
      - build-staging
    only:
      - develop
    environment:
      name: staging
      url: https://staging.example.com

  # 部署生产环境（手动触发）
  - name: deploy-production
    script:
      - echo "Deploying to production..."
      - scp -r dist/* $DEPLOY_USER@prod.example.com:/var/www/production/
      - ssh $DEPLOY_USER@prod.example.com "cd /var/www/production && ./restart.sh"
    depends_on:
      - build-production
    only:
      - main
    when: manual
    environment:
      name: production
      url: https://example.com

  # 发布通知
  - name: notify
    script:
      - |
        curl -X POST "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=$WECHAT_BOT_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "msgtype": "markdown",
            "markdown": {
              "content": "## 部署通知\n> 项目: vue2-enterprise\n> 分支: '"$CI_COMMIT_BRANCH"'\n> 状态: 成功\n> 时间: '"$(date)"'"
            }
          }'
    depends_on:
      - deploy-staging
      - deploy-production
    when: on_success
```

### 3.5 Vue2 企业级 Git Hooks

```bash
#!/bin/sh
# .husky/pre-commit

. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. 检查分支名称
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
valid_branch_regex="^(feature|fix|hotfix|release|refactor|docs|chore)\/[a-z0-9._-]+$|^(main|develop)$"

if ! echo "$current_branch" | grep -Eq "$valid_branch_regex"; then
  echo "❌ 分支名称不符合规范: $current_branch"
  echo "请使用: feature/xxx, fix/xxx, hotfix/xxx, release/xxx"
  exit 1
fi

# 2. 运行 lint-staged
npx lint-staged

# 3. 检查是否有 console.log（生产代码）
if git diff --cached --name-only | grep -E '\.(js|vue)$' | xargs grep -l 'console.log' 2>/dev/null; then
  echo "⚠️ 警告: 发现 console.log，请确认是否需要删除"
fi

echo "✅ Pre-commit checks passed!"
```

```bash
#!/bin/sh
# .husky/commit-msg

. "$(dirname "$0")/_/husky.sh"

echo "📝 Validating commit message..."

npx --no-install commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

```bash
#!/bin/sh
# .husky/pre-push

. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# 运行单元测试
npm run test:unit

# 检查构建
npm run build

echo "✅ Pre-push checks passed!"
```

---

## 4. Vue3 企业级项目实践

### 4.1 企业级 Vue3 项目结构

```
vue3-enterprise/
├── src/
│   ├── api/                  # API 接口
│   │   ├── modules/
│   │   ├── types/
│   │   └── index.ts
│   ├── assets/               # 静态资源
│   ├── components/           # 公共组件
│   │   ├── common/
│   │   ├── business/
│   │   └── index.ts
│   ├── composables/          # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   └── index.ts
│   ├── directives/           # 自定义指令
│   ├── hooks/                # 自定义 Hooks
│   ├── layouts/              # 布局组件
│   ├── plugins/              # 插件
│   ├── router/               # 路由
│   │   ├── modules/
│   │   ├── guards.ts
│   │   └── index.ts
│   ├── stores/               # Pinia 状态管理
│   │   ├── modules/
│   │   └── index.ts
│   ├── styles/               # 样式
│   ├── utils/                # 工具函数
│   ├── views/                # 页面组件
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
└── package.json
```

### 4.2 Vue3 Composition API 企业级实践

```typescript
// src/composables/useAuth.ts
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { login as loginApi, logout as logoutApi, getUserInfo } from '@/api/modules/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import type { LoginParams, UserInfo } from '@/api/types/user'

export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const isLoggedIn = computed(() => !!userStore.token)
  const currentUser = computed(() => userStore.userInfo)
  const roles = computed(() => userStore.roles)
  
  // 登录
  async function login(params: LoginParams): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await loginApi(params)
      
      // 保存 token
      setToken(data.token)
      userStore.setToken(data.token)
      
      // 获取用户信息
      await fetchUserInfo()
      
      // 生成动态路由
      await generateRoutes()
      
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }
  
  // 登出
  async function logout(): Promise<void> {
    try {
      await logoutApi()
    } finally {
      // 清除本地状态
      removeToken()
      userStore.resetState()
      permissionStore.resetState()
      
      // 跳转登录页
      router.push('/login')
    }
  }
  
  // 获取用户信息
  async function fetchUserInfo(): Promise<UserInfo | null> {
    try {
      const { data } = await getUserInfo()
      userStore.setUserInfo(data)
      return data
    } catch (e) {
      error.value = (e as Error).message
      return null
    }
  }
  
  // 生成动态路由
  async function generateRoutes(): Promise<void> {
    const routes = await permissionStore.generateRoutes(roles.value)
    routes.forEach(route => {
      router.addRoute(route)
    })
  }
  
  // 检查权限
  function hasPermission(permission: string | string[]): boolean {
    const permissions = Array.isArray(permission) ? permission : [permission]
    return permissions.some(p => userStore.permissions.includes(p))
  }
  
  // 检查角色
  function hasRole(role: string | string[]): boolean {
    const roleList = Array.isArray(role) ? role : [role]
    return roleList.some(r => roles.value.includes(r))
  }
  
  return {
    loading,
    error,
    isLoggedIn,
    currentUser,
    roles,
    login,
    logout,
    fetchUserInfo,
    hasPermission,
    hasRole
  }
}
```

```typescript
// src/composables/useRequest.ts
import { ref, shallowRef, unref, watch } from 'vue'
import type { Ref, UnwrapRef } from 'vue'

interface UseRequestOptions<T> {
  immediate?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

interface UseRequestReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: (...args: any[]) => Promise<T | null>
  mutate: (newData: T) => void
  refresh: () => Promise<T | null>
}

export function useRequest<T = any>(
  requestFn: (...args: any[]) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T> {
  const {
    immediate = false,
    initialData = null,
    onSuccess,
    onError,
    onFinally
  } = options
  
  const data = shallowRef<T | null>(initialData as T)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  let lastArgs: any[] = []
  
  async function execute(...args: any[]): Promise<T | null> {
    lastArgs = args
    loading.value = true
    error.value = null
    
    try {
      const result = await requestFn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e as Error
      error.value = err
      onError?.(err)
      return null
    } finally {
      loading.value = false
      onFinally?.()
    }
  }
  
  function mutate(newData: T): void {
    data.value = newData
  }
  
  function refresh(): Promise<T | null> {
    return execute(...lastArgs)
  }
  
  if (immediate) {
    execute()
  }
  
  return {
    data,
    loading,
    error,
    execute,
    mutate,
    refresh
  }
}
```

### 4.3 Vue3 Pinia 企业级状态管理

```typescript
// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/api/types/user'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  
  // Getters
  const isAdmin = computed(() => roles.value.includes('admin'))
  const nickname = computed(() => userInfo.value?.nickname || '游客')
  const avatar = computed(() => userInfo.value?.avatar || '/default-avatar.png')
  
  // Actions
  function setToken(newToken: string) {
    token.value = newToken
  }
  
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    roles.value = info.roles || []
    permissions.value = info.permissions || []
  }
  
  function resetState() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
  }
  
  return {
    // State
    token,
    userInfo,
    roles,
    permissions,
    // Getters
    isAdmin,
    nickname,
    avatar,
    // Actions
    setToken,
    setUserInfo,
    resetState
  }
}, {
  // 持久化配置
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token']
  }
})
```

```typescript
// src/stores/modules/permission.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { asyncRoutes, constantRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta?.roles) {
    return roles.some(role => (route.meta?.roles as string[]).includes(role))
  }
  return true
}

function filterAsyncRoutes(
  routes: RouteRecordRaw[], 
  roles: string[]
): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []
  
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

export const usePermissionStore = defineStore('permission', () => {
  // State
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])
  const cachedViews = ref<string[]>([])
  
  // Getters
  const menuRoutes = computed(() => 
    routes.value.filter(route => !route.meta?.hidden)
  )
  
  // Actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    addRoutes.value = newRoutes
    routes.value = constantRoutes.concat(newRoutes)
  }
  
  async function generateRoutes(roles: string[]): Promise<RouteRecordRaw[]> {
    let accessedRoutes: RouteRecordRaw[]
    
    if (roles.includes('admin')) {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    }
    
    setRoutes(accessedRoutes)
    return accessedRoutes
  }
  
  function addCachedView(name: string) {
    if (!cachedViews.value.includes(name)) {
      cachedViews.value.push(name)
    }
  }
  
  function removeCachedView(name: string) {
    const index = cachedViews.value.indexOf(name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }
  
  function resetState() {
    routes.value = []
    addRoutes.value = []
    cachedViews.value = []
  }
  
  return {
    routes,
    addRoutes,
    cachedViews,
    menuRoutes,
    setRoutes,
    generateRoutes,
    addCachedView,
    removeCachedView,
    resetState
  }
})
```

### 4.4 Vue3 路由守卫企业级实践

```typescript
// src/router/guards.ts
import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { getToken } from '@/utils/auth'

// 白名单路由
const whiteList = ['/login', '/register', '/404', '/403']

export function setupRouterGuards(router: Router) {
  // 前置守卫
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const hasToken = getToken()
    
    // 设置页面标题
    document.title = `${to.meta.title || ''} - 企业管理系统`
    
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
        return
      }
      
      // 判断是否有用户信息
      if (userStore.roles.length > 0) {
        // 检查路由权限
        if (to.meta.roles) {
          const hasRole = userStore.roles.some(role => 
            (to.meta.roles as string[]).includes(role)
          )
          if (!hasRole) {
            next('/403')
            NProgress.done()
            return
          }
        }
        next()
      } else {
        try {
          // 获取用户信息
          const { roles } = await userStore.fetchUserInfo()
          
          // 生成动态路由
          const accessRoutes = await permissionStore.generateRoutes(roles)
          
          // 添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          
          // 重定向到目标路由
          next({ ...to, replace: true })
        } catch (error) {
          // 清除状态并重定向到登录页
          userStore.resetState()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
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
  
  // 后置守卫
  router.afterEach((to, from) => {
    NProgress.done()
    
    // 滚动到顶部
    window.scrollTo(0, 0)
    
    // 记录页面访问日志
    logPageView(to.path, from.path)
  })
  
  // 错误处理
  router.onError((error) => {
    console.error('Router error:', error)
    NProgress.done()
  })
}

function logPageView(to: string, from: string) {
  // 发送页面访问日志
  if (process.env.NODE_ENV === 'production') {
    // analytics.track('page_view', { to, from })
  }
}
```

---

## 5. Vue3 + TypeScript 企业级项目实践

### 5.1 完整类型定义体系

```typescript
// src/types/api.ts
// API 响应基础类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应数据
export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 列表响应
export type ListResponse<T> = ApiResponse<PaginationData<T>>
```

```typescript
// src/types/user.ts
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
  department: Department
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: number
  name: string
  parentId: number | null
}

export interface LoginParams {
  username: string
  password: string
  captcha?: string
  captchaKey?: string
}

export interface LoginResult {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface UserQueryParams extends PaginationParams {
  keyword?: string
  roleId?: number
  departmentId?: number
  status?: 0 | 1
}
```

```typescript
// src/types/router.ts
import type { RouteRecordRaw } from 'vue-router'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: AppRouteMeta
  children?: AppRouteRecordRaw[]
}

export interface AppRouteMeta {
  title?: string
  icon?: string
  roles?: string[]
  permissions?: string[]
  hidden?: boolean
  keepAlive?: boolean
  affix?: boolean
  breadcrumb?: boolean
  activeMenu?: string
}
```

### 5.2 TypeScript API 层封装

```typescript
// src/api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { getToken, removeToken } from '@/utils/auth'
import type { ApiResponse } from '@/types/api'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 请求追踪 ID
    config.headers['X-Request-Id'] = generateRequestId()
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data
    
    // 业务成功
    if (code === 200) {
      return response.data
    }
    
    // Token 过期
    if (code === 401) {
      handleUnauthorized()
      return Promise.reject(new Error(message || '登录已过期'))
    }
    
    // 无权限
    if (code === 403) {
      ElMessage.error('没有操作权限')
      return Promise.reject(new Error(message || '没有操作权限'))
    }
    
    // 其他业务错误
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    // 网络错误处理
    if (error.response) {
      const { status } = error.response
      const errorMessages: Record<number, string> = {
        400: '请求参数错误',
        401: '未授权，请重新登录',
        403: '拒绝访问',
        404: '请求的资源不存在',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时'
      }
      ElMessage.error(errorMessages[status] || '网络异常')
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else {
      ElMessage.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

// 处理未授权
function handleUnauthorized(): void {
  ElMessageBox.confirm(
    '登录状态已过期，请重新登录',
    '系统提示',
    {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const userStore = useUserStore()
    userStore.resetState()
    removeToken()
    window.location.href = '/login'
  })
}

// 生成请求 ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 导出请求方法
export function get<T = any>(
  url: string, 
  params?: any, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service.get(url, { params, ...config })
}

export function post<T = any>(
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service.post(url, data, config)
}

export function put<T = any>(
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service.put(url, data, config)
}

export function del<T = any>(
  url: string, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service.delete(url, config)
}

export default service
```

```typescript
// src/api/modules/user.ts
import { get, post, put, del } from '../request'
import type { ApiResponse, ListResponse } from '@/types/api'
import type { 
  UserInfo, 
  LoginParams, 
  LoginResult, 
  UserQueryParams 
} from '@/types/user'

const PREFIX = '/api/user'

// 用户登录
export function login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
  return post<LoginResult>(`${PREFIX}/login`, params)
}

// 用户登出
export function logout(): Promise<ApiResponse<void>> {
  return post<void>(`${PREFIX}/logout`)
}

// 获取当前用户信息
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return get<UserInfo>(`${PREFIX}/info`)
}

// 获取用户列表
export function getUserList(
  params: UserQueryParams
): Promise<ListResponse<UserInfo>> {
  return get<any>(`${PREFIX}/list`, params)
}

// 创建用户
export function createUser(
  data: Partial<UserInfo>
): Promise<ApiResponse<UserInfo>> {
  return post<UserInfo>(`${PREFIX}/create`, data)
}

// 更新用户
export function updateUser(
  id: number, 
  data: Partial<UserInfo>
): Promise<ApiResponse<UserInfo>> {
  return put<UserInfo>(`${PREFIX}/${id}`, data)
}

// 删除用户
export function deleteUser(id: number): Promise<ApiResponse<void>> {
  return del<void>(`${PREFIX}/${id}`)
}

// 重置密码
export function resetPassword(
  id: number, 
  newPassword: string
): Promise<ApiResponse<void>> {
  return post<void>(`${PREFIX}/${id}/reset-password`, { newPassword })
}

// 修改密码
export function changePassword(
  oldPassword: string, 
  newPassword: string
): Promise<ApiResponse<void>> {
  return post<void>(`${PREFIX}/change-password`, { oldPassword, newPassword })
}
```

### 5.3 TypeScript 组件最佳实践

```vue
<!-- src/components/business/UserTable.vue -->
<template>
  <div class="user-table">
    <!-- 搜索栏 -->
    <el-form 
      :model="searchForm" 
      inline 
      class="search-form"
    >
      <el-form-item label="关键词">
        <el-input 
          v-model="searchForm.keyword" 
          placeholder="用户名/昵称/邮箱"
          clearable
        />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="searchForm.roleId" clearable placeholder="请选择">
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" clearable placeholder="请选择">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button 
        v-permission="'user:create'" 
        type="primary" 
        @click="handleCreate"
      >
        新增用户
      </el-button>
      <el-button 
        v-permission="'user:export'" 
        @click="handleExport"
      >
        导出
      </el-button>
    </div>
    
    <!-- 表格 -->
    <el-table 
      v-loading="loading"
      :data="userList"
      border
      stripe
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="角色" width="150">
        <template #default="{ row }">
          <el-tag 
            v-for="role in row.roles" 
            :key="role" 
            size="small"
            class="role-tag"
          >
            {{ role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            v-permission="'user:edit'" 
            type="primary" 
            link 
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button 
            v-permission="'user:reset-password'" 
            type="warning" 
            link 
            @click="handleResetPassword(row)"
          >
            重置密码
          </el-button>
          <el-button 
            v-permission="'user:delete'" 
            type="danger" 
            link 
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
    
    <!-- 编辑弹窗 -->
    <UserFormDialog
      v-model:visible="dialogVisible"
      :user="currentUser"
      :roles="roles"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser, updateUser } from '@/api/modules/user'
import { getRoleList } from '@/api/modules/role'
import UserFormDialog from './UserFormDialog.vue'
import { formatDate } from '@/utils/date'
import type { UserInfo, UserQueryParams } from '@/types/user'
import type { Role } from '@/types/role'

// Props
interface Props {
  departmentId?: number
}

const props = withDefaults(defineProps<Props>(), {
  departmentId: undefined
})

// Emits
const emit = defineEmits<{
  (e: 'user-selected', user: UserInfo): void
}>()

// 状态
const loading = ref(false)
const userList = ref<UserInfo[]>([])
const roles = ref<Role[]>([])
const dialogVisible = ref(false)
const currentUser = ref<UserInfo | null>(null)

// 搜索表单
const searchForm = reactive<Partial<UserQueryParams>>({
  keyword: '',
  roleId: undefined,
  status: undefined
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 获取用户列表
async function fetchUserList(): Promise<void> {
  loading.value = true
  try {
    const params: UserQueryParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
      departmentId: props.departmentId
    }
    
    const { data } = await getUserList(params)
    userList.value = data.list
    pagination.total = data.total
  } catch (error) {
    console.error('Failed to fetch user list:', error)
  } finally {
    loading.value = false
  }
}

// 获取角色列表
async function fetchRoleList(): Promise<void> {
  try {
    const { data } = await getRoleList()
    roles.value = data
  } catch (error) {
    console.error('Failed to fetch role list:', error)
  }
}

// 搜索
function handleSearch(): void {
  pagination.page = 1
  fetchUserList()
}

// 重置
function handleReset(): void {
  searchForm.keyword = ''
  searchForm.roleId = undefined
  searchForm.status = undefined
  handleSearch()
}

// 新增
function handleCreate(): void {
  currentUser.value = null
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: UserInfo): void {
  currentUser.value = { ...row }
  dialogVisible.value = true
}

// 删除
async function handleDelete(row: UserInfo): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.nickname}" 吗？`,
      '删除确认',
      { type: 'warning' }
    )
    
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error) {
    // 用户取消
  }
}

// 重置密码
async function handleResetPassword(row: UserInfo): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户 "${row.nickname}" 的密码吗？`,
      '重置密码',
      { type: 'warning' }
    )
    
    // 调用重置密码接口
    // await resetPassword(row.id, 'default123')
    ElMessage.success('密码已重置为默认密码')
  } catch (error) {
    // 用户取消
  }
}

// 状态变更
async function handleStatusChange(row: UserInfo): Promise<void> {
  try {
    await updateUser(row.id, { status: row.status })
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 恢复状态
    row.status = row.status === 1 ? 0 : 1
  }
}

// 导出
function handleExport(): void {
  ElMessage.info('导出功能开发中...')
}

// 表单成功
function handleFormSuccess(): void {
  dialogVisible.value = false
  fetchUserList()
}

// 分页变更
function handleSizeChange(size: number): void {
  pagination.pageSize = size
  fetchUserList()
}

function handlePageChange(page: number): void {
  pagination.page = page
  fetchUserList()
}

// 生命周期
onMounted(() => {
  fetchUserList()
  fetchRoleList()
})

// 暴露方法
defineExpose({
  refresh: fetchUserList
})
</script>

<style scoped lang="scss">
.user-table {
  .search-form {
    margin-bottom: 16px;
  }
  
  .toolbar {
    margin-bottom: 16px;
  }
  
  .role-tag {
    margin-right: 4px;
    
    &:last-child {
      margin-right: 0;
    }
  }
  
  .el-pagination {
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style>
```

### 5.4 TypeScript 自定义指令

```typescript
// src/directives/permission.ts
import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'

// 权限指令
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const { value } = binding
    
    if (value) {
      const permissions = Array.isArray(value) ? value : [value]
      const hasPermission = permissions.some(permission => 
        userStore.permissions.includes(permission)
      )
      
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}

// 角色指令
export const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const { value } = binding
    
    if (value) {
      const roles = Array.isArray(value) ? value : [value]
      const hasRole = roles.some(role => userStore.roles.includes(role))
      
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}

// 注册指令
export function setupDirectives(app: App): void {
  app.directive('permission', permissionDirective)
  app.directive('role', roleDirective)
}
```

```typescript
// src/directives/loading.ts
import type { Directive, DirectiveBinding } from 'vue'

interface LoadingElement extends HTMLElement {
  __loadingInstance?: HTMLElement
}

export const loadingDirective: Directive = {
  mounted(el: LoadingElement, binding: DirectiveBinding<boolean>) {
    if (binding.value) {
      showLoading(el)
    }
  },
  
  updated(el: LoadingElement, binding: DirectiveBinding<boolean>) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        showLoading(el)
      } else {
        hideLoading(el)
      }
    }
  },
  
  unmounted(el: LoadingElement) {
    hideLoading(el)
  }
}

function showLoading(el: LoadingElement): void {
  const loading = document.createElement('div')
  loading.className = 'custom-loading-mask'
  loading.innerHTML = `
    <div class="custom-loading-spinner">
      <svg viewBox="0 0 50 50" class="circular">
        <circle cx="25" cy="25" r="20" fill="none" class="path"></circle>
      </svg>
    </div>
  `
  
  el.style.position = 'relative'
  el.appendChild(loading)
  el.__loadingInstance = loading
}

function hideLoading(el: LoadingElement): void {
  if (el.__loadingInstance) {
    el.removeChild(el.__loadingInstance)
    el.__loadingInstance = undefined
  }
}
```

---

## 6. 企业级 CI/CD 流水线

### 6.1 多环境完整流水线配置

```yaml
# .gitee-ci.yml
version: 1.0
name: enterprise-frontend-pipeline

# 全局变量
variables:
  NODE_VERSION: "18"
  PNPM_VERSION: "8"
  NPM_REGISTRY: "https://registry.npmmirror.com"
  DOCKER_REGISTRY: "registry.example.com"
  
# 触发条件
triggers:
  push:
    branches:
      - main
      - develop
      - release/*
      - hotfix/*
  pull_request:
    branches:
      - main
      - develop
  tag:
    - v*

# 全局缓存
cache:
  key: enterprise-frontend-deps-${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .pnpm-store/

# 阶段定义
stages:
  # ========== 准备阶段 ==========
  - name: prepare
    image: node:18-alpine
    script:
      - npm config set registry $NPM_REGISTRY
      - npm install -g pnpm@8
      - pnpm install --frozen-lockfile

  # ========== 检查阶段 ==========
  - name: lint
    script:
      - pnpm lint
      - pnpm stylelint
    depends_on:
      - prepare
    
  - name: type-check
    script:
      - pnpm type-check
    depends_on:
      - prepare

  - name: security-audit
    script:
      - pnpm audit --audit-level=high
    depends_on:
      - prepare
    allow_failure: true

  # ========== 测试阶段 ==========
  - name: unit-test
    script:
      - pnpm test:unit --coverage
    depends_on:
      - prepare
    artifacts:
      paths:
        - coverage/
      reports:
        junit: coverage/junit.xml
        coverage: coverage/lcov.info

  - name: e2e-test
    image: cypress/browsers:node18.12.0-chrome107
    script:
      - pnpm test:e2e
    depends_on:
      - lint
      - unit-test
    artifacts:
      paths:
        - cypress/screenshots/
        - cypress/videos/
    only:
      - develop
      - main

  # ========== 构建阶段 ==========
  - name: build-dev
    script:
      - pnpm build:dev
    depends_on:
      - lint
      - type-check
      - unit-test
    artifacts:
      paths:
        - dist/
    only:
      - develop

  - name: build-staging
    script:
      - pnpm build:staging
    depends_on:
      - lint
      - type-check
      - unit-test
    artifacts:
      paths:
        - dist/
    only:
      - release/*

  - name: build-production
    script:
      - pnpm build:production
    depends_on:
      - lint
      - type-check
      - unit-test
      - e2e-test
    artifacts:
      paths:
        - dist/
    only:
      - main

  # ========== Docker 镜像构建 ==========
  - name: docker-build
    image: docker:latest
    services:
      - docker:dind
    script:
      - docker login -u $DOCKER_USER -p $DOCKER_PASSWORD $DOCKER_REGISTRY
      - docker build -t $DOCKER_REGISTRY/frontend:$CI_COMMIT_SHORT_SHA .
      - docker push $DOCKER_REGISTRY/frontend:$CI_COMMIT_SHORT_SHA
    depends_on:
      - build-production
    only:
      - main

  # ========== 部署阶段 ==========
  - name: deploy-dev
    script:
      - echo "Deploying to development environment..."
      - scp -r dist/* deployer@dev.example.com:/var/www/frontend/
      - ssh deployer@dev.example.com "cd /var/www/frontend && ./restart.sh"
    depends_on:
      - build-dev
    only:
      - develop
    environment:
      name: development
      url: https://dev.example.com

  - name: deploy-staging
    script:
      - echo "Deploying to staging environment..."
      - scp -r dist/* deployer@staging.example.com:/var/www/frontend/
      - ssh deployer@staging.example.com "cd /var/www/frontend && ./restart.sh"
    depends_on:
      - build-staging
    only:
      - release/*
    environment:
      name: staging
      url: https://staging.example.com

  - name: deploy-production
    script:
      - echo "Deploying to production environment..."
      - kubectl set image deployment/frontend frontend=$DOCKER_REGISTRY/frontend:$CI_COMMIT_SHORT_SHA
      - kubectl rollout status deployment/frontend
    depends_on:
      - docker-build
    only:
      - main
    when: manual  # 手动触发
    environment:
      name: production
      url: https://example.com

  # ========== 通知阶段 ==========
  - name: notify-success
    script:
      - |
        curl -X POST "$WEBHOOK_URL" \
          -H "Content-Type: application/json" \
          -d '{
            "msgtype": "markdown",
            "markdown": {
              "content": "## ✅ 部署成功\n> **项目**: '"$CI_PROJECT_NAME"'\n> **分支**: '"$CI_COMMIT_BRANCH"'\n> **提交者**: '"$CI_COMMIT_AUTHOR"'\n> **时间**: '"$(date '+%Y-%m-%d %H:%M:%S')"'"
            }
          }'
    when: on_success

  - name: notify-failure
    script:
      - |
        curl -X POST "$WEBHOOK_URL" \
          -H "Content-Type: application/json" \
          -d '{
            "msgtype": "markdown",
            "markdown": {
              "content": "## ❌ 部署失败\n> **项目**: '"$CI_PROJECT_NAME"'\n> **分支**: '"$CI_COMMIT_BRANCH"'\n> **提交者**: '"$CI_COMMIT_AUTHOR"'\n> **时间**: '"$(date '+%Y-%m-%d %H:%M:%S')"'\n\n请及时检查并修复！"
            }
          }'
    when: on_failure
```

### 6.2 Docker 多阶段构建

```dockerfile
# Dockerfile
# 阶段1：构建
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建
RUN pnpm build:production

# 阶段2：运行
FROM nginx:alpine AS runner

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx-default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # 健康检查
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## 7. 代码审查与质量保障

### 7.1 Pull Request 模板

```markdown
<!-- .gitee/PULL_REQUEST_TEMPLATE.md -->

## PR 类型

请选择本次 PR 的类型：

- [ ] 新功能（Feature）
- [ ] Bug 修复（Bugfix）
- [ ] 代码重构（Refactor）
- [ ] 性能优化（Performance）
- [ ] 文档更新（Documentation）
- [ ] 测试相关（Test）
- [ ] 构建/CI（Build/CI）
- [ ] 其他（Other）

## 关联 Issue

关联的 Issue 编号：#

## 变更描述

请描述本次变更的内容：

## 影响范围

本次变更可能影响的模块/功能：

- [ ] 用户模块
- [ ] 订单模块
- [ ] 支付模块
- [ ] 其他：

## 测试说明

- [ ] 已添加单元测试
- [ ] 已通过本地测试
- [ ] 已在测试环境验证

## 自检清单

- [ ] 代码符合项目规范
- [ ] 没有遗留调试代码（console.log 等）
- [ ] 已更新相关文档
- [ ] 变更不会影响现有功能

## 截图/录屏

如有 UI 变更，请附上截图或录屏：

## 其他说明

其他需要说明的内容：
```

### 7.2 Issue 模板

```markdown
<!-- .gitee/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug 报告
about: 提交 Bug 报告以帮助我们改进
labels: bug
---

## Bug 描述

请简要描述 Bug 的现象：

## 复现步骤

1. 进入 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 出现错误

## 期望行为

请描述期望的正确行为：

## 实际行为

请描述实际发生的行为：

## 截图

如果可能，请附上截图以帮助说明问题：

## 环境信息

- 浏览器: [e.g. Chrome 100]
- 操作系统: [e.g. Windows 10]
- 项目版本: [e.g. v1.0.0]

## 附加信息

其他可能有用的信息：
```

```markdown
<!-- .gitee/ISSUE_TEMPLATE/feature_request.md -->
---
name: 功能请求
about: 提出新功能建议
labels: enhancement
---

## 功能描述

请描述希望添加的功能：

## 使用场景

请描述该功能的使用场景：

## 解决方案

如果有实现思路，请描述：

## 替代方案

是否有其他替代方案：

## 附加信息

其他可能有用的信息：
```

### 7.3 代码审查规范

```javascript
// .eslintrc.js - 企业级 ESLint 配置
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  rules: {
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    
    // 复杂度限制
    'max-lines-per-function': ['warn', { max: 100 }],
    'max-depth': ['warn', 4],
    'complexity': ['warn', 15]
  }
}
```

---

## 8. 多团队协作规范

### 8.1 团队分支策略

```
# 多团队分支结构
main                        # 生产环境
├── develop                 # 集成开发分支
│   ├── team-a/develop     # A 团队开发分支
│   │   ├── feature/user-management
│   │   └── feature/role-permission
│   ├── team-b/develop     # B 团队开发分支
│   │   ├── feature/order-flow
│   │   └── feature/payment-gateway
│   └── team-c/develop     # C 团队开发分支
│       ├── feature/data-dashboard
│       └── feature/report-export
├── release/v1.0.0         # 发布分支
└── hotfix/security-patch  # 紧急修复分支
```

### 8.2 代码同步与集成

```bash
# 团队日常工作流程

# 1. 从团队开发分支创建功能分支
git checkout team-a/develop
git pull origin team-a/develop
git checkout -b feature/JIRA-1234-user-login

# 2. 开发完成后，提交到团队开发分支
git add .
git commit -m "feat(user): 添加用户登录功能"
git push origin feature/JIRA-1234-user-login
# 在 Gitee 创建 PR，合并到 team-a/develop

# 3. 团队集成测试通过后，合并到 develop
git checkout develop
git pull origin develop
git merge --no-ff team-a/develop
git push origin develop

# 4. 集成测试通过后，创建发布分支
git checkout develop
git checkout -b release/v1.0.0
# 进行发布测试

# 5. 发布通过后，合并到 main
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

### 8.3 代码冲突处理流程

```bash
# 冲突处理流程

# 1. 发现冲突
git checkout develop
git pull origin develop
git merge team-a/develop
# 发现冲突

# 2. 查看冲突文件
git status

# 3. 解决冲突
# 编辑冲突文件，删除冲突标记

# 4. 标记为已解决
git add <resolved-files>

# 5. 完成合并
git commit -m "merge: 合并 team-a/develop 到 develop，解决冲突"

# 6. 推送
git push origin develop

# 7. 通知相关团队成员验证
```

---

## 9. 安全与权限管理

### 9.1 敏感信息管理

```bash
# .gitignore - 敏感文件忽略
.env
.env.local
.env.*.local
*.pem
*.key
credentials.json
secrets/
```

```bash
# 使用 git-secrets 防止敏感信息提交
# 安装 git-secrets
brew install git-secrets

# 配置规则
git secrets --install
git secrets --register-aws

# 添加自定义规则
git secrets --add 'password\s*=\s*.+'
git secrets --add 'api[_-]?key\s*=\s*.+'
git secrets --add 'secret\s*=\s*.+'

# 扫描历史提交
git secrets --scan-history
```

### 9.2 权限控制最佳实践

```yaml
# Gitee 仓库权限配置建议

# 仓库角色
roles:
  owner:
    - 所有权限
    - 建议：技术负责人
    
  admin:
    - 仓库设置
    - 成员管理
    - 分支保护
    - 建议：架构师、团队 Leader
    
  developer:
    - 代码推送
    - 分支创建
    - Pull Request
    - 建议：开发人员
    
  reporter:
    - 代码查看
    - Issue 创建
    - 建议：产品、测试人员

# 分支权限
branch_protection:
  main:
    - 禁止直接推送
    - 必须通过 PR
    - 需要 2+ 人审核
    - CI 必须通过
    - 管理员也受限制
    
  develop:
    - 禁止直接推送
    - 必须通过 PR
    - 需要 1+ 人审核
    - CI 必须通过
    
  feature/*:
    - 开发者可推送
    - 建议设置过期自动删除
```

---

## 10. 监控与告警

### 10.1 部署监控脚本

```typescript
// scripts/deploy-monitor.ts
import axios from 'axios'

interface DeployConfig {
  projectName: string
  environment: string
  version: string
  commitHash: string
  commitAuthor: string
  commitMessage: string
}

interface NotifyConfig {
  webhookUrl: string
  recipients?: string[]
}

class DeployMonitor {
  private deployConfig: DeployConfig
  private notifyConfig: NotifyConfig
  
  constructor(deployConfig: DeployConfig, notifyConfig: NotifyConfig) {
    this.deployConfig = deployConfig
    this.notifyConfig = notifyConfig
  }
  
  // 发送企业微信通知
  async sendWechatNotify(success: boolean, message?: string): Promise<void> {
    const status = success ? '✅ 成功' : '❌ 失败'
    const color = success ? 'info' : 'warning'
    
    const content = `
## 部署通知

> **项目**: ${this.deployConfig.projectName}
> **环境**: ${this.deployConfig.environment}
> **版本**: ${this.deployConfig.version}
> **状态**: ${status}
> **提交**: ${this.deployConfig.commitHash.substring(0, 7)}
> **作者**: ${this.deployConfig.commitAuthor}
> **说明**: ${this.deployConfig.commitMessage}
> **时间**: ${new Date().toLocaleString('zh-CN')}
${message ? `\n**备注**: ${message}` : ''}
    `.trim()
    
    await axios.post(this.notifyConfig.webhookUrl, {
      msgtype: 'markdown',
      markdown: { content }
    })
  }
  
  // 发送钉钉通知
  async sendDingTalkNotify(success: boolean, message?: string): Promise<void> {
    const status = success ? '成功 ✅' : '失败 ❌'
    
    const text = `
### 部署通知

- 项目: ${this.deployConfig.projectName}
- 环境: ${this.deployConfig.environment}
- 版本: ${this.deployConfig.version}
- 状态: ${status}
- 提交: ${this.deployConfig.commitHash.substring(0, 7)}
- 作者: ${this.deployConfig.commitAuthor}
- 时间: ${new Date().toLocaleString('zh-CN')}
${message ? `- 备注: ${message}` : ''}
    `.trim()
    
    await axios.post(this.notifyConfig.webhookUrl, {
      msgtype: 'markdown',
      markdown: {
        title: `部署${success ? '成功' : '失败'}: ${this.deployConfig.projectName}`,
        text
      }
    })
  }
  
  // 健康检查
  async healthCheck(url: string, retries = 5, interval = 10000): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(`${url}/health`, { timeout: 5000 })
        if (response.status === 200) {
          console.log(`Health check passed at attempt ${i + 1}`)
          return true
        }
      } catch (error) {
        console.log(`Health check failed at attempt ${i + 1}, retrying...`)
      }
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
    
    return false
  }
  
  // 执行部署监控
  async run(deployUrl: string): Promise<void> {
    console.log('Starting deployment monitoring...')
    
    // 等待一段时间让部署完成
    await new Promise(resolve => setTimeout(resolve, 30000))
    
    // 执行健康检查
    const isHealthy = await this.healthCheck(deployUrl)
    
    // 发送通知
    if (isHealthy) {
      await this.sendWechatNotify(true, '服务健康检查通过')
    } else {
      await this.sendWechatNotify(false, '服务健康检查失败，请检查!')
    }
  }
}

// 使用示例
const monitor = new DeployMonitor(
  {
    projectName: 'enterprise-frontend',
    environment: process.env.DEPLOY_ENV || 'production',
    version: process.env.CI_COMMIT_TAG || 'latest',
    commitHash: process.env.CI_COMMIT_SHA || '',
    commitAuthor: process.env.CI_COMMIT_AUTHOR || '',
    commitMessage: process.env.CI_COMMIT_MESSAGE || ''
  },
  {
    webhookUrl: process.env.WECHAT_WEBHOOK_URL || ''
  }
)

monitor.run(process.env.DEPLOY_URL || 'https://example.com')
```

### 10.2 错误监控集成

```typescript
// src/utils/error-monitor.ts
import * as Sentry from '@sentry/vue'
import { App } from 'vue'
import { Router } from 'vue-router'

interface ErrorMonitorConfig {
  dsn: string
  environment: string
  release: string
  tracesSampleRate?: number
}

export function setupErrorMonitor(
  app: App, 
  router: Router, 
  config: ErrorMonitorConfig
): void {
  if (import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: config.dsn,
      environment: config.environment,
      release: config.release,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router)
        }),
        new Sentry.Replay()
      ],
      tracesSampleRate: config.tracesSampleRate || 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    })
  }
}

// 手动上报错误
export function reportError(
  error: Error, 
  context?: Record<string, any>
): void {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context
    })
  } else {
    console.error('Error:', error, context)
  }
}

// 手动上报消息
export function reportMessage(
  message: string, 
  level: Sentry.SeverityLevel = 'info'
): void {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level)
  } else {
    console.log(`[${level}]`, message)
  }
}

// 设置用户信息
export function setUser(user: { id: string; username: string; email?: string }): void {
  Sentry.setUser(user)
}

// 清除用户信息
export function clearUser(): void {
  Sentry.setUser(null)
}
```

---

## 附录：企业级最佳实践清单

### A. Git 操作规范

| 场景 | 推荐做法 | 禁止做法 |
|------|---------|---------|
| 分支创建 | 从最新的 develop 创建 | 从过期分支创建 |
| 提交消息 | 遵循 Angular 规范 | 无意义的消息 |
| 代码合并 | 使用 --no-ff 保留历史 | 直接 fast-forward |
| 冲突处理 | 理解后手动解决 | 盲目选择一方 |
| 敏感信息 | 使用环境变量 | 提交到代码库 |

### B. 代码审查要点

- [ ] 功能是否符合需求
- [ ] 代码是否符合规范
- [ ] 是否有单元测试
- [ ] 是否有安全隐患
- [ ] 性能是否有问题
- [ ] 是否有遗留调试代码
- [ ] 文档是否更新

### C. 发布检查清单

- [ ] 代码审查通过
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 性能测试通过
- [ ] 安全扫描通过
- [ ] 文档更新完成
- [ ] 发布计划确认
- [ ] 回滚方案准备

---

> 文档版本：v1.0  
> 更新时间：2024年  
> 适用于：企业级 Vue2/Vue3/Vue3+TS 项目
