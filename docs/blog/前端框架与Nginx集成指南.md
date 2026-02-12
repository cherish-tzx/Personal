# 前端框架与Nginx集成指南

> Vue2、Vue3、Vue3+TypeScript、React项目的Nginx配置详解

<div class="doc-toc">

## 目录

1. [前端项目打包概述](#1-前端项目打包概述)
2. [Vue2项目Nginx配置](#2-vue2项目nginx配置)
3. [Vue3项目Nginx配置](#3-vue3项目nginx配置)
4. [Vue3+TypeScript项目Nginx配置](#4-vue3typescript项目nginx配置)
5. [React项目Nginx配置](#5-react项目nginx配置)
6. [通用配置与最佳实践](#6-通用配置与最佳实践)
7. [Docker部署配置](#7-docker部署配置)
8. [多环境配置](#8-多环境配置)
9. [微前端架构配置](#9-微前端架构配置)
10. [SSR应用配置](#10-ssr应用配置)

</div>

---

## 1. 前端项目打包概述

### 1.1 打包产物结构

```
dist/
├── index.html
├── favicon.ico
├── assets/
│   ├── js/
│   │   ├── app.a1b2c3d4.js
│   │   ├── chunk-vendors.e5f6g7h8.js
│   │   └── chunk-xxx.js
│   ├── css/
│   │   ├── app.i9j0k1l2.css
│   │   └── chunk-xxx.css
│   ├── fonts/
│   │   └── xxx.woff2
│   └── images/
│       └── logo.png
└── static/
    └── config.js
```

### 1.2 前端路由模式

```javascript
// Hash模式 - URL带#号
// http://example.com/#/about
// Nginx无需特殊配置

// History模式 - 干净的URL
// http://example.com/about
// Nginx需要配置try_files回退到index.html
```

### 1.3 构建命令

```bash
# Vue2 (vue-cli)
npm run build
# 输出目录：dist/

# Vue3 (vue-cli)
npm run build
# 输出目录：dist/

# Vue3 (Vite)
npm run build
# 输出目录：dist/

# React (create-react-app)
npm run build
# 输出目录：build/

# React (Vite)
npm run build
# 输出目录：dist/
```

---

## 2. Vue2项目Nginx配置

### 2.1 基础配置

```nginx
# /etc/nginx/conf.d/vue2-app.conf

server {
    listen 80;
    server_name vue2.example.com;
    root /var/www/vue2-app/dist;
    index index.html;

    # Vue2 History模式路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # JS/CSS资源（带hash的文件）
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片和字体
    location ~* \.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # 不缓存index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### 2.2 Vue2 + API代理配置

```nginx
server {
    listen 80;
    server_name vue2.example.com;
    root /var/www/vue2-app/dist;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理 - 对应vue.config.js中的proxy配置
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket代理（如果使用socket.io等）
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
}
```

### 2.3 Vue2多入口配置

```nginx
# Vue2多页面应用配置
server {
    listen 80;
    server_name vue2-multi.example.com;
    root /var/www/vue2-multi/dist;

    # 主页面
    location / {
        try_files $uri $uri/ /index.html;
    }

    # admin页面入口
    location /admin {
        try_files $uri $uri/ /admin.html;
    }

    # mobile页面入口
    location /mobile {
        try_files $uri $uri/ /mobile.html;
    }

    # 静态资源
    location ~* \.(js|css|png|jpg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2.4 Vue2 + HTTPS配置

```nginx
# HTTP重定向到HTTPS
server {
    listen 80;
    server_name vue2.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS配置
server {
    listen 443 ssl http2;
    server_name vue2.example.com;
    root /var/www/vue2-app/dist;
    index index.html;

    # SSL证书
    ssl_certificate /etc/ssl/certs/vue2.example.com.crt;
    ssl_certificate_key /etc/ssl/private/vue2.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 其他安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Vue2路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理（转发到HTTPS后端）
    location /api/ {
        proxy_pass https://api.example.com/;
        proxy_ssl_verify off;
        proxy_set_header Host api.example.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2.5 Vue2环境变量配置

```nginx
# 前端配置文件动态注入
server {
    listen 80;
    server_name vue2.example.com;
    root /var/www/vue2-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 提供动态配置接口
    location /config.js {
        default_type application/javascript;
        return 200 'window.__APP_CONFIG__ = {
            API_BASE_URL: "https://api.example.com",
            SOCKET_URL: "wss://ws.example.com",
            ENV: "production"
        };';
    }

    # 或者使用sub_filter动态替换
    location = /index.html {
        sub_filter '__API_URL__' 'https://api.example.com';
        sub_filter '__ENV__' 'production';
        sub_filter_once off;
        sub_filter_types text/html;
    }
}
```

---

## 3. Vue3项目Nginx配置

### 3.1 Vue3基础配置（Vite构建）

```nginx
# /etc/nginx/conf.d/vue3-app.conf

server {
    listen 80;
    server_name vue3.example.com;
    root /var/www/vue3-app/dist;
    index index.html;

    # Vue3 History模式路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Vite构建的资源目录
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 不缓存入口文件
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # gzip压缩
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

### 3.2 Vue3完整生产配置

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name vue3.example.com;
    root /var/www/vue3-app/dist;
    index index.html;

    # SSL配置
    ssl_certificate /etc/ssl/certs/vue3.example.com.crt;
    ssl_certificate_key /etc/ssl/private/vue3.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # HTTP重定向到HTTPS
    if ($scheme = http) {
        return 301 https://$server_name$request_uri;
    }

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Vue3 History模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存策略
    # Vite构建的带hash资源
    location ~* \.([a-f0-9]{8})\.(js|css|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 图片资源
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # API代理
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS头（如果后端不处理）
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # WebSocket支持
    location /ws/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }

    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
    }

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### 3.3 Vue3 + Pinia状态持久化配置

```nginx
# 支持localStorage持久化的配置
server {
    listen 80;
    server_name vue3.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
        
        # 允许本地存储
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
    }

    # 静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.4 Vue3 + Vue Router子路径部署

```nginx
# 部署到子路径 /app/
# vite.config.ts 中设置 base: '/app/'
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # 主站
    location / {
        index index.html;
    }

    # Vue3应用部署到子路径
    location /app/ {
        alias /var/www/vue3-app/dist/;
        try_files $uri $uri/ /app/index.html;
    }

    # Vue3应用的静态资源
    location /app/assets/ {
        alias /var/www/vue3-app/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API代理
    location /app/api/ {
        rewrite ^/app/api/(.*)$ /api/$1 break;
        proxy_pass http://backend:3000;
    }
}
```

### 3.5 Vue3 + Nginx负载均衡后端

```nginx
# 后端服务负载均衡
upstream vue3_backend {
    least_conn;
    server 192.168.1.101:3000 weight=5;
    server 192.168.1.102:3000 weight=3;
    server 192.168.1.103:3000 weight=2;
    
    keepalive 32;
}

server {
    listen 80;
    server_name vue3.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://vue3_backend/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 错误重试
        proxy_next_upstream error timeout http_500 http_502 http_503;
        proxy_next_upstream_timeout 10s;
        proxy_next_upstream_tries 3;
    }
}
```

---

## 4. Vue3+TypeScript项目Nginx配置

### 4.1 Vue3+TS基础配置

```nginx
# Vue3 + TypeScript项目配置
# 打包产物与普通Vue3相同，Nginx配置无差异

server {
    listen 80;
    server_name vue3ts.example.com;
    root /var/www/vue3ts-app/dist;
    index index.html;

    # History模式路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Vite构建的资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SourceMap处理（生产环境建议禁用或限制访问）
    location ~* \.map$ {
        # 禁止外部访问SourceMap
        deny all;
        # 或只允许内网访问
        # allow 192.168.0.0/16;
        # deny all;
    }

    # API代理（配合TypeScript的API类型）
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.2 Vue3+TS + 类型安全的API配置

```nginx
# 完整的Vue3+TypeScript生产配置
server {
    listen 443 ssl http2;
    server_name vue3ts.example.com;
    root /var/www/vue3ts-app/dist;

    # SSL
    ssl_certificate /etc/ssl/certs/vue3ts.example.com.crt;
    ssl_certificate_key /etc/ssl/private/vue3ts.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # RESTful API代理
    location /api/v1/ {
        proxy_pass http://api-v1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # JSON响应类型
        proxy_set_header Accept "application/json";
    }

    # GraphQL API代理
    location /graphql {
        proxy_pass http://graphql:4000/graphql;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # GraphQL特定配置
        proxy_set_header Content-Type "application/json";
    }

    # 上传API（大文件）
    location /api/upload {
        proxy_pass http://upload:3000;
        client_max_body_size 100m;
        proxy_request_buffering off;
        proxy_http_version 1.1;
    }
}

# HTTP重定向
server {
    listen 80;
    server_name vue3ts.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 4.3 Vue3+TS + Monorepo部署

```nginx
# Monorepo多包部署配置
# 项目结构：
# packages/
#   web/dist/      - 主Web应用
#   admin/dist/    - 管理后台
#   mobile/dist/   - 移动端

server {
    listen 80;
    server_name example.com;

    # 主Web应用
    location / {
        root /var/www/monorepo/packages/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # 管理后台
    location /admin/ {
        alias /var/www/monorepo/packages/admin/dist/;
        try_files $uri $uri/ /admin/index.html;
    }

    # 移动端
    location /m/ {
        alias /var/www/monorepo/packages/mobile/dist/;
        try_files $uri $uri/ /m/index.html;
    }

    # 共享静态资源
    location /shared/ {
        alias /var/www/monorepo/packages/shared/dist/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 统一API代理
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4.4 Vue3+TS + PWA配置

```nginx
# PWA应用配置
server {
    listen 443 ssl http2;
    server_name pwa.example.com;
    root /var/www/pwa-app/dist;

    # SSL必需（PWA要求HTTPS）
    ssl_certificate /etc/ssl/certs/pwa.example.com.crt;
    ssl_certificate_key /etc/ssl/private/pwa.example.com.key;

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }

    # manifest.json
    location /manifest.json {
        add_header Cache-Control "no-cache";
        default_type application/manifest+json;
    }

    # workbox相关文件
    location /workbox-*.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源（长缓存）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 离线页面
    location /offline.html {
        add_header Cache-Control "no-cache";
    }

    # API代理
    location /api/ {
        proxy_pass http://backend:3000/;
    }
}
```

---

## 5. React项目Nginx配置

### 5.1 Create-React-App基础配置

```nginx
# CRA项目Nginx配置
# 打包输出目录为 build/

server {
    listen 80;
    server_name react.example.com;
    root /var/www/react-app/build;
    index index.html;

    # React Router BrowserRouter支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # CRA静态资源目录
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 不缓存入口文件
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # manifest和robots
    location = /manifest.json {
        add_header Cache-Control "no-cache";
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }
}
```

### 5.2 React + Vite配置

```nginx
# React + Vite项目配置
# 打包输出目录为 dist/

server {
    listen 80;
    server_name react-vite.example.com;
    root /var/www/react-vite/dist;
    index index.html;

    # React Router支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Vite构建的资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### 5.3 React完整生产配置

```nginx
# React生产环境完整配置
upstream react_backend {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    keepalive 32;
}

server {
    listen 80;
    listen 443 ssl http2;
    server_name react.example.com;
    root /var/www/react-app/build;

    # SSL
    ssl_certificate /etc/ssl/certs/react.example.com.crt;
    ssl_certificate_key /etc/ssl/private/react.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # HTTP重定向到HTTPS
    if ($scheme = http) {
        return 301 https://$server_name$request_uri;
    }

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 媒体文件
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|mp4|webm)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # API代理
    location /api/ {
        proxy_pass http://react_backend/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # 错误处理
        proxy_next_upstream error timeout http_500 http_502 http_503;
    }

    # WebSocket
    location /ws {
        proxy_pass http://react_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
}
```

### 5.4 React + Redux Toolkit配置

```nginx
# 支持Redux DevTools的配置（开发环境）
server {
    listen 80;
    server_name react-dev.example.com;
    root /var/www/react-app/build;

    location / {
        try_files $uri $uri/ /index.html;
        
        # 允许Redux DevTools
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws://localhost:*;" always;
    }

    # 开发服务器代理
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 5.5 React + Next.js静态导出配置

```nginx
# Next.js静态导出 (next export) 配置
server {
    listen 80;
    server_name nextjs.example.com;
    root /var/www/nextjs-app/out;
    index index.html;

    # 动态路由支持
    location / {
        try_files $uri $uri.html $uri/ /404.html;
    }

    # _next静态资源
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片优化
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # API路由（如果需要）
    location /api/ {
        proxy_pass http://backend:3000/;
    }
}
```

### 5.6 React子路径部署

```nginx
# React部署到子路径
# package.json: "homepage": "/app"
# 或 vite.config: base: '/app/'

server {
    listen 80;
    server_name example.com;

    # 根路径
    location / {
        root /var/www/main-site;
        index index.html;
    }

    # React应用部署到 /app/
    location /app/ {
        alias /var/www/react-app/build/;
        try_files $uri $uri/ /app/index.html;
    }

    # React静态资源
    location /app/static/ {
        alias /var/www/react-app/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API代理
    location /app/api/ {
        rewrite ^/app/api/(.*)$ /$1 break;
        proxy_pass http://backend:3000;
    }
}
```

---

## 6. 通用配置与最佳实践

### 6.1 通用SPA配置模板

```nginx
# 通用SPA应用Nginx配置模板
# 适用于Vue2/Vue3/React等所有SPA框架

server {
    listen 80;
    listen 443 ssl http2;
    server_name DOMAIN_NAME;
    root ROOT_PATH;
    index index.html;

    # SSL配置
    ssl_certificate SSL_CERT_PATH;
    ssl_certificate_key SSL_KEY_PATH;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # HTTP重定向到HTTPS
    if ($scheme = http) {
        return 301 https://$server_name$request_uri;
    }

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 带hash的静态资源（长期缓存）
    location ~* \.[a-f0-9]{8,}\.(js|css|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 普通静态资源
    location ~* \.(js|css)$ {
        expires 7d;
        add_header Cache-Control "public, must-revalidate";
    }

    # 图片资源
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # 字体文件
    location ~* \.(woff|woff2|ttf|eot|otf)$ {
        expires 1y;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }

    # 不缓存HTML
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # API代理
    location /api/ {
        proxy_pass API_BACKEND_URL;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket
    location /ws/ {
        proxy_pass WS_BACKEND_URL;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }

    # 压缩
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

### 6.2 缓存策略最佳实践

```nginx
http {
    # 定义缓存规则map
    map $sent_http_content_type $cache_control {
        default                         "public, max-age=86400";
        text/html                       "no-cache, no-store, must-revalidate";
        application/json                "no-cache";
        ~*application/javascript        "public, max-age=31536000, immutable";
        ~*text/css                      "public, max-age=31536000, immutable";
        ~*image/                        "public, max-age=2592000";
        ~*font/                         "public, max-age=31536000";
    }

    server {
        location / {
            try_files $uri $uri/ /index.html;
            add_header Cache-Control $cache_control;
        }
    }
}
```

### 6.3 CORS配置

```nginx
# 完整的CORS配置
map $http_origin $cors_origin {
    default "";
    "~^https?://localhost(:[0-9]+)?$" $http_origin;
    "~^https?://.*\.example\.com$" $http_origin;
    "https://trusted-site.com" $http_origin;
}

server {
    location /api/ {
        # CORS头
        add_header Access-Control-Allow-Origin $cors_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With, X-Custom-Header" always;
        add_header Access-Control-Max-Age 86400 always;
        add_header Access-Control-Expose-Headers "X-Total-Count, X-Page-Size" always;

        # 预检请求
        if ($request_method = OPTIONS) {
            return 204;
        }

        proxy_pass http://backend;
    }
}
```

### 6.4 限流配置

```nginx
http {
    # 限制请求频率
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=1r/s;

    # 限制连接数
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    server {
        # API限流
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            limit_req_status 429;
            
            proxy_pass http://backend;
        }

        # 登录接口更严格限流
        location /api/login {
            limit_req zone=login_limit burst=5;
            limit_req_status 429;
            
            proxy_pass http://backend;
        }

        # 静态资源连接数限制
        location /static/ {
            limit_conn conn_limit 10;
            
            root /var/www;
        }
    }
}
```

### 6.5 日志配置

```nginx
http {
    # JSON格式日志（便于ELK分析）
    log_format json_log escape=json '{'
        '"time":"$time_iso8601",'
        '"remote_addr":"$remote_addr",'
        '"method":"$request_method",'
        '"uri":"$request_uri",'
        '"status":$status,'
        '"body_bytes_sent":$body_bytes_sent,'
        '"request_time":$request_time,'
        '"upstream_response_time":"$upstream_response_time",'
        '"http_referer":"$http_referer",'
        '"http_user_agent":"$http_user_agent",'
        '"http_x_forwarded_for":"$http_x_forwarded_for"'
    '}';

    # 排除健康检查和静态资源
    map $request_uri $loggable {
        ~*\.(js|css|png|jpg|gif|ico|svg|woff|woff2)$ 0;
        /health 0;
        /ping 0;
        default 1;
    }

    server {
        access_log /var/log/nginx/access.json json_log if=$loggable;
        error_log /var/log/nginx/error.log warn;
    }
}
```

---

## 7. Docker部署配置

### 7.1 Vue/React Dockerfile

```dockerfile
# 多阶段构建 Dockerfile

# 构建阶段
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html
# 暴露端口
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 Docker nginx.conf

```nginx
# docker/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
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
    server_tokens off;

    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

### 7.3 Docker default.conf

```nginx
# docker/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 不缓存入口文件
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # API代理 - 使用Docker网络
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### 7.4 Docker Compose配置

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
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs:/var/log/nginx
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    command: npm start
    expose:
      - "3000"
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
```

### 7.5 Kubernetes Nginx ConfigMap

```yaml
# nginx-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  default.conf: |
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /api/ {
            proxy_pass http://backend-service:3000/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /health {
            return 200 "OK";
            add_header Content-Type text/plain;
        }
    }
```

---

## 8. 多环境配置

### 8.1 环境变量注入

```nginx
# 使用环境变量（Docker）
server {
    listen 80;
    server_name ${NGINX_HOST};
    root /usr/share/nginx/html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass ${API_URL};
    }
}

# 启动命令
# envsubst '${NGINX_HOST} ${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
```

### 8.2 多环境配置文件

```nginx
# /etc/nginx/conf.d/development.conf
server {
    listen 80;
    server_name dev.example.com;
    root /var/www/dev/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://dev-backend:3000/;
    }

    # 开发环境允许CORS
    add_header Access-Control-Allow-Origin "*" always;
}

# /etc/nginx/conf.d/staging.conf
server {
    listen 80;
    listen 443 ssl http2;
    server_name staging.example.com;
    root /var/www/staging/dist;

    ssl_certificate /etc/ssl/certs/staging.example.com.crt;
    ssl_certificate_key /etc/ssl/private/staging.example.com.key;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://staging-backend:3000/;
    }

    # 限制访问IP
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}

# /etc/nginx/conf.d/production.conf
server {
    listen 80;
    listen 443 ssl http2;
    server_name example.com www.example.com;
    root /var/www/production/dist;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    if ($scheme = http) {
        return 301 https://$server_name$request_uri;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://production-backend:3000/;
    }
}
```

### 8.3 前端配置文件动态加载

```nginx
# 动态配置接口
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 根据环境返回不同配置
    location = /env-config.js {
        default_type application/javascript;
        
        # 开发环境
        if ($host = "dev.example.com") {
            return 200 'window.__ENV_CONFIG__ = {
                API_URL: "https://dev-api.example.com",
                ENV: "development",
                DEBUG: true
            };';
        }
        
        # 生产环境
        return 200 'window.__ENV_CONFIG__ = {
            API_URL: "https://api.example.com",
            ENV: "production",
            DEBUG: false
        };';
    }
}
```

---

## 9. 微前端架构配置

### 9.1 qiankun微前端配置

```nginx
# 主应用配置
server {
    listen 80;
    server_name main.example.com;
    root /var/www/main-app/dist;

    # 主应用路由
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # 主应用静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API代理
    location /api/ {
        proxy_pass http://backend:3000/;
    }
}

# 子应用1配置
server {
    listen 80;
    server_name sub1.example.com;
    root /var/www/sub1-app/dist;

    # 允许跨域加载（qiankun要求）
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "*" always;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*" always;
    }
}

# 子应用2配置
server {
    listen 80;
    server_name sub2.example.com;
    root /var/www/sub2-app/dist;

    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "*" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*" always;
    }
}
```

### 9.2 统一域名微前端配置

```nginx
# 所有微前端应用使用同一域名，通过路径区分
server {
    listen 80;
    server_name example.com;

    # 主应用
    location / {
        root /var/www/main-app/dist;
        try_files $uri $uri/ /index.html;
    }

    # 子应用1 - 通过路径访问
    location /sub1/ {
        alias /var/www/sub1-app/dist/;
        try_files $uri $uri/ /sub1/index.html;
    }

    # 子应用2
    location /sub2/ {
        alias /var/www/sub2-app/dist/;
        try_files $uri $uri/ /sub2/index.html;
    }

    # 子应用静态资源
    location /sub1/assets/ {
        alias /var/www/sub1-app/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /sub2/assets/ {
        alias /var/www/sub2-app/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 统一API代理
    location /api/ {
        proxy_pass http://backend:3000/;
    }
}
```

### 9.3 Module Federation配置

```nginx
# Webpack Module Federation配置
server {
    listen 80;
    server_name example.com;
    root /var/www/host-app/dist;

    # Host应用
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Remote应用入口
    location /remote1/remoteEntry.js {
        proxy_pass http://remote1:3001/remoteEntry.js;
        add_header Access-Control-Allow-Origin "*" always;
        add_header Cache-Control "no-cache";
    }

    location /remote2/remoteEntry.js {
        proxy_pass http://remote2:3002/remoteEntry.js;
        add_header Access-Control-Allow-Origin "*" always;
        add_header Cache-Control "no-cache";
    }

    # Remote应用静态资源
    location /remote1/ {
        proxy_pass http://remote1:3001/;
        add_header Access-Control-Allow-Origin "*" always;
    }

    location /remote2/ {
        proxy_pass http://remote2:3002/;
        add_header Access-Control-Allow-Origin "*" always;
    }
}
```

---

## 10. SSR应用配置

### 10.1 Nuxt.js (Vue SSR) 配置

```nginx
# Nuxt.js SSR应用配置
upstream nuxt_server {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name nuxt.example.com;

    # 静态资源
    location /_nuxt/ {
        alias /var/www/nuxt-app/.nuxt/dist/client/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 静态文件
    location /static/ {
        alias /var/www/nuxt-app/static/;
        expires 30d;
    }

    # SSR请求代理到Node服务
    location / {
        proxy_pass http://nuxt_server;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        
        # 缓存SSR页面
        proxy_cache_valid 200 10m;
    }

    # API代理
    location /api/ {
        proxy_pass http://backend:4000/;
    }
}
```

### 10.2 Next.js (React SSR) 配置

```nginx
# Next.js SSR应用配置
upstream nextjs_server {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name nextjs.example.com;

    # Next.js静态资源
    location /_next/static/ {
        alias /var/www/nextjs-app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片优化
    location /_next/image {
        proxy_pass http://nextjs_server;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # public目录
    location /public/ {
        alias /var/www/nextjs-app/public/;
        expires 30d;
    }

    # SSR和API路由
    location / {
        proxy_pass http://nextjs_server;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
    }
}
```

### 10.3 SSR缓存配置

```nginx
# SSR页面缓存配置
proxy_cache_path /var/cache/nginx/ssr 
    levels=1:2 
    keys_zone=ssr_cache:100m 
    max_size=10g 
    inactive=60m;

server {
    listen 80;
    server_name ssr.example.com;

    # SSR页面请求
    location / {
        proxy_pass http://ssr_server;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # 启用缓存
        proxy_cache ssr_cache;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_valid 200 10m;
        proxy_cache_valid 404 1m;

        # 缓存状态头
        add_header X-Cache-Status $upstream_cache_status;

        # 后台更新
        proxy_cache_background_update on;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;

        # 不缓存登录用户
        proxy_cache_bypass $http_authorization $cookie_session;
        proxy_no_cache $http_authorization $cookie_session;
    }

    # API不缓存
    location /api/ {
        proxy_pass http://ssr_server;
        proxy_cache off;
    }

    # 静态资源长缓存
    location /_nuxt/ {
        proxy_pass http://ssr_server;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 附录：框架特定配置速查表

### Vue2 vue.config.js 与 Nginx对应

```javascript
// vue.config.js
module.exports = {
  publicPath: '/app/',      // Nginx: location /app/ { alias ...; }
  outputDir: 'dist',        // Nginx: root .../dist;
  assetsDir: 'static',      // Nginx: location /static/ { ... }
  devServer: {
    proxy: {
      '/api': {             // Nginx: location /api/ { proxy_pass ...; }
        target: 'http://backend:3000',
        changeOrigin: true
      }
    }
  }
}
```

### Vue3/Vite vite.config.ts 与 Nginx对应

```typescript
// vite.config.ts
export default defineConfig({
  base: '/app/',            // Nginx: location /app/ { alias ...; }
  build: {
    outDir: 'dist',         // Nginx: root .../dist;
    assetsDir: 'assets'     // Nginx: location /assets/ { ... }
  },
  server: {
    proxy: {
      '/api': {             // Nginx: location /api/ { proxy_pass ...; }
        target: 'http://backend:3000',
        changeOrigin: true
      }
    }
  }
})
```

### React CRA与Nginx对应

```json
// package.json
{
  "homepage": "/app",       // Nginx: location /app/ { alias .../build/; }
  "proxy": "http://backend:3000"  // Nginx: location /api/ { proxy_pass ...; }
}
```

---

> 本文档涵盖了Vue2、Vue3、Vue3+TypeScript、React等主流前端框架与Nginx的集成配置。实际使用时请根据项目需求进行调整。
