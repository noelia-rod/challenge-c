/**
 * Domain Entity: TipoSolicitud
 */
class TipoSolicitud {
  constructor({ id, codigo, nombre, descripcion, sla_horas, requiere_aprobacion }) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.sla_horas = sla_horas;
    this.requiere_aprobacion = requiere_aprobacion;
  }
}

module.exports = TipoSolicitud;
