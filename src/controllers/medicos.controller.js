import MedicosService from "../services/medicos.service.js";

export default class MedicosController {
  constructor() {
    this.medicosService = new MedicosService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.medicosService.getAll();
      
      return res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error("Error al obtener médicos:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al obtener los médicos" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id_medico } = req.params;
      const row = await this.medicosService.getById(id_medico);

      return res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      console.error("Error al obtener el médico:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al obtener los médicos" });
    }
  };

  create = async (req, res) => {
    try {
      const {
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      } = req.body;
      const result = await this.medicosService.create({
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      });

      return res.status(201).send({
        ok: true,
        msg: "Médico creado con éxito",
        data: {
          id_medico: result.insertId,
          id_usuario,
          id_especialidad,
          matricula,
          descripcion,
          valor_consulta,
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).send({
          ok: false,
          msg: "Ya existe un registro con esos datos únicos (matrícula o usuario)",
        });
      }
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).send({
          ok: false,
          msg: "El usuario o la especialidad indicados no existen",
        });
      }
      console.error("Error al crear médico:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al crear el médico" });
    }
  };

  update = async (req, res) => {
    try {
      const { id_medico } = req.params;
      const {
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      } = req.body;
      const result = await this.medicosService.update(id_medico, {
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      });

      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Médico no encontrado" });
      }

      return res
        .status(200)
        .send({ ok: true, msg: "Médico actualizado con éxito" });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .send({ ok: false, msg: "Ese dato único ya está en uso" });
      }
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).send({
          ok: false,
          msg: "El usuario o la especialidad indicados no existen",
        });
      }
      console.error("Error al actualizar médico:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al actualizar el médico" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id_medico } = req.params;
      const result = await this.medicosService.delete(id_medico);

      if (!result.deleted) {
        return res.status(404).send({ ok: false, msg: "Médico no encontrado" });
      }

      return res
        .status(200)
        .send({ ok: true, msg: "Médico eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar médico:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al eliminar el médico" });
    }
  };
}
