import Usuarios from "../database/usuarios.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default class UsuariosService {
  constructor() {
    this.usuarios = new Usuarios();
  }

  getAll = () => {
    return this.usuarios.getAll();
  };

  getById = (id) => {
    return this.usuarios.getById(id);
  };

  getByEmail = (email, contrasenia) => {
    return this.usuarios.getByEmail(email, contrasenia);
  };

  create = (data) => {
    return this.usuarios.create(data);
  };

  update = (id, data) => {
    return this.usuarios.update(id, data);
  };

  delete = (id) => {
    return this.usuarios.delete(id);
  };

  resetPassword = (id, contraseniaActual, contraseniaNueva) => {
    return this.usuarios.resetPassword(id, contraseniaActual, contraseniaNueva);
  };
}