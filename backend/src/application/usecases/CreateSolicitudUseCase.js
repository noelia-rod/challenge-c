/**
 * Use Case: Create a new solicitud.
 * - Generates a unique numero_ticket: TKT-YYYYMMDD-XXXX
 * - Calculates fecha_vencimiento based on tipo_solicitud.sla_horas
 */
class CreateSolicitudUseCase {
  /**
   * @param {import('../../domain/repositories/ISolicitudRepository')}    solicitudRepository
   * @param {import('../../domain/repositories/ITipoSolicitudRepository')} tipoSolicitudRepository
   */
  constructor(solicitudRepository, tipoSolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
    this.tipoSolicitudRepository = tipoSolicitudRepository;
  }

  /**
   * @param {object} data
   * @param {number} data.tipo_solicitud_id
   * @param {string} data.titulo
   * @param {string} data.descripcion
   * @param {string} data.urgencia        - 'Alta' | 'Media' | 'Baja'
   * @param {string} data.solicitante
   * @param {string} data.email_solicitante
   * @param {number} data.area_solicitante_id
   * @param {number} [data.area_asignada_id]
   * @param {string} [data.asignado_a]
   * @returns {Promise<import('../../domain/entities/Solicitud')>}
   */
  async execute(data) {
    const tipoSolicitud = await this.tipoSolicitudRepository.findById(data.tipo_solicitud_id);
    if (!tipoSolicitud) {
      const err = new Error(`TipoSolicitud with id ${data.tipo_solicitud_id} not found`);
      err.statusCode = 404;
      throw err;
    }

    const numeroTicket = this._generateTicketNumber();
    const fechaVencimiento = this._calculateDueDate(tipoSolicitud.sla_horas);

    return this.solicitudRepository.create({
      ...data,
      numero_ticket: numeroTicket,
      fecha_vencimiento: fechaVencimiento,
    });
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  _generateTicketNumber() {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const rand = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    return `TKT-${datePart}-${rand}`;
  }

  /**
   * @param {number} slaHoras - SLA in hours from tipo_solicitud
   * @returns {Date}
   */
  _calculateDueDate(slaHoras) {
    const due = new Date();
    due.setHours(due.getHours() + (slaHoras || 48));
    return due;
  }
}

module.exports = CreateSolicitudUseCase;
