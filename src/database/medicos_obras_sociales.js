import pool from "./database.config.js";

export default class MedicosObrasSociales {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT m.id_medico, m.id_obra_social, o.nombre FROM medicos_obras_sociales AS m INNER JOIN obras_sociales AS o ON m.id_obra_social = o.id_obra_social WHERE m.activo = 1",
    );
    return rows;
  };

  getById = async (id) => {
    const [row] = await pool.execute(
      "SELECT * FROM medicos_obras_sociales WHERE id_medico_obra_social = ? AND activo = 1",
      [id],
    );
    return row;
  };

  create = async ({ id_medico, obras_sociales }) => {
    const connection = await pool.getConnection();
    const data = [];
    try {
      await connection.beginTransaction();

      for (const os of obras_sociales) {
        const [result] = await connection.execute(
          "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?,?)",
          [id_medico, os.id_obra_social],
        );
        data.push({
          id_medico_obra_social: result.insertId,
          id_medico,
          id_obra_social: os.id_obra_social,
          activo: 1,
        });
      }
      await connection.commit();
      connection.release();

      return data;
    } catch (error) {
      await connection.rollback();
      connection.release();
      return false;
    }
  };

  update = async (id, data) => {
    const { id_medico, id_obra_social } = data;
    const [result] = await pool.execute(
      "UPDATE medicos_obras_sociales SET id_medico = ?, id_obra_social = ? WHERE id_medico_obra_social = ? AND activo = 1",
      [id_medico, id_obra_social, id],
    );
    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico_obra_social = ?",
      [id],
    );
    return result;
  };
}
