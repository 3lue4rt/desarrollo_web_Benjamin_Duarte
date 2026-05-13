-- crear base de datos
CREATE DATABASE IF NOT EXISTS tarea2 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Darle permisos al usuario
GRANT ALL ON tarea2.* TO cc5002@localhost;