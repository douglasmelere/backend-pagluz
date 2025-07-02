import { createConnection } from 'typeorm';

async function resetDatabase() {
  const connection = await createConnection();
  try {
    await connection.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Reset failed:', error);
  } finally {
    await connection.close();
  }
}

resetDatabase().catch((error) => {
  console.error('❌ Erro durante o reset:', error);
  process.exit(1);
});
