import type { CreateProductSubmission } from "../../../../domain/product/product.types";
import { useCancelOrderMutation } from "./useCancelOrderMutation";
import { useCreateProductMutation } from "./useCreateProductMutation";
import { useUpdateProductAvailabilityMutation } from "./useUpdateProductAvailabilityMutation";
import { useUpdateProductStockMutation } from "./useUpdateProductStockMutation";

// Reúne as mutações usadas pela tela de admin.
export function useAdminMutations() {
  const createProductMutation = useCreateProductMutation();
  const updateProductStockMutation = useUpdateProductStockMutation();
  const updateProductAvailabilityMutation =
    useUpdateProductAvailabilityMutation();
  const cancelOrderMutation = useCancelOrderMutation();

  // Cria um novo produto no catálogo.
  async function createProduct(input: CreateProductSubmission) {
    await createProductMutation.mutateAsync(input);
  }

  // Atualiza o estoque e espera a mutation terminar para a tela reagir.
  async function updateStock(productId: number, stock: number) {
    await updateProductStockMutation.mutateAsync({ productId, stock });
  }

  // Atualiza a disponibilidade do produto.
  async function updateAvailability(productId: number, isAvailable: boolean) {
    await updateProductAvailabilityMutation.mutateAsync({
      productId,
      isAvailable,
    });
  }

  // Cancela um pedido e devolve o estoque.
  async function cancelOrder(orderId: number, userId: number) {
    await cancelOrderMutation.mutateAsync({ orderId, userId });
  }

  return {
    createProduct,
    updateStock,
    updateAvailability,
    cancelOrder,
    isCreatingProduct: createProductMutation.isPending,
    isCancelingOrder: cancelOrderMutation.isPending,
  };
}
