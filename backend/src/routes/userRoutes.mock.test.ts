import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';

// Intercepta o modulo do Model User
vi.mock('../models/User', () => ({
  User: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn(),
  },
}));

describe('Testes de Rotas com Mocking do Model User', () => {
  // Limpa o historico de chamadas e retornos de todos os mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/users - deve retornar lista mockada de usuarios com status 200', async () => {
    // Arrange: Define o retorno que o mock do Sequelize devera fornecer
    const usuariosFalsos = [
      {
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        createdAt: '2026-01-01',
      },
      {
        id: 2,
        nome: 'Bob Silva',
        email: 'bob@fatec.sp.gov.br',
        createdAt: '2026-01-02',
      },
    ];
    vi.mocked(User.findAll).mockResolvedValue(usuariosFalsos as any);

    // Act
    const response = await request(app).get('/api/users');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(usuariosFalsos);
    // Garante que o controller realmente chamou o metodo findAll com os atributos corretos
    expect(User.findAll).toHaveBeenCalledTimes(1);
    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
    });
  });

  it('POST /api/users - deve retornar status 409 quando o e-mail ja existir', async () => {
    // Arrange: Simula que o findOne encontrou um usuario com o mesmo e-mail
    vi.mocked(User.findOne).mockResolvedValue({
      id: 10,
      email: 'existente@fatec.sp.gov.br',
    } as any);

    // Act
    const response = await request(app).post('/api/users').send({
      nome: 'Usuario Teste',
      email: 'existente@fatec.sp.gov.br',
      password: 'senha123456',
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.erro).toBe(
      'Já existe um usuário cadastrado com este e-mail.',
    );
    // Garante que o metodo create NUNCA foi chamado apos a deteccao do conflito
    expect(User.create).not.toHaveBeenCalled();
  });
});
