const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth.routes'); 
const tareasRoutes = require('./tareas.routes'); 

const app = express();

app.use(cors());
app.use(express.json());

// Rutas conectadas
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);

app.get('/', (req, res) => {
  res.send('El servidor está funcionando y las rutas están cargadas');
});

module.exports = app;