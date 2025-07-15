// pages/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import api from '../services/productosApi';
import './EditProductPage.scss'

const EditProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const productToEdit = location.state?.productToEdit;

  const { tenantId } = useTenant();
  const [formData, setFormData] = useState(productToEdit);

  useEffect(() => {
    if (!productToEdit) {
      alert('No se ha seleccionado un producto para editar.');
      navigate('/');
    }
  }, [productToEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creamos el objeto 'datos' con los campos del formulario
      const datos = {
        nombre: formData.nombre,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        tags: formData.tags,
        // Si actualizas el nombre, actualiza también la versión en minúsculas
        nombre_lowercase: formData.nombre.toLowerCase()
      };
      
      const requestBody = {
        tenant_id: tenantId,
        producto_id: productToEdit.producto_id, // Usamos el ID del producto original
        datos: datos,
      };

      // Usamos PUT como definiste en tu serverless.yml
      await api.put('/productos/modificar', requestBody);
      
      alert('Producto actualizado con éxito');
      navigate('/');
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert('No se pudo actualizar el producto.');
    }
  };

  if (!formData) return <p>Cargando...</p>;

  return (
    <div className="edit-product-container"> {/* Contenedor principal */}
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
            <label>Nombre:</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Descripción:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Precio:</label>
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Stock:</label>
            <input name="stock" type="number" value={formData.stock} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Categoría:</label>
            <input name="category" value={formData.category} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Tags (separados por coma):</label>
            <input name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={(e) => handleChange({ target: { name: 'tags', value: e.target.value.split(',').map(t => t.trim()) }})} />
        </div>
        <button type="submit">Guardar Cambios</button>
        </form>
    </div>
    );
    }
export default EditProductPage;