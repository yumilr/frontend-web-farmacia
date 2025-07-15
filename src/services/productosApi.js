// services/productosApi.js
import axios from 'axios';

const productosApi = axios.create({
  baseURL: process.env.REACT_APP_API_PRODUCTOS_BASE, // Usando la variable de entorno
  headers: {
    'Content-Type': 'application/json',
  }
});

// 👇 AÑADE ESTE INTERCEPTOR
// Se ejecutará en cada petición que hagas con 'productosApi'
productosApi.interceptors.request.use(
  (config) => {
    // 1. Obtiene el token del localStorage
    const token = localStorage.getItem('token');

    console.log('➡️ INTERCEPTOR: Enviando petición a', config.url, 'con token:', token);

    // 2. Si el token existe, lo añade a la cabecera 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 3. Devuelve la configuración modificada para que la petición continúe
    return config;
  },
  (error) => {
    // Maneja errores en la petición
    return Promise.reject(error);
  }
);

export default productosApi;