import { useQuery } from "@tanstack/react-query";

import { getAddonsAction } from "../../../application/actions/catalog.actions";
import { catalogQueryKeys } from "../catalog-query-keys";

// Busca a lista completa de adicionais do catálogo.
export function useCatalogAddonsQuery() {
  return useQuery({
    queryKey: catalogQueryKeys.addonsList(),
    queryFn: getAddonsAction,
  });
}
