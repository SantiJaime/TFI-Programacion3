import Estadisticas from "../database/estadisticas.js";

export default class EstadisticasService {
  constructor() {
    this.estadisticas = new Estadisticas();
  }

  getResumen = async () => {
    const globales = await this.estadisticas.getGlobales();
    const porObraSocial = await this.estadisticas.getPorObraSocial();
    return {
      globales: globales[0] || {},
      porObraSocial
    };
  };
}