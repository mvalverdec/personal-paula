require('dotenv').config();
const { Client } = require('pg');

const SQL = `
-- Crear base de datos si no existe se hace antes de conectar
-- Este script asume que ya estás conectado a control_personal

CREATE TABLE IF NOT EXISTS empleados (
  id_empleado   SERIAL PRIMARY KEY,
  nombre        VARCHAR(255) NOT NULL,
  identificacion VARCHAR(255) NOT NULL,
  departamento  VARCHAR(255),
  telefono      VARCHAR(255),
  tipo_jornada  VARCHAR(255),
  estado        VARCHAR(255) DEFAULT 'Activo'
);

CREATE TABLE IF NOT EXISTS turnos (
  id_turno      SERIAL PRIMARY KEY,
  tipo_turno    VARCHAR(255),
  hora_inicio   VARCHAR(20),
  hora_salida   VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS guardias (
  id_guardia    SERIAL PRIMARY KEY,
  id_empleado   INTEGER REFERENCES empleados(id_empleado) ON DELETE SET NULL,
  semana        VARCHAR(50),
  tipo_guardia  VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tareas (
  id_tarea      SERIAL PRIMARY KEY,
  nombre_tarea  VARCHAR(255) NOT NULL,
  estado_tarea  VARCHAR(255) NOT NULL DEFAULT 'Pendiente',
  prioridad     VARCHAR(50),
  fecha_inicio  DATE,
  fecha_fin     DATE
);

CREATE TABLE IF NOT EXISTS asignaciones (
  id_asignacion SERIAL PRIMARY KEY,
  id_empleado   INTEGER REFERENCES empleados(id_empleado) ON DELETE CASCADE,
  id_tarea      INTEGER REFERENCES tareas(id_tarea) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ausencias (
  id_ausencia   SERIAL PRIMARY KEY,
  id_empleado   INTEGER REFERENCES empleados(id_empleado) ON DELETE CASCADE,
  tipo_ausencia VARCHAR(255),
  fecha_inicio  DATE,
  fecha_fin     DATE
);

-- Datos del Access
INSERT INTO empleados (nombre, identificacion, departamento, telefono, tipo_jornada, estado)
VALUES
  ('Santiago Sánchez', '119070890', 'Gerencia', '72766670', 'Diurna', 'Activo')
ON CONFLICT DO NOTHING;

INSERT INTO tareas (nombre_tarea, estado_tarea, prioridad, fecha_inicio, fecha_fin)
VALUES
  ('Soporte de servidor', 'Pendiente', 'Alta', '2026-05-24', '2026-05-26')
ON CONFLICT DO NOTHING;

INSERT INTO asignaciones (id_empleado, id_tarea)
VALUES (1, 1)
ON CONFLICT DO NOTHING;

INSERT INTO guardias (id_empleado, semana, tipo_guardia)
VALUES (1, '', '')
ON CONFLICT DO NOTHING;

INSERT INTO ausencias (id_empleado, tipo_ausencia, fecha_inicio, fecha_fin)
VALUES (1, 'Vacaciones', '2026-05-29', '2026-05-31')
ON CONFLICT DO NOTHING;
`;

async function createDb() {
  // Primero conectar a postgres para crear la DB si no existe
  const admin = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await admin.connect();
    const exists = await admin.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [process.env.DB_NAME]
    );
    if (exists.rows.length === 0) {
      await admin.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✓ Base de datos '${process.env.DB_NAME}' creada.`);
    } else {
      console.log(`ℹ  Base de datos '${process.env.DB_NAME}' ya existe.`);
    }
  } finally {
    await admin.end();
  }

  // Ahora conectar a la DB y crear tablas
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('✓ Tablas creadas y datos semilla insertados.');
    console.log('\n✅ Setup completo. Ejecuta: node server.js');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

createDb();
