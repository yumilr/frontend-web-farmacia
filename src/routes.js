import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import EditProductPage from './pages/EditProductPage';
import CreateProductPage from './pages/CreateProductPage';



const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/productos" element={<ProductListPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/productos/editar" element={<EditProductPage />} />
    <Route path="/productos/crear" element={<CreateProductPage />} />
  </Routes>
);

export default AppRoutes;
