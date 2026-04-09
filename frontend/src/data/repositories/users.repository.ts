import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";

import { getFirebaseFirestore } from "../../application/firebase";
import type { User, UserRole } from "../../domain/auth/auth.types";

export interface UserProfileDocument extends User {
  createdAt: string;
  firebaseUid: string;
  updatedAt: string;
}

function getUserDocumentReference(
  firebaseUid: string,
): DocumentReference<DocumentData> {
  return doc(getFirebaseFirestore(), "users", firebaseUid);
}

function isUserRole(value: unknown): value is UserRole {
  return value === "ADMINISTRADOR" || value === "OPERADOR";
}

function mapFirestoreDate(value: unknown): string | null {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

function createFirestoreTimestamp(value: string): Timestamp {
  return Timestamp.fromDate(new Date(value));
}

function mapUserProfileDocument(
  firebaseUid: string,
  data: DocumentData | undefined,
): UserProfileDocument | null {
  if (!data) {
    return null;
  }

  if (
    typeof data.email !== "string" ||
    typeof data.id !== "number" ||
    typeof data.isActive !== "boolean" ||
    typeof data.name !== "string" ||
    !isUserRole(data.role) ||
    typeof data.username !== "string"
  ) {
    return null;
  }

  return {
    createdAt:
      mapFirestoreDate(data.createdAt) ?? new Date().toISOString(),
    email: data.email,
    firebaseUid,
    id: data.id,
    isActive: data.isActive,
    name: data.name,
    role: data.role,
    updatedAt:
      mapFirestoreDate(data.updatedAt) ?? new Date().toISOString(),
    username: data.username,
  };
}

export async function getUserProfileDocument(
  firebaseUid: string,
): Promise<UserProfileDocument | null> {
  const userDocumentSnapshot = await getDoc(getUserDocumentReference(firebaseUid));

  if (!userDocumentSnapshot.exists()) {
    return null;
  }

  return mapUserProfileDocument(firebaseUid, userDocumentSnapshot.data());
}

export async function saveUserProfileDocument(
  userProfile: UserProfileDocument,
): Promise<UserProfileDocument> {
  await setDoc(getUserDocumentReference(userProfile.firebaseUid), {
    ...userProfile,
    createdAt: createFirestoreTimestamp(userProfile.createdAt),
    updatedAt: createFirestoreTimestamp(userProfile.updatedAt),
  });

  return userProfile;
}
