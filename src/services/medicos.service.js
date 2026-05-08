import Medicos from "../database/medicos.js";

export default class MedicosService {
  constructor() {
    this.medicos = new Medicos();
  }

  getAll = () => {
    return this.medicos.getAll();
  };

  getById = (id) => {
    return this.medicos.getById(id);
  };

  create = (data) => {
    return this.medicos.create(data);
  };

  update = (id, data) => {
    return this.medicos.update(id, data);
  };

  delete = (id) => {
    return this.medicos.delete(id);
  };
}