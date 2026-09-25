import dotenv from 'dotenv';
import { app } from './app';
import { sequelize } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o PostgreSQL no Supabase realizada com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(
        `Heath Check disponivel em: http://localhost:${PORT}/api/health`,
      );
    });
  } catch (error) {
    console.log('Erro ao conectar com o banco de dados: ', error);
  }
}

main();
