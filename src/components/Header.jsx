import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBox from './SearchBox';
import { useAuth } from '../contexts/AuthContext';
import './Header.scss';
import { ReactComponent as Logo } from '../assets/Logo.svg';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const hiddenRoutes = ['/login', '/register'];
  const shouldHideCart = hiddenRoutes.includes(location.pathname);

  return (
    <header className="header">
      <Link to="/productos" className="logo">
        <Logo className="logo-icon" />
      </Link>

      <SearchBox />

      <div className="actions">
        {user ? (
          <>
            <span>Hola, {user.nombre}</span>
            {/* 👇 AÑADE ESTE ENLACE AQUÍ */}
            <Link to="/mis-compras" className="header-link">Mis Compras</Link>
            <button onClick={logout} className="logout-btn">Salir</button>
          </>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}

        {!shouldHideCart && (
          <Link to="/cart" className="cart">🛒 Carrito</Link>
        )}
      </div>
    </header>
  );
};

export default Header;