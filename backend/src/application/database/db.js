import mysql from 'mysql2/promise';
import { getEnvConfig } from '../config/env.js';

const env = getEnvConfig();

export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
});