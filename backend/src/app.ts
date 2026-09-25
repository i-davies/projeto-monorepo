import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import cors from 'cors';
import { appRoutes } from './routes';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    mensagem: 'Servidor Backend rodando com sucesso.',
    timestamp: new Date().toISOString(),
  });
});

// Rota da documentação interativa
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Registra todas as rotas da aplicacao sob o prefixo /api
app.use('/api', appRoutes);

export { app };
