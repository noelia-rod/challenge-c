const { success } = require('../helpers/apiResponse');
const SolicitudRepository = require('../../infrastructure/repositories/SolicitudRepository');
const GetDashboardMetricsUseCase = require('../../application/usecases/GetDashboardMetricsUseCase');

const solicitudRepository = new SolicitudRepository();
const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(solicitudRepository);

// GET /api/dashboard/metrics
const getMetrics = async (_req, res, next) => {
  try {
    const metrics = await getDashboardMetricsUseCase.execute();
    success(res, metrics);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMetrics };
