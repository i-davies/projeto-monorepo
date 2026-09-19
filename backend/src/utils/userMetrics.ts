export interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'aluno' | 'professor';
  status: 'ativo' | 'inativo' | 'pendente';
}

export interface UserMetricsSummary {
  totalUsers: number;
  activeCount: number;
  inactiveCount: number;
  pendingCount: number;
  activePercentage: number;
}

/**
 * Calcula a porcentagem de contas ativas e a distribuição de status de usuários.
 */
export function calculateUserMetrics(users: UserAccount[]): UserMetricsSummary {
  if (!users || users.length === 0) {
    return {
      totalUsers: 0,
      activeCount: 0,
      inactiveCount: 0,
      pendingCount: 0,
      activePercentage: 0,
    };
  }

  const totalUsers = users.length;
  let activeCount = 0;
  let inactiveCount = 0;
  let pendingCount = 0;

  for (const user of users) {
    if (user.status === 'ativo') {
      activeCount++;
    } else if (user.status === 'inativo') {
      inactiveCount++;
    } else {
      pendingCount++;
    }
  }

  const activePercentage = Math.round((activeCount / totalUsers) * 100);

  return {
    totalUsers,
    activeCount,
    inactiveCount,
    pendingCount,
    activePercentage,
  };
}
