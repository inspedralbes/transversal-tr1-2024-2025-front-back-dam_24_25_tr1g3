-- Seleccionar la base de datos
USE `a24bermipre_TR1-G3`;

-- Insertar Usuarios
INSERT INTO Usuario (nombre, correo, telefono) VALUES
('Juan Pérez', 'juan.perez@example.com', '123456789'),
('María López', 'maria.lopez@example.com', '987654321'),
('Luis García', 'luis.garcia@example.com', '456123789');

-- Insertar Productos
INSERT INTO Producto (nombre, descripcion, precio, stock) VALUES
('Camisa de Algodón', 'Camisa de algodón 100% con estampado floral.', 25.99, 50),
('Jeans Ajustados', 'Jeans ajustados de mezclilla, disponibles en varios tamaños.', 39.99, 30),
('Vestido de Verano', 'Vestido ligero de verano, ideal para días soleados.', 45.00, 20),
('Chaqueta de Cuero', 'Chaqueta de cuero genuino, perfecta para el invierno.', 120.00, 15),
('Sudadera con Capucha', 'Sudadera cómoda con capucha, disponible en varios colores.', 35.50, 40),
('Zapatos Deportivos', 'Zapatos deportivos ligeros, ideales para el entrenamiento.', 60.00, 25),
('Falda Midi', 'Falda midi elegante, perfecta para ocasiones especiales.', 55.00, 10),
('Camiseta Básica', 'Camiseta básica de algodón, disponible en varios colores.', 15.99, 100),
('Pantalones Cortos', 'Pantalones cortos ligeros, ideales para el verano.', 29.99, 35),
('Bufanda de Lana', 'Bufanda de lana suave, perfecta para el frío.', 19.99, 20);

-- Insertar Pedidos
INSERT INTO Pedido (ID_usuario, fecha, total_pedido, estado) VALUES
(1, '2024-10-22 10:00:00', 125.98, 'pendiente'),
(2, '2024-10-22 11:30:00', 85.50, 'completado'),
(3, '2024-10-22 12:15:00', 55.00, 'pendiente');

-- Insertar Productos en Pedidos
INSERT INTO Pedido_Producto (num_pedido, ID_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 25.99),  -- 2 Camisas de Algodón
(1, 2, 1, 39.99),  -- 1 Jeans Ajustados
(2, 3, 1, 45.00),  -- 1 Vestido de Verano
(2, 5, 1, 35.50),  -- 1 Sudadera con Capucha
(3, 7, 1, 55.00);  -- 1 Falda Midi
