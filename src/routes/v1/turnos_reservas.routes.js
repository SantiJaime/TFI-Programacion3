import { Router } from "express";
import { check, param } from "express-validator";
import TurnosReservasController from "../../controllers/turnos_reservas.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import { validarJWT, verificarRol } from "../../middleware/validarJWT.js";

const router = Router();
const turnosController = new TurnosReservasController();

router.get("/", [validarJWT], turnosController.getAll);

router.get(
  "/:id",
  [
    validarJWT,
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), 
    validarCampos
  ],
  turnosController.getById
);

router.post(
  "/",
  [
    validarJWT,
    verificarRol(2, 3),
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    check("fecha_hora").isISO8601().withMessage("La fecha y hora debe ser un formato válido (ISO8601)"),
    check("atentido").optional().isInt({ min: 0, max: 1 }).withMessage("El campo atentido debe ser 0 o 1"),
    validarCampos,
  ],
  turnosController.create
);

router.put(
  "/:id",
  [
    validarJWT,
    verificarRol(1, 3),
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"),
    check("id_medico").isInt({ min: 1 }).withMessage("El id de médico debe ser un entero positivo"),
    check("id_paciente").isInt({ min: 1 }).withMessage("El id de paciente debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    check("fecha_hora").isISO8601().withMessage("La fecha y hora debe ser un formato válido (ISO8601)"),
    check("atentido").isInt({ min: 0, max: 1 }).withMessage("El campo atentido debe ser 0 o 1"),
    validarCampos,
  ],
  turnosController.update
);

router.delete(
  "/:id",
  [
    validarJWT,
    verificarRol(3),
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), 
    validarCampos
  ],
  turnosController.delete
);

export default router;