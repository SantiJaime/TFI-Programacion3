import express from "express";
import v1EspecialidadesRouter from "./routes/v1/especialidades.routes.js";
import v1MedicosRouter from "./routes/v1/medicos.routes.js";
import v1ObrasSocialesRouter from "./routes/v1/obras_sociales.routes.js";
import { testConnection } from "./database/test-connection.js";

process.loadEnvFile();
await testConnection();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ estado: true, msg: "API en funcionamiento" });
});

app.use("/api/v1/especialidades", v1EspecialidadesRouter);
app.use("/api/v1/medicos", v1MedicosRouter);
app.use("/api/v1/obras-sociales", v1ObrasSocialesRouter);

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
