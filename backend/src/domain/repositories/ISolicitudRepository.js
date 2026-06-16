/**
 * Domain Repository Interface: ISolicitudRepository
 */
class ISolicitudRepository {
  /**
   * @param {object} filters - { tipo_solicitud_id, urgencia, estado }
   * @returns {Promise<Solicitud[]>}
   */
  async findAll(filters) {
    throw new Error('ISolicitudRepository.findAll() must be implemented');
  }

  /**
   * @param {number} id
   * @returns {Promise<Solicitud|null>}
   */
  async findById(id) {
    throw new Error('ISolicitudRepository.findById() must be implemented');
  }

  /**
   * @param {object} data
   * @returns {Promise<Solicitud>}
   */
  async create(data) {
    throw new Error('ISolicitudRepository.create() must be implemented');
  }

  /**
   * @param {number} id
   * @param {string} estado
   * @param {string} usuario
   * @param {string} comentario
   * @returns {Promise<Solicitud>}
   */
  async updateEstado(id, estado, usuario, comentario) {
    throw new Error('ISolicitudRepository.updateEstado() must be implemented');
  }

  /**
   * @returns {Promise<object>} metrics aggregations
   */
  async getDashboardMetrics() {
    throw new Error('ISolicitudRepository.getDashboardMetrics() must be implemented');
  }
}

module.exports = ISolicitudRepository;
