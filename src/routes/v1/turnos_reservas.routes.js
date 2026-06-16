import { Router } from "express";
import { check, param } from "express-validator";
import TurnosReservasController from "../../controllers/turnos_reservas.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import auth, { ROLES } from "../../middleware/auth.js";

const router = Router();
const turnosController = new TurnosReservasController();

router.get("/", auth(ROLES.ADMIN), turnosController.getAll);
router.get("/estadisticas",  turnosController.getEstadisticas);
router.get("/reporte-pdf", auth(ROLES.ADMIN), turnosController.descargarReportePDF);

router.get(
  "/paciente/:id",
  auth(ROLES.PACIENTE),
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  turnosController.getPatientAppointments
);

router.get(
  "/medico/:id",
  auth(ROLES.MEDICO),
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  turnosController.getDoctorAppointments
);

router.post(
  "/",
  auth(ROLES.PACIENTE, ROLES.ADMIN),
  [
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").optional().isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("fecha_hora").isISO8601().withMessage("La fecha y hora debe ser un formato válido"),
    validarCampos,
  ],
  turnosController.create
);

router.put(
  "/:id",
  auth(ROLES.ADMIN),
  [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"),
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("fecha_hora").isISO8601().withMessage("La fecha y hora debe ser un formato válido (ISO8601)"),
    check("atentido").isInt({ min: 0, max: 1 }).withMessage("El campo atentido debe ser 0 o 1"),
    validarCampos,
  ],
  turnosController.update
);

router.patch(
  "/:id/atender",
  auth(ROLES.MEDICO),
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un entero positivo"),
    validarCampos,
  ],
  turnosController.marcarAtendido
);

router.delete(
  "/:id",
  auth(ROLES.ADMIN),
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  turnosController.delete
);

export default router;