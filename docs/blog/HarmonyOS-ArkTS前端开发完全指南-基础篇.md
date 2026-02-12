# HarmonyOS ArkTS前端开发完全指南 - 基础篇

> 本文档全面总结HarmonyOS前端开发的所有语法、方法、用法，结合企业级大厂项目实战经验

---
<div class="doc-toc">
## 目录

1. [ArkTS语言基础](#1-arkts语言基础)
2. [基础数据类型与变量](#2-基础数据类型与变量)
3. [函数与箭头函数](#3-函数与箭头函数)
4. [类与面向对象](#4-类与面向对象)
5. [接口与类型](#5-接口与类型)
6. [泛型编程](#6-泛型编程)
7. [模块化开发](#7-模块化开发)
8. [装饰器详解](#8-装饰器详解)


</div>

---

## 1. ArkTS语言基础

### 1.1 ArkTS概述

ArkTS是HarmonyOS优选的主力应用开发语言，基于TypeScript扩展，提供声明式UI、状态管理等能力。

```typescript
// ArkTS基础结构
@Entry
@Component
struct Index {
  @State message: string = 'Hello HarmonyOS'

  build() {
    Column() {
      Text(this.message)
        .fontSize(30)
        .fontWeight(FontWeight.Bold)
    }
    .width('100%')
    .height('100%')
  }
}
```

**企业级使用场景**：所有HarmonyOS应用的入口页面都采用此结构

### 1.2 严格类型检查

```typescript
// ArkTS要求严格类型声明
let userName: string = '张三'
let userAge: number = 25
let isVip: boolean = true
let userList: Array<string> = ['用户1', '用户2']

// 错误示例 - ArkTS不允许
// let data = undefined  // 不允许undefined
// let info = null       // 需要明确类型

// 正确示例
let data: string | null = null
```

---

## 2. 基础数据类型与变量

### 2.1 基本类型

```typescript
// 字符串类型
let productName: string = '华为Mate60'
let description: string = `商品名称：${productName}`

// 数字类型
let price: number = 5999
let discount: number = 0.85
let finalPrice: number = price * discount

// 布尔类型
let inStock: boolean = true
let isOnSale: boolean = false

// 数组类型
let categories: string[] = ['手机', '电脑', '平板']
let prices: Array<number> = [5999, 8999, 3999]

// 元组类型
let product: [string, number] = ['华为Mate60', 5999]

// 枚举类型
enum OrderStatus {
  Pending = 0,
  Paid = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4
}
let currentStatus: OrderStatus = OrderStatus.Paid
```

**企业级使用场景**：电商应用商品信息管理、订单状态流转

### 2.2 联合类型与类型别名

```typescript
// 联合类型 - 支付方式
type PaymentMethod = 'alipay' | 'wechat' | 'huawei_pay' | 'bank_card'

let payment: PaymentMethod = 'huawei_pay'

// 类型别名 - 用户信息
type UserInfo = {
  id: string
  name: string
  phone: string
  avatar?: string  // 可选属性
}

let user: UserInfo = {
  id: '10001',
  name: '张三',
  phone: '13800138000'
}

// 复杂联合类型
type ApiResponse<T> = {
  code: number
  message: string
  data: T | null
}
```

### 2.3 Record与Map类型

```typescript
// Record类型 - 商品库存管理
type ProductStock = Record<string, number>

let stockMap: ProductStock = {
  'SKU001': 100,
  'SKU002': 50,
  'SKU003': 200
}

// Map类型 - 购物车
let cartMap: Map<string, number> = new Map()
cartMap.set('商品A', 2)
cartMap.set('商品B', 1)

// 遍历Map
cartMap.forEach((quantity, productName) => {
  console.info(`${productName}: ${quantity}件`)
})
```

**企业级使用场景**：购物车管理、库存系统、配置管理

---

## 3. 函数与箭头函数

### 3.1 函数声明与参数

```typescript
// 基础函数声明
function calculateTotal(price: number, quantity: number): number {
  return price * quantity
}

// 可选参数
function createOrder(productId: string, quantity: number, couponCode?: string): void {
  console.info(`创建订单: ${productId}, 数量: ${quantity}`)
  if (couponCode) {
    console.info(`使用优惠券: ${couponCode}`)
  }
}

// 默认参数
function formatPrice(price: number, currency: string = '¥'): string {
  return `${currency}${price.toFixed(2)}`
}

// 剩余参数
function addToCart(...productIds: string[]): void {
  productIds.forEach(id => {
    console.info(`添加商品: ${id}`)
  })
}
```

### 3.2 箭头函数

```typescript
// 基础箭头函数
const double = (num: number): number => num * 2

// 多行箭头函数
const processOrder = (orderId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 处理订单逻辑
    console.info(`处理订单: ${orderId}`)
    resolve(true)
  })
}

// 数组方法中的箭头函数
interface Product {
  id: string
  name: string
  price: number
  category: string
}

let products: Product[] = [
  { id: '1', name: '手机', price: 5999, category: '电子' },
  { id: '2', name: '耳机', price: 299, category: '配件' },
  { id: '3', name: '平板', price: 3999, category: '电子' }
]

// filter - 筛选电子产品
let electronics = products.filter(p => p.category === '电子')

// map - 获取所有商品名称
let productNames = products.map(p => p.name)

// reduce - 计算总价
let totalPrice = products.reduce((sum, p) => sum + p.price, 0)

// find - 查找特定商品
let phone = products.find(p => p.name === '手机')

// sort - 按价格排序
let sortedProducts = products.sort((a, b) => a.price - b.price)
```

**企业级使用场景**：商品列表筛选、数据处理、价格计算

### 3.3 高阶函数

```typescript
// 函数作为参数
function executeWithLoading(
  action: () => Promise<void>,
  onStart: () => void,
  onEnd: () => void
): void {
  onStart()
  action().finally(() => onEnd())
}

// 函数作为返回值 - 创建验证器
function createValidator(minLength: number): (value: string) => boolean {
  return (value: string): boolean => {
    return value.length >= minLength
  }
}

const validatePassword = createValidator(6)
console.info(validatePassword('123456')) // true
console.info(validatePassword('123'))    // false

// 柯里化函数
function formatCurrency(currency: string): (price: number) => string {
  return (price: number): string => `${currency}${price.toFixed(2)}`
}

const formatRMB = formatCurrency('¥')
const formatUSD = formatCurrency('$')

console.info(formatRMB(99.9))  // ¥99.90
console.info(formatUSD(99.9)) // $99.90
```

---

## 4. 类与面向对象

### 4.1 类的定义与继承

```typescript
// 基础类定义
class BaseEntity {
  id: string
  createTime: Date
  updateTime: Date

  constructor(id: string) {
    this.id = id
    this.createTime = new Date()
    this.updateTime = new Date()
  }
}

// 用户类
class User extends BaseEntity {
  private _name: string
  private _phone: string
  public email: string
  protected role: string

  constructor(id: string, name: string, phone: string) {
    super(id)
    this._name = name
    this._phone = phone
    this.email = ''
    this.role = 'user'
  }

  // getter
  get name(): string {
    return this._name
  }

  // setter
  set name(value: string) {
    if (value.length > 0) {
      this._name = value
    }
  }

  // 公开方法
  public getProfile(): string {
    return `用户: ${this._name}, 手机: ${this.maskPhone()}`
  }

  // 私有方法 - 手机号脱敏
  private maskPhone(): string {
    return this._phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
}

// 管理员类
class Admin extends User {
  permissions: string[]

  constructor(id: string, name: string, phone: string, permissions: string[]) {
    super(id, name, phone)
    this.role = 'admin'
    this.permissions = permissions
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission)
  }
}
```

### 4.2 抽象类

```typescript
// 抽象类 - 支付基类
abstract class PaymentBase {
  protected orderId: string
  protected amount: number

  constructor(orderId: string, amount: number) {
    this.orderId = orderId
    this.amount = amount
  }

  // 抽象方法 - 子类必须实现
  abstract pay(): Promise<boolean>
  abstract refund(): Promise<boolean>

  // 普通方法
  getPaymentInfo(): string {
    return `订单: ${this.orderId}, 金额: ${this.amount}`
  }
}

// 支付宝支付
class AlipayPayment extends PaymentBase {
  async pay(): Promise<boolean> {
    console.info(`支付宝支付: ${this.getPaymentInfo()}`)
    // 调用支付宝SDK
    return true
  }

  async refund(): Promise<boolean> {
    console.info(`支付宝退款: ${this.orderId}`)
    return true
  }
}

// 微信支付
class WechatPayment extends PaymentBase {
  async pay(): Promise<boolean> {
    console.info(`微信支付: ${this.getPaymentInfo()}`)
    // 调用微信SDK
    return true
  }

  async refund(): Promise<boolean> {
    console.info(`微信退款: ${this.orderId}`)
    return true
  }
}

// 支付工厂
class PaymentFactory {
  static create(type: string, orderId: string, amount: number): PaymentBase {
    switch (type) {
      case 'alipay':
        return new AlipayPayment(orderId, amount)
      case 'wechat':
        return new WechatPayment(orderId, amount)
      default:
        throw new Error(`不支持的支付方式: ${type}`)
    }
  }
}
```

**企业级使用场景**：支付系统、用户权限管理、订单处理

### 4.3 静态成员与单例模式

```typescript
// 单例模式 - 全局配置管理
class AppConfig {
  private static instance: AppConfig | null = null
  
  public apiBaseUrl: string = ''
  public appVersion: string = ''
  public isDebug: boolean = false

  private constructor() {
    // 私有构造函数
  }

  static getInstance(): AppConfig {
    if (AppConfig.instance === null) {
      AppConfig.instance = new AppConfig()
    }
    return AppConfig.instance
  }

  init(config: Partial<AppConfig>): void {
    if (config.apiBaseUrl) this.apiBaseUrl = config.apiBaseUrl
    if (config.appVersion) this.appVersion = config.appVersion
    if (config.isDebug !== undefined) this.isDebug = config.isDebug
  }
}

// 使用
const config = AppConfig.getInstance()
config.init({
  apiBaseUrl: 'https://api.example.com',
  appVersion: '1.0.0',
  isDebug: true
})

// 静态工具类
class StringUtils {
  static isEmpty(str: string | null | undefined): boolean {
    return str === null || str === undefined || str.trim().length === 0
  }

  static formatPhone(phone: string): string {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength) + '...'
  }
}
```

---

## 5. 接口与类型

### 5.1 接口定义

```typescript
// 基础接口
interface IProduct {
  id: string
  name: string
  price: number
  description?: string
}

// 接口继承
interface IProductDetail extends IProduct {
  images: string[]
  specifications: Record<string, string>
  stock: number
  salesCount: number
}

// 多接口继承
interface ITimestamp {
  createTime: Date
  updateTime: Date
}

interface IAuditable {
  createdBy: string
  updatedBy: string
}

interface IOrder extends ITimestamp, IAuditable {
  orderId: string
  userId: string
  products: IOrderItem[]
  totalAmount: number
  status: OrderStatus
}

interface IOrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
}

enum OrderStatus {
  Created = 'created',
  Paid = 'paid',
  Shipped = 'shipped',
  Completed = 'completed',
  Cancelled = 'cancelled'
}
```

### 5.2 接口实现

```typescript
// 接口定义行为契约
interface IRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  update(id: string, entity: Partial<T>): Promise<T>
  delete(id: string): Promise<boolean>
}

// 用户仓储实现
class UserRepository implements IRepository<User> {
  private users: Map<string, User> = new Map()

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values())
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user)
    return user
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('用户不存在')
    Object.assign(user, data)
    return user
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id)
  }
}
```

### 5.3 类型守卫

```typescript
// 类型守卫函数
interface ICat {
  type: 'cat'
  meow(): void
}

interface IDog {
  type: 'dog'
  bark(): void
}

type Pet = ICat | IDog

function isCat(pet: Pet): pet is ICat {
  return pet.type === 'cat'
}

function handlePet(pet: Pet): void {
  if (isCat(pet)) {
    pet.meow()  // TypeScript知道这里是ICat
  } else {
    pet.bark()  // TypeScript知道这里是IDog
  }
}

// API响应类型守卫
interface ISuccessResponse<T> {
  success: true
  data: T
}

interface IErrorResponse {
  success: false
  error: string
  code: number
}

type ApiResponse<T> = ISuccessResponse<T> | IErrorResponse

function isSuccess<T>(response: ApiResponse<T>): response is ISuccessResponse<T> {
  return response.success === true
}

async function fetchUserData(): Promise<void> {
  const response: ApiResponse<User> = await fetch('/api/user').then(r => r.json())
  
  if (isSuccess(response)) {
    console.info(`用户名: ${response.data.name}`)
  } else {
    console.error(`错误: ${response.error}`)
  }
}
```

---

## 6. 泛型编程

### 6.1 泛型函数

```typescript
// 基础泛型函数
function identity<T>(value: T): T {
  return value
}

// 泛型数组操作
function getFirst<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined
}

function getLast<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}

// 多泛型参数
function createPair<K, V>(key: K, value: V): [K, V] {
  return [key, value]
}

// 泛型约束
interface IHasId {
  id: string
}

function findById<T extends IHasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id)
}

// 使用keyof约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const product = { id: '1', name: '手机', price: 5999 }
const productName = getProperty(product, 'name')  // 类型安全
```

### 6.2 泛型类

```typescript
// 泛型分页结果
class PageResult<T> {
  items: T[]
  total: number
  pageNo: number
  pageSize: number

  constructor(items: T[], total: number, pageNo: number, pageSize: number) {
    this.items = items
    this.total = total
    this.pageNo = pageNo
    this.pageSize = pageSize
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize)
  }

  get hasNext(): boolean {
    return this.pageNo < this.totalPages
  }

  get hasPrev(): boolean {
    return this.pageNo > 1
  }

  map<U>(fn: (item: T) => U): PageResult<U> {
    return new PageResult(
      this.items.map(fn),
      this.total,
      this.pageNo,
      this.pageSize
    )
  }
}

// 泛型缓存类
class CacheManager<T> {
  private cache: Map<string, { data: T; expireTime: number }> = new Map()

  set(key: string, value: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data: value,
      expireTime: Date.now() + ttlSeconds * 1000
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() > item.expireTime) {
      this.cache.delete(key)
      return null
    }
    return item.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

// 使用示例
const userCache = new CacheManager<User>()
const productCache = new CacheManager<IProduct>()
```

### 6.3 泛型工具类型

```typescript
// 内置泛型工具类型使用

interface IUserForm {
  name: string
  email: string
  phone: string
  address: string
}

// Partial - 所有属性可选
type PartialUserForm = Partial<IUserForm>

// Required - 所有属性必填
type RequiredUserForm = Required<IUserForm>

// Pick - 选择部分属性
type UserBasicInfo = Pick<IUserForm, 'name' | 'phone'>

// Omit - 排除部分属性
type UserWithoutAddress = Omit<IUserForm, 'address'>

// Record - 键值对映射
type UserFormErrors = Record<keyof IUserForm, string>

// 自定义工具类型
type Nullable<T> = T | null

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P]
}

// 条件类型
type ExtractArrayType<T> = T extends Array<infer U> ? U : never

type StringArray = string[]
type ExtractedString = ExtractArrayType<StringArray>  // string
```

---

## 7. 模块化开发

### 7.1 模块导出与导入

```typescript
// ============ utils/http.ets ============
// 命名导出
export class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(this.baseUrl + path)
    return response.json()
  }

  async post<T>(path: string, data: object): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export const httpClient = new HttpClient('https://api.example.com')

// 默认导出
export default HttpClient

// ============ utils/constants.ets ============
export const API_BASE_URL = 'https://api.example.com'
export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'user_info'

export enum StorageKeys {
  Token = 'auth_token',
  User = 'user_info',
  Settings = 'app_settings'
}

// ============ index.ets (入口重导出) ============
export { HttpClient, httpClient } from './utils/http'
export { API_BASE_URL, TOKEN_KEY, StorageKeys } from './utils/constants'
export type { IUserForm } from './types/user'
```

### 7.2 模块导入方式

```typescript
// 导入命名导出
import { HttpClient, httpClient } from '../utils/http'

// 导入默认导出
import HttpClient from '../utils/http'

// 混合导入
import HttpClient, { httpClient } from '../utils/http'

// 重命名导入
import { HttpClient as Http } from '../utils/http'

// 导入所有
import * as HttpModule from '../utils/http'

// 类型导入 (仅类型)
import type { IUserForm, IProduct } from '../types'

// 动态导入 (按需加载)
async function loadModule(): Promise<void> {
  const { heavyFunction } = await import('../utils/heavy')
  heavyFunction()
}
```

### 7.3 模块化项目结构

```
project/
├── entry/src/main/ets/
│   ├── entryability/        # 入口Ability
│   │   └── EntryAbility.ets
│   ├── pages/               # 页面组件
│   │   ├── Index.ets
│   │   ├── Login.ets
│   │   └── Home.ets
│   ├── components/          # 公共组件
│   │   ├── common/
│   │   │   ├── Header.ets
│   │   │   ├── Footer.ets
│   │   │   └── Loading.ets
│   │   └── business/
│   │       ├── ProductCard.ets
│   │       └── OrderItem.ets
│   ├── services/            # 业务服务
│   │   ├── UserService.ets
│   │   ├── ProductService.ets
│   │   └── OrderService.ets
│   ├── models/              # 数据模型
│   │   ├── User.ets
│   │   ├── Product.ets
│   │   └── Order.ets
│   ├── utils/               # 工具函数
│   │   ├── http.ets
│   │   ├── storage.ets
│   │   └── validator.ets
│   ├── constants/           # 常量定义
│   │   └── index.ets
│   └── types/               # 类型定义
│       └── index.ets
```

---

## 8. 装饰器详解

### 8.1 组件装饰器

```typescript
// @Entry - 入口组件装饰器
// 标识当前组件是页面的入口组件
@Entry
@Component
struct IndexPage {
  build() {
    Column() {
      Text('首页')
    }
  }
}

// @Component - 自定义组件装饰器
// 标识这是一个自定义组件
@Component
struct MyButton {
  @Prop label: string = ''
  
  build() {
    Button(this.label)
  }
}

// @Preview - 预览装饰器
// 用于在DevEco Studio中预览组件
@Preview
@Component
struct PreviewDemo {
  build() {
    Column() {
      Text('预览组件')
    }
  }
}

// @Builder - 构建函数装饰器
// 定义可复用的UI构建函数
@Builder
function CardBuilder(title: string, content: string) {
  Column() {
    Text(title)
      .fontSize(18)
      .fontWeight(FontWeight.Bold)
    Text(content)
      .fontSize(14)
      .margin({ top: 8 })
  }
  .padding(16)
  .backgroundColor('#FFFFFF')
  .borderRadius(8)
}

// 组件内的@Builder
@Component
struct CardList {
  @Builder
  itemBuilder(item: string) {
    Text(item)
      .padding(12)
      .backgroundColor('#F5F5F5')
      .margin({ bottom: 8 })
  }

  build() {
    Column() {
      ForEach(['项目1', '项目2', '项目3'], (item: string) => {
        this.itemBuilder(item)
      })
    }
  }
}

// @BuilderParam - 构建参数装饰器
// 允许组件接收外部传入的Builder函数
@Component
struct Container {
  @BuilderParam content: () => void = this.defaultBuilder
  @BuilderParam header?: () => void
  @BuilderParam footer?: () => void

  @Builder
  defaultBuilder() {
    Text('默认内容')
  }

  build() {
    Column() {
      if (this.header) {
        this.header()
      }
      this.content()
      if (this.footer) {
        this.footer()
      }
    }
  }
}

// 使用BuilderParam
@Entry
@Component
struct UsageExample {
  @Builder
  customContent() {
    Text('自定义内容')
      .fontSize(16)
  }

  @Builder
  customHeader() {
    Text('自定义头部')
      .fontSize(20)
      .fontWeight(FontWeight.Bold)
  }

  build() {
    Column() {
      Container({
        content: this.customContent,
        header: this.customHeader
      })
    }
  }
}

// @Styles - 样式装饰器
// 定义可复用的样式
@Styles
function cardStyle() {
  .backgroundColor('#FFFFFF')
  .borderRadius(12)
  .padding(16)
  .shadow({
    radius: 8,
    color: 'rgba(0,0,0,0.1)',
    offsetX: 0,
    offsetY: 2
  })
}

@Styles
function centerStyle() {
  .width('100%')
  .justifyContent(FlexAlign.Center)
  .alignItems(HorizontalAlign.Center)
}

// 组件内的@Styles
@Component
struct StyleExample {
  @Styles
  pressedStyle() {
    .opacity(0.8)
    .scale({ x: 0.98, y: 0.98 })
  }

  build() {
    Column() {
      Button('按钮')
        .cardStyle()
        .stateStyles({
          pressed: this.pressedStyle
        })
    }
  }
}

// @Extend - 扩展组件样式
// 扩展内置组件的样式
@Extend(Text)
function titleText(size: number = 20) {
  .fontSize(size)
  .fontWeight(FontWeight.Bold)
  .fontColor('#333333')
}

@Extend(Text)
function descText() {
  .fontSize(14)
  .fontColor('#666666')
  .lineHeight(22)
}

@Extend(Button)
function primaryButton() {
  .backgroundColor('#007AFF')
  .fontColor('#FFFFFF')
  .borderRadius(8)
  .height(48)
}

@Extend(Button)
function secondaryButton() {
  .backgroundColor('#F5F5F5')
  .fontColor('#333333')
  .borderRadius(8)
  .height(48)
}

// 使用示例
@Component
struct ExtendExample {
  build() {
    Column({ space: 16 }) {
      Text('标题文字').titleText(24)
      Text('描述文字内容').descText()
      Button('主要按钮').primaryButton()
      Button('次要按钮').secondaryButton()
    }
    .padding(16)
  }
}
```

### 8.2 状态装饰器（预览）

```typescript
// 状态装饰器将在状态管理篇详细讲解
// 这里简单列出主要的状态装饰器

@Entry
@Component
struct StateDecoratorsPreview {
  // @State - 组件内状态
  @State count: number = 0

  // @Prop - 单向数据传递
  // @Link - 双向数据绑定
  // @Provide/@Consume - 跨组件数据共享
  // @ObjectLink - 对象双向绑定
  // @Observed - 观察对象变化
  // @Watch - 监听状态变化

  build() {
    Column() {
      Text(`计数: ${this.count}`)
      Button('增加')
        .onClick(() => {
          this.count++
        })
    }
  }
}
```

---

## 企业级最佳实践总结

### 代码规范

1. **类型安全**：始终声明明确的类型，避免any
2. **命名规范**：接口以I开头，类型以Type结尾，枚举使用PascalCase
3. **模块化**：按功能拆分模块，保持单一职责
4. **复用性**：使用泛型提高代码复用性
5. **文档注释**：为公共API添加JSDoc注释

### 项目结构

```
src/
├── pages/          # 页面 (仅包含UI和页面逻辑)
├── components/     # 组件 (可复用的UI组件)
├── services/       # 服务 (API调用、业务逻辑)
├── models/         # 模型 (数据结构定义)
├── stores/         # 状态管理
├── utils/          # 工具函数
├── constants/      # 常量
└── types/          # 类型定义
```

### 下一篇预告

- 状态管理详解 (@State, @Prop, @Link等)
- 组件通信机制
- 生命周期管理

---

*文档持续更新中...*
