import TurnosReservasService from "../services/turnos_reservas.service.js";
import PDFDocument from "pdfkit";

export default class TurnosReservasController {
  constructor() {
    this.turnosService = new TurnosReservasService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.turnosService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error("Error en getAll TurnosReservas:", error);
      res.status(500).send({ ok: false, msg: "Error al obtener el listado de turnos" });
    }
  };

  getDoctorAppointments = async (req, res) => {
    try {
      const { id } = req.params;
      const rows = await this.turnosService.getDoctorAppointments(id);
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Turnos del médico no encontrados" });
      }
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(`Error en getDoctorAppointments (Médico ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar los turnos del médico" });
    }
  };

  getPatientAppointments = async (req, res) => {
    try {
      const { id } = req.params;
      const rows = await this.turnosService.getPatientAppointments(id);
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Turnos del paciente no encontrados" });
      }
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(`Error en getPatientAppointments (Paciente ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar los turnos del paciente" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.turnosService.create(req.body);
      
     
      const [nuevoTurno] = await this.turnosService.getAll(); 
      const valorCalculado = nuevoTurno ? nuevoTurno.valor_total : undefined;

      res.status(201).send({
        ok: true,
        msg: "Turno reservado con éxito",
        data: { 
          id_turno_reserva: result.insertId, 
          ...req.body,
          valor_total: valorCalculado 
        },
      });
    } catch (error) {
      console.error("Error en create TurnosReservas:", error);
      res.status(500).send({ ok: false, msg: "Error al procesar la reserva del turno" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.turnosService.update(id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Turno no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Turno actualizado con éxito" });
    } catch (error) {
      console.error(`Error en update TurnosReservas (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al intentar modificar el turno" });
    }
  };

  marcarAtendido = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.turnosService.marcarAtendido(id);

      if (result.affectedRows === 0) {
        return res.status(404).send({
          ok: false,
          msg: "Turno no encontrado",
        });
      }

      res.status(200).send({
        ok: true,
        msg: "Turno marcado como atendido",
      });
    } catch (error) {
      console.error(`Error al marcar turno como atendido (ID: ${req.params.id}):`, error);
      res.status(500).send({
        ok: false,
        msg: "Error al marcar el turno como atendido",
      });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.turnosService.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).send({ ok: false, msg: "Turno no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Turno cancelado correctamente" });
    } catch (error) {
      console.error(`Error en delete TurnosReservas (ID: ${req.params.id}):`, error);
      res.status(500).send({ ok: false, msg: "Error al intentar cancelar el turno" });
    }
  };

  getEstadisticas = async (req, res) => {
    try {
      const stats = await this.turnosService.getEstadisticas();
      res.status(200).send({ ok: true, data: stats });
    } catch (error) {
      console.error("Error en getEstadisticas Controller:", error);
      res.status(500).send({ ok: false, msg: "Error al generar las estadísticas de atenciones" });
    }
  };

  
  descargarReportePDF = async (req, res) => {
    try {
      const turnos = await this.turnosService.getReporteDatos();

      const doc = new PDFDocument({ margin: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte-turnos.pdf");

      doc.pipe(res);

      doc.fontSize(20).text("API CLINICA MEDICA", { align: "center" });
      doc.fontSize(14).text("Informe General de Turnos y Auditoria", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(11).text(`Cantidad Total de Turnos Activos: ${turnos.length}`);
      doc.moveDown(1);

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      turnos.forEach((turno, index) => {
        const fecha = new Date(turno.fecha_hora).toLocaleString("es-AR");
        doc.fontSize(10).text(
          `${index + 1}. Fecha: ${fecha} | Obra Social: ${turno.obra_social_nombre} | Total Facturado: $${turno.valor_total}`
        );
        doc.moveDown(0.5);
      });

      doc.end();

    } catch (error) {
      console.error("Error al generar PDF:", error);
      res.status(500).send({ ok: false, msg: "Error al generar el informe en PDF" });
    }
  };
}