import "./App.css";
import { Button } from "./components/Button";

function App() {
  return (
    <>
      <Button>Cadastrar</Button>
      <Button variant="secondary">Resetar</Button>
      <Button variant="danger">Deletar</Button>
    </>
  );
}

export default App;
