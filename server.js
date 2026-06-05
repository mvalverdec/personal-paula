require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/empleados',    require('./routes/empleados'));
app.use('/api/turnos',       require('./routes/turnos'));
app.use('/api/guardias',     require('./routes/guardias'));
app.use('/api/tareas',       require('./routes/tareas'));
app.use('/api/asignaciones', require('./routes/asignaciones'));
app.use('/api/ausencias',    require('./routes/ausencias'));
app.use('/api/consultas',    require('./routes/consultas'));

// Catch-all → SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Sistema de Control de Personal`);
  console.log(`   http://localhost:${PORT}\n`);
});
