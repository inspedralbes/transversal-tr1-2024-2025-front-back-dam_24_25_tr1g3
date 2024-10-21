// index.js
require('dotenv').config(); // Cargar las variables de entorno

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Usar variables de entorno
const port = process.env.PORT || 3000; // Usa PORT del archivo .env o 3000 por defecto

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('mensaje', (msg) => {
        console.log('Mensaje recibido:', msg);
        socket.emit('respuesta', 'Mensaje recibido en el servidor');
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

app.get('/', (req, res) => {
    res.send('¡Hola, mundo con WebSockets y CORS habilitado!');
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
