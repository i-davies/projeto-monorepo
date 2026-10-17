import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock do model User
vi.mock('../models/User', () => ({
  User: {
    findOne: vi.fn(),
  },
}));

// Mock do bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

// Mock do jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

describe('AuthController - POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 400 se email e senha não forem fornecidos', async () => {
    const response = await request(app).post('/api/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('Email e senha são obrigatórios');
  });

  it('deve retornar 400 se apenas o email for fornecido', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@email.com' });

    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('Email e senha são obrigatórios');
  });

  it('deve retornar 400 se apenas a senha for fornecida', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'senha123' });

    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('Email e senha são obrigatórios');
  });

  it('deve retornar 401 se o usuário não for encontrado', async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@email.com', password: 'senha123' });

    expect(response.status).toBe(401);
    expect(response.body.erro).toBe('Credenciais invalidas.');
  });

  it('deve retornar 401 se o usuário não tiver senha_hash', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      id: 1,
      email: 'teste@email.com',
      nome: 'Teste',
      senha_hash: null,
    } as any);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@email.com', password: 'senha123' });

    expect(response.status).toBe(401);
    expect(response.body.erro).toBe('Credenciais invalidas.');
  });

  it('deve retornar 401 se a senha estiver incorreta', async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      id: 1,
      email: 'teste@email.com',
      nome: 'Teste',
      senha_hash: '$2a$10$hashinvalida',
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@email.com', password: 'senhaerrada' });

    expect(response.status).toBe(401);
    expect(response.body.erro).toBe('Credenciais invalidas.');
  });

  it('deve retornar 200 e token JWT em login bem-sucedido', async () => {
    const fakeUser = {
      id: 1,
      email: 'teste@email.com',
      nome: 'Teste Silva',
      senha_hash: '$2a$10$hashvalido',
    };
    vi.mocked(User.findOne).mockResolvedValue(fakeUser as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue('fake.jwt.token' as never);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@email.com', password: 'senha123' });

    expect(response.status).toBe(200);
    expect(response.body.mensagem).toBe('Login realizado com sucesso!');
    expect(response.body.token).toBe('fake.jwt.token');
  });

  it('deve retornar 500 se ocorrer um erro inesperado', async () => {
    vi.mocked(User.findOne).mockRejectedValue(new Error('Erro de banco'));

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@email.com', password: 'senha123' });

    expect(response.status).toBe(500);
    expect(response.body.erro).toBe('Erro de banco');
  });
});
