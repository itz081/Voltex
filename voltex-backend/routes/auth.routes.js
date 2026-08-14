// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. ENDPOINT DE REGISTRO (Cifra la contraseña antes de guardarla)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        // Cifrar la contraseña (genera un hash de 10 rondas)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar en MariaDB con el rol por defecto 'client'
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ 
            message: "Usuario registrado con éxito", 
            userId: result.insertId 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
});

// 2. ENDPOINT DE LOGIN (Verifica la contraseña cifrada y retorna un Token JWT)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña requeridos" });
    }

    try {
        // Buscar al usuario por correo
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas (Usuario no encontrado)" });
        }

        const user = rows[0];

        // Comparar la contraseña ingresada con el hash guardado en la BD
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales incorrectas (Contraseña inválida)" });
        }

        // Crear el payload del token (la información que viajará encriptada en el token)
        const payload = {
            id: user.id,
            name: user.name,
            role: user.role // Aquí va 'client' o 'admin'
        };

        // Firmar el Token JWT para que expire en 24 horas
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Responder al frontend con el Token y los datos básicos del usuario
        res.json({
            message: "Login exitoso",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;