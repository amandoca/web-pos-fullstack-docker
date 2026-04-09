export interface FirebaseAuthorizationConfig {
  adminEmails: string[];
  hasRoleConfiguration: boolean;
  operatorEmails: string[];
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseEmailList(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map(function mapEmail(rawEmail) {
      return normalizeEmail(rawEmail);
    })
    .filter(function filterEmail(email) {
      return email.length > 0;
    });
}

export function getFirebaseAuthorizationConfig(): FirebaseAuthorizationConfig {
  const adminEmails = parseEmailList(import.meta.env.VITE_FIREBASE_ADMIN_EMAILS);
  const operatorEmails = parseEmailList(
    import.meta.env.VITE_FIREBASE_OPERATOR_EMAILS,
  );

  return {
    adminEmails,
    hasRoleConfiguration: adminEmails.length > 0 || operatorEmails.length > 0,
    operatorEmails,
  };
}

export function resolveFirebaseUserRole(
  email: string | null,
): "ADMINISTRADOR" | "OPERADOR" | null {
  if (!email) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);
  const authorizationConfig = getFirebaseAuthorizationConfig();

  if (authorizationConfig.adminEmails.includes(normalizedEmail)) {
    return "ADMINISTRADOR";
  }

  if (authorizationConfig.operatorEmails.includes(normalizedEmail)) {
    return "OPERADOR";
  }

  return null;
}
