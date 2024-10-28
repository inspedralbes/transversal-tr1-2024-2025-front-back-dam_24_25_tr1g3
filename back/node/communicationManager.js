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
        const { nombre, descripcion, precio, stock, imagen } = productData; 
        const [result] = await pool.query(
            'UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ? WHERE ID_producto = ?',
            [nombre, descripcion, precio, stock, imagen, id] 
        );
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

// USERS

// Obtener todos los usuarios
async function getUsers() {
    const [users] = await pool.query('SELECT * FROM Usuario'); // Asegúrate de que la tabla sea correcta
    return users; // Devolver la lista de usuarios de la base de datos
}

// Obtener un usuario por ID
async function getUser(id) {
    const [user] = await pool.query('SELECT * FROM Usuario WHERE ID_usuario = ?', [id]);
    if (user.length === 0) {
        throw new Error('Usuario no encontrado');
    }
    return user[0]; // Devolver el usuario encontrado
}

// Insertar un nuevo usuario
async function postUser(userData) {
    try {
        const { nombre, correo, telefono, contraseña } = userData; // Usar 'correo' en lugar de 'email'

        // Validaciones simples
        if (!nombre || !correo || !contraseña) {
            throw new Error('Faltan datos requeridos');
        }

        const [result] = await pool.query(
            'INSERT INTO Usuario (nombre, correo, telefono, contraseña) VALUES (?, ?, ?, ?)', 
            [nombre, correo, telefono, contraseña]  // Asegúrate de que estas sean las columnas correctas
        );

        const newUser = {
            ID_usuario: result.insertId,
            nombre,
            correo,
            telefono,
            contraseña
        };

        return newUser;
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        throw error;
    }
}

// Actualizar un usuario
async function updateUser(id, userData) {
    try {
        const { nombre, correo, telefono, contraseña } = userData;

        // Validar que los campos requeridos están presentes
        if (!nombre || !correo || !contraseña) {
            throw new Error('Faltan datos requeridos para actualizar');
        }

        const [result] = await pool.query(
            'UPDATE Usuario SET nombre = ?, correo = ?, telefono = ?, contraseña = ? WHERE ID_usuario = ?',
            [nombre, correo, telefono, contraseña, id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado');
        }

        return { id, nombre, correo, telefono, contraseña }; // Retorna solo los campos requeridos
    } catch (error) {
        console.error(`Error al actualizar el usuario con ID ${id}:`, error);
        throw error;
    }
}

// Eliminar un usuario
async function deleteUser(id) {
    try {
        const [result] = await pool.query('DELETE FROM Usuario WHERE ID_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado');
        }
        return { message: 'Usuario eliminado correctamente' }; // Mensaje claro
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${id}:`, error);
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
    const connection = await pool.getConnection(); // Obtener una conexión del pool
    try {
        await connection.beginTransaction(); // Iniciar la transacción

        const { ID_usuario, fecha, total_pedido, estado, productos } = orderData; // Obtener datos del pedido
        const [result] = await connection.query(
            'INSERT INTO Pedido (ID_usuario, fecha, total_pedido, estado) VALUES (?, ?, ?, ?)', 
            [ID_usuario, fecha, total_pedido, estado]
        );

        const num_pedido = result.insertId; // Obtener el ID del nuevo pedido

        // Insertar los productos en Pedido_Producto
        for (const producto of productos) {
            const { ID_producto, cantidad, precio_unitario } = producto; // Desestructurar los datos del producto
            await connection.query(
                'INSERT INTO Pedido_Producto (num_pedido, ID_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', 
                [num_pedido, ID_producto, cantidad, precio_unitario]
            );
        }

        await connection.commit(); // Confirmar la transacción
        return { num_pedido, ID_usuario, fecha, total_pedido, estado, productos }; // Retornar datos del pedido creado
    } catch (error) {
        await connection.rollback(); // Revertir la transacción en caso de error
        console.error('Error al insertar el pedido:', error);
        throw error;
    } finally {
        connection.release(); // Liberar la conexión
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



// Obtener productos en un pedido específico
async function getOrderProducts(num_pedido) {
    const [productos] = await pool.query(`
        SELECT pp.ID_producto, p.nombre, pp.cantidad, pp.precio_unitario
        FROM Pedido_Producto pp
        JOIN Producto p ON pp.ID_producto = p.ID_producto
        WHERE pp.num_pedido = ?
    `, [num_pedido]);

    if (productos.length === 0) {
        throw new Error('No se encontraron productos para el pedido especificado');
    }

    return productos; // Devolver la lista de productos del pedido
}

// Eliminar productos de un pedido específico
async function deleteOrderProduct(num_pedido, ID_producto) {
    try {
        const [result] = await pool.query('DELETE FROM Pedido_Producto WHERE num_pedido = ? AND ID_producto = ?', [num_pedido, ID_producto]);
        if (result.affectedRows === 0) {
            throw new Error('Producto no encontrado en el pedido');
        }
        return { message: 'Producto eliminado correctamente del pedido' };
    } catch (error) {
        console.error(`Error al eliminar el producto del pedido con num_pedido ${num_pedido}:`, error);
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
    getOrderProducts,
    deleteOrderProduct, // Agregar la función de eliminación
    // ORDERS
    getOrders,
    getOrder,
    postOrder,
    updateOrder,
    deleteOrder,
    // USERS
    getUsers,
    getUser,
    postUser,
    updateUser,
    deleteUser,
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
