import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { categoryData } from '../services/categories';

import './Navbar.scss';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const hiddenRoutes = ['/login', '/register'];
  const shouldHideNavbar = hiddenRoutes.includes(location.pathname);

  if (shouldHideNavbar) return null;

  const handleSubcategoryClick = (sub) => {
    navigate(`/productos?categoria=${encodeURIComponent(sub)}`);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div
          className="dropdown"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            setIsOpen(false);
            setSelectedCategory(null);
          }}
        >
          <button className="dropdown-btn">Categorías</button>
          {isOpen && (
            <div className="dropdown-menu">
              <div className="column left">
                {Object.keys(categoryData).map((cat) => (
                  <div
                    key={cat}
                    className={`item ${selectedCategory === cat ? 'active' : ''}`}
                    onMouseEnter={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
              <div className="column right">
                {selectedCategory &&
                  categoryData[selectedCategory].map((sub) => (
                    <div key={sub} className="item" onClick={() => handleSubcategoryClick(sub)}>
                      {sub}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span className="welcome">Hola, {user.nombre || user.user_id}</span>
            <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
