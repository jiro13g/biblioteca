-- Crear base de datos
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(15),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla libros
CREATE TABLE IF NOT EXISTS libros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  unidades INT DEFAULT 1,
  portada LONGBLOB,
  descripcion TEXT,
  genero VARCHAR(50),
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla préstamos
CREATE TABLE IF NOT EXISTS prestamos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  libro_id INT NOT NULL,
  fecha_prestamo DATE NOT NULL,
  fecha_devolucion DATE,
  estado VARCHAR(20) DEFAULT 'Activo',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_cedula ON usuarios(cedula);
CREATE INDEX idx_codigo ON libros(codigo);
CREATE INDEX idx_titulo ON libros(titulo);
CREATE INDEX idx_prestamos_usuario ON prestamos(usuario_id);
CREATE INDEX idx_prestamos_libro ON prestamos(libro_id);
CREATE INDEX idx_prestamos_estado ON prestamos(estado);

-- Datos de prueba
INSERT INTO usuarios (nombre, cedula, telefono) VALUES
('María López', '1234567890', '3001234567'),
('Carlos Ruiz', '0987654321', '3009876543'),
('Ana García', '1122334455', '3005555555');

INSERT INTO libros (codigo, titulo, autor, unidades, descripcion, genero) VALUES
('L001', 'El principito', 'Antoine de Saint-Exupéry', 3, 'Un pequeño príncipe llega a la Tierra desde un asteroide', 'Novela infantil'),
('L002', 'Cien años de soledad', 'Gabriel García Márquez', 5, 'La historia de la familia Buendía en Macondo', 'Novela'),
('L003', '1984', 'George Orwell', 5, 'Una distopía sobre un régimen totalitario', 'Ciencia ficción'),
('L004', 'Don Quijote de la Mancha', 'Miguel de Cervantes', 2, 'Las aventuras de un hidalgo que quiere ser caballero', 'Clásico');

INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, estado) VALUES
(1, 1, '2025-09-03', 'Activo'),
(2, 2, '2025-09-01', 'Activo');
