import React from 'react';
import { useCart } from '../contexts/CartContext';
import './CartPage.scss';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="cart-page">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <img src={item.imagen} alt={item.nombre} />
                <span>{item.nombre}</span>
                <input
                  type="number"
                  value={item.cantidad}
                  min="1"
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
                <span>S/ {item.precio.toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>🗑️</button>
              </li>
            ))}
          </ul>
          <div className="resumen">
            <strong>Total: S/ {total.toFixed(2)}</strong>
            <button onClick={clearCart}>Vaciar carrito</button>
            <button onClick={() => alert('Compra registrada')}>Finalizar compra</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
