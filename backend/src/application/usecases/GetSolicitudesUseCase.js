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
   * @returns {Promise<import('../../domain/entities/Solicitud')[]>}
   */
  async execute(filters = {}) {
    return this.solicitudRepository.findAll(filters);
  }
}

module.exports = GetSolicitudesUseCase;
