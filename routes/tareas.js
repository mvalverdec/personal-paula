const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM tareas ORDER BY id_tarea');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nombre_tarea, estado_tarea, prioridad, fecha_inicio, fecha_fin } = req.body;
  const { rows } = await db.query(
    `INSERT INTO tareas (nombre_tarea, estado_tarea, prioridad, fecha_inicio, fecha_fin)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [nombre_tarea, estado_tarea || 'Pendiente', prioridad, fecha_inicio || null, fecha_fin || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { nombre_tarea, estado_tarea, prioridad, fecha_inicio, fecha_fin } = req.body;
  const { rows } = await db.query(
    `UPDATE tareas SET nombre_tarea=$1, estado_tarea=$2, prioridad=$3,
     fecha_inicio=$4, fecha_fin=$5 WHERE id_tarea=$6 RETURNING *`,
    [nombre_tarea, estado_tarea, prioridad, fecha_inicio || null, fecha_fin || null, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM tareas WHERE id_tarea = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
