// pages/CreateProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import api from '../services/productosApi';
import './CreateProductPage.scss'; // Usaremos un archivo de estilos

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  
  // 1. Estado para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    producto_id: '',
    nombre: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    tags: '',
    image_url: '' // Campo añadido para la URL de la imagen
  });
  const [error, setError] = useState('');

  // 2. Un solo manejador para todos los cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  // 3. Lógica para enviar los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación simple
    for (const key in formData) {
      if (formData[key] === '' && key !== 'image_url') { // image_url es opcional
        setError(`El campo '${key}' no puede estar vacío.`);
        return;
      }
    }

    try {
      const requestBody = {
        tenant_id: tenantId,
        producto_id: formData.producto_id,
        nombre: formData.nombre,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        // Convertimos el string de tags en un array
        tags: formData.tags.split(',').map(tag => tag.trim()),
        image_url: formData.image_url || undefined, // Envía la URL si existe
      };
      
      await api.post('/productos/crear', requestBody);

      alert('¡Producto creado con éxito!');
      navigate('/'); // Redirige a la página principal

    } catch (err) {
      console.error("Error al crear el producto:", err);
      setError(err.response?.data?.message || 'Ocurrió un error al crear el producto.');
    }
  };

  return (
    <div className="create-product-container">
      <h2>Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="create-form">

        <div className="form-group">
          <label>ID del Producto</label>
          <input name="producto_id" value={formData.producto_id} onChange={handleChange} placeholder="Ej: 7" />
        </div>

        <div className="form-group">
          <label>Nombre del Producto</label>
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Paracetamol 500mg" />
        </div>

        <div className="form-group">
          <label>URL de la Imagen (Opcional)</label>
          <input name="image_url" type="url" value={formData.image_url} onChange={handleChange} placeholder="https://mi-bucket.s3.amazonaws.com/7.jpg" />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Precio</label>
          <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Analgésicos" />
        </div>

        <div className="form-group">
          <label>Tags (separados por coma)</label>
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Ej: dolor, fiebre" />
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default CreateProductPage;