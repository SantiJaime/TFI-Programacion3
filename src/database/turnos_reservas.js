import pool from "./database.config.js";

export default class TurnosReservas {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT * FROM turnos_reservas WHERE activo = 1"
    );
    return rows;
  };

  getTurnosPropiosMedico = async (idUsuario) => {
    const [rows] = await pool.execute(
      "SELECT tr.* FROM turnos_reservas tr JOIN medicos m ON tr.id_medico = m.id_medico WHERE m.id_usuario = ? AND tr.activo = 1",
      [idUsuario]
    );
    return rows;
  };

  getTurnosPropiosPaciente = async (idUsuario) => {
    const [rows] = await pool.execute(
      "SELECT tr.* FROM turnos_reservas tr JOIN pacientes p ON tr.id_paciente = p.id_paciente WHERE p.id_usuario = ? AND tr.activo = 1",
      [idUsuario]
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

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?",
      [id]
    );
    return result;
  };
}