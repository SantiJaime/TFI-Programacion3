import { Router } from "express";
import { check, param } from "express-validator";
import TurnosReservasController from "../../controllers/turnos_reservas.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import auth, { ROLES } from "../../middleware/auth.js";

const router = Router();
const turnosController = new TurnosReservasController();

router.get("/", auth(ROLES.ADMIN), turnosController.getAll);
router.get("/estadisticas", auth(ROLES.ADMIN), turnosController.getEstadisticas);
router.get("/reporte-pdf", auth(ROLES.ADMIN), turnosController.descargarReportePDF);

router.get("/paciente", auth(ROLES.PACIENTE), turnosController.getPatientAppointments);

router.get("/medico", auth(ROLES.MEDICO), turnosController.getDoctorAppointments);

router.post(
  "/",
  auth(ROLES.PACIENTE, ROLES.ADMIN),
  [
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").optional().isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("fecha_hora")
      .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).withMessage("La fecha y hora debe tener el formato YYYY-MM-DD HH:MM:SS")
      .custom((val) => {
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        if (new Date(val) < hoy) throw new Error("La fecha del turno no puede ser anterior a hoy");
        return true;
      }),
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
    check("fecha_hora")
      .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).withMessage("La fecha y hora debe tener el formato YYYY-MM-DD HH:MM:SS")
      .custom((val) => {
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        if (new Date(val) < hoy) throw new Error("La fecha del turno no puede ser anterior a hoy");
        return true;
      }),
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