import MedicosObrasSociales from "../database/medicos_obras_sociales.js";

export default class MedicosObrasSocialesService {
  constructor() {
    this.medicosObrasSociales = new MedicosObrasSociales();
  }

  getAll = () => {
    return this.medicosObrasSociales.getAll();
  };

  getById = (id) => {
    return this.medicosObrasSociales.getById(id);
  };

  create = (data) => {
    return this.medicosObrasSociales.create(data);
  };

  update = (id, data) => {
    return this.medicosObrasSociales.update(id, data);
  };

  delete = (id) => {
    return this.medicosObrasSociales.delete(id);
  };
}