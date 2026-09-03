import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Rota publica de login
router.post('/login', AuthController.login);

export { router as authRoutes };
