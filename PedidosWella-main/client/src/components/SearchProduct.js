import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchProduct({ setCart, searchCode, setSearchCode }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  // Cada vez que searchCode cambie, busca el producto
  useEffect(() => {
    if (searchCode) {
      searchProduct(searchCode);
    }
  }, [searchCode]);

  const searchProduct = async (code) => {
    try {
      const response = await axios.get(`http://localhost:5001/producto/${code.trim()}`);
      setProduct(response.data);
      setMessage('');
    } catch (error) {
      setProduct(null);
      setMessage('Producto no encontrado');
    }
  };

  const addProduct = async () => {
    try {
      const response = await axios.post('http://localhost:5001/pedido/agregar', {
        codigo_ean: searchCode,
        cantidad: Number(quantity)
      });
      if (response && response.data && response.data.carrito) {
        setCart(response.data.carrito);
      } else {
        // Fallback: si la respuesta no es la esperada, se agrega localmente
        setCart(prev => [...prev, { codigo_ean: searchCode, cantidad: Number(quantity) }]);
      }
      setMessage('Producto agregado');
      // Reinicia los estados para permitir nueva búsqueda
      setSearchCode('');
      setProduct(null);
      setQuantity(1);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setMessage('Error al agregar producto');
    }
  };

  return (
    <div>
      <h2>Buscar Producto</h2>
      <input 
        type="text"
        value={searchCode}
        onChange={(e) => setSearchCode(e.target.value)}
        placeholder="Ingrese Código EAN"
      />
      <button onClick={() => searchProduct(searchCode)}>Buscar</button>
      {product && (
        <div>
          <p>{product.descripcion} - {product.marca}</p>
          <label>
            Cantidad:
            <input 
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              style={{ marginLeft: '5px' }}
            />
          </label>
          <button onClick={addProduct} style={{ marginLeft: '10px' }}>Agregar al Carrito</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
}

export default SearchProduct;