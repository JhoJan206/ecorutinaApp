-- ============================================
-- BASE DE DATOS Ecorutina - Creación completa
-- Ejecutar en MySQL Workbench
-- ============================================

-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS ecoRutina;
USE ecoRutina;

-- 2. Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    universidad VARCHAR(200) DEFAULT 'UDES, Bucaramanga',
    motivacion VARCHAR(255) DEFAULT 'Cuidar el planeta',
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    racha INT DEFAULT 0,
    ecoPuntos INT DEFAULT 0,
    nivel INT DEFAULT 1
);

-- 3. Tabla categorias (agua, energia, residuos, etc.)
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- 4. Tabla hábitos (las rutinas que el usuario debe completar)
CREATE TABLE IF NOT EXISTS habitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    puntos INT DEFAULT 10,
    frecuencia ENUM('diaria', 'semanal') DEFAULT 'diaria',
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- 5. Tabla progreso (registro de hábitos completados por usuario)
CREATE TABLE IF NOT EXISTS progreso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    habit_id INT NOT NULL,
    fecha DATE NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (habit_id) REFERENCES habitos(id),
    UNIQUE KEY unique_progreso (usuario_id, habit_id, fecha)
);

-- 6. Tabla recompensas
CREATE TABLE IF NOT EXISTS recompensas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    puntosRequeridos INT NOT NULL,
    icono VARCHAR(50)
);

-- Insertar datos iniciales
INSERT INTO categorias (nombre, descripcion, icono) VALUES
('Ahorro de agua', 'Hábitos para cuidar el agua', '💧'),
('Energía responsable', 'Uso eficiente de energía', '⚡'),
('Reducción de residuos', 'Menos basura, más reciclaje', '♻️'),
('Transporte verde', 'Movilidad sostenible', '🚲');

INSERT INTO habitos (categoria_id, nombre, descripcion, puntos) VALUES
(1, 'Cerrar el grifo mientras me cepillo', 'Ahorro de agua al cepillarse', 10),
(1, 'Ducharse en menos de 5 minutos', 'Reducir tiempo de ducha', 15),
(1, 'Reutilizar agua de lavado de verduras', 'Usar agua de forma inteligente', 10),
(1, 'No dejar llaves abiertas', 'Evitar desperdicio de agua', 10),
(1, 'Regar plantas con agua de ahorro', 'Reutilizar agua tratada', 10),

(2, 'Apagar luces al salir de una habitación', 'Ahorro de energía', 10),
(2, 'Desconectar appareils en standby', 'Evitar consumo innecesario', 15),
(2, 'Usar luz natural siempre que sea posible', 'Reducir uso de bombillas', 10),
(2, 'Apagar el computador cuando no se use', 'Ahorro energético', 10),

(3, 'Separar residuos correctamente', 'Reciclaje adecuado', 15),
(3, 'Usar bolsa reutilizable', 'Evitar plásticos', 10),
(3, 'Compostar residuos orgánicos', 'Reducir basura', 20),
(3, 'No usar popotes ni plásticos', 'Reducir contaminación', 10),

(4, 'Caminar o bicicleta al trabajo/uni', 'Transporte limpio', 20),
(4, 'Usar transporte público', 'Reducir emisiones', 15),
(4, 'Compartir viaje (carpool)', 'Optimizar viajes', 15);

INSERT INTO recompensas (nombre, descripcion, puntosRequeridos, icono) VALUES
('Semana Verde', 'Badge por completar 7 días seguidos', 100, '🌱'),
('Maestro del Agua', 'Badge por completar hábitos de agua', 150, '💧'),
('Ahorrador de Energía', 'Badge por completar hábitos de energía', 150, '⚡'),
('Héroe Reciclaje', 'Badge por completar hábitos de residuos', 150, '♻️'),
('Viajero Verde', 'Badge por completar hábitos de transporte', 150, '🚲'),
('Eco Experto', 'Badge por completar todos los hábitos', 500, '🏆');

-- Verificar que todo se creó
SHOW TABLES;
SELECT 'Base de datos creada correctamente' AS mensaje;