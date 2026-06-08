import pool from "./database.config.js";

export default class Usuarios {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT u.id_usuario, CONCAT(u.nombres, ' ', u.apellido) as usuario, u.rol, u.email, u.foto_path AS foto, u.activo FROM usuarios AS u WHERE u.activo = 1",
    );
    return rows;
  };

  getById = async (id) => {
    const [row] = await pool.execute(
      "SELECT u.id_usuario, CONCAT(u.nombres, ' ', u.apellido) as usuario, u.rol, u.email, u.foto_path AS foto, u.activo FROM usuarios AS u WHERE u.id_usuario = ? AND u.activo = 1",
      [id],
    );
    return row;
  };

  getByEmail = async (email, contrasenia) => {
    const [row] = await pool.execute(
      "SELECT u.id_usuario, CONCAT(u.nombres, ' ', u.apellido) as usuario, u.rol FROM usuarios AS u WHERE u.email = ? AND u.contrasenia = SHA2(?, 256) AND u.activo = 1",
      [email, contrasenia],
    );
    return row[0];
  };

  create = async (data) => {
    const { documento, apellido, nombres, email, contrasenia, foto_path, rol } =
      data;
    const [result] = await pool.execute(
      "INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol) VALUES (?, ?, ?, ?, SHA2(?, 256), ?, ?)",
      [documento, apellido, nombres, email, contrasenia, foto_path || "", rol],
    );
    return result;
  };

  update = async (id, data) => {
    const { documento, apellido, nombres, email, foto_path, rol } = data;
    const [result] = await pool.execute(
      "UPDATE usuarios SET documento = ?, apellido = ?, nombres = ?, email = ?, foto_path = ?, rol = ? WHERE id_usuario = ? AND activo = 1",
      [documento, apellido, nombres, email, foto_path || "", rol, id],
    );
    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?",
      [id],
    );
    return result;
  };
}
