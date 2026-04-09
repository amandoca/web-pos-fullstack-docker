export type UserStorageResource = "cart";

const STORAGE_PREFIX = "web-pos";

// Monta a chave de recursos que pertencem a um usuário específico.
export function getUserStorageKey(
  userId: number,
  resource: UserStorageResource,
): string {
  return `${STORAGE_PREFIX}:user:${userId}:${resource}`;
}
