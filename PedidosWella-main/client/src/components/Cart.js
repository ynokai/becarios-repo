import React from 'react';

function Cart({ cart, onRemove, onUpdateQuantity }) {
  const cartItems = cart.map(item => {
    const precio = Number(item.precio) || 0;
    const totalItem = precio * item.cantidad;
    return { ...item, precio, totalItem };
  });

  const totalCost = cartItems.reduce((sum, item) => sum + item.totalItem, 0);

  return (
    <div>
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Código EAN</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Producto</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Familia</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cantidad</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Precio Unitario</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.codigo_ean}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.descripcion}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.familia || 'Sin familia'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <input 
                      type="number" 
                      value={item.cantidad} 
                      min="1"
                      onChange={(e) => onUpdateQuantity(item.codigo_ean, Number(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>€{item.precio.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>€{item.totalItem.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button onClick={() => onRemove(item.codigo_ean)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: €{totalCost.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

export default Cart;