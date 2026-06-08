import TurnosReservas from "../database/turnos_reservas.js";

export default class TurnosReservasService {
  constructor() {
    this.turnosReservas = new TurnosReservas();
  }

  getAll = () => {
    return this.turnosReservas.getAll();
  };

  getById = (id) => {
    return this.turnosReservas.getById(id);
  };

  create = (data) => {
    return this.turnosReservas.create(data);
  };

  update = (id, data) => {
    return this.turnosReservas.update(id, data);
  };

  delete = (id) => {
    return this.turnosReservas.delete(id);
  };
}