import 'dotenv/config';
import mysql from 'mysql2/promise';


// Crear conexión a la base de datos usando mysql2/promise
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'a24bermipre_TR1-G3',  // Nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// PRODUCTS

// Obtener todos los productos
async function getProducts() {
    try {
        const [rows] = await pool.query('SELECT * FROM Producto');
        return rows;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
}

// Obtener un producto por ID
async function getProduct(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM Producto WHERE ID_producto = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Producto no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error);
        throw error;
    }
}

// Insertar un nuevo producto
async function postProduct(productData) {
    try {
        const { nombre, descripcion, precio, stock } = productData;
        const [result] = await pool.query('INSERT INTO Producto (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, stock]);
        return { id: result.insertId, ...productData };
    } catch (error) {
        console.error('Error al insertar el producto:', error);
        throw error;
    }
}

// Actualizar un producto
async function updateProduct(id, productData) {
    try {
        const { nombre, descripcion, precio, stock } = productData;
        const [result] = await pool.query('UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE ID_producto = ?', [nombre, descripcion, precio, stock, id]);
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
    try {
        const [rows] = await pool.query('SELECT * FROM Pedido');
        return rows;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw error;
    }
}

// Obtener una orden por ID
async function getOrder(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM Pedido WHERE num_pedido = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Pedido no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error(`Error al obtener el pedido con ID ${id}:`, error);
        throw error;
    }
}

// Insertar una nueva orden
async function postOrder(orderData) {
    try {
        const { ID_usuario, fecha, total_pedido, estado } = orderData;
        const [result] = await pool.query('INSERT INTO Pedido (ID_usuario, fecha, total_pedido, estado) VALUES (?, ?, ?, ?)', [ID_usuario, fecha, total_pedido, estado]);
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
        const [result] = await pool.query('UPDATE Pedido SET ID_usuario = ?, fecha = ?, total_pedido = ?, estado = ? WHERE num_pedido = ?', [ID_usuario, fecha, total_pedido, estado, id]);
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
};

export { communicationManager };

