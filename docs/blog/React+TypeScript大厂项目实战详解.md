# React + TypeScript 大厂项目实战详解
<div class="doc-toc">
## 目录
1. [项目配置最佳实践](#1-项目配置最佳实践)
2. [组件类型设计](#2-组件类型设计)
3. [状态管理类型](#3-状态管理类型)
4. [API 层类型设计](#4-api-层类型设计)
5. [表单类型处理](#5-表单类型处理)
6. [路由类型安全](#6-路由类型安全)
7. [自定义 Hooks 类型](#7-自定义-hooks-类型)
8. [工具类型实战](#8-工具类型实战)
9. [类型守卫实战](#9-类型守卫实战)
10. [第三方库类型集成](#10-第三方库类型集成)
11. [测试类型](#11-测试类型)
12. [类型最佳实践](#12-类型最佳实践)


</div>

---

## 1. 项目配置最佳实践

### 1.1 tsconfig.json 配置

```json
{
  "compilerOptions": {
    // 编译目标
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // 严格模式
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // 额外检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    
    // JSX
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    
    // 模块
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    
    // 路径别名
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"],
      "@api/*": ["src/api/*"],
      "@store/*": ["src/store/*"]
    }
  },
  "include": ["src/**/*", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.2 类型文件组织

```
src/
├── types/                    # 全局类型定义
│   ├── index.ts             # 类型统一导出
│   ├── global.d.ts          # 全局声明
│   ├── api.ts               # API 相关类型
│   ├── models/              # 数据模型
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   └── utils.ts             # 工具类型
├── api/
│   ├── types.ts             # API 请求/响应类型
│   └── ...
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── types.ts         # 组件类型
└── ...
```

### 1.3 全局类型声明

```typescript
// types/global.d.ts

// 扩展 Window
declare global {
  interface Window {
    __APP_VERSION__: string;
    __DEBUG_MODE__: boolean;
  }
}

// 扩展 ImportMeta
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENABLE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 静态资源
declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const SVGComponent: FC<SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

// JSON 模块
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

export {};
```

---

## 2. 组件类型设计

### 2.1 基础组件类型

```typescript
// components/Button/types.ts
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按钮变体 */
  variant?: ButtonVariant;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 加载状态 */
  loading?: boolean;
  /** 图标 */
  icon?: ReactNode;
  /** 图标位置 */
  iconPosition?: 'left' | 'right';
  /** 是否占满宽度 */
  block?: boolean;
  /** HTML type 属性 */
  htmlType?: 'button' | 'submit' | 'reset';
  /** 子元素 */
  children?: ReactNode;
}

// components/Button/Button.tsx
import { forwardRef } from 'react';
import type { ButtonProps } from './types';
import styles from './Button.module.css';
import clsx from 'clsx';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      block = false,
      htmlType = 'button',
      disabled,
      className,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={htmlType}
        disabled={disabled || loading}
        className={clsx(
          styles.button,
          styles[variant],
          styles[size],
          {
            [styles.loading]: loading,
            [styles.block]: block,
            [styles.disabled]: disabled
          },
          className
        )}
        onClick={handleClick}
        {...rest}
      >
        {loading && <Spinner className={styles.spinner} />}
        {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
        {children && <span className={styles.content}>{children}</span>}
        {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 2.2 复合组件类型

```typescript
// components/Card/types.ts
import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否有阴影 */
  shadow?: boolean | 'hover';
  /** 是否可点击 */
  clickable?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** 标题 */
  title: ReactNode;
  /** 副标题 */
  subtitle?: ReactNode;
  /** 额外内容 */
  extra?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
}

// 复合组件类型
export interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
}

// components/Card/Card.tsx
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardComponent
} from './types';

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, extra, className, ...rest }) => (
  <div className={clsx(styles.header, className)} {...rest}>
    <div className={styles.headerContent}>
      <div className={styles.title}>{title}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
    {extra && <div className={styles.extra}>{extra}</div>}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, padding = 'md', className, ...rest }) => (
  <div className={clsx(styles.body, styles[`padding-${padding}`], className)} {...rest}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, align = 'right', className, ...rest }) => (
  <div className={clsx(styles.footer, styles[`align-${align}`], className)} {...rest}>
    {children}
  </div>
);

const Card: CardComponent = ({ children, bordered = true, shadow = false, clickable, className, ...rest }) => (
  <div
    className={clsx(
      styles.card,
      {
        [styles.bordered]: bordered,
        [styles.shadow]: shadow === true,
        [styles.shadowHover]: shadow === 'hover',
        [styles.clickable]: clickable
      },
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
```

### 2.3 泛型组件

```typescript
// components/Select/types.ts
export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T> {
  /** 选项列表 */
  options: SelectOption<T>[];
  /** 当前值 */
  value: T | null;
  /** 值变化回调 */
  onChange: (value: T) => void;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 自定义渲染选项 */
  renderOption?: (option: SelectOption<T>) => React.ReactNode;
  /** 自定义渲染值 */
  renderValue?: (option: SelectOption<T>) => React.ReactNode;
  /** 比较函数 */
  isEqual?: (a: T, b: T) => boolean;
}

// components/Select/Select.tsx
export function Select<T>({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  clearable = false,
  searchable = false,
  renderOption,
  renderValue,
  isEqual = (a, b) => a === b
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find(opt => value !== null && isEqual(opt.value, value));

  const filteredOptions = searchable
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null as unknown as T);
  };

  return (
    <div className={styles.select}>
      <div className={styles.trigger} onClick={() => !disabled && setOpen(!open)}>
        {selectedOption ? (
          renderValue ? renderValue(selectedOption) : selectedOption.label
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        {clearable && selectedOption && (
          <button className={styles.clear} onClick={handleClear}>×</button>
        )}
      </div>
      
      {open && (
        <div className={styles.dropdown}>
          {searchable && (
            <input
              className={styles.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索..."
            />
          )}
          <ul className={styles.options}>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className={clsx(styles.option, {
                  [styles.selected]: value !== null && isEqual(option.value, value),
                  [styles.disabled]: option.disabled
                })}
                onClick={() => handleSelect(option)}
              >
                {renderOption ? renderOption(option) : option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 使用示例
interface User {
  id: number;
  name: string;
}

const users: SelectOption<User>[] = [
  { value: { id: 1, name: '张三' }, label: '张三' },
  { value: { id: 2, name: '李四' }, label: '李四' }
];

function UserSelect() {
  const [selected, setSelected] = useState<User | null>(null);

  return (
    <Select<User>
      options={users}
      value={selected}
      onChange={setSelected}
      isEqual={(a, b) => a.id === b.id}
      renderOption={opt => (
        <div className="user-option">
          <Avatar name={opt.value.name} />
          <span>{opt.label}</span>
        </div>
      )}
    />
  );
}
```

---

## 3. 状态管理类型

### 3.1 Redux Toolkit 类型

```typescript
// store/types.ts
import { store } from './index';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

// 类型定义
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

// 异步 Action 类型
interface FetchUsersParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

interface FetchUsersResponse {
  list: User[];
  total: number;
}

// 异步 Actions
export const fetchUsers = createAsyncThunk<
  FetchUsersResponse,
  FetchUsersParams,
  { rejectValue: string }
>('user/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const response = await userApi.getList(params);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateUser = createAsyncThunk<
  User,
  { id: number; data: Partial<User> },
  { rejectValue: string; state: RootState }
>('user/updateUser', async ({ id, data }, { rejectWithValue, getState }) => {
  try {
    const response = await userApi.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Slice
const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.list;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? '未知错误';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  }
});

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUsers = (state: RootState) => state.user.users;
export const selectUserById = (id: number) => (state: RootState) =>
  state.user.users.find(u => u.id === id);
export const selectIsAdmin = (state: RootState) =>
  state.user.currentUser?.role === 'admin';

export const { setCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
```

### 3.2 Zustand 类型

```typescript
// store/useStore.ts
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 类型定义
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

interface CartGetters {
  totalItems: number;
  totalPrice: number;
  getItemById: (id: number) => CartItem | undefined;
}

type CartStore = CartState & CartActions & CartGetters;

// 创建 Store
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // State
          items: [],
          isOpen: false,

          // Actions
          addItem: (item) =>
            set((state) => {
              const existing = state.items.find((i) => i.id === item.id);
              if (existing) {
                existing.quantity += 1;
              } else {
                state.items.push({ ...item, quantity: 1 });
              }
            }),

          removeItem: (id) =>
            set((state) => {
              state.items = state.items.filter((item) => item.id !== id);
            }),

          updateQuantity: (id, quantity) =>
            set((state) => {
              const item = state.items.find((i) => i.id === id);
              if (item) {
                item.quantity = Math.max(0, quantity);
                if (item.quantity === 0) {
                  state.items = state.items.filter((i) => i.id !== id);
                }
              }
            }),

          clearCart: () =>
            set((state) => {
              state.items = [];
            }),

          toggleCart: () =>
            set((state) => {
              state.isOpen = !state.isOpen;
            }),

          // Getters
          get totalItems() {
            return get().items.reduce((sum, item) => sum + item.quantity, 0);
          },

          get totalPrice() {
            return get().items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
          },

          getItemById: (id) => get().items.find((item) => item.id === id)
        }))
      ),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
);

// 选择器 Hook
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.totalPrice);
export const useCartItemCount = () => useCartStore((state) => state.totalItems);
```

---

## 4. API 层类型设计

### 4.1 请求响应类型

```typescript
// api/types.ts

// 基础响应类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 排序参数
export interface SortParams {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// 筛选参数
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// 列表请求参数
export type ListParams<F = FilterParams> = PaginationParams & SortParams & F;

// 创建请求类型工具
export type CreatePayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePayload<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// api/user.ts
import type { ApiResponse, PaginatedResponse, ListParams, CreatePayload, UpdatePayload } from './types';
import request from './request';

// 用户模型
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 用户筛选参数
export interface UserFilter {
  keyword?: string;
  role?: User['role'];
  status?: User['status'];
}

// 用户列表参数
export type UserListParams = ListParams<UserFilter>;

// API 定义
export const userApi = {
  // 获取用户列表
  getList: (params: UserListParams) =>
    request.get<ApiResponse<PaginatedResponse<User>>>('/users', { params }),

  // 获取用户详情
  getById: (id: number) =>
    request.get<ApiResponse<User>>(`/users/${id}`),

  // 创建用户
  create: (data: CreatePayload<User>) =>
    request.post<ApiResponse<User>>('/users', data),

  // 更新用户
  update: (id: number, data: UpdatePayload<User>) =>
    request.put<ApiResponse<User>>(`/users/${id}`, data),

  // 删除用户
  delete: (id: number) =>
    request.delete<ApiResponse<void>>(`/users/${id}`),

  // 批量删除
  batchDelete: (ids: number[]) =>
    request.post<ApiResponse<void>>('/users/batch-delete', { ids }),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    request.post<ApiResponse<void>>('/users/change-password', data)
};
```

### 4.2 Axios 类型封装

```typescript
// api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from './types';

// 扩展配置类型
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  showError?: boolean;
}

// 创建实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (!config.skipAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response;
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message));
    }
    return response;
  },
  (error) => {
    const config = error.config as CustomAxiosRequestConfig;
    if (config?.showError !== false) {
      // 显示错误提示
    }
    return Promise.reject(error);
  }
);

// 类型安全的请求方法
const request = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config).then((res) => res.data as T);
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config).then((res) => res.data as T);
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config).then((res) => res.data as T);
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config).then((res) => res.data as T);
  },

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch(url, data, config).then((res) => res.data as T);
  }
};

export default request;
```

### 4.3 React Query 类型

```typescript
// hooks/queries/useUsers.ts
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { userApi, User, UserListParams, UserFilter } from '@/api/user';
import type { ApiResponse, PaginatedResponse, CreatePayload, UpdatePayload } from '@/api/types';

// 查询键
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const
};

// 用户列表 Hook
export function useUsers(
  params: UserListParams,
  options?: Omit<UseQueryOptions<ApiResponse<PaginatedResponse<User>>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getList(params),
    ...options
  });
}

// 用户详情 Hook
export function useUser(
  id: number,
  options?: Omit<UseQueryOptions<ApiResponse<User>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: id > 0,
    ...options
  });
}

// 创建用户 Hook
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePayload<User>) => userApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

// 更新用户 Hook
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePayload<User> }) =>
      userApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    }
  });
}

// 删除用户 Hook
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onMutate: async (id) => {
      // 乐观更新
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: userKeys.lists() });
      return { previousData };
    },
    onError: (_, __, context) => {
      // 回滚
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}
```

---

## 5. 表单类型处理

### 5.1 React Hook Form 类型

```typescript
// components/UserForm/types.ts
import { z } from 'zod';

// Zod Schema 定义
export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '只能包含字母、数字和下划线'),
  email: z.string().email('邮箱格式不正确'),
  password: z
    .string()
    .min(6, '密码至少6个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'user'] as const),
  status: z.enum(['active', 'inactive'] as const),
  profile: z.object({
    firstName: z.string().min(1, '请输入名字'),
    lastName: z.string().min(1, '请输入姓氏'),
    phone: z.string().regex(/^1\d{10}$/, '手机号格式不正确').optional(),
    bio: z.string().max(500, '简介最多500字').optional()
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword']
});

// 从 Schema 推断类型
export type UserFormData = z.infer<typeof userFormSchema>;

// 编辑表单类型（部分字段可选）
export type UserEditFormData = Partial<UserFormData> & {
  id: number;
};

// components/UserForm/UserForm.tsx
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UserFormData } from './types';
import { userFormSchema } from './types';

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: SubmitHandler<UserFormData>;
  loading?: boolean;
}

export function UserForm({ defaultValues, onSubmit, loading }: UserFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'user',
      status: 'active',
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="用户名" error={errors.username?.message}>
        <input {...register('username')} />
      </FormField>

      <FormField label="邮箱" error={errors.email?.message}>
        <input {...register('email')} type="email" />
      </FormField>

      <FormField label="密码" error={errors.password?.message}>
        <input {...register('password')} type="password" />
      </FormField>

      <FormField label="确认密码" error={errors.confirmPassword?.message}>
        <input {...register('confirmPassword')} type="password" />
      </FormField>

      <FormField label="角色" error={errors.role?.message}>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'user', label: '普通用户' }
              ]}
            />
          )}
        />
      </FormField>

      <FormField label="名字" error={errors.profile?.firstName?.message}>
        <input {...register('profile.firstName')} />
      </FormField>

      <FormField label="姓氏" error={errors.profile?.lastName?.message}>
        <input {...register('profile.lastName')} />
      </FormField>

      <button type="submit" disabled={isSubmitting || loading}>
        {isSubmitting || loading ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

### 5.2 动态表单类型

```typescript
// types/form.ts
export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'dateRange'
  | 'upload'
  | 'custom';

export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean | ((values: Record<string, unknown>) => boolean);
  rules?: ValidationRule[];
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'radio';
  options: Array<{ value: string | number; label: string }>;
  multiple?: boolean;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password';
  maxLength?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
  maxLength?: number;
}

export interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom';
  render: (props: {
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
  }) => React.ReactNode;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | TextareaFieldConfig
  | CustomFieldConfig
  | BaseFieldConfig;

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: unknown, values: Record<string, unknown>) => string | undefined;
  message?: string;
}

// components/DynamicForm/DynamicForm.tsx
interface DynamicFormProps<T extends Record<string, unknown>> {
  fields: FieldConfig[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onChange?: (values: Partial<T>) => void;
}

export function DynamicForm<T extends Record<string, unknown>>({
  fields,
  initialValues,
  onSubmit,
  onChange
}: DynamicFormProps<T>) {
  const [values, setValues] = useState<Partial<T>>(initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: unknown) => {
    const newValues = { ...values, [name]: value } as Partial<T>;
    setValues(newValues);
    onChange?.(newValues);
  };

  const renderField = (field: FieldConfig) => {
    // 处理隐藏逻辑
    if (field.hidden) {
      const isHidden = typeof field.hidden === 'function'
        ? field.hidden(values as Record<string, unknown>)
        : field.hidden;
      if (isHidden) return null;
    }

    const commonProps = {
      value: values[field.name as keyof T],
      onChange: (v: unknown) => handleChange(field.name, v),
      error: errors[field.name],
      disabled: field.disabled,
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return <Input {...commonProps} type={field.type} />;
      case 'number':
        return <NumberInput {...commonProps} {...field} />;
      case 'select':
        return <Select {...commonProps} options={(field as SelectFieldConfig).options} />;
      case 'textarea':
        return <Textarea {...commonProps} rows={(field as TextareaFieldConfig).rows} />;
      case 'custom':
        return (field as CustomFieldConfig).render(commonProps);
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(values as T);
    }}>
      {fields.map((field) => (
        <FormField key={field.name} label={field.label} error={errors[field.name]}>
          {renderField(field)}
        </FormField>
      ))}
      <button type="submit">提交</button>
    </form>
  );
}
```

---

## 6. 路由类型安全

### 6.1 类型安全的路由配置

```typescript
// router/types.ts
import type { RouteObject } from 'react-router-dom';

// 路由元数据
export interface RouteMeta {
  title: string;
  icon?: string;
  permission?: string | string[];
  hideInMenu?: boolean;
  keepAlive?: boolean;
}

// 扩展路由对象
export interface AppRouteObject extends Omit<RouteObject, 'children'> {
  meta?: RouteMeta;
  children?: AppRouteObject[];
}

// 路由参数类型
export interface RouteParams {
  '/users/:id': { id: string };
  '/products/:id': { id: string };
  '/orders/:orderId/items/:itemId': { orderId: string; itemId: string };
}

// 路由查询参数类型
export interface RouteQuery {
  '/users': { page?: string; keyword?: string; role?: string };
  '/products': { category?: string; sort?: string };
}

// 类型安全的路由路径
export type RoutePath = keyof RouteParams | keyof RouteQuery | '/' | '/login' | '/dashboard';

// router/hooks.ts
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import type { RouteParams, RouteQuery, RoutePath } from './types';

// 类型安全的 useParams
export function useTypedParams<T extends keyof RouteParams>() {
  return useParams() as RouteParams[T];
}

// 类型安全的 useSearchParams
export function useTypedSearchParams<T extends keyof RouteQuery>() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const params = {} as RouteQuery[T];
  searchParams.forEach((value, key) => {
    (params as Record<string, string>)[key] = value;
  });
  
  return [params, setSearchParams] as const;
}

// 类型安全的导航
export function useTypedNavigate() {
  const navigate = useNavigate();

  return {
    push: <T extends RoutePath>(
      path: T,
      options?: T extends keyof RouteParams
        ? { params: RouteParams[T]; query?: Record<string, string> }
        : { query?: Record<string, string> }
    ) => {
      let url = path as string;
      
      if (options && 'params' in options) {
        Object.entries(options.params).forEach(([key, value]) => {
          url = url.replace(`:${key}`, value);
        });
      }
      
      if (options?.query) {
        const queryString = new URLSearchParams(options.query).toString();
        url += `?${queryString}`;
      }
      
      navigate(url);
    },
    replace: (path: RoutePath) => navigate(path, { replace: true }),
    back: () => navigate(-1)
  };
}

// 使用示例
function UserDetail() {
  const { id } = useTypedParams<'/users/:id'>();
  const navigate = useTypedNavigate();

  const handleEdit = () => {
    navigate.push('/users/:id', {
      params: { id },
      query: { edit: 'true' }
    });
  };

  return <div>User ID: {id}</div>;
}
```

### 6.2 路由权限类型

```typescript
// router/guard.tsx
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { RouteMeta } from './types';

interface RouteGuardProps {
  meta?: RouteMeta;
  children: ReactNode;
}

export function RouteGuard({ meta, children }: RouteGuardProps) {
  const { isAuthenticated, permissions, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  // 未登录
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 权限检查
  if (meta?.permission) {
    const required = Array.isArray(meta.permission) ? meta.permission : [meta.permission];
    const hasPermission = required.some((p) => permissions.includes(p));
    
    if (!hasPermission) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
}

// 路由配置使用
const routes: AppRouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <RouteGuard meta={{ title: '仪表盘', permission: 'dashboard:view' }}>
        <DashboardPage />
      </RouteGuard>
    ),
    meta: { title: '仪表盘', permission: 'dashboard:view' }
  },
  {
    path: '/users',
    element: (
      <RouteGuard meta={{ title: '用户管理', permission: ['user:list', 'admin'] }}>
        <UserListPage />
      </RouteGuard>
    ),
    meta: { title: '用户管理', permission: ['user:list', 'admin'] }
  }
];
```

---

## 7. 自定义 Hooks 类型

### 7.1 通用 Hooks 类型

```typescript
// hooks/useAsync.ts
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncReturn<T, P extends unknown[]> extends UseAsyncState<T> {
  execute: (...params: P) => Promise<T | undefined>;
  reset: () => void;
}

export function useAsync<T, P extends unknown[] = []>(
  asyncFn: (...params: P) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, P> {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const execute = useCallback(async (...params: P) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFn(...params);
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({ ...prev, loading: false, error: err }));
      onError?.(err);
      return undefined;
    }
  }, [asyncFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, [immediate, execute]);

  return { ...state, execute, reset };
}

// 使用
const { data, loading, error, execute } = useAsync(
  (id: number) => userApi.getById(id),
  { immediate: false }
);

// execute 的类型是 (id: number) => Promise<User | undefined>
```

### 7.2 表格 Hook 类型

```typescript
// hooks/useTable.ts
interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
}

interface TableSorter {
  field: string | null;
  order: 'asc' | 'desc' | null;
}

interface TableFilter {
  [key: string]: unknown;
}

interface UseTableOptions<T, F extends TableFilter = TableFilter> {
  fetchData: (params: {
    pagination: Pick<TablePagination, 'current' | 'pageSize'>;
    sorter: TableSorter;
    filter: F;
  }) => Promise<{ list: T[]; total: number }>;
  defaultPageSize?: number;
  defaultFilter?: F;
}

interface UseTableReturn<T, F extends TableFilter> {
  dataSource: T[];
  loading: boolean;
  pagination: TablePagination;
  sorter: TableSorter;
  filter: F;
  setFilter: React.Dispatch<React.SetStateAction<F>>;
  handleTableChange: (
    pagination: { current?: number; pageSize?: number },
    filters: Record<string, unknown>,
    sorter: { field?: string; order?: string }
  ) => void;
  refresh: () => void;
  reset: () => void;
}

export function useTable<T, F extends TableFilter = TableFilter>(
  options: UseTableOptions<T, F>
): UseTableReturn<T, F> {
  const { fetchData, defaultPageSize = 10, defaultFilter = {} as F } = options;

  const [dataSource, setDataSource] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePagination>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0
  });
  const [sorter, setSorter] = useState<TableSorter>({ field: null, order: null });
  const [filter, setFilter] = useState<F>(defaultFilter);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { list, total } = await fetchData({
        pagination: { current: pagination.current, pageSize: pagination.pageSize },
        sorter,
        filter
      });
      setDataSource(list);
      setPagination((prev) => ({ ...prev, total }));
    } finally {
      setLoading(false);
    }
  }, [fetchData, pagination.current, pagination.pageSize, sorter, filter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleTableChange = useCallback((
    pag: { current?: number; pageSize?: number },
    _filters: Record<string, unknown>,
    sort: { field?: string; order?: string }
  ) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current ?? prev.current,
      pageSize: pag.pageSize ?? prev.pageSize
    }));

    if (sort.field) {
      setSorter({
        field: sort.field,
        order: sort.order === 'ascend' ? 'asc' : sort.order === 'descend' ? 'desc' : null
      });
    }
  }, []);

  const refresh = useCallback(() => {
    fetch();
  }, [fetch]);

  const reset = useCallback(() => {
    setPagination({ current: 1, pageSize: defaultPageSize, total: 0 });
    setSorter({ field: null, order: null });
    setFilter(defaultFilter);
  }, [defaultPageSize, defaultFilter]);

  return {
    dataSource,
    loading,
    pagination,
    sorter,
    filter,
    setFilter,
    handleTableChange,
    refresh,
    reset
  };
}

// 使用
interface UserFilter {
  keyword?: string;
  role?: 'admin' | 'user';
}

const {
  dataSource,
  loading,
  pagination,
  filter,
  setFilter,
  handleTableChange
} = useTable<User, UserFilter>({
  fetchData: async ({ pagination, sorter, filter }) => {
    const response = await userApi.getList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.field ?? undefined,
      sortOrder: sorter.order ?? undefined,
      ...filter
    });
    return { list: response.data.list, total: response.data.total };
  },
  defaultFilter: { role: undefined }
});
```

---

## 8. 工具类型实战

### 8.1 实用工具类型

```typescript
// types/utils.ts

// 深度 Partial
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// 深度 Required
type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

// 深度 Readonly
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

// 获取对象所有键的路径
type PathKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? PathKeys<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

// 根据路径获取类型
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

// 将联合类型转为交叉类型
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// 获取函数参数类型
type FunctionParams<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

// 获取 Promise 内部类型
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// 排除 null 和 undefined
type NonNullableDeep<T> = T extends null | undefined
  ? never
  : T extends object
  ? { [K in keyof T]: NonNullableDeep<T[K]> }
  : T;

// 使用示例
interface User {
  id: number;
  profile: {
    name: string;
    address: {
      city: string;
      country: string;
    };
  };
}

type UserPaths = PathKeys<User>;
// 'id' | 'profile' | 'profile.name' | 'profile.address' | 'profile.address.city' | 'profile.address.country'

type CityType = PathValue<User, 'profile.address.city'>;
// string
```

### 8.2 组件相关工具类型

```typescript
// types/component.ts
import type { ComponentProps, ComponentType, ReactNode } from 'react';

// 提取组件 Props
type PropsOf<C extends ComponentType<unknown>> = ComponentProps<C>;

// 提取 Ref 类型
type RefOf<C extends ComponentType<unknown>> = C extends ComponentType<infer P>
  ? P extends { ref?: infer R }
    ? R
    : never
  : never;

// 可选 children
type WithChildren<P = unknown> = P & { children?: ReactNode };

// 必需 children
type WithRequiredChildren<P = unknown> = P & { children: ReactNode };

// as 属性支持
type AsProp<C extends React.ElementType> = {
  as?: C;
};

// Polymorphic 组件 Props
type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = Record<string, never>
> = AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props | 'as'> &
  Props;

type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = Record<string, never>
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };

// 实现 Polymorphic 组件
interface ButtonOwnProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

type ButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  ButtonOwnProps
>;

export const Button = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, variant = 'primary', size = 'md', ...props }: ButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    return <Component ref={ref} className={`btn-${variant} btn-${size}`} {...props} />;
  }
) as <C extends React.ElementType = 'button'>(
  props: ButtonProps<C> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

// 使用
<Button>Click</Button>
<Button as="a" href="/home">Link</Button>
<Button as={Link} to="/home">Router Link</Button>
```

---

## 9. 类型守卫实战

### 9.1 自定义类型守卫

```typescript
// utils/typeGuards.ts

// 基本类型守卫
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isNonNullish<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// 对象类型守卫
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

// 特定对象类型守卫
export function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj;
}

export function hasProperties<K extends string>(
  obj: unknown,
  keys: K[]
): obj is Record<K, unknown> {
  return isObject(obj) && keys.every((key) => key in obj);
}

// 业务类型守卫
interface User {
  type: 'user';
  id: number;
  name: string;
}

interface Admin {
  type: 'admin';
  id: number;
  name: string;
  permissions: string[];
}

type Person = User | Admin;

export function isAdmin(person: Person): person is Admin {
  return person.type === 'admin';
}

export function isUser(person: Person): person is User {
  return person.type === 'user';
}

// API 响应类型守卫
interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true;
}

export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ErrorResponse {
  return response.success === false;
}

// 使用
async function fetchUser(id: number) {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  
  if (isSuccessResponse(response)) {
    // response.data 类型是 User
    return response.data;
  } else {
    // response.error 类型是 string
    throw new Error(response.error);
  }
}
```

### 9.2 断言函数

```typescript
// utils/assertions.ts

// 断言函数类型
export function assertNonNullish<T>(
  value: T,
  message = 'Value is null or undefined'
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

export function assertString(
  value: unknown,
  message = 'Value is not a string'
): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(message);
  }
}

export function assertNumber(
  value: unknown,
  message = 'Value is not a number'
): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(message);
  }
}

export function assertArray<T>(
  value: unknown,
  message = 'Value is not an array'
): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
}

// 条件断言
export function assertCondition(
  condition: boolean,
  message = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

// 使用
function processUser(user: User | null) {
  assertNonNullish(user, 'User is required');
  // 这里 user 类型是 User
  console.log(user.name);
}

function validateInput(value: unknown) {
  assertString(value, 'Input must be a string');
  // 这里 value 类型是 string
  return value.trim();
}
```

---

## 10. 第三方库类型集成

### 10.1 扩展第三方库类型

```typescript
// types/axios.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 跳过认证 */
    skipAuth?: boolean;
    /** 显示错误提示 */
    showError?: boolean;
    /** 重试次数 */
    retryCount?: number;
  }
}

// types/react-router.d.ts
import 'react-router-dom';

declare module 'react-router-dom' {
  interface RouteObject {
    meta?: {
      title?: string;
      icon?: string;
      permission?: string | string[];
      hideInMenu?: boolean;
    };
  }
}

// types/styled-components.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      background: string;
      text: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}
```

### 10.2 为无类型库添加类型

```typescript
// types/some-untyped-lib.d.ts
declare module 'some-untyped-lib' {
  export interface Config {
    apiKey: string;
    environment: 'development' | 'production';
  }

  export interface User {
    id: string;
    email: string;
    name: string;
  }

  export class Client {
    constructor(config: Config);
    getUser(id: string): Promise<User>;
    createUser(data: Omit<User, 'id'>): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<void>;
  }

  export function init(config: Config): Client;
  export const VERSION: string;
}
```

---

## 11. 测试类型

### 11.1 Jest 测试类型

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';

// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/Button';
import type { ButtonProps } from '@/components/Button/types';

describe('Button', () => {
  const defaultProps: ButtonProps = {
    children: 'Click me'
  };

  const renderButton = (props: Partial<ButtonProps> = {}) => {
    return render(<Button {...defaultProps} {...props} />);
  };

  it('should render correctly', () => {
    renderButton();
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick });

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    renderButton({ loading: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant class', () => {
    renderButton({ variant: 'primary' });
    expect(screen.getByRole('button')).toHaveClass('primary');
  });
});

// tests/hooks/useAsync.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from '@/hooks/useAsync';

describe('useAsync', () => {
  it('should handle successful async operation', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsync(asyncFn, { immediate: true }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle error', async () => {
    const error = new Error('Test error');
    const asyncFn = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useAsync(asyncFn, { immediate: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
  });

  it('should execute manually', async () => {
    const mockData = { id: 1 };
    const asyncFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.loading).toBe(false);
    expect(asyncFn).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.execute();
    });

    expect(asyncFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
  });
});
```

---

## 12. 类型最佳实践

### 12.1 类型命名规范

```typescript
// ✅ 好的命名
interface User { }                    // 数据模型用名词
type UserId = number;                 // 类型别名用 PascalCase
type UserRole = 'admin' | 'user';     // 联合类型描述清晰
interface UserListProps { }           // Props 以 Props 结尾
interface UseUserReturn { }           // Hook 返回类型

// ❌ 不好的命名
interface IUser { }                   // 不需要 I 前缀
type user_id = number;                // 不使用 snake_case
interface userListProps { }           // 应该用 PascalCase
```

### 12.2 避免类型断言

```typescript
// ❌ 避免过多使用 as
const user = data as User;

// ✅ 使用类型守卫
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  console.log(data.name); // 类型安全
}

// ❌ 避免 any
function process(data: any) { }

// ✅ 使用 unknown 并进行类型收窄
function process(data: unknown) {
  if (isUser(data)) {
    // 处理 User
  }
}
```

### 12.3 利用类型推断

```typescript
// ❌ 不必要的类型标注
const name: string = 'John';
const numbers: number[] = [1, 2, 3];

// ✅ 让 TypeScript 推断
const name = 'John';
const numbers = [1, 2, 3];

// ✅ 必要时才标注
const user: User = await fetchUser(id);
const [state, setState] = useState<User | null>(null);
```

### 12.4 使用 const 断言

```typescript
// ❌ 类型过宽
const config = {
  api: '/api',
  timeout: 5000
};
// 类型: { api: string; timeout: number }

// ✅ 使用 as const
const config = {
  api: '/api',
  timeout: 5000
} as const;
// 类型: { readonly api: '/api'; readonly timeout: 5000 }

// 数组也适用
const roles = ['admin', 'user', 'guest'] as const;
// 类型: readonly ['admin', 'user', 'guest']
type Role = typeof roles[number]; // 'admin' | 'user' | 'guest'
```

---

## 总结

本文档详细介绍了 React + TypeScript 在大厂项目中的实战应用：

1. **项目配置** - tsconfig、类型文件组织、全局声明
2. **组件类型** - 基础组件、复合组件、泛型组件
3. **状态管理** - Redux Toolkit、Zustand 类型
4. **API 层** - 请求响应类型、Axios 封装、React Query
5. **表单类型** - React Hook Form、Zod、动态表单
6. **路由类型** - 类型安全路由、参数类型
7. **自定义 Hooks** - 通用 Hooks、表格 Hooks
8. **工具类型** - 深度类型、组件类型、路径类型
9. **类型守卫** - 自定义守卫、断言函数
10. **第三方库** - 类型扩展、无类型库声明
11. **测试类型** - Jest、Testing Library
12. **最佳实践** - 命名规范、避免断言、类型推断

这些都是大厂 React + TypeScript 项目中常用的最佳实践！
