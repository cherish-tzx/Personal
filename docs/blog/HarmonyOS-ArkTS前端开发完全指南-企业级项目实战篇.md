# HarmonyOS ArkTS前端开发完全指南 - 企业级项目实战篇

> 本文档总结大厂级别企业级HarmonyOS项目开发的架构设计、最佳实践和完整示例

---
<div class="doc-toc">
## 目录

1. [企业级项目架构](#1-企业级项目架构)
2. [全局状态管理](#2-全局状态管理)
3. [主题与国际化](#3-主题与国际化)
4. [权限管理](#4-权限管理)
5. [完整项目示例](#5-完整项目示例)
6. [单元测试](#6-单元测试)
7. [发布与部署](#7-发布与部署)


</div>

---

## 1. 企业级项目架构

### 1.1 项目目录结构

```
entry/src/main/ets/
├── entryability/
│   └── EntryAbility.ets          # 应用入口Ability
│
├── pages/                         # 页面目录
│   ├── Index.ets                  # 首页
│   ├── auth/                      # 认证相关页面
│   │   ├── LoginPage.ets
│   │   ├── RegisterPage.ets
│   │   └── ForgetPasswordPage.ets
│   ├── home/                      # 首页Tab页面
│   │   ├── HomePage.ets
│   │   ├── CategoryPage.ets
│   │   ├── CartPage.ets
│   │   └── MinePage.ets
│   ├── product/                   # 商品相关页面
│   │   ├── ProductListPage.ets
│   │   ├── ProductDetailPage.ets
│   │   └── ProductSearchPage.ets
│   ├── order/                     # 订单相关页面
│   │   ├── OrderListPage.ets
│   │   ├── OrderDetailPage.ets
│   │   └── OrderConfirmPage.ets
│   └── settings/                  # 设置相关页面
│       ├── SettingsPage.ets
│       ├── ProfilePage.ets
│       └── AddressPage.ets
│
├── components/                    # 组件目录
│   ├── common/                    # 通用组件
│   │   ├── AppButton.ets
│   │   ├── AppInput.ets
│   │   ├── NavBar.ets
│   │   ├── TabBar.ets
│   │   ├── Loading.ets
│   │   ├── Empty.ets
│   │   ├── NetworkImage.ets
│   │   └── PullRefresh.ets
│   ├── business/                  # 业务组件
│   │   ├── ProductCard.ets
│   │   ├── CartItem.ets
│   │   ├── OrderItem.ets
│   │   ├── AddressItem.ets
│   │   └── CouponCard.ets
│   └── dialog/                    # 弹窗组件
│       ├── ConfirmDialog.ets
│       ├── InputDialog.ets
│       └── BottomSheet.ets
│
├── services/                      # 服务层
│   ├── api/                       # API服务
│   │   ├── index.ets              # 统一导出
│   │   ├── http.ets               # HTTP封装
│   │   ├── UserApi.ets
│   │   ├── ProductApi.ets
│   │   ├── OrderApi.ets
│   │   └── CartApi.ets
│   └── storage/                   # 存储服务
│       ├── PreferencesService.ets
│       └── DatabaseService.ets
│
├── stores/                        # 状态管理
│   ├── index.ets
│   ├── UserStore.ets
│   ├── CartStore.ets
│   └── SettingsStore.ets
│
├── models/                        # 数据模型
│   ├── User.ets
│   ├── Product.ets
│   ├── Order.ets
│   ├── Cart.ets
│   └── Address.ets
│
├── utils/                         # 工具函数
│   ├── index.ets
│   ├── DateUtil.ets
│   ├── StringUtil.ets
│   ├── ValidatorUtil.ets
│   ├── RouterUtil.ets
│   └── PermissionUtil.ets
│
├── constants/                     # 常量定义
│   ├── index.ets
│   ├── ApiConstants.ets
│   ├── StorageKeys.ets
│   └── RouteNames.ets
│
├── types/                         # 类型定义
│   ├── index.ets
│   ├── api.d.ets
│   └── common.d.ets
│
└── config/                        # 配置文件
    ├── index.ets
    └── env.ets
```

### 1.2 环境配置

```typescript
// ============ config/env.ets ============
// 环境配置

export enum Environment {
  Development = 'development',
  Testing = 'testing',
  Production = 'production'
}

interface IEnvConfig {
  env: Environment
  apiBaseUrl: string
  imageBaseUrl: string
  enableLog: boolean
  enableMock: boolean
}

const devConfig: IEnvConfig = {
  env: Environment.Development,
  apiBaseUrl: 'https://dev-api.example.com',
  imageBaseUrl: 'https://dev-cdn.example.com',
  enableLog: true,
  enableMock: true
}

const testConfig: IEnvConfig = {
  env: Environment.Testing,
  apiBaseUrl: 'https://test-api.example.com',
  imageBaseUrl: 'https://test-cdn.example.com',
  enableLog: true,
  enableMock: false
}

const prodConfig: IEnvConfig = {
  env: Environment.Production,
  apiBaseUrl: 'https://api.example.com',
  imageBaseUrl: 'https://cdn.example.com',
  enableLog: false,
  enableMock: false
}

// 根据构建配置选择环境
const currentEnv: Environment = Environment.Development  // 打包时修改

export const envConfig: IEnvConfig = (() => {
  switch (currentEnv) {
    case Environment.Development:
      return devConfig
    case Environment.Testing:
      return testConfig
    case Environment.Production:
      return prodConfig
    default:
      return devConfig
  }
})()
```

### 1.3 应用入口配置

```typescript
// ============ entryability/EntryAbility.ets ============
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit'
import { hilog } from '@kit.PerformanceAnalysisKit'
import { window } from '@kit.ArkUI'

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'AppLifecycle', 'Ability onCreate')
    
    // 初始化全局服务
    this.initGlobalServices()
  }

  onDestroy(): void {
    hilog.info(0x0000, 'AppLifecycle', 'Ability onDestroy')
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    hilog.info(0x0000, 'AppLifecycle', 'Ability onWindowStageCreate')

    // 设置状态栏
    windowStage.getMainWindow().then((win) => {
      win.setWindowLayoutFullScreen(true)
      win.setWindowSystemBarProperties({
        statusBarColor: '#FFFFFF',
        statusBarContentColor: '#000000'
      })
    })

    // 加载首页
    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'AppLifecycle', 'Failed to load content: %{public}s', JSON.stringify(err))
        return
      }
      hilog.info(0x0000, 'AppLifecycle', 'Succeeded in loading content')
    })
  }

  onWindowStageDestroy(): void {
    hilog.info(0x0000, 'AppLifecycle', 'Ability onWindowStageDestroy')
  }

  onForeground(): void {
    hilog.info(0x0000, 'AppLifecycle', 'Ability onForeground')
    // 应用切到前台，可以刷新数据
  }

  onBackground(): void {
    hilog.info(0x0000, 'AppLifecycle', 'Ability onBackground')
    // 应用切到后台，可以保存数据
  }

  private initGlobalServices(): void {
    // 初始化Preferences
    // PreferencesService.init(this.context)
    
    // 初始化数据库
    // DatabaseService.init(this.context)
    
    // 初始化用户状态
    // UserStore.getInstance().init()
  }
}
```

---

## 2. 全局状态管理

### 2.1 状态管理架构

```typescript
// ============ stores/BaseStore.ets ============
// 状态管理基类

export abstract class BaseStore {
  private listeners: Set<Function> = new Set()

  // 订阅状态变化
  subscribe(listener: Function): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // 通知所有订阅者
  protected notify(): void {
    this.listeners.forEach(listener => listener())
  }
}

// ============ stores/UserStore.ets ============
// 用户状态管理

import { BaseStore } from './BaseStore'

export interface IUserState {
  isLoggedIn: boolean
  token: string
  user: IUser | null
}

export interface IUser {
  id: string
  username: string
  nickname: string
  avatar: string
  phone: string
  email: string
}

class UserStoreClass extends BaseStore {
  private static instance: UserStoreClass | null = null
  private state: IUserState = {
    isLoggedIn: false,
    token: '',
    user: null
  }

  private constructor() {
    super()
  }

  static getInstance(): UserStoreClass {
    if (!UserStoreClass.instance) {
      UserStoreClass.instance = new UserStoreClass()
    }
    return UserStoreClass.instance
  }

  // 初始化（从本地存储恢复）
  async init(): Promise<void> {
    // const token = await PreferencesService.getString('token')
    // const userJson = await PreferencesService.getString('user')
    // if (token && userJson) {
    //   this.state.token = token
    //   this.state.user = JSON.parse(userJson)
    //   this.state.isLoggedIn = true
    //   this.notify()
    // }
  }

  // 获取状态
  getState(): IUserState {
    return { ...this.state }
  }

  // 登录
  async login(token: string, user: IUser): Promise<void> {
    this.state.token = token
    this.state.user = user
    this.state.isLoggedIn = true
    
    // 持久化存储
    // await PreferencesService.setString('token', token)
    // await PreferencesService.setString('user', JSON.stringify(user))
    
    this.notify()
  }

  // 登出
  async logout(): Promise<void> {
    this.state.token = ''
    this.state.user = null
    this.state.isLoggedIn = false
    
    // 清除存储
    // await PreferencesService.remove('token')
    // await PreferencesService.remove('user')
    
    this.notify()
  }

  // 更新用户信息
  updateUser(user: Partial<IUser>): void {
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...user }
      // PreferencesService.setString('user', JSON.stringify(this.state.user))
      this.notify()
    }
  }

  // 检查是否登录
  isLoggedIn(): boolean {
    return this.state.isLoggedIn
  }

  // 获取Token
  getToken(): string {
    return this.state.token
  }
}

export const UserStore = UserStoreClass.getInstance()

// ============ stores/CartStore.ets ============
// 购物车状态管理

import { BaseStore } from './BaseStore'

export interface ICartItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  selected: boolean
  specs?: string
}

class CartStoreClass extends BaseStore {
  private static instance: CartStoreClass | null = null
  private items: ICartItem[] = []

  private constructor() {
    super()
  }

  static getInstance(): CartStoreClass {
    if (!CartStoreClass.instance) {
      CartStoreClass.instance = new CartStoreClass()
    }
    return CartStoreClass.instance
  }

  // 获取购物车列表
  getItems(): ICartItem[] {
    return [...this.items]
  }

  // 获取购物车数量
  getCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  // 获取选中商品
  getSelectedItems(): ICartItem[] {
    return this.items.filter(item => item.selected)
  }

  // 获取选中商品总价
  getSelectedTotal(): number {
    return this.getSelectedItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  }

  // 添加商品
  addItem(item: Omit<ICartItem, 'selected'>): void {
    const existingIndex = this.items.findIndex(
      i => i.productId === item.productId && i.specs === item.specs
    )

    if (existingIndex >= 0) {
      this.items[existingIndex].quantity += item.quantity
    } else {
      this.items.push({ ...item, selected: true })
    }
    
    this.notify()
  }

  // 更新数量
  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(i => i.productId === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      this.notify()
    }
  }

  // 更新选中状态
  updateSelected(productId: string, selected: boolean): void {
    const item = this.items.find(i => i.productId === productId)
    if (item) {
      item.selected = selected
      this.notify()
    }
  }

  // 全选/取消全选
  selectAll(selected: boolean): void {
    this.items.forEach(item => {
      item.selected = selected
    })
    this.notify()
  }

  // 删除商品
  removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId)
    this.notify()
  }

  // 删除选中商品
  removeSelected(): void {
    this.items = this.items.filter(i => !i.selected)
    this.notify()
  }

  // 清空购物车
  clear(): void {
    this.items = []
    this.notify()
  }
}

export const CartStore = CartStoreClass.getInstance()

// ============ stores/SettingsStore.ets ============
// 设置状态管理

import { BaseStore } from './BaseStore'

export interface ISettings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
  autoUpdate: boolean
}

class SettingsStoreClass extends BaseStore {
  private static instance: SettingsStoreClass | null = null
  private settings: ISettings = {
    theme: 'system',
    language: 'zh-CN',
    fontSize: 'medium',
    notifications: true,
    autoUpdate: true
  }

  private constructor() {
    super()
  }

  static getInstance(): SettingsStoreClass {
    if (!SettingsStoreClass.instance) {
      SettingsStoreClass.instance = new SettingsStoreClass()
    }
    return SettingsStoreClass.instance
  }

  getSettings(): ISettings {
    return { ...this.settings }
  }

  updateSettings(newSettings: Partial<ISettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    // PreferencesService.setString('settings', JSON.stringify(this.settings))
    this.notify()
  }
}

export const SettingsStore = SettingsStoreClass.getInstance()
```

### 2.2 在组件中使用状态

```typescript
// 使用@Provide/@Consume实现全局状态注入
@Entry
@Component
struct App {
  @Provide('userStore') userState: IUserState = UserStore.getState()
  @Provide('cartCount') cartCount: number = CartStore.getCount()
  
  aboutToAppear(): void {
    // 订阅状态变化
    UserStore.subscribe(() => {
      this.userState = UserStore.getState()
    })
    
    CartStore.subscribe(() => {
      this.cartCount = CartStore.getCount()
    })
  }

  build() {
    // 主界面...
    Column() {
      MainTabs()
    }
  }
}

// 子组件中使用
@Component
struct HeaderComponent {
  @Consume('userStore') userState: IUserState
  @Consume('cartCount') cartCount: number

  build() {
    Row() {
      if (this.userState.isLoggedIn) {
        Text(`欢迎, ${this.userState.user?.nickname}`)
      } else {
        Text('请登录')
      }
      
      Badge({
        count: this.cartCount,
        position: BadgePosition.RightTop
      }) {
        Image($r('app.media.ic_cart'))
          .width(24)
          .height(24)
      }
    }
  }
}
```

---

## 3. 主题与国际化

### 3.1 主题系统

```typescript
// ============ config/theme.ets ============
// 主题配置

export interface ITheme {
  // 颜色
  primaryColor: ResourceColor
  secondaryColor: ResourceColor
  backgroundColor: ResourceColor
  surfaceColor: ResourceColor
  errorColor: ResourceColor
  
  // 文字颜色
  textPrimary: ResourceColor
  textSecondary: ResourceColor
  textHint: ResourceColor
  textDisabled: ResourceColor
  
  // 边框
  borderColor: ResourceColor
  dividerColor: ResourceColor
  
  // 状态栏
  statusBarColor: string
  statusBarContentColor: string
}

export const lightTheme: ITheme = {
  primaryColor: '#007AFF',
  secondaryColor: '#5856D6',
  backgroundColor: '#F5F5F5',
  surfaceColor: '#FFFFFF',
  errorColor: '#FF3B30',
  
  textPrimary: '#333333',
  textSecondary: '#666666',
  textHint: '#999999',
  textDisabled: '#CCCCCC',
  
  borderColor: '#EEEEEE',
  dividerColor: '#F0F0F0',
  
  statusBarColor: '#FFFFFF',
  statusBarContentColor: '#000000'
}

export const darkTheme: ITheme = {
  primaryColor: '#0A84FF',
  secondaryColor: '#5E5CE6',
  backgroundColor: '#000000',
  surfaceColor: '#1C1C1E',
  errorColor: '#FF453A',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textHint: '#8E8E93',
  textDisabled: '#48484A',
  
  borderColor: '#38383A',
  dividerColor: '#2C2C2E',
  
  statusBarColor: '#000000',
  statusBarContentColor: '#FFFFFF'
}

// 主题管理器
class ThemeManager {
  private static instance: ThemeManager | null = null
  private currentTheme: ITheme = lightTheme
  private listeners: Set<Function> = new Set()

  private constructor() {}

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  getTheme(): ITheme {
    return this.currentTheme
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme === 'dark' ? darkTheme : lightTheme
    this.notify()
  }

  subscribe(listener: Function): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(listener => listener())
  }
}

export const themeManager = ThemeManager.getInstance()
```

### 3.2 国际化

```typescript
// ============ config/i18n.ets ============
// 国际化配置

type LocaleKey = 'zh-CN' | 'en-US'

interface ILocaleMessages {
  // 通用
  common: {
    confirm: string
    cancel: string
    save: string
    delete: string
    edit: string
    loading: string
    success: string
    failed: string
    retry: string
    noData: string
    noMore: string
  }
  // 认证
  auth: {
    login: string
    logout: string
    register: string
    username: string
    password: string
    phone: string
    verifyCode: string
    forgotPassword: string
    loginSuccess: string
    logoutConfirm: string
  }
  // 首页
  home: {
    title: string
    search: string
    category: string
    recommend: string
    hotSale: string
  }
  // 购物车
  cart: {
    title: string
    empty: string
    selectAll: string
    total: string
    checkout: string
    deleteConfirm: string
  }
  // 我的
  mine: {
    title: string
    orders: string
    favorites: string
    address: string
    settings: string
    help: string
    about: string
  }
}

const zhCN: ILocaleMessages = {
  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    loading: '加载中...',
    success: '操作成功',
    failed: '操作失败',
    retry: '重试',
    noData: '暂无数据',
    noMore: '没有更多了'
  },
  auth: {
    login: '登录',
    logout: '退出登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    phone: '手机号',
    verifyCode: '验证码',
    forgotPassword: '忘记密码',
    loginSuccess: '登录成功',
    logoutConfirm: '确定要退出登录吗？'
  },
  home: {
    title: '首页',
    search: '搜索商品',
    category: '分类',
    recommend: '为你推荐',
    hotSale: '热销商品'
  },
  cart: {
    title: '购物车',
    empty: '购物车是空的',
    selectAll: '全选',
    total: '合计',
    checkout: '去结算',
    deleteConfirm: '确定要删除选中的商品吗？'
  },
  mine: {
    title: '我的',
    orders: '我的订单',
    favorites: '我的收藏',
    address: '收货地址',
    settings: '设置',
    help: '帮助中心',
    about: '关于我们'
  }
}

const enUS: ILocaleMessages = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    success: 'Success',
    failed: 'Failed',
    retry: 'Retry',
    noData: 'No Data',
    noMore: 'No More'
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    phone: 'Phone',
    verifyCode: 'Verify Code',
    forgotPassword: 'Forgot Password',
    loginSuccess: 'Login Success',
    logoutConfirm: 'Are you sure to logout?'
  },
  home: {
    title: 'Home',
    search: 'Search products',
    category: 'Category',
    recommend: 'Recommend',
    hotSale: 'Hot Sale'
  },
  cart: {
    title: 'Cart',
    empty: 'Cart is empty',
    selectAll: 'Select All',
    total: 'Total',
    checkout: 'Checkout',
    deleteConfirm: 'Are you sure to delete selected items?'
  },
  mine: {
    title: 'Mine',
    orders: 'My Orders',
    favorites: 'Favorites',
    address: 'Address',
    settings: 'Settings',
    help: 'Help',
    about: 'About'
  }
}

// 国际化管理器
class I18n {
  private static instance: I18n | null = null
  private locale: LocaleKey = 'zh-CN'
  private messages: Record<LocaleKey, ILocaleMessages> = {
    'zh-CN': zhCN,
    'en-US': enUS
  }
  private listeners: Set<Function> = new Set()

  private constructor() {}

  static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n()
    }
    return I18n.instance
  }

  setLocale(locale: LocaleKey): void {
    this.locale = locale
    this.notify()
  }

  getLocale(): LocaleKey {
    return this.locale
  }

  t(key: string): string {
    const keys = key.split('.')
    let result: any = this.messages[this.locale]
    
    for (const k of keys) {
      result = result?.[k]
    }
    
    return result || key
  }

  subscribe(listener: Function): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(listener => listener())
  }
}

export const i18n = I18n.getInstance()

// 使用示例
// i18n.t('common.confirm')  // 返回 '确定' 或 'Confirm'
// i18n.t('cart.title')      // 返回 '购物车' 或 'Cart'
```

---

## 4. 权限管理

### 4.1 权限工具类

```typescript
// ============ utils/PermissionUtil.ets ============
import { abilityAccessCtrl, bundleManager, Permissions } from '@kit.AbilityKit'
import { common } from '@kit.AbilityKit'

class PermissionUtil {
  // 检查单个权限
  static async checkPermission(permission: Permissions): Promise<boolean> {
    const atManager = abilityAccessCtrl.createAtManager()
    const bundleInfo = await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION)
    const tokenId = bundleInfo.appInfo.accessTokenId

    const grantStatus = await atManager.checkAccessToken(tokenId, permission)
    return grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED
  }

  // 检查多个权限
  static async checkPermissions(permissions: Permissions[]): Promise<Map<Permissions, boolean>> {
    const result = new Map<Permissions, boolean>()
    
    for (const permission of permissions) {
      result.set(permission, await this.checkPermission(permission))
    }
    
    return result
  }

  // 请求权限
  static async requestPermissions(
    context: common.UIAbilityContext,
    permissions: Permissions[]
  ): Promise<boolean> {
    const atManager = abilityAccessCtrl.createAtManager()

    try {
      const result = await atManager.requestPermissionsFromUser(context, permissions)
      
      // 检查是否所有权限都被授予
      return result.authResults.every(
        status => status === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED
      )
    } catch (error) {
      console.error('请求权限失败', error)
      return false
    }
  }

  // 请求相机权限
  static async requestCameraPermission(context: common.UIAbilityContext): Promise<boolean> {
    return this.requestPermissions(context, ['ohos.permission.CAMERA'])
  }

  // 请求存储权限
  static async requestStoragePermission(context: common.UIAbilityContext): Promise<boolean> {
    return this.requestPermissions(context, [
      'ohos.permission.READ_MEDIA',
      'ohos.permission.WRITE_MEDIA'
    ])
  }

  // 请求位置权限
  static async requestLocationPermission(context: common.UIAbilityContext): Promise<boolean> {
    return this.requestPermissions(context, [
      'ohos.permission.LOCATION',
      'ohos.permission.APPROXIMATELY_LOCATION'
    ])
  }

  // 跳转到应用设置页面
  static async openAppSettings(context: common.UIAbilityContext): Promise<void> {
    const want = {
      bundleName: 'com.ohos.settings',
      abilityName: 'com.ohos.settings.MainAbility',
      uri: 'application_info_entry',
      parameters: {
        pushParams: context.abilityInfo.bundleName
      }
    }
    await context.startAbility(want)
  }
}

export { PermissionUtil }

// 使用示例
@Entry
@Component
struct PermissionDemo {
  private context = getContext(this) as common.UIAbilityContext

  async requestCamera(): Promise<void> {
    const hasPermission = await PermissionUtil.checkPermission('ohos.permission.CAMERA')
    
    if (hasPermission) {
      // 已有权限，直接使用
      this.openCamera()
    } else {
      // 请求权限
      const granted = await PermissionUtil.requestCameraPermission(this.context)
      if (granted) {
        this.openCamera()
      } else {
        // 权限被拒绝，提示用户
        AlertDialog.show({
          title: '需要相机权限',
          message: '请在设置中开启相机权限',
          primaryButton: {
            value: '取消',
            action: () => {}
          },
          secondaryButton: {
            value: '去设置',
            action: () => {
              PermissionUtil.openAppSettings(this.context)
            }
          }
        })
      }
    }
  }

  openCamera(): void {
    // 打开相机
  }

  build() {
    Column() {
      Button('拍照')
        .onClick(() => this.requestCamera())
    }
  }
}
```

---

## 5. 完整项目示例

### 5.1 主入口页面

```typescript
// ============ pages/Index.ets ============
// 主入口页面 - 底部Tab导航

import { router } from '@kit.ArkUI'

@Entry
@Component
struct Index {
  @State currentIndex: number = 0
  @Provide('theme') theme: ITheme = lightTheme
  @Provide('userState') userState: IUserState = UserStore.getState()
  
  private tabController: TabsController = new TabsController()

  aboutToAppear(): void {
    // 订阅用户状态
    UserStore.subscribe(() => {
      this.userState = UserStore.getState()
    })
  }

  @Builder
  tabBuilder(title: string, normalIcon: Resource, selectedIcon: Resource, index: number) {
    Column() {
      Image(this.currentIndex === index ? selectedIcon : normalIcon)
        .width(24)
        .height(24)
        .fillColor(this.currentIndex === index ? this.theme.primaryColor : this.theme.textHint)
      Text(title)
        .fontSize(10)
        .fontColor(this.currentIndex === index ? this.theme.primaryColor : this.theme.textHint)
        .margin({ top: 4 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.End, controller: this.tabController }) {
        TabContent() {
          HomePage()
        }
        .tabBar(this.tabBuilder('首页', $r('app.media.ic_home'), $r('app.media.ic_home_selected'), 0))

        TabContent() {
          CategoryPage()
        }
        .tabBar(this.tabBuilder('分类', $r('app.media.ic_category'), $r('app.media.ic_category_selected'), 1))

        TabContent() {
          CartPage()
        }
        .tabBar(this.tabBuilder('购物车', $r('app.media.ic_cart'), $r('app.media.ic_cart_selected'), 2))

        TabContent() {
          MinePage()
        }
        .tabBar(this.tabBuilder('我的', $r('app.media.ic_mine'), $r('app.media.ic_mine_selected'), 3))
      }
      .barHeight(60)
      .barMode(BarMode.Fixed)
      .onChange((index: number) => {
        this.currentIndex = index
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.theme.backgroundColor)
  }
}

interface ITheme {
  primaryColor: ResourceColor
  textHint: ResourceColor
  backgroundColor: ResourceColor
}

const lightTheme: ITheme = {
  primaryColor: '#007AFF',
  textHint: '#999999',
  backgroundColor: '#F5F5F5'
}

interface IUserState {
  isLoggedIn: boolean
  user: object | null
}

const UserStore = {
  getState: () => ({ isLoggedIn: false, user: null }),
  subscribe: (fn: Function) => fn
}

@Component
struct HomePage {
  build() {
    Column() { Text('首页') }
  }
}

@Component
struct CategoryPage {
  build() {
    Column() { Text('分类') }
  }
}

@Component
struct CartPage {
  build() {
    Column() { Text('购物车') }
  }
}

@Component
struct MinePage {
  build() {
    Column() { Text('我的') }
  }
}
```

### 5.2 首页实现

```typescript
// ============ pages/home/HomePage.ets ============

@Component
export struct HomePage {
  @State banners: IBanner[] = []
  @State categories: ICategory[] = []
  @State recommendProducts: IProduct[] = []
  @State isRefreshing: boolean = false
  @Consume('theme') theme: ITheme

  aboutToAppear(): void {
    this.loadData()
  }

  async loadData(): Promise<void> {
    // 并行加载数据
    // const [banners, categories, products] = await Promise.all([
    //   HomeApi.getBanners(),
    //   HomeApi.getCategories(),
    //   HomeApi.getRecommendProducts()
    // ])
    // this.banners = banners
    // this.categories = categories
    // this.recommendProducts = products
  }

  async onRefresh(): Promise<void> {
    this.isRefreshing = true
    await this.loadData()
    this.isRefreshing = false
  }

  @Builder
  searchBarBuilder() {
    Row() {
      Row({ space: 8 }) {
        Image($r('app.media.ic_search'))
          .width(20)
          .height(20)
          .fillColor('#999999')
        Text('搜索商品')
          .fontSize(14)
          .fontColor('#999999')
      }
      .layoutWeight(1)
      .height(36)
      .backgroundColor('#F5F5F5')
      .borderRadius(18)
      .padding({ left: 12, right: 12 })
      .onClick(() => {
        // router.pushUrl({ url: 'pages/product/ProductSearchPage' })
      })

      Image($r('app.media.ic_message'))
        .width(24)
        .height(24)
        .margin({ left: 12 })
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
  }

  @Builder
  bannerBuilder() {
    if (this.banners.length > 0) {
      Swiper() {
        ForEach(this.banners, (banner: IBanner) => {
          Image(banner.imageUrl)
            .width('100%')
            .height('100%')
            .objectFit(ImageFit.Cover)
            .borderRadius(8)
            .onClick(() => {
              // 处理Banner点击
            })
        })
      }
      .width('100%')
      .height(160)
      .autoPlay(true)
      .interval(4000)
      .indicatorStyle({
        selectedColor: '#007AFF',
        color: 'rgba(255,255,255,0.5)'
      })
      .margin(16)
    }
  }

  @Builder
  categoryGridBuilder() {
    Grid() {
      ForEach(this.categories, (category: ICategory) => {
        GridItem() {
          Column({ space: 8 }) {
            Image(category.icon)
              .width(40)
              .height(40)
            Text(category.name)
              .fontSize(12)
              .fontColor('#333333')
          }
          .onClick(() => {
            // router.pushUrl({
            //   url: 'pages/product/ProductListPage',
            //   params: { categoryId: category.id }
            // })
          })
        }
      })
    }
    .columnsTemplate('1fr 1fr 1fr 1fr 1fr')
    .rowsGap(16)
    .padding(16)
    .backgroundColor('#FFFFFF')
    .margin({ top: 8 })
  }

  @Builder
  recommendBuilder() {
    Column() {
      // 标题
      Row() {
        Text('为你推荐')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
        Blank()
        Text('更多')
          .fontSize(14)
          .fontColor('#999999')
          .onClick(() => {
            // router.pushUrl({ url: 'pages/product/ProductListPage' })
          })
      }
      .width('100%')
      .padding(16)

      // 商品网格
      Grid() {
        ForEach(this.recommendProducts, (product: IProduct) => {
          GridItem() {
            ProductCard({ product: product })
          }
        })
      }
      .columnsTemplate('1fr 1fr')
      .columnsGap(8)
      .rowsGap(8)
      .padding({ left: 8, right: 8 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ top: 8 })
  }

  build() {
    Column() {
      this.searchBarBuilder()

      Refresh({ refreshing: $$this.isRefreshing }) {
        Scroll() {
          Column() {
            this.bannerBuilder()
            this.categoryGridBuilder()
            this.recommendBuilder()
          }
        }
        .width('100%')
        .scrollBar(BarState.Off)
      }
      .onRefreshing(() => {
        this.onRefresh()
      })
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}

// 商品卡片组件
@Component
struct ProductCard {
  @Prop product: IProduct = {} as IProduct

  build() {
    Column() {
      Image(this.product.image)
        .width('100%')
        .aspectRatio(1)
        .objectFit(ImageFit.Cover)
        .borderRadius({ topLeft: 8, topRight: 8 })

      Column({ space: 4 }) {
        Text(this.product.name)
          .fontSize(14)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Row() {
          Text(`¥${this.product.price}`)
            .fontSize(16)
            .fontColor('#FF3B30')
            .fontWeight(FontWeight.Bold)

          if (this.product.originalPrice && this.product.originalPrice > this.product.price) {
            Text(`¥${this.product.originalPrice}`)
              .fontSize(12)
              .fontColor('#999999')
              .decoration({ type: TextDecorationType.LineThrough })
              .margin({ left: 4 })
          }
        }

        Text(`已售${this.product.salesCount}`)
          .fontSize(12)
          .fontColor('#999999')
      }
      .width('100%')
      .padding(8)
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(8)
    .onClick(() => {
      // router.pushUrl({
      //   url: 'pages/product/ProductDetailPage',
      //   params: { productId: this.product.id }
      // })
    })
  }
}

interface IBanner {
  id: string
  imageUrl: string
  linkUrl?: string
}

interface ICategory {
  id: string
  name: string
  icon: string
}

interface IProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  salesCount: number
}

interface ITheme {
  primaryColor: ResourceColor
}
```

### 5.3 购物车页面

```typescript
// ============ pages/home/CartPage.ets ============

@Component
export struct CartPage {
  @State cartItems: ICartItemView[] = []
  @State isAllSelected: boolean = true
  @State isEditing: boolean = false
  @Consume('theme') theme: ITheme

  aboutToAppear(): void {
    this.loadCart()
    
    // 订阅购物车变化
    CartStore.subscribe(() => {
      this.loadCart()
    })
  }

  loadCart(): void {
    const items = CartStore.getItems()
    this.cartItems = items.map(item => ({
      ...item,
      // 可以在这里补充商品详情
    }))
    this.updateAllSelectedState()
  }

  updateAllSelectedState(): void {
    this.isAllSelected = this.cartItems.length > 0 && 
      this.cartItems.every(item => item.selected)
  }

  toggleSelectAll(): void {
    this.isAllSelected = !this.isAllSelected
    CartStore.selectAll(this.isAllSelected)
  }

  get totalPrice(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  get selectedCount(): number {
    return this.cartItems.filter(item => item.selected).length
  }

  handleCheckout(): void {
    if (this.selectedCount === 0) {
      // Toast提示
      return
    }
    // 跳转到结算页
    // router.pushUrl({ url: 'pages/order/OrderConfirmPage' })
  }

  handleDeleteSelected(): void {
    if (this.selectedCount === 0) return

    AlertDialog.show({
      title: '确认删除',
      message: `确定要删除选中的${this.selectedCount}件商品吗？`,
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '删除',
        fontColor: '#FF3B30',
        action: () => {
          CartStore.removeSelected()
        }
      }
    })
  }

  @Builder
  emptyBuilder() {
    Column({ space: 16 }) {
      Image($r('app.media.ic_cart_empty'))
        .width(120)
        .height(120)
      Text('购物车是空的')
        .fontSize(16)
        .fontColor('#999999')
      Button('去逛逛')
        .backgroundColor('#007AFF')
        .onClick(() => {
          // 切换到首页
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  cartItemBuilder(item: ICartItemView, index: number) {
    Row({ space: 12 }) {
      // 选择框
      Toggle({ type: ToggleType.Checkbox, isOn: item.selected })
        .selectedColor('#007AFF')
        .onChange((isOn) => {
          CartStore.updateSelected(item.productId, isOn)
        })

      // 商品图片
      Image(item.productImage)
        .width(80)
        .height(80)
        .borderRadius(8)

      // 商品信息
      Column({ space: 4 }) {
        Text(item.productName)
          .fontSize(14)
          .maxLines(2)

        if (item.specs) {
          Text(item.specs)
            .fontSize(12)
            .fontColor('#999999')
        }

        Row() {
          Text(`¥${item.price}`)
            .fontSize(16)
            .fontColor('#FF3B30')
            .fontWeight(FontWeight.Bold)

          Blank()

          // 数量控制
          Row() {
            Button('-')
              .width(28)
              .height(28)
              .fontSize(16)
              .backgroundColor('#F5F5F5')
              .fontColor('#333333')
              .onClick(() => {
                if (item.quantity > 1) {
                  CartStore.updateQuantity(item.productId, item.quantity - 1)
                }
              })

            Text(`${item.quantity}`)
              .width(40)
              .textAlign(TextAlign.Center)
              .fontSize(14)

            Button('+')
              .width(28)
              .height(28)
              .fontSize(16)
              .backgroundColor('#F5F5F5')
              .fontColor('#333333')
              .onClick(() => {
                CartStore.updateQuantity(item.productId, item.quantity + 1)
              })
          }
        }
        .width('100%')
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
  }

  @Builder
  bottomBarBuilder() {
    Row() {
      // 全选
      Row({ space: 8 }) {
        Toggle({ type: ToggleType.Checkbox, isOn: this.isAllSelected })
          .selectedColor('#007AFF')
          .onChange(() => {
            this.toggleSelectAll()
          })
        Text('全选')
          .fontSize(14)
      }

      Blank()

      if (this.isEditing) {
        // 编辑模式
        Button('删除')
          .backgroundColor('#FF3B30')
          .enabled(this.selectedCount > 0)
          .onClick(() => this.handleDeleteSelected())
      } else {
        // 正常模式
        Row({ space: 8 }) {
          Column() {
            Text('合计:')
              .fontSize(12)
              .fontColor('#666666')
            Text(`¥${this.totalPrice.toFixed(2)}`)
              .fontSize(18)
              .fontColor('#FF3B30')
              .fontWeight(FontWeight.Bold)
          }
          .alignItems(HorizontalAlign.End)

          Button(`结算(${this.selectedCount})`)
            .backgroundColor('#FF3B30')
            .enabled(this.selectedCount > 0)
            .onClick(() => this.handleCheckout())
        }
      }
    }
    .width('100%')
    .height(60)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
    .border({ width: { top: 1 }, color: '#EEEEEE' })
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('购物车')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)

        Blank()

        Text(this.isEditing ? '完成' : '编辑')
          .fontSize(14)
          .fontColor('#007AFF')
          .onClick(() => {
            this.isEditing = !this.isEditing
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#FFFFFF')

      if (this.cartItems.length === 0) {
        this.emptyBuilder()
      } else {
        // 购物车列表
        List({ space: 8 }) {
          ForEach(this.cartItems, (item: ICartItemView, index: number) => {
            ListItem() {
              this.cartItemBuilder(item, index)
            }
          })
        }
        .width('100%')
        .layoutWeight(1)
        .padding(8)

        // 底部栏
        this.bottomBarBuilder()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}

interface ICartItemView {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  selected: boolean
  specs?: string
}

interface ITheme {
  primaryColor: ResourceColor
}

const CartStore = {
  getItems: () => [] as ICartItemView[],
  subscribe: (fn: Function) => fn,
  selectAll: (selected: boolean) => {},
  updateSelected: (productId: string, selected: boolean) => {},
  updateQuantity: (productId: string, quantity: number) => {},
  removeSelected: () => {}
}
```

---

## 6. 单元测试

### 6.1 测试框架配置

```typescript
// ============ test/utils/StringUtil.test.ets ============
import { describe, it, expect } from '@ohos/hypium'
import { StringUtil } from '../../utils/StringUtil'

export default function StringUtilTest() {
  describe('StringUtil', () => {
    describe('isEmpty', () => {
      it('should return true for null', () => {
        expect(StringUtil.isEmpty(null)).assertTrue()
      })

      it('should return true for undefined', () => {
        expect(StringUtil.isEmpty(undefined)).assertTrue()
      })

      it('should return true for empty string', () => {
        expect(StringUtil.isEmpty('')).assertTrue()
      })

      it('should return true for whitespace string', () => {
        expect(StringUtil.isEmpty('   ')).assertTrue()
      })

      it('should return false for non-empty string', () => {
        expect(StringUtil.isEmpty('hello')).assertFalse()
      })
    })

    describe('formatPhone', () => {
      it('should format phone number correctly', () => {
        expect(StringUtil.formatPhone('13800138000')).assertEqual('138****8000')
      })
    })

    describe('truncate', () => {
      it('should truncate long string', () => {
        expect(StringUtil.truncate('hello world', 5)).assertEqual('hello...')
      })

      it('should not truncate short string', () => {
        expect(StringUtil.truncate('hi', 5)).assertEqual('hi')
      })
    })
  })
}

// ============ test/stores/CartStore.test.ets ============
import { describe, it, expect, beforeEach } from '@ohos/hypium'

export default function CartStoreTest() {
  describe('CartStore', () => {
    beforeEach(() => {
      // 重置购物车状态
      // CartStore.clear()
    })

    describe('addItem', () => {
      it('should add new item to cart', () => {
        const item = {
          productId: '1',
          productName: '商品1',
          productImage: 'image.jpg',
          price: 100,
          quantity: 1
        }
        
        // CartStore.addItem(item)
        // expect(CartStore.getCount()).assertEqual(1)
      })

      it('should increase quantity for existing item', () => {
        const item = {
          productId: '1',
          productName: '商品1',
          productImage: 'image.jpg',
          price: 100,
          quantity: 1
        }
        
        // CartStore.addItem(item)
        // CartStore.addItem(item)
        // expect(CartStore.getCount()).assertEqual(2)
      })
    })

    describe('getSelectedTotal', () => {
      it('should calculate total correctly', () => {
        // CartStore.addItem({ productId: '1', price: 100, quantity: 2 })
        // CartStore.addItem({ productId: '2', price: 50, quantity: 1 })
        // expect(CartStore.getSelectedTotal()).assertEqual(250)
      })
    })
  })
}
```

---

## 7. 发布与部署

### 7.1 应用签名配置

```json
// build-profile.json5
{
  "app": {
    "signingConfigs": [
      {
        "name": "default",
        "type": "HarmonyOS",
        "material": {
          "certpath": "C:/Users/xxx/.ohos/config/default_HarmonyOS_xxx.cer",
          "storePassword": "xxx",
          "keyAlias": "debugKey",
          "keyPassword": "xxx",
          "profile": "C:/Users/xxx/.ohos/config/default_HarmonyOS_xxx.p7b",
          "signAlg": "SHA256withECDSA",
          "storeFile": "C:/Users/xxx/.ohos/config/default_HarmonyOS_xxx.p12"
        }
      },
      {
        "name": "release",
        "type": "HarmonyOS",
        "material": {
          "certpath": "release/certificate.cer",
          "storePassword": "xxx",
          "keyAlias": "releaseKey",
          "keyPassword": "xxx",
          "profile": "release/profile.p7b",
          "signAlg": "SHA256withECDSA",
          "storeFile": "release/keystore.p12"
        }
      }
    ],
    "products": [
      {
        "name": "default",
        "signingConfig": "default",
        "compileSdkVersion": 12,
        "compatibleSdkVersion": 12
      }
    ]
  }
}
```

### 7.2 发布清单

```markdown
## HarmonyOS应用发布清单

### 发布前检查

- [ ] 版本号更新 (versionCode, versionName)
- [ ] 移除调试代码和日志
- [ ] 切换到生产环境API
- [ ] 图标和启动图更新
- [ ] 应用名称确认
- [ ] 权限声明检查
- [ ] 代码混淆配置
- [ ] 签名配置正确

### 性能检查

- [ ] 首页加载时间 < 2秒
- [ ] 列表滑动流畅 (60fps)
- [ ] 内存占用合理
- [ ] 无内存泄漏

### 功能测试

- [ ] 核心业务流程测试
- [ ] 异常场景测试
- [ ] 网络断开处理
- [ ] 低内存情况测试

### 提交材料

- [ ] HAP/APP包
- [ ] 应用图标 (多尺寸)
- [ ] 应用截图
- [ ] 应用描述
- [ ] 隐私政策
- [ ] 用户协议
```

---

## 企业级开发规范总结

### 代码规范

1. **命名规范**
   - 组件名：PascalCase (ProductCard)
   - 函数名：camelCase (getUserInfo)
   - 常量名：UPPER_SNAKE_CASE (API_BASE_URL)
   - 接口名：I前缀 (IUserInfo)

2. **文件组织**
   - 一个文件一个组件
   - 相关代码放同一目录
   - 公共代码提取复用

3. **注释规范**
   - 组件添加功能说明
   - 复杂逻辑添加注释
   - API函数添加JSDoc

### 性能规范

1. **渲染优化**
   - 使用LazyForEach
   - 使用@Reusable
   - 避免深层嵌套

2. **内存优化**
   - 及时清理资源
   - 图片懒加载
   - 大数据分页

3. **网络优化**
   - 请求合并
   - 数据缓存
   - 错误重试

### 安全规范

1. **数据安全**
   - 敏感数据加密存储
   - Token安全管理
   - 输入验证

2. **网络安全**
   - HTTPS通信
   - 请求签名
   - 防重放攻击

---

*HarmonyOS ArkTS前端开发完全指南 - 全文完*

---

## 文档索引

1. **基础篇** - ArkTS语法、类型系统、面向对象
2. **组件与状态管理篇** - ArkUI组件、状态装饰器、生命周期
3. **路由与网络篇** - 页面导航、HTTP请求、数据存储
4. **动画与高级特性篇** - 动画系统、手势处理、弹窗
5. **企业级项目实战篇** - 架构设计、状态管理、最佳实践
