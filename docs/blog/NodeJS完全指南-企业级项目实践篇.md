# Node.js 完全指南 - 企业级项目实践篇
<div class="doc-toc">
## 目录

1. [企业级项目架构](#1-企业级项目架构)
2. [大厂代码规范](#2-大厂代码规范)
3. [性能优化实践](#3-性能优化实践)
4. [安全防护方案](#4-安全防护方案)
5. [微前端架构](#5-微前端架构)
6. [SSR/SSG 服务端渲染](#6-ssrssg-服务端渲染)
7. [BFF 层实践](#7-bff-层实践)
8. [大型状态管理](#8-大型状态管理)
9. [国际化方案](#9-国际化方案)
10. [主题换肤系统](#10-主题换肤系统)
11. [权限控制系统](#11-权限控制系统)
12. [错误边界与降级](#12-错误边界与降级)
13. [监控告警体系](#13-监控告警体系)
14. [灰度发布方案](#14-灰度发布方案)
15. [CDN 与缓存策略](#15-cdn-与缓存策略)


</div>

---

## 1. 企业级项目架构

### 1.1 目录结构规范

```
├── src/
│   ├── api/                    # API 接口层
│   │   ├── modules/            # 按模块划分
│   │   │   ├── user.ts
│   │   │   ├── order.ts
│   │   │   └── product.ts
│   │   ├── request.ts          # Axios 封装
│   │   └── index.ts
│   │
│   ├── assets/                 # 静态资源
│   │   ├── images/
│   │   ├── fonts/
│   │   └── styles/
│   │
│   ├── components/             # 通用组件
│   │   ├── base/               # 基础组件
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Modal/
│   │   ├── business/           # 业务组件
│   │   │   ├── UserCard/
│   │   │   └── OrderList/
│   │   └── layout/             # 布局组件
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       └── Footer/
│   │
│   ├── config/                 # 配置文件
│   │   ├── env.ts
│   │   ├── constants.ts
│   │   └── routes.ts
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useRequest.ts
│   │   ├── useAuth.ts
│   │   └── usePermission.ts
│   │
│   ├── pages/                  # 页面组件
│   │   ├── Home/
│   │   ├── User/
│   │   └── Order/
│   │
│   ├── router/                 # 路由配置
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   └── guards.ts
│   │
│   ├── store/                  # 状态管理
│   │   ├── modules/
│   │   ├── index.ts
│   │   └── types.ts
│   │
│   ├── types/                  # 类型定义
│   │   ├── api.d.ts
│   │   ├── store.d.ts
│   │   └── global.d.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   ├── storage.ts
│   │   └── request.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── scripts/                    # 构建脚本
│   ├── build.js
│   ├── deploy.js
│   └── analyze.js
│
├── tests/                      # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/                       # 项目文档
```

### 1.2 企业级 Axios 封装

```typescript
// src/api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from '@/utils/auth';
import { router } from '@/router';

// 响应数据结构
interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// 错误码映射
const ERROR_CODES: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求资源不存在',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
};

// 创建实例
const createInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 请求拦截器
    instance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            // 添加请求ID用于链路追踪
            config.headers['X-Request-ID'] = generateRequestId();
            
            // 添加时间戳防止缓存
            if (config.method === 'get') {
                config.params = {
                    ...config.params,
                    _t: Date.now()
                };
            }
            
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 响应拦截器
    instance.interceptors.response.use(
        (response: AxiosResponse<ApiResponse>) => {
            const { code, message: msg, data } = response.data;
            
            if (code === 0) {
                return data;
            }
            
            // 业务错误处理
            handleBusinessError(code, msg);
            return Promise.reject(new Error(msg));
        },
        (error) => {
            const { response, message: msg } = error;
            
            if (response) {
                const { status, data } = response;
                const errorMsg = data?.message || ERROR_CODES[status] || '请求失败';
                
                // 401 跳转登录
                if (status === 401) {
                    removeToken();
                    router.push('/login');
                }
                
                message.error(errorMsg);
            } else if (msg === 'Network Error') {
                message.error('网络连接失败，请检查网络');
            } else if (msg.includes('timeout')) {
                message.error('请求超时，请稍后重试');
            }
            
            return Promise.reject(error);
        }
    );

    return instance;
};

// 业务错误处理
function handleBusinessError(code: number, msg: string) {
    switch (code) {
        case 10001: // Token 过期
            removeToken();
            router.push('/login');
            break;
        case 10002: // 权限不足
            message.warning('您没有权限执行此操作');
            break;
        default:
            message.error(msg || '操作失败');
    }
}

// 生成请求ID
function generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const request = createInstance();

// 封装请求方法
export const http = {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return request.get(url, config);
    },
    
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return request.post(url, data, config);
    },
    
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return request.put(url, data, config);
    },
    
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return request.delete(url, config);
    },
    
    upload<T>(url: string, file: File, onProgress?: (percent: number) => void): Promise<T> {
        const formData = new FormData();
        formData.append('file', file);
        
        return request.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                if (e.total && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            }
        });
    }
};

export default request;
```

### 1.3 API 模块化管理

```typescript
// src/api/modules/user.ts
import { http } from '../request';

export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string;
    role: string;
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface LoginResult {
    token: string;
    user: User;
}

export const userApi = {
    // 登录
    login(params: LoginParams) {
        return http.post<LoginResult>('/auth/login', params);
    },
    
    // 获取用户信息
    getUserInfo() {
        return http.get<User>('/user/info');
    },
    
    // 获取用户列表
    getUserList(params: { page: number; pageSize: number }) {
        return http.get<{ list: User[]; total: number }>('/user/list', { params });
    },
    
    // 更新用户信息
    updateUser(id: number, data: Partial<User>) {
        return http.put<User>(`/user/${id}`, data);
    },
    
    // 删除用户
    deleteUser(id: number) {
        return http.delete(`/user/${id}`);
    }
};

// src/api/index.ts
export { userApi } from './modules/user';
export { orderApi } from './modules/order';
export { productApi } from './modules/product';
```

---

## 2. 大厂代码规范

### 2.1 阿里前端规范配置

```javascript
// .eslintrc.js - 阿里巴巴前端规范
module.exports = {
    extends: [
        'eslint-config-ali/typescript/react',
        'prettier'
    ],
    rules: {
        // 组件命名
        'react/jsx-pascal-case': 'error',
        
        // Hooks 规则
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // 导入排序
        'import/order': ['error', {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always'
        }],
        
        // 命名规范
        '@typescript-eslint/naming-convention': [
            'error',
            { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
            { selector: 'typeAlias', format: ['PascalCase'] },
            { selector: 'enum', format: ['PascalCase'] },
            { selector: 'enumMember', format: ['UPPER_CASE'] }
        ],
        
        // 复杂度限制
        'complexity': ['warn', 10],
        'max-depth': ['warn', 4],
        'max-lines-per-function': ['warn', 100]
    }
};
```

### 2.2 组件开发规范

```typescript
// 组件文件结构
// src/components/base/Button/
// ├── index.tsx        # 组件入口
// ├── Button.tsx       # 组件实现
// ├── Button.module.scss
// ├── Button.test.tsx
// └── types.ts         # 类型定义

// types.ts
export type ButtonType = 'primary' | 'secondary' | 'danger' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
    /** 按钮类型 */
    type?: ButtonType;
    /** 按钮大小 */
    size?: ButtonSize;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否加载中 */
    loading?: boolean;
    /** 点击事件 */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** 子元素 */
    children: React.ReactNode;
    /** 自定义类名 */
    className?: string;
}

// Button.tsx
import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { ButtonProps } from './types';
import styles from './Button.module.scss';

/**
 * 按钮组件
 * @description 企业级按钮组件，支持多种类型和状态
 * @example
 * <Button type="primary" onClick={handleClick}>提交</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        const {
            type = 'primary',
            size = 'medium',
            disabled = false,
            loading = false,
            onClick,
            children,
            className,
            ...rest
        } = props;

        const classes = useMemo(
            () => classNames(
                styles.button,
                styles[`button--${type}`],
                styles[`button--${size}`],
                {
                    [styles['button--disabled']]: disabled,
                    [styles['button--loading']]: loading
                },
                className
            ),
            [type, size, disabled, loading, className]
        );

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled || loading) return;
            onClick?.(e);
        };

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled}
                onClick={handleClick}
                {...rest}
            >
                {loading && <span className={styles.spinner} />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

// index.tsx
export { Button } from './Button';
export type { ButtonProps, ButtonType, ButtonSize } from './types';
```

### 2.3 自定义 Hooks 规范

```typescript
// src/hooks/useRequest.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseRequestOptions<T> {
    /** 初始数据 */
    initialData?: T;
    /** 手动触发 */
    manual?: boolean;
    /** 依赖项 */
    refreshDeps?: any[];
    /** 成功回调 */
    onSuccess?: (data: T) => void;
    /** 失败回调 */
    onError?: (error: Error) => void;
    /** 防抖间隔 */
    debounceInterval?: number;
    /** 节流间隔 */
    throttleInterval?: number;
    /** 缓存 key */
    cacheKey?: string;
    /** 缓存时间 */
    cacheTime?: number;
}

interface UseRequestResult<T, P extends any[]> {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    run: (...params: P) => Promise<T>;
    refresh: () => Promise<T>;
    mutate: (newData: T | ((oldData?: T) => T)) => void;
    cancel: () => void;
}

const cache = new Map<string, { data: any; timestamp: number }>();

export function useRequest<T, P extends any[] = any[]>(
    service: (...params: P) => Promise<T>,
    options: UseRequestOptions<T> = {}
): UseRequestResult<T, P> {
    const {
        initialData,
        manual = false,
        refreshDeps = [],
        onSuccess,
        onError,
        debounceInterval,
        throttleInterval,
        cacheKey,
        cacheTime = 5 * 60 * 1000
    } = options;

    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState(!manual);
    const [error, setError] = useState<Error | null>(null);

    const paramsRef = useRef<P>([] as unknown as P);
    const cancelRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout>();
    const lastRunRef = useRef(0);

    // 执行请求
    const run = useCallback(async (...params: P): Promise<T> => {
        paramsRef.current = params;
        cancelRef.current = false;

        // 检查缓存
        if (cacheKey) {
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < cacheTime) {
                setData(cached.data);
                return cached.data;
            }
        }

        // 防抖处理
        if (debounceInterval) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            return new Promise((resolve, reject) => {
                timerRef.current = setTimeout(async () => {
                    try {
                        const result = await executeRequest(params);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                }, debounceInterval);
            });
        }

        // 节流处理
        if (throttleInterval) {
            const now = Date.now();
            if (now - lastRunRef.current < throttleInterval) {
                return data as T;
            }
            lastRunRef.current = now;
        }

        return executeRequest(params);
    }, [cacheKey, cacheTime, debounceInterval, throttleInterval]);

    // 执行请求核心逻辑
    const executeRequest = async (params: P): Promise<T> => {
        setLoading(true);
        setError(null);

        try {
            const result = await service(...params);

            if (cancelRef.current) {
                return result;
            }

            setData(result);

            // 设置缓存
            if (cacheKey) {
                cache.set(cacheKey, { data: result, timestamp: Date.now() });
            }

            onSuccess?.(result);
            return result;
        } catch (e) {
            const err = e as Error;
            if (!cancelRef.current) {
                setError(err);
                onError?.(err);
            }
            throw err;
        } finally {
            if (!cancelRef.current) {
                setLoading(false);
            }
        }
    };

    // 刷新
    const refresh = useCallback(() => {
        return run(...paramsRef.current);
    }, [run]);

    // 修改数据
    const mutate = useCallback((newData: T | ((oldData?: T) => T)) => {
        if (typeof newData === 'function') {
            setData((oldData) => (newData as (oldData?: T) => T)(oldData));
        } else {
            setData(newData);
        }
    }, []);

    // 取消请求
    const cancel = useCallback(() => {
        cancelRef.current = true;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    // 自动执行
    useEffect(() => {
        if (!manual) {
            run(...([] as unknown as P));
        }
    }, [...refreshDeps]);

    // 清理
    useEffect(() => {
        return () => {
            cancel();
        };
    }, [cancel]);

    return { data, loading, error, run, refresh, mutate, cancel };
}
```

---

## 3. 性能优化实践

### 3.1 代码分割策略

```typescript
// 路由级代码分割
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '@/components/Loading';

// 懒加载组件
const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/User/List'));
const UserDetail = lazy(() => import('@/pages/User/Detail'));

// 带预加载的懒加载
const OrderList = lazy(() => {
    // 预加载相关模块
    import('@/pages/Order/Detail');
    return import('@/pages/Order/List');
});

// 路由配置
function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/orders" element={<OrderList />} />
            </Routes>
        </Suspense>
    );
}

// Vite 配置分包
// vite.config.ts
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('antd') || id.includes('@ant-design')) {
                            return 'antd-vendor';
                        }
                        if (id.includes('lodash')) {
                            return 'lodash-vendor';
                        }
                        if (id.includes('echarts')) {
                            return 'echarts-vendor';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
});
```

### 3.2 虚拟列表实现

```typescript
// src/components/VirtualList/index.tsx
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';

interface VirtualListProps<T> {
    data: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    overscan?: number;
}

export function VirtualList<T>({
    data,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 3
}: VirtualListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    // 计算可视区域
    const { startIndex, endIndex, offsetY } = useMemo(() => {
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.min(start + visibleCount + overscan * 2, data.length);
        const actualStart = Math.max(0, start - overscan);
        
        return {
            startIndex: actualStart,
            endIndex: end,
            offsetY: actualStart * itemHeight
        };
    }, [scrollTop, containerHeight, itemHeight, data.length, overscan]);

    // 可视数据
    const visibleData = useMemo(
        () => data.slice(startIndex, endIndex),
        [data, startIndex, endIndex]
    );

    // 滚动处理
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    // 总高度
    const totalHeight = data.length * itemHeight;

    return (
        <div
            ref={containerRef}
            style={{
                height: containerHeight,
                overflow: 'auto',
                position: 'relative'
            }}
            onScroll={handleScroll}
        >
            {/* 占位元素 */}
            <div style={{ height: totalHeight }} />
            
            {/* 可视区域 */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${offsetY}px)`
                }}
            >
                {visibleData.map((item, index) => (
                    <div
                        key={startIndex + index}
                        style={{ height: itemHeight }}
                    >
                        {renderItem(item, startIndex + index)}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 3.3 图片懒加载

```typescript
// src/components/LazyImage/index.tsx
import React, { useRef, useEffect, useState } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder?: string;
    className?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    placeholder = '/images/placeholder.png',
    className,
    onLoad,
    onError
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        img.src = img.dataset.src || '';
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    const handleLoad = () => {
        setLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setError(true);
        onError?.();
    };

    return (
        <img
            ref={imgRef}
            src={placeholder}
            data-src={src}
            alt={alt}
            className={className}
            onLoad={handleLoad}
            onError={handleError}
            style={{
                opacity: loaded ? 1 : 0.5,
                transition: 'opacity 0.3s'
            }}
        />
    );
};
```

---

## 4. 安全防护方案

### 4.1 XSS 防护

```typescript
// src/utils/security.ts
import DOMPurify from 'dompurify';

// XSS 过滤
export function sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });
}

// HTML 实体编码
export function escapeHTML(str: string): string {
    const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return str.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}

// 安全渲染组件
interface SafeHTMLProps {
    html: string;
    className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
    const sanitized = useMemo(() => sanitizeHTML(html), [html]);
    
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitized }}
        />
    );
};
```

### 4.2 CSRF 防护

```typescript
// src/utils/csrf.ts
import Cookies from 'js-cookie';

const CSRF_TOKEN_KEY = 'XSRF-TOKEN';
const CSRF_HEADER_KEY = 'X-XSRF-TOKEN';

// 获取 CSRF Token
export function getCSRFToken(): string | undefined {
    return Cookies.get(CSRF_TOKEN_KEY);
}

// 在请求中添加 CSRF Token
// src/api/request.ts
instance.interceptors.request.use((config) => {
    const token = getCSRFToken();
    if (token) {
        config.headers[CSRF_HEADER_KEY] = token;
    }
    return config;
});
```

### 4.3 敏感数据加密

```typescript
// src/utils/crypto.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY;

// AES 加密
export function encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

// AES 解密
export function decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// RSA 公钥加密（敏感信息如密码）
export async function rsaEncrypt(data: string, publicKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const key = await crypto.subtle.importKey(
        'spki',
        pemToArrayBuffer(publicKey),
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
    );
    
    const encrypted = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        key,
        dataBuffer
    );
    
    return arrayBufferToBase64(encrypted);
}

// 安全存储
export const secureStorage = {
    set(key: string, value: any): void {
        const encrypted = encrypt(JSON.stringify(value));
        localStorage.setItem(key, encrypted);
    },
    
    get<T>(key: string): T | null {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        
        try {
            const decrypted = decrypt(encrypted);
            return JSON.parse(decrypted);
        } catch {
            return null;
        }
    },
    
    remove(key: string): void {
        localStorage.removeItem(key);
    }
};
```

---

## 5. 微前端架构

### 5.1 Qiankun 主应用配置

```typescript
// 主应用 main.tsx
import { registerMicroApps, start, addGlobalUncaughtErrorHandler } from 'qiankun';

// 微应用配置
const microApps = [
    {
        name: 'user-app',
        entry: '//localhost:8001',
        container: '#subapp-container',
        activeRule: '/user',
        props: {
            token: getToken(),
            routerBase: '/user'
        }
    },
    {
        name: 'order-app',
        entry: '//localhost:8002',
        container: '#subapp-container',
        activeRule: '/order',
        props: {
            token: getToken(),
            routerBase: '/order'
        }
    }
];

// 注册微应用
registerMicroApps(microApps, {
    beforeLoad: async (app) => {
        console.log(`[主应用] ${app.name} 加载前`);
    },
    beforeMount: async (app) => {
        console.log(`[主应用] ${app.name} 挂载前`);
    },
    afterMount: async (app) => {
        console.log(`[主应用] ${app.name} 挂载后`);
    },
    beforeUnmount: async (app) => {
        console.log(`[主应用] ${app.name} 卸载前`);
    },
    afterUnmount: async (app) => {
        console.log(`[主应用] ${app.name} 卸载后`);
    }
});

// 全局错误处理
addGlobalUncaughtErrorHandler((event) => {
    console.error('[主应用] 未捕获错误:', event);
});

// 启动 qiankun
start({
    sandbox: {
        strictStyleIsolation: true,
        experimentalStyleIsolation: true
    },
    prefetch: 'all'
});
```

### 5.2 Qiankun 子应用配置

```typescript
// 子应用 main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

let root: ReactDOM.Root | null = null;

// 渲染函数
function render(props: any = {}) {
    const { container, routerBase } = props;
    const mountNode = container 
        ? container.querySelector('#root')
        : document.getElementById('root');
    
    root = ReactDOM.createRoot(mountNode);
    root.render(
        <BrowserRouter basename={routerBase || '/'}>
            <App />
        </BrowserRouter>
    );
}

// 独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
    render();
}

// 生命周期函数
export async function bootstrap() {
    console.log('[子应用] bootstrap');
}

export async function mount(props: any) {
    console.log('[子应用] mount', props);
    render(props);
}

export async function unmount() {
    console.log('[子应用] unmount');
    root?.unmount();
    root = null;
}

export async function update(props: any) {
    console.log('[子应用] update', props);
}
```

```typescript
// 子应用 vite.config.ts
import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
    plugins: [
        qiankun('user-app', {
            useDevMode: true
        })
    ],
    server: {
        port: 8001,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
});
```

---

## 6. SSR/SSG 服务端渲染

### 6.1 Next.js 服务端渲染

```typescript
// pages/users/[id].tsx
import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface UserPageProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

// 服务端获取数据
export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {
    const { id } = context.params!;
    
    try {
        const res = await fetch(`${process.env.API_URL}/users/${id}`);
        const user = await res.json();
        
        if (!user) {
            return { notFound: true };
        }
        
        return {
            props: { user }
        };
    } catch (error) {
        return { notFound: true };
    }
};

// 页面组件
export default function UserPage({ user }: UserPageProps) {
    return (
        <>
            <Head>
                <title>{user.name} - 用户详情</title>
                <meta name="description" content={`用户 ${user.name} 的详细信息`} />
            </Head>
            
            <main>
                <h1>{user.name}</h1>
                <p>Email: {user.email}</p>
            </main>
        </>
    );
}
```

### 6.2 静态生成 (SSG)

```typescript
// pages/posts/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

interface PostPageProps {
    post: {
        title: string;
        content: string;
        date: string;
    };
    mdxSource: any;
}

// 静态路径生成
export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllPosts();
    
    return {
        paths: posts.map((post) => ({
            params: { slug: post.slug }
        })),
        fallback: 'blocking' // 或 true / false
    };
};

// 静态内容生成
export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
    const post = await getPostBySlug(params!.slug as string);
    
    if (!post) {
        return { notFound: true };
    }
    
    const mdxSource = await serialize(post.content);
    
    return {
        props: {
            post,
            mdxSource
        },
        revalidate: 60 // ISR: 60秒后重新生成
    };
};

export default function PostPage({ post, mdxSource }: PostPageProps) {
    return (
        <article>
            <h1>{post.title}</h1>
            <time>{post.date}</time>
            <MDXRemote {...mdxSource} />
        </article>
    );
}
```

---

## 7. BFF 层实践

### 7.1 BFF 服务实现

```typescript
// server/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// 限流
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 最多100次请求
});
app.use('/api', limiter);

// BFF 路由
app.use('/api/user', require('./routes/user'));
app.use('/api/order', require('./routes/order'));
app.use('/api/product', require('./routes/product'));

// 聚合接口示例
app.get('/api/dashboard', async (req, res) => {
    try {
        // 并行请求多个微服务
        const [userStats, orderStats, productStats] = await Promise.all([
            userService.getStats(),
            orderService.getStats(),
            productService.getStats()
        ]);
        
        // 数据聚合
        res.json({
            code: 0,
            data: {
                users: userStats,
                orders: orderStats,
                products: productStats,
                summary: {
                    totalUsers: userStats.total,
                    totalOrders: orderStats.total,
                    totalRevenue: orderStats.revenue
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        });
    }
});

app.listen(3001, () => {
    console.log('BFF Server running on port 3001');
});
```

### 7.2 GraphQL BFF

```typescript
// server/graphql/schema.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        orders: [Order!]!
    }
    
    type Order {
        id: ID!
        total: Float!
        status: String!
        items: [OrderItem!]!
        user: User!
    }
    
    type OrderItem {
        product: Product!
        quantity: Int!
        price: Float!
    }
    
    type Product {
        id: ID!
        name: String!
        price: Float!
        stock: Int!
    }
    
    type Query {
        user(id: ID!): User
        users(page: Int, pageSize: Int): [User!]!
        order(id: ID!): Order
        orders(userId: ID, status: String): [Order!]!
    }
    
    type Mutation {
        createOrder(input: CreateOrderInput!): Order!
        updateOrderStatus(id: ID!, status: String!): Order!
    }
    
    input CreateOrderInput {
        userId: ID!
        items: [OrderItemInput!]!
    }
    
    input OrderItemInput {
        productId: ID!
        quantity: Int!
    }
`;

// server/graphql/resolvers.ts
export const resolvers = {
    Query: {
        user: async (_, { id }, { dataSources }) => {
            return dataSources.userAPI.getUser(id);
        },
        users: async (_, { page, pageSize }, { dataSources }) => {
            return dataSources.userAPI.getUsers(page, pageSize);
        },
        order: async (_, { id }, { dataSources }) => {
            return dataSources.orderAPI.getOrder(id);
        }
    },
    
    User: {
        orders: async (user, _, { dataSources }) => {
            return dataSources.orderAPI.getOrdersByUser(user.id);
        }
    },
    
    Order: {
        user: async (order, _, { dataSources }) => {
            return dataSources.userAPI.getUser(order.userId);
        },
        items: async (order, _, { dataSources }) => {
            return dataSources.orderAPI.getOrderItems(order.id);
        }
    },
    
    Mutation: {
        createOrder: async (_, { input }, { dataSources }) => {
            return dataSources.orderAPI.createOrder(input);
        }
    }
};
```

---

## 8. 大型状态管理

### 8.1 Redux Toolkit 企业级配置

```typescript
// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import uiReducer from './slices/uiSlice';

// 持久化配置
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user'] // 只持久化 user
};

const rootReducer = combineReducers({
    user: userReducer,
    order: orderReducer,
    ui: uiReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }),
    devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi, User, LoginParams } from '@/api';

interface UserState {
    currentUser: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    token: null,
    loading: false,
    error: null
};

// 异步 Thunk
export const login = createAsyncThunk(
    'user/login',
    async (params: LoginParams, { rejectWithValue }) => {
        try {
            const result = await userApi.login(params);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const user = await userApi.getUserInfo();
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.currentUser = null;
            state.token = null;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchUserInfo
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            });
    }
});

export const { logout, setToken } = userSlice.actions;
export default userSlice.reducer;
```

### 8.2 Zustand 轻量状态管理

```typescript
// store/useUserStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { userApi, User } from '@/api';

interface UserState {
    user: User | null;
    token: string | null;
    loading: boolean;
    
    // Actions
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUserInfo: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            immer((set, get) => ({
                user: null,
                token: null,
                loading: false,
                
                login: async (username, password) => {
                    set({ loading: true });
                    try {
                        const { token, user } = await userApi.login({ username, password });
                        set({ token, user, loading: false });
                    } catch (error) {
                        set({ loading: false });
                        throw error;
                    }
                },
                
                logout: () => {
                    set({ user: null, token: null });
                },
                
                fetchUserInfo: async () => {
                    const user = await userApi.getUserInfo();
                    set({ user });
                },
                
                updateUser: (data) => {
                    set((state) => {
                        if (state.user) {
                            Object.assign(state.user, data);
                        }
                    });
                }
            })),
            {
                name: 'user-storage',
                partialize: (state) => ({ token: state.token })
            }
        ),
        { name: 'UserStore' }
    )
);
```

---

## 9. 国际化方案

### 9.1 react-i18next 配置

```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'zh-CN',
        supportedLngs: ['zh-CN', 'en-US', 'ja-JP'],
        
        interpolation: {
            escapeValue: false
        },
        
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        
        react: {
            useSuspense: true
        }
    });

export default i18n;
```

```json
// public/locales/zh-CN/common.json
{
    "nav": {
        "home": "首页",
        "user": "用户管理",
        "order": "订单管理"
    },
    "action": {
        "submit": "提交",
        "cancel": "取消",
        "delete": "删除",
        "edit": "编辑"
    },
    "message": {
        "success": "操作成功",
        "error": "操作失败",
        "confirm": "确认{{action}}吗？"
    }
}
```

```typescript
// 使用示例
import { useTranslation } from 'react-i18next';

function UserList() {
    const { t, i18n } = useTranslation('common');
    
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    
    return (
        <div>
            <h1>{t('nav.user')}</h1>
            <button onClick={() => changeLanguage('en-US')}>English</button>
            <button onClick={() => changeLanguage('zh-CN')}>中文</button>
            <button>{t('action.submit')}</button>
        </div>
    );
}
```

---

## 10. 主题换肤系统

### 10.1 CSS 变量主题

```typescript
// styles/themes.ts
export interface Theme {
    '--primary-color': string;
    '--secondary-color': string;
    '--background-color': string;
    '--text-color': string;
    '--border-color': string;
}

export const lightTheme: Theme = {
    '--primary-color': '#1890ff',
    '--secondary-color': '#52c41a',
    '--background-color': '#ffffff',
    '--text-color': '#333333',
    '--border-color': '#d9d9d9'
};

export const darkTheme: Theme = {
    '--primary-color': '#177ddc',
    '--secondary-color': '#49aa19',
    '--background-color': '#141414',
    '--text-color': '#ffffff',
    '--border-color': '#434343'
};

// hooks/useTheme.ts
import { useState, useEffect } from 'react';
import { Theme, lightTheme, darkTheme } from '@/styles/themes';

type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
    const [mode, setMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
    });
    
    const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
    
    useEffect(() => {
        let theme = lightTheme;
        
        if (mode === 'dark') {
            theme = darkTheme;
        } else if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? darkTheme : lightTheme;
        }
        
        setCurrentTheme(theme);
        
        // 应用主题
        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        
        // 持久化
        localStorage.setItem('theme-mode', mode);
    }, [mode]);
    
    return { mode, setMode, currentTheme };
}
```

---

## 11. 权限控制系统

### 11.1 RBAC 权限模型

```typescript
// types/permission.ts
export interface Permission {
    id: string;
    name: string;
    code: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface User {
    id: string;
    name: string;
    roles: Role[];
}

// hooks/usePermission.ts
import { useMemo } from 'react';
import { useUserStore } from '@/store/useUserStore';

export function usePermission() {
    const user = useUserStore((state) => state.user);
    
    // 获取所有权限码
    const permissions = useMemo(() => {
        if (!user?.roles) return new Set<string>();
        
        const codes = new Set<string>();
        user.roles.forEach((role) => {
            role.permissions.forEach((perm) => {
                codes.add(perm.code);
            });
        });
        return codes;
    }, [user]);
    
    // 检查单个权限
    const hasPermission = (code: string): boolean => {
        return permissions.has(code);
    };
    
    // 检查多个权限（任一）
    const hasAnyPermission = (codes: string[]): boolean => {
        return codes.some((code) => permissions.has(code));
    };
    
    // 检查多个权限（全部）
    const hasAllPermissions = (codes: string[]): boolean => {
        return codes.every((code) => permissions.has(code));
    };
    
    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    };
}

// components/Authorized.tsx
interface AuthorizedProps {
    permission: string | string[];
    mode?: 'any' | 'all';
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export const Authorized: React.FC<AuthorizedProps> = ({
    permission,
    mode = 'any',
    fallback = null,
    children
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
    
    const codes = Array.isArray(permission) ? permission : [permission];
    
    const authorized = mode === 'all'
        ? hasAllPermissions(codes)
        : hasAnyPermission(codes);
    
    return authorized ? <>{children}</> : <>{fallback}</>;
};

// 使用示例
function UserManagement() {
    return (
        <div>
            <Authorized permission="user:create">
                <Button>新建用户</Button>
            </Authorized>
            
            <Authorized permission={['user:edit', 'user:delete']} mode="any">
                <Button>编辑</Button>
            </Authorized>
        </div>
    );
}
```

---

## 12. 错误边界与降级

### 12.1 错误边界组件

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { Result, Button } from 'antd';

interface Props {
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
        error: null
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // 上报错误
        this.props.onError?.(error, errorInfo);
        
        // 发送到监控服务
        reportError({
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            
            return (
                <Result
                    status="error"
                    title="页面出错了"
                    subTitle="抱歉，页面发生了一些错误，请稍后重试"
                    extra={[
                        <Button type="primary" onClick={this.handleRetry} key="retry">
                            重试
                        </Button>,
                        <Button onClick={() => window.location.href = '/'} key="home">
                            返回首页
                        </Button>
                    ]}
                />
            );
        }

        return this.props.children;
    }
}
```

---

## 13. 监控告警体系

### 13.1 前端监控 SDK

```typescript
// monitor/index.ts
interface MonitorConfig {
    appId: string;
    reportUrl: string;
    sampleRate?: number;
}

class FrontendMonitor {
    private config: MonitorConfig;
    private queue: any[] = [];
    
    constructor(config: MonitorConfig) {
        this.config = {
            sampleRate: 1,
            ...config
        };
    }
    
    init() {
        this.initErrorMonitor();
        this.initPerformanceMonitor();
        this.initBehaviorMonitor();
        this.startReportTimer();
    }
    
    // 错误监控
    private initErrorMonitor() {
        // JS 错误
        window.onerror = (message, source, lineno, colno, error) => {
            this.report('error', {
                type: 'js_error',
                message,
                source,
                lineno,
                colno,
                stack: error?.stack
            });
        };
        
        // Promise 错误
        window.onunhandledrejection = (event) => {
            this.report('error', {
                type: 'promise_error',
                message: event.reason?.message || String(event.reason)
            });
        };
        
        // 资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.report('error', {
                    type: 'resource_error',
                    tagName: (event.target as HTMLElement).tagName,
                    src: (event.target as HTMLImageElement).src
                });
            }
        }, true);
    }
    
    // 性能监控
    private initPerformanceMonitor() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                
                this.report('performance', {
                    dns: timing.domainLookupEnd - timing.domainLookupStart,
                    tcp: timing.connectEnd - timing.connectStart,
                    ttfb: timing.responseStart - timing.requestStart,
                    domReady: timing.domContentLoadedEventEnd - timing.fetchStart,
                    pageLoad: timing.loadEventEnd - timing.fetchStart,
                    resourceCount: performance.getEntriesByType('resource').length
                });
            }, 0);
        });
    }
    
    // 用户行为监控
    private initBehaviorMonitor() {
        // PV
        this.report('behavior', {
            type: 'pv',
            url: window.location.href,
            referrer: document.referrer
        });
        
        // 点击事件
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.dataset.track) {
                this.report('behavior', {
                    type: 'click',
                    trackId: target.dataset.track,
                    text: target.innerText?.slice(0, 50)
                });
            }
        });
    }
    
    // 上报数据
    private report(category: string, data: any) {
        if (Math.random() > this.config.sampleRate!) return;
        
        this.queue.push({
            category,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }
    
    // 定时上报
    private startReportTimer() {
        setInterval(() => {
            if (this.queue.length === 0) return;
            
            const data = this.queue.splice(0, 10);
            
            navigator.sendBeacon(
                this.config.reportUrl,
                JSON.stringify({
                    appId: this.config.appId,
                    data
                })
            );
        }, 5000);
    }
}

export const monitor = new FrontendMonitor({
    appId: import.meta.env.VITE_APP_ID,
    reportUrl: import.meta.env.VITE_MONITOR_URL,
    sampleRate: 0.1
});
```

---

## 14. 灰度发布方案

### 14.1 前端灰度控制

```typescript
// utils/grayRelease.ts
interface GrayConfig {
    features: {
        [key: string]: {
            enabled: boolean;
            percentage?: number;
            whitelist?: string[];
            conditions?: Record<string, any>;
        };
    };
}

class GrayRelease {
    private config: GrayConfig = { features: {} };
    private userId: string = '';
    
    async init(userId: string) {
        this.userId = userId;
        this.config = await this.fetchConfig();
    }
    
    private async fetchConfig(): Promise<GrayConfig> {
        const response = await fetch('/api/gray-config');
        return response.json();
    }
    
    // 检查功能是否对用户开放
    isFeatureEnabled(featureKey: string, userInfo?: Record<string, any>): boolean {
        const feature = this.config.features[featureKey];
        
        if (!feature || !feature.enabled) {
            return false;
        }
        
        // 白名单检查
        if (feature.whitelist?.includes(this.userId)) {
            return true;
        }
        
        // 百分比灰度
        if (feature.percentage !== undefined) {
            const hash = this.hashUserId(this.userId);
            return hash < feature.percentage;
        }
        
        // 条件灰度
        if (feature.conditions && userInfo) {
            return Object.entries(feature.conditions).every(
                ([key, value]) => userInfo[key] === value
            );
        }
        
        return true;
    }
    
    private hashUserId(userId: string): number {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash) + userId.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash % 100);
    }
}

export const grayRelease = new GrayRelease();

// 使用示例
function NewFeature() {
    const [enabled, setEnabled] = useState(false);
    
    useEffect(() => {
        setEnabled(grayRelease.isFeatureEnabled('new-dashboard'));
    }, []);
    
    if (!enabled) {
        return <OldDashboard />;
    }
    
    return <NewDashboard />;
}
```

---

## 15. CDN 与缓存策略

### 15.1 资源缓存配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # HTML 文件 - 不缓存
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # JS/CSS 文件 - 长期缓存（带 hash）
    location ~* \.(js|css)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 图片/字体 - 长期缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        add_header Cache-Control "public, max-age=31536000";
    }

    # API 代理
    location /api {
        proxy_pass http://backend;
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key $request_uri;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 15.2 Service Worker 缓存

```typescript
// sw.ts
const CACHE_NAME = 'app-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// 安装
self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    (self as any).skipWaiting();
});

// 激活
self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

// 请求拦截
self.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // API 请求 - 网络优先
    if (url.pathname.startsWith('/api')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // 静态资源 - 缓存优先
    if (request.destination === 'image' || 
        request.destination === 'script' ||
        request.destination === 'style') {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // HTML - 网络优先
    event.respondWith(networkFirst(request));
});

async function cacheFirst(request: Request): Promise<Response> {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
}

async function networkFirst(request: Request): Promise<Response> {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error('Network error and no cache available');
    }
}
```

---

## 附录：企业级项目检查清单

### 代码质量
- [ ] ESLint + Prettier 配置
- [ ] TypeScript 严格模式
- [ ] 单元测试覆盖率 > 80%
- [ ] E2E 测试关键流程
- [ ] Git Hooks 自动检查

### 性能优化
- [ ] 代码分割与懒加载
- [ ] 图片压缩与懒加载
- [ ] 虚拟列表大数据渲染
- [ ] CDN 静态资源
- [ ] Service Worker 缓存

### 安全防护
- [ ] XSS 防护
- [ ] CSRF 防护
- [ ] 敏感数据加密
- [ ] HTTPS 强制
- [ ] CSP 策略

### 监控告警
- [ ] 错误监控
- [ ] 性能监控
- [ ] 用户行为分析
- [ ] 告警通知

### 发布部署
- [ ] CI/CD 流水线
- [ ] 灰度发布
- [ ] 回滚机制
- [ ] 多环境配置

---

**文档版本**: 1.0  
**适用场景**: 大厂企业级前端项目  
**最后更新**: 2026年2月
