# NestJS 完全指南 - 基础语法篇
<div class="doc-toc">
## 目录

1. [NestJS 简介](#1-nestjs-简介)
2. [项目初始化与配置](#2-项目初始化与配置)
3. [核心装饰器](#3-核心装饰器)
4. [模块系统 Module](#4-模块系统-module)
5. [控制器 Controller](#5-控制器-controller)
6. [服务与依赖注入 Provider](#6-服务与依赖注入-provider)
7. [请求与响应处理](#7-请求与响应处理)
8. [DTO 数据传输对象](#8-dto-数据传输对象)
9. [基础验证与管道](#9-基础验证与管道)


</div>

---

## 1. NestJS 简介

### 1.1 什么是 NestJS

NestJS 是一个用于构建高效、可扩展的 Node.js 服务端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript，同时结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数式响应编程）的元素。

### 1.2 核心特性

```typescript
/**
 * NestJS 核心特性:
 * 1. 模块化架构 - 基于模块组织代码
 * 2. 依赖注入 - IoC 容器管理依赖
 * 3. 装饰器驱动 - 使用装饰器声明式编程
 * 4. 平台无关 - 支持 Express/Fastify
 * 5. TypeScript 优先 - 完整的类型支持
 * 6. 开箱即用 - 内置多种功能模块
 */
```

### 1.3 架构图解

```
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Module    │  │   Module    │  │   Module    │          │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │
│  │ │Controller│ │  │ │Controller│ │  │ │Controller│ │          │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │          │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │
│  │ │ Service │ │  │ │ Service │ │  │ │ Service │ │          │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Middleware → Guards → Interceptors → Pipes → Exception     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 项目初始化与配置

### 2.1 创建项目

```bash
# 全局安装 NestJS CLI
npm install -g @nestjs/cli

# 创建新项目
nest new project-name

# 选择包管理器
? Which package manager would you ❤️  to use?
  npm
  yarn
> pnpm
```

### 2.2 项目结构

```
project-name/
├── src/
│   ├── app.controller.ts      # 基础控制器
│   ├── app.controller.spec.ts # 控制器测试
│   ├── app.module.ts          # 根模块
│   ├── app.service.ts         # 基础服务
│   └── main.ts                # 应用入口
├── test/                      # E2E 测试目录
├── nest-cli.json              # CLI 配置
├── tsconfig.json              # TypeScript 配置
└── package.json
```

### 2.3 入口文件 main.ts

```typescript
// main.ts - 应用入口文件
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 创建应用实例
  const app = await NestFactory.create(AppModule);
  
  // 全局配置
  app.setGlobalPrefix('api');           // API 前缀
  app.useGlobalPipes(new ValidationPipe()); // 全局验证管道
  app.enableCors();                     // 启用 CORS
  
  // 监听端口
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

**使用场景**：企业级项目通常在 main.ts 中配置全局前缀、CORS、Swagger 文档、全局管道等。

### 2.4 使用 Fastify 替代 Express

```typescript
// main.ts - 使用 Fastify 平台
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

**使用场景**：高并发场景下，Fastify 比 Express 性能更好，大厂在需要极致性能时会选择 Fastify。

---

## 3. 核心装饰器

### 3.1 类装饰器

```typescript
import { 
  Module, 
  Controller, 
  Injectable, 
  Global,
  Catch,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';

// @Module() - 定义模块
@Module({
  imports: [],      // 导入的模块
  controllers: [],  // 控制器
  providers: [],    // 服务提供者
  exports: []       // 导出的服务
})
export class UserModule {}

// @Controller() - 定义控制器
@Controller('users')  // 路由前缀 /users
export class UserController {}

// @Injectable() - 定义可注入的服务
@Injectable()
export class UserService {}

// @Global() - 定义全局模块
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
```

### 3.2 方法装饰器 - HTTP 请求

```typescript
import {
  Get, Post, Put, Patch, Delete,
  Head, Options, All,
  HttpCode, Header, Redirect, Render
} from '@nestjs/common';

@Controller('users')
export class UserController {
  
  // GET 请求
  @Get()
  findAll() {
    return 'Get all users';
  }
  
  // GET 带参数
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Get user ${id}`;
  }
  
  // POST 请求
  @Post()
  @HttpCode(201)  // 设置状态码
  @Header('Cache-Control', 'none')  // 设置响应头
  create(@Body() createUserDto: CreateUserDto) {
    return 'Create user';
  }
  
  // PUT 请求 - 完整更新
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return `Update user ${id}`;
  }
  
  // PATCH 请求 - 部分更新
  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: Partial<UpdateUserDto>) {
    return `Partial update user ${id}`;
  }
  
  // DELETE 请求
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Delete user ${id}`;
  }
  
  // 重定向
  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  redirect() {
    // 可以动态修改重定向
    return { url: 'https://docs.nestjs.com', statusCode: 302 };
  }
  
  // 匹配所有 HTTP 方法
  @All('all')
  handleAll() {
    return 'Handle all methods';
  }
}
```

**使用场景**：RESTful API 设计中，不同的 HTTP 方法对应不同的操作，GET 获取、POST 创建、PUT 更新、DELETE 删除。

### 3.3 参数装饰器

```typescript
import {
  Param, Query, Body, Headers, Req, Res,
  Session, Ip, HostParam, Next
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('users')
export class UserController {
  
  // @Param() - 获取路由参数
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }
  
  // @Param() - 获取所有路由参数
  @Get(':category/:id')
  findByCategory(@Param() params: { category: string; id: string }) {
    return params;
  }
  
  // @Query() - 获取查询参数
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt'
  ) {
    return { page, limit, sort };
  }
  
  // @Query() - 获取所有查询参数
  @Get('search')
  search(@Query() query: any) {
    return query;
  }
  
  // @Body() - 获取请求体
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
  
  // @Body() - 获取请求体中的特定字段
  @Post('partial')
  createPartial(@Body('name') name: string) {
    return { name };
  }
  
  // @Headers() - 获取请求头
  @Get('headers')
  getHeaders(
    @Headers('authorization') auth: string,
    @Headers() headers: Record<string, string>
  ) {
    return { auth, allHeaders: headers };
  }
  
  // @Req() @Res() - 获取原生请求/响应对象
  @Get('native')
  native(@Req() req: Request, @Res() res: Response) {
    res.status(200).json({ path: req.path });
  }
  
  // @Ip() - 获取客户端 IP
  @Get('ip')
  getIp(@Ip() ip: string) {
    return { ip };
  }
  
  // @Session() - 获取 Session
  @Get('session')
  getSession(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;
    return { visits: session.visits };
  }
}
```

**使用场景**：大厂项目中，参数装饰器用于从请求中提取数据，配合 DTO 进行数据验证，保证接口的健壮性。

### 3.4 自定义装饰器

```typescript
// decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// 自定义参数装饰器 - 获取当前用户
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);

// 使用示例
@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: User) {
    return user;
  }
  
  @Get('email')
  getEmail(@CurrentUser('email') email: string) {
    return { email };
  }
}

// 自定义元数据装饰器
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 使用示例
@Controller('admin')
export class AdminController {
  @Post()
  @Roles('admin', 'superadmin')
  create() {
    return 'Only admin can access';
  }
}

// 组合装饰器
import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard)
  );
}

// 使用组合装饰器
@Controller('users')
export class UserController {
  @Post()
  @Auth('admin')  // 一个装饰器实现认证+授权
  create() {
    return 'Create user';
  }
}
```

**使用场景**：企业级项目中，自定义装饰器用于封装通用逻辑，如获取当前用户、权限验证、日志记录等。

---

## 4. 模块系统 Module

### 4.1 基础模块定义

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [],                           // 导入其他模块
  controllers: [UserController],         // 注册控制器
  providers: [UserService, UserRepository], // 注册服务
  exports: [UserService]                 // 导出服务供其他模块使用
})
export class UserModule {}
```

### 4.2 模块导入与导出

```typescript
// 场景: 订单模块需要使用用户服务

// user.module.ts
@Module({
  providers: [UserService],
  exports: [UserService]  // 导出 UserService
})
export class UserModule {}

// order.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [UserModule],  // 导入 UserModule
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}

// order.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class OrderService {
  constructor(private userService: UserService) {}  // 可以注入 UserService
  
  async createOrder(userId: string, data: any) {
    const user = await this.userService.findById(userId);
    // 创建订单逻辑
  }
}
```

### 4.3 全局模块

```typescript
// config.module.ts - 全局配置模块
import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()  // 标记为全局模块
@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}

// 全局模块只需在根模块导入一次，其他模块无需再次导入即可使用
// app.module.ts
@Module({
  imports: [ConfigModule, UserModule, OrderModule]
})
export class AppModule {}

// 任何模块都可以直接注入 ConfigService
@Injectable()
export class UserService {
  constructor(private configService: ConfigService) {}
}
```

**使用场景**：配置服务、日志服务、缓存服务等全局通用服务，设置为全局模块避免重复导入。

### 4.4 动态模块

```typescript
// database.module.ts - 动态模块
import { Module, DynamicModule } from '@nestjs/common';

export interface DatabaseModuleOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,  // 可设置为全局
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options
        },
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async (options: DatabaseModuleOptions) => {
            // 创建数据库连接
            return await createConnection(options);
          },
          inject: ['DATABASE_OPTIONS']
        }
      ],
      exports: ['DATABASE_CONNECTION']
    };
  }
  
  // 异步配置
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async (options: DatabaseModuleOptions) => {
            return await createConnection(options);
          },
          inject: ['DATABASE_OPTIONS']
        }
      ],
      exports: ['DATABASE_CONNECTION']
    };
  }
}

// 使用动态模块
// app.module.ts
@Module({
  imports: [
    // 同步配置
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'mydb'
    }),
    
    // 异步配置 - 从配置服务获取
    DatabaseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME')
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

**使用场景**：大厂项目中，数据库、缓存、消息队列等模块通常使用动态模块，支持根据环境动态配置。

### 4.5 模块重导出

```typescript
// common.module.ts - 聚合模块
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [ConfigModule, LoggerModule, CacheModule],
  exports: [ConfigModule, LoggerModule, CacheModule]  // 重导出
})
export class CommonModule {}

// 其他模块只需导入 CommonModule 即可使用所有通用服务
@Module({
  imports: [CommonModule]
})
export class UserModule {}
```

---

## 5. 控制器 Controller

### 5.1 基础控制器

```typescript
// user.controller.ts
import {
  Controller, Get, Post, Put, Delete,
  Param, Query, Body, ParseIntPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  // GET /users
  @Get()
  async findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }
  
  // GET /users/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  
  // POST /users
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  // PUT /users/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }
  
  // DELETE /users/:id
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
```

### 5.2 路由通配符与版本控制

```typescript
// 路由通配符
@Controller('files')
export class FileController {
  // 匹配 /files/ab_cd, /files/abecd 等
  @Get('ab*cd')
  findWildcard() {
    return 'Wildcard route';
  }
}

// API 版本控制
// main.ts
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // URI 版本控制: /v1/users, /v2/users
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  
  // Header 版本控制
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-Version'
  });
  
  // Media Type 版本控制
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v='
  });
  
  await app.listen(3000);
}

// 控制器版本
@Controller({
  path: 'users',
  version: '1'
})
export class UserV1Controller {
  @Get()
  findAll() {
    return 'V1 users';
  }
}

@Controller({
  path: 'users',
  version: '2'
})
export class UserV2Controller {
  @Get()
  findAll() {
    return 'V2 users with enhanced features';
  }
}

// 方法级别版本控制
@Controller('users')
export class UserController {
  @Version('1')
  @Get()
  findAllV1() {
    return 'V1 users';
  }
  
  @Version('2')
  @Get()
  findAllV2() {
    return 'V2 users';
  }
  
  @Version(['1', '2'])  // 多版本共用
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `User ${id}`;
  }
}
```

**使用场景**：大厂 API 演进时，版本控制确保旧版客户端兼容性，逐步迁移到新版本。

### 5.3 子域路由

```typescript
// 子域路由
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index() {
    return 'Admin page';
  }
}

@Controller({ host: 'api.example.com' })
export class ApiController {
  @Get()
  index() {
    return 'API endpoint';
  }
}

// 动态子域
@Controller({ host: ':tenant.example.com' })
export class TenantController {
  @Get()
  index(@HostParam('tenant') tenant: string) {
    return `Tenant: ${tenant}`;
  }
}
```

**使用场景**：SaaS 多租户系统，不同租户使用不同子域名访问。

### 5.4 异步控制器

```typescript
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  
  // 返回 Promise
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  
  // 返回 Observable (RxJS)
  @Get('stream')
  findAllStream(): Observable<User[]> {
    return this.userService.findAllStream();
  }
  
  // 服务端发送事件 (SSE)
  @Sse('events')
  events(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(num => ({
        data: { message: `Event ${num}` }
      } as MessageEvent))
    );
  }
}
```

---

## 6. 服务与依赖注入 Provider

### 6.1 基础服务

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private users: User[] = [];
  
  findAll(): User[] {
    return this.users;
  }
  
  findOne(id: number): User {
    return this.users.find(user => user.id === id);
  }
  
  create(createUserDto: CreateUserDto): User {
    const user = { id: Date.now(), ...createUserDto };
    this.users.push(user);
    return user;
  }
  
  update(id: number, updateUserDto: UpdateUserDto): User {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updateUserDto };
      return this.users[index];
    }
    return null;
  }
  
  remove(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

### 6.2 Provider 注册方式

```typescript
// user.module.ts
import { Module } from '@nestjs/common';

@Module({
  providers: [
    // 1. 标准方式 - 类作为 Provider
    UserService,
    
    // 2. useClass - 显式指定类
    {
      provide: UserService,
      useClass: UserService
    },
    
    // 3. useClass - 条件替换
    {
      provide: UserService,
      useClass: process.env.NODE_ENV === 'test' 
        ? MockUserService 
        : UserService
    },
    
    // 4. useValue - 使用具体值
    {
      provide: 'CONFIG',
      useValue: {
        apiKey: 'xxx',
        apiSecret: 'yyy'
      }
    },
    
    // 5. useFactory - 工厂函数
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const config = configService.getDatabaseConfig();
        return await createConnection(config);
      },
      inject: [ConfigService]  // 注入依赖
    },
    
    // 6. useExisting - 别名
    {
      provide: 'AliasedUserService',
      useExisting: UserService
    }
  ]
})
export class UserModule {}
```

### 6.3 依赖注入方式

```typescript
// 1. 构造函数注入 (推荐)
@Injectable()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService
  ) {}
}

// 2. 属性注入
@Injectable()
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;
  
  @Inject('CONFIG')
  private readonly config: any;
}

// 3. 可选依赖
@Injectable()
export class UserService {
  constructor(
    @Optional() @Inject('OPTIONAL_SERVICE') 
    private readonly optionalService?: OptionalService
  ) {}
}

// 4. 自我注入 (处理循环依赖)
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService
  ) {}
}
```

### 6.4 作用域

```typescript
import { Injectable, Scope } from '@nestjs/common';

// 1. 默认 - 单例 (整个应用生命周期)
@Injectable()
export class SingletonService {}

// 2. 请求作用域 (每个请求创建新实例)
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Inject(REQUEST) private request: Request) {}
}

// 3. 瞬态作用域 (每次注入创建新实例)
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}

// 模块级别设置作用域
@Module({
  providers: [
    {
      provide: UserService,
      useClass: UserService,
      scope: Scope.REQUEST
    }
  ]
})
export class UserModule {}
```

**使用场景**：
- **单例**：无状态服务，如配置服务、工具服务
- **请求作用域**：需要访问请求上下文的服务，如租户服务、当前用户服务
- **瞬态**：每次需要独立实例的服务，如报表生成器

### 6.5 生命周期钩子

```typescript
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  BeforeApplicationShutdown
} from '@nestjs/common';

@Injectable()
export class DatabaseService implements 
  OnModuleInit, 
  OnModuleDestroy,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  BeforeApplicationShutdown {
  
  private connection: any;
  
  // 模块初始化时调用
  async onModuleInit() {
    console.log('Module initialized');
    this.connection = await this.createConnection();
  }
  
  // 应用启动完成后调用
  async onApplicationBootstrap() {
    console.log('Application bootstrapped');
    await this.runMigrations();
  }
  
  // 应用关闭前调用 (在 onApplicationShutdown 之前)
  async beforeApplicationShutdown(signal?: string) {
    console.log(`Application shutting down: ${signal}`);
    await this.saveState();
  }
  
  // 应用关闭时调用
  async onApplicationShutdown(signal?: string) {
    console.log(`Application shutdown: ${signal}`);
    await this.connection.close();
  }
  
  // 模块销毁时调用
  async onModuleDestroy() {
    console.log('Module destroyed');
    await this.cleanup();
  }
}

// 启用关闭钩子
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();  // 启用关闭钩子
  await app.listen(3000);
}
```

**使用场景**：数据库连接管理、缓存预热、优雅关闭等场景。

---

## 7. 请求与响应处理

### 7.1 响应处理

```typescript
import {
  Controller, Get, Post, Res, HttpStatus,
  HttpCode, Header, StreamableFile
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('response')
export class ResponseController {
  
  // 标准响应 - NestJS 自动序列化
  @Get('standard')
  standard() {
    return { message: 'Hello' };
  }
  
  // 自定义状态码
  @Post()
  @HttpCode(201)
  create() {
    return { created: true };
  }
  
  // 自定义响应头
  @Get('headers')
  @Header('X-Custom-Header', 'custom-value')
  @Header('Cache-Control', 'max-age=3600')
  customHeaders() {
    return { data: 'with custom headers' };
  }
  
  // 使用 Express Response 对象
  @Get('express')
  expressResponse(@Res() res: Response) {
    res.status(200).json({ message: 'Express response' });
  }
  
  // 使用 passthrough 模式 (同时使用 NestJS 和 Express 特性)
  @Get('passthrough')
  passthrough(@Res({ passthrough: true }) res: Response) {
    res.header('X-Custom', 'value');
    return { message: 'Passthrough mode' };  // NestJS 处理序列化
  }
  
  // 文件下载
  @Get('download')
  download(@Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"'
    });
    file.pipe(res);
  }
  
  // StreamableFile - 推荐的文件响应方式
  @Get('stream')
  stream(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file, {
      type: 'application/json',
      disposition: 'attachment; filename="package.json"'
    });
  }
}
```

### 7.2 统一响应格式

```typescript
// common/interfaces/response.interface.ts
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        code: 200,
        message: 'success',
        data,
        timestamp: new Date().toISOString()
      }))
    );
  }
}

// 全局注册
// main.ts
app.useGlobalInterceptors(new TransformInterceptor());

// 响应示例
// GET /users/1
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "John"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**使用场景**：大厂项目统一响应格式，便于前端处理和错误追踪。

---

## 8. DTO 数据传输对象

### 8.1 创建 DTO

```typescript
// dto/create-user.dto.ts
import { 
  IsString, IsEmail, IsOptional, IsInt, 
  Min, Max, MinLength, MaxLength, IsEnum,
  ValidateNested, IsArray, ArrayMinSize,
  IsPhoneNumber, IsUrl, Matches
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export class AddressDto {
  @IsString()
  street: string;
  
  @IsString()
  city: string;
  
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  zipCode: string;
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number'
  })
  password: string;
  
  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;
  
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  @Type(() => Number)  // 转换字符串为数字
  age?: number;
  
  @IsEnum(UserRole)
  role: UserRole;
  
  @IsOptional()
  @IsUrl()
  avatar?: string;
  
  @IsOptional()
  @ValidateNested()  // 嵌套验证
  @Type(() => AddressDto)
  address?: AddressDto;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })  // 验证数组中的每个元素
  @ArrayMinSize(1)
  tags?: string[];
  
  @Transform(({ value }) => value?.trim())  // 转换处理
  @IsString()
  username: string;
}
```

### 8.2 更新 DTO (使用 PartialType)

```typescript
// dto/update-user.dto.ts
import { PartialType, PickType, OmitType, IntersectionType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType - 所有字段变为可选
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// PickType - 只选择部分字段
export class UpdatePasswordDto extends PickType(CreateUserDto, ['password'] as const) {}

// OmitType - 排除部分字段
export class CreateUserWithoutPasswordDto extends OmitType(CreateUserDto, ['password'] as const) {}

// IntersectionType - 合并多个 DTO
class AdditionalUserInfo {
  @IsString()
  department: string;
}

export class CreateEmployeeDto extends IntersectionType(
  CreateUserDto,
  AdditionalUserInfo
) {}
```

### 8.3 查询 DTO

```typescript
// dto/query-user.dto.ts
import { IsOptional, IsInt, Min, Max, IsEnum, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
  
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
  
  // 计算偏移量
  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  keyword?: string;
  
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
  
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
```

### 8.4 Swagger 文档装饰器

```typescript
// dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  name: string;
  
  @ApiProperty({
    description: '邮箱地址',
    example: 'john@example.com'
  })
  @IsEmail()
  email: string;
  
  @ApiPropertyOptional({
    description: '年龄',
    minimum: 0,
    maximum: 150,
    example: 25
  })
  @IsOptional()
  @IsInt()
  age?: number;
  
  @ApiProperty({
    description: '用户角色',
    enum: UserRole,
    example: UserRole.USER
  })
  @IsEnum(UserRole)
  role: UserRole;
}
```

---

## 9. 基础验证与管道

### 9.1 启用全局验证

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // 去除 DTO 中未定义的属性
    forbidNonWhitelisted: true, // 存在未定义属性时抛出错误
    transform: true,           // 自动转换类型
    transformOptions: {
      enableImplicitConversion: true  // 隐式类型转换
    },
    disableErrorMessages: false,  // 生产环境可设为 true
    validationError: {
      target: false,  // 不在错误中暴露目标对象
      value: false    // 不在错误中暴露值
    }
  }));
  
  await app.listen(3000);
}
```

### 9.2 内置管道

```typescript
import {
  ParseIntPipe, ParseFloatPipe, ParseBoolPipe,
  ParseArrayPipe, ParseUUIDPipe, ParseEnumPipe,
  DefaultValuePipe, ValidationPipe
} from '@nestjs/common';

@Controller('users')
export class UserController {
  
  // ParseIntPipe - 转换为整数
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return { id, type: typeof id };  // number
  }
  
  // 自定义错误状态码
  @Get('v2/:id')
  findOneV2(
    @Param('id', new ParseIntPipe({ 
      errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE 
    })) 
    id: number
  ) {
    return { id };
  }
  
  // ParseBoolPipe - 转换为布尔值
  @Get()
  findAll(@Query('active', ParseBoolPipe) active: boolean) {
    return { active, type: typeof active };  // boolean
  }
  
  // ParseArrayPipe - 转换为数组
  @Get('batch')
  findBatch(
    @Query('ids', new ParseArrayPipe({ 
      items: Number, 
      separator: ',' 
    })) 
    ids: number[]
  ) {
    return { ids };  // [1, 2, 3]
  }
  
  // ParseUUIDPipe - 验证 UUID
  @Get('uuid/:id')
  findByUuid(@Param('id', ParseUUIDPipe) id: string) {
    return { id };
  }
  
  // ParseEnumPipe - 验证枚举
  @Get('role/:role')
  findByRole(
    @Param('role', new ParseEnumPipe(UserRole)) 
    role: UserRole
  ) {
    return { role };
  }
  
  // DefaultValuePipe - 默认值
  @Get('list')
  findList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return { page, limit };
  }
}
```

### 9.3 自定义管道

```typescript
// pipes/parse-date.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date format: ${value}`);
    }
    return date;
  }
}

// 使用
@Get('date/:date')
findByDate(@Param('date', ParseDatePipe) date: Date) {
  return { date };
}

// pipes/trim.pipe.ts - 字符串处理管道
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    return value;
  }
}

// pipes/file-validation.pipe.ts - 文件验证管道
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSize: number = 5 * 1024 * 1024,  // 5MB
    private readonly allowedTypes: string[] = ['image/jpeg', 'image/png']
  ) {}
  
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    if (file.size > this.maxSize) {
      throw new BadRequestException(`File size exceeds ${this.maxSize} bytes`);
    }
    
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }
    
    return file;
  }
}
```

### 9.4 管道的作用范围

```typescript
// 1. 参数级别
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}

// 2. 方法级别
@Post()
@UsePipes(ValidationPipe)
create(@Body() dto: CreateUserDto) {}

// 3. 控制器级别
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {}

// 4. 全局级别 (main.ts)
app.useGlobalPipes(new ValidationPipe());

// 5. 通过模块注册全局管道
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}
```

---

## 总结

本篇文档涵盖了 NestJS 的基础语法，包括：

1. **项目初始化** - CLI 创建项目、项目结构、入口配置
2. **核心装饰器** - 类装饰器、方法装饰器、参数装饰器、自定义装饰器
3. **模块系统** - 模块定义、导入导出、全局模块、动态模块
4. **控制器** - 路由定义、版本控制、子域路由
5. **服务与依赖注入** - Provider 类型、注入方式、作用域、生命周期
6. **请求响应处理** - 参数获取、响应处理、统一格式
7. **DTO** - 数据验证、类型转换、Swagger 文档
8. **管道** - 内置管道、自定义管道、验证管道

下一篇将介绍 NestJS 的进阶功能：中间件、守卫、拦截器、异常过滤器等。
