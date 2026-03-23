import { getProductsService } from '../../feature/product/product.service.js';

export async function getProductsController(request, response, next) {
  try {
    const products = await getProductsService();
    return response.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}