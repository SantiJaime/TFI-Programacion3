import { Router } from "express";
import InformesController from "../../controllers/informes.controller.js";
import { validarJWT, verificarRol } from "../../middleware/validarJWT.js";

const router = Router();
const informesController = new InformesController();

router.get("/pdf", [validarJWT, verificarRol(3)], informesController.generarReportePDF);

export default router;