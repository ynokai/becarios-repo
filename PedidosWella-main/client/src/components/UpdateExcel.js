import React from 'react';
import axios from 'axios';

function UpdateExcel({ cart }) {
  const handleUpdateExcel = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5001/pedido/actualizar-excel',
        { productos: cart },
        { responseType: 'blob' }
      );
      // Crea un enlace para descargar el archivo generado
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pedido_actualizado.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al actualizar Excel:', error);
      alert('Error al actualizar excel');
    }
  };

  return (
    <div>
      <button onClick={handleUpdateExcel}>Actualizar y Descargar Excel</button>
    </div>
  );
}

export default UpdateExcel;