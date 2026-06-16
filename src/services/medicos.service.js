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

  getByEspecialidad = (id_especialidad) => {
    return this.medicos.getByEspecialidad(id_especialidad);
  };

  create = (data) => {
    return this.medicos.create(data);
  };

  update = (id, data) => {
    return this.medicos.update(id, data);
  };

}