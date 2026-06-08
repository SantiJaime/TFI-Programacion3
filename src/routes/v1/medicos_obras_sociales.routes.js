import { Router } from "express";
import { check, param } from "express-validator";
import MedicosObrasSocialesController from "../../controllers/medicos_obras_sociales.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";

const router = Router();
const mosController = new MedicosObrasSocialesController();

router.get("/", mosController.getAll);

router.get(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un entero positivo"),
    validarCampos,
  ],
  mosController.getById,
);

router.post(
  "/",
  [
    check("id_medico")
      .isInt({ min: 1 })
      .withMessage("El id de médico debe ser un entero positivo"),
    check("obras_sociales")
      .isArray({ min: 1 })
      .withMessage("El campo debe ser un arreglo y no estar vacío"),
    check("obras_sociales.*.id_obra_social")
      .isInt({ min: 1 })
      .withMessage("El id de obra social debe ser un entero positivo"),
    check("obras_sociales.*.nombre")
      .isString()
      .withMessage("El nombre debe ser un texto")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío"),
    validarCampos,
  ],
  mosController.create,
);

router.put(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un entero positivo"),
    check("id_medico")
      .isInt({ min: 1 })
      .withMessage("El id de médico debe ser un entero positivo"),
    check("id_obra_social")
      .isInt({ min: 1 })
      .withMessage("El id de obra social debe ser un entero positivo"),
    validarCampos,
  ],
  mosController.update,
);

router.delete(
  "/:id",
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un entero positivo"),
    validarCampos,
  ],
  mosController.delete,
);

export default router;
