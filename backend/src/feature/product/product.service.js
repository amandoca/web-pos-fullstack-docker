import { getProductsAction } from '../../application/actions/get-products.action.js';

export async function getProductsService() {
  const products = await getProductsAction();

  return products.map(function mapProduct(product) {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      imageUrl: product.image_url,
      basePrice: Number(product.base_price),
      stock: product.stock,
      isAvailable: Boolean(product.is_available),
      hasSizes: Boolean(product.has_sizes),
      category: product.category,
    };
  });
}