// src/dashboard/dashboard.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Customer, CustomerStatus, InstallationType } from '../customers/customer.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async getOverview() {
    const totalCustomers = await this.customersRepository.count();
    const activeClients = await this.customersRepository.count({
      where: { status: CustomerStatus.CLIENT },
    });
    const totalLeads = await this.customersRepository.count({
      where: { status: CustomerStatus.LEAD },
    });
    const totalProspects = await this.customersRepository.count({
      where: { status: CustomerStatus.PROSPECT },
    });

    // Potencial total de energia
    const energyPotential = await this.customersRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.monthlyEnergyConsumption)', 'total')
      .where('customer.monthlyEnergyConsumption IS NOT NULL')
      .getRawOne();

    // Valor total de contas
    const billsTotal = await this.customersRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.monthlyEnergyBill)', 'total')
      .where('customer.monthlyEnergyBill IS NOT NULL')
      .getRawOne();

    // Novos clientes este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomersThisMonth = await this.customersRepository.count({
      where: {
        createdAt: MoreThan(startOfMonth),
      },
    });

    return {
      totalCustomers,
      activeClients,
      totalLeads,
      totalProspects,
      conversionRate: totalCustomers > 0 ? ((activeClients / totalCustomers) * 100).toFixed(1) : 0,
      totalEnergyPotential: energyPotential?.total || 0,
      totalMonthlyBills: billsTotal?.total || 0,
      newCustomersThisMonth,
      averageTicket: activeClients > 0 ? (billsTotal?.total || 0) / activeClients : 0,
    };
  }

  async getSalesMetrics(period: string) {
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const salesData = await this.customersRepository
      .createQueryBuilder('customer')
      .select("DATE_FORMAT(customer.createdAt, '%Y-%m-%d')", 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('customer.status', 'status')
      .where('customer.createdAt >= :startDate', { startDate })
      .groupBy('date')
      .addGroupBy('customer.status')
      .getRawMany();

    // Potencial de vendas
    const salesPotential = await this.customersRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.monthlyEnergyBill * 12 * 0.9)', 'annualPotential')
      .where('customer.status IN (:...statuses)', { 
        statuses: [CustomerStatus.LEAD, CustomerStatus.PROSPECT] 
      })
      .andWhere('customer.monthlyEnergyBill IS NOT NULL')
      .getRawOne();

    // Vendas realizadas (clientes ativos)
    const realizedSales = await this.customersRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.monthlyEnergyBill * 12 * 0.9)', 'annualRealized')
      .where('customer.status = :status', { status: CustomerStatus.CLIENT })
      .andWhere('customer.monthlyEnergyBill IS NOT NULL')
      .getRawOne();

    return {
      period,
      timeline: salesData,
      salesPotential: salesPotential?.annualPotential || 0,
      realizedSales: realizedSales?.annualRealized || 0,
      conversionTarget: 0.3, // 30% de meta de conversão
    };
  }

  async getPerformanceMetrics() {
    // Taxa de conversão por tipo de instalação
    const conversionByType = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.installationType', 'type')
      .addSelect('customer.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.installationType')
      .addGroupBy('customer.status')
      .getRawMany();

    // Tempo médio de conversão (simulado)
    const avgConversionTime = 15; // dias

    // Taxa de resposta (simulada)
    const responseRate = 0.65; // 65%

    return {
      conversionByType,
      averageConversionTime: avgConversionTime,
      responseRate: responseRate * 100,
      leadQuality: {
        hot: 35,
        warm: 45,
        cold: 20,
      },
    };
  }

  async getGeographicDistribution() {
    const distribution = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.city', 'city')
      .addSelect('customer.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(customer.monthlyEnergyConsumption)', 'avgConsumption')
      .groupBy('customer.city')
      .addGroupBy('customer.state')
      .orderBy('count', 'DESC')
      .getRawMany();

    const stateDistribution = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.state')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      byCity: distribution,
      byState: stateDistribution,
      topCities: distribution.slice(0, 5),
    };
  }

  async getActivityTimeline(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.customersRepository
      .createQueryBuilder('customer')
      .select("DATE_FORMAT(customer.createdAt, '%Y-%m-%d')", 'date')
      .addSelect('COUNT(*)', 'newCustomers')
      .where('customer.createdAt >= :startDate', { startDate })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Simular outras atividades
    const timeline = activities.map(day => ({
      date: day.date,
      newCustomers: parseInt(day.newCustomers),
      contactsMade: Math.floor(Math.random() * 10) + 5,
      proposalsSent: Math.floor(Math.random() * 5) + 1,
      contractsClosed: Math.floor(Math.random() * 3),
    }));

    return {
      period: `${days} days`,
      timeline,
      summary: {
        totalNewCustomers: timeline.reduce((acc, day) => acc + day.newCustomers, 0),
        totalContacts: timeline.reduce((acc, day) => acc + day.contactsMade, 0),
        totalProposals: timeline.reduce((acc, day) => acc + day.proposalsSent, 0),
        totalContracts: timeline.reduce((acc, day) => acc + day.contractsClosed, 0),
      },
    };
  }

  async getConversionMetrics() {
    const statusCounts = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.status')
      .getRawMany();

    const totalCustomers = statusCounts.reduce((acc, item) => acc + parseInt(item.count), 0);
    
    const funnel = {
      leads: 0,
      prospects: 0,
      clients: 0,
      inactive: 0,
    };

    statusCounts.forEach(item => {
      switch (item.status) {
        case CustomerStatus.LEAD:
          funnel.leads = parseInt(item.count);
          break;
        case CustomerStatus.PROSPECT:
          funnel.prospects = parseInt(item.count);
          break;
        case CustomerStatus.CLIENT:
          funnel.clients = parseInt(item.count);
          break;
        case CustomerStatus.INACTIVE:
          funnel.inactive = parseInt(item.count);
          break;
      }
    });

    return {
      funnel,
      conversionRates: {
        leadToProspect: funnel.leads > 0 ? ((funnel.prospects / funnel.leads) * 100).toFixed(1) : 0,
        prospectToClient: funnel.prospects > 0 ? ((funnel.clients / funnel.prospects) * 100).toFixed(1) : 0,
        overallConversion: totalCustomers > 0 ? ((funnel.clients / totalCustomers) * 100).toFixed(1) : 0,
      },
      lostOpportunities: funnel.inactive,
    };
  }

  async getEnergyAnalysis() {
    // Análise por tipo de instalação
    const energyByType = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.installationType', 'type')
      .addSelect('AVG(customer.monthlyEnergyConsumption)', 'avgConsumption')
      .addSelect('SUM(customer.monthlyEnergyConsumption)', 'totalConsumption')
      .addSelect('AVG(customer.monthlyEnergyBill)', 'avgBill')
      .addSelect('COUNT(*)', 'count')
      .where('customer.monthlyEnergyConsumption IS NOT NULL')
      .groupBy('customer.installationType')
      .getRawMany();

    // Distribuição de consumo
    const consumptionRanges = await this.customersRepository
      .createQueryBuilder('customer')
      .select(`
        CASE 
          WHEN customer.monthlyEnergyConsumption < 200 THEN '0-200'
          WHEN customer.monthlyEnergyConsumption < 500 THEN '200-500'
          WHEN customer.monthlyEnergyConsumption < 1000 THEN '500-1000'
          WHEN customer.monthlyEnergyConsumption < 5000 THEN '1000-5000'
          ELSE '5000+'
        END AS consumptionRange
      `)
      .addSelect('COUNT(*)', 'count')
      .where('customer.monthlyEnergyConsumption IS NOT NULL')
      .groupBy('consumptionRange')
      .getRawMany();

    // Potencial total de economia
    const savingsPotential = await this.customersRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.monthlyEnergyBill * 0.9 * 12)', 'annualSavings')
      .where('customer.monthlyEnergyBill IS NOT NULL')
      .getRawOne();

    // ROI médio estimado
    const avgROI = 4.2; // anos

    return {
      byInstallationType: energyByType,
      consumptionDistribution: consumptionRanges,
      totalSavingsPotential: savingsPotential?.annualSavings || 0,
      averageROI: avgROI,
      sustainabilityImpact: {
        co2ReductionTons: (savingsPotential?.annualSavings || 0) * 0.0005, // Estimativa
        treesEquivalent: (savingsPotential?.annualSavings || 0) * 0.01, // Estimativa
      },
    };
  }
}