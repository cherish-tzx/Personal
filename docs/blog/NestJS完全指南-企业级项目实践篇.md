# NestJS 完全指南 - 企业级项目实践篇
<div class="doc-toc">
## 目录

1. [项目架构设计](#1-项目架构设计)
2. [认证与授权](#2-认证与授权)
3. [API 文档 Swagger](#3-api-文档-swagger)
4. [WebSocket 实时通信](#4-websocket-实时通信)
5. [消息队列](#5-消息队列)
6. [微服务架构](#6-微服务架构)
7. [GraphQL 集成](#7-graphql-集成)
8. [测试策略](#8-测试策略)
9. [部署与监控](#9-部署与监控)
10. [性能优化](#10-性能优化)


</div>

---

## 1. 项目架构设计

### 1.1 标准目录结构

```
src/
├── common/                    # 通用模块
│   ├── constants/            # 常量定义
│   │   └── index.ts
│   ├── decorators/           # 自定义装饰器
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/                  # 通用 DTO
│   │   ├── pagination.dto.ts
│   │   └── response.dto.ts
│   ├── enums/                # 枚举定义
│   │   └── index.ts
│   ├── exceptions/           # 自定义异常
│   │   ├── business.exception.ts
│   │   └── index.ts
│   ├── filters/              # 异常过滤器
│   │   └── global-exception.filter.ts
│   ├── guards/               # 守卫
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/         # 拦截器
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── interfaces/           # 接口定义
│   │   └── index.ts
│   ├── middleware/           # 中间件
│   │   ├── logger.middleware.ts
│   │   └── request-id.middleware.ts
│   ├── pipes/                # 管道
│   │   └── validation.pipe.ts
│   └── utils/                # 工具函数
│       ├── crypto.util.ts
│       └── date.util.ts
│
├── config/                    # 配置模块
│   ├── config.module.ts
│   ├── configuration.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── redis.config.ts
│
├── database/                  # 数据库模块
│   ├── database.module.ts
│   ├── migrations/
│   └── seeds/
│
├── modules/                   # 业务模块
│   ├── auth/                 # 认证模块
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── user/                 # 用户模块
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── query-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   ├── user.repository.ts
│   │   └── user.service.ts
│   │
│   ├── order/                # 订单模块
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── events/
│   │   ├── listeners/
│   │   ├── order.controller.ts
│   │   ├── order.module.ts
│   │   └── order.service.ts
│   │
│   └── notification/         # 通知模块
│       ├── channels/
│       ├── templates/
│       ├── notification.module.ts
│       └── notification.service.ts
│
├── shared/                    # 共享模块
│   ├── cache/
│   ├── logger/
│   ├── mail/
│   └── storage/
│
├── app.module.ts
└── main.ts
```

### 1.2 分层架构

```typescript
// 控制器层 - 处理HTTP请求
// user.controller.ts
@Controller('users')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  @Auth('admin', 'manager')
  async findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }
  
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}

// 服务层 - 业务逻辑
// user.service.ts
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2
  ) {}
  
  async create(dto: CreateUserDto): Promise<User> {
    // 业务验证
    await this.validateEmail(dto.email);
    
    // 数据处理
    const hashedPassword = await this.hashPassword(dto.password);
    
    // 持久化
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword
    });
    
    // 发布事件
    this.eventEmitter.emit('user.created', new UserCreatedEvent(user));
    
    return user;
  }
}

// 仓库层 - 数据访问
// user.repository.ts
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}
  
  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }
  
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}
```

### 1.3 模块化设计

```typescript
// 核心模块 - 全局共享
// core.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './shared/cache/cache.module';
import { LoggerModule } from './shared/logger/logger.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CacheModule,
    LoggerModule
  ],
  exports: [
    ConfigModule,
    DatabaseModule,
    CacheModule,
    LoggerModule
  ]
})
export class CoreModule {}

// 功能模块
// feature.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Feature]),
    forwardRef(() => RelatedModule)  // 处理循环依赖
  ],
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository],
  exports: [FeatureService]
})
export class FeatureModule {}

// 应用模块
// app.module.ts
@Module({
  imports: [
    CoreModule,
    AuthModule,
    UserModule,
    OrderModule,
    NotificationModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
```

---

## 2. 认证与授权

### 2.1 JWT 认证

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m')
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}

// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }
  
  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User is not active');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles
    };
  }
}

// auth/strategies/local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }
  
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
}

// auth/strategies/refresh-token.strategy.ts
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true
    });
  }
  
  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.body['refreshToken'];
    return { ...payload, refreshToken };
  }
}
```

### 2.2 认证服务

```typescript
// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, TokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }
  
  async login(user: any): Promise<TokenDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name)
    };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload)
    ]);
    
    // 存储 refresh token
    await this.userService.updateRefreshToken(user.id, refreshToken);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRES_IN')
    };
  }
  
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword
    });
    
    return this.login(user);
  }
  
  async refreshTokens(userId: string, refreshToken: string): Promise<TokenDto> {
    const user = await this.userService.findById(userId);
    
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }
    
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    return this.login(user);
  }
  
  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }
  
  private async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
  
  private async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d')
    });
  }
}

// auth/auth.controller.ts
@Controller('auth')
@ApiTags('认证')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  async login(@CurrentUser() user: any, @Body() dto: LoginDto) {
    return this.authService.login(user);
  }
  
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新Token' })
  async refresh(
    @CurrentUser('sub') userId: string,
    @CurrentUser('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
  
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登出' })
  async logout(@CurrentUser('sub') userId: string) {
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前用户信息' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
```

### 2.3 RBAC 权限控制

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// auth/guards/permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass()
    ]);
    
    if (!requiredPermissions) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    const ability = await this.caslAbilityFactory.createForUser(user);
    
    return requiredPermissions.every(permission => {
      const [action, subject] = permission.split(':');
      return ability.can(action, subject);
    });
  }
}

// CASL 权限工厂
// auth/casl/casl-ability.factory.ts
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, AbilityClass, ExtractSubjectType } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'User' | 'Order' | 'Article' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>
    );
    
    if (user.roles.includes('admin')) {
      // 管理员拥有所有权限
      can('manage', 'all');
    } else if (user.roles.includes('manager')) {
      // 管理者可以管理用户和订单
      can('read', 'User');
      can('update', 'User');
      can('manage', 'Order');
    } else {
      // 普通用户只能读取和更新自己的数据
      can('read', 'User', { id: user.id });
      can('update', 'User', { id: user.id });
      can('read', 'Order', { userId: user.id });
      can('create', 'Order');
    }
    
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>
    });
  }
}

// 使用权限装饰器
// decorators/permissions.decorator.ts
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

// 在控制器中使用
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  
  @Get()
  @Permissions('read:User')
  findAll() {}
  
  @Post()
  @Permissions('create:User')
  create() {}
  
  @Delete(':id')
  @Permissions('delete:User')
  remove() {}
}
```

### 2.4 OAuth2.0 社交登录

```typescript
// auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile']
    });
  }
  
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { id, emails, displayName, photos } = profile;
    
    const user = await this.authService.validateOAuthUser({
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: displayName,
      avatar: photos[0]?.value
    });
    
    done(null, user);
  }
}

// auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // 重定向到 Google 登录
  }
  
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@CurrentUser() user: any, @Res() res: Response) {
    const tokens = await this.authService.login(user);
    
    // 重定向到前端，带上 token
    const frontendUrl = this.configService.get('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${tokens.accessToken}`);
  }
}
```

---

## 3. API 文档 Swagger

### 3.1 配置 Swagger

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('企业级 API')
    .setDescription('API 文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header'
      },
      'API-KEY'
    )
    .addTag('认证', '用户认证相关接口')
    .addTag('用户', '用户管理相关接口')
    .addTag('订单', '订单管理相关接口')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    }
  });
  
  await app.listen(3000);
}
bootstrap();
```

### 3.2 DTO 文档化

```typescript
// dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  name: string;
  
  @ApiProperty({
    description: '邮箱地址',
    example: 'john@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    description: '密码',
    example: 'Password123!',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  password: string;
  
  @ApiPropertyOptional({
    description: '用户角色',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
  
  @ApiPropertyOptional({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

// dto/pagination.dto.ts
export class PaginationDto {
  @ApiPropertyOptional({
    description: '页码',
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;
  
  @ApiPropertyOptional({
    description: '每页数量',
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

// dto/response.dto.ts
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: '数据列表' })
  items: T[];
  
  @ApiProperty({ description: '总数', example: 100 })
  total: number;
  
  @ApiProperty({ description: '当前页', example: 1 })
  page: number;
  
  @ApiProperty({ description: '每页数量', example: 10 })
  limit: number;
  
  @ApiProperty({ description: '总页数', example: 10 })
  totalPages: number;
}
```

### 3.3 控制器文档化

```typescript
// user.controller.ts
import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, HttpStatus
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
  ApiQuery, ApiBearerAuth, ApiBody
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('用户')
@ApiBearerAuth('JWT')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  @ApiOperation({ 
    summary: '获取用户列表',
    description: '支持分页、搜索和筛选'
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取用户列表',
    type: [User]
  })
  async findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }
  
  @Get(':id')
  @ApiOperation({ summary: '获取单个用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取用户',
    type: User
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在'
  })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '用户创建成功',
    type: User
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '邮箱已存在'
  })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  
  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户更新成功',
    type: User
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '用户删除成功'
  })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
```

---

## 4. WebSocket 实时通信

### 4.1 WebSocket Gateway

```typescript
// gateway/chat.gateway.ts
import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayInit,
  OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    credentials: true
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, Set<string>>();
  
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }
  
  async handleConnection(client: Socket) {
    try {
      const user = await this.authService.validateToken(
        client.handshake.auth.token
      );
      
      client.data.user = user;
      
      // 加入用户房间
      client.join(`user:${user.id}`);
      
      // 记录连接
      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set());
      }
      this.userSockets.get(user.id).add(client.id);
      
      // 广播上线状态
      this.server.emit('user:online', { userId: user.id });
      
      this.logger.log(`Client connected: ${client.id}, User: ${user.id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }
  
  handleDisconnect(client: Socket) {
    const user = client.data.user;
    
    if (user) {
      const userSocketSet = this.userSockets.get(user.id);
      userSocketSet?.delete(client.id);
      
      if (userSocketSet?.size === 0) {
        this.userSockets.delete(user.id);
        this.server.emit('user:offline', { userId: user.id });
      }
    }
    
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  @SubscribeMessage('message:send')
  @UseGuards(WsAuthGuard)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string }
  ) {
    const user = client.data.user;
    
    const message = await this.messageService.create({
      roomId: data.roomId,
      senderId: user.id,
      content: data.content
    });
    
    // 广播到房间
    this.server.to(`room:${data.roomId}`).emit('message:new', {
      message,
      sender: { id: user.id, name: user.name }
    });
    
    return { success: true, messageId: message.id };
  }
  
  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    client.join(`room:${data.roomId}`);
    
    const user = client.data.user;
    this.server.to(`room:${data.roomId}`).emit('room:joined', {
      userId: user.id,
      userName: user.name
    });
    
    return { success: true };
  }
  
  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    client.leave(`room:${data.roomId}`);
    
    const user = client.data.user;
    this.server.to(`room:${data.roomId}`).emit('room:left', {
      userId: user.id
    });
    
    return { success: true };
  }
  
  // 向特定用户发送消息
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
  
  // 广播给所有在线用户
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
```

### 4.2 WebSocket 认证守卫

```typescript
// guards/ws-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const user = client.data.user;
    
    if (!user) {
      throw new WsException('Unauthorized');
    }
    
    return true;
  }
}

// WebSocket 异常过滤器
// filters/ws-exception.filter.ts
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient();
    
    const error = exception instanceof WsException
      ? exception.getError()
      : { message: 'Internal server error' };
    
    client.emit('error', error);
  }
}
```

---

## 5. 消息队列

### 5.1 Bull 队列

```bash
npm install @nestjs/bull bull
```

```typescript
// queue/queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { EmailProcessor } from './processors/email.processor';
import { OrderProcessor } from './processors/order.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD')
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'order' },
      { name: 'notification' }
    )
  ],
  providers: [EmailProcessor, OrderProcessor],
  exports: [BullModule]
})
export class QueueModule {}

// processors/email.processor.ts
import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  
  constructor(private mailService: MailService) {}
  
  @Process('send')
  async handleSend(job: Job<EmailJobData>) {
    const { to, subject, template, context } = job.data;
    
    this.logger.log(`Sending email to ${to}`);
    
    await this.mailService.send({
      to,
      subject,
      template,
      context
    });
    
    return { sent: true };
  }
  
  @Process('bulk-send')
  async handleBulkSend(job: Job<{ emails: EmailJobData[] }>) {
    const { emails } = job.data;
    
    for (let i = 0; i < emails.length; i++) {
      await this.mailService.send(emails[i]);
      await job.progress((i + 1) / emails.length * 100);
    }
    
    return { sent: emails.length };
  }
  
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }
  
  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Completed job ${job.id}: ${JSON.stringify(result)}`);
  }
  
  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Failed job ${job.id}: ${error.message}`);
  }
}

// processors/order.processor.ts
@Processor('order')
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);
  
  @Process('process-payment')
  async handlePayment(job: Job<{ orderId: string; amount: number }>) {
    const { orderId, amount } = job.data;
    
    // 处理支付
    const result = await this.paymentService.process(orderId, amount);
    
    if (result.success) {
      // 更新订单状态
      await this.orderService.updateStatus(orderId, 'paid');
      
      // 发送通知
      await this.notificationQueue.add('order-paid', { orderId });
    }
    
    return result;
  }
  
  @Process('cancel-expired')
  async handleCancelExpired(job: Job) {
    // 取消超时未支付的订单
    const expiredOrders = await this.orderService.findExpired();
    
    for (const order of expiredOrders) {
      await this.orderService.cancel(order.id, 'timeout');
    }
    
    return { cancelled: expiredOrders.length };
  }
}
```

### 5.2 队列生产者

```typescript
// services/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OrderService {
  constructor(
    @InjectQueue('order') private orderQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('notification') private notificationQueue: Queue
  ) {}
  
  async createOrder(dto: CreateOrderDto) {
    const order = await this.orderRepository.create(dto);
    
    // 添加支付任务到队列
    await this.orderQueue.add('process-payment', {
      orderId: order.id,
      amount: order.totalAmount
    }, {
      delay: 0,
      priority: 1,
      attempts: 3
    });
    
    // 发送订单确认邮件
    await this.emailQueue.add('send', {
      to: order.user.email,
      subject: '订单确认',
      template: 'order-confirmation',
      context: { order }
    }, {
      delay: 1000  // 延迟1秒发送
    });
    
    // 设置订单超时取消任务
    await this.orderQueue.add('cancel-expired', {
      orderId: order.id
    }, {
      delay: 30 * 60 * 1000  // 30分钟后执行
    });
    
    return order;
  }
  
  // 定时任务 - 批量处理
  @Cron('0 0 * * * *')  // 每小时
  async scheduledCleanup() {
    await this.orderQueue.add('cancel-expired', {}, {
      repeat: { cron: '0 0 * * * *' }
    });
  }
}
```

---

## 6. 微服务架构

### 6.1 TCP 微服务

```typescript
// 微服务端
// apps/user-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001
      }
    }
  );
  
  await app.listen();
  console.log('User microservice is running');
}
bootstrap();

// apps/user-service/src/user.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  
  @MessagePattern({ cmd: 'get_user' })
  async getUser(@Payload() data: { id: string }) {
    return this.userService.findById(data.id);
  }
  
  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.userService.create(data);
  }
  
  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any) {
    // 处理用户创建事件
    console.log('User created:', data);
  }
}

// API Gateway
// apps/api-gateway/src/user.controller.ts
import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy
  ) {}
  
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'get_user' }, { id })
    );
  }
  
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'create_user' }, dto)
    );
    
    // 发布事件
    this.userClient.emit('user_created', user);
    
    return user;
  }
}

// apps/api-gateway/src/app.module.ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001
        }
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002
        }
      }
    ])
  ]
})
export class AppModule {}
```

### 6.2 RabbitMQ 微服务

```typescript
// 微服务配置
// apps/notification-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'notifications',
        queueOptions: {
          durable: true
        },
        prefetchCount: 1
      }
    }
  );
  
  await app.listen();
}
bootstrap();

// 通知处理
// apps/notification-service/src/notification.controller.ts
@Controller()
export class NotificationController {
  
  @MessagePattern('send_notification')
  async sendNotification(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      await this.notificationService.send(data);
      channel.ack(originalMsg);  // 确认消息
    } catch (error) {
      channel.nack(originalMsg);  // 拒绝消息，重新入队
    }
  }
  
  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any) {
    // 发送订单通知
    await this.notificationService.sendOrderNotification(data);
  }
}

// API Gateway 发送消息
@Injectable()
export class NotificationGateway {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy
  ) {}
  
  async sendNotification(userId: string, message: string) {
    this.client.emit('send_notification', { userId, message });
  }
  
  async sendAndWait(data: any) {
    return firstValueFrom(
      this.client.send('send_notification', data).pipe(
        timeout(5000)
      )
    );
  }
}
```

### 6.3 gRPC 微服务

```typescript
// proto/user.proto
syntax = "proto3";

package user;

service UserService {
  rpc FindOne (UserById) returns (User) {}
  rpc FindAll (Empty) returns (Users) {}
  rpc Create (CreateUserRequest) returns (User) {}
}

message UserById {
  string id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}

message Users {
  repeated User users = 1;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
  string password = 3;
}

message Empty {}

// user.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  
  @GrpcMethod('UserService', 'FindOne')
  async findOne(data: { id: string }): Promise<User> {
    return this.userService.findById(data.id);
  }
  
  @GrpcMethod('UserService', 'FindAll')
  async findAll(): Promise<{ users: User[] }> {
    const users = await this.userService.findAll();
    return { users };
  }
  
  @GrpcMethod('UserService', 'Create')
  async create(data: CreateUserRequest): Promise<User> {
    return this.userService.create(data);
  }
}

// 客户端调用
@Injectable()
export class UserGrpcClient implements OnModuleInit {
  private userService: any;
  
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}
  
  onModuleInit() {
    this.userService = this.client.getService<any>('UserService');
  }
  
  findOne(id: string): Observable<User> {
    return this.userService.findOne({ id });
  }
  
  create(data: CreateUserRequest): Observable<User> {
    return this.userService.create(data);
  }
}
```

---

## 7. GraphQL 集成

### 7.1 配置 GraphQL

```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code,
        path: error.path
      })
    })
  ]
})
export class AppModule {}
```

### 7.2 定义类型和解析器

```typescript
// user/user.model.ts
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

registerEnumType(UserStatus, { name: 'UserStatus' });

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;
  
  @Field()
  name: string;
  
  @Field()
  email: string;
  
  @Field(() => UserStatus)
  status: UserStatus;
  
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
  
  @Field()
  createdAt: Date;
}

// user/user.input.ts
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @MinLength(2)
  name: string;
  
  @Field()
  @IsEmail()
  email: string;
  
  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id: string;
}

// user/user.resolver.ts
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './user.model';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {}
  
  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }
  
  @Query(() => User, { name: 'user', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.userService.findById(id);
  }
  
  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }
  
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }
  
  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return this.userService.update(input.id, input);
  }
  
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args('id') id: string) {
    await this.userService.delete(id);
    return true;
  }
  
  // 字段解析器 - 解决 N+1 问题
  @ResolveField(() => [Order])
  async orders(@Parent() user: User) {
    return this.orderService.findByUserId(user.id);
  }
}
```

### 7.3 DataLoader 解决 N+1

```typescript
// loaders/user.loader.ts
import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader {
  constructor(private userService: UserService) {}
  
  readonly batchUsers = new DataLoader<string, User>(
    async (ids: string[]) => {
      const users = await this.userService.findByIds(ids);
      const userMap = new Map(users.map(u => [u.id, u]));
      return ids.map(id => userMap.get(id));
    }
  );
}

// 使用 DataLoader
@Resolver(() => Order)
export class OrderResolver {
  constructor(private userLoader: UserLoader) {}
  
  @ResolveField(() => User)
  async user(@Parent() order: Order) {
    return this.userLoader.batchUsers.load(order.userId);
  }
}
```

---

## 8. 测试策略

### 8.1 单元测试

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;
  
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository
        }
      ]
    }).compile();
    
    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'password' };
      const expectedUser = { id: '1', ...dto };
      
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);
      
      const result = await service.create(dto);
      
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUser);
    });
  });
  
  describe('findById', () => {
    it('should return a user', async () => {
      const expectedUser = { id: '1', name: 'John', email: 'john@example.com' };
      mockUserRepository.findOne.mockResolvedValue(expectedUser);
      
      const result = await service.findById('1');
      
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });
    
    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### 8.2 集成测试

```typescript
// user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: any;
  let authToken: string;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    
    userRepository = moduleFixture.get(getRepositoryToken(User));
    
    // 获取认证 token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    
    authToken = response.body.accessToken;
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('GET /users', () => {
    it('should return users list', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
        });
    });
    
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });
  
  describe('POST /users', () => {
    it('should create a user', () => {
      const dto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto)
        .expect(201)
        .expect(res => {
          expect(res.body.name).toBe(dto.name);
          expect(res.body.email).toBe(dto.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });
    
    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'A' })  // 缺少必填字段
        .expect(400);
    });
  });
});
```

### 8.3 测试覆盖率

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 9. 部署与监控

### 9.1 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped
    
  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 9.2 健康检查

```typescript
// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck, HealthCheckService,
  TypeOrmHealthIndicator, HttpHealthIndicator,
  DiskHealthIndicator, MemoryHealthIndicator
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator
  ) {}
  
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 数据库健康检查
      () => this.db.pingCheck('database'),
      
      // HTTP 健康检查
      () => this.http.pingCheck('external-api', 'https://api.example.com/health'),
      
      // 磁盘空间检查
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.9
      }),
      
      // 内存检查
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024)
    ]);
  }
  
  @Get('liveness')
  liveness() {
    return { status: 'ok' };
  }
  
  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database')
    ]);
  }
}
```

### 9.3 Prometheus 监控

```typescript
// 安装: npm install @willsoto/nestjs-prometheus prom-client

// metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true
      },
      path: '/metrics'
    })
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'path', 'status']
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration',
      labelNames: ['method', 'path'],
      buckets: [0.1, 0.5, 1, 2, 5]
    })
  ],
  exports: [PrometheusModule]
})
export class MetricsModule {}

// interceptors/metrics.interceptor.ts
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total') private counter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') private histogram: Histogram<string>
  ) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = (Date.now() - startTime) / 1000;
          
          this.counter.inc({ method, path, status: response.statusCode });
          this.histogram.observe({ method, path }, duration);
        },
        error: (error) => {
          const status = error.status || 500;
          const duration = (Date.now() - startTime) / 1000;
          
          this.counter.inc({ method, path, status });
          this.histogram.observe({ method, path }, duration);
        }
      })
    );
  }
}
```

---

## 10. 性能优化

### 10.1 响应压缩

```typescript
// main.ts
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024  // 只压缩大于 1KB 的响应
  }));
  
  await app.listen(3000);
}
```

### 10.2 请求限流

```typescript
// 安装: npm install @nestjs/throttler

// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}

// 自定义限流
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @Throttle({ short: { ttl: 60000, limit: 5 } })  // 1分钟5次
  login() {}
  
  @Get('profile')
  @SkipThrottle()  // 跳过限流
  getProfile() {}
}
```

### 10.3 数据库连接池

```typescript
// 数据库配置
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'password',
  database: 'mydb',
  entities: [],
  // 连接池配置
  extra: {
    max: 20,           // 最大连接数
    min: 5,            // 最小连接数
    idleTimeoutMillis: 30000,  // 空闲连接超时
    connectionTimeoutMillis: 2000  // 连接超时
  },
  // 查询缓存
  cache: {
    type: 'ioredis',
    options: {
      host: 'localhost',
      port: 6379
    },
    duration: 60000  // 缓存时间
  }
})
```

### 10.4 批量操作优化

```typescript
// 批量插入
async bulkInsert(items: CreateItemDto[]) {
  const batchSize = 1000;
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    await this.repository
      .createQueryBuilder()
      .insert()
      .values(batch)
      .execute();
  }
}

// 批量更新
async bulkUpdate(updates: { id: string; data: any }[]) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.startTransaction();
  
  try {
    for (const { id, data } of updates) {
      await queryRunner.manager.update(Entity, id, data);
    }
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

---

## 总结

本篇文档涵盖了 NestJS 企业级项目实践：

1. **项目架构** - 目录结构、分层设计、模块化
2. **认证授权** - JWT、RBAC、OAuth2.0
3. **API 文档** - Swagger 配置与文档化
4. **WebSocket** - 实时通信、认证
5. **消息队列** - Bull 队列、异步处理
6. **微服务** - TCP、RabbitMQ、gRPC
7. **GraphQL** - 类型定义、解析器、DataLoader
8. **测试策略** - 单元测试、集成测试
9. **部署监控** - Docker、健康检查、Prometheus
10. **性能优化** - 压缩、限流、连接池

下一篇将介绍前端框架与 NestJS 的集成实践。
