const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query(`
    SELECT g.*, e.nombre AS nombre_empleado
    FROM guardias g
    LEFT JOIN empleados e ON g.id_empleado = e.id_empleado
    ORDER BY g.id_guardia
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { id_empleado, semana, tipo_guardia } = req.body;
  const { rows } = await db.query(
    `INSERT INTO guardias (id_empleado, semana, tipo_guardia) VALUES ($1,$2,$3) RETURNING *`,
    [id_empleado, semana, tipo_guardia]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id_empleado, semana, tipo_guardia } = req.body;
  const { rows } = await db.query(
    `UPDATE guardias SET id_empleado=$1, semana=$2, tipo_guardia=$3 WHERE id_guardia=$4 RETURNING *`,
    [id_empleado, semana, tipo_guardia, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM guardias WHERE id_guardia = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
