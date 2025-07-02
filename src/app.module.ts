import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'solar-energy.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Em produção, use migrations
    }),
    CustomersModule,
    UsersModule,
    AuthModule,
    DashboardModule,
  ],
})
export class AppModule {}