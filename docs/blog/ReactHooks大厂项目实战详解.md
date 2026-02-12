# React Hooks 大厂项目实战详解
<div class="doc-toc">
## 目录
1. [Hooks 设计原则](#1-hooks-设计原则)
2. [状态管理 Hooks](#2-状态管理-hooks)
3. [数据请求 Hooks](#3-数据请求-hooks)
4. [表单处理 Hooks](#4-表单处理-hooks)
5. [UI 交互 Hooks](#5-ui-交互-hooks)
6. [性能优化 Hooks](#6-性能优化-hooks)
7. [生命周期 Hooks](#7-生命周期-hooks)
8. [DOM 操作 Hooks](#8-dom-操作-hooks)
9. [业务场景 Hooks](#9-业务场景-hooks)
10. [工具类 Hooks](#10-工具类-hooks)
11. [测试 Hooks](#11-测试-hooks)
12. [Hooks 最佳实践](#12-hooks-最佳实践)


</div>

---

## 1. Hooks 设计原则

### 1.1 单一职责原则

```jsx
// ❌ 不好：一个 Hook 做太多事情
function useBadUserData(userId) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUser(userId),
      fetchPosts(userId),
      fetchComments(userId),
      fetchFollowers(userId)
    ]).then(([user, posts, comments, followers]) => {
      setUser(user);
      setPosts(posts);
      setComments(comments);
      setFollowers(followers);
      setLoading(false);
    });
  }, [userId]);

  return { user, posts, comments, followers, loading };
}

// ✅ 好：拆分为多个专注的 Hooks
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}

function usePosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPosts(userId)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [userId]);

  return { posts, loading };
}

// 组合使用
function UserProfile({ userId }) {
  const { user, loading: userLoading } = useUser(userId);
  const { posts, loading: postsLoading } = usePosts(userId);

  if (userLoading) return <Spinner />;
  
  return (
    <div>
      <UserCard user={user} />
      {postsLoading ? <Spinner /> : <PostList posts={posts} />}
    </div>
  );
}
```

### 1.2 可组合性

```jsx
// 基础 Hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse, setValue };
}

// 基于 useToggle 构建更复杂的 Hook
function useModal() {
  const { value: isOpen, setTrue: open, setFalse: close } = useToggle(false);
  const [data, setData] = useState(null);

  const openWithData = useCallback((modalData) => {
    setData(modalData);
    open();
  }, [open]);

  const closeAndClear = useCallback(() => {
    close();
    setData(null);
  }, [close]);

  return {
    isOpen,
    data,
    open,
    close: closeAndClear,
    openWithData
  };
}

// 组合多个 Hook
function useConfirmModal() {
  const modal = useModal();
  const [pending, setPending] = useState(false);

  const confirm = useCallback(async (onConfirm) => {
    setPending(true);
    try {
      await onConfirm();
      modal.close();
    } finally {
      setPending(false);
    }
  }, [modal]);

  return {
    ...modal,
    pending,
    confirm
  };
}
```

### 1.3 可测试性

```jsx
// 设计可测试的 Hook
function useCounter(initialValue = 0, { min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(c => Math.min(c + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount(c => Math.max(c - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value) => {
    setCount(Math.max(min, Math.min(value, max)));
  }, [min, max]);

  return {
    count,
    increment,
    decrement,
    reset,
    set,
    isAtMin: count === min,
    isAtMax: count === max
  };
}

// 测试
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('should respect max limit', () => {
    const { result } = renderHook(() => useCounter(9, { max: 10 }));
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
    expect(result.current.isAtMax).toBe(true);
  });
});
```

---

## 2. 状态管理 Hooks

### 2.1 useLocalStorage - 本地存储状态

```jsx
function useLocalStorage(key, initialValue) {
  // 获取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // 触发其他标签页同步
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueToStore)
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 删除值
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// 使用
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'zh-CN');

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
  );
}
```

### 2.2 useReducerWithMiddleware - 带中间件的 Reducer

```jsx
function useReducerWithMiddleware(reducer, initialState, middlewares = []) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const dispatchWithMiddleware = useCallback((action) => {
    // 组合中间件
    const chain = middlewares.map(middleware => middleware({
      getState: () => stateRef.current,
      dispatch: (a) => dispatch(a)
    }));

    // 执行中间件链
    const composedDispatch = chain.reduceRight(
      (next, middleware) => middleware(next),
      dispatch
    );

    return composedDispatch(action);
  }, [middlewares]);

  return [state, dispatchWithMiddleware];
}

// 日志中间件
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('prev state:', store.getState());
  console.log('action:', action);
  const result = next(action);
  console.log('next state:', store.getState());
  console.groupEnd();
  return result;
};

// 异步中间件
const asyncMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// 使用
function App() {
  const [state, dispatch] = useReducerWithMiddleware(
    reducer,
    initialState,
    [loggerMiddleware, asyncMiddleware]
  );

  // 可以 dispatch 异步 action
  const fetchData = () => {
    dispatch(async (dispatch, getState) => {
      dispatch({ type: 'FETCH_START' });
      try {
        const data = await api.getData();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    });
  };
}
```

### 2.3 useImmer - 不可变状态更新

```jsx
import { produce } from 'immer';

function useImmer(initialValue) {
  const [state, setState] = useState(initialValue);

  const updateState = useCallback((updater) => {
    if (typeof updater === 'function') {
      setState(produce(updater));
    } else {
      setState(updater);
    }
  }, []);

  return [state, updateState];
}

// 使用 - 直接修改 draft，Immer 会生成新对象
function TodoApp() {
  const [todos, setTodos] = useImmer([
    { id: 1, text: '学习 React', done: false }
  ]);

  const addTodo = (text) => {
    setTodos(draft => {
      draft.push({ id: Date.now(), text, done: false });
    });
  };

  const toggleTodo = (id) => {
    setTodos(draft => {
      const todo = draft.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
      }
    });
  };

  const updateTodo = (id, text) => {
    setTodos(draft => {
      const todo = draft.find(t => t.id === id);
      if (todo) {
        todo.text = text;
      }
    });
  };

  const removeTodo = (id) => {
    setTodos(draft => {
      const index = draft.findIndex(t => t.id === id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => removeTodo(todo.id)}>删除</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 3. 数据请求 Hooks

### 3.1 useRequest - 通用请求 Hook

```jsx
function useRequest(requestFn, options = {}) {
  const {
    manual = false,         // 手动触发
    defaultParams = [],     // 默认参数
    onSuccess,              // 成功回调
    onError,                // 失败回调
    onFinally,              // 完成回调
    refreshDeps = [],       // 依赖刷新
    debounceWait,           // 防抖
    throttleWait,           // 节流
    pollingInterval,        // 轮询间隔
    cacheKey,               // 缓存键
    cacheTime = 5 * 60 * 1000, // 缓存时间
    retryCount = 0,         // 重试次数
    loadingDelay = 0        // 加载延迟
  } = options;

  const [state, setState] = useState({
    data: undefined,
    loading: !manual,
    error: undefined,
    params: defaultParams
  });

  const countRef = useRef(0);
  const pollingTimerRef = useRef();
  const loadingTimerRef = useRef();
  const unmountedRef = useRef(false);

  // 取消之前的请求
  const cancel = useCallback(() => {
    countRef.current += 1;
    setState(s => ({ ...s, loading: false }));
    clearTimeout(pollingTimerRef.current);
    clearTimeout(loadingTimerRef.current);
  }, []);

  // 执行请求
  const run = useCallback(async (...args) => {
    const currentCount = countRef.current;

    // 加载延迟
    if (loadingDelay > 0) {
      loadingTimerRef.current = setTimeout(() => {
        if (!unmountedRef.current && currentCount === countRef.current) {
          setState(s => ({ ...s, loading: true }));
        }
      }, loadingDelay);
    } else {
      setState(s => ({ ...s, loading: true }));
    }

    setState(s => ({ ...s, params: args }));

    // 检查缓存
    if (cacheKey) {
      const cached = getCache(cacheKey);
      if (cached && Date.now() - cached.time < cacheTime) {
        setState(s => ({ ...s, data: cached.data, loading: false }));
        return cached.data;
      }
    }

    // 重试逻辑
    let lastError;
    for (let i = 0; i <= retryCount; i++) {
      try {
        const data = await requestFn(...args);
        
        if (currentCount !== countRef.current || unmountedRef.current) {
          return;
        }

        // 设置缓存
        if (cacheKey) {
          setCache(cacheKey, { data, time: Date.now() });
        }

        setState({ data, loading: false, error: undefined, params: args });
        onSuccess?.(data, args);
        onFinally?.(args, data, undefined);

        // 轮询
        if (pollingInterval) {
          pollingTimerRef.current = setTimeout(() => {
            run(...args);
          }, pollingInterval);
        }

        return data;
      } catch (error) {
        lastError = error;
        if (i < retryCount) {
          await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
      }
    }

    if (currentCount !== countRef.current || unmountedRef.current) {
      return;
    }

    setState(s => ({ ...s, loading: false, error: lastError }));
    onError?.(lastError, args);
    onFinally?.(args, undefined, lastError);
    throw lastError;
  }, [requestFn, cacheKey, cacheTime, retryCount, pollingInterval, loadingDelay, onSuccess, onError, onFinally]);

  // 刷新
  const refresh = useCallback(() => {
    return run(...state.params);
  }, [run, state.params]);

  // 修改数据
  const mutate = useCallback((data) => {
    const newData = typeof data === 'function' ? data(state.data) : data;
    setState(s => ({ ...s, data: newData }));
  }, [state.data]);

  // 防抖/节流处理
  const debouncedRun = useMemo(() => {
    if (debounceWait) {
      return debounce(run, debounceWait);
    }
    if (throttleWait) {
      return throttle(run, throttleWait);
    }
    return run;
  }, [run, debounceWait, throttleWait]);

  // 自动请求
  useEffect(() => {
    if (!manual) {
      run(...defaultParams);
    }
  }, [manual, ...refreshDeps]);

  // 清理
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      cancel();
    };
  }, [cancel]);

  return {
    ...state,
    run: debouncedRun,
    runAsync: run,
    refresh,
    mutate,
    cancel
  };
}

// 使用示例
function UserList() {
  const { data, loading, error, run, refresh } = useRequest(
    (params) => userApi.getList(params),
    {
      defaultParams: [{ page: 1, pageSize: 10 }],
      onSuccess: (data) => {
        console.log('获取成功', data);
      },
      refreshDeps: [], // 依赖变化时自动刷新
      cacheKey: 'userList',
      retryCount: 3
    }
  );

  const handleSearch = (keyword) => {
    run({ page: 1, pageSize: 10, keyword });
  };

  if (loading) return <Spin />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <div>
      <Input.Search onSearch={handleSearch} />
      <Button onClick={refresh}>刷新</Button>
      <Table dataSource={data?.list} />
    </div>
  );
}
```

### 3.2 usePagination - 分页请求

```jsx
function usePagination(requestFn, options = {}) {
  const {
    defaultPageSize = 10,
    defaultCurrent = 1,
    ...restOptions
  } = options;

  const [pagination, setPagination] = useState({
    current: defaultCurrent,
    pageSize: defaultPageSize,
    total: 0
  });

  const { data, loading, run, ...rest } = useRequest(
    async (params) => {
      const result = await requestFn({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params
      });
      return result;
    },
    {
      ...restOptions,
      onSuccess: (data) => {
        setPagination(p => ({
          ...p,
          total: data.total || 0
        }));
        restOptions.onSuccess?.(data);
      }
    }
  );

  // 改变页码
  const changePage = useCallback((page, pageSize) => {
    setPagination(p => ({
      ...p,
      current: page,
      pageSize: pageSize || p.pageSize
    }));
  }, []);

  // 页码变化时重新请求
  useEffect(() => {
    run();
  }, [pagination.current, pagination.pageSize]);

  return {
    data: data?.list || [],
    loading,
    pagination: {
      ...pagination,
      onChange: changePage
    },
    run,
    ...rest
  };
}

// 使用
function ProductList() {
  const { data, loading, pagination } = usePagination(
    (params) => productApi.getList(params)
  );

  return (
    <div>
      <Table
        dataSource={data}
        loading={loading}
        pagination={pagination}
        columns={columns}
      />
    </div>
  );
}
```

### 3.3 useInfiniteScroll - 无限滚动

```jsx
function useInfiniteScroll(requestFn, options = {}) {
  const {
    target,                  // 滚动容器
    threshold = 100,         // 触发距离
    isNoMore,               // 是否没有更多
    ...restOptions
  } = options;

  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const noMoreRef = useRef(false);

  const { loading, run } = useRequest(
    async () => {
      const result = await requestFn(pageRef.current);
      return result;
    },
    {
      ...restOptions,
      manual: true,
      onSuccess: (result) => {
        if (pageRef.current === 1) {
          setData(result.list);
        } else {
          setData(prev => [...prev, ...result.list]);
        }
        
        if (isNoMore) {
          noMoreRef.current = isNoMore(result);
        } else {
          noMoreRef.current = result.list.length === 0;
        }
        
        restOptions.onSuccess?.(result);
      }
    }
  );

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loadingMore || noMoreRef.current) return;
    
    setLoadingMore(true);
    pageRef.current += 1;
    
    try {
      await run();
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, run]);

  // 刷新（重置为第一页）
  const refresh = useCallback(async () => {
    pageRef.current = 1;
    noMoreRef.current = false;
    await run();
  }, [run]);

  // 监听滚动
  useEffect(() => {
    const container = target?.current || window;
    
    const handleScroll = () => {
      if (loadingMore || noMoreRef.current || loading) return;

      const { scrollHeight, scrollTop, clientHeight } = 
        container === window 
          ? document.documentElement 
          : container;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [target, threshold, loadMore, loadingMore, loading]);

  // 初始加载
  useEffect(() => {
    run();
  }, []);

  return {
    data,
    loading,
    loadingMore,
    noMore: noMoreRef.current,
    loadMore,
    refresh
  };
}

// 使用
function FeedList() {
  const containerRef = useRef(null);
  
  const { data, loading, loadingMore, noMore, refresh } = useInfiniteScroll(
    (page) => feedApi.getList({ page, pageSize: 20 }),
    {
      target: containerRef,
      isNoMore: (result) => result.list.length < 20
    }
  );

  return (
    <div ref={containerRef} className="feed-container">
      <PullToRefresh onRefresh={refresh}>
        {data.map(item => (
          <FeedItem key={item.id} item={item} />
        ))}
        {loadingMore && <Spin />}
        {noMore && <div>没有更多了</div>}
      </PullToRefresh>
    </div>
  );
}
```

---

## 4. 表单处理 Hooks

### 4.1 useForm - 完整表单管理

```jsx
function useForm(initialValues = {}, options = {}) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validate: validateFn
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const initialValuesRef = useRef(initialValues);

  // 验证单个字段
  const validateField = useCallback(async (name, value) => {
    if (!validateFn) return;
    
    setIsValidating(true);
    try {
      const fieldErrors = await validateFn({ [name]: value });
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
      return !fieldErrors[name];
    } finally {
      setIsValidating(false);
    }
  }, [validateFn]);

  // 验证所有字段
  const validateAll = useCallback(async () => {
    if (!validateFn) return true;
    
    setIsValidating(true);
    try {
      const allErrors = await validateFn(values);
      setErrors(allErrors);
      // 标记所有字段为已触摸
      setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return Object.keys(allErrors).length === 0;
    } finally {
      setIsValidating(false);
    }
  }, [values, validateFn]);

  // 设置字段值
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange && touched[name]) {
      validateField(name, value);
    }
  }, [validateOnChange, touched, validateField]);

  // 批量设置值
  const setFieldsValue = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // 设置字段错误
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // 设置字段触摸状态
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
    
    if (isTouched && validateOnBlur) {
      validateField(name, values[name]);
    }
  }, [validateOnBlur, values, validateField]);

  // 处理变化
  const handleChange = useCallback((nameOrEvent) => {
    return (valueOrEvent) => {
      let name, value;
      
      if (typeof nameOrEvent === 'string') {
        name = nameOrEvent;
        value = valueOrEvent?.target ? valueOrEvent.target.value : valueOrEvent;
      } else {
        const { name: n, value: v, type, checked } = nameOrEvent.target;
        name = n;
        value = type === 'checkbox' ? checked : v;
      }
      
      setFieldValue(name, value);
    };
  }, [setFieldValue]);

  // 处理失焦
  const handleBlur = useCallback((nameOrEvent) => {
    return () => {
      const name = typeof nameOrEvent === 'string' 
        ? nameOrEvent 
        : nameOrEvent.target.name;
      setFieldTouched(name, true);
    };
  }, [setFieldTouched]);

  // 提交表单
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e?.preventDefault();
      
      const isValid = await validateAll();
      if (!isValid) return;
      
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateAll]);

  // 重置表单
  const resetForm = useCallback((newValues) => {
    setValues(newValues || initialValuesRef.current);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  // 获取字段属性
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange(name),
    onBlur: handleBlur(name)
  }), [values, handleChange, handleBlur]);

  // 获取字段元数据
  const getFieldMeta = useCallback((name) => ({
    value: values[name],
    error: errors[name],
    touched: touched[name],
    initialValue: initialValuesRef.current[name]
  }), [values, errors, touched]);

  // 是否有错误
  const hasError = useMemo(() => {
    return Object.values(errors).some(Boolean);
  }, [errors]);

  // 是否已修改
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isDirty,
    hasError,
    setFieldValue,
    setFieldsValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField,
    validateAll,
    getFieldProps,
    getFieldMeta
  };
}

// 使用
function RegistrationForm() {
  const form = useForm(
    {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    {
      validate: async (values) => {
        const errors = {};
        
        if (!values.username) {
          errors.username = '请输入用户名';
        } else if (values.username.length < 3) {
          errors.username = '用户名至少3个字符';
        }
        
        if (!values.email) {
          errors.email = '请输入邮箱';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = '邮箱格式不正确';
        }
        
        if (!values.password) {
          errors.password = '请输入密码';
        } else if (values.password.length < 6) {
          errors.password = '密码至少6个字符';
        }
        
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = '两次密码不一致';
        }
        
        return errors;
      }
    }
  );

  const handleSubmit = async (values) => {
    await userApi.register(values);
    message.success('注册成功');
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormItem
        label="用户名"
        error={form.touched.username && form.errors.username}
      >
        <input {...form.getFieldProps('username')} />
      </FormItem>

      <FormItem
        label="邮箱"
        error={form.touched.email && form.errors.email}
      >
        <input {...form.getFieldProps('email')} type="email" />
      </FormItem>

      <FormItem
        label="密码"
        error={form.touched.password && form.errors.password}
      >
        <input {...form.getFieldProps('password')} type="password" />
      </FormItem>

      <FormItem
        label="确认密码"
        error={form.touched.confirmPassword && form.errors.confirmPassword}
      >
        <input {...form.getFieldProps('confirmPassword')} type="password" />
      </FormItem>

      <button type="submit" disabled={form.isSubmitting || form.hasError}>
        {form.isSubmitting ? '提交中...' : '注册'}
      </button>
    </form>
  );
}
```

### 4.2 useFieldArray - 动态字段数组

```jsx
function useFieldArray(form, name) {
  const fields = form.values[name] || [];

  const append = useCallback((value) => {
    form.setFieldValue(name, [...fields, value]);
  }, [form, name, fields]);

  const prepend = useCallback((value) => {
    form.setFieldValue(name, [value, ...fields]);
  }, [form, name, fields]);

  const insert = useCallback((index, value) => {
    const newFields = [...fields];
    newFields.splice(index, 0, value);
    form.setFieldValue(name, newFields);
  }, [form, name, fields]);

  const remove = useCallback((index) => {
    form.setFieldValue(name, fields.filter((_, i) => i !== index));
  }, [form, name, fields]);

  const move = useCallback((from, to) => {
    const newFields = [...fields];
    const [removed] = newFields.splice(from, 1);
    newFields.splice(to, 0, removed);
    form.setFieldValue(name, newFields);
  }, [form, name, fields]);

  const swap = useCallback((indexA, indexB) => {
    const newFields = [...fields];
    [newFields[indexA], newFields[indexB]] = [newFields[indexB], newFields[indexA]];
    form.setFieldValue(name, newFields);
  }, [form, name, fields]);

  const update = useCallback((index, value) => {
    const newFields = [...fields];
    newFields[index] = value;
    form.setFieldValue(name, newFields);
  }, [form, name, fields]);

  const replace = useCallback((newFields) => {
    form.setFieldValue(name, newFields);
  }, [form, name]);

  return {
    fields: fields.map((field, index) => ({
      ...field,
      id: field.id || index,
      index
    })),
    append,
    prepend,
    insert,
    remove,
    move,
    swap,
    update,
    replace
  };
}

// 使用
function OrderForm() {
  const form = useForm({
    orderNo: '',
    items: [{ product: '', quantity: 1, price: 0 }]
  });

  const { fields, append, remove } = useFieldArray(form, 'items');

  return (
    <form>
      <input {...form.getFieldProps('orderNo')} placeholder="订单号" />
      
      {fields.map((field, index) => (
        <div key={field.id} className="item-row">
          <input
            value={field.product}
            onChange={(e) => {
              const newItems = [...form.values.items];
              newItems[index] = { ...newItems[index], product: e.target.value };
              form.setFieldValue('items', newItems);
            }}
            placeholder="商品名称"
          />
          <input
            type="number"
            value={field.quantity}
            onChange={(e) => {
              const newItems = [...form.values.items];
              newItems[index] = { ...newItems[index], quantity: Number(e.target.value) };
              form.setFieldValue('items', newItems);
            }}
            placeholder="数量"
          />
          <button type="button" onClick={() => remove(index)}>
            删除
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => append({ product: '', quantity: 1, price: 0 })}
      >
        添加商品
      </button>
    </form>
  );
}
```

---

## 5. UI 交互 Hooks

### 5.1 useModal - 模态框管理

```jsx
function useModal() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const open = useCallback((initialData = null) => {
    setData(initialData);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    // 延迟清除数据，等待动画完成
    setTimeout(() => setData(null), 300);
  }, []);

  const confirm = useCallback(async (onConfirm) => {
    setLoading(true);
    try {
      await onConfirm(data);
      close();
    } catch (error) {
      // 不关闭，让用户看到错误
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data, close]);

  return {
    visible,
    data,
    loading,
    open,
    close,
    confirm,
    modalProps: {
      open: visible,
      onCancel: close,
      confirmLoading: loading
    }
  };
}

// 使用
function UserManage() {
  const editModal = useModal();
  const deleteModal = useModal();

  const handleEdit = async (values) => {
    await userApi.update(editModal.data.id, values);
    message.success('更新成功');
    refreshList();
  };

  const handleDelete = async () => {
    await userApi.delete(deleteModal.data.id);
    message.success('删除成功');
    refreshList();
  };

  return (
    <div>
      <Table
        columns={[
          { title: '姓名', dataIndex: 'name' },
          {
            title: '操作',
            render: (_, record) => (
              <>
                <Button onClick={() => editModal.open(record)}>编辑</Button>
                <Button danger onClick={() => deleteModal.open(record)}>删除</Button>
              </>
            )
          }
        ]}
      />

      <Modal title="编辑用户" {...editModal.modalProps}>
        <UserForm
          initialValues={editModal.data}
          onSubmit={(values) => editModal.confirm(() => handleEdit(values))}
        />
      </Modal>

      <Modal
        title="确认删除"
        {...deleteModal.modalProps}
        onOk={() => deleteModal.confirm(handleDelete)}
      >
        确定要删除用户 {deleteModal.data?.name} 吗？
      </Modal>
    </div>
  );
}
```

### 5.2 useSelection - 选择管理

```jsx
function useSelection(initialSelected = [], options = {}) {
  const {
    maxSelection = Infinity,
    onChange
  } = options;

  const [selected, setSelected] = useState(new Set(initialSelected));

  // 选择单个
  const select = useCallback((item) => {
    setSelected(prev => {
      if (prev.size >= maxSelection && !prev.has(item)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(item);
      onChange?.(Array.from(next));
      return next;
    });
  }, [maxSelection, onChange]);

  // 取消选择
  const deselect = useCallback((item) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(item);
      onChange?.(Array.from(next));
      return next;
    });
  }, [onChange]);

  // 切换选择
  const toggle = useCallback((item) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else if (next.size < maxSelection) {
        next.add(item);
      }
      onChange?.(Array.from(next));
      return next;
    });
  }, [maxSelection, onChange]);

  // 全选
  const selectAll = useCallback((items) => {
    const toSelect = items.slice(0, maxSelection);
    setSelected(new Set(toSelect));
    onChange?.(toSelect);
  }, [maxSelection, onChange]);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelected(new Set());
    onChange?.([]);
  }, [onChange]);

  // 是否已选择
  const isSelected = useCallback((item) => {
    return selected.has(item);
  }, [selected]);

  return {
    selected: Array.from(selected),
    selectedSet: selected,
    select,
    deselect,
    toggle,
    selectAll,
    clearSelection,
    isSelected,
    count: selected.size,
    isEmpty: selected.size === 0,
    isMaxed: selected.size >= maxSelection
  };
}

// 使用
function PhotoGallery({ photos }) {
  const selection = useSelection([], {
    maxSelection: 9,
    onChange: (selected) => console.log('Selected:', selected)
  });

  return (
    <div>
      <div className="toolbar">
        <span>已选择 {selection.count}/9</span>
        <Button onClick={() => selection.selectAll(photos.map(p => p.id))}>
          全选
        </Button>
        <Button onClick={selection.clearSelection}>清空</Button>
      </div>

      <div className="photo-grid">
        {photos.map(photo => (
          <div
            key={photo.id}
            className={`photo ${selection.isSelected(photo.id) ? 'selected' : ''}`}
            onClick={() => selection.toggle(photo.id)}
          >
            <img src={photo.url} alt={photo.name} />
            {selection.isSelected(photo.id) && <CheckIcon />}
          </div>
        ))}
      </div>

      <Button
        type="primary"
        disabled={selection.isEmpty}
        onClick={() => handleUpload(selection.selected)}
      >
        上传 ({selection.count})
      </Button>
    </div>
  );
}
```

### 5.3 useVirtualList - 虚拟列表

```jsx
function useVirtualList(list, options) {
  const {
    containerRef,
    itemHeight,
    overscan = 5
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // 监听滚动
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    const handleResize = () => {
      setContainerHeight(container.clientHeight);
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  // 计算可见范围
  const { startIndex, endIndex, offsetTop } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    const startIndex = Math.max(0, start - overscan);
    const endIndex = Math.min(list.length - 1, start + visibleCount + overscan);
    const offsetTop = startIndex * itemHeight;

    return { startIndex, endIndex, offsetTop };
  }, [scrollTop, containerHeight, itemHeight, list.length, overscan]);

  // 可见项
  const visibleList = useMemo(() => {
    return list.slice(startIndex, endIndex + 1).map((item, index) => ({
      data: item,
      index: startIndex + index
    }));
  }, [list, startIndex, endIndex]);

  // 总高度
  const totalHeight = list.length * itemHeight;

  return {
    list: visibleList,
    containerProps: {
      ref: containerRef,
      style: {
        overflow: 'auto',
        position: 'relative'
      }
    },
    wrapperProps: {
      style: {
        height: totalHeight,
        position: 'relative'
      }
    },
    listProps: {
      style: {
        position: 'absolute',
        top: offsetTop,
        left: 0,
        right: 0
      }
    },
    scrollTo: (index) => {
      containerRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };
}

// 使用
function VirtualList({ items }) {
  const containerRef = useRef(null);
  
  const { list, containerProps, wrapperProps, listProps } = useVirtualList(items, {
    containerRef,
    itemHeight: 50,
    overscan: 3
  });

  return (
    <div {...containerProps} style={{ ...containerProps.style, height: 400 }}>
      <div {...wrapperProps}>
        <div {...listProps}>
          {list.map(({ data, index }) => (
            <div key={index} style={{ height: 50 }}>
              {data.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 6. 性能优化 Hooks

### 6.1 useDebounce - 防抖

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 防抖函数版本
function useDebounceFn(fn, delay, options = {}) {
  const { leading = false, trailing = true } = options;
  
  const fnRef = useRef(fn);
  fnRef.current = fn;
  
  const timerRef = useRef();
  const leadingRef = useRef(true);

  const run = useCallback((...args) => {
    // leading 执行
    if (leading && leadingRef.current) {
      fnRef.current(...args);
      leadingRef.current = false;
    }

    clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      // trailing 执行
      if (trailing) {
        fnRef.current(...args);
      }
      leadingRef.current = true;
    }, delay);
  }, [delay, leading, trailing]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    leadingRef.current = true;
  }, []);

  const flush = useCallback(() => {
    clearTimeout(timerRef.current);
    fnRef.current();
    leadingRef.current = true;
  }, []);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { run, cancel, flush };
}

// 使用
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  // 搜索
  const { data, loading } = useRequest(
    () => searchApi.search(debouncedQuery),
    {
      refreshDeps: [debouncedQuery],
      manual: !debouncedQuery
    }
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
      />
      {loading && <Spin />}
      {data && <SearchResults results={data} />}
    </div>
  );
}
```

### 6.2 useThrottle - 节流

```jsx
function useThrottle(value, interval) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdatedRef.current;

    if (timeSinceLastUpdate >= interval) {
      lastUpdatedRef.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdatedRef.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// 节流函数版本
function useThrottleFn(fn, interval, options = {}) {
  const { leading = true, trailing = true } = options;
  
  const fnRef = useRef(fn);
  fnRef.current = fn;
  
  const timerRef = useRef();
  const lastExecRef = useRef(0);
  const pendingArgsRef = useRef();

  const run = useCallback((...args) => {
    const now = Date.now();
    const elapsed = now - lastExecRef.current;

    const execute = () => {
      lastExecRef.current = Date.now();
      fnRef.current(...args);
      pendingArgsRef.current = null;
    };

    clearTimeout(timerRef.current);

    if (elapsed >= interval) {
      if (leading) {
        execute();
      } else {
        pendingArgsRef.current = args;
        timerRef.current = setTimeout(execute, interval);
      }
    } else {
      pendingArgsRef.current = args;
      if (trailing) {
        timerRef.current = setTimeout(execute, interval - elapsed);
      }
    }
  }, [interval, leading, trailing]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    pendingArgsRef.current = null;
  }, []);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { run, cancel };
}

// 使用：滚动事件处理
function ScrollTracker() {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const { run: handleScroll } = useThrottleFn(
    () => {
      setScrollPosition(window.scrollY);
    },
    100
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>滚动位置: {scrollPosition}</div>;
}
```

### 6.3 useMemoizedFn - 持久化函数

```jsx
function useMemoizedFn(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const memoizedFn = useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = function (...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
}

// 使用：避免因为函数引用变化导致子组件重渲染
function Parent() {
  const [count, setCount] = useState(0);

  // 即使 count 变化，handleClick 的引用也不会变
  const handleClick = useMemoizedFn(() => {
    console.log('Current count:', count);
    setCount(c => c + 1);
  });

  return (
    <div>
      <p>Count: {count}</p>
      <MemoizedChild onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
```

---

## 7. 生命周期 Hooks

### 7.1 useMount - 挂载时执行

```jsx
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []);
}

// 使用
function Component() {
  useMount(() => {
    console.log('组件已挂载');
    // 初始化操作
  });
}
```

### 7.2 useUnmount - 卸载时执行

```jsx
function useUnmount(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}

// 使用
function Component() {
  useUnmount(() => {
    console.log('组件将卸载');
    // 清理操作
  });
}
```

### 7.3 useUpdateEffect - 更新时执行

```jsx
function useUpdateEffect(effect, deps) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    return effect();
  }, deps);
}

// 使用
function Component({ id }) {
  useUpdateEffect(() => {
    console.log('id 更新了，但不是首次渲染');
    // 只在更新时执行，跳过首次渲染
  }, [id]);
}
```

### 7.4 useUpdateLayoutEffect - 更新时同步执行

```jsx
function useUpdateLayoutEffect(effect, deps) {
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    return effect();
  }, deps);
}
```

### 7.5 useDeepCompareEffect - 深比较依赖

```jsx
import isEqual from 'lodash/isEqual';

function useDeepCompareEffect(effect, deps) {
  const ref = useRef(deps);

  if (!isEqual(deps, ref.current)) {
    ref.current = deps;
  }

  useEffect(effect, [ref.current]);
}

// 使用：当依赖是对象时避免不必要的重渲染
function Component({ config }) {
  useDeepCompareEffect(() => {
    console.log('config 深度变化了');
  }, [config]);
}
```

---

## 8. DOM 操作 Hooks

### 8.1 useClickOutside - 点击外部

```jsx
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// 使用
function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    setOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && (
        <ul className="dropdown-menu">
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>
      )}
    </div>
  );
}
```

### 8.2 useEventListener - 事件监听

```jsx
function useEventListener(eventName, handler, element = window, options) {
  const savedHandler = useRef(handler);
  savedHandler.current = handler;

  useEffect(() => {
    const targetElement = element?.current ?? element;
    if (!targetElement?.addEventListener) return;

    const eventListener = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

// 使用
function KeyboardShortcuts() {
  useEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      console.log('Save triggered');
    }
  });
}
```

### 8.3 useIntersectionObserver - 交叉观察

```jsx
function useIntersectionObserver(ref, options = {}) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return entry;
}

// 使用：懒加载图片
function LazyImage({ src, alt }) {
  const imageRef = useRef(null);
  const entry = useIntersectionObserver(imageRef, { threshold: 0.1 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (entry?.isIntersecting && !loaded) {
      setLoaded(true);
    }
  }, [entry, loaded]);

  return (
    <div ref={imageRef} className="lazy-image-wrapper">
      {loaded ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
}
```

### 8.4 useSize - 元素尺寸

```jsx
function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
}

// 使用
function ResponsiveComponent() {
  const containerRef = useRef(null);
  const { width, height } = useSize(containerRef);

  const columns = width > 800 ? 4 : width > 400 ? 2 : 1;

  return (
    <div ref={containerRef}>
      <p>容器尺寸: {width} x {height}</p>
      <Grid columns={columns}>
        {items.map(item => <GridItem key={item.id} item={item} />)}
      </Grid>
    </div>
  );
}
```

---

## 9. 业务场景 Hooks

### 9.1 useAuth - 认证管理

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化检查
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.getUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 使用
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    try {
      await login(values);
      message.success('登录成功');
    } catch (error) {
      message.error(error.message);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### 9.2 usePermission - 权限检查

```jsx
function usePermission() {
  const { user } = useAuth();
  const permissions = user?.permissions || [];

  const hasPermission = useCallback((permission) => {
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  }, [permissions]);

  const hasAnyPermission = useCallback((requiredPermissions) => {
    if (permissions.includes('*')) return true;
    return requiredPermissions.some(p => permissions.includes(p));
  }, [permissions]);

  const hasAllPermissions = useCallback((requiredPermissions) => {
    if (permissions.includes('*')) return true;
    return requiredPermissions.every(p => permissions.includes(p));
  }, [permissions]);

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}

// 使用
function AdminPanel() {
  const { hasPermission } = usePermission();

  return (
    <div>
      {hasPermission('admin:dashboard') && <AdminDashboard />}
      {hasPermission('admin:users') && <UserManagement />}
      {hasPermission('admin:settings') && <AdminSettings />}
    </div>
  );
}
```

### 9.3 useWebSocket - WebSocket 连接

```jsx
function useWebSocket(url, options = {}) {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5
  } = options;

  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      setReadyState(WebSocket.OPEN);
      reconnectCountRef.current = 0;
      onOpen?.(event);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
      onMessage?.(data, event);
    };

    ws.onerror = (event) => {
      onError?.(event);
    };

    ws.onclose = (event) => {
      setReadyState(WebSocket.CLOSED);
      onClose?.(event);

      // 重连
      if (reconnect && reconnectCountRef.current < reconnectAttempts) {
        reconnectTimerRef.current = setTimeout(() => {
          reconnectCountRef.current++;
          connect();
        }, reconnectInterval);
      }
    };

    wsRef.current = ws;
  }, [url, onOpen, onMessage, onError, onClose, reconnect, reconnectInterval, reconnectAttempts]);

  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimerRef.current);
    wsRef.current?.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    readyState,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect
  };
}

// 使用
function Chat() {
  const [messages, setMessages] = useState([]);
  
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    'wss://chat.example.com',
    {
      onMessage: (data) => {
        setMessages(prev => [...prev, data]);
      }
    }
  );

  const handleSend = (text) => {
    sendMessage({ type: 'message', content: text });
  };

  return (
    <div>
      <div className="status">
        {readyState === WebSocket.OPEN ? '已连接' : '连接中...'}
      </div>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
```

---

## 10. 工具类 Hooks

### 10.1 useCopyToClipboard - 复制到剪贴板

```jsx
function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      setError(new Error('Clipboard API not supported'));
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setError(null);
      return true;
    } catch (err) {
      setError(err);
      setCopiedText(null);
      return false;
    }
  }, []);

  return { copiedText, error, copy };
}

// 使用
function CopyButton({ text }) {
  const { copy, copiedText } = useCopyToClipboard();
  const isCopied = copiedText === text;

  return (
    <button onClick={() => copy(text)}>
      {isCopied ? '已复制' : '复制'}
    </button>
  );
}
```

### 10.2 useCountdown - 倒计时

```jsx
function useCountdown(initialSeconds, options = {}) {
  const { onComplete, interval = 1000 } = options;
  
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback((newSeconds) => {
    if (newSeconds !== undefined) {
      setSeconds(newSeconds);
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds = initialSeconds) => {
    setSeconds(newSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, interval, onComplete]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formatted: formatTime(seconds)
  };
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 使用
function VerificationCode() {
  const { seconds, isRunning, start, formatted } = useCountdown(60, {
    onComplete: () => console.log('倒计时结束')
  });

  const handleSendCode = async () => {
    await sendVerificationCode();
    start();
  };

  return (
    <button onClick={handleSendCode} disabled={isRunning}>
      {isRunning ? `${formatted} 后重新发送` : '发送验证码'}
    </button>
  );
}
```

### 10.3 usePrevious - 上一个值

```jsx
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// 使用
function Component({ value }) {
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (prevValue !== undefined && value !== prevValue) {
      console.log(`值从 ${prevValue} 变为 ${value}`);
    }
  }, [value, prevValue]);
}
```

---

## 11. 测试 Hooks

### 11.1 测试自定义 Hook

```jsx
// useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should decrement', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(9);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(7);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });

  it('should update when props change', () => {
    const { result, rerender } = renderHook(
      ({ initialValue }) => useCounter(initialValue),
      { initialProps: { initialValue: 0 } }
    );
    
    expect(result.current.count).toBe(0);
    
    rerender({ initialValue: 10 });
    
    // 注意：这取决于 Hook 的实现
    // 如果 Hook 不响应 props 变化，count 仍然是 0
  });
});
```

### 11.2 测试异步 Hook

```jsx
// useAsync.test.js
import { renderHook, waitFor } from '@testing-library/react';
import useAsync from './useAsync';

describe('useAsync', () => {
  it('should handle successful async operation', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: 'test' });
    
    const { result } = renderHook(() => useAsync(mockFn));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toEqual({ data: 'test' });
    expect(result.current.error).toBeNull();
  });

  it('should handle error', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useAsync(mockFn));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
  });

  it('should not update state after unmount', async () => {
    const mockFn = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('data'), 100))
    );
    
    const { result, unmount } = renderHook(() => useAsync(mockFn));
    
    unmount();
    
    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // 应该没有错误（状态未更新）
  });
});
```

---

## 12. Hooks 最佳实践

### 12.1 命名规范

```jsx
// ✅ 好的命名
function useUser() {}
function useLocalStorage() {}
function useWindowSize() {}
function useOnClickOutside() {}
function usePrevious() {}

// ❌ 不好的命名
function user() {}  // 缺少 use 前缀
function UseUser() {} // 首字母大写
function useGetUser() {} // 不必要的 get
```

### 12.2 依赖数组

```jsx
// ✅ 正确：列出所有使用的依赖
useEffect(() => {
  fetchData(userId, filters);
}, [userId, filters]);

// ❌ 错误：遗漏依赖
useEffect(() => {
  fetchData(userId, filters);  // filters 未列入依赖
}, [userId]);

// ✅ 使用 useCallback 稳定函数引用
const fetchData = useCallback(() => {
  api.getData(userId);
}, [userId]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 12.3 避免条件调用

```jsx
// ❌ 错误：条件调用 Hook
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0);
  }
}

// ✅ 正确：无条件调用，条件使用
function Component({ condition }) {
  const [state, setState] = useState(0);
  
  // 条件使用
  if (!condition) {
    return null;
  }
  
  return <div>{state}</div>;
}
```

### 12.4 提取复杂逻辑

```jsx
// ❌ 不好：组件内逻辑过多
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  // ... 更多逻辑
}

// ✅ 好：提取到自定义 Hook
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  // 组件只关注渲染
}
```

---

## 总结

本文档详细介绍了 React Hooks 在大厂项目中的实战应用：

1. **设计原则** - 单一职责、可组合、可测试
2. **状态管理** - localStorage、Immer、中间件
3. **数据请求** - useRequest、分页、无限滚动
4. **表单处理** - useForm、动态字段
5. **UI 交互** - Modal、Selection、虚拟列表
6. **性能优化** - 防抖、节流、持久化函数
7. **生命周期** - Mount、Unmount、Update
8. **DOM 操作** - 点击外部、事件监听、交叉观察
9. **业务场景** - 认证、权限、WebSocket
10. **工具类** - 复制、倒计时、上一值
11. **测试** - 同步/异步 Hook 测试
12. **最佳实践** - 命名、依赖、提取逻辑

这些都是大厂项目中常用的 Hooks 实战技巧！
