// src/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prueba1',
  password: '12345',
  port: 5432,
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos "pruebita"');
  }
});

module.exports = pool;