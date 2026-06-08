import express from "express";
<<<<<<< Updated upstream
import v1EspecialidadesRouter from "./routes/v1/especialidades.routes.js";
import v1MedicosRouter from "./routes/v1/medicos.routes.js";
=======
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

import especialidadesRoutes from "./routes/v1/especialidades.routes.js";
import medicosRoutes from "./routes/v1/medicos.routes.js";
import usuariosRoutes from "./routes/v1/usuarios.routes.js";
import pacientesRoutes from "./routes/v1/pacientes.routes.js";
import medicosObrasSocialesRoutes from "./routes/v1/medicos_obras_sociales.routes.js";
import turnosReservasRoutes from "./routes/v1/turnos_reservas.routes.js";
>>>>>>> Stashed changes
import { testConnection } from "./database/test-connection.js";

process.loadEnvFile();
await testConnection();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./src/swagger.json"), "utf8")
);

app.use(express.json());

app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicos-obras-sociales", medicosObrasSocialesRoutes);
app.use("/api/turnos", turnosReservasRoutes);

<<<<<<< Updated upstream
app.use("/api/v1/especialidades", v1EspecialidadesRouter);
app.use("/api/v1/medicos", v1MedicosRouter);
=======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
>>>>>>> Stashed changes

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});