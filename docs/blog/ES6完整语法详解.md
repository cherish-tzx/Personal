# ES6 (ES2015) 完整语法详解

> ECMAScript 2015 (ES6) 是JavaScript历史上最重要的一次更新，引入了大量新特性，彻底改变了JavaScript的编程方式。
<div class="doc-toc">
## 目录

1. [let和const](#1-let和const)
2. [箭头函数](#2-箭头函数)
3. [模板字符串](#3-模板字符串)
4. [解构赋值](#4-解构赋值)
5. [默认参数](#5-默认参数)
6. [剩余参数和展开运算符](#6-剩余参数和展开运算符)
7. [对象字面量增强](#7-对象字面量增强)
8. [类(Class)](#8-类class)
9. [模块化](#9-模块化)
10. [Promise](#10-promise)
11. [Symbol](#11-symbol)
12. [迭代器和生成器](#12-迭代器和生成器)
13. [Map和Set](#13-map和set)
14. [WeakMap和WeakSet](#14-weakmap和weakset)
15. [Proxy和Reflect](#15-proxy和reflect)
16. [新的字符串方法](#16-新的字符串方法)
17. [新的数组方法](#17-新的数组方法)
18. [新的对象方法](#18-新的对象方法)
19. [新的数值方法](#19-新的数值方法)
20. [for...of循环](#20-forof循环)


</div>

---

## 1. let和const

### 1.1 let - 块级作用域变量

```javascript
// 基本用法
let name = '张三';
name = '李四'; // 可以重新赋值
console.log(name); // '李四'

// 块级作用域
{
  let blockVar = '块内变量';
  console.log(blockVar); // '块内变量'
}
// console.log(blockVar); // ReferenceError

// 场景1：循环中的块级作用域
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2 (每次循环都是新的i)
  }, 100);
}

// 对比var
for (var j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log(j); // 3, 3, 3 (共享同一个j)
  }, 100);
}

// 场景2：if语句中的块级作用域
function processUser(user) {
  if (user.isAdmin) {
    let permissions = ['read', 'write', 'delete'];
    console.log(permissions);
  }
  // permissions 在这里不可访问
}

// 场景3：不存在变量提升（暂时性死区 TDZ）
// console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 10;

// 场景4：不允许重复声明
let y = 1;
// let y = 2; // SyntaxError: Identifier 'y' has already been declared
```

### 1.2 const - 常量声明

```javascript
// 基本用法
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

// 必须初始化
// const a; // SyntaxError: Missing initializer in const declaration

// 场景1：对象常量（引用不变，内容可变）
const user = {
  name: '张三',
  age: 25
};
user.age = 26; // 可以修改属性
console.log(user.age); // 26
// user = {}; // TypeError: Assignment to constant variable

// 场景2：数组常量
const numbers = [1, 2, 3];
numbers.push(4); // 可以修改内容
console.log(numbers); // [1, 2, 3, 4]
// numbers = []; // TypeError

// 场景3：配置常量
const CONFIG = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  MAX_RETRIES: 3
};

// 场景4：函数常量
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// 场景5：模块导入
// const { map, filter } = require('lodash');

// 场景6：真正不可变的对象
const IMMUTABLE_CONFIG = Object.freeze({
  version: '1.0.0',
  debug: false
});
// IMMUTABLE_CONFIG.debug = true; // 静默失败或严格模式报错
console.log(IMMUTABLE_CONFIG.debug); // false
```

### 1.3 let vs const vs var 对比

```javascript
// 作用域对比
function scopeTest() {
  if (true) {
    var varVariable = 'var';
    let letVariable = 'let';
    const constVariable = 'const';
  }
  console.log(varVariable);   // 'var' (函数作用域)
  // console.log(letVariable);  // ReferenceError (块级作用域)
  // console.log(constVariable); // ReferenceError (块级作用域)
}

// 变量提升对比
console.log(hoistedVar); // undefined (已提升)
// console.log(hoistedLet); // ReferenceError (TDZ)
var hoistedVar = 'var';
let hoistedLet = 'let';

// 最佳实践
// 1. 默认使用 const
// 2. 需要重新赋值时使用 let
// 3. 避免使用 var
```

---

## 2. 箭头函数

### 2.1 基本语法

```javascript
// 基本形式
const fn = (param) => {
  return param * 2;
};

// 单参数可省略括号
const double = n => n * 2;

// 无参数需要括号
const greet = () => 'Hello!';

// 多参数需要括号
const add = (a, b) => a + b;

// 返回对象字面量需要括号
const createUser = (name, age) => ({ name, age });
console.log(createUser('张三', 25)); // { name: '张三', age: 25 }
```

### 2.2 this绑定

```javascript
// 箭头函数没有自己的this，继承外层作用域的this

// 场景1：解决this丢失问题
const obj = {
  name: '张三',
  friends: ['李四', '王五'],
  
  // 传统方式（this问题）
  printFriendsOld: function() {
    const self = this; // 需要保存this
    this.friends.forEach(function(friend) {
      console.log(self.name + '的朋友: ' + friend);
    });
  },
  
  // 箭头函数方式
  printFriends: function() {
    this.friends.forEach(friend => {
      console.log(this.name + '的朋友: ' + friend);
    });
  }
};

obj.printFriends();
// 张三的朋友: 李四
// 张三的朋友: 王五

// 场景2：事件处理中的this
class Counter {
  constructor() {
    this.count = 0;
  }
  
  // 箭头函数自动绑定this
  increment = () => {
    this.count++;
    console.log(this.count);
  }
}

const counter = new Counter();
const incrementFn = counter.increment;
incrementFn(); // 1 (this正确指向实例)

// 场景3：setTimeout中的this
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};
```

### 2.3 箭头函数的限制

```javascript
// 1. 没有arguments对象
const fn = () => {
  // console.log(arguments); // ReferenceError
};

// 使用剩余参数代替
const fnWithRest = (...args) => {
  console.log(args);
};
fnWithRest(1, 2, 3); // [1, 2, 3]

// 2. 不能作为构造函数
const Person = (name) => {
  this.name = name;
};
// new Person('张三'); // TypeError: Person is not a constructor

// 3. 没有prototype属性
const arrowFn = () => {};
console.log(arrowFn.prototype); // undefined

// 4. 不能用作Generator函数
// const gen = *() => {}; // SyntaxError
```

### 2.4 实际应用场景

```javascript
// 场景1：数组方法链式调用
const users = [
  { name: '张三', age: 25, active: true },
  { name: '李四', age: 30, active: false },
  { name: '王五', age: 28, active: true }
];

const activeUserNames = users
  .filter(user => user.active)
  .map(user => user.name)
  .sort((a, b) => a.localeCompare(b));

console.log(activeUserNames); // ['王五', '张三']

// 场景2：Promise链
const fetchUser = (id) => 
  fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => data.user)
    .catch(error => console.error(error));

// 场景3：立即执行函数
const result = ((x, y) => x + y)(5, 3);
console.log(result); // 8

// 场景4：高阶函数
const multiply = (a) => (b) => a * b;
const double = multiply(2);
const triple = multiply(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// 场景5：简洁的条件表达式
const isAdult = age => age >= 18;
const canVote = age => age >= 18 ? '可以投票' : '不能投票';

console.log(isAdult(20));  // true
console.log(canVote(15));  // '不能投票'

// 场景6：对象方法简写
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : 'Error'
};
```

---

## 3. 模板字符串

### 3.1 基本语法

```javascript
// 基本用法
const name = '张三';
const greeting = `你好，${name}！`;
console.log(greeting); // '你好，张三！'

// 多行字符串
const multiLine = `
  这是第一行
  这是第二行
  这是第三行
`;
console.log(multiLine);

// 表达式插值
const a = 10;
const b = 20;
console.log(`${a} + ${b} = ${a + b}`); // '10 + 20 = 30'

// 调用函数
const upper = str => str.toUpperCase();
console.log(`Hello ${upper('world')}`); // 'Hello WORLD'
```

### 3.2 实际应用场景

```javascript
// 场景1：HTML模板
const user = { name: '张三', age: 25, avatar: '/avatar.jpg' };
const html = `
  <div class="user-card">
    <img src="${user.avatar}" alt="${user.name}">
    <h2>${user.name}</h2>
    <p>年龄：${user.age}</p>
  </div>
`;

// 场景2：SQL查询
const tableName = 'users';
const status = 'active';
const sql = `
  SELECT * FROM ${tableName}
  WHERE status = '${status}'
  ORDER BY created_at DESC
`;

// 场景3：日志输出
const logMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
};
logMessage('info', '应用启动'); // [2026-02-02T10:00:00.000Z] [INFO] 应用启动

// 场景4：URL构建
const buildUrl = (base, path, params) => {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return `${base}${path}?${queryString}`;
};

const url = buildUrl('https://api.example.com', '/search', {
  q: '关键词',
  page: 1,
  limit: 10
});
console.log(url);

// 场景5：条件渲染
const userCard = (user) => `
  <div class="card ${user.isVip ? 'vip' : ''}">
    <span>${user.name}</span>
    ${user.isVip ? '<span class="badge">VIP</span>' : ''}
  </div>
`;

// 场景6：列表渲染
const items = ['苹果', '香蕉', '橙子'];
const listHtml = `
  <ul>
    ${items.map(item => `<li>${item}</li>`).join('')}
  </ul>
`;
```

### 3.3 标签模板

```javascript
// 标签模板基本语法
function tag(strings, ...values) {
  console.log('strings:', strings);
  console.log('values:', values);
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] || '');
  }, '');
}

const name = '张三';
const age = 25;
const result = tag`姓名：${name}，年龄：${age}`;
// strings: ['姓名：', '，年龄：', '']
// values: ['张三', 25]

// 场景1：HTML转义防XSS
function safeHtml(strings, ...values) {
  const escape = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? escape(values[i]) : '';
    return result + str + value;
  }, '');
}

const userInput = '<script>alert("XSS")</script>';
const safe = safeHtml`<div>${userInput}</div>`;
console.log(safe); // <div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>

// 场景2：国际化(i18n)
const i18n = (strings, ...values) => {
  // 简化示例
  const translations = {
    'Hello, ': '你好，',
    '!': '！'
  };
  
  return strings.reduce((result, str, i) => {
    const translated = translations[str] || str;
    return result + translated + (values[i] || '');
  }, '');
};

const username = 'John';
console.log(i18n`Hello, ${username}!`); // '你好，John！'

// 场景3：CSS-in-JS
const styled = (strings, ...values) => {
  const css = strings.reduce((result, str, i) => {
    return result + str + (values[i] || '');
  }, '');
  return css.trim();
};

const primaryColor = '#007bff';
const buttonStyle = styled`
  background-color: ${primaryColor};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
`;

// 场景4：SQL安全查询
function sql(strings, ...values) {
  let query = '';
  const params = [];
  
  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      query += '?';
      params.push(values[i]);
    }
  });
  
  return { query, params };
}

const userId = 1;
const status = 'active';
const { query, params } = sql`SELECT * FROM users WHERE id = ${userId} AND status = ${status}`;
console.log(query);  // 'SELECT * FROM users WHERE id = ? AND status = ?'
console.log(params); // [1, 'active']
```

---

## 4. 解构赋值

### 4.1 数组解构

```javascript
// 基本用法
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 跳过元素
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// 默认值
const [x = 1, y = 2] = [10];
console.log(x, y); // 10 2

// 剩余元素
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// 交换变量
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1

// 场景1：函数返回多个值
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min, max); // 1 9

// 场景2：正则表达式匹配
const url = 'https://example.com:8080/path';
const [, protocol, host, port] = url.match(/^(\w+):\/\/([^:]+):(\d+)/);
console.log(protocol, host, port); // 'https' 'example.com' '8080'

// 场景3：处理CSV数据
const csvLine = '张三,25,北京';
const [name, age, city] = csvLine.split(',');
console.log({ name, age, city });

// 场景4：嵌套解构
const nested = [1, [2, 3], [4, [5, 6]]];
const [one, [two, three], [four, [five, six]]] = nested;
console.log(one, two, three, four, five, six); // 1 2 3 4 5 6
```

### 4.2 对象解构

```javascript
// 基本用法
const user = { name: '张三', age: 25, city: '北京' };
const { name, age } = user;
console.log(name, age); // '张三' 25

// 重命名
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // '张三' 25

// 默认值
const { name: n, country = '中国' } = user;
console.log(n, country); // '张三' '中国'

// 重命名 + 默认值
const { email: userEmail = 'unknown@example.com' } = user;
console.log(userEmail); // 'unknown@example.com'

// 场景1：函数参数解构
function printUser({ name, age, city = '未知' }) {
  console.log(`${name}，${age}岁，来自${city}`);
}
printUser({ name: '李四', age: 30 }); // '李四，30岁，来自未知'

// 场景2：嵌套对象解构
const response = {
  data: {
    user: {
      id: 1,
      profile: {
        name: '张三',
        avatar: '/avatar.jpg'
      }
    }
  },
  status: 200
};

const { data: { user: { profile: { name: profileName } } } } = response;
console.log(profileName); // '张三'

// 场景3：剩余属性
const config = { a: 1, b: 2, c: 3, d: 4 };
const { a, ...rest } = config;
console.log(a);    // 1
console.log(rest); // { b: 2, c: 3, d: 4 }

// 场景4：模块导入
// const { useState, useEffect } = React;

// 场景5：API响应处理
function handleResponse({ code, data, message }) {
  if (code === 200) {
    return data;
  }
  throw new Error(message);
}

// 场景6：配置合并
function createServer(options = {}) {
  const {
    port = 3000,
    host = 'localhost',
    debug = false,
    ...otherOptions
  } = options;
  
  console.log(`服务器配置: ${host}:${port}, debug: ${debug}`);
  return { port, host, debug, ...otherOptions };
}

createServer({ port: 8080, ssl: true });
```

### 4.3 混合解构

```javascript
// 数组与对象混合
const data = {
  users: [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ],
  total: 2
};

const { users: [firstUser, secondUser], total } = data;
console.log(firstUser.name, total); // '张三' 2

// 复杂数据结构
const complexData = {
  code: 200,
  data: {
    list: [
      { id: 1, attrs: { color: 'red', size: 'large' } },
      { id: 2, attrs: { color: 'blue', size: 'small' } }
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 100
    }
  }
};

const {
  code,
  data: {
    list: [{ attrs: { color: firstColor } }],
    pagination: { page, total: totalCount }
  }
} = complexData;

console.log(code, firstColor, page, totalCount); // 200 'red' 1 100
```

---

## 5. 默认参数

```javascript
// 基本用法
function greet(name = '访客') {
  console.log(`你好，${name}！`);
}
greet();        // '你好，访客！'
greet('张三'); // '你好，张三！'

// 表达式作为默认值
function getTimestamp(date = new Date()) {
  return date.getTime();
}

// 使用前面参数
function createUrl(base, path, query = `${base}${path}`) {
  return query;
}

// 场景1：配置对象默认值
function ajax(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = 5000
  } = options;
  
  console.log({ url, method, headers, body, timeout });
}

ajax('/api/users');
ajax('/api/users', { method: 'POST', body: JSON.stringify({ name: '张三' }) });

// 场景2：必需参数检查
function required(paramName) {
  throw new Error(`参数 ${paramName} 是必需的`);
}

function createUser(name = required('name'), age = required('age')) {
  return { name, age };
}

// createUser(); // Error: 参数 name 是必需的
createUser('张三', 25); // { name: '张三', age: 25 }

// 场景3：工厂函数
function createCounter(initialValue = 0, step = 1) {
  let count = initialValue;
  return {
    increment() { count += step; return count; },
    decrement() { count -= step; return count; },
    getValue() { return count; }
  };
}

const counter = createCounter(10, 2);
console.log(counter.increment()); // 12
console.log(counter.increment()); // 14

// 场景4：与解构结合
function drawChart({ 
  size = { width: 400, height: 300 },
  coords = { x: 0, y: 0 },
  radius = 10 
} = {}) {
  console.log(size, coords, radius);
}

drawChart(); // 使用所有默认值
drawChart({ radius: 20 }); // 只修改radius

// 场景5：动态默认值
let defaultId = 0;
function createItem(name, id = ++defaultId) {
  return { id, name };
}

console.log(createItem('Item A')); // { id: 1, name: 'Item A' }
console.log(createItem('Item B')); // { id: 2, name: 'Item B' }
console.log(createItem('Item C', 100)); // { id: 100, name: 'Item C' }
```

---

## 6. 剩余参数和展开运算符

### 6.1 剩余参数 (Rest Parameters)

```javascript
// 基本用法
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// 与其他参数结合
function logArgs(first, second, ...rest) {
  console.log('first:', first);
  console.log('second:', second);
  console.log('rest:', rest);
}
logArgs(1, 2, 3, 4, 5);
// first: 1
// second: 2
// rest: [3, 4, 5]

// 场景1：不定参数函数
function max(...values) {
  return Math.max(...values);
}
console.log(max(3, 1, 4, 1, 5)); // 5

// 场景2：函数包装
function wrapFn(fn) {
  return function(...args) {
    console.log('调用参数:', args);
    return fn.apply(this, args);
  };
}

const wrappedAdd = wrapFn((a, b) => a + b);
console.log(wrappedAdd(2, 3)); // 调用参数: [2, 3] → 5

// 场景3：构建新数组
function insertAt(array, index, ...items) {
  return [...array.slice(0, index), ...items, ...array.slice(index)];
}
console.log(insertAt([1, 2, 5], 2, 3, 4)); // [1, 2, 3, 4, 5]
```

### 6.2 展开运算符 (Spread Operator)

```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// 场景1：数组克隆
const original = [1, 2, 3];
const clone = [...original];
clone.push(4);
console.log(original); // [1, 2, 3]
console.log(clone);    // [1, 2, 3, 4]

// 场景2：对象克隆与更新
const user = { name: '张三', age: 25 };
const updatedUser = { ...user, age: 26, city: '北京' };
console.log(updatedUser); // { name: '张三', age: 26, city: '北京' }

// 场景3：函数调用
function greet(name, age, city) {
  console.log(`${name}，${age}岁，来自${city}`);
}
const args = ['张三', 25, '北京'];
greet(...args);

// 场景4：数组去重
const withDuplicates = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(withDuplicates)];
console.log(unique); // [1, 2, 3, 4]

// 场景5：字符串转数组
const str = 'Hello';
const chars = [...str];
console.log(chars); // ['H', 'e', 'l', 'l', 'o']

// 场景6：合并多个对象（后面覆盖前面）
const defaults = { theme: 'light', fontSize: 14, language: 'zh' };
const userPrefs = { theme: 'dark', fontSize: 16 };
const settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: 'dark', fontSize: 16, language: 'zh' }

// 场景7：条件展开
const baseConfig = { port: 3000 };
const debugConfig = { debug: true, verbose: true };
const isDev = true;

const config = {
  ...baseConfig,
  ...(isDev ? debugConfig : {})
};
console.log(config); // { port: 3000, debug: true, verbose: true }

// 场景8：深拷贝的注意事项
const nested = { a: { b: 1 } };
const shallowClone = { ...nested };
shallowClone.a.b = 2;
console.log(nested.a.b); // 2 (展开是浅拷贝！)

// 深拷贝需要递归或使用JSON
const deepClone = JSON.parse(JSON.stringify(nested));
```

---

## 7. 对象字面量增强

### 7.1 属性简写

```javascript
// 当属性名和变量名相同时
const name = '张三';
const age = 25;

// ES5
const userES5 = { name: name, age: age };

// ES6
const userES6 = { name, age };
console.log(userES6); // { name: '张三', age: 25 }

// 场景：函数返回对象
function createPoint(x, y) {
  return { x, y };
}
console.log(createPoint(10, 20)); // { x: 10, y: 20 }
```

### 7.2 方法简写

```javascript
// ES5
const objES5 = {
  sayHello: function() {
    console.log('Hello');
  }
};

// ES6
const objES6 = {
  sayHello() {
    console.log('Hello');
  },
  
  // 异步方法
  async fetchData() {
    return await fetch('/api/data');
  },
  
  // Generator方法
  *generateIds() {
    let id = 0;
    while (true) yield ++id;
  }
};

// 场景：对象方法定义
const calculator = {
  add(a, b) { return a + b; },
  subtract(a, b) { return a - b; },
  multiply(a, b) { return a * b; },
  divide(a, b) { return b !== 0 ? a / b : Infinity; }
};

console.log(calculator.add(2, 3)); // 5
```

### 7.3 计算属性名

```javascript
// 基本用法
const key = 'dynamicKey';
const obj = {
  [key]: 'value',
  ['key' + 1]: 'value1',
  ['key' + 2]: 'value2'
};
console.log(obj); // { dynamicKey: 'value', key1: 'value1', key2: 'value2' }

// 场景1：Symbol作为属性名
const sym = Symbol('description');
const objWithSymbol = {
  [sym]: 'symbol value',
  normalKey: 'normal value'
};
console.log(objWithSymbol[sym]); // 'symbol value'

// 场景2：动态创建getter/setter
const propName = 'age';
const person = {
  _age: 0,
  get [propName]() {
    return this._age;
  },
  set [propName](value) {
    this._age = value > 0 ? value : 0;
  }
};

person.age = 25;
console.log(person.age); // 25

// 场景3：基于数据动态生成对象
function createFlags(flagNames) {
  return flagNames.reduce((obj, name) => ({
    ...obj,
    [`is${name.charAt(0).toUpperCase() + name.slice(1)}`]: false
  }), {});
}

const flags = createFlags(['loading', 'visible', 'active']);
console.log(flags); // { isLoading: false, isVisible: false, isActive: false }

// 场景4：国际化键值对
const locale = 'zh';
const messages = {
  [`greeting_${locale}`]: '你好',
  [`farewell_${locale}`]: '再见'
};
```

---

## 8. 类 (Class)

### 8.1 基本语法

```javascript
// 类声明
class Person {
  // 构造函数
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // 实例方法
  introduce() {
    return `我是${this.name}，今年${this.age}岁`;
  }
  
  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }
  
  // Getter
  get info() {
    return `${this.name} (${this.age})`;
  }
  
  // Setter
  set info(value) {
    const [name, age] = value.split(',');
    this.name = name;
    this.age = parseInt(age);
  }
}

const person = new Person('张三', 25);
console.log(person.introduce()); // '我是张三，今年25岁'
console.log(person.info);        // '张三 (25)'

const person2 = Person.create('李四', 30);
console.log(person2.introduce()); // '我是李四，今年30岁'
```

### 8.2 类继承

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} 发出声音`);
  }
  
  static info() {
    return '这是动物类';
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }
  
  // 方法重写
  speak() {
    console.log(`${this.name} 汪汪叫`);
  }
  
  // 新增方法
  fetch() {
    console.log(`${this.name} 去捡球`);
  }
  
  // 调用父类方法
  speakNormal() {
    super.speak();
  }
}

const dog = new Dog('旺财', '金毛');
dog.speak();       // '旺财 汪汪叫'
dog.fetch();       // '旺财 去捡球'
dog.speakNormal(); // '旺财 发出声音'

console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
console.log(Dog.info());            // '这是动物类' (静态方法继承)
```

### 8.3 实际应用场景

```javascript
// 场景1：数据模型类
class User {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt || new Date();
  }
  
  get displayName() {
    return this.name || this.email.split('@')[0];
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString()
    };
  }
  
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new User({
      ...data,
      createdAt: new Date(data.createdAt)
    });
  }
}

// 场景2：服务类
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async get(path) {
    const response = await fetch(`${this.baseUrl}${path}`);
    return response.json();
  }
  
  async post(path, data) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// 场景3：组件基类
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
  
  render() {
    throw new Error('子类必须实现render方法');
  }
}

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }
  
  handleClick() {
    this.setState({ clicked: true });
  }
  
  render() {
    return `<button>${this.props.text}</button>`;
  }
}

// 场景4：单例模式
class Database {
  static instance = null;
  
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
    this.connection = null;
  }
  
  connect() {
    if (!this.connection) {
      this.connection = 'Connected';
      console.log('数据库连接已建立');
    }
    return this.connection;
  }
  
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true
```

---

## 9. 模块化

### 9.1 导出 (export)

```javascript
// named export - 命名导出
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
}

// 集中导出
const name = 'utils';
const version = '1.0.0';
function helper() {}

export { name, version, helper };

// 重命名导出
export { helper as utilHelper };

// default export - 默认导出
export default function main() {
  console.log('主函数');
}

// 或者
const defaultExport = { a: 1, b: 2 };
export default defaultExport;
```

### 9.2 导入 (import)

```javascript
// 导入命名导出
import { PI, E, add } from './math.js';
console.log(PI);      // 3.14159
console.log(add(1, 2)); // 3

// 重命名导入
import { add as sum, PI as pi } from './math.js';
console.log(sum(1, 2)); // 3

// 导入默认导出
import main from './main.js';

// 同时导入默认和命名
import defaultExport, { named1, named2 } from './module.js';

// 导入全部
import * as math from './math.js';
console.log(math.PI);
console.log(math.add(1, 2));

// 动态导入
async function loadModule() {
  const module = await import('./module.js');
  module.default();
}

// 场景：按需加载
button.addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy-module.js');
  heavyFunction();
});
```

### 9.3 模块化实践

```javascript
// utils/index.js - 模块聚合
export { default as request } from './request.js';
export { formatDate, formatNumber } from './format.js';
export * from './helpers.js';

// 使用
import { request, formatDate, formatNumber } from './utils';

// services/userService.js
import { request } from '../utils';

export class UserService {
  static async getUser(id) {
    return request.get(`/users/${id}`);
  }
  
  static async createUser(data) {
    return request.post('/users', data);
  }
}

// 循环依赖处理
// moduleA.js
import { b } from './moduleB.js';
export const a = 'A';
console.log(b); // 可能是undefined

// 解决方案：延迟访问
export function getA() { return a; }
```

---

## 10. Promise

### 10.1 基本语法

```javascript
// 创建Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject(new Error('操作失败'));
    }
  }, 1000);
});

// 使用Promise
promise
  .then(result => {
    console.log(result); // '操作成功'
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('操作完成');
  });
```

### 10.2 Promise静态方法

```javascript
// Promise.resolve
const resolved = Promise.resolve('立即解决');
resolved.then(console.log); // '立即解决'

// Promise.reject
const rejected = Promise.reject(new Error('立即拒绝'));
rejected.catch(err => console.log(err.message)); // '立即拒绝'

// Promise.all - 全部成功才成功
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => console.log(results)) // [1, 2, 3]
  .catch(error => console.error(error));

// 如果有一个失败
Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error('失败')),
  Promise.resolve(3)
]).catch(err => console.log(err.message)); // '失败'

// Promise.race - 最快的结果（无论成功或失败）
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('慢'), 200)),
  new Promise(resolve => setTimeout(() => resolve('快'), 100))
]).then(result => console.log(result)); // '快'
```

### 10.3 实际应用场景

```javascript
// 场景1：封装Ajax请求
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

// 场景2：超时处理
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });
}

function fetchWithTimeout(url, ms = 5000) {
  return Promise.race([
    fetch(url),
    timeout(ms)
  ]);
}

// 场景3：并行请求
async function fetchAllUsers(ids) {
  const promises = ids.map(id => 
    fetch(`/api/users/${id}`).then(res => res.json())
  );
  return Promise.all(promises);
}

// 场景4：重试机制
function retry(fn, times = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      fn()
        .then(resolve)
        .catch(err => {
          if (n === 0) {
            reject(err);
          } else {
            console.log(`重试剩余次数: ${n}`);
            setTimeout(() => attempt(n - 1), delay);
          }
        });
    }
    attempt(times);
  });
}

// 场景5：串行执行
function serial(tasks) {
  return tasks.reduce((promise, task) => {
    return promise.then(results => {
      return task().then(result => [...results, result]);
    });
  }, Promise.resolve([]));
}

// 场景6：Promise链
function processUser(userId) {
  return fetchUser(userId)
    .then(user => {
      console.log('获取用户:', user);
      return fetchUserPosts(user.id);
    })
    .then(posts => {
      console.log('获取文章:', posts);
      return fetchPostComments(posts[0].id);
    })
    .then(comments => {
      console.log('获取评论:', comments);
      return comments;
    })
    .catch(error => {
      console.error('处理失败:', error);
      throw error;
    });
}

// 模拟函数
function fetchUser(id) {
  return Promise.resolve({ id, name: '张三' });
}
function fetchUserPosts(userId) {
  return Promise.resolve([{ id: 1, title: '文章1' }]);
}
function fetchPostComments(postId) {
  return Promise.resolve([{ id: 1, text: '评论1' }]);
}
```

---

## 11. Symbol

### 11.1 基本语法

```javascript
// 创建Symbol
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log(sym2 === sym3); // false (每个Symbol都是唯一的)
console.log(sym2.description); // 'description'

// Symbol.for - 全局Symbol注册表
const globalSym1 = Symbol.for('globalKey');
const globalSym2 = Symbol.for('globalKey');
console.log(globalSym1 === globalSym2); // true

// Symbol.keyFor
console.log(Symbol.keyFor(globalSym1)); // 'globalKey'
console.log(Symbol.keyFor(sym2));       // undefined
```

### 11.2 应用场景

```javascript
// 场景1：私有属性
const _private = Symbol('private');

class MyClass {
  constructor() {
    this[_private] = '私有数据';
    this.public = '公开数据';
  }
  
  getPrivate() {
    return this[_private];
  }
}

const obj = new MyClass();
console.log(obj.public);      // '公开数据'
console.log(obj[_private]);   // '私有数据' (需要Symbol引用)
console.log(Object.keys(obj)); // ['public'] (Symbol属性不被枚举)

// 场景2：防止属性冲突
const extensions = {
  [Symbol('plugin1')]: { name: 'Plugin 1' },
  [Symbol('plugin2')]: { name: 'Plugin 2' }
};

// 场景3：常量枚举
const Colors = {
  RED: Symbol('red'),
  GREEN: Symbol('green'),
  BLUE: Symbol('blue')
};

function getColorName(color) {
  switch (color) {
    case Colors.RED: return '红色';
    case Colors.GREEN: return '绿色';
    case Colors.BLUE: return '蓝色';
    default: return '未知';
  }
}

console.log(getColorName(Colors.RED)); // '红色'

// 场景4：自定义迭代器
const collection = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    const items = this.items;
    return {
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const item of collection) {
  console.log(item); // 1, 2, 3
}

// 内置Symbol
// Symbol.iterator - 定义迭代器
// Symbol.toStringTag - 自定义toString标签
// Symbol.hasInstance - 自定义instanceof行为
// Symbol.toPrimitive - 自定义类型转换

// 场景5：自定义toString标签
class MyArray {
  get [Symbol.toStringTag]() {
    return 'MyArray';
  }
}

console.log(Object.prototype.toString.call(new MyArray())); 
// '[object MyArray]'

// 场景6：自定义instanceof
class MyNumber {
  static [Symbol.hasInstance](instance) {
    return typeof instance === 'number';
  }
}

console.log(42 instanceof MyNumber); // true
```

---

## 12. 迭代器和生成器

### 12.1 迭代器 (Iterator)

```javascript
// 迭代器协议
const iterator = {
  current: 0,
  last: 5,
  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    }
    return { done: true };
  }
};

console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }

// 可迭代对象
const iterable = {
  data: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}

console.log([...iterable]); // ['a', 'b', 'c']
```

### 12.2 生成器 (Generator)

```javascript
// 基本语法
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 场景1：无限序列
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const sequence = infiniteSequence();
console.log(sequence.next().value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2

// 场景2：ID生成器
function* idGenerator(prefix = 'id') {
  let id = 0;
  while (true) {
    yield `${prefix}_${++id}`;
  }
}

const userIdGen = idGenerator('user');
console.log(userIdGen.next().value); // 'user_1'
console.log(userIdGen.next().value); // 'user_2'

// 场景3：范围生成器
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

console.log([...range(1, 5)]);       // [1, 2, 3, 4, 5]
console.log([...range(0, 10, 2)]);   // [0, 2, 4, 6, 8, 10]

// 场景4：双向通信
function* conversation() {
  const name = yield '你叫什么名字？';
  const hobby = yield `${name}，你的爱好是什么？`;
  return `${name}喜欢${hobby}`;
}

const talk = conversation();
console.log(talk.next().value);       // '你叫什么名字？'
console.log(talk.next('张三').value); // '张三，你的爱好是什么？'
console.log(talk.next('编程').value); // '张三喜欢编程'

// 场景5：yield* 委托
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield* gen1();
  yield 3;
  yield 4;
}

console.log([...gen2()]); // [1, 2, 3, 4]

// 场景6：遍历树结构
function* traverseTree(node) {
  yield node.value;
  if (node.children) {
    for (const child of node.children) {
      yield* traverseTree(child);
    }
  }
}

const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3, children: [{ value: 6 }] }
  ]
};

console.log([...traverseTree(tree)]); // [1, 2, 4, 5, 3, 6]

// 场景7：异步操作控制（co库原理）
function run(generator) {
  const gen = generator();
  
  function step(result) {
    if (result.done) return result.value;
    
    return Promise.resolve(result.value).then(
      value => step(gen.next(value)),
      error => step(gen.throw(error))
    );
  }
  
  return step(gen.next());
}

function* fetchUserData() {
  const user = yield fetch('/api/user').then(r => r.json());
  const posts = yield fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
  return { user, posts };
}

// run(fetchUserData).then(console.log);
```

---

## 13. Map和Set

### 13.1 Map

```javascript
// 创建Map
const map = new Map();

// 设置值
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set({ id: 1 }, 'object key'); // 对象可以作为键

// 获取值
console.log(map.get('key1')); // 'value1'

// 检查键是否存在
console.log(map.has('key1')); // true

// 删除
map.delete('key1');

// 大小
console.log(map.size); // 2

// 清空
// map.clear();

// 初始化
const map2 = new Map([
  ['name', '张三'],
  ['age', 25],
  ['city', '北京']
]);

// 遍历
for (const [key, value] of map2) {
  console.log(`${key}: ${value}`);
}

map2.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 获取键、值、条目
console.log([...map2.keys()]);    // ['name', 'age', 'city']
console.log([...map2.values()]);  // ['张三', 25, '北京']
console.log([...map2.entries()]); // [['name', '张三'], ...]

// 场景1：缓存
const cache = new Map();

function memoize(fn) {
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('从缓存获取');
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensive = memoize((n) => {
  console.log('计算中...');
  return n * n;
});

console.log(expensive(5)); // 计算中... 25
console.log(expensive(5)); // 从缓存获取 25

// 场景2：对象作为键
const userRoles = new Map();
const user1 = { id: 1, name: '张三' };
const user2 = { id: 2, name: '李四' };

userRoles.set(user1, 'admin');
userRoles.set(user2, 'user');

console.log(userRoles.get(user1)); // 'admin'

// 场景3：Map转对象
function mapToObject(map) {
  const obj = {};
  for (const [key, value] of map) {
    if (typeof key === 'string') {
      obj[key] = value;
    }
  }
  return obj;
}

// 场景4：对象转Map
function objectToMap(obj) {
  return new Map(Object.entries(obj));
}

const config = { debug: true, version: '1.0' };
const configMap = objectToMap(config);
console.log(configMap.get('version')); // '1.0'
```

### 13.2 Set

```javascript
// 创建Set
const set = new Set();

// 添加值
set.add(1);
set.add(2);
set.add(3);
set.add(2); // 重复值被忽略

console.log(set.size); // 3

// 检查值是否存在
console.log(set.has(2)); // true

// 删除
set.delete(2);
console.log(set.has(2)); // false

// 初始化
const set2 = new Set([1, 2, 3, 4, 5]);

// 遍历
for (const value of set2) {
  console.log(value);
}

set2.forEach(value => console.log(value));

// 转数组
const arr = [...set2];
// 或
const arr2 = Array.from(set2);

// 场景1：数组去重
const duplicates = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const unique = [...new Set(duplicates)];
console.log(unique); // [1, 2, 3, 4]

// 场景2：集合运算
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 并集
const union = new Set([...setA, ...setB]);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// 交集
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log([...intersection]); // [3, 4]

// 差集
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log([...difference]); // [1, 2]

// 场景3：字符串去重字符
const str = 'hello world';
const uniqueChars = [...new Set(str)].join('');
console.log(uniqueChars); // 'helo wrd'

// 场景4：跟踪已访问元素
const visited = new Set();

function processNode(node) {
  if (visited.has(node)) {
    console.log('已处理过:', node);
    return;
  }
  visited.add(node);
  console.log('处理:', node);
}

processNode('A'); // 处理: A
processNode('B'); // 处理: B
processNode('A'); // 已处理过: A
```

---

## 14. WeakMap和WeakSet

### 14.1 WeakMap

```javascript
// WeakMap的键必须是对象
const wm = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

wm.set(obj1, '数据1');
wm.set(obj2, '数据2');

console.log(wm.get(obj1)); // '数据1'

// 当对象被垃圾回收时，WeakMap中的条目也会被自动删除
// wm.set('string', 'value'); // TypeError: Invalid value used as weak map key

// 场景1：私有数据
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    privateData.set(this, { password });
  }
  
  checkPassword(pwd) {
    return privateData.get(this).password === pwd;
  }
}

const user = new User('张三', 'secret123');
console.log(user.name);              // '张三'
console.log(user.password);          // undefined
console.log(user.checkPassword('secret123')); // true

// 场景2：DOM元素关联数据
const elementData = new WeakMap();

function setElementData(element, data) {
  elementData.set(element, data);
}

function getElementData(element) {
  return elementData.get(element);
}

// const div = document.createElement('div');
// setElementData(div, { clicks: 0, lastClick: null });

// 场景3：缓存计算结果
const computeCache = new WeakMap();

function computeExpensive(obj) {
  if (computeCache.has(obj)) {
    return computeCache.get(obj);
  }
  
  // 模拟耗时计算
  const result = Object.keys(obj).length;
  computeCache.set(obj, result);
  return result;
}

const data = { a: 1, b: 2, c: 3 };
console.log(computeExpensive(data)); // 3 (计算)
console.log(computeExpensive(data)); // 3 (缓存)
```

### 14.2 WeakSet

```javascript
// WeakSet的值必须是对象
const ws = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

ws.add(obj1);
ws.add(obj2);

console.log(ws.has(obj1)); // true

ws.delete(obj1);
console.log(ws.has(obj1)); // false

// 场景1：标记对象
const marked = new WeakSet();

function markObject(obj) {
  marked.add(obj);
}

function isMarked(obj) {
  return marked.has(obj);
}

const item = { name: 'item' };
markObject(item);
console.log(isMarked(item)); // true

// 场景2：防止循环引用（深拷贝）
function deepClone(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (seen.has(obj)) {
    throw new Error('检测到循环引用');
  }
  
  seen.add(obj);
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item, seen));
  }
  
  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], seen);
    }
  }
  
  return clone;
}

// 场景3：验证类实例
const instances = new WeakSet();

class SecureClass {
  constructor() {
    instances.add(this);
  }
  
  static isInstance(obj) {
    return instances.has(obj);
  }
  
  secureMethod() {
    if (!instances.has(this)) {
      throw new Error('非法调用');
    }
    console.log('安全方法执行');
  }
}

const secure = new SecureClass();
console.log(SecureClass.isInstance(secure)); // true
secure.secureMethod(); // '安全方法执行'
```

---

## 15. Proxy和Reflect

### 15.1 Proxy基本用法

```javascript
// 基本语法
const target = { name: '张三', age: 25 };

const handler = {
  get(target, property, receiver) {
    console.log(`读取属性: ${property}`);
    return target[property];
  },
  set(target, property, value, receiver) {
    console.log(`设置属性: ${property} = ${value}`);
    target[property] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

proxy.name;     // 读取属性: name
proxy.age = 26; // 设置属性: age = 26
```

### 15.2 Proxy拦截操作

```javascript
const handler = {
  // 属性读取
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
  
  // 属性设置
  set(target, prop, value, receiver) {
    return Reflect.set(target, prop, value, receiver);
  },
  
  // 属性检查
  has(target, prop) {
    return Reflect.has(target, prop);
  },
  
  // 属性删除
  deleteProperty(target, prop) {
    return Reflect.deleteProperty(target, prop);
  },
  
  // 获取所有属性
  ownKeys(target) {
    return Reflect.ownKeys(target);
  },
  
  // 函数调用
  apply(target, thisArg, args) {
    return Reflect.apply(target, thisArg, args);
  },
  
  // 构造函数调用
  construct(target, args, newTarget) {
    return Reflect.construct(target, args, newTarget);
  }
};
```

### 15.3 实际应用场景

```javascript
// 场景1：数据验证
function createValidator(target, validators) {
  return new Proxy(target, {
    set(target, prop, value) {
      if (validators[prop]) {
        if (!validators[prop](value)) {
          throw new Error(`${prop} 验证失败`);
        }
      }
      target[prop] = value;
      return true;
    }
  });
}

const user = createValidator({}, {
  age: value => typeof value === 'number' && value > 0 && value < 150,
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});

user.age = 25;    // 成功
// user.age = -5; // Error: age 验证失败

// 场景2：负数索引（Python风格）
function createArrayWithNegativeIndex(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      const index = Number(prop);
      if (index < 0) {
        prop = String(target.length + index);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

const arr = createArrayWithNegativeIndex([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4

// 场景3：响应式数据（Vue3原理简化版）
function reactive(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      console.log('收集依赖:', prop);
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'object' ? reactive(value) : value;
    },
    set(target, prop, value, receiver) {
      console.log('触发更新:', prop, value);
      return Reflect.set(target, prop, value, receiver);
    }
  });
}

const state = reactive({ count: 0, user: { name: '张三' } });
state.count;        // 收集依赖: count
state.count = 1;    // 触发更新: count 1

// 场景4：默认值
function withDefaults(target, defaults) {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return value !== undefined ? value : defaults[prop];
    }
  });
}

const config = withDefaults({}, {
  host: 'localhost',
  port: 3000,
  debug: false
});

console.log(config.host);  // 'localhost'
console.log(config.port);  // 3000
config.port = 8080;
console.log(config.port);  // 8080

// 场景5：私有属性
function privateMembers(target, privateKeys) {
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (privateKeys.includes(prop)) {
        throw new Error(`${prop} 是私有属性`);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (privateKeys.includes(prop)) {
        throw new Error(`${prop} 是私有属性`);
      }
      return Reflect.set(target, prop, value, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(key => !privateKeys.includes(key));
    }
  });
}

const obj = privateMembers(
  { name: '张三', _password: 'secret' },
  ['_password']
);

console.log(obj.name);         // '张三'
// console.log(obj._password); // Error: _password 是私有属性
console.log(Object.keys(obj)); // ['name']

// 场景6：日志记录
function logAccess(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      console.log(`[${new Date().toISOString()}] GET ${prop}`);
      return target[prop];
    },
    set(target, prop, value) {
      console.log(`[${new Date().toISOString()}] SET ${prop} = ${value}`);
      target[prop] = value;
      return true;
    }
  });
}
```

### 15.4 Reflect

```javascript
// Reflect提供了操作对象的方法，与Proxy handler对应

const obj = { name: '张三' };

// 获取属性
console.log(Reflect.get(obj, 'name')); // '张三'

// 设置属性
Reflect.set(obj, 'age', 25);
console.log(obj.age); // 25

// 检查属性
console.log(Reflect.has(obj, 'name')); // true

// 删除属性
Reflect.deleteProperty(obj, 'age');
console.log(obj.age); // undefined

// 获取所有键
console.log(Reflect.ownKeys(obj)); // ['name']

// 定义属性
Reflect.defineProperty(obj, 'city', {
  value: '北京',
  enumerable: true
});

// 获取属性描述符
console.log(Reflect.getOwnPropertyDescriptor(obj, 'city'));

// 获取原型
console.log(Reflect.getPrototypeOf(obj));

// 设置原型
// Reflect.setPrototypeOf(obj, proto);

// 防止扩展
// Reflect.preventExtensions(obj);

// 检查是否可扩展
console.log(Reflect.isExtensible(obj)); // true
```

---

## 16. 新的字符串方法

```javascript
// includes - 是否包含
const str = 'Hello World';
console.log(str.includes('World')); // true
console.log(str.includes('world')); // false (区分大小写)
console.log(str.includes('o', 5)); // true (从索引5开始)

// startsWith - 是否以指定字符串开头
console.log(str.startsWith('Hello')); // true
console.log(str.startsWith('World', 6)); // true

// endsWith - 是否以指定字符串结尾
console.log(str.endsWith('World')); // true
console.log(str.endsWith('Hello', 5)); // true (只考虑前5个字符)

// repeat - 重复字符串
console.log('abc'.repeat(3)); // 'abcabcabc'
console.log('='.repeat(20)); // '===================='

// 场景：生成分隔线
const separator = '-'.repeat(50);

// 场景：字符串填充（模拟）
function padLeft(str, len, char = ' ') {
  const padding = char.repeat(Math.max(0, len - str.length));
  return padding + str;
}
console.log(padLeft('5', 3, '0')); // '005'

// Unicode相关
// codePointAt - 获取完整的Unicode码点
const emoji = '😀';
console.log(emoji.codePointAt(0)); // 128512

// String.fromCodePoint - 从码点创建字符
console.log(String.fromCodePoint(128512)); // '😀'

// normalize - Unicode规范化
const str1 = '\u00F1'; // ñ
const str2 = '\u006E\u0303'; // n + ̃
console.log(str1 === str2); // false
console.log(str1.normalize() === str2.normalize()); // true

// String.raw - 获取原始字符串
console.log(String.raw`Hello\nWorld`); // 'Hello\\nWorld'
```

---

## 17. 新的数组方法

```javascript
// Array.from - 从类数组或可迭代对象创建数组
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
console.log(Array.from(arrayLike)); // ['a', 'b', 'c']

// 带映射函数
console.log(Array.from([1, 2, 3], x => x * 2)); // [2, 4, 6]

// 从Set创建
console.log(Array.from(new Set([1, 2, 2, 3]))); // [1, 2, 3]

// 生成序列
console.log(Array.from({ length: 5 }, (_, i) => i)); // [0, 1, 2, 3, 4]

// Array.of - 创建数组
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.of(3));       // [3] (与new Array(3)不同)

// find - 查找元素
const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
];

const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: '李四' }

// findIndex - 查找索引
const index = users.findIndex(u => u.name === '王五');
console.log(index); // 2

// fill - 填充数组
const arr = new Array(5).fill(0);
console.log(arr); // [0, 0, 0, 0, 0]

const arr2 = [1, 2, 3, 4, 5];
arr2.fill(0, 1, 3); // 从索引1到3(不含)填充0
console.log(arr2); // [1, 0, 0, 4, 5]

// copyWithin - 内部复制
const arr3 = [1, 2, 3, 4, 5];
arr3.copyWithin(0, 3); // 将索引3开始的元素复制到索引0
console.log(arr3); // [4, 5, 3, 4, 5]

// entries, keys, values
const arr4 = ['a', 'b', 'c'];

for (const [index, value] of arr4.entries()) {
  console.log(index, value);
}

for (const key of arr4.keys()) {
  console.log(key); // 0, 1, 2
}

for (const value of arr4.values()) {
  console.log(value); // 'a', 'b', 'c'
}
```

---

## 18. 新的对象方法

```javascript
// Object.assign - 对象合并
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

const result = Object.assign(target, source1, source2);
console.log(result); // { a: 1, b: 2, c: 3 }
console.log(target); // { a: 1, b: 2, c: 3 } (target被修改)

// 浅拷贝
const original = { a: 1, b: { c: 2 } };
const copy = Object.assign({}, original);
copy.b.c = 3;
console.log(original.b.c); // 3 (浅拷贝，嵌套对象是引用)

// 场景：合并配置
const defaultConfig = { debug: false, timeout: 5000 };
const userConfig = { debug: true };
const config = Object.assign({}, defaultConfig, userConfig);
console.log(config); // { debug: true, timeout: 5000 }

// Object.is - 严格相等比较
console.log(Object.is(NaN, NaN)); // true (与===不同)
console.log(NaN === NaN);         // false

console.log(Object.is(0, -0));    // false (与===不同)
console.log(0 === -0);            // true

console.log(Object.is('foo', 'foo')); // true

// Object.setPrototypeOf / Object.getPrototypeOf
const animal = { speak() { console.log('...'); } };
const dog = { bark() { console.log('汪汪'); } };

Object.setPrototypeOf(dog, animal);
dog.speak(); // '...'
dog.bark();  // '汪汪'

console.log(Object.getPrototypeOf(dog) === animal); // true
```

---

## 19. 新的数值方法

```javascript
// Number.isFinite - 检查有限数
console.log(Number.isFinite(100));      // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite('100'));    // false (与全局isFinite不同)

// Number.isNaN - 检查NaN
console.log(Number.isNaN(NaN));       // true
console.log(Number.isNaN('NaN'));     // false (与全局isNaN不同)
console.log(isNaN('NaN'));            // true

// Number.isInteger - 检查整数
console.log(Number.isInteger(5));     // true
console.log(Number.isInteger(5.0));   // true
console.log(Number.isInteger(5.5));   // false

// Number.isSafeInteger - 检查安全整数
console.log(Number.isSafeInteger(Math.pow(2, 53) - 1)); // true
console.log(Number.isSafeInteger(Math.pow(2, 53)));     // false

// 常量
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
console.log(Number.EPSILON);          // 2.220446049250313e-16

// Number.parseFloat / Number.parseInt (与全局函数相同)
console.log(Number.parseFloat('3.14')); // 3.14
console.log(Number.parseInt('10', 2));  // 2

// Math新方法
// Math.trunc - 去除小数部分
console.log(Math.trunc(4.7));  // 4
console.log(Math.trunc(-4.7)); // -4

// Math.sign - 返回符号
console.log(Math.sign(5));   // 1
console.log(Math.sign(-5));  // -1
console.log(Math.sign(0));   // 0

// Math.cbrt - 立方根
console.log(Math.cbrt(27)); // 3

// Math.hypot - 计算平方和的平方根
console.log(Math.hypot(3, 4)); // 5

// Math.log2 / Math.log10
console.log(Math.log2(8));   // 3
console.log(Math.log10(100)); // 2

// Math.expm1 / Math.log1p
console.log(Math.expm1(1)); // e - 1
console.log(Math.log1p(1)); // ln(2)

// Math.fround - 32位浮点数
console.log(Math.fround(1.337)); // 1.3370000123977661

// Math.clz32 - 32位整数前导零个数
console.log(Math.clz32(1)); // 31

// Math.imul - 32位整数乘法
console.log(Math.imul(2, 4)); // 8
```

---

## 20. for...of循环

```javascript
// 遍历数组
const arr = [1, 2, 3, 4, 5];
for (const item of arr) {
  console.log(item);
}

// 遍历字符串
const str = 'Hello';
for (const char of str) {
  console.log(char);
}

// 遍历Map
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value);
}

// 遍历Set
const set = new Set([1, 2, 3]);
for (const value of set) {
  console.log(value);
}

// 遍历Generator
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

for (const value of gen()) {
  console.log(value);
}

// 遍历NodeList
// for (const node of document.querySelectorAll('div')) {
//   console.log(node);
// }

// for...of vs for...in
const arr2 = ['a', 'b', 'c'];
arr2.custom = 'custom';

// for...of 只遍历值
for (const value of arr2) {
  console.log(value); // 'a', 'b', 'c'
}

// for...in 遍历可枚举属性（包括自定义属性）
for (const key in arr2) {
  console.log(key); // '0', '1', '2', 'custom'
}

// 与break/continue配合
for (const num of [1, 2, 3, 4, 5]) {
  if (num === 3) continue;
  if (num === 5) break;
  console.log(num); // 1, 2, 4
}

// 遍历对象（对象默认不可迭代）
const obj = { a: 1, b: 2, c: 3 };

// 方法1：Object.keys
for (const key of Object.keys(obj)) {
  console.log(key, obj[key]);
}

// 方法2：Object.values
for (const value of Object.values(obj)) {
  console.log(value);
}

// 方法3：Object.entries
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

---

## 总结

ES6是JavaScript发展史上最重要的版本更新，主要新增特性包括：

1. **变量声明**：let、const提供块级作用域
2. **箭头函数**：简洁语法，词法this绑定
3. **模板字符串**：多行字符串，表达式插值
4. **解构赋值**：从数组和对象中提取数据
5. **参数增强**：默认参数、剩余参数、展开运算符
6. **对象增强**：属性简写、方法简写、计算属性名
7. **类**：面向对象编程语法糖
8. **模块化**：原生import/export支持
9. **Promise**：更好的异步编程方式
10. **Symbol**：新的原始类型
11. **迭代器/生成器**：自定义迭代行为
12. **集合类型**：Map、Set、WeakMap、WeakSet
13. **Proxy/Reflect**：元编程能力
14. **新方法**：字符串、数组、对象、数值的新方法

这些特性极大地提升了JavaScript的开发效率和代码质量，是现代前端开发的基础。
