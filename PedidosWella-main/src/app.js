const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Se importa cors
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Configurar CORS para permitir solicitudes desde el frontend (desarrollo)
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/peluqueria', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error(err));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uso de rutas API
app.use('/', routes);

// Si integras el frontend (producción), sirve los archivos estáticos de la build de React
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});