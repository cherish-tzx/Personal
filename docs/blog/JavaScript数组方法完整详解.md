# JavaScript 数组方法完整详解

> 本文档详细介绍JavaScript中所有数组方法，包括静态方法和实例方法，配合多场景实例讲解。
<div class="doc-toc">
## 目录

1. [数组创建方法](#1-数组创建方法)
2. [数组修改方法（改变原数组）](#2-数组修改方法改变原数组)
3. [数组访问方法（不改变原数组）](#3-数组访问方法不改变原数组)
4. [数组迭代方法](#4-数组迭代方法)
5. [数组搜索方法](#5-数组搜索方法)
6. [数组排序方法](#6-数组排序方法)
7. [数组转换方法](#7-数组转换方法)
8. [类型化数组方法](#8-类型化数组方法)


</div>

---

## 1. 数组创建方法

### 1.1 Array构造函数

```javascript
// 创建空数组
const arr1 = new Array();
console.log(arr1); // []

// 指定长度
const arr2 = new Array(5);
console.log(arr2.length); // 5
console.log(arr2); // [empty × 5]

// 传入元素
const arr3 = new Array(1, 2, 3);
console.log(arr3); // [1, 2, 3]

// 注意：单个数字参数是长度，不是元素
const arr4 = new Array(3); // 长度为3的空数组
const arr5 = new Array('3'); // ['3']
```

### 1.2 Array.of() (ES6)

创建具有可变数量参数的数组，与`Array`构造函数不同。

```javascript
// 解决了Array构造函数的问题
console.log(Array.of(3));       // [3] (元素是3)
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.of());        // []
console.log(Array.of(undefined)); // [undefined]

// 场景：从参数创建数组
function toArray(...args) {
  return Array.of(...args);
}
console.log(toArray(1, 2, 3)); // [1, 2, 3]
```

### 1.3 Array.from() (ES6)

从类数组或可迭代对象创建数组。

```javascript
// 从字符串创建
console.log(Array.from('hello')); // ['h', 'e', 'l', 'l', 'o']

// 从Set创建
console.log(Array.from(new Set([1, 2, 2, 3]))); // [1, 2, 3]

// 从Map创建
const map = new Map([['a', 1], ['b', 2]]);
console.log(Array.from(map)); // [['a', 1], ['b', 2]]

// 从类数组对象创建
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
console.log(Array.from(arrayLike)); // ['a', 'b', 'c']

// 使用映射函数
console.log(Array.from([1, 2, 3], x => x * 2)); // [2, 4, 6]

// 生成数字序列
console.log(Array.from({ length: 5 }, (_, i) => i)); // [0, 1, 2, 3, 4]
console.log(Array.from({ length: 5 }, (_, i) => i + 1)); // [1, 2, 3, 4, 5]

// 场景1：DOM NodeList转数组
// const divs = Array.from(document.querySelectorAll('div'));

// 场景2：生成范围数组
function range(start, end, step = 1) {
  const length = Math.ceil((end - start) / step);
  return Array.from({ length }, (_, i) => start + i * step);
}
console.log(range(1, 10));    // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(range(0, 10, 2)); // [0, 2, 4, 6, 8]

// 场景3：初始化二维数组
const matrix = Array.from({ length: 3 }, () => Array(3).fill(0));
console.log(matrix); // [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

// 场景4：去重
const unique = arr => Array.from(new Set(arr));
console.log(unique([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
```

### 1.4 Array.isArray()

判断值是否为数组。

```javascript
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray('abc'));      // false
console.log(Array.isArray({ length: 3 })); // false
console.log(Array.isArray(new Array())); // true

// 场景：类型检查
function processInput(input) {
  if (!Array.isArray(input)) {
    input = [input]; // 转为数组
  }
  return input.map(item => item.toString());
}

console.log(processInput('hello')); // ['hello']
console.log(processInput(['a', 'b'])); // ['a', 'b']
```

---

## 2. 数组修改方法（改变原数组）

### 2.1 push()

在数组末尾添加一个或多个元素，返回新长度。

```javascript
const arr = [1, 2, 3];
const newLength = arr.push(4);
console.log(arr);       // [1, 2, 3, 4]
console.log(newLength); // 4

// 添加多个元素
arr.push(5, 6, 7);
console.log(arr); // [1, 2, 3, 4, 5, 6, 7]

// 场景1：收集数据
const results = [];
for (let i = 0; i < 5; i++) {
  results.push(i * 2);
}
console.log(results); // [0, 2, 4, 6, 8]

// 场景2：合并数组
const arr1 = [1, 2];
const arr2 = [3, 4];
arr1.push(...arr2);
console.log(arr1); // [1, 2, 3, 4]

// 场景3：队列操作（入队）
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
}
```

### 2.2 pop()

删除数组最后一个元素，返回该元素。

```javascript
const arr = [1, 2, 3, 4];
const last = arr.pop();
console.log(last); // 4
console.log(arr);  // [1, 2, 3]

// 空数组返回undefined
console.log([].pop()); // undefined

// 场景1：栈操作
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
}

// 场景2：处理路径
function getParentPath(path) {
  const parts = path.split('/');
  parts.pop(); // 移除最后一部分
  return parts.join('/');
}
console.log(getParentPath('/a/b/c')); // '/a/b'
```

### 2.3 unshift()

在数组开头添加一个或多个元素，返回新长度。

```javascript
const arr = [3, 4, 5];
const newLength = arr.unshift(1, 2);
console.log(arr);       // [1, 2, 3, 4, 5]
console.log(newLength); // 5

// 场景：添加历史记录（最新的在前面）
const history = [];
function addHistory(item) {
  history.unshift(item);
  if (history.length > 10) {
    history.pop(); // 保持最多10条
  }
}
```

### 2.4 shift()

删除数组第一个元素，返回该元素。

```javascript
const arr = [1, 2, 3, 4];
const first = arr.shift();
console.log(first); // 1
console.log(arr);   // [2, 3, 4]

// 场景：队列出队
function processQueue(queue) {
  while (queue.length > 0) {
    const task = queue.shift();
    console.log('处理:', task);
  }
}
processQueue(['任务1', '任务2', '任务3']);
```

### 2.5 splice()

删除、替换或添加元素，返回被删除的元素数组。

```javascript
const arr = [1, 2, 3, 4, 5];

// 删除元素
const removed = arr.splice(2, 1); // 从索引2删除1个
console.log(removed); // [3]
console.log(arr);     // [1, 2, 4, 5]

// 替换元素
arr.splice(1, 1, 'a', 'b'); // 从索引1删除1个，插入'a','b'
console.log(arr); // [1, 'a', 'b', 4, 5]

// 插入元素（不删除）
arr.splice(2, 0, 'x');
console.log(arr); // [1, 'a', 'x', 'b', 4, 5]

// 场景1：删除指定元素
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}
console.log(removeItem([1, 2, 3, 2], 2)); // [1, 3, 2]

// 场景2：在指定位置插入
function insertAt(arr, index, ...items) {
  arr.splice(index, 0, ...items);
  return arr;
}
console.log(insertAt([1, 4, 5], 1, 2, 3)); // [1, 2, 3, 4, 5]

// 场景3：替换范围
function replaceRange(arr, start, end, ...items) {
  arr.splice(start, end - start, ...items);
  return arr;
}

// 场景4：清空数组保持引用
const data = [1, 2, 3];
data.splice(0, data.length);
console.log(data); // []
```

### 2.6 fill() (ES6)

用固定值填充数组。

```javascript
// 填充整个数组
const arr1 = [1, 2, 3, 4];
arr1.fill(0);
console.log(arr1); // [0, 0, 0, 0]

// 指定范围填充
const arr2 = [1, 2, 3, 4, 5];
arr2.fill(0, 1, 3); // 从索引1到3(不含)
console.log(arr2); // [1, 0, 0, 4, 5]

// 场景1：初始化数组
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// 场景2：重置数组
function resetArray(arr, value = 0) {
  return arr.fill(value);
}

// 注意：填充对象是引用
const objArr = new Array(3).fill({});
objArr[0].a = 1;
console.log(objArr); // [{ a: 1 }, { a: 1 }, { a: 1 }] (都是同一对象)

// 正确方式
const objArr2 = Array.from({ length: 3 }, () => ({}));
objArr2[0].a = 1;
console.log(objArr2); // [{ a: 1 }, {}, {}]
```

### 2.7 copyWithin() (ES6)

在数组内部复制元素。

```javascript
const arr = [1, 2, 3, 4, 5];

// copyWithin(target, start, end)
arr.copyWithin(0, 3); // 从索引3开始复制到索引0
console.log(arr); // [4, 5, 3, 4, 5]

// 更多示例
const arr2 = [1, 2, 3, 4, 5];
arr2.copyWithin(1, 3, 4);
console.log(arr2); // [1, 4, 3, 4, 5]

// 场景：数组元素移位
const arr3 = [1, 2, 3, 4, 5];
arr3.copyWithin(0, 1);
console.log(arr3); // [2, 3, 4, 5, 5]
```

### 2.8 reverse()

反转数组。

```javascript
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]

// 场景1：反转字符串
function reverseString(str) {
  return str.split('').reverse().join('');
}
console.log(reverseString('hello')); // 'olleh'

// 场景2：不改变原数组的反转
const original = [1, 2, 3];
const reversed = [...original].reverse();
console.log(original); // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
```

### 2.9 sort()

对数组排序（原地排序）。

```javascript
// 默认按字符串Unicode排序
const arr = [10, 2, 1, 21];
arr.sort();
console.log(arr); // [1, 10, 2, 21] (字符串排序!)

// 数字排序
arr.sort((a, b) => a - b);
console.log(arr); // [1, 2, 10, 21]

// 降序
arr.sort((a, b) => b - a);
console.log(arr); // [21, 10, 2, 1]

// 场景1：对象数组排序
const users = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 20 }
];

// 按年龄排序
users.sort((a, b) => a.age - b.age);
console.log(users.map(u => u.name)); // ['王五', '张三', '李四']

// 按名字排序（中文）
users.sort((a, b) => a.name.localeCompare(b.name, 'zh'));

// 场景2：多字段排序
const products = [
  { category: 'A', price: 100 },
  { category: 'B', price: 50 },
  { category: 'A', price: 50 }
];

products.sort((a, b) => {
  // 先按类别，再按价格
  const categoryCompare = a.category.localeCompare(b.category);
  if (categoryCompare !== 0) return categoryCompare;
  return a.price - b.price;
});

// 场景3：随机排序（洗牌）
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 更好的洗牌算法
function fisherYatesShuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

---

## 3. 数组访问方法（不改变原数组）

### 3.1 concat()

合并两个或多个数组。

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];

const combined = arr1.concat(arr2, arr3);
console.log(combined); // [1, 2, 3, 4, 5, 6]
console.log(arr1);     // [1, 2] (原数组不变)

// 也可以添加单个值
const withValues = arr1.concat(3, 4);
console.log(withValues); // [1, 2, 3, 4]

// 场景：扁平化一层
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = [].concat(...nested);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// 使用展开运算符替代
const combined2 = [...arr1, ...arr2, ...arr3];
```

### 3.2 slice()

返回数组的一部分浅拷贝。

```javascript
const arr = [1, 2, 3, 4, 5];

console.log(arr.slice(1, 3));  // [2, 3] (索引1到3，不含3)
console.log(arr.slice(2));     // [3, 4, 5] (从索引2到末尾)
console.log(arr.slice(-2));    // [4, 5] (最后2个)
console.log(arr.slice(1, -1)); // [2, 3, 4]
console.log(arr.slice());      // [1, 2, 3, 4, 5] (浅拷贝)

// 场景1：分页
function paginate(arr, page, pageSize) {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(paginate(data, 1, 3)); // [1, 2, 3]
console.log(paginate(data, 2, 3)); // [4, 5, 6]

// 场景2：获取最后N个元素
function lastN(arr, n) {
  return arr.slice(-n);
}
console.log(lastN([1, 2, 3, 4, 5], 3)); // [3, 4, 5]

// 场景3：类数组转数组
function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}
```

### 3.3 join()

将数组元素连接成字符串。

```javascript
const arr = ['Hello', 'World'];

console.log(arr.join());    // 'Hello,World' (默认逗号)
console.log(arr.join(' ')); // 'Hello World'
console.log(arr.join('-')); // 'Hello-World'
console.log(arr.join(''));  // 'HelloWorld'

// 场景1：生成CSV
const data = [
  ['姓名', '年龄', '城市'],
  ['张三', 25, '北京'],
  ['李四', 30, '上海']
];
const csv = data.map(row => row.join(',')).join('\n');
console.log(csv);

// 场景2：路径拼接
const pathParts = ['users', 'profile', 'avatar'];
const path = '/' + pathParts.join('/');
console.log(path); // '/users/profile/avatar'

// 场景3：模板拼接
function buildUrl(base, params) {
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return `${base}?${query}`;
}
console.log(buildUrl('/search', { q: '关键词', page: 1 }));
```

### 3.4 indexOf() / lastIndexOf()

查找元素索引。

```javascript
const arr = [1, 2, 3, 2, 1];

console.log(arr.indexOf(2));      // 1 (第一个2的索引)
console.log(arr.indexOf(2, 2));   // 3 (从索引2开始找)
console.log(arr.indexOf(4));      // -1 (未找到)

console.log(arr.lastIndexOf(2));  // 3 (最后一个2的索引)
console.log(arr.lastIndexOf(2, 2)); // 1 (从索引2往前找)

// 场景1：检查元素存在
function contains(arr, item) {
  return arr.indexOf(item) !== -1;
}

// 场景2：查找所有出现位置
function findAllIndexes(arr, item) {
  const indexes = [];
  let index = arr.indexOf(item);
  while (index !== -1) {
    indexes.push(index);
    index = arr.indexOf(item, index + 1);
  }
  return indexes;
}
console.log(findAllIndexes([1, 2, 3, 2, 4, 2], 2)); // [1, 3, 5]

// 场景3：删除元素
function removeFirst(arr, item) {
  const index = arr.indexOf(item);
  if (index !== -1) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return arr;
}
```

### 3.5 includes() (ES7)

检查数组是否包含某元素。

```javascript
const arr = [1, 2, 3, NaN];

console.log(arr.includes(2));    // true
console.log(arr.includes(4));    // false
console.log(arr.includes(2, 2)); // false (从索引2开始)
console.log(arr.includes(NaN));  // true (可以检测NaN!)

// 与indexOf的区别
console.log(arr.indexOf(NaN) !== -1); // false (indexOf无法检测NaN)
console.log(arr.includes(NaN));       // true

// 场景：权限检查
const permissions = ['read', 'write'];
if (permissions.includes('write')) {
  console.log('有写入权限');
}
```

### 3.6 at() (ES2022)

通过索引获取元素，支持负数索引。

```javascript
const arr = [1, 2, 3, 4, 5];

console.log(arr.at(0));  // 1
console.log(arr.at(-1)); // 5 (最后一个)
console.log(arr.at(-2)); // 4 (倒数第二个)

// 之前获取最后一个
console.log(arr[arr.length - 1]); // 5

// 场景：安全访问
function getLast(arr) {
  return arr.at(-1);
}
console.log(getLast([1, 2, 3])); // 3
console.log(getLast([]));        // undefined
```

---

## 4. 数组迭代方法

### 4.1 forEach()

遍历数组的每个元素。

```javascript
const arr = [1, 2, 3];

arr.forEach((value, index, array) => {
  console.log(`索引${index}: ${value}`);
});

// 注意：无法中断forEach
// forEach没有返回值（返回undefined）

// 场景1：DOM操作
// document.querySelectorAll('.item').forEach(el => {
//   el.classList.add('active');
// });

// 场景2：副作用操作
const results = {};
[1, 2, 3].forEach(num => {
  results[num] = num * 2;
});
console.log(results); // { 1: 2, 2: 4, 3: 6 }

// 使用thisArg
const handler = {
  prefix: 'Item: ',
  process(items) {
    items.forEach(function(item) {
      console.log(this.prefix + item);
    }, this);
  }
};
handler.process(['a', 'b', 'c']);
```

### 4.2 map()

创建新数组，每个元素是回调函数的返回值。

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// 场景1：提取属性
const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
];
const names = users.map(user => user.name);
console.log(names); // ['张三', '李四']

// 场景2：数据转换
const raw = ['1', '2', '3'];
const numbers2 = raw.map(Number);
console.log(numbers2); // [1, 2, 3]

// 场景3：添加索引
const items = ['a', 'b', 'c'];
const indexed = items.map((item, index) => ({
  id: index,
  value: item
}));
console.log(indexed);

// 场景4：链式调用
const result = [1, 2, 3, 4, 5]
  .map(n => n * 2)
  .map(n => n + 1)
  .map(n => n.toString());
console.log(result); // ['3', '5', '7', '9', '11']

// 注意：map会保留空位
const sparse = [1, , 3];
console.log(sparse.map(x => x * 2)); // [2, empty, 6]
```

### 4.3 filter()

创建新数组，包含所有通过测试的元素。

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// 场景1：对象过滤
const users = [
  { name: '张三', active: true, age: 25 },
  { name: '李四', active: false, age: 30 },
  { name: '王五', active: true, age: 22 }
];

const activeUsers = users.filter(u => u.active);
console.log(activeUsers.map(u => u.name)); // ['张三', '王五']

// 场景2：多条件过滤
const filtered = users.filter(u => u.active && u.age >= 23);

// 场景3：去除空值
const arr = [0, 1, '', 'hello', null, undefined, false, true];
const truthy = arr.filter(Boolean);
console.log(truthy); // [1, 'hello', true]

// 场景4：去重
const unique = arr => arr.filter((item, index) => 
  arr.indexOf(item) === index
);
console.log(unique([1, 2, 2, 3, 3, 3])); // [1, 2, 3]

// 场景5：搜索
function search(items, query) {
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
}
```

### 4.4 reduce() / reduceRight()

将数组归约为单个值。

```javascript
// 基本用法
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// 没有初始值时，使用第一个元素作为初始值
const sum2 = numbers.reduce((acc, curr) => acc + curr);
console.log(sum2); // 15

// 场景1：计算总价
const cart = [
  { name: '商品1', price: 100, quantity: 2 },
  { name: '商品2', price: 50, quantity: 3 }
];
const total = cart.reduce((sum, item) => 
  sum + item.price * item.quantity, 0
);
console.log(total); // 350

// 场景2：分组
const people = [
  { name: '张三', city: '北京' },
  { name: '李四', city: '上海' },
  { name: '王五', city: '北京' }
];

const byCity = people.reduce((groups, person) => {
  const city = person.city;
  groups[city] = groups[city] || [];
  groups[city].push(person);
  return groups;
}, {});
console.log(byCity);

// 场景3：扁平化
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, curr) => acc.concat(curr), []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// 场景4：统计频率
const words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const frequency = words.reduce((count, word) => {
  count[word] = (count[word] || 0) + 1;
  return count;
}, {});
console.log(frequency); // { apple: 3, banana: 2, orange: 1 }

// 场景5：管道函数
const pipeline = [
  x => x + 1,
  x => x * 2,
  x => x - 3
];
const result = pipeline.reduce((val, fn) => fn(val), 5);
console.log(result); // ((5 + 1) * 2) - 3 = 9

// 场景6：对象转换
const arr = [['a', 1], ['b', 2], ['c', 3]];
const obj = arr.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});
console.log(obj); // { a: 1, b: 2, c: 3 }

// reduceRight：从右向左
const arr2 = [[1], [2], [3]];
const rightFlat = arr2.reduceRight((acc, curr) => acc.concat(curr), []);
console.log(rightFlat); // [3, 2, 1]
```

### 4.5 every()

检测所有元素是否都满足条件。

```javascript
const numbers = [2, 4, 6, 8, 10];
const allEven = numbers.every(n => n % 2 === 0);
console.log(allEven); // true

// 场景1：表单验证
const formFields = [
  { name: 'username', value: 'john', valid: true },
  { name: 'email', value: 'john@example.com', valid: true },
  { name: 'password', value: '', valid: false }
];
const isFormValid = formFields.every(field => field.valid);
console.log(isFormValid); // false

// 场景2：类型检查
function allNumbers(arr) {
  return arr.every(item => typeof item === 'number');
}
console.log(allNumbers([1, 2, 3])); // true
console.log(allNumbers([1, '2', 3])); // false

// 场景3：范围检查
function allInRange(arr, min, max) {
  return arr.every(n => n >= min && n <= max);
}
console.log(allInRange([5, 6, 7], 1, 10)); // true

// 空数组返回true
console.log([].every(x => x > 0)); // true (空数组恒为true)
```

### 4.6 some()

检测是否至少有一个元素满足条件。

```javascript
const numbers = [1, 3, 5, 7, 8, 9];
const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven); // true (8是偶数)

// 场景1：权限检查
const userRoles = ['user', 'editor'];
const adminRoles = ['admin', 'superuser'];
const isAdmin = userRoles.some(role => adminRoles.includes(role));
console.log(isAdmin); // false

// 场景2：敏感词检测
function hasSensitiveWord(text, sensitiveWords) {
  return sensitiveWords.some(word => text.includes(word));
}
console.log(hasSensitiveWord('这是测试', ['违禁', '敏感'])); // false

// 场景3：验证至少一个有效
const inputs = ['', '', 'valid'];
const hasValidInput = inputs.some(input => input.trim().length > 0);
console.log(hasValidInput); // true

// 空数组返回false
console.log([].some(x => x > 0)); // false
```

### 4.7 find() / findIndex() (ES6)

查找满足条件的第一个元素/索引。

```javascript
const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
];

// find返回元素
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: '李四' }

// findIndex返回索引
const index = users.findIndex(u => u.id === 2);
console.log(index); // 1

// 未找到时
console.log(users.find(u => u.id === 999));      // undefined
console.log(users.findIndex(u => u.id === 999)); // -1

// 场景：更新数组中的对象
function updateUser(users, id, updates) {
  const user = users.find(u => u.id === id);
  if (user) {
    Object.assign(user, updates);
  }
  return users;
}
```

### 4.8 findLast() / findLastIndex() (ES2023)

从后向前查找。

```javascript
const numbers = [1, 2, 3, 2, 1];

// 找最后一个大于1的
console.log(numbers.findLast(n => n > 1));      // 2 (索引3的那个)
console.log(numbers.findLastIndex(n => n > 1)); // 3

// 场景：找最后一个有效记录
const logs = [
  { time: 1, valid: true },
  { time: 2, valid: false },
  { time: 3, valid: true },
  { time: 4, valid: false }
];
const lastValid = logs.findLast(log => log.valid);
console.log(lastValid); // { time: 3, valid: true }
```

### 4.9 flat() / flatMap() (ES10)

数组扁平化。

```javascript
// flat
const nested = [1, [2, [3, [4]]]];
console.log(nested.flat());    // [1, 2, [3, [4]]]
console.log(nested.flat(2));   // [1, 2, 3, [4]]
console.log(nested.flat(Infinity)); // [1, 2, 3, 4]

// flatMap = map + flat(1)
const sentences = ['Hello World', 'How are you'];
const words = sentences.flatMap(s => s.split(' '));
console.log(words); // ['Hello', 'World', 'How', 'are', 'you']

// 场景：过滤并转换
const numbers = [1, 2, 3, 4, 5];
const evenDoubled = numbers.flatMap(n => 
  n % 2 === 0 ? [n * 2] : []
);
console.log(evenDoubled); // [4, 8]
```

### 4.10 entries() / keys() / values() (ES6)

返回迭代器。

```javascript
const arr = ['a', 'b', 'c'];

// entries返回[index, value]对
for (const [index, value] of arr.entries()) {
  console.log(index, value);
}
// 0 'a', 1 'b', 2 'c'

// keys返回索引
for (const index of arr.keys()) {
  console.log(index);
}
// 0, 1, 2

// values返回值
for (const value of arr.values()) {
  console.log(value);
}
// 'a', 'b', 'c'

// 转为数组
console.log([...arr.entries()]); // [[0, 'a'], [1, 'b'], [2, 'c']]
```

---

## 5. 数组搜索方法

### 5.1 综合搜索示例

```javascript
const products = [
  { id: 1, name: 'iPhone', category: 'phone', price: 7999 },
  { id: 2, name: 'MacBook', category: 'laptop', price: 14999 },
  { id: 3, name: 'iPad', category: 'tablet', price: 5999 },
  { id: 4, name: 'AirPods', category: 'accessory', price: 1999 }
];

// 按ID查找
const findById = (id) => products.find(p => p.id === id);
console.log(findById(2)); // MacBook

// 按类别过滤
const filterByCategory = (cat) => products.filter(p => p.category === cat);
console.log(filterByCategory('phone'));

// 搜索名称
const searchByName = (query) => products.filter(p => 
  p.name.toLowerCase().includes(query.toLowerCase())
);
console.log(searchByName('air'));

// 价格范围
const filterByPriceRange = (min, max) => products.filter(p => 
  p.price >= min && p.price <= max
);
console.log(filterByPriceRange(5000, 10000));

// 检查是否有某价格以下的商品
const hasAffordable = (maxPrice) => products.some(p => p.price <= maxPrice);
console.log(hasAffordable(2000)); // true (AirPods)

// 检查所有商品是否都有库存（假设都有）
const allInStock = products.every(p => true);
```

---

## 6. 数组排序方法

### 6.1 排序综合示例

```javascript
const items = [
  { name: '商品B', price: 200, sales: 100 },
  { name: '商品A', price: 100, sales: 200 },
  { name: '商品C', price: 100, sales: 150 }
];

// 按价格升序
const byPriceAsc = [...items].sort((a, b) => a.price - b.price);

// 按价格降序
const byPriceDesc = [...items].sort((a, b) => b.price - a.price);

// 按名称排序
const byName = [...items].sort((a, b) => a.name.localeCompare(b.name));

// 多字段排序（先价格，后销量）
const multiSort = [...items].sort((a, b) => {
  if (a.price !== b.price) return a.price - b.price;
  return b.sales - a.sales; // 同价格按销量降序
});

console.log(multiSort);
// [
//   { name: '商品A', price: 100, sales: 200 },
//   { name: '商品C', price: 100, sales: 150 },
//   { name: '商品B', price: 200, sales: 100 }
// ]

// 通用排序函数
function sortBy(arr, ...keys) {
  return [...arr].sort((a, b) => {
    for (const key of keys) {
      const direction = key.startsWith('-') ? -1 : 1;
      const prop = key.replace(/^-/, '');
      
      if (a[prop] < b[prop]) return -1 * direction;
      if (a[prop] > b[prop]) return 1 * direction;
    }
    return 0;
  });
}

console.log(sortBy(items, 'price', '-sales'));
```

---

## 7. 数组转换方法

### 7.1 toString() / toLocaleString()

```javascript
const arr = [1, 2, 3];
console.log(arr.toString()); // '1,2,3'

const dates = [new Date('2026-01-01'), new Date('2026-02-02')];
console.log(dates.toLocaleString('zh-CN'));
// '2026/1/1 00:00:00,2026/2/2 00:00:00'
```

### 7.2 toReversed() / toSorted() / toSpliced() (ES2023)

返回新数组的变体方法。

```javascript
const arr = [3, 1, 2];

// toReversed - 不改变原数组的reverse
const reversed = arr.toReversed();
console.log(reversed); // [2, 1, 3]
console.log(arr);      // [3, 1, 2] (原数组不变)

// toSorted - 不改变原数组的sort
const sorted = arr.toSorted();
console.log(sorted); // [1, 2, 3]
console.log(arr);    // [3, 1, 2] (原数组不变)

// toSpliced - 不改变原数组的splice
const spliced = arr.toSpliced(1, 1, 'a', 'b');
console.log(spliced); // [3, 'a', 'b', 2]
console.log(arr);     // [3, 1, 2] (原数组不变)

// with - 返回替换了指定索引元素的新数组
const replaced = arr.with(1, 'x');
console.log(replaced); // [3, 'x', 2]
console.log(arr);      // [3, 1, 2] (原数组不变)
```

---

## 8. 实用工具函数

### 8.1 数组操作工具

```javascript
// 数组去重
const unique = arr => [...new Set(arr)];

// 数组交集
const intersection = (a, b) => a.filter(x => b.includes(x));

// 数组差集
const difference = (a, b) => a.filter(x => !b.includes(x));

// 数组并集
const union = (a, b) => [...new Set([...a, ...b])];

// 分块
const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// 打乱
const shuffle = arr => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 分组
const groupBy = (arr, key) => arr.reduce((groups, item) => {
  const group = typeof key === 'function' ? key(item) : item[key];
  groups[group] = groups[group] || [];
  groups[group].push(item);
  return groups;
}, {});

// 计数
const countBy = (arr, key) => arr.reduce((counts, item) => {
  const group = typeof key === 'function' ? key(item) : item[key];
  counts[group] = (counts[group] || 0) + 1;
  return counts;
}, {});

// 取样
const sample = (arr, n = 1) => {
  const shuffled = shuffle(arr);
  return n === 1 ? shuffled[0] : shuffled.slice(0, n);
};

// 使用示例
console.log(unique([1, 2, 2, 3, 3]));           // [1, 2, 3]
console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
console.log(difference([1, 2, 3], [2, 3, 4]));   // [1]
console.log(union([1, 2], [2, 3]));              // [1, 2, 3]
console.log(chunk([1, 2, 3, 4, 5], 2));          // [[1, 2], [3, 4], [5]]
```

---

## 总结

JavaScript数组方法分类：

### 创建方法
- `Array()`, `Array.of()`, `Array.from()`, `Array.isArray()`

### 修改方法（改变原数组）
- 增删：`push()`, `pop()`, `unshift()`, `shift()`, `splice()`
- 填充：`fill()`, `copyWithin()`
- 排序：`sort()`, `reverse()`

### 访问方法（不改变原数组）
- 截取：`slice()`, `concat()`
- 连接：`join()`
- 查找：`indexOf()`, `lastIndexOf()`, `includes()`, `at()`

### 迭代方法
- 遍历：`forEach()`
- 转换：`map()`, `flatMap()`, `flat()`
- 过滤：`filter()`
- 归约：`reduce()`, `reduceRight()`
- 测试：`every()`, `some()`
- 查找：`find()`, `findIndex()`, `findLast()`, `findLastIndex()`
- 迭代器：`entries()`, `keys()`, `values()`

### ES2023新增（不改变原数组）
- `toReversed()`, `toSorted()`, `toSpliced()`, `with()`

掌握这些方法可以高效处理各种数组操作场景。
