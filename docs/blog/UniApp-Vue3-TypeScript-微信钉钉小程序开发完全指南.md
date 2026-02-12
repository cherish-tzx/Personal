# UniApp + Vue3 + TypeScript 微信/钉钉小程序开发完全指南
<div class="doc-toc">
## 目录
1. [项目初始化与TypeScript配置](#1-项目初始化与typescript配置)
2. [TypeScript基础类型定义](#2-typescript基础类型定义)
3. [Vue3组合式API与TypeScript](#3-vue3组合式api与typescript)
4. [组件Props类型定义](#4-组件props类型定义)
5. [类型化的状态管理Pinia](#5-类型化的状态管理pinia)
6. [API请求类型封装](#6-api请求类型封装)
7. [Hooks类型化封装](#7-hooks类型化封装)
8. [表单验证与类型](#8-表单验证与类型)
9. [条件编译与平台类型](#9-条件编译与平台类型)
10. [微信小程序类型定义](#10-微信小程序类型定义)
11. [钉钉小程序类型定义](#11-钉钉小程序类型定义)
12. [工具类型与实用类型](#12-工具类型与实用类型)
13. [最佳实践与类型安全](#13-最佳实践与类型安全)


</div>

---

## 1. 项目初始化与TypeScript配置

### 1.1 创建TypeScript项目

```bash
# 使用官方CLI创建Vue3+TS版本
npx degit dcloudio/uni-preset-vue#vite-ts my-ts-project

# 进入项目
cd my-ts-project

# 安装依赖
npm install

# 安装额外的类型包
npm install -D @types/node
```

### 1.2 项目结构

```
├── src/
│   ├── pages/                  # 页面目录
│   ├── components/             # 组件目录
│   ├── composables/            # 组合式函数
│   ├── stores/                 # Pinia状态管理
│   ├── api/                    # API接口
│   ├── utils/                  # 工具函数
│   ├── types/                  # 类型定义
│   │   ├── index.d.ts          # 全局类型
│   │   ├── api.d.ts            # API类型
│   │   ├── store.d.ts          # Store类型
│   │   └── components.d.ts     # 组件类型
│   ├── static/                 # 静态资源
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   ├── uni.scss
│   └── env.d.ts                # 环境变量类型
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### 1.3 tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": [
      "@dcloudio/types",
      "@types/node"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### 1.4 vite.config.ts 配置

```typescript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production'
  }
})
```

### 1.5 env.d.ts 环境类型

```typescript
/// <reference types="vite/client" />
/// <reference types="@dcloudio/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_WX_APPID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 全局变量
declare const __DEV__: boolean
```

### 1.6 main.ts 入口文件

```typescript
import { createSSRApp } from 'vue'
import type { App } from 'vue'
import AppComponent from './App.vue'
import { createPinia } from 'pinia'

// 全局组件
import Loading from '@/components/Loading/Loading.vue'
import Empty from '@/components/Empty/Empty.vue'

export function createApp() {
  const app: App = createSSRApp(AppComponent)
  
  // 注册Pinia
  const pinia = createPinia()
  app.use(pinia)
  
  // 注册全局组件
  app.component('Loading', Loading)
  app.component('Empty', Empty)
  
  return {
    app
  }
}
```

---

## 2. TypeScript基础类型定义

### 2.1 基础接口定义

```typescript
// types/index.d.ts

// 用户信息
export interface UserInfo {
  id: number
  name: string
  avatar: string
  phone: string
  gender: 'male' | 'female' | 'unknown'
  birthday?: string
  address?: Address
  createdAt: string
  updatedAt: string
}

// 地址
export interface Address {
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

// 商品
export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  categoryId: number
  stock: number
  sales: number
  status: ProductStatus
  specs?: ProductSpec[]
  createdAt: string
}

export type ProductStatus = 'on_sale' | 'off_sale' | 'sold_out'

export interface ProductSpec {
  id: number
  name: string
  values: string[]
}

// 订单
export interface Order {
  id: number
  orderNo: string
  userId: number
  status: OrderStatus
  totalAmount: number
  payAmount: number
  freight: number
  address: Address
  items: OrderItem[]
  payTime?: string
  shipTime?: string
  receiveTime?: string
  createdAt: string
}

export type OrderStatus = 
  | 'pending_payment' 
  | 'pending_shipment' 
  | 'shipped' 
  | 'completed' 
  | 'cancelled'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  count: number
  specs?: string
}

// 购物车项
export interface CartItem {
  id: number
  productId: number
  name: string
  image: string
  price: number
  count: number
  selected: boolean
  specs?: string
  stock: number
}
```

### 2.2 API响应类型

```typescript
// types/api.d.ts

// 通用API响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页数据
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 登录请求
export interface LoginParams {
  username?: string
  password?: string
  phone?: string
  code?: string
  wxCode?: string
}

// 登录响应
export interface LoginResult {
  token: string
  refreshToken: string
  userInfo: UserInfo
  expiresIn: number
}

// 商品列表参数
export interface ProductListParams extends PaginationParams {
  categoryId?: number
  keyword?: string
  sortBy?: 'price' | 'sales' | 'created'
  sortOrder?: 'asc' | 'desc'
  minPrice?: number
  maxPrice?: number
}

// 订单创建参数
export interface CreateOrderParams {
  addressId: number
  items: {
    productId: number
    count: number
    specs?: string
  }[]
  remark?: string
  couponId?: number
}
```

### 2.3 组件Props类型

```typescript
// types/components.d.ts
import type { CSSProperties } from 'vue'

// 按钮组件
export interface ButtonProps {
  type?: 'primary' | 'default' | 'danger' | 'text'
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  round?: boolean
  plain?: boolean
  icon?: string
}

// 输入框组件
export interface InputProps {
  modelValue: string | number
  type?: 'text' | 'number' | 'password' | 'tel' | 'email'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
}

// 列表组件
export interface ListProps<T = any> {
  data: T[]
  loading?: boolean
  finished?: boolean
  finishedText?: string
  loadingText?: string
  errorText?: string
  immediateCheck?: boolean
}

// 弹窗组件
export interface ModalProps {
  visible: boolean
  title?: string
  content?: string
  showCancel?: boolean
  cancelText?: string
  confirmText?: string
  closeOnClickOverlay?: boolean
}

// 卡片组件
export interface CardProps {
  title?: string
  subtitle?: string
  shadow?: boolean
  bordered?: boolean
  padding?: string | number
  headerStyle?: CSSProperties
  bodyStyle?: CSSProperties
}
```

---

## 3. Vue3组合式API与TypeScript

### 3.1 响应式数据类型

```vue
<template>
  <view class="container">
    <text>{{ message }}</text>
    <text>{{ count }}</text>
    <text>{{ user?.name }}</text>
    
    <view v-for="item in productList" :key="item.id">
      {{ item.name }} - ¥{{ item.price }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, shallowRef } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { UserInfo, Product, CartItem } from '@/types'

// ref 类型推断
const count = ref(0) // Ref<number>
const message = ref('Hello') // Ref<string>
const loading = ref(false) // Ref<boolean>

// ref 显式类型
const user = ref<UserInfo | null>(null)
const selectedId = ref<number | undefined>(undefined)

// ref 复杂类型
const productList = ref<Product[]>([])
const cartItems = ref<CartItem[]>([])

// shallowRef 大数据
const bigList = shallowRef<Product[]>([])

// reactive 对象类型
interface FormState {
  username: string
  password: string
  remember: boolean
}

const form = reactive<FormState>({
  username: '',
  password: '',
  remember: false
})

// reactive 嵌套对象
interface SearchState {
  keyword: string
  filters: {
    categoryId: number | null
    priceRange: [number, number]
    sortBy: 'price' | 'sales' | 'created'
  }
}

const searchState = reactive<SearchState>({
  keyword: '',
  filters: {
    categoryId: null,
    priceRange: [0, 9999],
    sortBy: 'created'
  }
})

// computed 类型推断
const doubleCount = computed(() => count.value * 2) // ComputedRef<number>

// computed 显式类型
const totalPrice: ComputedRef<number> = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.count, 0)
})

// computed 带getter和setter
const fullName = computed({
  get: (): string => `${form.username}`,
  set: (value: string) => {
    form.username = value
  }
})

// watch 类型
watch(count, (newVal: number, oldVal: number) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})

// watch 对象属性
watch(
  () => form.username,
  (newVal: string) => {
    console.log('username:', newVal)
  }
)

// watch 多个源
watch(
  [count, () => form.username],
  ([newCount, newUsername]: [number, string]) => {
    console.log(newCount, newUsername)
  }
)
</script>
```

### 3.2 方法类型定义

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Product, UserInfo, ApiResponse } from '@/types'

const loading = ref(false)
const productList = ref<Product[]>([])

// 基础方法类型
const increment = (): void => {
  count.value++
}

// 带参数的方法
const setCount = (value: number): void => {
  count.value = value
}

// 异步方法
const fetchProducts = async (): Promise<void> => {
  loading.value = true
  try {
    const res = await api.getProducts()
    productList.value = res.data
  } finally {
    loading.value = false
  }
}

// 带返回值的异步方法
const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const res = await api.getProduct(id)
    return res.data
  } catch {
    return null
  }
}

// 泛型方法
const fetchData = async <T>(
  fetcher: () => Promise<ApiResponse<T>>
): Promise<T | null> => {
  try {
    const res = await fetcher()
    return res.data
  } catch {
    return null
  }
}

// 事件处理方法
const handleClick = (event: Event): void => {
  console.log(event.target)
}

// UniApp事件处理
const handleInput = (e: UniApp.InputEvent): void => {
  console.log(e.detail.value)
}

const handleScroll = (e: UniApp.ScrollEvent): void => {
  console.log(e.detail.scrollTop)
}

// 回调函数类型
type Callback<T> = (data: T) => void
type ErrorCallback = (error: Error) => void

const doSomething = (
  onSuccess: Callback<Product>,
  onError?: ErrorCallback
): void => {
  // ...
}
</script>
```

### 3.3 生命周期类型

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { onLoad, onShow, onReady, onHide, onUnload } from '@dcloudio/uni-app'
import { onPullDownRefresh, onReachBottom, onShareAppMessage } from '@dcloudio/uni-app'
import type { OnShareAppMessageOptions } from '@dcloudio/types'

// UniApp页面生命周期
onLoad((options?: Record<string, string>) => {
  console.log('页面参数:', options)
  const id = options?.id
  const type = options?.type
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

// 下拉刷新
onPullDownRefresh(async () => {
  await refreshData()
  uni.stopPullDownRefresh()
})

// 触底加载
onReachBottom(() => {
  loadMore()
})

// 分享
onShareAppMessage((options: OnShareAppMessageOptions) => {
  console.log('分享来源:', options.from)
  return {
    title: '分享标题',
    path: '/pages/index/index',
    imageUrl: '/static/share.png'
  }
})

// Vue生命周期
onMounted(() => {
  console.log('组件挂载')
})

onUnmounted(() => {
  console.log('组件卸载')
})
</script>
```

---

## 4. 组件Props类型定义

### 4.1 使用defineProps泛型

```vue
<!-- components/ProductCard/ProductCard.vue -->
<template>
  <view class="product-card" @click="handleClick">
    <image :src="product.image" mode="aspectFill" class="image"></image>
    <view class="info">
      <text class="name">{{ product.name }}</text>
      <view class="price-row">
        <text class="price">¥{{ product.price }}</text>
        <text v-if="showOriginalPrice && product.originalPrice" class="original-price">
          ¥{{ product.originalPrice }}
        </text>
      </view>
      <text v-if="showSales" class="sales">销量: {{ product.sales }}</text>
    </view>
    <slot name="action"></slot>
  </view>
</template>

<script setup lang="ts">
import type { Product } from '@/types'

// 方式1: 使用泛型定义props
interface Props {
  product: Product
  showOriginalPrice?: boolean
  showSales?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showOriginalPrice: true,
  showSales: true,
  clickable: true
})

// 定义事件
const emit = defineEmits<{
  click: [product: Product]
  addCart: [product: Product]
}>()

// 或者使用对象语法
// const emit = defineEmits<{
//   (e: 'click', product: Product): void
//   (e: 'addCart', product: Product): void
// }>()

const handleClick = (): void => {
  if (props.clickable) {
    emit('click', props.product)
  }
}
</script>
```

### 4.2 复杂Props类型

```vue
<!-- components/List/List.vue -->
<template>
  <scroll-view 
    scroll-y 
    class="list-container"
    :style="{ height: height }"
    @scrolltolower="handleLoadMore"
  >
    <view v-for="(item, index) in data" :key="keyField ? item[keyField] : index">
      <slot :item="item" :index="index"></slot>
    </view>
    
    <view class="load-status">
      <text v-if="loading">{{ loadingText }}</text>
      <text v-else-if="finished">{{ finishedText }}</text>
      <text v-else-if="error" @click="handleRetry">{{ errorText }}</text>
    </view>
  </scroll-view>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'

// 泛型组件Props
interface Props {
  data: T[]
  keyField?: keyof T
  height?: string
  loading?: boolean
  finished?: boolean
  error?: boolean
  loadingText?: string
  finishedText?: string
  errorText?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '100vh',
  loading: false,
  finished: false,
  error: false,
  loadingText: '加载中...',
  finishedText: '没有更多了',
  errorText: '加载失败，点击重试'
})

const emit = defineEmits<{
  load: []
  retry: []
}>()

const handleLoadMore = (): void => {
  if (!props.loading && !props.finished && !props.error) {
    emit('load')
  }
}

const handleRetry = (): void => {
  emit('retry')
}
</script>
```

### 4.3 defineExpose类型

```vue
<!-- components/Form/Form.vue -->
<template>
  <view class="form">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'

interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (value: any) => boolean | string
}

interface FormRules {
  [field: string]: FormRule | FormRule[]
}

interface Props {
  model: Record<string, any>
  rules?: FormRules
}

const props = defineProps<Props>()

const errors = ref<Record<string, string>>({})

// 验证单个字段
const validateField = (field: string): boolean => {
  const rules = props.rules?.[field]
  if (!rules) return true
  
  const value = props.model[field]
  const ruleList = Array.isArray(rules) ? rules : [rules]
  
  for (const rule of ruleList) {
    if (rule.required && !value) {
      errors.value[field] = rule.message || `${field}不能为空`
      return false
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.value[field] = rule.message || `${field}格式不正确`
      return false
    }
    
    if (rule.validator) {
      const result = rule.validator(value)
      if (result !== true) {
        errors.value[field] = typeof result === 'string' ? result : rule.message || '验证失败'
        return false
      }
    }
  }
  
  errors.value[field] = ''
  return true
}

// 验证所有字段
const validate = (): boolean => {
  let valid = true
  if (props.rules) {
    Object.keys(props.rules).forEach(field => {
      if (!validateField(field)) {
        valid = false
      }
    })
  }
  return valid
}

// 重置表单
const reset = (): void => {
  Object.keys(props.model).forEach(key => {
    props.model[key] = ''
  })
  errors.value = {}
}

// 清除验证
const clearValidate = (fields?: string[]): void => {
  if (fields) {
    fields.forEach(field => {
      errors.value[field] = ''
    })
  } else {
    errors.value = {}
  }
}

// 暴露给父组件的方法和属性
defineExpose({
  errors,
  validate,
  validateField,
  reset,
  clearValidate
})

// 提供给子组件
provide('form', {
  model: props.model,
  rules: props.rules,
  errors,
  validateField
})
</script>
```

```vue
<!-- 使用Form组件 -->
<template>
  <Form ref="formRef" :model="formData" :rules="rules">
    <FormItem field="username" label="用户名">
      <input v-model="formData.username" />
    </FormItem>
    <FormItem field="password" label="密码">
      <input v-model="formData.password" type="password" />
    </FormItem>
    <button @click="handleSubmit">提交</button>
  </Form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Form from '@/components/Form/Form.vue'

// 获取组件实例类型
type FormInstance = InstanceType<typeof Form>

const formRef = ref<FormInstance | null>(null)

const formData = reactive({
  username: '',
  password: ''
})

const rules = {
  username: { required: true, message: '请输入用户名' },
  password: { required: true, min: 6, message: '密码至少6位' }
}

const handleSubmit = async (): Promise<void> => {
  const valid = formRef.value?.validate()
  if (valid) {
    console.log('提交:', formData)
  }
}
</script>
```

---

## 5. 类型化的状态管理Pinia

### 5.1 User Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { UserInfo, LoginParams, LoginResult } from '@/types'
import { userApi } from '@/api/user'

export interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', () => {
  // State
  const token: Ref<string> = ref(uni.getStorageSync('token') || '')
  const userInfo: Ref<UserInfo | null> = ref(
    uni.getStorageSync('userInfo') || null
  )
  
  // Getters
  const isLogin: ComputedRef<boolean> = computed(() => !!token.value)
  const userName: ComputedRef<string> = computed(() => 
    userInfo.value?.name || '未登录'
  )
  const userId: ComputedRef<number | undefined> = computed(() => 
    userInfo.value?.id
  )
  
  // Actions
  const setToken = (newToken: string): void => {
    token.value = newToken
    if (newToken) {
      uni.setStorageSync('token', newToken)
    } else {
      uni.removeStorageSync('token')
    }
  }
  
  const setUserInfo = (info: UserInfo | null): void => {
    userInfo.value = info
    if (info) {
      uni.setStorageSync('userInfo', info)
    } else {
      uni.removeStorageSync('userInfo')
    }
  }
  
  const login = async (params: LoginParams): Promise<LoginResult> => {
    const res = await userApi.login(params)
    setToken(res.token)
    setUserInfo(res.userInfo)
    return res
  }
  
  const getUserInfo = async (): Promise<UserInfo | null> => {
    if (!token.value) return null
    const res = await userApi.getInfo()
    setUserInfo(res)
    return res
  }
  
  const logout = (): void => {
    setToken('')
    setUserInfo(null)
    uni.reLaunch({ url: '/pages/login/login' })
  }
  
  // 微信登录
  const wxLogin = async (): Promise<LoginResult> => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            const res = await userApi.wxLogin({ code: loginRes.code })
            setToken(res.token)
            setUserInfo(res.userInfo)
            resolve(res)
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
      // #endif
    })
  }
  
  return {
    // state
    token,
    userInfo,
    // getters
    isLogin,
    userName,
    userId,
    // actions
    setToken,
    setUserInfo,
    login,
    getUserInfo,
    logout,
    wxLogin
  }
})

// 导出Store类型
export type UserStore = ReturnType<typeof useUserStore>
```

### 5.2 Cart Store

```typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartList = ref<CartItem[]>(
    uni.getStorageSync('cartList') || []
  )
  
  // Getters
  const cartCount = computed<number>(() => 
    cartList.value.reduce((sum, item) => sum + item.count, 0)
  )
  
  const selectedItems = computed<CartItem[]>(() => 
    cartList.value.filter(item => item.selected)
  )
  
  const totalPrice = computed<number>(() => 
    selectedItems.value.reduce((sum, item) => 
      sum + item.price * item.count, 0
    )
  )
  
  const isAllSelected = computed<boolean>(() => {
    if (cartList.value.length === 0) return false
    return cartList.value.every(item => item.selected)
  })
  
  // Private
  const saveToStorage = (): void => {
    uni.setStorageSync('cartList', cartList.value)
  }
  
  // Actions
  const addToCart = (product: Product, count: number = 1): void => {
    const existItem = cartList.value.find(item => item.productId === product.id)
    
    if (existItem) {
      existItem.count += count
    } else {
      const cartItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        count,
        selected: true,
        stock: product.stock
      }
      cartList.value.push(cartItem)
    }
    
    saveToStorage()
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
  
  const removeFromCart = (productId: number): void => {
    const index = cartList.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      cartList.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  const updateCount = (productId: number, count: number): void => {
    const item = cartList.value.find(item => item.productId === productId)
    if (item) {
      if (count <= 0) {
        removeFromCart(productId)
      } else if (count <= item.stock) {
        item.count = count
        saveToStorage()
      } else {
        uni.showToast({ title: '超出库存', icon: 'none' })
      }
    }
  }
  
  const toggleSelect = (productId: number): void => {
    const item = cartList.value.find(item => item.productId === productId)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }
  
  const toggleSelectAll = (): void => {
    const newValue = !isAllSelected.value
    cartList.value.forEach(item => {
      item.selected = newValue
    })
    saveToStorage()
  }
  
  const clearCart = (): void => {
    cartList.value = []
    uni.removeStorageSync('cartList')
  }
  
  const clearSelected = (): void => {
    cartList.value = cartList.value.filter(item => !item.selected)
    saveToStorage()
  }
  
  return {
    // state
    cartList,
    // getters
    cartCount,
    selectedItems,
    totalPrice,
    isAllSelected,
    // actions
    addToCart,
    removeFromCart,
    updateCount,
    toggleSelect,
    toggleSelectAll,
    clearCart,
    clearSelected
  }
})

export type CartStore = ReturnType<typeof useCartStore>
```

### 5.3 在组件中使用

```vue
<template>
  <view class="page">
    <view v-if="isLogin">
      <text>欢迎，{{ userName }}</text>
      <button @click="handleLogout">退出</button>
    </view>
    <view v-else>
      <button @click="handleLogin">登录</button>
    </view>
    
    <view class="cart-badge">
      <text>购物车 ({{ cartCount }})</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import type { UserStore, CartStore } from '@/stores/user'

// 获取store实例
const userStore: UserStore = useUserStore()
const cartStore: CartStore = useCartStore()

// 解构响应式状态
const { isLogin, userName } = storeToRefs(userStore)
const { cartCount } = storeToRefs(cartStore)

// 使用actions
const handleLogin = async (): Promise<void> => {
  try {
    await userStore.wxLogin()
    uni.showToast({ title: '登录成功', icon: 'success' })
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleLogout = (): void => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}
</script>
```

---

## 6. API请求类型封装

### 6.1 请求封装

```typescript
// utils/request.ts
import type { ApiResponse, PaginatedData } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, any>
  header?: Record<string, string>
  loading?: boolean
  loadingText?: string
  timeout?: number
}

// 请求拦截器
const requestInterceptor = (options: RequestOptions): RequestOptions => {
  const token = uni.getStorageSync('token')
  
  options.header = {
    'Content-Type': 'application/json',
    ...options.header
  }
  
  if (token) {
    options.header.Authorization = `Bearer ${token}`
  }
  
  return options
}

// 响应拦截器
const responseInterceptor = async <T>(
  response: UniApp.RequestSuccessCallbackResult,
  options: RequestOptions
): Promise<T> => {
  const { statusCode, data } = response
  const result = data as ApiResponse<T>
  
  if (statusCode === 200) {
    if (result.code === 0 || result.code === 200) {
      return result.data
    }
    
    if (result.code === 401) {
      await handleTokenExpired()
      return request<T>(options)
    }
    
    uni.showToast({ title: result.message || '请求失败', icon: 'none' })
    throw new Error(result.message)
  }
  
  throw new Error(`HTTP Error: ${statusCode}`)
}

// 处理token过期
const handleTokenExpired = async (): Promise<void> => {
  uni.removeStorageSync('token')
  uni.showToast({ title: '登录已过期', icon: 'none' })
  await new Promise(resolve => setTimeout(resolve, 1500))
  uni.reLaunch({ url: '/pages/login/login' })
}

// 请求函数
export const request = <T = any>(options: RequestOptions): Promise<T> => {
  const finalOptions = requestInterceptor({
    ...options,
    url: options.url.startsWith('http') ? options.url : BASE_URL + options.url
  })
  
  return new Promise((resolve, reject) => {
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    uni.request({
      url: finalOptions.url,
      method: finalOptions.method || 'GET',
      data: finalOptions.data,
      header: finalOptions.header,
      timeout: finalOptions.timeout || 30000,
      success: (res) => {
        responseInterceptor<T>(res, options)
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (options.loading !== false) {
          uni.hideLoading()
        }
      }
    })
  })
}

// HTTP方法封装
export const http = {
  get: <T = any>(url: string, params?: Record<string, any>, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'GET', data: params, ...options }),
    
  post: <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'POST', data, ...options }),
    
  put: <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'PUT', data, ...options }),
    
  delete: <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'DELETE', data, ...options })
}

export default http
```

### 6.2 API模块定义

```typescript
// api/user.ts
import http from '@/utils/request'
import type { UserInfo, LoginParams, LoginResult } from '@/types'

export const userApi = {
  // 登录
  login: (data: LoginParams): Promise<LoginResult> => 
    http.post<LoginResult>('/user/login', data),
  
  // 微信登录
  wxLogin: (data: { code: string }): Promise<LoginResult> => 
    http.post<LoginResult>('/user/wx-login', data),
  
  // 获取用户信息
  getInfo: (): Promise<UserInfo> => 
    http.get<UserInfo>('/user/info'),
  
  // 更新用户信息
  updateInfo: (data: Partial<UserInfo>): Promise<UserInfo> => 
    http.put<UserInfo>('/user/info', data),
  
  // 获取手机号
  getPhone: (data: { code: string }): Promise<{ phone: string }> => 
    http.post('/user/phone', data)
}

// api/product.ts
import http from '@/utils/request'
import type { Product, ProductListParams, PaginatedData } from '@/types'

export const productApi = {
  // 获取商品列表
  getList: (params: ProductListParams): Promise<PaginatedData<Product>> => 
    http.get<PaginatedData<Product>>('/product/list', params),
  
  // 获取商品详情
  getDetail: (id: number): Promise<Product> => 
    http.get<Product>(`/product/${id}`),
  
  // 搜索商品
  search: (keyword: string, params?: ProductListParams): Promise<PaginatedData<Product>> => 
    http.get<PaginatedData<Product>>('/product/search', { keyword, ...params })
}

// api/order.ts
import http from '@/utils/request'
import type { Order, CreateOrderParams, PaginatedData, PaginationParams } from '@/types'

interface PayParams {
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
}

export const orderApi = {
  // 创建订单
  create: (data: CreateOrderParams): Promise<{ orderId: number; payParams: PayParams }> => 
    http.post('/order/create', data),
  
  // 获取订单列表
  getList: (params: PaginationParams & { status?: string }): Promise<PaginatedData<Order>> => 
    http.get<PaginatedData<Order>>('/order/list', params),
  
  // 获取订单详情
  getDetail: (id: number): Promise<Order> => 
    http.get<Order>(`/order/${id}`),
  
  // 取消订单
  cancel: (id: number): Promise<void> => 
    http.post(`/order/${id}/cancel`),
  
  // 确认收货
  confirm: (id: number): Promise<void> => 
    http.post(`/order/${id}/confirm`)
}
```

---

## 7. Hooks类型化封装

### 7.1 通用Hooks

```typescript
// composables/useRequest.ts
import { ref, shallowRef } from 'vue'
import type { Ref, ShallowRef } from 'vue'

interface UseRequestOptions<T> {
  immediate?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseRequestReturn<T, P extends any[]> {
  data: ShallowRef<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  run: (...args: P) => Promise<T>
  reset: () => void
}

export function useRequest<T, P extends any[] = []>(
  fetcher: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T, P> {
  const { immediate = false, initialData = null, onSuccess, onError } = options
  
  const data = shallowRef<T | null>(initialData)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const run = async (...args: P): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const result = await fetcher(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      error.value = e
      onError?.(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  const reset = (): void => {
    data.value = initialData
    loading.value = false
    error.value = null
  }
  
  if (immediate) {
    run(...([] as unknown as P))
  }
  
  return {
    data,
    loading,
    error,
    run,
    reset
  }
}

// composables/usePagination.ts
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { PaginatedData, PaginationParams } from '@/types'

interface UsePaginationOptions {
  pageSize?: number
}

interface UsePaginationReturn<T> {
  list: Ref<T[]>
  page: Ref<number>
  total: Ref<number>
  loading: Ref<boolean>
  finished: Ref<boolean>
  hasMore: ComputedRef<boolean>
  loadData: (refresh?: boolean) => Promise<void>
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
}

export function usePagination<T>(
  fetcher: (params: PaginationParams) => Promise<PaginatedData<T>>,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const { pageSize = 10 } = options
  
  const list = ref<T[]>([]) as Ref<T[]>
  const page = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  
  const hasMore = computed(() => !finished.value && !loading.value)
  
  const loadData = async (refresh = false): Promise<void> => {
    if (loading.value) return
    if (finished.value && !refresh) return
    
    loading.value = true
    
    if (refresh) {
      page.value = 1
      finished.value = false
    }
    
    try {
      const res = await fetcher({
        page: page.value,
        pageSize
      })
      
      const items = res.list || []
      total.value = res.total
      
      if (refresh) {
        list.value = items
      } else {
        list.value = [...list.value, ...items]
      }
      
      if (items.length < pageSize) {
        finished.value = true
      } else {
        page.value++
      }
    } finally {
      loading.value = false
      uni.stopPullDownRefresh()
    }
  }
  
  const refresh = (): Promise<void> => loadData(true)
  const loadMore = (): Promise<void> => loadData(false)
  
  return {
    list,
    page,
    total,
    loading,
    finished,
    hasMore,
    loadData,
    refresh,
    loadMore
  }
}
```

### 7.2 业务Hooks

```typescript
// composables/useAuth.ts
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { UserInfo, LoginResult } from '@/types'

interface UseAuthReturn {
  isLogin: ComputedRef<boolean>
  userInfo: ComputedRef<UserInfo | null>
  token: ComputedRef<string>
  checkLogin: (redirectUrl?: string) => boolean
  requireLogin: <T extends (...args: any[]) => any>(fn: T) => T
  login: (params: any) => Promise<LoginResult>
  logout: () => void
  wxLogin: () => Promise<LoginResult>
}

export function useAuth(): UseAuthReturn {
  const userStore = useUserStore()
  const { isLogin, userInfo, token } = storeToRefs(userStore)
  
  const checkLogin = (redirectUrl?: string): boolean => {
    if (!isLogin.value) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      const redirect = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''
      uni.navigateTo({ url: `/pages/login/login${redirect}` })
      return false
    }
    return true
  }
  
  const requireLogin = <T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: Parameters<T>) => {
      if (checkLogin()) {
        return fn(...args)
      }
    }) as T
  }
  
  return {
    isLogin,
    userInfo,
    token,
    checkLogin,
    requireLogin,
    login: userStore.login,
    logout: userStore.logout,
    wxLogin: userStore.wxLogin
  }
}

// composables/useCountdown.ts
import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'

interface UseCountdownReturn {
  seconds: Ref<number>
  isCounting: Ref<boolean>
  start: (duration?: number) => void
  stop: () => void
}

export function useCountdown(initialSeconds = 60): UseCountdownReturn {
  const seconds = ref(0)
  const isCounting = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null
  
  const start = (duration = initialSeconds): void => {
    if (isCounting.value) return
    
    seconds.value = duration
    isCounting.value = true
    
    timer = setInterval(() => {
      seconds.value--
      if (seconds.value <= 0) {
        stop()
      }
    }, 1000)
  }
  
  const stop = (): void => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isCounting.value = false
    seconds.value = 0
  }
  
  onUnmounted(stop)
  
  return {
    seconds,
    isCounting,
    start,
    stop
  }
}

// composables/useUpload.ts
import { ref } from 'vue'
import type { Ref } from 'vue'

interface UploadOptions {
  url?: string
  name?: string
  maxSize?: number
  accept?: string[]
}

interface UploadResult {
  url: string
  name: string
  size: number
}

interface UseUploadReturn {
  uploading: Ref<boolean>
  progress: Ref<number>
  upload: (filePath: string) => Promise<UploadResult>
  chooseAndUpload: (options?: { count?: number; sourceType?: ('album' | 'camera')[] }) => Promise<UploadResult[]>
}

export function useUpload(options: UploadOptions = {}): UseUploadReturn {
  const { 
    url = '/upload', 
    name = 'file',
    maxSize = 10 * 1024 * 1024,
    accept = ['jpg', 'jpeg', 'png', 'gif']
  } = options
  
  const uploading = ref(false)
  const progress = ref(0)
  
  const upload = (filePath: string): Promise<UploadResult> => {
    uploading.value = true
    progress.value = 0
    
    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url,
        filePath,
        name,
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data)
            resolve(data.data as UploadResult)
          } else {
            reject(new Error('上传失败'))
          }
        },
        fail: reject,
        complete: () => {
          uploading.value = false
        }
      })
      
      uploadTask.onProgressUpdate((res) => {
        progress.value = res.progress
      })
    })
  }
  
  const chooseAndUpload = async (
    chooseOptions: { count?: number; sourceType?: ('album' | 'camera')[] } = {}
  ): Promise<UploadResult[]> => {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: chooseOptions.count || 1,
        sourceType: chooseOptions.sourceType || ['album', 'camera'],
        sizeType: ['compressed'],
        success: async (res) => {
          try {
            const results: UploadResult[] = []
            for (const filePath of res.tempFilePaths) {
              const result = await upload(filePath)
              results.push(result)
            }
            resolve(results)
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
  
  return {
    uploading,
    progress,
    upload,
    chooseAndUpload
  }
}
```

### 7.3 表单Hooks

```typescript
// composables/useForm.ts
import { reactive, ref } from 'vue'
import type { Ref, UnwrapRef } from 'vue'

type Validator<T> = (value: T, formData: Record<string, any>) => boolean | string

interface FormRule<T = any> {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: Validator<T>
}

type FormRules<T> = {
  [K in keyof T]?: FormRule<T[K]> | FormRule<T[K]>[]
}

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T
  rules?: FormRules<T>
}

interface UseFormReturn<T extends Record<string, any>> {
  form: UnwrapRef<T>
  errors: UnwrapRef<Record<keyof T, string>>
  submitting: Ref<boolean>
  validateField: (field: keyof T) => boolean
  validate: () => boolean
  reset: () => void
  setValues: (values: Partial<T>) => void
  submit: (handler: (data: T) => Promise<void>) => Promise<boolean>
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, rules = {} } = options
  
  const form = reactive<T>({ ...initialValues })
  const errors = reactive<Record<keyof T, string>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = ''
      return acc
    }, {} as Record<keyof T, string>)
  )
  const submitting = ref(false)
  
  const validateField = (field: keyof T): boolean => {
    const fieldRules = rules[field]
    if (!fieldRules) return true
    
    const value = form[field]
    const ruleList = Array.isArray(fieldRules) ? fieldRules : [fieldRules]
    
    for (const rule of ruleList) {
      // required
      if (rule.required && !value) {
        errors[field] = rule.message || `${String(field)}不能为空`
        return false
      }
      
      // pattern
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors[field] = rule.message || `${String(field)}格式不正确`
        return false
      }
      
      // min/max
      if (rule.min !== undefined) {
        const len = typeof value === 'string' ? value.length : Number(value)
        if (len < rule.min) {
          errors[field] = rule.message || `${String(field)}至少${rule.min}个字符`
          return false
        }
      }
      
      if (rule.max !== undefined) {
        const len = typeof value === 'string' ? value.length : Number(value)
        if (len > rule.max) {
          errors[field] = rule.message || `${String(field)}最多${rule.max}个字符`
          return false
        }
      }
      
      // custom validator
      if (rule.validator) {
        const result = rule.validator(value, form as Record<string, any>)
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : rule.message || '验证失败'
          return false
        }
      }
    }
    
    errors[field] = ''
    return true
  }
  
  const validate = (): boolean => {
    let valid = true
    const fields = Object.keys(rules) as (keyof T)[]
    
    for (const field of fields) {
      if (!validateField(field)) {
        valid = false
      }
    }
    
    return valid
  }
  
  const reset = (): void => {
    Object.keys(form).forEach(key => {
      (form as Record<string, any>)[key] = initialValues[key]
    })
    Object.keys(errors).forEach(key => {
      (errors as Record<string, string>)[key] = ''
    })
  }
  
  const setValues = (values: Partial<T>): void => {
    Object.keys(values).forEach(key => {
      if (key in form) {
        (form as Record<string, any>)[key] = values[key as keyof T]
      }
    })
  }
  
  const submit = async (handler: (data: T) => Promise<void>): Promise<boolean> => {
    if (!validate()) {
      const firstError = Object.values(errors).find(e => e)
      if (firstError) {
        uni.showToast({ title: firstError as string, icon: 'none' })
      }
      return false
    }
    
    submitting.value = true
    try {
      await handler(form as T)
      return true
    } finally {
      submitting.value = false
    }
  }
  
  return {
    form,
    errors,
    submitting,
    validateField,
    validate,
    reset,
    setValues,
    submit
  }
}
```

---

## 8. 表单验证与类型

### 8.1 完整表单示例

```vue
<template>
  <view class="form-page">
    <view class="form-item">
      <text class="label">用户名</text>
      <input 
        v-model="form.username"
        placeholder="请输入用户名"
        @blur="validateField('username')"
      />
      <text class="error" v-if="errors.username">{{ errors.username }}</text>
    </view>
    
    <view class="form-item">
      <text class="label">手机号</text>
      <input 
        v-model="form.phone"
        type="number"
        maxlength="11"
        placeholder="请输入手机号"
        @blur="validateField('phone')"
      />
      <text class="error" v-if="errors.phone">{{ errors.phone }}</text>
    </view>
    
    <view class="form-item">
      <text class="label">验证码</text>
      <view class="code-input">
        <input 
          v-model="form.code"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
        />
        <button 
          class="code-btn"
          :disabled="isCounting"
          @click="sendCode"
        >
          {{ isCounting ? `${seconds}s后重发` : '获取验证码' }}
        </button>
      </view>
      <text class="error" v-if="errors.code">{{ errors.code }}</text>
    </view>
    
    <view class="form-item">
      <text class="label">密码</text>
      <input 
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        @blur="validateField('password')"
      />
      <text class="error" v-if="errors.password">{{ errors.password }}</text>
    </view>
    
    <view class="form-item">
      <text class="label">确认密码</text>
      <input 
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        @blur="validateField('confirmPassword')"
      />
      <text class="error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</text>
    </view>
    
    <button 
      class="submit-btn"
      :loading="submitting"
      :disabled="submitting"
      @click="handleSubmit"
    >
      注册
    </button>
  </view>
</template>

<script setup lang="ts">
import { useForm } from '@/composables/useForm'
import { useCountdown } from '@/composables/useCountdown'
import { userApi } from '@/api/user'

// 表单数据类型
interface RegisterForm {
  username: string
  phone: string
  code: string
  password: string
  confirmPassword: string
}

// 使用表单Hook
const { form, errors, submitting, validateField, submit } = useForm<RegisterForm>({
  initialValues: {
    username: '',
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
  },
  rules: {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 2, max: 20, message: '用户名2-20个字符' }
    ],
    phone: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
    ],
    code: [
      { required: true, message: '请输入验证码' },
      { pattern: /^\d{6}$/, message: '验证码为6位数字' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, max: 20, message: '密码6-20个字符' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码' },
      { 
        validator: (value, formData) => value === formData.password,
        message: '两次密码输入不一致'
      }
    ]
  }
})

// 验证码倒计时
const { seconds, isCounting, start } = useCountdown(60)

// 发送验证码
const sendCode = async (): Promise<void> => {
  if (!validateField('phone')) return
  
  try {
    await userApi.sendCode({ phone: form.phone })
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    start()
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

// 提交表单
const handleSubmit = async (): Promise<void> => {
  const success = await submit(async (data) => {
    await userApi.register(data)
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1500)
  })
  
  if (!success) {
    console.log('表单验证失败')
  }
}
</script>

<style lang="scss" scoped>
.form-page {
  padding: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
  
  .label {
    display: block;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  input {
    width: 100%;
    height: 88rpx;
    padding: 0 24rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
  
  .error {
    display: block;
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #ff4d4f;
  }
}

.code-input {
  display: flex;
  
  input {
    flex: 1;
  }
  
  .code-btn {
    width: 200rpx;
    margin-left: 20rpx;
    font-size: 24rpx;
  }
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  margin-top: 60rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;
}
</style>
```

---

## 9. 条件编译与平台类型

### 9.1 平台类型定义

```typescript
// types/platform.d.ts

// 平台类型
export type Platform = 'weixin' | 'dingtalk' | 'h5' | 'app' | 'unknown'

// 微信小程序特有类型
export interface WxPhoneResult {
  code: string
  errMsg: string
}

export interface WxAvatarResult {
  avatarUrl: string
}

// 钉钉小程序特有类型
export interface DingAuthResult {
  authCode: string
}

export interface DingUser {
  nick: string
  avatarUrl: string
  mobile: string
  userId: string
}

export interface DingDepartment {
  id: number
  name: string
}

// 统一平台接口
export interface PlatformAdapter {
  login: () => Promise<{ platform: Platform; code: string | null }>
  share: (options: ShareOptions) => Promise<void>
  scan: () => Promise<string>
  getLocation: () => Promise<LocationResult>
}

export interface ShareOptions {
  title: string
  url?: string
  imageUrl?: string
  content?: string
}

export interface LocationResult {
  latitude: number
  longitude: number
  address?: string
}
```

### 9.2 平台适配实现

```typescript
// utils/platform.ts
import type { 
  Platform, 
  PlatformAdapter, 
  ShareOptions, 
  LocationResult 
} from '@/types/platform'

// 获取当前平台
export const getPlatform = (): Platform => {
  // #ifdef MP-WEIXIN
  return 'weixin'
  // #endif
  
  // #ifdef MP-DINGTALK
  return 'dingtalk'
  // #endif
  
  // #ifdef H5
  return 'h5'
  // #endif
  
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  
  return 'unknown'
}

// 平台登录
export const platformLogin = (): Promise<{ platform: Platform; code: string | null }> => {
  return new Promise((resolve, reject) => {
    const platform = getPlatform()
    
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: (res) => resolve({ platform, code: res.code }),
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.getAuthCode({
      success: (res: { authCode: string }) => resolve({ platform, code: res.authCode }),
      fail: reject
    })
    // #endif
    
    // #ifdef H5
    resolve({ platform, code: null })
    // #endif
  })
}

// 平台分享
export const platformShare = (options: ShareOptions): Promise<void> => {
  // #ifdef MP-WEIXIN
  // 微信小程序通过 onShareAppMessage 实现
  return Promise.resolve()
  // #endif
  
  // #ifdef MP-DINGTALK
  return new Promise((resolve, reject) => {
    dd.share({
      type: 0,
      url: options.url || '',
      title: options.title,
      content: options.content || '',
      image: options.imageUrl || '',
      success: () => resolve(),
      fail: reject
    })
  })
  // #endif
  
  return Promise.resolve()
}

// 平台扫码
export const platformScan = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.scanCode({
      success: (res) => resolve(res.result),
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.scan({
      type: 'qr',
      success: (res: { text: string }) => resolve(res.text),
      fail: reject
    })
    // #endif
  })
}

// 平台定位
export const platformGetLocation = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.getLocation({
      type: 'gcj02',
      success: (res) => resolve({
        latitude: res.latitude,
        longitude: res.longitude,
        address: res.address
      }),
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.getLocation({
      targetAccuracy: 200,
      coordinate: 1,
      withReGeocode: true,
      success: (res: any) => resolve({
        latitude: res.latitude,
        longitude: res.longitude,
        address: res.address
      }),
      fail: reject
    })
    // #endif
  })
}

// 平台适配器
export const platformAdapter: PlatformAdapter = {
  login: platformLogin,
  share: platformShare,
  scan: platformScan,
  getLocation: platformGetLocation
}

export default platformAdapter
```

---

## 10. 微信小程序类型定义

### 10.1 微信API类型扩展

```typescript
// types/weixin.d.ts

// 微信登录结果
export interface WxLoginResult {
  code: string
  errMsg: string
}

// 微信用户信息
export interface WxUserInfo {
  nickName: string
  avatarUrl: string
  gender: 0 | 1 | 2
  country: string
  province: string
  city: string
  language: string
}

// 微信支付参数
export interface WxPaymentParams {
  timeStamp: string
  nonceStr: string
  package: string
  signType: 'MD5' | 'RSA'
  paySign: string
}

// 微信订阅消息结果
export interface WxSubscribeResult {
  [templateId: string]: 'accept' | 'reject' | 'ban'
  errMsg: string
}

// 微信手机号获取事件
export interface WxPhoneNumberEvent {
  detail: {
    code?: string
    errMsg: string
    encryptedData?: string
    iv?: string
  }
}

// 微信头像选择事件
export interface WxChooseAvatarEvent {
  detail: {
    avatarUrl: string
  }
}

// 微信小程序码参数
export interface WxacodeParams {
  page: string
  scene: string
  width?: number
  checkPath?: boolean
  envVersion?: 'release' | 'trial' | 'develop'
}
```

### 10.2 微信功能Hooks

```typescript
// composables/useWxAuth.ts
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { WxUserInfo, WxPhoneNumberEvent, WxChooseAvatarEvent } from '@/types/weixin'
import http from '@/utils/request'

interface UseWxAuthReturn {
  userInfo: Ref<WxUserInfo | null>
  avatarUrl: Ref<string>
  nickname: Ref<string>
  handleGetPhoneNumber: (e: WxPhoneNumberEvent) => Promise<string | null>
  handleChooseAvatar: (e: WxChooseAvatarEvent) => void
}

export function useWxAuth(): UseWxAuthReturn {
  const userInfo = ref<WxUserInfo | null>(null)
  const avatarUrl = ref('')
  const nickname = ref('')
  
  // 获取手机号
  const handleGetPhoneNumber = async (e: WxPhoneNumberEvent): Promise<string | null> => {
    if (e.detail.errMsg !== 'getPhoneNumber:ok' || !e.detail.code) {
      uni.showToast({ title: '获取手机号失败', icon: 'none' })
      return null
    }
    
    try {
      const res = await http.post<{ phone: string }>('/wx/phone', {
        code: e.detail.code
      })
      return res.phone
    } catch {
      return null
    }
  }
  
  // 选择头像
  const handleChooseAvatar = (e: WxChooseAvatarEvent): void => {
    avatarUrl.value = e.detail.avatarUrl
    
    // 上传头像
    uni.uploadFile({
      url: 'https://api.example.com/upload',
      filePath: e.detail.avatarUrl,
      name: 'file',
      header: {
        Authorization: `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          avatarUrl.value = data.data.url
        }
      }
    })
  }
  
  return {
    userInfo,
    avatarUrl,
    nickname,
    handleGetPhoneNumber,
    handleChooseAvatar
  }
}

// composables/useWxPay.ts
import type { WxPaymentParams } from '@/types/weixin'
import http from '@/utils/request'

interface OrderInfo {
  productIds: number[]
  addressId: number
  couponId?: number
}

interface CreateOrderResult {
  orderId: number
  payParams: WxPaymentParams
}

export function useWxPay() {
  const pay = async (orderInfo: OrderInfo): Promise<boolean> => {
    try {
      // 创建订单
      const result = await http.post<CreateOrderResult>('/order/create', orderInfo)
      const { payParams } = result
      
      // 调起支付
      return new Promise((resolve) => {
        // #ifdef MP-WEIXIN
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: payParams.timeStamp,
          nonceStr: payParams.nonceStr,
          package: payParams.package,
          signType: payParams.signType,
          paySign: payParams.paySign,
          success: () => {
            uni.showToast({ title: '支付成功', icon: 'success' })
            resolve(true)
          },
          fail: (err) => {
            if (err.errMsg.includes('cancel')) {
              uni.showToast({ title: '已取消支付', icon: 'none' })
            } else {
              uni.showToast({ title: '支付失败', icon: 'none' })
            }
            resolve(false)
          }
        })
        // #endif
      })
    } catch {
      uni.showToast({ title: '创建订单失败', icon: 'none' })
      return false
    }
  }
  
  return { pay }
}

// composables/useWxSubscribe.ts
import type { WxSubscribeResult } from '@/types/weixin'

export function useWxSubscribe() {
  const subscribe = (tmplIds: string[]): Promise<string[]> => {
    return new Promise((resolve) => {
      // #ifdef MP-WEIXIN
      uni.requestSubscribeMessage({
        tmplIds,
        success: (res: WxSubscribeResult) => {
          const accepted = tmplIds.filter(id => res[id] === 'accept')
          resolve(accepted)
        },
        fail: () => resolve([])
      })
      // #endif
    })
  }
  
  return { subscribe }
}
```

---

## 11. 钉钉小程序类型定义

### 11.1 钉钉API类型

```typescript
// types/dingtalk.d.ts

// 钉钉授权结果
export interface DingAuthResult {
  authCode: string
}

// 钉钉用户
export interface DingUser {
  nick: string
  avatarUrl: string
  openId: string
  unionId?: string
}

// 钉钉员工信息
export interface DingEmployee {
  userId: string
  name: string
  avatar: string
  mobile: string
  email: string
  department: number[]
  position: string
}

// 钉钉部门
export interface DingDepartment {
  id: number
  name: string
  parentId: number
}

// 选择人员结果
export interface DingChoosePersonResult {
  users: Array<{
    name: string
    avatar: string
    userId: string
  }>
}

// 选择部门结果
export interface DingChooseDeptResult {
  departments: Array<{
    id: number
    name: string
  }>
}

// 钉钉分享参数
export interface DingShareParams {
  type: 0 | 1 | 2 | 3 // 0全部 1钉钉会话 2微信 3微博
  url: string
  title: string
  content: string
  image?: string
}

// 钉钉定位结果
export interface DingLocationResult {
  latitude: number
  longitude: number
  accuracy: number
  address: string
  province: string
  city: string
  district: string
}

// 钉钉扫码结果
export interface DingScanResult {
  text: string
}

// 全局钉钉对象类型
declare global {
  const dd: {
    getAuthCode: (options: {
      success: (res: DingAuthResult) => void
      fail: (err: any) => void
    }) => void
    
    choosePerson: (options: {
      multiple?: boolean
      maxUsers?: number
      pickedUsers?: string[]
      disabledUsers?: string[]
      corpId?: string
      success: (res: DingChoosePersonResult) => void
      fail: (err: any) => void
    }) => void
    
    chooseDepartment: (options: {
      multiple?: boolean
      pickedDepartments?: number[]
      corpId?: string
      success: (res: DingChooseDeptResult) => void
      fail: (err: any) => void
    }) => void
    
    share: (options: DingShareParams & {
      success: () => void
      fail: (err: any) => void
    }) => void
    
    scan: (options: {
      type: 'qr' | 'bar' | 'all'
      success: (res: DingScanResult) => void
      fail: (err: any) => void
    }) => void
    
    getLocation: (options: {
      targetAccuracy?: number
      coordinate?: 0 | 1
      withReGeocode?: boolean
      success: (res: DingLocationResult) => void
      fail: (err: any) => void
    }) => void
    
    getPhoneNumber: (options: {
      success: (res: { phone: string }) => void
      fail: (err: any) => void
    }) => void
    
    openUserProfile: (options: { userId: string }) => void
    
    navigateToMiniProgram: (options: {
      appId: string
      path?: string
      success?: () => void
      fail?: (err: any) => void
    }) => void
  }
}

export {}
```

### 11.2 钉钉功能Hooks

```typescript
// composables/useDingAuth.ts
import http from '@/utils/request'
import type { DingAuthResult } from '@/types/dingtalk'

export function useDingAuth() {
  // 获取授权码
  const getAuthCode = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-DINGTALK
      dd.getAuthCode({
        success: (res: DingAuthResult) => resolve(res.authCode),
        fail: reject
      })
      // #endif
    })
  }
  
  // 免登录
  const login = async (): Promise<any> => {
    const authCode = await getAuthCode()
    return http.post('/ding/login', { authCode })
  }
  
  return {
    getAuthCode,
    login
  }
}

// composables/useDingContact.ts
import type { DingChoosePersonResult, DingChooseDeptResult } from '@/types/dingtalk'

interface ChoosePersonOptions {
  multiple?: boolean
  maxUsers?: number
  pickedUsers?: string[]
  disabledUsers?: string[]
}

interface ChooseDeptOptions {
  multiple?: boolean
  pickedDepartments?: number[]
}

export function useDingContact() {
  // 选择人员
  const choosePerson = (options: ChoosePersonOptions = {}): Promise<DingChoosePersonResult['users']> => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-DINGTALK
      dd.choosePerson({
        multiple: options.multiple !== false,
        maxUsers: options.maxUsers || 50,
        pickedUsers: options.pickedUsers || [],
        disabledUsers: options.disabledUsers || [],
        success: (res: DingChoosePersonResult) => resolve(res.users),
        fail: reject
      })
      // #endif
    })
  }
  
  // 选择部门
  const chooseDepartment = (options: ChooseDeptOptions = {}): Promise<DingChooseDeptResult['departments']> => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-DINGTALK
      dd.chooseDepartment({
        multiple: options.multiple !== false,
        pickedDepartments: options.pickedDepartments || [],
        success: (res: DingChooseDeptResult) => resolve(res.departments),
        fail: reject
      })
      // #endif
    })
  }
  
  // 打开用户详情
  const openUserProfile = (userId: string): void => {
    // #ifdef MP-DINGTALK
    dd.openUserProfile({ userId })
    // #endif
  }
  
  return {
    choosePerson,
    chooseDepartment,
    openUserProfile
  }
}
```

---

## 12. 工具类型与实用类型

### 12.1 常用工具类型

```typescript
// types/utils.d.ts

// 可选属性
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 必选属性
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// 深度Partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 深度Required
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// 提取Promise返回类型
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// 提取数组元素类型
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// 函数参数类型
export type FunctionParams<T> = T extends (...args: infer P) => any ? P : never

// 函数返回类型
export type FunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never

// 排除null和undefined
export type NonNullable<T> = T extends null | undefined ? never : T

// 只读深度
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 键值翻转
export type Flip<T extends Record<string, string>> = {
  [K in T[keyof T]]: {
    [P in keyof T]: T[P] extends K ? P : never
  }[keyof T]
}

// 对象路径
export type PathOf<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}` | `${K}.${PathOf<T[K]>}`
    : `${K}`
  : never

// 获取对象路径值
export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never
```

### 12.2 业务类型工具

```typescript
// types/business.d.ts
import type { ApiResponse, PaginatedData } from './api'

// API函数类型
export type ApiFn<P = void, R = void> = P extends void
  ? () => Promise<ApiResponse<R>>
  : (params: P) => Promise<ApiResponse<R>>

// 分页API函数类型
export type PaginatedApiFn<P, T> = (params: P) => Promise<PaginatedData<T>>

// 表单字段类型
export type FormField<T> = {
  value: T
  error: string
  rules: FormRule<T>[]
}

// 表单类型生成
export type FormFields<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>
}

// Store Action类型
export type StoreAction<P = void, R = void> = P extends void
  ? () => Promise<R>
  : (payload: P) => Promise<R>

// 组件Props类型
export type ComponentProps<T extends (...args: any) => any> = Parameters<T>[0]

// 组件实例类型
export type ComponentInstance<T> = T extends new (...args: any) => infer R ? R : never

// 事件处理器类型
export type EventHandler<E = Event> = (event: E) => void

// 异步函数类型
export type AsyncFn<P extends any[] = [], R = void> = (...args: P) => Promise<R>

// 回调函数类型
export type Callback<T = void> = (data: T) => void
export type ErrorCallback = (error: Error) => void
```

---

## 13. 最佳实践与类型安全

### 13.1 类型守卫

```typescript
// utils/typeGuards.ts
import type { UserInfo, Product, Order } from '@/types'

// 类型守卫函数
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value)
}

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined
}

// 业务类型守卫
export const isUserInfo = (value: unknown): value is UserInfo => {
  return isObject(value) && 
    isNumber((value as any).id) && 
    isString((value as any).name)
}

export const isProduct = (value: unknown): value is Product => {
  return isObject(value) && 
    isNumber((value as any).id) && 
    isString((value as any).name) &&
    isNumber((value as any).price)
}

// 使用示例
const processData = (data: unknown): void => {
  if (isUserInfo(data)) {
    // data 类型被收窄为 UserInfo
    console.log(data.name)
  }
  
  if (isArray<Product>(data) && data.every(isProduct)) {
    // data 类型被收窄为 Product[]
    data.forEach(p => console.log(p.name))
  }
}
```

### 13.2 类型安全的事件处理

```typescript
// utils/eventTypes.ts
import type { Ref } from 'vue'

// UniApp事件类型
export interface UniInputEvent {
  detail: {
    value: string
  }
}

export interface UniScrollEvent {
  detail: {
    scrollTop: number
    scrollLeft: number
    scrollHeight: number
    scrollWidth: number
  }
}

export interface UniTouchEvent {
  touches: Array<{
    clientX: number
    clientY: number
    pageX: number
    pageY: number
  }>
  changedTouches: Array<{
    clientX: number
    clientY: number
  }>
}

// 类型安全的v-model
export interface VModelProps<T> {
  modelValue: T
}

export interface VModelEmits<T> {
  (e: 'update:modelValue', value: T): void
}

// 使用示例
const handleInput = (e: UniInputEvent): void => {
  console.log(e.detail.value)
}

const handleScroll = (e: UniScrollEvent): void => {
  console.log(e.detail.scrollTop)
}
```

### 13.3 类型安全的存储封装

```typescript
// utils/storage.ts

// 存储键值类型映射
interface StorageMap {
  token: string
  refreshToken: string
  userInfo: import('@/types').UserInfo
  cartList: import('@/types').CartItem[]
  theme: 'light' | 'dark'
  language: string
}

// 类型安全的存储操作
export const storage = {
  get<K extends keyof StorageMap>(key: K): StorageMap[K] | null {
    try {
      const value = uni.getStorageSync(key)
      return value || null
    } catch {
      return null
    }
  },
  
  set<K extends keyof StorageMap>(key: K, value: StorageMap[K]): void {
    try {
      uni.setStorageSync(key, value)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  
  remove<K extends keyof StorageMap>(key: K): void {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },
  
  clear(): void {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

// 使用示例
const token = storage.get('token') // 类型为 string | null
const userInfo = storage.get('userInfo') // 类型为 UserInfo | null

storage.set('token', 'abc123') // 正确
// storage.set('token', 123) // 错误：类型不匹配
```

### 13.4 完整页面示例

```vue
<template>
  <view class="product-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input 
        v-model="searchKey" 
        placeholder="搜索商品"
        @confirm="handleSearch"
      />
    </view>
    
    <!-- 商品列表 -->
    <scroll-view 
      scroll-y 
      class="list-container"
      @scrolltolower="loadMore"
    >
      <ProductCard
        v-for="item in list"
        :key="item.id"
        :product="item"
        @click="goDetail"
        @add-cart="handleAddCart"
      />
      
      <view class="load-status">
        <text v-if="loading">加载中...</text>
        <text v-else-if="finished">没有更多了</text>
      </view>
    </scroll-view>
    
    <!-- 空状态 -->
    <Empty v-if="!loading && list.length === 0" text="暂无商品" />
    
    <!-- 购物车浮窗 -->
    <view class="cart-float" @click="goCart">
      <text class="badge" v-if="cartCount > 0">{{ cartCount }}</text>
      <text class="iconfont icon-cart"></text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePagination } from '@/composables/usePagination'
import { useCartStore } from '@/stores/cart'
import { productApi } from '@/api/product'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import type { Product, ProductListParams } from '@/types'

// 搜索关键词
const searchKey = ref('')

// 购物车
const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)

// 分页数据
const { list, loading, finished, refresh, loadMore } = usePagination<Product>(
  (params) => productApi.getList({ 
    ...params, 
    keyword: searchKey.value 
  } as ProductListParams)
)

// 页面加载
onLoad(() => {
  refresh()
})

// 下拉刷新
onPullDownRefresh(() => {
  refresh()
})

// 触底加载
onReachBottom(() => {
  loadMore()
})

// 搜索
const handleSearch = (): void => {
  refresh()
}

// 跳转详情
const goDetail = (product: Product): void => {
  uni.navigateTo({
    url: `/pages/product/detail?id=${product.id}`
  })
}

// 加入购物车
const handleAddCart = (product: Product): void => {
  cartStore.addToCart(product)
}

// 跳转购物车
const goCart = (): void => {
  uni.switchTab({
    url: '/pages/cart/cart'
  })
}
</script>

<style lang="scss" scoped>
.product-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
  
  input {
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
  }
}

.list-container {
  height: calc(100vh - 112rpx);
  padding: 20rpx;
}

.load-status {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.cart-float {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #007AFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.3);
  
  .badge {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    min-width: 36rpx;
    height: 36rpx;
    padding: 0 10rpx;
    background-color: #ff4d4f;
    border-radius: 18rpx;
    color: #fff;
    font-size: 22rpx;
    text-align: center;
    line-height: 36rpx;
  }
  
  .iconfont {
    font-size: 48rpx;
    color: #fff;
  }
}
</style>
```

---

本文档涵盖了Vue3 + TypeScript + UniApp开发微信和钉钉小程序的所有核心知识点，包括TypeScript配置、类型定义、组合式API类型、Pinia类型化、API请求类型封装、Hooks类型化、平台类型定义和类型安全最佳实践等内容。每个部分都提供了详细的类型定义和代码示例。
