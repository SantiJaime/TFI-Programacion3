import EstadisticasService from "../services/estadisticas.service.js";

export default class EstadisticasController {
  constructor() {
    this.estadisticasService = new EstadisticasService();
  }

  getResumen = async (req, res) => {
    try {
      const data = await this.estadisticasService.getResumen();
      res.status(200).send({ ok: true, data });
    } catch (error) {
      res.status(500).send({ ok: false, msg: "Error interno del servidor" });
    }
  };
}