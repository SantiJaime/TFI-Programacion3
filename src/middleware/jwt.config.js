import jwt from "jsonwebtoken";

export const generateToken = (user, secret) => {
  const token = jwt.sign({ user }, secret);
  return token;
};
