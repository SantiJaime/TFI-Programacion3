import EspecialidadesService from "../services/especialidades.service.js";

export default class EspecialidadesController {
  constructor() {
    this.especialidadesService = new EspecialidadesService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.especialidadesService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error("Error al obtener especialidades:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error interno del servidor" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const row = await this.especialidadesService.getById(id);

      if (row.length === 0) {
        return res.status(404).send({ ok: false, msg: "Especialidad no encontrada" });
      }

      return res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      console.error("Error al obtener especialidad:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error interno del servidor" });
    }
  };

  create = async (req, res) => {
    try {
      const { nombre } = req.body;
      const result = await this.especialidadesService.create(nombre);
      res.status(201).send({
        ok: true,
        msg: "Especialidad creada con éxito",
        data: {
          id_especialidad: result.insertId,
          nombre: nombre.trim().toUpperCase(),
          activo: 1,
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).send({
          ok: false,
          msg: "Ya existe una especialidad con ese nombre",
        });
      }
      return res
        .status(500)
        .send({ ok: false, msg: "Error al crear la especialidad" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      const result = await this.especialidadesService.update(id, nombre);

      if (result.affectedRows === 0) {
        res
          .status(404)
          .send({ ok: false, msg: "Especialidad no encontrada o inactiva" });
        return;
      }

      res
        .status(200)
        .send({ ok: true, msg: "Especialidad actualizada con éxito" });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .send({ ok: false, msg: "Ese nombre ya está en uso" });
      }
      console.error("Error al actualizar:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al actualizar la especialidad" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.especialidadesService.delete(id);

      if (result.affectedRows === 0) {
        res.status(404).send({ ok: false, msg: "Especialidad no encontrada" });
        return;
      }

      res
        .status(200)
        .send({ ok: true, msg: "Especialidad eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al eliminar la especialidad" });
    }
  };
}