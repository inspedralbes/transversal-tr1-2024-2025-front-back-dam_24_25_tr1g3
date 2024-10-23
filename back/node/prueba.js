import 'dotenv/config';
import mysql from 'mysql2/promise';

// Crear conexión a la base de datos usando mysql2/promise
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'a24bermirpre',  // Usuario que has proporcionado
    password: process.env.DB_PASSWORD || 'InstitutPedralbes_2024',  // Contraseña que has proporcionado
    database: process.env.DB_NAME || 'a24bermirpre_tr1-g3',  // Nombre de tu base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release(); // Liberar la conexión después de la prueba
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
  }
}

testConnection();
