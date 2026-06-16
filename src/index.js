import express from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import v1EspecialidadesRouter from "./routes/v1/especialidades.routes.js";
import v1MedicosRouter from "./routes/v1/medicos.routes.js";
import v1ObrasSocialesRouter from "./routes/v1/obras_sociales.routes.js";
import v1UsuariosRouter from "./routes/v1/usuarios.routes.js";
import v1PacientesRouter from "./routes/v1/pacientes.routes.js";
import v1MedicosObrasSocialesRouter from "./routes/v1/medicos_obras_sociales.routes.js";
import v1TurnosReservasRouter from "./routes/v1/turnos_reservas.routes.js";
import { testConnection } from "./database/test-connection.js";
import morgan from "morgan";

process.loadEnvFile();
await testConnection();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./src/swagger.json"), "utf8"),
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send({ "ok": true, msg: "API en funcionamiento" });
});

app.use("/api/v1/especialidades", v1EspecialidadesRouter);
app.use("/api/v1/medicos", v1MedicosRouter);
app.use("/api/v1/obras-sociales", v1ObrasSocialesRouter);
app.use("/api/v1/usuarios", v1UsuariosRouter);
app.use("/api/v1/pacientes", v1PacientesRouter);
app.use("/api/v1/medicos-obras-sociales", v1MedicosObrasSocialesRouter);
app.use("/api/v1/turnos", v1TurnosReservasRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
