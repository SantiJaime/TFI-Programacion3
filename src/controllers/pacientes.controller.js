import PacientesService from "../services/pacientes.service.js";

export default class PacientesController {
  constructor() {
    this.pacientesService = new PacientesService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.pacientesService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error("Error en getAll Pacientes:", error);
      res.status(500).send({ ok: false, msg: "Error al obtener la lista de pacientes" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const row = await this.pacientesService.getById(id);
      if (row.length === 0) {
        return res.status(404).send({ ok: false, msg: "Paciente no encontrado" });
      }
      res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      console.error(`Error en getById Pacientes (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar el paciente solicitado" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.pacientesService.create(req.body);
      res.status(201).send({
        ok: true,
        msg: "Paciente creado con éxito",
        data: { id_paciente: result.insertId, ...req.body },
      });
    } catch (error) {
      console.error("Error en create Pacientes:", error);
      res.status(500).send({ ok: false, msg: "Error al intentar registrar el paciente" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.pacientesService.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Paciente no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Paciente actualizado con éxito" });
    } catch (error) {
      console.error(`Error en update Pacientes (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al intentar actualizar los datos del paciente" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.pacientesService.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Paciente no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Paciente eliminado correctamente" });
    } catch (error) {
      console.error(`Error en delete Pacientes (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al intentar eliminar el paciente" });
    }
  };
}