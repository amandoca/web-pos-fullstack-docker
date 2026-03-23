import dotenv from "dotenv";

dotenv.config();

export function getEnvConfig() {
  return {
    port: Number(process.env.PORT || 3000),
    dbHost: process.env.DB_HOST || "mariadb",
    dbPort: Number(process.env.DB_PORT || 3306),
    dbName: process.env.DB_NAME || "web_pos",
    dbUser: process.env.DB_USER || "pos_user",
    dbPassword: process.env.DB_PASSWORD || "pos_password",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080",
  };
}
