# Node.js 完全指南 - 基础语法篇
<div class="doc-toc">
## 目录

1. [Node.js 简介与安装](#1-nodejs-简介与安装)
2. [模块系统](#2-模块系统)
3. [全局对象与变量](#3-全局对象与变量)
4. [文件系统 (fs)](#4-文件系统-fs)
5. [路径处理 (path)](#5-路径处理-path)
6. [事件机制 (events)](#6-事件机制-events)
7. [流 (Stream)](#7-流-stream)
8. [Buffer 缓冲区](#8-buffer-缓冲区)
9. [HTTP 模块](#9-http-模块)
10. [URL 模块](#10-url-模块)
11. [Query String 模块](#11-query-string-模块)
12. [OS 模块](#12-os-模块)
13. [Process 进程](#13-process-进程)
14. [Child Process 子进程](#14-child-process-子进程)
15. [Cluster 集群](#15-cluster-集群)
16. [Worker Threads 工作线程](#16-worker-threads-工作线程)
17. [定时器](#17-定时器)
18. [Crypto 加密模块](#18-crypto-加密模块)
19. [Util 工具模块](#19-util-工具模块)
20. [Assert 断言模块](#20-assert-断言模块)


</div>

---

## 1. Node.js 简介与安装

### 1.1 什么是 Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，使 JavaScript 可以在服务器端运行。

### 1.2 核心特性

- **单线程、事件驱动**：通过事件循环处理并发
- **非阻塞 I/O**：异步操作不会阻塞主线程
- **跨平台**：支持 Windows、Linux、macOS
- **NPM 生态**：拥有世界上最大的包管理器

### 1.3 安装与版本管理

```bash
# 使用 nvm 安装（推荐）
nvm install 18.17.0
nvm use 18.17.0

# 查看版本
node -v
npm -v

# 使用 npx 执行包
npx create-react-app my-app
```

### 1.4 运行 Node.js

```bash
# 运行脚本
node app.js

# 交互式环境 REPL
node

# 执行代码字符串
node -e "console.log('Hello')"

# 查看帮助
node --help
```

---

## 2. 模块系统

### 2.1 CommonJS 模块 (CJS)

**使用场景**：传统 Node.js 项目，旧版本兼容

```javascript
// math.js - 导出模块
// 方式1：单个导出
module.exports.add = function(a, b) {
    return a + b;
};

module.exports.subtract = function(a, b) {
    return a - b;
};

// 方式2：整体导出
module.exports = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

// 方式3：exports 简写（不能直接赋值）
exports.PI = 3.14159;
exports.E = 2.71828;
```

```javascript
// app.js - 导入模块
// 导入整个模块
const math = require('./math');
console.log(math.add(1, 2)); // 3

// 解构导入
const { add, subtract } = require('./math');
console.log(add(5, 3)); // 8

// 导入核心模块
const fs = require('fs');
const path = require('path');

// 导入 node_modules 中的包
const express = require('express');
const lodash = require('lodash');

// 导入 JSON 文件
const config = require('./config.json');
console.log(config.port);
```

### 2.2 ES Modules (ESM)

**使用场景**：现代 JavaScript 项目，与浏览器模块化统一

```javascript
// package.json 中添加
{
    "type": "module"
}

// 或者使用 .mjs 扩展名
```

```javascript
// math.mjs - ESM 导出
// 命名导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 默认导出
export default class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(value) {
        this.result += value;
        return this;
    }
    
    subtract(value) {
        this.result -= value;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}

// 重命名导出
const PI = 3.14159;
export { PI as PI_VALUE };
```

```javascript
// app.mjs - ESM 导入
// 命名导入
import { add, subtract } from './math.mjs';

// 默认导入
import Calculator from './math.mjs';

// 混合导入
import Calculator, { add, subtract } from './math.mjs';

// 重命名导入
import { add as sum } from './math.mjs';

// 导入所有
import * as math from './math.mjs';
console.log(math.add(1, 2));

// 动态导入（返回 Promise）
const loadModule = async () => {
    const module = await import('./math.mjs');
    console.log(module.add(1, 2));
};

// 导入 JSON（需要断言）
import config from './config.json' assert { type: 'json' };

// 导入核心模块
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
```

### 2.3 模块缓存机制

```javascript
// 模块只会加载一次，后续 require 返回缓存
const module1 = require('./counter');
const module2 = require('./counter');
console.log(module1 === module2); // true

// 查看模块缓存
console.log(require.cache);

// 清除模块缓存（热更新场景）
delete require.cache[require.resolve('./counter')];

// 获取模块完整路径
console.log(require.resolve('./counter'));
// 输出: /path/to/counter.js
```

### 2.4 模块查找机制

```javascript
// Node.js 模块查找顺序：
// 1. 核心模块（如 fs, path, http）
// 2. 文件模块（以 ./, ../, / 开头）
// 3. node_modules 目录

// 查找过程示例
require('lodash');
// 1. 当前目录 node_modules/lodash
// 2. 上级目录 ../node_modules/lodash
// 3. 继续向上查找直到根目录
// 4. 全局 node_modules

// 模块入口查找
// 1. 查找 package.json 的 main 字段
// 2. 查找 index.js
// 3. 查找 index.json
// 4. 查找 index.node
```

### 2.5 module 对象

```javascript
// 每个模块中都有 module 对象
console.log(module);
/*
{
    id: '.',                    // 模块标识符
    path: '/path/to',           // 模块所在目录
    exports: {},                // 导出内容
    parent: null,               // 父模块
    filename: '/path/to/file.js', // 文件完整路径
    loaded: false,              // 是否加载完成
    children: [],               // 子模块列表
    paths: [...]                // 模块查找路径
}
*/

// 判断是否为主模块
if (require.main === module) {
    console.log('这是主入口文件');
    main();
}

function main() {
    console.log('程序启动');
}
```

---

## 3. 全局对象与变量

### 3.1 global 对象

```javascript
// global 是 Node.js 的全局对象
global.myGlobalVar = 'Hello';
console.log(myGlobalVar); // 'Hello'

// 常用全局对象
console.log(global.console);    // 控制台
console.log(global.process);    // 进程
console.log(global.Buffer);     // 缓冲区
console.log(global.setTimeout); // 定时器
console.log(global.setInterval);
console.log(global.setImmediate);
console.log(global.clearTimeout);
console.log(global.clearInterval);
console.log(global.clearImmediate);

// URL 和 URLSearchParams
const url = new URL('https://example.com/path?name=test');
console.log(url.hostname); // 'example.com'

// TextEncoder 和 TextDecoder
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const encoded = encoder.encode('Hello');
const decoded = decoder.decode(encoded);
```

### 3.2 模块级变量

```javascript
// __filename - 当前模块的完整文件路径
console.log(__filename);
// 输出: /home/user/project/app.js

// __dirname - 当前模块所在目录的完整路径
console.log(__dirname);
// 输出: /home/user/project

// 使用场景：构建文件路径
const path = require('path');
const configPath = path.join(__dirname, 'config', 'app.json');
console.log(configPath);
// 输出: /home/user/project/config/app.json

// 在 ESM 中获取 __dirname 和 __filename
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 3.3 console 控制台

```javascript
// 基本输出
console.log('普通日志');
console.info('信息日志');
console.warn('警告日志');
console.error('错误日志');

// 格式化输出
console.log('Name: %s, Age: %d', 'John', 30);
console.log('Object: %o', { name: 'John' });
console.log('JSON: %j', { name: 'John' });

// 分组输出
console.group('用户信息');
console.log('姓名: John');
console.log('年龄: 30');
console.groupEnd();

// 表格输出
const users = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
];
console.table(users);

// 计时
console.time('操作耗时');
// ... 执行代码
for (let i = 0; i < 1000000; i++) {}
console.timeEnd('操作耗时');
// 输出: 操作耗时: 5.123ms

// 计数
for (let i = 0; i < 5; i++) {
    console.count('循环次数');
}
// 输出: 循环次数: 1, 循环次数: 2, ...

// 断言
console.assert(1 === 2, '1 不等于 2');
// 输出: Assertion failed: 1 不等于 2

// 清空控制台
console.clear();

// 堆栈跟踪
function foo() {
    console.trace('调用栈');
}
foo();

// 目录结构输出
console.dir({ a: { b: { c: 1 } } }, { depth: null, colors: true });
```

---

## 4. 文件系统 (fs)

### 4.1 同步 API

**使用场景**：初始化配置、CLI 工具、脚本

```javascript
const fs = require('fs');

// 读取文件
const content = fs.readFileSync('./file.txt', 'utf8');
console.log(content);

// 读取为 Buffer
const buffer = fs.readFileSync('./image.png');
console.log(buffer);

// 写入文件
fs.writeFileSync('./output.txt', 'Hello World', 'utf8');

// 追加内容
fs.appendFileSync('./log.txt', '新的日志行\n');

// 检查文件是否存在
const exists = fs.existsSync('./file.txt');
console.log(exists); // true 或 false

// 获取文件状态
const stats = fs.statSync('./file.txt');
console.log(stats.isFile());       // true
console.log(stats.isDirectory());  // false
console.log(stats.size);           // 文件大小(字节)
console.log(stats.mtime);          // 修改时间

// 创建目录
fs.mkdirSync('./new-folder');
fs.mkdirSync('./a/b/c', { recursive: true }); // 递归创建

// 读取目录
const files = fs.readdirSync('./');
console.log(files); // ['file1.txt', 'file2.txt', ...]

// 读取目录详情
const filesWithTypes = fs.readdirSync('./', { withFileTypes: true });
filesWithTypes.forEach(dirent => {
    console.log(`${dirent.name}: ${dirent.isDirectory() ? '目录' : '文件'}`);
});

// 重命名/移动文件
fs.renameSync('./old.txt', './new.txt');

// 删除文件
fs.unlinkSync('./temp.txt');

// 删除目录
fs.rmdirSync('./empty-folder');
fs.rmSync('./folder', { recursive: true, force: true }); // 递归删除

// 复制文件
fs.copyFileSync('./source.txt', './dest.txt');

// 创建符号链接
fs.symlinkSync('./target', './link');

// 读取符号链接
const linkTarget = fs.readlinkSync('./link');

// 更改文件权限
fs.chmodSync('./script.sh', 0o755);

// 更改文件所有者
fs.chownSync('./file.txt', uid, gid);

// 截断文件
fs.truncateSync('./file.txt', 100); // 截断为 100 字节
```

### 4.2 异步回调 API

**使用场景**：处理大量文件、不阻塞主线程

```javascript
const fs = require('fs');

// 读取文件
fs.readFile('./file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('读取失败:', err);
        return;
    }
    console.log(data);
});

// 写入文件
fs.writeFile('./output.txt', 'Hello World', (err) => {
    if (err) {
        console.error('写入失败:', err);
        return;
    }
    console.log('写入成功');
});

// 追加内容
fs.appendFile('./log.txt', '新日志\n', (err) => {
    if (err) throw err;
    console.log('追加成功');
});

// 获取文件状态
fs.stat('./file.txt', (err, stats) => {
    if (err) throw err;
    console.log(`大小: ${stats.size} 字节`);
    console.log(`是文件: ${stats.isFile()}`);
});

// 创建目录
fs.mkdir('./new-folder', { recursive: true }, (err) => {
    if (err) throw err;
    console.log('目录创建成功');
});

// 读取目录
fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach(file => console.log(file));
});

// 重命名
fs.rename('./old.txt', './new.txt', (err) => {
    if (err) throw err;
    console.log('重命名成功');
});

// 删除文件
fs.unlink('./temp.txt', (err) => {
    if (err) throw err;
    console.log('删除成功');
});

// 复制文件
fs.copyFile('./source.txt', './dest.txt', (err) => {
    if (err) throw err;
    console.log('复制成功');
});

// 监听文件变化
fs.watch('./file.txt', (eventType, filename) => {
    console.log(`事件类型: ${eventType}`);
    console.log(`文件名: ${filename}`);
});

// 更精确的文件监听
fs.watchFile('./file.txt', { interval: 1000 }, (curr, prev) => {
    console.log(`当前修改时间: ${curr.mtime}`);
    console.log(`之前修改时间: ${prev.mtime}`);
});

// 停止监听
fs.unwatchFile('./file.txt');
```

### 4.3 Promise API (推荐)

**使用场景**：现代异步编程，配合 async/await

```javascript
const fs = require('fs/promises');
// 或者
const { promises: fs } = require('fs');

// 读取文件
async function readFileAsync() {
    try {
        const content = await fs.readFile('./file.txt', 'utf8');
        console.log(content);
    } catch (err) {
        console.error('读取失败:', err);
    }
}

// 写入文件
async function writeFileAsync() {
    await fs.writeFile('./output.txt', 'Hello World');
    console.log('写入成功');
}

// 批量文件操作
async function processMultipleFiles() {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];
    
    // 并行读取
    const contents = await Promise.all(
        files.map(file => fs.readFile(file, 'utf8'))
    );
    
    console.log(contents);
}

// 文件操作封装
async function fileOperations() {
    // 检查文件存在（使用 access）
    try {
        await fs.access('./file.txt', fs.constants.F_OK);
        console.log('文件存在');
    } catch {
        console.log('文件不存在');
    }
    
    // 获取文件信息
    const stats = await fs.stat('./file.txt');
    console.log(stats);
    
    // 创建目录
    await fs.mkdir('./new-folder', { recursive: true });
    
    // 读取目录
    const files = await fs.readdir('./');
    console.log(files);
    
    // 读取目录详情
    const dirents = await fs.readdir('./', { withFileTypes: true });
    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            console.log(`目录: ${dirent.name}`);
        } else {
            console.log(`文件: ${dirent.name}`);
        }
    }
    
    // 复制文件
    await fs.copyFile('./source.txt', './dest.txt');
    
    // 重命名
    await fs.rename('./old.txt', './new.txt');
    
    // 删除文件
    await fs.unlink('./temp.txt');
    
    // 删除目录
    await fs.rm('./folder', { recursive: true, force: true });
}

// 递归遍历目录
async function walkDir(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            await walkDir(fullPath);
        } else {
            console.log(fullPath);
        }
    }
}

// 使用 FileHandle 进行更精细的控制
async function useFileHandle() {
    let fileHandle;
    try {
        fileHandle = await fs.open('./file.txt', 'r+');
        
        // 读取
        const buffer = Buffer.alloc(1024);
        const { bytesRead } = await fileHandle.read(buffer, 0, 1024, 0);
        console.log(buffer.slice(0, bytesRead).toString());
        
        // 写入
        await fileHandle.write('新内容', 0);
        
        // 获取状态
        const stats = await fileHandle.stat();
        console.log(stats);
        
        // 同步到磁盘
        await fileHandle.sync();
        
    } finally {
        await fileHandle?.close();
    }
}
```

### 4.4 文件流操作

```javascript
const fs = require('fs');

// 创建可读流
const readStream = fs.createReadStream('./large-file.txt', {
    encoding: 'utf8',
    highWaterMark: 64 * 1024 // 64KB 缓冲区
});

readStream.on('data', (chunk) => {
    console.log(`收到 ${chunk.length} 字节`);
});

readStream.on('end', () => {
    console.log('读取完成');
});

readStream.on('error', (err) => {
    console.error('读取错误:', err);
});

// 创建可写流
const writeStream = fs.createWriteStream('./output.txt', {
    encoding: 'utf8',
    flags: 'a' // 追加模式
});

writeStream.write('第一行\n');
writeStream.write('第二行\n');
writeStream.end('最后一行\n');

writeStream.on('finish', () => {
    console.log('写入完成');
});

// 管道操作 - 复制大文件
const source = fs.createReadStream('./source.txt');
const dest = fs.createWriteStream('./dest.txt');
source.pipe(dest);

// 带错误处理的管道
const { pipeline } = require('stream');
const util = require('util');
const pipelineAsync = util.promisify(pipeline);

async function copyFile() {
    await pipelineAsync(
        fs.createReadStream('./source.txt'),
        fs.createWriteStream('./dest.txt')
    );
    console.log('复制完成');
}
```

---

## 5. 路径处理 (path)

### 5.1 路径拼接与解析

```javascript
const path = require('path');

// 路径拼接 - 自动处理分隔符
const fullPath = path.join('/home', 'user', 'documents', 'file.txt');
console.log(fullPath); // /home/user/documents/file.txt

// 处理 .. 和 .
const normalPath = path.join('/home/user', '..', 'admin', './config');
console.log(normalPath); // /home/admin/config

// 解析为绝对路径
const absolutePath = path.resolve('src', 'components', 'App.js');
console.log(absolutePath); // /当前工作目录/src/components/App.js

// 从右到左解析，遇到绝对路径停止
const resolved = path.resolve('/foo', '/bar', 'baz');
console.log(resolved); // /bar/baz

// 规范化路径
const normalized = path.normalize('/home//user/../admin/./config/');
console.log(normalized); // /home/admin/config/
```

### 5.2 路径信息提取

```javascript
const path = require('path');
const filePath = '/home/user/documents/report.pdf';

// 获取目录名
console.log(path.dirname(filePath));  // /home/user/documents

// 获取文件名
console.log(path.basename(filePath)); // report.pdf

// 获取不带扩展名的文件名
console.log(path.basename(filePath, '.pdf')); // report

// 获取扩展名
console.log(path.extname(filePath)); // .pdf

// 解析路径为对象
const parsed = path.parse(filePath);
console.log(parsed);
/*
{
    root: '/',
    dir: '/home/user/documents',
    base: 'report.pdf',
    ext: '.pdf',
    name: 'report'
}
*/

// 从对象构建路径
const formatted = path.format({
    dir: '/home/user',
    name: 'file',
    ext: '.txt'
});
console.log(formatted); // /home/user/file.txt
```

### 5.3 路径判断

```javascript
const path = require('path');

// 判断是否为绝对路径
console.log(path.isAbsolute('/home/user'));  // true
console.log(path.isAbsolute('./relative'));  // false
console.log(path.isAbsolute('C:\\Windows')); // true (Windows)

// 计算相对路径
const from = '/home/user/documents';
const to = '/home/user/images/photo.jpg';
console.log(path.relative(from, to)); // ../images/photo.jpg
```

### 5.4 平台相关

```javascript
const path = require('path');

// 路径分隔符
console.log(path.sep);       // Unix: /  Windows: \
console.log(path.delimiter); // Unix: :  Windows: ;

// 特定平台的 path
const pathPosix = path.posix;    // Unix 风格
const pathWin32 = path.win32;    // Windows 风格

// 始终使用 Unix 风格路径
const unixPath = path.posix.join('home', 'user', 'file.txt');
console.log(unixPath); // home/user/file.txt

// 使用场景：跨平台脚本
const configPath = path.join(__dirname, 'config', 'app.json');
// 在任何平台都能正确工作
```

### 5.5 常用场景示例

```javascript
const path = require('path');

// 1. 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 2. 构建配置文件路径
const configPath = path.join(projectRoot, 'config', 'database.json');

// 3. 获取上传目录
const uploadsDir = path.join(__dirname, '..', 'uploads');

// 4. 动态生成文件名
function generateFileName(originalName) {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    return `${name}-${timestamp}${ext}`;
}
console.log(generateFileName('photo.jpg')); // photo-1634567890123.jpg

// 5. 检查文件扩展名
function isImageFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

// 6. 获取模块目录中的资源
const assetsPath = path.join(__dirname, 'assets', 'images');

// 7. 将 Windows 路径转为 URL 格式
function pathToUrl(filePath) {
    return filePath.split(path.sep).join('/');
}
```

---

## 6. 事件机制 (events)

### 6.1 EventEmitter 基础

```javascript
const EventEmitter = require('events');

// 创建事件发射器
const emitter = new EventEmitter();

// 注册事件监听器
emitter.on('message', (data) => {
    console.log('收到消息:', data);
});

// 触发事件
emitter.emit('message', 'Hello World');
// 输出: 收到消息: Hello World

// 传递多个参数
emitter.on('user:login', (username, timestamp) => {
    console.log(`${username} 在 ${timestamp} 登录`);
});
emitter.emit('user:login', 'john', new Date());

// 一次性监听器
emitter.once('init', () => {
    console.log('初始化完成（只执行一次）');
});
emitter.emit('init'); // 执行
emitter.emit('init'); // 不执行
```

### 6.2 事件管理

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 移除监听器
function handler(data) {
    console.log(data);
}
emitter.on('data', handler);
emitter.off('data', handler);  // 移除特定监听器
// 或
emitter.removeListener('data', handler);

// 移除所有监听器
emitter.removeAllListeners('data');  // 移除 'data' 事件的所有监听器
emitter.removeAllListeners();         // 移除所有事件的所有监听器

// 获取监听器列表
const listeners = emitter.listeners('data');
console.log(listeners);

// 获取监听器数量
const count = emitter.listenerCount('data');
console.log(count);

// 获取所有事件名称
const eventNames = emitter.eventNames();
console.log(eventNames);

// 设置最大监听器数量（默认 10）
emitter.setMaxListeners(20);

// 在开头添加监听器
emitter.prependListener('data', (data) => {
    console.log('先执行');
});

emitter.prependOnceListener('data', (data) => {
    console.log('先执行一次');
});
```

### 6.3 继承 EventEmitter

**使用场景**：创建自定义事件驱动类

```javascript
const EventEmitter = require('events');

// 使用类继承
class UserService extends EventEmitter {
    constructor() {
        super();
        this.users = [];
    }
    
    addUser(user) {
        this.users.push(user);
        this.emit('user:added', user);
    }
    
    removeUser(userId) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            const user = this.users.splice(index, 1)[0];
            this.emit('user:removed', user);
            return user;
        }
        this.emit('error', new Error('用户不存在'));
        return null;
    }
    
    getUsers() {
        return this.users;
    }
}

// 使用
const userService = new UserService();

userService.on('user:added', (user) => {
    console.log(`新用户添加: ${user.name}`);
});

userService.on('user:removed', (user) => {
    console.log(`用户移除: ${user.name}`);
});

userService.on('error', (err) => {
    console.error('错误:', err.message);
});

userService.addUser({ id: 1, name: 'John' });
userService.addUser({ id: 2, name: 'Jane' });
userService.removeUser(1);
userService.removeUser(999); // 触发 error 事件
```

### 6.4 异步事件处理

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 异步监听器
emitter.on('data', async (data) => {
    const result = await processData(data);
    console.log(result);
});

// 使用 events.once() 等待事件
const { once } = require('events');

async function waitForEvent() {
    const emitter = new EventEmitter();
    
    // 异步触发
    setTimeout(() => {
        emitter.emit('ready', '数据准备完成');
    }, 1000);
    
    // 等待事件
    const [result] = await once(emitter, 'ready');
    console.log(result); // '数据准备完成'
}

// 可迭代的事件监听
const { on } = require('events');

async function iterateEvents() {
    const emitter = new EventEmitter();
    
    // 发送事件
    setTimeout(() => {
        emitter.emit('data', 1);
        emitter.emit('data', 2);
        emitter.emit('data', 3);
        emitter.emit('end');
    }, 100);
    
    // 迭代接收事件
    const iterator = on(emitter, 'data');
    for await (const [value] of iterator) {
        console.log(value); // 1, 2, 3
    }
}
```

### 6.5 错误处理

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 必须监听 error 事件，否则会抛出异常
emitter.on('error', (err) => {
    console.error('捕获错误:', err.message);
});

emitter.emit('error', new Error('发生错误'));

// 使用 errorMonitor 监控所有错误
emitter.on(EventEmitter.errorMonitor, (err) => {
    console.log('错误监控:', err.message);
});

// 捕获未处理的 Promise 拒绝
const { captureRejections } = require('events');

class AsyncEmitter extends EventEmitter {
    constructor() {
        super({ captureRejections: true });
    }
    
    [Symbol.for('nodejs.rejection')](err, event) {
        console.error(`事件 ${event} 中的异步错误:`, err);
    }
}
```

---

## 7. 流 (Stream)

### 7.1 流的类型

```javascript
const { Readable, Writable, Duplex, Transform, pipeline } = require('stream');
const fs = require('fs');

// 四种流类型：
// 1. Readable - 可读流（数据源）
// 2. Writable - 可写流（数据目标）
// 3. Duplex - 双向流（如 TCP Socket）
// 4. Transform - 转换流（如压缩、加密）
```

### 7.2 可读流

```javascript
const { Readable } = require('stream');

// 方式1：从数组创建
const readable = Readable.from(['Hello', ' ', 'World']);
readable.on('data', chunk => console.log(chunk));

// 方式2：自定义可读流
class Counter extends Readable {
    constructor(max) {
        super();
        this.max = max;
        this.current = 0;
    }
    
    _read() {
        if (this.current < this.max) {
            this.push(String(this.current++));
        } else {
            this.push(null); // 结束流
        }
    }
}

const counter = new Counter(5);
counter.on('data', data => console.log(data)); // 0, 1, 2, 3, 4

// 方式3：使用工厂函数
const { Readable } = require('stream');

const readable2 = new Readable({
    read() {
        this.push('数据');
        this.push(null);
    }
});

// 读取模式
// 流动模式（flowing）- 自动读取
readable.on('data', (chunk) => {
    console.log(chunk);
});

// 暂停模式（paused）- 手动读取
readable.on('readable', () => {
    let chunk;
    while ((chunk = readable.read()) !== null) {
        console.log(chunk);
    }
});

// 暂停和恢复
readable.pause();  // 暂停
readable.resume(); // 恢复

// 事件
readable.on('data', (chunk) => {});  // 数据到达
readable.on('end', () => {});        // 数据读完
readable.on('error', (err) => {});   // 发生错误
readable.on('close', () => {});      // 流关闭
```

### 7.3 可写流

```javascript
const { Writable } = require('stream');
const fs = require('fs');

// 自定义可写流
class MyWritable extends Writable {
    constructor() {
        super();
        this.data = [];
    }
    
    _write(chunk, encoding, callback) {
        this.data.push(chunk.toString());
        console.log('写入:', chunk.toString());
        callback(); // 调用 callback 表示写入完成
    }
    
    _final(callback) {
        console.log('所有数据:', this.data.join(''));
        callback();
    }
}

const writable = new MyWritable();
writable.write('Hello');
writable.write(' ');
writable.write('World');
writable.end(); // 结束写入

// 使用工厂函数
const writable2 = new Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
});

// 事件
writable.on('finish', () => console.log('写入完成'));
writable.on('error', (err) => console.error(err));
writable.on('drain', () => console.log('缓冲区已排空'));
writable.on('close', () => console.log('流关闭'));

// 背压处理
const source = fs.createReadStream('./large-file.txt');
const dest = fs.createWriteStream('./copy.txt');

source.on('data', (chunk) => {
    const canContinue = dest.write(chunk);
    if (!canContinue) {
        // 缓冲区满，暂停读取
        source.pause();
    }
});

dest.on('drain', () => {
    // 缓冲区排空，继续读取
    source.resume();
});
```

### 7.4 双向流 (Duplex)

```javascript
const { Duplex } = require('stream');

// 自定义双向流
class MyDuplex extends Duplex {
    constructor() {
        super();
        this.data = [];
    }
    
    _read(size) {
        const chunk = this.data.shift();
        if (chunk) {
            this.push(chunk);
        } else {
            this.push(null);
        }
    }
    
    _write(chunk, encoding, callback) {
        this.data.push(chunk);
        callback();
    }
}

// 使用场景：TCP Socket
const net = require('net');
const server = net.createServer((socket) => {
    // socket 是双向流
    socket.on('data', (data) => {
        socket.write(`Echo: ${data}`);
    });
});
```

### 7.5 转换流 (Transform)

```javascript
const { Transform, pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// 自定义转换流 - 大写转换
class UpperCase extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}

// 使用
const upperCase = new UpperCase();
process.stdin.pipe(upperCase).pipe(process.stdout);

// 使用工厂函数
const upperCase2 = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.toString().toUpperCase());
    }
});

// 实际示例：JSON 行转换
class JSONLineParser extends Transform {
    constructor() {
        super({ objectMode: true }); // 对象模式
        this.buffer = '';
    }
    
    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop(); // 保留不完整的行
        
        for (const line of lines) {
            if (line.trim()) {
                try {
                    this.push(JSON.parse(line));
                } catch (err) {
                    this.emit('error', err);
                }
            }
        }
        callback();
    }
    
    _flush(callback) {
        if (this.buffer.trim()) {
            try {
                this.push(JSON.parse(this.buffer));
            } catch (err) {
                this.emit('error', err);
            }
        }
        callback();
    }
}
```

### 7.6 管道操作

```javascript
const { pipeline } = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

const pipelineAsync = promisify(pipeline);

// 简单管道
const readable = fs.createReadStream('input.txt');
const writable = fs.createWriteStream('output.txt');
readable.pipe(writable);

// 链式管道
fs.createReadStream('input.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('input.txt.gz'));

// 使用 pipeline（推荐）- 自动处理错误和清理
pipeline(
    fs.createReadStream('input.txt'),
    zlib.createGzip(),
    fs.createWriteStream('input.txt.gz'),
    (err) => {
        if (err) {
            console.error('管道失败:', err);
        } else {
            console.log('管道成功');
        }
    }
);

// Promise 版本
async function compressFile(input, output) {
    await pipelineAsync(
        fs.createReadStream(input),
        zlib.createGzip(),
        fs.createWriteStream(output)
    );
    console.log('压缩完成');
}

// 复杂管道：读取 -> 加密 -> 压缩 -> 写入
async function processFile() {
    const cipher = crypto.createCipher('aes-256-cbc', 'secret-key');
    
    await pipelineAsync(
        fs.createReadStream('data.txt'),
        cipher,
        zlib.createGzip(),
        fs.createWriteStream('data.encrypted.gz')
    );
}
```

### 7.7 流的高级用法

```javascript
const { Readable, PassThrough, finished } = require('stream');
const { promisify } = require('util');

const finishedAsync = promisify(finished);

// PassThrough 流 - 不修改数据，用于监控
const passThrough = new PassThrough();
let bytesProcessed = 0;

passThrough.on('data', (chunk) => {
    bytesProcessed += chunk.length;
});

fs.createReadStream('file.txt')
    .pipe(passThrough)
    .pipe(fs.createWriteStream('copy.txt'));

passThrough.on('end', () => {
    console.log(`处理了 ${bytesProcessed} 字节`);
});

// 等待流结束
async function waitForStream(stream) {
    await finishedAsync(stream);
    console.log('流处理完成');
}

// 收集流数据
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

// 收集为字符串
async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return chunks.join('');
}

// 使用 Web Streams API（Node.js 16+）
const { ReadableStream, WritableStream, TransformStream } = require('stream/web');

const webReadable = new ReadableStream({
    start(controller) {
        controller.enqueue('Hello');
        controller.enqueue('World');
        controller.close();
    }
});
```

---

## 8. Buffer 缓冲区

### 8.1 创建 Buffer

```javascript
// 从字符串创建
const buf1 = Buffer.from('Hello World');
const buf2 = Buffer.from('你好', 'utf8');

// 从数组创建
const buf3 = Buffer.from([72, 101, 108, 108, 111]);
console.log(buf3.toString()); // 'Hello'

// 从 ArrayBuffer 创建
const arrayBuffer = new ArrayBuffer(8);
const buf4 = Buffer.from(arrayBuffer);

// 创建指定大小的 Buffer
const buf5 = Buffer.alloc(10);        // 10字节，初始化为 0
const buf6 = Buffer.alloc(10, 1);     // 10字节，初始化为 1
const buf7 = Buffer.allocUnsafe(10);  // 10字节，未初始化（更快但不安全）

// 创建并立即使用（不安全但更快）
const buf8 = Buffer.allocUnsafeSlow(10);
```

### 8.2 Buffer 操作

```javascript
const buf = Buffer.from('Hello World');

// 读取
console.log(buf[0]);           // 72 (H 的 ASCII 码)
console.log(buf.length);       // 11
console.log(buf.toString());   // 'Hello World'
console.log(buf.toString('hex')); // '48656c6c6f...'
console.log(buf.toString('base64')); // 'SGVsbG8gV29ybGQ='

// 切片
const slice = buf.slice(0, 5);
console.log(slice.toString()); // 'Hello'

// subarray（推荐，替代 slice）
const sub = buf.subarray(0, 5);
console.log(sub.toString()); // 'Hello'

// 写入
const buf2 = Buffer.alloc(20);
buf2.write('Hello');
buf2.write(' World', 5);
console.log(buf2.toString()); // 'Hello World'

// 写入数字
const numBuf = Buffer.alloc(8);
numBuf.writeUInt8(255, 0);           // 无符号 8 位
numBuf.writeUInt16BE(65535, 1);      // 无符号 16 位大端
numBuf.writeUInt32LE(4294967295, 3); // 无符号 32 位小端
numBuf.writeFloatBE(3.14, 0);        // 32 位浮点数大端
numBuf.writeDoubleBE(3.14, 0);       // 64 位浮点数大端

// 读取数字
const readBuf = Buffer.from([0xFF, 0x00, 0xFF]);
console.log(readBuf.readUInt8(0));    // 255
console.log(readBuf.readUInt16BE(0)); // 65280

// 填充
const fillBuf = Buffer.alloc(10);
fillBuf.fill('a');
console.log(fillBuf.toString()); // 'aaaaaaaaaa'
fillBuf.fill(0);  // 清零

// 复制
const source = Buffer.from('Hello');
const target = Buffer.alloc(10);
source.copy(target);
console.log(target.toString()); // 'Hello'

source.copy(target, 5); // 从目标位置 5 开始复制
console.log(target.toString()); // 'HelloHello'
```

### 8.3 Buffer 比较与搜索

```javascript
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABC');

// 比较
console.log(buf1.compare(buf2)); // -1 (buf1 < buf2)
console.log(buf2.compare(buf1)); // 1  (buf2 > buf1)
console.log(buf1.compare(buf3)); // 0  (相等)

// 相等判断
console.log(buf1.equals(buf3)); // true

// 搜索
const buf = Buffer.from('Hello World');
console.log(buf.indexOf('World'));    // 6
console.log(buf.indexOf('world'));    // -1
console.log(buf.includes('World'));   // true
console.log(buf.lastIndexOf('o'));    // 7

// 排序
const buffers = [
    Buffer.from('c'),
    Buffer.from('a'),
    Buffer.from('b')
];
buffers.sort(Buffer.compare);
console.log(buffers.map(b => b.toString())); // ['a', 'b', 'c']
```

### 8.4 Buffer 合并与转换

```javascript
// 合并 Buffer
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // 'Hello World'

// 指定总长度
const combined2 = Buffer.concat([buf1, buf2], 5);
console.log(combined2.toString()); // 'Hello'

// 转换为 JSON
const buf = Buffer.from('Hello');
console.log(buf.toJSON());
// { type: 'Buffer', data: [72, 101, 108, 108, 111] }

// 转换为数组
const arr = [...buf];
console.log(arr); // [72, 101, 108, 108, 111]

// 转换为 ArrayBuffer
const arrayBuffer = buf.buffer;

// 从 TypedArray 创建
const uint8 = new Uint8Array([1, 2, 3]);
const bufFromTyped = Buffer.from(uint8);

// 遍历
const buf3 = Buffer.from('abc');
for (const byte of buf3) {
    console.log(byte); // 97, 98, 99
}

// entries, keys, values
for (const [index, byte] of buf3.entries()) {
    console.log(index, byte);
}
```

### 8.5 编码转换

```javascript
// 支持的编码
// utf8, utf16le, latin1, base64, base64url, hex, ascii, binary

const str = '你好世界';

// UTF-8 编码
const utf8Buf = Buffer.from(str, 'utf8');
console.log(utf8Buf); // <Buffer e4 bd a0 e5 a5 bd e4 b8 96 e7 95 8c>

// Base64 编码
const base64 = utf8Buf.toString('base64');
console.log(base64); // '5L2g5aW95LiW55WM'

// 从 Base64 解码
const decoded = Buffer.from(base64, 'base64');
console.log(decoded.toString('utf8')); // '你好世界'

// Hex 编码
const hex = utf8Buf.toString('hex');
console.log(hex); // 'e4bda0e5a5bde4b896e7958c'

// 从 Hex 解码
const fromHex = Buffer.from(hex, 'hex');
console.log(fromHex.toString()); // '你好世界'

// 检查编码是否支持
console.log(Buffer.isEncoding('utf8'));  // true
console.log(Buffer.isEncoding('utf-16')); // false

// 计算字符串的字节长度
console.log(Buffer.byteLength('Hello'));    // 5
console.log(Buffer.byteLength('你好'));     // 6 (UTF-8)
console.log(Buffer.byteLength('你好', 'utf16le')); // 4
```

---

## 9. HTTP 模块

### 9.1 创建 HTTP 服务器

```javascript
const http = require('http');

// 基础服务器
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Hello World\n');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('服务器运行在 http://127.0.0.1:3000/');
});

// 完整请求处理
const server2 = http.createServer((req, res) => {
    // 请求信息
    console.log('请求方法:', req.method);
    console.log('请求URL:', req.url);
    console.log('请求头:', req.headers);
    console.log('HTTP版本:', req.httpVersion);
    
    // 读取请求体
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        console.log('请求体:', body);
        
        // 响应
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value'
        });
        
        res.write(JSON.stringify({ message: 'Hello' }));
        res.end();
    });
});

// 路由处理
const server3 = http.createServer((req, res) => {
    const { method, url } = req;
    
    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>首页</h1>');
    } else if (method === 'GET' && url === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([{ id: 1, name: 'John' }]));
    } else if (method === 'POST' && url === '/api/users') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const user = JSON.parse(body);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id: 2, ...user }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});
```

### 9.2 HTTP 客户端

```javascript
const http = require('http');
const https = require('https');

// GET 请求
http.get('http://api.example.com/data', (res) => {
    let data = '';
    
    res.on('data', chunk => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(JSON.parse(data));
    });
}).on('error', (err) => {
    console.error('请求错误:', err);
});

// POST 请求
const postData = JSON.stringify({ name: 'John', age: 30 });

const options = {
    hostname: 'api.example.com',
    port: 80,
    path: '/users',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('响应:', data));
});

req.on('error', (err) => {
    console.error('请求错误:', err);
});

// 设置超时
req.setTimeout(5000, () => {
    req.destroy(new Error('请求超时'));
});

req.write(postData);
req.end();

// HTTPS 请求
https.get('https://api.example.com/secure', (res) => {
    // 处理响应
});

// 封装为 Promise
function httpRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ statusCode: res.statusCode, body });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(data);
        }
        req.end();
    });
}

// 使用
async function fetchData() {
    try {
        const result = await httpRequest({
            hostname: 'api.example.com',
            path: '/data',
            method: 'GET'
        });
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}
```

### 9.3 服务器配置

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello');
});

// 配置选项
server.maxHeadersCount = 2000;      // 最大请求头数量
server.timeout = 120000;            // 超时时间 (ms)
server.keepAliveTimeout = 5000;     // Keep-Alive 超时
server.headersTimeout = 60000;      // 请求头超时

// 事件监听
server.on('request', (req, res) => {
    console.log('收到请求');
});

server.on('connection', (socket) => {
    console.log('新连接');
});

server.on('close', () => {
    console.log('服务器关闭');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('端口被占用');
    }
});

// 关闭服务器
server.close(() => {
    console.log('服务器已关闭');
});

// 获取服务器地址
const address = server.address();
console.log(`服务器地址: ${address.address}:${address.port}`);
```

---

## 10. URL 模块

### 10.1 URL 解析

```javascript
const { URL, URLSearchParams } = require('url');

// 创建 URL 对象
const myUrl = new URL('https://user:pass@example.com:8080/path/to/page?name=john&age=30#section1');

// URL 组成部分
console.log(myUrl.href);       // 完整 URL
console.log(myUrl.origin);     // 'https://example.com:8080'
console.log(myUrl.protocol);   // 'https:'
console.log(myUrl.username);   // 'user'
console.log(myUrl.password);   // 'pass'
console.log(myUrl.host);       // 'example.com:8080'
console.log(myUrl.hostname);   // 'example.com'
console.log(myUrl.port);       // '8080'
console.log(myUrl.pathname);   // '/path/to/page'
console.log(myUrl.search);     // '?name=john&age=30'
console.log(myUrl.searchParams); // URLSearchParams 对象
console.log(myUrl.hash);       // '#section1'

// 修改 URL
myUrl.pathname = '/new/path';
myUrl.searchParams.set('city', 'beijing');
console.log(myUrl.href);

// 相对 URL 解析
const base = new URL('https://example.com/a/b/c');
const relative = new URL('../d', base);
console.log(relative.href); // 'https://example.com/a/d'
```

### 10.2 URLSearchParams

```javascript
const { URLSearchParams } = require('url');

// 创建
const params = new URLSearchParams('name=john&age=30');
const params2 = new URLSearchParams({ name: 'john', age: 30 });
const params3 = new URLSearchParams([['name', 'john'], ['age', '30']]);

// 获取参数
console.log(params.get('name'));     // 'john'
console.log(params.getAll('name'));  // ['john']
console.log(params.has('name'));     // true

// 设置参数
params.set('name', 'jane');          // 替换
params.append('hobby', 'reading');   // 追加
params.append('hobby', 'coding');

// 删除参数
params.delete('age');

// 遍历
for (const [key, value] of params) {
    console.log(`${key}: ${value}`);
}

params.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});

// 获取所有键和值
console.log([...params.keys()]);
console.log([...params.values()]);
console.log([...params.entries()]);

// 转换为字符串
console.log(params.toString());

// 排序
params.sort();

// 使用场景：构建 API 请求
function buildApiUrl(baseUrl, params) {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    return url.href;
}

const apiUrl = buildApiUrl('https://api.example.com/search', {
    q: 'nodejs',
    page: 1,
    limit: 10
});
console.log(apiUrl);
// 'https://api.example.com/search?q=nodejs&page=1&limit=10'
```

### 10.3 旧版 url 模块

```javascript
const url = require('url');

// 解析 URL（旧 API）
const parsed = url.parse('https://example.com/path?name=john', true);
console.log(parsed.protocol);  // 'https:'
console.log(parsed.host);      // 'example.com'
console.log(parsed.pathname);  // '/path'
console.log(parsed.query);     // { name: 'john' }

// 格式化 URL
const formatted = url.format({
    protocol: 'https',
    hostname: 'example.com',
    pathname: '/path',
    query: { name: 'john' }
});
console.log(formatted); // 'https://example.com/path?name=john'

// 解析相对路径
const resolved = url.resolve('https://example.com/a/b/', '../c');
console.log(resolved); // 'https://example.com/a/c'

// URL 编码
console.log(encodeURIComponent('你好 世界'));
// '%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C'

console.log(decodeURIComponent('%E4%BD%A0%E5%A5%BD'));
// '你好'
```

---

## 11. Query String 模块

```javascript
const querystring = require('querystring');

// 解析查询字符串
const parsed = querystring.parse('name=john&age=30&hobby=reading&hobby=coding');
console.log(parsed);
// { name: 'john', age: '30', hobby: ['reading', 'coding'] }

// 自定义分隔符
const parsed2 = querystring.parse('name:john;age:30', ';', ':');
console.log(parsed2);
// { name: 'john', age: '30' }

// 序列化为查询字符串
const stringified = querystring.stringify({
    name: 'john',
    age: 30,
    hobby: ['reading', 'coding']
});
console.log(stringified);
// 'name=john&age=30&hobby=reading&hobby=coding'

// 自定义分隔符
const stringified2 = querystring.stringify({ name: 'john', age: 30 }, ';', ':');
console.log(stringified2);
// 'name:john;age:30'

// URL 编码/解码
const encoded = querystring.escape('你好 世界');
console.log(encoded); // '%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C'

const decoded = querystring.unescape('%E4%BD%A0%E5%A5%BD');
console.log(decoded); // '你好'

// 使用场景：解析表单数据
const formData = 'username=admin&password=123456&remember=on';
const credentials = querystring.parse(formData);
console.log(credentials.username); // 'admin'
```

---

## 12. OS 模块

```javascript
const os = require('os');

// 系统信息
console.log('操作系统:', os.type());        // 'Linux', 'Darwin', 'Windows_NT'
console.log('平台:', os.platform());        // 'linux', 'darwin', 'win32'
console.log('架构:', os.arch());            // 'x64', 'arm64'
console.log('版本:', os.version());         // 操作系统版本
console.log('发行版:', os.release());       // 内核版本

// 主机信息
console.log('主机名:', os.hostname());
console.log('家目录:', os.homedir());
console.log('临时目录:', os.tmpdir());

// 用户信息
console.log('用户信息:', os.userInfo());
/*
{
    uid: 1000,
    gid: 1000,
    username: 'user',
    homedir: '/home/user',
    shell: '/bin/bash'
}
*/

// CPU 信息
console.log('CPU 数量:', os.cpus().length);
console.log('CPU 信息:', os.cpus());
/*
[
    {
        model: 'Intel(R) Core(TM) i7-9750H',
        speed: 2600,
        times: { user: 1234, nice: 0, sys: 567, idle: 8901, irq: 0 }
    },
    ...
]
*/

// 内存信息
console.log('总内存:', os.totalmem());           // 字节
console.log('空闲内存:', os.freemem());          // 字节
console.log('总内存 (GB):', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
console.log('空闲内存 (GB):', (os.freemem() / 1024 / 1024 / 1024).toFixed(2));

// 系统运行时间
console.log('运行时间:', os.uptime(), '秒');
console.log('运行时间 (天):', (os.uptime() / 86400).toFixed(2));

// 负载平均值（Unix 系统）
console.log('负载:', os.loadavg()); // [1分钟, 5分钟, 15分钟]

// 网络接口
console.log('网络接口:', os.networkInterfaces());
/*
{
    lo: [{ address: '127.0.0.1', netmask: '255.0.0.0', ... }],
    eth0: [{ address: '192.168.1.100', netmask: '255.255.255.0', ... }]
}
*/

// 换行符
console.log('换行符:', os.EOL === '\n' ? 'LF' : 'CRLF');

// 常量
console.log('信号常量:', os.constants.signals);  // SIGTERM, SIGKILL 等
console.log('错误常量:', os.constants.errno);    // ENOENT, EACCES 等

// 优先级
console.log('进程优先级:', os.getPriority());
os.setPriority(10); // 设置优先级

// 使用场景：获取本机 IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}
console.log('本机IP:', getLocalIP());
```

---

## 13. Process 进程

### 13.1 进程信息

```javascript
// 进程 ID
console.log('进程 ID:', process.pid);
console.log('父进程 ID:', process.ppid);

// Node.js 版本
console.log('Node 版本:', process.version);
console.log('依赖版本:', process.versions);
/*
{
    node: '18.17.0',
    v8: '10.2.154.26',
    uv: '1.44.2',
    ...
}
*/

// 运行平台
console.log('平台:', process.platform);    // 'win32', 'linux', 'darwin'
console.log('架构:', process.arch);        // 'x64', 'arm64'

// 执行路径
console.log('Node 路径:', process.execPath);
console.log('执行参数:', process.execArgv);
console.log('脚本路径:', process.argv[1]);

// 进程标题
console.log('进程标题:', process.title);
process.title = '我的应用';

// 当前工作目录
console.log('工作目录:', process.cwd());
process.chdir('/tmp'); // 切换目录

// 运行时间
console.log('运行时间:', process.uptime(), '秒');

// 内存使用
console.log('内存使用:', process.memoryUsage());
/*
{
    rss: 30000000,        // 常驻集大小
    heapTotal: 6000000,   // V8 堆总量
    heapUsed: 4000000,    // V8 堆使用量
    external: 1000000,    // C++ 对象
    arrayBuffers: 500000  // ArrayBuffer
}
*/

// CPU 使用
console.log('CPU 使用:', process.cpuUsage());
/*
{
    user: 100000,   // 用户态微秒
    system: 50000   // 内核态微秒
}
*/

// 高精度时间
const start = process.hrtime.bigint();
// ... 操作
const end = process.hrtime.bigint();
console.log(`耗时: ${(end - start) / 1000000n} 毫秒`);
```

### 13.2 环境变量

```javascript
// 读取环境变量
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH);
console.log('HOME:', process.env.HOME || process.env.USERPROFILE);

// 设置环境变量
process.env.MY_VAR = 'value';
console.log(process.env.MY_VAR);

// 删除环境变量
delete process.env.MY_VAR;

// 使用场景：配置管理
const config = {
    port: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 5432,
    debug: process.env.DEBUG === 'true'
};

// 判断环境
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
```

### 13.3 命令行参数

```javascript
// process.argv 数组
// [0]: node 可执行文件路径
// [1]: 脚本文件路径
// [2...]: 命令行参数

// node app.js --name john --age 30
console.log(process.argv);
// ['/usr/bin/node', '/home/user/app.js', '--name', 'john', '--age', '30']

// 解析参数
function parseArgs(args) {
    const result = {};
    for (let i = 2; i < args.length; i += 2) {
        const key = args[i].replace(/^--?/, '');
        const value = args[i + 1];
        result[key] = value;
    }
    return result;
}

const options = parseArgs(process.argv);
console.log(options); // { name: 'john', age: '30' }

// 使用内置模块解析（Node.js 18.3+）
const { parseArgs } = require('util');

const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
        name: { type: 'string', short: 'n' },
        age: { type: 'string', short: 'a' },
        verbose: { type: 'boolean', short: 'v' }
    },
    allowPositionals: true
});

console.log(values);       // { name: 'john', age: '30', verbose: false }
console.log(positionals);  // []
```

### 13.4 标准输入输出

```javascript
// 标准输出
process.stdout.write('Hello\n');

// 标准错误
process.stderr.write('错误信息\n');

// 标准输入
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    console.log('输入:', data.trim());
});

// 交互式输入
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('请输入姓名: ', (answer) => {
    console.log(`你好, ${answer}`);
    rl.close();
});

// 检查是否为 TTY
console.log('stdout 是 TTY:', process.stdout.isTTY);
console.log('stdin 是 TTY:', process.stdin.isTTY);

// 获取终端尺寸
if (process.stdout.isTTY) {
    console.log('终端列数:', process.stdout.columns);
    console.log('终端行数:', process.stdout.rows);
}
```

### 13.5 进程控制

```javascript
// 退出进程
process.exit(0);  // 正常退出
process.exit(1);  // 异常退出

// 退出码
process.exitCode = 1; // 设置退出码

// 退出事件
process.on('exit', (code) => {
    console.log(`进程退出，退出码: ${code}`);
    // 注意：这里只能执行同步操作
});

// 优雅退出
process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号');
    cleanup();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号');
    cleanup();
    process.exit(0);
});

function cleanup() {
    // 关闭数据库连接
    // 关闭服务器
    // 保存状态
    console.log('清理资源...');
}

// 发送信号
process.kill(process.pid, 'SIGTERM');

// 中止进程
process.abort(); // 立即终止

// 下一个事件循环
process.nextTick(() => {
    console.log('下一个 tick');
});

// 未捕获异常
process.on('uncaughtException', (err) => {
    console.error('未捕获异常:', err);
    process.exit(1);
});

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
});

// 警告事件
process.on('warning', (warning) => {
    console.warn('警告:', warning.name, warning.message);
});

// 触发警告
process.emitWarning('这是一个警告', 'CustomWarning');
```

---

## 14. Child Process 子进程

### 14.1 exec 执行命令

```javascript
const { exec, execSync } = require('child_process');

// 异步执行
exec('ls -la', (error, stdout, stderr) => {
    if (error) {
        console.error('执行错误:', error);
        return;
    }
    if (stderr) {
        console.error('标准错误:', stderr);
    }
    console.log('输出:', stdout);
});

// 带选项
exec('node --version', {
    cwd: '/home/user',           // 工作目录
    env: { ...process.env, NODE_ENV: 'production' }, // 环境变量
    timeout: 5000,               // 超时（毫秒）
    maxBuffer: 1024 * 1024,      // 最大输出缓冲
    encoding: 'utf8',            // 编码
    shell: '/bin/bash'           // 使用的 shell
}, (error, stdout, stderr) => {
    console.log(stdout);
});

// 同步执行
try {
    const result = execSync('ls -la', { encoding: 'utf8' });
    console.log(result);
} catch (error) {
    console.error('执行失败:', error.message);
}

// Promise 封装
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runCommand() {
    try {
        const { stdout, stderr } = await execAsync('ls -la');
        console.log(stdout);
    } catch (error) {
        console.error(error);
    }
}
```

### 14.2 execFile 执行文件

```javascript
const { execFile, execFileSync } = require('child_process');

// 直接执行可执行文件（不通过 shell）
execFile('node', ['--version'], (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(stdout);
});

// 同步版本
const result = execFileSync('node', ['--version'], { encoding: 'utf8' });
console.log(result);

// 使用场景：执行脚本文件
execFile('./script.sh', ['arg1', 'arg2'], (error, stdout) => {
    console.log(stdout);
});
```

### 14.3 spawn 生成进程

```javascript
const { spawn, spawnSync } = require('child_process');

// 基础用法
const child = spawn('ls', ['-la']);

child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
    console.log(`子进程退出，退出码: ${code}`);
});

child.on('error', (err) => {
    console.error('启动失败:', err);
});

// 带选项
const child2 = spawn('npm', ['install'], {
    cwd: '/path/to/project',     // 工作目录
    env: process.env,            // 环境变量
    stdio: 'inherit',            // 继承父进程的 stdio
    shell: true,                 // 使用 shell
    detached: false              // 是否分离
});

// stdio 选项
// 'pipe' - 创建管道（默认）
// 'inherit' - 继承父进程
// 'ignore' - 忽略
// 流对象 - 使用指定的流

// 管道传输
const { spawn } = require('child_process');
const grep = spawn('grep', ['hello']);

grep.stdout.on('data', (data) => {
    console.log(`匹配: ${data}`);
});

grep.stdin.write('hello world\n');
grep.stdin.write('goodbye world\n');
grep.stdin.write('hello again\n');
grep.stdin.end();

// 同步版本
const result = spawnSync('ls', ['-la'], { encoding: 'utf8' });
console.log(result.stdout);
console.log(result.status); // 退出码
```

### 14.4 fork 创建 Node.js 子进程

```javascript
// parent.js
const { fork } = require('child_process');

// 创建子进程
const child = fork('./child.js');

// 发送消息给子进程
child.send({ type: 'start', data: [1, 2, 3, 4, 5] });

// 接收子进程消息
child.on('message', (msg) => {
    console.log('收到子进程消息:', msg);
});

// 子进程退出
child.on('exit', (code) => {
    console.log(`子进程退出: ${code}`);
});

// 错误处理
child.on('error', (err) => {
    console.error('子进程错误:', err);
});

// 断开连接
// child.disconnect();

// 终止子进程
// child.kill('SIGTERM');
```

```javascript
// child.js
process.on('message', (msg) => {
    console.log('收到父进程消息:', msg);
    
    if (msg.type === 'start') {
        // 处理数据
        const result = msg.data.map(x => x * 2);
        
        // 发送结果回父进程
        process.send({ type: 'result', data: result });
    }
});

// 错误处理
process.on('uncaughtException', (err) => {
    process.send({ type: 'error', message: err.message });
    process.exit(1);
});
```

### 14.5 进程池

```javascript
// worker-pool.js
const { fork } = require('child_process');
const os = require('os');

class WorkerPool {
    constructor(workerPath, poolSize = os.cpus().length) {
        this.workerPath = workerPath;
        this.poolSize = poolSize;
        this.workers = [];
        this.taskQueue = [];
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.poolSize; i++) {
            this.createWorker();
        }
    }
    
    createWorker() {
        const worker = fork(this.workerPath);
        worker.busy = false;
        
        worker.on('message', (result) => {
            worker.busy = false;
            worker.resolve(result);
            this.processQueue();
        });
        
        worker.on('error', (err) => {
            worker.reject(err);
            this.replaceWorker(worker);
        });
        
        this.workers.push(worker);
    }
    
    replaceWorker(worker) {
        const index = this.workers.indexOf(worker);
        if (index !== -1) {
            this.workers.splice(index, 1);
            worker.kill();
            this.createWorker();
        }
    }
    
    exec(task) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({ task, resolve, reject });
            this.processQueue();
        });
    }
    
    processQueue() {
        if (this.taskQueue.length === 0) return;
        
        const availableWorker = this.workers.find(w => !w.busy);
        if (!availableWorker) return;
        
        const { task, resolve, reject } = this.taskQueue.shift();
        availableWorker.busy = true;
        availableWorker.resolve = resolve;
        availableWorker.reject = reject;
        availableWorker.send(task);
    }
    
    destroy() {
        this.workers.forEach(worker => worker.kill());
        this.workers = [];
    }
}

// 使用
const pool = new WorkerPool('./worker.js', 4);

async function main() {
    const results = await Promise.all([
        pool.exec({ type: 'compute', value: 10 }),
        pool.exec({ type: 'compute', value: 20 }),
        pool.exec({ type: 'compute', value: 30 })
    ]);
    
    console.log(results);
    pool.destroy();
}

main();
```

---

## 15. Cluster 集群

### 15.1 基础集群

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    // 主进程
    console.log(`主进程 ${process.pid} 正在运行`);
    
    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    // 监听工作进程退出
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 退出`);
        // 重启工作进程
        cluster.fork();
    });
    
    // 监听工作进程上线
    cluster.on('online', (worker) => {
        console.log(`工作进程 ${worker.process.pid} 已上线`);
    });
    
} else {
    // 工作进程
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from worker ${process.pid}\n`);
    }).listen(8000);
    
    console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 15.2 进程间通信

```javascript
const cluster = require('cluster');

if (cluster.isPrimary) {
    const worker = cluster.fork();
    
    // 发送消息给工作进程
    worker.send({ type: 'config', data: { port: 3000 } });
    
    // 接收工作进程消息
    worker.on('message', (msg) => {
        console.log('主进程收到:', msg);
    });
    
    // 广播消息给所有工作进程
    function broadcast(msg) {
        for (const id in cluster.workers) {
            cluster.workers[id].send(msg);
        }
    }
    
} else {
    // 接收主进程消息
    process.on('message', (msg) => {
        console.log('工作进程收到:', msg);
        
        // 回复主进程
        process.send({ type: 'ready', pid: process.pid });
    });
}
```

### 15.3 零停机重启

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    // 优雅重启
    function gracefulRestart() {
        const workers = Object.values(cluster.workers);
        
        function restartWorker(index) {
            if (index >= workers.length) return;
            
            const worker = workers[index];
            console.log(`重启工作进程 ${worker.process.pid}`);
            
            // 创建新工作进程
            const newWorker = cluster.fork();
            
            newWorker.on('listening', () => {
                // 新进程就绪后，关闭旧进程
                worker.disconnect();
                
                worker.on('disconnect', () => {
                    // 继续重启下一个
                    restartWorker(index + 1);
                });
                
                // 超时强制终止
                setTimeout(() => {
                    if (!worker.isDead()) {
                        worker.kill();
                    }
                }, 5000);
            });
        }
        
        restartWorker(0);
    }
    
    // 监听重启信号
    process.on('SIGUSR2', () => {
        console.log('收到重启信号');
        gracefulRestart();
    });
    
    cluster.on('exit', (worker, code, signal) => {
        if (!worker.exitedAfterDisconnect) {
            console.log(`工作进程 ${worker.process.pid} 意外退出，重启中...`);
            cluster.fork();
        }
    });
    
} else {
    const server = http.createServer((req, res) => {
        res.end(`Worker ${process.pid}`);
    });
    
    server.listen(3000);
    
    // 优雅关闭
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
}
```

---

## 16. Worker Threads 工作线程

### 16.1 基础使用

```javascript
// main.js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // 主线程
    console.log('主线程');
    
    // 创建工作线程
    const worker = new Worker(__filename, {
        workerData: { start: 0, end: 1000000 }
    });
    
    // 接收消息
    worker.on('message', (result) => {
        console.log('计算结果:', result);
    });
    
    // 错误处理
    worker.on('error', (err) => {
        console.error('工作线程错误:', err);
    });
    
    // 退出事件
    worker.on('exit', (code) => {
        console.log(`工作线程退出，退出码: ${code}`);
    });
    
} else {
    // 工作线程
    console.log('工作线程');
    
    const { start, end } = workerData;
    
    // 执行计算
    let sum = 0;
    for (let i = start; i < end; i++) {
        sum += i;
    }
    
    // 发送结果
    parentPort.postMessage(sum);
}
```

### 16.2 独立工作线程文件

```javascript
// worker.js
const { parentPort, workerData } = require('worker_threads');

// 接收消息
parentPort.on('message', (msg) => {
    if (msg.type === 'compute') {
        const result = heavyComputation(msg.data);
        parentPort.postMessage({ type: 'result', data: result });
    }
});

function heavyComputation(data) {
    // 模拟耗时计算
    let result = 0;
    for (let i = 0; i < data; i++) {
        result += Math.sqrt(i);
    }
    return result;
}
```

```javascript
// main.js
const { Worker } = require('worker_threads');
const path = require('path');

function runWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'worker.js'));
        
        worker.on('message', (msg) => {
            if (msg.type === 'result') {
                resolve(msg.data);
            }
        });
        
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
        
        worker.postMessage({ type: 'compute', data });
    });
}

async function main() {
    const result = await runWorker(10000000);
    console.log('结果:', result);
}

main();
```

### 16.3 共享内存

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    // 创建共享内存
    const sharedBuffer = new SharedArrayBuffer(4);
    const sharedArray = new Int32Array(sharedBuffer);
    
    sharedArray[0] = 0;
    
    // 创建多个工作线程
    const workers = [];
    for (let i = 0; i < 4; i++) {
        const worker = new Worker(__filename, {
            workerData: { sharedBuffer, index: i }
        });
        workers.push(worker);
    }
    
    // 等待所有线程完成
    Promise.all(workers.map(w => new Promise(resolve => w.on('exit', resolve))))
        .then(() => {
            console.log('最终值:', sharedArray[0]);
        });
    
} else {
    const { workerData } = require('worker_threads');
    const { sharedBuffer, index } = workerData;
    const sharedArray = new Int32Array(sharedBuffer);
    
    // 原子操作
    for (let i = 0; i < 1000; i++) {
        Atomics.add(sharedArray, 0, 1);
    }
    
    console.log(`线程 ${index} 完成`);
}
```

### 16.4 线程池

```javascript
const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');

class ThreadPool {
    constructor(workerPath, numThreads = os.cpus().length) {
        this.workerPath = workerPath;
        this.numThreads = numThreads;
        this.workers = [];
        this.freeWorkers = [];
        this.taskQueue = [];
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.numThreads; i++) {
            this.addWorker();
        }
    }
    
    addWorker() {
        const worker = new Worker(this.workerPath);
        
        worker.on('message', (result) => {
            worker._resolve(result);
            worker._resolve = null;
            this.freeWorkers.push(worker);
            this.processQueue();
        });
        
        worker.on('error', (err) => {
            if (worker._reject) {
                worker._reject(err);
            }
            this.removeWorker(worker);
            this.addWorker();
        });
        
        this.workers.push(worker);
        this.freeWorkers.push(worker);
    }
    
    removeWorker(worker) {
        const workerIndex = this.workers.indexOf(worker);
        if (workerIndex !== -1) {
            this.workers.splice(workerIndex, 1);
        }
        
        const freeIndex = this.freeWorkers.indexOf(worker);
        if (freeIndex !== -1) {
            this.freeWorkers.splice(freeIndex, 1);
        }
    }
    
    run(task) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({ task, resolve, reject });
            this.processQueue();
        });
    }
    
    processQueue() {
        if (this.taskQueue.length === 0) return;
        if (this.freeWorkers.length === 0) return;
        
        const { task, resolve, reject } = this.taskQueue.shift();
        const worker = this.freeWorkers.pop();
        
        worker._resolve = resolve;
        worker._reject = reject;
        worker.postMessage(task);
    }
    
    destroy() {
        for (const worker of this.workers) {
            worker.terminate();
        }
    }
}

module.exports = ThreadPool;
```

---

## 17. 定时器

### 17.1 setTimeout / clearTimeout

```javascript
// 延迟执行
const timerId = setTimeout(() => {
    console.log('3秒后执行');
}, 3000);

// 取消定时器
clearTimeout(timerId);

// 立即执行版本
const timer = setTimeout(() => {
    console.log('执行');
}, 0);

// 传递参数
setTimeout((name, age) => {
    console.log(`${name} is ${age} years old`);
}, 1000, 'John', 30);

// Promise 封装
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
    console.log('开始');
    await delay(2000);
    console.log('2秒后');
}

// 使用 timers/promises
const { setTimeout: sleep } = require('timers/promises');

async function example2() {
    await sleep(1000);
    console.log('1秒后');
}
```

### 17.2 setInterval / clearInterval

```javascript
// 重复执行
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`执行第 ${count} 次`);
    
    if (count >= 5) {
        clearInterval(intervalId);
    }
}, 1000);

// 使用场景：心跳检测
function startHeartbeat(callback, interval = 30000) {
    return setInterval(() => {
        callback();
    }, interval);
}

const heartbeat = startHeartbeat(() => {
    console.log('发送心跳');
}, 5000);

// 停止心跳
// clearInterval(heartbeat);
```

### 17.3 setImmediate / clearImmediate

```javascript
// 在当前事件循环结束后立即执行
const immediateId = setImmediate(() => {
    console.log('setImmediate 执行');
});

// 取消
clearImmediate(immediateId);

// 执行顺序对比
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));

// 输出顺序（通常）：
// nextTick
// setTimeout 或 setImmediate（顺序不确定）
// setImmediate 或 setTimeout

// 在 I/O 回调中，setImmediate 总是先于 setTimeout
const fs = require('fs');
fs.readFile(__filename, () => {
    setTimeout(() => console.log('setTimeout'), 0);
    setImmediate(() => console.log('setImmediate'));
});
// 输出：setImmediate, setTimeout
```

### 17.4 process.nextTick

```javascript
// 在当前操作完成后立即执行
process.nextTick(() => {
    console.log('nextTick 1');
});

process.nextTick(() => {
    console.log('nextTick 2');
});

console.log('同步代码');

// 输出：
// 同步代码
// nextTick 1
// nextTick 2

// 使用场景：确保回调异步执行
function asyncOperation(callback) {
    // 确保回调总是异步执行
    process.nextTick(() => {
        callback(null, 'result');
    });
}

// 使用场景：事件发射
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
    constructor() {
        super();
        
        // 使用 nextTick 确保事件监听器已注册
        process.nextTick(() => {
            this.emit('ready');
        });
    }
}

const emitter = new MyEmitter();
emitter.on('ready', () => {
    console.log('就绪');
});
```

### 17.5 定时器引用

```javascript
const timer = setTimeout(() => {
    console.log('执行');
}, 10000);

// 取消引用（不阻止程序退出）
timer.unref();

// 恢复引用
timer.ref();

// 刷新定时器
timer.refresh(); // 重置为原始延迟

// 检查是否有活动定时器
console.log(timer.hasRef()); // true 或 false

// 使用场景：可选的后台任务
function startOptionalTask() {
    const timer = setInterval(() => {
        console.log('后台任务');
    }, 5000);
    
    // 不阻止程序退出
    timer.unref();
    
    return timer;
}
```

---

## 18. Crypto 加密模块

### 18.1 哈希算法

```javascript
const crypto = require('crypto');

// MD5（不推荐用于安全场景）
const md5 = crypto.createHash('md5').update('Hello').digest('hex');
console.log('MD5:', md5);

// SHA-256
const sha256 = crypto.createHash('sha256').update('Hello').digest('hex');
console.log('SHA-256:', sha256);

// SHA-512
const sha512 = crypto.createHash('sha512').update('Hello').digest('hex');
console.log('SHA-512:', sha512);

// 多次 update
const hash = crypto.createHash('sha256');
hash.update('Hello');
hash.update(' World');
console.log(hash.digest('hex'));

// 流式哈希
const fs = require('fs');
const hash2 = crypto.createHash('sha256');
const input = fs.createReadStream('file.txt');
input.pipe(hash2).on('finish', () => {
    console.log(hash2.digest('hex'));
});

// 或使用 setEncoding
input.on('data', (chunk) => hash2.update(chunk));
input.on('end', () => console.log(hash2.digest('hex')));

// 支持的哈希算法
console.log(crypto.getHashes());
```

### 18.2 HMAC

```javascript
const crypto = require('crypto');

// 创建 HMAC
const hmac = crypto.createHmac('sha256', 'secret-key');
hmac.update('Hello World');
console.log(hmac.digest('hex'));

// 使用场景：API 签名
function signRequest(data, secretKey) {
    return crypto
        .createHmac('sha256', secretKey)
        .update(JSON.stringify(data))
        .digest('hex');
}

const signature = signRequest({ userId: 1, action: 'login' }, 'my-secret');
console.log('签名:', signature);

// 验证签名
function verifySignature(data, signature, secretKey) {
    const expected = signRequest(data, secretKey);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
    );
}
```

### 18.3 对称加密

```javascript
const crypto = require('crypto');

// AES-256-CBC 加密
function encrypt(text, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// AES-256-CBC 解密
function decrypt(encrypted, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// 生成密钥和 IV
const key = crypto.randomBytes(32); // 256 位
const iv = crypto.randomBytes(16);  // 128 位

const text = 'Hello World';
const encrypted = encrypt(text, key, iv);
const decrypted = decrypt(encrypted, key, iv);

console.log('原文:', text);
console.log('加密:', encrypted);
console.log('解密:', decrypted);

// AES-256-GCM（推荐，带认证）
function encryptGCM(text, key) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
        iv: iv.toString('hex'),
        encrypted,
        authTag: authTag.toString('hex')
    };
}

function decryptGCM({ iv, encrypted, authTag }, key) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}
```

### 18.4 非对称加密

```javascript
const crypto = require('crypto');

// 生成密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

console.log('公钥:', publicKey);
console.log('私钥:', privateKey);

// 公钥加密
function encryptWithPublicKey(data, publicKey) {
    return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
}

// 私钥解密
function decryptWithPrivateKey(encrypted, privateKey) {
    return crypto.privateDecrypt(privateKey, Buffer.from(encrypted, 'base64')).toString();
}

const encrypted = encryptWithPublicKey('Hello World', publicKey);
const decrypted = decryptWithPrivateKey(encrypted, privateKey);

console.log('加密:', encrypted);
console.log('解密:', decrypted);

// 数字签名
function sign(data, privateKey) {
    const signer = crypto.createSign('SHA256');
    signer.update(data);
    return signer.sign(privateKey, 'base64');
}

// 验证签名
function verify(data, signature, publicKey) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(data);
    return verifier.verify(publicKey, signature, 'base64');
}

const data = 'Important message';
const signature = sign(data, privateKey);
const isValid = verify(data, signature, publicKey);

console.log('签名:', signature);
console.log('验证:', isValid);
```

### 18.5 密码哈希

```javascript
const crypto = require('crypto');

// 使用 scrypt（推荐）
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

async function verifyPassword(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(':');
        
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(crypto.timingSafeEqual(
                Buffer.from(key, 'hex'),
                derivedKey
            ));
        });
    });
}

// 使用示例
async function example() {
    const hash = await hashPassword('myPassword123');
    console.log('哈希:', hash);
    
    const isValid = await verifyPassword('myPassword123', hash);
    console.log('验证:', isValid);
}

// 使用 pbkdf2
function hashPasswordPBKDF2(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}
```

### 18.6 随机数生成

```javascript
const crypto = require('crypto');

// 随机字节
const randomBytes = crypto.randomBytes(16);
console.log(randomBytes.toString('hex'));

// 异步版本
crypto.randomBytes(16, (err, buffer) => {
    console.log(buffer.toString('hex'));
});

// 随机整数
const randomInt = crypto.randomInt(100);      // 0-99
const randomInt2 = crypto.randomInt(10, 100); // 10-99
console.log(randomInt, randomInt2);

// 异步版本
crypto.randomInt(100, (err, n) => {
    console.log(n);
});

// 生成 UUID
const uuid = crypto.randomUUID();
console.log(uuid); // 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

// 生成安全的随机字符串
function generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// 生成随机密码
function generatePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const randomValues = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    
    return password;
}
```

---

## 19. Util 工具模块

### 19.1 promisify

```javascript
const util = require('util');
const fs = require('fs');

// 将回调函数转为 Promise
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function example() {
    const data = await readFile('file.txt', 'utf8');
    console.log(data);
    
    await writeFile('output.txt', 'Hello');
}

// 自定义 promisify
const customFunc = (arg, callback) => {
    setTimeout(() => {
        callback(null, `Result: ${arg}`);
    }, 100);
};

const promisifiedFunc = util.promisify(customFunc);
promisifiedFunc('test').then(console.log);

// 带自定义 promisify 行为
customFunc[util.promisify.custom] = (arg) => {
    return new Promise((resolve) => {
        resolve(`Custom: ${arg}`);
    });
};
```

### 19.2 callbackify

```javascript
const util = require('util');

// 将 async 函数转为回调风格
async function asyncFunc() {
    return 'Hello';
}

const callbackFunc = util.callbackify(asyncFunc);

callbackFunc((err, result) => {
    if (err) throw err;
    console.log(result);
});
```

### 19.3 格式化与检查

```javascript
const util = require('util');

// 格式化字符串
console.log(util.format('%s:%s', 'foo', 'bar')); // 'foo:bar'
console.log(util.format('%d + %d = %d', 1, 2, 3)); // '1 + 2 = 3'
console.log(util.format('%o', { name: 'John' })); // 对象
console.log(util.format('%j', { name: 'John' })); // JSON

// formatWithOptions
console.log(util.formatWithOptions({ colors: true }, '%o', { name: 'John' }));

// 检查类型
console.log(util.types.isDate(new Date()));           // true
console.log(util.types.isRegExp(/test/));             // true
console.log(util.types.isAsyncFunction(async () => {})); // true
console.log(util.types.isPromise(Promise.resolve())); // true
console.log(util.types.isArrayBuffer(new ArrayBuffer(8))); // true
console.log(util.types.isMap(new Map()));             // true
console.log(util.types.isSet(new Set()));             // true
console.log(util.types.isWeakMap(new WeakMap()));     // true
console.log(util.types.isWeakSet(new WeakSet()));     // true

// 对象检查
console.log(util.inspect({ a: 1, b: { c: 2 } }));
console.log(util.inspect({ a: 1 }, { depth: null, colors: true }));

// 自定义 inspect
class MyClass {
    constructor(name) {
        this.name = name;
    }
    
    [util.inspect.custom](depth, options) {
        return `MyClass { name: "${this.name}" }`;
    }
}

console.log(util.inspect(new MyClass('test')));
```

### 19.4 废弃警告

```javascript
const util = require('util');

// 标记函数为废弃
const oldFunction = util.deprecate(() => {
    console.log('执行旧函数');
}, 'oldFunction() is deprecated. Use newFunction() instead.');

oldFunction(); // 打印警告

// 标记属性为废弃
const obj = {};
Object.defineProperty(obj, 'oldProp', {
    get: util.deprecate(() => 'value', 'obj.oldProp is deprecated'),
    enumerable: true
});

console.log(obj.oldProp);
```

### 19.5 继承

```javascript
const util = require('util');
const EventEmitter = require('events');

// 继承（旧方式，现在推荐使用 class extends）
function MyEmitter() {
    EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);

const emitter = new MyEmitter();
emitter.on('event', () => console.log('event'));
emitter.emit('event');

// 现代方式
class ModernEmitter extends EventEmitter {
    constructor() {
        super();
    }
}
```

### 19.6 文本编解码

```javascript
const util = require('util');

// TextDecoder
const decoder = new util.TextDecoder('utf-8');
const uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(uint8Array)); // 'Hello'

// TextEncoder
const encoder = new util.TextEncoder();
const encoded = encoder.encode('Hello');
console.log(encoded); // Uint8Array [72, 101, 108, 108, 111]

// 其他编码
const gbkDecoder = new util.TextDecoder('gbk');
// const gbkBuffer = ...;
// console.log(gbkDecoder.decode(gbkBuffer));
```

---

## 20. Assert 断言模块

### 20.1 基础断言

```javascript
const assert = require('assert');

// 严格模式（推荐）
const strictAssert = require('assert').strict;

// 值相等
assert.strictEqual(1, 1);           // 通过
assert.strictEqual('hello', 'hello'); // 通过
// assert.strictEqual(1, '1');      // 失败 - 类型不同

// 深度相等
assert.deepStrictEqual({ a: 1 }, { a: 1 }); // 通过
assert.deepStrictEqual([1, 2, 3], [1, 2, 3]); // 通过

// 不相等
assert.notStrictEqual(1, 2);
assert.notDeepStrictEqual({ a: 1 }, { a: 2 });

// 真值断言
assert.ok(true);
assert.ok(1);
assert.ok('hello');
// assert.ok(0);  // 失败
// assert.ok(''); // 失败

// 失败断言
// assert.fail('失败消息');

// 条件断言
const value = 10;
assert.ok(value > 5, 'value 必须大于 5');
```

### 20.2 异常断言

```javascript
const assert = require('assert').strict;

// 断言抛出异常
function throwError() {
    throw new Error('出错了');
}

assert.throws(throwError);

// 断言特定错误
assert.throws(
    () => { throw new TypeError('类型错误'); },
    TypeError
);

// 断言错误消息
assert.throws(
    () => { throw new Error('特定错误'); },
    { message: '特定错误' }
);

// 断言不抛出异常
assert.doesNotThrow(() => {
    // 正常执行
});

// 异步断言
assert.rejects(async () => {
    throw new Error('异步错误');
});

assert.rejects(
    async () => { throw new TypeError('异步类型错误'); },
    TypeError
);

// 断言不拒绝
assert.doesNotReject(async () => {
    return 'success';
});
```

### 20.3 使用场景

```javascript
const assert = require('assert').strict;

// 参数验证
function divide(a, b) {
    assert.ok(typeof a === 'number', 'a 必须是数字');
    assert.ok(typeof b === 'number', 'b 必须是数字');
    assert.notStrictEqual(b, 0, '除数不能为 0');
    return a / b;
}

// 状态验证
class Connection {
    constructor() {
        this.connected = false;
    }
    
    send(data) {
        assert.ok(this.connected, '必须先连接');
        // 发送数据
    }
    
    connect() {
        this.connected = true;
    }
}

// 单元测试
function testAdd() {
    assert.strictEqual(add(1, 2), 3);
    assert.strictEqual(add(-1, 1), 0);
    assert.strictEqual(add(0, 0), 0);
    console.log('所有测试通过');
}

function add(a, b) {
    return a + b;
}

testAdd();
```

---

## 附录：模块速查表

| 模块 | 用途 | 常用 API |
|------|------|----------|
| `fs` | 文件系统 | readFile, writeFile, mkdir, stat |
| `path` | 路径处理 | join, resolve, dirname, basename |
| `events` | 事件机制 | EventEmitter, on, emit, once |
| `stream` | 流处理 | Readable, Writable, Transform, pipeline |
| `buffer` | 二进制数据 | Buffer.from, alloc, concat |
| `http/https` | HTTP 服务 | createServer, request, get |
| `url` | URL 解析 | URL, URLSearchParams |
| `querystring` | 查询字符串 | parse, stringify |
| `os` | 系统信息 | cpus, totalmem, homedir |
| `process` | 进程控制 | env, argv, exit, cwd |
| `child_process` | 子进程 | exec, spawn, fork |
| `cluster` | 集群 | fork, isPrimary, workers |
| `worker_threads` | 工作线程 | Worker, isMainThread, parentPort |
| `crypto` | 加密 | createHash, createCipher, randomBytes |
| `util` | 工具函数 | promisify, inspect, format |
| `assert` | 断言 | strictEqual, deepStrictEqual, throws |

---

**文档版本**: 1.0  
**适用 Node.js 版本**: 18.x LTS 及以上  
**最后更新**: 2026年2月
