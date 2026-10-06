import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";

function Dashboard() {
  return <h2 className="text-xl font-bold text-slate-800">Painel Principal</h2>;
}

function Perfil() {
  return (
    <h2 className="text-xl font-bold text-slate-800">Perfil do Usuário</h2>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O AppLayout envolvera todas as rotas filhas declaradas aqui dentro */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Redirecionamento de segurança para qualquer rota desconhecida */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
