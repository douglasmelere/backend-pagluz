import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, FilterCustomersDto } from './customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verificar se já existe um cliente com o mesmo email
    const existingCustomer = await this.customersRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Já existe um cliente com este email');
    }

    const customer = this.customersRepository.create(createCustomerDto);
    return await this.customersRepository.save(customer);
  }

  async findAll(filters?: FilterCustomersDto): Promise<Customer[]> {
    const query = this.customersRepository.createQueryBuilder('customer');

    if (filters) {
      if (filters.status) {
        query.andWhere('customer.status = :status', { status: filters.status });
      }

      if (filters.installationType) {
        query.andWhere('customer.installationType = :installationType', {
          installationType: filters.installationType,
        });
      }

      if (filters.customerType) {
        query.andWhere('customer.customerType = :customerType', {
          customerType: filters.customerType,
        });
      }

      if (filters.city) {
        query.andWhere('LOWER(customer.city) = LOWER(:city)', { city: filters.city });
      }

      if (filters.state) {
        query.andWhere('LOWER(customer.state) = LOWER(:state)', { state: filters.state });
      }

      if (filters.search) {
        query.andWhere(
          '(LOWER(customer.name) LIKE LOWER(:search) OR LOWER(customer.email) LIKE LOWER(:search))',
          { search: `%${filters.search}%` },
        );
      }
    }

    query.orderBy('customer.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    // Se estiver alterando o email, verificar se já não existe outro cliente com esse email
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customersRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new ConflictException('Já existe um cliente com este email');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }

  // Métodos adicionais úteis

  async getStatistics(): Promise<any> {
    const totalCustomers = await this.customersRepository.count();
    
    const statusCount = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.status')
      .getRawMany();

    const installationTypeCount = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.installationType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.installationType')
      .getRawMany();

    const averageConsumption = await this.customersRepository
      .createQueryBuilder('customer')
      .select('AVG(customer.monthlyEnergyConsumption)', 'average')
      .where('customer.monthlyEnergyConsumption IS NOT NULL')
      .getRawOne();

    const averageBill = await this.customersRepository
      .createQueryBuilder('customer')
      .select('AVG(customer.monthlyEnergyBill)', 'average')
      .where('customer.monthlyEnergyBill IS NOT NULL')
      .getRawOne();

    return {
      totalCustomers,
      statusDistribution: statusCount,
      installationTypeDistribution: installationTypeCount,
      averageMonthlyConsumption: averageConsumption?.average || 0,
      averageMonthlyBill: averageBill?.average || 0,
    };
  }

  async calculateSolarPotential(id: string): Promise<any> {
    const customer = await this.findOne(id);

    if (!customer.monthlyEnergyConsumption) {
      throw new ConflictException('Cliente não possui consumo mensal informado');
    }

    // Cálculos simplificados de potencial solar
    const dailyConsumption = customer.monthlyEnergyConsumption / 30;
    const sunHoursPerDay = 5; // Média de horas de sol por dia no Brasil
    const systemEfficiency = 0.75; // Eficiência do sistema
    
    const requiredPower = dailyConsumption / (sunHoursPerDay * systemEfficiency);
    const panelPower = 0.55; // kW por painel (550W)
    const numberOfPanels = Math.ceil(requiredPower / panelPower);
    const totalSystemPower = numberOfPanels * panelPower;
    
    // Área necessária (cada painel ocupa aproximadamente 2m²)
    const requiredArea = numberOfPanels * 2;
    
    // Economia estimada (considerando tarifa média de R$ 0,75/kWh)
    const averageTariff = 0.75;
    const monthlySavings = customer.monthlyEnergyConsumption * averageTariff * 0.9; // 90% de economia
    const annualSavings = monthlySavings * 12;
    
    // Investimento estimado (R$ 5.000 por kW instalado)
    const investmentPerKW = 5000;
    const totalInvestment = totalSystemPower * investmentPerKW;
    
    // Retorno do investimento
    const paybackYears = totalInvestment / annualSavings;

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        monthlyConsumption: customer.monthlyEnergyConsumption,
        availableRoofArea: customer.availableRoofArea,
      },
      solarSystem: {
        requiredPower: Number(requiredPower.toFixed(2)),
        numberOfPanels,
        totalSystemPower: Number(totalSystemPower.toFixed(2)),
        requiredArea: Number(requiredArea.toFixed(2)),
        canInstall: !customer.availableRoofArea || customer.availableRoofArea >= requiredArea,
      },
      financial: {
        estimatedInvestment: Number(totalInvestment.toFixed(2)),
        monthlySavings: Number(monthlySavings.toFixed(2)),
        annualSavings: Number(annualSavings.toFixed(2)),
        paybackYears: Number(paybackYears.toFixed(1)),
      },
    };
  }
}