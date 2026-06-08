import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import especialidadesRoutes from "./routes/v1/especialidades.routes.js";
import medicosRoutes from "./routes/v1/medicos.routes.js";
import usuariosRoutes from "./routes/v1/usuarios.routes.js";
import pacientesRoutes from "./routes/v1/pacientes.routes.js";
import medicosObrasSocialesRoutes from "./routes/v1/medicos_obras_sociales.routes.js";
import turnosReservasRoutes from "./routes/v1/turnos_reservas.routes.js";
import estadisticasRoutes from "./routes/v1/estadisticas.routes.js";
import informesRoutes from "./routes/v1/informes.routes.js";
import { testConnection } from "./database/test-connection.js";

process.loadEnvFile();
await testConnection();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./src/swagger.json"), "utf8")
);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicos-obras-sociales", medicosObrasSocialesRoutes);
app.use("/api/turnos", turnosReservasRoutes);
app.use("/api/estadisticas", estadisticasRoutes);
app.use("/api/informes", informesRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});