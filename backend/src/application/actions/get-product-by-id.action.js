import { pool } from '../database/db.js';

export async function getProductByIdAction(productId) {
  const query = `
    SELECT
      id,
      title,
      description,
      image_url,
      base_price,
      stock,
      is_available,
      has_sizes,
      category_id
    FROM products
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [productId]);

  if (!rows[0]) {
    return null;
  }

  return {
    id: rows[0].id,
    title: rows[0].title,
    description: rows[0].description,
    imageUrl: rows[0].image_url,
    basePrice: Number(rows[0].base_price),
    stock: rows[0].stock,
    isAvailable: Boolean(rows[0].is_available),
    hasSizes: Boolean(rows[0].has_sizes),
    categoryId: rows[0].category_id,
  };
}