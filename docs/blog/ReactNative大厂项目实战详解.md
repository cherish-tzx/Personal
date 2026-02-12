# React Native 大厂项目实战详解
<div class="doc-toc">
## 目录
1. [项目架构设计](#1-项目架构设计)
2. [导航系统实战](#2-导航系统实战)
3. [状态管理方案](#3-状态管理方案)
4. [网络请求封装](#4-网络请求封装)
5. [列表性能优化](#5-列表性能优化)
6. [动画实战](#6-动画实战)
7. [原生模块集成](#7-原生模块集成)
8. [推送通知](#8-推送通知)
9. [存储方案](#9-存储方案)
10. [多主题适配](#10-多主题适配)
11. [热更新方案](#11-热更新方案)
12. [打包发布](#12-打包发布)


</div>

---

## 1. 项目架构设计

### 1.1 大厂标准目录结构

```
src/
├── api/                    # API 请求
│   ├── index.js
│   ├── request.js         # 请求封装
│   ├── user.js
│   └── product.js
├── assets/                 # 静态资源
│   ├── images/
│   ├── fonts/
│   └── animations/        # Lottie 动画
├── components/             # 通用组件
│   ├── common/            # 基础组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Loading/
│   │   └── Toast/
│   ├── business/          # 业务组件
│   └── layout/            # 布局组件
├── config/                 # 配置
│   ├── index.js
│   ├── theme.js           # 主题配置
│   └── constants.js       # 常量
├── hooks/                  # 自定义 Hooks
├── navigation/             # 导航配置
│   ├── index.js
│   ├── MainNavigator.js
│   ├── AuthNavigator.js
│   └── TabNavigator.js
├── screens/                # 页面
│   ├── Home/
│   ├── Profile/
│   ├── Login/
│   └── Settings/
├── services/               # 业务服务
├── store/                  # 状态管理
│   ├── index.js
│   └── slices/
├── utils/                  # 工具函数
│   ├── storage.js
│   ├── permission.js
│   └── device.js
├── App.js
└── index.js
```

### 1.2 配置文件

```javascript
// config/index.js
import { Platform } from 'react-native';

const ENV = {
  development: {
    API_URL: 'https://dev-api.example.com',
    WS_URL: 'wss://dev-ws.example.com',
    DEBUG: true
  },
  staging: {
    API_URL: 'https://staging-api.example.com',
    WS_URL: 'wss://staging-ws.example.com',
    DEBUG: true
  },
  production: {
    API_URL: 'https://api.example.com',
    WS_URL: 'wss://ws.example.com',
    DEBUG: false
  }
};

const currentEnv = __DEV__ ? 'development' : 'production';

export default {
  ...ENV[currentEnv],
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  PLATFORM: Platform.OS,
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android'
};
```

### 1.3 主题配置

```javascript
// config/theme.js
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// 设计稿基准
const baseWidth = 375;
const scale = width / baseWidth;

// 响应式尺寸
export const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(newSize);
};

// 颜色
export const colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    disabled: '#C7C7CC'
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    disabled: '#3A3A3C'
  }
};

// 字体
export const typography = {
  largeTitle: { fontSize: normalize(34), fontWeight: 'bold', lineHeight: normalize(41) },
  title1: { fontSize: normalize(28), fontWeight: 'bold', lineHeight: normalize(34) },
  title2: { fontSize: normalize(22), fontWeight: 'bold', lineHeight: normalize(28) },
  title3: { fontSize: normalize(20), fontWeight: '600', lineHeight: normalize(25) },
  headline: { fontSize: normalize(17), fontWeight: '600', lineHeight: normalize(22) },
  body: { fontSize: normalize(17), fontWeight: 'normal', lineHeight: normalize(22) },
  callout: { fontSize: normalize(16), fontWeight: 'normal', lineHeight: normalize(21) },
  subhead: { fontSize: normalize(15), fontWeight: 'normal', lineHeight: normalize(20) },
  footnote: { fontSize: normalize(13), fontWeight: 'normal', lineHeight: normalize(18) },
  caption1: { fontSize: normalize(12), fontWeight: 'normal', lineHeight: normalize(16) },
  caption2: { fontSize: normalize(11), fontWeight: 'normal', lineHeight: normalize(13) }
};

// 间距
export const spacing = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
  xxl: normalize(48)
};

// 圆角
export const borderRadius = {
  sm: normalize(4),
  md: normalize(8),
  lg: normalize(12),
  xl: normalize(16),
  full: 9999
};

// 阴影
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2
    },
    android: { elevation: 2 }
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4
    },
    android: { elevation: 4 }
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8
    },
    android: { elevation: 8 }
  })
};

// 设备信息
export const device = {
  width,
  height,
  isSmall: width < 375,
  isMedium: width >= 375 && width < 414,
  isLarge: width >= 414,
  statusBarHeight: Platform.select({
    ios: 44,
    android: StatusBar.currentHeight || 24
  }),
  bottomBarHeight: Platform.select({
    ios: 34,
    android: 0
  })
};
```

---

## 2. 导航系统实战

### 2.1 完整导航配置

```jsx
// navigation/index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { selectIsAuthenticated, selectIsOnboarded } from '@/store/slices/authSlice';
import { navigationRef, linking } from './utils';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOnboarded = useSelector(selectIsOnboarded);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onStateChange={(state) => {
        // 路由变化追踪
        const currentRoute = state?.routes[state.index];
        analytics.trackScreen(currentRoute?.name);
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// navigation/MainNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 首页 Stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: '首页' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
}

// 我的 Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: '我的' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Explore: focused ? 'compass' : 'compass-outline',
            Cart: focused ? 'cart' : 'cart-outline',
            Profile: focused ? 'person' : 'person-outline'
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: '首页' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: '发现' }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: '购物车',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined
        }}
      />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}
```

### 2.2 导航工具函数

```jsx
// navigation/utils.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// 全局导航（在组件外使用）
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetRoot(state) {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
}

// 深度链接配置
export const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: {
            screens: {
              ProductDetail: 'product/:id'
            }
          }
        }
      },
      Auth: {
        screens: {
          Login: 'login',
          ResetPassword: 'reset-password/:token'
        }
      }
    }
  }
};

// 导航 Hooks
export function useNavigationReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      if (navigationRef.isReady()) {
        setIsReady(true);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  }, []);

  return isReady;
}
```

### 2.3 页面转场动画

```jsx
// navigation/transitions.js
import { TransitionPresets } from '@react-navigation/stack';

// 自定义转场
export const slideFromRight = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0]
          })
        }
      ]
    }
  })
};

export const fadeIn = {
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress
    }
  })
};

export const slideFromBottom = {
  ...TransitionPresets.ModalSlideFromBottomIOS
};

// 使用
<Stack.Screen
  name="Modal"
  component={ModalScreen}
  options={{
    presentation: 'modal',
    ...slideFromBottom
  }}
/>
```

---

## 3. 状态管理方案

### 3.1 Redux Toolkit + Persist

```jsx
// store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  settings: settingsReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'settings'], // 持久化白名单
  blacklist: [] // 不持久化黑名单
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/api';
import { navigate, resetRoot } from '@/navigation/utils';

// 异步 Actions
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '登录失败');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await authApi.logout();
    // 重置导航到登录页
    resetRoot({
      index: 0,
      routes: [{ name: 'Auth' }]
    });
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      const response = await authApi.refreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    loading: false,
    error: null
  },
  reducers: {
    setOnboarded: (state) => {
      state.isOnboarded = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      });
  }
});

export const { setOnboarded, clearError } = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsOnboarded = (state) => state.auth.isOnboarded;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
```

### 3.2 Zustand 轻量方案

```jsx
// store/useAppStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // 主题
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      // 语言
      language: 'zh-CN',
      setLanguage: (language) => set({ language }),

      // 用户
      user: null,
      setUser: (user) => set({ user }),

      // 购物车
      cartItems: [],
      addToCart: (item) => set((state) => {
        const existing = state.cartItems.find(i => i.id === item.id);
        if (existing) {
          return {
            cartItems: state.cartItems.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(i => i.id !== id)
      })),
      updateCartItemQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map(i =>
          i.id === id ? { ...i, quantity } : i
        )
      })),
      clearCart: () => set({ cartItems: [] }),
      
      // 计算属性
      get cartTotal() {
        return get().cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      get cartItemCount() {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
```

---

## 4. 网络请求封装

### 4.1 Axios 封装

```jsx
// api/request.js
import axios from 'axios';
import { store } from '@/store';
import { logout, refreshToken } from '@/store/slices/authSlice';
import config from '@/config';
import Toast from '@/components/common/Toast';

const request = axios.create({
  baseURL: config.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加设备信息
    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-App-Version'] = config.VERSION;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token 刷新标志
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Token 过期处理
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result = await store.dispatch(refreshToken()).unwrap();
        const newToken = result.token;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 错误提示
    const message = error.response?.data?.message || '网络请求失败';
    Toast.show({ text: message, type: 'error' });

    return Promise.reject(error);
  }
);

export default request;

// API 模块
// api/user.js
import request from './request';

export const userApi = {
  getProfile: () => request.get('/user/profile'),
  updateProfile: (data) => request.put('/user/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: file.uri,
      type: file.type,
      name: file.fileName
    });
    return request.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
```

### 4.2 React Query 集成

```jsx
// hooks/useApi.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, orderApi } from '@/api';

// 产品列表
export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getList(params),
    staleTime: 5 * 60 * 1000
  });
}

// 产品详情
export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getDetail(id),
    enabled: !!id
  });
}

// 创建订单
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

// 无限滚动列表
export function useInfiniteProducts(params) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      productApi.getList({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length + 1;
      }
      return undefined;
    }
  });
}
```

---

## 5. 列表性能优化

### 5.1 FlatList 优化

```jsx
// components/OptimizedList.jsx
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

// 列表项组件 - 使用 memo 优化
const ListItem = memo(({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>¥{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 自定义比较
  return prevProps.item.id === nextProps.item.id;
});

function ProductList({ products, onProductPress, onEndReached, refreshing, onRefresh }) {
  // 稳定的 renderItem
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} onPress={onProductPress} />
  ), [onProductPress]);

  // 稳定的 keyExtractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // 预计算 getItemLayout（固定高度时使用）
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  }), []);

  // 分隔线
  const ItemSeparator = useMemo(() => (
    <View style={styles.separator} />
  ), []);

  // 空状态
  const ListEmpty = useMemo(() => (
    <View style={styles.empty}>
      <Text>暂无数据</Text>
    </View>
  ), []);

  // 底部加载
  const ListFooter = useMemo(() => (
    <View style={styles.footer}>
      <ActivityIndicator />
    </View>
  ), []);

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={() => ItemSeparator}
      ListEmptyComponent={ListEmpty}
      ListFooterComponent={ListFooter}
      // 性能优化配置
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      removeClippedSubviews={true}
      // 下拉刷新
      refreshing={refreshing}
      onRefresh={onRefresh}
      // 上拉加载
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      // 其他优化
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const ITEM_HEIGHT = 120;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  item: {
    flexDirection: 'row',
    height: ITEM_HEIGHT,
    paddingVertical: 12
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '500'
  },
  price: {
    fontSize: 18,
    color: '#FF4D4F',
    marginTop: 8
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5E5'
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100
  },
  footer: {
    paddingVertical: 20
  }
});

export default ProductList;
```

### 5.2 FlashList 高性能列表

```jsx
// 使用 FlashList 替代 FlatList（性能更好）
// npm install @shopify/flash-list
import { FlashList } from '@shopify/flash-list';

function HighPerformanceList({ data }) {
  return (
    <FlashList
      data={data}
      renderItem={({ item }) => <ListItem item={item} />}
      estimatedItemSize={100}
      keyExtractor={(item) => item.id}
      // FlashList 特有优化
      drawDistance={300}
    />
  );
}
```

---

## 6. 动画实战

### 6.1 Reanimated 动画

```jsx
// components/AnimatedCard.jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function SwipeableCard({ item, onSwipeLeft, onSwipeRight }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withTiming(1.05);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = interpolate(
        event.translationX,
        [-200, 200],
        [-15, 15],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      const threshold = 150;
      
      if (event.translationX > threshold) {
        // 右滑
        translateX.value = withTiming(500, {}, () => {
          runOnJS(onSwipeRight)(item);
        });
      } else if (event.translationX < -threshold) {
        // 左滑
        translateX.value = withTiming(-500, {}, () => {
          runOnJS(onSwipeLeft)(item);
        });
      } else {
        // 复位
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
      scale.value = withTiming(1);
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, 100],
      [0, 1],
      Extrapolate.CLAMP
    )
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-100, 0],
      [1, 0],
      Extrapolate.CLAMP
    )
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Animated.View style={[styles.likeLabel, likeOpacity]}>
          <Text style={styles.likeText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.nopeLabel, nopeOpacity]}>
          <Text style={styles.nopeText}>NOPE</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
```

### 6.2 列表项动画

```jsx
// components/AnimatedListItem.jsx
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSpring,
  FadeIn,
  FadeOut,
  Layout
} from 'react-native-reanimated';

function AnimatedListItem({ item, index }) {
  // 入场动画
  const entering = FadeIn.delay(index * 100).springify();
  
  // 退出动画
  const exiting = FadeOut.duration(200);
  
  // 布局动画
  const layout = Layout.springify();

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      layout={layout}
      style={styles.item}
    >
      <Text>{item.title}</Text>
    </Animated.View>
  );
}

// 骨架屏动画
function Skeleton({ width, height }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Animated.View
      style={[
        { width, height, backgroundColor: '#E0E0E0', borderRadius: 4 },
        animatedStyle
      ]}
    />
  );
}
```

---

## 7. 原生模块集成

### 7.1 常用原生模块

```jsx
// 相机
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

async function pickImage() {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8
  });
  
  if (!result.didCancel && result.assets) {
    return result.assets[0];
  }
  return null;
}

// 地理位置
import Geolocation from '@react-native-community/geolocation';

function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => setLocation(position.coords),
      (error) => setError(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return { location, error };
}

// 生物识别
import ReactNativeBiometrics from 'react-native-biometrics';

async function authenticateWithBiometrics() {
  const rnBiometrics = new ReactNativeBiometrics();
  
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  
  if (!available) {
    return { success: false, error: '生物识别不可用' };
  }
  
  const { success } = await rnBiometrics.simplePrompt({
    promptMessage: '验证身份'
  });
  
  return { success };
}

// 分享
import Share from 'react-native-share';

async function shareContent(content) {
  try {
    await Share.open({
      title: content.title,
      message: content.message,
      url: content.url
    });
  } catch (error) {
    console.log('Share error:', error);
  }
}
```

### 7.2 权限处理

```jsx
// utils/permissions.js
import { Platform, Alert, Linking } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings
} from 'react-native-permissions';

export const PERMISSION_TYPE = {
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA
  }),
  photo: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
  }),
  location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  }),
  notification: Platform.select({
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS
  })
};

export async function checkPermission(type) {
  const permission = PERMISSION_TYPE[type];
  const result = await check(permission);
  return result === RESULTS.GRANTED;
}

export async function requestPermission(type) {
  const permission = PERMISSION_TYPE[type];
  const result = await request(permission);
  
  if (result === RESULTS.BLOCKED) {
    Alert.alert(
      '权限被拒绝',
      '请在设置中开启权限',
      [
        { text: '取消', style: 'cancel' },
        { text: '去设置', onPress: openSettings }
      ]
    );
    return false;
  }
  
  return result === RESULTS.GRANTED;
}

// Hook
export function usePermission(type) {
  const [granted, setGranted] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkPermission(type)
      .then(setGranted)
      .finally(() => setChecking(false));
  }, [type]);

  const request = useCallback(async () => {
    const result = await requestPermission(type);
    setGranted(result);
    return result;
  }, [type]);

  return { granted, checking, request };
}
```

---

## 8. 推送通知

### 8.1 FCM 推送配置

```jsx
// services/notification.js
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { navigate } from '@/navigation/utils';

class NotificationService {
  async init() {
    // 请求权限
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await this.createChannel();
      this.setupListeners();
    }
  }

  async createChannel() {
    await notifee.createChannel({
      id: 'default',
      name: '默认通知',
      importance: AndroidImportance.HIGH
    });
  }

  async getToken() {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  }

  setupListeners() {
    // 前台消息
    messaging().onMessage(async (remoteMessage) => {
      await this.displayNotification(remoteMessage);
    });

    // 后台点击
    messaging().onNotificationOpenedApp((remoteMessage) => {
      this.handleNotificationOpen(remoteMessage);
    });

    // 应用关闭时点击
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          this.handleNotificationOpen(remoteMessage);
        }
      });

    // Token 刷新
    messaging().onTokenRefresh((token) => {
      this.updateTokenOnServer(token);
    });
  }

  async displayNotification(remoteMessage) {
    const { notification, data } = remoteMessage;

    await notifee.displayNotification({
      title: notification?.title,
      body: notification?.body,
      data,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' }
      },
      ios: {
        sound: 'default'
      }
    });
  }

  handleNotificationOpen(remoteMessage) {
    const { data } = remoteMessage;
    
    if (data?.type === 'order') {
      navigate('OrderDetail', { orderId: data.orderId });
    } else if (data?.type === 'message') {
      navigate('Chat', { conversationId: data.conversationId });
    }
  }

  async updateTokenOnServer(token) {
    await api.updatePushToken(token);
  }
}

export default new NotificationService();

// 在 App.js 中初始化
useEffect(() => {
  NotificationService.init();
}, []);
```

---

## 9. 存储方案

### 9.1 AsyncStorage 封装

```jsx
// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  async multiGet(keys) {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return pairs.reduce((acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null;
        return acc;
      }, {});
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return {};
    }
  }

  async multiSet(pairs) {
    try {
      const formattedPairs = Object.entries(pairs).map(([key, value]) => [
        key,
        JSON.stringify(value)
      ]);
      await AsyncStorage.multiSet(formattedPairs);
      return true;
    } catch (error) {
      console.error('Storage multiSet error:', error);
      return false;
    }
  }
}

export default new Storage();

// MMKV 高性能存储
// npm install react-native-mmkv
import { MMKV } from 'react-native-mmkv';

export const mmkvStorage = new MMKV();

export const mmkv = {
  get: (key) => {
    const value = mmkvStorage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  set: (key, value) => {
    mmkvStorage.set(key, JSON.stringify(value));
  },
  remove: (key) => {
    mmkvStorage.delete(key);
  },
  clear: () => {
    mmkvStorage.clearAll();
  }
};
```

---

## 10. 多主题适配

### 10.1 主题系统

```jsx
// contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '@/config/theme';
import storage from '@/utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'

  useEffect(() => {
    // 加载保存的主题
    storage.get('themeMode').then((saved) => {
      if (saved) setThemeMode(saved);
    });
  }, []);

  const currentTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme || 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const theme = useMemo(() => ({
    mode: currentTheme,
    colors: colors[currentTheme],
    isDark: currentTheme === 'dark'
  }), [currentTheme]);

  const setTheme = async (mode) => {
    setThemeMode(mode);
    await storage.set('themeMode', mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 创建主题样式 Hook
export function useThemedStyles(createStyles) {
  const { theme } = useTheme();
  return useMemo(() => createStyles(theme), [theme]);
}

// 使用
function ProfileScreen() {
  const { theme, themeMode, setTheme } = useTheme();
  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    title: {
      color: theme.colors.text,
      fontSize: 24
    }
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>个人中心</Text>
      <RadioGroup
        value={themeMode}
        onChange={setTheme}
        options={[
          { label: '浅色', value: 'light' },
          { label: '深色', value: 'dark' },
          { label: '跟随系统', value: 'system' }
        ]}
      />
    </View>
  );
}
```

---

## 11. 热更新方案

### 11.1 CodePush 配置

```jsx
// App.js
import CodePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE
};

function App() {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      const update = await CodePush.checkForUpdate();
      if (update) {
        if (update.isMandatory) {
          // 强制更新
          await CodePush.sync({
            installMode: CodePush.InstallMode.IMMEDIATE,
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE
          }, syncStatus, downloadProgress);
        } else {
          // 可选更新
          setUpdateInfo(update);
        }
      }
    } catch (error) {
      console.log('CodePush check error:', error);
    }
  };

  const syncStatus = (status) => {
    switch (status) {
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('下载中...');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        console.log('安装中...');
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        console.log('更新已安装');
        break;
    }
  };

  const downloadProgress = (progress) => {
    const percent = (progress.receivedBytes / progress.totalBytes) * 100;
    console.log(`下载进度: ${percent.toFixed(2)}%`);
  };

  const handleUpdate = async () => {
    await CodePush.sync({
      installMode: CodePush.InstallMode.IMMEDIATE
    }, syncStatus, downloadProgress);
  };

  return (
    <>
      <RootNavigator />
      {updateInfo && (
        <UpdateModal
          info={updateInfo}
          onUpdate={handleUpdate}
          onDismiss={() => setUpdateInfo(null)}
        />
      )}
    </>
  );
}

export default CodePush(codePushOptions)(App);
```

---

## 12. 打包发布

### 12.1 Android 打包

```bash
# android/app/build.gradle
android {
    defaultConfig {
        applicationId "com.myapp"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias "my-key-alias"
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}

# 打包命令
cd android
./gradlew assembleRelease

# 输出: android/app/build/outputs/apk/release/app-release.apk
```

### 12.2 iOS 打包

```bash
# 使用 Xcode 打包
# 或使用 fastlane

# Fastfile
platform :ios do
  lane :beta do
    build_ios_app(
      scheme: "MyApp",
      export_method: "app-store"
    )
    upload_to_testflight
  end

  lane :release do
    build_ios_app(
      scheme: "MyApp",
      export_method: "app-store"
    )
    upload_to_app_store
  end
end

platform :android do
  lane :beta do
    gradle(task: "assembleRelease")
    upload_to_play_store(track: "beta")
  end

  lane :release do
    gradle(task: "bundleRelease")
    upload_to_play_store(track: "production")
  end
end
```

### 12.3 CI/CD 配置

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleRelease
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: android/app/build/outputs/apk/release/app-release.apk

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Install pods
        run: cd ios && pod install
      
      - name: Build iOS
        run: |
          xcodebuild -workspace ios/MyApp.xcworkspace \
            -scheme MyApp \
            -configuration Release \
            -archivePath build/MyApp.xcarchive \
            archive
```

---

## 总结

本文档详细介绍了 React Native 在大厂项目中的实战应用：

1. **项目架构** - 标准目录结构、配置管理、主题系统
2. **导航系统** - 完整导航配置、页面转场、深度链接
3. **状态管理** - Redux Toolkit、Zustand、持久化
4. **网络请求** - Axios 封装、Token 刷新、React Query
5. **列表优化** - FlatList 优化、FlashList、虚拟列表
6. **动画实战** - Reanimated、手势动画、列表动画
7. **原生模块** - 相机、位置、生物识别、权限处理
8. **推送通知** - FCM 配置、消息处理、跳转逻辑
9. **存储方案** - AsyncStorage、MMKV
10. **多主题** - 主题切换、系统主题跟随
11. **热更新** - CodePush 配置
12. **打包发布** - Android/iOS 打包、CI/CD

这些都是大厂 React Native 项目中常用的最佳实践！
