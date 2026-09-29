import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { UserTable } from "./components/UserTable";
import { userService } from "./services/api";
import type { User } from "./types/user";

export default function App() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregandoLista, setCarregandoLista] = useState<boolean>(true);
  const [enviandoForm, setEnviandoForm] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // Estados contralados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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

      {/* Layout em Grid de 2 Colunas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* Coluna 1: Formulário de Cadastro */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "1.2rem",
              color: "#374151",
            }}
          >
            Novo Usuário
          </h2>

          <form onSubmit={handleSubmit}>
            <Input
              label="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Mariana Silva"
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@dominio.com"
              required
            />
            <Input
              label="Senha de Acesso"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Minimo de 6 caracteres"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={enviandoForm}
            >
              Cadastrar Usuário
            </Button>
          </form>
        </div>

        {/* Coluna 2: Tabela de Usuários */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#374151" }}>
              Usuários Cadastrados
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setGatilhoRecarga((prev) => prev + 1)}
              disabled={carregandoLista}
            >
              Atualizar Lista
            </Button>
          </div>
          <UserTable usuarios={usuarios} carregando={carregandoLista} />
        </div>
      </div>
    </div>
  );
}
