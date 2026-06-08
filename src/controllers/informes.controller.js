import PDFDocument from "pdfkit";
import TurnosReservasService from "../services/turnos_reservas.service.js";

export default class InformesController {
  constructor() {
    this.turnosService = new TurnosReservasService();
  }

  generarReportePDF = async (req, res) => {
    try {
      const turnos = await this.turnosService.getTurnosPorRol({ rol: 3 });
      const doc = new PDFDocument({ margin: 50 });
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte-turnos.pdf");
      
      doc.pipe(res);

      doc.fontSize(22).text("CLÍNICA MÉDICA - REPORTE DE TURNOS", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(14).text(`Total de turnos registrados: ${turnos.length}`);
      doc.moveDown(1);

      doc.fontSize(12).text("Detalle de los turnos:", { underline: true });
      doc.moveDown(0.5);

      turnos.forEach((turno) => {
        doc.fontSize(10).text(
          `ID Turno: ${turno.id_turno_reserva} | Fecha: ${new Date(turno.fecha_hora).toLocaleString()} | Valor: $${turno.valor_total} | Atendido: ${turno.atentido === 1 ? "Sí" : "No"}`
        );
        doc.moveDown(0.3);
      });

      doc.end();
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error al generar el PDF" });
    }
  };
}