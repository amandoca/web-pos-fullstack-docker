import { useCatalogAddonsQuery } from "../queries/useCatalogAddonsQuery";

// Entrega os adicionais já prontos para consumo na tela.
export function useCatalogAddons() {
  const query = useCatalogAddonsQuery();

  return {
    addons: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
