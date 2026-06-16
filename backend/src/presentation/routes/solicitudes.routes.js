const { Router } = require('express');
const { body, param } = require('express-validator');
const {
  createSolicitud,
  getSolicitudes,
  getSolicitudById,
  updateEstado,
} = require('../controllers/solicitudes.controller');

const router = Router();

// Validation rules for creating a solicitud
const createValidation = [
  body('tipo_solicitud_id')
    .notEmpty().withMessage('tipo_solicitud_id is required')
    .isInt({ min: 1 }).withMessage('tipo_solicitud_id must be a positive integer'),
  body('titulo')
    .notEmpty().withMessage('titulo is required')
    .isLength({ max: 255 }).withMessage('titulo max length is 255'),
  body('descripcion')
    .notEmpty().withMessage('descripcion is required'),
  body('urgencia')
    .notEmpty().withMessage('urgencia is required')
    .isIn(['Alta', 'Media', 'Baja']).withMessage('urgencia must be Alta, Media or Baja'),
  body('solicitante')
    .notEmpty().withMessage('solicitante is required')
    .isLength({ max: 100 }).withMessage('solicitante max length is 100'),
  body('email_solicitante')
    .notEmpty().withMessage('email_solicitante is required')
    .isEmail().withMessage('email_solicitante must be a valid email'),
  body('area_solicitante_id')
    .notEmpty().withMessage('area_solicitante_id is required')
    .isInt({ min: 1 }).withMessage('area_solicitante_id must be a positive integer'),
];

// Validation rules for updating estado
const updateEstadoValidation = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  body('estado')
    .notEmpty().withMessage('estado is required')
    .isIn(['Recibida', 'En revisión', 'Resuelta', 'Rechazada', 'Cancelada'])
    .withMessage('Invalid estado value'),
];

// Routes
router.get('/', getSolicitudes);
router.post('/', createValidation, createSolicitud);
router.get('/:id', getSolicitudById);
router.patch('/:id/estado', updateEstadoValidation, updateEstado);

module.exports = router;
