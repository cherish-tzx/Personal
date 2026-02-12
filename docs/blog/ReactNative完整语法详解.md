# React Native 完整语法详解
<div class="doc-toc">
## 目录
1. [React Native 简介](#1-react-native-简介)
2. [环境搭建与项目创建](#2-环境搭建与项目创建)
3. [核心组件](#3-核心组件)
4. [样式系统](#4-样式系统)
5. [Flexbox 布局](#5-flexbox-布局)
6. [列表组件](#6-列表组件)
7. [导航系统](#7-导航系统)
8. [网络请求](#8-网络请求)
9. [存储系统](#9-存储系统)
10. [动画系统](#10-动画系统)
11. [手势处理](#11-手势处理)
12. [平台特定代码](#12-平台特定代码)
13. [原生模块](#13-原生模块)
14. [图片处理](#14-图片处理)
15. [表单组件](#15-表单组件)
16. [状态管理](#16-状态管理)
17. [调试技巧](#17-调试技巧)
18. [性能优化](#18-性能优化)


</div>

---

## 1. React Native 简介

### 1.1 什么是 React Native

React Native 是 Facebook 开发的跨平台移动应用开发框架，使用 JavaScript 和 React 构建原生移动应用。

### 1.2 核心特点

- **跨平台**：一套代码同时支持 iOS 和 Android
- **原生组件**：使用原生 UI 组件，性能接近原生应用
- **热重载**：快速开发迭代
- **React 生态**：复用 React 知识和生态系统
- **桥接机制**：JavaScript 与原生代码通信

### 1.3 与 React 的区别

```jsx
// React (Web)
import React from 'react';

function WebComponent() {
  return (
    <div className="container">
      <span>Hello Web</span>
    </div>
  );
}

// React Native
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function NativeComponent() {
  return (
    <View style={styles.container}>
      <Text>Hello Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  }
});
```

---

## 2. 环境搭建与项目创建

### 2.1 环境要求

```bash
# Node.js 安装
node --version  # >= 14

# React Native CLI
npm install -g react-native-cli

# 或使用 Expo（推荐新手）
npm install -g expo-cli
```

### 2.2 创建项目

```bash
# 使用 React Native CLI
npx react-native init MyApp

# 使用 Expo（更简单）
npx create-expo-app MyApp
cd MyApp
npx expo start

# 使用 TypeScript
npx react-native init MyApp --template react-native-template-typescript
```

### 2.3 项目结构

```
MyApp/
├── android/          # Android 原生代码
├── ios/              # iOS 原生代码
├── src/              # 源代码目录
│   ├── components/   # 组件
│   ├── screens/      # 页面
│   ├── navigation/   # 导航配置
│   ├── services/     # API 服务
│   ├── store/        # 状态管理
│   └── utils/        # 工具函数
├── App.js            # 入口文件
├── package.json
└── metro.config.js   # Metro 打包配置
```

### 2.4 运行项目

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Expo
npx expo start
```

---

## 3. 核心组件

### 3.1 View - 容器组件

```jsx
import { View, StyleSheet } from 'react-native';

function ViewExample() {
  return (
    <View style={styles.container}>
      <View style={styles.box} />
      <View style={[styles.box, styles.boxTwo]} />
      <View style={[styles.box, styles.boxThree]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'red'
  },
  boxTwo: {
    backgroundColor: 'green'
  },
  boxThree: {
    backgroundColor: 'blue'
  }
});
```

### 3.2 Text - 文本组件

```jsx
import { Text, StyleSheet } from 'react-native';

function TextExample() {
  return (
    <View>
      {/* 基本文本 */}
      <Text>普通文本</Text>

      {/* 样式文本 */}
      <Text style={styles.title}>标题文本</Text>
      <Text style={styles.body}>正文文本</Text>

      {/* 嵌套文本 */}
      <Text>
        普通文本
        <Text style={styles.bold}>加粗</Text>
        <Text style={styles.italic}>斜体</Text>
      </Text>

      {/* 多行文本 */}
      <Text numberOfLines={2} ellipsizeMode="tail">
        这是一段很长的文本，会被截断显示省略号...
      </Text>

      {/* 可选择文本 */}
      <Text selectable>可以长按复制的文本</Text>

      {/* 可点击文本 */}
      <Text onPress={() => alert('点击了文本')}>点击我</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666'
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  }
});
```

### 3.3 Image - 图片组件

```jsx
import { Image, StyleSheet } from 'react-native';

function ImageExample() {
  return (
    <View>
      {/* 本地图片 */}
      <Image source={require('./assets/logo.png')} style={styles.image} />

      {/* 网络图片（必须指定尺寸） */}
      <Image
        source={{ uri: 'https://example.com/image.jpg' }}
        style={styles.networkImage}
      />

      {/* 图片模式 */}
      <Image
        source={{ uri: 'https://example.com/image.jpg' }}
        style={styles.image}
        resizeMode="cover" // cover, contain, stretch, repeat, center
      />

      {/* 带加载状态 */}
      <Image
        source={{ uri: 'https://example.com/image.jpg' }}
        style={styles.image}
        onLoadStart={() => console.log('开始加载')}
        onLoadEnd={() => console.log('加载完成')}
        onError={(e) => console.log('加载失败', e)}
        defaultSource={require('./assets/placeholder.png')}
      />

      {/* 背景图片 */}
      <ImageBackground
        source={require('./assets/bg.jpg')}
        style={styles.background}
      >
        <Text>覆盖在图片上的文字</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  networkImage: {
    width: 200,
    height: 200
  },
  background: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
```

### 3.4 Button - 按钮组件

```jsx
import { Button, View } from 'react-native';

function ButtonExample() {
  return (
    <View>
      <Button
        title="点击我"
        onPress={() => alert('按钮被点击')}
      />

      <Button
        title="禁用按钮"
        disabled={true}
        onPress={() => {}}
      />

      <Button
        title="自定义颜色"
        color="#841584"
        onPress={() => {}}
      />
    </View>
  );
}
```

### 3.5 TouchableOpacity - 可触摸透明组件

```jsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

function TouchableExample() {
  return (
    <View>
      {/* 透明度变化 */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => console.log('点击')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>TouchableOpacity</Text>
      </TouchableOpacity>

      {/* 高亮效果 */}
      <TouchableHighlight
        underlayColor="#ddd"
        onPress={() => console.log('点击')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>TouchableHighlight</Text>
      </TouchableHighlight>

      {/* 无反馈 */}
      <TouchableWithoutFeedback onPress={() => console.log('点击')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableWithoutFeedback</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* 原生反馈（Android 水波纹） */}
      <Pressable
        onPress={() => console.log('点击')}
        onLongPress={() => console.log('长按')}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
      >
        {({ pressed }) => (
          <Text style={styles.buttonText}>
            {pressed ? '按下中...' : 'Pressable'}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5
  },
  buttonPressed: {
    backgroundColor: '#0056b3'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  }
});
```

### 3.6 ScrollView - 滚动视图

```jsx
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';

function ScrollViewExample() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      bounces={true}
      onScroll={(e) => console.log(e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <View key={i} style={styles.item}>
          <Text>Item {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// 水平滚动
function HorizontalScrollView() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={styles.page}>
          <Text>Page {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 20
  },
  item: {
    height: 100,
    backgroundColor: '#eee',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  page: {
    width: 300,
    height: 200,
    backgroundColor: '#ddd',
    marginRight: 10
  }
});
```

### 3.7 TextInput - 输入框

```jsx
import { TextInput, View, StyleSheet } from 'react-native';

function TextInputExample() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* 基本输入框 */}
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="请输入文字"
        placeholderTextColor="#999"
      />

      {/* 密码输入 */}
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="请输入密码"
      />

      {/* 多行输入 */}
      <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={4}
        placeholder="多行输入..."
        textAlignVertical="top"
      />

      {/* 键盘类型 */}
      <TextInput
        style={styles.input}
        keyboardType="numeric" // default, numeric, email-address, phone-pad
        placeholder="数字键盘"
      />

      {/* 自动完成 */}
      <TextInput
        style={styles.input}
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="邮箱"
      />

      {/* 事件处理 */}
      <TextInput
        style={styles.input}
        onFocus={() => console.log('获得焦点')}
        onBlur={() => console.log('失去焦点')}
        onSubmitEditing={() => console.log('提交')}
        returnKeyType="done" // done, go, next, search, send
        placeholder="按回车提交"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16
  },
  multiline: {
    height: 120,
    paddingTop: 15
  }
});
```

### 3.8 Switch - 开关组件

```jsx
import { Switch, View, Text, StyleSheet } from 'react-native';

function SwitchExample() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text>开关状态: {isEnabled ? '开' : '关'}</Text>
      <Switch
        value={isEnabled}
        onValueChange={setIsEnabled}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#007AFF' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );
}
```

### 3.9 ActivityIndicator - 加载指示器

```jsx
import { ActivityIndicator, View } from 'react-native';

function LoadingExample() {
  return (
    <View style={styles.container}>
      {/* 默认 */}
      <ActivityIndicator />

      {/* 大尺寸 */}
      <ActivityIndicator size="large" />

      {/* 自定义颜色 */}
      <ActivityIndicator size="large" color="#007AFF" />

      {/* 条件渲染 */}
      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
    </View>
  );
}
```

### 3.10 Modal - 模态框

```jsx
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

function ModalExample() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Button title="打开模态框" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        animationType="slide" // none, slide, fade
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>模态框标题</Text>
            <Text>这是模态框内容</Text>
            <Button title="关闭" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  }
});
```

### 3.11 SafeAreaView - 安全区域

```jsx
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

function SafeAreaExample() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text>这是安全区域内的内容</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    flex: 1,
    padding: 20
  }
});
```

### 3.12 StatusBar - 状态栏

```jsx
import { StatusBar, View } from 'react-native';

function StatusBarExample() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content" // dark-content, light-content
        backgroundColor="#ffffff"
        translucent={false}
        hidden={false}
      />
      {/* 页面内容 */}
    </View>
  );
}
```

### 3.13 KeyboardAvoidingView - 键盘避让

```jsx
import { KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';

function KeyboardAvoidingExample() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.inner}>
        <TextInput style={styles.input} placeholder="输入框" />
        <Button title="提交" onPress={() => {}} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 15
  }
});
```

---

## 4. 样式系统

### 4.1 StyleSheet 创建样式

```jsx
import { StyleSheet, View, Text } from 'react-native';

function StyleExample() {
  return (
    <View style={styles.container}>
      {/* 单个样式 */}
      <Text style={styles.text}>单个样式</Text>

      {/* 多个样式 */}
      <Text style={[styles.text, styles.bold]}>多个样式</Text>

      {/* 内联样式 */}
      <Text style={{ color: 'red', fontSize: 20 }}>内联样式</Text>

      {/* 条件样式 */}
      <Text style={[styles.text, isActive && styles.active]}>条件样式</Text>

      {/* 动态样式 */}
      <Text style={[styles.text, { color: isActive ? 'green' : 'gray' }]}>
        动态样式
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  text: {
    fontSize: 16,
    color: '#333'
  },
  bold: {
    fontWeight: 'bold'
  },
  active: {
    color: 'green'
  }
});
```

### 4.2 常用样式属性

```jsx
const styles = StyleSheet.create({
  // 尺寸
  box: {
    width: 100,
    height: 100,
    minWidth: 50,
    maxWidth: 200,
    minHeight: 50,
    maxHeight: 200
  },

  // 边距
  spacing: {
    margin: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 10
  },

  // 边框
  border: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderStyle: 'solid' // solid, dotted, dashed
  },

  // 背景
  background: {
    backgroundColor: '#f5f5f5',
    opacity: 0.8
  },

  // 定位
  position: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10
  },

  // 文本
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold', // normal, bold, 100-900
    fontStyle: 'italic', // normal, italic
    textAlign: 'center', // auto, left, right, center, justify
    textDecorationLine: 'underline', // none, underline, line-through
    textTransform: 'uppercase', // none, uppercase, lowercase, capitalize
    lineHeight: 24,
    letterSpacing: 1
  },

  // 阴影 (iOS)
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },

  // 阴影 (Android)
  shadowAndroid: {
    elevation: 5
  },

  // 变换
  transform: {
    transform: [
      { translateX: 10 },
      { translateY: 10 },
      { rotate: '45deg' },
      { scale: 1.2 },
      { scaleX: 1.5 },
      { scaleY: 0.5 }
    ]
  }
});
```

### 4.3 响应式设计

```jsx
import { Dimensions, useWindowDimensions, PixelRatio } from 'react-native';

// 获取屏幕尺寸
const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('screen').width;

// 使用 Hook
function ResponsiveComponent() {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;

  return (
    <View style={[styles.container, isLandscape && styles.landscape]}>
      <Text>宽度: {width}</Text>
      <Text>高度: {height}</Text>
    </View>
  );
}

// 响应式尺寸计算
const scale = width / 375; // 设计稿基准宽度

function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(16)
  },
  container: {
    width: width * 0.9,
    padding: normalize(20)
  }
});
```

---

## 5. Flexbox 布局

### 5.1 基本概念

```jsx
const styles = StyleSheet.create({
  // 主轴方向
  row: {
    flexDirection: 'row'
  },
  column: {
    flexDirection: 'column' // 默认
  },
  rowReverse: {
    flexDirection: 'row-reverse'
  },
  columnReverse: {
    flexDirection: 'column-reverse'
  },

  // 主轴对齐
  justifyContent: {
    justifyContent: 'flex-start', // flex-start, flex-end, center, space-between, space-around, space-evenly
  },

  // 交叉轴对齐
  alignItems: {
    alignItems: 'stretch', // flex-start, flex-end, center, stretch, baseline
  },

  // 多行对齐
  alignContent: {
    alignContent: 'flex-start', // flex-start, flex-end, center, stretch, space-between, space-around
  },

  // 换行
  wrap: {
    flexWrap: 'wrap', // nowrap, wrap, wrap-reverse
  }
});
```

### 5.2 子元素属性

```jsx
const styles = StyleSheet.create({
  // flex 比例
  flexOne: {
    flex: 1
  },
  flexTwo: {
    flex: 2
  },

  // 单独对齐
  alignSelf: {
    alignSelf: 'center' // auto, flex-start, flex-end, center, stretch, baseline
  },

  // 弹性增长
  flexGrow: {
    flexGrow: 1
  },

  // 弹性收缩
  flexShrink: {
    flexShrink: 0
  },

  // 基础尺寸
  flexBasis: {
    flexBasis: 100
  }
});
```

### 5.3 布局示例

```jsx
// 水平居中
function CenterHorizontal() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
    </View>
  );
}

// 垂直居中
function CenterVertical() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
    </View>
  );
}

// 等分布局
function EqualDistribution() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1, height: 50, backgroundColor: 'red' }} />
      <View style={{ flex: 1, height: 50, backgroundColor: 'green' }} />
      <View style={{ flex: 1, height: 50, backgroundColor: 'blue' }} />
    </View>
  );
}

// 底部固定
function BottomFixed() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* 主要内容 */}
      </View>
      <View style={{ height: 60, backgroundColor: '#f0f0f0' }}>
        {/* 底部栏 */}
      </View>
    </View>
  );
}

// 绝对定位叠加
function Overlay() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        {/* 背景内容 */}
      </View>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* 遮罩层 */}
      </View>
    </View>
  );
}
```

---

## 6. 列表组件

### 6.1 FlatList

```jsx
import { FlatList, View, Text, StyleSheet } from 'react-native';

function FlatListExample() {
  const data = [
    { id: '1', title: '项目 1' },
    { id: '2', title: '项目 2' },
    { id: '3', title: '项目 3' }
  ];

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      // 头部组件
      ListHeaderComponent={<Text style={styles.header}>列表头部</Text>}
      // 尾部组件
      ListFooterComponent={<Text style={styles.footer}>列表尾部</Text>}
      // 空列表
      ListEmptyComponent={<Text>暂无数据</Text>}
      // 分隔线
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      // 下拉刷新
      refreshing={refreshing}
      onRefresh={handleRefresh}
      // 上拉加载
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      // 性能优化
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={21}
      removeClippedSubviews={true}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
      })}
    />
  );
}

// 水平列表
function HorizontalList() {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}

// 多列网格
function GridList() {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  );
}
```

### 6.2 SectionList

```jsx
import { SectionList, View, Text, StyleSheet } from 'react-native';

function SectionListExample() {
  const sections = [
    {
      title: 'A',
      data: ['Apple', 'Apricot', 'Avocado']
    },
    {
      title: 'B',
      data: ['Banana', 'Blueberry', 'Blackberry']
    },
    {
      title: 'C',
      data: ['Cherry', 'Coconut', 'Cranberry']
    }
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item}</Text>
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      renderSectionFooter={({ section }) => (
        <Text style={styles.sectionFooter}>共 {section.data.length} 项</Text>
      )}
      stickySectionHeadersEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: '#fff'
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  sectionFooter: {
    padding: 10,
    color: '#999',
    textAlign: 'center'
  }
});
```

### 6.3 VirtualizedList

```jsx
import { VirtualizedList, View, Text } from 'react-native';

function VirtualizedListExample() {
  const getItem = (data, index) => ({
    id: String(index),
    title: `Item ${index + 1}`
  });

  const getItemCount = () => 10000;

  return (
    <VirtualizedList
      data={null}
      getItem={getItem}
      getItemCount={getItemCount}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}
```

---

## 7. 导航系统

### 7.1 安装 React Navigation

```bash
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @react-navigation/drawer
```

### 7.2 Stack Navigator

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '首页' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            title: route.params?.title || '详情'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 页面组件
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="去详情页"
        onPress={() => navigation.navigate('Details', { id: 1, title: '详情页' })}
      />
      <Button
        title="Push 详情页"
        onPress={() => navigation.push('Details', { id: 2 })}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { id, title } = route.params;

  return (
    <View style={styles.container}>
      <Text>ID: {id}</Text>
      <Button title="返回" onPress={() => navigation.goBack()} />
      <Button title="返回首页" onPress={() => navigation.popToTop()} />
    </View>
  );
}
```

### 7.3 Bottom Tab Navigator

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
          tabBarBadge: 3 // 显示角标
        }}
      />
    </Tab.Navigator>
  );
}
```

### 7.4 Drawer Navigator

```jsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 240
        },
        drawerActiveTintColor: '#007AFF'
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image source={require('./avatar.png')} style={styles.avatar} />
        <Text style={styles.username}>张三</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="退出登录"
        onPress={() => {/* 退出逻辑 */}}
      />
    </DrawerContentScrollView>
  );
}
```

### 7.5 嵌套导航

```jsx
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Modal" component={ModalScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 7.6 导航 Hook

```jsx
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();
  const route = useRoute();

  // 页面聚焦时执行
  useFocusEffect(
    useCallback(() => {
      console.log('页面聚焦');
      return () => console.log('页面失焦');
    }, [])
  );

  return (
    <View>
      <Text>当前路由: {route.name}</Text>
      <Button title="返回" onPress={() => navigation.goBack()} />
    </View>
  );
}
```

---

## 8. 网络请求

### 8.1 Fetch API

```jsx
// GET 请求
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// POST 请求
async function postData(data) {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token'
      },
      body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 上传文件
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name
  });

  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  });

  return response.json();
}
```

### 8.2 Axios

```jsx
import axios from 'axios';

// 创建实例
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
    }
    return Promise.reject(error);
  }
);

// 使用
async function getUser(id) {
  return api.get(`/users/${id}`);
}

async function createUser(data) {
  return api.post('/users', data);
}
```

### 8.3 网络状态监听

```jsx
import NetInfo from '@react-native-community/netinfo';

function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      console.log('网络类型:', state.type);
      console.log('是否连接:', state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <Text>网络不可用</Text>;
  }

  return <View>{/* 正常内容 */}</View>;
}
```

---

## 9. 存储系统

### 9.1 AsyncStorage

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// 存储数据
async function storeData(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('存储失败:', error);
  }
}

// 读取数据
async function getData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('读取失败:', error);
    return null;
  }
}

// 删除数据
async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('删除失败:', error);
  }
}

// 清空所有数据
async function clearAll() {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('清空失败:', error);
  }
}

// 获取所有 key
async function getAllKeys() {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('获取失败:', error);
    return [];
  }
}

// 批量操作
async function multiSet(pairs) {
  try {
    await AsyncStorage.multiSet(pairs.map(([key, value]) => [key, JSON.stringify(value)]));
  } catch (error) {
    console.error('批量存储失败:', error);
  }
}

async function multiGet(keys) {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.map(([key, value]) => [key, JSON.parse(value)]);
  } catch (error) {
    console.error('批量读取失败:', error);
    return [];
  }
}
```

### 9.2 自定义存储 Hook

```jsx
function useStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(key).then((data) => {
      if (data !== null) {
        setValue(data);
      }
      setLoading(false);
    });
  }, [key]);

  const setStoredValue = async (newValue) => {
    setValue(newValue);
    await storeData(key, newValue);
  };

  const removeStoredValue = async () => {
    setValue(initialValue);
    await removeData(key);
  };

  return [value, setStoredValue, removeStoredValue, loading];
}

// 使用
function App() {
  const [user, setUser, removeUser, loading] = useStorage('user', null);

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      {user ? (
        <>
          <Text>欢迎, {user.name}</Text>
          <Button title="退出" onPress={removeUser} />
        </>
      ) : (
        <Button title="登录" onPress={() => setUser({ name: '张三' })} />
      )}
    </View>
  );
}
```

---

## 10. 动画系统

### 10.1 Animated API

```jsx
import { Animated, Easing } from 'react-native';

function FadeInView({ children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
}

// 弹簧动画
function SpringAnimation() {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={handlePress}>
        <Text>点击弹跳</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// 序列动画
function SequenceAnimation() {
  const animValue = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 100, duration: 500, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ translateX: animValue }] }}>
      <Button title="开始" onPress={startAnimation} />
    </Animated.View>
  );
}

// 并行动画
function ParallelAnimation() {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: 100, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ translateX }], opacity }}>
      <Button title="开始" onPress={startAnimation} />
    </Animated.View>
  );
}

// 循环动画
function LoopAnimation() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Text>旋转</Text>
    </Animated.View>
  );
}
```

### 10.2 插值

```jsx
function InterpolationExample() {
  const animValue = useRef(new Animated.Value(0)).current;

  // 数值插值
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100]
  });

  // 颜色插值
  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255,0,0)', 'rgb(0,255,0)']
  });

  // 角度插值
  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  // 外推
  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
    extrapolate: 'clamp' // clamp, extend, identity
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateX }, { rotate }, { scale }],
        backgroundColor
      }}
    />
  );
}
```

### 10.3 手势动画

```jsx
function DraggableBox() {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start();
      }
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        width: 100,
        height: 100,
        backgroundColor: 'red'
      }}
      {...panResponder.panHandlers}
    />
  );
}
```

### 10.4 LayoutAnimation

```jsx
import { LayoutAnimation, UIManager, Platform } from 'react-native';

// Android 需要启用
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function LayoutAnimationExample() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggle}>
        <Text>点击切换</Text>
      </TouchableOpacity>
      <View
        style={{
          width: expanded ? 200 : 100,
          height: expanded ? 200 : 100,
          backgroundColor: 'blue'
        }}
      />
    </View>
  );
}

// 自定义配置
const customConfig = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity
  }
};
```

### 10.5 React Native Reanimated

```jsx
// 安装: npm install react-native-reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';

function ReanimatedExample() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }]
  }));

  const handlePress = () => {
    offset.value = withSpring(Math.random() * 200 - 100);
  };

  return (
    <Animated.View style={[styles.box, animatedStyles]}>
      <TouchableOpacity onPress={handlePress}>
        <Text>点击移动</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// 手势动画
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function GestureExample() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
}
```

---

## 11. 手势处理

### 11.1 PanResponder

```jsx
import { PanResponder, Animated, View } from 'react-native';

function PanResponderExample() {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      // 是否成为响应者
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      // 响应开始
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({ x: 0, y: 0 });
      },

      // 移动中
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      // 响应结束
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.box, pan.getLayout()]}
    />
  );
}
```

### 11.2 React Native Gesture Handler

```jsx
// 安装: npm install react-native-gesture-handler
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler
} from 'react-native-gesture-handler';

// 点击手势
function TapExample() {
  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.END) {
      console.log('单击');
    }
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.END) {
      console.log('双击');
    }
  };

  return (
    <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
      <TapGestureHandler onHandlerStateChange={onSingleTap}>
        <View style={styles.box}>
          <Text>点击/双击</Text>
        </View>
      </TapGestureHandler>
    </TapGestureHandler>
  );
}

// 长按手势
function LongPressExample() {
  const onLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log('长按触发');
    }
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={onLongPress}
      minDurationMs={800}
    >
      <View style={styles.box}>
        <Text>长按我</Text>
      </View>
    </LongPressGestureHandler>
  );
}

// 缩放手势
function PinchExample() {
  const scale = useRef(new Animated.Value(1)).current;

  const onPinch = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: true }
  );

  return (
    <PinchGestureHandler onGestureEvent={onPinch}>
      <Animated.View style={[styles.box, { transform: [{ scale }] }]} />
    </PinchGestureHandler>
  );
}
```

---

## 12. 平台特定代码

### 12.1 Platform API

```jsx
import { Platform, StyleSheet } from 'react-native';

// 检测平台
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

// 平台版本
const version = Platform.Version;
console.log(isIOS ? `iOS ${version}` : `Android API ${version}`);

// 条件值
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
      },
      android: {
        elevation: 5
      }
    })
  }
});

// 条件组件
function MyButton() {
  if (Platform.OS === 'ios') {
    return <IOSButton />;
  }
  return <AndroidButton />;
}
```

### 12.2 平台特定文件

```
// 文件结构
MyComponent.ios.js
MyComponent.android.js

// 导入时自动选择
import MyComponent from './MyComponent';
```

### 12.3 平台特定样式

```jsx
const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        backgroundColor: '#007AFF',
        borderRadius: 10
      },
      android: {
        backgroundColor: '#2196F3',
        borderRadius: 4
      },
      default: {
        backgroundColor: '#333'
      }
    })
  }
});
```

---

## 13. 原生模块

### 13.1 访问原生模块

```jsx
import { NativeModules, NativeEventEmitter } from 'react-native';

// 获取原生模块
const { MyNativeModule } = NativeModules;

// 调用原生方法
async function callNativeMethod() {
  try {
    const result = await MyNativeModule.doSomething('参数');
    console.log('结果:', result);
  } catch (error) {
    console.error('错误:', error);
  }
}

// 监听原生事件
function NativeEventExample() {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(MyNativeModule);
    const subscription = eventEmitter.addListener('EventName', (data) => {
      console.log('收到事件:', data);
    });

    return () => subscription.remove();
  }, []);
}
```

### 13.2 Linking API

```jsx
import { Linking } from 'react-native';

// 打开 URL
async function openURL(url) {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log('无法打开 URL:', url);
  }
}

// 打开设置
Linking.openSettings();

// 打开电话
Linking.openURL('tel:+1234567890');

// 打开邮件
Linking.openURL('mailto:test@example.com');

// 打开地图
Linking.openURL('https://maps.google.com/?q=location');

// 深度链接处理
function DeepLinkHandler() {
  useEffect(() => {
    // 获取初始 URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // 监听 URL 变化
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url) => {
    // 解析 URL 并导航
    const route = url.replace(/.*?:\/\//g, '');
    console.log('深度链接:', route);
  };
}
```

---

## 14. 图片处理

### 14.1 图片选择器

```jsx
// 安装: npm install react-native-image-picker
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      selectionLimit: 1
    });

    if (!result.didCancel && result.assets) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8
    });

    if (!result.didCancel && result.assets) {
      setImage(result.assets[0]);
    }
  };

  return (
    <View>
      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}
      <Button title="选择图片" onPress={selectImage} />
      <Button title="拍照" onPress={takePhoto} />
    </View>
  );
}
```

### 14.2 图片缓存

```jsx
// 安装: npm install react-native-fast-image
import FastImage from 'react-native-fast-image';

function CachedImage({ uri }) {
  return (
    <FastImage
      style={styles.image}
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
      resizeMode={FastImage.resizeMode.cover}
      onLoadStart={() => console.log('开始加载')}
      onLoad={() => console.log('加载完成')}
      onError={() => console.log('加载失败')}
    />
  );
}

// 预加载
FastImage.preload([
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' }
]);
```

---

## 15. 表单组件

### 15.1 完整表单示例

```jsx
function CompleteForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    newsletter: false
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = '请输入姓名';
    if (!form.email) newErrors.email = '请输入邮箱';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = '邮箱格式不正确';
    if (!form.password) newErrors.password = '请输入密码';
    else if (form.password.length < 6) newErrors.password = '密码至少6位';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log('提交:', form);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={styles.field}>
          <Text style={styles.label}>姓名</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={form.name}
            onChangeText={(name) => setForm({ ...form, name })}
            placeholder="请输入姓名"
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>邮箱</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            placeholder="请输入邮箱"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>密码</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            placeholder="请输入密码"
            secureTextEntry
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>性别</Text>
          <View style={styles.radioGroup}>
            {['男', '女'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radio}
                onPress={() => setForm({ ...form, gender: option })}
              >
                <View style={[styles.radioCircle, form.gender === option && styles.radioSelected]} />
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <View style={styles.checkboxRow}>
            <Switch
              value={form.newsletter}
              onValueChange={(newsletter) => setForm({ ...form, newsletter })}
            />
            <Text style={styles.checkboxLabel}>订阅新闻邮件</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>提交</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  field: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16
  },
  inputError: {
    borderColor: 'red'
  },
  error: {
    color: 'red',
    marginTop: 5
  },
  radioGroup: {
    flexDirection: 'row'
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8
  },
  radioSelected: {
    backgroundColor: '#007AFF'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxLabel: {
    marginLeft: 10
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
```

---

## 16. 状态管理

### 16.1 Context + useReducer

```jsx
// store/AuthContext.js
const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await loginAPI(credentials);
      await AsyncStorage.setItem('token', result.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: result });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 16.2 Redux Toolkit

```jsx
// 安装: npm install @reduxjs/toolkit react-redux
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    incrementByAmount: (state, action) => { state.value += action.payload; }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// App
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// Component
function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>计数: {count}</Text>
      <Button title="+1" onPress={() => dispatch(increment())} />
      <Button title="-1" onPress={() => dispatch(decrement())} />
    </View>
  );
}
```

### 16.3 Zustand

```jsx
// 安装: npm install zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 创建 store
const useStore = create(
  persist(
    (set, get) => ({
      // 状态
      count: 0,
      user: null,

      // 动作
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, count: 0 })
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

// 使用
function Counter() {
  const { count, increment, decrement } = useStore();

  return (
    <View>
      <Text>计数: {count}</Text>
      <Button title="+1" onPress={increment} />
      <Button title="-1" onPress={decrement} />
    </View>
  );
}
```

---

## 17. 调试技巧

### 17.1 React Native Debugger

```jsx
// 开启调试菜单
// iOS 模拟器: Cmd + D
// Android 模拟器: Cmd + M (Mac) / Ctrl + M (Windows)

// console 日志
console.log('普通日志');
console.warn('警告');
console.error('错误');

// 使用 Flipper
// 支持网络请求检查、React DevTools、原生日志等
```

### 17.2 性能监控

```jsx
import { InteractionManager } from 'react-native';

// 等待交互完成后执行
InteractionManager.runAfterInteractions(() => {
  // 执行耗时操作
});

// 性能标记
const start = performance.now();
// ... 代码执行
const end = performance.now();
console.log(`耗时: ${end - start}ms`);
```

### 17.3 错误边界

```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 上报错误
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>出错了</Text>
          <Text>{this.state.error?.message}</Text>
          <Button
            title="重试"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
```

---

## 18. 性能优化

### 18.1 列表优化

```jsx
// FlatList 优化
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // 优化配置
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  })}
  // 使用 memo 优化 renderItem
/>

// memo 优化列表项
const ListItem = memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item.id)}>
    <Text>{item.title}</Text>
  </TouchableOpacity>
));
```

### 18.2 图片优化

```jsx
// 使用适当尺寸
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>

// 使用 FastImage 缓存
<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.high }}
  resizeMode={FastImage.resizeMode.cover}
/>

// 懒加载图片
function LazyImage({ uri, style }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={style}>
      {!loaded && <ActivityIndicator />}
      <FastImage
        source={{ uri }}
        style={[style, !loaded && { display: 'none' }]}
        onLoad={() => setLoaded(true)}
      />
    </View>
  );
}
```

### 18.3 动画优化

```jsx
// 使用 useNativeDriver
Animated.timing(animValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true // 关键！
}).start();

// 使用 Reanimated
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

// 避免在动画中使用 state
const offset = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }]
}));
```

### 18.4 减少重渲染

```jsx
// 使用 memo
const MyComponent = memo(({ data }) => {
  return <Text>{data.title}</Text>;
});

// 使用 useCallback
const handlePress = useCallback(() => {
  // 处理点击
}, []);

// 使用 useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 拆分组件
function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Counter count={count} setCount={setCount} />
      <ExpensiveList /> {/* 不会因为 count 变化重渲染 */}
    </View>
  );
}
```

---

## 总结

本文档详细介绍了 React Native 的所有核心内容：

1. **核心组件** - View, Text, Image, Button, TouchableOpacity 等
2. **样式系统** - StyleSheet, 响应式设计
3. **Flexbox 布局** - 灵活的布局系统
4. **列表组件** - FlatList, SectionList, VirtualizedList
5. **导航系统** - React Navigation 完整使用
6. **网络请求** - Fetch, Axios
7. **存储系统** - AsyncStorage
8. **动画系统** - Animated, LayoutAnimation, Reanimated
9. **手势处理** - PanResponder, Gesture Handler
10. **平台特定代码** - Platform API
11. **状态管理** - Context, Redux, Zustand
12. **性能优化** - 各种优化技巧

掌握这些知识点，你就能够熟练使用 React Native 开发跨平台移动应用！
