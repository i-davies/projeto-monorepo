import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Testes de Integração: Rotas de Usuários (/api/users)', () => {
  // 1. Testando Listagem Geral
  describe('GET /api/users', () => {
    it('deve retornar status 200 e uma lista de usuários no formato JSON', async () => {
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
});
