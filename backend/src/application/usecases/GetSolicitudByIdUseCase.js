/**
 * Use Case: Get a single solicitud by id, including its historial.
 */
class GetSolicitudByIdUseCase {
  /**
   * @param {import('../../domain/repositories/ISolicitudRepository')} solicitudRepository
   */
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  /**
   * @param {number} id
   * @returns {Promise<import('../../domain/entities/Solicitud')>}
   */
  async execute(id) {
    const solicitud = await this.solicitudRepository.findById(id);
    if (!solicitud) {
      const err = new Error(`Solicitud with id ${id} not found`);
      err.statusCode = 404;
      throw err;
    }
    return solicitud;
  }
}

module.exports = GetSolicitudByIdUseCase;
