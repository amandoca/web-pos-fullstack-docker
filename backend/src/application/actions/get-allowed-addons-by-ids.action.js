import { pool } from '../database/db.js';

export async function getAllowedAddonsByIdsAction(productId, addonIds) {
  if (!Array.isArray(addonIds) || addonIds.length === 0) {
    return [];
  }

  const placeholders = addonIds.map(function mapPlaceholder() {
    return '?';
  }).join(', ');

  const query = `
    SELECT
      a.id,
      a.name,
      a.price
    FROM product_addons pa
    INNER JOIN addons a
      ON a.id = pa.addon_id
    WHERE pa.product_id = ?
      AND pa.addon_id IN (${placeholders})
    ORDER BY a.id ASC
  `;

  const [rows] = await pool.execute(query, [productId, ...addonIds]);

  return rows.map(function mapAddon(row) {
    return {
      id: row.id,
      name: row.name,
      price: Number(row.price),
    };
  });
}