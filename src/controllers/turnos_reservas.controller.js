import TurnosReservasService from "../services/turnos_reservas.service.js";

export default class TurnosReservasController {
  constructor() {
    this.turnosService = new TurnosReservasService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.turnosService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error("Error en getAll TurnosReservas:", error);
      res.status(500).send({ ok: false, msg: "Error al obtener el listado de turnos" });
    }
  };

  getDoctorAppointments = async (req, res) => {
    try {
      const { id } = req.params;
      const rows = await this.turnosService.getDoctorAppointments(id);
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Turnos del médico no encontrados" });
      }
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(`Error en getDoctorAppointments (Médico ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar los turnos del médico" });
    }
  };

  getPatientAppointments = async (req, res) => {
    try {
      const { id } = req.params;
      const rows = await this.turnosService.getPatientAppointments(id);
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Turnos del paciente no encontrados" });
      }
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(`Error en getPatientAppointments (Paciente ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar los turnos del paciente" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.turnosService.create(req.body);
      console.log(result)
      res.status(201).send({
        ok: true,
        msg: "Turno reservado con éxito",
        data: { id_turno_reserva: result.insertId, ...req.body },
      });
    } catch (error) {
      console.error("Error en create TurnosReservas:", error);
      res.status(500).send({ ok: false, msg: "Error al procesar la reserva del turno" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.turnosService.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Turno no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Turno actualizado con éxito" });
    } catch (error) {
      console.error(`Error en update TurnosReservas (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al intentar modificar el turno" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.turnosService.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Turno no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Turno cancelado correctamente" });
    } catch (error) {
      console.error(`Error en delete TurnosReservas (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al intentar cancelar el turno" });
    }
  };
}