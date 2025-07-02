// src/dashboard/dashboard.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Customer } from '../customers/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}