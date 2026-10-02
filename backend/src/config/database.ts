import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

export const sequelize = isTestEnvironment
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false, // Desativa logs SQL no terminal durante os testes para manter a saida limpa
    })
  : new Sequelize(
      process.env.DB_NAME || 'fatec_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        dialectOptions:
          process.env.DB_SSL === 'true'
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
        logging: false,
      },
    );
