import type { User } from "../types/user";

export interface UserTableProps {
  usuarios: User[];
  carregando: boolean;
}

export function UserTable({ usuarios, carregando }: UserTableProps) {
  // Estado 1: Carregamento
  if (carregando) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
        Carregando lista de usuários...
      </div>
    );
  }

  // Estado 2: Nenhum registro encontrado
  if (usuarios.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px",
          color: "#6b7280",
          border: "1px dashed #d1d5db",
          borderRadius: "8px",
        }}
      >
        Nenhum usuário cadastrado até o momento.
      </div>
    );
  }

  // Estado 3: Lista de dados preenchida
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f3f4f6",
              borderBottom: "2px solid #e5e7eb",
              textAlign: "left",
            }}
          >
            <th
              style={{
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "#374151",
              }}
            >
              ID
            </th>
            <th
              style={{
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "#374151",
              }}
            >
              Nome
            </th>
            <th
              style={{
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "#374151",
              }}
            >
              E-mail
            </th>
            <th
              style={{
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "#374151",
              }}
            >
              Data de Cadastro
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td
                style={{
                  padding: "10px 14px",
                  color: "#6b7280",
                  fontSize: "0.85rem",
                }}
              >
                #{usuario.id}
              </td>
              <td
                style={{
                  padding: "10px 14px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {usuario.nome}
              </td>
              <td
                style={{
                  padding: "10px 14px",
                  color: "#4b5563",
                }}
              >
                {usuario.email}
              </td>
              <td
                style={{
                  padding: "10px 14px",
                  color: "#6b7280",
                  fontSize: "0.85rem",
                }}
              >
                {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
