import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mockProducts from '../services/mockProducts';
import ProductCard from '../components/ProductCard';
import './ProductListPage.scss';

const ProductListPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriaSeleccionada = queryParams.get('categoria');
  const searchQuery = queryParams.get('search');

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    let filtered = mockProducts;

    if (categoriaSeleccionada) {
      filtered = filtered.filter(p => p.categoria === categoriaSeleccionada);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProductos(filtered);
  }, [categoriaSeleccionada, searchQuery]); // ⚠️ ¡Importante incluir ambos!

  return (
    <div className="product-list">
      <h2>
        {categoriaSeleccionada
          ? `Categoría: ${categoriaSeleccionada}`
          : searchQuery
          ? `Resultados de búsqueda para: "${searchQuery}"`
          : 'Todos los productos'}
      </h2>

      {productos.length === 0 ? (
        <p>No hay productos que coincidan.</p>
      ) : (
        <div className="grid">
          {productos.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
