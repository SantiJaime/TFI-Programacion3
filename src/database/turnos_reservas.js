import pool from "./database.config.js";

export default class TurnosReservas {

  getAll = async () => {
    const [rows] = await pool.execute("SELECT * FROM turnos_reservas WHERE activo = 1");
    return rows;
  };

  getDoctorAppointments = async (id_usuario) => {
    const [rows] = await pool.execute(
      "SELECT tr.fecha_hora, tr.valor_total FROM usuarios AS u INNER JOIN medicos AS m ON m.id_usuario = u.id_usuario INNER JOIN turnos_reservas AS tr ON tr.id_medico = m.id_medico WHERE u.id_usuario = ? AND tr.activo = 1", [id_usuario]
    );
    return rows;
  };

  getPatientAppointments = async (id_usuario) => {
    const [rows] = await pool.execute(
      "SELECT tr.fecha_hora, tr.valor_total FROM usuarios as u INNER JOIN pacientes AS p ON p.id_usuario = u.id_usuario INNER JOIN turnos_reservas AS tr ON tr.id_paciente = p.id_paciente WHERE u.id_usuario = ? AND tr.activo = 1", [id_usuario]
    );
    return rows;
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

  marcarAtendido = async (id) => {
    const [result] = await pool.execute(
      `
        UPDATE turnos_reservas
        SET atentido = 1
        WHERE id_turno_reserva = ?
        AND activo = 1
      `,
      [id]
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