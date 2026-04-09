import { getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";

import { getFirebaseEnvironmentStatus, getFirebaseOptions } from "./firebase-env";

let firebaseApplication: FirebaseApp | null = null;

export function isFirebaseConfigured(): boolean {
  return getFirebaseEnvironmentStatus().isConfigured;
}

export function getFirebaseApplication(): FirebaseApp {
  if (firebaseApplication) {
    return firebaseApplication;
  }

  const firebaseOptions = getFirebaseOptions();

  if (!firebaseOptions) {
    const environmentStatus = getFirebaseEnvironmentStatus();

    throw new Error(
      `Firebase não configurado. Variáveis ausentes: ${environmentStatus.missingKeys.join(", ")}.`,
    );
  }

  firebaseApplication =
    getApps().length > 0 ? getApp() : initializeApp(firebaseOptions);

  return firebaseApplication;
}
