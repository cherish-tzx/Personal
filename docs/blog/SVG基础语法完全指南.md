# SVG 基础语法完全指南
<div class="doc-toc">
## 目录

1. [SVG 概述](#1-svg-概述)
2. [SVG 基础结构](#2-svg-基础结构)
3. [基本图形元素](#3-基本图形元素)
4. [路径 Path](#4-路径-path)
5. [文本元素](#5-文本元素)
6. [渐变与图案](#6-渐变与图案)
7. [滤镜效果](#7-滤镜效果)
8. [变换 Transform](#8-变换-transform)
9. [裁剪与遮罩](#9-裁剪与遮罩)
10. [动画](#10-动画)
11. [符号与复用](#11-符号与复用)
12. [交互与事件](#12-交互与事件)
13. [SVG 优化](#13-svg-优化)


</div>

---

## 1. SVG 概述

### 1.1 什么是 SVG

SVG（Scalable Vector Graphics）是一种基于 XML 的矢量图形格式，用于描述二维图形。SVG 图像可以无限缩放而不失真，非常适合用于图标、图表、地图等场景。

### 1.2 SVG 的优势

| 特性 | 说明 |
|------|------|
| 可缩放性 | 矢量图形，无限放大不失真 |
| 文件小 | 相比位图，文件体积更小 |
| 可编辑 | 基于 XML，可直接编辑源码 |
| 可交互 | 支持 CSS 和 JavaScript 操作 |
| SEO 友好 | 文本内容可被搜索引擎索引 |
| 可访问性 | 支持 ARIA 属性 |

### 1.3 浏览器支持

所有现代浏览器都支持 SVG，包括 Chrome、Firefox、Safari、Edge 等。

---

## 2. SVG 基础结构

### 2.1 基本语法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="400" 
     height="300"
     viewBox="0 0 400 300">
  <!-- SVG 内容 -->
</svg>
```

### 2.2 核心属性详解

#### 2.2.1 width 和 height

定义 SVG 画布的尺寸。

```xml
<!-- 固定尺寸 -->
<svg width="400" height="300">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
</svg>

<!-- 百分比尺寸（相对于父容器） -->
<svg width="100%" height="100%">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
</svg>

<!-- 无单位（默认像素） -->
<svg width="400" height="300"></svg>

<!-- 带单位 -->
<svg width="10cm" height="10cm"></svg>
<svg width="100mm" height="100mm"></svg>
<svg width="10em" height="10em"></svg>
```

#### 2.2.2 viewBox

viewBox 定义了 SVG 的坐标系统和可视区域。

**语法**: `viewBox="min-x min-y width height"`

```xml
<!-- 基础 viewBox -->
<svg width="400" height="300" viewBox="0 0 400 300">
  <circle cx="200" cy="150" r="100" fill="blue"/>
</svg>

<!-- 放大效果：viewBox 比实际尺寸小 -->
<svg width="400" height="300" viewBox="100 50 200 150">
  <!-- 相当于放大了 2 倍 -->
  <circle cx="200" cy="150" r="50" fill="red"/>
</svg>

<!-- 缩小效果：viewBox 比实际尺寸大 -->
<svg width="400" height="300" viewBox="0 0 800 600">
  <!-- 相当于缩小了 2 倍 -->
  <circle cx="400" cy="300" r="200" fill="green"/>
</svg>

<!-- 平移效果：改变 min-x 和 min-y -->
<svg width="400" height="300" viewBox="-100 -100 400 300">
  <!-- 原点向右下偏移 100 -->
  <circle cx="0" cy="0" r="50" fill="purple"/>
</svg>
```

#### 2.2.3 preserveAspectRatio

控制 viewBox 如何适应视口。

**语法**: `preserveAspectRatio="<align> [<meetOrSlice>]"`

**对齐值 (align)**:
- `none`: 不保持比例，拉伸填充
- `xMinYMin`: 左上对齐
- `xMidYMin`: 上中对齐
- `xMaxYMin`: 右上对齐
- `xMinYMid`: 左中对齐
- `xMidYMid`: 居中对齐（默认）
- `xMaxYMid`: 右中对齐
- `xMinYMax`: 左下对齐
- `xMidYMax`: 下中对齐
- `xMaxYMax`: 右下对齐

**缩放策略 (meetOrSlice)**:
- `meet`: 保持比例，完整显示（默认）
- `slice`: 保持比例，裁剪填充

```xml
<!-- 默认：居中且完整显示 -->
<svg width="400" height="200" viewBox="0 0 200 200" 
     preserveAspectRatio="xMidYMid meet">
  <rect width="200" height="200" fill="blue"/>
</svg>

<!-- 不保持比例，拉伸填充 -->
<svg width="400" height="200" viewBox="0 0 200 200" 
     preserveAspectRatio="none">
  <rect width="200" height="200" fill="red"/>
</svg>

<!-- 左上对齐，裁剪填充 -->
<svg width="200" height="400" viewBox="0 0 200 200" 
     preserveAspectRatio="xMinYMin slice">
  <rect width="200" height="200" fill="green"/>
</svg>

<!-- 右下对齐，完整显示 -->
<svg width="400" height="200" viewBox="0 0 200 200" 
     preserveAspectRatio="xMaxYMax meet">
  <rect width="200" height="200" fill="purple"/>
</svg>
```

### 2.3 命名空间

```xml
<!-- 标准 SVG 命名空间 -->
<svg xmlns="http://www.w3.org/2000/svg">
  <!-- SVG 1.1 内容 -->
</svg>

<!-- 包含 xlink 命名空间（用于链接） -->
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <use xlink:href="#mySymbol"/>
</svg>

<!-- SVG 2.0 简化写法（不需要 xlink） -->
<svg xmlns="http://www.w3.org/2000/svg">
  <use href="#mySymbol"/>
</svg>
```

---

## 3. 基本图形元素

### 3.1 矩形 (rect)

```xml
<!-- 基础矩形 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="100" height="80" fill="blue"/>
</svg>

<!-- 圆角矩形 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 统一圆角 -->
  <rect x="10" y="10" width="100" height="80" rx="15" fill="green"/>
  
  <!-- 不同 x/y 圆角 -->
  <rect x="130" y="10" width="100" height="80" rx="30" ry="10" fill="orange"/>
</svg>

<!-- 带边框的矩形 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="100" height="80" 
        fill="lightblue" 
        stroke="navy" 
        stroke-width="3"/>
</svg>

<!-- 半透明矩形 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="100" height="80" fill="red" fill-opacity="0.5"/>
  <rect x="50" y="40" width="100" height="80" fill="blue" fill-opacity="0.5"/>
</svg>
```

**rect 属性表**:

| 属性 | 说明 | 默认值 |
|------|------|--------|
| x | 左上角 x 坐标 | 0 |
| y | 左上角 y 坐标 | 0 |
| width | 宽度 | 必填 |
| height | 高度 | 必填 |
| rx | x 方向圆角半径 | 0 |
| ry | y 方向圆角半径 | rx 的值 |

### 3.2 圆形 (circle)

```xml
<!-- 基础圆形 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" fill="red"/>
</svg>

<!-- 空心圆 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" 
          fill="none" 
          stroke="blue" 
          stroke-width="5"/>
</svg>

<!-- 虚线圆 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" 
          fill="none" 
          stroke="green" 
          stroke-width="3"
          stroke-dasharray="10,5"/>
</svg>

<!-- 多个圆形组合 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="100" r="60" fill="red" fill-opacity="0.6"/>
  <circle cx="150" cy="100" r="60" fill="green" fill-opacity="0.6"/>
  <circle cx="220" cy="100" r="60" fill="blue" fill-opacity="0.6"/>
</svg>
```

**circle 属性表**:

| 属性 | 说明 | 默认值 |
|------|------|--------|
| cx | 圆心 x 坐标 | 0 |
| cy | 圆心 y 坐标 | 0 |
| r | 半径 | 必填 |

### 3.3 椭圆 (ellipse)

```xml
<!-- 基础椭圆 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="150" cy="100" rx="100" ry="50" fill="purple"/>
</svg>

<!-- 垂直椭圆 -->
<svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="150" rx="50" ry="100" fill="orange"/>
</svg>

<!-- 椭圆边框 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="150" cy="100" rx="100" ry="50" 
           fill="lightgreen" 
           stroke="darkgreen" 
           stroke-width="4"/>
</svg>
```

**ellipse 属性表**:

| 属性 | 说明 | 默认值 |
|------|------|--------|
| cx | 椭圆中心 x 坐标 | 0 |
| cy | 椭圆中心 y 坐标 | 0 |
| rx | x 方向半径 | 必填 |
| ry | y 方向半径 | 必填 |

### 3.4 线条 (line)

```xml
<!-- 基础直线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="10" y1="10" x2="290" y2="190" stroke="black" stroke-width="2"/>
</svg>

<!-- 虚线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="10" y1="50" x2="290" y2="50" 
        stroke="blue" 
        stroke-width="3" 
        stroke-dasharray="15,10"/>
</svg>

<!-- 点线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="10" y1="100" x2="290" y2="100" 
        stroke="red" 
        stroke-width="4" 
        stroke-dasharray="2,8"
        stroke-linecap="round"/>
</svg>

<!-- 带箭头的线（使用 marker） -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
    </marker>
  </defs>
  <line x1="10" y1="100" x2="250" y2="100" 
        stroke="black" 
        stroke-width="2" 
        marker-end="url(#arrowhead)"/>
</svg>
```

**line 属性表**:

| 属性 | 说明 | 默认值 |
|------|------|--------|
| x1 | 起点 x 坐标 | 0 |
| y1 | 起点 y 坐标 | 0 |
| x2 | 终点 x 坐标 | 0 |
| y2 | 终点 y 坐标 | 0 |

### 3.5 折线 (polyline)

```xml
<!-- 基础折线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <polyline points="10,190 50,10 90,150 130,30 170,120 210,50 250,100 290,80"
            fill="none" 
            stroke="blue" 
            stroke-width="2"/>
</svg>

<!-- 填充折线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <polyline points="10,190 50,10 90,150 130,30 170,120 210,50 250,100 290,80 290,190"
            fill="lightblue" 
            stroke="blue" 
            stroke-width="2"/>
</svg>

<!-- 平滑折线（使用 stroke-linejoin） -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <polyline points="10,100 50,20 90,100 130,20 170,100"
            fill="none" 
            stroke="red" 
            stroke-width="10"
            stroke-linejoin="round"/>
</svg>

<!-- 图表示例 -->
<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
  <!-- 坐标轴 -->
  <line x1="50" y1="200" x2="380" y2="200" stroke="#333" stroke-width="2"/>
  <line x1="50" y1="200" x2="50" y2="20" stroke="#333" stroke-width="2"/>
  
  <!-- 数据线 -->
  <polyline points="50,180 100,120 150,150 200,80 250,100 300,50 350,70"
            fill="none" 
            stroke="#4CAF50" 
            stroke-width="3"/>
  
  <!-- 数据点 -->
  <circle cx="50" cy="180" r="5" fill="#4CAF50"/>
  <circle cx="100" cy="120" r="5" fill="#4CAF50"/>
  <circle cx="150" cy="150" r="5" fill="#4CAF50"/>
  <circle cx="200" cy="80" r="5" fill="#4CAF50"/>
  <circle cx="250" cy="100" r="5" fill="#4CAF50"/>
  <circle cx="300" cy="50" r="5" fill="#4CAF50"/>
  <circle cx="350" cy="70" r="5" fill="#4CAF50"/>
</svg>
```

### 3.6 多边形 (polygon)

```xml
<!-- 三角形 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,10 190,190 10,190" 
           fill="yellow" 
           stroke="orange" 
           stroke-width="3"/>
</svg>

<!-- 正五边形 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,10 190,75 155,180 45,180 10,75" 
           fill="lightblue" 
           stroke="blue" 
           stroke-width="2"/>
</svg>

<!-- 六边形 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,10 170,40 170,110 100,140 30,110 30,40" 
           fill="lightgreen" 
           stroke="green" 
           stroke-width="2"/>
</svg>

<!-- 星形 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
           fill="gold" 
           stroke="orange" 
           stroke-width="2"/>
</svg>

<!-- 箭头 -->
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="10,50 100,10 100,30 190,30 190,70 100,70 100,90" 
           fill="#2196F3"/>
</svg>
```

### 3.7 图像 (image)

```xml
<!-- 基础图像 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <image href="photo.jpg" x="10" y="10" width="200" height="150"/>
</svg>

<!-- 使用 xlink:href（兼容旧浏览器） -->
<svg width="400" height="300" 
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <image xlink:href="photo.jpg" x="10" y="10" width="200" height="150"/>
</svg>

<!-- Base64 内嵌图像 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." 
         x="10" y="10" width="100" height="100"/>
</svg>

<!-- 图像保持比例 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <image href="photo.jpg" x="10" y="10" width="200" height="150"
         preserveAspectRatio="xMidYMid meet"/>
</svg>

<!-- 图像裁剪填充 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <image href="photo.jpg" x="10" y="10" width="200" height="150"
         preserveAspectRatio="xMidYMid slice"/>
</svg>
```

---

## 4. 路径 Path

Path 是 SVG 中最强大的元素，可以绑制任何形状。

### 4.1 路径命令概览

| 命令 | 名称 | 参数 | 说明 |
|------|------|------|------|
| M/m | moveto | x y | 移动到指定点 |
| L/l | lineto | x y | 画直线到指定点 |
| H/h | horizontal lineto | x | 画水平线 |
| V/v | vertical lineto | y | 画垂直线 |
| C/c | curveto | x1 y1 x2 y2 x y | 三次贝塞尔曲线 |
| S/s | smooth curveto | x2 y2 x y | 平滑三次贝塞尔曲线 |
| Q/q | quadratic curveto | x1 y1 x y | 二次贝塞尔曲线 |
| T/t | smooth quadratic | x y | 平滑二次贝塞尔曲线 |
| A/a | arc | rx ry rotation large-arc sweep x y | 椭圆弧 |
| Z/z | closepath | 无 | 闭合路径 |

**大写命令**: 绝对坐标（相对于原点）
**小写命令**: 相对坐标（相对于当前点）

### 4.2 移动和直线

```xml
<!-- M 和 L: 移动和直线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 绝对坐标 -->
  <path d="M 10 10 L 100 10 L 100 100 L 10 100 Z" 
        fill="lightblue" stroke="blue" stroke-width="2"/>
  
  <!-- 相对坐标 (小写) -->
  <path d="M 150 10 l 90 0 l 0 90 l -90 0 z" 
        fill="lightgreen" stroke="green" stroke-width="2"/>
</svg>

<!-- H 和 V: 水平和垂直线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 使用 H 和 V 画矩形更简洁 -->
  <path d="M 10 10 H 100 V 100 H 10 Z" 
        fill="lightyellow" stroke="orange" stroke-width="2"/>
  
  <!-- 阶梯形状 -->
  <path d="M 150 100 H 180 V 70 H 210 V 40 H 240 V 10" 
        fill="none" stroke="red" stroke-width="3"/>
</svg>

<!-- 复杂折线图案 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 100 
           L 50 20 
           L 90 80 
           L 130 40 
           L 170 90 
           L 210 30 
           L 250 70 
           L 290 50"
        fill="none" stroke="#2196F3" stroke-width="3" stroke-linecap="round"/>
</svg>
```

### 4.3 贝塞尔曲线

#### 4.3.1 二次贝塞尔曲线 (Q)

```xml
<!-- Q: 二次贝塞尔曲线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 基础二次曲线 -->
  <path d="M 10 100 Q 150 10 290 100" 
        fill="none" stroke="blue" stroke-width="3"/>
  
  <!-- 显示控制点 -->
  <circle cx="10" cy="100" r="5" fill="red"/>
  <circle cx="150" cy="10" r="5" fill="green"/>
  <circle cx="290" cy="100" r="5" fill="red"/>
  <line x1="10" y1="100" x2="150" y2="10" stroke="#ccc" stroke-dasharray="5,5"/>
  <line x1="150" y1="10" x2="290" y2="100" stroke="#ccc" stroke-dasharray="5,5"/>
</svg>

<!-- T: 平滑二次贝塞尔曲线 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- T 命令自动计算控制点，与前一个控制点对称 -->
  <path d="M 10 100 Q 60 10 110 100 T 210 100 T 310 100 T 410 100" 
        fill="none" stroke="purple" stroke-width="3"/>
</svg>
```

#### 4.3.2 三次贝塞尔曲线 (C)

```xml
<!-- C: 三次贝塞尔曲线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 基础三次曲线 -->
  <path d="M 10 100 C 50 10, 250 10, 290 100" 
        fill="none" stroke="blue" stroke-width="3"/>
  
  <!-- 显示控制点 -->
  <circle cx="10" cy="100" r="5" fill="red"/>
  <circle cx="50" cy="10" r="5" fill="green"/>
  <circle cx="250" cy="10" r="5" fill="green"/>
  <circle cx="290" cy="100" r="5" fill="red"/>
</svg>

<!-- S 型曲线 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 150 C 50 50, 100 50, 150 100 C 200 150, 250 150, 290 50" 
        fill="none" stroke="red" stroke-width="3"/>
</svg>

<!-- S: 平滑三次贝塞尔曲线 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- S 命令第一个控制点自动与前一个第二控制点对称 -->
  <path d="M 10 100 C 30 30, 70 30, 100 100 S 170 170, 200 100 S 270 30, 300 100" 
        fill="none" stroke="green" stroke-width="3"/>
</svg>
```

### 4.4 椭圆弧 (A)

弧线命令是最复杂的路径命令。

**语法**: `A rx ry x-axis-rotation large-arc-flag sweep-flag x y`

| 参数 | 说明 |
|------|------|
| rx | x 方向半径 |
| ry | y 方向半径 |
| x-axis-rotation | 椭圆的旋转角度 |
| large-arc-flag | 0=小弧, 1=大弧 |
| sweep-flag | 0=逆时针, 1=顺时针 |
| x, y | 终点坐标 |

```xml
<!-- 基础弧线 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <!-- 四种弧的组合 -->
  <!-- large-arc=0, sweep=0 -->
  <path d="M 50 150 A 50 50 0 0 0 150 150" 
        fill="none" stroke="red" stroke-width="3"/>
  <text x="70" y="120" fill="red">0,0</text>
  
  <!-- large-arc=0, sweep=1 -->
  <path d="M 50 150 A 50 50 0 0 1 150 150" 
        fill="none" stroke="blue" stroke-width="3"/>
  <text x="70" y="200" fill="blue">0,1</text>
  
  <!-- large-arc=1, sweep=0 -->
  <path d="M 250 150 A 50 50 0 1 0 350 150" 
        fill="none" stroke="green" stroke-width="3"/>
  <text x="270" y="50" fill="green">1,0</text>
  
  <!-- large-arc=1, sweep=1 -->
  <path d="M 250 150 A 50 50 0 1 1 350 150" 
        fill="none" stroke="purple" stroke-width="3"/>
  <text x="270" y="270" fill="purple">1,1</text>
</svg>

<!-- 饼图扇形 -->
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <!-- 扇形 1: 90度 -->
  <path d="M 150 150 L 150 50 A 100 100 0 0 1 250 150 Z" 
        fill="#FF6384"/>
  
  <!-- 扇形 2: 120度 -->
  <path d="M 150 150 L 250 150 A 100 100 0 0 1 63 213 Z" 
        fill="#36A2EB"/>
  
  <!-- 扇形 3: 150度 -->
  <path d="M 150 150 L 63 213 A 100 100 0 0 1 150 50 Z" 
        fill="#FFCE56"/>
</svg>

<!-- 圆环进度条 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆环 -->
  <circle cx="100" cy="100" r="80" 
          fill="none" stroke="#e0e0e0" stroke-width="15"/>
  
  <!-- 进度弧（75%） -->
  <path d="M 100 20 A 80 80 0 1 1 20 100" 
        fill="none" stroke="#4CAF50" stroke-width="15" stroke-linecap="round"/>
  
  <text x="100" y="110" text-anchor="middle" font-size="30" fill="#333">75%</text>
</svg>
```

### 4.5 实用路径示例

```xml
<!-- 心形 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 100 180 
           C 40 120, 0 80, 0 50 
           C 0 20, 20 0, 50 0 
           C 80 0, 100 20, 100 50 
           C 100 20, 120 0, 150 0 
           C 180 0, 200 20, 200 50 
           C 200 80, 160 120, 100 180 Z"
        fill="#FF4081"/>
</svg>

<!-- 云朵 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 50 150 
           Q 30 150 30 130 
           Q 30 100 60 100 
           Q 60 60 100 60 
           Q 130 30 170 60 
           Q 200 40 220 70 
           Q 260 70 260 110 
           Q 280 110 280 130 
           Q 280 150 260 150 Z"
        fill="#87CEEB" stroke="#5B9BD5" stroke-width="2"/>
</svg>

<!-- 对话气泡 -->
<svg width="250" height="150" xmlns="http://www.w3.org/2000/svg">
  <path d="M 20 10 
           H 180 
           Q 200 10 200 30 
           V 80 
           Q 200 100 180 100 
           H 80 
           L 50 130 
           L 60 100 
           H 20 
           Q 0 100 0 80 
           V 30 
           Q 0 10 20 10 Z"
        fill="#E3F2FD" stroke="#2196F3" stroke-width="2"/>
</svg>

<!-- 勾选图标 -->
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#4CAF50"/>
  <path d="M 25 50 L 45 70 L 75 35" 
        fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- 关闭图标 -->
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#F44336"/>
  <path d="M 30 30 L 70 70 M 70 30 L 30 70" 
        fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>
</svg>
```

---

## 5. 文本元素

### 5.1 基础文本

```xml
<!-- 基础文本 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="50" font-size="24" fill="black">Hello SVG!</text>
</svg>

<!-- 文本样式 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="30" font-size="20" font-family="Arial" fill="blue">Arial 字体</text>
  <text x="10" y="60" font-size="20" font-family="Georgia" fill="green">Georgia 字体</text>
  <text x="10" y="90" font-size="20" font-weight="bold" fill="red">粗体文本</text>
  <text x="10" y="120" font-size="20" font-style="italic" fill="purple">斜体文本</text>
  <text x="10" y="150" font-size="20" text-decoration="underline" fill="orange">下划线文本</text>
  <text x="10" y="180" font-size="20" text-decoration="line-through" fill="gray">删除线文本</text>
</svg>

<!-- 文本描边 -->
<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="60" font-size="48" font-weight="bold"
        fill="none" stroke="blue" stroke-width="2">描边文字</text>
</svg>

<!-- 文本填充+描边 -->
<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="60" font-size="48" font-weight="bold"
        fill="yellow" stroke="orange" stroke-width="2">轮廓文字</text>
</svg>
```

### 5.2 文本对齐

```xml
<!-- 水平对齐 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <line x1="150" y1="0" x2="150" y2="150" stroke="#ccc" stroke-dasharray="5,5"/>
  
  <!-- start: 默认，文本从 x 开始向右 -->
  <text x="150" y="40" text-anchor="start" font-size="20" fill="red">start 对齐</text>
  
  <!-- middle: 文本以 x 为中心 -->
  <text x="150" y="80" text-anchor="middle" font-size="20" fill="green">middle 对齐</text>
  
  <!-- end: 文本到 x 结束 -->
  <text x="150" y="120" text-anchor="end" font-size="20" fill="blue">end 对齐</text>
</svg>

<!-- 垂直对齐 -->
<svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="75" x2="400" y2="75" stroke="#ccc" stroke-dasharray="5,5"/>
  
  <text x="10" y="75" font-size="20" dominant-baseline="auto" fill="red">auto</text>
  <text x="80" y="75" font-size="20" dominant-baseline="middle" fill="green">middle</text>
  <text x="170" y="75" font-size="20" dominant-baseline="hanging" fill="blue">hanging</text>
  <text x="280" y="75" font-size="20" dominant-baseline="text-top" fill="purple">text-top</text>
</svg>
```

### 5.3 tspan 子元素

```xml
<!-- 多行文本 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="30" font-size="20">
    <tspan x="10" dy="0">第一行文本</tspan>
    <tspan x="10" dy="30">第二行文本</tspan>
    <tspan x="10" dy="30">第三行文本</tspan>
  </text>
</svg>

<!-- 混合样式 -->
<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="50" font-size="20">
    这是<tspan fill="red" font-weight="bold">红色粗体</tspan>和
    <tspan fill="blue" font-style="italic">蓝色斜体</tspan>文本
  </text>
</svg>

<!-- 上标和下标 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="50" font-size="24">
    H<tspan dy="5" font-size="14">2</tspan><tspan dy="-5">O</tspan>
  </text>
  <text x="100" y="50" font-size="24">
    E=mc<tspan dy="-8" font-size="14">2</tspan>
  </text>
</svg>

<!-- 字符间距调整 -->
<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="30" font-size="20" letter-spacing="0">正常间距</text>
  <text x="10" y="60" font-size="20" letter-spacing="5">增大间距</text>
  <text x="10" y="90" font-size="20" letter-spacing="-2">减小间距</text>
</svg>
```

### 5.4 路径文本

```xml
<!-- 沿路径排列文本 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="textPath1" d="M 20 100 Q 200 20 380 100" fill="none"/>
  </defs>
  
  <!-- 显示路径 -->
  <use href="#textPath1" stroke="#ddd" stroke-width="2"/>
  
  <!-- 路径文本 -->
  <text font-size="20" fill="blue">
    <textPath href="#textPath1">
      这是沿着曲线路径排列的文字内容
    </textPath>
  </text>
</svg>

<!-- 圆形路径文本 -->
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="circlePath" d="M 150 50 A 100 100 0 1 1 149.99 50" fill="none"/>
  </defs>
  
  <text font-size="18" fill="purple">
    <textPath href="#circlePath">
      环形文字排列效果展示 • 环形文字排列效果展示 •
    </textPath>
  </text>
</svg>

<!-- 路径文本起始位置 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="textPath2" d="M 20 150 Q 200 20 380 150" fill="none"/>
  </defs>
  
  <use href="#textPath2" stroke="#ddd" stroke-width="2"/>
  
  <text font-size="16" fill="green">
    <textPath href="#textPath2" startOffset="50%">
      居中显示的路径文本
    </textPath>
  </text>
</svg>
```

---

## 6. 渐变与图案

### 6.1 线性渐变 (linearGradient)

```xml
<!-- 基础水平渐变 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1">
      <stop offset="0%" stop-color="red"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="280" height="80" fill="url(#grad1)"/>
</svg>

<!-- 垂直渐变 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="yellow"/>
      <stop offset="100%" stop-color="green"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="280" height="80" fill="url(#grad2)"/>
</svg>

<!-- 对角渐变 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="purple"/>
      <stop offset="100%" stop-color="orange"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="280" height="80" fill="url(#grad3)"/>
</svg>

<!-- 多色渐变 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rainbow">
      <stop offset="0%" stop-color="red"/>
      <stop offset="17%" stop-color="orange"/>
      <stop offset="33%" stop-color="yellow"/>
      <stop offset="50%" stop-color="green"/>
      <stop offset="67%" stop-color="blue"/>
      <stop offset="83%" stop-color="indigo"/>
      <stop offset="100%" stop-color="violet"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="280" height="80" fill="url(#rainbow)"/>
</svg>

<!-- 渐变透明度 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fadeGrad">
      <stop offset="0%" stop-color="blue" stop-opacity="1"/>
      <stop offset="100%" stop-color="blue" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="280" height="80" fill="url(#fadeGrad)"/>
</svg>
```

### 6.2 径向渐变 (radialGradient)

```xml
<!-- 基础径向渐变 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="radial1">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="blue"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#radial1)"/>
</svg>

<!-- 自定义圆心和焦点 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="radial2" cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="red"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#radial2)"/>
</svg>

<!-- 3D 球体效果 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sphere" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="30%" stop-color="#4CAF50"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="80" fill="url(#sphere)"/>
</svg>

<!-- 多色径向渐变 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="target">
      <stop offset="0%" stop-color="gold"/>
      <stop offset="20%" stop-color="gold"/>
      <stop offset="20%" stop-color="red"/>
      <stop offset="40%" stop-color="red"/>
      <stop offset="40%" stop-color="blue"/>
      <stop offset="60%" stop-color="blue"/>
      <stop offset="60%" stop-color="black"/>
      <stop offset="80%" stop-color="black"/>
      <stop offset="80%" stop-color="white"/>
      <stop offset="100%" stop-color="white"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#target)"/>
</svg>
```

### 6.3 图案 (pattern)

```xml
<!-- 点状图案 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="3" fill="blue"/>
    </pattern>
  </defs>
  <rect x="10" y="10" width="280" height="180" fill="url(#dots)"/>
</svg>

<!-- 条纹图案 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="stripes" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="10" height="20" fill="#eee"/>
      <rect x="10" width="10" height="20" fill="#fff"/>
    </pattern>
  </defs>
  <rect x="10" y="10" width="280" height="180" fill="url(#stripes)" stroke="#ccc"/>
</svg>

<!-- 斜条纹图案 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="diagonalStripes" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 0 10 L 10 0" stroke="#999" stroke-width="2"/>
    </pattern>
  </defs>
  <rect x="10" y="10" width="280" height="180" fill="url(#diagonalStripes)"/>
</svg>

<!-- 网格图案 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ddd" stroke-width="1"/>
    </pattern>
  </defs>
  <rect x="10" y="10" width="280" height="180" fill="url(#grid)"/>
</svg>

<!-- 棋盘图案 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="checkerboard" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#333"/>
      <rect x="20" y="20" width="20" height="20" fill="#333"/>
      <rect x="20" width="20" height="20" fill="#fff"/>
      <rect y="20" width="20" height="20" fill="#fff"/>
    </pattern>
  </defs>
  <rect x="10" y="10" width="280" height="180" fill="url(#checkerboard)"/>
</svg>
```

---

## 7. 滤镜效果

### 7.1 滤镜基础

```xml
<!-- 滤镜容器 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="myFilter">
      <!-- 滤镜效果定义在这里 -->
    </filter>
  </defs>
  <rect filter="url(#myFilter)" .../>
</svg>
```

### 7.2 模糊滤镜 (feGaussianBlur)

```xml
<!-- 高斯模糊 -->
<svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <filter id="blur2">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
    <filter id="blur3">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>
  
  <text x="30" y="50" font-size="30" fill="blue">原始</text>
  <text x="120" y="50" font-size="30" fill="blue" filter="url(#blur1)">模糊2</text>
  <text x="220" y="50" font-size="30" fill="blue" filter="url(#blur2)">模糊5</text>
  <text x="320" y="50" font-size="30" fill="blue" filter="url(#blur3)">模糊10</text>
</svg>

<!-- 方向性模糊 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 水平模糊 -->
    <filter id="blurH">
      <feGaussianBlur stdDeviation="8,0"/>
    </filter>
    <!-- 垂直模糊 -->
    <filter id="blurV">
      <feGaussianBlur stdDeviation="0,8"/>
    </filter>
  </defs>
  
  <rect x="20" y="30" width="100" height="80" fill="red" filter="url(#blurH)"/>
  <rect x="180" y="30" width="100" height="80" fill="blue" filter="url(#blurV)"/>
</svg>
```

### 7.3 投影滤镜 (feDropShadow / feOffset)

```xml
<!-- feDropShadow（简单投影） -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow1">
      <feDropShadow dx="5" dy="5" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
    </filter>
  </defs>
  <rect x="50" y="30" width="100" height="80" fill="#4CAF50" filter="url(#shadow1)"/>
</svg>

<!-- 组合滤镜实现投影 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <!-- 获取源图像的透明度通道 -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
      <!-- 偏移 -->
      <feOffset in="blur" dx="5" dy="5" result="offsetBlur"/>
      <!-- 合并原图和阴影 -->
      <feMerge>
        <feMergeNode in="offsetBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="50" y="30" width="100" height="80" fill="#2196F3" filter="url(#shadow2)"/>
</svg>

<!-- 内阴影效果 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="innerShadow">
      <feOffset dx="2" dy="2"/>
      <feGaussianBlur stdDeviation="3" result="offset-blur"/>
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
      <feFlood flood-color="black" flood-opacity="0.5" result="color"/>
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect x="50" y="30" width="100" height="80" fill="#FFC107" filter="url(#innerShadow)"/>
</svg>
```

### 7.4 颜色滤镜

```xml
<!-- 灰度滤镜 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="grayscale">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <rect x="20" y="30" width="80" height="80" fill="red"/>
  <rect x="120" y="30" width="80" height="80" fill="red" filter="url(#grayscale)"/>
</svg>

<!-- 色相旋转 -->
<svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="hue90">
      <feColorMatrix type="hueRotate" values="90"/>
    </filter>
    <filter id="hue180">
      <feColorMatrix type="hueRotate" values="180"/>
    </filter>
    <filter id="hue270">
      <feColorMatrix type="hueRotate" values="270"/>
    </filter>
  </defs>
  
  <rect x="20" y="30" width="60" height="60" fill="#FF5722"/>
  <rect x="100" y="30" width="60" height="60" fill="#FF5722" filter="url(#hue90)"/>
  <rect x="180" y="30" width="60" height="60" fill="#FF5722" filter="url(#hue180)"/>
  <rect x="260" y="30" width="60" height="60" fill="#FF5722" filter="url(#hue270)"/>
</svg>

<!-- 亮度/对比度调整 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 增加亮度 -->
    <filter id="brighten">
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.5" intercept="0"/>
        <feFuncG type="linear" slope="1.5" intercept="0"/>
        <feFuncB type="linear" slope="1.5" intercept="0"/>
      </feComponentTransfer>
    </filter>
    <!-- 增加对比度 -->
    <filter id="contrast">
      <feComponentTransfer>
        <feFuncR type="linear" slope="2" intercept="-0.5"/>
        <feFuncG type="linear" slope="2" intercept="-0.5"/>
        <feFuncB type="linear" slope="2" intercept="-0.5"/>
      </feComponentTransfer>
    </filter>
  </defs>
  
  <rect x="20" y="30" width="60" height="60" fill="#607D8B"/>
  <rect x="100" y="30" width="60" height="60" fill="#607D8B" filter="url(#brighten)"/>
  <rect x="180" y="30" width="60" height="60" fill="#607D8B" filter="url(#contrast)"/>
</svg>

<!-- 反色滤镜 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="invert">
      <feColorMatrix type="matrix"
        values="-1 0 0 0 1
                0 -1 0 0 1
                0 0 -1 0 1
                0 0 0 1 0"/>
    </filter>
  </defs>
  <rect x="20" y="30" width="80" height="80" fill="#3F51B5"/>
  <rect x="120" y="30" width="80" height="80" fill="#3F51B5" filter="url(#invert)"/>
</svg>
```

### 7.5 混合模式滤镜

```xml
<!-- feBlend 混合模式 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="blend">
      <feImage href="#circle1" result="img1"/>
      <feImage href="#circle2" result="img2"/>
      <feBlend mode="multiply" in="img1" in2="img2"/>
    </filter>
  </defs>
  
  <!-- 也可以用 CSS mix-blend-mode -->
  <circle id="circle1" cx="80" cy="100" r="60" fill="red"/>
  <circle id="circle2" cx="140" cy="100" r="60" fill="blue" style="mix-blend-mode: multiply"/>
</svg>

<!-- 使用 CSS mix-blend-mode -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="60" fill="red"/>
  <circle cx="160" cy="100" r="60" fill="green" style="mix-blend-mode: screen"/>
  <circle cx="130" cy="150" r="60" fill="blue" style="mix-blend-mode: screen"/>
</svg>
```

### 7.6 发光效果

```xml
<!-- 外发光 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <text x="150" y="80" font-size="40" fill="#00ff00" 
        text-anchor="middle" filter="url(#glow)">GLOW</text>
</svg>

<!-- 霓虹灯效果 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
      <feFlood result="flood" flood-color="#ff00ff" flood-opacity="1"/>
      <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"/>
      <feMorphology in="mask" result="dilated" operator="dilate" radius="2"/>
      <feGaussianBlur in="dilated" result="blurred" stdDeviation="5"/>
      <feMerge>
        <feMergeNode in="blurred"/>
        <feMergeNode in="blurred"/>
        <feMergeNode in="blurred"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="0" y="0" width="300" height="150" fill="#111"/>
  <text x="150" y="90" font-size="36" fill="#ff00ff" 
        text-anchor="middle" filter="url(#neon)">NEON</text>
</svg>
```

---

## 8. 变换 Transform

### 8.1 平移 (translate)

```xml
<!-- 平移变换 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 原始位置 -->
  <rect x="10" y="10" width="50" height="50" fill="blue" opacity="0.3"/>
  
  <!-- 平移后 -->
  <rect x="10" y="10" width="50" height="50" fill="blue" 
        transform="translate(100, 50)"/>
</svg>

<!-- 只平移 x -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="25" width="50" height="50" fill="red" opacity="0.3"/>
  <rect x="10" y="25" width="50" height="50" fill="red" transform="translate(100)"/>
</svg>
```

### 8.2 缩放 (scale)

```xml
<!-- 缩放变换 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 原始大小 -->
  <rect x="10" y="10" width="50" height="50" fill="green" opacity="0.3"/>
  
  <!-- 放大 2 倍 -->
  <rect x="10" y="10" width="50" height="50" fill="green" 
        transform="scale(2)"/>
</svg>

<!-- 非等比缩放 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="50" height="50" fill="purple" opacity="0.3"/>
  <rect x="10" y="10" width="50" height="50" fill="purple" 
        transform="scale(2, 1)"/>
</svg>

<!-- 以中心点缩放 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="100" y="50" width="100" height="100" fill="orange" opacity="0.3"/>
  <!-- 先移动到中心，缩放，再移回 -->
  <rect x="100" y="50" width="100" height="100" fill="orange" 
        transform="translate(150, 100) scale(0.5) translate(-150, -100)"/>
</svg>
```

### 8.3 旋转 (rotate)

```xml
<!-- 绕原点旋转 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="50" height="50" fill="blue" opacity="0.3"/>
  <rect x="50" y="50" width="50" height="50" fill="blue" transform="rotate(45)"/>
</svg>

<!-- 绕指定点旋转 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="100" height="50" fill="red" opacity="0.3"/>
  <!-- rotate(angle, cx, cy) - 绕 (cx, cy) 旋转 -->
  <rect x="50" y="50" width="100" height="50" fill="red" 
        transform="rotate(45, 100, 75)"/>
  <!-- 标记旋转中心 -->
  <circle cx="100" cy="75" r="3" fill="black"/>
</svg>

<!-- 多个元素绕同一点旋转 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    <rect x="-25" y="-25" width="50" height="50" fill="red" transform="rotate(0)"/>
    <rect x="-25" y="-25" width="50" height="50" fill="green" transform="rotate(30)"/>
    <rect x="-25" y="-25" width="50" height="50" fill="blue" transform="rotate(60)"/>
  </g>
</svg>
```

### 8.4 倾斜 (skew)

```xml
<!-- X 方向倾斜 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="30" width="80" height="80" fill="blue" opacity="0.3"/>
  <rect x="50" y="30" width="80" height="80" fill="blue" transform="skewX(20)"/>
</svg>

<!-- Y 方向倾斜 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="100" y="30" width="80" height="80" fill="green" opacity="0.3"/>
  <rect x="100" y="30" width="80" height="80" fill="green" transform="skewY(20)"/>
</svg>

<!-- 组合倾斜 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="100" y="50" width="80" height="80" fill="purple" opacity="0.3"/>
  <rect x="100" y="50" width="80" height="80" fill="purple" 
        transform="skewX(15) skewY(10)"/>
</svg>
```

### 8.5 矩阵变换 (matrix)

```xml
<!-- matrix(a, b, c, d, e, f) -->
<!-- 
  | a c e |   | x |   | ax + cy + e |
  | b d f | × | y | = | bx + dy + f |
  | 0 0 1 |   | 1 |   | 1           |
-->

<!-- 等同于 translate(100, 50) -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="50" height="50" fill="blue" 
        transform="matrix(1, 0, 0, 1, 100, 50)"/>
</svg>

<!-- 等同于 scale(2, 1.5) -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="50" height="50" fill="green" 
        transform="matrix(2, 0, 0, 1.5, 0, 0)"/>
</svg>

<!-- 等同于 rotate(45) (sin45≈0.707, cos45≈0.707) -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="50" height="50" fill="red" 
        transform="matrix(0.707, 0.707, -0.707, 0.707, 0, 0)"/>
</svg>
```

### 8.6 组合变换

```xml
<!-- 多个变换按顺序应用（从右到左） -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 先平移，再旋转 -->
  <rect x="0" y="0" width="50" height="50" fill="blue" 
        transform="rotate(45) translate(100, 50)"/>
  
  <!-- 先旋转，再平移（结果不同） -->
  <rect x="0" y="0" width="50" height="50" fill="red" 
        transform="translate(100, 50) rotate(45)"/>
</svg>

<!-- 复杂组合 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(200, 150) rotate(30) scale(1.5)">
    <rect x="-50" y="-25" width="100" height="50" fill="purple"/>
    <circle cx="0" cy="0" r="10" fill="white"/>
  </g>
</svg>
```

---

## 9. 裁剪与遮罩

### 9.1 裁剪路径 (clipPath)

```xml
<!-- 基础裁剪 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circleClip">
      <circle cx="150" cy="100" r="80"/>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="300" height="200" fill="blue" clip-path="url(#circleClip)"/>
</svg>

<!-- 图片裁剪 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="starClip">
      <polygon points="150,20 180,90 260,90 195,130 220,200 150,160 80,200 105,130 40,90 120,90"/>
    </clipPath>
  </defs>
  <image href="photo.jpg" width="300" height="200" clip-path="url(#starClip)"/>
</svg>

<!-- 文字裁剪 -->
<svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="textClip">
      <text x="200" y="100" font-size="80" font-weight="bold" text-anchor="middle">SVG</text>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="400" height="150" fill="url(#rainbow)" clip-path="url(#textClip)"/>
</svg>

<!-- 多形状裁剪 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="multiClip">
      <circle cx="80" cy="100" r="50"/>
      <circle cx="150" cy="100" r="50"/>
      <circle cx="220" cy="100" r="50"/>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="300" height="200" fill="green" clip-path="url(#multiClip)"/>
</svg>
```

### 9.2 遮罩 (mask)

```xml
<!-- 基础遮罩 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="fadeMask">
      <rect x="0" y="0" width="300" height="200" fill="url(#fadeGrad)"/>
    </mask>
    <linearGradient id="fadeGrad">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="300" height="200" fill="blue" mask="url(#fadeMask)"/>
</svg>

<!-- 聚光灯效果 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="spotlight">
      <rect x="0" y="0" width="300" height="200" fill="black"/>
      <circle cx="150" cy="100" r="60" fill="white"/>
    </mask>
  </defs>
  <image href="photo.jpg" width="300" height="200"/>
  <rect x="0" y="0" width="300" height="200" fill="black" opacity="0.7"/>
  <image href="photo.jpg" width="300" height="200" mask="url(#spotlight)"/>
</svg>

<!-- 渐变遮罩 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="spotGrad">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="black"/>
    </radialGradient>
    <mask id="radialMask">
      <rect x="0" y="0" width="300" height="200" fill="url(#spotGrad)"/>
    </mask>
  </defs>
  <rect x="0" y="0" width="300" height="200" fill="red" mask="url(#radialMask)"/>
</svg>
```

---

## 10. 动画

### 10.1 SMIL 动画基础

```xml
<!-- 属性动画 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="25" width="50" height="50" fill="blue">
    <animate attributeName="x" from="10" to="240" dur="2s" repeatCount="indefinite"/>
  </rect>
</svg>

<!-- 多属性同时动画 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="50" width="50" height="50" fill="red">
    <animate attributeName="x" from="10" to="240" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="fill" values="red;yellow;green;blue;red" dur="2s" repeatCount="indefinite"/>
  </rect>
</svg>

<!-- 关键帧动画 -->
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="75" r="20" fill="purple">
    <animate attributeName="cx" 
             values="50;250;50" 
             keyTimes="0;0.5;1"
             dur="3s" 
             repeatCount="indefinite"/>
  </circle>
</svg>
```

### 10.2 变换动画 (animateTransform)

```xml
<!-- 旋转动画 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="75" y="75" width="50" height="50" fill="blue">
    <animateTransform 
      attributeName="transform" 
      type="rotate" 
      from="0 100 100" 
      to="360 100 100" 
      dur="3s" 
      repeatCount="indefinite"/>
  </rect>
</svg>

<!-- 缩放动画 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="30" fill="red">
    <animateTransform 
      attributeName="transform" 
      type="scale" 
      values="1;1.5;1" 
      dur="1s" 
      repeatCount="indefinite"/>
  </circle>
</svg>

<!-- 组合动画 -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="75" y="75" width="50" height="50" fill="green">
    <animateTransform 
      attributeName="transform" 
      type="rotate" 
      from="0 100 100" 
      to="360 100 100" 
      dur="3s" 
      repeatCount="indefinite"/>
    <animateTransform 
      attributeName="transform" 
      type="scale" 
      values="1;1.2;1" 
      dur="1s" 
      repeatCount="indefinite"
      additive="sum"/>
  </rect>
</svg>
```

### 10.3 路径动画 (animateMotion)

```xml
<!-- 沿路径移动 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <path id="motionPath" d="M 50 100 Q 200 20 350 100" fill="none" stroke="#ddd" stroke-width="2"/>
  
  <circle r="10" fill="red">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath"/>
    </animateMotion>
  </circle>
</svg>

<!-- 自动旋转 -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <path id="curvePath" d="M 50 100 C 100 20 300 180 350 100" fill="none" stroke="#ddd" stroke-width="2"/>
  
  <polygon points="0,-10 20,0 0,10" fill="blue">
    <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
      <mpath href="#curvePath"/>
    </animateMotion>
  </polygon>
</svg>

<!-- 内联路径 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="-10" y="-10" width="20" height="20" fill="purple">
    <animateMotion 
      path="M 50,100 A 50,50 0 1,1 50,99.9 Z" 
      dur="4s" 
      repeatCount="indefinite"/>
  </rect>
</svg>
```

### 10.4 CSS 动画

```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes pulse {
      0%, 100% { r: 30; opacity: 1; }
      50% { r: 50; opacity: 0.5; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .pulse-circle {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .spin-rect {
      transform-origin: center;
      animation: spin 3s linear infinite;
    }
  </style>
  
  <circle class="pulse-circle" cx="100" cy="100" r="30" fill="red"/>
</svg>

<!-- 悬停动画 -->
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <style>
    .hover-rect {
      fill: blue;
      transition: all 0.3s ease;
    }
    .hover-rect:hover {
      fill: red;
      transform: scale(1.1);
    }
  </style>
  
  <rect class="hover-rect" x="50" y="25" width="100" height="50" rx="10"/>
</svg>
```

### 10.5 JavaScript 动画

```xml
<svg width="300" height="200" id="jsSvg" xmlns="http://www.w3.org/2000/svg">
  <circle id="jsCircle" cx="50" cy="100" r="20" fill="green"/>
  
  <script>
    const circle = document.getElementById('jsCircle');
    let x = 50;
    let direction = 1;
    
    function animate() {
      x += 2 * direction;
      if (x > 250 || x < 50) direction *= -1;
      circle.setAttribute('cx', x);
      requestAnimationFrame(animate);
    }
    
    animate();
  </script>
</svg>
```

---

## 11. 符号与复用

### 11.1 定义区 (defs)

```xml
<!-- defs 中的元素不会直接渲染 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 渐变定义 -->
    <linearGradient id="myGrad">
      <stop offset="0%" stop-color="red"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
    
    <!-- 滤镜定义 -->
    <filter id="myBlur">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    
    <!-- 图形定义 -->
    <circle id="myCircle" r="30"/>
  </defs>
  
  <!-- 使用定义的元素 -->
  <use href="#myCircle" x="50" y="50" fill="url(#myGrad)"/>
  <use href="#myCircle" x="150" y="100" fill="green" filter="url(#myBlur)"/>
</svg>
```

### 11.2 符号 (symbol)

```xml
<!-- symbol 类似于 defs 中的 g，但可以有自己的 viewBox -->
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <symbol id="icon-heart" viewBox="0 0 32 32">
      <path d="M16 28 C8 20 2 14 2 8 C2 4 5 1 9 1 C12 1 14 3 16 6 C18 3 20 1 23 1 C27 1 30 4 30 8 C30 14 24 20 16 28 Z"
            fill="currentColor"/>
    </symbol>
    
    <symbol id="icon-star" viewBox="0 0 32 32">
      <polygon points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12"
               fill="currentColor"/>
    </symbol>
  </defs>
  
  <!-- 不同大小使用同一个符号 -->
  <use href="#icon-heart" x="10" y="10" width="32" height="32" fill="red"/>
  <use href="#icon-heart" x="60" y="10" width="48" height="48" fill="pink"/>
  <use href="#icon-heart" x="130" y="10" width="64" height="64" fill="#FF5722"/>
  
  <use href="#icon-star" x="220" y="10" width="32" height="32" fill="gold"/>
  <use href="#icon-star" x="270" y="10" width="48" height="48" fill="orange"/>
  <use href="#icon-star" x="340" y="10" width="64" height="64" fill="#FFC107"/>
</svg>
```

### 11.3 分组 (g)

```xml
<!-- 基础分组 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <g fill="blue" stroke="navy" stroke-width="2">
    <rect x="10" y="10" width="80" height="60"/>
    <rect x="100" y="10" width="80" height="60"/>
    <rect x="190" y="10" width="80" height="60"/>
  </g>
</svg>

<!-- 分组变换 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(150, 100) rotate(30)">
    <rect x="-50" y="-30" width="100" height="60" fill="green"/>
    <circle cx="0" cy="0" r="10" fill="white"/>
  </g>
</svg>

<!-- 嵌套分组 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <g id="face" transform="translate(150, 100)">
    <!-- 脸 -->
    <circle r="80" fill="yellow" stroke="orange" stroke-width="3"/>
    
    <!-- 眼睛 -->
    <g id="eyes">
      <circle cx="-30" cy="-20" r="10" fill="black"/>
      <circle cx="30" cy="-20" r="10" fill="black"/>
    </g>
    
    <!-- 嘴巴 -->
    <path d="M -40 20 Q 0 60 40 20" fill="none" stroke="black" stroke-width="5"/>
  </g>
</svg>
```

### 11.4 use 元素

```xml
<!-- 基础使用 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="myRect" width="50" height="50" fill="blue"/>
  </defs>
  
  <use href="#myRect" x="10" y="25"/>
  <use href="#myRect" x="80" y="25"/>
  <use href="#myRect" x="150" y="25"/>
  <use href="#myRect" x="220" y="25"/>
</svg>

<!-- 覆盖样式 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <circle id="dot" r="20"/>
  </defs>
  
  <use href="#dot" x="50" y="50" fill="red"/>
  <use href="#dot" x="110" y="50" fill="green"/>
  <use href="#dot" x="170" y="50" fill="blue"/>
  <use href="#dot" x="230" y="50" fill="purple"/>
</svg>

<!-- 外部 SVG 引用 -->
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <!-- 引用外部 SVG 文件中的符号 -->
  <use href="icons.svg#icon-home" x="10" y="10" width="32" height="32"/>
  <use href="icons.svg#icon-user" x="60" y="10" width="32" height="32"/>
  <use href="icons.svg#icon-settings" x="110" y="10" width="32" height="32"/>
</svg>
```

---

## 12. 交互与事件

### 12.1 鼠标事件

```xml
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect id="interactiveRect" x="50" y="50" width="100" height="100" fill="blue"
        onclick="this.setAttribute('fill', 'red')"
        onmouseover="this.setAttribute('fill', 'green')"
        onmouseout="this.setAttribute('fill', 'blue')"/>
</svg>

<!-- CSS 伪类 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .interactive {
      fill: blue;
      cursor: pointer;
      transition: all 0.3s;
    }
    .interactive:hover {
      fill: red;
      transform: scale(1.1);
    }
    .interactive:active {
      fill: green;
    }
  </style>
  
  <rect class="interactive" x="50" y="50" width="100" height="100"/>
</svg>
```

### 12.2 链接

```xml
<!-- a 元素 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <a href="https://example.com" target="_blank">
    <rect x="50" y="25" width="200" height="50" fill="blue" rx="10"/>
    <text x="150" y="55" fill="white" text-anchor="middle" font-size="16">点击访问</text>
  </a>
</svg>

<!-- 内部链接 -->
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <g id="section1">
      <rect width="280" height="180" fill="lightblue"/>
      <text x="140" y="100" text-anchor="middle">Section 1</text>
    </g>
    <g id="section2">
      <rect width="280" height="180" fill="lightgreen"/>
      <text x="140" y="100" text-anchor="middle">Section 2</text>
    </g>
  </defs>
  
  <a href="#section1">
    <use href="#section1" x="10" y="10"/>
  </a>
</svg>
```

### 12.3 JavaScript 交互

```xml
<svg width="300" height="200" id="interactiveSvg" xmlns="http://www.w3.org/2000/svg">
  <circle id="draggableCircle" cx="150" cy="100" r="30" fill="purple" cursor="move"/>
  
  <script>
    const svg = document.getElementById('interactiveSvg');
    const circle = document.getElementById('draggableCircle');
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    circle.addEventListener('mousedown', (e) => {
      isDragging = true;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      offset.x = svgP.x - parseFloat(circle.getAttribute('cx'));
      offset.y = svgP.y - parseFloat(circle.getAttribute('cy'));
    });
    
    svg.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      circle.setAttribute('cx', svgP.x - offset.x);
      circle.setAttribute('cy', svgP.y - offset.y);
    });
    
    svg.addEventListener('mouseup', () => isDragging = false);
    svg.addEventListener('mouseleave', () => isDragging = false);
  </script>
</svg>
```

### 12.4 可访问性

```xml
<!-- ARIA 属性 -->
<svg width="200" height="100" role="img" aria-labelledby="title desc" xmlns="http://www.w3.org/2000/svg">
  <title id="title">公司图标</title>
  <desc id="desc">一个蓝色圆形代表公司的标志</desc>
  <circle cx="100" cy="50" r="40" fill="blue"/>
</svg>

<!-- 可聚焦元素 -->
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <style>
    .focusable:focus {
      outline: 3px solid orange;
      outline-offset: 2px;
    }
  </style>
  
  <rect class="focusable" tabindex="0" x="20" y="25" width="60" height="50" fill="blue"
        role="button" aria-label="按钮1"/>
  <rect class="focusable" tabindex="0" x="100" y="25" width="60" height="50" fill="green"
        role="button" aria-label="按钮2"/>
  <rect class="focusable" tabindex="0" x="180" y="25" width="60" height="50" fill="red"
        role="button" aria-label="按钮3"/>
</svg>
```

---

## 13. SVG 优化

### 13.1 文件优化

```xml
<!-- 优化前 -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     version="1.1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100">
  <circle cx="50.000" cy="50.000" r="40.000" fill="#ff0000"/>
</svg>

<!-- 优化后 -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="red"/>
</svg>
```

### 13.2 优化技巧

1. **移除不必要的属性**
```xml
<!-- 不需要 -->
<svg xmlns:xlink="..." version="1.1" x="0" y="0">

<!-- 简化 -->
<svg xmlns="http://www.w3.org/2000/svg">
```

2. **简化数值**
```xml
<!-- 不需要 -->
<circle cx="50.000" cy="50.000" r="40.000"/>

<!-- 简化 -->
<circle cx="50" cy="50" r="40"/>
```

3. **使用简写颜色**
```xml
<!-- 不需要 -->
fill="#ff0000"

<!-- 简化 -->
fill="red"
<!-- 或 -->
fill="#f00"
```

4. **路径优化**
```xml
<!-- 不需要 -->
<path d="M 10.00 10.00 L 20.00 10.00 L 20.00 20.00 L 10.00 20.00 Z"/>

<!-- 简化 -->
<path d="M10 10h10v10H10z"/>
```

5. **合并相同样式**
```xml
<!-- 不优化 -->
<circle fill="blue" stroke="black" stroke-width="2"/>
<rect fill="blue" stroke="black" stroke-width="2"/>

<!-- 优化：使用分组 -->
<g fill="blue" stroke="black" stroke-width="2">
  <circle/>
  <rect/>
</g>
```

### 13.3 推荐工具

| 工具 | 用途 |
|------|------|
| SVGO | 命令行 SVG 优化工具 |
| SVGOMG | SVGO 的在线版本 |
| SVG Optimizer | VS Code 插件 |
| Figma/Sketch | 设计工具导出优化 SVG |

### 13.4 性能考虑

```xml
<!-- 大量元素时使用 will-change -->
<svg xmlns="http://www.w3.org/2000/svg">
  <style>
    .animated {
      will-change: transform;
    }
  </style>
  <g class="animated">
    <!-- 大量动画元素 -->
  </g>
</svg>

<!-- 使用 CSS transform 替代 SVG transform 属性（GPU 加速） -->
<svg xmlns="http://www.w3.org/2000/svg">
  <style>
    .gpu-accelerated {
      transform: translateZ(0);
    }
  </style>
</svg>
```

---

## 附录：常用 SVG 属性速查

### 填充与描边

| 属性 | 说明 | 示例值 |
|------|------|--------|
| fill | 填充颜色 | red, #ff0000, rgb(255,0,0), url(#gradient) |
| fill-opacity | 填充透明度 | 0-1 |
| fill-rule | 填充规则 | nonzero, evenodd |
| stroke | 描边颜色 | blue, #0000ff |
| stroke-width | 描边宽度 | 2, 2px |
| stroke-opacity | 描边透明度 | 0-1 |
| stroke-linecap | 线端样式 | butt, round, square |
| stroke-linejoin | 连接样式 | miter, round, bevel |
| stroke-dasharray | 虚线样式 | 5,3,2 |
| stroke-dashoffset | 虚线偏移 | 10 |

### 文本属性

| 属性 | 说明 | 示例值 |
|------|------|--------|
| font-family | 字体 | Arial, sans-serif |
| font-size | 字号 | 16, 16px, 1em |
| font-weight | 字重 | normal, bold, 700 |
| font-style | 字体样式 | normal, italic |
| text-anchor | 水平对齐 | start, middle, end |
| dominant-baseline | 垂直对齐 | auto, middle, hanging |
| letter-spacing | 字间距 | 2, 2px |
| text-decoration | 文本装饰 | underline, line-through |

### 通用属性

| 属性 | 说明 | 示例值 |
|------|------|--------|
| id | 唯一标识 | myElement |
| class | CSS 类名 | my-class |
| style | 内联样式 | fill:red;stroke:blue |
| transform | 变换 | translate(10,20) rotate(45) |
| opacity | 透明度 | 0-1 |
| visibility | 可见性 | visible, hidden |
| display | 显示 | inline, none |
| clip-path | 裁剪路径 | url(#clipPath) |
| mask | 遮罩 | url(#mask) |
| filter | 滤镜 | url(#filter) |

---

本文档涵盖了 SVG 的核心语法和用法。更多详细信息请参考 [MDN SVG 文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG)。
