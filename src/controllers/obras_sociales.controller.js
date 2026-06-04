import ObrasSocialesService from "../services/obras_sociales.service.js";

export default class ObrasSocialesController {
  constructor() {
    this.obrasSocialesService = new ObrasSocialesService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.obrasSocialesService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error("Error al obtener obras sociales:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al obtener obras sociales" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const row = await this.obrasSocialesService.getById(id);

      if (row.length === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Obra social no encontrada" });
      }

      return res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      console.error("Error al obtener obra social:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al obtener obra social" });
    }
  };

  create = async (req, res) => {
    try {
      const { nombre, descripcion, porcentaje_descuento, es_particular } =
        req.body;
      const result = await this.obrasSocialesService.create({
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular,
      });

      res.status(201).send({
        ok: true,
        msg: "Obra social creada con éxito",
        data: {
          id_obra_social: result.insertId,
          nombre: nombre.trim().toUpperCase(),
          descripcion: descripcion.trim().toLowerCase(),
          porcentaje_descuento,
          es_particular: es_particular ?? 0,
          activo: 1,
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).send({
          ok: false,
          msg: "Ya existe una obra social con ese nombre o descripción",
        });
      }
      console.error("Error al crear obra social:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al crear la obra social" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, porcentaje_descuento, es_particular } =
        req.body;

      const result = await this.obrasSocialesService.update(id, {
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular,
      });

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Obra social no encontrada o inactiva" });
      }

      return res
        .status(200)
        .send({ ok: true, msg: "Obra social actualizada con éxito" });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).send({
          ok: false,
          msg: "Ese nombre o descripción ya está en uso",
        });
      }
      console.error("Error al actualizar obra social:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al actualizar la obra social" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.obrasSocialesService.delete(id);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Obra social no encontrada" });
      }

      return res
        .status(200)
        .send({ ok: true, msg: "Obra social eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar obra social:", error);
      return res
        .status(500)
        .send({ ok: false, msg: "Error al eliminar la obra social" });
    }
  };
}
