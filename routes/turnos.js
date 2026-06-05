const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM turnos ORDER BY id_turno');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { tipo_turno, hora_inicio, hora_salida } = req.body;
  const { rows } = await db.query(
    `INSERT INTO turnos (tipo_turno, hora_inicio, hora_salida) VALUES ($1,$2,$3) RETURNING *`,
    [tipo_turno, hora_inicio, hora_salida]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { tipo_turno, hora_inicio, hora_salida } = req.body;
  const { rows } = await db.query(
    `UPDATE turnos SET tipo_turno=$1, hora_inicio=$2, hora_salida=$3 WHERE id_turno=$4 RETURNING *`,
    [tipo_turno, hora_inicio, hora_salida, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM turnos WHERE id_turno = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
