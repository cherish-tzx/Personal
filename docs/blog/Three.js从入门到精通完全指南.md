# Three.js 从入门到精通完全指南

> 本文档是一份面向初学者的Three.js完整教程，从最基础的概念开始，循序渐进地讲解每一个知识点。每个API都配有详细的中文注释、原理说明、使用场景分析和完整的代码示例。

---
<div class="doc-toc">
## 目录

- [第一部分：基础入门](#第一部分基础入门)
- [第二部分：核心对象详解](#第二部分核心对象详解)
- [第三部分：几何体完全指南](#第三部分几何体完全指南)
- [第四部分：材质系统详解](#第四部分材质系统详解)
- [第五部分：光照系统](#第五部分光照系统)
- [第六部分：纹理与贴图](#第六部分纹理与贴图)
- [第七部分：3D模型加载](#第七部分3d模型加载)
- [第八部分：动画系统](#第八部分动画系统)
- [第九部分：交互与控制](#第九部分交互与控制)
- [第十部分：高级技术](#第十部分高级技术)


</div>

---

# 第一部分：基础入门

## 1.1 什么是Three.js？

### 1.1.1 Three.js简介

**Three.js** 是一个基于 WebGL 的 JavaScript 3D 图形库，它让在网页上创建和显示3D图形变得简单易行。

**为什么需要Three.js？**

WebGL（Web Graphics Library）是浏览器提供的底层3D图形API，但直接使用WebGL编程非常复杂：
- 需要编写大量的着色器代码（GLSL语言）
- 需要手动管理顶点缓冲区、索引缓冲区
- 需要处理复杂的矩阵变换
- 代码量巨大，一个简单的三角形就需要上百行代码

Three.js的出现解决了这些问题：
- 封装了WebGL的复杂操作
- 提供了直观的API
- 内置了大量常用功能（几何体、材质、光源等）
- 几十行代码就能创建复杂的3D场景

### 1.1.2 Three.js能做什么？

Three.js可以用于创建各种3D应用：

| 应用领域 | 具体示例 |
|---------|---------|
| 产品展示 | 3D产品预览、汽车配置器、家具展示 |
| 数据可视化 | 3D图表、地球数据可视化、网络拓扑图 |
| 游戏开发 | 网页3D游戏、互动体验 |
| 建筑可视化 | 室内设计、城市规划、BIM可视化 |
| 教育科普 | 分子结构、天文模拟、物理演示 |
| 艺术创意 | 数字艺术、互动装置、创意网站 |

### 1.1.3 学习前提

学习Three.js之前，你需要掌握：

1. **HTML/CSS基础** - 了解网页结构和样式
2. **JavaScript基础** - 熟悉ES6+语法（类、箭头函数、模块等）
3. **基本的数学知识** - 坐标系、向量、矩阵（不需要很深，用到时会讲解）

---

## 1.2 开发环境搭建

### 1.2.1 方式一：使用CDN（最简单，适合学习）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的第一个Three.js程序</title>
  <style>
    /* 
     * 重置默认样式
     * margin和padding设为0，避免出现滚动条
     * overflow:hidden 隐藏溢出内容
     */
    * {
      margin: 0;
      padding: 0;
    }
    
    body {
      overflow: hidden; /* 隐藏滚动条 */
    }
    
    /* 
     * canvas元素将占满整个视口
     * display:block 消除canvas底部的空白间隙
     */
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <!-- 
    通过CDN引入Three.js
    importmap让我们可以使用ES6模块语法导入Three.js
  -->
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>
  
  <script type="module">
    // 导入Three.js核心库
    import * as THREE from 'three';
    
    // 在这里编写Three.js代码
    console.log('Three.js版本:', THREE.REVISION);
  </script>
</body>
</html>
```

### 1.2.2 方式二：使用npm（推荐，适合项目开发）

**步骤1：创建项目**

```bash
# 创建项目文件夹
mkdir my-threejs-project
cd my-threejs-project

# 初始化npm项目
npm init -y

# 安装Three.js
npm install three

# 安装Vite作为开发服务器（推荐）
npm install vite --save-dev
```

**步骤2：创建项目结构**

```
my-threejs-project/
├── node_modules/
├── public/
│   └── textures/      # 存放纹理图片
│   └── models/        # 存放3D模型
├── src/
│   └── main.js        # 主程序入口
├── index.html         # HTML入口
├── package.json
└── vite.config.js     # Vite配置（可选）
```

**步骤3：index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js项目</title>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**步骤4：src/main.js**

```javascript
import * as THREE from 'three';

// Three.js代码写在这里
console.log('Three.js已加载，版本:', THREE.REVISION);
```

**步骤5：在package.json中添加脚本**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

**步骤6：运行项目**

```bash
npm run dev
```

访问 `http://localhost:5173` 即可看到项目。

---

## 1.3 Three.js核心概念详解

在开始编码之前，我们需要理解Three.js的核心概念。这些概念就像电影制作一样：

### 1.3.1 核心概念对比

| Three.js概念 | 现实世界类比 | 作用 |
|-------------|-------------|------|
| **Scene（场景）** | 电影片场/舞台 | 容纳所有3D物体的空间 |
| **Camera（相机）** | 摄像机 | 决定从哪个角度观察场景 |
| **Renderer（渲染器）** | 电影放映机 | 将场景画面绘制到屏幕上 |
| **Mesh（网格）** | 演员/道具 | 场景中的3D物体 |
| **Geometry（几何体）** | 演员的身体形状 | 物体的形状（立方体、球体等） |
| **Material（材质）** | 演员的服装/皮肤 | 物体的外观（颜色、纹理、光泽等） |
| **Light（光源）** | 灯光 | 照亮场景中的物体 |

### 1.3.2 核心流程图解

```
┌─────────────────────────────────────────────────────────────────┐
│                         Three.js 渲染流程                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 创建场景 (Scene)                                             │
│       ↓                                                         │
│  2. 创建相机 (Camera)      ←── 决定观察视角                       │
│       ↓                                                         │
│  3. 创建渲染器 (Renderer)  ←── 连接到HTML的canvas元素              │
│       ↓                                                         │
│  4. 创建物体                                                     │
│      ├── 几何体 (Geometry) ←── 定义形状                          │
│      └── 材质 (Material)   ←── 定义外观                          │
│           ↓                                                     │
│      组合成网格 (Mesh)                                           │
│       ↓                                                         │
│  5. 添加光源 (Light)       ←── 照亮物体（可选，某些材质不需要）     │
│       ↓                                                         │
│  6. 将物体添加到场景                                              │
│       ↓                                                         │
│  7. 渲染循环 (Animation Loop)                                    │
│      └── 不断调用 renderer.render(scene, camera)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3.3 坐标系统详解

Three.js使用**右手坐标系**：

```
        Y轴 (上)
          ↑
          │
          │
          │
          └──────→ X轴 (右)
         /
        /
       ↙
      Z轴 (前/向屏幕外)
```

**理解坐标系的技巧（右手法则）：**
1. 伸出你的右手
2. 拇指指向X轴正方向（右）
3. 食指指向Y轴正方向（上）
4. 中指自然弯曲指向Z轴正方向（向你/屏幕外）

**坐标单位：**
- Three.js中没有固定的单位（不是米、厘米）
- 你可以自己定义1个单位代表什么
- 建议：如果做建筑，1单位=1米；如果做小物件，1单位=1厘米

---

## 1.4 第一个Three.js程序：完整注释版

现在让我们创建第一个Three.js程序——一个旋转的彩色立方体：

```javascript
// ================================================================
// 第一个Three.js程序：旋转的立方体
// ================================================================

// 导入Three.js库
// THREE是一个命名空间，包含了所有Three.js的类和方法
import * as THREE from 'three';

// ================================================================
// 第一步：创建场景（Scene）
// ================================================================
// 场景是所有3D物体的容器，就像一个空的房间
// 所有的物体、光源、相机都要添加到场景中才能显示
const scene = new THREE.Scene();

// 设置场景背景颜色
// 参数是16进制颜色值：0x开头，后面6位是RGB
// 0x000000 = 黑色, 0xffffff = 白色, 0x1a1a2e = 深蓝黑色
scene.background = new THREE.Color(0x1a1a2e);

// ================================================================
// 第二步：创建相机（Camera）
// ================================================================
// 相机决定了我们从哪个角度、以什么方式观察场景
// Three.js中最常用的是透视相机（PerspectiveCamera）

/*
 * 透视相机的四个参数详解：
 * 
 * 1. fov (Field of View) - 视野角度
 *    - 单位是度数（不是弧度）
 *    - 值越大，看到的范围越广（像广角镜头）
 *    - 值越小，看到的范围越窄（像长焦镜头）
 *    - 人眼的视野约60度，推荐值：45-75
 *    
 *              小fov(30)          大fov(90)
 *                 /\               /    \
 *                /  \             /      \
 *               /    \           /        \
 *              /______\         /____  ____\
 *              窄视野           宽视野
 * 
 * 2. aspect - 宽高比
 *    - 渲染画面的宽度/高度
 *    - 通常设置为 window.innerWidth / window.innerHeight
 *    - 如果设置错误，画面会被拉伸或压缩
 * 
 * 3. near - 近裁剪面
 *    - 距离相机多近的物体会被渲染
 *    - 比这个值更近的物体不会显示
 *    - 通常设置为0.1
 *    - 不要设置为0，会导致深度缓冲问题
 * 
 * 4. far - 远裁剪面
 *    - 距离相机多远的物体会被渲染
 *    - 比这个值更远的物体不会显示
 *    - 通常设置为1000-10000
 *    - 太大会降低深度精度，可能出现闪烁
 * 
 *    相机
 *      *
 *     /|\
 *    / | \
 *   /  |  \
 *  /   |   \
 * /near|far \
 * ─────┼─────
 *   可见区域
 */

const camera = new THREE.PerspectiveCamera(
  75,                                      // fov: 视野角度75度
  window.innerWidth / window.innerHeight,  // aspect: 窗口宽高比
  0.1,                                     // near: 近裁剪面0.1
  1000                                     // far: 远裁剪面1000
);

// 设置相机位置
// position是一个Vector3对象，有x, y, z三个属性
// 默认情况下，相机在原点(0,0,0)，看向-Z方向
// 我们把相机往后移（Z轴正方向），这样才能看到原点的物体
camera.position.z = 5;  // 相机在Z轴5的位置

// 也可以一次性设置x, y, z
// camera.position.set(0, 0, 5);

// ================================================================
// 第三步：创建渲染器（Renderer）
// ================================================================
// 渲染器负责将场景和相机的内容绘制到画布上

/*
 * WebGLRenderer的配置选项详解：
 * 
 * antialias: 抗锯齿
 *   - true: 开启抗锯齿，边缘更平滑，但消耗更多性能
 *   - false: 关闭抗锯齿，边缘可能有锯齿
 *   - 推荐开启，除非遇到性能问题
 *   
 *   关闭抗锯齿        开启抗锯齿
 *   ▓▓▓▓              ▓▓▓▓
 *   ▓▓▓▓▓             ▓▓▓▓▓
 *   ▓▓▓▓▓▓            ▓▓▓▓▓▓  ← 边缘更平滑
 *   (有锯齿)          (平滑)
 * 
 * alpha: 透明背景
 *   - true: 画布背景透明，可以看到网页底色
 *   - false: 画布背景不透明
 */

const renderer = new THREE.WebGLRenderer({
  antialias: true  // 开启抗锯齿
});

// 设置渲染器大小
// 通常设置为窗口大小，实现全屏效果
renderer.setSize(window.innerWidth, window.innerHeight);

// 设置像素比
// 在高清屏（如Retina屏幕）上，1个CSS像素可能对应多个物理像素
// devicePixelRatio就是这个比例（普通屏幕是1，Retina是2或3）
// Math.min限制最大为2，因为更高的值性能消耗大但肉眼难以区分
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 将渲染器的canvas元素添加到页面
// renderer.domElement 就是一个 <canvas> 元素
document.body.appendChild(renderer.domElement);

// ================================================================
// 第四步：创建3D物体
// ================================================================
// 一个3D物体（Mesh）由两部分组成：
// 1. 几何体（Geometry）- 定义形状
// 2. 材质（Material）- 定义外观

/*
 * BoxGeometry - 立方体几何体
 * 参数：(宽度width, 高度height, 深度depth, 
 *        宽度分段widthSegments, 高度分段heightSegments, 深度分段depthSegments)
 * 
 * 分段数越多，表面越平滑，但顶点数也越多
 * 对于立方体，分段数通常设为1就够了
 * 
 *     1,1,1的立方体：
 *        ┌─────┐
 *       /│    /│
 *      / │   / │
 *     ┌─────┐  │   高度1
 *     │  └──│──┘
 *     │ /   │ /    深度1
 *     │/    │/
 *     └─────┘
 *      宽度1
 */

const geometry = new THREE.BoxGeometry(1, 1, 1);

/*
 * MeshBasicMaterial - 基础材质
 * 这是最简单的材质，不受光照影响
 * 无论有没有光源，都会显示设置的颜色
 * 
 * 常用属性：
 * - color: 颜色，可以是16进制数、CSS颜色名、Color对象
 * - wireframe: 是否显示线框模式
 * - transparent: 是否开启透明
 * - opacity: 透明度（0-1，需要transparent:true才生效）
 */

const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,    // 绿色 (16进制：00=红, ff=绿, 00=蓝)
  // wireframe: true  // 取消注释可以看到线框模式
});

/*
 * Mesh - 网格对象
 * 将几何体和材质组合成一个可以添加到场景的物体
 * Mesh是Three.js中最常见的物体类型
 */

const cube = new THREE.Mesh(geometry, material);

// 将立方体添加到场景
// 只有添加到场景中的物体才会被渲染
scene.add(cube);

// ================================================================
// 第五步：渲染循环（Animation Loop）
// ================================================================
/*
 * 为什么需要渲染循环？
 * 
 * 如果只调用一次 renderer.render(scene, camera)，
 * 画面只会渲染一次，是静态的。
 * 
 * 要实现动画效果，需要：
 * 1. 不断更新物体的属性（位置、旋转等）
 * 2. 不断重新渲染画面
 * 
 * requestAnimationFrame 的优点：
 * - 浏览器会在下一次重绘之前调用指定的函数
 * - 通常每秒调用60次（60fps）
 * - 如果标签页不可见，会自动暂停，节省资源
 * - 比setInterval更平滑、更省电
 */

function animate() {
  // 请求下一帧动画
  // 这会创建一个循环：animate -> requestAnimationFrame -> animate -> ...
  requestAnimationFrame(animate);
  
  // 更新立方体的旋转
  // rotation的单位是弧度（radian），不是度数（degree）
  // 1弧度 ≈ 57.3度
  // Math.PI = 180度
  // 每帧旋转0.01弧度 ≈ 0.57度
  cube.rotation.x += 0.01;  // 绕X轴旋转
  cube.rotation.y += 0.01;  // 绕Y轴旋转
  
  // 渲染场景
  // 每次调用都会将场景的当前状态绘制到画布上
  renderer.render(scene, camera);
}

// 启动动画循环
animate();

// ================================================================
// 第六步：响应窗口大小变化
// ================================================================
/*
 * 当用户调整浏览器窗口大小时，需要：
 * 1. 更新相机的宽高比
 * 2. 更新渲染器的大小
 * 
 * 如果不处理，画面会被拉伸或压缩
 */

window.addEventListener('resize', () => {
  // 更新相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  
  // 更新相机的投影矩阵
  // 修改fov、aspect、near、far后必须调用此方法
  camera.updateProjectionMatrix();
  
  // 更新渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ================================================================
// 完成！
// ================================================================
// 现在你应该能看到一个旋转的绿色立方体
// 试着修改以下内容，看看效果：
// 1. 改变颜色：material.color = 0xff0000（红色）
// 2. 改变大小：new THREE.BoxGeometry(2, 2, 2)
// 3. 改变旋转速度：cube.rotation.x += 0.05
// 4. 改变相机位置：camera.position.set(5, 5, 5)
```

---

## 1.5 基础练习：理解坐标和变换

### 1.5.1 位置（Position）

```javascript
// ================================================================
// 位置（Position）详解
// ================================================================

const mesh = new THREE.Mesh(geometry, material);

// position是一个Vector3对象，有x, y, z三个属性
// 默认值都是0，即物体在原点

// 方式1：单独设置每个轴
mesh.position.x = 2;   // 向右移动2个单位
mesh.position.y = 1;   // 向上移动1个单位
mesh.position.z = -3;  // 向后移动3个单位（负Z是远离相机）

// 方式2：使用set方法一次性设置
mesh.position.set(2, 1, -3);

// 方式3：直接赋值Vector3
mesh.position.copy(new THREE.Vector3(2, 1, -3));

// ============================================
// position的常用属性和方法
// ============================================

// 获取位置到原点的距离
const distance = mesh.position.length();
console.log('距离原点:', distance);

// 获取到另一个点的距离
const otherPoint = new THREE.Vector3(5, 5, 5);
const distanceTo = mesh.position.distanceTo(otherPoint);
console.log('距离另一点:', distanceTo);

// 将位置归一化（变成长度为1的向量，方向不变）
// mesh.position.normalize();

// ============================================
// 可视化坐标轴
// ============================================
// AxesHelper可以帮助我们理解坐标系
// 红色=X轴，绿色=Y轴，蓝色=Z轴
const axesHelper = new THREE.AxesHelper(5); // 参数是轴的长度
scene.add(axesHelper);
```

### 1.5.2 旋转（Rotation）

```javascript
// ================================================================
// 旋转（Rotation）详解
// ================================================================

const mesh = new THREE.Mesh(geometry, material);

// rotation是一个Euler对象（欧拉角），有x, y, z三个属性
// 单位是弧度（radian），不是度数（degree）

/*
 * 弧度和度数的转换：
 * - 360度 = 2π弧度
 * - 180度 = π弧度
 * - 90度 = π/2弧度
 * - 1弧度 ≈ 57.3度
 * 
 * 度数转弧度：弧度 = 度数 × (Math.PI / 180)
 * 弧度转度数：度数 = 弧度 × (180 / Math.PI)
 */

// 方式1：直接设置弧度
mesh.rotation.x = Math.PI / 4;  // 绕X轴旋转45度
mesh.rotation.y = Math.PI / 2;  // 绕Y轴旋转90度
mesh.rotation.z = Math.PI;      // 绕Z轴旋转180度

// 方式2：使用set方法
mesh.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI);

// 方式3：使用Three.js提供的转换工具
mesh.rotation.x = THREE.MathUtils.degToRad(45);  // 45度转弧度

// ============================================
// 理解旋转方向
// ============================================
/*
 * 右手法则判断旋转方向：
 * 1. 右手握住旋转轴，拇指指向轴的正方向
 * 2. 四指弯曲的方向就是正向旋转的方向
 * 
 * X轴旋转：拇指指右，四指从上往前转（点头）
 * Y轴旋转：拇指指上，四指从前往右转（摇头）
 * Z轴旋转：拇指指前，四指从右往上转（歪头）
 */

// ============================================
// 旋转顺序（Euler Order）
// ============================================
/*
 * 欧拉角的一个问题是旋转顺序会影响结果
 * 默认顺序是 'XYZ'，意思是先X轴、再Y轴、最后Z轴
 * 
 * 可选顺序：'XYZ', 'YXZ', 'ZXY', 'XZY', 'YZX', 'ZYX'
 */
mesh.rotation.order = 'YXZ';  // 改变旋转顺序

// ============================================
// 使用四元数旋转（避免万向节锁）
// ============================================
/*
 * 欧拉角有一个问题叫"万向节锁"（Gimbal Lock）
 * 当某个轴旋转90度时，可能会丢失一个自由度
 * 
 * 四元数（Quaternion）可以避免这个问题
 * 适合需要平滑插值的动画
 */

// 使用四元数设置旋转
mesh.quaternion.setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),  // 旋转轴（这里是Y轴）
  Math.PI / 4                   // 旋转角度
);
```

### 1.5.3 缩放（Scale）

```javascript
// ================================================================
// 缩放（Scale）详解
// ================================================================

const mesh = new THREE.Mesh(geometry, material);

// scale是一个Vector3对象，默认值是(1, 1, 1)
// 1表示原始大小，2表示放大2倍，0.5表示缩小到一半

// 方式1：单独设置
mesh.scale.x = 2;   // X方向放大2倍
mesh.scale.y = 0.5; // Y方向缩小到一半
mesh.scale.z = 1;   // Z方向保持不变

// 方式2：使用set
mesh.scale.set(2, 0.5, 1);

// 方式3：统一缩放
mesh.scale.setScalar(2);  // 所有方向都放大2倍

// ============================================
// 缩放的应用
// ============================================

// 1. 制作扁平的盒子
const flatBox = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  material
);
flatBox.scale.set(2, 0.1, 2);  // 宽2，高0.1，深2

// 2. 镜像效果（负数缩放）
mesh.scale.x = -1;  // X方向镜像

// 3. 动态缩放动画
function animate() {
  requestAnimationFrame(animate);
  
  // 呼吸效果：在0.8到1.2之间变化
  const scale = 1 + Math.sin(Date.now() * 0.002) * 0.2;
  mesh.scale.setScalar(scale);
  
  renderer.render(scene, camera);
}
```

### 1.5.4 变换的组合使用

```javascript
// ================================================================
// 变换的组合使用
// ================================================================

// 创建一个演示物体
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

// 同时应用位置、旋转、缩放
mesh.position.set(2, 1, 0);
mesh.rotation.set(0, Math.PI / 4, 0);
mesh.scale.set(1.5, 1.5, 1.5);

scene.add(mesh);

// ============================================
// 变换的顺序
// ============================================
/*
 * Three.js内部的变换顺序是固定的：
 * 1. 先缩放（Scale）
 * 2. 再旋转（Rotation）
 * 3. 最后平移（Translation/Position）
 * 
 * 这个顺序称为 SRT（Scale-Rotate-Translate）
 * 
 * 为什么顺序重要？
 * 想象一下，如果先移动再旋转，物体会绕原点转
 * 如果先旋转再移动，物体会绕自己的中心转
 */

// ============================================
// lookAt - 让物体朝向某个点
// ============================================
// 非常有用的方法，让物体的Z轴负方向指向目标点

// 让相机看向某个物体
camera.lookAt(mesh.position);

// 让物体看向某个点
mesh.lookAt(0, 0, 0);  // 看向原点
mesh.lookAt(new THREE.Vector3(5, 3, 2));  // 看向指定坐标

// ============================================
// 辅助理解变换的小技巧
// ============================================

// 1. 添加坐标轴辅助器到物体
const objectAxes = new THREE.AxesHelper(2);
mesh.add(objectAxes);  // 物体的本地坐标系

// 2. 添加包围盒辅助器
const boxHelper = new THREE.BoxHelper(mesh, 0xffff00);
scene.add(boxHelper);

// 3. 在控制台打印变换信息
console.log('位置:', mesh.position);
console.log('旋转:', mesh.rotation);
console.log('缩放:', mesh.scale);
```

---

## 1.6 场景图（Scene Graph）与层级关系

### 1.6.1 什么是场景图？

```javascript
// ================================================================
// 场景图（Scene Graph）详解
// ================================================================

/*
 * 场景图是一种树形结构，用于组织3D场景中的所有对象
 * 
 *                 Scene（根节点）
 *                    │
 *         ┌──────────┼──────────┐
 *         │          │          │
 *       Light      Group      Camera
 *                    │
 *         ┌──────────┼──────────┐
 *         │          │          │
 *       Mesh1     Mesh2      Group2
 *                               │
 *                    ┌──────────┼──────────┐
 *                    │          │          │
 *                  Mesh3     Mesh4      Mesh5
 * 
 * 核心概念：
 * 1. 每个对象只能有一个父对象
 * 2. 一个对象可以有多个子对象
 * 3. 子对象的变换是相对于父对象的（本地坐标系）
 */

// ============================================
// 父子关系的创建
// ============================================

// 创建父对象
const parent = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// 创建子对象
const child = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

// 建立父子关系
parent.add(child);

// 子对象的位置是相对于父对象的
// 这里child在parent的本地坐标系中位于(3, 0, 0)
// 如果parent在世界坐标(0,0,0)，child的世界坐标就是(3,0,0)
// 如果parent移动到(5,0,0)，child的世界坐标就是(8,0,0)
child.position.x = 3;

// 将父对象添加到场景
scene.add(parent);

// ============================================
// 层级关系的实际应用：机械臂
// ============================================

// 基座（固定不动）
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 0.5, 32),
  new THREE.MeshBasicMaterial({ color: 0x888888 })
);
scene.add(base);

// 下臂（连接到基座，可以绕Y轴旋转）
const lowerArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 2, 0.3),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
lowerArm.position.y = 1;  // 放在基座上方
lowerArm.geometry.translate(0, 1, 0);  // 移动几何体中心到底部
base.add(lowerArm);

// 上臂（连接到下臂，可以绕X轴旋转）
const upperArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 1.5, 0.2),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
upperArm.position.y = 2;  // 放在下臂顶部
upperArm.geometry.translate(0, 0.75, 0);  // 移动几何体中心到底部
lowerArm.add(upperArm);

// 动画：旋转各部分
function animate() {
  requestAnimationFrame(animate);
  
  // 基座旋转
  base.rotation.y += 0.01;
  
  // 下臂摆动
  lowerArm.rotation.z = Math.sin(Date.now() * 0.002) * 0.5;
  
  // 上臂摆动
  upperArm.rotation.z = Math.sin(Date.now() * 0.003) * 0.5;
  
  renderer.render(scene, camera);
}

// ============================================
// Group - 专门用于分组的空对象
// ============================================

/*
 * Group是一个没有几何体和材质的空对象
 * 专门用于组织和管理其他对象
 * 
 * 使用场景：
 * 1. 将相关的物体组合在一起，方便统一变换
 * 2. 管理复杂场景的层级结构
 * 3. 实现模块化的场景设计
 */

// 创建一个组来管理一辆汽车
const car = new THREE.Group();

// 车身
const body = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
body.position.y = 0.5;
car.add(body);

// 车顶
const roof = new THREE.Mesh(
  new THREE.BoxGeometry(1, 0.4, 0.9),
  new THREE.MeshBasicMaterial({ color: 0x0000cc })
);
roof.position.y = 0.95;
car.add(roof);

// 四个轮子
const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

const wheelPositions = [
  { x: -0.7, y: 0.3, z: 0.5 },
  { x: 0.7, y: 0.3, z: 0.5 },
  { x: -0.7, y: 0.3, z: -0.5 },
  { x: 0.7, y: 0.3, z: -0.5 }
];

wheelPositions.forEach(pos => {
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(pos.x, pos.y, pos.z);
  car.add(wheel);
});

// 整辆车添加到场景
scene.add(car);

// 现在可以统一移动/旋转整辆车
car.position.x = 5;
car.rotation.y = Math.PI / 4;

// ============================================
// 遍历场景图
// ============================================

// 遍历所有对象
scene.traverse((object) => {
  console.log(object.type, object.name);
  
  // 对所有网格对象做某些操作
  if (object.isMesh) {
    object.castShadow = true;
    object.receiveShadow = true;
  }
});

// 只遍历可见对象
scene.traverseVisible((object) => {
  // ...
});

// ============================================
// 查找对象
// ============================================

// 通过名称查找
car.name = 'myCar';
const foundCar = scene.getObjectByName('myCar');

// 通过ID查找
const foundById = scene.getObjectById(car.id);

// 通过属性查找
const foundByProperty = scene.getObjectByProperty('uuid', car.uuid);

// ============================================
// 移除对象
// ============================================

// 从父对象中移除
car.remove(roof);

// 从场景中移除
scene.remove(car);

// 清空所有子对象
car.clear();
```

---

## 1.7 完整基础示例：太阳系

让我们用学到的知识创建一个简单的太阳系模拟：

```javascript
// ================================================================
// 太阳系模拟 - 综合基础示例
// ================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// 初始化
// ============================================

// 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 50);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 轨道控制器（后面会详细讲解）
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ============================================
// 创建太阳
// ============================================

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// ============================================
// 创建行星的工厂函数
// ============================================

function createPlanet(size, color, distanceFromSun) {
  // 创建一个组来管理行星的公转
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);
  
  // 创建行星
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planetMaterial = new THREE.MeshBasicMaterial({ color: color });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  
  // 设置行星距离太阳的距离
  planet.position.x = distanceFromSun;
  
  // 将行星添加到公转组
  orbitGroup.add(planet);
  
  // 创建轨道线（可视化轨道）
  const orbitGeometry = new THREE.RingGeometry(
    distanceFromSun - 0.1,
    distanceFromSun + 0.1,
    64
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;  // 让轨道水平
  scene.add(orbit);
  
  return {
    orbitGroup: orbitGroup,
    planet: planet,
    distanceFromSun: distanceFromSun
  };
}

// ============================================
// 创建行星
// ============================================

// 水星
const mercury = createPlanet(0.5, 0xaaaaaa, 10);

// 金星
const venus = createPlanet(0.8, 0xffaa00, 15);

// 地球
const earth = createPlanet(1, 0x0066ff, 20);

// 创建月球（地球的卫星）
const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = 2;  // 相对于地球的位置
earth.planet.add(moon);  // 月球是地球的子对象

// 火星
const mars = createPlanet(0.7, 0xff4400, 25);

// 木星
const jupiter = createPlanet(2.5, 0xffaa88, 35);

// 土星
const saturn = createPlanet(2, 0xffcc66, 45);

// 创建土星环
const ringGeometry = new THREE.RingGeometry(2.5, 4, 64);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xccaa66,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.7
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
saturn.planet.add(ring);

// ============================================
// 创建星空背景
// ============================================

function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    // 在球形区域内随机分布
    const radius = 200 + Math.random() * 300;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5
  });
  
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

createStars();

// ============================================
// 动画循环
// ============================================

function animate() {
  requestAnimationFrame(animate);
  
  // 获取时间（秒）
  const time = Date.now() * 0.001;
  
  // 太阳自转
  sun.rotation.y += 0.002;
  
  // 行星公转（绕太阳转）
  // 距离太阳越近，公转越快（模拟开普勒定律）
  mercury.orbitGroup.rotation.y = time * 1.5;
  venus.orbitGroup.rotation.y = time * 1.2;
  earth.orbitGroup.rotation.y = time * 1.0;
  mars.orbitGroup.rotation.y = time * 0.8;
  jupiter.orbitGroup.rotation.y = time * 0.5;
  saturn.orbitGroup.rotation.y = time * 0.3;
  
  // 行星自转
  mercury.planet.rotation.y += 0.02;
  venus.planet.rotation.y += 0.015;
  earth.planet.rotation.y += 0.02;
  mars.planet.rotation.y += 0.018;
  jupiter.planet.rotation.y += 0.04;
  saturn.planet.rotation.y += 0.038;
  
  // 月球绕地球转
  moon.position.x = Math.cos(time * 3) * 2;
  moon.position.z = Math.sin(time * 3) * 2;
  
  // 更新控制器
  controls.update();
  
  // 渲染
  renderer.render(scene, camera);
}

animate();

// ============================================
// 响应窗口变化
// ============================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

---

# 第二部分：核心对象详解

## 2.1 场景（Scene）完全指南

### 2.1.1 Scene的创建与基本属性

```javascript
// ================================================================
// Scene（场景）完全指南
// ================================================================

/*
 * Scene是Three.js中最重要的容器对象
 * 它是所有3D对象的根节点，类似于HTML中的<body>
 * 
 * Scene继承自Object3D，所以它具有所有Object3D的属性和方法
 * 包括：position, rotation, scale, add(), remove()等
 */

const scene = new THREE.Scene();

// ============================================
// 1. 场景名称（调试用）
// ============================================
scene.name = 'MainScene';  // 给场景命名，方便调试时识别

// ============================================
// 2. 场景背景
// ============================================

// 2.1 纯色背景
scene.background = new THREE.Color(0x000000);  // 黑色
scene.background = new THREE.Color('skyblue');  // CSS颜色名
scene.background = new THREE.Color('rgb(100, 150, 200)');  // RGB
scene.background = new THREE.Color('#1a1a2e');  // 16进制字符串

// 2.2 图片背景
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('background.jpg');

// 2.3 立方体贴图背景（天空盒）
/*
 * 天空盒是由6张图片组成的立方体，包裹整个场景
 * 图片顺序：正X, 负X, 正Y, 负Y, 正Z, 负Z
 * 或者记为：右, 左, 上, 下, 前, 后
 * 
 *       ┌───┐
 *       │ py│ (正Y/上)
 *   ┌───┼───┼───┬───┐
 *   │ nx│ pz│ px│ nz│
 *   │左 │前 │右 │后 │
 *   └───┼───┼───┴───┘
 *       │ ny│ (负Y/下)
 *       └───┘
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  'skybox/px.jpg',  // 正X（右）
  'skybox/nx.jpg',  // 负X（左）
  'skybox/py.jpg',  // 正Y（上）
  'skybox/ny.jpg',  // 负Y（下）
  'skybox/pz.jpg',  // 正Z（前）
  'skybox/nz.jpg'   // 负Z（后）
]);

// 2.4 等距矩形全景图（360度图片）
/*
 * 等距矩形投影是一种将球面展开为矩形的方式
 * 常见于360度全景照片和HDR环境贴图
 * 
 * 宽高比通常是2:1
 */
const equirectTexture = textureLoader.load('panorama.jpg');
equirectTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = equirectTexture;

// 2.5 HDR环境贴图（高动态范围）
/*
 * HDR图片可以存储更大范围的亮度值
 * 用于实现更真实的光照效果
 * 需要使用专门的加载器
 */
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('environment.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;  // 同时用作环境光照
});
```

### 2.1.2 环境贴图（Environment Map）

```javascript
// ================================================================
// 环境贴图（Environment Map）详解
// ================================================================

/*
 * 环境贴图有两个主要用途：
 * 1. 作为场景背景（scene.background）
 * 2. 作为物体的反射/折射源（scene.environment 或 material.envMap）
 * 
 * 当设置了scene.environment后，场景中所有支持环境贴图的材质
 * 都会自动使用这个环境贴图进行反射计算
 */

// 加载环境贴图
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  'env/px.jpg', 'env/nx.jpg',
  'env/py.jpg', 'env/ny.jpg',
  'env/pz.jpg', 'env/nz.jpg'
]);

// 设置为场景环境
scene.environment = envMap;

// 或者单独为某个材质设置
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0,
  envMap: envMap,           // 手动设置环境贴图
  envMapIntensity: 1        // 环境贴图强度
});

// ============================================
// 环境贴图强度
// ============================================
/*
 * 可以通过envMapIntensity控制环境贴图的影响程度
 * 0 = 没有反射
 * 1 = 正常反射
 * >1 = 增强反射
 */

// 全局设置场景环境贴图强度（Three.js r150+）
scene.environmentIntensity = 1;  

// 单独设置材质的环境贴图强度
material.envMapIntensity = 0.5;

// ============================================
// 背景模糊和旋转（Three.js r150+）
// ============================================
scene.backgroundBlurriness = 0;   // 背景模糊度 (0-1)
scene.backgroundIntensity = 1;    // 背景亮度
scene.backgroundRotation.y = Math.PI;  // 背景旋转

// 环境旋转（影响反射方向）
scene.environmentRotation.y = Math.PI;
```

### 2.1.3 雾效果（Fog）

```javascript
// ================================================================
// 雾效果（Fog）详解
// ================================================================

/*
 * 雾可以让远处的物体逐渐消失在背景中
 * 这可以：
 * 1. 增加场景的深度感
 * 2. 隐藏远处的细节，减少渲染压力
 * 3. 营造氛围（恐怖、神秘等）
 * 
 * Three.js提供两种雾：
 * 1. Fog - 线性雾
 * 2. FogExp2 - 指数雾
 */

// ============================================
// 线性雾（Fog）
// ============================================
/*
 * 雾的浓度从near到far线性增加
 * 
 *   浓度
 *    1 │        ___________
 *      │       /
 *      │      /
 *      │     /
 *    0 │____/
 *      └────┴────┴────────→ 距离
 *          near  far
 * 
 * - near之前：完全清晰
 * - near到far之间：逐渐变雾
 * - far之后：完全被雾覆盖
 */

scene.fog = new THREE.Fog(
  0xcccccc,  // 雾的颜色（通常与背景色相同或相近）
  10,        // near - 开始出现雾的距离
  50         // far - 完全被雾覆盖的距离
);

// 为了效果自然，背景色应该与雾色相同
scene.background = new THREE.Color(0xcccccc);

// ============================================
// 指数雾（FogExp2）
// ============================================
/*
 * 雾的浓度按指数增长，更接近真实世界的雾
 * 
 *   浓度
 *    1 │          _____
 *      │        /
 *      │      /
 *      │   __/
 *    0 │__/
 *      └────────────────→ 距离
 * 
 * density越大，雾越浓
 */

scene.fog = new THREE.FogExp2(
  0xcccccc,  // 雾的颜色
  0.02       // density - 雾的密度
);

// ============================================
// 动态修改雾
// ============================================
// 修改颜色
scene.fog.color.setHex(0x000033);  // 深蓝色雾

// 修改线性雾的范围
if (scene.fog instanceof THREE.Fog) {
  scene.fog.near = 5;
  scene.fog.far = 30;
}

// 修改指数雾的密度
if (scene.fog instanceof THREE.FogExp2) {
  scene.fog.density = 0.05;
}

// ============================================
// 雾的注意事项
// ============================================
/*
 * 1. MeshBasicMaterial默认不受雾影响
 *    需要设置 material.fog = true
 * 
 * 2. 点精灵（Points）和线条（Line）也可以受雾影响
 * 
 * 3. 自定义着色器需要手动处理雾效果
 */

// 让MeshBasicMaterial也受雾影响
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  fog: true  // 启用雾效果
});
```

### 2.1.4 场景管理方法

```javascript
// ================================================================
// 场景管理方法详解
// ================================================================

// ============================================
// 添加和移除对象
// ============================================

// 添加单个对象
scene.add(mesh);

// 添加多个对象
scene.add(mesh1, mesh2, mesh3);

// 移除单个对象
scene.remove(mesh);

// 移除多个对象
scene.remove(mesh1, mesh2, mesh3);

// 清空场景中的所有对象
scene.clear();

// ============================================
// 查找对象
// ============================================

// 通过名称查找（只返回第一个匹配的）
mesh.name = 'myCube';
const found = scene.getObjectByName('myCube');

// 通过ID查找
const foundById = scene.getObjectById(mesh.id);

// 通过UUID查找
const foundByUuid = scene.getObjectByProperty('uuid', mesh.uuid);

// 通过任意属性查找
const foundByCustom = scene.getObjectByProperty('customProp', 'value');

// ============================================
// 遍历场景
// ============================================

// 遍历所有对象（包括不可见的）
scene.traverse((object) => {
  console.log(object.type, object.name);
  
  // 对网格对象做特殊处理
  if (object.isMesh) {
    object.castShadow = true;
    object.receiveShadow = true;
  }
  
  // 对光源做特殊处理
  if (object.isLight) {
    console.log('找到光源:', object.type);
  }
});

// 只遍历可见对象
scene.traverseVisible((object) => {
  // 只会访问visible为true的对象
});

// 遍历祖先（从当前对象到根节点）
mesh.traverseAncestors((ancestor) => {
  console.log('祖先:', ancestor.name);
});

// ============================================
// 获取所有特定类型的对象
// ============================================

function getAllMeshes(object) {
  const meshes = [];
  object.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child);
    }
  });
  return meshes;
}

const allMeshes = getAllMeshes(scene);
console.log('场景中的网格数量:', allMeshes.length);

// ============================================
// 场景的JSON导出/导入
// ============================================

// 导出场景为JSON
const sceneJson = scene.toJSON();
console.log(sceneJson);

// 从JSON导入场景
const loader = new THREE.ObjectLoader();
loader.parse(sceneJson, (loadedScene) => {
  // loadedScene是重建的场景
  scene.add(loadedScene);
});
```

---

## 2.2 相机（Camera）完全指南

### 2.2.1 透视相机（PerspectiveCamera）深入理解

```javascript
// ================================================================
// 透视相机（PerspectiveCamera）深入理解
// ================================================================

/*
 * 透视相机模拟人眼的观察方式：
 * - 近处的物体看起来大
 * - 远处的物体看起来小
 * - 平行线会汇聚到远处的一点（消失点）
 * 
 * 这是最常用的相机类型，适合大多数3D应用
 */

// ============================================
// 透视相机的参数详解
// ============================================

/*
 *                    相机
 *                      *
 *                     /|\
 *                    / | \
 *                   /  |  \
 *                  /   |   \
 *                 /    |    \
 *                /  fov角度  \
 *               /      |      \
 *              /       |       \
 *             /________|________\  ← far（远裁剪面）
 *            |         |         |
 *            |   可见区域(视锥体)   |
 *            |_________|_________|  ← near（近裁剪面）
 *            
 *                  aspect = 宽/高
 */

const camera = new THREE.PerspectiveCamera(
  75,    // fov (垂直方向的视野角度)
  window.innerWidth / window.innerHeight,  // aspect (宽高比)
  0.1,   // near (近裁剪面)
  1000   // far (远裁剪面)
);

// ============================================
// 参数1：fov（视野角度）详解
// ============================================
/*
 * fov = Field of View，视野角度
 * 单位是度（degree），不是弧度
 * 
 * 小fov（如30度）：
 * - 视野窄，像望远镜
 * - 物体看起来更大、更近
 * - 透视变形小
 * 
 * 大fov（如90度）：
 * - 视野宽，像广角镜头
 * - 物体看起来更小、更远
 * - 透视变形大（边缘拉伸）
 * 
 * 推荐值：
 * - 人眼约60度
 * - 游戏常用45-75度
 * - VR需要90-110度
 */

// 动态修改fov
camera.fov = 50;
camera.updateProjectionMatrix();  // 修改后必须调用！

// fov动画效果（冲刺/变焦）
function zoomEffect(targetFov, duration = 500) {
  const startFov = camera.fov;
  const startTime = Date.now();
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    camera.fov = startFov + (targetFov - startFov) * progress;
    camera.updateProjectionMatrix();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}

// 使用：冲刺效果
// zoomEffect(90);  // fov变大，视野变宽
// zoomEffect(50);  // 恢复

// ============================================
// 参数2：aspect（宽高比）详解
// ============================================
/*
 * aspect = 渲染区域的宽度 / 高度
 * 
 * 如果aspect设置错误，画面会被拉伸或压缩：
 * - aspect太大：画面水平拉伸
 * - aspect太小：画面垂直拉伸
 * 
 * 全屏时：window.innerWidth / window.innerHeight
 * 特定区域时：container.clientWidth / container.clientHeight
 */

// 窗口大小变化时更新
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// 参数3和4：near和far（裁剪面）详解
// ============================================
/*
 * 只有在near和far之间的物体才会被渲染
 * 
 * near的选择：
 * - 不能设为0，会导致深度缓冲问题
 * - 尽量不要太小（如0.001），会降低深度精度
 * - 推荐0.1到1之间
 * 
 * far的选择：
 * - 太大会降低深度精度，物体可能闪烁（Z-fighting）
 * - 根据场景实际大小设置
 * - 推荐100到10000之间
 * 
 * near和far的比值：
 * - 比值越大，深度精度越低
 * - 尽量保持 far/near < 10000
 * - 最好 far/near < 1000
 */

// 示例：小场景（室内）
const indoorCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);

// 示例：大场景（城市）
const outdoorCamera = new THREE.PerspectiveCamera(75, aspect, 1, 10000);

// 示例：微观场景（分子）
const microCamera = new THREE.PerspectiveCamera(75, aspect, 0.001, 10);

// ============================================
// 相机位置和朝向
// ============================================

// 设置位置
camera.position.set(0, 5, 10);

// 让相机看向某个点
camera.lookAt(0, 0, 0);  // 看向原点
camera.lookAt(mesh.position);  // 看向某个物体

// 让相机看向某个物体（持续跟踪）
function animate() {
  requestAnimationFrame(animate);
  
  // 相机始终看向目标
  camera.lookAt(targetMesh.position);
  
  renderer.render(scene, camera);
}

// ============================================
// 获取相机信息
// ============================================

// 获取相机视线方向
const direction = new THREE.Vector3();
camera.getWorldDirection(direction);
console.log('相机朝向:', direction);

// 获取相机在世界坐标系中的位置
const worldPosition = new THREE.Vector3();
camera.getWorldPosition(worldPosition);
console.log('相机位置:', worldPosition);
```

### 2.2.2 正交相机（OrthographicCamera）详解

```javascript
// ================================================================
// 正交相机（OrthographicCamera）详解
// ================================================================

/*
 * 正交相机没有透视效果：
 * - 物体大小不随距离变化
 * - 平行线始终保持平行
 * 
 * 适用场景：
 * - 2D游戏
 * - CAD软件
 * - 建筑设计图
 * - UI元素
 * - 等距视角游戏
 * 
 *    透视相机          正交相机
 *    
 *      /\              ┌──┐
 *     /  \             │  │
 *    /    \            │  │
 *   /______\           └──┘
 *   
 *   近大远小          大小不变
 */

// ============================================
// 正交相机的参数
// ============================================
/*
 *                  top
 *            ┌──────────────┐
 *            │              │
 *    left    │    相机      │  right
 *            │    可见      │
 *            │    区域      │
 *            │              │
 *            └──────────────┘
 *                 bottom
 *                 
 *    near ←───────────────────→ far
 *           (深度方向)
 */

const frustumSize = 10;  // 可见区域的高度
const aspect = window.innerWidth / window.innerHeight;

const orthoCamera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,  // left（左边界）
  frustumSize * aspect / 2,   // right（右边界）
  frustumSize / 2,            // top（上边界）
  frustumSize / -2,           // bottom（下边界）
  0.1,                        // near（近裁剪面）
  1000                        // far（远裁剪面）
);

orthoCamera.position.set(10, 10, 10);
orthoCamera.lookAt(0, 0, 0);

// ============================================
// 正交相机的缩放
// ============================================
/*
 * 正交相机使用zoom属性来缩放
 * zoom > 1：放大（物体看起来更大）
 * zoom < 1：缩小（物体看起来更小）
 */

orthoCamera.zoom = 2;  // 放大2倍
orthoCamera.updateProjectionMatrix();

// 鼠标滚轮缩放
window.addEventListener('wheel', (event) => {
  orthoCamera.zoom *= event.deltaY > 0 ? 0.9 : 1.1;
  orthoCamera.zoom = Math.max(0.1, Math.min(10, orthoCamera.zoom));
  orthoCamera.updateProjectionMatrix();
});

// ============================================
// 窗口大小变化时更新正交相机
// ============================================
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  
  orthoCamera.left = frustumSize * aspect / -2;
  orthoCamera.right = frustumSize * aspect / 2;
  orthoCamera.top = frustumSize / 2;
  orthoCamera.bottom = frustumSize / -2;
  
  orthoCamera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// 等距视角（Isometric）示例
// ============================================
/*
 * 等距视角是一种常见的2D游戏视角
 * 相机从45度角俯视场景
 */

function setupIsometricCamera() {
  const frustumSize = 15;
  const aspect = window.innerWidth / window.innerHeight;
  
  const isoCamera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,  // 负值允许看到相机后面的物体
    1000
  );
  
  // 等距视角的位置
  const distance = 10;
  isoCamera.position.set(distance, distance, distance);
  isoCamera.lookAt(0, 0, 0);
  
  return isoCamera;
}

// ============================================
// 2D模式（完全正上方俯视）
// ============================================
function setup2DCamera() {
  const frustumSize = 20;
  const aspect = window.innerWidth / window.innerHeight;
  
  const camera2D = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    100
  );
  
  // 从正上方看
  camera2D.position.set(0, 50, 0);
  camera2D.lookAt(0, 0, 0);
  
  // 注意：此时Z轴在屏幕上是垂直方向
  // 可以旋转相机使Z轴成为水平方向
  camera2D.up.set(0, 0, -1);  // 改变"上"的方向
  camera2D.lookAt(0, 0, 0);
  
  return camera2D;
}
```

### 2.2.3 相机切换和动画

```javascript
// ================================================================
// 相机切换和动画
// ================================================================

// ============================================
// 多相机切换
// ============================================
const perspCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
perspCamera.position.set(0, 5, 10);

const orthoCamera = new THREE.OrthographicCamera(-10, 10, 5, -5, 0.1, 1000);
orthoCamera.position.set(0, 10, 0);
orthoCamera.lookAt(0, 0, 0);

let currentCamera = perspCamera;

// 切换相机
function switchCamera() {
  currentCamera = currentCamera === perspCamera ? orthoCamera : perspCamera;
}

// 在渲染循环中使用当前相机
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, currentCamera);
}

// ============================================
// 相机平滑移动（使用lerp）
// ============================================
/*
 * lerp = Linear Interpolation（线性插值）
 * 让值平滑地从A变化到B
 */

const targetPosition = new THREE.Vector3(10, 5, 10);
const smoothness = 0.05;  // 平滑度，越小越慢

function animate() {
  requestAnimationFrame(animate);
  
  // 相机位置平滑移动到目标位置
  camera.position.lerp(targetPosition, smoothness);
  
  renderer.render(scene, camera);
}

// 点击某处，相机移动到那里
function moveCameraTo(x, y, z) {
  targetPosition.set(x, y, z);
}

// ============================================
// 相机围绕目标旋转
// ============================================
let angle = 0;
const radius = 10;
const center = new THREE.Vector3(0, 0, 0);

function orbitCamera() {
  angle += 0.01;
  
  camera.position.x = center.x + Math.cos(angle) * radius;
  camera.position.z = center.z + Math.sin(angle) * radius;
  camera.position.y = 5;
  
  camera.lookAt(center);
}

function animate() {
  requestAnimationFrame(animate);
  
  orbitCamera();
  
  renderer.render(scene, camera);
}

// ============================================
// 使用GSAP进行相机动画（推荐）
// ============================================
/*
 * GSAP是一个强大的动画库
 * 安装：npm install gsap
 */

import { gsap } from 'gsap';

// 相机移动动画
function animateCameraTo(position, target, duration = 2) {
  // 动画相机位置
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(target);
    }
  });
}

// 使用
animateCameraTo(
  { x: 5, y: 3, z: 8 },
  new THREE.Vector3(0, 0, 0),
  1.5
);

// ============================================
// 第一人称相机
// ============================================
class FirstPersonCamera {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.sensitivity = 0.002;
    this.moveSpeed = 0.1;
    
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };
    
    this.init();
  }
  
  init() {
    // 鼠标移动控制视角
    this.domElement.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === this.domElement) {
        this.euler.y -= event.movementX * this.sensitivity;
        this.euler.x -= event.movementY * this.sensitivity;
        
        // 限制垂直角度，防止翻转
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
        
        this.camera.quaternion.setFromEuler(this.euler);
      }
    });
    
    // 点击锁定鼠标
    this.domElement.addEventListener('click', () => {
      this.domElement.requestPointerLock();
    });
    
    // 键盘控制移动
    document.addEventListener('keydown', (event) => {
      switch(event.code) {
        case 'KeyW': this.keys.forward = true; break;
        case 'KeyS': this.keys.backward = true; break;
        case 'KeyA': this.keys.left = true; break;
        case 'KeyD': this.keys.right = true; break;
      }
    });
    
    document.addEventListener('keyup', (event) => {
      switch(event.code) {
        case 'KeyW': this.keys.forward = false; break;
        case 'KeyS': this.keys.backward = false; break;
        case 'KeyA': this.keys.left = false; break;
        case 'KeyD': this.keys.right = false; break;
      }
    });
  }
  
  update() {
    // 获取相机的前方和右方向
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;  // 保持在水平面上移动
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
    
    // 根据按键移动
    if (this.keys.forward) {
      this.camera.position.addScaledVector(forward, this.moveSpeed);
    }
    if (this.keys.backward) {
      this.camera.position.addScaledVector(forward, -this.moveSpeed);
    }
    if (this.keys.left) {
      this.camera.position.addScaledVector(right, -this.moveSpeed);
    }
    if (this.keys.right) {
      this.camera.position.addScaledVector(right, this.moveSpeed);
    }
  }
}

// 使用
const fpCamera = new FirstPersonCamera(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  
  fpCamera.update();
  
  renderer.render(scene, camera);
}
```

---

## 2.3 渲染器（Renderer）完全指南

### 2.3.1 WebGLRenderer配置详解

```javascript
// ================================================================
// WebGLRenderer配置详解
// ================================================================

/*
 * WebGLRenderer是Three.js的核心渲染器
 * 它使用WebGL API将3D场景绘制到HTML canvas元素上
 */

// ============================================
// 创建渲染器的所有配置选项
// ============================================

const renderer = new THREE.WebGLRenderer({
  // ========================================
  // 画布设置
  // ========================================
  
  // canvas: 指定使用的canvas元素
  // 如果不指定，会自动创建一个
  canvas: document.querySelector('#myCanvas'),
  
  // context: 使用现有的WebGL上下文
  // 很少使用，通常让Three.js自动创建
  // context: existingContext,
  
  // ========================================
  // 渲染质量设置
  // ========================================
  
  // antialias: 抗锯齿
  // true: 边缘更平滑，但消耗更多性能
  // false: 可能有锯齿，但性能更好
  // 推荐：在高清屏上可以关闭（像素密度已经很高）
  antialias: true,
  
  // precision: 着色器精度
  // 'highp': 高精度（默认，推荐）
  // 'mediump': 中等精度
  // 'lowp': 低精度（移动设备可能需要）
  precision: 'highp',
  
  // ========================================
  // 透明度设置
  // ========================================
  
  // alpha: 画布背景是否透明
  // true: 可以看到画布后面的HTML内容
  // false: 画布是不透明的
  alpha: false,
  
  // premultipliedAlpha: 预乘Alpha
  // 影响透明度的混合方式，通常保持默认
  premultipliedAlpha: true,
  
  // ========================================
  // 缓冲区设置
  // ========================================
  
  // depth: 深度缓冲区
  // 用于正确渲染物体的前后关系
  // 几乎总是需要开启
  depth: true,
  
  // stencil: 模板缓冲区
  // 用于遮罩、描边等高级效果
  // 如果不用可以关闭以节省内存
  stencil: true,
  
  // logarithmicDepthBuffer: 对数深度缓冲
  // 解决大场景中的深度冲突问题（Z-fighting）
  // 但会影响性能
  logarithmicDepthBuffer: false,
  
  // preserveDrawingBuffer: 保留绘图缓冲区
  // true: 可以截图（toDataURL）
  // false: 性能更好（默认）
  preserveDrawingBuffer: false,
  
  // ========================================
  // 性能设置
  // ========================================
  
  // powerPreference: 电源偏好
  // 'high-performance': 使用独立显卡（如果有）
  // 'low-power': 使用集成显卡，省电
  // 'default': 让浏览器决定
  powerPreference: 'high-performance',
  
  // failIfMajorPerformanceCaveat: 性能警告时是否失败
  // true: 如果性能不佳，创建失败
  // false: 即使性能不佳也继续（默认）
  failIfMajorPerformanceCaveat: false
});

// ============================================
// 渲染器的基本设置
// ============================================

// 设置渲染大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 设置像素比（适配高清屏）
// Math.min限制最大值，避免过高的像素比影响性能
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 设置清除颜色（背景色）
renderer.setClearColor(0x000000, 1);  // 颜色, 透明度

// 或者分开设置
renderer.setClearColor(0x000000);
renderer.setClearAlpha(1);

// 将canvas添加到页面
document.body.appendChild(renderer.domElement);

// ============================================
// 输出颜色空间设置
// ============================================
/*
 * 颜色空间影响颜色的显示方式
 * 
 * sRGB: 标准显示器颜色空间，颜色看起来"正确"
 * LinearSRGB: 线性颜色空间，用于物理正确的光照计算
 * 
 * 推荐：使用sRGB输出
 */
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ============================================
// 色调映射（Tone Mapping）
// ============================================
/*
 * 色调映射将HDR（高动态范围）颜色转换为
 * 显示器能显示的LDR（低动态范围）颜色
 * 
 * 对于使用HDR环境贴图或物理正确光照的场景很重要
 */

// 无色调映射（默认）
renderer.toneMapping = THREE.NoToneMapping;

// 线性色调映射
renderer.toneMapping = THREE.LinearToneMapping;

// Reinhard色调映射（柔和）
renderer.toneMapping = THREE.ReinhardToneMapping;

// Cineon色调映射（电影感）
renderer.toneMapping = THREE.CineonToneMapping;

// ACES Filmic色调映射（推荐，电影级效果）
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// 曝光度（配合色调映射使用）
renderer.toneMappingExposure = 1.0;  // 1是正常，>1更亮，<1更暗
```

### 2.3.2 阴影设置详解

```javascript
// ================================================================
// 阴影设置详解
// ================================================================

/*
 * 阴影可以大大增加场景的真实感
 * 但也会消耗较多性能
 * 
 * 阴影的工作原理：
 * 1. 从光源视角渲染场景到一张深度贴图（阴影贴图）
 * 2. 渲染场景时，检查每个像素是否在阴影中
 */

// ============================================
// 启用阴影
// ============================================
renderer.shadowMap.enabled = true;

// ============================================
// 阴影类型
// ============================================
/*
 * BasicShadowMap: 
 *   - 最基本的阴影，有明显的锯齿
 *   - 性能最好
 * 
 * PCFShadowMap（默认）:
 *   - PCF = Percentage-Closer Filtering
 *   - 使用滤波使阴影边缘更柔和
 *   - 性能和质量的平衡
 * 
 * PCFSoftShadowMap:
 *   - 更柔和的PCF
 *   - 阴影边缘更加模糊
 *   - 性能比PCFShadowMap稍差
 * 
 * VSMShadowMap:
 *   - VSM = Variance Shadow Map
 *   - 可以实现非常柔和的阴影
 *   - 但可能有光晕问题
 *   - 需要特殊设置
 */

renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.type = THREE.VSMShadowMap;

// 推荐使用PCFSoftShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ============================================
// 光源阴影设置（以DirectionalLight为例）
// ============================================
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);

// 开启光源的阴影投射
light.castShadow = true;

// 阴影贴图大小
// 越大越清晰，但消耗更多显存和性能
// 必须是2的幂：256, 512, 1024, 2048, 4096
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;

// 阴影相机范围
// DirectionalLight使用正交相机
// 范围越小，阴影越精细
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.bottom = -20;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;

// 阴影偏移（解决阴影失真/条纹问题）
/*
 * bias: 深度偏移
 *   - 负值可以减少"阴影痘"（shadow acne）
 *   - 太大会导致阴影与物体分离（Peter Panning）
 *   - 推荐从-0.0001开始调整
 * 
 * normalBias: 法线方向偏移
 *   - 沿法线方向偏移
 *   - 对曲面效果更好
 */
light.shadow.bias = -0.0001;
light.shadow.normalBias = 0.02;

// 阴影半径（仅VSMShadowMap有效）
light.shadow.radius = 4;

scene.add(light);

// 添加阴影相机辅助器（调试用）
const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(shadowCameraHelper);

// ============================================
// 物体阴影设置
// ============================================

// 物体投射阴影
mesh.castShadow = true;

// 物体接收阴影
mesh.receiveShadow = true;

// 地面通常只接收阴影
ground.castShadow = false;
ground.receiveShadow = true;

// ============================================
// 优化阴影性能
// ============================================

// 1. 只有需要的物体才投射/接收阴影
scene.traverse((object) => {
  if (object.isMesh) {
    // 小物体不投射阴影
    if (object.geometry.boundingSphere?.radius < 0.5) {
      object.castShadow = false;
    }
  }
});

// 2. 关闭不需要时的阴影
light.castShadow = false;  // 暂时关闭

// 3. 减小阴影贴图大小
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

// 4. 减小阴影相机范围
// 只覆盖需要阴影的区域

// 5. 使用烘焙阴影（静态场景）
// 将阴影预先渲染到纹理上
```

### 2.3.3 渲染循环和性能监控

```javascript
// ================================================================
// 渲染循环和性能监控
// ================================================================

// ============================================
// 基本渲染循环
// ============================================
function animate() {
  requestAnimationFrame(animate);
  
  // 更新场景
  // ...
  
  // 渲染
  renderer.render(scene, camera);
}
animate();

// ============================================
// 使用Clock进行时间管理
// ============================================
/*
 * Clock可以提供精确的时间信息
 * 用于创建与帧率无关的动画
 */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // getDelta(): 获取上一帧到这一帧的时间间隔（秒）
  const delta = clock.getDelta();
  
  // getElapsedTime(): 获取从启动到现在的总时间（秒）
  const elapsed = clock.getElapsedTime();
  
  // 使用delta实现帧率无关的动画
  // 无论帧率是30还是60，旋转速度都相同
  mesh.rotation.y += 1 * delta;  // 每秒旋转1弧度
  
  // 使用elapsed实现基于时间的动画
  mesh.position.y = Math.sin(elapsed) * 2;  // 上下浮动
  
  renderer.render(scene, camera);
}

// ============================================
// 性能监控 - Stats.js
// ============================================
/*
 * Stats.js显示FPS、内存使用等信息
 */
import Stats from 'three/addons/libs/stats.module.js';

const stats = new Stats();
stats.showPanel(0);  // 0: FPS, 1: MS, 2: MB
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();  // 开始计时
  
  // 渲染代码...
  renderer.render(scene, camera);
  
  stats.end();  // 结束计时
  
  requestAnimationFrame(animate);
}

// ============================================
// 渲染器信息
// ============================================
/*
 * renderer.info包含有用的渲染统计信息
 */
function logRendererInfo() {
  console.log('内存使用:');
  console.log('  几何体数量:', renderer.info.memory.geometries);
  console.log('  纹理数量:', renderer.info.memory.textures);
  
  console.log('渲染统计:');
  console.log('  绘制调用次数:', renderer.info.render.calls);
  console.log('  三角形数量:', renderer.info.render.triangles);
  console.log('  点数量:', renderer.info.render.points);
  console.log('  线数量:', renderer.info.render.lines);
  
  console.log('程序数量:', renderer.info.programs.length);
}

// 重置统计（每帧开始时）
renderer.info.reset();

// ============================================
// 按需渲染（节省电量）
// ============================================
/*
 * 如果场景是静态的，没必要每帧都渲染
 * 只在需要时渲染可以节省电量和性能
 */
let needsRender = true;

// 当场景变化时标记需要渲染
function markNeedsRender() {
  needsRender = true;
}

// 监听控制器变化
controls.addEventListener('change', markNeedsRender);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  
  // 只在需要时渲染
  if (needsRender) {
    renderer.render(scene, camera);
    needsRender = false;
  }
}

// ============================================
// 限制帧率
// ============================================
/*
 * 有时候不需要60fps，限制帧率可以节省性能
 */
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;
let lastTime = 0;

function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const deltaTime = currentTime - lastTime;
  
  if (deltaTime >= frameInterval) {
    lastTime = currentTime - (deltaTime % frameInterval);
    
    // 渲染
    renderer.render(scene, camera);
  }
}
animate(0);

// ============================================
// 截图功能
// ============================================
/*
 * 需要在创建渲染器时设置 preserveDrawingBuffer: true
 */
function takeScreenshot() {
  // 确保已渲染
  renderer.render(scene, camera);
  
  // 获取数据URL
  const dataURL = renderer.domElement.toDataURL('image/png');
  
  // 创建下载链接
  const link = document.createElement('a');
  link.download = 'screenshot.png';
  link.href = dataURL;
  link.click();
}

// ============================================
// 销毁渲染器
// ============================================
/*
 * 当不再需要渲染器时，应该正确销毁以释放资源
 */
function disposeRenderer() {
  // 停止渲染循环
  cancelAnimationFrame(animationId);
  
  // 销毁渲染器
  renderer.dispose();
  
  // 强制丢失WebGL上下文
  renderer.forceContextLoss();
  
  // 移除canvas
  renderer.domElement.remove();
  
  // 清空引用
  renderer.domElement = null;
}
```

---

# 第三部分：几何体完全指南

## 3.1 几何体基础概念

### 3.1.1 什么是几何体？

```javascript
// ================================================================
// 几何体（Geometry）基础概念
// ================================================================

/*
 * 几何体定义了3D物体的"形状"
 * 
 * 一个几何体由以下元素组成：
 * 
 * 1. 顶点（Vertices）
 *    - 3D空间中的点
 *    - 每个顶点有x, y, z坐标
 *    - 例如：立方体有8个顶点
 * 
 * 2. 面（Faces）
 *    - 由顶点连接形成的平面
 *    - 在WebGL中，所有面都是三角形
 *    - 例如：立方体有6个面，每个面由2个三角形组成，共12个三角形
 * 
 * 3. 法线（Normals）
 *    - 垂直于面的向量
 *    - 用于计算光照
 *    - 决定了面的"朝向"
 * 
 * 4. UV坐标
 *    - 纹理贴图的映射坐标
 *    - 决定纹理如何贴到表面上
 * 
 *           顶点
 *             *
 *            /|\
 *           / | \
 *          /  |  \   ← 面（三角形）
 *         /   |   \
 *        *----+----*
 *           法线↑
 */

// ============================================
// BufferGeometry vs Geometry
// ============================================
/*
 * 在Three.js的旧版本中有两种几何体：
 * - Geometry：易于理解和修改，但性能较差
 * - BufferGeometry：直接使用显卡缓冲区，性能好
 * 
 * 从Three.js r125开始，Geometry已被移除
 * 现在只使用BufferGeometry
 * 
 * 所有内置几何体（如BoxGeometry）都是BufferGeometry的子类
 */

// 内置几何体示例
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// 检查类型
console.log(boxGeometry.isBufferGeometry);  // true

// ============================================
// 几何体的基本属性
// ============================================
const geometry = new THREE.BoxGeometry(1, 1, 1);

// attributes: 存储顶点数据
console.log(geometry.attributes);
// {
//   position: BufferAttribute,  // 顶点位置
//   normal: BufferAttribute,    // 顶点法线
//   uv: BufferAttribute         // UV坐标
// }

// 获取顶点数量
const vertexCount = geometry.attributes.position.count;
console.log('顶点数量:', vertexCount);

// index: 索引（如果有）
// 索引指定了哪些顶点组成三角形
console.log(geometry.index);

// boundingBox: 包围盒
geometry.computeBoundingBox();
console.log('包围盒:', geometry.boundingBox);

// boundingSphere: 包围球
geometry.computeBoundingSphere();
console.log('包围球:', geometry.boundingSphere);

// ============================================
// 几何体的复用
// ============================================
/*
 * 重要：一个几何体可以被多个Mesh共用
 * 这样可以节省内存
 */

// 创建一个几何体
const sharedGeometry = new THREE.SphereGeometry(1, 32, 32);

// 多个Mesh使用同一个几何体
const mesh1 = new THREE.Mesh(sharedGeometry, material1);
const mesh2 = new THREE.Mesh(sharedGeometry, material2);
const mesh3 = new THREE.Mesh(sharedGeometry, material3);

// mesh1, mesh2, mesh3共享同一个几何体
// 但可以有不同的位置、旋转、缩放和材质
```

### 3.1.2 几何体的分段（Segments）

```javascript
// ================================================================
// 几何体的分段（Segments）详解
// ================================================================

/*
 * 分段决定了几何体的"精细程度"
 * 
 * 分段数越多：
 * - 表面越平滑（特别是曲面）
 * - 顶点数越多
 * - 消耗更多内存和性能
 * 
 * 分段数越少：
 * - 表面越粗糙
 * - 顶点数越少
 * - 性能更好
 * 
 * 选择分段数的原则：
 * 1. 平面几何体（立方体、平面）：通常1就够了
 * 2. 曲面几何体（球体、圆柱）：根据物体大小和观察距离
 * 3. 如果需要变形动画，需要更多分段
 */

// ============================================
// 球体分段对比
// ============================================
/*
 *   8分段          32分段          128分段
 *   
 *    /\             .--.            .---.
 *   /  \           /    \          /     \
 *  |    |         |      |        |       |
 *   \  /           \    /          \     /
 *    \/             '--'            '---'
 *   
 *  有明显棱角      较平滑          非常平滑
 *  96顶点        2048顶点        32768顶点
 */

// 低分段（游戏、大量物体）
const lowPolySphere = new THREE.SphereGeometry(1, 8, 8);

// 中等分段（一般用途）
const mediumSphere = new THREE.SphereGeometry(1, 32, 32);

// 高分段（近距离展示、动画变形）
const highPolySphere = new THREE.SphereGeometry(1, 128, 128);

// ============================================
// 查看几何体的复杂度
// ============================================
function logGeometryInfo(geometry, name) {
  const positionAttribute = geometry.attributes.position;
  const vertexCount = positionAttribute.count;
  
  // 三角形数量
  let triangleCount;
  if (geometry.index) {
    triangleCount = geometry.index.count / 3;
  } else {
    triangleCount = vertexCount / 3;
  }
  
  console.log(`${name}:`);
  console.log(`  顶点数: ${vertexCount}`);
  console.log(`  三角形数: ${triangleCount}`);
}

logGeometryInfo(lowPolySphere, '低分段球体');
logGeometryInfo(mediumSphere, '中分段球体');
logGeometryInfo(highPolySphere, '高分段球体');
```

---

## 3.2 内置几何体详解

### 3.2.1 立方体 BoxGeometry

```javascript
// ================================================================
// 立方体 BoxGeometry 详解
// ================================================================

/*
 * BoxGeometry是最常用的几何体之一
 * 可以创建立方体、长方体、扁盒子等
 * 
 * 参数说明：
 * - width: X轴方向的宽度
 * - height: Y轴方向的高度
 * - depth: Z轴方向的深度
 * - widthSegments: 宽度方向的分段数
 * - heightSegments: 高度方向的分段数
 * - depthSegments: 深度方向的分段数
 */

// 基本立方体
const cube = new THREE.BoxGeometry(
  1,    // width - 宽度
  1,    // height - 高度
  1     // depth - 深度
);

// 长方体
const box = new THREE.BoxGeometry(
  2,    // 宽2
  1,    // 高1
  0.5   // 深0.5
);

// 带分段的立方体（用于变形动画）
const segmentedCube = new THREE.BoxGeometry(
  1, 1, 1,  // 尺寸
  4, 4, 4   // 每个方向4个分段
);

// ============================================
// 使用场景
// ============================================

// 1. 建筑物
const building = new THREE.Mesh(
  new THREE.BoxGeometry(10, 30, 10),
  new THREE.MeshStandardMaterial({ color: 0x808080 })
);
building.position.y = 15;  // 将底部放在地面上

// 2. 地面/平台
const platform = new THREE.Mesh(
  new THREE.BoxGeometry(20, 0.5, 20),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);

// 3. 墙壁
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(10, 3, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);

// ============================================
// 技巧：改变立方体的中心点
// ============================================
/*
 * 默认情况下，立方体的中心在几何中心
 * 有时候我们需要中心在底部（比如建筑物）
 */

// 方法1：移动几何体的顶点
const buildingGeometry = new THREE.BoxGeometry(1, 2, 1);
buildingGeometry.translate(0, 1, 0);  // 将几何体向上移动1单位

const buildingMesh = new THREE.Mesh(buildingGeometry, material);
// 现在buildingMesh.position.y = 0时，底部正好在地面上

// 方法2：在创建后调整（推荐）
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  material
);
mesh.geometry.translate(0, 1, 0);  // 同样效果
```

### 3.2.2 球体 SphereGeometry

```javascript
// ================================================================
// 球体 SphereGeometry 详解
// ================================================================

/*
 * SphereGeometry创建球体或球体的一部分
 * 
 * 参数说明：
 * - radius: 半径
 * - widthSegments: 水平方向分段数（经线）
 * - heightSegments: 垂直方向分段数（纬线）
 * - phiStart: 水平方向起始角度
 * - phiLength: 水平方向扫描角度
 * - thetaStart: 垂直方向起始角度
 * - thetaLength: 垂直方向扫描角度
 */

// 基本球体
const sphere = new THREE.SphereGeometry(
  1,    // 半径
  32,   // 水平分段
  32    // 垂直分段
);

// ============================================
// 分段数的选择
// ============================================

// 远处的小球：低分段
const distantSphere = new THREE.SphereGeometry(1, 16, 16);

// 近处的大球：高分段
const closeSphere = new THREE.SphereGeometry(1, 64, 64);

// 需要变形的球：更高分段
const morphSphere = new THREE.SphereGeometry(1, 128, 128);

// ============================================
// 创建半球
// ============================================

// 上半球
const upperHemisphere = new THREE.SphereGeometry(
  1,           // 半径
  32, 32,      // 分段
  0,           // phiStart: 水平起始角度
  Math.PI * 2, // phiLength: 水平扫描360度
  0,           // thetaStart: 从顶部开始
  Math.PI / 2  // thetaLength: 扫描90度（半球）
);

// 下半球
const lowerHemisphere = new THREE.SphereGeometry(
  1,
  32, 32,
  0,
  Math.PI * 2,
  Math.PI / 2,  // 从赤道开始
  Math.PI / 2   // 扫描90度
);

// ============================================
// 创建球体切片
// ============================================

// 1/4球体（西瓜切片）
const quarterSphere = new THREE.SphereGeometry(
  1,
  32, 32,
  0,           // 从0度开始
  Math.PI / 2  // 只扫描90度
);

// ============================================
// 使用场景
// ============================================

// 1. 地球
const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load('earth.jpg')
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

// 2. 气泡/水滴
const bubbleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const bubbleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,
  roughness: 0,
  thickness: 0.5
});
const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);

// 3. 粒子球（用于背景星空）
function createStarField() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    // 在球面上随机分布
    const radius = 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  return new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
  );
}
```

### 3.2.3 平面 PlaneGeometry

```javascript
// ================================================================
// 平面 PlaneGeometry 详解
// ================================================================

/*
 * PlaneGeometry创建一个平面
 * 默认在XY平面上，面向Z轴正方向
 * 
 * 参数说明：
 * - width: X方向宽度
 * - height: Y方向高度
 * - widthSegments: 宽度分段
 * - heightSegments: 高度分段
 */

// 基本平面
const plane = new THREE.PlaneGeometry(
  10,   // 宽度
  10    // 高度
);

// 带分段的平面（用于地形）
const terrainPlane = new THREE.PlaneGeometry(
  100, 100,  // 尺寸
  50, 50     // 分段数
);

// ============================================
// 创建地面
// ============================================

// 平面默认是垂直的（面向Z轴）
// 要作为地面，需要旋转90度
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;  // 绕X轴旋转-90度
ground.receiveShadow = true;

// ============================================
// 创建简单地形
// ============================================

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
  const positions = geometry.attributes.position;
  
  // 修改顶点高度创建起伏
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    
    // 使用噪声函数（这里用简单的sin）
    const z = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 5;
    
    positions.setZ(i, z);
  }
  
  // 重新计算法线（重要！）
  geometry.computeVertexNormals();
  
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0x228B22,
      wireframe: false
    })
  );
  
  mesh.rotation.x = -Math.PI / 2;
  
  return mesh;
}

// ============================================
// 双面平面
// ============================================
/*
 * 默认平面只有一面可见
 * 如果需要双面可见，需要设置材质的side属性
 */

const doubleSidedPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide  // 双面可见
  })
);

// ============================================
// 使用场景
// ============================================

// 1. 视频播放屏幕
const videoTexture = new THREE.VideoTexture(videoElement);
const screen = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 9),  // 16:9比例
  new THREE.MeshBasicMaterial({ map: videoTexture })
);

// 2. 图片/海报
const poster = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 3),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load('poster.jpg')
  })
);

// 3. 镜子
const mirror = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 2),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0
  })
);
```

### 3.2.4 圆形和圆环 CircleGeometry & RingGeometry

```javascript
// ================================================================
// 圆形 CircleGeometry
// ================================================================

/*
 * CircleGeometry创建一个填充的圆形
 * 
 * 参数说明：
 * - radius: 半径
 * - segments: 分段数（决定圆的平滑度）
 * - thetaStart: 起始角度
 * - thetaLength: 扫描角度
 */

// 基本圆形
const circle = new THREE.CircleGeometry(
  1,    // 半径
  32    // 分段数
);

// 扇形
const sector = new THREE.CircleGeometry(
  1,
  32,
  0,            // 从0度开始
  Math.PI / 2   // 扫描90度
);

// 半圆
const semicircle = new THREE.CircleGeometry(
  1,
  32,
  0,
  Math.PI       // 扫描180度
);

// ============================================
// 使用场景
// ============================================

// 1. 阴影贴花（放在地面上的假阴影）
const shadowDecal = new THREE.Mesh(
  new THREE.CircleGeometry(1, 32),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  })
);
shadowDecal.rotation.x = -Math.PI / 2;
shadowDecal.position.y = 0.01;  // 稍微高于地面，避免z-fighting

// 2. 饼图
function createPieChart(data, colors) {
  const group = new THREE.Group();
  let startAngle = 0;
  const total = data.reduce((sum, value) => sum + value, 0);
  
  data.forEach((value, index) => {
    const angle = (value / total) * Math.PI * 2;
    
    const geometry = new THREE.CircleGeometry(1, 32, startAngle, angle);
    const material = new THREE.MeshBasicMaterial({ color: colors[index] });
    const slice = new THREE.Mesh(geometry, material);
    
    group.add(slice);
    startAngle += angle;
  });
  
  return group;
}

// ================================================================
// 圆环 RingGeometry
// ================================================================

/*
 * RingGeometry创建一个圆环（甜甜圈形状的平面）
 * 
 * 参数说明：
 * - innerRadius: 内半径
 * - outerRadius: 外半径
 * - thetaSegments: 圆周分段数
 * - phiSegments: 径向分段数
 * - thetaStart: 起始角度
 * - thetaLength: 扫描角度
 */

// 基本圆环
const ring = new THREE.RingGeometry(
  0.5,  // 内半径
  1,    // 外半径
  32    // 分段数
);

// 宽圆环
const wideRing = new THREE.RingGeometry(
  0.2,  // 小内半径
  1,    // 外半径
  32,
  1     // 径向分段（圆环有多少层）
);

// 圆环扇形
const ringSector = new THREE.RingGeometry(
  0.5,
  1,
  32,
  1,
  0,
  Math.PI / 2  // 只有1/4
);

// ============================================
// 使用场景
// ============================================

// 1. 行星环（土星环）
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(1.5, 2.5, 64),
  new THREE.MeshBasicMaterial({
    color: 0xccaa66,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  })
);
saturnRing.rotation.x = Math.PI / 2;

// 2. 进度环
function createProgressRing(progress) {
  const geometry = new THREE.RingGeometry(
    0.8,
    1,
    32,
    1,
    -Math.PI / 2,  // 从顶部开始
    Math.PI * 2 * progress  // 根据进度
  );
  
  return new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
}

// 3. 光环效果
const halo = new THREE.Mesh(
  new THREE.RingGeometry(0.9, 1.1, 64),
  new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
);
```

### 3.2.5 圆柱体和圆锥 CylinderGeometry & ConeGeometry

```javascript
// ================================================================
// 圆柱体 CylinderGeometry
// ================================================================

/*
 * CylinderGeometry创建圆柱体
 * 通过调整顶部和底部半径，还可以创建圆锥、圆台等
 * 
 * 参数说明：
 * - radiusTop: 顶部半径
 * - radiusBottom: 底部半径
 * - height: 高度
 * - radialSegments: 圆周分段数
 * - heightSegments: 高度分段数
 * - openEnded: 是否开口（不渲染顶部和底部）
 * - thetaStart: 起始角度
 * - thetaLength: 扫描角度
 */

// 基本圆柱
const cylinder = new THREE.CylinderGeometry(
  1,    // 顶部半径
  1,    // 底部半径
  2,    // 高度
  32    // 圆周分段
);

// 圆台（截顶圆锥）
const frustum = new THREE.CylinderGeometry(
  0.5,  // 顶部半径（小）
  1,    // 底部半径（大）
  2,
  32
);

// 圆锥（顶部半径为0）
const coneFromCylinder = new THREE.CylinderGeometry(
  0,    // 顶部半径为0
  1,    // 底部半径
  2,
  32
);

// 开口圆柱（管状）
const tube = new THREE.CylinderGeometry(
  1, 1, 2, 32, 1,
  true  // openEnded = true
);

// 半圆柱
const halfCylinder = new THREE.CylinderGeometry(
  1, 1, 2, 32, 1,
  false,
  0,
  Math.PI  // 只扫描180度
);

// ============================================
// 使用场景
// ============================================

// 1. 柱子/柱基
const pillar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 5, 32),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
pillar.position.y = 2.5;

// 2. 树干
const trunk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.3, 2, 8),
  new THREE.MeshStandardMaterial({ color: 0x8B4513 })
);
trunk.position.y = 1;

// 3. 轮子
const wheel = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
wheel.rotation.z = Math.PI / 2;  // 横放

// 4. 管道（开口圆柱）
const pipe = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 3, 32, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0x888888,
    side: THREE.DoubleSide
  })
);

// ================================================================
// 圆锥 ConeGeometry
// ================================================================

/*
 * ConeGeometry是CylinderGeometry的快捷方式
 * 自动将顶部半径设为0
 * 
 * 参数说明：
 * - radius: 底部半径
 * - height: 高度
 * - radialSegments: 圆周分段
 * - heightSegments: 高度分段
 * - openEnded: 是否开口
 * - thetaStart: 起始角度
 * - thetaLength: 扫描角度
 */

// 基本圆锥
const cone = new THREE.ConeGeometry(
  1,    // 底部半径
  2,    // 高度
  32    // 分段
);

// ============================================
// 使用场景
// ============================================

// 1. 简单的树
const treeTop = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 8),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
treeTop.position.y = 3;

// 2. 箭头指示器
const arrowHead = new THREE.Mesh(
  new THREE.ConeGeometry(0.2, 0.5, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// 3. 圣诞树（多层圆锥）
function createChristmasTree() {
  const tree = new THREE.Group();
  
  // 树干
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  trunk.position.y = 0.25;
  tree.add(trunk);
  
  // 三层树冠
  const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  
  for (let i = 0; i < 3; i++) {
    const radius = 1.2 - i * 0.3;
    const height = 1;
    const y = 0.5 + i * 0.7;
    
    const layer = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, 16),
      treeMaterial
    );
    layer.position.y = y;
    tree.add(layer);
  }
  
  return tree;
}
```

### 3.2.6 圆环体 TorusGeometry

```javascript
// ================================================================
// 圆环体 TorusGeometry
// ================================================================

/*
 * TorusGeometry创建甜甜圈形状
 * 
 * 参数说明：
 * - radius: 圆环的主半径（中心到管道中心的距离）
 * - tube: 管道的半径
 * - radialSegments: 管道截面的分段数
 * - tubularSegments: 圆环方向的分段数
 * - arc: 圆环的弧度（默认2π，完整圆环）
 * 
 *        ←  radius  →
 *     ╭───────────────╮
 *    │   ◯       ◯   │  ← tube
 *    │       ×       │  × = 中心
 *    │   ◯       ◯   │
 *     ╰───────────────╯
 */

// 基本圆环体
const torus = new THREE.TorusGeometry(
  1,    // radius: 主半径
  0.3,  // tube: 管道半径
  16,   // radialSegments: 管道截面分段
  100   // tubularSegments: 圆环分段
);

// 粗圆环（管道粗）
const thickTorus = new THREE.TorusGeometry(1, 0.5, 16, 100);

// 细圆环（管道细）
const thinTorus = new THREE.TorusGeometry(1, 0.1, 16, 100);

// 半圆环
const halfTorus = new THREE.TorusGeometry(
  1, 0.3, 16, 50,
  Math.PI  // 只有半圈
);

// ============================================
// 使用场景
// ============================================

// 1. 甜甜圈
const donut = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xf4a460 })
);

// 2. 戒指
const ringJewelry = new THREE.Mesh(
  new THREE.TorusGeometry(0.8, 0.1, 16, 100),
  new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 1,
    roughness: 0.2
  })
);

// 3. 轮胎
const tire = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
tire.rotation.x = Math.PI / 2;

// ================================================================
// 圆环结 TorusKnotGeometry
// ================================================================

/*
 * TorusKnotGeometry创建复杂的结状环形
 * 
 * 参数说明：
 * - radius: 整体半径
 * - tube: 管道半径
 * - tubularSegments: 管道分段
 * - radialSegments: 截面分段
 * - p: 几何参数p
 * - q: 几何参数q
 * 
 * p和q决定了结的形状：
 * p=2, q=3: 三叶结（默认）
 * p=3, q=2: 三叶结的另一种形式
 * p=2, q=5: 五叶结
 */

// 基本圆环结
const torusKnot = new THREE.TorusKnotGeometry(
  1,    // radius
  0.3,  // tube
  100,  // tubularSegments
  16,   // radialSegments
  2,    // p
  3     // q
);

// 不同形状的结
const knot23 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 3);
const knot32 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 3, 2);
const knot25 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 5);

// ============================================
// 使用场景
// ============================================

// 1. 装饰性物体
const decoration = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.2, 100, 16, 3, 4),
  new THREE.MeshStandardMaterial({
    color: 0xff69b4,
    metalness: 0.3,
    roughness: 0.5
  })
);

// 2. 加载动画
function createLoadingSpinner() {
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.5, 0.15, 64, 16, 2, 3),
    new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true })
  );
  
  function animate() {
    knot.rotation.x += 0.01;
    knot.rotation.y += 0.02;
  }
  
  return { mesh: knot, animate };
}
```

### 3.2.7 多面体 Polyhedron Geometries

```javascript
// ================================================================
// 多面体几何体
// ================================================================

/*
 * Three.js提供了几种正多面体
 * 它们都是由等边多边形组成的立体图形
 */

// ============================================
// 四面体 TetrahedronGeometry
// ============================================
/*
 * 4个面，每面是等边三角形
 * 最简单的多面体
 */
const tetrahedron = new THREE.TetrahedronGeometry(
  1,    // radius: 外接球半径
  0     // detail: 细分级别（0=不细分）
);

// 细分后更接近球体
const smoothTetra = new THREE.TetrahedronGeometry(1, 2);

// ============================================
// 八面体 OctahedronGeometry
// ============================================
/*
 * 8个面，每面是等边三角形
 * 像两个金字塔底对底
 */
const octahedron = new THREE.OctahedronGeometry(
  1,    // radius
  0     // detail
);

// ============================================
// 十二面体 DodecahedronGeometry
// ============================================
/*
 * 12个面，每面是正五边形
 */
const dodecahedron = new THREE.DodecahedronGeometry(
  1,    // radius
  0     // detail
);

// ============================================
// 二十面体 IcosahedronGeometry
// ============================================
/*
 * 20个面，每面是等边三角形
 * 常用于创建低面数球体
 */
const icosahedron = new THREE.IcosahedronGeometry(
  1,    // radius
  0     // detail
);

// 细分的二十面体 = 球体的另一种实现
const icoSphere = new THREE.IcosahedronGeometry(1, 3);

// ============================================
// detail参数详解
// ============================================
/*
 * detail参数控制细分级别
 * 每增加1级，每个三角形被分成4个
 * 
 * detail=0: 原始多面体
 * detail=1: 每个三角形分成4个
 * detail=2: 每个三角形分成16个
 * detail=3: 每个三角形分成64个
 * ...
 * 
 * 高detail值可以创建平滑的球体
 */

// 对比不同detail级别
const ico0 = new THREE.IcosahedronGeometry(1, 0);  // 20面
const ico1 = new THREE.IcosahedronGeometry(1, 1);  // 80面
const ico2 = new THREE.IcosahedronGeometry(1, 2);  // 320面
const ico3 = new THREE.IcosahedronGeometry(1, 3);  // 1280面

// ============================================
// 使用场景
// ============================================

// 1. 骰子（八面骰）
const d8 = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.5, 0),
  new THREE.MeshStandardMaterial({ color: 0x2255cc })
);

// 2. 低多边形风格
const lowPolyPlanet = new THREE.Mesh(
  new THREE.IcosahedronGeometry(2, 1),
  new THREE.MeshStandardMaterial({
    color: 0x44aa44,
    flatShading: true  // 平面着色，保持低多边形感觉
  })
);

// 3. 宝石
const gem = new THREE.Mesh(
  new THREE.DodecahedronGeometry(0.5, 0),
  new THREE.MeshPhysicalMaterial({
    color: 0xff0066,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.5
  })
);
```

---

## 3.3 创建自定义几何体

### 3.3.1 BufferGeometry基础

```javascript
// ================================================================
// 自定义BufferGeometry基础
// ================================================================

/*
 * BufferGeometry直接使用GPU缓冲区存储数据
 * 是Three.js中最底层的几何体表示方式
 * 
 * 核心概念：
 * 1. 顶点属性（Attributes）：每个顶点的数据
 * 2. 缓冲区（Buffer）：存储属性数据的数组
 * 3. 索引（Index）：可选，指定如何连接顶点
 */

// ============================================
// 创建一个简单的三角形
// ============================================

const triangleGeometry = new THREE.BufferGeometry();

// 定义3个顶点的位置（每个顶点3个值：x, y, z）
const vertices = new Float32Array([
  0.0,  1.0, 0.0,   // 顶点0：顶部
 -1.0, -1.0, 0.0,   // 顶点1：左下
  1.0, -1.0, 0.0    // 顶点2：右下
]);

// 创建位置属性
// 第二个参数3表示每3个值为一组（xyz）
triangleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3)
);

// 创建网格
const triangle = new THREE.Mesh(
  triangleGeometry,
  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
);

// ============================================
// 添加更多顶点属性
// ============================================

// 法线（用于光照计算）
const normals = new Float32Array([
  0, 0, 1,  // 顶点0的法线
  0, 0, 1,  // 顶点1的法线
  0, 0, 1   // 顶点2的法线
]);
triangleGeometry.setAttribute(
  'normal',
  new THREE.BufferAttribute(normals, 3)
);

// UV坐标（用于纹理映射）
const uvs = new Float32Array([
  0.5, 1.0,  // 顶点0的UV
  0.0, 0.0,  // 顶点1的UV
  1.0, 0.0   // 顶点2的UV
]);
triangleGeometry.setAttribute(
  'uv',
  new THREE.BufferAttribute(uvs, 2)  // UV是2D的
);

// 顶点颜色
const colors = new Float32Array([
  1, 0, 0,  // 顶点0：红色
  0, 1, 0,  // 顶点1：绿色
  0, 0, 1   // 顶点2：蓝色
]);
triangleGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
);

// 使用顶点颜色
const coloredMaterial = new THREE.MeshBasicMaterial({
  vertexColors: true,  // 启用顶点颜色
  side: THREE.DoubleSide
});

// ============================================
// 创建一个正方形（两个三角形）
// ============================================

const squareGeometry = new THREE.BufferGeometry();

// 方法1：6个顶点（两个三角形，顶点不共享）
const squareVertices1 = new Float32Array([
  // 第一个三角形
  -1, -1, 0,
   1, -1, 0,
   1,  1, 0,
  // 第二个三角形
  -1, -1, 0,
   1,  1, 0,
  -1,  1, 0
]);

// 方法2：使用索引（顶点共享，更高效）
const squareVertices2 = new Float32Array([
  -1, -1, 0,  // 0: 左下
   1, -1, 0,  // 1: 右下
   1,  1, 0,  // 2: 右上
  -1,  1, 0   // 3: 左上
]);

const squareIndices = new Uint16Array([
  0, 1, 2,  // 第一个三角形
  0, 2, 3   // 第二个三角形
]);

squareGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(squareVertices2, 3)
);
squareGeometry.setIndex(new THREE.BufferAttribute(squareIndices, 1));

// 自动计算法线
squareGeometry.computeVertexNormals();

// ============================================
// 索引的好处
// ============================================
/*
 * 不使用索引：
 * - 6个顶点 × 3个值 = 18个float
 * - 每个顶点数据都要重复
 * 
 * 使用索引：
 * - 4个顶点 × 3个值 = 12个float
 * - 6个索引值 = 6个uint16
 * - 节省内存，特别是当顶点有多个属性时
 * - 对于复杂模型，索引可以节省大量内存
 */
```

### 3.3.2 创建复杂的自定义几何体

```javascript
// ================================================================
// 创建自定义立方体
// ================================================================

function createCustomCube(size = 1) {
  const geometry = new THREE.BufferGeometry();
  const halfSize = size / 2;
  
  // 8个顶点（但因为每个顶点在不同面上有不同的法线，实际需要24个）
  // 每个面4个顶点 × 6个面 = 24个顶点
  const positions = new Float32Array([
    // 前面 (z = +halfSize)
    -halfSize, -halfSize,  halfSize,
     halfSize, -halfSize,  halfSize,
     halfSize,  halfSize,  halfSize,
    -halfSize,  halfSize,  halfSize,
    
    // 后面 (z = -halfSize)
     halfSize, -halfSize, -halfSize,
    -halfSize, -halfSize, -halfSize,
    -halfSize,  halfSize, -halfSize,
     halfSize,  halfSize, -halfSize,
    
    // 上面 (y = +halfSize)
    -halfSize,  halfSize,  halfSize,
     halfSize,  halfSize,  halfSize,
     halfSize,  halfSize, -halfSize,
    -halfSize,  halfSize, -halfSize,
    
    // 下面 (y = -halfSize)
    -halfSize, -halfSize, -halfSize,
     halfSize, -halfSize, -halfSize,
     halfSize, -halfSize,  halfSize,
    -halfSize, -halfSize,  halfSize,
    
    // 右面 (x = +halfSize)
     halfSize, -halfSize,  halfSize,
     halfSize, -halfSize, -halfSize,
     halfSize,  halfSize, -halfSize,
     halfSize,  halfSize,  halfSize,
    
    // 左面 (x = -halfSize)
    -halfSize, -halfSize, -halfSize,
    -halfSize, -halfSize,  halfSize,
    -halfSize,  halfSize,  halfSize,
    -halfSize,  halfSize, -halfSize
  ]);
  
  // 法线
  const normals = new Float32Array([
    // 前面
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // 后面
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
    // 上面
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // 下面
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    // 右面
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // 左面
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0
  ]);
  
  // UV坐标
  const uvs = new Float32Array([
    // 每个面都是完整的纹理
    0, 0,  1, 0,  1, 1,  0, 1,  // 前
    0, 0,  1, 0,  1, 1,  0, 1,  // 后
    0, 0,  1, 0,  1, 1,  0, 1,  // 上
    0, 0,  1, 0,  1, 1,  0, 1,  // 下
    0, 0,  1, 0,  1, 1,  0, 1,  // 右
    0, 0,  1, 0,  1, 1,  0, 1   // 左
  ]);
  
  // 索引（每个面2个三角形）
  const indices = new Uint16Array([
    0,  1,  2,   0,  2,  3,   // 前
    4,  5,  6,   4,  6,  7,   // 后
    8,  9,  10,  8,  10, 11,  // 上
    12, 13, 14,  12, 14, 15,  // 下
    16, 17, 18,  16, 18, 19,  // 右
    20, 21, 22,  20, 22, 23   // 左
  ]);
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  
  return geometry;
}

// ================================================================
// 创建程序化地形
// ================================================================

function createProceduralTerrain(width, height, segments) {
  const geometry = new THREE.BufferGeometry();
  
  const vertexCount = (segments + 1) * (segments + 1);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  
  // 生成顶点
  for (let y = 0; y <= segments; y++) {
    for (let x = 0; x <= segments; x++) {
      const index = y * (segments + 1) + x;
      
      // 位置
      const px = (x / segments - 0.5) * width;
      const pz = (y / segments - 0.5) * height;
      
      // 高度（使用噪声函数）
      const py = Math.sin(px * 0.5) * Math.cos(pz * 0.5) * 2 +
                 Math.sin(px * 0.2) * Math.cos(pz * 0.3) * 5;
      
      positions[index * 3] = px;
      positions[index * 3 + 1] = py;
      positions[index * 3 + 2] = pz;
      
      // UV
      uvs[index * 2] = x / segments;
      uvs[index * 2 + 1] = y / segments;
    }
  }
  
  // 生成索引
  const indices = new Uint32Array(segments * segments * 6);
  let indexOffset = 0;
  
  for (let y = 0; y < segments; y++) {
    for (let x = 0; x < segments; x++) {
      const a = y * (segments + 1) + x;
      const b = a + 1;
      const c = a + (segments + 1);
      const d = c + 1;
      
      // 两个三角形
      indices[indexOffset++] = a;
      indices[indexOffset++] = c;
      indices[indexOffset++] = b;
      
      indices[indexOffset++] = b;
      indices[indexOffset++] = c;
      indices[indexOffset++] = d;
    }
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  
  // 自动计算法线
  geometry.computeVertexNormals();
  
  return geometry;
}

// 使用
const terrain = new THREE.Mesh(
  createProceduralTerrain(50, 50, 100),
  new THREE.MeshStandardMaterial({
    color: 0x228B22,
    wireframe: false
  })
);
```

### 3.3.3 修改几何体

```javascript
// ================================================================
// 动态修改几何体
// ================================================================

const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
const mesh = new THREE.Mesh(geometry, material);

// ============================================
// 访问和修改顶点位置
// ============================================

// 获取位置属性
const positionAttribute = geometry.attributes.position;

// 遍历所有顶点
for (let i = 0; i < positionAttribute.count; i++) {
  // 获取顶点位置
  const x = positionAttribute.getX(i);
  const y = positionAttribute.getY(i);
  const z = positionAttribute.getZ(i);
  
  // 修改Z值（创建波浪）
  const newZ = Math.sin(x * 2) * Math.cos(y * 2) * 0.5;
  positionAttribute.setZ(i, newZ);
}

// 标记需要更新
positionAttribute.needsUpdate = true;

// 重新计算法线（如果需要正确的光照）
geometry.computeVertexNormals();

// ============================================
// 实时动画
// ============================================

function animateWaves(time) {
  const positionAttribute = geometry.attributes.position;
  
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    
    // 创建移动的波浪
    const z = Math.sin(x * 2 + time) * Math.cos(y * 2 + time) * 0.5;
    positionAttribute.setZ(i, z);
  }
  
  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();
}

// 在渲染循环中调用
function animate() {
  requestAnimationFrame(animate);
  
  animateWaves(clock.getElapsedTime());
  
  renderer.render(scene, camera);
}

// ============================================
// 几何体操作方法
// ============================================

// 缩放几何体（修改顶点，不是变换）
geometry.scale(2, 2, 2);

// 平移几何体
geometry.translate(1, 0, 0);

// 旋转几何体
geometry.rotateX(Math.PI / 4);
geometry.rotateY(Math.PI / 4);
geometry.rotateZ(Math.PI / 4);

// 居中几何体
geometry.center();

// 计算包围盒
geometry.computeBoundingBox();
const size = new THREE.Vector3();
geometry.boundingBox.getSize(size);
console.log('尺寸:', size);

// 计算包围球
geometry.computeBoundingSphere();
console.log('半径:', geometry.boundingSphere.radius);

// ============================================
// 合并几何体
// ============================================
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const geometries = [];

// 创建多个立方体几何体
for (let i = 0; i < 10; i++) {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  boxGeometry.translate(i * 2, 0, 0);  // 移动到不同位置
  geometries.push(boxGeometry);
}

// 合并成一个几何体
const mergedGeometry = mergeGeometries(geometries);

// 创建单个网格
const mergedMesh = new THREE.Mesh(mergedGeometry, material);

/*
 * 合并几何体的好处：
 * - 减少绘制调用（draw calls）
 * - 提高渲染性能
 * 
 * 注意事项：
 * - 合并后的几何体无法单独变换
 * - 如果需要不同材质，需要使用组（groups）
 */

// ============================================
// 释放几何体资源
// ============================================
// 当不再需要几何体时，应该释放它
geometry.dispose();
```

---

# 第四部分：材质系统详解

## 4.1 材质基础概念

### 4.1.1 什么是材质？

```javascript
// ================================================================
// 材质（Material）基础概念
// ================================================================

/*
 * 材质决定了物体的"外观"
 * 
 * 材质定义了：
 * 1. 颜色 - 物体是什么颜色
 * 2. 光照响应 - 物体如何反射光线
 * 3. 纹理 - 物体表面的图案
 * 4. 透明度 - 物体是否透明
 * 5. 其他视觉属性
 * 
 * 现实世界的类比：
 * - 木头材质：有纹理，哑光，不透明
 * - 玻璃材质：透明，有反射
 * - 金属材质：有光泽，高反射
 * - 皮肤材质：次表面散射，柔和
 */

// ============================================
// Three.js的材质类型概览
// ============================================

/*
 * 基础材质（不需要光源）：
 * - MeshBasicMaterial：最简单，不受光照影响
 * - MeshNormalMaterial：用法线作为颜色（调试用）
 * - MeshMatcapMaterial：使用预烘焙的光照图
 * 
 * 需要光照的材质：
 * - MeshLambertMaterial：漫反射，哑光表面
 * - MeshPhongMaterial：有高光，光滑表面
 * - MeshStandardMaterial：PBR材质，真实感（推荐）
 * - MeshPhysicalMaterial：更高级的PBR，支持更多效果
 * - MeshToonMaterial：卡通风格
 * 
 * 特殊材质：
 * - PointsMaterial：点云材质
 * - LineBasicMaterial：线条材质
 * - SpriteMaterial：精灵材质
 * - ShaderMaterial：自定义着色器
 */

// ============================================
// 材质的通用属性
// ============================================

const material = new THREE.MeshStandardMaterial();

// === 基础属性 ===
material.name = 'myMaterial';     // 名称（调试用）
material.visible = true;          // 是否可见
material.transparent = false;     // 是否开启透明
material.opacity = 1.0;           // 透明度（需要transparent=true）

// === 渲染面 ===
material.side = THREE.FrontSide;  // 渲染哪一面
// THREE.FrontSide  - 只渲染正面（默认）
// THREE.BackSide   - 只渲染背面
// THREE.DoubleSide - 两面都渲染

// === 深度测试 ===
material.depthTest = true;        // 是否进行深度测试
material.depthWrite = true;       // 是否写入深度缓冲

// === 线框模式 ===
material.wireframe = false;       // 是否显示线框
material.wireframeLinewidth = 1;  // 线框线宽（仅某些平台有效）

// === 雾效果 ===
material.fog = true;              // 是否受场景雾影响

// ============================================
// 材质的复用
// ============================================

// 一个材质可以被多个Mesh使用
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const mesh1 = new THREE.Mesh(geometry, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry, sharedMaterial);

// 如果修改材质，所有使用它的物体都会改变
sharedMaterial.color.setHex(0x00ff00);  // 两个网格都变绿色

// 如果需要不同颜色，需要克隆材质
const mesh3Material = sharedMaterial.clone();
mesh3Material.color.setHex(0x0000ff);
const mesh3 = new THREE.Mesh(geometry, mesh3Material);
```

### 4.1.2 颜色的设置方式

```javascript
// ================================================================
// 颜色（Color）详解
// ================================================================

/*
 * Three.js使用Color对象表示颜色
 * 支持多种设置颜色的方式
 */

// ============================================
// 创建颜色的方式
// ============================================

// 1. 16进制数字
const color1 = new THREE.Color(0xff0000);  // 红色

// 2. 16进制字符串
const color2 = new THREE.Color('#ff0000');
const color3 = new THREE.Color('#f00');  // 简写

// 3. RGB字符串
const color4 = new THREE.Color('rgb(255, 0, 0)');
const color5 = new THREE.Color('rgb(100%, 0%, 0%)');

// 4. HSL字符串
const color6 = new THREE.Color('hsl(0, 100%, 50%)');

// 5. CSS颜色名
const color7 = new THREE.Color('red');
const color8 = new THREE.Color('skyblue');

// 6. RGB分量（0-1范围）
const color9 = new THREE.Color(1, 0, 0);

// ============================================
// 修改颜色
// ============================================

const color = new THREE.Color();

// 设置为16进制
color.setHex(0x00ff00);

// 设置RGB分量
color.setRGB(0, 1, 0);  // 0-1范围

// 设置HSL
color.setHSL(0.33, 1, 0.5);  // 色相0-1，饱和度0-1，亮度0-1

// 设置CSS样式
color.setStyle('blue');
color.setColorName('blue');

// ============================================
// 颜色操作
// ============================================

const colorA = new THREE.Color(0xff0000);  // 红色
const colorB = new THREE.Color(0x00ff00);  // 绿色

// 颜色加法
colorA.add(colorB);  // 红+绿=黄

// 颜色乘法
colorA.multiply(colorB);

// 颜色插值（混合）
const mixed = new THREE.Color();
mixed.lerpColors(
  new THREE.Color(0xff0000),  // 起始颜色
  new THREE.Color(0x0000ff),  // 结束颜色
  0.5                          // 混合比例
);  // 结果是紫色

// 或者直接修改
colorA.lerp(colorB, 0.5);

// ============================================
// 获取颜色信息
// ============================================

const myColor = new THREE.Color(0xff5500);

// 获取RGB分量
console.log(myColor.r, myColor.g, myColor.b);  // 0-1范围

// 获取16进制
console.log(myColor.getHex());  // 数字
console.log(myColor.getHexString());  // '字符串'

// 获取HSL
const hsl = {};
myColor.getHSL(hsl);
console.log(hsl.h, hsl.s, hsl.l);

// 获取CSS样式字符串
console.log(myColor.getStyle());  // 'rgb(255,85,0)'

// ============================================
// 在材质中使用颜色
// ============================================

// 创建时设置
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000
});

// 之后修改
material.color.setHex(0x00ff00);
material.color.set('blue');
material.color.setRGB(1, 0.5, 0);

// 使用Color对象
material.color = new THREE.Color(0xff00ff);
```

---

## 4.2 常用材质详解

### 4.2.1 MeshBasicMaterial 基础材质

```javascript
// ================================================================
// MeshBasicMaterial - 基础材质
// ================================================================

/*
 * 最简单的材质，不受光照影响
 * 直接显示颜色或纹理
 * 
 * 使用场景：
 * - 不需要光照效果的场景
 * - UI元素
 * - 调试
 * - 自发光物体
 * - 背景元素
 */

const basicMaterial = new THREE.MeshBasicMaterial({
  // === 颜色 ===
  color: 0xff0000,  // 基础颜色
  
  // === 纹理 ===
  map: texture,     // 颜色贴图
  
  // === 透明度 ===
  transparent: true,
  opacity: 0.5,
  alphaMap: alphaTexture,  // 透明度贴图（灰度图）
  alphaTest: 0.5,          // Alpha测试阈值
  
  // === 环境贴图（反射） ===
  envMap: cubeTexture,
  reflectivity: 1,         // 反射强度
  refractionRatio: 0.98,   // 折射率
  combine: THREE.MixOperation,  // 混合方式
  
  // === 渲染设置 ===
  side: THREE.FrontSide,
  wireframe: false,
  
  // === 顶点颜色 ===
  vertexColors: false,
  
  // === 雾 ===
  fog: true
});

// ============================================
// 使用示例
// ============================================

// 1. 简单的彩色物体
const colorCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x44aa88 })
);

// 2. 带纹理的物体
const texturedCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load('texture.jpg')
  })
);

// 3. 半透明物体
const glassCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.5
  })
);

// 4. 线框模式
const wireframeCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  })
);

// 5. 双面渲染
const doubleSidedPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  })
);
```

### 4.2.2 MeshStandardMaterial 标准PBR材质

```javascript
// ================================================================
// MeshStandardMaterial - 标准PBR材质（最常用）
// ================================================================

/*
 * PBR = Physically Based Rendering（基于物理的渲染）
 * 
 * 特点：
 * - 更真实的光照效果
 * - 使用金属度-粗糙度工作流
 * - 是大多数情况下的最佳选择
 * 
 * 核心参数：
 * - metalness（金属度）：0=非金属，1=金属
 * - roughness（粗糙度）：0=光滑镜面，1=完全粗糙
 * 
 * 材质类型示例：
 * - 木头：metalness=0, roughness=0.8
 * - 塑料：metalness=0, roughness=0.3-0.5
 * - 金属：metalness=1, roughness=0.2-0.5
 * - 镜子：metalness=1, roughness=0
 */

const standardMaterial = new THREE.MeshStandardMaterial({
  // === 基础属性 ===
  color: 0xffffff,          // 基础颜色（反照率）
  map: colorTexture,        // 颜色贴图
  
  // === PBR核心属性 ===
  metalness: 0.5,           // 金属度 (0-1)
  metalnessMap: metalnessTexture,  // 金属度贴图
  
  roughness: 0.5,           // 粗糙度 (0-1)
  roughnessMap: roughnessTexture,  // 粗糙度贴图
  
  // === 法线贴图（增加表面细节） ===
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),  // 法线强度
  
  // === 位移贴图（真正改变几何形状） ===
  displacementMap: displacementTexture,
  displacementScale: 0.1,   // 位移强度
  displacementBias: 0,      // 位移偏移
  
  // === 环境遮蔽（AO）===
  aoMap: aoTexture,         // AO贴图（需要第二套UV）
  aoMapIntensity: 1,        // AO强度
  
  // === 自发光 ===
  emissive: 0x000000,       // 自发光颜色
  emissiveIntensity: 1,     // 自发光强度
  emissiveMap: emissiveTexture,  // 自发光贴图
  
  // === 环境贴图 ===
  envMap: envTexture,       // 环境贴图
  envMapIntensity: 1,       // 环境贴图强度
  
  // === 透明度 ===
  transparent: false,
  opacity: 1,
  alphaMap: alphaTexture,
  
  // === 渲染设置 ===
  side: THREE.FrontSide,
  flatShading: false,       // 平面着色（低多边形风格）
  wireframe: false
});

// ============================================
// 常见材质预设
// ============================================

// 1. 木头
const woodMaterial = new THREE.MeshStandardMaterial({
  color: 0x8B4513,
  metalness: 0,
  roughness: 0.8,
  map: textureLoader.load('wood_color.jpg'),
  normalMap: textureLoader.load('wood_normal.jpg'),
  roughnessMap: textureLoader.load('wood_roughness.jpg')
});

// 2. 金属
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 1,
  roughness: 0.3,
  envMap: envTexture,
  envMapIntensity: 1
});

// 3. 塑料
const plasticMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0,
  roughness: 0.4
});

// 4. 混凝土
const concreteMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  metalness: 0,
  roughness: 0.9,
  map: textureLoader.load('concrete_color.jpg'),
  normalMap: textureLoader.load('concrete_normal.jpg')
});

// 5. 镜面
const mirrorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0,
  envMap: envTexture
});

// ============================================
// 使用AO贴图的注意事项
// ============================================

/*
 * AO贴图需要第二套UV坐标（uv2）
 * 因为AO通常需要单独的UV展开
 */

// 复制第一套UV作为第二套
geometry.setAttribute('uv2', 
  new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
);

// 现在可以使用AO贴图了
material.aoMap = textureLoader.load('ao.jpg');
```

### 4.2.3 MeshPhysicalMaterial 物理材质

```javascript
// ================================================================
// MeshPhysicalMaterial - 高级物理材质
// ================================================================

/*
 * MeshStandardMaterial的扩展版本
 * 支持更多高级效果：
 * - 清漆（Clearcoat）：车漆效果
 * - 透射（Transmission）：玻璃效果
 * - 光泽（Sheen）：布料效果
 * - 虹彩（Iridescence）：肥皂泡效果
 * 
 * 性能比StandardMaterial差，只在需要时使用
 */

const physicalMaterial = new THREE.MeshPhysicalMaterial({
  // 继承Standard的所有属性
  color: 0xffffff,
  metalness: 0,
  roughness: 0.5,
  
  // === 清漆效果（车漆、漆面） ===
  clearcoat: 1,                    // 清漆强度 (0-1)
  clearcoatRoughness: 0,           // 清漆粗糙度
  clearcoatMap: clearcoatTexture,
  clearcoatRoughnessMap: clearcoatRoughnessTexture,
  clearcoatNormalMap: clearcoatNormalTexture,
  clearcoatNormalScale: new THREE.Vector2(1, 1),
  
  // === 透射效果（玻璃、液体） ===
  transmission: 1,                 // 透射率 (0-1)
  transmissionMap: transmissionTexture,
  thickness: 0.5,                  // 厚度（影响折射）
  thicknessMap: thicknessTexture,
  attenuationColor: new THREE.Color(1, 1, 1),  // 衰减颜色
  attenuationDistance: Infinity,   // 衰减距离
  
  // === 折射率 ===
  ior: 1.5,  // Index of Refraction
  // 常见值：水=1.33, 玻璃=1.5, 钻石=2.42
  
  // === 光泽效果（布料、天鹅绒） ===
  sheen: 0,                        // 光泽强度
  sheenRoughness: 1,               // 光泽粗糙度
  sheenColor: new THREE.Color(0xffffff),
  sheenColorMap: sheenColorTexture,
  
  // === 虹彩效果（肥皂泡、CD光盘） ===
  iridescence: 0,                  // 虹彩强度
  iridescenceIOR: 1.3,             // 虹彩折射率
  iridescenceThicknessRange: [100, 400],  // 薄膜厚度范围(nm)
  iridescenceMap: iridescenceTexture,
  
  // === 各向异性（拉丝金属） ===
  anisotropy: 0,                   // 各向异性强度
  anisotropyRotation: 0,           // 各向异性旋转
  anisotropyMap: anisotropyTexture,
  
  // === 镜面反射控制 ===
  specularIntensity: 1,
  specularIntensityMap: specularIntensityTexture,
  specularColor: new THREE.Color(1, 1, 1),
  specularColorMap: specularColorTexture
});

// ============================================
// 常见材质预设
// ============================================

// 1. 玻璃
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  thickness: 0.5,
  ior: 1.5,
  transparent: true
});

// 2. 有色玻璃
const coloredGlass = new THREE.MeshPhysicalMaterial({
  color: 0x88ccff,
  metalness: 0,
  roughness: 0,
  transmission: 0.9,
  thickness: 0.5,
  ior: 1.5,
  transparent: true
});

// 3. 车漆
const carPaint = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 0.9,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1
});

// 4. 珍珠漆（带虹彩）
const pearlPaint = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.3,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
  iridescence: 1,
  iridescenceIOR: 1.3
});

// 5. 天鹅绒/布料
const velvetMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x800000,
  metalness: 0,
  roughness: 1,
  sheen: 1,
  sheenRoughness: 0.5,
  sheenColor: new THREE.Color(0xff4444)
});

// 6. 钻石
const diamondMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  thickness: 1,
  ior: 2.42,  // 钻石折射率
  transparent: true
});

// 7. 水
const waterMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0088ff,
  metalness: 0,
  roughness: 0,
  transmission: 0.9,
  thickness: 2,
  ior: 1.33,
  transparent: true
});
```

### 4.2.4 其他常用材质

```javascript
// ================================================================
// MeshLambertMaterial - Lambert材质
// ================================================================

/*
 * 使用Lambertian反射模型
 * 只有漫反射，没有高光
 * 适合哑光表面
 * 性能比Standard好
 */

const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  emissive: 0x000000,
  emissiveIntensity: 1,
  map: texture,
  envMap: envTexture,
  reflectivity: 1
});

// ================================================================
// MeshPhongMaterial - Phong材质
// ================================================================

/*
 * 使用Phong反射模型
 * 有高光（specular）
 * 适合塑料、光滑表面
 * 性能中等
 */

const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0x111111,    // 高光颜色
  shininess: 30,          // 光泽度（高光大小）
  emissive: 0x000000,
  map: texture,
  specularMap: specularTexture,
  normalMap: normalTexture
});

// ================================================================
// MeshToonMaterial - 卡通材质
// ================================================================

/*
 * 卡通风格渲染
 * 分层着色（cel shading）
 */

const toonMaterial = new THREE.MeshToonMaterial({
  color: 0xff0000
});

// 自定义渐变（控制色阶数量）
const colors = new Uint8Array([0, 64, 128, 192, 255]);
const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.needsUpdate = true;

const customToonMaterial = new THREE.MeshToonMaterial({
  color: 0xff0000,
  gradientMap: gradientMap
});

// ================================================================
// MeshNormalMaterial - 法线材质
// ================================================================

/*
 * 将法线方向映射为颜色
 * 主要用于调试
 */

const normalMaterial = new THREE.MeshNormalMaterial({
  flatShading: false,  // true显示平面法线
  wireframe: false
});

// ================================================================
// MeshMatcapMaterial - Matcap材质
// ================================================================

/*
 * 使用"材质捕捉"纹理
 * 预烘焙的光照效果
 * 不需要场景光源
 * 性能好，效果也不错
 */

const matcapMaterial = new THREE.MeshMatcapMaterial({
  matcap: textureLoader.load('matcap.png'),
  color: 0xffffff
});

// ================================================================
// MeshDepthMaterial - 深度材质
// ================================================================

/*
 * 根据深度着色
 * 用于阴影贴图、后期效果等
 */

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.BasicDepthPacking
});
```

---

# 第五部分：光照系统

## 5.1 光照基础概念

```javascript
// ================================================================
// 光照系统概述
// ================================================================

/*
 * 光照是3D场景真实感的关键
 * 
 * 光照组成：
 * 1. 环境光（Ambient）：均匀照亮所有物体
 * 2. 漫反射光（Diffuse）：根据表面朝向变化
 * 3. 高光（Specular）：光滑表面的高亮反射
 * 
 * Three.js光源类型：
 * - AmbientLight: 环境光
 * - DirectionalLight: 平行光（太阳）
 * - PointLight: 点光源（灯泡）
 * - SpotLight: 聚光灯（手电筒）
 * - HemisphereLight: 半球光（天空+地面）
 * - RectAreaLight: 矩形区域光（窗户）
 * 
 * 注意：MeshBasicMaterial不受光照影响！
 * 需要使用MeshLambertMaterial、MeshPhongMaterial、MeshStandardMaterial等
 */
```

## 5.2 环境光 AmbientLight

```javascript
// ================================================================
// AmbientLight - 环境光
// ================================================================

/*
 * 特点：
 * - 均匀照亮场景中的所有物体
 * - 没有方向，没有阴影
 * - 不能单独使用，通常配合其他光源
 * 
 * 作用：
 * - 模拟环境中的散射光
 * - 防止阴影区域完全黑暗
 * - 提供基础亮度
 */

const ambientLight = new THREE.AmbientLight(
  0xffffff,  // 颜色
  0.5        // 强度 (0-1，可以更大)
);
scene.add(ambientLight);

// 动态调整
ambientLight.color.setHex(0xffffcc);  // 暖色调
ambientLight.intensity = 0.3;

// ============================================
// 使用建议
// ============================================

/*
 * 强度建议：
 * - 室内场景：0.3-0.5
 * - 室外白天：0.5-0.8
 * - 夜间场景：0.1-0.2
 * 
 * 颜色建议：
 * - 配合主光源颜色
 * - 室内可以稍暖（0xfff5e6）
 * - 室外可以稍冷（0xe6f0ff）
 */

// 场景设置示例
function setupBasicLighting() {
  // 环境光（基础照明）
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  
  // 主光源（提供方向性）
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 10, 5);
  scene.add(directional);
}
```

## 5.3 平行光 DirectionalLight

```javascript
// ================================================================
// DirectionalLight - 平行光（方向光）
// ================================================================

/*
 * 特点：
 * - 光线相互平行，像太阳光
 * - 有方向，可以投射阴影
 * - 不随距离衰减
 * 
 * 位置的含义：
 * - position决定光线来的方向
 * - 光线从position指向target（默认原点）
 * - 所有物体接收到的光线方向相同
 * 
 *        太阳 ☀️ (position)
 *          │ │ │
 *          │ │ │  平行光线
 *          ↓ ↓ ↓
 *        ┌───────┐
 *        │ 物体  │
 *        └───────┘
 */

const directionalLight = new THREE.DirectionalLight(
  0xffffff,  // 颜色
  1          // 强度
);

// 设置位置（决定光线方向）
directionalLight.position.set(5, 10, 7.5);

// 设置目标（光线指向的点）
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight.target);  // 记得添加target到场景

scene.add(directionalLight);

// ============================================
// 阴影设置
// ============================================

// 1. 启用阴影
directionalLight.castShadow = true;

// 2. 阴影贴图大小（越大越清晰，但消耗更多内存）
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 3. 阴影相机范围（平行光使用正交相机）
/*
 * 阴影相机决定了哪些区域会被计算阴影
 * 范围越小，阴影越精细
 * 范围要包含需要阴影的所有物体
 * 
 *     ┌─────────────┐
 *     │   阴影相机   │
 *     │    范围     │
 *     │  ┌─────┐   │
 *     │  │物体 │   │
 *     │  └─────┘   │
 *     └─────────────┘
 */

directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// 4. 阴影偏移（解决阴影条纹问题）
directionalLight.shadow.bias = -0.0001;
directionalLight.shadow.normalBias = 0.02;

// ============================================
// 阴影相机辅助器（调试用）
// ============================================

const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(shadowHelper);

// ============================================
// 光源辅助器（调试用）
// ============================================

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(lightHelper);

// ============================================
// 使用示例：室外日光
// ============================================

function setupSunlight() {
  // 太阳光
  const sunLight = new THREE.DirectionalLight(0xfff5e6, 1);
  sunLight.position.set(50, 100, 50);
  sunLight.castShadow = true;
  
  // 大范围阴影
  sunLight.shadow.mapSize.set(4096, 4096);
  sunLight.shadow.camera.left = -50;
  sunLight.shadow.camera.right = 50;
  sunLight.shadow.camera.top = 50;
  sunLight.shadow.camera.bottom = -50;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 200;
  
  scene.add(sunLight);
  
  // 配合半球光模拟天空
  const hemiLight = new THREE.HemisphereLight(
    0x87ceeb,  // 天空色
    0x444444,  // 地面色
    0.6
  );
  scene.add(hemiLight);
}
```

## 5.4 点光源 PointLight

```javascript
// ================================================================
// PointLight - 点光源
// ================================================================

/*
 * 特点：
 * - 从一点向所有方向发射光线
 * - 像灯泡一样
 * - 光强随距离衰减
 * - 可以投射阴影（消耗较大）
 * 
 *              💡 点光源
 *            / │ │ \
 *           /  │ │  \
 *          ↙   ↓ ↓   ↘
 *        向所有方向发射
 */

const pointLight = new THREE.PointLight(
  0xffffff,  // 颜色
  1,         // 强度
  100,       // 距离（0表示无限远）
  2          // 衰减系数
);

pointLight.position.set(0, 5, 0);
scene.add(pointLight);

// ============================================
// 衰减参数详解
// ============================================

/*
 * distance: 光照距离
 *   - 0: 无限远（不衰减）
 *   - >0: 光在这个距离内逐渐衰减到0
 * 
 * decay: 衰减系数
 *   - 0: 不衰减
 *   - 1: 线性衰减
 *   - 2: 物理真实衰减（推荐）
 *   
 * 物理真实衰减：强度与距离平方成反比
 * intensity / (distance^2)
 */

// 物理正确的点光源
const physicalLight = new THREE.PointLight(0xffffff, 100, 50, 2);
// 注意：使用物理衰减时，强度值需要更大

// ============================================
// 阴影设置
// ============================================

pointLight.castShadow = true;

// 阴影贴图大小
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

// 阴影相机（点光源使用透视相机，6个方向）
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;
pointLight.shadow.camera.fov = 90;  // 固定90度

// 阴影偏移
pointLight.shadow.bias = -0.0001;

// ============================================
// 辅助器
// ============================================

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

// ============================================
// 使用示例：室内灯光
// ============================================

function createRoomLights() {
  const lights = [];
  
  // 顶灯
  const ceilingLight = new THREE.PointLight(0xffffcc, 1, 20, 2);
  ceilingLight.position.set(0, 4, 0);
  ceilingLight.castShadow = true;
  lights.push(ceilingLight);
  
  // 台灯
  const deskLamp = new THREE.PointLight(0xffaa00, 0.5, 5, 2);
  deskLamp.position.set(3, 1.5, 2);
  lights.push(deskLamp);
  
  // 添加到场景
  lights.forEach(light => scene.add(light));
  
  return lights;
}
```

## 5.5 聚光灯 SpotLight

```javascript
// ================================================================
// SpotLight - 聚光灯
// ================================================================

/*
 * 特点：
 * - 圆锥形光照区域
 * - 像手电筒或舞台灯
 * - 有方向和角度
 * - 可以投射阴影
 * 
 *        💡 聚光灯
 *         \│/
 *          V
 *         /|\
 *        / | \
 *       /  |  \
 *      /___|___\  光照锥体
 */

const spotLight = new THREE.SpotLight(
  0xffffff,      // 颜色
  1,             // 强度
  100,           // 距离（0=无限）
  Math.PI / 6,   // angle: 光锥角度（弧度）
  0.5,           // penumbra: 边缘柔和度（0-1）
  2              // decay: 衰减系数
);

spotLight.position.set(0, 10, 0);

// 目标（光线指向的点）
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight.target);

scene.add(spotLight);

// ============================================
// 参数详解
// ============================================

/*
 * angle: 光锥角度
 *   - 单位是弧度
 *   - 最大值是 Math.PI / 2 (90度)
 *   - 小角度：聚焦的光束
 *   - 大角度：宽广的照射
 *   
 * penumbra: 边缘柔和度
 *   - 0: 硬边缘（完全清晰的光圈）
 *   - 1: 完全柔和（从中心到边缘渐变）
 *   - 0.5: 中等柔和
 *   
 *   penumbra=0     penumbra=0.5    penumbra=1
 *   ┌───────┐      ┌───────┐       ┌───────┐
 *   │███████│      │▓▓███▓▓│       │░▒▓█▓▒░│
 *   │███████│      │▓█████▓│       │▒▓███▓▒│
 *   │███████│      │███████│       │▓█████▓│
 *   └───────┘      └───────┘       └───────┘
 */

// ============================================
// 阴影设置
// ============================================

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

// 阴影相机（透视相机）
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 30;

spotLight.shadow.bias = -0.0001;

// ============================================
// 聚光灯纹理（投射图案）
// ============================================

// 可以给聚光灯添加纹理，投射图案
spotLight.map = textureLoader.load('spotlight-pattern.png');

// ============================================
// 辅助器
// ============================================

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// 光源变化后需要更新辅助器
spotLightHelper.update();

// ============================================
// 使用示例：舞台灯光
// ============================================

function createStageLighting() {
  const spotlights = [];
  
  // 主聚光灯（白色）
  const mainSpot = new THREE.SpotLight(0xffffff, 2, 50, Math.PI / 8, 0.5, 2);
  mainSpot.position.set(0, 15, 10);
  mainSpot.target.position.set(0, 0, 0);
  mainSpot.castShadow = true;
  spotlights.push(mainSpot);
  
  // 彩色装饰灯
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  const positions = [[-8, 12, 5], [8, 12, 5], [0, 12, -5]];
  
  colors.forEach((color, i) => {
    const spot = new THREE.SpotLight(color, 1, 30, Math.PI / 6, 0.8, 2);
    spot.position.set(...positions[i]);
    spotlights.push(spot);
  });
  
  spotlights.forEach(spot => {
    scene.add(spot);
    scene.add(spot.target);
  });
  
  return spotlights;
}
```

## 5.6 半球光 HemisphereLight

```javascript
// ================================================================
// HemisphereLight - 半球光
// ================================================================

/*
 * 特点：
 * - 从天空和地面两个方向照射
 * - 模拟室外环境光
 * - 不产生阴影
 * 
 *        天空色 ☀️
 *          ↓ ↓ ↓
 *        ┌───────┐
 *        │ 物体  │
 *        └───────┘
 *          ↑ ↑ ↑
 *        地面色（反射）
 */

const hemisphereLight = new THREE.HemisphereLight(
  0x87ceeb,  // skyColor: 天空颜色（从上方照射）
  0x444444,  // groundColor: 地面颜色（从下方照射）
  1          // intensity: 强度
);

// position.y决定了"上"是哪个方向
hemisphereLight.position.set(0, 50, 0);

scene.add(hemisphereLight);

// ============================================
// 颜色建议
// ============================================

/*
 * 白天晴朗：
 * skyColor: 0x87ceeb (天蓝色)
 * groundColor: 0x444444 (深灰色)
 * 
 * 黄昏：
 * skyColor: 0xff8844 (橙色)
 * groundColor: 0x553322 (深棕色)
 * 
 * 阴天：
 * skyColor: 0x888888 (灰色)
 * groundColor: 0x444444 (深灰色)
 * 
 * 夜晚：
 * skyColor: 0x0a0a20 (深蓝色)
 * groundColor: 0x080808 (近黑色)
 */

// ============================================
// 辅助器
// ============================================

const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5);
scene.add(hemiLightHelper);

// ============================================
// 使用示例：室外照明
// ============================================

function setupOutdoorLighting(timeOfDay) {
  let skyColor, groundColor, sunColor, sunIntensity;
  
  switch(timeOfDay) {
    case 'morning':
      skyColor = 0xffeedd;
      groundColor = 0x445544;
      sunColor = 0xffeecc;
      sunIntensity = 0.8;
      break;
    case 'noon':
      skyColor = 0x87ceeb;
      groundColor = 0x555555;
      sunColor = 0xffffff;
      sunIntensity = 1;
      break;
    case 'evening':
      skyColor = 0xff8844;
      groundColor = 0x553322;
      sunColor = 0xff6600;
      sunIntensity = 0.6;
      break;
    case 'night':
      skyColor = 0x0a0a20;
      groundColor = 0x080808;
      sunColor = 0x4444ff;  // 月光
      sunIntensity = 0.2;
      break;
  }
  
  // 半球光（环境）
  const hemi = new THREE.HemisphereLight(skyColor, groundColor, 0.6);
  scene.add(hemi);
  
  // 平行光（太阳/月亮）
  const sun = new THREE.DirectionalLight(sunColor, sunIntensity);
  sun.position.set(50, 100, 50);
  sun.castShadow = true;
  scene.add(sun);
}
```

## 5.7 区域光 RectAreaLight

```javascript
// ================================================================
// RectAreaLight - 矩形区域光
// ================================================================

/*
 * 特点：
 * - 从矩形平面发射光线
 * - 像窗户透进来的光
 * - 只对MeshStandardMaterial和MeshPhysicalMaterial有效
 * - 不支持阴影
 * 
 *     ┌─────────┐
 *     │ 区域光  │  ← 矩形光源
 *     │ ▓▓▓▓▓▓ │
 *     └─────────┘
 *         ↓↓↓
 *       光线向外
 */

// 需要导入额外的库
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

// 初始化（必须！）
RectAreaLightUniformsLib.init();

const rectAreaLight = new THREE.RectAreaLight(
  0xffffff,  // 颜色
  5,         // 强度
  4,         // 宽度
  2          // 高度
);

rectAreaLight.position.set(0, 5, 5);
rectAreaLight.lookAt(0, 0, 0);  // 让光照向原点

scene.add(rectAreaLight);

// 辅助器
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// ============================================
// 使用示例：窗户光
// ============================================

function createWindowLight() {
  RectAreaLightUniformsLib.init();
  
  const windowLight = new THREE.RectAreaLight(0xffffee, 10, 3, 4);
  windowLight.position.set(5, 3, 0);
  windowLight.rotation.y = -Math.PI / 2;  // 面向室内
  
  scene.add(windowLight);
  
  // 添加可见的窗框
  const windowFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4),
    new THREE.MeshBasicMaterial({
      color: 0xffffee,
      transparent: true,
      opacity: 0.5
    })
  );
  windowFrame.position.copy(windowLight.position);
  windowFrame.rotation.copy(windowLight.rotation);
  scene.add(windowFrame);
  
  return windowLight;
}
```

## 5.8 光照最佳实践

```javascript
// ================================================================
// 光照最佳实践
// ================================================================

// ============================================
// 1. 三点布光法（经典方法）
// ============================================

/*
 * 三点布光是摄影和电影中常用的方法：
 * 
 *              主光（Key Light）
 *                    *
 *                   /
 *                  /  45°
 *                 /
 *        ┌───────────┐
 *        │   物体    │ ←────── 填充光（Fill Light）
 *        └───────────┘         强度较弱，减少阴影
 *                 \
 *                  \
 *                   \
 *                    *
 *              背光（Back Light）
 *              勾勒轮廓
 */

function setupThreePointLighting() {
  // 主光（最强，投射阴影）
  const keyLight = new THREE.DirectionalLight(0xffffff, 1);
  keyLight.position.set(5, 10, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);
  
  // 填充光（较弱，减少阴影）
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-5, 5, 5);
  scene.add(fillLight);
  
  // 背光（勾勒轮廓）
  const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);
  
  // 环境光（整体照亮）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
}

// ============================================
// 2. 性能优化
// ============================================

/*
 * 光源数量建议：
 * - 移动端：1-2个阴影光源
 * - 桌面端：2-4个阴影光源
 * - 环境光不消耗太多性能，可以多用
 */

// 阴影优化
function optimizeShadows() {
  // 1. 减小阴影贴图大小
  directionalLight.shadow.mapSize.width = 1024;  // 而不是2048或4096
  
  // 2. 减小阴影相机范围
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  
  // 3. 只有需要的物体才投射/接收阴影
  smallObject.castShadow = false;
  background.receiveShadow = false;
  
  // 4. 使用烘焙阴影（静态场景）
  // 将阴影预先渲染到纹理上
}

// ============================================
// 3. 动态时间变化
// ============================================

function updateLightingByTime(hours) {
  // hours: 0-24
  
  // 计算太阳位置
  const sunAngle = (hours - 6) / 12 * Math.PI;  // 6点日出，18点日落
  const sunHeight = Math.sin(sunAngle);
  const sunX = Math.cos(sunAngle) * 50;
  const sunY = Math.max(0, sunHeight) * 100;
  
  directionalLight.position.set(sunX, sunY, 50);
  
  // 根据时间调整颜色
  if (hours >= 6 && hours < 8) {
    // 早晨
    directionalLight.color.setHex(0xffeecc);
    hemisphereLight.color.setHex(0xffeedd);
  } else if (hours >= 8 && hours < 17) {
    // 白天
    directionalLight.color.setHex(0xffffff);
    hemisphereLight.color.setHex(0x87ceeb);
  } else if (hours >= 17 && hours < 19) {
    // 傍晚
    directionalLight.color.setHex(0xff8844);
    hemisphereLight.color.setHex(0xff9966);
  } else {
    // 夜晚
    directionalLight.color.setHex(0x4444ff);
    directionalLight.intensity = 0.2;
    hemisphereLight.color.setHex(0x0a0a20);
  }
}
```

---

*文档继续更新中...*

更多章节：
- 第六部分：纹理与贴图
- 第七部分：3D模型加载
- 第八部分：动画系统
- 第九部分：交互与控制
- 第十部分：高级技术

