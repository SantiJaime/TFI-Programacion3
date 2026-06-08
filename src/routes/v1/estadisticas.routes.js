import { Router } from "express";
import EstadisticasController from "../../controllers/estadisticas.controller.js";
import { validarJWT, verificarRol } from "../../middleware/validarJWT.js";

const router = Router();
const estadisticasController = new EstadisticasController();

router.get("/", [validarJWT, verificarRol(3)], estadisticasController.getResumen);

export default router;