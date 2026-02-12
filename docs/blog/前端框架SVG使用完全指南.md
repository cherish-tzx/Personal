# 前端框架 SVG 使用完全指南

## Vue2 / Vue3 / Vue3+TypeScript / React

---
<div class="doc-toc">
## 目录

1. [概述](#1-概述)
2. [Vue2 中使用 SVG](#2-vue2-中使用-svg)
3. [Vue3 中使用 SVG](#3-vue3-中使用-svg)
4. [Vue3 + TypeScript 中使用 SVG](#4-vue3--typescript-中使用-svg)
5. [React 中使用 SVG](#5-react-中使用-svg)
6. [通用最佳实践](#6-通用最佳实践)


</div>

---

## 1. 概述

### 1.1 在前端框架中使用 SVG 的方式

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 内联 SVG | 可完全控制，支持样式和交互 | 代码冗长 | 需要动态控制的图标 |
| img 标签 | 简单，缓存友好 | 无法修改样式 | 静态图片 |
| background-image | 简单，CSS 控制 | 无法修改内部样式 | 装饰性图形 |
| SVG 组件 | 可复用，类型安全 | 需要配置 | 图标系统 |
| SVG Sprite | 性能好，HTTP 请求少 | 配置复杂 | 大量图标 |
| 外部文件 use 引用 | 缓存友好，复用性好 | 跨域限制 | 图标库 |

---

## 2. Vue2 中使用 SVG

### 2.1 内联 SVG

#### 2.1.1 直接在模板中使用

```vue
<template>
  <div class="icon-container">
    <!-- 直接内联 SVG -->
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
      :fill="iconColor"
      @click="handleClick"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'InlineSvgDemo',
  data() {
    return {
      iconColor: '#333'
    }
  },
  methods: {
    handleClick() {
      this.iconColor = this.iconColor === '#333' ? '#ff0000' : '#333'
    }
  }
}
</script>

<style scoped>
svg {
  cursor: pointer;
  transition: fill 0.3s ease;
}
svg:hover {
  fill: #007bff;
}
</style>
```

#### 2.1.2 动态绑定 SVG 属性

```vue
<template>
  <div class="svg-demo">
    <!-- 动态绑定多个属性 -->
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      :width="size" 
      :height="size" 
      viewBox="0 0 24 24"
      :class="['icon', { active: isActive }]"
      :style="iconStyle"
    >
      <circle 
        :cx="12" 
        :cy="12" 
        :r="radius" 
        :fill="fillColor"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
      />
    </svg>
    
    <!-- 控制面板 -->
    <div class="controls">
      <input type="range" v-model="radius" min="2" max="10">
      <input type="color" v-model="fillColor">
      <button @click="isActive = !isActive">Toggle Active</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicSvg',
  data() {
    return {
      size: 100,
      radius: 8,
      fillColor: '#4CAF50',
      strokeColor: '#333',
      strokeWidth: 2,
      isActive: false
    }
  },
  computed: {
    iconStyle() {
      return {
        transform: this.isActive ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }
    }
  }
}
</script>

<style scoped>
.icon {
  display: block;
}
.icon.active {
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
}
</style>
```

### 2.2 SVG 组件化

#### 2.2.1 基础图标组件

```vue
<!-- components/SvgIcon.vue -->
<template>
  <svg 
    class="svg-icon"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :fill="color"
    :style="iconStyle"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    viewBox: {
      type: String,
      default: '0 0 24 24'
    },
    rotate: {
      type: Number,
      default: 0
    }
  },
  computed: {
    iconStyle() {
      return {
        transform: `rotate(${this.rotate}deg)`,
        transition: 'transform 0.3s ease'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
}
</style>
```

#### 2.2.2 具体图标组件

```vue
<!-- components/icons/IconHome.vue -->
<template>
  <SvgIcon v-bind="$attrs" v-on="$listeners">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </SvgIcon>
</template>

<script>
import SvgIcon from './SvgIcon.vue'

export default {
  name: 'IconHome',
  components: { SvgIcon }
}
</script>
```

```vue
<!-- components/icons/IconUser.vue -->
<template>
  <SvgIcon v-bind="$attrs" v-on="$listeners">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </SvgIcon>
</template>

<script>
import SvgIcon from './SvgIcon.vue'

export default {
  name: 'IconUser',
  components: { SvgIcon }
}
</script>
```

#### 2.2.3 图标组件使用

```vue
<template>
  <div class="icon-demo">
    <IconHome :size="32" color="#4CAF50" />
    <IconUser :size="32" color="#2196F3" />
    <IconHome :size="48" color="#FF5722" :rotate="45" />
  </div>
</template>

<script>
import IconHome from '@/components/icons/IconHome.vue'
import IconUser from '@/components/icons/IconUser.vue'

export default {
  components: { IconHome, IconUser }
}
</script>
```

### 2.3 SVG Sprite 方案

#### 2.3.1 配置 svg-sprite-loader

```javascript
// vue.config.js
const path = require('path')

module.exports = {
  chainWebpack: config => {
    // 排除默认的 svg 处理
    config.module
      .rule('svg')
      .exclude.add(path.resolve('src/icons'))
      .end()
    
    // 配置 svg-sprite-loader
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
```

#### 2.3.2 创建 SvgIcon 组件

```vue
<!-- components/SvgIcon.vue -->
<template>
  <svg 
    :class="svgClass" 
    :style="iconStyle"
    aria-hidden="true"
    @click="$emit('click', $event)"
  >
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: '1em'
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      return ['svg-icon', this.className]
    },
    iconStyle() {
      const size = typeof this.size === 'number' ? `${this.size}px` : this.size
      return {
        width: size,
        height: size,
        fill: this.color
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
```

#### 2.3.3 自动导入所有 SVG 图标

```javascript
// src/icons/index.js
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

// 全局注册组件
Vue.component('SvgIcon', SvgIcon)

// 自动导入所有 svg 文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
```

```javascript
// main.js
import '@/icons'
```

#### 2.3.4 使用 SVG Sprite

```vue
<template>
  <div class="icon-list">
    <SvgIcon icon-class="home" :size="24" color="#333" />
    <SvgIcon icon-class="user" :size="24" color="#666" />
    <SvgIcon icon-class="settings" :size="32" color="#4CAF50" />
    <SvgIcon icon-class="search" size="2em" />
  </div>
</template>
```

### 2.4 使用 v-html 渲染动态 SVG

```vue
<template>
  <div class="dynamic-svg">
    <!-- 从服务器获取的 SVG 内容 -->
    <div v-html="svgContent" class="svg-container"></div>
    
    <!-- 动态生成的 SVG -->
    <div v-html="generatedSvg" class="svg-container"></div>
  </div>
</template>

<script>
export default {
  name: 'DynamicSvgDemo',
  data() {
    return {
      svgContent: '',
      chartData: [30, 50, 80, 40, 60]
    }
  },
  computed: {
    generatedSvg() {
      const width = 200
      const height = 100
      const barWidth = 30
      const gap = 10
      
      let bars = ''
      this.chartData.forEach((value, index) => {
        const x = index * (barWidth + gap) + gap
        const barHeight = value
        const y = height - barHeight
        bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#4CAF50"/>`
      })
      
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${bars}</svg>`
    }
  },
  async mounted() {
    // 从服务器获取 SVG
    try {
      const response = await fetch('/api/icons/logo.svg')
      this.svgContent = await response.text()
    } catch (error) {
      console.error('Failed to load SVG:', error)
    }
  }
}
</script>

<style scoped>
.svg-container {
  display: inline-block;
}
.svg-container >>> svg {
  max-width: 100%;
  height: auto;
}
</style>
```

### 2.5 SVG 动画在 Vue2 中

```vue
<template>
  <div class="svg-animation">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="200" 
      height="200" 
      viewBox="0 0 200 200"
    >
      <!-- CSS 动画 -->
      <circle 
        class="pulse-circle"
        cx="100" 
        cy="100" 
        :r="circleRadius"
        fill="#4CAF50"
      />
      
      <!-- 动态路径 -->
      <path 
        :d="progressPath"
        fill="none"
        stroke="#2196F3"
        stroke-width="10"
        stroke-linecap="round"
      />
    </svg>
    
    <div class="controls">
      <input type="range" v-model.number="progress" min="0" max="100">
      <span>{{ progress }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SvgAnimation',
  data() {
    return {
      circleRadius: 30,
      progress: 75
    }
  },
  computed: {
    progressPath() {
      // 圆弧进度条
      const radius = 80
      const centerX = 100
      const centerY = 100
      const angle = (this.progress / 100) * 360
      const radians = (angle - 90) * (Math.PI / 180)
      const largeArc = angle > 180 ? 1 : 0
      
      const x = centerX + radius * Math.cos(radians)
      const y = centerY + radius * Math.sin(radians)
      
      if (this.progress === 100) {
        return `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX - 0.01} ${centerY - radius}`
      }
      
      return `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`
    }
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { r: 30; opacity: 1; }
  50% { r: 40; opacity: 0.7; }
}

.pulse-circle {
  animation: pulse 2s ease-in-out infinite;
}
</style>
```

### 2.6 img 标签方式

```vue
<template>
  <div class="img-svg">
    <!-- 基础用法 -->
    <img src="@/assets/icons/logo.svg" alt="Logo" width="100" height="100">
    
    <!-- 动态 src -->
    <img :src="iconSrc" :alt="iconAlt" :width="size" :height="size">
    
    <!-- 响应式 -->
    <img 
      src="@/assets/images/illustration.svg" 
      alt="插图"
      class="responsive-svg"
    >
  </div>
</template>

<script>
export default {
  name: 'ImgSvgDemo',
  data() {
    return {
      iconName: 'home',
      size: 48
    }
  },
  computed: {
    iconSrc() {
      return require(`@/assets/icons/${this.iconName}.svg`)
    },
    iconAlt() {
      return `${this.iconName} icon`
    }
  }
}
</script>

<style scoped>
.responsive-svg {
  max-width: 100%;
  height: auto;
}
</style>
```

### 2.7 CSS background-image 方式

```vue
<template>
  <div class="css-svg-demo">
    <div class="icon icon-home"></div>
    <div class="icon icon-user"></div>
    <div :class="['icon', `icon-${iconName}`]" :style="iconStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'CssSvgDemo',
  data() {
    return {
      iconName: 'settings',
      iconSize: 48
    }
  },
  computed: {
    iconStyle() {
      return {
        width: `${this.iconSize}px`,
        height: `${this.iconSize}px`
      }
    }
  }
}
</script>

<style scoped>
.icon {
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}

.icon-home {
  background-image: url('~@/assets/icons/home.svg');
}

.icon-user {
  background-image: url('~@/assets/icons/user.svg');
}

.icon-settings {
  background-image: url('~@/assets/icons/settings.svg');
}
</style>
```

---

## 3. Vue3 中使用 SVG

### 3.1 组合式 API + 内联 SVG

```vue
<template>
  <div class="svg-demo">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      :width="size" 
      :height="size" 
      viewBox="0 0 24 24"
      :fill="color"
      @click="toggleColor"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const size = ref(48)
const isActive = ref(false)

const color = computed(() => isActive.value ? '#ff0000' : '#333333')

const toggleColor = () => {
  isActive.value = !isActive.value
}
</script>

<style scoped>
svg {
  cursor: pointer;
  transition: fill 0.3s ease;
}
</style>
```

### 3.2 SVG 图标组件（组合式 API）

#### 3.2.1 基础图标组件

```vue
<!-- components/SvgIcon.vue -->
<template>
  <svg 
    class="svg-icon"
    :width="computedSize"
    :height="computedSize"
    :viewBox="viewBox"
    :style="iconStyle"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <slot></slot>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  viewBox: {
    type: String,
    default: '0 0 24 24'
  },
  rotate: {
    type: Number,
    default: 0
  },
  spin: {
    type: Boolean,
    default: false
  }
})

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})

const iconStyle = computed(() => ({
  fill: props.color,
  transform: `rotate(${props.rotate}deg)`,
  animation: props.spin ? 'spin 1s linear infinite' : 'none'
}))
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s ease;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

#### 3.2.2 具体图标组件

```vue
<!-- components/icons/IconLoading.vue -->
<template>
  <SvgIcon v-bind="$attrs" :spin="true" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" opacity=".3"/>
    <path d="M12 2v4c3.31 0 6 2.69 6 6h4c0-5.52-4.48-10-10-10z"/>
  </SvgIcon>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'
</script>
```

```vue
<!-- components/icons/IconCheck.vue -->
<template>
  <SvgIcon v-bind="$attrs">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </SvgIcon>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'
</script>
```

### 3.3 使用 vite-plugin-svg-icons

#### 3.3.1 安装和配置

```bash
npm install vite-plugin-svg-icons -D
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 指定 symbolId 格式
      symbolId: 'icon-[dir]-[name]',
      // 自定义 svg dom id
      customDomId: '__svg__icons__dom__'
    })
  ]
})
```

#### 3.3.2 创建 SvgIcon 组件

```vue
<!-- components/SvgIcon.vue -->
<template>
  <svg 
    :class="['svg-icon', className]" 
    :style="iconStyle"
    aria-hidden="true"
  >
    <use :href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: '1em'
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  className: {
    type: String,
    default: ''
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size,
    fill: props.color
  }
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
}
</style>
```

#### 3.3.3 全局注册和使用

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import SvgIcon from './components/SvgIcon.vue'

const app = createApp(App)
app.component('SvgIcon', SvgIcon)
app.mount('#app')
```

```vue
<template>
  <div class="icon-demo">
    <SvgIcon name="home" :size="24" color="#333" />
    <SvgIcon name="user" :size="32" color="#4CAF50" />
    <SvgIcon name="settings" size="2em" />
  </div>
</template>
```

### 3.4 Vue3 响应式 SVG 图表

```vue
<template>
  <div class="chart-container">
    <svg 
      :width="width" 
      :height="height" 
      :viewBox="`0 0 ${width} ${height}`"
    >
      <!-- 坐标轴 -->
      <line 
        :x1="padding" 
        :y1="height - padding" 
        :x2="width - padding" 
        :y2="height - padding" 
        stroke="#333" 
        stroke-width="2"
      />
      <line 
        :x1="padding" 
        :y1="padding" 
        :x2="padding" 
        :y2="height - padding" 
        stroke="#333" 
        stroke-width="2"
      />
      
      <!-- 柱状图 -->
      <g>
        <rect 
          v-for="(item, index) in chartData" 
          :key="index"
          :x="getBarX(index)"
          :y="getBarY(item.value)"
          :width="barWidth"
          :height="getBarHeight(item.value)"
          :fill="item.color || defaultColor"
          class="bar"
        >
          <title>{{ item.label }}: {{ item.value }}</title>
        </rect>
      </g>
      
      <!-- 数据标签 -->
      <g>
        <text 
          v-for="(item, index) in chartData" 
          :key="'label-' + index"
          :x="getBarX(index) + barWidth / 2"
          :y="height - padding + 20"
          text-anchor="middle"
          font-size="12"
          fill="#666"
        >
          {{ item.label }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const width = ref(400)
const height = ref(300)
const padding = ref(40)
const defaultColor = ref('#4CAF50')

const chartData = computed(() => props.data)

const maxValue = computed(() => {
  return Math.max(...chartData.value.map(item => item.value))
})

const barWidth = computed(() => {
  const availableWidth = width.value - padding.value * 2
  const gap = 10
  return (availableWidth - gap * (chartData.value.length - 1)) / chartData.value.length
})

const getBarX = (index) => {
  const gap = 10
  return padding.value + index * (barWidth.value + gap)
}

const getBarHeight = (value) => {
  const availableHeight = height.value - padding.value * 2
  return (value / maxValue.value) * availableHeight
}

const getBarY = (value) => {
  return height.value - padding.value - getBarHeight(value)
}
</script>

<style scoped>
.chart-container {
  display: inline-block;
}

.bar {
  transition: opacity 0.3s ease;
}

.bar:hover {
  opacity: 0.8;
}
</style>
```

### 3.5 组合式函数 (Composables)

```javascript
// composables/useSvgIcon.js
import { computed, ref } from 'vue'

export function useSvgIcon(initialOptions = {}) {
  const size = ref(initialOptions.size || 24)
  const color = ref(initialOptions.color || 'currentColor')
  const rotate = ref(initialOptions.rotate || 0)
  
  const iconStyle = computed(() => ({
    width: typeof size.value === 'number' ? `${size.value}px` : size.value,
    height: typeof size.value === 'number' ? `${size.value}px` : size.value,
    fill: color.value,
    transform: `rotate(${rotate.value}deg)`,
    transition: 'all 0.3s ease'
  }))
  
  const setSize = (newSize) => {
    size.value = newSize
  }
  
  const setColor = (newColor) => {
    color.value = newColor
  }
  
  const setRotate = (newRotate) => {
    rotate.value = newRotate
  }
  
  return {
    size,
    color,
    rotate,
    iconStyle,
    setSize,
    setColor,
    setRotate
  }
}
```

```vue
<template>
  <div class="icon-demo">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      :style="iconStyle"
      @click="handleClick"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
    
    <div class="controls">
      <button @click="setSize(32)">Small</button>
      <button @click="setSize(48)">Medium</button>
      <button @click="setSize(64)">Large</button>
      <button @click="setColor('#FFD700')">Gold</button>
      <button @click="setColor('#C0C0C0')">Silver</button>
    </div>
  </div>
</template>

<script setup>
import { useSvgIcon } from '@/composables/useSvgIcon'

const { iconStyle, setSize, setColor, setRotate } = useSvgIcon({
  size: 48,
  color: '#FFD700'
})

const handleClick = () => {
  setRotate(Math.random() * 360)
}
</script>
```

### 3.6 Teleport + SVG 弹窗

```vue
<template>
  <div class="svg-modal-demo">
    <button @click="showModal = true">显示 SVG 弹窗</button>
    
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 200 200"
          >
            <circle 
              cx="100" 
              cy="100" 
              r="80" 
              fill="#4CAF50"
              class="success-circle"
            />
            <path 
              d="M60 100 L90 130 L140 70" 
              fill="none" 
              stroke="white" 
              stroke-width="10"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="check-mark"
            />
          </svg>
          <p>操作成功！</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
}

.success-circle {
  animation: scaleIn 0.3s ease-out;
}

.check-mark {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawCheck 0.5s 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}
</style>
```

---

## 4. Vue3 + TypeScript 中使用 SVG

### 4.1 类型安全的 SVG 图标组件

```vue
<!-- components/SvgIcon.vue -->
<template>
  <svg 
    :class="['svg-icon', props.className]"
    :width="computedSize"
    :height="computedSize"
    :viewBox="props.viewBox"
    :style="iconStyle"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <slot></slot>
  </svg>
</template>

<script setup lang="ts">
import { computed, CSSProperties } from 'vue'

interface Props {
  size?: number | string
  color?: string
  viewBox?: string
  rotate?: number
  spin?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  viewBox: '0 0 24 24',
  rotate: 0,
  spin: false,
  className: ''
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const computedSize = computed<string>(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})

const iconStyle = computed<CSSProperties>(() => ({
  fill: props.color,
  transform: `rotate(${props.rotate}deg)`,
  animation: props.spin ? 'spin 1s linear infinite' : 'none'
}))
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s ease;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

### 4.2 图标类型定义

```typescript
// types/icon.ts
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string

export interface IconProps {
  name: string
  size?: IconSize
  color?: string
  rotate?: number
  spin?: boolean
  className?: string
}

export interface IconConfig {
  prefix: string
  defaultSize: IconSize
  defaultColor: string
}

// 图标名称类型（可选，用于类型提示）
export type IconName = 
  | 'home'
  | 'user'
  | 'settings'
  | 'search'
  | 'close'
  | 'check'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'loading'
  | (string & {})
```

### 4.3 类型安全的图标组件

```vue
<!-- components/Icon.vue -->
<template>
  <svg 
    :class="['icon', `icon-${name}`, className]"
    :style="iconStyle"
    aria-hidden="true"
  >
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
import { computed, CSSProperties } from 'vue'
import type { IconSize, IconName } from '@/types/icon'

interface Props {
  name: IconName
  size?: IconSize
  color?: string
  rotate?: number
  spin?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor',
  rotate: 0,
  spin: false,
  className: ''
})

const sizeMap: Record<string, string> = {
  xs: '12px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px'
}

const computedSize = computed<string>(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return sizeMap[props.size] || props.size
})

const iconStyle = computed<CSSProperties>(() => ({
  width: computedSize.value,
  height: computedSize.value,
  fill: props.color,
  transform: `rotate(${props.rotate}deg)`,
  animation: props.spin ? 'icon-spin 1s linear infinite' : 'none'
}))
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
}

@keyframes icon-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

### 4.4 类型安全的 SVG 工具函数

```typescript
// utils/svg.ts
import type { IconSize } from '@/types/icon'

/**
 * 解析图标尺寸
 */
export function parseIconSize(size: IconSize): string {
  const sizeMap: Record<string, string> = {
    xs: '12px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  }
  
  if (typeof size === 'number') {
    return `${size}px`
  }
  
  return sizeMap[size] || size
}

/**
 * 生成 SVG 路径
 */
export function generateArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(centerX, centerY, radius, endAngle)
  const end = polarToCartesian(centerX, centerY, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ')
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

/**
 * SVG 颜色转换
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex
  
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
```

### 4.5 类型安全的 SVG Composable

```typescript
// composables/useSvgIcon.ts
import { ref, computed, Ref, ComputedRef, CSSProperties } from 'vue'
import type { IconSize } from '@/types/icon'
import { parseIconSize } from '@/utils/svg'

interface UseSvgIconOptions {
  size?: IconSize
  color?: string
  rotate?: number
}

interface UseSvgIconReturn {
  size: Ref<IconSize>
  color: Ref<string>
  rotate: Ref<number>
  iconStyle: ComputedRef<CSSProperties>
  setSize: (newSize: IconSize) => void
  setColor: (newColor: string) => void
  setRotate: (newRotate: number) => void
  reset: () => void
}

export function useSvgIcon(options: UseSvgIconOptions = {}): UseSvgIconReturn {
  const defaultOptions: Required<UseSvgIconOptions> = {
    size: 24,
    color: 'currentColor',
    rotate: 0
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  const size = ref<IconSize>(mergedOptions.size)
  const color = ref<string>(mergedOptions.color)
  const rotate = ref<number>(mergedOptions.rotate)
  
  const iconStyle = computed<CSSProperties>(() => ({
    width: parseIconSize(size.value),
    height: parseIconSize(size.value),
    fill: color.value,
    transform: `rotate(${rotate.value}deg)`,
    transition: 'all 0.3s ease'
  }))
  
  const setSize = (newSize: IconSize): void => {
    size.value = newSize
  }
  
  const setColor = (newColor: string): void => {
    color.value = newColor
  }
  
  const setRotate = (newRotate: number): void => {
    rotate.value = newRotate
  }
  
  const reset = (): void => {
    size.value = mergedOptions.size
    color.value = mergedOptions.color
    rotate.value = mergedOptions.rotate
  }
  
  return {
    size,
    color,
    rotate,
    iconStyle,
    setSize,
    setColor,
    setRotate,
    reset
  }
}
```

### 4.6 类型安全的 SVG 图表组件

```vue
<!-- components/SvgChart.vue -->
<template>
  <svg 
    :width="width" 
    :height="height" 
    :viewBox="`0 0 ${width} ${height}`"
    class="svg-chart"
  >
    <!-- 柱状图 -->
    <g v-if="type === 'bar'">
      <rect 
        v-for="(item, index) in normalizedData" 
        :key="index"
        :x="getBarX(index)"
        :y="getBarY(item.value)"
        :width="barWidth"
        :height="getBarHeight(item.value)"
        :fill="item.color || colors[index % colors.length]"
        class="chart-bar"
      />
    </g>
    
    <!-- 折线图 -->
    <g v-else-if="type === 'line'">
      <polyline 
        :points="linePoints"
        fill="none"
        :stroke="colors[0]"
        stroke-width="2"
      />
      <circle 
        v-for="(point, index) in pointsArray" 
        :key="index"
        :cx="point.x"
        :cy="point.y"
        r="4"
        :fill="colors[0]"
      />
    </g>
    
    <!-- 饼图 -->
    <g v-else-if="type === 'pie'" :transform="`translate(${width/2}, ${height/2})`">
      <path 
        v-for="(slice, index) in pieSlices" 
        :key="index"
        :d="slice.path"
        :fill="slice.color"
        class="pie-slice"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

interface ChartDataItem {
  label: string
  value: number
  color?: string
}

interface Props {
  type: 'bar' | 'line' | 'pie'
  data: ChartDataItem[]
  width?: number
  height?: number
  colors?: string[]
}

interface PieSlice {
  path: string
  color: string
  label: string
  value: number
}

interface Point {
  x: number
  y: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  colors: () => ['#4CAF50', '#2196F3', '#FF5722', '#FFC107', '#9C27B0']
})

const padding = 40

const normalizedData = computed<ChartDataItem[]>(() => props.data)

const maxValue = computed<number>(() => {
  return Math.max(...normalizedData.value.map(item => item.value))
})

const barWidth = computed<number>(() => {
  const availableWidth = props.width - padding * 2
  const gap = 10
  return (availableWidth - gap * (normalizedData.value.length - 1)) / normalizedData.value.length
})

const getBarX = (index: number): number => {
  const gap = 10
  return padding + index * (barWidth.value + gap)
}

const getBarHeight = (value: number): number => {
  const availableHeight = props.height - padding * 2
  return (value / maxValue.value) * availableHeight
}

const getBarY = (value: number): number => {
  return props.height - padding - getBarHeight(value)
}

// 折线图数据
const pointsArray = computed<Point[]>(() => {
  const availableWidth = props.width - padding * 2
  const availableHeight = props.height - padding * 2
  const step = availableWidth / (normalizedData.value.length - 1)
  
  return normalizedData.value.map((item, index) => ({
    x: padding + index * step,
    y: props.height - padding - (item.value / maxValue.value) * availableHeight
  }))
})

const linePoints = computed<string>(() => {
  return pointsArray.value.map(p => `${p.x},${p.y}`).join(' ')
})

// 饼图数据
const pieSlices: ComputedRef<PieSlice[]> = computed(() => {
  const total = normalizedData.value.reduce((sum, item) => sum + item.value, 0)
  const radius = Math.min(props.width, props.height) / 2 - padding
  
  let currentAngle = 0
  
  return normalizedData.value.map((item, index) => {
    const sliceAngle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    
    currentAngle = endAngle
    
    const x1 = radius * Math.cos((startAngle - 90) * Math.PI / 180)
    const y1 = radius * Math.sin((startAngle - 90) * Math.PI / 180)
    const x2 = radius * Math.cos((endAngle - 90) * Math.PI / 180)
    const y2 = radius * Math.sin((endAngle - 90) * Math.PI / 180)
    
    const largeArc = sliceAngle > 180 ? 1 : 0
    
    const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    
    return {
      path,
      color: item.color || props.colors[index % props.colors.length],
      label: item.label,
      value: item.value
    }
  })
})
</script>

<style scoped>
.svg-chart {
  display: block;
}

.chart-bar {
  transition: opacity 0.3s ease;
}

.chart-bar:hover {
  opacity: 0.8;
}

.pie-slice {
  transition: transform 0.3s ease;
  transform-origin: center;
}

.pie-slice:hover {
  transform: scale(1.05);
}
</style>
```

### 4.7 使用示例

```vue
<!-- App.vue -->
<template>
  <div class="app">
    <!-- 图标组件 -->
    <Icon name="home" size="lg" color="#4CAF50" />
    <Icon name="user" :size="32" />
    <Icon name="loading" spin />
    
    <!-- 图表组件 -->
    <SvgChart 
      type="bar" 
      :data="chartData" 
      :width="500" 
      :height="300"
    />
    
    <SvgChart 
      type="pie" 
      :data="pieData"
      :width="300"
      :height="300"
    />
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import SvgChart from '@/components/SvgChart.vue'

const chartData = [
  { label: 'Q1', value: 30 },
  { label: 'Q2', value: 50 },
  { label: 'Q3', value: 80 },
  { label: 'Q4', value: 60 }
]

const pieData = [
  { label: 'Chrome', value: 65, color: '#4285F4' },
  { label: 'Safari', value: 19, color: '#FF9500' },
  { label: 'Firefox', value: 10, color: '#FF7139' },
  { label: 'Other', value: 6, color: '#999' }
]
</script>
```

---

## 5. React 中使用 SVG

### 5.1 内联 SVG

```jsx
// components/InlineSvgDemo.jsx
import React, { useState } from 'react';

function InlineSvgDemo() {
  const [color, setColor] = useState('#333');
  const [size, setSize] = useState(48);
  
  const handleClick = () => {
    setColor(color === '#333' ? '#ff0000' : '#333');
  };
  
  return (
    <div className="svg-demo">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24"
        fill={color}
        onClick={handleClick}
        style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      
      <div className="controls">
        <input 
          type="range" 
          min="24" 
          max="96" 
          value={size} 
          onChange={e => setSize(Number(e.target.value))}
        />
        <input 
          type="color" 
          value={color} 
          onChange={e => setColor(e.target.value)}
        />
      </div>
    </div>
  );
}

export default InlineSvgDemo;
```

### 5.2 SVG 组件化

#### 5.2.1 基础图标组件

```jsx
// components/SvgIcon.jsx
import React from 'react';
import PropTypes from 'prop-types';

function SvgIcon({ 
  children, 
  size = 24, 
  color = 'currentColor', 
  viewBox = '0 0 24 24',
  rotate = 0,
  spin = false,
  className = '',
  style = {},
  ...props 
}) {
  const computedSize = typeof size === 'number' ? `${size}px` : size;
  
  const iconStyle = {
    width: computedSize,
    height: computedSize,
    fill: color,
    transform: `rotate(${rotate}deg)`,
    animation: spin ? 'spin 1s linear infinite' : 'none',
    transition: 'transform 0.3s ease',
    ...style
  };
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={`svg-icon ${className}`}
      style={iconStyle}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

SvgIcon.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  viewBox: PropTypes.string,
  rotate: PropTypes.number,
  spin: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

export default SvgIcon;
```

#### 5.2.2 具体图标组件

```jsx
// components/icons/IconHome.jsx
import React from 'react';
import SvgIcon from '../SvgIcon';

function IconHome(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </SvgIcon>
  );
}

export default IconHome;
```

```jsx
// components/icons/IconUser.jsx
import React from 'react';
import SvgIcon from '../SvgIcon';

function IconUser(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </SvgIcon>
  );
}

export default IconUser;
```

```jsx
// components/icons/IconLoading.jsx
import React from 'react';
import SvgIcon from '../SvgIcon';

function IconLoading(props) {
  return (
    <SvgIcon spin {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" opacity=".3"/>
      <path d="M12 2v4c3.31 0 6 2.69 6 6h4c0-5.52-4.48-10-10-10z"/>
    </SvgIcon>
  );
}

export default IconLoading;
```

```jsx
// components/icons/index.js
export { default as IconHome } from './IconHome';
export { default as IconUser } from './IconUser';
export { default as IconLoading } from './IconLoading';
```

### 5.3 使用 SVGR

#### 5.3.1 配置 SVGR

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  }
};
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        svgProps: {
          fill: 'currentColor'
        }
      }
    })
  ]
});
```

#### 5.3.2 使用 SVGR 组件

```jsx
// 导入为 React 组件
import { ReactComponent as Logo } from './logo.svg';
// 或 Vite + vite-plugin-svgr
import Logo from './logo.svg?react';

function App() {
  return (
    <div>
      <Logo width={100} height={100} fill="#4CAF50" />
    </div>
  );
}
```

### 5.4 React + TypeScript SVG 组件

```tsx
// components/SvgIcon.tsx
import React, { CSSProperties, ReactNode, SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  children: ReactNode;
  size?: number | string;
  color?: string;
  viewBox?: string;
  rotate?: number;
  spin?: boolean;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  children,
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  rotate = 0,
  spin = false,
  className = '',
  style = {},
  ...props
}) => {
  const computedSize = typeof size === 'number' ? `${size}px` : size;
  
  const iconStyle: CSSProperties = {
    width: computedSize,
    height: computedSize,
    fill: color,
    transform: `rotate(${rotate}deg)`,
    animation: spin ? 'spin 1s linear infinite' : 'none',
    transition: 'transform 0.3s ease',
    ...style
  };
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={`svg-icon ${className}`}
      style={iconStyle}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
};

export default SvgIcon;
```

```tsx
// components/icons/IconCheck.tsx
import React from 'react';
import SvgIcon from '../SvgIcon';

interface IconCheckProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const IconCheck: React.FC<IconCheckProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </SvgIcon>
  );
};

export default IconCheck;
```

### 5.5 自定义 Hook

```tsx
// hooks/useSvgIcon.ts
import { useState, useCallback, useMemo, CSSProperties } from 'react';

interface UseSvgIconOptions {
  size?: number | string;
  color?: string;
  rotate?: number;
}

interface UseSvgIconReturn {
  size: number | string;
  color: string;
  rotate: number;
  iconStyle: CSSProperties;
  setSize: (size: number | string) => void;
  setColor: (color: string) => void;
  setRotate: (rotate: number) => void;
  reset: () => void;
}

function useSvgIcon(options: UseSvgIconOptions = {}): UseSvgIconReturn {
  const defaultOptions: Required<UseSvgIconOptions> = {
    size: 24,
    color: 'currentColor',
    rotate: 0
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const [size, setSize] = useState<number | string>(mergedOptions.size);
  const [color, setColor] = useState<string>(mergedOptions.color);
  const [rotate, setRotate] = useState<number>(mergedOptions.rotate);
  
  const iconStyle = useMemo<CSSProperties>(() => ({
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    fill: color,
    transform: `rotate(${rotate}deg)`,
    transition: 'all 0.3s ease'
  }), [size, color, rotate]);
  
  const reset = useCallback(() => {
    setSize(mergedOptions.size);
    setColor(mergedOptions.color);
    setRotate(mergedOptions.rotate);
  }, [mergedOptions]);
  
  return {
    size,
    color,
    rotate,
    iconStyle,
    setSize,
    setColor,
    setRotate,
    reset
  };
}

export default useSvgIcon;
```

```tsx
// 使用示例
import React from 'react';
import useSvgIcon from '../hooks/useSvgIcon';

function IconDemo() {
  const { iconStyle, setSize, setColor, setRotate } = useSvgIcon({
    size: 48,
    color: '#4CAF50'
  });
  
  return (
    <div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        style={iconStyle}
        onClick={() => setRotate(prev => prev + 45)}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      
      <button onClick={() => setSize(32)}>Small</button>
      <button onClick={() => setSize(64)}>Large</button>
      <button onClick={() => setColor('#FF5722')}>Orange</button>
    </div>
  );
}
```

### 5.6 SVG Sprite in React

```tsx
// components/SvgSprite.tsx
import React from 'react';

interface SvgSpriteProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

const SvgSprite: React.FC<SvgSpriteProps> = ({
  name,
  size = '1em',
  color = 'currentColor',
  className = ''
}) => {
  const computedSize = typeof size === 'number' ? `${size}px` : size;
  
  return (
    <svg
      className={`svg-sprite ${className}`}
      style={{
        width: computedSize,
        height: computedSize,
        fill: color
      }}
      aria-hidden="true"
    >
      <use href={`#icon-${name}`} />
    </svg>
  );
};

export default SvgSprite;
```

### 5.7 React SVG 动画

```tsx
// components/AnimatedSvg.tsx
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedSvgProps {
  progress: number;
}

const AnimatedSvg: React.FC<AnimatedSvgProps> = ({ progress }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;
  
  useEffect(() => {
    // 动画过渡
    const timer = setTimeout(() => {
      setCurrentProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* 背景圆 */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="15"
      />
      
      {/* 进度圆 */}
      <circle
        ref={circleRef}
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#4CAF50"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 100 100)"
        style={{
          transition: 'stroke-dashoffset 0.5s ease'
        }}
      />
      
      {/* 文字 */}
      <text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="32"
        fontWeight="bold"
        fill="#333"
      >
        {Math.round(currentProgress)}%
      </text>
    </svg>
  );
};

export default AnimatedSvg;
```

### 5.8 React 动态 SVG 图表

```tsx
// components/BarChart.tsx
import React, { useMemo } from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  colors?: string[];
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 300,
  colors = ['#4CAF50', '#2196F3', '#FF5722', '#FFC107', '#9C27B0']
}) => {
  const padding = 40;
  
  const maxValue = useMemo(() => {
    return Math.max(...data.map(item => item.value));
  }, [data]);
  
  const barWidth = useMemo(() => {
    const availableWidth = width - padding * 2;
    const gap = 10;
    return (availableWidth - gap * (data.length - 1)) / data.length;
  }, [width, data.length]);
  
  const getBarX = (index: number): number => {
    const gap = 10;
    return padding + index * (barWidth + gap);
  };
  
  const getBarHeight = (value: number): number => {
    const availableHeight = height - padding * 2;
    return (value / maxValue) * availableHeight;
  };
  
  const getBarY = (value: number): number => {
    return height - padding - getBarHeight(value);
  };
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* 坐标轴 */}
      <line 
        x1={padding} 
        y1={height - padding} 
        x2={width - padding} 
        y2={height - padding} 
        stroke="#333" 
        strokeWidth="2"
      />
      <line 
        x1={padding} 
        y1={padding} 
        x2={padding} 
        y2={height - padding} 
        stroke="#333" 
        strokeWidth="2"
      />
      
      {/* 柱状图 */}
      {data.map((item, index) => (
        <g key={index}>
          <rect
            x={getBarX(index)}
            y={getBarY(item.value)}
            width={barWidth}
            height={getBarHeight(item.value)}
            fill={item.color || colors[index % colors.length]}
            style={{
              transition: 'all 0.3s ease'
            }}
          />
          <text
            x={getBarX(index) + barWidth / 2}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {item.label}
          </text>
          <text
            x={getBarX(index) + barWidth / 2}
            y={getBarY(item.value) - 5}
            textAnchor="middle"
            fontSize="12"
            fill="#333"
          >
            {item.value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default BarChart;
```

---

## 6. 通用最佳实践

### 6.1 图标系统架构

```
src/
├── components/
│   ├── SvgIcon.vue / SvgIcon.tsx    # 基础图标组件
│   └── icons/
│       ├── index.js                  # 统一导出
│       ├── IconHome.vue              # 具体图标
│       ├── IconUser.vue
│       └── ...
├── icons/
│   └── svg/                          # SVG 源文件
│       ├── home.svg
│       ├── user.svg
│       └── ...
├── styles/
│   └── icons.css                     # 图标相关样式
└── utils/
    └── svg.js                        # SVG 工具函数
```

### 6.2 性能优化建议

1. **使用 SVG Sprite 减少 HTTP 请求**
2. **懒加载非关键图标**
3. **使用 CSS transform 而非 SVG transform（GPU 加速）**
4. **避免过多的滤镜效果**
5. **压缩 SVG 文件（使用 SVGO）**

### 6.3 可访问性最佳实践

```jsx
// 装饰性图标
<svg aria-hidden="true">...</svg>

// 有意义的图标
<svg role="img" aria-labelledby="icon-title">
  <title id="icon-title">首页</title>
  ...
</svg>

// 按钮中的图标
<button aria-label="关闭">
  <svg aria-hidden="true">...</svg>
</button>
```

### 6.4 响应式 SVG

```css
/* 响应式 SVG */
.responsive-svg {
  width: 100%;
  height: auto;
  max-width: 400px;
}

/* 保持比例 */
.svg-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 比例 */
}

.svg-container svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### 6.5 主题切换支持

```css
/* CSS 变量支持主题切换 */
:root {
  --icon-color: #333;
  --icon-color-active: #007bff;
}

[data-theme="dark"] {
  --icon-color: #fff;
  --icon-color-active: #4dabf7;
}

.svg-icon {
  fill: var(--icon-color);
}

.svg-icon:hover {
  fill: var(--icon-color-active);
}
```

---

本文档涵盖了在 Vue2、Vue3、Vue3+TypeScript 和 React 中使用 SVG 的各种方法和最佳实践。根据项目需求选择合适的方案。
