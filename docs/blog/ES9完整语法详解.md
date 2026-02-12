# ES9 (ES2018) 完整语法详解

> ECMAScript 2018 (ES9) 引入了异步迭代、对象展开运算符、正则表达式增强等重要特性。
<div class="doc-toc">
## 目录

1. [异步迭代 (for await...of)](#1-异步迭代-for-awaitof)
2. [对象展开运算符](#2-对象展开运算符)
3. [Promise.prototype.finally()](#3-promiseprototypefinally)
4. [正则表达式增强](#4-正则表达式增强)
5. [模板字面量修订](#5-模板字面量修订)


</div>

---

## 1. 异步迭代 (for await...of)

### 1.1 基本语法

`for await...of` 语句用于遍历异步可迭代对象。

```javascript
// 异步生成器
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

// 使用 for await...of 遍历
async function main() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 1, 2, 3
  }
}

main();
```

### 1.2 异步可迭代协议

```javascript
// 实现异步可迭代接口
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    return {
      async next() {
        if (i < 3) {
          await new Promise(r => setTimeout(r, 100));
          return { value: i++, done: false };
        }
        return { done: true };
      }
    };
  }
};

async function iterate() {
  for await (const value of asyncIterable) {
    console.log(value); // 0, 1, 2 (每100ms输出一个)
  }
}

iterate();
```

### 1.3 实际应用场景

#### 场景1：分页数据获取

```javascript
// 异步生成器获取分页数据
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}&limit=10`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasNextPage;
    page++;
  }
}

// 使用
async function getAllItems() {
  const allItems = [];
  
  for await (const items of fetchPages('/api/products')) {
    allItems.push(...items);
    console.log(`已获取 ${allItems.length} 条数据`);
  }
  
  return allItems;
}
```

#### 场景2：流式读取文件

```javascript
// Node.js 读取流
const fs = require('fs');

async function readFileByLine(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const lines = [];
  let buffer = '';
  
  for await (const chunk of stream) {
    buffer += chunk;
    const parts = buffer.split('\n');
    buffer = parts.pop(); // 保留最后一个不完整的行
    
    for (const line of parts) {
      lines.push(line);
      console.log('读取行:', line);
    }
  }
  
  if (buffer) {
    lines.push(buffer);
  }
  
  return lines;
}
```

#### 场景3：WebSocket消息处理

```javascript
// 异步消息队列
class AsyncMessageQueue {
  constructor() {
    this.messages = [];
    this.resolvers = [];
  }
  
  push(message) {
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve({ value: message, done: false });
    } else {
      this.messages.push(message);
    }
  }
  
  close() {
    this.resolvers.forEach(resolve => resolve({ done: true }));
  }
  
  [Symbol.asyncIterator]() {
    return {
      next: () => {
        if (this.messages.length > 0) {
          return Promise.resolve({ 
            value: this.messages.shift(), 
            done: false 
          });
        }
        return new Promise(resolve => {
          this.resolvers.push(resolve);
        });
      }
    };
  }
}

// 使用
const queue = new AsyncMessageQueue();

// 模拟接收消息
setTimeout(() => queue.push('消息1'), 100);
setTimeout(() => queue.push('消息2'), 200);
setTimeout(() => queue.push('消息3'), 300);
setTimeout(() => queue.close(), 400);

async function processMessages() {
  for await (const message of queue) {
    console.log('处理:', message);
  }
  console.log('队列已关闭');
}

processMessages();
```

#### 场景4：数据库游标

```javascript
// 模拟数据库游标
async function* dbCursor(query, batchSize = 100) {
  let offset = 0;
  
  while (true) {
    // 模拟数据库查询
    const results = await queryDatabase(query, offset, batchSize);
    
    if (results.length === 0) break;
    
    for (const row of results) {
      yield row;
    }
    
    if (results.length < batchSize) break;
    offset += batchSize;
  }
}

async function queryDatabase(query, offset, limit) {
  // 模拟数据库查询
  await new Promise(r => setTimeout(r, 50));
  const total = 350;
  const remaining = Math.max(0, total - offset);
  const count = Math.min(limit, remaining);
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    data: `Row ${offset + i + 1}`
  }));
}

// 使用
async function processAllRows() {
  let count = 0;
  
  for await (const row of dbCursor('SELECT * FROM users')) {
    count++;
    if (count % 100 === 0) {
      console.log(`已处理 ${count} 行`);
    }
  }
  
  console.log(`总共处理 ${count} 行`);
}

processAllRows();
```

#### 场景5：并行处理多个异步源

```javascript
// 合并多个异步迭代器
async function* merge(...iterables) {
  const iterators = iterables.map(it => it[Symbol.asyncIterator]());
  const promises = iterators.map((it, index) => 
    it.next().then(result => ({ result, index }))
  );
  
  while (promises.length > 0) {
    const { result, index } = await Promise.race(promises);
    
    if (result.done) {
      promises.splice(index, 1);
      iterators.splice(index, 1);
    } else {
      yield result.value;
      promises[index] = iterators[index]
        .next()
        .then(result => ({ result, index }));
    }
  }
}

// 创建两个异步数据源
async function* source1() {
  for (let i = 0; i < 3; i++) {
    await new Promise(r => setTimeout(r, 100));
    yield `Source1-${i}`;
  }
}

async function* source2() {
  for (let i = 0; i < 3; i++) {
    await new Promise(r => setTimeout(r, 150));
    yield `Source2-${i}`;
  }
}

// 合并处理
async function mergeStreams() {
  for await (const value of merge(source1(), source2())) {
    console.log(value);
  }
}
```

---

## 2. 对象展开运算符

### 2.1 对象的剩余属性 (Rest Properties)

```javascript
// 基本用法
const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a);    // 1
console.log(b);    // 2
console.log(rest); // { c: 3, d: 4 }

// 实际应用：排除特定属性
const user = {
  id: 1,
  name: '张三',
  password: 'secret',
  email: 'zhangsan@example.com'
};

const { password, ...safeUser } = user;
console.log(safeUser); // { id: 1, name: '张三', email: '...' }
```

### 2.2 对象展开 (Spread Properties)

```javascript
// 基本用法
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// 后面的属性覆盖前面的
const obj3 = { a: 1, b: 2 };
const obj4 = { b: 3, c: 4 };
const result = { ...obj3, ...obj4 };
console.log(result); // { a: 1, b: 3, c: 4 }
```

### 2.3 实际应用场景

#### 场景1：对象浅拷贝

```javascript
const original = { name: '张三', age: 25, address: { city: '北京' } };

// 浅拷贝
const copy = { ...original };
copy.name = '李四';
console.log(original.name); // '张三' (原对象不受影响)

// 注意：嵌套对象是引用
copy.address.city = '上海';
console.log(original.address.city); // '上海' (原对象被修改了！)

// 深拷贝需要递归或使用JSON
const deepCopy = JSON.parse(JSON.stringify(original));
```

#### 场景2：默认值合并

```javascript
const defaults = {
  theme: 'light',
  fontSize: 14,
  language: 'zh-CN',
  notifications: true
};

const userSettings = {
  theme: 'dark',
  fontSize: 16
};

// 合并配置（用户配置覆盖默认配置）
const settings = { ...defaults, ...userSettings };
console.log(settings);
// { theme: 'dark', fontSize: 16, language: 'zh-CN', notifications: true }
```

#### 场景3：更新对象属性（不可变更新）

```javascript
const state = {
  user: {
    name: '张三',
    age: 25
  },
  posts: [],
  loading: false
};

// 更新嵌套属性（保持不可变性）
const newState = {
  ...state,
  user: {
    ...state.user,
    age: 26
  }
};

console.log(state.user.age);    // 25 (原状态不变)
console.log(newState.user.age); // 26

// Redux reducer示例
function userReducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...state, name: action.payload };
    case 'UPDATE_AGE':
      return { ...state, age: action.payload };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        address: { ...state.address, ...action.payload }
      };
    default:
      return state;
  }
}
```

#### 场景4：条件属性

```javascript
const isAdmin = true;
const isVip = false;

const user = {
  name: '张三',
  age: 25,
  ...(isAdmin && { role: 'admin', permissions: ['all'] }),
  ...(isVip && { vipLevel: 3 })
};

console.log(user);
// { name: '张三', age: 25, role: 'admin', permissions: ['all'] }
// (vipLevel不存在，因为isVip为false)

// 另一种写法
const user2 = {
  name: '张三',
  ...(isAdmin ? { role: 'admin' } : {}),
  ...(isVip ? { vipLevel: 3 } : {})
};
```

#### 场景5：函数参数处理

```javascript
// 提取特定参数，其余传递
function Button({ children, onClick, ...restProps }) {
  return {
    type: 'button',
    props: {
      onClick,
      ...restProps
    },
    children
  };
}

const button = Button({
  children: '点击',
  onClick: () => console.log('clicked'),
  className: 'btn',
  disabled: false
});

console.log(button);
// {
//   type: 'button',
//   props: { onClick: [Function], className: 'btn', disabled: false },
//   children: '点击'
// }
```

#### 场景6：排除多个属性

```javascript
// 排除多个属性
function omit(obj, ...keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

const user = {
  id: 1,
  name: '张三',
  password: 'secret',
  token: 'abc123',
  email: 'test@example.com'
};

const publicUser = omit(user, 'password', 'token');
console.log(publicUser); // { id: 1, name: '张三', email: '...' }

// 使用解构实现
function omitDestructure(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
}
```

#### 场景7：对象属性重命名

```javascript
// 重命名属性
const original = { name: '张三', age: 25 };
const { name: userName, ...rest } = original;
const renamed = { userName, ...rest };

console.log(renamed); // { userName: '张三', age: 25 }

// 通用函数
function renameKey(obj, oldKey, newKey) {
  const { [oldKey]: value, ...rest } = obj;
  return { ...rest, [newKey]: value };
}

console.log(renameKey({ a: 1, b: 2 }, 'a', 'x')); // { b: 2, x: 1 }
```

---

## 3. Promise.prototype.finally()

### 3.1 基本语法

`finally()` 方法在 Promise 完成时（无论成功还是失败）都会执行。

```javascript
// 基本用法
Promise.resolve('成功')
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('完成'));

// 输出:
// 成功
// 完成

// 失败时
Promise.reject(new Error('失败'))
  .then(result => console.log(result))
  .catch(error => console.error(error.message))
  .finally(() => console.log('完成'));

// 输出:
// 失败
// 完成
```

### 3.2 finally的特点

```javascript
// finally不接收参数
Promise.resolve(42)
  .finally(value => {
    console.log(value); // undefined (不是42)
    return 100; // 返回值被忽略
  })
  .then(value => console.log(value)); // 42 (原值被传递)

// finally抛出错误会改变Promise状态
Promise.resolve(42)
  .finally(() => {
    throw new Error('finally错误');
  })
  .then(value => console.log('then:', value))
  .catch(error => console.log('catch:', error.message));

// 输出: catch: finally错误
```

### 3.3 实际应用场景

#### 场景1：加载状态管理

```javascript
class DataService {
  constructor() {
    this.loading = false;
  }
  
  async fetchData(url) {
    this.loading = true;
    console.log('开始加载...');
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('数据获取成功');
      return data;
    } catch (error) {
      console.error('数据获取失败:', error.message);
      throw error;
    } finally {
      this.loading = false;
      console.log('加载完成');
    }
  }
}

// 或使用Promise链
function fetchWithLoading(url) {
  let isLoading = true;
  console.log('开始加载...');
  
  return fetch(url)
    .then(response => response.json())
    .finally(() => {
      isLoading = false;
      console.log('加载完成');
    });
}
```

#### 场景2：资源清理

```javascript
// 数据库连接
async function queryDatabase(sql) {
  const connection = await db.connect();
  
  try {
    const result = await connection.query(sql);
    return result;
  } finally {
    await connection.close(); // 确保连接被关闭
    console.log('数据库连接已关闭');
  }
}

// 文件操作
async function processFile(path) {
  const file = await openFile(path);
  
  try {
    const content = await file.read();
    return processContent(content);
  } finally {
    await file.close(); // 确保文件被关闭
  }
}
```

#### 场景3：隐藏模态框

```javascript
function showModal(content) {
  return new Promise((resolve, reject) => {
    const modal = createModal(content);
    modal.show();
    
    modal.onConfirm = () => resolve(true);
    modal.onCancel = () => resolve(false);
    modal.onError = (err) => reject(err);
  });
}

async function confirmAction() {
  try {
    const confirmed = await showModal('确定要删除吗？');
    if (confirmed) {
      await deleteItem();
      showToast('删除成功');
    }
  } catch (error) {
    showToast('操作失败: ' + error.message);
  } finally {
    hideModal(); // 确保模态框被隐藏
  }
}
```

#### 场景4：计时和日志

```javascript
// 性能计时
async function timedOperation(name, operation) {
  const startTime = Date.now();
  console.log(`[${name}] 开始执行`);
  
  try {
    return await operation();
  } finally {
    const duration = Date.now() - startTime;
    console.log(`[${name}] 执行完成，耗时 ${duration}ms`);
  }
}

// 使用
timedOperation('fetchUsers', () => fetch('/api/users').then(r => r.json()))
  .then(users => console.log('获取到', users.length, '个用户'));
```

#### 场景5：表单提交

```javascript
class FormHandler {
  constructor(formElement) {
    this.form = formElement;
    this.submitButton = formElement.querySelector('button[type="submit"]');
  }
  
  async submit(data) {
    this.submitButton.disabled = true;
    this.submitButton.textContent = '提交中...';
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('提交失败');
      
      return await response.json();
    } catch (error) {
      alert('提交失败: ' + error.message);
      throw error;
    } finally {
      this.submitButton.disabled = false;
      this.submitButton.textContent = '提交';
    }
  }
}
```

---

## 4. 正则表达式增强

### 4.1 命名捕获组

```javascript
// 传统捕获组
const dateRegex1 = /(\d{4})-(\d{2})-(\d{2})/;
const match1 = dateRegex1.exec('2026-02-02');
console.log(match1[1]); // '2026' (年)
console.log(match1[2]); // '02' (月)
console.log(match1[3]); // '02' (日)

// 命名捕获组 (?<name>...)
const dateRegex2 = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match2 = dateRegex2.exec('2026-02-02');
console.log(match2.groups.year);  // '2026'
console.log(match2.groups.month); // '02'
console.log(match2.groups.day);   // '02'

// 解构使用
const { groups: { year, month, day } } = dateRegex2.exec('2026-02-02');
console.log(year, month, day); // '2026' '02' '02'
```

#### 场景：解析URL

```javascript
const urlRegex = /^(?<protocol>https?):\/\/(?<host>[^/:]+)(?::(?<port>\d+))?(?<path>\/[^?]*)?(?:\?(?<query>.*))?$/;

function parseUrl(url) {
  const match = urlRegex.exec(url);
  if (!match) return null;
  
  const { protocol, host, port, path, query } = match.groups;
  
  return {
    protocol,
    host,
    port: port ? parseInt(port) : (protocol === 'https' ? 443 : 80),
    path: path || '/',
    query: query ? parseQuery(query) : {}
  };
}

function parseQuery(queryString) {
  return Object.fromEntries(
    queryString.split('&').map(pair => pair.split('=').map(decodeURIComponent))
  );
}

console.log(parseUrl('https://example.com:8080/path?name=test&id=1'));
// {
//   protocol: 'https',
//   host: 'example.com',
//   port: 8080,
//   path: '/path',
//   query: { name: 'test', id: '1' }
// }
```

### 4.2 后行断言 (Lookbehind Assertions)

```javascript
// 正向后行断言 (?<=...)
// 匹配前面是特定模式的内容
const priceRegex = /(?<=\$)\d+(\.\d{2})?/g;
console.log('价格: $19.99 和 $25.00'.match(priceRegex)); // ['19.99', '25.00']

// 负向后行断言 (?<!...)
// 匹配前面不是特定模式的内容
const notDollarRegex = /(?<!\$)\d+/g;
console.log('$10 和 20 元'.match(notDollarRegex)); // ['0', '20'] 
// 注意：'0'是$10的'0'，'20'是独立的

// 更精确的例子
const wordRegex = /(?<!\$)\b\d+\b/g;
console.log('$10 和 20 元'.match(wordRegex)); // ['20']
```

#### 场景：密码脱敏

```javascript
// 脱敏密码参数
const logText = 'user=admin&password=secret123&token=abc';
const masked = logText.replace(/(?<=password=)[^&]+/, '***');
console.log(masked); // 'user=admin&password=***&token=abc'

// 脱敏手机号中间四位
const phone = '13812345678';
const maskedPhone = phone.replace(/(?<=\d{3})\d{4}(?=\d{4})/, '****');
console.log(maskedPhone); // '138****5678'

// 脱敏邮箱
const email = 'username@example.com';
const maskedEmail = email.replace(/(?<=.{2}).+(?=@)/, '***');
console.log(maskedEmail); // 'us***@example.com'
```

### 4.3 Unicode属性转义

```javascript
// 匹配所有字母（包括中文等）
const letterRegex = /\p{Letter}/gu;
console.log('Hello 世界'.match(letterRegex)); 
// ['H', 'e', 'l', 'l', 'o', '世', '界']

// 匹配中文字符
const chineseRegex = /\p{Script=Han}/gu;
console.log('Hello 世界 123'.match(chineseRegex)); // ['世', '界']

// 匹配所有数字
const numberRegex = /\p{Number}/gu;
console.log('价格: ¥100 或 ①②③'.match(numberRegex)); // ['1', '0', '0', '①', '②', '③']

// 匹配空白字符
const spaceRegex = /\p{White_Space}/gu;

// 匹配标点符号
const punctRegex = /\p{Punctuation}/gu;
console.log('Hello, World!'.match(punctRegex)); // [',', '!']

// 匹配表情符号
const emojiRegex = /\p{Emoji}/gu;
console.log('Hello 👋 World 🌍'.match(emojiRegex)); // ['👋', '🌍']
```

#### 场景：表单验证

```javascript
// 验证中文名字
function validateChineseName(name) {
  const regex = /^[\p{Script=Han}]{2,4}$/u;
  return regex.test(name);
}

console.log(validateChineseName('张三'));   // true
console.log(validateChineseName('张'));     // false (太短)
console.log(validateChineseName('Zhang')); // false (非中文)

// 验证包含中文的内容
function containsChinese(text) {
  return /\p{Script=Han}/u.test(text);
}

console.log(containsChinese('Hello'));       // false
console.log(containsChinese('Hello 世界'));  // true

// 统计字符类型
function analyzeText(text) {
  return {
    letters: (text.match(/\p{Letter}/gu) || []).length,
    numbers: (text.match(/\p{Number}/gu) || []).length,
    chinese: (text.match(/\p{Script=Han}/gu) || []).length,
    emojis: (text.match(/\p{Emoji}/gu) || []).length,
    spaces: (text.match(/\p{White_Space}/gu) || []).length
  };
}

console.log(analyzeText('Hello 世界 123 👋'));
// { letters: 10, numbers: 3, chinese: 2, emojis: 1, spaces: 3 }
```

### 4.4 s (dotAll) 标志

```javascript
// 默认情况下，点(.)不匹配换行符
const text = `Line 1
Line 2`;

console.log(/Line.+Line/.test(text)); // false

// 使用 s 标志，点可以匹配换行符
console.log(/Line.+Line/s.test(text)); // true

// 匹配多行HTML标签
const html = `<div>
  <p>Hello</p>
</div>`;

const tagRegex = /<div>.*<\/div>/s;
console.log(tagRegex.test(html)); // true

// 提取多行内容
const contentRegex = /<div>(?<content>.*)<\/div>/s;
const match = contentRegex.exec(html);
console.log(match.groups.content.trim()); // '<p>Hello</p>'
```

### 4.5 正则表达式综合实例

```javascript
// 解析日志条目
const logEntry = '[2026-02-02 10:30:45] ERROR user=admin ip=192.168.1.1 message=登录失败';

const logRegex = /\[(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (?<level>\w+) user=(?<user>\w+) ip=(?<ip>[\d.]+) message=(?<message>.+)/;

const logMatch = logRegex.exec(logEntry);
if (logMatch) {
  const { timestamp, level, user, ip, message } = logMatch.groups;
  console.log({
    timestamp,
    level,
    user,
    ip,
    message
  });
}

// 解析Markdown链接
const markdown = '这是一个[链接](https://example.com)和另一个[链接2](https://test.com)';
const linkRegex = /\[(?<text>[^\]]+)\]\((?<url>[^)]+)\)/g;

let linkMatch;
while ((linkMatch = linkRegex.exec(markdown)) !== null) {
  console.log(`文本: ${linkMatch.groups.text}, URL: ${linkMatch.groups.url}`);
}
// 文本: 链接, URL: https://example.com
// 文本: 链接2, URL: https://test.com
```

---

## 5. 模板字面量修订

### 5.1 基本概念

ES9修订了模板字面量的限制，允许在标签模板中使用无效的转义序列。

```javascript
// ES9之前，这会报错
// const latex = (strings) => strings.raw[0];
// latex`\unicode`; // SyntaxError

// ES9之后，raw字符串仍可用
function latex(strings) {
  return strings.raw[0];
}

console.log(latex`\unicode`); // '\unicode'
console.log(latex`\u{}`);     // '\u{}'

// cooked字符串为undefined
function showAll(strings) {
  console.log('cooked:', strings[0]); // undefined (无效转义)
  console.log('raw:', strings.raw[0]); // '\unicode'
}

showAll`\unicode`;
```

### 5.2 实际应用

```javascript
// LaTeX模板
function latex(strings, ...values) {
  let result = strings.raw[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings.raw[i + 1];
  }
  return result;
}

const formula = latex`\frac{a}{b}`;
console.log(formula); // '\frac{a}{b}'

// Windows路径
function windowsPath(strings, ...values) {
  return strings.raw.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
}

const path = windowsPath`C:\Users\admin\Documents`;
console.log(path); // 'C:\Users\admin\Documents'

// DSL (领域特定语言)
function regex(strings, ...values) {
  const pattern = strings.raw.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
  return new RegExp(pattern);
}

const digitPattern = regex`\d+`;
console.log(digitPattern.test('123')); // true
```

---

## 总结

ES9 (ES2018) 的主要新特性：

### 异步迭代 (for await...of)
- 遍历异步可迭代对象
- 配合异步生成器使用
- 适用于流式数据处理、分页获取等场景

### 对象展开运算符
- 对象的剩余属性（Rest Properties）
- 对象的展开属性（Spread Properties）
- 便于对象合并、浅拷贝、属性排除等

### Promise.prototype.finally()
- 无论成功或失败都执行
- 用于清理操作、状态重置等
- 不改变Promise的值

### 正则表达式增强
- 命名捕获组 `(?<name>...)`
- 后行断言 `(?<=...)` 和 `(?<!...)`
- Unicode属性转义 `\p{...}`
- dotAll模式 `s` 标志

### 模板字面量修订
- 允许标签模板中的无效转义序列
- 便于编写DSL和特殊格式的字符串

这些特性进一步增强了JavaScript的异步编程能力和数据处理能力。
