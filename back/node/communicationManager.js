import 'dotenv/config';
import mysql from 'mysql2/promise';

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

// PRODUCTS

// Obtener todos los productos
async function getProducts() {
    const [products] = await pool.query('SELECT * FROM Producto');
    return products; // Devolver la lista de productos de la base de datos
}

// Obtener un producto por ID
async function getProduct(id) {
    const [product] = await pool.query('SELECT * FROM Producto WHERE ID_producto = ?', [id]);
    if (product.length === 0) {
        throw new Error('Producto no encontrado');
    }
    return product[0]; // Devolver el producto encontrado
}

// Insertar un nuevo producto
async function postProduct(productData) {
    try {
        const { nombre, descripcion, precio, stock } = productData;

        // Inserción en la base de datos
        const [result] = await pool.query('INSERT INTO Producto (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', 
            [nombre, descripcion, precio, stock]);

        const newProduct = {
            ID_producto: result.insertId,
            nombre,
            descripcion,
            precio,
            stock
        };

        return newProduct;
    } catch (error) {
        console.error('Error al insertar el producto:', error);
        throw error;
    }
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
    const [orders] = await pool.query('SELECT * FROM Pedido');
    return orders; // Devolver la lista de pedidos de la base de datos
}

// Obtener una orden por ID
async function getOrder(id) {
    const [order] = await pool.query('SELECT * FROM Pedido WHERE num_pedido = ?', [id]);
    if (order.length === 0) {
        throw new Error('Pedido no encontrado');
    }
    return order[0]; // Devolver la orden encontrada
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

async function getUsers() {
    const [users] = await pool.query('SELECT * FROM Usuario'); // Asegúrate de que la tabla sea correcta
    return users; // Devolver la lista de usuarios de la base de datos
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
    getUsers, // Asegúrate de incluir esta línea

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
