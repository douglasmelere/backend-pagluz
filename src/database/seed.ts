// src/database/seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CustomersService } from '../customers/customers.service';
import { CustomerStatus, InstallationType, CustomerType } from '../customers/customer.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const customersService = app.get(CustomersService);

  const customers = [
    {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(47) 99999-0001',
      cpfCnpj: '123.456.789-00',
      address: 'Rua das Flores, 123',
      city: 'Herval d\'Oeste',
      state: 'SC',
      zipCode: '89610-000',
      installationType: InstallationType.RESIDENTIAL,
      customerType: CustomerType.GENERATOR, // Sistema instalado
      monthlyEnergyConsumption: 350,
      monthlyEnergyBill: 280,
      roofType: 'Cerâmica',
      availableRoofArea: 80,
      status: CustomerStatus.CLIENT,
      notes: 'Cliente satisfeito com instalação de 4kWp',
    },
    {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '(47) 99999-0002',
      cpfCnpj: '987.654.321-00',
      address: 'Av. Brasil, 456',
      city: 'Joaçaba',
      state: 'SC',
      zipCode: '89600-000',
      installationType: InstallationType.COMMERCIAL,
      customerType: CustomerType.GENERATOR, // Interesse em sistema
      monthlyEnergyConsumption: 1200,
      monthlyEnergyBill: 980,
      roofType: 'Metálica',
      availableRoofArea: 200,
      status: CustomerStatus.PROSPECT,
      notes: 'Interessada em sistema de 10kWp',
    },
    {
      name: 'Pedro Santos',
      email: 'pedro.santos@email.com',
      phone: '(47) 99999-0003',
      cpfCnpj: '456.789.123-00',
      address: 'Rua São Paulo, 789',
      city: 'Herval d\'Oeste',
      state: 'SC',
      zipCode: '89610-000',
      installationType: InstallationType.RESIDENTIAL,
      customerType: CustomerType.GENERATOR, // Potencial gerador (tem área de telhado)
      monthlyEnergyConsumption: 280,
      monthlyEnergyBill: 220,
      roofType: 'Fibrocimento',
      availableRoofArea: 60,
      status: CustomerStatus.LEAD,
      notes: 'Primeiro contato via WhatsApp',
    },
    {
      name: 'Agropecuária Vale Verde',
      email: 'contato@valeverde.com',
      phone: '(47) 3333-0001',
      cpfCnpj: '12.345.678/0001-90',
      address: 'Estrada Rural, km 15',
      city: 'Campos Novos',
      state: 'SC',
      zipCode: '89620-000',
      installationType: InstallationType.RURAL,
      customerType: CustomerType.GENERATOR, // Sistema instalado
      monthlyEnergyConsumption: 5000,
      monthlyEnergyBill: 4200,
      roofType: 'Galpão Metálico',
      availableRoofArea: 500,
      status: CustomerStatus.CLIENT,
      notes: 'Sistema de 30kWp instalado em galpão',
    },
    {
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '(47) 99999-0004',
      cpfCnpj: '789.123.456-00',
      address: 'Rua do Comércio, 321',
      city: 'Herval d\'Oeste',
      state: 'SC',
      zipCode: '89610-000',
      installationType: InstallationType.RESIDENTIAL,
      customerType: CustomerType.CONSUMER, // Sem menção a sistema, apenas lead
      monthlyEnergyConsumption: 180,
      monthlyEnergyBill: 150,
      status: CustomerStatus.LEAD,
      notes: 'Aguardando aprovação do financiamento',
    },
    {
      name: 'Indústria Têxtil SC',
      email: 'contato@textilsc.com',
      phone: '(47) 3333-0002',
      cpfCnpj: '98.765.432/0001-10',
      address: 'Distrito Industrial, 1000',
      city: 'Luzerna',
      state: 'SC',
      zipCode: '89609-000',
      installationType: InstallationType.INDUSTRIAL,
      customerType: CustomerType.GENERATOR, // Interesse em sistema
      monthlyEnergyConsumption: 15000,
      monthlyEnergyBill: 12500,
      roofType: 'Estrutura Metálica',
      availableRoofArea: 2000,
      status: CustomerStatus.PROSPECT,
      notes: 'Solicitou estudo de viabilidade para 100kWp',
    },
    {
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      phone: '(47) 99999-0005',
      cpfCnpj: '321.654.987-00',
      address: 'Rua Principal, 654',
      city: 'Herval d\'Oeste',
      state: 'SC',
      zipCode: '89610-000',
      installationType: InstallationType.RESIDENTIAL,
      customerType: CustomerType.CONSUMER, // Inativo, sem sistema
      monthlyEnergyConsumption: 420,
      monthlyEnergyBill: 340,
      roofType: 'Laje',
      availableRoofArea: 100,
      status: CustomerStatus.INACTIVE,
      notes: 'Mudou-se para outro estado',
    },
    {
      name: 'Supermercado Central',
      email: 'gerencia@supercentral.com',
      phone: '(47) 3333-0003',
      cpfCnpj: '55.444.333/0001-22',
      address: 'Av. Central, 200',
      city: 'Herval d\'Oeste',
      state: 'SC',
      zipCode: '89610-000',
      installationType: InstallationType.COMMERCIAL,
      customerType: CustomerType.GENERATOR, // Sistema instalado
      monthlyEnergyConsumption: 3500,
      monthlyEnergyBill: 2900,
      roofType: 'Metálica',
      availableRoofArea: 400,
      status: CustomerStatus.CLIENT,
      notes: 'Sistema de 25kWp em operação',
    },
  ];

  console.log('🌱 Iniciando seed do banco de dados...');

  for (const customerData of customers) {
    try {
      await customersService.create(customerData);
      console.log(`✅ Cliente ${customerData.name} criado`);
    } catch (error) {
      console.log(`❌ Erro ao criar cliente ${customerData.name}:`, error.message);
    }
  }

  console.log('✨ Seed concluído!');
  
  await app.close();
}

seed();