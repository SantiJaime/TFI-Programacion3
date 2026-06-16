import { Router } from "express";
import { check, param } from "express-validator";
import MedicosController from "../../controllers/medicos.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import auth, { ROLES } from "../../middleware/auth.js";

const router = Router();
const medicosController = new MedicosController();

router.get("/", auth(ROLES.PACIENTE, ROLES.ADMIN), medicosController.getAll);

router.get(
  "/especialidad/:id_especialidad",
  auth(ROLES.PACIENTE, ROLES.ADMIN),
  [
    param("id_especialidad")
      .notEmpty()
      .withMessage("El ID de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de especialidad debe ser un entero positivo"),
    validarCampos,
  ],
  medicosController.getByEspecialidad,
);

router.get(
  "/:id_medico",
  auth(ROLES.PACIENTE, ROLES.ADMIN),
  [
    param("id_medico")
      .notEmpty()
      .withMessage("El ID de médico es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de médico debe ser un entero positivo"),
    validarCampos,
  ],
  medicosController.getById,
);

router.post(
  "/",
  auth(ROLES.ADMIN),
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
  medicosController.create,
);

router.put(
  "/:id_medico",
  auth(ROLES.ADMIN),
  [
    param("id_medico")
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
  medicosController.update,
);

export default router;
