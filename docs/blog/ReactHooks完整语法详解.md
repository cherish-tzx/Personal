# React Hooks 完整语法详解
<div class="doc-toc">
## 目录
1. [Hooks 简介](#1-hooks-简介)
2. [useState - 状态管理](#2-usestate---状态管理)
3. [useEffect - 副作用处理](#3-useeffect---副作用处理)
4. [useContext - 上下文消费](#4-usecontext---上下文消费)
5. [useReducer - 复杂状态管理](#5-usereducer---复杂状态管理)
6. [useCallback - 函数缓存](#6-usecallback---函数缓存)
7. [useMemo - 计算缓存](#7-usememo---计算缓存)
8. [useRef - 引用管理](#8-useref---引用管理)
9. [useImperativeHandle - 自定义实例](#9-useimperativehandle---自定义实例)
10. [useLayoutEffect - 同步副作用](#10-uselayouteffect---同步副作用)
11. [useDebugValue - 调试标签](#11-usedebugvalue---调试标签)
12. [useId - 唯一ID生成](#12-useid---唯一id生成)
13. [useTransition - 过渡更新](#13-usetransition---过渡更新)
14. [useDeferredValue - 延迟值](#14-usedeferredvalue---延迟值)
15. [useSyncExternalStore - 外部存储订阅](#15-usesyncexternalstore---外部存储订阅)
16. [useInsertionEffect - CSS-in-JS](#16-useinsertioneffect---css-in-js)
17. [自定义 Hooks](#17-自定义-hooks)
18. [Hooks 使用规则](#18-hooks-使用规则)
19. [常见自定义 Hooks 合集](#19-常见自定义-hooks-合集)


</div>

---

## 1. Hooks 简介

### 1.1 什么是 Hooks

Hooks 是 React 16.8 引入的新特性，允许在函数组件中使用 state 和其他 React 特性。

```jsx
import { useState, useEffect } from 'react';

function Example() {
  // 使用 Hook
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `点击了 ${count} 次`;
  }, [count]);

  return (
    <div>
      <p>点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
  );
}
```

### 1.2 Hooks 的优势

- **更简洁**：避免类组件的复杂性
- **逻辑复用**：通过自定义 Hook 复用状态逻辑
- **关注点分离**：按功能组织代码而非生命周期
- **更易测试**：纯函数更容易测试

### 1.3 Hooks 与类组件对比

```jsx
// 类组件
class Counter extends React.Component {
  state = { count: 0 };
  
  componentDidMount() {
    document.title = `点击了 ${this.state.count} 次`;
  }
  
  componentDidUpdate() {
    document.title = `点击了 ${this.state.count} 次`;
  }
  
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        点击了 {this.state.count} 次
      </button>
    );
  }
}

// 函数组件 + Hooks
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `点击了 ${count} 次`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击了 {count} 次
    </button>
  );
}
```

---

## 2. useState - 状态管理

### 2.1 基本用法

```jsx
import { useState } from 'react';

function Counter() {
  // 声明状态变量
  // count: 当前状态值
  // setCount: 更新状态的函数
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}
```

### 2.2 多个状态变量

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="checkbox"
        checked={isSubscribed}
        onChange={(e) => setIsSubscribed(e.target.checked)}
      />
    </form>
  );
}
```

### 2.3 对象和数组状态

```jsx
function UserProfile() {
  // 对象状态
  const [user, setUser] = useState({
    name: '张三',
    age: 25,
    address: {
      city: '北京',
      district: '朝阳'
    }
  });

  // 更新对象 - 需要展开创建新对象
  const updateName = (name) => {
    setUser({ ...user, name });
  };

  // 更新嵌套对象
  const updateCity = (city) => {
    setUser({
      ...user,
      address: { ...user.address, city }
    });
  };

  // 数组状态
  const [items, setItems] = useState(['苹果', '香蕉']);

  // 添加元素
  const addItem = (item) => {
    setItems([...items, item]);
  };

  // 删除元素
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // 更新元素
  const updateItem = (index, newValue) => {
    setItems(items.map((item, i) => (i === index ? newValue : item)));
  };

  return (
    <div>
      <p>{user.name} - {user.address.city}</p>
      <button onClick={() => updateName('李四')}>改名</button>
      <button onClick={() => updateCity('上海')}>改城市</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>删除</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addItem('橙子')}>添加</button>
    </div>
  );
}
```

### 2.4 函数式更新

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 基于当前值更新 - 推荐使用函数式更新
  const increment = () => {
    // 确保获取最新的 count 值
    setCount((prevCount) => prevCount + 1);
  };

  // 多次更新
  const incrementThree = () => {
    // 每次都基于最新值更新
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  // 错误示例 - 这三次只会加 1
  const incrementThreeWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={incrementThree}>+3</button>
    </div>
  );
}
```

### 2.5 惰性初始化

```jsx
function ExpensiveComponent() {
  // 惰性初始化 - 只在首次渲染时执行
  const [state, setState] = useState(() => {
    console.log('计算初始值');
    const initialValue = someExpensiveComputation();
    return initialValue;
  });

  // 从 localStorage 读取初始值
  const [savedData, setSavedData] = useState(() => {
    const saved = localStorage.getItem('myData');
    return saved ? JSON.parse(saved) : { items: [] };
  });

  return <div>{state}</div>;
}

function someExpensiveComputation() {
  // 模拟耗时计算
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result;
}
```

### 2.6 状态重置

```jsx
function ResettableForm() {
  const initialState = { name: '', email: '' };
  const [form, setForm] = useState(initialState);

  const handleReset = () => {
    setForm(initialState);
  };

  return (
    <form>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <button type="button" onClick={handleReset}>重置</button>
    </form>
  );
}

// 使用 key 重置组件
function ParentComponent() {
  const [key, setKey] = useState(0);

  return (
    <div>
      <ResettableForm key={key} />
      <button onClick={() => setKey((k) => k + 1)}>重置表单</button>
    </div>
  );
}
```

---

## 3. useEffect - 副作用处理

### 3.1 基本用法

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 每次渲染后执行
  useEffect(() => {
    console.log('组件渲染了');
    document.title = `点击了 ${count} 次`;
  });

  return (
    <button onClick={() => setCount(count + 1)}>
      点击了 {count} 次
    </button>
  );
}
```

### 3.2 依赖数组

```jsx
function DependencyExample({ userId }) {
  const [user, setUser] = useState(null);

  // 空依赖数组 - 只在挂载时执行一次
  useEffect(() => {
    console.log('组件挂载');
    // 初始化操作
  }, []);

  // 有依赖 - 当依赖变化时执行
  useEffect(() => {
    console.log('userId 变化了:', userId);
    fetchUser(userId).then(setUser);
  }, [userId]);

  // 多个依赖
  useEffect(() => {
    console.log('任一依赖变化');
  }, [userId, user?.name]);

  // 无依赖数组 - 每次渲染都执行
  useEffect(() => {
    console.log('每次渲染都执行');
  });

  return <div>{user?.name}</div>;
}
```

### 3.3 清理函数

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 设置定时器
    const intervalId = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // 返回清理函数
    return () => {
      console.log('清理定时器');
      clearInterval(intervalId);
    };
  }, []);

  return <p>运行时间: {seconds} 秒</p>;
}

// 事件监听
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <p>鼠标位置: ({position.x}, {position.y})</p>;
}

// WebSocket 连接
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <div>聊天室 {roomId}</div>;
}
```

### 3.4 数据获取

```jsx
function DataFetching({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 用于取消请求的标志
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        const result = await response.json();
        
        // 检查是否已取消
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // 清理函数 - 取消请求
    return () => {
      isCancelled = true;
    };
  }, [url]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}

// 使用 AbortController
function DataFetchingWithAbort({ url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  return <div>{JSON.stringify(data)}</div>;
}
```

### 3.5 订阅外部数据源

```jsx
function OnlineStatus({ userId }) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    // 订阅
    ChatAPI.subscribeToUserStatus(userId, handleStatusChange);

    // 取消订阅
    return () => {
      ChatAPI.unsubscribeFromUserStatus(userId, handleStatusChange);
    };
  }, [userId]);

  if (isOnline === null) return '加载中...';
  return isOnline ? '在线' : '离线';
}
```

### 3.6 操作 DOM

```jsx
function AutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 组件挂载后自动聚焦
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}

function ScrollToTop() {
  useEffect(() => {
    // 滚动到顶部
    window.scrollTo(0, 0);
  }, []);

  return <div>页面内容</div>;
}

function MeasureElement() {
  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      setHeight(elementRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={elementRef}>测量这个元素的高度</div>
      <p>高度: {height}px</p>
    </div>
  );
}
```

### 3.7 条件执行 Effect

```jsx
function ConditionalEffect({ shouldFetch, userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 条件执行
    if (!shouldFetch) return;

    let cancelled = false;
    fetchUser(userId).then((result) => {
      if (!cancelled) {
        setData(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [shouldFetch, userId]);

  return <div>{data?.name}</div>;
}
```

### 3.8 Effect 执行时机

```jsx
function EffectTiming() {
  console.log('1. 渲染');

  useEffect(() => {
    console.log('3. useEffect 执行');
    return () => {
      console.log('4. useEffect 清理');
    };
  });

  console.log('2. 渲染完成');

  return <div>Effect 时机示例</div>;
}

// 执行顺序:
// 首次渲染: 1 -> 2 -> 3
// 更新时: 1 -> 2 -> 4 -> 3
// 卸载时: 4
```

---

## 4. useContext - 上下文消费

### 4.1 基本用法

```jsx
import { createContext, useContext, useState } from 'react';

// 创建 Context
const ThemeContext = createContext('light');

// Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用 useContext 消费
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff'
      }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      切换主题
    </button>
  );
}

// 应用
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

### 4.2 多层 Context

```jsx
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const LanguageContext = createContext('zh');

function App() {
  return (
    <UserContext.Provider value={{ name: '张三' }}>
      <ThemeContext.Provider value="dark">
        <LanguageContext.Provider value="en">
          <Page />
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

function Page() {
  const user = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const language = useContext(LanguageContext);

  return (
    <div>
      <p>用户: {user.name}</p>
      <p>主题: {theme}</p>
      <p>语言: {language}</p>
    </div>
  );
}
```

### 4.3 封装为自定义 Hook

```jsx
// 创建 Context 和 Provider
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    checkAuth().then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    const userData = await loginAPI(credentials);
    setUser(userData);
  };

  const logout = async () => {
    await logoutAPI();
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
  if (context === null) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}

// 使用
function Profile() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>欢迎, {user.name}</h1>
      <button onClick={logout}>退出登录</button>
    </div>
  );
}
```

---

## 5. useReducer - 复杂状态管理

### 5.1 基本用法

```jsx
import { useReducer } from 'react';

// 定义 reducer 函数
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      throw new Error(`未知的 action 类型: ${action.type}`);
  }
}

function Counter() {
  // 使用 useReducer
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>设为10</button>
    </div>
  );
}
```

### 5.2 复杂状态示例

```jsx
// 初始状态
const initialState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null
};

// Reducer 函数
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload)
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };

    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        todos: action.payload
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState('');

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === 'completed') return todo.completed;
    if (state.filter === 'active') return !todo.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue });
      setInputValue('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">添加</button>
      </form>

      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
          全部
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
          进行中
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
          已完成
        </button>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 5.3 惰性初始化

```jsx
function createInitialState(initialCount) {
  return {
    count: initialCount,
    history: [initialCount]
  };
}

function Counter({ initialCount }) {
  // 第三个参数是初始化函数
  const [state, dispatch] = useReducer(
    counterReducer,
    initialCount,
    createInitialState
  );

  return <div>{state.count}</div>;
}
```

### 5.4 结合 Context 使用

```jsx
const TodoContext = createContext(null);
const TodoDispatchContext = createContext(null);

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

// 自定义 Hooks
function useTodos() {
  return useContext(TodoContext);
}

function useTodoDispatch() {
  return useContext(TodoDispatchContext);
}

// 使用
function TodoList() {
  const { todos } = useTodos();
  const dispatch = useTodoDispatch();

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
            删除
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 6. useCallback - 函数缓存

### 6.1 基本用法

```jsx
import { useCallback, useState, memo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 不使用 useCallback - 每次渲染创建新函数
  const handleClickBad = () => {
    setCount((c) => c + 1);
  };

  // 使用 useCallback - 缓存函数
  const handleClickGood = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <Child onClick={handleClickGood} />
    </div>
  );
}

// 使用 memo 优化的子组件
const Child = memo(function Child({ onClick }) {
  console.log('Child 渲染');
  return <button onClick={onClick}>点击</button>;
});
```

### 6.2 带依赖的回调

```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // 依赖 query 变化时重新创建函数
  const handleSearch = useCallback(async () => {
    const data = await searchAPI(query);
    setResults(data);
  }, [query]);

  // 依赖多个值
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('提交:', query, results.length);
  }, [query, results]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchButton onSearch={handleSearch} />
    </div>
  );
}
```

### 6.3 事件处理器

```jsx
function ItemList({ items, onItemClick }) {
  // 为每个 item 创建缓存的处理函数
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// 更好的方式 - 将 id 传递给子组件
function ItemList({ items, onItemClick }) {
  return (
    <ul>
      {items.map((item) => (
        <Item key={item.id} item={item} onClick={onItemClick} />
      ))}
    </ul>
  );
}

const Item = memo(function Item({ item, onClick }) {
  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [onClick, item.id]);

  return <li onClick={handleClick}>{item.name}</li>;
});
```

### 6.4 与 useEffect 配合

```jsx
function DataLoader({ userId }) {
  const [data, setData] = useState(null);

  // 缓存 fetch 函数
  const fetchData = useCallback(async () => {
    const result = await fetchUser(userId);
    setData(result);
  }, [userId]);

  // 在 effect 中使用缓存的函数
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 也可以在其他地方调用
  return (
    <div>
      <p>{data?.name}</p>
      <button onClick={fetchData}>刷新</button>
    </div>
  );
}
```

---

## 7. useMemo - 计算缓存

### 7.1 基本用法

```jsx
import { useMemo, useState } from 'react';

function ExpensiveComponent({ items, filter }) {
  // 缓存计算结果
  const filteredItems = useMemo(() => {
    console.log('计算过滤结果');
    return items.filter((item) => item.name.includes(filter));
  }, [items, filter]);

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 7.2 复杂计算

```jsx
function DataAnalyzer({ data }) {
  // 缓存复杂计算
  const statistics = useMemo(() => {
    console.log('计算统计数据');
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;
    const max = Math.max(...data.map((item) => item.value));
    const min = Math.min(...data.map((item) => item.value));
    
    return { total, average, max, min };
  }, [data]);

  // 缓存排序结果
  const sortedData = useMemo(() => {
    console.log('排序数据');
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div>
      <p>总计: {statistics.total}</p>
      <p>平均: {statistics.average.toFixed(2)}</p>
      <p>最大: {statistics.max}</p>
      <p>最小: {statistics.min}</p>
      <ul>
        {sortedData.map((item) => (
          <li key={item.id}>{item.name}: {item.value}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 7.3 缓存对象和数组

```jsx
function StyleExample({ size, color }) {
  // 缓存样式对象，避免子组件不必要的重渲染
  const style = useMemo(() => ({
    width: size,
    height: size,
    backgroundColor: color
  }), [size, color]);

  return <div style={style} />;
}

function ConfigExample({ options }) {
  // 缓存配置数组
  const config = useMemo(() => [
    { id: 1, label: '选项1', value: options.value1 },
    { id: 2, label: '选项2', value: options.value2 },
    { id: 3, label: '选项3', value: options.value3 }
  ], [options.value1, options.value2, options.value3]);

  return <SelectComponent options={config} />;
}
```

### 7.4 与 useCallback 的区别

```jsx
function Comparison() {
  const [count, setCount] = useState(0);

  // useMemo 缓存值
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);

  // useCallback 缓存函数
  const expensiveCallback = useCallback(() => {
    return computeExpensiveValue(count);
  }, [count]);

  // useCallback(fn, deps) 等价于 useMemo(() => fn, deps)
  const sameAsCallback = useMemo(() => {
    return () => computeExpensiveValue(count);
  }, [count]);

  return <div>{expensiveValue}</div>;
}
```

### 7.5 避免过度使用

```jsx
function Example({ a, b }) {
  // 不需要 useMemo - 简单计算
  const sum = a + b; // ✅ 直接计算

  // 不需要 useMemo - 简单对象
  const simpleObject = { a, b }; // ✅ 如果不传给 memo 组件

  // 需要 useMemo - 复杂计算
  const expensiveResult = useMemo(() => {
    return items.filter(x => x.active).map(x => transform(x));
  }, [items]);

  // 需要 useMemo - 传给 memo 组件的对象
  const memoizedObject = useMemo(() => ({ a, b }), [a, b]);

  return <MemoizedChild config={memoizedObject} />;
}
```

---

## 8. useRef - 引用管理

### 8.1 访问 DOM 元素

```jsx
import { useRef, useEffect } from 'react';

function TextInputWithFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 组件挂载后自动聚焦
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}

function VideoPlayer() {
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
  };

  const handlePause = () => {
    videoRef.current.pause();
  };

  return (
    <div>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={handlePlay}>播放</button>
      <button onClick={handlePause}>暂停</button>
    </div>
  );
}
```

### 8.2 保存可变值

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) return; // 防止重复启动
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // 组件卸载时清理
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={startTimer}>开始</button>
      <button onClick={stopTimer}>停止</button>
    </div>
  );
}
```

### 8.3 保存上一次的值

```jsx
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前: {count}, 之前: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 8.4 避免闭包陷阱

```jsx
function ClosureTrap() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 保持 ref 与 state 同步
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleAlertClick = () => {
    // 使用 ref 获取最新值
    setTimeout(() => {
      alert(`当前计数: ${countRef.current}`);
    }, 3000);
  };

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={handleAlertClick}>3秒后显示</button>
    </div>
  );
}
```

### 8.5 回调 Ref

```jsx
function MeasureElement() {
  const [height, setHeight] = useState(0);

  // 回调 ref - 元素挂载/卸载时调用
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div>
      <h1 ref={measuredRef}>Hello, world</h1>
      <p>上面标题的高度是: {Math.round(height)}px</p>
    </div>
  );
}
```

### 8.6 多个 Refs

```jsx
function MultipleRefs() {
  const inputRefs = useRef([]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  return (
    <div>
      {[0, 1, 2].map((i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          placeholder={`输入框 ${i + 1}`}
        />
      ))}
      <button onClick={() => focusInput(0)}>聚焦第一个</button>
      <button onClick={() => focusInput(1)}>聚焦第二个</button>
      <button onClick={() => focusInput(2)}>聚焦第三个</button>
    </div>
  );
}
```

---

## 9. useImperativeHandle - 自定义实例

### 9.1 基本用法

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react';

// 子组件
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
    getValue: () => {
      return inputRef.current.value;
    },
    setValue: (value) => {
      inputRef.current.value = value;
    }
  }));

  return <input ref={inputRef} {...props} />;
});

// 父组件
function Parent() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  const handleClear = () => {
    inputRef.current.clear();
  };

  const handleGetValue = () => {
    alert(inputRef.current.getValue());
  };

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="输入内容" />
      <button onClick={handleFocus}>聚焦</button>
      <button onClick={handleClear}>清空</button>
      <button onClick={handleGetValue}>获取值</button>
    </div>
  );
}
```

### 9.2 带依赖的实例

```jsx
const Counter = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      increment: () => setCount((c) => c + 1),
      decrement: () => setCount((c) => c - 1),
      reset: () => setCount(0),
      getCount: () => count
    }),
    [count] // 依赖 count，当 count 变化时更新
  );

  return <p>计数: {count}</p>;
});

function Parent() {
  const counterRef = useRef(null);

  return (
    <div>
      <Counter ref={counterRef} />
      <button onClick={() => counterRef.current.increment()}>+1</button>
      <button onClick={() => counterRef.current.decrement()}>-1</button>
      <button onClick={() => counterRef.current.reset()}>重置</button>
      <button onClick={() => alert(counterRef.current.getCount())}>
        获取计数
      </button>
    </div>
  );
}
```

### 9.3 复杂组件示例

```jsx
const Form = forwardRef((props, ref) => {
  const [values, setValues] = useState({
    username: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!values.username) {
      newErrors.username = '用户名不能为空';
    }
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    // 获取表单值
    getValues: () => values,
    // 设置表单值
    setValues: (newValues) => setValues({ ...values, ...newValues }),
    // 验证表单
    validate,
    // 重置表单
    reset: () => {
      setValues({ username: '', email: '' });
      setErrors({});
    },
    // 获取错误
    getErrors: () => errors
  }));

  return (
    <div>
      <div>
        <input
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
          placeholder="用户名"
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      <div>
        <input
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          placeholder="邮箱"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
    </div>
  );
});

function Parent() {
  const formRef = useRef(null);

  const handleSubmit = () => {
    if (formRef.current.validate()) {
      const values = formRef.current.getValues();
      console.log('提交:', values);
    }
  };

  return (
    <div>
      <Form ref={formRef} />
      <button onClick={handleSubmit}>提交</button>
      <button onClick={() => formRef.current.reset()}>重置</button>
    </div>
  );
}
```

---

## 10. useLayoutEffect - 同步副作用

### 10.1 基本用法

```jsx
import { useLayoutEffect, useEffect, useRef, useState } from 'react';

function LayoutEffectExample() {
  const [width, setWidth] = useState(0);
  const divRef = useRef(null);

  // useLayoutEffect 在 DOM 更新后、浏览器绘制前同步执行
  useLayoutEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  }, []);

  return (
    <div ref={divRef}>
      宽度: {width}px
    </div>
  );
}
```

### 10.2 与 useEffect 的区别

```jsx
function Comparison() {
  const [count, setCount] = useState(0);

  // useEffect: 异步执行，在浏览器绘制后
  useEffect(() => {
    console.log('useEffect:', count);
  }, [count]);

  // useLayoutEffect: 同步执行，在浏览器绘制前
  useLayoutEffect(() => {
    console.log('useLayoutEffect:', count);
  }, [count]);

  console.log('render');

  // 执行顺序: render -> useLayoutEffect -> 浏览器绘制 -> useEffect
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 10.3 避免闪烁

```jsx
// 使用 useEffect 会有闪烁
function TooltipBad({ position }) {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setTooltipHeight(ref.current.offsetHeight);
  }, []);

  // 初始渲染位置错误，然后跳到正确位置 - 闪烁
  const top = position.y - tooltipHeight;
  return <div ref={ref} style={{ top }}>Tooltip</div>;
}

// 使用 useLayoutEffect 避免闪烁
function TooltipGood({ position }) {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    setTooltipHeight(ref.current.offsetHeight);
  }, []);

  // 在绘制前就计算好位置，不会闪烁
  const top = position.y - tooltipHeight;
  return <div ref={ref} style={{ top }}>Tooltip</div>;
}
```

### 10.4 读取布局信息

```jsx
function ScrollToBottom({ messages }) {
  const containerRef = useRef(null);

  // 在 DOM 更新后立即滚动到底部
  useLayoutEffect(() => {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div ref={containerRef} style={{ height: 300, overflow: 'auto' }}>
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
}
```

---

## 11. useDebugValue - 调试标签

### 11.1 基本用法

```jsx
import { useDebugValue, useState, useEffect } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 在 React DevTools 中显示标签
  useDebugValue(isOnline ? '在线' : '离线');

  return isOnline;
}

function StatusIndicator() {
  const isOnline = useOnlineStatus();
  return <span>{isOnline ? '🟢' : '🔴'}</span>;
}
```

### 11.2 延迟格式化

```jsx
function useFormattedDate(date) {
  // 延迟格式化 - 只有在检查 Hook 时才执行
  useDebugValue(date, (date) => date.toLocaleDateString());

  return date;
}

function DateDisplay({ date }) {
  const formattedDate = useFormattedDate(date);
  return <span>{formattedDate.toLocaleDateString()}</span>;
}
```

---

## 12. useId - 唯一ID生成

### 12.1 基本用法

```jsx
import { useId } from 'react';

function PasswordField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>密码:</label>
      <input id={id} type="password" />
    </div>
  );
}

function FormFields() {
  const id = useId();

  return (
    <>
      <div>
        <label htmlFor={`${id}-firstName`}>名:</label>
        <input id={`${id}-firstName`} type="text" />
      </div>
      <div>
        <label htmlFor={`${id}-lastName`}>姓:</label>
        <input id={`${id}-lastName`} type="text" />
      </div>
    </>
  );
}
```

### 12.2 ARIA 属性

```jsx
function Tooltip({ content, children }) {
  const id = useId();

  return (
    <div>
      <span aria-describedby={id}>{children}</span>
      <div id={id} role="tooltip">
        {content}
      </div>
    </div>
  );
}

function ExpandableSection({ title, children }) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <div>
      <button
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded(!expanded)}
      >
        {title}
      </button>
      <div id={contentId} hidden={!expanded}>
        {children}
      </div>
    </div>
  );
}
```

---

## 13. useTransition - 过渡更新

### 13.1 基本用法

```jsx
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    // 将状态更新标记为过渡
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <div>
      <TabButton isActive={tab === 'about'} onClick={() => selectTab('about')}>
        关于
      </TabButton>
      <TabButton isActive={tab === 'posts'} onClick={() => selectTab('posts')}>
        文章
      </TabButton>
      <TabButton isActive={tab === 'contact'} onClick={() => selectTab('contact')}>
        联系
      </TabButton>
      
      {isPending && <Spinner />}
      
      <TabPanel tab={tab} />
    </div>
  );
}
```

### 13.2 保持 UI 响应

```jsx
function FilterableList({ items }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    // 输入框立即响应
    setQuery(value);

    // 过滤操作标记为过渡，可以被中断
    startTransition(() => {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="搜索..." />
      {isPending && <div>加载中...</div>}
      <ul style={{ opacity: isPending ? 0.5 : 1 }}>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 13.3 与 Suspense 配合

```jsx
function Router() {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState('home');

  function navigate(nextPage) {
    startTransition(() => {
      setPage(nextPage);
    });
  }

  return (
    <div>
      <nav>
        <button onClick={() => navigate('home')}>首页</button>
        <button onClick={() => navigate('about')}>关于</button>
      </nav>
      {isPending && <LoadingBar />}
      <Suspense fallback={<PageSkeleton />}>
        {page === 'home' && <HomePage />}
        {page === 'about' && <AboutPage />}
      </Suspense>
    </div>
  );
}
```

---

## 14. useDeferredValue - 延迟值

### 14.1 基本用法

```jsx
import { useState, useDeferredValue, useMemo } from 'react';

function SearchResults({ query }) {
  // query 变化时，deferredQuery 会延迟更新
  const deferredQuery = useDeferredValue(query);
  
  // 是否正在等待延迟值
  const isStale = query !== deferredQuery;

  // 使用延迟值进行计算
  const results = useMemo(
    () => searchItems(deferredQuery),
    [deferredQuery]
  );

  return (
    <ul style={{ opacity: isStale ? 0.5 : 1 }}>
      {results.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={query} />
    </div>
  );
}
```

### 14.2 与 useTransition 的区别

```jsx
// useTransition: 控制状态更新的优先级
function WithTransition() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    // 输入立即更新
    setQuery(e.target.value);
    // 列表更新被标记为过渡
    startTransition(() => {
      // 其他状态更新
    });
  };
}

// useDeferredValue: 延迟值的更新
function WithDeferredValue() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // 当 query 变化时，deferredQuery 会延迟跟随
  // 适用于无法控制状态更新的情况（如来自 props）
}
```

---

## 15. useSyncExternalStore - 外部存储订阅

### 15.1 基本用法

```jsx
import { useSyncExternalStore } from 'react';

// 创建一个简单的 store
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = typeof newState === 'function' ? newState(state) : newState;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

const store = createStore({ count: 0 });

function Counter() {
  const count = useSyncExternalStore(
    store.subscribe,      // 订阅函数
    store.getState,       // 获取状态函数
    store.getState        // 服务端渲染时的获取函数
  );

  return (
    <div>
      <p>计数: {count.count}</p>
      <button onClick={() => store.setState((s) => ({ count: s.count + 1 }))}>
        增加
      </button>
    </div>
  );
}
```

### 15.2 订阅浏览器 API

```jsx
// 订阅网络状态
function useOnlineStatus() {
  return useSyncExternalStore(
    // 订阅
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    // 获取当前值
    () => navigator.onLine,
    // 服务端渲染默认值
    () => true
  );
}

// 订阅窗口尺寸
function useWindowSize() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => ({ width: window.innerWidth, height: window.innerHeight }),
    () => ({ width: 0, height: 0 })
  );
}

// 订阅媒体查询
function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
```

### 15.3 选择性订阅

```jsx
const store = createStore({
  user: { name: '张三', age: 25 },
  posts: []
});

function useStoreSelector(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

function UserName() {
  // 只订阅 user.name
  const name = useStoreSelector((state) => state.user.name);
  return <p>用户名: {name}</p>;
}

function PostCount() {
  // 只订阅 posts 长度
  const count = useStoreSelector((state) => state.posts.length);
  return <p>文章数: {count}</p>;
}
```

---

## 16. useInsertionEffect - CSS-in-JS

### 16.1 基本用法

```jsx
import { useInsertionEffect } from 'react';

// CSS-in-JS 库使用示例
let styleCache = new Map();

function useCSS(rule) {
  useInsertionEffect(() => {
    if (!styleCache.has(rule)) {
      const style = document.createElement('style');
      style.textContent = rule;
      document.head.appendChild(style);
      styleCache.set(rule, style);
    }
  }, [rule]);
}

function Button({ color }) {
  const className = `btn-${color}`;
  useCSS(`.${className} { background-color: ${color}; }`);

  return <button className={className}>按钮</button>;
}
```

### 16.2 执行时机

```jsx
function TimingExample() {
  useInsertionEffect(() => {
    console.log('1. useInsertionEffect'); // 第一个执行
  });

  useLayoutEffect(() => {
    console.log('2. useLayoutEffect'); // 第二个执行
  });

  useEffect(() => {
    console.log('3. useEffect'); // 第三个执行
  });

  return <div>时机示例</div>;
}

// 执行顺序:
// 1. useInsertionEffect（DOM 变更前）
// 2. useLayoutEffect（DOM 变更后，绘制前）
// 3. useEffect（绘制后）
```

---

## 17. 自定义 Hooks

### 17.1 自定义 Hook 基础

```jsx
// 自定义 Hook 必须以 "use" 开头
function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((c) => c + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount((c) => c - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
}

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0, 2);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+2</button>
      <button onClick={decrement}>-2</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

### 17.2 封装副作用

```jsx
// 封装 localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      当前主题: {theme}
    </button>
  );
}
```

### 17.3 封装数据获取

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}

function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  return <div>{user?.name}</div>;
}
```

---

## 18. Hooks 使用规则

### 18.1 只在顶层调用

```jsx
// ❌ 错误：在条件语句中调用
function BadExample({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // 错误！
  }
}

// ❌ 错误：在循环中调用
function BadExample2({ items }) {
  for (const item of items) {
    useEffect(() => {}); // 错误！
  }
}

// ❌ 错误：在嵌套函数中调用
function BadExample3() {
  function handleClick() {
    const [state, setState] = useState(0); // 错误！
  }
}

// ✅ 正确：在顶层调用
function GoodExample({ condition }) {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    if (condition) {
      // 条件逻辑放在 Hook 内部
    }
  }, [condition]);
}
```

### 18.2 只在 React 函数中调用

```jsx
// ✅ 正确：在函数组件中调用
function FunctionComponent() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ 正确：在自定义 Hook 中调用
function useCustomHook() {
  const [state, setState] = useState(0);
  return state;
}

// ❌ 错误：在普通函数中调用
function regularFunction() {
  const [state, setState] = useState(0); // 错误！
}

// ❌ 错误：在类组件中调用
class ClassComponent extends React.Component {
  render() {
    const [state, setState] = useState(0); // 错误！
    return <div>{state}</div>;
  }
}
```

### 18.3 依赖数组规则

```jsx
function DependencyRules() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ 错误：遗漏依赖
  useEffect(() => {
    console.log(count); // 使用了 count 但未列入依赖
  }, []); // 应该是 [count]

  // ❌ 错误：不必要的依赖
  useEffect(() => {
    console.log('只在挂载时执行');
  }, [count]); // count 未被使用，不应该作为依赖

  // ✅ 正确：列出所有使用的依赖
  useEffect(() => {
    console.log(count, name);
  }, [count, name]);

  // ✅ 正确：使用函数式更新避免依赖
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1); // 使用函数式更新，不需要依赖 count
    }, 1000);
    return () => clearInterval(id);
  }, []); // 空依赖是正确的
}
```

---

## 19. 常见自定义 Hooks 合集

### 19.1 状态管理相关

```jsx
// useToggle - 切换布尔值
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}

// useArray - 数组操作
function useArray(initialValue = []) {
  const [array, setArray] = useState(initialValue);

  const push = useCallback((item) => {
    setArray((arr) => [...arr, item]);
  }, []);

  const removeByIndex = useCallback((index) => {
    setArray((arr) => arr.filter((_, i) => i !== index));
  }, []);

  const updateByIndex = useCallback((index, item) => {
    setArray((arr) => arr.map((v, i) => (i === index ? item : v)));
  }, []);

  const clear = useCallback(() => setArray([]), []);

  return { array, set: setArray, push, removeByIndex, updateByIndex, clear };
}

// useSet - Set 操作
function useSet(initialValue = []) {
  const [set, setSet] = useState(new Set(initialValue));

  const add = useCallback((item) => {
    setSet((prev) => new Set([...prev, item]));
  }, []);

  const remove = useCallback((item) => {
    setSet((prev) => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  const has = useCallback((item) => set.has(item), [set]);

  const clear = useCallback(() => setSet(new Set()), []);

  return { set, add, remove, has, clear };
}

// useMap - Map 操作
function useMap(initialValue = []) {
  const [map, setMap] = useState(new Map(initialValue));

  const set = useCallback((key, value) => {
    setMap((prev) => new Map(prev).set(key, value));
  }, []);

  const remove = useCallback((key) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const get = useCallback((key) => map.get(key), [map]);

  const clear = useCallback(() => setMap(new Map()), []);

  return { map, set, remove, get, clear };
}
```

### 19.2 生命周期相关

```jsx
// useMount - 挂载时执行
function useMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}

// useUnmount - 卸载时执行
function useUnmount(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => callbackRef.current();
  }, []);
}

// useUpdateEffect - 更新时执行（跳过首次）
function useUpdateEffect(callback, deps) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return callback();
  }, deps);
}

// useFirstMountState - 是否首次挂载
function useFirstMountState() {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
}
```

### 19.3 DOM 相关

```jsx
// useClickOutside - 点击外部
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}

// useHover - 悬停状态
function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
}

// useElementSize - 元素尺寸
function useElementSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size];
}

// useScrollPosition - 滚动位置
function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}
```

### 19.4 时间相关

```jsx
// useDebounce - 防抖
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

// useThrottle - 节流
function useThrottle(value, interval) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));
      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

// useInterval - 定时器
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// useTimeout - 延时执行
function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}
```

### 19.5 表单相关

```jsx
// useInput - 输入框
function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, onChange, reset, setValue };
}

// useForm - 表单管理
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors
  };
}
```

### 19.6 异步相关

```jsx
// useAsync - 异步操作
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error, isLoading: status === 'pending' };
}

// 使用示例
function UserData({ userId }) {
  const fetchUser = useCallback(() => fetch(`/api/users/${userId}`).then(r => r.json()), [userId]);
  const { data, error, isLoading, execute } = useAsync(fetchUser);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  return (
    <div>
      <p>{data?.name}</p>
      <button onClick={execute}>刷新</button>
    </div>
  );
}
```

---

## 总结

本文档详细介绍了 React Hooks 的所有 API：

### 基础 Hooks
- **useState** - 状态管理
- **useEffect** - 副作用处理
- **useContext** - 上下文消费

### 额外 Hooks
- **useReducer** - 复杂状态管理
- **useCallback** - 函数缓存
- **useMemo** - 计算缓存
- **useRef** - 引用管理
- **useImperativeHandle** - 自定义实例
- **useLayoutEffect** - 同步副作用
- **useDebugValue** - 调试标签

### React 18 新增 Hooks
- **useId** - 唯一 ID 生成
- **useTransition** - 过渡更新
- **useDeferredValue** - 延迟值
- **useSyncExternalStore** - 外部存储订阅
- **useInsertionEffect** - CSS-in-JS

### 自定义 Hooks
- 状态管理、生命周期、DOM 操作
- 时间处理、表单管理、异步操作

掌握这些 Hooks，你就能够充分利用 React 的函数式编程能力！
