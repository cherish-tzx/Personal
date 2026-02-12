# ES7 (ES2016) 完整语法详解

> ECMAScript 2016 (ES7) 是一个小版本更新，仅包含两个新特性，但这两个特性都非常实用。
<div class="doc-toc">
## 目录

1. [Array.prototype.includes()](#1-arrayprototypeincludes)
2. [指数运算符](#2-指数运算符)


</div>

---

## 1. Array.prototype.includes()

### 1.1 基本语法

`includes()` 方法用于判断数组是否包含某个值，返回布尔值。

```javascript
// 基本用法
const arr = [1, 2, 3, 4, 5];

console.log(arr.includes(3)); // true
console.log(arr.includes(6)); // false

// 语法: arr.includes(searchElement, fromIndex)
// searchElement: 要查找的元素
// fromIndex: 开始查找的位置（可选，默认0）
```

### 1.2 与indexOf的区别

```javascript
// indexOf 的问题
const arr = [1, 2, NaN, 4, 5];

// indexOf 无法检测 NaN
console.log(arr.indexOf(NaN)); // -1 (找不到)
console.log(arr.indexOf(NaN) !== -1); // false

// includes 可以检测 NaN
console.log(arr.includes(NaN)); // true

// undefined 的处理
const sparseArr = [1, , 3]; // 稀疏数组

console.log(sparseArr.indexOf(undefined)); // -1
console.log(sparseArr.includes(undefined)); // true

// 更简洁的语法
// 旧写法
if (arr.indexOf(3) !== -1) {
  console.log('包含3');
}

// 新写法
if (arr.includes(3)) {
  console.log('包含3');
}
```

### 1.3 fromIndex 参数

```javascript
const arr = ['a', 'b', 'c', 'd', 'e'];

// 从索引2开始查找
console.log(arr.includes('c', 2)); // true
console.log(arr.includes('a', 2)); // false

// 负数索引（从末尾计算）
console.log(arr.includes('d', -2)); // true (从倒数第2个开始)
console.log(arr.includes('a', -2)); // false

// 如果fromIndex大于等于数组长度，返回false
console.log(arr.includes('a', 10)); // false

// 如果fromIndex为负数且绝对值大于数组长度，从0开始
console.log(arr.includes('a', -10)); // true
```

### 1.4 实际应用场景

#### 场景1：权限检查

```javascript
const userPermissions = ['read', 'write', 'delete'];

function hasPermission(permission) {
  return userPermissions.includes(permission);
}

console.log(hasPermission('read'));   // true
console.log(hasPermission('admin'));  // false

// 检查多个权限
function hasAllPermissions(requiredPermissions) {
  return requiredPermissions.every(perm => userPermissions.includes(perm));
}

console.log(hasAllPermissions(['read', 'write'])); // true
console.log(hasAllPermissions(['read', 'admin'])); // false

// 检查任一权限
function hasAnyPermission(requiredPermissions) {
  return requiredPermissions.some(perm => userPermissions.includes(perm));
}

console.log(hasAnyPermission(['admin', 'write'])); // true
```

#### 场景2：表单验证

```javascript
const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

function validateFileType(file) {
  if (!allowedFileTypes.includes(file.type)) {
    throw new Error('不支持的文件类型');
  }
  return true;
}

// 模拟文件对象
const pngFile = { type: 'image/png', name: 'test.png' };
const pdfFile = { type: 'application/pdf', name: 'test.pdf' };

console.log(validateFileType(pngFile)); // true
// validateFileType(pdfFile); // Error: 不支持的文件类型
```

#### 场景3：敏感词过滤

```javascript
const sensitiveWords = ['暴力', '色情', '赌博', '毒品'];

function containsSensitiveWord(text) {
  return sensitiveWords.some(word => text.includes(word));
}

function filterSensitiveWords(text) {
  let result = text;
  sensitiveWords.forEach(word => {
    if (result.includes(word)) {
      result = result.replace(new RegExp(word, 'g'), '**');
    }
  });
  return result;
}

console.log(containsSensitiveWord('这是正常文本')); // false
console.log(containsSensitiveWord('包含暴力内容')); // true
console.log(filterSensitiveWords('包含暴力和色情')); // '包含**和**'
```

#### 场景4：路由白名单

```javascript
const publicRoutes = ['/login', '/register', '/home', '/about'];

function isPublicRoute(path) {
  return publicRoutes.includes(path);
}

function authMiddleware(req, res, next) {
  if (isPublicRoute(req.path)) {
    return next(); // 公开路由，直接通过
  }
  
  if (!req.user) {
    return res.redirect('/login');
  }
  
  next();
}

console.log(isPublicRoute('/login'));    // true
console.log(isPublicRoute('/dashboard')); // false
```

#### 场景5：配置项检查

```javascript
const validEnvironments = ['development', 'staging', 'production'];

function validateConfig(config) {
  const errors = [];
  
  if (!validEnvironments.includes(config.env)) {
    errors.push(`无效的环境: ${config.env}`);
  }
  
  return errors;
}

console.log(validateConfig({ env: 'production' })); // []
console.log(validateConfig({ env: 'test' }));       // ['无效的环境: test']
```

#### 场景6：数组交集和差集

```javascript
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [3, 4, 5, 6, 7];

// 交集
const intersection = arr1.filter(item => arr2.includes(item));
console.log(intersection); // [3, 4, 5]

// 差集 (arr1中有但arr2中没有的)
const difference = arr1.filter(item => !arr2.includes(item));
console.log(difference); // [1, 2]

// 对称差集 (在arr1或arr2中，但不同时在两者中)
const symmetricDiff = [
  ...arr1.filter(item => !arr2.includes(item)),
  ...arr2.filter(item => !arr1.includes(item))
];
console.log(symmetricDiff); // [1, 2, 6, 7]
```

---

## 2. 指数运算符 (**)

### 2.1 基本语法

`**` 运算符用于计算幂次方，等同于 `Math.pow()`。

```javascript
// 基本用法
console.log(2 ** 3);  // 8 (2的3次方)
console.log(3 ** 2);  // 9 (3的2次方)
console.log(10 ** 0); // 1 (任何数的0次方都是1)

// 等价于 Math.pow()
console.log(Math.pow(2, 3)); // 8
console.log(2 ** 3);         // 8

// 负指数
console.log(2 ** -1); // 0.5 (等于 1/2)
console.log(2 ** -2); // 0.25 (等于 1/4)

// 小数指数
console.log(4 ** 0.5);  // 2 (平方根)
console.log(8 ** (1/3)); // 2 (立方根)
```

### 2.2 运算符优先级

```javascript
// 指数运算符是右结合的
console.log(2 ** 3 ** 2); // 512
// 等价于 2 ** (3 ** 2) = 2 ** 9 = 512
// 不是 (2 ** 3) ** 2 = 8 ** 2 = 64

// 与一元运算符
// -2 ** 2 会报错，需要用括号
// console.log(-2 ** 2); // SyntaxError

// 正确写法
console.log((-2) ** 2); // 4
console.log(-(2 ** 2)); // -4

// 优先级比较
console.log(2 + 3 ** 2);   // 11 (先算幂，再加)
console.log((2 + 3) ** 2); // 25
console.log(2 * 3 ** 2);   // 18 (先算幂，再乘)
```

### 2.3 赋值运算符 **=

```javascript
let num = 2;
num **= 3; // 等价于 num = num ** 3
console.log(num); // 8

let base = 10;
base **= 2;
console.log(base); // 100

// 连续使用
let value = 2;
value **= 2; // 4
value **= 2; // 16
console.log(value); // 16
```

### 2.4 实际应用场景

#### 场景1：文件大小转换

```javascript
// 字节转换
const KB = 2 ** 10; // 1024
const MB = 2 ** 20; // 1048576
const GB = 2 ** 30; // 1073741824
const TB = 2 ** 40; // 1099511627776

function formatFileSize(bytes) {
  if (bytes >= TB) return (bytes / TB).toFixed(2) + ' TB';
  if (bytes >= GB) return (bytes / GB).toFixed(2) + ' GB';
  if (bytes >= MB) return (bytes / MB).toFixed(2) + ' MB';
  if (bytes >= KB) return (bytes / KB).toFixed(2) + ' KB';
  return bytes + ' B';
}

console.log(formatFileSize(1024));       // '1.00 KB'
console.log(formatFileSize(1536));       // '1.50 KB'
console.log(formatFileSize(1048576));    // '1.00 MB'
console.log(formatFileSize(1073741824)); // '1.00 GB'
```

#### 场景2：二进制位操作

```javascript
// 检查第n位是否为1
function isBitSet(num, position) {
  return (num & (2 ** position)) !== 0;
}

// 设置第n位为1
function setBit(num, position) {
  return num | (2 ** position);
}

// 清除第n位
function clearBit(num, position) {
  return num & ~(2 ** position);
}

const flags = 0b1010; // 10

console.log(isBitSet(flags, 1)); // true  (第1位是1)
console.log(isBitSet(flags, 2)); // false (第2位是0)

console.log(setBit(flags, 2).toString(2));   // '1110'
console.log(clearBit(flags, 1).toString(2)); // '1000'
```

#### 场景3：数学计算

```javascript
// 计算复利
function compoundInterest(principal, rate, years) {
  return principal * ((1 + rate) ** years);
}

const investment = 10000; // 本金
const annualRate = 0.05;  // 年利率5%
const years = 10;         // 10年

const finalAmount = compoundInterest(investment, annualRate, years);
console.log(finalAmount.toFixed(2)); // '16288.95'

// 计算平方根和n次方根
function nthRoot(num, n) {
  return num ** (1 / n);
}

console.log(nthRoot(27, 3)); // 3 (27的立方根)
console.log(nthRoot(16, 4)); // 2 (16的4次方根)

// 欧几里得距离
function euclideanDistance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}

console.log(euclideanDistance(0, 0, 3, 4)); // 5
```

#### 场景4：颜色值转换

```javascript
// RGB转十六进制
function rgbToHex(r, g, b) {
  return '#' + ((r * (2 ** 16)) + (g * (2 ** 8)) + b)
    .toString(16)
    .padStart(6, '0');
}

console.log(rgbToHex(255, 0, 0));   // '#ff0000'
console.log(rgbToHex(0, 255, 0));   // '#00ff00'
console.log(rgbToHex(0, 0, 255));   // '#0000ff'
console.log(rgbToHex(128, 128, 128)); // '#808080'

// 十六进制转RGB
function hexToRgb(hex) {
  const num = parseInt(hex.slice(1), 16);
  return {
    r: (num / (2 ** 16)) | 0,
    g: ((num / (2 ** 8)) | 0) % 256,
    b: num % 256
  };
}

console.log(hexToRgb('#ff0000')); // { r: 255, g: 0, b: 0 }
```

#### 场景5：科学计数法

```javascript
// 大数表示
const speedOfLight = 3 * (10 ** 8); // 3×10^8 m/s
const electronMass = 9.109 * (10 ** -31); // 9.109×10^-31 kg

console.log(speedOfLight);  // 300000000
console.log(electronMass);  // 9.109e-31

// 数量级转换
function toScientificNotation(num) {
  if (num === 0) return '0';
  
  const exponent = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / (10 ** exponent);
  
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}

console.log(toScientificNotation(12345678)); // '1.23 × 10^7'
console.log(toScientificNotation(0.000123)); // '1.23 × 10^-4'
```

#### 场景6：动画缓动函数

```javascript
// 常用缓动函数
const easings = {
  // 二次方缓动
  easeInQuad: t => t ** 2,
  easeOutQuad: t => 1 - (1 - t) ** 2,
  easeInOutQuad: t => t < 0.5 
    ? 2 * t ** 2 
    : 1 - ((-2 * t + 2) ** 2) / 2,
  
  // 三次方缓动
  easeInCubic: t => t ** 3,
  easeOutCubic: t => 1 - (1 - t) ** 3,
  
  // 四次方缓动
  easeInQuart: t => t ** 4,
  easeOutQuart: t => 1 - (1 - t) ** 4,
  
  // 五次方缓动
  easeInQuint: t => t ** 5,
  easeOutQuint: t => 1 - (1 - t) ** 5
};

// 使用缓动函数实现动画
function animate(from, to, duration, easing = easings.easeInOutQuad) {
  const startTime = Date.now();
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easedProgress = easing(progress);
    const currentValue = from + (to - from) * easedProgress;
    
    console.log(`当前值: ${currentValue.toFixed(2)}`);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}

// animate(0, 100, 1000);
```

---

## 3. ES7 综合实例

### 实例1：简单的待办事项过滤器

```javascript
class TodoFilter {
  constructor(todos) {
    this.todos = todos;
    this.tags = ['工作', '生活', '学习', '健身'];
  }
  
  // 检查标签是否有效
  isValidTag(tag) {
    return this.tags.includes(tag);
  }
  
  // 按标签过滤
  filterByTag(tag) {
    if (!this.isValidTag(tag)) {
      console.warn(`标签 "${tag}" 不是有效标签`);
      return [];
    }
    return this.todos.filter(todo => todo.tags.includes(tag));
  }
  
  // 按多个标签过滤（包含任一标签）
  filterByAnyTag(tags) {
    return this.todos.filter(todo => 
      tags.some(tag => todo.tags.includes(tag))
    );
  }
  
  // 按多个标签过滤（包含所有标签）
  filterByAllTags(tags) {
    return this.todos.filter(todo => 
      tags.every(tag => todo.tags.includes(tag))
    );
  }
  
  // 计算优先级分数
  calculatePriorityScore(todo) {
    const baseScore = 10;
    const urgencyMultiplier = todo.urgent ? 2 : 1;
    const importanceLevel = todo.importance || 1;
    
    return baseScore * (urgencyMultiplier ** importanceLevel);
  }
}

// 使用示例
const todos = [
  { id: 1, title: '完成项目报告', tags: ['工作', '学习'], urgent: true, importance: 2 },
  { id: 2, title: '健身一小时', tags: ['健身', '生活'], urgent: false, importance: 1 },
  { id: 3, title: '学习ES7', tags: ['学习'], urgent: false, importance: 2 }
];

const filter = new TodoFilter(todos);

console.log(filter.filterByTag('学习'));
// [{ id: 1, ... }, { id: 3, ... }]

console.log(filter.filterByAllTags(['工作', '学习']));
// [{ id: 1, ... }]

console.log(filter.calculatePriorityScore(todos[0]));
// 40 (10 * 2^2)
```

### 实例2：简单的计算器

```javascript
class Calculator {
  constructor() {
    this.history = [];
  }
  
  // 基本运算
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
  divide(a, b) { return b !== 0 ? a / b : Infinity; }
  power(base, exponent) { return base ** exponent; }
  
  // 科学计算
  sqrt(n) { return n ** 0.5; }
  cbrt(n) { return n ** (1/3); }
  nthRoot(n, root) { return n ** (1/root); }
  
  // 复合运算
  calculate(expression) {
    const operators = ['+', '-', '*', '/', '**'];
    const parts = expression.split(' ');
    
    if (parts.length !== 3) {
      throw new Error('表达式格式错误');
    }
    
    const [a, op, b] = parts;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (!operators.includes(op)) {
      throw new Error('不支持的运算符');
    }
    
    let result;
    switch (op) {
      case '+': result = this.add(numA, numB); break;
      case '-': result = this.subtract(numA, numB); break;
      case '*': result = this.multiply(numA, numB); break;
      case '/': result = this.divide(numA, numB); break;
      case '**': result = this.power(numA, numB); break;
    }
    
    this.history.push({ expression, result });
    return result;
  }
  
  getHistory() {
    return this.history;
  }
}

const calc = new Calculator();

console.log(calc.calculate('2 ** 10')); // 1024
console.log(calc.calculate('10 + 5'));  // 15
console.log(calc.sqrt(16));             // 4
console.log(calc.nthRoot(27, 3));       // 3

console.log(calc.getHistory());
```

### 实例3：数据验证器

```javascript
class Validator {
  constructor() {
    this.allowedTypes = ['string', 'number', 'boolean', 'array', 'object'];
    this.rules = new Map();
  }
  
  // 添加验证规则
  addRule(field, type, options = {}) {
    if (!this.allowedTypes.includes(type)) {
      throw new Error(`不支持的类型: ${type}`);
    }
    
    this.rules.set(field, { type, ...options });
  }
  
  // 验证单个字段
  validateField(field, value) {
    const rule = this.rules.get(field);
    if (!rule) return { valid: true };
    
    const errors = [];
    
    // 类型检查
    if (rule.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} 必须是数组`);
    } else if (rule.type !== 'array' && typeof value !== rule.type) {
      errors.push(`${field} 必须是 ${rule.type} 类型`);
    }
    
    // 允许值检查
    if (rule.allowed && !rule.allowed.includes(value)) {
      errors.push(`${field} 的值不在允许范围内`);
    }
    
    // 数值范围检查
    if (rule.type === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${field} 必须大于等于 ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        // 使用指数运算符计算范围
        const maxPower = Math.log10(rule.max) | 0;
        errors.push(`${field} 必须小于等于 10^${maxPower}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  // 验证整个对象
  validate(data) {
    const results = {};
    let isValid = true;
    
    for (const [field, rule] of this.rules) {
      const result = this.validateField(field, data[field]);
      results[field] = result;
      if (!result.valid) isValid = false;
    }
    
    return { isValid, results };
  }
}

// 使用示例
const validator = new Validator();

validator.addRule('status', 'string', {
  allowed: ['pending', 'active', 'completed', 'cancelled']
});

validator.addRule('priority', 'number', {
  min: 1,
  max: 10 ** 2 // 最大100
});

validator.addRule('tags', 'array');

const testData = {
  status: 'active',
  priority: 50,
  tags: ['important', 'urgent']
};

console.log(validator.validate(testData));
// { isValid: true, results: { ... } }

const invalidData = {
  status: 'unknown',
  priority: 150,
  tags: 'not an array'
};

console.log(validator.validate(invalidData));
// { isValid: false, results: { ... } }
```

---

## 总结

ES7 (ES2016) 虽然只引入了两个新特性，但都非常实用：

### Array.prototype.includes()

1. **更直观的语法**：相比 `indexOf() !== -1`，`includes()` 更易读
2. **正确处理 NaN**：可以检测数组中的 NaN 值
3. **处理稀疏数组**：能正确检测 undefined
4. **支持 fromIndex**：可以指定开始搜索的位置

### 指数运算符 (**)

1. **简洁语法**：比 `Math.pow()` 更简洁
2. **支持赋值运算**：`**=` 运算符
3. **右结合性**：`a ** b ** c` 等于 `a ** (b ** c)`
4. **支持小数指数**：可以计算根号等

这两个特性虽然简单，但在日常开发中使用频率很高，极大地提升了代码的可读性和编写效率。
