import MedicosObrasSocialesService from "../services/medicos_obras_sociales.service.js";

export default class MedicosObrasSocialesController {
  constructor() {
    this.mosService = new MedicosObrasSocialesService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.mosService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error interno del servidor" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const row = await this.mosService.getById(id);
      if (row.length === 0) {
        return res.status(404).send({ ok: false, msg: "Vínculo no encontrado" });
      }
      res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error interno del servidor" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.mosService.create(req.body);
      res.status(201).send({
        ok: true,
        msg: "Vínculo creado con éxito",
        data: { id_medico_obra_social: result.insertId, ...req.body },
      });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error al crear el vínculo" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.mosService.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Vínculo no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Vínculo actualizado con éxito" });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error al actualizar" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.mosService.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Vínculo no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Vínculo eliminado correctamente" });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error al eliminar" });
    }
  };
}