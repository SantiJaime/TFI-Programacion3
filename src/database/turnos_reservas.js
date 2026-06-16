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
    const { id_medico, id_paciente, id_obra_social, fecha_hora, atentido } = data;

    const [medicoRows] = await pool.execute("SELECT valor_consulta FROM medicos WHERE id_medico = ?", [id_medico]);
    const [osRows] = await pool.execute("SELECT es_particular, porcentaje_descuento FROM obras_sociales WHERE id_obra_social = ?", [id_obra_social]);

    if (medicoRows.length === 0 || osRows.length === 0) {
      throw new Error("Médico u Obra Social no encontrados para calcular el valor total");
    }

    const valorConsulta = parseFloat(medicoRows[0].valor_consulta);
    const esParticular = parseInt(osRows[0].es_particular);
    const porcentajeDescuento = parseFloat(osRows[0].porcentaje_descuento || 0);

    let valorCalculado = valorConsulta;
    if (esParticular === 0) {
      valorCalculado = valorConsulta - (porcentajeDescuento * valorConsulta);
    }

    const [result] = await pool.execute(
      "INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, ?)",
      [id_medico, id_paciente, id_obra_social, fecha_hora, valorCalculado, atentido || 0]
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

  getEstadisticas = async () => {
    const [rows] = await pool.execute("CALL ObtenerEstadisticasAtenciones()");
    return rows[0]; 
  };

  getReporteDatos = async () => {
    const query = `
      SELECT 
        tr.id_turno_reserva,
        tr.fecha_hora,
        tr.valor_total,
        os.nombre AS obra_social_nombre
      FROM turnos_reservas tr
      INNER JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
      WHERE tr.activo = 1
      ORDER BY tr.fecha_hora DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  };
}