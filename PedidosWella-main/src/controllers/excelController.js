// src/controllers/excelController.js
const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');
const Product = require(path.join(__dirname, '../models/product'));

exports.subirExcel = async (req, res) => {
  console.log('Archivo recibido:', req.file);
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];
    const products = [];
    
    // Procesa solo a partir de la fila 13
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber >= 13) {
        let [codigo, codigo_ean, descripcion, familia, marca, unidades_por_caja, precio] = row.values.slice(1);
        
        // Convierte a cadena y elimina espacios extra
        codigo = String(codigo).trim();
        codigo_ean = String(codigo_ean).trim();
        
        // Procesa la descripción (si es objeto, extrae su propiedad "result")
        if (descripcion && typeof descripcion === 'object') {
          descripcion = (descripcion.result !== undefined) ? descripcion.result : String(descripcion);
        } else {
          descripcion = String(descripcion);
        }
        
        // Procesa familia y marca
        familia = familia ? String(familia).trim() : '';
        marca = marca ? String(marca).trim() : '';
        
        // Convierte a número unidades_por_caja; si falla, asigna 0
        const valorNumericoUnidades = Number(unidades_por_caja);
        unidades_por_caja = isNaN(valorNumericoUnidades) ? 0 : valorNumericoUnidades;
        
        // Convierte a número precio; si falla, asigna 0
        const valorNumericoPrecio = Number(precio);
        precio = isNaN(valorNumericoPrecio) ? 0 : valorNumericoPrecio;
        
        console.log('Producto a insertar:', { codigo, codigo_ean, descripcion, familia, marca, unidades_por_caja, precio });
        products.push({ codigo, codigo_ean, descripcion, familia, marca, unidades_por_caja, precio });
      }
    });
    
    await Product.deleteMany({});
    await Product.insertMany(products);
    
    // Mueve el archivo original a uploads/original.xlsx
    fs.renameSync(req.file.path, 'uploads/original.xlsx');
    res.json({ mensaje: 'Excel subido y procesado' });
  } catch (error) {
    console.error('Error en subirExcel:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarExcel = async (req, res) => {
  try {
    const { productos } = req.body; // Ejemplo: [{ codigo_ean, cantidad }]
    console.log("Productos recibidos para actualizar:", productos);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('uploads/original.xlsx');
    const worksheet = workbook.worksheets[0];
    
    // Recorre cada fila a partir de la fila 13
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber >= 13) {
        // Se asume que el EAN está en la columna B (celda 2)
        const cellEAN = row.getCell(2).value;
        const codigo_ean = cellEAN ? String(cellEAN).trim() : "";
        const pedido = productos.find(p => String(p.codigo_ean).trim() === codigo_ean);
        console.log(`Fila ${rowNumber} - EAN: ${codigo_ean} | Pedido: `, pedido);
        if (pedido) {
          // Actualiza la columna J (celda 10) con la cantidad solicitada
          row.getCell(10).value = pedido.cantidad;
        }
      }
    });
    
    const updatedPath = 'uploads/pedido_actualizado.xlsx';
    await workbook.xlsx.writeFile(updatedPath);
    res.download(updatedPath, err => {
      if (err) console.error(err);
    });
  } catch (error) {
    console.error('Error en actualizarExcel:', error);
    res.status(500).json({ error: error.message });
  }
};