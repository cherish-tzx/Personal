# ES8 (ES2017) 完整语法详解

> ECMAScript 2017 (ES8) 引入了多个重要特性，包括异步函数、对象方法增强、字符串填充等。
<div class="doc-toc">
## 目录

1. [async/await](#1-asyncawait)
2. [Object.values()](#2-objectvalues)
3. [Object.entries()](#3-objectentries)
4. [Object.getOwnPropertyDescriptors()](#4-objectgetownpropertydescriptors)
5. [String.prototype.padStart()](#5-stringprototypepadstart)
6. [String.prototype.padEnd()](#6-stringprototypepadend)
7. [函数参数列表和调用中的尾逗号](#7-函数参数列表和调用中的尾逗号)
8. [SharedArrayBuffer和Atomics](#8-sharedarraybuffer和atomics)


</div>

---

## 1. async/await

### 1.1 基本语法

`async/await` 是基于 Promise 的异步编程语法糖，让异步代码看起来像同步代码。

```javascript
// 声明async函数
async function fetchData() {
  return '数据';
}

// async函数总是返回Promise
fetchData().then(data => console.log(data)); // '数据'

// 等价于
function fetchDataPromise() {
  return Promise.resolve('数据');
}

// await关键字
async function getData() {
  const result = await fetchData();
  console.log(result); // '数据'
  return result;
}
```

### 1.2 await的使用

```javascript
// await等待Promise解决
async function example() {
  // await暂停执行，等待Promise解决
  const result = await new Promise(resolve => {
    setTimeout(() => resolve('完成'), 1000);
  });
  
  console.log(result); // 1秒后输出 '完成'
  return result;
}

// await非Promise值
async function awaitNonPromise() {
  const result = await 42; // 直接返回值
  console.log(result); // 42
}

// 顺序执行多个await
async function sequential() {
  console.log('开始');
  
  const a = await new Promise(r => setTimeout(() => r(1), 1000));
  console.log('a:', a);
  
  const b = await new Promise(r => setTimeout(() => r(2), 1000));
  console.log('b:', b);
  
  const c = await new Promise(r => setTimeout(() => r(3), 1000));
  console.log('c:', c);
  
  return a + b + c; // 3秒后返回6
}
```

### 1.3 错误处理

```javascript
// try/catch处理错误
async function withErrorHandling() {
  try {
    const result = await fetch('/api/data');
    const data = await result.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

// 捕获特定错误
async function specificError() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return [];
    }
    throw error;
  }
}

// 使用.catch()
async function withCatch() {
  const data = await fetch('/api/data')
    .then(r => r.json())
    .catch(err => ({ error: true, message: err.message }));
  
  return data;
}

// 错误处理包装器
function asyncHandler(fn) {
  return function(...args) {
    return fn(...args).catch(error => {
      console.error('Error:', error);
      throw error;
    });
  };
}

const safeGetData = asyncHandler(async function(id) {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
});
```

### 1.4 并行执行

```javascript
// 使用Promise.all并行执行
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return { user, posts, comments };
}

// 对比顺序执行
async function sequential() {
  const user = await fetchUser();       // 等待完成
  const posts = await fetchPosts();     // 再等待
  const comments = await fetchComments(); // 再等待
  
  return { user, posts, comments };
}

// 部分并行
async function partialParallel() {
  // 先获取用户
  const user = await fetchUser();
  
  // 然后并行获取该用户的数据
  const [posts, followers] = await Promise.all([
    fetchPosts(user.id),
    fetchFollowers(user.id)
  ]);
  
  return { user, posts, followers };
}

// Promise.allSettled (ES2020)
async function allSettledExample() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    Promise.reject(new Error('测试错误'))
  ]);
  
  // results包含所有结果，无论成功或失败
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('成功:', result.value);
    } else {
      console.log('失败:', result.reason);
    }
  });
}
```

### 1.5 实际应用场景

#### 场景1：API请求

```javascript
// 封装请求方法
async function request(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// GET请求
async function getUsers() {
  return request('/api/users');
}

// POST请求
async function createUser(userData) {
  return request('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

// 使用示例
async function userFlow() {
  try {
    // 创建用户
    const newUser = await createUser({
      name: '张三',
      email: 'zhangsan@example.com'
    });
    console.log('创建成功:', newUser);
    
    // 获取所有用户
    const users = await getUsers();
    console.log('用户列表:', users);
    
  } catch (error) {
    console.error('操作失败:', error.message);
  }
}
```

#### 场景2：数据库操作

```javascript
// 模拟数据库操作
class UserService {
  async findById(id) {
    // 模拟数据库查询
    await this.delay(100);
    return { id, name: '用户' + id };
  }
  
  async findAll() {
    await this.delay(100);
    return [
      { id: 1, name: '用户1' },
      { id: 2, name: '用户2' }
    ];
  }
  
  async create(data) {
    await this.delay(100);
    return { id: Date.now(), ...data };
  }
  
  async update(id, data) {
    await this.delay(100);
    return { id, ...data, updatedAt: new Date() };
  }
  
  async delete(id) {
    await this.delay(100);
    return { deleted: true, id };
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 使用
async function main() {
  const userService = new UserService();
  
  // 创建用户
  const user = await userService.create({ name: '张三', age: 25 });
  console.log('创建:', user);
  
  // 更新用户
  const updated = await userService.update(user.id, { name: '张三丰' });
  console.log('更新:', updated);
  
  // 查询所有
  const users = await userService.findAll();
  console.log('列表:', users);
}
```

#### 场景3：文件操作

```javascript
// Node.js文件操作
const fs = require('fs').promises;

async function readJsonFile(path) {
  const content = await fs.readFile(path, 'utf-8');
  return JSON.parse(content);
}

async function writeJsonFile(path, data) {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(path, content);
}

async function copyFile(src, dest) {
  const content = await fs.readFile(src);
  await fs.writeFile(dest, content);
}

// 读取多个配置文件
async function loadConfigs() {
  const [dbConfig, appConfig, cacheConfig] = await Promise.all([
    readJsonFile('./config/database.json'),
    readJsonFile('./config/app.json'),
    readJsonFile('./config/cache.json')
  ]);
  
  return { dbConfig, appConfig, cacheConfig };
}
```

#### 场景4：重试机制

```javascript
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`第${i + 1}次重试失败，${delay}ms后重试`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// 使用
async function fetchWithRetry(url) {
  return retry(async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('请求失败');
    return response.json();
  }, 3, 2000);
}

// 指数退避重试
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s...
      console.log(`等待${delay}ms后重试`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

#### 场景5：并发控制

```javascript
// 限制并发数量
async function asyncPool(limit, items, fn) {
  const results = [];
  const executing = [];
  
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    
    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  return Promise.all(results);
}

// 使用示例
async function downloadImages(urls) {
  const download = async (url) => {
    console.log('开始下载:', url);
    await new Promise(r => setTimeout(r, 1000)); // 模拟下载
    console.log('完成下载:', url);
    return url;
  };
  
  // 最多同时下载3个
  const results = await asyncPool(3, urls, download);
  return results;
}

// 简单的并发限制器
class ConcurrencyLimiter {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  
  async run(fn) {
    if (this.running >= this.limit) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    
    try {
      return await fn();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }
}

const limiter = new ConcurrencyLimiter(3);

async function limitedFetch(url) {
  return limiter.run(() => fetch(url));
}
```

#### 场景6：async迭代器 (配合for await...of)

```javascript
// 异步生成器
async function* asyncGenerator() {
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 100));
    yield i;
  }
}

// 使用for await...of
async function consumeAsyncIterator() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2, 3, 4 (每100ms输出一个)
  }
}

// 分页数据获取
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasMore;
    page++;
  }
}

async function getAllData() {
  const allItems = [];
  
  for await (const items of fetchPages('/api/items')) {
    allItems.push(...items);
  }
  
  return allItems;
}
```

---

## 2. Object.values()

### 2.1 基本语法

`Object.values()` 返回对象自身可枚举属性值的数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };

console.log(Object.values(obj)); // [1, 2, 3]

// 与Object.keys()对比
console.log(Object.keys(obj));   // ['a', 'b', 'c']
console.log(Object.values(obj)); // [1, 2, 3]
```

### 2.2 实际应用场景

```javascript
// 场景1：遍历对象值
const scores = { math: 90, english: 85, chinese: 92 };

const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
const average = total / Object.values(scores).length;

console.log('总分:', total);     // 267
console.log('平均分:', average); // 89

// 场景2：检查对象值
const config = {
  host: 'localhost',
  port: 3000,
  debug: true
};

const hasNullValue = Object.values(config).some(v => v === null);
console.log('包含null值:', hasNullValue); // false

// 场景3：数组化处理
const users = {
  u1: { name: '张三', age: 25 },
  u2: { name: '李四', age: 30 },
  u3: { name: '王五', age: 28 }
};

const userList = Object.values(users);
const names = userList.map(u => u.name);
console.log(names); // ['张三', '李四', '王五']

// 场景4：筛选和转换
const products = {
  p1: { name: '手机', price: 5000, stock: 100 },
  p2: { name: '电脑', price: 8000, stock: 0 },
  p3: { name: '平板', price: 3000, stock: 50 }
};

const inStockProducts = Object.values(products).filter(p => p.stock > 0);
console.log(inStockProducts);

// 场景5：统计
const inventory = {
  apple: 50,
  banana: 30,
  orange: 45,
  grape: 20
};

const totalStock = Object.values(inventory).reduce((a, b) => a + b, 0);
const maxStock = Math.max(...Object.values(inventory));
const minStock = Math.min(...Object.values(inventory));

console.log('总库存:', totalStock); // 145
console.log('最大库存:', maxStock); // 50
console.log('最小库存:', minStock); // 20
```

---

## 3. Object.entries()

### 3.1 基本语法

`Object.entries()` 返回对象自身可枚举属性的键值对数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };

console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]

// 遍历键值对
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}
```

### 3.2 实际应用场景

```javascript
// 场景1：对象转Map
const obj = { name: '张三', age: 25 };
const map = new Map(Object.entries(obj));

console.log(map.get('name')); // '张三'

// 场景2：对象遍历和转换
const prices = {
  apple: 5,
  banana: 3,
  orange: 4
};

// 打折
const discounted = Object.entries(prices).reduce((acc, [key, value]) => {
  acc[key] = value * 0.8; // 8折
  return acc;
}, {});

console.log(discounted); // { apple: 4, banana: 2.4, orange: 3.2 }

// 场景3：过滤对象
const users = {
  u1: { name: '张三', active: true },
  u2: { name: '李四', active: false },
  u3: { name: '王五', active: true }
};

const activeUsers = Object.fromEntries(
  Object.entries(users).filter(([, user]) => user.active)
);

console.log(activeUsers);
// { u1: { name: '张三', active: true }, u3: { name: '王五', active: true } }

// 场景4：对象键值互换
const original = { a: 1, b: 2, c: 3 };
const swapped = Object.fromEntries(
  Object.entries(original).map(([k, v]) => [v, k])
);

console.log(swapped); // { '1': 'a', '2': 'b', '3': 'c' }

// 场景5：URL查询参数
const params = { page: 1, limit: 10, sort: 'name' };
const queryString = Object.entries(params)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');

console.log(queryString); // 'page=1&limit=10&sort=name'

// 场景6：对象排序
const scores = { Alice: 85, Bob: 92, Charlie: 78 };

const sorted = Object.entries(scores)
  .sort(([, a], [, b]) => b - a) // 按分数降序
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

console.log(sorted); // { Bob: 92, Alice: 85, Charlie: 78 }

// 场景7：分组统计
const data = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'A', value: 15 },
  { category: 'B', value: 25 }
];

const grouped = data.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + item.value;
  return acc;
}, {});

Object.entries(grouped).forEach(([category, total]) => {
  console.log(`${category}: ${total}`);
});
// A: 25
// B: 45
```

---

## 4. Object.getOwnPropertyDescriptors()

### 4.1 基本语法

`Object.getOwnPropertyDescriptors()` 返回对象所有自身属性的描述符。

```javascript
const obj = {
  name: '张三',
  get age() {
    return 25;
  }
};

const descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors);
/*
{
  name: {
    value: '张三',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    get: [Function: get age],
    set: undefined,
    enumerable: true,
    configurable: true
  }
}
*/
```

### 4.2 实际应用场景

```javascript
// 场景1：正确复制对象（包括getter/setter）
const source = {
  _value: 0,
  get value() {
    return this._value;
  },
  set value(v) {
    this._value = v;
  }
};

// Object.assign无法复制getter/setter
const copy1 = Object.assign({}, source);
console.log(Object.getOwnPropertyDescriptor(copy1, 'value'));
// { value: 0, writable: true, enumerable: true, configurable: true }

// 使用Object.getOwnPropertyDescriptors正确复制
const copy2 = Object.defineProperties(
  {},
  Object.getOwnPropertyDescriptors(source)
);
console.log(Object.getOwnPropertyDescriptor(copy2, 'value'));
// { get: [Function], set: [Function], ... }

// 场景2：混入（Mixin）
function mixin(target, ...sources) {
  sources.forEach(source => {
    Object.defineProperties(
      target,
      Object.getOwnPropertyDescriptors(source)
    );
  });
  return target;
}

const canFly = {
  fly() {
    console.log('Flying!');
  }
};

const canSwim = {
  swim() {
    console.log('Swimming!');
  }
};

const duck = mixin({}, canFly, canSwim);
duck.fly();  // 'Flying!'
duck.swim(); // 'Swimming!'

// 场景3：创建对象的完整克隆
function cloneWithDescriptors(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

const original = {
  _count: 0,
  get count() { return this._count; },
  set count(v) { this._count = v; },
  increment() { this._count++; }
};

const clone = cloneWithDescriptors(original);
clone.increment();
console.log(clone.count); // 1
console.log(original.count); // 0 (原对象未受影响)

// 场景4：冻结带有getter的对象
const config = {
  _apiKey: 'secret',
  get apiKey() {
    return this._apiKey;
  }
};

// 使用描述符冻结
Object.defineProperties(config, {
  _apiKey: { writable: false, configurable: false },
  apiKey: { configurable: false }
});
```

---

## 5. String.prototype.padStart()

### 5.1 基本语法

`padStart()` 用另一个字符串填充当前字符串的开头。

```javascript
// 基本用法
console.log('5'.padStart(3, '0'));    // '005'
console.log('hello'.padStart(10));    // '     hello' (默认用空格填充)
console.log('abc'.padStart(6, '12')); // '123abc'

// 如果原字符串长度大于等于目标长度，返回原字符串
console.log('hello'.padStart(3)); // 'hello'
```

### 5.2 实际应用场景

```javascript
// 场景1：数字补零
function formatNumber(num, length = 2) {
  return String(num).padStart(length, '0');
}

console.log(formatNumber(5));    // '05'
console.log(formatNumber(12));   // '12'
console.log(formatNumber(5, 4)); // '0005'

// 场景2：日期格式化
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

console.log(formatDate(new Date())); // '2026-02-02 10:05:30'

// 场景3：卡号/手机号脱敏
function maskCardNumber(cardNumber) {
  const last4 = cardNumber.slice(-4);
  return last4.padStart(cardNumber.length, '*');
}

console.log(maskCardNumber('6222021234567890')); // '************7890'

// 场景4：对齐输出
const data = [
  { name: 'Apple', price: 5 },
  { name: 'Banana', price: 3 },
  { name: 'Orange', price: 4 }
];

data.forEach(item => {
  const name = item.name.padEnd(10);
  const price = String(item.price).padStart(5);
  console.log(`${name}: $${price}`);
});
// Apple     : $    5
// Banana    : $    3
// Orange    : $    4

// 场景5：二进制/十六进制格式化
function toBinary(num, bits = 8) {
  return num.toString(2).padStart(bits, '0');
}

function toHex(num, digits = 2) {
  return num.toString(16).padStart(digits, '0');
}

console.log(toBinary(5));    // '00000101'
console.log(toBinary(255));  // '11111111'
console.log(toHex(255));     // 'ff'
console.log(toHex(10, 4));   // '000a'

// 场景6：时间显示
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  return [h, m, s]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
}

console.log(formatTime(3661)); // '01:01:01'
console.log(formatTime(90));   // '00:01:30'
```

---

## 6. String.prototype.padEnd()

### 6.1 基本语法

`padEnd()` 用另一个字符串填充当前字符串的结尾。

```javascript
// 基本用法
console.log('5'.padEnd(3, '0'));     // '500'
console.log('hello'.padEnd(10));     // 'hello     '
console.log('abc'.padEnd(6, '12'));  // 'abc121'
```

### 6.2 实际应用场景

```javascript
// 场景1：表格对齐
function printTable(data) {
  const maxKeyLen = Math.max(...data.map(([k]) => k.length));
  const maxValLen = Math.max(...data.map(([, v]) => String(v).length));
  
  data.forEach(([key, value]) => {
    const paddedKey = key.padEnd(maxKeyLen);
    const paddedValue = String(value).padStart(maxValLen);
    console.log(`| ${paddedKey} | ${paddedValue} |`);
  });
}

printTable([
  ['Name', 'John'],
  ['Age', 25],
  ['City', 'Beijing']
]);
// | Name | John    |
// | Age  |      25 |
// | City | Beijing |

// 场景2：进度条
function progressBar(progress, width = 20) {
  const filled = Math.round(progress * width);
  const bar = '█'.repeat(filled).padEnd(width, '░');
  return `[${bar}] ${Math.round(progress * 100)}%`;
}

console.log(progressBar(0));    // [░░░░░░░░░░░░░░░░░░░░] 0%
console.log(progressBar(0.5));  // [██████████░░░░░░░░░░] 50%
console.log(progressBar(1));    // [████████████████████] 100%

// 场景3：固定长度输出
function truncateOrPad(str, length, suffix = '...') {
  if (str.length > length) {
    return str.slice(0, length - suffix.length) + suffix;
  }
  return str.padEnd(length);
}

console.log(truncateOrPad('Hello', 10));           // 'Hello     '
console.log(truncateOrPad('Hello World!', 10));    // 'Hello W...'

// 场景4：生成固定宽度的列
function formatColumns(rows, colWidths) {
  return rows.map(row => {
    return row.map((cell, i) => {
      return String(cell).padEnd(colWidths[i] || 10);
    }).join(' | ');
  });
}

const rows = [
  ['Name', 'Age', 'City'],
  ['Alice', 25, 'New York'],
  ['Bob', 30, 'Los Angeles']
];

formatColumns(rows, [10, 5, 15]).forEach(row => console.log(row));

// 场景5：ID生成
function generateId(prefix, length = 10) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2);
  return (prefix + timestamp + random).padEnd(length, '0').slice(0, length);
}

console.log(generateId('U')); // 'U1k8x2f...'
```

---

## 7. 函数参数列表和调用中的尾逗号

### 7.1 基本语法

ES8允许在函数参数列表和函数调用中使用尾逗号。

```javascript
// 函数定义中的尾逗号
function greet(
  name,
  age,
  city, // 尾逗号
) {
  console.log(`${name}, ${age}岁, 来自${city}`);
}

// 函数调用中的尾逗号
greet(
  '张三',
  25,
  '北京', // 尾逗号
);

// 箭头函数
const add = (
  a,
  b,
) => a + b;

// 解构参数
function processUser({
  name,
  age,
  email, // 尾逗号
}) {
  console.log(name, age, email);
}
```

### 7.2 好处

```javascript
// 1. 版本控制中的差异更清晰
// 添加新参数前
function oldFn(
  param1,
  param2
) {}

// 添加新参数后（两行变化）
function newFn(
  param1,
  param2,  // 这行也变了
  param3   // 新行
) {}

// 使用尾逗号（只有一行变化）
function fnWithTrailing(
  param1,
  param2,
) {}

function fnWithNewParam(
  param1,
  param2,
  param3, // 只有这一行是新的
) {}

// 2. 更容易重新排序和注释
function configuredFn(
  option1,
  // option2, // 临时禁用
  option3,
) {}

// 3. 代码生成更简单
function generateCall(fnName, args) {
  const argList = args.map(arg => `  ${arg},`).join('\n');
  return `${fnName}(\n${argList}\n)`;
}

console.log(generateCall('test', ['arg1', 'arg2', 'arg3']));
/*
test(
  arg1,
  arg2,
  arg3,
)
*/
```

---

## 8. SharedArrayBuffer和Atomics

### 8.1 SharedArrayBuffer基本概念

`SharedArrayBuffer` 用于在多个 Web Worker 之间共享内存。

```javascript
// 创建共享内存
const sharedBuffer = new SharedArrayBuffer(16); // 16字节

// 创建类型化数组视图
const sharedArray = new Int32Array(sharedBuffer);

// 在Web Worker中使用
// 主线程
const worker = new Worker('worker.js');
worker.postMessage(sharedBuffer);

// worker.js
// self.onmessage = (e) => {
//   const sharedArray = new Int32Array(e.data);
//   sharedArray[0] = 42; // 修改共享内存
// };
```

### 8.2 Atomics操作

`Atomics` 对象提供原子操作，确保多线程安全。

```javascript
const buffer = new SharedArrayBuffer(4);
const view = new Int32Array(buffer);

// 原子加法
Atomics.add(view, 0, 5);
console.log(view[0]); // 5

// 原子减法
Atomics.sub(view, 0, 2);
console.log(view[0]); // 3

// 原子存储
Atomics.store(view, 0, 10);
console.log(Atomics.load(view, 0)); // 10

// 原子交换
const old = Atomics.exchange(view, 0, 20);
console.log(old);     // 10
console.log(view[0]); // 20

// 比较并交换
Atomics.store(view, 0, 5);
Atomics.compareExchange(view, 0, 5, 10); // 如果是5，则替换为10
console.log(view[0]); // 10

// 等待和唤醒（用于线程同步）
// Atomics.wait(view, 0, 0); // 等待view[0]变为非0
// Atomics.notify(view, 0, 1); // 唤醒一个等待的agent
```

### 8.3 实际应用场景

```javascript
// 场景：计数器（多Worker共享）

// main.js
const buffer = new SharedArrayBuffer(4);
const counter = new Int32Array(buffer);

const worker1 = new Worker('counter-worker.js');
const worker2 = new Worker('counter-worker.js');

worker1.postMessage({ buffer, increment: 1000 });
worker2.postMessage({ buffer, increment: 1000 });

// 等待完成后检查
setTimeout(() => {
  console.log('最终计数:', Atomics.load(counter, 0)); // 2000
}, 1000);

// counter-worker.js
/*
self.onmessage = (e) => {
  const { buffer, increment } = e.data;
  const counter = new Int32Array(buffer);
  
  for (let i = 0; i < increment; i++) {
    Atomics.add(counter, 0, 1);
  }
  
  self.postMessage('done');
};
*/

// 场景：互斥锁实现
class Mutex {
  constructor(sharedArray, index) {
    this.sharedArray = sharedArray;
    this.index = index;
  }
  
  lock() {
    while (Atomics.compareExchange(this.sharedArray, this.index, 0, 1) !== 0) {
      Atomics.wait(this.sharedArray, this.index, 1);
    }
  }
  
  unlock() {
    Atomics.store(this.sharedArray, this.index, 0);
    Atomics.notify(this.sharedArray, this.index, 1);
  }
}
```

---

## 总结

ES8 (ES2017) 的主要新特性：

### async/await
- 基于Promise的异步编程语法糖
- 让异步代码更易读、更易写
- 支持try/catch错误处理
- 可与Promise.all等配合使用

### Object.values() / Object.entries()
- 更方便地获取对象的值和键值对
- 便于遍历和转换对象数据
- 与数组方法无缝配合

### Object.getOwnPropertyDescriptors()
- 获取所有属性描述符
- 正确复制带有getter/setter的对象
- 实现完整的对象克隆

### String.prototype.padStart() / padEnd()
- 字符串填充方法
- 常用于格式化输出
- 数字补零、对齐显示等

### 尾逗号
- 函数参数列表和调用中允许尾逗号
- 便于版本控制和代码维护

### SharedArrayBuffer和Atomics
- 多线程共享内存
- 原子操作保证线程安全
- 用于高性能并行计算

这些特性极大地提升了JavaScript的异步编程能力和数据处理能力。
