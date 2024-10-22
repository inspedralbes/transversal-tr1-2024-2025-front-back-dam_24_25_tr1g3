-- Crear la base de datos
CREATE DATABASE `a24bermipre_TR1-G3`;

-- Usar la base de datos
USE `a24bermipre_TR1-G3`;

-- Crear la tabla Usuario
CREATE TABLE Usuario (
    ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15)
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
    FOREIGN KEY (num_pedido) REFERENCES Pedido(num_pedido),
    FOREIGN KEY (ID_producto) REFERENCES Producto(ID_producto)
);
