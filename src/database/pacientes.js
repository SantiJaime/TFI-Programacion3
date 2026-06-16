import pool from "./database.config.js";

export default class Pacientes {
  getAll = async () => {
    const [rows] = await pool.execute("SELECT * FROM v_pacientes");
    return rows;
  };

  getById = async (id) => {
    const [row] = await pool.execute(
      "SELECT * FROM v_pacientes WHERE id_paciente = ?",
      [id]
    );
    return row;
  };

  create = async (data) => {
    const { id_usuario, id_obra_social } = data;
    const [result] = await pool.execute(
      "INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)",
      [id_usuario, id_obra_social]
    );
    return result;
  };

  update = async (id, data) => {
    const { id_usuario, id_obra_social } = data;
    const [result] = await pool.execute(
      "UPDATE pacientes SET id_usuario = ?, id_obra_social = ? WHERE id_paciente = ?",
      [id_usuario, id_obra_social, id]
    );
    return result;
  };

}