import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Crear conexión a la base de datos usando mysql2/promise
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'a24bermirpre',  // Usuario proporcionado
    password: process.env.DB_PASSWORD || 'InstitutPedralbes_2024',  // Contraseña proporcionada
    database: process.env.DB_NAME || 'a24bermirpre_tr1-g3',  // Nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo JSON
async function readDataFromJSON() {
    const filePath = path.join(__dirname, 'data.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
        throw error;
    }
}

// PRODUCTS

// Obtener todos los productos
async function getProducts() {
    const jsonData = await readDataFromJSON();
    return jsonData.productos; // Devolver la lista de productos del JSON
}

// Obtener un producto por ID
async function getProduct(id) {
    const products = await getProducts();
    const product = products.find(p => p.ID_producto === id); // Buscar por ID
    if (!product) {
        throw new Error('Producto no encontrado');
    }
    return product;
}

// Insertar un nuevo producto
async function postProduct(productData) {
    try {
        const { nombre, descripcion, precio, stock } = productData;
        const [result] = await pool.query('INSERT INTO Producto (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', 
            [nombre, descripcion, precio, stock]);
        return { id: result.insertId, ...productData };
    } catch (error) {
        console.error('Error al insertar el producto:', error);
        throw error;
    }
}

// Obtener todos los usuarios
async function getUsers() {
    const jsonData = await readDataFromJSON();
    return jsonData.usuarios; // Devolver la lista de usuarios del JSON
}

// Actualizar un producto
async function updateProduct(id, productData) {
    try {
        const { nombre, descripcion, precio, stock } = productData;
        const [result] = await pool.query('UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE ID_producto = ?', 
            [nombre, descripcion, precio, stock, id]);
        if (result.affectedRows === 0) {
            throw new Error('Producto no encontrado');
        }
        return { id, ...productData };
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${id}:`, error);
        throw error;
    }
}

// Eliminar un producto
async function deleteProduct(id) {
    try {
        const [result] = await pool.query('DELETE FROM Producto WHERE ID_producto = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('Producto no encontrado');
        }
        return { message: 'Producto eliminado correctamente' };
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${id}:`, error);
        throw error;
    }
}

// ORDERS

// Obtener todas las órdenes
async function getOrders() {
    const jsonData = await readDataFromJSON();
    return jsonData.pedidos; // Devolver la lista de pedidos del JSON
}

// Obtener una orden por ID
async function getOrder(id) {
    const orders = await getOrders();
    const order = orders.find(o => o.num_pedido === id); // Buscar por ID
    if (!order) {
        throw new Error('Pedido no encontrado');
    }
    return order;
}

// Insertar una nueva orden
async function postOrder(orderData) {
    try {
        const { ID_usuario, fecha, total_pedido, estado } = orderData;
        const [result] = await pool.query('INSERT INTO Pedido (ID_usuario, fecha, total_pedido, estado) VALUES (?, ?, ?, ?)', 
            [ID_usuario, fecha, total_pedido, estado]);
        return { id: result.insertId, ...orderData };
    } catch (error) {
        console.error('Error al insertar el pedido:', error);
        throw error;
    }
}

// Actualizar una orden
async function updateOrder(id, orderData) {
    try {
        const { ID_usuario, fecha, total_pedido, estado } = orderData;
        const [result] = await pool.query('UPDATE Pedido SET ID_usuario = ?, fecha = ?, total_pedido = ?, estado = ? WHERE num_pedido = ?', 
            [ID_usuario, fecha, total_pedido, estado, id]);
        if (result.affectedRows === 0) {
            throw new Error('Pedido no encontrado');
        }
        return { id, ...orderData };
    } catch (error) {
        console.error(`Error al actualizar el pedido con ID ${id}:`, error);
        throw error;
    }
}

// Eliminar una orden
async function deleteOrder(id) {
    try {
        const [result] = await pool.query('DELETE FROM Pedido WHERE num_pedido = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('Pedido no encontrado');
        }
        return { message: 'Pedido eliminado correctamente' };
    } catch (error) {
        console.error(`Error al eliminar el pedido con ID ${id}:`, error);
        throw error;
    }
}

// Objeto que contiene todas las funciones para manejar productos y pedidos
const communicationManager = {
    // PRODUCTS
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,

    // ORDERS
    getOrders,
    getOrder,
    postOrder,
    updateOrder,
    deleteOrder,
    getUsers, 
};

export { communicationManager };

async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1'); // Consulta simple para probar la conexión
        console.log('Conexión a la base de datos exitosa');
        connection.release(); // Libera la conexión después de la prueba
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    }
}

