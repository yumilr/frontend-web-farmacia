import React, { useState, useEffect } from 'react';
import comprasApi from '../services/comprasApi'; // Usamos el servicio de API de compras
import './PurchaseHistoryPage.scss'; // Crearemos este archivo para los estilos

const PurchaseHistoryPage = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true);
        // Hacemos una petición GET al endpoint de listar.
        // No necesita body porque el backend obtiene el usuario del token.
        const response = await comprasApi.get('/compras/listar');
        setCompras(response.data);
      } catch (err) {
        console.error("Error al obtener el historial de compras:", err);
        setError("No se pudo cargar el historial. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  if (loading) return <p className="message">Cargando tu historial de compras...</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="purchase-history-page">
      <h2>Mi Historial de Compras</h2>
      {compras.length === 0 ? (
        <p>Aún no has realizado ninguna compra.</p>
      ) : (
        <div className="purchase-list">
          {compras.map((compra) => (
            <div key={compra.compra_id} className="purchase-card">
              <div className="purchase-header">
                <div>
                  <strong>Compra ID:</strong> <span>{compra.compra_id}</span>
                </div>
                <div>
                  <strong>Fecha:</strong> 
                  <span>
                    {/* Formateamos la fecha para que sea más legible */}
                    {new Date(compra.fecha).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}
                  </span>
                </div>
                <div>
                  <strong>Total:</strong> <span>S/ {compra.total.toFixed(2)}</span>
                </div>
              </div>
              <ul className="product-list">
                {compra.productos.map((producto, index) => (
                  <li key={`${compra.compra_id}-${index}`}>
                    {producto.imageUrl && <img src={producto.imageUrl} alt={producto.nombre} className="product-thumbnail" />}
                    <span>{producto.nombre}</span>
                    <span>Cantidad: {producto.cantidad}</span>
                    <span>Precio U.: S/ {producto.precio.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;