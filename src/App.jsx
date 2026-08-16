import { Route, Routes } from "react-router";
import "./App.css";
import Kanban from "./pages/kanban";
import Sobre from "./pages/sobre";
import Login from "./pages/login";
import Sidebar from "./componentes/sidebar";
import RotaPrivada from "./componentes/RotaPrivada";
import { useAuth } from "./contexts/AuthContext";

function App() {

  const { logado } = useAuth();

  return (
    <div className="app-layout">
    
      {/* Exibir o sidebar apenas quando o usuário estiver logado */}
      {logado && <Sidebar />}

      {/* Conteúdo principal — muda conforme a URL */}
      <main className="app-conteudo" style={{ marginLeft: logado ? '220px' : '0' }}>
        <Routes>
          <Route path="/" element={<RotaPrivada><Kanban /></RotaPrivada>} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
