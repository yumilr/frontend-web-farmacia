import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/Logo Vertical.svg';  
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPage.scss';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.success) {
      navigate('/login');
    } else {
      setMsg(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <div className='logo-container'>
        <Logo className="logo-icon"/>
        </div>
        <h2>Crear Cuenta</h2>
        {msg && <p className="error-message">{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <button type="submit">Registrarme</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
