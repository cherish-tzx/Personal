# Nginx 基础用法完全指南

> 本文档详细介绍Nginx的所有核心语法、配置指令、使用方法及实际应用场景
<div class="doc-toc">
## 目录

1. [Nginx概述与安装](#1-nginx概述与安装)
2. [配置文件结构](#2-配置文件结构)
3. [核心指令详解](#3-核心指令详解)
4. [HTTP服务器配置](#4-http服务器配置)
5. [Server块配置](#5-server块配置)
6. [Location匹配规则](#6-location匹配规则)
7. [反向代理配置](#7-反向代理配置)
8. [负载均衡配置](#8-负载均衡配置)
9. [静态资源服务](#9-静态资源服务)
10. [缓存配置](#10-缓存配置)
11. [Gzip压缩配置](#11-gzip压缩配置)
12. [SSL/HTTPS配置](#12-sslhttps配置)
13. [日志配置](#13-日志配置)
14. [安全配置](#14-安全配置)
15. [性能优化配置](#15-性能优化配置)
16. [Rewrite重写规则](#16-rewrite重写规则)
17. [常用变量](#17-常用变量)
18. [常见问题与解决方案](#18-常见问题与解决方案)


</div>

---

## 1. Nginx概述与安装

### 1.1 Nginx简介

Nginx是一个高性能的HTTP和反向代理服务器，也是一个IMAP/POP3/SMTP代理服务器。其特点包括：

- **高并发处理能力**：采用异步非阻塞的事件驱动模型
- **内存消耗低**：10000个非活跃HTTP Keep-Alive连接仅消耗约2.5MB内存
- **高可靠性**：支持热部署，可以不停机升级
- **模块化设计**：功能模块化，可按需编译

### 1.2 安装方式

#### Linux (CentOS/RHEL)

```bash
# 安装EPEL仓库
yum install epel-release -y

# 安装Nginx
yum install nginx -y

# 启动Nginx
systemctl start nginx
systemctl enable nginx

# 查看状态
systemctl status nginx
```

#### Linux (Ubuntu/Debian)

```bash
# 更新包索引
apt update

# 安装Nginx
apt install nginx -y

# 启动Nginx
systemctl start nginx
systemctl enable nginx
```

#### Windows

```bash
# 下载Windows版本: http://nginx.org/en/download.html
# 解压到指定目录，如 C:\nginx

# 启动
cd C:\nginx
start nginx

# 停止
nginx -s stop

# 重载配置
nginx -s reload
```

#### Docker

```bash
# 拉取镜像
docker pull nginx:latest

# 运行容器
docker run -d \
  --name nginx \
  -p 80:80 \
  -p 443:443 \
  -v /path/to/nginx.conf:/etc/nginx/nginx.conf \
  -v /path/to/html:/usr/share/nginx/html \
  nginx:latest
```

### 1.3 常用命令

```bash
# 启动Nginx
nginx

# 停止Nginx（快速停止）
nginx -s stop

# 优雅停止（处理完当前请求后停止）
nginx -s quit

# 重载配置文件
nginx -s reload

# 重新打开日志文件
nginx -s reopen

# 检测配置文件语法
nginx -t

# 检测配置文件语法并显示配置
nginx -T

# 显示版本
nginx -v

# 显示版本和编译配置
nginx -V

# 指定配置文件启动
nginx -c /path/to/nginx.conf

# 设置全局指令
nginx -g "daemon off;"
```

---

## 2. 配置文件结构

### 2.1 配置文件位置

```bash
# 主配置文件
/etc/nginx/nginx.conf

# 额外配置文件目录
/etc/nginx/conf.d/
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/

# 默认网站根目录
/usr/share/nginx/html/

# 日志文件
/var/log/nginx/access.log
/var/log/nginx/error.log
```

### 2.2 配置文件基本结构

```nginx
# 全局块 - 影响Nginx服务器整体运行的配置
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# events块 - 影响Nginx服务器与用户网络连接的配置
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

# http块 - 代理、缓存、日志等绑定多配置
http {
    # http全局块
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # server块 - 虚拟主机配置
    server {
        # server全局块
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        
        # location块 - 请求路由配置
        location / {
            index index.html index.htm;
        }
        
        location /api {
            proxy_pass http://backend;
        }
    }
    
    # 可以包含多个server块
    server {
        listen 8080;
        server_name other.example.com;
        # ...
    }
    
    # 引入其他配置文件
    include /etc/nginx/conf.d/*.conf;
}

# stream块 - TCP/UDP代理（可选）
stream {
    upstream backend {
        server 127.0.0.1:3306;
    }
    
    server {
        listen 3307;
        proxy_pass backend;
    }
}
```

### 2.3 配置层级关系

```
nginx.conf
├── 全局块
│   ├── user
│   ├── worker_processes
│   ├── error_log
│   └── pid
├── events块
│   ├── worker_connections
│   ├── use
│   └── multi_accept
├── http块
│   ├── http全局块
│   │   ├── include
│   │   ├── default_type
│   │   ├── log_format
│   │   ├── sendfile
│   │   └── keepalive_timeout
│   └── server块（可多个）
│       ├── server全局块
│       │   ├── listen
│       │   ├── server_name
│       │   └── root
│       └── location块（可多个）
│           ├── root/alias
│           ├── index
│           └── proxy_pass
└── stream块（可选）
```

---

## 3. 核心指令详解

### 3.1 全局块指令

#### user - 运行用户

```nginx
# 语法
user user [group];

# 示例：指定运行用户和组
user nginx nginx;

# 示例：只指定用户
user www-data;

# 使用场景：控制Nginx工作进程的运行权限
# 生产环境应使用非root用户运行，提高安全性
```

#### worker_processes - 工作进程数

```nginx
# 语法
worker_processes number | auto;

# 示例：自动检测CPU核心数
worker_processes auto;

# 示例：指定4个工作进程
worker_processes 4;

# 使用场景：
# - 开发环境：1
# - 生产环境：auto 或 CPU核心数
# - IO密集型：可设置为CPU核心数的1.5-2倍
```

#### error_log - 错误日志

```nginx
# 语法
error_log file [level];

# 日志级别（从低到高）：debug, info, notice, warn, error, crit, alert, emerg

# 示例：记录warn及以上级别的错误
error_log /var/log/nginx/error.log warn;

# 示例：记录所有debug信息（需要编译时启用debug模块）
error_log /var/log/nginx/error.log debug;

# 示例：关闭错误日志
error_log /dev/null;

# 使用场景：
# - 开发环境：debug或info
# - 生产环境：warn或error
```

#### pid - 进程ID文件

```nginx
# 语法
pid file;

# 示例
pid /var/run/nginx.pid;
pid /run/nginx.pid;

# 使用场景：存储主进程ID，用于进程管理和信号发送
```

#### worker_rlimit_nofile - 文件描述符限制

```nginx
# 语法
worker_rlimit_nofile number;

# 示例：设置每个工作进程可打开的最大文件数
worker_rlimit_nofile 65535;

# 使用场景：高并发环境下需要增大此值
# 建议值：worker_connections * 2
```

### 3.2 Events块指令

#### worker_connections - 最大连接数

```nginx
# 语法
worker_connections number;

# 示例
events {
    worker_connections 4096;
}

# 最大并发连接数 = worker_processes * worker_connections
# 使用场景：根据服务器配置和预期并发量调整
```

#### use - 事件驱动模型

```nginx
# 语法
use method;

# 可选值：select, poll, kqueue, epoll, /dev/poll, eventport

# 示例：Linux系统使用epoll
events {
    use epoll;
}

# 示例：FreeBSD/macOS使用kqueue
events {
    use kqueue;
}

# 使用场景：
# - Linux 2.6+：epoll（推荐）
# - FreeBSD/macOS：kqueue
# - 其他Unix：poll
# - Windows：select
```

#### multi_accept - 批量接受连接

```nginx
# 语法
multi_accept on | off;

# 示例
events {
    multi_accept on;
}

# 使用场景：
# - on：工作进程一次接受所有新连接
# - off：工作进程一次只接受一个新连接
# 高并发场景建议开启
```

#### accept_mutex - 连接互斥锁

```nginx
# 语法
accept_mutex on | off;

# 示例
events {
    accept_mutex on;
    accept_mutex_delay 500ms;
}

# 使用场景：
# - on：工作进程轮流接受新连接，避免惊群效应
# - off：所有工作进程被唤醒竞争连接
# 高并发场景建议关闭以提高性能
```

---

## 4. HTTP服务器配置

### 4.1 基本HTTP配置

```nginx
http {
    # MIME类型配置
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 字符集
    charset utf-8;
    
    # 隐藏Nginx版本号
    server_tokens off;
    
    # 文件传输优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 连接超时设置
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # 请求体大小限制
    client_max_body_size 100m;
    client_body_buffer_size 128k;
    
    # 请求头大小限制
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    # 超时设置
    client_body_timeout 60s;
    client_header_timeout 60s;
    send_timeout 60s;
    
    # 服务器配置
    server {
        # ...
    }
}
```

### 4.2 include指令

```nginx
# 语法
include file | mask;

# 示例：引入单个文件
include /etc/nginx/mime.types;

# 示例：引入目录下所有.conf文件
include /etc/nginx/conf.d/*.conf;

# 示例：引入多个指定文件
include /etc/nginx/sites-enabled/*;

# 使用场景：
# - 模块化配置管理
# - 分离虚拟主机配置
# - 复用通用配置片段
```

### 4.3 types指令

```nginx
# 语法
types { ... }

# 示例：自定义MIME类型
types {
    text/html                             html htm shtml;
    text/css                              css;
    text/xml                              xml;
    application/javascript                js;
    application/json                      json;
    image/png                             png;
    image/jpeg                            jpeg jpg;
    image/gif                             gif;
    image/svg+xml                         svg svgz;
    application/pdf                       pdf;
    video/mp4                             mp4;
    application/wasm                      wasm;
    font/woff                             woff;
    font/woff2                            woff2;
}

# 使用场景：定义文件扩展名与MIME类型的映射关系
```

### 4.4 default_type指令

```nginx
# 语法
default_type mime-type;

# 示例
default_type application/octet-stream;

# 使用场景：当无法确定文件MIME类型时使用的默认类型
# application/octet-stream 表示二进制流，浏览器会提示下载
```

---

## 5. Server块配置

### 5.1 listen指令

```nginx
# 语法
listen address[:port] [options];
listen port [options];
listen unix:path [options];

# 基本示例
server {
    listen 80;                    # 监听80端口
    listen 8080;                  # 监听8080端口
}

# 指定IP和端口
server {
    listen 192.168.1.100:80;     # 监听指定IP的80端口
    listen 127.0.0.1:8080;       # 只监听本地8080端口
}

# IPv6配置
server {
    listen [::]:80;              # 监听IPv6的80端口
    listen [::]:80 ipv6only=on;  # 仅IPv6
}

# 默认服务器
server {
    listen 80 default_server;    # 设为默认服务器
}

# SSL配置
server {
    listen 443 ssl;              # SSL端口
    listen 443 ssl http2;        # SSL + HTTP/2
}

# Unix Socket
server {
    listen unix:/var/run/nginx.sock;
}

# 完整选项示例
server {
    listen 80 default_server backlog=4096 rcvbuf=8k sndbuf=8k;
}

# 使用场景：
# - default_server：处理未匹配到server_name的请求
# - ssl：启用HTTPS
# - http2：启用HTTP/2协议
# - backlog：设置TCP连接队列大小
```

### 5.2 server_name指令

```nginx
# 语法
server_name name ...;

# 精确匹配
server {
    server_name example.com;
}

# 多个域名
server {
    server_name example.com www.example.com;
}

# 通配符匹配（只能在开头或结尾）
server {
    server_name *.example.com;           # 匹配 a.example.com, b.example.com
    server_name www.example.*;           # 匹配 www.example.com, www.example.org
}

# 正则表达式匹配（以~开头）
server {
    server_name ~^www\d+\.example\.com$; # 匹配 www1.example.com, www2.example.com
}

# 正则捕获组
server {
    server_name ~^(?<subdomain>.+)\.example\.com$;
    root /sites/$subdomain;
}

# 空名称（处理没有Host头的请求）
server {
    server_name "";
}

# 默认服务器（捕获所有）
server {
    server_name _;
}

# 匹配优先级（从高到低）：
# 1. 精确匹配
# 2. 以*开头的最长通配符
# 3. 以*结尾的最长通配符
# 4. 第一个匹配的正则表达式
# 5. default_server
```

### 5.3 root和alias指令

```nginx
# root指令
# 语法：root path;
# 请求URI会追加到root路径后

server {
    root /var/www/html;
    
    location /images/ {
        # 请求 /images/logo.png 
        # 实际路径：/var/www/html/images/logo.png
    }
}

# alias指令
# 语法：alias path;
# 请求URI被替换为alias路径

server {
    location /images/ {
        alias /data/images/;
        # 请求 /images/logo.png
        # 实际路径：/data/images/logo.png（注意没有/images/）
    }
}

# root和alias的区别示例
server {
    # 使用root
    location /static/ {
        root /var/www;
        # /static/js/app.js -> /var/www/static/js/app.js
    }
    
    # 使用alias
    location /static/ {
        alias /var/www/assets/;
        # /static/js/app.js -> /var/www/assets/js/app.js
    }
}

# alias与正则location配合使用
server {
    location ~ ^/download/(.*)$ {
        alias /data/files/$1;
        # /download/report.pdf -> /data/files/report.pdf
    }
}

# 使用场景：
# - root：URL路径与文件系统路径结构一致时使用
# - alias：URL路径与文件系统路径不一致时使用
```

### 5.4 index指令

```nginx
# 语法
index file ...;

# 示例
server {
    root /var/www/html;
    index index.html index.htm index.php;
    
    location / {
        # 访问 / 时，依次查找：
        # /var/www/html/index.html
        # /var/www/html/index.htm
        # /var/www/html/index.php
    }
}

# 配合autoindex使用
location /downloads/ {
    autoindex on;                    # 启用目录列表
    autoindex_exact_size off;        # 显示文件大小（KB/MB）
    autoindex_localtime on;          # 显示本地时间
    autoindex_format html;           # 输出格式：html, xml, json
}
```

### 5.5 try_files指令

```nginx
# 语法
try_files file ... uri;
try_files file ... =code;

# 基本示例
location / {
    try_files $uri $uri/ /index.html;
    # 依次尝试：
    # 1. $uri - 请求的文件
    # 2. $uri/ - 请求的目录
    # 3. /index.html - 最终回退
}

# SPA单页应用配置
location / {
    try_files $uri $uri/ /index.html;
}

# 返回404
location / {
    try_files $uri $uri/ =404;
}

# 配合命名location
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://backend_server;
}

# 检查文件存在性
location /images/ {
    try_files $uri $uri/ /images/default.png;
}

# 使用场景：
# - SPA应用路由支持
# - 静态文件优先，回退到动态处理
# - 图片/资源不存在时显示默认图片
```

---

## 6. Location匹配规则

### 6.1 Location语法

```nginx
# 语法
location [ = | ~ | ~* | ^~ ] uri { ... }
location @name { ... }

# 匹配修饰符：
# (无)    - 前缀匹配
# =       - 精确匹配
# ~       - 正则匹配（区分大小写）
# ~*      - 正则匹配（不区分大小写）
# ^~      - 前缀匹配，匹配后不再检查正则
# @       - 命名location，用于内部重定向
```

### 6.2 各类型Location示例

```nginx
# 1. 精确匹配 (=)
location = / {
    # 只匹配 / 请求
    return 200 "exact match /";
}

location = /login {
    # 只匹配 /login，不匹配 /login/ 或 /login/page
    proxy_pass http://auth_server;
}

# 2. 前缀匹配 (无修饰符)
location /api/ {
    # 匹配以 /api/ 开头的请求
    # /api/users, /api/posts 等
    proxy_pass http://backend;
}

location /static/ {
    # 匹配 /static/*, /static/js/app.js 等
    root /var/www;
}

# 3. 优先前缀匹配 (^~)
location ^~ /images/ {
    # 匹配以 /images/ 开头的请求
    # 匹配后不再检查正则location
    root /data;
}

# 4. 正则匹配 - 区分大小写 (~)
location ~ \.php$ {
    # 匹配以 .php 结尾的请求
    fastcgi_pass unix:/run/php/php-fpm.sock;
}

location ~ /api/v[0-9]+/ {
    # 匹配 /api/v1/, /api/v2/ 等
    proxy_pass http://api_server;
}

# 5. 正则匹配 - 不区分大小写 (~*)
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    # 匹配静态资源文件（不区分大小写）
    # .JPG, .Jpg, .jpg 都匹配
    expires 30d;
    add_header Cache-Control "public";
}

location ~* ^/download/.*\.(pdf|doc|docx)$ {
    # 匹配下载文件
    root /data;
}

# 6. 命名location (@)
location / {
    try_files $uri $uri/ @fallback;
}

location @fallback {
    # 内部重定向目标
    proxy_pass http://backend;
}

# 错误页面处理
error_page 404 @not_found;
location @not_found {
    return 200 "Page not found";
}
```

### 6.3 匹配优先级

```nginx
# 匹配优先级（从高到低）：
# 1. = 精确匹配
# 2. ^~ 前缀匹配（匹配后停止搜索）
# 3. ~ 和 ~* 正则匹配（按配置文件中的顺序）
# 4. 普通前缀匹配（最长匹配优先）

server {
    # 优先级示例
    
    # 优先级1：精确匹配
    location = /exact {
        return 200 "1. exact match";
    }
    
    # 优先级2：^~ 前缀匹配
    location ^~ /static/ {
        return 200 "2. prefix match (no regex)";
    }
    
    # 优先级3：正则匹配
    location ~ /static/.*\.js$ {
        return 200 "3. regex match";
    }
    
    # 优先级4：普通前缀匹配
    location /static/special/ {
        return 200 "4. longer prefix match";
    }
    
    location /static/ {
        return 200 "4. shorter prefix match";
    }
}

# 测试结果：
# /exact           -> 1. exact match
# /exact/          -> 4. shorter prefix match (不是精确匹配)
# /static/app.js   -> 2. prefix match (^~阻止了正则匹配)
# /other/app.js    -> 3. regex match (如果匹配的话)
```

### 6.4 Location嵌套

```nginx
# Nginx不支持真正的嵌套location，但可以通过配置实现类似效果

server {
    location /api/ {
        # /api/* 的通用配置
        proxy_set_header Host $host;
        
        location /api/v1/ {
            proxy_pass http://api_v1;
        }
        
        location /api/v2/ {
            proxy_pass http://api_v2;
        }
    }
}
```

### 6.5 常见Location配置模式

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    
    # 首页精确匹配
    location = / {
        index index.html;
    }
    
    # favicon不记录日志
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
    
    # robots.txt
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }
    
    # 静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 7. 反向代理配置

### 7.1 基本反向代理

```nginx
# proxy_pass基本用法
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
}

# 注意proxy_pass末尾斜杠的区别：
# 有斜杠：替换匹配的location路径
location /api/ {
    proxy_pass http://backend/;
    # /api/users -> http://backend/users
}

# 无斜杠：保留匹配的location路径
location /api/ {
    proxy_pass http://backend;
    # /api/users -> http://backend/api/users
}
```

### 7.2 完整反向代理配置

```nginx
upstream backend_servers {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        # 代理目标
        proxy_pass http://backend_servers;
        
        # HTTP版本
        proxy_http_version 1.1;
        
        # 请求头设置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲区设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 16k;
        proxy_busy_buffers_size 24k;
        
        # 临时文件设置
        proxy_temp_file_write_size 64k;
        proxy_max_temp_file_size 1024m;
        
        # 错误处理
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_next_upstream_timeout 10s;
        proxy_next_upstream_tries 3;
        
        # 缓存绕过
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.3 WebSocket代理

```nginx
# WebSocket专用配置
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name ws.example.com;
    
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # WebSocket必需的头
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        
        # 其他请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 超时设置（WebSocket需要较长超时）
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        
        # 关闭缓冲
        proxy_buffering off;
    }
}
```

### 7.4 gRPC代理

```nginx
server {
    listen 443 ssl http2;
    server_name grpc.example.com;
    
    ssl_certificate /etc/ssl/certs/server.crt;
    ssl_certificate_key /etc/ssl/private/server.key;
    
    location / {
        grpc_pass grpc://127.0.0.1:50051;
        
        # 错误处理
        error_page 502 = /error502grpc;
    }
    
    location = /error502grpc {
        internal;
        default_type application/grpc;
        add_header grpc-status 14;
        add_header content-length 0;
        return 204;
    }
}
```

### 7.5 代理缓存配置

```nginx
# 定义缓存区域
proxy_cache_path /var/cache/nginx 
    levels=1:2 
    keys_zone=my_cache:100m 
    max_size=10g 
    inactive=60m 
    use_temp_path=off;

server {
    listen 80;
    server_name example.com;
    
    location /api/ {
        proxy_pass http://backend;
        
        # 启用缓存
        proxy_cache my_cache;
        
        # 缓存键
        proxy_cache_key "$scheme$request_method$host$request_uri";
        
        # 缓存有效期
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_valid any 5m;
        
        # 缓存条件
        proxy_cache_min_uses 3;
        
        # 缓存状态头
        add_header X-Cache-Status $upstream_cache_status;
        
        # 缓存绕过
        proxy_cache_bypass $http_pragma $http_authorization;
        proxy_no_cache $http_pragma $http_authorization;
        
        # 后台更新
        proxy_cache_background_update on;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        
        # 缓存锁
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
    }
}
```

---

## 8. 负载均衡配置

### 8.1 upstream基本配置

```nginx
# 基本upstream
upstream backend {
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
    server 192.168.1.103:8080;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### 8.2 负载均衡策略

```nginx
# 1. 轮询（默认）
# 按顺序依次分配请求
upstream backend_round_robin {
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
    server 192.168.1.103:8080;
}

# 2. 权重（weight）
# 根据权重分配请求比例
upstream backend_weight {
    server 192.168.1.101:8080 weight=5;  # 50%请求
    server 192.168.1.102:8080 weight=3;  # 30%请求
    server 192.168.1.103:8080 weight=2;  # 20%请求
}

# 3. IP Hash
# 相同IP的请求分配到相同服务器，实现会话保持
upstream backend_ip_hash {
    ip_hash;
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
    server 192.168.1.103:8080;
}

# 4. 最少连接（least_conn）
# 分配给当前连接数最少的服务器
upstream backend_least_conn {
    least_conn;
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
    server 192.168.1.103:8080;
}

# 5. URL Hash（需要第三方模块或Nginx Plus）
upstream backend_url_hash {
    hash $request_uri consistent;
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
    server 192.168.1.103:8080;
}

# 6. 随机（random）
upstream backend_random {
    random two least_conn;  # 随机选两个，取连接少的
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
    server 192.168.1.103:8080;
}
```

### 8.3 服务器状态参数

```nginx
upstream backend {
    # weight: 权重，默认为1
    server 192.168.1.101:8080 weight=5;
    
    # max_conns: 最大并发连接数
    server 192.168.1.102:8080 max_conns=1000;
    
    # max_fails和fail_timeout: 健康检查
    # max_fails次失败后，在fail_timeout时间内不再使用该服务器
    server 192.168.1.103:8080 max_fails=3 fail_timeout=30s;
    
    # backup: 备用服务器，当主服务器都不可用时启用
    server 192.168.1.104:8080 backup;
    
    # down: 标记服务器为不可用
    server 192.168.1.105:8080 down;
    
    # slow_start: 慢启动（Nginx Plus）
    # server 192.168.1.106:8080 slow_start=30s;
}
```

### 8.4 健康检查配置

```nginx
# 被动健康检查（社区版）
upstream backend {
    server 192.168.1.101:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.102:8080 max_fails=3 fail_timeout=30s;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        proxy_next_upstream_timeout 10s;
        proxy_next_upstream_tries 3;
    }
}

# 主动健康检查（需要Nginx Plus或第三方模块）
# upstream backend {
#     zone backend 64k;
#     server 192.168.1.101:8080;
#     server 192.168.1.102:8080;
#     
#     health_check interval=5s fails=3 passes=2;
# }
```

### 8.5 会话保持

```nginx
# 方法1：IP Hash
upstream backend {
    ip_hash;
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
}

# 方法2：Cookie（需要sticky模块或Nginx Plus）
# upstream backend {
#     sticky cookie srv_id expires=1h domain=.example.com path=/;
#     server 192.168.1.101:8080;
#     server 192.168.1.102:8080;
# }

# 方法3：基于请求头的hash
upstream backend {
    hash $http_x_session_id consistent;
    server 192.168.1.101:8080;
    server 192.168.1.102:8080;
}
```

---

## 9. 静态资源服务

### 9.1 基本静态文件服务

```nginx
server {
    listen 80;
    server_name static.example.com;
    root /var/www/static;
    
    # 单页应用
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源
    location /assets/ {
        # 开启sendfile
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        
        # 缓存控制
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # 关闭访问日志
        access_log off;
    }
}
```

### 9.2 文件下载服务

```nginx
server {
    listen 80;
    server_name download.example.com;
    
    location /downloads/ {
        alias /data/files/;
        
        # 目录列表
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
        
        # 下载限速（每秒100KB）
        limit_rate 100k;
        
        # 下载限速（前10MB不限速）
        limit_rate_after 10m;
        
        # 允许断点续传
        # 这是默认行为，支持Range请求
    }
    
    # 强制下载而非预览
    location /force-download/ {
        alias /data/files/;
        add_header Content-Disposition "attachment";
    }
}
```

### 9.3 图片处理（需要image_filter模块）

```nginx
# 需要安装 nginx-module-image-filter
# apt install libnginx-mod-image-filter

server {
    listen 80;
    server_name images.example.com;
    
    location /thumbnails/ {
        alias /data/images/;
        
        # 生成缩略图
        image_filter resize 150 100;
        image_filter_jpeg_quality 75;
        image_filter_buffer 10M;
    }
    
    location /crop/ {
        alias /data/images/;
        
        # 裁剪图片
        image_filter crop 200 200;
        image_filter_jpeg_quality 80;
    }
    
    location ~ ^/resize/(\d+)x(\d+)/(.+)$ {
        alias /data/images/$3;
        
        # 动态调整大小
        image_filter resize $1 $2;
        image_filter_buffer 10M;
    }
}
```

### 9.4 防盗链配置

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    location ~* \.(jpg|jpeg|png|gif|bmp|webp)$ {
        # 有效的referer
        valid_referers none blocked 
            server_names 
            *.example.com 
            ~\.google\. 
            ~\.baidu\.;
        
        # 无效referer时返回403
        if ($invalid_referer) {
            return 403;
            # 或者返回一个默认图片
            # rewrite ^/ /images/forbidden.png break;
        }
        
        root /var/www/static;
        expires 30d;
    }
}

# 更严格的防盗链
server {
    location /protected/ {
        # 只允许特定域名
        valid_referers server_names www.example.com api.example.com;
        
        if ($invalid_referer) {
            return 403;
        }
        
        # 空referer也禁止
        if ($http_referer = "") {
            return 403;
        }
        
        root /var/www;
    }
}
```

### 9.5 跨域资源配置

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    # 通用CORS配置
    location /api/ {
        # 允许的域名
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Max-Age 86400 always;
        
        # 预检请求
        if ($request_method = OPTIONS) {
            return 204;
        }
        
        proxy_pass http://backend;
    }
}

# 使用map实现动态CORS
map $http_origin $cors_origin {
    default "";
    "~^https?://.*\.example\.com$" $http_origin;
    "https://trusted-site.com" $http_origin;
}

server {
    location /api/ {
        add_header Access-Control-Allow-Origin $cors_origin always;
        # ...其他CORS头
    }
}
```

---

## 10. 缓存配置

### 10.1 浏览器缓存（expires）

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    
    # 使用expires指令
    location ~* \.(jpg|jpeg|png|gif|ico)$ {
        expires 30d;  # 30天
    }
    
    location ~* \.(css|js)$ {
        expires 7d;   # 7天
    }
    
    location ~* \.(html|htm)$ {
        expires -1;   # 不缓存
        # 或
        # add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # expires的各种值
    location /examples/ {
        # 时间单位
        expires 30d;      # 30天
        expires 24h;      # 24小时
        expires 1M;       # 1个月
        expires 1y;       # 1年
        
        # 特殊值
        expires max;      # 最大缓存时间（10年）
        expires off;      # 关闭expires（不添加头）
        expires -1;       # 设为过期（不缓存）
        expires epoch;    # 设为1970年（不缓存）
        
        # 修改时间
        expires modified +24h;  # 基于文件修改时间
    }
}
```

### 10.2 Cache-Control配置

```nginx
server {
    # 不可变资源（带hash的静态文件）
    location ~* \.[a-f0-9]{8}\.(js|css|png|jpg|gif|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 可能更新的资源
    location ~* \.(js|css)$ {
        expires 7d;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # API响应
    location /api/ {
        add_header Cache-Control "no-store";
        proxy_pass http://backend;
    }
    
    # 私有数据
    location /user/ {
        add_header Cache-Control "private, no-cache";
        proxy_pass http://backend;
    }
    
    # HTML文件
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
        # 允许验证缓存，但每次都要验证
    }
}
```

### 10.3 ETag和Last-Modified

```nginx
http {
    # 启用ETag
    etag on;
    
    # 启用Last-Modified（默认开启）
    # 基于文件的mtime
    
    server {
        location /static/ {
            root /var/www;
            
            # ETag默认启用
            etag on;
            
            # 如需关闭
            # etag off;
        }
        
        # 对于动态内容关闭ETag
        location /api/ {
            etag off;
            proxy_pass http://backend;
        }
    }
}
```

### 10.4 代理缓存配置

```nginx
# 在http块定义缓存区域
http {
    # 定义缓存路径
    proxy_cache_path /var/cache/nginx/proxy 
        levels=1:2                    # 目录层级
        keys_zone=proxy_cache:100m    # 缓存键区域
        max_size=10g                  # 最大缓存大小
        inactive=60m                  # 非活动过期时间
        use_temp_path=off;            # 不使用临时路径
    
    # 定义多个缓存区域
    proxy_cache_path /var/cache/nginx/api 
        keys_zone=api_cache:50m 
        max_size=5g 
        inactive=30m;
    
    proxy_cache_path /var/cache/nginx/static 
        keys_zone=static_cache:100m 
        max_size=20g 
        inactive=7d;
    
    server {
        # API缓存
        location /api/ {
            proxy_pass http://backend;
            
            proxy_cache api_cache;
            proxy_cache_key "$host$request_uri";
            proxy_cache_valid 200 10m;
            proxy_cache_valid 404 1m;
            
            # 缓存状态头
            add_header X-Cache-Status $upstream_cache_status;
        }
        
        # 静态资源缓存
        location /static/ {
            proxy_pass http://static_backend;
            
            proxy_cache static_cache;
            proxy_cache_valid 200 7d;
            
            # 忽略后端缓存头
            proxy_ignore_headers Cache-Control Expires;
        }
    }
}
```

### 10.5 FastCGI缓存

```nginx
http {
    # FastCGI缓存路径
    fastcgi_cache_path /var/cache/nginx/fastcgi 
        levels=1:2 
        keys_zone=fastcgi_cache:100m 
        max_size=10g 
        inactive=60m;
    
    server {
        location ~ \.php$ {
            fastcgi_pass unix:/run/php/php-fpm.sock;
            fastcgi_index index.php;
            include fastcgi_params;
            
            # 启用缓存
            fastcgi_cache fastcgi_cache;
            fastcgi_cache_key "$scheme$request_method$host$request_uri";
            fastcgi_cache_valid 200 60m;
            fastcgi_cache_valid 404 10m;
            
            # 缓存绕过条件
            fastcgi_cache_bypass $http_pragma $http_authorization;
            fastcgi_no_cache $http_pragma $http_authorization;
            
            # 后台更新
            fastcgi_cache_background_update on;
            fastcgi_cache_use_stale error timeout updating http_500;
            
            # 缓存状态
            add_header X-FastCGI-Cache $upstream_cache_status;
        }
    }
}
```

---

## 11. Gzip压缩配置

### 11.1 基本Gzip配置

```nginx
http {
    # 启用gzip
    gzip on;
    
    # 压缩级别（1-9，推荐4-6）
    gzip_comp_level 5;
    
    # 最小压缩文件大小
    gzip_min_length 1024;
    
    # 压缩缓冲区
    gzip_buffers 16 8k;
    
    # HTTP版本
    gzip_http_version 1.1;
    
    # 压缩的MIME类型
    gzip_types 
        text/plain 
        text/css 
        text/xml 
        text/javascript 
        application/json 
        application/javascript 
        application/xml 
        application/xml+rss 
        application/x-javascript
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype
        image/svg+xml
        image/x-icon;
    
    # 代理请求也压缩
    gzip_proxied any;
    
    # 添加Vary头
    gzip_vary on;
    
    # 禁用IE6的gzip
    gzip_disable "MSIE [1-6]\.";
}
```

### 11.2 静态Gzip（预压缩）

```nginx
http {
    # 启用静态gzip
    gzip_static on;
    
    # 配合动态gzip使用
    gzip on;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/javascript;
    
    server {
        location /static/ {
            # 优先使用预压缩文件
            # 如果存在app.js.gz，直接返回而不是动态压缩app.js
            gzip_static on;
            
            # 如果没有.gz文件，则动态压缩
            gzip on;
        }
    }
}

# 预压缩文件生成脚本
# find /var/www/static -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec gzip -k {} \;
```

### 11.3 Brotli压缩（需要模块）

```nginx
# 需要安装brotli模块
# apt install libnginx-mod-brotli

http {
    # Brotli配置
    brotli on;
    brotli_comp_level 6;
    brotli_types 
        text/plain 
        text/css 
        text/xml 
        application/json 
        application/javascript 
        application/xml 
        image/svg+xml;
    
    # 静态Brotli
    brotli_static on;
    
    # 同时保留gzip作为回退
    gzip on;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/javascript;
}
```

---

## 12. SSL/HTTPS配置

### 12.1 基本HTTPS配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书文件
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    
    # SSL会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # 协议版本
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 加密套件
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # DH参数
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    
    root /var/www/html;
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 12.2 安全加固配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书配置
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/ssl/certs/ca-bundle.crt;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # HSTS（强制HTTPS）
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # 其他安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 内容安全策略
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
}
```

### 12.3 Let's Encrypt配置

```nginx
# 用于证书验证的配置
server {
    listen 80;
    server_name example.com;
    
    # Let's Encrypt验证目录
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    
    # 其他请求重定向到HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS服务器
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # Let's Encrypt证书
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # 包含推荐的SSL配置
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    root /var/www/html;
}

# 证书申请命令
# certbot certonly --webroot -w /var/www/letsencrypt -d example.com -d www.example.com

# 自动续期
# certbot renew --dry-run
# crontab: 0 0 * * * certbot renew --quiet --post-hook "nginx -s reload"
```

### 12.4 双向SSL认证（mTLS）

```nginx
server {
    listen 443 ssl http2;
    server_name secure.example.com;
    
    # 服务器证书
    ssl_certificate /etc/ssl/certs/server.crt;
    ssl_certificate_key /etc/ssl/private/server.key;
    
    # 客户端证书验证
    ssl_client_certificate /etc/ssl/certs/ca.crt;
    ssl_verify_client on;
    ssl_verify_depth 2;
    
    # 将客户端证书信息传递给后端
    location / {
        proxy_pass http://backend;
        proxy_set_header X-SSL-Client-Cert $ssl_client_cert;
        proxy_set_header X-SSL-Client-S-DN $ssl_client_s_dn;
        proxy_set_header X-SSL-Client-Verify $ssl_client_verify;
    }
}
```

---

## 13. 日志配置

### 13.1 访问日志格式

```nginx
http {
    # 默认日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 详细日志格式
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time '
                        '$pipe $connection $connection_requests';
    
    # JSON格式日志
    log_format json_combined escape=json '{'
        '"time_local":"$time_local",'
        '"remote_addr":"$remote_addr",'
        '"remote_user":"$remote_user",'
        '"request":"$request",'
        '"status":"$status",'
        '"body_bytes_sent":"$body_bytes_sent",'
        '"request_time":"$request_time",'
        '"http_referrer":"$http_referer",'
        '"http_user_agent":"$http_user_agent",'
        '"http_x_forwarded_for":"$http_x_forwarded_for"'
    '}';
    
    # 性能分析日志
    log_format performance '$remote_addr - [$time_local] '
                           '"$request" $status '
                           'rt=$request_time uct=$upstream_connect_time '
                           'uht=$upstream_header_time urt=$upstream_response_time';
    
    # 使用日志格式
    access_log /var/log/nginx/access.log main;
    access_log /var/log/nginx/access.json json_combined;
}
```

### 13.2 条件日志

```nginx
http {
    # 定义不记录的条件
    map $status $loggable {
        ~^[23]  0;
        default 1;
    }
    
    # 只记录错误请求
    access_log /var/log/nginx/error_access.log main if=$loggable;
    
    # 排除健康检查
    map $request_uri $not_health_check {
        /health 0;
        /ping   0;
        default 1;
    }
    
    server {
        access_log /var/log/nginx/access.log main if=$not_health_check;
    }
    
    # 排除静态资源
    map $request_uri $not_static {
        ~*\.(js|css|png|jpg|gif|ico)$ 0;
        default 1;
    }
    
    server {
        access_log /var/log/nginx/access.log main if=$not_static;
    }
}
```

### 13.3 日志缓冲和压缩

```nginx
http {
    # 日志缓冲
    access_log /var/log/nginx/access.log main buffer=32k flush=5s;
    
    # 日志压缩（需要配合logrotate）
    access_log /var/log/nginx/access.log.gz main gzip=9 buffer=32k flush=5s;
    
    # 按虚拟主机分离日志
    server {
        server_name example.com;
        access_log /var/log/nginx/example.com.access.log main;
        error_log /var/log/nginx/example.com.error.log warn;
    }
}

# logrotate配置 (/etc/logrotate.d/nginx)
# /var/log/nginx/*.log {
#     daily
#     missingok
#     rotate 14
#     compress
#     delaycompress
#     notifempty
#     create 0640 www-data adm
#     sharedscripts
#     postrotate
#         [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
#     endscript
# }
```

### 13.4 错误日志配置

```nginx
# 全局错误日志
error_log /var/log/nginx/error.log warn;

# 不同级别的错误日志
error_log /var/log/nginx/error.log error;      # 只记录error及以上
error_log /var/log/nginx/debug.log debug;      # 记录所有debug信息

# 按虚拟主机分离
server {
    server_name example.com;
    error_log /var/log/nginx/example.com.error.log warn;
}

# 关闭错误日志
error_log /dev/null crit;
```

---

## 14. 安全配置

### 14.1 基本安全配置

```nginx
http {
    # 隐藏Nginx版本
    server_tokens off;
    
    # 限制请求体大小
    client_max_body_size 10m;
    
    # 限制请求头大小
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    server {
        # 禁止不安全的HTTP方法
        if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$) {
            return 405;
        }
        
        # 禁止访问隐藏文件
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }
        
        # 禁止访问敏感文件
        location ~* \.(env|git|svn|htaccess|htpasswd|ini|log|sh|sql|bak|swp)$ {
            deny all;
        }
        
        # 安全响应头
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

### 14.2 访问控制

```nginx
server {
    # 基于IP的访问控制
    location /admin/ {
        allow 192.168.1.0/24;
        allow 10.0.0.0/8;
        deny all;
    }
    
    # 密码保护
    location /protected/ {
        auth_basic "Restricted Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
    
    # IP + 密码双重验证
    location /secure/ {
        satisfy all;
        
        allow 192.168.1.0/24;
        deny all;
        
        auth_basic "Secure Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
    
    # 任一条件满足即可（satisfy any）
    location /mixed/ {
        satisfy any;
        
        allow 192.168.1.0/24;
        deny all;
        
        auth_basic "Mixed Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}

# 生成密码文件
# htpasswd -c /etc/nginx/.htpasswd username
# 或使用openssl
# echo "username:$(openssl passwd -apr1 password)" >> /etc/nginx/.htpasswd
```

### 14.3 请求限制

```nginx
http {
    # 定义限制区域
    # 基于IP的请求频率限制
    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;
    
    # 基于IP的连接数限制
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
    # 基于服务器的连接数限制
    limit_conn_zone $server_name zone=server_limit:10m;
    
    server {
        # 应用请求频率限制
        location /api/ {
            limit_req zone=req_limit burst=20 nodelay;
            # rate=10r/s: 每秒10个请求
            # burst=20: 允许突发20个请求
            # nodelay: 突发请求不延迟处理
            
            proxy_pass http://backend;
        }
        
        # 应用连接数限制
        location /download/ {
            limit_conn conn_limit 5;      # 每IP最多5个连接
            limit_conn server_limit 100;  # 服务器总共100个连接
            limit_rate 100k;              # 每连接限速100KB/s
            
            alias /data/files/;
        }
        
        # 限制错误响应
        limit_req_status 429;
        limit_conn_status 429;
        
        # 自定义错误页
        error_page 429 /429.html;
    }
}
```

### 14.4 防止常见攻击

```nginx
http {
    # 防止点击劫持
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # 防止MIME类型嗅探
    add_header X-Content-Type-Options "nosniff" always;
    
    # XSS保护
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 内容安全策略
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;" always;
    
    server {
        # 防止SQL注入（基本过滤）
        set $block_sql_injections 0;
        if ($query_string ~ "union.*select.*\(") { set $block_sql_injections 1; }
        if ($query_string ~ "concat.*\(") { set $block_sql_injections 1; }
        if ($block_sql_injections = 1) { return 403; }
        
        # 防止目录遍历
        if ($request_uri ~* "\.\.") { return 403; }
        
        # 防止敏感信息泄露
        location ~* (\.git|\.svn|\.env|\.htaccess|composer\.(json|lock)|package\.json|package-lock\.json) {
            deny all;
        }
        
        # 限制请求方法
        if ($request_method !~ ^(GET|HEAD|POST)$) {
            return 405;
        }
    }
}
```

---

## 15. 性能优化配置

### 15.1 工作进程优化

```nginx
# 工作进程数（通常等于CPU核心数）
worker_processes auto;

# 绑定工作进程到CPU核心
worker_cpu_affinity auto;
# 或手动指定
# worker_cpu_affinity 0001 0010 0100 1000;

# 工作进程优先级
worker_priority -10;

# 文件描述符限制
worker_rlimit_nofile 65535;

events {
    # 每个工作进程的最大连接数
    worker_connections 4096;
    
    # 使用epoll事件模型
    use epoll;
    
    # 批量接受连接
    multi_accept on;
    
    # 关闭连接互斥锁（高并发下）
    accept_mutex off;
}
```

### 15.2 连接优化

```nginx
http {
    # 保持连接
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # 发送文件优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 请求体处理
    client_body_buffer_size 128k;
    client_max_body_size 100m;
    
    # 响应输出缓冲
    output_buffers 2 32k;
    postpone_output 1460;
    
    # 超时设置
    client_body_timeout 60s;
    client_header_timeout 60s;
    send_timeout 60s;
    
    # 重置超时连接
    reset_timedout_connection on;
    
    # 代理优化
    upstream backend {
        server 127.0.0.1:3000;
        
        # 保持与后端的长连接
        keepalive 32;
        keepalive_timeout 60s;
        keepalive_requests 100;
    }
    
    server {
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }
}
```

### 15.3 缓冲区优化

```nginx
http {
    # 代理缓冲区
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 16k;
    proxy_busy_buffers_size 24k;
    proxy_temp_file_write_size 64k;
    
    # FastCGI缓冲区
    fastcgi_buffering on;
    fastcgi_buffer_size 4k;
    fastcgi_buffers 8 16k;
    fastcgi_busy_buffers_size 24k;
    
    # 请求头缓冲区
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    # 哈希表优化
    types_hash_max_size 2048;
    types_hash_bucket_size 64;
    server_names_hash_bucket_size 64;
    server_names_hash_max_size 512;
    variables_hash_max_size 2048;
    variables_hash_bucket_size 64;
}
```

### 15.4 open_file_cache优化

```nginx
http {
    # 打开文件缓存
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # max: 缓存的最大文件数
    # inactive: 多长时间未访问则移除
    # valid: 多长时间检查一次有效性
    # min_uses: 缓存前的最小访问次数
    # errors: 是否缓存文件错误信息
}
```

### 15.5 完整性能优化配置

```nginx
user nginx;
worker_processes auto;
worker_cpu_affinity auto;
worker_priority -10;
worker_rlimit_nofile 65535;

error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
    accept_mutex off;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    charset utf-8;
    
    # 日志
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" $request_time';
    access_log /var/log/nginx/access.log main buffer=32k flush=5s;
    
    # 基本优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    server_tokens off;
    
    # 连接
    keepalive_timeout 65;
    keepalive_requests 1000;
    reset_timedout_connection on;
    
    # 超时
    client_body_timeout 60s;
    client_header_timeout 60s;
    send_timeout 60s;
    
    # 请求体
    client_body_buffer_size 128k;
    client_max_body_size 100m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    # 压缩
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # 文件缓存
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # 代理缓冲
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 16k;
    proxy_busy_buffers_size 24k;
    
    include /etc/nginx/conf.d/*.conf;
}
```

---

## 16. Rewrite重写规则

### 16.1 rewrite指令语法

```nginx
# 语法
rewrite regex replacement [flag];

# flag选项：
# last      - 停止当前rewrite，重新开始location匹配
# break     - 停止当前rewrite，继续处理请求
# redirect  - 返回302临时重定向
# permanent - 返回301永久重定向
```

### 16.2 基本重写示例

```nginx
server {
    # 简单重写
    rewrite ^/old-page$ /new-page permanent;
    
    # 目录重写
    rewrite ^/blog/(.*)$ /articles/$1 last;
    
    # 添加尾部斜杠
    rewrite ^([^.]*[^/])$ $1/ permanent;
    
    # 移除尾部斜杠
    rewrite ^/(.*)/$ /$1 permanent;
    
    # 移除index.html
    rewrite ^(.*)index\.html$ $1 permanent;
    
    # 强制www
    server_name example.com;
    rewrite ^(.*)$ https://www.example.com$1 permanent;
    
    # 移除www
    server_name www.example.com;
    rewrite ^(.*)$ https://example.com$1 permanent;
}
```

### 16.3 条件重写

```nginx
server {
    # 使用if条件
    if ($host ~* ^www\.(.+)$) {
        set $domain $1;
        rewrite ^(.*)$ https://$domain$1 permanent;
    }
    
    # 根据User-Agent重写
    if ($http_user_agent ~* "mobile|android|iphone") {
        rewrite ^/(.*)$ /mobile/$1 last;
    }
    
    # 根据请求方法
    if ($request_method = POST) {
        return 405;
    }
    
    # 根据参数
    if ($arg_redirect) {
        rewrite ^/(.*)$ $arg_redirect redirect;
    }
    
    # 空referer处理
    if ($http_referer = "") {
        rewrite ^/images/(.*)$ /images/placeholder.png last;
    }
}
```

### 16.4 复杂重写场景

```nginx
server {
    # URL小写转换
    location / {
        rewrite ^(.*)$ $1 break;
        if ($uri ~ [A-Z]) {
            rewrite ^(.*)$ /lowercase$uri last;
        }
    }
    
    # SEO友好URL
    # /product/123 -> /product.php?id=123
    rewrite ^/product/(\d+)$ /product.php?id=$1 last;
    
    # /category/electronics/phones -> /category.php?cat=electronics&sub=phones
    rewrite ^/category/([^/]+)/([^/]+)$ /category.php?cat=$1&sub=$2 last;
    
    # 多语言支持
    # /en/about -> /about?lang=en
    rewrite ^/(en|zh|ja|ko)/(.*)$ /$2?lang=$1 last;
    
    # 版本化API
    # /api/v1/users -> /api/users?version=1
    rewrite ^/api/v(\d+)/(.*)$ /api/$2?version=$1 last;
}
```

### 16.5 return指令

```nginx
server {
    # 返回状态码
    location /old/ {
        return 301 https://example.com/new/;
    }
    
    # 返回文本
    location /health {
        return 200 "OK";
    }
    
    # 返回JSON
    location /status {
        default_type application/json;
        return 200 '{"status":"running","time":"$time_iso8601"}';
    }
    
    # 关闭连接
    location /ignore {
        return 444;
    }
    
    # 根据条件返回
    if ($request_method = OPTIONS) {
        return 204;
    }
}
```

### 16.6 map指令

```nginx
http {
    # 基本map
    map $uri $new_uri {
        default         $uri;
        /old-page       /new-page;
        /about-us       /about;
        ~^/blog/(.*)$   /articles/$1;
    }
    
    # 根据Host映射
    map $host $backend {
        default         http://default_backend;
        api.example.com http://api_backend;
        app.example.com http://app_backend;
    }
    
    # 根据User-Agent
    map $http_user_agent $is_mobile {
        default         0;
        ~*mobile        1;
        ~*android       1;
        ~*iphone        1;
    }
    
    # 组合条件
    map "$host:$request_method" $rate_limit_key {
        default                    $binary_remote_addr;
        "api.example.com:POST"     $binary_remote_addr$uri;
        "api.example.com:GET"      "";
    }
    
    server {
        location / {
            # 使用映射值
            if ($new_uri != $uri) {
                return 301 $new_uri;
            }
            
            proxy_pass $backend;
        }
        
        location /mobile-check/ {
            if ($is_mobile) {
                return 302 /mobile/;
            }
        }
    }
}
```

---

## 17. 常用变量

### 17.1 请求相关变量

```nginx
# 请求行
$request              # 完整请求行 "GET /path HTTP/1.1"
$request_method       # 请求方法 GET, POST, etc.
$request_uri          # 原始请求URI（带参数）
$uri                  # 当前URI（不带参数，可能被rewrite修改）
$document_uri         # 同$uri
$args                 # 查询字符串
$query_string         # 同$args
$is_args              # 如果有参数则为"?"，否则为空
$arg_name             # 获取指定参数，如$arg_id获取id参数

# 请求头
$http_host            # Host头
$http_user_agent      # User-Agent头
$http_referer         # Referer头
$http_cookie          # Cookie头
$http_xxx             # 任意请求头，xxx为头名称（小写，-替换为_）

# 内容
$content_type         # Content-Type头
$content_length       # Content-Length头
$request_body         # 请求体
$request_body_file    # 请求体临时文件
```

### 17.2 服务器相关变量

```nginx
# 服务器信息
$server_name          # 匹配的server_name
$server_addr          # 服务器IP地址
$server_port          # 服务器端口
$server_protocol      # HTTP协议版本

# Nginx信息
$nginx_version        # Nginx版本
$pid                  # 工作进程ID
$hostname             # 服务器主机名

# 连接信息
$connection           # 连接序列号
$connection_requests  # 当前连接的请求数
```

### 17.3 客户端相关变量

```nginx
# 客户端信息
$remote_addr          # 客户端IP
$remote_port          # 客户端端口
$remote_user          # 基本认证的用户名

# 二进制格式IP（用于限流）
$binary_remote_addr   # 客户端IP的二进制格式

# 代理相关
$proxy_add_x_forwarded_for  # 原有X-Forwarded-For + 客户端IP
$realip_remote_addr         # 使用realip模块时的原始地址
```

### 17.4 时间相关变量

```nginx
# 时间格式
$time_local           # 本地时间 "05/Feb/2024:10:30:00 +0800"
$time_iso8601         # ISO 8601格式 "2024-02-05T10:30:00+08:00"
$msec                 # Unix时间戳（毫秒精度）

# 请求时间
$request_time         # 请求处理时间（秒）
$upstream_response_time      # 上游响应时间
$upstream_connect_time       # 上游连接时间
$upstream_header_time        # 上游响应头时间
```

### 17.5 响应相关变量

```nginx
# 响应状态
$status               # 响应状态码
$body_bytes_sent      # 发送的响应体大小
$bytes_sent           # 发送的总字节数

# 响应头
$sent_http_xxx        # 发送的响应头，如$sent_http_content_type

# 上游信息
$upstream_addr        # 上游服务器地址
$upstream_status      # 上游响应状态码
$upstream_cache_status # 缓存状态 HIT/MISS/EXPIRED/etc.
```

### 17.6 SSL相关变量

```nginx
# SSL信息
$ssl_protocol         # SSL协议版本
$ssl_cipher           # SSL加密套件
$ssl_session_id       # SSL会话ID
$ssl_session_reused   # SSL会话是否复用

# 客户端证书
$ssl_client_cert      # 客户端证书（PEM格式）
$ssl_client_s_dn      # 客户端证书主题DN
$ssl_client_i_dn      # 客户端证书颁发者DN
$ssl_client_verify    # 客户端证书验证结果

# HTTPS判断
$https                # "on" 或 空
$scheme               # "http" 或 "https"
```

### 17.7 变量使用示例

```nginx
http {
    # 日志中使用变量
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        'rt=$request_time ut=$upstream_response_time '
                        'cs=$upstream_cache_status';
    
    # map中使用变量
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }
    
    server {
        # 条件判断中使用变量
        if ($request_method = POST) {
            set $skip_cache 1;
        }
        
        # set设置自定义变量
        set $my_var "${remote_addr}_${request_uri}";
        
        # 响应头中使用变量
        add_header X-Request-ID $request_id;
        add_header X-Server-Addr $server_addr;
        
        # 代理头中使用变量
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Host $host;
        }
        
        # 缓存键中使用变量
        proxy_cache_key "$scheme$request_method$host$request_uri";
    }
}
```

---

## 18. 常见问题与解决方案

### 18.1 403 Forbidden

```nginx
# 原因1：权限问题
# 检查文件和目录权限
# chmod 755 /var/www/html
# chmod 644 /var/www/html/*
# chown -R nginx:nginx /var/www/html

# 原因2：目录索引缺失
server {
    location / {
        index index.html index.htm;
        # 或启用目录列表
        autoindex on;
    }
}

# 原因3：SELinux限制
# setsebool -P httpd_read_user_content 1
# setenforce 0  # 临时关闭

# 原因4：用户权限
user www-data;  # 确保用户有权访问文件
```

### 18.2 502 Bad Gateway

```nginx
# 原因1：后端服务未启动
# 检查后端服务状态

# 原因2：代理超时
location /api/ {
    proxy_pass http://backend;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
}

# 原因3：缓冲区过小
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;

# 原因4：FastCGI配置问题
location ~ \.php$ {
    fastcgi_pass unix:/run/php/php-fpm.sock;
    # 检查socket文件是否存在
    # 检查PHP-FPM是否运行
}
```

### 18.3 504 Gateway Timeout

```nginx
# 增加超时时间
location /api/ {
    proxy_pass http://backend;
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
    send_timeout 600s;
}

# FastCGI超时
location ~ \.php$ {
    fastcgi_connect_timeout 600s;
    fastcgi_send_timeout 600s;
    fastcgi_read_timeout 600s;
}
```

### 18.4 413 Request Entity Too Large

```nginx
# 增加请求体大小限制
http {
    client_max_body_size 100m;
}

# 或在server/location级别
server {
    client_max_body_size 100m;
    
    location /upload/ {
        client_max_body_size 500m;
    }
}
```

### 18.5 SPA路由404问题

```nginx
# Vue/React单页应用路由配置
server {
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源直接返回404
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        try_files $uri =404;
    }
}
```

### 18.6 跨域问题

```nginx
# CORS配置
location /api/ {
    # 允许的源
    add_header Access-Control-Allow-Origin $http_origin always;
    add_header Access-Control-Allow-Credentials true always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
    add_header Access-Control-Max-Age 86400 always;
    
    # 处理预检请求
    if ($request_method = OPTIONS) {
        return 204;
    }
    
    proxy_pass http://backend;
}
```

### 18.7 WebSocket连接问题

```nginx
# WebSocket代理配置
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    location /ws/ {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        
        # 超时设置
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

### 18.8 配置测试和调试

```bash
# 测试配置语法
nginx -t

# 显示完整配置
nginx -T

# 查看错误日志
tail -f /var/log/nginx/error.log

# 查看访问日志
tail -f /var/log/nginx/access.log

# 调试日志级别
error_log /var/log/nginx/error.log debug;

# 检查模块
nginx -V 2>&1 | grep -o 'with-[^ ]*'

# 检查进程
ps aux | grep nginx

# 检查端口
netstat -tlnp | grep nginx
ss -tlnp | grep nginx
```

---

## 附录：完整配置模板

### 生产环境nginx.conf

```nginx
user nginx;
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;
error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    charset utf-8;
    server_tokens off;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time ut=$upstream_response_time';

    access_log /var/log/nginx/access.log main buffer=32k flush=5s;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout 65;
    keepalive_requests 1000;

    client_max_body_size 100m;
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;

    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml
               application/xml+rss application/x-javascript
               image/svg+xml;

    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    include /etc/nginx/conf.d/*.conf;
}
```

### 前端项目配置模板

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name example.com www.example.com;
    root /var/www/html;

    # SSL
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HTTP重定向到HTTPS
    if ($scheme = http) {
        return 301 https://$server_name$request_uri;
    }

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }

    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

---

> 本文档涵盖了Nginx的核心配置和常用场景。实际使用时，请根据具体需求进行调整和优化。
