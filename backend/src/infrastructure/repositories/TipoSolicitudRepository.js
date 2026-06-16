const ITipoSolicitudRepository = require('../../domain/repositories/ITipoSolicitudRepository');
const TipoSolicitud = require('../../domain/entities/TipoSolicitud');
const { query } = require('../database/db');

class TipoSolicitudRepository extends ITipoSolicitudRepository {
  async findAll() {
    const result = await query(
      'SELECT id, codigo, nombre, descripcion, sla_horas, requiere_aprobacion FROM tipos_solicitud ORDER BY nombre',
    );
    return result.rows.map((row) => new TipoSolicitud(row));
  }

  async findById(id) {
    const result = await query(
      'SELECT id, codigo, nombre, descripcion, sla_horas, requiere_aprobacion FROM tipos_solicitud WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) return null;
    return new TipoSolicitud(result.rows[0]);
  }
}

module.exports = TipoSolicitudRepository;
