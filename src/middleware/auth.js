import { verifyToken } from "./jwt.config.js";

export const ROLES = {
  MEDICO: 1,
  PACIENTE: 2,
  ADMIN: 3,
};

export default function auth(...authorizedRoles) {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        req.user = null;
        return res.status(401).send({
          ok: false,
          msg: "No autorizado",
        });
      }

      const verify = verifyToken(token, process.env.JWT_SECRET);
      if (!verify) {
        req.user = null;
        return res.status(401).send({
          ok: false,
          msg: "No autorizado",
        });
      }
      req.user = verify.user;
      if (!authorizedRoles.includes(req.user.rol)) {
        return res.status(403).send({
          ok: false,
          msg: "Acceso denegado",
        });
      }

      next();
    } catch (error) {
      console.error("Error al validar token:", error);
      return res.status(500).send({ ok: false, msg: "Error al validar token" });
    }
  };
}
