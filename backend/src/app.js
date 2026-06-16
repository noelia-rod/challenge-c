const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./presentation/middlewares/errorHandler');

const areasRouter = require('./presentation/routes/areas.routes');
const tiposSolicitudRouter = require('./presentation/routes/tiposSolicitud.routes');
const solicitudesRouter = require('./presentation/routes/solicitudes.routes');
const dashboardRouter = require('./presentation/routes/dashboard.routes');

const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/areas', areasRouter);
app.use('/api/tipos-solicitud', tiposSolicitudRouter);
app.use('/api/solicitudes', solicitudesRouter);
app.use('/api/dashboard', dashboardRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
