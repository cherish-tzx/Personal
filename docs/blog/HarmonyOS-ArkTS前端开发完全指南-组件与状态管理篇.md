# HarmonyOS ArkTS前端开发完全指南 - 组件与状态管理篇

> 本文档全面总结HarmonyOS ArkUI组件系统和状态管理，结合企业级大厂项目实战经验

---
<div class="doc-toc">
## 目录

1. [ArkUI组件基础](#1-arkui组件基础)
2. [布局组件详解](#2-布局组件详解)
3. [基础组件详解](#3-基础组件详解)
4. [列表与滚动组件](#4-列表与滚动组件)
5. [状态管理详解](#5-状态管理详解)
6. [组件通信机制](#6-组件通信机制)
7. [组件生命周期](#7-组件生命周期)


</div>

---

## 1. ArkUI组件基础

### 1.1 组件结构

```typescript
@Component
struct ComponentName {
  // 1. 状态变量声明
  @State private count: number = 0
  
  // 2. 普通成员变量
  private title: string = '标题'
  
  // 3. 生命周期回调
  aboutToAppear(): void {
    console.info('组件即将显示')
  }
  
  aboutToDisappear(): void {
    console.info('组件即将销毁')
  }
  
  // 4. 自定义方法
  private handleClick(): void {
    this.count++
  }
  
  // 5. Builder函数
  @Builder
  private itemBuilder(text: string) {
    Text(text)
  }
  
  // 6. build方法 (必须)
  build() {
    Column() {
      Text(this.title)
      Text(`计数: ${this.count}`)
      Button('点击')
        .onClick(() => this.handleClick())
    }
  }
}
```

### 1.2 自定义组件封装

```typescript
// ============ 企业级按钮组件 ============
@Component
export struct AppButton {
  // 属性定义
  @Prop text: string = ''
  @Prop type: 'primary' | 'secondary' | 'danger' | 'text' = 'primary'
  @Prop size: 'large' | 'medium' | 'small' = 'medium'
  @Prop disabled: boolean = false
  @Prop loading: boolean = false
  @Prop block: boolean = false
  
  // 事件回调
  onButtonClick?: () => void

  // 根据type获取背景色
  private getBackgroundColor(): ResourceColor {
    if (this.disabled) return '#CCCCCC'
    switch (this.type) {
      case 'primary': return '#007AFF'
      case 'secondary': return '#F5F5F5'
      case 'danger': return '#FF3B30'
      case 'text': return Color.Transparent
      default: return '#007AFF'
    }
  }

  // 根据type获取文字颜色
  private getFontColor(): ResourceColor {
    if (this.disabled) return '#999999'
    switch (this.type) {
      case 'primary': return '#FFFFFF'
      case 'secondary': return '#333333'
      case 'danger': return '#FFFFFF'
      case 'text': return '#007AFF'
      default: return '#FFFFFF'
    }
  }

  // 根据size获取高度
  private getHeight(): Length {
    switch (this.size) {
      case 'large': return 52
      case 'medium': return 44
      case 'small': return 32
      default: return 44
    }
  }

  // 根据size获取字体大小
  private getFontSize(): number {
    switch (this.size) {
      case 'large': return 18
      case 'medium': return 16
      case 'small': return 14
      default: return 16
    }
  }

  build() {
    Button({ type: ButtonType.Normal }) {
      Row() {
        if (this.loading) {
          LoadingProgress()
            .width(20)
            .height(20)
            .color(this.getFontColor())
            .margin({ right: 8 })
        }
        Text(this.text)
          .fontSize(this.getFontSize())
          .fontColor(this.getFontColor())
      }
    }
    .width(this.block ? '100%' : 'auto')
    .height(this.getHeight())
    .backgroundColor(this.getBackgroundColor())
    .borderRadius(8)
    .padding({ left: 24, right: 24 })
    .enabled(!this.disabled && !this.loading)
    .onClick(() => {
      if (this.onButtonClick && !this.disabled && !this.loading) {
        this.onButtonClick()
      }
    })
  }
}

// 使用示例
@Entry
@Component
struct ButtonDemo {
  @State loading: boolean = false

  build() {
    Column({ space: 16 }) {
      AppButton({
        text: '主要按钮',
        type: 'primary',
        onButtonClick: () => console.info('点击主要按钮')
      })
      
      AppButton({
        text: '次要按钮',
        type: 'secondary'
      })
      
      AppButton({
        text: '危险按钮',
        type: 'danger'
      })
      
      AppButton({
        text: '加载中',
        loading: this.loading,
        block: true,
        onButtonClick: () => {
          this.loading = true
          setTimeout(() => { this.loading = false }, 2000)
        }
      })
      
      AppButton({
        text: '禁用按钮',
        disabled: true
      })
    }
    .padding(16)
  }
}
```

---

## 2. 布局组件详解

### 2.1 Column - 垂直布局

```typescript
@Entry
@Component
struct ColumnDemo {
  build() {
    Column({ space: 12 }) {
      // 基础用法
      Text('项目1')
      Text('项目2')
      Text('项目3')
    }
    .width('100%')
    .height('100%')
    .padding(16)
    // 主轴对齐方式 (垂直方向)
    .justifyContent(FlexAlign.Start)     // Start/Center/End/SpaceBetween/SpaceAround/SpaceEvenly
    // 交叉轴对齐方式 (水平方向)
    .alignItems(HorizontalAlign.Center)  // Start/Center/End
  }
}

// 企业级实战：登录页面布局
@Entry
@Component
struct LoginPage {
  @State username: string = ''
  @State password: string = ''

  build() {
    Column() {
      // 顶部Logo区域
      Column() {
        Image($r('app.media.logo'))
          .width(80)
          .height(80)
        Text('欢迎登录')
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .margin({ top: 16 })
      }
      .margin({ top: 80 })

      // 表单区域
      Column({ space: 16 }) {
        TextInput({ placeholder: '请输入用户名' })
          .height(48)
          .onChange((value) => { this.username = value })

        TextInput({ placeholder: '请输入密码' })
          .type(InputType.Password)
          .height(48)
          .onChange((value) => { this.password = value })

        Button('登录')
          .width('100%')
          .height(48)
          .margin({ top: 24 })
      }
      .width('100%')
      .padding({ left: 32, right: 32 })
      .margin({ top: 60 })

      // 底部辅助操作
      Row({ space: 24 }) {
        Text('忘记密码')
          .fontSize(14)
          .fontColor('#007AFF')
        Text('注册账号')
          .fontSize(14)
          .fontColor('#007AFF')
      }
      .margin({ top: 24 })

      // 弹性空间
      Blank()

      // 底部协议
      Text('登录即同意《用户协议》和《隐私政策》')
        .fontSize(12)
        .fontColor('#999999')
        .margin({ bottom: 40 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}
```

### 2.2 Row - 水平布局

```typescript
@Entry
@Component
struct RowDemo {
  build() {
    Row({ space: 12 }) {
      Text('左侧')
      Text('中间')
      Text('右侧')
    }
    .width('100%')
    .height(60)
    .padding({ left: 16, right: 16 })
    // 主轴对齐方式 (水平方向)
    .justifyContent(FlexAlign.SpaceBetween)
    // 交叉轴对齐方式 (垂直方向)
    .alignItems(VerticalAlign.Center)
  }
}

// 企业级实战：导航栏组件
@Component
export struct NavBar {
  @Prop title: string = ''
  @Prop showBack: boolean = true
  @Prop rightText: string = ''
  onBackClick?: () => void
  onRightClick?: () => void

  build() {
    Row() {
      // 左侧返回按钮
      if (this.showBack) {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .onClick(() => {
            this.onBackClick?.()
          })
      } else {
        Blank().width(24)
      }

      // 中间标题
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .layoutWeight(1)
        .textAlign(TextAlign.Center)

      // 右侧操作
      if (this.rightText) {
        Text(this.rightText)
          .fontSize(16)
          .fontColor('#007AFF')
          .onClick(() => {
            this.onRightClick?.()
          })
      } else {
        Blank().width(24)
      }
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
  }
}

// 企业级实战：商品列表项
@Component
struct ProductListItem {
  @Prop product: IProduct = {} as IProduct

  build() {
    Row({ space: 12 }) {
      // 商品图片
      Image(this.product.image)
        .width(100)
        .height(100)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)

      // 商品信息
      Column({ space: 4 }) {
        Text(this.product.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Text(this.product.description)
          .fontSize(14)
          .fontColor('#666666')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Blank()

        Row() {
          Text(`¥${this.product.price}`)
            .fontSize(18)
            .fontColor('#FF3B30')
            .fontWeight(FontWeight.Bold)

          Blank()

          Text(`已售${this.product.salesCount}`)
            .fontSize(12)
            .fontColor('#999999')
        }
        .width('100%')
      }
      .layoutWeight(1)
      .height(100)
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding(12)
    .backgroundColor('#FFFFFF')
  }
}

interface IProduct {
  id: string
  name: string
  description: string
  image: string
  price: number
  salesCount: number
}
```

### 2.3 Flex - 弹性布局

```typescript
@Entry
@Component
struct FlexDemo {
  build() {
    Column({ space: 20 }) {
      // 基础Flex布局
      Flex({
        direction: FlexDirection.Row,        // Row/RowReverse/Column/ColumnReverse
        wrap: FlexWrap.Wrap,                 // NoWrap/Wrap/WrapReverse
        justifyContent: FlexAlign.Start,     // 主轴对齐
        alignItems: ItemAlign.Center,        // 交叉轴对齐
        alignContent: FlexAlign.Start        // 多行对齐
      }) {
        Text('1').width(100).height(50).backgroundColor('#FF0000')
        Text('2').width(100).height(50).backgroundColor('#00FF00')
        Text('3').width(100).height(50).backgroundColor('#0000FF')
        Text('4').width(100).height(50).backgroundColor('#FFFF00')
        Text('5').width(100).height(50).backgroundColor('#FF00FF')
      }
      .width('100%')
      .height(150)
      .backgroundColor('#F5F5F5')
    }
    .padding(16)
  }
}

// 企业级实战：标签选择器
@Component
struct TagSelector {
  @State selectedTags: string[] = []
  private tags: string[] = ['推荐', '新品', '热销', '优惠', '限时', '包邮', '正品', '自营']

  build() {
    Flex({
      wrap: FlexWrap.Wrap,
      justifyContent: FlexAlign.Start
    }) {
      ForEach(this.tags, (tag: string) => {
        Text(tag)
          .fontSize(14)
          .fontColor(this.selectedTags.includes(tag) ? '#FFFFFF' : '#333333')
          .backgroundColor(this.selectedTags.includes(tag) ? '#007AFF' : '#F5F5F5')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          .borderRadius(16)
          .margin({ right: 8, bottom: 8 })
          .onClick(() => {
            if (this.selectedTags.includes(tag)) {
              this.selectedTags = this.selectedTags.filter(t => t !== tag)
            } else {
              this.selectedTags = [...this.selectedTags, tag]
            }
          })
      })
    }
    .width('100%')
  }
}
```

### 2.4 Stack - 层叠布局

```typescript
@Entry
@Component
struct StackDemo {
  build() {
    Stack({
      alignContent: Alignment.Center  // TopStart/Top/TopEnd/Start/Center/End/BottomStart/Bottom/BottomEnd
    }) {
      // 底层
      Image($r('app.media.background'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)

      // 中层
      Column() {
        Text('标题')
          .fontSize(24)
          .fontColor('#FFFFFF')
      }

      // 顶层 - 角标
      Text('NEW')
        .fontSize(12)
        .fontColor('#FFFFFF')
        .backgroundColor('#FF3B30')
        .padding({ left: 8, right: 8, top: 4, bottom: 4 })
        .borderRadius(4)
        .position({ x: 10, y: 10 })
    }
    .width('100%')
    .height(200)
  }
}

// 企业级实战：商品卡片带角标
@Component
struct ProductCard {
  @Prop product: IProductCard = {} as IProductCard

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      // 卡片主体
      Column() {
        Image(this.product.image)
          .width('100%')
          .aspectRatio(1)
          .objectFit(ImageFit.Cover)

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

            if (this.product.originalPrice) {
              Text(`¥${this.product.originalPrice}`)
                .fontSize(12)
                .fontColor('#999999')
                .decoration({ type: TextDecorationType.LineThrough })
                .margin({ left: 4 })
            }
          }
        }
        .padding(8)
        .alignItems(HorizontalAlign.Start)
      }
      .backgroundColor('#FFFFFF')
      .borderRadius(8)

      // 角标
      if (this.product.tag) {
        Text(this.product.tag)
          .fontSize(10)
          .fontColor('#FFFFFF')
          .backgroundColor('#FF3B30')
          .padding({ left: 6, right: 6, top: 2, bottom: 2 })
          .borderRadius({ topLeft: 8, bottomRight: 8 })
      }

      // 售罄遮罩
      if (this.product.soldOut) {
        Column() {
          Text('已售罄')
            .fontSize(16)
            .fontColor('#FFFFFF')
        }
        .width('100%')
        .height('100%')
        .backgroundColor('rgba(0,0,0,0.5)')
        .justifyContent(FlexAlign.Center)
        .borderRadius(8)
      }
    }
    .width('100%')
  }
}

interface IProductCard {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  tag?: string
  soldOut?: boolean
}
```

### 2.5 Grid - 网格布局

```typescript
@Entry
@Component
struct GridDemo {
  @State items: number[] = Array.from({ length: 12 }, (_, i) => i + 1)

  build() {
    Column() {
      // 基础网格
      Grid() {
        ForEach(this.items, (item: number) => {
          GridItem() {
            Text(`${item}`)
              .fontSize(16)
              .width('100%')
              .height('100%')
              .textAlign(TextAlign.Center)
              .backgroundColor('#F5F5F5')
          }
        })
      }
      .columnsTemplate('1fr 1fr 1fr')  // 3列等宽
      .rowsTemplate('1fr 1fr 1fr 1fr')  // 4行等高
      .columnsGap(10)  // 列间距
      .rowsGap(10)     // 行间距
      .width('100%')
      .height(400)
    }
    .padding(16)
  }
}

// 企业级实战：分类导航网格
@Component
struct CategoryGrid {
  private categories: ICategory[] = [
    { id: '1', name: '手机数码', icon: $r('app.media.ic_phone') },
    { id: '2', name: '电脑办公', icon: $r('app.media.ic_computer') },
    { id: '3', name: '家用电器', icon: $r('app.media.ic_appliance') },
    { id: '4', name: '服装鞋帽', icon: $r('app.media.ic_clothing') },
    { id: '5', name: '食品生鲜', icon: $r('app.media.ic_food') },
    { id: '6', name: '美妆护肤', icon: $r('app.media.ic_beauty') },
    { id: '7', name: '母婴玩具', icon: $r('app.media.ic_baby') },
    { id: '8', name: '运动户外', icon: $r('app.media.ic_sports') },
    { id: '9', name: '图书文具', icon: $r('app.media.ic_book') },
    { id: '10', name: '更多分类', icon: $r('app.media.ic_more') }
  ]
  
  onCategoryClick?: (category: ICategory) => void

  build() {
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
          .width('100%')
          .padding({ top: 12, bottom: 12 })
          .onClick(() => {
            this.onCategoryClick?.(category)
          })
        }
      })
    }
    .columnsTemplate('1fr 1fr 1fr 1fr 1fr')  // 5列
    .rowsGap(8)
    .width('100%')
    .backgroundColor('#FFFFFF')
    .padding({ top: 8, bottom: 8 })
  }
}

interface ICategory {
  id: string
  name: string
  icon: Resource
}

// 企业级实战：不规则网格布局（瀑布流效果）
@Component
struct IrregularGrid {
  build() {
    Grid() {
      // 大图占2列2行
      GridItem() {
        Image($r('app.media.banner1'))
          .width('100%')
          .height('100%')
          .objectFit(ImageFit.Cover)
      }
      .rowStart(0)
      .rowEnd(2)
      .columnStart(0)
      .columnEnd(2)

      // 小图
      GridItem() {
        Image($r('app.media.banner2'))
          .width('100%')
          .height('100%')
          .objectFit(ImageFit.Cover)
      }

      GridItem() {
        Image($r('app.media.banner3'))
          .width('100%')
          .height('100%')
          .objectFit(ImageFit.Cover)
      }
    }
    .columnsTemplate('1fr 1fr 1fr')
    .rowsTemplate('1fr 1fr')
    .columnsGap(8)
    .rowsGap(8)
    .width('100%')
    .height(200)
  }
}
```

### 2.6 RelativeContainer - 相对布局

```typescript
@Entry
@Component
struct RelativeContainerDemo {
  build() {
    RelativeContainer() {
      // 顶部标题
      Text('标题')
        .id('title')
        .fontSize(20)
        .alignRules({
          top: { anchor: '__container__', align: VerticalAlign.Top },
          left: { anchor: '__container__', align: HorizontalAlign.Start }
        })
        .margin({ top: 16, left: 16 })

      // 副标题 - 相对于标题定位
      Text('副标题')
        .id('subtitle')
        .fontSize(14)
        .fontColor('#666666')
        .alignRules({
          top: { anchor: 'title', align: VerticalAlign.Bottom },
          left: { anchor: 'title', align: HorizontalAlign.Start }
        })
        .margin({ top: 8 })

      // 右侧按钮
      Button('操作')
        .id('action')
        .alignRules({
          top: { anchor: '__container__', align: VerticalAlign.Top },
          right: { anchor: '__container__', align: HorizontalAlign.End }
        })
        .margin({ top: 16, right: 16 })

      // 底部内容
      Text('底部内容')
        .id('bottom')
        .alignRules({
          bottom: { anchor: '__container__', align: VerticalAlign.Bottom },
          center: { anchor: '__container__', align: HorizontalAlign.Center }
        })
        .margin({ bottom: 16 })
    }
    .width('100%')
    .height(300)
    .backgroundColor('#F5F5F5')
  }
}
```

---

## 3. 基础组件详解

### 3.1 Text - 文本组件

```typescript
@Entry
@Component
struct TextDemo {
  build() {
    Column({ space: 16 }) {
      // 基础文本
      Text('普通文本')
        .fontSize(16)
        .fontColor('#333333')

      // 富文本样式
      Text('粗体文本')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontStyle(FontStyle.Italic)

      // 文本对齐
      Text('居中对齐的文本内容')
        .width('100%')
        .textAlign(TextAlign.Center)

      // 文本溢出处理
      Text('这是一段很长的文本内容，需要进行溢出处理，超出部分显示省略号')
        .width('100%')
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      // 文本装饰
      Text('删除线文本')
        .decoration({
          type: TextDecorationType.LineThrough,
          color: '#FF3B30'
        })

      Text('下划线文本')
        .decoration({
          type: TextDecorationType.Underline,
          color: '#007AFF'
        })

      // 行高和字间距
      Text('设置行高和字间距的文本内容，这是第一行。这是第二行内容。')
        .lineHeight(28)
        .letterSpacing(2)

      // 文本阴影
      Text('阴影文本')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .textShadow({
          radius: 5,
          color: 'rgba(0,0,0,0.3)',
          offsetX: 2,
          offsetY: 2
        })

      // Span - 富文本片段
      Text() {
        Span('普通文本')
        Span('红色文本').fontColor('#FF3B30')
        Span('蓝色粗体').fontColor('#007AFF').fontWeight(FontWeight.Bold)
      }
    }
    .padding(16)
  }
}

// 企业级实战：价格显示组件
@Component
struct PriceText {
  @Prop price: number = 0
  @Prop originalPrice?: number
  @Prop size: 'large' | 'medium' | 'small' = 'medium'

  private getFontSize(): number {
    switch (this.size) {
      case 'large': return 24
      case 'medium': return 18
      case 'small': return 14
    }
  }

  build() {
    Row({ space: 4 }) {
      Text() {
        Span('¥').fontSize(this.getFontSize() - 4)
        Span(this.price.toFixed(2)).fontSize(this.getFontSize())
      }
      .fontColor('#FF3B30')
      .fontWeight(FontWeight.Bold)

      if (this.originalPrice && this.originalPrice > this.price) {
        Text(`¥${this.originalPrice.toFixed(2)}`)
          .fontSize(this.getFontSize() - 4)
          .fontColor('#999999')
          .decoration({ type: TextDecorationType.LineThrough })
      }
    }
  }
}
```

### 3.2 Image - 图片组件

```typescript
@Entry
@Component
struct ImageDemo {
  build() {
    Column({ space: 16 }) {
      // 本地资源图片
      Image($r('app.media.icon'))
        .width(100)
        .height(100)

      // 网络图片
      Image('https://example.com/image.jpg')
        .width(200)
        .height(150)
        .objectFit(ImageFit.Cover)

      // Base64图片
      Image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...')
        .width(100)
        .height(100)

      // 图片填充模式
      // Contain: 保持宽高比缩放，完整显示
      // Cover: 保持宽高比缩放，填满容器
      // Fill: 拉伸填满容器
      // None: 保持原始尺寸
      // ScaleDown: 等比缩小或不变
      Image($r('app.media.photo'))
        .width(200)
        .height(150)
        .objectFit(ImageFit.Cover)

      // 圆形图片
      Image($r('app.media.avatar'))
        .width(80)
        .height(80)
        .borderRadius(40)  // 半径为宽高的一半

      // 圆角图片
      Image($r('app.media.banner'))
        .width('100%')
        .height(150)
        .borderRadius(12)

      // 图片加载事件
      Image('https://example.com/image.jpg')
        .width(200)
        .height(150)
        .onComplete((event) => {
          console.info(`图片加载完成: ${event?.width} x ${event?.height}`)
        })
        .onError(() => {
          console.error('图片加载失败')
        })
    }
    .padding(16)
  }
}

// 企业级实战：带占位图和错误处理的图片组件
@Component
struct NetworkImage {
  @Prop src: string = ''
  @Prop width: Length = 100
  @Prop height: Length = 100
  @Prop borderRadius: Length = 0
  @State loadStatus: 'loading' | 'success' | 'error' = 'loading'

  build() {
    Stack() {
      if (this.loadStatus === 'loading') {
        // 加载中占位
        Column() {
          LoadingProgress()
            .width(24)
            .height(24)
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#F5F5F5')
        .justifyContent(FlexAlign.Center)
      }

      if (this.loadStatus === 'error') {
        // 加载失败占位
        Column() {
          Image($r('app.media.ic_image_error'))
            .width(40)
            .height(40)
          Text('加载失败')
            .fontSize(12)
            .fontColor('#999999')
            .margin({ top: 8 })
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#F5F5F5')
        .justifyContent(FlexAlign.Center)
      }

      Image(this.src)
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(this.loadStatus === 'success' ? 1 : 0)
        .onComplete(() => {
          this.loadStatus = 'success'
        })
        .onError(() => {
          this.loadStatus = 'error'
        })
    }
    .width(this.width)
    .height(this.height)
    .borderRadius(this.borderRadius)
    .clip(true)
  }
}

// 企业级实战：头像组件
@Component
struct Avatar {
  @Prop src: string = ''
  @Prop name: string = ''
  @Prop size: number = 48

  build() {
    if (this.src) {
      NetworkImage({
        src: this.src,
        width: this.size,
        height: this.size,
        borderRadius: this.size / 2
      })
    } else {
      // 无头像时显示名字首字母
      Column() {
        Text(this.name.charAt(0).toUpperCase())
          .fontSize(this.size * 0.4)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Medium)
      }
      .width(this.size)
      .height(this.size)
      .borderRadius(this.size / 2)
      .backgroundColor('#007AFF')
      .justifyContent(FlexAlign.Center)
    }
  }
}
```

### 3.3 TextInput - 输入框组件

```typescript
@Entry
@Component
struct TextInputDemo {
  @State username: string = ''
  @State password: string = ''
  @State phone: string = ''
  @State amount: string = ''

  build() {
    Column({ space: 16 }) {
      // 基础输入框
      TextInput({ placeholder: '请输入用户名', text: this.username })
        .height(48)
        .onChange((value) => { this.username = value })

      // 密码输入框
      TextInput({ placeholder: '请输入密码', text: this.password })
        .type(InputType.Password)
        .height(48)
        .onChange((value) => { this.password = value })

      // 数字输入框
      TextInput({ placeholder: '请输入金额', text: this.amount })
        .type(InputType.Number)
        .height(48)
        .onChange((value) => { this.amount = value })

      // 手机号输入框
      TextInput({ placeholder: '请输入手机号', text: this.phone })
        .type(InputType.PhoneNumber)
        .maxLength(11)
        .height(48)
        .onChange((value) => { this.phone = value })

      // 带清除按钮的输入框
      TextInput({ placeholder: '可清除输入' })
        .height(48)
        .showClearButton(true)

      // 邮箱输入框
      TextInput({ placeholder: '请输入邮箱' })
        .type(InputType.Email)
        .height(48)

      // 自定义样式输入框
      TextInput({ placeholder: '自定义样式' })
        .height(48)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding({ left: 16, right: 16 })
        .placeholderColor('#CCCCCC')
        .caretColor('#007AFF')
    }
    .padding(16)
  }
}

// 企业级实战：带验证的表单输入组件
@Component
struct FormInput {
  @Prop label: string = ''
  @Prop placeholder: string = ''
  @Prop required: boolean = false
  @Prop type: InputType = InputType.Normal
  @Prop maxLength?: number
  @Prop errorMessage: string = ''
  @Link value: string

  build() {
    Column({ space: 8 }) {
      // 标签行
      if (this.label) {
        Row() {
          if (this.required) {
            Text('*')
              .fontSize(14)
              .fontColor('#FF3B30')
          }
          Text(this.label)
            .fontSize(14)
            .fontColor('#333333')
        }
      }

      // 输入框
      TextInput({ placeholder: this.placeholder, text: this.value })
        .type(this.type)
        .maxLength(this.maxLength)
        .height(48)
        .backgroundColor(this.errorMessage ? '#FFF2F2' : '#F5F5F5')
        .borderRadius(8)
        .padding({ left: 16, right: 16 })
        .border({
          width: this.errorMessage ? 1 : 0,
          color: '#FF3B30'
        })
        .onChange((value) => { this.value = value })

      // 错误信息
      if (this.errorMessage) {
        Text(this.errorMessage)
          .fontSize(12)
          .fontColor('#FF3B30')
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}

// 使用示例
@Entry
@Component
struct FormDemo {
  @State phone: string = ''
  @State phoneError: string = ''

  validatePhone(): boolean {
    if (!this.phone) {
      this.phoneError = '请输入手机号'
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(this.phone)) {
      this.phoneError = '请输入正确的手机号'
      return false
    }
    this.phoneError = ''
    return true
  }

  build() {
    Column({ space: 16 }) {
      FormInput({
        label: '手机号',
        placeholder: '请输入手机号',
        required: true,
        type: InputType.PhoneNumber,
        maxLength: 11,
        value: $phone,
        errorMessage: this.phoneError
      })

      Button('提交')
        .width('100%')
        .onClick(() => {
          if (this.validatePhone()) {
            console.info('表单验证通过')
          }
        })
    }
    .padding(16)
  }
}
```

### 3.4 Button - 按钮组件

```typescript
@Entry
@Component
struct ButtonDemo {
  @State loading: boolean = false

  build() {
    Column({ space: 16 }) {
      // 基础按钮
      Button('普通按钮')
        .onClick(() => {
          console.info('点击按钮')
        })

      // 按钮类型
      Button('胶囊按钮', { type: ButtonType.Capsule })
      Button('圆形按钮', { type: ButtonType.Circle })
      Button('普通按钮', { type: ButtonType.Normal })

      // 自定义样式按钮
      Button('主要按钮')
        .width('100%')
        .height(48)
        .backgroundColor('#007AFF')
        .borderRadius(8)

      // 次要按钮
      Button('次要按钮')
        .width('100%')
        .height(48)
        .backgroundColor('#F5F5F5')
        .fontColor('#333333')
        .borderRadius(8)

      // 边框按钮
      Button('边框按钮')
        .width('100%')
        .height(48)
        .backgroundColor(Color.Transparent)
        .fontColor('#007AFF')
        .border({ width: 1, color: '#007AFF' })
        .borderRadius(8)

      // 禁用按钮
      Button('禁用按钮')
        .enabled(false)
        .opacity(0.5)

      // 带图标按钮
      Button({ type: ButtonType.Normal }) {
        Row({ space: 8 }) {
          Image($r('app.media.ic_add'))
            .width(20)
            .height(20)
          Text('添加')
        }
      }
      .height(48)
      .padding({ left: 24, right: 24 })

      // 加载状态按钮
      Button({ type: ButtonType.Normal }) {
        Row({ space: 8 }) {
          if (this.loading) {
            LoadingProgress()
              .width(20)
              .height(20)
              .color('#FFFFFF')
          }
          Text(this.loading ? '加载中...' : '提交')
            .fontColor('#FFFFFF')
        }
      }
      .width('100%')
      .height(48)
      .backgroundColor('#007AFF')
      .borderRadius(8)
      .onClick(() => {
        this.loading = true
        setTimeout(() => { this.loading = false }, 2000)
      })
    }
    .padding(16)
  }
}
```

### 3.5 Toggle - 开关/复选框/单选框

```typescript
@Entry
@Component
struct ToggleDemo {
  @State switchOn: boolean = false
  @State checkboxChecked: boolean = false
  @State radioValue: string = 'option1'

  build() {
    Column({ space: 24 }) {
      // Switch 开关
      Row() {
        Text('消息通知')
          .layoutWeight(1)
        Toggle({ type: ToggleType.Switch, isOn: this.switchOn })
          .selectedColor('#007AFF')
          .onChange((isOn) => {
            this.switchOn = isOn
          })
      }
      .width('100%')

      // Checkbox 复选框
      Row() {
        Toggle({ type: ToggleType.Checkbox, isOn: this.checkboxChecked })
          .selectedColor('#007AFF')
          .onChange((isOn) => {
            this.checkboxChecked = isOn
          })
        Text('我已阅读并同意用户协议')
          .margin({ left: 8 })
      }

      // Radio 单选框组
      Column({ space: 12 }) {
        Text('选择支付方式：')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)

        Row() {
          Radio({ value: 'alipay', group: 'payment' })
            .checked(this.radioValue === 'alipay')
            .onChange((isChecked) => {
              if (isChecked) this.radioValue = 'alipay'
            })
          Text('支付宝')
            .margin({ left: 8 })
        }

        Row() {
          Radio({ value: 'wechat', group: 'payment' })
            .checked(this.radioValue === 'wechat')
            .onChange((isChecked) => {
              if (isChecked) this.radioValue = 'wechat'
            })
          Text('微信支付')
            .margin({ left: 8 })
        }

        Row() {
          Radio({ value: 'huawei', group: 'payment' })
            .checked(this.radioValue === 'huawei')
            .onChange((isChecked) => {
              if (isChecked) this.radioValue = 'huawei'
            })
          Text('华为支付')
            .margin({ left: 8 })
        }
      }
      .alignItems(HorizontalAlign.Start)
    }
    .padding(16)
    .width('100%')
  }
}

// 企业级实战：设置列表项组件
@Component
struct SettingItem {
  @Prop title: string = ''
  @Prop subtitle?: string
  @Prop showArrow: boolean = true
  @Prop showSwitch: boolean = false
  @Link switchValue: boolean
  onClick?: () => void

  build() {
    Row() {
      Column({ space: 4 }) {
        Text(this.title)
          .fontSize(16)
          .fontColor('#333333')
        if (this.subtitle) {
          Text(this.subtitle)
            .fontSize(12)
            .fontColor('#999999')
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      if (this.showSwitch) {
        Toggle({ type: ToggleType.Switch, isOn: this.switchValue })
          .selectedColor('#007AFF')
          .onChange((isOn) => {
            this.switchValue = isOn
          })
      } else if (this.showArrow) {
        Image($r('app.media.ic_arrow_right'))
          .width(16)
          .height(16)
          .fillColor('#CCCCCC')
      }
    }
    .width('100%')
    .height(60)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
    .onClick(() => {
      if (!this.showSwitch && this.onClick) {
        this.onClick()
      }
    })
  }
}
```

---

## 4. 列表与滚动组件

### 4.1 List - 列表组件

```typescript
@Entry
@Component
struct ListDemo {
  @State dataList: string[] = Array.from({ length: 50 }, (_, i) => `列表项 ${i + 1}`)
  @State refreshing: boolean = false

  build() {
    List({ space: 8 }) {
      ForEach(this.dataList, (item: string, index: number) => {
        ListItem() {
          Text(item)
            .width('100%')
            .height(60)
            .padding(16)
            .backgroundColor('#FFFFFF')
            .borderRadius(8)
        }
      })
    }
    .width('100%')
    .height('100%')
    .padding(16)
    // 滚动方向
    .listDirection(Axis.Vertical)
    // 边缘效果
    .edgeEffect(EdgeEffect.Spring)
    // 滚动条
    .scrollBar(BarState.Auto)
    // 滚动事件
    .onScroll((scrollOffset, scrollState) => {
      console.info(`滚动偏移: ${scrollOffset}, 状态: ${scrollState}`)
    })
    .onScrollIndex((start, end) => {
      console.info(`可见索引: ${start} - ${end}`)
    })
  }
}

// 企业级实战：下拉刷新+上拉加载列表
@Entry
@Component
struct RefreshableList {
  @State dataList: IListItem[] = []
  @State isRefreshing: boolean = false
  @State isLoadingMore: boolean = false
  @State hasMore: boolean = true
  private pageNo: number = 1
  private pageSize: number = 20

  aboutToAppear(): void {
    this.loadData(true)
  }

  // 加载数据
  async loadData(refresh: boolean): Promise<void> {
    if (refresh) {
      this.pageNo = 1
      this.isRefreshing = true
    } else {
      this.isLoadingMore = true
    }

    // 模拟API请求
    await new Promise<void>(resolve => setTimeout(resolve, 1000))
    
    const newData: IListItem[] = Array.from(
      { length: this.pageSize },
      (_, i) => ({
        id: `${(this.pageNo - 1) * this.pageSize + i + 1}`,
        title: `商品标题 ${(this.pageNo - 1) * this.pageSize + i + 1}`,
        price: Math.floor(Math.random() * 1000) + 100
      })
    )

    if (refresh) {
      this.dataList = newData
    } else {
      this.dataList = [...this.dataList, ...newData]
    }

    this.hasMore = this.pageNo < 5  // 假设只有5页
    this.pageNo++
    this.isRefreshing = false
    this.isLoadingMore = false
  }

  @Builder
  itemBuilder(item: IListItem) {
    Row() {
      Column({ space: 4 }) {
        Text(item.title)
          .fontSize(16)
        Text(`¥${item.price}`)
          .fontSize(14)
          .fontColor('#FF3B30')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Image($r('app.media.ic_arrow_right'))
        .width(16)
        .height(16)
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
  }

  @Builder
  loadMoreBuilder() {
    Row() {
      if (this.isLoadingMore) {
        LoadingProgress()
          .width(20)
          .height(20)
        Text('加载中...')
          .fontSize(14)
          .fontColor('#999999')
          .margin({ left: 8 })
      } else if (!this.hasMore) {
        Text('没有更多数据了')
          .fontSize(14)
          .fontColor('#999999')
      }
    }
    .width('100%')
    .height(50)
    .justifyContent(FlexAlign.Center)
  }

  build() {
    Refresh({ refreshing: $$this.isRefreshing }) {
      List({ space: 8 }) {
        ForEach(this.dataList, (item: IListItem) => {
          ListItem() {
            this.itemBuilder(item)
          }
        })

        // 加载更多
        ListItem() {
          this.loadMoreBuilder()
        }
      }
      .width('100%')
      .height('100%')
      .padding(16)
      .edgeEffect(EdgeEffect.Spring)
      .onReachEnd(() => {
        if (!this.isLoadingMore && this.hasMore) {
          this.loadData(false)
        }
      })
    }
    .onRefreshing(() => {
      this.loadData(true)
    })
  }
}

interface IListItem {
  id: string
  title: string
  price: number
}

// 企业级实战：分组列表
@Entry
@Component
struct GroupedList {
  private groups: IContactGroup[] = [
    {
      letter: 'A',
      contacts: [
        { id: '1', name: '阿里', phone: '13800000001' },
        { id: '2', name: '安琪', phone: '13800000002' }
      ]
    },
    {
      letter: 'B',
      contacts: [
        { id: '3', name: '白云', phone: '13800000003' },
        { id: '4', name: '北京', phone: '13800000004' }
      ]
    },
    {
      letter: 'C',
      contacts: [
        { id: '5', name: '陈晨', phone: '13800000005' },
        { id: '6', name: '成都', phone: '13800000006' }
      ]
    }
  ]

  build() {
    List() {
      ForEach(this.groups, (group: IContactGroup) => {
        // 分组头
        ListItemGroup({ header: this.groupHeader(group.letter) }) {
          ForEach(group.contacts, (contact: IContact) => {
            ListItem() {
              this.contactItem(contact)
            }
          })
        }
      })
    }
    .width('100%')
    .height('100%')
    .sticky(StickyStyle.Header)  // 分组头吸顶
  }

  @Builder
  groupHeader(letter: string) {
    Text(letter)
      .fontSize(14)
      .fontColor('#999999')
      .width('100%')
      .height(32)
      .padding({ left: 16 })
      .backgroundColor('#F5F5F5')
  }

  @Builder
  contactItem(contact: IContact) {
    Row({ space: 12 }) {
      // 头像
      Column() {
        Text(contact.name.charAt(0))
          .fontSize(16)
          .fontColor('#FFFFFF')
      }
      .width(40)
      .height(40)
      .borderRadius(20)
      .backgroundColor('#007AFF')
      .justifyContent(FlexAlign.Center)

      // 信息
      Column({ space: 4 }) {
        Text(contact.name)
          .fontSize(16)
        Text(contact.phone)
          .fontSize(14)
          .fontColor('#999999')
      }
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .height(64)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
  }
}

interface IContact {
  id: string
  name: string
  phone: string
}

interface IContactGroup {
  letter: string
  contacts: IContact[]
}
```

### 4.2 Scroll - 滚动容器

```typescript
@Entry
@Component
struct ScrollDemo {
  private scroller: Scroller = new Scroller()

  build() {
    Column() {
      // 滚动控制按钮
      Row({ space: 16 }) {
        Button('滚动到顶部')
          .onClick(() => {
            this.scroller.scrollToIndex(0)
          })
        Button('滚动到底部')
          .onClick(() => {
            this.scroller.scrollEdge(Edge.Bottom)
          })
      }
      .padding(16)

      // 滚动容器
      Scroll(this.scroller) {
        Column({ space: 16 }) {
          ForEach(Array.from({ length: 20 }), (_, index: number) => {
            Text(`内容块 ${index + 1}`)
              .width('100%')
              .height(100)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .textAlign(TextAlign.Center)
          })
        }
        .padding(16)
      }
      .scrollable(ScrollDirection.Vertical)
      .scrollBar(BarState.Auto)
      .edgeEffect(EdgeEffect.Spring)
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }
}

// 企业级实战：带锚点的长页面
@Entry
@Component
struct AnchorPage {
  private scroller: Scroller = new Scroller()
  @State currentSection: number = 0
  private sections: string[] = ['基本信息', '详细介绍', '规格参数', '用户评价']

  build() {
    Column() {
      // 顶部锚点导航
      Row() {
        ForEach(this.sections, (section: string, index: number) => {
          Text(section)
            .fontSize(14)
            .fontColor(this.currentSection === index ? '#007AFF' : '#666666')
            .fontWeight(this.currentSection === index ? FontWeight.Bold : FontWeight.Normal)
            .padding({ left: 16, right: 16, top: 12, bottom: 12 })
            .border({
              width: { bottom: this.currentSection === index ? 2 : 0 },
              color: '#007AFF'
            })
            .onClick(() => {
              this.currentSection = index
              // 滚动到对应位置 (每个section高度300)
              this.scroller.scrollTo({ yOffset: index * 300 })
            })
        })
      }
      .width('100%')
      .backgroundColor('#FFFFFF')

      // 内容区域
      Scroll(this.scroller) {
        Column() {
          ForEach(this.sections, (section: string, index: number) => {
            Column() {
              Text(section)
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 16 })
              Text(`这是${section}的详细内容...`)
                .fontSize(14)
                .fontColor('#666666')
            }
            .width('100%')
            .height(300)
            .padding(16)
            .alignItems(HorizontalAlign.Start)
            .backgroundColor(index % 2 === 0 ? '#FFFFFF' : '#F9F9F9')
          })
        }
      }
      .scrollable(ScrollDirection.Vertical)
      .layoutWeight(1)
      .onScroll(() => {
        // 根据滚动位置更新当前section
        const offset = this.scroller.currentOffset().yOffset
        const sectionIndex = Math.floor(offset / 300)
        if (sectionIndex !== this.currentSection && sectionIndex >= 0 && sectionIndex < this.sections.length) {
          this.currentSection = sectionIndex
        }
      })
    }
    .width('100%')
    .height('100%')
  }
}
```

### 4.3 Swiper - 轮播组件

```typescript
@Entry
@Component
struct SwiperDemo {
  private swiperController: SwiperController = new SwiperController()
  @State currentIndex: number = 0
  private banners: string[] = [
    'https://example.com/banner1.jpg',
    'https://example.com/banner2.jpg',
    'https://example.com/banner3.jpg'
  ]

  build() {
    Column() {
      // 基础轮播
      Swiper(this.swiperController) {
        ForEach(this.banners, (banner: string) => {
          Image(banner)
            .width('100%')
            .height('100%')
            .objectFit(ImageFit.Cover)
        })
      }
      .width('100%')
      .height(200)
      .autoPlay(true)           // 自动播放
      .interval(3000)           // 播放间隔
      .loop(true)               // 循环播放
      .indicator(true)          // 显示指示器
      .indicatorStyle({
        selectedColor: '#007AFF',
        color: '#CCCCCC'
      })
      .onChange((index) => {
        this.currentIndex = index
      })
    }
  }
}

// 企业级实战：带自定义指示器的轮播Banner
@Component
struct BannerSwiper {
  @Prop banners: IBanner[] = []
  @State currentIndex: number = 0
  private swiperController: SwiperController = new SwiperController()
  onBannerClick?: (banner: IBanner) => void

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Swiper(this.swiperController) {
        ForEach(this.banners, (banner: IBanner) => {
          Stack() {
            Image(banner.imageUrl)
              .width('100%')
              .height('100%')
              .objectFit(ImageFit.Cover)
              .onClick(() => {
                this.onBannerClick?.(banner)
              })

            // 标题遮罩
            if (banner.title) {
              Column() {
                Text(banner.title)
                  .fontSize(16)
                  .fontColor('#FFFFFF')
                  .fontWeight(FontWeight.Bold)
              }
              .width('100%')
              .padding(16)
              .linearGradient({
                direction: GradientDirection.Bottom,
                colors: [['rgba(0,0,0,0)', 0], ['rgba(0,0,0,0.6)', 1]]
              })
              .position({ x: 0, y: '70%' })
            }
          }
        })
      }
      .autoPlay(true)
      .interval(4000)
      .loop(true)
      .indicator(false)  // 隐藏默认指示器
      .onChange((index) => {
        this.currentIndex = index
      })

      // 自定义指示器
      Row({ space: 6 }) {
        ForEach(this.banners, (_: IBanner, index: number) => {
          Row()
            .width(this.currentIndex === index ? 16 : 6)
            .height(6)
            .borderRadius(3)
            .backgroundColor(this.currentIndex === index ? '#FFFFFF' : 'rgba(255,255,255,0.5)')
            .animation({ duration: 200 })
        })
      }
      .margin({ bottom: 12 })
    }
    .width('100%')
    .height(180)
    .borderRadius(12)
    .clip(true)
  }
}

interface IBanner {
  id: string
  imageUrl: string
  title?: string
  linkUrl?: string
}
```

### 4.4 WaterFlow - 瀑布流

```typescript
@Entry
@Component
struct WaterFlowDemo {
  @State items: IWaterFlowItem[] = []

  aboutToAppear(): void {
    // 生成随机高度的数据
    this.items = Array.from({ length: 30 }, (_, i) => ({
      id: `${i}`,
      imageUrl: `https://example.com/image${i}.jpg`,
      title: `商品标题 ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 100,
      height: Math.floor(Math.random() * 100) + 150  // 随机高度150-250
    }))
  }

  build() {
    WaterFlow() {
      ForEach(this.items, (item: IWaterFlowItem) => {
        FlowItem() {
          Column() {
            Image(item.imageUrl)
              .width('100%')
              .height(item.height)
              .objectFit(ImageFit.Cover)
              .borderRadius({ topLeft: 8, topRight: 8 })

            Column({ space: 4 }) {
              Text(item.title)
                .fontSize(14)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
              Text(`¥${item.price}`)
                .fontSize(16)
                .fontColor('#FF3B30')
                .fontWeight(FontWeight.Bold)
            }
            .width('100%')
            .padding(8)
            .alignItems(HorizontalAlign.Start)
          }
          .backgroundColor('#FFFFFF')
          .borderRadius(8)
        }
      })
    }
    .columnsTemplate('1fr 1fr')  // 两列
    .columnsGap(8)
    .rowsGap(8)
    .padding(8)
    .width('100%')
    .height('100%')
  }
}

interface IWaterFlowItem {
  id: string
  imageUrl: string
  title: string
  price: number
  height: number
}
```

---

## 5. 状态管理详解

### 5.1 @State - 组件内状态

```typescript
// @State用于组件内部状态管理
// 当@State装饰的变量改变时，组件会重新渲染

@Entry
@Component
struct StateDemo {
  // 基本类型状态
  @State count: number = 0
  @State message: string = 'Hello'
  @State isVisible: boolean = true

  // 对象类型状态
  @State user: UserInfo = { name: '张三', age: 25 }

  // 数组类型状态
  @State items: string[] = ['项目1', '项目2']

  build() {
    Column({ space: 16 }) {
      // 基本类型状态更新
      Text(`计数: ${this.count}`)
      Button('增加')
        .onClick(() => {
          this.count++  // 触发UI更新
        })

      // 对象状态更新
      Text(`用户: ${this.user.name}, ${this.user.age}岁`)
      Button('修改年龄')
        .onClick(() => {
          // 需要整体替换对象才能触发更新
          this.user = { ...this.user, age: this.user.age + 1 }
        })

      // 数组状态更新
      Text(`项目数: ${this.items.length}`)
      Button('添加项目')
        .onClick(() => {
          // 需要创建新数组才能触发更新
          this.items = [...this.items, `项目${this.items.length + 1}`]
        })
    }
    .padding(16)
  }
}

interface UserInfo {
  name: string
  age: number
}

// 重要：@State的更新规则
// 1. 基本类型：直接赋值即可触发更新
// 2. 对象类型：需要替换整个对象，修改属性不会触发更新
// 3. 数组类型：需要替换整个数组，push/pop等不会触发更新
```

### 5.2 @Prop - 单向数据传递

```typescript
// @Prop用于父组件向子组件单向传递数据
// 子组件可以修改本地副本，但不会影响父组件

// 子组件
@Component
struct ChildComponent {
  @Prop title: string = ''      // 必须有默认值
  @Prop count: number = 0
  @Prop user: UserInfo = { name: '', age: 0 }

  build() {
    Column({ space: 8 }) {
      Text(`标题: ${this.title}`)
      Text(`计数: ${this.count}`)
      
      // 子组件可以修改本地值，但不会同步到父组件
      Button('本地修改')
        .onClick(() => {
          this.count++  // 只影响子组件
        })
    }
    .padding(16)
    .backgroundColor('#F5F5F5')
  }
}

// 父组件
@Entry
@Component
struct ParentComponent {
  @State parentCount: number = 0
  @State parentUser: UserInfo = { name: '张三', age: 25 }

  build() {
    Column({ space: 16 }) {
      Text(`父组件计数: ${this.parentCount}`)
      
      Button('父组件修改')
        .onClick(() => {
          this.parentCount++
        })

      // 传递给子组件
      ChildComponent({
        title: '子组件',
        count: this.parentCount,
        user: this.parentUser
      })
    }
    .padding(16)
  }
}

interface UserInfo {
  name: string
  age: number
}
```

### 5.3 @Link - 双向数据绑定

```typescript
// @Link用于父子组件间的双向数据绑定
// 子组件修改会同步到父组件

// 子组件
@Component
struct CounterChild {
  @Link count: number  // 不需要默认值

  build() {
    Column({ space: 8 }) {
      Text(`子组件计数: ${this.count}`)
      Button('子组件增加')
        .onClick(() => {
          this.count++  // 会同步到父组件
        })
    }
    .padding(16)
    .backgroundColor('#E8F5E9')
  }
}

// 父组件
@Entry
@Component
struct CounterParent {
  @State count: number = 0

  build() {
    Column({ space: 16 }) {
      Text(`父组件计数: ${this.count}`)
      
      Button('父组件增加')
        .onClick(() => {
          this.count++
        })

      // 使用$符号传递Link
      CounterChild({ count: $count })
    }
    .padding(16)
  }
}

// 企业级实战：表单组件双向绑定
@Component
struct FormField {
  @Prop label: string = ''
  @Prop placeholder: string = ''
  @Link value: string

  build() {
    Column({ space: 8 }) {
      Text(this.label)
        .fontSize(14)
        .fontColor('#666666')
      TextInput({ placeholder: this.placeholder, text: this.value })
        .height(48)
        .onChange((text) => {
          this.value = text
        })
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}

@Entry
@Component
struct FormPage {
  @State username: string = ''
  @State email: string = ''

  build() {
    Column({ space: 16 }) {
      FormField({
        label: '用户名',
        placeholder: '请输入用户名',
        value: $username
      })

      FormField({
        label: '邮箱',
        placeholder: '请输入邮箱',
        value: $email
      })

      Button('提交')
        .onClick(() => {
          console.info(`用户名: ${this.username}, 邮箱: ${this.email}`)
        })
    }
    .padding(16)
  }
}
```

### 5.4 @Provide/@Consume - 跨组件数据共享

```typescript
// @Provide/@Consume用于跨组件层级的数据共享
// 不需要逐层传递props

// 顶层组件 - 提供数据
@Entry
@Component
struct GrandParent {
  @Provide('theme') theme: string = 'light'
  @Provide('userInfo') userInfo: UserInfo = { name: '张三', age: 25 }

  build() {
    Column({ space: 16 }) {
      Text(`当前主题: ${this.theme}`)
      
      Button('切换主题')
        .onClick(() => {
          this.theme = this.theme === 'light' ? 'dark' : 'light'
        })

      ParentComp()
    }
    .padding(16)
    .backgroundColor(this.theme === 'light' ? '#FFFFFF' : '#333333')
  }
}

interface UserInfo {
  name: string
  age: number
}

// 中间组件 - 不需要声明或传递
@Component
struct ParentComp {
  build() {
    Column() {
      Text('中间层组件')
      ChildComp()
    }
  }
}

// 底层组件 - 消费数据
@Component
struct ChildComp {
  @Consume('theme') theme: string
  @Consume('userInfo') userInfo: UserInfo

  build() {
    Column({ space: 8 }) {
      Text(`子组件主题: ${this.theme}`)
        .fontColor(this.theme === 'light' ? '#333333' : '#FFFFFF')
      Text(`用户: ${this.userInfo.name}`)
        .fontColor(this.theme === 'light' ? '#333333' : '#FFFFFF')
    }
    .padding(16)
    .backgroundColor(this.theme === 'light' ? '#F5F5F5' : '#555555')
  }
}

// 企业级实战：全局主题和用户状态管理
@Entry
@Component
struct App {
  @Provide('globalTheme') globalTheme: ITheme = {
    primaryColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    isDark: false
  }

  @Provide('globalUser') globalUser: IGlobalUser | null = null

  build() {
    Column() {
      // 页面内容...
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.globalTheme.backgroundColor)
  }
}

interface ITheme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  isDark: boolean
}

interface IGlobalUser {
  id: string
  name: string
  avatar: string
  token: string
}
```

### 5.5 @Observed/@ObjectLink - 嵌套对象观察

```typescript
// @Observed装饰类，使其属性变化可被观察
// @ObjectLink用于子组件接收被观察的对象

@Observed
class Task {
  id: string
  title: string
  completed: boolean

  constructor(id: string, title: string) {
    this.id = id
    this.title = title
    this.completed = false
  }
}

// 子组件 - 使用@ObjectLink
@Component
struct TaskItem {
  @ObjectLink task: Task

  build() {
    Row() {
      Toggle({ type: ToggleType.Checkbox, isOn: this.task.completed })
        .onChange((isOn) => {
          this.task.completed = isOn  // 直接修改属性，会触发更新
        })

      Text(this.task.title)
        .fontSize(16)
        .fontColor(this.task.completed ? '#999999' : '#333333')
        .decoration({
          type: this.task.completed ? TextDecorationType.LineThrough : TextDecorationType.None
        })
        .layoutWeight(1)
        .margin({ left: 12 })
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
  }
}

// 父组件
@Entry
@Component
struct TaskList {
  @State tasks: Task[] = [
    new Task('1', '完成ArkTS学习'),
    new Task('2', '编写示例代码'),
    new Task('3', '整理文档')
  ]

  build() {
    Column() {
      // 统计
      Text(`已完成: ${this.tasks.filter(t => t.completed).length}/${this.tasks.length}`)
        .fontSize(16)
        .padding(16)

      // 任务列表
      List() {
        ForEach(this.tasks, (task: Task) => {
          ListItem() {
            TaskItem({ task: task })
          }
        })
      }
      .width('100%')
      .layoutWeight(1)

      // 添加任务
      Button('添加任务')
        .margin(16)
        .onClick(() => {
          this.tasks = [...this.tasks, new Task(`${Date.now()}`, `新任务 ${this.tasks.length + 1}`)]
        })
    }
    .width('100%')
    .height('100%')
  }
}

// 企业级实战：购物车状态管理
@Observed
class CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  selected: boolean

  constructor(productId: string, productName: string, price: number) {
    this.productId = productId
    this.productName = productName
    this.price = price
    this.quantity = 1
    this.selected = true
  }

  get subtotal(): number {
    return this.price * this.quantity
  }
}

@Component
struct CartItemView {
  @ObjectLink item: CartItem
  onDelete?: () => void

  build() {
    Row({ space: 12 }) {
      // 选择框
      Toggle({ type: ToggleType.Checkbox, isOn: this.item.selected })
        .onChange((isOn) => {
          this.item.selected = isOn
        })

      // 商品信息
      Column({ space: 4 }) {
        Text(this.item.productName)
          .fontSize(16)
        Text(`¥${this.item.price}`)
          .fontSize(14)
          .fontColor('#FF3B30')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      // 数量控制
      Row() {
        Button('-')
          .width(32)
          .height(32)
          .onClick(() => {
            if (this.item.quantity > 1) {
              this.item.quantity--
            }
          })
        Text(`${this.item.quantity}`)
          .width(40)
          .textAlign(TextAlign.Center)
        Button('+')
          .width(32)
          .height(32)
          .onClick(() => {
            this.item.quantity++
          })
      }

      // 删除按钮
      Image($r('app.media.ic_delete'))
        .width(24)
        .height(24)
        .onClick(() => {
          this.onDelete?.()
        })
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
  }
}

@Entry
@Component
struct CartPage {
  @State cartItems: CartItem[] = [
    new CartItem('1', '华为Mate60', 5999),
    new CartItem('2', 'FreeBuds Pro', 1299),
    new CartItem('3', 'MatePad Pro', 3999)
  ]

  get selectedItems(): CartItem[] {
    return this.cartItems.filter(item => item.selected)
  }

  get totalPrice(): number {
    return this.selectedItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  build() {
    Column() {
      // 购物车列表
      List({ space: 8 }) {
        ForEach(this.cartItems, (item: CartItem, index: number) => {
          ListItem() {
            CartItemView({
              item: item,
              onDelete: () => {
                this.cartItems = this.cartItems.filter((_, i) => i !== index)
              }
            })
          }
        })
      }
      .width('100%')
      .layoutWeight(1)
      .padding(8)

      // 底部结算栏
      Row() {
        Toggle({ type: ToggleType.Checkbox, isOn: this.selectedItems.length === this.cartItems.length })
          .onChange((isOn) => {
            this.cartItems.forEach(item => { item.selected = isOn })
          })
        Text('全选')
          .margin({ left: 8 })

        Blank()

        Text() {
          Span('合计: ')
          Span(`¥${this.totalPrice.toFixed(2)}`).fontColor('#FF3B30').fontWeight(FontWeight.Bold)
        }

        Button(`结算(${this.selectedItems.length})`)
          .margin({ left: 16 })
          .enabled(this.selectedItems.length > 0)
      }
      .width('100%')
      .height(60)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#FFFFFF')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
```

### 5.6 @Watch - 状态变化监听

```typescript
@Entry
@Component
struct WatchDemo {
  @State @Watch('onCountChange') count: number = 0
  @State @Watch('onUserChange') user: UserInfo = { name: '张三', age: 25 }
  @State history: string[] = []

  // 监听count变化
  onCountChange(): void {
    this.history = [...this.history, `count变为: ${this.count}`]
    console.info(`count changed to: ${this.count}`)
  }

  // 监听user变化
  onUserChange(): void {
    this.history = [...this.history, `user变为: ${this.user.name}, ${this.user.age}`]
    console.info(`user changed to: ${JSON.stringify(this.user)}`)
  }

  build() {
    Column({ space: 16 }) {
      Text(`Count: ${this.count}`)
      Button('增加Count')
        .onClick(() => { this.count++ })

      Text(`User: ${this.user.name}, ${this.user.age}`)
      Button('修改User')
        .onClick(() => {
          this.user = { ...this.user, age: this.user.age + 1 }
        })

      // 变化历史
      Column() {
        Text('变化历史:')
          .fontWeight(FontWeight.Bold)
        ForEach(this.history, (item: string) => {
          Text(item)
            .fontSize(12)
            .fontColor('#666666')
        })
      }
      .alignItems(HorizontalAlign.Start)
    }
    .padding(16)
  }
}

interface UserInfo {
  name: string
  age: number
}

// 企业级实战：搜索防抖
@Entry
@Component
struct SearchPage {
  @State @Watch('onKeywordChange') keyword: string = ''
  @State searchResults: string[] = []
  @State isSearching: boolean = false
  private debounceTimer: number = -1

  onKeywordChange(): void {
    // 清除之前的定时器
    if (this.debounceTimer !== -1) {
      clearTimeout(this.debounceTimer)
    }

    // 设置新的防抖定时器
    this.debounceTimer = setTimeout(() => {
      this.doSearch()
    }, 500)
  }

  async doSearch(): Promise<void> {
    if (!this.keyword.trim()) {
      this.searchResults = []
      return
    }

    this.isSearching = true
    // 模拟API请求
    await new Promise<void>(resolve => setTimeout(resolve, 500))
    
    this.searchResults = Array.from(
      { length: 10 },
      (_, i) => `${this.keyword} 搜索结果 ${i + 1}`
    )
    this.isSearching = false
  }

  build() {
    Column() {
      // 搜索框
      Row() {
        TextInput({ placeholder: '搜索...', text: this.keyword })
          .layoutWeight(1)
          .height(40)
          .onChange((value) => { this.keyword = value })

        if (this.isSearching) {
          LoadingProgress()
            .width(24)
            .height(24)
            .margin({ left: 12 })
        }
      }
      .padding(16)

      // 搜索结果
      List() {
        ForEach(this.searchResults, (result: string) => {
          ListItem() {
            Text(result)
              .padding(16)
          }
        })
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }
}
```

---

## 6. 组件通信机制

### 6.1 Props传递（父→子）

```typescript
// 通过属性传递数据给子组件
@Component
struct ChildComp {
  @Prop title: string = ''
  @Prop count: number = 0

  build() {
    Column() {
      Text(this.title)
      Text(`${this.count}`)
    }
  }
}

@Entry
@Component
struct ParentComp {
  @State title: string = '标题'
  @State count: number = 0

  build() {
    Column() {
      ChildComp({ title: this.title, count: this.count })
    }
  }
}
```

### 6.2 回调函数（子→父）

```typescript
// 通过回调函数让子组件通知父组件
@Component
struct ChildComp {
  @Prop value: number = 0
  onValueChange?: (value: number) => void
  onSubmit?: () => void

  build() {
    Column({ space: 12 }) {
      Text(`值: ${this.value}`)
      
      Button('增加')
        .onClick(() => {
          this.onValueChange?.(this.value + 1)
        })

      Button('提交')
        .onClick(() => {
          this.onSubmit?.()
        })
    }
  }
}

@Entry
@Component
struct ParentComp {
  @State value: number = 0

  handleValueChange(newValue: number): void {
    this.value = newValue
  }

  handleSubmit(): void {
    console.info(`提交值: ${this.value}`)
  }

  build() {
    Column() {
      Text(`父组件值: ${this.value}`)
      
      ChildComp({
        value: this.value,
        onValueChange: (v) => this.handleValueChange(v),
        onSubmit: () => this.handleSubmit()
      })
    }
    .padding(16)
  }
}
```

### 6.3 EventHub事件总线

```typescript
// 使用EventHub实现任意组件间通信
import { common } from '@kit.AbilityKit'

// 定义事件类型
const EVENT_USER_LOGIN = 'user_login'
const EVENT_CART_UPDATE = 'cart_update'

// 发送事件的组件
@Component
struct LoginComponent {
  private context = getContext(this) as common.UIAbilityContext

  handleLogin(): void {
    const user = { id: '1', name: '张三' }
    // 发送登录事件
    this.context.eventHub.emit(EVENT_USER_LOGIN, user)
  }

  build() {
    Button('登录')
      .onClick(() => this.handleLogin())
  }
}

// 接收事件的组件
@Component
struct HeaderComponent {
  @State userName: string = '未登录'
  private context = getContext(this) as common.UIAbilityContext

  aboutToAppear(): void {
    // 监听登录事件
    this.context.eventHub.on(EVENT_USER_LOGIN, (user: UserInfo) => {
      this.userName = user.name
    })
  }

  aboutToDisappear(): void {
    // 移除监听
    this.context.eventHub.off(EVENT_USER_LOGIN)
  }

  build() {
    Text(`用户: ${this.userName}`)
  }
}

interface UserInfo {
  id: string
  name: string
}

// 企业级实战：全局事件管理器
class EventManager {
  private static instance: EventManager | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  private constructor() {}

  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager()
    }
    return EventManager.instance
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      this.listeners.delete(event)
    } else {
      this.listeners.get(event)?.delete(callback)
    }
  }

  emit(event: string, ...args: Object[]): void {
    this.listeners.get(event)?.forEach(callback => {
      callback(...args)
    })
  }
}

// 使用
const eventManager = EventManager.getInstance()

// 监听
eventManager.on('cartUpdate', (count: number) => {
  console.info(`购物车数量: ${count}`)
})

// 触发
eventManager.emit('cartUpdate', 5)
```

---

## 7. 组件生命周期

### 7.1 页面生命周期

```typescript
@Entry
@Component
struct LifecyclePage {
  @State message: string = ''

  // ===== 组件生命周期 =====

  // 组件即将出现 - 在build之前调用
  // 用于初始化数据、订阅事件等
  aboutToAppear(): void {
    console.info('aboutToAppear: 组件即将显示')
    this.message = '组件已初始化'
    // 初始化操作：加载数据、注册监听等
  }

  // 组件即将消失 - 在组件销毁前调用
  // 用于清理资源、取消订阅等
  aboutToDisappear(): void {
    console.info('aboutToDisappear: 组件即将销毁')
    // 清理操作：取消定时器、移除监听等
  }

  // ===== 页面生命周期 (仅@Entry装饰的组件) =====

  // 页面显示时调用
  onPageShow(): void {
    console.info('onPageShow: 页面显示')
    // 页面从后台切换到前台、或路由跳转回来时触发
  }

  // 页面隐藏时调用
  onPageHide(): void {
    console.info('onPageHide: 页面隐藏')
    // 页面切换到后台、或路由跳转到其他页面时触发
  }

  // 返回键按下时调用
  onBackPress(): boolean | void {
    console.info('onBackPress: 返回键按下')
    // 返回true表示自己处理返回事件，不执行默认返回
    // 返回false或不返回表示执行默认返回行为
    return false
  }

  build() {
    Column() {
      Text(this.message)
    }
  }
}
```

### 7.2 生命周期实战应用

```typescript
// 企业级实战：带数据加载的页面
@Entry
@Component
struct ProductDetailPage {
  @State product: IProduct | null = null
  @State isLoading: boolean = true
  @State error: string = ''
  private productId: string = ''
  private refreshTimer: number = -1

  // 组件初始化
  aboutToAppear(): void {
    // 获取路由参数
    // this.productId = router.getParams()?.['productId'] as string
    this.productId = '12345'  // 示例
    
    // 加载数据
    this.loadProductDetail()
    
    // 设置定时刷新（如价格变动）
    this.refreshTimer = setInterval(() => {
      this.refreshPrice()
    }, 60000)  // 每分钟刷新价格
  }

  // 组件销毁
  aboutToDisappear(): void {
    // 清理定时器
    if (this.refreshTimer !== -1) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = -1
    }
  }

  // 页面显示
  onPageShow(): void {
    // 页面重新显示时，可以刷新数据
    if (this.product) {
      this.refreshPrice()
    }
  }

  // 页面隐藏
  onPageHide(): void {
    // 页面隐藏时，可以暂停一些操作
    console.info('页面隐藏')
  }

  // 返回键处理
  onBackPress(): boolean {
    // 如果有未保存的内容，可以弹窗提示
    return false
  }

  async loadProductDetail(): Promise<void> {
    this.isLoading = true
    this.error = ''

    try {
      // 模拟API请求
      await new Promise<void>(resolve => setTimeout(resolve, 1000))
      
      this.product = {
        id: this.productId,
        name: '华为Mate60 Pro',
        price: 6999,
        originalPrice: 7999,
        description: '这是商品描述...',
        images: ['image1.jpg', 'image2.jpg'],
        stock: 100
      }
    } catch (e) {
      this.error = '加载失败，请重试'
    } finally {
      this.isLoading = false
    }
  }

  async refreshPrice(): Promise<void> {
    if (!this.product) return
    
    // 模拟刷新价格
    console.info('刷新价格...')
  }

  build() {
    Column() {
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
      } else if (this.error) {
        Column({ space: 16 }) {
          Text(this.error)
            .fontColor('#FF3B30')
          Button('重试')
            .onClick(() => this.loadProductDetail())
        }
      } else if (this.product) {
        // 商品详情内容
        Column() {
          Text(this.product.name)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
          Text(`¥${this.product.price}`)
            .fontSize(24)
            .fontColor('#FF3B30')
        }
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}

interface IProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  stock: number
}
```

### 7.3 自定义组件生命周期

```typescript
// 自定义组件的生命周期管理
@Component
struct TimerComponent {
  @State seconds: number = 0
  private timerId: number = -1
  private onTick?: (seconds: number) => void

  // 设置回调
  setOnTick(callback: (seconds: number) => void): TimerComponent {
    this.onTick = callback
    return this
  }

  aboutToAppear(): void {
    console.info('TimerComponent: aboutToAppear')
    this.startTimer()
  }

  aboutToDisappear(): void {
    console.info('TimerComponent: aboutToDisappear')
    this.stopTimer()
  }

  private startTimer(): void {
    this.timerId = setInterval(() => {
      this.seconds++
      this.onTick?.(this.seconds)
    }, 1000)
  }

  private stopTimer(): void {
    if (this.timerId !== -1) {
      clearInterval(this.timerId)
      this.timerId = -1
    }
  }

  // 提供重置方法
  reset(): void {
    this.seconds = 0
  }

  build() {
    Text(`计时: ${this.seconds}秒`)
      .fontSize(24)
  }
}

// 使用
@Entry
@Component
struct TimerPage {
  @State showTimer: boolean = true
  @State totalSeconds: number = 0

  build() {
    Column({ space: 16 }) {
      if (this.showTimer) {
        TimerComponent()
          .setOnTick((seconds) => {
            this.totalSeconds = seconds
          })
      }

      Text(`总计时: ${this.totalSeconds}秒`)

      Button(this.showTimer ? '隐藏计时器' : '显示计时器')
        .onClick(() => {
          this.showTimer = !this.showTimer
        })
    }
    .padding(16)
  }
}
```

---

## 企业级最佳实践总结

### 组件设计原则

1. **单一职责**：每个组件只负责一个功能
2. **可复用性**：通过Props和Slots设计可复用组件
3. **状态提升**：将共享状态提升到最近的公共父组件
4. **组合优于继承**：使用组件组合而非继承

### 状态管理选择

| 场景 | 推荐装饰器 |
|------|-----------|
| 组件内部状态 | @State |
| 父→子单向传递 | @Prop |
| 父↔子双向绑定 | @Link |
| 跨层级共享 | @Provide/@Consume |
| 嵌套对象观察 | @Observed/@ObjectLink |
| 状态变化监听 | @Watch |

### 性能优化

1. **合理使用@State**：避免频繁触发不必要的渲染
2. **列表优化**：使用LazyForEach进行懒加载
3. **图片优化**：使用合适的图片尺寸和格式
4. **组件复用**：使用@Reusable标记可复用组件

---

*下一篇：路由导航与网络请求*
