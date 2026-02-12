# Vue3 + TypeScript 完整语法详解
<div class="doc-toc">
## 目录
1. [项目配置](#一项目配置)
2. [组件类型定义](#二组件类型定义)
3. [Props类型](#三props类型)
4. [Emits类型](#四emits类型)
5. [Refs类型](#五refs类型)
6. [响应式类型](#六响应式类型)
7. [计算属性与侦听器类型](#七计算属性与侦听器类型)
8. [生命周期类型](#八生命周期类型)
9. [组件通信类型](#九组件通信类型)
10. [插槽类型](#十插槽类型)
11. [依赖注入类型](#十一依赖注入类型)
12. [路由类型](#十二路由类型)
13. [Pinia类型](#十三pinia类型)
14. [组合式函数类型](#十四组合式函数类型)
15. [自定义指令类型](#十五自定义指令类型)
16. [全局类型声明](#十六全局类型声明)
17. [第三方库类型](#十七第三方库类型)
18. [泛型组件](#十八泛型组件)
19. [类型工具函数](#十九类型工具函数)
20. [最佳实践与设计模式](#二十最佳实践与设计模式)


</div>

---

## 一、项目配置

### 1.1 Vite + Vue3 + TypeScript配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### 1.2 tsconfig.json配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.3 环境变量类型声明

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 使用
console.log(import.meta.env.VITE_APP_TITLE)
```

### 1.4 Vue文件类型声明

```typescript
// src/shims-vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

---

## 二、组件类型定义

### 2.1 基础组件定义

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// 响应式数据
const count = ref<number>(0)
const message = ref<string>('Hello')

// 计算属性
const doubleCount = computed<number>(() => count.value * 2)

// 方法
function increment(): void {
  count.value++
}
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### 2.2 选项式API类型定义

```vue
<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  name: 'UserCard',
  
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    showEmail: {
      type: Boolean,
      default: false
    }
  },
  
  emits: {
    'update': (user: User) => true,
    'delete': (id: number) => typeof id === 'number'
  },
  
  data() {
    return {
      isEditing: false as boolean,
      editForm: null as User | null
    }
  },
  
  computed: {
    displayName(): string {
      return this.user.name.toUpperCase()
    }
  },
  
  methods: {
    startEdit(): void {
      this.isEditing = true
      this.editForm = { ...this.user }
    },
    
    saveEdit(): void {
      if (this.editForm) {
        this.$emit('update', this.editForm)
      }
      this.isEditing = false
    },
    
    handleDelete(): void {
      this.$emit('delete', this.user.id)
    }
  }
})
</script>
```

### 2.3 组件实例类型

```typescript
import { ComponentPublicInstance } from 'vue'
import MyComponent from './MyComponent.vue'

// 获取组件实例类型
type MyComponentInstance = InstanceType<typeof MyComponent>

// 使用
const componentRef = ref<MyComponentInstance | null>(null)
```

---

## 三、Props类型

### 3.1 基础Props类型

```vue
<script setup lang="ts">
// 运行时声明
const props = defineProps({
  title: String,
  count: {
    type: Number,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// 基于类型的声明（推荐）
interface Props {
  title?: string
  count: number
  disabled?: boolean
}

const props = defineProps<Props>()

// 带默认值
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  disabled: false
})
</script>
```

### 3.2 复杂Props类型

```vue
<script setup lang="ts">
// 对象类型
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

// 函数类型
type ClickHandler = (event: MouseEvent, data: unknown) => void

// 完整Props定义
interface Props {
  // 基础类型
  title: string
  count?: number
  disabled?: boolean
  
  // 对象类型
  user: User
  
  // 数组类型
  items: string[]
  users?: User[]
  
  // 联合类型
  status: 'pending' | 'success' | 'error'
  id: string | number
  
  // 函数类型
  onClick?: ClickHandler
  onSubmit?: (data: FormData) => Promise<void>
  
  // 复杂嵌套类型
  config?: {
    theme: 'light' | 'dark'
    language: string
    features: string[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false,
  users: () => [],
  config: () => ({
    theme: 'light',
    language: 'zh-CN',
    features: []
  })
})

// 使用props
console.log(props.title)
console.log(props.user.name)
console.log(props.items.length)
</script>
```

### 3.3 Props解构

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items?: string[]
}

// Vue 3.5+支持Props解构并保持响应性
const { title, count = 0, items = [] } = defineProps<Props>()

// 解构后仍然是响应式的
watchEffect(() => {
  console.log(title, count)
})
</script>
```

### 3.4 Props验证

```vue
<script setup lang="ts">
import { PropType } from 'vue'

// 使用PropType进行复杂类型验证
const props = defineProps({
  user: {
    type: Object as PropType<{
      id: number
      name: string
      email: string
    }>,
    required: true,
    validator: (value: any) => {
      return value.id > 0 && value.name.length > 0
    }
  },
  status: {
    type: String as PropType<'active' | 'inactive' | 'pending'>,
    default: 'pending',
    validator: (value: string) => {
      return ['active', 'inactive', 'pending'].includes(value)
    }
  }
})
</script>
```

---

## 四、Emits类型

### 4.1 基础Emits类型

```vue
<script setup lang="ts">
// 数组语法
const emit = defineEmits(['update', 'delete', 'submit'])

// 对象语法（带验证）
const emit = defineEmits({
  update: (payload: { id: number; data: any }) => {
    return payload.id > 0
  },
  delete: (id: number) => typeof id === 'number',
  submit: null  // 无验证
})

// 纯类型语法（推荐）
const emit = defineEmits<{
  (e: 'update', payload: { id: number; data: any }): void
  (e: 'delete', id: number): void
  (e: 'submit'): void
}>()

// Vue 3.3+ 更简洁的语法
const emit = defineEmits<{
  update: [payload: { id: number; data: any }]
  delete: [id: number]
  submit: []
}>()

// 使用
emit('update', { id: 1, data: { name: '张三' } })
emit('delete', 1)
emit('submit')
</script>
```

### 4.2 复杂事件类型

```vue
<script setup lang="ts">
// 定义事件类型
interface UserUpdateEvent {
  id: number
  changes: Partial<User>
  timestamp: Date
}

interface FormSubmitEvent<T = any> {
  data: T
  isValid: boolean
}

const emit = defineEmits<{
  (e: 'userUpdate', event: UserUpdateEvent): void
  (e: 'formSubmit', event: FormSubmitEvent): void
  (e: 'change', value: string, oldValue: string): void
  (e: 'error', error: Error): void
}>()

// 泛型事件
function handleSubmit<T>(data: T) {
  emit('formSubmit', { data, isValid: true })
}
</script>
```

### 4.3 v-model事件

```vue
<script setup lang="ts">
// 单个v-model
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 多个v-model
interface Props {
  modelValue: string
  title: string
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:title', value: string): void
  (e: 'update:visible', value: boolean): void
}>()

// 使用
function updateValue(newValue: string) {
  emit('update:modelValue', newValue)
}
</script>
```

---

## 五、Refs类型

### 5.1 DOM元素Ref

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// DOM元素ref
const inputRef = ref<HTMLInputElement | null>(null)
const divRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  // 使用前需要检查null
  inputRef.value?.focus()
  
  // 或使用非空断言（确保元素存在）
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')
})
</script>

<template>
  <input ref="inputRef" type="text">
  <div ref="divRef">Content</div>
  <canvas ref="canvasRef"></canvas>
</template>
```

### 5.2 组件Ref

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 获取组件暴露的类型
type ChildComponentExpose = {
  count: number
  increment: () => void
  reset: () => void
}

const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

// 或者使用组件暴露的类型
const childRef2 = ref<ChildComponentExpose | null>(null)

onMounted(() => {
  childRef.value?.increment()
  console.log(childRef.value?.count)
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function reset() {
  count.value = 0
}

// 暴露给父组件
defineExpose({
  count,
  increment,
  reset
})
</script>
```

### 5.3 模板Ref数组

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 存储多个ref
const itemRefs = ref<HTMLLIElement[]>([])

// 设置ref的函数
function setItemRef(el: HTMLLIElement | null, index: number) {
  if (el) {
    itemRefs.value[index] = el
  }
}

onMounted(() => {
  itemRefs.value.forEach((el, index) => {
    console.log(`Item ${index}:`, el.textContent)
  })
})
</script>

<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="item.id"
      :ref="(el) => setItemRef(el as HTMLLIElement, index)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
```

---

## 六、响应式类型

### 6.1 ref类型

```typescript
import { ref, Ref, UnwrapRef } from 'vue'

// 基础类型
const count = ref<number>(0)
const message = ref<string>('')
const isLoading = ref<boolean>(false)

// 复杂类型
interface User {
  id: number
  name: string
  email: string
}

const user = ref<User | null>(null)
const users = ref<User[]>([])

// Ref类型
function useCounter(): { count: Ref<number>; increment: () => void } {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
}

// 泛型函数
function useState<T>(initialValue: T): Ref<UnwrapRef<T>> {
  return ref(initialValue)
}
```

### 6.2 reactive类型

```typescript
import { reactive, UnwrapNestedRefs } from 'vue'

// 自动类型推断
const state = reactive({
  count: 0,
  message: 'Hello'
})

// 显式类型
interface State {
  user: User | null
  items: Item[]
  config: {
    theme: 'light' | 'dark'
    language: string
  }
}

const state = reactive<State>({
  user: null,
  items: [],
  config: {
    theme: 'light',
    language: 'zh-CN'
  }
})

// 类型断言
const state = reactive({
  user: null as User | null
})
```

### 6.3 computed类型

```typescript
import { ref, computed, ComputedRef, WritableComputedRef } from 'vue'

const count = ref(0)

// 只读计算属性
const doubleCount: ComputedRef<number> = computed(() => count.value * 2)

// 可写计算属性
const plusOne: WritableComputedRef<number> = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

// 类型推断（大多数情况下不需要显式声明）
const tripleCount = computed(() => count.value * 3)  // ComputedRef<number>

// 复杂类型
interface User {
  firstName: string
  lastName: string
}

const user = ref<User>({ firstName: '张', lastName: '三' })

const fullName = computed<string>(() => {
  return `${user.value.firstName}${user.value.lastName}`
})
```

### 6.4 shallowRef和shallowReactive

```typescript
import { shallowRef, shallowReactive, triggerRef } from 'vue'

// shallowRef - 只有.value是响应式的
const state = shallowRef<{ count: number }>({ count: 0 })
state.value.count++  // 不会触发更新
state.value = { count: 1 }  // 触发更新
triggerRef(state)  // 强制触发更新

// shallowReactive - 只有根级别属性是响应式的
interface DeepState {
  user: {
    name: string
    profile: {
      age: number
    }
  }
}

const shallowState = shallowReactive<DeepState>({
  user: {
    name: '张三',
    profile: {
      age: 25
    }
  }
})

shallowState.user = { name: '李四', profile: { age: 30 } }  // 响应式
shallowState.user.profile.age = 26  // 非响应式
```

---

## 七、计算属性与侦听器类型

### 7.1 computed类型详解

```vue
<script setup lang="ts">
import { ref, computed, ComputedRef, WritableComputedRef } from 'vue'

interface Product {
  name: string
  price: number
  quantity: number
}

const products = ref<Product[]>([
  { name: '苹果', price: 10, quantity: 2 },
  { name: '香蕉', price: 5, quantity: 3 }
])

const discount = ref(0.9)

// 只读计算属性
const totalPrice: ComputedRef<number> = computed(() => {
  return products.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
})

// 复杂计算属性
const summary = computed<{
  total: number
  discounted: number
  items: number
}>(() => ({
  total: totalPrice.value,
  discounted: totalPrice.value * discount.value,
  items: products.value.length
}))

// 可写计算属性
const firstName = ref('张')
const lastName = ref('三')

const fullName: WritableComputedRef<string> = computed({
  get(): string {
    return `${firstName.value}${lastName.value}`
  },
  set(value: string): void {
    const chars = value.split('')
    firstName.value = chars[0] || ''
    lastName.value = chars.slice(1).join('')
  }
})

// 带调试选项
const debugComputed = computed(() => totalPrice.value, {
  onTrack(e) {
    console.log('tracked:', e)
  },
  onTrigger(e) {
    console.log('triggered:', e)
  }
})
</script>
```

### 7.2 watch类型详解

```vue
<script setup lang="ts">
import { ref, reactive, watch, WatchStopHandle } from 'vue'

interface User {
  name: string
  profile: {
    age: number
    city: string
  }
}

const count = ref<number>(0)
const user = ref<User>({
  name: '张三',
  profile: { age: 25, city: '北京' }
})
const state = reactive<{ items: string[] }>({ items: [] })

// 监听ref
watch(count, (newVal: number, oldVal: number) => {
  console.log(`count changed: ${oldVal} -> ${newVal}`)
})

// 监听getter
watch(
  () => user.value.profile.age,
  (newAge: number, oldAge: number) => {
    console.log(`age changed: ${oldAge} -> ${newAge}`)
  }
)

// 监听多个源
watch(
  [count, () => user.value.name],
  ([newCount, newName]: [number, string], [oldCount, oldName]: [number, string]) => {
    console.log('Multiple sources changed')
  }
)

// 监听reactive对象
watch(
  state,
  (newState, oldState) => {
    // newState和oldState是同一个引用
    console.log('state changed')
  },
  { deep: true }
)

// 带选项的watch
watch(
  count,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
  },
  {
    immediate: true,  // 立即执行
    deep: true,       // 深度监听
    flush: 'post',    // 'pre' | 'post' | 'sync'
    onTrack(e) {},    // 调试
    onTrigger(e) {}
  }
)

// 停止监听
const stopWatch: WatchStopHandle = watch(count, () => {})
stopWatch()  // 停止监听

// 清理副作用
watch(count, (newVal, oldVal, onCleanup) => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
  
  onCleanup(() => {
    controller.abort()
  })
})
</script>
```

### 7.3 watchEffect类型

```vue
<script setup lang="ts">
import { ref, watchEffect, watchPostEffect, watchSyncEffect, WatchStopHandle } from 'vue'

const count = ref<number>(0)
const user = ref<{ name: string }>({ name: '张三' })

// 基础用法
const stop: WatchStopHandle = watchEffect(() => {
  console.log('count:', count.value)
  console.log('user:', user.value.name)
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

// watchPostEffect - DOM更新后执行
watchPostEffect(() => {
  // 可以访问更新后的DOM
})

// watchSyncEffect - 同步执行
watchSyncEffect(() => {
  // 同步执行
})

// 配置选项
watchEffect(
  () => {
    console.log(count.value)
  },
  {
    flush: 'post',
    onTrack(e) {
      console.log('tracked:', e)
    },
    onTrigger(e) {
      console.log('triggered:', e)
    }
  }
)
</script>
```

---

## 八、生命周期类型

### 8.1 生命周期钩子类型

```vue
<script setup lang="ts">
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
  onRenderTriggered,
  DebuggerEvent
} from 'vue'

// 挂载
onBeforeMount((): void => {
  console.log('before mount')
})

onMounted((): void => {
  console.log('mounted')
})

// 更新
onBeforeUpdate((): void => {
  console.log('before update')
})

onUpdated((): void => {
  console.log('updated')
})

// 卸载
onBeforeUnmount((): void => {
  console.log('before unmount')
})

onUnmounted((): void => {
  console.log('unmounted')
})

// keep-alive
onActivated((): void => {
  console.log('activated')
})

onDeactivated((): void => {
  console.log('deactivated')
})

// 错误捕获
onErrorCaptured((
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
): boolean | void => {
  console.error('Error captured:', err)
  console.log('Component:', instance)
  console.log('Info:', info)
  return false  // 阻止错误继续传播
})

// 调试钩子
onRenderTracked((event: DebuggerEvent): void => {
  console.log('Render tracked:', event)
})

onRenderTriggered((event: DebuggerEvent): void => {
  console.log('Render triggered:', event)
})
</script>
```

### 8.2 生命周期封装

```typescript
// composables/useLifecycle.ts
import { onMounted, onUnmounted, Ref, ref } from 'vue'

// 封装生命周期逻辑
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  target: EventTarget = window
): void {
  onMounted(() => {
    target.addEventListener(eventName, handler as EventListener)
  })
  
  onUnmounted(() => {
    target.removeEventListener(eventName, handler as EventListener)
  })
}

// 使用
export function useWindowSize(): {
  width: Ref<number>
  height: Ref<number>
} {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  
  useEventListener('resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  })
  
  return { width, height }
}
```

---

## 九、组件通信类型

### 9.1 Props/Emits通信

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

interface User {
  id: number
  name: string
}

const user = ref<User>({ id: 1, name: '张三' })

function handleUpdate(updatedUser: User): void {
  user.value = updatedUser
}

function handleDelete(id: number): void {
  console.log('Delete user:', id)
}
</script>

<template>
  <ChildComponent
    :user="user"
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>
```

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface User {
  id: number
  name: string
}

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update', user: User): void
  (e: 'delete', id: number): void
}>()

function updateUser(): void {
  emit('update', { ...props.user, name: '李四' })
}

function deleteUser(): void {
  emit('delete', props.user.id)
}
</script>
```

### 9.2 v-model双向绑定

```vue
<!-- CustomInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    :disabled="disabled"
    @input="handleInput"
  >
</template>
```

```vue
<!-- 使用defineModel (Vue 3.4+) -->
<script setup lang="ts">
const model = defineModel<string>()

// 带选项
const model = defineModel<string>({
  default: '',
  required: true
})

// 多个v-model
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
</script>

<template>
  <input v-model="model">
  <input v-model="firstName">
  <input v-model="lastName">
</template>
```

### 9.3 Refs通信

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 定义子组件暴露的类型
interface ChildExpose {
  count: number
  increment: () => void
  reset: () => void
  getData: () => Promise<string[]>
}

const childRef = ref<ChildExpose | null>(null)

onMounted(async () => {
  if (childRef.value) {
    console.log(childRef.value.count)
    childRef.value.increment()
    const data = await childRef.value.getData()
    console.log(data)
  }
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment(): void {
  count.value++
}

function reset(): void {
  count.value = 0
}

async function getData(): Promise<string[]> {
  return ['item1', 'item2', 'item3']
}

defineExpose({
  count,
  increment,
  reset,
  getData
})
</script>
```

---

## 十、插槽类型

### 10.1 默认插槽类型

```vue
<!-- Card.vue -->
<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="card">
    <div class="card-header">{{ title }}</div>
    <div class="card-body">
      <slot>默认内容</slot>
    </div>
  </div>
</template>
```

### 10.2 具名插槽类型

```vue
<!-- Layout.vue -->
<script setup lang="ts">
// 使用defineSlots声明插槽类型 (Vue 3.3+)
const slots = defineSlots<{
  header(): any
  default(): any
  footer(props: { year: number }): any
}>()

// 检查插槽是否存在
const hasHeader = !!slots.header
</script>

<template>
  <div class="layout">
    <header v-if="hasHeader">
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer" :year="2024"></slot>
    </footer>
  </div>
</template>
```

### 10.3 作用域插槽类型

```vue
<!-- List.vue -->
<script setup lang="ts" generic="T">
interface Props {
  items: T[]
}

defineProps<Props>()

defineSlots<{
  default(props: { item: T; index: number }): any
  empty(): any
}>()
</script>

<template>
  <ul v-if="items.length">
    <li v-for="(item, index) in items" :key="index">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
  <div v-else>
    <slot name="empty">暂无数据</slot>
  </div>
</template>
```

```vue
<!-- 使用List组件 -->
<script setup lang="ts">
interface User {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
]
</script>

<template>
  <List :items="users">
    <template #default="{ item, index }">
      <!-- item的类型被推断为User -->
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
    <template #empty>
      <p>没有用户数据</p>
    </template>
  </List>
</template>
```

---

## 十一、依赖注入类型

### 11.1 Provide类型

```vue
<!-- Ancestor.vue -->
<script setup lang="ts">
import { provide, ref, readonly, InjectionKey } from 'vue'

// 定义类型
interface User {
  id: number
  name: string
  email: string
}

interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
}

// 创建类型安全的injection key
export const userKey: InjectionKey<Ref<User | null>> = Symbol('user')
export const themeKey: InjectionKey<ThemeConfig> = Symbol('theme')
export const updateUserKey: InjectionKey<(user: User) => void> = Symbol('updateUser')

// 响应式数据
const user = ref<User | null>({
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com'
})

const theme: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1890ff'
}

// 方法
function updateUser(newUser: User): void {
  user.value = newUser
}

// 提供数据
provide(userKey, readonly(user))  // 只读
provide(themeKey, theme)
provide(updateUserKey, updateUser)

// 也可以使用字符串key（类型不安全）
provide('appName', 'My App')
</script>
```

### 11.2 Inject类型

```vue
<!-- Descendant.vue -->
<script setup lang="ts">
import { inject, Ref } from 'vue'
import { userKey, themeKey, updateUserKey } from './Ancestor.vue'

// 使用injection key（类型安全）
const user = inject(userKey)  // Ref<User | null> | undefined
const theme = inject(themeKey)  // ThemeConfig | undefined
const updateUser = inject(updateUserKey)  // ((user: User) => void) | undefined

// 带默认值
const user2 = inject(userKey, ref(null))  // Ref<User | null>
const theme2 = inject(themeKey, { mode: 'light', primaryColor: '#000' })

// 使用字符串key（需要类型断言）
const appName = inject<string>('appName')
const appName2 = inject<string>('appName', 'Default App')

// 使用前检查
if (user && updateUser) {
  console.log(user.value?.name)
  updateUser({ id: 2, name: '李四', email: 'lisi@example.com' })
}
</script>
```

### 11.3 创建类型安全的Provide/Inject

```typescript
// types/injection.ts
import { InjectionKey, Ref } from 'vue'

// 用户相关
export interface User {
  id: number
  name: string
  email: string
}

export interface UserContext {
  user: Ref<User | null>
  isLoggedIn: Ref<boolean>
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

export const userContextKey: InjectionKey<UserContext> = Symbol('userContext')

// 主题相关
export interface ThemeContext {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
}

export const themeContextKey: InjectionKey<ThemeContext> = Symbol('themeContext')
```

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import { userContextKey, themeContextKey, User, UserContext, ThemeContext } from '@/types/injection'

// 用户上下文
const user = ref<User | null>(null)
const isLoggedIn = computed(() => user.value !== null)

async function login(credentials: { email: string; password: string }): Promise<void> {
  // 登录逻辑
  user.value = { id: 1, name: '张三', email: credentials.email }
}

function logout(): void {
  user.value = null
}

const userContext: UserContext = {
  user,
  isLoggedIn,
  login,
  logout
}

// 主题上下文
const theme = ref<'light' | 'dark'>('light')

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const themeContext: ThemeContext = {
  theme,
  toggleTheme
}

provide(userContextKey, userContext)
provide(themeContextKey, themeContext)
</script>
```

---

## 十二、路由类型

### 12.1 路由配置类型

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 路由元信息类型扩展
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    roles?: string[]
    keepAlive?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true,
    meta: {
      title: '用户详情',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: {
      title: '管理后台',
      requiresAuth: true,
      roles: ['admin']
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

### 12.2 组合式API路由

```vue
<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  useRouter,
  useRoute,
  RouteLocationNormalized,
  NavigationGuardNext,
  RouteLocationRaw
} from 'vue-router'

const router = useRouter()
const route = useRoute()

// 路由参数
interface RouteParams {
  id: string
}

const userId = computed<string>(() => route.params.id as string)
const query = computed(() => route.query)

// 编程式导航
function goToHome(): void {
  router.push('/')
}

function goToUser(id: number): void {
  router.push({ name: 'User', params: { id: String(id) } })
}

function goWithQuery(searchTerm: string): void {
  router.push({
    path: '/search',
    query: { q: searchTerm }
  })
}

async function navigateTo(to: RouteLocationRaw): Promise<void> {
  try {
    await router.push(to)
  } catch (error) {
    console.error('Navigation failed:', error)
  }
}

// 监听路由变化
watch(
  () => route.params.id,
  (newId: string | string[]) => {
    if (typeof newId === 'string') {
      fetchUser(newId)
    }
  }
)
</script>
```

### 12.3 路由守卫类型

```typescript
// router/guards.ts
import {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router'
import router from './index'

// 全局前置守卫
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

// 返回Promise的守卫
router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    const isAuthed = await checkAuth()
    if (!isAuthed) {
      return { name: 'Login' }
    }
  }
  return true
})

// 路由独享守卫
const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (!hasAdminRole()) {
        next('/403')
      } else {
        next()
      }
    }
  }
]
```

### 12.4 组件内守卫

```vue
<script setup lang="ts">
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  RouteLocationNormalized
} from 'vue-router'

onBeforeRouteUpdate((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): void => {
  // 路由更新时调用
  console.log('Route updated:', to.params)
})

onBeforeRouteLeave((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): boolean | void => {
  // 离开路由前调用
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('有未保存的更改，确定离开吗？')
    if (!answer) return false
  }
})
</script>
```

---

## 十三、Pinia类型

### 13.1 定义Store类型

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed, Ref, ComputedRef } from 'vue'

// 类型定义
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface LoginCredentials {
  email: string
  password: string
}

// 组合式语法（推荐）
export const useUserStore = defineStore('user', () => {
  // State
  const user: Ref<User | null> = ref(null)
  const token: Ref<string> = ref('')
  const loading: Ref<boolean> = ref(false)
  
  // Getters
  const isLoggedIn: ComputedRef<boolean> = computed(() => !!token.value)
  const isAdmin: ComputedRef<boolean> = computed(() => user.value?.role === 'admin')
  const userName: ComputedRef<string> = computed(() => user.value?.name ?? '游客')
  
  // Actions
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    try {
      const response = await api.login(credentials)
      user.value = response.user
      token.value = response.token
    } finally {
      loading.value = false
    }
  }
  
  function logout(): void {
    user.value = null
    token.value = ''
  }
  
  async function fetchUserInfo(): Promise<void> {
    if (!token.value) return
    user.value = await api.getUserInfo()
  }
  
  return {
    // State
    user,
    token,
    loading,
    // Getters
    isLoggedIn,
    isAdmin,
    userName,
    // Actions
    login,
    logout,
    fetchUserInfo
  }
})

// 导出Store类型
export type UserStore = ReturnType<typeof useUserStore>
```

### 13.2 选项式Store类型

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

interface CounterState {
  count: number
  lastUpdated: Date | null
}

export const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({
    count: 0,
    lastUpdated: null
  }),
  
  getters: {
    doubleCount(): number {
      return this.count * 2
    },
    
    // 带参数的getter
    multiplyBy(): (n: number) => number {
      return (n: number) => this.count * n
    },
    
    // 访问其他getter
    quadrupleCount(): number {
      return this.doubleCount * 2
    }
  },
  
  actions: {
    increment(): void {
      this.count++
      this.lastUpdated = new Date()
    },
    
    async incrementAsync(): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.increment()
    },
    
    setCount(value: number): void {
      this.count = value
      this.lastUpdated = new Date()
    }
  }
})
```

### 13.3 使用Store

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore, type UserStore } from '@/stores/user'
import { useCounterStore } from '@/stores/counter'

const userStore: UserStore = useUserStore()
const counterStore = useCounterStore()

// 使用storeToRefs保持响应性
const { user, isLoggedIn, userName } = storeToRefs(userStore)
const { count, doubleCount } = storeToRefs(counterStore)

// Actions可以直接解构
const { login, logout } = userStore
const { increment, setCount } = counterStore

// 订阅state变化
userStore.$subscribe((mutation, state) => {
  console.log('User state changed:', mutation.type)
  localStorage.setItem('user', JSON.stringify(state))
})

// 订阅action
counterStore.$onAction(({
  name,
  args,
  after,
  onError
}) => {
  console.log(`Action ${name} called with args:`, args)
  
  after((result) => {
    console.log(`Action ${name} finished`)
  })
  
  onError((error) => {
    console.error(`Action ${name} failed:`, error)
  })
})
</script>

<template>
  <div v-if="isLoggedIn">
    <p>Welcome, {{ userName }}</p>
    <button @click="logout">Logout</button>
  </div>
  
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### 13.4 Store之间的组合

```typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  
  const items = ref<CartItem[]>([])
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
  })
  
  const discountedPrice = computed(() => {
    // 使用其他store的状态
    const discount = userStore.isAdmin ? 0.8 : 1
    return totalPrice.value * discount
  })
  
  function addItem(item: Omit<CartItem, 'quantity'>): void {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
  }
  
  async function checkout(): Promise<void> {
    if (!userStore.isLoggedIn) {
      throw new Error('请先登录')
    }
    // 结账逻辑
    items.value = []
  }
  
  return {
    items,
    totalPrice,
    discountedPrice,
    addItem,
    checkout
  }
})
```

---

## 十四、组合式函数类型

### 14.1 基础组合式函数

```typescript
// composables/useCounter.ts
import { ref, Ref, computed, ComputedRef } from 'vue'

interface UseCounterReturn {
  count: Ref<number>
  doubleCount: ComputedRef<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(initialValue: number = 0): UseCounterReturn {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  
  function increment(): void {
    count.value++
  }
  
  function decrement(): void {
    count.value--
  }
  
  function reset(): void {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}
```

### 14.2 带参数的组合式函数

```typescript
// composables/useFetch.ts
import { ref, Ref, watch, toValue, MaybeRefOrGetter } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
  refetch?: boolean
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { immediate = true, refetch = true } = options
  
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  async function execute(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(toValue(url))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }
  
  if (immediate) {
    execute()
  }
  
  if (refetch) {
    watch(() => toValue(url), execute)
  }
  
  return {
    data,
    error,
    loading,
    execute
  }
}
```

### 14.3 通用工具函数

```typescript
// composables/useToggle.ts
import { ref, Ref } from 'vue'

type UseToggleReturn = [
  Ref<boolean>,
  (value?: boolean) => void
]

export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const state = ref(initialValue)
  
  function toggle(value?: boolean): void {
    state.value = value !== undefined ? value : !state.value
  }
  
  return [state, toggle]
}

// composables/useDebounce.ts
import { ref, Ref, watch } from 'vue'

export function useDebounce<T>(
  value: Ref<T>,
  delay: number = 300
): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>
  
  watch(value, (newValue) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  
  return debouncedValue
}

// composables/useLocalStorage.ts
import { ref, Ref, watch } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  const stored = localStorage.getItem(key)
  const data = ref<T>(
    stored ? JSON.parse(stored) : defaultValue
  ) as Ref<T>
  
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )
  
  return data
}
```

### 14.4 高级组合式函数

```typescript
// composables/useAsyncState.ts
import { ref, Ref, shallowRef } from 'vue'

interface UseAsyncStateOptions<T> {
  immediate?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
  initialState?: T
  resetOnExecute?: boolean
}

interface UseAsyncStateReturn<T> {
  state: Ref<T | undefined>
  isLoading: Ref<boolean>
  isReady: Ref<boolean>
  error: Ref<Error | undefined>
  execute: (...args: any[]) => Promise<T>
}

export function useAsyncState<T>(
  promise: (...args: any[]) => Promise<T>,
  options: UseAsyncStateOptions<T> = {}
): UseAsyncStateReturn<T> {
  const {
    immediate = true,
    onError,
    onSuccess,
    initialState,
    resetOnExecute = true
  } = options
  
  const state = shallowRef<T | undefined>(initialState)
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<Error | undefined>()
  
  async function execute(...args: any[]): Promise<T> {
    if (resetOnExecute) {
      state.value = initialState
    }
    
    isLoading.value = true
    error.value = undefined
    
    try {
      const data = await promise(...args)
      state.value = data
      isReady.value = true
      onSuccess?.(data)
      return data
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError?.(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  if (immediate) {
    execute()
  }
  
  return {
    state,
    isLoading,
    isReady,
    error,
    execute
  }
}
```

---

## 十五、自定义指令类型

### 15.1 指令类型定义

```typescript
// directives/types.ts
import { DirectiveBinding, VNode } from 'vue'

// 指令钩子类型
export type DirectiveHook<T = any> = (
  el: HTMLElement,
  binding: DirectiveBinding<T>,
  vnode: VNode,
  prevVnode: VNode | null
) => void

// 自定义指令类型
export interface CustomDirective<T = any> {
  created?: DirectiveHook<T>
  beforeMount?: DirectiveHook<T>
  mounted?: DirectiveHook<T>
  beforeUpdate?: DirectiveHook<T>
  updated?: DirectiveHook<T>
  beforeUnmount?: DirectiveHook<T>
  unmounted?: DirectiveHook<T>
}
```

### 15.2 自定义指令实现

```typescript
// directives/vFocus.ts
import type { Directive } from 'vue'

export const vFocus: Directive<HTMLElement> = {
  mounted(el) {
    el.focus()
  }
}

// directives/vClickOutside.ts
import type { Directive, DirectiveBinding } from 'vue'

type ClickOutsideHandler = (event: MouseEvent) => void

interface ClickOutsideElement extends HTMLElement {
  _clickOutsideHandler?: (event: MouseEvent) => void
}

export const vClickOutside: Directive<ClickOutsideElement, ClickOutsideHandler> = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  
  unmounted(el) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
      delete el._clickOutsideHandler
    }
  }
}

// directives/vDebounce.ts
import type { Directive, DirectiveBinding } from 'vue'

interface DebounceBinding {
  handler: () => void
  delay?: number
}

export const vDebounce: Directive<HTMLElement, DebounceBinding> = {
  mounted(el, binding) {
    const { handler, delay = 300 } = binding.value
    let timer: ReturnType<typeof setTimeout>
    
    el.addEventListener('input', () => {
      clearTimeout(timer)
      timer = setTimeout(handler, delay)
    })
  }
}

// directives/vPermission.ts
import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const permission = binding.value
    
    const hasPermission = Array.isArray(permission)
      ? permission.some(p => userStore.permissions.includes(p))
      : userStore.permissions.includes(permission)
    
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}
```

### 15.3 在组件中使用

```vue
<script setup lang="ts">
import { vFocus, vClickOutside, vPermission } from '@/directives'

function handleClickOutside(event: MouseEvent): void {
  console.log('Clicked outside!', event)
}
</script>

<template>
  <input v-focus type="text">
  
  <div v-click-outside="handleClickOutside">
    点击外部会触发回调
  </div>
  
  <button v-permission="'admin:create'">创建</button>
  <button v-permission="['admin:edit', 'user:edit']">编辑</button>
</template>
```

### 15.4 全局注册指令

```typescript
// main.ts
import { createApp, Directive } from 'vue'
import App from './App.vue'
import { vFocus, vClickOutside, vPermission, vDebounce } from '@/directives'

const app = createApp(App)

// 注册全局指令
const directives: Record<string, Directive> = {
  focus: vFocus,
  clickOutside: vClickOutside,
  permission: vPermission,
  debounce: vDebounce
}

Object.entries(directives).forEach(([name, directive]) => {
  app.directive(name, directive)
})

app.mount('#app')
```

---

## 十六、全局类型声明

### 16.1 扩展Vue类型

```typescript
// types/vue.d.ts
import { ComponentCustomProperties } from 'vue'
import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { Store } from 'pinia'

declare module 'vue' {
  // 扩展全局组件
  export interface GlobalComponents {
    BaseButton: typeof import('@/components/BaseButton.vue')['default']
    BaseInput: typeof import('@/components/BaseInput.vue')['default']
    BaseModal: typeof import('@/components/BaseModal.vue')['default']
  }
  
  // 扩展组件实例属性
  export interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
    $filters: {
      formatDate: (value: string | Date) => string
      formatCurrency: (value: number) => string
    }
    $api: typeof import('@/api')['default']
    $message: {
      success: (msg: string) => void
      error: (msg: string) => void
      warning: (msg: string) => void
    }
  }
}

export {}
```

### 16.2 扩展Window类型

```typescript
// types/window.d.ts
interface Window {
  // 第三方库全局变量
  AMap: any
  wx: any
  
  // 自定义全局变量
  __APP_VERSION__: string
  __APP_BUILD_TIME__: string
  
  // 全局配置
  __APP_CONFIG__: {
    apiBaseUrl: string
    env: 'development' | 'staging' | 'production'
  }
}
```

### 16.3 模块声明

```typescript
// types/modules.d.ts

// 声明无类型的npm包
declare module 'some-untyped-package' {
  export function doSomething(value: string): void
  export class SomeClass {
    constructor(options: { name: string })
    getName(): string
  }
}

// 声明资源文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: Record<string, any>
  export default content
}

declare module '*.scss' {
  const content: Record<string, string>
  export default content
}
```

### 16.4 全局类型

```typescript
// types/global.d.ts

// 通用API响应类型
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

// 分页响应
interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分页请求参数
interface PageParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 通用ID类型
type ID = number | string

// 可空类型
type Nullable<T> = T | null

// 可能未定义
type Maybe<T> = T | undefined

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export {}
```

---

## 十七、第三方库类型

### 17.1 Axios类型封装

```typescript
// utils/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

// 扩展AxiosRequestConfig
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipErrorHandler?: boolean
  showLoading?: boolean
}

// API响应类型
interface ApiResult<T = any> {
  code: number
  data: T
  message: string
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const { data } = response
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message))
    }
    return data.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 封装请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>
}

export function get<T = any>(url: string, params?: object): Promise<T> {
  return request<T>({ method: 'GET', url, params })
}

export function post<T = any>(url: string, data?: object): Promise<T> {
  return request<T>({ method: 'POST', url, data })
}

export function put<T = any>(url: string, data?: object): Promise<T> {
  return request<T>({ method: 'PUT', url, data })
}

export function del<T = any>(url: string, params?: object): Promise<T> {
  return request<T>({ method: 'DELETE', url, params })
}
```

### 17.2 API模块类型

```typescript
// api/user.ts
import { get, post, put, del } from '@/utils/request'

// 类型定义
export interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}

export interface RegisterParams {
  name: string
  email: string
  password: string
}

export interface UpdateUserParams {
  name?: string
  email?: string
  avatar?: string
}

// API方法
export const userApi = {
  login(params: LoginParams): Promise<LoginResult> {
    return post('/auth/login', params)
  },
  
  register(params: RegisterParams): Promise<User> {
    return post('/auth/register', params)
  },
  
  logout(): Promise<void> {
    return post('/auth/logout')
  },
  
  getCurrentUser(): Promise<User> {
    return get('/user/me')
  },
  
  getUserById(id: number): Promise<User> {
    return get(`/users/${id}`)
  },
  
  updateUser(id: number, params: UpdateUserParams): Promise<User> {
    return put(`/users/${id}`, params)
  },
  
  deleteUser(id: number): Promise<void> {
    return del(`/users/${id}`)
  },
  
  getUsers(params: PageParams): Promise<PageResponse<User>> {
    return get('/users', params)
  }
}
```

---

## 十八、泛型组件

### 18.1 基础泛型组件

```vue
<!-- components/GenericList.vue -->
<script setup lang="ts" generic="T extends { id: number | string }">
interface Props {
  items: T[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'select', item: T): void
  (e: 'delete', id: T['id']): void
}>()

defineSlots<{
  default(props: { item: T; index: number }): any
  empty(): any
  loading(): any
}>()
</script>

<template>
  <div class="list">
    <div v-if="loading">
      <slot name="loading">加载中...</slot>
    </div>
    <div v-else-if="items.length === 0">
      <slot name="empty">暂无数据</slot>
    </div>
    <div v-else>
      <div
        v-for="(item, index) in items"
        :key="item.id"
        @click="emit('select', item)"
      >
        <slot :item="item" :index="index">
          {{ item }}
        </slot>
        <button @click.stop="emit('delete', item.id)">删除</button>
      </div>
    </div>
  </div>
</template>
```

```vue
<!-- 使用泛型组件 -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
]

function handleSelect(user: User): void {
  console.log('Selected:', user)
}

function handleDelete(id: number): void {
  console.log('Delete:', id)
}
</script>

<template>
  <GenericList
    :items="users"
    @select="handleSelect"
    @delete="handleDelete"
  >
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }} - {{ item.email }}</span>
    </template>
  </GenericList>
</template>
```

### 18.2 泛型表格组件

```vue
<!-- components/GenericTable.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
interface Column<T> {
  key: keyof T | string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => any
}

interface Props {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T
  loading?: boolean
  selection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id' as any,
  loading: false,
  selection: false
})

const emit = defineEmits<{
  (e: 'row-click', row: T, index: number): void
  (e: 'selection-change', rows: T[]): void
}>()

const selectedRows = defineModel<T[]>('selectedRows', { default: [] })

defineSlots<{
  [K in keyof T as `column-${string & K}`]?: (props: {
    row: T
    column: Column<T>
    index: number
    value: T[K]
  }) => any
} & {
  empty(): any
  loading(): any
}>()

function getCellValue(row: T, key: keyof T | string): any {
  return row[key as keyof T]
}
</script>

<template>
  <table class="generic-table">
    <thead>
      <tr>
        <th v-if="selection">
          <input
            type="checkbox"
            :checked="selectedRows.length === data.length"
            @change="selectedRows = selectedRows.length === data.length ? [] : [...data]"
          >
        </th>
        <th
          v-for="column in columns"
          :key="String(column.key)"
          :style="{ width: column.width ? `${column.width}px` : 'auto' }"
        >
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td :colspan="columns.length + (selection ? 1 : 0)">
          <slot name="loading">加载中...</slot>
        </td>
      </tr>
      <tr v-else-if="data.length === 0">
        <td :colspan="columns.length + (selection ? 1 : 0)">
          <slot name="empty">暂无数据</slot>
        </td>
      </tr>
      <tr
        v-else
        v-for="(row, index) in data"
        :key="String(row[rowKey])"
        @click="emit('row-click', row, index)"
      >
        <td v-if="selection" @click.stop>
          <input
            type="checkbox"
            :checked="selectedRows.includes(row)"
            @change="
              selectedRows.includes(row)
                ? selectedRows = selectedRows.filter(r => r !== row)
                : selectedRows = [...selectedRows, row]
            "
          >
        </td>
        <td v-for="column in columns" :key="String(column.key)">
          <slot
            :name="`column-${String(column.key)}`"
            :row="row"
            :column="column"
            :index="index"
            :value="getCellValue(row, column.key)"
          >
            {{ column.render
              ? column.render(getCellValue(row, column.key), row, index)
              : getCellValue(row, column.key)
            }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

---

## 十九、类型工具函数

### 19.1 类型守卫工具

```typescript
// utils/typeGuards.ts

// 检查是否为非空值
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

// 检查是否为数组
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

// 检查是否为对象
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// 检查是否为函数
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

// 检查是否为字符串
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// 检查是否为数字
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

// 检查是否为Promise
export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise
}

// 检查是否有某个属性
export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj
}

// 检查是否为特定类型的对象
export function isOfType<T>(
  value: unknown,
  check: (value: unknown) => boolean
): value is T {
  return check(value)
}
```

### 19.2 类型转换工具

```typescript
// utils/typeConverters.ts

// 安全地获取对象属性
export function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key]
}

// 安全地设置对象属性
export function setProperty<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  obj[key] = value
}

// 从对象中选取指定属性
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// 从对象中排除指定属性
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result as Omit<T, K>
}

// 过滤对象的undefined值
export function filterUndefined<T extends object>(
  obj: T
): { [K in keyof T]: NonNullable<T[K]> } {
  const result: any = {}
  Object.keys(obj).forEach(key => {
    if ((obj as any)[key] !== undefined) {
      result[key] = (obj as any)[key]
    }
  })
  return result
}
```

### 19.3 自定义类型工具

```typescript
// types/utils.ts

// 获取Promise的解析类型
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// 获取数组元素类型
export type ArrayElement<T> = T extends (infer E)[] ? E : never

// 获取对象值类型
export type ValueOf<T> = T[keyof T]

// 深度只读
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P]
}

// 深度可选
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P]
}

// 深度必需
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepRequired<T[P]>
    : T[P]
}

// 可空类型
export type Nullable<T> = T | null

// 可能未定义
export type Maybe<T> = T | undefined

// 品牌类型
export type Brand<T, B> = T & { __brand: B }

// 提取函数参数类型
export type FirstParameter<T extends (...args: any[]) => any> = 
  Parameters<T>[0]

// 提取构造函数参数类型
export type ConstructorFirstParameter<T extends new (...args: any[]) => any> =
  ConstructorParameters<T>[0]

// 将联合类型转为交叉类型
export type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never

// 获取对象的必需键
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

// 获取对象的可选键
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

---

## 二十、最佳实践与设计模式

### 20.1 组件设计模式

```vue
<!-- 容器/展示组件模式 -->
<!-- containers/UserListContainer.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from '@/components/UserList.vue'
import { userApi, type User } from '@/api/user'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<Error | null>(null)

async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const response = await userApi.getUsers({ page: 1, pageSize: 10 })
    users.value = response.list
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e))
  } finally {
    loading.value = false
  }
}

function handleSelect(user: User): void {
  console.log('Selected:', user)
}

function handleDelete(id: number): void {
  users.value = users.value.filter(u => u.id !== id)
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <div v-if="error">{{ error.message }}</div>
    <UserList
      v-else
      :users="users"
      :loading="loading"
      @select="handleSelect"
      @delete="handleDelete"
    />
  </div>
</template>
```

```vue
<!-- components/UserList.vue - 展示组件 -->
<script setup lang="ts">
import type { User } from '@/api/user'

interface Props {
  users: User[]
  loading?: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'select', user: User): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div v-if="loading">加载中...</div>
  <ul v-else>
    <li
      v-for="user in users"
      :key="user.id"
      @click="$emit('select', user)"
    >
      {{ user.name }} - {{ user.email }}
      <button @click.stop="$emit('delete', user.id)">删除</button>
    </li>
  </ul>
</template>
```

### 20.2 组合式函数模式

```typescript
// composables/useForm.ts
import { ref, reactive, computed, Ref, ComputedRef } from 'vue'

interface ValidationRule<T> {
  validator: (value: T) => boolean
  message: string
}

interface FormField<T> {
  value: Ref<T>
  error: Ref<string>
  touched: Ref<boolean>
  isValid: ComputedRef<boolean>
  validate: () => boolean
  reset: () => void
}

interface UseFormReturn<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> }
  values: ComputedRef<T>
  errors: ComputedRef<Partial<Record<keyof T, string>>>
  isValid: ComputedRef<boolean>
  validate: () => boolean
  reset: () => void
  setValues: (values: Partial<T>) => void
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  rules: Partial<{ [K in keyof T]: ValidationRule<T[K]>[] }> = {}
): UseFormReturn<T> {
  const fieldEntries = Object.entries(initialValues) as [keyof T, T[keyof T]][]
  
  const fields = {} as { [K in keyof T]: FormField<T[K]> }
  
  fieldEntries.forEach(([key, initialValue]) => {
    const value = ref(initialValue) as Ref<T[typeof key]>
    const error = ref('')
    const touched = ref(false)
    const fieldRules = rules[key] || []
    
    const isValid = computed(() => {
      if (!touched.value) return true
      return fieldRules.every(rule => rule.validator(value.value))
    })
    
    function validate(): boolean {
      touched.value = true
      for (const rule of fieldRules) {
        if (!rule.validator(value.value)) {
          error.value = rule.message
          return false
        }
      }
      error.value = ''
      return true
    }
    
    function reset(): void {
      value.value = initialValue
      error.value = ''
      touched.value = false
    }
    
    fields[key] = {
      value,
      error,
      touched,
      isValid,
      validate,
      reset
    }
  })
  
  const values = computed(() => {
    const result = {} as T
    for (const key in fields) {
      result[key] = fields[key].value.value
    }
    return result
  })
  
  const errors = computed(() => {
    const result: Partial<Record<keyof T, string>> = {}
    for (const key in fields) {
      if (fields[key].error.value) {
        result[key] = fields[key].error.value
      }
    }
    return result
  })
  
  const isValid = computed(() => {
    return Object.values(fields).every(field => (field as FormField<any>).isValid.value)
  })
  
  function validate(): boolean {
    return Object.values(fields).every(field => (field as FormField<any>).validate())
  }
  
  function reset(): void {
    Object.values(fields).forEach(field => (field as FormField<any>).reset())
  }
  
  function setValues(newValues: Partial<T>): void {
    for (const key in newValues) {
      if (key in fields) {
        fields[key].value.value = newValues[key]!
      }
    }
  }
  
  return {
    fields,
    values,
    errors,
    isValid,
    validate,
    reset,
    setValues
  }
}
```

### 20.3 类型安全的事件总线

```typescript
// utils/eventBus.ts
type EventCallback<T = any> = (payload: T) => void

interface EventBusEvents {
  'user:login': { userId: number; timestamp: Date }
  'user:logout': void
  'cart:add': { productId: number; quantity: number }
  'cart:remove': { productId: number }
  'notification': { type: 'success' | 'error' | 'warning'; message: string }
}

class TypedEventBus<T extends Record<string, any>> {
  private events = new Map<keyof T, Set<EventCallback>>()
  
  on<K extends keyof T>(
    event: K,
    callback: EventCallback<T[K]>
  ): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(callback)
    
    return () => {
      this.off(event, callback)
    }
  }
  
  off<K extends keyof T>(
    event: K,
    callback: EventCallback<T[K]>
  ): void {
    this.events.get(event)?.delete(callback)
  }
  
  emit<K extends keyof T>(
    event: K,
    ...args: T[K] extends void ? [] : [T[K]]
  ): void {
    this.events.get(event)?.forEach(callback => {
      callback(args[0])
    })
  }
  
  once<K extends keyof T>(
    event: K,
    callback: EventCallback<T[K]>
  ): void {
    const wrapper: EventCallback<T[K]> = (payload) => {
      callback(payload)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
  
  clear(): void {
    this.events.clear()
  }
}

export const eventBus = new TypedEventBus<EventBusEvents>()

// 使用示例
eventBus.on('user:login', ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`)
})

eventBus.emit('user:login', { userId: 1, timestamp: new Date() })
eventBus.emit('user:logout')
eventBus.emit('notification', { type: 'success', message: '操作成功' })
```

### 20.4 类型安全的API封装

```typescript
// api/base.ts
import { request } from '@/utils/request'

// 定义API配置
interface ApiConfig<
  TParams = void,
  TData = void,
  TResponse = void
> {
  url: string | ((params: TParams) => string)
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}

// 创建类型安全的API函数
function createApi<TParams = void, TData = void, TResponse = void>(
  config: ApiConfig<TParams, TData, TResponse>
) {
  return async (
    ...args: TParams extends void
      ? TData extends void
        ? []
        : [data: TData]
      : TData extends void
        ? [params: TParams]
        : [params: TParams, data: TData]
  ): Promise<TResponse> => {
    const [paramsOrData, maybeData] = args
    
    const url = typeof config.url === 'function'
      ? config.url(paramsOrData as TParams)
      : config.url
    
    const data = maybeData !== undefined ? maybeData : paramsOrData
    
    return request<TResponse>({
      url,
      method: config.method,
      ...(config.method === 'GET' ? { params: data } : { data })
    })
  }
}

// 使用示例
interface User {
  id: number
  name: string
  email: string
}

interface CreateUserParams {
  name: string
  email: string
}

interface GetUserParams {
  id: number
}

const api = {
  getUsers: createApi<void, { page: number; size: number }, User[]>({
    url: '/users',
    method: 'GET'
  }),
  
  getUser: createApi<GetUserParams, void, User>({
    url: (params) => `/users/${params.id}`,
    method: 'GET'
  }),
  
  createUser: createApi<void, CreateUserParams, User>({
    url: '/users',
    method: 'POST'
  }),
  
  updateUser: createApi<{ id: number }, Partial<User>, User>({
    url: (params) => `/users/${params.id}`,
    method: 'PUT'
  }),
  
  deleteUser: createApi<{ id: number }, void, void>({
    url: (params) => `/users/${params.id}`,
    method: 'DELETE'
  })
}

// 类型安全的使用
const users = await api.getUsers({ page: 1, size: 10 })
const user = await api.getUser({ id: 1 })
const newUser = await api.createUser({ name: '张三', email: 'test@test.com' })
await api.updateUser({ id: 1 }, { name: '李四' })
await api.deleteUser({ id: 1 })
```

---

## 附录：Vue3 + TypeScript 常用类型速查

### 组件相关

```typescript
import {
  DefineComponent,
  ComponentPublicInstance,
  ComponentInternalInstance,
  VNode,
  Slot,
  Slots
} from 'vue'

// 组件类型
type MyComponent = DefineComponent<Props, {}, any>

// 组件实例
type ComponentInstance = ComponentPublicInstance

// 插槽类型
type SlotType = Slot | undefined
```

### 响应式相关

```typescript
import {
  Ref,
  UnwrapRef,
  ShallowRef,
  ComputedRef,
  WritableComputedRef,
  ToRefs,
  UnwrapNestedRefs
} from 'vue'
```

### Props相关

```typescript
import { PropType, ExtractPropTypes, ExtractPublicPropTypes } from 'vue'

// PropType用法
props: {
  user: {
    type: Object as PropType<User>,
    required: true
  }
}
```

### 指令相关

```typescript
import { Directive, DirectiveBinding } from 'vue'

const myDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    // ...
  }
}
```

### 路由相关

```typescript
import {
  RouteRecordRaw,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
  Router,
  RouteLocationRaw
} from 'vue-router'
```

### Pinia相关

```typescript
import { StoreDefinition, Store, StateTree, GettersTree } from 'pinia'
```

---

以上是Vue3 + TypeScript完整语法详解，涵盖了所有核心概念和实用示例。
