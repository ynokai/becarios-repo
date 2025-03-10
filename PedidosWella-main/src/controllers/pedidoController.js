const Product = require('../models/product'); // Asegúrate de usar la misma ruta/nombre

let carrito = [];

exports.agregarProducto = async (req, res) => {
  try {
    const { codigo_ean, cantidad } = req.body;
    // Busca el producto en la base de datos
    const producto = await Product.findOne({ codigo_ean: codigo_ean.toString().trim() });
    if (!producto) {
      // Si no se encuentra, retorna error y no agrega al carrito
      return res.status(404).json({ error: 'Producto no encontrado en la base de datos' });
    }

    // Prepara el objeto a agregar con los datos del producto
    const newItem = {
      codigo_ean: producto.codigo_ean,
      cantidad,
      descripcion: producto.descripcion,
      familia: producto.familia || 'Sin familia',
      precio: producto.precio || 0
    };

    // Si ya existe ese producto en el carrito, suma la cantidad; de lo contrario, lo agrega
    const existingIndex = carrito.findIndex(item => item.codigo_ean === newItem.codigo_ean);
    if (existingIndex !== -1) {
      carrito[existingIndex].cantidad += cantidad;
    } else {
      carrito.push(newItem);
    }

    res.json({ carrito });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verCarrito = (req, res) => {
  res.json({ carrito });
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { codigo_ean } = req.body;
    // Filtra el carrito eliminando el producto cuyo codigo_ean coincide
    carrito = carrito.filter(item => item.codigo_ean !== codigo_ean.toString().trim());
    res.json({ carrito });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};