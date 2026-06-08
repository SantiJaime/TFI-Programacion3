import pool from "../database/database.config.js";
import TurnosReservas from "../database/turnos_reservas.js";

export default class TurnosReservasService {
  constructor() {
    this.turnosReservas = new TurnosReservas();
  }

  getTurnosPorRol = (usuarioLogueado) => {
    const { rol, id_usuario } = usuarioLogueado;

    if (rol === 1) { // Médico: Solo ve sus turnos asignados
      return this.turnosReservas.getTurnosPropiosMedico(id_usuario);
    }
    if (rol === 2) { // Paciente: Solo ve sus reservas solicitadas
      return this.turnosReservas.getTurnosPropiosPaciente(id_usuario);
    }
    // Administrador (Rol 3): Ve absolutamente todos los turnos del sistema
    return this.turnosReservas.getAll();
  };

  getById = (id) => {
    return this.turnosReservas.getById(id);
  };

  create = async (data) => {
    const { id_medico, id_paciente, id_obra_social, fecha_hora, atentido } = data;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [medicoRows] = await connection.execute(
        "SELECT valor_consulta FROM medicos WHERE id_medico = ? AND activo = 1",
        [id_medico]
      );
      if (medicoRows.length === 0) throw new Error("El médico seleccionado no existe o está inactivo.");
      const valorConsulta = parseFloat(medicoRows[0].valor_consulta);

      const [osRows] = await connection.execute(
        "SELECT es_particular, porcentaje_descuento FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
        [id_obra_social]
      );
      if (osRows.length === 0) throw new Error("La obra social seleccionada no existe o está inactiva.");
      
      const { es_particular, porcentaje_descuento } = osRows[0];
      
      let valorFinal = valorConsulta;
      if (es_particular === 0) {
        const descuento = valorConsulta * (parseFloat(porcentaje_descuento) / 100);
        valorFinal = valorConsulta - descuento;
      }

      const [result] = await connection.execute(
        "INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido) VALUES (?, ?, ?, ?, ?, ?)",
        [id_medico, id_paciente, id_obra_social, fecha_hora, valorFinal, atentido || 0]
      );

      await connection.commit();
      return { insertId: result.insertId, valor_total: valorFinal };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  update = async (id, data) => {
    const { id_medico, id_paciente, id_obra_social, fecha_hora, atentido } = data;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [medicoRows] = await connection.execute(
        "SELECT valor_consulta FROM medicos WHERE id_medico = ? AND activo = 1",
        [id_medico]
      );
      if (medicoRows.length === 0) throw new Error("Médico no encontrado.");
      const valorConsulta = parseFloat(medicoRows[0].valor_consulta);

      const [osRows] = await connection.execute(
        "SELECT es_particular, porcentaje_descuento FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
        [id_obra_social]
      );
      if (osRows.length === 0) throw new Error("Obra social no encontrada.");
      
      const { es_particular, porcentaje_descuento } = osRows[0];
      
      let valorFinal = valorConsulta;
      if (es_particular === 0) {
        const descuento = valorConsulta * (parseFloat(porcentaje_descuento) / 100);
        valorFinal = valorConsulta - descuento;
      }

      const [result] = await connection.execute(
        "UPDATE turnos_reservas SET id_medico = ?, id_paciente = ?, id_obra_social = ?, fecha_hora = ?, valor_total = ?, atentido = ? WHERE id_turno_reserva = ? AND activo = 1",
        [id_medico, id_paciente, id_obra_social, fecha_hora, valorFinal, atentido, id]
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  delete = (id) => {
    return this.turnosReservas.delete(id);
  };
}