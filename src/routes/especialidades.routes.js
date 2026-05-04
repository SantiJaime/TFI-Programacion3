import { Router } from "express";
import { check, param } from "express-validator";
import {
  getEspecialidades,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from "../controllers/especialidades.controller.js";
import { validarCampos } from "../middleware/validarCampos.js";

const router = Router();

router.get("/", getEspecialidades);

router.post(
  "/",
  [
    check("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    validarCampos,
  ],
  createEspecialidad,
);

router.put(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de especialidad debe ser un entero positivo"),
    check("nombre")
      .trim()
      .notEmpty()
      .withMessage("El nuevo nombre es obligatorio")
      .isLength({ min: 2, max: 100 })
      .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    validarCampos,
  ],
  updateEspecialidad,
);

router.delete(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de especialidad debe ser un entero positivo"),
    validarCampos,
  ],
  deleteEspecialidad,
);

export default router;
