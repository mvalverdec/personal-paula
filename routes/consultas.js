const express = require('express');
const router = express.Router();
const db = require('../db');

// Consulta_PersonalDisponible
router.get('/personal-disponible', async (req, res) => {
  const { rows } = await db.query(`
    SELECT nombre, departamento, estado
    FROM empleados
    WHERE estado = 'Activo'
    ORDER BY nombre
  `);
  res.json(rows);
});

// Consulta_CargaTrabajo
router.get('/carga-trabajo', async (req, res) => {
  const { rows } = await db.query(`
    SELECT e.nombre, COUNT(a.id_tarea) AS total_tareas
    FROM empleados e
    LEFT JOIN asignaciones a ON e.id_empleado = a.id_empleado
    GROUP BY e.id_empleado, e.nombre
    ORDER BY total_tareas DESC, e.nombre
  `);
  res.json(rows);
});

module.exports = router;
