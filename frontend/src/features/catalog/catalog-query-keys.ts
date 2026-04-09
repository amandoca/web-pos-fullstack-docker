// Centraliza as chaves usadas pelo TanStack Query no catálogo.
export const catalogQueryKeys = {
  all() {
    return ["catalog"] as const;
  },
  products() {
    return ["products"] as const;
  },
  categories() {
    return ["categories"] as const;
  },
  paymentMethods() {
    return ["payment-methods"] as const;
  },
  addonsList() {
    return ["addons-list"] as const;
  },
  addons(productId: number) {
    return ["addons", productId] as const;
  },
  productSizes(productId: number) {
    return ["product-sizes", productId] as const;
  },
};
