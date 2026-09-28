import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { UserTable } from "./components/UserTable";
import { userService } from "./services/api";
import type { User } from "./types/user";
import { useFormState } from "react-dom";

export default function App() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregandoLista, setCarregandoLista] = useState<boolean>(true);
  const [enviandoForm, setEnviandoForm] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // Estados contralados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [gatilhoRecarga, setGatilhoRecarga] = useState<number>(0);

  // Efeito execcutado na inicialização e sempre que o gatilho de recarga for acionado
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        setCarregandoLista(true);
        setMensagemErro(null);

        const dados = await userService.list();
        setUsuarios(dados);
      } catch (err: any) {
        setMensagemErro(
          err.message || "Erro ao carregar usuários do servidor.",
        );
      } finally {
        setCarregandoLista(false);
      }
    }

    carregarUsuarios();
  }, [gatilhoRecarga]); // Dispara a busca na montagem e sempre que mudar

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nome || !email || !senha) return;

    try {
      setEnviandoForm(true);
      setMensagemErro(null);

      await userService.create({
        nome,
        email,
        senha_hash: senha,
        password: senha,
      });

      // Limpa os campos após sucesso
      setNome("");
      setEmail("");
      setSenha("");

      // Regarrega a tabela com o novo registro
      setGatilhoRecarga((prev) => prev + 1);
    } catch (err: any) {
      setMensagemErro(err.message || "Falha ao realizar cadastro.");
    } finally {
      setEnviandoForm(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "30px auto",
        padding: "24px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <header
        style={{
          marginBottom: "28px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "16px",
        }}
      >
        <h1
          style={{ margin: "0 0 6px 0", fontSize: "1.8rem", color: "#111827" }}
        >
          Painel de Gestão de Usuários
        </h1>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Integração Front-end React com API Node.js/Express
        </p>
      </header>

      {/* Alerta de erro */}
      {mensagemErro && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <strong>Aviso:</strong> {mensagemErro}
        </div>
      )}
    </div>
  );
}
