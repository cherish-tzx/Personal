# Vue3 完整语法详解
<div class="doc-toc">
## 目录
1. [Vue3新特性概览](#一vue3新特性概览)
2. [创建应用](#二创建应用)
3. [组合式API基础](#三组合式api基础)
4. [响应式系统](#四响应式系统)
5. [计算属性与侦听器](#五计算属性与侦听器)
6. [生命周期](#六生命周期)
7. [模板语法](#七模板语法)
8. [组件基础](#八组件基础)
9. [Props详解](#九props详解)
10. [事件与v-model](#十事件与v-model)
11. [组件通信](#十一组件通信)
12. [插槽](#十二插槽)
13. [依赖注入](#十三依赖注入)
14. [动态组件与异步组件](#十四动态组件与异步组件)
15. [自定义指令](#十五自定义指令)
16. [Teleport传送门](#十六teleport传送门)
17. [Suspense](#十七suspense)
18. [过渡与动画](#十八过渡与动画)
19. [Vue Router 4](#十九vue-router-4)
20. [Pinia状态管理](#二十pinia状态管理)
21. [组合式函数](#二十一组合式函数)
22. [封装组件最佳实践](#二十二封装组件最佳实践)


</div>

---

## 一、Vue3新特性概览

### 1.1 主要新特性

```javascript
// 1. 组合式API (Composition API)
// 2. setup语法糖 (<script setup>)
// 3. 更好的TypeScript支持
// 4. Teleport传送门
// 5. Suspense异步组件
// 6. 片段(Fragments) - 多根节点
// 7. Emits选项
// 8. createRenderer自定义渲染器
// 9. 更快的虚拟DOM
// 10. Tree-shaking支持
```

### 1.2 破坏性变更

```javascript
// 1. 全局API改为应用实例API
// Vue 2
Vue.component('MyComponent', {})
Vue.directive('focus', {})
Vue.mixin({})
Vue.use(VueRouter)

// Vue 3
const app = createApp(App)
app.component('MyComponent', {})
app.directive('focus', {})
app.mixin({})
app.use(router)

// 2. v-model变化
// Vue 2: value + input
// Vue 3: modelValue + update:modelValue

// 3. v-if/v-for优先级
// Vue 2: v-for > v-if
// Vue 3: v-if > v-for

// 4. 移除的功能
// - $on, $off, $once (EventBus)
// - 过滤器 filters
// - $listeners (合并到$attrs)
// - .native修饰符
```

---

## 二、创建应用

### 2.1 应用实例

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(createPinia())

// 全局配置
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
}

app.config.warnHandler = (msg, vm, trace) => {
  console.warn('全局警告:', msg)
}

app.config.globalProperties.$http = axios
app.config.globalProperties.$filters = {
  formatDate(value) {
    return new Date(value).toLocaleDateString()
  }
}

// 全局组件
app.component('BaseButton', BaseButton)
app.component('BaseInput', BaseInput)

// 全局指令
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 全局混入
app.mixin({
  created() {
    console.log('global mixin created')
  }
})

// 挂载应用
app.mount('#app')
```

### 2.2 应用配置

```javascript
// 完整的应用配置选项
const app = createApp(App)

// 性能追踪
app.config.performance = true

// 编译器选项（仅在使用运行时编译器时有效）
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
app.config.compilerOptions.whitespace = 'condense'
app.config.compilerOptions.delimiters = ['${', '}']

// 全局属性
app.config.globalProperties.msg = 'hello'

// 选项合并策略
app.config.optionMergeStrategies.custom = (toVal, fromVal) => {
  return fromVal || toVal
}
```

---

## 三、组合式API基础

### 3.1 setup函数

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  // setup在beforeCreate之前执行
  // 没有this访问
  setup(props, context) {
    // context包含: attrs, slots, emit, expose
    const { attrs, slots, emit, expose } = context
    
    // 响应式数据
    const count = ref(0)
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    function increment() {
      count.value++
    }
    
    // 生命周期
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    // 暴露给模板
    return {
      count,
      doubleCount,
      increment
    }
  }
}
</script>
```

### 3.2 script setup语法糖

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

// 顶层变量自动暴露给模板
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

### 3.3 defineProps和defineEmits

```vue
<script setup>
// defineProps - 声明props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

// 纯类型声明（TypeScript）
const props = defineProps<{
  title: string
  count?: number
}>()

// 带默认值的类型声明
const props = withDefaults(defineProps<{
  title: string
  count?: number
  items?: string[]
}>(), {
  count: 0,
  items: () => []
})

// defineEmits - 声明事件
const emit = defineEmits(['update', 'delete'])

// 带验证
const emit = defineEmits({
  update: (payload) => {
    return payload.id !== undefined
  },
  delete: null
})

// 类型声明（TypeScript）
const emit = defineEmits<{
  (e: 'update', payload: { id: number }): void
  (e: 'delete', id: number): void
}>()

// 使用
function handleClick() {
  emit('update', { id: 1 })
}
</script>
```

### 3.4 defineExpose

```vue
<!-- 子组件 -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const privateData = ref('私有数据')

function increment() {
  count.value++
}

function publicMethod() {
  return 'public'
}

// 暴露给父组件
defineExpose({
  count,
  increment,
  publicMethod
})
</script>
```

```vue
<!-- 父组件 -->
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref(null)

onMounted(() => {
  // 访问子组件暴露的内容
  console.log(childRef.value.count)
  childRef.value.increment()
  childRef.value.publicMethod()
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

### 3.5 defineOptions和defineSlots

```vue
<script setup>
// defineOptions - 定义组件选项 (Vue 3.3+)
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false
})

// defineSlots - 声明插槽类型 (Vue 3.3+)
const slots = defineSlots<{
  default(props: { item: string }): any
  header(): any
}>()
</script>
```

### 3.6 useAttrs和useSlots

```vue
<script setup>
import { useAttrs, useSlots } from 'vue'

// 获取attrs
const attrs = useAttrs()
console.log(attrs.class, attrs.style)

// 获取slots
const slots = useSlots()
const hasHeader = !!slots.header
</script>
```

---

## 四、响应式系统

### 4.1 ref

```javascript
import { ref, isRef, unref, toRef, toRefs } from 'vue'

// 创建ref
const count = ref(0)
const message = ref('Hello')
const user = ref({ name: '张三', age: 25 })

// 访问和修改
console.log(count.value)  // 0
count.value++

// 在模板中自动解包
// <p>{{ count }}</p>  不需要.value

// isRef - 检查是否为ref
console.log(isRef(count))  // true
console.log(isRef(0))      // false

// unref - 解包ref（如果是ref返回.value，否则返回参数本身）
console.log(unref(count))  // 0
console.log(unref(100))    // 100

// shallowRef - 浅层响应式
import { shallowRef, triggerRef } from 'vue'

const state = shallowRef({ count: 0 })
// 不会触发更新
state.value.count++
// 需要手动触发
triggerRef(state)
// 或者替换整个对象
state.value = { count: 1 }

// customRef - 自定义ref
import { customRef } from 'vue'

function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

const debouncedText = useDebouncedRef('hello', 300)
```

### 4.2 reactive

```javascript
import { reactive, isReactive, shallowReactive, readonly, isReadonly } from 'vue'

// 创建响应式对象
const state = reactive({
  count: 0,
  user: {
    name: '张三',
    address: {
      city: '北京'
    }
  },
  items: [1, 2, 3]
})

// 直接访问和修改（不需要.value）
state.count++
state.user.name = '李四'
state.items.push(4)

// 深层响应式
state.user.address.city = '上海'  // 响应式

// isReactive - 检查是否为响应式对象
console.log(isReactive(state))       // true
console.log(isReactive(state.user))  // true

// shallowReactive - 浅层响应式
const shallowState = shallowReactive({
  count: 0,
  nested: { count: 0 }
})
shallowState.count++          // 响应式
shallowState.nested.count++   // 非响应式

// readonly - 只读响应式
const original = reactive({ count: 0 })
const copy = readonly(original)
copy.count++  // 警告：无法修改

// shallowReadonly - 浅层只读
const shallowCopy = shallowReadonly(original)
```

### 4.3 toRef和toRefs

```javascript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  name: '张三',
  age: 25
})

// toRef - 为响应式对象的属性创建ref
const nameRef = toRef(state, 'name')
nameRef.value = '李四'  // state.name也会改变

// toRef也可以为普通对象创建ref（Vue 3.3+）
const obj = { count: 0 }
const countRef = toRef(obj, 'count')

// toRefs - 将响应式对象转为ref对象
const { name, age } = toRefs(state)
name.value = '王五'  // state.name也会改变

// 常用于解构props
const props = defineProps(['title', 'count'])
const { title, count } = toRefs(props)

// 或者单个属性
const title = toRef(props, 'title')
```

### 4.4 响应式工具函数

```javascript
import {
  isRef,
  isReactive,
  isReadonly,
  isProxy,
  toRaw,
  markRaw
} from 'vue'

const state = reactive({ count: 0 })
const countRef = ref(0)
const readonlyState = readonly(state)

// 类型检查
isRef(countRef)         // true
isReactive(state)       // true
isReadonly(readonlyState)  // true
isProxy(state)          // true (reactive或readonly)

// toRaw - 获取原始对象
const raw = toRaw(state)
console.log(raw === state)  // false
console.log(isReactive(raw))  // false

// markRaw - 标记对象永远不会被转为响应式
const foo = markRaw({ count: 0 })
const reactiveObj = reactive({ foo })
console.log(isReactive(reactiveObj.foo))  // false

// 使用场景：第三方库实例、大型不可变数据
const chart = markRaw(new Chart())
```

### 4.5 响应式最佳实践

```javascript
import { ref, reactive, computed } from 'vue'

// 1. 基本类型使用ref
const count = ref(0)
const message = ref('')
const isLoading = ref(false)

// 2. 对象/数组使用reactive
const state = reactive({
  user: null,
  items: [],
  filters: {}
})

// 3. 不要解构reactive对象（会失去响应性）
const state = reactive({ count: 0 })
// 错误
let { count } = state  // count不是响应式的
// 正确
const { count } = toRefs(state)  // count是ref

// 4. ref用于可能被替换的对象
const user = ref(null)
user.value = { name: '张三' }  // 替换整个对象

// 5. reactive用于不会被替换的对象
const form = reactive({
  name: '',
  email: ''
})
// 重置表单
Object.assign(form, { name: '', email: '' })
```

---

## 五、计算属性与侦听器

### 5.1 computed计算属性

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 只读计算属性
const fullName = computed(() => {
  return firstName.value + lastName.value
})

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return firstName.value + lastName.value
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

// 带调试选项
const debugComputed = computed(() => firstName.value, {
  onTrack(e) {
    console.log('tracked:', e)
  },
  onTrigger(e) {
    console.log('triggered:', e)
  }
})

// 复杂计算
const items = ref([
  { name: '苹果', price: 10, count: 2 },
  { name: '香蕉', price: 5, count: 3 }
])

const totalPrice = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + item.price * item.count
  }, 0)
})

const filteredItems = computed(() => {
  return items.value.filter(item => item.price > 8)
})

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => a.price - b.price)
})
</script>
```

### 5.2 watch侦听器

```vue
<script setup>
import { ref, reactive, watch } from 'vue'

const count = ref(0)
const message = ref('Hello')
const state = reactive({ user: { name: '张三' } })

// 监听单个ref
watch(count, (newVal, oldVal) => {
  console.log('count变化:', newVal, oldVal)
})

// 监听多个源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count或message变化了')
})

// 监听getter函数
watch(
  () => state.user.name,
  (newVal, oldVal) => {
    console.log('user.name变化:', newVal)
  }
)

// 监听reactive对象（自动深度监听）
watch(state, (newVal, oldVal) => {
  console.log('state变化了')
  // 注意：newVal和oldVal相同（同一引用）
})

// 监听reactive对象的属性（需要getter）
watch(
  () => state.user,
  (newVal, oldVal) => {
    console.log('user变化了')
  },
  { deep: true }  // 需要deep选项
)

// 配置选项
watch(count, callback, {
  immediate: true,  // 立即执行
  deep: true,       // 深度监听
  flush: 'post',    // 'pre' | 'post' | 'sync'
  onTrack(e) {},    // 调试
  onTrigger(e) {}
})

// 停止监听
const stop = watch(count, () => {})
stop()  // 停止监听

// 清理副作用
watch(count, (newVal, oldVal, onCleanup) => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => {
      // 处理数据
    })
  
  onCleanup(() => {
    controller.abort()  // 取消请求
  })
})
</script>
```

### 5.3 watchEffect

```vue
<script setup>
import { ref, watchEffect, watchPostEffect, watchSyncEffect } from 'vue'

const count = ref(0)
const message = ref('Hello')

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log('count:', count.value)
  console.log('message:', message.value)
  // 自动追踪count和message
})

// 带清理函数
watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    console.log(count.value)
  }, 1000)
  
  onCleanup(() => {
    clearInterval(timer)
  })
})

// 停止监听
const stop = watchEffect(() => {})
stop()

// 配置选项
watchEffect(callback, {
  flush: 'post',  // DOM更新后执行
  onTrack(e) {},
  onTrigger(e) {}
})

// watchPostEffect - DOM更新后执行
watchPostEffect(() => {
  // 可以访问更新后的DOM
})

// watchSyncEffect - 同步执行
watchSyncEffect(() => {
  // 同步执行，谨慎使用
})
</script>
```

### 5.4 watch vs watchEffect

```javascript
// watch
// - 明确指定依赖
// - 可以访问新旧值
// - 懒执行（默认不立即执行）
// - 更精确的控制

watch(source, (newVal, oldVal) => {
  // 只有source变化时才执行
})

// watchEffect
// - 自动追踪依赖
// - 不能访问旧值
// - 立即执行
// - 适合副作用同步

watchEffect(() => {
  // 立即执行，自动追踪所有依赖
  console.log(count.value, message.value)
})
```

---

## 六、生命周期

### 6.1 组合式API生命周期

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
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered
} from 'vue'

// 挂载阶段
onBeforeMount(() => {
  console.log('组件挂载前')
})

onMounted(() => {
  console.log('组件已挂载')
  // 适合：DOM操作、第三方库初始化、发起请求
})

// 更新阶段
onBeforeUpdate(() => {
  console.log('组件更新前')
})

onUpdated(() => {
  console.log('组件已更新')
  // 避免在这里修改状态
})

// 卸载阶段
onBeforeUnmount(() => {
  console.log('组件卸载前')
  // 适合：清理定时器、取消订阅
})

onUnmounted(() => {
  console.log('组件已卸载')
})

// keep-alive相关
onActivated(() => {
  console.log('组件激活')
})

onDeactivated(() => {
  console.log('组件停用')
})

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('捕获到错误:', err)
  return false  // 阻止错误继续传播
})

// 调试钩子
onRenderTracked((e) => {
  console.log('依赖被追踪:', e)
})

onRenderTriggered((e) => {
  console.log('重新渲染触发:', e)
})
</script>
```

### 6.2 生命周期对比

```javascript
// Vue 2选项式 -> Vue 3组合式
beforeCreate  -> setup()
created       -> setup()
beforeMount   -> onBeforeMount
mounted       -> onMounted
beforeUpdate  -> onBeforeUpdate
updated       -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed     -> onUnmounted
activated     -> onActivated
deactivated   -> onDeactivated
errorCaptured -> onErrorCaptured
```

### 6.3 生命周期实践

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

onMounted(() => {
  // 初始化图表
  chartInstance = echarts.init(chartRef.value)
  renderChart()
  
  // 监听resize
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  resizeObserver.observe(chartRef.value)
})

onUnmounted(() => {
  // 清理图表
  chartInstance?.dispose()
  chartInstance = null
  
  // 清理observer
  resizeObserver?.disconnect()
  resizeObserver = null
})

function renderChart() {
  chartInstance?.setOption({
    // 图表配置
  })
}
</script>

<template>
  <div ref="chartRef" class="chart"></div>
</template>
```

---

## 七、模板语法

### 7.1 文本插值

```html
<!-- 文本插值 -->
<span>{{ message }}</span>

<!-- JavaScript表达式 -->
<span>{{ number + 1 }}</span>
<span>{{ ok ? 'YES' : 'NO' }}</span>
<span>{{ message.split('').reverse().join('') }}</span>
<span>{{ formatDate(date) }}</span>

<!-- 原始HTML -->
<span v-html="rawHtml"></span>
```

### 7.2 指令

```html
<!-- v-bind -->
<img :src="imageSrc">
<a :href="url" :class="linkClass">链接</a>
<div :id="dynamicId" :data-id="id"></div>

<!-- 动态参数 -->
<a :[attributeName]="url">链接</a>
<button @[eventName]="handler">点击</button>

<!-- 绑定多个属性 -->
<div v-bind="objectOfAttrs"></div>
<!-- objectOfAttrs = { id: 'container', class: 'wrapper' } -->

<!-- v-on -->
<button @click="handleClick">点击</button>
<button @click="count++">增加</button>
<input @keyup.enter="submit">

<!-- v-model -->
<input v-model="text">
<input v-model.lazy="text">
<input v-model.number="age" type="number">
<input v-model.trim="text">

<!-- v-if/v-else-if/v-else -->
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>C</div>

<!-- v-show -->
<div v-show="isVisible">显示/隐藏</div>

<!-- v-for -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
<li v-for="(item, index) in items" :key="item.id">{{ index }}: {{ item.name }}</li>
<div v-for="(value, key) in object" :key="key">{{ key }}: {{ value }}</div>
<span v-for="n in 10" :key="n">{{ n }}</span>

<!-- v-pre -->
<span v-pre>{{ 不会被编译 }}</span>

<!-- v-once -->
<span v-once>{{ 只渲染一次 }}</span>

<!-- v-memo (Vue 3.2+) -->
<div v-memo="[item.id, item.selected]">
  <!-- 只有当id或selected变化时才重新渲染 -->
</div>

<!-- v-cloak -->
<div v-cloak>{{ message }}</div>
```

### 7.3 修饰符

```html
<!-- 事件修饰符 -->
<button @click.stop="doThis">阻止冒泡</button>
<form @submit.prevent="onSubmit">阻止默认</form>
<div @click.capture="doThis">捕获模式</div>
<div @click.self="doThat">只在自身触发</div>
<button @click.once="doThis">只触发一次</button>
<div @scroll.passive="onScroll">被动监听</div>

<!-- 按键修饰符 -->
<input @keyup.enter="submit">
<input @keyup.tab="onTab">
<input @keyup.delete="onDelete">
<input @keyup.esc="onEsc">
<input @keyup.space="onSpace">
<input @keyup.up="onUp">
<input @keyup.down="onDown">
<input @keyup.left="onLeft">
<input @keyup.right="onRight">

<!-- 系统修饰键 -->
<button @click.ctrl="onClick">Ctrl+点击</button>
<button @click.alt="onClick">Alt+点击</button>
<button @click.shift="onClick">Shift+点击</button>
<button @click.meta="onClick">Meta+点击</button>
<button @click.ctrl.exact="onClick">仅Ctrl+点击</button>
<button @click.exact="onClick">无修饰键时点击</button>

<!-- 鼠标按钮修饰符 -->
<button @click.left="onLeft">左键</button>
<button @click.right="onRight">右键</button>
<button @click.middle="onMiddle">中键</button>

<!-- v-model修饰符 -->
<input v-model.lazy="msg">
<input v-model.number="age">
<input v-model.trim="msg">
```

### 7.4 Class与Style绑定

```html
<!-- Class绑定 -->
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
<div :class="[activeClass, errorClass]"></div>
<div :class="[isActive ? 'active' : '', errorClass]"></div>
<div :class="[{ active: isActive }, errorClass]"></div>

<!-- Style绑定 -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div :style="styleObject"></div>
<div :style="[baseStyles, overridingStyles]"></div>

<!-- 自动前缀 -->
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

---

## 八、组件基础

### 8.1 组件定义

```vue
<!-- 单文件组件 -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

<style scoped>
button {
  padding: 10px 20px;
}
</style>
```

### 8.2 组件注册

```javascript
// 全局注册
import { createApp } from 'vue'
import MyComponent from './MyComponent.vue'

const app = createApp({})
app.component('MyComponent', MyComponent)

// 全局注册多个
const components = {
  BaseButton,
  BaseInput,
  BaseCard
}
Object.entries(components).forEach(([name, component]) => {
  app.component(name, component)
})
```

```vue
<!-- 局部注册 (选项式) -->
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<!-- 局部注册 (script setup) -->
<script setup>
import ComponentA from './ComponentA.vue'
// 直接使用，无需注册
</script>

<template>
  <ComponentA />
</template>
```

### 8.3 多根节点组件（Fragments）

```vue
<!-- Vue 3支持多根节点 -->
<template>
  <header>头部</header>
  <main>主体</main>
  <footer>底部</footer>
</template>

<!-- 需要显式绑定$attrs -->
<template>
  <header v-bind="$attrs">头部</header>
  <main>主体</main>
  <footer>底部</footer>
</template>
```

---

## 九、Props详解

### 9.1 Props声明

```vue
<script setup>
// 基础声明
const props = defineProps(['title', 'count'])

// 对象声明（推荐）
const props = defineProps({
  title: String,
  count: {
    type: Number,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({})
  },
  status: {
    type: String,
    validator: (value) => ['pending', 'success', 'error'].includes(value)
  },
  callback: Function,
  date: Date,
  pattern: RegExp,
  custom: {
    type: [String, Number],  // 多种类型
    default: ''
  }
})

// 使用props
console.log(props.title)
</script>
```

### 9.2 TypeScript中的Props

```vue
<script setup lang="ts">
// 基于类型的声明
interface Props {
  title: string
  count?: number
  items?: string[]
  user?: {
    name: string
    age: number
  }
}

const props = defineProps<Props>()

// 带默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],
  user: () => ({ name: '', age: 0 })
})

// 复杂类型
interface User {
  id: number
  name: string
  email: string
}

const props = defineProps<{
  users: User[]
  selectedUser: User | null
  onSelect: (user: User) => void
}>()
</script>
```

### 9.3 Props使用

```vue
<!-- 父组件 -->
<template>
  <!-- 静态props -->
  <MyComponent title="标题" />
  
  <!-- 动态props -->
  <MyComponent :title="dynamicTitle" />
  
  <!-- 数字 -->
  <MyComponent :count="42" />
  
  <!-- 布尔值 -->
  <MyComponent disabled />
  <MyComponent :disabled="true" />
  
  <!-- 数组 -->
  <MyComponent :items="['a', 'b', 'c']" />
  
  <!-- 对象 -->
  <MyComponent :config="{ theme: 'dark' }" />
  
  <!-- 传递所有props -->
  <MyComponent v-bind="propsObject" />
</template>
```

---

## 十、事件与v-model

### 10.1 自定义事件

```vue
<!-- 子组件 -->
<script setup>
// 声明事件
const emit = defineEmits(['update', 'delete', 'submit'])

// 带验证
const emit = defineEmits({
  update: (payload) => {
    if (payload.id) return true
    console.warn('Invalid payload')
    return false
  },
  delete: null,  // 无验证
  submit: (data) => data !== null
})

function handleClick() {
  emit('update', { id: 1, name: '张三' })
}

function handleDelete(id) {
  emit('delete', id)
}
</script>

<template>
  <button @click="handleClick">更新</button>
  <button @click="handleDelete(1)">删除</button>
</template>
```

```vue
<!-- 父组件 -->
<template>
  <MyComponent
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>

<script setup>
function handleUpdate(payload) {
  console.log('更新:', payload)
}

function handleDelete(id) {
  console.log('删除:', id)
}
</script>
```

### 10.2 v-model

```vue
<!-- 子组件 - 基础v-model -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="modelValue" @input="updateValue">
</template>

<!-- 父组件 -->
<template>
  <MyInput v-model="text" />
</template>
```

```vue
<!-- 子组件 - 多个v-model -->
<script setup>
defineProps(['firstName', 'lastName'])
defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  >
  <input
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  >
</template>

<!-- 父组件 -->
<template>
  <UserName v-model:firstName="first" v-model:lastName="last" />
</template>
```

```vue
<!-- 子组件 - v-model修饰符 -->
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

function handleInput(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input :value="modelValue" @input="handleInput">
</template>

<!-- 父组件 -->
<template>
  <MyInput v-model.capitalize="text" />
</template>
```

### 10.3 defineModel宏（Vue 3.4+）

```vue
<!-- 子组件 - 简化的v-model -->
<script setup>
// 基础用法
const model = defineModel()

// 带选项
const model = defineModel({ type: String, default: '' })

// 命名的v-model
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')

// 带修饰符
const [model, modifiers] = defineModel()
if (modifiers.capitalize) {
  // 处理capitalize修饰符
}
</script>

<template>
  <input v-model="model">
</template>

<!-- 父组件 -->
<template>
  <MyInput v-model="text" />
</template>
```

---

## 十一、组件通信

### 11.1 Props / Emits（父子通信）

```vue
<!-- 父组件 -->
<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const message = ref('Hello')
const count = ref(0)

function handleUpdate(newMessage) {
  message.value = newMessage
}
</script>

<template>
  <ChildComponent
    :message="message"
    :count="count"
    @update="handleUpdate"
    @increment="count++"
  />
</template>
```

```vue
<!-- 子组件 -->
<script setup>
const props = defineProps(['message', 'count'])
const emit = defineEmits(['update', 'increment'])

function updateMessage() {
  emit('update', 'New message')
}
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ count }}</p>
    <button @click="updateMessage">更新消息</button>
    <button @click="emit('increment')">增加</button>
  </div>
</template>
```

### 11.2 v-model（父子双向绑定）

```vue
<!-- 父组件 -->
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const form = ref({ name: '', email: '' })
</script>

<template>
  <Modal v-model:visible="visible">
    <Form v-model="form" />
  </Modal>
</template>
```

```vue
<!-- Modal子组件 -->
<script setup>
const props = defineProps(['visible'])
const emit = defineEmits(['update:visible'])

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <div v-if="visible" class="modal">
    <slot></slot>
    <button @click="close">关闭</button>
  </div>
</template>
```

### 11.3 Refs（父访问子）

```vue
<!-- 父组件 -->
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref(null)

onMounted(() => {
  // 访问子组件暴露的方法和属性
  childRef.value.publicMethod()
  console.log(childRef.value.count)
})

function callChildMethod() {
  childRef.value.reset()
}
</script>

<template>
  <ChildComponent ref="childRef" />
  <button @click="callChildMethod">调用子组件方法</button>
</template>
```

```vue
<!-- 子组件 -->
<script setup>
import { ref } from 'vue'

const count = ref(0)

function publicMethod() {
  console.log('public method called')
}

function reset() {
  count.value = 0
}

// 暴露给父组件
defineExpose({
  count,
  publicMethod,
  reset
})
</script>
```

### 11.4 Attrs（透传属性）

```vue
<!-- 父组件 -->
<template>
  <MyInput
    class="custom-class"
    data-id="123"
    placeholder="请输入"
    @focus="handleFocus"
  />
</template>
```

```vue
<!-- MyInput子组件 -->
<script setup>
import { useAttrs } from 'vue'

// 禁用属性继承
defineOptions({
  inheritAttrs: false
})

const attrs = useAttrs()
console.log(attrs)  // { class, data-id, placeholder, onFocus }
</script>

<template>
  <div class="input-wrapper">
    <!-- 将attrs透传给input -->
    <input v-bind="$attrs">
  </div>
</template>
```

### 11.5 Provide / Inject（跨层级通信）

详见第十三章

### 11.6 Pinia（全局状态管理）

详见第二十章

---

## 十二、插槽

### 12.1 默认插槽

```vue
<!-- 子组件 BaseCard.vue -->
<template>
  <div class="card">
    <slot>默认内容</slot>
  </div>
</template>

<!-- 父组件使用 -->
<template>
  <BaseCard>
    <p>自定义内容</p>
  </BaseCard>
</template>
```

### 12.2 具名插槽

```vue
<!-- 子组件 BaseLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<template>
  <BaseLayout>
    <template #header>
      <h1>页面标题</h1>
    </template>
    
    <template #default>
      <p>主要内容</p>
    </template>
    
    <template #footer>
      <p>页脚信息</p>
    </template>
  </BaseLayout>
</template>
```

### 12.3 作用域插槽

```vue
<!-- 子组件 ItemList.vue -->
<script setup>
defineProps(['items'])
</script>

<template>
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      <slot name="item" :item="item" :index="index">
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件使用 -->
<template>
  <ItemList :items="items">
    <template #item="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
      <button @click="remove(item.id)">删除</button>
    </template>
  </ItemList>
</template>
```

### 12.4 条件插槽

```vue
<script setup>
import { useSlots } from 'vue'

const slots = useSlots()
const hasHeader = !!slots.header
const hasFooter = !!slots.footer
</script>

<template>
  <div class="card">
    <div v-if="hasHeader" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="hasFooter" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

### 12.5 动态插槽名

```vue
<template>
  <BaseLayout>
    <template #[slotName]>
      动态插槽内容
    </template>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'

const slotName = ref('header')
</script>
```

---

## 十三、依赖注入

### 13.1 Provide

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref, readonly } from 'vue'

// 提供静态值
provide('appName', 'My App')

// 提供响应式值
const theme = ref('dark')
provide('theme', theme)

// 提供只读值（防止子组件修改）
const user = ref({ name: '张三' })
provide('user', readonly(user))

// 提供方法
function updateTheme(newTheme) {
  theme.value = newTheme
}
provide('updateTheme', updateTheme)

// 提供对象
provide('config', {
  theme,
  user: readonly(user),
  updateTheme
})
</script>
```

### 13.2 Inject

```vue
<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

// 注入值
const appName = inject('appName')

// 带默认值
const theme = inject('theme', 'light')

// 注入响应式值
const user = inject('user')

// 注入方法
const updateTheme = inject('updateTheme')

// 注入对象
const { theme, user, updateTheme } = inject('config')

// 工厂函数默认值
const value = inject('key', () => {
  return expensiveComputation()
}, true)  // 第三个参数表示默认值是工厂函数
</script>

<template>
  <div :class="theme">
    <p>App: {{ appName }}</p>
    <p>User: {{ user.name }}</p>
    <button @click="updateTheme('light')">切换主题</button>
  </div>
</template>
```

### 13.3 使用Symbol作为Key

```javascript
// keys.js
export const themeKey = Symbol('theme')
export const userKey = Symbol('user')

// 祖先组件
import { provide } from 'vue'
import { themeKey, userKey } from './keys'

provide(themeKey, theme)
provide(userKey, user)

// 后代组件
import { inject } from 'vue'
import { themeKey, userKey } from './keys'

const theme = inject(themeKey)
const user = inject(userKey)
```

### 13.4 应用级Provide

```javascript
// main.js
import { createApp } from 'vue'

const app = createApp(App)

// 应用级provide
app.provide('appName', 'My App')
app.provide('globalConfig', {
  apiUrl: 'https://api.example.com',
  debug: true
})

app.mount('#app')
```

---

## 十四、动态组件与异步组件

### 14.1 动态组件

```vue
<script setup>
import { ref, shallowRef } from 'vue'
import TabA from './TabA.vue'
import TabB from './TabB.vue'
import TabC from './TabC.vue'

const tabs = { TabA, TabB, TabC }
const currentTab = ref('TabA')

// 使用shallowRef存储组件
const currentComponent = shallowRef(TabA)
</script>

<template>
  <div>
    <button
      v-for="(_, tab) in tabs"
      :key="tab"
      :class="{ active: currentTab === tab }"
      @click="currentTab = tab"
    >
      {{ tab }}
    </button>
    
    <!-- 动态组件 -->
    <component :is="tabs[currentTab]" />
    
    <!-- 使用keep-alive缓存 -->
    <KeepAlive>
      <component :is="tabs[currentTab]" />
    </KeepAlive>
    
    <!-- keep-alive配置 -->
    <KeepAlive :include="['TabA', 'TabB']" :exclude="['TabC']" :max="10">
      <component :is="tabs[currentTab]" />
    </KeepAlive>
  </div>
</template>
```

### 14.2 异步组件

```javascript
import { defineAsyncComponent } from 'vue'

// 基础用法
const AsyncComponent = defineAsyncComponent(() =>
  import('./MyComponent.vue')
)

// 带配置
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,  // 显示loading前的延迟
  timeout: 3000,  // 超时时间
  suspensible: false,  // 是否可被Suspense控制
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      retry()
    } else {
      fail()
    }
  }
})
```

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncModal = defineAsyncComponent(() =>
  import('./Modal.vue')
)
</script>

<template>
  <AsyncModal v-if="showModal" @close="showModal = false" />
</template>
```

---

## 十五、自定义指令

### 15.1 指令定义

```javascript
// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 简写形式
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

```vue
<!-- 局部注册 -->
<script setup>
// 以v开头的驼峰命名会被识别为指令
const vFocus = {
  mounted: (el) => el.focus()
}

// 简写
const vColor = (el, binding) => {
  el.style.color = binding.value
}
</script>

<template>
  <input v-focus>
  <p v-color="'red'">红色文字</p>
</template>
```

### 15.2 指令钩子

```javascript
const myDirective = {
  // 绑定元素的attribute或事件监听器被应用之前
  created(el, binding, vnode, prevVnode) {},
  
  // 元素被插入DOM之前
  beforeMount(el, binding, vnode, prevVnode) {},
  
  // 元素被插入DOM之后
  mounted(el, binding, vnode, prevVnode) {},
  
  // 父组件更新之前
  beforeUpdate(el, binding, vnode, prevVnode) {},
  
  // 父组件及所有子组件更新之后
  updated(el, binding, vnode, prevVnode) {},
  
  // 元素被移除之前
  beforeUnmount(el, binding, vnode, prevVnode) {},
  
  // 元素被移除之后
  unmounted(el, binding, vnode, prevVnode) {}
}
```

### 15.3 指令参数

```javascript
// binding对象
{
  value: any,           // 传递给指令的值
  oldValue: any,        // 之前的值（仅在beforeUpdate和updated中可用）
  arg: string,          // 传递给指令的参数
  modifiers: object,    // 修饰符对象
  instance: object,     // 组件实例
  dir: object           // 指令定义对象
}
```

```html
<div v-demo:foo.a.b="value"></div>
<!--
binding = {
  arg: 'foo',
  modifiers: { a: true, b: true },
  value: <value>
}
-->
```

### 15.4 实用指令

```vue
<script setup>
// v-click-outside
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

// v-debounce
const vDebounce = {
  mounted(el, binding) {
    let timer
    el.addEventListener('input', () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, binding.arg || 300)
    })
  }
}

// v-lazy 图片懒加载
const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
    el._lazyObserver = observer
  },
  unmounted(el) {
    el._lazyObserver?.disconnect()
  }
}

// v-permission 权限指令
const vPermission = {
  mounted(el, binding) {
    const permission = binding.value
    const permissions = useUserStore().permissions
    
    if (!permissions.includes(permission)) {
      el.parentNode?.removeChild(el)
    }
  }
}

// v-loading
const vLoading = {
  mounted(el, binding) {
    const mask = document.createElement('div')
    mask.className = 'loading-mask'
    mask.innerHTML = '<div class="spinner"></div>'
    mask.style.display = binding.value ? 'flex' : 'none'
    el.style.position = 'relative'
    el.appendChild(mask)
    el._loadingMask = mask
  },
  updated(el, binding) {
    el._loadingMask.style.display = binding.value ? 'flex' : 'none'
  },
  unmounted(el) {
    el._loadingMask?.remove()
  }
}

// v-copy 复制
const vCopy = {
  mounted(el, binding) {
    el._copyText = binding.value
    el.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(el._copyText)
        // 可以触发成功提示
      } catch (err) {
        console.error('复制失败:', err)
      }
    })
  },
  updated(el, binding) {
    el._copyText = binding.value
  }
}

// v-longpress 长按
const vLongpress = {
  mounted(el, binding) {
    let timer = null
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) return
      timer = setTimeout(() => {
        binding.value(e)
      }, binding.arg || 500)
    }
    const cancel = () => {
      clearTimeout(timer)
      timer = null
    }
    
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
}
</script>

<template>
  <div v-click-outside="closeMenu">菜单</div>
  <input v-debounce:500="search">
  <img v-lazy="imageUrl">
  <button v-permission="'admin:create'">创建</button>
  <div v-loading="isLoading">内容</div>
  <button v-copy="textToCopy">复制</button>
  <button v-longpress:1000="handleLongPress">长按</button>
</template>
```

---

## 十六、Teleport传送门

### 16.1 基础用法

```vue
<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <button @click="showModal = true">打开模态框</button>
  
  <!-- 将内容传送到body -->
  <Teleport to="body">
    <div v-if="showModal" class="modal">
      <p>模态框内容</p>
      <button @click="showModal = false">关闭</button>
    </div>
  </Teleport>
</template>
```

### 16.2 传送目标

```html
<!-- 传送到指定选择器 -->
<Teleport to="#modal-container">...</Teleport>
<Teleport to=".modal-wrapper">...</Teleport>
<Teleport to="[data-modal]">...</Teleport>

<!-- 传送到body -->
<Teleport to="body">...</Teleport>
```

### 16.3 禁用Teleport

```vue
<script setup>
import { ref } from 'vue'

const isMobile = ref(false)
</script>

<template>
  <!-- 移动端禁用传送 -->
  <Teleport to="body" :disabled="isMobile">
    <div class="modal">模态框</div>
  </Teleport>
</template>
```

### 16.4 多个Teleport到同一目标

```vue
<template>
  <Teleport to="#modals">
    <div>模态框A</div>
  </Teleport>
  <Teleport to="#modals">
    <div>模态框B</div>
  </Teleport>
  <!-- 两个内容会按顺序追加到#modals -->
</template>
```

---

## 十七、Suspense

### 17.1 基础用法

```vue
<template>
  <Suspense>
    <!-- 异步组件 -->
    <template #default>
      <AsyncComponent />
    </template>
    
    <!-- 加载中显示 -->
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### 17.2 异步setup

```vue
<!-- AsyncComponent.vue -->
<script setup>
// 异步setup
const data = await fetchData()

// 或使用顶层await
const user = await fetch('/api/user').then(r => r.json())
</script>

<template>
  <div>{{ data }}</div>
</template>
```

### 17.3 错误处理

```vue
<script setup>
import { onErrorCaptured, ref } from 'vue'

const error = ref(null)

onErrorCaptured((e) => {
  error.value = e
  return false  // 阻止错误传播
})
</script>

<template>
  <div v-if="error">加载失败: {{ error.message }}</div>
  <Suspense v-else>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### 17.4 结合Transition

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition mode="out-in">
      <Suspense>
        <template #default>
          <component :is="Component" />
        </template>
        <template #fallback>
          <div>加载中...</div>
        </template>
      </Suspense>
    </Transition>
  </RouterView>
</template>
```

---

## 十八、过渡与动画

### 18.1 Transition组件

```vue
<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <button @click="show = !show">切换</button>
  
  <!-- 基础过渡 -->
  <Transition name="fade">
    <p v-if="show">Hello</p>
  </Transition>
  
  <!-- 自定义类名 -->
  <Transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <p v-if="show">Hello</p>
  </Transition>
  
  <!-- 指定时长 -->
  <Transition :duration="500">...</Transition>
  <Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
  
  <!-- 过渡模式 -->
  <Transition name="fade" mode="out-in">
    <component :is="currentComponent" />
  </Transition>
  
  <!-- 初始渲染过渡 -->
  <Transition appear name="fade">
    <p>初始渲染也有动画</p>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 18.2 JavaScript钩子

```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >
    <p v-if="show">Hello</p>
  </Transition>
</template>

<script setup>
function onBeforeEnter(el) {
  el.style.opacity = 0
}

function onEnter(el, done) {
  // 使用GSAP或其他动画库
  gsap.to(el, {
    opacity: 1,
    duration: 0.5,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    duration: 0.5,
    onComplete: done
  })
}
</script>
```

### 18.3 TransitionGroup

```vue
<script setup>
import { ref } from 'vue'

const items = ref([1, 2, 3, 4, 5])

function add() {
  items.value.push(items.value.length + 1)
}

function remove(index) {
  items.value.splice(index, 1)
}

function shuffle() {
  items.value = items.value.sort(() => Math.random() - 0.5)
}
</script>

<template>
  <button @click="add">添加</button>
  <button @click="shuffle">打乱</button>
  
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item" @click="remove(items.indexOf(item))">
      {{ item }}
    </li>
  </TransitionGroup>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 移动动画 */
.list-move {
  transition: transform 0.5s ease;
}

/* 让离开的元素脱离文档流 */
.list-leave-active {
  position: absolute;
}
</style>
```

---

## 十九、Vue Router 4

### 19.1 基础配置

```javascript
// router/index.js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于',
      requiresAuth: true
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  }
})

export default router
```

### 19.2 组合式API

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, watch } from 'vue'

const router = useRouter()
const route = useRoute()

// 获取路由参数
const userId = computed(() => route.params.id)
const query = computed(() => route.query)

// 监听路由变化
watch(
  () => route.params.id,
  (newId) => {
    fetchUser(newId)
  }
)

// 编程式导航
function goToHome() {
  router.push('/')
  router.push({ name: 'Home' })
  router.push({ path: '/' })
}

function goToUser(id) {
  router.push({ name: 'User', params: { id } })
}

function goWithQuery() {
  router.push({ path: '/search', query: { q: 'vue' } })
}

function replace() {
  router.replace('/new-page')
}

function goBack() {
  router.go(-1)
  router.back()
}

function goForward() {
  router.go(1)
  router.forward()
}
</script>
```

### 19.3 导航守卫

```javascript
// 全局守卫
router.beforeEach((to, from) => {
  // 返回false取消导航
  // 返回路由地址进行重定向
  // 不返回或返回true继续导航
  
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

router.beforeResolve(async (to) => {
  if (to.meta.requiresData) {
    try {
      await fetchData(to.params.id)
    } catch (error) {
      return { name: 'Error' }
    }
  }
})

router.afterEach((to, from, failure) => {
  if (!failure) {
    document.title = to.meta.title || '默认标题'
  }
})
```

```javascript
// 路由独享守卫
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from) => {
      if (!hasAdminPermission()) {
        return '/403'
      }
    }
  }
]
```

```vue
<!-- 组件内守卫 -->
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to, from) => {
  // 路由更新时（参数变化）
})

onBeforeRouteLeave((to, from) => {
  // 离开当前路由
  if (hasUnsavedChanges.value) {
    const answer = confirm('有未保存的修改，确定离开吗？')
    if (!answer) return false
  }
})
</script>
```

### 19.4 路由懒加载

```javascript
const routes = [
  {
    path: '/user',
    component: () => import('@/views/User.vue')
  },
  // 命名chunk
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue')
  }
]
```

### 19.5 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: UserLayout,
    children: [
      {
        path: '',
        name: 'UserHome',
        component: UserHome
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile
      },
      {
        path: 'posts',
        name: 'UserPosts',
        component: UserPosts
      }
    ]
  }
]
```

---

## 二十、Pinia状态管理

### 20.1 创建Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 选项式写法
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    
    // 使用this
    doubleCountPlusOne() {
      return this.doubleCount + 1
    },
    
    // 接收参数
    getCountById: (state) => {
      return (id) => state.items.find(item => item.id === id)
    }
  },
  
  actions: {
    increment() {
      this.count++
    },
    
    async fetchData() {
      const data = await api.getData()
      this.items = data
    }
  }
})

// 组合式写法（推荐）
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const name = ref('Counter')
  
  // getters
  const doubleCount = computed(() => count.value * 2)
  
  // actions
  function increment() {
    count.value++
  }
  
  async function fetchData() {
    const data = await api.getData()
    // ...
  }
  
  return {
    count,
    name,
    doubleCount,
    increment,
    fetchData
  }
})
```

### 20.2 使用Store

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()

// 直接访问
console.log(counterStore.count)
console.log(counterStore.doubleCount)

// 解构（使用storeToRefs保持响应性）
const { count, name, doubleCount } = storeToRefs(counterStore)

// actions可以直接解构
const { increment, fetchData } = counterStore

// 修改state
counterStore.count++
counterStore.$patch({ count: 10 })
counterStore.$patch((state) => {
  state.count++
  state.name = 'New Name'
})

// 重置state
counterStore.$reset()

// 替换state
counterStore.$state = { count: 0, name: 'Reset' }

// 订阅state变化
counterStore.$subscribe((mutation, state) => {
  console.log('state changed:', mutation.type, state)
})

// 订阅action
counterStore.$onAction(({
  name,      // action名称
  store,     // store实例
  args,      // 传递给action的参数
  after,     // action成功后的回调
  onError    // action失败后的回调
}) => {
  console.log(`action ${name} called`)
  
  after((result) => {
    console.log(`action ${name} finished with result:`, result)
  })
  
  onError((error) => {
    console.error(`action ${name} failed:`, error)
  })
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

### 20.3 Store组合

```javascript
// stores/user.js
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  
  async function login(credentials) {
    const data = await api.login(credentials)
    user.value = data.user
  }
  
  return { user, isLoggedIn, login }
})

// stores/cart.js
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const items = ref([])
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.count, 0)
  })
  
  async function checkout() {
    if (!userStore.isLoggedIn) {
      throw new Error('请先登录')
    }
    await api.checkout(items.value)
    items.value = []
  }
  
  return { items, totalPrice, checkout }
})
```

### 20.4 持久化

```javascript
// 使用pinia-plugin-persistedstate
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 在store中启用
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    user: null
  }),
  persist: true  // 启用持久化
})

// 或配置选项
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    user: null
  }),
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token']  // 只持久化token
  }
})
```

---

## 二十一、组合式函数

### 21.1 基础组合式函数

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  
  return { x, y }
}
```

```vue
<script setup>
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <p>鼠标位置: {{ x }}, {{ y }}</p>
</template>
```

### 21.2 带参数的组合式函数

```javascript
// composables/useFetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function fetchData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(toValue(url))
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  watchEffect(() => {
    fetchData()
  })
  
  return { data, error, loading, refresh: fetchData }
}
```

```vue
<script setup>
import { useFetch } from '@/composables/useFetch'

const { data, error, loading, refresh } = useFetch('/api/users')

// 响应式URL
const userId = ref(1)
const { data: user } = useFetch(() => `/api/users/${userId.value}`)
</script>
```

### 21.3 常用组合式函数

```javascript
// useCounter
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }
  
  return { count, increment, decrement, reset }
}

// useToggle
export function useToggle(initialValue = false) {
  const state = ref(initialValue)
  
  function toggle() {
    state.value = !state.value
  }
  
  function setTrue() { state.value = true }
  function setFalse() { state.value = false }
  
  return { state, toggle, setTrue, setFalse }
}

// useLocalStorage
export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const data = ref(stored ? JSON.parse(stored) : defaultValue)
  
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return data
}

// useDebounce
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  let timer
  
  watch(value, (newValue) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  
  return debouncedValue
}

// useThrottle
export function useThrottle(fn, delay = 300) {
  let lastTime = 0
  
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// useClickOutside
export function useClickOutside(elementRef, callback) {
  function handler(event) {
    if (elementRef.value && !elementRef.value.contains(event.target)) {
      callback(event)
    }
  }
  
  onMounted(() => document.addEventListener('click', handler))
  onUnmounted(() => document.removeEventListener('click', handler))
}

// useEventListener
export function useEventListener(target, event, handler) {
  onMounted(() => {
    const el = toValue(target)
    el?.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    const el = toValue(target)
    el?.removeEventListener(event, handler)
  })
}

// useIntersectionObserver
export function useIntersectionObserver(elementRef, callback, options = {}) {
  const isIntersecting = ref(false)
  let observer = null
  
  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      isIntersecting.value = entries[0].isIntersecting
      callback(entries[0])
    }, options)
    
    if (elementRef.value) {
      observer.observe(elementRef.value)
    }
  })
  
  onUnmounted(() => {
    observer?.disconnect()
  })
  
  return { isIntersecting }
}

// useMediaQuery
export function useMediaQuery(query) {
  const matches = ref(false)
  let mediaQuery = null
  
  function update() {
    matches.value = mediaQuery?.matches ?? false
  }
  
  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    update()
    mediaQuery.addEventListener('change', update)
  })
  
  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', update)
  })
  
  return matches
}
```

---

## 二十二、封装组件最佳实践

### 22.1 通用Button组件

```vue
<!-- components/BaseButton.vue -->
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="[
      'base-button',
      `base-button--${type}`,
      `base-button--${size}`,
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-block': block
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__loading">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    </span>
    <span v-else-if="icon" class="base-button__icon">
      <i :class="icon"></i>
    </span>
    <span class="base-button__text">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.base-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.base-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.base-button--small {
  padding: 5px 10px;
  font-size: 12px;
}

.base-button--large {
  padding: 12px 24px;
  font-size: 16px;
}

.base-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.base-button.is-block {
  width: 100%;
}

.spinner {
  width: 14px;
  height: 14px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

### 22.2 通用Modal组件

```vue
<!-- components/BaseModal.vue -->
<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string | number
  showClose?: boolean
  showFooter?: boolean
  maskClosable?: boolean
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  width: 520,
  showClose: true,
  showFooter: true,
  maskClosable: true,
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
    emit('open')
  } else {
    document.body.style.overflow = ''
    emit('close')
  }
})

function close() {
  emit('update:modelValue', false)
}

function handleMaskClick() {
  if (props.maskClosable) {
    close()
  }
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-mask" @click.self="handleMaskClick">
        <div class="modal-container" :style="containerStyle">
          <div class="modal-header">
            <slot name="header">
              <span class="modal-title">{{ title }}</span>
            </slot>
            <button v-if="showClose" class="modal-close" @click="close">
              ×
            </button>
          </div>
          
          <div class="modal-body">
            <slot />
          </div>
          
          <div v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <BaseButton @click="handleCancel">{{ cancelText }}</BaseButton>
              <BaseButton type="primary" :loading="confirmLoading" @click="handleConfirm">
                {{ confirmText }}
              </BaseButton>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 24px;
  overflow: auto;
  flex: 1;
}

.modal-footer {
  padding: 12px 24px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
```

### 22.3 通用Table组件

```vue
<!-- components/BaseTable.vue -->
<script setup lang="ts" generic="T">
interface Column<T> {
  key: keyof T | string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (value: any, row: T, index: number) => any
}

interface Props {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T
  loading?: boolean
  selection?: boolean
  stripe?: boolean
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id' as any,
  loading: false,
  selection: false,
  stripe: false,
  border: false
})

const emit = defineEmits<{
  (e: 'row-click', row: T, index: number): void
  (e: 'selection-change', rows: T[]): void
  (e: 'sort-change', sort: { key: string; order: 'asc' | 'desc' }): void
}>()

const slots = useSlots()
const selectedRows = defineModel<T[]>('selectedRows', { default: [] })

const sortState = ref<{ key: string; order: 'asc' | 'desc' | null }>({
  key: '',
  order: null
})

const isAllSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length
})

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length
})

function isSelected(row: T) {
  return selectedRows.value.some(r => r[props.rowKey] === row[props.rowKey])
}

function toggleSelect(row: T) {
  if (isSelected(row)) {
    selectedRows.value = selectedRows.value.filter(r => r[props.rowKey] !== row[props.rowKey])
  } else {
    selectedRows.value = [...selectedRows.value, row]
  }
  emit('selection-change', selectedRows.value)
}

function toggleSelectAll() {
  selectedRows.value = isAllSelected.value ? [] : [...props.data]
  emit('selection-change', selectedRows.value)
}

function handleSort(column: Column<T>) {
  if (!column.sortable) return
  
  const key = column.key as string
  let order: 'asc' | 'desc' = 'asc'
  
  if (sortState.value.key === key) {
    order = sortState.value.order === 'asc' ? 'desc' : 'asc'
  }
  
  sortState.value = { key, order }
  emit('sort-change', { key, order })
}

function getCellValue(row: T, column: Column<T>, index: number) {
  const value = row[column.key as keyof T]
  if (column.formatter) {
    return column.formatter(value, row, index)
  }
  return value
}
</script>

<template>
  <div class="base-table" :class="{ 'is-stripe': stripe, 'is-border': border }">
    <div v-if="$slots.toolbar" class="base-table__toolbar">
      <slot name="toolbar" />
    </div>
    
    <div class="base-table__wrapper">
      <table>
        <thead>
          <tr>
            <th v-if="selection" class="selection-column">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
              >
            </th>
            <th
              v-for="column in columns"
              :key="String(column.key)"
              :style="{ width: column.width ? `${column.width}px` : 'auto' }"
              :class="{ sortable: column.sortable }"
              @click="handleSort(column)"
            >
              <slot :name="`header-${String(column.key)}`" :column="column">
                {{ column.title }}
              </slot>
              <span v-if="column.sortable" class="sort-icon">
                <span :class="{ active: sortState.key === column.key && sortState.order === 'asc' }">↑</span>
                <span :class="{ active: sortState.key === column.key && sortState.order === 'desc' }">↓</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (selection ? 1 : 0)" class="loading-cell">
              <slot name="loading">加载中...</slot>
            </td>
          </tr>
          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length + (selection ? 1 : 0)" class="empty-cell">
              <slot name="empty">暂无数据</slot>
            </td>
          </tr>
          <tr
            v-else
            v-for="(row, index) in data"
            :key="String(row[rowKey])"
            :class="{ selected: isSelected(row) }"
            @click="emit('row-click', row, index)"
          >
            <td v-if="selection" class="selection-column" @click.stop>
              <input
                type="checkbox"
                :checked="isSelected(row)"
                @change="toggleSelect(row)"
              >
            </td>
            <td v-for="column in columns" :key="String(column.key)">
              <slot
                :name="String(column.key)"
                :row="row"
                :column="column"
                :index="index"
                :value="getCellValue(row, column, index)"
              >
                {{ getCellValue(row, column, index) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="$slots.pagination" class="base-table__pagination">
      <slot name="pagination" />
    </div>
  </div>
</template>

<style scoped>
.base-table {
  width: 100%;
}

.base-table__wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

th {
  background-color: #fafafa;
  font-weight: 600;
}

.is-stripe tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.is-border th,
.is-border td {
  border: 1px solid #ebeef5;
}

.sortable {
  cursor: pointer;
}

.sort-icon span {
  color: #c0c4cc;
  font-size: 12px;
}

.sort-icon span.active {
  color: #409eff;
}

.selection-column {
  width: 50px;
  text-align: center;
}

tr.selected {
  background-color: #ecf5ff;
}

.loading-cell,
.empty-cell {
  text-align: center;
  color: #909399;
  padding: 30px;
}

.base-table__toolbar {
  margin-bottom: 16px;
}

.base-table__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
```

---

## 附录：Vue3 API速查

### 组合式API

```javascript
// 响应式
ref()
reactive()
computed()
readonly()
watchEffect()
watch()

// 响应式工具
isRef()
unref()
toRef()
toRefs()
isReactive()
isReadonly()
isProxy()
toRaw()
markRaw()
shallowRef()
shallowReactive()
shallowReadonly()

// 生命周期
onBeforeMount()
onMounted()
onBeforeUpdate()
onUpdated()
onBeforeUnmount()
onUnmounted()
onActivated()
onDeactivated()
onErrorCaptured()

// 依赖注入
provide()
inject()

// 其他
getCurrentInstance()
nextTick()
```

### 内置组件

```html
<Transition>
<TransitionGroup>
<KeepAlive>
<Teleport>
<Suspense>
```

### 内置指令

```html
v-text
v-html
v-show
v-if
v-else
v-else-if
v-for
v-on (@)
v-bind (:)
v-model
v-slot (#)
v-pre
v-once
v-memo
v-cloak
```

### script setup宏

```javascript
defineProps()
defineEmits()
defineExpose()
defineOptions()
defineSlots()
defineModel()
withDefaults()
```

---

以上是Vue3完整语法详解，涵盖了所有核心概念和实用示例。
