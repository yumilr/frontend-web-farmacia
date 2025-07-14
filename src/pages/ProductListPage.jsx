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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia la carga
      setError(null);

      try {
        // Objeto para pasar los parámetros de búsqueda a la API
        const requestBody = {
          tenant_id: tenantId, // Usa el tenantId del contexto
          search: searchQuery || undefined, // Envía los filtros si existen
          categoria: categoriaSeleccionada || undefined,
        };

        // 👇 La llamada a tu backend. Axios se encarga de añadir los params a la URL
        const res = await api.post('/productos/listar', requestBody);
        const bucketUrl = process.env.REACT_APP_S3_BUCKET_URL;
        const productosConImagen = (res.data.items || []).map(producto => ({
          ...producto,
          // Construimos la URL completa de la imagen en S3
          // Asumimos que todas las imágenes son .jpg, ajústalo si es necesario
          imageUrl: `${bucketUrl}/${producto.producto_id}.png`,
        }));

        setProductos(productosConImagen);

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
            <ProductCard key={prod.producto_id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
