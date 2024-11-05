import 'dotenv/config'; // Importar dotenv para variables de entorno
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Importar CORS
import mysql from 'mysql2/promise'; // Importar MySQL
import { communicationManager } from './communicationManager.js'; // Importación de communicationManager.js
import path from 'path'; // Asegúrate de importar path

const app = express(); // Crear instancia de express
app.use(cors()); // Habilitar CORS
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const port = process.env.PORT || 3000; // Usa PORT del archivo .env o 3000 por defecto

// Configuración de la base de datos MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'a24bermirpre',  // Usuario proporcionado
    password: process.env.DB_PASSWORD || 'InstitutPedralbes_2024',  // Contraseña proporcionada
    database: process.env.DB_NAME || 'a24bermirpre_tr1-g3',  // Nombre de la base de datos
};

let connection;

(async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conectado a la base de datos MySQL');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();

// Configuración de Socket.IO
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

// Rutas para productos
app.get('/products', async (req, res) => {
    try {
        const products = await communicationManager.getProducts(); // Obtener productos desde el communicationManager
        
        // Emitir los productos a todos los clientes conectados
        io.emit('productosActualizados', products);
        console.log('Productos enviados a los clientes:', products.length); // Mensaje de depuración
        
        res.json(products); // Enviar productos como JSON
    } catch (error) {
        console.error('Error al obtener productos:', error); // Mensaje de error en consola
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await communicationManager.getProduct(Number(id)); // Convertir ID a número

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product); // Enviar producto como JSON
    } catch (error) {
        console.error(error); // Agrega esto para ver el error en la consola
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

app.post('/product', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await communicationManager.postProduct(productData);
        
        io.emit('productoCreado', newProduct); // Notifica a todos los clientes sobre el nuevo producto
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const updatedProduct = await communicationManager.updateProduct(Number(id), productData);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }

        io.emit('productoActualizado', updatedProduct); // Notifica a todos los clientes sobre el producto actualizado
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await communicationManager.deleteProduct(Number(id));

        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }

        io.emit('productoEliminado', { id }); // Notifica a todos los clientes sobre la eliminación del producto
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Rutas para pedidos
app.get('/orders', async (req, res) => {
    try {
        const orders = await communicationManager.getOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

app.post('/order', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await communicationManager.postOrder(orderData);
        
        io.emit('pedidoCreado', newOrder); // Notifica a todos los clientes sobre el nuevo pedido
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

app.put('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orderData = req.body;
        const updatedOrder = await communicationManager.updateOrder(Number(id), orderData);

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido no encontrado para actualizar' });
        }

        io.emit('pedidoActualizado', updatedOrder); // Notifica a todos los clientes sobre el pedido actualizado
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
});

app.delete('/order/:num_pedido', async (req, res) => {
    const { num_pedido } = req.params;
    try {
        const result = await communicationManager.deleteOrder(num_pedido);
        
        io.emit('pedidoEliminado', { num_pedido }); // Notifica a todos los clientes sobre la eliminación del pedido
        res.json({ message: result.message });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el pedido" });
    }
});

// Rutas para usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await communicationManager.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

app.post('/user', async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await communicationManager.postUser(userData);
        
        io.emit('usuarioCreado', newUser); // Notifica a todos los clientes sobre el nuevo usuario
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await communicationManager.updateUser(Number(id), userData);

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
        }

        io.emit('usuarioActualizado', updatedUser); // Notifica a todos los clientes sobre el usuario actualizado
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await communicationManager.deleteUser(Number(id));

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
        }

        io.emit('usuarioEliminado', { id }); // Notifica a todos los clientes sobre la eliminación del usuario
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// ROUTES FOR ORDER PRODUCTS

// Obtener productos en un pedido específico
app.get('/order/:num_pedido/products', async (req, res) => {
    const { num_pedido } = req.params;
    try {
        const products = await communicationManager.getOrderProducts(num_pedido);
        res.json(products); // Enviar productos como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos del pedido' });
    }
});

// Eliminar un producto de un pedido específico
app.delete('/order/:num_pedido/product/:id_producto', async (req, res) => {
    const { num_pedido, id_producto } = req.params;
    try {
        const result = await communicationManager.deleteOrderProduct(num_pedido, id_producto);
        res.json(result); // Enviar mensaje de éxito
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto del pedido' });
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API del proyecto!');
});

// Iniciar servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});