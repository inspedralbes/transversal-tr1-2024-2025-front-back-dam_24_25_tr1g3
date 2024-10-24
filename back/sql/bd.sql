-- Crear la base de datos
CREATE DATABASE `a24bermipre_TR1-G3`;

-- Usar la base de datos
USE `a24bermipre_TR1-G3`;

-- Crear la tabla Usuario
CREATE TABLE Usuario (
    ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    contraseña VARCHAR (255)
);

-- Crear la tabla Producto
CREATE TABLE Producto (
    ID_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

-- Crear la tabla Pedido
CREATE TABLE Pedido (
    num_pedido INT AUTO_INCREMENT PRIMARY KEY,
    ID_usuario INT,
    fecha DATETIME NOT NULL,
    total_pedido DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (ID_usuario) REFERENCES Usuario(ID_usuario)
);

-- Crear la tabla intermedia Pedido_Producto
CREATE TABLE Pedido_Producto (
    num_pedido INT,
    ID_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (num_pedido, ID_producto),
    FOREIGN KEY (num_pedido) REFERENCES Pedido(num_pedido) ON DELETE CASCADE,
    FOREIGN KEY (ID_producto) REFERENCES Producto(ID_producto)
);

-- pruebas: 

-- 1. Borrar las tablas si existen
DROP TABLE IF EXISTS Pedido_Producto;
DROP TABLE IF EXISTS Pedido;

-- 2. Crear la tabla Pedido
CREATE TABLE Pedido (
    num_pedido INT AUTO_INCREMENT PRIMARY KEY,
    ID_usuario INT,
    fecha DATETIME NOT NULL,
    total_pedido DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

-- 3. Insertar datos en la tabla Pedido
INSERT INTO Pedido (num_pedido, ID_usuario, fecha, total_pedido, estado) VALUES
(1, 1, '2024-10-22 10:00:00', 125.98, 'pendiente'),
(2, 2, '2024-10-22 11:30:00', 85.50, 'completado'),
(3, 3, '2024-10-22 12:15:00', 55.00, 'pendiente');

-- 4. Crear la tabla Pedido_Producto
CREATE TABLE Pedido_Producto (
    num_pedido INT,
    ID_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (num_pedido, ID_producto),
    FOREIGN KEY (num_pedido) REFERENCES Pedido(num_pedido) ON DELETE CASCADE,
    FOREIGN KEY (ID_producto) REFERENCES Producto(ID_producto)
);

-- 5. Insertar datos en la tabla Pedido_Producto
INSERT INTO Pedido_Producto (num_pedido, ID_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 25.99),  -- Camisa de Algodón
(1, 2, 1, 39.99),  -- Jeans Ajustados
(2, 3, 1, 45.00),  -- Vestido de Verano
(2, 5, 1, 35.50),  -- Sudadera con Capucha
(3, 7, 1, 55.00);  -- Falda Midi

-- Asegúrate de que la tabla Producto ya tenga los datos necesarios antes de ejecutar las inserciones
