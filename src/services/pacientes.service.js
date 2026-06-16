import Pacientes from "../database/pacientes.js";

export default class PacientesService {
  constructor() {
    this.pacientes = new Pacientes();
  }

  getAll = () => {
    return this.pacientes.getAll();
  };

  getById = (id) => {
    return this.pacientes.getById(id);
  };

  create = (data) => {
    return this.pacientes.create(data);
  };

  update = (id, data) => {
    return this.pacientes.update(id, data);
  };

}