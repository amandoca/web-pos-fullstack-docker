import cors from "cors";
import express from "express";
import { router } from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", function health(request, response) {
  return response.status(200).json({ ok: true });
});

app.use("/api", router);

app.use(function notFoundHandler(request, response) {
  return response.status(404).json({
    message: "Rota não encontrada.",
  });
});

app.use(function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;

  return response.status(statusCode).json({
    message: error.message || "Erro interno do servidor.",
    details: error.details || [],
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function onListen() {
  console.log(`Backend running on port ${PORT}`);
});
