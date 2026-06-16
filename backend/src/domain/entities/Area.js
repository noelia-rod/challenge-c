/**
 * Domain Entity: Area
 */
class Area {
  constructor({ id, nombre, descripcion, email_contacto }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.email_contacto = email_contacto;
  }
}

module.exports = Area;
