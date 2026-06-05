const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM empleados ORDER BY id_empleado');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM empleados WHERE id_empleado = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { nombre, identificacion, departamento, telefono, tipo_jornada, estado } = req.body;
  const { rows } = await db.query(
    `INSERT INTO empleados (nombre, identificacion, departamento, telefono, tipo_jornada, estado)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [nombre, identificacion, departamento, telefono, tipo_jornada, estado || 'Activo']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { nombre, identificacion, departamento, telefono, tipo_jornada, estado } = req.body;
  const { rows } = await db.query(
    `UPDATE empleados SET nombre=$1, identificacion=$2, departamento=$3,
     telefono=$4, tipo_jornada=$5, estado=$6 WHERE id_empleado=$7 RETURNING *`,
    [nombre, identificacion, departamento, telefono, tipo_jornada, estado, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM empleados WHERE id_empleado = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
