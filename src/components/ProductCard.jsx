import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useCart } from '../contexts/CartContext';
import './ProductCard.scss';


const ProductCard = ({ product, onDelete }) => { 
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!product) {
    return null;
  }

  const charLimit = 100;
  const toggleDescription = (e) => {
    e.stopPropagation(); 
    setIsExpanded(!isExpanded);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.nombre} ha sido agregado al carrito.`);
  };

  const handleEdit = () => {
  navigate('/productos/editar', { state: { productToEdit: product } });
  };

  const handleDeleteClick = () => {
    console.log('✅ Clic en Eliminar. ID del producto:', product.producto_id);
    if (onDelete) {
      onDelete(product.producto_id);
    }
  };

  return (
    <div className="card">
      <div className="card-image-container">
        <img src={product.imageUrl} alt={product.nombre} />
      </div>
      
      <div className="card-content">
        <h3>{product.nombre}</h3>
        
        {/* Lógica para mostrar la descripción */}
        <p>
          {isExpanded || product.description.length <= charLimit
            ? product.description
            : `${product.description.substring(0, charLimit)}...`}
        </p>
        
        {/* Muestra el botón solo si la descripción es larga */}
        {product.description.length > charLimit && (
          <button onClick={toggleDescription} className="toggle-description-btn">
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
      

      <span className="card-price">S/ {Number(product.price).toFixed(2)}</span>
      <span className="card-stock">Stock: {product.stock}</span>

      <div className="card-actions">
        <button onClick={handleEdit} className="edit-btn">Editar</button>
        <button onClick={handleDeleteClick} className="delete-btn">Eliminar</button>
        <button 
          onClick={handleAddToCart} 
          className="add-to-cart-btn"
          disabled={product.stock === 0} // <-- Deshabilita si no hay stock
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;