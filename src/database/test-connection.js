import pool from "./database.config.js";

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a la base de datos establecida correctamente");
    connection.release();
  } catch (error) {
    console.log("Error al conectar a la base de datos:", error);
    console.error({
      ok: false,
      msg: error.message,
    });
  }
}
