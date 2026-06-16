const { success } = require('../helpers/apiResponse');
const TipoSolicitudRepository = require('../../infrastructure/repositories/TipoSolicitudRepository');
const GetTiposSolicitudUseCase = require('../../application/usecases/GetTiposSolicitudUseCase');

const tipoSolicitudRepository = new TipoSolicitudRepository();
const getTiposSolicitudUseCase = new GetTiposSolicitudUseCase(tipoSolicitudRepository);

const getTiposSolicitud = async (_req, res, next) => {
  try {
    const tipos = await getTiposSolicitudUseCase.execute();
    success(res, tipos);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTiposSolicitud };
