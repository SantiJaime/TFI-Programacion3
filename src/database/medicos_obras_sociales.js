import pool from "./database.config.js";

export default class MedicosObrasSociales {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT * FROM medicos_obras_sociales WHERE activo = 1"
    );
    return rows;
  };

  getById = async (id) => {
    const [row] = await pool.execute(
      "SELECT * FROM medicos_obras_sociales WHERE id_medico_obra_social = ? AND activo = 1",
      [id]
    );
    return row;
  };

  create = async (data) => {
    const { id_medico, id_obra_social } = data;
    const [result] = await pool.execute(
      "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)",
      [id_medico, id_obra_social]
    );
    return result;
  };

  update = async (id, data) => {
    const { id_medico, id_obra_social } = data;
    const [result] = await pool.execute(
      "UPDATE medicos_obras_sociales SET id_medico = ?, id_obra_social = ? WHERE id_medico_obra_social = ? AND activo = 1",
      [id_medico, id_obra_social, id]
    );
    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico_obra_social = ?",
      [id]
    );
    return result;
  };
}