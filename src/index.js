import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/app.scss';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <TenantProvider>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </TenantProvider>
);
