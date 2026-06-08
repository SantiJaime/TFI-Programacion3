import { Router } from "express";
import { check } from "express-validator";
import UsuariosController from "../../controllers/usuarios.controller.js";
import { validarCampos } from "../../middleware/validarCampos.js";
import { upload } from "../../middleware/upload.js";

const router = Router();
const usuariosController = new UsuariosController();

router.post(
  "/",
  upload.single("foto"),
  [
    check("documento").notEmpty().withMessage("El documento es obligatorio"),
    check("apellido").notEmpty().withMessage("El apellido es obligatorio"),
    check("nombres").notEmpty().withMessage("El nombre es obligatorio"),
    check("email").isEmail().withMessage("Email no válido"),
    check("contrasenia").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("rol").isInt({ min: 1, max: 3 }).withMessage("Rol no válido"),
    validarCampos
  ],
  usuariosController.create
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Email no válido"),
    check("contrasenia").notEmpty().withMessage("La contraseña es obligatoria"),
    validarCampos
  ],
  usuariosController.login
);

export default router;