# HarmonyOS ArkTS前端开发完全指南 - 路由与网络篇

> 本文档全面总结HarmonyOS页面路由、网络请求、数据存储等核心功能，结合企业级大厂项目实战经验

---
<div class="doc-toc">
## 目录

1. [页面路由导航](#1-页面路由导航)
2. [网络请求](#2-网络请求)
3. [数据持久化存储](#3-数据持久化存储)
4. [文件操作](#4-文件操作)
5. [多媒体能力](#5-多媒体能力)


</div>

---

## 1. 页面路由导航

### 1.1 路由配置

```json
// src/main/resources/base/profile/main_pages.json
{
  "src": [
    "pages/Index",
    "pages/Login",
    "pages/Home",
    "pages/ProductDetail",
    "pages/Cart",
    "pages/Mine",
    "pages/Settings",
    "pages/OrderList",
    "pages/OrderDetail"
  ]
}
```

### 1.2 基础路由跳转

```typescript
import { router } from '@kit.ArkUI'

@Entry
@Component
struct NavigationDemo {
  build() {
    Column({ space: 16 }) {
      // 1. 普通跳转 (压入栈)
      Button('跳转到详情页')
        .onClick(() => {
          router.pushUrl({
            url: 'pages/ProductDetail'
          })
        })

      // 2. 带参数跳转
      Button('带参数跳转')
        .onClick(() => {
          router.pushUrl({
            url: 'pages/ProductDetail',
            params: {
              productId: '12345',
              source: 'home'
            }
          })
        })

      // 3. 替换跳转 (替换当前页)
      Button('替换当前页')
        .onClick(() => {
          router.replaceUrl({
            url: 'pages/Home'
          })
        })

      // 4. 返回上一页
      Button('返回')
        .onClick(() => {
          router.back()
        })

      // 5. 返回指定页面
      Button('返回首页')
        .onClick(() => {
          router.back({
            url: 'pages/Index'
          })
        })

      // 6. 清空栈并跳转
      Button('清空并跳转')
        .onClick(() => {
          router.clear()
          router.replaceUrl({
            url: 'pages/Login'
          })
        })
    }
    .padding(16)
  }
}
```

### 1.3 获取路由参数

```typescript
import { router } from '@kit.ArkUI'

@Entry
@Component
struct ProductDetailPage {
  @State productId: string = ''
  @State source: string = ''

  aboutToAppear(): void {
    // 获取路由参数
    const params = router.getParams() as Record<string, string>
    if (params) {
      this.productId = params.productId || ''
      this.source = params.source || ''
    }
  }

  build() {
    Column({ space: 16 }) {
      Text(`商品ID: ${this.productId}`)
      Text(`来源: ${this.source}`)
    }
    .padding(16)
  }
}

// 企业级实战：类型安全的路由参数
interface ProductDetailParams {
  productId: string
  source?: string
  fromCart?: boolean
}

@Entry
@Component
struct TypeSafeDetailPage {
  @State params: ProductDetailParams = { productId: '' }

  aboutToAppear(): void {
    const rawParams = router.getParams()
    if (rawParams) {
      this.params = rawParams as ProductDetailParams
    }
  }

  build() {
    Column() {
      Text(`商品ID: ${this.params.productId}`)
      if (this.params.source) {
        Text(`来源: ${this.params.source}`)
      }
    }
  }
}
```

### 1.4 路由模式与栈管理

```typescript
import { router } from '@kit.ArkUI'

// 路由模式
enum RouterMode {
  Standard = 0,  // 标准模式：每次跳转创建新实例
  Single = 1     // 单实例模式：复用已存在的实例
}

@Entry
@Component
struct RouterModeDemo {
  build() {
    Column({ space: 16 }) {
      // 标准模式跳转
      Button('标准模式跳转')
        .onClick(() => {
          router.pushUrl({
            url: 'pages/Detail'
          }, router.RouterMode.Standard)
        })

      // 单实例模式跳转
      Button('单实例模式跳转')
        .onClick(() => {
          router.pushUrl({
            url: 'pages/Detail'
          }, router.RouterMode.Single)
        })

      // 获取路由栈长度
      Button('获取栈长度')
        .onClick(() => {
          const length = router.getLength()
          console.info(`路由栈长度: ${length}`)
        })

      // 获取当前页面状态
      Button('获取页面状态')
        .onClick(() => {
          const state = router.getState()
          console.info(`当前页面: ${state.name}, 路径: ${state.path}, 索引: ${state.index}`)
        })
    }
    .padding(16)
  }
}

// 企业级实战：路由工具类
class RouterUtil {
  // 跳转到登录页（清空栈）
  static toLogin(): void {
    router.clear()
    router.replaceUrl({ url: 'pages/Login' })
  }

  // 跳转到首页（清空栈）
  static toHome(): void {
    router.clear()
    router.replaceUrl({ url: 'pages/Home' })
  }

  // 跳转到商品详情
  static toProductDetail(productId: string, source?: string): void {
    router.pushUrl({
      url: 'pages/ProductDetail',
      params: { productId, source }
    })
  }

  // 跳转到订单详情
  static toOrderDetail(orderId: string): void {
    router.pushUrl({
      url: 'pages/OrderDetail',
      params: { orderId }
    })
  }

  // 安全返回（有页面才返回）
  static safeBack(): void {
    if (router.getLength() > 1) {
      router.back()
    } else {
      RouterUtil.toHome()
    }
  }

  // 返回并刷新上一页
  static backWithResult(result: object): void {
    // 通过EventHub传递结果
    // getContext().eventHub.emit('pageResult', result)
    router.back()
  }
}
```

### 1.5 Navigation组件导航

```typescript
// Navigation是更强大的导航容器组件
@Entry
@Component
struct NavigationPage {
  @State currentIndex: number = 0
  private controller: NavigationController = new NavigationController()

  @Builder
  tabBuilder(title: string, icon: Resource, selectedIcon: Resource, index: number) {
    Column() {
      Image(this.currentIndex === index ? selectedIcon : icon)
        .width(24)
        .height(24)
      Text(title)
        .fontSize(12)
        .fontColor(this.currentIndex === index ? '#007AFF' : '#999999')
        .margin({ top: 4 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  build() {
    Navigation(this.controller) {
      // 导航内容
      Tabs({ barPosition: BarPosition.End }) {
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
      .onChange((index) => {
        this.currentIndex = index
      })
    }
    .title('商城')
    .titleMode(NavigationTitleMode.Mini)
    .hideBackButton(true)
  }
}

@Component
struct HomePage {
  build() {
    Column() {
      Text('首页内容')
    }
  }
}

@Component
struct CategoryPage {
  build() {
    Column() {
      Text('分类内容')
    }
  }
}

@Component
struct CartPage {
  build() {
    Column() {
      Text('购物车内容')
    }
  }
}

@Component
struct MinePage {
  build() {
    Column() {
      Text('我的内容')
    }
  }
}
```

### 1.6 NavRouter/NavDestination导航

```typescript
// NavRouter用于触发Navigation的NavDestination跳转
@Entry
@Component
struct NavRouterDemo {
  @State activeIndex: number = 0

  build() {
    Navigation() {
      List() {
        ListItem() {
          NavRouter() {
            // 列表项内容
            Text('商品1')
              .padding(16)
            
            // 跳转目标
            NavDestination() {
              ProductDetailContent({ productId: '1' })
            }
            .title('商品详情')
          }
        }

        ListItem() {
          NavRouter() {
            Text('商品2')
              .padding(16)
            
            NavDestination() {
              ProductDetailContent({ productId: '2' })
            }
            .title('商品详情')
          }
        }
      }
      .width('100%')
    }
    .title('商品列表')
    .mode(NavigationMode.Auto)  // Auto/Stack/Split
  }
}

@Component
struct ProductDetailContent {
  @Prop productId: string = ''

  build() {
    Column() {
      Text(`商品详情: ${this.productId}`)
    }
    .width('100%')
    .height('100%')
  }
}
```

### 1.7 路由拦截与守卫

```typescript
// 企业级实战：路由守卫
import { router } from '@kit.ArkUI'

class RouterGuard {
  // 需要登录的页面
  private static authRequiredPages: string[] = [
    'pages/Cart',
    'pages/OrderList',
    'pages/Mine',
    'pages/Settings'
  ]

  // 检查是否需要登录
  static needAuth(url: string): boolean {
    return this.authRequiredPages.some(page => url.includes(page))
  }

  // 检查是否已登录
  static isLoggedIn(): boolean {
    // 从存储中获取token
    // return !!PreferencesUtil.get('token')
    return false  // 示例
  }

  // 带守卫的跳转
  static push(url: string, params?: object): void {
    if (this.needAuth(url) && !this.isLoggedIn()) {
      // 未登录，跳转到登录页
      router.pushUrl({
        url: 'pages/Login',
        params: {
          redirect: url,
          redirectParams: params
        }
      })
      return
    }

    // 已登录或不需要登录，正常跳转
    router.pushUrl({
      url: url,
      params: params
    })
  }
}

// 登录页处理重定向
@Entry
@Component
struct LoginPage {
  @State redirect: string = ''
  @State redirectParams: object = {}

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, Object>
    if (params) {
      this.redirect = params.redirect as string || ''
      this.redirectParams = params.redirectParams as object || {}
    }
  }

  handleLoginSuccess(): void {
    if (this.redirect) {
      // 登录成功后跳转到原目标页
      router.replaceUrl({
        url: this.redirect,
        params: this.redirectParams
      })
    } else {
      // 跳转到首页
      router.replaceUrl({ url: 'pages/Home' })
    }
  }

  build() {
    Column() {
      // 登录表单...
      Button('登录')
        .onClick(() => this.handleLoginSuccess())
    }
  }
}
```

---

## 2. 网络请求

### 2.1 HTTP基础请求

```typescript
import { http } from '@kit.NetworkKit'

// 基础GET请求
async function fetchData(): Promise<void> {
  const httpRequest = http.createHttp()

  try {
    const response = await httpRequest.request(
      'https://api.example.com/products',
      {
        method: http.RequestMethod.GET,
        header: {
          'Content-Type': 'application/json'
        },
        connectTimeout: 60000,  // 连接超时 60秒
        readTimeout: 60000      // 读取超时 60秒
      }
    )

    if (response.responseCode === 200) {
      const data = JSON.parse(response.result as string)
      console.info(`请求成功: ${JSON.stringify(data)}`)
    } else {
      console.error(`请求失败: ${response.responseCode}`)
    }
  } catch (error) {
    console.error(`请求异常: ${error}`)
  } finally {
    httpRequest.destroy()
  }
}

// 基础POST请求
async function postData(data: object): Promise<void> {
  const httpRequest = http.createHttp()

  try {
    const response = await httpRequest.request(
      'https://api.example.com/login',
      {
        method: http.RequestMethod.POST,
        header: {
          'Content-Type': 'application/json'
        },
        extraData: JSON.stringify(data)
      }
    )

    if (response.responseCode === 200) {
      const result = JSON.parse(response.result as string)
      console.info(`登录成功: ${JSON.stringify(result)}`)
    }
  } catch (error) {
    console.error(`请求异常: ${error}`)
  } finally {
    httpRequest.destroy()
  }
}
```

### 2.2 企业级HTTP封装

```typescript
import { http } from '@kit.NetworkKit'

// API响应类型
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 请求配置
interface RequestConfig {
  url: string
  method?: http.RequestMethod
  params?: Record<string, string>
  data?: object
  headers?: Record<string, string>
  timeout?: number
}

// HTTP客户端封装
class HttpClient {
  private baseUrl: string
  private defaultTimeout: number = 30000
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // 设置认证Token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  // 清除Token
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization']
  }

  // 构建完整URL
  private buildUrl(url: string, params?: Record<string, string>): string {
    let fullUrl = this.baseUrl + url
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
      fullUrl += `?${queryString}`
    }
    return fullUrl
  }

  // 通用请求方法
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const httpRequest = http.createHttp()

    try {
      const fullUrl = this.buildUrl(config.url, config.params)
      
      const response = await httpRequest.request(
        fullUrl,
        {
          method: config.method || http.RequestMethod.GET,
          header: { ...this.defaultHeaders, ...config.headers },
          extraData: config.data ? JSON.stringify(config.data) : undefined,
          connectTimeout: config.timeout || this.defaultTimeout,
          readTimeout: config.timeout || this.defaultTimeout
        }
      )

      // 处理响应
      if (response.responseCode === 200) {
        const result = JSON.parse(response.result as string) as ApiResponse<T>
        
        // 业务错误码处理
        if (result.code !== 0) {
          // Token过期
          if (result.code === 401) {
            this.handleUnauthorized()
          }
          throw new Error(result.message)
        }
        
        return result
      } else if (response.responseCode === 401) {
        this.handleUnauthorized()
        throw new Error('未授权，请重新登录')
      } else {
        throw new Error(`HTTP错误: ${response.responseCode}`)
      }
    } catch (error) {
      console.error(`请求失败: ${config.url}`, error)
      throw error
    } finally {
      httpRequest.destroy()
    }
  }

  // 处理未授权
  private handleUnauthorized(): void {
    this.clearAuthToken()
    // 跳转登录页
    // RouterUtil.toLogin()
  }

  // GET请求
  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({
      url,
      method: http.RequestMethod.GET,
      params
    })
    return response.data
  }

  // POST请求
  async post<T>(url: string, data?: object): Promise<T> {
    const response = await this.request<T>({
      url,
      method: http.RequestMethod.POST,
      data
    })
    return response.data
  }

  // PUT请求
  async put<T>(url: string, data?: object): Promise<T> {
    const response = await this.request<T>({
      url,
      method: http.RequestMethod.PUT,
      data
    })
    return response.data
  }

  // DELETE请求
  async delete<T>(url: string): Promise<T> {
    const response = await this.request<T>({
      url,
      method: http.RequestMethod.DELETE
    })
    return response.data
  }
}

// 创建实例
const apiClient = new HttpClient('https://api.example.com')

// 导出
export { apiClient, HttpClient }
```

### 2.3 API服务层封装

```typescript
// ============ types/api.ets ============
// 用户相关类型
interface ILoginRequest {
  username: string
  password: string
}

interface ILoginResponse {
  token: string
  user: IUser
}

interface IUser {
  id: string
  username: string
  nickname: string
  avatar: string
  phone: string
}

// 商品相关类型
interface IProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  categoryId: string
  stock: number
  salesCount: number
}

interface IProductListParams {
  categoryId?: string
  keyword?: string
  pageNo: number
  pageSize: number
  sortBy?: 'price' | 'sales' | 'new'
  sortOrder?: 'asc' | 'desc'
}

interface IPageResult<T> {
  list: T[]
  total: number
  pageNo: number
  pageSize: number
}

// ============ services/UserService.ets ============
class UserService {
  // 登录
  static async login(params: ILoginRequest): Promise<ILoginResponse> {
    const result = await apiClient.post<ILoginResponse>('/auth/login', params)
    // 保存Token
    apiClient.setAuthToken(result.token)
    // 保存用户信息到本地
    // await PreferencesUtil.set('token', result.token)
    // await PreferencesUtil.set('user', JSON.stringify(result.user))
    return result
  }

  // 登出
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      apiClient.clearAuthToken()
      // PreferencesUtil.remove('token')
      // PreferencesUtil.remove('user')
    }
  }

  // 获取用户信息
  static async getUserInfo(): Promise<IUser> {
    return apiClient.get<IUser>('/user/info')
  }

  // 更新用户信息
  static async updateUserInfo(data: Partial<IUser>): Promise<IUser> {
    return apiClient.put<IUser>('/user/info', data)
  }

  // 修改密码
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/user/password', { oldPassword, newPassword })
  }
}

// ============ services/ProductService.ets ============
class ProductService {
  // 获取商品列表
  static async getProductList(params: IProductListParams): Promise<IPageResult<IProduct>> {
    return apiClient.get<IPageResult<IProduct>>('/products', params as Record<string, string>)
  }

  // 获取商品详情
  static async getProductDetail(productId: string): Promise<IProduct> {
    return apiClient.get<IProduct>(`/products/${productId}`)
  }

  // 搜索商品
  static async searchProducts(keyword: string, pageNo: number = 1): Promise<IPageResult<IProduct>> {
    return apiClient.get<IPageResult<IProduct>>('/products/search', {
      keyword,
      pageNo: pageNo.toString(),
      pageSize: '20'
    })
  }

  // 获取推荐商品
  static async getRecommendProducts(): Promise<IProduct[]> {
    return apiClient.get<IProduct[]>('/products/recommend')
  }
}

// ============ services/OrderService.ets ============
interface IOrderItem {
  productId: string
  quantity: number
  price: number
}

interface IOrder {
  id: string
  orderNo: string
  status: OrderStatus
  items: IOrderItem[]
  totalAmount: number
  createTime: string
  payTime?: string
  deliveryTime?: string
}

enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

class OrderService {
  // 创建订单
  static async createOrder(items: IOrderItem[], addressId: string): Promise<IOrder> {
    return apiClient.post<IOrder>('/orders', { items, addressId })
  }

  // 获取订单列表
  static async getOrderList(status?: OrderStatus, pageNo: number = 1): Promise<IPageResult<IOrder>> {
    const params: Record<string, string> = {
      pageNo: pageNo.toString(),
      pageSize: '10'
    }
    if (status) {
      params.status = status
    }
    return apiClient.get<IPageResult<IOrder>>('/orders', params)
  }

  // 获取订单详情
  static async getOrderDetail(orderId: string): Promise<IOrder> {
    return apiClient.get<IOrder>(`/orders/${orderId}`)
  }

  // 取消订单
  static async cancelOrder(orderId: string): Promise<void> {
    await apiClient.post(`/orders/${orderId}/cancel`)
  }

  // 确认收货
  static async confirmReceive(orderId: string): Promise<void> {
    await apiClient.post(`/orders/${orderId}/confirm`)
  }
}
```

### 2.4 请求状态管理

```typescript
// 企业级实战：页面数据加载状态管理
enum LoadState {
  Initial = 'initial',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
  Empty = 'empty'
}

@Entry
@Component
struct ProductListPage {
  @State loadState: LoadState = LoadState.Initial
  @State products: IProduct[] = []
  @State errorMessage: string = ''
  @State pageNo: number = 1
  @State hasMore: boolean = true
  @State isLoadingMore: boolean = false

  aboutToAppear(): void {
    this.loadData(true)
  }

  async loadData(refresh: boolean): Promise<void> {
    if (refresh) {
      this.pageNo = 1
      this.loadState = LoadState.Loading
    } else {
      if (!this.hasMore || this.isLoadingMore) return
      this.isLoadingMore = true
    }

    try {
      const result = await ProductService.getProductList({
        pageNo: this.pageNo,
        pageSize: 20
      })

      if (refresh) {
        this.products = result.list
      } else {
        this.products = [...this.products, ...result.list]
      }

      this.hasMore = this.products.length < result.total
      this.pageNo++

      if (this.products.length === 0) {
        this.loadState = LoadState.Empty
      } else {
        this.loadState = LoadState.Success
      }
    } catch (error) {
      if (refresh) {
        this.loadState = LoadState.Error
        this.errorMessage = (error as Error).message || '加载失败'
      }
    } finally {
      this.isLoadingMore = false
    }
  }

  @Builder
  loadingBuilder() {
    Column() {
      LoadingProgress()
        .width(50)
        .height(50)
      Text('加载中...')
        .fontSize(14)
        .fontColor('#999999')
        .margin({ top: 12 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  errorBuilder() {
    Column({ space: 16 }) {
      Image($r('app.media.ic_error'))
        .width(80)
        .height(80)
      Text(this.errorMessage)
        .fontSize(14)
        .fontColor('#999999')
      Button('重试')
        .onClick(() => this.loadData(true))
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  emptyBuilder() {
    Column({ space: 16 }) {
      Image($r('app.media.ic_empty'))
        .width(80)
        .height(80)
      Text('暂无数据')
        .fontSize(14)
        .fontColor('#999999')
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  contentBuilder() {
    List({ space: 8 }) {
      ForEach(this.products, (product: IProduct) => {
        ListItem() {
          // 商品卡片
          ProductCard({ product: product })
        }
      })

      // 加载更多
      ListItem() {
        Row() {
          if (this.isLoadingMore) {
            LoadingProgress()
              .width(20)
              .height(20)
            Text('加载中...')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ left: 8 })
          } else if (!this.hasMore) {
            Text('没有更多了')
              .fontSize(12)
              .fontColor('#999999')
          }
        }
        .width('100%')
        .height(50)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .padding(8)
    .onReachEnd(() => {
      this.loadData(false)
    })
  }

  build() {
    Column() {
      if (this.loadState === LoadState.Loading) {
        this.loadingBuilder()
      } else if (this.loadState === LoadState.Error) {
        this.errorBuilder()
      } else if (this.loadState === LoadState.Empty) {
        this.emptyBuilder()
      } else {
        this.contentBuilder()
      }
    }
    .width('100%')
    .height('100%')
  }
}

@Component
struct ProductCard {
  @Prop product: IProduct = {} as IProduct

  build() {
    Row({ space: 12 }) {
      Image(this.product.images[0] || '')
        .width(100)
        .height(100)
        .borderRadius(8)

      Column({ space: 4 }) {
        Text(this.product.name)
          .fontSize(16)
          .maxLines(2)
        Text(`¥${this.product.price}`)
          .fontSize(18)
          .fontColor('#FF3B30')
          .fontWeight(FontWeight.Bold)
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding(12)
    .backgroundColor('#FFFFFF')
    .borderRadius(8)
  }
}

interface IProduct {
  id: string
  name: string
  price: number
  images: string[]
}
```

### 2.5 文件上传

```typescript
import { http } from '@kit.NetworkKit'
import { fileIo } from '@kit.CoreFileKit'

// 文件上传
async function uploadFile(filePath: string): Promise<string> {
  const httpRequest = http.createHttp()

  try {
    // 读取文件
    const file = fileIo.openSync(filePath, fileIo.OpenMode.READ_ONLY)
    const stat = fileIo.statSync(filePath)
    const buffer = new ArrayBuffer(stat.size)
    fileIo.readSync(file.fd, buffer)
    fileIo.closeSync(file)

    // 构建FormData
    const boundary = `----FormBoundary${Date.now()}`
    const fileName = filePath.split('/').pop() || 'file'
    
    // 这里简化处理，实际需要构建multipart/form-data格式
    const response = await httpRequest.request(
      'https://api.example.com/upload',
      {
        method: http.RequestMethod.POST,
        header: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        extraData: buffer
      }
    )

    if (response.responseCode === 200) {
      const result = JSON.parse(response.result as string)
      return result.data.url
    }
    throw new Error('上传失败')
  } finally {
    httpRequest.destroy()
  }
}

// 企业级实战：图片上传组件
@Component
struct ImageUploader {
  @State images: string[] = []
  @State uploading: boolean = false
  @Prop maxCount: number = 9
  onImagesChange?: (images: string[]) => void

  async selectAndUpload(): Promise<void> {
    // 调用图片选择器
    // const result = await picker.select({ ... })
    // 上传图片
    // const url = await uploadFile(result.uri)
    // this.images = [...this.images, url]
    // this.onImagesChange?.(this.images)
  }

  removeImage(index: number): void {
    this.images = this.images.filter((_, i) => i !== index)
    this.onImagesChange?.(this.images)
  }

  build() {
    Flex({ wrap: FlexWrap.Wrap }) {
      ForEach(this.images, (image: string, index: number) => {
        Stack({ alignContent: Alignment.TopEnd }) {
          Image(image)
            .width(80)
            .height(80)
            .borderRadius(4)
            .objectFit(ImageFit.Cover)

          Image($r('app.media.ic_close'))
            .width(20)
            .height(20)
            .onClick(() => this.removeImage(index))
        }
        .margin({ right: 8, bottom: 8 })
      })

      if (this.images.length < this.maxCount) {
        Column() {
          if (this.uploading) {
            LoadingProgress()
              .width(24)
              .height(24)
          } else {
            Image($r('app.media.ic_add'))
              .width(30)
              .height(30)
            Text('添加图片')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ top: 4 })
          }
        }
        .width(80)
        .height(80)
        .backgroundColor('#F5F5F5')
        .borderRadius(4)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          if (!this.uploading) {
            this.selectAndUpload()
          }
        })
      }
    }
    .width('100%')
  }
}
```

---

## 3. 数据持久化存储

### 3.1 Preferences轻量级存储

```typescript
import { preferences } from '@kit.ArkData'
import { common } from '@kit.AbilityKit'

// Preferences工具类封装
class PreferencesUtil {
  private static preferencesName: string = 'app_preferences'
  private static preferences: preferences.Preferences | null = null

  // 初始化
  static async init(context: common.UIAbilityContext): Promise<void> {
    this.preferences = await preferences.getPreferences(context, this.preferencesName)
  }

  // 存储字符串
  static async setString(key: string, value: string): Promise<void> {
    if (this.preferences) {
      await this.preferences.put(key, value)
      await this.preferences.flush()
    }
  }

  // 获取字符串
  static getString(key: string, defaultValue: string = ''): string {
    if (this.preferences) {
      return this.preferences.getSync(key, defaultValue) as string
    }
    return defaultValue
  }

  // 存储数字
  static async setNumber(key: string, value: number): Promise<void> {
    if (this.preferences) {
      await this.preferences.put(key, value)
      await this.preferences.flush()
    }
  }

  // 获取数字
  static getNumber(key: string, defaultValue: number = 0): number {
    if (this.preferences) {
      return this.preferences.getSync(key, defaultValue) as number
    }
    return defaultValue
  }

  // 存储布尔值
  static async setBoolean(key: string, value: boolean): Promise<void> {
    if (this.preferences) {
      await this.preferences.put(key, value)
      await this.preferences.flush()
    }
  }

  // 获取布尔值
  static getBoolean(key: string, defaultValue: boolean = false): boolean {
    if (this.preferences) {
      return this.preferences.getSync(key, defaultValue) as boolean
    }
    return defaultValue
  }

  // 存储对象
  static async setObject<T>(key: string, value: T): Promise<void> {
    await this.setString(key, JSON.stringify(value))
  }

  // 获取对象
  static getObject<T>(key: string): T | null {
    const json = this.getString(key)
    if (json) {
      try {
        return JSON.parse(json) as T
      } catch {
        return null
      }
    }
    return null
  }

  // 删除键
  static async remove(key: string): Promise<void> {
    if (this.preferences) {
      await this.preferences.delete(key)
      await this.preferences.flush()
    }
  }

  // 清空所有
  static async clear(): Promise<void> {
    if (this.preferences) {
      await this.preferences.clear()
      await this.preferences.flush()
    }
  }

  // 检查键是否存在
  static has(key: string): boolean {
    if (this.preferences) {
      return this.preferences.hasSync(key)
    }
    return false
  }
}

// 在EntryAbility中初始化
// export default class EntryAbility extends UIAbility {
//   onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
//     PreferencesUtil.init(this.context)
//   }
// }

// 使用示例
// 保存用户Token
// await PreferencesUtil.setString('token', 'xxx')
// 获取Token
// const token = PreferencesUtil.getString('token')
// 保存用户信息
// await PreferencesUtil.setObject('user', { id: '1', name: '张三' })
// 获取用户信息
// const user = PreferencesUtil.getObject<IUser>('user')
```

### 3.2 关系型数据库

```typescript
import { relationalStore } from '@kit.ArkData'
import { common } from '@kit.AbilityKit'

// 数据库配置
const DB_CONFIG: relationalStore.StoreConfig = {
  name: 'app.db',
  securityLevel: relationalStore.SecurityLevel.S1
}

// 表结构定义
const SQL_CREATE_PRODUCT_TABLE = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT,
    category_id TEXT,
    stock INTEGER DEFAULT 0,
    create_time INTEGER
  )
`

const SQL_CREATE_CART_TABLE = `
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    selected INTEGER DEFAULT 1,
    create_time INTEGER
  )
`

const SQL_CREATE_SEARCH_HISTORY_TABLE = `
  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT NOT NULL UNIQUE,
    create_time INTEGER
  )
`

// 数据库管理类
class DatabaseManager {
  private static instance: DatabaseManager | null = null
  private rdbStore: relationalStore.RdbStore | null = null

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  // 初始化数据库
  async init(context: common.UIAbilityContext): Promise<void> {
    this.rdbStore = await relationalStore.getRdbStore(context, DB_CONFIG)
    
    // 创建表
    await this.rdbStore.executeSql(SQL_CREATE_PRODUCT_TABLE)
    await this.rdbStore.executeSql(SQL_CREATE_CART_TABLE)
    await this.rdbStore.executeSql(SQL_CREATE_SEARCH_HISTORY_TABLE)
  }

  getStore(): relationalStore.RdbStore | null {
    return this.rdbStore
  }
}

// 购物车数据访问对象
class CartDAO {
  private getStore(): relationalStore.RdbStore {
    const store = DatabaseManager.getInstance().getStore()
    if (!store) throw new Error('数据库未初始化')
    return store
  }

  // 添加到购物车
  async addToCart(productId: string, quantity: number = 1): Promise<void> {
    const store = this.getStore()
    
    // 检查是否已存在
    const predicates = new relationalStore.RdbPredicates('cart')
    predicates.equalTo('product_id', productId)
    const resultSet = await store.query(predicates, ['id', 'quantity'])
    
    if (resultSet.rowCount > 0) {
      // 已存在，更新数量
      resultSet.goToFirstRow()
      const existingQuantity = resultSet.getLong(resultSet.getColumnIndex('quantity'))
      const id = resultSet.getLong(resultSet.getColumnIndex('id'))
      resultSet.close()
      
      const valueBucket: relationalStore.ValuesBucket = {
        quantity: existingQuantity + quantity
      }
      const updatePredicates = new relationalStore.RdbPredicates('cart')
      updatePredicates.equalTo('id', id)
      await store.update(valueBucket, updatePredicates)
    } else {
      // 不存在，插入新记录
      resultSet.close()
      const valueBucket: relationalStore.ValuesBucket = {
        product_id: productId,
        quantity: quantity,
        selected: 1,
        create_time: Date.now()
      }
      await store.insert('cart', valueBucket)
    }
  }

  // 更新购物车商品数量
  async updateQuantity(productId: string, quantity: number): Promise<void> {
    const store = this.getStore()
    const valueBucket: relationalStore.ValuesBucket = { quantity }
    const predicates = new relationalStore.RdbPredicates('cart')
    predicates.equalTo('product_id', productId)
    await store.update(valueBucket, predicates)
  }

  // 更新选中状态
  async updateSelected(productId: string, selected: boolean): Promise<void> {
    const store = this.getStore()
    const valueBucket: relationalStore.ValuesBucket = { selected: selected ? 1 : 0 }
    const predicates = new relationalStore.RdbPredicates('cart')
    predicates.equalTo('product_id', productId)
    await store.update(valueBucket, predicates)
  }

  // 全选/取消全选
  async updateAllSelected(selected: boolean): Promise<void> {
    const store = this.getStore()
    const valueBucket: relationalStore.ValuesBucket = { selected: selected ? 1 : 0 }
    const predicates = new relationalStore.RdbPredicates('cart')
    await store.update(valueBucket, predicates)
  }

  // 从购物车删除
  async removeFromCart(productId: string): Promise<void> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('cart')
    predicates.equalTo('product_id', productId)
    await store.delete(predicates)
  }

  // 清空购物车
  async clearCart(): Promise<void> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('cart')
    await store.delete(predicates)
  }

  // 获取购物车列表
  async getCartList(): Promise<ICartItem[]> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('cart')
    predicates.orderByDesc('create_time')
    
    const resultSet = await store.query(predicates, ['id', 'product_id', 'quantity', 'selected'])
    const items: ICartItem[] = []
    
    while (resultSet.goToNextRow()) {
      items.push({
        id: resultSet.getLong(resultSet.getColumnIndex('id')),
        productId: resultSet.getString(resultSet.getColumnIndex('product_id')),
        quantity: resultSet.getLong(resultSet.getColumnIndex('quantity')),
        selected: resultSet.getLong(resultSet.getColumnIndex('selected')) === 1
      })
    }
    resultSet.close()
    
    return items
  }

  // 获取购物车商品数量
  async getCartCount(): Promise<number> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('cart')
    const resultSet = await store.query(predicates, ['quantity'])
    
    let count = 0
    while (resultSet.goToNextRow()) {
      count += resultSet.getLong(resultSet.getColumnIndex('quantity'))
    }
    resultSet.close()
    
    return count
  }
}

interface ICartItem {
  id: number
  productId: string
  quantity: number
  selected: boolean
}

// 搜索历史数据访问对象
class SearchHistoryDAO {
  private getStore(): relationalStore.RdbStore {
    const store = DatabaseManager.getInstance().getStore()
    if (!store) throw new Error('数据库未初始化')
    return store
  }

  // 添加搜索记录
  async addHistory(keyword: string): Promise<void> {
    const store = this.getStore()
    
    // 先删除已存在的相同关键词
    const deletePredicates = new relationalStore.RdbPredicates('search_history')
    deletePredicates.equalTo('keyword', keyword)
    await store.delete(deletePredicates)
    
    // 插入新记录
    const valueBucket: relationalStore.ValuesBucket = {
      keyword: keyword,
      create_time: Date.now()
    }
    await store.insert('search_history', valueBucket)
    
    // 只保留最近20条
    await this.trimHistory(20)
  }

  // 获取搜索历史
  async getHistory(limit: number = 20): Promise<string[]> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('search_history')
    predicates.orderByDesc('create_time').limitAs(limit)
    
    const resultSet = await store.query(predicates, ['keyword'])
    const keywords: string[] = []
    
    while (resultSet.goToNextRow()) {
      keywords.push(resultSet.getString(resultSet.getColumnIndex('keyword')))
    }
    resultSet.close()
    
    return keywords
  }

  // 删除单条历史
  async removeHistory(keyword: string): Promise<void> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('search_history')
    predicates.equalTo('keyword', keyword)
    await store.delete(predicates)
  }

  // 清空历史
  async clearHistory(): Promise<void> {
    const store = this.getStore()
    const predicates = new relationalStore.RdbPredicates('search_history')
    await store.delete(predicates)
  }

  // 保留最近N条记录
  private async trimHistory(keepCount: number): Promise<void> {
    const store = this.getStore()
    
    // 获取应该删除的记录ID
    const sql = `DELETE FROM search_history WHERE id NOT IN (
      SELECT id FROM search_history ORDER BY create_time DESC LIMIT ${keepCount}
    )`
    await store.executeSql(sql)
  }
}

// 导出单例
export const cartDAO = new CartDAO()
export const searchHistoryDAO = new SearchHistoryDAO()
```

---

## 4. 文件操作

### 4.1 文件读写

```typescript
import { fileIo } from '@kit.CoreFileKit'
import { common } from '@kit.AbilityKit'

// 文件工具类
class FileUtil {
  private static context: common.UIAbilityContext

  static init(context: common.UIAbilityContext): void {
    this.context = context
  }

  // 获取应用文件目录
  static getFilesDir(): string {
    return this.context.filesDir
  }

  // 获取缓存目录
  static getCacheDir(): string {
    return this.context.cacheDir
  }

  // 写入文本文件
  static async writeText(fileName: string, content: string): Promise<void> {
    const filePath = `${this.getFilesDir()}/${fileName}`
    const file = fileIo.openSync(filePath, fileIo.OpenMode.CREATE | fileIo.OpenMode.WRITE_ONLY)
    fileIo.writeSync(file.fd, content)
    fileIo.closeSync(file)
  }

  // 读取文本文件
  static readText(fileName: string): string {
    const filePath = `${this.getFilesDir()}/${fileName}`
    
    if (!fileIo.accessSync(filePath)) {
      return ''
    }

    const file = fileIo.openSync(filePath, fileIo.OpenMode.READ_ONLY)
    const stat = fileIo.statSync(filePath)
    const buffer = new ArrayBuffer(stat.size)
    fileIo.readSync(file.fd, buffer)
    fileIo.closeSync(file)

    const decoder = new util.TextDecoder()
    return decoder.decodeWithStream(new Uint8Array(buffer))
  }

  // 写入JSON文件
  static async writeJson<T>(fileName: string, data: T): Promise<void> {
    await this.writeText(fileName, JSON.stringify(data))
  }

  // 读取JSON文件
  static readJson<T>(fileName: string): T | null {
    const content = this.readText(fileName)
    if (content) {
      try {
        return JSON.parse(content) as T
      } catch {
        return null
      }
    }
    return null
  }

  // 删除文件
  static deleteFile(fileName: string): boolean {
    const filePath = `${this.getFilesDir()}/${fileName}`
    if (fileIo.accessSync(filePath)) {
      fileIo.unlinkSync(filePath)
      return true
    }
    return false
  }

  // 检查文件是否存在
  static exists(fileName: string): boolean {
    const filePath = `${this.getFilesDir()}/${fileName}`
    return fileIo.accessSync(filePath)
  }

  // 获取文件大小
  static getFileSize(fileName: string): number {
    const filePath = `${this.getFilesDir()}/${fileName}`
    if (fileIo.accessSync(filePath)) {
      const stat = fileIo.statSync(filePath)
      return stat.size
    }
    return 0
  }

  // 列出目录文件
  static listFiles(dirName: string = ''): string[] {
    const dirPath = dirName ? `${this.getFilesDir()}/${dirName}` : this.getFilesDir()
    if (fileIo.accessSync(dirPath)) {
      return fileIo.listFileSync(dirPath)
    }
    return []
  }

  // 创建目录
  static createDir(dirName: string): void {
    const dirPath = `${this.getFilesDir()}/${dirName}`
    if (!fileIo.accessSync(dirPath)) {
      fileIo.mkdirSync(dirPath)
    }
  }

  // 复制文件
  static copyFile(srcFileName: string, destFileName: string): void {
    const srcPath = `${this.getFilesDir()}/${srcFileName}`
    const destPath = `${this.getFilesDir()}/${destFileName}`
    fileIo.copyFileSync(srcPath, destPath)
  }

  // 移动文件
  static moveFile(srcFileName: string, destFileName: string): void {
    const srcPath = `${this.getFilesDir()}/${srcFileName}`
    const destPath = `${this.getFilesDir()}/${destFileName}`
    fileIo.moveFileSync(srcPath, destPath)
  }
}

import { util } from '@kit.ArkTS'

// 使用示例
// FileUtil.init(context)
// 
// // 写入配置
// await FileUtil.writeJson('config.json', { theme: 'dark', language: 'zh' })
// 
// // 读取配置
// const config = FileUtil.readJson<{ theme: string, language: string }>('config.json')
```

### 4.2 图片缓存

```typescript
import { http } from '@kit.NetworkKit'
import { fileIo } from '@kit.CoreFileKit'
import { util } from '@kit.ArkTS'

// 图片缓存管理
class ImageCacheManager {
  private static cacheDir: string = ''
  private static maxCacheSize: number = 100 * 1024 * 1024  // 100MB

  static init(cacheDir: string): void {
    this.cacheDir = cacheDir
    // 创建缓存目录
    if (!fileIo.accessSync(this.cacheDir)) {
      fileIo.mkdirSync(this.cacheDir)
    }
  }

  // 生成缓存文件名
  private static getCacheFileName(url: string): string {
    // 使用URL的MD5作为文件名
    const hash = this.hashCode(url)
    const ext = url.split('.').pop()?.split('?')[0] || 'jpg'
    return `${hash}.${ext}`
  }

  // 简单hash函数
  private static hashCode(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }

  // 获取缓存路径
  static getCachePath(url: string): string {
    return `${this.cacheDir}/${this.getCacheFileName(url)}`
  }

  // 检查是否有缓存
  static hasCache(url: string): boolean {
    const cachePath = this.getCachePath(url)
    return fileIo.accessSync(cachePath)
  }

  // 下载并缓存图片
  static async cacheImage(url: string): Promise<string> {
    const cachePath = this.getCachePath(url)
    
    // 已有缓存直接返回
    if (fileIo.accessSync(cachePath)) {
      return cachePath
    }

    // 下载图片
    const httpRequest = http.createHttp()
    try {
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.GET,
        expectDataType: http.HttpDataType.ARRAY_BUFFER
      })

      if (response.responseCode === 200) {
        const buffer = response.result as ArrayBuffer
        const file = fileIo.openSync(cachePath, fileIo.OpenMode.CREATE | fileIo.OpenMode.WRITE_ONLY)
        fileIo.writeSync(file.fd, buffer)
        fileIo.closeSync(file)
        return cachePath
      }
      throw new Error('下载失败')
    } finally {
      httpRequest.destroy()
    }
  }

  // 获取缓存大小
  static getCacheSize(): number {
    if (!fileIo.accessSync(this.cacheDir)) {
      return 0
    }

    let totalSize = 0
    const files = fileIo.listFileSync(this.cacheDir)
    files.forEach(fileName => {
      const filePath = `${this.cacheDir}/${fileName}`
      const stat = fileIo.statSync(filePath)
      totalSize += stat.size
    })
    return totalSize
  }

  // 清理缓存
  static clearCache(): void {
    if (!fileIo.accessSync(this.cacheDir)) {
      return
    }

    const files = fileIo.listFileSync(this.cacheDir)
    files.forEach(fileName => {
      const filePath = `${this.cacheDir}/${fileName}`
      fileIo.unlinkSync(filePath)
    })
  }

  // 清理过期缓存（保留最近使用的）
  static async trimCache(maxSize: number = this.maxCacheSize): Promise<void> {
    const currentSize = this.getCacheSize()
    if (currentSize <= maxSize) {
      return
    }

    // 获取所有缓存文件并按修改时间排序
    const files = fileIo.listFileSync(this.cacheDir)
    const fileInfos = files.map(fileName => {
      const filePath = `${this.cacheDir}/${fileName}`
      const stat = fileIo.statSync(filePath)
      return {
        path: filePath,
        size: stat.size,
        mtime: stat.mtime
      }
    }).sort((a, b) => a.mtime - b.mtime)  // 按修改时间升序

    // 删除最旧的文件直到大小符合要求
    let deletedSize = 0
    const targetDelete = currentSize - maxSize * 0.8  // 清理到80%
    
    for (const fileInfo of fileInfos) {
      if (deletedSize >= targetDelete) {
        break
      }
      fileIo.unlinkSync(fileInfo.path)
      deletedSize += fileInfo.size
    }
  }
}
```

---

## 5. 多媒体能力

### 5.1 图片选择与裁剪

```typescript
import { photoAccessHelper } from '@kit.MediaLibraryKit'
import { common } from '@kit.AbilityKit'

// 图片选择器
class ImagePicker {
  private context: common.UIAbilityContext

  constructor(context: common.UIAbilityContext) {
    this.context = context
  }

  // 选择单张图片
  async pickSingle(): Promise<string | null> {
    const results = await this.pick(1)
    return results.length > 0 ? results[0] : null
  }

  // 选择多张图片
  async pick(maxCount: number = 9): Promise<string[]> {
    try {
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions()
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE
      photoSelectOptions.maxSelectNumber = maxCount

      const photoPicker = new photoAccessHelper.PhotoViewPicker()
      const result = await photoPicker.select(photoSelectOptions)
      
      return result.photoUris || []
    } catch (error) {
      console.error('选择图片失败', error)
      return []
    }
  }

  // 选择头像（单张图片，正方形裁剪）
  async pickAvatar(): Promise<string | null> {
    try {
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions()
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE
      photoSelectOptions.maxSelectNumber = 1
      // 可以添加裁剪配置

      const photoPicker = new photoAccessHelper.PhotoViewPicker()
      const result = await photoPicker.select(photoSelectOptions)
      
      return result.photoUris?.[0] || null
    } catch (error) {
      console.error('选择头像失败', error)
      return null
    }
  }
}

// 使用示例组件
@Entry
@Component
struct ImagePickerDemo {
  @State selectedImages: string[] = []
  @State avatar: string = ''
  private imagePicker: ImagePicker | null = null

  aboutToAppear(): void {
    const context = getContext(this) as common.UIAbilityContext
    this.imagePicker = new ImagePicker(context)
  }

  build() {
    Column({ space: 16 }) {
      // 选择头像
      Column() {
        if (this.avatar) {
          Image(this.avatar)
            .width(80)
            .height(80)
            .borderRadius(40)
        } else {
          Column() {
            Image($r('app.media.ic_camera'))
              .width(30)
              .height(30)
          }
          .width(80)
          .height(80)
          .borderRadius(40)
          .backgroundColor('#F5F5F5')
          .justifyContent(FlexAlign.Center)
        }
      }
      .onClick(async () => {
        const result = await this.imagePicker?.pickAvatar()
        if (result) {
          this.avatar = result
        }
      })

      // 选择多张图片
      Button('选择图片')
        .onClick(async () => {
          const results = await this.imagePicker?.pick(9)
          if (results) {
            this.selectedImages = results
          }
        })

      // 显示已选图片
      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.selectedImages, (uri: string) => {
          Image(uri)
            .width(100)
            .height(100)
            .borderRadius(8)
            .objectFit(ImageFit.Cover)
            .margin({ right: 8, bottom: 8 })
        })
      }
    }
    .padding(16)
  }
}
```

### 5.2 相机拍照

```typescript
import { camera } from '@kit.CameraKit'
import { common } from '@kit.AbilityKit'

// 相机工具类
class CameraUtil {
  // 拍照
  static async takePhoto(context: common.UIAbilityContext): Promise<string | null> {
    try {
      // 获取相机管理器
      const cameraManager = camera.getCameraManager(context)
      
      // 获取相机列表
      const cameras = cameraManager.getSupportedCameras()
      if (cameras.length === 0) {
        console.error('没有可用的相机')
        return null
      }

      // 选择后置相机
      const backCamera = cameras.find(c => c.cameraPosition === camera.CameraPosition.CAMERA_POSITION_BACK)
      const selectedCamera = backCamera || cameras[0]

      // 创建相机输入
      const cameraInput = cameraManager.createCameraInput(selectedCamera)
      await cameraInput.open()

      // 获取支持的输出能力
      const outputCapability = cameraManager.getSupportedOutputCapability(selectedCamera)
      const photoProfiles = outputCapability.photoProfiles

      if (photoProfiles.length === 0) {
        console.error('不支持拍照')
        return null
      }

      // 选择最高分辨率
      const photoProfile = photoProfiles[photoProfiles.length - 1]

      // 创建拍照输出
      const photoOutput = cameraManager.createPhotoOutput(photoProfile)

      // 创建会话
      const captureSession = cameraManager.createCaptureSession()
      captureSession.beginConfig()
      captureSession.addInput(cameraInput)
      captureSession.addOutput(photoOutput)
      await captureSession.commitConfig()
      await captureSession.start()

      // 拍照
      const settings: camera.PhotoCaptureSetting = {
        quality: camera.QualityLevel.QUALITY_LEVEL_HIGH,
        rotation: camera.ImageRotation.ROTATION_0
      }

      return new Promise((resolve) => {
        photoOutput.on('photoAvailable', (err, photo) => {
          if (err) {
            resolve(null)
            return
          }
          // 处理照片...
          resolve(photo.uri)
        })
        photoOutput.capture(settings)
      })
    } catch (error) {
      console.error('拍照失败', error)
      return null
    }
  }
}
```

### 5.3 视频播放

```typescript
import { media } from '@kit.MediaKit'

@Entry
@Component
struct VideoPlayerDemo {
  @State isPlaying: boolean = false
  @State currentTime: number = 0
  @State duration: number = 0
  @State progress: number = 0
  private videoController: VideoController = new VideoController()

  build() {
    Column() {
      // 视频播放器
      Video({
        src: 'https://example.com/video.mp4',
        controller: this.videoController
      })
      .width('100%')
      .height(200)
      .autoPlay(false)
      .controls(false)  // 隐藏默认控制栏
      .onStart(() => {
        this.isPlaying = true
      })
      .onPause(() => {
        this.isPlaying = false
      })
      .onFinish(() => {
        this.isPlaying = false
        this.currentTime = 0
        this.progress = 0
      })
      .onPrepared((e) => {
        this.duration = e.duration
      })
      .onUpdate((e) => {
        this.currentTime = e.time
        this.progress = this.duration > 0 ? e.time / this.duration * 100 : 0
      })

      // 自定义控制栏
      Column({ space: 12 }) {
        // 进度条
        Slider({
          value: this.progress,
          min: 0,
          max: 100,
          step: 0.1
        })
        .width('100%')
        .onChange((value) => {
          const seekTime = value / 100 * this.duration
          this.videoController.setCurrentTime(seekTime)
        })

        // 控制按钮和时间
        Row() {
          Text(this.formatTime(this.currentTime))
            .fontSize(12)
            .fontColor('#666666')

          Blank()

          // 播放/暂停按钮
          Image(this.isPlaying ? $r('app.media.ic_pause') : $r('app.media.ic_play'))
            .width(40)
            .height(40)
            .onClick(() => {
              if (this.isPlaying) {
                this.videoController.pause()
              } else {
                this.videoController.start()
              }
            })

          Blank()

          Text(this.formatTime(this.duration))
            .fontSize(12)
            .fontColor('#666666')
        }
        .width('100%')
      }
      .padding(16)
    }
    .width('100%')
  }

  // 格式化时间
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

// 企业级实战：视频列表播放器（类似抖音）
@Entry
@Component
struct VideoListPlayer {
  @State videos: IVideo[] = []
  @State currentIndex: number = 0
  private swiperController: SwiperController = new SwiperController()

  aboutToAppear(): void {
    this.videos = [
      { id: '1', url: 'https://example.com/video1.mp4', title: '视频1' },
      { id: '2', url: 'https://example.com/video2.mp4', title: '视频2' },
      { id: '3', url: 'https://example.com/video3.mp4', title: '视频3' }
    ]
  }

  build() {
    Swiper(this.swiperController) {
      ForEach(this.videos, (video: IVideo, index: number) => {
        VideoItem({
          video: video,
          isActive: this.currentIndex === index
        })
      })
    }
    .vertical(true)
    .loop(false)
    .indicator(false)
    .onChange((index) => {
      this.currentIndex = index
    })
    .width('100%')
    .height('100%')
  }
}

@Component
struct VideoItem {
  @Prop video: IVideo = {} as IVideo
  @Prop isActive: boolean = false
  @State isPlaying: boolean = false
  private videoController: VideoController = new VideoController()

  // 当isActive变化时控制播放
  onActiveChange(): void {
    if (this.isActive) {
      this.videoController.start()
      this.isPlaying = true
    } else {
      this.videoController.pause()
      this.isPlaying = false
    }
  }

  build() {
    Stack() {
      Video({
        src: this.video.url,
        controller: this.videoController
      })
      .width('100%')
      .height('100%')
      .objectFit(ImageFit.Cover)
      .autoPlay(this.isActive)
      .loop(true)
      .controls(false)
      .onClick(() => {
        if (this.isPlaying) {
          this.videoController.pause()
        } else {
          this.videoController.start()
        }
        this.isPlaying = !this.isPlaying
      })

      // 暂停图标
      if (!this.isPlaying) {
        Image($r('app.media.ic_play_big'))
          .width(60)
          .height(60)
      }

      // 视频信息
      Column() {
        Text(this.video.title)
          .fontSize(16)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Bold)
      }
      .position({ x: 16, y: '80%' })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#000000')
  }
}

interface IVideo {
  id: string
  url: string
  title: string
}
```

---

## 企业级最佳实践总结

### 网络请求规范

1. **统一封装**：使用HttpClient统一管理请求
2. **错误处理**：统一处理网络错误和业务错误
3. **Token管理**：自动处理Token过期和刷新
4. **请求拦截**：添加通用请求头、签名等
5. **响应拦截**：统一处理响应数据格式

### 数据存储选择

| 场景 | 推荐方案 |
|------|---------|
| 简单配置 | Preferences |
| 结构化数据 | 关系型数据库 |
| 文件缓存 | 文件系统 |
| 临时数据 | 内存状态 |

### 路由管理

1. **集中管理**：使用RouterUtil统一管理跳转
2. **参数类型安全**：定义路由参数接口
3. **路由守卫**：实现登录拦截等逻辑
4. **页面栈管理**：合理控制栈深度

---

*下一篇：动画与高级特性*
