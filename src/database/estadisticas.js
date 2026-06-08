import pool from "./database.config.js";

export default class Estadisticas {
  getGlobales = async () => {
    const [rows] = await pool.execute("CALL sp_get_estadisticas_globales()");
    return rows[0];
  };

  getPorObraSocial = async () => {
    const [rows] = await pool.execute("CALL sp_get_turnos_por_obra_social()");
    return rows[0];
  };
}