import { useState } from "react";

import type { CreateProductSubmission } from "../../domain/product/product.types";
import type { Order } from "../../domain/order/order.types";
import { useAdminCatalog } from "../../features/admin/catalog/hooks/useAdminCatalog";
import { useAdminMutations } from "../../features/admin/mutations/hooks/useAdminMutations";
import { useAdminOrders } from "../../features/admin/orders/hooks/useAdminOrders";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useFeedback } from "../../shared/hooks/useFeedback";

type AdminTab = "products" | "create-product" | "orders";

// Reúne o estado e as ações da tela administrativa.
export function useAdminScreen() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(
    null,
  );
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<
    number | null
  >(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] =
    useState<Order | null>(null);

  const { currentUser, logout } = useAuth();
  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useAdminCatalog();
  const {
    orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useAdminOrders();
  const {
    createProduct,
    updateStock,
    updateAvailability,
    cancelOrder,
    isCancelingOrder,
    isCreatingProduct,
  } = useAdminMutations();
  const { feedbackMessage, feedbackType, showFeedback } = useFeedback();

  const isProductsTab = activeTab === "products";
  const isCreateProductTab = activeTab === "create-product";
  const isOrdersTab = activeTab === "orders";
  const sectionTitle = isProductsTab
    ? "Produtos"
    : isCreateProductTab
      ? "Cadastrar produto"
      : "Pedidos";
  const sectionDescription = isProductsTab
    ? "Atualize estoque e disponibilidade sem perder o contexto visual dos itens."
    : isCreateProductTab
      ? "Preencha os dados básicos do novo produto."
      : "Acompanhe os pedidos recentes e execute cancelamentos.";
  const isLoading = isProductsTab
    ? isLoadingProducts
    : isOrdersTab
      ? isLoadingOrders
      : false;
  const isError = isProductsTab
    ? isErrorProducts
    : isOrdersTab
      ? isErrorOrders
      : false;

  // Troca a aba principal entre produtos e pedidos.
  function handleSelectTab(tab: AdminTab) {
    setActiveTab(tab);
  }

  // Atualiza o estoque e mostra feedback visual na própria tela.
  async function handleUpdateStock(productId: number, stock: number) {
    try {
      // Guardamos o id para mostrar loading só no item em edição.
      setUpdatingProductId(productId);
      await updateStock(productId, stock);
      showFeedback("Estoque atualizado com sucesso.", "success");
    } catch {
      showFeedback("Erro ao atualizar estoque.", "error");
    } finally {
      setUpdatingProductId(null);
    }
  }

  // Atualiza a disponibilidade do produto e devolve feedback para a UI.
  async function handleUpdateAvailability(
    productId: number,
    isAvailable: boolean,
  ) {
    try {
      // Guardamos o id para bloquear apenas o switch ativo.
      setUpdatingAvailabilityId(productId);
      await updateAvailability(productId, isAvailable);
      showFeedback("Disponibilidade atualizada com sucesso.", "success");
    } catch {
      showFeedback("Erro ao atualizar disponibilidade.", "error");
    } finally {
      setUpdatingAvailabilityId(null);
    }
  }

  // Cadastra um novo produto e devolve feedback para a UI.
  async function handleCreateProduct(input: CreateProductSubmission) {
    try {
      await createProduct(input);
      showFeedback("Produto cadastrado com sucesso.", "success");
    } catch {
      showFeedback("Erro ao cadastrar produto.", "error");
      throw new Error("Não foi possível cadastrar o produto.");
    }
  }

  // Abre o diálogo de cancelamento com o pedido escolhido.
  function handleOpenCancelOrder(order: Order) {
    setSelectedOrderForCancel(order);
  }

  // Fecha o diálogo sem cancelar o pedido.
  function handleCloseCancelOrder() {
    setSelectedOrderForCancel(null);
  }

  // Confirma o cancelamento e mostra o resultado para o admin.
  async function handleConfirmCancelOrder() {
    if (!selectedOrderForCancel || !currentUser) return;

    try {
      // O user id é usado para registrar quem executou o cancelamento.
      await cancelOrder(selectedOrderForCancel.id, currentUser.id);
      showFeedback("Pedido cancelado com sucesso.", "success");
    } catch {
      showFeedback("Erro ao cancelar pedido.", "error");
    } finally {
      setSelectedOrderForCancel(null);
    }
  }

  return {
    activeTab,
    handleSelectTab,
    products,
    orders,
    sectionTitle,
    sectionDescription,
    isProductsTab,
    isCreateProductTab,
    isOrdersTab,
    isLoading,
    isError,
    isCreatingProduct,
    updatingProductId,
    updatingAvailabilityId,
    isCancelingOrder,
    selectedOrderForCancel,
    feedbackMessage,
    feedbackType,
    handleCreateProduct,
    handleUpdateStock,
    handleUpdateAvailability,
    handleOpenCancelOrder,
    handleCloseCancelOrder,
    handleConfirmCancelOrder,
    logout,
  };
}
