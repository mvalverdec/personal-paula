const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query(`
    SELECT a.*, e.nombre AS nombre_empleado, t.nombre_tarea
    FROM asignaciones a
    LEFT JOIN empleados e ON a.id_empleado = e.id_empleado
    LEFT JOIN tareas t ON a.id_tarea = t.id_tarea
    ORDER BY a.id_asignacion
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id_empleado, id_tarea } = req.body;
  const { rows } = await db.query(
    `INSERT INTO asignaciones (id_empleado, id_tarea) VALUES ($1,$2) RETURNING *`,
    [id_empleado, id_tarea]
  );
  res.status(201).json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM asignaciones WHERE id_asignacion = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
