import { Router } from "express";
import { check, param } from "express-validator";
import { validarCampos } from "../../middleware/validarCampos.js";
import EspecialidadesController from "../../controllers/especialidades.controller.js";
import auth, { ROLES } from "../../middleware/auth.js";

const router = Router();
const especialidadesController = new EspecialidadesController()

router.get("/", auth(ROLES.PACIENTE, ROLES.ADMIN), especialidadesController.getAll);

router.get(
  "/:id",
  auth(ROLES.PACIENTE, ROLES.ADMIN),
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de especialidad debe ser un entero positivo"),
    validarCampos,
  ],
  especialidadesController.getById,
);

router.post(
  "/",
  auth(ROLES.ADMIN),
  [
    check("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    validarCampos,
  ],
  especialidadesController.create,
);

router.put(
  "/:id",
  auth(ROLES.ADMIN),
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
  especialidadesController.update,
);

router.delete(
  "/:id",
  auth(ROLES.ADMIN),
  [
    param("id")
      .notEmpty()
      .withMessage("El ID de especialidad es obligatorio")
      .isInt({ min: 1 })
      .withMessage("El ID de especialidad debe ser un entero positivo"),
    validarCampos,
  ],
  especialidadesController.delete,
);

export default router;
