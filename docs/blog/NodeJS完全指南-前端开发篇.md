# Node.js 完全指南 - 前端开发篇
<div class="doc-toc">
## 目录

1. [前端开发中的 Node.js 概述](#1-前端开发中的-nodejs-概述)
2. [NPM 包管理器](#2-npm-包管理器)
3. [package.json 配置详解](#3-packagejson-配置详解)
4. [Webpack 构建工具](#4-webpack-构建工具)
5. [Vite 现代构建工具](#5-vite-现代构建工具)
6. [Babel 转译器](#6-babel-转译器)
7. [ESLint 代码检查](#7-eslint-代码检查)
8. [Prettier 代码格式化](#8-prettier-代码格式化)
9. [TypeScript 配置](#9-typescript-配置)
10. [PostCSS 与 CSS 处理](#10-postcss-与-css-处理)
11. [前端测试工具](#11-前端测试工具)
12. [开发服务器](#12-开发服务器)
13. [前端脚手架 CLI](#13-前端脚手架-cli)
14. [Monorepo 管理](#14-monorepo-管理)
15. [前端环境变量](#15-前端环境变量)
16. [代码质量工具链](#16-代码质量工具链)
17. [Git Hooks 自动化](#17-git-hooks-自动化)
18. [静态资源处理](#18-静态资源处理)
19. [前端监控与日志](#19-前端监控与日志)
20. [前端 CI/CD](#20-前端-cicd)


</div>

---

## 1. 前端开发中的 Node.js 概述

### 1.1 Node.js 在前端的作用

```
前端开发中 Node.js 的核心作用：

1. 包管理 (npm/yarn/pnpm)
   - 依赖管理
   - 版本控制
   - 脚本执行

2. 构建工具
   - Webpack/Vite/Rollup
   - 代码打包
   - 资源优化

3. 开发服务器
   - 热模块替换 (HMR)
   - 代理请求
   - Mock 数据

4. 代码转换
   - Babel 转译
   - TypeScript 编译
   - PostCSS 处理

5. 代码质量
   - ESLint 检查
   - Prettier 格式化
   - 单元测试

6. 工程化
   - 脚手架工具
   - 自动化脚本
   - CI/CD 集成
```

### 1.2 前端项目初始化

```bash
# 创建项目目录
mkdir my-frontend-project
cd my-frontend-project

# 初始化 npm 项目
npm init -y

# 或使用特定包管理器
yarn init -y
pnpm init

# 使用脚手架创建项目
npx create-react-app my-app
npx create-vite my-app
npx @vue/cli create my-app
npx create-next-app my-app
```

### 1.3 Node.js 版本管理

```bash
# 使用 nvm (Node Version Manager)
# 安装指定版本
nvm install 18.17.0
nvm install 20.10.0

# 切换版本
nvm use 18.17.0

# 设置默认版本
nvm alias default 18.17.0

# 查看已安装版本
nvm list

# 项目级版本锁定 (.nvmrc 文件)
echo "18.17.0" > .nvmrc
nvm use  # 自动使用 .nvmrc 中的版本

# 使用 Volta (另一种版本管理器)
volta install node@18.17.0
volta pin node@18.17.0  # 固定项目版本
```

---

## 2. NPM 包管理器

### 2.1 包安装与管理

```bash
# 安装依赖
npm install lodash              # 生产依赖
npm install -D webpack          # 开发依赖
npm install -g typescript       # 全局安装

# 简写形式
npm i lodash
npm i -D webpack
npm i -g typescript

# 安装特定版本
npm install lodash@4.17.21
npm install lodash@^4.0.0       # 兼容版本
npm install lodash@~4.17.0      # 补丁版本

# 从 package.json 安装
npm install                     # 所有依赖
npm install --production        # 仅生产依赖

# 更新依赖
npm update                      # 更新所有
npm update lodash               # 更新特定包
npm outdated                    # 查看过期依赖

# 卸载依赖
npm uninstall lodash
npm uninstall -D webpack
npm uninstall -g typescript

# 查看已安装包
npm list                        # 当前项目
npm list -g                     # 全局
npm list --depth=0              # 仅顶层
```

### 2.2 NPM 脚本

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "test": "jest",
        "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
        "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
        "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,scss}",
        "type-check": "tsc --noEmit",
        "prepare": "husky install",
        "precommit": "lint-staged",
        "prebuild": "npm run lint && npm run type-check",
        "postbuild": "node scripts/post-build.js"
    }
}
```

```bash
# 运行脚本
npm run dev
npm run build

# 特殊脚本（无需 run）
npm start           # 等同于 npm run start
npm test            # 等同于 npm run test

# 传递参数
npm run dev -- --port 3001
npm run build -- --mode production

# 顺序执行多个脚本
npm run lint && npm run test

# 并行执行（使用 npm-run-all）
npm-run-all --parallel lint test
```

### 2.3 NPM 配置

```bash
# 查看配置
npm config list
npm config get registry

# 设置镜像源
npm config set registry https://registry.npmmirror.com

# 使用 .npmrc 文件（项目级）
# .npmrc
registry=https://registry.npmmirror.com
save-exact=true
engine-strict=true

# 认证配置
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

# 查看包信息
npm info lodash
npm view lodash versions        # 所有版本
npm view lodash version         # 最新版本
```

### 2.4 Yarn 包管理器

```bash
# 安装
npm install -g yarn

# 基本命令
yarn                            # 安装依赖
yarn add lodash                 # 添加依赖
yarn add -D webpack             # 开发依赖
yarn global add typescript      # 全局安装

yarn remove lodash              # 移除依赖
yarn upgrade                    # 升级依赖
yarn upgrade-interactive        # 交互式升级

# 运行脚本
yarn dev
yarn build

# Yarn 2+ (Berry)
yarn set version berry
yarn dlx create-react-app my-app  # 等同于 npx
```

### 2.5 PNPM 包管理器

```bash
# 安装
npm install -g pnpm

# 基本命令
pnpm install                    # 安装依赖
pnpm add lodash                 # 添加依赖
pnpm add -D webpack             # 开发依赖
pnpm add -g typescript          # 全局安装

pnpm remove lodash              # 移除依赖
pnpm update                     # 升级依赖

# 运行脚本
pnpm dev
pnpm build

# 工作区命令（Monorepo）
pnpm -r run build               # 所有包执行 build
pnpm --filter=package-a build   # 特定包执行

# pnpm 优势
# 1. 节省磁盘空间（硬链接）
# 2. 更快的安装速度
# 3. 严格的依赖管理
```

---

## 3. package.json 配置详解

### 3.1 基础配置

```json
{
    "name": "my-frontend-app",
    "version": "1.0.0",
    "description": "A frontend application",
    "keywords": ["react", "frontend", "typescript"],
    "homepage": "https://github.com/user/repo#readme",
    "bugs": {
        "url": "https://github.com/user/repo/issues"
    },
    "license": "MIT",
    "author": {
        "name": "Your Name",
        "email": "email@example.com",
        "url": "https://yoursite.com"
    },
    "contributors": [
        {
            "name": "Contributor Name",
            "email": "contributor@example.com"
        }
    ],
    "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
    },
    "private": true
}
```

### 3.2 入口与类型配置

```json
{
    "main": "dist/index.js",
    "module": "dist/index.esm.js",
    "types": "dist/index.d.ts",
    "typings": "dist/index.d.ts",
    "type": "module",
    
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.esm.js",
            "require": "./dist/index.cjs.js"
        },
        "./utils": {
            "types": "./dist/utils.d.ts",
            "import": "./dist/utils.esm.js",
            "require": "./dist/utils.cjs.js"
        }
    },
    
    "files": [
        "dist",
        "src",
        "README.md"
    ],
    
    "sideEffects": [
        "*.css",
        "*.scss"
    ]
}
```

### 3.3 依赖配置

```json
{
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "axios": "^1.6.0"
    },
    
    "devDependencies": {
        "typescript": "^5.0.0",
        "webpack": "^5.89.0",
        "@types/react": "^18.2.0",
        "jest": "^29.0.0"
    },
    
    "peerDependencies": {
        "react": ">=17.0.0"
    },
    
    "peerDependenciesMeta": {
        "react": {
            "optional": false
        }
    },
    
    "optionalDependencies": {
        "fsevents": "^2.3.0"
    },
    
    "bundledDependencies": [
        "package-a",
        "package-b"
    ],
    
    "overrides": {
        "lodash": "4.17.21",
        "foo": {
            "bar": "1.0.0"
        }
    }
}
```

### 3.4 版本号规范

```json
{
    "dependencies": {
        "exact": "1.2.3",
        "patch": "~1.2.3",
        "minor": "^1.2.3",
        "major": "1.x",
        "any": "*",
        "range": ">=1.0.0 <2.0.0",
        "git": "git+https://github.com/user/repo.git",
        "branch": "git+https://github.com/user/repo.git#branch-name",
        "tag": "git+https://github.com/user/repo.git#v1.0.0",
        "local": "file:../local-package",
        "url": "https://example.com/package.tar.gz"
    }
}
```

### 3.5 脚本与钩子

```json
{
    "scripts": {
        "preinstall": "node scripts/check-node-version.js",
        "postinstall": "husky install",
        
        "predev": "npm run clean",
        "dev": "vite",
        "postdev": "echo 'Dev server stopped'",
        
        "prebuild": "npm run lint && npm run test",
        "build": "vite build",
        "postbuild": "node scripts/analyze-bundle.js",
        
        "pretest": "npm run lint",
        "test": "jest",
        "posttest": "npm run coverage",
        
        "prepublishOnly": "npm run build",
        "preversion": "npm run test",
        "version": "npm run build && git add -A",
        "postversion": "git push && git push --tags",
        
        "clean": "rimraf dist",
        "prepare": "husky install"
    }
}
```

### 3.6 引擎与环境

```json
{
    "engines": {
        "node": ">=18.0.0",
        "npm": ">=9.0.0"
    },
    
    "engineStrict": true,
    
    "os": ["darwin", "linux"],
    
    "cpu": ["x64", "arm64"],
    
    "browserslist": [
        "> 1%",
        "last 2 versions",
        "not dead",
        "not ie 11"
    ],
    
    "volta": {
        "node": "18.17.0",
        "npm": "9.6.7"
    }
}
```

### 3.7 工具配置

```json
{
    "eslintConfig": {
        "extends": [
            "react-app",
            "react-app/jest"
        ]
    },
    
    "prettier": {
        "semi": true,
        "singleQuote": true,
        "tabWidth": 2
    },
    
    "jest": {
        "testEnvironment": "jsdom",
        "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"]
    },
    
    "lint-staged": {
        "*.{js,jsx,ts,tsx}": [
            "eslint --fix",
            "prettier --write"
        ],
        "*.{css,scss}": [
            "prettier --write"
        ]
    },
    
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged",
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    }
}
```

---

## 4. Webpack 构建工具

### 4.1 基础配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 入口
    entry: {
        main: './src/index.js',
        vendor: './src/vendor.js'
    },
    
    // 输出
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        publicPath: '/',
        clean: true
    },
    
    // 模式
    mode: process.env.NODE_ENV || 'development',
    
    // 开发工具
    devtool: process.env.NODE_ENV === 'production' 
        ? 'source-map' 
        : 'eval-cheap-module-source-map',
    
    // 解析
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@styles': path.resolve(__dirname, 'src/styles')
        },
        modules: ['node_modules', path.resolve(__dirname, 'src')]
    },
    
    // 模块规则
    module: {
        rules: [
            // JavaScript/TypeScript
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            
            // CSS
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                auto: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader'
                ]
            },
            
            // SCSS
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            
            // 图片
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 10KB
                    }
                },
                generator: {
                    filename: 'images/[name].[hash:8][ext]'
                }
            },
            
            // 字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash:8][ext]'
                }
            }
        ]
    },
    
    // 插件
    plugins: [
        new CleanWebpackPlugin(),
        
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: process.env.NODE_ENV === 'production' ? {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            } : false
        }),
        
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[contenthash].chunk.css'
        })
    ]
};
```

### 4.2 开发服务器配置

```javascript
// webpack.config.js
module.exports = {
    // ...其他配置
    
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        port: 3000,
        host: '0.0.0.0',
        open: true,
        hot: true,
        historyApiFallback: true,
        compress: true,
        
        // 代理配置
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
                secure: false
            },
            '/ws': {
                target: 'ws://localhost:8080',
                ws: true
            }
        },
        
        // 响应头
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        
        // 中间件
        setupMiddlewares: (middlewares, devServer) => {
            // 添加自定义中间件
            devServer.app.get('/custom', (req, res) => {
                res.json({ custom: true });
            });
            return middlewares;
        },
        
        // 错误覆盖层
        client: {
            overlay: {
                errors: true,
                warnings: false
            },
            progress: true
        }
    }
};
```

### 4.3 优化配置

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    // ...其他配置
    
    optimization: {
        // 代码分割
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                    chunks: 'all',
                    priority: 20
                },
                common: {
                    minChunks: 2,
                    name: 'common',
                    chunks: 'all',
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        },
        
        // 运行时代码分离
        runtimeChunk: {
            name: 'runtime'
        },
        
        // 模块 ID
        moduleIds: 'deterministic',
        
        // 压缩
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    },
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ]
    },
    
    // 性能
    performance: {
        hints: 'warning',
        maxEntrypointSize: 250000,
        maxAssetSize: 250000
    },
    
    // 额外插件
    plugins: [
        // 打包分析
        process.env.ANALYZE && new BundleAnalyzerPlugin(),
        
        // Gzip 压缩
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ].filter(Boolean)
};
```

### 4.4 多环境配置

```javascript
// webpack.common.js - 公共配置
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
};

// webpack.dev.js - 开发配置
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 3000,
        hot: true
    }
});

// webpack.prod.js - 生产配置
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: '[name].[contenthash].js'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
});
```

```json
// package.json
{
    "scripts": {
        "dev": "webpack serve --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js",
        "build:analyze": "ANALYZE=true webpack --config webpack.prod.js"
    }
}
```

---

## 5. Vite 现代构建工具

### 5.1 基础配置

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    // 插件
    plugins: [
        react(),
        // 或 vue()
    ],
    
    // 根目录
    root: process.cwd(),
    
    // 基础路径
    base: '/',
    
    // 公共目录
    publicDir: 'public',
    
    // 解析
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@styles': path.resolve(__dirname, 'src/styles')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    
    // CSS
    css: {
        modules: {
            localsConvention: 'camelCase',
            scopeBehaviour: 'local'
        },
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@styles/variables.scss";`
            },
            less: {
                modifyVars: {
                    'primary-color': '#1890ff'
                },
                javascriptEnabled: true
            }
        },
        postcss: {
            plugins: [
                require('autoprefixer'),
                require('tailwindcss')
            ]
        }
    },
    
    // JSON
    json: {
        namedExports: true,
        stringify: false
    },
    
    // ESBuild
    esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        drop: ['console', 'debugger']
    }
});
```

### 5.2 开发服务器配置

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: false,
        open: true,
        https: false,
        
        // 代理
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('Proxying:', req.url);
                    });
                }
            },
            '/socket.io': {
                target: 'ws://localhost:8080',
                ws: true
            }
        },
        
        // CORS
        cors: true,
        
        // 响应头
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        
        // HMR
        hmr: {
            overlay: true,
            port: 24678
        },
        
        // 文件监听
        watch: {
            usePolling: false,
            ignored: ['**/node_modules/**', '**/.git/**']
        },
        
        // 预热文件
        warmup: {
            clientFiles: ['./src/components/*.tsx']
        }
    }
});
```

### 5.3 构建配置

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    build: {
        target: 'es2015',
        outDir: 'dist',
        assetsDir: 'assets',
        assetsInlineLimit: 4096,
        
        // CSS
        cssCodeSplit: true,
        cssMinify: true,
        
        // Source Map
        sourcemap: true,
        
        // 压缩
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        
        // Rollup 配置
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                nested: path.resolve(__dirname, 'nested/index.html')
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    lodash: ['lodash'],
                    utils: ['axios', 'dayjs']
                },
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'css/[name]-[hash][extname]';
                    }
                    if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
                        return 'images/[name]-[hash][extname]';
                    }
                    if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
                        return 'fonts/[name]-[hash][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                }
            },
            external: ['jquery'],
            plugins: []
        },
        
        // 分块大小警告
        chunkSizeWarningLimit: 500,
        
        // 清空输出目录
        emptyOutDir: true,
        
        // 生成 manifest
        manifest: true,
        
        // SSR
        ssr: false
    },
    
    plugins: [
        // 打包分析
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true
        }),
        
        // Gzip 压缩
        viteCompression({
            algorithm: 'gzip',
            threshold: 10240
        })
    ]
});
```

### 5.4 环境变量

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
            __API_URL__: JSON.stringify(env.VITE_API_URL)
        },
        
        // 根据命令区分配置
        server: command === 'serve' ? {
            port: 3000
        } : undefined,
        
        build: command === 'build' ? {
            sourcemap: mode !== 'production'
        } : undefined
    };
});
```

```bash
# .env
VITE_APP_TITLE=My App

# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.example.com

# .env.staging
VITE_API_URL=https://staging-api.example.com
```

```javascript
// 在代码中使用
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.MODE);
console.log(import.meta.env.DEV);
console.log(import.meta.env.PROD);
```

---

## 6. Babel 转译器

### 6.1 基础配置

```javascript
// babel.config.js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not dead']
                },
                useBuiltIns: 'usage',
                corejs: 3,
                modules: false
            }
        ],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic'
            }
        ],
        '@babel/preset-typescript'
    ],
    
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css'
            }
        ]
    ],
    
    env: {
        development: {
            plugins: ['react-refresh/babel']
        },
        production: {
            plugins: [
                'transform-remove-console',
                'transform-remove-debugger'
            ]
        },
        test: {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }]
            ]
        }
    }
};
```

### 6.2 .babelrc 配置

```json
{
    "presets": [
        ["@babel/preset-env", {
            "targets": "> 0.25%, not dead",
            "useBuiltIns": "entry",
            "corejs": "3.27"
        }],
        ["@babel/preset-react", {
            "runtime": "automatic"
        }],
        "@babel/preset-typescript"
    ],
    "plugins": [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        "@babel/plugin-proposal-class-properties"
    ],
    "ignore": [
        "node_modules"
    ]
}
```

### 6.3 Polyfill 配置

```javascript
// babel.config.js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // entry: 在入口文件手动引入 polyfill
                // usage: 按需自动引入 polyfill
                // false: 不引入 polyfill
                useBuiltIns: 'usage',
                corejs: {
                    version: '3.27',
                    proposals: true
                },
                // 不转换 ES Module 语法
                modules: false,
                // 调试：显示使用了哪些插件
                debug: false
            }
        ]
    ]
};

// 入口文件（当 useBuiltIns: 'entry' 时）
// index.js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### 6.4 自定义 Babel 插件

```javascript
// babel-plugin-custom.js
module.exports = function({ types: t }) {
    return {
        name: 'custom-transform',
        visitor: {
            // 将 console.log 替换为 logger.log
            CallExpression(path) {
                if (
                    t.isMemberExpression(path.node.callee) &&
                    t.isIdentifier(path.node.callee.object, { name: 'console' }) &&
                    t.isIdentifier(path.node.callee.property, { name: 'log' })
                ) {
                    path.node.callee.object.name = 'logger';
                }
            },
            
            // 添加版本号注释
            Program(path) {
                path.addComment('leading', ' Build version: 1.0.0 ');
            }
        }
    };
};

// 使用
// babel.config.js
module.exports = {
    plugins: [
        './babel-plugin-custom.js'
    ]
};
```

---

## 7. ESLint 代码检查

### 7.1 基础配置

```javascript
// .eslintrc.js
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
        jest: true
    },
    
    parser: '@typescript-eslint/parser',
    
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        },
        project: './tsconfig.json'
    },
    
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsx-a11y/recommended',
        'prettier'
    ],
    
    plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
        'import',
        'jsx-a11y'
    ],
    
    settings: {
        react: {
            version: 'detect'
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    
    rules: {
        // React
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // TypeScript
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        
        // Import
        'import/order': ['error', {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index'
            ],
            'newlines-between': 'always',
            alphabetize: {
                order: 'asc',
                caseInsensitive: true
            }
        }],
        'import/no-unresolved': 'error',
        'import/no-cycle': 'error',
        
        // 通用
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'no-multiple-empty-lines': ['error', { max: 1 }]
    },
    
    overrides: [
        {
            files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
            env: {
                jest: true
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        }
    ],
    
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'build/',
        '*.config.js'
    ]
};
```

### 7.2 Vue 项目配置

```javascript
// .eslintrc.js
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true
    },
    
    parser: 'vue-eslint-parser',
    
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    
    plugins: [
        'vue',
        '@typescript-eslint'
    ],
    
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'warn',
        'vue/require-default-prop': 'off',
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'never',
                component: 'always'
            }
        }]
    }
};
```

### 7.3 ESLint 脚本

```json
// package.json
{
    "scripts": {
        "lint": "eslint . --ext .js,.jsx,.ts,.tsx,.vue",
        "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx,.vue --fix",
        "lint:report": "eslint . --ext .js,.jsx,.ts,.tsx --format html -o eslint-report.html"
    }
}
```

```bash
# 命令行使用
npx eslint src --ext .js,.jsx,.ts,.tsx
npx eslint src --fix
npx eslint src --format stylish
npx eslint src --quiet  # 只报告错误，不报告警告
```

---

## 8. Prettier 代码格式化

### 8.1 配置文件

```javascript
// .prettierrc.js
module.exports = {
    // 行宽
    printWidth: 100,
    
    // 缩进
    tabWidth: 2,
    useTabs: false,
    
    // 分号
    semi: true,
    
    // 引号
    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    
    // 尾逗号
    trailingComma: 'es5',
    
    // 括号空格
    bracketSpacing: true,
    bracketSameLine: false,
    
    // 箭头函数括号
    arrowParens: 'avoid',
    
    // HTML 空格敏感度
    htmlWhitespaceSensitivity: 'css',
    
    // Vue 单文件组件缩进
    vueIndentScriptAndStyle: false,
    
    // 行尾
    endOfLine: 'lf',
    
    // 嵌入式语言格式化
    embeddedLanguageFormatting: 'auto',
    
    // 单属性换行
    singleAttributePerLine: false
};
```

### 8.2 忽略文件

```
# .prettierignore
# 构建输出
dist/
build/
coverage/

# 依赖
node_modules/

# 锁文件
package-lock.json
yarn.lock
pnpm-lock.yaml

# 其他
*.min.js
*.min.css
.gitignore
.eslintignore
```

### 8.3 与 ESLint 集成

```bash
# 安装
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

```javascript
// .eslintrc.js
module.exports = {
    extends: [
        // ... 其他配置
        'prettier'  // 放在最后，关闭与 Prettier 冲突的规则
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error'
    }
};
```

### 8.4 使用脚本

```json
// package.json
{
    "scripts": {
        "format": "prettier --write .",
        "format:check": "prettier --check .",
        "format:staged": "prettier --write --staged"
    }
}
```

---

## 9. TypeScript 配置

### 9.1 基础配置

```json
// tsconfig.json
{
    "compilerOptions": {
        // 目标
        "target": "ES2020",
        "lib": ["DOM", "DOM.Iterable", "ESNext"],
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
        "useUnknownInCatchVariables": true,
        "alwaysStrict": true,
        
        // 模块
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        
        // 输出
        "noEmit": true,
        "declaration": false,
        "declarationMap": false,
        "sourceMap": true,
        
        // JSX
        "jsx": "react-jsx",
        
        // 路径
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@components/*": ["src/components/*"],
            "@utils/*": ["src/utils/*"],
            "@hooks/*": ["src/hooks/*"],
            "@types/*": ["src/types/*"]
        },
        
        // 类型
        "types": ["vite/client", "jest", "node"],
        "typeRoots": ["./node_modules/@types", "./src/types"],
        
        // 其他
        "skipLibCheck": true,
        "allowJs": true,
        "checkJs": false,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "allowImportingTsExtensions": true
    },
    
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.d.ts"
    ],
    
    "exclude": [
        "node_modules",
        "dist",
        "build"
    ],
    
    "references": [
        { "path": "./tsconfig.node.json" }
    ]
}
```

### 9.2 Node.js 配置

```json
// tsconfig.node.json
{
    "compilerOptions": {
        "composite": true,
        "skipLibCheck": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowSyntheticDefaultImports": true
    },
    "include": [
        "vite.config.ts",
        "vitest.config.ts"
    ]
}
```

### 9.3 类型声明

```typescript
// src/types/global.d.ts

// 全局类型
declare global {
    interface Window {
        __APP_VERSION__: string;
        __API_URL__: string;
    }
}

// 模块声明
declare module '*.svg' {
    import React from 'react';
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.json' {
    const value: any;
    export default value;
}

// Vite 环境变量
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_API_URL: string;
    readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export {};
```

### 9.4 项目类型定义

```typescript
// src/types/api.d.ts

// API 响应类型
interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

interface PaginatedResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 用户类型
interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user' | 'guest';
    createdAt: string;
    updatedAt: string;
}

// 表单类型
interface LoginForm {
    username: string;
    password: string;
    remember?: boolean;
}

// 泛型工具类型
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type {
    ApiResponse,
    PaginatedResponse,
    User,
    LoginForm,
    Nullable,
    Optional,
    DeepPartial
};
```

---

## 10. PostCSS 与 CSS 处理

### 10.1 PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
    plugins: {
        // 导入
        'postcss-import': {},
        
        // 嵌套
        'postcss-nested': {},
        
        // CSS 变量
        'postcss-custom-properties': {
            preserve: false
        },
        
        // Tailwind CSS
        'tailwindcss': {},
        
        // 自动前缀
        'autoprefixer': {
            overrideBrowserslist: [
                '> 1%',
                'last 2 versions',
                'not dead'
            ]
        },
        
        // CSS Nano（生产环境压缩）
        'cssnano': process.env.NODE_ENV === 'production' ? {
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }]
        } : false,
        
        // px 转 rem
        'postcss-pxtorem': {
            rootValue: 16,
            propList: ['*'],
            selectorBlackList: ['html', 'body']
        }
    }
};
```

### 10.2 Tailwind CSS 配置

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,vue}'
    ],
    
    darkMode: 'class',
    
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1'
                },
                secondary: '#6366f1'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace']
            },
            spacing: {
                '128': '32rem',
                '144': '36rem'
            },
            borderRadius: {
                '4xl': '2rem'
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'bounce-slow': 'bounce 3s infinite'
            }
        },
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px'
        }
    },
    
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/container-queries')
    ]
};
```

### 10.3 CSS Modules

```css
/* Button.module.css */
.button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.primary {
    composes: button;
    background-color: #0ea5e9;
    color: white;
}

.secondary {
    composes: button;
    background-color: #6366f1;
    color: white;
}

.button:hover {
    opacity: 0.9;
}

/* 全局样式 */
:global(.container) {
    max-width: 1200px;
    margin: 0 auto;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
    return (
        <button className={styles[variant]}>
            {children}
        </button>
    );
};
```

### 10.4 Sass/SCSS 配置

```scss
// styles/variables.scss
$primary-color: #0ea5e9;
$secondary-color: #6366f1;
$text-color: #333;
$background-color: #f5f5f5;

$breakpoints: (
    sm: 640px,
    md: 768px,
    lg: 1024px,
    xl: 1280px
);

// Mixin
@mixin respond-to($breakpoint) {
    @if map-has-key($breakpoints, $breakpoint) {
        @media (min-width: map-get($breakpoints, $breakpoint)) {
            @content;
        }
    }
}

@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

// 使用
.container {
    @include flex-center;
    
    @include respond-to(md) {
        padding: 20px;
    }
}
```

---

## 11. 前端测试工具

### 11.1 Jest 配置

```javascript
// jest.config.js
module.exports = {
    // 测试环境
    testEnvironment: 'jsdom',
    
    // 根目录
    rootDir: '.',
    
    // 测试文件匹配
    testMatch: [
        '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}'
    ],
    
    // 模块路径映射
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    
    // 转换
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }],
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    
    // 忽略转换
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],
    
    // 设置文件
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.ts'
    ],
    
    // 覆盖率
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/index.tsx',
        '!src/reportWebVitals.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    
    // 超时
    testTimeout: 10000,
    
    // 详细输出
    verbose: true
};
```

### 11.2 测试示例

```typescript
// src/utils/math.test.ts
import { add, subtract, multiply, divide } from './math';

describe('Math Utils', () => {
    describe('add', () => {
        it('should add two positive numbers', () => {
            expect(add(1, 2)).toBe(3);
        });
        
        it('should add negative numbers', () => {
            expect(add(-1, -2)).toBe(-3);
        });
    });
    
    describe('divide', () => {
        it('should divide two numbers', () => {
            expect(divide(6, 2)).toBe(3);
        });
        
        it('should throw error when dividing by zero', () => {
            expect(() => divide(1, 0)).toThrow('Cannot divide by zero');
        });
    });
});

// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
    it('should render correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    
    it('should call onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        
        fireEvent.click(screen.getByText('Click me'));
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByText('Click me')).toBeDisabled();
    });
});

// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
    it('should initialize with default value', () => {
        const { result } = renderHook(() => useCounter());
        expect(result.current.count).toBe(0);
    });
    
    it('should initialize with custom value', () => {
        const { result } = renderHook(() => useCounter(10));
        expect(result.current.count).toBe(10);
    });
    
    it('should increment count', () => {
        const { result } = renderHook(() => useCounter());
        
        act(() => {
            result.current.increment();
        });
        
        expect(result.current.count).toBe(1);
    });
});
```

### 11.3 Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.ts'],
        
        include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
        exclude: ['node_modules', 'dist'],
        
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/setupTests.ts'
            ]
        },
        
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});
```

### 11.4 E2E 测试 (Playwright)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] }
        }
    ],
    
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI
    }
});
```

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });
    
    test('should display login form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: '登录' })).toBeVisible();
        await expect(page.getByLabel('用户名')).toBeVisible();
        await expect(page.getByLabel('密码')).toBeVisible();
        await expect(page.getByRole('button', { name: '登录' })).toBeVisible();
    });
    
    test('should login successfully', async ({ page }) => {
        await page.getByLabel('用户名').fill('admin');
        await page.getByLabel('密码').fill('password');
        await page.getByRole('button', { name: '登录' }).click();
        
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByText('欢迎回来')).toBeVisible();
    });
    
    test('should show error for invalid credentials', async ({ page }) => {
        await page.getByLabel('用户名').fill('wrong');
        await page.getByLabel('密码').fill('wrong');
        await page.getByRole('button', { name: '登录' }).click();
        
        await expect(page.getByText('用户名或密码错误')).toBeVisible();
    });
});
```

---

## 12. 开发服务器

### 12.1 Express 开发服务器

```javascript
// server/dev-server.js
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(compression());
app.use(express.json());

// 静态文件
app.use(express.static(path.join(__dirname, '../dist')));

// API 代理
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq: (proxyReq, req) => {
        console.log(`[Proxy] ${req.method} ${req.url}`);
    }
}));

// Mock API
app.get('/mock/users', (req, res) => {
    res.json([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ]);
});

// SPA 回退
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
```

### 12.2 Mock 数据服务

```javascript
// server/mock/index.js
const express = require('express');
const router = express.Router();

// 模拟数据
const users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
];

// RESTful API
router.get('/users', (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    
    res.json({
        code: 0,
        data: {
            list: users.slice(start, end),
            total: users.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        }
    });
});

router.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json({ code: 0, data: user });
    } else {
        res.status(404).json({ code: 404, message: 'User not found' });
    }
});

router.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    users.push(newUser);
    res.json({ code: 0, data: newUser });
});

router.put('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        res.json({ code: 0, data: users[index] });
    } else {
        res.status(404).json({ code: 404, message: 'User not found' });
    }
});

router.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        users.splice(index, 1);
        res.json({ code: 0, message: 'Deleted' });
    } else {
        res.status(404).json({ code: 404, message: 'User not found' });
    }
});

// 模拟延迟
router.use((req, res, next) => {
    setTimeout(next, Math.random() * 500);
});

module.exports = router;
```

### 12.3 使用 MSW (Mock Service Worker)

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' }
            ])
        );
    }),
    
    rest.post('/api/login', async (req, res, ctx) => {
        const { username, password } = await req.json();
        
        if (username === 'admin' && password === 'password') {
            return res(
                ctx.status(200),
                ctx.json({
                    token: 'fake-jwt-token',
                    user: { id: 1, name: 'Admin' }
                })
            );
        }
        
        return res(
            ctx.status(401),
            ctx.json({ message: 'Invalid credentials' })
        );
    })
];

// src/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// src/main.tsx
if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
}
```

---

## 13. 前端脚手架 CLI

### 13.1 创建 CLI 工具

```javascript
#!/usr/bin/env node
// bin/cli.js
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

program
    .name('my-cli')
    .description('前端项目脚手架工具')
    .version('1.0.0');

// create 命令
program
    .command('create <project-name>')
    .description('创建新项目')
    .option('-t, --template <template>', '项目模板', 'react')
    .option('--typescript', '使用 TypeScript', false)
    .action(async (projectName, options) => {
        console.log(chalk.blue(`Creating project: ${projectName}`));
        
        // 交互式询问
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: '选择项目模板:',
                choices: ['react', 'vue', 'vanilla'],
                default: options.template
            },
            {
                type: 'confirm',
                name: 'typescript',
                message: '是否使用 TypeScript?',
                default: options.typescript
            },
            {
                type: 'checkbox',
                name: 'features',
                message: '选择需要的功能:',
                choices: [
                    { name: 'ESLint', value: 'eslint', checked: true },
                    { name: 'Prettier', value: 'prettier', checked: true },
                    { name: 'Husky', value: 'husky' },
                    { name: 'Jest', value: 'jest' }
                ]
            }
        ]);
        
        const spinner = ora('创建项目中...').start();
        
        try {
            // 创建目录
            const projectPath = path.join(process.cwd(), projectName);
            await fs.ensureDir(projectPath);
            
            // 复制模板
            const templatePath = path.join(__dirname, '../templates', answers.template);
            await fs.copy(templatePath, projectPath);
            
            // 修改 package.json
            const pkgPath = path.join(projectPath, 'package.json');
            const pkg = await fs.readJson(pkgPath);
            pkg.name = projectName;
            await fs.writeJson(pkgPath, pkg, { spaces: 2 });
            
            // 安装依赖
            spinner.text = '安装依赖中...';
            execSync('npm install', { cwd: projectPath, stdio: 'ignore' });
            
            spinner.succeed(chalk.green('项目创建成功!'));
            
            console.log('\n下一步:');
            console.log(chalk.cyan(`  cd ${projectName}`));
            console.log(chalk.cyan('  npm run dev'));
            
        } catch (error) {
            spinner.fail(chalk.red('创建失败'));
            console.error(error);
        }
    });

// add 命令
program
    .command('add <plugin>')
    .description('添加插件')
    .action(async (plugin) => {
        const spinner = ora(`Adding ${plugin}...`).start();
        
        try {
            switch (plugin) {
                case 'eslint':
                    execSync('npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin');
                    // 创建配置文件
                    break;
                case 'prettier':
                    execSync('npm install -D prettier');
                    break;
                default:
                    throw new Error(`Unknown plugin: ${plugin}`);
            }
            
            spinner.succeed(`Added ${plugin}`);
        } catch (error) {
            spinner.fail(`Failed to add ${plugin}`);
            console.error(error);
        }
    });

program.parse();
```

### 13.2 package.json 配置

```json
{
    "name": "my-cli",
    "version": "1.0.0",
    "description": "前端项目脚手架工具",
    "bin": {
        "my-cli": "./bin/cli.js"
    },
    "files": [
        "bin",
        "templates"
    ],
    "dependencies": {
        "chalk": "^4.1.2",
        "commander": "^11.0.0",
        "fs-extra": "^11.1.0",
        "inquirer": "^8.2.0",
        "ora": "^5.4.1"
    }
}
```

---

## 14. Monorepo 管理

### 14.1 PNPM Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'
```

```json
// package.json (根目录)
{
    "name": "my-monorepo",
    "private": true,
    "scripts": {
        "dev": "pnpm -r run dev",
        "build": "pnpm -r run build",
        "test": "pnpm -r run test",
        "lint": "pnpm -r run lint",
        "clean": "pnpm -r run clean"
    },
    "devDependencies": {
        "typescript": "^5.0.0"
    }
}
```

```json
// packages/shared/package.json
{
    "name": "@myorg/shared",
    "version": "1.0.0",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
        "build": "tsc",
        "dev": "tsc --watch"
    }
}

// apps/web/package.json
{
    "name": "@myorg/web",
    "version": "1.0.0",
    "dependencies": {
        "@myorg/shared": "workspace:*"
    }
}
```

### 14.2 Turborepo 配置

```json
// turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", ".next/**"]
        },
        "test": {
            "dependsOn": ["build"],
            "outputs": ["coverage/**"]
        },
        "lint": {},
        "dev": {
            "cache": false,
            "persistent": true
        }
    },
    "globalDependencies": [
        ".env"
    ]
}
```

```bash
# 运行命令
npx turbo run build
npx turbo run dev --filter=@myorg/web
npx turbo run test --filter=@myorg/shared...
```

### 14.3 Nx 配置

```json
// nx.json
{
    "npmScope": "myorg",
    "affected": {
        "defaultBase": "main"
    },
    "targetDefaults": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["{projectRoot}/dist"]
        },
        "test": {
            "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"]
        }
    },
    "namedInputs": {
        "default": ["{projectRoot}/**/*", "sharedGlobals"],
        "production": ["default", "!{projectRoot}/**/*.spec.tsx"],
        "sharedGlobals": []
    }
}
```

---

## 15. 前端环境变量

### 15.1 dotenv 配置

```javascript
// config/env.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
function loadEnv(mode) {
    const basePath = path.resolve(process.cwd(), '.env');
    const envPath = `${basePath}.${mode}`;
    const localPath = `${envPath}.local`;
    
    const envFiles = [
        basePath,                    // .env
        `${basePath}.local`,         // .env.local
        envPath,                     // .env.development
        localPath                    // .env.development.local
    ];
    
    envFiles.forEach(file => {
        if (fs.existsSync(file)) {
            dotenv.config({ path: file });
        }
    });
    
    // 过滤前端可用的环境变量
    const filtered = {};
    for (const key of Object.keys(process.env)) {
        if (key.startsWith('VITE_') || key.startsWith('REACT_APP_')) {
            filtered[key] = process.env[key];
        }
    }
    
    return filtered;
}

module.exports = { loadEnv };
```

### 15.2 环境变量文件

```bash
# .env - 所有环境共享
VITE_APP_NAME=My App

# .env.local - 本地环境，不提交到 git
VITE_API_SECRET=local-secret

# .env.development - 开发环境
VITE_API_URL=http://localhost:8080
VITE_DEBUG=true

# .env.production - 生产环境
VITE_API_URL=https://api.example.com
VITE_DEBUG=false

# .env.staging - 预发布环境
VITE_API_URL=https://staging-api.example.com
VITE_DEBUG=true
```

### 15.3 在代码中使用

```typescript
// config/index.ts
interface AppConfig {
    appName: string;
    apiUrl: string;
    debug: boolean;
    version: string;
}

export const config: AppConfig = {
    appName: import.meta.env.VITE_APP_NAME || 'App',
    apiUrl: import.meta.env.VITE_API_URL || '',
    debug: import.meta.env.VITE_DEBUG === 'true',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

// 运行时检查
if (!config.apiUrl) {
    console.warn('API URL is not configured');
}

export default config;
```

---

## 16. 代码质量工具链

### 16.1 完整工具链配置

```json
// package.json
{
    "scripts": {
        "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
        "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
        "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,scss,json,md}\"",
        "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,scss,json,md}\"",
        "type-check": "tsc --noEmit",
        "stylelint": "stylelint \"src/**/*.{css,scss}\"",
        "stylelint:fix": "stylelint \"src/**/*.{css,scss}\" --fix",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "check-all": "npm run type-check && npm run lint && npm run format:check && npm run test"
    },
    "lint-staged": {
        "*.{js,jsx,ts,tsx}": [
            "eslint --fix",
            "prettier --write"
        ],
        "*.{css,scss}": [
            "stylelint --fix",
            "prettier --write"
        ],
        "*.{json,md}": [
            "prettier --write"
        ]
    }
}
```

### 16.2 Stylelint 配置

```javascript
// .stylelintrc.js
module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-prettier'
    ],
    plugins: [
        'stylelint-order'
    ],
    rules: {
        'order/properties-alphabetical-order': true,
        'selector-class-pattern': null,
        'no-descending-specificity': null,
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen']
            }
        ]
    },
    ignoreFiles: [
        'node_modules/**',
        'dist/**'
    ]
};
```

### 16.3 EditorConfig

```
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

---

## 17. Git Hooks 自动化

### 17.1 Husky 配置

```bash
# 安装
npm install -D husky
npx husky install

# 添加 hook
npx husky add .husky/pre-commit "npm run lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

### 17.2 Commitlint 配置

```javascript
// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // 新功能
                'fix',      // 修复
                'docs',     // 文档
                'style',    // 格式
                'refactor', // 重构
                'perf',     // 性能
                'test',     // 测试
                'build',    // 构建
                'ci',       // CI
                'chore',    // 其他
                'revert'    // 回滚
            ]
        ],
        'subject-case': [0],
        'subject-max-length': [2, 'always', 100]
    }
};
```

### 17.3 Lint-staged 配置

```javascript
// lint-staged.config.js
module.exports = {
    '*.{js,jsx,ts,tsx}': [
        'eslint --fix',
        'prettier --write',
        'jest --bail --findRelatedTests'
    ],
    '*.{css,scss}': [
        'stylelint --fix',
        'prettier --write'
    ],
    '*.{json,md,yml,yaml}': [
        'prettier --write'
    ]
};
```

---

## 18. 静态资源处理

### 18.1 图片优化

```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default {
    plugins: [
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false
            },
            optipng: {
                optimizationLevel: 7
            },
            mozjpeg: {
                quality: 80
            },
            pngquant: {
                quality: [0.8, 0.9],
                speed: 4
            },
            svgo: {
                plugins: [
                    { name: 'removeViewBox' },
                    { name: 'removeEmptyAttrs', active: false }
                ]
            },
            webp: {
                quality: 80
            }
        })
    ]
};
```

### 18.2 SVG 组件化

```typescript
// vite.config.ts
import svgr from 'vite-plugin-svgr';

export default {
    plugins: [
        svgr({
            svgrOptions: {
                icon: true,
                ref: true
            }
        })
    ]
};

// 使用
import { ReactComponent as Logo } from './logo.svg';
import logoUrl from './logo.svg?url';

function App() {
    return (
        <div>
            <Logo width={100} height={100} />
            <img src={logoUrl} alt="Logo" />
        </div>
    );
}
```

### 18.3 字体处理

```css
/* src/styles/fonts.css */
@font-face {
    font-family: 'CustomFont';
    src: url('/fonts/custom.woff2') format('woff2'),
         url('/fonts/custom.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
```

```javascript
// 预加载字体
// index.html
<link 
    rel="preload" 
    href="/fonts/custom.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
/>
```

---

## 19. 前端监控与日志

### 19.1 错误监控

```typescript
// src/utils/errorHandler.ts
interface ErrorInfo {
    message: string;
    stack?: string;
    componentStack?: string;
    url: string;
    timestamp: number;
}

class ErrorMonitor {
    private errors: ErrorInfo[] = [];
    
    init() {
        // 全局错误捕获
        window.onerror = (message, source, lineno, colno, error) => {
            this.report({
                message: message as string,
                stack: error?.stack,
                url: window.location.href,
                timestamp: Date.now()
            });
        };
        
        // Promise 错误
        window.onunhandledrejection = (event) => {
            this.report({
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                url: window.location.href,
                timestamp: Date.now()
            });
        };
        
        // 资源加载错误
        window.addEventListener('error', (event) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'IMG' || target.tagName === 'SCRIPT') {
                this.report({
                    message: `Resource load error: ${(target as HTMLImageElement).src}`,
                    url: window.location.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }
    
    report(error: ErrorInfo) {
        this.errors.push(error);
        
        // 发送到服务器
        fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }).catch(console.error);
    }
}

export const errorMonitor = new ErrorMonitor();
```

### 19.2 性能监控

```typescript
// src/utils/performance.ts
interface PerformanceMetrics {
    FCP: number;  // First Contentful Paint
    LCP: number;  // Largest Contentful Paint
    FID: number;  // First Input Delay
    CLS: number;  // Cumulative Layout Shift
    TTFB: number; // Time to First Byte
}

class PerformanceMonitor {
    private metrics: Partial<PerformanceMetrics> = {};
    
    init() {
        // 使用 web-vitals 库
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS((metric) => this.metrics.CLS = metric.value);
            getFID((metric) => this.metrics.FID = metric.value);
            getFCP((metric) => this.metrics.FCP = metric.value);
            getLCP((metric) => this.metrics.LCP = metric.value);
            getTTFB((metric) => this.metrics.TTFB = metric.value);
        });
        
        // 页面加载完成后上报
        window.addEventListener('load', () => {
            setTimeout(() => this.report(), 3000);
        });
    }
    
    report() {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const data = {
            ...this.metrics,
            pageLoad: navigation?.loadEventEnd - navigation?.fetchStart,
            domReady: navigation?.domContentLoadedEventEnd - navigation?.fetchStart,
            url: window.location.href,
            timestamp: Date.now()
        };
        
        // 使用 sendBeacon 确保数据发送
        navigator.sendBeacon('/api/performance', JSON.stringify(data));
    }
}

export const performanceMonitor = new PerformanceMonitor();
```

### 19.3 日志系统

```typescript
// src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: any;
    timestamp: number;
}

class Logger {
    private buffer: LogEntry[] = [];
    private readonly maxBufferSize = 100;
    
    private log(level: LogLevel, message: string, data?: any) {
        const entry: LogEntry = {
            level,
            message,
            data,
            timestamp: Date.now()
        };
        
        // 控制台输出
        const consoleFn = console[level] || console.log;
        consoleFn(`[${level.toUpperCase()}]`, message, data || '');
        
        // 缓存日志
        this.buffer.push(entry);
        if (this.buffer.length > this.maxBufferSize) {
            this.flush();
        }
    }
    
    debug(message: string, data?: any) {
        if (import.meta.env.DEV) {
            this.log('debug', message, data);
        }
    }
    
    info(message: string, data?: any) {
        this.log('info', message, data);
    }
    
    warn(message: string, data?: any) {
        this.log('warn', message, data);
    }
    
    error(message: string, data?: any) {
        this.log('error', message, data);
    }
    
    flush() {
        if (this.buffer.length === 0) return;
        
        // 发送到服务器
        navigator.sendBeacon('/api/logs', JSON.stringify(this.buffer));
        this.buffer = [];
    }
}

export const logger = new Logger();

// 页面卸载时发送剩余日志
window.addEventListener('beforeunload', () => {
    logger.flush();
});
```

---

## 20. 前端 CI/CD

### 20.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist
      - name: Deploy to server
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_KEY }}
          source: "dist/*"
          target: "/var/www/app"
```

### 20.2 GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - install
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .pnpm-store/

install:
  stage: install
  image: node:${NODE_VERSION}
  script:
    - npm install -g pnpm
    - pnpm config set store-dir .pnpm-store
    - pnpm install
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

lint:
  stage: lint
  image: node:${NODE_VERSION}
  needs: [install]
  script:
    - npm install -g pnpm
    - pnpm run lint

test:
  stage: test
  image: node:${NODE_VERSION}
  needs: [install]
  script:
    - npm install -g pnpm
    - pnpm run test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  needs: [lint, test]
  script:
    - npm install -g pnpm
    - pnpm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_staging:
  stage: deploy
  needs: [build]
  script:
    - rsync -avz dist/ user@staging.example.com:/var/www/app/
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  needs: [build]
  script:
    - rsync -avz dist/ user@example.com:/var/www/app/
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

### 20.3 Docker 部署

```dockerfile
# Dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建
RUN pnpm run build

# 生产阶段
FROM nginx:alpine

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

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

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    image: backend-image
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_HOST=database
    networks:
      - app-network

  database:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
```

---

## 附录：常用依赖速查表

### 构建工具

| 包名 | 用途 |
|------|------|
| `webpack` | 模块打包器 |
| `vite` | 现代构建工具 |
| `rollup` | ES 模块打包器 |
| `esbuild` | 极速打包器 |
| `parcel` | 零配置打包器 |

### 代码质量

| 包名 | 用途 |
|------|------|
| `eslint` | 代码检查 |
| `prettier` | 代码格式化 |
| `stylelint` | CSS 检查 |
| `typescript` | 类型检查 |
| `husky` | Git Hooks |
| `lint-staged` | 暂存文件检查 |
| `commitlint` | 提交信息检查 |

### 测试工具

| 包名 | 用途 |
|------|------|
| `jest` | 单元测试 |
| `vitest` | Vite 测试框架 |
| `@testing-library/react` | React 组件测试 |
| `playwright` | E2E 测试 |
| `cypress` | E2E 测试 |

### CSS 处理

| 包名 | 用途 |
|------|------|
| `postcss` | CSS 转换 |
| `autoprefixer` | 自动前缀 |
| `tailwindcss` | 原子 CSS |
| `sass` | SCSS 编译 |
| `less` | Less 编译 |

---

**文档版本**: 1.0  
**适用版本**: Node.js 18.x+, Vite 5.x, Webpack 5.x  
**最后更新**: 2026年2月
