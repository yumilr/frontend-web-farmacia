import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import api from '../services/productosApi';
import ProductCard from '../components/ProductCard';
import './HomePage.scss';

const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { loading: authLoading } = useAuth();
  const { tenantId } = useTenant();

  // Se añade la lógica de borrado para que los botones funcionen
  const handleDelete = async (productoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    try {
      await api.post('/productos/eliminar', {
        tenant_id: tenantId,
        producto_id: productoId
      });
      setProductos(prev => prev.filter(p => p.producto_id !== productoId));
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId) return;

      setLoading(true);
      setError(null);

      try {
        // Hacemos una llamada general para obtener los productos
        const res = await api.post('/productos/listar', { tenant_id: tenantId });
        
        const productosProcesados = (res.data.items || []).map(producto => ({
          ...producto,
          imageUrl: producto.image_url,
        }));

        // Seleccionamos solo los primeros 4 como destacados
        const destacados = productosProcesados.slice(0, 4);
        setProductos(destacados);

      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError('No se pudieron cargar los productos destacados.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, tenantId]); // Se ejecuta cuando la autenticación está lista

  if (loading || authLoading) {
    return <p className="message">Cargando...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

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
            <ProductCard
              key={prod.producto_id}
              product={prod}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;