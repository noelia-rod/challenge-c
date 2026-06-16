/**
 * Use Case: Update the estado of a solicitud.
 * Validates allowed state transitions and records a historial entry.
 *
 * Valid transitions:
 *   Recibida     → En revisión | Rechazada | Cancelada
 *   En revisión  → Resuelta    | Rechazada | Cancelada
 *   Resuelta     → (terminal — no transitions allowed)
 *   Rechazada    → (terminal)
 *   Cancelada    → (terminal)
 */

const VALID_TRANSITIONS = {
  Recibida: ['En revisión', 'Rechazada', 'Cancelada'],
  'En revisión': ['Resuelta', 'Rechazada', 'Cancelada'],
  Resuelta: [],
  Rechazada: [],
  Cancelada: [],
};

class UpdateEstadoSolicitudUseCase {
  /**
   * @param {import('../../domain/repositories/ISolicitudRepository')} solicitudRepository
   */
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  /**
   * @param {number} id
   * @param {string} nuevoEstado
   * @param {string} usuario
   * @param {string} [comentario]
   * @returns {Promise<import('../../domain/entities/Solicitud')>}
   */
  async execute(id, nuevoEstado, usuario, comentario) {
    // Load current solicitud (without historial) for lightweight check
    const solicitudes = await this.solicitudRepository.findAll({});
    const solicitud = solicitudes.find((s) => s.id === Number(id));

    if (!solicitud) {
      const err = new Error(`Solicitud with id ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    const allowedNext = VALID_TRANSITIONS[solicitud.estado];
    if (!allowedNext) {
      const err = new Error(`Unknown current estado: ${solicitud.estado}`);
      err.statusCode = 400;
      throw err;
    }

    if (!allowedNext.includes(nuevoEstado)) {
      const err = new Error(
        `Invalid state transition from "${solicitud.estado}" to "${nuevoEstado}". ` +
          `Allowed transitions: ${allowedNext.length ? allowedNext.join(', ') : 'none (terminal state)'}`,
      );
      err.statusCode = 422;
      throw err;
    }

    return this.solicitudRepository.updateEstado(id, nuevoEstado, usuario, comentario);
  }
}

module.exports = UpdateEstadoSolicitudUseCase;
