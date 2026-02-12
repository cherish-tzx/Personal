# Vue2 完整语法详解

<div class="doc-toc">

## 目录

1. [基础语法](#一基础语法)
2. [模板语法](#二模板语法)
3. [计算属性与侦听器](#三计算属性与侦听器)
4. [Class与Style绑定](#四class与style绑定)
5. [条件渲染](#五条件渲染)
6. [列表渲染](#六列表渲染)
7. [事件处理](#七事件处理)
8. [表单输入绑定](#八表单输入绑定)
9. [组件基础](#九组件基础)
10. [组件通信](#十组件通信)
11. [插槽](#十一插槽)
12. [动态组件与异步组件](#十二动态组件与异步组件)
13. [自定义指令](#十三自定义指令)
14. [过滤器](#十四过滤器)
15. [混入Mixins](#十五混入mixins)
16. [过渡与动画](#十六过渡与动画)
17. [生命周期](#十七生命周期)
18. [Vue Router](#十八vue-router)
19. [Vuex状态管理](#十九vuex状态管理)
20. [封装组件最佳实践](#二十封装组件最佳实践)

</div>

---

## 一、基础语法

### 1.1 Vue实例创建

```javascript
// 创建Vue实例
const vm = new Vue({
  el: '#app',           // 挂载元素
  data: {               // 数据对象
    message: 'Hello Vue!'
  },
  methods: {},          // 方法
  computed: {},         // 计算属性
  watch: {},            // 侦听器
  filters: {},          // 过滤器
  directives: {},       // 自定义指令
  components: {}        // 局部组件
})
```

### 1.2 data选项

```javascript
// 组件中data必须是函数
export default {
  data() {
    return {
      count: 0,
      user: {
        name: '张三',
        age: 25
      },
      items: [1, 2, 3]
    }
  }
}

// 根实例可以是对象
new Vue({
  el: '#app',
  data: {
    message: 'Hello'
  }
})
```

### 1.3 methods方法

```javascript
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    // 普通方法
    increment() {
      this.count++
    },
    // 带参数的方法
    add(num) {
      this.count += num
    },
    // 访问事件对象
    handleClick(event) {
      console.log(event.target)
    },
    // 同时传参和事件对象
    submit(id, event) {
      console.log(id, event)
    },
    // 异步方法
    async fetchData() {
      const res = await axios.get('/api/data')
      this.items = res.data
    }
  }
}
```

```html
<!-- 模板中调用 -->
<button @click="increment">增加</button>
<button @click="add(5)">加5</button>
<button @click="handleClick">点击</button>
<button @click="submit(1, $event)">提交</button>
```

---

## 二、模板语法

### 2.1 插值表达式

```html
<!-- 文本插值 -->
<span>{{ message }}</span>

<!-- JavaScript表达式 -->
<span>{{ number + 1 }}</span>
<span>{{ ok ? 'YES' : 'NO' }}</span>
<span>{{ message.split('').reverse().join('') }}</span>

<!-- 一次性插值 -->
<span v-once>{{ message }}</span>

<!-- 原始HTML -->
<span v-html="rawHtml"></span>

<!-- 纯文本 -->
<span v-text="message"></span>
```

### 2.2 指令

```html
<!-- v-bind 绑定属性 -->
<img v-bind:src="imageSrc">
<img :src="imageSrc">  <!-- 缩写 -->
<a :href="url">链接</a>
<div :id="dynamicId"></div>

<!-- 动态属性名 -->
<a :[attributeName]="url">链接</a>

<!-- v-on 事件绑定 -->
<button v-on:click="doSomething">点击</button>
<button @click="doSomething">点击</button>  <!-- 缩写 -->

<!-- 动态事件名 -->
<button @[eventName]="doSomething">点击</button>

<!-- v-model 双向绑定 -->
<input v-model="message">

<!-- v-show 显示/隐藏 -->
<div v-show="isVisible">内容</div>

<!-- v-if 条件渲染 -->
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>Other</div>

<!-- v-for 列表渲染 -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>

<!-- v-pre 跳过编译 -->
<span v-pre>{{ 这里不会被编译 }}</span>

<!-- v-cloak 防止闪烁 -->
<div v-cloak>{{ message }}</div>
```

### 2.3 修饰符

```html
<!-- 事件修饰符 -->
<button @click.stop="doThis">阻止冒泡</button>
<form @submit.prevent="onSubmit">阻止默认</form>
<div @click.capture="doThis">捕获模式</div>
<div @click.self="doThat">只在自身触发</div>
<button @click.once="doThis">只触发一次</button>
<div @scroll.passive="onScroll">优化滚动性能</div>

<!-- 链式修饰符 -->
<button @click.stop.prevent="doThis">组合使用</button>

<!-- 按键修饰符 -->
<input @keyup.enter="submit">
<input @keyup.tab="onTab">
<input @keyup.delete="onDelete">
<input @keyup.esc="onEsc">
<input @keyup.space="onSpace">
<input @keyup.up="onUp">
<input @keyup.down="onDown">
<input @keyup.left="onLeft">
<input @keyup.right="onRight">

<!-- 系统修饰键 -->
<input @keyup.ctrl="onCtrl">
<input @keyup.alt="onAlt">
<input @keyup.shift="onShift">
<input @keyup.meta="onMeta">
<button @click.ctrl="onClick">Ctrl+点击</button>

<!-- 精确修饰符 -->
<button @click.ctrl.exact="onClick">仅Ctrl+点击</button>
<button @click.exact="onClick">没有任何修饰键</button>

<!-- 鼠标按钮修饰符 -->
<button @click.left="onLeft">左键</button>
<button @click.right="onRight">右键</button>
<button @click.middle="onMiddle">中键</button>

<!-- v-model修饰符 -->
<input v-model.lazy="msg">    <!-- change时更新 -->
<input v-model.number="age">  <!-- 转为数字 -->
<input v-model.trim="msg">    <!-- 去除首尾空格 -->
```

---

## 三、计算属性与侦听器

### 3.1 计算属性 computed

```javascript
export default {
  data() {
    return {
      firstName: '张',
      lastName: '三',
      items: [
        { name: '苹果', price: 10, count: 2 },
        { name: '香蕉', price: 5, count: 3 }
      ]
    }
  },
  computed: {
    // 基础用法 - 只读
    fullName() {
      return this.firstName + this.lastName
    },
    
    // 完整写法 - 可读可写
    fullNameReadWrite: {
      get() {
        return this.firstName + this.lastName
      },
      set(newValue) {
        const names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[1]
      }
    },
    
    // 计算总价
    totalPrice() {
      return this.items.reduce((sum, item) => {
        return sum + item.price * item.count
      }, 0)
    },
    
    // 过滤数据
    expensiveItems() {
      return this.items.filter(item => item.price > 8)
    },
    
    // 排序数据
    sortedItems() {
      return [...this.items].sort((a, b) => a.price - b.price)
    }
  }
}
```

```html
<template>
  <div>
    <p>全名: {{ fullName }}</p>
    <p>总价: {{ totalPrice }}</p>
    <input v-model="fullNameReadWrite">
  </div>
</template>
```

### 3.2 侦听器 watch

```javascript
export default {
  data() {
    return {
      question: '',
      answer: '',
      user: {
        name: '张三',
        info: {
          age: 25,
          city: '北京'
        }
      }
    }
  },
  watch: {
    // 基础用法
    question(newVal, oldVal) {
      console.log('question变化了', newVal, oldVal)
      this.getAnswer()
    },
    
    // 立即执行
    answer: {
      handler(newVal, oldVal) {
        console.log('answer变化了')
      },
      immediate: true  // 创建时立即执行
    },
    
    // 深度监听
    user: {
      handler(newVal, oldVal) {
        console.log('user变化了')
      },
      deep: true  // 监听对象内部变化
    },
    
    // 监听对象的某个属性
    'user.name'(newVal, oldVal) {
      console.log('user.name变化了', newVal)
    },
    
    // 监听嵌套属性
    'user.info.age'(newVal, oldVal) {
      console.log('年龄变化了', newVal)
    }
  },
  
  // 也可以用$watch API
  created() {
    // 返回取消监听的函数
    const unwatch = this.$watch('question', (newVal, oldVal) => {
      console.log('question变化了')
    }, {
      immediate: true,
      deep: false
    })
    
    // 取消监听
    // unwatch()
  }
}
```

### 3.3 computed vs watch 使用场景

```javascript
// computed适用场景：依赖其他数据计算得出的值
computed: {
  // 购物车总价
  totalPrice() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.count, 0)
  },
  // 过滤后的列表
  filteredList() {
    return this.list.filter(item => item.name.includes(this.keyword))
  }
}

// watch适用场景：数据变化时执行异步或开销大的操作
watch: {
  // 搜索关键词变化时请求数据
  keyword(newVal) {
    this.debouncedSearch(newVal)
  },
  // 路由变化时获取数据
  '$route'(to, from) {
    this.fetchData(to.params.id)
  }
}
```

---

## 四、Class与Style绑定

### 4.1 绑定Class

```html
<!-- 对象语法 -->
<div :class="{ active: isActive, 'text-danger': hasError }"></div>

<!-- 绑定对象 -->
<div :class="classObject"></div>

<!-- 数组语法 -->
<div :class="[activeClass, errorClass]"></div>

<!-- 数组中使用对象 -->
<div :class="[{ active: isActive }, errorClass]"></div>

<!-- 三元表达式 -->
<div :class="[isActive ? 'active' : '', errorClass]"></div>

<!-- 结合静态class -->
<div class="static" :class="{ active: isActive }"></div>
```

```javascript
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      activeClass: 'active',
      errorClass: 'text-danger',
      classObject: {
        active: true,
        'text-danger': false
      }
    }
  },
  computed: {
    // 使用计算属性返回class对象
    computedClass() {
      return {
        active: this.isActive && !this.hasError,
        'text-danger': this.hasError
      }
    }
  }
}
```

### 4.2 绑定Style

```html
<!-- 对象语法 -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<!-- 绑定样式对象 -->
<div :style="styleObject"></div>

<!-- 数组语法 -->
<div :style="[baseStyles, overridingStyles]"></div>

<!-- 自动添加前缀 -->
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

```javascript
export default {
  data() {
    return {
      activeColor: 'red',
      fontSize: 16,
      styleObject: {
        color: 'blue',
        fontSize: '14px',
        backgroundColor: '#f0f0f0'
      },
      baseStyles: {
        color: 'red'
      },
      overridingStyles: {
        fontSize: '20px'
      }
    }
  }
}
```

---

## 五、条件渲染

### 5.1 v-if / v-else-if / v-else

```html
<!-- 基础用法 -->
<div v-if="type === 'A'">A类型</div>
<div v-else-if="type === 'B'">B类型</div>
<div v-else-if="type === 'C'">C类型</div>
<div v-else>其他类型</div>

<!-- 在template上使用 -->
<template v-if="ok">
  <h1>标题</h1>
  <p>段落1</p>
  <p>段落2</p>
</template>

<!-- 使用key管理复用元素 -->
<template v-if="loginType === 'username'">
  <label>用户名</label>
  <input placeholder="输入用户名" key="username-input">
</template>
<template v-else>
  <label>邮箱</label>
  <input placeholder="输入邮箱" key="email-input">
</template>
```

### 5.2 v-show

```html
<!-- v-show只是切换display属性 -->
<div v-show="isVisible">内容</div>

<!-- v-show不支持template元素 -->
<!-- v-show不支持v-else -->
```

### 5.3 v-if vs v-show

```html
<!-- 
v-if: 
- 真正的条件渲染，切换时会销毁和重建
- 惰性的，条件为假时不渲染
- 适合条件很少改变的场景

v-show:
- 元素始终被渲染，只是切换display
- 适合频繁切换的场景
-->

<!-- 频繁切换用v-show -->
<div v-show="isTabActive">Tab内容</div>

<!-- 条件很少变化用v-if -->
<div v-if="isAdmin">管理员面板</div>
```

---

## 六、列表渲染

### 6.1 v-for基础

```html
<!-- 遍历数组 -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>

<!-- 带索引 -->
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>
</ul>

<!-- 遍历对象 -->
<div v-for="value in object" :key="value">
  {{ value }}
</div>

<!-- 对象带key和index -->
<div v-for="(value, key, index) in object" :key="key">
  {{ index }}. {{ key }}: {{ value }}
</div>

<!-- 遍历数字范围 -->
<span v-for="n in 10" :key="n">{{ n }}</span>

<!-- 在template上使用 -->
<template v-for="item in items">
  <li :key="item.id">{{ item.name }}</li>
  <li :key="item.id + '-divider'" class="divider"></li>
</template>
```

### 6.2 key的作用

```html
<!-- key用于追踪节点身份，提高渲染效率 -->
<!-- 使用唯一id作为key -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>

<!-- 不建议使用index作为key（除非列表是静态的） -->
<!-- 因为数组顺序改变时会导致不必要的DOM更新 -->
<li v-for="(item, index) in items" :key="index">{{ item.name }}</li>
```

### 6.3 数组更新检测

```javascript
export default {
  data() {
    return {
      items: [
        { id: 1, name: '苹果' },
        { id: 2, name: '香蕉' }
      ]
    }
  },
  methods: {
    // 变异方法 - 会触发视图更新
    addItem() {
      this.items.push({ id: 3, name: '橙子' })      // 添加到末尾
    },
    removeItem() {
      this.items.pop()                              // 删除末尾
      this.items.shift()                            // 删除开头
    },
    insertItem() {
      this.items.unshift({ id: 0, name: '葡萄' })   // 添加到开头
    },
    spliceItem() {
      this.items.splice(1, 1)                       // 删除
      this.items.splice(1, 0, { id: 4, name: '梨' }) // 插入
      this.items.splice(1, 1, { id: 5, name: '桃' }) // 替换
    },
    sortItems() {
      this.items.sort((a, b) => a.id - b.id)        // 排序
    },
    reverseItems() {
      this.items.reverse()                          // 反转
    },
    
    // 替换数组 - 非变异方法需要替换整个数组
    filterItems() {
      this.items = this.items.filter(item => item.id > 1)
    },
    mapItems() {
      this.items = this.items.map(item => ({
        ...item,
        name: item.name + '!'
      }))
    },
    concatItems() {
      this.items = this.items.concat([{ id: 6, name: '樱桃' }])
    },
    
    // 使用Vue.set更新数组指定索引
    updateItem(index, newItem) {
      this.$set(this.items, index, newItem)
      // 或者
      Vue.set(this.items, index, newItem)
    },
    
    // 修改数组长度
    truncate() {
      this.items.splice(2)  // 保留前2个
    }
  }
}
```

### 6.4 对象更新检测

```javascript
export default {
  data() {
    return {
      user: {
        name: '张三',
        age: 25
      }
    }
  },
  methods: {
    // 添加响应式属性
    addProperty() {
      // 直接添加不是响应式的
      // this.user.email = 'test@test.com'  // 不会触发更新
      
      // 使用Vue.set或this.$set
      this.$set(this.user, 'email', 'test@test.com')
      // 或
      Vue.set(this.user, 'email', 'test@test.com')
    },
    
    // 添加多个属性
    addMultipleProperties() {
      this.user = Object.assign({}, this.user, {
        email: 'test@test.com',
        phone: '123456'
      })
      // 或使用展开运算符
      this.user = {
        ...this.user,
        email: 'test@test.com',
        phone: '123456'
      }
    },
    
    // 删除属性
    deleteProperty() {
      this.$delete(this.user, 'age')
      // 或
      Vue.delete(this.user, 'age')
    }
  }
}
```

### 6.5 v-for与v-if

```html
<!-- 不推荐在同一元素上使用v-for和v-if -->
<!-- v-for优先级高于v-if -->

<!-- 方案1：使用计算属性过滤 -->
<li v-for="item in activeItems" :key="item.id">
  {{ item.name }}
</li>

<!-- 方案2：将v-if移到外层 -->
<ul v-if="items.length > 0">
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>
<p v-else>暂无数据</p>

<!-- 方案3：使用template包裹 -->
<template v-for="item in items">
  <li v-if="item.isActive" :key="item.id">
    {{ item.name }}
  </li>
</template>
```

```javascript
computed: {
  // 使用计算属性过滤
  activeItems() {
    return this.items.filter(item => item.isActive)
  }
}
```

---

## 七、事件处理

### 7.1 事件绑定

```html
<!-- 直接执行语句 -->
<button @click="count++">增加</button>

<!-- 调用方法 -->
<button @click="increment">增加</button>

<!-- 传递参数 -->
<button @click="say('hi')">Say Hi</button>

<!-- 访问原生事件 -->
<button @click="warn('提示', $event)">警告</button>

<!-- 多个事件处理器 -->
<button @click="one($event), two($event)">点击</button>
```

```javascript
methods: {
  increment() {
    this.count++
  },
  say(message) {
    alert(message)
  },
  warn(message, event) {
    if (event) {
      event.preventDefault()
    }
    alert(message)
  },
  one(event) {
    console.log('第一个处理器')
  },
  two(event) {
    console.log('第二个处理器')
  }
}
```

### 7.2 事件修饰符详解

```html
<!-- .stop - 阻止事件冒泡 -->
<div @click="divClick">
  <button @click.stop="btnClick">点击</button>
</div>

<!-- .prevent - 阻止默认行为 -->
<form @submit.prevent="onSubmit">
  <button type="submit">提交</button>
</form>

<!-- .capture - 使用捕获模式 -->
<div @click.capture="divClick">
  <button @click="btnClick">点击</button>
</div>
<!-- 点击button时：先divClick，再btnClick -->

<!-- .self - 只在事件目标是自身时触发 -->
<div @click.self="divClick">
  <button @click="btnClick">点击</button>
</div>
<!-- 点击div时触发divClick，点击button时不触发divClick -->

<!-- .once - 只触发一次 -->
<button @click.once="doThis">只能点一次</button>

<!-- .passive - 不阻止默认行为，提升性能 -->
<div @scroll.passive="onScroll">...</div>

<!-- .native - 监听组件根元素的原生事件 -->
<my-component @click.native="onClick"></my-component>
```

### 7.3 按键修饰符

```html
<!-- 按键别名 -->
<input @keyup.enter="submit">
<input @keyup.tab="onTab">
<input @keyup.delete="onDelete">  <!-- 删除和退格 -->
<input @keyup.esc="onEsc">
<input @keyup.space="onSpace">
<input @keyup.up="onUp">
<input @keyup.down="onDown">
<input @keyup.left="onLeft">
<input @keyup.right="onRight">

<!-- 按键码（已废弃但仍可用） -->
<input @keyup.13="submit">

<!-- 自定义按键别名 -->
<!-- Vue.config.keyCodes.f1 = 112 -->
<input @keyup.f1="showHelp">

<!-- 系统修饰键 -->
<input @keyup.ctrl="onCtrl">
<input @keyup.alt="onAlt">
<input @keyup.shift="onShift">
<input @keyup.meta="onMeta">

<!-- 组合键 -->
<input @keyup.alt.enter="clear">
<button @click.ctrl="onClick">Ctrl+Click</button>

<!-- .exact修饰符 - 精确控制 -->
<button @click.ctrl.exact="onCtrlClick">仅Ctrl+Click</button>
<button @click.exact="onClick">没有任何修饰键时点击</button>
```

### 7.4 鼠标按钮修饰符

```html
<button @click.left="onLeftClick">左键</button>
<button @click.right="onRightClick">右键</button>
<button @click.middle="onMiddleClick">中键</button>

<!-- 右键菜单 -->
<div @contextmenu.prevent="showContextMenu">
  右键点击显示菜单
</div>
```

---

## 八、表单输入绑定

### 8.1 基础用法

```html
<!-- 文本框 -->
<input v-model="message" placeholder="输入内容">
<p>输入的内容: {{ message }}</p>

<!-- 多行文本 -->
<textarea v-model="message" placeholder="输入多行内容"></textarea>

<!-- 复选框 - 单个 -->
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>

<!-- 复选框 - 多个绑定到数组 -->
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<p>选中的名字: {{ checkedNames }}</p>

<!-- 单选按钮 -->
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<p>选中: {{ picked }}</p>

<!-- 选择框 - 单选 -->
<select v-model="selected">
  <option disabled value="">请选择</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<p>选中: {{ selected }}</p>

<!-- 选择框 - 多选 -->
<select v-model="selectedMultiple" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<p>选中: {{ selectedMultiple }}</p>

<!-- 动态选项 -->
<select v-model="selected">
  <option v-for="option in options" :key="option.value" :value="option.value">
    {{ option.text }}
  </option>
</select>
```

```javascript
export default {
  data() {
    return {
      message: '',
      checked: false,
      checkedNames: [],
      picked: '',
      selected: '',
      selectedMultiple: [],
      options: [
        { text: '选项A', value: 'A' },
        { text: '选项B', value: 'B' },
        { text: '选项C', value: 'C' }
      ]
    }
  }
}
```

### 8.2 值绑定

```html
<!-- 复选框 - 自定义true/false值 -->
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>

<!-- 单选按钮 - 绑定对象 -->
<input type="radio" v-model="pick" :value="a">

<!-- 选择框 - 绑定对象 -->
<select v-model="selected">
  <option :value="{ number: 123 }">123</option>
</select>
```

```javascript
data() {
  return {
    toggle: 'no',  // 'yes' 或 'no'
    pick: null,
    a: { name: '选项A' },
    selected: null
  }
}
```

### 8.3 修饰符

```html
<!-- .lazy - 在change事件后同步 -->
<input v-model.lazy="msg">

<!-- .number - 自动转为数字 -->
<input v-model.number="age" type="number">

<!-- .trim - 自动去除首尾空格 -->
<input v-model.trim="msg">

<!-- 组合使用 -->
<input v-model.lazy.trim="msg">
```

---

## 九、组件基础

### 9.1 组件注册

```javascript
// 全局注册
Vue.component('my-component', {
  template: '<div>全局组件</div>'
})

// 全局注册 - 使用组件选项
Vue.component('my-component', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      点击了 {{ count }} 次
    </button>
  `
})

// 局部注册
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

export default {
  components: {
    ComponentA,
    ComponentB,
    // 别名
    'component-c': ComponentA
  }
}

// 在模块系统中全局注册
// main.js
import Vue from 'vue'
import BaseButton from './components/BaseButton.vue'
import BaseIcon from './components/BaseIcon.vue'
import BaseInput from './components/BaseInput.vue'

Vue.component('BaseButton', BaseButton)
Vue.component('BaseIcon', BaseIcon)
Vue.component('BaseInput', BaseInput)
```

### 9.2 组件命名规范

```javascript
// PascalCase (推荐在JS中使用)
Vue.component('MyComponent', { /* ... */ })

// kebab-case (在DOM模板中必须使用)
Vue.component('my-component', { /* ... */ })

// 在模板中使用
// <MyComponent /> 或 <my-component></my-component>
```

### 9.3 单文件组件结构

```vue
<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',  // 组件名称
  
  // Props定义
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: '默认内容'
    }
  },
  
  // 数据
  data() {
    return {
      count: 0
    }
  },
  
  // 计算属性
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  
  // 侦听器
  watch: {
    count(newVal, oldVal) {
      console.log('count变化了', newVal)
    }
  },
  
  // 生命周期钩子
  created() {
    console.log('组件创建')
  },
  
  mounted() {
    console.log('组件挂载')
  },
  
  // 方法
  methods: {
    handleClick() {
      this.count++
      this.$emit('click', this.count)
    }
  }
}
</script>

<style scoped>
.my-component {
  padding: 20px;
}

h1 {
  color: #333;
}
</style>
```

### 9.4 Props详解

```javascript
export default {
  props: {
    // 基础类型检查
    propA: Number,
    
    // 多个可能的类型
    propB: [String, Number],
    
    // 必填字符串
    propC: {
      type: String,
      required: true
    },
    
    // 带默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    
    // 带默认值的对象
    propE: {
      type: Object,
      default() {
        return { message: 'hello' }
      }
    },
    
    // 带默认值的数组
    propF: {
      type: Array,
      default() {
        return []
      }
    },
    
    // 自定义验证函数
    propG: {
      validator(value) {
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    
    // 带有默认值和验证的组合
    propH: {
      type: String,
      default: 'default',
      validator(value) {
        return value.length > 0
      }
    }
  }
}
```

```html
<!-- 使用组件并传递Props -->
<my-component
  :prop-a="42"
  prop-b="hello"
  :prop-c="requiredValue"
  :prop-e="{ message: 'hi' }"
  prop-g="success"
></my-component>

<!-- 传递所有属性 -->
<my-component v-bind="$props"></my-component>

<!-- 传递对象的所有属性 -->
<my-component v-bind="post"></my-component>
<!-- 等价于 -->
<my-component :id="post.id" :title="post.title"></my-component>
```

### 9.5 单向数据流

```javascript
// Props是单向下行绑定，不应该在子组件内部修改

// 错误做法
props: ['initialValue'],
methods: {
  update() {
    this.initialValue = 'new value'  // 不要这样做!
  }
}

// 正确做法1：使用本地data属性
props: ['initialValue'],
data() {
  return {
    value: this.initialValue  // 复制到本地
  }
}

// 正确做法2：使用计算属性
props: ['size'],
computed: {
  normalizedSize() {
    return this.size.trim().toLowerCase()
  }
}

// 正确做法3：需要修改时通知父组件
methods: {
  updateValue(newVal) {
    this.$emit('update:value', newVal)
  }
}
```

---

## 十、组件通信

### 10.1 Props / $emit（父子通信）

```vue
<!-- 父组件 -->
<template>
  <div>
    <child-component
      :message="parentMessage"
      :count="parentCount"
      @update="handleUpdate"
      @increment="handleIncrement"
    />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: { ChildComponent },
  data() {
    return {
      parentMessage: 'Hello from parent',
      parentCount: 0
    }
  },
  methods: {
    handleUpdate(newMessage) {
      this.parentMessage = newMessage
    },
    handleIncrement(num) {
      this.parentCount += num
    }
  }
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <button @click="updateMessage">更新消息</button>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    count: Number
  },
  methods: {
    updateMessage() {
      this.$emit('update', 'New message from child')
    },
    increment() {
      this.$emit('increment', 1)
    }
  }
}
</script>
```

### 10.2 .sync修饰符

```vue
<!-- 父组件 -->
<template>
  <child-component :title.sync="pageTitle" />
  
  <!-- 等价于 -->
  <child-component
    :title="pageTitle"
    @update:title="pageTitle = $event"
  />
</template>

<script>
export default {
  data() {
    return {
      pageTitle: '初始标题'
    }
  }
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <input :value="title" @input="$emit('update:title', $event.target.value)">
</template>

<script>
export default {
  props: ['title']
}
</script>
```

### 10.3 v-model在组件上使用

```vue
<!-- 父组件 -->
<template>
  <custom-input v-model="searchText" />
  
  <!-- 等价于 -->
  <custom-input
    :value="searchText"
    @input="searchText = $event"
  />
</template>
```

```vue
<!-- 子组件 -->
<template>
  <input
    :value="value"
    @input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
  props: ['value']
}
</script>
```

```javascript
// 自定义v-model的prop和event
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
    >
  `
}
```

### 10.4 $parent / $children

```javascript
// 子组件访问父组件
export default {
  mounted() {
    // 访问父组件数据
    console.log(this.$parent.message)
    
    // 调用父组件方法
    this.$parent.parentMethod()
  }
}

// 父组件访问子组件
export default {
  mounted() {
    // $children是数组，不保证顺序
    this.$children.forEach(child => {
      console.log(child.childData)
      child.childMethod()
    })
  }
}
```

### 10.5 $refs

```vue
<!-- 父组件 -->
<template>
  <div>
    <child-component ref="child" />
    <input ref="input" />
    <button @click="focusInput">聚焦输入框</button>
    <button @click="callChildMethod">调用子组件方法</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      this.$refs.input.focus()
    },
    callChildMethod() {
      // 访问子组件实例
      this.$refs.child.childMethod()
      console.log(this.$refs.child.childData)
    }
  }
}
</script>
```

```vue
<!-- v-for中使用ref -->
<template>
  <div>
    <item-component
      v-for="item in items"
      :key="item.id"
      :ref="`item-${item.id}`"
    />
    <!-- 或者 -->
    <item-component
      v-for="item in items"
      :key="item.id"
      ref="items"
    />
  </div>
</template>

<script>
export default {
  mounted() {
    // 动态ref
    this.$refs['item-1'].doSomething()
    
    // v-for中的ref会是数组
    this.$refs.items.forEach(item => {
      item.doSomething()
    })
  }
}
</script>
```

### 10.6 provide / inject（依赖注入）

```javascript
// 祖先组件 - provide
export default {
  provide() {
    return {
      theme: this.theme,
      getUser: this.getUser,
      // 提供响应式数据
      reactiveData: () => this.reactiveData
    }
  },
  data() {
    return {
      theme: 'dark',
      reactiveData: { count: 0 }
    }
  },
  methods: {
    getUser() {
      return { name: '张三' }
    }
  }
}

// 或者使用对象形式
export default {
  provide: {
    theme: 'dark',
    appName: 'My App'
  }
}
```

```javascript
// 后代组件 - inject
export default {
  inject: ['theme', 'getUser', 'reactiveData'],
  
  // 带默认值
  inject: {
    theme: {
      default: 'light'
    },
    optional: {
      from: 'optionalKey',  // 来源key
      default: 'default value'
    }
  },
  
  computed: {
    // 使用响应式数据
    count() {
      return this.reactiveData().count
    }
  },
  
  created() {
    console.log(this.theme)  // 'dark'
    console.log(this.getUser())  // { name: '张三' }
  }
}
```

### 10.7 EventBus（事件总线）

```javascript
// event-bus.js - 创建事件总线
import Vue from 'vue'
export const EventBus = new Vue()

// 或者挂载到原型
// main.js
Vue.prototype.$bus = new Vue()
```

```javascript
// 组件A - 发送事件
import { EventBus } from './event-bus'

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message', { text: 'Hello' })
      // 或使用原型
      // this.$bus.$emit('message', { text: 'Hello' })
    }
  }
}
```

```javascript
// 组件B - 监听事件
import { EventBus } from './event-bus'

export default {
  created() {
    EventBus.$on('message', this.handleMessage)
  },
  
  beforeDestroy() {
    // 务必移除监听，防止内存泄漏
    EventBus.$off('message', this.handleMessage)
  },
  
  methods: {
    handleMessage(payload) {
      console.log(payload.text)  // 'Hello'
    }
  }
}
```

```javascript
// 事件总线完整API
EventBus.$on('event', callback)      // 监听事件
EventBus.$once('event', callback)    // 只监听一次
EventBus.$off('event', callback)     // 移除特定回调
EventBus.$off('event')               // 移除该事件所有监听
EventBus.$off()                      // 移除所有事件监听
EventBus.$emit('event', ...args)     // 触发事件
```

### 10.8 $attrs / $listeners

```vue
<!-- 祖父组件 -->
<template>
  <parent-component
    :title="title"
    :content="content"
    :footer="footer"
    class="custom-class"
    @click="handleClick"
    @custom="handleCustom"
  />
</template>
```

```vue
<!-- 父组件 - 透传属性和事件 -->
<template>
  <div>
    <p>父组件 - title: {{ title }}</p>
    <!-- 将除title外的属性和所有事件透传给子组件 -->
    <child-component v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  // 设为false，属性不会作为HTML属性渲染到根元素
  inheritAttrs: false,
  
  props: ['title'],  // 只接收title
  
  created() {
    console.log(this.$attrs)     // { content: '...', footer: '...' }
    console.log(this.$listeners) // { click: fn, custom: fn }
  }
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <div>
    <p>子组件 - content: {{ content }}</p>
    <p>子组件 - footer: {{ footer }}</p>
    <button @click="$emit('click')">点击</button>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['content', 'footer']
}
</script>
```

### 10.9 Vuex（状态管理）

详见第十九章 Vuex状态管理

---

## 十一、插槽

### 11.1 默认插槽

```vue
<!-- 子组件 BaseButton.vue -->
<template>
  <button class="btn">
    <slot>默认按钮文字</slot>
  </button>
</template>
```

```vue
<!-- 父组件使用 -->
<template>
  <!-- 使用默认内容 -->
  <base-button></base-button>
  
  <!-- 自定义内容 -->
  <base-button>提交</base-button>
  
  <!-- 插入复杂内容 -->
  <base-button>
    <i class="icon-save"></i>
    保存
  </base-button>
</template>
```

### 11.2 具名插槽

```vue
<!-- 子组件 BaseLayout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>  <!-- 默认插槽 -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```vue
<!-- 父组件使用 -->
<template>
  <base-layout>
    <!-- v-slot只能用在template上 -->
    <template v-slot:header>
      <h1>页面标题</h1>
    </template>
    
    <!-- 默认插槽内容 -->
    <p>主要内容</p>
    <p>更多内容</p>
    
    <template v-slot:footer>
      <p>页脚信息</p>
    </template>
  </base-layout>
  
  <!-- 缩写形式 # -->
  <base-layout>
    <template #header>
      <h1>页面标题</h1>
    </template>
    
    <template #default>
      <p>主要内容</p>
    </template>
    
    <template #footer>
      <p>页脚信息</p>
    </template>
  </base-layout>
</template>
```

### 11.3 作用域插槽

```vue
<!-- 子组件 TodoList.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- 将item数据暴露给父组件 -->
      <slot name="item" :item="item" :index="index">
        {{ item.text }}  <!-- 默认内容 -->
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: Array
  }
}
</script>
```

```vue
<!-- 父组件使用 -->
<template>
  <todo-list :items="todos">
    <!-- 接收子组件传递的数据 -->
    <template v-slot:item="slotProps">
      <span :class="{ done: slotProps.item.done }">
        {{ slotProps.item.text }}
      </span>
    </template>
    
    <!-- 解构写法 -->
    <template #item="{ item, index }">
      <span>{{ index }}. {{ item.text }}</span>
    </template>
    
    <!-- 解构并重命名 -->
    <template #item="{ item: todo }">
      <span>{{ todo.text }}</span>
    </template>
    
    <!-- 解构并设置默认值 -->
    <template #item="{ item = { text: '默认' } }">
      <span>{{ item.text }}</span>
    </template>
  </todo-list>
</template>
```

### 11.4 动态插槽名

```vue
<template>
  <base-layout>
    <template v-slot:[dynamicSlotName]>
      动态插槽内容
    </template>
    
    <!-- 缩写 -->
    <template #[dynamicSlotName]>
      动态插槽内容
    </template>
  </base-layout>
</template>

<script>
export default {
  data() {
    return {
      dynamicSlotName: 'header'
    }
  }
}
</script>
```

### 11.5 插槽的完整示例

```vue
<!-- Table组件 -->
<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          <slot :name="`header-${column.key}`" :column="column">
            {{ column.title }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="column in columns" :key="column.key">
          <slot
            :name="column.key"
            :row="row"
            :column="column"
            :index="rowIndex"
            :value="row[column.key]"
          >
            {{ row[column.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    columns: Array,
    data: Array
  }
}
</script>
```

```vue
<!-- 使用Table组件 -->
<template>
  <custom-table :columns="columns" :data="tableData">
    <!-- 自定义表头 -->
    <template #header-name="{ column }">
      <strong>{{ column.title }}</strong>
      <i class="sort-icon"></i>
    </template>
    
    <!-- 自定义name列 -->
    <template #name="{ value }">
      <a href="#">{{ value }}</a>
    </template>
    
    <!-- 自定义status列 -->
    <template #status="{ value }">
      <span :class="['status', value]">{{ value }}</span>
    </template>
    
    <!-- 自定义操作列 -->
    <template #action="{ row, index }">
      <button @click="edit(row)">编辑</button>
      <button @click="remove(index)">删除</button>
    </template>
  </custom-table>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { key: 'name', title: '姓名' },
        { key: 'status', title: '状态' },
        { key: 'action', title: '操作' }
      ],
      tableData: [
        { name: '张三', status: 'active' },
        { name: '李四', status: 'inactive' }
      ]
    }
  }
}
</script>
```

---

## 十二、动态组件与异步组件

### 12.1 动态组件

```vue
<template>
  <div>
    <!-- 动态切换组件 -->
    <component :is="currentComponent"></component>
    
    <!-- 使用keep-alive缓存 -->
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
    
    <!-- keep-alive的include/exclude -->
    <keep-alive include="ComponentA,ComponentB">
      <component :is="currentComponent"></component>
    </keep-alive>
    
    <keep-alive :include="['ComponentA', 'ComponentB']">
      <component :is="currentComponent"></component>
    </keep-alive>
    
    <keep-alive :include="/^Component/">
      <component :is="currentComponent"></component>
    </keep-alive>
    
    <keep-alive :exclude="['ComponentC']">
      <component :is="currentComponent"></component>
    </keep-alive>
    
    <!-- max限制缓存数量 -->
    <keep-alive :max="10">
      <component :is="currentComponent"></component>
    </keep-alive>
    
    <button @click="switchComponent">切换组件</button>
  </div>
</template>

<script>
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

export default {
  components: {
    ComponentA,
    ComponentB
  },
  data() {
    return {
      currentComponent: 'ComponentA'
    }
  },
  methods: {
    switchComponent() {
      this.currentComponent = this.currentComponent === 'ComponentA'
        ? 'ComponentB'
        : 'ComponentA'
    }
  }
}
</script>
```

### 12.2 keep-alive生命周期

```javascript
export default {
  // 被缓存的组件特有的生命周期
  activated() {
    // 组件被激活时调用
    console.log('组件激活')
    this.fetchData()  // 可以在这里刷新数据
  },
  
  deactivated() {
    // 组件被停用时调用
    console.log('组件停用')
    this.saveState()  // 可以在这里保存状态
  }
}
```

### 12.3 异步组件

```javascript
// 基础用法
Vue.component('async-component', function(resolve, reject) {
  setTimeout(function() {
    resolve({
      template: '<div>异步组件</div>'
    })
  }, 1000)
})

// 配合webpack代码分割
Vue.component('async-webpack-component', function(resolve) {
  require(['./MyComponent.vue'], resolve)
})

// 使用import()
Vue.component('async-component', () => import('./MyComponent.vue'))

// 局部注册
export default {
  components: {
    'my-component': () => import('./MyComponent.vue')
  }
}

// 带加载状态的异步组件
const AsyncComponent = () => ({
  // 需要加载的组件
  component: import('./MyComponent.vue'),
  // 加载中显示的组件
  loading: LoadingComponent,
  // 加载失败显示的组件
  error: ErrorComponent,
  // 显示loading前的延迟时间，默认200ms
  delay: 200,
  // 超时时间，超时后显示error组件
  timeout: 3000
})

export default {
  components: {
    AsyncComponent
  }
}
```

---

## 十三、自定义指令

### 13.1 指令定义

```javascript
// 全局注册
Vue.directive('focus', {
  // 指令钩子函数
  bind(el, binding, vnode, oldVnode) {
    // 只调用一次，指令第一次绑定到元素时调用
  },
  inserted(el, binding, vnode, oldVnode) {
    // 被绑定元素插入父节点时调用
    el.focus()
  },
  update(el, binding, vnode, oldVnode) {
    // 所在组件VNode更新时调用
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 所在组件VNode及其子VNode全部更新后调用
  },
  unbind(el, binding, vnode, oldVnode) {
    // 只调用一次，指令与元素解绑时调用
  }
})

// 简写 - 只在bind和update时触发
Vue.directive('color', function(el, binding) {
  el.style.color = binding.value
})

// 局部注册
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}
```

### 13.2 钩子函数参数

```javascript
Vue.directive('demo', {
  bind(el, binding, vnode) {
    // el: 指令绑定的元素，可直接操作DOM
    console.log(el)
    
    // binding: 包含以下属性的对象
    console.log(binding.name)        // 指令名，不含v-前缀
    console.log(binding.value)       // 指令绑定值
    console.log(binding.oldValue)    // 指令绑定的前一个值
    console.log(binding.expression)  // 字符串形式的指令表达式
    console.log(binding.arg)         // 传给指令的参数
    console.log(binding.modifiers)   // 包含修饰符的对象
    
    // vnode: Vue编译生成的虚拟节点
    console.log(vnode)
    
    // 访问组件实例
    console.log(vnode.context)
  }
})
```

```html
<!-- 使用示例 -->
<div v-demo:foo.a.b="message">测试</div>

<!--
binding对象:
{
  name: 'demo',
  value: 'hello',  // message的值
  oldValue: undefined,
  expression: 'message',
  arg: 'foo',
  modifiers: { a: true, b: true }
}
-->
```

### 13.3 实用指令示例

```javascript
// v-click-outside 点击外部
Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    el._clickOutsideHandler = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unbind(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
})

// v-debounce 防抖
Vue.directive('debounce', {
  inserted(el, binding) {
    let timer
    el.addEventListener('input', () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, binding.arg || 500)
    })
  }
})

// v-lazy 图片懒加载
Vue.directive('lazy', {
  inserted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
})

// v-permission 权限控制
Vue.directive('permission', {
  inserted(el, binding, vnode) {
    const permission = binding.value
    const permissions = vnode.context.$store.state.user.permissions
    
    if (!permissions.includes(permission)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

// v-copy 复制文本
Vue.directive('copy', {
  bind(el, binding) {
    el._copyValue = binding.value
    el.addEventListener('click', () => {
      const textarea = document.createElement('textarea')
      textarea.value = el._copyValue
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      binding.arg && binding.arg()  // 回调函数
    })
  },
  update(el, binding) {
    el._copyValue = binding.value
  }
})

// v-loading 加载状态
Vue.directive('loading', {
  bind(el, binding) {
    const mask = document.createElement('div')
    mask.className = 'loading-mask'
    mask.innerHTML = '<div class="loading-spinner"></div>'
    mask.style.display = binding.value ? 'flex' : 'none'
    el.style.position = 'relative'
    el.appendChild(mask)
    el._loadingMask = mask
  },
  update(el, binding) {
    el._loadingMask.style.display = binding.value ? 'flex' : 'none'
  },
  unbind(el) {
    el.removeChild(el._loadingMask)
    delete el._loadingMask
  }
})
```

```html
<!-- 使用自定义指令 -->
<div v-click-outside="handleClickOutside">下拉菜单</div>

<input v-debounce:300="search">

<img v-lazy="imageUrl" alt="懒加载图片">

<button v-permission="'admin:create'">创建</button>

<button v-copy="textToCopy">复制</button>

<div v-loading="isLoading">内容区域</div>
```

---

## 十四、过滤器

### 14.1 过滤器定义

```javascript
// 全局过滤器
Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// 局部过滤器
export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
```

### 14.2 过滤器使用

```html
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在v-bind中 -->
<div :id="rawId | formatId"></div>

<!-- 串联过滤器 -->
{{ message | filterA | filterB }}

<!-- 传递参数 -->
{{ message | filterA('arg1', arg2) }}
```

### 14.3 常用过滤器

```javascript
// 日期格式化
Vue.filter('formatDate', function(value, format = 'YYYY-MM-DD') {
  if (!value) return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
})

// 金额格式化
Vue.filter('currency', function(value, symbol = '¥', decimals = 2) {
  if (typeof value !== 'number') return value
  return symbol + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// 文件大小格式化
Vue.filter('fileSize', function(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
})

// 手机号脱敏
Vue.filter('phoneMask', function(phone) {
  if (!phone) return ''
  return phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

// 截断文本
Vue.filter('truncate', function(value, length = 20, suffix = '...') {
  if (!value) return ''
  if (value.length <= length) return value
  return value.substring(0, length) + suffix
})

// 相对时间
Vue.filter('timeAgo', function(value) {
  if (!value) return ''
  const seconds = Math.floor((new Date() - new Date(value)) / 1000)
  
  const intervals = [
    { label: '年', seconds: 31536000 },
    { label: '月', seconds: 2592000 },
    { label: '周', seconds: 604800 },
    { label: '天', seconds: 86400 },
    { label: '小时', seconds: 3600 },
    { label: '分钟', seconds: 60 }
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count}${interval.label}前`
    }
  }
  return '刚刚'
})
```

```html
<!-- 使用示例 -->
<p>{{ date | formatDate('YYYY-MM-DD HH:mm:ss') }}</p>
<p>{{ price | currency('$', 2) }}</p>
<p>{{ fileBytes | fileSize }}</p>
<p>{{ phone | phoneMask }}</p>
<p>{{ description | truncate(50) }}</p>
<p>{{ createTime | timeAgo }}</p>
```

---

## 十五、混入Mixins

### 15.1 基础混入

```javascript
// mixin.js
export const myMixin = {
  data() {
    return {
      mixinData: 'mixin数据'
    }
  },
  
  computed: {
    mixinComputed() {
      return this.mixinData + '!'
    }
  },
  
  created() {
    console.log('mixin created')
  },
  
  methods: {
    mixinMethod() {
      console.log('mixin method')
    }
  }
}
```

```javascript
// 使用混入
import { myMixin } from './mixin'

export default {
  mixins: [myMixin],
  
  data() {
    return {
      componentData: '组件数据'
    }
  },
  
  created() {
    console.log('component created')
    // 输出顺序: mixin created -> component created
    console.log(this.mixinData)  // 'mixin数据'
    this.mixinMethod()
  }
}
```

### 15.2 选项合并

```javascript
// 数据对象 - 递归合并，组件数据优先
const mixin = {
  data() {
    return {
      message: 'mixin',
      foo: 'abc'
    }
  }
}

export default {
  mixins: [mixin],
  data() {
    return {
      message: 'component',  // 覆盖mixin的message
      bar: 'def'
    }
  },
  created() {
    console.log(this.message)  // 'component'
    console.log(this.foo)      // 'abc'
    console.log(this.bar)      // 'def'
  }
}

// 生命周期钩子 - 合并为数组，都会被调用，mixin先执行
const mixin = {
  created() {
    console.log('mixin hook')
  }
}

export default {
  mixins: [mixin],
  created() {
    console.log('component hook')
  }
  // 输出: 'mixin hook' -> 'component hook'
}

// methods、components、directives - 合并为同一个对象，组件选项优先
const mixin = {
  methods: {
    foo() {
      console.log('mixin foo')
    },
    bar() {
      console.log('mixin bar')
    }
  }
}

export default {
  mixins: [mixin],
  methods: {
    foo() {
      console.log('component foo')  // 覆盖mixin的foo
    }
  },
  created() {
    this.foo()  // 'component foo'
    this.bar()  // 'mixin bar'
  }
}
```

### 15.3 全局混入

```javascript
// main.js - 全局混入会影响所有Vue实例
Vue.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!',
  // ...
})
// => 'hello!'
```

### 15.4 实用混入示例

```javascript
// 分页混入
export const paginationMixin = {
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  
  computed: {
    paginationProps() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`
      }
    }
  },
  
  methods: {
    handlePageChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.fetchData()
    },
    
    resetPagination() {
      this.pagination.current = 1
    }
  }
}

// 表单验证混入
export const formMixin = {
  data() {
    return {
      formLoading: false
    }
  },
  
  methods: {
    async validateForm(formRef) {
      try {
        await this.$refs[formRef].validate()
        return true
      } catch (error) {
        return false
      }
    },
    
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
    },
    
    async submitForm(formRef, submitFn) {
      const valid = await this.validateForm(formRef)
      if (!valid) return
      
      this.formLoading = true
      try {
        await submitFn()
        this.$message.success('提交成功')
      } catch (error) {
        this.$message.error(error.message || '提交失败')
      } finally {
        this.formLoading = false
      }
    }
  }
}

// 权限混入
export const permissionMixin = {
  methods: {
    hasPermission(permission) {
      const permissions = this.$store.state.user.permissions
      return permissions.includes(permission)
    },
    
    hasAnyPermission(permissions) {
      const userPermissions = this.$store.state.user.permissions
      return permissions.some(p => userPermissions.includes(p))
    },
    
    hasAllPermissions(permissions) {
      const userPermissions = this.$store.state.user.permissions
      return permissions.every(p => userPermissions.includes(p))
    }
  }
}
```

```javascript
// 使用混入
import { paginationMixin, formMixin } from '@/mixins'

export default {
  mixins: [paginationMixin, formMixin],
  
  methods: {
    async fetchData() {
      const { current, pageSize } = this.pagination
      const res = await api.getList({ page: current, size: pageSize })
      this.list = res.data.list
      this.pagination.total = res.data.total
    }
  }
}
```

---

## 十六、过渡与动画

### 16.1 transition组件

```vue
<template>
  <div>
    <button @click="show = !show">切换</button>
    
    <!-- 基础过渡 -->
    <transition name="fade">
      <p v-if="show">Hello</p>
    </transition>
    
    <!-- 自定义过渡类名 -->
    <transition
      enter-class="animated"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <p v-if="show">Hello</p>
    </transition>
    
    <!-- 使用Animate.css -->
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <p v-if="show">Hello</p>
    </transition>
    
    <!-- 指定过渡时长 -->
    <transition :duration="1000">
      <p v-if="show">Hello</p>
    </transition>
    
    <transition :duration="{ enter: 500, leave: 800 }">
      <p v-if="show">Hello</p>
    </transition>
    
    <!-- JavaScript钩子 -->
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @enter-cancelled="enterCancelled"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
      @leave-cancelled="leaveCancelled"
    >
      <p v-if="show">Hello</p>
    </transition>
    
    <!-- 初始渲染的过渡 -->
    <transition appear>
      <p>初始渲染也有动画</p>
    </transition>
    
    <!-- 过渡模式 -->
    <transition name="fade" mode="out-in">
      <component :is="currentComponent"></component>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
    },
    enter(el, done) {
      // 使用Velocity.js或其他动画库
      Velocity(el, { opacity: 1 }, { duration: 500, complete: done })
    },
    afterEnter(el) {
      // ...
    },
    enterCancelled(el) {
      // ...
    },
    beforeLeave(el) {
      // ...
    },
    leave(el, done) {
      Velocity(el, { opacity: 0 }, { duration: 500, complete: done })
    },
    afterLeave(el) {
      // ...
    },
    leaveCancelled(el) {
      // ...
    }
  }
}
</script>

<style>
/* 过渡类名 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 滑动过渡 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
```

### 16.2 transition-group组件

```vue
<template>
  <div>
    <button @click="add">添加</button>
    <button @click="remove">移除</button>
    
    <!-- 列表过渡 -->
    <transition-group name="list" tag="ul">
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </transition-group>
    
    <!-- 排序过渡 -->
    <button @click="shuffle">打乱</button>
    <transition-group name="flip-list" tag="ul">
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </transition-group>
  </div>
</template>

<script>
import shuffle from 'lodash/shuffle'

export default {
  data() {
    return {
      items: [
        { id: 1, text: '项目 1' },
        { id: 2, text: '项目 2' },
        { id: 3, text: '项目 3' }
      ],
      nextId: 4
    }
  },
  methods: {
    add() {
      this.items.push({ id: this.nextId++, text: '项目 ' + this.nextId })
    },
    remove() {
      this.items.splice(Math.floor(Math.random() * this.items.length), 1)
    },
    shuffle() {
      this.items = shuffle(this.items)
    }
  }
}
</script>

<style>
/* 列表过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* 移动中的元素 */
.list-move {
  transition: transform 0.5s;
}
/* 让离开的元素脱离文档流 */
.list-leave-active {
  position: absolute;
}

/* 打乱过渡 */
.flip-list-move {
  transition: transform 0.5s;
}
</style>
```

### 16.3 状态过渡

```vue
<template>
  <div>
    <input v-model.number="number" type="number">
    <p>{{ animatedNumber }}</p>
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      number: 0,
      tweenedNumber: 0
    }
  },
  computed: {
    animatedNumber() {
      return this.tweenedNumber.toFixed(0)
    }
  },
  watch: {
    number(newValue) {
      gsap.to(this.$data, {
        duration: 0.5,
        tweenedNumber: newValue
      })
    }
  }
}
</script>
```

---

## 十七、生命周期

### 17.1 生命周期钩子

```javascript
export default {
  // 创建阶段
  beforeCreate() {
    // 实例初始化之后，数据观测和事件配置之前
    // 此时data、methods、computed、watch都不可用
    console.log('beforeCreate')
  },
  
  created() {
    // 实例创建完成后
    // data、methods、computed、watch已配置完成
    // 挂载阶段还没开始，$el不可用
    console.log('created')
    // 适合：发起异步请求、初始化数据
    this.fetchData()
  },
  
  // 挂载阶段
  beforeMount() {
    // 挂载开始之前
    // render函数首次被调用
    console.log('beforeMount')
  },
  
  mounted() {
    // 挂载完成
    // $el已创建，DOM可操作
    console.log('mounted')
    // 适合：DOM操作、第三方库初始化
    this.initChart()
  },
  
  // 更新阶段
  beforeUpdate() {
    // 数据更新时，DOM更新之前
    console.log('beforeUpdate')
  },
  
  updated() {
    // 数据更新导致DOM重新渲染后
    console.log('updated')
    // 避免在这里修改数据，可能导致无限循环
  },
  
  // 销毁阶段
  beforeDestroy() {
    // 实例销毁之前
    // 实例仍然完全可用
    console.log('beforeDestroy')
    // 适合：清理定时器、取消订阅、移除事件监听
    this.cleanup()
  },
  
  destroyed() {
    // 实例销毁后
    // 所有指令已解绑，事件监听器已移除，子实例已销毁
    console.log('destroyed')
  },
  
  // keep-alive相关
  activated() {
    // keep-alive组件激活时
    console.log('activated')
  },
  
  deactivated() {
    // keep-alive组件停用时
    console.log('deactivated')
  },
  
  // 错误捕获
  errorCaptured(err, vm, info) {
    // 捕获子孙组件的错误
    console.log('errorCaptured', err, info)
    // 返回false阻止错误继续传播
    return false
  }
}
```

### 17.2 父子组件生命周期顺序

```javascript
// 创建和挂载阶段
// 父beforeCreate -> 父created -> 父beforeMount
// -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted
// -> 父mounted

// 更新阶段
// 父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

// 销毁阶段
// 父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed
```

### 17.3 生命周期实践

```javascript
export default {
  data() {
    return {
      timer: null,
      chart: null,
      resizeHandler: null
    }
  },
  
  created() {
    // 初始化数据，发起请求
    this.fetchData()
    
    // 创建防抖函数
    this.debouncedSearch = debounce(this.search, 300)
  },
  
  mounted() {
    // 初始化图表
    this.chart = echarts.init(this.$refs.chart)
    this.renderChart()
    
    // 添加事件监听
    this.resizeHandler = () => {
      this.chart.resize()
    }
    window.addEventListener('resize', this.resizeHandler)
    
    // 启动定时器
    this.timer = setInterval(() => {
      this.refreshData()
    }, 30000)
  },
  
  beforeDestroy() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    // 移除事件监听
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    
    // 销毁图表实例
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    
    // 取消未完成的请求
    this.cancelRequest && this.cancelRequest()
  }
}
```

---

## 十八、Vue Router

### 18.1 基础配置

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于我们',
      requiresAuth: true
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true  // 将路由参数作为props传递
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',  // 'hash' | 'history' | 'abstract'
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
```

### 18.2 路由导航

```vue
<template>
  <div>
    <!-- 声明式导航 -->
    <router-link to="/">首页</router-link>
    <router-link :to="{ name: 'User', params: { id: 123 }}">用户</router-link>
    <router-link :to="{ path: '/search', query: { q: 'vue' }}">搜索</router-link>
    
    <!-- 带样式的router-link -->
    <router-link to="/about" active-class="active" exact>关于</router-link>
    
    <!-- 路由视图 -->
    <router-view></router-view>
    
    <!-- 命名视图 -->
    <router-view name="sidebar"></router-view>
    <router-view name="main"></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    // 编程式导航
    goToHome() {
      this.$router.push('/')
      this.$router.push({ path: '/' })
      this.$router.push({ name: 'Home' })
    },
    
    goToUser(id) {
      this.$router.push({ name: 'User', params: { id } })
      this.$router.push({ path: `/user/${id}` })
    },
    
    goToSearch(query) {
      this.$router.push({ path: '/search', query: { q: query } })
    },
    
    // 替换当前路由（不会留下历史记录）
    replace() {
      this.$router.replace('/new-page')
    },
    
    // 前进/后退
    goBack() {
      this.$router.go(-1)
      this.$router.back()
    },
    
    goForward() {
      this.$router.go(1)
      this.$router.forward()
    }
  }
}
</script>
```

### 18.3 路由参数

```javascript
// 路由配置
const routes = [
  // 动态路径参数
  { path: '/user/:id', component: User },
  
  // 多个参数
  { path: '/user/:userId/post/:postId', component: Post },
  
  // 可选参数
  { path: '/user/:id?' , component: User },
  
  // 正则匹配
  { path: '/user/:id(\\d+)', component: User },  // 只匹配数字
  
  // 通配符
  { path: '/user-*', component: User },  // 匹配 /user-xxx
  { path: '*', component: NotFound }      // 匹配所有
]
```

```javascript
// 获取路由参数
export default {
  created() {
    // 路径参数
    console.log(this.$route.params.id)
    
    // 查询参数
    console.log(this.$route.query.q)
    
    // 完整路径
    console.log(this.$route.fullPath)
    
    // 路由名称
    console.log(this.$route.name)
    
    // 路由元信息
    console.log(this.$route.meta)
    
    // 匹配的路由记录
    console.log(this.$route.matched)
  },
  
  // 监听路由变化
  watch: {
    '$route'(to, from) {
      console.log('路由变化', to, from)
      this.fetchData(to.params.id)
    },
    
    '$route.params.id'(newId) {
      this.fetchData(newId)
    }
  },
  
  // 使用导航守卫
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params.id)
    next()
  }
}
```

### 18.4 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: '',  // /user/:id
        component: UserHome
      },
      {
        path: 'profile',  // /user/:id/profile
        component: UserProfile
      },
      {
        path: 'posts',  // /user/:id/posts
        component: UserPosts
      }
    ]
  }
]
```

```vue
<!-- User.vue -->
<template>
  <div class="user">
    <h2>用户 {{ $route.params.id }}</h2>
    <router-view></router-view>
  </div>
</template>
```

### 18.5 命名视图

```javascript
const routes = [
  {
    path: '/',
    components: {
      default: Main,
      sidebar: Sidebar,
      header: Header
    }
  }
]
```

```vue
<template>
  <div>
    <router-view name="header"></router-view>
    <router-view name="sidebar"></router-view>
    <router-view></router-view>  <!-- default -->
  </div>
</template>
```

### 18.6 导航守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查登录状态
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // 在导航被确认之前，所有组件内守卫和异步路由组件被解析之后调用
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题'
  
  // 发送页面访问统计
  analytics.track(to.fullPath)
})
```

```javascript
// 路由独享守卫
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (hasAdminPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

```javascript
// 组件内守卫
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被确认前调用
    // 不能获取组件实例 `this`
    next(vm => {
      // 通过回调访问组件实例
      vm.fetchData(to.params.id)
    })
  },
  
  beforeRouteUpdate(to, from, next) {
    // 当前路由改变，但组件被复用时调用
    // 可以访问组件实例 `this`
    this.fetchData(to.params.id)
    next()
  },
  
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件时调用
    // 可以访问组件实例 `this`
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('有未保存的修改，确定离开吗？')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
```

### 18.7 路由懒加载

```javascript
// 路由懒加载
const routes = [
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  }
]

// 按组分块
const routes = [
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/User.vue'),
    children: [
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "user" */ '@/views/UserProfile.vue')
      },
      {
        path: 'posts',
        component: () => import(/* webpackChunkName: "user" */ '@/views/UserPosts.vue')
      }
    ]
  }
]
```

---

## 十九、Vuex状态管理

### 19.1 基础配置

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: null,
    todos: []
  },
  
  getters: {
    doubleCount: state => state.count * 2,
    doneTodos: state => state.todos.filter(todo => todo.done),
    getTodoById: state => id => state.todos.find(todo => todo.id === id)
  },
  
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo)
    }
  },
  
  actions: {
    increment({ commit }) {
      commit('INCREMENT')
    },
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId)
      commit('SET_USER', user)
    },
    async addTodo({ commit }, todo) {
      const newTodo = await api.createTodo(todo)
      commit('ADD_TODO', newTodo)
    }
  },
  
  modules: {
    // 模块
  }
})
```

### 19.2 在组件中使用

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
    <button @click="asyncIncrement">异步增加</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    // 基础访问
    count() {
      return this.$store.state.count
    },
    
    // mapState辅助函数
    ...mapState(['count', 'user', 'todos']),
    
    // 重命名
    ...mapState({
      myCount: 'count',
      currentUser: 'user'
    }),
    
    // 函数形式
    ...mapState({
      countPlusOne: state => state.count + 1
    }),
    
    // mapGetters辅助函数
    ...mapGetters(['doubleCount', 'doneTodos']),
    
    // 重命名
    ...mapGetters({
      doneCount: 'doneTodosCount'
    })
  },
  
  methods: {
    // 基础提交
    increment() {
      this.$store.commit('INCREMENT')
    },
    
    // mapMutations辅助函数
    ...mapMutations(['INCREMENT', 'SET_USER']),
    
    // 重命名
    ...mapMutations({
      add: 'INCREMENT'
    }),
    
    // 基础分发
    asyncIncrement() {
      this.$store.dispatch('increment')
    },
    
    // mapActions辅助函数
    ...mapActions(['increment', 'fetchUser']),
    
    // 重命名
    ...mapActions({
      asyncAdd: 'increment'
    })
  }
}
</script>
```

### 19.3 模块化

```javascript
// store/modules/user.js
export default {
  namespaced: true,
  
  state: () => ({
    info: null,
    token: '',
    permissions: []
  }),
  
  getters: {
    isLoggedIn: state => !!state.token,
    hasPermission: state => permission => state.permissions.includes(permission)
  },
  
  mutations: {
    SET_INFO(state, info) {
      state.info = info
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
    },
    CLEAR(state) {
      state.info = null
      state.token = ''
      state.permissions = []
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      const { token, user, permissions } = await api.login(credentials)
      commit('SET_TOKEN', token)
      commit('SET_INFO', user)
      commit('SET_PERMISSIONS', permissions)
    },
    
    async logout({ commit }) {
      await api.logout()
      commit('CLEAR')
    },
    
    // 在模块中访问根状态
    async fetchUserInfo({ commit, rootState, rootGetters }) {
      const userId = rootState.app.currentUserId
      const info = await api.getUserInfo(userId)
      commit('SET_INFO', info)
    }
  }
}

// store/modules/cart.js
export default {
  namespaced: true,
  
  state: () => ({
    items: []
  }),
  
  getters: {
    totalCount: state => state.items.reduce((sum, item) => sum + item.count, 0),
    totalPrice: state => state.items.reduce((sum, item) => sum + item.price * item.count, 0)
  },
  
  mutations: {
    ADD_ITEM(state, item) {
      const existing = state.items.find(i => i.id === item.id)
      if (existing) {
        existing.count++
      } else {
        state.items.push({ ...item, count: 1 })
      }
    },
    REMOVE_ITEM(state, itemId) {
      const index = state.items.findIndex(i => i.id === itemId)
      if (index > -1) {
        state.items.splice(index, 1)
      }
    },
    UPDATE_COUNT(state, { itemId, count }) {
      const item = state.items.find(i => i.id === itemId)
      if (item) {
        item.count = count
      }
    },
    CLEAR(state) {
      state.items = []
    }
  },
  
  actions: {
    addItem({ commit }, item) {
      commit('ADD_ITEM', item)
    },
    removeItem({ commit }, itemId) {
      commit('REMOVE_ITEM', itemId)
    },
    async checkout({ commit, state }) {
      await api.checkout(state.items)
      commit('CLEAR')
    }
  }
}
```

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 根状态
  },
  modules: {
    user,
    cart
  }
})
```

```vue
<!-- 在组件中使用模块 -->
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    // 访问模块状态
    ...mapState('user', ['info', 'token']),
    ...mapState('cart', ['items']),
    
    // 访问模块getters
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('cart', ['totalCount', 'totalPrice']),
    
    // 直接访问
    userInfo() {
      return this.$store.state.user.info
    }
  },
  
  methods: {
    // 访问模块actions
    ...mapActions('user', ['login', 'logout']),
    ...mapActions('cart', ['addItem', 'checkout']),
    
    // 直接调用
    async handleLogin() {
      await this.$store.dispatch('user/login', this.form)
    }
  }
}
</script>
```

### 19.4 Vuex插件

```javascript
// 持久化插件
const persistPlugin = store => {
  // 初始化时从localStorage恢复
  const savedState = localStorage.getItem('vuex-state')
  if (savedState) {
    store.replaceState(JSON.parse(savedState))
  }
  
  // 订阅mutation
  store.subscribe((mutation, state) => {
    localStorage.setItem('vuex-state', JSON.stringify(state))
  })
}

// 日志插件
const loggerPlugin = store => {
  store.subscribe((mutation, state) => {
    console.log('mutation:', mutation.type)
    console.log('payload:', mutation.payload)
    console.log('state:', state)
  })
}

// 使用插件
export default new Vuex.Store({
  // ...
  plugins: [persistPlugin, loggerPlugin]
})
```

---

## 二十、封装组件最佳实践

### 20.1 通用Button组件

```vue
<!-- components/BaseButton.vue -->
<template>
  <button
    :class="[
      'base-button',
      `base-button--${type}`,
      `base-button--${size}`,
      {
        'base-button--disabled': disabled,
        'base-button--loading': loading,
        'base-button--block': block
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__loading">
      <i class="loading-icon"></i>
    </span>
    <span v-if="icon && !loading" class="base-button__icon">
      <i :class="icon"></i>
    </span>
    <span class="base-button__text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  
  props: {
    type: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.base-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.base-button--small {
  padding: 5px 10px;
  font-size: 12px;
}

.base-button--large {
  padding: 12px 24px;
  font-size: 16px;
}

.base-button--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.base-button--block {
  width: 100%;
}

.base-button__loading,
.base-button__icon {
  margin-right: 5px;
}
</style>
```

### 20.2 通用Modal组件

```vue
<!-- components/BaseModal.vue -->
<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-mask" @click.self="handleMaskClick">
      <div class="modal-container" :style="containerStyle">
        <!-- 头部 -->
        <div v-if="showHeader" class="modal-header">
          <slot name="header">
            <span class="modal-title">{{ title }}</span>
          </slot>
          <button v-if="showClose" class="modal-close" @click="handleClose">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <!-- 内容 -->
        <div class="modal-body" :style="bodyStyle">
          <slot></slot>
        </div>
        
        <!-- 底部 -->
        <div v-if="showFooter" class="modal-footer">
          <slot name="footer">
            <base-button @click="handleCancel">{{ cancelText }}</base-button>
            <base-button type="primary" :loading="confirmLoading" @click="handleConfirm">
              {{ confirmText }}
            </base-button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseModal',
  
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: [String, Number],
      default: 520
    },
    maxHeight: {
      type: [String, Number],
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    containerStyle() {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width
      }
    },
    bodyStyle() {
      if (!this.maxHeight) return {}
      const height = typeof this.maxHeight === 'number' ? `${this.maxHeight}px` : this.maxHeight
      return {
        maxHeight: height,
        overflow: 'auto'
      }
    }
  },
  
  watch: {
    visible(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
        this.$emit('open')
      } else {
        document.body.style.overflow = ''
        this.$emit('close')
      }
    }
  },
  
  beforeDestroy() {
    document.body.style.overflow = ''
  },
  
  methods: {
    handleMaskClick() {
      if (this.maskClosable) {
        this.handleClose()
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('cancel')
      this.handleClose()
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.modal-body {
  padding: 24px;
  flex: 1;
}

.modal-footer {
  padding: 10px 16px;
  border-top: 1px solid #e8e8e8;
  text-align: right;
}

.modal-footer .base-button + .base-button {
  margin-left: 8px;
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
```

### 20.3 通用Table组件

```vue
<!-- components/BaseTable.vue -->
<template>
  <div class="base-table">
    <!-- 工具栏 -->
    <div v-if="$slots.toolbar" class="base-table__toolbar">
      <slot name="toolbar"></slot>
    </div>
    
    <!-- 表格 -->
    <table class="base-table__table">
      <thead>
        <tr>
          <th v-if="selection" class="base-table__selection">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate.prop="isIndeterminate"
              @change="handleSelectAll"
            >
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="{ sortable: column.sortable }"
            @click="column.sortable && handleSort(column.key)"
          >
            <slot :name="`header-${column.key}`" :column="column">
              {{ column.title }}
            </slot>
            <span v-if="column.sortable" class="sort-icon">
              {{ getSortIcon(column.key) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="totalColumns" class="base-table__loading">
            <slot name="loading">加载中...</slot>
          </td>
        </tr>
        <tr v-else-if="!data.length">
          <td :colspan="totalColumns" class="base-table__empty">
            <slot name="empty">暂无数据</slot>
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowKey ? row[rowKey] : rowIndex"
            :class="{ selected: isSelected(row) }"
            @click="handleRowClick(row, rowIndex)"
          >
            <td v-if="selection" class="base-table__selection">
              <input
                type="checkbox"
                :checked="isSelected(row)"
                @change="handleSelect(row)"
                @click.stop
              >
            </td>
            <td v-for="column in columns" :key="column.key">
              <slot
                :name="column.key"
                :row="row"
                :column="column"
                :index="rowIndex"
                :value="row[column.key]"
              >
                {{ formatValue(row[column.key], column) }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div v-if="pagination" class="base-table__pagination">
      <slot name="pagination" :pagination="pagination">
        <span>共 {{ pagination.total }} 条</span>
        <button
          :disabled="pagination.current <= 1"
          @click="handlePageChange(pagination.current - 1)"
        >
          上一页
        </button>
        <span>{{ pagination.current }} / {{ totalPages }}</span>
        <button
          :disabled="pagination.current >= totalPages"
          @click="handlePageChange(pagination.current + 1)"
        >
          下一页
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    loading: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: null
    }
  },
  
  data() {
    return {
      sortKey: '',
      sortOrder: ''  // 'asc' | 'desc'
    }
  },
  
  computed: {
    totalColumns() {
      return this.columns.length + (this.selection ? 1 : 0)
    },
    isAllSelected() {
      return this.data.length > 0 && this.selectedRows.length === this.data.length
    },
    isIndeterminate() {
      return this.selectedRows.length > 0 && this.selectedRows.length < this.data.length
    },
    totalPages() {
      if (!this.pagination) return 0
      return Math.ceil(this.pagination.total / this.pagination.pageSize)
    }
  },
  
  methods: {
    formatValue(value, column) {
      if (column.formatter) {
        return column.formatter(value)
      }
      return value
    },
    
    isSelected(row) {
      return this.selectedRows.some(r => r[this.rowKey] === row[this.rowKey])
    },
    
    handleSelect(row) {
      const newSelection = this.isSelected(row)
        ? this.selectedRows.filter(r => r[this.rowKey] !== row[this.rowKey])
        : [...this.selectedRows, row]
      this.$emit('update:selectedRows', newSelection)
      this.$emit('selection-change', newSelection)
    },
    
    handleSelectAll(e) {
      const newSelection = e.target.checked ? [...this.data] : []
      this.$emit('update:selectedRows', newSelection)
      this.$emit('selection-change', newSelection)
    },
    
    handleRowClick(row, index) {
      this.$emit('row-click', row, index)
    },
    
    handleSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
      this.$emit('sort-change', { key: this.sortKey, order: this.sortOrder })
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return '↕'
      return this.sortOrder === 'asc' ? '↑' : '↓'
    },
    
    handlePageChange(page) {
      this.$emit('page-change', page)
    }
  }
}
</script>
```

### 20.4 通用Form组件

```vue
<!-- components/BaseForm.vue -->
<template>
  <form class="base-form" :class="{ inline: inline }" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'BaseForm',
  
  provide() {
    return {
      baseForm: this
    }
  },
  
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    inline: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    labelPosition: {
      type: String,
      default: 'right',
      validator: val => ['left', 'right', 'top'].includes(val)
    }
  },
  
  data() {
    return {
      fields: []
    }
  },
  
  methods: {
    addField(field) {
      this.fields.push(field)
    },
    
    removeField(field) {
      const index = this.fields.indexOf(field)
      if (index > -1) {
        this.fields.splice(index, 1)
      }
    },
    
    async validate() {
      const results = await Promise.all(
        this.fields.map(field => field.validate())
      )
      return results.every(result => result)
    },
    
    resetFields() {
      this.fields.forEach(field => field.resetField())
    },
    
    clearValidate() {
      this.fields.forEach(field => field.clearValidate())
    },
    
    async handleSubmit() {
      const valid = await this.validate()
      if (valid) {
        this.$emit('submit', this.model)
      }
    }
  }
}
</script>

<!-- components/BaseFormItem.vue -->
<template>
  <div
    class="base-form-item"
    :class="{
      'is-error': error,
      'is-required': isRequired
    }"
  >
    <label
      v-if="label"
      class="base-form-item__label"
      :style="labelStyle"
    >
      {{ label }}
    </label>
    <div class="base-form-item__content">
      <slot></slot>
      <transition name="fade">
        <div v-if="error" class="base-form-item__error">
          {{ error }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseFormItem',
  
  inject: ['baseForm'],
  
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    rules: {
      type: [Object, Array],
      default: null
    }
  },
  
  data() {
    return {
      error: '',
      initialValue: null
    }
  },
  
  computed: {
    fieldValue() {
      return this.baseForm.model[this.prop]
    },
    
    fieldRules() {
      const formRules = this.baseForm.rules[this.prop] || []
      const selfRules = this.rules || []
      return [].concat(selfRules, formRules)
    },
    
    isRequired() {
      return this.fieldRules.some(rule => rule.required)
    },
    
    labelStyle() {
      return {
        width: this.baseForm.labelWidth,
        textAlign: this.baseForm.labelPosition
      }
    }
  },
  
  watch: {
    fieldValue() {
      this.validate()
    }
  },
  
  mounted() {
    if (this.prop) {
      this.baseForm.addField(this)
      this.initialValue = this.fieldValue
    }
  },
  
  beforeDestroy() {
    if (this.prop) {
      this.baseForm.removeField(this)
    }
  },
  
  methods: {
    async validate() {
      if (!this.prop || !this.fieldRules.length) {
        return true
      }
      
      this.error = ''
      
      for (const rule of this.fieldRules) {
        // 必填验证
        if (rule.required) {
          const isEmpty = this.fieldValue === '' || 
                         this.fieldValue === null || 
                         this.fieldValue === undefined ||
                         (Array.isArray(this.fieldValue) && !this.fieldValue.length)
          if (isEmpty) {
            this.error = rule.message || `${this.label}不能为空`
            return false
          }
        }
        
        // 最小长度
        if (rule.min && this.fieldValue && this.fieldValue.length < rule.min) {
          this.error = rule.message || `${this.label}不能少于${rule.min}个字符`
          return false
        }
        
        // 最大长度
        if (rule.max && this.fieldValue && this.fieldValue.length > rule.max) {
          this.error = rule.message || `${this.label}不能超过${rule.max}个字符`
          return false
        }
        
        // 正则验证
        if (rule.pattern && !rule.pattern.test(this.fieldValue)) {
          this.error = rule.message || `${this.label}格式不正确`
          return false
        }
        
        // 自定义验证
        if (rule.validator) {
          try {
            await rule.validator(rule, this.fieldValue)
          } catch (e) {
            this.error = e.message || rule.message
            return false
          }
        }
      }
      
      return true
    },
    
    resetField() {
      this.error = ''
      this.baseForm.model[this.prop] = this.initialValue
    },
    
    clearValidate() {
      this.error = ''
    }
  }
}
</script>
```

---

## 附录：Vue2核心API速查

### 全局API

```javascript
Vue.component(id, definition)    // 注册全局组件
Vue.directive(id, definition)    // 注册全局指令
Vue.filter(id, definition)       // 注册全局过滤器
Vue.mixin(mixin)                 // 全局混入
Vue.use(plugin)                  // 使用插件
Vue.extend(options)              // 创建子类
Vue.nextTick(callback)           // DOM更新后回调
Vue.set(target, key, value)      // 响应式设置属性
Vue.delete(target, key)          // 响应式删除属性
Vue.observable(object)           // 创建响应式对象
Vue.version                      // Vue版本
```

### 实例属性

```javascript
vm.$data          // 数据对象
vm.$props         // props对象
vm.$el            // 根DOM元素
vm.$options       // 实例化选项
vm.$parent        // 父实例
vm.$root          // 根实例
vm.$children      // 子组件
vm.$refs          // DOM引用
vm.$slots         // 插槽内容
vm.$scopedSlots   // 作用域插槽
vm.$attrs         // 非prop属性
vm.$listeners     // 事件监听器
```

### 实例方法

```javascript
vm.$watch(exp, callback, options)    // 监听表达式
vm.$set(target, key, value)          // 响应式设置
vm.$delete(target, key)              // 响应式删除
vm.$on(event, callback)              // 监听事件
vm.$once(event, callback)            // 监听一次
vm.$off(event, callback)             // 移除监听
vm.$emit(event, ...args)             // 触发事件
vm.$mount(el)                        // 挂载实例
vm.$forceUpdate()                    // 强制更新
vm.$nextTick(callback)               // DOM更新回调
vm.$destroy()                        // 销毁实例
```

---

以上是Vue2完整语法详解，涵盖了所有核心概念和实用示例。
