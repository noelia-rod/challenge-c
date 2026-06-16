/**
 * Domain Repository Interface: ITipoSolicitudRepository
 */
class ITipoSolicitudRepository {
  /**
   * @returns {Promise<TipoSolicitud[]>}
   */
  async findAll() {
    throw new Error('ITipoSolicitudRepository.findAll() must be implemented');
  }

  /**
   * @param {number} id
   * @returns {Promise<TipoSolicitud|null>}
   */
  async findById(id) {
    throw new Error('ITipoSolicitudRepository.findById() must be implemented');
  }
}

module.exports = ITipoSolicitudRepository;
