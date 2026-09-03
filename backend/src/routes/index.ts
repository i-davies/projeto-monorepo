import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);

// Registra as rotas de usuários sob o prefixo /users
router.use('/users', userRoutes);

export { router as appRoutes };
