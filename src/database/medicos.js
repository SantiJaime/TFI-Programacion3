import pool from "./database.config.js";

export default class Medicos {
  getAll = async () => {
    const [medicos] = await pool.execute("SELECT * FROM medicos");
    return medicos;
  };

  getById = async (id) => {
    const [medico] = await pool.execute(
      "SELECT * FROM medicos WHERE id_medico = ?",
      [id]
    );
    return medico;
  };

  create = async (data) => {
    const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = data;
    const [result] = await pool.execute(
      "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]
    );
    return result;
  };

  update = async (id, data) => {
    const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = data;
    const [result] = await pool.execute(
      "UPDATE medicos SET id_usuario = ?, id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?",
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta, id]
    );
    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "DELETE FROM medicos WHERE id_medico = ?",
      [id]
    );
    return {
      deleted: result.affectedRows > 0,
      affectedRows: result.affectedRows,
    };
  };
}