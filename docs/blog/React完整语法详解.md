# React 完整语法详解
<div class="doc-toc">
## 目录
1. [React 简介与环境搭建](#1-react-简介与环境搭建)
2. [JSX 语法详解](#2-jsx-语法详解)
3. [组件基础](#3-组件基础)
4. [Props 属性](#4-props-属性)
5. [State 状态](#5-state-状态)
6. [生命周期](#6-生命周期)
7. [事件处理](#7-事件处理)
8. [条件渲染](#8-条件渲染)
9. [列表渲染](#9-列表渲染)
10. [表单处理](#10-表单处理)
11. [Refs 引用](#11-refs-引用)
12. [Context 上下文](#12-context-上下文)
13. [高阶组件 HOC](#13-高阶组件-hoc)
14. [Render Props](#14-render-props)
15. [错误边界](#15-错误边界)
16. [Portals 传送门](#16-portals-传送门)
17. [Fragment 片段](#17-fragment-片段)
18. [严格模式](#18-严格模式)
19. [代码分割与懒加载](#19-代码分割与懒加载)
20. [性能优化](#20-性能优化)


</div>

---

## 1. React 简介与环境搭建

### 1.1 React 是什么

React 是 Facebook 开发的用于构建用户界面的 JavaScript 库，采用组件化开发模式和虚拟 DOM 技术。

### 1.2 核心特点

- **声明式编程**：描述 UI 应该是什么样子
- **组件化**：将 UI 拆分为独立可复用的组件
- **虚拟 DOM**：高效的 DOM 更新机制
- **单向数据流**：数据从父组件流向子组件
- **JSX 语法**：JavaScript 和 HTML 的结合

### 1.3 环境搭建

```bash
# 使用 Create React App 创建项目
npx create-react-app my-app
cd my-app
npm start

# 使用 Vite 创建项目（推荐，更快）
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

### 1.4 项目结构

```
my-app/
├── node_modules/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

### 1.5 基本入口文件

```jsx
// index.js - React 18 入口
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. JSX 语法详解

### 2.1 什么是 JSX

JSX 是 JavaScript 的语法扩展，允许在 JavaScript 中编写类似 HTML 的代码。

```jsx
// JSX 语法
const element = <h1>Hello, React!</h1>;

// 编译后的 JavaScript
const element = React.createElement('h1', null, 'Hello, React!');
```

### 2.2 JSX 表达式

```jsx
// 在 JSX 中使用 JavaScript 表达式
const name = '张三';
const age = 25;

// 变量插值
const element1 = <h1>Hello, {name}</h1>;

// 表达式计算
const element2 = <p>年龄: {age + 1}</p>;

// 函数调用
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
const user = { firstName: '张', lastName: '三' };
const element3 = <h1>Hello, {formatName(user)}</h1>;

// 三元表达式
const isLoggedIn = true;
const element4 = <p>{isLoggedIn ? '已登录' : '未登录'}</p>;
```

### 2.3 JSX 属性

```jsx
// 字符串属性
const element1 = <img src="avatar.png" alt="头像" />;

// 表达式属性
const imgUrl = 'https://example.com/avatar.png';
const element2 = <img src={imgUrl} alt="头像" />;

// class 使用 className
const element3 = <div className="container">内容</div>;

// style 使用对象
const styles = { color: 'red', fontSize: '16px' };
const element4 = <p style={styles}>红色文字</p>;

// 内联 style
const element5 = <p style={{ color: 'blue', fontWeight: 'bold' }}>蓝色粗体</p>;

// for 使用 htmlFor
const element6 = <label htmlFor="username">用户名</label>;

// tabindex 使用 tabIndex
const element7 = <input tabIndex={1} />;

// 布尔属性
const element8 = <input type="checkbox" checked={true} disabled={false} />;

// 展开属性
const props = { id: 'myInput', type: 'text', placeholder: '请输入' };
const element9 = <input {...props} />;
```

### 2.4 JSX 子元素

```jsx
// 字符串子元素
const element1 = <p>这是一段文字</p>;

// JSX 子元素
const element2 = (
  <div>
    <h1>标题</h1>
    <p>段落</p>
  </div>
);

// 表达式子元素
const items = ['苹果', '香蕉', '橙子'];
const element3 = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// 函数作为子元素
const element4 = (
  <div>
    {(() => {
      return <span>函数返回的内容</span>;
    })()}
  </div>
);

// 布尔值、null、undefined 不会渲染
const element5 = (
  <div>
    {true}
    {false}
    {null}
    {undefined}
  </div>
);
```

### 2.5 JSX 注释

```jsx
const element = (
  <div>
    {/* 这是 JSX 注释 */}
    <h1>标题</h1>
    {
      // 单行注释
    }
    <p>段落</p>
  </div>
);
```

### 2.6 JSX 防注入攻击

```jsx
// React 会自动转义，防止 XSS 攻击
const userInput = '<script>alert("XSS")</script>';
const element = <p>{userInput}</p>; // 安全，会显示原始文本

// 如果确实需要渲染 HTML（谨慎使用）
const htmlContent = '<strong>加粗文字</strong>';
const element2 = <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
```

---

## 3. 组件基础

### 3.1 函数组件

```jsx
// 基本函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 箭头函数组件
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 简写形式
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// 解构 props
const Welcome = ({ name, age }) => (
  <div>
    <h1>Hello, {name}</h1>
    <p>Age: {age}</p>
  </div>
);

// 使用组件
function App() {
  return (
    <div>
      <Welcome name="张三" age={25} />
      <Welcome name="李四" age={30} />
    </div>
  );
}
```

### 3.2 类组件

```jsx
import React, { Component } from 'react';

// 基本类组件
class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 完整的类组件
class Counter extends Component {
  // 构造函数
  constructor(props) {
    super(props);
    // 初始化状态
    this.state = {
      count: 0
    };
    // 绑定方法
    this.handleClick = this.handleClick.bind(this);
  }

  // 事件处理方法
  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  // 渲染方法
  render() {
    return (
      <div>
        <p>计数: {this.state.count}</p>
        <button onClick={this.handleClick}>增加</button>
      </div>
    );
  }
}

// 使用类属性语法（推荐）
class Counter extends Component {
  state = {
    count: 0
  };

  // 箭头函数自动绑定 this
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>计数: {this.state.count}</p>
        <button onClick={this.handleClick}>增加</button>
      </div>
    );
  }
}
```

### 3.3 组件组合

```jsx
// 组件嵌套
function Header() {
  return <header><h1>网站标题</h1></header>;
}

function Sidebar() {
  return <aside>侧边栏内容</aside>;
}

function Content() {
  return <main>主要内容</main>;
}

function Footer() {
  return <footer>页脚信息</footer>;
}

function App() {
  return (
    <div className="app">
      <Header />
      <div className="body">
        <Sidebar />
        <Content />
      </div>
      <Footer />
    </div>
  );
}
```

### 3.4 组件拆分原则

```jsx
// 拆分前 - 一个大组件
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <div className="user-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.bio}</p>
      </div>
      <div className="user-actions">
        <button>关注</button>
        <button>发消息</button>
      </div>
    </div>
  );
}

// 拆分后 - 多个小组件
function Avatar({ src, alt }) {
  return <img className="avatar" src={src} alt={alt} />;
}

function UserInfo({ name, email, bio }) {
  return (
    <div className="user-info">
      <h2>{name}</h2>
      <p>{email}</p>
      <p>{bio}</p>
    </div>
  );
}

function UserActions({ onFollow, onMessage }) {
  return (
    <div className="user-actions">
      <button onClick={onFollow}>关注</button>
      <button onClick={onMessage}>发消息</button>
    </div>
  );
}

function UserCard({ user, onFollow, onMessage }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} email={user.email} bio={user.bio} />
      <UserActions onFollow={onFollow} onMessage={onMessage} />
    </div>
  );
}
```

---

## 4. Props 属性

### 4.1 Props 基础

```jsx
// 传递 props
function App() {
  return (
    <UserCard 
      name="张三"
      age={25}
      isAdmin={true}
      hobbies={['读书', '游泳']}
      address={{ city: '北京', district: '朝阳' }}
      onClick={() => console.log('clicked')}
    />
  );
}

// 接收 props
function UserCard(props) {
  return (
    <div>
      <p>姓名: {props.name}</p>
      <p>年龄: {props.age}</p>
      <p>管理员: {props.isAdmin ? '是' : '否'}</p>
      <p>爱好: {props.hobbies.join(', ')}</p>
      <p>地址: {props.address.city} {props.address.district}</p>
      <button onClick={props.onClick}>点击</button>
    </div>
  );
}
```

### 4.2 Props 解构

```jsx
// 函数参数解构
function UserCard({ name, age, isAdmin = false, hobbies = [] }) {
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <p>管理员: {isAdmin ? '是' : '否'}</p>
      <p>爱好: {hobbies.join(', ')}</p>
    </div>
  );
}

// 函数体内解构
function UserCard(props) {
  const { name, age, ...rest } = props;
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <OtherComponent {...rest} />
    </div>
  );
}
```

### 4.3 children 属性

```jsx
// 传递 children
function App() {
  return (
    <Card title="卡片标题">
      <p>这是卡片内容</p>
      <button>按钮</button>
    </Card>
  );
}

// 使用 children
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
}

// children 作为函数（Render Props 模式）
function DataProvider({ children }) {
  const data = { name: '张三', age: 25 };
  return children(data);
}

function App() {
  return (
    <DataProvider>
      {(data) => (
        <div>
          <p>姓名: {data.name}</p>
          <p>年龄: {data.age}</p>
        </div>
      )}
    </DataProvider>
  );
}
```

### 4.4 Props 默认值

```jsx
// 函数组件默认值 - 参数默认值
function Button({ type = 'primary', size = 'medium', children }) {
  return (
    <button className={`btn btn-${type} btn-${size}`}>
      {children}
    </button>
  );
}

// 函数组件默认值 - defaultProps（不推荐，已废弃）
function Button({ type, size, children }) {
  return (
    <button className={`btn btn-${type} btn-${size}`}>
      {children}
    </button>
  );
}
Button.defaultProps = {
  type: 'primary',
  size: 'medium'
};

// 类组件默认值
class Button extends Component {
  static defaultProps = {
    type: 'primary',
    size: 'medium'
  };

  render() {
    const { type, size, children } = this.props;
    return (
      <button className={`btn btn-${type} btn-${size}`}>
        {children}
      </button>
    );
  }
}
```

### 4.5 Props 类型检查

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, email, isAdmin, hobbies, address, onClick }) {
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <p>邮箱: {email}</p>
    </div>
  );
}

// PropTypes 类型检查
UserCard.propTypes = {
  // 基本类型
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string,
  isAdmin: PropTypes.bool,
  
  // 数组
  hobbies: PropTypes.array,
  hobbies: PropTypes.arrayOf(PropTypes.string),
  
  // 对象
  address: PropTypes.object,
  address: PropTypes.shape({
    city: PropTypes.string,
    district: PropTypes.string
  }),
  
  // 函数
  onClick: PropTypes.func,
  
  // 多种类型之一
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  
  // 枚举值
  status: PropTypes.oneOf(['active', 'inactive', 'pending']),
  
  // 任意类型
  data: PropTypes.any,
  
  // 可渲染内容
  children: PropTypes.node,
  
  // React 元素
  icon: PropTypes.element,
  
  // 类的实例
  date: PropTypes.instanceOf(Date),
  
  // 自定义验证
  customProp: function(props, propName, componentName) {
    if (!/^[a-z]+$/.test(props[propName])) {
      return new Error(`${componentName} 的 ${propName} 必须是小写字母`);
    }
  }
};
```

### 4.6 Props 只读性

```jsx
// Props 是只读的，不能修改
function Welcome(props) {
  // 错误！不能修改 props
  // props.name = '李四';
  
  // 正确：使用本地变量
  const displayName = props.name.toUpperCase();
  
  return <h1>Hello, {displayName}</h1>;
}
```

---

## 5. State 状态

### 5.1 类组件 State

```jsx
class Counter extends Component {
  // 方式1：构造函数中初始化
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: '计数器'
    };
  }

  // 方式2：类属性语法（推荐）
  state = {
    count: 0,
    name: '计数器'
  };

  render() {
    return (
      <div>
        <h2>{this.state.name}</h2>
        <p>计数: {this.state.count}</p>
      </div>
    );
  }
}
```

### 5.2 setState 方法

```jsx
class Counter extends Component {
  state = {
    count: 0,
    name: '计数器'
  };

  // 对象形式
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  // 函数形式（推荐，可获取最新 state）
  increment = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1
    }));
  };

  // 带回调的 setState
  increment = () => {
    this.setState(
      (prevState) => ({ count: prevState.count + 1 }),
      () => {
        // 状态更新完成后的回调
        console.log('当前计数:', this.state.count);
      }
    );
  };

  // setState 是异步的
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count); // 可能还是旧值
  };

  // 批量更新会合并
  handleClick = () => {
    // 这三次调用会被合并，最终只加 1
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
  };

  // 使用函数形式避免合并问题
  handleClick = () => {
    // 这三次调用会依次执行，最终加 3
    this.setState((prev) => ({ count: prev.count + 1 }));
    this.setState((prev) => ({ count: prev.count + 1 }));
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>计数: {this.state.count}</p>
        <button onClick={this.increment}>增加</button>
      </div>
    );
  }
}
```

### 5.3 State 更新原则

```jsx
class App extends Component {
  state = {
    user: {
      name: '张三',
      age: 25,
      address: {
        city: '北京',
        district: '朝阳'
      }
    },
    items: ['苹果', '香蕉']
  };

  // 更新嵌套对象 - 创建新对象
  updateCity = () => {
    this.setState({
      user: {
        ...this.state.user,
        address: {
          ...this.state.user.address,
          city: '上海'
        }
      }
    });
  };

  // 更新数组 - 添加元素
  addItem = () => {
    this.setState({
      items: [...this.state.items, '橙子']
    });
  };

  // 更新数组 - 删除元素
  removeItem = (index) => {
    this.setState({
      items: this.state.items.filter((_, i) => i !== index)
    });
  };

  // 更新数组 - 修改元素
  updateItem = (index, newValue) => {
    this.setState({
      items: this.state.items.map((item, i) => 
        i === index ? newValue : item
      )
    });
  };

  render() {
    return (
      <div>
        <p>城市: {this.state.user.address.city}</p>
        <button onClick={this.updateCity}>更新城市</button>
        <ul>
          {this.state.items.map((item, index) => (
            <li key={index}>
              {item}
              <button onClick={() => this.removeItem(index)}>删除</button>
            </li>
          ))}
        </ul>
        <button onClick={this.addItem}>添加水果</button>
      </div>
    );
  }
}
```

### 5.4 State 提升

```jsx
// 状态提升：将共享状态提升到共同的父组件

// 温度输入组件
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  const scaleNames = { c: '摄氏', f: '华氏' };
  
  return (
    <fieldset>
      <legend>输入{scaleNames[scale]}温度:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}

// 父组件管理共享状态
class Calculator extends Component {
  state = {
    temperature: '',
    scale: 'c'
  };

  handleCelsiusChange = (temperature) => {
    this.setState({ scale: 'c', temperature });
  };

  handleFahrenheitChange = (temperature) => {
    this.setState({ scale: 'f', temperature });
  };

  render() {
    const { scale, temperature } = this.state;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange}
        />
      </div>
    );
  }
}

// 转换函数
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) return '';
  const output = convert(input);
  return Math.round(output * 1000) / 1000;
}
```

---

## 6. 生命周期

### 6.1 生命周期概述

```
挂载阶段: constructor -> getDerivedStateFromProps -> render -> componentDidMount
更新阶段: getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate
卸载阶段: componentWillUnmount
错误处理: getDerivedStateFromError -> componentDidCatch
```

### 6.2 挂载阶段

```jsx
class LifecycleDemo extends Component {
  // 1. 构造函数 - 初始化 state，绑定方法
  constructor(props) {
    super(props);
    console.log('1. constructor');
    this.state = {
      count: 0
    };
  }

  // 2. 从 props 派生 state（静态方法）
  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps');
    // 返回新的 state 或 null
    if (props.initialCount !== state.prevInitialCount) {
      return {
        count: props.initialCount,
        prevInitialCount: props.initialCount
      };
    }
    return null;
  }

  // 3. render - 渲染 UI
  render() {
    console.log('3. render');
    return (
      <div>
        <p>计数: {this.state.count}</p>
      </div>
    );
  }

  // 4. 组件挂载完成 - 可以进行 DOM 操作、网络请求
  componentDidMount() {
    console.log('4. componentDidMount');
    // 适合进行：
    // - 网络请求
    // - DOM 操作
    // - 订阅事件
    // - 设置定时器
  }
}
```

### 6.3 更新阶段

```jsx
class LifecycleDemo extends Component {
  state = { count: 0 };

  // 1. getDerivedStateFromProps（同挂载阶段）

  // 2. 是否应该更新 - 性能优化
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    // 返回 false 阻止更新
    return nextState.count !== this.state.count;
  }

  // 3. render（同挂载阶段）

  // 4. 获取更新前的快照
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate');
    // 返回值会传给 componentDidUpdate 的第三个参数
    return { scrollTop: document.body.scrollTop };
  }

  // 5. 组件更新完成
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate');
    // 可以访问 snapshot
    console.log('之前的滚动位置:', snapshot?.scrollTop);
    
    // 可以进行条件性的副作用操作
    if (prevState.count !== this.state.count) {
      // count 变化后的操作
    }
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>计数: {this.state.count}</p>
        <button onClick={this.handleClick}>增加</button>
      </div>
    );
  }
}
```

### 6.4 卸载阶段

```jsx
class Timer extends Component {
  state = { seconds: 0 };
  timerID = null;

  componentDidMount() {
    // 设置定时器
    this.timerID = setInterval(() => {
      this.setState((prev) => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  }

  // 组件卸载前 - 清理工作
  componentWillUnmount() {
    console.log('componentWillUnmount');
    // 清理定时器
    clearInterval(this.timerID);
    // 取消网络请求
    // 取消事件订阅
    // 清理 DOM 事件监听
  }

  render() {
    return <p>运行时间: {this.state.seconds} 秒</p>;
  }
}
```

### 6.5 错误处理

```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  // 捕获渲染错误，更新 state
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // 捕获错误信息，可以上报错误
  componentDidCatch(error, errorInfo) {
    console.error('错误信息:', error);
    console.error('错误堆栈:', errorInfo.componentStack);
    // 上报错误到服务器
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>出错了: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

// 使用错误边界
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### 6.6 完整生命周期示例

```jsx
class CompleteLifecycle extends Component {
  constructor(props) {
    super(props);
    console.log('constructor');
    this.state = {
      data: null,
      loading: true,
      error: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps');
    return null;
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.fetchData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate');
    // 检测 props 变化重新获取数据
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    // 取消请求
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchData = async () => {
    this.abortController = new AbortController();
    try {
      this.setState({ loading: true });
      const response = await fetch(`/api/data/${this.props.id}`, {
        signal: this.abortController.signal
      });
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({ error, loading: false });
      }
    }
  };

  render() {
    console.log('render');
    const { data, loading, error } = this.state;

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error.message}</div>;
    return <div>数据: {JSON.stringify(data)}</div>;
  }
}
```

---

## 7. 事件处理

### 7.1 事件绑定基础

```jsx
// React 事件使用驼峰命名
// 传递函数而不是字符串

// 函数组件
function Button() {
  const handleClick = (e) => {
    e.preventDefault(); // 阻止默认行为
    console.log('按钮被点击');
  };

  return <button onClick={handleClick}>点击我</button>;
}

// 类组件
class Button extends Component {
  handleClick = (e) => {
    console.log('按钮被点击');
  };

  render() {
    return <button onClick={this.handleClick}>点击我</button>;
  }
}
```

### 7.2 事件处理方法绑定（类组件）

```jsx
class EventDemo extends Component {
  constructor(props) {
    super(props);
    // 方式1：构造函数中绑定
    this.handleClick1 = this.handleClick1.bind(this);
  }

  handleClick1() {
    console.log('方式1: 构造函数绑定', this);
  }

  // 方式2：类属性 + 箭头函数（推荐）
  handleClick2 = () => {
    console.log('方式2: 箭头函数', this);
  };

  handleClick3() {
    console.log('方式3: render 中绑定', this);
  }

  handleClick4() {
    console.log('方式4: render 中箭头函数', this);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick1}>方式1</button>
        <button onClick={this.handleClick2}>方式2（推荐）</button>
        {/* 每次渲染都会创建新函数，不推荐 */}
        <button onClick={this.handleClick3.bind(this)}>方式3</button>
        <button onClick={() => this.handleClick4()}>方式4</button>
      </div>
    );
  }
}
```

### 7.3 传递参数

```jsx
// 函数组件
function List() {
  const items = ['苹果', '香蕉', '橙子'];

  const handleClick = (item, index, e) => {
    console.log('点击了:', item, index);
    console.log('事件对象:', e);
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          {/* 使用箭头函数传递参数 */}
          <button onClick={(e) => handleClick(item, index, e)}>
            选择
          </button>
        </li>
      ))}
    </ul>
  );
}

// 类组件
class List extends Component {
  handleClick = (item, index, e) => {
    console.log('点击了:', item, index);
  };

  render() {
    const items = ['苹果', '香蕉', '橙子'];
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={(e) => this.handleClick(item, index, e)}>
              选择
            </button>
          </li>
        ))}
      </ul>
    );
  }
}
```

### 7.4 合成事件

```jsx
function EventDemo() {
  // React 的合成事件（SyntheticEvent）
  const handleClick = (e) => {
    // 事件对象属性
    console.log(e.type);           // 事件类型
    console.log(e.target);         // 触发事件的元素
    console.log(e.currentTarget);  // 绑定事件的元素
    console.log(e.nativeEvent);    // 原生事件对象
    
    // 阻止默认行为
    e.preventDefault();
    
    // 阻止冒泡
    e.stopPropagation();
    
    // 事件对象会被复用，异步访问需要持久化
    e.persist(); // React 17+ 不需要
    setTimeout(() => {
      console.log(e.type);
    }, 100);
  };

  return <button onClick={handleClick}>点击</button>;
}
```

### 7.5 常用事件类型

```jsx
function EventTypes() {
  // 鼠标事件
  const handleMouse = {
    onClick: (e) => console.log('点击'),
    onDoubleClick: (e) => console.log('双击'),
    onMouseDown: (e) => console.log('鼠标按下'),
    onMouseUp: (e) => console.log('鼠标松开'),
    onMouseMove: (e) => console.log('鼠标移动'),
    onMouseEnter: (e) => console.log('鼠标进入'),
    onMouseLeave: (e) => console.log('鼠标离开'),
    onContextMenu: (e) => console.log('右键菜单'),
  };

  // 键盘事件
  const handleKeyboard = {
    onKeyDown: (e) => console.log('按键按下', e.key),
    onKeyUp: (e) => console.log('按键松开', e.key),
    onKeyPress: (e) => console.log('按键', e.key), // 已废弃
  };

  // 表单事件
  const handleForm = {
    onChange: (e) => console.log('值改变', e.target.value),
    onInput: (e) => console.log('输入', e.target.value),
    onSubmit: (e) => { e.preventDefault(); console.log('提交'); },
    onFocus: (e) => console.log('获得焦点'),
    onBlur: (e) => console.log('失去焦点'),
  };

  // 触摸事件
  const handleTouch = {
    onTouchStart: (e) => console.log('触摸开始'),
    onTouchMove: (e) => console.log('触摸移动'),
    onTouchEnd: (e) => console.log('触摸结束'),
  };

  // 滚动事件
  const handleScroll = {
    onScroll: (e) => console.log('滚动', e.target.scrollTop),
  };

  // 剪贴板事件
  const handleClipboard = {
    onCopy: (e) => console.log('复制'),
    onCut: (e) => console.log('剪切'),
    onPaste: (e) => console.log('粘贴'),
  };

  // 拖拽事件
  const handleDrag = {
    onDrag: (e) => console.log('拖拽中'),
    onDragStart: (e) => console.log('开始拖拽'),
    onDragEnd: (e) => console.log('结束拖拽'),
    onDragOver: (e) => { e.preventDefault(); console.log('拖拽经过'); },
    onDrop: (e) => { e.preventDefault(); console.log('放下'); },
  };

  return (
    <div>
      <button {...handleMouse}>鼠标事件</button>
      <input {...handleKeyboard} {...handleForm} />
      <div {...handleScroll} style={{ height: 100, overflow: 'auto' }}>
        滚动内容
      </div>
    </div>
  );
}
```

### 7.6 事件委托

```jsx
// React 自动使用事件委托，事件绑定在根元素上
function List() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

  // 单个处理函数处理所有列表项的点击
  const handleClick = (e) => {
    const item = e.target.dataset.item;
    if (item) {
      console.log('点击了:', item);
    }
  };

  return (
    <ul onClick={handleClick}>
      {items.map((item, index) => (
        <li key={index} data-item={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

---

## 8. 条件渲染

### 8.1 if-else 条件

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来！</h1>;
  } else {
    return <h1>请先登录</h1>;
  }
}

// 提前返回
function Greeting({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <h1>请先登录</h1>;
  }
  return <h1>欢迎回来！</h1>;
}
```

### 8.2 三元运算符

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>欢迎回来！</h1>
      ) : (
        <h1>请先登录</h1>
      )}
    </div>
  );
}

// 简单条件
function Status({ online }) {
  return <span>{online ? '在线' : '离线'}</span>;
}

// 嵌套三元（不推荐，可读性差）
function Grade({ score }) {
  return (
    <span>
      {score >= 90 ? '优秀' : score >= 60 ? '及格' : '不及格'}
    </span>
  );
}
```

### 8.3 逻辑与运算符 &&

```jsx
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>邮箱</h1>
      {/* 当条件为真时渲染后面的内容 */}
      {unreadMessages.length > 0 && (
        <p>您有 {unreadMessages.length} 条未读消息</p>
      )}
    </div>
  );
}

// 注意：避免使用 0 作为条件
function List({ items }) {
  return (
    <div>
      {/* 错误：当 items.length 为 0 时，会渲染 0 */}
      {items.length && <ul>...</ul>}
      
      {/* 正确：转换为布尔值 */}
      {items.length > 0 && <ul>...</ul>}
      {!!items.length && <ul>...</ul>}
      {Boolean(items.length) && <ul>...</ul>}
    </div>
  );
}
```

### 8.4 逻辑或运算符 ||

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name || '访客'}</h1>;
}

// 空值合并运算符 ??（推荐）
function Welcome({ name }) {
  // ?? 只在 null 或 undefined 时使用默认值
  return <h1>Hello, {name ?? '访客'}</h1>;
}
```

### 8.5 switch 语句

```jsx
function StatusIcon({ status }) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <SuccessIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return <div className="status">{getIcon()}</div>;
}

// 使用对象映射（推荐）
const statusIcons = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  default: InfoIcon
};

function StatusIcon({ status }) {
  const Icon = statusIcons[status] || statusIcons.default;
  return <div className="status"><Icon /></div>;
}
```

### 8.6 阻止组件渲染

```jsx
function Warning({ show, message }) {
  // 返回 null 不渲染任何内容
  if (!show) {
    return null;
  }
  return <div className="warning">{message}</div>;
}

// 在父组件中控制
function App() {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div>
      <button onClick={() => setShowWarning(!showWarning)}>
        {showWarning ? '隐藏' : '显示'}警告
      </button>
      <Warning show={showWarning} message="这是一个警告" />
    </div>
  );
}
```

### 8.7 条件渲染组件

```jsx
// 根据条件渲染不同组件
function Page({ userType }) {
  const components = {
    admin: AdminDashboard,
    user: UserDashboard,
    guest: GuestPage
  };

  const Component = components[userType] || GuestPage;
  return <Component />;
}

// 条件渲染 with 懒加载
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));
const UserDashboard = React.lazy(() => import('./UserDashboard'));

function Page({ userType }) {
  return (
    <Suspense fallback={<Loading />}>
      {userType === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </Suspense>
  );
}
```

---

## 9. 列表渲染

### 9.1 基本列表渲染

```jsx
function NumberList() {
  const numbers = [1, 2, 3, 4, 5];
  
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}

// 渲染对象数组
function UserList() {
  const users = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 }
  ];

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.age}岁
        </li>
      ))}
    </ul>
  );
}
```

### 9.2 Key 的使用

```jsx
// key 帮助 React 识别哪些元素改变了
function TodoList({ todos }) {
  return (
    <ul>
      {/* 推荐：使用唯一且稳定的 id */}
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// key 的错误用法
function BadKeyExample() {
  const items = ['苹果', '香蕉', '橙子'];
  
  return (
    <ul>
      {/* 不推荐：使用索引作为 key（在列表会重新排序时有问题） */}
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
      
      {/* 错误：使用随机数作为 key */}
      {items.map((item) => (
        <li key={Math.random()}>{item}</li>
      ))}
    </ul>
  );
}

// key 只在兄弟节点中需要唯一
function App() {
  const posts = [{ id: 1, title: '标题1' }, { id: 2, title: '标题2' }];
  const comments = [{ id: 1, text: '评论1' }, { id: 2, text: '评论2' }];

  return (
    <div>
      {/* 不同数组可以使用相同的 key */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

### 9.3 列表组件提取

```jsx
// 提取列表项组件
function ListItem({ item }) {
  return (
    <li className="list-item">
      <span>{item.name}</span>
      <span>{item.price}</span>
    </li>
  );
}

function ProductList({ products }) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        // key 放在循环的直接子元素上
        <ListItem key={product.id} item={product} />
      ))}
    </ul>
  );
}
```

### 9.4 嵌套列表

```jsx
function NestedList() {
  const categories = [
    {
      id: 1,
      name: '水果',
      items: ['苹果', '香蕉', '橙子']
    },
    {
      id: 2,
      name: '蔬菜',
      items: ['白菜', '萝卜', '土豆']
    }
  ];

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item, index) => (
              <li key={`${category.id}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### 9.5 条件列表渲染

```jsx
function FilteredList({ items, filter }) {
  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (filteredItems.length === 0) {
    return <p>没有符合条件的项目</p>;
  }

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 9.6 列表操作

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '写代码', completed: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  // 添加
  const addTodo = () => {
    if (!inputValue.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputValue, completed: false }
    ]);
    setInputValue('');
  };

  // 删除
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 切换完成状态
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 编辑
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>添加</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 10. 表单处理

### 10.1 受控组件

```jsx
function ControlledForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'male',
    subscribe: false,
    country: 'china',
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交数据:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 文本输入 */}
      <div>
        <label>用户名:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      {/* 邮箱输入 */}
      <div>
        <label>邮箱:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* 密码输入 */}
      <div>
        <label>密码:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/* 单选按钮 */}
      <div>
        <label>性别:</label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === 'male'}
          onChange={handleChange}
        /> 男
        <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === 'female'}
          onChange={handleChange}
        /> 女
      </div>

      {/* 复选框 */}
      <div>
        <input
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleChange}
        />
        <label>订阅新闻</label>
      </div>

      {/* 下拉选择 */}
      <div>
        <label>国家:</label>
        <select name="country" value={formData.country} onChange={handleChange}>
          <option value="china">中国</option>
          <option value="usa">美国</option>
          <option value="uk">英国</option>
        </select>
      </div>

      {/* 多行文本 */}
      <div>
        <label>简介:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <button type="submit">提交</button>
    </form>
  );
}
```

### 10.2 非受控组件

```jsx
import { useRef } from 'react';

function UncontrolledForm() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const fileRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('用户名:', usernameRef.current.value);
    console.log('邮箱:', emailRef.current.value);
    console.log('文件:', fileRef.current.files[0]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>用户名:</label>
        <input type="text" ref={usernameRef} defaultValue="默认值" />
      </div>
      <div>
        <label>邮箱:</label>
        <input type="email" ref={emailRef} />
      </div>
      <div>
        <label>文件:</label>
        {/* 文件输入只能是非受控组件 */}
        <input type="file" ref={fileRef} />
      </div>
      <button type="submit">提交</button>
    </form>
  );
}
```

### 10.3 表单验证

```jsx
function FormValidation() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'username':
        if (!value) {
          newErrors.username = '用户名不能为空';
        } else if (value.length < 3) {
          newErrors.username = '用户名至少3个字符';
        } else {
          delete newErrors.username;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = '邮箱不能为空';
        } else if (!emailRegex.test(value)) {
          newErrors.email = '邮箱格式不正确';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = '密码不能为空';
        } else if (value.length < 6) {
          newErrors.password = '密码至少6个字符';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 验证所有字段
    Object.keys(formData).forEach((name) => {
      validate(name, formData[name]);
    });
    setTouched({ username: true, email: true, password: true });

    if (Object.keys(errors).length === 0) {
      console.log('提交成功:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>用户名:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.username && touched.username ? 'error' : ''}
        />
        {errors.username && touched.username && (
          <span className="error-message">{errors.username}</span>
        )}
      </div>
      <div>
        <label>邮箱:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && touched.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>
      <div>
        <label>密码:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && touched.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>
      <button type="submit" disabled={Object.keys(errors).length > 0}>
        提交
      </button>
    </form>
  );
}
```

### 10.4 多选框处理

```jsx
function MultiSelect() {
  const [selectedItems, setSelectedItems] = useState([]);
  const options = ['苹果', '香蕉', '橙子', '葡萄', '西瓜'];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedItems([...selectedItems, value]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== value));
    }
  };

  return (
    <div>
      <h3>选择水果:</h3>
      {options.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={selectedItems.includes(option)}
            onChange={handleCheckboxChange}
          />
          {option}
        </label>
      ))}
      <p>已选择: {selectedItems.join(', ') || '无'}</p>
    </div>
  );
}

// select 多选
function MultiSelectDropdown() {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
  };

  return (
    <select multiple value={selectedOptions} onChange={handleChange}>
      <option value="apple">苹果</option>
      <option value="banana">香蕉</option>
      <option value="orange">橙子</option>
    </select>
  );
}
```

---

## 11. Refs 引用

### 11.1 创建 Refs

```jsx
// 类组件中使用 createRef
class TextInput extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  focusInput = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <input type="text" ref={this.inputRef} />
        <button onClick={this.focusInput}>聚焦输入框</button>
      </div>
    );
  }
}

// 函数组件中使用 useRef
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  );
}
```

### 11.2 Refs 访问 DOM

```jsx
function DOMAccess() {
  const divRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // 获取 DOM 属性
    console.log('div 宽度:', divRef.current.offsetWidth);
    console.log('div 高度:', divRef.current.offsetHeight);

    // 操作视频
    // videoRef.current.play();
    // videoRef.current.pause();

    // 操作 canvas
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
  }, []);

  return (
    <div>
      <div ref={divRef} style={{ width: 200, height: 100 }}>内容</div>
      <video ref={videoRef} src="video.mp4" />
      <canvas ref={canvasRef} width={300} height={200} />
    </div>
  );
}
```

### 11.3 回调 Refs

```jsx
function CallbackRef() {
  const [height, setHeight] = useState(0);

  // 回调 ref - 元素挂载/卸载时调用
  const measuredRef = (node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  };

  return (
    <div>
      <h1 ref={measuredRef}>Hello, world</h1>
      <p>上面标题的高度是: {Math.round(height)}px</p>
    </div>
  );
}
```

### 11.4 Refs 转发

```jsx
// 转发 ref 到子组件的 DOM 元素
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="fancy-button">
    {props.children}
  </button>
));

function App() {
  const buttonRef = useRef(null);

  useEffect(() => {
    console.log(buttonRef.current); // <button> 元素
  }, []);

  return <FancyButton ref={buttonRef}>点击我</FancyButton>;
}

// 在高阶组件中转发 ref
function withLogger(WrappedComponent) {
  class LoggerComponent extends React.Component {
    componentDidMount() {
      console.log('组件已挂载');
    }
    render() {
      const { forwardedRef, ...rest } = this.props;
      return <WrappedComponent ref={forwardedRef} {...rest} />;
    }
  }

  return React.forwardRef((props, ref) => (
    <LoggerComponent {...props} forwardedRef={ref} />
  ));
}
```

### 11.5 useImperativeHandle

```jsx
// 自定义暴露给父组件的实例值
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // 自定义暴露的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
    getValue: () => {
      return inputRef.current.value;
    }
  }));

  return <input ref={inputRef} {...props} />;
});

function App() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
    console.log('值:', inputRef.current.getValue());
  };

  const handleClear = () => {
    inputRef.current.clear();
  };

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦并获取值</button>
      <button onClick={handleClear}>清空</button>
    </div>
  );
}
```

---

## 12. Context 上下文

### 12.1 创建和使用 Context

```jsx
import React, { createContext, useContext, useState } from 'react';

// 1. 创建 Context
const ThemeContext = createContext('light');

// 2. 提供 Context
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app ${theme}`}>
        <Header />
        <Main />
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          切换主题
        </button>
      </div>
    </ThemeContext.Provider>
  );
}

// 3. 消费 Context - useContext Hook
function Header() {
  const theme = useContext(ThemeContext);
  return <header className={`header-${theme}`}>Header</header>;
}

// 3. 消费 Context - Context.Consumer
function Main() {
  return (
    <ThemeContext.Consumer>
      {(theme) => <main className={`main-${theme}`}>Main Content</main>}
    </ThemeContext.Consumer>
  );
}

// 3. 消费 Context - 类组件
class Footer extends Component {
  static contextType = ThemeContext;
  render() {
    return <footer className={`footer-${this.context}`}>Footer</footer>;
  }
}
```

### 12.2 多个 Context

```jsx
const ThemeContext = createContext('light');
const UserContext = createContext(null);

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: '张三' });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Layout() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <div className={theme}>
      <p>当前用户: {user.name}</p>
    </div>
  );
}
```

### 12.3 Context 默认值

```jsx
// 默认值在没有 Provider 时使用
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// 没有 Provider 包裹时使用默认值
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} className={theme}>
      切换主题
    </button>
  );
}
```

### 12.4 Context 性能优化

```jsx
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CounterContext = createContext();

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  // 使用 useMemo 缓存 value 对象
  const value = useMemo(() => ({
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1)
  }), [count]);

  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
}

// 拆分 Context 避免不必要的重渲染
const CounterValueContext = createContext();
const CounterActionsContext = createContext();

function OptimizedCounterProvider({ children }) {
  const [count, setCount] = useState(0);

  const actions = useMemo(() => ({
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1)
  }), []);

  return (
    <CounterValueContext.Provider value={count}>
      <CounterActionsContext.Provider value={actions}>
        {children}
      </CounterActionsContext.Provider>
    </CounterValueContext.Provider>
  );
}

// 只消费 actions 的组件不会因为 count 变化而重渲染
function CounterButtons() {
  const { increment, decrement } = useContext(CounterActionsContext);
  console.log('CounterButtons rendered');
  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### 12.5 自定义 Hook 封装 Context

```jsx
const AuthContext = createContext(null);

// 自定义 Provider 组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    checkAuth().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    const user = await loginApi(credentials);
    setUser(user);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 使用
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

function Profile() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <p>欢迎, {user.name}</p>
      <button onClick={logout}>退出</button>
    </div>
  );
}
```

---

## 13. 高阶组件 HOC

### 13.1 HOC 基础

```jsx
// 高阶组件是一个函数，接收组件并返回新组件
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>加载中...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// 使用 HOC
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

const UserListWithLoading = withLoading(UserList);

function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  return <UserListWithLoading isLoading={loading} users={users} />;
}
```

### 13.2 常用 HOC 模式

```jsx
// 1. 属性代理 - 操作 props
function withExtraProps(WrappedComponent) {
  return function(props) {
    const extraProps = {
      timestamp: Date.now(),
      version: '1.0.0'
    };
    return <WrappedComponent {...props} {...extraProps} />;
  };
}

// 2. 条件渲染
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, ...rest } = props;
    if (!isAuthenticated) {
      return <div>请先登录</div>;
    }
    return <WrappedComponent {...rest} />;
  };
}

// 3. 数据获取
function withData(WrappedComponent, fetchData) {
  return function DataComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchData()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error.message}</div>;
    return <WrappedComponent {...props} data={data} />;
  };
}

// 4. 日志记录
function withLogger(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`${WrappedComponent.name} mounted`);
    }
    componentDidUpdate(prevProps) {
      console.log(`${WrappedComponent.name} updated`, {
        prevProps,
        currentProps: this.props
      });
    }
    componentWillUnmount() {
      console.log(`${WrappedComponent.name} will unmount`);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// 5. 样式注入
function withStyles(WrappedComponent, styles) {
  return function StyledComponent(props) {
    return (
      <div style={styles}>
        <WrappedComponent {...props} />
      </div>
    );
  };
}
```

### 13.3 HOC 组合

```jsx
// 组合多个 HOC
const enhance = compose(
  withAuth,
  withLoading,
  withLogger
);

const EnhancedComponent = enhance(MyComponent);

// compose 函数实现
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

### 13.4 HOC 注意事项

```jsx
// 1. 不要在 render 中使用 HOC
class App extends Component {
  render() {
    // 错误！每次渲染都会创建新组件
    const EnhancedComponent = withLoading(MyComponent);
    return <EnhancedComponent />;
  }
}

// 正确：在组件外部使用
const EnhancedComponent = withLoading(MyComponent);
class App extends Component {
  render() {
    return <EnhancedComponent />;
  }
}

// 2. 复制静态方法
function withData(WrappedComponent) {
  class WithData extends React.Component {
    // ...
  }
  // 复制静态方法
  WithData.staticMethod = WrappedComponent.staticMethod;
  // 或使用 hoist-non-react-statics
  // hoistNonReactStatics(WithData, WrappedComponent);
  return WithData;
}

// 3. 转发 refs
function withData(WrappedComponent) {
  class WithData extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return <WrappedComponent ref={forwardedRef} {...rest} />;
    }
  }
  return React.forwardRef((props, ref) => (
    <WithData {...props} forwardedRef={ref} />
  ));
}

// 4. 设置 displayName 便于调试
function withLoading(WrappedComponent) {
  function WithLoading(props) {
    // ...
  }
  WithLoading.displayName = `WithLoading(${getDisplayName(WrappedComponent)})`;
  return WithLoading;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

---

## 14. Render Props

### 14.1 基本用法

```jsx
// Render Props 是一种共享代码的技术
// 使用一个值为函数的 prop 来动态决定渲染内容

class MouseTracker extends Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {/* 使用 render prop */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 使用
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          鼠标位置: ({x}, {y})
        </div>
      )}
    />
  );
}
```

### 14.2 children 作为函数

```jsx
class Mouse extends Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {/* 使用 children 作为函数 */}
        {this.props.children(this.state)}
      </div>
    );
  }
}

// 使用 - 更直观的语法
function App() {
  return (
    <Mouse>
      {({ x, y }) => (
        <div>
          鼠标位置: ({x}, {y})
        </div>
      )}
    </Mouse>
  );
}
```

### 14.3 实际应用示例

```jsx
// 数据获取组件
class DataFetcher extends Component {
  state = { data: null, loading: true, error: null };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    this.setState({ loading: true });
    try {
      const response = await fetch(this.props.url);
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  render() {
    return this.props.children(this.state);
  }
}

// 使用
function UserProfile({ userId }) {
  return (
    <DataFetcher url={`/api/users/${userId}`}>
      {({ data, loading, error }) => {
        if (loading) return <div>加载中...</div>;
        if (error) return <div>错误: {error.message}</div>;
        return (
          <div>
            <h1>{data.name}</h1>
            <p>{data.email}</p>
          </div>
        );
      }}
    </DataFetcher>
  );
}

// 表单状态管理
function Form({ children, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {children({
        values,
        errors,
        handleChange
      })}
    </form>
  );
}

// 使用
function LoginForm() {
  return (
    <Form initialValues={{ email: '', password: '' }} onSubmit={console.log}>
      {({ values, handleChange }) => (
        <>
          <input
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <input
            type="password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <button type="submit">登录</button>
        </>
      )}
    </Form>
  );
}
```

---

## 15. 错误边界

### 15.1 错误边界组件

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染显示降级 UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('错误边界捕获到错误:', error, errorInfo);
    this.setState({ errorInfo });
    // 上报错误到服务器
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 自定义降级 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="error-boundary">
          <h1>出错了</h1>
          <details>
            <summary>错误详情</summary>
            <pre>{this.state.error?.toString()}</pre>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 15.2 使用错误边界

```jsx
function App() {
  return (
    <div>
      {/* 整个应用的错误边界 */}
      <ErrorBoundary fallback={<h1>应用出错了，请刷新页面</h1>}>
        <Header />
        {/* 局部错误边界 */}
        <ErrorBoundary fallback={<p>这部分内容加载失败</p>}>
          <MainContent />
        </ErrorBoundary>
        <Sidebar />
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

// 错误边界无法捕获的错误：
// 1. 事件处理函数中的错误
// 2. 异步代码（setTimeout, Promise 等）
// 3. 服务端渲染
// 4. 错误边界组件自身的错误

// 事件处理中的错误需要自己处理
function MyComponent() {
  const handleClick = () => {
    try {
      // 可能出错的代码
      throw new Error('按钮点击错误');
    } catch (error) {
      // 处理错误
      console.error(error);
    }
  };

  return <button onClick={handleClick}>点击</button>;
}
```

---

## 16. Portals 传送门

### 16.1 基本用法

```jsx
import { createPortal } from 'react-dom';

// Portal 可以将子节点渲染到 DOM 树的其他位置
function Modal({ children, isOpen }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// HTML 结构
// <body>
//   <div id="root"></div>
//   <div id="modal-root"></div>
// </body>

// 使用
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>打开弹窗</button>
      <Modal isOpen={showModal}>
        <h2>弹窗标题</h2>
        <p>弹窗内容</p>
        <button onClick={() => setShowModal(false)}>关闭</button>
      </Modal>
    </div>
  );
}
```

### 16.2 Portal 事件冒泡

```jsx
// Portal 中的事件会冒泡到 React 树的父组件
// 而不是 DOM 树的父元素

function Parent() {
  const handleClick = () => {
    console.log('Parent clicked');
  };

  return (
    <div onClick={handleClick}>
      <Child />
    </div>
  );
}

function Child() {
  return createPortal(
    <button onClick={() => console.log('Button clicked')}>
      点击我
    </button>,
    document.getElementById('modal-root')
  );
}

// 点击按钮会先打印 "Button clicked"，然后打印 "Parent clicked"
```

### 16.3 实际应用

```jsx
// Tooltip 组件
function Tooltip({ children, text, position }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setShow(true);
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      {show && createPortal(
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y - 30,
            transform: 'translateX(-50%)'
          }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  );
}

// 下拉菜单
function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const handleToggle = () => {
    if (!open) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left
      });
    }
    setOpen(!open);
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleToggle}>
        {trigger}
      </div>
      {open && createPortal(
        <div
          className="dropdown-menu"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
}
```

---

## 17. Fragment 片段

### 17.1 基本用法

```jsx
import { Fragment } from 'react';

// Fragment 允许返回多个元素而不添加额外的 DOM 节点
function Columns() {
  return (
    <Fragment>
      <td>第一列</td>
      <td>第二列</td>
    </Fragment>
  );
}

// 短语法
function Columns() {
  return (
    <>
      <td>第一列</td>
      <td>第二列</td>
    </>
  );
}

// 在表格中使用
function Table() {
  return (
    <table>
      <tbody>
        <tr>
          <Columns />
        </tr>
      </tbody>
    </table>
  );
}
```

### 17.2 带 key 的 Fragment

```jsx
// 当需要 key 时必须使用完整的 Fragment 语法
function Glossary({ items }) {
  return (
    <dl>
      {items.map((item) => (
        // key 是 Fragment 唯一支持的属性
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

---

## 18. 严格模式

### 18.1 StrictMode 组件

```jsx
import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
      <div>
        <ComponentOne />
        <ComponentTwo />
      </div>
    </StrictMode>
  );
}

// 也可以只包裹部分组件
function App() {
  return (
    <div>
      <Header />
      <StrictMode>
        <main>
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </div>
  );
}
```

### 18.2 StrictMode 功能

```jsx
// StrictMode 在开发模式下会：

// 1. 检测不安全的生命周期方法
// 使用已废弃的生命周期会收到警告

// 2. 检测过时的 ref API（字符串 ref）
class MyComponent extends Component {
  render() {
    // 会收到警告
    return <input ref="myInput" />;
  }
}

// 3. 检测意外的副作用
// 会故意双重调用以下方法来检测副作用：
// - constructor
// - render
// - shouldComponentUpdate
// - getDerivedStateFromProps
// - useState, useMemo, useReducer 的初始化函数

// 4. 检测废弃的 findDOMNode 用法

// 5. 检测过时的 context API（旧版 childContextTypes）

// 6. 确保可复用的 state（React 18）
// 模拟组件卸载和重新挂载，检测 useEffect 的清理函数
```

---

## 19. 代码分割与懒加载

### 19.1 React.lazy

```jsx
import { lazy, Suspense } from 'react';

// 动态导入组件
const OtherComponent = lazy(() => import('./OtherComponent'));

function App() {
  return (
    <div>
      {/* Suspense 显示加载状态 */}
      <Suspense fallback={<div>加载中...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}

// 多个懒加载组件
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
}
```

### 19.2 基于路由的代码分割

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 路由级别的代码分割
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 带有命名导出的组件
// OtherComponent.js 使用命名导出
// export const OtherComponent = () => {...}

// 需要这样导入
const OtherComponent = lazy(() =>
  import('./OtherComponent').then((module) => ({
    default: module.OtherComponent
  }))
);
```

### 19.3 预加载

```jsx
// 预加载组件
const OtherComponent = lazy(() => import('./OtherComponent'));

// 预加载函数
const preloadOtherComponent = () => {
  import('./OtherComponent');
};

function App() {
  return (
    <div>
      {/* 鼠标悬停时预加载 */}
      <button
        onMouseEnter={preloadOtherComponent}
        onClick={() => setShowComponent(true)}
      >
        显示组件
      </button>
    </div>
  );
}
```

### 19.4 错误处理

```jsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <ErrorBoundary fallback={<div>加载组件失败</div>}>
      <Suspense fallback={<div>加载中...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## 20. 性能优化

### 20.1 React.memo

```jsx
import { memo } from 'react';

// memo 包装的组件只在 props 变化时重新渲染
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // 昂贵的渲染逻辑
  return <div>{data.value}</div>;
});

// 自定义比较函数
const MyComponent = memo(
  function MyComponent({ user, onClick }) {
    return (
      <div onClick={onClick}>
        {user.name} - {user.age}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 返回 true 表示 props 相等，不需要重新渲染
    // 返回 false 表示需要重新渲染
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name
    );
  }
);
```

### 20.2 useMemo

```jsx
import { useMemo } from 'react';

function ExpensiveComponent({ items, filter }) {
  // 只有 items 或 filter 变化时才重新计算
  const filteredItems = useMemo(() => {
    console.log('计算过滤结果');
    return items.filter((item) => item.name.includes(filter));
  }, [items, filter]);

  // 缓存复杂的对象/数组
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredItems]);

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 20.3 useCallback

```jsx
import { useCallback, useState } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 每次渲染都会创建新函数，导致子组件重新渲染
  const handleClickBad = () => {
    setCount(count + 1);
  };

  // 使用 useCallback 缓存函数
  const handleClickGood = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  // 带依赖的回调
  const handleSubmit = useCallback(() => {
    console.log('提交:', text);
  }, [text]);

  return (
    <div>
      <ExpensiveChild onClick={handleClickGood} />
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  console.log('ExpensiveChild rendered');
  return <button onClick={onClick}>点击</button>;
});
```

### 20.4 shouldComponentUpdate / PureComponent

```jsx
// shouldComponentUpdate
class MyComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // 只在特定 props 变化时更新
    return nextProps.value !== this.props.value;
  }

  render() {
    return <div>{this.props.value}</div>;
  }
}

// PureComponent 自动进行浅比较
class MyPureComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}
```

### 20.5 虚拟列表

```jsx
// 使用 react-window 实现虚拟列表
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={35}
      width={300}
    >
      {Row}
    </FixedSizeList>
  );
}

// 可变高度列表
import { VariableSizeList } from 'react-window';

function VariableList({ items }) {
  const getItemSize = (index) => items[index].height || 50;

  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].content}
    </div>
  );

  return (
    <VariableSizeList
      height={400}
      itemCount={items.length}
      itemSize={getItemSize}
      width={300}
    >
      {Row}
    </VariableSizeList>
  );
}
```

### 20.6 防抖和节流

```jsx
import { useState, useCallback, useEffect, useRef } from 'react';

// 防抖 Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 节流 Hook
function useThrottle(value, interval) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// 使用示例
function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // 执行搜索
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### 20.7 避免内联对象和函数

```jsx
// 不好的写法 - 每次渲染创建新对象
function BadComponent({ data }) {
  return (
    <ChildComponent
      style={{ color: 'red' }}  // 每次都是新对象
      onClick={() => console.log('clicked')}  // 每次都是新函数
      config={{ theme: 'dark' }}  // 每次都是新对象
    />
  );
}

// 好的写法 - 提取到外部或使用 useMemo/useCallback
const style = { color: 'red' };
const config = { theme: 'dark' };

function GoodComponent({ data }) {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <ChildComponent
      style={style}
      onClick={handleClick}
      config={config}
    />
  );
}
```

---

## 总结

本文档详细介绍了 React 的所有核心语法和用法：

1. **JSX** - React 的模板语法
2. **组件** - 函数组件和类组件
3. **Props** - 组件间数据传递
4. **State** - 组件内部状态管理
5. **生命周期** - 组件的生命周期方法
6. **事件处理** - React 的事件系统
7. **条件渲染** - 动态渲染内容
8. **列表渲染** - 渲染列表数据
9. **表单处理** - 受控和非受控组件
10. **Refs** - 访问 DOM 和组件实例
11. **Context** - 跨组件数据共享
12. **HOC** - 高阶组件模式
13. **Render Props** - 共享组件逻辑
14. **错误边界** - 错误处理
15. **Portals** - DOM 层级穿透
16. **Fragment** - 无额外节点的组件包装
17. **StrictMode** - 开发模式检查
18. **代码分割** - 懒加载优化
19. **性能优化** - memo、useMemo、useCallback 等

掌握这些知识点，你就能够熟练使用 React 进行开发了！
