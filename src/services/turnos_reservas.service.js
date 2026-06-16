import TurnosReservas from "../database/turnos_reservas.js";

export default class TurnosReservasService {
  constructor() {
    this.turnosReservas = new TurnosReservas();
  }

  getAll = () => {
    return this.turnosReservas.getAll();
  };

  getDoctorAppointments = (id_usuario) => {
    return this.turnosReservas.getDoctorAppointments(id_usuario);
  };

  getPatientAppointments = (id_usuario) => {
    return this.turnosReservas.getPatientAppointments(id_usuario);
  };

  getPacienteIdByUsuario = (id_usuario) => {
    return this.turnosReservas.getPacienteIdByUsuario(id_usuario);
  };

  create = (data) => {
    return this.turnosReservas.create(data);
  };

  update = (id, data) => {
    return this.turnosReservas.update(id, data);
  };

  marcarAtendido = (id) => {
    return this.turnosReservas.marcarAtendido(id);
  };

  delete = (id) => {
    return this.turnosReservas.delete(id);
  };

  getEstadisticas = () => {
    return this.turnosReservas.getEstadisticas();
  };

  getReporteDatos = () => {
    return this.turnosReservas.getReporteDatos();
  };
}