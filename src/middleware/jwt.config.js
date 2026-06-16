import jwt from "jsonwebtoken";

export const generateToken = (user, secret) => {
  const token = jwt.sign({ user }, secret);
  return token;
};

export const verifyToken = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};