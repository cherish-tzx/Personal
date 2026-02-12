# Three.js 完整API参考手册

> 本文档全面涵盖Three.js的所有核心语法、方法、用法，包含详细代码示例和使用场景说明。

---
<div class="doc-toc">
## 目录

1. [基础概念与核心架构](#1-基础概念与核心架构)
2. [场景 Scene](#2-场景-scene)
3. [相机 Camera](#3-相机-camera)
4. [渲染器 Renderer](#4-渲染器-renderer)
5. [几何体 Geometry](#5-几何体-geometry)
6. [材质 Material](#6-材质-material)
7. [网格 Mesh](#7-网格-mesh)
8. [光源 Light](#8-光源-light)
9. [纹理 Texture](#9-纹理-texture)
10. [加载器 Loader](#10-加载器-loader)
11. [动画系统 Animation](#11-动画系统-animation)
12. [数学工具类 Math](#12-数学工具类-math)
13. [控制器 Controls](#13-控制器-controls)
14. [辅助工具 Helpers](#14-辅助工具-helpers)
15. [后期处理 Post-processing](#15-后期处理-post-processing)
16. [音频系统 Audio](#16-音频系统-audio)
17. [粒子系统 Particles](#17-粒子系统-particles)
18. [着色器 Shader](#18-着色器-shader)
19. [性能优化](#19-性能优化)
20. [常用工具与技巧](#20-常用工具与技巧)


</div>

---

## 1. 基础概念与核心架构

### 1.1 Three.js 核心概念

Three.js是一个基于WebGL的3D图形库，其核心架构包含以下要素：

```javascript
// Three.js 基础架构示意
/**
 * 核心要素：
 * 1. Scene（场景）- 容纳所有3D对象的容器
 * 2. Camera（相机）- 决定观察场景的视角
 * 3. Renderer（渲染器）- 将场景渲染到画布
 * 4. Mesh（网格）- 由几何体和材质组成的3D对象
 * 5. Light（光源）- 照亮场景中的对象
 */
```

### 1.2 基础项目结构

```javascript
import * as THREE from 'three';

// ============================================
// 1. 创建场景
// ============================================
const scene = new THREE.Scene();
// 场景是所有3D对象的容器，相当于一个舞台

// ============================================
// 2. 创建相机
// ============================================
const camera = new THREE.PerspectiveCamera(
  75,                                     // 视野角度（FOV）
  window.innerWidth / window.innerHeight, // 宽高比
  0.1,                                    // 近裁剪面
  1000                                    // 远裁剪面
);
camera.position.z = 5; // 设置相机位置

// ============================================
// 3. 创建渲染器
// ============================================
const renderer = new THREE.WebGLRenderer({
  antialias: true,  // 抗锯齿
  alpha: true       // 透明背景
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 适配高清屏
document.body.appendChild(renderer.domElement);

// ============================================
// 4. 创建3D对象
// ============================================
const geometry = new THREE.BoxGeometry(1, 1, 1); // 几何体
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 材质
const cube = new THREE.Mesh(geometry, material); // 网格
scene.add(cube); // 添加到场景

// ============================================
// 5. 渲染循环（动画循环）
// ============================================
function animate() {
  requestAnimationFrame(animate);
  
  // 更新动画
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // 渲染场景
  renderer.render(scene, camera);
}
animate();

// ============================================
// 6. 响应窗口大小变化
// ============================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### 1.3 坐标系统

```javascript
/**
 * Three.js 使用右手坐标系：
 * - X轴：水平向右为正
 * - Y轴：垂直向上为正
 * - Z轴：垂直屏幕向外为正
 */

// 创建坐标轴辅助器来可视化坐标系
const axesHelper = new THREE.AxesHelper(5);
// 参数是坐标轴的长度
// 红色 = X轴，绿色 = Y轴，蓝色 = Z轴
scene.add(axesHelper);

// 设置对象位置的多种方式
const mesh = new THREE.Mesh(geometry, material);

// 方式1：直接设置属性
mesh.position.x = 1;
mesh.position.y = 2;
mesh.position.z = 3;

// 方式2：使用set方法
mesh.position.set(1, 2, 3);

// 方式3：使用Vector3
mesh.position.copy(new THREE.Vector3(1, 2, 3));
```

---

## 2. 场景 Scene

### 2.1 Scene 基础

```javascript
// ============================================
// 创建场景
// ============================================
const scene = new THREE.Scene();

// 场景属性
scene.background = new THREE.Color(0x000000);     // 背景颜色
scene.fog = new THREE.Fog(0xcccccc, 10, 100);    // 雾效果
scene.environment = envMap;                       // 环境贴图

// 场景名称（用于调试）
scene.name = 'MainScene';
```

### 2.2 Scene 背景设置

```javascript
// ============================================
// 背景颜色
// ============================================
scene.background = new THREE.Color(0x1a1a2e);

// ============================================
// 背景图片/纹理
// ============================================
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('background.jpg');

// ============================================
// 背景立方体贴图（天空盒）
// ============================================
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  'px.jpg', 'nx.jpg',  // 正X面，负X面
  'py.jpg', 'ny.jpg',  // 正Y面，负Y面
  'pz.jpg', 'nz.jpg'   // 正Z面，负Z面
]);

// ============================================
// 等距矩形全景图（HDR环境）
// ============================================
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('environment.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture; // 同时作为环境光照
});
```

### 2.3 雾效果 Fog

```javascript
// ============================================
// 线性雾 - 雾的浓度随距离线性增加
// ============================================
scene.fog = new THREE.Fog(
  0xffffff,  // 颜色
  10,        // near - 开始产生雾的距离
  100        // far - 完全被雾覆盖的距离
);

// ============================================
// 指数雾 - 雾的浓度随距离指数增加
// ============================================
scene.fog = new THREE.FogExp2(
  0xffffff,  // 颜色
  0.01       // density - 雾的密度
);

// 动态修改雾属性
scene.fog.color.setHex(0x000000);
scene.fog.near = 5;
scene.fog.far = 50;
```

### 2.4 场景对象管理

```javascript
// ============================================
// 添加对象
// ============================================
scene.add(mesh);           // 添加单个对象
scene.add(mesh1, mesh2);   // 添加多个对象

// ============================================
// 移除对象
// ============================================
scene.remove(mesh);        // 移除单个对象
scene.remove(mesh1, mesh2); // 移除多个对象

// ============================================
// 获取对象
// ============================================
const object = scene.getObjectByName('myMesh');     // 按名称获取
const object2 = scene.getObjectById(12);            // 按ID获取
const object3 = scene.getObjectByProperty('uuid', 'xxx'); // 按属性获取

// ============================================
// 遍历场景中所有对象
// ============================================
scene.traverse((object) => {
  console.log(object.name, object.type);
  
  // 对特定类型对象进行操作
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
// 清空场景
// ============================================
function clearScene() {
  while (scene.children.length > 0) {
    const object = scene.children[0];
    
    // 释放几何体和材质
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.dispose());
      } else {
        object.material.dispose();
      }
    }
    
    scene.remove(object);
  }
}
```

---

## 3. 相机 Camera

### 3.1 透视相机 PerspectiveCamera

```javascript
/**
 * 透视相机 - 模拟人眼的观察方式
 * 特点：近大远小，有透视效果
 * 使用场景：大多数3D场景、游戏、可视化
 */
const camera = new THREE.PerspectiveCamera(
  fov,     // 视野角度（Field of View），通常 45-75
  aspect,  // 宽高比，通常是 window.innerWidth / window.innerHeight
  near,    // 近裁剪面，通常 0.1
  far      // 远裁剪面，通常 1000-10000
);

// 完整示例
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 5, 10);

// 设置相机朝向
camera.lookAt(0, 0, 0);        // 看向原点
camera.lookAt(mesh.position);  // 看向某个对象

// 动态修改FOV（需要更新投影矩阵）
camera.fov = 60;
camera.updateProjectionMatrix();

// 修改宽高比（窗口resize时）
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
```

### 3.2 正交相机 OrthographicCamera

```javascript
/**
 * 正交相机 - 没有透视效果
 * 特点：物体大小不随距离变化
 * 使用场景：2D游戏、CAD、建筑设计图、UI元素
 */
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,  // left
  frustumSize * aspect / 2,   // right
  frustumSize / 2,            // top
  frustumSize / -2,           // bottom
  0.1,                        // near
  1000                        // far
);

camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// 窗口resize时更新正交相机
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = frustumSize * aspect / -2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;
  camera.updateProjectionMatrix();
});

// 缩放正交相机
camera.zoom = 2; // 放大2倍
camera.updateProjectionMatrix();
```

### 3.3 立方相机 CubeCamera

```javascript
/**
 * 立方相机 - 同时渲染6个方向
 * 使用场景：生成环境贴图、实时反射
 */
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
});

const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
scene.add(cubeCamera);

// 使用立方相机生成的纹理作为环境贴图
const reflectiveMaterial = new THREE.MeshStandardMaterial({
  envMap: cubeRenderTarget.texture,
  metalness: 1,
  roughness: 0
});

// 在渲染循环中更新
function animate() {
  // 隐藏反射物体本身
  reflectiveMesh.visible = false;
  
  // 更新立方相机位置并渲染
  cubeCamera.position.copy(reflectiveMesh.position);
  cubeCamera.update(renderer, scene);
  
  // 显示反射物体
  reflectiveMesh.visible = true;
  
  renderer.render(scene, camera);
}
```

### 3.4 立体相机 StereoCamera

```javascript
/**
 * 立体相机 - 用于VR/3D立体效果
 * 创建左右两个视角，产生立体视觉效果
 */
const stereoCamera = new THREE.StereoCamera();
stereoCamera.eyeSep = 0.064; // 眼距（米）

// 渲染立体效果
const size = new THREE.Vector2();
renderer.getSize(size);

renderer.setScissorTest(true);

// 渲染左眼
renderer.setScissor(0, 0, size.x / 2, size.y);
renderer.setViewport(0, 0, size.x / 2, size.y);
renderer.render(scene, stereoCamera.cameraL);

// 渲染右眼
renderer.setScissor(size.x / 2, 0, size.x / 2, size.y);
renderer.setViewport(size.x / 2, 0, size.x / 2, size.y);
renderer.render(scene, stereoCamera.cameraR);

renderer.setScissorTest(false);
```

### 3.5 相机动画与过渡

```javascript
import { gsap } from 'gsap';

// ============================================
// 使用GSAP进行相机动画
// ============================================
function animateCameraTo(targetPosition, targetLookAt, duration = 2) {
  // 动画相机位置
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(targetLookAt);
    }
  });
}

// ============================================
// 相机围绕目标旋转
// ============================================
function orbitCamera(target, radius, speed) {
  const angle = Date.now() * speed * 0.001;
  camera.position.x = target.x + Math.cos(angle) * radius;
  camera.position.z = target.z + Math.sin(angle) * radius;
  camera.lookAt(target);
}

// ============================================
// 相机跟随目标
// ============================================
function followTarget(target, offset, smoothness = 0.1) {
  const targetPosition = target.position.clone().add(offset);
  camera.position.lerp(targetPosition, smoothness);
  camera.lookAt(target.position);
}

// ============================================
// 第一人称相机
// ============================================
class FirstPersonCamera {
  constructor(camera) {
    this.camera = camera;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.sensitivity = 0.002;
    
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.euler.y -= e.movementX * this.sensitivity;
        this.euler.x -= e.movementY * this.sensitivity;
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
        this.camera.quaternion.setFromEuler(this.euler);
      }
    });
  }
  
  move(direction, speed) {
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
    
    this.camera.position.addScaledVector(forward, direction.z * speed);
    this.camera.position.addScaledVector(right, direction.x * speed);
  }
}
```

---

## 4. 渲染器 Renderer

### 4.1 WebGLRenderer 基础配置

```javascript
// ============================================
// 创建渲染器
// ============================================
const renderer = new THREE.WebGLRenderer({
  // 画布元素，不传则自动创建
  canvas: document.querySelector('#myCanvas'),
  
  // 抗锯齿
  antialias: true,
  
  // 透明背景
  alpha: true,
  
  // 是否保留绘图缓冲区（截图需要）
  preserveDrawingBuffer: true,
  
  // 是否使用对数深度缓冲区（解决z-fighting）
  logarithmicDepthBuffer: true,
  
  // 精度：'highp', 'mediump', 'lowp'
  precision: 'highp',
  
  // 电源偏好：'high-performance', 'low-power', 'default'
  powerPreference: 'high-performance',
  
  // 是否执行颜色管理
  outputColorSpace: THREE.SRGBColorSpace,
  
  // 启用模板缓冲区
  stencil: true,
  
  // 启用深度缓冲区
  depth: true
});

// ============================================
// 基础设置
// ============================================
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 设置像素比（适配Retina屏幕）
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 设置背景色
renderer.setClearColor(0x000000, 1); // 颜色，透明度

// 添加到DOM
document.body.appendChild(renderer.domElement);
```

### 4.2 阴影配置

```javascript
// ============================================
// 启用阴影
// ============================================
renderer.shadowMap.enabled = true;

// 阴影类型
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影
// 可选值：
// THREE.BasicShadowMap - 性能最好，质量最低
// THREE.PCFShadowMap - 默认，使用PCF算法
// THREE.PCFSoftShadowMap - 更柔和的PCF
// THREE.VSMShadowMap - VSM算法，需要特殊材质

// ============================================
// 光源阴影设置
// ============================================
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;

// 阴影贴图大小（越大越清晰，越消耗性能）
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 阴影相机范围
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

// 阴影偏移（解决阴影失真）
directionalLight.shadow.bias = -0.0001;
directionalLight.shadow.normalBias = 0.02;

// 阴影模糊半径（仅VSMShadowMap）
directionalLight.shadow.radius = 4;

// ============================================
// 物体阴影设置
// ============================================
mesh.castShadow = true;      // 投射阴影
mesh.receiveShadow = true;   // 接收阴影

// 地面接收阴影
ground.receiveShadow = true;
```

### 4.3 色调映射 Tone Mapping

```javascript
// ============================================
// 色调映射 - 将HDR转换为LDR
// ============================================
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 可选值：
// THREE.NoToneMapping - 无色调映射
// THREE.LinearToneMapping - 线性
// THREE.ReinhardToneMapping - Reinhard算法
// THREE.CineonToneMapping - Cineon算法
// THREE.ACESFilmicToneMapping - ACES电影级（推荐）

// 曝光度
renderer.toneMappingExposure = 1.0;

// ============================================
// 颜色空间
// ============================================
renderer.outputColorSpace = THREE.SRGBColorSpace;
// THREE.SRGBColorSpace - sRGB颜色空间（推荐）
// THREE.LinearSRGBColorSpace - 线性sRGB
```

### 4.4 渲染目标 RenderTarget

```javascript
// ============================================
// 创建渲染目标（离屏渲染）
// ============================================
const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    encoding: THREE.sRGBEncoding,
    samples: 4  // MSAA采样数
  }
);

// 渲染到目标
renderer.setRenderTarget(renderTarget);
renderer.render(scene, camera);

// 恢复默认渲染目标（屏幕）
renderer.setRenderTarget(null);

// 使用渲染结果作为纹理
const planeMaterial = new THREE.MeshBasicMaterial({
  map: renderTarget.texture
});

// ============================================
// 多渲染目标 MRT
// ============================================
const multiRenderTarget = new THREE.WebGLMultipleRenderTargets(
  width, height, 3  // 3个输出
);
```

### 4.5 渲染器高级功能

```javascript
// ============================================
// 获取渲染器信息
// ============================================
console.log(renderer.info);
// {
//   memory: { geometries, textures },
//   render: { calls, triangles, points, lines, frame },
//   programs: [...]
// }

// 重置渲染统计
renderer.info.reset();

// ============================================
// 截图功能
// ============================================
function takeScreenshot() {
  renderer.render(scene, camera);
  const dataURL = renderer.domElement.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = 'screenshot.png';
  link.href = dataURL;
  link.click();
}

// ============================================
// 视口和裁剪
// ============================================
// 设置视口（用于分屏渲染）
renderer.setViewport(0, 0, width / 2, height);

// 设置裁剪区域
renderer.setScissor(0, 0, width / 2, height);
renderer.setScissorTest(true);

// ============================================
// 自动清除控制
// ============================================
renderer.autoClear = false;  // 禁用自动清除

// 手动清除
renderer.clear();              // 清除所有
renderer.clearColor();         // 仅清除颜色
renderer.clearDepth();         // 仅清除深度
renderer.clearStencil();       // 仅清除模板

// ============================================
// 销毁渲染器
// ============================================
function disposeRenderer() {
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement = null;
}
```

---

## 5. 几何体 Geometry

### 5.1 基础几何体

```javascript
// ============================================
// 立方体 BoxGeometry
// ============================================
const boxGeometry = new THREE.BoxGeometry(
  width,           // 宽度，默认1
  height,          // 高度，默认1
  depth,           // 深度，默认1
  widthSegments,   // 宽度分段，默认1
  heightSegments,  // 高度分段，默认1
  depthSegments    // 深度分段，默认1
);

// 示例：创建一个2x3x4的立方体，每面4x4分段
const box = new THREE.BoxGeometry(2, 3, 4, 4, 4, 4);

// ============================================
// 球体 SphereGeometry
// ============================================
const sphereGeometry = new THREE.SphereGeometry(
  radius,          // 半径，默认1
  widthSegments,   // 水平分段，默认32
  heightSegments,  // 垂直分段，默认16
  phiStart,        // 水平起始角度，默认0
  phiLength,       // 水平扫描角度，默认Math.PI * 2
  thetaStart,      // 垂直起始角度，默认0
  thetaLength      // 垂直扫描角度，默认Math.PI
);

// 示例：半球
const hemisphere = new THREE.SphereGeometry(
  1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2
);

// ============================================
// 平面 PlaneGeometry
// ============================================
const planeGeometry = new THREE.PlaneGeometry(
  width,           // 宽度，默认1
  height,          // 高度，默认1
  widthSegments,   // 宽度分段，默认1
  heightSegments   // 高度分段，默认1
);

// ============================================
// 圆形 CircleGeometry
// ============================================
const circleGeometry = new THREE.CircleGeometry(
  radius,          // 半径，默认1
  segments,        // 分段数，默认32
  thetaStart,      // 起始角度，默认0
  thetaLength      // 扫描角度，默认Math.PI * 2
);

// 示例：扇形
const sector = new THREE.CircleGeometry(1, 32, 0, Math.PI / 2);

// ============================================
// 圆柱体 CylinderGeometry
// ============================================
const cylinderGeometry = new THREE.CylinderGeometry(
  radiusTop,       // 顶部半径，默认1
  radiusBottom,    // 底部半径，默认1
  height,          // 高度，默认1
  radialSegments,  // 圆周分段，默认32
  heightSegments,  // 高度分段，默认1
  openEnded,       // 是否开口，默认false
  thetaStart,      // 起始角度，默认0
  thetaLength      // 扫描角度，默认Math.PI * 2
);

// 示例：圆锥体
const cone = new THREE.CylinderGeometry(0, 1, 2, 32);

// ============================================
// 圆锥体 ConeGeometry
// ============================================
const coneGeometry = new THREE.ConeGeometry(
  radius,          // 底部半径，默认1
  height,          // 高度，默认1
  radialSegments,  // 圆周分段，默认32
  heightSegments,  // 高度分段，默认1
  openEnded,       // 是否开口，默认false
  thetaStart,      // 起始角度，默认0
  thetaLength      // 扫描角度，默认Math.PI * 2
);

// ============================================
// 圆环 TorusGeometry
// ============================================
const torusGeometry = new THREE.TorusGeometry(
  radius,          // 圆环半径，默认1
  tube,            // 管道半径，默认0.4
  radialSegments,  // 圆环分段，默认12
  tubularSegments, // 管道分段，默认48
  arc              // 弧度，默认Math.PI * 2
);

// ============================================
// 圆环结 TorusKnotGeometry
// ============================================
const torusKnotGeometry = new THREE.TorusKnotGeometry(
  radius,          // 半径，默认1
  tube,            // 管道半径，默认0.4
  tubularSegments, // 管道分段，默认64
  radialSegments,  // 圆周分段，默认8
  p,               // 几何参数p，默认2
  q                // 几何参数q，默认3
);

// ============================================
// 十二面体 DodecahedronGeometry
// ============================================
const dodecahedronGeometry = new THREE.DodecahedronGeometry(
  radius,          // 半径，默认1
  detail           // 细节级别，默认0
);

// ============================================
// 二十面体 IcosahedronGeometry
// ============================================
const icosahedronGeometry = new THREE.IcosahedronGeometry(
  radius,          // 半径，默认1
  detail           // 细节级别，默认0
);

// ============================================
// 八面体 OctahedronGeometry
// ============================================
const octahedronGeometry = new THREE.OctahedronGeometry(
  radius,          // 半径，默认1
  detail           // 细节级别，默认0
);

// ============================================
// 四面体 TetrahedronGeometry
// ============================================
const tetrahedronGeometry = new THREE.TetrahedronGeometry(
  radius,          // 半径，默认1
  detail           // 细节级别，默认0
);

// ============================================
// 圆环扭结 TorusKnotGeometry
// ============================================
const torusKnot = new THREE.TorusKnotGeometry(10, 3, 100, 16);
```

### 5.2 高级几何体

```javascript
// ============================================
// 挤压几何体 ExtrudeGeometry
// ============================================
// 创建2D形状
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, 2);
shape.lineTo(1, 2);
shape.lineTo(1, 0);
shape.lineTo(0, 0);

// 挤压设置
const extrudeSettings = {
  steps: 2,              // 挤压分段数
  depth: 2,              // 挤压深度
  bevelEnabled: true,    // 是否启用斜角
  bevelThickness: 0.2,   // 斜角厚度
  bevelSize: 0.1,        // 斜角大小
  bevelOffset: 0,        // 斜角偏移
  bevelSegments: 3,      // 斜角分段
  extrudePath: curve     // 挤压路径（可选）
};

const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

// ============================================
// 车削几何体 LatheGeometry
// ============================================
// 定义轮廓点
const points = [];
for (let i = 0; i < 10; i++) {
  points.push(new THREE.Vector2(
    Math.sin(i * 0.2) * 10 + 5,
    (i - 5) * 2
  ));
}

const latheGeometry = new THREE.LatheGeometry(
  points,          // 轮廓点数组
  32,              // 分段数
  0,               // 起始角度
  Math.PI * 2      // 旋转角度
);

// ============================================
// 管道几何体 TubeGeometry
// ============================================
// 定义路径曲线
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(-5, 5, 5),
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(5, -5, 5),
  new THREE.Vector3(10, 0, 0)
]);

const tubeGeometry = new THREE.TubeGeometry(
  path,            // 路径曲线
  64,              // 管道分段
  2,               // 管道半径
  8,               // 圆周分段
  false            // 是否闭合
);

// ============================================
// 形状几何体 ShapeGeometry
// ============================================
const heartShape = new THREE.Shape();
heartShape.moveTo(25, 25);
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

const shapeGeometry = new THREE.ShapeGeometry(heartShape);

// ============================================
// 文本几何体 TextGeometry
// ============================================
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello Three.js!', {
    font: font,
    size: 1,           // 字体大小
    height: 0.2,       // 文字厚度
    curveSegments: 12, // 曲线分段
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });
  
  // 居中文本
  textGeometry.computeBoundingBox();
  textGeometry.center();
  
  const textMesh = new THREE.Mesh(textGeometry, material);
  scene.add(textMesh);
});

// ============================================
// 参数化几何体 ParametricGeometry
// ============================================
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

// Klein瓶参数方程
function klein(v, u, target) {
  u *= Math.PI;
  v *= 2 * Math.PI;
  
  u = u * 2;
  let x, y, z;
  
  if (u < Math.PI) {
    x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 
        (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
    z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
  } else {
    x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 
        (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
    z = -8 * Math.sin(u);
  }
  
  y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
  
  target.set(x, y, z);
}

const parametricGeometry = new ParametricGeometry(klein, 25, 25);

// ============================================
// 边缘几何体 EdgesGeometry
// ============================================
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const edgesGeometry = new THREE.EdgesGeometry(boxGeometry, 1); // 阈值角度

const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
scene.add(edges);

// ============================================
// 线框几何体 WireframeGeometry
// ============================================
const wireframeGeometry = new THREE.WireframeGeometry(boxGeometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
scene.add(wireframe);
```

### 5.3 BufferGeometry 自定义几何体

```javascript
// ============================================
// 创建自定义BufferGeometry
// ============================================
const geometry = new THREE.BufferGeometry();

// 定义顶点位置
const vertices = new Float32Array([
  // 第一个三角形
  -1.0, -1.0, 0.0,
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  // 第二个三角形
  -1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0
]);

// 设置位置属性
geometry.setAttribute('position', 
  new THREE.BufferAttribute(vertices, 3)  // 每3个值为一组（xyz）
);

// ============================================
// 使用索引优化
// ============================================
const indexedGeometry = new THREE.BufferGeometry();

// 4个顶点
const positions = new Float32Array([
  -1.0, -1.0, 0.0,  // 0
   1.0, -1.0, 0.0,  // 1
   1.0,  1.0, 0.0,  // 2
  -1.0,  1.0, 0.0   // 3
]);

// 索引（两个三角形共享顶点）
const indices = new Uint16Array([
  0, 1, 2,  // 第一个三角形
  0, 2, 3   // 第二个三角形
]);

indexedGeometry.setAttribute('position',
  new THREE.BufferAttribute(positions, 3)
);
indexedGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

// ============================================
// 添加法线
// ============================================
const normals = new Float32Array([
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1
]);
geometry.setAttribute('normal',
  new THREE.BufferAttribute(normals, 3)
);

// 自动计算法线
geometry.computeVertexNormals();

// ============================================
// 添加UV坐标
// ============================================
const uvs = new Float32Array([
  0, 0,
  1, 0,
  1, 1,
  0, 1
]);
geometry.setAttribute('uv',
  new THREE.BufferAttribute(uvs, 2)
);

// ============================================
// 添加顶点颜色
// ============================================
const colors = new Float32Array([
  1, 0, 0,  // 红色
  0, 1, 0,  // 绿色
  0, 0, 1,  // 蓝色
  1, 1, 0   // 黄色
]);
geometry.setAttribute('color',
  new THREE.BufferAttribute(colors, 3)
);

// 使用顶点颜色的材质
const material = new THREE.MeshBasicMaterial({
  vertexColors: true
});

// ============================================
// 自定义属性
// ============================================
const customAttribute = new Float32Array([1, 2, 3, 4]);
geometry.setAttribute('customData',
  new THREE.BufferAttribute(customAttribute, 1)
);

// ============================================
// 几何体操作
// ============================================
// 计算包围盒
geometry.computeBoundingBox();
console.log(geometry.boundingBox);

// 计算包围球
geometry.computeBoundingSphere();
console.log(geometry.boundingSphere);

// 居中几何体
geometry.center();

// 缩放
geometry.scale(2, 2, 2);

// 旋转
geometry.rotateX(Math.PI / 4);
geometry.rotateY(Math.PI / 4);
geometry.rotateZ(Math.PI / 4);

// 平移
geometry.translate(1, 2, 3);

// 合并几何体
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
const mergedGeometry = mergeGeometries([geometry1, geometry2]);

// 释放几何体
geometry.dispose();
```

---

## 6. 材质 Material

### 6.1 基础材质 MeshBasicMaterial

```javascript
/**
 * MeshBasicMaterial - 基础材质
 * 特点：不受光照影响，直接显示颜色/纹理
 * 使用场景：UI元素、不需要光照的场景、调试
 */
const basicMaterial = new THREE.MeshBasicMaterial({
  // 颜色
  color: 0xff0000,
  // color: new THREE.Color(1, 0, 0),
  // color: 'red',
  // color: '#ff0000',
  // color: 'rgb(255, 0, 0)',
  
  // 透明度
  transparent: true,
  opacity: 0.5,
  
  // 贴图
  map: texture,
  
  // Alpha贴图（控制透明度）
  alphaMap: alphaTexture,
  
  // 环境贴图
  envMap: envTexture,
  
  // 渲染面
  side: THREE.FrontSide,    // 正面
  // side: THREE.BackSide,  // 背面
  // side: THREE.DoubleSide, // 双面
  
  // 线框模式
  wireframe: false,
  wireframeLinewidth: 1,
  
  // 是否使用顶点颜色
  vertexColors: false,
  
  // 是否使用雾
  fog: true,
  
  // 混合模式
  blending: THREE.NormalBlending,
  
  // 深度测试
  depthTest: true,
  depthWrite: true,
  
  // Alpha测试（低于此值的像素不渲染）
  alphaTest: 0
});
```

### 6.2 Lambert材质 MeshLambertMaterial

```javascript
/**
 * MeshLambertMaterial - 兰伯特材质
 * 特点：漫反射光照模型，性能较好
 * 使用场景：不需要高光的表面，如哑光材质
 */
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  
  // 自发光颜色
  emissive: 0x000000,
  emissiveIntensity: 1,
  emissiveMap: emissiveTexture,
  
  // 贴图
  map: texture,
  
  // 光照贴图（需要第二套UV）
  lightMap: lightMapTexture,
  lightMapIntensity: 1,
  
  // 环境遮蔽贴图
  aoMap: aoTexture,
  aoMapIntensity: 1,
  
  // 环境贴图
  envMap: envTexture,
  reflectivity: 1,
  refractionRatio: 0.98,
  combine: THREE.MultiplyOperation,
  
  // 透明度
  transparent: true,
  opacity: 1,
  
  // 渲染面
  side: THREE.FrontSide,
  
  // 线框
  wireframe: false
});
```

### 6.3 Phong材质 MeshPhongMaterial

```javascript
/**
 * MeshPhongMaterial - Phong材质
 * 特点：支持高光反射，可模拟光滑表面
 * 使用场景：塑料、金属、玻璃等有高光的表面
 */
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  
  // 高光颜色
  specular: 0x111111,
  
  // 光泽度（高光大小）
  shininess: 30,
  
  // 高光贴图
  specularMap: specularTexture,
  
  // 自发光
  emissive: 0x000000,
  emissiveIntensity: 1,
  emissiveMap: emissiveTexture,
  
  // 法线贴图
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  
  // 位移贴图
  displacementMap: displacementTexture,
  displacementScale: 1,
  displacementBias: 0,
  
  // 凹凸贴图
  bumpMap: bumpTexture,
  bumpScale: 1,
  
  // 贴图
  map: texture,
  
  // 环境贴图
  envMap: envTexture,
  reflectivity: 1,
  refractionRatio: 0.98,
  
  // 透明度
  transparent: false,
  opacity: 1,
  
  // 渲染面
  side: THREE.FrontSide,
  
  // 平面着色
  flatShading: false
});
```

### 6.4 标准材质 MeshStandardMaterial

```javascript
/**
 * MeshStandardMaterial - PBR标准材质
 * 特点：基于物理的渲染，效果更真实
 * 使用场景：需要真实感的场景，是最常用的材质
 */
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  
  // 金属度 (0-1)
  metalness: 0.5,
  metalnessMap: metalnessTexture,
  
  // 粗糙度 (0-1)
  roughness: 0.5,
  roughnessMap: roughnessTexture,
  
  // 自发光
  emissive: 0x000000,
  emissiveIntensity: 1,
  emissiveMap: emissiveTexture,
  
  // 法线贴图
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  
  // 位移贴图
  displacementMap: displacementTexture,
  displacementScale: 1,
  displacementBias: 0,
  
  // 环境遮蔽
  aoMap: aoTexture,
  aoMapIntensity: 1,
  
  // 光照贴图
  lightMap: lightMapTexture,
  lightMapIntensity: 1,
  
  // 环境贴图
  envMap: envTexture,
  envMapIntensity: 1,
  
  // 贴图
  map: texture,
  
  // Alpha贴图
  alphaMap: alphaTexture,
  
  // 透明度
  transparent: false,
  opacity: 1,
  
  // 渲染面
  side: THREE.FrontSide,
  
  // 平面着色
  flatShading: false,
  
  // 线框
  wireframe: false
});
```

### 6.5 物理材质 MeshPhysicalMaterial

```javascript
/**
 * MeshPhysicalMaterial - 物理材质（Standard的扩展）
 * 特点：更高级的PBR特性，如清漆、透射等
 * 使用场景：车漆、玻璃、宝石等特殊材质
 */
const physicalMaterial = new THREE.MeshPhysicalMaterial({
  // 继承Standard的所有属性
  color: 0xffffff,
  metalness: 0,
  roughness: 0.5,
  
  // 清漆效果（涂层）
  clearcoat: 1,              // 清漆强度
  clearcoatRoughness: 0,     // 清漆粗糙度
  clearcoatMap: clearcoatTexture,
  clearcoatRoughnessMap: clearcoatRoughnessTexture,
  clearcoatNormalMap: clearcoatNormalTexture,
  clearcoatNormalScale: new THREE.Vector2(1, 1),
  
  // 透射效果（玻璃等）
  transmission: 0,           // 透射率
  transmissionMap: transmissionTexture,
  thickness: 0.5,            // 厚度
  thicknessMap: thicknessTexture,
  attenuationColor: new THREE.Color(1, 1, 1),  // 衰减颜色
  attenuationDistance: Infinity,                // 衰减距离
  
  // 折射率
  ior: 1.5,                  // 折射率（玻璃约1.5）
  
  // 光泽层
  sheen: 0,                  // 光泽强度
  sheenRoughness: 1,         // 光泽粗糙度
  sheenColor: new THREE.Color(0x000000),
  sheenColorMap: sheenColorTexture,
  sheenRoughnessMap: sheenRoughnessTexture,
  
  // 虹彩效果
  iridescence: 0,            // 虹彩强度
  iridescenceIOR: 1.3,       // 虹彩折射率
  iridescenceThicknessRange: [100, 400],
  iridescenceMap: iridescenceTexture,
  iridescenceThicknessMap: iridescenceThicknessTexture,
  
  // 各向异性
  anisotropy: 0,             // 各向异性强度
  anisotropyRotation: 0,     // 各向异性旋转
  anisotropyMap: anisotropyTexture,
  
  // 镜面强度
  specularIntensity: 1,
  specularIntensityMap: specularIntensityTexture,
  specularColor: new THREE.Color(1, 1, 1),
  specularColorMap: specularColorTexture
});

// 玻璃材质示例
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  thickness: 0.5,
  ior: 1.5,
  transparent: true
});

// 车漆材质示例
const carPaintMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 0.9,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1
});
```

### 6.6 卡通材质 MeshToonMaterial

```javascript
/**
 * MeshToonMaterial - 卡通材质
 * 特点：分层着色，卡通风格
 * 使用场景：卡通渲染、动漫风格
 */
const toonMaterial = new THREE.MeshToonMaterial({
  color: 0xffffff,
  
  // 渐变贴图（控制色阶）
  gradientMap: gradientTexture,
  
  // 自发光
  emissive: 0x000000,
  emissiveIntensity: 1,
  emissiveMap: emissiveTexture,
  
  // 法线贴图
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  
  // 位移贴图
  displacementMap: displacementTexture,
  displacementScale: 1,
  
  // 凹凸贴图
  bumpMap: bumpTexture,
  bumpScale: 1,
  
  // 贴图
  map: texture
});

// 创建渐变纹理实现卡通效果
const colors = new Uint8Array([0, 128, 255]);
const gradientTexture = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.needsUpdate = true;

toonMaterial.gradientMap = gradientTexture;
```

### 6.7 法线材质 MeshNormalMaterial

```javascript
/**
 * MeshNormalMaterial - 法线材质
 * 特点：将法线映射为RGB颜色
 * 使用场景：调试、可视化法线
 */
const normalMaterial = new THREE.MeshNormalMaterial({
  // 法线贴图
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  
  // 位移贴图
  displacementMap: displacementTexture,
  displacementScale: 1,
  
  // 凹凸贴图
  bumpMap: bumpTexture,
  bumpScale: 1,
  
  // 线框
  wireframe: false,
  
  // 平面着色
  flatShading: false
});
```

### 6.8 深度材质 MeshDepthMaterial

```javascript
/**
 * MeshDepthMaterial - 深度材质
 * 特点：根据深度着色
 * 使用场景：深度贴图、阴影、后期效果
 */
const depthMaterial = new THREE.MeshDepthMaterial({
  // 深度打包方式
  depthPacking: THREE.BasicDepthPacking,
  // THREE.RGBADepthPacking - 更高精度
  
  // 位移贴图
  displacementMap: displacementTexture,
  displacementScale: 1,
  displacementBias: 0,
  
  // Alpha贴图
  alphaMap: alphaTexture,
  
  // 贴图（用于alpha测试）
  map: texture,
  
  // 线框
  wireframe: false
});
```

### 6.9 Matcap材质 MeshMatcapMaterial

```javascript
/**
 * MeshMatcapMaterial - Matcap材质
 * 特点：使用预烘焙的球形贴图，不需要光照
 * 使用场景：快速预览、雕刻软件风格
 */
const matcapMaterial = new THREE.MeshMatcapMaterial({
  color: 0xffffff,
  
  // Matcap贴图
  matcap: matcapTexture,
  
  // 法线贴图
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  
  // 位移贴图
  displacementMap: displacementTexture,
  displacementScale: 1,
  
  // 凹凸贴图
  bumpMap: bumpTexture,
  bumpScale: 1,
  
  // 贴图
  map: texture,
  
  // Alpha贴图
  alphaMap: alphaTexture,
  
  // 平面着色
  flatShading: false
});
```

### 6.10 线条材质

```javascript
// ============================================
// 基础线条材质 LineBasicMaterial
// ============================================
const lineBasicMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1,          // 线宽（仅WebGL2有效）
  linecap: 'round',      // 线帽样式
  linejoin: 'round',     // 连接样式
  vertexColors: false,   // 顶点颜色
  fog: true              // 是否受雾影响
});

// ============================================
// 虚线材质 LineDashedMaterial
// ============================================
const lineDashedMaterial = new THREE.LineDashedMaterial({
  color: 0xffffff,
  linewidth: 1,
  scale: 1,              // 虚线比例
  dashSize: 3,           // 虚线长度
  gapSize: 1             // 间隙长度
});

// 使用虚线材质需要计算线段长度
const line = new THREE.Line(geometry, lineDashedMaterial);
line.computeLineDistances();
```

### 6.11 点材质 PointsMaterial

```javascript
/**
 * PointsMaterial - 点材质
 * 使用场景：粒子系统、点云
 */
const pointsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  
  // 点大小
  size: 1,
  
  // 是否根据距离衰减大小
  sizeAttenuation: true,
  
  // 贴图
  map: particleTexture,
  
  // Alpha贴图
  alphaMap: alphaTexture,
  
  // 透明度
  transparent: true,
  opacity: 1,
  
  // Alpha测试
  alphaTest: 0.01,
  
  // 深度写入
  depthWrite: false,
  
  // 混合模式
  blending: THREE.AdditiveBlending,
  
  // 顶点颜色
  vertexColors: false,
  
  // 雾
  fog: true
});
```

### 6.12 精灵材质 SpriteMaterial

```javascript
/**
 * SpriteMaterial - 精灵材质
 * 使用场景：始终面向相机的2D图像，如标签、粒子
 */
const spriteMaterial = new THREE.SpriteMaterial({
  color: 0xffffff,
  
  // 贴图
  map: spriteTexture,
  
  // Alpha贴图
  alphaMap: alphaTexture,
  
  // 透明度
  transparent: true,
  opacity: 1,
  
  // Alpha测试
  alphaTest: 0,
  
  // 旋转
  rotation: 0,
  
  // 是否根据距离衰减大小
  sizeAttenuation: true,
  
  // 深度测试
  depthTest: true,
  depthWrite: false,
  
  // 雾
  fog: true
});

const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(2, 2, 1);
scene.add(sprite);
```

### 6.13 材质通用属性与方法

```javascript
// ============================================
// 通用属性
// ============================================
material.name = 'myMaterial';      // 名称
material.uuid;                      // 唯一ID
material.visible = true;            // 可见性
material.needsUpdate = true;        // 标记需要更新

// ============================================
// 混合模式
// ============================================
material.blending = THREE.NormalBlending;
// THREE.NoBlending
// THREE.NormalBlending
// THREE.AdditiveBlending    - 加法混合
// THREE.SubtractiveBlending - 减法混合
// THREE.MultiplyBlending    - 乘法混合
// THREE.CustomBlending      - 自定义混合

// 自定义混合参数
material.blendEquation = THREE.AddEquation;
material.blendSrc = THREE.SrcAlphaFactor;
material.blendDst = THREE.OneMinusSrcAlphaFactor;

// ============================================
// 深度控制
// ============================================
material.depthTest = true;          // 深度测试
material.depthWrite = true;         // 深度写入
material.depthFunc = THREE.LessEqualDepth;  // 深度函数

// ============================================
// 模板控制
// ============================================
material.stencilWrite = false;
material.stencilFunc = THREE.AlwaysStencilFunc;
material.stencilRef = 0;
material.stencilFuncMask = 0xff;
material.stencilFail = THREE.KeepStencilOp;
material.stencilZFail = THREE.KeepStencilOp;
material.stencilZPass = THREE.KeepStencilOp;
material.stencilWriteMask = 0xff;

// ============================================
// 多边形偏移
// ============================================
material.polygonOffset = false;
material.polygonOffsetFactor = 0;
material.polygonOffsetUnits = 0;

// ============================================
// 剔除
// ============================================
material.side = THREE.FrontSide;
// THREE.FrontSide  - 正面
// THREE.BackSide   - 背面
// THREE.DoubleSide - 双面

// ============================================
// 裁剪平面
// ============================================
const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
material.clippingPlanes = [plane];
material.clipIntersection = false;
material.clipShadows = false;

// ============================================
// 方法
// ============================================
// 克隆材质
const clonedMaterial = material.clone();

// 复制材质
material.copy(otherMaterial);

// 释放材质
material.dispose();

// 设置值
material.setValues({ color: 0xff0000, opacity: 0.5 });

// 转为JSON
const json = material.toJSON();
```

---

## 7. 网格 Mesh

### 7.1 Mesh 基础

```javascript
// ============================================
// 创建网格
// ============================================
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// ============================================
// 网格属性
// ============================================
mesh.name = 'myMesh';           // 名称
mesh.uuid;                       // 唯一ID
mesh.visible = true;             // 可见性

// 位置
mesh.position.set(1, 2, 3);

// 旋转（弧度）
mesh.rotation.set(Math.PI / 4, 0, 0);
mesh.rotation.x = Math.PI / 4;

// 使用欧拉角设置旋转顺序
mesh.rotation.order = 'XYZ';    // 默认

// 使用四元数旋转
mesh.quaternion.setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),
  Math.PI / 4
);

// 缩放
mesh.scale.set(2, 2, 2);

// ============================================
// 变换矩阵
// ============================================
// 更新矩阵
mesh.updateMatrix();
mesh.updateMatrixWorld();

// 访问矩阵
mesh.matrix;           // 局部变换矩阵
mesh.matrixWorld;      // 世界变换矩阵
mesh.normalMatrix;     // 法线矩阵

// 应用矩阵
mesh.applyMatrix4(matrix);

// ============================================
// lookAt - 朝向目标
// ============================================
mesh.lookAt(0, 0, 0);
mesh.lookAt(target.position);
mesh.lookAt(new THREE.Vector3(0, 0, 0));

// ============================================
// 阴影
// ============================================
mesh.castShadow = true;      // 投射阴影
mesh.receiveShadow = true;   // 接收阴影

// ============================================
// 渲染顺序
// ============================================
mesh.renderOrder = 0;        // 渲染顺序

// ============================================
// 视锥剔除
// ============================================
mesh.frustumCulled = true;   // 是否进行视锥剔除
```

### 7.2 InstancedMesh 实例化网格

```javascript
/**
 * InstancedMesh - 实例化网格
 * 使用场景：大量相同几何体的高效渲染，如森林、粒子
 */
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// 创建1000个实例
const count = 1000;
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // 动态更新

scene.add(instancedMesh);

// 设置每个实例的变换
const dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
  // 随机位置
  dummy.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );
  
  // 随机旋转
  dummy.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  
  // 随机缩放
  const scale = Math.random() * 0.5 + 0.5;
  dummy.scale.set(scale, scale, scale);
  
  // 更新矩阵
  dummy.updateMatrix();
  
  // 设置实例矩阵
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

// 标记需要更新
instancedMesh.instanceMatrix.needsUpdate = true;

// ============================================
// 实例颜色
// ============================================
instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(
  new Float32Array(count * 3), 3
);

for (let i = 0; i < count; i++) {
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  instancedMesh.setColorAt(i, color);
}
instancedMesh.instanceColor.needsUpdate = true;

// ============================================
// 获取实例数据
// ============================================
const matrix = new THREE.Matrix4();
instancedMesh.getMatrixAt(0, matrix);

const color = new THREE.Color();
instancedMesh.getColorAt(0, color);

// ============================================
// 动态更新实例
// ============================================
function animate() {
  for (let i = 0; i < count; i++) {
    instancedMesh.getMatrixAt(i, matrix);
    
    // 修改矩阵...
    matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    dummy.rotation.y += 0.01;
    dummy.updateMatrix();
    
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
}

// ============================================
// 射线检测实例
// ============================================
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObject(instancedMesh);

if (intersects.length > 0) {
  const instanceId = intersects[0].instanceId;
  console.log('Clicked instance:', instanceId);
}
```

### 7.3 SkinnedMesh 蒙皮网格

```javascript
/**
 * SkinnedMesh - 蒙皮网格
 * 使用场景：骨骼动画，如角色动画
 */
// 通常通过加载器获取
loader.load('model.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isSkinnedMesh) {
      // 访问骨骼
      const skeleton = child.skeleton;
      console.log('Bones:', skeleton.bones);
      
      // 绑定模式
      child.bindMode = THREE.AttachedBindMode;
      // THREE.AttachedBindMode - 绑定到父级
      // THREE.DetachedBindMode - 独立绑定
      
      // 获取骨骼矩阵
      const boneMatrices = skeleton.boneMatrices;
      
      // 更新骨骼
      skeleton.update();
      
      // 重新绑定骨骼
      child.bind(skeleton);
    }
  });
});

// 手动创建骨骼
const bones = [];
const bone1 = new THREE.Bone();
const bone2 = new THREE.Bone();

bone1.position.y = 0;
bone2.position.y = 1;

bone1.add(bone2);
bones.push(bone1, bone2);

const skeleton = new THREE.Skeleton(bones);

const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
skinnedMesh.add(bones[0]);
skinnedMesh.bind(skeleton);
```

### 7.4 BatchedMesh 批处理网格

```javascript
/**
 * BatchedMesh - 批处理网格（Three.js r159+）
 * 使用场景：大量不同几何体的高效渲染
 */
const batchedMesh = new THREE.BatchedMesh(
  100,    // 最大几何体数量
  10000,  // 最大顶点数
  20000,  // 最大索引数
  material
);

scene.add(batchedMesh);

// 添加几何体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);

const boxId = batchedMesh.addGeometry(boxGeometry);
const sphereId = batchedMesh.addGeometry(sphereGeometry);

// 添加实例
const boxInstanceId = batchedMesh.addInstance(boxId);
const sphereInstanceId = batchedMesh.addInstance(sphereId);

// 设置实例变换
const matrix = new THREE.Matrix4();
matrix.setPosition(1, 0, 0);
batchedMesh.setMatrixAt(boxInstanceId, matrix);

matrix.setPosition(-1, 0, 0);
batchedMesh.setMatrixAt(sphereInstanceId, matrix);

// 设置实例颜色
batchedMesh.setColorAt(boxInstanceId, new THREE.Color(0xff0000));
batchedMesh.setColorAt(sphereInstanceId, new THREE.Color(0x00ff00));

// 设置实例可见性
batchedMesh.setVisibleAt(boxInstanceId, true);
```

### 7.5 Object3D 基类

```javascript
/**
 * Object3D - 所有3D对象的基类
 * Mesh、Group、Light、Camera等都继承自Object3D
 */
const object = new THREE.Object3D();

// ============================================
// 层级关系
// ============================================
// 添加子对象
object.add(child);
object.add(child1, child2, child3);

// 移除子对象
object.remove(child);

// 移除所有子对象
object.clear();

// 获取父对象
const parent = object.parent;

// 获取子对象
const children = object.children;

// ============================================
// 查找对象
// ============================================
// 按名称查找
const found = object.getObjectByName('myMesh');

// 按ID查找
const foundById = object.getObjectById(12);

// 按属性查找
const foundByProperty = object.getObjectByProperty('uuid', 'xxx');

// ============================================
// 遍历
// ============================================
object.traverse((child) => {
  console.log(child.name);
});

object.traverseVisible((child) => {
  // 只遍历可见对象
});

object.traverseAncestors((ancestor) => {
  // 遍历祖先
});

// ============================================
// 世界坐标
// ============================================
const worldPosition = new THREE.Vector3();
object.getWorldPosition(worldPosition);

const worldQuaternion = new THREE.Quaternion();
object.getWorldQuaternion(worldQuaternion);

const worldScale = new THREE.Vector3();
object.getWorldScale(worldScale);

const worldDirection = new THREE.Vector3();
object.getWorldDirection(worldDirection);

// ============================================
// 本地/世界坐标转换
// ============================================
// 世界坐标转本地坐标
const localPoint = object.worldToLocal(worldPoint.clone());

// 本地坐标转世界坐标
const worldPoint = object.localToWorld(localPoint.clone());

// ============================================
// 用户数据
// ============================================
object.userData = {
  id: 1,
  type: 'enemy',
  health: 100
};

// ============================================
// 图层
// ============================================
object.layers.set(0);      // 设置为图层0
object.layers.enable(1);   // 启用图层1
object.layers.disable(1);  // 禁用图层1
object.layers.toggle(1);   // 切换图层1
object.layers.test(camera.layers);  // 测试是否与相机图层匹配

// ============================================
// 克隆与复制
// ============================================
const clone = object.clone();           // 浅克隆
const deepClone = object.clone(true);   // 深克隆

object.copy(otherObject);               // 复制属性
```

### 7.6 Group 组

```javascript
/**
 * Group - 对象组
 * 使用场景：组织多个对象，统一变换
 */
const group = new THREE.Group();
group.name = 'myGroup';

// 添加对象到组
group.add(mesh1);
group.add(mesh2);
group.add(mesh3);

scene.add(group);

// 整体变换
group.position.set(0, 5, 0);
group.rotation.y = Math.PI / 4;
group.scale.set(2, 2, 2);

// 遍历组中的对象
group.traverse((child) => {
  if (child.isMesh) {
    child.material.color.setHex(0xff0000);
  }
});
```

---

## 8. 光源 Light

### 8.1 环境光 AmbientLight

```javascript
/**
 * AmbientLight - 环境光
 * 特点：均匀照亮所有物体，无方向，无阴影
 * 使用场景：提供基础照明，避免完全黑暗
 */
const ambientLight = new THREE.AmbientLight(
  0xffffff,  // 颜色
  0.5        // 强度
);
scene.add(ambientLight);

// 动态修改
ambientLight.color.setHex(0xffffff);
ambientLight.intensity = 1;
```

### 8.2 平行光 DirectionalLight

```javascript
/**
 * DirectionalLight - 平行光/方向光
 * 特点：平行光线，模拟太阳光
 * 使用场景：室外场景、主光源
 */
const directionalLight = new THREE.DirectionalLight(
  0xffffff,  // 颜色
  1          // 强度
);

// 位置（决定光线方向）
directionalLight.position.set(5, 10, 7.5);

// 目标（光线指向）
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight.target);  // 需要添加target到场景

scene.add(directionalLight);

// ============================================
// 阴影设置
// ============================================
directionalLight.castShadow = true;

// 阴影贴图大小
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 阴影相机（正交相机）
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

// 阴影偏移
directionalLight.shadow.bias = -0.0001;
directionalLight.shadow.normalBias = 0.02;

// 阴影模糊（仅VSMShadowMap）
directionalLight.shadow.radius = 4;

// ============================================
// 阴影相机辅助器
// ============================================
const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(shadowHelper);
```

### 8.3 点光源 PointLight

```javascript
/**
 * PointLight - 点光源
 * 特点：从一点向所有方向发射光线
 * 使用场景：灯泡、蜡烛、火把
 */
const pointLight = new THREE.PointLight(
  0xffffff,  // 颜色
  1,         // 强度
  100,       // 距离（0=无限）
  2          // 衰减因子
);

pointLight.position.set(0, 5, 0);
scene.add(pointLight);

// ============================================
// 阴影设置
// ============================================
pointLight.castShadow = true;

// 阴影贴图大小
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

// 阴影相机（透视相机）
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 100;
pointLight.shadow.camera.fov = 90;

// 阴影偏移
pointLight.shadow.bias = -0.0001;
pointLight.shadow.normalBias = 0.02;

// ============================================
// 辅助器
// ============================================
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);
```

### 8.4 聚光灯 SpotLight

```javascript
/**
 * SpotLight - 聚光灯
 * 特点：圆锥形光照，有方向性
 * 使用场景：手电筒、舞台灯、车灯
 */
const spotLight = new THREE.SpotLight(
  0xffffff,       // 颜色
  1,              // 强度
  100,            // 距离
  Math.PI / 6,    // 角度（弧度）
  0.5,            // 边缘柔和度（0-1）
  2               // 衰减因子
);

spotLight.position.set(0, 10, 0);
spotLight.target.position.set(0, 0, 0);

scene.add(spotLight);
scene.add(spotLight.target);

// ============================================
// 阴影设置
// ============================================
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.fov = 30;

spotLight.shadow.bias = -0.0001;
spotLight.shadow.normalBias = 0.02;

// 聚光灯特有：投射贴图
spotLight.map = spotTexture;

// ============================================
// 辅助器
// ============================================
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// 更新辅助器（光源变化后）
spotLightHelper.update();
```

### 8.5 半球光 HemisphereLight

```javascript
/**
 * HemisphereLight - 半球光
 * 特点：从上方（天空色）和下方（地面色）照射
 * 使用场景：室外环境光，模拟天空和地面反射
 */
const hemisphereLight = new THREE.HemisphereLight(
  0x87ceeb,  // 天空颜色
  0x8b4513,  // 地面颜色
  1          // 强度
);

hemisphereLight.position.set(0, 50, 0);
scene.add(hemisphereLight);

// 动态修改
hemisphereLight.color.setHex(0x87ceeb);      // 天空色
hemisphereLight.groundColor.setHex(0x8b4513); // 地面色

// ============================================
// 辅助器
// ============================================
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5);
scene.add(hemisphereLightHelper);
```

### 8.6 区域光 RectAreaLight

```javascript
/**
 * RectAreaLight - 矩形区域光
 * 特点：从矩形平面发射光线
 * 使用场景：窗户光、电视屏幕、软盒
 * 注意：只对MeshStandardMaterial和MeshPhysicalMaterial有效
 */
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

// 初始化（必须）
RectAreaLightUniformsLib.init();

const rectAreaLight = new THREE.RectAreaLight(
  0xffffff,  // 颜色
  5,         // 强度
  4,         // 宽度
  2          // 高度
);

rectAreaLight.position.set(0, 5, 5);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

// 辅助器
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// 注意：RectAreaLight不支持阴影
```

### 8.7 光照探针 LightProbe

```javascript
/**
 * LightProbe - 光照探针
 * 特点：使用球谐函数存储光照信息
 * 使用场景：基于图像的光照(IBL)、环境光照
 */
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator';

// 从立方体贴图生成光照探针
const lightProbe = new THREE.LightProbe();

cubeTextureLoader.load(
  ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
  (cubeTexture) => {
    lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));
    scene.add(lightProbe);
  }
);

// 从渲染目标生成
const lightProbe2 = LightProbeGenerator.fromCubeRenderTarget(
  renderer, cubeRenderTarget
);
```

### 8.8 光源组合示例

```javascript
// ============================================
// 室内光照设置
// ============================================
function setupIndoorLighting() {
  // 环境光 - 基础照明
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  
  // 主光源 - 模拟窗户光
  const mainLight = new THREE.DirectionalLight(0xfffaf0, 1);
  mainLight.position.set(5, 10, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);
  
  // 填充光 - 减少阴影区域
  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);
  
  // 点光源 - 模拟灯具
  const pointLight = new THREE.PointLight(0xffa500, 0.5, 10, 2);
  pointLight.position.set(0, 3, 0);
  scene.add(pointLight);
}

// ============================================
// 室外光照设置
// ============================================
function setupOutdoorLighting() {
  // 半球光 - 天空和地面
  const hemi = new THREE.HemisphereLight(0x87ceeb, 0x556b2f, 0.6);
  scene.add(hemi);
  
  // 太阳光
  const sun = new THREE.DirectionalLight(0xfff5e6, 1);
  sun.position.set(50, 100, 50);
  sun.castShadow = true;
  
  // 大范围阴影
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;
  
  scene.add(sun);
}

// ============================================
// 舞台光照设置
// ============================================
function setupStageLighting() {
  // 主聚光灯
  const mainSpot = new THREE.SpotLight(0xffffff, 2, 50, Math.PI / 8, 0.5, 2);
  mainSpot.position.set(0, 20, 10);
  mainSpot.castShadow = true;
  scene.add(mainSpot);
  
  // 彩色聚光灯
  const redSpot = new THREE.SpotLight(0xff0000, 1, 30, Math.PI / 6, 0.8, 2);
  redSpot.position.set(-10, 15, 5);
  scene.add(redSpot);
  
  const blueSpot = new THREE.SpotLight(0x0000ff, 1, 30, Math.PI / 6, 0.8, 2);
  blueSpot.position.set(10, 15, 5);
  scene.add(blueSpot);
}
```

---

## 9. 纹理 Texture

### 9.1 纹理加载

```javascript
// ============================================
// TextureLoader - 基础纹理加载器
// ============================================
const textureLoader = new THREE.TextureLoader();

// 同步风格（异步执行）
const texture = textureLoader.load(
  'texture.jpg',
  // 加载成功回调
  (texture) => {
    console.log('Texture loaded');
  },
  // 加载进度回调
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // 加载错误回调
  (error) => {
    console.error('Error loading texture', error);
  }
);

// Promise风格
const loadTextureAsync = (url) => {
  return new Promise((resolve, reject) => {
    textureLoader.load(url, resolve, undefined, reject);
  });
};

// 使用
const texture = await loadTextureAsync('texture.jpg');

// ============================================
// 批量加载纹理
// ============================================
const loadingManager = new THREE.LoadingManager(
  // 全部加载完成
  () => console.log('All textures loaded'),
  // 进度
  (url, loaded, total) => console.log(`Loading: ${loaded}/${total}`),
  // 错误
  (url) => console.error(`Error loading: ${url}`)
);

const textureLoader = new THREE.TextureLoader(loadingManager);

const textures = {
  map: textureLoader.load('color.jpg'),
  normalMap: textureLoader.load('normal.jpg'),
  roughnessMap: textureLoader.load('roughness.jpg')
};
```

### 9.2 纹理类型

```javascript
// ============================================
// CubeTextureLoader - 立方体贴图
// ============================================
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  'px.jpg', 'nx.jpg',  // +X, -X
  'py.jpg', 'ny.jpg',  // +Y, -Y
  'pz.jpg', 'nz.jpg'   // +Z, -Z
]);

// 用作环境贴图
scene.background = cubeTexture;
scene.environment = cubeTexture;

// ============================================
// HDR纹理（RGBELoader）
// ============================================
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('environment.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// ============================================
// EXR纹理（EXRLoader）
// ============================================
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

const exrLoader = new EXRLoader();
exrLoader.load('environment.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

// ============================================
// KTX2纹理（压缩纹理）
// ============================================
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('basis/');
ktx2Loader.detectSupport(renderer);

ktx2Loader.load('texture.ktx2', (texture) => {
  material.map = texture;
});

// ============================================
// 视频纹理
// ============================================
const video = document.createElement('video');
video.src = 'video.mp4';
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({
  map: videoTexture
});

// ============================================
// Canvas纹理
// ============================================
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 512;

// 绘制内容
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 512, 512);
ctx.fillStyle = '#000000';
ctx.font = '48px Arial';
ctx.fillText('Hello Three.js', 50, 256);

const canvasTexture = new THREE.CanvasTexture(canvas);

// 更新Canvas纹理
function updateCanvasTexture() {
  // 修改canvas内容...
  canvasTexture.needsUpdate = true;
}

// ============================================
// 数据纹理
// ============================================
const width = 256;
const height = 256;
const size = width * height;
const data = new Uint8Array(4 * size);

// 填充数据
for (let i = 0; i < size; i++) {
  const stride = i * 4;
  data[stride] = Math.random() * 255;     // R
  data[stride + 1] = Math.random() * 255; // G
  data[stride + 2] = Math.random() * 255; // B
  data[stride + 3] = 255;                  // A
}

const dataTexture = new THREE.DataTexture(
  data,
  width,
  height,
  THREE.RGBAFormat
);
dataTexture.needsUpdate = true;

// ============================================
// 3D纹理
// ============================================
const data3D = new Uint8Array(width * height * depth);
// 填充数据...

const dataTexture3D = new THREE.Data3DTexture(data3D, width, height, depth);
dataTexture3D.format = THREE.RedFormat;
dataTexture3D.minFilter = THREE.LinearFilter;
dataTexture3D.magFilter = THREE.LinearFilter;
dataTexture3D.needsUpdate = true;

// ============================================
// 深度纹理
// ============================================
const depthTexture = new THREE.DepthTexture(width, height);
depthTexture.format = THREE.DepthFormat;
depthTexture.type = THREE.UnsignedShortType;
// THREE.UnsignedIntType - 32位
// THREE.FloatType - 浮点

const renderTarget = new THREE.WebGLRenderTarget(width, height, {
  depthTexture: depthTexture
});
```

### 9.3 纹理属性

```javascript
const texture = textureLoader.load('texture.jpg');

// ============================================
// 重复与偏移
// ============================================
// 重复次数
texture.repeat.set(2, 2);

// 偏移
texture.offset.set(0.5, 0.5);

// 中心点（旋转中心）
texture.center.set(0.5, 0.5);

// 旋转（弧度）
texture.rotation = Math.PI / 4;

// ============================================
// 环绕模式
// ============================================
texture.wrapS = THREE.RepeatWrapping;      // 水平方向
texture.wrapT = THREE.RepeatWrapping;      // 垂直方向

// 可选值：
// THREE.RepeatWrapping     - 重复
// THREE.ClampToEdgeWrapping - 边缘拉伸
// THREE.MirroredRepeatWrapping - 镜像重复

// ============================================
// 过滤方式
// ============================================
// 缩小过滤
texture.minFilter = THREE.LinearMipmapLinearFilter;
// THREE.NearestFilter - 最近邻（像素化）
// THREE.NearestMipmapNearestFilter
// THREE.NearestMipmapLinearFilter
// THREE.LinearFilter - 线性
// THREE.LinearMipmapNearestFilter
// THREE.LinearMipmapLinearFilter（默认）

// 放大过滤
texture.magFilter = THREE.LinearFilter;
// THREE.NearestFilter
// THREE.LinearFilter（默认）

// ============================================
// Mipmap
// ============================================
texture.generateMipmaps = true;  // 是否生成mipmap

// ============================================
// 各向异性过滤
// ============================================
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
texture.anisotropy = maxAnisotropy;  // 通常是16

// ============================================
// 颜色空间
// ============================================
texture.colorSpace = THREE.SRGBColorSpace;  // 颜色贴图
// THREE.SRGBColorSpace    - sRGB（颜色贴图）
// THREE.LinearSRGBColorSpace - 线性（数据贴图如法线、粗糙度）

// ============================================
// 翻转
// ============================================
texture.flipY = true;  // 垂直翻转（默认true）

// ============================================
// 预乘Alpha
// ============================================
texture.premultiplyAlpha = false;

// ============================================
// 格式
// ============================================
texture.format = THREE.RGBAFormat;
// THREE.AlphaFormat
// THREE.RedFormat
// THREE.RedIntegerFormat
// THREE.RGFormat
// THREE.RGIntegerFormat
// THREE.RGBFormat
// THREE.RGBAFormat
// THREE.RGBAIntegerFormat
// THREE.LuminanceFormat
// THREE.LuminanceAlphaFormat
// THREE.DepthFormat
// THREE.DepthStencilFormat

// ============================================
// 类型
// ============================================
texture.type = THREE.UnsignedByteType;
// THREE.UnsignedByteType
// THREE.ByteType
// THREE.ShortType
// THREE.UnsignedShortType
// THREE.IntType
// THREE.UnsignedIntType
// THREE.FloatType
// THREE.HalfFloatType

// ============================================
// 更新与释放
// ============================================
texture.needsUpdate = true;  // 标记更新
texture.dispose();           // 释放纹理
```

### 9.4 纹理使用场景

```javascript
// ============================================
// PBR材质完整纹理设置
// ============================================
const material = new THREE.MeshStandardMaterial({
  // 颜色贴图
  map: textureLoader.load('color.jpg'),
  
  // 法线贴图 - 添加表面细节
  normalMap: textureLoader.load('normal.jpg'),
  normalScale: new THREE.Vector2(1, 1),
  
  // 粗糙度贴图
  roughnessMap: textureLoader.load('roughness.jpg'),
  
  // 金属度贴图
  metalnessMap: textureLoader.load('metalness.jpg'),
  
  // 环境遮蔽贴图
  aoMap: textureLoader.load('ao.jpg'),
  aoMapIntensity: 1,
  
  // 位移贴图 - 实际改变几何体
  displacementMap: textureLoader.load('displacement.jpg'),
  displacementScale: 0.1,
  
  // 自发光贴图
  emissiveMap: textureLoader.load('emissive.jpg'),
  emissive: 0xffffff,
  emissiveIntensity: 1,
  
  // Alpha贴图
  alphaMap: textureLoader.load('alpha.jpg'),
  transparent: true
});

// 注意：使用aoMap需要第二套UV
geometry.setAttribute('uv2', 
  new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
);

// ============================================
// 环境贴图反射
// ============================================
const envMap = cubeTextureLoader.load([...]);

const reflectiveMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0,
  envMap: envMap,
  envMapIntensity: 1
});

// ============================================
// 折射效果
// ============================================
const envMap = cubeTextureLoader.load([...]);
envMap.mapping = THREE.CubeRefractionMapping;

const refractiveMaterial = new THREE.MeshBasicMaterial({
  envMap: envMap,
  refractionRatio: 0.98
});

// ============================================
// 纹理动画
// ============================================
function animateTexture() {
  texture.offset.x += 0.01;
  texture.offset.y += 0.01;
}

// ============================================
// 精灵图动画
// ============================================
class SpriteAnimation {
  constructor(texture, tilesHoriz, tilesVert, totalFrames, fps) {
    this.texture = texture;
    this.tilesHoriz = tilesHoriz;
    this.tilesVert = tilesVert;
    this.totalFrames = totalFrames;
    this.fps = fps;
    this.currentFrame = 0;
    this.lastTime = 0;
    
    texture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
  }
  
  update(time) {
    if (time - this.lastTime > 1000 / this.fps) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      
      const col = this.currentFrame % this.tilesHoriz;
      const row = Math.floor(this.currentFrame / this.tilesHoriz);
      
      this.texture.offset.x = col / this.tilesHoriz;
      this.texture.offset.y = 1 - (row + 1) / this.tilesVert;
      
      this.lastTime = time;
    }
  }
}
```

---

## 10. 加载器 Loader

### 10.1 GLTF加载器

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// ============================================
// 基础加载
// ============================================
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  'model.glb',
  (gltf) => {
    // gltf.scene - 场景（Object3D）
    // gltf.scenes - 所有场景
    // gltf.cameras - 相机
    // gltf.animations - 动画
    // gltf.asset - 资源信息
    
    scene.add(gltf.scene);
    
    // 处理动画
    if (gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  },
  (progress) => {
    console.log((progress.loaded / progress.total * 100) + '%');
  },
  (error) => {
    console.error('Error:', error);
  }
);

// ============================================
// 使用Draco压缩
// ============================================
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');  // Draco解码器路径
dracoLoader.preload();

gltfLoader.setDRACOLoader(dracoLoader);

// ============================================
// 使用KTX2纹理
// ============================================
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('basis/');
ktx2Loader.detectSupport(renderer);

gltfLoader.setKTX2Loader(ktx2Loader);

// ============================================
// 处理加载的模型
// ============================================
function processModel(gltf) {
  const model = gltf.scene;
  
  // 遍历所有网格
  model.traverse((child) => {
    if (child.isMesh) {
      // 启用阴影
      child.castShadow = true;
      child.receiveShadow = true;
      
      // 修改材质
      if (child.material) {
        child.material.envMap = envMap;
        child.material.envMapIntensity = 1;
      }
    }
  });
  
  // 调整大小
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 1 / maxDim;
  model.scale.setScalar(scale);
  
  // 居中
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center.multiplyScalar(scale));
  
  return model;
}

// ============================================
// Promise封装
// ============================================
function loadGLTF(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, resolve, undefined, reject);
  });
}

// 使用
const gltf = await loadGLTF('model.glb');
```

### 10.2 FBX加载器

```javascript
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const fbxLoader = new FBXLoader();

fbxLoader.load('model.fbx', (fbx) => {
  // FBX可能包含动画
  if (fbx.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(fbx);
    const action = mixer.clipAction(fbx.animations[0]);
    action.play();
  }
  
  // 调整比例（FBX单位通常是厘米）
  fbx.scale.setScalar(0.01);
  
  scene.add(fbx);
});
```

### 10.3 OBJ加载器

```javascript
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// ============================================
// 仅加载OBJ
// ============================================
const objLoader = new OBJLoader();

objLoader.load('model.obj', (obj) => {
  scene.add(obj);
});

// ============================================
// 加载OBJ和MTL材质
// ============================================
const mtlLoader = new MTLLoader();

mtlLoader.load('model.mtl', (materials) => {
  materials.preload();
  
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  
  objLoader.load('model.obj', (obj) => {
    scene.add(obj);
  });
});
```

### 10.4 其他加载器

```javascript
// ============================================
// PLY加载器（点云）
// ============================================
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

const plyLoader = new PLYLoader();
plyLoader.load('model.ply', (geometry) => {
  geometry.computeVertexNormals();
  
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

// ============================================
// STL加载器（3D打印）
// ============================================
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const stlLoader = new STLLoader();
stlLoader.load('model.stl', (geometry) => {
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

// ============================================
// SVG加载器
// ============================================
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

const svgLoader = new SVGLoader();
svgLoader.load('image.svg', (data) => {
  const paths = data.paths;
  const group = new THREE.Group();
  
  paths.forEach((path) => {
    const material = new THREE.MeshBasicMaterial({
      color: path.color,
      side: THREE.DoubleSide
    });
    
    const shapes = SVGLoader.createShapes(path);
    shapes.forEach((shape) => {
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    });
  });
  
  scene.add(group);
});

// ============================================
// PDB加载器（分子结构）
// ============================================
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';

const pdbLoader = new PDBLoader();
pdbLoader.load('molecule.pdb', (pdb) => {
  const { geometryAtoms, geometryBonds, json } = pdb;
  // 处理原子和键...
});

// ============================================
// 3DS加载器
// ============================================
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';

const tdsLoader = new TDSLoader();
tdsLoader.load('model.3ds', (object) => {
  scene.add(object);
});

// ============================================
// Collada加载器（.dae）
// ============================================
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

const colladaLoader = new ColladaLoader();
colladaLoader.load('model.dae', (collada) => {
  scene.add(collada.scene);
});
```

### 10.5 LoadingManager 加载管理器

```javascript
// ============================================
// 创建加载管理器
// ============================================
const loadingManager = new THREE.LoadingManager();

// 加载开始
loadingManager.onStart = (url, loaded, total) => {
  console.log(`Started loading: ${url}`);
  console.log(`Loading ${loaded} of ${total}`);
};

// 加载进度
loadingManager.onProgress = (url, loaded, total) => {
  const progress = (loaded / total * 100).toFixed(2);
  console.log(`Loading: ${progress}%`);
  updateProgressBar(progress);
};

// 加载完成
loadingManager.onLoad = () => {
  console.log('All resources loaded');
  hideLoadingScreen();
};

// 加载错误
loadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
};

// ============================================
// 使用加载管理器
// ============================================
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const audioLoader = new THREE.AudioLoader(loadingManager);

// 所有这些加载器共享同一个加载管理器
const texture1 = textureLoader.load('texture1.jpg');
const texture2 = textureLoader.load('texture2.jpg');
gltfLoader.load('model.glb', (gltf) => { ... });
audioLoader.load('sound.mp3', (buffer) => { ... });

// ============================================
// URL修改器
// ============================================
loadingManager.setURLModifier((url) => {
  // 可以修改资源URL
  return 'https://cdn.example.com/' + url;
});

// ============================================
// 自定义加载进度UI
// ============================================
class LoadingScreen {
  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-progress">0%</div>
        <div class="loading-text">Loading...</div>
      </div>
    `;
    document.body.appendChild(this.overlay);
  }
  
  updateProgress(progress) {
    this.overlay.querySelector('.loading-progress').textContent = 
      `${Math.round(progress)}%`;
  }
  
  hide() {
    this.overlay.classList.add('fade-out');
    setTimeout(() => this.overlay.remove(), 500);
  }
}

const loadingScreen = new LoadingScreen();

loadingManager.onProgress = (url, loaded, total) => {
  loadingScreen.updateProgress(loaded / total * 100);
};

loadingManager.onLoad = () => {
  loadingScreen.hide();
};
```

---

## 11. 动画系统 Animation

### 11.1 AnimationMixer 动画混合器

```javascript
/**
 * AnimationMixer - 动画混合器
 * 用于管理和播放对象的所有动画
 */
const mixer = new THREE.AnimationMixer(model);

// 在渲染循环中更新
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  mixer.update(delta);
  
  renderer.render(scene, camera);
}

// ============================================
// 基本属性
// ============================================
mixer.time;           // 当前时间
mixer.timeScale = 1;  // 全局时间缩放

// ============================================
// 事件监听
// ============================================
mixer.addEventListener('loop', (e) => {
  console.log('Animation looped:', e.action.getClip().name);
});

mixer.addEventListener('finished', (e) => {
  console.log('Animation finished:', e.action.getClip().name);
});

// ============================================
// 方法
// ============================================
// 创建动作
const action = mixer.clipAction(animationClip);

// 获取根对象
const root = mixer.getRoot();

// 停止所有动作
mixer.stopAllAction();

// 根据名称获取动作
const existingAction = mixer.existingAction(animationClip);

// 取消缓存的动作
mixer.uncacheAction(animationClip);
mixer.uncacheClip(animationClip);
mixer.uncacheRoot(model);
```

### 11.2 AnimationAction 动画动作

```javascript
// 创建动作
const action = mixer.clipAction(animationClip);

// ============================================
// 播放控制
// ============================================
action.play();       // 播放
action.stop();       // 停止
action.reset();      // 重置
action.halt(1);      // 在1秒后停止

// ============================================
// 暂停与恢复
// ============================================
action.paused = true;   // 暂停
action.paused = false;  // 恢复

// ============================================
// 时间控制
// ============================================
action.time = 0;              // 当前时间
action.timeScale = 1;         // 时间缩放（-1为倒放）
action.setDuration(5);        // 设置持续时间

// ============================================
// 循环模式
// ============================================
action.loop = THREE.LoopRepeat;   // 循环模式
// THREE.LoopOnce      - 播放一次
// THREE.LoopRepeat    - 重复播放
// THREE.LoopPingPong  - 来回播放

action.repetitions = Infinity;    // 重复次数
action.clampWhenFinished = true;  // 结束时保持最后一帧

// ============================================
// 权重（混合多个动画）
// ============================================
action.weight = 1;                    // 权重
action.setEffectiveWeight(1);         // 设置有效权重
action.getEffectiveWeight();          // 获取有效权重
action.enabled = true;                // 启用/禁用

// ============================================
// 淡入淡出
// ============================================
action.fadeIn(0.5);                   // 0.5秒淡入
action.fadeOut(0.5);                  // 0.5秒淡出
action.crossFadeFrom(oldAction, 0.5); // 从其他动作淡入
action.crossFadeTo(newAction, 0.5);   // 淡出到其他动作

// ============================================
// 混合模式
// ============================================
action.blendMode = THREE.NormalAnimationBlendMode;
// THREE.NormalAnimationBlendMode   - 正常混合
// THREE.AdditiveAnimationBlendMode - 叠加混合

// ============================================
// 动画状态
// ============================================
action.isRunning();     // 是否正在运行
action.isScheduled();   // 是否已调度
```

### 11.3 AnimationClip 动画剪辑

```javascript
// ============================================
// 创建动画剪辑
// ============================================
const times = [0, 1, 2];  // 关键帧时间
const values = [0, 0, 0, 0, 1, 0, 0, 2, 0];  // 关键帧值

const positionKF = new THREE.VectorKeyframeTrack(
  '.position',  // 属性路径
  times,
  values
);

const clip = new THREE.AnimationClip(
  'myAnimation',  // 名称
  3,              // 持续时间（-1自动计算）
  [positionKF]    // 关键帧轨道数组
);

// ============================================
// KeyframeTrack 类型
// ============================================
// 数值轨道
const numberKF = new THREE.NumberKeyframeTrack(
  '.material.opacity',
  [0, 1, 2],
  [1, 0.5, 1]
);

// 向量轨道
const vectorKF = new THREE.VectorKeyframeTrack(
  '.position',
  [0, 1, 2],
  [0, 0, 0, 1, 2, 0, 2, 0, 0]
);

// 四元数轨道
const quaternionKF = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  [0, 1],
  [0, 0, 0, 1, 0, 0.707, 0, 0.707]
);

// 颜色轨道
const colorKF = new THREE.ColorKeyframeTrack(
  '.material.color',
  [0, 1, 2],
  [1, 0, 0, 0, 1, 0, 0, 0, 1]  // RGB值
);

// 布尔轨道
const boolKF = new THREE.BooleanKeyframeTrack(
  '.visible',
  [0, 1],
  [true, false]
);

// 字符串轨道
const stringKF = new THREE.StringKeyframeTrack(
  '.name',
  [0, 1],
  ['state1', 'state2']
);

// ============================================
// 插值模式
// ============================================
positionKF.setInterpolation(THREE.InterpolateLinear);
// THREE.InterpolateDiscrete - 离散（无插值）
// THREE.InterpolateLinear   - 线性插值
// THREE.InterpolateSmooth   - 平滑插值

// ============================================
// 动画剪辑操作
// ============================================
// 优化
clip.optimize();

// 修剪
clip.trim();

// 重置持续时间
clip.resetDuration();

// 验证
THREE.AnimationClip.validate(clip);

// ============================================
// 从模型中提取动画
// ============================================
gltfLoader.load('model.glb', (gltf) => {
  const clips = gltf.animations;
  
  clips.forEach((clip) => {
    console.log(clip.name, clip.duration);
    
    const action = mixer.clipAction(clip);
    action.play();
  });
});

// 按名称查找动画
const walkClip = THREE.AnimationClip.findByName(clips, 'walk');
```

### 11.4 动画混合示例

```javascript
// ============================================
// 动画状态机
// ============================================
class AnimationStateMachine {
  constructor(mixer, clips) {
    this.mixer = mixer;
    this.actions = {};
    this.currentAction = null;
    
    // 创建所有动作
    clips.forEach((clip) => {
      this.actions[clip.name] = mixer.clipAction(clip);
    });
  }
  
  play(name, fadeTime = 0.5) {
    const newAction = this.actions[name];
    if (!newAction) return;
    
    if (this.currentAction && this.currentAction !== newAction) {
      // 淡出当前动作
      this.currentAction.fadeOut(fadeTime);
    }
    
    // 淡入新动作
    newAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(fadeTime)
      .play();
    
    this.currentAction = newAction;
  }
  
  setTimeScale(name, scale) {
    if (this.actions[name]) {
      this.actions[name].timeScale = scale;
    }
  }
}

// 使用
const animationSM = new AnimationStateMachine(mixer, gltf.animations);
animationSM.play('idle');

// 切换到行走
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') {
    animationSM.play('walk');
  }
});

// ============================================
// 叠加动画
// ============================================
// 基础动画
const baseAction = mixer.clipAction(walkClip);
baseAction.play();

// 叠加动画（如挥手）
const additiveAction = mixer.clipAction(waveClip);
additiveAction.blendMode = THREE.AdditiveAnimationBlendMode;
additiveAction.weight = 0.5;  // 部分叠加
additiveAction.play();
```

### 11.5 程序化动画

```javascript
// ============================================
// 使用requestAnimationFrame
// ============================================
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转
  mesh.rotation.y += 0.01;
  
  // 浮动效果
  mesh.position.y = Math.sin(Date.now() * 0.001) * 0.5;
  
  renderer.render(scene, camera);
}

// ============================================
// 使用GSAP
// ============================================
import { gsap } from 'gsap';

// 简单动画
gsap.to(mesh.position, {
  x: 5,
  duration: 2,
  ease: 'power2.inOut'
});

// 旋转动画
gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  duration: 3,
  repeat: -1,
  ease: 'none'
});

// 时间线
const tl = gsap.timeline({ repeat: -1 });
tl.to(mesh.position, { x: 2, duration: 1 })
  .to(mesh.position, { y: 2, duration: 1 })
  .to(mesh.position, { x: 0, y: 0, duration: 1 });

// 材质动画
gsap.to(mesh.material, {
  opacity: 0,
  duration: 1,
  onUpdate: () => {
    mesh.material.needsUpdate = true;
  }
});

// 颜色动画
gsap.to(mesh.material.color, {
  r: 1, g: 0, b: 0,
  duration: 2
});

// ============================================
// Tween.js
// ============================================
import TWEEN from '@tweenjs/tween.js';

const coords = { x: 0, y: 0, z: 0 };

new TWEEN.Tween(coords)
  .to({ x: 5, y: 5, z: 5 }, 2000)
  .easing(TWEEN.Easing.Quadratic.InOut)
  .onUpdate(() => {
    mesh.position.set(coords.x, coords.y, coords.z);
  })
  .start();

// 在渲染循环中更新
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
  renderer.render(scene, camera);
}
```

---

## 12. 数学工具类 Math

### 12.1 Vector2 二维向量

```javascript
const v = new THREE.Vector2(1, 2);

// ============================================
// 属性
// ============================================
v.x;  // X分量
v.y;  // Y分量

// ============================================
// 设置
// ============================================
v.set(3, 4);
v.setX(5);
v.setY(6);
v.setScalar(1);  // 设置所有分量
v.setComponent(0, 7);  // 按索引设置

// ============================================
// 运算
// ============================================
v.add(v2);                  // 加法
v.addScalar(5);             // 加标量
v.addVectors(v1, v2);       // v = v1 + v2
v.addScaledVector(v2, 2);   // v = v + v2 * 2

v.sub(v2);                  // 减法
v.subScalar(5);             // 减标量
v.subVectors(v1, v2);       // v = v1 - v2

v.multiply(v2);             // 分量乘法
v.multiplyScalar(2);        // 乘标量
v.divide(v2);               // 分量除法
v.divideScalar(2);          // 除标量

v.negate();                 // 取反
v.floor();                  // 向下取整
v.ceil();                   // 向上取整
v.round();                  // 四舍五入
v.roundToZero();            // 向零取整

v.min(v2);                  // 取最小值
v.max(v2);                  // 取最大值
v.clamp(min, max);          // 限制范围
v.clampScalar(0, 1);        // 标量限制
v.clampLength(1, 10);       // 长度限制

// ============================================
// 长度与归一化
// ============================================
v.length();                 // 长度
v.lengthSq();               // 长度平方
v.manhattanLength();        // 曼哈顿长度
v.normalize();              // 归一化
v.setLength(5);             // 设置长度

// ============================================
// 几何运算
// ============================================
v.dot(v2);                  // 点积
v.cross(v2);                // 叉积（返回标量）
v.distanceTo(v2);           // 距离
v.distanceToSquared(v2);    // 距离平方
v.manhattanDistanceTo(v2);  // 曼哈顿距离
v.angle();                  // 相对于正X轴的角度
v.angleTo(v2);              // 与另一向量的夹角

// ============================================
// 插值与变换
// ============================================
v.lerp(v2, 0.5);            // 线性插值
v.lerpVectors(v1, v2, 0.5); // 两向量间插值
v.rotateAround(center, angle);  // 绕点旋转

// ============================================
// 复制与克隆
// ============================================
v.copy(v2);                 // 复制
v.clone();                  // 克隆
v.equals(v2);               // 判断相等

// ============================================
// 数组转换
// ============================================
v.fromArray([1, 2]);        // 从数组读取
v.toArray();                // 转为数组
v.fromBufferAttribute(attr, index);  // 从属性读取
```

### 12.2 Vector3 三维向量

```javascript
const v = new THREE.Vector3(1, 2, 3);

// ============================================
// 继承Vector2的所有方法，额外包含：
// ============================================

// 属性
v.x; v.y; v.z;

// 设置
v.set(1, 2, 3);
v.setZ(4);

// 叉积
v.cross(v2);                // v = v × v2
v.crossVectors(v1, v2);     // v = v1 × v2

// 投影
v.projectOnVector(v2);      // 投影到向量
v.projectOnPlane(normal);   // 投影到平面
v.reflect(normal);          // 反射

// 应用矩阵
v.applyMatrix3(m3);
v.applyMatrix4(m4);
v.applyNormalMatrix(m3);
v.applyQuaternion(q);
v.applyEuler(e);
v.applyAxisAngle(axis, angle);

// 变换
v.transformDirection(m4);   // 作为方向变换

// 球坐标
v.setFromSpherical(spherical);
v.setFromSphericalCoords(radius, phi, theta);

// 柱坐标
v.setFromCylindrical(cylindrical);
v.setFromCylindricalCoords(radius, theta, y);

// 从矩阵提取
v.setFromMatrixPosition(m4);  // 位置
v.setFromMatrixScale(m4);     // 缩放
v.setFromMatrixColumn(m4, 0); // 列

// 随机
v.random();                   // 0-1随机
v.randomDirection();          // 随机方向
```

### 12.3 Vector4 四维向量

```javascript
const v = new THREE.Vector4(1, 2, 3, 4);

// 继承Vector3的方法，额外包含w分量
v.x; v.y; v.z; v.w;

v.set(1, 2, 3, 4);
v.setW(5);

// 矩阵变换
v.applyMatrix4(m4);
```

### 12.4 Matrix3 三维矩阵

```javascript
const m = new THREE.Matrix3();

// ============================================
// 设置
// ============================================
m.set(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
);

m.identity();                    // 单位矩阵
m.copy(m2);                      // 复制
m.clone();                       // 克隆

// ============================================
// 矩阵运算
// ============================================
m.multiply(m2);                  // m = m * m2
m.premultiply(m2);               // m = m2 * m
m.multiplyMatrices(m1, m2);      // m = m1 * m2
m.multiplyScalar(s);             // 乘标量

m.determinant();                 // 行列式
m.invert();                      // 求逆
m.transpose();                   // 转置

// ============================================
// 从其他对象提取
// ============================================
m.setFromMatrix4(m4);            // 从4x4矩阵
m.getNormalMatrix(m4);           // 法线矩阵
m.extractBasis(xAxis, yAxis, zAxis);  // 提取基向量

// ============================================
// 2D变换
// ============================================
m.setUvTransform(tx, ty, sx, sy, rotation, cx, cy);

// ============================================
// 数组转换
// ============================================
m.fromArray(array);
m.toArray();
const elements = m.elements;     // Float32Array[9]
```

### 12.5 Matrix4 四维矩阵

```javascript
const m = new THREE.Matrix4();

// ============================================
// 设置
// ============================================
m.set(
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
);

m.identity();
m.copy(m2);
m.clone();

// ============================================
// 矩阵运算
// ============================================
m.multiply(m2);
m.premultiply(m2);
m.multiplyMatrices(m1, m2);
m.multiplyScalar(s);

m.determinant();
m.invert();
m.transpose();

// ============================================
// 变换矩阵
// ============================================
// 平移
m.setPosition(x, y, z);
m.setPosition(vector3);
m.makeTranslation(x, y, z);

// 旋转
m.makeRotationX(theta);
m.makeRotationY(theta);
m.makeRotationZ(theta);
m.makeRotationAxis(axis, angle);
m.makeRotationFromEuler(euler);
m.makeRotationFromQuaternion(q);

// 缩放
m.makeScale(x, y, z);

// 组合变换
m.compose(position, quaternion, scale);
m.decompose(position, quaternion, scale);

// ============================================
// 投影矩阵
// ============================================
m.makePerspective(left, right, top, bottom, near, far);
m.makeOrthographic(left, right, top, bottom, near, far);

// ============================================
// 视图矩阵
// ============================================
m.lookAt(eye, target, up);

// ============================================
// 提取信息
// ============================================
m.extractBasis(xAxis, yAxis, zAxis);
m.extractRotation(m2);
m.getMaxScaleOnAxis();

// 数组
m.fromArray(array);
m.toArray();
const elements = m.elements;  // Float32Array[16]
```

### 12.6 Quaternion 四元数

```javascript
const q = new THREE.Quaternion();

// ============================================
// 属性
// ============================================
q.x; q.y; q.z; q.w;

// ============================================
// 设置
// ============================================
q.set(x, y, z, w);
q.identity();                         // 单位四元数
q.copy(q2);
q.clone();

// ============================================
// 从其他表示转换
// ============================================
q.setFromAxisAngle(axis, angle);      // 从轴角
q.setFromEuler(euler);                // 从欧拉角
q.setFromRotationMatrix(m4);          // 从旋转矩阵
q.setFromUnitVectors(vFrom, vTo);     // 从向量旋转

// ============================================
// 运算
// ============================================
q.multiply(q2);                       // q = q * q2
q.premultiply(q2);                    // q = q2 * q
q.multiplyQuaternions(q1, q2);        // q = q1 * q2

q.invert();                           // 求逆
q.conjugate();                        // 共轭
q.normalize();                        // 归一化

q.dot(q2);                            // 点积
q.length();                           // 长度
q.lengthSq();                         // 长度平方

// ============================================
// 插值
// ============================================
q.slerp(q2, t);                       // 球面线性插值
q.slerpQuaternions(q1, q2, t);
THREE.Quaternion.slerp(q1, q2, qResult, t);  // 静态方法

// ============================================
// 角度
// ============================================
q.angleTo(q2);                        // 与另一四元数的角度

// 数组
q.fromArray(array);
q.toArray();
```

### 12.7 Euler 欧拉角

```javascript
const e = new THREE.Euler(0, 0, 0, 'XYZ');

// ============================================
// 属性
// ============================================
e.x;      // X轴旋转（弧度）
e.y;      // Y轴旋转
e.z;      // Z轴旋转
e.order;  // 旋转顺序：'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'

// ============================================
// 设置
// ============================================
e.set(x, y, z, order);
e.copy(e2);
e.clone();

// 从其他表示转换
e.setFromRotationMatrix(m4, order);
e.setFromQuaternion(q, order);
e.setFromVector3(v, order);

// 重新排序
e.reorder(newOrder);

// 数组
e.fromArray([x, y, z, 'XYZ']);
e.toArray();
e.toVector3();

// ============================================
// 注意事项
// ============================================
// 欧拉角存在万向节锁问题
// 对于复杂旋转，建议使用四元数
```

### 12.8 其他数学工具

```javascript
// ============================================
// Box2 二维包围盒
// ============================================
const box2 = new THREE.Box2(min, max);
box2.setFromPoints(points);
box2.setFromCenterAndSize(center, size);
box2.containsPoint(point);
box2.containsBox(box);
box2.intersectsBox(box);
box2.clampPoint(point, target);
box2.getCenter(target);
box2.getSize(target);
box2.expandByPoint(point);
box2.expandByScalar(scalar);
box2.union(box);
box2.intersect(box);

// ============================================
// Box3 三维包围盒
// ============================================
const box3 = new THREE.Box3();
box3.setFromObject(object);           // 从对象计算
box3.setFromPoints(points);
box3.setFromCenterAndSize(center, size);

box3.containsPoint(point);
box3.containsBox(box);
box3.intersectsBox(box);
box3.intersectsSphere(sphere);
box3.intersectsPlane(plane);
box3.intersectsTriangle(triangle);

box3.clampPoint(point, target);
box3.distanceToPoint(point);
box3.getCenter(target);
box3.getSize(target);
box3.getBoundingSphere(target);

box3.expandByPoint(point);
box3.expandByVector(vector);
box3.expandByScalar(scalar);
box3.expandByObject(object);

box3.union(box);
box3.intersect(box);
box3.applyMatrix4(matrix);
box3.translate(offset);

// ============================================
// Sphere 球体
// ============================================
const sphere = new THREE.Sphere(center, radius);
sphere.setFromPoints(points);
sphere.containsPoint(point);
sphere.intersectsBox(box);
sphere.intersectsSphere(sphere2);
sphere.intersectsPlane(plane);
sphere.distanceToPoint(point);
sphere.clampPoint(point, target);
sphere.getBoundingBox(target);
sphere.applyMatrix4(matrix);
sphere.translate(offset);
sphere.expandByPoint(point);
sphere.union(sphere2);

// ============================================
// Plane 平面
// ============================================
const plane = new THREE.Plane(normal, constant);
plane.setFromNormalAndCoplanarPoint(normal, point);
plane.setFromCoplanarPoints(a, b, c);
plane.distanceToPoint(point);
plane.distanceToSphere(sphere);
plane.projectPoint(point, target);
plane.intersectLine(line, target);
plane.intersectsLine(line);
plane.intersectsBox(box);
plane.intersectsSphere(sphere);
plane.coplanarPoint(target);
plane.applyMatrix4(matrix);
plane.translate(offset);
plane.negate();
plane.normalize();

// ============================================
// Ray 射线
// ============================================
const ray = new THREE.Ray(origin, direction);
ray.set(origin, direction);
ray.at(t, target);                    // 获取射线上的点
ray.lookAt(v);                        // 指向目标
ray.recast(t);                        // 移动原点
ray.closestPointToPoint(point, target);
ray.distanceToPoint(point);
ray.distanceSqToPoint(point);
ray.distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment);
ray.intersectSphere(sphere, target);
ray.intersectsSphere(sphere);
ray.intersectBox(box, target);
ray.intersectsBox(box);
ray.intersectPlane(plane, target);
ray.intersectsPlane(plane);
ray.intersectTriangle(a, b, c, backfaceCulling, target);
ray.applyMatrix4(matrix);

// ============================================
// Line3 线段
// ============================================
const line = new THREE.Line3(start, end);
line.getCenter(target);
line.delta(target);
line.distance();
line.distanceSq();
line.at(t, target);
line.closestPointToPoint(point, clampToLine, target);
line.closestPointToPointParameter(point, clampToLine);
line.applyMatrix4(matrix);

// ============================================
// Triangle 三角形
// ============================================
const triangle = new THREE.Triangle(a, b, c);
triangle.getArea();
triangle.getMidpoint(target);
triangle.getNormal(target);
triangle.getPlane(target);
triangle.getBarycoord(point, target);
triangle.getUV(point, uv1, uv2, uv3, target);
triangle.containsPoint(point);
triangle.intersectsBox(box);
triangle.closestPointToPoint(point, target);
triangle.isFrontFacing(direction);

// 静态方法
THREE.Triangle.getNormal(a, b, c, target);
THREE.Triangle.getBarycoord(point, a, b, c, target);
THREE.Triangle.containsPoint(point, a, b, c);
THREE.Triangle.getUV(point, p1, p2, p3, uv1, uv2, uv3, target);
THREE.Triangle.isFrontFacing(a, b, c, direction);

// ============================================
// Color 颜色
// ============================================
const color = new THREE.Color(0xff0000);
// new THREE.Color('red');
// new THREE.Color('rgb(255, 0, 0)');
// new THREE.Color('hsl(0, 100%, 50%)');
// new THREE.Color(1, 0, 0);

color.r; color.g; color.b;

color.set(value);
color.setHex(hex);
color.setRGB(r, g, b);
color.setHSL(h, s, l);
color.setStyle('red');
color.setColorName('red');
color.setScalar(scalar);

color.getHex();
color.getHexString();
color.getHSL(target);
color.getRGB(target);
color.getStyle();

color.add(color2);
color.addColors(color1, color2);
color.addScalar(s);
color.sub(color2);
color.multiply(color2);
color.multiplyScalar(s);

color.lerp(color2, alpha);
color.lerpColors(color1, color2, alpha);
color.lerpHSL(color2, alpha);

color.equals(color2);
color.copy(color2);
color.clone();

color.fromArray(array);
color.toArray();
color.toJSON();

// 颜色空间转换
color.convertSRGBToLinear();
color.convertLinearToSRGB();
color.copySRGBToLinear(color2);
color.copyLinearToSRGB(color2);

// ============================================
// Spherical 球坐标
// ============================================
const spherical = new THREE.Spherical(radius, phi, theta);
// radius: 半径
// phi: 极角（从Y轴向下测量）
// theta: 方位角（从Z轴向X轴测量）

spherical.setFromVector3(v);
spherical.setFromCartesianCoords(x, y, z);
spherical.makeSafe();  // 限制phi值

// ============================================
// Cylindrical 柱坐标
// ============================================
const cylindrical = new THREE.Cylindrical(radius, theta, y);
cylindrical.setFromVector3(v);
cylindrical.setFromCartesianCoords(x, y, z);

// ============================================
// MathUtils 数学工具函数
// ============================================
THREE.MathUtils.clamp(value, min, max);           // 限制范围
THREE.MathUtils.degToRad(degrees);                // 度转弧度
THREE.MathUtils.radToDeg(radians);                // 弧度转度
THREE.MathUtils.euclideanModulo(n, m);            // 欧几里得取模
THREE.MathUtils.mapLinear(x, a1, a2, b1, b2);     // 线性映射
THREE.MathUtils.lerp(x, y, t);                    // 线性插值
THREE.MathUtils.inverseLerp(x, y, value);         // 逆线性插值
THREE.MathUtils.smoothstep(x, min, max);          // 平滑过渡
THREE.MathUtils.smootherstep(x, min, max);        // 更平滑过渡
THREE.MathUtils.randInt(low, high);               // 随机整数
THREE.MathUtils.randFloat(low, high);             // 随机浮点数
THREE.MathUtils.randFloatSpread(range);           // 范围随机
THREE.MathUtils.seededRandom(seed);               // 种子随机
THREE.MathUtils.generateUUID();                   // 生成UUID
THREE.MathUtils.isPowerOfTwo(value);              // 是否2的幂
THREE.MathUtils.ceilPowerOfTwo(value);            // 向上取2的幂
THREE.MathUtils.floorPowerOfTwo(value);           // 向下取2的幂
THREE.MathUtils.setQuaternionFromProperEuler(q, a, b, c, order);
```

---

## 13. 控制器 Controls

### 13.1 OrbitControls 轨道控制器

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const controls = new OrbitControls(camera, renderer.domElement);

// ============================================
// 基本属性
// ============================================
controls.enabled = true;              // 启用控制器
controls.target.set(0, 0, 0);         // 观察目标点

// ============================================
// 旋转设置
// ============================================
controls.enableRotate = true;         // 启用旋转
controls.rotateSpeed = 1.0;           // 旋转速度

// 垂直旋转限制（弧度）
controls.minPolarAngle = 0;           // 最小极角（向上）
controls.maxPolarAngle = Math.PI;     // 最大极角（向下）

// 水平旋转限制
controls.minAzimuthAngle = -Infinity; // 最小方位角
controls.maxAzimuthAngle = Infinity;  // 最大方位角

// ============================================
// 缩放设置
// ============================================
controls.enableZoom = true;           // 启用缩放
controls.zoomSpeed = 1.0;             // 缩放速度
controls.minDistance = 1;             // 最小距离
controls.maxDistance = 100;           // 最大距离

// 正交相机缩放限制
controls.minZoom = 0;
controls.maxZoom = Infinity;

// ============================================
// 平移设置
// ============================================
controls.enablePan = true;            // 启用平移
controls.panSpeed = 1.0;              // 平移速度
controls.screenSpacePanning = true;   // 屏幕空间平移
controls.keyPanSpeed = 7.0;           // 键盘平移速度

// ============================================
// 阻尼（惯性）
// ============================================
controls.enableDamping = true;        // 启用阻尼
controls.dampingFactor = 0.05;        // 阻尼系数

// ============================================
// 自动旋转
// ============================================
controls.autoRotate = true;           // 自动旋转
controls.autoRotateSpeed = 2.0;       // 自动旋转速度

// ============================================
// 按键设置
// ============================================
controls.keys = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  BOTTOM: 'ArrowDown'
};

// 鼠标按键
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};

// 触摸手势
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN
};

// ============================================
// 方法
// ============================================
controls.update();                    // 更新（每帧调用）
controls.saveState();                 // 保存状态
controls.reset();                     // 重置到初始状态
controls.dispose();                   // 销毁

// 获取/设置方位
controls.getAzimuthalAngle();
controls.getPolarAngle();
controls.getDistance();

// ============================================
// 事件
// ============================================
controls.addEventListener('start', () => {
  console.log('Control started');
});

controls.addEventListener('change', () => {
  console.log('Control changed');
  renderer.render(scene, camera);  // 按需渲染
});

controls.addEventListener('end', () => {
  console.log('Control ended');
});

// ============================================
// 渲染循环
// ============================================
function animate() {
  requestAnimationFrame(animate);
  
  // 如果启用了阻尼或自动旋转，需要更新
  controls.update();
  
  renderer.render(scene, camera);
}
```

### 13.2 其他控制器

```javascript
// ============================================
// MapControls 地图控制器
// ============================================
import { MapControls } from 'three/examples/jsm/controls/MapControls';

const mapControls = new MapControls(camera, renderer.domElement);
mapControls.enableDamping = true;
mapControls.dampingFactor = 0.05;
mapControls.screenSpacePanning = false;
mapControls.minDistance = 10;
mapControls.maxDistance = 500;
mapControls.maxPolarAngle = Math.PI / 2;

// ============================================
// TrackballControls 轨迹球控制器
// ============================================
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

const trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.rotateSpeed = 1.0;
trackballControls.zoomSpeed = 1.2;
trackballControls.panSpeed = 0.8;
trackballControls.noZoom = false;
trackballControls.noPan = false;
trackballControls.staticMoving = true;
trackballControls.dynamicDampingFactor = 0.3;

// ============================================
// FlyControls 飞行控制器
// ============================================
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 10;
flyControls.rollSpeed = Math.PI / 24;
flyControls.autoForward = false;
flyControls.dragToLook = true;

// ============================================
// FirstPersonControls 第一人称控制器
// ============================================
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

const fpControls = new FirstPersonControls(camera, renderer.domElement);
fpControls.movementSpeed = 10;
fpControls.lookSpeed = 0.1;
fpControls.lookVertical = true;
fpControls.constrainVertical = true;
fpControls.verticalMin = 1.0;
fpControls.verticalMax = 2.0;

// ============================================
// PointerLockControls 指针锁定控制器
// ============================================
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const pointerLockControls = new PointerLockControls(camera, document.body);

// 锁定鼠标
document.addEventListener('click', () => {
  pointerLockControls.lock();
});

pointerLockControls.addEventListener('lock', () => {
  console.log('Pointer locked');
});

pointerLockControls.addEventListener('unlock', () => {
  console.log('Pointer unlocked');
});

// 移动
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function animate() {
  if (pointerLockControls.isLocked) {
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    
    if (moveForward || moveBackward) {
      velocity.z -= direction.z * 400.0 * delta;
    }
    if (moveLeft || moveRight) {
      velocity.x -= direction.x * 400.0 * delta;
    }
    
    pointerLockControls.moveRight(-velocity.x * delta);
    pointerLockControls.moveForward(-velocity.z * delta);
  }
}

// ============================================
// DragControls 拖拽控制器
// ============================================
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const objects = [mesh1, mesh2, mesh3];
const dragControls = new DragControls(objects, camera, renderer.domElement);

dragControls.addEventListener('dragstart', (event) => {
  event.object.material.emissive.set(0xaaaaaa);
  orbitControls.enabled = false;  // 禁用轨道控制
});

dragControls.addEventListener('drag', (event) => {
  // 限制拖拽范围
  event.object.position.y = Math.max(0, event.object.position.y);
});

dragControls.addEventListener('dragend', (event) => {
  event.object.material.emissive.set(0x000000);
  orbitControls.enabled = true;
});

// ============================================
// TransformControls 变换控制器
// ============================================
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

// 附加到对象
transformControls.attach(mesh);

// 切换模式
transformControls.setMode('translate');  // 平移
transformControls.setMode('rotate');     // 旋转
transformControls.setMode('scale');      // 缩放

// 设置空间
transformControls.setSpace('world');     // 世界坐标
transformControls.setSpace('local');     // 局部坐标

// 设置大小
transformControls.setSize(1);

// 事件
transformControls.addEventListener('dragging-changed', (event) => {
  orbitControls.enabled = !event.value;
});

transformControls.addEventListener('change', () => {
  renderer.render(scene, camera);
});

// 键盘快捷键
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'g':
      transformControls.setMode('translate');
      break;
    case 'r':
      transformControls.setMode('rotate');
      break;
    case 's':
      transformControls.setMode('scale');
      break;
  }
});

// ============================================
// ArcballControls 弧形球控制器
// ============================================
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';

const arcballControls = new ArcballControls(camera, renderer.domElement, scene);
arcballControls.setGizmosVisible(true);
```

---

## 14. 辅助工具 Helpers

### 14.1 常用辅助器

```javascript
// ============================================
// AxesHelper 坐标轴辅助器
// ============================================
const axesHelper = new THREE.AxesHelper(5);
// 红色 = X轴, 绿色 = Y轴, 蓝色 = Z轴
scene.add(axesHelper);

// ============================================
// GridHelper 网格辅助器
// ============================================
const gridHelper = new THREE.GridHelper(
  10,         // 大小
  10,         // 分割数
  0x888888,   // 中心线颜色
  0x444444    // 网格颜色
);
scene.add(gridHelper);

// 极坐标网格
const polarGridHelper = new THREE.PolarGridHelper(
  10,         // 半径
  16,         // 扇区数
  8,          // 环数
  64,         // 分割数
  0x888888,   // 颜色1
  0x444444    // 颜色2
);
scene.add(polarGridHelper);

// ============================================
// BoxHelper 包围盒辅助器
// ============================================
const boxHelper = new THREE.BoxHelper(mesh, 0xffff00);
scene.add(boxHelper);

// 更新（对象变换后）
boxHelper.update();

// Box3Helper
const box = new THREE.Box3().setFromObject(mesh);
const box3Helper = new THREE.Box3Helper(box, 0xffff00);
scene.add(box3Helper);

// ============================================
// ArrowHelper 箭头辅助器
// ============================================
const direction = new THREE.Vector3(1, 0, 0);
direction.normalize();

const arrowHelper = new THREE.ArrowHelper(
  direction,       // 方向
  new THREE.Vector3(0, 0, 0),  // 起点
  5,               // 长度
  0xff0000,        // 颜色
  1,               // 箭头长度
  0.5              // 箭头宽度
);
scene.add(arrowHelper);

// 更新方向
arrowHelper.setDirection(newDirection);
arrowHelper.setLength(10);
arrowHelper.setColor(0x00ff00);

// ============================================
// PlaneHelper 平面辅助器
// ============================================
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const planeHelper = new THREE.PlaneHelper(plane, 10, 0xffff00);
scene.add(planeHelper);

// ============================================
// CameraHelper 相机辅助器
// ============================================
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

// 更新
cameraHelper.update();

// ============================================
// 光源辅助器
// ============================================
// 平行光辅助器
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight, 
  5,        // 大小
  0xffff00  // 颜色
);
scene.add(directionalLightHelper);

// 点光源辅助器
const pointLightHelper = new THREE.PointLightHelper(
  pointLight,
  1,        // 大小
  0xffff00  // 颜色
);
scene.add(pointLightHelper);

// 聚光灯辅助器
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// 半球光辅助器
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  5,        // 大小
  0xff0000  // 颜色
);
scene.add(hemisphereLightHelper);

// 区域光辅助器
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// ============================================
// SkeletonHelper 骨骼辅助器
// ============================================
const skeletonHelper = new THREE.SkeletonHelper(skinnedMesh);
scene.add(skeletonHelper);

// ============================================
// VertexNormalsHelper 顶点法线辅助器
// ============================================
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

const normalsHelper = new VertexNormalsHelper(mesh, 1, 0xff0000);
scene.add(normalsHelper);

// ============================================
// VertexTangentsHelper 顶点切线辅助器
// ============================================
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper';

const tangentsHelper = new VertexTangentsHelper(mesh, 1, 0x00ff00);
scene.add(tangentsHelper);
```

### 14.2 调试工具

```javascript
// ============================================
// Stats.js 性能监控
// ============================================
import Stats from 'three/examples/jsm/libs/stats.module';

const stats = new Stats();
stats.showPanel(0);  // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  
  // 渲染代码...
  renderer.render(scene, camera);
  
  stats.end();
  requestAnimationFrame(animate);
}

// ============================================
// lil-gui 图形界面
// ============================================
import GUI from 'lil-gui';

const gui = new GUI();

// 添加控制项
const params = {
  color: 0xff0000,
  intensity: 1,
  visible: true,
  wireframe: false,
  speed: 1,
  type: 'option1'
};

// 颜色
gui.addColor(params, 'color').onChange((value) => {
  mesh.material.color.setHex(value);
});

// 数字（滑块）
gui.add(params, 'intensity', 0, 2, 0.01).name('Light Intensity').onChange((value) => {
  light.intensity = value;
});

// 布尔
gui.add(params, 'visible').onChange((value) => {
  mesh.visible = value;
});

// 材质属性
gui.add(mesh.material, 'wireframe');

// 下拉选择
gui.add(params, 'type', ['option1', 'option2', 'option3']);

// 函数按钮
const actions = {
  reset: () => {
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
  },
  randomize: () => {
    mesh.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );
  }
};
gui.add(actions, 'reset');
gui.add(actions, 'randomize');

// 文件夹
const lightFolder = gui.addFolder('Light');
lightFolder.add(light, 'intensity', 0, 2);
lightFolder.addColor({ color: 0xffffff }, 'color').onChange((value) => {
  light.color.setHex(value);
});
lightFolder.open();

// 关闭/销毁
gui.close();
gui.destroy();

// ============================================
// 渲染器信息
// ============================================
console.log(renderer.info);
// {
//   memory: { geometries, textures },
//   render: { calls, triangles, points, lines, frame },
//   programs: [...]
// }

// 重置统计
renderer.info.reset();

// ============================================
// 场景遍历调试
// ============================================
function debugScene(object, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${object.type}: ${object.name || 'unnamed'}`);
  
  if (object.material) {
    console.log(`${indent}  Material: ${object.material.type}`);
  }
  
  if (object.geometry) {
    const geo = object.geometry;
    console.log(`${indent}  Geometry: ${geo.type}`);
    console.log(`${indent}    Vertices: ${geo.attributes.position?.count || 0}`);
  }
  
  object.children.forEach(child => debugScene(child, depth + 1));
}

debugScene(scene);
```

---

## 15. 后期处理 Post-processing

### 15.1 EffectComposer 效果合成器

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

// ============================================
// 创建效果合成器
// ============================================
const composer = new EffectComposer(renderer);

// 渲染通道（基础场景渲染）
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 输出通道（颜色空间转换）
const outputPass = new OutputPass();
composer.addPass(outputPass);

// ============================================
// 渲染循环
// ============================================
function animate() {
  requestAnimationFrame(animate);
  
  // 使用合成器渲染而非renderer
  composer.render();
}

// ============================================
// 窗口resize处理
// ============================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
```

### 15.2 常用后期效果

```javascript
// ============================================
// UnrealBloomPass 泛光效果
// ============================================
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,    // 强度
  0.4,    // 半径
  0.85    // 阈值
);
composer.addPass(bloomPass);

// 动态调整
bloomPass.strength = 2;
bloomPass.radius = 0.5;
bloomPass.threshold = 0.8;

// ============================================
// 选择性泛光
// ============================================
const BLOOM_LAYER = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);

// 设置发光物体
glowingMesh.layers.enable(BLOOM_LAYER);

// 自定义渲染流程实现选择性泛光
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = {};

function darkenNonBloomed(obj) {
  if (obj.isMesh && !bloomLayer.test(obj.layers)) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

// ============================================
// SSAOPass 屏幕空间环境光遮蔽
// ============================================
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

const ssaoPass = new SSAOPass(scene, camera, width, height);
ssaoPass.kernelRadius = 16;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);

// ============================================
// BokehPass 景深效果
// ============================================
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

const bokehPass = new BokehPass(scene, camera, {
  focus: 10,      // 焦距
  aperture: 0.025, // 光圈
  maxblur: 0.01   // 最大模糊
});
composer.addPass(bokehPass);

// ============================================
// OutlinePass 描边效果
// ============================================
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);

outlinePass.selectedObjects = [mesh1, mesh2];  // 要描边的物体
outlinePass.visibleEdgeColor.set(0xffffff);    // 可见边缘颜色
outlinePass.hiddenEdgeColor.set(0x190a05);     // 隐藏边缘颜色
outlinePass.edgeStrength = 3;                   // 边缘强度
outlinePass.edgeGlow = 0;                       // 边缘发光
outlinePass.edgeThickness = 1;                  // 边缘厚度
outlinePass.pulsePeriod = 0;                    // 脉冲周期

composer.addPass(outlinePass);

// ============================================
// SMAAPass 抗锯齿
// ============================================
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

const smaaPass = new SMAAPass(
  window.innerWidth * renderer.getPixelRatio(),
  window.innerHeight * renderer.getPixelRatio()
);
composer.addPass(smaaPass);

// ============================================
// FXAAShader 快速抗锯齿
// ============================================
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
composer.addPass(fxaaPass);

// ============================================
// FilmPass 电影效果
// ============================================
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

const filmPass = new FilmPass(
  0.35,  // 噪点强度
  0.5,   // 扫描线强度
  648,   // 扫描线数量
  false  // 灰度
);
composer.addPass(filmPass);

// ============================================
// GlitchPass 故障效果
// ============================================
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

const glitchPass = new GlitchPass();
glitchPass.goWild = false;  // 持续故障
composer.addPass(glitchPass);

// ============================================
// DotScreenPass 点阵效果
// ============================================
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';

const dotScreenPass = new DotScreenPass(
  new THREE.Vector2(0, 0),  // 中心
  0.5,                       // 角度
  0.8                        // 大小
);
composer.addPass(dotScreenPass);

// ============================================
// HalftonePass 半调效果
// ============================================
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';

const halftonePass = new HalftonePass(width, height, {
  shape: 1,         // 形状：1=点, 2=椭圆, 3=线, 4=方形
  radius: 4,        // 半径
  rotateR: Math.PI / 12,
  rotateB: Math.PI / 12 * 2,
  rotateG: Math.PI / 12 * 3,
  scatter: 0,
  blending: 1,
  blendingMode: 1,
  greyscale: false,
  disable: false
});
composer.addPass(halftonePass);
```

### 15.3 自定义着色器通道

```javascript
// ============================================
// 自定义ShaderPass
// ============================================
const MyShader = {
  uniforms: {
    tDiffuse: { value: null },  // 必须：前一通道的纹理
    amount: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      // 简单的颜色反转效果
      vec3 inverted = vec3(1.0) - color.rgb;
      gl_FragColor = vec4(mix(color.rgb, inverted, amount), color.a);
    }
  `
};

const customPass = new ShaderPass(MyShader);
customPass.uniforms.amount.value = 0.5;
composer.addPass(customPass);

// ============================================
// 常用着色器效果
// ============================================
// 灰度效果
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader';
const luminosityPass = new ShaderPass(LuminosityShader);

// 棕褐色效果
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader';
const sepiaPass = new ShaderPass(SepiaShader);
sepiaPass.uniforms.amount.value = 0.9;

// 颜色校正
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
colorCorrectionPass.uniforms.powRGB.value = new THREE.Vector3(1.4, 1.45, 1.45);
colorCorrectionPass.uniforms.mulRGB.value = new THREE.Vector3(1.1, 1.1, 1.1);

// 亮度/对比度
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader';
const bcPass = new ShaderPass(BrightnessContrastShader);
bcPass.uniforms.brightness.value = 0.1;
bcPass.uniforms.contrast.value = 0.2;

// 色调/饱和度
import { HueSaturationShader } from 'three/examples/jsm/shaders/HueSaturationShader';
const hsPass = new ShaderPass(HueSaturationShader);
hsPass.uniforms.hue.value = 0.1;
hsPass.uniforms.saturation.value = 0.5;

// 渐晕效果
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader';
const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms.darkness.value = 1.5;
vignettePass.uniforms.offset.value = 1.0;

// 像素化效果
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader';
const pixelPass = new ShaderPass(PixelShader);
pixelPass.uniforms.resolution.value = new THREE.Vector2(width, height);
pixelPass.uniforms.pixelSize.value = 8;
```

---

## 16. 音频系统 Audio

### 16.1 基础音频

```javascript
// ============================================
// AudioListener 音频监听器
// ============================================
const listener = new THREE.AudioListener();
camera.add(listener);  // 将监听器附加到相机

// ============================================
// Audio 非空间音频
// ============================================
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.Audio(listener);

audioLoader.load('sound.mp3', (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

// 音频控制
sound.play();
sound.pause();
sound.stop();
sound.isPlaying;  // 是否正在播放

// 音量
sound.setVolume(1);  // 0-1
sound.getVolume();

// 播放速率
sound.setPlaybackRate(1);  // 1=正常, 2=双倍速

// 循环
sound.setLoop(true);
sound.setLoopStart(0);
sound.setLoopEnd(10);

// 偏移
sound.offset = 5;  // 从5秒处开始

// 时长
sound.duration;

// ============================================
// PositionalAudio 空间音频
// ============================================
const positionalSound = new THREE.PositionalAudio(listener);

audioLoader.load('sound.mp3', (buffer) => {
  positionalSound.setBuffer(buffer);
  positionalSound.setRefDistance(1);   // 参考距离
  positionalSound.setMaxDistance(100); // 最大距离
  positionalSound.setRolloffFactor(1); // 衰减因子
  positionalSound.setLoop(true);
  positionalSound.play();
});

// 将空间音频附加到3D对象
mesh.add(positionalSound);

// 定向锥体
positionalSound.setDirectionalCone(180, 230, 0.1);
// innerAngle: 内角
// outerAngle: 外角  
// outerGain: 外部增益

// 距离模型
positionalSound.setDistanceModel('inverse');
// 'linear', 'inverse', 'exponential'
```

### 16.2 音频分析

```javascript
// ============================================
// AudioAnalyser 音频分析器
// ============================================
const analyser = new THREE.AudioAnalyser(sound, 32);  // FFT大小

// 在渲染循环中获取数据
function animate() {
  // 获取频率数据
  const data = analyser.getFrequencyData();  // Uint8Array
  
  // 获取平均频率
  const average = analyser.getAverageFrequency();
  
  // 使用数据驱动可视化
  data.forEach((value, index) => {
    const scale = value / 256;
    bars[index].scale.y = scale;
  });
}

// ============================================
// 音频可视化示例
// ============================================
class AudioVisualizer {
  constructor(sound, barCount = 32) {
    this.analyser = new THREE.AudioAnalyser(sound, barCount * 2);
    this.bars = [];
    this.group = new THREE.Group();
    
    // 创建频谱条
    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / barCount, 1, 0.5)
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = i - barCount / 2;
      this.bars.push(bar);
      this.group.add(bar);
    }
  }
  
  update() {
    const data = this.analyser.getFrequencyData();
    
    this.bars.forEach((bar, i) => {
      const scale = data[i] / 256;
      bar.scale.y = Math.max(0.1, scale * 5);
      bar.position.y = bar.scale.y / 2;
    });
  }
}
```

### 16.3 音频上下文

```javascript
// ============================================
// 获取音频上下文
// ============================================
const audioContext = listener.context;

// 在用户交互后恢复音频上下文
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
});

// ============================================
// 音频滤波器
// ============================================
const filter = audioContext.createBiquadFilter();
filter.type = 'lowpass';  // 低通滤波
filter.frequency.value = 1000;
filter.Q.value = 1;

// 连接滤波器
sound.setFilter(filter);

// 获取/移除滤波器
const currentFilter = sound.getFilter();
sound.setFilter(null);

// 多个滤波器
sound.setFilters([filter1, filter2]);
```

---

## 17. 粒子系统 Particles

### 17.1 Points 点云

```javascript
// ============================================
// 基础粒子系统
// ============================================
const count = 10000;

// 创建几何体
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  // 位置
  positions[i * 3] = (Math.random() - 0.5) * 100;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
  
  // 颜色
  colors[i * 3] = Math.random();
  colors[i * 3 + 1] = Math.random();
  colors[i * 3 + 2] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 创建材质
const material = new THREE.PointsMaterial({
  size: 0.5,
  sizeAttenuation: true,  // 大小随距离衰减
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

// 使用纹理
const textureLoader = new THREE.TextureLoader();
material.map = textureLoader.load('particle.png');
material.alphaMap = textureLoader.load('particle-alpha.png');
material.alphaTest = 0.01;

// 创建点云
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// ============================================
// 粒子动画
// ============================================
function animateParticles() {
  const positions = particles.geometry.attributes.position.array;
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Y轴浮动
    positions[i3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
}
```

### 17.2 高级粒子系统

```javascript
// ============================================
// 粒子发射器类
// ============================================
class ParticleEmitter {
  constructor(options = {}) {
    this.maxParticles = options.maxParticles || 1000;
    this.particleSize = options.particleSize || 0.1;
    this.emitRate = options.emitRate || 10;
    this.lifetime = options.lifetime || 5;
    this.velocity = options.velocity || new THREE.Vector3(0, 1, 0);
    this.velocitySpread = options.velocitySpread || new THREE.Vector3(0.5, 0.5, 0.5);
    
    this.particles = [];
    this.time = 0;
    this.emitAccumulator = 0;
    
    this.initGeometry();
  }
  
  initGeometry() {
    this.geometry = new THREE.BufferGeometry();
    
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.sizes = new Float32Array(this.maxParticles);
    
    this.geometry.setAttribute('position', 
      new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', 
      new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', 
      new THREE.BufferAttribute(this.sizes, 1));
    
    this.material = new THREE.PointsMaterial({
      size: this.particleSize,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    this.mesh = new THREE.Points(this.geometry, this.material);
  }
  
  emit(position) {
    if (this.particles.length >= this.maxParticles) return;
    
    const velocity = this.velocity.clone().add(
      new THREE.Vector3(
        (Math.random() - 0.5) * this.velocitySpread.x,
        (Math.random() - 0.5) * this.velocitySpread.y,
        (Math.random() - 0.5) * this.velocitySpread.z
      )
    );
    
    this.particles.push({
      position: position.clone(),
      velocity: velocity,
      age: 0,
      lifetime: this.lifetime * (0.5 + Math.random() * 0.5),
      color: new THREE.Color().setHSL(Math.random(), 1, 0.5)
    });
  }
  
  update(delta) {
    this.time += delta;
    
    // 发射新粒子
    this.emitAccumulator += delta * this.emitRate;
    while (this.emitAccumulator >= 1 && this.particles.length < this.maxParticles) {
      this.emit(new THREE.Vector3(0, 0, 0));
      this.emitAccumulator -= 1;
    }
    
    // 更新粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += delta;
      
      if (p.age >= p.lifetime) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // 更新位置
      p.position.add(p.velocity.clone().multiplyScalar(delta));
      
      // 应用重力
      p.velocity.y -= 9.8 * delta;
    }
    
    // 更新缓冲区
    for (let i = 0; i < this.maxParticles; i++) {
      if (i < this.particles.length) {
        const p = this.particles[i];
        const life = 1 - p.age / p.lifetime;
        
        this.positions[i * 3] = p.position.x;
        this.positions[i * 3 + 1] = p.position.y;
        this.positions[i * 3 + 2] = p.position.z;
        
        this.colors[i * 3] = p.color.r;
        this.colors[i * 3 + 1] = p.color.g;
        this.colors[i * 3 + 2] = p.color.b;
        
        this.sizes[i] = life * this.particleSize;
      } else {
        this.sizes[i] = 0;
      }
    }
    
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }
}

// 使用
const emitter = new ParticleEmitter({
  maxParticles: 5000,
  emitRate: 100,
  lifetime: 3,
  velocity: new THREE.Vector3(0, 5, 0)
});
scene.add(emitter.mesh);

function animate() {
  emitter.update(clock.getDelta());
}
```

### 17.3 GPU粒子（着色器粒子）

```javascript
// ============================================
// GPU粒子着色器
// ============================================
const GPUParticleShader = {
  vertexShader: `
    attribute float size;
    attribute vec3 customColor;
    attribute float alpha;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vColor = customColor;
      vAlpha = alpha;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D pointTexture;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vec4 texColor = texture2D(pointTexture, gl_PointCoord);
      gl_FragColor = vec4(vColor, vAlpha) * texColor;
    }
  `
};

const gpuParticleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    pointTexture: { value: textureLoader.load('particle.png') }
  },
  vertexShader: GPUParticleShader.vertexShader,
  fragmentShader: GPUParticleShader.fragmentShader,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true
});
```

---

## 18. 着色器 Shader

### 18.1 ShaderMaterial 着色器材质

```javascript
// ============================================
// 基础ShaderMaterial
// ============================================
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xff0000) },
    uTexture: { value: texture },
    uResolution: { value: new THREE.Vector2(width, height) }
  },
  vertexShader: `
    uniform float uTime;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // 顶点动画
      vec3 pos = position;
      pos.z += sin(pos.x * 5.0 + uTime) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // 简单光照
      vec3 light = normalize(vec3(1.0, 1.0, 1.0));
      float diffuse = max(dot(vNormal, light), 0.0);
      
      vec3 finalColor = uColor * diffuse * texColor.rgb;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  side: THREE.DoubleSide,
  transparent: true
});

// 更新uniform
function animate() {
  shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
}
```

### 18.2 RawShaderMaterial 原始着色器材质

```javascript
// ============================================
// RawShaderMaterial - 不包含内置变量
// ============================================
const rawShaderMaterial = new THREE.RawShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uProjectionMatrix: { value: camera.projectionMatrix },
    uModelViewMatrix: { value: new THREE.Matrix4() }
  },
  vertexShader: `
    precision highp float;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    
    attribute vec3 position;
    attribute vec2 uv;
    
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    
    uniform float uTime;
    
    varying vec2 vUv;
    
    void main() {
      vec3 color = vec3(vUv, sin(uTime) * 0.5 + 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `
});
```

### 18.3 常用着色器效果

```javascript
// ============================================
// 菲涅尔效果
// ============================================
const fresnelShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uFresnelPower;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);
      
      gl_FragColor = vec4(uColor * fresnel, fresnel);
    }
  `
};

// ============================================
// 渐变着色器
// ============================================
const gradientShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uAngle;
    
    varying vec2 vUv;
    
    void main() {
      float angle = uAngle * 3.14159 / 180.0;
      vec2 dir = vec2(cos(angle), sin(angle));
      float t = dot(vUv - 0.5, dir) + 0.5;
      
      vec3 color = mix(uColorA, uColorB, t);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// ============================================
// 噪声着色器
// ============================================
const noiseShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScale;
    
    varying vec2 vUv;
    
    // 简单噪声函数
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 st = vUv * uScale;
      st.x += uTime * 0.1;
      
      float n = noise(st);
      
      gl_FragColor = vec4(vec3(n), 1.0);
    }
  `
};

// ============================================
// 水波着色器
// ============================================
const waterShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float elevation = sin(pos.x * uFrequency + uTime) * 
                       sin(pos.z * uFrequency + uTime) * 
                       uAmplitude;
      pos.y += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorDeep;
    uniform vec3 uColorSurface;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      float mixStrength = (vElevation + 0.1) * 5.0;
      vec3 color = mix(uColorDeep, uColorSurface, mixStrength);
      
      gl_FragColor = vec4(color, 0.9);
    }
  `
};
```

### 18.4 着色器工具

```javascript
// ============================================
// 使用glslify（需要构建工具支持）
// ============================================
// 安装：npm install glslify glslify-loader

// 在webpack中配置
// module: {
//   rules: [
//     { test: /\.(glsl|vs|fs|vert|frag)$/, use: ['glslify-loader'] }
//   ]
// }

// 使用
// import vertexShader from './shaders/vertex.glsl';
// import fragmentShader from './shaders/fragment.glsl';

// ============================================
// 着色器块（Shader Chunks）
// ============================================
// Three.js内置的着色器块
console.log(THREE.ShaderChunk);

// 使用内置块
const customVertexShader = `
  #include <common>
  #include <skinning_pars_vertex>
  
  void main() {
    #include <begin_vertex>
    #include <skinbase_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
  }
`;

// ============================================
// 修改内置材质着色器
// ============================================
const material = new THREE.MeshStandardMaterial();

material.onBeforeCompile = (shader) => {
  // 添加自定义uniform
  shader.uniforms.uTime = { value: 0 };
  
  // 修改顶点着色器
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    transformed.y += sin(transformed.x * 5.0 + uTime) * 0.1;
    `
  );
  
  // 修改片段着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    `
    #include <color_fragment>
    diffuseColor.rgb *= vec3(1.0, 0.5, 0.5);
    `
  );
  
  // 保存引用以便更新
  material.userData.shader = shader;
};

// 更新uniform
function animate() {
  if (material.userData.shader) {
    material.userData.shader.uniforms.uTime.value = clock.getElapsedTime();
  }
}
```

---

## 19. 性能优化

### 19.1 几何体优化

```javascript
// ============================================
// 合并几何体
// ============================================
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

const geometries = [];
for (let i = 0; i < 100; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(i * 2, 0, 0);
  geometries.push(geometry);
}

const mergedGeometry = mergeGeometries(geometries);
const mergedMesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mergedMesh);

// ============================================
// 实例化渲染
// ============================================
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial();
const instancedMesh = new THREE.InstancedMesh(geometry, material, 10000);

const dummy = new THREE.Object3D();
for (let i = 0; i < 10000; i++) {
  dummy.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

scene.add(instancedMesh);

// ============================================
// LOD (Level of Detail)
// ============================================
const lod = new THREE.LOD();

// 高精度模型
const highDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  material
);
lod.addLevel(highDetail, 0);

// 中等精度
const mediumDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  material
);
lod.addLevel(mediumDetail, 50);

// 低精度
const lowDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 8, 8),
  material
);
lod.addLevel(lowDetail, 100);

scene.add(lod);

// 更新LOD
lod.update(camera);

// ============================================
// 简化几何体
// ============================================
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';

const modifier = new SimplifyModifier();
const simplified = modifier.modify(geometry, Math.floor(geometry.attributes.position.count * 0.5));
```

### 19.2 纹理优化

```javascript
// ============================================
// 纹理压缩
// ============================================
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('basis/');
ktx2Loader.detectSupport(renderer);

ktx2Loader.load('texture.ktx2', (texture) => {
  material.map = texture;
  material.needsUpdate = true;
});

// ============================================
// Mipmap设置
// ============================================
texture.generateMipmaps = true;
texture.minFilter = THREE.LinearMipmapLinearFilter;

// ============================================
// 各向异性过滤
// ============================================
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
texture.anisotropy = maxAnisotropy;

// ============================================
// 纹理尺寸优化
// ============================================
// 使用2的幂次方尺寸：256, 512, 1024, 2048
// 避免超过2048x2048

// ============================================
// 纹理图集
// ============================================
// 将多个小纹理合并为一个大纹理
const atlasTexture = textureLoader.load('atlas.png');

// 通过UV偏移使用不同区域
const uvOffset = new THREE.Vector2(0.5, 0);  // 右半部分
const uvScale = new THREE.Vector2(0.5, 1);   // 一半宽度

material.map = atlasTexture;
material.map.offset = uvOffset;
material.map.repeat = uvScale;
```

### 19.3 渲染优化

```javascript
// ============================================
// 视锥剔除
// ============================================
mesh.frustumCulled = true;  // 默认开启

// ============================================
// 按需渲染
// ============================================
let needsRender = true;

controls.addEventListener('change', () => {
  needsRender = true;
});

function animate() {
  requestAnimationFrame(animate);
  
  if (needsRender) {
    renderer.render(scene, camera);
    needsRender = false;
  }
}

// ============================================
// 限制帧率
// ============================================
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;
let lastTime = 0;

function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const delta = currentTime - lastTime;
  
  if (delta > frameInterval) {
    lastTime = currentTime - (delta % frameInterval);
    renderer.render(scene, camera);
  }
}

// ============================================
// 像素比优化
// ============================================
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ============================================
// 阴影优化
// ============================================
// 限制阴影贴图大小
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

// 优化阴影相机范围
light.shadow.camera.near = 1;
light.shadow.camera.far = 100;
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.bottom = -20;

// 动态阴影更新
light.shadow.autoUpdate = false;  // 禁用自动更新
light.shadow.needsUpdate = true;  // 手动触发更新

// ============================================
// 后期处理优化
// ============================================
// 使用半分辨率渲染目标
const halfWidth = Math.floor(width / 2);
const halfHeight = Math.floor(height / 2);

const renderTarget = new THREE.WebGLRenderTarget(halfWidth, halfHeight);
```

### 19.4 内存管理

```javascript
// ============================================
// 释放资源
// ============================================
function disposeObject(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      // 释放几何体
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      // 释放材质
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

function disposeMaterial(material) {
  // 释放纹理
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value.dispose === 'function') {
      value.dispose();
    }
  }
  
  material.dispose();
}

// ============================================
// 监控内存使用
// ============================================
function logMemory() {
  console.log('Memory:', renderer.info.memory);
  console.log('Render:', renderer.info.render);
}

// ============================================
// 对象池
// ============================================
class ObjectPool {
  constructor(createFn, initialSize = 10) {
    this.createFn = createFn;
    this.pool = [];
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  get() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }
  
  release(object) {
    // 重置对象状态
    object.position.set(0, 0, 0);
    object.rotation.set(0, 0, 0);
    object.scale.set(1, 1, 1);
    object.visible = false;
    
    this.pool.push(object);
  }
}

// 使用
const bulletPool = new ObjectPool(() => {
  return new THREE.Mesh(bulletGeometry, bulletMaterial);
}, 100);

const bullet = bulletPool.get();
bullet.visible = true;
scene.add(bullet);

// 回收
bulletPool.release(bullet);
scene.remove(bullet);
```

---

## 20. 常用工具与技巧

### 20.1 射线检测 Raycaster

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ============================================
// 鼠标点击检测
// ============================================
window.addEventListener('click', (event) => {
  // 计算标准化设备坐标
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // 更新射线
  raycaster.setFromCamera(mouse, camera);
  
  // 检测相交
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const object = intersects[0].object;
    const point = intersects[0].point;
    const face = intersects[0].face;
    const distance = intersects[0].distance;
    const uv = intersects[0].uv;
    
    console.log('Clicked:', object.name);
    console.log('Point:', point);
    console.log('Distance:', distance);
  }
});

// ============================================
// 悬停检测
// ============================================
let hoveredObject = null;

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(selectableObjects);
  
  if (intersects.length > 0) {
    if (hoveredObject !== intersects[0].object) {
      // 取消之前的悬停
      if (hoveredObject) {
        hoveredObject.material.emissive.setHex(0x000000);
      }
      
      // 设置新的悬停
      hoveredObject = intersects[0].object;
      hoveredObject.material.emissive.setHex(0x333333);
      document.body.style.cursor = 'pointer';
    }
  } else {
    if (hoveredObject) {
      hoveredObject.material.emissive.setHex(0x000000);
      hoveredObject = null;
      document.body.style.cursor = 'default';
    }
  }
});

// ============================================
// 射线配置
// ============================================
raycaster.near = 0;      // 近裁剪
raycaster.far = Infinity; // 远裁剪

// 设置图层过滤
raycaster.layers.set(1);  // 只检测图层1

// 线段/点的阈值
raycaster.params.Line.threshold = 1;
raycaster.params.Points.threshold = 1;

// ============================================
// 从任意点投射射线
// ============================================
const origin = new THREE.Vector3(0, 10, 0);
const direction = new THREE.Vector3(0, -1, 0);

raycaster.set(origin, direction);
const intersects = raycaster.intersectObjects(scene.children);
```

### 20.2 坐标转换

```javascript
// ============================================
// 世界坐标 → 屏幕坐标
// ============================================
function worldToScreen(position, camera, width, height) {
  const vector = position.clone();
  vector.project(camera);
  
  return {
    x: (vector.x * 0.5 + 0.5) * width,
    y: (-vector.y * 0.5 + 0.5) * height
  };
}

// ============================================
// 屏幕坐标 → 世界坐标
// ============================================
function screenToWorld(x, y, camera, targetZ = 0) {
  const vector = new THREE.Vector3(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.5
  );
  
  vector.unproject(camera);
  
  const dir = vector.sub(camera.position).normalize();
  const distance = (targetZ - camera.position.z) / dir.z;
  
  return camera.position.clone().add(dir.multiplyScalar(distance));
}

// ============================================
// 本地坐标 ↔ 世界坐标
// ============================================
// 本地 → 世界
const worldPos = mesh.localToWorld(localPoint.clone());

// 世界 → 本地
const localPos = mesh.worldToLocal(worldPoint.clone());

// ============================================
// HTML元素跟随3D对象
// ============================================
function updateLabel(mesh, label) {
  const vector = new THREE.Vector3();
  mesh.getWorldPosition(vector);
  vector.project(camera);
  
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
  
  label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  
  // 检查是否在相机前方
  label.style.display = vector.z < 1 ? 'block' : 'none';
}
```

### 20.3 CSS3DRenderer

```javascript
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

// ============================================
// 创建CSS3D渲染器
// ============================================
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(cssRenderer.domElement);

// ============================================
// 创建CSS3D对象
// ============================================
const element = document.createElement('div');
element.className = 'css3d-element';
element.innerHTML = '<h1>Hello World</h1>';
element.style.width = '200px';
element.style.height = '100px';
element.style.background = 'rgba(255, 255, 255, 0.8)';
element.style.padding = '10px';
element.style.pointerEvents = 'auto';

const cssObject = new CSS3DObject(element);
cssObject.position.set(0, 2, 0);
cssObject.rotation.y = Math.PI / 4;
scene.add(cssObject);

// ============================================
// 渲染循环
// ============================================
function animate() {
  requestAnimationFrame(animate);
  
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

// ============================================
// CSS3DSprite - 始终面向相机
// ============================================
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';

const spriteElement = document.createElement('div');
spriteElement.textContent = 'Label';

const cssSprite = new CSS3DSprite(spriteElement);
cssSprite.position.set(0, 3, 0);
scene.add(cssSprite);
```

### 20.4 常用工具函数

```javascript
// ============================================
// 加载带进度的资源
// ============================================
async function loadWithProgress(loader, url, onProgress) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      resolve,
      (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        onProgress?.(percent);
      },
      reject
    );
  });
}

// ============================================
// 场景截图
// ============================================
function captureScene(renderer, scene, camera, width, height) {
  const prevSize = new THREE.Vector2();
  renderer.getSize(prevSize);
  
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  
  const dataUrl = renderer.domElement.toDataURL('image/png');
  
  renderer.setSize(prevSize.x, prevSize.y);
  
  return dataUrl;
}

// ============================================
// 计算对象尺寸
// ============================================
function getObjectSize(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  return size;
}

// ============================================
// 居中对象
// ============================================
function centerObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
}

// ============================================
// 适配相机到对象
// ============================================
function fitCameraToObject(camera, object, offset = 1.5) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const distance = maxDim / (2 * Math.tan(fov / 2)) * offset;
  
  camera.position.set(
    center.x + distance,
    center.y + distance,
    center.z + distance
  );
  camera.lookAt(center);
  
  return { center, distance };
}

// ============================================
// 渐变过渡
// ============================================
function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeInOut(t) {
  return t < 0.5 
    ? 2 * t * t 
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ============================================
// 随机范围
// ============================================
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPointInSphere(radius) {
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2 * Math.PI;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

// ============================================
// 颜色工具
// ============================================
function lerpColors(color1, color2, t) {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, t);
}

function randomColor() {
  return new THREE.Color().setHSL(Math.random(), 0.8, 0.5);
}

// ============================================
// 计时器
// ============================================
class Timer {
  constructor() {
    this.startTime = performance.now();
    this.elapsed = 0;
    this.delta = 0;
    this.lastTime = this.startTime;
  }
  
  update() {
    const currentTime = performance.now();
    this.delta = (currentTime - this.lastTime) / 1000;
    this.elapsed = (currentTime - this.startTime) / 1000;
    this.lastTime = currentTime;
    return this.delta;
  }
}
```

---

## 附录：常用代码模板

### 基础场景模板

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App {
  constructor() {
    this.init();
    this.createScene();
    this.animate();
  }
  
  init() {
    // 场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    
    // 相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);
    
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
    
    // 控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    
    // 时钟
    this.clock = new THREE.Clock();
    
    // 事件
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  createScene() {
    // 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // 网格辅助
    const gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);
    
    // 示例对象
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.position.y = 0.5;
    this.scene.add(this.cube);
    
    // 地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // 更新
    this.cube.rotation.y += delta;
    this.controls.update();
    
    // 渲染
    this.renderer.render(this.scene, this.camera);
  }
  
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

new App();
```

---

> 本文档持续更新中，涵盖了Three.js的核心API和常用功能。如需更多详细信息，请参考[Three.js官方文档](https://threejs.org/docs/)。

