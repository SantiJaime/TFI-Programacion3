import TurnosReservasService from "../services/turnos_reservas.service.js";
import { ROLES } from "../middleware/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, "../templates/reporte-turnos.hbs");
const templateSource = fs.readFileSync(templatePath, "utf-8");
const template = Handlebars.compile(templateSource);

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
      const id = req.user.id_usuario;
      const rows = await this.turnosService.getDoctorAppointments(id);
      if (rows.length === 0) {
        return res.status(404).send({ ok: false, msg: "Turnos del médico no encontrados" });
      }
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(`Error en getDoctorAppointments (Usuario ID: ${req.user.id_usuario}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar los turnos del médico" });
    }
  };

  getPatientAppointments = async (req, res) => {
    try {
      const id = req.user.id_usuario;
      const rows = await this.turnosService.getPatientAppointments(id);
      if (rows.length === 0) {
        return res.status(404).send({ ok: false, msg: "Turnos del paciente no encontrados" });
      }
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(`Error en getPatientAppointments (Usuario ID: ${req.user.id_usuario}):`, error);
      res.status(500).send({ ok: false, msg: "Error al buscar los turnos del paciente" });
    }
  };

  create = async (req, res) => {
    try {
      let id_paciente = req.body.id_paciente;

      if (req.user.rol === ROLES.PACIENTE) {
        id_paciente = await this.turnosService.getPacienteIdByUsuario(req.user.id_usuario);
        if (!id_paciente) {
          return res.status(404).send({ ok: false, msg: "No se encontró el paciente asociado al usuario" });
        }
      } else if (!id_paciente) {
        return res.status(400).send({ ok: false, msg: "El id de paciente es obligatorio" });
      }

      const { result, valorCalculado, id_obra_social } = await this.turnosService.create({ ...req.body, id_paciente });
      const { id_medico, fecha_hora } = req.body;

      res.status(201).send({
        ok: true,
        msg: "Turno reservado con éxito",
        data: {
          id_turno_reserva: result.insertId,
          id_medico,
          id_paciente,
          id_obra_social,
          fecha_hora,
          valor_total: valorCalculado,
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
    let browser;
    try {
      const rows = await this.turnosService.getReporteDatos();
      console.log(rows)
      const atendidos = rows.filter(t => t.atentido === 1).length;
      const facturacionTotal = rows.reduce((sum, t) => sum + parseFloat(t.valor_total || 0), 0).toFixed(2);

      const html = template({
        fechaEmision: new Date().toLocaleString("es-AR"),
        anio: new Date().getFullYear(),
        totalTurnos: rows.length,
        atendidos,
        pendientes: rows.length - atendidos,
        facturacionTotal,
        turnos: rows.map((t) => ({
          numero: t.id_turno_reserva,
          fecha: new Date(t.fecha_hora).toLocaleString("es-AR"),
          paciente: t.paciente_nombre,
          medico: t.medico_nombre,
          especialidad: t.especialidad_nombre,
          obra_social: t.obra_social_nombre,
          valor_total: parseFloat(t.valor_total).toFixed(2),
          atendido: t.atentido === 1,
        })),
      });

      browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" } });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte-turnos.pdf");
      res.send(pdf);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      res.status(500).send({ ok: false, msg: "Error al generar el informe en PDF" });
    } finally {
      if (browser) await browser.close();
    }
  };
}