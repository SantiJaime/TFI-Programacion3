import { generateToken } from "../middleware/jwt.config.js";
import UsuariosService from "../services/usuarios.service.js";

export default class UsuariosController {
  constructor() {
    this.usuariosService = new UsuariosService();
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.usuariosService.getAll();
      res.status(200).send({ ok: true, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).send({ ok: false, msg: "Error al buscar los usuarios" });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const row = await this.usuariosService.getById(id);
      if (row.length === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Usuario no encontrado" });
      }
      res.status(200).send({ ok: true, data: row[0] });
    } catch (error) {
      console.error(error);
      res.status(500).send({ ok: false, msg: "Error al buscar el usuario" });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.usuariosService.create(req.body);
      res.status(201).send({
        ok: true,
        msg: "Usuario creado con éxito",
        data: { id_usuario: result.insertId, ...req.body },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .send({ ok: false, msg: "Documento o email ya registrado" });
      }
      res.status(500).send({ ok: false, msg: "Error al crear el usuario" });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.usuariosService.update(id, req.body);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Usuario no encontrado" });
      }
      res.status(200).send({ ok: true, msg: "Usuario actualizado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ ok: false, msg: "Error al actualizar el usuario" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.usuariosService.delete(id);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .send({ ok: false, msg: "Usuario no encontrado" });
      }
      res
        .status(200)
        .send({ ok: true, msg: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ ok: false, msg: "Error al eliminar el usuario" });
    }
  };

  login = async (req, res) => {
    try {
      const { email, contrasenia } = req.body;
      const user = await this.usuariosService.getByEmail(email, contrasenia);
      if (!user) {
        return res
          .status(401)
          .send({ ok: false, msg: "Credenciales incorrectas" });
      }
      
      const token = generateToken(user, process.env.JWT_SECRET);
      res.status(200).send({ ok: true, token, user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ ok: false, msg: "Error en el inicio de sesión" });
    }
  };
}
