import pool from "./database.config.js";

export default class Especialidades {
  getAll = async () => {
    const [especialidades] = await pool.execute(
      "SELECT * FROM especialidades WHERE activo = 1",
    );
    return especialidades;
  };
  getById = async (id_especialidad) => {
    const [especialidad] = await pool.execute(
      "SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id_especialidad],
    );
    return especialidad;
  };
  create = async (nombre) => {
    const [result] = await pool.execute(
      "INSERT INTO especialidades (nombre) VALUES (?)",
      [nombre.trim().toUpperCase()],
    );
    return result;
  };
  update = async (id_especialidad, nombre) => {
    const [result] = await pool.execute(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
      [nombre.trim().toUpperCase(), id_especialidad],
    );
    return result;
  };
  delete = async (id_especialidad) => {
    const [result] = await pool.execute(
      "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?",
      [id_especialidad],
    );
    return result;
  };
}
