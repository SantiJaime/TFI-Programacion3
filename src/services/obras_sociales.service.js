import ObrasSociales from "../database/obras_sociales.js";

export default class ObrasSocialesService {
  constructor() {
    this.obrasSociales = new ObrasSociales();
  }

  getAll = () => {
    return this.obrasSociales.getAll();
  };

  getById = (id_obra_social) => {
    return this.obrasSociales.getById(id_obra_social);
  };

  create = (data) => {
    return this.obrasSociales.create(data);
  };

  update = (id_obra_social, data) => {
    return this.obrasSociales.update(id_obra_social, data);
  };

  delete = (id_obra_social) => {
    return this.obrasSociales.delete(id_obra_social);
  };
}
