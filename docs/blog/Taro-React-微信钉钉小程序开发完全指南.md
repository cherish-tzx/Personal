# Taro + React 微信/钉钉小程序开发完全指南

> **重要说明**：UniApp 不支持 React 框架，仅支持 Vue2/Vue3。如果您希望使用 React 开发小程序，推荐使用 **Taro** 框架。Taro 是由京东团队开发的跨端统一开发框架，完美支持 React/Vue/Nerv 等框架，可编译到微信/钉钉/支付宝等多端小程序。
<div class="doc-toc">
## 目录
1. [Taro项目初始化与配置](#1-taro项目初始化与配置)
2. [React基础语法在Taro中的应用](#2-react基础语法在taro中的应用)
3. [React Hooks完全指南](#3-react-hooks完全指南)
4. [组件系统](#4-组件系统)
5. [生命周期](#5-生命周期)
6. [路由与页面跳转](#6-路由与页面跳转)
7. [数据请求](#7-数据请求)
8. [状态管理Redux/Zustand](#8-状态管理reduxzustand)
9. [条件编译与多端适配](#9-条件编译与多端适配)
10. [微信小程序特有功能](#10-微信小程序特有功能)
11. [钉钉小程序特有功能](#11-钉钉小程序特有功能)
12. [TypeScript支持](#12-typescript支持)
13. [性能优化](#13-性能优化)


</div>

---

## 1. Taro项目初始化与配置

### 1.1 安装Taro CLI

```bash
# 使用npm安装
npm install -g @tarojs/cli

# 使用yarn安装
yarn global add @tarojs/cli

# 查看版本
taro -v
```

### 1.2 创建项目

```bash
# 创建项目
taro init my-react-app

# 选择配置：
# ? 请输入项目名称 my-react-app
# ? 请输入项目介绍 React小程序项目
# ? 请选择框架 React
# ? 是否需要使用 TypeScript ？ Yes
# ? 请选择 CSS 预处理器（Sass/Less/Stylus） Sass
# ? 请选择包管理工具 npm/yarn/pnpm
# ? 请选择模板源 默认模板源
# ? 请选择模板 默认模板

# 进入项目
cd my-react-app

# 安装依赖
npm install
```

### 1.3 项目结构

```
├── config/                     # 配置目录
│   ├── dev.js                  # 开发环境配置
│   ├── prod.js                 # 生产环境配置
│   └── index.js                # 主配置
├── src/
│   ├── pages/                  # 页面目录
│   │   ├── index/
│   │   │   ├── index.tsx
│   │   │   └── index.scss
│   │   └── user/
│   │       ├── index.tsx
│   │       └── index.scss
│   ├── components/             # 组件目录
│   ├── hooks/                  # 自定义Hooks
│   ├── stores/                 # 状态管理
│   ├── services/               # API服务
│   ├── utils/                  # 工具函数
│   ├── types/                  # 类型定义
│   ├── app.tsx                 # 应用入口
│   ├── app.scss                # 全局样式
│   ├── app.config.ts           # 全局配置
│   └── index.html              # H5入口
├── project.config.json         # 微信小程序配置
├── project.dd.json             # 钉钉小程序配置
├── tsconfig.json               # TypeScript配置
├── babel.config.js             # Babel配置
└── package.json
```

### 1.4 config/index.js 配置

```javascript
const config = {
  projectName: 'my-react-app',
  date: '2024-1-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
```

### 1.5 app.config.ts 全局配置

```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro React',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#007AFF',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: 'assets/tabbar/user.png',
        selectedIconPath: 'assets/tabbar/user-active.png'
      }
    ]
  }
})
```

### 1.6 运行项目

```bash
# 开发环境 - 微信小程序
npm run dev:weapp

# 开发环境 - 钉钉小程序
npm run dev:dd

# 开发环境 - H5
npm run dev:h5

# 生产环境构建
npm run build:weapp
npm run build:dd
npm run build:h5
```

---

## 2. React基础语法在Taro中的应用

### 2.1 函数组件基础

```tsx
// pages/index/index.tsx
import { View, Text, Button, Image } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

const Index = () => {
  // 状态
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Hello Taro React')
  
  // 事件处理
  const handleIncrement = () => {
    setCount(prev => prev + 1)
  }
  
  const handleDecrement = () => {
    setCount(prev => prev - 1)
  }
  
  return (
    <View className="container">
      <Text className="title">{message}</Text>
      <Text className="count">计数：{count}</Text>
      
      <View className="buttons">
        <Button onClick={handleDecrement}>-1</Button>
        <Button type="primary" onClick={handleIncrement}>+1</Button>
      </View>
    </View>
  )
}

export default Index
```

```tsx
// pages/index/index.config.ts
export default definePageConfig({
  navigationBarTitleText: '首页',
  enablePullDownRefresh: true
})
```

**使用场景**：所有页面和组件的基础结构

### 2.2 条件渲染

```tsx
import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'

const ConditionalRender = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [userType, setUserType] = useState<'admin' | 'vip' | 'normal'>('normal')
  const [showDetail, setShowDetail] = useState(false)
  
  return (
    <View className="container">
      {/* 基础条件渲染 */}
      {isLogin ? (
        <View>
          <Text>欢迎回来</Text>
          <Button onClick={() => setIsLogin(false)}>退出</Button>
        </View>
      ) : (
        <View>
          <Button onClick={() => setIsLogin(true)}>登录</Button>
        </View>
      )}
      
      {/* && 短路运算 */}
      {isLogin && <Text>已登录用户专属内容</Text>}
      
      {/* 多条件渲染 */}
      {userType === 'admin' && <Text>管理员功能</Text>}
      {userType === 'vip' && <Text>VIP专属功能</Text>}
      {userType === 'normal' && <Text>普通用户功能</Text>}
      
      {/* 使用函数封装复杂逻辑 */}
      {renderUserContent(userType)}
      
      {/* 控制显示隐藏 */}
      <Button onClick={() => setShowDetail(!showDetail)}>
        {showDetail ? '隐藏详情' : '显示详情'}
      </Button>
      {showDetail && (
        <View className="detail">
          <Text>详细内容...</Text>
        </View>
      )}
    </View>
  )
}

// 封装渲染函数
const renderUserContent = (type: string) => {
  switch (type) {
    case 'admin':
      return <Text>管理员面板</Text>
    case 'vip':
      return <Text>VIP中心</Text>
    default:
      return <Text>用户中心</Text>
  }
}

export default ConditionalRender
```

**使用场景**：登录状态判断、权限控制、内容展示控制

### 2.3 列表渲染

```tsx
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

interface Product {
  id: number
  name: string
  price: number
  image: string
  sales: number
}

interface Category {
  id: number
  name: string
  products: Product[]
}

const ListRender = () => {
  const [productList, setProductList] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  useEffect(() => {
    // 模拟加载数据
    setProductList([
      { id: 1, name: '商品A', price: 99, image: '', sales: 100 },
      { id: 2, name: '商品B', price: 199, image: '', sales: 50 }
    ])
  }, [])
  
  // 点击商品
  const handleProductClick = (product: Product) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${product.id}`
    })
  }
  
  return (
    <View className="list-page">
      {/* 基础列表渲染 */}
      <View className="product-list">
        {productList.map((item, index) => (
          <View 
            key={item.id} 
            className="product-item"
            onClick={() => handleProductClick(item)}
          >
            <Text className="index">{index + 1}</Text>
            <Image src={item.image} mode="aspectFill" />
            <View className="info">
              <Text className="name">{item.name}</Text>
              <Text className="price">¥{item.price}</Text>
              <Text className="sales">销量：{item.sales}</Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* 嵌套列表 */}
      <View className="category-list">
        {categories.map(category => (
          <View key={category.id} className="category-section">
            <Text className="category-title">{category.name}</Text>
            <View className="category-products">
              {category.products.map(product => (
                <View key={product.id} className="product-card">
                  <Text>{product.name}</Text>
                  <Text>¥{product.price}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
      
      {/* 空状态 */}
      {productList.length === 0 && (
        <View className="empty">
          <Image src="/assets/empty.png" />
          <Text>暂无数据</Text>
        </View>
      )}
    </View>
  )
}

export default ListRender
```

**使用场景**：商品列表、订单列表、消息列表

### 2.4 事件处理

```tsx
import { View, Text, Button, Input, ScrollView } from '@tarojs/components'
import { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'

const EventHandling = () => {
  const [inputValue, setInputValue] = useState('')
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  
  // 基础点击事件
  const handleClick = () => {
    console.log('按钮被点击')
  }
  
  // 带参数的事件
  const handleClickWithParam = (id: number) => {
    console.log('点击ID:', id)
  }
  
  // 带事件对象的事件
  const handleClickWithEvent = (e: any) => {
    console.log('事件对象:', e)
    e.stopPropagation() // 阻止冒泡
  }
  
  // 输入事件
  const handleInput = (e: any) => {
    setInputValue(e.detail.value)
  }
  
  // 确认事件（键盘回车）
  const handleConfirm = (e: any) => {
    console.log('确认输入:', e.detail.value)
    // 执行搜索等操作
  }
  
  // 焦点事件
  const handleFocus = () => {
    console.log('获得焦点')
  }
  
  const handleBlur = () => {
    console.log('失去焦点')
  }
  
  // 触摸事件
  const handleTouchStart = (e: any) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  }
  
  const handleTouchMove = (e: any) => {
    const moveX = e.touches[0].clientX - touchStart.x
    const moveY = e.touches[0].clientY - touchStart.y
    console.log('移动距离:', moveX, moveY)
  }
  
  const handleTouchEnd = () => {
    console.log('触摸结束')
  }
  
  // 长按事件
  const handleLongPress = () => {
    Taro.showActionSheet({
      itemList: ['删除', '编辑', '分享'],
      success: (res) => {
        console.log('选择:', res.tapIndex)
      }
    })
  }
  
  // 滚动事件
  const handleScroll = useCallback((e: any) => {
    console.log('滚动位置:', e.detail.scrollTop)
  }, [])
  
  // 滚动到底部
  const handleScrollToLower = () => {
    console.log('滚动到底部，加载更多')
  }
  
  return (
    <View className="container">
      {/* 点击事件 */}
      <Button onClick={handleClick}>基础点击</Button>
      <Button onClick={() => handleClickWithParam(123)}>带参数</Button>
      <Button onClick={handleClickWithEvent}>带事件对象</Button>
      
      {/* 冒泡控制 */}
      <View onClick={() => console.log('父元素点击')}>
        <Button onClick={handleClickWithEvent}>阻止冒泡</Button>
      </View>
      
      {/* 输入事件 */}
      <Input
        value={inputValue}
        placeholder="请输入"
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onConfirm={handleConfirm}
      />
      
      {/* 触摸事件 */}
      <View
        className="touch-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onLongPress={handleLongPress}
      >
        触摸区域（长按显示菜单）
      </View>
      
      {/* 滚动事件 */}
      <ScrollView
        scrollY
        className="scroll-view"
        onScroll={handleScroll}
        onScrollToLower={handleScrollToLower}
      >
        {/* 列表内容 */}
      </ScrollView>
    </View>
  )
}

export default EventHandling
```

**使用场景**：用户交互、表单输入、手势操作

### 2.5 表单处理

```tsx
import { View, Text, Input, Button, Picker, Switch, Slider, Radio, Checkbox } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'

interface FormData {
  username: string
  password: string
  phone: string
  gender: string
  hobbies: string[]
  city: string
  birthday: string
  notification: boolean
  age: number
}

const FormHandling = () => {
  const [form, setForm] = useState<FormData>({
    username: '',
    password: '',
    phone: '',
    gender: 'male',
    hobbies: [],
    city: '',
    birthday: '',
    notification: true,
    age: 25
  })
  
  const cityOptions = ['北京', '上海', '广州', '深圳']
  const hobbyOptions = [
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' }
  ]
  
  // 更新表单字段
  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }
  
  // 输入框变化
  const handleInputChange = (field: keyof FormData) => (e: any) => {
    updateField(field, e.detail.value)
  }
  
  // 性别选择
  const handleGenderChange = (e: any) => {
    updateField('gender', e.detail.value)
  }
  
  // 爱好选择
  const handleHobbyChange = (value: string) => {
    const newHobbies = form.hobbies.includes(value)
      ? form.hobbies.filter(h => h !== value)
      : [...form.hobbies, value]
    updateField('hobbies', newHobbies)
  }
  
  // 城市选择
  const handleCityChange = (e: any) => {
    updateField('city', cityOptions[e.detail.value])
  }
  
  // 日期选择
  const handleDateChange = (e: any) => {
    updateField('birthday', e.detail.value)
  }
  
  // 开关变化
  const handleSwitchChange = (e: any) => {
    updateField('notification', e.detail.value)
  }
  
  // 滑块变化
  const handleSliderChange = (e: any) => {
    updateField('age', e.detail.value)
  }
  
  // 表单验证
  const validateForm = (): boolean => {
    if (!form.username) {
      Taro.showToast({ title: '请输入用户名', icon: 'none' })
      return false
    }
    if (!form.password || form.password.length < 6) {
      Taro.showToast({ title: '密码至少6位', icon: 'none' })
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return false
    }
    return true
  }
  
  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) return
    
    console.log('提交表单:', form)
    Taro.showLoading({ title: '提交中...' })
    
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '提交成功', icon: 'success' })
    }, 1500)
  }
  
  // 重置表单
  const handleReset = () => {
    setForm({
      username: '',
      password: '',
      phone: '',
      gender: 'male',
      hobbies: [],
      city: '',
      birthday: '',
      notification: true,
      age: 25
    })
  }
  
  return (
    <View className="form-container">
      {/* 文本输入 */}
      <View className="form-item">
        <Text className="label">用户名</Text>
        <Input
          value={form.username}
          placeholder="请输入用户名"
          onInput={handleInputChange('username')}
        />
      </View>
      
      {/* 密码输入 */}
      <View className="form-item">
        <Text className="label">密码</Text>
        <Input
          value={form.password}
          password
          placeholder="请输入密码"
          onInput={handleInputChange('password')}
        />
      </View>
      
      {/* 手机号 */}
      <View className="form-item">
        <Text className="label">手机号</Text>
        <Input
          value={form.phone}
          type="number"
          maxlength={11}
          placeholder="请输入手机号"
          onInput={handleInputChange('phone')}
        />
      </View>
      
      {/* 单选 */}
      <View className="form-item">
        <Text className="label">性别</Text>
        <Radio.Group onChange={handleGenderChange}>
          <Radio value="male" checked={form.gender === 'male'}>男</Radio>
          <Radio value="female" checked={form.gender === 'female'}>女</Radio>
        </Radio.Group>
      </View>
      
      {/* 多选 */}
      <View className="form-item">
        <Text className="label">爱好</Text>
        {hobbyOptions.map(option => (
          <Checkbox
            key={option.value}
            value={option.value}
            checked={form.hobbies.includes(option.value)}
            onClick={() => handleHobbyChange(option.value)}
          >
            {option.label}
          </Checkbox>
        ))}
      </View>
      
      {/* 选择器 */}
      <View className="form-item">
        <Text className="label">城市</Text>
        <Picker mode="selector" range={cityOptions} onChange={handleCityChange}>
          <View>{form.city || '请选择城市'}</View>
        </Picker>
      </View>
      
      {/* 日期选择 */}
      <View className="form-item">
        <Text className="label">生日</Text>
        <Picker mode="date" value={form.birthday} onChange={handleDateChange}>
          <View>{form.birthday || '请选择日期'}</View>
        </Picker>
      </View>
      
      {/* 开关 */}
      <View className="form-item">
        <Text className="label">接收通知</Text>
        <Switch checked={form.notification} onChange={handleSwitchChange} />
      </View>
      
      {/* 滑块 */}
      <View className="form-item">
        <Text className="label">年龄：{form.age}</Text>
        <Slider
          value={form.age}
          min={18}
          max={60}
          showValue
          onChange={handleSliderChange}
        />
      </View>
      
      {/* 按钮 */}
      <View className="form-buttons">
        <Button type="primary" onClick={handleSubmit}>提交</Button>
        <Button onClick={handleReset}>重置</Button>
      </View>
    </View>
  )
}

export default FormHandling
```

**使用场景**：用户注册、信息编辑、设置页面

---

## 3. React Hooks完全指南

### 3.1 useState

```tsx
import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'

interface User {
  name: string
  age: number
  address: {
    city: string
    street: string
  }
}

const UseStateDemo = () => {
  // 基础类型
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Hello')
  const [loading, setLoading] = useState(false)
  
  // 对象类型
  const [user, setUser] = useState<User>({
    name: '张三',
    age: 25,
    address: {
      city: '北京',
      street: '朝阳区'
    }
  })
  
  // 数组类型
  const [list, setList] = useState<string[]>([])
  
  // 惰性初始化
  const [expensiveValue] = useState(() => {
    // 只在首次渲染时执行
    return computeExpensiveValue()
  })
  
  // 更新基础类型
  const increment = () => setCount(count + 1)
  const incrementFn = () => setCount(prev => prev + 1)
  
  // 更新对象（必须创建新对象）
  const updateUserName = (name: string) => {
    setUser(prev => ({ ...prev, name }))
  }
  
  // 更新嵌套对象
  const updateCity = (city: string) => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city
      }
    }))
  }
  
  // 更新数组
  const addItem = (item: string) => {
    setList(prev => [...prev, item])
  }
  
  const removeItem = (index: number) => {
    setList(prev => prev.filter((_, i) => i !== index))
  }
  
  const updateItem = (index: number, value: string) => {
    setList(prev => prev.map((item, i) => i === index ? value : item))
  }
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onClick={increment}>+1</Button>
      
      <Text>User: {user.name} - {user.address.city}</Text>
      <Button onClick={() => updateUserName('李四')}>更新名字</Button>
      <Button onClick={() => updateCity('上海')}>更新城市</Button>
    </View>
  )
}

function computeExpensiveValue() {
  // 复杂计算
  return 0
}

export default UseStateDemo
```

### 3.2 useEffect

```tsx
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

const UseEffectDemo = () => {
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState<number | null>(null)
  const [user, setUser] = useState(null)
  
  // 无依赖 - 每次渲染后执行
  useEffect(() => {
    console.log('组件渲染')
  })
  
  // 空依赖 - 只在挂载时执行一次
  useEffect(() => {
    console.log('组件挂载')
    
    // 清理函数 - 卸载时执行
    return () => {
      console.log('组件卸载')
    }
  }, [])
  
  // 有依赖 - 依赖变化时执行
  useEffect(() => {
    console.log('count变化:', count)
  }, [count])
  
  // 数据请求
  useEffect(() => {
    if (!userId) return
    
    let cancelled = false
    
    const fetchUser = async () => {
      try {
        const res = await Taro.request({
          url: `/api/user/${userId}`
        })
        
        if (!cancelled) {
          setUser(res.data)
        }
      } catch (error) {
        console.error('获取用户失败:', error)
      }
    }
    
    fetchUser()
    
    // 清理函数 - 防止竞态
    return () => {
      cancelled = true
    }
  }, [userId])
  
  // 定时器
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('定时执行')
    }, 1000)
    
    return () => {
      clearInterval(timer)
    }
  }, [])
  
  // 事件监听
  useEffect(() => {
    const handleResize = () => {
      console.log('窗口大小变化')
    }
    
    // 添加事件监听
    Taro.eventCenter.on('resize', handleResize)
    
    // 移除事件监听
    return () => {
      Taro.eventCenter.off('resize', handleResize)
    }
  }, [])
  
  return (
    <View>
      <Text>Count: {count}</Text>
    </View>
  )
}

export default UseEffectDemo
```

### 3.3 useCallback与useMemo

```tsx
import { View, Text, Button } from '@tarojs/components'
import { useState, useCallback, useMemo, memo } from 'react'

interface Product {
  id: number
  name: string
  price: number
}

// 子组件使用memo优化
const ProductItem = memo(({ 
  product, 
  onBuy 
}: { 
  product: Product
  onBuy: (id: number) => void 
}) => {
  console.log('ProductItem渲染:', product.id)
  
  return (
    <View className="product-item">
      <Text>{product.name}</Text>
      <Text>¥{product.price}</Text>
      <Button onClick={() => onBuy(product.id)}>购买</Button>
    </View>
  )
})

const UseCallbackMemoDemo = () => {
  const [count, setCount] = useState(0)
  const [products] = useState<Product[]>([
    { id: 1, name: '商品A', price: 100 },
    { id: 2, name: '商品B', price: 200 },
    { id: 3, name: '商品C', price: 300 }
  ])
  const [filter, setFilter] = useState('')
  const [discount, setDiscount] = useState(0.8)
  
  // useCallback缓存函数引用
  const handleBuy = useCallback((id: number) => {
    console.log('购买商品:', id)
  }, []) // 依赖为空，函数引用不变
  
  // 带依赖的useCallback
  const handleBuyWithDiscount = useCallback((id: number) => {
    console.log('购买商品:', id, '折扣:', discount)
  }, [discount]) // discount变化时更新函数
  
  // useMemo缓存计算结果
  const filteredProducts = useMemo(() => {
    console.log('计算过滤后的商品')
    return products.filter(p => 
      p.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [products, filter]) // 依赖变化时重新计算
  
  // 复杂计算
  const totalPrice = useMemo(() => {
    console.log('计算总价')
    return products.reduce((sum, p) => sum + p.price, 0) * discount
  }, [products, discount])
  
  // 派生状态
  const productCount = useMemo(() => {
    return filteredProducts.length
  }, [filteredProducts])
  
  return (
    <View className="container">
      <View>
        <Text>总价：¥{totalPrice}</Text>
        <Text>商品数：{productCount}</Text>
        <Button onClick={() => setCount(c => c + 1)}>
          计数：{count}（测试重渲染）
        </Button>
      </View>
      
      <View className="product-list">
        {filteredProducts.map(product => (
          <ProductItem
            key={product.id}
            product={product}
            onBuy={handleBuy}
          />
        ))}
      </View>
    </View>
  )
}

export default UseCallbackMemoDemo
```

### 3.4 useRef

```tsx
import { View, Text, Input, Button } from '@tarojs/components'
import { useRef, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

const UseRefDemo = () => {
  // 存储可变值（不触发重渲染）
  const countRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prevValueRef = useRef<string>('')
  
  // 用于DOM/组件引用
  const inputRef = useRef<any>(null)
  
  const [value, setValue] = useState('')
  const [renderCount, setRenderCount] = useState(0)
  
  // 存储上一次的值
  useEffect(() => {
    prevValueRef.current = value
  }, [value])
  
  // 不触发重渲染的计数
  const incrementRef = () => {
    countRef.current++
    console.log('countRef:', countRef.current)
  }
  
  // 触发重渲染的计数
  const forceRender = () => {
    setRenderCount(c => c + 1)
  }
  
  // 获取输入框焦点
  const focusInput = () => {
    // 小程序中使用Taro.createSelectorQuery
    Taro.createSelectorQuery()
      .select('#myInput')
      .node()
      .exec((res) => {
        console.log('输入框节点:', res)
      })
  }
  
  // 定时器管理
  const startTimer = () => {
    if (timerRef.current) return
    
    timerRef.current = setInterval(() => {
      console.log('定时器执行')
    }, 1000)
  }
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  return (
    <View className="container">
      <Text>渲染次数：{renderCount}</Text>
      <Text>当前值：{value}</Text>
      <Text>上一次值：{prevValueRef.current}</Text>
      <Text>Ref计数（不显示更新）：{countRef.current}</Text>
      
      <Input
        id="myInput"
        ref={inputRef}
        value={value}
        onInput={(e) => setValue(e.detail.value)}
      />
      
      <Button onClick={incrementRef}>增加Ref计数</Button>
      <Button onClick={forceRender}>强制渲染</Button>
      <Button onClick={focusInput}>聚焦输入框</Button>
      <Button onClick={startTimer}>开始定时器</Button>
      <Button onClick={stopTimer}>停止定时器</Button>
    </View>
  )
}

export default UseRefDemo
```

### 3.5 useContext

```tsx
import { View, Text, Button } from '@tarojs/components'
import { createContext, useContext, useState, ReactNode } from 'react'

// 定义Context类型
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

interface UserContextType {
  user: { name: string; id: number } | null
  login: (user: { name: string; id: number }) => void
  logout: () => void
}

// 创建Context
const ThemeContext = createContext<ThemeContextType | null>(null)
const UserContext = createContext<UserContextType | null>(null)

// 自定义Hook使用Context
const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

// Provider组件
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; id: number } | null>(null)
  
  const login = (userData: { name: string; id: number }) => {
    setUser(userData)
  }
  
  const logout = () => {
    setUser(null)
  }
  
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// 使用Context的组件
const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useUser()
  
  return (
    <View className={`header header-${theme}`}>
      <Text>当前主题：{theme}</Text>
      <Button onClick={toggleTheme}>切换主题</Button>
      
      {user ? (
        <View>
          <Text>用户：{user.name}</Text>
          <Button onClick={logout}>退出</Button>
        </View>
      ) : (
        <Text>未登录</Text>
      )}
    </View>
  )
}

// 主组件
const UseContextDemo = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <View className="app">
          <Header />
          {/* 其他组件 */}
        </View>
      </UserProvider>
    </ThemeProvider>
  )
}

export default UseContextDemo
```

### 3.6 useReducer

```tsx
import { View, Text, Button, Input } from '@tarojs/components'
import { useReducer } from 'react'

// 状态类型
interface CartState {
  items: Array<{
    id: number
    name: string
    price: number
    count: number
  }>
  total: number
}

// Action类型
type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: number; name: string; price: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_COUNT'; payload: { id: number; count: number } }
  | { type: 'CLEAR_CART' }

// 初始状态
const initialState: CartState = {
  items: [],
  total: 0
}

// Reducer函数
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existItem = state.items.find(item => item.id === action.payload.id)
      
      if (existItem) {
        const newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, count: item.count + 1 }
            : item
        )
        return {
          items: newItems,
          total: calculateTotal(newItems)
        }
      }
      
      const newItems = [...state.items, { ...action.payload, count: 1 }]
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id)
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    }
    
    case 'UPDATE_COUNT': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, count: action.payload.count }
          : item
      ).filter(item => item.count > 0)
      
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    }
    
    case 'CLEAR_CART':
      return initialState
    
    default:
      return state
  }
}

// 计算总价
const calculateTotal = (items: CartState['items']) => {
  return items.reduce((sum, item) => sum + item.price * item.count, 0)
}

// 组件
const UseReducerDemo = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  const addItem = (product: { id: number; name: string; price: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }
  
  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }
  
  const updateCount = (id: number, count: number) => {
    dispatch({ type: 'UPDATE_COUNT', payload: { id, count } })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  return (
    <View className="cart">
      <View className="cart-list">
        {state.items.map(item => (
          <View key={item.id} className="cart-item">
            <Text>{item.name}</Text>
            <Text>¥{item.price}</Text>
            <View className="counter">
              <Button onClick={() => updateCount(item.id, item.count - 1)}>-</Button>
              <Text>{item.count}</Text>
              <Button onClick={() => updateCount(item.id, item.count + 1)}>+</Button>
            </View>
            <Button onClick={() => removeItem(item.id)}>删除</Button>
          </View>
        ))}
      </View>
      
      <View className="cart-footer">
        <Text>总计：¥{state.total}</Text>
        <Button onClick={clearCart}>清空</Button>
      </View>
      
      {/* 测试添加商品 */}
      <Button onClick={() => addItem({ id: 1, name: '商品A', price: 100 })}>
        添加商品A
      </Button>
    </View>
  )
}

export default UseReducerDemo
```

---

## 4. 组件系统

### 4.1 组件定义

```tsx
// components/ProductCard/index.tsx
import { View, Text, Image, Button } from '@tarojs/components'
import { memo } from 'react'
import './index.scss'

interface Product {
  id: number
  name: string
  price: number
  image: string
  sales?: number
}

interface ProductCardProps {
  product: Product
  showSales?: boolean
  onClick?: (product: Product) => void
  onAddCart?: (product: Product) => void
  children?: React.ReactNode
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  showSales = true,
  onClick,
  onAddCart,
  children
}) => {
  const handleClick = () => {
    onClick?.(product)
  }
  
  const handleAddCart = (e: any) => {
    e.stopPropagation()
    onAddCart?.(product)
  }
  
  return (
    <View className="product-card" onClick={handleClick}>
      <Image className="product-image" src={product.image} mode="aspectFill" />
      <View className="product-info">
        <Text className="product-name">{product.name}</Text>
        <View className="product-footer">
          <Text className="product-price">¥{product.price}</Text>
          {showSales && product.sales && (
            <Text className="product-sales">销量：{product.sales}</Text>
          )}
        </View>
        {children}
      </View>
      <Button className="add-cart-btn" onClick={handleAddCart}>
        加购
      </Button>
    </View>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
```

```scss
// components/ProductCard/index.scss
.product-card {
  display: flex;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  .product-image {
    width: 200px;
    height: 200px;
    border-radius: 8px;
  }
  
  .product-info {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }
  
  .product-footer {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }
  
  .product-price {
    font-size: 36px;
    color: #ff4d4f;
    font-weight: bold;
  }
  
  .product-sales {
    font-size: 24px;
    color: #999;
  }
  
  .add-cart-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
```

### 4.2 使用组件

```tsx
// pages/index/index.tsx
import { View } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import ProductCard from '@/components/ProductCard'

const Index = () => {
  const [productList] = useState([
    { id: 1, name: '商品A', price: 99, image: '', sales: 100 },
    { id: 2, name: '商品B', price: 199, image: '', sales: 50 }
  ])
  
  const handleProductClick = (product) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${product.id}`
    })
  }
  
  const handleAddCart = (product) => {
    console.log('添加购物车:', product)
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  }
  
  return (
    <View className="index-page">
      {productList.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={handleProductClick}
          onAddCart={handleAddCart}
        >
          {/* 自定义内容 */}
          <View className="custom-content">
            自定义内容区域
          </View>
        </ProductCard>
      ))}
    </View>
  )
}

export default Index
```

---

## 5. 生命周期

### 5.1 页面生命周期

```tsx
// pages/lifecycle/index.tsx
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { 
  useLoad, 
  useReady, 
  useDidShow, 
  useDidHide, 
  useUnload,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useShareAppMessage,
  useShareTimeline
} from '@tarojs/taro'

const LifecyclePage = () => {
  const [data, setData] = useState(null)
  const [list, setList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  
  // 页面加载，接收页面参数
  useLoad((options) => {
    console.log('页面加载，参数:', options)
    // options.id, options.type 等
    loadData(options.id)
  })
  
  // 页面初次渲染完成
  useReady(() => {
    console.log('页面渲染完成')
    // 可以进行DOM操作
  })
  
  // 页面显示
  useDidShow(() => {
    console.log('页面显示')
    // 每次页面显示都会触发
  })
  
  // 页面隐藏
  useDidHide(() => {
    console.log('页面隐藏')
  })
  
  // 页面卸载
  useUnload(() => {
    console.log('页面卸载')
    // 清理操作
  })
  
  // 下拉刷新
  usePullDownRefresh(async () => {
    console.log('下拉刷新')
    setPage(1)
    await loadData()
    Taro.stopPullDownRefresh()
  })
  
  // 上拉触底
  useReachBottom(() => {
    console.log('上拉触底')
    setPage(prev => prev + 1)
    loadMore()
  })
  
  // 页面滚动
  usePageScroll(({ scrollTop }) => {
    console.log('滚动位置:', scrollTop)
  })
  
  // 分享给好友
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      console.log('来自按钮分享')
    }
    return {
      title: '分享标题',
      path: '/pages/index/index?from=share',
      imageUrl: '/assets/share.png'
    }
  })
  
  // 分享到朋友圈
  useShareTimeline(() => {
    return {
      title: '朋友圈分享标题',
      query: 'from=timeline',
      imageUrl: '/assets/share.png'
    }
  })
  
  // useEffect模拟生命周期
  useEffect(() => {
    console.log('组件挂载')
    
    return () => {
      console.log('组件卸载')
    }
  }, [])
  
  const loadData = async (id?: string) => {
    // 加载数据
  }
  
  const loadMore = async () => {
    // 加载更多
  }
  
  return (
    <View className="page">
      <Text>生命周期示例</Text>
    </View>
  )
}

export default LifecyclePage
```

### 5.2 应用生命周期

```tsx
// app.tsx
import { PropsWithChildren } from 'react'
import Taro, { useLaunch, useError, usePageNotFound } from '@tarojs/taro'
import './app.scss'

const App = ({ children }: PropsWithChildren) => {
  // 应用启动
  useLaunch((options) => {
    console.log('App launched', options)
    console.log('启动场景:', options.scene)
    console.log('启动路径:', options.path)
    console.log('启动参数:', options.query)
    
    // 检查更新
    checkUpdate()
    
    // 初始化
    initApp()
  })
  
  // 应用错误
  useError((error) => {
    console.error('App error:', error)
    // 上报错误
  })
  
  // 页面不存在
  usePageNotFound((res) => {
    console.log('Page not found:', res)
    Taro.switchTab({ url: '/pages/index/index' })
  })
  
  // 检查更新
  const checkUpdate = () => {
    if (process.env.TARO_ENV === 'weapp') {
      const updateManager = Taro.getUpdateManager()
      
      updateManager.onUpdateReady(() => {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  }
  
  // 初始化应用
  const initApp = () => {
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync()
    console.log('系统信息:', systemInfo)
    
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    if (!token) {
      // 未登录处理
    }
  }
  
  return children
}

export default App
```

---

## 6. 路由与页面跳转

### 6.1 路由跳转

```tsx
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

const RouterDemo = () => {
  // 跳转到普通页面
  const navigateTo = () => {
    Taro.navigateTo({
      url: '/pages/detail/index?id=1&name=test'
    })
  }
  
  // 重定向（关闭当前页）
  const redirectTo = () => {
    Taro.redirectTo({
      url: '/pages/result/index'
    })
  }
  
  // 跳转到TabBar页面
  const switchTab = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }
  
  // 关闭所有页面，跳转到指定页面
  const reLaunch = () => {
    Taro.reLaunch({
      url: '/pages/login/index'
    })
  }
  
  // 返回上一页
  const navigateBack = () => {
    Taro.navigateBack({
      delta: 1
    })
  }
  
  // 带事件通道的跳转
  const navigateWithEvents = () => {
    Taro.navigateTo({
      url: '/pages/select/index',
      events: {
        // 监听被打开页面发送的数据
        onSelected: (data) => {
          console.log('收到选择数据:', data)
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('passData', { info: '来自上一页的数据' })
      }
    })
  }
  
  return (
    <View>
      <Button onClick={navigateTo}>navigateTo</Button>
      <Button onClick={redirectTo}>redirectTo</Button>
      <Button onClick={switchTab}>switchTab</Button>
      <Button onClick={reLaunch}>reLaunch</Button>
      <Button onClick={navigateBack}>navigateBack</Button>
      <Button onClick={navigateWithEvents}>带事件跳转</Button>
    </View>
  )
}

export default RouterDemo
```

### 6.2 接收页面参数

```tsx
// pages/detail/index.tsx
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useLoad, useRouter } from '@tarojs/taro'

const DetailPage = () => {
  const [id, setId] = useState('')
  const [data, setData] = useState(null)
  
  // 方式1：使用useLoad
  useLoad((options) => {
    console.log('页面参数:', options)
    setId(options.id || '')
  })
  
  // 方式2：使用useRouter
  const router = useRouter()
  useEffect(() => {
    console.log('路由参数:', router.params)
    // router.params.id
  }, [router])
  
  // 方式3：使用getCurrentInstance
  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance?.router?.params
    console.log('实例参数:', params)
  }, [])
  
  // 接收事件通道数据
  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const eventChannel = instance?.page?.getOpenerEventChannel?.()
    
    if (eventChannel) {
      eventChannel.on('passData', (data) => {
        console.log('收到上一页数据:', data)
      })
    }
  }, [])
  
  // 返回并传递数据
  const goBackWithData = () => {
    const instance = Taro.getCurrentInstance()
    const eventChannel = instance?.page?.getOpenerEventChannel?.()
    
    if (eventChannel) {
      eventChannel.emit('onSelected', { selectedId: id })
    }
    
    Taro.navigateBack()
  }
  
  return (
    <View>
      <Text>详情页 ID: {id}</Text>
    </View>
  )
}

export default DetailPage
```

### 6.3 路由封装

```tsx
// utils/router.ts
import Taro from '@tarojs/taro'

// 需要登录的页面
const needLoginPages = ['/pages/user/index', '/pages/order/index']

// 路由跳转
export const navigateTo = (url: string, options?: Taro.navigateTo.Option) => {
  const path = url.split('?')[0]
  
  // 检查是否需要登录
  if (needLoginPages.includes(path)) {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return Taro.navigateTo({
        url: `/pages/login/index?redirect=${encodeURIComponent(url)}`
      })
    }
  }
  
  return Taro.navigateTo({
    url,
    ...options
  })
}

export const redirectTo = (url: string) => {
  return Taro.redirectTo({ url })
}

export const switchTab = (url: string) => {
  return Taro.switchTab({ url })
}

export const reLaunch = (url: string) => {
  return Taro.reLaunch({ url })
}

export const navigateBack = (delta = 1) => {
  return Taro.navigateBack({ delta })
}

export default {
  push: navigateTo,
  replace: redirectTo,
  switchTab,
  reLaunch,
  back: navigateBack
}
```

---

## 7. 数据请求

### 7.1 请求封装

```tsx
// services/request.ts
import Taro from '@tarojs/taro'

const BASE_URL = process.env.TARO_APP_API || 'https://api.example.com'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  loading?: boolean
  loadingText?: string
}

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 请求拦截
const requestInterceptor = (options: RequestOptions) => {
  const token = Taro.getStorageSync('token')
  
  options.header = {
    'Content-Type': 'application/json',
    ...options.header
  }
  
  if (token) {
    options.header.Authorization = `Bearer ${token}`
  }
  
  return options
}

// 响应拦截
const responseInterceptor = async <T>(
  response: Taro.request.SuccessCallbackResult<ApiResponse<T>>
): Promise<T> => {
  const { statusCode, data } = response
  
  if (statusCode === 200) {
    if (data.code === 0 || data.code === 200) {
      return data.data
    }
    
    if (data.code === 401) {
      Taro.removeStorageSync('token')
      Taro.showToast({ title: '登录已过期', icon: 'none' })
      setTimeout(() => {
        Taro.reLaunch({ url: '/pages/login/index' })
      }, 1500)
      throw new Error('Unauthorized')
    }
    
    Taro.showToast({ title: data.message || '请求失败', icon: 'none' })
    throw new Error(data.message)
  }
  
  throw new Error(`HTTP Error: ${statusCode}`)
}

// 请求函数
export const request = async <T = any>(options: RequestOptions): Promise<T> => {
  const finalOptions = requestInterceptor(options)
  
  if (options.loading !== false) {
    Taro.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    })
  }
  
  try {
    const response = await Taro.request<ApiResponse<T>>({
      url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: finalOptions.header
    })
    
    return responseInterceptor<T>(response)
  } catch (error) {
    Taro.showToast({ title: '网络请求失败', icon: 'none' })
    throw error
  } finally {
    if (options.loading !== false) {
      Taro.hideLoading()
    }
  }
}

// 快捷方法
export const http = {
  get: <T = any>(url: string, params?: any, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'GET', data: params, ...options }),
    
  post: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'POST', data, ...options }),
    
  put: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'PUT', data, ...options }),
    
  delete: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
    request<T>({ url, method: 'DELETE', data, ...options })
}

export default http
```

### 7.2 API模块

```tsx
// services/api/user.ts
import http from '../request'

interface LoginParams {
  phone: string
  code: string
}

interface LoginResult {
  token: string
  userInfo: {
    id: number
    name: string
    avatar: string
  }
}

export const userApi = {
  login: (data: LoginParams) => 
    http.post<LoginResult>('/user/login', data),
    
  getInfo: () => 
    http.get<LoginResult['userInfo']>('/user/info'),
    
  updateInfo: (data: Partial<LoginResult['userInfo']>) => 
    http.put('/user/info', data)
}

// services/api/product.ts
import http from '../request'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface ProductListParams {
  page?: number
  pageSize?: number
  keyword?: string
}

interface PaginatedData<T> {
  list: T[]
  total: number
}

export const productApi = {
  getList: (params: ProductListParams) => 
    http.get<PaginatedData<Product>>('/product/list', params),
    
  getDetail: (id: number) => 
    http.get<Product>(`/product/${id}`)
}
```

### 7.3 自定义Hook

```tsx
// hooks/useRequest.ts
import { useState, useCallback } from 'react'

interface UseRequestOptions<T> {
  manual?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useRequest<T, P extends any[] = []>(
  fetcher: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
) {
  const { manual = false, initialData, onSuccess, onError } = options
  
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const run = useCallback(async (...args: P) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetcher(...args)
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      onError?.(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [fetcher, onSuccess, onError])
  
  const reset = useCallback(() => {
    setData(initialData)
    setLoading(false)
    setError(null)
  }, [initialData])
  
  return {
    data,
    loading,
    error,
    run,
    reset
  }
}

// hooks/usePagination.ts
import { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'

interface UsePaginationOptions {
  pageSize?: number
}

export function usePagination<T>(
  fetcher: (params: { page: number; pageSize: number }) => Promise<{ list: T[]; total: number }>,
  options: UsePaginationOptions = {}
) {
  const { pageSize = 10 } = options
  
  const [list, setList] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  
  const loadData = useCallback(async (refresh = false) => {
    if (loading) return
    if (finished && !refresh) return
    
    setLoading(true)
    const currentPage = refresh ? 1 : page
    
    try {
      const res = await fetcher({ page: currentPage, pageSize })
      
      if (refresh) {
        setList(res.list)
        setPage(2)
      } else {
        setList(prev => [...prev, ...res.list])
        setPage(prev => prev + 1)
      }
      
      setTotal(res.total)
      setFinished(res.list.length < pageSize)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }, [fetcher, page, pageSize, loading, finished])
  
  const refresh = useCallback(() => loadData(true), [loadData])
  const loadMore = useCallback(() => loadData(false), [loadData])
  
  return {
    list,
    page,
    total,
    loading,
    finished,
    refresh,
    loadMore
  }
}
```

---

## 8. 状态管理Redux/Zustand

### 8.1 使用Zustand

```bash
# 安装Zustand
npm install zustand
```

```tsx
// stores/userStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'

interface UserInfo {
  id: number
  name: string
  avatar: string
}

interface UserState {
  token: string
  userInfo: UserInfo | null
  isLogin: boolean
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo | null) => void
  login: (token: string, userInfo: UserInfo) => void
  logout: () => void
}

// Taro存储适配器
const taroStorage = {
  getItem: (name: string) => {
    return Taro.getStorageSync(name) || null
  },
  setItem: (name: string, value: string) => {
    Taro.setStorageSync(name, value)
  },
  removeItem: (name: string) => {
    Taro.removeStorageSync(name)
  }
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      userInfo: null,
      isLogin: false,
      
      setToken: (token) => set({ token, isLogin: !!token }),
      
      setUserInfo: (userInfo) => set({ userInfo }),
      
      login: (token, userInfo) => set({ 
        token, 
        userInfo, 
        isLogin: true 
      }),
      
      logout: () => {
        set({ token: '', userInfo: null, isLogin: false })
        Taro.reLaunch({ url: '/pages/login/index' })
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => taroStorage)
    }
  )
)

// stores/cartStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'

interface CartItem {
  id: number
  name: string
  price: number
  count: number
  selected: boolean
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'count' | 'selected'>) => void
  removeItem: (id: number) => void
  updateCount: (id: number, count: number) => void
  toggleSelect: (id: number) => void
  toggleSelectAll: () => void
  clearCart: () => void
  
  // 计算属性
  totalCount: () => number
  totalPrice: () => number
  selectedItems: () => CartItem[]
  isAllSelected: () => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existItem = state.items.find(i => i.id === item.id)
        if (existItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, count: i.count + 1 } : i
            )
          }
        }
        return {
          items: [...state.items, { ...item, count: 1, selected: true }]
        }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      
      updateCount: (id, count) => set((state) => ({
        items: count > 0
          ? state.items.map(i => i.id === id ? { ...i, count } : i)
          : state.items.filter(i => i.id !== id)
      })),
      
      toggleSelect: (id) => set((state) => ({
        items: state.items.map(i => 
          i.id === id ? { ...i, selected: !i.selected } : i
        )
      })),
      
      toggleSelectAll: () => set((state) => {
        const allSelected = state.items.every(i => i.selected)
        return {
          items: state.items.map(i => ({ ...i, selected: !allSelected }))
        }
      }),
      
      clearCart: () => set({ items: [] }),
      
      // 计算属性
      totalCount: () => get().items.reduce((sum, i) => sum + i.count, 0),
      totalPrice: () => get().items
        .filter(i => i.selected)
        .reduce((sum, i) => sum + i.price * i.count, 0),
      selectedItems: () => get().items.filter(i => i.selected),
      isAllSelected: () => get().items.length > 0 && get().items.every(i => i.selected)
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => taroStorage)
    }
  )
)
```

### 8.2 在组件中使用

```tsx
// pages/cart/index.tsx
import { View, Text, Button, Checkbox } from '@tarojs/components'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import Taro from '@tarojs/taro'

const CartPage = () => {
  const {
    items,
    addItem,
    removeItem,
    updateCount,
    toggleSelect,
    toggleSelectAll,
    totalCount,
    totalPrice,
    isAllSelected
  } = useCartStore()
  
  const { isLogin } = useUserStore()
  
  const handleCheckout = () => {
    if (!isLogin) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    
    const selectedItems = items.filter(i => i.selected)
    if (selectedItems.length === 0) {
      Taro.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    
    Taro.navigateTo({ url: '/pages/checkout/index' })
  }
  
  return (
    <View className="cart-page">
      <View className="cart-list">
        {items.map(item => (
          <View key={item.id} className="cart-item">
            <Checkbox
              checked={item.selected}
              onClick={() => toggleSelect(item.id)}
            />
            <Text className="name">{item.name}</Text>
            <Text className="price">¥{item.price}</Text>
            <View className="counter">
              <Button onClick={() => updateCount(item.id, item.count - 1)}>-</Button>
              <Text>{item.count}</Text>
              <Button onClick={() => updateCount(item.id, item.count + 1)}>+</Button>
            </View>
            <Button onClick={() => removeItem(item.id)}>删除</Button>
          </View>
        ))}
      </View>
      
      <View className="cart-footer">
        <View className="select-all" onClick={toggleSelectAll}>
          <Checkbox checked={isAllSelected()} />
          <Text>全选</Text>
        </View>
        <View className="total">
          <Text>合计：¥{totalPrice()}</Text>
        </View>
        <Button type="primary" onClick={handleCheckout}>
          结算({totalCount()})
        </Button>
      </View>
    </View>
  )
}

export default CartPage
```

---

## 9. 条件编译与多端适配

### 9.1 条件编译语法

```tsx
// 在代码中使用条件编译
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

const MultiPlatform = () => {
  // 平台判断
  const platform = process.env.TARO_ENV
  
  const handleLogin = () => {
    if (process.env.TARO_ENV === 'weapp') {
      // 微信小程序登录
      Taro.login({
        success: (res) => {
          console.log('微信登录code:', res.code)
        }
      })
    } else if (process.env.TARO_ENV === 'dd') {
      // 钉钉小程序登录
      // @ts-ignore
      dd.getAuthCode({
        success: (res: any) => {
          console.log('钉钉授权码:', res.authCode)
        }
      })
    }
  }
  
  const handleShare = () => {
    if (process.env.TARO_ENV === 'weapp') {
      // 微信分享通过配置实现
    } else if (process.env.TARO_ENV === 'dd') {
      // @ts-ignore
      dd.share({
        type: 0,
        url: 'https://example.com',
        title: '分享标题'
      })
    }
  }
  
  return (
    <View className="container">
      <Text>当前平台：{platform}</Text>
      
      {/* 条件渲染 */}
      {process.env.TARO_ENV === 'weapp' && (
        <Button openType="share">微信分享</Button>
      )}
      
      {process.env.TARO_ENV === 'dd' && (
        <Button onClick={handleShare}>钉钉分享</Button>
      )}
      
      <Button onClick={handleLogin}>登录</Button>
    </View>
  )
}

export default MultiPlatform
```

### 9.2 多端文件

```
src/
  pages/
    index/
      index.tsx           # 通用代码
      index.weapp.tsx     # 微信小程序专用
      index.dd.tsx        # 钉钉小程序专用
      index.h5.tsx        # H5专用
```

### 9.3 平台适配工具

```tsx
// utils/platform.ts
import Taro from '@tarojs/taro'

export type Platform = 'weapp' | 'dd' | 'h5' | 'alipay' | 'unknown'

export const getPlatform = (): Platform => {
  return (process.env.TARO_ENV as Platform) || 'unknown'
}

export const isWeapp = () => process.env.TARO_ENV === 'weapp'
export const isDingtalk = () => process.env.TARO_ENV === 'dd'
export const isH5 = () => process.env.TARO_ENV === 'h5'

// 统一登录
export const platformLogin = (): Promise<{ platform: Platform; code: string | null }> => {
  return new Promise((resolve, reject) => {
    if (isWeapp()) {
      Taro.login({
        success: (res) => resolve({ platform: 'weapp', code: res.code }),
        fail: reject
      })
    } else if (isDingtalk()) {
      // @ts-ignore
      dd.getAuthCode({
        success: (res: any) => resolve({ platform: 'dd', code: res.authCode }),
        fail: reject
      })
    } else {
      resolve({ platform: 'h5', code: null })
    }
  })
}

// 统一扫码
export const platformScan = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (isWeapp()) {
      Taro.scanCode({
        success: (res) => resolve(res.result),
        fail: reject
      })
    } else if (isDingtalk()) {
      // @ts-ignore
      dd.scan({
        type: 'qr',
        success: (res: any) => resolve(res.text),
        fail: reject
      })
    } else {
      reject(new Error('Platform not supported'))
    }
  })
}
```

---

## 10. 微信小程序特有功能

### 10.1 微信登录与手机号

```tsx
import { View, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { userApi } from '@/services/api/user'
import { useUserStore } from '@/stores/userStore'

const WxLoginPage = () => {
  const [avatarUrl, setAvatarUrl] = useState('')
  const [nickname, setNickname] = useState('')
  const { login } = useUserStore()
  
  // 获取手机号
  const handleGetPhoneNumber = async (e: any) => {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      Taro.showToast({ title: '获取手机号失败', icon: 'none' })
      return
    }
    
    try {
      const res = await userApi.wxPhoneLogin({ code: e.detail.code })
      login(res.token, res.userInfo)
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch (error) {
      console.error('登录失败:', error)
    }
  }
  
  // 选择头像
  const handleChooseAvatar = (e: any) => {
    setAvatarUrl(e.detail.avatarUrl)
    // 上传头像到服务器
  }
  
  return (
    <View className="login-page">
      {/* 头像选择 */}
      <Button openType="chooseAvatar" onChooseAvatar={handleChooseAvatar}>
        选择头像
      </Button>
      
      {/* 昵称输入 */}
      <Input
        type="nickname"
        placeholder="请输入昵称"
        onInput={(e) => setNickname(e.detail.value)}
      />
      
      {/* 手机号登录 */}
      <Button openType="getPhoneNumber" onGetPhoneNumber={handleGetPhoneNumber}>
        手机号快捷登录
      </Button>
      
      {/* 客服 */}
      <Button openType="contact">联系客服</Button>
      
      {/* 分享 */}
      <Button openType="share">分享给好友</Button>
    </View>
  )
}

export default WxLoginPage
```

### 10.2 微信支付

```tsx
// hooks/useWxPay.ts
import Taro from '@tarojs/taro'
import { orderApi } from '@/services/api/order'

interface PayParams {
  timeStamp: string
  nonceStr: string
  package: string
  signType: 'MD5' | 'RSA'
  paySign: string
}

export const useWxPay = () => {
  const pay = async (orderId: number): Promise<boolean> => {
    try {
      // 获取支付参数
      const payParams = await orderApi.getPayParams(orderId)
      
      return new Promise((resolve) => {
        Taro.requestPayment({
          ...payParams,
          success: () => {
            Taro.showToast({ title: '支付成功', icon: 'success' })
            resolve(true)
          },
          fail: (err) => {
            if (err.errMsg.includes('cancel')) {
              Taro.showToast({ title: '已取消支付', icon: 'none' })
            } else {
              Taro.showToast({ title: '支付失败', icon: 'none' })
            }
            resolve(false)
          }
        })
      })
    } catch (error) {
      Taro.showToast({ title: '获取支付参数失败', icon: 'none' })
      return false
    }
  }
  
  return { pay }
}
```

---

## 11. 钉钉小程序特有功能

### 11.1 钉钉免登

```tsx
// hooks/useDingAuth.ts
import Taro from '@tarojs/taro'
import { userApi } from '@/services/api/user'

export const useDingAuth = () => {
  const getAuthCode = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'dd') {
        // @ts-ignore
        dd.getAuthCode({
          success: (res: any) => resolve(res.authCode),
          fail: reject
        })
      } else {
        reject(new Error('Not in DingTalk'))
      }
    })
  }
  
  const login = async () => {
    const authCode = await getAuthCode()
    return userApi.dingLogin({ authCode })
  }
  
  return { getAuthCode, login }
}
```

### 11.2 通讯录选人

```tsx
// hooks/useDingContact.ts
export const useDingContact = () => {
  const choosePerson = (options: {
    multiple?: boolean
    maxUsers?: number
  } = {}): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'dd') {
        // @ts-ignore
        dd.choosePerson({
          multiple: options.multiple !== false,
          maxUsers: options.maxUsers || 50,
          success: (res: any) => resolve(res.users),
          fail: reject
        })
      } else {
        reject(new Error('Not in DingTalk'))
      }
    })
  }
  
  const chooseDepartment = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'dd') {
        // @ts-ignore
        dd.chooseDepartment({
          multiple: true,
          success: (res: any) => resolve(res.departments),
          fail: reject
        })
      } else {
        reject(new Error('Not in DingTalk'))
      }
    })
  }
  
  return { choosePerson, chooseDepartment }
}
```

---

## 12. TypeScript支持

### 12.1 类型定义

```typescript
// types/index.ts

// 用户类型
export interface User {
  id: number
  name: string
  avatar: string
  phone: string
}

// 商品类型
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  stock: number
  sales: number
}

// 订单类型
export interface Order {
  id: number
  orderNo: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}

export type OrderStatus = 
  | 'pending_payment' 
  | 'pending_shipment' 
  | 'shipped' 
  | 'completed' 
  | 'cancelled'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  count: number
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
```

### 12.2 组件Props类型

```typescript
// components/ProductCard/types.ts
import { Product } from '@/types'

export interface ProductCardProps {
  product: Product
  showPrice?: boolean
  showSales?: boolean
  onClick?: (product: Product) => void
  onAddCart?: (product: Product) => void
  className?: string
  style?: React.CSSProperties
}
```

---

## 13. 性能优化

### 13.1 组件优化

```tsx
import { memo, useMemo, useCallback } from 'react'
import { View, Text, Image } from '@tarojs/components'

// 使用memo包裹组件
const ProductItem = memo<{ product: Product; onClick: (p: Product) => void }>(
  ({ product, onClick }) => {
    console.log('ProductItem渲染')
    return (
      <View onClick={() => onClick(product)}>
        <Image src={product.image} lazyLoad />
        <Text>{product.name}</Text>
      </View>
    )
  }
)

// 父组件
const ProductList = ({ products }) => {
  // 缓存回调函数
  const handleClick = useCallback((product: Product) => {
    console.log('点击商品:', product.id)
  }, [])
  
  // 缓存计算结果
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.sales - a.sales)
  }, [products])
  
  return (
    <View>
      {sortedProducts.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onClick={handleClick}
        />
      ))}
    </View>
  )
}
```

### 13.2 图片懒加载

```tsx
<Image 
  src={imageUrl} 
  lazyLoad 
  mode="aspectFill"
  onError={() => setImageUrl(defaultImage)}
/>
```

### 13.3 分包加载

```typescript
// app.config.ts
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/user/index'
  ],
  subPackages: [
    {
      root: 'packageA',
      pages: [
        'pages/detail/index',
        'pages/list/index'
      ]
    },
    {
      root: 'packageB',
      pages: [
        'pages/order/index',
        'pages/pay/index'
      ]
    }
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['packageA']
    }
  }
})
```

---

## 附录：完整页面模板

```tsx
// pages/index/index.tsx
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad, usePullDownRefresh, useReachBottom, useShareAppMessage } from '@tarojs/taro'
import { usePagination } from '@/hooks/usePagination'
import { productApi } from '@/services/api/product'
import ProductCard from '@/components/ProductCard'
import Empty from '@/components/Empty'
import './index.scss'

const Index = () => {
  const [searchKey, setSearchKey] = useState('')
  
  const {
    list,
    loading,
    finished,
    refresh,
    loadMore
  } = usePagination((params) => 
    productApi.getList({ ...params, keyword: searchKey })
  )
  
  useLoad(() => {
    refresh()
  })
  
  usePullDownRefresh(() => {
    refresh()
  })
  
  useReachBottom(() => {
    loadMore()
  })
  
  useShareAppMessage(() => ({
    title: '商品列表',
    path: '/pages/index/index'
  }))
  
  const handleProductClick = (product: any) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${product.id}`
    })
  }
  
  const handleAddCart = (product: any) => {
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  }
  
  return (
    <View className="index-page">
      <View className="product-list">
        {list.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
            onAddCart={handleAddCart}
          />
        ))}
      </View>
      
      {loading && <View className="loading">加载中...</View>}
      {finished && list.length > 0 && <View className="finished">没有更多了</View>}
      {!loading && list.length === 0 && <Empty text="暂无商品" />}
    </View>
  )
}

export default Index
```

---

本文档涵盖了使用 Taro + React 开发微信和钉钉小程序的所有核心知识点，包括项目配置、React语法、Hooks、组件系统、生命周期、路由、数据请求、状态管理、条件编译和性能优化等内容。每个部分都提供了详细的代码示例和使用场景说明。

> **注意**：由于 UniApp 不支持 React，本文档使用 Taro 框架作为 React 开发小程序的解决方案。Taro 与 UniApp 在功能和API设计上有很多相似之处，学习成本较低。
