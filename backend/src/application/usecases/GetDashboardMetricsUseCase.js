/**
 * Use Case: Get aggregated dashboard metrics.
 * Returns counts by estado, counts by urgencia, and total solicitudes.
 */
class GetDashboardMetricsUseCase {
  /**
   * @param {import('../../domain/repositories/ISolicitudRepository')} solicitudRepository
   */
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  /**
   * @returns {Promise<{ por_estado: Array, por_urgencia: Array, total: number }>}
   */
  async execute() {
    return this.solicitudRepository.getDashboardMetrics();
  }
}

module.exports = GetDashboardMetricsUseCase;
