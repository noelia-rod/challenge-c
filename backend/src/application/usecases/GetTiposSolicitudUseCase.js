/**
 * Use Case: Get all request types.
 */
class GetTiposSolicitudUseCase {
  /**
   * @param {import('../../domain/repositories/ITipoSolicitudRepository')} tipoSolicitudRepository
   */
  constructor(tipoSolicitudRepository) {
    this.tipoSolicitudRepository = tipoSolicitudRepository;
  }

  async execute() {
    return this.tipoSolicitudRepository.findAll();
  }
}

module.exports = GetTiposSolicitudUseCase;
