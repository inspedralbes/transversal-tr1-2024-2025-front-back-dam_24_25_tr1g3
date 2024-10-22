import 'dotenv/config'; // Para importar dotenv en ES Modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Importar communicationManager.js
import { communicationManager } from './communicationManager.js'; // La extensión .js es obligatoria

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

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


// ROUTES FOR PRODUCTS

app.get('/products', async (req, res) => {
    try {
        // Obtener todos los productos
        const products = await communicationManager.getProducts();
        res.json(products); // Enviar productos como JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});
app.get('/product/:id', async (req, res) => {
    try {
        // Obtener un producto por ID
        const { id } = req.params;
        const product = await communicationManager.getProduct(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(product); // Enviar producto como JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});
app.post('/product', async (req, res) => {
    try {
        // Crear un nuevo producto
        const productData = req.body;
        const newProduct = await communicationManager.postProduct(productData);
        res.status(201).json(newProduct); // 201: Creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});
app.put('/product/:id', async (req, res) => {
    try {
        // Actualizar un producto por ID
        const { id } = req.params;
        const productData = req.body; // Debes pasar los nuevos datos
        const updatedProduct = await communicationManager.updateProduct(id, productData);
        
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
        // Eliminar un producto por ID
        const { id } = req.params;
        const result = await communicationManager.deleteProduct(id);
        
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
        // Obtener todos los pedidos
        const orders = await communicationManager.getOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});
app.get('/order/:id', async (req, res) => {
    try {
        // Obtener un pedido por ID
        const { id } = req.params;
        const order = await communicationManager.getOrder(id);

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
        // Crear un nuevo pedido
        const orderData = req.body;
        const newOrder = await communicationManager.postOrder(orderData);
        res.status(201).json(newOrder); // 201: Creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});
app.put('/order/:id', async (req, res) => {
    try {
        // Actualizar un pedido por ID
        const { id } = req.params;
        const orderData = req.body; // Nuevos datos del pedido
        const updatedOrder = await communicationManager.updateOrder(id, orderData);

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido no encontrado para actualizar' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
});
app.delete('/order/:id', async (req, res) => {
    try {
        // Eliminar un pedido por ID
        const { id } = req.params;
        const result = await communicationManager.deleteOrder(id);

        if (!result) {
            return res.status(404).json({ error: 'Pedido no encontrado para eliminar' });
        }

        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
});

app.get('/', (req, res) => {
    res.send('¡Hola, mundo con WebSockets y CORS habilitado!');
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
