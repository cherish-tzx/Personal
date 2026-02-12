# TypeScript 完整语法详解
<div class="doc-toc">
## 目录
1. [TypeScript简介](#一typescript简介)
2. [基础类型](#二基础类型)
3. [类型注解与类型推断](#三类型注解与类型推断)
4. [接口Interface](#四接口interface)
5. [类型别名Type](#五类型别名type)
6. [联合类型与交叉类型](#六联合类型与交叉类型)
7. [字面量类型](#七字面量类型)
8. [函数类型](#八函数类型)
9. [类Class](#九类class)
10. [泛型Generics](#十泛型generics)
11. [类型断言](#十一类型断言)
12. [类型守卫](#十二类型守卫)
13. [高级类型](#十三高级类型)
14. [内置工具类型](#十四内置工具类型)
15. [模块与命名空间](#十五模块与命名空间)
16. [装饰器](#十六装饰器)
17. [声明文件](#十七声明文件)
18. [tsconfig配置](#十八tsconfig配置)
19. [常见技巧与最佳实践](#十九常见技巧与最佳实践)


</div>

---

## 一、TypeScript简介

### 1.1 什么是TypeScript

```typescript
// TypeScript是JavaScript的超集，添加了类型系统和ES6+特性支持
// TypeScript代码会被编译成纯JavaScript代码

// JavaScript
function greet(name) {
  return 'Hello, ' + name
}

// TypeScript
function greet(name: string): string {
  return 'Hello, ' + name
}
```

### 1.2 TypeScript的优势

```typescript
// 1. 静态类型检查 - 在编译时发现错误
let count: number = 10
count = '20'  // 编译错误：不能将string赋值给number

// 2. 更好的IDE支持 - 智能提示、自动补全
interface User {
  name: string
  age: number
}
const user: User = { name: '张三', age: 25 }
user.  // IDE会提示name和age属性

// 3. 代码可读性和可维护性更强
// 4. 支持最新的ES特性
// 5. 渐进式采用 - 可以逐步迁移
```

---

## 二、基础类型

### 2.1 原始类型

```typescript
// 布尔值
let isDone: boolean = false

// 数字 - 支持十进制、十六进制、二进制、八进制
let decimal: number = 6
let hex: number = 0xf00d
let binary: number = 0b1010
let octal: number = 0o744
let big: bigint = 100n

// 字符串
let color: string = 'blue'
let fullName: string = `张三`
let sentence: string = `Hello, ${fullName}`

// Symbol
let sym1: symbol = Symbol('key')
let sym2: unique symbol = Symbol('key')  // 唯一symbol

// null和undefined
let u: undefined = undefined
let n: null = null

// 默认情况下null和undefined是所有类型的子类型
// 但开启strictNullChecks后，它们只能赋值给各自的类型和void
```

### 2.2 数组类型

```typescript
// 两种写法
let list1: number[] = [1, 2, 3]
let list2: Array<number> = [1, 2, 3]

// 混合类型数组
let mixed: (number | string)[] = [1, 'two', 3]

// 只读数组
let readonlyArr: readonly number[] = [1, 2, 3]
let readonlyArr2: ReadonlyArray<number> = [1, 2, 3]
// readonlyArr.push(4)  // 错误：只读数组

// 元组 - 固定长度和类型的数组
let tuple: [string, number] = ['hello', 10]
tuple[0]  // string
tuple[1]  // number

// 可选元组元素
let optionalTuple: [string, number?] = ['hello']

// 剩余元素元组
let restTuple: [string, ...number[]] = ['hello', 1, 2, 3]

// 只读元组
let readonlyTuple: readonly [string, number] = ['hello', 10]
```

### 2.3 对象类型

```typescript
// object类型 - 表示非原始类型
let obj: object = { name: '张三' }
let obj2: object = [1, 2, 3]
let obj3: object = () => {}

// 对象字面量类型
let person: { name: string; age: number } = {
  name: '张三',
  age: 25
}

// 可选属性
let person2: { name: string; age?: number } = {
  name: '张三'
}

// 只读属性
let person3: { readonly name: string; age: number } = {
  name: '张三',
  age: 25
}
// person3.name = '李四'  // 错误：只读属性

// 索引签名
let dict: { [key: string]: number } = {
  apple: 1,
  banana: 2
}
```

### 2.4 特殊类型

```typescript
// any - 任意类型（绕过类型检查）
let notSure: any = 4
notSure = 'maybe a string'
notSure = false
notSure.foo.bar  // 不会报错

// unknown - 类型安全的any
let unknownValue: unknown = 4
unknownValue = 'maybe a string'
// unknownValue.foo.bar  // 错误：unknown类型不能直接使用
if (typeof unknownValue === 'string') {
  unknownValue.toUpperCase()  // 类型收窄后可以使用
}

// void - 没有返回值
function warnUser(): void {
  console.log('This is a warning message')
}
let unusable: void = undefined

// never - 永不返回
function error(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {}
}

// never也用于穷尽检查
type Shape = 'circle' | 'square'
function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 1 * 1
    case 'square':
      return 1 * 1
    default:
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}
```

### 2.5 枚举类型

```typescript
// 数字枚举
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

let dir: Direction = Direction.Up
console.log(Direction.Up)  // 0
console.log(Direction[0])  // 'Up' (反向映射)

// 指定初始值
enum Direction2 {
  Up = 1,
  Down,    // 2
  Left,    // 3
  Right    // 4
}

// 字符串枚举
enum Direction3 {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

// 异构枚举（不推荐）
enum BooleanLike {
  No = 0,
  Yes = 'YES'
}

// 常量枚举 - 编译时内联
const enum Directions {
  Up,
  Down,
  Left,
  Right
}
let directions = [Directions.Up, Directions.Down]
// 编译后: let directions = [0, 1]

// 枚举成员作为类型
enum ShapeKind {
  Circle,
  Square
}

interface Circle {
  kind: ShapeKind.Circle
  radius: number
}

interface Square {
  kind: ShapeKind.Square
  sideLength: number
}
```

---

## 三、类型注解与类型推断

### 3.1 类型注解

```typescript
// 变量类型注解
let name: string = '张三'
let age: number = 25
let isStudent: boolean = true

// 函数参数和返回值注解
function add(a: number, b: number): number {
  return a + b
}

// 对象类型注解
let user: { name: string; age: number } = {
  name: '张三',
  age: 25
}

// 数组类型注解
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ['a', 'b', 'c']
```

### 3.2 类型推断

```typescript
// TypeScript会自动推断类型
let name = '张三'  // 推断为string
let age = 25       // 推断为number
let numbers = [1, 2, 3]  // 推断为number[]

// 根据上下文推断
const arr = [1, 2, 3]
arr.map(item => item * 2)  // item被推断为number

// 最佳公共类型
let mixed = [1, '2', 3]  // 推断为(string | number)[]

// 根据返回值推断
function add(a: number, b: number) {
  return a + b  // 返回值推断为number
}

// 对象属性推断
const user = {
  name: '张三',
  age: 25
}  // 推断为{ name: string; age: number }
```

### 3.3 类型断言

```typescript
// 尖括号语法
let someValue: unknown = 'this is a string'
let strLength: number = (<string>someValue).length

// as语法（推荐，JSX中只能用这种）
let strLength2: number = (someValue as string).length

// 双重断言（谨慎使用）
let a = (expr as any) as T

// 非空断言
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed())  // 断言x一定不是null/undefined
}

// const断言
let x = 'hello' as const  // 类型为'hello'而非string
let arr = [1, 2, 3] as const  // 类型为readonly [1, 2, 3]
let obj = { name: '张三' } as const  // 所有属性变为readonly
```

---

## 四、接口Interface

### 4.1 基础接口

```typescript
// 定义接口
interface User {
  name: string
  age: number
}

// 使用接口
let user: User = {
  name: '张三',
  age: 25
}

// 可选属性
interface User2 {
  name: string
  age?: number  // 可选
}

// 只读属性
interface User3 {
  readonly id: number
  name: string
}

// 额外属性检查
interface User4 {
  name: string
  age?: number
  [propName: string]: any  // 索引签名，允许任意额外属性
}

let user4: User4 = {
  name: '张三',
  email: 'test@test.com'  // 允许
}
```

### 4.2 函数类型接口

```typescript
// 定义函数类型
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc = function(src, sub) {
  return src.search(sub) > -1
}

// 带有调用签名的对象
interface CallableObject {
  (arg: string): string
  property: number
}
```

### 4.3 索引类型接口

```typescript
// 字符串索引
interface StringArray {
  [index: number]: string
}
let myArray: StringArray = ['Bob', 'Fred']

// 字符串索引
interface Dictionary {
  [key: string]: number
}
let dict: Dictionary = {
  apple: 1,
  banana: 2
}

// 同时使用两种索引
interface NumberOrStringDictionary {
  [index: string]: number | string
  length: number    // ok
  name: string      // ok
}
```

### 4.4 接口继承

```typescript
// 单继承
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

let dog: Dog = {
  name: '旺财',
  breed: '柴犬'
}

// 多继承
interface Shape {
  color: string
}

interface PenStroke {
  penWidth: number
}

interface Square extends Shape, PenStroke {
  sideLength: number
}

let square: Square = {
  color: 'blue',
  penWidth: 5,
  sideLength: 10
}

// 接口继承类
class Control {
  private state: any
}

interface SelectableControl extends Control {
  select(): void
}

class Button extends Control implements SelectableControl {
  select() {}
}
```

### 4.5 接口合并

```typescript
// 同名接口会自动合并
interface Box {
  height: number
  width: number
}

interface Box {
  scale: number
}

let box: Box = { height: 5, width: 6, scale: 10 }
```

---

## 五、类型别名Type

### 5.1 基础类型别名

```typescript
// 类型别名
type Name = string
type Age = number
type User = {
  name: Name
  age: Age
}

// 联合类型别名
type ID = number | string

// 字面量类型别名
type Direction = 'up' | 'down' | 'left' | 'right'

// 函数类型别名
type Callback = (data: string) => void
```

### 5.2 Type vs Interface

```typescript
// 相同点
// 1. 都可以描述对象
interface IUser {
  name: string
  age: number
}

type TUser = {
  name: string
  age: number
}

// 2. 都可以扩展
interface IAnimal {
  name: string
}
interface IDog extends IAnimal {
  breed: string
}

type TAnimal = {
  name: string
}
type TDog = TAnimal & {
  breed: string
}

// 不同点
// 1. type可以定义原始类型、联合类型、元组
type Name = string
type ID = number | string
type Point = [number, number]

// 2. interface可以声明合并，type不行
interface Window {
  title: string
}
interface Window {
  ts: number
}
// Window现在有title和ts两个属性

// 3. interface只能描述对象，type可以描述任何类型
type Callback = () => void  // 函数类型
type Pair<T> = [T, T]       // 元组
type StringOrNumber = string | number  // 联合类型

// 推荐：
// - 定义对象类型时优先使用interface
// - 需要使用联合类型、元组、原始类型等时使用type
// - 需要继承或实现时使用interface
```

---

## 六、联合类型与交叉类型

### 6.1 联合类型

```typescript
// 基础联合类型
type StringOrNumber = string | number
let value: StringOrNumber = 'hello'
value = 123

// 联合类型只能访问共同成员
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function getSmallPet(): Fish | Bird {
  // ...
}

let pet = getSmallPet()
pet.layEggs()  // ok - 共同成员
// pet.swim()  // 错误 - 不是共同成员

// 使用类型守卫
if ('swim' in pet) {
  pet.swim()
}

// 字面量联合类型
type Direction = 'up' | 'down' | 'left' | 'right'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// 可辨识联合
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
  }
}
```

### 6.2 交叉类型

```typescript
// 交叉类型 - 合并多个类型
interface Person {
  name: string
  age: number
}

interface Employee {
  employeeId: number
  department: string
}

type EmployeePerson = Person & Employee

let employee: EmployeePerson = {
  name: '张三',
  age: 25,
  employeeId: 1001,
  department: '技术部'
}

// 交叉类型与联合类型的组合
type Admin = {
  name: string
  privileges: string[]
}

type User = {
  name: string
  startDate: Date
}

type ElevatedEmployee = Admin & User

// 函数重载的交叉
type Overloaded = ((x: string) => string) & ((x: number) => number)

// 冲突处理
type A = { a: number; c: string }
type B = { b: string; c: number }
type AB = A & B
// AB的c属性类型为never（string & number = never）
```

---

## 七、字面量类型

### 7.1 字符串字面量类型

```typescript
type Direction = 'up' | 'down' | 'left' | 'right'

function move(direction: Direction) {
  console.log(`Moving ${direction}`)
}

move('up')    // ok
// move('forward')  // 错误

// 模板字面量类型 (TS 4.1+)
type World = 'world'
type Greeting = `hello ${World}`  // 'hello world'

type EmailLocaleIDs = 'welcome_email' | 'email_heading'
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff'
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`
// 'welcome_email_id' | 'email_heading_id' | 'footer_title_id' | 'footer_sendoff_id'

// 内置字符串操作类型
type Uppercase<S extends string> = intrinsic
type Lowercase<S extends string> = intrinsic
type Capitalize<S extends string> = intrinsic
type Uncapitalize<S extends string> = intrinsic

type ASCIIUppercase = Uppercase<'hello'>  // 'HELLO'
type ASCIICapitalize = Capitalize<'hello'>  // 'Hello'
```

### 7.2 数字字面量类型

```typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll
}

// HTTP状态码
type SuccessCode = 200 | 201 | 204
type ClientErrorCode = 400 | 401 | 403 | 404
type ServerErrorCode = 500 | 502 | 503
type HttpStatusCode = SuccessCode | ClientErrorCode | ServerErrorCode
```

### 7.3 布尔字面量类型

```typescript
type True = true
type False = false

// 条件类型中常用
type IsString<T> = T extends string ? true : false
type A = IsString<'hello'>  // true
type B = IsString<123>      // false
```

### 7.4 const断言

```typescript
// 普通变量
let x = 'hello'  // string类型

// const断言
let y = 'hello' as const  // 'hello'类型

// 数组const断言
let arr = [1, 2, 3] as const  // readonly [1, 2, 3]

// 对象const断言
let config = {
  endpoint: 'https://api.example.com',
  timeout: 3000
} as const
// { readonly endpoint: 'https://api.example.com'; readonly timeout: 3000 }

// 函数参数中使用
function handleRequest(url: string, method: 'GET' | 'POST') {}

const req = { url: 'https://example.com', method: 'GET' } as const
handleRequest(req.url, req.method)  // ok
```

---

## 八、函数类型

### 8.1 函数类型定义

```typescript
// 函数声明
function add(a: number, b: number): number {
  return a + b
}

// 函数表达式
const add2: (a: number, b: number) => number = function(a, b) {
  return a + b
}

// 箭头函数
const add3 = (a: number, b: number): number => a + b

// 完整函数类型
let myAdd: (baseValue: number, increment: number) => number =
  function(x: number, y: number): number {
    return x + y
  }
```

### 8.2 可选参数和默认参数

```typescript
// 可选参数
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName
}

// 默认参数
function buildName2(firstName: string, lastName: string = 'Smith'): string {
  return `${firstName} ${lastName}`
}

// 默认参数可以放在前面（但调用时需要传undefined）
function buildName3(firstName: string = 'John', lastName: string): string {
  return `${firstName} ${lastName}`
}
buildName3(undefined, 'Smith')
```

### 8.3 剩余参数

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sum(1, 2, 3)  // 6

// 解构剩余参数
function multiply(multiplier: number, ...numbers: number[]): number[] {
  return numbers.map(n => n * multiplier)
}
```

### 8.4 函数重载

```typescript
// 重载签名
function makeDate(timestamp: number): Date
function makeDate(year: number, month: number, day: number): Date

// 实现签名
function makeDate(timestampOrYear: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(timestampOrYear, month - 1, day)
  } else {
    return new Date(timestampOrYear)
  }
}

makeDate(12345678)     // ok
makeDate(2020, 1, 1)   // ok
// makeDate(2020, 1)   // 错误：没有匹配的重载

// 更复杂的重载
function createElement(tagName: 'a'): HTMLAnchorElement
function createElement(tagName: 'canvas'): HTMLCanvasElement
function createElement(tagName: 'table'): HTMLTableElement
function createElement(tagName: string): HTMLElement {
  return document.createElement(tagName)
}
```

### 8.5 this类型

```typescript
// 指定this类型
interface Card {
  suit: string
  card: number
}

interface Deck {
  suits: string[]
  cards: number[]
  createCardPicker(this: Deck): () => Card
}

let deck: Deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function(this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
    }
  }
}

// this参数在回调中
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void
}
```

### 8.6 调用签名和构造签名

```typescript
// 调用签名
type DescribableFunction = {
  description: string
  (someArg: number): boolean
}

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' returned ' + fn(6))
}

// 构造签名
type SomeConstructor = {
  new (s: string): SomeObject
}

function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}

// 同时支持调用和构造
interface CallOrConstruct {
  new (s: string): Date
  (n?: number): number
}
```

---

## 九、类Class

### 9.1 类的基础

```typescript
class Person {
  // 属性
  name: string
  age: number
  
  // 构造函数
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  // 方法
  greet(): string {
    return `Hello, I'm ${this.name}`
  }
}

const person = new Person('张三', 25)
console.log(person.greet())
```

### 9.2 访问修饰符

```typescript
class Animal {
  public name: string        // 公开（默认）
  protected age: number      // 受保护
  private secret: string     // 私有
  readonly id: number        // 只读
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
    this.secret = 'hidden'
    this.id = Math.random()
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age)
    console.log(this.name)    // ok - public
    console.log(this.age)     // ok - protected
    // console.log(this.secret)  // 错误 - private
  }
}

const dog = new Dog('旺财', 3)
console.log(dog.name)    // ok
// console.log(dog.age)  // 错误 - protected
// dog.id = 123          // 错误 - readonly
```

### 9.3 参数属性

```typescript
// 简写方式：在构造函数参数前加修饰符
class Person {
  constructor(
    public name: string,
    private age: number,
    readonly id: number
  ) {}
}

// 等价于
class Person2 {
  public name: string
  private age: number
  readonly id: number
  
  constructor(name: string, age: number, id: number) {
    this.name = name
    this.age = age
    this.id = id
  }
}
```

### 9.4 存取器

```typescript
class Employee {
  private _fullName: string = ''
  
  get fullName(): string {
    return this._fullName
  }
  
  set fullName(newName: string) {
    if (newName && newName.length > 0) {
      this._fullName = newName
    }
  }
}

let employee = new Employee()
employee.fullName = '张三'
console.log(employee.fullName)
```

### 9.5 静态成员

```typescript
class Grid {
  static origin = { x: 0, y: 0 }
  
  static calculateDistance(point: { x: number; y: number }): number {
    let xDist = point.x - Grid.origin.x
    let yDist = point.y - Grid.origin.y
    return Math.sqrt(xDist * xDist + yDist * yDist)
  }
  
  constructor(public scale: number) {}
}

console.log(Grid.origin)
console.log(Grid.calculateDistance({ x: 3, y: 4 }))
```

### 9.6 抽象类

```typescript
abstract class Animal {
  abstract name: string
  abstract makeSound(): void
  
  move(): void {
    console.log('roaming the earth...')
  }
}

class Dog extends Animal {
  name = 'Dog'
  
  makeSound(): void {
    console.log('Woof!')
  }
}

// const animal = new Animal()  // 错误：不能实例化抽象类
const dog = new Dog()
dog.makeSound()  // Woof!
dog.move()       // roaming the earth...
```

### 9.7 类实现接口

```typescript
interface ClockInterface {
  currentTime: Date
  setTime(d: Date): void
}

class Clock implements ClockInterface {
  currentTime: Date = new Date()
  
  setTime(d: Date): void {
    this.currentTime = d
  }
}

// 实现多个接口
interface Alarm {
  alert(): void
}

interface Light {
  lightOn(): void
  lightOff(): void
}

class Car implements Alarm, Light {
  alert() {
    console.log('Car alarm!')
  }
  lightOn() {
    console.log('Car light on')
  }
  lightOff() {
    console.log('Car light off')
  }
}
```

### 9.8 类作为类型

```typescript
class Point {
  x: number
  y: number
  
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

// 类可以作为类型使用
let p: Point = new Point(1, 2)

// 也可以用于函数参数
function printPoint(point: Point) {
  console.log(`(${point.x}, ${point.y})`)
}

// 结构类型 - 只要结构匹配就可以
let point3 = { x: 10, y: 20, z: 30 }
printPoint(point3)  // ok - 有x和y属性
```

---

## 十、泛型Generics

### 10.1 泛型函数

```typescript
// 基础泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 使用方式
let output1 = identity<string>('myString')  // 显式指定类型
let output2 = identity('myString')          // 类型推断

// 多个类型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

let p = pair('hello', 42)  // [string, number]
```

### 10.2 泛型约束

```typescript
// 约束泛型必须有某些属性
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)  // ok - T必须有length属性
  return arg
}

loggingIdentity('hello')     // ok - string有length
loggingIdentity([1, 2, 3])   // ok - array有length
// loggingIdentity(123)      // 错误 - number没有length

// 在泛型约束中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

let x = { a: 1, b: 2, c: 3 }
getProperty(x, 'a')  // ok
// getProperty(x, 'd')  // 错误 - 'd'不是x的键
```

### 10.3 泛型接口

```typescript
// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T
}

let myIdentity: GenericIdentityFn<number> = identity

// 泛型接口描述对象
interface Container<T> {
  value: T
  getValue(): T
  setValue(value: T): void
}
```

### 10.4 泛型类

```typescript
class GenericNumber<T> {
  zeroValue!: T
  add!: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) { return x + y }

let stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function(x, y) { return x + y }
```

### 10.5 泛型默认值

```typescript
// 泛型默认类型
interface Container<T = string> {
  value: T
}

let container1: Container = { value: 'hello' }  // T默认为string
let container2: Container<number> = { value: 123 }

// 函数泛型默认值
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value)
}
```

### 10.6 泛型工具

```typescript
// 条件类型中的泛型
type NonNullable<T> = T extends null | undefined ? never : T

// 映射类型中的泛型
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

// infer关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Func = () => string
type FuncReturn = ReturnType<Func>  // string
```

---

## 十一、类型断言

### 11.1 基础类型断言

```typescript
// as语法（推荐）
let someValue: unknown = 'this is a string'
let strLength: number = (someValue as string).length

// 尖括号语法（在JSX中不能使用）
let strLength2: number = (<string>someValue).length

// 断言为更具体的类型
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement

// 断言为更宽泛的类型
const a = (expr as any) as T  // 双重断言
```

### 11.2 非空断言

```typescript
// 非空断言操作符 !
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed())  // 断言x不是null或undefined
}

// 确定赋值断言
let x!: number
initialize()
console.log(x.toFixed())  // ok - 断言x已被赋值

function initialize() {
  x = 10
}
```

### 11.3 const断言

```typescript
// 字面量类型
let x = 'hello' as const  // 类型为'hello'

// 对象const断言
let point = { x: 10, y: 20 } as const
// 类型为{ readonly x: 10; readonly y: 20 }

// 数组const断言
let arr = [1, 2, 3] as const
// 类型为readonly [1, 2, 3]

// 使用场景
function handleRequest(url: string, method: 'GET' | 'POST') {}

const req = { url: 'https://example.com', method: 'GET' } as const
handleRequest(req.url, req.method)  // ok
```

### 11.4 类型断言的限制

```typescript
// 类型断言只能在"兼容"的类型之间进行
const x = 'hello' as number  // 错误：string和number不兼容

// 可以通过unknown或any中转
const y = 'hello' as unknown as number  // ok（但运行时会出错）

// 不建议的做法
const a = 123 as any as string

// 类型断言不会改变运行时行为
const canvas = document.getElementById('canvas') as HTMLCanvasElement
// 如果元素不存在或不是canvas，运行时会出错
```

---

## 十二、类型守卫

### 12.1 typeof类型守卫

```typescript
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === 'number') {
    // 这里padding的类型收窄为number
    return ' '.repeat(padding) + value
  }
  // 这里padding的类型收窄为string
  return padding + value
}

// typeof可以检测的类型
// 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'
```

### 12.2 instanceof类型守卫

```typescript
class Bird {
  fly() {
    console.log('flying')
  }
}

class Fish {
  swim() {
    console.log('swimming')
  }
}

function move(pet: Bird | Fish) {
  if (pet instanceof Bird) {
    pet.fly()  // pet的类型收窄为Bird
  } else {
    pet.swim()  // pet的类型收窄为Fish
  }
}
```

### 12.3 in类型守卫

```typescript
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function move(pet: Bird | Fish) {
  if ('fly' in pet) {
    pet.fly()  // pet的类型收窄为Bird
  } else {
    pet.swim()  // pet的类型收窄为Fish
  }
}
```

### 12.4 自定义类型守卫

```typescript
// 类型谓词
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim()  // pet的类型收窄为Fish
  } else {
    pet.fly()   // pet的类型收窄为Bird
  }
}

// 断言函数
function assertIsFish(pet: Fish | Bird): asserts pet is Fish {
  if ((pet as Fish).swim === undefined) {
    throw new Error('Not a fish!')
  }
}

function move2(pet: Fish | Bird) {
  assertIsFish(pet)
  pet.swim()  // pet的类型收窄为Fish
}

// 非空断言函数
function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined')
  }
}
```

### 12.5 可辨识联合

```typescript
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

interface Triangle {
  kind: 'triangle'
  base: number
  height: number
}

type Shape = Circle | Square | Triangle

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    case 'triangle':
      return (shape.base * shape.height) / 2
    default:
      // 穷尽检查
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}
```

---

## 十三、高级类型

### 13.1 条件类型

```typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// 条件类型与联合类型
type ToArray<T> = T extends any ? T[] : never

type StrOrNumArray = ToArray<string | number>  // string[] | number[]

// 条件类型与never
type NonNullable<T> = T extends null | undefined ? never : T

type Result = NonNullable<string | null | undefined>  // string

// infer关键字 - 类型推断
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Func = () => string
type FuncReturn = ReturnType<Func>  // string

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never

type Arr = string[]
type El = ElementType<Arr>  // string

// 提取Promise值类型
type Awaited<T> = T extends Promise<infer U> ? U : T

type P = Promise<string>
type PValue = Awaited<P>  // string
```

### 13.2 映射类型

```typescript
// 基础映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 使用
interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
// { readonly name: string; readonly age: number }

type PartialUser = Partial<User>
// { name?: string; age?: number }

// 映射修饰符
type CreateMutable<T> = {
  -readonly [P in keyof T]: T[P]  // 移除readonly
}

type Required<T> = {
  [P in keyof T]-?: T[P]  // 移除可选
}

// 键重映射 (TS 4.1+)
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }

// 过滤键
type RemoveKind<T> = {
  [P in keyof T as Exclude<P, 'kind'>]: T[P]
}
```

### 13.3 模板字面量类型

```typescript
// 基础模板字面量
type World = 'world'
type Greeting = `hello ${World}`  // 'hello world'

// 联合类型展开
type EmailLocaleIDs = 'welcome_email' | 'email_heading'
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff'

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`
// 'welcome_email_id' | 'email_heading_id' | 'footer_title_id' | 'footer_sendoff_id'

// 多个联合类型
type Lang = 'en' | 'zh'
type AllIDs = `${Lang}_${AllLocaleIDs}`

// 内置字符串操作类型
type Upper = Uppercase<'hello'>      // 'HELLO'
type Lower = Lowercase<'HELLO'>      // 'hello'
type Cap = Capitalize<'hello'>       // 'Hello'
type Uncap = Uncapitalize<'Hello'>   // 'hello'

// 实际应用 - 事件处理
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void
}

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>

const person = makeWatchedObject({
  firstName: 'John',
  lastName: 'Doe',
  age: 26
})

person.on('firstNameChanged', (newValue) => {
  // newValue的类型被推断为string
  console.log(`firstName was changed to ${newValue}!`)
})
```

### 13.4 索引访问类型

```typescript
type Person = {
  name: string
  age: number
  address: {
    city: string
    country: string
  }
}

// 获取属性类型
type Name = Person['name']  // string
type Age = Person['age']    // number
type Address = Person['address']  // { city: string; country: string }
type City = Person['address']['city']  // string

// 使用联合类型获取多个属性
type NameOrAge = Person['name' | 'age']  // string | number

// 使用keyof
type PersonValues = Person[keyof Person]
// string | number | { city: string; country: string }

// 数组元素类型
const MyArray = [
  { name: 'Alice', age: 15 },
  { name: 'Bob', age: 23 },
  { name: 'Eve', age: 38 }
]

type Person2 = typeof MyArray[number]
// { name: string; age: number }

type Age2 = typeof MyArray[number]['age']
// number
```

---

## 十四、内置工具类型

### 14.1 Partial和Required

```typescript
// Partial<T> - 所有属性变为可选
interface User {
  name: string
  age: number
  email: string
}

type PartialUser = Partial<User>
// { name?: string; age?: number; email?: string }

// Required<T> - 所有属性变为必需
interface Props {
  name?: string
  age?: number
}

type RequiredProps = Required<Props>
// { name: string; age: number }
```

### 14.2 Readonly和Record

```typescript
// Readonly<T> - 所有属性变为只读
interface Todo {
  title: string
  completed: boolean
}

type ReadonlyTodo = Readonly<Todo>
// { readonly title: string; readonly completed: boolean }

// Record<K, T> - 创建键类型为K，值类型为T的对象类型
type PageInfo = {
  title: string
}

type Page = 'home' | 'about' | 'contact'

const nav: Record<Page, PageInfo> = {
  home: { title: 'Home' },
  about: { title: 'About' },
  contact: { title: 'Contact' }
}

// 使用Record创建字典
type Dictionary<T> = Record<string, T>
const dict: Dictionary<number> = {
  apple: 1,
  banana: 2
}
```

### 14.3 Pick和Omit

```typescript
interface User {
  id: number
  name: string
  age: number
  email: string
}

// Pick<T, K> - 从T中选取指定属性
type UserBasicInfo = Pick<User, 'id' | 'name'>
// { id: number; name: string }

// Omit<T, K> - 从T中排除指定属性
type UserWithoutEmail = Omit<User, 'email'>
// { id: number; name: string; age: number }

// 组合使用
type PublicUser = Omit<User, 'id'> & { id: string }
// { name: string; age: number; email: string; id: string }
```

### 14.4 Exclude和Extract

```typescript
// Exclude<T, U> - 从T中排除可赋值给U的类型
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// 'b' | 'c'

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// 'c'

type T2 = Exclude<string | number | (() => void), Function>
// string | number

// Extract<T, U> - 从T中提取可赋值给U的类型
type T3 = Extract<'a' | 'b' | 'c', 'a' | 'f'>
// 'a'

type T4 = Extract<string | number | (() => void), Function>
// () => void
```

### 14.5 NonNullable和ReturnType

```typescript
// NonNullable<T> - 从T中排除null和undefined
type T0 = NonNullable<string | number | undefined>
// string | number

type T1 = NonNullable<string[] | null | undefined>
// string[]

// ReturnType<T> - 获取函数返回类型
function f1() {
  return { a: 1, b: '' }
}

type T2 = ReturnType<typeof f1>
// { a: number; b: string }

type T3 = ReturnType<() => string>
// string

type T4 = ReturnType<(s: string) => void>
// void
```

### 14.6 Parameters和ConstructorParameters

```typescript
// Parameters<T> - 获取函数参数类型元组
type Func = (a: string, b: number) => void
type Params = Parameters<Func>
// [a: string, b: number]

function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age} years old`
}
type GreetParams = Parameters<typeof greet>
// [name: string, age: number]

// ConstructorParameters<T> - 获取构造函数参数类型元组
class Person {
  constructor(name: string, age: number) {}
}

type PersonParams = ConstructorParameters<typeof Person>
// [name: string, age: number]
```

### 14.7 InstanceType和ThisParameterType

```typescript
// InstanceType<T> - 获取构造函数实例类型
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

type PersonInstance = InstanceType<typeof Person>
// Person

// ThisParameterType<T> - 获取函数this参数类型
function toHex(this: Number) {
  return this.toString(16)
}

type ThisType = ThisParameterType<typeof toHex>
// Number

// OmitThisParameter<T> - 移除函数的this参数
type OmittedThis = OmitThisParameter<typeof toHex>
// () => string
```

### 14.8 Awaited

```typescript
// Awaited<T> - 获取Promise的解析类型 (TS 4.5+)
type A = Awaited<Promise<string>>
// string

type B = Awaited<Promise<Promise<number>>>
// number

type C = Awaited<boolean | Promise<number>>
// boolean | number
```

---

## 十五、模块与命名空间

### 15.1 ES模块

```typescript
// math.ts - 导出
export function add(a: number, b: number): number {
  return a + b
}

export const PI = 3.14159

export interface Point {
  x: number
  y: number
}

export class Calculator {
  add(a: number, b: number) {
    return a + b
  }
}

// 默认导出
export default class DefaultClass {}

// 重新导出
export { add as sum } from './other'
export * from './utils'
export * as utils from './utils'  // 命名空间导出
```

```typescript
// app.ts - 导入
import { add, PI, Point, Calculator } from './math'
import DefaultClass from './math'
import * as math from './math'
import type { Point } from './math'  // 类型导入

// 使用
const result = add(1, 2)
console.log(PI)
const point: Point = { x: 0, y: 0 }
const calc = new Calculator()
```

### 15.2 类型导入导出

```typescript
// 类型导出
export type ID = number | string
export interface User {
  id: ID
  name: string
}

// 类型导入
import type { User, ID } from './types'

// 混合导入
import { someValue, type SomeType } from './module'

// 导出时区分类型
export { type User, createUser }
```

### 15.3 命名空间

```typescript
// 命名空间（主要用于类型声明）
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }
  
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return /^[A-Za-z]+$/.test(s)
    }
  }
  
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return /^\d{5}$/.test(s)
    }
  }
}

// 使用
let validator: Validation.StringValidator
validator = new Validation.LettersOnlyValidator()

// 命名空间别名
import Validators = Validation

// 嵌套命名空间
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

let sq = new Shapes.Polygons.Square()
```

### 15.4 模块解析

```typescript
// tsconfig.json中的模块解析配置
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",  // node, classic, bundler
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"]
    }
  }
}

// 使用路径别名
import { Button } from '@/components/Button'
import { utils } from '@components/utils'
```

---

## 十六、装饰器

### 16.1 类装饰器

```typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return 'Hello, ' + this.greeting
  }
}

// 装饰器工厂
function color(value: string) {
  return function(constructor: Function) {
    constructor.prototype.color = value
  }
}

@color('red')
class Car {
  // ...
}

// 替换构造函数
function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    newProperty = 'new property'
    hello = 'override'
  }
}

@classDecorator
class Greeter2 {
  property = 'property'
  hello: string
  constructor(m: string) {
    this.hello = m
  }
}
```

### 16.2 方法装饰器

```typescript
function enumerable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value
  }
}

function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args)
    const result = originalMethod.apply(this, args)
    console.log(`Result:`, result)
    return result
  }
  
  return descriptor
}

class Calculator {
  @log
  @enumerable(false)
  add(a: number, b: number): number {
    return a + b
  }
}
```

### 16.3 属性装饰器

```typescript
function format(formatString: string) {
  return function(target: any, propertyKey: string) {
    let value: string
    
    const getter = function() {
      return value
    }
    
    const setter = function(newVal: string) {
      value = formatString.replace('%s', newVal)
    }
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    })
  }
}

class Greeter3 {
  @format('Hello, %s')
  greeting: string
  
  constructor(greeting: string) {
    this.greeting = greeting
  }
}

const g = new Greeter3('world')
console.log(g.greeting)  // Hello, world
```

### 16.4 参数装饰器

```typescript
function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  // 存储必需参数的索引
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata('required', target, propertyKey) || []
  existingRequiredParameters.push(parameterIndex)
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey)
}

class BugReport {
  title: string
  
  constructor(title: string) {
    this.title = title
  }
  
  print(@required verbose: boolean) {
    if (verbose) {
      return `Title: ${this.title}`
    }
    return this.title
  }
}
```

### 16.5 装饰器执行顺序

```typescript
// 执行顺序：
// 1. 参数装饰器 -> 方法装饰器 -> 访问器装饰器 -> 属性装饰器 -> 类装饰器
// 2. 同类装饰器：从下到上执行
// 3. 装饰器工厂：从上到下求值，从下到上执行

function first() {
  console.log('first(): evaluated')
  return function(target: any, propertyKey: string) {
    console.log('first(): called')
  }
}

function second() {
  console.log('second(): evaluated')
  return function(target: any, propertyKey: string) {
    console.log('second(): called')
  }
}

class ExampleClass {
  @first()
  @second()
  method() {}
}

// 输出:
// first(): evaluated
// second(): evaluated
// second(): called
// first(): called
```

---

## 十七、声明文件

### 17.1 声明文件基础

```typescript
// types.d.ts
// 声明全局变量
declare var jQuery: (selector: string) => any

// 声明全局函数
declare function greet(name: string): void

// 声明全局类
declare class Animal {
  name: string
  constructor(name: string)
  sayHello(): void
}

// 声明全局接口（自动合并）
interface Window {
  myCustomProperty: string
}

// 声明全局命名空间
declare namespace MyLib {
  function makeGreeting(s: string): string
  let numberOfGreetings: number
}
```

### 17.2 模块声明

```typescript
// module.d.ts
declare module 'my-module' {
  export function doSomething(value: string): void
  export class MyClass {
    constructor(name: string)
    getName(): string
  }
  export interface MyInterface {
    name: string
    age: number
  }
}

// 使用
import { doSomething, MyClass, MyInterface } from 'my-module'

// 扩展已有模块
declare module 'express' {
  interface Request {
    user?: {
      id: string
      name: string
    }
  }
}

// 通配符模块声明
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.json' {
  const value: any
  export default value
}
```

### 17.3 三斜线指令

```typescript
// 引用声明文件
/// <reference path="./types.d.ts" />

// 引用@types包
/// <reference types="node" />

// 引用库
/// <reference lib="es2015" />
/// <reference lib="dom" />
```

### 17.4 声明合并

```typescript
// 接口合并
interface Box {
  height: number
  width: number
}

interface Box {
  scale: number
}

// Box现在有height, width, scale三个属性

// 命名空间与类合并
class Album {
  label: Album.AlbumLabel
}

namespace Album {
  export class AlbumLabel {}
}

// 命名空间与函数合并
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix
}

namespace buildLabel {
  export let suffix = ''
  export let prefix = 'Hello, '
}

// 命名空间与枚举合并
enum Color {
  red = 1,
  green = 2,
  blue = 4
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName === 'yellow') {
      return Color.red + Color.green
    }
    // ...
  }
}
```

---

## 十八、tsconfig配置

### 18.1 基础配置

```json
{
  "compilerOptions": {
    // 目标JavaScript版本
    "target": "ES2020",
    
    // 模块系统
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // 输出目录
    "outDir": "./dist",
    "rootDir": "./src",
    
    // 生成声明文件
    "declaration": true,
    "declarationDir": "./types",
    
    // 生成source map
    "sourceMap": true,
    
    // 严格模式
    "strict": true,
    
    // 允许导入JSON
    "resolveJsonModule": true,
    
    // ES模块互操作
    "esModuleInterop": true,
    
    // 跳过库检查
    "skipLibCheck": true,
    
    // 强制文件名大小写一致
    "forceConsistentCasingInFileNames": true
  },
  
  // 包含的文件
  "include": ["src/**/*"],
  
  // 排除的文件
  "exclude": ["node_modules", "dist"],
  
  // 引用其他配置
  "extends": "./tsconfig.base.json"
}
```

### 18.2 严格模式选项

```json
{
  "compilerOptions": {
    "strict": true,  // 开启所有严格检查
    
    // 或单独配置
    "noImplicitAny": true,            // 禁止隐式any
    "strictNullChecks": true,         // 严格null检查
    "strictFunctionTypes": true,      // 严格函数类型
    "strictBindCallApply": true,      // 严格bind/call/apply
    "strictPropertyInitialization": true,  // 严格属性初始化
    "noImplicitThis": true,           // 禁止隐式this
    "useUnknownInCatchVariables": true,    // catch变量为unknown
    "alwaysStrict": true              // 始终严格模式
  }
}
```

### 18.3 模块相关选项

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // 路径映射
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    },
    
    // 类型根目录
    "typeRoots": ["./node_modules/@types", "./types"],
    
    // 指定类型包
    "types": ["node", "jest"],
    
    // 允许合成默认导出
    "allowSyntheticDefaultImports": true,
    
    // ES模块互操作
    "esModuleInterop": true
  }
}
```

### 18.4 项目引用

```json
// tsconfig.json (根目录)
{
  "files": [],
  "references": [
    { "path": "./packages/common" },
    { "path": "./packages/client" },
    { "path": "./packages/server" }
  ]
}

// packages/common/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

// packages/client/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../common" }
  ],
  "include": ["src/**/*"]
}
```

---

## 十九、常见技巧与最佳实践

### 19.1 类型收窄技巧

```typescript
// 1. typeof收窄
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

// 2. in收窄
interface Bird { fly(): void }
interface Fish { swim(): void }

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly()
  } else {
    animal.swim()
  }
}

// 3. instanceof收窄
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toISOString())
  } else {
    console.log(x.toUpperCase())
  }
}

// 4. 自定义类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// 5. 可辨识联合
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data)
  } else {
    console.error(result.error)
  }
}
```

### 19.2 类型推断技巧

```typescript
// 1. 从值推断类型
const config = {
  endpoint: 'https://api.example.com',
  timeout: 3000
} as const

type Config = typeof config
// { readonly endpoint: "https://api.example.com"; readonly timeout: 3000 }

// 2. 从数组推断类型
const colors = ['red', 'green', 'blue'] as const
type Color = typeof colors[number]
// 'red' | 'green' | 'blue'

// 3. 从对象键推断类型
const eventHandlers = {
  click: (e: MouseEvent) => {},
  keydown: (e: KeyboardEvent) => {}
}

type EventName = keyof typeof eventHandlers
// 'click' | 'keydown'

// 4. 从函数返回值推断类型
function createUser() {
  return { id: 1, name: 'John' }
}

type User = ReturnType<typeof createUser>
// { id: number; name: string }

// 5. 从Promise推断类型
async function fetchUser() {
  return { id: 1, name: 'John' }
}

type UserData = Awaited<ReturnType<typeof fetchUser>>
// { id: number; name: string }
```

### 19.3 泛型技巧

```typescript
// 1. 泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// 2. 泛型默认值
function createContainer<T = string>(value: T): { value: T } {
  return { value }
}

// 3. 条件泛型
type ArrayOrSingle<T> = T extends any[] ? T : T[]

type A = ArrayOrSingle<string>    // string[]
type B = ArrayOrSingle<string[]>  // string[]

// 4. 映射泛型
type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

// 5. 递归泛型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 6. 泛型工厂
function createFactory<T>(constructor: new () => T): () => T {
  return () => new constructor()
}
```

### 19.4 实用类型模式

```typescript
// 1. 品牌类型（Branded Types）
type Brand<T, B> = T & { __brand: B }

type USD = Brand<number, 'USD'>
type EUR = Brand<number, 'EUR'>

function createUSD(amount: number): USD {
  return amount as USD
}

function addUSD(a: USD, b: USD): USD {
  return (a + b) as USD
}

// 2. 深度部分类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 3. 路径类型
type Path<T, K extends keyof T> = K extends string
  ? T[K] extends object
    ? `${K}.${Path<T[K], keyof T[K]>}` | K
    : K
  : never

// 4. 函数重载简化
type Overload<A extends any[], R> = (...args: A) => R

type MyFunc = Overload<[string], string> & Overload<[number], number>

// 5. 类型安全的事件发射器
type EventMap = {
  click: MouseEvent
  keydown: KeyboardEvent
  custom: { data: string }
}

class TypedEventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    // ...
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    // ...
  }
}

const emitter = new TypedEventEmitter<EventMap>()
emitter.on('click', (e) => {
  // e的类型是MouseEvent
})
```

### 19.5 最佳实践

```typescript
// 1. 优先使用interface而非type（除非需要联合类型等）
interface User {
  name: string
  age: number
}

// 2. 使用readonly防止意外修改
interface Config {
  readonly apiKey: string
  readonly baseUrl: string
}

// 3. 使用unknown而非any
function parseJSON(str: string): unknown {
  return JSON.parse(str)
}

// 4. 使用类型守卫进行类型收窄
function isError(value: unknown): value is Error {
  return value instanceof Error
}

// 5. 使用const断言获取精确类型
const routes = ['/', '/about', '/contact'] as const

// 6. 使用satisfies操作符（TS 4.9+）
const config = {
  endpoint: 'https://api.example.com',
  timeout: 3000
} satisfies Record<string, string | number>

// 7. 避免使用enum，使用const对象
const Direction = {
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT'
} as const

type Direction = typeof Direction[keyof typeof Direction]

// 8. 使用模板字面量类型增强类型安全
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiPath = `/api/${string}`

function request(method: HttpMethod, path: ApiPath) {
  // ...
}

request('GET', '/api/users')  // ok
// request('GET', '/users')   // 错误
```

---

## 附录：TypeScript常用类型速查

### 内置工具类型

```typescript
// 对象类型
Partial<T>              // 所有属性可选
Required<T>             // 所有属性必需
Readonly<T>             // 所有属性只读
Record<K, T>            // 键类型K，值类型T
Pick<T, K>              // 选取指定属性
Omit<T, K>              // 排除指定属性

// 联合类型
Exclude<T, U>           // 从T中排除U
Extract<T, U>           // 从T中提取U
NonNullable<T>          // 排除null和undefined

// 函数类型
Parameters<T>           // 函数参数类型
ReturnType<T>           // 函数返回类型
ConstructorParameters<T> // 构造函数参数类型
InstanceType<T>         // 实例类型
ThisParameterType<T>    // this参数类型
OmitThisParameter<T>    // 移除this参数

// Promise类型
Awaited<T>              // Promise解析类型

// 字符串类型
Uppercase<S>            // 大写
Lowercase<S>            // 小写
Capitalize<S>           // 首字母大写
Uncapitalize<S>         // 首字母小写
```

### 常用类型定义

```typescript
// 可空类型
type Nullable<T> = T | null

// 可能未定义
type Maybe<T> = T | undefined

// 可空且可能未定义
type Optional<T> = T | null | undefined

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 异步函数类型
type AsyncFunction<T> = () => Promise<T>

// 回调函数类型
type Callback<T> = (error: Error | null, result: T) => void

// 字典类型
type Dictionary<T> = Record<string, T>

// 数组元素类型
type ArrayElement<T> = T extends (infer E)[] ? E : never
```

---

以上是TypeScript完整语法详解，涵盖了所有核心概念和实用示例。
