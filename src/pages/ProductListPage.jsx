import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//import mockProducts from '../services/mockProducts';
import { useAuth } from '../contexts/AuthContext'; 
import { useTenant } from '../contexts/TenantContext';
import api from '../services/productosApi';
import ProductCard from '../components/ProductCard';
import './ProductListPage.scss';


const ProductListPage = () => {
  const { loading: authLoading } = useAuth(); 
  const { tenantId } = useTenant();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriaSeleccionada = queryParams.get('categoria');
  const searchQuery = queryParams.get('search');

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 3. Añade estado de carga
  const [error, setError] = useState(null);     // 👈 4. Añade estado de error

  const handleDelete = async (productoId) => {
    // Pide confirmación al usuario
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    try {
      const requestBody = {
        tenant_id: tenantId,
        producto_id: productoId
      };
      console.log("Enviando para eliminar:", requestBody);
      await api.delete('/productos/eliminar', { 
        data: requestBody 
      });
      setProductos(prev => prev.filter(p => p.producto_id !== productoId));
  } catch (err) {
      console.error("Error al eliminar el producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia la carga
      setError(null);

      try {
        const requestBody = {
          tenant_id: tenantId,
          search: searchQuery || undefined,
          categoria: categoriaSeleccionada || undefined,
        };

        const res = await api.post('/productos/listar', requestBody);
        let productosDesdeApi = (res.data.items || []).map(producto => ({
          ...producto,
          imageUrl: producto.image_url,
        }));

        if (categoriaSeleccionada) {
          productosDesdeApi = productosDesdeApi.filter(
            producto => producto.category === categoriaSeleccionada
          );
        }
        setProductos(productosDesdeApi);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false); // Termina la carga (tanto si hay éxito como si hay error)
      }
    };
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, tenantId, categoriaSeleccionada, searchQuery]); // Se ejecuta cada vez que cambia la categoría o la búsqueda

  // 👇 5. Muestra un mensaje mientras el AuthContext se inicializa
  if (authLoading) {
    return <p className="message">Inicializando autenticación...</p>;
  }

  if (loading) {
    return <p className="message">Cargando productos...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

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

export default ProductListPage;
