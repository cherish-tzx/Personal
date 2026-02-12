# UniApp 完整语法详解
<div class="doc-toc">
## 目录
1. [UniApp 简介](#1-uniapp-简介)
2. [环境搭建与项目创建](#2-环境搭建与项目创建)
3. [项目结构详解](#3-项目结构详解)
4. [页面与组件](#4-页面与组件)
5. [生命周期](#5-生命周期)
6. [模板语法](#6-模板语法)
7. [数据绑定与事件](#7-数据绑定与事件)
8. [条件编译](#8-条件编译)
9. [内置组件](#9-内置组件)
10. [API 系统](#10-api-系统)
11. [路由与导航](#11-路由与导航)
12. [网络请求](#12-网络请求)
13. [数据存储](#13-数据存储)
14. [样式系统](#14-样式系统)
15. [状态管理](#15-状态管理)
16. [原生能力](#16-原生能力)
17. [插件与扩展](#17-插件与扩展)
18. [性能优化](#18-性能优化)
19. [调试与发布](#19-调试与发布)


</div>

---

## 1. UniApp 简介

### 1.1 什么是 UniApp

UniApp 是 DCloud 公司开发的使用 Vue.js 开发跨平台应用的前端框架，一套代码可以编译到 iOS、Android、Web、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉/淘宝）、快应用等多个平台。

### 1.2 核心特点

- **跨平台**：一套代码，多端运行
- **Vue 语法**：使用 Vue.js 语法，学习成本低
- **丰富的组件**：内置大量跨平台 UI 组件
- **强大的 API**：封装了丰富的跨平台 API
- **条件编译**：灵活处理各平台差异
- **插件市场**：丰富的插件生态

### 1.3 支持的平台

```javascript
// UniApp 支持的平台
const platforms = {
  app: ['iOS', 'Android'],
  web: ['H5'],
  miniProgram: [
    '微信小程序',
    '支付宝小程序',
    '百度小程序',
    '字节跳动小程序',
    'QQ小程序',
    '钉钉小程序',
    '快手小程序',
    '飞书小程序',
    '京东小程序'
  ],
  quickApp: ['快应用']
}
```

### 1.4 与其他框架对比

| 特性 | UniApp | React Native | Flutter | Taro |
|------|--------|--------------|---------|------|
| 开发语言 | Vue.js | React | Dart | React/Vue |
| 小程序支持 | ✅ 全面 | ❌ | ❌ | ✅ |
| App 性能 | 良好 | 优秀 | 优秀 | 一般 |
| 学习成本 | 低 | 中 | 高 | 中 |
| 生态丰富度 | 丰富 | 丰富 | 增长中 | 中等 |

---

## 2. 环境搭建与项目创建

### 2.1 开发工具安装

```bash
# 方式一：使用 HBuilderX（推荐）
# 下载地址：https://www.dcloud.io/hbuilderx.html
# 选择 App 开发版，内置相关插件

# 方式二：使用 CLI 创建
# 安装 Node.js (>= 12.0)
node --version

# 全局安装 vue-cli
npm install -g @vue/cli

# 创建 uni-app 项目
vue create -p dcloudio/uni-preset-vue my-project
```

### 2.2 创建项目

```bash
# 使用 Vue3 + Vite 创建（推荐）
npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project

# 使用 Vue2 创建
vue create -p dcloudio/uni-preset-vue my-vue2-project

# 进入项目
cd my-project

# 安装依赖
npm install

# 运行到 H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到 App
npm run dev:app
```

### 2.3 项目配置选项

```javascript
// 创建项目时的选项
const projectOptions = {
  // 模板选择
  templates: [
    '默认模板',
    '默认模板(TypeScript)',
    'Hello uni-app',
    '前后一体登录模板',
    'uni-starter',
    'uni-admin'
  ],
  
  // Vue 版本
  vueVersion: ['Vue2', 'Vue3'],
  
  // 编译器
  compiler: ['Vite', 'Webpack']
}
```

---

## 3. 项目结构详解

### 3.1 标准项目结构

```
my-project/
├── pages/                    # 页面目录
│   ├── index/
│   │   └── index.vue        # 首页
│   └── user/
│       └── user.vue         # 用户页
├── components/              # 组件目录
│   └── my-component.vue
├── static/                  # 静态资源目录
│   ├── images/
│   └── fonts/
├── store/                   # Vuex/Pinia 状态管理
│   └── index.js
├── utils/                   # 工具函数
│   └── request.js
├── api/                     # API 接口
│   └── user.js
├── uni_modules/             # uni_modules 插件目录
├── platforms/               # 各平台专用目录
│   ├── app-plus/
│   ├── h5/
│   └── mp-weixin/
├── App.vue                  # 应用入口组件
├── main.js                  # 应用入口文件
├── manifest.json            # 应用配置文件
├── pages.json               # 页面配置文件
├── uni.scss                 # 全局样式变量
└── package.json
```

### 3.2 manifest.json 配置详解

```json
{
  "name": "我的应用",
  "appid": "__UNI__XXXXXX",
  "description": "应用描述",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    },
    "modules": {
      "Payment": {},
      "Share": {},
      "Push": {}
    },
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.CAMERA\"/>",
          "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\"/>"
        ],
        "minSdkVersion": 21,
        "targetSdkVersion": 30
      },
      "ios": {
        "privacyDescription": {
          "NSCameraUsageDescription": "用于拍照上传",
          "NSPhotoLibraryUsageDescription": "用于选择图片上传"
        }
      }
    }
  },
  
  "mp-weixin": {
    "appid": "wx1234567890",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "optimization": {
      "subPackages": true
    }
  },
  
  "mp-alipay": {
    "usingComponents": true
  },
  
  "h5": {
    "devServer": {
      "port": 8080,
      "proxy": {
        "/api": {
          "target": "http://localhost:3000",
          "changeOrigin": true,
          "pathRewrite": {
            "^/api": ""
          }
        }
      }
    },
    "router": {
      "mode": "history",
      "base": "/"
    },
    "title": "我的H5应用"
  }
}
```

### 3.3 pages.json 配置详解

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
      "^my-(.*)": "@/components/my-$1.vue"
    }
  },
  
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "navigationBarBackgroundColor": "#007AFF",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true,
        "backgroundTextStyle": "dark",
        "onReachBottomDistance": 50,
        "app-plus": {
          "titleNView": {
            "buttons": [
              {
                "text": "\ue534",
                "fontSrc": "/static/uni.ttf",
                "fontSize": "22px",
                "float": "right"
              }
            ]
          },
          "bounce": "none"
        },
        "mp-weixin": {
          "navigationStyle": "custom"
        },
        "h5": {
          "pullToRefresh": {
            "color": "#007AFF"
          }
        }
      }
    },
    {
      "path": "pages/user/user",
      "style": {
        "navigationBarTitleText": "个人中心",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "详情",
        "app-plus": {
          "bounce": "vertical"
        }
      }
    }
  ],
  
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "UniApp",
    "navigationBarBackgroundColor": "#FFFFFF",
    "backgroundColor": "#F8F8F8",
    "backgroundTextStyle": "dark",
    "app-plus": {
      "background": "#efeff4"
    }
  },
  
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#007AFF",
    "borderStyle": "black",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tab/home.png",
        "selectedIconPath": "static/tab/home-active.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类",
        "iconPath": "static/tab/category.png",
        "selectedIconPath": "static/tab/category-active.png"
      },
      {
        "pagePath": "pages/cart/cart",
        "text": "购物车",
        "iconPath": "static/tab/cart.png",
        "selectedIconPath": "static/tab/cart-active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "static/tab/user.png",
        "selectedIconPath": "static/tab/user-active.png"
      }
    ]
  },
  
  "subPackages": [
    {
      "root": "pagesA",
      "pages": [
        {
          "path": "list/list",
          "style": {
            "navigationBarTitleText": "列表页"
          }
        }
      ]
    },
    {
      "root": "pagesB",
      "pages": [
        {
          "path": "detail/detail",
          "style": {
            "navigationBarTitleText": "详情页"
          }
        }
      ]
    }
  ],
  
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pagesA"]
    }
  },
  
  "condition": {
    "current": 0,
    "list": [
      {
        "name": "详情页",
        "path": "pages/detail/detail",
        "query": "id=1"
      }
    ]
  }
}
```

---

## 4. 页面与组件

### 4.1 页面基本结构

```vue
<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ title }}</text>
    </view>
    <view class="content">
      <my-component :data="list" @click="handleClick"></my-component>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '页面标题',
      list: []
    }
  },
  
  // 页面生命周期
  onLoad(options) {
    console.log('页面加载', options)
    this.loadData()
  },
  
  onShow() {
    console.log('页面显示')
  },
  
  onReady() {
    console.log('页面初次渲染完成')
  },
  
  onHide() {
    console.log('页面隐藏')
  },
  
  onUnload() {
    console.log('页面卸载')
  },
  
  // 页面事件处理
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.loadData().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  
  onReachBottom() {
    console.log('触底加载')
    this.loadMore()
  },
  
  onPageScroll(e) {
    console.log('页面滚动', e.scrollTop)
  },
  
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index'
    }
  },
  
  methods: {
    async loadData() {
      // 加载数据
    },
    
    handleClick(item) {
      console.log('点击', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  
  .header {
    margin-bottom: 20rpx;
    
    .title {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
  
  .content {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
  }
}
</style>
```

### 4.2 Vue3 Composition API 写法

```vue
<template>
  <view class="container">
    <text>{{ count }}</text>
    <button @click="increment">增加</button>
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onLoad, onShow, onReady, onPullDownRefresh } from '@dcloudio/uni-app'

// 响应式数据
const count = ref(0)
const list = reactive([])

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

const loadData = async () => {
  const res = await uni.request({
    url: '/api/list'
  })
  list.push(...res.data)
}

// 监听器
watch(count, (newVal, oldVal) => {
  console.log('count changed:', newVal)
})

// Vue 生命周期
onMounted(() => {
  console.log('组件挂载完成')
})

// UniApp 页面生命周期
onLoad((options) => {
  console.log('页面加载', options)
  loadData()
})

onShow(() => {
  console.log('页面显示')
})

onReady(() => {
  console.log('页面渲染完成')
})

onPullDownRefresh(() => {
  loadData().then(() => {
    uni.stopPullDownRefresh()
  })
})
</script>
```

### 4.3 组件定义与使用

```vue
<!-- components/product-card.vue -->
<template>
  <view class="product-card" @click="handleClick">
    <image class="product-image" :src="product.image" mode="aspectFill"></image>
    <view class="product-info">
      <text class="product-name">{{ product.name }}</text>
      <text class="product-price">¥{{ product.price }}</text>
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductCard',
  
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({})
    },
    showPrice: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['click', 'add-cart'],
  
  methods: {
    handleClick() {
      this.$emit('click', this.product)
    },
    
    addToCart() {
      this.$emit('add-cart', this.product)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  
  .product-image {
    width: 100%;
    height: 300rpx;
  }
  
  .product-info {
    padding: 20rpx;
    
    .product-name {
      font-size: 28rpx;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-price {
      font-size: 32rpx;
      color: #e4393c;
      font-weight: bold;
      margin-top: 10rpx;
    }
  }
}
</style>
```

```vue
<!-- 使用组件 -->
<template>
  <view>
    <product-card 
      v-for="item in products" 
      :key="item.id"
      :product="item"
      @click="goDetail"
      @add-cart="addToCart"
    >
      <template #footer>
        <button size="mini" @click.stop="addToCart(item)">加入购物车</button>
      </template>
    </product-card>
  </view>
</template>

<script>
import ProductCard from '@/components/product-card.vue'

export default {
  components: {
    ProductCard
  },
  
  data() {
    return {
      products: []
    }
  },
  
  methods: {
    goDetail(product) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${product.id}`
      })
    },
    
    addToCart(product) {
      // 添加购物车逻辑
    }
  }
}
</script>
```

### 4.4 easycom 组件自动导入

```json
// pages.json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      // uni-ui 组件
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
      // 自定义组件（符合规范自动导入）
      "^my-(.*)": "@/components/my-$1/my-$1.vue",
      // 第三方组件
      "^uview-(.*)": "uview-ui/components/u-$1/u-$1.vue"
    }
  }
}
```

```vue
<!-- 无需 import，直接使用 -->
<template>
  <view>
    <!-- uni-ui 组件 -->
    <uni-badge text="99+" type="error"></uni-badge>
    <uni-icons type="search" size="24"></uni-icons>
    
    <!-- 自定义组件 -->
    <my-header title="标题"></my-header>
    <my-list :data="list"></my-list>
  </view>
</template>
```

---

## 5. 生命周期

### 5.1 应用生命周期

```javascript
// App.vue
export default {
  // 应用初始化完成时触发（全局只触发一次）
  onLaunch(options) {
    console.log('App Launch')
    console.log('启动参数:', options)
    
    // 检查更新
    this.checkUpdate()
    
    // 初始化全局数据
    this.initGlobalData()
    
    // 登录状态检查
    this.checkLoginStatus()
  },
  
  // 应用从后台进入前台
  onShow(options) {
    console.log('App Show')
    console.log('场景值:', options.scene)
    
    // 处理启动参数
    if (options.query && options.query.inviteCode) {
      this.handleInvite(options.query.inviteCode)
    }
  },
  
  // 应用从前台进入后台
  onHide() {
    console.log('App Hide')
    
    // 保存用户状态
    this.saveUserState()
  },
  
  // 应用发生错误时触发
  onError(err) {
    console.error('App Error:', err)
    
    // 上报错误
    this.reportError(err)
  },
  
  // 应用启动或从后台进入前台时触发
  onUniNViewMessage(e) {
    console.log('收到 nvue 页面消息:', e)
  },
  
  // 未处理的 Promise 拒绝事件
  onUnhandledRejection(e) {
    console.error('Unhandled Rejection:', e)
  },
  
  // 页面不存在时触发
  onPageNotFound(options) {
    console.log('Page Not Found:', options.path)
    uni.redirectTo({
      url: '/pages/404/404'
    })
  },
  
  methods: {
    checkUpdate() {
      // #ifdef MP-WEIXIN
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        console.log('是否有新版本:', res.hasUpdate)
      })
      updateManager.onUpdateReady(() => {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      // #endif
    },
    
    initGlobalData() {
      this.globalData = {
        userInfo: null,
        systemInfo: uni.getSystemInfoSync()
      }
    },
    
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      if (!token) {
        // 未登录，跳转登录页
      }
    }
  }
}
```

### 5.2 页面生命周期

```vue
<script>
export default {
  data() {
    return {
      pageData: null
    }
  },
  
  // ========== 页面生命周期 ==========
  
  // 页面加载时触发，只触发一次
  // options: 页面参数
  onLoad(options) {
    console.log('onLoad - 页面加载')
    console.log('页面参数:', options)
    
    // 获取页面参数
    this.id = options.id
    
    // 初始化数据
    this.initData()
  },
  
  // 页面显示时触发，每次显示都会触发
  onShow() {
    console.log('onShow - 页面显示')
    
    // 刷新数据
    this.refreshData()
  },
  
  // 页面初次渲染完成时触发，只触发一次
  onReady() {
    console.log('onReady - 页面渲染完成')
    
    // 可以操作 DOM 了
    this.bindEvents()
  },
  
  // 页面隐藏时触发
  onHide() {
    console.log('onHide - 页面隐藏')
    
    // 暂停视频、音频等
    this.pauseMedia()
  },
  
  // 页面卸载时触发
  onUnload() {
    console.log('onUnload - 页面卸载')
    
    // 清理定时器、事件监听等
    this.cleanup()
  },
  
  // ========== 页面事件处理函数 ==========
  
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreshData().finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  
  // 触底加载
  onReachBottom() {
    console.log('触底加载')
    if (!this.isLoading && this.hasMore) {
      this.loadMore()
    }
  },
  
  // 页面滚动
  onPageScroll(e) {
    // e.scrollTop: 滚动距离
    this.showBackTop = e.scrollTop > 300
  },
  
  // 页面尺寸变化（横竖屏切换）
  onResize(e) {
    console.log('页面尺寸变化:', e.size)
  },
  
  // 点击 TabBar 时触发
  onTabItemTap(e) {
    console.log('点击 TabBar:', e)
    // e.index: 索引
    // e.pagePath: 页面路径
    // e.text: 文字
  },
  
  // ========== 分享相关 ==========
  
  // 分享给朋友
  onShareAppMessage(options) {
    console.log('分享来源:', options.from)
    // options.from: 'button' 或 'menu'
    // options.target: 触发分享的按钮
    
    return {
      title: '分享标题',
      path: '/pages/index/index?id=' + this.id,
      imageUrl: '/static/share.png'
    }
  },
  
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '分享标题',
      query: 'id=' + this.id,
      imageUrl: '/static/share.png'
    }
  },
  
  // 点击收藏
  onAddToFavorites(options) {
    return {
      title: '收藏标题',
      imageUrl: '/static/favicon.png',
      query: 'id=' + this.id
    }
  },
  
  // ========== 其他事件 ==========
  
  // 返回按钮点击（App 端）
  onBackPress(options) {
    console.log('返回按钮点击:', options.from)
    // options.from: 'backbutton' 或 'navigateBack'
    
    // 返回 true 阻止默认返回行为
    if (this.hasUnsavedData) {
      uni.showModal({
        title: '提示',
        content: '数据未保存，确定返回吗？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack()
          }
        }
      })
      return true
    }
    return false
  },
  
  // 键盘高度变化（App 端）
  onKeyboardHeight(e) {
    console.log('键盘高度:', e.height)
  },
  
  // 导航栏按钮点击
  onNavigationBarButtonTap(e) {
    console.log('导航栏按钮点击:', e.index)
  },
  
  // 导航栏搜索框输入
  onNavigationBarSearchInputChanged(e) {
    console.log('搜索输入:', e.text)
  },
  
  methods: {
    initData() {},
    refreshData() {},
    loadMore() {},
    pauseMedia() {},
    cleanup() {},
    bindEvents() {}
  }
}
</script>
```

### 5.3 组件生命周期

```vue
<script>
export default {
  // 组件属性
  props: {
    title: String
  },
  
  data() {
    return {
      localData: null
    }
  },
  
  // ========== Vue2 组件生命周期 ==========
  
  beforeCreate() {
    console.log('beforeCreate - 实例初始化之前')
    // 此时 data 和 methods 还不可用
  },
  
  created() {
    console.log('created - 实例创建完成')
    // 可以访问 data 和 methods
    // 常用于初始化数据
    this.initData()
  },
  
  beforeMount() {
    console.log('beforeMount - 挂载之前')
  },
  
  mounted() {
    console.log('mounted - 挂载完成')
    // 可以访问 DOM
    // 常用于初始化第三方库
  },
  
  beforeUpdate() {
    console.log('beforeUpdate - 更新之前')
  },
  
  updated() {
    console.log('updated - 更新完成')
  },
  
  beforeDestroy() {
    console.log('beforeDestroy - 销毁之前')
    // 清理工作：取消订阅、清除定时器等
  },
  
  destroyed() {
    console.log('destroyed - 销毁完成')
  },
  
  // ========== 其他生命周期 ==========
  
  activated() {
    console.log('activated - keep-alive 组件激活')
  },
  
  deactivated() {
    console.log('deactivated - keep-alive 组件停用')
  },
  
  errorCaptured(err, vm, info) {
    console.log('errorCaptured - 捕获子组件错误')
    // 返回 false 阻止错误继续传播
    return false
  }
}
</script>
```

### 5.4 Vue3 生命周期

```vue
<script setup>
import { 
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue'

import {
  onLoad,
  onShow,
  onReady,
  onHide,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
  onPageScroll,
  onShareAppMessage,
  onShareTimeline
} from '@dcloudio/uni-app'

// ========== Vue3 生命周期 ==========

onBeforeMount(() => {
  console.log('onBeforeMount')
})

onMounted(() => {
  console.log('onMounted')
})

onBeforeUpdate(() => {
  console.log('onBeforeUpdate')
})

onUpdated(() => {
  console.log('onUpdated')
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount')
})

onUnmounted(() => {
  console.log('onUnmounted')
})

onActivated(() => {
  console.log('onActivated')
})

onDeactivated(() => {
  console.log('onDeactivated')
})

onErrorCaptured((err, instance, info) => {
  console.log('onErrorCaptured', err)
  return false
})

// ========== UniApp 页面生命周期 ==========

onLoad((options) => {
  console.log('页面加载', options)
})

onShow(() => {
  console.log('页面显示')
})

onReady(() => {
  console.log('页面渲染完成')
})

onHide(() => {
  console.log('页面隐藏')
})

onUnload(() => {
  console.log('页面卸载')
})

onPullDownRefresh(() => {
  console.log('下拉刷新')
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  console.log('触底加载')
})

onPageScroll((e) => {
  console.log('滚动距离:', e.scrollTop)
})

onShareAppMessage(() => {
  return {
    title: '分享标题',
    path: '/pages/index/index'
  }
})

onShareTimeline(() => {
  return {
    title: '朋友圈分享标题'
  }
})
</script>
```

---

## 6. 模板语法

### 6.1 数据绑定

```vue
<template>
  <view>
    <!-- 文本插值 -->
    <text>{{ message }}</text>
    <text>{{ message.split('').reverse().join('') }}</text>
    
    <!-- 属性绑定 -->
    <image :src="imageUrl"></image>
    <view :class="className"></view>
    <view :style="styleObject"></view>
    <button :disabled="isDisabled">按钮</button>
    
    <!-- 动态属性名 -->
    <view :[attrName]="attrValue"></view>
    
    <!-- 多属性绑定 -->
    <view v-bind="attrs"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello UniApp',
      imageUrl: '/static/logo.png',
      className: 'active',
      isDisabled: false,
      attrName: 'id',
      attrValue: 'myId',
      styleObject: {
        color: 'red',
        fontSize: '28rpx'
      },
      attrs: {
        id: 'container',
        class: 'wrapper'
      }
    }
  }
}
</script>
```

### 6.2 条件渲染

```vue
<template>
  <view>
    <!-- v-if / v-else-if / v-else -->
    <view v-if="type === 'A'">Type A</view>
    <view v-else-if="type === 'B'">Type B</view>
    <view v-else>Other Type</view>
    
    <!-- v-show（切换 display） -->
    <view v-show="isVisible">可见内容</view>
    
    <!-- template 上使用 v-if -->
    <template v-if="showGroup">
      <view>标题</view>
      <view>内容</view>
    </template>
    
    <!-- 带 key 的条件渲染 -->
    <template v-if="loginType === 'username'">
      <text>用户名</text>
      <input key="username-input" placeholder="请输入用户名" />
    </template>
    <template v-else>
      <text>邮箱</text>
      <input key="email-input" placeholder="请输入邮箱" />
    </template>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 'A',
      isVisible: true,
      showGroup: true,
      loginType: 'username'
    }
  }
}
</script>
```

### 6.3 列表渲染

```vue
<template>
  <view>
    <!-- 基本列表渲染 -->
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
    
    <!-- 带索引 -->
    <view v-for="(item, index) in list" :key="item.id">
      {{ index }} - {{ item.name }}
    </view>
    
    <!-- 遍历对象 -->
    <view v-for="(value, key, index) in object" :key="key">
      {{ index }}. {{ key }}: {{ value }}
    </view>
    
    <!-- 遍历数字范围 -->
    <view v-for="n in 10" :key="n">
      {{ n }}
    </view>
    
    <!-- template 上使用 v-for -->
    <template v-for="item in list" :key="item.id">
      <view class="title">{{ item.title }}</view>
      <view class="content">{{ item.content }}</view>
    </template>
    
    <!-- v-for 与 v-if 结合（Vue3 中 v-if 优先级更高） -->
    <template v-for="item in list" :key="item.id">
      <view v-if="item.visible">
        {{ item.name }}
      </view>
    </template>
    
    <!-- 组件上使用 v-for -->
    <my-component
      v-for="item in list"
      :key="item.id"
      :data="item"
      @click="handleClick(item)"
    ></my-component>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, name: 'Item 1', title: 'Title 1', content: 'Content 1', visible: true },
        { id: 2, name: 'Item 2', title: 'Title 2', content: 'Content 2', visible: false },
        { id: 3, name: 'Item 3', title: 'Title 3', content: 'Content 3', visible: true }
      ],
      object: {
        name: '张三',
        age: 25,
        city: '北京'
      }
    }
  }
}
</script>
```

### 6.4 事件处理

```vue
<template>
  <view>
    <!-- 基本事件绑定 -->
    <button @click="handleClick">点击</button>
    <button v-on:click="handleClick">点击</button>
    
    <!-- 内联语句 -->
    <button @click="count++">{{ count }}</button>
    <button @click="say('hello')">Say Hello</button>
    
    <!-- 访问事件对象 -->
    <button @click="handleClick($event)">点击</button>
    <input @input="onInput($event)" />
    
    <!-- 事件修饰符 -->
    <view @click.stop="handleClick">阻止冒泡</view>
    <view @click.prevent="handleClick">阻止默认</view>
    <view @click.capture="handleClick">捕获模式</view>
    <view @click.self="handleClick">仅自身触发</view>
    <view @click.once="handleClick">只触发一次</view>
    
    <!-- 多个修饰符 -->
    <view @click.stop.prevent="handleClick">多个修饰符</view>
    
    <!-- 按键修饰符（H5 端） -->
    <input @keyup.enter="submit" />
    <input @keyup.esc="cancel" />
    <input @keydown.ctrl.s="save" />
    
    <!-- 触摸事件 -->
    <view 
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
    >
      触摸区域
    </view>
    
    <!-- 长按事件 -->
    <view @longpress="onLongPress">长按</view>
    <view @longtap="onLongTap">长按（兼容）</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  
  methods: {
    handleClick(e) {
      console.log('点击事件', e)
    },
    
    say(msg) {
      console.log(msg)
    },
    
    onInput(e) {
      console.log('输入值:', e.detail.value)
    },
    
    onTouchStart(e) {
      console.log('触摸开始', e.touches)
    },
    
    onTouchMove(e) {
      console.log('触摸移动', e.touches)
    },
    
    onTouchEnd(e) {
      console.log('触摸结束', e.changedTouches)
    },
    
    onTouchCancel(e) {
      console.log('触摸取消')
    },
    
    onLongPress(e) {
      console.log('长按事件')
    },
    
    submit() {
      console.log('提交')
    },
    
    cancel() {
      console.log('取消')
    },
    
    save() {
      console.log('保存')
    }
  }
}
</script>
```

### 6.5 表单绑定

```vue
<template>
  <view class="form">
    <!-- 文本输入 -->
    <input v-model="form.username" placeholder="用户名" />
    
    <!-- 密码输入 -->
    <input v-model="form.password" type="password" placeholder="密码" />
    
    <!-- 数字输入 -->
    <input v-model.number="form.age" type="number" placeholder="年龄" />
    
    <!-- 去除首尾空格 -->
    <input v-model.trim="form.name" placeholder="姓名" />
    
    <!-- 多行文本 -->
    <textarea v-model="form.description" placeholder="描述"></textarea>
    
    <!-- 单选框 -->
    <radio-group @change="onGenderChange">
      <label>
        <radio value="male" :checked="form.gender === 'male'" />男
      </label>
      <label>
        <radio value="female" :checked="form.gender === 'female'" />女
      </label>
    </radio-group>
    
    <!-- 复选框 -->
    <checkbox-group @change="onHobbyChange">
      <label v-for="item in hobbies" :key="item.value">
        <checkbox :value="item.value" :checked="form.hobbies.includes(item.value)" />
        {{ item.label }}
      </label>
    </checkbox-group>
    
    <!-- 选择器 -->
    <picker mode="selector" :range="cities" @change="onCityChange">
      <view>当前选择：{{ cities[form.cityIndex] || '请选择' }}</view>
    </picker>
    
    <!-- 日期选择器 -->
    <picker mode="date" :value="form.date" @change="onDateChange">
      <view>日期：{{ form.date || '请选择' }}</view>
    </picker>
    
    <!-- 时间选择器 -->
    <picker mode="time" :value="form.time" @change="onTimeChange">
      <view>时间：{{ form.time || '请选择' }}</view>
    </picker>
    
    <!-- 多列选择器 -->
    <picker 
      mode="multiSelector" 
      :range="multiArray"
      :value="form.multiIndex"
      @change="onMultiChange"
      @columnchange="onColumnChange"
    >
      <view>地区：{{ selectedArea }}</view>
    </picker>
    
    <!-- 开关 -->
    <switch :checked="form.agree" @change="onSwitchChange" />
    
    <!-- 滑块 -->
    <slider 
      :value="form.volume" 
      :min="0" 
      :max="100" 
      @change="onSliderChange"
      show-value
    />
    
    <button @click="submit">提交</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        age: null,
        name: '',
        description: '',
        gender: 'male',
        hobbies: [],
        cityIndex: 0,
        date: '',
        time: '',
        multiIndex: [0, 0, 0],
        agree: false,
        volume: 50
      },
      hobbies: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' }
      ],
      cities: ['北京', '上海', '广州', '深圳'],
      multiArray: [
        ['广东省', '湖南省'],
        ['广州市', '深圳市'],
        ['天河区', '番禺区']
      ]
    }
  },
  
  computed: {
    selectedArea() {
      const [p, c, d] = this.form.multiIndex
      return `${this.multiArray[0][p]} ${this.multiArray[1][c]} ${this.multiArray[2][d]}`
    }
  },
  
  methods: {
    onGenderChange(e) {
      this.form.gender = e.detail.value
    },
    
    onHobbyChange(e) {
      this.form.hobbies = e.detail.value
    },
    
    onCityChange(e) {
      this.form.cityIndex = e.detail.value
    },
    
    onDateChange(e) {
      this.form.date = e.detail.value
    },
    
    onTimeChange(e) {
      this.form.time = e.detail.value
    },
    
    onMultiChange(e) {
      this.form.multiIndex = e.detail.value
    },
    
    onColumnChange(e) {
      console.log('列变化:', e.detail.column, e.detail.value)
      // 联动逻辑
    },
    
    onSwitchChange(e) {
      this.form.agree = e.detail.value
    },
    
    onSliderChange(e) {
      this.form.volume = e.detail.value
    },
    
    submit() {
      console.log('表单数据:', this.form)
    }
  }
}
</script>
```

### 6.6 Class 与 Style 绑定

```vue
<template>
  <view>
    <!-- Class 绑定 -->
    
    <!-- 对象语法 -->
    <view :class="{ active: isActive, 'text-danger': hasError }">对象语法</view>
    
    <!-- 绑定对象 -->
    <view :class="classObject">绑定对象</view>
    
    <!-- 数组语法 -->
    <view :class="[activeClass, errorClass]">数组语法</view>
    
    <!-- 数组中使用对象 -->
    <view :class="[{ active: isActive }, errorClass]">混合语法</view>
    
    <!-- 三元表达式 -->
    <view :class="[isActive ? 'active' : '', errorClass]">三元表达式</view>
    
    <!-- 计算属性 -->
    <view :class="computedClass">计算属性</view>
    
    <!-- Style 绑定 -->
    
    <!-- 对象语法 -->
    <view :style="{ color: activeColor, fontSize: fontSize + 'rpx' }">对象语法</view>
    
    <!-- 绑定对象 -->
    <view :style="styleObject">绑定对象</view>
    
    <!-- 数组语法 -->
    <view :style="[baseStyles, overridingStyles]">数组语法</view>
    
    <!-- 自动前缀 -->
    <view :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }">自动前缀</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      activeClass: 'active',
      errorClass: 'text-danger',
      classObject: {
        active: true,
        'text-danger': false
      },
      activeColor: 'red',
      fontSize: 28,
      styleObject: {
        color: 'red',
        fontSize: '28rpx',
        fontWeight: 'bold'
      },
      baseStyles: {
        color: 'blue',
        fontSize: '24rpx'
      },
      overridingStyles: {
        color: 'red'
      }
    }
  },
  
  computed: {
    computedClass() {
      return {
        active: this.isActive && !this.hasError,
        'text-danger': this.hasError,
        'text-success': !this.hasError
      }
    }
  }
}
</script>

<style>
.active {
  background-color: #007AFF;
  color: #fff;
}

.text-danger {
  color: #e4393c;
}

.text-success {
  color: #4cd964;
}
</style>
```

---

## 7. 数据绑定与事件

### 7.1 响应式数据

```vue
<script>
// Vue2 Options API
export default {
  data() {
    return {
      // 基本类型
      count: 0,
      message: 'Hello',
      isVisible: true,
      
      // 对象
      user: {
        name: '张三',
        age: 25,
        address: {
          city: '北京'
        }
      },
      
      // 数组
      list: [1, 2, 3],
      
      // 复杂数据
      products: []
    }
  },
  
  methods: {
    // 修改基本类型
    updateCount() {
      this.count++
    },
    
    // 修改对象属性
    updateUser() {
      this.user.name = '李四'
      this.user.address.city = '上海'
    },
    
    // 添加新属性（Vue2 需要使用 $set）
    addProperty() {
      this.$set(this.user, 'email', 'test@example.com')
    },
    
    // 删除属性
    deleteProperty() {
      this.$delete(this.user, 'age')
    },
    
    // 数组操作
    updateArray() {
      // 这些方法会触发更新
      this.list.push(4)
      this.list.pop()
      this.list.shift()
      this.list.unshift(0)
      this.list.splice(1, 1, 'new')
      this.list.sort()
      this.list.reverse()
      
      // 替换数组
      this.list = this.list.filter(item => item > 1)
      
      // 通过索引修改（Vue2 需要使用 $set）
      this.$set(this.list, 0, 'new value')
    }
  }
}
</script>
```

```vue
<script setup>
// Vue3 Composition API
import { ref, reactive, toRefs, toRef, readonly, shallowRef, shallowReactive } from 'vue'

// ref - 用于基本类型
const count = ref(0)
const message = ref('Hello')

// 修改 ref
count.value++
message.value = 'World'

// reactive - 用于对象
const user = reactive({
  name: '张三',
  age: 25,
  address: {
    city: '北京'
  }
})

// 修改 reactive 对象
user.name = '李四'
user.address.city = '上海'

// 添加新属性（Vue3 自动响应）
user.email = 'test@example.com'

// 删除属性
delete user.age

// 数组
const list = reactive([1, 2, 3])
list.push(4)
list[0] = 0  // Vue3 中可以直接通过索引修改

// toRefs - 解构保持响应式
const { name, age } = toRefs(user)

// toRef - 单个属性
const cityRef = toRef(user.address, 'city')

// readonly - 只读
const readonlyUser = readonly(user)

// shallowRef - 浅层响应式
const shallowState = shallowRef({ count: 0 })
shallowState.value = { count: 1 }  // 触发更新
shallowState.value.count = 2  // 不触发更新

// shallowReactive - 浅层响应式对象
const shallowUser = shallowReactive({
  name: '张三',
  address: {
    city: '北京'
  }
})
shallowUser.name = '李四'  // 触发更新
shallowUser.address.city = '上海'  // 不触发更新
</script>
```

### 7.2 计算属性

```vue
<script>
// Vue2 Options API
export default {
  data() {
    return {
      firstName: '张',
      lastName: '三',
      items: [
        { name: '商品1', price: 100, quantity: 2 },
        { name: '商品2', price: 200, quantity: 1 }
      ]
    }
  },
  
  computed: {
    // 基本计算属性
    fullName() {
      return this.firstName + this.lastName
    },
    
    // 带 getter 和 setter
    fullNameWithSetter: {
      get() {
        return this.firstName + this.lastName
      },
      set(value) {
        const names = value.split(' ')
        this.firstName = names[0]
        this.lastName = names[1] || ''
      }
    },
    
    // 复杂计算
    totalPrice() {
      return this.items.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
    },
    
    // 过滤列表
    expensiveItems() {
      return this.items.filter(item => item.price > 150)
    }
  }
}
</script>
```

```vue
<script setup>
// Vue3 Composition API
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')
const items = ref([
  { name: '商品1', price: 100, quantity: 2 },
  { name: '商品2', price: 200, quantity: 1 }
])

// 基本计算属性
const fullName = computed(() => firstName.value + lastName.value)

// 带 getter 和 setter
const fullNameWithSetter = computed({
  get: () => firstName.value + lastName.value,
  set: (value) => {
    const names = value.split(' ')
    firstName.value = names[0]
    lastName.value = names[1] || ''
  }
})

// 复杂计算
const totalPrice = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})

// 过滤列表
const expensiveItems = computed(() => {
  return items.value.filter(item => item.price > 150)
})
</script>
```

### 7.3 监听器

```vue
<script>
// Vue2 Options API
export default {
  data() {
    return {
      keyword: '',
      user: {
        name: '张三',
        profile: {
          age: 25
        }
      },
      items: []
    }
  },
  
  watch: {
    // 基本监听
    keyword(newVal, oldVal) {
      console.log('keyword changed:', newVal, oldVal)
      this.search(newVal)
    },
    
    // 立即执行
    items: {
      handler(newVal) {
        console.log('items changed:', newVal)
      },
      immediate: true
    },
    
    // 深度监听
    user: {
      handler(newVal) {
        console.log('user changed:', newVal)
      },
      deep: true
    },
    
    // 监听对象的某个属性
    'user.name'(newVal, oldVal) {
      console.log('user.name changed:', newVal)
    },
    
    // 监听嵌套属性
    'user.profile.age'(newVal) {
      console.log('age changed:', newVal)
    }
  },
  
  created() {
    // 动态添加监听器
    this.$watch('keyword', (newVal) => {
      console.log('dynamic watch:', newVal)
    })
    
    // 返回取消监听的函数
    const unwatch = this.$watch('items', () => {}, { deep: true })
    // 取消监听
    // unwatch()
  }
}
</script>
```

```vue
<script setup>
// Vue3 Composition API
import { ref, reactive, watch, watchEffect, watchPostEffect, watchSyncEffect } from 'vue'

const keyword = ref('')
const user = reactive({
  name: '张三',
  profile: {
    age: 25
  }
})
const items = ref([])

// 监听 ref
watch(keyword, (newVal, oldVal) => {
  console.log('keyword changed:', newVal, oldVal)
})

// 监听 reactive 对象（自动深度监听）
watch(user, (newVal) => {
  console.log('user changed:', newVal)
})

// 监听 reactive 对象的属性
watch(
  () => user.name,
  (newVal, oldVal) => {
    console.log('name changed:', newVal, oldVal)
  }
)

// 监听多个源
watch(
  [keyword, () => user.name],
  ([newKeyword, newName], [oldKeyword, oldName]) => {
    console.log('multiple changed:', newKeyword, newName)
  }
)

// 带选项
watch(
  items,
  (newVal) => {
    console.log('items changed:', newVal)
  },
  {
    immediate: true,  // 立即执行
    deep: true,       // 深度监听
    flush: 'post'     // 在 DOM 更新后执行
  }
)

// watchEffect - 自动追踪依赖
const stop = watchEffect(() => {
  console.log('keyword:', keyword.value)
  console.log('name:', user.name)
})
// 停止监听
// stop()

// watchEffect 带清理函数
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    // do something
  }, 1000)
  
  onCleanup(() => {
    clearTimeout(timer)
  })
})

// watchPostEffect - DOM 更新后执行
watchPostEffect(() => {
  // 可以访问更新后的 DOM
})

// watchSyncEffect - 同步执行
watchSyncEffect(() => {
  // 同步执行
})
</script>
```

### 7.4 事件通信

```vue
<!-- 父组件 Parent.vue -->
<template>
  <view>
    <child-component 
      :message="parentMessage"
      @child-event="handleChildEvent"
      @update:title="title = $event"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      parentMessage: 'Hello from parent',
      title: '标题'
    }
  },
  
  methods: {
    handleChildEvent(data) {
      console.log('收到子组件事件:', data)
    }
  }
}
</script>
```

```vue
<!-- 子组件 Child.vue -->
<template>
  <view>
    <text>{{ message }}</text>
    <button @click="sendToParent">发送给父组件</button>
    <input :value="title" @input="updateTitle" />
  </view>
</template>

<script>
export default {
  props: {
    message: String,
    title: String
  },
  
  emits: ['child-event', 'update:title'],
  
  methods: {
    sendToParent() {
      this.$emit('child-event', { data: 'from child' })
    },
    
    updateTitle(e) {
      this.$emit('update:title', e.detail.value)
    }
  }
}
</script>
```

```javascript
// 全局事件总线（Vue2）
// main.js
Vue.prototype.$bus = new Vue()

// 发送事件
this.$bus.$emit('event-name', data)

// 监听事件
this.$bus.$on('event-name', (data) => {
  console.log(data)
})

// 取消监听
this.$bus.$off('event-name')
```

```javascript
// UniApp 全局事件
// 发送事件
uni.$emit('login-success', { userId: 123 })

// 监听事件
uni.$on('login-success', (data) => {
  console.log('登录成功:', data)
})

// 监听一次
uni.$once('login-success', (data) => {
  console.log('只触发一次')
})

// 取消监听
uni.$off('login-success')

// 取消所有监听
uni.$off()
```

---

## 8. 条件编译

### 8.1 条件编译语法

```vue
<template>
  <view>
    <!-- #ifdef H5 -->
    <view>仅在 H5 端显示</view>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN -->
    <view>仅在微信小程序显示</view>
    <!-- #endif -->
    
    <!-- #ifdef APP-PLUS -->
    <view>仅在 App 端显示</view>
    <!-- #endif -->
    
    <!-- #ifndef H5 -->
    <view>除了 H5 端都显示</view>
    <!-- #endif -->
    
    <!-- #ifdef H5 || MP-WEIXIN -->
    <view>在 H5 或微信小程序显示</view>
    <!-- #endif -->
    
    <!-- #ifdef MP -->
    <view>所有小程序平台显示</view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      // #ifdef H5
      platform: 'H5',
      // #endif
      
      // #ifdef MP-WEIXIN
      platform: 'MP-WEIXIN',
      // #endif
      
      // #ifdef APP-PLUS
      platform: 'APP',
      // #endif
    }
  },
  
  methods: {
    getData() {
      // #ifdef H5
      this.getH5Data()
      // #endif
      
      // #ifdef MP-WEIXIN
      this.getWeixinData()
      // #endif
      
      // #ifdef APP-PLUS
      this.getAppData()
      // #endif
    },
    
    share() {
      // #ifdef MP-WEIXIN
      // 微信小程序分享
      // #endif
      
      // #ifdef APP-PLUS
      // App 分享
      plus.share.sendWithSystem({
        content: '分享内容'
      })
      // #endif
    }
  }
}
</script>

<style>
/* #ifdef H5 */
.container {
  max-width: 750px;
  margin: 0 auto;
}
/* #endif */

/* #ifdef MP-WEIXIN */
.container {
  padding-bottom: env(safe-area-inset-bottom);
}
/* #endif */

/* #ifdef APP-PLUS */
.container {
  padding-top: var(--status-bar-height);
}
/* #endif */
</style>
```

### 8.2 平台标识符

```javascript
// 完整的平台标识符列表
const platforms = {
  // App
  'APP-PLUS': 'App（包含 iOS 和 Android）',
  'APP-PLUS-NVUE': 'App nvue 页面',
  'APP-ANDROID': 'App Android 平台',
  'APP-IOS': 'App iOS 平台',
  
  // H5
  'H5': 'H5 网页',
  
  // 小程序
  'MP': '所有小程序',
  'MP-WEIXIN': '微信小程序',
  'MP-ALIPAY': '支付宝小程序',
  'MP-BAIDU': '百度小程序',
  'MP-TOUTIAO': '字节跳动小程序',
  'MP-QQ': 'QQ 小程序',
  'MP-KUAISHOU': '快手小程序',
  'MP-JD': '京东小程序',
  'MP-360': '360 小程序',
  
  // 快应用
  'QUICKAPP-WEBVIEW': '快应用通用',
  'QUICKAPP-WEBVIEW-UNION': '快应用联盟',
  'QUICKAPP-WEBVIEW-HUAWEI': '快应用华为'
}
```

### 8.3 条件编译实战示例

```vue
<template>
  <view class="container">
    <!-- 导航栏 - 各平台差异处理 -->
    <!-- #ifdef H5 -->
    <view class="custom-navbar">
      <text class="title">{{ title }}</text>
    </view>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN -->
    <view class="weixin-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="title">{{ title }}</text>
    </view>
    <!-- #endif -->
    
    <!-- 内容区域 -->
    <view class="content">
      <!-- 登录按钮 - 各平台差异 -->
      <!-- #ifdef MP-WEIXIN -->
      <button open-type="getUserInfo" @getuserinfo="wxLogin">微信登录</button>
      <!-- #endif -->
      
      <!-- #ifdef MP-ALIPAY -->
      <button open-type="getAuthorize" @getAuthorize="alipayLogin">支付宝登录</button>
      <!-- #endif -->
      
      <!-- #ifdef H5 -->
      <button @click="h5Login">账号登录</button>
      <!-- #endif -->
      
      <!-- #ifdef APP-PLUS -->
      <button @click="appleLogin" v-if="isIOS">Apple 登录</button>
      <button @click="oneKeyLogin">一键登录</button>
      <!-- #endif -->
    </view>
    
    <!-- 分享按钮 -->
    <!-- #ifdef MP-WEIXIN || MP-QQ -->
    <button open-type="share">分享给好友</button>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <button @click="h5Share">分享</button>
    <!-- #endif -->
    
    <!-- #ifdef APP-PLUS -->
    <button @click="appShare">分享</button>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '页面标题',
      // #ifdef MP-WEIXIN
      statusBarHeight: 0,
      // #endif
      // #ifdef APP-PLUS
      isIOS: false,
      // #endif
    }
  },
  
  onLoad() {
    // #ifdef MP-WEIXIN
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
    // #endif
    
    // #ifdef APP-PLUS
    this.isIOS = plus.os.name === 'iOS'
    // #endif
  },
  
  methods: {
    // #ifdef MP-WEIXIN
    wxLogin(e) {
      if (e.detail.userInfo) {
        console.log('微信登录成功', e.detail.userInfo)
      }
    },
    // #endif
    
    // #ifdef MP-ALIPAY
    alipayLogin(e) {
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          console.log('支付宝授权码', res.authCode)
        }
      })
    },
    // #endif
    
    // #ifdef H5
    h5Login() {
      // H5 登录逻辑
    },
    
    h5Share() {
      // H5 分享逻辑（可能需要调用第三方 SDK）
    },
    // #endif
    
    // #ifdef APP-PLUS
    appleLogin() {
      plus.oauth.getServices((services) => {
        const appleAuth = services.find(s => s.id === 'apple')
        if (appleAuth) {
          appleAuth.login(() => {
            console.log('Apple 登录成功')
          })
        }
      })
    },
    
    oneKeyLogin() {
      uni.preLogin({
        provider: 'univerify',
        success() {
          uni.login({
            provider: 'univerify',
            success(res) {
              console.log('一键登录成功', res)
            }
          })
        }
      })
    },
    
    appShare() {
      plus.share.sendWithSystem({
        type: 'text',
        content: '分享内容'
      })
    },
    // #endif
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  
  /* #ifdef H5 */
  .custom-navbar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #007AFF;
    color: #fff;
  }
  /* #endif */
  
  /* #ifdef MP-WEIXIN */
  .weixin-navbar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    background: #07c160;
    color: #fff;
  }
  /* #endif */
}
</style>
```

### 8.4 文件级条件编译

```
project/
├── pages/
│   ├── index/
│   │   ├── index.vue           # 通用页面
│   │   ├── index.h5.vue        # H5 专用
│   │   ├── index.mp-weixin.vue # 微信小程序专用
│   │   └── index.app-plus.vue  # App 专用
├── components/
│   ├── navbar/
│   │   ├── navbar.vue
│   │   ├── navbar.h5.vue
│   │   └── navbar.mp-weixin.vue
└── static/
    ├── logo.png
    ├── logo.h5.png
    └── logo.mp-weixin.png
```

---

## 9. 内置组件

### 9.1 视图容器组件

#### view - 视图容器

```vue
<template>
  <view>
    <!-- 基本使用 -->
    <view class="container">内容</view>
    
    <!-- 悬浮点击态 -->
    <view hover-class="hover-active" :hover-stay-time="400">
      点击有反馈
    </view>
    
    <!-- 阻止祖先元素点击态 -->
    <view hover-class="hover-parent">
      <view hover-class="hover-child" hover-stop-propagation>
        子元素
      </view>
    </view>
  </view>
</template>

<style>
.hover-active {
  opacity: 0.7;
  background-color: #f0f0f0;
}
</style>
```

#### scroll-view - 可滚动视图

```vue
<template>
  <view>
    <!-- 纵向滚动 -->
    <scroll-view 
      scroll-y 
      class="scroll-container"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
      :enable-back-to-top="true"
      @scroll="onScroll"
      @scrolltoupper="onScrollToUpper"
      @scrolltolower="onScrollToLower"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-for="item in list" :key="item.id" :id="'item-' + item.id">
        {{ item.name }}
      </view>
    </scroll-view>
    
    <!-- 横向滚动 -->
    <scroll-view scroll-x class="scroll-horizontal">
      <view class="scroll-item" v-for="i in 10" :key="i">{{ i }}</view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      scrollTop: 0,
      scrollIntoView: '',
      isRefreshing: false
    }
  },
  
  methods: {
    onScroll(e) {
      console.log('滚动距离:', e.detail.scrollTop)
    },
    
    onScrollToUpper() {
      console.log('滚动到顶部')
    },
    
    onScrollToLower() {
      console.log('滚动到底部，加载更多')
      this.loadMore()
    },
    
    onRefresh() {
      this.isRefreshing = true
      setTimeout(() => {
        this.isRefreshing = false
      }, 1000)
    },
    
    scrollToTop() {
      this.scrollTop = 0
    },
    
    scrollToItem(id) {
      this.scrollIntoView = 'item-' + id
    }
  }
}
</script>

<style>
.scroll-container {
  height: 500rpx;
}

.scroll-horizontal {
  white-space: nowrap;
}

.scroll-item {
  display: inline-block;
  width: 200rpx;
  height: 200rpx;
}
</style>
```

#### swiper - 滑块视图容器

```vue
<template>
  <view>
    <!-- 轮播图 -->
    <swiper 
      class="swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      indicator-color="rgba(255,255,255,0.5)"
      indicator-active-color="#ffffff"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item.image" mode="aspectFill" @click="onBannerClick(item)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 纵向滑动 -->
    <swiper class="swiper-vertical" vertical :autoplay="true">
      <swiper-item v-for="(item, index) in notices" :key="index">
        <text>{{ item.title }}</text>
      </swiper-item>
    </swiper>
    
    <!-- 卡片式轮播 -->
    <swiper 
      class="card-swiper"
      :previous-margin="'60rpx'"
      :next-margin="'60rpx'"
      :current="currentIndex"
      @change="onCardChange"
    >
      <swiper-item v-for="(item, index) in cards" :key="index">
        <view class="card" :class="{ active: currentIndex === index }">
          {{ item.title }}
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [
        { image: '/static/banner1.jpg', url: '/pages/detail/detail?id=1' },
        { image: '/static/banner2.jpg', url: '/pages/detail/detail?id=2' }
      ],
      notices: [
        { title: '通知1' },
        { title: '通知2' }
      ],
      cards: [
        { title: '卡片1' },
        { title: '卡片2' },
        { title: '卡片3' }
      ],
      currentIndex: 0
    }
  },
  
  methods: {
    onSwiperChange(e) {
      console.log('当前索引:', e.detail.current)
    },
    
    onBannerClick(item) {
      uni.navigateTo({ url: item.url })
    },
    
    onCardChange(e) {
      this.currentIndex = e.detail.current
    }
  }
}
</script>

<style>
.swiper {
  height: 300rpx;
}

.swiper image {
  width: 100%;
  height: 100%;
}

.swiper-vertical {
  height: 60rpx;
}

.card-swiper {
  height: 400rpx;
}

.card {
  margin: 20rpx;
  height: 100%;
  background: #fff;
  border-radius: 20rpx;
  transform: scale(0.9);
  transition: transform 0.3s;
}

.card.active {
  transform: scale(1);
}
</style>
```

#### movable-area 与 movable-view - 可拖拽组件

```vue
<template>
  <view>
    <!-- 基本拖拽 -->
    <movable-area class="movable-area">
      <movable-view 
        class="movable-view" 
        direction="all"
        :x="x"
        :y="y"
        @change="onChange"
        @scale="onScale"
      >
        拖拽我
      </movable-view>
    </movable-area>
    
    <!-- 可缩放 -->
    <movable-area class="movable-area" scale-area>
      <movable-view 
        class="movable-view"
        direction="all"
        :scale="true"
        :scale-min="0.5"
        :scale-max="2"
        :scale-value="1"
      >
        <image src="/static/logo.png" mode="aspectFit"></image>
      </movable-view>
    </movable-area>
    
    <!-- 悬浮球 -->
    <movable-area class="float-area">
      <movable-view 
        class="float-ball"
        direction="all"
        :inertia="true"
        :out-of-bounds="true"
        :damping="20"
        :friction="2"
      >
        <text class="iconfont icon-customer"></text>
      </movable-view>
    </movable-area>
  </view>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0
    }
  },
  
  methods: {
    onChange(e) {
      console.log('位置:', e.detail.x, e.detail.y)
    },
    
    onScale(e) {
      console.log('缩放:', e.detail.scale)
    }
  }
}
</script>

<style>
.movable-area {
  width: 100%;
  height: 400rpx;
  background: #f5f5f5;
}

.movable-view {
  width: 100rpx;
  height: 100rpx;
  background: #007AFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.float-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-ball {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #007AFF;
  pointer-events: auto;
}
</style>
```

### 9.2 基础内容组件

#### text - 文本

```vue
<template>
  <view>
    <!-- 基本文本 -->
    <text>普通文本</text>
    
    <!-- 可选中 -->
    <text selectable>可以选中复制的文本</text>
    
    <!-- 长按复制 -->
    <text user-select>长按可以选中</text>
    
    <!-- 空格处理 -->
    <text space="nbsp">连续  空格</text>
    <text space="ensp">连续  空格（中等）</text>
    <text space="emsp">连续  空格（大）</text>
    
    <!-- 解码 -->
    <text decode>&lt; &gt; &amp; &apos; &nbsp;</text>
    
    <!-- 嵌套样式 -->
    <text>
      普通文本
      <text class="highlight">高亮文本</text>
      <text class="bold">加粗文本</text>
    </text>
  </view>
</template>
```

#### rich-text - 富文本

```vue
<template>
  <view>
    <!-- 基本富文本 -->
    <rich-text :nodes="htmlContent"></rich-text>
    
    <!-- 使用 HTML 字符串 -->
    <rich-text :nodes="'<div class=\'content\'><p>段落</p><img src=\'/static/logo.png\'/></div>'"></rich-text>
    
    <!-- 使用节点数组 -->
    <rich-text :nodes="richNodes"></rich-text>
    
    <!-- 可选中 -->
    <rich-text :nodes="htmlContent" selectable></rich-text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      htmlContent: '<div><p style="color: red;">红色文字</p><p>普通段落</p></div>',
      
      richNodes: [
        {
          type: 'node',
          name: 'div',
          attrs: {
            class: 'container',
            style: 'padding: 10px;'
          },
          children: [
            {
              type: 'node',
              name: 'p',
              attrs: {
                style: 'color: #007AFF; font-size: 16px;'
              },
              children: [
                {
                  type: 'text',
                  text: '这是一段文字'
                }
              ]
            },
            {
              type: 'node',
              name: 'img',
              attrs: {
                src: '/static/logo.png',
                style: 'width: 100px;'
              }
            }
          ]
        }
      ]
    }
  }
}
</script>
```

#### icon - 图标

```vue
<template>
  <view>
    <!-- 内置图标 -->
    <icon type="success" size="26"></icon>
    <icon type="success_no_circle" size="26"></icon>
    <icon type="info" size="26"></icon>
    <icon type="warn" size="26" color="#f00"></icon>
    <icon type="waiting" size="26"></icon>
    <icon type="cancel" size="26"></icon>
    <icon type="download" size="26"></icon>
    <icon type="search" size="26"></icon>
    <icon type="clear" size="26"></icon>
  </view>
</template>
```

#### image - 图片

```vue
<template>
  <view>
    <!-- 基本图片 -->
    <image src="/static/logo.png"></image>
    
    <!-- 网络图片 -->
    <image src="https://example.com/image.jpg"></image>
    
    <!-- 图片模式 -->
    <image src="/static/logo.png" mode="scaleToFill"></image>  <!-- 拉伸填充 -->
    <image src="/static/logo.png" mode="aspectFit"></image>    <!-- 保持比例，完整显示 -->
    <image src="/static/logo.png" mode="aspectFill"></image>   <!-- 保持比例，填充 -->
    <image src="/static/logo.png" mode="widthFix"></image>     <!-- 宽度固定，高度自适应 -->
    <image src="/static/logo.png" mode="heightFix"></image>    <!-- 高度固定，宽度自适应 -->
    <image src="/static/logo.png" mode="top"></image>          <!-- 顶部裁剪 -->
    <image src="/static/logo.png" mode="bottom"></image>       <!-- 底部裁剪 -->
    <image src="/static/logo.png" mode="center"></image>       <!-- 中心裁剪 -->
    <image src="/static/logo.png" mode="left"></image>         <!-- 左侧裁剪 -->
    <image src="/static/logo.png" mode="right"></image>        <!-- 右侧裁剪 -->
    
    <!-- 懒加载 -->
    <image src="/static/logo.png" lazy-load></image>
    
    <!-- 长按菜单 -->
    <image src="/static/logo.png" show-menu-by-longpress></image>
    
    <!-- 事件 -->
    <image 
      :src="imageUrl" 
      @load="onImageLoad"
      @error="onImageError"
    ></image>
    
    <!-- 预览图片 -->
    <image 
      v-for="(img, index) in images" 
      :key="index"
      :src="img"
      @click="previewImage(index)"
    ></image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '/static/logo.png',
      images: [
        '/static/1.jpg',
        '/static/2.jpg',
        '/static/3.jpg'
      ]
    }
  },
  
  methods: {
    onImageLoad(e) {
      console.log('图片加载成功', e.detail.width, e.detail.height)
    },
    
    onImageError(e) {
      console.log('图片加载失败')
      // 显示默认图片
      this.imageUrl = '/static/default.png'
    },
    
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.images
      })
    }
  }
}
</script>
```

### 9.3 表单组件

#### input - 输入框

```vue
<template>
  <view>
    <!-- 基本输入 -->
    <input v-model="text" placeholder="请输入" />
    
    <!-- 输入类型 -->
    <input type="text" placeholder="文本" />
    <input type="number" placeholder="数字" />
    <input type="idcard" placeholder="身份证" />
    <input type="digit" placeholder="带小数的数字" />
    <input type="tel" placeholder="电话" />
    <input type="safe-password" placeholder="安全密码" />
    <input type="nickname" placeholder="昵称" />
    
    <!-- 密码框 -->
    <input password placeholder="密码" />
    
    <!-- 禁用和只读 -->
    <input disabled value="禁用" />
    <input :focus="isFocus" placeholder="自动聚焦" />
    
    <!-- 确认类型 -->
    <input confirm-type="send" placeholder="发送" />
    <input confirm-type="search" placeholder="搜索" />
    <input confirm-type="next" placeholder="下一项" />
    <input confirm-type="go" placeholder="前往" />
    <input confirm-type="done" placeholder="完成" />
    
    <!-- 最大长度 -->
    <input :maxlength="11" placeholder="最多11个字符" />
    
    <!-- 光标位置 -->
    <input :cursor-spacing="100" placeholder="键盘弹起时光标距离" />
    
    <!-- 事件 -->
    <input 
      v-model="searchText"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @keyboardheightchange="onKeyboardChange"
    />
    
    <!-- 带清除按钮 -->
    <view class="input-wrapper">
      <input v-model="keyword" placeholder="搜索" />
      <icon v-if="keyword" type="clear" @click="keyword = ''"></icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      searchText: '',
      keyword: '',
      isFocus: false
    }
  },
  
  methods: {
    onInput(e) {
      console.log('输入:', e.detail.value)
    },
    
    onFocus(e) {
      console.log('聚焦')
    },
    
    onBlur(e) {
      console.log('失焦')
    },
    
    onConfirm(e) {
      console.log('确认:', e.detail.value)
      this.search(e.detail.value)
    },
    
    onKeyboardChange(e) {
      console.log('键盘高度:', e.detail.height)
    }
  }
}
</script>
```

#### textarea - 多行输入框

```vue
<template>
  <view>
    <!-- 基本多行输入 -->
    <textarea v-model="content" placeholder="请输入内容"></textarea>
    
    <!-- 自动高度 -->
    <textarea v-model="content" auto-height :maxlength="-1"></textarea>
    
    <!-- 固定高度 -->
    <textarea 
      v-model="content" 
      :maxlength="500"
      placeholder="最多500字"
      @linechange="onLineChange"
    ></textarea>
    
    <!-- 显示字数 -->
    <view class="textarea-wrapper">
      <textarea v-model="content" :maxlength="200"></textarea>
      <text class="count">{{ content.length }}/200</text>
    </view>
  </view>
</template>
```

#### button - 按钮

```vue
<template>
  <view>
    <!-- 按钮类型 -->
    <button type="primary">主要按钮</button>
    <button type="default">默认按钮</button>
    <button type="warn">警告按钮</button>
    
    <!-- 按钮大小 -->
    <button size="default">默认大小</button>
    <button size="mini">小按钮</button>
    
    <!-- 镂空按钮 -->
    <button type="primary" plain>镂空按钮</button>
    
    <!-- 禁用 -->
    <button disabled>禁用按钮</button>
    
    <!-- 加载中 -->
    <button :loading="isLoading">{{ isLoading ? '加载中' : '提交' }}</button>
    
    <!-- 开放能力（小程序） -->
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="contact">客服</button>
    <button open-type="share">分享</button>
    <button open-type="getPhoneNumber" @getphonenumber="getPhone">获取手机号</button>
    <button open-type="getUserInfo" @getuserinfo="getUserInfo">获取用户信息</button>
    <button open-type="launchApp" app-parameter="param">打开APP</button>
    <button open-type="openSetting">打开设置</button>
    <button open-type="feedback">反馈</button>
    <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">选择头像</button>
    <!-- #endif -->
    
    <!-- 表单相关 -->
    <form @submit="onSubmit" @reset="onReset">
      <input name="username" />
      <button form-type="submit">提交</button>
      <button form-type="reset">重置</button>
    </form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    }
  },
  
  methods: {
    // #ifdef MP-WEIXIN
    getPhone(e) {
      if (e.detail.code) {
        // 发送 code 到后端换取手机号
        console.log('手机号授权码:', e.detail.code)
      }
    },
    
    getUserInfo(e) {
      console.log('用户信息:', e.detail.userInfo)
    },
    
    onChooseAvatar(e) {
      console.log('头像:', e.detail.avatarUrl)
    },
    // #endif
    
    onSubmit(e) {
      console.log('表单数据:', e.detail.value)
    },
    
    onReset() {
      console.log('表单重置')
    }
  }
}
</script>
```

#### picker - 选择器

```vue
<template>
  <view>
    <!-- 普通选择器 -->
    <picker mode="selector" :range="options" @change="onSelect">
      <view>选择：{{ options[selectedIndex] || '请选择' }}</view>
    </picker>
    
    <!-- 多列选择器 -->
    <picker 
      mode="multiSelector" 
      :range="multiOptions"
      :value="multiIndex"
      @change="onMultiSelect"
      @columnchange="onColumnChange"
    >
      <view>地区：{{ selectedArea }}</view>
    </picker>
    
    <!-- 时间选择器 -->
    <picker mode="time" :value="time" :start="'09:00'" :end="'21:00'" @change="onTimeChange">
      <view>时间：{{ time || '请选择' }}</view>
    </picker>
    
    <!-- 日期选择器 -->
    <picker 
      mode="date" 
      :value="date" 
      :start="'2020-01-01'" 
      :end="'2030-12-31'"
      fields="day"
      @change="onDateChange"
    >
      <view>日期：{{ date || '请选择' }}</view>
    </picker>
    
    <!-- 省市区选择器 -->
    <picker mode="region" :value="region" @change="onRegionChange">
      <view>地区：{{ region.join(' ') || '请选择' }}</view>
    </picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: ['选项1', '选项2', '选项3'],
      selectedIndex: 0,
      
      multiOptions: [
        ['广东省', '湖南省', '湖北省'],
        ['广州市', '深圳市', '东莞市'],
        ['天河区', '海珠区', '越秀区']
      ],
      multiIndex: [0, 0, 0],
      
      time: '',
      date: '',
      region: []
    }
  },
  
  computed: {
    selectedArea() {
      const [p, c, d] = this.multiIndex
      return `${this.multiOptions[0][p]} ${this.multiOptions[1][c]} ${this.multiOptions[2][d]}`
    }
  },
  
  methods: {
    onSelect(e) {
      this.selectedIndex = e.detail.value
    },
    
    onMultiSelect(e) {
      this.multiIndex = e.detail.value
    },
    
    onColumnChange(e) {
      // 联动逻辑
      const { column, value } = e.detail
      // 更新下级选项...
    },
    
    onTimeChange(e) {
      this.time = e.detail.value
    },
    
    onDateChange(e) {
      this.date = e.detail.value
    },
    
    onRegionChange(e) {
      this.region = e.detail.value
    }
  }
}
</script>
```

#### form - 表单

```vue
<template>
  <form @submit="onSubmit" @reset="onReset">
    <view class="form-item">
      <text class="label">用户名</text>
      <input name="username" placeholder="请输入用户名" />
    </view>
    
    <view class="form-item">
      <text class="label">密码</text>
      <input name="password" type="password" placeholder="请输入密码" />
    </view>
    
    <view class="form-item">
      <text class="label">性别</text>
      <radio-group name="gender">
        <label><radio value="male" checked />男</label>
        <label><radio value="female" />女</label>
      </radio-group>
    </view>
    
    <view class="form-item">
      <text class="label">爱好</text>
      <checkbox-group name="hobbies">
        <label><checkbox value="reading" />阅读</label>
        <label><checkbox value="sports" />运动</label>
        <label><checkbox value="music" />音乐</label>
      </checkbox-group>
    </view>
    
    <view class="form-item">
      <text class="label">城市</text>
      <picker name="city" mode="selector" :range="cities" :value="cityIndex" @change="onCityChange">
        <view>{{ cities[cityIndex] || '请选择' }}</view>
      </picker>
    </view>
    
    <view class="form-item">
      <text class="label">同意协议</text>
      <switch name="agree" />
    </view>
    
    <view class="form-item">
      <text class="label">满意度</text>
      <slider name="satisfaction" :min="0" :max="100" :value="80" show-value />
    </view>
    
    <view class="form-buttons">
      <button form-type="submit" type="primary">提交</button>
      <button form-type="reset">重置</button>
    </view>
  </form>
</template>

<script>
export default {
  data() {
    return {
      cities: ['北京', '上海', '广州', '深圳'],
      cityIndex: 0
    }
  },
  
  methods: {
    onCityChange(e) {
      this.cityIndex = e.detail.value
    },
    
    onSubmit(e) {
      const formData = e.detail.value
      console.log('表单数据:', formData)
      // {
      //   username: '',
      //   password: '',
      //   gender: 'male',
      //   hobbies: ['reading', 'sports'],
      //   city: 0,
      //   agree: true,
      //   satisfaction: 80
      // }
      
      // 表单验证
      if (!formData.username) {
        uni.showToast({ title: '请输入用户名', icon: 'none' })
        return
      }
      
      // 提交数据
      this.submitForm(formData)
    },
    
    onReset() {
      this.cityIndex = 0
    },
    
    submitForm(data) {
      // 提交逻辑
    }
  }
}
</script>
```

### 9.4 媒体组件

#### video - 视频

```vue
<template>
  <view>
    <video 
      id="myVideo"
      :src="videoSrc"
      :poster="posterSrc"
      :controls="true"
      :autoplay="false"
      :loop="false"
      :muted="false"
      :initial-time="0"
      :show-fullscreen-btn="true"
      :show-play-btn="true"
      :show-center-play-btn="true"
      :enable-progress-gesture="true"
      :object-fit="'contain'"
      :play-btn-position="'center'"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @fullscreenchange="onFullscreenChange"
      @error="onError"
    ></video>
    
    <view class="controls">
      <button @click="play">播放</button>
      <button @click="pause">暂停</button>
      <button @click="seekTo(60)">跳转到60秒</button>
      <button @click="fullScreen">全屏</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoSrc: 'https://example.com/video.mp4',
      posterSrc: '/static/poster.jpg',
      videoContext: null
    }
  },
  
  onReady() {
    this.videoContext = uni.createVideoContext('myVideo', this)
  },
  
  methods: {
    play() {
      this.videoContext.play()
    },
    
    pause() {
      this.videoContext.pause()
    },
    
    seekTo(time) {
      this.videoContext.seek(time)
    },
    
    fullScreen() {
      this.videoContext.requestFullScreen({ direction: 0 })
    },
    
    onPlay() {
      console.log('开始播放')
    },
    
    onPause() {
      console.log('暂停播放')
    },
    
    onEnded() {
      console.log('播放结束')
    },
    
    onTimeUpdate(e) {
      console.log('当前时间:', e.detail.currentTime)
      console.log('总时长:', e.detail.duration)
    },
    
    onFullscreenChange(e) {
      console.log('全屏状态:', e.detail.fullScreen)
    },
    
    onError(e) {
      console.error('视频错误:', e.detail.errMsg)
    }
  }
}
</script>
```

#### audio - 音频（使用 API）

```vue
<template>
  <view class="audio-player">
    <image :src="coverImage" class="cover"></image>
    <view class="info">
      <text class="title">{{ audioInfo.title }}</text>
      <text class="artist">{{ audioInfo.artist }}</text>
    </view>
    <view class="progress">
      <slider 
        :value="currentTime" 
        :max="duration"
        @change="seekTo"
      />
      <view class="time">
        <text>{{ formatTime(currentTime) }}</text>
        <text>{{ formatTime(duration) }}</text>
      </view>
    </view>
    <view class="controls">
      <button @click="prev">上一首</button>
      <button @click="togglePlay">{{ isPlaying ? '暂停' : '播放' }}</button>
      <button @click="next">下一首</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      audioContext: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      audioInfo: {
        title: '歌曲名称',
        artist: '歌手',
        src: 'https://example.com/audio.mp3'
      },
      coverImage: '/static/cover.jpg'
    }
  },
  
  onLoad() {
    this.initAudio()
  },
  
  onUnload() {
    if (this.audioContext) {
      this.audioContext.destroy()
    }
  },
  
  methods: {
    initAudio() {
      this.audioContext = uni.createInnerAudioContext()
      this.audioContext.src = this.audioInfo.src
      
      this.audioContext.onPlay(() => {
        this.isPlaying = true
      })
      
      this.audioContext.onPause(() => {
        this.isPlaying = false
      })
      
      this.audioContext.onStop(() => {
        this.isPlaying = false
      })
      
      this.audioContext.onTimeUpdate(() => {
        this.currentTime = this.audioContext.currentTime
        this.duration = this.audioContext.duration
      })
      
      this.audioContext.onEnded(() => {
        this.isPlaying = false
        this.next()
      })
      
      this.audioContext.onError((err) => {
        console.error('音频错误:', err)
      })
    },
    
    togglePlay() {
      if (this.isPlaying) {
        this.audioContext.pause()
      } else {
        this.audioContext.play()
      }
    },
    
    seekTo(e) {
      this.audioContext.seek(e.detail.value)
    },
    
    prev() {
      // 上一首逻辑
    },
    
    next() {
      // 下一首逻辑
    },
    
    formatTime(seconds) {
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min}:${sec.toString().padStart(2, '0')}`
    }
  }
}
</script>
```

#### camera - 相机

```vue
<template>
  <view>
    <!-- #ifdef APP-PLUS || MP-WEIXIN -->
    <camera 
      device-position="back"
      flash="auto"
      @error="onCameraError"
      @scancode="onScanCode"
      class="camera"
    ></camera>
    
    <view class="controls">
      <button @click="takePhoto">拍照</button>
      <button @click="startRecord">开始录像</button>
      <button @click="stopRecord">停止录像</button>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      cameraContext: null
    }
  },
  
  onReady() {
    // #ifdef APP-PLUS || MP-WEIXIN
    this.cameraContext = uni.createCameraContext()
    // #endif
  },
  
  methods: {
    takePhoto() {
      this.cameraContext.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log('照片路径:', res.tempImagePath)
          // 预览或上传
        }
      })
    },
    
    startRecord() {
      this.cameraContext.startRecord({
        success: () => {
          console.log('开始录像')
        }
      })
    },
    
    stopRecord() {
      this.cameraContext.stopRecord({
        success: (res) => {
          console.log('视频路径:', res.tempVideoPath)
          // 预览或上传
        }
      })
    },
    
    onCameraError(e) {
      console.error('相机错误:', e.detail)
    },
    
    onScanCode(e) {
      console.log('扫码结果:', e.detail.result)
    }
  }
}
</script>

<style>
.camera {
  width: 100%;
  height: 600rpx;
}
</style>
```

### 9.5 地图组件

```vue
<template>
  <view>
    <map 
      id="myMap"
      class="map"
      :longitude="longitude"
      :latitude="latitude"
      :scale="scale"
      :markers="markers"
      :polyline="polyline"
      :circles="circles"
      :include-points="includePoints"
      :show-location="true"
      :enable-zoom="true"
      :enable-scroll="true"
      :enable-rotate="true"
      :show-compass="true"
      :show-scale="true"
      @markertap="onMarkerTap"
      @callouttap="onCalloutTap"
      @poitap="onPoiTap"
      @regionchange="onRegionChange"
    ></map>
    
    <view class="controls">
      <button @click="moveToLocation">回到当前位置</button>
      <button @click="getCenterLocation">获取中心点</button>
      <button @click="getScale">获取缩放级别</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mapContext: null,
      longitude: 113.324520,
      latitude: 23.099994,
      scale: 14,
      
      markers: [
        {
          id: 1,
          longitude: 113.324520,
          latitude: 23.099994,
          title: '标记点1',
          iconPath: '/static/marker.png',
          width: 30,
          height: 30,
          callout: {
            content: '这是标记点1',
            color: '#333',
            fontSize: 14,
            borderRadius: 5,
            padding: 10,
            display: 'ALWAYS'
          }
        },
        {
          id: 2,
          longitude: 113.334520,
          latitude: 23.109994,
          title: '标记点2',
          iconPath: '/static/marker.png',
          width: 30,
          height: 30
        }
      ],
      
      polyline: [
        {
          points: [
            { longitude: 113.324520, latitude: 23.099994 },
            { longitude: 113.334520, latitude: 23.109994 }
          ],
          color: '#007AFF',
          width: 4,
          dottedLine: false,
          arrowLine: true
        }
      ],
      
      circles: [
        {
          longitude: 113.324520,
          latitude: 23.099994,
          radius: 500,
          color: '#007AFF',
          fillColor: 'rgba(0, 122, 255, 0.2)',
          strokeWidth: 2
        }
      ],
      
      includePoints: []
    }
  },
  
  onReady() {
    this.mapContext = uni.createMapContext('myMap', this)
  },
  
  methods: {
    moveToLocation() {
      this.mapContext.moveToLocation()
    },
    
    getCenterLocation() {
      this.mapContext.getCenterLocation({
        success: (res) => {
          console.log('中心点:', res.longitude, res.latitude)
        }
      })
    },
    
    getScale() {
      this.mapContext.getScale({
        success: (res) => {
          console.log('缩放级别:', res.scale)
        }
      })
    },
    
    onMarkerTap(e) {
      console.log('点击标记:', e.markerId)
    },
    
    onCalloutTap(e) {
      console.log('点击气泡:', e.markerId)
    },
    
    onPoiTap(e) {
      console.log('点击兴趣点:', e.name, e.longitude, e.latitude)
    },
    
    onRegionChange(e) {
      console.log('地图区域变化:', e.type)
    }
  }
}
</script>

<style>
.map {
  width: 100%;
  height: 600rpx;
}
</style>
```

### 9.6 Canvas 画布

```vue
<template>
  <view>
    <canvas 
      canvas-id="myCanvas" 
      id="myCanvas"
      class="canvas"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    ></canvas>
    
    <view class="controls">
      <button @click="drawRect">绘制矩形</button>
      <button @click="drawCircle">绘制圆形</button>
      <button @click="drawText">绘制文字</button>
      <button @click="drawImage">绘制图片</button>
      <button @click="saveImage">保存图片</button>
      <button @click="clear">清空</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ctx: null,
      isDrawing: false,
      lastX: 0,
      lastY: 0
    }
  },
  
  onReady() {
    this.ctx = uni.createCanvasContext('myCanvas', this)
  },
  
  methods: {
    drawRect() {
      this.ctx.setFillStyle('#007AFF')
      this.ctx.fillRect(50, 50, 200, 100)
      
      this.ctx.setStrokeStyle('#FF0000')
      this.ctx.setLineWidth(2)
      this.ctx.strokeRect(100, 100, 200, 100)
      
      this.ctx.draw()
    },
    
    drawCircle() {
      this.ctx.beginPath()
      this.ctx.arc(150, 150, 80, 0, 2 * Math.PI)
      this.ctx.setFillStyle('#4CD964')
      this.ctx.fill()
      
      this.ctx.beginPath()
      this.ctx.arc(250, 150, 80, 0, 2 * Math.PI)
      this.ctx.setStrokeStyle('#FF9500')
      this.ctx.setLineWidth(3)
      this.ctx.stroke()
      
      this.ctx.draw()
    },
    
    drawText() {
      this.ctx.setFontSize(20)
      this.ctx.setFillStyle('#333')
      this.ctx.fillText('Hello UniApp', 50, 50)
      
      this.ctx.setFontSize(30)
      this.ctx.setFillStyle('#007AFF')
      this.ctx.fillText('Canvas 绘图', 50, 100)
      
      this.ctx.draw()
    },
    
    drawImage() {
      this.ctx.drawImage('/static/logo.png', 50, 50, 200, 200)
      this.ctx.draw()
    },
    
    clear() {
      this.ctx.clearRect(0, 0, 300, 300)
      this.ctx.draw()
    },
    
    // 手写签名
    onTouchStart(e) {
      this.isDrawing = true
      this.lastX = e.touches[0].x
      this.lastY = e.touches[0].y
    },
    
    onTouchMove(e) {
      if (!this.isDrawing) return
      
      const x = e.touches[0].x
      const y = e.touches[0].y
      
      this.ctx.beginPath()
      this.ctx.moveTo(this.lastX, this.lastY)
      this.ctx.lineTo(x, y)
      this.ctx.setStrokeStyle('#000')
      this.ctx.setLineWidth(3)
      this.ctx.setLineCap('round')
      this.ctx.stroke()
      this.ctx.draw(true)
      
      this.lastX = x
      this.lastY = y
    },
    
    onTouchEnd() {
      this.isDrawing = false
    },
    
    saveImage() {
      uni.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: (res) => {
          console.log('临时路径:', res.tempFilePath)
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({ title: '保存成功' })
            }
          })
        }
      }, this)
    }
  }
}
</script>

<style>
.canvas {
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
}
</style>
```

---

## 10. API 系统

### 10.1 网络请求

```javascript
// 基本请求
uni.request({
  url: 'https://api.example.com/user',
  method: 'GET',
  data: {
    id: 1
  },
  header: {
    'Authorization': 'Bearer token'
  },
  success: (res) => {
    console.log('请求成功', res.data)
  },
  fail: (err) => {
    console.error('请求失败', err)
  },
  complete: () => {
    console.log('请求完成')
  }
})

// Promise 方式
const res = await uni.request({
  url: 'https://api.example.com/user',
  method: 'POST',
  data: {
    name: '张三'
  }
})

// 封装请求工具
// utils/request.js
const BASE_URL = 'https://api.example.com'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data)
          } else {
            uni.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // token 过期
          uni.removeStorageSync('token')
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 使用
import { request } from '@/utils/request'

// GET 请求
const userInfo = await request({
  url: '/user/info'
})

// POST 请求
const result = await request({
  url: '/user/update',
  method: 'POST',
  data: {
    name: '李四'
  }
})
```

### 10.2 文件上传下载

```javascript
// 文件上传
uni.uploadFile({
  url: 'https://api.example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: {
    userId: '123'
  },
  header: {
    'Authorization': 'Bearer token'
  },
  success: (res) => {
    const data = JSON.parse(res.data)
    console.log('上传成功', data)
  },
  fail: (err) => {
    console.error('上传失败', err)
  }
})

// 监听上传进度
const uploadTask = uni.uploadFile({
  url: 'https://api.example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  success: (res) => {
    console.log('上传成功')
  }
})

uploadTask.onProgressUpdate((res) => {
  console.log('上传进度:', res.progress)
  console.log('已上传:', res.totalBytesSent)
  console.log('总大小:', res.totalBytesExpectedToSend)
})

// 取消上传
uploadTask.abort()

// 文件下载
uni.downloadFile({
  url: 'https://example.com/file.pdf',
  success: (res) => {
    if (res.statusCode === 200) {
      console.log('下载成功', res.tempFilePath)
      
      // 保存到本地
      uni.saveFile({
        tempFilePath: res.tempFilePath,
        success: (saveRes) => {
          console.log('保存路径:', saveRes.savedFilePath)
        }
      })
    }
  }
})

// 监听下载进度
const downloadTask = uni.downloadFile({
  url: 'https://example.com/video.mp4',
  success: (res) => {
    console.log('下载成功')
  }
})

downloadTask.onProgressUpdate((res) => {
  console.log('下载进度:', res.progress)
})
```

### 10.3 数据存储

```javascript
// 同步存储
uni.setStorageSync('key', 'value')
uni.setStorageSync('user', { name: '张三', age: 25 })

// 同步获取
const value = uni.getStorageSync('key')
const user = uni.getStorageSync('user')

// 同步删除
uni.removeStorageSync('key')

// 清空所有
uni.clearStorageSync()

// 获取存储信息
const info = uni.getStorageInfoSync()
console.log('keys:', info.keys)
console.log('当前大小:', info.currentSize)
console.log('限制大小:', info.limitSize)

// 异步存储
uni.setStorage({
  key: 'token',
  data: 'xxx',
  success: () => {
    console.log('存储成功')
  }
})

// 异步获取
uni.getStorage({
  key: 'token',
  success: (res) => {
    console.log('获取成功', res.data)
  },
  fail: () => {
    console.log('key 不存在')
  }
})

// 封装存储工具
// utils/storage.js
const STORAGE_PREFIX = 'app_'

export const storage = {
  set(key, value, expire = 0) {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : 0
    }
    uni.setStorageSync(STORAGE_PREFIX + key, JSON.stringify(data))
  },
  
  get(key, defaultValue = null) {
    try {
      const data = uni.getStorageSync(STORAGE_PREFIX + key)
      if (!data) return defaultValue
      
      const { value, expire } = JSON.parse(data)
      if (expire && Date.now() > expire) {
        this.remove(key)
        return defaultValue
      }
      return value
    } catch {
      return defaultValue
    }
  },
  
  remove(key) {
    uni.removeStorageSync(STORAGE_PREFIX + key)
  },
  
  clear() {
    const info = uni.getStorageInfoSync()
    info.keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        uni.removeStorageSync(key)
      }
    })
  }
}

// 使用
import { storage } from '@/utils/storage'

// 设置（带过期时间，单位秒）
storage.set('token', 'xxx', 3600 * 24)  // 1天后过期
storage.set('user', { name: '张三' })    // 永不过期

// 获取
const token = storage.get('token')
const user = storage.get('user', {})

// 删除
storage.remove('token')
```

### 10.4 界面交互

```javascript
// 显示 Toast
uni.showToast({
  title: '成功',
  icon: 'success',   // success, loading, error, none
  duration: 2000,
  mask: true
})

// 显示 Loading
uni.showLoading({
  title: '加载中',
  mask: true
})
// 隐藏 Loading
uni.hideLoading()

// 显示 Modal
uni.showModal({
  title: '提示',
  content: '确定要删除吗？',
  showCancel: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmColor: '#007AFF',
  success: (res) => {
    if (res.confirm) {
      console.log('点击确定')
    } else if (res.cancel) {
      console.log('点击取消')
    }
  }
})

// 显示 ActionSheet
uni.showActionSheet({
  itemList: ['选项1', '选项2', '选项3'],
  success: (res) => {
    console.log('选择了:', res.tapIndex)
  }
})

// 设置导航栏标题
uni.setNavigationBarTitle({
  title: '新标题'
})

// 设置导航栏颜色
uni.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#007AFF',
  animation: {
    duration: 300,
    timingFunc: 'easeIn'
  }
})

// 显示/隐藏导航栏加载
uni.showNavigationBarLoading()
uni.hideNavigationBarLoading()

// 设置 TabBar 角标
uni.setTabBarBadge({
  index: 2,
  text: '99+'
})

// 移除角标
uni.removeTabBarBadge({
  index: 2
})

// 显示红点
uni.showTabBarRedDot({
  index: 3
})

// 隐藏红点
uni.hideTabBarRedDot({
  index: 3
})

// 动态设置 TabBar
uni.setTabBarItem({
  index: 0,
  text: '首页',
  iconPath: '/static/home.png',
  selectedIconPath: '/static/home-active.png'
})

// 显示/隐藏 TabBar
uni.showTabBar()
uni.hideTabBar()

// 下拉刷新
uni.startPullDownRefresh()
uni.stopPullDownRefresh()

// 页面滚动
uni.pageScrollTo({
  scrollTop: 0,
  duration: 300
})
```

### 10.5 媒体相关

```javascript
// 选择图片
uni.chooseImage({
  count: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    console.log('图片路径:', res.tempFilePaths)
    console.log('图片信息:', res.tempFiles)
  }
})

// 预览图片
uni.previewImage({
  current: 0,  // 或图片路径
  urls: ['/static/1.jpg', '/static/2.jpg'],
  indicator: 'default',
  loop: true
})

// 获取图片信息
uni.getImageInfo({
  src: '/static/logo.png',
  success: (res) => {
    console.log('宽度:', res.width)
    console.log('高度:', res.height)
    console.log('类型:', res.type)
    console.log('方向:', res.orientation)
  }
})

// 保存图片到相册
uni.saveImageToPhotosAlbum({
  filePath: tempFilePath,
  success: () => {
    uni.showToast({ title: '保存成功' })
  }
})

// 压缩图片
uni.compressImage({
  src: tempFilePath,
  quality: 80,
  success: (res) => {
    console.log('压缩后路径:', res.tempFilePath)
  }
})

// 选择视频
uni.chooseVideo({
  sourceType: ['album', 'camera'],
  maxDuration: 60,
  camera: 'back',
  compressed: true,
  success: (res) => {
    console.log('视频路径:', res.tempFilePath)
    console.log('时长:', res.duration)
    console.log('大小:', res.size)
    console.log('宽度:', res.width)
    console.log('高度:', res.height)
  }
})

// 保存视频
uni.saveVideoToPhotosAlbum({
  filePath: tempFilePath,
  success: () => {
    uni.showToast({ title: '保存成功' })
  }
})

// 选择文件
uni.chooseFile({
  count: 5,
  type: 'all',  // all, image, video, file
  extension: ['.pdf', '.doc', '.docx'],
  success: (res) => {
    console.log('文件:', res.tempFiles)
  }
})

// 录音
const recorderManager = uni.getRecorderManager()

recorderManager.onStart(() => {
  console.log('录音开始')
})

recorderManager.onStop((res) => {
  console.log('录音结束', res.tempFilePath)
  console.log('时长', res.duration)
})

recorderManager.start({
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3'
})

// 停止录音
recorderManager.stop()
```

### 10.6 设备相关

```javascript
// 获取系统信息
const systemInfo = uni.getSystemInfoSync()
console.log('品牌:', systemInfo.brand)
console.log('型号:', systemInfo.model)
console.log('系统:', systemInfo.system)
console.log('平台:', systemInfo.platform)
console.log('屏幕宽度:', systemInfo.screenWidth)
console.log('屏幕高度:', systemInfo.screenHeight)
console.log('窗口宽度:', systemInfo.windowWidth)
console.log('窗口高度:', systemInfo.windowHeight)
console.log('状态栏高度:', systemInfo.statusBarHeight)
console.log('安全区域:', systemInfo.safeArea)
console.log('SDK版本:', systemInfo.SDKVersion)

// 获取设备信息
uni.getDeviceInfo({
  success: (res) => {
    console.log('设备信息:', res)
  }
})

// 获取网络状态
uni.getNetworkType({
  success: (res) => {
    console.log('网络类型:', res.networkType)
    // wifi, 2g, 3g, 4g, 5g, ethernet, unknown, none
  }
})

// 监听网络变化
uni.onNetworkStatusChange((res) => {
  console.log('网络连接:', res.isConnected)
  console.log('网络类型:', res.networkType)
})

// 获取位置
uni.getLocation({
  type: 'gcj02',  // wgs84, gcj02
  altitude: true,
  success: (res) => {
    console.log('经度:', res.longitude)
    console.log('纬度:', res.latitude)
    console.log('精度:', res.accuracy)
    console.log('海拔:', res.altitude)
    console.log('速度:', res.speed)
  }
})

// 选择位置
uni.chooseLocation({
  success: (res) => {
    console.log('名称:', res.name)
    console.log('地址:', res.address)
    console.log('经度:', res.longitude)
    console.log('纬度:', res.latitude)
  }
})

// 打开地图查看位置
uni.openLocation({
  latitude: 23.099994,
  longitude: 113.324520,
  name: '位置名称',
  address: '详细地址'
})

// 拨打电话
uni.makePhoneCall({
  phoneNumber: '10086'
})

// 扫码
uni.scanCode({
  scanType: ['qrCode', 'barCode'],
  success: (res) => {
    console.log('扫码结果:', res.result)
    console.log('码类型:', res.scanType)
  }
})

// 剪贴板
uni.setClipboardData({
  data: '要复制的内容',
  success: () => {
    console.log('复制成功')
  }
})

uni.getClipboardData({
  success: (res) => {
    console.log('剪贴板内容:', res.data)
  }
})

// 振动
uni.vibrateLong()  // 长振动
uni.vibrateShort({
  type: 'heavy'  // heavy, medium, light
})

// 屏幕亮度
uni.setScreenBrightness({
  value: 0.5  // 0-1
})

uni.getScreenBrightness({
  success: (res) => {
    console.log('当前亮度:', res.value)
  }
})

// 保持屏幕常亮
uni.setKeepScreenOn({
  keepScreenOn: true
})

// 加速度计
uni.startAccelerometer({
  interval: 'normal'  // game, ui, normal
})

uni.onAccelerometerChange((res) => {
  console.log('X:', res.x)
  console.log('Y:', res.y)
  console.log('Z:', res.z)
})

uni.stopAccelerometer()

// 罗盘
uni.startCompass()

uni.onCompassChange((res) => {
  console.log('方向:', res.direction)
})

uni.stopCompass()
```

---

## 11. 路由与导航

### 11.1 页面跳转

```javascript
// 跳转到新页面（保留当前页面）
uni.navigateTo({
  url: '/pages/detail/detail?id=1&name=商品',
  animationType: 'slide-in-right',  // App 端动画
  animationDuration: 300,
  events: {
    // 监听子页面传回的数据
    acceptDataFromOpenedPage: (data) => {
      console.log('收到数据:', data)
    }
  },
  success: (res) => {
    // 向被打开页面传送数据
    res.eventChannel.emit('sendDataToOpenedPage', { data: 'from parent' })
  }
})

// 在目标页面接收数据
// pages/detail/detail.vue
export default {
  onLoad(options) {
    // 接收 URL 参数
    console.log('id:', options.id)
    console.log('name:', options.name)
    
    // 接收 eventChannel 数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendDataToOpenedPage', (data) => {
      console.log('收到父页面数据:', data)
    })
  },
  
  methods: {
    // 返回数据给上一页
    goBack() {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('acceptDataFromOpenedPage', { data: 'from child' })
      uni.navigateBack()
    }
  }
}

// 重定向（关闭当前页面）
uni.redirectTo({
  url: '/pages/index/index'
})

// 跳转到 TabBar 页面（关闭其他非 TabBar 页面）
uni.switchTab({
  url: '/pages/index/index'
})

// 关闭所有页面，打开某个页面
uni.reLaunch({
  url: '/pages/login/login'
})

// 返回上一页
uni.navigateBack({
  delta: 1,  // 返回的页面数
  animationType: 'slide-out-right',
  animationDuration: 300
})

// 获取当前页面栈
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
console.log('当前页面路由:', currentPage.route)
console.log('当前页面参数:', currentPage.options)

// 页面栈操作
const prevPage = pages[pages.length - 2]
if (prevPage) {
  // 修改上一页数据
  prevPage.$vm.list.push({ id: 1 })
  // 调用上一页方法
  prevPage.$vm.refreshData()
}
```

### 11.2 路由封装

```javascript
// utils/router.js
class Router {
  // 页面栈最大数量
  static MAX_PAGES = 10
  
  // 跳转新页面
  static push(url, params = {}) {
    const query = this.buildQuery(params)
    const fullUrl = query ? `${url}?${query}` : url
    
    // 检查页面栈数量
    const pages = getCurrentPages()
    if (pages.length >= this.MAX_PAGES) {
      return this.redirect(url, params)
    }
    
    return new Promise((resolve, reject) => {
      uni.navigateTo({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  }
  
  // 重定向
  static redirect(url, params = {}) {
    const query = this.buildQuery(params)
    const fullUrl = query ? `${url}?${query}` : url
    
    return new Promise((resolve, reject) => {
      uni.redirectTo({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  }
  
  // 切换 Tab
  static switchTab(url) {
    return new Promise((resolve, reject) => {
      uni.switchTab({
        url,
        success: resolve,
        fail: reject
      })
    })
  }
  
  // 重新启动
  static reLaunch(url, params = {}) {
    const query = this.buildQuery(params)
    const fullUrl = query ? `${url}?${query}` : url
    
    return new Promise((resolve, reject) => {
      uni.reLaunch({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  }
  
  // 返回
  static back(delta = 1) {
    return new Promise((resolve, reject) => {
      uni.navigateBack({
        delta,
        success: resolve,
        fail: reject
      })
    })
  }
  
  // 构建查询字符串
  static buildQuery(params) {
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => {
        const value = typeof params[key] === 'object' 
          ? encodeURIComponent(JSON.stringify(params[key]))
          : encodeURIComponent(params[key])
        return `${key}=${value}`
      })
      .join('&')
  }
  
  // 解析复杂参数
  static parseParams(options) {
    const result = {}
    for (const key in options) {
      try {
        result[key] = JSON.parse(decodeURIComponent(options[key]))
      } catch {
        result[key] = decodeURIComponent(options[key])
      }
    }
    return result
  }
  
  // 获取当前页面
  static getCurrentPage() {
    const pages = getCurrentPages()
    return pages[pages.length - 1]
  }
  
  // 获取上一个页面
  static getPrevPage() {
    const pages = getCurrentPages()
    return pages.length > 1 ? pages[pages.length - 2] : null
  }
}

export default Router

// 使用
import Router from '@/utils/router'

// 跳转
await Router.push('/pages/detail/detail', { id: 1, name: '商品' })

// 携带复杂参数
await Router.push('/pages/order/order', { 
  goods: [{ id: 1, count: 2 }],
  address: { name: '张三', phone: '13800138000' }
})

// 在目标页面解析
onLoad(options) {
  const params = Router.parseParams(options)
  console.log(params.goods)  // [{ id: 1, count: 2 }]
}

// 返回并刷新
const prevPage = Router.getPrevPage()
if (prevPage) {
  prevPage.$vm.needRefresh = true
}
Router.back()
```

### 11.3 路由守卫

```javascript
// utils/routerGuard.js
const WHITE_LIST = [
  '/pages/login/login',
  '/pages/register/register',
  '/pages/index/index'
]

// 需要登录的页面
const AUTH_PAGES = [
  '/pages/user/user',
  '/pages/order/order',
  '/pages/cart/cart'
]

// 重写导航方法
const originalNavigateTo = uni.navigateTo
const originalRedirectTo = uni.redirectTo
const originalReLaunch = uni.reLaunch

const checkAuth = (url) => {
  const path = url.split('?')[0]
  
  // 白名单直接通过
  if (WHITE_LIST.includes(path)) {
    return true
  }
  
  // 需要登录的页面检查 token
  if (AUTH_PAGES.includes(path)) {
    const token = uni.getStorageSync('token')
    if (!token) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      
      // 保存要跳转的页面
      uni.setStorageSync('redirectUrl', url)
      
      // 跳转登录页
      setTimeout(() => {
        originalNavigateTo.call(uni, {
          url: '/pages/login/login'
        })
      }, 1500)
      
      return false
    }
  }
  
  return true
}

uni.navigateTo = (options) => {
  if (checkAuth(options.url)) {
    originalNavigateTo.call(uni, options)
  }
}

uni.redirectTo = (options) => {
  if (checkAuth(options.url)) {
    originalRedirectTo.call(uni, options)
  }
}

uni.reLaunch = (options) => {
  if (checkAuth(options.url)) {
    originalReLaunch.call(uni, options)
  }
}

// 在 main.js 中引入
import '@/utils/routerGuard'

// 登录成功后跳转
const redirectUrl = uni.getStorageSync('redirectUrl')
if (redirectUrl) {
  uni.removeStorageSync('redirectUrl')
  uni.redirectTo({ url: redirectUrl })
} else {
  uni.switchTab({ url: '/pages/index/index' })
}
```

---

## 12. 网络请求

### 12.1 请求封装

```javascript
// utils/http.js
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'https://dev-api.example.com'
  : 'https://api.example.com'

// 请求队列（用于显示 loading）
let requestCount = 0

// 显示 loading
const showLoading = () => {
  if (requestCount === 0) {
    uni.showLoading({
      title: '加载中',
      mask: true
    })
  }
  requestCount++
}

// 隐藏 loading
const hideLoading = () => {
  requestCount--
  if (requestCount <= 0) {
    requestCount = 0
    uni.hideLoading()
  }
}

// 请求拦截器
const requestInterceptor = (config) => {
  // 添加 token
  const token = uni.getStorageSync('token')
  if (token) {
    config.header['Authorization'] = `Bearer ${token}`
  }
  
  // 添加公共参数
  config.header['X-Platform'] = uni.getSystemInfoSync().platform
  config.header['X-Version'] = '1.0.0'
  
  return config
}

// 响应拦截器
const responseInterceptor = async (response, config) => {
  const { statusCode, data } = response
  
  // HTTP 错误
  if (statusCode !== 200) {
    if (statusCode === 401) {
      // token 过期，尝试刷新
      const refreshed = await refreshToken()
      if (refreshed) {
        // 重新发起请求
        return http.request(config)
      } else {
        // 跳转登录
        uni.removeStorageSync('token')
        uni.navigateTo({ url: '/pages/login/login' })
      }
    }
    
    throw new Error(`HTTP Error: ${statusCode}`)
  }
  
  // 业务错误
  if (data.code !== 0) {
    // 统一错误提示
    if (data.code !== 10001) { // 10001: 静默错误
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
    }
    
    throw data
  }
  
  return data.data
}

// 刷新 token
const refreshToken = async () => {
  const refreshToken = uni.getStorageSync('refreshToken')
  if (!refreshToken) return false
  
  try {
    const res = await uni.request({
      url: `${BASE_URL}/auth/refresh`,
      method: 'POST',
      data: { refreshToken }
    })
    
    if (res.data.code === 0) {
      uni.setStorageSync('token', res.data.data.token)
      uni.setStorageSync('refreshToken', res.data.data.refreshToken)
      return true
    }
  } catch (e) {
    console.error('刷新 token 失败', e)
  }
  
  return false
}

// 主请求方法
const request = (options) => {
  const { 
    url, 
    method = 'GET', 
    data, 
    header = {},
    loading = true,
    ...rest 
  } = options
  
  // 显示 loading
  if (loading) {
    showLoading()
  }
  
  // 构建配置
  let config = {
    url: url.startsWith('http') ? url : BASE_URL + url,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      ...header
    },
    ...rest
  }
  
  // 请求拦截
  config = requestInterceptor(config)
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: async (res) => {
        try {
          const result = await responseInterceptor(res, options)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        if (loading) {
          hideLoading()
        }
      }
    })
  })
}

// 导出方法
const http = {
  request,
  
  get(url, params = {}, options = {}) {
    return request({
      url,
      method: 'GET',
      data: params,
      ...options
    })
  },
  
  post(url, data = {}, options = {}) {
    return request({
      url,
      method: 'POST',
      data,
      ...options
    })
  },
  
  put(url, data = {}, options = {}) {
    return request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  },
  
  delete(url, data = {}, options = {}) {
    return request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  },
  
  // 上传文件
  upload(url, filePath, formData = {}, options = {}) {
    const { loading = true } = options
    
    if (loading) {
      showLoading()
    }
    
    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: url.startsWith('http') ? url : BASE_URL + url,
        filePath,
        name: 'file',
        formData,
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data.code === 0) {
            resolve(data.data)
          } else {
            uni.showToast({ title: data.message, icon: 'none' })
            reject(data)
          }
        },
        fail: reject,
        complete: () => {
          if (loading) {
            hideLoading()
          }
        }
      })
      
      // 监听上传进度
      if (options.onProgress) {
        uploadTask.onProgressUpdate(options.onProgress)
      }
    })
  }
}

export default http

// 使用示例
import http from '@/utils/http'

// GET 请求
const userInfo = await http.get('/user/info')
const list = await http.get('/goods/list', { page: 1, size: 10 })

// POST 请求
const result = await http.post('/user/login', {
  username: 'admin',
  password: '123456'
})

// 不显示 loading
const data = await http.get('/config', {}, { loading: false })

// 上传文件
const fileUrl = await http.upload('/upload', tempFilePath, { type: 'avatar' }, {
  onProgress: (res) => {
    console.log('上传进度:', res.progress)
  }
})
```

### 12.2 API 模块化

```javascript
// api/index.js
import http from '@/utils/http'

// 用户相关
export const userApi = {
  login: (data) => http.post('/user/login', data),
  logout: () => http.post('/user/logout'),
  getInfo: () => http.get('/user/info'),
  updateInfo: (data) => http.put('/user/info', data),
  updateAvatar: (filePath) => http.upload('/user/avatar', filePath)
}

// 商品相关
export const goodsApi = {
  getList: (params) => http.get('/goods/list', params),
  getDetail: (id) => http.get(`/goods/${id}`),
  search: (keyword) => http.get('/goods/search', { keyword }),
  getCategories: () => http.get('/goods/categories')
}

// 订单相关
export const orderApi = {
  create: (data) => http.post('/order/create', data),
  getList: (params) => http.get('/order/list', params),
  getDetail: (id) => http.get(`/order/${id}`),
  cancel: (id) => http.post(`/order/${id}/cancel`),
  pay: (id, data) => http.post(`/order/${id}/pay`, data),
  confirm: (id) => http.post(`/order/${id}/confirm`)
}

// 购物车相关
export const cartApi = {
  getList: () => http.get('/cart/list'),
  add: (data) => http.post('/cart/add', data),
  update: (id, data) => http.put(`/cart/${id}`, data),
  remove: (ids) => http.delete('/cart/remove', { ids }),
  clear: () => http.delete('/cart/clear')
}

// 使用示例
import { userApi, goodsApi, orderApi } from '@/api'

// 登录
const { token, userInfo } = await userApi.login({
  username: 'admin',
  password: '123456'
})

// 获取商品列表
const { list, total } = await goodsApi.getList({
  page: 1,
  size: 10,
  categoryId: 1
})

// 创建订单
const order = await orderApi.create({
  goodsId: 1,
  count: 2,
  addressId: 1
})
```

---

## 13. 数据存储

### 13.1 本地存储封装

```javascript
// utils/storage.js
const STORAGE_PREFIX = 'uni_app_'

class Storage {
  constructor(prefix = STORAGE_PREFIX) {
    this.prefix = prefix
  }
  
  // 获取完整 key
  getKey(key) {
    return this.prefix + key
  }
  
  // 设置数据（支持过期时间）
  set(key, value, expire = 0) {
    const data = {
      value,
      expire: expire > 0 ? Date.now() + expire * 1000 : 0,
      createTime: Date.now()
    }
    
    try {
      uni.setStorageSync(this.getKey(key), JSON.stringify(data))
      return true
    } catch (e) {
      console.error('Storage set error:', e)
      return false
    }
  }
  
  // 获取数据
  get(key, defaultValue = null) {
    try {
      const raw = uni.getStorageSync(this.getKey(key))
      if (!raw) return defaultValue
      
      const data = JSON.parse(raw)
      
      // 检查是否过期
      if (data.expire > 0 && Date.now() > data.expire) {
        this.remove(key)
        return defaultValue
      }
      
      return data.value
    } catch (e) {
      console.error('Storage get error:', e)
      return defaultValue
    }
  }
  
  // 删除数据
  remove(key) {
    try {
      uni.removeStorageSync(this.getKey(key))
      return true
    } catch (e) {
      console.error('Storage remove error:', e)
      return false
    }
  }
  
  // 检查 key 是否存在
  has(key) {
    return this.get(key) !== null
  }
  
  // 清空所有数据（只清空当前前缀的）
  clear() {
    try {
      const info = uni.getStorageInfoSync()
      info.keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          uni.removeStorageSync(key)
        }
      })
      return true
    } catch (e) {
      console.error('Storage clear error:', e)
      return false
    }
  }
  
  // 获取所有 keys
  keys() {
    try {
      const info = uni.getStorageInfoSync()
      return info.keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''))
    } catch (e) {
      return []
    }
  }
  
  // 获取存储大小
  getSize() {
    try {
      const info = uni.getStorageInfoSync()
      return {
        currentSize: info.currentSize,
        limitSize: info.limitSize
      }
    } catch (e) {
      return { currentSize: 0, limitSize: 0 }
    }
  }
}

// 创建实例
const storage = new Storage()

// 导出便捷方法
export default storage

// 命名空间存储（用于不同模块）
export const createStorage = (namespace) => {
  return new Storage(`${STORAGE_PREFIX}${namespace}_`)
}

// 使用示例
import storage, { createStorage } from '@/utils/storage'

// 基本使用
storage.set('token', 'xxx')
storage.set('userInfo', { name: '张三', age: 25 })
storage.set('tempData', { foo: 'bar' }, 3600)  // 1小时后过期

const token = storage.get('token')
const userInfo = storage.get('userInfo', {})

storage.remove('tempData')
storage.clear()

// 命名空间存储
const userStorage = createStorage('user')
userStorage.set('profile', { name: '张三' })
const profile = userStorage.get('profile')

const cacheStorage = createStorage('cache')
cacheStorage.set('homeData', data, 300)  // 缓存5分钟
```

### 13.2 数据缓存策略

```javascript
// utils/cache.js
import storage from './storage'

class CacheManager {
  constructor() {
    this.memoryCache = new Map()
  }
  
  // 内存缓存（最快，但刷新后丢失）
  setMemory(key, value, ttl = 0) {
    const item = {
      value,
      expire: ttl > 0 ? Date.now() + ttl * 1000 : 0
    }
    this.memoryCache.set(key, item)
  }
  
  getMemory(key) {
    const item = this.memoryCache.get(key)
    if (!item) return null
    
    if (item.expire > 0 && Date.now() > item.expire) {
      this.memoryCache.delete(key)
      return null
    }
    
    return item.value
  }
  
  // 本地存储缓存
  setStorage(key, value, ttl = 0) {
    storage.set(`cache_${key}`, value, ttl)
  }
  
  getStorage(key) {
    return storage.get(`cache_${key}`)
  }
  
  // 智能缓存（先内存，后本地）
  async get(key, fetcher, options = {}) {
    const { 
      ttl = 300,           // 缓存时间（秒）
      forceRefresh = false, // 强制刷新
      storage: useStorage = true  // 是否使用本地存储
    } = options
    
    const cacheKey = typeof key === 'function' ? key() : key
    
    // 不强制刷新时，先查缓存
    if (!forceRefresh) {
      // 先查内存
      const memoryData = this.getMemory(cacheKey)
      if (memoryData !== null) {
        return memoryData
      }
      
      // 再查本地存储
      if (useStorage) {
        const storageData = this.getStorage(cacheKey)
        if (storageData !== null) {
          // 同时写入内存
          this.setMemory(cacheKey, storageData, ttl)
          return storageData
        }
      }
    }
    
    // 缓存不存在或强制刷新，获取新数据
    const data = await fetcher()
    
    // 写入缓存
    this.setMemory(cacheKey, data, ttl)
    if (useStorage) {
      this.setStorage(cacheKey, data, ttl)
    }
    
    return data
  }
  
  // 清除指定缓存
  remove(key) {
    this.memoryCache.delete(key)
    storage.remove(`cache_${key}`)
  }
  
  // 清除所有缓存
  clear() {
    this.memoryCache.clear()
    const keys = storage.keys()
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        storage.remove(key)
      }
    })
  }
}

export default new CacheManager()

// 使用示例
import cache from '@/utils/cache'
import { goodsApi } from '@/api'

// 获取分类（带缓存）
const getCategories = async (forceRefresh = false) => {
  return cache.get(
    'goods_categories',
    () => goodsApi.getCategories(),
    { ttl: 3600, forceRefresh }  // 缓存1小时
  )
}

// 获取商品详情（按 ID 缓存）
const getGoodsDetail = async (id, forceRefresh = false) => {
  return cache.get(
    `goods_detail_${id}`,
    () => goodsApi.getDetail(id),
    { ttl: 300, forceRefresh }  // 缓存5分钟
  )
}

// 强制刷新
const categories = await getCategories(true)

// 清除缓存
cache.remove('goods_categories')
```

---

## 14. 样式系统

### 14.1 rpx 单位与适配

```scss
// rpx 单位说明
// 1rpx = 屏幕宽度 / 750
// 在 750px 宽度的设计稿上，1rpx = 1px
// 在 375px 宽度的 iPhone 6 上，1rpx = 0.5px

// 推荐使用 750px 宽度的设计稿

// 使用示例
.container {
  width: 750rpx;       // 满宽
  padding: 20rpx;      // 间距
  font-size: 28rpx;    // 字体大小
  border-radius: 12rpx; // 圆角
}

// px 与 rpx 换算
// 设计稿 750px: 直接使用设计稿标注的数值 + rpx
// 设计稿 375px: 设计稿数值 * 2 + rpx

// 常用尺寸规范（基于 750rpx 设计稿）
$spacing-xs: 10rpx;
$spacing-sm: 20rpx;
$spacing-md: 30rpx;
$spacing-lg: 40rpx;
$spacing-xl: 60rpx;

$font-size-xs: 20rpx;
$font-size-sm: 24rpx;
$font-size-base: 28rpx;
$font-size-md: 32rpx;
$font-size-lg: 36rpx;
$font-size-xl: 44rpx;

$border-radius-sm: 8rpx;
$border-radius-base: 12rpx;
$border-radius-lg: 20rpx;
$border-radius-circle: 50%;
```

### 14.2 全局样式变量

```scss
// uni.scss（全局 SCSS 变量）

// 主题色
$uni-primary: #007AFF;
$uni-primary-light: #409EFF;
$uni-primary-dark: #0062CC;

$uni-success: #4CD964;
$uni-warning: #F0AD4E;
$uni-error: #DD524D;
$uni-info: #909399;

// 文字颜色
$uni-text-color: #333333;
$uni-text-color-secondary: #666666;
$uni-text-color-placeholder: #999999;
$uni-text-color-disable: #C0C4CC;
$uni-text-color-inverse: #FFFFFF;

// 背景色
$uni-bg-color: #FFFFFF;
$uni-bg-color-grey: #F8F8F8;
$uni-bg-color-hover: #F1F1F1;
$uni-bg-color-mask: rgba(0, 0, 0, 0.4);

// 边框颜色
$uni-border-color: #E5E5E5;
$uni-border-color-light: #F2F2F2;

// 字体大小
$uni-font-size-sm: 24rpx;
$uni-font-size-base: 28rpx;
$uni-font-size-lg: 32rpx;

// 间距
$uni-spacing-sm: 20rpx;
$uni-spacing-base: 30rpx;
$uni-spacing-lg: 40rpx;

// 圆角
$uni-border-radius-sm: 8rpx;
$uni-border-radius-base: 12rpx;
$uni-border-radius-lg: 20rpx;
$uni-border-radius-circle: 50%;

// 阴影
$uni-shadow-sm: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
$uni-shadow-base: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
$uni-shadow-lg: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);

// 动画
$uni-transition-base: all 0.3s ease;

// 导航栏高度
$uni-navbar-height: 44px;
$uni-tabbar-height: 50px;

// 安全区域
// --status-bar-height: 系统状态栏高度（CSS 变量）
// --window-top: 内容区域顶部位置
// --window-bottom: 内容区域底部位置
```

### 14.3 公共样式类

```scss
// styles/common.scss

// Flex 布局
.flex {
  display: flex;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-1 {
  flex: 1;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.justify-start {
  justify-content: flex-start;
}

.justify-center {
  justify-content: center;
}

.justify-end {
  justify-content: flex-end;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.align-start {
  align-items: flex-start;
}

.align-center {
  align-items: center;
}

.align-end {
  align-items: flex-end;
}

.align-stretch {
  align-items: stretch;
}

// 间距
@for $i from 0 through 10 {
  .mt-#{$i * 10} {
    margin-top: #{$i * 10}rpx;
  }
  .mb-#{$i * 10} {
    margin-bottom: #{$i * 10}rpx;
  }
  .ml-#{$i * 10} {
    margin-left: #{$i * 10}rpx;
  }
  .mr-#{$i * 10} {
    margin-right: #{$i * 10}rpx;
  }
  .mx-#{$i * 10} {
    margin-left: #{$i * 10}rpx;
    margin-right: #{$i * 10}rpx;
  }
  .my-#{$i * 10} {
    margin-top: #{$i * 10}rpx;
    margin-bottom: #{$i * 10}rpx;
  }
  
  .pt-#{$i * 10} {
    padding-top: #{$i * 10}rpx;
  }
  .pb-#{$i * 10} {
    padding-bottom: #{$i * 10}rpx;
  }
  .pl-#{$i * 10} {
    padding-left: #{$i * 10}rpx;
  }
  .pr-#{$i * 10} {
    padding-right: #{$i * 10}rpx;
  }
  .px-#{$i * 10} {
    padding-left: #{$i * 10}rpx;
    padding-right: #{$i * 10}rpx;
  }
  .py-#{$i * 10} {
    padding-top: #{$i * 10}rpx;
    padding-bottom: #{$i * 10}rpx;
  }
}

// 文字
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-bold {
  font-weight: bold;
}

.text-primary {
  color: $uni-primary;
}

.text-success {
  color: $uni-success;
}

.text-warning {
  color: $uni-warning;
}

.text-error {
  color: $uni-error;
}

.text-muted {
  color: $uni-text-color-placeholder;
}

// 文字省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 背景
.bg-white {
  background-color: #fff;
}

.bg-grey {
  background-color: $uni-bg-color-grey;
}

.bg-primary {
  background-color: $uni-primary;
}

// 边框
.border {
  border: 1rpx solid $uni-border-color;
}

.border-top {
  border-top: 1rpx solid $uni-border-color;
}

.border-bottom {
  border-bottom: 1rpx solid $uni-border-color;
}

.border-radius {
  border-radius: $uni-border-radius-base;
}

.border-radius-lg {
  border-radius: $uni-border-radius-lg;
}

.border-radius-circle {
  border-radius: 50%;
}

// 阴影
.shadow {
  box-shadow: $uni-shadow-base;
}

// 宽高
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

// 定位
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

// 安全区域
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 14.4 响应式布局

```vue
<template>
  <view class="container">
    <!-- 使用 CSS 变量 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      导航栏
    </view>
    
    <!-- 响应式网格 -->
    <view class="grid">
      <view class="grid-item" v-for="i in 6" :key="i">{{ i }}</view>
    </view>
    
    <!-- 安全区域 -->
    <view class="footer safe-area-bottom">
      底部按钮
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      windowWidth: 0,
      windowHeight: 0
    }
  },
  
  computed: {
    // 计算列数
    columns() {
      if (this.windowWidth >= 750) return 4
      if (this.windowWidth >= 500) return 3
      return 2
    }
  },
  
  onLoad() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
    this.windowWidth = systemInfo.windowWidth
    this.windowHeight = systemInfo.windowHeight
    
    // 监听窗口大小变化
    uni.onWindowResize((res) => {
      this.windowWidth = res.size.windowWidth
      this.windowHeight = res.size.windowHeight
    })
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  height: 44px;
  background: $uni-primary;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  
  .grid-item {
    width: calc(50% - 10rpx);
    margin: 5rpx;
    height: 200rpx;
    background: #fff;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    // 平板适配
    @media screen and (min-width: 500px) {
      width: calc(33.33% - 10rpx);
    }
    
    // 大屏适配
    @media screen and (min-width: 750px) {
      width: calc(25% - 10rpx);
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1rpx solid $uni-border-color;
}
</style>
```

---

## 15. 状态管理

### 15.1 Vuex 状态管理（Vue2）

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 全局状态
    systemInfo: null,
    networkType: 'unknown'
  },
  
  getters: {
    isIOS: state => state.systemInfo?.platform === 'ios',
    isAndroid: state => state.systemInfo?.platform === 'android',
    statusBarHeight: state => state.systemInfo?.statusBarHeight || 0
  },
  
  mutations: {
    SET_SYSTEM_INFO(state, info) {
      state.systemInfo = info
    },
    SET_NETWORK_TYPE(state, type) {
      state.networkType = type
    }
  },
  
  actions: {
    // 初始化应用
    async initApp({ commit }) {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      commit('SET_SYSTEM_INFO', systemInfo)
      
      // 获取网络状态
      const { networkType } = await uni.getNetworkType()
      commit('SET_NETWORK_TYPE', networkType)
      
      // 监听网络变化
      uni.onNetworkStatusChange(res => {
        commit('SET_NETWORK_TYPE', res.networkType)
      })
    }
  },
  
  modules: {
    user,
    cart
  }
})

export default store

// main.js
import store from './store'

const app = new Vue({
  store,
  ...App
})
```

```javascript
// store/modules/user.js
import { userApi } from '@/api'

const state = {
  token: uni.getStorageSync('token') || '',
  userInfo: uni.getStorageSync('userInfo') || null,
  isLogin: !!uni.getStorageSync('token')
}

const getters = {
  userId: state => state.userInfo?.id,
  nickname: state => state.userInfo?.nickname || '未登录',
  avatar: state => state.userInfo?.avatar || '/static/default-avatar.png'
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    state.isLogin = !!token
    if (token) {
      uni.setStorageSync('token', token)
    } else {
      uni.removeStorageSync('token')
    }
  },
  
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    if (userInfo) {
      uni.setStorageSync('userInfo', userInfo)
    } else {
      uni.removeStorageSync('userInfo')
    }
  }
}

const actions = {
  // 登录
  async login({ commit }, { username, password }) {
    const { token, userInfo } = await userApi.login({ username, password })
    commit('SET_TOKEN', token)
    commit('SET_USER_INFO', userInfo)
    return userInfo
  },
  
  // 获取用户信息
  async getUserInfo({ commit, state }) {
    if (!state.token) return null
    
    const userInfo = await userApi.getInfo()
    commit('SET_USER_INFO', userInfo)
    return userInfo
  },
  
  // 登出
  async logout({ commit }) {
    try {
      await userApi.logout()
    } finally {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', null)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

```javascript
// store/modules/cart.js
import { cartApi } from '@/api'

const state = {
  list: [],
  checkedIds: []
}

const getters = {
  // 购物车数量
  count: state => state.list.reduce((sum, item) => sum + item.count, 0),
  
  // 选中的商品
  checkedItems: state => state.list.filter(item => state.checkedIds.includes(item.id)),
  
  // 选中商品总价
  totalPrice: (state, getters) => {
    return getters.checkedItems.reduce((sum, item) => {
      return sum + item.price * item.count
    }, 0)
  },
  
  // 是否全选
  isAllChecked: state => {
    return state.list.length > 0 && state.checkedIds.length === state.list.length
  }
}

const mutations = {
  SET_LIST(state, list) {
    state.list = list
  },
  
  SET_CHECKED_IDS(state, ids) {
    state.checkedIds = ids
  },
  
  ADD_ITEM(state, item) {
    const existing = state.list.find(i => i.goodsId === item.goodsId && i.skuId === item.skuId)
    if (existing) {
      existing.count += item.count
    } else {
      state.list.push(item)
    }
  },
  
  UPDATE_COUNT(state, { id, count }) {
    const item = state.list.find(i => i.id === id)
    if (item) {
      item.count = count
    }
  },
  
  REMOVE_ITEMS(state, ids) {
    state.list = state.list.filter(item => !ids.includes(item.id))
    state.checkedIds = state.checkedIds.filter(id => !ids.includes(id))
  }
}

const actions = {
  // 获取购物车列表
  async getList({ commit }) {
    const list = await cartApi.getList()
    commit('SET_LIST', list)
    // 默认全选
    commit('SET_CHECKED_IDS', list.map(item => item.id))
  },
  
  // 添加到购物车
  async addItem({ commit }, item) {
    const newItem = await cartApi.add(item)
    commit('ADD_ITEM', newItem)
    uni.showToast({ title: '添加成功' })
  },
  
  // 更新数量
  async updateCount({ commit }, { id, count }) {
    await cartApi.update(id, { count })
    commit('UPDATE_COUNT', { id, count })
  },
  
  // 删除商品
  async removeItems({ commit }, ids) {
    await cartApi.remove(ids)
    commit('REMOVE_ITEMS', ids)
  },
  
  // 切换选中状态
  toggleCheck({ commit, state }, id) {
    const ids = [...state.checkedIds]
    const index = ids.indexOf(id)
    if (index > -1) {
      ids.splice(index, 1)
    } else {
      ids.push(id)
    }
    commit('SET_CHECKED_IDS', ids)
  },
  
  // 全选/取消全选
  toggleCheckAll({ commit, state }) {
    if (state.checkedIds.length === state.list.length) {
      commit('SET_CHECKED_IDS', [])
    } else {
      commit('SET_CHECKED_IDS', state.list.map(item => item.id))
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

```vue
<!-- 在组件中使用 Vuex -->
<template>
  <view>
    <view>欢迎，{{ nickname }}</view>
    <view>购物车数量：{{ cartCount }}</view>
    <button @click="handleLogout">退出登录</button>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    // 映射 state
    ...mapState('user', ['isLogin', 'userInfo']),
    ...mapState('cart', ['list']),
    
    // 映射 getters
    ...mapGetters('user', ['nickname', 'avatar']),
    ...mapGetters('cart', ['count', 'totalPrice']),
    
    // 别名
    cartCount() {
      return this.$store.getters['cart/count']
    }
  },
  
  methods: {
    // 映射 actions
    ...mapActions('user', ['logout']),
    ...mapActions('cart', ['getList', 'addItem']),
    
    async handleLogout() {
      await this.logout()
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}
</script>
```

### 15.2 Pinia 状态管理（Vue3）

```javascript
// store/index.js
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// main.js
import { createSSRApp } from 'vue'
import pinia from './store'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return { app }
}
```

```javascript
// store/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(uni.getStorageSync('userInfo') || null)
  
  // Getters
  const isLogin = computed(() => !!token.value)
  const userId = computed(() => userInfo.value?.id)
  const nickname = computed(() => userInfo.value?.nickname || '未登录')
  const avatar = computed(() => userInfo.value?.avatar || '/static/default-avatar.png')
  
  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      uni.setStorageSync('token', newToken)
    } else {
      uni.removeStorageSync('token')
    }
  }
  
  const setUserInfo = (info) => {
    userInfo.value = info
    if (info) {
      uni.setStorageSync('userInfo', info)
    } else {
      uni.removeStorageSync('userInfo')
    }
  }
  
  const login = async (credentials) => {
    const { token: newToken, userInfo: newUserInfo } = await userApi.login(credentials)
    setToken(newToken)
    setUserInfo(newUserInfo)
    return newUserInfo
  }
  
  const getUserInfo = async () => {
    if (!token.value) return null
    const info = await userApi.getInfo()
    setUserInfo(info)
    return info
  }
  
  const logout = async () => {
    try {
      await userApi.logout()
    } finally {
      setToken('')
      setUserInfo(null)
    }
  }
  
  return {
    // State
    token,
    userInfo,
    
    // Getters
    isLogin,
    userId,
    nickname,
    avatar,
    
    // Actions
    setToken,
    setUserInfo,
    login,
    getUserInfo,
    logout
  }
})
```

```javascript
// store/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api'

export const useCartStore = defineStore('cart', () => {
  // State
  const list = ref([])
  const checkedIds = ref([])
  
  // Getters
  const count = computed(() => list.value.reduce((sum, item) => sum + item.count, 0))
  
  const checkedItems = computed(() => 
    list.value.filter(item => checkedIds.value.includes(item.id))
  )
  
  const totalPrice = computed(() => 
    checkedItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
  )
  
  const isAllChecked = computed(() => 
    list.value.length > 0 && checkedIds.value.length === list.value.length
  )
  
  // Actions
  const getList = async () => {
    const data = await cartApi.getList()
    list.value = data
    checkedIds.value = data.map(item => item.id)
  }
  
  const addItem = async (item) => {
    const newItem = await cartApi.add(item)
    const existing = list.value.find(i => i.goodsId === item.goodsId && i.skuId === item.skuId)
    if (existing) {
      existing.count += item.count
    } else {
      list.value.push(newItem)
    }
    uni.showToast({ title: '添加成功' })
  }
  
  const updateCount = async (id, count) => {
    await cartApi.update(id, { count })
    const item = list.value.find(i => i.id === id)
    if (item) {
      item.count = count
    }
  }
  
  const removeItems = async (ids) => {
    await cartApi.remove(ids)
    list.value = list.value.filter(item => !ids.includes(item.id))
    checkedIds.value = checkedIds.value.filter(id => !ids.includes(id))
  }
  
  const toggleCheck = (id) => {
    const index = checkedIds.value.indexOf(id)
    if (index > -1) {
      checkedIds.value.splice(index, 1)
    } else {
      checkedIds.value.push(id)
    }
  }
  
  const toggleCheckAll = () => {
    if (isAllChecked.value) {
      checkedIds.value = []
    } else {
      checkedIds.value = list.value.map(item => item.id)
    }
  }
  
  return {
    list,
    checkedIds,
    count,
    checkedItems,
    totalPrice,
    isAllChecked,
    getList,
    addItem,
    updateCount,
    removeItems,
    toggleCheck,
    toggleCheckAll
  }
})
```

```vue
<!-- 在组件中使用 Pinia -->
<template>
  <view>
    <view>欢迎，{{ userStore.nickname }}</view>
    <view>购物车数量：{{ cartStore.count }}</view>
    <button @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useCartStore } from '@/store/cart'

const userStore = useUserStore()
const cartStore = useCartStore()

const handleLogout = async () => {
  await userStore.logout()
  uni.reLaunch({ url: '/pages/login/login' })
}

// 解构时保持响应式
const { nickname, avatar, isLogin } = storeToRefs(userStore)
const { count, totalPrice } = storeToRefs(cartStore)
</script>
```

---

## 16. 原生能力

### 16.1 支付功能

```javascript
// utils/pay.js

// 微信支付
export const wxPay = (orderInfo) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.requestPayment({
      provider: 'wxpay',
      timeStamp: orderInfo.timeStamp,
      nonceStr: orderInfo.nonceStr,
      package: orderInfo.package,
      signType: orderInfo.signType,
      paySign: orderInfo.paySign,
      success: resolve,
      fail: reject
    })
    // #endif
    
    // #ifdef APP-PLUS
    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: orderInfo,  // 后端返回的支付参数
      success: resolve,
      fail: reject
    })
    // #endif
  })
}

// 支付宝支付
export const aliPay = (orderInfo) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    my.tradePay({
      tradeNO: orderInfo.tradeNo,
      success: resolve,
      fail: reject
    })
    // #endif
    
    // #ifdef APP-PLUS
    uni.requestPayment({
      provider: 'alipay',
      orderInfo: orderInfo,  // 支付宝订单字符串
      success: resolve,
      fail: reject
    })
    // #endif
  })
}

// 统一支付入口
export const pay = async (orderId, payType) => {
  // 1. 获取支付参数
  const orderInfo = await http.post('/pay/create', { orderId, payType })
  
  // 2. 调起支付
  try {
    if (payType === 'wxpay') {
      await wxPay(orderInfo)
    } else if (payType === 'alipay') {
      await aliPay(orderInfo)
    }
    
    // 3. 支付成功
    uni.showToast({ title: '支付成功' })
    return true
  } catch (e) {
    if (e.errMsg?.includes('cancel')) {
      uni.showToast({ title: '已取消支付', icon: 'none' })
    } else {
      uni.showToast({ title: '支付失败', icon: 'none' })
    }
    return false
  }
}

// 使用示例
import { pay } from '@/utils/pay'

const handlePay = async () => {
  const success = await pay(orderId, 'wxpay')
  if (success) {
    // 跳转订单详情
    uni.redirectTo({ url: `/pages/order/detail?id=${orderId}` })
  }
}
```

### 16.2 分享功能

```javascript
// 页面分享（小程序）
export default {
  // 分享给朋友
  onShareAppMessage(res) {
    // res.from: 'button' 或 'menu'
    // res.target: 触发分享的按钮
    
    return {
      title: '分享标题',
      path: '/pages/index/index?shareId=' + this.userId,
      imageUrl: '/static/share.png'
    }
  },
  
  // 分享到朋友圈（微信小程序）
  onShareTimeline() {
    return {
      title: '朋友圈分享标题',
      query: 'shareId=' + this.userId,
      imageUrl: '/static/share.png'
    }
  }
}

// App 端分享
export const share = (options) => {
  // #ifdef APP-PLUS
  uni.share({
    provider: options.provider || 'weixin',  // weixin, qq
    scene: options.scene || 'WXSceneSession',  // WXSceneSession, WXSceneTimeline
    type: options.type || 0,  // 0: 图文, 1: 纯文字, 2: 纯图片, 3: 音乐, 4: 视频, 5: 小程序
    title: options.title,
    summary: options.summary,
    href: options.href,
    imageUrl: options.imageUrl,
    success: () => {
      uni.showToast({ title: '分享成功' })
    },
    fail: (err) => {
      console.error('分享失败', err)
    }
  })
  // #endif
  
  // #ifdef H5
  // H5 可以使用第三方分享 SDK
  // #endif
}

// 使用系统分享
export const shareWithSystem = (options) => {
  // #ifdef APP-PLUS
  plus.share.sendWithSystem({
    type: options.type || 'text',
    content: options.content,
    href: options.href
  }, () => {
    console.log('分享成功')
  }, (err) => {
    console.error('分享失败', err)
  })
  // #endif
}
```

### 16.3 推送通知

```javascript
// utils/push.js

// 获取推送权限
export const getPushPermission = () => {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    const isIOS = plus.os.name === 'iOS'
    
    if (isIOS) {
      // iOS 检查推送权限
      plus.push.getClientInfoAsync((info) => {
        resolve(!!info.token)
      }, () => {
        resolve(false)
      })
    } else {
      // Android 默认有权限
      resolve(true)
    }
    // #endif
    
    // #ifndef APP-PLUS
    resolve(false)
    // #endif
  })
}

// 获取推送 Token
export const getPushToken = () => {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    plus.push.getClientInfoAsync((info) => {
      resolve(info.clientid)
    }, reject)
    // #endif
    
    // #ifndef APP-PLUS
    reject(new Error('不支持推送'))
    // #endif
  })
}

// 监听推送消息
export const onPushMessage = (callback) => {
  // #ifdef APP-PLUS
  plus.push.addEventListener('receive', (msg) => {
    console.log('收到推送:', msg)
    callback(msg, 'receive')
  })
  
  plus.push.addEventListener('click', (msg) => {
    console.log('点击推送:', msg)
    callback(msg, 'click')
  })
  // #endif
}

// 创建本地通知
export const createLocalNotification = (options) => {
  // #ifdef APP-PLUS
  plus.push.createMessage(
    options.content,
    options.payload,
    {
      title: options.title,
      cover: options.cover !== false,  // 是否覆盖上一条
      sound: options.sound || 'system',
      delay: options.delay || 0  // 延迟秒数
    }
  )
  // #endif
}

// 清除通知
export const clearNotifications = () => {
  // #ifdef APP-PLUS
  plus.push.clear()
  // #endif
}

// 在 App.vue 中初始化
export default {
  onLaunch() {
    // #ifdef APP-PLUS
    this.initPush()
    // #endif
  },
  
  methods: {
    async initPush() {
      // 获取 token 并上报服务器
      const token = await getPushToken()
      await http.post('/user/push-token', { token })
      
      // 监听推送
      onPushMessage((msg, type) => {
        if (type === 'click') {
          // 点击推送，跳转对应页面
          const payload = typeof msg.payload === 'string' 
            ? JSON.parse(msg.payload) 
            : msg.payload
          
          if (payload.type === 'order') {
            uni.navigateTo({ url: `/pages/order/detail?id=${payload.orderId}` })
          } else if (payload.type === 'message') {
            uni.navigateTo({ url: `/pages/message/detail?id=${payload.messageId}` })
          }
        }
      })
    }
  }
}
```

### 16.4 生物识别

```javascript
// utils/biometric.js

// 检查是否支持生物识别
export const checkBiometric = () => {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    plus.fingerprint.isSupport() || plus.faceid?.isSupport()
      ? resolve(true)
      : resolve(false)
    // #endif
    
    // #ifdef MP-WEIXIN
    uni.checkIsSupportSoterAuthentication({
      success: (res) => {
        resolve(res.supportMode.length > 0)
      },
      fail: () => resolve(false)
    })
    // #endif
    
    // #ifndef APP-PLUS || MP-WEIXIN
    resolve(false)
    // #endif
  })
}

// 生物识别认证
export const authenticate = (options = {}) => {
  const { title = '请验证身份', fallback = true } = options
  
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    const isIOS = plus.os.name === 'iOS'
    
    if (isIOS && plus.faceid?.isSupport()) {
      // Face ID
      plus.faceid.authenticate(
        title,
        resolve,
        (err) => {
          if (fallback && err.code === -2) {
            // 用户取消，可以使用密码
          }
          reject(err)
        }
      )
    } else if (plus.fingerprint.isSupport()) {
      // Touch ID / 指纹
      plus.fingerprint.authenticate(
        title,
        resolve,
        reject
      )
    } else {
      reject(new Error('设备不支持生物识别'))
    }
    // #endif
    
    // #ifdef MP-WEIXIN
    uni.startSoterAuthentication({
      requestAuthModes: ['fingerPrint', 'facial'],
      challenge: Date.now().toString(),
      authContent: title,
      success: resolve,
      fail: reject
    })
    // #endif
  })
}

// 使用示例
const handlePayWithBiometric = async () => {
  try {
    const supported = await checkBiometric()
    if (!supported) {
      // 使用密码支付
      return
    }
    
    await authenticate({ title: '请验证指纹/面容以完成支付' })
    // 验证通过，执行支付
    await pay(orderId)
  } catch (e) {
    console.error('生物识别失败', e)
  }
}
```

---

## 17. 插件与扩展

### 17.1 uni_modules 插件

```bash
# 插件市场安装
# 在 HBuilderX 中：工具 -> 插件安装

# 目录结构
uni_modules/
├── uni-ui/                    # uni-ui 组件库
│   ├── components/
│   │   ├── uni-badge/
│   │   ├── uni-card/
│   │   └── ...
│   ├── changelog.md
│   └── package.json
├── uni-id/                    # uni-id 用户体系
└── custom-plugin/             # 自定义插件
```

```javascript
// 使用 uni-ui 组件
// pages.json 配置 easycom
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  }
}
```

```vue
<!-- 直接使用，无需 import -->
<template>
  <view>
    <uni-badge text="1" type="error"></uni-badge>
    <uni-card title="标题" sub-title="副标题">
      <text>卡片内容</text>
    </uni-card>
    <uni-list>
      <uni-list-item title="列表项" show-arrow @click="onClick"></uni-list-item>
    </uni-list>
    <uni-popup ref="popup" type="bottom">
      <view>弹窗内容</view>
    </uni-popup>
    <uni-icons type="search" size="24"></uni-icons>
  </view>
</template>
```

### 17.2 原生插件（App）

```javascript
// manifest.json 配置原生插件
{
  "app-plus": {
    "nativePlugins": [
      {
        "plugins": [
          {
            "type": "module",
            "name": "TestPlugin",
            "class": "com.example.TestPlugin"
          }
        ]
      }
    ]
  }
}

// 使用原生插件
// #ifdef APP-PLUS
const testPlugin = uni.requireNativePlugin('TestPlugin')

testPlugin.doSomething({
  param1: 'value1'
}, (result) => {
  console.log('原生插件返回:', result)
})
// #endif

// 使用 plus API
// #ifdef APP-PLUS
// 原生弹窗
plus.nativeUI.confirm('确定要删除吗？', (e) => {
  if (e.index === 0) {
    // 点击确定
  }
}, '提示', ['确定', '取消'])

// 原生加载框
plus.nativeUI.showWaiting('加载中...')
setTimeout(() => {
  plus.nativeUI.closeWaiting()
}, 2000)

// 第三方分享
plus.share.getServices((services) => {
  const wechat = services.find(s => s.id === 'weixin')
  if (wechat) {
    wechat.send({
      type: 'web',
      title: '分享标题',
      content: '分享内容',
      href: 'https://example.com',
      thumbs: ['/static/share.png']
    })
  }
})
// #endif
```

### 17.3 自定义组件库

```javascript
// components/my-ui/index.js
import MyButton from './my-button/my-button.vue'
import MyInput from './my-input/my-input.vue'
import MyModal from './my-modal/my-modal.vue'
import MyToast from './my-toast/my-toast.vue'

const components = {
  MyButton,
  MyInput,
  MyModal,
  MyToast
}

export default {
  install(Vue) {
    Object.keys(components).forEach(name => {
      Vue.component(name, components[name])
    })
  }
}

// main.js
import MyUI from '@/components/my-ui'
Vue.use(MyUI)
```

```vue
<!-- components/my-ui/my-button/my-button.vue -->
<template>
  <button 
    :class="['my-btn', `my-btn--${type}`, `my-btn--${size}`, { 'my-btn--plain': plain, 'my-btn--disabled': disabled, 'my-btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <view v-if="loading" class="my-btn__loading"></view>
    <text class="my-btn__text"><slot></slot></text>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'primary', 'success', 'warning', 'danger'].includes(v)
    },
    size: {
      type: String,
      default: 'default',
      validator: (v) => ['mini', 'small', 'default', 'large'].includes(v)
    },
    plain: Boolean,
    disabled: Boolean,
    loading: Boolean
  },
  
  emits: ['click'],
  
  methods: {
    handleClick(e) {
      if (this.disabled || this.loading) return
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
.my-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 28rpx;
  transition: all 0.3s;
  
  // 类型
  &--default {
    background: #fff;
    color: #333;
    border: 1rpx solid #ddd;
  }
  
  &--primary {
    background: $uni-primary;
    color: #fff;
    border: none;
  }
  
  &--success {
    background: $uni-success;
    color: #fff;
  }
  
  // 尺寸
  &--mini {
    padding: 8rpx 16rpx;
    font-size: 24rpx;
  }
  
  &--small {
    padding: 12rpx 24rpx;
    font-size: 26rpx;
  }
  
  &--default {
    padding: 16rpx 32rpx;
  }
  
  &--large {
    padding: 20rpx 40rpx;
    font-size: 32rpx;
  }
  
  // 镂空
  &--plain {
    background: transparent;
    
    &.my-btn--primary {
      color: $uni-primary;
      border: 1rpx solid $uni-primary;
    }
  }
  
  // 禁用
  &--disabled {
    opacity: 0.6;
  }
  
  // 加载
  &__loading {
    width: 32rpx;
    height: 32rpx;
    border: 4rpx solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10rpx;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

---

## 18. 性能优化

### 18.1 代码层面优化

```vue
<script>
export default {
  // 1. 数据优化 - 只定义需要响应式的数据
  data() {
    return {
      // 需要响应式的数据
      list: [],
      loading: false,
      
      // 不需要响应式的大量数据，不放在 data 中
      // 而是使用普通属性
    }
  },
  
  created() {
    // 非响应式数据
    this.bigData = []
    this.timer = null
    this.observer = null
  },
  
  // 2. 合理使用计算属性缓存
  computed: {
    // 好：复杂计算使用 computed 缓存
    filteredList() {
      return this.list.filter(item => item.visible)
    },
    
    totalPrice() {
      return this.list.reduce((sum, item) => sum + item.price, 0)
    }
  },
  
  methods: {
    // 3. 避免频繁更新 - 使用节流/防抖
    onScroll: throttle(function(e) {
      this.scrollTop = e.detail.scrollTop
    }, 100),
    
    onInput: debounce(function(e) {
      this.keyword = e.detail.value
      this.search()
    }, 300),
    
    // 4. 长列表优化 - 分页加载
    async loadMore() {
      if (this.loading || !this.hasMore) return
      
      this.loading = true
      const newItems = await fetchList(this.page)
      
      // 使用 push 而不是重新赋值整个数组
      this.list.push(...newItems)
      this.page++
      this.hasMore = newItems.length >= this.pageSize
      this.loading = false
    },
    
    // 5. 避免在模板中使用复杂表达式
    // 不好：<view>{{ list.filter(i => i.active).map(i => i.name).join(',') }}</view>
    // 好：使用计算属性
  },
  
  // 6. 及时清理
  beforeDestroy() {
    // 清理定时器
    if (this.timer) {
      clearTimeout(this.timer)
    }
    
    // 清理事件监听
    uni.$off('event-name')
    
    // 清理观察者
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// 节流函数
function throttle(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 防抖函数
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
</script>
```

### 18.2 图片优化

```vue
<template>
  <view>
    <!-- 1. 懒加载 -->
    <image 
      v-for="img in images" 
      :key="img.id"
      :src="img.url"
      lazy-load
      mode="aspectFill"
    ></image>
    
    <!-- 2. 使用合适的图片格式和尺寸 -->
    <image :src="getOptimizedUrl(imageUrl)" mode="widthFix"></image>
    
    <!-- 3. 骨架屏占位 -->
    <view class="image-wrapper">
      <view v-if="!imageLoaded" class="skeleton"></view>
      <image 
        :src="imageUrl" 
        @load="imageLoaded = true"
        :class="{ loaded: imageLoaded }"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageLoaded: false
    }
  },
  
  methods: {
    // 根据屏幕尺寸返回合适的图片
    getOptimizedUrl(url) {
      const systemInfo = uni.getSystemInfoSync()
      const width = systemInfo.windowWidth * systemInfo.pixelRatio
      
      // 假设后端支持图片裁剪参数
      if (url.includes('cdn.example.com')) {
        return `${url}?w=${Math.min(width, 750)}&q=80`
      }
      
      return url
    }
  }
}
</script>

<style>
.image-wrapper {
  position: relative;
}

.skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.image-wrapper image {
  opacity: 0;
  transition: opacity 0.3s;
}

.image-wrapper image.loaded {
  opacity: 1;
}
</style>
```

### 18.3 分包加载

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": { "navigationBarTitleText": "首页" }
    },
    {
      "path": "pages/user/user",
      "style": { "navigationBarTitleText": "我的" }
    }
  ],
  
  // 分包配置
  "subPackages": [
    {
      "root": "pagesA",
      "name": "goods",
      "pages": [
        {
          "path": "list/list",
          "style": { "navigationBarTitleText": "商品列表" }
        },
        {
          "path": "detail/detail",
          "style": { "navigationBarTitleText": "商品详情" }
        }
      ]
    },
    {
      "root": "pagesB",
      "name": "order",
      "pages": [
        {
          "path": "list/list",
          "style": { "navigationBarTitleText": "订单列表" }
        },
        {
          "path": "detail/detail",
          "style": { "navigationBarTitleText": "订单详情" }
        }
      ]
    }
  ],
  
  // 分包预加载
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["goods"]
    },
    "pages/user/user": {
      "network": "wifi",
      "packages": ["order"]
    }
  }
}
```

### 18.4 长列表优化

```vue
<template>
  <view class="container">
    <!-- 使用 scroll-view 虚拟列表 -->
    <scroll-view 
      scroll-y 
      class="scroll-list"
      @scroll="onScroll"
      @scrolltolower="loadMore"
    >
      <!-- 上方占位 -->
      <view :style="{ height: topHeight + 'px' }"></view>
      
      <!-- 可视区域列表 -->
      <view 
        v-for="item in visibleList" 
        :key="item.id"
        class="list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </view>
      
      <!-- 下方占位 -->
      <view :style="{ height: bottomHeight + 'px' }"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],           // 全部数据
      visibleList: [],    // 可视数据
      itemHeight: 100,    // 每项高度
      visibleCount: 10,   // 可视数量
      startIndex: 0,      // 起始索引
      scrollTop: 0
    }
  },
  
  computed: {
    endIndex() {
      return Math.min(this.startIndex + this.visibleCount + 2, this.list.length)
    },
    
    topHeight() {
      return this.startIndex * this.itemHeight
    },
    
    bottomHeight() {
      return (this.list.length - this.endIndex) * this.itemHeight
    }
  },
  
  watch: {
    startIndex() {
      this.updateVisibleList()
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    async loadData() {
      // 加载大量数据
      this.list = await fetchBigList()
      this.updateVisibleList()
    },
    
    updateVisibleList() {
      this.visibleList = this.list.slice(this.startIndex, this.endIndex)
    },
    
    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      const newStartIndex = Math.floor(scrollTop / this.itemHeight)
      
      if (newStartIndex !== this.startIndex) {
        this.startIndex = Math.max(0, newStartIndex - 1)
      }
    },
    
    loadMore() {
      // 加载更多
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
}

.scroll-list {
  height: 100%;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #eee;
}
</style>
```

### 18.5 缓存策略

```javascript
// utils/performance.js

// 数据预加载
export const preloadData = async () => {
  // 并行预加载多个接口
  const promises = [
    http.get('/config').then(data => cache.set('config', data)),
    http.get('/categories').then(data => cache.set('categories', data)),
    http.get('/user/info').then(data => cache.set('userInfo', data))
  ]
  
  await Promise.allSettled(promises)
}

// 图片预加载
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve) => {
        uni.getImageInfo({
          src: url,
          success: resolve,
          fail: resolve
        })
      })
    })
  )
}

// 页面数据缓存
export const usePageCache = (key, fetcher, ttl = 300) => {
  return {
    data: null,
    loading: false,
    
    async load(forceRefresh = false) {
      // 先返回缓存
      if (!forceRefresh) {
        const cached = cache.get(key)
        if (cached) {
          this.data = cached
          return cached
        }
      }
      
      // 请求新数据
      this.loading = true
      try {
        this.data = await fetcher()
        cache.set(key, this.data, ttl)
        return this.data
      } finally {
        this.loading = false
      }
    },
    
    clear() {
      cache.remove(key)
      this.data = null
    }
  }
}

// 使用示例
const homeCache = usePageCache('home_data', () => http.get('/home'), 300)

export default {
  data() {
    return {
      homeData: null
    }
  },
  
  async onLoad() {
    this.homeData = await homeCache.load()
  },
  
  async onPullDownRefresh() {
    this.homeData = await homeCache.load(true)
    uni.stopPullDownRefresh()
  }
}
```

---

## 19. 调试与发布

### 19.1 调试技巧

```javascript
// 1. 使用 console
console.log('普通日志')
console.info('信息')
console.warn('警告')
console.error('错误')
console.table([{ a: 1 }, { a: 2 }])  // 表格形式
console.time('timer')
// ... 代码
console.timeEnd('timer')  // 输出耗时

// 2. 条件编译调试
// #ifdef H5
console.log('H5 环境')
// #endif

// #ifdef MP-WEIXIN
console.log('微信小程序环境')
// #endif

// 3. 调试工具封装
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log(...args) {
    if (isDev) console.log('[LOG]', ...args)
  },
  
  info(...args) {
    if (isDev) console.info('[INFO]', ...args)
  },
  
  warn(...args) {
    console.warn('[WARN]', ...args)
  },
  
  error(...args) {
    console.error('[ERROR]', ...args)
    // 生产环境可以上报错误
    if (!isDev) {
      this.report(args)
    }
  },
  
  report(args) {
    // 错误上报逻辑
    uni.request({
      url: 'https://api.example.com/error/report',
      method: 'POST',
      data: {
        message: args.map(a => String(a)).join(' '),
        time: Date.now(),
        platform: uni.getSystemInfoSync().platform
      }
    })
  }
}

// 4. 性能监控
export const performance = {
  marks: {},
  
  mark(name) {
    this.marks[name] = Date.now()
  },
  
  measure(name, startMark, endMark) {
    const start = this.marks[startMark] || 0
    const end = endMark ? this.marks[endMark] : Date.now()
    const duration = end - start
    
    console.log(`[Performance] ${name}: ${duration}ms`)
    return duration
  }
}

// 使用
performance.mark('fetchStart')
await fetchData()
performance.mark('fetchEnd')
performance.measure('数据加载', 'fetchStart', 'fetchEnd')

// 5. 真机调试
// HBuilderX: 运行 -> 运行到手机或模拟器
// 微信开发者工具: 工具 -> 远程调试

// 6. 抓包调试（App）
// #ifdef APP-PLUS
// 配置代理
plus.net.setProxy({
  type: 'http',
  host: '192.168.1.100',
  port: 8888
})
// #endif
```

### 19.2 错误处理

```javascript
// utils/errorHandler.js

// 全局错误处理
export const initErrorHandler = () => {
  // Vue 错误
  Vue.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err)
    console.error('Component:', vm?.$options?.name)
    console.error('Info:', info)
    
    reportError({
      type: 'vue',
      message: err.message,
      stack: err.stack,
      component: vm?.$options?.name,
      info
    })
  }
  
  // Promise 错误
  uni.onUnhandledRejection?.((event) => {
    console.error('Unhandled Rejection:', event.reason)
    
    reportError({
      type: 'promise',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    })
  })
  
  // JS 错误（H5）
  // #ifdef H5
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('JS Error:', message)
    
    reportError({
      type: 'js',
      message,
      source,
      lineno,
      colno,
      stack: error?.stack
    })
    
    return true
  }
  // #endif
}

// 错误上报
const reportError = (error) => {
  const systemInfo = uni.getSystemInfoSync()
  
  uni.request({
    url: 'https://api.example.com/error/report',
    method: 'POST',
    data: {
      ...error,
      time: Date.now(),
      url: getCurrentPageUrl(),
      platform: systemInfo.platform,
      system: systemInfo.system,
      version: systemInfo.version,
      appVersion: '1.0.0'
    }
  })
}

// 获取当前页面 URL
const getCurrentPageUrl = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage ? `/${currentPage.route}` : ''
}

// App.vue 中初始化
export default {
  onLaunch() {
    initErrorHandler()
  }
}
```

### 19.3 打包发布

```bash
# H5 打包
npm run build:h5

# 微信小程序打包
npm run build:mp-weixin

# App 打包（需要 HBuilderX）
# 发行 -> 原生App-云打包 / 原生App-本地打包

# 配置不同环境
# .env.development
VITE_BASE_URL=https://dev-api.example.com

# .env.production
VITE_BASE_URL=https://api.example.com
```

```json
// manifest.json - App 发布配置
{
  "app-plus": {
    "distribute": {
      "android": {
        "packagename": "com.example.app",
        "keystore": "path/to/keystore",
        "alias": "alias",
        "password": "password",
        "minSdkVersion": 21,
        "targetSdkVersion": 30
      },
      "ios": {
        "appid": "com.example.app",
        "mobileprovision": "path/to/mobileprovision",
        "p12": "path/to/p12",
        "password": "password"
      }
    }
  }
}
```

```javascript
// 版本更新检测
export const checkUpdate = () => {
  // #ifdef MP-WEIXIN
  const updateManager = uni.getUpdateManager()
  
  updateManager.onCheckForUpdate((res) => {
    console.log('是否有新版本:', res.hasUpdate)
  })
  
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启应用？',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })
  
  updateManager.onUpdateFailed(() => {
    uni.showToast({
      title: '更新失败，请删除小程序重新搜索',
      icon: 'none'
    })
  })
  // #endif
  
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (info) => {
    const currentVersion = info.version
    
    // 从服务器获取最新版本信息
    uni.request({
      url: 'https://api.example.com/app/version',
      success: (res) => {
        const { version, downloadUrl, forceUpdate, description } = res.data.data
        
        if (compareVersion(version, currentVersion) > 0) {
          if (forceUpdate) {
            // 强制更新
            showForceUpdateModal(downloadUrl, description)
          } else {
            // 非强制更新
            showUpdateModal(downloadUrl, description)
          }
        }
      }
    })
  })
  // #endif
}

// 版本比较
const compareVersion = (v1, v2) => {
  const arr1 = v1.split('.').map(Number)
  const arr2 = v2.split('.').map(Number)
  
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    const n1 = arr1[i] || 0
    const n2 = arr2[i] || 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  
  return 0
}

// 显示更新弹窗
const showUpdateModal = (downloadUrl, description) => {
  uni.showModal({
    title: '发现新版本',
    content: description || '修复已知问题，优化用户体验',
    cancelText: '稍后更新',
    confirmText: '立即更新',
    success: (res) => {
      if (res.confirm) {
        downloadAndInstall(downloadUrl)
      }
    }
  })
}

// 下载并安装
const downloadAndInstall = (downloadUrl) => {
  uni.showLoading({ title: '下载中...', mask: true })
  
  const downloadTask = uni.downloadFile({
    url: downloadUrl,
    success: (res) => {
      if (res.statusCode === 200) {
        // #ifdef APP-PLUS
        plus.runtime.install(res.tempFilePath, {
          force: true
        }, () => {
          plus.runtime.restart()
        })
        // #endif
      }
    },
    complete: () => {
      uni.hideLoading()
    }
  })
  
  downloadTask.onProgressUpdate((res) => {
    uni.showLoading({
      title: `下载中 ${res.progress}%`,
      mask: true
    })
  })
}
```

---

# UniApp 大厂项目实战

## 1. 项目架构设计

### 1.1 企业级目录结构

```
my-uniapp-project/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── modules/            # 按模块划分
│   │   │   ├── user.js
│   │   │   ├── goods.js
│   │   │   ├── order.js
│   │   │   └── common.js
│   │   └── index.js            # 统一导出
│   │
│   ├── components/             # 公共组件
│   │   ├── base/               # 基础组件
│   │   │   ├── my-button/
│   │   │   ├── my-input/
│   │   │   └── my-modal/
│   │   ├── business/           # 业务组件
│   │   │   ├── goods-card/
│   │   │   ├── order-item/
│   │   │   └── address-item/
│   │   └── layout/             # 布局组件
│   │       ├── page-container/
│   │       ├── navbar/
│   │       └── tabbar/
│   │
│   ├── pages/                  # 主包页面
│   │   ├── index/
│   │   ├── category/
│   │   ├── cart/
│   │   └── user/
│   │
│   ├── pagesA/                 # 分包 A（商品模块）
│   │   ├── goods/
│   │   │   ├── list.vue
│   │   │   └── detail.vue
│   │   └── search/
│   │       └── index.vue
│   │
│   ├── pagesB/                 # 分包 B（订单模块）
│   │   ├── order/
│   │   │   ├── create.vue
│   │   │   ├── list.vue
│   │   │   └── detail.vue
│   │   └── pay/
│   │       └── result.vue
│   │
│   ├── pagesC/                 # 分包 C（用户模块）
│   │   ├── login/
│   │   ├── register/
│   │   ├── address/
│   │   └── settings/
│   │
│   ├── store/                  # 状态管理
│   │   ├── modules/
│   │   │   ├── user.js
│   │   │   ├── cart.js
│   │   │   └── app.js
│   │   └── index.js
│   │
│   ├── utils/                  # 工具函数
│   │   ├── request.js          # 请求封装
│   │   ├── storage.js          # 存储封装
│   │   ├── router.js           # 路由封装
│   │   ├── auth.js             # 权限相关
│   │   ├── validate.js         # 验证相关
│   │   ├── format.js           # 格式化
│   │   └── index.js            # 统一导出
│   │
│   ├── hooks/                  # 组合式函数（Vue3）
│   │   ├── useAuth.js
│   │   ├── useList.js
│   │   ├── useForm.js
│   │   └── useLocation.js
│   │
│   ├── mixins/                 # 混入（Vue2）
│   │   ├── list.js
│   │   ├── form.js
│   │   └── share.js
│   │
│   ├── constants/              # 常量配置
│   │   ├── index.js
│   │   └── enums.js
│   │
│   ├── styles/                 # 样式文件
│   │   ├── variables.scss      # 变量
│   │   ├── mixins.scss         # 混入
│   │   ├── common.scss         # 公共样式
│   │   └── iconfont.scss       # 图标字体
│   │
│   ├── static/                 # 静态资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── platforms/              # 平台特定代码
│   │   ├── app-plus/
│   │   ├── h5/
│   │   └── mp-weixin/
│   │
│   ├── uni_modules/            # uni 插件
│   │
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss
│
├── .env.development            # 开发环境配置
├── .env.production             # 生产环境配置
├── .eslintrc.js
├── .prettierrc
├── package.json
└── vite.config.js
```

### 1.2 请求层完整封装

```javascript
// api/request.js
import { storage } from '@/utils/storage'
import { router } from '@/utils/router'

// 环境配置
const ENV_CONFIG = {
  development: {
    baseUrl: 'https://dev-api.example.com',
    uploadUrl: 'https://dev-upload.example.com'
  },
  production: {
    baseUrl: 'https://api.example.com',
    uploadUrl: 'https://upload.example.com'
  }
}

const env = process.env.NODE_ENV
const config = ENV_CONFIG[env]

// 请求队列
let requestQueue = []
let isRefreshing = false

// 请求实例
class HttpRequest {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || config.baseUrl
    this.timeout = options.timeout || 30000
    this.interceptors = {
      request: [],
      response: []
    }
  }
  
  // 添加请求拦截器
  useRequestInterceptor(fulfilled, rejected) {
    this.interceptors.request.push({ fulfilled, rejected })
  }
  
  // 添加响应拦截器
  useResponseInterceptor(fulfilled, rejected) {
    this.interceptors.response.push({ fulfilled, rejected })
  }
  
  // 执行请求拦截器
  async runRequestInterceptors(config) {
    for (const interceptor of this.interceptors.request) {
      try {
        config = await interceptor.fulfilled(config)
      } catch (e) {
        interceptor.rejected?.(e)
        throw e
      }
    }
    return config
  }
  
  // 执行响应拦截器
  async runResponseInterceptors(response, config) {
    for (const interceptor of this.interceptors.response) {
      try {
        response = await interceptor.fulfilled(response, config)
      } catch (e) {
        if (interceptor.rejected) {
          response = await interceptor.rejected(e, config)
        } else {
          throw e
        }
      }
    }
    return response
  }
  
  // 发起请求
  async request(options) {
    let config = {
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      timeout: options.timeout || this.timeout,
      ...options
    }
    
    // URL 处理
    if (!config.url.startsWith('http')) {
      config.url = this.baseUrl + config.url
    }
    
    // 执行请求拦截器
    config = await this.runRequestInterceptors(config)
    
    // 发起请求
    return new Promise((resolve, reject) => {
      uni.request({
        ...config,
        success: async (res) => {
          try {
            const result = await this.runResponseInterceptors(res, options)
            resolve(result)
          } catch (e) {
            reject(e)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
  
  get(url, params, options = {}) {
    return this.request({ url, method: 'GET', data: params, ...options })
  }
  
  post(url, data, options = {}) {
    return this.request({ url, method: 'POST', data, ...options })
  }
  
  put(url, data, options = {}) {
    return this.request({ url, method: 'PUT', data, ...options })
  }
  
  delete(url, data, options = {}) {
    return this.request({ url, method: 'DELETE', data, ...options })
  }
  
  // 文件上传
  upload(url, filePath, options = {}) {
    const { formData = {}, name = 'file', onProgress } = options
    
    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: config.uploadUrl + url,
        filePath,
        name,
        formData,
        header: {
          'Authorization': `Bearer ${storage.get('token')}`
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 0) {
              resolve(data.data)
            } else {
              reject(data)
            }
          } catch (e) {
            reject(e)
          }
        },
        fail: reject
      })
      
      if (onProgress) {
        uploadTask.onProgressUpdate(onProgress)
      }
    })
  }
}

// 创建实例
const http = new HttpRequest()

// 请求拦截器
http.useRequestInterceptor(
  (config) => {
    // 添加 token
    const token = storage.get('token')
    if (token) {
      config.header['Authorization'] = `Bearer ${token}`
    }
    
    // 添加公共参数
    config.header['X-Platform'] = uni.getSystemInfoSync().platform
    config.header['X-Timestamp'] = Date.now()
    
    // 显示 loading
    if (config.loading !== false) {
      uni.showLoading({ title: '加载中', mask: true })
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.useResponseInterceptor(
  async (response, config) => {
    // 隐藏 loading
    if (config.loading !== false) {
      uni.hideLoading()
    }
    
    const { statusCode, data } = response
    
    // HTTP 错误
    if (statusCode !== 200) {
      if (statusCode === 401) {
        // Token 过期，尝试刷新
        if (!isRefreshing) {
          isRefreshing = true
          
          try {
            await refreshToken()
            isRefreshing = false
            
            // 重新发起队列中的请求
            requestQueue.forEach(cb => cb())
            requestQueue = []
            
            // 重新发起当前请求
            return http.request(config)
          } catch (e) {
            isRefreshing = false
            requestQueue = []
            
            // 跳转登录
            storage.remove('token')
            storage.remove('refreshToken')
            router.reLaunch('/pagesC/login/index')
            
            return Promise.reject(e)
          }
        } else {
          // 正在刷新 token，将请求加入队列
          return new Promise((resolve) => {
            requestQueue.push(() => {
              resolve(http.request(config))
            })
          })
        }
      }
      
      throw new Error(`HTTP Error: ${statusCode}`)
    }
    
    // 业务错误
    if (data.code !== 0) {
      // 特定错误码处理
      switch (data.code) {
        case 10001:  // 静默错误
          break
        case 10002:  // 需要登录
          router.push('/pagesC/login/index')
          break
        default:
          uni.showToast({ title: data.message || '请求失败', icon: 'none' })
      }
      
      throw data
    }
    
    return data.data
  },
  async (error, config) => {
    // 隐藏 loading
    if (config.loading !== false) {
      uni.hideLoading()
    }
    
    uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
    
    return Promise.reject(error)
  }
)

// 刷新 token
const refreshToken = async () => {
  const refreshToken = storage.get('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }
  
  const res = await uni.request({
    url: config.baseUrl + '/auth/refresh',
    method: 'POST',
    data: { refreshToken }
  })
  
  if (res.data.code === 0) {
    storage.set('token', res.data.data.token)
    storage.set('refreshToken', res.data.data.refreshToken)
  } else {
    throw new Error('Refresh token failed')
  }
}

export default http
```

### 1.3 API 模块化管理

```javascript
// api/modules/user.js
import http from '../request'

export default {
  // 登录
  login(data) {
    return http.post('/user/login', data)
  },
  
  // 微信登录
  wxLogin(code) {
    return http.post('/user/wx-login', { code })
  },
  
  // 获取用户信息
  getInfo() {
    return http.get('/user/info')
  },
  
  // 更新用户信息
  updateInfo(data) {
    return http.put('/user/info', data)
  },
  
  // 更新头像
  updateAvatar(filePath) {
    return http.upload('/user/avatar', filePath)
  },
  
  // 获取地址列表
  getAddressList() {
    return http.get('/user/address/list')
  },
  
  // 添加地址
  addAddress(data) {
    return http.post('/user/address', data)
  },
  
  // 更新地址
  updateAddress(id, data) {
    return http.put(`/user/address/${id}`, data)
  },
  
  // 删除地址
  deleteAddress(id) {
    return http.delete(`/user/address/${id}`)
  },
  
  // 设置默认地址
  setDefaultAddress(id) {
    return http.post(`/user/address/${id}/default`)
  }
}

// api/modules/goods.js
import http from '../request'

export default {
  // 获取分类列表
  getCategories() {
    return http.get('/goods/categories', {}, { loading: false })
  },
  
  // 获取商品列表
  getList(params) {
    return http.get('/goods/list', params)
  },
  
  // 获取商品详情
  getDetail(id) {
    return http.get(`/goods/${id}`)
  },
  
  // 搜索商品
  search(keyword, params = {}) {
    return http.get('/goods/search', { keyword, ...params })
  },
  
  // 获取热门搜索
  getHotSearch() {
    return http.get('/goods/hot-search', {}, { loading: false })
  },
  
  // 收藏商品
  collect(id) {
    return http.post(`/goods/${id}/collect`)
  },
  
  // 取消收藏
  uncollect(id) {
    return http.delete(`/goods/${id}/collect`)
  },
  
  // 获取收藏列表
  getCollectList(params) {
    return http.get('/goods/collect/list', params)
  }
}

// api/modules/order.js
import http from '../request'

export default {
  // 创建订单
  create(data) {
    return http.post('/order/create', data)
  },
  
  // 获取订单列表
  getList(params) {
    return http.get('/order/list', params)
  },
  
  // 获取订单详情
  getDetail(id) {
    return http.get(`/order/${id}`)
  },
  
  // 取消订单
  cancel(id, reason) {
    return http.post(`/order/${id}/cancel`, { reason })
  },
  
  // 确认收货
  confirm(id) {
    return http.post(`/order/${id}/confirm`)
  },
  
  // 删除订单
  delete(id) {
    return http.delete(`/order/${id}`)
  },
  
  // 获取支付参数
  getPayParams(id, payType) {
    return http.post(`/order/${id}/pay`, { payType })
  },
  
  // 申请退款
  refund(id, data) {
    return http.post(`/order/${id}/refund`, data)
  }
}

// api/modules/cart.js
import http from '../request'

export default {
  // 获取购物车列表
  getList() {
    return http.get('/cart/list')
  },
  
  // 添加到购物车
  add(data) {
    return http.post('/cart/add', data)
  },
  
  // 更新数量
  updateCount(id, count) {
    return http.put(`/cart/${id}`, { count })
  },
  
  // 删除商品
  remove(ids) {
    return http.delete('/cart/remove', { ids })
  },
  
  // 选中/取消选中
  updateChecked(ids, checked) {
    return http.put('/cart/checked', { ids, checked })
  },
  
  // 全选/取消全选
  checkAll(checked) {
    return http.put('/cart/check-all', { checked })
  },
  
  // 清空购物车
  clear() {
    return http.delete('/cart/clear')
  },
  
  // 获取购物车数量
  getCount() {
    return http.get('/cart/count', {}, { loading: false })
  }
}

// api/index.js - 统一导出
import user from './modules/user'
import goods from './modules/goods'
import order from './modules/order'
import cart from './modules/cart'

export default {
  user,
  goods,
  order,
  cart
}

// 或者按需导出
export { default as userApi } from './modules/user'
export { default as goodsApi } from './modules/goods'
export { default as orderApi } from './modules/order'
export { default as cartApi } from './modules/cart'
```

---

## 2. 核心业务实现

### 2.1 登录模块完整实现

```vue
<!-- pagesC/login/index.vue -->
<template>
  <view class="login-page">
    <!-- Logo -->
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">我的商城</text>
    </view>
    
    <!-- 登录方式切换 -->
    <view class="login-tabs">
      <view 
        :class="['tab', { active: loginType === 'phone' }]"
        @click="loginType = 'phone'"
      >
        手机号登录
      </view>
      <view 
        :class="['tab', { active: loginType === 'password' }]"
        @click="loginType = 'password'"
      >
        密码登录
      </view>
    </view>
    
    <!-- 手机号登录 -->
    <view v-if="loginType === 'phone'" class="form-section">
      <view class="form-item">
        <text class="prefix">+86</text>
        <input 
          v-model="phone" 
          type="number" 
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>
      <view class="form-item">
        <input 
          v-model="code" 
          type="number" 
          maxlength="6"
          placeholder="请输入验证码"
        />
        <view 
          :class="['code-btn', { disabled: countdown > 0 }]"
          @click="sendCode"
        >
          {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
        </view>
      </view>
    </view>
    
    <!-- 密码登录 -->
    <view v-else class="form-section">
      <view class="form-item">
        <input 
          v-model="username" 
          placeholder="请输入用户名/手机号"
        />
      </view>
      <view class="form-item">
        <input 
          v-model="password" 
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入密码"
        />
        <view class="eye-btn" @click="showPassword = !showPassword">
          <uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="22"></uni-icons>
        </view>
      </view>
    </view>
    
    <!-- 登录按钮 -->
    <button 
      class="login-btn" 
      :disabled="!canSubmit || loading"
      :loading="loading"
      @click="handleLogin"
    >
      登录
    </button>
    
    <!-- 第三方登录 -->
    <view class="third-login">
      <view class="divider">
        <text>其他登录方式</text>
      </view>
      <view class="third-login-btns">
        <!-- #ifdef MP-WEIXIN -->
        <button class="third-btn wechat" open-type="getPhoneNumber" @getphonenumber="wxPhoneLogin">
          <image src="/static/icons/wechat.png"></image>
        </button>
        <!-- #endif -->
        
        <!-- #ifdef APP-PLUS -->
        <view class="third-btn wechat" @click="wxLogin">
          <image src="/static/icons/wechat.png"></image>
        </view>
        <view class="third-btn apple" v-if="isIOS" @click="appleLogin">
          <image src="/static/icons/apple.png"></image>
        </view>
        <!-- #endif -->
      </view>
    </view>
    
    <!-- 协议 -->
    <view class="agreement">
      <checkbox :checked="agreed" @click="agreed = !agreed"></checkbox>
      <text>我已阅读并同意</text>
      <text class="link" @click="openAgreement('user')">《用户协议》</text>
      <text>和</text>
      <text class="link" @click="openAgreement('privacy')">《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import { userApi } from '@/api'
import { validatePhone } from '@/utils/validate'

export default {
  data() {
    return {
      loginType: 'phone',
      phone: '',
      code: '',
      username: '',
      password: '',
      showPassword: false,
      countdown: 0,
      loading: false,
      agreed: false,
      isIOS: false
    }
  },
  
  computed: {
    canSubmit() {
      if (!this.agreed) return false
      
      if (this.loginType === 'phone') {
        return validatePhone(this.phone) && this.code.length === 6
      } else {
        return this.username.length >= 3 && this.password.length >= 6
      }
    }
  },
  
  onLoad() {
    // #ifdef APP-PLUS
    this.isIOS = plus.os.name === 'iOS'
    // #endif
  },
  
  methods: {
    ...mapActions('user', ['login', 'getUserInfo']),
    
    // 发送验证码
    async sendCode() {
      if (this.countdown > 0) return
      
      if (!validatePhone(this.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return
      }
      
      try {
        await userApi.sendCode(this.phone)
        uni.showToast({ title: '验证码已发送', icon: 'success' })
        
        // 倒计时
        this.countdown = 60
        const timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      } catch (e) {
        console.error('发送验证码失败', e)
      }
    },
    
    // 登录
    async handleLogin() {
      if (!this.agreed) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
      }
      
      this.loading = true
      
      try {
        let loginData
        if (this.loginType === 'phone') {
          loginData = { phone: this.phone, code: this.code }
        } else {
          loginData = { username: this.username, password: this.password }
        }
        
        await this.login(loginData)
        await this.getUserInfo()
        
        this.navigateAfterLogin()
      } catch (e) {
        console.error('登录失败', e)
      } finally {
        this.loading = false
      }
    },
    
    // 微信登录（小程序）
    // #ifdef MP-WEIXIN
    async wxPhoneLogin(e) {
      if (!e.detail.code) return
      
      if (!this.agreed) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
      }
      
      this.loading = true
      
      try {
        // 获取微信登录 code
        const { code } = await uni.login({ provider: 'weixin' })
        
        // 后端登录
        await this.login({
          type: 'wx_phone',
          code,
          phoneCode: e.detail.code
        })
        
        await this.getUserInfo()
        this.navigateAfterLogin()
      } catch (e) {
        console.error('微信登录失败', e)
      } finally {
        this.loading = false
      }
    },
    // #endif
    
    // 微信登录（App）
    // #ifdef APP-PLUS
    async wxLogin() {
      if (!this.agreed) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
      }
      
      this.loading = true
      
      try {
        const { code } = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          })
        })
        
        await this.login({ type: 'wx_app', code })
        await this.getUserInfo()
        this.navigateAfterLogin()
      } catch (e) {
        console.error('微信登录失败', e)
      } finally {
        this.loading = false
      }
    },
    
    // Apple 登录
    async appleLogin() {
      if (!this.agreed) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
      }
      
      this.loading = true
      
      try {
        const { code } = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'apple',
            success: resolve,
            fail: reject
          })
        })
        
        await this.login({ type: 'apple', code })
        await this.getUserInfo()
        this.navigateAfterLogin()
      } catch (e) {
        console.error('Apple 登录失败', e)
      } finally {
        this.loading = false
      }
    },
    // #endif
    
    // 登录后跳转
    navigateAfterLogin() {
      const redirectUrl = uni.getStorageSync('redirectUrl')
      if (redirectUrl) {
        uni.removeStorageSync('redirectUrl')
        uni.redirectTo({ url: redirectUrl })
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    },
    
    // 打开协议
    openAgreement(type) {
      uni.navigateTo({
        url: `/pagesC/agreement/index?type=${type}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  padding: 100rpx 60rpx;
  background: #fff;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 32rpx;
  }
  
  .app-name {
    margin-top: 20rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.login-tabs {
  display: flex;
  margin-bottom: 60rpx;
  
  .tab {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    font-size: 30rpx;
    color: #666;
    border-bottom: 4rpx solid transparent;
    
    &.active {
      color: $uni-primary;
      border-bottom-color: $uni-primary;
    }
  }
}

.form-section {
  .form-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    
    .prefix {
      padding-right: 20rpx;
      margin-right: 20rpx;
      border-right: 1rpx solid #ddd;
      color: #333;
    }
    
    input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
    }
    
    .code-btn {
      padding: 16rpx 24rpx;
      font-size: 26rpx;
      color: $uni-primary;
      
      &.disabled {
        color: #999;
      }
    }
    
    .eye-btn {
      padding: 10rpx;
    }
  }
}

.login-btn {
  width: 100%;
  height: 96rpx;
  margin-top: 60rpx;
  background: $uni-primary;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  
  &[disabled] {
    background: #ccc;
  }
}

.third-login {
  margin-top: 100rpx;
  
  .divider {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1rpx;
      background: #eee;
    }
    
    text {
      padding: 0 30rpx;
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .third-login-btns {
    display: flex;
    justify-content: center;
    gap: 60rpx;
    
    .third-btn {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      padding: 0;
      
      &::after {
        display: none;
      }
      
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #999;
  
  checkbox {
    transform: scale(0.7);
    margin-right: -10rpx;
  }
  
  .link {
    color: $uni-primary;
  }
}
</style>
```

### 2.2 商品列表与搜索

```vue
<!-- pagesA/goods/list.vue -->
<template>
  <view class="goods-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goSearch">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <text class="placeholder">搜索商品</text>
      </view>
    </view>
    
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view 
        v-for="item in filterTabs" 
        :key="item.key"
        :class="['filter-item', { active: currentFilter === item.key }]"
        @click="onFilterChange(item.key)"
      >
        <text>{{ item.label }}</text>
        <view v-if="item.sortable" class="sort-icon">
          <uni-icons 
            :type="getSortIcon(item.key)"
            size="14"
            :color="currentFilter === item.key ? '#007AFF' : '#999'"
          ></uni-icons>
        </view>
      </view>
      <view class="filter-item" @click="showFilterPopup = true">
        <uni-icons type="settings" size="18"></uni-icons>
        <text>筛选</text>
      </view>
    </view>
    
    <!-- 商品列表 -->
    <scroll-view 
      scroll-y 
      class="goods-scroll"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 列表模式切换 -->
      <view class="list-mode">
        <view 
          :class="['mode-btn', { active: listMode === 'grid' }]"
          @click="listMode = 'grid'"
        >
          <uni-icons type="grid" size="20"></uni-icons>
        </view>
        <view 
          :class="['mode-btn', { active: listMode === 'list' }]"
          @click="listMode = 'list'"
        >
          <uni-icons type="list" size="20"></uni-icons>
        </view>
      </view>
      
      <!-- 网格模式 -->
      <view v-if="listMode === 'grid'" class="goods-grid">
        <goods-card 
          v-for="item in goodsList" 
          :key="item.id"
          :goods="item"
          mode="grid"
          @click="goDetail(item.id)"
        ></goods-card>
      </view>
      
      <!-- 列表模式 -->
      <view v-else class="goods-list">
        <goods-card 
          v-for="item in goodsList" 
          :key="item.id"
          :goods="item"
          mode="list"
          @click="goDetail(item.id)"
        ></goods-card>
      </view>
      
      <!-- 加载状态 -->
      <view class="load-status">
        <uni-load-more :status="loadStatus"></uni-load-more>
      </view>
    </scroll-view>
    
    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="right" :safe-area="false">
      <view class="filter-popup">
        <view class="filter-section">
          <view class="filter-title">价格区间</view>
          <view class="price-range">
            <input v-model="filterParams.minPrice" type="number" placeholder="最低价" />
            <text>-</text>
            <input v-model="filterParams.maxPrice" type="number" placeholder="最高价" />
          </view>
        </view>
        
        <view class="filter-section">
          <view class="filter-title">品牌</view>
          <view class="filter-tags">
            <view 
              v-for="brand in brands" 
              :key="brand.id"
              :class="['filter-tag', { active: filterParams.brandId === brand.id }]"
              @click="filterParams.brandId = filterParams.brandId === brand.id ? null : brand.id"
            >
              {{ brand.name }}
            </view>
          </view>
        </view>
        
        <view class="filter-actions">
          <button class="reset-btn" @click="resetFilter">重置</button>
          <button class="confirm-btn" @click="confirmFilter">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { goodsApi } from '@/api'
import GoodsCard from '@/components/business/goods-card/goods-card.vue'

export default {
  components: {
    GoodsCard
  },
  
  data() {
    return {
      categoryId: null,
      keyword: '',
      
      filterTabs: [
        { key: 'default', label: '综合', sortable: false },
        { key: 'sales', label: '销量', sortable: true },
        { key: 'price', label: '价格', sortable: true },
        { key: 'new', label: '新品', sortable: false }
      ],
      currentFilter: 'default',
      sortOrder: 'desc',
      
      filterParams: {
        minPrice: null,
        maxPrice: null,
        brandId: null
      },
      
      brands: [],
      
      listMode: 'grid',
      goodsList: [],
      page: 1,
      pageSize: 20,
      hasMore: true,
      isRefreshing: false,
      loadStatus: 'more'
    }
  },
  
  onLoad(options) {
    this.categoryId = options.categoryId
    this.keyword = options.keyword || ''
    
    this.loadData()
    this.loadBrands()
  },
  
  methods: {
    // 加载商品列表
    async loadData(isRefresh = false) {
      if (isRefresh) {
        this.page = 1
        this.hasMore = true
      }
      
      if (!this.hasMore && !isRefresh) return
      
      this.loadStatus = 'loading'
      
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          categoryId: this.categoryId,
          keyword: this.keyword,
          sortBy: this.currentFilter,
          sortOrder: this.sortOrder,
          ...this.filterParams
        }
        
        const { list, total } = await goodsApi.getList(params)
        
        if (isRefresh) {
          this.goodsList = list
        } else {
          this.goodsList.push(...list)
        }
        
        this.hasMore = this.goodsList.length < total
        this.loadStatus = this.hasMore ? 'more' : 'noMore'
        this.page++
      } catch (e) {
        this.loadStatus = 'more'
      }
    },
    
    // 加载品牌列表
    async loadBrands() {
      this.brands = await goodsApi.getBrands(this.categoryId)
    },
    
    // 下拉刷新
    async onRefresh() {
      this.isRefreshing = true
      await this.loadData(true)
      this.isRefreshing = false
    },
    
    // 加载更多
    loadMore() {
      if (this.loadStatus === 'loading' || !this.hasMore) return
      this.loadData()
    },
    
    // 筛选变化
    onFilterChange(key) {
      if (this.currentFilter === key) {
        // 切换排序
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc'
      } else {
        this.currentFilter = key
        this.sortOrder = 'desc'
      }
      
      this.loadData(true)
    },
    
    // 获取排序图标
    getSortIcon(key) {
      if (this.currentFilter !== key) return 'arrow-down'
      return this.sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'
    },
    
    // 重置筛选
    resetFilter() {
      this.filterParams = {
        minPrice: null,
        maxPrice: null,
        brandId: null
      }
    },
    
    // 确认筛选
    confirmFilter() {
      this.$refs.filterPopup.close()
      this.loadData(true)
    },
    
    // 跳转搜索
    goSearch() {
      uni.navigateTo({
        url: '/pagesA/search/index'
      })
    },
    
    // 跳转详情
    goDetail(id) {
      uni.navigateTo({
        url: `/pagesA/goods/detail?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background: #fff;
  
  .search-input {
    display: flex;
    align-items: center;
    height: 72rpx;
    padding: 0 24rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    
    .placeholder {
      margin-left: 16rpx;
      color: #999;
      font-size: 28rpx;
    }
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  
  .filter-item {
    display: flex;
    align-items: center;
    padding: 10rpx 24rpx;
    font-size: 26rpx;
    color: #666;
    
    &.active {
      color: $uni-primary;
    }
    
    .sort-icon {
      margin-left: 8rpx;
    }
  }
}

.goods-scroll {
  flex: 1;
  overflow: hidden;
}

.list-mode {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx;
  
  .mode-btn {
    padding: 10rpx;
    margin-left: 20rpx;
    color: #999;
    
    &.active {
      color: $uni-primary;
    }
  }
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10rpx;
  
  :deep(.goods-card) {
    width: calc(50% - 10rpx);
    margin: 5rpx;
  }
}

.goods-list {
  padding: 0 20rpx;
  
  :deep(.goods-card) {
    margin-bottom: 20rpx;
  }
}

.load-status {
  padding: 30rpx 0;
}

.filter-popup {
  width: 600rpx;
  height: 100vh;
  background: #fff;
  padding: 40rpx;
  box-sizing: border-box;
  
  .filter-section {
    margin-bottom: 40rpx;
    
    .filter-title {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .price-range {
      display: flex;
      align-items: center;
      
      input {
        flex: 1;
        height: 72rpx;
        padding: 0 20rpx;
        background: #f5f5f5;
        border-radius: 8rpx;
        text-align: center;
      }
      
      text {
        margin: 0 20rpx;
        color: #999;
      }
    }
    
    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .filter-tag {
        padding: 16rpx 32rpx;
        background: #f5f5f5;
        border-radius: 8rpx;
        font-size: 26rpx;
        
        &.active {
          background: rgba($uni-primary, 0.1);
          color: $uni-primary;
        }
      }
    }
  }
  
  .filter-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 20rpx 40rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    button {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 30rpx;
      border-radius: 44rpx;
      
      &.reset-btn {
        background: #f5f5f5;
        color: #666;
        margin-right: 20rpx;
      }
      
      &.confirm-btn {
        background: $uni-primary;
        color: #fff;
      }
    }
  }
}
</style>
```

### 2.3 购物车完整实现

```vue
<!-- pages/cart/cart.vue -->
<template>
  <view class="cart-page">
    <!-- 空购物车 -->
    <view v-if="!loading && cartList.length === 0" class="empty-cart">
      <image src="/static/images/empty-cart.png" mode="aspectFit"></image>
      <text>购物车是空的</text>
      <button class="go-shop-btn" @click="goShop">去逛逛</button>
    </view>
    
    <!-- 购物车列表 -->
    <template v-else>
      <scroll-view 
        scroll-y 
        class="cart-scroll"
        @scrolltolower="loadInvalidGoods"
      >
        <!-- 有效商品 -->
        <view class="cart-section">
          <view class="section-header">
            <checkbox 
              :checked="isAllChecked" 
              @click="toggleCheckAll"
            />
            <text>全选</text>
          </view>
          
          <view class="cart-list">
            <view 
              v-for="item in cartList" 
              :key="item.id"
              class="cart-item"
            >
              <checkbox 
                :checked="checkedIds.includes(item.id)"
                @click="toggleCheck(item.id)"
              />
              
              <image 
                :src="item.image" 
                mode="aspectFill"
                @click="goDetail(item.goodsId)"
              ></image>
              
              <view class="item-info">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-sku">{{ item.skuText }}</text>
                <view class="item-price-row">
                  <text class="item-price">¥{{ item.price }}</text>
                  <view class="quantity-control">
                    <view 
                      class="qty-btn"
                      :class="{ disabled: item.count <= 1 }"
                      @click="updateCount(item, -1)"
                    >
                      <uni-icons type="minus" size="16"></uni-icons>
                    </view>
                    <input 
                      type="number" 
                      :value="item.count"
                      @blur="onCountBlur(item, $event)"
                    />
                    <view 
                      class="qty-btn"
                      :class="{ disabled: item.count >= item.stock }"
                      @click="updateCount(item, 1)"
                    >
                      <uni-icons type="plus" size="16"></uni-icons>
                    </view>
                  </view>
                </view>
              </view>
              
              <view class="delete-btn" @click="deleteItem(item)">
                <uni-icons type="trash" size="20" color="#999"></uni-icons>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 失效商品 -->
        <view v-if="invalidList.length > 0" class="invalid-section">
          <view class="section-header">
            <text>失效商品 ({{ invalidList.length }})</text>
            <text class="clear-btn" @click="clearInvalid">清空</text>
          </view>
          
          <view class="cart-list invalid">
            <view 
              v-for="item in invalidList" 
              :key="item.id"
              class="cart-item"
            >
              <view class="invalid-tag">失效</view>
              <image :src="item.image" mode="aspectFill"></image>
              <view class="item-info">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-sku">{{ item.skuText }}</text>
                <text class="item-price">¥{{ item.price }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 猜你喜欢 -->
        <view class="recommend-section">
          <view class="section-title">猜你喜欢</view>
          <view class="recommend-list">
            <goods-card 
              v-for="item in recommendList" 
              :key="item.id"
              :goods="item"
              mode="grid"
              @click="goDetail(item.id)"
            ></goods-card>
          </view>
        </view>
      </scroll-view>
      
      <!-- 底部结算栏 -->
      <view class="settle-bar safe-area-bottom">
        <view class="select-all">
          <checkbox 
            :checked="isAllChecked" 
            @click="toggleCheckAll"
          />
          <text>全选</text>
        </view>
        
        <view class="total-info">
          <text>合计：</text>
          <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
        </view>
        
        <button 
          class="settle-btn"
          :disabled="checkedIds.length === 0"
          @click="goSettle"
        >
          结算({{ checkedIds.length }})
        </button>
      </view>
    </template>
    
    <!-- 编辑模式底栏 -->
    <view v-if="isEditMode" class="edit-bar safe-area-bottom">
      <view class="select-all">
        <checkbox 
          :checked="isAllChecked" 
          @click="toggleCheckAll"
        />
        <text>全选</text>
      </view>
      
      <view class="edit-actions">
        <button class="collect-btn" @click="collectChecked">移入收藏</button>
        <button class="delete-btn" @click="deleteChecked">删除</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import GoodsCard from '@/components/business/goods-card/goods-card.vue'

export default {
  components: {
    GoodsCard
  },
  
  data() {
    return {
      loading: true,
      isEditMode: false,
      invalidList: [],
      recommendList: []
    }
  },
  
  computed: {
    ...mapState('cart', ['cartList', 'checkedIds']),
    ...mapGetters('cart', ['isAllChecked', 'totalPrice', 'count'])
  },
  
  onLoad() {
    this.init()
  },
  
  onShow() {
    // 每次显示时刷新
    if (!this.loading) {
      this.refreshCart()
    }
  },
  
  // 设置导航栏按钮
  onNavigationBarButtonTap(e) {
    if (e.index === 0) {
      this.isEditMode = !this.isEditMode
    }
  },
  
  methods: {
    ...mapActions('cart', [
      'getCartList',
      'updateItemCount',
      'removeItems',
      'toggleItemCheck',
      'toggleAllCheck'
    ]),
    
    async init() {
      this.loading = true
      await this.getCartList()
      await this.loadRecommend()
      this.loading = false
    },
    
    async refreshCart() {
      await this.getCartList()
    },
    
    // 加载推荐商品
    async loadRecommend() {
      const { list } = await goodsApi.getRecommend({ limit: 10 })
      this.recommendList = list
    },
    
    // 更新数量
    async updateCount(item, delta) {
      const newCount = item.count + delta
      if (newCount < 1 || newCount > item.stock) return
      
      await this.updateItemCount({ id: item.id, count: newCount })
    },
    
    // 输入数量
    async onCountBlur(item, e) {
      let count = parseInt(e.detail.value) || 1
      count = Math.max(1, Math.min(count, item.stock))
      
      if (count !== item.count) {
        await this.updateItemCount({ id: item.id, count })
      }
    },
    
    // 切换选中
    toggleCheck(id) {
      this.toggleItemCheck(id)
    },
    
    // 全选/取消全选
    toggleCheckAll() {
      this.toggleAllCheck()
    },
    
    // 删除单个
    async deleteItem(item) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该商品吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.removeItems([item.id])
          }
        }
      })
    },
    
    // 删除选中
    async deleteChecked() {
      if (this.checkedIds.length === 0) {
        uni.showToast({ title: '请选择要删除的商品', icon: 'none' })
        return
      }
      
      uni.showModal({
        title: '提示',
        content: `确定要删除选中的 ${this.checkedIds.length} 件商品吗？`,
        success: async (res) => {
          if (res.confirm) {
            await this.removeItems(this.checkedIds)
          }
        }
      })
    },
    
    // 移入收藏
    async collectChecked() {
      if (this.checkedIds.length === 0) {
        uni.showToast({ title: '请选择要收藏的商品', icon: 'none' })
        return
      }
      
      // 调用收藏接口...
      uni.showToast({ title: '已移入收藏' })
    },
    
    // 清空失效商品
    async clearInvalid() {
      const ids = this.invalidList.map(item => item.id)
      await this.removeItems(ids)
      this.invalidList = []
    },
    
    // 去逛逛
    goShop() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    
    // 商品详情
    goDetail(id) {
      uni.navigateTo({ url: `/pagesA/goods/detail?id=${id}` })
    },
    
    // 去结算
    goSettle() {
      if (this.checkedIds.length === 0) {
        uni.showToast({ title: '请选择要结算的商品', icon: 'none' })
        return
      }
      
      uni.navigateTo({
        url: '/pagesB/order/create'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  image {
    width: 300rpx;
    height: 300rpx;
  }
  
  text {
    margin-top: 30rpx;
    color: #999;
    font-size: 28rpx;
  }
  
  .go-shop-btn {
    margin-top: 40rpx;
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: $uni-primary;
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
  }
}

.cart-scroll {
  flex: 1;
  overflow: hidden;
}

.cart-section,
.invalid-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    align-items: center;
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    checkbox {
      margin-right: 20rpx;
    }
    
    .clear-btn {
      margin-left: auto;
      color: #999;
      font-size: 26rpx;
    }
  }
}

.cart-list {
  &.invalid {
    opacity: 0.6;
  }
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  
  checkbox {
    margin-right: 20rpx;
  }
  
  .invalid-tag {
    width: 80rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    background: #999;
    color: #fff;
    font-size: 22rpx;
    border-radius: 4rpx;
    margin-right: 20rpx;
  }
  
  image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
  }
  
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .item-name {
      font-size: 28rpx;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .item-sku {
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #999;
    }
    
    .item-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16rpx;
      
      .item-price {
        font-size: 32rpx;
        color: #e4393c;
        font-weight: bold;
      }
    }
  }
  
  .delete-btn {
    padding: 20rpx;
  }
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  
  .qty-btn {
    width: 56rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.disabled {
      opacity: 0.3;
    }
  }
  
  input {
    width: 80rpx;
    height: 48rpx;
    text-align: center;
    font-size: 28rpx;
    border-left: 1rpx solid #eee;
    border-right: 1rpx solid #eee;
  }
}

.settle-bar,
.edit-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 30rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  
  .select-all {
    display: flex;
    align-items: center;
    
    checkbox {
      margin-right: 10rpx;
    }
    
    text {
      font-size: 28rpx;
    }
  }
  
  .total-info {
    flex: 1;
    text-align: right;
    margin-right: 20rpx;
    
    .total-price {
      font-size: 36rpx;
      color: #e4393c;
      font-weight: bold;
    }
  }
  
  .settle-btn {
    width: 220rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #e4393c;
    color: #fff;
    font-size: 30rpx;
    border-radius: 40rpx;
    
    &[disabled] {
      background: #ccc;
    }
  }
}

.edit-bar {
  .edit-actions {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    
    button {
      width: 180rpx;
      height: 72rpx;
      line-height: 72rpx;
      font-size: 28rpx;
      border-radius: 36rpx;
      
      &.collect-btn {
        background: #fff;
        color: #333;
        border: 1rpx solid #ddd;
      }
      
      &.delete-btn {
        background: #e4393c;
        color: #fff;
      }
    }
  }
}

.recommend-section {
  background: #fff;
  padding: 30rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
  
  .recommend-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10rpx;
    
    :deep(.goods-card) {
      width: calc(50% - 20rpx);
      margin: 10rpx;
    }
  }
}
</style>
```

文档已创建完成！这份 UniApp 完整语法详解文档涵盖了从基础到高级的所有内容，包括大厂项目实战案例。如需继续补充更多内容，请告诉我。
