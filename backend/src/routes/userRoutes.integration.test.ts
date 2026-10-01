import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Testes de Integracao: Rotas de Usuarios (/api/users)', () => {
  // 1. Testando Listagem Geral
  describe('GET /api/users', () => {
    it('deve retornar status 200 e uma lista de usuarios no formato JSON', async () => {
      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('nome');
        expect(response.body[0]).toHaveProperty('email');
        // Garante que o hash da senha nunca seja exposto na resposta HTTP
        expect(response.body[0]).not.toHaveProperty('senha_hash');
      }
    });
  });

  // 2. Testando Busca por ID
  describe('GET /api/users/:id', () => {
    it('deve retornar status 400 se o ID informado nao for um numero valido', async () => {
      // Act
      const response = await request(app).get('/api/users/abc-invalido');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    it('deve retornar status 404 se o usuario nao existir', async () => {
      // Act
      const response = await request(app).get('/api/users/999999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });
  });

  // 3. Testando Criacao de Recursos com Validacao de Payload
  describe('POST /api/users', () => {
    it('deve cadastrar um novo usuario com sucesso e retornar status 201', async () => {
      // Arrange
      const novoUsuario = {
        nome: 'Mariana Silva',
        email: `mariana${Date.now()}@email.com`,
        password: 'senhaForte123',
      };

      // Act
      const response = await request(app).post('/api/users').send(novoUsuario);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(novoUsuario.nome);
      expect(response.body.email).toBe(novoUsuario.email);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('senha_hash');
    });

    it('deve retornar status 400 se o campo obrigatorio nome estiver ausente', async () => {
      // Arrange
      const payloadInvalido = {
        email: `semnome${Date.now()}@email.com`,
        password: 'senhaForte123',
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(payloadInvalido);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar status 400 se o e-mail informado for invalido', async () => {
      // Arrange
      const payloadEmailInvalido = {
        nome: 'Carlos Eduardo',
        email: 'formato-invalido-sem-arroba',
        password: 'senhaForte123',
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(payloadEmailInvalido);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });
  });

  // 4. Testando Atualizacao de Recursos
  describe('PUT /api/users/:id', () => {
    it('deve retornar status 404 ao tentar atualizar um usuario inexistente', async () => {
      // Act
      const response = await request(app)
        .put('/api/users/999999')
        .send({ nome: 'Nome Atualizado' });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });
  });

  // 5. Testando Exclusao de Recursos
  describe('DELETE /api/users/:id', () => {
    it('deve retornar status 404 ao tentar excluir um usuario inexistente', async () => {
      // Act
      const response = await request(app).delete('/api/users/999999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });
  });
});
