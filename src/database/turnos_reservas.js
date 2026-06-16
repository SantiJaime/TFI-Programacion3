import pool from "./database.config.js";

export default class TurnosReservas {
  getAll = async () => {
    const [rows] = await pool.execute(
      "SELECT * FROM turnos_reservas WHERE activo = 1",
    );
    return rows;
  };

  getDoctorAppointments = async (id_usuario) => {
    const [rows] = await pool.execute(
      "SELECT tr.fecha_hora, tr.valor_total FROM usuarios AS u INNER JOIN medicos AS m ON m.id_usuario = u.id_usuario INNER JOIN turnos_reservas AS tr ON tr.id_medico = m.id_medico WHERE u.id_usuario = ? AND tr.activo = 1",
      [id_usuario],
    );
    return rows;
  };

  getPatientAppointments = async (id_usuario) => {
    const [rows] = await pool.execute(
      "SELECT tr.fecha_hora, tr.valor_total FROM usuarios as u INNER JOIN pacientes AS p ON p.id_usuario = u.id_usuario INNER JOIN turnos_reservas AS tr ON tr.id_paciente = p.id_paciente WHERE u.id_usuario = ? AND tr.activo = 1",
      [id_usuario],
    );
    return rows;
  };

  getPacienteIdByUsuario = async (id_usuario) => {
    const [[row]] = await pool.execute(
      "SELECT id_paciente FROM pacientes WHERE id_usuario = ?",
      [id_usuario],
    );
    return row ? row.id_paciente : null;
  };

  create = async (data) => {
    const { id_medico, id_paciente, atentido, fecha_hora } = data;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[paciente]] = await conn.execute(
        "SELECT id_obra_social FROM pacientes WHERE id_paciente = ?",
        [id_paciente],
      );
      if (!paciente) throw new Error("Paciente no encontrado");
      const id_obra_social = paciente.id_obra_social;

      const [[medico]] = await conn.execute(
        "SELECT valor_consulta FROM medicos WHERE id_medico = ?",
        [id_medico],
      );
      const [[obraSocial]] = await conn.execute(
        "SELECT es_particular, porcentaje_descuento FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
        [id_obra_social],
      );

      if (!medico || !obraSocial)
        throw new Error(
          "Médico u Obra Social no encontrados para calcular el valor total",
        );

      const valorConsulta = parseFloat(medico.valor_consulta);
      const porcentajeDescuento = parseFloat(
        obraSocial.porcentaje_descuento || 0,
      );
      const valorCalculado =
        parseInt(obraSocial.es_particular) === 0
          ? valorConsulta - (porcentajeDescuento / 100) * valorConsulta
          : valorConsulta;

      const [result] = await conn.execute(
        "INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, ?)",
        [
          id_medico,
          id_paciente,
          id_obra_social,
          fecha_hora,
          valorCalculado,
          atentido || 0,
        ],
      );

      await conn.commit();
      return { result, valorCalculado, id_obra_social };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  };

  update = async (id, data) => {
    const { id_medico, id_paciente, atentido, fecha_hora } = data;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[paciente]] = await conn.execute(
        "SELECT id_obra_social FROM pacientes WHERE id_paciente = ?",
        [id_paciente],
      );
      if (!paciente) throw new Error("Paciente no encontrado");
      const id_obra_social = paciente.id_obra_social;

      const [[medico]] = await conn.execute(
        "SELECT valor_consulta FROM medicos WHERE id_medico = ?",
        [id_medico],
      );
      const [[obraSocial]] = await conn.execute(
        "SELECT es_particular, porcentaje_descuento FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
        [id_obra_social],
      );

      if (!medico || !obraSocial)
        throw new Error(
          "Médico u Obra Social no encontrados para calcular el valor total",
        );

      const valorConsulta = parseFloat(medico.valor_consulta);
      const porcentajeDescuento = parseFloat(
        obraSocial.porcentaje_descuento || 0,
      );
      const valorCalculado =
        parseInt(obraSocial.es_particular) === 0
          ? valorConsulta - (porcentajeDescuento / 100) * valorConsulta
          : valorConsulta;

      const [result] = await conn.execute(
        "UPDATE turnos_reservas SET id_medico = ?, id_paciente = ?, id_obra_social = ?, fecha_hora = ?, valor_total = ?, atentido = ? WHERE id_turno_reserva = ? AND activo = 1",
        [
          id_medico,
          id_paciente,
          id_obra_social,
          fecha_hora,
          valorCalculado,
          atentido,
          id,
        ],
      );

      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  };

  marcarAtendido = async (id) => {
    const [result] = await pool.execute(
      "UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ? AND activo = 1",
      [id],
    );

    return result;
  };

  delete = async (id) => {
    const [result] = await pool.execute(
      "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?",
      [id],
    );
    return result;
  };

  getEstadisticas = async () => {
    const [rows] = await pool.execute("CALL ObtenerEstadisticasAtenciones()");
    return rows[0];
  };

  getReporteDatos = async () => {
    const [rows] = await pool.execute("CALL ObtenerReporteDatos()");
    return rows[0];
  };
}
