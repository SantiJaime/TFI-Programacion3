import pool from "./database.config.js";

export default class ObrasSociales {
  getAll = async () => {
    const [obrasSociales] = await pool.execute(
      "SELECT * FROM obras_sociales WHERE activo = 1",
    );
    return obrasSociales;
  };

  getById = async (id_obra_social) => {
    const [obraSocial] = await pool.execute(
      "SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
      [id_obra_social],
    );
    return obraSocial;
  };

  create = async (data) => {
    const { nombre, descripcion, porcentaje_descuento, es_particular } = data;
    const [result] = await pool.execute(
      "INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)",
      [
        nombre.trim().toUpperCase(),
        descripcion.trim().toLowerCase(),
        porcentaje_descuento,
        es_particular ?? 0,
      ],
    );
    return result;
  };

  update = async (id_obra_social, data) => {
    const { nombre, descripcion, porcentaje_descuento, es_particular } = data;
    const [result] = await pool.execute(
      "UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1",
      [
        nombre.trim().toUpperCase(),
        descripcion.trim().toLowerCase(),
        porcentaje_descuento,
        es_particular ?? 0,
        id_obra_social,
      ],
    );
    return result;
  };

  delete = async (id_obra_social) => {
    const [result] = await pool.execute(
      "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?",
      [id_obra_social],
    );
    return result;
  };
}
