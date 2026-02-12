# Three.js + Vue3 + TypeScript 大厂项目实战详解
<div class="doc-toc">
## 目录

1. [项目初始化与 TypeScript 配置](#1-项目初始化与-typescript-配置)
2. [Three.js 类型定义](#2-threejs-类型定义)
3. [组合式 API 类型封装](#3-组合式-api-类型封装)
4. [类型安全的组件开发](#4-类型安全的组件开发)
5. [状态管理类型化](#5-状态管理类型化)
6. [工具类与类型守卫](#6-工具类与类型守卫)
7. [企业级架构模式](#7-企业级架构模式)
8. [性能优化与类型安全](#8-性能优化与类型安全)
9. [实战案例](#9-实战案例)
10. [最佳实践总结](#10-最佳实践总结)


</div>

---

## 1. 项目初始化与 TypeScript 配置

### 1.1 创建项目

```bash
# 使用 Vite 创建 Vue3 + TypeScript 项目
npm create vite@latest my-threejs-app -- --template vue-ts

cd my-threejs-app

# 安装依赖
npm install three
npm install -D @types/three

# 安装其他常用依赖
npm install pinia vue-router
npm install gsap
npm install -D sass
```

### 1.2 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@three/*": ["src/three/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"],
      "@stores/*": ["src/stores/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.3 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@three': resolve(__dirname, 'src/three'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@stores': resolve(__dirname, 'src/stores')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'three-addons': [
            'three/addons/controls/OrbitControls.js',
            'three/addons/loaders/GLTFLoader.js'
          ]
        }
      }
    }
  }
})
```

### 1.4 项目目录结构

```
src/
├── assets/
├── components/
│   ├── three/
│   │   ├── ThreeCanvas.vue
│   │   ├── ThreeScene.vue
│   │   └── objects/
│   └── ui/
├── hooks/
│   ├── useThree.ts
│   ├── useLoader.ts
│   ├── useAnimation.ts
│   └── useControls.ts
├── three/
│   ├── core/
│   │   ├── Engine.ts
│   │   ├── SceneManager.ts
│   │   └── ResourceManager.ts
│   ├── objects/
│   ├── materials/
│   └── shaders/
├── types/
│   ├── three.d.ts
│   ├── scene.ts
│   ├── loader.ts
│   └── index.ts
├── stores/
│   ├── index.ts
│   └── threeStore.ts
├── router/
│   └── index.ts
├── views/
├── utils/
├── App.vue
└── main.ts
```

---

## 2. Three.js 类型定义

### 2.1 基础类型定义

```typescript
// src/types/three.d.ts
import * as THREE from 'three'
import { GLTF } from 'three/addons/loaders/GLTFLoader.js'

// 向量类型
export type Vector3Tuple = [number, number, number]
export type Vector2Tuple = [number, number]
export type EulerTuple = [number, number, number, THREE.EulerOrder?]
export type ColorRepresentation = THREE.ColorRepresentation

// 变换类型
export interface Transform {
  position?: Vector3Tuple | THREE.Vector3
  rotation?: EulerTuple | THREE.Euler
  scale?: Vector3Tuple | THREE.Vector3 | number
}

// 材质属性类型
export interface MaterialProps {
  color?: ColorRepresentation
  opacity?: number
  transparent?: boolean
  metalness?: number
  roughness?: number
  wireframe?: boolean
  side?: THREE.Side
  map?: THREE.Texture | null
  normalMap?: THREE.Texture | null
  roughnessMap?: THREE.Texture | null
  metalnessMap?: THREE.Texture | null
  envMap?: THREE.Texture | null
  envMapIntensity?: number
}

// 几何体类型
export type GeometryType = 
  | 'box' 
  | 'sphere' 
  | 'plane' 
  | 'cylinder' 
  | 'cone' 
  | 'torus'
  | 'torusKnot'
  | 'ring'
  | 'circle'

// 材质类型
export type MaterialType = 
  | 'basic' 
  | 'standard' 
  | 'phong' 
  | 'lambert' 
  | 'physical'
  | 'toon'
  | 'normal'

// 光源类型
export type LightType = 
  | 'ambient' 
  | 'directional' 
  | 'point' 
  | 'spot' 
  | 'hemisphere'
  | 'rectArea'

// 阴影配置
export interface ShadowConfig {
  enabled?: boolean
  mapSize?: number
  bias?: number
  normalBias?: number
  radius?: number
  camera?: {
    near?: number
    far?: number
    left?: number
    right?: number
    top?: number
    bottom?: number
    fov?: number
  }
}

// 渲染器配置
export interface RendererConfig {
  antialias?: boolean
  alpha?: boolean
  powerPreference?: 'high-performance' | 'low-power' | 'default'
  precision?: 'highp' | 'mediump' | 'lowp'
  shadows?: boolean | ShadowConfig
  toneMapping?: THREE.ToneMapping
  toneMappingExposure?: number
  outputEncoding?: THREE.TextureEncoding
  pixelRatio?: number
}

// 相机配置
export interface CameraConfig {
  type?: 'perspective' | 'orthographic'
  fov?: number
  aspect?: number
  near?: number
  far?: number
  position?: Vector3Tuple
  lookAt?: Vector3Tuple
}

// 控制器配置
export interface ControlsConfig {
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  minDistance?: number
  maxDistance?: number
  enableRotate?: boolean
  minPolarAngle?: number
  maxPolarAngle?: number
  enablePan?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
}

// GLTF 加载结果
export interface GLTFResult extends GLTF {
  scene: THREE.Group
  scenes: THREE.Group[]
  animations: THREE.AnimationClip[]
  cameras: THREE.Camera[]
  asset: {
    generator?: string
    version?: string
  }
}

// 加载进度
export interface LoadingProgress {
  loaded: number
  total: number
  progress: number
}

// 射线检测结果
export interface RaycastResult {
  object: THREE.Object3D
  distance: number
  point: THREE.Vector3
  face: THREE.Face | null
  faceIndex: number | null
  uv?: THREE.Vector2
  uv2?: THREE.Vector2
  instanceId?: number
}
```

### 2.2 场景类型定义

```typescript
// src/types/scene.ts
import * as THREE from 'three'
import type { 
  Transform, 
  MaterialProps, 
  LightType,
  GeometryType,
  MaterialType 
} from './three.d'

// 场景配置
export interface SceneConfig {
  background?: THREE.ColorRepresentation | THREE.Texture | THREE.CubeTexture
  environment?: THREE.Texture | null
  fog?: FogConfig | null
}

// 雾配置
export interface FogConfig {
  type: 'linear' | 'exponential'
  color: THREE.ColorRepresentation
  near?: number
  far?: number
  density?: number
}

// 场景对象元数据
export interface SceneObjectMeta {
  id: string
  name: string
  type: string
  visible: boolean
  selectable: boolean
  userData?: Record<string, unknown>
}

// 网格配置
export interface MeshConfig extends Transform {
  geometry: GeometryType
  geometryArgs?: number[]
  material: MaterialType
  materialProps?: MaterialProps
  castShadow?: boolean
  receiveShadow?: boolean
  name?: string
  userData?: Record<string, unknown>
}

// 光源配置
export interface LightConfig extends Transform {
  type: LightType
  color?: THREE.ColorRepresentation
  intensity?: number
  castShadow?: boolean
  shadowConfig?: {
    mapSize?: number
    bias?: number
    normalBias?: number
  }
  // 聚光灯
  angle?: number
  penumbra?: number
  decay?: number
  distance?: number
  // 半球光
  groundColor?: THREE.ColorRepresentation
  // 区域光
  width?: number
  height?: number
}

// 模型配置
export interface ModelConfig extends Transform {
  url: string
  castShadow?: boolean
  receiveShadow?: boolean
  onProgress?: (progress: number) => void
  onLoad?: (model: THREE.Group) => void
  onError?: (error: Error) => void
}

// 动画状态
export interface AnimationState {
  name: string
  isPlaying: boolean
  isPaused: boolean
  time: number
  duration: number
  weight: number
  timeScale: number
}
```

### 2.3 事件类型定义

```typescript
// src/types/events.ts
import * as THREE from 'three'

// Three.js 更新事件
export interface UpdateEvent {
  delta: number
  elapsed: number
}

// 射线检测事件
export interface RaycastEvent {
  object: THREE.Object3D
  point: THREE.Vector3
  distance: number
  face: THREE.Face | null
  uv?: THREE.Vector2
}

// 控制器事件
export interface ControlsChangeEvent {
  target: THREE.Vector3
  position: THREE.Vector3
  zoom: number
}

// 拖拽事件
export interface DragEvent {
  object: THREE.Object3D
  position: THREE.Vector3
}

// 选择事件
export interface SelectEvent {
  object: THREE.Object3D | null
  previousObject: THREE.Object3D | null
}

// 加载事件
export interface LoadEvent<T = unknown> {
  resource: T
  url: string
  type: string
}

// 错误事件
export interface ErrorEvent {
  message: string
  url?: string
  error?: Error
}

// 窗口调整事件
export interface ResizeEvent {
  width: number
  height: number
  aspect: number
}
```

---

## 3. 组合式 API 类型封装

### 3.1 useThree Hook

```typescript
// src/hooks/useThree.ts
import { ref, shallowRef, onMounted, onUnmounted, type Ref, type ShallowRef } from 'vue'
import * as THREE from 'three'
import type { RendererConfig, UpdateEvent, ResizeEvent } from '@/types'

export interface UseThreeOptions extends RendererConfig {
  onUpdate?: (event: UpdateEvent) => void
  onResize?: (event: ResizeEvent) => void
}

export interface UseThreeReturn {
  scene: ShallowRef<THREE.Scene>
  camera: ShallowRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>
  renderer: ShallowRef<THREE.WebGLRenderer | null>
  clock: THREE.Clock
  isRunning: Ref<boolean>
  onUpdate: (callback: (event: UpdateEvent) => void) => () => void
  onResize: (callback: (event: ResizeEvent) => void) => () => void
  start: () => void
  stop: () => void
  resize: () => void
  dispose: () => void
}

export function useThree(
  containerRef: Ref<HTMLElement | null>,
  options: UseThreeOptions = {}
): UseThreeReturn {
  const {
    antialias = true,
    alpha = false,
    shadows = true,
    toneMapping = THREE.ACESFilmicToneMapping,
    toneMappingExposure = 1,
    outputEncoding = THREE.sRGBEncoding,
    pixelRatio = Math.min(window.devicePixelRatio, 2),
    onUpdate: initialOnUpdate,
    onResize: initialOnResize
  } = options

  const scene = shallowRef<THREE.Scene>(new THREE.Scene())
  const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
  const clock = new THREE.Clock()
  const isRunning = ref(false)
  
  let animationId: number | null = null
  const updateCallbacks = new Set<(event: UpdateEvent) => void>()
  const resizeCallbacks = new Set<(event: ResizeEvent) => void>()

  if (initialOnUpdate) updateCallbacks.add(initialOnUpdate)
  if (initialOnResize) resizeCallbacks.add(initialOnResize)

  function init(): void {
    const container = containerRef.value
    if (!container) return

    const { width, height } = container.getBoundingClientRect()

    // 创建相机
    camera.value = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.value.position.set(0, 5, 10)

    // 创建渲染器
    renderer.value = new THREE.WebGLRenderer({ antialias, alpha })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(pixelRatio)
    renderer.value.toneMapping = toneMapping
    renderer.value.toneMappingExposure = toneMappingExposure
    renderer.value.outputEncoding = outputEncoding

    if (shadows) {
      renderer.value.shadowMap.enabled = true
      renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
    }

    container.appendChild(renderer.value.domElement)
  }

  function animate(): void {
    if (!isRunning.value) return
    
    animationId = requestAnimationFrame(animate)
    
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime()
    const event: UpdateEvent = { delta, elapsed }

    updateCallbacks.forEach(callback => callback(event))

    if (renderer.value && camera.value) {
      renderer.value.render(scene.value, camera.value)
    }
  }

  function start(): void {
    if (isRunning.value) return
    isRunning.value = true
    animate()
  }

  function stop(): void {
    isRunning.value = false
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  function resize(): void {
    const container = containerRef.value
    if (!container || !camera.value || !renderer.value) return

    const { width, height } = container.getBoundingClientRect()
    const aspect = width / height

    if (camera.value instanceof THREE.PerspectiveCamera) {
      camera.value.aspect = aspect
      camera.value.updateProjectionMatrix()
    }

    renderer.value.setSize(width, height)

    const event: ResizeEvent = { width, height, aspect }
    resizeCallbacks.forEach(callback => callback(event))
  }

  function onUpdate(callback: (event: UpdateEvent) => void): () => void {
    updateCallbacks.add(callback)
    return () => updateCallbacks.delete(callback)
  }

  function onResizeCallback(callback: (event: ResizeEvent) => void): () => void {
    resizeCallbacks.add(callback)
    return () => resizeCallbacks.delete(callback)
  }

  function dispose(): void {
    stop()
    
    scene.value.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material?.dispose()
        }
      }
    })
    
    renderer.value?.dispose()
    updateCallbacks.clear()
    resizeCallbacks.clear()
  }

  onMounted(() => {
    init()
    start()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    dispose()
  })

  return {
    scene,
    camera,
    renderer,
    clock,
    isRunning,
    onUpdate,
    onResize: onResizeCallback,
    start,
    stop,
    resize,
    dispose
  }
}
```

### 3.2 useLoader Hook

```typescript
// src/hooks/useLoader.ts
import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import type { LoadingProgress, GLTFResult } from '@/types'

// 加载资源类型
export interface ResourceToLoad {
  type: 'texture' | 'model' | 'hdri' | 'cubeTexture'
  url: string | string[]
  name: string
  options?: TextureOptions | ModelOptions
}

export interface TextureOptions {
  encoding?: THREE.TextureEncoding
  repeat?: [number, number]
  wrapS?: THREE.Wrapping
  wrapT?: THREE.Wrapping
  flipY?: boolean
  generateMipmaps?: boolean
}

export interface ModelOptions {
  castShadow?: boolean
  receiveShadow?: boolean
  scale?: number | [number, number, number]
}

export interface UseLoaderReturn {
  isLoading: Ref<boolean>
  progress: Ref<number>
  error: Ref<Error | null>
  loadTexture: (url: string, options?: TextureOptions) => Promise<THREE.Texture>
  loadModel: (url: string, options?: ModelOptions) => Promise<GLTFResult>
  loadHDRI: (url: string, renderer: THREE.WebGLRenderer) => Promise<THREE.Texture>
  loadCubeTexture: (urls: string[]) => Promise<THREE.CubeTexture>
  loadAll: <T extends Record<string, ResourceToLoad>>(
    resources: T,
    renderer?: THREE.WebGLRenderer
  ) => Promise<{ [K in keyof T]: LoadedResource }>
  clearCache: () => void
}

type LoadedResource = THREE.Texture | THREE.CubeTexture | GLTFResult

// 缓存
const cache = new Map<string, LoadedResource>()

// 加载器实例
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// 配置 Draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

export function useLoader(): UseLoaderReturn {
  const isLoading = ref(false)
  const progress = ref(0)
  const error = ref<Error | null>(null)

  async function loadTexture(
    url: string,
    options: TextureOptions = {}
  ): Promise<THREE.Texture> {
    if (cache.has(url)) {
      return cache.get(url) as THREE.Texture
    }

    isLoading.value = true
    error.value = null

    try {
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          url,
          resolve,
          (xhr) => {
            progress.value = (xhr.loaded / xhr.total) * 100
          },
          reject
        )
      })

      // 应用选项
      if (options.encoding) texture.encoding = options.encoding
      if (options.repeat) {
        texture.wrapS = options.wrapS ?? THREE.RepeatWrapping
        texture.wrapT = options.wrapT ?? THREE.RepeatWrapping
        texture.repeat.set(options.repeat[0], options.repeat[1])
      }
      if (options.flipY !== undefined) texture.flipY = options.flipY
      if (options.generateMipmaps !== undefined) {
        texture.generateMipmaps = options.generateMipmaps
      }

      cache.set(url, texture)
      return texture
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function loadModel(
    url: string,
    options: ModelOptions = {}
  ): Promise<GLTFResult> {
    if (cache.has(url)) {
      const cached = cache.get(url) as GLTFResult
      return {
        ...cached,
        scene: cached.scene.clone()
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const gltf = await new Promise<GLTF>((resolve, reject) => {
        gltfLoader.load(
          url,
          resolve,
          (xhr) => {
            progress.value = (xhr.loaded / xhr.total) * 100
          },
          reject
        )
      })

      // 处理阴影和缩放
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (options.castShadow) child.castShadow = true
          if (options.receiveShadow) child.receiveShadow = true
        }
      })

      if (options.scale) {
        if (typeof options.scale === 'number') {
          gltf.scene.scale.setScalar(options.scale)
        } else {
          gltf.scene.scale.set(...options.scale)
        }
      }

      const result = gltf as GLTFResult
      cache.set(url, result)
      return result
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function loadHDRI(
    url: string,
    renderer: THREE.WebGLRenderer
  ): Promise<THREE.Texture> {
    if (cache.has(url)) {
      return cache.get(url) as THREE.Texture
    }

    isLoading.value = true
    error.value = null

    try {
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        rgbeLoader.load(
          url,
          resolve,
          (xhr) => {
            progress.value = (xhr.loaded / xhr.total) * 100
          },
          reject
        )
      })

      texture.mapping = THREE.EquirectangularReflectionMapping

      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      pmremGenerator.compileEquirectangularShader()
      const envMap = pmremGenerator.fromEquirectangular(texture).texture
      
      texture.dispose()
      pmremGenerator.dispose()

      cache.set(url, envMap)
      return envMap
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function loadCubeTexture(urls: string[]): Promise<THREE.CubeTexture> {
    const key = urls.join(',')
    if (cache.has(key)) {
      return cache.get(key) as THREE.CubeTexture
    }

    isLoading.value = true
    error.value = null

    try {
      const texture = await new Promise<THREE.CubeTexture>((resolve, reject) => {
        cubeTextureLoader.load(urls, resolve, undefined, reject)
      })

      cache.set(key, texture)
      return texture
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function loadAll<T extends Record<string, ResourceToLoad>>(
    resources: T,
    renderer?: THREE.WebGLRenderer
  ): Promise<{ [K in keyof T]: LoadedResource }> {
    isLoading.value = true
    progress.value = 0
    
    const entries = Object.entries(resources)
    const total = entries.length
    let loaded = 0
    
    const results: Record<string, LoadedResource> = {}

    for (const [name, resource] of entries) {
      try {
        let result: LoadedResource
        
        switch (resource.type) {
          case 'texture':
            result = await loadTexture(
              resource.url as string, 
              resource.options as TextureOptions
            )
            break
          case 'model':
            result = await loadModel(
              resource.url as string, 
              resource.options as ModelOptions
            )
            break
          case 'hdri':
            if (!renderer) throw new Error('Renderer required for HDRI loading')
            result = await loadHDRI(resource.url as string, renderer)
            break
          case 'cubeTexture':
            result = await loadCubeTexture(resource.url as string[])
            break
          default:
            throw new Error(`Unknown resource type: ${resource.type}`)
        }
        
        results[name] = result
        loaded++
        progress.value = (loaded / total) * 100
      } catch (e) {
        console.error(`Failed to load ${name}:`, e)
      }
    }

    isLoading.value = false
    return results as { [K in keyof T]: LoadedResource }
  }

  function clearCache(): void {
    cache.forEach((resource) => {
      if (resource instanceof THREE.Texture) {
        resource.dispose()
      }
    })
    cache.clear()
  }

  return {
    isLoading,
    progress,
    error,
    loadTexture,
    loadModel,
    loadHDRI,
    loadCubeTexture,
    loadAll,
    clearCache
  }
}
```

### 3.3 useAnimation Hook

```typescript
// src/hooks/useAnimation.ts
import { ref, shallowRef, onUnmounted, type Ref, type ShallowRef } from 'vue'
import * as THREE from 'three'
import type { AnimationState } from '@/types'

export interface UseAnimationOptions {
  autoPlay?: boolean
  loop?: THREE.AnimationActionLoopStyles
  crossFadeDuration?: number
}

export interface UseAnimationReturn {
  mixer: ShallowRef<THREE.AnimationMixer | null>
  actions: Ref<Map<string, THREE.AnimationAction>>
  currentAction: ShallowRef<THREE.AnimationAction | null>
  animationStates: Ref<AnimationState[]>
  init: (object: THREE.Object3D, clips: THREE.AnimationClip[]) => void
  play: (name: string, options?: PlayOptions) => THREE.AnimationAction | null
  stop: (name?: string) => void
  pause: () => void
  resume: () => void
  crossFade: (fromName: string, toName: string, duration?: number) => void
  setTimeScale: (name: string, scale: number) => void
  setWeight: (name: string, weight: number) => void
  update: (delta: number) => void
  getAnimationNames: () => string[]
  dispose: () => void
}

export interface PlayOptions {
  loop?: THREE.AnimationActionLoopStyles
  repetitions?: number
  clampWhenFinished?: boolean
  timeScale?: number
  weight?: number
  fadeIn?: number
}

export function useAnimation(options: UseAnimationOptions = {}): UseAnimationReturn {
  const {
    autoPlay = false,
    loop = THREE.LoopRepeat,
    crossFadeDuration = 0.5
  } = options

  const mixer = shallowRef<THREE.AnimationMixer | null>(null)
  const actions = ref<Map<string, THREE.AnimationAction>>(new Map())
  const currentAction = shallowRef<THREE.AnimationAction | null>(null)
  const animationStates = ref<AnimationState[]>([])

  function updateStates(): void {
    animationStates.value = Array.from(actions.value.entries()).map(
      ([name, action]) => ({
        name,
        isPlaying: action.isRunning(),
        isPaused: action.paused,
        time: action.time,
        duration: action.getClip().duration,
        weight: action.weight,
        timeScale: action.timeScale
      })
    )
  }

  function init(object: THREE.Object3D, clips: THREE.AnimationClip[]): void {
    mixer.value = new THREE.AnimationMixer(object)
    actions.value.clear()

    clips.forEach((clip) => {
      const action = mixer.value!.clipAction(clip)
      action.loop = loop
      actions.value.set(clip.name, action)
    })

    updateStates()

    if (autoPlay && clips.length > 0) {
      play(clips[0].name)
    }

    // 监听动画完成事件
    mixer.value.addEventListener('finished', (e) => {
      updateStates()
    })
  }

  function play(name: string, playOptions: PlayOptions = {}): THREE.AnimationAction | null {
    const action = actions.value.get(name)
    if (!action) {
      console.warn(`Animation "${name}" not found`)
      return null
    }

    const {
      loop: actionLoop = loop,
      repetitions = Infinity,
      clampWhenFinished = false,
      timeScale = 1,
      weight = 1,
      fadeIn
    } = playOptions

    action.loop = actionLoop
    action.repetitions = repetitions
    action.clampWhenFinished = clampWhenFinished
    action.timeScale = timeScale
    action.weight = weight

    if (currentAction.value && currentAction.value !== action) {
      if (fadeIn !== undefined) {
        action.reset()
        action.fadeIn(fadeIn)
        currentAction.value.fadeOut(fadeIn)
      } else {
        action.reset()
        action.crossFadeFrom(currentAction.value, crossFadeDuration, true)
      }
    }

    action.play()
    currentAction.value = action
    updateStates()

    return action
  }

  function stop(name?: string): void {
    if (name) {
      actions.value.get(name)?.stop()
    } else {
      actions.value.forEach((action) => action.stop())
      currentAction.value = null
    }
    updateStates()
  }

  function pause(): void {
    if (currentAction.value) {
      currentAction.value.paused = true
      updateStates()
    }
  }

  function resume(): void {
    if (currentAction.value) {
      currentAction.value.paused = false
      updateStates()
    }
  }

  function crossFade(
    fromName: string,
    toName: string,
    duration: number = crossFadeDuration
  ): void {
    const fromAction = actions.value.get(fromName)
    const toAction = actions.value.get(toName)

    if (!fromAction || !toAction) {
      console.warn('Animation not found for crossFade')
      return
    }

    toAction.reset()
    toAction.crossFadeFrom(fromAction, duration, true)
    toAction.play()
    currentAction.value = toAction
    updateStates()
  }

  function setTimeScale(name: string, scale: number): void {
    const action = actions.value.get(name)
    if (action) {
      action.timeScale = scale
      updateStates()
    }
  }

  function setWeight(name: string, weight: number): void {
    const action = actions.value.get(name)
    if (action) {
      action.weight = weight
      updateStates()
    }
  }

  function update(delta: number): void {
    mixer.value?.update(delta)
  }

  function getAnimationNames(): string[] {
    return Array.from(actions.value.keys())
  }

  function dispose(): void {
    if (mixer.value) {
      mixer.value.stopAllAction()
      mixer.value.uncacheRoot(mixer.value.getRoot())
    }
    actions.value.clear()
    currentAction.value = null
    animationStates.value = []
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    mixer,
    actions,
    currentAction,
    animationStates,
    init,
    play,
    stop,
    pause,
    resume,
    crossFade,
    setTimeScale,
    setWeight,
    update,
    getAnimationNames,
    dispose
  }
}
```

### 3.4 useRaycaster Hook

```typescript
// src/hooks/useRaycaster.ts
import { ref, shallowRef, onMounted, onUnmounted, type Ref, type ShallowRef } from 'vue'
import * as THREE from 'three'
import type { RaycastResult, RaycastEvent } from '@/types'

export interface UseRaycasterOptions {
  recursive?: boolean
  onHover?: (event: RaycastEvent | null) => void
  onHoverOut?: (object: THREE.Object3D) => void
  onClick?: (event: RaycastEvent | null) => void
}

export interface UseRaycasterReturn {
  raycaster: THREE.Raycaster
  mouse: THREE.Vector2
  hoveredObject: ShallowRef<THREE.Object3D | null>
  selectedObject: ShallowRef<THREE.Object3D | null>
  intersects: Ref<RaycastResult[]>
  setObjects: (objects: THREE.Object3D[]) => void
  checkIntersects: () => RaycastResult[]
  enable: () => void
  disable: () => void
}

export function useRaycaster(
  camera: Ref<THREE.Camera | null>,
  domElement: Ref<HTMLElement | null>,
  options: UseRaycasterOptions = {}
): UseRaycasterReturn {
  const {
    recursive = true,
    onHover,
    onHoverOut,
    onClick
  } = options

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const hoveredObject = shallowRef<THREE.Object3D | null>(null)
  const selectedObject = shallowRef<THREE.Object3D | null>(null)
  const intersects = ref<RaycastResult[]>([])
  
  let objects: THREE.Object3D[] = []
  let enabled = true

  function setObjects(newObjects: THREE.Object3D[]): void {
    objects = newObjects
  }

  function updateMouse(event: MouseEvent): void {
    if (!domElement.value) return
    
    const rect = domElement.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  function checkIntersects(): RaycastResult[] {
    if (!camera.value || objects.length === 0) return []
    
    raycaster.setFromCamera(mouse, camera.value)
    const hits = raycaster.intersectObjects(objects, recursive)
    
    intersects.value = hits.map(hit => ({
      object: hit.object,
      distance: hit.distance,
      point: hit.point,
      face: hit.face,
      faceIndex: hit.faceIndex ?? null,
      uv: hit.uv,
      uv2: hit.uv2,
      instanceId: hit.instanceId
    }))
    
    return intersects.value
  }

  function createEvent(result: RaycastResult | null): RaycastEvent | null {
    if (!result) return null
    return {
      object: result.object,
      point: result.point,
      distance: result.distance,
      face: result.face,
      uv: result.uv
    }
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!enabled) return
    
    updateMouse(event)
    const hits = checkIntersects()

    if (hits.length > 0) {
      const newHovered = hits[0].object

      if (newHovered !== hoveredObject.value) {
        if (hoveredObject.value && onHoverOut) {
          onHoverOut(hoveredObject.value)
        }
        hoveredObject.value = newHovered
        if (onHover) {
          onHover(createEvent(hits[0]))
        }
        if (domElement.value) {
          domElement.value.style.cursor = 'pointer'
        }
      }
    } else {
      if (hoveredObject.value) {
        if (onHoverOut) {
          onHoverOut(hoveredObject.value)
        }
        if (onHover) {
          onHover(null)
        }
        hoveredObject.value = null
        if (domElement.value) {
          domElement.value.style.cursor = 'default'
        }
      }
    }
  }

  function handleClick(event: MouseEvent): void {
    if (!enabled) return
    
    updateMouse(event)
    const hits = checkIntersects()

    if (hits.length > 0) {
      selectedObject.value = hits[0].object
      if (onClick) {
        onClick(createEvent(hits[0]))
      }
    } else {
      selectedObject.value = null
      if (onClick) {
        onClick(null)
      }
    }
  }

  function enable(): void {
    enabled = true
  }

  function disable(): void {
    enabled = false
    hoveredObject.value = null
    if (domElement.value) {
      domElement.value.style.cursor = 'default'
    }
  }

  onMounted(() => {
    if (domElement.value) {
      domElement.value.addEventListener('mousemove', handleMouseMove)
      domElement.value.addEventListener('click', handleClick)
    }
  })

  onUnmounted(() => {
    if (domElement.value) {
      domElement.value.removeEventListener('mousemove', handleMouseMove)
      domElement.value.removeEventListener('click', handleClick)
    }
  })

  return {
    raycaster,
    mouse,
    hoveredObject,
    selectedObject,
    intersects,
    setObjects,
    checkIntersects,
    enable,
    disable
  }
}
```

---

## 4. 类型安全的组件开发

### 4.1 ThreeCanvas 组件

```vue
<!-- src/components/three/ThreeCanvas.vue -->
<template>
  <div ref="containerRef" class="three-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted, type InjectionKey, type ShallowRef } from 'vue'
import * as THREE from 'three'
import type { RendererConfig, UpdateEvent } from '@/types'

// Props 类型定义
export interface ThreeCanvasProps extends RendererConfig {
  width?: number | string
  height?: number | string
}

// Provide/Inject Key 类型
export const SceneKey: InjectionKey<THREE.Scene> = Symbol('scene')
export const CameraKey: InjectionKey<ShallowRef<THREE.PerspectiveCamera | null>> = Symbol('camera')
export const RendererKey: InjectionKey<ShallowRef<THREE.WebGLRenderer | null>> = Symbol('renderer')

// Props
const props = withDefaults(defineProps<ThreeCanvasProps>(), {
  antialias: true,
  alpha: false,
  shadows: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
  outputEncoding: THREE.sRGBEncoding,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  width: '100%',
  height: '100%'
})

// Emits
const emit = defineEmits<{
  update: [event: UpdateEvent]
  ready: [{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer }]
}>()

// Refs
const containerRef = ref<HTMLElement | null>(null)
const scene = new THREE.Scene()
const camera = ref<THREE.PerspectiveCamera | null>(null)
const renderer = ref<THREE.WebGLRenderer | null>(null)

// Provide
provide(SceneKey, scene)
provide(CameraKey, camera)
provide(RendererKey, renderer)

let animationId: number | null = null
const clock = new THREE.Clock()

function init(): void {
  const container = containerRef.value
  if (!container) return

  const { width, height } = container.getBoundingClientRect()

  // 创建相机
  camera.value = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.value.position.set(0, 5, 10)

  // 创建渲染器
  renderer.value = new THREE.WebGLRenderer({
    antialias: props.antialias,
    alpha: props.alpha
  })
  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(props.pixelRatio!)
  renderer.value.toneMapping = props.toneMapping!
  renderer.value.toneMappingExposure = props.toneMappingExposure!
  renderer.value.outputEncoding = props.outputEncoding!

  if (props.shadows) {
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
  }

  container.appendChild(renderer.value.domElement)

  emit('ready', {
    scene,
    camera: camera.value,
    renderer: renderer.value
  })
}

function animate(): void {
  animationId = requestAnimationFrame(animate)
  
  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()
  
  emit('update', { delta, elapsed })
  
  if (renderer.value && camera.value) {
    renderer.value.render(scene, camera.value)
  }
}

function onResize(): void {
  const container = containerRef.value
  if (!container || !camera.value || !renderer.value) return

  const { width, height } = container.getBoundingClientRect()

  camera.value.aspect = width / height
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(width, height)
}

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', onResize)
  renderer.value?.dispose()
})

// 暴露方法和属性
defineExpose({
  scene,
  camera,
  renderer,
  containerRef
})
</script>

<style scoped>
.three-container {
  width: v-bind('props.width');
  height: v-bind('props.height');
  overflow: hidden;
}
</style>
```

### 4.2 ThreeMesh 组件

```vue
<!-- src/components/three/objects/ThreeMesh.vue -->
<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, shallowRef, type ShallowRef } from 'vue'
import * as THREE from 'three'
import { SceneKey } from '../ThreeCanvas.vue'
import type { 
  GeometryType, 
  MaterialType, 
  MaterialProps, 
  Vector3Tuple, 
  EulerTuple 
} from '@/types'

// Props 类型
export interface ThreeMeshProps {
  geometry?: GeometryType
  geometryArgs?: number[]
  material?: MaterialType
  materialProps?: MaterialProps
  position?: Vector3Tuple
  rotation?: EulerTuple
  scale?: Vector3Tuple | number
  castShadow?: boolean
  receiveShadow?: boolean
  name?: string
  visible?: boolean
  userData?: Record<string, unknown>
}

// Emits 类型
export interface ThreeMeshEmits {
  (e: 'created', mesh: THREE.Mesh): void
  (e: 'click', event: { mesh: THREE.Mesh; event: MouseEvent }): void
  (e: 'hover', mesh: THREE.Mesh): void
  (e: 'hoverOut', mesh: THREE.Mesh): void
}

const props = withDefaults(defineProps<ThreeMeshProps>(), {
  geometry: 'box',
  geometryArgs: () => [1, 1, 1],
  material: 'standard',
  materialProps: () => ({}),
  position: () => [0, 0, 0],
  rotation: () => [0, 0, 0],
  scale: 1,
  castShadow: true,
  receiveShadow: true,
  visible: true
})

const emit = defineEmits<ThreeMeshEmits>()

const scene = inject(SceneKey)
const mesh = shallowRef<THREE.Mesh | null>(null)

// 几何体映射
const geometryMap: Record<GeometryType, new (...args: number[]) => THREE.BufferGeometry> = {
  box: THREE.BoxGeometry,
  sphere: THREE.SphereGeometry,
  plane: THREE.PlaneGeometry,
  cylinder: THREE.CylinderGeometry,
  cone: THREE.ConeGeometry,
  torus: THREE.TorusGeometry,
  torusKnot: THREE.TorusKnotGeometry,
  ring: THREE.RingGeometry,
  circle: THREE.CircleGeometry
}

// 材质映射
const materialMap: Record<MaterialType, new (params?: THREE.MaterialParameters) => THREE.Material> = {
  basic: THREE.MeshBasicMaterial,
  standard: THREE.MeshStandardMaterial,
  phong: THREE.MeshPhongMaterial,
  lambert: THREE.MeshLambertMaterial,
  physical: THREE.MeshPhysicalMaterial,
  toon: THREE.MeshToonMaterial,
  normal: THREE.MeshNormalMaterial
}

function createMesh(): void {
  if (!scene) return

  // 创建几何体
  const GeometryClass = geometryMap[props.geometry]
  const geometry = new GeometryClass(...props.geometryArgs)

  // 创建材质
  const MaterialClass = materialMap[props.material]
  const material = new MaterialClass(props.materialProps as THREE.MaterialParameters)

  // 创建网格
  mesh.value = new THREE.Mesh(geometry, material)
  mesh.value.position.set(...props.position)
  mesh.value.rotation.set(...(props.rotation.slice(0, 3) as [number, number, number]))
  
  if (typeof props.scale === 'number') {
    mesh.value.scale.setScalar(props.scale)
  } else {
    mesh.value.scale.set(...props.scale)
  }
  
  mesh.value.castShadow = props.castShadow
  mesh.value.receiveShadow = props.receiveShadow
  mesh.value.visible = props.visible
  
  if (props.name) mesh.value.name = props.name
  if (props.userData) mesh.value.userData = props.userData

  scene.add(mesh.value)
  emit('created', mesh.value)
}

// 监听属性变化
watch(() => props.position, (newPos) => {
  if (mesh.value) mesh.value.position.set(...newPos)
}, { deep: true })

watch(() => props.rotation, (newRot) => {
  if (mesh.value) mesh.value.rotation.set(...(newRot.slice(0, 3) as [number, number, number]))
}, { deep: true })

watch(() => props.scale, (newScale) => {
  if (mesh.value) {
    if (typeof newScale === 'number') {
      mesh.value.scale.setScalar(newScale)
    } else {
      mesh.value.scale.set(...newScale)
    }
  }
})

watch(() => props.materialProps, (newProps) => {
  if (mesh.value && mesh.value.material instanceof THREE.Material) {
    const material = mesh.value.material as THREE.MeshStandardMaterial
    
    if (newProps.color !== undefined) {
      material.color.set(newProps.color)
    }
    if (newProps.opacity !== undefined) {
      material.opacity = newProps.opacity
      material.transparent = newProps.opacity < 1
    }
    if (newProps.metalness !== undefined && 'metalness' in material) {
      material.metalness = newProps.metalness
    }
    if (newProps.roughness !== undefined && 'roughness' in material) {
      material.roughness = newProps.roughness
    }
    if (newProps.wireframe !== undefined) {
      material.wireframe = newProps.wireframe
    }
  }
}, { deep: true })

watch(() => props.visible, (newVisible) => {
  if (mesh.value) mesh.value.visible = newVisible
})

onMounted(() => {
  createMesh()
})

onUnmounted(() => {
  if (mesh.value && scene) {
    scene.remove(mesh.value)
    mesh.value.geometry.dispose()
    if (mesh.value.material instanceof THREE.Material) {
      mesh.value.material.dispose()
    }
  }
})

defineExpose({
  mesh
})
</script>
```

### 4.3 ThreeModel 组件

```vue
<!-- src/components/three/objects/ThreeModel.vue -->
<template>
  <div v-if="isLoading" class="loading-overlay">
    <slot name="loading" :progress="progress">
      <div class="default-loading">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <span>{{ Math.round(progress) }}%</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, shallowRef, watch, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { SceneKey } from '../ThreeCanvas.vue'
import type { Vector3Tuple, EulerTuple, GLTFResult } from '@/types'

export interface ThreeModelProps {
  url: string
  position?: Vector3Tuple
  rotation?: EulerTuple
  scale?: Vector3Tuple | number
  castShadow?: boolean
  receiveShadow?: boolean
  autoCenter?: boolean
  autoScale?: number
}

export interface ThreeModelEmits {
  (e: 'loaded', payload: { model: THREE.Group; animations: THREE.AnimationClip[]; gltf: GLTFResult }): void
  (e: 'error', error: Error): void
  (e: 'progress', progress: number): void
}

const props = withDefaults(defineProps<ThreeModelProps>(), {
  position: () => [0, 0, 0],
  rotation: () => [0, 0, 0],
  scale: 1,
  castShadow: true,
  receiveShadow: true,
  autoCenter: false
})

const emit = defineEmits<ThreeModelEmits>()

const scene = inject(SceneKey)
const model = shallowRef<THREE.Group | null>(null)
const isLoading = ref(false)
const progress = ref(0)

// 加载器
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
loader.setDRACOLoader(dracoLoader)

async function loadModel(): Promise<void> {
  if (!scene) return

  isLoading.value = true
  progress.value = 0

  try {
    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        props.url,
        resolve,
        (xhr) => {
          const p = (xhr.loaded / xhr.total) * 100
          progress.value = p
          emit('progress', p)
        },
        reject
      )
    })

    model.value = gltf.scene

    // 设置变换
    model.value.position.set(...props.position)
    model.value.rotation.set(...(props.rotation.slice(0, 3) as [number, number, number]))
    
    if (typeof props.scale === 'number') {
      model.value.scale.setScalar(props.scale)
    } else {
      model.value.scale.set(...props.scale)
    }

    // 自动居中
    if (props.autoCenter) {
      const box = new THREE.Box3().setFromObject(model.value)
      const center = box.getCenter(new THREE.Vector3())
      model.value.position.sub(center)
    }

    // 自动缩放
    if (props.autoScale) {
      const box = new THREE.Box3().setFromObject(model.value)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = props.autoScale / maxDim
      model.value.scale.multiplyScalar(scale)
    }

    // 设置阴影
    model.value.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = props.castShadow
        child.receiveShadow = props.receiveShadow
      }
    })

    scene.add(model.value)

    emit('loaded', {
      model: model.value,
      animations: gltf.animations,
      gltf: gltf as GLTFResult
    })
  } catch (error) {
    emit('error', error as Error)
    console.error('Model loading error:', error)
  } finally {
    isLoading.value = false
  }
}

// 监听 URL 变化
watch(() => props.url, async () => {
  if (model.value && scene) {
    scene.remove(model.value)
    disposeModel(model.value)
  }
  await loadModel()
})

// 监听变换属性
watch(() => props.position, (newPos) => {
  if (model.value) model.value.position.set(...newPos)
}, { deep: true })

watch(() => props.rotation, (newRot) => {
  if (model.value) model.value.rotation.set(...(newRot.slice(0, 3) as [number, number, number]))
}, { deep: true })

watch(() => props.scale, (newScale) => {
  if (model.value) {
    if (typeof newScale === 'number') {
      model.value.scale.setScalar(newScale)
    } else {
      model.value.scale.set(...newScale)
    }
  }
})

function disposeModel(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose())
      } else {
        child.material?.dispose()
      }
    }
  })
}

onMounted(() => {
  loadModel()
})

onUnmounted(() => {
  if (model.value && scene) {
    scene.remove(model.value)
    disposeModel(model.value)
  }
})

defineExpose({
  model,
  isLoading,
  progress,
  reload: loadModel
})
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.default-loading {
  text-align: center;
  color: white;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: #4a90d9;
  transition: width 0.3s;
}
</style>
```

---

## 5. 状态管理类型化

### 5.1 Pinia Store 类型定义

```typescript
// src/stores/threeStore.ts
import { defineStore } from 'pinia'
import { ref, shallowRef, computed, type Ref, type ShallowRef, type ComputedRef } from 'vue'
import * as THREE from 'three'
import type { SceneConfig, SceneObjectMeta, Transform } from '@/types'

// Store State 类型
export interface ThreeStoreState {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null
  renderer: THREE.WebGLRenderer | null
  selectedObject: THREE.Object3D | null
  hoveredObject: THREE.Object3D | null
  sceneConfig: SceneConfig
  editMode: EditMode
  objects: SceneObjectMeta[]
  isLoading: boolean
  loadingProgress: number
}

// 编辑模式类型
export type EditMode = 'select' | 'translate' | 'rotate' | 'scale'

// Store Actions 类型
export interface ThreeStoreActions {
  initScene: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer
  ) => void
  selectObject: (object: THREE.Object3D | null) => void
  addObject: (object: THREE.Object3D, meta?: Partial<SceneObjectMeta>) => void
  removeObject: (id: string) => void
  updateObjectTransform: (id: string, transform: Partial<Transform>) => void
  updateSceneConfig: (config: Partial<SceneConfig>) => void
  setEditMode: (mode: EditMode) => void
  setLoading: (loading: boolean, progress?: number) => void
  resetScene: () => void
  dispose: () => void
}

// Store Getters 类型
export interface ThreeStoreGetters {
  objectCount: ComputedRef<number>
  selectedObjectMeta: ComputedRef<SceneObjectMeta | undefined>
  isObjectSelected: ComputedRef<boolean>
}

export const useThreeStore = defineStore('three', () => {
  // State
  const scene = shallowRef<THREE.Scene | null>(null)
  const camera = shallowRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null)
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
  const selectedObject = shallowRef<THREE.Object3D | null>(null)
  const hoveredObject = shallowRef<THREE.Object3D | null>(null)
  
  const sceneConfig = ref<SceneConfig>({
    background: '#1a1a2e',
    environment: null,
    fog: null
  })
  
  const editMode = ref<EditMode>('select')
  const objects = ref<SceneObjectMeta[]>([])
  const isLoading = ref(false)
  const loadingProgress = ref(0)

  // Getters
  const objectCount = computed(() => objects.value.length)
  
  const selectedObjectMeta = computed(() => {
    if (!selectedObject.value) return undefined
    return objects.value.find(obj => obj.id === selectedObject.value?.uuid)
  })
  
  const isObjectSelected = computed(() => selectedObject.value !== null)

  // Actions
  function initScene(
    s: THREE.Scene,
    c: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    r: THREE.WebGLRenderer
  ): void {
    scene.value = s
    camera.value = c
    renderer.value = r
  }

  function selectObject(object: THREE.Object3D | null): void {
    // 取消之前选中对象的高亮
    if (selectedObject.value) {
      const mesh = selectedObject.value as THREE.Mesh
      if (mesh.material && 'emissive' in mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000)
      }
    }

    selectedObject.value = object

    // 高亮新选中的对象
    if (object) {
      const mesh = object as THREE.Mesh
      if (mesh.material && 'emissive' in mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x333333)
      }
    }
  }

  function addObject(object: THREE.Object3D, meta: Partial<SceneObjectMeta> = {}): void {
    if (!scene.value) return

    scene.value.add(object)
    
    objects.value.push({
      id: object.uuid,
      name: meta.name || object.name || `Object_${objects.value.length}`,
      type: object.type,
      visible: object.visible,
      selectable: meta.selectable ?? true,
      userData: meta.userData || {}
    })
  }

  function removeObject(id: string): void {
    if (!scene.value) return

    const index = objects.value.findIndex(obj => obj.id === id)
    if (index === -1) return

    const objectMeta = objects.value[index]
    const object = scene.value.getObjectByProperty('uuid', id)
    
    if (object) {
      scene.value.remove(object)
      
      // 清理资源
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose())
          } else {
            child.material?.dispose()
          }
        }
      })
    }

    objects.value.splice(index, 1)

    if (selectedObject.value?.uuid === id) {
      selectedObject.value = null
    }
  }

  function updateObjectTransform(id: string, transform: Partial<Transform>): void {
    if (!scene.value) return

    const object = scene.value.getObjectByProperty('uuid', id)
    if (!object) return

    if (transform.position) {
      if (Array.isArray(transform.position)) {
        object.position.set(...transform.position)
      } else {
        object.position.copy(transform.position)
      }
    }

    if (transform.rotation) {
      if (Array.isArray(transform.rotation)) {
        object.rotation.set(...(transform.rotation.slice(0, 3) as [number, number, number]))
      } else {
        object.rotation.copy(transform.rotation)
      }
    }

    if (transform.scale !== undefined) {
      if (typeof transform.scale === 'number') {
        object.scale.setScalar(transform.scale)
      } else if (Array.isArray(transform.scale)) {
        object.scale.set(...transform.scale)
      } else {
        object.scale.copy(transform.scale)
      }
    }
  }

  function updateSceneConfig(config: Partial<SceneConfig>): void {
    Object.assign(sceneConfig.value, config)

    if (!scene.value) return

    if (config.background !== undefined) {
      if (typeof config.background === 'string' || typeof config.background === 'number') {
        scene.value.background = new THREE.Color(config.background)
      } else {
        scene.value.background = config.background
      }
    }

    if (config.environment !== undefined) {
      scene.value.environment = config.environment
    }

    if (config.fog !== undefined) {
      if (config.fog === null) {
        scene.value.fog = null
      } else if (config.fog.type === 'linear') {
        scene.value.fog = new THREE.Fog(
          config.fog.color as THREE.ColorRepresentation,
          config.fog.near,
          config.fog.far
        )
      } else {
        scene.value.fog = new THREE.FogExp2(
          config.fog.color as THREE.ColorRepresentation,
          config.fog.density
        )
      }
    }
  }

  function setEditMode(mode: EditMode): void {
    editMode.value = mode
  }

  function setLoading(loading: boolean, progress: number = 0): void {
    isLoading.value = loading
    loadingProgress.value = progress
  }

  function resetScene(): void {
    objects.value.forEach(obj => removeObject(obj.id))
    objects.value = []
    selectedObject.value = null
    hoveredObject.value = null
  }

  function dispose(): void {
    resetScene()
    
    renderer.value?.dispose()
    
    scene.value = null
    camera.value = null
    renderer.value = null
  }

  return {
    // State
    scene,
    camera,
    renderer,
    selectedObject,
    hoveredObject,
    sceneConfig,
    editMode,
    objects,
    isLoading,
    loadingProgress,
    
    // Getters
    objectCount,
    selectedObjectMeta,
    isObjectSelected,
    
    // Actions
    initScene,
    selectObject,
    addObject,
    removeObject,
    updateObjectTransform,
    updateSceneConfig,
    setEditMode,
    setLoading,
    resetScene,
    dispose
  }
})

// Store 类型导出
export type ThreeStore = ReturnType<typeof useThreeStore>
```

### 5.2 UI Store

```typescript
// src/stores/uiStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Panel {
  id: string
  title: string
  visible: boolean
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarVisible = ref(true)
  const propertyPanelVisible = ref(true)
  const fullscreen = ref(false)
  const theme = ref<'light' | 'dark'>('dark')
  const panels = ref<Panel[]>([])
  const toasts = ref<Toast[]>([])
  const activeToolId = ref<string | null>(null)
  
  // Modal
  const modalVisible = ref(false)
  const modalContent = ref<{
    title: string
    component: string
    props?: Record<string, unknown>
  } | null>(null)

  // Getters
  const visiblePanels = computed(() => panels.value.filter(p => p.visible))
  const hasToasts = computed(() => toasts.value.length > 0)

  // Actions
  function toggleSidebar(): void {
    sidebarVisible.value = !sidebarVisible.value
  }

  function togglePropertyPanel(): void {
    propertyPanelVisible.value = !propertyPanelVisible.value
  }

  function toggleFullscreen(): void {
    fullscreen.value = !fullscreen.value
    
    if (fullscreen.value) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  function setTheme(newTheme: 'light' | 'dark'): void {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  function addPanel(panel: Omit<Panel, 'visible'>): void {
    panels.value.push({ ...panel, visible: true })
  }

  function removePanel(id: string): void {
    const index = panels.value.findIndex(p => p.id === id)
    if (index > -1) {
      panels.value.splice(index, 1)
    }
  }

  function togglePanel(id: string): void {
    const panel = panels.value.find(p => p.id === id)
    if (panel) {
      panel.visible = !panel.visible
    }
  }

  function showToast(toast: Omit<Toast, 'id'>): string {
    const id = `toast_${Date.now()}`
    toasts.value.push({ ...toast, id })
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
    
    return id
  }

  function removeToast(id: string): void {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function openModal(content: NonNullable<typeof modalContent.value>): void {
    modalContent.value = content
    modalVisible.value = true
  }

  function closeModal(): void {
    modalVisible.value = false
    modalContent.value = null
  }

  function setActiveTool(toolId: string | null): void {
    activeToolId.value = toolId
  }

  return {
    // State
    sidebarVisible,
    propertyPanelVisible,
    fullscreen,
    theme,
    panels,
    toasts,
    activeToolId,
    modalVisible,
    modalContent,
    
    // Getters
    visiblePanels,
    hasToasts,
    
    // Actions
    toggleSidebar,
    togglePropertyPanel,
    toggleFullscreen,
    setTheme,
    addPanel,
    removePanel,
    togglePanel,
    showToast,
    removeToast,
    openModal,
    closeModal,
    setActiveTool
  }
})

export type UIStore = ReturnType<typeof useUIStore>
```

---

## 6. 工具类与类型守卫

### 6.1 类型守卫函数

```typescript
// src/utils/typeGuards.ts
import * as THREE from 'three'

// 检查是否为 Mesh
export function isMesh(object: THREE.Object3D): object is THREE.Mesh {
  return object.type === 'Mesh' || (object as THREE.Mesh).isMesh === true
}

// 检查是否为 SkinnedMesh
export function isSkinnedMesh(object: THREE.Object3D): object is THREE.SkinnedMesh {
  return object.type === 'SkinnedMesh' || (object as THREE.SkinnedMesh).isSkinnedMesh === true
}

// 检查是否为 InstancedMesh
export function isInstancedMesh(object: THREE.Object3D): object is THREE.InstancedMesh {
  return object.type === 'InstancedMesh' || (object as THREE.InstancedMesh).isInstancedMesh === true
}

// 检查是否为 Group
export function isGroup(object: THREE.Object3D): object is THREE.Group {
  return object.type === 'Group' || (object as THREE.Group).isGroup === true
}

// 检查是否为 Light
export function isLight(object: THREE.Object3D): object is THREE.Light {
  return (object as THREE.Light).isLight === true
}

// 检查是否为 Camera
export function isCamera(object: THREE.Object3D): object is THREE.Camera {
  return (object as THREE.Camera).isCamera === true
}

// 检查是否为 PerspectiveCamera
export function isPerspectiveCamera(object: THREE.Object3D): object is THREE.PerspectiveCamera {
  return (object as THREE.PerspectiveCamera).isPerspectiveCamera === true
}

// 检查是否为 OrthographicCamera
export function isOrthographicCamera(object: THREE.Object3D): object is THREE.OrthographicCamera {
  return (object as THREE.OrthographicCamera).isOrthographicCamera === true
}

// 检查材质类型
export function isMeshStandardMaterial(
  material: THREE.Material
): material is THREE.MeshStandardMaterial {
  return material.type === 'MeshStandardMaterial'
}

export function isMeshPhysicalMaterial(
  material: THREE.Material
): material is THREE.MeshPhysicalMaterial {
  return material.type === 'MeshPhysicalMaterial'
}

export function isMeshBasicMaterial(
  material: THREE.Material
): material is THREE.MeshBasicMaterial {
  return material.type === 'MeshBasicMaterial'
}

// 检查纹理类型
export function isTexture(value: unknown): value is THREE.Texture {
  return value instanceof THREE.Texture
}

export function isCubeTexture(value: unknown): value is THREE.CubeTexture {
  return value instanceof THREE.CubeTexture
}

// 检查向量类型
export function isVector3(value: unknown): value is THREE.Vector3 {
  return value instanceof THREE.Vector3
}

export function isVector2(value: unknown): value is THREE.Vector2 {
  return value instanceof THREE.Vector2
}

// 检查颜色类型
export function isColor(value: unknown): value is THREE.Color {
  return value instanceof THREE.Color
}

// 检查是否有动画
export function hasAnimations(gltf: { animations?: THREE.AnimationClip[] }): boolean {
  return Array.isArray(gltf.animations) && gltf.animations.length > 0
}
```

### 6.2 数学工具函数

```typescript
// src/utils/math.ts
import * as THREE from 'three'
import type { Vector3Tuple, Vector2Tuple } from '@/types'

// 角度转弧度
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// 弧度转角度
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

// 线性插值
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// 范围限制
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// 映射值到新范围
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// 计算两点之间的距离
export function distance(p1: Vector3Tuple, p2: Vector3Tuple): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const dz = p2[2] - p1[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// 计算两个 2D 点之间的距离
export function distance2D(p1: Vector2Tuple, p2: Vector2Tuple): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// 向量归一化
export function normalize(v: Vector3Tuple): Vector3Tuple {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  if (len === 0) return [0, 0, 0]
  return [v[0] / len, v[1] / len, v[2] / len]
}

// 向量点积
export function dot(a: Vector3Tuple, b: Vector3Tuple): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

// 向量叉积
export function cross(a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]
}

// 球面插值
export function slerp(
  q1: THREE.Quaternion,
  q2: THREE.Quaternion,
  t: number
): THREE.Quaternion {
  const result = new THREE.Quaternion()
  result.slerpQuaternions(q1, q2, t)
  return result
}

// 计算包围盒中心
export function getBoundingBoxCenter(object: THREE.Object3D): THREE.Vector3 {
  const box = new THREE.Box3().setFromObject(object)
  return box.getCenter(new THREE.Vector3())
}

// 计算包围盒大小
export function getBoundingBoxSize(object: THREE.Object3D): THREE.Vector3 {
  const box = new THREE.Box3().setFromObject(object)
  return box.getSize(new THREE.Vector3())
}

// 随机范围值
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

// 随机向量
export function randomVector3(min: number = -1, max: number = 1): Vector3Tuple {
  return [
    randomRange(min, max),
    randomRange(min, max),
    randomRange(min, max)
  ]
}

// 平滑阻尼
export function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  maxSpeed: number = Infinity,
  deltaTime: number
): number {
  smoothTime = Math.max(0.0001, smoothTime)
  const omega = 2 / smoothTime
  const x = omega * deltaTime
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  
  let change = current - target
  const maxChange = maxSpeed * smoothTime
  change = clamp(change, -maxChange, maxChange)
  
  const temp = (velocity.value + omega * change) * deltaTime
  velocity.value = (velocity.value - omega * temp) * exp
  
  let output = target + (change + temp) * exp
  
  if ((target - current > 0) === (output > target)) {
    output = target
    velocity.value = (output - target) / deltaTime
  }
  
  return output
}
```

### 6.3 Three.js 工具函数

```typescript
// src/utils/threeHelpers.ts
import * as THREE from 'three'
import { isMesh } from './typeGuards'

// 遍历并处理所有 Mesh
export function traverseMeshes(
  object: THREE.Object3D,
  callback: (mesh: THREE.Mesh) => void
): void {
  object.traverse((child) => {
    if (isMesh(child)) {
      callback(child)
    }
  })
}

// 设置所有 Mesh 的阴影
export function setAllShadows(
  object: THREE.Object3D,
  castShadow: boolean = true,
  receiveShadow: boolean = true
): void {
  traverseMeshes(object, (mesh) => {
    mesh.castShadow = castShadow
    mesh.receiveShadow = receiveShadow
  })
}

// 设置所有材质的属性
export function setAllMaterialsProperty<K extends keyof THREE.MeshStandardMaterial>(
  object: THREE.Object3D,
  property: K,
  value: THREE.MeshStandardMaterial[K]
): void {
  traverseMeshes(object, (mesh) => {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => {
        if (property in mat) {
          (mat as THREE.MeshStandardMaterial)[property] = value
        }
      })
    } else if (property in mesh.material) {
      (mesh.material as THREE.MeshStandardMaterial)[property] = value
    }
  })
}

// 克隆对象并保持材质独立
export function cloneWithIndependentMaterials(object: THREE.Object3D): THREE.Object3D {
  const clone = object.clone()
  
  traverseMeshes(clone, (mesh) => {
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(m => m.clone())
    } else {
      mesh.material = mesh.material.clone()
    }
  })
  
  return clone
}

// 释放对象资源
export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (isMesh(child)) {
      child.geometry?.dispose()
      
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          disposeMaterial(material)
        })
      } else {
        disposeMaterial(child.material)
      }
    }
  })
}

// 释放材质资源
export function disposeMaterial(material: THREE.Material): void {
  material.dispose()
  
  // 释放材质中的纹理
  const materialWithMaps = material as THREE.MeshStandardMaterial
  
  const textureProps: (keyof THREE.MeshStandardMaterial)[] = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
    'envMap',
    'alphaMap',
    'bumpMap',
    'displacementMap'
  ]
  
  textureProps.forEach((prop) => {
    const texture = materialWithMaps[prop]
    if (texture instanceof THREE.Texture) {
      texture.dispose()
    }
  })
}

// 创建轮廓高亮效果
export function createOutlineEffect(
  mesh: THREE.Mesh,
  color: THREE.ColorRepresentation = 0xffff00,
  thickness: number = 0.03
): THREE.Mesh {
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color,
    side: THREE.BackSide
  })
  
  const outlineMesh = new THREE.Mesh(mesh.geometry.clone(), outlineMaterial)
  outlineMesh.scale.multiplyScalar(1 + thickness)
  
  return outlineMesh
}

// 截图功能
export function takeScreenshot(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  filename: string = 'screenshot.png',
  width?: number,
  height?: number
): void {
  const originalSize = new THREE.Vector2()
  renderer.getSize(originalSize)
  
  if (width && height) {
    renderer.setSize(width, height)
    
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }
  
  renderer.render(scene, camera)
  
  const link = document.createElement('a')
  link.download = filename
  link.href = renderer.domElement.toDataURL('image/png')
  link.click()
  
  if (width && height) {
    renderer.setSize(originalSize.x, originalSize.y)
    
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = originalSize.x / originalSize.y
      camera.updateProjectionMatrix()
    }
  }
}

// 创建调试辅助器
export function createDebugHelpers(scene: THREE.Scene): {
  axesHelper: THREE.AxesHelper
  gridHelper: THREE.GridHelper
  dispose: () => void
} {
  const axesHelper = new THREE.AxesHelper(5)
  const gridHelper = new THREE.GridHelper(10, 10)
  
  scene.add(axesHelper)
  scene.add(gridHelper)
  
  return {
    axesHelper,
    gridHelper,
    dispose: () => {
      scene.remove(axesHelper)
      scene.remove(gridHelper)
      axesHelper.dispose()
      gridHelper.dispose()
    }
  }
}
```

---

## 7. 企业级架构模式

### 7.1 Engine 类

```typescript
// src/three/core/Engine.ts
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import type { 
  RendererConfig, 
  CameraConfig, 
  UpdateEvent, 
  ResizeEvent 
} from '@/types'

export interface EngineOptions extends RendererConfig {
  camera?: CameraConfig
  debug?: boolean
}

export interface EngineEventMap {
  update: UpdateEvent
  resize: ResizeEvent
  dispose: void
}

type EventCallback<K extends keyof EngineEventMap> = (event: EngineEventMap[K]) => void

export class Engine {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  public renderer: THREE.WebGLRenderer
  public clock: THREE.Clock
  public stats: Stats | null = null
  
  private container: HTMLElement
  private options: Required<EngineOptions>
  private isRunning: boolean = false
  private animationId: number | null = null
  private eventListeners: Map<keyof EngineEventMap, Set<EventCallback<any>>> = new Map()

  constructor(container: HTMLElement, options: EngineOptions = {}) {
    this.container = container
    this.options = this.mergeOptions(options)
    this.clock = new THREE.Clock()
    
    this.scene = this.createScene()
    this.camera = this.createCamera()
    this.renderer = this.createRenderer()
    
    if (this.options.debug) {
      this.stats = new Stats()
      container.appendChild(this.stats.dom)
    }
    
    container.appendChild(this.renderer.domElement)
    
    window.addEventListener('resize', this.handleResize)
  }

  private mergeOptions(options: EngineOptions): Required<EngineOptions> {
    return {
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? false,
      powerPreference: options.powerPreference ?? 'high-performance',
      precision: options.precision ?? 'highp',
      shadows: options.shadows ?? true,
      toneMapping: options.toneMapping ?? THREE.ACESFilmicToneMapping,
      toneMappingExposure: options.toneMappingExposure ?? 1,
      outputEncoding: options.outputEncoding ?? THREE.sRGBEncoding,
      pixelRatio: options.pixelRatio ?? Math.min(window.devicePixelRatio, 2),
      camera: {
        type: options.camera?.type ?? 'perspective',
        fov: options.camera?.fov ?? 75,
        aspect: options.camera?.aspect ?? this.getAspect(),
        near: options.camera?.near ?? 0.1,
        far: options.camera?.far ?? 1000,
        position: options.camera?.position ?? [0, 5, 10],
        lookAt: options.camera?.lookAt ?? [0, 0, 0]
      },
      debug: options.debug ?? false
    }
  }

  private createScene(): THREE.Scene {
    const scene = new THREE.Scene()
    return scene
  }

  private createCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
    const { camera: config } = this.options
    
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    
    if (config.type === 'orthographic') {
      const aspect = this.getAspect()
      const frustumSize = 10
      camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        config.near,
        config.far
      )
    } else {
      camera = new THREE.PerspectiveCamera(
        config.fov,
        config.aspect,
        config.near,
        config.far
      )
    }
    
    camera.position.set(...config.position!)
    camera.lookAt(...config.lookAt!)
    
    return camera
  }

  private createRenderer(): THREE.WebGLRenderer {
    const { antialias, alpha, powerPreference, precision } = this.options
    
    const renderer = new THREE.WebGLRenderer({
      antialias,
      alpha,
      powerPreference,
      precision
    })
    
    renderer.setSize(this.getWidth(), this.getHeight())
    renderer.setPixelRatio(this.options.pixelRatio)
    renderer.toneMapping = this.options.toneMapping
    renderer.toneMappingExposure = this.options.toneMappingExposure
    renderer.outputEncoding = this.options.outputEncoding
    
    if (this.options.shadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    
    return renderer
  }

  private getWidth(): number {
    return this.container.clientWidth
  }

  private getHeight(): number {
    return this.container.clientHeight
  }

  private getAspect(): number {
    return this.getWidth() / this.getHeight()
  }

  private handleResize = (): void => {
    const width = this.getWidth()
    const height = this.getHeight()
    const aspect = width / height
    
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = aspect
      this.camera.updateProjectionMatrix()
    } else {
      const frustumSize = 10
      this.camera.left = -frustumSize * aspect / 2
      this.camera.right = frustumSize * aspect / 2
      this.camera.updateProjectionMatrix()
    }
    
    this.renderer.setSize(width, height)
    
    this.emit('resize', { width, height, aspect })
  }

  private animate = (): void => {
    if (!this.isRunning) return
    
    this.animationId = requestAnimationFrame(this.animate)
    
    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()
    
    this.emit('update', { delta, elapsed })
    
    this.renderer.render(this.scene, this.camera)
    
    this.stats?.update()
  }

  // 事件系统
  public on<K extends keyof EngineEventMap>(
    event: K,
    callback: EventCallback<K>
  ): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
    
    return () => this.off(event, callback)
  }

  public off<K extends keyof EngineEventMap>(
    event: K,
    callback: EventCallback<K>
  ): void {
    this.eventListeners.get(event)?.delete(callback)
  }

  private emit<K extends keyof EngineEventMap>(
    event: K,
    data: EngineEventMap[K]
  ): void {
    this.eventListeners.get(event)?.forEach(callback => callback(data))
  }

  // 公共方法
  public start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.clock.start()
    this.animate()
  }

  public stop(): void {
    this.isRunning = false
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.clock.stop()
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  public getInfo(): THREE.WebGLInfo {
    return this.renderer.info
  }

  public dispose(): void {
    this.stop()
    
    window.removeEventListener('resize', this.handleResize)
    
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material?.dispose()
        }
      }
    })
    
    this.renderer.dispose()
    
    if (this.stats?.dom.parentNode) {
      this.stats.dom.parentNode.removeChild(this.stats.dom)
    }
    
    this.emit('dispose', undefined)
    this.eventListeners.clear()
  }
}
```

---

## 8. 性能优化与类型安全

### 8.1 对象池实现

```typescript
// src/utils/ObjectPool.ts
export interface PoolableObject {
  reset(): void
  dispose?(): void
}

export class ObjectPool<T extends PoolableObject> {
  private pool: T[] = []
  private createFn: () => T
  private maxSize: number
  private activeCount: number = 0

  constructor(
    createFn: () => T,
    initialSize: number = 10,
    maxSize: number = 100
  ) {
    this.createFn = createFn
    this.maxSize = maxSize
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn())
    }
  }

  public acquire(): T {
    let object: T
    
    if (this.pool.length > 0) {
      object = this.pool.pop()!
    } else if (this.activeCount < this.maxSize) {
      object = this.createFn()
    } else {
      throw new Error('Object pool exhausted')
    }
    
    this.activeCount++
    return object
  }

  public release(object: T): void {
    object.reset()
    this.pool.push(object)
    this.activeCount--
  }

  public getActiveCount(): number {
    return this.activeCount
  }

  public getPoolSize(): number {
    return this.pool.length
  }

  public dispose(): void {
    this.pool.forEach(obj => obj.dispose?.())
    this.pool = []
    this.activeCount = 0
  }
}
```

---

## 9. 实战案例

### 9.1 产品配置器

```vue
<!-- src/views/ProductConfigurator.vue -->
<template>
  <div class="configurator">
    <div ref="containerRef" class="canvas-container"></div>
    
    <!-- 配置面板 -->
    <div class="config-panel">
      <h2>产品配置</h2>
      
      <!-- 颜色选择 -->
      <div class="config-section">
        <h3>颜色</h3>
        <div class="color-options">
          <div
            v-for="color in colors"
            :key="color.name"
            class="color-option"
            :class="{ active: selectedColor === color.value }"
            :style="{ backgroundColor: color.value }"
            @click="setColor(color.value)"
          >
            <span class="tooltip">{{ color.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 材质选择 -->
      <div class="config-section">
        <h3>材质</h3>
        <select v-model="selectedMaterial" @change="setMaterial">
          <option v-for="mat in materials" :key="mat.value" :value="mat.value">
            {{ mat.name }}
          </option>
        </select>
      </div>
      
      <!-- 附件选择 -->
      <div class="config-section">
        <h3>附件</h3>
        <label v-for="accessory in accessories" :key="accessory.id" class="checkbox-label">
          <input
            type="checkbox"
            :checked="selectedAccessories.includes(accessory.id)"
            @change="toggleAccessory(accessory.id)"
          />
          {{ accessory.name }}
        </label>
      </div>
      
      <!-- 价格 -->
      <div class="price-section">
        <span class="price-label">总价：</span>
        <span class="price-value">¥{{ totalPrice.toLocaleString() }}</span>
      </div>
      
      <button class="order-button" @click="placeOrder">立即下单</button>
    </div>
    
    <!-- 加载遮罩 -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <p>加载中... {{ Math.round(loadingProgress) }}%</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useLoader } from '@/hooks/useLoader'
import { useAnimation } from '@/hooks/useAnimation'
import gsap from 'gsap'
import type { GLTFResult } from '@/types'

// 类型定义
interface ColorOption {
  name: string
  value: string
}

interface MaterialOption {
  name: string
  value: string
  roughness: number
  metalness: number
}

interface Accessory {
  id: string
  name: string
  price: number
  modelUrl: string
}

// 配置数据
const colors: ColorOption[] = [
  { name: '星空黑', value: '#1a1a1a' },
  { name: '珍珠白', value: '#f5f5f5' },
  { name: '宝石蓝', value: '#1e90ff' },
  { name: '玫瑰金', value: '#b76e79' }
]

const materials: MaterialOption[] = [
  { name: '哑光', value: 'matte', roughness: 0.9, metalness: 0.1 },
  { name: '光泽', value: 'glossy', roughness: 0.3, metalness: 0.5 },
  { name: '金属', value: 'metallic', roughness: 0.2, metalness: 0.9 }
]

const accessories: Accessory[] = [
  { id: 'strap', name: '皮革表带', price: 299, modelUrl: '/models/strap.glb' },
  { id: 'case', name: '保护壳', price: 199, modelUrl: '/models/case.glb' },
  { id: 'charger', name: '无线充电器', price: 399, modelUrl: '/models/charger.glb' }
]

const basePrice = 2999

// 响应式状态
const containerRef = ref<HTMLElement | null>(null)
const selectedColor = ref(colors[0].value)
const selectedMaterial = ref(materials[0].value)
const selectedAccessories = ref<string[]>([])

const { isLoading, progress: loadingProgress, loadModel, loadHDRI } = useLoader()
const { init: initAnimation, play: playAnimation, update: updateAnimation } = useAnimation()

// 计算总价
const totalPrice = computed(() => {
  const accessoryPrice = selectedAccessories.value.reduce((sum, id) => {
    const accessory = accessories.find(a => a.id === id)
    return sum + (accessory?.price || 0)
  }, 0)
  return basePrice + accessoryPrice
})

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let productModel: THREE.Group | null = null
let animationId: number
const clock = new THREE.Clock()

// 初始化场景
async function initScene(): Promise<void> {
  const container = containerRef.value!
  const { width, height } = container.getBoundingClientRect()

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.enablePan = false

  // 加载环境贴图
  const envMap = await loadHDRI('/hdri/studio.hdr', renderer)
  scene.environment = envMap

  // 加载产品模型
  await loadProductModel()
}

async function loadProductModel(): Promise<void> {
  const gltf = await loadModel('/models/watch.glb', {
    castShadow: true,
    receiveShadow: true
  })

  productModel = gltf.scene
  
  // 居中模型
  const box = new THREE.Box3().setFromObject(productModel)
  const center = box.getCenter(new THREE.Vector3())
  productModel.position.sub(center)

  // 初始化动画
  if (gltf.animations.length > 0) {
    initAnimation(productModel, gltf.animations)
  }

  scene.add(productModel)
  
  // 应用初始配置
  setColor(selectedColor.value)
  setMaterial()
}

// 设置颜色
function setColor(color: string): void {
  selectedColor.value = color
  
  if (!productModel) return
  
  productModel.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name.includes('body')) {
      gsap.to(child.material.color, {
        r: new THREE.Color(color).r,
        g: new THREE.Color(color).g,
        b: new THREE.Color(color).b,
        duration: 0.5
      })
    }
  })
}

// 设置材质
function setMaterial(): void {
  if (!productModel) return
  
  const materialConfig = materials.find(m => m.value === selectedMaterial.value)
  if (!materialConfig) return
  
  productModel.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      gsap.to(child.material, {
        roughness: materialConfig.roughness,
        metalness: materialConfig.metalness,
        duration: 0.5
      })
    }
  })
}

// 切换附件
function toggleAccessory(id: string): void {
  const index = selectedAccessories.value.indexOf(id)
  if (index === -1) {
    selectedAccessories.value.push(id)
    // 加载并显示附件模型
  } else {
    selectedAccessories.value.splice(index, 1)
    // 隐藏附件模型
  }
}

// 下单
function placeOrder(): void {
  const order = {
    color: selectedColor.value,
    material: selectedMaterial.value,
    accessories: selectedAccessories.value,
    totalPrice: totalPrice.value
  }
  console.log('Order placed:', order)
  // 调用下单API
}

// 渲染循环
function animate(): void {
  animationId = requestAnimationFrame(animate)
  
  const delta = clock.getDelta()
  controls.update()
  updateAnimation(delta)
  
  renderer.render(scene, camera)
}

// 窗口调整
function onResize(): void {
  const container = containerRef.value
  if (!container) return
  
  const { width, height } = container.getBoundingClientRect()
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(async () => {
  await initScene()
  animate()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  renderer.dispose()
  controls.dispose()
})
</script>

<style scoped lang="scss">
.configurator {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.canvas-container {
  flex: 1;
}

.config-panel {
  width: 320px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: white;
  overflow-y: auto;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 30px;
    font-weight: 300;
  }

  h3 {
    font-size: 0.9rem;
    margin-bottom: 15px;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.config-section {
  margin-bottom: 30px;
}

.color-options {
  display: flex;
  gap: 10px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    border-color: white;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  .tooltip {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .tooltip {
    opacity: 1;
  }
}

select {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  option {
    background: #1a1a2e;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input {
    width: 18px;
    height: 18px;
  }
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 30px;
}

.price-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.price-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90d9;
}

.order-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #4a90d9 0%, #357abd 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(74, 144, 217, 0.3);
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 46, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #4a90d9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

## 10. 最佳实践总结

### 10.1 类型安全检查清单

```typescript
// 1. 始终为 Props 定义接口
interface ComponentProps {
  position: Vector3Tuple
  color: ColorRepresentation
}

// 2. 使用 shallowRef 存储 Three.js 对象
const mesh = shallowRef<THREE.Mesh | null>(null)

// 3. 使用类型守卫进行安全检查
if (isMesh(object)) {
  object.material.color.set(color)
}

// 4. 为事件定义类型
const emit = defineEmits<{
  loaded: [model: THREE.Group]
  error: [error: Error]
}>()

// 5. 使用泛型创建可复用的工具
function createObject<T extends THREE.Object3D>(
  factory: () => T
): T {
  return factory()
}
```

### 10.2 性能优化要点

1. **使用 shallowRef** - 避免 Three.js 对象的深层响应式
2. **对象池** - 复用频繁创建/销毁的对象
3. **InstancedMesh** - 渲染大量相同几何体
4. **LOD** - 根据距离切换模型细节
5. **按需渲染** - 无变化时跳过渲染
6. **资源缓存** - 避免重复加载

### 10.3 代码组织原则

1. **类型定义集中管理** - 放在 `types/` 目录
2. **Hook 单一职责** - 每个 Hook 专注一个功能
3. **组件解耦** - 通过 provide/inject 共享状态
4. **Store 模块化** - 按功能拆分 Store

---

以上是 Three.js + Vue3 + TypeScript 在大厂企业级项目中的完整实战详解，涵盖了类型系统设计、组件开发模式、状态管理以及实际案例。
