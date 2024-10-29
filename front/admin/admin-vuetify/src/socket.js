// src/socket.js
import { io } from 'socket.io-client';

// Cambia la URL por la de tu servidor de Socket.IO
const socket = io('http://localhost:3000');

export default socket;
