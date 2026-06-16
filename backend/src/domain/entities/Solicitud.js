/**
 * Domain Entity: Solicitud
 */
class Solicitud {
  constructor({
    id,
    numero_ticket,
    tipo_solicitud_id,
    titulo,
    descripcion,
    urgencia,
    estado,
    solicitante,
    email_solicitante,
    area_solicitante_id,
    area_asignada_id,
    asignado_a,
    fecha_creacion,
    fecha_vencimiento,
    fecha_resolucion,
    solucion,
    calificacion,
    comentario_calificacion,
    tipo_solicitud,
    area_solicitante,
    area_asignada,
  }) {
    this.id = id;
    this.numero_ticket = numero_ticket;
    this.tipo_solicitud_id = tipo_solicitud_id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.urgencia = urgencia;
    this.estado = estado;
    this.solicitante = solicitante;
    this.email_solicitante = email_solicitante;
    this.area_solicitante_id = area_solicitante_id;
    this.area_asignada_id = area_asignada_id;
    this.asignado_a = asignado_a;
    this.fecha_creacion = fecha_creacion;
    this.fecha_vencimiento = fecha_vencimiento;
    this.fecha_resolucion = fecha_resolucion;
    this.solucion = solucion;
    this.calificacion = calificacion;
    this.comentario_calificacion = comentario_calificacion;
    // Joined fields
    this.tipo_solicitud = tipo_solicitud;
    this.area_solicitante = area_solicitante;
    this.area_asignada = area_asignada;
  }
}

module.exports = Solicitud;
