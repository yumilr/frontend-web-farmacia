import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/usuariosApi';
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

      // 👇 --- INICIO DE LA CORRECCIÓN --- 👇

      // 1. El 'body' es un string, lo convertimos a un objeto JSON
      const responseBody = JSON.parse(res.data.body);

      // 2. Ahora sí podemos extraer el token desde el body parseado
      const { token } = responseBody;

      // 3. Como la API no devuelve 'user', creamos un objeto básico nosotros
      const userData = { email: email }; 
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // 4. Guardamos el token y lo configuramos en la cabecera
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 👆 --- FIN DE LA CORRECCIÓN --- 👆

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
