import React from 'react';
import './ProductCard.scss';



// ProductCard.jsx - VERSIÓN CORREGIDA
const ProductCard = ({ product }) => {
  // Verificación para evitar errores si el producto no carga bien
  if (!product) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-image-container">
        <img src={product.imageUrl} alt={product.nombre} />
      </div>
      
      {/* 👇 Agrupamos el nombre y la descripción */}
      <div className="card-content">
        <h3>{product.nombre}</h3>
        <p>{product.description}</p>
      </div>

      {/* El precio queda fuera para poder empujarlo hacia abajo */}
      <span className="card-price">S/ {Number(product.price).toFixed(2)}</span>
    </div>
  );
};

export default ProductCard;
