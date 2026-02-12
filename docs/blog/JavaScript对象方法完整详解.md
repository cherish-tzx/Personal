# JavaScript 对象方法完整详解

> 本文档详细介绍JavaScript中所有Object静态方法和实例方法，配合多场景实例讲解。
<div class="doc-toc">
## 目录

1. [对象创建方法](#1-对象创建方法)
2. [属性操作方法](#2-属性操作方法)
3. [属性描述符方法](#3-属性描述符方法)
4. [对象保护方法](#4-对象保护方法)
5. [原型相关方法](#5-原型相关方法)
6. [对象转换方法](#6-对象转换方法)
7. [对象比较方法](#7-对象比较方法)
8. [对象实例方法](#8-对象实例方法)
9. [实用工具函数](#9-实用工具函数)


</div>

---

## 1. 对象创建方法

### 1.1 Object.create()

创建一个新对象，使用指定的原型对象和属性。

```javascript
// 基本用法
const person = {
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const john = Object.create(person);
john.name = 'John';
console.log(john.greet()); // "Hello, I'm John"

// 带属性描述符
const obj = Object.create({}, {
  name: {
    value: '张三',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 25,
    writable: false
  }
});
console.log(obj.name); // '张三'

// 创建无原型对象
const pureObj = Object.create(null);
console.log(pureObj.toString); // undefined (没有继承Object.prototype)

// 场景1：实现继承
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + ' makes a sound');
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
  console.log(this.name + ' barks');
};

const dog = new Dog('旺财', '金毛');
dog.speak(); // '旺财 makes a sound'
dog.bark();  // '旺财 barks'

// 场景2：创建字典对象（避免原型污染）
function createDict() {
  return Object.create(null);
}

const dict = createDict();
dict['__proto__'] = 'value'; // 安全，不会影响原型
console.log(dict['__proto__']); // 'value'

// 场景3：对象工厂
const vehicleProto = {
  start() { console.log('Starting...'); },
  stop() { console.log('Stopping...'); }
};

function createVehicle(type, brand) {
  const vehicle = Object.create(vehicleProto);
  vehicle.type = type;
  vehicle.brand = brand;
  return vehicle;
}

const car = createVehicle('car', 'Toyota');
car.start(); // 'Starting...'
```

### 1.2 Object.assign()

将源对象的可枚举属性复制到目标对象。

```javascript
// 基本用法
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const result = Object.assign(target, source);

console.log(target); // { a: 1, b: 4, c: 5 }
console.log(result === target); // true (返回目标对象)

// 多源对象
const merged = Object.assign({}, { a: 1 }, { b: 2 }, { c: 3 });
console.log(merged); // { a: 1, b: 2, c: 3 }

// 场景1：浅拷贝
const original = { name: '张三', info: { age: 25 } };
const copy = Object.assign({}, original);

copy.name = '李四';
console.log(original.name); // '张三' (基本类型不受影响)

copy.info.age = 30;
console.log(original.info.age); // 30 (对象是引用，受影响！)

// 场景2：默认配置合并
function createConfig(userConfig = {}) {
  const defaults = {
    timeout: 5000,
    retries: 3,
    debug: false
  };
  return Object.assign({}, defaults, userConfig);
}

console.log(createConfig({ timeout: 10000 }));
// { timeout: 10000, retries: 3, debug: false }

// 场景3：添加方法
const obj = {};
Object.assign(obj, {
  sayHello() { console.log('Hello'); },
  sayBye() { console.log('Bye'); }
});
obj.sayHello(); // 'Hello'

// 场景4：克隆并修改
const user = { name: '张三', age: 25 };
const updatedUser = Object.assign({}, user, { age: 26 });
console.log(updatedUser); // { name: '张三', age: 26 }

// 注意：不会复制getter/setter
const source2 = {
  _value: 0,
  get value() { return this._value; },
  set value(v) { this._value = v; }
};

const copy2 = Object.assign({}, source2);
console.log(Object.getOwnPropertyDescriptor(copy2, 'value'));
// { value: 0, writable: true, enumerable: true, configurable: true }
// getter/setter被转换为普通值
```

### 1.3 Object.fromEntries() (ES2019)

将键值对列表转换为对象。

```javascript
// 从数组创建
const entries = [['a', 1], ['b', 2], ['c', 3]];
const obj = Object.fromEntries(entries);
console.log(obj); // { a: 1, b: 2, c: 3 }

// 从Map创建
const map = new Map([['name', '张三'], ['age', 25]]);
const objFromMap = Object.fromEntries(map);
console.log(objFromMap); // { name: '张三', age: 25 }

// 场景1：转换对象
const prices = { apple: 10, banana: 5, orange: 8 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.8])
);
console.log(discounted); // { apple: 8, banana: 4, orange: 6.4 }

// 场景2：过滤对象属性
const user = { name: '张三', password: 'secret', email: 'test@example.com' };
const publicFields = ['name', 'email'];
const publicUser = Object.fromEntries(
  Object.entries(user).filter(([key]) => publicFields.includes(key))
);
console.log(publicUser); // { name: '张三', email: 'test@example.com' }

// 场景3：URL查询参数解析
const queryString = 'name=张三&age=25&city=北京';
const params = Object.fromEntries(new URLSearchParams(queryString));
console.log(params); // { name: '张三', age: '25', city: '北京' }

// 场景4：交换键值
const original = { a: 1, b: 2, c: 3 };
const swapped = Object.fromEntries(
  Object.entries(original).map(([k, v]) => [v, k])
);
console.log(swapped); // { '1': 'a', '2': 'b', '3': 'c' }
```

---

## 2. 属性操作方法

### 2.1 Object.keys()

返回对象自身可枚举属性的键名数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']

// 不包含不可枚举属性
const obj2 = Object.create({}, {
  visible: { value: 1, enumerable: true },
  hidden: { value: 2, enumerable: false }
});
console.log(Object.keys(obj2)); // ['visible']

// 不包含继承属性
const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;
console.log(Object.keys(child)); // ['own']

// 场景1：遍历对象
const config = { host: 'localhost', port: 3000, debug: true };
Object.keys(config).forEach(key => {
  console.log(`${key}: ${config[key]}`);
});

// 场景2：对象属性数量
const propCount = Object.keys(obj).length;
console.log(propCount); // 3

// 场景3：检查对象是否为空
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
console.log(isEmpty({})); // true
console.log(isEmpty({ a: 1 })); // false

// 场景4：对象转数组
const scores = { math: 90, english: 85, chinese: 92 };
const scoreArray = Object.keys(scores).map(subject => ({
  subject,
  score: scores[subject]
}));
console.log(scoreArray);
```

### 2.2 Object.values()

返回对象自身可枚举属性的值数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.values(obj)); // [1, 2, 3]

// 场景1：求和
const prices = { item1: 100, item2: 200, item3: 300 };
const total = Object.values(prices).reduce((sum, price) => sum + price, 0);
console.log(total); // 600

// 场景2：查找最大值
const scores = { alice: 85, bob: 92, charlie: 78 };
const maxScore = Math.max(...Object.values(scores));
console.log(maxScore); // 92

// 场景3：数据验证
const formData = { name: 'John', email: '', age: 25 };
const hasEmptyField = Object.values(formData).some(v => v === '' || v == null);
console.log(hasEmptyField); // true

// 场景4：统计
const inventory = { apples: 50, bananas: 30, oranges: 45 };
const totalItems = Object.values(inventory).reduce((a, b) => a + b, 0);
const average = totalItems / Object.keys(inventory).length;
console.log(`总数: ${totalItems}, 平均: ${average}`);
```

### 2.3 Object.entries()

返回对象自身可枚举属性的键值对数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]

// 场景1：遍历键值对
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}

// 场景2：转换为Map
const map = new Map(Object.entries(obj));
console.log(map.get('a')); // 1

// 场景3：对象排序
const unsorted = { c: 3, a: 1, b: 2 };
const sorted = Object.fromEntries(
  Object.entries(unsorted).sort(([, a], [, b]) => a - b)
);
console.log(sorted); // { a: 1, b: 2, c: 3 }

// 场景4：构建查询字符串
function toQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}
console.log(toQueryString({ name: '张三', age: 25 }));
// 'name=%E5%BC%A0%E4%B8%89&age=25'
```

### 2.4 Object.getOwnPropertyNames()

返回对象自身所有属性的名称（包括不可枚举属性）。

```javascript
const obj = Object.create({}, {
  visible: { value: 1, enumerable: true },
  hidden: { value: 2, enumerable: false }
});

console.log(Object.keys(obj));                 // ['visible']
console.log(Object.getOwnPropertyNames(obj)); // ['visible', 'hidden']

// 数组的属性
const arr = ['a', 'b', 'c'];
console.log(Object.getOwnPropertyNames(arr)); 
// ['0', '1', '2', 'length']

// 场景：获取所有方法
function getMethods(obj) {
  return Object.getOwnPropertyNames(obj).filter(
    name => typeof obj[name] === 'function'
  );
}
console.log(getMethods(Array.prototype).slice(0, 5));
// ['constructor', 'concat', 'copyWithin', 'fill', 'find']
```

### 2.5 Object.getOwnPropertySymbols()

返回对象自身的所有Symbol属性。

```javascript
const sym1 = Symbol('sym1');
const sym2 = Symbol('sym2');

const obj = {
  [sym1]: 'value1',
  [sym2]: 'value2',
  normalKey: 'normalValue'
};

console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(sym1), Symbol(sym2)]
console.log(Object.keys(obj)); // ['normalKey']

// 获取所有属性（包括Symbol）
function getAllProperties(obj) {
  return [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj)
  ];
}
console.log(getAllProperties(obj)); // ['normalKey', Symbol(sym1), Symbol(sym2)]
```

### 2.6 Object.hasOwn() (ES2022)

检查对象是否有指定的自身属性。

```javascript
const obj = { name: '张三' };

// 新方法
console.log(Object.hasOwn(obj, 'name')); // true
console.log(Object.hasOwn(obj, 'age'));  // false

// 比 hasOwnProperty 更安全
const dict = Object.create(null);
dict.key = 'value';
// dict.hasOwnProperty('key'); // 报错！没有这个方法
console.log(Object.hasOwn(dict, 'key')); // true

// 之前的安全写法
console.log(Object.prototype.hasOwnProperty.call(dict, 'key')); // true

// 不检查继承属性
const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

console.log(Object.hasOwn(child, 'own'));      // true
console.log(Object.hasOwn(child, 'inherited')); // false
console.log('inherited' in child);              // true (in操作符检查继承属性)
```

---

## 3. 属性描述符方法

### 3.1 Object.defineProperty()

定义或修改对象的属性。

```javascript
const obj = {};

// 数据属性
Object.defineProperty(obj, 'name', {
  value: '张三',
  writable: true,     // 可写
  enumerable: true,   // 可枚举
  configurable: true  // 可配置
});

// 访问器属性
let _age = 0;
Object.defineProperty(obj, 'age', {
  get() {
    return _age;
  },
  set(value) {
    if (value >= 0 && value <= 150) {
      _age = value;
    }
  },
  enumerable: true,
  configurable: true
});

obj.age = 25;
console.log(obj.age); // 25
obj.age = -1;
console.log(obj.age); // 25 (无效值被忽略)

// 场景1：创建只读属性
Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});
// obj.id = 2; // 严格模式下报错

// 场景2：隐藏属性
Object.defineProperty(obj, '_internal', {
  value: 'secret',
  enumerable: false
});
console.log(Object.keys(obj)); // ['name', 'age', 'id'] (_internal不显示)

// 场景3：计算属性
const rectangle = { width: 10, height: 5 };
Object.defineProperty(rectangle, 'area', {
  get() {
    return this.width * this.height;
  },
  enumerable: true
});
console.log(rectangle.area); // 50

// 场景4：数据劫持（Vue2响应式原理）
function observe(obj, callback) {
  const observed = {};
  
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    
    Object.defineProperty(observed, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        const oldValue = value;
        value = newValue;
        callback(key, oldValue, newValue);
      }
    });
  });
  
  return observed;
}

const state = observe({ count: 0 }, (key, oldVal, newVal) => {
  console.log(`${key}: ${oldVal} -> ${newVal}`);
});

state.count = 1; // count: 0 -> 1
state.count = 2; // count: 1 -> 2
```

### 3.2 Object.defineProperties()

同时定义多个属性。

```javascript
const obj = {};

Object.defineProperties(obj, {
  firstName: {
    value: '三',
    writable: true,
    enumerable: true
  },
  lastName: {
    value: '张',
    writable: true,
    enumerable: true
  },
  fullName: {
    get() {
      return this.lastName + this.firstName;
    },
    enumerable: true
  }
});

console.log(obj.fullName); // '张三'

// 场景：创建具有特定属性的对象
function createPerson(firstName, lastName) {
  const person = {};
  
  Object.defineProperties(person, {
    firstName: { value: firstName, writable: true, enumerable: true },
    lastName: { value: lastName, writable: true, enumerable: true },
    fullName: {
      get() { return `${this.lastName}${this.firstName}`; },
      enumerable: true
    },
    email: {
      value: null,
      writable: true,
      enumerable: true
    }
  });
  
  return person;
}

const person = createPerson('三', '张');
console.log(person.fullName); // '张三'
```

### 3.3 Object.getOwnPropertyDescriptor()

获取属性的描述符。

```javascript
const obj = {
  name: '张三',
  get age() { return 25; }
};

// 获取数据属性描述符
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// {
//   value: '张三',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// 获取访问器属性描述符
console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
// {
//   get: [Function: get age],
//   set: undefined,
//   enumerable: true,
//   configurable: true
// }

// 场景：检查属性是否可写
function isWritable(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  return descriptor ? descriptor.writable !== false : true;
}
```

### 3.4 Object.getOwnPropertyDescriptors() (ES2017)

获取对象所有属性的描述符。

```javascript
const obj = {
  name: '张三',
  get age() { return 25; }
};

console.log(Object.getOwnPropertyDescriptors(obj));
// {
//   name: { value: '张三', writable: true, enumerable: true, configurable: true },
//   age: { get: [Function], set: undefined, enumerable: true, configurable: true }
// }

// 场景1：完整克隆对象（包括getter/setter）
function cloneWithDescriptors(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

const original = {
  _value: 0,
  get value() { return this._value; },
  set value(v) { this._value = v; }
};

const clone = cloneWithDescriptors(original);
console.log(Object.getOwnPropertyDescriptor(clone, 'value').get);
// [Function: get value] (getter被正确克隆)

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

const canWalk = {
  walk() { console.log('Walking...'); }
};

const canSwim = {
  swim() { console.log('Swimming...'); }
};

const duck = mixin({}, canWalk, canSwim);
duck.walk(); // 'Walking...'
duck.swim(); // 'Swimming...'
```

---

## 4. 对象保护方法

### 4.1 Object.preventExtensions() / Object.isExtensible()

阻止对象添加新属性。

```javascript
const obj = { a: 1 };

console.log(Object.isExtensible(obj)); // true

Object.preventExtensions(obj);

console.log(Object.isExtensible(obj)); // false

// 不能添加新属性
obj.b = 2;
console.log(obj.b); // undefined

// 可以修改现有属性
obj.a = 10;
console.log(obj.a); // 10

// 可以删除属性
delete obj.a;
console.log(obj.a); // undefined

// 场景：阻止配置对象被扩展
const config = Object.preventExtensions({
  apiUrl: '/api',
  timeout: 5000
});
```

### 4.2 Object.seal() / Object.isSealed()

密封对象（不能添加/删除属性，但可以修改现有属性值）。

```javascript
const obj = { a: 1, b: 2 };

console.log(Object.isSealed(obj)); // false

Object.seal(obj);

console.log(Object.isSealed(obj)); // true

// 不能添加新属性
obj.c = 3;
console.log(obj.c); // undefined

// 不能删除属性
delete obj.a;
console.log(obj.a); // 1 (删除失败)

// 可以修改现有属性
obj.a = 10;
console.log(obj.a); // 10

// 场景：配置对象
const settings = Object.seal({
  theme: 'dark',
  language: 'zh'
});

// 可以修改设置
settings.theme = 'light';

// 不能添加新设置
settings.fontSize = 14; // 无效
```

### 4.3 Object.freeze() / Object.isFrozen()

冻结对象（完全不可变）。

```javascript
const obj = { a: 1, b: { c: 2 } };

console.log(Object.isFrozen(obj)); // false

Object.freeze(obj);

console.log(Object.isFrozen(obj)); // true

// 不能添加
obj.d = 4;
console.log(obj.d); // undefined

// 不能删除
delete obj.a;
console.log(obj.a); // 1

// 不能修改
obj.a = 10;
console.log(obj.a); // 1

// 注意：浅冻结，嵌套对象仍可修改
obj.b.c = 20;
console.log(obj.b.c); // 20

// 场景1：深度冻结
function deepFreeze(obj) {
  Object.freeze(obj);
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
  
  return obj;
}

const config = deepFreeze({
  api: {
    url: 'https://api.example.com',
    timeout: 5000
  }
});

config.api.url = 'other'; // 无效
console.log(config.api.url); // 'https://api.example.com'

// 场景2：常量配置
const CONSTANTS = Object.freeze({
  MAX_SIZE: 1000,
  MIN_SIZE: 10,
  DEFAULT_TIMEOUT: 5000
});
```

### 4.4 保护级别对比

```javascript
const obj = { a: 1 };

// preventExtensions: 不能添加，可以删除和修改
// seal: 不能添加和删除，可以修改
// freeze: 不能添加、删除和修改

console.log('| 操作 | preventExtensions | seal | freeze |');
console.log('| --- | --- | --- | --- |');
console.log('| 添加属性 | ❌ | ❌ | ❌ |');
console.log('| 删除属性 | ✅ | ❌ | ❌ |');
console.log('| 修改属性 | ✅ | ✅ | ❌ |');
```

---

## 5. 原型相关方法

### 5.1 Object.getPrototypeOf()

获取对象的原型。

```javascript
const arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

const obj = {};
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

// 原型链
function Animal(name) {
  this.name = name;
}

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);

const dog = new Dog('旺财');
console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true

// 场景：检查继承关系
function inheritsFrom(obj, constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

console.log(inheritsFrom(dog, Animal)); // true
console.log(inheritsFrom(dog, Object)); // true
```

### 5.2 Object.setPrototypeOf()

设置对象的原型。

```javascript
const obj = { a: 1 };
const proto = { greet() { console.log('Hello'); } };

Object.setPrototypeOf(obj, proto);
obj.greet(); // 'Hello'

// 注意：性能问题
// Object.setPrototypeOf 会影响所有访问该对象的代码性能
// 推荐使用 Object.create 代替

// 场景：动态添加功能
const loggingMixin = {
  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// 不推荐的方式
// Object.setPrototypeOf(User.prototype, loggingMixin);

// 推荐的方式
Object.assign(User.prototype, loggingMixin);

const user = new User('张三');
user.log('User created'); // [2026-02-02T...] User created
```

---

## 6. 对象转换方法

### 6.1 Object.keys() / values() / entries()

前面已详细介绍，这里补充高级用法。

```javascript
// 组合使用
const inventory = {
  apples: { quantity: 50, price: 5 },
  bananas: { quantity: 30, price: 3 },
  oranges: { quantity: 45, price: 4 }
};

// 计算总价值
const totalValue = Object.entries(inventory).reduce(
  (sum, [name, { quantity, price }]) => sum + quantity * price,
  0
);
console.log(totalValue); // 50*5 + 30*3 + 45*4 = 520

// 找出最贵的商品
const mostExpensive = Object.entries(inventory)
  .sort(([, a], [, b]) => b.price - a.price)
  .map(([name]) => name)[0];
console.log(mostExpensive); // 'apples'

// 库存不足的商品
const lowStock = Object.entries(inventory)
  .filter(([, { quantity }]) => quantity < 40)
  .map(([name]) => name);
console.log(lowStock); // ['bananas']
```

---

## 7. 对象比较方法

### 7.1 Object.is() (ES6)

判断两个值是否严格相等。

```javascript
// 与 === 的区别

// NaN
console.log(NaN === NaN);        // false
console.log(Object.is(NaN, NaN)); // true

// +0 和 -0
console.log(+0 === -0);          // true
console.log(Object.is(+0, -0));  // false

// 其他情况与 === 相同
console.log(Object.is(1, 1));           // true
console.log(Object.is('a', 'a'));       // true
console.log(Object.is({}, {}));         // false (不同引用)
console.log(Object.is(null, null));     // true
console.log(Object.is(undefined, undefined)); // true

// 场景：实现更精确的相等检查
function strictEquals(a, b) {
  return Object.is(a, b);
}

// 场景：检测特殊值
function isNegativeZero(value) {
  return Object.is(value, -0);
}

console.log(isNegativeZero(-0)); // true
console.log(isNegativeZero(0));  // false
```

---

## 8. 对象实例方法

### 8.1 hasOwnProperty()

检查对象是否有指定的自身属性。

```javascript
const obj = { name: '张三' };

console.log(obj.hasOwnProperty('name'));     // true
console.log(obj.hasOwnProperty('toString')); // false (继承的)

// 安全使用（避免原型污染）
const dict = { hasOwnProperty: 'value' };
// dict.hasOwnProperty('key'); // 报错！hasOwnProperty被覆盖

// 安全写法
console.log(Object.prototype.hasOwnProperty.call(dict, 'hasOwnProperty')); // true

// 更推荐使用 Object.hasOwn()
console.log(Object.hasOwn(dict, 'hasOwnProperty')); // true
```

### 8.2 isPrototypeOf()

检查对象是否在另一个对象的原型链中。

```javascript
function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);

const dog = new Dog();

console.log(Animal.prototype.isPrototypeOf(dog)); // true
console.log(Dog.prototype.isPrototypeOf(dog));    // true
console.log(Object.prototype.isPrototypeOf(dog)); // true

// 与 instanceof 的区别
console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog);    // true

// isPrototypeOf 检查原型链
// instanceof 检查构造函数的prototype
```

### 8.3 propertyIsEnumerable()

检查属性是否可枚举。

```javascript
const obj = { a: 1 };
Object.defineProperty(obj, 'b', { value: 2, enumerable: false });

console.log(obj.propertyIsEnumerable('a')); // true
console.log(obj.propertyIsEnumerable('b')); // false

// 数组
const arr = ['a', 'b', 'c'];
console.log(arr.propertyIsEnumerable(0));        // true
console.log(arr.propertyIsEnumerable('length')); // false
```

### 8.4 toString() / toLocaleString()

返回对象的字符串表示。

```javascript
const obj = { name: '张三' };
console.log(obj.toString()); // '[object Object]'

// 自定义toString
const user = {
  name: '张三',
  age: 25,
  toString() {
    return `User(${this.name}, ${this.age})`;
  }
};
console.log(user.toString()); // 'User(张三, 25)'
console.log(String(user));    // 'User(张三, 25)'

// 类型检测
function getType(value) {
  return Object.prototype.toString.call(value);
}

console.log(getType([]));        // '[object Array]'
console.log(getType({}));        // '[object Object]'
console.log(getType(null));      // '[object Null]'
console.log(getType(undefined)); // '[object Undefined]'
console.log(getType(42));        // '[object Number]'
console.log(getType('string'));  // '[object String]'
console.log(getType(true));      // '[object Boolean]'
console.log(getType(() => {}));  // '[object Function]'
console.log(getType(new Date())); // '[object Date]'
console.log(getType(/regex/));   // '[object RegExp]'

// 自定义 toStringTag
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}

console.log(Object.prototype.toString.call(new MyClass()));
// '[object MyClass]'
```

### 8.5 valueOf()

返回对象的原始值。

```javascript
const num = new Number(42);
console.log(num.valueOf()); // 42

// 自定义valueOf
const price = {
  value: 99.99,
  valueOf() {
    return this.value;
  }
};

console.log(price + 0);   // 99.99
console.log(price * 2);   // 199.98
console.log(+price);      // 99.99

// 日期对象
const date = new Date('2026-02-02');
console.log(date.valueOf()); // 1769990400000 (时间戳)

// Symbol.toPrimitive
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42;
    if (hint === 'string') return 'hello';
    return true; // default
  }
};

console.log(+obj);     // 42
console.log(`${obj}`); // 'hello'
console.log(obj + ''); // 'true'
```

---

## 9. 实用工具函数

### 9.1 对象操作工具

```javascript
// 深拷贝
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  );
}

// 深度合并
function deepMerge(target, ...sources) {
  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      const targetVal = target[key];
      const sourceVal = source[key];
      
      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        target[key] = deepMerge({}, targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }
    });
  });
  return target;
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

// 获取嵌套属性
function get(obj, path, defaultValue = undefined) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  
  return result;
}

// 设置嵌套属性
function set(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current)) current[key] = {};
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
}

// 选择属性
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

// 排除属性
function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
}

// 扁平化对象
function flatten(obj, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (isPlainObject(value)) {
      flatten(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// 反扁平化对象
function unflatten(obj) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    set(result, key, value);
  }
  
  return result;
}

// 使用示例
const obj = {
  user: {
    name: '张三',
    address: {
      city: '北京',
      street: '长安街'
    }
  }
};

console.log(get(obj, 'user.name')); // '张三'
console.log(get(obj, 'user.age', 18)); // 18

const flat = flatten(obj);
console.log(flat);
// {
//   'user.name': '张三',
//   'user.address.city': '北京',
//   'user.address.street': '长安街'
// }

console.log(unflatten(flat));
// 恢复原始结构
```

### 9.2 对象比较工具

```javascript
// 浅比较
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => obj1[key] === obj2[key]);
}

// 深比较
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => deepEqual(obj1[key], obj2[key]));
}

// 获取差异
function diff(obj1, obj2) {
  const result = {};
  
  // 检查obj1中的属性
  for (const key of Object.keys(obj1)) {
    if (!(key in obj2)) {
      result[key] = { type: 'removed', value: obj1[key] };
    } else if (!deepEqual(obj1[key], obj2[key])) {
      result[key] = { type: 'changed', from: obj1[key], to: obj2[key] };
    }
  }
  
  // 检查obj2中新增的属性
  for (const key of Object.keys(obj2)) {
    if (!(key in obj1)) {
      result[key] = { type: 'added', value: obj2[key] };
    }
  }
  
  return result;
}

// 使用示例
const a = { name: '张三', age: 25, city: '北京' };
const b = { name: '张三', age: 26, country: '中国' };

console.log(diff(a, b));
// {
//   age: { type: 'changed', from: 25, to: 26 },
//   city: { type: 'removed', value: '北京' },
//   country: { type: 'added', value: '中国' }
// }
```

---

## 总结

JavaScript对象方法分类：

### 创建方法
- `Object.create()` - 指定原型创建对象
- `Object.assign()` - 合并对象
- `Object.fromEntries()` - 键值对转对象

### 属性操作
- `Object.keys()` / `values()` / `entries()` - 获取键/值/键值对
- `Object.getOwnPropertyNames()` - 获取所有属性名
- `Object.getOwnPropertySymbols()` - 获取Symbol属性
- `Object.hasOwn()` - 检查自身属性

### 属性描述符
- `Object.defineProperty()` / `defineProperties()` - 定义属性
- `Object.getOwnPropertyDescriptor()` / `getOwnPropertyDescriptors()` - 获取描述符

### 对象保护
- `Object.preventExtensions()` - 阻止扩展
- `Object.seal()` - 密封
- `Object.freeze()` - 冻结

### 原型操作
- `Object.getPrototypeOf()` - 获取原型
- `Object.setPrototypeOf()` - 设置原型

### 比较方法
- `Object.is()` - 严格相等比较

### 实例方法
- `hasOwnProperty()` - 检查自身属性
- `isPrototypeOf()` - 原型链检查
- `propertyIsEnumerable()` - 可枚举性检查
- `toString()` / `valueOf()` - 类型转换

掌握这些方法可以高效处理各种对象操作场景。
