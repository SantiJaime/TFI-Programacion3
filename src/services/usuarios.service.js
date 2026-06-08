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

  create = (data) => {
    const hash = crypto.createHash("sha256").update(data.contrasenia).digest("hex");
    return this.usuarios.create({ ...data, contrasenia: hash });
  };

  update = (id, data) => {
    return this.usuarios.update(id, data);
  };

  delete = (id) => {
    return this.usuarios.delete(id);
  };

  login = async (email, contrasenia) => {
    const rows = await this.usuarios.getByEmail(email);
    if (rows.length === 0) return null;

    const usuario = rows[0];
    const hash = crypto.createHash("sha256").update(contrasenia).digest("hex");
    if (hash !== usuario.contrasenia) return null;

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "4h" }
    );

    delete usuario.contrasenia;
    return { usuario, token };
  };
}