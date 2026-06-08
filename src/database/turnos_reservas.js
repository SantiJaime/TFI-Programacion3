import pool from "./database.config.js";

export default class TurnosReservas {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT * FROM turnos_reservas WHERE activo = 1"
    );
    return rows;
  };

  getById = async (id) => {
    const [row] = await pool.execute(
      "SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1",
      [id]
    );
    return row;
  };

  create = async (data) => {
    const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido } = data;
    const [result] = await pool.execute(
      "INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, ?)",
      [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido || 0]
    );
    return result;
  };

  update = async (id, data) => {
    const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido } = data;
    const [result] = await pool.execute(
      "UPDATE turnos_reservas SET id_medico = ?, id_paciente = ?, id_obra_social = ?, fecha_hora = ?, valor_total = ?, atentido = ? WHERE id_turno_reserva = ? AND activo = 1",
      [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, id]
    );
    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?",
      [id]
    );
    return result;
  };
}