import { getAuth, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

import { getFirebaseApplication } from "./firebase-app";

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApplication());
}

export function createGoogleAuthProvider(): GoogleAuthProvider {
  const googleAuthProvider = new GoogleAuthProvider();

  googleAuthProvider.setCustomParameters({
    prompt: "select_account",
  });

  return googleAuthProvider;
}

export function getFirebaseFirestore(): Firestore {
  return getFirestore(getFirebaseApplication());
}

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApplication());
}
