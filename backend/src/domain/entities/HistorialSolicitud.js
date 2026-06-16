/**
 * Domain Entity: HistorialSolicitud
 */
class HistorialSolicitud {
  constructor({
    id,
    solicitud_id,
    estado_anterior,
    estado_nuevo,
    usuario,
    comentario,
    fecha_cambio,
  }) {
    this.id = id;
    this.solicitud_id = solicitud_id;
    this.estado_anterior = estado_anterior;
    this.estado_nuevo = estado_nuevo;
    this.usuario = usuario;
    this.comentario = comentario;
    this.fecha_cambio = fecha_cambio;
  }
}

module.exports = HistorialSolicitud;
