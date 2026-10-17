import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

// Mock do model User
vi.mock('../models/User', () => ({
  User: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

// Mock do bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('UserController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // GET /api/users - index
  // ──────────────────────────────────────────────
  describe('GET /api/users', () => {
    it('deve retornar lista de usuários com status 200', async () => {
      const usuarios = [
        {
          id: 1,
          nome: 'Alice',
          email: 'alice@email.com',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ];
      vi.mocked(User.findAll).mockResolvedValue(usuarios as any);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuarios);
    });

    it('deve retornar 500 em caso de erro no banco', async () => {
      vi.mocked(User.findAll).mockRejectedValue(new Error('Falha no banco'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao listar usuários');
    });
  });

  // ──────────────────────────────────────────────
  // GET /api/users/:id - show
  // ──────────────────────────────────────────────
  describe('GET /api/users/:id', () => {
    it('deve retornar usuário por ID com status 200', async () => {
      const usuario = {
        id: 1,
        nome: 'Alice',
        email: 'alice@email.com',
        createdAt: '2026-01-01',
      };
      vi.mocked(User.findByPk).mockResolvedValue(usuario as any);

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuario);
    });

    it('deve retornar 400 se o ID for NaN (texto)', async () => {
      const response = await request(app).get('/api/users/abc');

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 400 se o ID for zero ou negativo', async () => {
      const response = await request(app).get('/api/users/0');

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      vi.mocked(User.findByPk).mockResolvedValue(null);

      const response = await request(app).get('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });

    it('deve retornar 500 em caso de erro no banco', async () => {
      vi.mocked(User.findByPk).mockRejectedValue(new Error('Falha no banco'));

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao buscar usuário');
    });
  });

  // ──────────────────────────────────────────────
  // POST /api/users - create
  // ──────────────────────────────────────────────
  describe('POST /api/users', () => {
    it('deve criar usuário com sucesso e retornar 201', async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hash123' as never);
      vi.mocked(User.create).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@email.com',
        createdAt: new Date('2026-01-01'),
      } as any);

      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'alice@email.com',
        password: 'senha123',
      });

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe('Alice Santos');
      expect(response.body.email).toBe('alice@email.com');
    });

    it('deve retornar 400 se o nome estiver vazio', async () => {
      const response = await request(app).post('/api/users').send({
        nome: '   ',
        email: 'alice@email.com',
        password: 'senha123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar 400 se o nome não for string', async () => {
      const response = await request(app).post('/api/users').send({
        nome: 123,
        email: 'alice@email.com',
        password: 'senha123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar 400 se o nome não for fornecido', async () => {
      const response = await request(app).post('/api/users').send({
        email: 'alice@email.com',
        password: 'senha123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar 400 se o email for inválido', async () => {
      const response = await request(app).post('/api/users').send({
        nome: 'Alice',
        email: 'email-invalido',
        password: 'senha123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Informe um e-mail valido.');
    });

    it('deve retornar 400 se o email não for fornecido', async () => {
      const response = await request(app).post('/api/users').send({
        nome: 'Alice',
        password: 'senha123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Informe um e-mail valido.');
    });

    it('deve retornar 400 se a senha tiver menos de 6 caracteres', async () => {
      const response = await request(app).post('/api/users').send({
        nome: 'Alice',
        email: 'alice@email.com',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'A senha deve conter no minimo 6 caracteres.',
      );
    });

    it('deve retornar 400 se a senha não for fornecida', async () => {
      const response = await request(app).post('/api/users').send({
        nome: 'Alice',
        email: 'alice@email.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'A senha deve conter no minimo 6 caracteres.',
      );
    });

    it('deve retornar 400 se o e-mail já estiver cadastrado', async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        id: 10,
        email: 'alice@email.com',
      } as any);

      const response = await request(app).post('/api/users').send({
        nome: 'Alice',
        email: 'alice@email.com',
        password: 'senha123',
      });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      vi.mocked(User.findOne).mockRejectedValue(new Error('Falha no banco'));

      const response = await request(app).post('/api/users').send({
        nome: 'Alice',
        email: 'alice@email.com',
        password: 'senha123',
      });

      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao cadastrar usuário');
    });
  });

  // ──────────────────────────────────────────────
  // PUT /api/users/:id - update
  // ──────────────────────────────────────────────
  describe('PUT /api/users/:id', () => {
    it('deve atualizar o usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        nome: 'Alice',
        email: 'alice@email.com',
        createdAt: new Date(),
        save: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);
      vi.mocked(User.findOne).mockResolvedValue(null);

      const response = await request(app).put('/api/users/1').send({
        nome: 'Alice Atualizada',
        email: 'alicenova@email.com',
      });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Alice Atualizada');
    });

    it('deve retornar 400 se o ID for inválido', async () => {
      const response = await request(app)
        .put('/api/users/abc')
        .send({ nome: 'Alice' });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      vi.mocked(User.findByPk).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/users/999')
        .send({ nome: 'Alice' });

      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });

    it('deve retornar 404 se o nome fornecido for inválido (apenas espaços)', async () => {
      const mockUser = {
        id: 1,
        nome: 'Alice',
        email: 'alice@email.com',
        save: vi.fn(),
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);

      const response = await request(app)
        .put('/api/users/1')
        .send({ nome: '   ' });

      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('O campo nome deve ser um texto valido.');
    });

    it('deve retornar 400 se o e-mail fornecido for inválido', async () => {
      const mockUser = {
        id: 1,
        nome: 'Alice',
        email: 'alice@email.com',
        save: vi.fn(),
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);

      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'email-invalido' });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Informe um e-mail valido.');
    });

    it('deve retornar 400 se o e-mail já estiver em uso por outro usuário', async () => {
      const mockUser = {
        id: 1,
        nome: 'Alice',
        email: 'alice@email.com',
        save: vi.fn(),
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);
      vi.mocked(User.findOne).mockResolvedValue({
        id: 2,
        email: 'outro@email.com',
      } as any);

      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'outro@email.com' });

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Este e-mail já está em uso.');
    });

    it('não deve retornar erro se o email em uso pertencer ao próprio usuário', async () => {
      const mockUser = {
        id: 1,
        nome: 'Alice',
        email: 'alice@email.com',
        createdAt: new Date(),
        save: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);
      // findOne retorna o próprio usuário (mesmo id)
      vi.mocked(User.findOne).mockResolvedValue({
        id: 1,
        email: 'alice@email.com',
      } as any);

      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'alice@email.com' });

      expect(response.status).toBe(200);
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      vi.mocked(User.findByPk).mockRejectedValue(new Error('Falha no banco'));

      const response = await request(app)
        .put('/api/users/1')
        .send({ nome: 'Alice' });

      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao atualizar usuário');
    });
  });

  // ──────────────────────────────────────────────
  // DELETE /api/users/:id - delete
  // ──────────────────────────────────────────────
  describe('DELETE /api/users/:id', () => {
    it('deve deletar usuário com sucesso e retornar 204', async () => {
      const mockUser = {
        id: 1,
        destroy: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(204);
    });

    it('deve retornar 400 se o ID for inválido', async () => {
      const response = await request(app).delete('/api/users/abc');

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      vi.mocked(User.findByPk).mockResolvedValue(null);

      const response = await request(app).delete('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      vi.mocked(User.findByPk).mockRejectedValue(new Error('Falha no banco'));

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao excluir usuário');
    });
  });
});
