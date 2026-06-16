import { Router } from "express";
import { check, param } from "express-validator";
import PacientesController from "../../controllers/pacientes.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";

const router = Router();
const pacientesController = new PacientesController();

router.get("/", pacientesController.getAll);

router.get(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  pacientesController.getById
);

router.post(
  "/",
  [
    check("id_usuario").isInt({ min: 1 }).withMessage("El id de usuario debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  pacientesController.create
);

router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"),
    check("id_usuario").isInt({ min: 1 }).withMessage("El id de usuario debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  pacientesController.update
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  pacientesController.delete
);

export default router;