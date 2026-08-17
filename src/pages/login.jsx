import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

function Login() {
  const { login } = useAuth();  
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [shake,   setShake]   = useState(false);


  // useNavigate retorna uma função de navegação
  // Chamamos essa função DENTRO de handleLogin (evento)
  // Nunca no return — lá usaríamos <Navigate> em vez disso
  const navigate = useNavigate();

  function handleLogin() {
    // Credenciais fixas — apenas para fins didáticos
    // Autenticação real com banco de dados vem no back-end
    if (usuario === "admin" && senha === "1234") {
      login(); // atualiza o estado no App.jsx
      navigate("/"); // redireciona — chamado APÓS a ação
      return;
    }
    // Credenciais erradas → exibe mensagem de erro
    setErro("Usuário ou senha incorretos");
    setShake(true);
    // Remove a classe após 500ms para poder disparar de novo
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div className="login-container">
      <div className={`login-card ${shake ? "shake" : ""}`}>
        <h1 className="login-logo">TaskFlow</h1>
        <p className="login-subtitulo">Faça login para continuar</p>

        {/* Input de usuário — estado controlado */}
        <input
          className="login-input"
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        {/* Input de senha — type='password' oculta os caracteres */}
        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {/* Mensagem de erro — renderização condicional com && */}
        {erro && <p className="login-erro">{erro}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Entrar
        </button>

        <p className="login-aviso">
          Este login é apenas para fins didáticos. Credenciais reais vêm no
          módulo back-end.
        </p>
      </div>
    </div>
  );
}

export default Login;
