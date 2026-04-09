import type { User } from "../../domain/auth/auth.types";
import {
  getSession,
  login,
  logout,
} from "../../data/repositories/auth.repository";

// Encaminha a tentativa de login para a camada de dados.
export async function loginAction(): Promise<User> {
  return login();
}

// Executa a saída da sessão atual.
export async function logoutAction(): Promise<void> {
  return logout();
}

// Tenta restaurar a sessão salva no navegador.
export async function getSessionAction(): Promise<User | null> {
  return getSession();
}
