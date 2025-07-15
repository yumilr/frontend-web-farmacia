// services/usuariosApi.js
import axios from 'axios';

const usuariosApi = axios.create({
  baseURL: process.env.REACT_APP_API_USUARIOS_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default usuariosApi;