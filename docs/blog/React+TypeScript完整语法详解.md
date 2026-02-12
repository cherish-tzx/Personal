# React + TypeScript 完整语法详解
<div class="doc-toc">
## 目录
1. [环境搭建](#1-环境搭建)
2. [基础类型定义](#2-基础类型定义)
3. [函数组件类型](#3-函数组件类型)
4. [类组件类型](#4-类组件类型)
5. [Props 类型定义](#5-props-类型定义)
6. [State 类型定义](#6-state-类型定义)
7. [Hooks 类型](#7-hooks-类型)
8. [事件处理类型](#8-事件处理类型)
9. [表单类型](#9-表单类型)
10. [Refs 类型](#10-refs-类型)
11. [Context 类型](#11-context-类型)
12. [高阶组件类型](#12-高阶组件类型)
13. [泛型组件](#13-泛型组件)
14. [条件类型与映射类型](#14-条件类型与映射类型)
15. [第三方库类型](#15-第三方库类型)
16. [类型工具函数](#16-类型工具函数)
17. [常见类型问题解决](#17-常见类型问题解决)


</div>

---

## 1. 环境搭建

### 1.1 创建 TypeScript React 项目

```bash
# Create React App
npx create-react-app my-app --template typescript

# Vite (推荐)
npm create vite@latest my-app -- --template react-ts

# Next.js
npx create-next-app@latest my-app --typescript
```

### 1.2 tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* React 相关 */
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    /* 路径别名 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.3 安装类型声明

```bash
# React 类型（React 18 已内置）
npm install --save-dev @types/react @types/react-dom

# 常用库类型
npm install --save-dev @types/node
npm install --save-dev @types/lodash
```

---

## 2. 基础类型定义

### 2.1 基本类型

```typescript
// 基本类型
const name: string = '张三';
const age: number = 25;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// 数组
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b', 'c'];

// 元组
const tuple: [string, number] = ['张三', 25];
const namedTuple: [name: string, age: number] = ['张三', 25];

// 对象
const user: { name: string; age: number } = {
  name: '张三',
  age: 25
};

// 联合类型
const id: string | number = '123';

// 字面量类型
const direction: 'left' | 'right' | 'up' | 'down' = 'left';

// any 和 unknown
const anyValue: any = 'anything';
const unknownValue: unknown = 'anything';

// void 和 never
function logMessage(msg: string): void {
  console.log(msg);
}

function throwError(msg: string): never {
  throw new Error(msg);
}
```

### 2.2 接口定义

```typescript
// 基本接口
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 接口继承
interface Admin extends User {
  role: 'admin' | 'super-admin';
  permissions: string[];
}

// 多接口继承
interface SuperAdmin extends User, Permissions {
  level: number;
}

// 索引签名
interface StringMap {
  [key: string]: string;
}

interface NumberMap {
  [key: number]: string;
}

// 函数类型接口
interface SearchFunc {
  (source: string, keyword: string): boolean;
}

// 可调用接口
interface Callable {
  (): void;
  (arg: string): string;
}

// 构造函数接口
interface Constructor {
  new (name: string): User;
}
```

### 2.3 类型别名

```typescript
// 基本类型别名
type ID = string | number;
type Name = string;

// 对象类型别名
type Point = {
  x: number;
  y: number;
};

// 联合类型
type Status = 'pending' | 'success' | 'error';

// 交叉类型
type Employee = User & {
  department: string;
  salary: number;
};

// 函数类型
type Handler = (event: Event) => void;
type AsyncHandler = (event: Event) => Promise<void>;

// 泛型类型别名
type Response<T> = {
  data: T;
  status: number;
  message: string;
};

// 递归类型
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
```

### 2.4 枚举

```typescript
// 数字枚举
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

// 字符串枚举
enum Status {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Error = 'ERROR'
}

// 常量枚举（编译时内联）
const enum Color {
  Red = '#FF0000',
  Green = '#00FF00',
  Blue = '#0000FF'
}

// 使用
const dir: Direction = Direction.Up;
const status: Status = Status.Pending;
const color: Color = Color.Red;
```

---

## 3. 函数组件类型

### 3.1 基本函数组件

```typescript
import React from 'react';

// 方式1：使用 React.FC（函数组件类型）
const Welcome: React.FC<{ name: string }> = ({ name }) => {
  return <h1>Hello, {name}</h1>;
};

// 方式2：直接定义 props 类型（推荐）
interface WelcomeProps {
  name: string;
  age?: number;
}

function Welcome({ name, age }: WelcomeProps) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// 方式3：箭头函数
const Welcome = ({ name, age }: WelcomeProps): JSX.Element => {
  return <h1>Hello, {name}</h1>;
};

// 方式4：使用 ReactNode 返回类型
const Welcome = ({ name }: WelcomeProps): React.ReactNode => {
  return <h1>Hello, {name}</h1>;
};
```

### 3.2 React.FC vs 普通函数

```typescript
// React.FC 的特点
// 1. 自动包含 children（React 18 已移除）
// 2. 不支持泛型
// 3. 包含 displayName, defaultProps 等静态属性

// React.FC 示例
const Card: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// 普通函数组件（推荐）
interface CardProps {
  title: string;
  children?: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// 泛型函数组件（React.FC 不支持）
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

### 3.3 children 类型

```typescript
interface ContainerProps {
  // 单个 React 元素
  children: React.ReactElement;
}

interface ContainerProps {
  // 任意可渲染内容
  children: React.ReactNode;
}

interface ContainerProps {
  // 字符串
  children: string;
}

interface ContainerProps {
  // 多个元素
  children: React.ReactElement[];
}

interface ContainerProps {
  // 函数作为子元素
  children: (data: { count: number }) => React.ReactNode;
}

// 使用 PropsWithChildren
import { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren<{
  title: string;
}>;

function Container({ title, children }: ContainerProps) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

---

## 4. 类组件类型

### 4.1 基本类组件

```typescript
import React, { Component } from 'react';

// Props 和 State 类型
interface CounterProps {
  initialCount?: number;
  step?: number;
}

interface CounterState {
  count: number;
}

// 类组件
class Counter extends Component<CounterProps, CounterState> {
  // 默认 props
  static defaultProps: Partial<CounterProps> = {
    initialCount: 0,
    step: 1
  };

  // 构造函数
  constructor(props: CounterProps) {
    super(props);
    this.state = {
      count: props.initialCount || 0
    };
  }

  // 方法
  increment = (): void => {
    this.setState((prevState) => ({
      count: prevState.count + (this.props.step || 1)
    }));
  };

  decrement = (): void => {
    this.setState((prevState) => ({
      count: prevState.count - (this.props.step || 1)
    }));
  };

  // 生命周期
  componentDidMount(): void {
    console.log('组件已挂载');
  }

  componentDidUpdate(prevProps: CounterProps, prevState: CounterState): void {
    if (prevState.count !== this.state.count) {
      console.log('计数已更新:', this.state.count);
    }
  }

  componentWillUnmount(): void {
    console.log('组件将卸载');
  }

  // 渲染
  render(): React.ReactNode {
    return (
      <div>
        <p>计数: {this.state.count}</p>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    );
  }
}
```

### 4.2 生命周期类型

```typescript
class LifecycleComponent extends Component<Props, State> {
  // 挂载阶段
  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromProps(
    props: Props,
    state: State
  ): Partial<State> | null {
    return null;
  }

  componentDidMount(): void {}

  // 更新阶段
  shouldComponentUpdate(
    nextProps: Props,
    nextState: State
  ): boolean {
    return true;
  }

  getSnapshotBeforeUpdate(
    prevProps: Props,
    prevState: State
  ): SnapshotType | null {
    return null;
  }

  componentDidUpdate(
    prevProps: Props,
    prevState: State,
    snapshot?: SnapshotType
  ): void {}

  // 卸载阶段
  componentWillUnmount(): void {}

  // 错误处理
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    return <div />;
  }
}
```

---

## 5. Props 类型定义

### 5.1 基本 Props

```typescript
interface UserCardProps {
  // 必需属性
  id: number;
  name: string;
  
  // 可选属性
  age?: number;
  email?: string;
  
  // 只读属性
  readonly createdAt: Date;
  
  // 联合类型
  status: 'active' | 'inactive' | 'pending';
  
  // 对象类型
  address: {
    city: string;
    country: string;
  };
  
  // 数组类型
  tags: string[];
  
  // 函数类型
  onClick: () => void;
  onNameChange: (name: string) => void;
  
  // 泛型函数
  onSelect: <T>(item: T) => void;
}
```

### 5.2 复杂 Props 类型

```typescript
// 回调函数 Props
interface CallbackProps {
  onSuccess: (data: ResponseData) => void;
  onError: (error: Error) => void;
  onComplete?: () => void;
}

// 样式 Props
interface StyleProps {
  style?: React.CSSProperties;
  className?: string;
}

// 渲染 Props
interface RenderProps {
  renderHeader: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  renderItem: (item: Item, index: number) => React.ReactNode;
}

// 组合 Props
interface ComponentProps extends StyleProps, CallbackProps {
  title: string;
  children: React.ReactNode;
}

// 泛型 Props
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string | number;
}

// 使用泛型组件
function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select
      value={String(getValue(value))}
      onChange={(e) => {
        const selected = options.find(
          (opt) => String(getValue(opt)) === e.target.value
        );
        if (selected) onChange(selected);
      }}
    >
      {options.map((option) => (
        <option key={String(getValue(option))} value={String(getValue(option))}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
```

### 5.3 Props 默认值

```typescript
// 函数组件默认值
interface ButtonProps {
  type?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
}

// 方式1：解构默认值（推荐）
function Button({
  type = 'primary',
  size = 'medium',
  disabled = false,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${type} btn-${size}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// 方式2：defaultProps（不推荐用于函数组件）
Button.defaultProps = {
  type: 'primary',
  size: 'medium',
  disabled: false
};

// 类组件默认值
class Button extends Component<ButtonProps> {
  static defaultProps: Partial<ButtonProps> = {
    type: 'primary',
    size: 'medium',
    disabled: false
  };

  render() {
    const { type, size, disabled, children } = this.props;
    return (
      <button className={`btn btn-${type} btn-${size}`} disabled={disabled}>
        {children}
      </button>
    );
  }
}
```

### 5.4 Props 扩展

```typescript
// 扩展原生 HTML 属性
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

function Button({ variant = 'primary', loading, children, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} disabled={loading} {...rest}>
      {loading ? 'Loading...' : children}
    </button>
  );
}

// 扩展 input 属性
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({ label, error, ...rest }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...rest} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// 组件属性类型提取
type ButtonNativeProps = React.ComponentProps<'button'>;
type DivProps = React.ComponentProps<'div'>;
type InputNativeProps = React.ComponentProps<'input'>;

// 提取自定义组件的 Props
type MyComponentProps = React.ComponentProps<typeof MyComponent>;
```

---

## 6. State 类型定义

### 6.1 useState 类型

```typescript
import { useState } from 'react';

// 自动推断类型
const [count, setCount] = useState(0);  // number
const [name, setName] = useState('');   // string
const [isOpen, setIsOpen] = useState(false);  // boolean

// 显式指定类型
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

// 复杂对象类型
interface FormState {
  name: string;
  email: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
}

const [form, setForm] = useState<FormState>({
  name: '',
  email: '',
  age: 0,
  address: {
    city: '',
    country: ''
  }
});

// 更新状态
setForm(prev => ({
  ...prev,
  name: 'John',
  address: {
    ...prev.address,
    city: 'New York'
  }
}));

// 惰性初始化
const [state, setState] = useState<ExpensiveState>(() => {
  return computeExpensiveValue();
});
```

### 6.2 useReducer 类型

```typescript
import { useReducer } from 'react';

// State 类型
interface CounterState {
  count: number;
  step: number;
}

// Action 类型（使用联合类型）
type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_COUNT'; payload: number };

// Reducer 函数
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_COUNT':
      return { ...state, count: action.payload };
    default:
      return state;
  }
}

// 初始状态
const initialState: CounterState = {
  count: 0,
  step: 1
};

// 使用 useReducer
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'SET_COUNT', payload: 100 })}>
        Set to 100
      </button>
    </div>
  );
}

// 惰性初始化
function init(initialCount: number): CounterState {
  return { count: initialCount, step: 1 };
}

const [state, dispatch] = useReducer(counterReducer, 10, init);
```

### 6.3 复杂 Action 类型模式

```typescript
// 使用 discriminated union 模式
interface FetchAction<T> {
  type: 'FETCH_START';
}

interface FetchSuccessAction<T> {
  type: 'FETCH_SUCCESS';
  payload: T;
}

interface FetchErrorAction {
  type: 'FETCH_ERROR';
  payload: Error;
}

type AsyncAction<T> = FetchAction<T> | FetchSuccessAction<T> | FetchErrorAction;

// 通用异步状态
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
```

---

## 7. Hooks 类型

### 7.1 useState 类型详解

```typescript
// 类型推断
const [count, setCount] = useState(0);

// 显式类型
const [user, setUser] = useState<User | null>(null);

// 联合类型
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');

// 复杂类型
interface State {
  items: Item[];
  selectedId: number | null;
}
const [state, setState] = useState<State>({
  items: [],
  selectedId: null
});
```

### 7.2 useEffect 类型

```typescript
import { useEffect } from 'react';

// 基本用法
useEffect(() => {
  console.log('Effect');
}, []);

// 带清理函数
useEffect(() => {
  const handler = (e: MouseEvent) => {
    console.log(e.clientX, e.clientY);
  };
  
  window.addEventListener('mousemove', handler);
  
  return () => {
    window.removeEventListener('mousemove', handler);
  };
}, []);

// 异步 effect（需要额外处理）
useEffect(() => {
  let cancelled = false;
  
  const fetchData = async () => {
    const result = await api.getData();
    if (!cancelled) {
      setData(result);
    }
  };
  
  fetchData();
  
  return () => {
    cancelled = true;
  };
}, []);
```

### 7.3 useContext 类型

```typescript
import { createContext, useContext } from 'react';

// 定义 Context 类型
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 创建 Context（使用 null 或默认值）
const AuthContext = createContext<AuthContextType | null>(null);

// 或者提供默认值
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false
});

// 自定义 Hook 确保类型安全
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Provider 组件
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const value: AuthContextType = {
    user,
    login: async (credentials) => {
      const user = await authApi.login(credentials);
      setUser(user);
    },
    logout: () => setUser(null),
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 7.4 useRef 类型

```typescript
import { useRef, useEffect } from 'react';

// DOM 元素引用
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);

// 使用
useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
}, []);

// 可变值引用
const countRef = useRef<number>(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);

// 存储上一次的值
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// 组件实例引用
interface ChildRef {
  focus: () => void;
  reset: () => void;
}
const childRef = useRef<ChildRef>(null);
```

### 7.5 useCallback 类型

```typescript
import { useCallback } from 'react';

// 自动推断类型
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// 显式类型
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
}, []);

// 带参数的回调
const handleSelect = useCallback((id: number, name: string) => {
  setSelected({ id, name });
}, []);

// 泛型回调
const handleItemClick = useCallback(<T extends { id: number }>(item: T) => {
  console.log(item.id);
}, []);
```

### 7.6 useMemo 类型

```typescript
import { useMemo } from 'react';

// 自动推断类型
const doubled = useMemo(() => count * 2, [count]);

// 显式类型
const sortedItems = useMemo<Item[]>(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// 复杂计算
interface Statistics {
  total: number;
  average: number;
  max: number;
  min: number;
}

const statistics = useMemo<Statistics>(() => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const average = total / items.length;
  const max = Math.max(...items.map(item => item.value));
  const min = Math.min(...items.map(item => item.value));
  return { total, average, max, min };
}, [items]);
```

### 7.7 useImperativeHandle 类型

```typescript
import { useImperativeHandle, forwardRef, useRef } from 'react';

// 定义暴露的方法类型
interface InputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
}

interface InputProps {
  label: string;
}

// 使用 forwardRef
const CustomInput = forwardRef<InputHandle, InputProps>(
  ({ label }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
      getValue: () => {
        return inputRef.current?.value || '';
      }
    }));

    return (
      <div>
        <label>{label}</label>
        <input ref={inputRef} />
      </div>
    );
  }
);

// 使用
function Parent() {
  const inputRef = useRef<InputHandle>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <CustomInput ref={inputRef} label="Name" />
      <button onClick={handleClick}>Focus</button>
    </div>
  );
}
```

---

## 8. 事件处理类型

### 8.1 常用事件类型

```typescript
// 鼠标事件
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.clientX, e.clientY);
};

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  console.log(e.pageX, e.pageY);
};

// 键盘事件
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    console.log('Enter pressed');
  }
};

// 表单事件
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log('Form submitted');
};

// 焦点事件
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log('Focused');
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log('Blurred');
};

// 触摸事件
const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  console.log(e.touches[0].clientX);
};

// 拖拽事件
const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
  e.dataTransfer.setData('text/plain', 'data');
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
};

// 滚动事件
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  console.log(e.currentTarget.scrollTop);
};

// 动画事件
const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
  console.log(e.animationName);
};

// 过渡事件
const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
  console.log(e.propertyName);
};
```

### 8.2 事件处理函数类型

```typescript
// 定义事件处理函数类型
type ClickHandler = React.MouseEventHandler<HTMLButtonElement>;
type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
type SubmitHandler = React.FormEventHandler<HTMLFormElement>;
type KeyboardHandler = React.KeyboardEventHandler<HTMLInputElement>;

// 使用类型
const handleClick: ClickHandler = (e) => {
  console.log(e.currentTarget.name);
};

const handleChange: ChangeHandler = (e) => {
  console.log(e.target.value);
};

// 在 Props 中使用
interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onHover?: React.MouseEventHandler<HTMLButtonElement>;
}

interface InputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
```

### 8.3 自定义事件

```typescript
// 自定义事件数据
interface CustomEventData {
  id: number;
  value: string;
}

// 自定义事件处理器
type CustomEventHandler = (data: CustomEventData) => void;

// Props 定义
interface ComponentProps {
  onCustomEvent: CustomEventHandler;
}

// 使用
function Component({ onCustomEvent }: ComponentProps) {
  const handleClick = () => {
    onCustomEvent({ id: 1, value: 'test' });
  };

  return <button onClick={handleClick}>Trigger</button>;
}

// 合成自定义事件类型
interface ItemSelectEvent {
  item: Item;
  index: number;
  source: 'click' | 'keyboard';
}

type ItemSelectHandler = (event: ItemSelectEvent) => void;
```

---

## 9. 表单类型

### 9.1 表单输入类型

```typescript
// Input 类型
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;
  
  if (type === 'checkbox') {
    setFormData(prev => ({ ...prev, [name]: checked }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

// Textarea 类型
const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setFormData(prev => ({ ...prev, description: e.target.value }));
};

// Select 类型
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setFormData(prev => ({ ...prev, category: e.target.value }));
};

// 通用处理器
type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const handleChange = (e: React.ChangeEvent<FormElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

### 9.2 完整表单示例

```typescript
interface FormData {
  username: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  newsletter: boolean;
  bio: string;
}

interface FormErrors {
  [key: string]: string;
}

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    age: 0,
    gender: 'male',
    newsletter: false,
    bio: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log('Submit:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      <div>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        />
        <label>Subscribe to newsletter</label>
      </div>

      <div>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### 9.3 受控与非受控组件

```typescript
// 受控组件
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  );
}

// 非受控组件
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="default" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

---

## 10. Refs 类型

### 10.1 DOM Refs

```typescript
import { useRef, useEffect } from 'react';

// HTML 元素 Refs
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const formRef = useRef<HTMLFormElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const videoRef = useRef<HTMLVideoElement>(null);
const audioRef = useRef<HTMLAudioElement>(null);

// 使用
useEffect(() => {
  // 类型守卫
  if (inputRef.current) {
    inputRef.current.focus();
    inputRef.current.value = 'Hello';
  }

  // Canvas 操作
  const ctx = canvasRef.current?.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
  }
}, []);

return (
  <>
    <input ref={inputRef} />
    <div ref={divRef}>Content</div>
    <canvas ref={canvasRef} />
  </>
);
```

### 10.2 组件 Refs

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react';

// 定义暴露的方法
interface CustomInputHandle {
  focus: () => void;
  clear: () => void;
  setValue: (value: string) => void;
  getValue: () => string;
}

interface CustomInputProps {
  label: string;
  placeholder?: string;
}

// 使用 forwardRef
const CustomInput = forwardRef<CustomInputHandle, CustomInputProps>(
  ({ label, placeholder }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
      setValue(value: string) {
        if (inputRef.current) {
          inputRef.current.value = value;
        }
      },
      getValue() {
        return inputRef.current?.value || '';
      }
    }));

    return (
      <div>
        <label>{label}</label>
        <input ref={inputRef} placeholder={placeholder} />
      </div>
    );
  }
);

// 父组件使用
function Parent() {
  const inputRef = useRef<CustomInputHandle>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleClear = () => {
    inputRef.current?.clear();
  };

  return (
    <div>
      <CustomInput ref={inputRef} label="Name" />
      <button onClick={handleFocus}>Focus</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}
```

### 10.3 回调 Refs

```typescript
function CallbackRefExample() {
  const [height, setHeight] = useState(0);

  // 回调 ref 类型
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div ref={measureRef}>
      <p>Height: {height}px</p>
    </div>
  );
}

// 带类型的回调 ref
type RefCallback<T> = (node: T | null) => void;

const setRef: RefCallback<HTMLInputElement> = (node) => {
  if (node) {
    node.focus();
  }
};
```

---

## 11. Context 类型

### 11.1 基本 Context 类型

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

// Context 值类型
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 创建 Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}

// Provider 组件
function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 Hook
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 使用
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      style={{ background: theme === 'light' ? '#fff' : '#333' }}
    >
      Current theme: {theme}
    </button>
  );
}
```

### 11.2 复杂 Context 示例

```typescript
// 用户状态类型
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Context 状态类型
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Context 动作类型
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// 完整 Context 类型
type AuthContextType = AuthState & AuthActions;

// 创建 Context
const AuthContext = createContext<AuthContextType | null>(null);

// Action 类型
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
}

// Provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authApi.login(email, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
    }
  };

  const logout = async () => {
    await authApi.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authApi.register(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    await authApi.updateProfile(data);
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 12. 高阶组件类型

### 12.1 基本 HOC 类型

```typescript
import React, { ComponentType } from 'react';

// HOC 注入的 Props
interface WithLoadingProps {
  loading: boolean;
}

// HOC 函数
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent({ loading, ...props }: P & WithLoadingProps) {
    if (loading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...(props as P)} />;
  };
}

// 使用
interface UserListProps {
  users: User[];
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

const UserListWithLoading = withLoading(UserList);

// 使用时
<UserListWithLoading loading={isLoading} users={users} />
```

### 12.2 注入 Props 的 HOC

```typescript
// 注入的 Props 类型
interface InjectedProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// HOC
function withTheme<P extends InjectedProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<Omit<P, keyof InjectedProps>> {
  return function WithThemeComponent(props: Omit<P, keyof InjectedProps>) {
    const theme = useTheme();
    
    return (
      <WrappedComponent
        {...(props as P)}
        theme={theme.theme}
        toggleTheme={theme.toggleTheme}
      />
    );
  };
}

// 原始组件需要 InjectedProps
interface ButtonProps extends InjectedProps {
  label: string;
}

function ThemedButton({ label, theme, toggleTheme }: ButtonProps) {
  return (
    <button onClick={toggleTheme} className={theme}>
      {label}
    </button>
  );
}

// 包装后不需要传 theme 和 toggleTheme
const EnhancedButton = withTheme(ThemedButton);

// 使用
<EnhancedButton label="Click me" />
```

### 12.3 转发 Ref 的 HOC

```typescript
import { forwardRef, ComponentType, Ref } from 'react';

interface WithLoggerProps {
  logger?: (msg: string) => void;
}

function withLogger<P extends object, R = unknown>(
  WrappedComponent: ComponentType<P & { ref?: Ref<R> }>
) {
  function WithLogger(props: P & WithLoggerProps, ref: Ref<R>) {
    const { logger = console.log, ...rest } = props;

    useEffect(() => {
      logger('Component mounted');
      return () => logger('Component unmounted');
    }, [logger]);

    return <WrappedComponent ref={ref} {...(rest as P)} />;
  }

  // 转发 ref
  return forwardRef<R, P & WithLoggerProps>(WithLogger);
}
```

---

## 13. 泛型组件

### 13.1 基本泛型组件

```typescript
// 泛型列表组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// 使用
interface User {
  id: number;
  name: string;
}

function UserList() {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  return (
    <List
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => <span>{user.name}</span>}
    />
  );
}
```

### 13.2 泛型 Select 组件

```typescript
interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
  placeholder?: string;
}

function Select<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  placeholder = 'Select...'
}: SelectProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(
      (opt) => String(getOptionValue(opt)) === selectedValue
    );
    if (selectedOption) {
      onChange(selectedOption);
    }
  };

  return (
    <select
      value={value ? String(getOptionValue(value)) : ''}
      onChange={handleChange}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={String(getOptionValue(option))} value={String(getOptionValue(option))}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
}

// 使用
interface Country {
  code: string;
  name: string;
}

function CountrySelector() {
  const countries: Country[] = [
    { code: 'CN', name: 'China' },
    { code: 'US', name: 'United States' }
  ];
  
  const [selected, setSelected] = useState<Country | null>(null);

  return (
    <Select
      options={countries}
      value={selected}
      onChange={setSelected}
      getOptionLabel={(c) => c.name}
      getOptionValue={(c) => c.code}
    />
  );
}
```

### 13.3 泛型表格组件

```typescript
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: number | string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

function Table<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  onRowClick
}: TableProps<T>) {
  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    const key = column.key as keyof T;
    return String(item[key] ?? '');
  };

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} style={{ width: column.width }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => (
              <td key={String(column.key)}>
                {getCellValue(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 使用
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

function ProductTable() {
  const products: Product[] = [
    { id: 1, name: 'iPhone', price: 999, stock: 10 },
    { id: 2, name: 'MacBook', price: 1999, stock: 5 }
  ];

  const columns: Column<Product>[] = [
    { key: 'id', header: 'ID', width: 50 },
    { key: 'name', header: 'Name' },
    { key: 'price', header: 'Price', render: (p) => `$${p.price}` },
    { key: 'stock', header: 'Stock', render: (p) => (
      <span style={{ color: p.stock < 10 ? 'red' : 'green' }}>
        {p.stock}
      </span>
    )}
  ];

  return (
    <Table
      data={products}
      columns={columns}
      keyExtractor={(p) => p.id}
      onRowClick={(p) => console.log('Clicked:', p.name)}
    />
  );
}
```

---

## 14. 条件类型与映射类型

### 14.1 条件类型

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 提取数组元素类型
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type C = ArrayElement<string[]>;  // string
type D = ArrayElement<number[]>;  // number

// 提取 Promise 值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type E = UnwrapPromise<Promise<string>>;  // string
type F = UnwrapPromise<string>;  // string

// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 条件类型在组件中的应用
type PropsWithChildren<P> = P & { children?: React.ReactNode };

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonStyles<V extends ButtonVariant> = 
  V extends 'primary' ? { background: 'blue' } :
  V extends 'secondary' ? { background: 'gray' } :
  V extends 'danger' ? { background: 'red' } :
  never;
```

### 14.2 映射类型

```typescript
// Partial - 所有属性可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required - 所有属性必需
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Readonly - 所有属性只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick - 选取部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit - 排除部分属性
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Record - 创建对象类型
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// 实际应用
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// 创建用户时不需要 id
type CreateUserInput = Omit<User, 'id'>;

// 更新用户时所有字段可选
type UpdateUserInput = Partial<Omit<User, 'id'>>;

// 用户公开信息（不含密码）
type PublicUser = Omit<User, 'password'>;

// 表单状态
type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface FormState<T> {
  values: T;
  touched: FormTouched<T>;
  errors: FormErrors<T>;
}
```

### 14.3 模板字面量类型

```typescript
// 事件名称类型
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>;  // 'onClick'
type ChangeEvent = EventName<'change'>;  // 'onChange'

// CSS 属性类型
type CSSProperty = 'margin' | 'padding';
type CSSDirection = 'Top' | 'Right' | 'Bottom' | 'Left';
type CSSSpacing = `${CSSProperty}${CSSDirection}`;
// 'marginTop' | 'marginRight' | ... | 'paddingLeft'

// 动态事件处理器
type EventHandlers<T extends string> = {
  [K in T as `on${Capitalize<K>}`]: (event: Event) => void;
};

type MouseEvents = EventHandlers<'click' | 'mouseenter' | 'mouseleave'>;
// {
//   onClick: (event: Event) => void;
//   onMouseenter: (event: Event) => void;
//   onMouseleave: (event: Event) => void;
// }
```

---

## 15. 第三方库类型

### 15.1 React Router 类型

```typescript
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
  Outlet,
  Navigate
} from 'react-router-dom';

// 路由参数类型
interface UserParams {
  userId: string;
}

function UserProfile() {
  const { userId } = useParams<UserParams>();
  // 或者使用 Record
  const params = useParams<Record<'userId', string>>();
  
  return <div>User ID: {userId}</div>;
}

// 导航类型
function Navigation() {
  const navigate = useNavigate();
  
  const goToUser = (id: string) => {
    navigate(`/users/${id}`);
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  const goWithState = () => {
    navigate('/dashboard', { state: { from: 'login' } });
  };
  
  return null;
}

// Location 类型
interface LocationState {
  from: string;
}

function Dashboard() {
  const location = useLocation();
  const state = location.state as LocationState;
  
  return <div>From: {state?.from}</div>;
}

// Search Params 类型
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  
  const updateSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery, page: '1' });
  };
  
  return null;
}

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'users/:userId', element: <UserProfile /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
```

### 15.2 Redux Toolkit 类型

```typescript
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// State 类型
interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle'
};

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// 类型推断
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 类型化的 Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 使用
function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

### 15.3 Axios 类型

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 响应数据类型
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 用户类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 创建类型化的 API 客户端
class ApiClient {
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: '/api',
      timeout: 10000,
      ...config
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => response,
      (error) => Promise.reject(error)
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }
}

const api = new ApiClient();

// 使用
async function fetchUser(id: number): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

async function createUser(data: Omit<User, 'id'>): Promise<User> {
  return api.post<User, Omit<User, 'id'>>('/users', data);
}
```

---

## 16. 类型工具函数

### 16.1 常用类型工具

```typescript
// 深度 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 深度 Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 可空类型
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

// 非空类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 提取对象值类型
type ValueOf<T> = T[keyof T];

// 函数参数类型
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

// 构造函数参数类型
type ConstructorParameters<T extends new (...args: any) => any> = 
  T extends new (...args: infer P) => any ? P : never;

// 实例类型
type InstanceType<T extends new (...args: any) => any> = 
  T extends new (...args: any) => infer R ? R : any;

// Promise 类型
type Awaited<T> = T extends Promise<infer U> ? U : T;
```

### 16.2 React 特定类型工具

```typescript
// 提取组件 Props
type ComponentProps<T extends React.ComponentType<any>> = 
  T extends React.ComponentType<infer P> ? P : never;

// 提取元素 Props
type ElementProps<T extends keyof JSX.IntrinsicElements> = 
  JSX.IntrinsicElements[T];

// 带 ref 的 Props
type PropsWithRef<P> = P & { ref?: React.Ref<any> };

// 状态 setter 类型
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Reducer 类型
type Reducer<S, A> = (state: S, action: A) => S;

// Context 值提取
type ContextValue<T extends React.Context<any>> = 
  T extends React.Context<infer V> ? V : never;

// 使用示例
const MyContext = createContext({ count: 0 });
type MyContextValue = ContextValue<typeof MyContext>;
// { count: number }
```

---

## 17. 常见类型问题解决

### 17.1 类型断言

```typescript
// as 断言
const value = someValue as string;
const element = document.getElementById('app') as HTMLDivElement;

// 非空断言
const user = getUser()!;  // 断言不为 null/undefined
element!.focus();

// const 断言
const config = {
  endpoint: '/api',
  timeout: 5000
} as const;
// 类型: { readonly endpoint: '/api'; readonly timeout: 5000 }

// 双重断言（谨慎使用）
const value = (input as unknown) as TargetType;
```

### 17.2 类型守卫

```typescript
// typeof 守卫
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// instanceof 守卫
function handleError(error: Error | string) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log(error);
  }
}

// in 守卫
interface Dog {
  bark: () => void;
}

interface Cat {
  meow: () => void;
}

function makeSound(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// 自定义类型守卫
interface User {
  type: 'user';
  name: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

function isAdmin(person: User | Admin): person is Admin {
  return person.type === 'admin';
}

function showPermissions(person: User | Admin) {
  if (isAdmin(person)) {
    console.log(person.permissions);  // OK
  }
}

// 数组类型守卫
function isStringArray(arr: unknown[]): arr is string[] {
  return arr.every(item => typeof item === 'string');
}
```

### 17.3 常见错误处理

```typescript
// 错误: 'X' 类型不能赋值给 'Y' 类型
// 解决: 检查类型是否匹配，使用类型断言或修正类型

// 错误: 对象可能为 'undefined'
// 解决1: 可选链
const value = obj?.property?.subProperty;

// 解决2: 类型守卫
if (obj && obj.property) {
  console.log(obj.property);
}

// 解决3: 非空断言（确定不为空时）
const value = obj!.property;

// 错误: 类型 'X' 上不存在属性 'Y'
// 解决1: 添加属性到类型定义
interface MyType {
  existingProp: string;
  newProp: number;  // 添加
}

// 解决2: 使用索引签名
interface FlexibleType {
  [key: string]: unknown;
}

// 解决3: 类型断言
(obj as any).newProp;

// 错误: 泛型类型需要 X 个类型参数
// 解决: 提供类型参数
const arr: Array<string> = [];  // 而不是 Array = []
const map: Map<string, number> = new Map();

// 错误: 参数 'X' 隐式具有 'any' 类型
// 解决: 显式声明类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
```

### 17.4 环境声明

```typescript
// 声明全局变量 (global.d.ts)
declare global {
  interface Window {
    myGlobalVar: string;
    myGlobalFunc: () => void;
  }
}

// 声明模块
declare module 'some-untyped-library' {
  export function doSomething(input: string): void;
  export const version: string;
}

// 扩展现有模块
declare module 'react' {
  interface HTMLAttributes<T> {
    customAttribute?: string;
  }
}

// 声明 CSS 模块
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 声明图片模块
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
```

---

## 总结

本文档详细介绍了 React + TypeScript 的所有核心类型用法：

1. **基础类型** - 接口、类型别名、枚举
2. **组件类型** - 函数组件、类组件、Props、State
3. **Hooks 类型** - useState、useEffect、useRef、useContext 等
4. **事件类型** - 鼠标、键盘、表单等事件处理
5. **高级类型** - 泛型组件、条件类型、映射类型
6. **第三方库** - React Router、Redux、Axios
7. **类型工具** - 常用类型工具函数
8. **问题解决** - 类型断言、类型守卫、环境声明

掌握这些知识，你就能够在 React 项目中充分利用 TypeScript 的类型系统！
