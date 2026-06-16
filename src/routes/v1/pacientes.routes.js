import { Router } from "express";
import { check, param } from "express-validator";
import PacientesController from "../../controllers/pacientes.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import auth, { ROLES } from "../../middleware/auth.js";

const router = Router();
const pacientesController = new PacientesController();

router.get("/", auth(ROLES.ADMIN), pacientesController.getAll);

router.get(
  "/:id",
  auth(ROLES.ADMIN),
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  pacientesController.getById
);

router.post(
  "/",
  auth(ROLES.ADMIN),
  [
    check("id_usuario").isInt({ min: 1 }).withMessage("El id de usuario debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  pacientesController.create
);

router.put(
  "/:id",
  auth(ROLES.ADMIN),
  [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"),
    check("id_usuario").isInt({ min: 1 }).withMessage("El id de usuario debe ser un entero positivo"),
    check("id_obra_social").isInt({ min: 1 }).withMessage("El id de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  pacientesController.update
);

export default router;