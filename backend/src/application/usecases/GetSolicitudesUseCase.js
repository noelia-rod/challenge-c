/**
 * Use Case: Get all solicitudes with optional filters.
 */
class GetSolicitudesUseCase {
  /**
   * @param {import('../../domain/repositories/ISolicitudRepository')} solicitudRepository
   */
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  /**
   * @param {object} filters
   * @param {number} [filters.tipo_solicitud_id]
   * @param {string} [filters.urgencia]
   * @param {string} [filters.estado]
   * @param {object} pagination
   * @param {number} [pagination.page]
   * @param {number} [pagination.limit]
   * @returns {Promise<{ data: import('../../domain/entities/Solicitud')[], pagination: object }>}
   */
  async execute(filters = {}, pagination = {}) {
    return this.solicitudRepository.findAll(filters, pagination);
  }
}

module.exports = GetSolicitudesUseCase;
