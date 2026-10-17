import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './authMiddleware';

// Mock do jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

// Helper para criar mocks de req, res e next
function createMocks() {
  const req = {
    headers: {},
  } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  return { req, res, next };
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 se o header Authorization não estiver presente', () => {
    const { req, res, next } = createMocks();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o header Authorization não começar com "Bearer "', () => {
    const { req, res, next } = createMocks();
    (req as any).headers.authorization = 'Basic token123';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o token for inválido ou expirado', () => {
    const { req, res, next } = createMocks();
    (req as any).headers.authorization = 'Bearer tokeninvalido';

    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('jwt malformed');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Token invalido ou expirado.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() e salvar o usuário decodificado se o token for válido', () => {
    const { req, res, next } = createMocks();
    (req as any).headers.authorization = 'Bearer tokenvalido';

    const decodedUser = { id: 1, email: 'teste@email.com', nome: 'Teste' };
    vi.mocked(jwt.verify).mockReturnValue(decodedUser as never);

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect((req as any).user).toEqual(decodedUser);
    expect(res.status).not.toHaveBeenCalled();
  });
});
