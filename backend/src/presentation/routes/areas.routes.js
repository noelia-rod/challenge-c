const { Router } = require('express');
const { getAreas } = require('../controllers/areas.controller');

const router = Router();

// GET /api/areas
router.get('/', getAreas);

module.exports = router;
