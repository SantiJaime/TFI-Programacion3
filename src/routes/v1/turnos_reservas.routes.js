import { Router } from "express";
import { check, param } from "express-validator";
import TurnosReservasController from "../../controllers/turnos_reservas.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";

const router = Router();
const turnosController = new TurnosReservasController();

router.get("/", turnosController.getAll);

router.get(
  "/paciente/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  turnosController.getPatientAppointments
);
router.get(
  "/medico/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  turnosController.getDoctorAppointments
);

router.post(
  "/",
  [
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    check("fecha_hora").isISO8601().withMessage("La fecha y hora debe ser un formato válido (ISO8601)"),
    check("valor_total").isFloat({ min: 0 }).withMessage("El valor total debe ser mayor o igual a 0"),
    check("atentido").isInt({ min: 0, max: 1 }).withMessage("El campo atentido debe ser 0 o 1"),
    validarCampos,
  ],
  turnosController.create
);

router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"),
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    check("fecha_hora").isISO8601().withMessage("La fecha y hora debe ser un formato válido (ISO8601)"),
    check("valor_total").isFloat({ min: 0 }).withMessage("El valor total debe ser mayor o igual a 0"),
    check("atentido").isInt({ min: 0, max: 1 }).withMessage("El campo atentido debe ser 0 o 1"),
    validarCampos,
  ],
  turnosController.update
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  turnosController.delete
);

export default router;