import type { FirebaseError } from "firebase/app";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

import {
  createGoogleAuthProvider,
  getFirebaseAuth,
  resolveFirebaseUserRole,
} from "../../application/firebase";
import type { User, UserRole } from "../../domain/auth/auth.types";
import {
  getUserProfileDocument,
  saveUserProfileDocument,
  type UserProfileDocument,
} from "./users.repository";

const UNAUTHORIZED_ACCOUNT_MESSAGE =
  "Sua conta Google não esta autorizada para acessar o sistema.";
const INACTIVE_ACCOUNT_MESSAGE =
  "Seu usuario esta inativo no sistema. Procure um administrador.";

function buildStableNumericUserId(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) % 2147483647;
  }

  return Math.max(hash, 1);
}

function getUserDisplayName(firebaseUser: FirebaseUser): string {
  if (firebaseUser.displayName?.trim()) {
    return firebaseUser.displayName.trim();
  }

  if (firebaseUser.email?.trim()) {
    return firebaseUser.email.trim();
  }

  return "Usuario Google";
}

function createUnauthorizedAccountError(): Error {
  return new Error(UNAUTHORIZED_ACCOUNT_MESSAGE);
}

function createInactiveAccountError(): Error {
  return new Error(INACTIVE_ACCOUNT_MESSAGE);
}

function mapFirebaseErrorToMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Nao foi possivel autenticar com Google.";
  }

  const firebaseError = error as FirebaseError;

  switch (firebaseError.code) {
    case "auth/popup-closed-by-user":
      return "O login com Google foi cancelado antes da conclusão.";
    case "auth/popup-blocked":
      return "O navegador bloqueou a janela de login com Google.";
    case "auth/cancelled-popup-request":
      return "Uma tentativa de login substituiu a anterior. Tente novamente.";
    case "auth/operation-not-allowed":
      return "O login com Google nao esta habilitado no projeto Firebase.";
    case "auth/unauthorized-domain":
      return "Este dominio nao esta autorizado no Firebase Authentication.";
    case "permission-denied":
      return "O Firestore recusou o acesso aos dados do usuario.";
    case "unavailable":
      return "O Firestore esta indisponivel no momento.";
    default:
      return error.message || "Nao foi possivel autenticar com Google.";
  }
}

function mapFirebaseUserToSessionUser(
  firebaseUser: FirebaseUser,
  role: UserRole,
): User {
  const email = firebaseUser.email?.trim().toLowerCase() ?? "";

  return {
    email,
    id: buildStableNumericUserId(firebaseUser.uid),
    isActive: true,
    name: getUserDisplayName(firebaseUser),
    role,
    username: email,
  };
}

function resolveAuthorizedUserRole(
  firebaseUser: FirebaseUser,
  existingUserProfile: UserProfileDocument | null,
): UserRole {
  if (existingUserProfile) {
    return existingUserProfile.role;
  }

  const email = firebaseUser.email?.trim().toLowerCase() ?? "";
  const bootstrapRole = resolveFirebaseUserRole(email);

  if (!bootstrapRole) {
    throw createUnauthorizedAccountError();
  }

  return bootstrapRole;
}

async function syncUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  const currentTimestamp = new Date().toISOString();
  const existingUserProfile = await getUserProfileDocument(firebaseUser.uid);
  const role = resolveAuthorizedUserRole(firebaseUser, existingUserProfile);
  const sessionUser = mapFirebaseUserToSessionUser(firebaseUser, role);
  const isActive = existingUserProfile?.isActive ?? sessionUser.isActive;

  if (!isActive) {
    throw createInactiveAccountError();
  }

  const userProfile = {
    ...sessionUser,
    createdAt: existingUserProfile?.createdAt ?? currentTimestamp,
    firebaseUid: firebaseUser.uid,
    isActive,
    updatedAt: currentTimestamp,
  };

  await saveUserProfileDocument(userProfile);

  return {
    ...sessionUser,
    isActive,
  };
}

async function signOutUnauthorizedUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

async function buildSessionFromFirebaseUser(
  firebaseUser: FirebaseUser | null,
): Promise<User | null> {
  if (!firebaseUser) {
    return null;
  }

  try {
    return syncUserProfile(firebaseUser);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === UNAUTHORIZED_ACCOUNT_MESSAGE ||
        error.message === INACTIVE_ACCOUNT_MESSAGE)
    ) {
      await signOutUnauthorizedUser();
    }

    throw error;
  }
}

async function waitForResolvedAuthState(): Promise<FirebaseUser | null> {
  const firebaseAuth = getFirebaseAuth();

  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser;
  }

  return new Promise(function handleAuthState(resolve, reject) {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      function resolveCurrentUser(user) {
        unsubscribe();
        resolve(user);
      },
      function rejectCurrentUser(error) {
        unsubscribe();
        reject(error);
      },
    );
  });
}

// Faz login com Google, valida o perfil permitido e devolve a sessao da aplicacao.
export async function login(): Promise<User> {
  try {
    const firebaseAuth = getFirebaseAuth();
    const googleAuthProvider = createGoogleAuthProvider();
    const authenticationResult = await signInWithPopup(
      firebaseAuth,
      googleAuthProvider,
    );
    const sessionUser = await buildSessionFromFirebaseUser(
      authenticationResult.user,
    );

    if (!sessionUser) {
      throw new Error("Nao foi possivel identificar o usuario autenticado.");
    }

    return sessionUser;
  } catch (error) {
    throw new Error(mapFirebaseErrorToMessage(error));
  }
}

// Encerra a sessao autenticada no Firebase.
export async function logout(): Promise<void> {
  await signOut(getFirebaseAuth());
}

// Restaura a sessao persistida pelo Firebase Authentication.
export async function getSession(): Promise<User | null> {
  try {
    const firebaseUser = await waitForResolvedAuthState();

    return buildSessionFromFirebaseUser(firebaseUser);
  } catch (error) {
    throw new Error(mapFirebaseErrorToMessage(error));
  }
}
