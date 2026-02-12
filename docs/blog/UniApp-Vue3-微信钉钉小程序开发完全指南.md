# UniApp + Vue3 微信/钉钉小程序开发完全指南
<div class="doc-toc">
## 目录
1. [项目初始化与配置](#1-项目初始化与配置)
2. [Vue3组合式API基础](#2-vue3组合式api基础)
3. [响应式系统](#3-响应式系统)
4. [组件系统](#4-组件系统)
5. [生命周期](#5-生命周期)
6. [路由与页面跳转](#6-路由与页面跳转)
7. [数据请求与API调用](#7-数据请求与api调用)
8. [状态管理Pinia](#8-状态管理pinia)
9. [条件编译与多端适配](#9-条件编译与多端适配)
10. [Hooks封装](#10-hooks封装)
11. [微信小程序特有功能](#11-微信小程序特有功能)
12. [钉钉小程序特有功能](#12-钉钉小程序特有功能)
13. [性能优化](#13-性能优化)


</div>

---

## 1. 项目初始化与配置

### 1.1 创建Vue3项目

```bash
# 使用官方CLI创建
npx degit dcloudio/uni-preset-vue#vite my-vue3-project

# 或使用 HBuilderX
# 文件 -> 新建 -> 项目 -> uni-app -> Vue3版本
```

### 1.2 项目结构

```
├── src/
│   ├── pages/                  # 页面目录
│   │   ├── index/
│   │   │   └── index.vue
│   │   └── user/
│   │       └── user.vue
│   ├── components/             # 组件目录
│   ├── composables/            # 组合式函数（Hooks）
│   ├── stores/                 # Pinia状态管理
│   ├── api/                    # API接口
│   ├── utils/                  # 工具函数
│   ├── static/                 # 静态资源
│   ├── App.vue                 # 应用入口
│   ├── main.js                 # 主入口文件
│   ├── manifest.json           # 应用配置
│   ├── pages.json              # 页面配置
│   └── uni.scss                # 全局样式变量
├── vite.config.js              # Vite配置
└── package.json
```

### 1.3 vite.config.js 配置

```javascript
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
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 1.4 main.js 入口配置

```javascript
import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// 全局组件
import Loading from '@/components/Loading/Loading.vue'
import Empty from '@/components/Empty/Empty.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 注册Pinia
  const pinia = createPinia()
  app.use(pinia)
  
  // 注册全局组件
  app.component('Loading', Loading)
  app.component('Empty', Empty)
  
  // 全局属性
  app.config.globalProperties.$toast = (title, icon = 'none') => {
    uni.showToast({ title, icon })
  }
  
  return {
    app
  }
}
```

### 1.5 manifest.json 配置

```json
{
  "name": "Vue3小程序",
  "appid": "__UNI__XXXXXX",
  "description": "Vue3 UniApp小程序",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "mp-weixin": {
    "appid": "wx微信小程序appid",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "lazyCodeLoading": "requiredComponents",
    "permission": {
      "scope.userLocation": {
        "desc": "获取位置信息"
      }
    }
  },
  "mp-dingtalk": {
    "appid": "钉钉小程序appid"
  }
}
```

---

## 2. Vue3组合式API基础

### 2.1 setup语法糖

```vue
<template>
  <view class="container">
    <text>{{ message }}</text>
    <text>{{ count }}</text>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

// 响应式数据
const message = ref('Hello Vue3 UniApp')
const count = ref(0)

// 响应式对象
const user = reactive({
  name: '张三',
  age: 25
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

// 侦听器
watch(count, (newVal, oldVal) => {
  console.log(`count从 ${oldVal} 变为 ${newVal}`)
})

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

**使用场景**：所有Vue3页面和组件的基本结构

### 2.2 定义Props和Emits

```vue
<!-- 子组件 ProductCard.vue -->
<template>
  <view class="product-card" @click="handleClick">
    <image :src="product.image" mode="aspectFill"></image>
    <view class="info">
      <text class="name">{{ product.name }}</text>
      <text class="price">¥{{ product.price }}</text>
    </view>
    <slot name="action"></slot>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义Props
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: '',
      image: '',
      price: 0
    })
  },
  showPrice: {
    type: Boolean,
    default: true
  }
})

// 定义Emits
const emit = defineEmits(['click', 'addCart'])

// 方法
const handleClick = () => {
  emit('click', props.product)
}

const addToCart = () => {
  emit('addCart', props.product)
}
</script>
```

```vue
<!-- 父组件使用 -->
<template>
  <view>
    <ProductCard 
      v-for="item in productList" 
      :key="item.id"
      :product="item"
      @click="goDetail"
      @add-cart="handleAddCart"
    >
      <template #action>
        <button size="mini" @click.stop="addToCart(item)">加购</button>
      </template>
    </ProductCard>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard/ProductCard.vue'

const productList = ref([])

const goDetail = (product) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${product.id}`
  })
}

const handleAddCart = (product) => {
  console.log('添加购物车:', product)
}
</script>
```

### 2.3 defineExpose暴露组件方法

```vue
<!-- 子组件 Modal.vue -->
<template>
  <view class="modal" v-if="visible">
    <view class="modal-content">
      <text class="title">{{ title }}</text>
      <slot></slot>
      <view class="buttons">
        <button @click="close">取消</button>
        <button type="primary" @click="confirm">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '提示'
  }
})

const emit = defineEmits(['confirm', 'close'])

const visible = ref(false)

// 暴露给父组件的方法
const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
  emit('close')
}

const confirm = () => {
  emit('confirm')
  close()
}

// 暴露方法
defineExpose({
  open,
  close
})
</script>
```

```vue
<!-- 父组件使用 -->
<template>
  <view>
    <button @click="openModal">打开弹窗</button>
    <Modal ref="modalRef" title="确认删除" @confirm="handleConfirm">
      <text>确定要删除这条数据吗？</text>
    </Modal>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue'

const modalRef = ref(null)

const openModal = () => {
  modalRef.value.open()
}

const handleConfirm = () => {
  console.log('确认操作')
}
</script>
```

---

## 3. 响应式系统

### 3.1 ref与reactive

```vue
<template>
  <view>
    <!-- ref基本类型 -->
    <text>计数：{{ count }}</text>
    <button @click="count++">+1</button>
    
    <!-- reactive对象 -->
    <text>用户：{{ user.name }} - {{ user.age }}岁</text>
    <button @click="user.age++">年龄+1</button>
    
    <!-- ref对象 -->
    <text>配置：{{ config.theme }}</text>
  </view>
</template>

<script setup>
import { ref, reactive, isRef, isReactive, toRefs, toRef } from 'vue'

// ref - 用于基本类型和需要重新赋值的数据
const count = ref(0)
const message = ref('Hello')
const loading = ref(false)

// reactive - 用于对象和数组
const user = reactive({
  name: '张三',
  age: 25,
  address: {
    city: '北京',
    street: '朝阳区'
  }
})

// ref也可以包装对象
const config = ref({
  theme: 'light',
  language: 'zh-CN'
})

// 数组推荐使用ref（需要整体替换时）
const list = ref([])
// 加载数据后可以直接替换
const loadData = async () => {
  list.value = await fetchList()
}

// 数组使用reactive（只做增删改时）
const todoList = reactive([])
const addTodo = (item) => {
  todoList.push(item)
}

// toRefs - 将reactive对象的属性转为ref
const { name, age } = toRefs(user)
// 现在name.value和user.name是同步的

// toRef - 将reactive对象的单个属性转为ref
const cityRef = toRef(user.address, 'city')

// 检查响应式类型
console.log(isRef(count)) // true
console.log(isReactive(user)) // true
</script>
```

**使用场景**：
- `ref`: 基本类型、需要重新赋值的对象/数组
- `reactive`: 复杂对象、不需要整体替换的数据
- `toRefs`: 解构reactive对象时保持响应式
- `toRef`: 为reactive对象的属性创建ref

### 3.2 computed计算属性

```vue
<template>
  <view class="cart">
    <!-- 购物车列表 -->
    <view v-for="item in cartList" :key="item.id" class="cart-item">
      <checkbox :checked="item.selected" @click="toggleSelect(item.id)" />
      <text>{{ item.name }}</text>
      <text>¥{{ item.price }} × {{ item.count }}</text>
      <text>小计：¥{{ getSubtotal(item) }}</text>
    </view>
    
    <!-- 统计信息 -->
    <view class="summary">
      <text>已选 {{ selectedCount }} 件</text>
      <text>合计：¥{{ totalPrice }}</text>
      <text>优惠后：¥{{ discountedPrice }}</text>
    </view>
    
    <!-- 搜索过滤 -->
    <input v-model="searchKey" placeholder="搜索商品" />
    <view v-for="item in filteredList" :key="item.id">
      {{ item.name }}
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const cartList = reactive([
  { id: 1, name: '商品A', price: 100, count: 2, selected: true },
  { id: 2, name: '商品B', price: 200, count: 1, selected: true },
  { id: 3, name: '商品C', price: 50, count: 3, selected: false }
])

const discountRate = ref(0.8)
const searchKey = ref('')

// 基础计算属性
const selectedItems = computed(() => {
  return cartList.filter(item => item.selected)
})

const selectedCount = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.count, 0)
})

const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + item.price * item.count
  }, 0)
})

// 依赖其他计算属性
const discountedPrice = computed(() => {
  return (totalPrice.value * discountRate.value).toFixed(2)
})

// 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(value) {
    const [first, last] = value.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

// 搜索过滤
const filteredList = computed(() => {
  if (!searchKey.value) return cartList
  return cartList.filter(item => 
    item.name.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

// 普通方法（每次调用都会执行）
const getSubtotal = (item) => {
  return item.price * item.count
}

// 切换选中
const toggleSelect = (id) => {
  const item = cartList.find(i => i.id === id)
  if (item) item.selected = !item.selected
}
</script>
```

### 3.3 watch侦听器

```vue
<template>
  <view>
    <input v-model="searchKey" placeholder="搜索" />
    
    <picker :range="provinces" @change="handleProvinceChange">
      <view>{{ selectedProvince || '选择省份' }}</view>
    </picker>
    <picker :range="cities" @change="handleCityChange">
      <view>{{ selectedCity || '选择城市' }}</view>
    </picker>
  </view>
</template>

<script setup>
import { ref, reactive, watch, watchEffect, watchPostEffect } from 'vue'

const searchKey = ref('')
const selectedProvince = ref('')
const selectedCity = ref('')
const cities = ref([])

const user = reactive({
  name: '张三',
  profile: {
    age: 25,
    address: ''
  }
})

// 监听单个ref
watch(searchKey, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变为 "${newVal}"`)
})

// 监听带配置项
watch(searchKey, async (newVal) => {
  // 防抖搜索
  await new Promise(resolve => setTimeout(resolve, 300))
  doSearch(newVal)
}, {
  immediate: true, // 立即执行
  flush: 'post'    // DOM更新后执行
})

// 监听reactive对象的属性
watch(
  () => user.name,
  (newVal) => {
    console.log('用户名变化:', newVal)
  }
)

// 深度监听整个对象
watch(
  () => user.profile,
  (newVal) => {
    console.log('profile变化:', newVal)
  },
  { deep: true }
)

// 监听多个数据源
watch(
  [searchKey, selectedProvince],
  ([newSearch, newProvince], [oldSearch, oldProvince]) => {
    console.log('搜索或省份变化')
  }
)

// 省市联动
watch(selectedProvince, async (newVal) => {
  if (newVal) {
    cities.value = await fetchCities(newVal)
    selectedCity.value = ''
  }
})

// watchEffect - 自动追踪依赖
const stop = watchEffect(() => {
  console.log('searchKey:', searchKey.value)
  console.log('province:', selectedProvince.value)
  // 自动追踪上面用到的响应式数据
})

// 停止监听
// stop()

// watchPostEffect - DOM更新后执行
watchPostEffect(() => {
  // 可以安全访问更新后的DOM
  const el = document.querySelector('.search-result')
  if (el) {
    console.log('搜索结果已渲染')
  }
})

// 清理副作用
watch(searchKey, async (newVal, oldVal, onCleanup) => {
  let cancelled = false
  
  onCleanup(() => {
    cancelled = true
  })
  
  const result = await fetchSearchResult(newVal)
  
  if (!cancelled) {
    // 处理结果
  }
})

const doSearch = (keyword) => {
  console.log('执行搜索:', keyword)
}
</script>
```

### 3.4 shallowRef与shallowReactive

```vue
<script setup>
import { shallowRef, shallowReactive, triggerRef } from 'vue'

// shallowRef - 只有.value的替换会触发更新
const largeList = shallowRef([])

// 这不会触发更新
largeList.value.push({ id: 1 })

// 这会触发更新
largeList.value = [...largeList.value, { id: 1 }]

// 手动触发更新
triggerRef(largeList)

// shallowReactive - 只有第一层属性是响应式的
const state = shallowReactive({
  count: 0,
  nested: {
    value: 1
  }
})

// 这会触发更新
state.count++

// 这不会触发更新
state.nested.value++

// 使用场景：大数据列表、不需要深度响应式的复杂对象
const bigData = shallowRef({
  items: new Array(10000).fill(null).map((_, i) => ({ id: i }))
})
</script>
```

---

## 4. 组件系统

### 4.1 组件定义与注册

```vue
<!-- components/Card/Card.vue -->
<template>
  <view class="card" :class="{ 'card--shadow': shadow }">
    <view class="card__header" v-if="$slots.header || title">
      <slot name="header">
        <text class="card__title">{{ title }}</text>
      </slot>
    </view>
    <view class="card__body">
      <slot></slot>
    </view>
    <view class="card__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup>
import { useSlots } from 'vue'

defineProps({
  title: String,
  shadow: {
    type: Boolean,
    default: true
  }
})

const slots = useSlots()
</script>

<style scoped lang="scss">
.card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  
  &--shadow {
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
  
  &__header {
    padding: 24rpx;
    border-bottom: 1rpx solid #eee;
  }
  
  &__title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  &__body {
    padding: 24rpx;
  }
  
  &__footer {
    padding: 24rpx;
    border-top: 1rpx solid #eee;
  }
}
</style>
```

### 4.2 动态组件

```vue
<template>
  <view>
    <!-- Tab切换 -->
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.name"
        :class="['tab', { active: currentTab === tab.name }]"
        @click="currentTab = tab.name"
      >
        {{ tab.label }}
      </view>
    </view>
    
    <!-- 动态组件 -->
    <component 
      :is="currentComponent" 
      v-bind="currentProps"
      @event="handleEvent"
    />
    
    <!-- keep-alive缓存 -->
    <keep-alive :include="cachedTabs">
      <component :is="currentComponent" />
    </keep-alive>
  </view>
</template>

<script setup>
import { ref, computed, shallowRef, markRaw } from 'vue'
import TabA from './TabA.vue'
import TabB from './TabB.vue'
import TabC from './TabC.vue'

const tabs = [
  { name: 'a', label: '选项A', component: markRaw(TabA) },
  { name: 'b', label: '选项B', component: markRaw(TabB) },
  { name: 'c', label: '选项C', component: markRaw(TabC) }
]

const currentTab = ref('a')
const cachedTabs = ['TabA', 'TabB']

const currentComponent = computed(() => {
  return tabs.find(t => t.name === currentTab.value)?.component
})

const currentProps = computed(() => {
  return {
    // 根据当前tab返回不同的props
  }
})

const handleEvent = (data) => {
  console.log('子组件事件:', data)
}
</script>
```

### 4.3 异步组件

```vue
<template>
  <view>
    <!-- 异步组件 -->
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
    
    <!-- 条件加载 -->
    <AsyncHeavyChart v-if="showChart" />
  </view>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import Loading from '@/components/Loading/Loading.vue'

// 异步组件
const AsyncComponent = defineAsyncComponent(() => 
  import('@/components/HeavyComponent/HeavyComponent.vue')
)

// 带配置的异步组件
const AsyncHeavyChart = defineAsyncComponent({
  loader: () => import('@/components/Chart/Chart.vue'),
  loadingComponent: Loading,
  delay: 200, // 显示loading前的延迟
  timeout: 10000, // 超时时间
  errorComponent: {
    template: '<text>加载失败</text>'
  },
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      fail()
    }
  }
})

const showChart = ref(false)
</script>
```

### 4.4 Teleport传送门

```vue
<template>
  <view>
    <button @click="showPopup = true">显示弹窗</button>
    
    <!-- 将内容传送到body -->
    <Teleport to="body">
      <view class="popup" v-if="showPopup">
        <view class="popup-mask" @click="showPopup = false"></view>
        <view class="popup-content">
          <text>弹窗内容</text>
          <button @click="showPopup = false">关闭</button>
        </view>
      </view>
    </Teleport>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const showPopup = ref(false)
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.popup-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
}
</style>
```

### 4.5 Provide/Inject依赖注入

```vue
<!-- 祖先组件 App.vue -->
<template>
  <view>
    <router-view />
  </view>
</template>

<script setup>
import { provide, ref, readonly } from 'vue'

// 主题配置
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 用户信息
const user = ref(null)
const setUser = (userData) => {
  user.value = userData
}

// 提供数据和方法
provide('theme', readonly(theme))
provide('toggleTheme', toggleTheme)
provide('user', readonly(user))
provide('setUser', setUser)

// 提供复杂对象
provide('appContext', {
  theme: readonly(theme),
  user: readonly(user),
  actions: {
    toggleTheme,
    setUser
  }
})
</script>
```

```vue
<!-- 后代组件 -->
<template>
  <view :class="['container', `theme-${theme}`]">
    <text>当前主题：{{ theme }}</text>
    <button @click="toggleTheme">切换主题</button>
    
    <text v-if="user">用户：{{ user.name }}</text>
  </view>
</template>

<script setup>
import { inject } from 'vue'

// 注入数据
const theme = inject('theme', 'light') // 提供默认值
const toggleTheme = inject('toggleTheme')
const user = inject('user')

// 注入复杂对象
const { theme: appTheme, actions } = inject('appContext')
</script>
```

---

## 5. 生命周期

### 5.1 Vue3生命周期钩子

```vue
<script setup>
import {
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

// 挂载前
onBeforeMount(() => {
  console.log('onBeforeMount - 组件挂载前')
})

// 挂载后
onMounted(() => {
  console.log('onMounted - 组件已挂载，可以操作DOM')
  // 初始化第三方库、绑定事件等
})

// 更新前
onBeforeUpdate(() => {
  console.log('onBeforeUpdate - 数据更新，DOM更新前')
})

// 更新后
onUpdated(() => {
  console.log('onUpdated - DOM已更新')
})

// 卸载前
onBeforeUnmount(() => {
  console.log('onBeforeUnmount - 组件卸载前')
  // 清理定时器、解绑事件等
})

// 卸载后
onUnmounted(() => {
  console.log('onUnmounted - 组件已卸载')
})

// keep-alive激活
onActivated(() => {
  console.log('onActivated - 组件被激活')
})

// keep-alive停用
onDeactivated(() => {
  console.log('onDeactivated - 组件被停用')
})

// 错误捕获
onErrorCaptured((error, instance, info) => {
  console.error('捕获到错误:', error)
  console.log('错误组件:', instance)
  console.log('错误信息:', info)
  // 返回false阻止错误继续传播
  return false
})
</script>
```

### 5.2 UniApp页面生命周期

```vue
<script setup>
import { onLoad, onShow, onReady, onHide, onUnload } from '@dcloudio/uni-app'
import { onPullDownRefresh, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref } from 'vue'

const pageData = ref(null)
const list = ref([])
const page = ref(1)

// 页面加载
onLoad((options) => {
  console.log('页面加载，参数:', options)
  // 获取页面参数
  const { id, type } = options
  loadPageData(id)
})

// 页面显示
onShow(() => {
  console.log('页面显示')
  // 刷新数据等操作
})

// 页面初次渲染完成
onReady(() => {
  console.log('页面渲染完成')
  // 可以操作DOM
})

// 页面隐藏
onHide(() => {
  console.log('页面隐藏')
})

// 页面卸载
onUnload(() => {
  console.log('页面卸载')
  // 清理工作
})

// 下拉刷新
onPullDownRefresh(async () => {
  console.log('下拉刷新')
  page.value = 1
  await loadList()
  uni.stopPullDownRefresh()
})

// 上拉触底
onReachBottom(() => {
  console.log('触底加载')
  page.value++
  loadList()
})

// 页面滚动
onPageScroll((e) => {
  console.log('滚动位置:', e.scrollTop)
})

// 分享给好友
onShareAppMessage((options) => {
  return {
    title: '分享标题',
    path: '/pages/index/index?from=share',
    imageUrl: '/static/share.png'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: '朋友圈分享标题',
    query: 'from=timeline'
  }
})

// 加载页面数据
const loadPageData = async (id) => {
  // ...
}

// 加载列表
const loadList = async () => {
  // ...
}
</script>
```

### 5.3 应用生命周期

```vue
<!-- App.vue -->
<script setup>
import { onLaunch, onShow, onHide, onError } from '@dcloudio/uni-app'

// 应用启动
onLaunch((options) => {
  console.log('App Launch', options)
  
  // 获取启动参数
  console.log('启动场景:', options.scene)
  console.log('启动路径:', options.path)
  
  // 检查更新
  checkUpdate()
  
  // 初始化
  initApp()
})

// 应用显示
onShow((options) => {
  console.log('App Show', options)
})

// 应用隐藏
onHide(() => {
  console.log('App Hide')
})

// 应用错误
onError((error) => {
  console.error('App Error:', error)
  // 上报错误
})

// 检查更新
const checkUpdate = () => {
  // #ifdef MP-WEIXIN
  const updateManager = uni.getUpdateManager()
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启？',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })
  // #endif
}

// 初始化应用
const initApp = () => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  console.log('系统信息:', systemInfo)
}
</script>
```

---

## 6. 路由与页面跳转

### 6.1 路由跳转封装

```javascript
// utils/router.js
const whiteList = ['/pages/login/login', '/pages/index/index']
const needLoginPages = ['/pages/user/user', '/pages/order/order']

// 路由跳转
export function navigateTo(options) {
  const url = typeof options === 'string' ? options : options.url
  const path = url.split('?')[0]
  
  // 登录检查
  if (needLoginPages.includes(path)) {
    const token = uni.getStorageSync('token')
    if (!token) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return uni.navigateTo({
        url: `/pages/login/login?redirect=${encodeURIComponent(url)}`
      })
    }
  }
  
  return uni.navigateTo(typeof options === 'string' ? { url: options } : options)
}

export function redirectTo(options) {
  return uni.redirectTo(typeof options === 'string' ? { url: options } : options)
}

export function switchTab(options) {
  return uni.switchTab(typeof options === 'string' ? { url: options } : options)
}

export function reLaunch(options) {
  return uni.reLaunch(typeof options === 'string' ? { url: options } : options)
}

export function navigateBack(delta = 1) {
  return uni.navigateBack({ delta })
}

export default {
  push: navigateTo,
  replace: redirectTo,
  switchTab,
  reLaunch,
  back: navigateBack
}
```

### 6.2 页面通信Hooks

```javascript
// composables/usePageChannel.js
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

export function usePageChannel() {
  const eventChannel = ref(null)
  
  onLoad(() => {
    // 获取当前页面的eventChannel
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    eventChannel.value = currentPage.getOpenerEventChannel?.()
  })
  
  // 监听事件
  const on = (eventName, callback) => {
    if (eventChannel.value) {
      eventChannel.value.on(eventName, callback)
    }
  }
  
  // 发送事件
  const emit = (eventName, data) => {
    if (eventChannel.value) {
      eventChannel.value.emit(eventName, data)
    }
  }
  
  return {
    eventChannel,
    on,
    emit
  }
}

// 使用示例
// 页面A
const goToPageB = () => {
  uni.navigateTo({
    url: '/pages/pageB/pageB',
    events: {
      // 监听页面B返回的数据
      returnData: (data) => {
        console.log('收到返回数据:', data)
      }
    },
    success: (res) => {
      // 传递数据给页面B
      res.eventChannel.emit('passData', { info: '来自页面A' })
    }
  })
}

// 页面B
const { on, emit } = usePageChannel()

onMounted(() => {
  // 接收页面A的数据
  on('passData', (data) => {
    console.log('收到数据:', data)
  })
})

// 返回并传递数据
const goBack = () => {
  emit('returnData', { result: '页面B的结果' })
  uni.navigateBack()
}
```

### 6.3 全局事件总线

```javascript
// utils/eventBus.js
import { ref } from 'vue'

class EventBus {
  constructor() {
    this.events = new Map()
  }
  
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
    
    // 返回取消订阅函数
    return () => this.off(event, callback)
  }
  
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
  
  emit(event, ...args) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(cb => cb(...args))
    }
  }
  
  off(event, callback) {
    if (!callback) {
      this.events.delete(event)
    } else {
      const callbacks = this.events.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }
  
  clear() {
    this.events.clear()
  }
}

export const eventBus = new EventBus()

// 也可以使用uni自带的事件
export const useGlobalEvent = () => {
  const on = (event, callback) => {
    uni.$on(event, callback)
    return () => uni.$off(event, callback)
  }
  
  const once = (event, callback) => {
    uni.$once(event, callback)
  }
  
  const emit = (event, data) => {
    uni.$emit(event, data)
  }
  
  const off = (event, callback) => {
    uni.$off(event, callback)
  }
  
  return { on, once, emit, off }
}
```

---

## 7. 数据请求与API调用

### 7.1 请求封装

```javascript
// utils/request.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'

// 请求配置
const config = {
  timeout: 30000,
  withCredentials: true
}

// 请求拦截
const requestInterceptor = (options) => {
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

// 响应拦截
const responseInterceptor = async (response, options) => {
  const { statusCode, data } = response
  
  if (statusCode === 200) {
    if (data.code === 0 || data.code === 200) {
      return data.data
    }
    
    if (data.code === 401) {
      // token过期处理
      await handleTokenExpired()
      // 重试请求
      return request(options)
    }
    
    uni.showToast({ title: data.message || '请求失败', icon: 'none' })
    return Promise.reject(data)
  }
  
  if (statusCode === 401) {
    await handleTokenExpired()
    return request(options)
  }
  
  uni.showToast({ title: '网络错误', icon: 'none' })
  return Promise.reject(response)
}

// 处理token过期
const handleTokenExpired = async () => {
  uni.removeStorageSync('token')
  uni.showToast({ title: '登录已过期', icon: 'none' })
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  uni.reLaunch({ url: '/pages/login/login' })
}

// 请求函数
export const request = (options) => {
  // 应用请求拦截器
  const finalOptions = requestInterceptor({
    url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data,
    header: options.header,
    timeout: options.timeout || config.timeout
  })
  
  return new Promise((resolve, reject) => {
    // 显示加载
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    uni.request({
      ...finalOptions,
      success: (res) => {
        responseInterceptor(res, options)
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

// 快捷方法
export const http = {
  get: (url, params, options = {}) => 
    request({ url, method: 'GET', data: params, ...options }),
  
  post: (url, data, options = {}) => 
    request({ url, method: 'POST', data, ...options }),
  
  put: (url, data, options = {}) => 
    request({ url, method: 'PUT', data, ...options }),
  
  delete: (url, data, options = {}) => 
    request({ url, method: 'DELETE', data, ...options })
}

export default http
```

### 7.2 API模块

```javascript
// api/user.js
import http from '@/utils/request'

export const userApi = {
  // 登录
  login: (data) => http.post('/user/login', data),
  
  // 获取用户信息
  getInfo: () => http.get('/user/info'),
  
  // 更新用户信息
  updateInfo: (data) => http.put('/user/info', data),
  
  // 获取订单列表
  getOrders: (params) => http.get('/user/orders', params)
}

// api/product.js
import http from '@/utils/request'

export const productApi = {
  // 获取商品列表
  getList: (params) => http.get('/product/list', params),
  
  // 获取商品详情
  getDetail: (id) => http.get(`/product/${id}`),
  
  // 搜索商品
  search: (keyword, params) => http.get('/product/search', { keyword, ...params })
}

// api/index.js
export * from './user'
export * from './product'
```

### 7.3 使用请求Hooks

```javascript
// composables/useRequest.js
import { ref, shallowRef } from 'vue'

export function useRequest(apiFn, options = {}) {
  const { immediate = false, initialData = null } = options
  
  const data = shallowRef(initialData)
  const loading = ref(false)
  const error = ref(null)
  
  const run = async (...args) => {
    loading.value = true
    error.value = null
    
    try {
      const res = await apiFn(...args)
      data.value = res
      return res
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const reset = () => {
    data.value = initialData
    loading.value = false
    error.value = null
  }
  
  // 立即执行
  if (immediate) {
    run()
  }
  
  return {
    data,
    loading,
    error,
    run,
    reset
  }
}

// composables/usePagination.js
import { ref, computed } from 'vue'

export function usePagination(apiFn, options = {}) {
  const { pageSize = 10 } = options
  
  const list = ref([])
  const page = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  
  const hasMore = computed(() => !finished.value && !loading.value)
  
  const loadData = async (refresh = false) => {
    if (loading.value) return
    if (finished.value && !refresh) return
    
    loading.value = true
    
    if (refresh) {
      page.value = 1
      finished.value = false
    }
    
    try {
      const res = await apiFn({
        page: page.value,
        pageSize
      })
      
      const items = res.list || res.data || []
      total.value = res.total || 0
      
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
      
      return res
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      uni.stopPullDownRefresh()
    }
  }
  
  const refresh = () => loadData(true)
  const loadMore = () => loadData(false)
  
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

```vue
<!-- 使用示例 -->
<template>
  <view>
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
    <view v-if="loading">加载中...</view>
    <view v-if="finished">没有更多了</view>
  </view>
</template>

<script setup>
import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app'
import { usePagination } from '@/composables/usePagination'
import { productApi } from '@/api/product'

const { 
  list, 
  loading, 
  finished, 
  refresh, 
  loadMore 
} = usePagination(productApi.getList)

onLoad(() => {
  refresh()
})

onPullDownRefresh(() => {
  refresh()
})

onReachBottom(() => {
  loadMore()
})
</script>
```

---

## 8. 状态管理Pinia

### 8.1 Store定义

```javascript
// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(uni.getStorageSync('userInfo') || null)
  
  // getters
  const isLogin = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.name || '未登录')
  const userId = computed(() => userInfo.value?.id)
  
  // actions
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
  
  const login = async (loginData) => {
    const res = await userApi.login(loginData)
    setToken(res.token)
    setUserInfo(res.userInfo)
    return res
  }
  
  const getUserInfo = async () => {
    if (!token.value) return null
    const res = await userApi.getInfo()
    setUserInfo(res)
    return res
  }
  
  const logout = () => {
    setToken('')
    setUserInfo(null)
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.reLaunch({ url: '/pages/login/login' })
  }
  
  // 微信登录
  const wxLogin = () => {
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
```

### 8.2 购物车Store

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // state
  const cartList = ref(uni.getStorageSync('cartList') || [])
  
  // getters
  const cartCount = computed(() => {
    return cartList.value.reduce((sum, item) => sum + item.count, 0)
  })
  
  const selectedItems = computed(() => {
    return cartList.value.filter(item => item.selected)
  })
  
  const totalPrice = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      return sum + item.price * item.count
    }, 0)
  })
  
  const isAllSelected = computed(() => {
    if (cartList.value.length === 0) return false
    return cartList.value.every(item => item.selected)
  })
  
  // actions
  const saveToStorage = () => {
    uni.setStorageSync('cartList', cartList.value)
  }
  
  const addToCart = (product) => {
    const existItem = cartList.value.find(item => item.id === product.id)
    
    if (existItem) {
      existItem.count++
    } else {
      cartList.value.push({
        ...product,
        count: 1,
        selected: true
      })
    }
    
    saveToStorage()
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
  
  const removeFromCart = (productId) => {
    const index = cartList.value.findIndex(item => item.id === productId)
    if (index > -1) {
      cartList.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  const updateCount = (productId, count) => {
    const item = cartList.value.find(item => item.id === productId)
    if (item) {
      if (count <= 0) {
        removeFromCart(productId)
      } else {
        item.count = count
        saveToStorage()
      }
    }
  }
  
  const toggleSelect = (productId) => {
    const item = cartList.value.find(item => item.id === productId)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }
  
  const toggleSelectAll = () => {
    const newValue = !isAllSelected.value
    cartList.value.forEach(item => {
      item.selected = newValue
    })
    saveToStorage()
  }
  
  const clearCart = () => {
    cartList.value = []
    uni.removeStorageSync('cartList')
  }
  
  const clearSelected = () => {
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
```

### 8.3 应用配置Store

```javascript
// stores/app.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // state
  const systemInfo = ref(uni.getSystemInfoSync())
  const theme = ref(uni.getStorageSync('theme') || 'light')
  const language = ref(uni.getStorageSync('language') || 'zh-CN')
  
  // getters
  const statusBarHeight = computed(() => systemInfo.value.statusBarHeight)
  const windowHeight = computed(() => systemInfo.value.windowHeight)
  const windowWidth = computed(() => systemInfo.value.windowWidth)
  const platform = computed(() => systemInfo.value.platform)
  const isIOS = computed(() => systemInfo.value.platform === 'ios')
  const isAndroid = computed(() => systemInfo.value.platform === 'android')
  
  const safeAreaInsets = computed(() => {
    const { safeArea, screenHeight, screenWidth } = systemInfo.value
    return {
      top: safeArea?.top || 0,
      bottom: screenHeight - (safeArea?.bottom || screenHeight),
      left: safeArea?.left || 0,
      right: screenWidth - (safeArea?.right || screenWidth)
    }
  })
  
  // actions
  const setTheme = (newTheme) => {
    theme.value = newTheme
    uni.setStorageSync('theme', newTheme)
  }
  
  const setLanguage = (newLanguage) => {
    language.value = newLanguage
    uni.setStorageSync('language', newLanguage)
  }
  
  const refreshSystemInfo = () => {
    systemInfo.value = uni.getSystemInfoSync()
  }
  
  return {
    // state
    systemInfo,
    theme,
    language,
    // getters
    statusBarHeight,
    windowHeight,
    windowWidth,
    platform,
    isIOS,
    isAndroid,
    safeAreaInsets,
    // actions
    setTheme,
    setLanguage,
    refreshSystemInfo
  }
})
```

### 8.4 在组件中使用

```vue
<template>
  <view class="page">
    <!-- 用户信息 -->
    <view v-if="isLogin">
      <text>欢迎，{{ userName }}</text>
      <button @click="handleLogout">退出登录</button>
    </view>
    <view v-else>
      <button @click="handleLogin">登录</button>
    </view>
    
    <!-- 购物车 -->
    <view class="cart-icon">
      <text>购物车</text>
      <text class="badge" v-if="cartCount > 0">{{ cartCount }}</text>
    </view>
    
    <!-- 商品列表 -->
    <view v-for="item in productList" :key="item.id">
      <text>{{ item.name }}</text>
      <button @click="addToCart(item)">加购</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

// 用户Store
const userStore = useUserStore()
const { isLogin, userName } = storeToRefs(userStore)

// 购物车Store
const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)
const { addToCart } = cartStore

const productList = ref([])

const handleLogin = async () => {
  try {
    await userStore.wxLogin()
    uni.showToast({ title: '登录成功', icon: 'success' })
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleLogout = () => {
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

## 9. 条件编译与多端适配

### 9.1 条件编译语法

```vue
<template>
  <view class="container">
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="share">分享给好友</button>
    <button open-type="contact">联系客服</button>
    <button open-type="getPhoneNumber" @getphonenumber="handleGetPhone">
      手机号登录
    </button>
    <!-- #endif -->
    
    <!-- #ifdef MP-DINGTALK -->
    <button @click="dingShare">钉钉分享</button>
    <button @click="choosePerson">选择联系人</button>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <button @click="h5Share">网页分享</button>
    <!-- #endif -->
    
    <!-- #ifndef MP-WEIXIN -->
    <text>非微信小程序显示</text>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref } from 'vue'

const platform = ref('')

// #ifdef MP-WEIXIN
platform.value = 'weixin'

const handleGetPhone = (e) => {
  if (e.detail.code) {
    console.log('手机号code:', e.detail.code)
  }
}
// #endif

// #ifdef MP-DINGTALK
platform.value = 'dingtalk'

const dingShare = () => {
  dd.share({
    type: 0,
    url: 'https://example.com',
    title: '分享标题'
  })
}

const choosePerson = () => {
  dd.choosePerson({
    multiple: true,
    success: (res) => {
      console.log('选中的人:', res.users)
    }
  })
}
// #endif

// #ifdef H5
platform.value = 'h5'

const h5Share = () => {
  // H5分享逻辑
}
// #endif
</script>

<style scoped>
/* #ifdef MP-WEIXIN */
.container {
  background-color: #07c160;
}
/* #endif */

/* #ifdef MP-DINGTALK */
.container {
  background-color: #3296fa;
}
/* #endif */
</style>
```

### 9.2 平台适配工具

```javascript
// utils/platform.js

// 获取当前平台
export const getPlatform = () => {
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

// 平台判断
export const isWeixin = () => {
  // #ifdef MP-WEIXIN
  return true
  // #endif
  return false
}

export const isDingtalk = () => {
  // #ifdef MP-DINGTALK
  return true
  // #endif
  return false
}

// 统一登录接口
export const platformLogin = () => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: (res) => resolve({ platform: 'weixin', code: res.code }),
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.getAuthCode({
      success: (res) => resolve({ platform: 'dingtalk', code: res.authCode }),
      fail: reject
    })
    // #endif
    
    // #ifdef H5
    resolve({ platform: 'h5', code: null })
    // #endif
  })
}

// 统一分享接口
export const platformShare = (options) => {
  // #ifdef MP-WEIXIN
  // 微信小程序通过 onShareAppMessage 实现
  return Promise.resolve()
  // #endif
  
  // #ifdef MP-DINGTALK
  return new Promise((resolve, reject) => {
    dd.share({
      type: 0,
      url: options.url,
      title: options.title,
      content: options.content,
      image: options.imageUrl,
      success: resolve,
      fail: reject
    })
  })
  // #endif
}

// 统一扫码接口
export const platformScan = () => {
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
      success: (res) => resolve(res.text),
      fail: reject
    })
    // #endif
  })
}
```

---

## 10. Hooks封装

### 10.1 通用Hooks

```javascript
// composables/useLoading.js
import { ref } from 'vue'

export function useLoading(initialValue = false) {
  const loading = ref(initialValue)
  
  const startLoading = (title = '加载中...') => {
    loading.value = true
    uni.showLoading({ title, mask: true })
  }
  
  const stopLoading = () => {
    loading.value = false
    uni.hideLoading()
  }
  
  const withLoading = async (fn, title = '加载中...') => {
    startLoading(title)
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }
  
  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  }
}

// composables/useToast.js
export function useToast() {
  const toast = (title, options = {}) => {
    uni.showToast({
      title,
      icon: options.icon || 'none',
      duration: options.duration || 2000,
      mask: options.mask || false
    })
  }
  
  const success = (title) => toast(title, { icon: 'success' })
  const error = (title) => toast(title, { icon: 'error' })
  const loading = (title = '加载中...') => toast(title, { icon: 'loading', mask: true })
  
  return {
    toast,
    success,
    error,
    loading
  }
}

// composables/useModal.js
export function useModal() {
  const confirm = (options) => {
    return new Promise((resolve) => {
      uni.showModal({
        title: options.title || '提示',
        content: options.content,
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        success: (res) => {
          resolve(res.confirm)
        }
      })
    })
  }
  
  const alert = (content, title = '提示') => {
    return confirm({ title, content, showCancel: false })
  }
  
  return {
    confirm,
    alert
  }
}
```

### 10.2 业务Hooks

```javascript
// composables/useAuth.js
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

export function useAuth() {
  const userStore = useUserStore()
  const { isLogin, userInfo, token } = storeToRefs(userStore)
  
  const checkLogin = (redirectUrl) => {
    if (!isLogin.value) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      uni.navigateTo({
        url: `/pages/login/login?redirect=${encodeURIComponent(redirectUrl || '')}`
      })
      return false
    }
    return true
  }
  
  const requireLogin = (fn) => {
    return (...args) => {
      if (checkLogin()) {
        return fn(...args)
      }
    }
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

// composables/useCountdown.js
import { ref, onUnmounted } from 'vue'

export function useCountdown(initialSeconds = 60) {
  const seconds = ref(0)
  const isCounting = ref(false)
  let timer = null
  
  const start = (duration = initialSeconds) => {
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
  
  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isCounting.value = false
    seconds.value = 0
  }
  
  onUnmounted(() => {
    stop()
  })
  
  return {
    seconds,
    isCounting,
    start,
    stop
  }
}

// composables/useUpload.js
import { ref } from 'vue'

export function useUpload(options = {}) {
  const uploading = ref(false)
  const progress = ref(0)
  
  const upload = async (filePath) => {
    uploading.value = true
    progress.value = 0
    
    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: options.url || '/api/upload',
        filePath,
        name: options.name || 'file',
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data)
            resolve(data.data)
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
  
  const chooseAndUpload = async (type = 'image') => {
    return new Promise((resolve, reject) => {
      if (type === 'image') {
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          success: async (res) => {
            try {
              const result = await upload(res.tempFilePaths[0])
              resolve(result)
            } catch (error) {
              reject(error)
            }
          },
          fail: reject
        })
      }
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

### 10.3 表单Hooks

```javascript
// composables/useForm.js
import { reactive, ref } from 'vue'

export function useForm(initialValues = {}, rules = {}) {
  const form = reactive({ ...initialValues })
  const errors = reactive({})
  const submitting = ref(false)
  
  // 验证单个字段
  const validateField = (field) => {
    const rule = rules[field]
    if (!rule) return true
    
    const value = form[field]
    
    // required
    if (rule.required && !value) {
      errors[field] = rule.message || `${field}不能为空`
      return false
    }
    
    // pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field}格式不正确`
      return false
    }
    
    // min/max
    if (rule.min && value.length < rule.min) {
      errors[field] = rule.message || `${field}至少${rule.min}个字符`
      return false
    }
    
    if (rule.max && value.length > rule.max) {
      errors[field] = rule.message || `${field}最多${rule.max}个字符`
      return false
    }
    
    // custom validator
    if (rule.validator) {
      const result = rule.validator(value, form)
      if (result !== true) {
        errors[field] = result || rule.message
        return false
      }
    }
    
    errors[field] = ''
    return true
  }
  
  // 验证所有字段
  const validate = () => {
    let valid = true
    Object.keys(rules).forEach(field => {
      if (!validateField(field)) {
        valid = false
      }
    })
    return valid
  }
  
  // 重置表单
  const reset = () => {
    Object.keys(form).forEach(key => {
      form[key] = initialValues[key] || ''
    })
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  }
  
  // 设置表单值
  const setValues = (values) => {
    Object.keys(values).forEach(key => {
      if (key in form) {
        form[key] = values[key]
      }
    })
  }
  
  // 提交表单
  const submit = async (handler) => {
    if (!validate()) {
      const firstError = Object.values(errors).find(e => e)
      if (firstError) {
        uni.showToast({ title: firstError, icon: 'none' })
      }
      return false
    }
    
    submitting.value = true
    try {
      await handler(form)
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

```vue
<!-- 使用示例 -->
<template>
  <view class="form">
    <view class="form-item">
      <input 
        v-model="form.username" 
        placeholder="用户名"
        @blur="validateField('username')"
      />
      <text class="error" v-if="errors.username">{{ errors.username }}</text>
    </view>
    
    <view class="form-item">
      <input 
        v-model="form.password" 
        type="password"
        placeholder="密码"
        @blur="validateField('password')"
      />
      <text class="error" v-if="errors.password">{{ errors.password }}</text>
    </view>
    
    <view class="form-item">
      <input 
        v-model="form.phone" 
        type="number"
        placeholder="手机号"
        @blur="validateField('phone')"
      />
      <text class="error" v-if="errors.phone">{{ errors.phone }}</text>
    </view>
    
    <button 
      :loading="submitting" 
      :disabled="submitting"
      @click="handleSubmit"
    >
      提交
    </button>
  </view>
</template>

<script setup>
import { useForm } from '@/composables/useForm'

const { form, errors, submitting, validateField, submit } = useForm(
  {
    username: '',
    password: '',
    phone: ''
  },
  {
    username: {
      required: true,
      min: 2,
      max: 20,
      message: '用户名2-20个字符'
    },
    password: {
      required: true,
      min: 6,
      message: '密码至少6位'
    },
    phone: {
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号'
    }
  }
)

const handleSubmit = () => {
  submit(async (data) => {
    console.log('提交数据:', data)
    // 调用API
    uni.showToast({ title: '提交成功', icon: 'success' })
  })
}
</script>
```

---

## 11. 微信小程序特有功能

### 11.1 微信登录与手机号

```vue
<template>
  <view class="login-page">
    <!-- 手机号一键登录 -->
    <button 
      open-type="getPhoneNumber" 
      @getphonenumber="handleGetPhone"
      class="login-btn"
    >
      手机号快捷登录
    </button>
    
    <!-- 头像昵称填写 -->
    <view class="user-info">
      <button 
        open-type="chooseAvatar" 
        @chooseavatar="handleChooseAvatar"
        class="avatar-btn"
      >
        <image :src="avatarUrl || '/static/default-avatar.png'" class="avatar"></image>
      </button>
      <input 
        type="nickname" 
        v-model="nickname"
        placeholder="请输入昵称"
        class="nickname-input"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import http from '@/utils/request'

const userStore = useUserStore()
const avatarUrl = ref('')
const nickname = ref('')

// 获取手机号
const handleGetPhone = async (e) => {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '获取手机号失败', icon: 'none' })
    return
  }
  
  try {
    // 发送code到后端解密
    const res = await http.post('/wx/phone', {
      code: e.detail.code
    })
    
    console.log('手机号:', res.phone)
    
    // 登录
    await userStore.login({ phone: res.phone })
    
    uni.showToast({ title: '登录成功', icon: 'success' })
    uni.switchTab({ url: '/pages/index/index' })
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 选择头像
const handleChooseAvatar = async (e) => {
  const tempUrl = e.detail.avatarUrl
  
  // 上传头像
  uni.uploadFile({
    url: 'https://api.example.com/upload',
    filePath: tempUrl,
    name: 'file',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('token')}`
    },
    success: (res) => {
      const data = JSON.parse(res.data)
      avatarUrl.value = data.data.url
    }
  })
}
</script>
```

### 11.2 微信支付

```javascript
// composables/useWxPay.js
import http from '@/utils/request'

export function useWxPay() {
  const pay = async (orderInfo) => {
    try {
      // 创建订单获取支付参数
      const payParams = await http.post('/order/create', orderInfo)
      
      // 调起支付
      return new Promise((resolve, reject) => {
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: payParams.timeStamp,
          nonceStr: payParams.nonceStr,
          package: payParams.package,
          signType: payParams.signType,
          paySign: payParams.paySign,
          success: (res) => {
            uni.showToast({ title: '支付成功', icon: 'success' })
            resolve(res)
          },
          fail: (err) => {
            if (err.errMsg.includes('cancel')) {
              uni.showToast({ title: '已取消支付', icon: 'none' })
            } else {
              uni.showToast({ title: '支付失败', icon: 'none' })
            }
            reject(err)
          }
        })
      })
    } catch (error) {
      uni.showToast({ title: '创建订单失败', icon: 'none' })
      throw error
    }
  }
  
  return { pay }
}
```

### 11.3 订阅消息

```javascript
// composables/useSubscribe.js
export function useSubscribe() {
  const subscribe = (tmplIds) => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.requestSubscribeMessage({
        tmplIds,
        success: (res) => {
          const accepted = tmplIds.filter(id => res[id] === 'accept')
          resolve(accepted)
        },
        fail: reject
      })
      // #endif
    })
  }
  
  // 订阅订单相关消息
  const subscribeOrder = () => {
    return subscribe([
      'TEMPLATE_ID_1', // 发货通知
      'TEMPLATE_ID_2'  // 签收通知
    ])
  }
  
  return {
    subscribe,
    subscribeOrder
  }
}
```

---

## 12. 钉钉小程序特有功能

### 12.1 钉钉免登

```javascript
// composables/useDingAuth.js
import http from '@/utils/request'

export function useDingAuth() {
  // 获取免登授权码
  const getAuthCode = () => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-DINGTALK
      dd.getAuthCode({
        success: (res) => resolve(res.authCode),
        fail: reject
      })
      // #endif
    })
  }
  
  // 免登录
  const login = async () => {
    const authCode = await getAuthCode()
    const res = await http.post('/ding/login', { authCode })
    return res
  }
  
  return {
    getAuthCode,
    login
  }
}
```

### 12.2 通讯录

```javascript
// composables/useDingContact.js
export function useDingContact() {
  // 选择人员
  const choosePerson = (options = {}) => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-DINGTALK
      dd.choosePerson({
        multiple: options.multiple !== false,
        maxUsers: options.maxUsers || 50,
        pickedUsers: options.pickedUsers || [],
        success: (res) => resolve(res.users),
        fail: reject
      })
      // #endif
    })
  }
  
  // 选择部门
  const chooseDepartment = (options = {}) => {
    return new Promise((resolve, reject) => {
      // #ifdef MP-DINGTALK
      dd.chooseDepartment({
        multiple: options.multiple !== false,
        success: (res) => resolve(res.departments),
        fail: reject
      })
      // #endif
    })
  }
  
  return {
    choosePerson,
    chooseDepartment
  }
}
```

---

## 13. 性能优化

### 13.1 组件懒加载

```vue
<template>
  <view>
    <!-- 条件懒加载 -->
    <HeavyComponent v-if="showComponent" />
    
    <!-- 异步组件 -->
    <Suspense>
      <template #default>
        <AsyncChart />
      </template>
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </view>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue'

const showComponent = ref(false)

const AsyncChart = defineAsyncComponent(() => 
  import('@/components/Chart/Chart.vue')
)

onMounted(() => {
  // 延迟加载重组件
  setTimeout(() => {
    showComponent.value = true
  }, 100)
})
</script>
```

### 13.2 列表优化

```vue
<template>
  <scroll-view 
    scroll-y 
    class="list-container"
    @scrolltolower="loadMore"
    :scroll-into-view="scrollIntoId"
  >
    <!-- 使用v-memo优化 -->
    <view 
      v-for="item in list" 
      :key="item.id"
      v-memo="[item.id, item.selected]"
      class="list-item"
    >
      <image :src="item.image" lazy-load mode="aspectFill"></image>
      <text>{{ item.name }}</text>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, shallowRef } from 'vue'

// 使用shallowRef优化大数据列表
const list = shallowRef([])

const loadMore = async () => {
  const newItems = await fetchList()
  // 整体替换触发更新
  list.value = [...list.value, ...newItems]
}
</script>
```

### 13.3 数据缓存

```javascript
// utils/cache.js
class Cache {
  constructor(prefix = 'cache_') {
    this.prefix = prefix
  }
  
  set(key, value, ttl = 0) {
    const data = {
      value,
      expire: ttl ? Date.now() + ttl * 1000 : 0
    }
    uni.setStorageSync(this.prefix + key, JSON.stringify(data))
  }
  
  get(key) {
    try {
      const raw = uni.getStorageSync(this.prefix + key)
      if (!raw) return null
      
      const data = JSON.parse(raw)
      if (data.expire && data.expire < Date.now()) {
        this.remove(key)
        return null
      }
      return data.value
    } catch {
      return null
    }
  }
  
  remove(key) {
    uni.removeStorageSync(this.prefix + key)
  }
  
  clear() {
    const keys = uni.getStorageInfoSync().keys
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        uni.removeStorageSync(key)
      }
    })
  }
}

export const cache = new Cache()

// 带缓存的请求
export const cachedRequest = async (key, fetcher, ttl = 300) => {
  const cached = cache.get(key)
  if (cached) return cached
  
  const data = await fetcher()
  cache.set(key, data, ttl)
  return data
}
```

### 13.4 分包加载

```json
// pages.json
{
  "pages": [
    { "path": "pages/index/index" },
    { "path": "pages/user/user" }
  ],
  "subPackages": [
    {
      "root": "packageA",
      "pages": [
        { "path": "pages/detail/detail" },
        { "path": "pages/list/list" }
      ]
    },
    {
      "root": "packageB",
      "pages": [
        { "path": "pages/order/order" },
        { "path": "pages/pay/pay" }
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    }
  }
}
```

---

## 附录：完整页面模板

### 列表页模板

```vue
<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input 
        v-model="searchKey" 
        placeholder="搜索" 
        @confirm="handleSearch"
      />
    </view>
    
    <!-- 列表 -->
    <scroll-view scroll-y class="list" @scrolltolower="loadMore">
      <view 
        v-for="item in list" 
        :key="item.id" 
        class="list-item"
        @click="goDetail(item.id)"
      >
        <image :src="item.image" lazy-load mode="aspectFill"></image>
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="price">¥{{ item.price }}</text>
        </view>
      </view>
      
      <view class="load-status">
        <text v-if="loading">加载中...</text>
        <text v-else-if="finished">没有更多了</text>
      </view>
    </scroll-view>
    
    <!-- 空状态 -->
    <Empty v-if="!loading && list.length === 0" text="暂无数据" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePagination } from '@/composables/usePagination'
import { productApi } from '@/api/product'

const searchKey = ref('')

const { 
  list, 
  loading, 
  finished, 
  refresh, 
  loadMore 
} = usePagination((params) => 
  productApi.getList({ ...params, keyword: searchKey.value })
)

onLoad(() => {
  refresh()
})

onPullDownRefresh(() => {
  refresh()
})

onReachBottom(() => {
  loadMore()
})

const handleSearch = () => {
  refresh()
}

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
  
  input {
    background-color: #f5f5f5;
    padding: 16rpx 24rpx;
    border-radius: 32rpx;
  }
}

.list {
  height: calc(100vh - 100rpx);
}

.list-item {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 2rpx;
  
  image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 8rpx;
  }
  
  .info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .name {
    font-size: 28rpx;
    color: #333;
  }
  
  .price {
    font-size: 32rpx;
    color: #ff4d4f;
    font-weight: bold;
  }
}

.load-status {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}
</style>
```

---

本文档涵盖了Vue3 + UniApp开发微信和钉钉小程序的所有核心知识点，包括组合式API、响应式系统、组件系统、生命周期、Pinia状态管理、Hooks封装、条件编译和性能优化等内容。每个部分都提供了详细的代码示例和使用场景说明。
