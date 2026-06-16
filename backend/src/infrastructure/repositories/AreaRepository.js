const IAreaRepository = require('../../domain/repositories/IAreaRepository');
const Area = require('../../domain/entities/Area');
const { query } = require('../database/db');

class AreaRepository extends IAreaRepository {
  async findAll() {
    const result = await query(
      'SELECT id, nombre, descripcion, email_contacto FROM areas ORDER BY nombre',
    );
    return result.rows.map((row) => new Area(row));
  }

  async findById(id) {
    const result = await query(
      'SELECT id, nombre, descripcion, email_contacto FROM areas WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) return null;
    return new Area(result.rows[0]);
  }
}

module.exports = AreaRepository;
