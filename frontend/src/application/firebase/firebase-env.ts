import type { FirebaseOptions } from "firebase/app";

export interface FirebaseEnvironmentStatus {
  isConfigured: boolean;
  missingKeys: string[];
}

const firebaseEnvironmentEntries = [
  ["apiKey", import.meta.env.VITE_FIREBASE_API_KEY],
  ["authDomain", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN],
  ["projectId", import.meta.env.VITE_FIREBASE_PROJECT_ID],
  ["storageBucket", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET],
  ["messagingSenderId", import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID],
  ["appId", import.meta.env.VITE_FIREBASE_APP_ID],
] as const satisfies ReadonlyArray<
  readonly [keyof FirebaseOptions, string | undefined]
>;

function normalizeEnvironmentValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getFirebaseEnvironmentStatus(): FirebaseEnvironmentStatus {
  const missingKeys = firebaseEnvironmentEntries
    .filter(function filterMissingEnvironmentEntry([, value]) {
      return normalizeEnvironmentValue(value).length === 0;
    })
    .map(function mapMissingEnvironmentEntry([key]) {
      return key;
    });

  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
  };
}

export function getFirebaseOptions(): FirebaseOptions | null {
  const environmentStatus = getFirebaseEnvironmentStatus();

  if (!environmentStatus.isConfigured) {
    return null;
  }

  return {
    apiKey: normalizeEnvironmentValue(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: normalizeEnvironmentValue(
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    ),
    projectId: normalizeEnvironmentValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: normalizeEnvironmentValue(
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    ),
    messagingSenderId: normalizeEnvironmentValue(
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    ),
    appId: normalizeEnvironmentValue(import.meta.env.VITE_FIREBASE_APP_ID),
  };
}
