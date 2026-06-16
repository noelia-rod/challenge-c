const ISolicitudRepository = require('../../domain/repositories/ISolicitudRepository');
const Solicitud = require('../../domain/entities/Solicitud');
const HistorialSolicitud = require('../../domain/entities/HistorialSolicitud');
const { query, getClient } = require('../database/db');

class SolicitudRepository extends ISolicitudRepository {
  // ── Private helpers ─────────────────────────────────────────────────────────

  _mapRow(row) {
    return new Solicitud({
      id: row.id,
      numero_ticket: row.numero_ticket,
      tipo_solicitud_id: row.tipo_solicitud_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      urgencia: row.urgencia,
      estado: row.estado,
      solicitante: row.solicitante,
      email_solicitante: row.email_solicitante,
      area_solicitante_id: row.area_solicitante_id,
      area_asignada_id: row.area_asignada_id,
      asignado_a: row.asignado_a,
      fecha_creacion: row.fecha_creacion,
      fecha_vencimiento: row.fecha_vencimiento,
      fecha_resolucion: row.fecha_resolucion,
      solucion: row.solucion,
      calificacion: row.calificacion,
      comentario_calificacion: row.comentario_calificacion,
      // joined fields
      tipo_solicitud: row.tipo_solicitud_nombre
        ? { id: row.tipo_solicitud_id, nombre: row.tipo_solicitud_nombre, codigo: row.tipo_solicitud_codigo }
        : undefined,
      area_solicitante: row.area_solicitante_nombre
        ? { id: row.area_solicitante_id, nombre: row.area_solicitante_nombre }
        : undefined,
      area_asignada: row.area_asignada_nombre
        ? { id: row.area_asignada_id, nombre: row.area_asignada_nombre }
        : undefined,
    });
  }

  _baseSelectQuery() {
    return `
      SELECT
        s.*,
        ts.nombre  AS tipo_solicitud_nombre,
        ts.codigo  AS tipo_solicitud_codigo,
        a1.nombre  AS area_solicitante_nombre,
        a2.nombre  AS area_asignada_nombre
      FROM solicitudes s
      LEFT JOIN tipos_solicitud ts ON ts.id = s.tipo_solicitud_id
      LEFT JOIN areas            a1 ON a1.id = s.area_solicitante_id
      LEFT JOIN areas            a2 ON a2.id = s.area_asignada_id
    `;
  }

  // ── Interface implementation ─────────────────────────────────────────────────

  async findAll(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.tipo_solicitud_id) {
      params.push(filters.tipo_solicitud_id);
      conditions.push(`s.tipo_solicitud_id = $${params.length}`);
    }
    if (filters.urgencia) {
      params.push(filters.urgencia);
      conditions.push(`s.urgencia = $${params.length}`);
    }
    if (filters.estado) {
      params.push(filters.estado);
      conditions.push(`s.estado = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `${this._baseSelectQuery()} ${where} ORDER BY s.fecha_creacion DESC`;

    const result = await query(sql, params);
    return result.rows.map((row) => this._mapRow(row));
  }

  async findById(id) {
    const sql = `${this._baseSelectQuery()} WHERE s.id = $1`;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;

    const solicitud = this._mapRow(result.rows[0]);

    // Attach historial
    const histResult = await query(
      `SELECT * FROM historial_solicitudes WHERE solicitud_id = $1 ORDER BY fecha_cambio ASC`,
      [id],
    );
    solicitud.historial = histResult.rows.map((row) => new HistorialSolicitud(row));

    return solicitud;
  }

  async create(data) {
    const sql = `
      INSERT INTO solicitudes (
        numero_ticket, tipo_solicitud_id, titulo, descripcion, urgencia,
        solicitante, email_solicitante, area_solicitante_id,
        area_asignada_id, asignado_a, fecha_vencimiento
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;
    const params = [
      data.numero_ticket,
      data.tipo_solicitud_id,
      data.titulo,
      data.descripcion,
      data.urgencia,
      data.solicitante,
      data.email_solicitante,
      data.area_solicitante_id,
      data.area_asignada_id || null,
      data.asignado_a || null,
      data.fecha_vencimiento || null,
    ];

    const result = await query(sql, params);
    return this._mapRow(result.rows[0]);
  }

  async updateEstado(id, estado, usuario, comentario) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Get current estado
      const current = await client.query(
        'SELECT estado FROM solicitudes WHERE id = $1 FOR UPDATE',
        [id],
      );
      if (current.rows.length === 0) {
        throw new Error(`Solicitud with id ${id} not found`);
      }
      const estadoAnterior = current.rows[0].estado;

      // Extra fields when resolving
      const extraSet = estado === 'Resuelta' ? ', fecha_resolucion = NOW()' : '';

      // Update solicitud estado
      await client.query(
        `UPDATE solicitudes SET estado = $1${extraSet} WHERE id = $2`,
        [estado, id],
      );

      // Insert historial entry
      await client.query(
        `INSERT INTO historial_solicitudes (solicitud_id, estado_anterior, estado_nuevo, usuario, comentario)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, estadoAnterior, estado, usuario, comentario || null],
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Return updated solicitud with historial
    return this.findById(id);
  }

  async getDashboardMetrics() {
    const [byEstado, byUrgencia, total] = await Promise.all([
      query(`
        SELECT estado, COUNT(*)::int AS count
        FROM solicitudes
        GROUP BY estado
        ORDER BY estado
      `),
      query(`
        SELECT urgencia, COUNT(*)::int AS count
        FROM solicitudes
        GROUP BY urgencia
        ORDER BY urgencia
      `),
      query(`SELECT COUNT(*)::int AS total FROM solicitudes`),
    ]);

    return {
      por_estado: byEstado.rows,
      por_urgencia: byUrgencia.rows,
      total: total.rows[0].total,
    };
  }
}

module.exports = SolicitudRepository;
