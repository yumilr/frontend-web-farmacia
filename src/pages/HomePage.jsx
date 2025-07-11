import React, { useEffect, useState } from 'react';
import mockProducts from '../services/mockProducts';
import ProductCard from '../components/ProductCard';
import './HomePage.scss';

const HomePage = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Seleccionamos los primeros 4 productos como destacados
    const destacados = mockProducts.slice(0, 4);
    setProductos(destacados);
  }, []);

  return (
    <div className="home-page">
      <h2>Bienvenido a Farmacia Digital</h2>
      <p>Salud a bajo precio</p>
      <h3>Productos destacados</h3>

      {productos.length === 0 ? (
        <p>No hay productos destacados.</p>
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

export default HomePage;
