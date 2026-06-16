import { Router } from "express";
import { check, param } from "express-validator";
import UsuariosController from "../../controllers/usuarios.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import auth, { ROLES } from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";

const router = Router();
const usuariosController = new UsuariosController();

router.get("/", auth(ROLES.ADMIN), usuariosController.getAll);

router.get(
  "/:id",
  auth(ROLES.ADMIN),
  [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo"), validarCampos],
  usuariosController.getById
);

router.post(
  "/",
  auth(ROLES.ADMIN),
  upload.single("foto"),
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
  auth(ROLES.ADMIN),
  upload.single("foto"),
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

router.patch(
  "/reset-password",
  auth(ROLES.MEDICO, ROLES.PACIENTE, ROLES.ADMIN),
  [
    check("contrasenia_actual").notEmpty().withMessage("La contraseña actual es obligatoria"),
    check("contrasenia_nueva").isLength({ min: 6 }).withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
    validarCampos,
  ],
  usuariosController.resetPassword
);

router.delete(
  "/:id",
  auth(ROLES.ADMIN),
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