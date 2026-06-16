const { Router } = require('express');
const { getMetrics } = require('../controllers/dashboard.controller');

const router = Router();

// GET /api/dashboard/metrics
router.get('/metrics', getMetrics);

module.exports = router;
