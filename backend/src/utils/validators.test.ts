import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isStrongPassword,
  //validateUserInput,
  //UserInput,
} from './validators';

describe('Módulo de Validação: validators.ts', () => {
  describe('Função isValidEmail', () => {
    it('Deve retornar true para um endereço de e-mail válido AAA( Arrange, Act, Assert)', () => {
      // 1. Arrange (Preparar)
      const validEmail = 'aluno.fatec@so.gov.br';

      // 2. Act (Agir)
      const result = isValidEmail(validEmail);

      // 3. Assert (Afirmar)
      expect(result).toBe(true);
    });

    it('deve retornar false para e-mails com formato inválido', () => {
      // Arrange & Act
      expect(isValidEmail('usuario_sem_arroba.com')).toBe(false);
      expect(isValidEmail('usuario@dominio')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Função isStrongPassword', () => {
    it('Deve aceitar uma senha com 8 caracteres, maiúscula e número', () => {
      // Arrange
      const strongPassword = 'Password123';

      // Act
      const result = isStrongPassword(strongPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('Deve rejeitar senhas com menos de 8 caracteres', () => {
      const shortPassword = 'Pass1';

      const result = isStrongPassword(shortPassword);

      expect(result).toBe(false);
    });

    it('Deve rejeitar senhas sem letras maiúsculas', () => {
      const noUpperPassword = 'password123';

      const result = isStrongPassword(noUpperPassword);

      expect(result).toBe(false);
    });

    it('Deve rejeitar senhas sem números', () => {
      const noNumberPassword = 'PassowrdSemNumero';

      const result = isStrongPassword(noNumberPassword);

      expect(result).toBe(false);
    });
  });
});
