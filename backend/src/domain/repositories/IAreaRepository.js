/**
 * Domain Repository Interface: IAreaRepository
 * Defines the contract for area data access operations.
 */
class IAreaRepository {
  /**
   * @returns {Promise<Area[]>}
   */
  async findAll() {
    throw new Error('IAreaRepository.findAll() must be implemented');
  }

  /**
   * @param {number} id
   * @returns {Promise<Area|null>}
   */
  async findById(id) {
    throw new Error('IAreaRepository.findById() must be implemented');
  }
}

module.exports = IAreaRepository;
