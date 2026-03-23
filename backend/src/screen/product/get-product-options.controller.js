import { getProductOptionsService } from '../../feature/product/get-product-options.service.js';

export async function getProductOptionsController(request, response, next) {
  try {
    const productId = Number(request.params.id);
    const result = await getProductOptionsService(productId);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}