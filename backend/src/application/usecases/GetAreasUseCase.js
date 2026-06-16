/**
 * Use Case: Get all organisational areas.
 */
class GetAreasUseCase {
  /**
   * @param {import('../../domain/repositories/IAreaRepository')} areaRepository
   */
  constructor(areaRepository) {
    this.areaRepository = areaRepository;
  }

  async execute() {
    return this.areaRepository.findAll();
  }
}

module.exports = GetAreasUseCase;
