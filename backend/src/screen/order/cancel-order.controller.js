import { cancelOrderService } from '../../feature/order/cancel-order.service.js';

export async function cancelOrderController(request, response, next) {
  try {
    const orderId = Number(request.params.id);
    const result = await cancelOrderService(orderId);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}