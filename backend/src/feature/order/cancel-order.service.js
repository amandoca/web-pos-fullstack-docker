import { cancelOrderAction } from "../../application/actions/cancel-order.action.js";
import { getOrderByIdAction } from "../../application/actions/get-order-by-id.action.js";
import { getOrderItemsByOrderIdAction } from "../../application/actions/get-order-items-by-order-id.action.js";

export async function cancelOrderService(orderId) {
  validateOrderId(orderId);

  const order = await getOrderByIdAction(orderId);

  if (!order) {
    const error = new Error("Pedido não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  if (order.status === "canceled") {
    const error = new Error("Pedido já está cancelado.");
    error.statusCode = 409;
    throw error;
  }

  const items = await getOrderItemsByOrderIdAction(orderId);

  await cancelOrderAction(orderId, items);

  return {
    id: orderId,
    status: "canceled",
    message: "Pedido cancelado com sucesso.",
  };
}

function validateOrderId(orderId) {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    const error = new Error("id do pedido inválido.");
    error.statusCode = 400;
    throw error;
  }
}
