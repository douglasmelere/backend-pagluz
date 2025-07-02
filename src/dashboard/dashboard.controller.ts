// src/dashboard/dashboard.controller.ts

import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Visão geral do dashboard' })
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('metrics/sales')
  @ApiOperation({ summary: 'Métricas de vendas' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] })
  getSalesMetrics(@Query('period') period?: string) {
    return this.dashboardService.getSalesMetrics(period || 'month');
  }

  @Get('metrics/performance')
  @ApiOperation({ summary: 'Métricas de performance' })
  getPerformanceMetrics() {
    return this.dashboardService.getPerformanceMetrics();
  }

  @Get('metrics/geographic')
  @ApiOperation({ summary: 'Distribuição geográfica de clientes' })
  getGeographicDistribution() {
    return this.dashboardService.getGeographicDistribution();
  }

  @Get('metrics/timeline')
  @ApiOperation({ summary: 'Timeline de atividades' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getActivityTimeline(@Query('days') days?: number) {
    return this.dashboardService.getActivityTimeline(days || 30);
  }

  @Get('metrics/conversion')
  @ApiOperation({ summary: 'Taxa de conversão de leads' })
  getConversionMetrics() {
    return this.dashboardService.getConversionMetrics();
  }

  @Get('metrics/energy-analysis')
  @ApiOperation({ summary: 'Análise de consumo energético dos clientes' })
  getEnergyAnalysis() {
    return this.dashboardService.getEnergyAnalysis();
  }
}