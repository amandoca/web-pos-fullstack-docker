import { pool } from '../database/db.js';

export async function getProductsAction() {
  const query = `
    SELECT
      p.id,
      p.title,
      p.description,
      p.image_url,
      p.base_price,
      p.stock,
      p.is_available,
      p.has_sizes,
      c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_available = TRUE
    ORDER BY p.id
  `;

  const [products] = await pool.execute(query);

  return products;
}