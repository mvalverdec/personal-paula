const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query(`
    SELECT a.*, e.nombre AS nombre_empleado
    FROM ausencias a
    LEFT JOIN empleados e ON a.id_empleado = e.id_empleado
    ORDER BY a.id_ausencia
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id_empleado, tipo_ausencia, fecha_inicio, fecha_fin } = req.body;
  const { rows } = await db.query(
    `INSERT INTO ausencias (id_empleado, tipo_ausencia, fecha_inicio, fecha_fin)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [id_empleado, tipo_ausencia, fecha_inicio || null, fecha_fin || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id_empleado, tipo_ausencia, fecha_inicio, fecha_fin } = req.body;
  const { rows } = await db.query(
    `UPDATE ausencias SET id_empleado=$1, tipo_ausencia=$2, fecha_inicio=$3, fecha_fin=$4
     WHERE id_ausencia=$5 RETURNING *`,
    [id_empleado, tipo_ausencia, fecha_inicio || null, fecha_fin || null, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM ausencias WHERE id_ausencia = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
