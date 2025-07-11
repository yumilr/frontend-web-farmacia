import React from 'react';
import { useCart } from '../contexts/CartContext';
import './ProductCard.scss';



const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} />
      <h4>{product.nombre}</h4>
      <p>S/ {product.precio.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Añadir al carrito</button>
    </div>
  );
};

export default ProductCard;
