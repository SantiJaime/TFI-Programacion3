import pool from "./database.config.js";

export default class Medicos {
  getAll = async () => {
    const [medicos] = await pool.execute("SELECT * FROM v_medicos");
    return medicos;
  };

  getById = async (id) => {
    const [medico] = await pool.execute(
      "SELECT * FROM v_medicos WHERE id_medico = ?",
      [id],
    );
    return medico;
  };

  getByEspecialidad = async (id_especialidad) => {
    const [medicos] = await pool.execute(
      "SELECT m.*, e.nombre AS especialidad, CONCAT(u.nombres, ' ', u.apellido) AS nombre FROM medicos m INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad INNER JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE m.id_especialidad = ? ",
      [id_especialidad],
    );
    return medicos;
  };

  create = async (data) => {
    const {
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    } = data;
    const [result] = await pool.execute(
      "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta],
    );
    return result;
  };

  update = async (id, data) => {
    const {
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    } = data;
    const [result] = await pool.execute(
      "UPDATE medicos SET id_usuario = ?, id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?",
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta, id],
    );
    return result;
  };

}
