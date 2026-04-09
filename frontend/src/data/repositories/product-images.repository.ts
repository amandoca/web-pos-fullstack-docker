import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { getFirebaseStorage } from "../../application/firebase";

function normalizeFileName(fileName: string): string {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");
}

// Envia a imagem do produto para o Firebase Storage e devolve a URL pública.
export async function uploadProductImage(file: File): Promise<string> {
  const normalizedFileName = normalizeFileName(file.name);
  const storageReference = ref(
    getFirebaseStorage(),
    `products/${Date.now()}-${normalizedFileName}`,
  );

  await uploadBytes(storageReference, file, {
    contentType: file.type || "application/octet-stream",
  });

  return getDownloadURL(storageReference);
}
