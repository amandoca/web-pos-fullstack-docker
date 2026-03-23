import { createOrderService } from '../../feature/order/order.service.js';

export async function createOrderController(request, response, next) {
  try {
    const createdOrder = await createOrderService(request.body);
    return response.status(201).json(createdOrder);
  } catch (error) {
    return next(error);
  }
}