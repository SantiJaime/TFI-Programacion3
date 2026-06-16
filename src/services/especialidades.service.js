import Especialidades from "../database/especialidades.js";

export default class EspecialidadesService {
  constructor() {
    this.especialidades = new Especialidades();
  }

  getAll = () => {
    return this.especialidades.getAll();
  };

  getById = (id_especialidad) => {
    return this.especialidades.getById(id_especialidad);
  };

  create = (nombre) => {
    return this.especialidades.create(nombre);
  };

  update = (id_especialidad, nombre) => {
    return this.especialidades.update(id_especialidad, nombre);
  };
  
  delete = (id_especialidad) => {
    return this.especialidades.delete(id_especialidad);
  };
}
