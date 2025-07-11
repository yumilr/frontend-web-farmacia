import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactComponent as Logo } from '../assets/Logo Vertical.svg';  
import '../styles/AuthPage.scss';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password); // usa AuthContext
    if (res.success) {
      navigate('/'); // 👈 Redirige al homepage
    } else {
      setMsg(res.message); // muestra error si ocurre
    }
  };


  return (
    <div className="auth-page">
      <div className="form-container">
        <div className='logo-container'>
        <Logo className="logo-icon"/>
        </div>
        <h2>Iniciar Sesión</h2>
        {msg && <p className="error-message">{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" value={password} placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Ingresar</button>
        </form>

        {/* Enlace a registro */}
        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
