import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import UploadExcel from './components/UploadExcel';
import SearchProduct from './components/SearchProduct';
import Cart from './components/Cart';
import UpdateExcel from './components/UpdateExcel';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  const [cart, setCart] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [scannedCode, setScannedCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Se llama cuando BarcodeScanner detecta un código
  const handleDetected = (code) => {
    setScannedCode(code);
    setShowScanner(false);
  };

  // Envía al backend el producto escaneado con la cantidad ingresada
  const handleAddScannedProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/pedido/agregar', {
        codigo_ean: scannedCode,
        cantidad: quantity
      });
      if (response && response.data && response.data.carrito) {
        setCart(response.data.carrito);
      } else {
        setCart(prev => [...prev, { codigo_ean: scannedCode, cantidad: quantity }])
      }
      setSearchCode(scannedCode);
    } catch (error) {
      console.error("Error al agregar producto escaneado:", error);
      setErrorMsg("Producto no encontrado en la base de datos.");
    } finally {
      setScannedCode('');
      setQuantity(1);
    }
  };

  // Función para eliminar un ítem del carrito usando el backend
  const handleRemoveFromCart = async (codigo_ean) => {
    try {
      const response = await axios.post('http://localhost:5001/pedido/eliminar', { codigo_ean });
      if (response && response.data && response.data.carrito) {
        setCart(response.data.carrito);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const handleUpdateQuantity = (codigo_ean, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.codigo_ean === codigo_ean ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Sistema de Pedidos para Peluquerías</h1>
        <button className="scan-button" onClick={() => { setErrorMsg(''); setShowScanner(true); }}>
          Escanear código de barras
        </button>
      </div>
      
      {showScanner && (
        <div className="scanner-container">
          <BarcodeScanner onDetected={handleDetected} />
        </div>
      )}
      
      {scannedCode && (
        <div className="scanned-result">
          <p>Código detectado: {scannedCode}</p>
          <form onSubmit={handleAddScannedProduct}>
            <label>
              Cantidad:
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                required
              />
            </label>
            <button type="submit">Agregar producto</button>
          </form>
        </div>
      )}
      
      <div className="spacer"></div>
      
      <div className="component">
        <SearchProduct 
          setCart={setCart} 
          searchCode={searchCode} 
          setSearchCode={setSearchCode} 
        />
      </div>
      
      <div className="component">
        <UploadExcel />
      </div>
      
      <div className="component">
        <Cart 
          cart={cart} 
          onRemove={handleRemoveFromCart} 
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
      
      <div className="component">
        <UpdateExcel cart={cart} />
      </div>
      
      {errorMsg && <p className="error">{errorMsg}</p>}
    </div>
  );
}

export default App;


