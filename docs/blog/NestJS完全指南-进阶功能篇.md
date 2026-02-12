# NestJS 完全指南 - 进阶功能篇
<div class="doc-toc">
## 目录

1. [中间件 Middleware](#1-中间件-middleware)
2. [异常过滤器 Exception Filters](#2-异常过滤器-exception-filters)
3. [守卫 Guards](#3-守卫-guards)
4. [拦截器 Interceptors](#4-拦截器-interceptors)
5. [自定义装饰器进阶](#5-自定义装饰器进阶)
6. [请求生命周期](#6-请求生命周期)
7. [配置管理](#7-配置管理)
8. [日志系统](#8-日志系统)
9. [文件上传](#9-文件上传)
10. [定时任务](#10-定时任务)


</div>

---

## 1. 中间件 Middleware

### 1.1 类中间件

```typescript
// middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();
    
    // 响应完成后记录
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;
      
      console.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${duration}ms`
      );
    });
    
    next();
  }
}
```

### 1.2 函数中间件

```typescript
// middleware/cors.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
}
```

### 1.3 注册中间件

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { corsMiddleware } from './middleware/cors.middleware';

@Module({
  imports: [UserModule, OrderModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // 应用到所有路由
      .apply(LoggerMiddleware)
      .forRoutes('*')
      
      // 应用到特定路由
      .apply(AuthMiddleware)
      .forRoutes('users', 'orders')
      
      // 使用路由配置对象
      .apply(RateLimitMiddleware)
      .forRoutes(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST }
      )
      
      // 排除特定路由
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET }
      )
      .forRoutes('*')
      
      // 应用到控制器
      .apply(LoggerMiddleware)
      .forRoutes(UserController, OrderController)
      
      // 多个中间件
      .apply(corsMiddleware, LoggerMiddleware, AuthMiddleware)
      .forRoutes('*');
  }
}
```

### 1.4 全局中间件

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局中间件
  app.use(helmet());           // 安全头
  app.use(compression());      // 响应压缩
  
  // 自定义全局中间件
  app.use((req, res, next) => {
    req.requestTime = Date.now();
    next();
  });
  
  await app.listen(3000);
}
```

### 1.5 企业级中间件示例

```typescript
// middleware/request-id.middleware.ts - 请求追踪
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] as string || uuidv4();
    req['requestId'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  }
}

// middleware/rate-limit.middleware.ts - 限流
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly limit = 100;  // 每分钟100次
  private readonly windowMs = 60000;
  
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const now = Date.now();
    
    const record = this.requests.get(ip);
    
    if (!record || now > record.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
    } else {
      record.count++;
      if (record.count > this.limit) {
        throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
      }
    }
    
    res.setHeader('X-RateLimit-Limit', this.limit);
    res.setHeader('X-RateLimit-Remaining', this.limit - (record?.count || 1));
    
    next();
  }
}

// middleware/tenant.middleware.ts - 多租户
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    
    if (!tenantId) {
      throw new HttpException('Tenant ID required', HttpStatus.BAD_REQUEST);
    }
    
    const tenant = await this.tenantService.findById(tenantId);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    
    req['tenant'] = tenant;
    next();
  }
}
```

**使用场景**：
- **日志中间件**：记录请求日志，便于问题排查
- **请求ID中间件**：分布式追踪，关联日志
- **限流中间件**：防止API滥用
- **租户中间件**：SaaS多租户系统

---

## 2. 异常过滤器 Exception Filters

### 2.1 内置异常

```typescript
import {
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException
} from '@nestjs/common';

@Controller('users')
export class UserController {
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    
    return user;
  }
  
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const exists = await this.userService.findByEmail(dto.email);
    
    if (exists) {
      throw new ConflictException('Email already exists');
    }
    
    return this.userService.create(dto);
  }
  
  // 自定义异常内容
  @Get('custom')
  customError() {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'Custom error message',
      code: 'CUSTOM_ERROR_001'
    }, HttpStatus.FORBIDDEN);
  }
}
```

### 2.2 自定义异常

```typescript
// exceptions/business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly status: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super({ code, message }, status);
  }
}

// exceptions/user.exception.ts
export class UserNotFoundException extends BusinessException {
  constructor(userId: string) {
    super('USER_NOT_FOUND', `User ${userId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends BusinessException {
  constructor(email: string) {
    super('USER_ALREADY_EXISTS', `User with email ${email} already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends BusinessException {
  constructor() {
    super('INVALID_CREDENTIALS', 'Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}

// 使用
@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  if (!user) {
    throw new InvalidCredentialsException();
  }
  return this.authService.login(user);
}
```

### 2.3 异常过滤器

```typescript
// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || 'Unknown error'
    };
    
    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception.stack
    );
    
    response.status(status).json(errorResponse);
  }
}

// filters/all-exception.filter.ts - 捕获所有异常
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';
    
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception)
    );
    
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message
    });
  }
}
```

### 2.4 注册异常过滤器

```typescript
// 1. 方法级别
@Post()
@UseFilters(HttpExceptionFilter)
create(@Body() dto: CreateUserDto) {}

// 2. 控制器级别
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UserController {}

// 3. 全局级别 (main.ts)
app.useGlobalFilters(new AllExceptionFilter());

// 4. 通过模块注册
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    }
  ]
})
export class AppModule {}
```

### 2.5 企业级异常处理

```typescript
// filters/global-exception.filter.ts
import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';

interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
  path: string;
  requestId?: string;
  details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status: number;
    let errorResponse: ErrorResponse;
    
    if (exception instanceof BusinessException) {
      // 业务异常
      status = exception.status;
      errorResponse = {
        code: exception.code,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request['requestId']
      };
    } else if (exception instanceof HttpException) {
      // HTTP 异常
      status = exception.getStatus();
      const res = exception.getResponse();
      errorResponse = {
        code: `HTTP_${status}`,
        message: typeof res === 'string' ? res : (res as any).message,
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request['requestId'],
        details: typeof res === 'object' ? (res as any).details : undefined
      };
    } else {
      // 未知异常
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request['requestId']
      };
      
      // 记录详细错误日志
      this.logger.error(
        `Unhandled exception: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception)
      );
    }
    
    // 生产环境不返回堆栈信息
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }
    
    response.status(status).json(errorResponse);
  }
}
```

**使用场景**：统一错误格式、错误日志记录、生产环境错误脱敏、关联请求ID便于追踪。

---

## 3. 守卫 Guards

### 3.1 认证守卫

```typescript
// guards/auth.guard.ts
import {
  Injectable, CanActivate, ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    
    return true;
  }
  
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### 3.2 角色守卫

```typescript
// guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    
    if (!requiredRoles) {
      return true;  // 未设置角色要求，允许访问
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// 使用
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles('admin')
  getDashboard() {
    return 'Admin dashboard';
  }
  
  @Get('users')
  @Roles('admin', 'manager')
  getUsers() {
    return 'User list';
  }
}
```

### 3.3 权限守卫 (CASL/ABAC)

```typescript
// guards/policies.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

export const CHECK_POLICIES_KEY = 'check_policy';

export interface PolicyHandler {
  handle(ability: any): boolean;
}

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.getAllAndOverride<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (!policyHandlers) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);
    
    return policyHandlers.every(handler => handler.handle(ability));
  }
}

// 使用示例
class ReadArticlePolicyHandler implements PolicyHandler {
  handle(ability: any) {
    return ability.can('read', 'Article');
  }
}

@Controller('articles')
@UseGuards(AuthGuard, PoliciesGuard)
export class ArticleController {
  
  @Get(':id')
  @CheckPolicies(new ReadArticlePolicyHandler())
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }
}
```

### 3.4 公开路由装饰器

```typescript
// decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// guards/auth.guard.ts - 修改为支持公开路由
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否为公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    
    if (isPublic) {
      return true;
    }
    
    // 正常认证逻辑...
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    const payload = await this.jwtService.verifyAsync(token);
    request['user'] = payload;
    return true;
  }
}

// 使用
@Controller('auth')
export class AuthController {
  
  @Public()  // 公开路由
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  
  @Public()  // 公开路由
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  
  // 需要认证
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

### 3.5 注册守卫

```typescript
// 1. 方法级别
@Get()
@UseGuards(AuthGuard)
findAll() {}

// 2. 控制器级别
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {}

// 3. 全局级别 (main.ts)
const app = await NestFactory.create(AppModule);
const reflector = app.get(Reflector);
app.useGlobalGuards(new AuthGuard(jwtService, reflector));

// 4. 通过模块注册 (推荐 - 可以注入依赖)
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
```

---

## 4. 拦截器 Interceptors

### 4.1 响应转换拦截器

```typescript
// interceptors/transform.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        code: 200,
        data,
        message: 'success',
        timestamp: new Date().toISOString()
      }))
    );
  }
}
```

### 4.2 日志拦截器

```typescript
// interceptors/logging.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();
    
    this.logger.log(`Request: ${method} ${url}`);
    this.logger.debug(`Body: ${JSON.stringify(body)}`);
    this.logger.debug(`Query: ${JSON.stringify(query)}`);
    this.logger.debug(`Params: ${JSON.stringify(params)}`);
    
    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log(`Response: ${method} ${url} - ${Date.now() - now}ms`);
          this.logger.debug(`Data: ${JSON.stringify(data)}`);
        },
        error: (error) => {
          this.logger.error(`Error: ${method} ${url} - ${error.message}`);
        }
      })
    );
  }
}
```

### 4.3 缓存拦截器

```typescript
// interceptors/cache.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, Inject
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // 只缓存 GET 请求
    if (request.method !== 'GET') {
      return next.handle();
    }
    
    const cacheKey = this.generateCacheKey(request);
    const cachedResponse = await this.cacheManager.get(cacheKey);
    
    if (cachedResponse) {
      return of(cachedResponse);
    }
    
    return next.handle().pipe(
      tap(response => {
        this.cacheManager.set(cacheKey, response, 60000); // 60秒
      })
    );
  }
  
  private generateCacheKey(request: any): string {
    const { url, query } = request;
    return `cache:${url}:${JSON.stringify(query)}`;
  }
}
```

### 4.4 超时拦截器

```typescript
// interceptors/timeout.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, RequestTimeoutException
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeout: number = 30000) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeout),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Request timeout'));
        }
        return throwError(() => err);
      })
    );
  }
}
```

### 4.5 重试拦截器

```typescript
// interceptors/retry.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { retry, delay } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  constructor(
    private readonly maxRetries: number = 3,
    private readonly delayMs: number = 1000
  ) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      retry({
        count: this.maxRetries,
        delay: this.delayMs
      })
    );
  }
}
```

### 4.6 注册拦截器

```typescript
// 1. 方法级别
@Get()
@UseInterceptors(LoggingInterceptor)
findAll() {}

// 2. 控制器级别
@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UserController {}

// 3. 全局级别 (main.ts)
app.useGlobalInterceptors(new TransformInterceptor());

// 4. 通过模块注册
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
```

---

## 5. 自定义装饰器进阶

### 5.1 组合装饰器

```typescript
// decorators/auth.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}

// 使用
@Controller('admin')
export class AdminController {
  
  @Get('users')
  @Auth('admin', 'manager')
  getUsers() {
    return this.userService.findAll();
  }
}
```

### 5.2 请求上下文装饰器

```typescript
// decorators/request-context.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 当前用户
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);

// 请求ID
export const RequestId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.requestId;
  }
);

// 客户端IP
export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.headers['x-forwarded-for'];
  }
);

// 租户信息
export const CurrentTenant = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenant;
    return data ? tenant?.[data] : tenant;
  }
);

// 使用
@Controller('profile')
export class ProfileController {
  
  @Get()
  getProfile(
    @CurrentUser() user: User,
    @CurrentUser('id') userId: string,
    @RequestId() requestId: string,
    @ClientIp() ip: string,
    @CurrentTenant() tenant: Tenant
  ) {
    return { user, userId, requestId, ip, tenant };
  }
}
```

### 5.3 API 响应装饰器

```typescript
// decorators/api-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: 'success' },
              data: {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) }
                  },
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' }
                }
              }
            }
          }
        ]
      }
    })
  );
};

// 使用
@Controller('users')
export class UserController {
  
  @Get()
  @ApiPaginatedResponse(User)
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }
}
```

---

## 6. 请求生命周期

### 6.1 执行顺序

```
请求进入
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  1. 中间件 (Middleware)                                  │
│     - 全局中间件                                         │
│     - 模块中间件                                         │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  2. 守卫 (Guards)                                        │
│     - 全局守卫                                           │
│     - 控制器守卫                                         │
│     - 方法守卫                                           │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  3. 拦截器 (Interceptors) - 前置                         │
│     - 全局拦截器                                         │
│     - 控制器拦截器                                       │
│     - 方法拦截器                                         │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  4. 管道 (Pipes)                                         │
│     - 全局管道                                           │
│     - 控制器管道                                         │
│     - 方法管道                                           │
│     - 参数管道                                           │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  5. 控制器方法处理                                       │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  6. 拦截器 (Interceptors) - 后置                         │
│     - 方法拦截器                                         │
│     - 控制器拦截器                                       │
│     - 全局拦截器                                         │
└─────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  7. 异常过滤器 (Exception Filters) - 如果有异常          │
│     - 方法过滤器                                         │
│     - 控制器过滤器                                       │
│     - 全局过滤器                                         │
└─────────────────────────────────────────────────────────┘
    │
    ▼
响应返回
```

### 6.2 完整示例

```typescript
// 展示完整请求生命周期
@Controller('lifecycle')
@UseGuards(ControllerGuard)
@UseInterceptors(ControllerInterceptor)
@UseFilters(ControllerExceptionFilter)
export class LifecycleController {
  
  @Get(':id')
  @UseGuards(MethodGuard)
  @UseInterceptors(MethodInterceptor)
  @UsePipes(MethodPipe)
  @UseFilters(MethodExceptionFilter)
  findOne(
    @Param('id', ParamPipe) id: string,
    @Query('name', QueryPipe) name: string
  ) {
    console.log('Controller method executed');
    return { id, name };
  }
}

// 请求 GET /lifecycle/123?name=test 执行顺序:
// 1. GlobalMiddleware
// 2. ModuleMiddleware
// 3. GlobalGuard
// 4. ControllerGuard
// 5. MethodGuard
// 6. GlobalInterceptor (before)
// 7. ControllerInterceptor (before)
// 8. MethodInterceptor (before)
// 9. GlobalPipe
// 10. ControllerPipe
// 11. MethodPipe
// 12. ParamPipe (id)
// 13. QueryPipe (name)
// 14. Controller method executed
// 15. MethodInterceptor (after)
// 16. ControllerInterceptor (after)
// 17. GlobalInterceptor (after)
// 18. Response sent
```

---

## 7. 配置管理

### 7.1 @nestjs/config 基础使用

```typescript
// 安装
// npm install @nestjs/config

// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,           // 全局可用
      envFilePath: ['.env.local', '.env'],  // 环境文件
      expandVariables: true,    // 支持变量展开
      cache: true              // 缓存配置
    })
  ]
})
export class AppModule {}

// .env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_URL=postgres://${DATABASE_HOST}:${DATABASE_PORT}/mydb

// 使用 ConfigService
@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}
  
  getConnection() {
    const host = this.configService.get<string>('DATABASE_HOST');
    const port = this.configService.get<number>('DATABASE_PORT', 5432);  // 默认值
    const url = this.configService.getOrThrow<string>('DATABASE_URL');  // 必须存在
    
    return { host, port, url };
  }
}
```

### 7.2 配置命名空间

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
}));

// config/jwt.config.ts
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
}));

// config/redis.config.ts
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB, 10) || 0
}));

// app.module.ts
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, redisConfig]
    })
  ]
})
export class AppModule {}

// 使用命名空间配置
@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  
  getJwtConfig() {
    return {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn')
    };
  }
}

// 类型安全的配置注入
@Injectable()
export class DatabaseService {
  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>
  ) {}
  
  connect() {
    // dbConfig 已有完整类型
    const { host, port, username, password, database } = this.dbConfig;
  }
}
```

### 7.3 配置验证

```typescript
// config/env.validation.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379)
});

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false  // 显示所有验证错误
      }
    })
  ]
})
export class AppModule {}
```

### 7.4 多环境配置

```typescript
// config/configuration.ts
export default () => {
  const env = process.env.NODE_ENV || 'development';
  
  const baseConfig = {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    }
  };
  
  const envConfigs = {
    development: {
      ...baseConfig,
      debug: true,
      logLevel: 'debug'
    },
    production: {
      ...baseConfig,
      debug: false,
      logLevel: 'error'
    },
    test: {
      ...baseConfig,
      debug: true,
      logLevel: 'verbose',
      database: {
        ...baseConfig.database,
        database: 'test_db'
      }
    }
  };
  
  return envConfigs[env] || envConfigs.development;
};

// 目录结构
// config/
//   ├── .env.development
//   ├── .env.production
//   ├── .env.test
//   └── configuration.ts

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration]
    })
  ]
})
export class AppModule {}
```

---

## 8. 日志系统

### 8.1 内置 Logger

```typescript
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  
  async createUser(dto: CreateUserDto) {
    this.logger.log(`Creating user: ${dto.email}`);
    this.logger.debug(`User data: ${JSON.stringify(dto)}`);
    
    try {
      const user = await this.userRepository.save(dto);
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}

// 控制器中使用
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.verbose(`Finding user: ${id}`);
    return this.userService.findOne(id);
  }
}
```

### 8.2 自定义 Logger

```typescript
// logger/custom-logger.service.ts
import { LoggerService, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  private context?: string;
  
  setContext(context: string) {
    this.context = context;
  }
  
  log(message: any, context?: string) {
    this.printMessage('LOG', message, context);
  }
  
  error(message: any, trace?: string, context?: string) {
    this.printMessage('ERROR', message, context);
    if (trace) {
      console.error(trace);
    }
  }
  
  warn(message: any, context?: string) {
    this.printMessage('WARN', message, context);
  }
  
  debug(message: any, context?: string) {
    this.printMessage('DEBUG', message, context);
  }
  
  verbose(message: any, context?: string) {
    this.printMessage('VERBOSE', message, context);
  }
  
  private printMessage(level: string, message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    const formattedMessage = typeof message === 'object' 
      ? JSON.stringify(message) 
      : message;
    
    console.log(`[${timestamp}] [${level}] [${ctx}] ${formattedMessage}`);
  }
}

// main.ts - 替换默认 Logger
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger()
  });
  await app.listen(3000);
}
```

### 8.3 使用 Winston

```typescript
// 安装: npm install nest-winston winston winston-daily-rotate-file

// logger/winston.config.ts
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('MyApp', {
          prettyPrint: true,
          colors: true
        })
      )
    }),
    
    // 日志文件 - 按日期轮转
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // 错误日志单独文件
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// main.ts
import { winstonConfig } from './logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig
  });
  await app.listen(3000);
}
```

### 8.4 结构化日志

```typescript
// logger/structured-logger.service.ts
import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  [key: string]: any;
}

@Injectable()
export class StructuredLogger implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  
  log(message: string, context?: LogContext) {
    this.logger.info(message, { ...context });
  }
  
  error(message: string, trace?: string, context?: LogContext) {
    this.logger.error(message, { ...context, trace });
  }
  
  warn(message: string, context?: LogContext) {
    this.logger.warn(message, { ...context });
  }
  
  debug(message: string, context?: LogContext) {
    this.logger.debug(message, { ...context });
  }
  
  verbose(message: string, context?: LogContext) {
    this.logger.verbose(message, { ...context });
  }
}

// 使用
@Injectable()
export class OrderService {
  constructor(private logger: StructuredLogger) {}
  
  async createOrder(userId: string, dto: CreateOrderDto, requestId: string) {
    this.logger.log('Creating order', {
      requestId,
      userId,
      action: 'createOrder',
      orderData: dto
    });
    
    // 业务逻辑...
    
    this.logger.log('Order created', {
      requestId,
      userId,
      action: 'createOrder',
      orderId: order.id,
      totalAmount: order.totalAmount
    });
  }
}
```

---

## 9. 文件上传

### 9.1 基础文件上传

```typescript
// 安装: npm install @types/multer

// file.controller.ts
import {
  Controller, Post, UseInterceptors,
  UploadedFile, UploadedFiles, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FileController {
  
  // 单文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    };
  }
  
  // 文件验证
  @Post('upload/validated')
  @UseInterceptors(FileInterceptor('file'))
  uploadValidatedFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),  // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif)$/ })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return { filename: file.filename };
  }
  
  // 多文件上传 (同一字段)
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 10))  // 最多10个
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map(file => ({
      filename: file.filename,
      size: file.size
    }));
  }
  
  // 多文件上传 (不同字段)
  @Post('upload/multiple')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]))
  uploadMultipleFields(
    @UploadedFiles() files: {
      avatar?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    }
  ) {
    return {
      avatar: files.avatar?.[0]?.filename,
      documents: files.documents?.map(f => f.filename)
    };
  }
}
```

### 9.2 自定义存储

```typescript
// config/multer.config.ts
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // 按日期分目录存储
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      const uploadPath = join('uploads', `${year}/${month}/${day}`);
      
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // 生成唯一文件名
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    }
  }),
  
  fileFilter: (req, file, cb) => {
    // 文件类型过滤
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
  },
  
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB
    files: 10
  }
};

// 使用
@Post('upload')
@UseInterceptors(FileInterceptor('file', multerConfig))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { path: file.path };
}
```

### 9.3 云存储上传 (阿里云 OSS)

```typescript
// services/oss.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';

@Injectable()
export class OssService {
  private client: OSS;
  
  constructor(private configService: ConfigService) {
    this.client = new OSS({
      region: this.configService.get('OSS_REGION'),
      accessKeyId: this.configService.get('OSS_ACCESS_KEY_ID'),
      accessKeySecret: this.configService.get('OSS_ACCESS_KEY_SECRET'),
      bucket: this.configService.get('OSS_BUCKET')
    });
  }
  
  async upload(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    const result = await this.client.put(filename, file.buffer);
    return result.url;
  }
  
  async delete(url: string): Promise<void> {
    const filename = url.split('/').slice(3).join('/');
    await this.client.delete(filename);
  }
  
  async getSignedUrl(filename: string, expires: number = 3600): Promise<string> {
    return this.client.signatureUrl(filename, { expires });
  }
}

// file.controller.ts
@Controller('files')
export class FileController {
  constructor(private ossService: OssService) {}
  
  @Post('upload/oss')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadToOss(@UploadedFile() file: Express.Multer.File) {
    const url = await this.ossService.upload(file, 'images');
    return { url };
  }
}
```

---

## 10. 定时任务

### 10.1 基础定时任务

```typescript
// 安装: npm install @nestjs/schedule

// app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ]
})
export class AppModule {}

// tasks/task.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  
  // Cron 表达式定时任务
  @Cron('0 0 * * * *')  // 每小时整点执行
  handleHourly() {
    this.logger.log('Hourly task executed');
  }
  
  // 使用预定义表达式
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDaily() {
    this.logger.log('Daily task at midnight');
  }
  
  // 每周一上午9点
  @Cron('0 0 9 * * 1')
  handleWeekly() {
    this.logger.log('Weekly Monday task');
  }
  
  // 间隔执行 (毫秒)
  @Interval(30000)  // 每30秒
  handleInterval() {
    this.logger.log('Interval task every 30s');
  }
  
  // 延迟执行一次
  @Timeout(5000)  // 5秒后执行
  handleTimeout() {
    this.logger.log('Timeout task after 5s');
  }
  
  // 带名称的任务 (可动态控制)
  @Cron('*/10 * * * * *', { name: 'myTask' })
  handleNamedTask() {
    this.logger.log('Named task every 10s');
  }
}
```

### 10.2 动态任务管理

```typescript
// tasks/dynamic-task.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class DynamicTaskService {
  private readonly logger = new Logger(DynamicTaskService.name);
  
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  
  // 添加定时任务
  addCronJob(name: string, cronExpression: string, callback: () => void) {
    const job = new CronJob(cronExpression, callback);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Job ${name} added`);
  }
  
  // 删除定时任务
  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.log(`Job ${name} deleted`);
  }
  
  // 获取所有任务
  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const result = [];
    
    jobs.forEach((job, name) => {
      result.push({
        name,
        running: job.running,
        lastDate: job.lastDate(),
        nextDate: job.nextDate()
      });
    });
    
    return result;
  }
  
  // 停止/启动任务
  toggleCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    
    if (job.running) {
      job.stop();
      this.logger.log(`Job ${name} stopped`);
    } else {
      job.start();
      this.logger.log(`Job ${name} started`);
    }
  }
  
  // 添加间隔任务
  addInterval(name: string, milliseconds: number, callback: () => void) {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
    this.logger.log(`Interval ${name} added`);
  }
  
  // 删除间隔任务
  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.log(`Interval ${name} deleted`);
  }
}

// 使用
@Controller('tasks')
export class TaskController {
  constructor(private dynamicTaskService: DynamicTaskService) {}
  
  @Post()
  addTask(@Body() body: { name: string; cron: string }) {
    this.dynamicTaskService.addCronJob(body.name, body.cron, () => {
      console.log(`Task ${body.name} executed`);
    });
    return { message: 'Task added' };
  }
  
  @Delete(':name')
  deleteTask(@Param('name') name: string) {
    this.dynamicTaskService.deleteCronJob(name);
    return { message: 'Task deleted' };
  }
  
  @Get()
  listTasks() {
    return this.dynamicTaskService.getCronJobs();
  }
}
```

### 10.3 分布式任务锁

```typescript
// tasks/distributed-task.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class DistributedTaskService {
  private readonly logger = new Logger(DistributedTaskService.name);
  
  constructor(@InjectRedis() private redis: Redis) {}
  
  // 分布式锁定时任务
  @Cron('0 * * * * *')  // 每分钟
  async handleDistributedTask() {
    const lockKey = 'task:myTask:lock';
    const lockValue = `${process.pid}-${Date.now()}`;
    const lockTTL = 60;  // 锁过期时间
    
    // 尝试获取锁
    const acquired = await this.redis.set(lockKey, lockValue, 'EX', lockTTL, 'NX');
    
    if (!acquired) {
      this.logger.debug('Task already running on another instance');
      return;
    }
    
    try {
      this.logger.log('Executing distributed task');
      // 执行任务逻辑...
      await this.doWork();
    } finally {
      // 释放锁 (使用 Lua 脚本确保原子性)
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      await this.redis.eval(script, 1, lockKey, lockValue);
    }
  }
  
  private async doWork() {
    // 实际任务逻辑
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.logger.log('Work completed');
  }
}
```

**使用场景**：
- **数据同步**：定时从第三方API同步数据
- **报表生成**：每日/周/月生成统计报表
- **清理任务**：定期清理过期数据、临时文件
- **健康检查**：定时检查外部服务状态
- **邮件发送**：定时发送提醒邮件

---

## 总结

本篇文档涵盖了 NestJS 的进阶功能：

1. **中间件** - 请求预处理、日志、限流、多租户
2. **异常过滤器** - 统一异常处理、自定义异常、错误格式化
3. **守卫** - 认证、授权、角色/权限控制
4. **拦截器** - 响应转换、日志、缓存、超时处理
5. **自定义装饰器** - 组合装饰器、请求上下文
6. **请求生命周期** - 执行顺序、作用范围
7. **配置管理** - 环境变量、命名空间、验证
8. **日志系统** - 内置Logger、Winston、结构化日志
9. **文件上传** - 本地存储、云存储
10. **定时任务** - Cron、动态任务、分布式锁

下一篇将介绍数据库集成与 ORM 操作。
