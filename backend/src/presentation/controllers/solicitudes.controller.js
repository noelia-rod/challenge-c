const { validationResult } = require('express-validator');
const { success, error } = require('../helpers/apiResponse');

const SolicitudRepository = require('../../infrastructure/repositories/SolicitudRepository');
const TipoSolicitudRepository = require('../../infrastructure/repositories/TipoSolicitudRepository');

const CreateSolicitudUseCase = require('../../application/usecases/CreateSolicitudUseCase');
const GetSolicitudesUseCase = require('../../application/usecases/GetSolicitudesUseCase');
const GetSolicitudByIdUseCase = require('../../application/usecases/GetSolicitudByIdUseCase');
const UpdateEstadoSolicitudUseCase = require('../../application/usecases/UpdateEstadoSolicitudUseCase');

const solicitudRepository = new SolicitudRepository();
const tipoSolicitudRepository = new TipoSolicitudRepository();

const createSolicitudUseCase = new CreateSolicitudUseCase(solicitudRepository, tipoSolicitudRepository);
const getSolicitudesUseCase = new GetSolicitudesUseCase(solicitudRepository);
const getSolicitudByIdUseCase = new GetSolicitudByIdUseCase(solicitudRepository);
const updateEstadoSolicitudUseCase = new UpdateEstadoSolicitudUseCase(solicitudRepository);

// POST /api/solicitudes
const createSolicitud = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Validation failed', 422, errors.array());
    }
    const solicitud = await createSolicitudUseCase.execute(req.body);
    success(res, solicitud, 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/solicitudes
const getSolicitudes = async (req, res, next) => {
  try {
    const filters = {
      tipo_solicitud_id: req.query.tipo || null,
      urgencia: req.query.urgencia || null,
      estado: req.query.estado || null,
    };
    const solicitudes = await getSolicitudesUseCase.execute(filters);
    success(res, solicitudes);
  } catch (err) {
    next(err);
  }
};

// GET /api/solicitudes/:id
const getSolicitudById = async (req, res, next) => {
  try {
    const solicitud = await getSolicitudByIdUseCase.execute(req.params.id);
    success(res, solicitud);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/solicitudes/:id/estado
const updateEstado = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Validation failed', 422, errors.array());
    }
    const { estado, usuario, comentario } = req.body;
    const solicitud = await updateEstadoSolicitudUseCase.execute(
      req.params.id,
      estado,
      usuario || 'Sistema',
      comentario || ''
    );
    success(res, solicitud);
  } catch (err) {
    next(err);
  }
};

module.exports = { createSolicitud, getSolicitudes, getSolicitudById, updateEstado };
