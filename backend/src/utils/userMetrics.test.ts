import { describe, it, expect } from 'vitest';
import { calculateUserMetrics, UserAccount } from './userMetrics';

describe('Cálculo de Estatísticas e Métricas: userMetrics.ts', () => {
  it('deve retornar zeros para uma lista vazia de usuários', () => {
    // Arrange
    const emptyUsers: UserAccount[] = [];

    // Act
    const result = calculateUserMetrics(emptyUsers);

    // Assert
    expect(result).toEqual({
      totalUsers: 0,
      activeCount: 0,
      inactiveCount: 0,
      pendingCount: 0,
      activePercentage: 0,
    });
  });

  it('deve calcular corretamente 50% de contas ativas quando metade dos usuários estiver ativa', () => {
    // Arrange
    const users: UserAccount[] = [
      {
        id: 1,
        name: 'Carlos',
        email: 'carlos@fatec.sp.gov.br',
        role: 'aluno',
        status: 'ativo',
      },
      {
        id: 2,
        name: 'Ana',
        email: 'ana@fatec.sp.gov.br',
        role: 'professor',
        status: 'ativo',
      },
      {
        id: 3,
        name: 'Beatriz',
        email: 'beatriz@fatec.sp.gov.br',
        role: 'aluno',
        status: 'pendente',
      },
      {
        id: 4,
        name: 'Daniel',
        email: 'daniel@fatec.sp.gov.br',
        role: 'admin',
        status: 'inativo',
      },
    ];

    // Act
    const result = calculateUserMetrics(users);

    // Assert
    expect(result.totalUsers).toBe(4);
    expect(result.activeCount).toBe(2);
    expect(result.pendingCount).toBe(1);
    expect(result.inactiveCount).toBe(1);
    expect(result.activePercentage).toBe(50);
  });

  it('deve retornar 100% de usuários ativos quando todas as contas estiverem ativas', () => {
    // Arrange
    const users: UserAccount[] = [
      {
        id: 1,
        name: 'Carlos',
        email: 'carlos@fatec.sp.gov.br',
        role: 'aluno',
        status: 'ativo',
      },
      {
        id: 2,
        name: 'Ana',
        email: 'ana@fatec.sp.gov.br',
        role: 'professor',
        status: 'ativo',
      },
    ];

    // Act
    const result = calculateUserMetrics(users);

    // Assert
    expect(result.activePercentage).toBe(100);
  });
});
