import jwt from "jsonwebtoken";

export const validarJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({
      ok: false,
      msg: "No hay token en la petición. Acceso denegado.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).send({
      ok: false,
      msg: "Token no válido o expirado.",
    });
  }
};

export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(500).send({
        ok: false,
        msg: "Se está intentando verificar un rol sin validar el token JWT primero.",
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).send({
        ok: false,
        msg: "No tenés los permisos necesarios para realizar esta acción.",
      });
    }

    next();
  };
};