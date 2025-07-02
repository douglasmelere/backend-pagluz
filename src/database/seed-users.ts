import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const users = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'hashedPassword', // Use bcrypt para hashear a senha
      role: 'ADMIN',
    },
    {
      name: 'User',
      email: 'user@example.com',
      password: 'hashedPassword',
      role: 'USER',
    },
  ];

  console.log('🌱 Iniciando seed de usuários...');

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

  console.log('✨ Seed de usuários concluído!');
  await app.close();
}

seedUsers().catch((error) => {
  console.error('❌ Erro durante o seed de usuários:', error);
  process.exit(1);
});
