-- Crear usuario
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';

-- Darle permisos al usuario
GRANT ALL ON tarea2.* TO cc5002@localhost;
