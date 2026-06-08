import { Router } from "express";
import { check, param } from "express-validator";
import TurnosReservasController from "../../controllers/turnos_reservas.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import { validarJWT, verificarRol } from "../../middleware/validarJWT.js";

const router = Router();
const turnosController = new TurnosReservasController();

// Todos los roles logueados (1, 2 y 3) pueden consultar este endpoint, pero el controlador filtrará qué ven.
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

// Crear reservas: Permitido para Pacientes (2) y Administradores (3)
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

// Modificar reservas/Atender: Permitido para Médicos (1) y Administradores (3)
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

// Cancelar reservas (Soft delete): Solo permitido para Administradores (3)
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