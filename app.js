const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet"); // Mejora de seguridad
const cors = require("cors"); // Manejo de CORS
const morgan = require("morgan"); // Logging

// Cargar variables de entorno
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const configExpress = require("./config/express");
const routes = require("./routes");

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logging de solicitudes

// Configuración de Express
configExpress(app);

// Definir rutas
routes(app);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo salió mal!" });
});

module.exports = app;
