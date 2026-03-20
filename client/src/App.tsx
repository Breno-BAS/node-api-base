import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; // Certifique-se de que o nome do arquivo e do componente batem

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota de Registro (Criar Usuário) */}
          <Route path="/register" element={<Register />} />

          {/* Rota Inicial (Home) - Por enquanto redireciona para login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;