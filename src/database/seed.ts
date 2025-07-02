import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CustomersService } from '../customers/customers.service';
import {
  CustomerStatus,
  InstallationType,
  CustomerType,
} from '../customers/customer.entity';

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
      city: "Herval d'Oeste",
      state: 'SC',
      zipCode: '89610-000',
      installationType: InstallationType.RESIDENTIAL,
      customerType: CustomerType.GENERATOR,
      monthlyEnergyConsumption: 350,
      monthlyEnergyBill: 280,
      roofType: 'Cerâmica',
      availableRoofArea: 80,
      status: CustomerStatus.CLIENT,
      notes: 'Cliente satisfeito com instalação de 4kWp',
    },
    // ... outros clientes (mantidos iguais)
  ];

  console.log('🌱 Iniciando seed do banco de dados...');

  for (const customerData of customers) {
    try {
      // Verifica se o cliente já existe pelo email ou cpfCnpj
      const existingCustomer = await customersService.findOneByEmailOrCpfCnpj(
        customerData.email,
        customerData.cpfCnpj,
      );
      if (existingCustomer) {
        console.log(`⚠️ Cliente ${customerData.name} já existe, pulando...`);
        continue;
      }
      await customersService.create(customerData);
      console.log(`✅ Cliente ${customerData.name} criado`);
    } catch (error) {
      console.error(
        `❌ Erro ao criar cliente ${customerData.name}:`,
        error.message,
      );
    }
  }

  console.log('✨ Seed concluído!');
  await app.close();
}

seed().catch((error) => {
  console.error('❌ Erro durante o seed:', error);
  process.exit(1);
});
