import 'dotenv/config'; // Para importar dotenv en ES Modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Importar CORS
import mysql from 'mysql2/promise'; // Importar MySQL
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Importar communicationManager.js
import { communicationManager } from './communicationManager.js'; // La extensión .js es obligatoria

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000; // Usa PORT del archivo .env o 3000 por defecto

// Conectar a la base de datos MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'a23albrobfon',  // Usuario proporcionado
    password: process.env.DB_PASSWORD || 'Inspedralbes2324',  // Contraseña proporcionada
    database: process.env.DB_NAME || 'a23albrobfon_Tr1',  // Nombre de la base de datos
};
let connection;
const uploadDirectory = path.join(__dirname, 'product_images');

// Servir archivos estáticos desde el directorio de imágenes
app.use('/product_images', express.static(uploadDirectory));

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

app.get('/product/image/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(uploadDirectory, imageName);

    // Verificar si el archivo existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Imagen no encontrada' });
    }
});

app.post('/product', async (req, res) => {
    const form = formidable({
        multiples: false,      // Permite un solo archivo
        keepExtensions: true,  // Mantiene la extensión original
        uploadDir: uploadDirectory, // Directorio temporal
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(400).json({ error: 'Error procesando el formulario' });
        }

        const productData = fields;
        const image = files.image ? files.image[0] : null;  // Accede al primer archivo si es un array

        if (!image) {
            return res.status(400).json({ error: 'Se debe incluir una imagen para el producto.' });
        }

        try {
            const newProduct = await communicationManager.postProduct(productData);

            const imagePath = path.join(uploadDirectory, `${newProduct.ID_producto}.jpg`);

            if (!fs.existsSync(uploadDirectory)) {
                fs.mkdirSync(uploadDirectory, { recursive: true });
            }
            console.log('Ruta del archivo temporal:', image?.filepath);  // Verifica si `image.filepath` está definido

            fs.copyFileSync(image.filepath, imagePath);

            const imageUrl = `${newProduct.ID_producto}.jpg`;
            const set = "imagen";
            const where = "ID_producto";
            await communicationManager.updateDatabase(set, imageUrl, where, newProduct.ID_producto);

            res.status(201).json({
                message: 'Producto y su imagen creados correctamente',
                product: newProduct,
                imageUrl
            });
        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    });
});

app.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    
    // Utilizamos formidable para procesar el formulario con los datos del producto y la imagen
    const form = formidable({
        multiples: false,      // Permite un solo archivo
        keepExtensions: true,  // Mantiene la extensión original
        uploadDir: uploadDirectory, // Directorio temporal
    });

    // Procesar los datos del formulario y los archivos
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error al procesar el formulario:', err);
            return res.status(500).json({ error: 'Error al procesar el formulario' });
        }

        // Crear el objeto con los datos actualizados del producto
        const updatedData = {
            ID_producto: fields.ID_producto,
            nombre: fields.nombre,
            descripcion: fields.descripcion,
            precio: fields.precio,
            stock: fields.stock,
            imagen: fields.imagen, // Mantener el nombre de la imagen actual si no se proporciona una nueva
        };

        // Si se proporciona una nueva imagen, actualizamos la propiedad `imagen` en `updatedData`
        if (files.image && files.image[0] && files.image[0].filepath) {
            const imageName = `${fields.ID_producto}.jpg`;
            const imagePath = path.join(uploadDirectory, imageName);

            // Mover el archivo de la imagen al directorio de subida
            fs.renameSync(files.image[0].filepath, imagePath);

            // Actualizamos el campo `imagen` con el nuevo nombre
            updatedData.imagen = imageName;
        }

        // Ahora actualizamos el producto en la base de datos
        try {
            // Llamar a la función que actualiza el producto en la base de datos
            const updatedProduct = await communicationManager.updateProduct(Number(id), updatedData);

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
            }

            res.json(updatedProduct); // Enviar el producto actualizado como respuesta
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    });
});

app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await communicationManager.deleteProduct(Number(id)); // Convertir ID a número
        fs.rm(`product_images/${id}.jpg`, { force: true }, (err) => {
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
