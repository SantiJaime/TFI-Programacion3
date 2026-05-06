import express from "express";
import especialidadesRoutes from "./routes/v1/especialidades.routes.js";
import medicosRoutes from "./routes/v1/medicos.routes.js";
import { testConnection } from "./database/test-connection.js";

process.loadEnvFile();
await testConnection();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/medicos", medicosRoutes);

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
