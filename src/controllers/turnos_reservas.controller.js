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
      res.status(500).send({ ok: false, msg: "Error interno del servidor" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const row = await this.turnosService.getById(id);
      if (row.length === 0) {
        return res.status(404).send({ ok: false, msg: "Turno no encontrado" });
      }
      res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error interno del servidor" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.turnosService.create(req.body);
      res.status(201).send({
        ok: true,
        msg: "Turno reservado con éxito",
        data: { id_turno_reserva: result.insertId, ...req.body },
      });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error al crear la reserva" });
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
      res.status(500).send({ ok: false, msg: "Error al actualizar" });
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
      res.status(500).send({ ok: false, msg: "Error al eliminar" });
    }
  };
}