import 'dotenv/config';
import mysql from 'mysql2/promise';
import { communicationManager } from './communicationManager.js'; // Asegúrate de que la ruta sea correcta

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

// Función para probar la conexión a la base de datos
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release(); // Liberar la conexión después de la prueba
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    }
}

// Función para probar obtener todos los productos
async function testGetProducts() {
    try {
        const products = await communicationManager.getProducts();
        console.log('Productos obtenidos:', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
    }
}

// Función para probar obtener todos los usuarios
async function testGetUsers() {
    try {
        const users = await communicationManager.getUsers();
        console.log('Usuarios obtenidos:', users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error.message);
    }
}

// Función para probar obtener todas las órdenes
async function testGetOrders() {
    try {
        const orders = await communicationManager.getOrders();
        console.log('Órdenes obtenidas:', orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error.message);
    }
}

// Ejecutar todas las pruebas
async function runTests() {
    await testConnection(); // Primero prueba la conexión
    await testGetProducts(); // Prueba obtener todos los productos
    await testGetUsers(); // Prueba obtener todos los usuarios
    await testGetOrders(); // Prueba obtener todas las órdenes
   // await testInsertProduct();
}

// async function testInsertProduct() {
//     const newProduct = {
//         nombre: "Zapatos de Cuero",
//         descripcion: "Zapatos de cuero genuino, elegantes y cómodos.",
//         precio: 75.00,
//         stock: 20
//     };

//     try {
//         const result = await communicationManager.postProduct(newProduct);
//         console.log('Producto insertado:', result);
//     } catch (error) {
//         console.error('Error al insertar el producto:', error.message);
//     }
// }

// Ejecutar las pruebas
runTests();

