import React from 'react';
import { useCart } from '../contexts/CartContext';
import comprasApi from '../services/comprasApi';
import './CartPage.scss';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.stock, 0);

  const handleFinalizarCompra = async () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    
    const productosParaEnviar = cartItems.map(item => ({
      codigo: item.producto_id,
      nombre: item.nombre,
      precio: item.price,
      cantidad: item.stock,
      imageUrl: item.image_url
    }));

    // 2. Creamos el cuerpo de la petición final
    const requestBody = {
      productos: productosParaEnviar,
    };

    try {
      // 👇 1. Aquí, dentro de la función, es donde se llama a tu endpoint
      await comprasApi.post('/compras/registrar', requestBody);
      
      alert('¡Compra registrada con éxito!');
      clearCart();

    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        console.error("Error al registrar la compra:", err);
        alert('Hubo un error al procesar tu compra. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="cart-page">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.producto_id}>
                <img src={item.image_url} alt={item.nombre} />
                <span>{item.nombre}</span>
                <input
                  type="number"
                  value={item.stock}
                  min="1"
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
                <span>S/ {item.price.toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>🗑️</button>
              </li>
            ))}
          </ul>
          <div className="resumen">
            <strong>Total: S/ {total.toFixed(2)}</strong>
            <button onClick={clearCart}>Vaciar carrito</button>
            <button onClick={handleFinalizarCompra}>Finalizar compra</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
