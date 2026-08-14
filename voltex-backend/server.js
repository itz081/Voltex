// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Dominio permitido de tu frontend en Angular
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://voltex-motorsport.test:4200';

// Configuración de WebSockets con CORS específico
const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL, 'http://localhost:4200'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Configuración de CORS para HTTP (Express)
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:4200'],
  credentials: true
}));

app.use(express.json());
app.set('socketio', io);

// Conexión del WebSocket
io.on('connection', (socket) => {
  console.log(`⚡ Dispositivo conectado por socket: ${socket.id}`);
  
  socket.on('join_tv_room', () => {
    socket.join('tv_screens');
    console.log(`📺 Smart TV unida a la sala de pantallas: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Dispositivo desconectado: ${socket.id}`);
  });
});

// Integrar las rutas de la API
const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 3000;

// Escuchar en '0.0.0.0' para aceptar peticiones desde el dominio personalizado
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor backend corriendo en http://voltex-motorsport.test:${PORT}`);
});