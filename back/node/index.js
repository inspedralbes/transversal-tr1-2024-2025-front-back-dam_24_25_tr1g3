import 'dotenv/config'; // Para importar dotenv en ES Modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Importar CORS
import mysql from 'mysql2/promise'; // Importar MySQL

// Importar communicationManager.js
import { communicationManager } from './communicationManager.js'; // La extensión .js es obligatoria

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000; // Usa PORT del archivo .env o 3000 por defecto

// Conectar a la base de datos MySQL
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

// ROUTES FOR PRODUCTS

app.get('/products', async (req, res) => {
    try {
        const products = await communicationManager.getProducts(); // Obtener productos desde el communicationManager
        res.json(products); // Enviar productos como JSON
    } catch (error) {
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
        res.status(201).json(newProduct); // 201: Creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body; // Debes pasar los nuevos datos
        const updatedProduct = await communicationManager.updateProduct(Number(id), productData); // Convertir ID a número
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
        
        res.json(updatedProduct); // Enviar el producto actualizado
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await communicationManager.deleteProduct(Number(id)); // Convertir ID a número
        
        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// ROUTES FOR ORDERS

app.get('/orders', async (req, res) => {
    try {
        const orders = await communicationManager.getOrders(); // Obtener pedidos desde el communicationManager
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

app.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await communicationManager.getOrder(Number(id)); // Convertir ID a número

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});

app.post('/order', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await communicationManager.postOrder(orderData);
        res.status(201).json(newOrder); // 201: Creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

app.put('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orderData = req.body; // Nuevos datos del pedido
        const updatedOrder = await communicationManager.updateOrder(Number(id), orderData); // Convertir ID a número

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido no encontrado para actualizar' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
});

app.delete('/order/:num_pedido', async (req, res) => {
    const { num_pedido } = req.params;

    try {
        // Eliminar primero los productos relacionados con el pedido
        await db.query('DELETE FROM pedido_producto WHERE num_pedido = ?', [num_pedido]);

        // Luego, eliminar el pedido
        const result = await db.query('DELETE FROM Pedido WHERE num_pedido = ?', [num_pedido]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        return res.json({ message: "Pedido eliminado correctamente junto con sus productos relacionados" });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        return res.status(500).json({ error: "Error al eliminar el pedido" });
    }
});


// ROUTES FOR USERS

app.get('/users', async (req, res) => {
    try {
        const users = await communicationManager.getUsers(); // Obtener usuarios desde el communicationManager
        res.json(users); // Enviar usuarios como JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const users = await communicationManager.getUsers();
        const user = users.find(u => u.ID_usuario === Number(id)); // Convertir ID a número

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user); // Enviar usuario como JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

app.post('/user', async (req, res) => {
    try {
        const userData = req.body;
        const users = await communicationManager.getUsers();
        const newId = users.length ? Math.max(users.map(u => u.ID_usuario)) + 1 : 1; // Generar nuevo ID
        const newUser = { ID_usuario: newId, ...userData };
        users.push(newUser); // Agregar nuevo usuario a la lista

        await communicationManager.writeDataToJSON({ usuarios: users }); // Guardar cambios en JSON
        res.status(201).json(newUser); // 201: Creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body; // Nuevos datos del usuario
        const users = await communicationManager.getUsers();
        const userIndex = users.findIndex(u => u.ID_usuario === Number(id)); // Convertir ID a número

        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
        }

        users[userIndex] = { ID_usuario: Number(id), ...userData }; // Actualizar el usuario

        await communicationManager.writeDataToJSON({ usuarios: users }); // Guardar cambios en JSON
        res.json(users[userIndex]); // Enviar el usuario actualizado
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const users = await communicationManager.getUsers();
        const userIndex = users.findIndex(u => u.ID_usuario === Number(id)); // Convertir ID a número

        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
        }

        users.splice(userIndex, 1); // Eliminar usuario

        await communicationManager.writeDataToJSON({ usuarios: users }); // Guardar cambios en JSON
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

app.get('/', (req, res) => {
    res.send('¡Hola, mundo con WebSockets y CORS habilitado!');
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
