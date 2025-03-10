import React, { useState } from 'react';
import axios from 'axios';

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Se actualiza el estado con el archivo seleccionado
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Función para enviar el archivo al backend
  const uploadFile = async () => {
    if (!file) {
      setMessage('Seleccione un archivo.');
      return;
    }
    console.log('Archivo a enviar:', file);
    const formData = new FormData();
    formData.append('excel', file);

    try {
      const response = await axios.post('http://localhost:5001/subir-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.mensaje);
    } catch (error) {
      console.error('Error al subir Excel:', error);
      const errorMsg = error.response && error.response.data ? error.response.data.error : error.message;
      setMessage('Error al subir Excel: ' + errorMsg);
    }
  };

  return (
    <div>
      <h2>Subir Excel</h2>
      <input type="file" onChange={handleFileChange} accept=".xlsx" />
      <button onClick={uploadFile}>Subir Archivo</button>
      <p>{message}</p>
    </div>
  );
}

export default UploadExcel;