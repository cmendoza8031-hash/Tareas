const express = require('express');
const router = express.Router();
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error al registrar: " + err.message });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(password, result.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET || 'firma_secreta', { expiresIn: '1h' });
        res.json({ token, user: { id: result.rows[0].id, email: result.rows[0].email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;