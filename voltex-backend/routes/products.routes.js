// routes/products.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los cargadores
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo cargador / Promoción (Y notificar multipantalla)
router.post('/', async (req, res) => {
    const { name, description, price, stock, is_promotion } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
            [name, description, price, stock]
        );

        const newProduct = { id: result.insertId, name, description, price, stock, is_promotion: is_promotion || false };
        const io = req.app.get('socketio');
        
        if (newProduct.is_promotion) {
            // Envío al Wearable
            io.emit('new_promotion_alert', { title: "🔥 ¡Nueva Promoción!", body: `${name} a solo $${price}` });
            // Envío a la Smart TV
            io.to('tv_screens').emit('tv_show_promotion', { headline: "¡OFERTA FLASH DE SUPERCARGADORES!", productName: name, productPrice: price, productDescription: description });
        } else {
            // Alerta general
            io.emit('new_product_alert', { title: "⚡ Nuevo Cargador Disponible", body: `${name} añadido al catálogo.` });
        }

        res.status(201).json({ message: "Producto guardado y notificado", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;