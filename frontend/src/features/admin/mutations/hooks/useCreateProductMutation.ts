import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProductAction } from "../../../../application/actions/catalog.actions";
import { uploadProductImage } from "../../../../data/repositories/product-images.repository";
import type {
  CreateProductInput,
  CreateProductSubmission,
} from "../../../../domain/product/product.types";
import { catalogQueryKeys } from "../../../catalog/catalog-query-keys";

// Cria um novo produto e atualiza o cache do catálogo.
export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  async function createProduct(input: CreateProductSubmission) {
    const nextProductInput: CreateProductInput = {
      ...input.product,
      imageUrl: input.imageFile
        ? await uploadProductImage(input.imageFile)
        : "",
    };

    return createProductAction(nextProductInput);
  }

  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products() });
  }

  return useMutation({
    mutationFn: createProduct,
    onSuccess: handleSuccess,
  });
}
