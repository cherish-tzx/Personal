# HarmonyOS ArkTS前端开发完全指南 - 动画与高级特性篇

> 本文档全面总结HarmonyOS动画系统、手势处理、弹窗组件等高级特性，结合企业级大厂项目实战经验

---
<div class="doc-toc">
## 目录

1. [属性动画](#1-属性动画)
2. [显式动画](#2-显式动画)
3. [转场动画](#3-转场动画)
4. [手势处理](#4-手势处理)
5. [弹窗与提示](#5-弹窗与提示)
6. [自定义绘制](#6-自定义绘制)
7. [性能优化](#7-性能优化)


</div>

---

## 1. 属性动画

### 1.1 animation属性动画

```typescript
@Entry
@Component
struct AnimationDemo {
  @State scaleValue: number = 1
  @State rotateAngle: number = 0
  @State opacityValue: number = 1
  @State translateX: number = 0
  @State bgColor: Color = Color.Blue

  build() {
    Column({ space: 20 }) {
      // 缩放动画
      Text('缩放动画')
        .fontSize(20)
        .scale({ x: this.scaleValue, y: this.scaleValue })
        .animation({
          duration: 300,
          curve: Curve.EaseInOut,
          iterations: 1,
          playMode: PlayMode.Normal
        })
        .onClick(() => {
          this.scaleValue = this.scaleValue === 1 ? 1.5 : 1
        })

      // 旋转动画
      Text('旋转动画')
        .fontSize(20)
        .rotate({ angle: this.rotateAngle })
        .animation({
          duration: 500,
          curve: Curve.Linear
        })
        .onClick(() => {
          this.rotateAngle += 90
        })

      // 透明度动画
      Text('透明度动画')
        .fontSize(20)
        .opacity(this.opacityValue)
        .animation({
          duration: 300,
          curve: Curve.EaseOut
        })
        .onClick(() => {
          this.opacityValue = this.opacityValue === 1 ? 0.3 : 1
        })

      // 位移动画
      Text('位移动画')
        .fontSize(20)
        .translate({ x: this.translateX })
        .animation({
          duration: 300,
          curve: Curve.Spring
        })
        .onClick(() => {
          this.translateX = this.translateX === 0 ? 100 : 0
        })

      // 颜色动画
      Text('颜色动画')
        .fontSize(20)
        .fontColor('#FFFFFF')
        .padding(16)
        .backgroundColor(this.bgColor)
        .animation({
          duration: 500
        })
        .onClick(() => {
          this.bgColor = this.bgColor === Color.Blue ? Color.Red : Color.Blue
        })
    }
    .width('100%')
    .padding(20)
  }
}
```

### 1.2 动画曲线

```typescript
@Entry
@Component
struct AnimationCurveDemo {
  @State positions: number[] = [0, 0, 0, 0, 0, 0, 0, 0]
  private curves: Curve[] = [
    Curve.Linear,        // 线性
    Curve.Ease,          // 缓动
    Curve.EaseIn,        // 缓入
    Curve.EaseOut,       // 缓出
    Curve.EaseInOut,     // 缓入缓出
    Curve.FastOutSlowIn, // 快出慢入
    Curve.LinearOutSlowIn, // 线性出慢入
    Curve.FastOutLinearIn  // 快出线性入
  ]
  private curveNames: string[] = [
    'Linear', 'Ease', 'EaseIn', 'EaseOut',
    'EaseInOut', 'FastOutSlowIn', 'LinearOutSlowIn', 'FastOutLinearIn'
  ]

  build() {
    Column({ space: 12 }) {
      Button('播放动画')
        .onClick(() => {
          this.positions = this.positions.map(() => 200)
          setTimeout(() => {
            this.positions = this.positions.map(() => 0)
          }, 1500)
        })

      ForEach(this.curves, (curve: Curve, index: number) => {
        Row() {
          Text(this.curveNames[index])
            .width(120)
            .fontSize(12)

          Row()
            .width(20)
            .height(20)
            .borderRadius(10)
            .backgroundColor('#007AFF')
            .translate({ x: this.positions[index] })
            .animation({
              duration: 1000,
              curve: curve
            })
        }
        .width('100%')
        .height(30)
      })
    }
    .padding(16)
  }
}

// 自定义贝塞尔曲线
@Entry
@Component
struct CustomCurveDemo {
  @State scale: number = 1

  build() {
    Column() {
      Text('自定义曲线')
        .scale({ x: this.scale, y: this.scale })
        .animation({
          duration: 500,
          // 三次贝塞尔曲线
          curve: curves.cubicBezierCurve(0.25, 0.1, 0.25, 1.0)
        })
        .onClick(() => {
          this.scale = this.scale === 1 ? 1.5 : 1
        })
    }
  }
}

import { curves } from '@kit.ArkUI'
```

### 1.3 组合动画效果

```typescript
// 企业级实战：点赞动画效果
@Component
struct LikeButton {
  @State isLiked: boolean = false
  @State scale: number = 1
  @State rotate: number = 0

  build() {
    Stack() {
      Image(this.isLiked ? $r('app.media.ic_liked') : $r('app.media.ic_like'))
        .width(30)
        .height(30)
        .scale({ x: this.scale, y: this.scale })
        .rotate({ angle: this.rotate })
        .animation({
          duration: 300,
          curve: Curve.Spring
        })
        .onClick(() => {
          // 先缩小
          this.scale = 0.8
          this.rotate = this.isLiked ? 0 : -30

          // 延迟后放大并切换状态
          setTimeout(() => {
            this.isLiked = !this.isLiked
            this.scale = 1.2
            this.rotate = 0

            // 恢复正常大小
            setTimeout(() => {
              this.scale = 1
            }, 150)
          }, 100)
        })
    }
  }
}

// 企业级实战：加入购物车动画
@Component
struct AddToCartAnimation {
  @State showAnimation: boolean = false
  @State ballPosition: Position = { x: 0, y: 0 }
  @State ballScale: number = 1
  @State ballOpacity: number = 1

  private startPosition: Position = { x: 0, y: 0 }
  private endPosition: Position = { x: 300, y: 600 }  // 购物车位置

  addToCart(): void {
    // 重置状态
    this.ballPosition = this.startPosition
    this.ballScale = 1
    this.ballOpacity = 1
    this.showAnimation = true

    // 执行动画
    setTimeout(() => {
      this.ballPosition = this.endPosition
      this.ballScale = 0.3
      this.ballOpacity = 0
    }, 50)

    // 动画结束后隐藏
    setTimeout(() => {
      this.showAnimation = false
    }, 600)
  }

  build() {
    Stack() {
      // 商品内容
      Column() {
        Button('加入购物车')
          .onClick(() => this.addToCart())
      }

      // 动画小球
      if (this.showAnimation) {
        Circle()
          .width(20)
          .height(20)
          .fill('#FF3B30')
          .position(this.ballPosition)
          .scale({ x: this.ballScale, y: this.ballScale })
          .opacity(this.ballOpacity)
          .animation({
            duration: 500,
            curve: Curve.EaseIn
          })
      }
    }
    .width('100%')
    .height('100%')
  }
}

interface Position {
  x: number
  y: number
}
```

---

## 2. 显式动画

### 2.1 animateTo显式动画

```typescript
import { curves } from '@kit.ArkUI'

@Entry
@Component
struct AnimateToDemo {
  @State width: number = 100
  @State height: number = 100
  @State color: Color = Color.Blue
  @State opacity: number = 1

  build() {
    Column({ space: 20 }) {
      // 动画目标
      Row()
        .width(this.width)
        .height(this.height)
        .backgroundColor(this.color)
        .opacity(this.opacity)

      // 控制按钮
      Button('放大')
        .onClick(() => {
          animateTo({
            duration: 500,
            curve: Curve.EaseInOut,
            onFinish: () => {
              console.info('动画完成')
            }
          }, () => {
            this.width = 200
            this.height = 200
          })
        })

      Button('变色')
        .onClick(() => {
          animateTo({
            duration: 300,
            curve: Curve.Linear
          }, () => {
            this.color = this.color === Color.Blue ? Color.Red : Color.Blue
          })
        })

      Button('组合动画')
        .onClick(() => {
          animateTo({
            duration: 500,
            curve: curves.springMotion(0.5, 0.8)
          }, () => {
            this.width = this.width === 100 ? 200 : 100
            this.height = this.height === 100 ? 200 : 100
            this.color = this.color === Color.Blue ? Color.Green : Color.Blue
          })
        })

      Button('重置')
        .onClick(() => {
          animateTo({ duration: 300 }, () => {
            this.width = 100
            this.height = 100
            this.color = Color.Blue
            this.opacity = 1
          })
        })
    }
    .padding(20)
  }
}
```

### 2.2 关键帧动画

```typescript
import { keyframeAnimateTo, KeyframeState } from '@kit.ArkUI'

@Entry
@Component
struct KeyframeAnimationDemo {
  @State myScale: number = 1
  @State myRotate: number = 0
  @State myOpacity: number = 1

  build() {
    Column({ space: 20 }) {
      Text('关键帧动画')
        .fontSize(24)
        .scale({ x: this.myScale, y: this.myScale })
        .rotate({ angle: this.myRotate })
        .opacity(this.myOpacity)

      Button('播放动画')
        .onClick(() => {
          // 关键帧动画
          keyframeAnimateTo({
            iterations: 1,
            delay: 0
          }, [
            // 第一个关键帧：0-30%
            {
              duration: 300,
              curve: Curve.EaseIn,
              event: () => {
                this.myScale = 1.5
                this.myRotate = 180
              }
            },
            // 第二个关键帧：30-60%
            {
              duration: 300,
              curve: Curve.EaseOut,
              event: () => {
                this.myScale = 0.8
                this.myRotate = 360
                this.myOpacity = 0.5
              }
            },
            // 第三个关键帧：60-100%
            {
              duration: 400,
              curve: Curve.Spring,
              event: () => {
                this.myScale = 1
                this.myRotate = 0
                this.myOpacity = 1
              }
            }
          ])
        })
    }
    .padding(20)
  }
}
```

### 2.3 弹性动画

```typescript
import { curves } from '@kit.ArkUI'

@Entry
@Component
struct SpringAnimationDemo {
  @State translateY: number = 0
  @State scale: number = 1

  build() {
    Column({ space: 20 }) {
      // 下拉弹性效果
      Column() {
        Image($r('app.media.icon'))
          .width(80)
          .height(80)
          .translate({ y: this.translateY })
      }
      .gesture(
        PanGesture()
          .onActionUpdate((event) => {
            if (event && event.offsetY > 0) {
              // 下拉时应用阻尼效果
              this.translateY = event.offsetY * 0.5
            }
          })
          .onActionEnd(() => {
            // 释放时弹回
            animateTo({
              duration: 500,
              curve: curves.springMotion(0.5, 0.8)
            }, () => {
              this.translateY = 0
            })
          })
      )

      // 弹性缩放
      Button('弹性缩放')
        .scale({ x: this.scale, y: this.scale })
        .onClick(() => {
          // 先放大
          animateTo({
            duration: 150,
            curve: Curve.EaseOut
          }, () => {
            this.scale = 1.2
          })

          // 再弹性恢复
          setTimeout(() => {
            animateTo({
              duration: 400,
              curve: curves.springMotion(0.6, 0.9)
            }, () => {
              this.scale = 1
            })
          }, 150)
        })
    }
    .padding(20)
  }
}
```

---

## 3. 转场动画

### 3.1 组件转场

```typescript
@Entry
@Component
struct TransitionDemo {
  @State isShow: boolean = false

  build() {
    Column({ space: 20 }) {
      Button(this.isShow ? '隐藏' : '显示')
        .onClick(() => {
          this.isShow = !this.isShow
        })

      if (this.isShow) {
        // 淡入淡出
        Text('淡入淡出效果')
          .padding(20)
          .backgroundColor('#007AFF')
          .fontColor('#FFFFFF')
          .transition({
            type: TransitionType.Insert,
            opacity: 0
          })
          .transition({
            type: TransitionType.Delete,
            opacity: 0
          })

        // 缩放转场
        Text('缩放效果')
          .padding(20)
          .backgroundColor('#FF3B30')
          .fontColor('#FFFFFF')
          .transition({
            type: TransitionType.Insert,
            scale: { x: 0, y: 0 }
          })
          .transition({
            type: TransitionType.Delete,
            scale: { x: 0, y: 0 }
          })

        // 滑动转场
        Text('滑动效果')
          .padding(20)
          .backgroundColor('#34C759')
          .fontColor('#FFFFFF')
          .transition({
            type: TransitionType.Insert,
            translate: { x: -200 }
          })
          .transition({
            type: TransitionType.Delete,
            translate: { x: 200 }
          })

        // 组合转场
        Text('组合效果')
          .padding(20)
          .backgroundColor('#FF9500')
          .fontColor('#FFFFFF')
          .transition({
            type: TransitionType.All,
            opacity: 0,
            scale: { x: 0.5, y: 0.5 },
            translate: { y: -100 }
          })
      }
    }
    .width('100%')
    .padding(20)
  }
}
```

### 3.2 页面转场

```typescript
// 页面转场配置
@Entry
@Component
struct PageTransitionDemo {
  build() {
    Column() {
      Text('页面转场演示')
    }
  }

  // 页面进入动画
  pageTransition() {
    // 页面入场动画
    PageTransitionEnter({
      duration: 300,
      curve: Curve.EaseOut
    })
    .slide(SlideEffect.Right)  // 从右侧滑入
    .opacity(0)                 // 透明度从0开始

    // 页面退场动画
    PageTransitionExit({
      duration: 300,
      curve: Curve.EaseIn
    })
    .slide(SlideEffect.Left)   // 向左侧滑出
    .opacity(0)                 // 透明度变为0
  }
}

// 不同页面转场效果
@Entry
@Component
struct FadePageTransition {
  pageTransition() {
    PageTransitionEnter({ duration: 300 })
      .opacity(0)
    PageTransitionExit({ duration: 300 })
      .opacity(0)
  }

  build() {
    Column() {
      Text('淡入淡出转场')
    }
  }
}

@Entry
@Component
struct ScalePageTransition {
  pageTransition() {
    PageTransitionEnter({ duration: 300 })
      .scale({ x: 0.8, y: 0.8 })
      .opacity(0)
    PageTransitionExit({ duration: 300 })
      .scale({ x: 1.2, y: 1.2 })
      .opacity(0)
  }

  build() {
    Column() {
      Text('缩放转场')
    }
  }
}
```

### 3.3 共享元素转场

```typescript
// 列表页
@Entry
@Component
struct ProductListPage {
  @State products: IProduct[] = [
    { id: '1', name: '商品1', image: 'https://example.com/1.jpg' },
    { id: '2', name: '商品2', image: 'https://example.com/2.jpg' }
  ]

  build() {
    List() {
      ForEach(this.products, (product: IProduct) => {
        ListItem() {
          Row({ space: 12 }) {
            Image(product.image)
              .width(80)
              .height(80)
              .borderRadius(8)
              // 共享元素标识
              .sharedTransition(`product_image_${product.id}`, {
                duration: 300,
                curve: Curve.EaseInOut
              })

            Text(product.name)
              .sharedTransition(`product_name_${product.id}`, {
                duration: 300
              })
          }
          .onClick(() => {
            // 跳转到详情页
            // router.pushUrl({ url: 'pages/ProductDetail', params: { product } })
          })
        }
      })
    }
  }
}

interface IProduct {
  id: string
  name: string
  image: string
}

// 详情页
@Entry
@Component
struct ProductDetailPage {
  @State product: IProduct = { id: '', name: '', image: '' }

  aboutToAppear(): void {
    // 获取参数
    // this.product = router.getParams()?.product
  }

  build() {
    Column() {
      Image(this.product.image)
        .width('100%')
        .height(300)
        // 与列表页共享
        .sharedTransition(`product_image_${this.product.id}`, {
          duration: 300,
          curve: Curve.EaseInOut
        })

      Text(this.product.name)
        .fontSize(24)
        .sharedTransition(`product_name_${this.product.id}`, {
          duration: 300
        })
    }
  }
}
```

---

## 4. 手势处理

### 4.1 基础手势

```typescript
@Entry
@Component
struct GestureDemo {
  @State message: string = ''
  @State scale: number = 1
  @State rotate: number = 0
  @State offsetX: number = 0
  @State offsetY: number = 0

  build() {
    Column({ space: 20 }) {
      Text(this.message)
        .fontSize(16)
        .height(50)

      // 点击手势
      Text('点击我')
        .padding(20)
        .backgroundColor('#007AFF')
        .fontColor('#FFFFFF')
        .gesture(
          TapGesture({ count: 1 })  // 单击
            .onAction(() => {
              this.message = '单击触发'
            })
        )

      // 双击手势
      Text('双击我')
        .padding(20)
        .backgroundColor('#FF3B30')
        .fontColor('#FFFFFF')
        .gesture(
          TapGesture({ count: 2 })  // 双击
            .onAction(() => {
              this.message = '双击触发'
            })
        )

      // 长按手势
      Text('长按我')
        .padding(20)
        .backgroundColor('#34C759')
        .fontColor('#FFFFFF')
        .gesture(
          LongPressGesture({ repeat: false, duration: 500 })
            .onAction(() => {
              this.message = '长按触发'
            })
        )

      // 拖拽手势
      Text('拖拽我')
        .padding(20)
        .backgroundColor('#FF9500')
        .fontColor('#FFFFFF')
        .translate({ x: this.offsetX, y: this.offsetY })
        .gesture(
          PanGesture()
            .onActionUpdate((event) => {
              if (event) {
                this.offsetX += event.offsetX
                this.offsetY += event.offsetY
              }
            })
        )

      // 缩放手势
      Text('捏合缩放')
        .padding(20)
        .backgroundColor('#5856D6')
        .fontColor('#FFFFFF')
        .scale({ x: this.scale, y: this.scale })
        .gesture(
          PinchGesture()
            .onActionUpdate((event) => {
              if (event) {
                this.scale = event.scale
              }
            })
        )

      // 旋转手势
      Text('旋转我')
        .padding(20)
        .backgroundColor('#AF52DE')
        .fontColor('#FFFFFF')
        .rotate({ angle: this.rotate })
        .gesture(
          RotationGesture()
            .onActionUpdate((event) => {
              if (event) {
                this.rotate = event.angle
              }
            })
        )
    }
    .padding(20)
  }
}
```

### 4.2 组合手势

```typescript
@Entry
@Component
struct CombinedGestureDemo {
  @State scale: number = 1
  @State rotate: number = 0
  @State offsetX: number = 0
  @State offsetY: number = 0

  build() {
    Column() {
      Text('组合手势操作')
        .fontSize(20)
        .padding(40)
        .backgroundColor('#007AFF')
        .fontColor('#FFFFFF')
        .scale({ x: this.scale, y: this.scale })
        .rotate({ angle: this.rotate })
        .translate({ x: this.offsetX, y: this.offsetY })
        // 并行组合手势
        .gesture(
          GestureGroup(GestureMode.Parallel,
            // 拖拽
            PanGesture()
              .onActionUpdate((event) => {
                if (event) {
                  this.offsetX += event.offsetX
                  this.offsetY += event.offsetY
                }
              }),
            // 缩放
            PinchGesture()
              .onActionUpdate((event) => {
                if (event) {
                  this.scale = event.scale
                }
              }),
            // 旋转
            RotationGesture()
              .onActionUpdate((event) => {
                if (event) {
                  this.rotate = event.angle
                }
              })
          )
        )

      Button('重置')
        .margin({ top: 40 })
        .onClick(() => {
          animateTo({ duration: 300 }, () => {
            this.scale = 1
            this.rotate = 0
            this.offsetX = 0
            this.offsetY = 0
          })
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}

// 顺序手势示例
@Entry
@Component
struct SequenceGestureDemo {
  @State message: string = '先长按，再拖动'
  @State offsetX: number = 0
  @State offsetY: number = 0
  @State isDragging: boolean = false

  build() {
    Column() {
      Text(this.message)
        .margin({ bottom: 20 })

      Text('拖动我')
        .padding(40)
        .backgroundColor(this.isDragging ? '#FF3B30' : '#007AFF')
        .fontColor('#FFFFFF')
        .translate({ x: this.offsetX, y: this.offsetY })
        // 顺序手势：先长按激活，再拖动
        .gesture(
          GestureGroup(GestureMode.Sequence,
            LongPressGesture({ duration: 300 })
              .onAction(() => {
                this.isDragging = true
                this.message = '现在可以拖动了'
              }),
            PanGesture()
              .onActionUpdate((event) => {
                if (event && this.isDragging) {
                  this.offsetX += event.offsetX
                  this.offsetY += event.offsetY
                }
              })
              .onActionEnd(() => {
                this.isDragging = false
                this.message = '先长按，再拖动'
              })
          )
        )
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

### 4.3 企业级手势应用

```typescript
// 企业级实战：可滑动删除的列表项
@Component
struct SwipeToDeleteItem {
  @Prop item: IListItem = {} as IListItem
  @State offsetX: number = 0
  @State showDelete: boolean = false
  private deleteThreshold: number = -80
  onDelete?: () => void

  build() {
    Stack({ alignContent: Alignment.End }) {
      // 删除按钮背景
      Row() {
        Button('删除')
          .width(80)
          .height('100%')
          .backgroundColor('#FF3B30')
          .fontColor('#FFFFFF')
          .onClick(() => {
            this.onDelete?.()
          })
      }
      .width(80)
      .height('100%')
      .justifyContent(FlexAlign.End)

      // 内容区域
      Row() {
        Text(this.item.title)
          .fontSize(16)
      }
      .width('100%')
      .height(60)
      .padding(16)
      .backgroundColor('#FFFFFF')
      .translate({ x: this.offsetX })
      .gesture(
        PanGesture({ direction: PanDirection.Horizontal })
          .onActionUpdate((event) => {
            if (event) {
              // 限制滑动范围
              let newOffset = event.offsetX
              if (newOffset > 0) newOffset = 0  // 不允许右滑
              if (newOffset < this.deleteThreshold) newOffset = this.deleteThreshold
              this.offsetX = newOffset
            }
          })
          .onActionEnd(() => {
            // 判断是否显示删除按钮
            if (this.offsetX < this.deleteThreshold / 2) {
              animateTo({ duration: 200 }, () => {
                this.offsetX = this.deleteThreshold
                this.showDelete = true
              })
            } else {
              animateTo({ duration: 200 }, () => {
                this.offsetX = 0
                this.showDelete = false
              })
            }
          })
      )
    }
    .width('100%')
    .height(60)
    .clip(true)
  }
}

interface IListItem {
  id: string
  title: string
}

// 企业级实战：图片查看器（支持缩放和拖拽）
@Component
struct ImageViewer {
  @Prop src: string = ''
  @State scale: number = 1
  @State offsetX: number = 0
  @State offsetY: number = 0
  @State lastScale: number = 1
  @State lastOffsetX: number = 0
  @State lastOffsetY: number = 0

  build() {
    Stack() {
      Image(this.src)
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Contain)
        .scale({ x: this.scale, y: this.scale })
        .translate({ x: this.offsetX, y: this.offsetY })
        .gesture(
          GestureGroup(GestureMode.Parallel,
            // 双击缩放
            TapGesture({ count: 2 })
              .onAction(() => {
                animateTo({ duration: 300, curve: Curve.EaseOut }, () => {
                  if (this.scale > 1) {
                    this.scale = 1
                    this.offsetX = 0
                    this.offsetY = 0
                  } else {
                    this.scale = 2
                  }
                  this.lastScale = this.scale
                  this.lastOffsetX = this.offsetX
                  this.lastOffsetY = this.offsetY
                })
              }),
            // 捏合缩放
            PinchGesture()
              .onActionStart(() => {
                this.lastScale = this.scale
              })
              .onActionUpdate((event) => {
                if (event) {
                  let newScale = this.lastScale * event.scale
                  // 限制缩放范围
                  if (newScale < 0.5) newScale = 0.5
                  if (newScale > 4) newScale = 4
                  this.scale = newScale
                }
              })
              .onActionEnd(() => {
                // 缩放小于1时恢复
                if (this.scale < 1) {
                  animateTo({ duration: 200 }, () => {
                    this.scale = 1
                    this.offsetX = 0
                    this.offsetY = 0
                  })
                }
                this.lastScale = this.scale
              }),
            // 拖拽
            PanGesture()
              .onActionStart(() => {
                this.lastOffsetX = this.offsetX
                this.lastOffsetY = this.offsetY
              })
              .onActionUpdate((event) => {
                if (event && this.scale > 1) {
                  this.offsetX = this.lastOffsetX + event.offsetX
                  this.offsetY = this.lastOffsetY + event.offsetY
                }
              })
              .onActionEnd(() => {
                this.lastOffsetX = this.offsetX
                this.lastOffsetY = this.offsetY
              })
          )
        )
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#000000')
  }
}

// 企业级实战：下拉刷新效果
@Component
struct PullToRefresh {
  @Link isRefreshing: boolean
  @State pullDistance: number = 0
  @State headerOpacity: number = 0
  private refreshThreshold: number = 80
  private maxPullDistance: number = 150
  @BuilderParam content: () => void = this.defaultContent

  @Builder
  defaultContent() {
    Text('内容区域')
  }

  build() {
    Column() {
      // 刷新头部
      Row() {
        if (this.isRefreshing) {
          LoadingProgress()
            .width(24)
            .height(24)
          Text('刷新中...')
            .fontSize(14)
            .fontColor('#666666')
            .margin({ left: 8 })
        } else if (this.pullDistance >= this.refreshThreshold) {
          Text('释放刷新')
            .fontSize(14)
            .fontColor('#666666')
        } else {
          Text('下拉刷新')
            .fontSize(14)
            .fontColor('#666666')
        }
      }
      .width('100%')
      .height(50)
      .justifyContent(FlexAlign.Center)
      .opacity(this.headerOpacity)

      // 内容区域
      Column() {
        this.content()
      }
      .translate({ y: this.isRefreshing ? 0 : this.pullDistance - 50 })
    }
    .gesture(
      PanGesture({ direction: PanDirection.Vertical })
        .onActionUpdate((event) => {
          if (event && event.offsetY > 0 && !this.isRefreshing) {
            // 应用阻尼效果
            let distance = event.offsetY * 0.5
            if (distance > this.maxPullDistance) distance = this.maxPullDistance
            this.pullDistance = distance
            this.headerOpacity = Math.min(distance / this.refreshThreshold, 1)
          }
        })
        .onActionEnd(() => {
          if (this.pullDistance >= this.refreshThreshold) {
            this.isRefreshing = true
          }
          animateTo({ duration: 200 }, () => {
            this.pullDistance = 0
            this.headerOpacity = 0
          })
        })
    )
  }
}
```

---

## 5. 弹窗与提示

### 5.1 AlertDialog警告弹窗

```typescript
@Entry
@Component
struct AlertDialogDemo {
  build() {
    Column({ space: 16 }) {
      // 基础提示框
      Button('基础弹窗')
        .onClick(() => {
          AlertDialog.show({
            title: '提示',
            message: '这是一个基础提示框',
            confirm: {
              value: '确定',
              action: () => {
                console.info('点击确定')
              }
            }
          })
        })

      // 确认取消弹窗
      Button('确认弹窗')
        .onClick(() => {
          AlertDialog.show({
            title: '确认删除',
            message: '确定要删除这条记录吗？删除后无法恢复。',
            primaryButton: {
              value: '取消',
              action: () => {
                console.info('点击取消')
              }
            },
            secondaryButton: {
              value: '删除',
              fontColor: '#FF3B30',
              action: () => {
                console.info('点击删除')
              }
            }
          })
        })

      // 自定义样式弹窗
      Button('自定义弹窗')
        .onClick(() => {
          AlertDialog.show({
            title: '温馨提示',
            message: '您的会员即将到期，是否续费？',
            autoCancel: true,  // 点击遮罩关闭
            alignment: DialogAlignment.Center,
            offset: { dx: 0, dy: 0 },
            primaryButton: {
              value: '暂不续费',
              fontColor: '#666666',
              backgroundColor: '#F5F5F5',
              action: () => {}
            },
            secondaryButton: {
              value: '立即续费',
              fontColor: '#FFFFFF',
              backgroundColor: '#007AFF',
              action: () => {}
            }
          })
        })
    }
    .padding(16)
  }
}
```

### 5.2 ActionSheet操作表

```typescript
@Entry
@Component
struct ActionSheetDemo {
  build() {
    Column({ space: 16 }) {
      Button('显示操作表')
        .onClick(() => {
          ActionSheet.show({
            title: '请选择操作',
            message: '选择要执行的操作',
            autoCancel: true,
            confirm: {
              value: '取消',
              action: () => {}
            },
            sheets: [
              {
                title: '拍照',
                icon: $r('app.media.ic_camera'),
                action: () => {
                  console.info('选择拍照')
                }
              },
              {
                title: '从相册选择',
                icon: $r('app.media.ic_photo'),
                action: () => {
                  console.info('选择相册')
                }
              },
              {
                title: '从文件选择',
                icon: $r('app.media.ic_file'),
                action: () => {
                  console.info('选择文件')
                }
              }
            ]
          })
        })

      Button('分享操作表')
        .onClick(() => {
          ActionSheet.show({
            title: '分享到',
            sheets: [
              { title: '微信好友', action: () => {} },
              { title: '朋友圈', action: () => {} },
              { title: '微博', action: () => {} },
              { title: 'QQ', action: () => {} },
              { title: '复制链接', action: () => {} }
            ],
            confirm: {
              value: '取消',
              action: () => {}
            }
          })
        })
    }
    .padding(16)
  }
}
```

### 5.3 自定义弹窗

```typescript
// 自定义弹窗组件
@CustomDialog
struct CustomDialogComponent {
  controller: CustomDialogController
  title: string = ''
  message: string = ''
  onConfirm?: () => void
  onCancel?: () => void

  build() {
    Column({ space: 16 }) {
      // 标题
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)

      // 内容
      Text(this.message)
        .fontSize(14)
        .fontColor('#666666')
        .textAlign(TextAlign.Center)

      // 按钮
      Row({ space: 16 }) {
        Button('取消')
          .layoutWeight(1)
          .backgroundColor('#F5F5F5')
          .fontColor('#666666')
          .onClick(() => {
            this.onCancel?.()
            this.controller.close()
          })

        Button('确定')
          .layoutWeight(1)
          .backgroundColor('#007AFF')
          .fontColor('#FFFFFF')
          .onClick(() => {
            this.onConfirm?.()
            this.controller.close()
          })
      }
      .width('100%')
    }
    .width('80%')
    .padding(24)
    .backgroundColor('#FFFFFF')
    .borderRadius(16)
  }
}

// 使用自定义弹窗
@Entry
@Component
struct CustomDialogDemo {
  private dialogController: CustomDialogController = new CustomDialogController({
    builder: CustomDialogComponent({
      title: '自定义弹窗',
      message: '这是一个自定义样式的弹窗组件',
      onConfirm: () => {
        console.info('确认')
      },
      onCancel: () => {
        console.info('取消')
      }
    }),
    autoCancel: true,
    alignment: DialogAlignment.Center,
    customStyle: true
  })

  build() {
    Column() {
      Button('显示自定义弹窗')
        .onClick(() => {
          this.dialogController.open()
        })
    }
    .padding(16)
  }
}

// 企业级实战：带输入框的弹窗
@CustomDialog
struct InputDialog {
  controller: CustomDialogController
  title: string = ''
  placeholder: string = ''
  @State inputValue: string = ''
  onConfirm?: (value: string) => void

  build() {
    Column({ space: 16 }) {
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)

      TextInput({ placeholder: this.placeholder, text: this.inputValue })
        .height(48)
        .onChange((value) => {
          this.inputValue = value
        })

      Row({ space: 16 }) {
        Button('取消')
          .layoutWeight(1)
          .backgroundColor('#F5F5F5')
          .fontColor('#666666')
          .onClick(() => {
            this.controller.close()
          })

        Button('确定')
          .layoutWeight(1)
          .backgroundColor('#007AFF')
          .fontColor('#FFFFFF')
          .onClick(() => {
            this.onConfirm?.(this.inputValue)
            this.controller.close()
          })
      }
      .width('100%')
    }
    .width('80%')
    .padding(24)
    .backgroundColor('#FFFFFF')
    .borderRadius(16)
  }
}

// 企业级实战：底部弹出选择器
@CustomDialog
struct BottomPicker {
  controller: CustomDialogController
  title: string = ''
  options: string[] = []
  @State selectedIndex: number = 0
  onConfirm?: (index: number, value: string) => void

  build() {
    Column() {
      // 顶部栏
      Row() {
        Text('取消')
          .fontSize(16)
          .fontColor('#666666')
          .onClick(() => {
            this.controller.close()
          })

        Text(this.title)
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Text('确定')
          .fontSize(16)
          .fontColor('#007AFF')
          .onClick(() => {
            this.onConfirm?.(this.selectedIndex, this.options[this.selectedIndex])
            this.controller.close()
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .borderWidth({ bottom: 1 })
      .borderColor('#EEEEEE')

      // 选项列表
      List() {
        ForEach(this.options, (option: string, index: number) => {
          ListItem() {
            Row() {
              Text(option)
                .fontSize(16)
                .fontColor(this.selectedIndex === index ? '#007AFF' : '#333333')
              Blank()
              if (this.selectedIndex === index) {
                Image($r('app.media.ic_check'))
                  .width(20)
                  .height(20)
                  .fillColor('#007AFF')
              }
            }
            .width('100%')
            .height(56)
            .padding({ left: 16, right: 16 })
            .onClick(() => {
              this.selectedIndex = index
            })
          }
        })
      }
      .width('100%')
      .height(300)
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius({ topLeft: 16, topRight: 16 })
  }
}
```

### 5.4 Toast提示

```typescript
import { promptAction } from '@kit.ArkUI'

@Entry
@Component
struct ToastDemo {
  build() {
    Column({ space: 16 }) {
      Button('显示Toast')
        .onClick(() => {
          promptAction.showToast({
            message: '操作成功',
            duration: 2000,  // 显示时长 ms
            bottom: 100      // 距离底部距离
          })
        })

      Button('顶部Toast')
        .onClick(() => {
          promptAction.showToast({
            message: '顶部提示',
            duration: 2000,
            alignment: Alignment.Top
          })
        })

      Button('居中Toast')
        .onClick(() => {
          promptAction.showToast({
            message: '居中提示',
            duration: 2000,
            alignment: Alignment.Center
          })
        })
    }
    .padding(16)
  }
}

// 企业级实战：全局Toast工具类
class ToastUtil {
  static show(message: string, duration: number = 2000): void {
    promptAction.showToast({
      message: message,
      duration: duration,
      bottom: 100
    })
  }

  static success(message: string = '操作成功'): void {
    this.show(message)
  }

  static error(message: string = '操作失败'): void {
    this.show(message)
  }

  static warning(message: string): void {
    this.show(message)
  }

  static loading(message: string = '加载中...'): void {
    this.show(message, 60000)  // 长时间显示，需要手动关闭
  }
}
```

### 5.5 Loading加载

```typescript
// 企业级实战：全局Loading组件
@CustomDialog
struct LoadingDialog {
  controller: CustomDialogController
  message: string = '加载中...'

  build() {
    Column({ space: 16 }) {
      LoadingProgress()
        .width(50)
        .height(50)
        .color('#FFFFFF')

      Text(this.message)
        .fontSize(14)
        .fontColor('#FFFFFF')
    }
    .padding(24)
    .backgroundColor('rgba(0,0,0,0.7)')
    .borderRadius(12)
  }
}

// Loading管理器
class LoadingManager {
  private static controller: CustomDialogController | null = null

  static show(message: string = '加载中...'): void {
    if (this.controller) {
      this.hide()
    }

    this.controller = new CustomDialogController({
      builder: LoadingDialog({ message: message }),
      autoCancel: false,
      alignment: DialogAlignment.Center,
      customStyle: true
    })
    this.controller.open()
  }

  static hide(): void {
    if (this.controller) {
      this.controller.close()
      this.controller = null
    }
  }
}

// 使用示例
@Entry
@Component
struct LoadingDemo {
  async fetchData(): Promise<void> {
    LoadingManager.show('正在加载...')
    
    try {
      // 模拟请求
      await new Promise<void>(resolve => setTimeout(resolve, 2000))
      ToastUtil.success('加载成功')
    } catch (error) {
      ToastUtil.error('加载失败')
    } finally {
      LoadingManager.hide()
    }
  }

  build() {
    Column() {
      Button('加载数据')
        .onClick(() => this.fetchData())
    }
    .padding(16)
  }
}
```

---

## 6. 自定义绘制

### 6.1 Canvas绑制

```typescript
@Entry
@Component
struct CanvasDemo {
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)

  build() {
    Column() {
      Canvas(this.context)
        .width('100%')
        .height(400)
        .onReady(() => {
          this.drawShapes()
        })
    }
  }

  drawShapes(): void {
    const ctx = this.context

    // 绘制矩形
    ctx.fillStyle = '#007AFF'
    ctx.fillRect(20, 20, 100, 80)

    // 绘制描边矩形
    ctx.strokeStyle = '#FF3B30'
    ctx.lineWidth = 2
    ctx.strokeRect(140, 20, 100, 80)

    // 绘制圆形
    ctx.beginPath()
    ctx.arc(70, 160, 40, 0, Math.PI * 2)
    ctx.fillStyle = '#34C759'
    ctx.fill()

    // 绘制线条
    ctx.beginPath()
    ctx.moveTo(140, 120)
    ctx.lineTo(240, 120)
    ctx.lineTo(190, 200)
    ctx.closePath()
    ctx.strokeStyle = '#FF9500'
    ctx.lineWidth = 3
    ctx.stroke()

    // 绘制文字
    ctx.font = '20px sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('Canvas绑制', 20, 260)

    // 绘制渐变
    const gradient = ctx.createLinearGradient(20, 280, 120, 350)
    gradient.addColorStop(0, '#007AFF')
    gradient.addColorStop(1, '#AF52DE')
    ctx.fillStyle = gradient
    ctx.fillRect(20, 280, 100, 70)
  }
}
```

### 6.2 图表绘制

```typescript
// 企业级实战：柱状图组件
@Component
struct BarChart {
  @Prop data: IChartData[] = []
  @Prop width: number = 300
  @Prop height: number = 200
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)

  build() {
    Canvas(this.context)
      .width(this.width)
      .height(this.height)
      .onReady(() => {
        this.draw()
      })
  }

  draw(): void {
    const ctx = this.context
    const padding = 40
    const chartWidth = this.width - padding * 2
    const chartHeight = this.height - padding * 2
    
    if (this.data.length === 0) return

    const maxValue = Math.max(...this.data.map(d => d.value))
    const barWidth = chartWidth / this.data.length * 0.6
    const barGap = chartWidth / this.data.length * 0.4

    // 清空画布
    ctx.clearRect(0, 0, this.width, this.height)

    // 绘制坐标轴
    ctx.beginPath()
    ctx.strokeStyle = '#CCCCCC'
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, this.height - padding)
    ctx.lineTo(this.width - padding, this.height - padding)
    ctx.stroke()

    // 绘制柱状图
    this.data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight
      const x = padding + index * (barWidth + barGap) + barGap / 2
      const y = this.height - padding - barHeight

      // 渐变填充
      const gradient = ctx.createLinearGradient(x, y, x, this.height - padding)
      gradient.addColorStop(0, item.color || '#007AFF')
      gradient.addColorStop(1, this.lightenColor(item.color || '#007AFF', 0.3))
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // 绘制标签
      ctx.fillStyle = '#666666'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(item.label, x + barWidth / 2, this.height - padding + 20)

      // 绘制数值
      ctx.fillStyle = '#333333'
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)
    })
  }

  // 颜色变亮
  lightenColor(color: string, percent: number): string {
    // 简化处理，实际应解析颜色值
    return color
  }
}

interface IChartData {
  label: string
  value: number
  color?: string
}

// 企业级实战：饼图组件
@Component
struct PieChart {
  @Prop data: IChartData[] = []
  @Prop size: number = 200
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private colors: string[] = ['#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#5856D6']

  build() {
    Canvas(this.context)
      .width(this.size)
      .height(this.size)
      .onReady(() => {
        this.draw()
      })
  }

  draw(): void {
    const ctx = this.context
    const centerX = this.size / 2
    const centerY = this.size / 2
    const radius = this.size / 2 - 10
    
    if (this.data.length === 0) return

    const total = this.data.reduce((sum, item) => sum + item.value, 0)
    let startAngle = -Math.PI / 2  // 从12点钟方向开始

    this.data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * Math.PI * 2
      const endAngle = startAngle + sliceAngle

      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = item.color || this.colors[index % this.colors.length]
      ctx.fill()

      // 绘制标签
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const percentage = ((item.value / total) * 100).toFixed(1) + '%'
      ctx.fillText(percentage, labelX, labelY)

      startAngle = endAngle
    })
  }
}

// 使用示例
@Entry
@Component
struct ChartDemo {
  private barData: IChartData[] = [
    { label: '一月', value: 120 },
    { label: '二月', value: 200 },
    { label: '三月', value: 150 },
    { label: '四月', value: 180 },
    { label: '五月', value: 250 }
  ]

  private pieData: IChartData[] = [
    { label: '产品A', value: 35 },
    { label: '产品B', value: 25 },
    { label: '产品C', value: 20 },
    { label: '产品D', value: 20 }
  ]

  build() {
    Column({ space: 20 }) {
      Text('销售数据 - 柱状图')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)

      BarChart({
        data: this.barData,
        width: 350,
        height: 250
      })

      Text('产品占比 - 饼图')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)

      PieChart({
        data: this.pieData,
        size: 200
      })
    }
    .padding(16)
  }
}
```

---

## 7. 性能优化

### 7.1 列表优化

```typescript
// 使用LazyForEach进行懒加载
class BasicDataSource implements IDataSource {
  private listeners: DataChangeListener[] = []
  private data: string[] = []

  constructor(data: string[]) {
    this.data = data
  }

  totalCount(): number {
    return this.data.length
  }

  getData(index: number): string {
    return this.data[index]
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener)
    }
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    const pos = this.listeners.indexOf(listener)
    if (pos >= 0) {
      this.listeners.splice(pos, 1)
    }
  }

  notifyDataReload(): void {
    this.listeners.forEach(listener => {
      listener.onDataReloaded()
    })
  }

  notifyDataAdd(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataAdd(index)
    })
  }

  public addData(data: string): void {
    this.data.push(data)
    this.notifyDataAdd(this.data.length - 1)
  }
}

@Entry
@Component
struct LazyForEachDemo {
  private dataSource: BasicDataSource = new BasicDataSource(
    Array.from({ length: 10000 }, (_, i) => `Item ${i}`)
  )

  build() {
    List() {
      LazyForEach(this.dataSource, (item: string, index: number) => {
        ListItem() {
          Text(item)
            .padding(16)
            .width('100%')
        }
      }, (item: string) => item)  // 使用唯一key
    }
    .width('100%')
    .height('100%')
    .cachedCount(5)  // 缓存数量
  }
}
```

### 7.2 组件复用

```typescript
// 使用@Reusable标记可复用组件
@Reusable
@Component
struct ReusableListItem {
  @State item: IProduct = {} as IProduct

  // 组件复用时调用
  aboutToReuse(params: Record<string, Object>): void {
    this.item = params.item as IProduct
  }

  build() {
    Row({ space: 12 }) {
      Image(this.item.image)
        .width(80)
        .height(80)
        .borderRadius(8)

      Column({ space: 4 }) {
        Text(this.item.name)
          .fontSize(16)
        Text(`¥${this.item.price}`)
          .fontSize(14)
          .fontColor('#FF3B30')
      }
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding(12)
  }
}

interface IProduct {
  id: string
  name: string
  price: number
  image: string
}

@Entry
@Component
struct ReusableListDemo {
  @State products: IProduct[] = Array.from({ length: 1000 }, (_, i) => ({
    id: `${i}`,
    name: `商品 ${i}`,
    price: Math.floor(Math.random() * 1000) + 100,
    image: `https://example.com/image${i % 10}.jpg`
  }))

  build() {
    List() {
      ForEach(this.products, (item: IProduct) => {
        ListItem() {
          ReusableListItem({ item: item })
        }
      })
    }
    .width('100%')
    .height('100%')
  }
}
```

### 7.3 状态优化

```typescript
// 避免不必要的状态更新
@Entry
@Component
struct StateOptimizationDemo {
  // 使用@State时只装饰需要响应式的变量
  @State visibleData: IProduct[] = []
  
  // 不需要响应式的数据使用普通变量
  private allData: IProduct[] = []
  private pageNo: number = 1
  private pageSize: number = 20

  aboutToAppear(): void {
    // 初始化数据
    this.allData = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i}`,
      name: `商品 ${i}`,
      price: i * 10
    }))
    this.loadMore()
  }

  loadMore(): void {
    const start = (this.pageNo - 1) * this.pageSize
    const end = start + this.pageSize
    const newData = this.allData.slice(start, end)
    
    // 只有最终展示的数据使用状态
    this.visibleData = [...this.visibleData, ...newData]
    this.pageNo++
  }

  build() {
    List() {
      ForEach(this.visibleData, (item: IProduct) => {
        ListItem() {
          Text(item.name)
            .padding(16)
        }
      })
    }
    .onReachEnd(() => {
      this.loadMore()
    })
  }
}

interface IProduct {
  id: string
  name: string
  price: number
}
```

### 7.4 图片优化

```typescript
// 图片加载优化
@Component
struct OptimizedImage {
  @Prop src: string = ''
  @Prop width: number = 100
  @Prop height: number = 100
  @State loaded: boolean = false

  build() {
    Stack() {
      // 占位图
      if (!this.loaded) {
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

      Image(this.src)
        .width(this.width)
        .height(this.height)
        .objectFit(ImageFit.Cover)
        // 图片同步加载，减少内存占用
        .syncLoad(false)
        // 启用缓存
        .alt($r('app.media.placeholder'))
        .onComplete(() => {
          this.loaded = true
        })
        .onError(() => {
          this.loaded = true  // 加载失败也显示默认图
        })
    }
    .width(this.width)
    .height(this.height)
  }
}

// 企业级实战：虚拟列表图片加载
@Component
struct VirtualizedImageList {
  @State visibleRange: number[] = [0, 10]
  private allImages: string[] = Array.from(
    { length: 1000 },
    (_, i) => `https://example.com/image${i}.jpg`
  )

  build() {
    List() {
      ForEach(this.allImages, (src: string, index: number) => {
        ListItem() {
          // 只有可见范围内的图片才真正加载
          if (index >= this.visibleRange[0] && index <= this.visibleRange[1]) {
            OptimizedImage({
              src: src,
              width: 100,
              height: 100
            })
          } else {
            // 占位
            Column()
              .width(100)
              .height(100)
              .backgroundColor('#F5F5F5')
          }
        }
      })
    }
    .onScrollIndex((start, end) => {
      // 更新可见范围（带缓冲区）
      this.visibleRange = [Math.max(0, start - 5), end + 5]
    })
  }
}
```

### 7.5 内存管理

```typescript
// 企业级实战：资源释放管理
@Entry
@Component
struct MemoryManagementDemo {
  @State data: object[] = []
  private timers: number[] = []
  private subscriptions: Function[] = []

  aboutToAppear(): void {
    // 设置定时器
    const timer = setInterval(() => {
      console.info('定时任务执行')
    }, 5000)
    this.timers.push(timer)

    // 模拟订阅
    const unsubscribe = this.subscribe('event', () => {
      console.info('事件触发')
    })
    this.subscriptions.push(unsubscribe)
  }

  aboutToDisappear(): void {
    // 清理定时器
    this.timers.forEach(timer => {
      clearInterval(timer)
    })
    this.timers = []

    // 取消订阅
    this.subscriptions.forEach(unsubscribe => {
      unsubscribe()
    })
    this.subscriptions = []

    // 清理大数据
    this.data = []
  }

  subscribe(event: string, callback: Function): Function {
    // 模拟订阅实现
    return () => {
      // 取消订阅
    }
  }

  build() {
    Column() {
      Text('内存管理示例')
    }
  }
}
```

---

## 企业级最佳实践总结

### 动画使用原则

1. **适度使用**：动画要服务于用户体验，不要过度
2. **性能优先**：使用transform属性（translate/scale/rotate）优于改变布局属性
3. **时长合理**：一般动画时长200-500ms较为合适
4. **曲线选择**：根据场景选择合适的动画曲线

### 手势处理规范

1. **响应区域**：确保手势响应区域足够大（至少44x44）
2. **反馈及时**：手势操作要有即时视觉反馈
3. **冲突处理**：合理处理手势优先级和冲突
4. **边界处理**：添加适当的阻尼和边界限制

### 弹窗设计规范

1. **层级清晰**：使用合适的弹窗类型
2. **交互友好**：支持多种关闭方式
3. **内容简洁**：弹窗内容要简洁明了
4. **过渡自然**：弹出/关闭要有动画过渡

### 性能优化清单

- [ ] 使用LazyForEach处理长列表
- [ ] 使用@Reusable标记可复用组件
- [ ] 合理使用@State，避免不必要的响应式
- [ ] 图片懒加载和缓存
- [ ] 及时清理定时器和订阅
- [ ] 避免在build方法中进行复杂计算

---

*文档完整版结束*
