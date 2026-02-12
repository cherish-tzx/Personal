# React 大厂项目实战详解
<div class="doc-toc">
## 目录
1. [项目架构设计](#1-项目架构设计)
2. [组件设计模式](#2-组件设计模式)
3. [状态管理实战](#3-状态管理实战)
4. [路由管理实战](#4-路由管理实战)
5. [数据请求封装](#5-数据请求封装)
6. [表单处理实战](#6-表单处理实战)
7. [权限管理系统](#7-权限管理系统)
8. [性能优化实战](#8-性能优化实战)
9. [错误处理机制](#9-错误处理机制)
10. [国际化方案](#10-国际化方案)
11. [单元测试实战](#11-单元测试实战)
12. [CI/CD 部署](#12-cicd-部署)


</div>

---

## 1. 项目架构设计

### 1.1 大厂标准目录结构

```
src/
├── api/                    # API 请求层
│   ├── index.js           # API 统一导出
│   ├── request.js         # Axios 封装
│   ├── user.js            # 用户相关 API
│   ├── product.js         # 产品相关 API
│   └── order.js           # 订单相关 API
├── assets/                 # 静态资源
│   ├── images/            # 图片
│   ├── icons/             # 图标
│   └── styles/            # 全局样式
├── components/             # 通用组件
│   ├── common/            # 基础组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   ├── business/          # 业务组件
│   │   ├── UserCard/
│   │   └── ProductList/
│   └── layout/            # 布局组件
│       ├── Header/
│       ├── Sidebar/
│       └── Footer/
├── config/                 # 配置文件
│   ├── index.js           # 环境配置
│   ├── routes.js          # 路由配置
│   └── menu.js            # 菜单配置
├── hooks/                  # 自定义 Hooks
│   ├── useAuth.js
│   ├── useRequest.js
│   └── useTable.js
├── pages/                  # 页面组件
│   ├── Home/
│   ├── Login/
│   ├── Dashboard/
│   └── User/
├── store/                  # 状态管理
│   ├── index.js
│   ├── modules/
│   │   ├── user.js
│   │   └── app.js
│   └── actions/
├── utils/                  # 工具函数
│   ├── auth.js            # 认证相关
│   ├── format.js          # 格式化
│   ├── validate.js        # 验证
│   └── storage.js         # 存储
├── constants/              # 常量定义
│   ├── api.js
│   └── enum.js
├── services/               # 业务服务层
│   ├── userService.js
│   └── orderService.js
├── App.js
└── index.js
```

### 1.2 模块化设计原则

```jsx
// 按功能模块组织代码
// modules/user/
// ├── components/      # 模块私有组件
// ├── hooks/           # 模块私有 hooks
// ├── services/        # 模块业务逻辑
// ├── store/           # 模块状态
// ├── types/           # 模块类型定义
// ├── utils/           # 模块工具函数
// ├── pages/           # 模块页面
// └── index.js         # 模块导出

// modules/user/index.js
export { UserList, UserDetail, UserForm } from './pages';
export { UserCard, UserAvatar } from './components';
export { useUser, useUserList } from './hooks';
export { userActions, userReducer } from './store';

// 使用模块
import { UserList, useUser } from '@/modules/user';
```

### 1.3 环境配置

```jsx
// config/index.js
const env = process.env.NODE_ENV;

const config = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    ENABLE_MOCK: true,
    DEBUG: true
  },
  test: {
    API_BASE_URL: 'https://test-api.example.com',
    ENABLE_MOCK: false,
    DEBUG: true
  },
  production: {
    API_BASE_URL: 'https://api.example.com',
    ENABLE_MOCK: false,
    DEBUG: false
  }
};

export default config[env] || config.development;

// .env.development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development

// .env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production

// 使用
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## 2. 组件设计模式

### 2.1 容器组件与展示组件分离

```jsx
// 展示组件 - 只负责 UI 渲染
// components/UserList/UserList.jsx
function UserList({ users, loading, onUserClick, onDelete }) {
  if (loading) {
    return <Skeleton count={5} />;
  }

  return (
    <ul className="user-list">
      {users.map(user => (
        <li key={user.id} onClick={() => onUserClick(user.id)}>
          <UserAvatar src={user.avatar} />
          <span>{user.name}</span>
          <span>{user.email}</span>
          <Button onClick={() => onDelete(user.id)}>删除</Button>
        </li>
      ))}
    </ul>
  );
}

// 容器组件 - 负责数据获取和业务逻辑
// pages/UserManage/UserManage.jsx
function UserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getList();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleDelete = async (userId) => {
    await userApi.delete(userId);
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <UserList
      users={users}
      loading={loading}
      onUserClick={handleUserClick}
      onDelete={handleDelete}
    />
  );
}
```

### 2.2 复合组件模式

```jsx
// 复合组件 - 灵活组合的组件群
// components/Card/Card.jsx
const CardContext = createContext();

function Card({ children, className }) {
  return (
    <CardContext.Provider value={{}}>
      <div className={`card ${className}`}>{children}</div>
    </CardContext.Provider>
  );
}

Card.Header = function CardHeader({ children, extra }) {
  return (
    <div className="card-header">
      <div className="card-title">{children}</div>
      {extra && <div className="card-extra">{extra}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
};

Card.Footer = function CardFooter({ children, align = 'right' }) {
  return (
    <div className={`card-footer card-footer-${align}`}>
      {children}
    </div>
  );
};

// 使用
function ProductCard({ product }) {
  return (
    <Card>
      <Card.Header extra={<Tag>{product.status}</Tag>}>
        {product.name}
      </Card.Header>
      <Card.Body>
        <p>{product.description}</p>
        <p className="price">¥{product.price}</p>
      </Card.Body>
      <Card.Footer>
        <Button>加入购物车</Button>
        <Button type="primary">立即购买</Button>
      </Card.Footer>
    </Card>
  );
}
```

### 2.3 Render Props 模式

```jsx
// 通用数据加载组件
function DataLoader({ url, render, renderLoading, renderError }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(url).then(r => r.json());
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  if (loading) return renderLoading?.() || <div>加载中...</div>;
  if (error) return renderError?.(error) || <div>加载失败</div>;
  return render(data);
}

// 使用
function UserProfile({ userId }) {
  return (
    <DataLoader
      url={`/api/users/${userId}`}
      render={(user) => (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      )}
      renderLoading={() => <Skeleton />}
      renderError={(error) => <Alert type="error">{error.message}</Alert>}
    />
  );
}
```

### 2.4 高阶组件实战

```jsx
// withAuth - 认证高阶组件
function withAuth(WrappedComponent, { redirectTo = '/login' } = {}) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate(redirectTo, { replace: true });
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <PageLoading />;
    if (!isAuthenticated) return null;
    return <WrappedComponent {...props} />;
  };
}

// withPermission - 权限控制高阶组件
function withPermission(WrappedComponent, requiredPermission) {
  return function PermissionComponent(props) {
    const { permissions } = useAuth();
    const hasPermission = permissions.includes(requiredPermission);

    if (!hasPermission) {
      return <NoPermission />;
    }
    return <WrappedComponent {...props} />;
  };
}

// 使用
const ProtectedDashboard = withAuth(Dashboard);
const AdminPanel = withPermission(withAuth(AdminPage), 'admin:access');

// withErrorBoundary - 错误边界高阶组件
function withErrorBoundary(WrappedComponent, FallbackComponent) {
  return class ErrorBoundaryWrapper extends Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      // 上报错误
      errorReportService.report(error, errorInfo);
    }

    handleRetry = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError) {
        return <FallbackComponent error={this.state.error} onRetry={this.handleRetry} />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

### 2.5 组件设计规范

```jsx
// components/Button/index.js
// 标准组件目录结构
// Button/
// ├── index.js          # 导出
// ├── Button.jsx        # 主组件
// ├── Button.module.css # 样式
// ├── Button.test.js    # 测试
// └── README.md         # 文档

// Button/Button.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Button.module.css';

const Button = forwardRef(({
  type = 'default',
  size = 'medium',
  loading = false,
  disabled = false,
  block = false,
  icon,
  children,
  className,
  onClick,
  ...rest
}, ref) => {
  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  const classes = classNames(
    styles.button,
    styles[`button-${type}`],
    styles[`button-${size}`],
    {
      [styles.loading]: loading,
      [styles.disabled]: disabled,
      [styles.block]: block
    },
    className
  );

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      {loading && <LoadingIcon className={styles.loadingIcon} />}
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.content}>{children}</span>}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  type: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'link']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  icon: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
```

---

## 3. 状态管理实战

### 3.1 Redux 大厂实践

```jsx
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './modules/user';
import appReducer from './modules/app';
import cartReducer from './modules/cart';

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart'] // 只持久化这些 reducer
};

const rootReducer = {
  user: userReducer,
  app: appReducer,
  cart: cartReducer
};

// 自定义中间件
const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(action.type);
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);
export default store;

// store/modules/user.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '@/api';

// 异步 Action
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getInfo();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取用户信息失败');
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await userApi.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '登录失败');
    }
  }
);

const initialState = {
  info: null,
  token: null,
  permissions: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.info = null;
      state.token = null;
      state.permissions = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserInfo
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.info = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setToken, logout, clearError } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.info;
export const selectToken = (state) => state.user.token;
export const selectPermissions = (state) => state.user.permissions;
export const selectIsAuthenticated = (state) => !!state.user.token;
export const selectUserLoading = (state) => state.user.loading;

export default userSlice.reducer;
```

### 3.2 Context + useReducer 轻量方案

```jsx
// store/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 状态类型
const initialState = {
  user: null,
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  notifications: []
};

// Action 类型
const ActionTypes = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.LOGOUT:
      return { ...state, user: null };
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case ActionTypes.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case ActionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { id: Date.now(), ...action.payload }]
      };
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    // 从 localStorage 恢复状态
    const saved = localStorage.getItem('appState');
    if (saved) {
      try {
        return { ...initialState, ...JSON.parse(saved) };
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  // 持久化状态
  useEffect(() => {
    const { user, notifications, ...persistState } = state;
    localStorage.setItem('appState', JSON.stringify(persistState));
  }, [state.theme, state.language, state.sidebarCollapsed]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

// Hooks
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}

// Action Creators
export const appActions = {
  setUser: (user) => ({ type: ActionTypes.SET_USER, payload: user }),
  logout: () => ({ type: ActionTypes.LOGOUT }),
  setTheme: (theme) => ({ type: ActionTypes.SET_THEME, payload: theme }),
  setLanguage: (language) => ({ type: ActionTypes.SET_LANGUAGE, payload: language }),
  toggleSidebar: () => ({ type: ActionTypes.TOGGLE_SIDEBAR }),
  addNotification: (notification) => ({ type: ActionTypes.ADD_NOTIFICATION, payload: notification }),
  removeNotification: (id) => ({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id })
};

// 使用
function Header() {
  const { user, theme, sidebarCollapsed } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header>
      <button onClick={() => dispatch(appActions.toggleSidebar())}>
        {sidebarCollapsed ? '展开' : '收起'}
      </button>
      <ThemeSwitch
        value={theme}
        onChange={(t) => dispatch(appActions.setTheme(t))}
      />
      <UserDropdown user={user} onLogout={() => dispatch(appActions.logout())} />
    </header>
  );
}
```

### 3.3 Zustand 现代方案

```jsx
// store/useStore.js
import { create } from 'zustand';
import { persist, devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 用户 Store
export const useUserStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // 状态
        user: null,
        token: null,
        permissions: [],
        loading: false,

        // Actions
        setUser: (user) => set((state) => {
          state.user = user;
        }),

        setToken: (token) => set((state) => {
          state.token = token;
        }),

        login: async (credentials) => {
          set((state) => { state.loading = true; });
          try {
            const { user, token, permissions } = await authApi.login(credentials);
            set((state) => {
              state.user = user;
              state.token = token;
              state.permissions = permissions;
              state.loading = false;
            });
            return true;
          } catch (error) {
            set((state) => { state.loading = false; });
            throw error;
          }
        },

        logout: () => set((state) => {
          state.user = null;
          state.token = null;
          state.permissions = [];
        }),

        // Getters
        get isAuthenticated() {
          return !!get().token;
        },

        hasPermission: (permission) => {
          return get().permissions.includes(permission);
        }
      })),
      {
        name: 'user-storage',
        partialize: (state) => ({
          token: state.token,
          user: state.user
        })
      }
    ),
    { name: 'user-store' }
  )
);

// 购物车 Store
export const useCartStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        
        addItem: (product, quantity = 1) => set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.items.push({ ...product, quantity });
          }
        }),

        removeItem: (productId) => set((state) => {
          state.items = state.items.filter(item => item.id !== productId);
        }),

        updateQuantity: (productId, quantity) => set((state) => {
          const item = state.items.find(item => item.id === productId);
          if (item) {
            item.quantity = quantity;
          }
        }),

        clearCart: () => set((state) => {
          state.items = [];
        }),

        get totalItems() {
          return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },

        get totalPrice() {
          return get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
      })),
      { name: 'cart-storage' }
    ),
    { name: 'cart-store' }
  )
);

// 使用
function CartButton() {
  const totalItems = useCartStore((state) => state.totalItems);
  
  return (
    <button>
      购物车 ({totalItems})
    </button>
  );
}

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addItem(product)}>加入购物车</button>
    </div>
  );
}
```

---

## 4. 路由管理实战

### 4.1 路由配置

```jsx
// config/routes.js
import { lazy } from 'react';

// 懒加载页面
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/User/List'));
const UserDetail = lazy(() => import('@/pages/User/Detail'));
const ProductList = lazy(() => import('@/pages/Product/List'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export const routes = [
  {
    path: '/login',
    element: Login,
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    element: Layout,
    meta: { title: '首页' },
    children: [
      {
        index: true,
        element: Home,
        meta: { title: '首页' }
      },
      {
        path: 'dashboard',
        element: Dashboard,
        meta: { title: '仪表盘', permission: 'dashboard:view' }
      },
      {
        path: 'users',
        meta: { title: '用户管理' },
        children: [
          {
            index: true,
            element: UserList,
            meta: { title: '用户列表', permission: 'user:list' }
          },
          {
            path: ':id',
            element: UserDetail,
            meta: { title: '用户详情', permission: 'user:view' }
          }
        ]
      },
      {
        path: 'products',
        element: ProductList,
        meta: { title: '产品管理', permission: 'product:list' }
      },
      {
        path: 'settings',
        element: Settings,
        meta: { title: '设置' }
      }
    ]
  },
  {
    path: '*',
    element: NotFound,
    meta: { title: '404', public: true }
  }
];
```

### 4.2 路由守卫

```jsx
// components/AuthRoute/AuthRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store';

function AuthRoute({ children, meta = {} }) {
  const location = useLocation();
  const { isAuthenticated, hasPermission } = useUserStore();

  // 公开路由直接访问
  if (meta.public) {
    return children;
  }

  // 未登录跳转登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 权限检查
  if (meta.permission && !hasPermission(meta.permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

// 路由渲染
function renderRoutes(routes) {
  return routes.map((route) => {
    const { element: Element, children, meta, ...rest } = route;

    const routeElement = Element ? (
      <AuthRoute meta={meta}>
        <Suspense fallback={<PageLoading />}>
          <Element />
        </Suspense>
      </AuthRoute>
    ) : null;

    return (
      <Route key={route.path || 'index'} {...rest} element={routeElement}>
        {children && renderRoutes(children)}
      </Route>
    );
  });
}

// App.jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
}
```

### 4.3 动态路由与权限

```jsx
// hooks/useRoutes.js
import { useMemo } from 'react';
import { useUserStore } from '@/store';
import { routes } from '@/config/routes';

// 根据权限过滤路由
function filterRoutes(routes, permissions) {
  return routes.filter(route => {
    // 公开路由
    if (route.meta?.public) return true;
    
    // 无权限要求
    if (!route.meta?.permission) return true;
    
    // 检查权限
    if (!permissions.includes(route.meta.permission)) return false;

    // 递归过滤子路由
    if (route.children) {
      route.children = filterRoutes(route.children, permissions);
    }

    return true;
  });
}

export function useAuthorizedRoutes() {
  const permissions = useUserStore(state => state.permissions);

  return useMemo(() => {
    return filterRoutes(JSON.parse(JSON.stringify(routes)), permissions);
  }, [permissions]);
}

// 菜单生成
export function useMenus() {
  const authorizedRoutes = useAuthorizedRoutes();

  return useMemo(() => {
    function generateMenus(routes, parentPath = '') {
      return routes
        .filter(route => !route.meta?.hideInMenu)
        .map(route => {
          const path = route.path?.startsWith('/')
            ? route.path
            : `${parentPath}/${route.path || ''}`.replace(/\/+/g, '/');

          return {
            key: path,
            path,
            title: route.meta?.title,
            icon: route.meta?.icon,
            children: route.children ? generateMenus(route.children, path) : undefined
          };
        });
    }

    const mainRoute = authorizedRoutes.find(r => r.path === '/');
    return mainRoute?.children ? generateMenus(mainRoute.children, '/') : [];
  }, [authorizedRoutes]);
}
```

### 4.4 页面缓存 (Keep-Alive)

```jsx
// components/KeepAlive/KeepAlive.jsx
import { useRef, useEffect, createContext, useContext } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

const KeepAliveContext = createContext({});

export function KeepAliveProvider({ children, include = [], exclude = [], max = 10 }) {
  const outlet = useOutlet();
  const location = useLocation();
  const cacheRef = useRef(new Map());

  const cacheKey = location.pathname;

  // 是否应该缓存
  const shouldCache = () => {
    if (exclude.includes(cacheKey)) return false;
    if (include.length > 0 && !include.includes(cacheKey)) return false;
    return true;
  };

  // 更新缓存
  useEffect(() => {
    if (shouldCache() && outlet) {
      cacheRef.current.set(cacheKey, {
        element: outlet,
        scrollTop: 0
      });

      // 超出最大缓存数量时删除最早的
      if (cacheRef.current.size > max) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
    }
  }, [cacheKey, outlet]);

  // 清除缓存
  const clearCache = (key) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  };

  return (
    <KeepAliveContext.Provider value={{ clearCache }}>
      {Array.from(cacheRef.current.entries()).map(([key, { element }]) => (
        <div
          key={key}
          style={{ display: key === cacheKey ? 'block' : 'none' }}
        >
          {element}
        </div>
      ))}
      {!cacheRef.current.has(cacheKey) && outlet}
    </KeepAliveContext.Provider>
  );
}

export function useKeepAlive() {
  return useContext(KeepAliveContext);
}
```

---

## 5. 数据请求封装

### 5.1 Axios 封装

```jsx
// api/request.js
import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '@/store';
import config from '@/config';

// 创建实例
const request = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求队列（用于取消重复请求）
const pendingRequests = new Map();

function getRequestKey(config) {
  return `${config.method}:${config.url}`;
}

function addPendingRequest(config) {
  const key = getRequestKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingRequests.has(key)) {
      pendingRequests.set(key, cancel);
    }
  });
}

function removePendingRequest(config) {
  const key = getRequestKey(config);
  if (pendingRequests.has(key)) {
    const cancel = pendingRequests.get(key);
    cancel('Duplicate request cancelled');
    pendingRequests.delete(key);
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 取消重复请求
    removePendingRequest(config);
    addPendingRequest(config);

    // 添加 token
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config);

    const { data } = response;

    // 业务错误处理
    if (data.code !== 0 && data.code !== 200) {
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message));
    }

    return data;
  },
  (error) => {
    if (error.config) {
      removePendingRequest(error.config);
    }

    // 取消请求不提示
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject(error);
    }

    // HTTP 错误处理
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 401:
          message.error('登录已过期，请重新登录');
          useUserStore.getState().logout();
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(response.data?.message || '网络错误');
      }
    } else {
      message.error('网络连接失败');
    }

    return Promise.reject(error);
  }
);

// 导出请求方法
export function get(url, params, config) {
  return request.get(url, { params, ...config });
}

export function post(url, data, config) {
  return request.post(url, data, config);
}

export function put(url, data, config) {
  return request.put(url, data, config);
}

export function del(url, config) {
  return request.delete(url, config);
}

export function upload(url, file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  return request.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress?.(percent);
    }
  });
}

export default request;
```

### 5.2 API 模块化

```jsx
// api/user.js
import { get, post, put, del } from './request';

export const userApi = {
  // 用户列表
  getList: (params) => get('/users', params),
  
  // 用户详情
  getById: (id) => get(`/users/${id}`),
  
  // 创建用户
  create: (data) => post('/users', data),
  
  // 更新用户
  update: (id, data) => put(`/users/${id}`, data),
  
  // 删除用户
  delete: (id) => del(`/users/${id}`),
  
  // 批量删除
  batchDelete: (ids) => post('/users/batch-delete', { ids }),
  
  // 修改密码
  changePassword: (data) => post('/users/change-password', data),
  
  // 上传头像
  uploadAvatar: (file) => upload('/users/avatar', file)
};

// api/auth.js
export const authApi = {
  login: (data) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
  refreshToken: () => post('/auth/refresh-token'),
  getInfo: () => get('/auth/info'),
  register: (data) => post('/auth/register', data),
  forgotPassword: (email) => post('/auth/forgot-password', { email }),
  resetPassword: (data) => post('/auth/reset-password', data)
};

// api/index.js
export { userApi } from './user';
export { authApi } from './auth';
export { productApi } from './product';
export { orderApi } from './order';
```

### 5.3 React Query 集成

```jsx
// hooks/useQuery.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api';

// 用户列表查询
export function useUsers(params) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getList(params),
    staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
    cacheTime: 30 * 60 * 1000 // 缓存30分钟
  });
}

// 用户详情查询
export function useUser(id) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getById(id),
    enabled: !!id
  });
}

// 创建用户
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// 更新用户
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    }
  });
}

// 删除用户
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onMutate: async (id) => {
      // 乐观更新
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);
      
      queryClient.setQueryData(['users'], (old) => ({
        ...old,
        data: old.data.filter(user => user.id !== id)
      }));

      return { previousUsers };
    },
    onError: (err, id, context) => {
      // 回滚
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// 使用示例
function UserList() {
  const [params, setParams] = useState({ page: 1, pageSize: 10 });
  const { data, isLoading, error } = useUsers(params);
  const deleteUser = useDeleteUser();

  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" message={error.message} />;

  return (
    <Table
      dataSource={data.list}
      pagination={{
        current: params.page,
        pageSize: params.pageSize,
        total: data.total,
        onChange: (page, pageSize) => setParams({ page, pageSize })
      }}
      columns={[
        { title: '姓名', dataIndex: 'name' },
        { title: '邮箱', dataIndex: 'email' },
        {
          title: '操作',
          render: (_, record) => (
            <Button
              danger
              loading={deleteUser.isPending}
              onClick={() => deleteUser.mutate(record.id)}
            >
              删除
            </Button>
          )
        }
      ]}
    />
  );
}
```

---

## 6. 表单处理实战

### 6.1 复杂表单封装

```jsx
// hooks/useForm.js
import { useState, useCallback, useRef } from 'react';

export function useForm(initialValues = {}, options = {}) {
  const { validate, onSubmit } = options;
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const initialValuesRef = useRef(initialValues);

  // 设置单个字段值
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // 设置多个字段值
  const setFieldsValue = useCallback((fields) => {
    setValues(prev => ({ ...prev, ...fields }));
  }, []);

  // 设置字段错误
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // 处理字段变化
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFieldValue(name, newValue);
  }, [setFieldValue]);

  // 处理字段失焦
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // 单字段验证
    if (validate) {
      const fieldErrors = validate({ [name]: values[name] });
      setFieldError(name, fieldErrors[name]);
    }
  }, [values, validate, setFieldError]);

  // 验证所有字段
  const validateAll = useCallback(() => {
    if (!validate) return true;
    
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.keys(fieldErrors).length === 0;
  }, [values, validate]);

  // 提交表单
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!validateAll()) return;
    
    setSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
  }, []);

  // 获取字段 props
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    onBlur: handleBlur
  }), [values, handleChange, handleBlur]);

  // 获取字段状态
  const getFieldState = useCallback((name) => ({
    value: values[name],
    error: errors[name],
    touched: touched[name],
    hasError: touched[name] && !!errors[name]
  }), [values, errors, touched]);

  return {
    values,
    errors,
    touched,
    submitting,
    setFieldValue,
    setFieldsValue,
    setFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldProps,
    getFieldState,
    validateAll,
    isValid: Object.keys(errors).length === 0
  };
}

// 使用示例
function UserForm({ user, onSubmit }) {
  const form = useForm(
    {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'user'
    },
    {
      validate: (values) => {
        const errors = {};
        if (!values.name) errors.name = '请输入姓名';
        if (!values.email) errors.email = '请输入邮箱';
        else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = '邮箱格式不正确';
        if (values.phone && !/^1\d{10}$/.test(values.phone)) {
          errors.phone = '手机号格式不正确';
        }
        return errors;
      },
      onSubmit
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField
        label="姓名"
        error={form.getFieldState('name').hasError && form.errors.name}
      >
        <input {...form.getFieldProps('name')} placeholder="请输入姓名" />
      </FormField>

      <FormField
        label="邮箱"
        error={form.getFieldState('email').hasError && form.errors.email}
      >
        <input {...form.getFieldProps('email')} type="email" placeholder="请输入邮箱" />
      </FormField>

      <FormField
        label="手机号"
        error={form.getFieldState('phone').hasError && form.errors.phone}
      >
        <input {...form.getFieldProps('phone')} placeholder="请输入手机号" />
      </FormField>

      <FormField label="角色">
        <select {...form.getFieldProps('role')}>
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
      </FormField>

      <div className="form-actions">
        <button type="button" onClick={form.resetForm}>重置</button>
        <button type="submit" disabled={form.submitting}>
          {form.submitting ? '提交中...' : '提交'}
        </button>
      </div>
    </form>
  );
}
```

### 6.2 动态表单

```jsx
// components/DynamicForm/DynamicForm.jsx
function DynamicForm({ schema, values, onChange, errors }) {
  const renderField = (field) => {
    const { name, type, label, placeholder, options, rules, hidden, dependencies } = field;

    // 处理依赖显示
    if (hidden) {
      if (typeof hidden === 'function') {
        if (hidden(values)) return null;
      } else {
        return null;
      }
    }

    // 依赖字段
    if (dependencies) {
      const shouldShow = dependencies.every(dep => {
        if (typeof dep === 'string') return !!values[dep];
        return dep.condition(values);
      });
      if (!shouldShow) return null;
    }

    const fieldError = errors?.[name];
    const fieldValue = values[name];

    const handleChange = (e) => {
      const newValue = e.target ? e.target.value : e;
      onChange({ ...values, [name]: newValue });
    };

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <FormField key={name} label={label} error={fieldError} required={rules?.required}>
            <input
              type={type}
              name={name}
              value={fieldValue || ''}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField key={name} label={label} error={fieldError} required={rules?.required}>
            <textarea
              name={name}
              value={fieldValue || ''}
              onChange={handleChange}
              placeholder={placeholder}
              rows={field.rows || 4}
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField key={name} label={label} error={fieldError} required={rules?.required}>
            <select name={name} value={fieldValue || ''} onChange={handleChange}>
              <option value="">{placeholder || '请选择'}</option>
              {options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>
        );

      case 'radio':
        return (
          <FormField key={name} label={label} error={fieldError} required={rules?.required}>
            <div className="radio-group">
              {options?.map(opt => (
                <label key={opt.value} className="radio-item">
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={fieldValue === opt.value}
                    onChange={handleChange}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </FormField>
        );

      case 'checkbox':
        return (
          <FormField key={name} label={label} error={fieldError} required={rules?.required}>
            <div className="checkbox-group">
              {options?.map(opt => (
                <label key={opt.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(fieldValue || []).includes(opt.value)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(fieldValue || []), opt.value]
                        : (fieldValue || []).filter(v => v !== opt.value);
                      handleChange(newValue);
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </FormField>
        );

      case 'date':
        return (
          <FormField key={name} label={label} error={fieldError} required={rules?.required}>
            <DatePicker
              value={fieldValue}
              onChange={handleChange}
              placeholder={placeholder}
            />
          </FormField>
        );

      case 'custom':
        return field.render?.({ value: fieldValue, onChange: handleChange, error: fieldError });

      default:
        return null;
    }
  };

  return (
    <div className="dynamic-form">
      {schema.map(renderField)}
    </div>
  );
}

// 使用
const formSchema = [
  {
    name: 'type',
    type: 'select',
    label: '类型',
    options: [
      { value: 'individual', label: '个人' },
      { value: 'company', label: '企业' }
    ],
    rules: { required: true }
  },
  {
    name: 'name',
    type: 'text',
    label: '姓名',
    placeholder: '请输入姓名',
    rules: { required: true },
    dependencies: [{ condition: (values) => values.type === 'individual' }]
  },
  {
    name: 'companyName',
    type: 'text',
    label: '企业名称',
    placeholder: '请输入企业名称',
    rules: { required: true },
    dependencies: [{ condition: (values) => values.type === 'company' }]
  }
];

function RegistrationForm() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  return (
    <DynamicForm
      schema={formSchema}
      values={values}
      onChange={setValues}
      errors={errors}
    />
  );
}
```

---

## 7. 权限管理系统

### 7.1 RBAC 权限模型

```jsx
// 权限类型定义
// permissions: ['user:list', 'user:create', 'user:edit', 'user:delete', 'admin:access']
// roles: ['admin', 'manager', 'user']

// store/permission.js
const permissionConfig = {
  admin: ['*'], // 超级管理员拥有所有权限
  manager: [
    'user:list', 'user:view',
    'product:*',
    'order:list', 'order:view'
  ],
  user: [
    'user:view',
    'product:list',
    'order:*'
  ]
};

// 解析通配符权限
function expandPermissions(permissions) {
  const expanded = new Set();
  
  permissions.forEach(perm => {
    if (perm === '*') {
      expanded.add('*');
      return;
    }
    
    if (perm.endsWith(':*')) {
      const module = perm.replace(':*', '');
      ['list', 'view', 'create', 'edit', 'delete'].forEach(action => {
        expanded.add(`${module}:${action}`);
      });
    } else {
      expanded.add(perm);
    }
  });
  
  return Array.from(expanded);
}

// 检查权限
export function checkPermission(userPermissions, requiredPermission) {
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
}

// 检查多个权限（全部满足）
export function checkPermissions(userPermissions, requiredPermissions) {
  return requiredPermissions.every(perm => checkPermission(userPermissions, perm));
}

// 检查任一权限
export function checkAnyPermission(userPermissions, requiredPermissions) {
  return requiredPermissions.some(perm => checkPermission(userPermissions, perm));
}
```

### 7.2 权限组件

```jsx
// components/Permission/Permission.jsx
import { useUserStore } from '@/store';
import { checkPermission, checkAnyPermission } from '@/store/permission';

// 权限检查组件
export function Permission({ permission, permissions, any = false, fallback = null, children }) {
  const userPermissions = useUserStore(state => state.permissions);

  const hasPermission = () => {
    if (permission) {
      return checkPermission(userPermissions, permission);
    }
    if (permissions) {
      return any
        ? checkAnyPermission(userPermissions, permissions)
        : permissions.every(p => checkPermission(userPermissions, p));
    }
    return true;
  };

  return hasPermission() ? children : fallback;
}

// 权限按钮
export function PermissionButton({ permission, children, ...props }) {
  return (
    <Permission permission={permission}>
      <Button {...props}>{children}</Button>
    </Permission>
  );
}

// 权限链接
export function PermissionLink({ permission, to, children, ...props }) {
  return (
    <Permission permission={permission}>
      <Link to={to} {...props}>{children}</Link>
    </Permission>
  );
}

// 使用
function UserList() {
  return (
    <div>
      <Permission permission="user:create">
        <Button type="primary">新建用户</Button>
      </Permission>

      <Table
        columns={[
          { title: '姓名', dataIndex: 'name' },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Permission permission="user:edit">
                  <Button>编辑</Button>
                </Permission>
                <Permission permission="user:delete">
                  <Button danger>删除</Button>
                </Permission>
              </Space>
            )
          }
        ]}
      />
    </div>
  );
}
```

### 7.3 权限 Hook

```jsx
// hooks/usePermission.js
import { useMemo, useCallback } from 'react';
import { useUserStore } from '@/store';

export function usePermission() {
  const permissions = useUserStore(state => state.permissions);

  // 检查单个权限
  const hasPermission = useCallback((permission) => {
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  }, [permissions]);

  // 检查多个权限
  const hasPermissions = useCallback((requiredPermissions, any = false) => {
    if (permissions.includes('*')) return true;
    return any
      ? requiredPermissions.some(p => permissions.includes(p))
      : requiredPermissions.every(p => permissions.includes(p));
  }, [permissions]);

  // 按钮权限 map
  const buttonPermissions = useMemo(() => ({
    canCreate: hasPermission('user:create'),
    canEdit: hasPermission('user:edit'),
    canDelete: hasPermission('user:delete'),
    canExport: hasPermission('user:export')
  }), [hasPermission]);

  return {
    permissions,
    hasPermission,
    hasPermissions,
    buttonPermissions
  };
}

// 使用
function UserManage() {
  const { hasPermission, buttonPermissions } = usePermission();

  return (
    <div>
      <div className="toolbar">
        {buttonPermissions.canCreate && (
          <Button type="primary">新建</Button>
        )}
        {buttonPermissions.canExport && (
          <Button>导出</Button>
        )}
      </div>

      {hasPermission('user:list') ? (
        <UserList />
      ) : (
        <NoPermission />
      )}
    </div>
  );
}
```

---

## 8. 性能优化实战

### 8.1 组件优化

```jsx
// 1. React.memo 优化
const UserCard = React.memo(function UserCard({ user, onClick }) {
  console.log('UserCard render:', user.id);
  return (
    <div onClick={() => onClick(user.id)}>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.name === nextProps.user.name;
});

// 2. useMemo 优化计算
function DataTable({ data, sortField, sortOrder, filters }) {
  // 复杂计算缓存
  const processedData = useMemo(() => {
    console.log('Processing data...');
    let result = [...data];
    
    // 过滤
    if (filters.length > 0) {
      result = result.filter(item =>
        filters.every(filter => filter.fn(item))
      );
    }
    
    // 排序
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const compare = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortOrder === 'asc' ? compare : -compare;
      });
    }
    
    return result;
  }, [data, sortField, sortOrder, filters]);

  return <Table data={processedData} />;
}

// 3. useCallback 优化回调
function ParentComponent() {
  const [selectedIds, setSelectedIds] = useState([]);

  // 稳定的回调引用
  const handleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  }, []);

  const handleSelectAll = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  return (
    <UserList
      onSelect={handleSelect}
      onSelectAll={handleSelectAll}
      selectedIds={selectedIds}
    />
  );
}

// 4. 状态下沉
function ExpensiveTree() {
  return (
    <div>
      {/* 状态下沉到需要的组件 */}
      <SearchInput />
      <ExpensiveList />
    </div>
  );
}

// 将状态限制在 SearchInput 内部
function SearchInput() {
  const [query, setQuery] = useState('');
  
  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}
```

### 8.2 列表优化

```jsx
// 虚拟列表
import { FixedSizeList, VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

function VirtualUserList({ users }) {
  const Row = ({ index, style }) => (
    <div style={style} className="user-row">
      <UserCard user={users[index]} />
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={users.length}
          itemSize={80}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}

// 无限滚动
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef();
  const loadingRef = useRef(false);

  const lastItemRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        loadMore();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  const loadMore = async () => {
    loadingRef.current = true;
    try {
      const newItems = await fetchItems(page);
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
      setPage(prev => prev + 1);
    } finally {
      loadingRef.current = false;
    }
  };

  return (
    <div className="list">
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={index === items.length - 1 ? lastItemRef : null}
        >
          <ItemCard item={item} />
        </div>
      ))}
      {hasMore && <div className="loading">加载中...</div>}
    </div>
  );
}
```

### 8.3 代码分割

```jsx
// 路由级代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserManage = lazy(() => import('./pages/UserManage'));
const ProductManage = lazy(() => import('./pages/ProductManage'));

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManage />} />
        <Route path="/products" element={<ProductManage />} />
      </Routes>
    </Suspense>
  );
}

// 组件级代码分割
const HeavyChart = lazy(() => import('./components/HeavyChart'));
const RichEditor = lazy(() => import('./components/RichEditor'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>显示图表</button>
      {showChart && (
        <Suspense fallback={<Skeleton />}>
          <HeavyChart data={chartData} />
        </Suspense>
      )}
    </div>
  );
}

// 预加载
const preloadComponent = (importFn) => {
  const Component = lazy(importFn);
  Component.preload = importFn;
  return Component;
};

const UserDetail = preloadComponent(() => import('./pages/UserDetail'));

function UserList() {
  // 鼠标悬停时预加载
  const handleMouseEnter = () => {
    UserDetail.preload();
  };

  return (
    <Link to="/users/1" onMouseEnter={handleMouseEnter}>
      查看详情
    </Link>
  );
}
```

---

## 9. 错误处理机制

### 9.1 全局错误边界

```jsx
// components/ErrorBoundary/GlobalErrorBoundary.jsx
class GlobalErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // 错误上报
    errorReportService.report({
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <img src={errorImage} alt="Error" />
          <h1>页面出错了</h1>
          <p>抱歉，页面发生了一些问题</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>错误详情</summary>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          <div className="error-actions">
            <Button onClick={this.handleRetry}>重试</Button>
            <Button type="primary" onClick={this.handleGoHome}>
              返回首页
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 局部错误边界
function ModuleErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundary
      fallback={fallback || <ModuleErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('Module error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// 使用
function App() {
  return (
    <GlobalErrorBoundary>
      <Router>
        <Layout>
          <ModuleErrorBoundary>
            <Routes />
          </ModuleErrorBoundary>
        </Layout>
      </Router>
    </GlobalErrorBoundary>
  );
}
```

### 9.2 异步错误处理

```jsx
// hooks/useAsyncError.js
function useAsyncError() {
  const [error, setError] = useState(null);

  // 抛出错误让错误边界捕获
  if (error) {
    throw error;
  }

  const handleAsyncError = useCallback((err) => {
    setError(err);
  }, []);

  return handleAsyncError;
}

// 使用
function DataComponent() {
  const throwError = useAsyncError();

  useEffect(() => {
    fetchData()
      .catch(throwError);
  }, [throwError]);
}

// 统一异步错误处理
function useAsync(asyncFn, options = {}) {
  const { onError, onSuccess, immediate = true } = options;
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null
  });

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error }));
      onError?.(error);
      
      // 可选择是否抛出错误
      if (options.throwOnError) {
        throw error;
      }
    }
  }, [asyncFn, onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null })
  };
}
```

---

## 10. 国际化方案

### 10.1 i18next 配置

```jsx
// i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'en-US': { translation: enUS }
    },
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;

// locales/zh-CN.json
{
  "common": {
    "confirm": "确认",
    "cancel": "取消",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "search": "搜索",
    "loading": "加载中...",
    "noData": "暂无数据"
  },
  "user": {
    "title": "用户管理",
    "name": "姓名",
    "email": "邮箱",
    "role": "角色",
    "createUser": "新建用户",
    "deleteConfirm": "确定要删除用户 {{name}} 吗？"
  },
  "message": {
    "success": {
      "create": "创建成功",
      "update": "更新成功",
      "delete": "删除成功"
    },
    "error": {
      "network": "网络错误，请稍后重试",
      "unauthorized": "登录已过期，请重新登录"
    }
  }
}

// 使用
import { useTranslation } from 'react-i18next';

function UserList() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('user.title')}</h1>
      
      <Button>{t('user.createUser')}</Button>
      
      <Table
        columns={[
          { title: t('user.name'), dataIndex: 'name' },
          { title: t('user.email'), dataIndex: 'email' }
        ]}
        locale={{ emptyText: t('common.noData') }}
      />

      {/* 带参数的翻译 */}
      <Modal
        title={t('common.confirm')}
        content={t('user.deleteConfirm', { name: user.name })}
      />

      {/* 切换语言 */}
      <Select
        value={i18n.language}
        onChange={(lang) => i18n.changeLanguage(lang)}
      >
        <Option value="zh-CN">中文</Option>
        <Option value="en-US">English</Option>
      </Select>
    </div>
  );
}
```

---

## 11. 单元测试实战

### 11.1 Jest + React Testing Library

```jsx
// components/Button/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
  });

  it('applies correct class for type', () => {
    const { rerender } = render(<Button type="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-primary');

    rerender(<Button type="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-danger');
  });
});

// hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
});

// 异步测试
describe('UserList', () => {
  it('fetches and displays users', async () => {
    // Mock API
    jest.spyOn(userApi, 'getList').mockResolvedValue({
      data: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    });

    render(<UserList />);

    // 等待加载完成
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    jest.spyOn(userApi, 'getList').mockRejectedValue(new Error('Network Error'));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument();
    });
  });
});
```

---

## 12. CI/CD 部署

### 12.1 GitHub Actions 配置

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: "build/*"
          target: "/var/www/app"
          strip_components: 1
```

### 12.2 Docker 部署

```dockerfile
# Dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 静态资源缓存
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 总结

本文档详细介绍了 React 在大厂项目中的实战应用：

1. **项目架构** - 模块化目录结构、环境配置
2. **组件设计** - 容器/展示分离、复合组件、HOC
3. **状态管理** - Redux Toolkit、Zustand、Context
4. **路由管理** - 路由配置、权限守卫、页面缓存
5. **数据请求** - Axios 封装、React Query
6. **表单处理** - 自定义表单 Hook、动态表单
7. **权限系统** - RBAC 模型、权限组件
8. **性能优化** - memo、虚拟列表、代码分割
9. **错误处理** - 错误边界、异步错误
10. **国际化** - i18next 配置
11. **单元测试** - Jest + RTL
12. **CI/CD** - GitHub Actions、Docker

这些都是大厂项目中常用的最佳实践！
