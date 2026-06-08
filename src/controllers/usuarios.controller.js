import UsuariosService from "../services/usuarios.service.js";

export default class UsuariosController {
  constructor() {
    this.usuariosService = new UsuariosService();
  }

  create = async (req, res) => {
    try {
      const foto_path = req.file ? `uploads/${req.file.filename}` : null;
      const data = { ...req.body, foto_path };
      const result = await this.usuariosService.create(data);
      res.status(201).send({ ok: true, data: result });
    } catch (error) {
      res.status(400).send({ ok: false, msg: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.usuariosService.login(req.body);
      res.status(200).send({ ok: true, token: result.token });
    } catch (error) {
      res.status(400).send({ ok: false, msg: error.message });
    }
  };
}