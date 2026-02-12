# NestJS 完全指南 - 数据库与ORM篇
<div class="doc-toc">
## 目录

1. [TypeORM 集成](#1-typeorm-集成)
2. [Prisma 集成](#2-prisma-集成)
3. [MongoDB 与 Mongoose](#3-mongodb-与-mongoose)
4. [数据库事务](#4-数据库事务)
5. [数据库迁移](#5-数据库迁移)
6. [Redis 缓存](#6-redis-缓存)
7. [Elasticsearch 集成](#7-elasticsearch-集成)
8. [多数据库支持](#8-多数据库支持)


</div>

---

## 1. TypeORM 集成

### 1.1 安装与配置

```bash
# 安装依赖
npm install @nestjs/typeorm typeorm pg  # PostgreSQL
npm install @nestjs/typeorm typeorm mysql2  # MySQL
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 基础配置
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'mydb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,  // 开发环境使用，生产环境关闭
      logging: true
    }),
    
    // 异步配置 (推荐)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('DB_LOGGING') === 'true',
        // 连接池配置
        extra: {
          max: 20,  // 最大连接数
          min: 5,   // 最小连接数
          idleTimeoutMillis: 30000
        }
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

### 1.2 实体定义

```typescript
// entities/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, Index, Unique,
  OneToMany, ManyToOne, ManyToMany, JoinTable, JoinColumn
} from 'typeorm';
import { Order } from './order.entity';
import { Role } from './role.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

@Entity('users')
@Unique(['email'])
@Index(['status', 'createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ length: 100 })
  name: string;
  
  @Column({ unique: true })
  @Index()
  email: string;
  
  @Column({ select: false })  // 查询时默认不返回
  password: string;
  
  @Column({ nullable: true })
  avatar?: string;
  
  @Column({ type: 'int', default: 0 })
  age: number;
  
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;
  
  @Column({ type: 'jsonb', nullable: true })
  profile?: Record<string, any>;
  
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];
  
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;
  
  @Column({ default: false })
  isVerified: boolean;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @DeleteDateColumn()  // 软删除
  deletedAt?: Date;
  
  // 一对多关系
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
  
  // 多对多关系
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' }
  })
  roles: Role[];
}

// entities/order.entity.ts
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  orderNo: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;
  
  @Column()
  userId: string;
  
  // 多对一关系
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];
  
  @CreateDateColumn()
  createdAt: Date;
}

// entities/order-item.entity.ts
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  productId: number;
  
  @Column()
  productName: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  
  @Column({ type: 'int' })
  quantity: number;
  
  @ManyToOne(() => Order, order => order.items)
  order: Order;
}
```

### 1.3 Repository 模式

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In, IsNull, Not } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  
  // 创建
  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }
  
  // 批量创建
  async createMany(dtos: CreateUserDto[]): Promise<User[]> {
    const users = this.userRepository.create(dtos);
    return this.userRepository.save(users);
  }
  
  // 查询单个
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'orders']
    });
    
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    
    return user;
  }
  
  // 根据条件查询
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name']  // 包含密码字段
    });
  }
  
  // 分页查询
  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, keyword, status, sortBy, sortOrder } = query;
    
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role');
    
    // 搜索条件
    if (keyword) {
      queryBuilder.andWhere(
        '(user.name LIKE :keyword OR user.email LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }
    
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
    
    // 排序
    queryBuilder.orderBy(
      `user.${sortBy || 'createdAt'}`,
      sortOrder || 'DESC'
    );
    
    // 分页
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // 更新
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }
  
  // 部分更新
  async partialUpdate(id: string, dto: Partial<UpdateUserDto>): Promise<void> {
    await this.userRepository.update(id, dto);
  }
  
  // 删除
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  
  // 软删除
  async softRemove(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
  
  // 恢复软删除
  async restore(id: string): Promise<void> {
    await this.userRepository.restore(id);
  }
  
  // 统计
  async count(status?: UserStatus): Promise<number> {
    return this.userRepository.count({
      where: status ? { status } : {}
    });
  }
  
  // 检查是否存在
  async exists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }
}
```

### 1.4 高级查询

```typescript
// user.service.ts - 高级查询示例
@Injectable()
export class UserService {
  
  // 复杂条件查询
  async findWithConditions() {
    return this.userRepository.find({
      where: [
        // OR 条件
        { status: UserStatus.ACTIVE, age: Between(18, 30) },
        { status: UserStatus.INACTIVE, isVerified: true }
      ],
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 10
    });
  }
  
  // 使用 QueryBuilder
  async advancedQuery(params: any) {
    const { keyword, minAge, maxAge, roles, startDate, endDate } = params;
    
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoin('user.orders', 'order')
      .addSelect('COUNT(order.id)', 'orderCount')
      .groupBy('user.id')
      .addGroupBy('role.id');
    
    if (keyword) {
      qb.andWhere(
        'user.name ILIKE :keyword OR user.email ILIKE :keyword',
        { keyword: `%${keyword}%` }
      );
    }
    
    if (minAge && maxAge) {
      qb.andWhere('user.age BETWEEN :minAge AND :maxAge', { minAge, maxAge });
    }
    
    if (roles?.length) {
      qb.andWhere('role.name IN (:...roles)', { roles });
    }
    
    if (startDate && endDate) {
      qb.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }
    
    return qb.getRawAndEntities();
  }
  
  // 子查询
  async findWithSubquery() {
    const subQuery = this.userRepository
      .createQueryBuilder('subUser')
      .select('subUser.id')
      .where('subUser.status = :status', { status: UserStatus.ACTIVE })
      .getQuery();
    
    return this.userRepository
      .createQueryBuilder('user')
      .where(`user.id IN (${subQuery})`)
      .setParameter('status', UserStatus.ACTIVE)
      .getMany();
  }
  
  // 原生 SQL
  async executeRawQuery() {
    return this.userRepository.query(`
      SELECT u.*, COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      WHERE u.status = $1
      GROUP BY u.id
      ORDER BY order_count DESC
      LIMIT 10
    `, [UserStatus.ACTIVE]);
  }
  
  // 聚合查询
  async getStatistics() {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(user.age)', 'avgAge')
      .addSelect('SUM(user.balance)', 'totalBalance')
      .groupBy('user.status')
      .getRawMany();
    
    return result;
  }
}
```

### 1.5 自定义 Repository

```typescript
// repositories/user.repository.ts
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  
  async findActiveUsers(): Promise<User[]> {
    return this.find({
      where: { status: UserStatus.ACTIVE },
      order: { createdAt: 'DESC' }
    });
  }
  
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
  
  async findWithOrders(userId: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'order')
      .leftJoinAndSelect('order.items', 'item')
      .where('user.id = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .getOne();
  }
  
  async updateBalance(userId: string, amount: number): Promise<void> {
    await this.createQueryBuilder()
      .update(User)
      .set({ balance: () => `balance + ${amount}` })
      .where('id = :userId', { userId })
      .execute();
  }
  
  async bulkUpdateStatus(userIds: string[], status: UserStatus): Promise<void> {
    await this.createQueryBuilder()
      .update(User)
      .set({ status })
      .whereInIds(userIds)
      .execute();
  }
}

// user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule {}

// user.service.ts
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.findActiveUsers();
  }
}
```

---

## 2. Prisma 集成

### 2.1 安装与配置

```bash
# 安装
npm install @prisma/client
npm install -D prisma

# 初始化
npx prisma init
```

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}

model User {
  id        String     @id @default(uuid())
  email     String     @unique
  name      String
  password  String
  avatar    String?
  age       Int        @default(0)
  status    UserStatus @default(ACTIVE)
  profile   Json?
  tags      String[]
  balance   Decimal    @default(0) @db.Decimal(10, 2)
  isVerified Boolean   @default(false)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  deletedAt DateTime?
  
  orders    Order[]
  roles     Role[]     @relation("UserRoles")
  
  @@index([status, createdAt])
  @@map("users")
}

model Order {
  id          Int         @id @default(autoincrement())
  orderNo     String      @unique
  totalAmount Decimal     @db.Decimal(10, 2)
  status      String      @default("pending")
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  
  @@map("orders")
}

model OrderItem {
  id          Int     @id @default(autoincrement())
  productId   Int
  productName String
  price       Decimal @db.Decimal(10, 2)
  quantity    Int
  orderId     Int
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@map("order_items")
}

model Role {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  users       User[]   @relation("UserRoles")
  permissions Permission[]
  
  @@map("roles")
}

model Permission {
  id          Int    @id @default(autoincrement())
  name        String @unique
  description String?
  roles       Role[]
  
  @@map("permissions")
}
```

### 2.2 Prisma Service

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' }
      ]
    });
  }
  
  async onModuleInit() {
    await this.$connect();
    
    // 查询日志
    this.$on('query' as never, (e: any) => {
      console.log('Query: ' + e.query);
      console.log('Duration: ' + e.duration + 'ms');
    });
  }
  
  async onModuleDestroy() {
    await this.$disconnect();
  }
  
  // 软删除中间件
  async enableSoftDelete() {
    this.$use(async (params, next) => {
      if (params.model === 'User') {
        if (params.action === 'delete') {
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
        }
        
        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data !== undefined) {
            params.args.data['deletedAt'] = new Date();
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
        }
        
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['deletedAt'] = null;
        }
        
        if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.deletedAt === undefined) {
              params.args.where['deletedAt'] = null;
            }
          } else {
            params.args['where'] = { deletedAt: null };
          }
        }
      }
      
      return next(params);
    });
  }
}

// prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

### 2.3 使用 Prisma

```typescript
// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserStatus } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  // 创建
  async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: dto
    });
  }
  
  // 创建带关联
  async createWithRoles(dto: CreateUserDto & { roleIds: number[] }): Promise<User> {
    const { roleIds, ...userData } = dto;
    
    return this.prisma.user.create({
      data: {
        ...userData,
        roles: {
          connect: roleIds.map(id => ({ id }))
        }
      },
      include: {
        roles: true
      }
    });
  }
  
  // 查询单个
  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        orders: {
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
    
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    
    return user;
  }
  
  // 分页查询
  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, keyword, status, sortBy, sortOrder } = query;
    
    const where: Prisma.UserWhereInput = {
      AND: [
        keyword ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } }
          ]
        } : {},
        status ? { status } : {}
      ]
    };
    
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { roles: true },
        orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.user.count({ where })
    ]);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // 更新
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: dto
    });
  }
  
  // 更新带关联
  async updateRoles(id: string, roleIds: number[]): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        roles: {
          set: roleIds.map(id => ({ id }))  // 替换所有关联
        }
      },
      include: { roles: true }
    });
  }
  
  // 删除
  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
  
  // 批量操作
  async bulkUpdateStatus(ids: string[], status: UserStatus): Promise<number> {
    const result = await this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { status }
    });
    return result.count;
  }
  
  // 聚合查询
  async getStatistics() {
    const [statusStats, ageStats] = await Promise.all([
      this.prisma.user.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { balance: true }
      }),
      this.prisma.user.aggregate({
        _avg: { age: true },
        _max: { age: true },
        _min: { age: true },
        _count: { id: true }
      })
    ]);
    
    return { statusStats, ageStats };
  }
  
  // 原生查询
  async executeRawQuery() {
    return this.prisma.$queryRaw`
      SELECT u.*, COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      WHERE u.status = ${UserStatus.ACTIVE}
      GROUP BY u.id
      ORDER BY order_count DESC
      LIMIT 10
    `;
  }
}
```

---

## 3. MongoDB 与 Mongoose

### 3.1 安装与配置

```bash
npm install @nestjs/mongoose mongoose
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // 连接池配置
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

### 3.2 Schema 定义

```typescript
// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

@Schema({
  collection: 'users',
  timestamps: true,  // 自动添加 createdAt, updatedAt
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;
  
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
  
  @Prop({ required: true, select: false })
  password: string;
  
  @Prop()
  avatar?: string;
  
  @Prop({ type: Number, default: 0, min: 0, max: 150 })
  age: number;
  
  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    index: true
  })
  status: UserStatus;
  
  @Prop({ type: Object })
  profile?: Record<string, any>;
  
  @Prop({ type: [String], default: [] })
  tags: string[];
  
  @Prop({ type: Number, default: 0 })
  balance: number;
  
  @Prop({ default: false })
  isVerified: boolean;
  
  // 引用关系
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Types.ObjectId[];
  
  // 嵌入文档
  @Prop({
    type: {
      street: String,
      city: String,
      country: String,
      zipCode: String
    }
  })
  address?: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  
  // 数组嵌入文档
  @Prop({
    type: [{
      platform: String,
      accountId: String,
      accessToken: String
    }]
  })
  socialAccounts?: Array<{
    platform: string;
    accountId: string;
    accessToken: string;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 添加索引
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ status: 1, createdAt: -1 });
UserSchema.index({ name: 'text', email: 'text' });  // 全文索引

// 虚拟字段
UserSchema.virtual('fullName').get(function() {
  return `${this.name}`;
});

// 前置钩子
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const bcrypt = require('bcrypt');
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 方法
UserSchema.methods.comparePassword = async function(password: string) {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(password, this.password);
};

// 静态方法
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email }).select('+password');
};
```

### 3.3 使用 Mongoose

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}
  
  // 创建
  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }
  
  // 查询单个
  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('roles')
      .exec();
    
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    
    return user;
  }
  
  // 根据邮箱查询 (包含密码)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
  }
  
  // 分页查询
  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, keyword, status, sortBy, sortOrder } = query;
    
    const filter: FilterQuery<UserDocument> = {};
    
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    const sortOptions: any = {};
    sortOptions[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;
    
    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate('roles')
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec()
    ]);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // 全文搜索
  async search(text: string): Promise<User[]> {
    return this.userModel
      .find({ $text: { $search: text } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .exec();
  }
  
  // 更新
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    
    return user;
  }
  
  // 更新嵌入文档
  async updateAddress(id: string, address: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { address } },
        { new: true }
      )
      .exec();
  }
  
  // 添加到数组
  async addTag(id: string, tag: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { tags: tag } },
        { new: true }
      )
      .exec();
  }
  
  // 从数组移除
  async removeTag(id: string, tag: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $pull: { tags: tag } },
        { new: true }
      )
      .exec();
  }
  
  // 删除
  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
  
  // 批量更新
  async bulkUpdateStatus(ids: string[], status: UserStatus): Promise<number> {
    const result = await this.userModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { $set: { status } }
    ).exec();
    return result.modifiedCount;
  }
  
  // 聚合查询
  async getStatistics() {
    return this.userModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgAge: { $avg: '$age' },
          totalBalance: { $sum: '$balance' }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          avgAge: { $round: ['$avgAge', 1] },
          totalBalance: 1,
          _id: 0
        }
      }
    ]).exec();
  }
  
  // 复杂聚合
  async getTopUsersByOrders() {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          totalSpent: { $sum: '$orders.totalAmount' }
        }
      },
      {
        $match: {
          orderCount: { $gt: 0 }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: 1,
          email: 1,
          orderCount: 1,
          totalSpent: 1
        }
      }
    ]).exec();
  }
}
```

---

## 4. 数据库事务

### 4.1 TypeORM 事务

```typescript
// order.service.ts - TypeORM 事务
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource
  ) {}
  
  // 方式1: 使用 QueryRunner
  async createOrder(userId: string, items: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // 创建订单
      const order = queryRunner.manager.create(Order, {
        userId,
        orderNo: this.generateOrderNo(),
        totalAmount: 0,
        items: []
      });
      
      let totalAmount = 0;
      
      for (const item of items) {
        // 检查库存
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' }  // 行级锁
        });
        
        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${item.productId} out of stock`);
        }
        
        // 扣减库存
        await queryRunner.manager.update(Product, item.productId, {
          stock: product.stock - item.quantity
        });
        
        // 添加订单项
        order.items.push({
          productId: item.productId,
          productName: product.name,
          price: product.price,
          quantity: item.quantity
        });
        
        totalAmount += product.price * item.quantity;
      }
      
      order.totalAmount = totalAmount;
      
      // 扣减用户余额
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' }
      });
      
      if (!user || user.balance < totalAmount) {
        throw new Error('Insufficient balance');
      }
      
      await queryRunner.manager.update(User, userId, {
        balance: user.balance - totalAmount
      });
      
      // 保存订单
      const savedOrder = await queryRunner.manager.save(order);
      
      await queryRunner.commitTransaction();
      return savedOrder;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
  // 方式2: 使用 transaction 方法
  async createOrderV2(userId: string, items: any[]) {
    return this.dataSource.transaction(async manager => {
      const order = manager.create(Order, {
        userId,
        orderNo: this.generateOrderNo(),
        totalAmount: 0,
        items: []
      });
      
      // ... 业务逻辑
      
      return manager.save(order);
    });
  }
  
  // 方式3: 使用装饰器
  @Transactional()
  async createOrderV3(userId: string, items: any[]) {
    // 自动管理事务
    const order = this.orderRepository.create({
      userId,
      orderNo: this.generateOrderNo()
    });
    
    return this.orderRepository.save(order);
  }
  
  private generateOrderNo(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 8);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }
}
```

### 4.2 Prisma 事务

```typescript
// order.service.ts - Prisma 事务
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  
  // 交互式事务
  async createOrder(userId: string, items: any[]) {
    return this.prisma.$transaction(async (tx) => {
      // 获取用户
      const user = await tx.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        // 检查并锁定商品
        const product = await tx.$queryRaw`
          SELECT * FROM products 
          WHERE id = ${item.productId} 
          FOR UPDATE
        `;
        
        if (!product[0] || product[0].stock < item.quantity) {
          throw new Error(`Product ${item.productId} out of stock`);
        }
        
        // 扣减库存
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
        
        orderItems.push({
          productId: item.productId,
          productName: product[0].name,
          price: product[0].price,
          quantity: item.quantity
        });
        
        totalAmount += Number(product[0].price) * item.quantity;
      }
      
      // 检查余额
      if (Number(user.balance) < totalAmount) {
        throw new Error('Insufficient balance');
      }
      
      // 扣减余额
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalAmount } }
      });
      
      // 创建订单
      return tx.order.create({
        data: {
          orderNo: this.generateOrderNo(),
          totalAmount,
          userId,
          items: {
            create: orderItems
          }
        },
        include: {
          items: true
        }
      });
    }, {
      maxWait: 5000,   // 等待事务开始的最大时间
      timeout: 10000,  // 事务超时时间
      isolationLevel: 'Serializable'  // 隔离级别
    });
  }
  
  // 批量事务
  async batchCreateOrders(orders: any[]) {
    const operations = orders.map(order => 
      this.prisma.order.create({ data: order })
    );
    
    return this.prisma.$transaction(operations);
  }
}
```

### 4.3 MongoDB 事务

```typescript
// order.service.ts - MongoDB 事务
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection
  ) {}
  
  async createOrder(userId: string, items: any[]) {
    const session = await this.connection.startSession();
    session.startTransaction();
    
    try {
      const user = await this.userModel.findById(userId).session(session);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await this.productModel.findById(item.productId).session(session);
        
        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${item.productId} out of stock`);
        }
        
        // 扣减库存
        await this.productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { session }
        );
        
        orderItems.push({
          productId: item.productId,
          productName: product.name,
          price: product.price,
          quantity: item.quantity
        });
        
        totalAmount += product.price * item.quantity;
      }
      
      // 检查余额
      if (user.balance < totalAmount) {
        throw new Error('Insufficient balance');
      }
      
      // 扣减余额
      await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { balance: -totalAmount } },
        { session }
      );
      
      // 创建订单
      const [order] = await this.orderModel.create([{
        orderNo: this.generateOrderNo(),
        userId,
        totalAmount,
        items: orderItems
      }], { session });
      
      await session.commitTransaction();
      return order;
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
```

---

## 5. 数据库迁移

### 5.1 TypeORM 迁移

```typescript
// ormconfig.ts
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations'
});

// package.json scripts
{
  "scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli",
    "migration:generate": "npm run typeorm -- migration:generate -d ormconfig.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run -d ormconfig.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d ormconfig.ts"
  }
}
```

```typescript
// migrations/1705320000000-CreateUserTable.ts
import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateUserTable1705320000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'password',
            type: 'varchar'
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'banned'],
            default: "'active'"
          },
          {
            name: 'balance',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      }),
      true
    );
    
    await queryRunner.createIndex(
      'users',
      new Index({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email']
      })
    );
    
    await queryRunner.createIndex(
      'users',
      new Index({
        name: 'IDX_USER_STATUS_CREATED',
        columnNames: ['status', 'created_at']
      })
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USER_STATUS_CREATED');
    await queryRunner.dropIndex('users', 'IDX_USER_EMAIL');
    await queryRunner.dropTable('users');
  }
}

// migrations/1705320001000-AddUserAvatar.ts
export class AddUserAvatar1705320001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true
      })
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}
```

### 5.2 Prisma 迁移

```bash
# 创建迁移
npx prisma migrate dev --name init

# 应用迁移到生产环境
npx prisma migrate deploy

# 重置数据库
npx prisma migrate reset

# 生成 Prisma Client
npx prisma generate
```

```prisma
// prisma/migrations/20240115000000_init/migration.sql
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "age" INTEGER NOT NULL DEFAULT 0,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "profile" JSONB,
    "tags" TEXT[],
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_status_createdAt_idx" ON "users"("status", "createdAt");
```

---

## 6. Redis 缓存

### 6.1 基础配置

```bash
npm install @nestjs/cache-manager cache-manager cache-manager-ioredis-yet ioredis
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        ttl: 60000,  // 默认过期时间 (毫秒)
        max: 100     // 最大缓存数量
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

### 6.2 使用缓存

```typescript
// user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userRepository: UserRepository
  ) {}
  
  async findOne(id: string): Promise<User> {
    const cacheKey = `user:${id}`;
    
    // 尝试从缓存获取
    let user = await this.cacheManager.get<User>(cacheKey);
    
    if (!user) {
      // 缓存未命中，从数据库获取
      user = await this.userRepository.findOne({ where: { id } });
      
      if (user) {
        // 写入缓存，过期时间 5 分钟
        await this.cacheManager.set(cacheKey, user, 300000);
      }
    }
    
    return user;
  }
  
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, dto);
    
    // 删除缓存
    await this.cacheManager.del(`user:${id}`);
    
    return user;
  }
  
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
    await this.cacheManager.del(`user:${id}`);
  }
  
  // 批量操作
  async findMany(ids: string[]): Promise<User[]> {
    const cacheKeys = ids.map(id => `user:${id}`);
    
    // 批量获取缓存
    const cachedUsers = await Promise.all(
      cacheKeys.map(key => this.cacheManager.get<User>(key))
    );
    
    // 找出未缓存的 ID
    const missedIds = ids.filter((_, index) => !cachedUsers[index]);
    
    if (missedIds.length > 0) {
      // 从数据库获取
      const dbUsers = await this.userRepository.findByIds(missedIds);
      
      // 写入缓存
      await Promise.all(
        dbUsers.map(user => 
          this.cacheManager.set(`user:${user.id}`, user, 300000)
        )
      );
      
      // 合并结果
      const userMap = new Map(dbUsers.map(u => [u.id, u]));
      return ids.map((id, index) => cachedUsers[index] || userMap.get(id));
    }
    
    return cachedUsers as User[];
  }
}
```

### 6.3 缓存装饰器

```typescript
// user.controller.ts
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';

@Controller('users')
@UseInterceptors(CacheInterceptor)  // 控制器级别缓存
export class UserController {
  
  @Get()
  @CacheTTL(60000)  // 60秒过期
  findAll() {
    return this.userService.findAll();
  }
  
  @Get(':id')
  @CacheKey('custom-user-key')  // 自定义缓存键
  @CacheTTL(300000)  // 5分钟过期
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
```

### 6.4 自定义缓存拦截器

```typescript
// interceptors/custom-cache.interceptor.ts
import {
  Injectable, ExecutionContext, CallHandler,
  Inject
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // 只缓存 GET 请求
    if (request.method !== 'GET') {
      return next.handle();
    }
    
    // 生成缓存键
    const cacheKey = this.generateCacheKey(request);
    
    // 尝试获取缓存
    const cachedResponse = await this.cacheManager.get(cacheKey);
    
    if (cachedResponse) {
      return of(cachedResponse);
    }
    
    // 执行处理并缓存结果
    return next.handle().pipe(
      tap(response => {
        const ttl = this.getTtl(context);
        this.cacheManager.set(cacheKey, response, ttl);
      })
    );
  }
  
  private generateCacheKey(request: any): string {
    const { url, user } = request;
    const userId = user?.id || 'anonymous';
    return `cache:${userId}:${url}`;
  }
  
  private getTtl(context: ExecutionContext): number {
    // 可以根据路由设置不同的 TTL
    const handler = context.getHandler();
    const ttl = Reflect.getMetadata('cacheTTL', handler);
    return ttl || 60000;  // 默认 60 秒
  }
}
```

### 6.5 Redis 高级用法

```typescript
// redis/redis.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}
  
  // 分布式锁
  async acquireLock(key: string, ttl: number = 10000): Promise<string | null> {
    const lockId = Math.random().toString(36).slice(2);
    const result = await this.redis.set(
      `lock:${key}`,
      lockId,
      'PX',
      ttl,
      'NX'
    );
    return result === 'OK' ? lockId : null;
  }
  
  async releaseLock(key: string, lockId: string): Promise<boolean> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.redis.eval(script, 1, `lock:${key}`, lockId);
    return result === 1;
  }
  
  // 计数器 (限流)
  async incrementWithExpiry(key: string, ttl: number): Promise<number> {
    const multi = this.redis.multi();
    multi.incr(key);
    multi.expire(key, ttl);
    const results = await multi.exec();
    return results[0][1] as number;
  }
  
  // 排行榜
  async addToLeaderboard(name: string, userId: string, score: number): Promise<void> {
    await this.redis.zadd(name, score, userId);
  }
  
  async getLeaderboard(name: string, start: number = 0, end: number = 9): Promise<any[]> {
    const results = await this.redis.zrevrange(name, start, end, 'WITHSCORES');
    const leaderboard = [];
    
    for (let i = 0; i < results.length; i += 2) {
      leaderboard.push({
        userId: results[i],
        score: parseFloat(results[i + 1]),
        rank: start + i / 2 + 1
      });
    }
    
    return leaderboard;
  }
  
  // 发布订阅
  async publish(channel: string, message: any): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(message));
  }
  
  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    const subscriber = this.redis.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });
  }
  
  // Hash 操作 (存储对象)
  async setHashField(key: string, field: string, value: any): Promise<void> {
    await this.redis.hset(key, field, JSON.stringify(value));
  }
  
  async getHashField<T>(key: string, field: string): Promise<T | null> {
    const value = await this.redis.hget(key, field);
    return value ? JSON.parse(value) : null;
  }
  
  async getHashAll<T>(key: string): Promise<Record<string, T>> {
    const data = await this.redis.hgetall(key);
    const result: Record<string, T> = {};
    
    for (const [field, value] of Object.entries(data)) {
      result[field] = JSON.parse(value);
    }
    
    return result;
  }
}
```

---

## 7. Elasticsearch 集成

### 7.1 配置

```bash
npm install @nestjs/elasticsearch @elastic/elasticsearch
```

```typescript
// elasticsearch.module.ts
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USER'),
          password: configService.get('ELASTICSEARCH_PASSWORD')
        }
      }),
      inject: [ConfigService]
    })
  ],
  exports: [ElasticsearchModule]
})
export class SearchModule {}
```

### 7.2 搜索服务

```typescript
// search/search.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}
  
  // 创建索引
  async createIndex(index: string) {
    const exists = await this.esService.indices.exists({ index });
    
    if (!exists) {
      await this.esService.indices.create({
        index,
        body: {
          settings: {
            analysis: {
              analyzer: {
                default: {
                  type: 'ik_max_word'  // 中文分词
                }
              }
            }
          },
          mappings: {
            properties: {
              title: { type: 'text', analyzer: 'ik_max_word' },
              content: { type: 'text', analyzer: 'ik_max_word' },
              tags: { type: 'keyword' },
              category: { type: 'keyword' },
              authorId: { type: 'keyword' },
              createdAt: { type: 'date' },
              views: { type: 'integer' }
            }
          }
        }
      });
    }
  }
  
  // 索引文档
  async indexDocument(index: string, id: string, document: any) {
    return this.esService.index({
      index,
      id,
      body: document
    });
  }
  
  // 批量索引
  async bulkIndex(index: string, documents: Array<{ id: string; data: any }>) {
    const body = documents.flatMap(doc => [
      { index: { _index: index, _id: doc.id } },
      doc.data
    ]);
    
    return this.esService.bulk({ body });
  }
  
  // 搜索
  async search<T>(
    index: string,
    query: string,
    options: {
      page?: number;
      limit?: number;
      filters?: Record<string, any>;
      sort?: Record<string, 'asc' | 'desc'>;
    } = {}
  ): Promise<SearchResult<T>> {
    const { page = 1, limit = 10, filters = {}, sort = {} } = options;
    
    const must: any[] = [];
    const filter: any[] = [];
    
    // 全文搜索
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['title^3', 'content', 'tags^2'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      });
    }
    
    // 过滤条件
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        filter.push({ terms: { [key]: value } });
      } else {
        filter.push({ term: { [key]: value } });
      }
    }
    
    // 排序
    const sortArray = Object.entries(sort).map(([field, order]) => ({
      [field]: { order }
    }));
    
    const result = await this.esService.search({
      index,
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter
          }
        },
        sort: sortArray.length > 0 ? sortArray : [{ _score: { order: 'desc' } }],
        from: (page - 1) * limit,
        size: limit,
        highlight: {
          fields: {
            title: {},
            content: { fragment_size: 150 }
          }
        }
      }
    });
    
    const hits = result.hits.hits;
    const items = hits.map((hit: any) => ({
      ...hit._source,
      id: hit._id,
      score: hit._score,
      highlight: hit.highlight
    }));
    
    return {
      items,
      total: typeof result.hits.total === 'number' 
        ? result.hits.total 
        : result.hits.total.value,
      page,
      limit
    };
  }
  
  // 聚合查询
  async aggregate(index: string, field: string) {
    const result = await this.esService.search({
      index,
      body: {
        size: 0,
        aggs: {
          [field]: {
            terms: {
              field,
              size: 100
            }
          }
        }
      }
    });
    
    return result.aggregations[field].buckets;
  }
  
  // 删除文档
  async deleteDocument(index: string, id: string) {
    return this.esService.delete({ index, id });
  }
  
  // 更新文档
  async updateDocument(index: string, id: string, document: Partial<any>) {
    return this.esService.update({
      index,
      id,
      body: { doc: document }
    });
  }
}
```

### 7.3 数据同步

```typescript
// sync/data-sync.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../article/entities/article.entity';
import { SearchService } from '../search/search.service';

@Injectable()
export class DataSyncService implements OnModuleInit {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private searchService: SearchService
  ) {}
  
  async onModuleInit() {
    // 应用启动时创建索引
    await this.searchService.createIndex('articles');
  }
  
  // 全量同步
  async fullSync() {
    const batchSize = 1000;
    let offset = 0;
    
    while (true) {
      const articles = await this.articleRepository.find({
        skip: offset,
        take: batchSize
      });
      
      if (articles.length === 0) break;
      
      const documents = articles.map(article => ({
        id: article.id.toString(),
        data: {
          title: article.title,
          content: article.content,
          tags: article.tags,
          category: article.category,
          authorId: article.authorId,
          createdAt: article.createdAt,
          views: article.views
        }
      }));
      
      await this.searchService.bulkIndex('articles', documents);
      
      offset += batchSize;
    }
  }
  
  // 增量同步
  async syncArticle(article: Article) {
    await this.searchService.indexDocument('articles', article.id.toString(), {
      title: article.title,
      content: article.content,
      tags: article.tags,
      category: article.category,
      authorId: article.authorId,
      createdAt: article.createdAt,
      views: article.views
    });
  }
  
  // 删除同步
  async deleteArticle(id: string) {
    await this.searchService.deleteDocument('articles', id);
  }
}
```

---

## 8. 多数据库支持

### 8.1 TypeORM 多数据源

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // 主数据库
    TypeOrmModule.forRoot({
      name: 'default',  // 默认连接
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'main_db',
      entities: [User, Order],
      synchronize: true
    }),
    
    // 只读从库
    TypeOrmModule.forRoot({
      name: 'readonly',
      type: 'postgres',
      host: 'replica.localhost',
      port: 5432,
      username: 'reader',
      password: 'password',
      database: 'main_db',
      entities: [User, Order],
      synchronize: false
    }),
    
    // 日志数据库
    TypeOrmModule.forRoot({
      name: 'logs',
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'logs_db',
      entities: [AuditLog, AccessLog],
      synchronize: true
    })
  ]
})
export class AppModule {}

// user.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // 默认连接
    TypeOrmModule.forFeature([User], 'readonly')  // 只读连接
  ],
  providers: [UserService]
})
export class UserModule {}

// user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(User, 'readonly')
    private readonlyUserRepository: Repository<User>
  ) {}
  
  // 写操作使用主库
  async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.save(dto);
  }
  
  // 读操作使用从库
  async findOne(id: string): Promise<User> {
    return this.readonlyUserRepository.findOne({ where: { id } });
  }
}
```

### 8.2 读写分离

```typescript
// database/read-write.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const masterConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_MASTER_HOST,
  port: parseInt(process.env.DB_MASTER_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}']
};

const replicaConfigs: DataSourceOptions[] = [
  {
    ...masterConfig,
    host: process.env.DB_REPLICA1_HOST
  },
  {
    ...masterConfig,
    host: process.env.DB_REPLICA2_HOST
  }
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...masterConfig,
      name: 'master'
    }),
    ...replicaConfigs.map((config, index) =>
      TypeOrmModule.forRoot({
        ...config,
        name: `replica${index + 1}`
      })
    )
  ],
  providers: [
    {
      provide: 'READ_DATA_SOURCE',
      useFactory: () => {
        // 轮询选择从库
        let currentIndex = 0;
        return {
          getConnection: () => {
            const index = currentIndex;
            currentIndex = (currentIndex + 1) % replicaConfigs.length;
            return `replica${index + 1}`;
          }
        };
      }
    }
  ],
  exports: ['READ_DATA_SOURCE']
})
export class DatabaseModule {}

// services/base.service.ts
@Injectable()
export abstract class BaseService<T> {
  constructor(
    @InjectDataSource('master')
    protected masterDataSource: DataSource,
    @Inject('READ_DATA_SOURCE')
    protected readDataSource: { getConnection: () => string }
  ) {}
  
  protected getWriteRepository(): Repository<T> {
    return this.masterDataSource.getRepository(this.getEntity());
  }
  
  protected getReadRepository(): Repository<T> {
    const connectionName = this.readDataSource.getConnection();
    const dataSource = getConnection(connectionName);
    return dataSource.getRepository(this.getEntity());
  }
  
  protected abstract getEntity(): new () => T;
}
```

---

## 总结

本篇文档涵盖了 NestJS 数据库与 ORM 的核心内容：

1. **TypeORM** - 实体定义、Repository 模式、高级查询、自定义 Repository
2. **Prisma** - Schema 定义、Prisma Service、CRUD 操作、聚合查询
3. **MongoDB** - Schema 设计、Mongoose 操作、聚合管道
4. **数据库事务** - TypeORM/Prisma/MongoDB 事务处理
5. **数据库迁移** - TypeORM 迁移、Prisma 迁移
6. **Redis 缓存** - 基础缓存、装饰器、分布式锁、发布订阅
7. **Elasticsearch** - 索引管理、全文搜索、数据同步
8. **多数据库** - 多数据源配置、读写分离

下一篇将介绍企业级项目实践与前端框架集成。
