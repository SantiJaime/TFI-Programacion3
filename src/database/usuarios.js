import pool from "./database.config.js";

export default class Usuarios {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE activo = 1"
    );
    return rows;
  };

  getById = async (id) => {
    const [row] = await pool.execute(
      "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE id_usuario = ? AND activo = 1",
      [id]
    );
    return row;
  };

  getByEmail = async (email) => {
    const [row] = await pool.execute(
      "SELECT * FROM usuarios WHERE email = ? AND activo = 1",
      [email]
    );
    return row;
  };

  create = async (data) => {
    const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = data;
    const [result] = await pool.execute(
      "INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [documento, apellido, nombres, email, contrasenia, foto_path || "", rol]
    );
    return result;
  };

  update = async (id, data) => {
    const { documento, apellido, nombres, email, foto_path, rol } = data;
    const [result] = await pool.execute(
      "UPDATE usuarios SET documento = ?, apellido = ?, nombres = ?, email = ?, foto_path = ?, rol = ? WHERE id_usuario = ? AND activo = 1",
      [documento, apellido, nombres, email, foto_path || "", rol, id]
    );
    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?",
      [id]
    );
    return result;
  };
}