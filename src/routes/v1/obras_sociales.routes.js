import { Router } from "express";
import { check, param } from "express-validator";
import { validarCampos } from "../../middleware/validarCampos.js";
import ObrasSocialesController from "../../controllers/obras_sociales.controller.js";
import auth, { ROLES } from "../../middleware/auth.js";

const router = Router();
const obrasSocialesController = new ObrasSocialesController();

router.get("/", auth(ROLES.ADMIN), obrasSocialesController.getAll);

router.get(
  "/:id",
  auth(ROLES.ADMIN),
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de obra social es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  obrasSocialesController.getById,
);

router.post(
  "/",
  auth(ROLES.ADMIN),
  [
    check("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    check("descripcion")
      .trim()
      .notEmpty()
      .withMessage("La descripción es obligatoria")
      .isLength({ min: 2, max: 10 })
      .withMessage("La descripción debe tener entre 2 y 10 caracteres"),
    check("porcentaje_descuento")
      .notEmpty()
      .withMessage("El porcentaje de descuento es obligatorio")
      .isFloat({ min: 0, max: 100 })
      .withMessage("El porcentaje debe ser un número entre 0 y 100"),
    check("es_particular")
      .optional()
      .isIn([0, 1])
      .withMessage("es_particular debe ser 0 o 1"),
    validarCampos,
  ],
  obrasSocialesController.create,
);

router.put(
  "/:id",
  auth(ROLES.ADMIN),
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de obra social es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de obra social debe ser un entero positivo"),
    check("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    check("descripcion")
      .trim()
      .notEmpty()
      .withMessage("La descripción es obligatoria")
      .isLength({ min: 2, max: 10 })
      .withMessage("La descripción debe tener entre 2 y 10 caracteres"),
    check("porcentaje_descuento")
      .notEmpty()
      .withMessage("El porcentaje de descuento es obligatorio")
      .isFloat({ min: 0, max: 100 })
      .withMessage("El porcentaje debe ser un número entre 0 y 100"),
    check("es_particular")
      .optional()
      .isIn([0, 1])
      .withMessage("es_particular debe ser 0 o 1"),
    validarCampos,
  ],
  obrasSocialesController.update,
);

router.delete(
  "/:id",
  auth(ROLES.ADMIN),
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de obra social es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  obrasSocialesController.delete,
);

export default router;
