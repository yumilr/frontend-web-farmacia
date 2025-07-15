import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import productosApi from '../services/productosApi';
import './SearchBox.scss';
import mockProducts from '../services/mockProducts';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const { tenantId } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register'];

  useEffect(() => {
    if (query.length < 2 || !tenantId) {
      setSuggestions([]);
      return;
    }

    // Temporizador para esperar 300ms después de la última tecla
    const debounceTimer = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const requestBody = {
            tenant_id: tenantId,
            search: query,
          };
          const res = await productosApi.post('/productos/listar', requestBody);
          setSuggestions(res.data.items || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]); 
        }
      };

      fetchSuggestions();
    }, 300);

    // Limpia el temporizador si el usuario sigue tecleando
    return () => clearTimeout(debounceTimer);
  }, [query, tenantId]);

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

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(prod => (
            <li key={prod.producto_id} className="suggestion-item"     onClick={() => handleSelect(prod)}>
              <img 
                src={prod.image_url || `${process.env.REACT_APP_S3_BUCKET_URL}/${prod.producto_id}.png`}
                alt={prod.nombre} 
                className="suggestion-image" 
              />
              <span className="suggestion-text">{prod.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
