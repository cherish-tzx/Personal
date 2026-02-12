# UniApp + Vue2 微信/钉钉小程序开发完全指南
<div class="doc-toc">
## 目录
1. [项目初始化与配置](#1-项目初始化与配置)
2. [Vue2基础语法在UniApp中的应用](#2-vue2基础语法在uniapp中的应用)
3. [组件系统](#3-组件系统)
4. [生命周期](#4-生命周期)
5. [路由与页面跳转](#5-路由与页面跳转)
6. [数据请求与API调用](#6-数据请求与api调用)
7. [状态管理Vuex](#7-状态管理vuex)
8. [条件编译与多端适配](#8-条件编译与多端适配)
9. [微信小程序特有API](#9-微信小程序特有api)
10. [钉钉小程序特有API](#10-钉钉小程序特有api)
11. [样式与布局](#11-样式与布局)
12. [性能优化](#12-性能优化)


</div>

---

## 1. 项目初始化与配置

### 1.1 创建项目

```bash
# 使用HBuilderX创建（推荐）
# 文件 -> 新建 -> 项目 -> uni-app -> 选择默认模板

# 使用CLI创建
npm install -g @vue/cli
vue create -p dcloudio/uni-preset-vue my-project
# 选择 Vue2 版本
```

### 1.2 项目结构

```
├── pages/                  # 页面目录
│   ├── index/
│   │   └── index.vue
│   └── user/
│       └── user.vue
├── components/             # 组件目录
├── static/                 # 静态资源
├── store/                  # Vuex状态管理
├── utils/                  # 工具函数
├── api/                    # API接口
├── App.vue                 # 应用入口
├── main.js                 # 主入口文件
├── manifest.json           # 应用配置
├── pages.json              # 页面配置
└── uni.scss                # 全局样式变量
```

### 1.3 manifest.json 配置

```json
{
  "name": "我的小程序",
  "appid": "__UNI__XXXXXX",
  "description": "小程序描述",
  "versionName": "1.0.0",
  "versionCode": "100",
  "mp-weixin": {
    "appid": "wx微信小程序appid",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "获取位置信息用于定位"
      }
    },
    "requiredPrivateInfos": ["getLocation", "chooseAddress"]
  },
  "mp-dingtalk": {
    "appid": "钉钉小程序appid",
    "setting": {
      "urlCheck": false
    }
  }
}
```

### 1.4 pages.json 配置

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "navigationBarBackgroundColor": "#007AFF",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true,
        "backgroundTextStyle": "dark"
      }
    },
    {
      "path": "pages/user/user",
      "style": {
        "navigationBarTitleText": "我的"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#007AFF",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "static/tabbar/user.png",
        "selectedIconPath": "static/tabbar/user-active.png",
        "text": "我的"
      }
    ]
  },
  "condition": {
    "current": 0,
    "list": [
      {
        "name": "详情页",
        "path": "pages/detail/detail",
        "query": "id=1"
      }
    ]
  }
}
```

---

## 2. Vue2基础语法在UniApp中的应用

### 2.1 模板语法

#### 2.1.1 文本插值

```vue
<template>
  <view class="container">
    <!-- 文本插值 -->
    <text>{{ message }}</text>
    
    <!-- 原始HTML（谨慎使用） -->
    <rich-text :nodes="htmlContent"></rich-text>
    
    <!-- 表达式 -->
    <text>{{ count + 1 }}</text>
    <text>{{ ok ? '是' : '否' }}</text>
    <text>{{ message.split('').reverse().join('') }}</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello UniApp',
      count: 10,
      ok: true,
      htmlContent: '<div style="color:red;">富文本内容</div>'
    }
  }
}
</script>
```

**使用场景**：页面数据展示、动态内容渲染

#### 2.1.2 属性绑定

```vue
<template>
  <view>
    <!-- 动态绑定属性 -->
    <image :src="imageUrl" mode="aspectFill"></image>
    
    <!-- 动态绑定class -->
    <view :class="{ active: isActive, 'text-danger': hasError }">
      对象语法
    </view>
    <view :class="[activeClass, errorClass]">数组语法</view>
    <view :class="[isActive ? activeClass : '', errorClass]">
      三元表达式
    </view>
    
    <!-- 动态绑定style -->
    <view :style="{ color: activeColor, fontSize: fontSize + 'px' }">
      对象语法
    </view>
    <view :style="[baseStyles, overridingStyles]">数组语法</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '/static/logo.png',
      isActive: true,
      hasError: false,
      activeClass: 'active',
      errorClass: 'text-danger',
      activeColor: '#007AFF',
      fontSize: 14,
      baseStyles: {
        color: 'red',
        fontSize: '14px'
      },
      overridingStyles: {
        fontWeight: 'bold'
      }
    }
  }
}
</script>

<style scoped>
.active {
  background-color: #007AFF;
}
.text-danger {
  color: red;
}
</style>
```

**使用场景**：动态图片加载、状态样式切换、主题定制

### 2.2 条件渲染

```vue
<template>
  <view>
    <!-- v-if 条件渲染 -->
    <view v-if="type === 'A'">类型A</view>
    <view v-else-if="type === 'B'">类型B</view>
    <view v-else>其他类型</view>
    
    <!-- v-show 显示隐藏 -->
    <view v-show="isVisible">通过display控制显示</view>
    
    <!-- 登录状态判断示例 -->
    <view v-if="isLogin">
      <text>欢迎，{{ userName }}</text>
      <button @click="logout">退出登录</button>
    </view>
    <view v-else>
      <button @click="login">立即登录</button>
    </view>
    
    <!-- 权限控制示例 -->
    <view v-if="userRole === 'admin'">
      <button>管理员操作</button>
    </view>
    <view v-else-if="userRole === 'vip'">
      <button>VIP专属功能</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 'A',
      isVisible: true,
      isLogin: false,
      userName: '',
      userRole: 'normal'
    }
  },
  methods: {
    login() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    logout() {
      uni.removeStorageSync('token')
      this.isLogin = false
    }
  }
}
</script>
```

**使用场景**：登录状态判断、权限控制、条件展示内容

### 2.3 列表渲染

```vue
<template>
  <view>
    <!-- 基础列表渲染 -->
    <view v-for="(item, index) in list" :key="item.id">
      <text>{{ index + 1 }}. {{ item.name }}</text>
    </view>
    
    <!-- 带筛选的列表 -->
    <view v-for="item in filteredList" :key="item.id">
      <text>{{ item.name }}</text>
    </view>
    
    <!-- 嵌套列表 -->
    <view v-for="category in categories" :key="category.id">
      <text class="category-title">{{ category.name }}</text>
      <view v-for="product in category.products" :key="product.id">
        <text>{{ product.name }} - ¥{{ product.price }}</text>
      </view>
    </view>
    
    <!-- 商品列表实战示例 -->
    <view class="product-list">
      <view 
        class="product-item" 
        v-for="product in productList" 
        :key="product.id"
        @click="goDetail(product.id)"
      >
        <image :src="product.image" mode="aspectFill"></image>
        <view class="info">
          <text class="name">{{ product.name }}</text>
          <text class="price">¥{{ product.price }}</text>
          <text class="sales">销量：{{ product.sales }}</text>
        </view>
      </view>
    </view>
    
    <!-- 空状态处理 -->
    <view v-if="productList.length === 0" class="empty">
      <image src="/static/empty.png"></image>
      <text>暂无数据</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, name: '项目1' },
        { id: 2, name: '项目2' }
      ],
      categories: [
        {
          id: 1,
          name: '电子产品',
          products: [
            { id: 101, name: '手机', price: 3999 },
            { id: 102, name: '平板', price: 2999 }
          ]
        }
      ],
      productList: [],
      searchKey: ''
    }
  },
  computed: {
    // 计算属性筛选列表
    filteredList() {
      return this.list.filter(item => 
        item.name.includes(this.searchKey)
      )
    }
  },
  methods: {
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      })
    }
  }
}
</script>
```

**使用场景**：商品列表、订单列表、消息列表、分类数据展示

### 2.4 事件处理

```vue
<template>
  <view>
    <!-- 基础事件绑定 -->
    <button @click="handleClick">点击事件</button>
    <button @click="handleClickWithParam('参数')">带参数</button>
    <button @click="handleClickWithEvent($event)">获取事件对象</button>
    
    <!-- 事件修饰符 -->
    <view @click="parentClick">
      <button @click.stop="childClick">阻止冒泡</button>
    </view>
    
    <!-- 表单事件 -->
    <input 
      type="text" 
      v-model="inputValue" 
      @input="handleInput" 
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      placeholder="请输入内容"
    />
    
    <!-- 触摸事件 -->
    <view 
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @longpress="handleLongPress"
    >
      触摸区域
    </view>
    
    <!-- 滚动事件 -->
    <scroll-view 
      scroll-y 
      @scroll="handleScroll"
      @scrolltolower="loadMore"
      @scrolltoupper="refresh"
    >
      <view v-for="item in list" :key="item.id">
        {{ item.name }}
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      list: [],
      touchStartX: 0,
      touchStartY: 0
    }
  },
  methods: {
    handleClick() {
      console.log('按钮被点击')
    },
    handleClickWithParam(param) {
      console.log('参数:', param)
    },
    handleClickWithEvent(event) {
      console.log('事件对象:', event)
    },
    parentClick() {
      console.log('父元素被点击')
    },
    childClick() {
      console.log('子元素被点击，不会冒泡')
    },
    handleInput(e) {
      console.log('输入值:', e.detail.value)
    },
    handleFocus() {
      console.log('获得焦点')
    },
    handleBlur() {
      console.log('失去焦点')
    },
    handleConfirm(e) {
      console.log('确认输入:', e.detail.value)
      // 搜索等操作
    },
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
    },
    handleTouchMove(e) {
      const moveX = e.touches[0].clientX - this.touchStartX
      const moveY = e.touches[0].clientY - this.touchStartY
      console.log('移动距离:', moveX, moveY)
    },
    handleTouchEnd() {
      console.log('触摸结束')
    },
    handleLongPress() {
      console.log('长按事件')
      uni.showActionSheet({
        itemList: ['删除', '编辑', '分享']
      })
    },
    handleScroll(e) {
      console.log('滚动位置:', e.detail.scrollTop)
    },
    loadMore() {
      console.log('加载更多')
      // 分页加载逻辑
    },
    refresh() {
      console.log('下拉刷新')
    }
  }
}
</script>
```

**使用场景**：用户交互、表单输入、滑动操作、下拉加载

### 2.5 表单处理

```vue
<template>
  <view class="form-container">
    <!-- 基础表单 -->
    <form @submit="handleSubmit" @reset="handleReset">
      <!-- 文本输入 -->
      <view class="form-item">
        <text class="label">用户名</text>
        <input 
          name="username"
          v-model="form.username" 
          placeholder="请输入用户名"
          maxlength="20"
        />
      </view>
      
      <!-- 密码输入 -->
      <view class="form-item">
        <text class="label">密码</text>
        <input 
          name="password"
          v-model="form.password" 
          type="password"
          placeholder="请输入密码"
        />
      </view>
      
      <!-- 手机号 -->
      <view class="form-item">
        <text class="label">手机号</text>
        <input 
          name="phone"
          v-model="form.phone" 
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
      
      <!-- 多行文本 -->
      <view class="form-item">
        <text class="label">简介</text>
        <textarea 
          name="intro"
          v-model="form.intro"
          placeholder="请输入简介"
          maxlength="200"
          :show-count="true"
        ></textarea>
      </view>
      
      <!-- 单选框 -->
      <view class="form-item">
        <text class="label">性别</text>
        <radio-group name="gender" @change="handleGenderChange">
          <radio value="male" :checked="form.gender === 'male'">男</radio>
          <radio value="female" :checked="form.gender === 'female'">女</radio>
        </radio-group>
      </view>
      
      <!-- 复选框 -->
      <view class="form-item">
        <text class="label">兴趣爱好</text>
        <checkbox-group name="hobbies" @change="handleHobbiesChange">
          <checkbox 
            v-for="item in hobbyOptions" 
            :key="item.value"
            :value="item.value"
            :checked="form.hobbies.includes(item.value)"
          >
            {{ item.label }}
          </checkbox>
        </checkbox-group>
      </view>
      
      <!-- 选择器 -->
      <view class="form-item">
        <text class="label">城市</text>
        <picker 
          mode="selector" 
          :range="cityOptions" 
          range-key="name"
          @change="handleCityChange"
        >
          <view>{{ selectedCity || '请选择城市' }}</view>
        </picker>
      </view>
      
      <!-- 日期选择器 -->
      <view class="form-item">
        <text class="label">生日</text>
        <picker 
          mode="date" 
          :value="form.birthday"
          :start="startDate"
          :end="endDate"
          @change="handleDateChange"
        >
          <view>{{ form.birthday || '请选择日期' }}</view>
        </picker>
      </view>
      
      <!-- 时间选择器 -->
      <view class="form-item">
        <text class="label">预约时间</text>
        <picker 
          mode="time"
          :value="form.appointTime"
          @change="handleTimeChange"
        >
          <view>{{ form.appointTime || '请选择时间' }}</view>
        </picker>
      </view>
      
      <!-- 多列选择器 -->
      <view class="form-item">
        <text class="label">地区</text>
        <picker 
          mode="multiSelector"
          :range="regionOptions"
          :value="regionIndex"
          @change="handleRegionChange"
          @columnchange="handleColumnChange"
        >
          <view>{{ selectedRegion || '请选择地区' }}</view>
        </picker>
      </view>
      
      <!-- 开关 -->
      <view class="form-item">
        <text class="label">接收通知</text>
        <switch 
          :checked="form.notification"
          @change="handleSwitchChange"
        />
      </view>
      
      <!-- 滑块 -->
      <view class="form-item">
        <text class="label">年龄：{{ form.age }}</text>
        <slider 
          :value="form.age"
          :min="18"
          :max="60"
          :show-value="true"
          @change="handleSliderChange"
        />
      </view>
      
      <!-- 提交按钮 -->
      <view class="form-buttons">
        <button type="primary" form-type="submit">提交</button>
        <button type="default" form-type="reset">重置</button>
      </view>
    </form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        phone: '',
        intro: '',
        gender: 'male',
        hobbies: [],
        city: '',
        birthday: '',
        appointTime: '',
        region: [],
        notification: true,
        age: 25
      },
      hobbyOptions: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' }
      ],
      cityOptions: [
        { id: 1, name: '北京' },
        { id: 2, name: '上海' },
        { id: 3, name: '广州' },
        { id: 4, name: '深圳' }
      ],
      selectedCity: '',
      startDate: '1950-01-01',
      endDate: '2010-12-31',
      regionOptions: [
        ['北京', '上海', '广东'],
        ['北京市', '上海市', '广州市'],
        ['东城区', '黄浦区', '天河区']
      ],
      regionIndex: [0, 0, 0],
      selectedRegion: ''
    }
  },
  methods: {
    handleGenderChange(e) {
      this.form.gender = e.detail.value
    },
    handleHobbiesChange(e) {
      this.form.hobbies = e.detail.value
    },
    handleCityChange(e) {
      const index = e.detail.value
      this.form.city = this.cityOptions[index].id
      this.selectedCity = this.cityOptions[index].name
    },
    handleDateChange(e) {
      this.form.birthday = e.detail.value
    },
    handleTimeChange(e) {
      this.form.appointTime = e.detail.value
    },
    handleRegionChange(e) {
      this.regionIndex = e.detail.value
      const province = this.regionOptions[0][this.regionIndex[0]]
      const city = this.regionOptions[1][this.regionIndex[1]]
      const district = this.regionOptions[2][this.regionIndex[2]]
      this.selectedRegion = `${province} ${city} ${district}`
      this.form.region = [province, city, district]
    },
    handleColumnChange(e) {
      // 联动更新下一列数据
      console.log('列变化:', e.detail)
    },
    handleSwitchChange(e) {
      this.form.notification = e.detail.value
    },
    handleSliderChange(e) {
      this.form.age = e.detail.value
    },
    handleSubmit(e) {
      // 表单验证
      if (!this.validateForm()) {
        return
      }
      
      console.log('提交表单:', this.form)
      
      // 提交到服务器
      uni.showLoading({ title: '提交中...' })
      
      // 模拟请求
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
      }, 1500)
    },
    handleReset() {
      this.form = {
        username: '',
        password: '',
        phone: '',
        intro: '',
        gender: 'male',
        hobbies: [],
        city: '',
        birthday: '',
        appointTime: '',
        region: [],
        notification: true,
        age: 25
      }
      this.selectedCity = ''
      this.selectedRegion = ''
    },
    validateForm() {
      if (!this.form.username) {
        uni.showToast({ title: '请输入用户名', icon: 'none' })
        return false
      }
      if (!this.form.password || this.form.password.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 20rpx;
}
.form-item {
  margin-bottom: 30rpx;
}
.label {
  display: block;
  margin-bottom: 10rpx;
  color: #333;
  font-size: 28rpx;
}
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}
.form-buttons button {
  width: 45%;
}
</style>
```

**使用场景**：用户注册、信息编辑、订单提交、预约表单

### 2.6 计算属性与侦听器

```vue
<template>
  <view class="container">
    <!-- 计算属性示例 -->
    <view class="cart">
      <view class="cart-item" v-for="item in cartList" :key="item.id">
        <text>{{ item.name }}</text>
        <text>¥{{ item.price }} x {{ item.count }}</text>
        <text>小计：¥{{ item.price * item.count }}</text>
      </view>
      <view class="total">
        <text>总计：¥{{ totalPrice }}</text>
        <text>优惠后：¥{{ discountedPrice }}</text>
      </view>
    </view>
    
    <!-- 搜索过滤 -->
    <input v-model="searchKey" placeholder="搜索商品" />
    <view v-for="item in filteredProducts" :key="item.id">
      {{ item.name }}
    </view>
    
    <!-- 侦听器示例 -->
    <picker mode="selector" :range="provinces" @change="handleProvinceChange">
      <view>省份：{{ selectedProvince }}</view>
    </picker>
    <picker mode="selector" :range="cities" @change="handleCityChange">
      <view>城市：{{ selectedCity }}</view>
    </picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartList: [
        { id: 1, name: '商品A', price: 100, count: 2 },
        { id: 2, name: '商品B', price: 200, count: 1 },
        { id: 3, name: '商品C', price: 50, count: 3 }
      ],
      discountRate: 0.8,
      searchKey: '',
      productList: [
        { id: 1, name: '苹果手机' },
        { id: 2, name: '华为手机' },
        { id: 3, name: '小米手机' }
      ],
      provinces: ['北京', '上海', '广东'],
      selectedProvince: '',
      cities: [],
      selectedCity: '',
      cityMap: {
        '北京': ['东城区', '西城区', '朝阳区'],
        '上海': ['黄浦区', '徐汇区', '静安区'],
        '广东': ['广州市', '深圳市', '东莞市']
      }
    }
  },
  computed: {
    // 计算购物车总价
    totalPrice() {
      return this.cartList.reduce((sum, item) => {
        return sum + item.price * item.count
      }, 0)
    },
    // 折扣价格
    discountedPrice() {
      return (this.totalPrice * this.discountRate).toFixed(2)
    },
    // 搜索过滤产品
    filteredProducts() {
      if (!this.searchKey) return this.productList
      return this.productList.filter(item => 
        item.name.toLowerCase().includes(this.searchKey.toLowerCase())
      )
    },
    // 格式化显示
    formattedCartList() {
      return this.cartList.map(item => ({
        ...item,
        subtotal: item.price * item.count,
        formattedPrice: `¥${item.price.toFixed(2)}`
      }))
    }
  },
  watch: {
    // 监听省份变化，更新城市列表
    selectedProvince: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.cities = this.cityMap[newVal] || []
          this.selectedCity = ''
        }
      },
      immediate: true
    },
    // 深度监听对象
    cartList: {
      handler(newVal) {
        console.log('购物车变化:', newVal)
        // 保存到本地存储
        uni.setStorageSync('cart', JSON.stringify(newVal))
      },
      deep: true
    },
    // 监听搜索关键词，防抖处理
    searchKey(newVal) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.doSearch(newVal)
      }, 300)
    }
  },
  methods: {
    handleProvinceChange(e) {
      this.selectedProvince = this.provinces[e.detail.value]
    },
    handleCityChange(e) {
      this.selectedCity = this.cities[e.detail.value]
    },
    doSearch(keyword) {
      console.log('执行搜索:', keyword)
      // 实际搜索逻辑
    }
  }
}
</script>
```

**使用场景**：购物车计算、数据过滤、联动选择、实时搜索

---

## 3. 组件系统

### 3.1 组件定义与注册

```vue
<!-- components/ProductCard/ProductCard.vue -->
<template>
  <view class="product-card" @click="handleClick">
    <image :src="product.image" mode="aspectFill" class="product-image"></image>
    <view class="product-info">
      <text class="product-name">{{ product.name }}</text>
      <text class="product-desc">{{ product.description }}</text>
      <view class="product-footer">
        <text class="product-price">¥{{ product.price }}</text>
        <text class="product-sales">销量：{{ product.sales }}</text>
      </view>
      <slot name="action"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        name: '',
        image: '',
        description: '',
        price: 0,
        sales: 0
      })
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.product)
    }
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
.product-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}
.product-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}
.product-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.product-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}
.product-footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}
.product-price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.product-sales {
  font-size: 24rpx;
  color: #999;
}
</style>
```

```vue
<!-- 使用组件 pages/index/index.vue -->
<template>
  <view class="container">
    <product-card 
      v-for="item in productList" 
      :key="item.id"
      :product="item"
      @click="handleProductClick"
    >
      <template v-slot:action>
        <button size="mini" @click.stop="addToCart(item)">加入购物车</button>
      </template>
    </product-card>
  </view>
</template>

<script>
import ProductCard from '@/components/ProductCard/ProductCard.vue'

export default {
  components: {
    ProductCard
  },
  data() {
    return {
      productList: []
    }
  },
  methods: {
    handleProductClick(product) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${product.id}`
      })
    },
    addToCart(product) {
      console.log('添加到购物车:', product)
    }
  }
}
</script>
```

### 3.2 组件通信

```vue
<!-- 父组件 -->
<template>
  <view>
    <!-- Props向下传递 -->
    <child-component 
      :message="parentMessage"
      :user-info="userInfo"
      @update="handleUpdate"
      @custom-event="handleCustomEvent"
      ref="childRef"
    />
    
    <button @click="callChildMethod">调用子组件方法</button>
  </view>
</template>

<script>
import ChildComponent from '@/components/ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  data() {
    return {
      parentMessage: '来自父组件的消息',
      userInfo: {
        name: '张三',
        age: 25
      }
    }
  },
  methods: {
    handleUpdate(data) {
      console.log('子组件更新事件:', data)
    },
    handleCustomEvent(payload) {
      console.log('自定义事件:', payload)
    },
    callChildMethod() {
      this.$refs.childRef.childMethod('参数')
    }
  }
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <view>
    <text>{{ message }}</text>
    <text>{{ userInfo.name }}</text>
    <button @click="updateParent">通知父组件</button>
  </view>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    updateParent() {
      this.$emit('update', { newValue: '新值' })
      this.$emit('custom-event', { type: 'click', data: 'some data' })
    },
    childMethod(param) {
      console.log('子组件方法被调用:', param)
    }
  }
}
</script>
```

### 3.3 全局组件注册

```javascript
// main.js
import Vue from 'vue'
import App from './App'

// 全局组件注册
import Loading from '@/components/Loading/Loading.vue'
import Empty from '@/components/Empty/Empty.vue'
import NavBar from '@/components/NavBar/NavBar.vue'

Vue.component('Loading', Loading)
Vue.component('Empty', Empty)
Vue.component('NavBar', NavBar)

// 全局过滤器
Vue.filter('formatPrice', (value) => {
  return '¥' + parseFloat(value).toFixed(2)
})

Vue.filter('formatDate', (value, format = 'YYYY-MM-DD') => {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
})

// 全局混入
Vue.mixin({
  methods: {
    // 全局方法
    $showLoading(title = '加载中...') {
      uni.showLoading({ title, mask: true })
    },
    $hideLoading() {
      uni.hideLoading()
    },
    $toast(title, icon = 'none') {
      uni.showToast({ title, icon })
    }
  }
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
```

### 3.4 Mixins混入

```javascript
// mixins/pageMixin.js
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      dataList: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    // 加载数据
    async loadData(isRefresh = false) {
      if (this.loading) return
      if (this.finished && !isRefresh) return
      
      this.loading = true
      if (isRefresh) {
        this.pageNum = 1
        this.finished = false
      }
      
      try {
        const res = await this.fetchData()
        const list = res.data || []
        
        if (isRefresh) {
          this.dataList = list
        } else {
          this.dataList = [...this.dataList, ...list]
        }
        
        if (list.length < this.pageSize) {
          this.finished = true
        } else {
          this.pageNum++
        }
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },
    
    // 需要在组件中实现
    fetchData() {
      throw new Error('请实现 fetchData 方法')
    }
  },
  onPullDownRefresh() {
    this.loadData(true)
  },
  onReachBottom() {
    this.loadData()
  }
}
```

```vue
<!-- 使用混入 -->
<template>
  <view>
    <view v-for="item in dataList" :key="item.id">
      {{ item.name }}
    </view>
    <view v-if="loading">加载中...</view>
    <view v-if="finished">没有更多了</view>
  </view>
</template>

<script>
import pageMixin from '@/mixins/pageMixin.js'
import { getProductList } from '@/api/product.js'

export default {
  mixins: [pageMixin],
  onLoad() {
    this.loadData()
  },
  methods: {
    async fetchData() {
      return await getProductList({
        page: this.pageNum,
        size: this.pageSize
      })
    }
  }
}
</script>
```

---

## 4. 生命周期

### 4.1 应用生命周期

```javascript
// App.vue
<script>
export default {
  // 应用初始化完成时触发（全局只触发一次）
  onLaunch(options) {
    console.log('App Launch', options)
    
    // 获取启动参数
    console.log('启动场景:', options.scene)
    console.log('启动路径:', options.path)
    console.log('启动参数:', options.query)
    
    // 检查更新
    this.checkUpdate()
    
    // 初始化全局数据
    this.initGlobalData()
    
    // 登录检查
    this.checkLogin()
  },
  
  // 应用从后台进入前台
  onShow(options) {
    console.log('App Show', options)
    
    // 刷新token等操作
    this.refreshToken()
  },
  
  // 应用从前台进入后台
  onHide() {
    console.log('App Hide')
    
    // 保存临时数据
    this.saveData()
  },
  
  // 应用出错时触发
  onError(error) {
    console.error('App Error:', error)
    
    // 上报错误日志
    this.reportError(error)
  },
  
  // 页面不存在时触发
  onPageNotFound(options) {
    console.log('Page Not Found:', options)
    
    // 跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  },
  
  // 未处理的Promise拒绝
  onUnhandledRejection(event) {
    console.error('Unhandled Rejection:', event)
  },
  
  methods: {
    checkUpdate() {
      // #ifdef MP-WEIXIN
      const updateManager = uni.getUpdateManager()
      
      updateManager.onCheckForUpdate((res) => {
        console.log('是否有新版本:', res.hasUpdate)
      })
      
      updateManager.onUpdateReady(() => {
        uni.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      
      updateManager.onUpdateFailed(() => {
        uni.showToast({
          title: '更新失败，请稍后重试',
          icon: 'none'
        })
      })
      // #endif
    },
    
    initGlobalData() {
      // 初始化全局数据
      this.globalData = {
        userInfo: null,
        systemInfo: uni.getSystemInfoSync(),
        version: '1.0.0'
      }
    },
    
    checkLogin() {
      const token = uni.getStorageSync('token')
      if (!token) {
        // 未登录处理
      }
    },
    
    refreshToken() {
      // 刷新token逻辑
    },
    
    saveData() {
      // 保存数据逻辑
    },
    
    reportError(error) {
      // 错误上报逻辑
    }
  },
  
  globalData: {
    userInfo: null,
    systemInfo: null,
    version: '1.0.0'
  }
}
</script>
```

### 4.2 页面生命周期

```vue
<template>
  <view class="page">
    <text>页面内容</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageData: null
    }
  },
  
  // ========== 页面生命周期 ==========
  
  // 页面加载时触发，参数为页面跳转所带参数
  onLoad(options) {
    console.log('onLoad', options)
    // 获取页面参数
    const { id, type } = options
    this.loadPageData(id)
  },
  
  // 页面显示时触发
  onShow() {
    console.log('onShow')
    // 页面可见时的操作，如刷新数据
  },
  
  // 页面初次渲染完成时触发
  onReady() {
    console.log('onReady')
    // DOM已渲染，可以操作节点
    this.initChart()
  },
  
  // 页面隐藏时触发
  onHide() {
    console.log('onHide')
    // 页面不可见时的清理操作
  },
  
  // 页面卸载时触发
  onUnload() {
    console.log('onUnload')
    // 清理定时器、事件监听等
    clearInterval(this.timer)
  },
  
  // ========== 页面事件处理 ==========
  
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreshData().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  
  // 上拉触底
  onReachBottom() {
    console.log('触底加载')
    this.loadMore()
  },
  
  // 页面滚动
  onPageScroll(e) {
    console.log('滚动位置:', e.scrollTop)
    // 判断是否显示返回顶部按钮
    this.showBackTop = e.scrollTop > 300
  },
  
  // 用户点击分享
  onShareAppMessage(options) {
    console.log('分享来源:', options.from)
    return {
      title: '分享标题',
      path: '/pages/index/index?id=1',
      imageUrl: '/static/share.png'
    }
  },
  
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '分享到朋友圈',
      query: 'id=1',
      imageUrl: '/static/share.png'
    }
  },
  
  // 用户点击右上角收藏
  onAddToFavorites() {
    return {
      title: '收藏标题',
      imageUrl: '/static/favorite.png',
      query: 'id=1'
    }
  },
  
  // 页面尺寸变化（横竖屏切换）
  onResize(e) {
    console.log('页面尺寸变化:', e.size)
  },
  
  // 点击TabBar
  onTabItemTap(e) {
    console.log('点击TabBar:', e)
    // e.index: 被点击tabItem的序号
    // e.pagePath: 被点击tabItem的页面路径
    // e.text: 被点击tabItem的按钮文字
  },
  
  // 监听页面返回
  onBackPress(e) {
    console.log('返回按钮点击:', e)
    // 返回 true 则阻止默认返回行为
    if (this.hasUnsavedChanges) {
      uni.showModal({
        title: '提示',
        content: '有未保存的更改，确定离开吗？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack()
          }
        }
      })
      return true
    }
    return false
  },
  
  // 监听键盘高度变化
  onKeyboardHeightChange(e) {
    console.log('键盘高度:', e.height)
    this.keyboardHeight = e.height
  },
  
  // ========== Vue生命周期 ==========
  
  beforeCreate() {
    console.log('beforeCreate')
  },
  
  created() {
    console.log('created')
    // 可以访问data，但不能操作DOM
  },
  
  beforeMount() {
    console.log('beforeMount')
  },
  
  mounted() {
    console.log('mounted')
    // DOM已挂载
  },
  
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  
  updated() {
    console.log('updated')
  },
  
  beforeDestroy() {
    console.log('beforeDestroy')
    // 清理工作
  },
  
  destroyed() {
    console.log('destroyed')
  },
  
  methods: {
    loadPageData(id) {
      // 加载页面数据
    },
    initChart() {
      // 初始化图表
    },
    async refreshData() {
      // 刷新数据
    },
    loadMore() {
      // 加载更多
    }
  }
}
</script>
```

### 4.3 组件生命周期

```vue
<template>
  <view class="component">
    <text>{{ content }}</text>
  </view>
</template>

<script>
export default {
  name: 'MyComponent',
  
  props: {
    content: String
  },
  
  data() {
    return {
      localData: ''
    }
  },
  
  // 组件生命周期
  beforeCreate() {
    // 实例初始化之后，数据观测和事件配置之前
    console.log('Component beforeCreate')
  },
  
  created() {
    // 实例创建完成，可访问data和methods
    console.log('Component created')
    this.initData()
  },
  
  beforeMount() {
    // 挂载之前
    console.log('Component beforeMount')
  },
  
  mounted() {
    // 挂载完成，可访问DOM
    console.log('Component mounted')
    this.bindEvents()
  },
  
  beforeUpdate() {
    // 数据更新，DOM重新渲染之前
    console.log('Component beforeUpdate')
  },
  
  updated() {
    // DOM重新渲染完成
    console.log('Component updated')
  },
  
  beforeDestroy() {
    // 实例销毁之前
    console.log('Component beforeDestroy')
    this.cleanup()
  },
  
  destroyed() {
    // 实例销毁完成
    console.log('Component destroyed')
  },
  
  // 激活/停用（keep-alive）
  activated() {
    console.log('Component activated')
  },
  
  deactivated() {
    console.log('Component deactivated')
  },
  
  methods: {
    initData() {
      // 初始化数据
    },
    bindEvents() {
      // 绑定事件
    },
    cleanup() {
      // 清理资源
    }
  }
}
</script>
```

---

## 5. 路由与页面跳转

### 5.1 基础跳转方法

```javascript
// 跳转到普通页面
uni.navigateTo({
  url: '/pages/detail/detail?id=1&name=test',
  animationType: 'pop-in',
  animationDuration: 300,
  success: (res) => {
    // 向被打开页面传送数据
    res.eventChannel.emit('passData', { data: 'from parent' })
  },
  fail: (err) => {
    console.error('跳转失败:', err)
  },
  complete: () => {
    console.log('跳转完成')
  }
})

// 重定向（关闭当前页）
uni.redirectTo({
  url: '/pages/result/result'
})

// 跳转到TabBar页面
uni.switchTab({
  url: '/pages/index/index'
})

// 关闭所有页面，跳转到指定页面
uni.reLaunch({
  url: '/pages/login/login'
})

// 返回上一页
uni.navigateBack({
  delta: 1, // 返回的页面数
  animationType: 'pop-out',
  animationDuration: 300
})
```

### 5.2 页面间通信

```vue
<!-- 页面A -->
<template>
  <view>
    <button @click="goToPageB">跳转到页面B</button>
  </view>
</template>

<script>
export default {
  methods: {
    goToPageB() {
      uni.navigateTo({
        url: '/pages/pageB/pageB',
        events: {
          // 监听页面B返回的数据
          returnData: (data) => {
            console.log('页面B返回的数据:', data)
          }
        },
        success: (res) => {
          // 通过eventChannel向页面B传递数据
          res.eventChannel.emit('passData', {
            data: '从页面A传递的数据'
          })
        }
      })
    }
  }
}
</script>
```

```vue
<!-- 页面B -->
<template>
  <view>
    <text>{{ receivedData }}</text>
    <button @click="goBack">返回并传递数据</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      receivedData: ''
    }
  },
  onLoad() {
    // 获取eventChannel
    const eventChannel = this.getOpenerEventChannel()
    
    // 监听页面A传递的数据
    eventChannel.on('passData', (data) => {
      console.log('收到页面A的数据:', data)
      this.receivedData = data.data
    })
  },
  methods: {
    goBack() {
      // 获取eventChannel
      const eventChannel = this.getOpenerEventChannel()
      
      // 向页面A返回数据
      eventChannel.emit('returnData', {
        result: '页面B处理后的结果'
      })
      
      // 返回上一页
      uni.navigateBack()
    }
  }
}
</script>
```

### 5.3 全局事件通信

```javascript
// 发送事件
uni.$emit('userLogin', {
  userId: 123,
  userName: '张三'
})

// 监听事件
uni.$on('userLogin', (data) => {
  console.log('用户登录:', data)
})

// 监听一次
uni.$once('userLogin', (data) => {
  console.log('只触发一次')
})

// 移除监听
uni.$off('userLogin')

// 移除所有监听
uni.$off()
```

### 5.4 路由拦截（自定义封装）

```javascript
// utils/router.js
const whiteList = ['/pages/login/login', '/pages/index/index']

// 需要登录的页面
const needLoginPages = ['/pages/user/user', '/pages/order/order']

// 跳转拦截
function navigateTo(options) {
  const url = options.url.split('?')[0]
  
  // 检查是否需要登录
  if (needLoginPages.includes(url)) {
    const token = uni.getStorageSync('token')
    if (!token) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      uni.navigateTo({
        url: `/pages/login/login?redirect=${encodeURIComponent(options.url)}`
      })
      return
    }
  }
  
  // 正常跳转
  uni.navigateTo(options)
}

function redirectTo(options) {
  uni.redirectTo(options)
}

function switchTab(options) {
  uni.switchTab(options)
}

function reLaunch(options) {
  uni.reLaunch(options)
}

function navigateBack(options = {}) {
  uni.navigateBack(options)
}

export default {
  push: navigateTo,
  replace: redirectTo,
  switchTab,
  reLaunch,
  back: navigateBack
}
```

```javascript
// 使用封装的路由
import router from '@/utils/router.js'

router.push({
  url: '/pages/detail/detail?id=1'
})

router.replace({
  url: '/pages/result/result'
})

router.switchTab({
  url: '/pages/index/index'
})

router.back()
```

---

## 6. 数据请求与API调用

### 6.1 基础请求封装

```javascript
// utils/request.js
const BASE_URL = 'https://api.example.com'

// 请求队列（用于处理并发token刷新）
let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(token) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// 请求拦截
function requestInterceptor(config) {
  // 添加token
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  // 添加公共参数
  config.header['Content-Type'] = 'application/json'
  config.header['X-Platform'] = 'miniprogram'
  
  return config
}

// 响应拦截
function responseInterceptor(response, config) {
  const { statusCode, data } = response
  
  // HTTP状态码处理
  if (statusCode === 200) {
    // 业务状态码处理
    if (data.code === 0 || data.code === 200) {
      return data.data
    } else if (data.code === 401) {
      // token过期
      return handleTokenExpired(config)
    } else {
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }
  } else if (statusCode === 401) {
    return handleTokenExpired(config)
  } else if (statusCode === 403) {
    uni.showToast({
      title: '没有权限',
      icon: 'none'
    })
    return Promise.reject(new Error('没有权限'))
  } else if (statusCode === 404) {
    uni.showToast({
      title: '请求资源不存在',
      icon: 'none'
    })
    return Promise.reject(new Error('资源不存在'))
  } else if (statusCode >= 500) {
    uni.showToast({
      title: '服务器错误',
      icon: 'none'
    })
    return Promise.reject(new Error('服务器错误'))
  }
  
  return Promise.reject(response)
}

// 处理token过期
async function handleTokenExpired(config) {
  if (!isRefreshing) {
    isRefreshing = true
    
    try {
      const refreshToken = uni.getStorageSync('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token')
      }
      
      // 刷新token
      const res = await refreshTokenAPI(refreshToken)
      const newToken = res.token
      
      uni.setStorageSync('token', newToken)
      onTokenRefreshed(newToken)
      
      // 重试当前请求
      config.header.Authorization = `Bearer ${newToken}`
      return request(config)
    } catch (error) {
      // 刷新失败，跳转登录
      uni.removeStorageSync('token')
      uni.removeStorageSync('refreshToken')
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }, 1500)
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  } else {
    // 等待token刷新完成
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        config.header.Authorization = `Bearer ${token}`
        resolve(request(config))
      })
    })
  }
}

// 刷新token API
function refreshTokenAPI(refreshToken) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/auth/refresh`,
      method: 'POST',
      data: { refreshToken },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data)
        } else {
          reject(new Error('Refresh token failed'))
        }
      },
      fail: reject
    })
  })
}

// 主请求函数
function request(options) {
  // 应用请求拦截器
  const config = requestInterceptor({
    url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: options.header || {},
    timeout: options.timeout || 30000
  })
  
  return new Promise((resolve, reject) => {
    // 显示加载
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    uni.request({
      ...config,
      success: (res) => {
        responseInterceptor(res, config)
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        if (options.loading !== false) {
          uni.hideLoading()
        }
      }
    })
  })
}

// 快捷方法
export function get(url, params = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data: params,
    ...options
  })
}

export function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

export function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

export function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

export default request
```

### 6.2 API模块化

```javascript
// api/user.js
import { get, post } from '@/utils/request.js'

// 用户登录
export function login(data) {
  return post('/user/login', data)
}

// 获取用户信息
export function getUserInfo() {
  return get('/user/info')
}

// 更新用户信息
export function updateUserInfo(data) {
  return post('/user/update', data)
}

// 获取用户订单
export function getUserOrders(params) {
  return get('/user/orders', params)
}
```

```javascript
// api/product.js
import { get, post } from '@/utils/request.js'

// 获取商品列表
export function getProductList(params) {
  return get('/product/list', params)
}

// 获取商品详情
export function getProductDetail(id) {
  return get(`/product/detail/${id}`)
}

// 搜索商品
export function searchProducts(keyword, params = {}) {
  return get('/product/search', { keyword, ...params })
}
```

### 6.3 页面中使用

```vue
<template>
  <view>
    <view v-for="item in productList" :key="item.id">
      {{ item.name }}
    </view>
  </view>
</template>

<script>
import { getProductList } from '@/api/product.js'

export default {
  data() {
    return {
      productList: [],
      loading: false,
      page: 1,
      pageSize: 10
    }
  },
  onLoad() {
    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      if (this.loading) return
      this.loading = true
      
      try {
        const res = await getProductList({
          page: this.page,
          pageSize: this.pageSize
        })
        this.productList = res.list
      } catch (error) {
        console.error('加载失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

### 6.4 文件上传

```javascript
// utils/upload.js
const BASE_URL = 'https://api.example.com'

export function uploadFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    
    uni.showLoading({ title: '上传中...' })
    
    const uploadTask = uni.uploadFile({
      url: options.url || `${BASE_URL}/upload`,
      filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          if (data.code === 0) {
            resolve(data.data)
          } else {
            reject(new Error(data.message))
          }
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
    
    // 上传进度
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度:', res.progress)
      if (options.onProgress) {
        options.onProgress(res)
      }
    })
  })
}

// 选择并上传图片
export function chooseAndUploadImage(options = {}) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: options.count || 1,
      sizeType: options.sizeType || ['compressed'],
      sourceType: options.sourceType || ['album', 'camera'],
      success: async (res) => {
        try {
          const urls = []
          for (const filePath of res.tempFilePaths) {
            const result = await uploadFile(filePath, options)
            urls.push(result.url)
          }
          resolve(urls)
        } catch (error) {
          reject(error)
        }
      },
      fail: reject
    })
  })
}
```

---

## 7. 状态管理Vuex

### 7.1 Store配置

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user.js'
import cart from './modules/cart.js'
import app from './modules/app.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart,
    app
  },
  // 严格模式（开发环境）
  strict: process.env.NODE_ENV !== 'production'
})
```

### 7.2 用户模块

```javascript
// store/modules/user.js
const state = {
  token: uni.getStorageSync('token') || '',
  userInfo: uni.getStorageSync('userInfo') || null,
  isLogin: !!uni.getStorageSync('token')
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    state.isLogin = !!token
    if (token) {
      uni.setStorageSync('token', token)
    } else {
      uni.removeStorageSync('token')
    }
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    if (userInfo) {
      uni.setStorageSync('userInfo', userInfo)
    } else {
      uni.removeStorageSync('userInfo')
    }
  }
}

const actions = {
  // 登录
  async login({ commit }, loginData) {
    try {
      // 调用登录API
      const res = await uni.$http.post('/user/login', loginData)
      
      commit('SET_TOKEN', res.token)
      commit('SET_USER_INFO', res.userInfo)
      
      return res
    } catch (error) {
      throw error
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit, state }) {
    if (!state.token) return null
    
    try {
      const res = await uni.$http.get('/user/info')
      commit('SET_USER_INFO', res)
      return res
    } catch (error) {
      throw error
    }
  },
  
  // 退出登录
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_USER_INFO', null)
    
    // 清除其他缓存
    uni.clearStorageSync()
    
    // 跳转到登录页
    uni.reLaunch({
      url: '/pages/login/login'
    })
  },
  
  // 微信登录
  async wxLogin({ commit }) {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            // 发送code到后端
            const res = await uni.$http.post('/user/wx-login', {
              code: loginRes.code
            })
            
            commit('SET_TOKEN', res.token)
            commit('SET_USER_INFO', res.userInfo)
            
            resolve(res)
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
}

const getters = {
  isLogin: state => state.isLogin,
  token: state => state.token,
  userInfo: state => state.userInfo,
  userId: state => state.userInfo?.id,
  userName: state => state.userInfo?.name || '未登录'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

### 7.3 购物车模块

```javascript
// store/modules/cart.js
const state = {
  cartList: uni.getStorageSync('cartList') || []
}

const mutations = {
  // 添加商品
  ADD_TO_CART(state, product) {
    const existItem = state.cartList.find(item => item.id === product.id)
    if (existItem) {
      existItem.count++
    } else {
      state.cartList.push({
        ...product,
        count: 1,
        selected: true
      })
    }
    uni.setStorageSync('cartList', state.cartList)
  },
  
  // 移除商品
  REMOVE_FROM_CART(state, productId) {
    const index = state.cartList.findIndex(item => item.id === productId)
    if (index > -1) {
      state.cartList.splice(index, 1)
      uni.setStorageSync('cartList', state.cartList)
    }
  },
  
  // 更新数量
  UPDATE_CART_COUNT(state, { productId, count }) {
    const item = state.cartList.find(item => item.id === productId)
    if (item) {
      item.count = count
      if (item.count <= 0) {
        const index = state.cartList.indexOf(item)
        state.cartList.splice(index, 1)
      }
      uni.setStorageSync('cartList', state.cartList)
    }
  },
  
  // 切换选中状态
  TOGGLE_SELECT(state, productId) {
    const item = state.cartList.find(item => item.id === productId)
    if (item) {
      item.selected = !item.selected
      uni.setStorageSync('cartList', state.cartList)
    }
  },
  
  // 全选/取消全选
  TOGGLE_SELECT_ALL(state, selected) {
    state.cartList.forEach(item => {
      item.selected = selected
    })
    uni.setStorageSync('cartList', state.cartList)
  },
  
  // 清空购物车
  CLEAR_CART(state) {
    state.cartList = []
    uni.removeStorageSync('cartList')
  }
}

const actions = {
  addToCart({ commit }, product) {
    commit('ADD_TO_CART', product)
    uni.showToast({
      title: '已添加到购物车',
      icon: 'success'
    })
  },
  
  removeFromCart({ commit }, productId) {
    uni.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          commit('REMOVE_FROM_CART', productId)
        }
      }
    })
  },
  
  updateCount({ commit }, payload) {
    commit('UPDATE_CART_COUNT', payload)
  },
  
  toggleSelect({ commit }, productId) {
    commit('TOGGLE_SELECT', productId)
  },
  
  toggleSelectAll({ commit, getters }) {
    const allSelected = getters.isAllSelected
    commit('TOGGLE_SELECT_ALL', !allSelected)
  },
  
  clearCart({ commit }) {
    commit('CLEAR_CART')
  }
}

const getters = {
  // 购物车列表
  cartList: state => state.cartList,
  
  // 购物车数量
  cartCount: state => {
    return state.cartList.reduce((sum, item) => sum + item.count, 0)
  },
  
  // 选中的商品
  selectedItems: state => {
    return state.cartList.filter(item => item.selected)
  },
  
  // 选中商品总价
  totalPrice: (state, getters) => {
    return getters.selectedItems.reduce((sum, item) => {
      return sum + item.price * item.count
    }, 0)
  },
  
  // 是否全选
  isAllSelected: state => {
    if (state.cartList.length === 0) return false
    return state.cartList.every(item => item.selected)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

### 7.4 页面中使用

```vue
<template>
  <view class="cart-page">
    <!-- 购物车列表 -->
    <view class="cart-list">
      <view 
        class="cart-item" 
        v-for="item in cartList" 
        :key="item.id"
      >
        <checkbox 
          :checked="item.selected" 
          @click="toggleSelect(item.id)"
        />
        <image :src="item.image" mode="aspectFill"></image>
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="price">¥{{ item.price }}</text>
        </view>
        <view class="counter">
          <button @click="changeCount(item.id, -1)">-</button>
          <text>{{ item.count }}</text>
          <button @click="changeCount(item.id, 1)">+</button>
        </view>
        <text class="delete" @click="removeItem(item.id)">删除</text>
      </view>
    </view>
    
    <!-- 底部结算栏 -->
    <view class="cart-footer">
      <view class="select-all" @click="handleSelectAll">
        <checkbox :checked="isAllSelected" />
        <text>全选</text>
      </view>
      <view class="total">
        <text>合计：</text>
        <text class="price">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <button class="checkout-btn" @click="checkout">
        结算({{ selectedCount }})
      </button>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', [
      'cartCount',
      'selectedItems',
      'totalPrice',
      'isAllSelected'
    ]),
    ...mapGetters('user', ['isLogin']),
    selectedCount() {
      return this.selectedItems.length
    }
  },
  methods: {
    ...mapActions('cart', [
      'addToCart',
      'removeFromCart',
      'updateCount',
      'toggleSelect',
      'toggleSelectAll',
      'clearCart'
    ]),
    
    changeCount(productId, delta) {
      const item = this.cartList.find(i => i.id === productId)
      if (item) {
        const newCount = item.count + delta
        if (newCount <= 0) {
          this.removeFromCart(productId)
        } else {
          this.updateCount({ productId, count: newCount })
        }
      }
    },
    
    removeItem(productId) {
      this.removeFromCart(productId)
    },
    
    handleSelectAll() {
      this.toggleSelectAll()
    },
    
    checkout() {
      if (!this.isLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      
      if (this.selectedItems.length === 0) {
        uni.showToast({
          title: '请选择商品',
          icon: 'none'
        })
        return
      }
      
      // 跳转到结算页
      uni.navigateTo({
        url: '/pages/checkout/checkout'
      })
    }
  }
}
</script>
```

### 7.5 在main.js中注册Store

```javascript
// main.js
import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
```

---

## 8. 条件编译与多端适配

### 8.1 条件编译语法

```vue
<template>
  <view>
    <!-- 模板中的条件编译 -->
    
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="share">微信分享</button>
    <button open-type="contact">联系客服</button>
    <!-- #endif -->
    
    <!-- #ifdef MP-DINGTALK -->
    <button @click="dingShare">钉钉分享</button>
    <!-- #endif -->
    
    <!-- #ifndef MP-WEIXIN -->
    <text>这在微信小程序中不显示</text>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN || MP-DINGTALK -->
    <text>微信和钉钉都显示</text>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      // #ifdef MP-WEIXIN
      platform: 'weixin',
      // #endif
      
      // #ifdef MP-DINGTALK
      platform: 'dingtalk',
      // #endif
      
      // #ifdef H5
      platform: 'h5',
      // #endif
    }
  },
  methods: {
    // #ifdef MP-WEIXIN
    wxLogin() {
      uni.login({
        provider: 'weixin',
        success: (res) => {
          console.log('微信登录code:', res.code)
        }
      })
    },
    // #endif
    
    // #ifdef MP-DINGTALK
    dingLogin() {
      dd.getAuthCode({
        success: (res) => {
          console.log('钉钉授权码:', res.authCode)
        }
      })
    },
    
    dingShare() {
      dd.share({
        type: 0,
        url: 'https://example.com',
        title: '分享标题',
        content: '分享内容'
      })
    },
    // #endif
    
    // 通用方法
    commonMethod() {
      // #ifdef MP-WEIXIN
      // 微信特有逻辑
      console.log('微信端执行')
      // #endif
      
      // #ifdef MP-DINGTALK
      // 钉钉特有逻辑
      console.log('钉钉端执行')
      // #endif
      
      // 通用逻辑
      console.log('所有端都执行')
    }
  }
}
</script>

<style>
/* 样式中的条件编译 */

/* #ifdef MP-WEIXIN */
.container {
  background-color: #07c160;
}
/* #endif */

/* #ifdef MP-DINGTALK */
.container {
  background-color: #3296fa;
}
/* #endif */
</style>
```

### 8.2 平台判断工具

```javascript
// utils/platform.js
export const platform = {
  // 是否微信小程序
  isWeixin: false,
  // 是否钉钉小程序
  isDingtalk: false,
  // 是否H5
  isH5: false,
  // 是否App
  isApp: false
}

// #ifdef MP-WEIXIN
platform.isWeixin = true
// #endif

// #ifdef MP-DINGTALK
platform.isDingtalk = true
// #endif

// #ifdef H5
platform.isH5 = true
// #endif

// #ifdef APP-PLUS
platform.isApp = true
// #endif

// 获取平台名称
export function getPlatformName() {
  // #ifdef MP-WEIXIN
  return 'weixin'
  // #endif
  
  // #ifdef MP-DINGTALK
  return 'dingtalk'
  // #endif
  
  // #ifdef H5
  return 'h5'
  // #endif
  
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  
  return 'unknown'
}

// 执行平台特定代码
export function runOnPlatform(handlers) {
  const platformName = getPlatformName()
  if (handlers[platformName]) {
    return handlers[platformName]()
  }
  if (handlers.default) {
    return handlers.default()
  }
}

export default platform
```

### 8.3 多端适配工具类

```javascript
// utils/adapter.js

// 登录适配
export function login() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: (res) => {
        resolve({ platform: 'weixin', code: res.code })
      },
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.getAuthCode({
      success: (res) => {
        resolve({ platform: 'dingtalk', code: res.authCode })
      },
      fail: reject
    })
    // #endif
    
    // #ifdef H5
    // H5登录逻辑
    resolve({ platform: 'h5', code: null })
    // #endif
  })
}

// 获取用户信息适配
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        resolve({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender
        })
      },
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.getPhoneNumber({
      success: (res) => {
        resolve({
          phone: res.phone
        })
      },
      fail: reject
    })
    // #endif
  })
}

// 分享适配
export function share(options) {
  // #ifdef MP-WEIXIN
  // 微信分享通过onShareAppMessage实现
  return Promise.resolve()
  // #endif
  
  // #ifdef MP-DINGTALK
  return new Promise((resolve, reject) => {
    dd.share({
      type: 0,
      url: options.url,
      title: options.title,
      content: options.content,
      image: options.imageUrl,
      success: resolve,
      fail: reject
    })
  })
  // #endif
}

// 支付适配
export function pay(orderInfo) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.requestPayment({
      provider: 'wxpay',
      ...orderInfo,
      success: resolve,
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.tradePay({
      tradeNO: orderInfo.tradeNO,
      success: resolve,
      fail: reject
    })
    // #endif
  })
}

// 扫码适配
export function scanCode() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.scanCode({
      success: (res) => {
        resolve(res.result)
      },
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.scan({
      type: 'qr',
      success: (res) => {
        resolve(res.text)
      },
      fail: reject
    })
    // #endif
  })
}

// 获取定位适配
export function getLocation() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address
        })
      },
      fail: reject
    })
    // #endif
    
    // #ifdef MP-DINGTALK
    dd.getLocation({
      targetAccuracy: 200,
      coordinate: 1,
      withReGeocode: true,
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address
        })
      },
      fail: reject
    })
    // #endif
  })
}
```

---

## 9. 微信小程序特有API

### 9.1 微信登录与用户信息

```vue
<template>
  <view class="login-page">
    <!-- 获取手机号 -->
    <button 
      open-type="getPhoneNumber" 
      @getphonenumber="handleGetPhoneNumber"
    >
      手机号快捷登录
    </button>
    
    <!-- 获取用户头像昵称 -->
    <button @click="getUserProfile">获取用户信息</button>
    
    <!-- 头像昵称填写 -->
    <button open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
      选择头像
    </button>
    <input 
      type="nickname" 
      placeholder="请输入昵称"
      @blur="handleNicknameBlur"
    />
    
    <!-- 客服 -->
    <button open-type="contact">联系客服</button>
    
    <!-- 分享 -->
    <button open-type="share">分享给好友</button>
    
    <!-- 反馈 -->
    <button open-type="feedback">意见反馈</button>
    
    <!-- 打开设置 -->
    <button open-type="openSetting">打开设置</button>
  </view>
</template>

<script>
export default {
  methods: {
    // 微信登录
    async wxLogin() {
      try {
        // 获取登录凭证
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          })
        })
        
        console.log('login code:', loginRes.code)
        
        // 发送code到后端换取openid/session_key
        const res = await this.$http.post('/wx/login', {
          code: loginRes.code
        })
        
        // 保存token
        uni.setStorageSync('token', res.token)
        
        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    
    // 获取用户信息（新版本）
    getUserProfile() {
      uni.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          console.log('用户信息:', res.userInfo)
          this.userInfo = res.userInfo
        },
        fail: (err) => {
          console.error('获取失败:', err)
        }
      })
    },
    
    // 获取手机号
    handleGetPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        // 发送到后端解密
        this.$http.post('/wx/phone', {
          code: e.detail.code
        }).then(res => {
          console.log('手机号:', res.phone)
        })
      } else {
        uni.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
      }
    },
    
    // 选择头像
    handleChooseAvatar(e) {
      const avatarUrl = e.detail.avatarUrl
      console.log('头像临时路径:', avatarUrl)
      
      // 上传头像到服务器
      uni.uploadFile({
        url: 'https://api.example.com/upload',
        filePath: avatarUrl,
        name: 'file',
        success: (res) => {
          const data = JSON.parse(res.data)
          this.avatarUrl = data.url
        }
      })
    },
    
    // 昵称输入完成
    handleNicknameBlur(e) {
      this.nickname = e.detail.value
    },
    
    // 检查登录状态
    checkSession() {
      uni.checkSession({
        success: () => {
          console.log('session有效')
        },
        fail: () => {
          console.log('session过期，需要重新登录')
          this.wxLogin()
        }
      })
    }
  },
  
  // 分享给好友
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index?from=share',
      imageUrl: '/static/share.png'
    }
  },
  
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '朋友圈分享标题',
      query: 'from=timeline',
      imageUrl: '/static/share.png'
    }
  }
}
</script>
```

### 9.2 微信支付

```javascript
// utils/wxPay.js
export async function wxPay(orderInfo) {
  try {
    // 1. 创建订单，获取支付参数
    const payParams = await uni.$http.post('/order/create', orderInfo)
    
    // 2. 调起微信支付
    return new Promise((resolve, reject) => {
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: (res) => {
          console.log('支付成功:', res)
          resolve(res)
        },
        fail: (err) => {
          if (err.errMsg === 'requestPayment:fail cancel') {
            uni.showToast({
              title: '支付已取消',
              icon: 'none'
            })
          } else {
            uni.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
          reject(err)
        }
      })
    })
  } catch (error) {
    console.error('支付错误:', error)
    throw error
  }
}
```

### 9.3 微信订阅消息

```javascript
// 请求订阅消息权限
export function requestSubscribeMessage(tmplIds) {
  return new Promise((resolve, reject) => {
    uni.requestSubscribeMessage({
      tmplIds: tmplIds,
      success: (res) => {
        console.log('订阅结果:', res)
        // res[tmplId] 的值为 'accept'、'reject'、'ban'
        resolve(res)
      },
      fail: (err) => {
        console.error('订阅失败:', err)
        reject(err)
      }
    })
  })
}

// 使用示例
async function subscribeOrderMessage() {
  const tmplIds = [
    'YOUR_TEMPLATE_ID_1', // 订单发货通知
    'YOUR_TEMPLATE_ID_2'  // 订单签收通知
  ]
  
  try {
    const res = await requestSubscribeMessage(tmplIds)
    
    // 检查用户是否同意
    tmplIds.forEach(id => {
      if (res[id] === 'accept') {
        console.log(`模板 ${id} 订阅成功`)
      }
    })
  } catch (error) {
    console.error('订阅失败:', error)
  }
}
```

### 9.4 微信小程序码

```javascript
// 生成小程序码（需后端配合）
export async function getWxacode(page, scene) {
  try {
    const res = await uni.$http.post('/wx/wxacode', {
      page,
      scene,
      width: 280
    })
    return res.url
  } catch (error) {
    console.error('生成小程序码失败:', error)
    throw error
  }
}

// 扫码获取参数
export function getScanCodeParams() {
  // 在App.vue的onLaunch或页面的onLoad中获取
  const options = getCurrentPages()[0].$page.options
  const scene = decodeURIComponent(options.scene || '')
  
  // 解析scene参数 (格式: key1=value1&key2=value2)
  const params = {}
  if (scene) {
    scene.split('&').forEach(item => {
      const [key, value] = item.split('=')
      params[key] = value
    })
  }
  
  return params
}
```

### 9.5 微信位置相关

```javascript
// 获取当前位置
export function getLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: resolve,
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          // 引导用户开启权限
          uni.showModal({
            title: '提示',
            content: '请在设置中开启位置权限',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        }
        reject(err)
      }
    })
  })
}

// 选择位置
export function chooseLocation() {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      success: resolve,
      fail: reject
    })
  })
}

// 打开位置
export function openLocation(options) {
  uni.openLocation({
    latitude: options.latitude,
    longitude: options.longitude,
    name: options.name,
    address: options.address,
    scale: 18
  })
}
```

---

## 10. 钉钉小程序特有API

### 10.1 钉钉登录与认证

```javascript
// utils/dingAuth.js

// 获取免登授权码
export function getAuthCode() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.getAuthCode({
      success: (res) => {
        console.log('钉钉授权码:', res.authCode)
        resolve(res.authCode)
      },
      fail: (err) => {
        console.error('获取授权码失败:', err)
        reject(err)
      }
    })
    // #endif
  })
}

// 钉钉免登录
export async function dingLogin() {
  try {
    const authCode = await getAuthCode()
    
    // 发送到后端换取用户信息
    const res = await uni.$http.post('/ding/login', {
      authCode
    })
    
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('userInfo', res.userInfo)
    
    return res
  } catch (error) {
    console.error('钉钉登录失败:', error)
    throw error
  }
}

// 获取手机号
export function getPhoneNumber() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.getPhoneNumber({
      success: (res) => {
        console.log('手机号:', res.phone)
        resolve(res.phone)
      },
      fail: reject
    })
    // #endif
  })
}
```

### 10.2 钉钉企业通讯录

```javascript
// 选择联系人
export function choosePerson(options = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.choosePerson({
      multiple: options.multiple !== false,
      maxUsers: options.maxUsers || 50,
      pickedUsers: options.pickedUsers || [],
      disabledUsers: options.disabledUsers || [],
      corpId: options.corpId,
      success: (res) => {
        console.log('选择的人员:', res.users)
        resolve(res.users)
      },
      fail: reject
    })
    // #endif
  })
}

// 选择部门
export function chooseDepartment(options = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.chooseDepartment({
      multiple: options.multiple !== false,
      pickedDepartments: options.pickedDepartments || [],
      corpId: options.corpId,
      success: (res) => {
        console.log('选择的部门:', res.departments)
        resolve(res.departments)
      },
      fail: reject
    })
    // #endif
  })
}

// 打开用户详情页
export function openUserProfile(userId) {
  // #ifdef MP-DINGTALK
  dd.openUserProfile({
    userId
  })
  // #endif
}
```

### 10.3 钉钉工作台

```javascript
// 打开其他小程序
export function navigateToMiniProgram(appId, path) {
  // #ifdef MP-DINGTALK
  dd.navigateToMiniProgram({
    appId,
    path,
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
    }
  })
  // #endif
}

// 创建日程
export function createCalendarEvent(options) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.createCalendarEvent({
      title: options.title,
      startTime: options.startTime,
      endTime: options.endTime,
      location: options.location,
      description: options.description,
      attendees: options.attendees || [],
      success: resolve,
      fail: reject
    })
    // #endif
  })
}

// 添加待办
export function addTodo(options) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.addTodo({
      title: options.title,
      description: options.description,
      dueTime: options.dueTime,
      success: resolve,
      fail: reject
    })
    // #endif
  })
}
```

### 10.4 钉钉消息发送

```javascript
// 发送钉消息
export function sendDingMessage(options) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.sendDingMessage({
      type: options.type || 1, // 1:钉, 2:应用内消息
      users: options.users,
      message: {
        content: options.content
      },
      success: resolve,
      fail: reject
    })
    // #endif
  })
}

// 分享
export function share(options) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.share({
      type: options.type || 0, // 0:全部, 1:钉钉会话, 2:微信, 3:微博
      url: options.url,
      title: options.title,
      content: options.content,
      image: options.image,
      success: resolve,
      fail: reject
    })
    // #endif
  })
}
```

### 10.5 钉钉设备能力

```javascript
// 扫码
export function scan() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.scan({
      type: 'all', // qr, bar, all
      success: (res) => {
        console.log('扫码结果:', res.text)
        resolve(res.text)
      },
      fail: reject
    })
    // #endif
  })
}

// 定位
export function getLocation() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.getLocation({
      targetAccuracy: 200,
      coordinate: 1, // 0:wgs84, 1:gcj02
      withReGeocode: true,
      success: (res) => {
        console.log('位置:', res)
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy,
          address: res.address,
          province: res.province,
          city: res.city,
          district: res.district
        })
      },
      fail: reject
    })
    // #endif
  })
}

// 拍照
export function takePhoto() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-DINGTALK
    dd.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        resolve(res.filePaths[0])
      },
      fail: reject
    })
    // #endif
  })
}
```

---

## 11. 样式与布局

### 11.1 Flex布局

```vue
<template>
  <view class="container">
    <!-- 水平排列 -->
    <view class="flex-row">
      <view class="item">1</view>
      <view class="item">2</view>
      <view class="item">3</view>
    </view>
    
    <!-- 垂直排列 -->
    <view class="flex-column">
      <view class="item">1</view>
      <view class="item">2</view>
      <view class="item">3</view>
    </view>
    
    <!-- 两端对齐 -->
    <view class="flex-between">
      <view class="item">左侧</view>
      <view class="item">右侧</view>
    </view>
    
    <!-- 居中 -->
    <view class="flex-center">
      <view class="item">居中内容</view>
    </view>
    
    <!-- 换行 -->
    <view class="flex-wrap">
      <view class="grid-item" v-for="i in 9" :key="i">{{ i }}</view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 20rpx;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.item {
  padding: 20rpx;
  background-color: #007AFF;
  color: #fff;
  margin: 10rpx;
}

.grid-item {
  width: calc(33.33% - 20rpx);
  height: 150rpx;
  background-color: #007AFF;
  color: #fff;
  margin: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
```

### 11.2 响应式单位

```scss
// uni.scss - 全局样式变量
$uni-color-primary: #007AFF;
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;

$uni-text-color: #333333;
$uni-text-color-grey: #999999;

$uni-font-size-sm: 24rpx;
$uni-font-size-base: 28rpx;
$uni-font-size-lg: 32rpx;

$uni-border-radius-sm: 8rpx;
$uni-border-radius-base: 12rpx;
$uni-border-radius-lg: 24rpx;

$uni-spacing-sm: 16rpx;
$uni-spacing-base: 24rpx;
$uni-spacing-lg: 32rpx;
```

```vue
<style lang="scss" scoped>
.container {
  padding: $uni-spacing-base;
}

.title {
  font-size: $uni-font-size-lg;
  color: $uni-text-color;
}

.button {
  background-color: $uni-color-primary;
  border-radius: $uni-border-radius-base;
  padding: $uni-spacing-sm $uni-spacing-base;
}
</style>
```

### 11.3 常用布局组件

```vue
<template>
  <view class="page">
    <!-- 固定头部 -->
    <view class="header">
      <text class="title">标题</text>
    </view>
    
    <!-- 滚动内容区 -->
    <scroll-view 
      class="content" 
      scroll-y 
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="list">
        <view class="list-item" v-for="item in list" :key="item.id">
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
    
    <!-- 固定底部 -->
    <view class="footer">
      <button class="btn" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      scrollHeight: 0
    }
  },
  onReady() {
    this.calculateScrollHeight()
  },
  methods: {
    calculateScrollHeight() {
      const systemInfo = uni.getSystemInfoSync()
      const headerHeight = 88 // rpx转px
      const footerHeight = 100
      this.scrollHeight = systemInfo.windowHeight - headerHeight - footerHeight
    },
    loadMore() {
      // 加载更多
    },
    submit() {
      // 提交
    }
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007AFF;
  color: #fff;
}

.content {
  flex: 1;
  background-color: #f5f5f5;
}

.footer {
  height: 100rpx;
  padding: 10rpx 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.btn {
  width: 100%;
  height: 80rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 40rpx;
}
</style>
```

### 11.4 安全区域适配

```vue
<template>
  <view class="container">
    <!-- 内容区域 -->
    <view class="content">
      内容
    </view>
    
    <!-- 底部安全区域 -->
    <view class="safe-bottom">
      <button class="btn">按钮</button>
    </view>
  </view>
</template>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
}
</style>
```

---

## 12. 性能优化

### 12.1 图片优化

```vue
<template>
  <view>
    <!-- 懒加载 -->
    <image 
      v-for="item in imageList" 
      :key="item.id"
      :src="item.url"
      lazy-load
      mode="aspectFill"
    ></image>
    
    <!-- 使用webp格式 -->
    <image :src="formatImageUrl(imageUrl)"></image>
    
    <!-- 占位图 -->
    <image 
      :src="loaded ? imageUrl : placeholder"
      @load="loaded = true"
      @error="handleError"
    ></image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageList: [],
      imageUrl: '',
      placeholder: '/static/placeholder.png',
      loaded: false
    }
  },
  methods: {
    // 图片URL格式化（添加CDN参数）
    formatImageUrl(url) {
      if (!url) return this.placeholder
      // 添加压缩参数
      return `${url}?x-oss-process=image/format,webp/quality,q_80`
    },
    handleError() {
      // 加载失败使用默认图
      this.imageUrl = this.placeholder
    }
  }
}
</script>
```

### 12.2 列表优化

```vue
<template>
  <view>
    <!-- 使用虚拟列表（需要引入第三方组件） -->
    <virtual-list 
      :list="list"
      :item-height="100"
      @bottom="loadMore"
    >
      <template v-slot="{ item }">
        <view class="item">{{ item.name }}</view>
      </template>
    </virtual-list>
    
    <!-- 或使用scroll-view优化 -->
    <scroll-view 
      scroll-y 
      :scroll-into-view="scrollIntoId"
      @scroll="handleScroll"
    >
      <view 
        v-for="item in visibleList" 
        :key="item.id"
        :id="'item-' + item.id"
      >
        {{ item.name }}
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      visibleList: [],
      scrollTop: 0,
      itemHeight: 100,
      bufferSize: 5
    }
  },
  methods: {
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.updateVisibleList(scrollTop)
    },
    updateVisibleList(scrollTop) {
      const startIndex = Math.floor(scrollTop / this.itemHeight)
      const visibleCount = Math.ceil(this.viewportHeight / this.itemHeight)
      
      const start = Math.max(0, startIndex - this.bufferSize)
      const end = Math.min(this.list.length, startIndex + visibleCount + this.bufferSize)
      
      this.visibleList = this.list.slice(start, end)
    }
  }
}
</script>
```

### 12.3 数据缓存

```javascript
// utils/cache.js
class Cache {
  constructor(prefix = 'app_') {
    this.prefix = prefix
  }
  
  // 设置缓存
  set(key, value, expire = 0) {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : 0
    }
    uni.setStorageSync(this.prefix + key, JSON.stringify(data))
  }
  
  // 获取缓存
  get(key) {
    try {
      const data = JSON.parse(uni.getStorageSync(this.prefix + key))
      if (!data) return null
      
      if (data.expire && data.expire < Date.now()) {
        this.remove(key)
        return null
      }
      
      return data.value
    } catch (e) {
      return null
    }
  }
  
  // 删除缓存
  remove(key) {
    uni.removeStorageSync(this.prefix + key)
  }
  
  // 清空所有缓存
  clear() {
    const keys = uni.getStorageInfoSync().keys
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        uni.removeStorageSync(key)
      }
    })
  }
}

export default new Cache()
```

### 12.4 请求优化

```javascript
// utils/requestOptimize.js

// 请求去重
const pendingRequests = new Map()

function generateRequestKey(config) {
  return `${config.method}:${config.url}:${JSON.stringify(config.data)}`
}

export function deduplicateRequest(config) {
  const key = generateRequestKey(config)
  
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }
  
  const request = uni.request(config)
  pendingRequests.set(key, request)
  
  request.finally(() => {
    pendingRequests.delete(key)
  })
  
  return request
}

// 请求节流
const throttleMap = new Map()

export function throttleRequest(key, fn, delay = 1000) {
  const now = Date.now()
  const last = throttleMap.get(key) || 0
  
  if (now - last > delay) {
    throttleMap.set(key, now)
    return fn()
  }
  
  return Promise.resolve(null)
}

// 请求缓存
const requestCache = new Map()

export async function cacheRequest(config, cacheTime = 60000) {
  const key = generateRequestKey(config)
  const cached = requestCache.get(key)
  
  if (cached && Date.now() - cached.time < cacheTime) {
    return cached.data
  }
  
  const res = await uni.request(config)
  requestCache.set(key, {
    data: res,
    time: Date.now()
  })
  
  return res
}
```

### 12.5 分包加载

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index"
    },
    {
      "path": "pages/user/user"
    }
  ],
  "subPackages": [
    {
      "root": "packageA",
      "pages": [
        {
          "path": "pages/detail/detail"
        },
        {
          "path": "pages/list/list"
        }
      ]
    },
    {
      "root": "packageB",
      "pages": [
        {
          "path": "pages/order/order"
        },
        {
          "path": "pages/pay/pay"
        }
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    },
    "pages/user/user": {
      "network": "wifi",
      "packages": ["packageB"]
    }
  }
}
```

---

## 附录：常用代码片段

### 下拉刷新 + 上拉加载模板

```vue
<template>
  <view class="page">
    <view class="list">
      <view 
        class="item" 
        v-for="item in list" 
        :key="item.id"
      >
        {{ item.name }}
      </view>
    </view>
    
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <view class="no-more" v-if="noMore">
      <text>没有更多了</text>
    </view>
    
    <view class="empty" v-if="!loading && list.length === 0">
      <image src="/static/empty.png"></image>
      <text>暂无数据</text>
    </view>
  </view>
</template>

<script>
import { getList } from '@/api/index.js'

export default {
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false
    }
  },
  onLoad() {
    this.loadData()
  },
  onPullDownRefresh() {
    this.page = 1
    this.noMore = false
    this.loadData(true)
  },
  onReachBottom() {
    if (!this.noMore && !this.loading) {
      this.loadData()
    }
  },
  methods: {
    async loadData(isRefresh = false) {
      if (this.loading) return
      this.loading = true
      
      try {
        const res = await getList({
          page: this.page,
          pageSize: this.pageSize
        })
        
        const data = res.list || []
        
        if (isRefresh) {
          this.list = data
        } else {
          this.list = [...this.list, ...data]
        }
        
        if (data.length < this.pageSize) {
          this.noMore = true
        } else {
          this.page++
        }
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    }
  }
}
</script>
```

### 登录状态检查装饰器

```javascript
// utils/auth.js
export function checkLogin(target, name, descriptor) {
  const original = descriptor.value
  
  descriptor.value = function(...args) {
    const token = uni.getStorageSync('token')
    
    if (!token) {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }
    
    return original.apply(this, args)
  }
  
  return descriptor
}

// 使用（需要babel支持装饰器语法）
// @checkLogin
// addToCart() { ... }
```

### 防抖节流Mixin

```javascript
// mixins/debounceMixin.js
export default {
  methods: {
    // 防抖
    debounce(fn, delay = 300) {
      let timer = null
      return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, delay)
      }
    },
    
    // 节流
    throttle(fn, delay = 300) {
      let lastTime = 0
      return function(...args) {
        const now = Date.now()
        if (now - lastTime > delay) {
          lastTime = now
          fn.apply(this, args)
        }
      }
    }
  },
  created() {
    // 自动为带有 _debounce 后缀的方法添加防抖
    Object.keys(this.$options.methods || {}).forEach(key => {
      if (key.endsWith('_debounce')) {
        const originalMethod = this[key]
        this[key.replace('_debounce', '')] = this.debounce(originalMethod.bind(this))
      }
    })
  }
}
```

---

本文档涵盖了Vue2 + UniApp开发微信和钉钉小程序的所有核心知识点，包括项目配置、Vue语法、组件系统、生命周期、路由导航、数据请求、状态管理、条件编译、平台API和性能优化等内容。每个部分都提供了详细的代码示例和使用场景说明，可作为开发参考手册使用。
