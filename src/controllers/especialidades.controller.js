import pool from "../database/database.config.js";

export const getEspecialidades = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE activo = 1",
    );
    res.status(200).send({ ok: true, data: rows });
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    res.status(500).send({ ok: false, msg: "Error interno del servidor" });
  }
};

export const createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;
    const [result] = await pool.query(
      "INSERT INTO especialidades (nombre) VALUES (?)",
      [nombre.trim().toUpperCase()],
    );
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
      return res
        .status(400)
        .send({
          ok: false,
          msg: "Ya existe una especialidad con ese nombre",
        });
    }
    res
      .status(500)
      .send({ ok: false, msg: "Error al crear la especialidad" });
  }
};

export const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const [result] = await pool.query(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
      [nombre.trim().toUpperCase(), id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ ok: false, msg: "Especialidad no encontrada o inactiva" });
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
    res
      .status(500)
      .send({ ok: false, msg: "Error al actualizar la especialidad" });
  }
};

export const deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ ok: false, msg: "Especialidad no encontrada" });
    }

    res
      .status(200)
      .send({ ok: true, msg: "Especialidad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res
      .status(500)
      .send({ ok: false, msg: "Error al eliminar la especialidad" });
  }
};
