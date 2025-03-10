const express = require('express');
const multer = require('multer');
const path = require('path');
const excelController = require(path.join(__dirname, '../controllers/excelController'));
const pedidoController = require(path.join(__dirname, '../controllers/pedidoController'));

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Endpoint para subir Excel
router.post('/subir-excel', upload.single('excel'), excelController.subirExcel);

// Endpoint para buscar producto por código EAN
router.get('/producto/:codigo_ean', async (req, res) => {
  const ean = req.params.codigo_ean.trim();
  console.log('EAN recibido en búsqueda:', ean);
  try {
    const Product = require(path.join(__dirname, '../models/Product'));
    const producto = await Product.findOne({ codigo_ean: ean });
    if (!producto) {
      console.log('Producto no encontrado para EAN:', ean);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log('Producto encontrado:', producto);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para agregar producto al pedido
router.post('/pedido/agregar', pedidoController.agregarProducto);

// Endpoint para ver el carrito
router.get('/pedido/ver', pedidoController.verCarrito);

// Endpoint para eliminar producto del carrito
router.post('/pedido/eliminar', pedidoController.eliminarProducto);

// Endpoint para actualizar Excel con pedido
router.post('/pedido/actualizar-excel', excelController.actualizarExcel);

module.exports = router;