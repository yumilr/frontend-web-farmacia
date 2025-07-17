// services/comprasApi.js
import axios from 'axios';

const comprasApi = axios.create({
  // 👇 La única diferencia: usa la variable de entorno para la API de compras
  baseURL: process.env.REACT_APP_API_COMPRAS_BASE, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// El interceptor es idéntico y se encarga de añadir el token a cada petición
comprasApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default comprasApi;