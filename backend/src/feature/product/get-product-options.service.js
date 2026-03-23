import { getProductByIdAction } from "../../application/actions/get-product-by-id.action.js";
import { getProductOptionsAction } from "../../application/actions/get-product-options.action.js";

export async function getProductOptionsService(productId) {
  validateProductId(productId);

  const product = await getProductByIdAction(productId);

  if (!product) {
    const error = new Error("Produto não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const options = await getProductOptionsAction(productId);

  return {
    productId: product.id,
    title: product.title,
    hasSizes: product.hasSizes,
    sizes: options.sizes,
    addons: options.addons,
  };
}

function validateProductId(productId) {
  if (!Number.isInteger(productId) || productId <= 0) {
    const error = new Error("id do produto inválido.");
    error.statusCode = 400;
    throw error;
  }
}
