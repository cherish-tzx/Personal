# Vue3 + TypeScript 大厂项目实战指南
<div class="doc-toc">
## 目录
1. [项目架构与类型设计](#一项目架构与类型设计)
2. [类型安全的组合式函数](#二类型安全的组合式函数)
3. [Pinia类型化状态管理](#三pinia类型化状态管理)
4. [类型安全的路由系统](#四类型安全的路由系统)
5. [API层类型封装](#五api层类型封装)
6. [类型安全的权限系统](#六类型安全的权限系统)
7. [通用组件类型化封装](#七通用组件类型化封装)
8. [表单系统类型设计](#八表单系统类型设计)
9. [表格系统类型设计](#九表格系统类型设计)
10. [弹窗系统类型设计](#十弹窗系统类型设计)
11. [全局类型声明](#十一全局类型声明)
12. [工具函数类型设计](#十二工具函数类型设计)
13. [自定义指令类型化](#十三自定义指令类型化)
14. [测试与类型覆盖](#十四测试与类型覆盖)
15. [工程化最佳实践](#十五工程化最佳实践)


</div>

## 一、项目架构与类型设计

### 1.1 目录结构规范

```
src/
├── api/                      # API层
│   ├── modules/             # 按模块划分
│   │   ├── user.ts
│   │   └── order.ts
│   ├── request.ts           # axios封装
│   └── index.ts
├── assets/                   # 静态资源
├── components/               # 公共组件
│   ├── base/                # 基础组件
│   └── business/            # 业务组件
├── composables/              # 组合式函数
│   ├── useRequest.ts
│   ├── useTable.ts
│   └── index.ts
├── constants/                # 常量
│   └── enum.ts
├── directives/               # 自定义指令
│   ├── permission.ts
│   └── index.ts
├── layouts/                  # 布局组件
├── router/                   # 路由
│   ├── modules/
│   ├── guards.ts
│   └── index.ts
├── stores/                   # Pinia状态
│   ├── modules/
│   └── index.ts
├── types/                    # 全局类型定义
│   ├── api.d.ts
│   ├── components.d.ts
│   ├── global.d.ts
│   └── index.d.ts
├── utils/                    # 工具函数
├── views/                    # 页面视图
├── App.vue
├── main.ts
├── env.d.ts                  # 环境变量类型
└── shims-vue.d.ts           # Vue文件类型
```

### 1.2 全局类型定义

```typescript
// types/global.d.ts

// 通用ID类型
type ID = number | string

// 可空类型
type Nullable<T> = T | null

// 可能未定义
type Maybe<T> = T | undefined

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P]
}

// 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P]
}

// 记录类型
type RecordType<T = any> = Record<string, T>

// 异步函数类型
type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

// 回调函数类型
type Callback<T = void> = (error: Error | null, result?: T) => void

export {}
```

### 1.3 API响应类型

```typescript
// types/api.d.ts

// 基础API响应
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

// 列表查询参数
interface ListParams extends PageParams {
  keyword?: string
  startDate?: string
  endDate?: string
  status?: number | string
  [key: string]: any
}

export { ApiResponse, PageResponse, PageParams, ListParams }
```

### 1.4 环境变量类型

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_PUBLIC_PATH: string
  readonly VITE_APP_MOCK: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 二、类型安全的组合式函数

### 2.1 useRequest - 通用请求Hook

```typescript
// composables/useRequest.ts
import { ref, shallowRef, computed, Ref, ComputedRef, UnwrapRef } from 'vue'

interface UseRequestOptions<T, P extends any[]> {
  /** 是否立即执行 */
  immediate?: boolean
  /** 初始数据 */
  initialData?: T
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 错误回调 */
  onError?: (error: Error) => void
  /** 完成回调 */
  onFinally?: () => void
  /** 请求前回调 */
  onBefore?: () => void
  /** 默认参数 */
  defaultParams?: P
}

interface UseRequestReturn<T, P extends any[]> {
  /** 响应数据 */
  data: Ref<T | null>
  /** 错误信息 */
  error: Ref<Error | null>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 是否成功 */
  isSuccess: ComputedRef<boolean>
  /** 是否错误 */
  isError: ComputedRef<boolean>
  /** 执行请求 */
  execute: (...args: P) => Promise<T>
  /** 重置状态 */
  reset: () => void
  /** 刷新（使用上次参数） */
  refresh: () => Promise<T>
}

export function useRequest<T, P extends any[] = any[]>(
  requestFn: (...args: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {}
): UseRequestReturn<T, P> {
  const {
    immediate = false,
    initialData = null as T,
    onSuccess,
    onError,
    onFinally,
    onBefore,
    defaultParams
  } = options

  const data = shallowRef<T | null>(initialData)
  const error = shallowRef<Error | null>(null)
  const loading = ref(false)
  const lastParams = ref<P | undefined>(defaultParams)

  const isSuccess = computed(() => !error.value && data.value !== null)
  const isError = computed(() => !!error.value)

  async function execute(...args: P): Promise<T> {
    lastParams.value = args as UnwrapRef<P>
    loading.value = true
    error.value = null
    onBefore?.()

    try {
      const result = await requestFn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError?.(err)
      throw err
    } finally {
      loading.value = false
      onFinally?.()
    }
  }

  async function refresh(): Promise<T> {
    if (lastParams.value) {
      return execute(...(lastParams.value as P))
    }
    return execute(...([] as unknown as P))
  }

  function reset(): void {
    data.value = initialData
    error.value = null
    loading.value = false
  }

  if (immediate) {
    execute(...((defaultParams || []) as P))
  }

  return {
    data,
    error,
    loading,
    isSuccess,
    isError,
    execute,
    reset,
    refresh
  }
}
```

### 2.2 usePagination - 分页Hook

```typescript
// composables/usePagination.ts
import { ref, reactive, computed, Ref, ComputedRef } from 'vue'
import type { PageParams, PageResponse } from '@/types/api'

interface UsePaginationOptions<T, P extends Record<string, any>> {
  /** 默认页码 */
  defaultPage?: number
  /** 默认每页数量 */
  defaultPageSize?: number
  /** 默认查询参数 */
  defaultParams?: P
  /** 是否立即执行 */
  immediate?: boolean
  /** 数据转换 */
  transform?: (data: T[]) => T[]
}

interface UsePaginationReturn<T, P extends Record<string, any>> {
  /** 列表数据 */
  list: Ref<T[]>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 分页信息 */
  pagination: {
    page: Ref<number>
    pageSize: Ref<number>
    total: Ref<number>
    totalPages: ComputedRef<number>
  }
  /** 查询参数 */
  params: P
  /** 获取数据 */
  fetch: (extraParams?: Partial<P>) => Promise<void>
  /** 搜索（重置到第一页） */
  search: (searchParams?: Partial<P>) => Promise<void>
  /** 重置 */
  reset: () => Promise<void>
  /** 刷新当前页 */
  refresh: () => Promise<void>
  /** 切换页码 */
  changePage: (page: number) => Promise<void>
  /** 切换每页数量 */
  changePageSize: (pageSize: number) => Promise<void>
}

export function usePagination<T, P extends Record<string, any> = Record<string, any>>(
  fetchApi: (params: PageParams & P) => Promise<PageResponse<T>>,
  options: UsePaginationOptions<T, P> = {}
): UsePaginationReturn<T, P> {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    defaultParams = {} as P,
    immediate = true,
    transform
  } = options

  const list = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const page = ref(defaultPage)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)
  const params = reactive({ ...defaultParams }) as P

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  async function fetch(extraParams?: Partial<P>): Promise<void> {
    loading.value = true
    try {
      const response = await fetchApi({
        page: page.value,
        pageSize: pageSize.value,
        ...params,
        ...extraParams
      } as PageParams & P)

      list.value = transform ? transform(response.list) : response.list
      total.value = response.total
    } finally {
      loading.value = false
    }
  }

  async function search(searchParams?: Partial<P>): Promise<void> {
    if (searchParams) {
      Object.assign(params, searchParams)
    }
    page.value = 1
    await fetch()
  }

  async function reset(): Promise<void> {
    page.value = defaultPage
    pageSize.value = defaultPageSize
    Object.assign(params, defaultParams)
    await fetch()
  }

  async function refresh(): Promise<void> {
    await fetch()
  }

  async function changePage(newPage: number): Promise<void> {
    page.value = newPage
    await fetch()
  }

  async function changePageSize(newPageSize: number): Promise<void> {
    pageSize.value = newPageSize
    page.value = 1
    await fetch()
  }

  if (immediate) {
    fetch()
  }

  return {
    list,
    loading,
    pagination: {
      page,
      pageSize,
      total,
      totalPages
    },
    params,
    fetch,
    search,
    reset,
    refresh,
    changePage,
    changePageSize
  }
}
```

### 2.3 useTable - 表格Hook

```typescript
// composables/useTable.ts
import { ref, reactive, computed, Ref, ComputedRef } from 'vue'
import type { PageParams, PageResponse } from '@/types/api'

interface SortInfo {
  prop: string
  order: 'ascending' | 'descending' | null
}

interface UseTableOptions<T, P extends Record<string, any>> {
  /** 行唯一键 */
  rowKey?: keyof T | string
  /** 默认参数 */
  defaultParams?: P
  /** 默认每页数量 */
  defaultPageSize?: number
  /** 是否立即执行 */
  immediate?: boolean
  /** 数据转换 */
  transform?: (data: T[]) => T[]
}

interface UseTableReturn<T, P extends Record<string, any>> {
  /** 表格数据 */
  tableData: Ref<T[]>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 分页信息 */
  pagination: {
    page: Ref<number>
    pageSize: Ref<number>
    total: Ref<number>
  }
  /** 查询参数 */
  queryParams: P
  /** 选中行 */
  selectedRows: Ref<T[]>
  /** 选中行的Key */
  selectedKeys: ComputedRef<(string | number)[]>
  /** 排序信息 */
  sortInfo: Ref<SortInfo>
  
  /** 获取数据 */
  fetchData: () => Promise<void>
  /** 搜索 */
  search: () => Promise<void>
  /** 重置查询 */
  resetQuery: () => Promise<void>
  /** 刷新 */
  refresh: () => Promise<void>
  /** 切换页码 */
  changePage: (page: number) => Promise<void>
  /** 切换每页数量 */
  changePageSize: (pageSize: number) => Promise<void>
  /** 排序变化处理 */
  handleSortChange: (sort: SortInfo) => void
  /** 选择变化处理 */
  handleSelectionChange: (selection: T[]) => void
  /** 清空选择 */
  clearSelection: () => void
}

export function useTable<T extends Record<string, any>, P extends Record<string, any> = Record<string, any>>(
  fetchApi: (params: PageParams & P & { sortBy?: string; sortOrder?: string }) => Promise<PageResponse<T>>,
  options: UseTableOptions<T, P> = {}
): UseTableReturn<T, P> {
  const {
    rowKey = 'id',
    defaultParams = {} as P,
    defaultPageSize = 10,
    immediate = true,
    transform
  } = options

  // 数据状态
  const tableData = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  // 查询参数
  const queryParams = reactive({ ...defaultParams }) as P

  // 选中状态
  const selectedRows = ref<T[]>([]) as Ref<T[]>
  const selectedKeys = computed(() => {
    return selectedRows.value.map(row => row[rowKey as keyof T] as string | number)
  })

  // 排序状态
  const sortInfo = ref<SortInfo>({ prop: '', order: null })

  // 获取数据
  async function fetchData(): Promise<void> {
    loading.value = true
    try {
      const params: PageParams & P & { sortBy?: string; sortOrder?: string } = {
        page: page.value,
        pageSize: pageSize.value,
        ...queryParams
      }

      if (sortInfo.value.prop && sortInfo.value.order) {
        params.sortBy = sortInfo.value.prop
        params.sortOrder = sortInfo.value.order === 'ascending' ? 'asc' : 'desc'
      }

      const response = await fetchApi(params)
      tableData.value = transform ? transform(response.list) : response.list
      total.value = response.total
    } finally {
      loading.value = false
    }
  }

  // 搜索（重置到第一页）
  async function search(): Promise<void> {
    page.value = 1
    await fetchData()
  }

  // 重置查询
  async function resetQuery(): Promise<void> {
    Object.assign(queryParams, defaultParams)
    page.value = 1
    sortInfo.value = { prop: '', order: null }
    await fetchData()
  }

  // 刷新
  async function refresh(): Promise<void> {
    await fetchData()
  }

  // 切换页码
  async function changePage(newPage: number): Promise<void> {
    page.value = newPage
    await fetchData()
  }

  // 切换每页数量
  async function changePageSize(newPageSize: number): Promise<void> {
    pageSize.value = newPageSize
    page.value = 1
    await fetchData()
  }

  // 排序变化
  function handleSortChange(sort: SortInfo): void {
    sortInfo.value = sort
    fetchData()
  }

  // 选择变化
  function handleSelectionChange(selection: T[]): void {
    selectedRows.value = selection
  }

  // 清空选择
  function clearSelection(): void {
    selectedRows.value = []
  }

  // 立即执行
  if (immediate) {
    fetchData()
  }

  return {
    tableData,
    loading,
    pagination: {
      page,
      pageSize,
      total
    },
    queryParams,
    selectedRows,
    selectedKeys,
    sortInfo,
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

### 2.4 useForm - 表单Hook

```typescript
// composables/useForm.ts
import { ref, reactive, computed, toRaw, Ref, ComputedRef, UnwrapNestedRefs } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'

interface UseFormOptions<T extends Record<string, any>> {
  /** 表单验证规则 */
  rules?: FormRules
  /** 提交前转换数据 */
  transform?: (data: T) => any
  /** 值变化回调 */
  onValuesChange?: (values: T, changedValues: Partial<T>) => void
}

interface UseFormReturn<T extends Record<string, any>> {
  /** 表单ref */
  formRef: Ref<FormInstance | null>
  /** 表单数据 */
  formData: UnwrapNestedRefs<T>
  /** 提交中 */
  loading: Ref<boolean>
  /** 是否已修改 */
  isDirty: ComputedRef<boolean>
  /** 验证规则 */
  rules: FormRules
  
  /** 验证表单 */
  validate: () => Promise<boolean>
  /** 验证指定字段 */
  validateField: (field: keyof T | (keyof T)[]) => Promise<boolean>
  /** 重置表单 */
  resetFields: () => void
  /** 清除验证 */
  clearValidate: (field?: keyof T | (keyof T)[]) => void
  /** 设置字段值 */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  /** 设置多个字段值 */
  setFieldsValue: (values: Partial<T>) => void
  /** 获取表单数据 */
  getFieldsValue: () => T
  /** 滚动到字段 */
  scrollToField: (field: keyof T) => void
  /** 提交表单 */
  submit: <R = any>(submitFn: (data: T) => Promise<R>) => Promise<R | false>
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  options: UseFormOptions<T> = {}
): UseFormReturn<T> {
  const { rules = {}, transform, onValuesChange } = options

  const formRef = ref<FormInstance | null>(null)
  const initialData = cloneDeep(initialValues)
  const formData = reactive<T>(cloneDeep(initialValues)) as UnwrapNestedRefs<T>
  const loading = ref(false)

  // 是否已修改
  const isDirty = computed(() => {
    return JSON.stringify(toRaw(formData)) !== JSON.stringify(initialData)
  })

  // 验证表单
  async function validate(): Promise<boolean> {
    if (!formRef.value) return true
    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  // 验证指定字段
  async function validateField(field: keyof T | (keyof T)[]): Promise<boolean> {
    if (!formRef.value) return true
    try {
      await formRef.value.validateField(field as string | string[])
      return true
    } catch {
      return false
    }
  }

  // 重置表单
  function resetFields(): void {
    Object.assign(formData, cloneDeep(initialData))
    formRef.value?.resetFields()
  }

  // 清除验证
  function clearValidate(field?: keyof T | (keyof T)[]): void {
    formRef.value?.clearValidate(field as string | string[] | undefined)
  }

  // 设置字段值
  function setFieldValue<K extends keyof T>(field: K, value: T[K]): void {
    const oldValue = formData[field]
    ;(formData as T)[field] = value
    onValuesChange?.(toRaw(formData) as T, { [field]: value } as Partial<T>)
  }

  // 设置多个字段值
  function setFieldsValue(values: Partial<T>): void {
    Object.assign(formData, values)
    onValuesChange?.(toRaw(formData) as T, values)
  }

  // 获取表单数据
  function getFieldsValue(): T {
    const data = toRaw(formData) as T
    return transform ? transform(data) : data
  }

  // 滚动到字段
  function scrollToField(field: keyof T): void {
    formRef.value?.scrollToField(field as string)
  }

  // 提交表单
  async function submit<R = any>(submitFn: (data: T) => Promise<R>): Promise<R | false> {
    const valid = await validate()
    if (!valid) return false

    loading.value = true
    try {
      const data = getFieldsValue()
      const result = await submitFn(data)
      return result
    } finally {
      loading.value = false
    }
  }

  return {
    formRef,
    formData,
    loading,
    isDirty,
    rules,
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

### 2.5 useModal - 弹窗Hook

```typescript
// composables/useModal.ts
import { ref, computed, Ref, ComputedRef } from 'vue'

type ModalMode = 'create' | 'edit' | 'view'

interface UseModalOptions<T = any> {
  /** 默认可见性 */
  defaultVisible?: boolean
  /** 打开回调 */
  onOpen?: (config: { mode: ModalMode; data: T | null }) => void
  /** 关闭回调 */
  onClose?: () => void
}

interface OpenConfig<T = any> {
  /** 模式 */
  mode?: ModalMode
  /** 数据 */
  data?: T | null
}

interface UseModalReturn<T = any> {
  /** 是否可见 */
  visible: Ref<boolean>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 数据 */
  data: Ref<T | null>
  /** 当前模式 */
  mode: Ref<ModalMode>
  /** 标题 */
  title: ComputedRef<string>
  /** 是否新增模式 */
  isCreate: ComputedRef<boolean>
  /** 是否编辑模式 */
  isEdit: ComputedRef<boolean>
  /** 是否查看模式 */
  isView: ComputedRef<boolean>
  /** 是否可编辑（新增或编辑） */
  isEditable: ComputedRef<boolean>
  
  /** 打开弹窗 */
  open: (config?: OpenConfig<T>) => void
  /** 关闭弹窗 */
  close: () => void
  /** 设置加载状态 */
  setLoading: (value: boolean) => void
  /** 重置状态 */
  reset: () => void
}

export function useModal<T = any>(options: UseModalOptions<T> = {}): UseModalReturn<T> {
  const { defaultVisible = false, onOpen, onClose } = options

  const visible = ref(defaultVisible)
  const loading = ref(false)
  const data = ref<T | null>(null) as Ref<T | null>
  const mode = ref<ModalMode>('create')

  const title = computed(() => {
    const titles: Record<ModalMode, string> = {
      create: '新增',
      edit: '编辑',
      view: '查看'
    }
    return titles[mode.value]
  })

  const isCreate = computed(() => mode.value === 'create')
  const isEdit = computed(() => mode.value === 'edit')
  const isView = computed(() => mode.value === 'view')
  const isEditable = computed(() => mode.value !== 'view')

  function open(config: OpenConfig<T> = {}): void {
    const { mode: openMode = 'create', data: openData = null } = config
    mode.value = openMode
    data.value = openData
    visible.value = true
    onOpen?.({ mode: openMode, data: openData })
  }

  function close(): void {
    visible.value = false
    onClose?.()
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function reset(): void {
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
    isEditable,
    open,
    close,
    setLoading,
    reset
  }
}
```

---

## 三、Pinia类型化状态管理

### 3.1 用户状态模块

```typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed, Ref, ComputedRef } from 'vue'
import { login, logout, getUserInfo } from '@/api/modules/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import type { LoginParams, UserInfo } from '@/api/modules/user'

interface UserState {
  token: string
  userInfo: UserInfo | null
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  // State
  const token: Ref<string> = ref(getToken() || '')
  const userInfo: Ref<UserInfo | null> = ref(null)
  const roles: Ref<string[]> = ref([])
  const permissions: Ref<string[]> = ref([])

  // Getters
  const isLoggedIn: ComputedRef<boolean> = computed(() => !!token.value)
  const isAdmin: ComputedRef<boolean> = computed(() => roles.value.includes('admin'))
  const userName: ComputedRef<string> = computed(() => userInfo.value?.name || '')
  const avatar: ComputedRef<string> = computed(() => userInfo.value?.avatar || '')

  // Actions
  async function loginAction(params: LoginParams): Promise<void> {
    const res = await login(params)
    token.value = res.data.token
    setToken(res.data.token)
  }

  async function getUserInfoAction(): Promise<UserInfo> {
    const res = await getUserInfo()
    userInfo.value = res.data.user
    roles.value = res.data.roles
    permissions.value = res.data.permissions
    return res.data.user
  }

  async function logoutAction(): Promise<void> {
    try {
      await logout()
    } finally {
      resetState()
      removeToken()
      resetRouter()
    }
  }

  function resetState(): void {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
  }

  function hasPermission(permission: string | string[]): boolean {
    if (isAdmin.value) return true
    const perms = Array.isArray(permission) ? permission : [permission]
    return perms.some(p => permissions.value.includes(p))
  }

  function hasRole(role: string | string[]): boolean {
    const r = Array.isArray(role) ? role : [role]
    return r.some(item => roles.value.includes(item))
  }

  return {
    // State
    token,
    userInfo,
    roles,
    permissions,
    
    // Getters
    isLoggedIn,
    isAdmin,
    userName,
    avatar,
    
    // Actions
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

// 导出Store类型
export type UserStore = ReturnType<typeof useUserStore>
```

### 3.2 权限路由模块

```typescript
// stores/modules/permission.ts
import { defineStore } from 'pinia'
import { ref, computed, Ref, ComputedRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import { useUserStore } from './user'

export const usePermissionStore = defineStore('permission', () => {
  // State
  const routes: Ref<RouteRecordRaw[]> = ref([])
  const addRoutes: Ref<RouteRecordRaw[]> = ref([])

  // Getters
  const menuRoutes: ComputedRef<RouteRecordRaw[]> = computed(() => {
    return routes.value.filter(route => !route.meta?.hidden)
  })

  // Actions
  function hasPermission(route: RouteRecordRaw): boolean {
    const userStore = useUserStore()
    if (route.meta?.roles) {
      return (route.meta.roles as string[]).some(role => 
        userStore.roles.includes(role)
      )
    }
    return true
  }

  function filterAsyncRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = []
    
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

  async function generateRoutes(): Promise<RouteRecordRaw[]> {
    const userStore = useUserStore()
    let accessedRoutes: RouteRecordRaw[]

    if (userStore.isAdmin) {
      accessedRoutes = asyncRoutes || []
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes)
    }

    addRoutes.value = accessedRoutes
    routes.value = constantRoutes.concat(accessedRoutes)

    return accessedRoutes
  }

  function resetRoutes(): void {
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

export type PermissionStore = ReturnType<typeof usePermissionStore>
```

### 3.3 应用配置模块

```typescript
// stores/modules/app.ts
import { defineStore } from 'pinia'
import { ref, computed, Ref, ComputedRef } from 'vue'

type ThemeMode = 'light' | 'dark'
type LayoutMode = 'sidebar' | 'top' | 'mix'
type DeviceType = 'desktop' | 'mobile'
type LanguageType = 'zh-CN' | 'en-US'

interface AppConfig {
  theme: ThemeMode
  primaryColor: string
  layout: LayoutMode
  showTabs: boolean
  fixedHeader: boolean
  showBreadcrumb: boolean
  language: LanguageType
}

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarCollapsed: Ref<boolean> = ref(false)
  const device: Ref<DeviceType> = ref('desktop')
  const theme: Ref<ThemeMode> = ref('light')
  const primaryColor: Ref<string> = ref('#409EFF')
  const layout: Ref<LayoutMode> = ref('sidebar')
  const showTabs: Ref<boolean> = ref(true)
  const fixedHeader: Ref<boolean> = ref(true)
  const showBreadcrumb: Ref<boolean> = ref(true)
  const language: Ref<LanguageType> = ref('zh-CN')

  // Getters
  const isMobile: ComputedRef<boolean> = computed(() => device.value === 'mobile')
  const isDark: ComputedRef<boolean> = computed(() => theme.value === 'dark')

  // Actions
  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(collapsed: boolean): void {
    sidebarCollapsed.value = collapsed
  }

  function setDevice(val: DeviceType): void {
    device.value = val
  }

  function setTheme(val: ThemeMode): void {
    theme.value = val
    document.documentElement.setAttribute('data-theme', val)
  }

  function toggleTheme(): void {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function setPrimaryColor(color: string): void {
    primaryColor.value = color
    document.documentElement.style.setProperty('--primary-color', color)
  }

  function setLayout(val: LayoutMode): void {
    layout.value = val
  }

  function setLanguage(lang: LanguageType): void {
    language.value = lang
  }

  function getConfig(): AppConfig {
    return {
      theme: theme.value,
      primaryColor: primaryColor.value,
      layout: layout.value,
      showTabs: showTabs.value,
      fixedHeader: fixedHeader.value,
      showBreadcrumb: showBreadcrumb.value,
      language: language.value
    }
  }

  function setConfig(config: Partial<AppConfig>): void {
    if (config.theme !== undefined) setTheme(config.theme)
    if (config.primaryColor !== undefined) setPrimaryColor(config.primaryColor)
    if (config.layout !== undefined) layout.value = config.layout
    if (config.showTabs !== undefined) showTabs.value = config.showTabs
    if (config.fixedHeader !== undefined) fixedHeader.value = config.fixedHeader
    if (config.showBreadcrumb !== undefined) showBreadcrumb.value = config.showBreadcrumb
    if (config.language !== undefined) language.value = config.language
  }

  return {
    // State
    sidebarCollapsed,
    device,
    theme,
    primaryColor,
    layout,
    showTabs,
    fixedHeader,
    showBreadcrumb,
    language,
    
    // Getters
    isMobile,
    isDark,
    
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    setDevice,
    setTheme,
    toggleTheme,
    setPrimaryColor,
    setLayout,
    setLanguage,
    getConfig,
    setConfig
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

export type AppStore = ReturnType<typeof useAppStore>
```

---

## 四、类型安全的路由系统

### 4.1 路由类型扩展

```typescript
// router/types.ts
import type { RouteRecordRaw } from 'vue-router'

// 扩展路由元信息
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 菜单图标 */
    icon?: string
    /** 是否需要登录 */
    requiresAuth?: boolean
    /** 允许的角色 */
    roles?: string[]
    /** 是否隐藏菜单 */
    hidden?: boolean
    /** 是否固定在标签栏 */
    affix?: boolean
    /** 是否不缓存 */
    noCache?: boolean
    /** 高亮的菜单路径 */
    activeMenu?: string
    /** 面包屑是否可点击 */
    breadcrumbLink?: boolean
  }
}

// 自定义路由类型
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  children?: AppRouteRecordRaw[]
  meta?: RouteMeta
}

// 菜单项类型
export interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  children?: MenuItem[]
  hidden?: boolean
}

export type { RouteRecordRaw }
```

### 4.2 路由配置

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { setupRouterGuards } from './guards'

const Layout = () => import('@/layouts/default/index.vue')

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
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
    meta: { title: '登录', hidden: true }
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
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'setting', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 重置路由
export function resetRouter(): void {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
  })
  ;(router as any).matcher = (newRouter as any).matcher
}

// 设置路由
export function setupRouter(app: App): void {
  setupRouterGuards(router)
  app.use(router)
}

export default router
```

### 4.3 类型安全的路由守卫

```typescript
// router/guards.ts
import type { Router, RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList: string[] = ['/login', '/auth-redirect']

export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    // 设置页面标题
    setPageTitle(to)

    const hasToken = getToken()
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasRoles = userStore.roles.length > 0

        if (hasRoles) {
          next()
        } else {
          try {
            await userStore.getUserInfoAction()
            const accessRoutes = await permissionStore.generateRoutes()

            accessRoutes.forEach(route => {
              router.addRoute(route)
            })

            next({ ...to, replace: true })
          } catch (error) {
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

function setPageTitle(route: RouteLocationNormalized): void {
  const title = import.meta.env.VITE_APP_TITLE || '管理系统'
  const pageTitle = route.meta?.title
  document.title = pageTitle ? `${pageTitle} - ${title}` : title
}
```

---

## 五、API层类型封装

### 5.1 Axios类型封装

```typescript
// api/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError
} from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { getToken } from '@/utils/auth'
import router from '@/router'
import type { ApiResponse } from '@/types/api'

// 扩展AxiosRequestConfig
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  /** 跳过错误处理 */
  skipErrorHandler?: boolean
  /** 显示加载 */
  showLoading?: boolean
}

// 创建实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  (config: CustomRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    const config = response.config as CustomRequestConfig

    if (res.code !== 0 && res.code !== 200) {
      if (!config.skipErrorHandler) {
        ElMessage.error(res.message || '请求失败')

        // Token过期
        if (res.code === 401) {
          handleUnauthorized()
        }
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error: AxiosError) => {
    console.error('Response Error:', error)
    handleResponseError(error)
    return Promise.reject(error)
  }
)

// 处理401
function handleUnauthorized(): void {
  ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const userStore = useUserStore()
    userStore.resetState()
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
  })
}

// 处理响应错误
function handleResponseError(error: AxiosError): void {
  const statusMessages: Record<number, string> = {
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

  let message = '请求失败'
  if (error.response) {
    message = statusMessages[error.response.status] || `连接错误${error.response.status}`
  } else if (error.message.includes('timeout')) {
    message = '请求超时'
  } else if (error.message.includes('Network')) {
    message = '网络异常'
  }

  ElMessage.error(message)
}

// 封装请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service(config)
}

export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service({ method: 'get', url, params, ...config })
}

export function post<T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service({ method: 'post', url, data, ...config })
}

export function put<T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service({ method: 'put', url, data, ...config })
}

export function del<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return service({ method: 'delete', url, params, ...config })
}

export default service
```

### 5.2 API模块类型定义

```typescript
// api/modules/user.ts
import { get, post, put, del } from '../request'
import type { ApiResponse, PageResponse, PageParams } from '@/types/api'

// 用户信息类型
export interface UserInfo {
  id: number
  name: string
  email: string
  avatar: string
  phone?: string
  status: 0 | 1
  roles: string[]
  createdAt: string
  updatedAt: string
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

// 登录响应
export interface LoginResult {
  token: string
  expiresIn: number
}

// 获取用户信息响应
export interface GetUserInfoResult {
  user: UserInfo
  roles: string[]
  permissions: string[]
}

// 用户列表查询参数
export interface UserListParams extends PageParams {
  keyword?: string
  status?: 0 | 1
  roleId?: number
}

// 创建用户参数
export interface CreateUserParams {
  name: string
  email: string
  password: string
  phone?: string
  roleIds?: number[]
}

// 更新用户参数
export interface UpdateUserParams {
  name?: string
  email?: string
  phone?: string
  status?: 0 | 1
  roleIds?: number[]
}

// API方法
export function login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
  return post('/auth/login', params)
}

export function logout(): Promise<ApiResponse<void>> {
  return post('/auth/logout')
}

export function getUserInfo(): Promise<ApiResponse<GetUserInfoResult>> {
  return get('/user/info')
}

export function getUserList(params: UserListParams): Promise<ApiResponse<PageResponse<UserInfo>>> {
  return get('/user/list', params)
}

export function getUserDetail(id: number): Promise<ApiResponse<UserInfo>> {
  return get(`/user/${id}`)
}

export function createUser(params: CreateUserParams): Promise<ApiResponse<UserInfo>> {
  return post('/user', params)
}

export function updateUser(id: number, params: UpdateUserParams): Promise<ApiResponse<UserInfo>> {
  return put(`/user/${id}`, params)
}

export function deleteUser(id: number): Promise<ApiResponse<void>> {
  return del(`/user/${id}`)
}

export function batchDeleteUsers(ids: number[]): Promise<ApiResponse<void>> {
  return del('/user/batch', { ids })
}

export function resetPassword(id: number, password: string): Promise<ApiResponse<void>> {
  return put(`/user/${id}/password`, { password })
}

export function changeUserStatus(id: number, status: 0 | 1): Promise<ApiResponse<void>> {
  return put(`/user/${id}/status`, { status })
}
```

---

## 六、类型安全的权限系统

### 6.1 权限指令

```typescript
// directives/permission.ts
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'

type PermissionValue = string | string[]

function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionValue>): void {
  const { value } = binding
  const userStore = useUserStore()

  if (value && (typeof value === 'string' || Array.isArray(value))) {
    const permissions = Array.isArray(value) ? value : [value]
    const hasPermission = userStore.hasPermission(permissions)

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  } else {
    throw new Error('need permissions! Like v-permission="[\'admin\']"')
  }
}

const permissionDirective: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  }
}

export default permissionDirective
```

### 6.2 权限组件

```vue
<!-- components/Permission.vue -->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useUserStore } from '@/stores/modules/user'

type CheckMode = 'any' | 'all'

interface Props {
  /** 权限值 */
  value: string | string[]
  /** 检查模式：any-满足一个即可，all-必须全部满足 */
  mode?: CheckMode
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'any'
})

const slots = useSlots()
const userStore = useUserStore()

const hasPermission = computed<boolean>(() => {
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

### 6.3 权限Hook

```typescript
// composables/usePermission.ts
import { computed, ComputedRef } from 'vue'
import { useUserStore } from '@/stores/modules/user'

interface UsePermissionReturn {
  /** 检查是否有权限 */
  hasPermission: (permission: string | string[]) => boolean
  /** 检查是否有角色 */
  hasRole: (role: string | string[]) => boolean
  /** 检查是否有任一权限 */
  hasAnyPermission: (permissions: string[]) => boolean
  /** 检查是否有所有权限 */
  hasAllPermissions: (permissions: string[]) => boolean
  /** 是否是管理员 */
  isAdmin: ComputedRef<boolean>
}

export function usePermission(): UsePermissionReturn {
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.isAdmin)

  function hasPermission(permission: string | string[]): boolean {
    return userStore.hasPermission(permission)
  }

  function hasRole(role: string | string[]): boolean {
    return userStore.hasRole(role)
  }

  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => userStore.hasPermission(p))
  }

  function hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => userStore.hasPermission(p))
  }

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin
  }
}
```

---

## 七、通用组件类型化封装

### 7.1 通用按钮组件

```vue
<!-- components/base/BaseButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
type ButtonSize = 'large' | 'default' | 'small'

interface Props {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 图标 */
  icon?: string
  /** 是否为圆形按钮 */
  circle?: boolean
  /** 是否为朴素按钮 */
  plain?: boolean
  /** 是否为块级按钮 */
  block?: boolean
  /** 权限标识 */
  permission?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  circle: false,
  plain: false,
  block: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const hasPermission = computed<boolean>(() => {
  if (!props.permission) return true
  // 这里可以引入权限检查逻辑
  return true
})

const buttonClass = computed(() => ({
  'is-block': props.block
}))

function handleClick(event: MouseEvent): void {
  if (!props.disabled && !props.loading && hasPermission.value) {
    emit('click', event)
  }
}
</script>

<template>
  <el-button
    v-if="hasPermission"
    :type="type"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    :circle="circle"
    :plain="plain"
    :class="buttonClass"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<style scoped>
.is-block {
  width: 100%;
}
</style>
```

### 7.2 类型化图标组件

```vue
<!-- components/base/SvgIcon.vue -->
<script setup lang="ts">
import { computed, CSSProperties } from 'vue'

interface Props {
  /** 图标名称 */
  name: string
  /** 图标颜色 */
  color?: string
  /** 图标大小 */
  size?: number | string
  /** 是否旋转 */
  spin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  spin: false
})

const symbolId = computed(() => `#icon-${props.name}`)

const iconSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return props.size
})

const iconStyle = computed<CSSProperties>(() => ({
  width: iconSize.value,
  height: iconSize.value,
  color: props.color
}))

const iconClass = computed(() => ({
  'svg-icon': true,
  'is-spin': props.spin
}))
</script>

<template>
  <svg :class="iconClass" :style="iconStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}

.is-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
```

---

## 八、表单系统类型设计

### 8.1 动态表单类型定义

```typescript
// types/form.d.ts
import type { FormRules } from 'element-plus'

// 表单项类型
type FormItemType =
  | 'input'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'daterange'
  | 'textarea'
  | 'upload'
  | 'slot'

// 选项类型
interface OptionItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

// 表单字段配置
interface FormField<T = any> {
  /** 字段名 */
  prop: keyof T & string
  /** 标签文本 */
  label: string
  /** 组件类型 */
  type: FormItemType
  /** 栅格占比 */
  span?: number
  /** 默认值 */
  defaultValue?: any
  /** 组件属性 */
  componentProps?: Record<string, any>
  /** 选项列表 */
  options?: OptionItem[] | (() => OptionItem[]) | (() => Promise<OptionItem[]>)
  /** 验证规则 */
  rules?: FormRules[string]
  /** 是否显示 */
  visible?: boolean | ((formData: T) => boolean)
  /** 是否禁用 */
  disabled?: boolean | ((formData: T) => boolean)
  /** 插槽名称 */
  slotName?: string
  /** 自定义渲染 */
  render?: (formData: T) => any
}

// 表单配置
interface FormConfig<T = any> {
  /** 表单字段 */
  fields: FormField<T>[]
  /** 标签宽度 */
  labelWidth?: string
  /** 标签位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 验证规则 */
  rules?: FormRules
  /** 是否禁用 */
  disabled?: boolean
  /** 栅格间距 */
  gutter?: number
}

export type { FormItemType, OptionItem, FormField, FormConfig }
```

### 8.2 动态表单组件

```vue
<!-- components/DynamicForm.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch, toRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormField, FormConfig } from '@/types/form'

interface Props {
  /** 表单配置 */
  config: FormConfig<T>
  /** 表单数据 */
  modelValue: T
  /** 是否禁用 */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
  (e: 'submit', value: T): void
}>()

const formRef = ref<FormInstance | null>(null)
const formData = ref<T>({ ...props.modelValue }) as Ref<T>

// 监听外部数据变化
watch(
  () => props.modelValue,
  (val) => {
    formData.value = { ...val }
  },
  { deep: true }
)

// 监听内部数据变化
watch(
  formData,
  (val) => {
    emit('update:modelValue', toRaw(val) as T)
  },
  { deep: true }
)

// 计算可见字段
const visibleFields = computed<FormField<T>[]>(() => {
  return props.config.fields.filter(field => {
    if (typeof field.visible === 'function') {
      return field.visible(formData.value)
    }
    return field.visible !== false
  })
})

// 计算字段禁用状态
function isFieldDisabled(field: FormField<T>): boolean {
  if (props.disabled) return true
  if (typeof field.disabled === 'function') {
    return field.disabled(formData.value)
  }
  return field.disabled === true
}

// 验证表单
async function validate(): Promise<boolean> {
  if (!formRef.value) return true
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 重置表单
function resetFields(): void {
  formRef.value?.resetFields()
}

// 清除验证
function clearValidate(props?: string | string[]): void {
  formRef.value?.clearValidate(props)
}

// 提交表单
async function submit(): Promise<void> {
  const valid = await validate()
  if (valid) {
    emit('submit', toRaw(formData.value) as T)
  }
}

defineExpose({
  validate,
  resetFields,
  clearValidate,
  submit,
  formRef
})
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="config.rules"
    :label-width="config.labelWidth || '100px'"
    :label-position="config.labelPosition || 'right'"
    :disabled="disabled"
  >
    <el-row :gutter="config.gutter || 20">
      <template v-for="field in visibleFields" :key="field.prop">
        <el-col :span="field.span || 24">
          <el-form-item :label="field.label" :prop="field.prop" :rules="field.rules">
            <!-- 输入框 -->
            <el-input
              v-if="field.type === 'input'"
              v-model="formData[field.prop]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
            />

            <!-- 数字输入 -->
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="formData[field.prop]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
            />

            <!-- 选择框 -->
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.prop]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
            >
              <el-option
                v-for="opt in (Array.isArray(field.options) ? field.options : [])"
                :key="String(opt.value)"
                :label="opt.label"
                :value="opt.value"
                :disabled="opt.disabled"
              />
            </el-select>

            <!-- 开关 -->
            <el-switch
              v-else-if="field.type === 'switch'"
              v-model="formData[field.prop]"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
            />

            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="['date', 'datetime', 'daterange'].includes(field.type)"
              v-model="formData[field.prop]"
              :type="field.type"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
            />

            <!-- 文本域 -->
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.prop]"
              type="textarea"
              :disabled="isFieldDisabled(field)"
              v-bind="field.componentProps"
            />

            <!-- 自定义插槽 -->
            <slot
              v-else-if="field.type === 'slot'"
              :name="field.slotName || field.prop"
              :field="field"
              :form-data="formData"
              :disabled="isFieldDisabled(field)"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-form-item v-if="$slots.footer">
      <slot name="footer" :submit="submit" :reset="resetFields" />
    </el-form-item>
  </el-form>
</template>
```

---

## 九、表格系统类型设计

### 9.1 表格列类型定义

```typescript
// types/table.d.ts

// 表格列配置
interface TableColumn<T = any> {
  /** 列标识 */
  prop?: keyof T & string
  /** 列标题 */
  label: string
  /** 列宽度 */
  width?: number | string
  /** 最小宽度 */
  minWidth?: number | string
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean | 'custom'
  /** 是否显示溢出提示 */
  showOverflowTooltip?: boolean
  /** 格式化函数 */
  formatter?: (value: any, row: T, index: number) => string
  /** 自定义渲染 */
  render?: (data: { row: T; column: TableColumn<T>; $index: number }) => any
  /** 插槽名称 */
  slotName?: string
  /** 是否隐藏 */
  hidden?: boolean
}

// 排序信息
interface SortInfo {
  prop: string
  order: 'ascending' | 'descending' | null
}

// 表格配置
interface TableConfig<T = any> {
  /** 列配置 */
  columns: TableColumn<T>[]
  /** 行唯一键 */
  rowKey?: keyof T & string
  /** 是否显示边框 */
  border?: boolean
  /** 是否显示斑马纹 */
  stripe?: boolean
  /** 是否显示序号 */
  showIndex?: boolean
  /** 是否显示选择框 */
  selection?: boolean
  /** 表格高度 */
  height?: number | string
  /** 最大高度 */
  maxHeight?: number | string
}

export type { TableColumn, SortInfo, TableConfig }
```

### 9.2 ProTable组件

```vue
<!-- components/ProTable.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, useSlots, watch } from 'vue'
import type { TableInstance } from 'element-plus'
import type { TableColumn, TableConfig } from '@/types/table'
import type { PageResponse, PageParams } from '@/types/api'

interface Props {
  /** 列配置 */
  columns: TableColumn<T>[]
  /** 数据获取API */
  api: (params: PageParams & Record<string, any>) => Promise<{ data: PageResponse<T> }>
  /** 默认查询参数 */
  defaultParams?: Record<string, any>
  /** 行唯一键 */
  rowKey?: keyof T & string
  /** 是否显示选择框 */
  selection?: boolean
  /** 是否显示序号 */
  showIndex?: boolean
  /** 是否立即加载 */
  immediate?: boolean
  /** 边框 */
  border?: boolean
  /** 斑马纹 */
  stripe?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id' as any,
  selection: false,
  showIndex: false,
  immediate: true,
  border: true,
  stripe: true
})

const emit = defineEmits<{
  (e: 'selection-change', selection: T[]): void
  (e: 'row-click', row: T, column: any, event: Event): void
}>()

const slots = useSlots()
const tableRef = ref<TableInstance | null>(null)

// 状态
const tableData = ref<T[]>([]) as Ref<T[]>
const loading = ref(false)
const selectedRows = ref<T[]>([]) as Ref<T[]>
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 显示的列
const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden)
})

// 选中的keys
const selectedKeys = computed(() => {
  return selectedRows.value.map(row => row[props.rowKey as keyof T])
})

// 获取数据
async function fetchData(extraParams?: Record<string, any>): Promise<void> {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...props.defaultParams,
      ...extraParams
    }
    const res = await props.api(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// 搜索
function search(params?: Record<string, any>): void {
  page.value = 1
  fetchData(params)
}

// 刷新
function refresh(): void {
  fetchData()
}

// 重置
function reset(): void {
  page.value = 1
  pageSize.value = 10
  fetchData()
}

// 页码变化
function handlePageChange(newPage: number): void {
  page.value = newPage
  fetchData()
}

// 每页数量变化
function handleSizeChange(newSize: number): void {
  pageSize.value = newSize
  page.value = 1
  fetchData()
}

// 选择变化
function handleSelectionChange(selection: T[]): void {
  selectedRows.value = selection
  emit('selection-change', selection)
}

// 行点击
function handleRowClick(row: T, column: any, event: Event): void {
  emit('row-click', row, column, event)
}

// 清除选择
function clearSelection(): void {
  tableRef.value?.clearSelection()
  selectedRows.value = []
}

// 序号计算
function indexMethod(index: number): number {
  return (page.value - 1) * pageSize.value + index + 1
}

// 立即加载
if (props.immediate) {
  fetchData()
}

// 暴露方法
defineExpose({
  tableData,
  loading,
  selectedRows,
  selectedKeys,
  page,
  pageSize,
  total,
  fetchData,
  search,
  refresh,
  reset,
  clearSelection,
  getTableRef: () => tableRef.value
})
</script>

<template>
  <div class="pro-table">
    <!-- 工具栏 -->
    <div v-if="slots.toolbar" class="pro-table__toolbar">
      <slot name="toolbar" :selected-rows="selectedRows" :refresh="refresh" />
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :row-key="rowKey"
      :border="border"
      :stripe="stripe"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
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
      <template v-for="column in visibleColumns" :key="column.prop || column.label">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align || 'center'"
          :sortable="column.sortable"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template #default="scope">
            <!-- 插槽 -->
            <slot
              v-if="column.slotName || slots[column.prop!]"
              :name="column.slotName || column.prop"
              :row="scope.row"
              :column="column"
              :$index="scope.$index"
            />

            <!-- 格式化 -->
            <span v-else-if="column.formatter">
              {{ column.formatter(scope.row[column.prop!], scope.row, scope.$index) }}
            </span>

            <!-- 默认 -->
            <span v-else>
              {{ scope.row[column.prop!] }}
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
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped lang="scss">
.pro-table {
  &__toolbar {
    margin-bottom: 16px;
  }

  &__pagination {
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style>
```

---

## 十、弹窗系统类型设计

### 10.1 通用弹窗组件

```vue
<!-- components/ProDialog.vue -->
<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  /** 是否显示 */
  modelValue: boolean
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: string | number
  /** 是否全屏 */
  fullscreen?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean
  /** 按ESC是否关闭 */
  closeOnPressEscape?: boolean
  /** 是否显示底部 */
  showFooter?: boolean
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认按钮加载状态 */
  confirmLoading?: boolean
  /** 关闭时销毁 */
  destroyOnClose?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '50%',
  fullscreen: false,
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showFooter: true,
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false,
  destroyOnClose: false,
  draggable: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

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

function handleConfirm(): void {
  emit('confirm')
}

function handleCancel(): void {
  emit('cancel')
  visible.value = false
}

function handleClose(): void {
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
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>

    <div class="dialog-body">
      <slot />
    </div>

    <template v-if="showFooter" #footer>
      <slot name="footer">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">
          {{ confirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
```

---

## 十一、全局类型声明

### 11.1 Vue组件类型扩展

```typescript
// types/components.d.ts
import type { DefineComponent } from 'vue'
import type BaseButton from '@/components/base/BaseButton.vue'
import type SvgIcon from '@/components/base/SvgIcon.vue'
import type ProTable from '@/components/ProTable.vue'
import type ProDialog from '@/components/ProDialog.vue'
import type DynamicForm from '@/components/DynamicForm.vue'
import type Permission from '@/components/Permission.vue'

declare module 'vue' {
  export interface GlobalComponents {
    BaseButton: typeof BaseButton
    SvgIcon: typeof SvgIcon
    ProTable: typeof ProTable
    ProDialog: typeof ProDialog
    DynamicForm: typeof DynamicForm
    Permission: typeof Permission
  }
}

export {}
```

### 11.2 全局属性类型扩展

```typescript
// types/global.d.ts
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

declare module 'vue' {
  export interface ComponentCustomProperties {
    /** 路由实例 */
    $router: Router
    /** 当前路由 */
    $route: RouteLocationNormalizedLoaded
    /** 全局过滤器 */
    $filters: {
      formatDate: (value: string | Date, format?: string) => string
      formatCurrency: (value: number, prefix?: string) => string
      formatFileSize: (bytes: number) => string
    }
  }
}

export {}
```

---

## 十二、工具函数类型设计

### 12.1 类型安全的存储工具

```typescript
// utils/storage.ts

interface StorageOptions {
  /** 存储前缀 */
  prefix?: string
  /** 过期时间（毫秒） */
  expires?: number
}

interface StorageData<T> {
  value: T
  expires?: number
}

class TypedStorage {
  private prefix: string

  constructor(prefix: string = 'app_') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    const data: StorageData<T> = {
      value,
      expires: options.expires ? Date.now() + options.expires : undefined
    }
    localStorage.setItem(this.getKey(key), JSON.stringify(data))
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    const raw = localStorage.getItem(this.getKey(key))
    if (!raw) return defaultValue

    try {
      const data: StorageData<T> = JSON.parse(raw)

      // 检查过期
      if (data.expires && Date.now() > data.expires) {
        this.remove(key)
        return defaultValue
      }

      return data.value
    } catch {
      return defaultValue
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key))
  }

  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null
  }
}

export const storage = new TypedStorage()

// Session Storage
class TypedSessionStorage {
  private prefix: string

  constructor(prefix: string = 'app_') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T): void {
    sessionStorage.setItem(this.getKey(key), JSON.stringify(value))
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    const raw = sessionStorage.getItem(this.getKey(key))
    if (!raw) return defaultValue

    try {
      return JSON.parse(raw) as T
    } catch {
      return defaultValue
    }
  }

  remove(key: string): void {
    sessionStorage.removeItem(this.getKey(key))
  }

  clear(): void {
    sessionStorage.clear()
  }
}

export const sessionStore = new TypedSessionStorage()
```

### 12.2 类型安全的事件总线

```typescript
// utils/eventBus.ts

type EventHandler<T = any> = (payload: T) => void

// 定义事件类型
interface EventMap {
  'user:login': { userId: number; timestamp: Date }
  'user:logout': void
  'notification': { type: 'success' | 'error' | 'warning'; message: string }
  'theme:change': { theme: 'light' | 'dark' }
  [key: string]: any
}

class TypedEventBus<T extends Record<string, any>> {
  private events = new Map<keyof T, Set<EventHandler>>()

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(handler)

    // 返回取消订阅函数
    return () => {
      this.off(event, handler)
    }
  }

  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const wrapper: EventHandler<T[K]> = (payload) => {
      handler(payload)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    this.events.get(event)?.delete(handler)
  }

  emit<K extends keyof T>(
    event: K,
    ...args: T[K] extends void ? [] : [T[K]]
  ): void {
    this.events.get(event)?.forEach(handler => {
      handler(args[0])
    })
  }

  clear(): void {
    this.events.clear()
  }
}

export const eventBus = new TypedEventBus<EventMap>()
```

---

## 十三、自定义指令类型化

### 13.1 指令类型定义

```typescript
// directives/types.ts
import type { Directive, DirectiveBinding } from 'vue'

// 通用指令类型
export type TypedDirective<T = any, E extends HTMLElement = HTMLElement> = Directive<E, T>

// 指令绑定类型
export type TypedBinding<T = any> = DirectiveBinding<T>

// 带元素扩展的指令
export interface DirectiveElement<T = any> extends HTMLElement {
  _directiveData?: T
}
```

### 13.2 类型化指令示例

```typescript
// directives/loading.ts
import type { Directive, DirectiveBinding } from 'vue'

interface LoadingElement extends HTMLElement {
  _loadingInstance?: {
    mask: HTMLElement
    unmount: () => void
  }
}

interface LoadingOptions {
  text?: string
  background?: string
  spinner?: string
}

type LoadingValue = boolean | LoadingOptions

const vLoading: Directive<LoadingElement, LoadingValue> = {
  mounted(el: LoadingElement, binding: DirectiveBinding<LoadingValue>) {
    const options = typeof binding.value === 'object' ? binding.value : {}
    const visible = typeof binding.value === 'boolean' ? binding.value : true

    if (visible) {
      createLoading(el, options)
    }
  },

  updated(el: LoadingElement, binding: DirectiveBinding<LoadingValue>) {
    const visible = typeof binding.value === 'boolean' ? binding.value : !!binding.value

    if (visible) {
      if (!el._loadingInstance) {
        const options = typeof binding.value === 'object' ? binding.value : {}
        createLoading(el, options)
      }
    } else {
      removeLoading(el)
    }
  },

  unmounted(el: LoadingElement) {
    removeLoading(el)
  }
}

function createLoading(el: LoadingElement, options: LoadingOptions): void {
  el.style.position = 'relative'

  const mask = document.createElement('div')
  mask.className = 'loading-mask'
  mask.innerHTML = `
    <div class="loading-spinner">
      ${options.spinner || '<div class="spinner"></div>'}
    </div>
    ${options.text ? `<div class="loading-text">${options.text}</div>` : ''}
  `

  if (options.background) {
    mask.style.backgroundColor = options.background
  }

  el.appendChild(mask)
  el._loadingInstance = {
    mask,
    unmount: () => {
      el.removeChild(mask)
    }
  }
}

function removeLoading(el: LoadingElement): void {
  if (el._loadingInstance) {
    el._loadingInstance.unmount()
    delete el._loadingInstance
  }
}

export default vLoading
```

---

## 十四、测试与类型覆盖

### 14.1 Vitest配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/types/',
        '**/*.d.ts'
      ]
    },
    typecheck: {
      tsconfig: './tsconfig.json'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### 14.2 组件测试示例

```typescript
// src/components/__tests__/BaseButton.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../base/BaseButton.vue'

describe('BaseButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: '按钮文字'
      }
    })
    expect(wrapper.text()).toContain('按钮文字')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows loading state', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    })
    expect(wrapper.find('.el-button').classes()).toContain('is-loading')
  })

  it('applies correct type class', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'primary'
      }
    })
    expect(wrapper.find('.el-button').classes()).toContain('el-button--primary')
  })
})
```

---

## 十五、工程化最佳实践

### 15.1 Vite配置

```typescript
// vite.config.ts
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
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

      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        }
      }),

      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts'
      }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
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
          rewrite: (path: string) => path.replace(/^\/api/, '')
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
            elementPlus: ['element-plus']
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

### 15.2 TypeScript配置

```json
// tsconfig.json
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
    "types": ["vite/client", "element-plus/global"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

---

以上是Vue3 + TypeScript大厂项目实战指南，涵盖了企业级项目开发中的核心类型设计和最佳实践。
