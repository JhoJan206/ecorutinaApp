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
-- Nivel: 1=Principiante, 2=Intermedio, 3=Profesional
CREATE TABLE IF NOT EXISTS habitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    puntos INT DEFAULT 10,
    frecuencia ENUM('diaria', 'semanal') DEFAULT 'diaria',
    nivel TINYINT DEFAULT 1,
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

-- 7. Tabla evaluaciones (respuestas del cuestionario inicial)
CREATE TABLE IF NOT EXISTS evaluaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pregunta1 INT,
    pregunta2 INT,
    pregunta3 INT,
    pregunta4 INT,
    nivel_final INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Insertar datos iniciales
INSERT INTO categorias (nombre, descripcion, icono) VALUES
('Ahorro de agua', 'Hábitos para cuidar el agua', '💧'),
('Energía responsable', 'Uso eficiente de energía', '⚡'),
('Reducción de residuos', 'Menos basura, más reciclaje', '♻️'),
('Transporte verde', 'Movilidad sostenible', '🚲');

-- PRINCIPIANTE (nivel 1) - 5 hábitos por categoría
INSERT INTO habitos (categoria_id, nombre, descripcion, puntos, nivel) VALUES
-- Agua (principiante)
(1, 'Cerrar el grifo mientras me cepillo', 'Ahorro de agua al cepillarse', 10, 1),
(1, 'Ducharse en menos de 5 minutos', 'Reducir tiempo de ducha', 15, 1),
(1, 'Reutilizar agua de lavage de verduras', 'Usar agua de forma inteligente', 10, 1),
(1, 'No dejar llaves abiertas', 'Evitar desperdicio de agua', 10, 1),
(1, 'Regar plantas con agua de ahorro', 'Reutilizar agua tratada', 10, 1),

-- Energía (principiante)
(2, 'Apagar luces al salir de una habitación', 'Ahorro de energía', 10, 1),
(2, 'Desconectar aparatos en standby', 'Evitar consumo innecesario', 15, 1),
(2, 'Usar luz natural siempre que sea posible', 'Reducir uso de bombillas', 10, 1),
(2, 'Apagar el computador cuando no se use', 'Ahorro energético', 10, 1),
(2, 'Desconectar cargadores cuando no se usen', 'Evitar consumo pasivo', 10, 1),

-- Residuos (principiante)
(3, 'Separar residuos correctamente', 'Reciclaje adecuado', 15, 1),
(3, 'Usar bolsa reutilizable', 'Evitar plásticos', 10, 1),
(3, 'No usar popotes ni plásticos', 'Reducir contaminación', 10, 1),
(3, 'Reciclar papel y cartón', 'Separar materiales reciclables', 10, 1),
(3, 'Usar contenedores de órganico', 'Compostaje básico', 10, 1),

-- Transporte (principiante)
(4, 'Caminar o bicicleta al trabajo/uni', 'Transporte limpio', 20, 1),
(4, 'Usar transporte público', 'Reducir emisiones', 15, 1),
(4, 'Compartir viaje (carpool)', 'Optimizar viajes', 15, 1),
(4, 'Evitar viajes cortos en coche', 'Caminar distancias cortas', 10, 1),
(4, 'Planificar rutas para múltiples tareas', 'Optimizar viajes', 10, 1);

-- INTERMEDIO (nivel 2) - 2 hábitos adicionales por categoría
INSERT INTO habitos (categoria_id, nombre, descripcion, puntos, nivel) VALUES
-- Agua (intermedio)
(1, 'Instalar reductores de flujo en grifos', 'Reducir consumo de agua', 20, 2),
(1, 'Recolectar agua de lluvia para plantas', 'Reutilizar agua natural', 15, 2),

-- Energía (intermedio)
(2, 'Usar bombillas LED de bajo consumo', 'Reducir consumo eléctrico', 20, 2),
(2, 'Programar termostato inteligente', 'Optimizar climatización', 15, 2),

-- Residuos (intermedio)
(3, 'Compostar residuos de cocina', 'Reducir basura orgánica', 25, 2),
(3, 'Evitar productos con exceso de包装', 'Reducir residuos desde origen', 15, 2),

-- Transporte (intermedio)
(4, 'Trabajar desde casa 1 día/semana', 'Reducir desplazamientos', 20, 2),
(4, 'Mantener el vehículo en buen estado', 'Reducir emisiones', 15, 2);

-- PROFESIONAL (nivel 3) - 2 hábitos adicionales por categoría
INSERT INTO habitos (categoria_id, nombre, descripcion, puntos, nivel) VALUES
-- Agua (profesional)
(1, 'Instalar sistema de reutilización de aguas grises', 'Reciclaje total de agua', 35, 3),
(1, 'Cultivar huerto urbano con riego por goteo', 'Agricultura sostenible', 30, 3),

-- Energía (profesional)
(2, 'Instalar paneles solares domésticos', 'Energía renovable', 40, 3),
(2, 'AuditEnergy energética del hogar', 'Optimización avanzada', 30, 3),

-- Residuos (profesional)
(3, 'Crear红十字 de compostaje comunitario', 'Gestión integral de residuos', 40, 3),
(3, 'Implementar economía circular en casa', 'Reutilización creativa', 35, 3),

-- Transporte (profesional)
(4, 'Adquirir vehículo eléctrico o híbrido', 'Movilidad cero emisiones', 50, 3),
(4, 'Compensar huella de carbono', 'Neutralizar emisiones', 40, 3);

INSERT INTO recompensas (nombre, descripcion, puntosRequeridos, icono) VALUES
('Semana Verde', 'Badge por completar 7 días seguidos', 100, '🌱'),
('Maestro del Agua', 'Badge por completar hábitos de agua', 150, '💧'),
('Ahorrador de Energía', 'Badge por completar hábitos de energía', 150, '⚡'),
('Héroe Reciclaje', 'Badge por completar hábitos de residuos', 150, '♻️'),
('Viajero Verde', 'Badge por completar hábitos de transporte', 150, '🚲'),
('Eco Experto', 'Badge por completar todos los hábitos', 500, '🏆');

-- ============================================
-- ACTUALIZAR BASE DE DATOS EXISTENTE
-- Ejecutar solo si ya tienes la base creada
-- ============================================

-- Agregar columna nivel si no existe
ALTER TABLE habitos ADD COLUMN nivel TINYINT DEFAULT 1;

-- Actualizar los hábitos existentes con nivel 1
UPDATE habitos SET nivel = 1 WHERE nivel IS NULL OR nivel = 0;

-- INTERMEDIO (nivel 2) - 2 hábitos adicionales por categoría
INSERT INTO habitos (categoria_id, nombre, descripcion, puntos, nivel) VALUES
(1, 'Instalar reductores de flujo en grifos', 'Reducir consumo de agua', 20, 2),
(1, 'Recolectar agua de lluvia para plantas', 'Reutilizar agua natural', 15, 2),
(2, 'Usar bombillas LED de bajo consumo', 'Reducir consumo eléctrico', 20, 2),
(2, 'Programar termostato inteligente', 'Optimizar climatización', 15, 2),
(3, 'Compostar residuos de cocina', 'Reducir basura orgánica', 25, 2),
(3, 'Evitar productos con exceso de Packaging', 'Reducir residuos desde origen', 15, 2),
(4, 'Trabajar desde casa 1 día/semana', 'Reducir desplazamientos', 20, 2),
(4, 'Mantener el vehículo en buen estado', 'Reducir emisiones', 15, 2);

-- PROFESIONAL (nivel 3) - 2 hábitos adicionales por categoría
INSERT INTO habitos (categoria_id, nombre, descripcion, puntos, nivel) VALUES
(1, 'Instalar sistema de reutilización de aguas grises', 'Reciclaje total de agua', 35, 3),
(1, 'Cultivar huerto urbano con riego por goteo', 'Agricultura sostenible', 30, 3),
(2, 'Instalar paneles solares domésticos', 'Energía renovable', 40, 3),
(2, 'AuditEnergy energética del hogar', 'Optimización avanzada', 30, 3),
(3, 'Crear punto de compostaje comunitario', 'Gestión integral de residuos', 40, 3),
(3, 'Implementar economía circular en casa', 'Reutilización creativa', 35, 3),
(4, 'Adquirir vehículo eléctrico o híbrido', 'Movilidad cero emisiones', 50, 3),
(4, 'Compensar huella de carbono', 'Neutralizar emisiones', 40, 3);

-- Verificar que todo se creó
SHOW TABLES;
SELECT 'Base de datos actualizada correctamente' AS mensaje;