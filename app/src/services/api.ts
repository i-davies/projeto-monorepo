import type { User, CreateUserDTO } from "../types/user";

const API_BASE_URL = "http://localhost:3000/api";

export const userService = {
  // GET /api/users - Listar todos os usuarios
  async list(): Promise<User[]> {
    const resposta = await fetch(`${API_BASE_URL}/users`);
    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao buscar a lista de usuários.");
    }
    return resposta.json();
  },
  // POST /api/users - Cadastrar novo usuário
  async create(dados: CreateUserDTO): Promise<User[]> {
    const resposta = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao cadastrar usuário.");
    }
    return resposta.json();
  },
};
