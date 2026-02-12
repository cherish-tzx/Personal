# ES5 完整语法详解

> ECMAScript 5 (ES5) 是2009年发布的JavaScript标准，是现代JavaScript的基础。本文档详细介绍ES5的所有语法特性和方法。
<div class="doc-toc">
## 目录

1. [严格模式](#1-严格模式)
2. [JSON对象](#2-json对象)
3. [数组方法](#3-数组方法)
4. [对象方法](#4-对象方法)
5. [字符串方法](#5-字符串方法)
6. [Function.prototype.bind](#6-functionprototypebind)
7. [Date方法](#7-date方法)
8. [存取器属性](#8-存取器属性)
9. [保留字作为属性名](#9-保留字作为属性名)
10. [多行字符串](#10-多行字符串)


</div>

---

## 1. 严格模式

### 1.1 基本语法

严格模式是ES5引入的一种限制性更强的JavaScript变体，可以消除代码运行的一些不安全之处。

```javascript
// 全局严格模式
"use strict";

// 函数级别严格模式
function strictFunction() {
  "use strict";
  // 函数内的代码在严格模式下运行
}
```

### 1.2 严格模式的限制

#### 场景1：禁止意外创建全局变量

```javascript
"use strict";

// 错误：变量未声明
// mistypeVariable = 17;  // 抛出 ReferenceError

// 正确做法
var correctVariable = 17;
console.log(correctVariable); // 17
```

#### 场景2：禁止删除变量

```javascript
"use strict";

var x = 10;
// delete x; // 抛出 SyntaxError

// 可以删除对象的属性
var obj = { a: 1 };
delete obj.a; // 正确
console.log(obj.a); // undefined
```

#### 场景3：禁止参数重名

```javascript
"use strict";

// 错误：参数重名
// function sum(a, a, c) {  // SyntaxError
//   return a + a + c;
// }

// 正确做法
function sum(a, b, c) {
  return a + b + c;
}
console.log(sum(1, 2, 3)); // 6
```

#### 场景4：禁止八进制字面量

```javascript
"use strict";

// 错误：八进制字面量
// var octal = 010;  // SyntaxError

// 正确：使用十进制或0o前缀（ES6）
var decimal = 8;
console.log(decimal); // 8
```

#### 场景5：禁止对只读属性赋值

```javascript
"use strict";

var obj = {};
Object.defineProperty(obj, 'x', { value: 10, writable: false });

// obj.x = 20;  // TypeError: Cannot assign to read only property

console.log(obj.x); // 10
```

#### 场景6：禁止对不可扩展对象添加属性

```javascript
"use strict";

var fixedObj = { a: 1 };
Object.preventExtensions(fixedObj);

// fixedObj.b = 2;  // TypeError

console.log(fixedObj.a); // 1
```

#### 场景7：禁止使用with语句

```javascript
"use strict";

var obj = { a: 1, b: 2 };

// with (obj) {  // SyntaxError
//   console.log(a + b);
// }

// 正确做法
console.log(obj.a + obj.b); // 3
```

#### 场景8：eval的独立作用域

```javascript
"use strict";

eval("var x = 10;");
// console.log(x);  // ReferenceError: x is not defined

// eval中的变量不会泄漏到外部作用域
```

#### 场景9：this不再默认指向全局对象

```javascript
"use strict";

function showThis() {
  console.log(this);
}

showThis(); // undefined (非严格模式下是全局对象)

// 使用call/apply明确指定this
showThis.call({ name: 'test' }); // { name: 'test' }
```

---

## 2. JSON对象

ES5原生支持JSON对象，提供`JSON.parse()`和`JSON.stringify()`方法。

### 2.1 JSON.parse()

将JSON字符串解析为JavaScript对象。

#### 基本用法

```javascript
// 解析简单对象
var jsonStr = '{"name":"张三","age":25}';
var obj = JSON.parse(jsonStr);
console.log(obj.name); // "张三"
console.log(obj.age);  // 25

// 解析数组
var arrStr = '[1, 2, 3, 4, 5]';
var arr = JSON.parse(arrStr);
console.log(arr); // [1, 2, 3, 4, 5]
```

#### 场景1：解析嵌套JSON

```javascript
var complexJson = '{"user":{"name":"李四","address":{"city":"北京","street":"长安街"}},"scores":[90,85,92]}';

var data = JSON.parse(complexJson);
console.log(data.user.name);           // "李四"
console.log(data.user.address.city);   // "北京"
console.log(data.scores[0]);           // 90
```

#### 场景2：使用reviver函数转换值

```javascript
// reviver函数用于在返回之前转换解析出的值
var jsonStr = '{"name":"王五","birthYear":1990}';

var obj = JSON.parse(jsonStr, function(key, value) {
  if (key === 'birthYear') {
    return 2026 - value; // 计算年龄
  }
  return value;
});

console.log(obj); // { name: "王五", birthYear: 36 }
```

#### 场景3：解析日期字符串

```javascript
var jsonWithDate = '{"event":"会议","date":"2026-02-02T10:00:00.000Z"}';

var eventObj = JSON.parse(jsonWithDate, function(key, value) {
  // 检测ISO日期格式
  if (key === 'date') {
    return new Date(value);
  }
  return value;
});

console.log(eventObj.date instanceof Date); // true
console.log(eventObj.date.getFullYear());   // 2026
```

#### 场景4：错误处理

```javascript
function safeJsonParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('JSON解析失败:', e.message);
    return null;
  }
}

// 正确的JSON
var valid = safeJsonParse('{"name":"test"}');
console.log(valid); // { name: "test" }

// 错误的JSON
var invalid = safeJsonParse('{name:"test"}'); // 缺少引号
// 输出: JSON解析失败: ...
console.log(invalid); // null
```

### 2.2 JSON.stringify()

将JavaScript对象转换为JSON字符串。

#### 基本用法

```javascript
var obj = { name: "赵六", age: 30, city: "上海" };
var jsonStr = JSON.stringify(obj);
console.log(jsonStr); // '{"name":"赵六","age":30,"city":"上海"}'

var arr = [1, 2, 3, { a: 1 }];
console.log(JSON.stringify(arr)); // '[1,2,3,{"a":1}]'
```

#### 场景1：格式化输出

```javascript
var obj = {
  name: "公司",
  employees: [
    { name: "员工1", age: 25 },
    { name: "员工2", age: 30 }
  ],
  address: {
    city: "深圳",
    street: "科技路"
  }
};

// 使用2个空格缩进
var formatted = JSON.stringify(obj, null, 2);
console.log(formatted);
/*
{
  "name": "公司",
  "employees": [
    {
      "name": "员工1",
      "age": 25
    },
    {
      "name": "员工2",
      "age": 30
    }
  ],
  "address": {
    "city": "深圳",
    "street": "科技路"
  }
}
*/

// 使用制表符缩进
var tabFormatted = JSON.stringify(obj, null, '\t');
```

#### 场景2：使用replacer数组过滤属性

```javascript
var user = {
  id: 1,
  name: "用户",
  password: "secret123",
  email: "user@example.com"
};

// 只序列化指定的属性
var safeJson = JSON.stringify(user, ['id', 'name', 'email']);
console.log(safeJson); // '{"id":1,"name":"用户","email":"user@example.com"}'
```

#### 场景3：使用replacer函数转换值

```javascript
var data = {
  name: "产品",
  price: 99.99,
  discount: 0.1,
  stock: 100
};

var result = JSON.stringify(data, function(key, value) {
  // 隐藏库存信息
  if (key === 'stock') {
    return undefined; // 返回undefined会排除该属性
  }
  // 格式化价格
  if (key === 'price') {
    return '¥' + value.toFixed(2);
  }
  return value;
});

console.log(result); // '{"name":"产品","price":"¥99.99","discount":0.1}'
```

#### 场景4：处理循环引用

```javascript
// 循环引用会导致错误
var obj = { name: "test" };
obj.self = obj;

// JSON.stringify(obj); // TypeError: Converting circular structure to JSON

// 解决方案：使用replacer处理循环引用
function safeStringify(obj) {
  var cache = [];
  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return '[Circular]';
      }
      cache.push(value);
    }
    return value;
  });
}

console.log(safeStringify(obj)); // '{"name":"test","self":"[Circular]"}'
```

#### 场景5：toJSON方法自定义序列化

```javascript
var meeting = {
  title: "项目会议",
  date: new Date('2026-02-02'),
  participants: ["张三", "李四"],
  
  // 自定义JSON序列化
  toJSON: function() {
    return {
      title: this.title,
      date: this.date.toISOString().split('T')[0],
      participantCount: this.participants.length
    };
  }
};

console.log(JSON.stringify(meeting));
// '{"title":"项目会议","date":"2026-02-02","participantCount":2}'
```

---

## 3. 数组方法

ES5为数组添加了多个重要方法。

### 3.1 Array.isArray()

判断一个值是否为数组。

```javascript
// 基本用法
console.log(Array.isArray([1, 2, 3]));    // true
console.log(Array.isArray('array'));       // false
console.log(Array.isArray({ length: 3 })); // false
console.log(Array.isArray(new Array()));   // true

// 场景：类型检查
function processArray(input) {
  if (!Array.isArray(input)) {
    throw new TypeError('参数必须是数组');
  }
  return input.map(function(item) { return item * 2; });
}

console.log(processArray([1, 2, 3])); // [2, 4, 6]
```

### 3.2 forEach()

遍历数组的每个元素并执行回调函数。

```javascript
// 基本用法
var arr = ['苹果', '香蕉', '橙子'];
arr.forEach(function(item, index, array) {
  console.log(index + ': ' + item);
});
// 0: 苹果
// 1: 香蕉
// 2: 橙子

// 场景1：累加计算
var numbers = [1, 2, 3, 4, 5];
var sum = 0;
numbers.forEach(function(num) {
  sum += num;
});
console.log(sum); // 15

// 场景2：修改外部对象
var users = [
  { name: '张三', score: 80 },
  { name: '李四', score: 90 }
];
var scoreMap = {};
users.forEach(function(user) {
  scoreMap[user.name] = user.score;
});
console.log(scoreMap); // { '张三': 80, '李四': 90 }

// 场景3：使用thisArg
var calculator = {
  multiplier: 2,
  calculate: function(arr) {
    var results = [];
    arr.forEach(function(num) {
      results.push(num * this.multiplier);
    }, this); // 第二个参数指定this
    return results;
  }
};
console.log(calculator.calculate([1, 2, 3])); // [2, 4, 6]
```

### 3.3 map()

创建一个新数组，其元素是原数组元素经过函数处理后的值。

```javascript
// 基本用法
var numbers = [1, 2, 3, 4, 5];
var doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]

// 场景1：提取对象属性
var users = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 28 }
];
var names = users.map(function(user) {
  return user.name;
});
console.log(names); // ['张三', '李四', '王五']

// 场景2：转换数据格式
var products = [
  { name: '手机', price: 5000 },
  { name: '电脑', price: 8000 },
  { name: '平板', price: 3000 }
];
var formattedProducts = products.map(function(product) {
  return {
    productName: product.name,
    displayPrice: '¥' + product.price.toFixed(2),
    originalPrice: product.price
  };
});
console.log(formattedProducts);

// 场景3：字符串处理
var words = ['hello', 'world', 'javascript'];
var capitalized = words.map(function(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
});
console.log(capitalized); // ['Hello', 'World', 'Javascript']

// 场景4：使用索引
var arr = ['a', 'b', 'c'];
var indexed = arr.map(function(item, index) {
  return index + '-' + item;
});
console.log(indexed); // ['0-a', '1-b', '2-c']
```

### 3.4 filter()

创建一个新数组，包含所有通过测试的元素。

```javascript
// 基本用法
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log(evens); // [2, 4, 6, 8, 10]

// 场景1：过滤对象数组
var employees = [
  { name: '张三', department: '技术', salary: 15000 },
  { name: '李四', department: '销售', salary: 12000 },
  { name: '王五', department: '技术', salary: 18000 },
  { name: '赵六', department: '人事', salary: 10000 }
];

// 筛选技术部门员工
var techEmployees = employees.filter(function(emp) {
  return emp.department === '技术';
});
console.log(techEmployees);

// 场景2：多条件过滤
var highPaidTech = employees.filter(function(emp) {
  return emp.department === '技术' && emp.salary > 16000;
});
console.log(highPaidTech); // [{ name: '王五', ... }]

// 场景3：去除空值
var mixedArray = [0, 1, '', 'hello', null, undefined, false, true];
var truthyValues = mixedArray.filter(function(item) {
  return Boolean(item);
});
console.log(truthyValues); // [1, 'hello', true]

// 场景4：数组去重
var duplicates = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
var unique = duplicates.filter(function(item, index, self) {
  return self.indexOf(item) === index;
});
console.log(unique); // [1, 2, 3, 4]

// 场景5：搜索过滤
var products = [
  { name: 'iPhone 15', price: 7999 },
  { name: 'iPad Pro', price: 8999 },
  { name: 'MacBook Pro', price: 14999 },
  { name: 'Apple Watch', price: 2999 }
];

function searchProducts(keyword) {
  return products.filter(function(product) {
    return product.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  });
}

console.log(searchProducts('pro')); // iPad Pro 和 MacBook Pro
```

### 3.5 reduce()

对数组元素执行reducer函数，将其减少为单个值。

```javascript
// 基本用法：求和
var numbers = [1, 2, 3, 4, 5];
var sum = numbers.reduce(function(accumulator, current) {
  return accumulator + current;
}, 0);
console.log(sum); // 15

// 场景1：求最大值
var values = [23, 45, 12, 67, 34, 89, 56];
var max = values.reduce(function(max, current) {
  return current > max ? current : max;
}, values[0]);
console.log(max); // 89

// 场景2：数组扁平化
var nested = [[1, 2], [3, 4], [5, 6]];
var flattened = nested.reduce(function(flat, current) {
  return flat.concat(current);
}, []);
console.log(flattened); // [1, 2, 3, 4, 5, 6]

// 场景3：统计出现次数
var fruits = ['苹果', '香蕉', '苹果', '橙子', '香蕉', '苹果'];
var count = fruits.reduce(function(acc, fruit) {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { '苹果': 3, '香蕉': 2, '橙子': 1 }

// 场景4：按属性分组
var students = [
  { name: '张三', grade: 'A' },
  { name: '李四', grade: 'B' },
  { name: '王五', grade: 'A' },
  { name: '赵六', grade: 'C' },
  { name: '钱七', grade: 'B' }
];

var groupedByGrade = students.reduce(function(groups, student) {
  var grade = student.grade;
  if (!groups[grade]) {
    groups[grade] = [];
  }
  groups[grade].push(student);
  return groups;
}, {});
console.log(groupedByGrade);

// 场景5：管道函数组合
var pipeline = [
  function(x) { return x + 1; },
  function(x) { return x * 2; },
  function(x) { return x - 3; }
];

var result = pipeline.reduce(function(value, fn) {
  return fn(value);
}, 5);
console.log(result); // ((5 + 1) * 2) - 3 = 9

// 场景6：计算购物车总价
var cart = [
  { name: '商品A', price: 100, quantity: 2 },
  { name: '商品B', price: 50, quantity: 3 },
  { name: '商品C', price: 200, quantity: 1 }
];

var totalPrice = cart.reduce(function(total, item) {
  return total + (item.price * item.quantity);
}, 0);
console.log(totalPrice); // 550
```

### 3.6 reduceRight()

从右向左执行reduce操作。

```javascript
// 基本用法
var arr = [[0, 1], [2, 3], [4, 5]];
var flattened = arr.reduceRight(function(acc, curr) {
  return acc.concat(curr);
}, []);
console.log(flattened); // [4, 5, 2, 3, 0, 1]

// 场景：从右向左字符串拼接
var parts = ['!', 'World', ' ', 'Hello'];
var result = parts.reduceRight(function(acc, curr) {
  return acc + curr;
}, '');
console.log(result); // "Hello World!"

// 场景：函数组合（从右向左）
function compose() {
  var fns = Array.prototype.slice.call(arguments);
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

var addOne = function(x) { return x + 1; };
var double = function(x) { return x * 2; };
var square = function(x) { return x * x; };

var composed = compose(addOne, double, square);
console.log(composed(3)); // square(3) = 9, double(9) = 18, addOne(18) = 19
```

### 3.7 every()

测试数组的所有元素是否都通过测试。

```javascript
// 基本用法
var numbers = [2, 4, 6, 8, 10];
var allEven = numbers.every(function(num) {
  return num % 2 === 0;
});
console.log(allEven); // true

// 场景1：验证表单数据
var formData = {
  username: 'user123',
  email: 'user@example.com',
  password: 'password123'
};

var fields = ['username', 'email', 'password'];
var allFilled = fields.every(function(field) {
  return formData[field] && formData[field].length > 0;
});
console.log(allFilled); // true

// 场景2：检查对象数组
var products = [
  { name: '商品A', inStock: true },
  { name: '商品B', inStock: true },
  { name: '商品C', inStock: false }
];

var allInStock = products.every(function(product) {
  return product.inStock;
});
console.log(allInStock); // false

// 场景3：验证数值范围
var scores = [78, 85, 92, 88, 76];
var allPassed = scores.every(function(score) {
  return score >= 60;
});
console.log(allPassed); // true

// 场景4：类型检查
var arr = [1, 2, 3, 4, 5];
var allNumbers = arr.every(function(item) {
  return typeof item === 'number';
});
console.log(allNumbers); // true
```

### 3.8 some()

测试数组中是否至少有一个元素通过测试。

```javascript
// 基本用法
var numbers = [1, 3, 5, 7, 8, 9];
var hasEven = numbers.some(function(num) {
  return num % 2 === 0;
});
console.log(hasEven); // true

// 场景1：检查用户权限
var userPermissions = ['read', 'write'];
var requiredPermissions = ['admin', 'superuser', 'write'];

var hasAccess = requiredPermissions.some(function(perm) {
  return userPermissions.indexOf(perm) !== -1;
});
console.log(hasAccess); // true

// 场景2：检查是否包含敏感词
var sensitiveWords = ['暴力', '色情', '赌博'];
var userInput = '这是一段正常的文字';

var hasSensitive = sensitiveWords.some(function(word) {
  return userInput.indexOf(word) !== -1;
});
console.log(hasSensitive); // false

// 场景3：检查是否有错误
var validationResults = [
  { field: 'username', valid: true },
  { field: 'email', valid: false, error: '邮箱格式错误' },
  { field: 'password', valid: true }
];

var hasError = validationResults.some(function(result) {
  return !result.valid;
});
console.log(hasError); // true

// 场景4：短路求值优化
var largeArray = new Array(1000000).fill(false);
largeArray[0] = true; // 第一个就是true

console.time('some');
var found = largeArray.some(function(item) { return item; });
console.timeEnd('some'); // 非常快，找到第一个就停止
```

### 3.9 indexOf()

返回指定元素在数组中首次出现的索引。

```javascript
// 基本用法
var arr = ['苹果', '香蕉', '橙子', '香蕉'];
console.log(arr.indexOf('香蕉'));    // 1
console.log(arr.indexOf('葡萄'));    // -1
console.log(arr.indexOf('香蕉', 2)); // 3 (从索引2开始查找)

// 场景1：检查元素是否存在
var allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
var fileType = 'image/jpeg';

if (allowedTypes.indexOf(fileType) !== -1) {
  console.log('文件类型允许上传');
}

// 场景2：去除重复元素
var arr = [1, 2, 3, 2, 1, 4, 5, 4];
var unique = [];
for (var i = 0; i < arr.length; i++) {
  if (unique.indexOf(arr[i]) === -1) {
    unique.push(arr[i]);
  }
}
console.log(unique); // [1, 2, 3, 4, 5]

// 场景3：删除指定元素
var fruits = ['苹果', '香蕉', '橙子'];
var index = fruits.indexOf('香蕉');
if (index !== -1) {
  fruits.splice(index, 1);
}
console.log(fruits); // ['苹果', '橙子']
```

### 3.10 lastIndexOf()

返回指定元素在数组中最后一次出现的索引。

```javascript
// 基本用法
var arr = [2, 5, 9, 2, 5, 9];
console.log(arr.lastIndexOf(2));    // 3
console.log(arr.lastIndexOf(9));    // 5
console.log(arr.lastIndexOf(2, 2)); // 0 (从索引2往前查找)
console.log(arr.lastIndexOf(7));    // -1

// 场景1：获取最后一个匹配位置
var logs = ['info', 'error', 'warn', 'error', 'info'];
var lastErrorIndex = logs.lastIndexOf('error');
console.log('最后一个错误位置:', lastErrorIndex); // 3

// 场景2：检查后缀
var path = 'folder/subfolder/file.name.txt';
var pathParts = path.split('');
var lastDotIndex = pathParts.lastIndexOf('.');
if (lastDotIndex !== -1) {
  var extension = path.substring(lastDotIndex + 1);
  console.log('文件扩展名:', extension); // txt
}
```

---

## 4. 对象方法

ES5为对象添加了多个重要的静态方法。

### 4.1 Object.keys()

返回对象自身可枚举属性的键名数组。

```javascript
// 基本用法
var obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']

// 场景1：遍历对象
var user = {
  name: '张三',
  age: 25,
  city: '北京'
};

Object.keys(user).forEach(function(key) {
  console.log(key + ': ' + user[key]);
});

// 场景2：获取对象属性数量
var config = { debug: true, version: '1.0', env: 'production' };
console.log('配置项数量:', Object.keys(config).length); // 3

// 场景3：对象转数组
var scores = { math: 90, english: 85, chinese: 92 };
var scoreArray = Object.keys(scores).map(function(subject) {
  return { subject: subject, score: scores[subject] };
});
console.log(scoreArray);

// 场景4：检查对象是否为空
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
console.log(isEmpty({}));        // true
console.log(isEmpty({ a: 1 }));  // false

// 场景5：对象过滤
var data = { a: 1, b: null, c: 3, d: undefined, e: 5 };
var filtered = {};
Object.keys(data).forEach(function(key) {
  if (data[key] != null) {
    filtered[key] = data[key];
  }
});
console.log(filtered); // { a: 1, c: 3, e: 5 }
```

### 4.2 Object.create()

创建一个新对象，使用现有对象作为新对象的原型。

```javascript
// 基本用法
var animal = {
  type: '动物',
  speak: function() {
    console.log(this.name + ' 发出声音');
  }
};

var dog = Object.create(animal);
dog.name = '小狗';
dog.type = '犬类';
dog.speak(); // "小狗 发出声音"

// 场景1：创建没有原型的纯净对象
var pureObj = Object.create(null);
pureObj.key = 'value';
console.log(pureObj.toString); // undefined (没有继承Object.prototype)

// 场景2：实现继承
var Person = {
  init: function(name, age) {
    this.name = name;
    this.age = age;
    return this;
  },
  introduce: function() {
    return '我是' + this.name + '，今年' + this.age + '岁';
  }
};

var Student = Object.create(Person);
Student.init = function(name, age, grade) {
  Person.init.call(this, name, age);
  this.grade = grade;
  return this;
};
Student.study = function() {
  return this.name + ' 正在学习';
};

var student = Object.create(Student).init('李四', 20, '大三');
console.log(student.introduce()); // "我是李四，今年20岁"
console.log(student.study());     // "李四 正在学习"

// 场景3：使用属性描述符
var obj = Object.create({}, {
  name: {
    value: '测试',
    writable: true,
    enumerable: true,
    configurable: true
  },
  id: {
    value: 123,
    writable: false,
    enumerable: true
  }
});
console.log(obj.name); // '测试'
console.log(obj.id);   // 123
```

### 4.3 Object.defineProperty()

定义或修改对象的属性。

```javascript
// 基本用法
var obj = {};
Object.defineProperty(obj, 'name', {
  value: '张三',
  writable: true,
  enumerable: true,
  configurable: true
});
console.log(obj.name); // '张三'

// 场景1：创建只读属性
var config = {};
Object.defineProperty(config, 'API_URL', {
  value: 'https://api.example.com',
  writable: false,
  enumerable: true,
  configurable: false
});
console.log(config.API_URL); // 'https://api.example.com'
// config.API_URL = 'other'; // 严格模式下报错

// 场景2：数据劫持（Vue2响应式原理）
function observe(obj) {
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        console.log('读取 ' + key + ': ' + value);
        return value;
      },
      set: function(newValue) {
        console.log('设置 ' + key + ': ' + value + ' -> ' + newValue);
        value = newValue;
      }
    });
  });
  return obj;
}

var data = observe({ count: 0 });
data.count;     // 读取 count: 0
data.count = 1; // 设置 count: 0 -> 1

// 场景3：计算属性
var circle = { radius: 5 };
Object.defineProperty(circle, 'area', {
  get: function() {
    return Math.PI * this.radius * this.radius;
  },
  enumerable: true
});
console.log(circle.area); // 78.54...

// 场景4：私有属性模拟
var Person = (function() {
  var privateAge = 0;
  
  function Person(name, age) {
    this.name = name;
    privateAge = age;
    
    Object.defineProperty(this, 'age', {
      get: function() {
        return privateAge;
      },
      set: function(value) {
        if (value > 0 && value < 150) {
          privateAge = value;
        }
      },
      enumerable: true
    });
  }
  
  return Person;
})();

var person = new Person('张三', 25);
console.log(person.age); // 25
person.age = -5;         // 无效
console.log(person.age); // 25
```

### 4.4 Object.defineProperties()

同时定义多个属性。

```javascript
var obj = {};
Object.defineProperties(obj, {
  name: {
    value: '张三',
    writable: true,
    enumerable: true
  },
  age: {
    value: 25,
    writable: true,
    enumerable: true
  },
  fullInfo: {
    get: function() {
      return this.name + ', ' + this.age + '岁';
    },
    enumerable: true
  }
});

console.log(obj.name);     // '张三'
console.log(obj.age);      // 25
console.log(obj.fullInfo); // '张三, 25岁'
```

### 4.5 Object.getOwnPropertyDescriptor()

获取属性的描述符。

```javascript
var obj = { name: '张三' };

var descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor);
// {
//   value: '张三',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// 场景：检查属性特性
function isPropertyWritable(obj, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  return descriptor ? descriptor.writable : false;
}

var config = {};
Object.defineProperty(config, 'version', {
  value: '1.0.0',
  writable: false
});

console.log(isPropertyWritable(config, 'version')); // false
```

### 4.6 Object.getOwnPropertyNames()

返回对象所有自身属性的名称（包括不可枚举属性）。

```javascript
var obj = {};
Object.defineProperties(obj, {
  visible: {
    value: 1,
    enumerable: true
  },
  hidden: {
    value: 2,
    enumerable: false
  }
});

console.log(Object.keys(obj));                // ['visible']
console.log(Object.getOwnPropertyNames(obj)); // ['visible', 'hidden']

// 场景：获取数组的所有属性
var arr = ['a', 'b', 'c'];
console.log(Object.getOwnPropertyNames(arr)); // ['0', '1', '2', 'length']
```

### 4.7 Object.getPrototypeOf()

获取对象的原型。

```javascript
var arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

// 场景：检查继承关系
function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);

var dog = new Dog();
console.log(Object.getPrototypeOf(dog) === Dog.prototype);               // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);  // true
```

### 4.8 Object.preventExtensions() / Object.isExtensible()

阻止对象扩展/检查对象是否可扩展。

```javascript
var obj = { a: 1 };
console.log(Object.isExtensible(obj)); // true

Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false

obj.b = 2; // 严格模式下报错，非严格模式静默失败
console.log(obj.b); // undefined

// 已有属性仍可修改
obj.a = 10;
console.log(obj.a); // 10
```

### 4.9 Object.seal() / Object.isSealed()

密封对象（不能添加/删除属性，但可修改现有属性值）。

```javascript
var obj = { name: '张三', age: 25 };

Object.seal(obj);
console.log(Object.isSealed(obj)); // true

// 不能添加新属性
obj.city = '北京';
console.log(obj.city); // undefined

// 不能删除属性
delete obj.name;
console.log(obj.name); // '张三'

// 可以修改现有属性
obj.age = 30;
console.log(obj.age); // 30
```

### 4.10 Object.freeze() / Object.isFrozen()

冻结对象（完全不可变）。

```javascript
var obj = { name: '张三', age: 25 };

Object.freeze(obj);
console.log(Object.isFrozen(obj)); // true

// 不能添加
obj.city = '北京';
console.log(obj.city); // undefined

// 不能删除
delete obj.name;
console.log(obj.name); // '张三'

// 不能修改
obj.age = 30;
console.log(obj.age); // 25

// 场景：冻结配置对象
var CONFIG = Object.freeze({
  API_BASE: 'https://api.example.com',
  TIMEOUT: 5000,
  MAX_RETRIES: 3
});

// 深度冻结
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.keys(obj).forEach(function(key) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return obj;
}

var nested = deepFreeze({
  level1: {
    level2: {
      value: 'test'
    }
  }
});
```

---

## 5. 字符串方法

### 5.1 trim()

移除字符串两端的空白字符。

```javascript
// 基本用法
var str = '   Hello World   ';
console.log(str.trim()); // 'Hello World'

// 场景1：表单输入处理
function processFormInput(input) {
  return input.trim();
}
console.log(processFormInput('  user@example.com  ')); // 'user@example.com'

// 场景2：清理多种空白字符
var messyStr = '\t\n  内容  \r\n';
console.log(messyStr.trim()); // '内容'

// 场景3：验证非空输入
function isNotEmpty(str) {
  return str.trim().length > 0;
}
console.log(isNotEmpty('   '));   // false
console.log(isNotEmpty(' abc ')); // true

// 场景4：处理数组中的字符串
var tags = ['  javascript  ', ' html ', '  css  '];
var cleanTags = tags.map(function(tag) {
  return tag.trim();
});
console.log(cleanTags); // ['javascript', 'html', 'css']
```

### 5.2 charAt() 和索引访问

```javascript
var str = 'Hello';

// ES5允许使用索引访问字符
console.log(str[0]);       // 'H'
console.log(str.charAt(0)); // 'H'

// 区别：越界时的行为
console.log(str[10]);        // undefined
console.log(str.charAt(10)); // '' (空字符串)
```

---

## 6. Function.prototype.bind()

创建一个新函数，其this值被绑定到指定值。

```javascript
// 基本用法
var obj = {
  name: '张三',
  greet: function() {
    console.log('你好，我是' + this.name);
  }
};

var greetFn = obj.greet;
greetFn(); // this指向全局对象或undefined

var boundGreet = obj.greet.bind(obj);
boundGreet(); // '你好，我是张三'

// 场景1：事件处理器中保持this
var button = {
  content: '按钮',
  click: function() {
    console.log('点击了 ' + this.content);
  }
};
// 模拟绑定到事件
var handler = button.click.bind(button);
handler(); // '点击了 按钮'

// 场景2：偏函数应用
function multiply(a, b) {
  return a * b;
}

var double = multiply.bind(null, 2);
console.log(double(5));  // 10
console.log(double(10)); // 20

var triple = multiply.bind(null, 3);
console.log(triple(5));  // 15

// 场景3：设置默认参数
function log(level, message) {
  console.log('[' + level + '] ' + message);
}

var logInfo = log.bind(null, 'INFO');
var logError = log.bind(null, 'ERROR');

logInfo('应用启动');  // [INFO] 应用启动
logError('连接失败'); // [ERROR] 连接失败

// 场景4：setTimeout中的this
var counter = {
  count: 0,
  increment: function() {
    this.count++;
    console.log('当前计数:', this.count);
  },
  start: function() {
    // 使用bind确保this正确
    setTimeout(this.increment.bind(this), 1000);
  }
};
counter.start();

// 场景5：借用方法
var arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

var slice = Array.prototype.slice;
var toArray = slice.bind(arrayLike);
console.log(toArray()); // ['a', 'b', 'c']

// 更常见的用法
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);
console.log(slice(arrayLike)); // ['a', 'b', 'c']
```

---

## 7. Date方法

### 7.1 Date.now()

返回当前时间的时间戳。

```javascript
// 基本用法
var timestamp = Date.now();
console.log(timestamp); // 1706860800000 (示例)

// 场景1：性能测量
var start = Date.now();
// 执行一些操作
for (var i = 0; i < 1000000; i++) {}
var end = Date.now();
console.log('执行时间:', end - start, 'ms');

// 场景2：生成唯一ID
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
console.log(generateId()); // 'id_1706860800000_abc123xyz'

// 场景3：缓存过期检查
var cache = {
  data: null,
  timestamp: 0,
  maxAge: 60000, // 1分钟
  
  set: function(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  
  get: function() {
    if (Date.now() - this.timestamp > this.maxAge) {
      return null; // 已过期
    }
    return this.data;
  }
};
```

### 7.2 Date.prototype.toISOString()

返回ISO 8601格式的日期字符串。

```javascript
var date = new Date();
console.log(date.toISOString()); // '2026-02-02T10:00:00.000Z'

// 场景：API请求中的日期格式化
var requestData = {
  startDate: new Date('2026-01-01').toISOString(),
  endDate: new Date('2026-12-31').toISOString()
};
console.log(JSON.stringify(requestData));
```

### 7.3 Date.prototype.toJSON()

返回JSON格式的日期字符串（与toISOString相同）。

```javascript
var event = {
  name: '会议',
  date: new Date('2026-02-02')
};
console.log(JSON.stringify(event));
// '{"name":"会议","date":"2026-02-02T00:00:00.000Z"}'
```

---

## 8. 存取器属性 (Getter/Setter)

ES5支持在对象字面量中定义getter和setter。

```javascript
// 基本用法
var person = {
  firstName: '三',
  lastName: '张',
  
  get fullName() {
    return this.lastName + this.firstName;
  },
  
  set fullName(value) {
    var parts = value.split('');
    this.lastName = parts[0];
    this.firstName = parts.slice(1).join('');
  }
};

console.log(person.fullName); // '张三'
person.fullName = '李四';
console.log(person.lastName);  // '李'
console.log(person.firstName); // '四'

// 场景1：数据验证
var product = {
  _price: 0,
  
  get price() {
    return '¥' + this._price.toFixed(2);
  },
  
  set price(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('价格必须是非负数');
    }
    this._price = value;
  }
};

product.price = 99.9;
console.log(product.price); // '¥99.90'

// 场景2：计算属性
var rectangle = {
  width: 10,
  height: 5,
  
  get area() {
    return this.width * this.height;
  },
  
  get perimeter() {
    return 2 * (this.width + this.height);
  }
};

console.log(rectangle.area);      // 50
console.log(rectangle.perimeter); // 30

// 场景3：属性访问日志
var debugObj = {
  _value: null,
  
  get value() {
    console.log('读取value:', this._value);
    return this._value;
  },
  
  set value(newValue) {
    console.log('设置value:', this._value, '->', newValue);
    this._value = newValue;
  }
};

debugObj.value = 'test'; // 设置value: null -> test
var v = debugObj.value;  // 读取value: test

// 场景4：延迟计算（懒加载）
var heavyObject = {
  _expensiveData: null,
  
  get expensiveData() {
    if (this._expensiveData === null) {
      console.log('首次访问，执行耗时计算...');
      // 模拟耗时操作
      this._expensiveData = { result: 'computed data' };
    }
    return this._expensiveData;
  }
};

console.log(heavyObject.expensiveData); // 首次访问，执行耗时计算...
console.log(heavyObject.expensiveData); // 直接返回缓存结果
```

---

## 9. 保留字作为属性名

ES5允许使用保留字作为对象属性名。

```javascript
var obj = {
  class: 'MyClass',
  for: 'loop',
  if: 'condition',
  return: 'value',
  default: 'defaultValue'
};

console.log(obj.class);   // 'MyClass'
console.log(obj.for);     // 'loop'
console.log(obj.if);      // 'condition'
console.log(obj.return);  // 'value'
console.log(obj.default); // 'defaultValue'

// 场景：CSS类名处理
var styles = {
  class: 'container',
  float: 'left'
};
```

---

## 10. 多行字符串

ES5允许在字符串中使用反斜杠换行。

```javascript
// 使用反斜杠
var multiLine = "这是第一行\
这是第二行\
这是第三行";
console.log(multiLine); // '这是第一行这是第二行这是第三行'

// 注意：反斜杠后不能有空格

// 场景：长字符串
var sql = "SELECT * FROM users \
WHERE status = 'active' \
AND age > 18 \
ORDER BY created_at DESC";
```

---

## 11. 尾随逗号

ES5允许在对象和数组字面量中使用尾随逗号。

```javascript
// 数组尾随逗号
var arr = [
  1,
  2,
  3,  // 尾随逗号
];
console.log(arr.length); // 3

// 对象尾随逗号
var obj = {
  name: '张三',
  age: 25,  // 尾随逗号
};
console.log(obj);

// 好处：版本控制中修改更清晰
```

---

## 12. ES5 综合实例

### 实例1：简单的数据响应系统

```javascript
function createReactiveObject(data, callback) {
  var result = {};
  
  Object.keys(data).forEach(function(key) {
    var value = data[key];
    
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },
      set: function(newValue) {
        var oldValue = value;
        value = newValue;
        callback(key, oldValue, newValue);
      }
    });
  });
  
  return result;
}

var state = createReactiveObject(
  { count: 0, name: '计数器' },
  function(key, oldVal, newVal) {
    console.log(key + ' 从 ' + oldVal + ' 变为 ' + newVal);
  }
);

state.count = 1; // count 从 0 变为 1
state.count = 2; // count 从 1 变为 2
```

### 实例2：简单的状态管理

```javascript
var Store = (function() {
  var state = {};
  var listeners = [];
  
  return {
    getState: function() {
      return JSON.parse(JSON.stringify(state)); // 返回副本
    },
    
    setState: function(newState) {
      Object.keys(newState).forEach(function(key) {
        state[key] = newState[key];
      });
      this.notify();
    },
    
    subscribe: function(listener) {
      listeners.push(listener);
      return function() {
        var index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      };
    },
    
    notify: function() {
      var currentState = this.getState();
      listeners.forEach(function(listener) {
        listener(currentState);
      });
    }
  };
})();

// 使用
var unsubscribe = Store.subscribe(function(state) {
  console.log('状态更新:', state);
});

Store.setState({ count: 1 });
Store.setState({ name: '测试' });

unsubscribe(); // 取消订阅
```

### 实例3：简单的事件系统

```javascript
function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.on = function(event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
  return this;
};

EventEmitter.prototype.off = function(event, callback) {
  if (!this.events[event]) return this;
  
  if (!callback) {
    delete this.events[event];
  } else {
    var index = this.events[event].indexOf(callback);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }
  return this;
};

EventEmitter.prototype.emit = function(event) {
  if (!this.events[event]) return this;
  
  var args = Array.prototype.slice.call(arguments, 1);
  var self = this;
  
  this.events[event].forEach(function(callback) {
    callback.apply(self, args);
  });
  return this;
};

EventEmitter.prototype.once = function(event, callback) {
  var self = this;
  
  function onceWrapper() {
    callback.apply(this, arguments);
    self.off(event, onceWrapper);
  }
  
  return this.on(event, onceWrapper);
};

// 使用
var emitter = new EventEmitter();

emitter.on('message', function(data) {
  console.log('收到消息:', data);
});

emitter.once('connect', function() {
  console.log('连接成功（只触发一次）');
});

emitter.emit('connect');  // 连接成功（只触发一次）
emitter.emit('connect');  // 不再触发

emitter.emit('message', { text: 'Hello' }); // 收到消息: { text: 'Hello' }
```

---

## 总结

ES5是JavaScript发展的重要里程碑，主要新增特性包括：

1. **严格模式**：提供更安全的代码执行环境
2. **JSON对象**：原生支持JSON解析和序列化
3. **数组方法**：forEach、map、filter、reduce等函数式编程方法
4. **对象方法**：Object.keys、Object.create、Object.defineProperty等
5. **字符串方法**：trim()等
6. **Function.prototype.bind**：函数绑定
7. **存取器属性**：getter/setter
8. **Date方法**：Date.now()、toISOString()等

这些特性为现代JavaScript开发奠定了基础，是理解ES6+新特性的前提。
