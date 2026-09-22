import { useState, useEffect } from "react";
import { userService } from "./services/api";
import type { User } from "./types/user";

export default function App() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [gatilhoRecarga, setGatilhoRecarga] = useState<number>(0);

  // Efeito execcutado na inicialização e sempre que o gatilho de recarga for acionado
  useEffect(() => {
    async function carregarUsuarios() {
      setCarregando(true);
      setErro(null);

      try {
        // Delay artificial para simular a latência de uma API real
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const lista = await userService.list();
        setUsuarios(lista);
      } catch (err) {
        if (err instanceof Error) {
          setErro(err.message);
        } else {
          setErro("Erro inesperado na conexão.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, [gatilhoRecarga]); // Dispara a busca na montagem e sempre que mudar

  if (carregando) {
    return (
      <div style={{ padding: "20px", color: "#6b7280" }}>
        Carregando dados do servidor...
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ padding: "20px", color: "#dc2626" }}>
        <p>
          <strong>Aviso:</strong> {erro}
        </p>
        <button onClick={() => setGatilhoRecarga((prev) => prev + 1)}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Lista de Usuários da API</h1>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id} style={{ margin: "8px 0" }}>
            <strong>{u.nome}</strong> ({u.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
