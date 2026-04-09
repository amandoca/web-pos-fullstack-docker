import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { getFirebaseFirestore } from "../../application/firebase";
import type {
  Addon,
  Category,
  CategoryName,
  CreateProductInput,
  PaymentMethod,
  PaymentMethodName,
  Product,
  ProductSize,
  ProductSizeName,
} from "../../domain/product/product.types";

function getProductsCollectionReference() {
  return collection(getFirebaseFirestore(), "products");
}

function getProductDocumentReference(productId: number) {
  return doc(getFirebaseFirestore(), "products", String(productId));
}

function getCategoriesCollectionReference() {
  return collection(getFirebaseFirestore(), "categories");
}

function getPaymentMethodsCollectionReference() {
  return collection(getFirebaseFirestore(), "payment-methods");
}

function getAddonsCollectionReference() {
  return collection(getFirebaseFirestore(), "addons");
}

function getProductSizesCollectionReference() {
  return collection(getFirebaseFirestore(), "product-sizes");
}

function isCategoryName(value: unknown): value is CategoryName {
  return (
    value === "meats" ||
    value === "hamburgers" ||
    value === "pizzas" ||
    value === "drinks" ||
    value === "desserts" ||
    value === "snacks" ||
    value === "pasta" ||
    value === "salads"
  );
}

function isPaymentMethodName(value: unknown): value is PaymentMethodName {
  return (
    value === "cash" ||
    value === "debit_card" ||
    value === "credit_card" ||
    value === "pix"
  );
}

function isProductSizeName(value: unknown): value is ProductSizeName {
  return value === "small" || value === "medium" || value === "large";
}

function createFirestoreTimestamp(date = new Date()) {
  return Timestamp.fromDate(date);
}

function mapProductDocument(
  productDocument: QueryDocumentSnapshot<DocumentData>,
): Product | null {
  const data = productDocument.data();
  const parsedId = Number(productDocument.id);
  const productId = typeof data.id === "number" ? data.id : parsedId;

  if (
    !Number.isFinite(productId) ||
    typeof data.categoryId !== "number" ||
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    typeof data.imageUrl !== "string" ||
    typeof data.basePrice !== "number" ||
    typeof data.stock !== "number" ||
    typeof data.isAvailable !== "boolean" ||
    typeof data.hasSizes !== "boolean"
  ) {
    return null;
  }

  const addonIds = (Array.isArray(data.addonIds) ? data.addonIds : []).filter(function filterAddonId(
    addonId: unknown,
  ): addonId is number {
    return typeof addonId === "number";
  });

  return {
    addonIds,
    basePrice: data.basePrice,
    categoryId: data.categoryId,
    description: data.description,
    hasSizes: data.hasSizes,
    id: productId,
    imageUrl: data.imageUrl,
    isAvailable: data.isAvailable,
    stock: data.stock,
    title: data.title,
    barcode: typeof data.barcode === "string" ? data.barcode : undefined,
  };
}

function buildProductDocument(product: Product) {
  return {
    addonIds: product.addonIds,
    barcode: product.barcode ?? "",
    basePrice: product.basePrice,
    categoryId: product.categoryId,
    description: product.description,
    hasSizes: product.hasSizes,
    id: product.id,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    stock: product.stock,
    title: product.title,
    updatedAt: createFirestoreTimestamp(),
  };
}

function mapCategoryDocument(
  categoryDocument: QueryDocumentSnapshot<DocumentData>,
): Category | null {
  const data = categoryDocument.data();
  const parsedId = Number(categoryDocument.id);
  const categoryId = typeof data.id === "number" ? data.id : parsedId;

  if (!Number.isFinite(categoryId) || !isCategoryName(data.name)) {
    return null;
  }

  return {
    id: categoryId,
    name: data.name,
  };
}

function mapPaymentMethodDocument(
  paymentMethodDocument: QueryDocumentSnapshot<DocumentData>,
): PaymentMethod | null {
  const data = paymentMethodDocument.data();
  const parsedId = Number(paymentMethodDocument.id);
  const paymentMethodId =
    typeof data.id === "number" ? data.id : parsedId;

  if (
    !Number.isFinite(paymentMethodId) ||
    !isPaymentMethodName(data.name)
  ) {
    return null;
  }

  return {
    id: paymentMethodId,
    name: data.name,
  };
}

function mapAddonDocument(
  addonDocument: QueryDocumentSnapshot<DocumentData>,
): Addon | null {
  const data = addonDocument.data();
  const parsedId = Number(addonDocument.id);
  const addonId = typeof data.id === "number" ? data.id : parsedId;

  if (
    !Number.isFinite(addonId) ||
    typeof data.name !== "string" ||
    typeof data.price !== "number"
  ) {
    return null;
  }

  return {
    id: addonId,
    name: data.name,
    price: data.price,
  };
}

function mapProductSizeDocument(
  productSizeDocument: QueryDocumentSnapshot<DocumentData>,
): ProductSize | null {
  const data = productSizeDocument.data();
  const parsedId = Number(productSizeDocument.id);
  const productSizeId = typeof data.id === "number" ? data.id : parsedId;

  if (
    !Number.isFinite(productSizeId) ||
    typeof data.productId !== "number" ||
    !isProductSizeName(data.name) ||
    typeof data.extraPrice !== "number"
  ) {
    return null;
  }

  return {
    extraPrice: data.extraPrice,
    id: productSizeId,
    name: data.name,
    productId: data.productId,
  };
}

// Lê os produtos salvos no Firestore.
export async function getProducts(): Promise<Product[]> {
  const productCollectionSnapshot = await getDocs(getProductsCollectionReference());
  const products = productCollectionSnapshot.docs
    .map(function mapProduct(productDocument) {
      return mapProductDocument(productDocument);
    })
    .filter(function filterProduct(product): product is Product {
      return product !== null;
    });

  return products.sort(function sortProducts(leftProduct, rightProduct) {
    return leftProduct.id - rightProduct.id;
  });
}

// Salva a lista atual de produtos no Firestore.
export async function saveProducts(products: Product[]): Promise<Product[]> {
  const firestore = getFirebaseFirestore();
  const writeOperation = writeBatch(firestore);

  for (const product of products) {
    writeOperation.set(
      getProductDocumentReference(product.id),
      buildProductDocument(product),
      { merge: true },
    );
  }

  await writeOperation.commit();

  return products;
}

// Procura um produto específico pelo id.
export async function getProductById(
  productId: number,
): Promise<Product | null> {
  const productDocumentSnapshot = await getDoc(
    getProductDocumentReference(productId),
  );

  if (!productDocumentSnapshot.exists()) {
    return null;
  }

  const productDocumentData = productDocumentSnapshot.data();

  if (
    typeof productDocumentData.categoryId !== "number" ||
    typeof productDocumentData.title !== "string" ||
    typeof productDocumentData.description !== "string" ||
    typeof productDocumentData.imageUrl !== "string" ||
    typeof productDocumentData.basePrice !== "number" ||
    typeof productDocumentData.stock !== "number" ||
    typeof productDocumentData.isAvailable !== "boolean" ||
    typeof productDocumentData.hasSizes !== "boolean"
  ) {
    return null;
  }

  return {
    addonIds: (
      Array.isArray(productDocumentData.addonIds)
        ? productDocumentData.addonIds
        : []
    ).filter(function filterAddonId(
      addonId: unknown,
    ): addonId is number {
      return typeof addonId === "number";
    }),
    barcode:
      typeof productDocumentData.barcode === "string"
        ? productDocumentData.barcode
        : undefined,
    basePrice: productDocumentData.basePrice,
    categoryId: productDocumentData.categoryId,
    description: productDocumentData.description,
    hasSizes: productDocumentData.hasSizes,
    id: productId,
    imageUrl: productDocumentData.imageUrl,
    isAvailable: productDocumentData.isAvailable,
    stock: productDocumentData.stock,
    title: productDocumentData.title,
  };
}

// Cria um novo produto com o próximo id disponível.
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const products = await getProducts();
  const nextProductId =
    products.reduce(function getHighestProductId(highestId, product) {
      return Math.max(highestId, product.id);
    }, 0) + 1;
  const currentTimestamp = new Date();
  const nextProduct: Product = {
    addonIds: input.addonIds,
    barcode: input.barcode.trim() || undefined,
    basePrice: input.basePrice,
    categoryId: input.categoryId,
    description: input.description,
    hasSizes: input.hasSizes,
    id: nextProductId,
    imageUrl: input.imageUrl,
    isAvailable: input.isAvailable && input.stock > 0,
    stock: input.stock,
    title: input.title,
  };

  await setDoc(getProductDocumentReference(nextProductId), {
    ...buildProductDocument(nextProduct),
    createdAt: createFirestoreTimestamp(currentTimestamp),
  });

  return nextProduct;
}

// Lê as categorias disponíveis no catálogo.
export async function getCategories(): Promise<Category[]> {
  const categoryCollectionSnapshot = await getDocs(
    getCategoriesCollectionReference(),
  );
  const categories = categoryCollectionSnapshot.docs
    .map(function mapCategory(categoryDocument) {
      return mapCategoryDocument(categoryDocument);
    })
    .filter(function filterCategory(category): category is Category {
      return category !== null;
    });

  return categories.sort(function sortCategories(
    leftCategory,
    rightCategory,
  ) {
    return leftCategory.id - rightCategory.id;
  });
}

// Lê as formas de pagamento cadastradas.
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const paymentMethodCollectionSnapshot = await getDocs(
    getPaymentMethodsCollectionReference(),
  );
  const paymentMethods = paymentMethodCollectionSnapshot.docs
    .map(function mapPaymentMethod(paymentMethodDocument) {
      return mapPaymentMethodDocument(paymentMethodDocument);
    })
    .filter(
      function filterPaymentMethod(
        paymentMethod,
      ): paymentMethod is PaymentMethod {
        return paymentMethod !== null;
      },
    );

  return paymentMethods.sort(function sortPaymentMethods(
    leftPaymentMethod,
    rightPaymentMethod,
  ) {
    return leftPaymentMethod.id - rightPaymentMethod.id;
  });
}

// Lê os adicionais disponíveis.
export async function getAddons(): Promise<Addon[]> {
  const addonCollectionSnapshot = await getDocs(getAddonsCollectionReference());
  const addons = addonCollectionSnapshot.docs
    .map(function mapAddon(addonDocument) {
      return mapAddonDocument(addonDocument);
    })
    .filter(function filterAddon(addon): addon is Addon {
      return addon !== null;
    });

  return addons.sort(function sortAddons(leftAddon, rightAddon) {
    return leftAddon.id - rightAddon.id;
  });
}

// Lê todos os tamanhos cadastrados.
export async function getProductSizes(): Promise<ProductSize[]> {
  const productSizeCollectionSnapshot = await getDocs(
    getProductSizesCollectionReference(),
  );
  const productSizes = productSizeCollectionSnapshot.docs
    .map(function mapProductSize(productSizeDocument) {
      return mapProductSizeDocument(productSizeDocument);
    })
    .filter(function filterProductSize(
      productSize,
    ): productSize is ProductSize {
      return productSize !== null;
    });

  return productSizes.sort(function sortProductSizes(
    leftProductSize,
    rightProductSize,
  ) {
    return leftProductSize.id - rightProductSize.id;
  });
}

// Busca só os adicionais permitidos para o produto escolhido.
export async function getAllowedAddonsByProductId(
  productId: number,
): Promise<Addon[]> {
  const [products, addons] = await Promise.all([getProducts(), getAddons()]);

  const product = products.find(function findProduct(item) {
    return item.id === productId;
  });

  if (!product) {
    throw new Error("Produto não encontrado.");
  }

  return addons.filter(function filterAllowedAddon(addon) {
    return product.addonIds.includes(addon.id);
  });
}

// Busca só os tamanhos ligados ao produto escolhido.
export async function getSizesByProductId(
  productId: number,
): Promise<ProductSize[]> {
  const sizes = await getProductSizes();

  return sizes.filter(function filterSizesByProduct(size) {
    return size.productId === productId;
  });
}
