import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useTenant } from './TenantContext';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { tenantId } = useTenant();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🟡 Importante

  // 🔄 Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.warn('Error parsing local user', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false); // ✅ Marca como terminado
  }, []);

  const register = async (userData) => {
    try {
      await api.post('/usuarios/crear', { 
        tenant_id: tenantId,
        user_id: userData.email,
        password: userData.password,
        nombre: userData.nombre,
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error al crear la cuenta',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/usuarios/login', {
        tenant_id: tenantId,
        user_id: email,
        password
      });

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error de login'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
