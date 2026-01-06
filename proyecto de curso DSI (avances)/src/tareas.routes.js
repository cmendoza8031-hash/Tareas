const express = require('express');
const router = express.Router();
const pool = require('./db');

// Obtener todas (Read)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una (Create)
router.post('/', async (req, res) => {
    const { titulo, descripcion } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *',
            [titulo, descripcion]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar (Update)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    try {
        await pool.query(
            'UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3',
            [titulo, descripcion, id]
        );
        res.json({ message: "Tarea actualizada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar (Delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
        res.json({ message: "Tarea eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;