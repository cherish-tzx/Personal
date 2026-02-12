# 大厂企业级项目 Nginx 最佳实践

> 基于阿里、腾讯、字节、美团等大厂实际生产环境的Nginx配置实践

<div class="doc-toc">

## 目录

1. [企业级架构概述](#1-企业级架构概述)
2. [Vue2企业级项目配置](#2-vue2企业级项目配置)
3. [Vue3企业级项目配置](#3-vue3企业级项目配置)
4. [Vue3+TypeScript企业级配置](#4-vue3typescript企业级配置)
5. [高可用与负载均衡](#5-高可用与负载均衡)
6. [灰度发布与AB测试](#6-灰度发布与ab测试)
7. [CDN与静态资源优化](#7-cdn与静态资源优化)
8. [安全防护配置](#8-安全防护配置)
9. [监控与日志分析](#9-监控与日志分析)
10. [性能优化实战](#10-性能优化实战)
11. [多租户与多域名配置](#11-多租户与多域名配置)
12. [容灾与降级策略](#12-容灾与降级策略)
13. [DevOps自动化配置](#13-devops自动化配置)


</div>

---

## 1. 企业级架构概述

### 1.1 大厂典型架构

```
                                    ┌─────────────────┐
                                    │   DNS/GSLB      │
                                    │ (智能DNS调度)    │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
           │   CDN节点-北京   │     │   CDN节点-上海   │     │   CDN节点-深圳   │
           └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                    │                        │                        │
           ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
           │   SLB/CLB       │     │   SLB/CLB       │     │   SLB/CLB       │
           │ (云负载均衡)     │     │ (云负载均衡)     │     │ (云负载均衡)     │
           └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                    │                        │                        │
        ┌───────────┼───────────┐           │                        │
        │           │           │           │                        │
   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐     │                        │
   │ Nginx-1 │ │ Nginx-2 │ │ Nginx-3 │     ...                      ...
   │ (边缘)  │ │ (边缘)  │ │ (边缘)  │
   └────┬────┘ └────┬────┘ └────┬────┘
        │           │           │
        └───────────┼───────────┘
                    │
           ┌────────▼────────┐
           │   API Gateway   │
           │  (Kong/APISIX)  │
           └────────┬────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
   │Backend-1│ │Backend-2│ │Backend-3│
   └─────────┘ └─────────┘ └─────────┘
```

### 1.2 企业级Nginx职责分层

```nginx
# 第一层：边缘层 Nginx（接入层）
# 职责：SSL终止、压缩、静态资源、基础安全防护

# 第二层：业务层 Nginx（网关层）
# 职责：路由分发、限流熔断、灰度发布、API聚合

# 第三层：服务层 Nginx（可选）
# 职责：微服务负载均衡、服务发现
```

---

## 2. Vue2企业级项目配置

### 2.1 阿里云部署配置

```nginx
# /etc/nginx/conf.d/vue2-ali.conf
# 阿里云ECS + SLB + OSS + CDN 架构

# 健康检查接口
upstream health_check {
    server 127.0.0.1:80;
}

server {
    listen 80;
    server_name www.example.com example.com;
    
    # 阿里云SLB健康检查
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }

    # HTTP重定向到HTTPS（SLB HTTPS监听时配置）
    # 阿里云SLB会在Header中添加X-Forwarded-Proto
    if ($http_x_forwarded_proto = "http") {
        return 301 https://$server_name$request_uri;
    }

    root /var/www/vue2-app/dist;
    index index.html;

    # Vue2 History模式
    location / {
        try_files $uri $uri/ /index.html;
        
        # 阿里云盾安全头
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # 静态资源走CDN（配置CDN回源）
    # CDN配置：www.example.com/static/* -> OSS源站
    location /static/ {
        # 如果CDN未命中，回源到本地
        root /var/www/vue2-app/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        
        # 开启gzip（CDN回源时）
        gzip on;
        gzip_types text/css application/javascript image/svg+xml;
    }

    # API代理到阿里云内网SLB
    location /api/ {
        # 内网SLB地址
        proxy_pass http://10.0.0.100:80/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 阿里云内网超时设置
        proxy_connect_timeout 10s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 限流（配合阿里云流量防护）
        limit_req zone=api_limit burst=50 nodelay;
    }

    # 阿里云日志服务格式
    access_log /var/log/nginx/access.log combined;
    error_log /var/log/nginx/error.log warn;
}

# 限流区域定义（全局）
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
```

### 2.2 腾讯云部署配置

```nginx
# /etc/nginx/conf.d/vue2-tencent.conf
# 腾讯云CVM + CLB + COS + CDN 架构

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue2-app/dist;

    # 腾讯云CLB健康检查
    location /healthcheck {
        access_log off;
        return 200 "healthy";
    }

    # HTTPS重定向（CLB HTTPS监听）
    set $redirect_https 0;
    if ($http_x_forwarded_proto = "http") {
        set $redirect_https 1;
    }
    if ($redirect_https = 1) {
        return 301 https://$host$request_uri;
    }

    # Vue2应用
    location / {
        try_files $uri $uri/ /index.html;
        
        # 腾讯云安全组合头
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
    }

    # 静态资源（CDN加速）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public";
        
        # 腾讯云CDN特殊头
        add_header X-Cache-Lookup $upstream_cache_status;
    }

    # API代理到腾讯云API网关
    location /api/ {
        # 腾讯云API网关地址
        proxy_pass https://service-xxxxx-xxxxx.sh.apigw.tencentcs.com/;
        proxy_ssl_server_name on;
        proxy_set_header Host service-xxxxx-xxxxx.sh.apigw.tencentcs.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # API网关认证头
        proxy_set_header Authorization $http_authorization;
    }

    # WebSocket（腾讯云IM等）
    location /ws/ {
        proxy_pass http://ws-backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;
    }
}
```

### 2.3 字节跳动风格配置

```nginx
# /etc/nginx/conf.d/vue2-bytedance.conf
# 参考字节跳动基础架构风格

# 定义后端服务池
upstream vue2_api_pool {
    # 一致性哈希（根据用户ID）
    hash $http_x_user_id consistent;
    
    server 10.0.1.1:8080 weight=10 max_fails=3 fail_timeout=30s;
    server 10.0.1.2:8080 weight=10 max_fails=3 fail_timeout=30s;
    server 10.0.1.3:8080 weight=5 max_fails=3 fail_timeout=30s backup;
    
    keepalive 100;
    keepalive_timeout 60s;
}

# 请求ID生成
map $request_id $trace_id {
    default $request_id;
    ""      $pid-$msec-$remote_addr-$connection;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue2-app/dist;

    # 注入请求追踪ID
    set $req_id $trace_id;

    # 统一请求入口
    location / {
        try_files $uri $uri/ /index.html;
        
        # 请求追踪头
        add_header X-Request-Id $req_id;
        add_header X-Server-Id $hostname;
    }

    # API网关层
    location /api/ {
        proxy_pass http://vue2_api_pool/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # 字节风格的请求头
        proxy_set_header X-Request-Id $req_id;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Original-URI $request_uri;
        
        # 超时配置（字节标准）
        proxy_connect_timeout 3s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
        
        # 熔断配置
        proxy_next_upstream error timeout http_500 http_502 http_503;
        proxy_next_upstream_timeout 5s;
        proxy_next_upstream_tries 2;
    }

    # 字节风格日志格式
    access_log /var/log/nginx/access.log json_format;
}

# 字节JSON日志格式
log_format json_format escape=json '{'
    '"timestamp":"$time_iso8601",'
    '"request_id":"$req_id",'
    '"remote_addr":"$remote_addr",'
    '"method":"$request_method",'
    '"uri":"$uri",'
    '"query":"$args",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_response_time":"$upstream_response_time",'
    '"upstream_addr":"$upstream_addr",'
    '"http_referer":"$http_referer",'
    '"http_user_agent":"$http_user_agent",'
    '"http_x_forwarded_for":"$http_x_forwarded_for",'
    '"server_name":"$server_name",'
    '"hostname":"$hostname"'
'}';
```

### 2.4 美团风格配置

```nginx
# /etc/nginx/conf.d/vue2-meituan.conf
# 参考美团基础架构风格

# 服务发现（配合OCTO/Cat等）
upstream vue2_backend {
    # 美团使用软负载，这里模拟
    server backend-1.internal:8080;
    server backend-2.internal:8080;
    server backend-3.internal:8080;
    
    keepalive 64;
}

# 限流配置
limit_req_zone $binary_remote_addr zone=perip:10m rate=50r/s;
limit_req_zone $server_name zone=perserver:10m rate=1000r/s;

# 连接数限制
limit_conn_zone $binary_remote_addr zone=perip_conn:10m;
limit_conn_zone $server_name zone=perserver_conn:10m;

server {
    listen 80;
    server_name m.example.com;  # 美团移动端
    root /var/www/vue2-h5/dist;

    # 基础限流
    limit_req zone=perip burst=100 nodelay;
    limit_req zone=perserver burst=2000;
    limit_conn perip_conn 50;
    limit_conn perserver_conn 5000;

    # 移动端Vue2应用
    location / {
        try_files $uri $uri/ /index.html;
        
        # 美团Cat追踪
        add_header X-Cat-Root-Message-Id $request_id;
        add_header X-Cat-Parent-Message-Id "";
        add_header X-Cat-Child-Message-Id "";
    }

    # API代理（美团网关）
    location /api/ {
        proxy_pass http://vue2_backend/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # Cat追踪头
        proxy_set_header X-Cat-Root-Message-Id $request_id;
        proxy_set_header X-Cat-Source "vue2-h5";
        
        # 美团超时标准
        proxy_connect_timeout 1s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
    }

    # 降级页面
    error_page 500 502 503 504 @fallback;
    location @fallback {
        root /var/www/fallback;
        try_files /index.html =503;
    }
}
```

---

## 3. Vue3企业级项目配置

### 3.1 Vue3 + Vite阿里云生产配置

```nginx
# /etc/nginx/conf.d/vue3-production.conf
# Vue3 + Vite + 阿里云全家桶

# 后端服务集群
upstream vue3_api {
    least_conn;
    server 10.0.1.10:3000 weight=10;
    server 10.0.1.11:3000 weight=10;
    server 10.0.1.12:3000 weight=5;
    
    keepalive 128;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}

# WebSocket集群
upstream vue3_ws {
    ip_hash;  # WebSocket需要会话保持
    server 10.0.2.10:3001;
    server 10.0.2.11:3001;
}

# 代理缓存配置
proxy_cache_path /var/cache/nginx/vue3 
    levels=1:2 
    keys_zone=vue3_cache:100m 
    max_size=10g 
    inactive=60m 
    use_temp_path=off;

server {
    listen 80;
    listen 443 ssl http2;
    server_name www.example.com example.com;
    root /var/www/vue3-app/dist;

    # SSL配置（阿里云证书）
    ssl_certificate /etc/nginx/ssl/example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 223.5.5.5 223.6.6.6 valid=300s;

    # HTTP重定向
    if ($scheme = http) {
        return 301 https://$server_name$request_uri;
    }

    # www重定向
    if ($host = 'example.com') {
        return 301 https://www.example.com$request_uri;
    }

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SLB健康检查
    location /health {
        access_log off;
        return 200 '{"status":"UP","timestamp":"$time_iso8601"}';
        add_header Content-Type application/json;
    }

    # Vue3 SPA路由
    location / {
        try_files $uri $uri/ /index.html;
        
        # 入口文件不缓存
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
    }

    # Vite构建的静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # 启用gzip_static
        gzip_static on;
    }

    # API代理
    location /api/ {
        proxy_pass http://vue3_api/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-Id $request_id;
        
        # 超时
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓存部分GET请求
        proxy_cache vue3_cache;
        proxy_cache_methods GET;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_valid 200 10m;
        proxy_cache_bypass $http_authorization $cookie_token;
        proxy_no_cache $http_authorization $cookie_token;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://vue3_ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # 上传接口
    location /api/upload {
        proxy_pass http://vue3_api;
        client_max_body_size 100m;
        proxy_request_buffering off;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/error-pages;
        internal;
    }

    # 日志
    access_log /var/log/nginx/vue3-access.log json_combined buffer=32k flush=5s;
    error_log /var/log/nginx/vue3-error.log warn;
}
```

### 3.2 Vue3大规模微服务架构

```nginx
# /etc/nginx/conf.d/vue3-microservices.conf
# Vue3 + 微服务架构（参考阿里中台）

# 用户服务
upstream user_service {
    server user-1.internal:8080;
    server user-2.internal:8080;
    keepalive 32;
}

# 订单服务
upstream order_service {
    server order-1.internal:8080;
    server order-2.internal:8080;
    keepalive 32;
}

# 商品服务
upstream product_service {
    server product-1.internal:8080;
    server product-2.internal:8080;
    keepalive 32;
}

# 支付服务（需要更高可用性）
upstream payment_service {
    least_conn;
    server payment-1.internal:8080 weight=10;
    server payment-2.internal:8080 weight=10;
    server payment-3.internal:8080 weight=5 backup;
    keepalive 64;
}

# 搜索服务
upstream search_service {
    server search-1.internal:9200;
    server search-2.internal:9200;
    keepalive 16;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-mall/dist;

    # Vue3前端
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ===== 微服务API路由 =====
    
    # 用户相关API
    location /api/user/ {
        proxy_pass http://user_service/;
        include /etc/nginx/conf.d/proxy_common.conf;
        
        # 用户服务特定超时
        proxy_read_timeout 10s;
    }

    # 订单相关API
    location /api/order/ {
        proxy_pass http://order_service/;
        include /etc/nginx/conf.d/proxy_common.conf;
        
        # 订单服务较长超时（涉及事务）
        proxy_read_timeout 30s;
    }

    # 商品相关API
    location /api/product/ {
        proxy_pass http://product_service/;
        include /etc/nginx/conf.d/proxy_common.conf;
        
        # 商品列表可缓存
        proxy_cache vue3_cache;
        proxy_cache_valid 200 5m;
    }

    # 支付相关API
    location /api/payment/ {
        proxy_pass http://payment_service/;
        include /etc/nginx/conf.d/proxy_common.conf;
        
        # 支付接口更严格的限流
        limit_req zone=payment_limit burst=10 nodelay;
        
        # 禁止缓存
        proxy_cache off;
        add_header Cache-Control "no-store";
    }

    # 搜索API
    location /api/search/ {
        proxy_pass http://search_service/;
        include /etc/nginx/conf.d/proxy_common.conf;
        
        # 搜索结果短缓存
        proxy_cache vue3_cache;
        proxy_cache_valid 200 1m;
    }

    # 聚合API（BFF层）
    location /api/v1/ {
        proxy_pass http://bff_service/;
        include /etc/nginx/conf.d/proxy_common.conf;
    }
}

# /etc/nginx/conf.d/proxy_common.conf
# 通用代理配置
# proxy_http_version 1.1;
# proxy_set_header Connection "";
# proxy_set_header Host $host;
# proxy_set_header X-Real-IP $remote_addr;
# proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
# proxy_set_header X-Forwarded-Proto $scheme;
# proxy_set_header X-Request-Id $request_id;
# proxy_connect_timeout 3s;
# proxy_send_timeout 10s;
# proxy_read_timeout 10s;
# proxy_next_upstream error timeout http_500 http_502 http_503;
# proxy_next_upstream_timeout 5s;
# proxy_next_upstream_tries 2;
```

### 3.3 Vue3多区域部署

```nginx
# /etc/nginx/conf.d/vue3-multi-region.conf
# 多区域部署（华北、华东、华南）

# 根据客户端IP选择后端
geo $region {
    default         east;      # 默认华东
    10.0.0.0/8      north;     # 内网北京
    172.16.0.0/12   south;     # 内网深圳
    # 公网IP段可从MaxMind GeoIP获取
}

# 各区域后端
upstream backend_north {
    server 10.0.1.1:8080;
    server 10.0.1.2:8080;
    keepalive 32;
}

upstream backend_east {
    server 10.0.2.1:8080;
    server 10.0.2.2:8080;
    keepalive 32;
}

upstream backend_south {
    server 10.0.3.1:8080;
    server 10.0.3.2:8080;
    keepalive 32;
}

# 根据区域选择后端
map $region $backend {
    north   backend_north;
    east    backend_east;
    south   backend_south;
    default backend_east;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://$backend/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Region $region;
    }
}
```

---

## 4. Vue3+TypeScript企业级配置

### 4.1 类型安全的API网关配置

```nginx
# /etc/nginx/conf.d/vue3ts-gateway.conf
# Vue3+TS企业级API网关配置

# API版本管理
map $uri $api_version {
    ~^/api/v1/  v1;
    ~^/api/v2/  v2;
    ~^/api/v3/  v3;
    default     v2;  # 默认v2
}

# v1 API服务（旧版本，维护模式）
upstream api_v1 {
    server api-v1-1.internal:8080;
    server api-v1-2.internal:8080;
    keepalive 16;
}

# v2 API服务（当前版本）
upstream api_v2 {
    least_conn;
    server api-v2-1.internal:8080 weight=10;
    server api-v2-2.internal:8080 weight=10;
    server api-v2-3.internal:8080 weight=10;
    keepalive 64;
}

# v3 API服务（新版本，灰度中）
upstream api_v3 {
    server api-v3-1.internal:8080;
    server api-v3-2.internal:8080;
    keepalive 32;
}

# GraphQL服务
upstream graphql_api {
    server graphql-1.internal:4000;
    server graphql-2.internal:4000;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    # SSL
    ssl_certificate /etc/nginx/ssl/api.example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/api.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # API响应类型
    default_type application/json;

    # REST API v1
    location /api/v1/ {
        proxy_pass http://api_v1/;
        include /etc/nginx/conf.d/api_proxy.conf;
        
        # v1弃用警告
        add_header X-API-Deprecated "true" always;
        add_header X-API-Sunset "2024-12-31" always;
    }

    # REST API v2（当前版本）
    location /api/v2/ {
        proxy_pass http://api_v2/;
        include /etc/nginx/conf.d/api_proxy.conf;
    }

    # REST API v3（灰度）
    location /api/v3/ {
        # 灰度逻辑
        set $use_v3 0;
        if ($http_x_gray_user = "true") {
            set $use_v3 1;
        }
        if ($cookie_gray_test = "v3") {
            set $use_v3 1;
        }
        
        # 非灰度用户走v2
        if ($use_v3 = 0) {
            rewrite ^/api/v3/(.*)$ /api/v2/$1 last;
        }
        
        proxy_pass http://api_v3/;
        include /etc/nginx/conf.d/api_proxy.conf;
        
        add_header X-API-Version "v3-beta" always;
    }

    # GraphQL端点
    location /graphql {
        proxy_pass http://graphql_api/graphql;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # GraphQL特定
        proxy_set_header Content-Type "application/json";
        
        # 禁用缓存
        proxy_cache off;
        add_header Cache-Control "no-store";
        
        # CORS
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # GraphQL Playground（仅开发环境）
    location /graphql/playground {
        # 生产环境禁用
        # return 404;
        
        proxy_pass http://graphql_api/playground;
    }

    # OpenAPI文档
    location /api/docs {
        proxy_pass http://api_v2/docs;
        proxy_set_header Host $host;
    }

    # API健康检查
    location /api/health {
        proxy_pass http://api_v2/health;
        access_log off;
    }
}
```

### 4.2 Vue3+TS + 微前端企业配置

```nginx
# /etc/nginx/conf.d/vue3ts-micro-frontend.conf
# Vue3+TypeScript微前端架构（qiankun）

# 主应用
server {
    listen 80;
    server_name www.example.com;
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

    # ===== 子应用配置 =====

    # 用户中心子应用
    location /user-center/ {
        proxy_pass http://user-center-app:8081/;
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "*" always;
        add_header Access-Control-Allow-Credentials true always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # 订单管理子应用
    location /order-admin/ {
        proxy_pass http://order-admin-app:8082/;
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "*" always;
    }

    # 数据大屏子应用
    location /dashboard/ {
        proxy_pass http://dashboard-app:8083/;
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "*" always;
    }

    # 子应用静态资源（允许跨域）
    location ~* ^/(user-center|order-admin|dashboard)/assets/ {
        proxy_pass http://$1-app:808$2;
        add_header Access-Control-Allow-Origin "*" always;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 统一API网关
    location /api/ {
        proxy_pass http://api-gateway:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 子应用独立访问（开发/调试用）
server {
    listen 8081;
    server_name localhost;
    root /var/www/user-center/dist;

    add_header Access-Control-Allow-Origin "*" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4.3 Vue3+TS Monorepo企业配置

```nginx
# /etc/nginx/conf.d/vue3ts-monorepo.conf
# Vue3+TypeScript Monorepo多包部署

# packages/
#   @company/web          - 主站
#   @company/admin        - 管理后台
#   @company/h5           - 移动端H5
#   @company/mini-program - 小程序（不部署Nginx）
#   @company/shared       - 共享组件库

server {
    listen 80;
    server_name www.example.com;
    root /var/www/monorepo/packages/web/dist;
    index index.html;

    # 主站
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API
    location /api/ {
        proxy_pass http://api-gateway:8000/;
    }
}

# 管理后台（独立域名）
server {
    listen 80;
    server_name admin.example.com;
    root /var/www/monorepo/packages/admin/dist;

    # 管理后台IP白名单
    allow 192.168.0.0/16;
    allow 10.0.0.0/8;
    deny all;

    location / {
        try_files $uri $uri/ /index.html;
        
        # 管理后台安全头
        add_header X-Frame-Options "DENY" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 管理后台API
    location /api/ {
        proxy_pass http://admin-api:8001/;
        
        # 管理接口更严格的限流
        limit_req zone=admin_limit burst=20 nodelay;
    }
}

# 移动端H5（独立域名）
server {
    listen 80;
    server_name m.example.com;
    root /var/www/monorepo/packages/h5/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 移动端特殊配置
    location ~* \.(js|css)$ {
        expires 7d;
        add_header Cache-Control "public";
        
        # 移动端开启更激进的压缩
        gzip on;
        gzip_comp_level 6;
    }

    # 移动端API
    location /api/ {
        proxy_pass http://mobile-api:8002/;
    }

    # 微信JSSDK配置
    location /api/wechat/config {
        proxy_pass http://wechat-service:8003/config;
    }
}
```

---

## 5. 高可用与负载均衡

### 5.1 多级负载均衡架构

```nginx
# /etc/nginx/conf.d/ha-lb.conf
# 企业级多级负载均衡

# ==== 第一级：区域负载 ====
upstream region_lb {
    # 北京区域
    server lb-bj-1.internal:80 weight=10;
    server lb-bj-2.internal:80 weight=10;
    
    # 上海区域
    server lb-sh-1.internal:80 weight=10;
    server lb-sh-2.internal:80 weight=10;
    
    # 深圳区域
    server lb-sz-1.internal:80 weight=10;
    server lb-sz-2.internal:80 weight=10;
    
    # 一致性哈希（根据用户ID保持会话）
    hash $cookie_user_id consistent;
    
    keepalive 256;
}

# ==== 第二级：业务负载 ====
upstream web_servers {
    least_conn;
    server web-1.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server web-2.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server web-3.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server web-4.internal:8080 weight=5 max_fails=3 fail_timeout=30s backup;
    
    keepalive 128;
}

upstream api_servers {
    least_conn;
    server api-1.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server api-2.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server api-3.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    
    keepalive 128;
}

# 主动健康检查（需要Nginx Plus或第三方模块）
# upstream api_servers {
#     zone api_servers 64k;
#     server api-1.internal:8080;
#     server api-2.internal:8080;
#     health_check interval=5s fails=3 passes=2 uri=/health;
# }

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api_servers/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # 高可用关键配置
        proxy_connect_timeout 3s;      # 快速失败
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
        
        # 失败重试
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        proxy_next_upstream_timeout 10s;
        proxy_next_upstream_tries 3;
        
        # 缓冲（防止后端慢）
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 16k;
    }
}
```

### 5.2 会话保持配置

```nginx
# /etc/nginx/conf.d/session-persistence.conf
# 多种会话保持策略

# 方式1：IP Hash（简单但不均匀）
upstream backend_ip_hash {
    ip_hash;
    server 10.0.1.1:8080;
    server 10.0.1.2:8080;
    server 10.0.1.3:8080;
}

# 方式2：Cookie Hash（推荐）
upstream backend_cookie_hash {
    hash $cookie_session_id consistent;
    server 10.0.1.1:8080;
    server 10.0.1.2:8080;
    server 10.0.1.3:8080;
}

# 方式3：Header Hash
upstream backend_header_hash {
    hash $http_x_user_id consistent;
    server 10.0.1.1:8080;
    server 10.0.1.2:8080;
    server 10.0.1.3:8080;
}

# 方式4：Sticky Cookie（需要Nginx Plus或第三方模块）
# upstream backend_sticky {
#     sticky cookie srv_id expires=1h domain=.example.com path=/;
#     server 10.0.1.1:8080;
#     server 10.0.1.2:8080;
# }

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 使用Cookie Hash实现会话保持
    location /api/ {
        proxy_pass http://backend_cookie_hash/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # 确保后端设置的Cookie能传递给客户端
        proxy_pass_header Set-Cookie;
    }
}
```

### 5.3 熔断降级配置

```nginx
# /etc/nginx/conf.d/circuit-breaker.conf
# 熔断降级配置（模拟）

# 主服务
upstream primary_backend {
    server primary-1.internal:8080 max_fails=3 fail_timeout=30s;
    server primary-2.internal:8080 max_fails=3 fail_timeout=30s;
}

# 降级服务
upstream fallback_backend {
    server fallback-1.internal:8080;
    server fallback-2.internal:8080;
}

# 静态降级页面
server {
    listen 8888;
    server_name localhost;
    
    location / {
        root /var/www/fallback;
        try_files /fallback.json =503;
        default_type application/json;
    }
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API with 熔断
    location /api/ {
        # 尝试主服务
        proxy_pass http://primary_backend/;
        proxy_http_version 1.1;
        proxy_connect_timeout 2s;
        proxy_read_timeout 5s;
        
        # 拦截错误
        proxy_intercept_errors on;
        error_page 500 502 503 504 = @fallback;
    }

    # 降级处理
    location @fallback {
        # 尝试降级服务
        proxy_pass http://fallback_backend/;
        proxy_connect_timeout 1s;
        proxy_read_timeout 3s;
        
        # 降级服务也失败则返回静态响应
        proxy_intercept_errors on;
        error_page 500 502 503 504 = @static_fallback;
    }

    # 静态降级响应
    location @static_fallback {
        default_type application/json;
        return 503 '{"code":503,"message":"Service temporarily unavailable","data":null}';
    }
}
```

---

## 6. 灰度发布与AB测试

### 6.1 基于Cookie的灰度发布

```nginx
# /etc/nginx/conf.d/gray-release.conf
# 灰度发布配置

# 稳定版本
upstream stable_version {
    server stable-1.internal:8080;
    server stable-2.internal:8080;
    keepalive 32;
}

# 灰度版本
upstream gray_version {
    server gray-1.internal:8080;
    server gray-2.internal:8080;
    keepalive 32;
}

# 灰度判断
map $cookie_gray_release $backend_pool {
    "gray"    gray_version;
    "stable"  stable_version;
    default   stable_version;
}

# 随机灰度（10%流量）
split_clients "$remote_addr$uri" $random_gray {
    10%     gray_version;
    *       stable_version;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API灰度
    location /api/ {
        # 优先使用Cookie设置的版本
        set $final_backend $backend_pool;
        
        # 如果没有Cookie，使用随机灰度
        if ($cookie_gray_release = "") {
            set $final_backend $random_gray;
        }
        
        proxy_pass http://$final_backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Gray-Version $final_backend;
    }

    # 设置灰度Cookie的接口
    location /api/gray/enable {
        add_header Set-Cookie "gray_release=gray; Path=/; Max-Age=86400";
        return 200 '{"message":"Gray release enabled"}';
    }

    location /api/gray/disable {
        add_header Set-Cookie "gray_release=stable; Path=/; Max-Age=86400";
        return 200 '{"message":"Gray release disabled"}';
    }
}
```

### 6.2 基于用户ID的灰度

```nginx
# /etc/nginx/conf.d/gray-userid.conf
# 基于用户ID的精准灰度

# 灰度用户列表（实际应该从配置中心获取）
map $http_x_user_id $is_gray_user {
    default 0;
    "1001"  1;
    "1002"  1;
    "1003"  1;
    ~^100   1;  # 100开头的用户
}

# 基于用户ID哈希的灰度（10%用户）
map $http_x_user_id $gray_by_hash {
    default 0;
    ~[0]$   1;  # 用户ID以0结尾的
}

upstream stable_api {
    server stable-api-1.internal:8080;
    server stable-api-2.internal:8080;
}

upstream gray_api {
    server gray-api-1.internal:8080;
    server gray-api-2.internal:8080;
}

server {
    listen 80;
    server_name api.example.com;

    # 灰度逻辑
    set $use_gray 0;
    
    location /api/ {
        # 白名单用户
        if ($is_gray_user = 1) {
            set $use_gray 1;
        }
        
        # 或按比例灰度
        if ($gray_by_hash = 1) {
            set $use_gray 1;
        }
        
        # 强制灰度Header
        if ($http_x_force_gray = "true") {
            set $use_gray 1;
        }
        
        # 选择后端
        set $backend_server stable_api;
        if ($use_gray = 1) {
            set $backend_server gray_api;
        }
        
        proxy_pass http://$backend_server/;
        proxy_set_header X-Gray-Flag $use_gray;
    }
}
```

### 6.3 前端资源灰度（Vue3）

```nginx
# /etc/nginx/conf.d/frontend-gray.conf
# 前端静态资源灰度

# 稳定版本目录
# /var/www/vue3-app/stable/

# 灰度版本目录
# /var/www/vue3-app/gray/

map $cookie_frontend_version $frontend_root {
    "gray"    /var/www/vue3-app/gray;
    "stable"  /var/www/vue3-app/stable;
    default   /var/www/vue3-app/stable;
}

# 随机前端灰度
split_clients "$remote_addr" $random_frontend {
    5%      /var/www/vue3-app/gray;
    *       /var/www/vue3-app/stable;
}

server {
    listen 80;
    server_name www.example.com;

    # 动态选择前端版本
    set $final_root $frontend_root;
    if ($cookie_frontend_version = "") {
        set $final_root $random_frontend;
    }

    location / {
        root $final_root;
        try_files $uri $uri/ /index.html;
        
        # 标记版本
        add_header X-Frontend-Version $final_root;
    }

    location /assets/ {
        root $final_root;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 切换版本接口
    location = /__switch_version__ {
        if ($arg_version = "gray") {
            add_header Set-Cookie "frontend_version=gray; Path=/; Max-Age=86400";
            return 302 /;
        }
        if ($arg_version = "stable") {
            add_header Set-Cookie "frontend_version=stable; Path=/; Max-Age=86400";
            return 302 /;
        }
        return 400 "Invalid version";
    }
}
```

### 6.4 AB测试配置

```nginx
# /etc/nginx/conf.d/ab-test.conf
# AB测试配置

# 实验组配置
split_clients "$remote_addr$http_user_agent" $experiment_group {
    33.3%   "A";
    33.3%   "B";
    *       "C";
}

# 不同实验组的后端
upstream experiment_a {
    server exp-a-1.internal:8080;
    server exp-a-2.internal:8080;
}

upstream experiment_b {
    server exp-b-1.internal:8080;
    server exp-b-2.internal:8080;
}

upstream experiment_c {
    server exp-c-1.internal:8080;
    server exp-c-2.internal:8080;
}

map $experiment_group $experiment_backend {
    "A" experiment_a;
    "B" experiment_b;
    "C" experiment_c;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
        
        # 注入实验组标识
        sub_filter '</head>' '<script>window.__EXPERIMENT_GROUP__="$experiment_group";</script></head>';
        sub_filter_once on;
    }

    location /api/ {
        proxy_pass http://$experiment_backend/;
        proxy_set_header X-Experiment-Group $experiment_group;
    }

    # AB测试数据上报
    location /api/analytics/ab {
        proxy_pass http://analytics-server:8080/;
        proxy_set_header X-Experiment-Group $experiment_group;
    }
}
```

---

## 7. CDN与静态资源优化

### 7.1 CDN回源配置

```nginx
# /etc/nginx/conf.d/cdn-origin.conf
# CDN回源服务器配置

server {
    listen 80;
    server_name origin.example.com;
    root /var/www/vue3-app/dist;

    # CDN回源标识
    set $is_cdn 0;
    if ($http_x_cdn_src = "aliyun") {
        set $is_cdn 1;
    }
    if ($http_x_cdn_src = "tencent") {
        set $is_cdn 1;
    }
    if ($http_via ~ "cdn") {
        set $is_cdn 1;
    }

    # 静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        # CDN缓存控制
        add_header Cache-Control "public, max-age=31536000, immutable";
        
        # 支持Range请求（断点续传）
        add_header Accept-Ranges bytes;
        
        # CORS（CDN跨域）
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        
        # 压缩（CDN回源时）
        gzip on;
        gzip_vary on;
        
        # 预压缩文件
        gzip_static on;
        brotli_static on;
        
        # 日志（CDN回源可选记录）
        if ($is_cdn = 1) {
            access_log /var/log/nginx/cdn-origin.log;
        }
    }

    # HTML不缓存
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # CDN预热接口
    location /__cdn_warm__ {
        # 限制只能内网访问
        allow 10.0.0.0/8;
        deny all;
        
        root /var/www/vue3-app/dist;
        try_files $uri =404;
    }
}
```

### 7.2 多CDN配置

```nginx
# /etc/nginx/conf.d/multi-cdn.conf
# 多CDN厂商配置

# 根据请求来源判断CDN
map $http_x_cdn_provider $cdn_name {
    default         "origin";
    "aliyun"        "aliyun";
    "tencent"       "tencent";
    "qiniu"         "qiniu";
}

server {
    listen 80;
    server_name cdn.example.com;
    root /var/www/static;

    # 静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        # 阿里云CDN特殊头
        if ($cdn_name = "aliyun") {
            add_header Ali-Swift-Global-Savetime $date_gmt;
        }
        
        # 腾讯云CDN特殊头
        if ($cdn_name = "tencent") {
            add_header X-Cache-Lookup "Cache Hit";
        }
        
        # 通用缓存头
        add_header Cache-Control "public, max-age=31536000";
        add_header Vary "Accept-Encoding";
        
        # 启用压缩
        gzip on;
        gzip_types text/css application/javascript image/svg+xml;
    }

    # CDN健康检查
    location /cdn-health {
        access_log off;
        return 200 "OK";
    }
}
```

### 7.3 资源版本控制

```nginx
# /etc/nginx/conf.d/asset-versioning.conf
# 静态资源版本控制

# 版本号提取
map $uri $asset_version {
    ~^/assets/(?<ver>v\d+)/ $ver;
    default                  "latest";
}

server {
    listen 80;
    server_name static.example.com;

    # 带版本号的资源（长缓存）
    location ~ ^/assets/v\d+/ {
        root /var/www/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Asset-Version $asset_version;
    }

    # 不带版本的资源（短缓存）
    location /assets/ {
        root /var/www/static;
        expires 1d;
        add_header Cache-Control "public, must-revalidate";
    }

    # 版本映射（latest -> 实际版本）
    location /assets/latest/ {
        # 重写到最新版本
        rewrite ^/assets/latest/(.*)$ /assets/v3/$1 last;
    }
}
```

---

## 8. 安全防护配置

### 8.1 WAF基础配置

```nginx
# /etc/nginx/conf.d/waf.conf
# Web应用防火墙基础配置

# SQL注入检测
map $args $block_sql_injection {
    default 0;
    ~*union.*select 1;
    ~*select.*from 1;
    ~*insert.*into 1;
    ~*delete.*from 1;
    ~*drop.*table 1;
    ~*update.*set 1;
    ~*'.*or.*' 1;
    ~*".*or.*" 1;
}

# XSS检测
map $args $block_xss {
    default 0;
    ~*<script 1;
    ~*javascript: 1;
    ~*onerror= 1;
    ~*onload= 1;
    ~*onclick= 1;
    ~*alert\( 1;
}

# 请求体检测（需要lua模块更完善）
map $request_body $block_request_body {
    default 0;
    ~*<script 1;
    ~*union.*select 1;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # SQL注入拦截
    if ($block_sql_injection = 1) {
        return 403 '{"code":403,"message":"Request blocked by WAF: SQL Injection detected"}';
    }

    # XSS拦截
    if ($block_xss = 1) {
        return 403 '{"code":403,"message":"Request blocked by WAF: XSS detected"}';
    }

    # 请求方法限制
    if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$) {
        return 405;
    }

    # User-Agent检测（拦截已知恶意UA）
    if ($http_user_agent ~* (sqlmap|nikto|nmap|acunetix|netsparker)) {
        return 403;
    }

    # 空User-Agent
    if ($http_user_agent = "") {
        return 403;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        
        # 不转发敏感头
        proxy_set_header X-Original-URL "";
        proxy_set_header X-Rewrite-URL "";
    }
}
```

### 8.2 DDoS防护配置

```nginx
# /etc/nginx/conf.d/ddos-protection.conf
# DDoS防护配置

# 连接限制
limit_conn_zone $binary_remote_addr zone=conn_per_ip:10m;
limit_conn_zone $server_name zone=conn_per_server:10m;

# 请求频率限制
limit_req_zone $binary_remote_addr zone=req_per_ip:10m rate=30r/s;
limit_req_zone $server_name zone=req_per_server:10m rate=10000r/s;

# 请求体大小限制
client_max_body_size 10m;
client_body_buffer_size 128k;

# 请求头大小限制
client_header_buffer_size 1k;
large_client_header_buffers 4 8k;

# 超时设置（防止慢速攻击）
client_body_timeout 10s;
client_header_timeout 10s;
send_timeout 10s;
keepalive_timeout 30s;
keepalive_requests 100;

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # 应用限制
    limit_conn conn_per_ip 20;
    limit_conn conn_per_server 10000;
    limit_req zone=req_per_ip burst=50 nodelay;
    limit_req zone=req_per_server burst=20000;

    # 限制错误响应
    limit_conn_status 429;
    limit_req_status 429;

    # 错误页面
    error_page 429 /429.html;
    location = /429.html {
        root /var/www/error-pages;
        internal;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API更严格的限制
    location /api/ {
        limit_req zone=req_per_ip burst=20 nodelay;
        proxy_pass http://backend;
    }

    # 登录接口最严格
    location /api/login {
        limit_req zone=req_per_ip burst=5;
        proxy_pass http://backend;
    }
}
```

### 8.3 敏感信息防护

```nginx
# /etc/nginx/conf.d/sensitive-protection.conf
# 敏感信息防护

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # 隐藏服务器信息
    server_tokens off;
    more_clear_headers Server;
    more_clear_headers X-Powered-By;

    # 禁止访问敏感文件
    location ~* (\.git|\.svn|\.env|\.htaccess|\.htpasswd|\.DS_Store|Thumbs\.db) {
        deny all;
        return 404;
    }

    # 禁止访问配置文件
    location ~* \.(yml|yaml|toml|ini|conf|config|json)$ {
        # 排除manifest.json
        location = /manifest.json {
            add_header Cache-Control "no-cache";
        }
        deny all;
        return 404;
    }

    # 禁止访问源码
    location ~* \.(php|jsp|asp|aspx|py|rb|java|go)$ {
        deny all;
        return 404;
    }

    # 禁止访问备份文件
    location ~* \.(bak|backup|old|orig|save|swp|tmp)$ {
        deny all;
        return 404;
    }

    # 禁止目录列表
    autoindex off;

    # 安全响应头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理时过滤敏感响应头
    location /api/ {
        proxy_pass http://backend;
        proxy_hide_header X-Powered-By;
        proxy_hide_header Server;
        proxy_hide_header X-AspNet-Version;
        proxy_hide_header X-AspNetMvc-Version;
    }
}
```

---

## 9. 监控与日志分析

### 9.1 ELK日志格式

```nginx
# /etc/nginx/conf.d/elk-logging.conf
# ELK日志采集格式

log_format elk_json escape=json '{'
    '"@timestamp":"$time_iso8601",'
    '"@version":"1",'
    '"host":"$hostname",'
    '"server_name":"$server_name",'
    '"remote_addr":"$remote_addr",'
    '"remote_user":"$remote_user",'
    '"request_method":"$request_method",'
    '"request_uri":"$request_uri",'
    '"request_protocol":"$server_protocol",'
    '"request_length":$request_length,'
    '"request_time":$request_time,'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"bytes_sent":$bytes_sent,'
    '"http_referer":"$http_referer",'
    '"http_user_agent":"$http_user_agent",'
    '"http_x_forwarded_for":"$http_x_forwarded_for",'
    '"upstream_addr":"$upstream_addr",'
    '"upstream_status":"$upstream_status",'
    '"upstream_response_time":"$upstream_response_time",'
    '"upstream_connect_time":"$upstream_connect_time",'
    '"upstream_header_time":"$upstream_header_time",'
    '"ssl_protocol":"$ssl_protocol",'
    '"ssl_cipher":"$ssl_cipher",'
    '"request_id":"$request_id",'
    '"gzip_ratio":"$gzip_ratio"'
'}';

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # 使用ELK格式
    access_log /var/log/nginx/access.json elk_json buffer=64k flush=5s;
    error_log /var/log/nginx/error.log warn;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
    }

    # 不记录的请求
    location ~* \.(js|css|png|jpg|gif|ico|svg|woff|woff2)$ {
        access_log off;
        expires 1y;
    }

    location /health {
        access_log off;
        return 200 "OK";
    }
}
```

### 9.2 Prometheus监控指标

```nginx
# /etc/nginx/conf.d/prometheus.conf
# Prometheus监控配置（需要nginx-vts-exporter模块）

# 如果使用nginx-vts-exporter
# vhost_traffic_status_zone;

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # vts状态页面
    # location /status {
    #     vhost_traffic_status_display;
    #     vhost_traffic_status_display_format html;
    #     allow 10.0.0.0/8;
    #     deny all;
    # }

    # Nginx状态页面（stub_status模块）
    location /nginx_status {
        stub_status on;
        allow 10.0.0.0/8;
        allow 127.0.0.1;
        deny all;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 '{"status":"UP"}';
        add_header Content-Type application/json;
    }

    # 就绪检查
    location /ready {
        access_log off;
        return 200 '{"status":"READY"}';
        add_header Content-Type application/json;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
    }
}
```

### 9.3 自定义监控指标

```nginx
# /etc/nginx/conf.d/custom-metrics.conf
# 自定义业务监控

# 请求计数
log_format metrics '$request_method $status $request_time $upstream_response_time';

# 慢请求日志（大于1秒）
map $request_time $slow_request {
    default 0;
    ~^[1-9] 1;
    ~^\d{2} 1;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # 慢请求日志
    access_log /var/log/nginx/slow.log elk_json if=$slow_request;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        
        # 记录慢API
        if ($request_time > 1) {
            access_log /var/log/nginx/slow-api.log elk_json;
        }
    }

    # 监控端点
    location /metrics {
        # 简单的自定义指标
        default_type text/plain;
        return 200 "nginx_up 1\nnginx_connections_active $connections_active\nnginx_connections_reading $connections_reading\nnginx_connections_writing $connections_writing\nnginx_connections_waiting $connections_waiting\n";
    }
}
```

---

## 10. 性能优化实战

### 10.1 大厂级性能配置

```nginx
# /etc/nginx/nginx.conf
# 大厂级性能优化配置

user nginx;
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;
worker_priority -10;

error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
    worker_connections 65535;
    use epoll;
    multi_accept on;
    accept_mutex off;
}

http {
    # 基础配置
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    charset utf-8;
    server_tokens off;

    # 日志优化
    access_log /var/log/nginx/access.log main buffer=64k flush=5s;
    
    # 文件传输优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 连接优化
    keepalive_timeout 65;
    keepalive_requests 10000;
    reset_timedout_connection on;
    
    # 超时优化
    client_body_timeout 60s;
    client_header_timeout 60s;
    send_timeout 60s;
    
    # 缓冲优化
    client_body_buffer_size 128k;
    client_max_body_size 100m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;
    
    # 代理缓冲优化
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 32k;
    proxy_busy_buffers_size 64k;
    
    # 压缩优化
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml 
               application/xml+rss application/x-javascript
               image/svg+xml;
    
    # 预压缩
    gzip_static on;
    
    # 文件缓存优化
    open_file_cache max=100000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # 哈希表优化
    types_hash_max_size 2048;
    server_names_hash_bucket_size 128;
    variables_hash_max_size 2048;
    
    include /etc/nginx/conf.d/*.conf;
}
```

### 10.2 HTTP/2和HTTP/3优化

```nginx
# /etc/nginx/conf.d/http2-http3.conf
# HTTP/2和HTTP/3优化

server {
    # HTTP/2
    listen 443 ssl http2;
    # HTTP/3 (需要Nginx 1.25+)
    # listen 443 quic reuseport;
    
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # SSL优化
    ssl_certificate /etc/nginx/ssl/example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # SSL会话优化
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 223.5.5.5 valid=300s;
    resolver_timeout 5s;
    
    # HTTP/2特定优化
    http2_max_concurrent_streams 128;
    http2_chunk_size 8k;
    
    # HTTP/3头
    # add_header Alt-Svc 'h3=":443"; ma=86400';

    location / {
        try_files $uri $uri/ /index.html;
    }

    # HTTP/2 Server Push（谨慎使用）
    location = /index.html {
        http2_push /assets/app.js;
        http2_push /assets/app.css;
        http2_push /assets/vendor.js;
    }
}
```

### 10.3 缓存优化策略

```nginx
# /etc/nginx/conf.d/cache-optimization.conf
# 缓存优化策略

# 代理缓存
proxy_cache_path /var/cache/nginx/proxy 
    levels=1:2 
    keys_zone=proxy_cache:200m 
    max_size=50g 
    inactive=7d 
    use_temp_path=off;

# 静态资源缓存
proxy_cache_path /var/cache/nginx/static 
    levels=1:2 
    keys_zone=static_cache:100m 
    max_size=20g 
    inactive=30d;

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # 入口文件（不缓存）
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
        
        # ETag验证
        etag on;
    }

    # 带hash的资源（永久缓存）
    location ~* \.[a-f0-9]{8}\.(js|css|woff2?)$ {
        expires max;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 图片（长缓存+验证）
    location ~* \.(png|jpg|jpeg|gif|webp|svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public";
        etag on;
        access_log off;
    }

    # API缓存
    location /api/public/ {
        proxy_pass http://backend;
        
        proxy_cache proxy_cache;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_valid 200 10m;
        proxy_cache_valid 404 1m;
        
        # 缓存状态头
        add_header X-Cache-Status $upstream_cache_status always;
        
        # 后台更新
        proxy_cache_background_update on;
        proxy_cache_use_stale error timeout updating;
        
        # 缓存锁（防止缓存击穿）
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
    }

    # 私有API（不缓存）
    location /api/user/ {
        proxy_pass http://backend;
        proxy_cache off;
        add_header Cache-Control "no-store";
    }
}
```

---

## 11. 多租户与多域名配置

### 11.1 多租户SaaS配置

```nginx
# /etc/nginx/conf.d/multi-tenant.conf
# 多租户SaaS平台配置

# 租户识别
map $host $tenant_id {
    default         "default";
    ~^(?<tenant>.+)\.example\.com$  $tenant;
}

# 租户后端映射
map $tenant_id $tenant_backend {
    default     http://default-backend:8080;
    "tenant1"   http://tenant1-backend:8080;
    "tenant2"   http://tenant2-backend:8080;
    "tenant3"   http://tenant3-backend:8080;
}

# 租户静态资源路径
map $tenant_id $tenant_root {
    default     /var/www/default/dist;
    "tenant1"   /var/www/tenant1/dist;
    "tenant2"   /var/www/tenant2/dist;
    "tenant3"   /var/www/tenant3/dist;
}

server {
    listen 80;
    server_name *.example.com;

    # 动态设置根目录
    set $root_path $tenant_root;
    root $root_path;

    location / {
        try_files $uri $uri/ /index.html;
        
        # 租户标识注入
        sub_filter '</head>' '<script>window.__TENANT_ID__="$tenant_id";</script></head>';
        sub_filter_once on;
    }

    location /api/ {
        proxy_pass $tenant_backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant-Id $tenant_id;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 租户静态资源
    location /assets/ {
        root $root_path;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 11.2 多域名统一管理

```nginx
# /etc/nginx/conf.d/multi-domain.conf
# 多域名统一管理

# 域名到应用映射
map $host $app_name {
    default                 "main";
    "www.example.com"       "main";
    "app.example.com"       "app";
    "admin.example.com"     "admin";
    "api.example.com"       "api";
    "m.example.com"         "mobile";
    "docs.example.com"      "docs";
}

# 应用根目录
map $app_name $app_root {
    "main"      /var/www/main-app/dist;
    "app"       /var/www/web-app/dist;
    "admin"     /var/www/admin-app/dist;
    "mobile"    /var/www/mobile-app/dist;
    "docs"      /var/www/docs-app/dist;
    default     /var/www/main-app/dist;
}

# 应用后端
map $app_name $app_backend {
    "main"      http://main-backend:8080;
    "app"       http://app-backend:8080;
    "admin"     http://admin-backend:8080;
    "api"       http://api-gateway:8000;
    "mobile"    http://mobile-backend:8080;
    default     http://main-backend:8080;
}

server {
    listen 80;
    listen 443 ssl http2;
    server_name www.example.com app.example.com admin.example.com m.example.com docs.example.com;

    # SSL（通配符证书）
    ssl_certificate /etc/nginx/ssl/example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    # 动态根目录
    set $root_path $app_root;
    root $root_path;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass $app_backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-App-Name $app_name;
    }
}

# API专用域名
server {
    listen 80;
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/nginx/ssl/example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    location / {
        proxy_pass http://api-gateway:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 12. 容灾与降级策略

### 12.1 主备切换配置

```nginx
# /etc/nginx/conf.d/failover.conf
# 主备切换配置

# 主集群
upstream primary_cluster {
    server primary-1.internal:8080 weight=10;
    server primary-2.internal:8080 weight=10;
    server primary-3.internal:8080 weight=10;
}

# 备用集群
upstream backup_cluster {
    server backup-1.internal:8080;
    server backup-2.internal:8080;
}

# 主备切换逻辑
upstream main_with_backup {
    server primary-1.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server primary-2.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    server primary-3.internal:8080 weight=10 max_fails=3 fail_timeout=30s;
    
    # 备用服务器
    server backup-1.internal:8080 backup;
    server backup-2.internal:8080 backup;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://main_with_backup/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        # 快速失败
        proxy_connect_timeout 3s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
        
        # 失败重试到备用
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        proxy_next_upstream_timeout 15s;
        proxy_next_upstream_tries 5;
    }
}
```

### 12.2 静态降级页面

```nginx
# /etc/nginx/conf.d/static-fallback.conf
# 静态降级页面配置

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    # 错误页面目录
    error_page 500 502 503 504 @fallback_page;
    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        proxy_intercept_errors on;
    }

    # 降级页面
    location @fallback_page {
        root /var/www/fallback;
        
        # 根据Accept头返回不同格式
        set $fallback_file /index.html;
        if ($http_accept ~* "application/json") {
            set $fallback_file /fallback.json;
        }
        
        try_files $fallback_file =503;
    }

    # 静态降级API
    location @api_fallback {
        default_type application/json;
        return 503 '{"code":503,"message":"服务暂时不可用，请稍后重试","data":null}';
    }
}

# 降级页面 /var/www/fallback/index.html
# <!DOCTYPE html>
# <html>
# <head>
#     <title>服务维护中</title>
#     <meta charset="utf-8">
#     <style>
#         body { display: flex; justify-content: center; align-items: center; height: 100vh; }
#         .message { text-align: center; }
#     </style>
# </head>
# <body>
#     <div class="message">
#         <h1>服务维护中</h1>
#         <p>我们正在进行系统维护，请稍后再试。</p>
#     </div>
# </body>
# </html>
```

### 12.3 多活架构配置

```nginx
# /etc/nginx/conf.d/multi-active.conf
# 多活架构配置

# 北京机房
upstream beijing_dc {
    server bj-1.internal:8080 weight=10;
    server bj-2.internal:8080 weight=10;
    keepalive 64;
}

# 上海机房
upstream shanghai_dc {
    server sh-1.internal:8080 weight=10;
    server sh-2.internal:8080 weight=10;
    keepalive 64;
}

# 深圳机房
upstream shenzhen_dc {
    server sz-1.internal:8080 weight=10;
    server sz-2.internal:8080 weight=10;
    keepalive 64;
}

# 根据客户端IP选择最近机房
geo $nearest_dc {
    default         shanghai_dc;     # 默认上海
    10.1.0.0/16     beijing_dc;      # 北京内网
    10.2.0.0/16     shanghai_dc;     # 上海内网
    10.3.0.0/16     shenzhen_dc;     # 深圳内网
}

# 故障转移顺序
map $nearest_dc $failover_dc {
    beijing_dc      shanghai_dc;
    shanghai_dc     shenzhen_dc;
    shenzhen_dc     beijing_dc;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/vue3-app/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        # 尝试最近机房
        proxy_pass http://$nearest_dc/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-DC $nearest_dc;
        
        # 快速失败
        proxy_connect_timeout 2s;
        proxy_read_timeout 5s;
        
        # 失败后尝试故障转移机房
        proxy_intercept_errors on;
        error_page 502 503 504 = @failover;
    }

    location @failover {
        proxy_pass http://$failover_dc$request_uri;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-DC $failover_dc;
        proxy_set_header X-Failover "true";
    }
}
```

---

## 13. DevOps自动化配置

### 13.1 CI/CD集成配置

```nginx
# /etc/nginx/conf.d/cicd.conf
# CI/CD自动化部署配置

# 蓝绿部署
map $cookie_deployment_slot $deployment_root {
    "blue"      /var/www/vue3-app/blue;
    "green"     /var/www/vue3-app/green;
    default     /var/www/vue3-app/current;  # 软链接到当前版本
}

server {
    listen 80;
    server_name www.example.com;

    # 动态根目录
    set $root_path $deployment_root;
    root $root_path;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 部署版本信息
    location /version {
        default_type application/json;
        alias /var/www/vue3-app/current/version.json;
    }

    # 部署健康检查
    location /deploy-health {
        access_log off;
        return 200 '{"status":"UP","slot":"$deployment_root"}';
        add_header Content-Type application/json;
    }

    # 切换部署槽（内部使用）
    location /__switch_slot__ {
        allow 10.0.0.0/8;
        deny all;
        
        if ($arg_slot = "blue") {
            add_header Set-Cookie "deployment_slot=blue; Path=/";
            return 200 "Switched to blue";
        }
        if ($arg_slot = "green") {
            add_header Set-Cookie "deployment_slot=green; Path=/";
            return 200 "Switched to green";
        }
        return 400 "Invalid slot";
    }
}

# 部署脚本会更新 /var/www/vue3-app/current 软链接
# ln -sfn /var/www/vue3-app/blue /var/www/vue3-app/current
```

### 13.2 配置热更新

```bash
#!/bin/bash
# deploy-nginx-config.sh
# Nginx配置热更新脚本

CONFIG_DIR="/etc/nginx/conf.d"
BACKUP_DIR="/etc/nginx/conf.d.backup"
NEW_CONFIG_DIR="/tmp/new-nginx-config"

# 备份当前配置
backup_config() {
    mkdir -p $BACKUP_DIR
    cp -r $CONFIG_DIR/* $BACKUP_DIR/
    echo "Backed up current config to $BACKUP_DIR"
}

# 测试新配置
test_config() {
    nginx -t -c /etc/nginx/nginx.conf
    return $?
}

# 应用新配置
apply_config() {
    cp -r $NEW_CONFIG_DIR/* $CONFIG_DIR/
    nginx -t && nginx -s reload
    return $?
}

# 回滚配置
rollback_config() {
    cp -r $BACKUP_DIR/* $CONFIG_DIR/
    nginx -s reload
    echo "Rolled back to previous config"
}

# 主流程
main() {
    backup_config
    
    if apply_config; then
        echo "Config updated successfully"
    else
        echo "Config update failed, rolling back..."
        rollback_config
        exit 1
    fi
}

main
```

### 13.3 Kubernetes Nginx Ingress配置

```yaml
# nginx-ingress-values.yaml
# Nginx Ingress Controller配置

controller:
  replicaCount: 3
  
  config:
    # 性能优化
    worker-processes: "auto"
    worker-connections: "65535"
    keep-alive: "75"
    keep-alive-requests: "10000"
    
    # 代理配置
    proxy-connect-timeout: "10"
    proxy-read-timeout: "60"
    proxy-send-timeout: "60"
    proxy-buffer-size: "8k"
    proxy-buffers-number: "4"
    
    # 压缩
    use-gzip: "true"
    gzip-level: "5"
    gzip-types: "application/javascript application/json text/css text/plain"
    
    # 日志
    log-format-upstream: '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time $upstream_response_time'
    
    # SSL
    ssl-protocols: "TLSv1.2 TLSv1.3"
    ssl-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256"
    
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi

  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70

  metrics:
    enabled: true
    serviceMonitor:
      enabled: true
```

### 13.4 Ingress资源配置

```yaml
# vue3-app-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vue3-app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-XSS-Protection "1; mode=block" always;
    nginx.ingress.kubernetes.io/server-snippet: |
      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
      }
spec:
  tls:
  - hosts:
    - www.example.com
    secretName: example-com-tls
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vue3-app-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 8000
```

---

## 附录：企业级配置检查清单

### 安全检查清单

- [ ] 隐藏服务器版本信息
- [ ] 配置HTTPS和HSTS
- [ ] 设置安全响应头
- [ ] 限制请求方法
- [ ] 配置请求限流
- [ ] 禁止访问敏感文件
- [ ] 配置WAF规则
- [ ] 定期更新SSL证书

### 性能检查清单

- [ ] 启用gzip/brotli压缩
- [ ] 配置静态资源缓存
- [ ] 启用keepalive
- [ ] 配置适当的缓冲区
- [ ] 启用HTTP/2
- [ ] 配置文件缓存
- [ ] 优化工作进程数
- [ ] 配置CDN

### 高可用检查清单

- [ ] 配置健康检查
- [ ] 设置故障转移
- [ ] 配置会话保持
- [ ] 设置合理超时
- [ ] 配置熔断降级
- [ ] 配置多机房容灾
- [ ] 配置自动扩容

### 监控检查清单

- [ ] 配置访问日志
- [ ] 配置错误日志
- [ ] 暴露监控指标
- [ ] 配置慢请求日志
- [ ] 集成APM系统
- [ ] 配置告警规则

---

> 本文档基于阿里、腾讯、字节、美团等大厂的实际生产配置经验整理。实际使用时请根据业务需求和基础设施情况进行调整。
