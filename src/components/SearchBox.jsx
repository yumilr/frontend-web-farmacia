import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchBox.scss';
import mockProducts from '../services/mockProducts';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register'];

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = mockProducts.filter(p =>
      p.nombre.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  }, [query]);

  const handleSelect = (producto) => {
    navigate(`/productos?search=${encodeURIComponent(producto.nombre)}`);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/productos?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Cerrar sugerencias si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <div className="search-box" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Buscar medicina o producto..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
        />
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(prod => (
            <li key={prod.id} className="suggestion-item"     onClick={() => handleSelect(prod)}>
              <img src={prod.imagen} alt={prod.nombre} className="suggestion-image" />
              <span className="suggestion-text">{prod.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
