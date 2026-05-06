import { Router } from "express";
import { check, param } from "express-validator";
import {
  getMedicos,
  createMedico,
  updateMedico,
  deleteMedico,
} from "../../controllers/medicos.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";

const router = Router();

router.get("/", getMedicos);

router.post(
  "/",
  [
    check("id_usuario")
      .notEmpty()
      .withMessage("El id de usuario es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El id de usuario debe ser un entero positivo"),
    check("id_especialidad")
      .notEmpty()
      .withMessage("El id de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El id de especialidad debe ser un entero positivo"),
    check("matricula")
      .notEmpty()
      .withMessage("La matrícula es obligatoria")
      .isInt({ min: 1 })
      .withMessage("La matrícula debe ser un entero positivo"),
    check("descripcion")
      .optional({ nullable: true })
      .isString()
      .withMessage("La descripción debe ser texto"),
    check("valor_consulta")
      .notEmpty()
      .withMessage("El valor de consulta es obligatorio")
      .isFloat({ min: 0 })
      .withMessage("El valor de consulta debe ser un número mayor o igual a 0"),
    validarCampos,
  ],
  createMedico,
);

router.put(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de médico es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de médico debe ser un entero positivo"),
    check("id_usuario")
      .notEmpty()
      .withMessage("El id de usuario es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El id de usuario debe ser un entero positivo"),
    check("id_especialidad")
      .notEmpty()
      .withMessage("El id de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El id de especialidad debe ser un entero positivo"),
    check("matricula")
      .notEmpty()
      .withMessage("La matrícula es obligatoria")
      .isInt({ min: 1 })
      .withMessage("La matrícula debe ser un entero positivo"),
    check("descripcion")
      .optional({ nullable: true })
      .isString()
      .withMessage("La descripción debe ser texto"),
    check("valor_consulta")
      .notEmpty()
      .withMessage("El valor de consulta es obligatorio")
      .isFloat({ min: 0 })
      .withMessage("El valor de consulta debe ser un número mayor o igual a 0"),
    validarCampos,
  ],
  updateMedico,
);

router.delete(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de médico es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de médico debe ser un entero positivo"),
    validarCampos,
  ],
  deleteMedico,
);

export default router;
