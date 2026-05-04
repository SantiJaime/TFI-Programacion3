import pool from "../database/database.config.js";

export const getMedicos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM medicos");
    res.status(200).send({ ok: true, data: rows });
  } catch (error) {
    console.error("Error al obtener médicos:", error);
    res.status(500).send({ ok: false, msg: "Error interno del servidor" });
  }
};

export const createMedico = async (req, res) => {
  try {
    const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } =
      req.body;

    const [result] = await pool.query(
      "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)",
      [
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      ],
    );

    res.status(201).send({
      ok: true,
      msg: "Médico creado con éxito",
      data: {
        id_medico: result.insertId,
        id_usuario,
        id_especialidad,
        matricula,
        descripcion: desc,
        valor_consulta,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).send({
        ok: false,
        msg: "Ya existe un registro con esos datos únicos (p. ej. matrícula o usuario)",
      });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).send({
        ok: false,
        msg: "El usuario o la especialidad indicados no existen",
      });
    }
    console.error("Error al crear médico:", error);
    res.status(500).send({ ok: false, msg: "Error al crear el médico" });
  }
};

export const updateMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } =
      req.body;

    const [result] = await pool.query(
      "UPDATE medicos SET id_usuario = ?, id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?",
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ ok: false, msg: "Médico no encontrado" });
    }

    res.status(200).send({ ok: true, msg: "Médico actualizado con éxito" });
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
    res
      .status(500)
      .send({ ok: false, msg: "Error al actualizar el médico" });
  }
};

export const deleteMedico = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM medicos WHERE id_medico = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ ok: false, msg: "Médico no encontrado" });
    }

    res
      .status(200)
      .send({ ok: true, msg: "Médico eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar médico:", error);
    res
      .status(500)
      .send({ ok: false, msg: "Error al eliminar el médico" });
  }
};
