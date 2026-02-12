# 前端框架与 Gitee 集成指南
<div class="doc-toc">

## 目录

1. [概述](#1-概述)
2. [Vue2 项目与 Gitee 集成](#2-vue2-项目与-gitee-集成)
3. [Vue3 项目与 Gitee 集成](#3-vue3-项目与-gitee-集成)
4. [Vue3 + TypeScript 项目与 Gitee 集成](#4-vue3--typescript-项目与-gitee-集成)
5. [React 项目与 Gitee 集成](#5-react-项目与-gitee-集成)
6. [通用最佳实践](#6-通用最佳实践)

</div>

---

## 1. 概述

### 1.1 前端项目版本控制需求

前端项目使用 Gitee 进行版本控制时，主要涉及以下方面：

- 代码版本管理
- 团队协作开发
- CI/CD 自动化部署
- Gitee Pages 静态托管
- 项目文档管理

### 1.2 不同框架的特点

| 框架 | 构建工具 | 配置文件 | 部署目录 |
|------|---------|---------|---------|
| Vue2 | webpack | vue.config.js | dist |
| Vue3 | Vite/webpack | vite.config.js | dist |
| Vue3+TS | Vite | vite.config.ts | dist |
| React | CRA/Vite | vite.config.js | build/dist |

---

## 2. Vue2 项目与 Gitee 集成

### 2.1 项目初始化与 Git 配置

```bash
# 创建 Vue2 项目
vue create my-vue2-project
cd my-vue2-project

# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin git@gitee.com:username/my-vue2-project.git

# 首次提交
git add .
git commit -m "feat: 初始化Vue2项目"
git push -u origin main
```

### 2.2 Vue2 专用 .gitignore 配置

```gitignore
# .gitignore

# 依赖目录
node_modules/

# 构建输出
/dist

# 本地环境配置
.env.local
.env.*.local

# 日志文件
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 编辑器配置
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# 测试覆盖率
/coverage

# 临时文件
*.local

# 系统文件
.DS_Store
Thumbs.db
```

### 2.3 Vue2 环境配置文件管理

```bash
# 项目结构
my-vue2-project/
├── .env                  # 所有环境通用
├── .env.development      # 开发环境
├── .env.production       # 生产环境
├── .env.staging          # 测试环境
└── .env.local            # 本地覆盖（不提交）
```

```bash
# .env.development
NODE_ENV=development
VUE_APP_API_BASE_URL=http://localhost:3000/api
VUE_APP_TITLE=Vue2开发环境

# .env.production
NODE_ENV=production
VUE_APP_API_BASE_URL=https://api.example.com
VUE_APP_TITLE=Vue2生产环境
```

```javascript
// 在代码中使用
console.log(process.env.VUE_APP_API_BASE_URL);
console.log(process.env.VUE_APP_TITLE);
```

**使用场景**：区分不同环境的API地址、配置参数。

### 2.4 Vue2 项目部署到 Gitee Pages

```javascript
// vue.config.js
module.exports = {
  // 部署应用包时的基本 URL（仓库名）
  publicPath: process.env.NODE_ENV === 'production'
    ? '/my-vue2-project/'
    : '/',
  
  // 构建输出目录
  outputDir: 'dist',
  
  // 静态资源目录
  assetsDir: 'static',
  
  // 生产环境 sourceMap
  productionSourceMap: false,
  
  // 开发服务器配置
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
```

```bash
# 部署脚本 deploy.sh
#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
npm run build

# 进入构建文件夹
cd dist

# 初始化 git 仓库
git init
git add -A
git commit -m 'deploy'

# 推送到 gitee pages 分支
git push -f git@gitee.com:username/my-vue2-project.git main:gh-pages

cd -
```

### 2.5 Vue2 CI/CD 配置

```yaml
# .gitee-ci.yml
version: 1.0
name: vue2-ci-pipeline

triggers:
  push:
    branches:
      - main
      - develop

stages:
  - name: install
    script:
      - npm install
    cache:
      key: vue2-deps
      paths:
        - node_modules/

  - name: lint
    script:
      - npm run lint
    depends_on:
      - install

  - name: test
    script:
      - npm run test:unit
    depends_on:
      - install

  - name: build
    script:
      - npm run build
    depends_on:
      - lint
      - test
    artifacts:
      paths:
        - dist/
```

### 2.6 Vue2 团队协作规范

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'space-before-function-paren': ['error', 'never'],
    'comma-dangle': ['error', 'never']
  }
}
```

```json
// package.json - Git Hooks 配置
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "vue-cli-service lint",
      "git add"
    ]
  }
}
```

### 2.7 Vue2 组件库发布到 Gitee

```javascript
// vue.config.js - 组件库构建配置
module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  css: {
    extract: {
      filename: 'style.css'
    }
  }
}
```

```json
// package.json
{
  "name": "my-vue2-component-library",
  "version": "1.0.0",
  "main": "dist/my-library.umd.min.js",
  "files": [
    "dist/*",
    "src/components/*"
  ],
  "scripts": {
    "build:lib": "vue-cli-service build --target lib --name my-library src/index.js",
    "prepublishOnly": "npm run build:lib"
  },
  "repository": {
    "type": "git",
    "url": "git@gitee.com:username/my-vue2-component-library.git"
  },
  "publishConfig": {
    "registry": "https://gitee.com/api/v5/npm/username/my-vue2-component-library"
  }
}
```

**使用场景**：团队内部共享Vue2组件库。

### 2.8 Vue2 多环境分支管理

```bash
# 分支策略
main        # 生产环境代码
develop     # 开发环境代码
staging     # 测试环境代码
feature/*   # 功能开发分支
hotfix/*    # 紧急修复分支
release/*   # 发布分支

# 创建开发分支
git checkout -b develop main
git push -u origin develop

# 功能开发流程
git checkout develop
git checkout -b feature/user-login
# ... 开发代码 ...
git add .
git commit -m "feat(login): 添加用户登录功能"
git push -u origin feature/user-login
# 在 Gitee 创建 Pull Request，合并到 develop

# 发布流程
git checkout develop
git checkout -b release/v1.0.0
# ... 测试修复 ...
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

---

## 3. Vue3 项目与 Gitee 集成

### 3.1 项目初始化与 Git 配置

```bash
# 使用 Vite 创建 Vue3 项目
npm create vite@latest my-vue3-project -- --template vue
cd my-vue3-project
npm install

# 初始化 Git
git init
git remote add origin git@gitee.com:username/my-vue3-project.git

# 首次提交
git add .
git commit -m "feat: 初始化Vue3项目"
git push -u origin main
```

### 3.2 Vue3 专用 .gitignore 配置

```gitignore
# .gitignore

# 依赖
node_modules
.pnpm-store

# 构建输出
dist
dist-ssr
*.local

# 编辑器
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea

# 环境文件
.env.local
.env.*.local

# 日志
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# 系统
.DS_Store

# 测试
coverage
*.lcov

# 类型生成
*.tsbuildinfo
```

### 3.3 Vue3 Vite 配置与部署

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    
    // 部署基础路径
    base: mode === 'production' ? '/my-vue3-project/' : '/',
    
    // 路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // 分包配置
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus']
          }
        }
      }
    },
    
    // 开发服务器
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

```bash
# .env.development
VITE_APP_TITLE=Vue3开发环境
VITE_API_URL=http://localhost:8080
VITE_BASE_URL=/

# .env.production
VITE_APP_TITLE=Vue3生产环境
VITE_API_URL=https://api.example.com
VITE_BASE_URL=/my-vue3-project/
```

```javascript
// 在代码中使用
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_URL)
```

### 3.4 Vue3 Composition API 与版本控制

```vue
<!-- src/composables/useGiteeAPI.js -->
<script>
import { ref, reactive } from 'vue'

// 可复用的 Gitee API 组合式函数
export function useGiteeAPI(token) {
  const loading = ref(false)
  const error = ref(null)
  const data = reactive({
    user: null,
    repos: []
  })
  
  const BASE_URL = 'https://gitee.com/api/v5'
  
  // 获取用户信息
  async function fetchUser() {
    loading.value = true
    try {
      const response = await fetch(`${BASE_URL}/user?access_token=${token}`)
      data.user = await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // 获取仓库列表
  async function fetchRepos(params = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams({
        access_token: token,
        sort: 'updated',
        per_page: 20,
        ...params
      })
      const response = await fetch(`${BASE_URL}/user/repos?${query}`)
      data.repos = await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // 创建仓库
  async function createRepo(repoData) {
    loading.value = true
    try {
      const response = await fetch(`${BASE_URL}/user/repos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: token,
          ...repoData
        })
      })
      return await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    data,
    fetchUser,
    fetchRepos,
    createRepo
  }
}
</script>
```

```vue
<!-- src/views/GiteeRepos.vue -->
<template>
  <div class="gitee-repos">
    <h2>我的 Gitee 仓库</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <ul v-else class="repo-list">
      <li v-for="repo in data.repos" :key="repo.id" class="repo-item">
        <h3>{{ repo.name }}</h3>
        <p>{{ repo.description }}</p>
        <div class="repo-meta">
          <span>⭐ {{ repo.stargazers_count }}</span>
          <span>🍴 {{ repo.forks_count }}</span>
          <span>📅 {{ formatDate(repo.updated_at) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGiteeAPI } from '@/composables/useGiteeAPI'

const token = import.meta.env.VITE_GITEE_TOKEN
const { loading, error, data, fetchRepos } = useGiteeAPI(token)

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString()
}

onMounted(() => {
  fetchRepos()
})
</script>

<style scoped>
.repo-list {
  list-style: none;
  padding: 0;
}

.repo-item {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.repo-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}
</style>
```

**使用场景**：在Vue3应用中集成Gitee API进行仓库管理。

### 3.5 Vue3 CI/CD 配置

```yaml
# .gitee-ci.yml
version: 1.0
name: vue3-vite-pipeline

triggers:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

variables:
  PNPM_VERSION: "8"
  NODE_VERSION: "18"

stages:
  - name: setup
    image: node:18-alpine
    script:
      - npm install -g pnpm@8
      - pnpm install --frozen-lockfile
    cache:
      key: pnpm-store-vue3
      paths:
        - node_modules/
        - ~/.pnpm-store

  - name: lint
    script:
      - pnpm lint
    depends_on:
      - setup

  - name: type-check
    script:
      - pnpm type-check
    depends_on:
      - setup

  - name: test
    script:
      - pnpm test:unit
    depends_on:
      - setup
    artifacts:
      paths:
        - coverage/

  - name: build
    script:
      - pnpm build
    depends_on:
      - lint
      - test
    artifacts:
      paths:
        - dist/

  - name: deploy-preview
    script:
      - echo "Deploying to preview environment..."
    depends_on:
      - build
    only:
      - develop

  - name: deploy-production
    script:
      - echo "Deploying to production..."
    depends_on:
      - build
    only:
      - main
    when: manual
```

### 3.6 Vue3 Pinia 状态持久化与版本控制

```javascript
// src/stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('gitee_token') || '')
  const userInfo = ref(null)
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  
  // 方法
  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('gitee_token', newToken)
  }
  
  function setUserInfo(info) {
    userInfo.value = info
  }
  
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('gitee_token')
  }
  
  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout
  }
})
```

```javascript
// src/stores/index.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
```

### 3.7 Vue3 自动化部署脚本

```bash
#!/usr/bin/env sh
# deploy.sh - Vue3 项目自动部署到 Gitee Pages

set -e

echo "🚀 开始部署 Vue3 项目到 Gitee Pages..."

# 构建
echo "📦 正在构建..."
npm run build

# 进入构建目录
cd dist

# 创建 .nojekyll 文件（避免 Jekyll 处理）
touch .nojekyll

# 初始化 Git
git init
git add -A

# 获取当前时间
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "deploy: $TIMESTAMP"

# 推送到 gh-pages 分支
echo "📤 推送到 Gitee..."
git push -f git@gitee.com:username/my-vue3-project.git main:gh-pages

cd -

echo "✅ 部署完成！"
echo "🔗 访问地址: https://username.gitee.io/my-vue3-project/"
```

---

## 4. Vue3 + TypeScript 项目与 Gitee 集成

### 4.1 项目初始化与 Git 配置

```bash
# 创建 Vue3 + TypeScript 项目
npm create vite@latest my-vue3-ts-project -- --template vue-ts
cd my-vue3-ts-project
npm install

# 初始化 Git
git init
git remote add origin git@gitee.com:username/my-vue3-ts-project.git

# 配置 TypeScript 相关的 gitignore
echo "*.tsbuildinfo" >> .gitignore

# 首次提交
git add .
git commit -m "feat: 初始化Vue3+TypeScript项目"
git push -u origin main
```

### 4.2 TypeScript 配置文件

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path Alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

```json
// tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### 4.3 Vite TypeScript 配置

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  const isProd = mode === 'production'
  
  return {
    plugins: [vue()],
    
    base: isProd ? '/my-vue3-ts-project/' : '/',
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: !isProd,
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue-vendor'
              if (id.includes('element-plus')) return 'element-plus'
              return 'vendor'
            }
          }
        }
      }
    },
    
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

### 4.4 TypeScript 类型定义与 Gitee API

```typescript
// src/types/gitee.ts

// Gitee 用户信息类型
export interface GiteeUser {
  id: number
  login: string
  name: string
  avatar_url: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  blog: string | null
  weibo: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  stared: number
  watched: number
  created_at: string
  updated_at: string
  email: string | null
}

// Gitee 仓库类型
export interface GiteeRepo {
  id: number
  full_name: string
  human_name: string
  url: string
  namespace: {
    id: number
    type: string
    name: string
    path: string
    html_url: string
  }
  path: string
  name: string
  owner: GiteeUser
  assigner: GiteeUser | null
  description: string | null
  private: boolean
  public: boolean
  internal: boolean
  fork: boolean
  html_url: string
  ssh_url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  hooks_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  stargazers_url: string
  contributors_url: string
  commits_url: string
  comments_url: string
  issue_comment_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  recommend: boolean
  gvp: boolean
  homepage: string | null
  language: string | null
  forks_count: number
  stargazers_count: number
  watchers_count: number
  default_branch: string
  open_issues_count: number
  has_issues: boolean
  has_wiki: boolean
  issue_comment: boolean
  can_comment: boolean
  pull_requests_enabled: boolean
  has_page: boolean
  license: string | null
  outsourced: boolean
  project_creator: string
  members: string[]
  pushed_at: string
  created_at: string
  updated_at: string
}

// 创建仓库参数
export interface CreateRepoParams {
  name: string
  description?: string
  homepage?: string
  private?: boolean
  has_issues?: boolean
  has_wiki?: boolean
  auto_init?: boolean
}

// API 响应类型
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// 分页参数
export interface PaginationParams {
  page?: number
  per_page?: number
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
}
```

### 4.5 TypeScript Gitee API 服务

```typescript
// src/api/gitee.ts
import type { 
  GiteeUser, 
  GiteeRepo, 
  CreateRepoParams, 
  PaginationParams 
} from '@/types/gitee'

const BASE_URL = 'https://gitee.com/api/v5'

class GiteeService {
  private token: string
  
  constructor(token: string) {
    this.token = token
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`)
    url.searchParams.append('access_token', this.token)
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }
    
    return response.json()
  }
  
  // 获取当前用户信息
  async getUser(): Promise<GiteeUser> {
    return this.request<GiteeUser>('/user')
  }
  
  // 获取用户仓库列表
  async getUserRepos(params: PaginationParams = {}): Promise<GiteeRepo[]> {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString()
    
    return this.request<GiteeRepo[]>(`/user/repos?${queryString}`)
  }
  
  // 获取单个仓库
  async getRepo(owner: string, repo: string): Promise<GiteeRepo> {
    return this.request<GiteeRepo>(`/repos/${owner}/${repo}`)
  }
  
  // 创建仓库
  async createRepo(params: CreateRepoParams): Promise<GiteeRepo> {
    return this.request<GiteeRepo>('/user/repos', {
      method: 'POST',
      body: JSON.stringify(params)
    })
  }
  
  // 删除仓库
  async deleteRepo(owner: string, repo: string): Promise<void> {
    return this.request<void>(`/repos/${owner}/${repo}`, {
      method: 'DELETE'
    })
  }
  
  // 获取分支列表
  async getBranches(owner: string, repo: string): Promise<any[]> {
    return this.request<any[]>(`/repos/${owner}/${repo}/branches`)
  }
  
  // 获取提交列表
  async getCommits(
    owner: string, 
    repo: string, 
    params: { sha?: string; path?: string } = {}
  ): Promise<any[]> {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString()
    
    return this.request<any[]>(`/repos/${owner}/${repo}/commits?${queryString}`)
  }
}

export const createGiteeService = (token: string) => new GiteeService(token)
export default GiteeService
```

### 4.6 TypeScript Composable 函数

```typescript
// src/composables/useGitee.ts
import { ref, reactive, computed, type Ref, type ComputedRef } from 'vue'
import GiteeService, { createGiteeService } from '@/api/gitee'
import type { GiteeUser, GiteeRepo, CreateRepoParams } from '@/types/gitee'

interface UseGiteeReturn {
  loading: Ref<boolean>
  error: Ref<string | null>
  user: Ref<GiteeUser | null>
  repos: Ref<GiteeRepo[]>
  isAuthenticated: ComputedRef<boolean>
  fetchUser: () => Promise<void>
  fetchRepos: () => Promise<void>
  createRepo: (params: CreateRepoParams) => Promise<GiteeRepo | null>
  deleteRepo: (owner: string, repo: string) => Promise<boolean>
}

export function useGitee(token: string): UseGiteeReturn {
  const service = createGiteeService(token)
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<GiteeUser | null>(null)
  const repos = ref<GiteeRepo[]>([])
  
  const isAuthenticated = computed(() => !!user.value)
  
  const fetchUser = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      user.value = await service.getUser()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }
  
  const fetchRepos = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      repos.value = await service.getUserRepos({
        sort: 'updated',
        per_page: 50
      })
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }
  
  const createRepo = async (params: CreateRepoParams): Promise<GiteeRepo | null> => {
    loading.value = true
    error.value = null
    try {
      const newRepo = await service.createRepo(params)
      repos.value.unshift(newRepo)
      return newRepo
    } catch (e) {
      error.value = (e as Error).message
      return null
    } finally {
      loading.value = false
    }
  }
  
  const deleteRepo = async (owner: string, repo: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await service.deleteRepo(owner, repo)
      repos.value = repos.value.filter(r => r.name !== repo)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    user,
    repos,
    isAuthenticated,
    fetchUser,
    fetchRepos,
    createRepo,
    deleteRepo
  }
}
```

### 4.7 TypeScript 组件示例

```vue
<!-- src/components/RepoList.vue -->
<template>
  <div class="repo-list">
    <div v-if="loading" class="loading">
      <span>加载中...</span>
    </div>
    
    <div v-else-if="error" class="error">
      <span>{{ error }}</span>
      <button @click="retry">重试</button>
    </div>
    
    <div v-else class="repos">
      <div 
        v-for="repo in repos" 
        :key="repo.id" 
        class="repo-card"
      >
        <div class="repo-header">
          <h3>{{ repo.name }}</h3>
          <span :class="['visibility', repo.private ? 'private' : 'public']">
            {{ repo.private ? '私有' : '公开' }}
          </span>
        </div>
        
        <p class="description">{{ repo.description || '暂无描述' }}</p>
        
        <div class="repo-stats">
          <span v-if="repo.language" class="language">
            <span class="dot" :style="{ background: getLanguageColor(repo.language) }"></span>
            {{ repo.language }}
          </span>
          <span class="stat">⭐ {{ repo.stargazers_count }}</span>
          <span class="stat">🍴 {{ repo.forks_count }}</span>
        </div>
        
        <div class="repo-actions">
          <a :href="repo.html_url" target="_blank" class="btn">
            查看
          </a>
          <button @click="handleDelete(repo)" class="btn btn-danger">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGitee } from '@/composables/useGitee'
import type { GiteeRepo } from '@/types/gitee'

const token = import.meta.env.VITE_GITEE_TOKEN as string

const { 
  loading, 
  error, 
  repos, 
  fetchRepos, 
  deleteRepo 
} = useGitee(token)

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8'
}

const getLanguageColor = (language: string): string => {
  return languageColors[language] || '#8b8b8b'
}

const handleDelete = async (repo: GiteeRepo): Promise<void> => {
  if (confirm(`确定要删除仓库 ${repo.name} 吗？`)) {
    const owner = repo.namespace.path
    await deleteRepo(owner, repo.name)
  }
}

const retry = (): void => {
  fetchRepos()
}

onMounted(() => {
  fetchRepos()
})
</script>

<style scoped>
.repo-list {
  padding: 20px;
}

.repos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.repo-card {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  background: #fff;
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.repo-header h3 {
  margin: 0;
  font-size: 16px;
  color: #0366d6;
}

.visibility {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.visibility.public {
  background: #e8f5e9;
  color: #2e7d32;
}

.visibility.private {
  background: #fff3e0;
  color: #e65100;
}

.description {
  color: #586069;
  font-size: 14px;
  margin-bottom: 12px;
}

.repo-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #586069;
}

.language {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.repo-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  font-size: 12px;
}

.btn:hover {
  background: #f5f5f5;
}

.btn-danger {
  color: #d32f2f;
  border-color: #ffcdd2;
}

.btn-danger:hover {
  background: #ffebee;
}
</style>
```

### 4.8 TypeScript CI/CD 配置

```yaml
# .gitee-ci.yml
version: 1.0
name: vue3-ts-pipeline

triggers:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

stages:
  - name: install
    image: node:18-alpine
    script:
      - npm install -g pnpm
      - pnpm install --frozen-lockfile
    cache:
      key: vue3-ts-deps
      paths:
        - node_modules/
        - ~/.pnpm-store

  - name: type-check
    script:
      - pnpm vue-tsc --noEmit
    depends_on:
      - install

  - name: lint
    script:
      - pnpm lint
    depends_on:
      - install

  - name: test
    script:
      - pnpm test:unit --coverage
    depends_on:
      - install
    artifacts:
      paths:
        - coverage/

  - name: build
    script:
      - pnpm build
    depends_on:
      - type-check
      - lint
      - test
    artifacts:
      paths:
        - dist/

  - name: deploy
    script:
      - ./deploy.sh
    depends_on:
      - build
    only:
      - main
```

---

## 5. React 项目与 Gitee 集成

### 5.1 项目初始化与 Git 配置

```bash
# 使用 Vite 创建 React 项目
npm create vite@latest my-react-project -- --template react-ts
cd my-react-project
npm install

# 初始化 Git
git init
git remote add origin git@gitee.com:username/my-react-project.git

# 首次提交
git add .
git commit -m "feat: 初始化React项目"
git push -u origin main
```

### 5.2 React 专用 .gitignore 配置

```gitignore
# .gitignore

# 依赖
node_modules
/.pnp
.pnp.js

# 构建输出
/build
/dist

# 测试
/coverage

# 环境配置
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 编辑器
.idea
.vscode
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
```

### 5.3 React Vite 配置

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isProd = mode === 'production'
  
  return {
    plugins: [react()],
    
    base: isProd ? '/my-react-project/' : '/',
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['antd', '@ant-design/icons']
          }
        }
      }
    },
    
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

### 5.4 React Hooks 调用 Gitee API

```typescript
// src/hooks/useGitee.ts
import { useState, useCallback, useEffect } from 'react'

interface GiteeUser {
  id: number
  login: string
  name: string
  avatar_url: string
  email: string | null
  public_repos: number
  followers: number
  following: number
}

interface GiteeRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  html_url: string
  ssh_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  namespace: {
    path: string
  }
}

interface UseGiteeState {
  loading: boolean
  error: string | null
  user: GiteeUser | null
  repos: GiteeRepo[]
}

interface UseGiteeActions {
  fetchUser: () => Promise<void>
  fetchRepos: () => Promise<void>
  createRepo: (name: string, isPrivate?: boolean) => Promise<GiteeRepo | null>
  deleteRepo: (owner: string, repo: string) => Promise<boolean>
  refresh: () => Promise<void>
}

type UseGiteeReturn = UseGiteeState & UseGiteeActions

const BASE_URL = 'https://gitee.com/api/v5'

export function useGitee(token: string): UseGiteeReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<GiteeUser | null>(null)
  const [repos, setRepos] = useState<GiteeRepo[]>([])
  
  const request = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`
    const separator = endpoint.includes('?') ? '&' : '?'
    
    const response = await fetch(`${url}${separator}access_token=${token}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Request failed')
    }
    
    return response.json()
  }, [token])
  
  const fetchUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request<GiteeUser>('/user')
      setUser(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [request])
  
  const fetchRepos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request<GiteeRepo[]>('/user/repos?sort=updated&per_page=50')
      setRepos(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [request])
  
  const createRepo = useCallback(async (
    name: string, 
    isPrivate = false
  ): Promise<GiteeRepo | null> => {
    setLoading(true)
    setError(null)
    try {
      const newRepo = await request<GiteeRepo>('/user/repos', {
        method: 'POST',
        body: JSON.stringify({ name, private: isPrivate })
      })
      setRepos(prev => [newRepo, ...prev])
      return newRepo
    } catch (e) {
      setError((e as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }, [request])
  
  const deleteRepo = useCallback(async (
    owner: string, 
    repo: string
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await request(`/repos/${owner}/${repo}`, { method: 'DELETE' })
      setRepos(prev => prev.filter(r => r.name !== repo))
      return true
    } catch (e) {
      setError((e as Error).message)
      return false
    } finally {
      setLoading(false)
    }
  }, [request])
  
  const refresh = useCallback(async () => {
    await Promise.all([fetchUser(), fetchRepos()])
  }, [fetchUser, fetchRepos])
  
  return {
    loading,
    error,
    user,
    repos,
    fetchUser,
    fetchRepos,
    createRepo,
    deleteRepo,
    refresh
  }
}
```

### 5.5 React 组件示例

```tsx
// src/components/GiteeRepoList.tsx
import React, { useEffect, useState } from 'react'
import { useGitee } from '@/hooks/useGitee'
import './GiteeRepoList.css'

interface RepoCardProps {
  repo: {
    id: number
    name: string
    description: string | null
    private: boolean
    html_url: string
    language: string | null
    stargazers_count: number
    forks_count: number
    updated_at: string
    namespace: { path: string }
  }
  onDelete: (owner: string, name: string) => void
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`确定要删除仓库 ${repo.name} 吗？`)) {
      onDelete(repo.namespace.path, repo.name)
    }
  }
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN')
  }
  
  return (
    <div className="repo-card">
      <div className="repo-header">
        <h3 className="repo-name">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <span className={`badge ${repo.private ? 'private' : 'public'}`}>
          {repo.private ? '私有' : '公开'}
        </span>
      </div>
      
      <p className="repo-description">
        {repo.description || '暂无描述'}
      </p>
      
      <div className="repo-meta">
        {repo.language && (
          <span className="language">{repo.language}</span>
        )}
        <span className="stat">⭐ {repo.stargazers_count}</span>
        <span className="stat">🍴 {repo.forks_count}</span>
        <span className="date">更新于 {formatDate(repo.updated_at)}</span>
      </div>
      
      <div className="repo-actions">
        <a 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          查看仓库
        </a>
        <button onClick={handleDelete} className="btn btn-danger">
          删除
        </button>
      </div>
    </div>
  )
}

interface CreateRepoFormProps {
  onCreate: (name: string, isPrivate: boolean) => Promise<any>
  loading: boolean
}

const CreateRepoForm: React.FC<CreateRepoFormProps> = ({ onCreate, loading }) => {
  const [name, setName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    await onCreate(name.trim(), isPrivate)
    setName('')
    setIsPrivate(false)
  }
  
  return (
    <form onSubmit={handleSubmit} className="create-repo-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="仓库名称"
        required
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        私有仓库
      </label>
      <button type="submit" disabled={loading || !name.trim()}>
        {loading ? '创建中...' : '创建仓库'}
      </button>
    </form>
  )
}

const GiteeRepoList: React.FC = () => {
  const token = import.meta.env.VITE_GITEE_TOKEN as string
  
  const {
    loading,
    error,
    user,
    repos,
    fetchUser,
    fetchRepos,
    createRepo,
    deleteRepo,
    refresh
  } = useGitee(token)
  
  useEffect(() => {
    refresh()
  }, [refresh])
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={refresh}>重试</button>
      </div>
    )
  }
  
  return (
    <div className="gitee-repo-list">
      {user && (
        <div className="user-info">
          <img src={user.avatar_url} alt={user.name} className="avatar" />
          <div className="user-details">
            <h2>{user.name}</h2>
            <p>@{user.login}</p>
            <div className="user-stats">
              <span>仓库: {user.public_repos}</span>
              <span>关注者: {user.followers}</span>
              <span>关注: {user.following}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="repo-section">
        <div className="section-header">
          <h3>创建新仓库</h3>
        </div>
        <CreateRepoForm onCreate={createRepo} loading={loading} />
      </div>
      
      <div className="repo-section">
        <div className="section-header">
          <h3>我的仓库 ({repos.length})</h3>
          <button onClick={fetchRepos} disabled={loading}>
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
        
        {loading && repos.length === 0 ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="repo-grid">
            {repos.map(repo => (
              <RepoCard 
                key={repo.id} 
                repo={repo} 
                onDelete={deleteRepo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GiteeRepoList
```

```css
/* src/components/GiteeRepoList.css */
.gitee-repo-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
}

.user-details h2 {
  margin: 0 0 4px 0;
}

.user-details p {
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.user-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.repo-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
}

.create-repo-form {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.create-repo-form input[type="text"] {
  flex: 1;
  min-width: 200px;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.repo-card {
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 16px;
  background: white;
  transition: box-shadow 0.2s;
}

.repo-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.repo-name {
  margin: 0;
  font-size: 16px;
}

.repo-name a {
  color: #0366d6;
  text-decoration: none;
}

.repo-name a:hover {
  text-decoration: underline;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.badge.public {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.private {
  background: #fff3e0;
  color: #e65100;
}

.repo-description {
  color: #586069;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.repo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #586069;
}

.language {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.repo-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: opacity 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background: #0366d6;
  color: white;
}

.btn-danger {
  background: #d32f2f;
  color: white;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-container {
  text-align: center;
  padding: 40px;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 16px;
}
```

### 5.6 React CI/CD 配置

```yaml
# .gitee-ci.yml
version: 1.0
name: react-pipeline

triggers:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

stages:
  - name: install
    image: node:18-alpine
    script:
      - npm ci
    cache:
      key: react-deps
      paths:
        - node_modules/

  - name: lint
    script:
      - npm run lint
    depends_on:
      - install

  - name: test
    script:
      - npm run test -- --coverage --watchAll=false
    depends_on:
      - install
    artifacts:
      paths:
        - coverage/

  - name: build
    script:
      - npm run build
    depends_on:
      - lint
      - test
    artifacts:
      paths:
        - dist/

  - name: deploy
    script:
      - ./deploy.sh
    depends_on:
      - build
    only:
      - main
```

### 5.7 React 部署脚本

```bash
#!/usr/bin/env sh
# deploy.sh

set -e

echo "🚀 开始部署 React 项目..."

# 构建
npm run build

# 进入构建目录
cd dist

# 创建 .nojekyll
touch .nojekyll

# 如果使用 React Router，创建 404.html
cp index.html 404.html

# 初始化 Git
git init
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# 推送
git push -f git@gitee.com:username/my-react-project.git main:gh-pages

cd -

echo "✅ 部署完成！"
```

---

## 6. 通用最佳实践

### 6.1 统一的提交规范

```json
// package.json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,less}": [
      "stylelint --fix"
    ]
  }
}
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'perf',     // 性能
        'test',     // 测试
        'chore',    // 构建
        'revert',   // 回滚
        'wip'       // 开发中
      ]
    ]
  }
}
```

### 6.2 环境变量管理

```bash
# .env.example（提交到Git，作为模板）
# Gitee API Token
VITE_GITEE_TOKEN=your_token_here

# API 基础地址
VITE_API_URL=http://localhost:3000

# 应用标题
VITE_APP_TITLE=My App
```

```gitignore
# .gitignore
.env.local
.env.*.local
```

### 6.3 分支保护与代码审查

```yaml
# 推荐的分支策略
main:
  - 保护分支，禁止直接推送
  - 必须通过 Pull Request 合并
  - 需要至少1人审核通过
  - CI 检查必须通过

develop:
  - 开发主分支
  - 功能分支合并目标

feature/*:
  - 功能开发分支
  - 从 develop 创建
  - 合并回 develop

hotfix/*:
  - 紧急修复分支
  - 从 main 创建
  - 同时合并到 main 和 develop
```

### 6.4 自动化版本发布

```json
// package.json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch"
  }
}
```

```javascript
// .versionrc.js
module.exports = {
  types: [
    { type: 'feat', section: '✨ Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'docs', section: '📚 Documentation' },
    { type: 'style', section: '💄 Styles' },
    { type: 'refactor', section: '♻️ Code Refactoring' },
    { type: 'perf', section: '⚡ Performance' },
    { type: 'test', section: '✅ Tests' },
    { type: 'chore', section: '🔧 Chores' }
  ]
}
```

### 6.5 多环境部署配置

```javascript
// deploy.config.js
module.exports = {
  development: {
    branch: 'develop',
    server: 'dev.example.com',
    path: '/var/www/dev'
  },
  staging: {
    branch: 'staging',
    server: 'staging.example.com',
    path: '/var/www/staging'
  },
  production: {
    branch: 'main',
    server: 'example.com',
    path: '/var/www/production'
  }
}
```

---

## 附录：框架对比速查表

| 特性 | Vue2 | Vue3 | Vue3+TS | React |
|------|------|------|---------|-------|
| 构建工具 | webpack | Vite | Vite | Vite/CRA |
| 配置文件 | vue.config.js | vite.config.js | vite.config.ts | vite.config.ts |
| 环境变量前缀 | VUE_APP_ | VITE_ | VITE_ | VITE_ |
| 状态管理 | Vuex | Pinia | Pinia | Redux/Zustand |
| 组件写法 | Options API | Composition API | Composition API | Hooks |
| 类型支持 | 有限 | 完善 | 完善 | 完善 |
| 部署目录 | dist | dist | dist | dist/build |

---

> 文档版本：v1.0  
> 更新时间：2024年  
> 适用于：Vue2/Vue3/Vue3+TS/React 所有版本
