import 'dotenv/config'; // Para importar dotenv en ES Modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Importar CORS
import mysql from 'mysql2/promise'; // Importar MySQL
import multer from "multer"; // Para guardar imagenes
import path from "path"; // Para crear rutas donde guardar las imagenes
import * as fs from 'fs'; // Para poder leer el sistema de ficheros
import bodyParser from "body-parser"

// Importar communicationManager.js
import { communicationManager } from './communicationManager.js'; // La extensión .js es obligatoria

const app = express();
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
});
const port = process.env.PORT // Usa PORT del archivo .env o 3000 por defecto

app.use("/assets", express.static("public"));

// Conectar a la base de datos MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'a24bermirpre',  // Usuario proporcionado
    password: process.env.DB_PASSWORD || 'InstitutPedralbes_2024',  // Contraseña proporcionada
    database: process.env.DB_NAME || 'a24bermirpre_tr1-g3',  // Nombre de la base de datos
    port: process.env.DB_PORT || 3306,
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

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

// 

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

//crear producto
app.post('/product', upload.single("imagen"), async (req, res) => {
    try {
        const productData = req.body;
        const fotoRuta = req.file.path;
        const newProduct = await communicationManager.postProduct(productData, fotoRuta);
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


//eliminar producto
app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await communicationManager.deleteProduct(Number(id)); // Convertir ID a número
        fs.rm(`public/${id}.jpg`, { force: true }, (err) => {
            if (err) {
              console.error('Error al eliminar el archivo:', err);
            } else {
              console.log('Archivo eliminado correctamente');
            }
          });
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

        io.emit('orderUpdated', updatedOrder)

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
});

app.delete('/order/:num_pedido', async (req, res) => {
    const { num_pedido } = req.params;

    try {
        const result = await communicationManager.deleteOrder(num_pedido); // Cambiar a comunicación a la base de datos
        res.json({ message: result.message });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        return res.status(500).json({ error: "Error al eliminar el pedido" });
    }
});

// ROUTES FOR USERS

// GET DE USUARIOS
app.get('/users', async (req, res) => {
    try {
        const users = await communicationManager.getUsers(); // Obtener usuarios desde el communicationManager
        res.json(users); // Enviar usuarios como JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// OBTENER USER POR ID
app.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await communicationManager.getUser(Number(id)); // Convertir ID a número

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user); // Enviar usuario como JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});


// CREAR USER 
app.post('/user', async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await communicationManager.postUser(userData);
        res.status(201).json(newUser); // 201: Creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

// UPDATE USER POR ID 
app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body; // Nuevos datos del usuario
        const updatedUser = await communicationManager.updateUser(Number(id), userData); // Convertir ID a número

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
        }

        res.json(updatedUser); // Enviar el usuario actualizado
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});


// ELIMINAR USER 
app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await communicationManager.deleteUser(Number(id)); // Convertir ID a número

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
        }

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

// ROUTE FOR LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Consulta a la base de datos para encontrar el usuario
        const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        // Verificar si el usuario existe
        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = users[0];

        // Aquí deberías verificar la contraseña. Este es un ejemplo simple.
        // Asegúrate de usar un método de hash seguro (como bcrypt) en un entorno de producción.
        if (user.password !== password) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Si las credenciales son correctas, puedes devolver una respuesta de éxito
        res.json({ message: 'Inicio de sesión exitoso', user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API del proyecto!');
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
