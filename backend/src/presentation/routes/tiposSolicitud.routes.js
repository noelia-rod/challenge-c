const { Router } = require('express');
const { getTiposSolicitud } = require('../controllers/tiposSolicitud.controller');

const router = Router();

// GET /api/tipos-solicitud
router.get('/', getTiposSolicitud);

module.exports = router;
