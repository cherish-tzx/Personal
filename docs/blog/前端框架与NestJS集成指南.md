# 前端框架与 NestJS 集成指南
<div class="doc-toc">

## 目录

1. [React + NestJS 全栈开发](#1-react--nestjs-全栈开发)
2. [Vue + NestJS 全栈开发](#2-vue--nestjs-全栈开发)
3. [Angular + NestJS 全栈开发](#3-angular--nestjs-全栈开发)
4. [Next.js + NestJS 全栈开发](#4-nextjs--nestjs-全栈开发)
5. [Nuxt.js + NestJS 全栈开发](#5-nuxtjs--nestjs-全栈开发)
6. [移动端集成](#6-移动端集成)
7. [通用 API 客户端封装](#7-通用-api-客户端封装)
8. [认证状态管理](#8-认证状态管理)
9. [实时通信集成](#9-实时通信集成)
10. [文件上传处理](#10-文件上传处理)

</div>

---

## 1. React + NestJS 全栈开发

### 1.1 项目结构

```
monorepo/
├── apps/
│   ├── api/                    # NestJS 后端
│   │   ├── src/
│   │   └── package.json
│   └── web/                    # React 前端
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/                 # 共享类型定义
│       ├── src/
│       │   ├── dto/
│       │   └── types/
│       └── package.json
├── package.json
└── turbo.json
```

### 1.2 共享类型定义

```typescript
// packages/shared/src/dto/user.dto.ts
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// packages/shared/src/types/api.ts
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
```

### 1.3 React API 客户端

```typescript
// apps/web/src/api/client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '@shared/types';

class ApiClient {
  private instance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as any;
        
        // Token 过期，尝试刷新
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            // 刷新失败，跳转登录
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }
  
  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = (async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken }
      );
      
      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    })();
    
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    return this.instance.get(url, { params });
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    return this.instance.post(url, data);
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    return this.instance.put(url, data);
  }
  
  async patch<T>(url: string, data?: any): Promise<T> {
    return this.instance.patch(url, data);
  }
  
  async delete<T>(url: string): Promise<T> {
    return this.instance.delete(url);
  }
  
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      }
    });
  }
}

export const apiClient = new ApiClient();
```

### 1.4 React Query 集成

```typescript
// apps/web/src/api/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { 
  UserResponseDto, CreateUserDto, UpdateUserDto, 
  PaginatedResponse, ApiResponse 
} from '@shared/types';

// 查询键
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 获取用户列表
export function useUsers(params: { page?: number; limit?: number; keyword?: string }) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => apiClient.get<ApiResponse<PaginatedResponse<UserResponseDto>>>('/users', params),
    select: (response) => response.data
  });
}

// 获取单个用户
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => apiClient.get<ApiResponse<UserResponseDto>>(`/users/${id}`),
    select: (response) => response.data,
    enabled: !!id
  });
}

// 创建用户
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserDto) => 
      apiClient.post<ApiResponse<UserResponseDto>>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

// 更新用户
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      apiClient.put<ApiResponse<UserResponseDto>>(`/users/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}

// 删除用户
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}
```

### 1.5 React 组件示例

```tsx
// apps/web/src/pages/UserList.tsx
import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '../api/hooks/useUsers';
import { Table, Button, Input, Pagination, message, Modal } from 'antd';

export const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState('');
  
  const { data, isLoading, error } = useUsers({ page, limit, keyword });
  const deleteUser = useDeleteUser();
  
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？',
      onOk: async () => {
        try {
          await deleteUser.mutateAsync(id);
          message.success('删除成功');
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      }
    });
  };
  
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <div>
          <Button type="link" href={`/users/${record.id}/edit`}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </div>
      )
    }
  ];
  
  if (error) {
    return <div>加载失败: {(error as any).message}</div>;
  }
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索用户"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={() => setPage(1)}
          style={{ width: 300 }}
        />
        <Button type="primary" href="/users/create" style={{ marginLeft: 16 }}>
          新建用户
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={data?.items}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
      
      <Pagination
        current={page}
        pageSize={limit}
        total={data?.total || 0}
        onChange={(p, l) => { setPage(p); setLimit(l); }}
        showSizeChanger
        showTotal={(total) => `共 ${total} 条`}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};
```

---

## 2. Vue + NestJS 全栈开发

### 2.1 Vue 3 API 客户端

```typescript
// apps/web/src/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000
});

// 请求拦截器
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const authStore = useAuthStore();
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authStore.refreshAccessToken();
        return apiClient(originalRequest);
      } catch {
        authStore.logout();
        router.push('/login');
      }
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

export { apiClient };
```

### 2.2 Pinia Store 与 API 集成

```typescript
// apps/web/src/stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/api/client';
import type { UserResponseDto, CreateUserDto, UpdateUserDto, PaginatedResponse, ApiResponse } from '@shared/types';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<UserResponseDto[]>([]);
  const currentUser = ref<UserResponseDto | null>(null);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Getters
  const totalPages = computed(() => Math.ceil(total.value / limit.value));
  const hasNextPage = computed(() => page.value < totalPages.value);
  
  // Actions
  async function fetchUsers(params: { page?: number; limit?: number; keyword?: string } = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<UserResponseDto>>>('/users', {
        params: {
          page: params.page || page.value,
          limit: params.limit || limit.value,
          keyword: params.keyword
        }
      });
      
      users.value = response.data.items;
      total.value = response.data.total;
      page.value = response.data.page;
      limit.value = response.data.limit;
    } catch (err: any) {
      error.value = err.message || '获取用户列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchUser(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get<ApiResponse<UserResponseDto>>(`/users/${id}`);
      currentUser.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || '获取用户详情失败';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function createUser(data: CreateUserDto) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.post<ApiResponse<UserResponseDto>>('/users', data);
      users.value.unshift(response.data);
      total.value++;
      return response.data;
    } catch (err: any) {
      error.value = err.message || '创建用户失败';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function updateUser(id: string, data: UpdateUserDto) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.put<ApiResponse<UserResponseDto>>(`/users/${id}`, data);
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = response.data;
      }
      if (currentUser.value?.id === id) {
        currentUser.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message || '更新用户失败';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function deleteUser(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      await apiClient.delete(`/users/${id}`);
      users.value = users.value.filter(u => u.id !== id);
      total.value--;
    } catch (err: any) {
      error.value = err.message || '删除用户失败';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  return {
    // State
    users,
    currentUser,
    total,
    page,
    limit,
    loading,
    error,
    // Getters
    totalPages,
    hasNextPage,
    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser
  };
});
```

### 2.3 Vue 组件示例

```vue
<!-- apps/web/src/views/UserList.vue -->
<template>
  <div class="user-list">
    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索用户"
        clearable
        @keyup.enter="handleSearch"
        style="width: 300px"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      
      <el-button type="primary" @click="$router.push('/users/create')">
        新建用户
      </el-button>
    </div>
    
    <el-table
      v-loading="userStore.loading"
      :data="userStore.users"
      stripe
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="$router.push(`/users/${row.id}/edit`)">
            编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-model:current-page="userStore.page"
      v-model:page-size="userStore.limit"
      :total="userStore.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handlePageChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import type { UserResponseDto } from '@shared/types';

const userStore = useUserStore();
const keyword = ref('');

onMounted(() => {
  userStore.fetchUsers();
});

function handleSearch() {
  userStore.fetchUsers({ page: 1, keyword: keyword.value });
}

function handlePageChange() {
  userStore.fetchUsers({ keyword: keyword.value });
}

async function handleDelete(user: UserResponseDto) {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${user.name} 吗？`, '确认删除', {
      type: 'warning'
    });
    
    await userStore.deleteUser(user.id);
    ElMessage.success('删除成功');
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN');
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
```

### 2.4 Vue Composable 封装

```typescript
// apps/web/src/composables/useApi.ts
import { ref, Ref } from 'vue';
import { apiClient } from '@/api/client';

interface UseApiOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useApi<T, P = any>(
  fetcher: (params?: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const data = ref<T | undefined>(options.initialData) as Ref<T | undefined>;
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  async function execute(params?: P) {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await fetcher(params);
      data.value = result;
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      error.value = err.message || '请求失败';
      options.onError?.(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  if (options.immediate) {
    execute();
  }
  
  return {
    data,
    loading,
    error,
    execute
  };
}

// 使用示例
export function useUser(id: Ref<string>) {
  return useApi(
    () => apiClient.get(`/users/${id.value}`),
    { immediate: true }
  );
}

export function useUserList() {
  return useApi<PaginatedResponse<UserResponseDto>>(
    (params) => apiClient.get('/users', { params }),
    { immediate: false }
  );
}
```

---

## 3. Angular + NestJS 全栈开发

### 3.1 Angular HTTP 服务

```typescript
// apps/web/src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '@shared/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  get<T>(path: string, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(
        retry(1),
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  
  upload<T>(path: string, file: File, onProgress?: (progress: number) => void): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: any) => {
        if (event.type === 1 && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
        if (event.body) {
          return event.body.data;
        }
        return null;
      }),
      catchError(this.handleError)
    );
  }
  
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return httpParams;
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '请求失败';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `错误码: ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

### 3.2 Angular HTTP 拦截器

```typescript
// apps/web/src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 添加 token
    if (this.authService.accessToken) {
      request = this.addToken(request, this.authService.accessToken);
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }
  
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      
      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }
    
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }
}
```

### 3.3 Angular 用户服务

```typescript
// apps/web/src/app/features/user/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { 
  UserResponseDto, CreateUserDto, UpdateUserDto, 
  PaginatedResponse 
} from '@shared/types';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<UserResponseDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  
  constructor(private api: ApiService) {}
  
  getUsers(params: UserQueryParams = {}): Observable<PaginatedResponse<UserResponseDto>> {
    this.loadingSubject.next(true);
    
    return this.api.get<PaginatedResponse<UserResponseDto>>('/users', params)
      .pipe(
        tap({
          next: (response) => {
            this.usersSubject.next(response.items);
            this.loadingSubject.next(false);
          },
          error: () => this.loadingSubject.next(false)
        })
      );
  }
  
  getUser(id: string): Observable<UserResponseDto> {
    return this.api.get<UserResponseDto>(`/users/${id}`);
  }
  
  createUser(data: CreateUserDto): Observable<UserResponseDto> {
    return this.api.post<UserResponseDto>('/users', data)
      .pipe(
        tap(user => {
          const currentUsers = this.usersSubject.getValue();
          this.usersSubject.next([user, ...currentUsers]);
        })
      );
  }
  
  updateUser(id: string, data: UpdateUserDto): Observable<UserResponseDto> {
    return this.api.put<UserResponseDto>(`/users/${id}`, data)
      .pipe(
        tap(updatedUser => {
          const currentUsers = this.usersSubject.getValue();
          const index = currentUsers.findIndex(u => u.id === id);
          if (index !== -1) {
            currentUsers[index] = updatedUser;
            this.usersSubject.next([...currentUsers]);
          }
        })
      );
  }
  
  deleteUser(id: string): Observable<void> {
    return this.api.delete<void>(`/users/${id}`)
      .pipe(
        tap(() => {
          const currentUsers = this.usersSubject.getValue();
          this.usersSubject.next(currentUsers.filter(u => u.id !== id));
        })
      );
  }
}
```

### 3.4 Angular 组件示例

```typescript
// apps/web/src/app/features/user/components/user-list/user-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from '../../services/user.service';
import { UserResponseDto, PaginatedResponse } from '@shared/types';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzTableModule,
    NzButtonModule,
    NzInputModule
  ],
  template: `
    <div class="toolbar">
      <nz-input-group nzSearch [nzAddOnAfter]="searchButton">
        <input
          nz-input
          placeholder="搜索用户"
          [(ngModel)]="keyword"
          (ngModelChange)="onKeywordChange($event)"
        />
      </nz-input-group>
      <ng-template #searchButton>
        <button nz-button nzType="primary" (click)="search()">搜索</button>
      </ng-template>
      
      <a nz-button nzType="primary" routerLink="/users/create">新建用户</a>
    </div>
    
    <nz-table
      #table
      [nzData]="users$ | async"
      [nzLoading]="loading$ | async"
      [nzTotal]="total"
      [nzPageSize]="pageSize"
      [nzPageIndex]="pageIndex"
      (nzPageIndexChange)="onPageChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)"
      nzShowSizeChanger
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>邮箱</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of table.data">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.createdAt | date:'yyyy-MM-dd' }}</td>
          <td>
            <a [routerLink]="['/users', user.id, 'edit']">编辑</a>
            <a nz-button nzType="link" nzDanger (click)="confirmDelete(user)">删除</a>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [`
    .toolbar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    nz-input-group {
      width: 300px;
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users$ = this.userService.users$;
  loading$ = this.userService.loading$;
  
  keyword = '';
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}
  
  ngOnInit() {
    this.loadUsers();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadUsers());
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadUsers() {
    this.userService.getUsers({
      page: this.pageIndex,
      limit: this.pageSize,
      keyword: this.keyword
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.total = response.total;
        },
        error: (error) => {
          this.message.error(error.message || '加载失败');
        }
      });
  }
  
  onKeywordChange(value: string) {
    this.searchSubject.next(value);
  }
  
  search() {
    this.pageIndex = 1;
    this.loadUsers();
  }
  
  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadUsers();
  }
  
  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadUsers();
  }
  
  confirmDelete(user: UserResponseDto) {
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `确定要删除用户 ${user.name} 吗？`,
      nzOkText: '删除',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(user.id)
    });
  }
  
  deleteUser(id: string) {
    this.userService.deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message.success('删除成功');
        },
        error: (error) => {
          this.message.error(error.message || '删除失败');
        }
      });
  }
}
```

---

## 4. Next.js + NestJS 全栈开发

### 4.1 Next.js API 配置

```typescript
// apps/web/src/lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

class ApiClient {
  private instance: AxiosInstance;
  
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: 10000
    });
    
    this.instance.interceptors.request.use(async (config) => {
      // 在浏览器端获取 session
      if (typeof window !== 'undefined') {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      }
      return config;
    });
    
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error.response?.data || error.message)
    );
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    return this.instance.get(url, { params });
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    return this.instance.post(url, data);
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    return this.instance.put(url, data);
  }
  
  async delete<T>(url: string): Promise<T> {
    return this.instance.delete(url);
  }
}

export const api = new ApiClient();

// 服务端 API 客户端
export function createServerApi(accessToken?: string) {
  const instance = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  });
  
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || error.message)
  );
  
  return {
    get: <T>(url: string, params?: any) => instance.get<T>(url, { params }),
    post: <T>(url: string, data?: any) => instance.post<T>(url, data),
    put: <T>(url: string, data?: any) => instance.put<T>(url, data),
    delete: <T>(url: string) => instance.delete<T>(url)
  };
}
```

### 4.2 Next.js Server Actions

```typescript
// apps/web/src/app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { createServerApi } from '@/lib/api';
import { CreateUserDto, UpdateUserDto } from '@shared/types';

async function getApi() {
  const session = await getServerSession(authOptions);
  return createServerApi(session?.accessToken);
}

export async function getUsers(params?: { page?: number; limit?: number; keyword?: string }) {
  const api = await getApi();
  return api.get('/users', params);
}

export async function getUser(id: string) {
  const api = await getApi();
  return api.get(`/users/${id}`);
}

export async function createUser(formData: FormData) {
  const api = await getApi();
  
  const data: CreateUserDto = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };
  
  try {
    await api.post('/users', data);
    revalidatePath('/users');
    redirect('/users');
  } catch (error: any) {
    return { error: error.message || '创建失败' };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const api = await getApi();
  
  const data: UpdateUserDto = {
    name: formData.get('name') as string,
    email: formData.get('email') as string
  };
  
  try {
    await api.put(`/users/${id}`, data);
    revalidatePath('/users');
    revalidatePath(`/users/${id}`);
    redirect('/users');
  } catch (error: any) {
    return { error: error.message || '更新失败' };
  }
}

export async function deleteUser(id: string) {
  const api = await getApi();
  
  try {
    await api.delete(`/users/${id}`);
    revalidatePath('/users');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || '删除失败' };
  }
}
```

### 4.3 Next.js 页面组件

```tsx
// apps/web/src/app/users/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { getUsers, deleteUser } from '@/app/actions/user';
import { UserTable } from './components/UserTable';
import { SearchInput } from './components/SearchInput';
import { Pagination } from './components/Pagination';

interface PageProps {
  searchParams: { page?: string; limit?: string; keyword?: string };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  const keyword = searchParams.keyword || '';
  
  const data = await getUsers({ page, limit, keyword });
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Link
          href="/users/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新建用户
        </Link>
      </div>
      
      <div className="mb-4">
        <SearchInput defaultValue={keyword} />
      </div>
      
      <Suspense fallback={<div>加载中...</div>}>
        <UserTable users={data.data.items} onDelete={deleteUser} />
      </Suspense>
      
      <div className="mt-4">
        <Pagination
          total={data.data.total}
          page={page}
          limit={limit}
        />
      </div>
    </div>
  );
}

// apps/web/src/app/users/components/UserTable.tsx
'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { UserResponseDto } from '@shared/types';

interface UserTableProps {
  users: UserResponseDto[];
  onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
}

export function UserTable({ users, onDelete }: UserTableProps) {
  const [isPending, startTransition] = useTransition();
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除用户 ${name} 吗？`)) return;
    
    startTransition(async () => {
      const result = await onDelete(id);
      if (result.error) {
        alert(result.error);
      }
    });
  };
  
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">ID</th>
          <th className="border p-2 text-left">姓名</th>
          <th className="border p-2 text-left">邮箱</th>
          <th className="border p-2 text-left">创建时间</th>
          <th className="border p-2 text-left">操作</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className={isPending ? 'opacity-50' : ''}>
            <td className="border p-2">{user.id}</td>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="border p-2">
              <Link
                href={`/users/${user.id}/edit`}
                className="text-blue-500 hover:underline mr-4"
              >
                编辑
              </Link>
              <button
                onClick={() => handleDelete(user.id, user.name)}
                className="text-red-500 hover:underline"
                disabled={isPending}
              >
                删除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 5. Nuxt.js + NestJS 全栈开发

### 5.1 Nuxt 3 配置

```typescript
// apps/web/nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    }
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss']
});
```

### 5.2 Nuxt Composables

```typescript
// apps/web/composables/useApi.ts
import type { UseFetchOptions } from 'nuxt/app';

export function useApi<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const config = useRuntimeConfig();
  const { token } = useAuth();
  
  return useFetch(url, {
    baseURL: config.public.apiUrl,
    ...options,
    headers: {
      ...options.headers,
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login');
      }
    }
  });
}

// apps/web/composables/useAuth.ts
export function useAuth() {
  const token = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken');
  const user = useState<any>('user', () => null);
  
  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig();
    
    const { data, error } = await useFetch<any>('/auth/login', {
      baseURL: config.public.apiUrl,
      method: 'POST',
      body: { email, password }
    });
    
    if (error.value) {
      throw new Error(error.value.data?.message || '登录失败');
    }
    
    token.value = data.value.data.accessToken;
    refreshToken.value = data.value.data.refreshToken;
    user.value = data.value.data.user;
    
    return data.value;
  };
  
  const logout = () => {
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    navigateTo('/login');
  };
  
  const refresh = async () => {
    const config = useRuntimeConfig();
    
    const { data, error } = await useFetch<any>('/auth/refresh', {
      baseURL: config.public.apiUrl,
      method: 'POST',
      body: { refreshToken: refreshToken.value }
    });
    
    if (error.value) {
      logout();
      return;
    }
    
    token.value = data.value.data.accessToken;
  };
  
  return {
    token,
    user,
    login,
    logout,
    refresh,
    isAuthenticated: computed(() => !!token.value)
  };
}

// apps/web/composables/useUsers.ts
import type { UserResponseDto, PaginatedResponse, ApiResponse } from '@shared/types';

export function useUsers(params?: Ref<{ page?: number; limit?: number; keyword?: string }>) {
  return useApi<ApiResponse<PaginatedResponse<UserResponseDto>>>('/users', {
    params,
    watch: [params]
  });
}

export function useUser(id: Ref<string> | string) {
  const userId = computed(() => typeof id === 'string' ? id : id.value);
  
  return useApi<ApiResponse<UserResponseDto>>(() => `/users/${userId.value}`, {
    watch: [userId]
  });
}
```

### 5.3 Nuxt 页面组件

```vue
<!-- apps/web/pages/users/index.vue -->
<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <NuxtLink
        to="/users/create"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        新建用户
      </NuxtLink>
    </div>
    
    <div class="mb-4">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索用户..."
        class="border px-4 py-2 rounded w-64"
        @keyup.enter="search"
      />
      <button
        @click="search"
        class="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
      >
        搜索
      </button>
    </div>
    
    <div v-if="pending" class="text-center py-4">加载中...</div>
    
    <div v-else-if="error" class="text-red-500">
      {{ error.message }}
    </div>
    
    <template v-else-if="data">
      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">ID</th>
            <th class="border p-2 text-left">姓名</th>
            <th class="border p-2 text-left">邮箱</th>
            <th class="border p-2 text-left">创建时间</th>
            <th class="border p-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in data.data.items" :key="user.id">
            <td class="border p-2">{{ user.id }}</td>
            <td class="border p-2">{{ user.name }}</td>
            <td class="border p-2">{{ user.email }}</td>
            <td class="border p-2">{{ formatDate(user.createdAt) }}</td>
            <td class="border p-2">
              <NuxtLink
                :to="`/users/${user.id}/edit`"
                class="text-blue-500 hover:underline mr-4"
              >
                编辑
              </NuxtLink>
              <button
                @click="handleDelete(user)"
                class="text-red-500 hover:underline"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="mt-4 flex justify-center gap-2">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="page = p"
          :class="[
            'px-3 py-1 rounded',
            page === p ? 'bg-blue-500 text-white' : 'bg-gray-200'
          ]"
        >
          {{ p }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UserResponseDto } from '@shared/types';

const page = ref(1);
const limit = ref(10);
const keyword = ref('');

const params = computed(() => ({
  page: page.value,
  limit: limit.value,
  keyword: keyword.value || undefined
}));

const { data, pending, error, refresh } = useUsers(params);

const totalPages = computed(() => {
  if (!data.value) return 0;
  return Math.ceil(data.value.data.total / limit.value);
});

function search() {
  page.value = 1;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN');
}

async function handleDelete(user: UserResponseDto) {
  if (!confirm(`确定要删除用户 ${user.name} 吗？`)) return;
  
  try {
    await $fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
      baseURL: useRuntimeConfig().public.apiUrl
    });
    
    refresh();
  } catch (error: any) {
    alert(error.message || '删除失败');
  }
}
</script>
```

---

## 6. 移动端集成

### 6.1 React Native 集成

```typescript
// mobile/src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // 刷新 token 或跳转登录
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh', { refreshToken });
          await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
          return api(error.config);
        } catch {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          // 导航到登录页
        }
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export { api };

// mobile/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      }
    } catch (error) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } finally {
      setLoading(false);
    }
  };
  
  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    setUser(response.data.user);
    return response.data;
  }, []);
  
  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
  }, []);
  
  return { user, loading, login, logout, isAuthenticated: !!user };
}
```

### 6.2 Flutter 集成

```dart
// lib/api/api_client.dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  
  late Dio _dio;
  
  ApiClient._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: 'https://api.example.com',
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
    ));
    
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('accessToken');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // 刷新 token
          final prefs = await SharedPreferences.getInstance();
          final refreshToken = prefs.getString('refreshToken');
          
          if (refreshToken != null) {
            try {
              final response = await _dio.post('/auth/refresh', 
                data: {'refreshToken': refreshToken}
              );
              
              await prefs.setString('accessToken', response.data['data']['accessToken']);
              
              // 重试原请求
              final retryResponse = await _dio.fetch(error.requestOptions);
              handler.resolve(retryResponse);
              return;
            } catch (e) {
              await prefs.remove('accessToken');
              await prefs.remove('refreshToken');
            }
          }
        }
        handler.next(error);
      },
    ));
  }
  
  Future<T> get<T>(String path, {Map<String, dynamic>? params}) async {
    final response = await _dio.get(path, queryParameters: params);
    return response.data['data'];
  }
  
  Future<T> post<T>(String path, {dynamic data}) async {
    final response = await _dio.post(path, data: data);
    return response.data['data'];
  }
  
  Future<T> put<T>(String path, {dynamic data}) async {
    final response = await _dio.put(path, data: data);
    return response.data['data'];
  }
  
  Future<void> delete(String path) async {
    await _dio.delete(path);
  }
}

// lib/services/user_service.dart
import '../api/api_client.dart';
import '../models/user.dart';

class UserService {
  final _api = ApiClient();
  
  Future<List<User>> getUsers({int page = 1, int limit = 10, String? keyword}) async {
    final response = await _api.get<Map<String, dynamic>>('/users', params: {
      'page': page,
      'limit': limit,
      if (keyword != null) 'keyword': keyword,
    });
    
    return (response['items'] as List)
        .map((item) => User.fromJson(item))
        .toList();
  }
  
  Future<User> getUser(String id) async {
    final response = await _api.get<Map<String, dynamic>>('/users/$id');
    return User.fromJson(response);
  }
  
  Future<User> createUser(CreateUserDto dto) async {
    final response = await _api.post<Map<String, dynamic>>('/users', data: dto.toJson());
    return User.fromJson(response);
  }
  
  Future<User> updateUser(String id, UpdateUserDto dto) async {
    final response = await _api.put<Map<String, dynamic>>('/users/$id', data: dto.toJson());
    return User.fromJson(response);
  }
  
  Future<void> deleteUser(String id) async {
    await _api.delete('/users/$id');
  }
}
```

---

## 7. 通用 API 客户端封装

### 7.1 TypeScript 通用客户端

```typescript
// packages/api-client/src/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  getAccessToken?: () => string | null | Promise<string | null>;
  onRefreshToken?: () => Promise<string>;
  onUnauthorized?: () => void;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
}

export class ApiClient {
  private instance: AxiosInstance;
  private config: ApiClientConfig;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  
  constructor(config: ApiClientConfig) {
    this.config = config;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // 请求拦截
    this.instance.interceptors.request.use(async (config) => {
      if (this.config.getAccessToken) {
        const token = await this.config.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
    
    // 响应拦截
    this.instance.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.config.onRefreshToken) {
            if (this.isRefreshing) {
              return new Promise((resolve) => {
                this.refreshSubscribers.push((token) => {
                  originalRequest.headers!.Authorization = `Bearer ${token}`;
                  resolve(this.instance(originalRequest));
                });
              });
            }
            
            this.isRefreshing = true;
            originalRequest._retry = true;
            
            try {
              const newToken = await this.config.onRefreshToken();
              this.refreshSubscribers.forEach(cb => cb(newToken));
              this.refreshSubscribers = [];
              originalRequest.headers!.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            } catch {
              this.config.onUnauthorized?.();
            } finally {
              this.isRefreshing = false;
            }
          } else {
            this.config.onUnauthorized?.();
          }
        }
        
        return Promise.reject((error.response?.data as any) || error.message);
      }
    );
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.instance.get<any, ApiResponse<T>>(url, { params });
    return response.data;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.post<any, ApiResponse<T>>(url, data);
    return response.data;
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.put<any, ApiResponse<T>>(url, data);
    return response.data;
  }
  
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.patch<any, ApiResponse<T>>(url, data);
    return response.data;
  }
  
  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<any, ApiResponse<T>>(url);
    return response.data;
  }
  
  async upload<T>(
    url: string, 
    file: File | Blob, 
    fieldName = 'file',
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await this.instance.post<any, ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      }
    });
    
    return response.data;
  }
}
```

### 7.2 使用示例

```typescript
// 在任何前端项目中使用
import { ApiClient } from '@myorg/api-client';

// React
const api = new ApiClient({
  baseURL: 'http://localhost:3000/api',
  getAccessToken: () => localStorage.getItem('accessToken'),
  onRefreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    localStorage.setItem('accessToken', data.data.accessToken);
    return data.data.accessToken;
  },
  onUnauthorized: () => {
    localStorage.clear();
    window.location.href = '/login';
  }
});

// Vue
const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  getAccessToken: () => {
    const authStore = useAuthStore();
    return authStore.accessToken;
  },
  onRefreshToken: async () => {
    const authStore = useAuthStore();
    return authStore.refreshAccessToken();
  },
  onUnauthorized: () => {
    const authStore = useAuthStore();
    authStore.logout();
    router.push('/login');
  }
});
```

---

## 8. 认证状态管理

### 8.1 React 认证 Context

```typescript
// apps/web/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await api.get<{ user: User }>('/auth/profile');
        setUser(response.user);
      }
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };
  
  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: User;
    }>('/auth/login', { email, password });
    
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, []);
  
  const hasRole = useCallback((role: string) => {
    return user?.roles?.includes(role) || false;
  }, [user]);
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 权限路由守卫
export function ProtectedRoute({ 
  children, 
  roles 
}: { 
  children: React.ReactNode; 
  roles?: string[];
}) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
    
    if (!loading && isAuthenticated && roles) {
      const hasRequiredRole = roles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        navigate('/403');
      }
    }
  }, [loading, isAuthenticated, roles]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
}
```

---

## 9. 实时通信集成

### 9.1 Socket.IO 客户端封装

```typescript
// packages/socket-client/src/socket.ts
import { io, Socket } from 'socket.io-client';

export interface SocketConfig {
  url: string;
  namespace?: string;
  getToken?: () => string | null;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: any) => void;
}

export class SocketClient {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private listeners = new Map<string, Set<Function>>();
  
  constructor(config: SocketConfig) {
    this.config = config;
  }
  
  connect() {
    if (this.socket?.connected) return;
    
    const url = this.config.namespace 
      ? `${this.config.url}${this.config.namespace}`
      : this.config.url;
    
    this.socket = io(url, {
      auth: {
        token: this.config.getToken?.()
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.config.onConnect?.();
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.config.onDisconnect?.(reason);
    });
    
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.config.onError?.(error);
    });
    
    // 重新绑定所有监听器
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback as any);
      });
    });
  }
  
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
  
  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }
  
  emitWithAck<T>(event: string, data?: any, timeout = 5000): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      const timer = setTimeout(() => {
        reject(new Error('Emit timeout'));
      }, timeout);
      
      this.socket.emit(event, data, (response: T) => {
        clearTimeout(timer);
        resolve(response);
      });
    });
  }
  
  on<T>(event: string, callback: (data: T) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    this.socket?.on(event, callback as any);
    
    // 返回取消监听函数
    return () => this.off(event, callback);
  }
  
  off(event: string, callback?: Function): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback as any);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }
  
  joinRoom(room: string): void {
    this.emit('room:join', { roomId: room });
  }
  
  leaveRoom(room: string): void {
    this.emit('room:leave', { roomId: room });
  }
  
  get connected(): boolean {
    return this.socket?.connected || false;
  }
}
```

### 9.2 React Hook 封装

```typescript
// apps/web/src/hooks/useSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { SocketClient, SocketConfig } from '@myorg/socket-client';
import { useAuth } from '../contexts/AuthContext';

export function useSocket(namespace?: string) {
  const { user } = useAuth();
  const socketRef = useRef<SocketClient | null>(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const config: SocketConfig = {
      url: import.meta.env.VITE_WS_URL || 'http://localhost:3000',
      namespace,
      getToken: () => localStorage.getItem('accessToken'),
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false)
    };
    
    socketRef.current = new SocketClient(config);
    socketRef.current.connect();
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, namespace]);
  
  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);
  
  const emitWithAck = useCallback(<T>(event: string, data?: any) => {
    return socketRef.current?.emitWithAck<T>(event, data) || Promise.reject('Not connected');
  }, []);
  
  const on = useCallback(<T>(event: string, callback: (data: T) => void) => {
    return socketRef.current?.on(event, callback) || (() => {});
  }, []);
  
  return {
    socket: socketRef.current,
    connected,
    emit,
    emitWithAck,
    on
  };
}

// 使用示例
function ChatRoom({ roomId }: { roomId: string }) {
  const { socket, connected, emit, on } = useSocket('/chat');
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    if (!connected) return;
    
    // 加入房间
    emit('room:join', { roomId });
    
    // 监听新消息
    const unsubscribe = on<Message>('message:new', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return () => {
      unsubscribe();
      emit('room:leave', { roomId });
    };
  }, [connected, roomId]);
  
  const sendMessage = (content: string) => {
    emit('message:send', { roomId, content });
  };
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }} />
    </div>
  );
}
```

---

## 10. 文件上传处理

### 10.1 通用上传组件

```tsx
// apps/web/src/components/FileUpload.tsx
import React, { useRef, useState, useCallback } from 'react';
import { api } from '../api/client';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;  // MB
  multiple?: boolean;
  onUpload: (urls: string[]) => void;
  onError?: (error: string) => void;
}

export function FileUpload({
  accept = 'image/*',
  maxSize = 5,
  multiple = false,
  onUpload,
  onError
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  
  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小不能超过 ${maxSize}MB`;
    }
    return null;
  };
  
  const uploadFile = async (file: File): Promise<string> => {
    const error = validateFile(file);
    if (error) {
      throw new Error(error);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.upload<{ url: string }>(
      '/files/upload',
      file,
      (p) => setProgress(p)
    );
    
    return response.url;
  };
  
  const handleFiles = useCallback(async (files: FileList) => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const fileArray = Array.from(files);
      const urls = await Promise.all(fileArray.map(uploadFile));
      onUpload(urls);
    } catch (error: any) {
      onError?.(error.message || '上传失败');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUpload, onError]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
      `}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      
      {uploading ? (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>上传中... {progress}%</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600">点击或拖拽文件到此处上传</p>
          <p className="text-sm text-gray-400 mt-2">
            支持 {accept}，最大 {maxSize}MB
          </p>
        </div>
      )}
    </div>
  );
}
```

### 10.2 图片预览上传

```tsx
// apps/web/src/components/ImageUpload.tsx
import React, { useState } from 'react';
import { FileUpload } from './FileUpload';

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxCount?: number;
}

export function ImageUpload({ value = [], onChange, maxCount = 5 }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleUpload = (urls: string[]) => {
    const newUrls = [...value, ...urls].slice(0, maxCount);
    onChange(newUrls);
  };
  
  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };
  
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {value.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt=""
              className="w-full h-24 object-cover rounded cursor-pointer"
              onClick={() => setPreview(url)}
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {value.length < maxCount && (
        <FileUpload
          accept="image/*"
          multiple
          onUpload={handleUpload}
          onError={(error) => alert(error)}
        />
      )}
      
      {/* 预览弹窗 */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
}
```

---

## 总结

本篇文档涵盖了前端框架与 NestJS 的集成实践：

1. **React 集成** - API 客户端、React Query、状态管理
2. **Vue 集成** - Pinia Store、Composables、组件封装
3. **Angular 集成** - HTTP 服务、拦截器、RxJS
4. **Next.js 集成** - Server Actions、SSR 支持
5. **Nuxt.js 集成** - Composables、useFetch
6. **移动端集成** - React Native、Flutter
7. **通用 API 客户端** - 跨框架封装
8. **认证状态管理** - Context、Store、路由守卫
9. **实时通信** - Socket.IO 客户端封装
10. **文件上传** - 通用上传组件

这些实践可以帮助你在各种前端框架中高效地集成 NestJS 后端服务，构建企业级全栈应用。
