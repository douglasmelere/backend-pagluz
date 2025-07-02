// src/database/seed-users.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/users.entity';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const users = [
    {
      name: 'Administrador',
      email: 'admin@solarenergy.com',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
    {
      name: 'João Vendedor',
      email: 'joao@solarenergy.com',
      password: 'senha123',
      role: UserRole.USER,
    },
    {
      name: 'Maria Consultora',
      email: 'maria@solarenergy.com',
      password: 'senha123',
      role: UserRole.USER,
    },
    {
      name: 'Pedro Visualizador',
      email: 'pedro@solarenergy.com',
      password: 'senha123',
      role: UserRole.VIEWER,
    },
  ];

  console.log('🔐 Iniciando seed de usuários...');

  for (const userData of users) {
    try {
      const existingUser = await usersService.findByEmail(userData.email);
      
      if (!existingUser) {
        await usersService.create(userData);
        console.log(`✅ Usuário ${userData.name} criado`);
      } else {
        console.log(`⚠️  Usuário ${userData.name} já existe`);
      }
    } catch (error) {
      console.log(`❌ Erro ao criar usuário ${userData.name}:`, error.message);
    }
  }

  console.log('✨ Seed de usuários concluído!');
  console.log('\n📧 Credenciais de acesso:');
  console.log('Admin: admin@solarenergy.com / admin123');
  console.log('User: joao@solarenergy.com / senha123');
  
  await app.close();
}

seedUsers();