import { pool } from '../database/db.js';

export async function getProductSizeByNameAction(productId, sizeName) {
  const query = `
    SELECT
      id,
      product_id,
      name,
      extra_price
    FROM product_sizes
    WHERE product_id = ?
      AND name = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [productId, sizeName]);

  if (!rows[0]) {
    return null;
  }

  return {
    id: rows[0].id,
    productId: rows[0].product_id,
    name: rows[0].name,
    extraPrice: Number(rows[0].extra_price),
  };
}