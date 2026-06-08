import { Router } from "express";
import { check, param } from "express-validator";
import UsuariosController from "../../controllers/usuarios.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";

const router = Router();
const usuariosController = new UsuariosController();

router.get("/", usuariosController.getAll);

router.get(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  usuariosController.getById
);

router.post(
  "/",
  [
    check("documento").trim().notEmpty().withMessage("El documento es obligatorio"),
    check("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
    check("nombres").trim().notEmpty().withMessage("El nombre es obligatorio"),
    check("email").isEmail().withMessage("El email no es válido"),
    check("contrasenia").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("rol").isInt({ min: 1 }).withMessage("El rol debe ser un entero válido"),
    validarCampos,
  ],
  usuariosController.create
);

router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"),
    check("documento").trim().notEmpty().withMessage("El documento es obligatorio"),
    check("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
    check("nombres").trim().notEmpty().withMessage("El nombre es obligatorio"),
    check("email").isEmail().withMessage("El email no es válido"),
    check("rol").isInt({ min: 1 }).withMessage("El rol debe ser un entero válido"),
    validarCampos,
  ],
  usuariosController.update
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  usuariosController.delete
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("El email no es válido"),
    check("contrasenia").notEmpty().withMessage("La contraseña es obligatoria"),
    validarCampos,
  ],
  usuariosController.login
);

export default router;