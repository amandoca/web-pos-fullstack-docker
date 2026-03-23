import { pool } from '../database/db.js';

export async function getProductOptionsAction(productId) {
  const [sizeRows] = await pool.execute(
    `
      SELECT
        id,
        product_id,
        name,
        extra_price
      FROM product_sizes
      WHERE product_id = ?
      ORDER BY
        CASE name
          WHEN 'small' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'large' THEN 3
          ELSE 99
        END
    `,
    [productId]
  );

  const [addonRows] = await pool.execute(
    `
      SELECT
        a.id,
        a.name,
        a.price
      FROM product_addons pa
      INNER JOIN addons a
        ON a.id = pa.addon_id
      WHERE pa.product_id = ?
      ORDER BY a.id ASC
    `,
    [productId]
  );

  return {
    sizes: sizeRows.map(function mapSize(row) {
      return {
        id: row.id,
        productId: row.product_id,
        name: row.name,
        extraPrice: Number(row.extra_price),
      };
    }),
    addons: addonRows.map(function mapAddon(row) {
      return {
        id: row.id,
        name: row.name,
        price: Number(row.price),
      };
    }),
  };
}