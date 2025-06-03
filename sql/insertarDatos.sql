INSERT INTO categories (id, name) VALUES
('elec', 'Electrónica'),
('ropa', 'Ropa'),
('libros', 'Libros'),
('hogar', 'Hogar'),
('depo', 'Deportes');

-- Insertar datos de ejemplo en la tabla de Usuarios
-- Coincide con User.js
INSERT INTO users (firstName, lastName, email, username, password, dateOfBirth, role, avatar) VALUES
('Admin', 'User', 'admin@example.com', 'adminuser', '$2a$10$abcdefghijklmnopqrstuvwxyza.abcdefghijklmnop', '1990-01-15', 'admin', 'admin-avatar.jpg'), -- Contraseña hasheada de ejemplo
('John', 'Doe', 'john.doe@example.com', 'johndoe', '$2a$10$abcdefghijklmnopqrstuvwxyza.abcdefghijklmnop', '1985-05-20', 'user', 'john-avatar.png'),
('Jane', 'Smith', 'jane.smith@example.com', 'janesmith', '$2a$10$abcdefghijklmnopqrstuvwxyza.abcdefghijklmnop', '1992-11-01', 'user', NULL);

-- Insertar datos de ejemplo en la tabla de Productos
-- Coincide con Product.js (sin category_id directo, se usa productcategories)
INSERT INTO products (name, description, price, image, active) VALUES
('Smartphone X', 'El último modelo de smartphone con cámara de alta resolución.', 799.99, 'http://dummyimage.com/113x129.png/5fa2dd/ffffff', TRUE),
('Camiseta de Algodón', 'Camiseta básica de algodón 100% orgánico.', 19.50, 'camiseta-algodon.jpg', TRUE),
('El Señor de los Anillos', 'Edición de lujo de la trilogía clásica.', 35.00, 'libro-anillos.png', TRUE),
('Auriculares Inalámbricos', 'Auriculares con cancelación de ruido y batería de larga duración.', 120.00, 'http://dummyimage.com/150x150.png/ff4500/ffffff', FALSE),
('Zapatillas Deportivas', 'Zapatillas cómodas y ligeras para correr.', 85.99, 'zapatillas-deportivas.jpg', TRUE),
('Lámpara de Escritorio LED', 'Lámpara moderna con intensidad de luz ajustable.', 45.75, 'lampara-escritorio.webp', TRUE);

-- Insertar relaciones en la tabla intermedia productcategories
-- Asocia productos con categorías. Asegúrate de que los IDs existan en las tablas products y categories.
INSERT INTO productcategories (product_id, category_id) VALUES
((SELECT id FROM products WHERE name = 'Smartphone X'), 'elec'),
((SELECT id FROM products WHERE name = 'Camiseta de Algodón'), 'ropa'),
((SELECT id FROM products WHERE name = 'El Señor de los Anillos'), 'libros'),
((SELECT id FROM products WHERE name = 'Auriculares Inalámbricos'), 'elec'),
((SELECT id FROM products WHERE name = 'Zapatillas Deportivas'), 'depo'),
((SELECT id FROM products WHERE name = 'Lámpara de Escritorio LED'), 'hogar');