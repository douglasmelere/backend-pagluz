import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';
import {
  CustomerStatus,
  InstallationType,
  CustomerType,
} from '../customers/customer.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}

async function seedAll() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const customersService = app.get(CustomersService);
  const usersService = app.get(UsersService);

  console.log('🌱 Iniciando seed completo...');

  // Seed de usuários

  const users = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'hashedPassword',
      role: UserRole.ADMIN,
    },
    {
      name: 'User',
      email: 'user@example.com',
      password: 'hashedPassword',
      role: UserRole.USER,
    },
  ];

  for (const userData of users) {
    try {
      const existingUser = await usersService.findOneByEmail(userData.email);
      if (existingUser) {
        console.log(`⚠️ Usuário ${userData.name} já existe, pulando...`);
        continue;
      }
      await usersService.create(userData);
      console.log(`✅ Usuário ${userData.name} criado`);
    } catch (error) {
      console.error(
        `❌ Erro ao criar usuário ${userData.name}:`,
        error.message,
      );
    }
  }

  // Seed de clientes (sem alterações, já está funcionando)
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
  ];

  for (const customerData of customers) {
    try {
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

  console.log('✨ Seed completo concluído!');
  await app.close();
}

seedAll().catch((error) => {
  console.error('❌ Erro durante o seed completo:', error);
  process.exit(1);
});
