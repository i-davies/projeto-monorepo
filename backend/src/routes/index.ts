import { Router } from "express";
import { userRoutes } from "./userRoutes";

const router = Router();

// Registra as rotas de usuários sob o prefixo /users
router.use('/users', userRoutes);

export { router as appRoutes };