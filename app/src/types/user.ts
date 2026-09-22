// Contrato do Usuário retornado pelo banco de dados
export interface User {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
}

// Dados necessários para cadastrar um novo usuario
export interface CreateUserDTO {
  nome: string;
  email: string;
  senha_hash: string;
}
