// src/database/seed-all.ts

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function seedAll() {
  console.log('🌱 Iniciando seed completo do banco de dados...\n');

  try {
    // Seed de usuários
    console.log('👥 Criando usuários...');
    await execAsync('ts-node src/database/seed-users.ts');
    
    // Seed de clientes
    console.log('\n📋 Criando clientes...');
    await execAsync('ts-node src/database/seed.ts');
    
    console.log('\n✅ Seed completo finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}

seedAll();