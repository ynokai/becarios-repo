const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  codigo: { type: String },
  codigo_ean: { type: String },
  descripcion: { type: String },
  marca: { type: String },
  unidades_por_caja: { type: Number },
  familia: { type: String },
  precio: { type: Number }
});

// Si el modelo ya existe, lo usamos, de lo contrario, lo creamos.
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);