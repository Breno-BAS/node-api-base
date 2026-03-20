import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o hook de navegação
import { login } from '../services/auth.service';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate(); // 2. Inicializar o navigate

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const response = await login(email, password);
      localStorage.setItem('jwtToken', response.token);
      setMessage('Login successful! Token saved to localStorage.');
      
      // Opcional: Redirecionar para a home após 1 segundo
      setTimeout(() => navigate('/'), 1000);
      
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Login failed.');
      } else {
        setError('Network error or server unavailable.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
      </form>

      {/* 3. Link para criar usuário */}
      <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>Não tem uma conta? </span>
        <span 
          onClick={() => navigate('/register')} 
          style={{ fontSize: '14px', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Create user
        </span>
      </div>

      {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{message}</p>}
    </div>
  );
};

export default Login;