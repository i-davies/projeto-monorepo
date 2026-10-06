// src/contexts/AuthProvider.tsx
import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User, LoginCredentials } from "../types/auth";

const STORAGE_TOKEN_KEY = "@app:token";
const STORAGE_USER_KEY = "@app:user";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efeito executado na inicializacao para recuperar sessao salva
  useEffect(() => {
    function carregarSessaoArmazenada() {
      try {
        const tokenSalvo = localStorage.getItem(STORAGE_TOKEN_KEY);
        const usuarioSalvo = localStorage.getItem(STORAGE_USER_KEY);

        if (tokenSalvo) {
          setToken(tokenSalvo);

          if (
            usuarioSalvo &&
            usuarioSalvo !== "undefined" &&
            usuarioSalvo !== "null"
          ) {
            setUser(JSON.parse(usuarioSalvo) as User);
          } else if (tokenSalvo.includes(".")) {
            try {
              const payload = JSON.parse(atob(tokenSalvo.split(".")[1]));
              setUser({
                id: payload.id || 1,
                nome: payload.nome || payload.email?.split("@")[0] || "Usuario",
                email: payload.email || "",
                perfil: payload.perfil || "usuario",
              });
            } catch {
              setUser({ id: 1, nome: "Usuario", email: "" });
            }
          }
        }
      } catch (erro) {
        console.error("Falha ao restaurar sessao armazenada:", erro);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      } finally {
        setIsLoading(false);
      }
    }

    carregarSessaoArmazenada();
  }, []);

  // Metodo de autenticacao com a API
  async function login(credentials: LoginCredentials): Promise<void> {
    const resposta = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!resposta.ok) {
      let mensagemErro = "Falha ao autenticar usuario.";
      try {
        const dadosErro = await resposta.json();
        mensagemErro =
          dadosErro.erro ||
          dadosErro.error ||
          dadosErro.message ||
          mensagemErro;
      } catch {
        const textoErro = await resposta.text().catch(() => "");
        if (textoErro) mensagemErro = textoErro;
      }
      throw new Error(mensagemErro);
    }

    const dados = await resposta.json();
    const tokenRecebido: string =
      dados.token ||
      dados.accessToken ||
      dados.access_token ||
      dados.session?.access_token;

    if (!tokenRecebido) {
      throw new Error("Token de autenticacao nao recebido da API.");
    }

    // Recupera o usuario da resposta ou decodifica as informacoes do JWT
    let usuarioRecebido: User | null = dados.user || dados.usuario || null;

    if (!usuarioRecebido && tokenRecebido.includes(".")) {
      try {
        const payloadBase64 = tokenRecebido.split(".")[1];
        const payloadJson = JSON.parse(atob(payloadBase64));
        usuarioRecebido = {
          id: payloadJson.id || payloadJson.sub || 1,
          nome:
            payloadJson.nome ||
            payloadJson.user_metadata?.nome ||
            credentials.email.split("@")[0],
          email: payloadJson.email || credentials.email,
          perfil: payloadJson.perfil || payloadJson.role || "usuario",
        };
      } catch {
        usuarioRecebido = {
          id: 1,
          nome: credentials.email.split("@")[0],
          email: credentials.email,
          perfil: "usuario",
        };
      }
    } else if (!usuarioRecebido) {
      usuarioRecebido = {
        id: 1,
        nome: credentials.email.split("@")[0],
        email: credentials.email,
        perfil: "usuario",
      };
    }

    // Atualiza o estado em memoria
    setToken(tokenRecebido);
    setUser(usuarioRecebido);

    // Persiste no armazenamento local do navegador
    localStorage.setItem(STORAGE_TOKEN_KEY, tokenRecebido);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuarioRecebido));
  }

  // Metodo de encerramento de sessao
  function logout(): void {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  }

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
